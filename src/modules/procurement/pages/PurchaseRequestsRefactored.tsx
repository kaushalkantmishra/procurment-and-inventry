import React, { useState, useEffect } from 'react';
import { Plus, Eye, Edit, Trash2, Send, X, Upload, FileText } from 'lucide-react';
import { DataTable } from '../../../components/ui/DataTable';
import { Button } from '../../../components/ui/Button';
import { Modal } from '../../../components/ui/Modal';
import { Input } from '../../../components/ui/Input';
import { Textarea } from '../../../components/ui/Textarea';
import { Badge } from '../../../components/ui/Badge';
import { apiService } from '../../../services/api';

interface PurchaseRequest {
  id: number;
  requesting_department: string;
  required_date: string;
  justification: string;
  maintenance_work_order?: string;
  priority: 'High' | 'Medium' | 'Low';
  status: string;
  date_of_request: string;
  lines?: PRLine[];
  attachments?: PRAttachment[];
}

interface PRLine {
  id?: number;
  item_id?: number;
  item_name?: string;
  category_id?: number;
  uom_id?: number;
  quantity: number;
  estimated_unit_price?: string;
  line_total?: string;
  existing_item_name?: string;
  sku?: string;
}

interface PRAttachment {
  file?: File;
  name: string;
  file_path?: string;
  original_name?: string;
  file_size?: number;
  mime_type?: string;
}

interface Item {
  id: number;
  item_name: string;
  sku: string;
  category_id: number;
  uom_id: number;
}

interface Category {
  id: number;
  category_name: string;
}

interface UOM {
  id: number;
  uom_name: string;
}

