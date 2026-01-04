import React, { useState, useEffect, useMemo } from "react";
import { Plus, Eye } from "lucide-react";
import { DataTable } from "../components/ui/DataTable";
import { Button } from "../components/ui/Button";
import { Modal } from "../components/ui/Modal";
import { Select } from "../components/ui/Select";
import { Input } from "../components/ui/Input";
import { Badge } from "../components/ui/Badge";
import { apiService } from "../services/api";
import { useStore } from "../store/useStore";

export const PurchaseOrders: React.FC = () => {
  const { purchaseOrders, items, loading, error, fetchPurchaseOrders, fetchItems, createPurchaseOrder } = useStore();
  const [vendors, setVendors] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewingPO, setViewingPO] = useState<any | null>(null);
  const [selectedItems, setSelectedItems] = useState<any[]>([]);

  useEffect(() => {
    fetchPurchaseOrders();
    fetchItems();
    fetchVendors();
  }, [fetchPurchaseOrders, fetchItems]);

  const fetchVendors = async () => {
    try {
      const response = await apiService.getVendors();
      const vendorData = Array.isArray(response?.data) ? response.data : Array.isArray(response) ? response : [];
      setVendors(vendorData);
    } catch (error) {
      console.error('Failed to fetch vendors:', error);
    }
  };

  const transformedPOs = useMemo(() => {
    return purchaseOrders.map(po => ({
      ...po,
      date: po.po_date,
      vendor: po.supplier_id || 'Unknown Supplier',
      expectedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      totalAmount: parseFloat(po.total_amount || '0')
    }));
  }, [purchaseOrders]);

  const columns = [
    { key: "po_number", header: "PO Number", sortable: true },
    { key: "vendor", header: "Vendor", sortable: true },
    {
      key: "date",
      header: "Date",
      sortable: true,
      render: (po: any) => new Date(po.date).toLocaleDateString(),
    },
    {
      key: "expectedDelivery",
      header: "Expected Delivery",
      render: (po: any) =>
        new Date(po.expectedDelivery).toLocaleDateString(),
    },
    {
      key: "totalAmount",
      header: "Total Amount",
      sortable: true,
      render: (po: any) =>
        `$${po.totalAmount.toLocaleString("en-US", {
          minimumFractionDigits: 2,
        })}`,
    },
    {
      key: "status",
      header: "Status",
      render: (po: any) => {
        const variants: Record<
          string,
          "info" | "warning" | "success" | "default" | "danger"
        > = {
          Draft: "default",
          Approved: "info",
          Received: "success",
          Closed: "success",
        };
        return <Badge variant={variants[po.status] || "default"}>{po.status}</Badge>;
      },
    },
    {
      key: "actions",
      header: "Actions",
      render: (po: any) => (
        <Button size="sm" variant="ghost" onClick={() => setViewingPO(po)}>
          <Eye size={16} />
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            Purchase Orders
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage your procurement requests
          </p>
        </div>
        <Button onClick={() => setIsModalOpen(true)}>
          <Plus size={20} className="mr-2" />
          Create PO
        </Button>
      </div>

      {/* Loading and Error States */}
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

      {/* Data Table */}
      {!loading && !error && (
        <div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Found {transformedPOs.length} purchase orders
          </p>
          <DataTable
            data={transformedPOs}
            columns={columns}
            searchPlaceholder="Search purchase orders by PO number, vendor..."
          />
        </div>
      )}

      {/* Create PO Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Create Purchase Order"
        size="xl"
      >
        <form className="space-y-4" onSubmit={async (e) => {
          e.preventDefault();
          const formData = new FormData(e.currentTarget);
          
          const poData = {
            po_number: `PO-${Date.now()}`,
            supplier_id: formData.get('vendor') as string,
            buyer_id: 'BUYER001',
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

          await createPurchaseOrder(poData);
          setIsModalOpen(false);
          setSelectedItems([]);
        }}>
          <div className="grid grid-cols-2 gap-4">
            <Select
              name="vendor"
              label="Vendor"
              options={vendors.map((vendor) => ({
                value: vendor.vendor_code,
                label: vendor.vendor_name,
              }))}
              required
            />
            <Input type="date" label="Expected Delivery" required />
          </div>
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
                    onClick={() => {
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
                    }}
                  >
                    Add
                  </Button>
                </div>
              </div>
            </div>
            
            {/* Selected Items List */}
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
                        onClick={() => setSelectedItems(selectedItems.filter((_, i) => i !== index))}
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
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">
                  Subtotal:
                </span>
                <span className="font-medium text-gray-900 dark:text-gray-100">
                  ${selectedItems.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0).toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">
                  Tax (10%):
                </span>
                <span className="font-medium text-gray-900 dark:text-gray-100">
                  ${(selectedItems.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0) * 0.1).toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between text-lg font-semibold border-t border-gray-200 dark:border-gray-700 pt-2">
                <span>Total:</span>
                <span className="text-primary-600">
                  ${(selectedItems.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0) * 1.1).toFixed(2)}
                </span>
              </div>
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setIsModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Create PO
            </Button>
          </div>
        </form>
      </Modal>

      {/* View PO Modal */}
      {viewingPO && (
        <Modal
          isOpen={!!viewingPO}
          onClose={() => setViewingPO(null)}
          title={`Purchase Order ${viewingPO.po_number}`}
          size="lg"
        >
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-600 dark:text-gray-400">Vendor</p>
                <p className="font-medium text-gray-900 dark:text-gray-100">
                  {viewingPO.vendor}
                </p>
              </div>
              <div>
                <p className="text-gray-600 dark:text-gray-400">Status</p>
                <div className="mt-1">
                  <Badge
                    variant={
                      viewingPO.status === "received" ? "success" : "warning"
                    }
                  >
                    {viewingPO.status}
                  </Badge>
                </div>
              </div>
              <div>
                <p className="text-gray-600 dark:text-gray-400">Order Date</p>
                <p className="font-medium text-gray-900 dark:text-gray-100">
                  {new Date(viewingPO.date).toLocaleDateString()}
                </p>
              </div>
              <div>
                <p className="text-gray-600 dark:text-gray-400">
                  Expected Delivery
                </p>
                <p className="font-medium text-gray-900 dark:text-gray-100">
                  {new Date(viewingPO.expectedDelivery).toLocaleDateString()}
                </p>
              </div>
            </div>

            <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
              <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">
                Items
              </h4>
              <div className="space-y-2">
                {viewingPO.lines && viewingPO.lines.length > 0 ? (
                  viewingPO.lines.map((item: any, index: number) => (
                    <div
                      key={index}
                      className="flex justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg text-sm"
                    >
                      <div>
                        <p className="font-medium text-gray-900 dark:text-gray-100">
                          {item.description || 'No description'}
                        </p>
                        <p className="text-gray-600 dark:text-gray-400">
                          Qty: {item.quantity || 0} × ${parseFloat(item.unit_price || '0').toFixed(2)}
                        </p>
                      </div>
                      <p className="font-medium text-gray-900 dark:text-gray-100">
                        ${parseFloat(item.line_total || '0').toFixed(2)}
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
