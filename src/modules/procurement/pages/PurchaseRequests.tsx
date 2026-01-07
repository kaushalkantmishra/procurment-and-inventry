import React, { useState, useEffect } from 'react';
import { Plus, Eye, Edit, Trash2, Send } from 'lucide-react';
import { DataTable } from '../../../components/ui/DataTable';
import { Button } from '../../../components/ui/Button';
import { Modal } from '../../../components/ui/Modal';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Textarea } from '../../../components/ui/Textarea';
import { Badge } from '../../../components/ui/Badge';
import { apiService } from '../../../services/api';

export const PurchaseRequests: React.FC = () => {
  const [purchaseRequests, setPurchaseRequests] = useState<any[]>([]);
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewingPR, setViewingPR] = useState<any | null>(null);
  const [editingPR, setEditingPR] = useState<any | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [prsResponse, itemsResponse] = await Promise.all([
        apiService.getPurchaseRequests(),
        apiService.getItems()
      ]);
      
      const prs = Array.isArray(prsResponse?.data) ? prsResponse.data : Array.isArray(prsResponse) ? prsResponse : [];
      const itemsData = Array.isArray(itemsResponse?.data) ? itemsResponse.data : Array.isArray(itemsResponse) ? itemsResponse : [];
      
      setPurchaseRequests(prs);
      setItems(itemsData);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (formData: FormData) => {
    const selectedItemId = parseInt(formData.get('itemId') as string);
    const quantity = parseInt(formData.get('quantity') as string);
    const unitPrice = parseFloat(formData.get('unitPrice') as string);
    
    const prData = {
      requesting_department: formData.get('department') as string,
      requester_employee_code: 'EMP001',
      required_date: formData.get('requiredDate') as string,
      item_id: selectedItemId,
      quantity: quantity,
      estimated_unit_price: unitPrice.toString(),
      total_estimated_cost: (quantity * unitPrice).toString(),
      justification: formData.get('justification') as string,
      status: 'Saved'
    };

    try {
      if (editingPR) {
        await apiService.updatePurchaseRequest(editingPR.id, prData);
      } else {
        await apiService.createPurchaseRequest(prData);
      }
      await fetchData();
      setIsModalOpen(false);
      setEditingPR(null);
    } catch (error) {
      console.error('Failed to save PR:', error);
    }
  };

  const handleSubmitForApproval = async (id: number) => {
    try {
      await apiService.updatePurchaseRequest(id, { status: 'Submitted' });
      await fetchData();
    } catch (error) {
      console.error('Failed to submit PR:', error);
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this purchase request?')) {
      try {
        await apiService.deletePurchaseRequest(id);
        await fetchData();
      } catch (error) {
        console.error('Failed to delete PR:', error);
      }
    }
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'Saved': return 'default';
      case 'Submitted': return 'warning';
      case 'Approved': return 'success';
      case 'Rejected': return 'danger';
      default: return 'default';
    }
  };

  const columns = [
    { key: 'id', header: 'PR ID', sortable: true },
    { key: 'requesting_department', header: 'Department', sortable: true },
    {
      key: 'date_of_request',
      header: 'Request Date',
      render: (pr: any) => new Date(pr.date_of_request).toLocaleDateString()
    },
    {
      key: 'required_date',
      header: 'Required Date',
      render: (pr: any) => new Date(pr.required_date).toLocaleDateString()
    },
    {
      key: 'total_estimated_cost',
      header: 'Estimated Cost',
      render: (pr: any) => `$${parseFloat(pr.total_estimated_cost || '0').toFixed(2)}`
    },
    {
      key: 'status',
      header: 'Status',
      render: (pr: any) => (
        <Badge variant={getStatusVariant(pr.status)}>{pr.status}</Badge>
      )
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (pr: any) => (
        <div className="flex gap-2">
          <Button size="sm" variant="ghost" onClick={() => setViewingPR(pr)}>
            <Eye size={16} />
          </Button>
          {pr.status === 'Saved' && (
            <>
              <Button size="sm" variant="ghost" onClick={() => { setEditingPR(pr); setIsModalOpen(true); }}>
                <Edit size={16} />
              </Button>
              <Button size="sm" variant="ghost" onClick={() => handleSubmitForApproval(pr.id)}>
                <Send size={16} />
              </Button>
              <Button size="sm" variant="ghost" onClick={() => handleDelete(pr.id)}>
                <Trash2 size={16} />
              </Button>
            </>
          )}
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            Purchase Requests
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Create and manage purchase requests
          </p>
        </div>
        <Button onClick={() => setIsModalOpen(true)}>
          <Plus size={20} className="mr-2" />
          Create PR
        </Button>
      </div>

      {loading ? (
        <div className="text-center py-8">
          <p className="text-gray-600 dark:text-gray-400">Loading purchase requests...</p>
        </div>
      ) : (
        <DataTable
          data={purchaseRequests}
          columns={columns}
          searchPlaceholder="Search purchase requests..."
        />
      )}

      {/* Create/Edit PR Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => { setIsModalOpen(false); setEditingPR(null); }}
        title={editingPR ? 'Edit Purchase Request' : 'Create Purchase Request'}
        size="lg"
      >
        <form onSubmit={(e) => { e.preventDefault(); handleSubmit(new FormData(e.currentTarget)); }} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input name="department" label="Department" defaultValue={editingPR?.requesting_department} required />
            <Input name="requiredDate" type="date" label="Required Date" defaultValue={editingPR?.required_date} required />
          </div>
          <Select
            name="itemId"
            label="Item"
            options={items.map(item => ({ value: item.id.toString(), label: `${item.item_name} (${item.sku})` }))}
            defaultValue={editingPR?.item_id?.toString()}
            required
          />
          <div className="grid grid-cols-2 gap-4">
            <Input name="quantity" type="number" label="Quantity" defaultValue={editingPR?.quantity} required />
            <Input name="unitPrice" type="number" step="0.01" label="Estimated Unit Price" defaultValue={editingPR?.estimated_unit_price} required />
          </div>
          <Textarea name="justification" label="Justification" defaultValue={editingPR?.justification} required />
          <div className="flex justify-end gap-3">
            <Button type="button" variant="secondary" onClick={() => { setIsModalOpen(false); setEditingPR(null); }}>
              Cancel
            </Button>
            <Button type="submit">
              {editingPR ? 'Update' : 'Create'} PR
            </Button>
          </div>
        </form>
      </Modal>

      {/* View PR Modal */}
      {viewingPR && (
        <Modal
          isOpen={!!viewingPR}
          onClose={() => setViewingPR(null)}
          title={`Purchase Request #${viewingPR.id}`}
          size="lg"
        >
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-600 dark:text-gray-400">Department</p>
                <p className="font-medium">{viewingPR.requesting_department}</p>
              </div>
              <div>
                <p className="text-gray-600 dark:text-gray-400">Status</p>
                <Badge variant={getStatusVariant(viewingPR.status)}>{viewingPR.status}</Badge>
              </div>
              <div>
                <p className="text-gray-600 dark:text-gray-400">Request Date</p>
                <p className="font-medium">{new Date(viewingPR.date_of_request).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-gray-600 dark:text-gray-400">Required Date</p>
                <p className="font-medium">{new Date(viewingPR.required_date).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-gray-600 dark:text-gray-400">Quantity</p>
                <p className="font-medium">{viewingPR.quantity}</p>
              </div>
              <div>
                <p className="text-gray-600 dark:text-gray-400">Total Cost</p>
                <p className="font-medium">${parseFloat(viewingPR.total_estimated_cost || '0').toFixed(2)}</p>
              </div>
            </div>
            <div>
              <p className="text-gray-600 dark:text-gray-400 mb-2">Justification</p>
              <p className="text-sm bg-gray-50 dark:bg-gray-700 p-3 rounded">{viewingPR.justification}</p>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};