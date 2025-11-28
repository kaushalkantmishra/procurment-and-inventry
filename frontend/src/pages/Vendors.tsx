import React, { useState, useEffect } from "react";
import { Plus, Edit, Mail, Phone } from "lucide-react";
import { DataTable } from "../components/ui/DataTable";
import { Button } from "../components/ui/Button";
import { Modal } from "../components/ui/Modal";
import { Input } from "../components/ui/Input";
import { Select } from "../components/ui/Select";
import { Badge } from "../components/ui/Badge";
import { apiService } from "../services/api";

export const Vendors: React.FC = () => {
  const [vendors, setVendors] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingVendor, setEditingVendor] = useState<any | null>(null);

  const fetchVendors = async () => {
    try {
      setLoading(true);
      const data = await apiService.getVendors();
      setVendors(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch vendors');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVendors();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const vendorData = {
      vendorCode: formData.get('vendorCode') as string,
      vendorName: formData.get('vendorName') as string,
      contactPerson: formData.get('contactPerson') as string,
      email: formData.get('email') as string,
      phone: formData.get('phone') as string,
      address: formData.get('address') as string,
      city: formData.get('city') as string,
      country: formData.get('country') as string,
      paymentTerms: formData.get('paymentTerms') as string,
      isActive: formData.get('isActive') === 'true',
    };

    try {
      await apiService.createVendor(vendorData);
      await fetchVendors();
      setIsModalOpen(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create vendor');
    }
  };

  const columns = [
    { key: "vendorCode", header: "Code", sortable: true },
    { key: "vendorName", header: "Vendor Name", sortable: true },
    {
      key: "contact",
      header: "Contact",
      render: (vendor: any) => (
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-sm">
            <Mail size={14} className="text-gray-400" />
            <span>{vendor.email}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <Phone size={14} className="text-gray-400" />
            <span>{vendor.phone}</span>
          </div>
        </div>
      ),
    },
    { key: "city", header: "City", sortable: true },
    { key: "paymentTerms", header: "Payment Terms" },
    {
      key: "status",
      header: "Status",
      render: (vendor: any) => (
        <Badge variant={vendor.isActive ? "success" : "default"}>
          {vendor.isActive ? "Active" : "Inactive"}
        </Badge>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      render: (vendor: any) => (
        <Button
          size="sm"
          variant="ghost"
          onClick={() => {
            setEditingVendor(vendor);
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
    setEditingVendor(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            Vendors
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage your supplier relationships
          </p>
        </div>
        <Button onClick={() => setIsModalOpen(true)}>
          <Plus size={20} className="mr-2" />
          Add Vendor
        </Button>
      </div>

      {loading && (
        <div className="text-center py-8">
          <p className="text-gray-600 dark:text-gray-400">Loading vendors...</p>
        </div>
      )}
      
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <p className="text-red-600 dark:text-red-400">{error}</p>
        </div>
      )}

      {!loading && !error && (
        <DataTable
          data={vendors}
          columns={columns}
          searchPlaceholder="Search vendors by name, code, contact..."
        />
      )}

      {/* Add/Edit Vendor Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingVendor ? "Edit Vendor" : "Add New Vendor"}
        size="lg"
      >
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-4">
            <Input
              name="vendorCode"
              label="Vendor Code"
              placeholder="VEN001"
              defaultValue={editingVendor?.vendorCode}
              required
            />
            <Input
              name="vendorName"
              label="Vendor Name"
              placeholder="Company Name"
              defaultValue={editingVendor?.vendorName}
              required
            />
          </div>
          <Input
            name="contactPerson"
            label="Contact Person"
            placeholder="John Doe"
            defaultValue={editingVendor?.contactPerson}
          />
          <div className="grid grid-cols-2 gap-4">
            <Input
              name="email"
              type="email"
              label="Email"
              placeholder="vendor@example.com"
              defaultValue={editingVendor?.email}
            />
            <Input
              name="phone"
              type="tel"
              label="Phone"
              placeholder="+1-555-0100"
              defaultValue={editingVendor?.phone}
            />
          </div>
          <Input
            name="address"
            label="Address"
            placeholder="123 Street, City, State"
            defaultValue={editingVendor?.address}
          />
          <div className="grid grid-cols-3 gap-4">
            <Input
              name="city"
              label="City"
              placeholder="New York"
              defaultValue={editingVendor?.city}
            />
            <Input
              name="country"
              label="Country"
              placeholder="USA"
              defaultValue={editingVendor?.country}
            />
            <Select
              name="paymentTerms"
              label="Payment Terms"
              options={[
                { value: "net-30", label: "Net 30" },
                { value: "net-60", label: "Net 60" },
                { value: "cod", label: "COD" },
              ]}
              defaultValue={editingVendor?.paymentTerms}
            />
          </div>
          <Select
            name="isActive"
            label="Status"
            options={[
              { value: "true", label: "Active" },
              { value: "false", label: "Inactive" },
            ]}
            defaultValue={editingVendor?.isActive ? "true" : "false"}
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
              {editingVendor ? "Update" : "Add"} Vendor
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};