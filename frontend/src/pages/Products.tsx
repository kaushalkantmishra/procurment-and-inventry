import React, { useState, useMemo, useEffect } from "react";
import { Plus, Edit, Filter } from "lucide-react";
import { DataTable } from "../components/ui/DataTable";
import { Button } from "../components/ui/Button";
import { Modal } from "../components/ui/Modal";
import { Input } from "../components/ui/Input";
import { Select } from "../components/ui/Select";
import { Badge } from "../components/ui/Badge";
import { useStore } from "../store/useStore";
import { apiService } from "../services/api";

export const Products: React.FC = () => {
  const { items, loading, error, fetchItems, createItem } = useStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [categories, setCategories] = useState<any[]>([]);
  const [units, setUnits] = useState<any[]>([]);

  useEffect(() => {
    fetchItems();
    fetchMasterData();
  }, [fetchItems]);

  const fetchMasterData = async () => {
    try {
      const [categoriesData, unitsData] = await Promise.all([
        apiService.getCategories(),
        apiService.getUnits()
      ]);
      setCategories(categoriesData);
      setUnits(unitsData);
    } catch (err) {
      console.error('Failed to fetch master data:', err);
    }
  };

  // Transform items to match UI expectations
  const transformedItems = useMemo(() => {
    return items.map(item => {
      const category = categories.find(cat => cat.categoryId === item.categoryId);
      return {
        id: item.itemId.toString(),
        sku: item.sku,
        name: item.itemName,
        category: category?.categoryName || 'Unknown',
        categoryId: item.categoryId,
        unit: item.unitOfMeasure || 'PC',
        price: parseFloat(item.sellingPrice || '0'),
        stockQuantity: item.safetyStock || 0,
        reorderLevel: item.reorderLevel,
        supplier: item.vendorCode || 'Unknown',
        status: item.safetyStock > item.reorderLevel ? 'in-stock' : 
                item.safetyStock > 0 ? 'low-stock' : 'out-of-stock',
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
      itemName: formData.get('name') as string,
      categoryId: parseInt(formData.get('category') as string) || null,
      unitOfMeasure: formData.get('unit') as string,
      unitCost: formData.get('price') as string,
      sellingPrice: formData.get('price') as string,
      vendorCode: formData.get('supplier') as string,
      reorderLevel: parseInt(formData.get('reorderLevel') as string) || 0,
      safetyStock: parseInt(formData.get('stockQuantity') as string) || 0,
      leadTimeDays: 0,
      batchTracking: false,
      isActive: true,
      discountAllowed: false,
      discountRate: '0'
    };

    await createItem(itemData);
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
              options={categories.map(cat => ({
                value: cat.categoryId.toString(),
                label: cat.categoryName
              }))}
              defaultValue={editingProduct?.category}
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
              options={units.map(unit => ({
                value: unit.unitId,
                label: `${unit.name} (${unit.unitId})`
              }))}
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
