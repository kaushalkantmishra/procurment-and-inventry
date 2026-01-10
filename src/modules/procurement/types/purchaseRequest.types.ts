// Purchase Request Types
export interface PurchaseRequest {
  id: number;
  requesting_department?: string;
  requested_by_user_id: string;
  date_of_request: string;
  required_date?: string;
  justification?: string;
  maintenance_work_order?: string;
  status: string;
  created_at: string;
  updated_at?: string;
  deleted_at?: string;
  is_deleted: boolean;
  lines?: PurchaseRequestLine[];
  attachments?: PurchaseRequestAttachment[];
}

export interface PurchaseRequestLine {
  id: number;
  pr_id: number;
  item_id: number;
  quantity: number;
  estimated_unit_price?: string;
  line_total?: string;
  status: string;
  item_name?: string;
  sku?: string;
  created_at: string;
  updated_at?: string;
  deleted_at?: string;
  is_deleted: boolean;
}

export interface PurchaseRequestAttachment {
  id: number;
  document_type: string;
  document_id: number;
  file_name: string;
  original_name: string;
  file_path: string;
  file_size: number;
  mime_type: string;
  uploaded_by: string;
  uploaded_at: string;
  created_at: string;
  deleted_at?: string;
  is_deleted: boolean;
}

// Form Types
export interface PRLine {
  item_id: number;
  quantity: number;
  estimated_unit_price?: string;
}

export interface PRAttachment {
  file: File;
  name: string;
}

export interface CreatePurchaseRequestRequest {
  requesting_department?: string;
  required_date?: string;
  justification?: string;
  maintenance_work_order?: string;
  lines: PRLine[];
  attachments?: PRAttachment[];
}

export interface UpdatePurchaseRequestRequest {
  requesting_department?: string;
  required_date?: string;
  justification?: string;
  maintenance_work_order?: string;
  status?: string;
}

// Status Types
export enum PRStatus {
  SAVED = 'Saved',
  SUBMITTED = 'Submitted',
  APPROVED = 'Approved',
  REJECTED = 'Rejected',
  CONVERTED = 'Converted'
}

export type PRStatusVariant = 'default' | 'warning' | 'success' | 'danger';