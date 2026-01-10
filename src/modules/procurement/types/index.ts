// Export all procurement types
export * from './purchaseRequest.types';
export * from './purchaseOrder.types';
export * from './grn.types';

// Common types used across procurement modules
export interface Item {
  id: number;
  item_name: string;
  sku: string;
  category_id?: number;
  unit_id?: number;
  description?: string;
  status: number;
  created_at: string;
  updated_at?: string;
  deleted_at?: string;
  is_deleted: boolean;
}

export interface Vendor {
  id: number;
  vendor_code: string;
  vendor_name: string;
  contact_person?: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  country?: string;
  payment_terms?: string;
  is_active: boolean;
  status: number;
  created_at: string;
  updated_at?: string;
  deleted_at?: string;
  is_deleted: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  user_type: string;
  is_active: boolean;
  created_at: string;
  updated_at?: string;
}

// API Response Types
export interface ApiResponse<T> {
  status: number;
  message: string;
  data: T;
  metadata?: {
    apiId: string;
    version: number;
    responsetime: number | null;
    action: string;
  };
}

// Common Status Variants
export type StatusVariant = 'default' | 'warning' | 'success' | 'danger' | 'info';