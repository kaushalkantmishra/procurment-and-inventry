// Purchase Order Types
export interface PurchaseOrder {
  id: number;
  po_number: string;
  supplier_id?: string;
  po_date: string;
  buyer_id?: string;
  total_amount: string;
  status: string;
  payment_terms?: string;
  created_at: string;
  updated_at?: string;
  deleted_at?: string;
  is_deleted: boolean;
  lines?: PurchaseOrderLine[];
}

export interface PurchaseOrderLine {
  id: number;
  po_id: number;
  line_number: number;
  item_id: number;
  description?: string;
  quantity: number;
  unit_price: string;
  line_total: string;
  status: number;
  created_at: string;
  updated_at?: string;
  deleted_at?: string;
  is_deleted: boolean;
}

export interface PODistribution {
  id: number;
  po_line_id: number;
  ship_to_location?: string;
  account_code?: string;
  distribution_quantity: number;
  due_date?: string;
  status: number;
  created_at: string;
  updated_at?: string;
  deleted_at?: string;
  is_deleted: boolean;
}

// Form Types
export interface CreatePurchaseOrderRequest {
  po_number: string;
  supplier_id?: string;
  buyer_id?: string;
  payment_terms?: string;
  lines?: CreatePOLineRequest[];
}

export interface CreatePOLineRequest {
  line_number: number;
  item_id: number;
  description?: string;
  quantity: number;
  unit_price: string;
  line_total: string;
}

export interface UpdatePurchaseOrderRequest {
  supplier_id?: string;
  buyer_id?: string;
  payment_terms?: string;
  status?: string;
}

// Status Types
export enum POStatus {
  DRAFT = 'Draft',
  PENDING = 'Pending',
  APPROVED = 'Approved',
  REJECTED = 'Rejected'
}

export type POStatusVariant = 'default' | 'warning' | 'success' | 'danger';