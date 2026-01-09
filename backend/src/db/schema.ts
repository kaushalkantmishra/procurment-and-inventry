
export * from "./auth.schema";
export * from "./masters.schema";
export * from "./inventory.schema";
export * from "./procurement.schema";
import { tblUsers, tblRoles, tblUserRoles } from "./auth.schema";

// Masters Tables
import { 
  tblModules,
  tblUserModulePermissions,
  tblUnits, 
  tblCategories, 
  tblWarehouses, 
  tblVendors,
  tblApprovalWorkflows,
  tblApprovalLevels,
  tblApprovalInstances,
  tblApprovalHistory,
  tblSystemEnums,
  tblAuditLogs,
  tblDocumentAttachments,
  tblDocumentSequences,
  tblDocumentStatusHistory
} from "./masters.schema";

// Inventory Tables
import { 
  tblItems,
  tblInventoryTransactions,
  tblReceiptHeaders,
  tblReceiptLines,
  tblPayments,
  tblStockBalances,
  tblMaterialIssueHeaders,
  tblMaterialIssueLines
} from "./inventory.schema";

// Procurement Tables
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
  tblThreeWayMatching
} from "./procurement.schema";




/* ============================================================
   AUTHENTICATION ALIASES
   ============================================================ */


export const users = tblUsers;
export const roles = tblRoles;
export const userRoles = tblUserRoles;




/* ============================================================
   MASTERS ALIASES
   ============================================================ */


export const modules = tblModules;
export const userModulePermissions = tblUserModulePermissions;
export const units = tblUnits;
export const categories = tblCategories;
export const warehouses = tblWarehouses;
export const vendors = tblVendors;
export const approvalWorkflows = tblApprovalWorkflows;
export const approvalLevels = tblApprovalLevels;
export const approvalInstances = tblApprovalInstances;
export const approvalHistory = tblApprovalHistory;
export const systemEnums = tblSystemEnums;
export const auditLogs = tblAuditLogs;
export const documentAttachments = tblDocumentAttachments;
export const documentStatusHistory = tblDocumentStatusHistory;
export const documentSequences = tblDocumentSequences;



/* ============================================================
   INVENTORY ALIASES
   ============================================================ */


export const items = tblItems;
export const inventoryTransactions = tblInventoryTransactions;
export const receiptHeaders = tblReceiptHeaders;
export const receiptLines = tblReceiptLines;
export const payments = tblPayments;
export const stockBalances = tblStockBalances;
export const materialIssueHeaders = tblMaterialIssueHeaders;
export const materialIssueLines = tblMaterialIssueLines;



/* ============================================================
   PROCUREMENT ALIASES
   ============================================================ */


export const purchaseRequests = tblPurchaseRequests;
export const purchaseRequestLines = tblPurchaseRequestLines;
export const purchaseOrders = tblPurchaseOrders;
export const poLines = tblPoLines;
export const poDistributions = tblPoDistributions;
export const grnHeaders = tblGrnHeaders;
export const grnDetails = tblGrnDetails;
export const vendorInvoices = tblVendorInvoices;
export const invoiceLines = tblInvoiceLines;
export const threeWayMatching = tblThreeWayMatching;