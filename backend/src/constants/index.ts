// Document Types
export const DOCUMENT_TYPES = {
  PURCHASE_ORDER: 'PO',
  PURCHASE_REQUEST: 'PR',
  INVOICE: 'INVOICE',
  MATERIAL_ISSUE: 'MI',
  GRN: 'GRN'
} as const;

// Approval Actions
export const APPROVAL_ACTIONS = {
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED',
  PENDING: 'PENDING'
} as const;

// Document Status
export const DOCUMENT_STATUS = {
  DRAFT: 'DRAFT',
  PENDING: 'PENDING',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED',
  CANCELLED: 'CANCELLED'
} as const;

// Payment Status
export const PAYMENT_STATUS = {
  UNPAID: 'UNPAID',
  PAID: 'PAID',
  PARTIAL: 'PARTIAL',
  OVERDUE: 'OVERDUE'
} as const;

// Match Status
export const MATCH_STATUS = {
  MATCHED: 'MATCHED',
  VARIANCE: 'VARIANCE',
  UNMATCHED: 'UNMATCHED'
} as const;

// Transaction Types
export const TRANSACTION_TYPES = {
  STOCK_IN: 'STOCK_IN',
  STOCK_OUT: 'STOCK_OUT',
  GRN: 'GRN',
  ISSUE: 'ISSUE',
  RESERVE: 'RESERVE',
  RELEASE: 'RELEASE',
  SYNC: 'SYNC'
} as const;

// Issue Types
export const ISSUE_TYPES = {
  CONSUMPTION: 'CONSUMPTION',
  TRANSFER: 'TRANSFER',
  RETURN: 'RETURN',
  ADJUSTMENT: 'ADJUSTMENT'
} as const;

// Issue Status
export const ISSUE_STATUS = {
  REQUESTED: 'REQUESTED',
  APPROVED: 'APPROVED',
  ISSUED: 'ISSUED',
  CANCELLED: 'CANCELLED'
} as const;

// Number Generation Prefixes
export const NUMBER_PREFIXES = {
  INVOICE: 'INV',
  MATERIAL_ISSUE: 'MI',
  PURCHASE_ORDER: 'PO',
  PURCHASE_REQUEST: 'PR',
  GRN: 'GRN'
} as const;

// Error Messages
export const ERROR_MESSAGES = {
  WORKFLOW_NOT_FOUND: 'Workflow not found',
  APPROVAL_INSTANCE_NOT_FOUND: 'Approval instance not found',
  INVOICE_NOT_FOUND: 'Invoice not found',
  INVOICE_ALREADY_PAID: 'Invoice already paid',
  INVOICE_NOT_MATCHED: 'Invoice not matched with PO and GRN',
  INVOICE_HAS_VARIANCES: 'Invoice has unresolved variances',
  STOCK_BALANCE_NOT_FOUND: 'Stock balance not found for item',
  INSUFFICIENT_STOCK: 'Insufficient stock',
  MATERIAL_ISSUE_NOT_FOUND: 'Material issue not found'
} as const;

// Success Messages
export const SUCCESS_MESSAGES = {
  STOCK_RESERVED: 'Stock reserved successfully',
  RESERVATION_RELEASED: 'Reservation released successfully',
  STOCK_SYNCHRONIZED: 'Stock balances synchronized'
} as const;

// Variance Thresholds
export const VARIANCE_THRESHOLDS = {
  PRICE_TOLERANCE: 0.01,
  QUANTITY_TOLERANCE: 0
} as const;

// File Upload Limits
export const FILE_LIMITS = {
  MAX_SIZE: 10 * 1024 * 1024, // 10MB
  ALLOWED_TYPES: [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'image/jpeg',
    'image/png',
    'image/gif',
    'text/plain'
  ]
} as const;

// Cloudinary Folders
export const CLOUDINARY_FOLDERS = {
  PO: 'erp/po',
  PR: 'erp/pr',
  INVOICE: 'erp/invoices',
  GRN: 'erp/grn',
  GENERAL: 'erp/general'
} as const;