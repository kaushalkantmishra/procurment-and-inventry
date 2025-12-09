import React, { useState, useEffect } from "react";
import { Plus, Edit } from "lucide-react";
import { DataTable } from "../../components/ui/DataTable";
import { Button } from "../../components/ui/Button";
import { Modal } from "../../components/ui/Modal";
import { Input } from "../../components/ui/Input";
import { Select } from "../../components/ui/Select";
import { Badge } from "../../components/ui/Badge";
import { apiService } from "../../services/api";

export const Warehouses: React.FC = () => {
  const [warehouses, setWarehouses] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingWarehouse, setEditingWarehouse] = useState<any | null>(null);

  const fetchWarehouses = async () => {
    try {
      setLoading(true);
      const data = await apiService.getWarehouses();
      setWarehouses(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch warehouses');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWarehouses();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const warehouseData = {
      warehouseCode: (formData.get('warehouseCode') as string).substring(0, 20),
      warehouseName: (formData.get('warehouseName') as string).substring(0, 100),
      streetAddress: formData.get('streetAddress') as string,
      city: (formData.get('city') as string)?.substring(0, 100),
      countryCode: (formData.get('countryCode') as string)?.substring(0, 10),
      isActive: formData.get('isActive') === 'true',
      dateOpened: formData.get('dateOpened') as string || null,
    };

    try {
      await apiService.createWarehouse(warehouseData);
      await fetchWarehouses();
      setIsModalOpen(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create warehouse');
    }
  };

  const columns = [
    { key: "warehouseCode", header: "Code", sortable: true },
    { key: "warehouseName", header: "Name", sortable: true },
    { key: "city", header: "City", sortable: true },
    { key: "countryCode", header: "Country", sortable: true },
    {
      key: "isActive",
      header: "Status",
      render: (warehouse: any) => (
        <Badge variant={warehouse.isActive ? "success" : "danger"}>
          {warehouse.isActive ? "Active" : "Inactive"}
        </Badge>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      render: (warehouse: any) => (
        <Button
          size="sm"
          variant="ghost"
          onClick={() => {
            setEditingWarehouse(warehouse);
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
            Warehouses
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage warehouse locations
          </p>
        </div>
        <Button onClick={() => setIsModalOpen(true)}>
          <Plus size={20} className="mr-2" />
          Add Warehouse
        </Button>
      </div>

      {loading && (
        <div className="text-center py-8">
          <p className="text-gray-600 dark:text-gray-400">Loading warehouses...</p>
        </div>
      )}
      
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <p className="text-red-600 dark:text-red-400">{error}</p>
        </div>
      )}

      {!loading && !error && (
        <DataTable
          data={warehouses}
          columns={columns}
          searchPlaceholder="Search warehouses..."
        />
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingWarehouse(null);
        }}
        title={editingWarehouse ? "Edit Warehouse" : "Add New Warehouse"}
        size="lg"
      >
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-4">
            <Input
              name="warehouseCode"
              label="Warehouse Code (max 20 chars)"
              placeholder="WH001"
              maxLength={20}
              defaultValue={editingWarehouse?.warehouseCode}
              required
            />
            <Input
              name="warehouseName"
              label="Warehouse Name"
              placeholder="Main Warehouse"
              defaultValue={editingWarehouse?.warehouseName}
              required
            />
          </div>
          <Input
            name="streetAddress"
            label="Street Address"
            placeholder="123 Main Street"
            defaultValue={editingWarehouse?.streetAddress}
          />
          <div className="grid grid-cols-2 gap-4">
            <Input
              name="city"
              label="City"
              placeholder="New York"
              defaultValue={editingWarehouse?.city}
            />
            <Input
              name="countryCode"
              label="Country Code (max 10 chars)"
              placeholder="US"
              maxLength={10}
              defaultValue={editingWarehouse?.countryCode}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input
              name="dateOpened"
              type="date"
              label="Date Opened"
              defaultValue={editingWarehouse?.dateOpened}
            />
            <Select
              name="isActive"
              label="Status"
              options={[
                { value: "true", label: "Active" },
                { value: "false", label: "Inactive" },
              ]}
              defaultValue={editingWarehouse?.isActive ? "true" : "false"}
              required
            />
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                setIsModalOpen(false);
                setEditingWarehouse(null);
              }}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              {editingWarehouse ? "Update" : "Add"} Warehouse
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};