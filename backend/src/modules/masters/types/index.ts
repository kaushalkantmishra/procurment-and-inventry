import { InferSelectModel, InferInsertModel } from 'drizzle-orm';
import { 
  tblDocumentAttachments,
  tblDocumentStatusHistory,
  tblModules,
  tblCategories,
  tblUnits,
  tblWarehouses,
  tblVendors,
  tblApprovalWorkflows,
  tblApprovalLevels,
  tblApprovalInstances,
  tblApprovalHistory
} from '../../../db/masters.schema';

// Database model types
export type DocumentAttachment = InferSelectModel<typeof tblDocumentAttachments>;
export type DocumentStatusHistory = InferSelectModel<typeof tblDocumentStatusHistory>;
export type Module = InferSelectModel<typeof tblModules>;
export type Category = InferSelectModel<typeof tblCategories>;
export type Unit = InferSelectModel<typeof tblUnits>;
export type Warehouse = InferSelectModel<typeof tblWarehouses>;
export type Vendor = InferSelectModel<typeof tblVendors>;
export type ApprovalWorkflow = InferSelectModel<typeof tblApprovalWorkflows>;
export type ApprovalLevel = InferSelectModel<typeof tblApprovalLevels>;
export type ApprovalInstance = InferSelectModel<typeof tblApprovalInstances>;
export type ApprovalHistory = InferSelectModel<typeof tblApprovalHistory>;

// Insert types
export type CreateDocumentAttachment = InferInsertModel<typeof tblDocumentAttachments>;
export type CreateDocumentStatusHistory = InferInsertModel<typeof tblDocumentStatusHistory>;
export type CreateModule = InferInsertModel<typeof tblModules>;
export type CreateCategory = InferInsertModel<typeof tblCategories>;
export type CreateUnit = InferInsertModel<typeof tblUnits>;
export type CreateWarehouse = InferInsertModel<typeof tblWarehouses>;
export type CreateVendor = InferInsertModel<typeof tblVendors>;
export type CreateApprovalWorkflow = InferInsertModel<typeof tblApprovalWorkflows>;
export type CreateApprovalLevel = InferInsertModel<typeof tblApprovalLevels>;
export type CreateApprovalInstance = InferInsertModel<typeof tblApprovalInstances>;
export type CreateApprovalHistory = InferInsertModel<typeof tblApprovalHistory>;

// API Request types
export interface CreateDocumentAttachmentRequest {
  document_type: string;
  document_id: number;
  file_name: string;
  original_name: string;
  file_path: string;
  file_size: number;
  mime_type: string;
  uploaded_by: string;
}

export interface CreateDocumentStatusHistoryRequest {
  document_type: string;
  document_id: number;
  old_status?: string;
  new_status: string;
  changed_by: string;
  remarks?: string;
}

export interface CreateModuleRequest {
  module_code: string;
  module_name: string;
  description?: string;
  icon?: string;
  route_path?: string;
  display_order?: number;
  is_active?: boolean;
}

export interface UpdateModuleRequest {
  module_code?: string;
  module_name?: string;
  description?: string;
  icon?: string;
  route_path?: string;
  display_order?: number;
  is_active?: boolean;
}

export interface CreateCategoryRequest {
  category_name: string;
  category_code: string;
  parent_category_id?: number;
  description?: string;
  status?: number;
}

export interface UpdateCategoryRequest {
  category_name?: string;
  category_code?: string;
  parent_category_id?: number;
  description?: string;
  status?: number;
}

export interface CreateUnitRequest {
  unit_id: string;
  name: string;
  abbreviation?: string;
  status?: number;
}

export interface UpdateUnitRequest {
  unit_id?: string;
  name?: string;
  abbreviation?: string;
  status?: number;
}

export interface CreateWarehouseRequest {
  warehouse_code: string;
  warehouse_name: string;
  street_address?: string;
  city?: string;
  country_code?: string;
  is_active?: boolean;
  date_opened?: string;
  status?: number;
}

export interface UpdateWarehouseRequest {
  warehouse_code?: string;
  warehouse_name?: string;
  street_address?: string;
  city?: string;
  country_code?: string;
  is_active?: boolean;
  date_opened?: string;
  status?: number;
}

export interface CreateVendorRequest {
  vendor_code: string;
  vendor_name: string;
  contact_person?: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  country?: string;
  payment_terms?: string;
  is_active?: boolean;
  status?: number;
}

export interface UpdateVendorRequest {
  vendor_code?: string;
  vendor_name?: string;
  contact_person?: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  country?: string;
  payment_terms?: string;
  is_active?: boolean;
  status?: number;
}

export interface CreateApprovalWorkflowRequest {
  workflow_code: string;
  workflow_name: string;
  document_type: string;
  is_active?: boolean;
}

export interface UpdateApprovalWorkflowRequest {
  workflow_code?: string;
  workflow_name?: string;
  document_type?: string;
  is_active?: boolean;
}