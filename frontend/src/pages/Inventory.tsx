import React, { useState, useEffect, useMemo } from "react";
import { ArrowDownCircle, ArrowUpCircle } from "lucide-react";
import { DataTable } from "../components/ui/DataTable";
import { Input } from "../components/ui/Input";
import { Select } from "../components/ui/Select";
import { Textarea } from "../components/ui/Textarea";
import { Button } from "../components/ui/Button";
import { Badge } from "../components/ui/Badge";
import { useStore } from "../store/useStore";
import { apiService } from "../services/api";

export const Inventory: React.FC = () => {
  const { items, grns, receipts, loading, error, fetchItems, fetchGRNs, fetchReceipts } = useStore();
  const [transactionType, setTransactionType] = useState<
    "stock-in" | "stock-out"
  >("stock-in");
  const [stockLoading, setStockLoading] = useState(false);
  const [stockError, setStockError] = useState<string | null>(null);
  const [transactions, setTransactions] = useState<any[]>([]);

  useEffect(() => {
    fetchItems();
    fetchGRNs();
    fetchReceipts();
    fetchTransactions();
  }, [fetchItems, fetchGRNs, fetchReceipts]);

  const fetchTransactions = async () => {
    try {
      const data = await apiService.getTransactions();
      setTransactions(data);
    } catch (err) {
      console.error('Failed to fetch transactions:', err);
    }
  };

  const handleStockIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    try {
      setStockLoading(true);
      setStockError(null);
      
      await apiService.stockIn({
        itemId: parseInt(formData.get('itemId') as string),
        quantity: parseInt(formData.get('quantity') as string),
        reference: formData.get('reference') as string,
        notes: formData.get('notes') as string,
      });
      
      await fetchItems();
      const form = e.currentTarget;
      if (form) form.reset();
    } catch (err) {
      setStockError(err instanceof Error ? err.message : 'Failed to update stock');
    } finally {
      setStockLoading(false);
    }
  };

  const handleStockOut = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    try {
      setStockLoading(true);
      setStockError(null);
      
      await apiService.stockOut({
        itemId: parseInt(formData.get('itemId') as string),
        quantity: parseInt(formData.get('quantity') as string),
        reference: formData.get('reference') as string,
        notes: formData.get('notes') as string,
      });
      
      await fetchItems();
      const form = e.currentTarget;
      if (form) form.reset();
    } catch (err) {
      setStockError(err instanceof Error ? err.message : 'Failed to update stock');
    } finally {
      setStockLoading(false);
    }
  };

  // Transform items for display
  const transformedItems = useMemo(() => {
    return items.map(item => ({
      id: item.itemId.toString(),
      sku: item.sku,
      name: item.itemName,
      stockQuantity: item.safetyStock || 0,
    }));
  }, [items]);





  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          Inventory Management
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Track and manage your stock movements
        </p>
      </div>

      {/* Stock In/Out Forms */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Stock-In Form */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-soft border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-success-100 dark:bg-success-900/30">
              <ArrowDownCircle size={24} className="text-success-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Stock-In
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Receive inventory items
              </p>
            </div>
          </div>
          {stockError && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3 mb-4">
              <p className="text-red-600 dark:text-red-400 text-sm">{stockError}</p>
            </div>
          )}
          <form className="space-y-4" onSubmit={handleStockIn}>
            <Select
              name="itemId"
              label="Product"
              options={transformedItems.map((p) => ({
                value: p.id,
                label: `${p.name} (${p.sku})`,
              }))}
              required
            />
            <Input name="quantity" type="number" label="Quantity" placeholder="0" min="1" required />
            <Input name="reference" label="Reference" placeholder="PO-2024-XXX" required />
            <Textarea
              name="notes"
              label="Notes"
              placeholder="Additional information..."
              rows={3}
            />
            <Button type="submit" variant="success" className="w-full" disabled={stockLoading}>
              {stockLoading ? 'Processing...' : 'Record Stock-In'}
            </Button>
          </form>
        </div>

        {/* Stock-Out Form */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-soft border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-warning-100 dark:bg-warning-900/30">
              <ArrowUpCircle size={24} className="text-warning-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Stock-Out
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Issue inventory items
              </p>
            </div>
          </div>
          {stockError && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3 mb-4">
              <p className="text-red-600 dark:text-red-400 text-sm">{stockError}</p>
            </div>
          )}
          <form className="space-y-4" onSubmit={handleStockOut}>
            <Select
              name="itemId"
              label="Product"
              options={transformedItems.map((p) => ({
                value: p.id,
                label: `${p.name} (${p.sku}) - Stock: ${p.stockQuantity}`,
              }))}
              required
            />
            <Input name="quantity" type="number" label="Quantity" placeholder="0" min="1" required />
            <Input
              name="reference"
              label="Reference"
              placeholder="SO-XXX or Department"
              required
            />
            <Textarea
              name="notes"
              label="Notes"
              placeholder="Additional information..."
              rows={3}
            />
            <Button type="submit" className="w-full" disabled={stockLoading}>
              {stockLoading ? 'Processing...' : 'Record Stock-Out'}
            </Button>
          </form>
        </div>
      </div>

      {/* Transaction History */}
      <div>
        <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
          Transaction History
        </h3>
        
        {loading && (
          <div className="text-center py-8">
            <p className="text-gray-600 dark:text-gray-400">Loading transactions...</p>
          </div>
        )}
        
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
            <p className="text-red-600 dark:text-red-400">{error}</p>
          </div>
        )}

        {!loading && !error && (
          <DataTable
            data={transactions.map(tx => ({
              id: tx.transactionId,
              type: tx.transactionType === 'stock-in' ? 'Stock In' : 'Stock Out',
              product: tx.item?.itemName || 'Unknown Item',
              quantity: `${tx.transactionType === 'stock-in' ? '+' : '-'}${tx.quantity}`,
              date: new Date(tx.transactionDate).toLocaleDateString(),
              reference: tx.reference || 'N/A',
              performedBy: tx.performedBy || 'System'
            }))}
            columns={[
              { key: "type", header: "Type", sortable: true },
              { key: "product", header: "Product", sortable: true },
              { key: "quantity", header: "Quantity", sortable: true },
              { key: "date", header: "Date", sortable: true },
              { key: "reference", header: "Reference", sortable: true },
              { key: "performedBy", header: "Performed By", sortable: true },
            ]}
            searchPlaceholder="Search transactions by product, reference..."
          />
        )}
      </div>
    </div>
  );
};
