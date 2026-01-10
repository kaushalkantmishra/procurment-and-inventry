// Goods Receipt Note Types
export interface GRNHeader {
  id: number;
  grn_number: string;
  receipt_date: string;
  po_id?: number;
  supplier_id?: string;
  delivery_note_ref?: string;
  vehicle_reg_no?: string;
  received_by_user?: string;
  inspection_status?: string;
  remarks?: string;
  status: number;
  created_at: string;
  updated_at?: string;
  deleted_at?: string;
  is_deleted: boolean;
  details?: GRNDetail[];
}

export interface GRNDetail {
  id: number;
  grn_id: number;
  po_line_id?: number;
  item_id: number;
  uom?: string;
  ordered_qty: number;
  received_qty: number;
  accepted_qty: number;
  rejected_qty: number;
  storage_location_id?: string;
  condition_note?: string;
  qad_check?: string;
  qad_remarks?: string;
  status: number;
  created_at: string;
  updated_at?: string;
  deleted_at?: string;
  is_deleted: boolean;
}

// Form Types
export interface CreateGRNHeaderRequest {
  grn_number: string;
  po_id?: number;
  supplier_id?: string;
  delivery_note_ref?: string;
  vehicle_reg_no?: string;
  received_by_user?: string;
  inspection_status?: string;
  remarks?: string;
}

export interface CreateGRNDetailRequest {
  grn_id: number;
  po_line_id?: number;
  item_id: number;
  uom?: string;
  ordered_qty: number;
  received_qty: number;
  accepted_qty: number;
  rejected_qty?: number;
  storage_location_id?: string;
  condition_note?: string;
  qad_check?: string;
  qad_remarks?: string;
}

export interface UpdateGRNHeaderRequest {
  supplier_id?: string;
  delivery_note_ref?: string;
  vehicle_reg_no?: string;
  received_by_user?: string;
  inspection_status?: string;
  remarks?: string;
  status?: number;
}

export interface UpdateGRNDetailRequest {
  uom?: string;
  ordered_qty?: number;
  received_qty?: number;
  accepted_qty?: number;
  rejected_qty?: number;
  storage_location_id?: string;
  condition_note?: string;
  qad_check?: string;
  qad_remarks?: string;
  status?: number;
}

// Status Types
export enum GRNStatus {
  DRAFT = 1,
  RECEIVED = 2,
  INSPECTED = 3,
  APPROVED = 4,
  REJECTED = 5
}

export type GRNStatusVariant = 'default' | 'warning' | 'success' | 'danger';