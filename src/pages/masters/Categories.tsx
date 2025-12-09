import React, { useState, useEffect } from "react";
import { Plus, Edit } from "lucide-react";
import { DataTable } from "../../components/ui/DataTable";
import { Button } from "../../components/ui/Button";
import { Modal } from "../../components/ui/Modal";
import { Input } from "../../components/ui/Input";
import { Textarea } from "../../components/ui/Textarea";
import { apiService } from "../../services/api";

export const Categories: React.FC = () => {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<any | null>(null);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const data = await apiService.getCategories();
      setCategories(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch categories');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const categoryData = {
      categoryName: formData.get('categoryName') as string,
      categoryCode: formData.get('categoryCode') as string,
      description: formData.get('description') as string,
    };

    try {
      await apiService.createCategory(categoryData);
      await fetchCategories();
      setIsModalOpen(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create category');
    }
  };

  const columns = [
    { key: "categoryId", header: "ID", sortable: true },
    { key: "categoryName", header: "Name", sortable: true },
    { key: "categoryCode", header: "Code", sortable: true },
    { key: "description", header: "Description" },
    {
      key: "actions",
      header: "Actions",
      render: (category: any) => (
        <Button
          size="sm"
          variant="ghost"
          onClick={() => {
            setEditingCategory(category);
            setIsModalOpen(true);
          }}
        >
          <Edit size={16} />
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            Categories
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage product categories
          </p>
        </div>
        <Button onClick={() => setIsModalOpen(true)}>
          <Plus size={20} className="mr-2" />
          Add Category
        </Button>
      </div>

      {loading && (
        <div className="text-center py-8">
          <p className="text-gray-600 dark:text-gray-400">Loading categories...</p>
        </div>
      )}
      
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <p className="text-red-600 dark:text-red-400">{error}</p>
        </div>
      )}

      {!loading && !error && (
        <DataTable
          data={categories}
          columns={columns}
          searchPlaceholder="Search categories..."
        />
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingCategory(null);
        }}
        title={editingCategory ? "Edit Category" : "Add New Category"}
      >
        <form className="space-y-4" onSubmit={handleSubmit}>
          <Input
            name="categoryName"
            label="Category Name"
            placeholder="Electronics"
            defaultValue={editingCategory?.categoryName}
            required
          />
          <Input
            name="categoryCode"
            label="Category Code"
            placeholder="ELEC"
            defaultValue={editingCategory?.categoryCode}
            required
          />
          <Textarea
            name="description"
            label="Description"
            placeholder="Category description..."
            defaultValue={editingCategory?.description}
            rows={3}
          />
          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                setIsModalOpen(false);
                setEditingCategory(null);
              }}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              {editingCategory ? "Update" : "Add"} Category
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};