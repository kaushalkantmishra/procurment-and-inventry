import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, AlertTriangle, Eye, RefreshCw, TrendingUp, TrendingDown } from 'lucide-react';
import { DataTable } from '../../../components/ui/DataTable';
import { Button } from '../../../components/ui/Button';
import { Modal } from '../../../components/ui/Modal';
import { Textarea } from '../../../components/ui/Textarea';
import { Badge } from '../../../components/ui/Badge';
import { apiService } from '../../../services/api';

export const ThreeWayMatching: React.FC = () => {
  const [matchingData, setMatchingData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [viewingMatch, setViewingMatch] = useState<any | null>(null);
  const [matchDetails, setMatchDetails] = useState<any | null>(null);
  const [autoMatching, setAutoMatching] = useState(false);

  useEffect(() => {
    fetchMatchingData();
  }, []);

  const fetchMatchingData = async () => {
    try {
      setLoading(true);
      const response = await apiService.getThreeWayMatching();
      const data = Array.isArray(response?.data) ? response.data : Array.isArray(response) ? response : [];
      setMatchingData(data);
    } catch (error) {
      console.error('Failed to fetch matching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewMatch = async (match: any) => {
    try {
      // Fetch detailed information for PO, GRN, and Invoice
      const promises = [];
      
      // Always fetch PO details
      if (match.po_line_id) {
        promises.push(apiService.getPOLinesByPOId(match.po_line_id));
      } else {
        promises.push(Promise.resolve(null));
      }
      
      // Fetch GRN details if available
      if (match.grn_detail_id) {
        promises.push(apiService.getGRNById(match.grn_detail_id));
      } else {
        promises.push(Promise.resolve(null));
      }
      
      // Fetch Invoice details if available
      if (match.invoice_line_id) {
        promises.push(apiService.getVendorInvoiceById(match.invoice_line_id));
      } else {
        promises.push(Promise.resolve(null));
      }

      const [poResponse, grnResponse, invoiceResponse] = await Promise.all(promises);

      setMatchDetails({
        match,
        po: poResponse?.data || poResponse,
        grn: grnResponse?.data || grnResponse,
        invoice: invoiceResponse?.data || invoiceResponse
      });
      setViewingMatch(match);
    } catch (error) {
      console.error('Failed to fetch match details:', error);
      // Still show the match even if details fail to load
      setMatchDetails({
        match,
        po: null,
        grn: null,
        invoice: null
      });
      setViewingMatch(match);
    }
  };

  const handleApproveMatch = async (matchId: number, remarks: string) => {
    try {
      await apiService.updateThreeWayMatch(matchId, {
        match_status: 'APPROVED',
        variance_reason: remarks,
        matched_by: 'USER001',
        matched_at: new Date().toISOString()
      });
      await fetchMatchingData();
      setViewingMatch(null);
      setMatchDetails(null);
    } catch (error) {
      console.error('Failed to approve match:', error);
    }
  };

  const handleRejectMatch = async (matchId: number, remarks: string) => {
    try {
      await apiService.updateThreeWayMatch(matchId, {
        match_status: 'REJECTED',
        variance_reason: remarks,
        matched_by: 'USER001',
        matched_at: new Date().toISOString()
      });
      await fetchMatchingData();
      setViewingMatch(null);
      setMatchDetails(null);
    } catch (error) {
      console.error('Failed to reject match:', error);
    }
  };

  const handleAutoMatch = async () => {
    try {
      setAutoMatching(true);
      // This would trigger automatic matching for unmatched invoices
      await apiService.createAutomaticThreeWayMatch({
        autoMatchAll: true
      });
      await fetchMatchingData();
      alert('Automatic matching completed!');
    } catch (error) {
      console.error('Failed to run auto-matching:', error);
      alert('Auto-matching failed. Please try again.');
    } finally {
      setAutoMatching(false);
    }
  };

  const getMatchStatusVariant = (status: string) => {
    switch (status) {
      case 'APPROVED': return 'success';
      case 'REJECTED': return 'danger';
      case 'PENDING': return 'warning';
      case 'VARIANCE': return 'danger';
      default: return 'default';
    }
  };

  const getVarianceLevel = (quantityVariance: number, priceVariance: number) => {
    const totalVariance = Math.abs(quantityVariance) + Math.abs(priceVariance);
    if (totalVariance === 0) return 'none';
    if (totalVariance < 100) return 'low';
    if (totalVariance < 500) return 'medium';
    return 'high';
  };

  const columns = [
    { key: 'id', header: 'Match ID', sortable: true },
    { key: 'po_line_id', header: 'PO Line', sortable: true },
    {
      key: 'quantity_variance',
      header: 'Qty Variance',
      render: (match: any) => {
        const variance = match.quantity_variance || 0;
        return (
          <span className={variance !== 0 ? 'text-red-600 font-medium' : 'text-green-600'}>
            {variance > 0 ? `+${variance}` : variance}
          </span>
        );
      }
    },
    {
      key: 'price_variance',
      header: 'Price Variance',
      render: (match: any) => {
        const variance = parseFloat(match.price_variance || '0');
        return (
          <span className={variance !== 0 ? 'text-red-600 font-medium' : 'text-green-600'}>
            ${variance > 0 ? `+${variance.toFixed(2)}` : variance.toFixed(2)}
          </span>
        );
      }
    },
    {
      key: 'variance_level',
      header: 'Variance Level',
      render: (match: any) => {
        const level = getVarianceLevel(match.quantity_variance || 0, parseFloat(match.price_variance || '0'));
        const variants = {
          none: 'success',
          low: 'warning',
          medium: 'danger',
          high: 'danger'
        };
        return <Badge variant={variants[level as keyof typeof variants]}>{level.toUpperCase()}</Badge>;
      }
    },
    {
      key: 'match_status',
      header: 'Status',
      render: (match: any) => (
        <Badge variant={getMatchStatusVariant(match.match_status)}>
          {match.match_status}
        </Badge>
      )
    },
    {
      key: 'matched_at',
      header: 'Matched Date',
      render: (match: any) => match.matched_at ? new Date(match.matched_at).toLocaleDateString() : '-'
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (match: any) => (
        <Button size="sm" variant="ghost" onClick={() => handleViewMatch(match)}>
          <Eye size={16} />
        </Button>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            Three-Way Matching
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Compare Purchase Orders, GRNs, and Invoices for discrepancies
          </p>
        </div>
        <div className="flex gap-3">
          <Button 
            onClick={handleAutoMatch} 
            disabled={autoMatching}
            variant="secondary"
          >
            {autoMatching ? (
              <RefreshCw size={20} className="mr-2 animate-spin" />
            ) : (
              <RefreshCw size={20} className="mr-2" />
            )}
            {autoMatching ? 'Auto Matching...' : 'Run Auto Match'}
          </Button>
          <Button onClick={fetchMatchingData}>
            <Eye size={20} className="mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-8">
          <p className="text-gray-600 dark:text-gray-400">Loading matching data...</p>
        </div>
      ) : (
        <DataTable
          data={matchingData}
          columns={columns}
          searchPlaceholder="Search matching records..."
        />
      )}

      {/* Match Details Modal */}
      {viewingMatch && matchDetails && (
        <Modal
          isOpen={!!viewingMatch}
          onClose={() => { setViewingMatch(null); setMatchDetails(null); }}
          title={`Three-Way Match #${viewingMatch.id}`}
          size="xl"
        >
          <div className="space-y-6">
            {/* Comparison Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-sm border border-gray-200 dark:border-gray-700 rounded-lg">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-4 py-3 text-left font-medium">Document</th>
                    <th className="px-4 py-3 text-left font-medium">Quantity</th>
                    <th className="px-4 py-3 text-left font-medium">Unit Price</th>
                    <th className="px-4 py-3 text-left font-medium">Total</th>
                    <th className="px-4 py-3 text-left font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-t border-gray-200 dark:border-gray-600">
                    <td className="px-4 py-3 font-medium text-blue-600">Purchase Order</td>
                    <td className="px-4 py-3">{matchDetails.po?.quantity || '-'}</td>
                    <td className="px-4 py-3">${parseFloat(matchDetails.po?.unit_price || '0').toFixed(2)}</td>
                    <td className="px-4 py-3">${parseFloat(matchDetails.po?.line_total || '0').toFixed(2)}</td>
                    <td className="px-4 py-3">
                      <Badge variant="info">Ordered</Badge>
                    </td>
                  </tr>
                  {matchDetails.grn && (
                    <tr className="border-t border-gray-200 dark:border-gray-600">
                      <td className="px-4 py-3 font-medium text-green-600">Goods Receipt</td>
                      <td className="px-4 py-3">{matchDetails.grn?.accepted_qty || '-'}</td>
                      <td className="px-4 py-3">-</td>
                      <td className="px-4 py-3">-</td>
                      <td className="px-4 py-3">
                        <Badge variant="success">Received</Badge>
                      </td>
                    </tr>
                  )}
                  {matchDetails.invoice && (
                    <tr className="border-t border-gray-200 dark:border-gray-600">
                      <td className="px-4 py-3 font-medium text-purple-600">Vendor Invoice</td>
                      <td className="px-4 py-3">{matchDetails.invoice?.quantity || '-'}</td>
                      <td className="px-4 py-3">${parseFloat(matchDetails.invoice?.unit_price || '0').toFixed(2)}</td>
                      <td className="px-4 py-3">${parseFloat(matchDetails.invoice?.line_total || '0').toFixed(2)}</td>
                      <td className="px-4 py-3">
                        <Badge variant="warning">Invoiced</Badge>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Variance Summary */}
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-3">Variance Analysis</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-600 dark:text-gray-400">Quantity Variance</p>
                  <p className={`font-medium ${viewingMatch.quantity_variance !== 0 ? 'text-red-600' : 'text-green-600'}`}>
                    {viewingMatch.quantity_variance > 0 ? '+' : ''}{viewingMatch.quantity_variance || 0}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600 dark:text-gray-400">Price Variance</p>
                  <p className={`font-medium ${parseFloat(viewingMatch.price_variance || '0') !== 0 ? 'text-red-600' : 'text-green-600'}`}>
                    ${parseFloat(viewingMatch.price_variance || '0') > 0 ? '+' : ''}
                    {parseFloat(viewingMatch.price_variance || '0').toFixed(2)}
                  </p>
                </div>
              </div>
            </div>

            {/* Current Status */}
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Current Status</p>
                <Badge variant={getMatchStatusVariant(viewingMatch.match_status)} className="mt-1">
                  {viewingMatch.match_status}
                </Badge>
              </div>
              {viewingMatch.matched_at && (
                <div className="text-right">
                  <p className="text-sm text-gray-600 dark:text-gray-400">Matched Date</p>
                  <p className="text-sm font-medium">{new Date(viewingMatch.matched_at).toLocaleDateString()}</p>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            {viewingMatch.match_status === 'PENDING' && (
              <div className="border-t pt-4">
                <form onSubmit={(e) => {
                  e.preventDefault();
                  const formData = new FormData(e.currentTarget);
                  const remarks = formData.get('remarks') as string;
                  const action = (e.nativeEvent as any).submitter.name;
                  
                  if (action === 'approve') {
                    handleApproveMatch(viewingMatch.id, remarks);
                  } else if (action === 'reject') {
                    handleRejectMatch(viewingMatch.id, remarks);
                  }
                }} className="space-y-4">
                  <Textarea
                    name="remarks"
                    label="Remarks"
                    placeholder="Enter remarks for approval/rejection..."
                    required
                  />
                  <div className="flex justify-end gap-3">
                    <Button type="submit" name="reject" variant="secondary" className="text-red-600">
                      <XCircle size={16} className="mr-2" />
                      Reject
                    </Button>
                    <Button type="submit" name="approve" variant="primary">
                      <CheckCircle size={16} className="mr-2" />
                      Approve
                    </Button>
                  </div>
                </form>
              </div>
            )}

            {/* Existing Remarks */}
            {viewingMatch.variance_reason && (
              <div className="border-t pt-4">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Remarks</p>
                <p className="text-sm bg-gray-50 dark:bg-gray-700 p-3 rounded">{viewingMatch.variance_reason}</p>
              </div>
            )}
          </div>
        </Modal>
      )}
    </div>
  );
};