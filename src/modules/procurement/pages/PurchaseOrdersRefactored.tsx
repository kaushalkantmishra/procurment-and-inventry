import React, { useState, useEffect } from "react";
import { Plus, Eye, Edit, Send, FileText } from "lucide-react";
import { DataTable } from "../components/ui/DataTable";
import { Button } from "../components/ui/Button";
import { Modal } from "../components/ui/Modal";
import { Select } from "../components/ui/Select";
import { Input } from "../components/ui/Input";
import { Textarea } from "../components/ui/Textarea";
import { Badge } from "../components/ui/Badge";
import { apiService } from "../services/api";

export const PurchaseOrders: React.FC = () => {
  const [purchaseOrders, setPurchaseOrders] = useState<any[]>([]);
  const [items, setItems] = useState<any[]>([]);
  const [vendors, setVendors] = useState<any[]>([]);
  const [purchaseRequests, setPurchaseRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewingPO, setViewingPO] = useState<any | null>(null);
  const [editingPO, setEditingPO] = useState<any | null>(null);
  const [selectedItems, setSelectedItems] = useState<any[]>([]);
  const [createFromPR, setCreateFromPR] = useState(false);
  const [poLines, setPOLines] = useState<any[]>([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [posResponse, itemsResponse, vendorsResponse, prsResponse] = await Promise.all([
        apiService.getPurchaseOrders(),
        apiService.getItems(),
        apiService.getVendors(),
        apiService.getPurchaseRequests()
      ]);
      
      const pos = Array.isArray(posResponse?.data) ? posResponse.data : Array.isArray(posResponse) ? posResponse : [];
      const itemsData = Array.isArray(itemsResponse?.data) ? itemsResponse.data : Array.isArray(itemsResponse) ? itemsResponse : [];
      const vendorsData = Array.isArray(vendorsResponse?.data) ? vendorsResponse.data : Array.isArray(vendorsResponse) ? vendorsResponse : [];
      const prsData = Array.isArray(prsResponse?.data) ? prsResponse.data : Array.isArray(prsResponse) ? prsResponse : [];
      
      setPurchaseOrders(pos);
      setItems(itemsData);
      setVendors(vendorsData);
      setPurchaseRequests(prsData.filter((pr: any) => pr.status === 'Approved'));
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  const handleViewPO = async (po: any) => {
    try {
      const linesResponse = await apiService.getPOLinesByPOId(po.id);
      const lines = Array.isArray(linesResponse?.data) ? linesResponse.data : Array.isArray(linesResponse) ? linesResponse : [];
      setPOLines(lines);
      setViewingPO(po);
    } catch (error) {
      console.error('Failed to fetch PO lines:', error);
      setViewingPO(po);
    }
  };

  const handleSubmit = async (formData: FormData) => {
    const poData = {
      po_number: `PO-${Date.now()}`,
      supplier_id: formData.get('vendor') as string,
      buyer_id: 'BUYER001',
      payment_terms: formData.get('paymentTerms') as string,
      total_amount: selectedItems.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0).toString(),
      status: 'Draft',
      lines: selectedItems.map((item: any, index: number) => ({
        line_number: index + 1,
        item_id: item.itemId,
        description: item.description,
        quantity: item.quantity,
        unit_price: item.unitPrice.toString(),
        line_total: (item.quantity * item.unitPrice).toString()
      }))
    };

    try {
      if (editingPO) {
        await apiService.updatePurchaseOrder(editingPO.id, poData);
      } else {
        await apiService.createPurchaseOrder(poData);
      }
      await fetchData();
      setIsModalOpen(false);
      setEditingPO(null);
      setSelectedItems([]);
      setCreateFromPR(false);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to save PO');
    }
  };

  const handleApprove = async (id: number) => {
    try {
      await apiService.updatePurchaseOrder(id, { status: 'Approved' });
      await fetchData();
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to approve PO');
    }
  };

  const addItemToPO = () => {
    const productSelect = document.getElementById('product-select') as HTMLSelectElement;
    const quantityInput = document.getElementById('quantity-input') as HTMLInputElement;
    const priceInput = document.getElementById('price-input') as HTMLInputElement;
    
    if (productSelect.value && quantityInput.value && priceInput.value) {
      const selectedItem = items?.find(item => item.id?.toString() === productSelect.value);
      if (selectedItem) {
        const newItem = {
          itemId: selectedItem.id,
          description: selectedItem.item_name,
          quantity: parseInt(quantityInput.value),
          unitPrice: parseFloat(priceInput.value)
        };
        setSelectedItems([...selectedItems, newItem]);
        quantityInput.value = '';
        priceInput.value = '';
        productSelect.value = '';
      }
    }
  };

  const removeItem = (index: number) => {
    setSelectedItems(selectedItems.filter((_, i) => i !== index));
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'Draft': return 'default';
      case 'Approved': return 'success';
      case 'Closed': return 'info';
      default: return 'default';
    }
  };

  const columns = [
    { key: "po_number", header: "PO Number", sortable: true },
    { key: "supplier_id", header: "Supplier", sortable: true },
    {
      key: "po_date",
      header: "PO Date",
      sortable: true,
      render: (po: any) => new Date(po.po_date).toLocaleDateString(),
    },
    {
      key: "total_amount",
      header: "Total Amount",
      sortable: true,
      render: (po: any) =>
        `$${parseFloat(po.total_amount || '0').toLocaleString("en-US", {
          minimumFractionDigits: 2,
        })}`,
    },
    {
      key: "status",
      header: "Status",
      render: (po: any) => (
        <Badge variant={getStatusVariant(po.status)}>{po.status}</Badge>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      render: (po: any) => (
        <div className="flex gap-2">
          <Button size="sm" variant="ghost" onClick={() => handleViewPO(po)}>
            <Eye size={16} />
          </Button>
          {po.status === 'Draft' && (
            <>
              <Button size="sm" variant="ghost" onClick={() => { setEditingPO(po); setIsModalOpen(true); }}>
                <Edit size={16} />
              </Button>
              <Button size="sm" variant="ghost" onClick={() => handleApprove(po.id)}>
                <Send size={16} />
              </Button>
            </>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            Purchase Orders
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage your procurement orders
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="secondary" onClick={() => { setCreateFromPR(true); setIsModalOpen(true); }}>
            <FileText size={20} className="mr-2" />
            From PR
          </Button>
          <Button onClick={() => setIsModalOpen(true)}>
            <Plus size={20} className="mr-2" />
            Create PO
          </Button>
        </div>
      </div>

      {loading && (
        <div className="text-center py-8">
          <p className="text-gray-600 dark:text-gray-400">Loading purchase orders...</p>
        </div>
      )}
      
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <p className="text-red-600 dark:text-red-400">{error}</p>
        </div>
      )}

      {!loading && !error && (
        <DataTable
          data={purchaseOrders}
          columns={columns}
          searchPlaceholder="Search purchase orders..."
        />
      )}

      {/* Create/Edit PO Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => { 
          setIsModalOpen(false); 
          setEditingPO(null); 
          setSelectedItems([]); 
          setCreateFromPR(false); 
        }}
        title={editingPO ? 'Edit Purchase Order' : createFromPR ? 'Create PO from PR' : 'Create Purchase Order'}
        size="xl"
      >
        <form className="space-y-4" onSubmit={(e) => {
          e.preventDefault();
          handleSubmit(new FormData(e.currentTarget));
        }}>
          <div className="grid grid-cols-2 gap-4">
            <Select
              name="vendor"
              label="Vendor"
              options={vendors.map((vendor) => ({
                value: vendor.vendor_code,
                label: vendor.vendor_name,
              }))}
              defaultValue={editingPO?.supplier_id}
              required
            />
            <Input 
              name="paymentTerms" 
              label="Payment Terms" 
              placeholder="Net 30"
              defaultValue={editingPO?.payment_terms}
              required 
            />
          </div>

          {createFromPR && (
            <Select
              name="purchaseRequest"
              label="Purchase Request"
              options={purchaseRequests.map((pr) => ({
                value: pr.id.toString(),
                label: `PR-${pr.id} - ${pr.justification}`,
              }))}
            />
          )}
          
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Items
            </label>
            <div className="border border-gray-300 dark:border-gray-600 rounded-lg p-4 space-y-3">
              <div className="grid grid-cols-12 gap-3">
                <div className="col-span-6">
                  <Select
                    id="product-select"
                    label="Product"
                    options={items?.map((item, idx) => ({
                      value: item.id?.toString() || `empty-${idx}`,
                      label: `${item.item_name || 'Unknown'} (${item.sku || 'N/A'})`,
                    })) || []}
                  />
                </div>
                <div className="col-span-2">
                  <Input id="quantity-input" type="number" label="Quantity" placeholder="0" />
                </div>
                <div className="col-span-2">
                  <Input
                    id="price-input"
                    type="number"
                    label="Unit Price"
                    placeholder="0.00"
                    step="0.01"
                  />
                </div>
                <div className="col-span-2 flex items-end">
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    className="w-full"
                    onClick={addItemToPO}
                  >
                    Add
                  </Button>
                </div>
              </div>
            </div>
            
            {selectedItems.length > 0 && (
              <div className="mt-4">
                <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">Selected Items</h4>
                <div className="space-y-2">
                  {selectedItems.map((item: any, index: number) => (
                    <div key={index} className="flex justify-between items-center p-2 bg-gray-50 dark:bg-gray-700 rounded">
                      <span className="text-sm">{item.description}</span>
                      <span className="text-sm">Qty: {item.quantity} × ${item.unitPrice.toFixed(2)} = ${(item.quantity * item.unitPrice).toFixed(2)}</span>
                      <Button
                        type="button"
                        size="sm"
                        variant="ghost"
                        onClick={() => removeItem(index)}
                      >
                        Remove
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
            <div className="flex justify-between text-lg font-semibold">
              <span>Total Amount:</span>
              <span className="text-primary-600">
                ${selectedItems.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0).toFixed(2)}
              </span>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="secondary"
              onClick={() => { 
                setIsModalOpen(false); 
                setEditingPO(null); 
                setSelectedItems([]); 
                setCreateFromPR(false); 
              }}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              {editingPO ? 'Update' : 'Create'} PO
            </Button>
          </div>
        </form>
      </Modal>

      {/* View PO Modal */}
      {viewingPO && (
        <Modal
          isOpen={!!viewingPO}
          onClose={() => { setViewingPO(null); setPOLines([]); }}
          title={`Purchase Order ${viewingPO.po_number}`}
          size="lg"
        >
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-600 dark:text-gray-400">Supplier</p>
                <p className="font-medium text-gray-900 dark:text-gray-100">
                  {viewingPO.supplier_id}
                </p>
              </div>
              <div>
                <p className="text-gray-600 dark:text-gray-400">Status</p>
                <div className="mt-1">
                  <Badge variant={getStatusVariant(viewingPO.status)}>
                    {viewingPO.status}
                  </Badge>
                </div>
              </div>
              <div>
                <p className="text-gray-600 dark:text-gray-400">PO Date</p>
                <p className="font-medium text-gray-900 dark:text-gray-100">
                  {new Date(viewingPO.po_date).toLocaleDateString()}
                </p>
              </div>
              <div>
                <p className="text-gray-600 dark:text-gray-400">Payment Terms</p>
                <p className="font-medium text-gray-900 dark:text-gray-100">
                  {viewingPO.payment_terms || 'N/A'}
                </p>
              </div>
            </div>

            <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
              <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">
                Items
              </h4>
              <div className="space-y-2">
                {poLines && poLines.length > 0 ? (
                  poLines.map((line: any, index: number) => (
                    <div
                      key={index}
                      className="flex justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg text-sm"
                    >
                      <div>
                        <p className="font-medium text-gray-900 dark:text-gray-100">
                          {line.description || 'No description'}
                        </p>
                        <p className="text-gray-600 dark:text-gray-400">
                          Qty: {line.quantity || 0} × ${parseFloat(line.unit_price || '0').toFixed(2)}
                        </p>
                      </div>
                      <p className="font-medium text-gray-900 dark:text-gray-100">
                        ${parseFloat(line.line_total || '0').toFixed(2)}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 dark:text-gray-400 text-sm">No items found</p>
                )}
              </div>
            </div>

            <div className="border-t border-gray-200 dark:border-gray-700 pt-4 space-y-2 text-sm">
              <div className="flex justify-between text-lg font-semibold">
                <span>Total Amount:</span>
                <span className="text-primary-600">
                  ${parseFloat(viewingPO.total_amount || '0').toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};