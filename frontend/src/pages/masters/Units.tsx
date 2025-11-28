import React, { useState, useEffect } from "react";
import { Plus, Edit } from "lucide-react";
import { DataTable } from "../../components/ui/DataTable";
import { Button } from "../../components/ui/Button";
import { Modal } from "../../components/ui/Modal";
import { Input } from "../../components/ui/Input";
import { apiService } from "../../services/api";

export const Units: React.FC = () => {
  const [units, setUnits] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUnit, setEditingUnit] = useState<any | null>(null);

  const fetchUnits = async () => {
    try {
      setLoading(true);
      const data = await apiService.getUnits();
      setUnits(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch units');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUnits();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const unitData = {
      unitId: formData.get('unitId') as string,
      name: formData.get('name') as string,
      abbreviation: formData.get('abbreviation') as string,
    };

    try {
      await apiService.createUnit(unitData);
      await fetchUnits();
      setIsModalOpen(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create unit');
    }
  };

  const columns = [
    { key: "unitId", header: "Unit ID", sortable: true },
    { key: "name", header: "Name", sortable: true },
    { key: "abbreviation", header: "Abbreviation", sortable: true },
    {
      key: "actions",
      header: "Actions",
      render: (unit: any) => (
        <Button
          size="sm"
          variant="ghost"
          onClick={() => {
            setEditingUnit(unit);
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
            Units of Measure
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage units of measure
          </p>
        </div>
        <Button onClick={() => setIsModalOpen(true)}>
          <Plus size={20} className="mr-2" />
          Add Unit
        </Button>
      </div>

      {loading && (
        <div className="text-center py-8">
          <p className="text-gray-600 dark:text-gray-400">Loading units...</p>
        </div>
      )}
      
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <p className="text-red-600 dark:text-red-400">{error}</p>
        </div>
      )}

      {!loading && !error && (
        <DataTable
          data={units}
          columns={columns}
          searchPlaceholder="Search units..."
        />
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingUnit(null);
        }}
        title={editingUnit ? "Edit Unit" : "Add New Unit"}
      >
        <form className="space-y-4" onSubmit={handleSubmit}>
          <Input
            name="unitId"
            label="Unit ID"
            placeholder="KG"
            defaultValue={editingUnit?.unitId}
            required
          />
          <Input
            name="name"
            label="Unit Name"
            placeholder="Kilogram"
            defaultValue={editingUnit?.name}
            required
          />
          <Input
            name="abbreviation"
            label="Abbreviation"
            placeholder="kg"
            defaultValue={editingUnit?.abbreviation}
          />
          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                setIsModalOpen(false);
                setEditingUnit(null);
              }}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              {editingUnit ? "Update" : "Add"} Unit
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};