export const PurchaseRequestsRefactored: React.FC = () => {
  const [purchaseRequests, setPurchaseRequests] = useState<PurchaseRequest[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [uoms, setUOMs] = useState<UOM[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewingPR, setViewingPR] = useState<PurchaseRequest | null>(null);
  const [editingPR, setEditingPR] = useState<PurchaseRequest | null>(null);
  const [activeTab, setActiveTab] = useState<'draft' | 'submitted'>('draft');
  const [confirmSubmitPR, setConfirmSubmitPR] = useState<number | null>(null);

  // Form state
  const [formTab, setFormTab] = useState<'details' | 'items' | 'attachments'>('details');
  const [prLines, setPrLines] = useState<PRLine[]>([{ category_id: 0, item_id: 0, quantity: 1, estimated_unit_price: '' }]);
  const [attachments, setAttachments] = useState<PRAttachment[]>([]);
  const [itemSuggestions, setItemSuggestions] = useState<{ [key: number]: Item[] }>({});
  const [showSuggestions, setShowSuggestions] = useState<{ [key: number]: boolean }>({});

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [prsResponse, categoriesResponse, uomsResponse] = await Promise.all([
        apiService.getPurchaseRequests(),
        apiService.getCategories(),
        apiService.getUnits()
      ]);
      
      setPurchaseRequests(Array.isArray(prsResponse?.data) ? prsResponse.data : []);
      setCategories(Array.isArray(categoriesResponse?.data) ? categoriesResponse.data : []);
      setUOMs(Array.isArray(uomsResponse?.data) ? uomsResponse.data : []);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchItemSuggestions = async (categoryId: number, search: string, lineIndex: number) => {
    if (!categoryId || search.length < 2) {
      setItemSuggestions(prev => ({ ...prev, [lineIndex]: [] }));
      return;
    }

    try {
      const response = await apiService.getItems({ category_id: categoryId, search });
      const items = Array.isArray(response?.data) ? response.data : [];
      setItemSuggestions(prev => ({ ...prev, [lineIndex]: items }));
      setShowSuggestions(prev => ({ ...prev, [lineIndex]: true }));
    } catch (error) {
      console.error('Failed to fetch items:', error);
    }
  };

  const handleSubmit = async (formData: FormData) => {
    const requestData = {
      requesting_department: formData.get('department') as string,
      required_date: formData.get('requiredDate') as string,
      justification: formData.get('justification') as string,
      maintenance_work_order: formData.get('maintenanceWorkOrder') as string || null,
      priority: formData.get('priority') as string || 'Medium',
      lines: prLines.filter(line => (line.item_id || line.item_name) && line.quantity > 0),
      attachments: attachments.map(att => ({
        file_name: att.name,
        original_name: att.name,
        file_path: '',
        file_size: att.file?.size || 0,
        mime_type: att.file?.type || ''
      }))
    };

    try {
      if (editingPR) {
        await apiService.updatePurchaseRequest(editingPR.id, requestData);
      } else {
        const formDataToSend = new FormData();
        Object.entries(requestData).forEach(([key, value]) => {
          if (key === 'lines') {
            formDataToSend.append(key, JSON.stringify(value));
          } else if (key !== 'attachments') {
            formDataToSend.append(key, value as string);
          }
        });
        
        attachments.forEach(attachment => {
          if (attachment.file) {
            formDataToSend.append('attachments', attachment.file);
          }
        });

        await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3001/api'}/purchase-requests`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
          },
          body: formDataToSend
        });
      }
      
      await fetchData();
      closeModal();
    } catch (error) {
      console.error('Failed to save PR:', error);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingPR(null);
    setFormTab('details');
    setPrLines([{ category_id: 0, item_id: 0, quantity: 1, estimated_unit_price: '' }]);
    setAttachments([]);
    setItemSuggestions({});
    setShowSuggestions({});
  };

  const updateLine = (index: number, field: keyof PRLine, value: any) => {
    const updatedLines = [...prLines];
    updatedLines[index] = { ...updatedLines[index], [field]: value };

    // Clear item and UOM when category changes
    if (field === 'category_id') {
      updatedLines[index].item_id = 0;
      updatedLines[index].item_name = '';
      updatedLines[index].uom_id = 0;
      setItemSuggestions(prev => ({ ...prev, [index]: [] }));
    }

    setPrLines(updatedLines);
  };

  const selectItem = (lineIndex: number, item: Item) => {
    updateLine(lineIndex, 'item_id', item.id);
    updateLine(lineIndex, 'item_name', '');
    updateLine(lineIndex, 'uom_id', item.uom_id);
    setShowSuggestions(prev => ({ ...prev, [lineIndex]: false }));
  };

  const handleItemNameChange = (lineIndex: number, value: string) => {
    updateLine(lineIndex, 'item_name', value);
    updateLine(lineIndex, 'item_id', 0);
    
    const line = prLines[lineIndex];
    if (line.category_id) {
      fetchItemSuggestions(line.category_id, value, lineIndex);
    }
  };

  const getPriorityBadge = (priority: string) => {
    const variants = {
      High: 'danger' as const,
      Medium: 'warning' as const,
      Low: 'success' as const
    };
    return <Badge variant={variants[priority as keyof typeof variants] || 'default'}>{priority}</Badge>;
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'Saved': return 'default' as const;
      case 'Submitted': return 'warning' as const;
      case 'Approved': return 'success' as const;
      case 'Rejected': return 'danger' as const;
      default: return 'default' as const;
    }
  };

  const filteredPurchaseRequests = purchaseRequests.filter(pr => 
    activeTab === 'draft' ? pr.status === 'Saved' : pr.status !== 'Saved'
  );

  const columns = [
    { key: 'id', header: 'PR ID', sortable: true },
    { key: 'requesting_department', header: 'Department', sortable: true },
    {
      key: 'priority',
      header: 'Priority',
      render: (pr: PurchaseRequest) => getPriorityBadge(pr.priority)
    },
    {
      key: 'date_of_request',
      header: 'Request Date',
      render: (pr: PurchaseRequest) => new Date(pr.date_of_request).toLocaleDateString()
    },
    {
      key: 'required_date',
      header: 'Required Date',
      render: (pr: PurchaseRequest) => pr.required_date ? new Date(pr.required_date).toLocaleDateString() : 'N/A'
    },
    {
      key: 'status',
      header: 'Status',
      render: (pr: PurchaseRequest) => <Badge variant={getStatusVariant(pr.status)}>{pr.status}</Badge>
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (pr: PurchaseRequest) => (
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

  const viewPRDetails = async (pr: PurchaseRequest) => {
    try {
      const details = await apiService.getPurchaseRequestById(pr.id);
      setViewingPR(details.data || details);
    } catch (error) {
      console.error('Failed to fetch PR details:', error);
      setViewingPR(pr);
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

  const handleSubmitForApproval = async (id: number) => {
    try {
      const currentPR = await apiService.getPurchaseRequestById(id);
      const prData = currentPR.data || currentPR;
      
      await apiService.updatePurchaseRequest(id, { 
        ...prData,
        status: 'Submitted' 
      });
      await fetchData();
      setConfirmSubmitPR(null);
    } catch (error) {
      console.error('Failed to submit PR:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            Purchase Requests
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Create and manage purchase requests with priority-based workflow
          </p>
        </div>
        <Button onClick={() => setIsModalOpen(true)}>
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
        onClose={closeModal}
        title={editingPR ? 'Edit Purchase Request' : 'Create Purchase Request'}
        size="xl"
      >
        <div className="space-y-6">
          {/* Form Tabs */}
          <div className="border-b border-gray-200 dark:border-gray-700">
            <nav className="-mb-px flex space-x-8">
              {['details', 'items', 'attachments'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setFormTab(tab as any)}
                  className={`py-2 px-1 border-b-2 font-medium text-sm capitalize ${
                    formTab === tab
                      ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </nav>
          </div>

          <form onSubmit={(e) => { e.preventDefault(); handleSubmit(new FormData(e.currentTarget)); }}>
            {/* Tab 1: Details */}
            {formTab === 'details' && (
              <div className="space-y-4">
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
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Priority</label>
                    <select
                      name="priority"
                      defaultValue={editingPR?.priority || 'Medium'}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-600 dark:border-gray-500"
                      required
                    >
                      <option value="High">🔴 High</option>
                      <option value="Medium">🟡 Medium</option>
                      <option value="Low">🟢 Low</option>
                    </select>
                  </div>
                  <Input 
                    name="maintenanceWorkOrder" 
                    label="Maintenance Work Order (Optional)" 
                    defaultValue={editingPR?.maintenance_work_order} 
                  />
                </div>
                
                <Textarea 
                  name="justification" 
                  label="Justification" 
                  defaultValue={editingPR?.justification} 
                  required 
                />
              </div>
            )}

            {/* Tab 2: Items */}
            {formTab === 'items' && !editingPR && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium">Line Items</h3>
                  <Button 
                    type="button" 
                    onClick={() => setPrLines([...prLines, { category_id: 0, item_id: 0, quantity: 1, estimated_unit_price: '' }])} 
                    size="sm"
                  >
                    <Plus size={16} className="mr-1" />
                    Add Line
                  </Button>
                </div>
                
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {prLines.map((line, index) => (
                    <div key={index} className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg space-y-3">
                      <div className="grid grid-cols-12 gap-3">
                        {/* Category */}
                        <div className="col-span-3">
                          <label className="block text-sm font-medium mb-1">Category *</label>
                          <select
                            value={line.category_id || 0}
                            onChange={(e) => updateLine(index, 'category_id', parseInt(e.target.value))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-600 dark:border-gray-500"
                            required
                          >
                            <option value={0}>Select Category</option>
                            {categories.map(cat => (
                              <option key={cat.id} value={cat.id}>{cat.category_name}</option>
                            ))}
                          </select>
                        </div>

                        {/* Item Name */}
                        <div className="col-span-4 relative">
                          <label className="block text-sm font-medium mb-1">Item Name *</label>
                          <input
                            type="text"
                            value={line.item_name || ''}
                            onChange={(e) => handleItemNameChange(index, e.target.value)}
                            onFocus={() => line.category_id && setShowSuggestions(prev => ({ ...prev, [index]: true }))}
                            onBlur={() => setTimeout(() => setShowSuggestions(prev => ({ ...prev, [index]: false })), 200)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-600 dark:border-gray-500"
                            placeholder={line.category_id ? "Type to search items..." : "Select category first"}
                            disabled={!line.category_id}
                            required
                          />
                          
                          {/* Suggestions Dropdown */}
                          {showSuggestions[index] && itemSuggestions[index]?.length > 0 && (
                            <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-lg max-h-40 overflow-y-auto">
                              {itemSuggestions[index].map(item => (
                                <button
                                  key={item.id}
                                  type="button"
                                  onClick={() => selectItem(index, item)}
                                  className="w-full px-3 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 text-sm"
                                >
                                  {item.item_name} ({item.sku})
                                </button>
                              ))}
                            </div>
                          )}
                        </div>

                        {/* UOM */}
                        <div className="col-span-2">
                          <label className="block text-sm font-medium mb-1">UOM</label>
                          <select
                            value={line.uom_id || 0}
                            onChange={(e) => updateLine(index, 'uom_id', parseInt(e.target.value))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-600 dark:border-gray-500"
                            disabled={!!line.item_id}
                            required={!line.item_id}
                          >
                            <option value={0}>Select UOM</option>
                            {uoms.map(uom => (
                              <option key={uom.id} value={uom.id}>{uom.uom_name}</option>
                            ))}
                          </select>
                        </div>

                        {/* Quantity */}
                        <div className="col-span-2">
                          <label className="block text-sm font-medium mb-1">Qty *</label>
                          <input
                            type="number"
                            min="1"
                            value={line.quantity}
                            onChange={(e) => updateLine(index, 'quantity', parseInt(e.target.value))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-600 dark:border-gray-500"
                            required
                          />
                        </div>

                        {/* Remove */}
                        <div className="col-span-1 flex items-end">
                          {prLines.length > 1 && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => setPrLines(prLines.filter((_, i) => i !== index))}
                              className="text-red-600 hover:text-red-800"
                            >
                              <X size={16} />
                            </Button>
                          )}
                        </div>
                      </div>

                      {/* Price */}
                      <div className="grid grid-cols-2 gap-3">
                        <div>
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
                        <div>
                          <label className="block text-sm font-medium mb-1">Line Total</label>
                          <input
                            type="text"
                            value={line.estimated_unit_price ? (parseFloat(line.estimated_unit_price) * line.quantity).toFixed(2) : ''}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 dark:bg-gray-600"
                            disabled
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tab 3: Attachments */}
            {formTab === 'attachments' && !editingPR && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium">Attachments</h3>
                  <div>
                    <input
                      type="file"
                      multiple
                      onChange={(e) => {
                        const files = e.target.files;
                        if (files) {
                          const newAttachments = Array.from(files).map(file => ({
                            file,
                            name: file.name
                          }));
                          setAttachments([...attachments, ...newAttachments]);
                        }
                      }}
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
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {attachments.map((attachment, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded">
                        <div className="flex items-center gap-2">
                          <FileText size={16} />
                          <span className="text-sm">{attachment.name}</span>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => setAttachments(attachments.filter((_, i) => i !== index))}
                          className="text-red-600 hover:text-red-800"
                        >
                          <X size={16} />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
            
            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button type="button" variant="secondary" onClick={closeModal}>
                Cancel
              </Button>
              <Button type="submit">
                {editingPR ? 'Update' : 'Create'} PR
              </Button>
            </div>
          </form>
        </div>
      </Modal>

      {/* View PR Modal */}
      {viewingPR && (
        <Modal
          isOpen={!!viewingPR}
          onClose={() => setViewingPR(null)}
          title={`Purchase Request #${viewingPR.id}`}
          size="xl"
        >
          <div className="space-y-6">
            {/* View Tabs */}
            <div className="border-b border-gray-200 dark:border-gray-700">
              <nav className="-mb-px flex space-x-8">
                {['details', 'items', 'attachments'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setFormTab(tab as any)}
                    className={`py-2 px-1 border-b-2 font-medium text-sm capitalize ${
                      formTab === tab
                        ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </nav>
            </div>

            {/* Details Tab */}
            {formTab === 'details' && (
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-600 dark:text-gray-400">Department</p>
                  <p className="font-medium">{viewingPR.requesting_department}</p>
                </div>
                <div>
                  <p className="text-gray-600 dark:text-gray-400">Priority</p>
                  {getPriorityBadge(viewingPR.priority)}
                </div>
                <div>
                  <p className="text-gray-600 dark:text-gray-400">Status</p>
                  <Badge variant={getStatusVariant(viewingPR.status)}>{viewingPR.status}</Badge>
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
                <div className="col-span-2">
                  <p className="text-gray-600 dark:text-gray-400 mb-2">Justification</p>
                  <p className="text-sm bg-gray-50 dark:bg-gray-700 p-3 rounded">{viewingPR.justification}</p>
                </div>
              </div>
            )}

            {/* Items Tab */}
            {formTab === 'items' && viewingPR.lines && (
              <div className="space-y-3">
                {viewingPR.lines.map((line: any, index: number) => (
                  <div key={index} className="p-3 bg-gray-50 dark:bg-gray-700 rounded text-sm">
                    <div className="flex items-center justify-between mb-2">
                      <div className="font-medium">
                        {line.existing_item_name || line.item_name}
                        {line.sku && ` (${line.sku})`}
                      </div>
                      <Badge variant={line.item_id ? 'success' : 'warning'}>
                        {line.item_id ? 'EXISTING' : 'NEW'}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-xs text-gray-600 dark:text-gray-400">
                      <div>Quantity: {line.quantity}</div>
                      <div>Unit Price: ${line.estimated_unit_price || 'N/A'}</div>
                      <div>Total: ${line.line_total || 'N/A'}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Attachments Tab */}
            {formTab === 'attachments' && viewingPR.attachments && (
              <div className="space-y-3">
                {viewingPR.attachments.map((attachment: any, index: number) => (
                  <div key={index} className="border border-gray-200 dark:border-gray-600 rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-2">
                      <FileText size={16} />
                      <span className="text-sm font-medium">{attachment.original_name}</span>
                      <span className="text-xs text-gray-500">({(attachment.file_size / 1024).toFixed(1)} KB)</span>
                    </div>
                    {attachment.mime_type?.startsWith('image/') && (
                      <img 
                        src={attachment.file_path} 
                        alt={attachment.original_name}
                        className="max-w-full h-auto max-h-64 rounded border"
                        loading="lazy"
                      />
                    )}
                  </div>
                ))}
              </div>
            )}
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
              <Button variant="secondary" onClick={() => setConfirmSubmitPR(null)}>
                Cancel
              </Button>
              <Button onClick={() => handleSubmitForApproval(confirmSubmitPR)}>
                Submit for Approval
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};