import React, { useState, useEffect } from 'react';
import { Plus, Eye, FileText } from 'lucide-react';
import { DataTable } from '../../../components/ui/DataTable';
import { Button } from '../../../components/ui/Button';
import { Modal } from '../../../components/ui/Modal';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Badge } from '../../../components/ui/Badge';
import { apiService } from '../../../services/api';

export const VendorInvoices: React.FC = () => {
  const [invoices, setInvoices] = useState<any[]>([]);
  const [purchaseOrders, setPurchaseOrders] = useState<any[]>([]);
  const [grns, setGrns] = useState<any[]>([]);
  const [vendors, setVendors] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewingInvoice, setViewingInvoice] = useState<any | null>(null);
  const [selectedPO, setSelectedPO] = useState<any | null>(null);
  const [selectedGRN, setSelectedGRN] = useState<any | null>(null);
  const [invoiceLines, setInvoiceLines] = useState<any[]>([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [invoicesResponse, posResponse, grnsResponse, vendorsResponse] = await Promise.all([
        apiService.getVendorInvoices(),
        apiService.getPurchaseOrders(),
        apiService.getGRNs(),
        apiService.getVendors()
      ]);
      
      const invoicesData = Array.isArray(invoicesResponse?.data) ? invoicesResponse.data : Array.isArray(invoicesResponse) ? invoicesResponse : [];
      const posData = Array.isArray(posResponse?.data) ? posResponse.data : Array.isArray(posResponse) ? posResponse : [];
      const grnsData = Array.isArray(grnsResponse?.data) ? grnsResponse.data : Array.isArray(grnsResponse) ? grnsResponse : [];
      const vendorsData = Array.isArray(vendorsResponse?.data) ? vendorsResponse.data : Array.isArray(vendorsResponse) ? vendorsResponse : [];
      
      setInvoices(invoicesData);
      setPurchaseOrders(posData.filter((po: any) => po.status === 'Approved'));
      setGrns(grnsData.filter((grn: any) => grn.inspection_status === 'Approved'));
      setVendors(vendorsData);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePOSelection = async (poId: string) => {
    if (!poId) {
      setSelectedPO(null);
      setInvoiceLines([]);
      return;
    }
    
    try {
      const po = purchaseOrders.find(p => p.id.toString() === poId);
      setSelectedPO(po);
      
      console.log('Selected PO:', po); // Debug log
      
      const linesResponse = await apiService.getPOLinesByPOId(parseInt(poId));
      console.log('PO Lines Response:', linesResponse); // Debug log
      
      const lines = Array.isArray(linesResponse?.data) ? linesResponse.data : Array.isArray(linesResponse) ? linesResponse : [];
      
      console.log('Processed Lines:', lines); // Debug log
      
      if (lines.length === 0) {
        alert('No line items found for this Purchase Order. Please add line items to the PO first.');
        setInvoiceLines([]);
        return;
      }
      
      setInvoiceLines(lines.map((line: any) => ({
        po_line_id: line.id,
        item_id: line.item_id,
        description: line.description || 'No description',
        quantity: line.quantity || 0,
        unit_price: parseFloat(line.unit_price || '0'),
        line_total: parseFloat(line.line_total || '0')
      })));
    } catch (error) {
      console.error('Failed to fetch PO lines:', error);
      alert('Failed to load PO line items. Please try again.');
      setInvoiceLines([]);
    }
  };

  const handleGRNSelection = async (grnId: string) => {
    if (!grnId) {
      setSelectedGRN(null);
      setSelectedPO(null);
      setInvoiceLines([]);
      return;
    }
    
    try {
      const grn = grns.find(g => g.id.toString() === grnId);
      setSelectedGRN(grn);
      
      // Get the related PO
      const po = purchaseOrders.find(p => p.id === grn.po_id);
      setSelectedPO(po);
      
      // Get GRN details to populate invoice lines
      const grnDetailsResponse = await apiService.getGRNDetailsByGRNId(parseInt(grnId));
      const grnDetails = Array.isArray(grnDetailsResponse?.data) ? grnDetailsResponse.data : Array.isArray(grnDetailsResponse) ? grnDetailsResponse : [];
      
      if (grnDetails.length === 0) {
        alert('No items found in this GRN.');
        setInvoiceLines([]);
        return;
      }
      
      setInvoiceLines(grnDetails.map((detail: any) => ({
        grn_detail_id: detail.id,
        item_id: detail.item_id,
        description: detail.description || 'No description',
        quantity: detail.accepted_qty || 0,
        unit_price: parseFloat(detail.unit_price || '0'),
        line_total: (detail.accepted_qty || 0) * parseFloat(detail.unit_price || '0')
      })));
    } catch (error) {
      console.error('Failed to fetch GRN details:', error);
      alert('Failed to load GRN details. Please try again.');
      setInvoiceLines([]);
    }
  };

  const handleSubmit = async (formData: FormData) => {
    if (!selectedGRN || !selectedPO || invoiceLines.length === 0) {
      alert('Please select a GRN and ensure invoice lines are loaded.');
      return;
    }

    const validLines = invoiceLines.filter(line => line.quantity > 0 && line.unit_price > 0);
    
    if (validLines.length === 0) {
      alert('Please ensure all invoice lines have valid quantities and prices.');
      return;
    }

    const subtotal = validLines.reduce((sum, line) => sum + line.line_total, 0);
    const taxAmount = subtotal * 0.1; // 10% tax
    const totalAmount = subtotal + taxAmount;

    const invoiceData = {
      invoice_number: `INV-${Date.now()}`,
      vendor_invoice_number: formData.get('vendorInvoiceNumber') as string,
      vendor_id: selectedGRN.supplier_id,
      po_id: selectedPO.id,
      grn_id: selectedGRN.id,
      invoice_date: formData.get('invoiceDate') as string,
      due_date: formData.get('dueDate') as string,
      currency: 'USD',
      subtotal: subtotal.toString(),
      tax_amount: taxAmount.toString(),
      total_amount: totalAmount.toString(),
      payment_status: 'PENDING',
      match_status: 'UNMATCHED',
      lines: validLines
    };

    try {
      const createdInvoice = await apiService.createVendorInvoice(invoiceData);
      
      // Automatically create three-way matching for each line
      for (const line of validLines) {
        if (line.grn_detail_id) {
          try {
            await apiService.createAutomaticThreeWayMatch({
              poLineId: line.po_line_id || selectedPO.lines?.[0]?.id,
              grnDetailId: line.grn_detail_id,
              invoiceLineId: createdInvoice.data?.id || createdInvoice.id
            });
          } catch (matchError) {
            console.warn('Failed to create automatic match for line:', matchError);
          }
        }
      }
      
      await fetchData();
      setIsModalOpen(false);
      setSelectedPO(null);
      setSelectedGRN(null);
      setInvoiceLines([]);
      alert('Invoice created successfully with automatic three-way matching!');
    } catch (error) {
      console.error('Failed to create invoice:', error);
      alert('Failed to create invoice. Please try again.');
    }
  };

  const updateInvoiceLine = (index: number, field: string, value: any) => {
    const updated = [...invoiceLines];
    updated[index] = { ...updated[index], [field]: value };
    
    if (field === 'quantity' || field === 'unit_price') {
      updated[index].line_total = updated[index].quantity * updated[index].unit_price;
    }
    
    setInvoiceLines(updated);
  };

  const getMatchStatusVariant = (status: string) => {
    switch (status) {
      case 'MATCHED': return 'success';
      case 'UNMATCHED': return 'warning';
      case 'VARIANCE': return 'danger';
      default: return 'default';
    }
  };

  const getPaymentStatusVariant = (status: string) => {
    switch (status) {
      case 'PAID': return 'success';
      case 'PENDING': return 'warning';
      case 'OVERDUE': return 'danger';
      default: return 'default';
    }
  };

  const columns = [
    { key: 'invoice_number', header: 'Invoice Number', sortable: true },
    { key: 'vendor_invoice_number', header: 'Vendor Invoice', sortable: true },
    { key: 'vendor_id', header: 'Vendor', sortable: true },
    {
      key: 'invoice_date',
      header: 'Invoice Date',
      render: (invoice: any) => new Date(invoice.invoice_date).toLocaleDateString()
    },
    {
      key: 'total_amount',
      header: 'Total Amount',
      render: (invoice: any) => `$${parseFloat(invoice.total_amount || '0').toFixed(2)}`
    },
    {
      key: 'match_status',
      header: 'Match Status',
      render: (invoice: any) => (
        <Badge variant={getMatchStatusVariant(invoice.match_status)}>
          {invoice.match_status}
        </Badge>
      )
    },
    {
      key: 'payment_status',
      header: 'Payment Status',
      render: (invoice: any) => (
        <Badge variant={getPaymentStatusVariant(invoice.payment_status)}>
          {invoice.payment_status}
        </Badge>
      )
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (invoice: any) => (
        <Button size="sm" variant="ghost" onClick={() => setViewingInvoice(invoice)}>
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
            Vendor Invoices
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage vendor invoices and matching
          </p>
        </div>
        <Button onClick={() => setIsModalOpen(true)}>
          <Plus size={20} className="mr-2" />
          Create Invoice
        </Button>
      </div>

      {loading ? (
        <div className="text-center py-8">
          <p className="text-gray-600 dark:text-gray-400">Loading invoices...</p>
        </div>
      ) : (
        <DataTable
          data={invoices}
          columns={columns}
          searchPlaceholder="Search invoices..."
        />
      )}

      {/* Create Invoice Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => { setIsModalOpen(false); setSelectedPO(null); setInvoiceLines([]); }}
        title="Create Vendor Invoice"
        size="xl"
      >
        <form onSubmit={(e) => { e.preventDefault(); handleSubmit(new FormData(e.currentTarget)); }} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input name="vendorInvoiceNumber" label="Vendor Invoice Number" required />
            <Select
              name="grnId"
              label="Goods Receipt Note"
              options={grns.map(grn => ({ value: grn.id.toString(), label: `${grn.grn_number} - ${grn.supplier_id}` }))}
              onChange={(e) => handleGRNSelection(e.target.value)}
              required
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <Input name="invoiceDate" type="date" label="Invoice Date" required />
            <Input name="dueDate" type="date" label="Due Date" required />
          </div>
          
          {selectedPO && invoiceLines.length > 0 && (
            <>
              <div className="space-y-3">
                <h4 className="font-medium text-gray-900 dark:text-gray-100">Invoice Lines</h4>
                <div className="border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                      <tr>
                        <th className="px-3 py-2 text-left">Item</th>
                        <th className="px-3 py-2 text-left">Quantity</th>
                        <th className="px-3 py-2 text-left">Unit Price</th>
                        <th className="px-3 py-2 text-left">Line Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {invoiceLines.map((line, index) => (
                        <tr key={index} className="border-t border-gray-200 dark:border-gray-600">
                          <td className="px-3 py-2">{line.description}</td>
                          <td className="px-3 py-2">
                            <Input
                              type="number"
                              value={line.quantity}
                              onChange={(e) => updateInvoiceLine(index, 'quantity', parseInt(e.target.value) || 0)}
                              className="w-20"
                            />
                          </td>
                          <td className="px-3 py-2">
                            <Input
                              type="number"
                              step="0.01"
                              value={line.unit_price}
                              onChange={(e) => updateInvoiceLine(index, 'unit_price', parseFloat(e.target.value) || 0)}
                              className="w-24"
                            />
                          </td>
                          <td className="px-3 py-2">${line.line_total.toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              
              <div className="border-t pt-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>${invoiceLines.reduce((sum, line) => sum + line.line_total, 0).toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax (10%):</span>
                  <span>${(invoiceLines.reduce((sum, line) => sum + line.line_total, 0) * 0.1).toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-semibold text-lg border-t pt-2">
                  <span>Total:</span>
                  <span>${(invoiceLines.reduce((sum, line) => sum + line.line_total, 0) * 1.1).toFixed(2)}</span>
                </div>
              </div>
              
              <div className="flex justify-end gap-3">
                <Button type="button" variant="secondary" onClick={() => { setIsModalOpen(false); setSelectedPO(null); setInvoiceLines([]); }}>
                  Cancel
                </Button>
                <Button type="submit">
                  Create Invoice
                </Button>
              </div>
            </>
          )}
        </form>
      </Modal>

      {/* View Invoice Modal */}
      {viewingInvoice && (
        <Modal
          isOpen={!!viewingInvoice}
          onClose={() => setViewingInvoice(null)}
          title={`Invoice ${viewingInvoice.invoice_number}`}
          size="lg"
        >
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-600 dark:text-gray-400">Vendor Invoice Number</p>
                <p className="font-medium">{viewingInvoice.vendor_invoice_number}</p>
              </div>
              <div>
                <p className="text-gray-600 dark:text-gray-400">Vendor</p>
                <p className="font-medium">{viewingInvoice.vendor_id}</p>
              </div>
              <div>
                <p className="text-gray-600 dark:text-gray-400">Invoice Date</p>
                <p className="font-medium">{new Date(viewingInvoice.invoice_date).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-gray-600 dark:text-gray-400">Due Date</p>
                <p className="font-medium">{new Date(viewingInvoice.due_date).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-gray-600 dark:text-gray-400">Match Status</p>
                <Badge variant={getMatchStatusVariant(viewingInvoice.match_status)}>
                  {viewingInvoice.match_status}
                </Badge>
              </div>
              <div>
                <p className="text-gray-600 dark:text-gray-400">Payment Status</p>
                <Badge variant={getPaymentStatusVariant(viewingInvoice.payment_status)}>
                  {viewingInvoice.payment_status}
                </Badge>
              </div>
            </div>
            
            <div className="border-t pt-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>${parseFloat(viewingInvoice.subtotal || '0').toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax:</span>
                <span>${parseFloat(viewingInvoice.tax_amount || '0').toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-semibold text-lg border-t pt-2">
                <span>Total:</span>
                <span>${parseFloat(viewingInvoice.total_amount || '0').toFixed(2)}</span>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};