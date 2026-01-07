// Main Schema File - Imports from all schema files

// Import all tables from schema files
export * from "./auth.schema";
export * from "./masters.schema";
export * from "./inventory.schema";
export * from "./procurement.schema";

// Backward compatibility aliases
import { 
  tblUnits, 
  tblCategories, 
  tblWarehouses, 
  tblVendors 
} from "./masters.schema";

import { tblUsers } from "./auth.schema";

import { 
  tblItems,
  tblInventoryTransactions,
  tblReceiptHeaders,
  tblReceiptLines,
  tblPayments
} from "./inventory.schema";

import {
  tblPurchaseRequests,
  tblPurchaseOrders,
  tblPoLines,
  tblPoDistributions,
  tblGrnHeaders,
  tblGrnDetails
} from "./procurement.schema";

export const units = tblUnits;
export const categories = tblCategories;
export const warehouses = tblWarehouses;
export const items = tblItems;
export const vendors = tblVendors;
export const users = tblUsers;

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