import React, { useState, useEffect } from 'react';
import { Plus, Eye, Edit, Trash2, Send, X, Upload, FileText } from 'lucide-react';
import { DataTable } from '../../../components/ui/DataTable';
import { Button } from '../../../components/ui/Button';
import { Modal } from '../../../components/ui/Modal';
import { Input } from '../../../components/ui/Input';
import { Textarea } from '../../../components/ui/Textarea';
import { Badge } from '../../../components/ui/Badge';
import { apiService } from '../../../services/api';
import { 
  PurchaseRequest, 
  PRLine, 
  PRAttachment, 
  PRStatus, 
  PRStatusVariant,
  Item 
} from '../types';

export const PurchaseRequests: React.FC = () => {
  const [purchaseRequests, setPurchaseRequests] = useState<PurchaseRequest[]>([]);
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewingPR, setViewingPR] = useState<PurchaseRequest | null>(null);
  const [editingPR, setEditingPR] = useState<PurchaseRequest | null>(null);
  const [prLines, setPrLines] = useState<PRLine[]>([{ item_id: 0, quantity: 1, estimated_unit_price: '' }]);
  const [attachments, setAttachments] = useState<PRAttachment[]>([]);
  const [viewingImage, setViewingImage] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'draft' | 'submitted'>('draft');
  const [confirmSubmitPR, setConfirmSubmitPR] = useState<number | null>(null);

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
    const formDataToSend = new FormData();
    
    // Add form fields
    formDataToSend.append('requesting_department', formData.get('department') as string);
    formDataToSend.append('required_date', formData.get('requiredDate') as string);
    formDataToSend.append('justification', formData.get('justification') as string);
    formDataToSend.append('maintenance_work_order', formData.get('maintenanceWorkOrder') as string || '');
    
    // Add lines as JSON
    const validLines = prLines.filter(line => line.item_id > 0 && line.quantity > 0);
    formDataToSend.append('lines', JSON.stringify(validLines));
    
    // Add files
    attachments.forEach(attachment => {
      formDataToSend.append('attachments', attachment.file);
    });

    try {
      if (editingPR) {
        await apiService.updatePurchaseRequest(editingPR.id, {
          requesting_department: formData.get('department') as string,
          required_date: formData.get('requiredDate') as string,
          justification: formData.get('justification') as string,
          maintenance_work_order: formData.get('maintenanceWorkOrder') as string || null
        });
      } else {
        await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3001/api'}/purchase-requests`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
          },
          body: formDataToSend
        });
      }
      await fetchData();
      setIsModalOpen(false);
      setEditingPR(null);
      setPrLines([{ item_id: 0, quantity: 1, estimated_unit_price: '' }]);
      setAttachments([]);
    } catch (error) {
      console.error('Failed to save PR:', error);
    }
  };

  const handleSubmitForApproval = async (id: number) => {
    try {
      // Get current PR data to preserve existing fields
      const currentPR = await apiService.getPurchaseRequestById(id);
      const prData = currentPR.data || currentPR;
      
      await apiService.updatePurchaseRequest(id, { 
        requesting_department: prData.requesting_department,
        required_date: prData.required_date,
        justification: prData.justification,
        maintenance_work_order: prData.maintenance_work_order,
        status: 'Submitted' 
      });
      await fetchData();
      setConfirmSubmitPR(null);
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

  const addLine = () => {
    setPrLines([...prLines, { item_id: 0, quantity: 1, estimated_unit_price: '' }]);
  };

  const removeLine = (index: number) => {
    if (prLines.length > 1) {
      setPrLines(prLines.filter((_, i) => i !== index));
    }
  };

  const addAttachment = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const newAttachments = Array.from(files).map(file => ({
        file,
        name: file.name
      }));
      setAttachments([...attachments, ...newAttachments]);
    }
  };

  const removeAttachment = (index: number) => {
    setAttachments(attachments.filter((_, i) => i !== index));
  };

  const updateLine = (index: number, field: keyof PRLine, value: any) => {
    const updatedLines = [...prLines];
    updatedLines[index] = { ...updatedLines[index], [field]: value };
    setPrLines(updatedLines);
  };

  const viewPRDetails = async (pr: any) => {
    try {
      const details = await apiService.getPurchaseRequestById(pr.id);
      setViewingPR(details.data || details);
    } catch (error) {
      console.error('Failed to fetch PR details:', error);
      setViewingPR(pr);
    }
  };

  const getStatusVariant = (status: string): PRStatusVariant => {
    switch (status) {
      case PRStatus.SAVED: return 'default';
      case PRStatus.SUBMITTED: return 'warning';
      case PRStatus.APPROVED: return 'success';
      case PRStatus.REJECTED: return 'danger';
      default: return 'default';
    }
  };

  const filteredPurchaseRequests = purchaseRequests.filter(pr => {
    if (activeTab === 'draft') {
      return pr.status === 'Saved';
    } else {
      return pr.status !== 'Saved';
    }
  });

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
      render: (pr: any) => pr.required_date ? new Date(pr.required_date).toLocaleDateString() : 'N/A'
    },
    {
      key: 'status',
      header: 'Status',
      render: (pr: PurchaseRequest) => (
        <Badge variant={getStatusVariant(pr.status)}>{pr.status}</Badge>
      )
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (pr: any) => (
        <div className="flex gap-2">
          <Button size="sm" variant="ghost" onClick={() => viewPRDetails(pr)}>
            <Eye size={16} />
          </Button>
          {pr.status === 'Saved' && (
            <>
              <Button size="sm" variant="ghost" onClick={() => { setEditingPR(pr); setIsModalOpen(true); }}>
                <Edit size={16} />
              </Button>
              <Button size="sm" variant="ghost" onClick={() => setConfirmSubmitPR(pr.id)}>
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
            Create and manage purchase requests with multiple line items
          </p>
        </div>
        <Button onClick={() => { setIsModalOpen(true); setPrLines([{ item_id: 0, quantity: 1, estimated_unit_price: '' }]); }}>
          <Plus size={20} className="mr-2" />
          Create PR
        </Button>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('draft')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'draft'
                ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
          >
            Draft ({purchaseRequests.filter(pr => pr.status === 'Saved').length})
          </button>
          <button
            onClick={() => setActiveTab('submitted')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'submitted'
                ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
          >
            Submitted ({purchaseRequests.filter(pr => pr.status !== 'Saved').length})
          </button>
        </nav>
      </div>

      {loading ? (
        <div className="text-center py-8">
          <p className="text-gray-600 dark:text-gray-400">Loading purchase requests...</p>
        </div>
      ) : (
        <DataTable
          data={filteredPurchaseRequests}
          columns={columns}
          searchPlaceholder={`Search ${activeTab} purchase requests...`}
        />
      )}

      {/* Create/Edit PR Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => { setIsModalOpen(false); setEditingPR(null); setPrLines([{ item_id: 0, quantity: 1, estimated_unit_price: '' }]); }}
        title={editingPR ? 'Edit Purchase Request' : 'Create Purchase Request'}
        size="xl"
      >
        <form onSubmit={(e) => { e.preventDefault(); handleSubmit(new FormData(e.currentTarget)); }} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <Input 
              name="department" 
              label="Department" 
              defaultValue={editingPR?.requesting_department} 
              required 
            />
            <Input 
              name="requiredDate" 
              type="date" 
              label="Required Date" 
              defaultValue={editingPR?.required_date} 
              required 
            />
          </div>
          
          <Input 
            name="maintenanceWorkOrder" 
            label="Maintenance Work Order (Optional)" 
            defaultValue={editingPR?.maintenance_work_order} 
          />
          
          <Textarea 
            name="justification" 
            label="Justification" 
            defaultValue={editingPR?.justification} 
            required 
          />

          {!editingPR && (
            <>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium">Line Items</h3>
                  <Button type="button" onClick={addLine} size="sm">
                    <Plus size={16} className="mr-1" />
                    Add Line
                  </Button>
                </div>
                
                <div className="space-y-3 max-h-60 overflow-y-auto">
                  {prLines.map((line, index) => (
                    <div key={index} className="grid grid-cols-12 gap-2 items-end p-3 bg-gray-50 dark:bg-gray-700 rounded">
                      <div className="col-span-5">
                        <label className="block text-sm font-medium mb-1">Item</label>
                        <select
                          value={line.item_id}
                          onChange={(e) => updateLine(index, 'item_id', parseInt(e.target.value))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-600 dark:border-gray-500"
                          required
                        >
                          <option value={0}>Select Item</option>
                          {items.map(item => (
                            <option key={item.id} value={item.id}>
                              {item.item_name} ({item.sku})
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="col-span-2">
                        <label className="block text-sm font-medium mb-1">Quantity</label>
                        <input
                          type="number"
                          min="1"
                          value={line.quantity}
                          onChange={(e) => updateLine(index, 'quantity', parseInt(e.target.value))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-600 dark:border-gray-500"
                          required
                        />
                      </div>
                      <div className="col-span-4">
                        <label className="block text-sm font-medium mb-1">Est. Unit Price</label>
                        <input
                          type="number"
                          step="0.01"
                          min="0"
                          value={line.estimated_unit_price || ''}
                          onChange={(e) => updateLine(index, 'estimated_unit_price', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-600 dark:border-gray-500"
                        />
                      </div>
                      <div className="col-span-1">
                        {prLines.length > 1 && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeLine(index)}
                            className="text-red-600 hover:text-red-800"
                          >
                            <X size={16} />
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium">Attachments</h3>
                  <div>
                    <input
                      type="file"
                      multiple
                      onChange={addAttachment}
                      className="hidden"
                      accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                      id="file-upload"
                    />
                    <Button 
                      type="button" 
                      size="sm" 
                      onClick={() => document.getElementById('file-upload')?.click()}
                    >
                      <Upload size={16} className="mr-1" />
                      Add Files
                    </Button>
                  </div>
                </div>
                
                {attachments.length > 0 && (
                  <div className="space-y-2 max-h-32 overflow-y-auto">
                    {attachments.map((attachment, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded">
                        <div className="flex items-center gap-2">
                          <FileText size={16} />
                          <span className="text-sm">{attachment.name}</span>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeAttachment(index)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <X size={16} />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
          
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button 
              type="button" 
              variant="secondary" 
              onClick={() => { 
                setIsModalOpen(false); 
                setEditingPR(null); 
                setPrLines([{ item_id: 0, quantity: 1, estimated_unit_price: '' }]); 
              }}
            >
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
          size="xl"
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
                <p className="font-medium">{viewingPR.required_date ? new Date(viewingPR.required_date).toLocaleDateString() : 'N/A'}</p>
              </div>
              {viewingPR.maintenance_work_order && (
                <div className="col-span-2">
                  <p className="text-gray-600 dark:text-gray-400">Maintenance Work Order</p>
                  <p className="font-medium">{viewingPR.maintenance_work_order}</p>
                </div>
              )}
            </div>
            <div>
              <p className="text-gray-600 dark:text-gray-400 mb-2">Justification</p>
              <p className="text-sm bg-gray-50 dark:bg-gray-700 p-3 rounded">{viewingPR.justification}</p>
            </div>
            
            {viewingPR.lines && viewingPR.lines.length > 0 && (
              <div>
                <p className="text-gray-600 dark:text-gray-400 mb-2">Line Items</p>
                <div className="space-y-2">
                  {viewingPR.lines.map((line: any, index: number) => (
                    <div key={index} className="p-3 bg-gray-50 dark:bg-gray-700 rounded text-sm">
                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <span className="font-medium">Item:</span> {line.item_name} ({line.sku})
                        </div>
                        <div>
                          <span className="font-medium">Quantity:</span> {line.quantity}
                        </div>
                        <div>
                          <span className="font-medium">Unit Price:</span> ${line.estimated_unit_price || 'N/A'}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {viewingPR.attachments && viewingPR.attachments.length > 0 && (
              <div>
                <p className="text-gray-600 dark:text-gray-400 mb-2">Attachments</p>
                <div className="space-y-3">
                  {viewingPR.attachments.map((attachment: any, index: number) => (
                    <div key={index} className="border border-gray-200 dark:border-gray-600 rounded-lg p-3">
                      <div className="flex items-center gap-2 mb-2">
                        <FileText size={16} />
                        <span className="text-sm font-medium">{attachment.original_name}</span>
                        <span className="text-xs text-gray-500">({(attachment.file_size / 1024).toFixed(1)} KB)</span>
                      </div>
                      {attachment.mime_type?.startsWith('image/') && (
                        <div className="mt-2">
                          <img 
                            src={attachment.file_path} 
                            alt={attachment.original_name}
                            className="max-w-full h-auto max-h-64 rounded border cursor-pointer hover:opacity-80 transition-opacity"
                            loading="lazy"
                            onClick={() => setViewingImage(attachment.file_path)}
                          />
                        </div>
                      )}
                      {attachment.mime_type === 'application/pdf' && (
                        <div className="mt-2">
                          <a 
                            href={attachment.file_path} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-3 py-2 bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors"
                          >
                            <FileText size={16} />
                            View PDF
                          </a>
                        </div>
                      )}
                      {!attachment.mime_type?.startsWith('image/') && attachment.mime_type !== 'application/pdf' && (
                        <div className="mt-2">
                          <a 
                            href={attachment.file_path} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 text-sm"
                          >
                            View File
                          </a>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </Modal>
      )}

      {/* Image Viewer Modal */}
      {viewingImage && (
        <Modal
          isOpen={!!viewingImage}
          onClose={() => setViewingImage(null)}
          title="Image Preview"
          size="xl"
        >
          <div className="flex justify-center">
            <img 
              src={viewingImage} 
              alt="Full size preview"
              className="max-w-full max-h-[80vh] object-contain"
            />
          </div>
        </Modal>
      )}

      {/* Submit Confirmation Modal */}
      {confirmSubmitPR && (
        <Modal
          isOpen={!!confirmSubmitPR}
          onClose={() => setConfirmSubmitPR(null)}
          title="Submit Purchase Request"
          size="md"
        >
          <div className="space-y-4">
            <p className="text-gray-600 dark:text-gray-400">
              Are you sure you want to submit Purchase Request #{confirmSubmitPR} for approval?
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Once submitted, you will not be able to edit this request.
            </p>
            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button 
                variant="secondary" 
                onClick={() => setConfirmSubmitPR(null)}
              >
                Cancel
              </Button>
              <Button 
                onClick={() => handleSubmitForApproval(confirmSubmitPR)}
              >
                Submit for Approval
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};