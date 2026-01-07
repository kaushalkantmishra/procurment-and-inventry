import React, { useState, useEffect } from 'react';
import { Plus, Eye, Package, Check, X, AlertTriangle } from 'lucide-react';
import { DataTable } from '../../../components/ui/DataTable';
import { Button } from '../../../components/ui/Button';
import { Modal } from '../../../components/ui/Modal';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Textarea } from '../../../components/ui/Textarea';
import { Badge } from '../../../components/ui/Badge';
import { apiService } from '../../../services/api';

export const GoodsReceiptNotes: React.FC = () => {
  const [grns, setGrns] = useState<any[]>([]);
  const [purchaseOrders, setPurchaseOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingPOLines, setLoadingPOLines] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewingGRN, setViewingGRN] = useState<any | null>(null);
  const [selectedPO, setSelectedPO] = useState<any | null>(null);
  const [grnDetails, setGrnDetails] = useState<any[]>([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [grnsResponse, posResponse] = await Promise.all([
        apiService.getGRNs(),
        apiService.getPurchaseOrders()
      ]);
      
      const grnsData = Array.isArray(grnsResponse?.data) ? grnsResponse.data : Array.isArray(grnsResponse) ? grnsResponse : [];
      const posData = Array.isArray(posResponse?.data) ? posResponse.data : Array.isArray(posResponse) ? posResponse : [];
      
      setGrns(grnsData);
      // Only show approved POs for GRN creation
      setPurchaseOrders(posData.filter((po: any) => po.status === 'Approved'));
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePOSelection = async (poId: string) => {
    console.log('PO Selection triggered with ID:', poId); // Debug log
    
    if (!poId) {
      setSelectedPO(null);
      setGrnDetails([]);
      return;
    }
    
    try {
      setLoadingPOLines(true);
      const po = purchaseOrders.find(p => p.id.toString() === poId);
      console.log('Found PO:', po); // Debug log
      setSelectedPO(po);
      
      if (!po) {
        alert('Purchase Order not found.');
        return;
      }
      
      console.log('Fetching PO lines for PO ID:', poId); // Debug log
      const linesResponse = await apiService.getPOLinesByPOId(parseInt(poId));
      console.log('PO Lines API Response:', linesResponse); // Debug log
      
      const lines = Array.isArray(linesResponse?.data) ? linesResponse.data : Array.isArray(linesResponse) ? linesResponse : [];
      console.log('Processed Lines:', lines); // Debug log
      
      if (lines.length === 0) {
        console.warn('No PO lines found for PO:', poId);
        alert('No line items found for this Purchase Order. Please add line items to the PO first.');
        setGrnDetails([]);
        return;
      }
      
      const mappedDetails = lines.map((line: any) => ({
        po_line_id: line.id,
        item_id: line.item_id,
        description: line.description || line.item_name || 'No description',
        ordered_qty: line.quantity || 0,
        received_qty: 0,
        accepted_qty: 0,
        rejected_qty: 0,
        condition_note: '',
        qad_check: 'Pending'
      }));
      
      console.log('Mapped GRN Details:', mappedDetails); // Debug log
      setGrnDetails(mappedDetails);
    } catch (error) {
      console.error('Failed to fetch PO lines:', error);
      alert(`Failed to load PO line items: ${error instanceof Error ? error.message : 'Unknown error'}`);
      setGrnDetails([]);
    } finally {
      setLoadingPOLines(false);
    }
  };

  const handleSubmit = async (formData: FormData) => {
    if (!selectedPO) {
      alert('Please select a Purchase Order first.');
      return;
    }

    const validDetails = grnDetails.filter(detail => detail.received_qty > 0);
    
    if (validDetails.length === 0) {
      alert('Please enter received quantities for at least one item.');
      return;
    }

    const deliveryNote = formData.get('deliveryNote') as string;
    if (!deliveryNote) {
      alert('Please enter a delivery note reference.');
      return;
    }

    const grnData = {
      grn_number: `GRN-${Date.now()}`,
      po_id: selectedPO.id,
      supplier_id: selectedPO.supplier_id || 'UNKNOWN',
      delivery_note_ref: deliveryNote,
      vehicle_reg_no: formData.get('vehicleReg') as string || '',
      received_by_user: 'USER001',
      inspection_status: 'Pending',
      remarks: formData.get('remarks') as string || '',
      details: validDetails.map(detail => ({
        po_line_id: detail.po_line_id,
        item_id: detail.item_id,
        description: detail.description,
        ordered_qty: detail.ordered_qty,
        received_qty: detail.received_qty,
        accepted_qty: detail.accepted_qty,
        rejected_qty: detail.rejected_qty,
        condition_note: detail.condition_note || 'Good',
        qad_check: 'Pending'
      }))
    };

    console.log('Creating GRN with data:', grnData); // Debug log

    try {
      const result = await apiService.createGRN(grnData);
      console.log('GRN created successfully:', result); // Debug log
      
      await fetchData();
      setIsModalOpen(false);
      setSelectedPO(null);
      setGrnDetails([]);
      alert('GRN created successfully!');
    } catch (error) {
      console.error('Failed to create GRN:', error);
      alert(`Failed to create GRN: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const updateGrnDetail = (index: number, field: string, value: any) => {
    const updated = [...grnDetails];
    updated[index] = { ...updated[index], [field]: value };
    
    if (field === 'received_qty') {
      updated[index].accepted_qty = Math.min(value, updated[index].ordered_qty);
      updated[index].rejected_qty = Math.max(0, value - updated[index].accepted_qty);
    }
    
    setGrnDetails(updated);
  };

  const handleApproveGRN = async (grnId: number) => {
    try {
      await apiService.approveGRN(grnId, { approvedBy: 'ADMIN' });
      await fetchData();
      alert('GRN approved successfully and inventory updated!');
    } catch (error) {
      console.error('Failed to approve GRN:', error);
      alert('Failed to approve GRN. Please try again.');
    }
  };

  const handleRejectGRN = async (grnId: number) => {
    const reason = prompt('Please provide a reason for rejection:');
    if (!reason) return;
    
    try {
      await apiService.rejectGRN(grnId, { rejectedBy: 'ADMIN', reason });
      await fetchData();
      alert('GRN rejected successfully!');
    } catch (error) {
      console.error('Failed to reject GRN:', error);
      alert('Failed to reject GRN. Please try again.');
    }
  };

  const getInspectionVariant = (status: string) => {
    switch (status) {
      case 'Pending': return 'warning';
      case 'Approved': return 'success';
      case 'Rejected': return 'danger';
      default: return 'default';
    }
  };

  const columns = [
    { key: 'grn_number', header: 'GRN Number', sortable: true },
    {
      key: 'receipt_date',
      header: 'Receipt Date',
      render: (grn: any) => new Date(grn.receipt_date).toLocaleDateString()
    },
    { key: 'supplier_id', header: 'Supplier', sortable: true },
    { key: 'delivery_note_ref', header: 'Delivery Note', sortable: true },
    {
      key: 'inspection_status',
      header: 'Inspection Status',
      render: (grn: any) => (
        <Badge variant={getInspectionVariant(grn.inspection_status)}>
          {grn.inspection_status}
        </Badge>
      )
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (grn: any) => (
        <div className="flex gap-2">
          <Button size="sm" variant="ghost" onClick={() => setViewingGRN(grn)}>
            <Eye size={16} />
          </Button>
          {grn.inspection_status === 'Pending' && (
            <>
              <Button 
                size="sm" 
                variant="success" 
                onClick={() => handleApproveGRN(grn.id)}
                title="Approve GRN"
              >
                <Check size={16} />
              </Button>
              <Button 
                size="sm" 
                variant="danger" 
                onClick={() => handleRejectGRN(grn.id)}
                title="Reject GRN"
              >
                <X size={16} />
              </Button>
            </>
          )}
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            Goods Receipt Notes
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Record and inspect incoming goods
          </p>
        </div>
        <Button onClick={() => setIsModalOpen(true)}>
          <Plus size={20} className="mr-2" />
          Create GRN
        </Button>
      </div>

      {loading ? (
        <div className="text-center py-8">
          <p className="text-gray-600 dark:text-gray-400">Loading GRNs...</p>
        </div>
      ) : (
        <DataTable
          data={grns}
          columns={columns}
          searchPlaceholder="Search GRNs..."
        />
      )}

      {/* Create GRN Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => { setIsModalOpen(false); setSelectedPO(null); setGrnDetails([]); }}
        title="Create Goods Receipt Note"
        size="xl"
      >
        <form onSubmit={(e) => { e.preventDefault(); handleSubmit(new FormData(e.currentTarget)); }} className="space-y-4">
          <Select
            name="poId"
            label="Purchase Order"
            options={[
              { value: '', label: 'Select a Purchase Order...' },
              ...purchaseOrders.map(po => ({ 
                value: po.id.toString(), 
                label: `${po.po_number} - ${po.supplier_id}` 
              }))
            ]}
            onChange={(e) => {
              console.log('Select onChange triggered:', e.target.value);
              handlePOSelection(e.target.value);
            }}
            required
          />
          
          {selectedPO && (
            <>
              {loadingPOLines ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto mb-4"></div>
                  <p className="text-gray-600 dark:text-gray-400">Loading PO line items...</p>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <Input name="deliveryNote" label="Delivery Note Reference" required />
                    <Input name="vehicleReg" label="Vehicle Registration" />
                  </div>
              
              <div className="space-y-3">
                <h4 className="font-medium text-gray-900 dark:text-gray-100">Items to Receive</h4>
                
                {grnDetails.length === 0 ? (
                  <div className="text-center py-8 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
                    <AlertTriangle className="mx-auto h-12 w-12 text-yellow-500 mb-4" />
                    <p className="text-yellow-700 dark:text-yellow-300 font-medium">No line items found for this Purchase Order</p>
                    <p className="text-yellow-600 dark:text-yellow-400 text-sm mt-2">Please add line items to the PO first before creating a GRN.</p>
                  </div>
                ) : (
                  <div className="border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-50 dark:bg-gray-700">
                        <tr>
                          <th className="px-3 py-2 text-left">Item</th>
                          <th className="px-3 py-2 text-left">Ordered</th>
                          <th className="px-3 py-2 text-left">Received</th>
                          <th className="px-3 py-2 text-left">Accepted</th>
                          <th className="px-3 py-2 text-left">Rejected</th>
                          <th className="px-3 py-2 text-left">Condition</th>
                        </tr>
                      </thead>
                      <tbody>
                        {grnDetails.map((detail, index) => (
                          <tr key={index} className="border-t border-gray-200 dark:border-gray-600">
                            <td className="px-3 py-2">{detail.description}</td>
                            <td className="px-3 py-2">{detail.ordered_qty}</td>
                            <td className="px-3 py-2">
                              <Input
                                type="number"
                                value={detail.received_qty}
                                onChange={(e) => updateGrnDetail(index, 'received_qty', parseInt(e.target.value) || 0)}
                                className="w-20"
                                min="0"
                              />
                            </td>
                            <td className="px-3 py-2">
                              <span className={`px-2 py-1 rounded text-xs ${
                                detail.accepted_qty === detail.ordered_qty 
                                  ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                                  : detail.accepted_qty > 0
                                  ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                                  : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                              }`}>
                                {detail.accepted_qty}
                              </span>
                            </td>
                            <td className="px-3 py-2">
                              <span className={`px-2 py-1 rounded text-xs ${
                                detail.rejected_qty > 0
                                  ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                                  : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                              }`}>
                                {detail.rejected_qty}
                              </span>
                            </td>
                            <td className="px-3 py-2">
                              <Input
                                value={detail.condition_note}
                                onChange={(e) => updateGrnDetail(index, 'condition_note', e.target.value)}
                                placeholder="Good/Damaged"
                                className="w-24"
                              />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
              
              <Textarea name="remarks" label="Remarks" />
              
              <div className="flex justify-end gap-3">
                <Button type="button" variant="secondary" onClick={() => { setIsModalOpen(false); setSelectedPO(null); setGrnDetails([]); }}>
                  Cancel
                </Button>
                <Button type="submit" disabled={grnDetails.length === 0}>
                  Create GRN
                </Button>
              </div>
                </>
              )}
            </>
          )}
        </form>
      </Modal>

      {/* View GRN Modal */}
      {viewingGRN && (
        <Modal
          isOpen={!!viewingGRN}
          onClose={() => setViewingGRN(null)}
          title={`GRN ${viewingGRN.grn_number}`}
          size="lg"
        >
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-600 dark:text-gray-400">Supplier</p>
                <p className="font-medium">{viewingGRN.supplier_id}</p>
              </div>
              <div>
                <p className="text-gray-600 dark:text-gray-400">Inspection Status</p>
                <Badge variant={getInspectionVariant(viewingGRN.inspection_status)}>
                  {viewingGRN.inspection_status}
                </Badge>
              </div>
              <div>
                <p className="text-gray-600 dark:text-gray-400">Receipt Date</p>
                <p className="font-medium">{new Date(viewingGRN.receipt_date).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-gray-600 dark:text-gray-400">Delivery Note</p>
                <p className="font-medium">{viewingGRN.delivery_note_ref}</p>
              </div>
            </div>
            {viewingGRN.remarks && (
              <div>
                <p className="text-gray-600 dark:text-gray-400 mb-2">Remarks</p>
                <p className="text-sm bg-gray-50 dark:bg-gray-700 p-3 rounded">{viewingGRN.remarks}</p>
              </div>
            )}
          </div>
        </Modal>
      )}
    </div>
  );
};