// Main Schema File - Imports from all modules

// Import all tables from modules
export * from "../modules/masters/schemas/masters.schema";
export * from "../modules/inventory/schemas/inventory.schema";
export * from "../modules/procurement/schemas/procurement.schema";

// Backward compatibility aliases
import { 
  users,
  roles,
  type Role,
  tblUnits, 
  tblCategories, 
  tblWarehouses, 
  tblVendors 
} from "../modules/masters/schemas/masters.schema";

import { 
  tblItems,
  tblInventoryTransactions,
  tblReceiptHeaders,
  tblReceiptLines,
  tblPayments
} from "../modules/inventory/schemas/inventory.schema";

import {
  tblPurchaseRequests,
  tblPurchaseOrders,
  tblPoLines,
  tblPoDistributions,
  tblGrnHeaders,
  tblGrnDetails
} from "../modules/procurement/schemas/procurement.schema";

export const units = tblUnits;
export const categories = tblCategories;
export const warehouses = tblWarehouses;
export const items = tblItems;
export const vendors = tblVendors;

// Additional table aliases for backward compatibility
export const inventoryTransactions = tblInventoryTransactions;
export const receiptHeaders = tblReceiptHeaders;
export const receiptLines = tblReceiptLines;
export const payments = tblPayments;
export const purchaseRequests = tblPurchaseRequests;
export const purchaseOrders = tblPurchaseOrders;
export const poLines = tblPoLines;
export const poDistributions = tblPoDistributions;
export const grnHeaders = tblGrnHeaders;
export const grnDetails = tblGrnDetails;
export const userRoles = roles;
export type { Role };
export const usersTable = users;