import { InferSelectModel, InferInsertModel } from 'drizzle-orm';
import {
  tblPurchaseRequests,
  tblPurchaseRequestLines,
  tblPurchaseOrders,
  tblPoLines,
  tblPoDistributions,
  tblGrnHeaders,
  tblGrnDetails,
  tblVendorInvoices,
  tblInvoiceLines,
  tblThreeWayMatching,
  tblDocumentStatusHistory
} from '../../../db/procurement.schema';

// Database model types
export type PurchaseRequest = InferSelectModel<typeof tblPurchaseRequests>;
export type PurchaseRequestLine = InferSelectModel<typeof tblPurchaseRequestLines>;
export type PurchaseOrder = InferSelectModel<typeof tblPurchaseOrders>;
export type PoLine = InferSelectModel<typeof tblPoLines>;
export type PoDistribution = InferSelectModel<typeof tblPoDistributions>;
export type GrnHeader = InferSelectModel<typeof tblGrnHeaders>;
export type GrnDetail = InferSelectModel<typeof tblGrnDetails>;
export type VendorInvoice = InferSelectModel<typeof tblVendorInvoices>;
export type InvoiceLine = InferSelectModel<typeof tblInvoiceLines>;
export type ThreeWayMatching = InferSelectModel<typeof tblThreeWayMatching>;
export type DocumentStatusHistory = InferSelectModel<typeof tblDocumentStatusHistory>;

// Insert types (for creating new records)
export type CreatePurchaseRequest = InferInsertModel<typeof tblPurchaseRequests>;
export type CreatePurchaseRequestLine = InferInsertModel<typeof tblPurchaseRequestLines>;
export type CreatePurchaseOrder = InferInsertModel<typeof tblPurchaseOrders>;
export type CreatePoLine = InferInsertModel<typeof tblPoLines>;
export type CreateGrnHeader = InferInsertModel<typeof tblGrnHeaders>;
export type CreateGrnDetail = InferInsertModel<typeof tblGrnDetails>;
export type CreateVendorInvoice = InferInsertModel<typeof tblVendorInvoices>;
export type CreateInvoiceLine = InferInsertModel<typeof tblInvoiceLines>;
export type CreateThreeWayMatching = InferInsertModel<typeof tblThreeWayMatching>;
export type CreateDocumentStatusHistory = InferInsertModel<typeof tblDocumentStatusHistory>;

// API Request types
export interface CreatePurchaseRequestRequest {
  requesting_department?: string;
  requester_employee_code?: string;
  required_date?: string;
  justification?: string;
  maintenance_work_order?: string;
}

export interface UpdatePurchaseRequestRequest {
  requesting_department?: string;
  requester_employee_code?: string;
  required_date?: string;
  justification?: string;
  maintenance_work_order?: string;
  status?: string;
}

export interface CreatePurchaseRequestLineRequest {
  pr_id: number;
  item_id: number;
  quantity: number;
  estimated_unit_price: string;
}

export interface UpdatePurchaseRequestLineRequest {
  item_id?: number;
  quantity?: number;
  estimated_unit_price?: string;
}

export interface CreatePurchaseOrderRequest {
  po_number: string;
  supplier_id?: string;
  buyer_id?: string;
  payment_terms?: string;
  lines?: CreatePoLine[];
}

export interface UpdatePurchaseOrderRequest {
  supplier_id?: string;
  buyer_id?: string;
  payment_terms?: string;
  status?: string;
}

export interface CreatePRToPORequest {
  createdBy: string;
}

export interface SubmitForApprovalRequest {
  submittedBy: string;
}

export interface ApproveRequest {
  approvedBy: string;
}

export interface RejectRequest {
  rejectedBy: string;
  reason: string;
}

export interface CreateGrnHeaderRequest {
  grn_number: string;
  po_id?: number;
  supplier_id?: string;
  delivery_note_ref?: string;
  vehicle_reg_no?: string;
  received_by_user?: string;
  inspection_status?: string;
  remarks?: string;
}

export interface UpdateGrnHeaderRequest {
  supplier_id?: string;
  delivery_note_ref?: string;
  vehicle_reg_no?: string;
  received_by_user?: string;
  inspection_status?: string;
  remarks?: string;
  status?: number;
}

export interface CreateGrnDetailRequest {
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

export interface UpdateGrnDetailRequest {
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

export interface CreateVendorInvoiceRequest {
  invoice_number: string;
  vendor_invoice_number: string;
  vendor_id: string;
  po_id?: number;
  invoice_date: string;
  due_date?: string;
  currency?: string;
  subtotal: string;
  tax_amount?: string;
  total_amount: string;
}

export interface UpdateVendorInvoiceRequest {
  vendor_invoice_number?: string;
  vendor_id?: string;
  po_id?: number;
  invoice_date?: string;
  due_date?: string;
  currency?: string;
  subtotal?: string;
  tax_amount?: string;
  total_amount?: string;
  payment_status?: string;
  match_status?: string;
}

export interface CreatePoLineRequest {
  po_id: number;
  line_number: number;
  item_id: number;
  description?: string;
  quantity: number;
  unit_price: string;
  line_total: string;
}

export interface UpdatePoLineRequest {
  line_number?: number;
  item_id?: number;
  description?: string;
  quantity?: number;
  unit_price?: string;
  line_total?: string;
  status?: number;
}

export interface CreateThreeWayMatchingRequest {
  po_line_id: number;
  grn_detail_id?: number;
  invoice_line_id?: number;
  match_status?: string;
  quantity_variance?: number;
  price_variance?: string;
  variance_reason?: string;
  matched_by?: string;
}

export interface UpdateThreeWayMatchingRequest {
  match_status?: string;
  quantity_variance?: number;
  price_variance?: string;
  variance_reason?: string;
  matched_by?: string;
}

export interface CreateDocumentStatusHistoryRequest {
  document_type: string;
  document_id: number;
  old_status?: string;
  new_status: string;
  changed_by: string;
  remarks?: string;
}

// Response types
export interface ProcurementFlowResponse {
  purchaseOrder: {
    header: PurchaseOrder;
    lines: PoLine[];
  };
  goodsReceiptNotes: Array<{
    header: GrnHeader;
    details: GrnDetail[];
  }>;
  vendorInvoices: Array<{
    header: VendorInvoice;
    lines: InvoiceLine[];
  }>;
  threeWayMatching: ThreeWayMatching[];
  summary: {
    po_total: number;
    grn_count: number;
    invoice_count: number;
    matched_lines: number;
    variance_lines: number;
    payment_status: string;
  };
}

export interface PRToPOConversionResponse {
  message: string;
  po: PurchaseOrder;
  prId: number;
}

// Status enums
export enum PRStatus {
  SAVED = 'Saved',
  SUBMITTED = 'Submitted',
  APPROVED = 'Approved',
  REJECTED = 'Rejected',
  CONVERTED = 'Converted'
}

export enum POStatus {
  DRAFT = 'Draft',
  PENDING = 'Pending',
  APPROVED = 'Approved',
  REJECTED = 'Rejected'
}

export enum MatchStatus {
  PENDING = 'PENDING',
  MATCHED = 'MATCHED',
  VARIANCE = 'VARIANCE',
  UNMATCHED = 'UNMATCHED'
}

export enum PaymentStatus {
  PENDING = 'PENDING',
  PAID = 'PAID',
  PARTIALLY_PAID = 'PARTIALLY_PAID'
}

export enum DocumentType {
  PR = 'PR',
  PO = 'PO',
  GRN = 'GRN',
  INVOICE = 'INVOICE'
}