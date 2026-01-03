import React, { useState, useMemo, useEffect } from "react";
import { Plus, Edit, Filter } from "lucide-react";
import { DataTable } from "../components/ui/DataTable";
import { Button } from "../components/ui/Button";
import { Modal } from "../components/ui/Modal";
import { Input } from "../components/ui/Input";
import { Select } from "../components/ui/Select";
import { Badge } from "../components/ui/Badge";
// import { useStore } from "../store/useStore";
import { apiService } from "../services/api";

export const Products: React.FC = () => {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [categories, setCategories] = useState<any[]>([]);
  const [units, setUnits] = useState<any[]>([]);

  useEffect(() => {
    fetchItems();
    fetchMasterData();
  }, []);

  const fetchItems = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiService.getItems();
      setItems(response.data || response || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch items');
    } finally {
      setLoading(false);
    }
  };

  const fetchMasterData = async () => {
    try {
      const [categoriesResponse, unitsResponse] = await Promise.all([
        apiService.getCategories(),
        apiService.getUnits()
      ]);
      setCategories(categoriesResponse.data || categoriesResponse || []);
      setUnits(unitsResponse.data || unitsResponse || []);
    } catch (err) {
      console.error('Failed to fetch master data:', err);
      setCategories([]);
      setUnits([]);
    }
  };

  // Transform items to match UI expectations
  const transformedItems = useMemo(() => {
    if (!Array.isArray(items)) return [];
    return items.map(item => {
      const category = categories.find(cat => cat.id === item.category_id);
      return {
        id: item.id.toString(),
        sku: item.sku,
        name: item.item_name,
        category: category?.category_name || 'Unknown',
        categoryId: item.category_id,
        unit: item.unit_of_measure || 'PC',
        price: parseFloat(item.selling_price || '0'),
        stockQuantity: item.safety_stock || 0,
        reorderLevel: item.reorder_level,
        supplier: item.vendor_code || 'Unknown',
        status: item.safety_stock > item.reorder_level ? 'in-stock' : 
                item.safety_stock > 0 ? 'low-stock' : 'out-of-stock',
        lastUpdated: new Date().toISOString().split('T')[0]
      };
    });
  }, [items, categories]);

  // Filter products
  const filteredProducts = useMemo(() => {
    return transformedItems.filter((product) => {
      const matchesCategory =
        categoryFilter === "all" || product.category === categoryFilter;
      const matchesStatus =
        statusFilter === "all" || product.status === statusFilter;
      return matchesCategory && matchesStatus;
    });
  }, [transformedItems, categoryFilter, statusFilter]);

  const columns = [
    { key: "sku", header: "SKU", sortable: true },
    { key: "name", header: "Product Name", sortable: true },
    { key: "category", header: "Category", sortable: true },
    {
      key: "price",
      header: "Price",
      sortable: true,
      render: (product: any) => `$${product.price.toFixed(2)}`,
    },
    {
      key: "stockQuantity",
      header: "Stock",
      sortable: true,
      render: (product: any) => (
        <span className="font-medium">
          {product.stockQuantity} {product.unit}
        </span>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (product: any) => {
        const variants: Record<string, "success" | "warning" | "danger"> = {
          "in-stock": "success",
          "low-stock": "warning",
          "out-of-stock": "danger",
        };
        return (
          <Badge variant={variants[product.status]}>{product.status}</Badge>
        );
      },
    },
    {
      key: "actions",
      header: "Actions",
      render: (product: any) => (
        <Button
          size="sm"
          variant="ghost"
          onClick={() => {
            setEditingProduct(product);
            setIsModalOpen(true);
          }}
        >
          <Edit size={16} />
        </Button>
      ),
    },
  ];

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
  };

  const categoryOptions = [
    "all",
    ...Array.from(new Set(transformedItems.map((p) => p.category))),
  ];

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const itemData = {
      sku: formData.get('sku') as string,
      item_name: formData.get('name') as string,
      category_id: parseInt(formData.get('category') as string) || undefined,
      unit_of_measure: formData.get('unit') as string,
      unit_cost: formData.get('price') as string,
      selling_price: formData.get('price') as string,
      vendor_code: formData.get('supplier') as string,
      reorder_level: parseInt(formData.get('reorderLevel') as string) || 0,
      safety_stock: parseInt(formData.get('stockQuantity') as string) || 0,
      lead_time_days: 0,
      batch_tracking: false,
      is_active: true,
      discount_allowed: false,
      discount_rate: '0'
    };

    await apiService.createItem(itemData);
    fetchItems();
    handleCloseModal();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            Products
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage your product catalog
          </p>
        </div>
        <Button onClick={() => setIsModalOpen(true)}>
          <Plus size={20} className="mr-2" />
          Add Product
        </Button>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-soft border border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-4">
          <Filter size={20} className="text-gray-400" />
          <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select
              label="Category"
              options={categoryOptions.map((cat) => ({
                value: cat,
                label: cat === "all" ? "All Categories" : cat,
              }))}
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            />
            <Select
              label="Stock Status"
              options={[
                { value: "all", label: "All Status" },
                { value: "in-stock", label: "In Stock" },
                { value: "low-stock", label: "Low Stock" },
                { value: "out-of-stock", label: "Out of Stock" },
              ]}
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Loading and Error States */}
      {loading && (
        <div className="text-center py-8">
          <p className="text-gray-600 dark:text-gray-400">Loading products...</p>
        </div>
      )}
      
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <p className="text-red-600 dark:text-red-400">{error}</p>
        </div>
      )}

      {/* Data Table */}
      {!loading && !error && (
        <DataTable
          data={filteredProducts}
          columns={columns}
          searchPlaceholder="Search products by name, SKU, category..."
        />
      )}

      {/* Add/Edit Product Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingProduct ? "Edit Product" : "Add New Product"}
        size="xl"
      >
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-4">
            <Input
              name="sku"
              label="SKU (uppercase alphanumeric only)"
              placeholder="SKU001"
              defaultValue={editingProduct?.sku}
              onChange={(e) => {
                e.target.value = e.target.value.replace(/[^A-Z0-9]/g, '').toUpperCase();
              }}
              required
            />
            <Input
              name="name"
              label="Product Name"
              placeholder="Product Name"
              defaultValue={editingProduct?.name}
              required
            />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <Select
              name="category"
              label="Category"
              options={Array.isArray(categories) ? categories.map(cat => ({
                value: cat.id.toString(),
                label: cat.category_name
              })) : []}
              defaultValue={editingProduct?.categoryId}
              required
            />
            <Input
              name="price"
              type="number"
              label="Price ($)"
              placeholder="0.00"
              defaultValue={editingProduct?.price}
              step="0.01"
              required
            />
            <Select
              name="unit"
              label="Unit"
              options={Array.isArray(units) ? units.map(unit => ({
                value: unit.unit_id,
                label: `${unit.name} (${unit.unit_id})`
              })) : []}
              defaultValue={editingProduct?.unit}
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input
              name="stockQuantity"
              type="number"
              label="Stock Quantity"
              placeholder="0"
              defaultValue={editingProduct?.stockQuantity}
              required
            />
            <Input
              name="reorderLevel"
              type="number"
              label="Reorder Level"
              placeholder="0"
              defaultValue={editingProduct?.reorderLevel}
              required
            />
          </div>
          <Input
            name="supplier"
            label="Supplier"
            placeholder="Supplier Name"
            defaultValue={editingProduct?.supplier}
            required
          />
          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="secondary"
              onClick={handleCloseModal}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              {editingProduct ? "Update" : "Add"} Product
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
