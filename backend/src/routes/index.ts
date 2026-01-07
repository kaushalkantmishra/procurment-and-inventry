import { Router } from 'express';

// Authorization Module
import { authRoutes } from '../modules/authorization/routes/auth.routes';

// Masters Module
import { categoryRoutes } from '../modules/masters/routes/category.routes';
import { moduleRoutes } from '../modules/masters/routes/module.routes';
import { unitRoutes } from '../modules/masters/routes/unit.routes';
import { warehouseRoutes } from '../modules/masters/routes/warehouse.routes';
import { vendorRoutes } from '../modules/masters/routes/vendor.routes';

// Inventory Module
import { itemRoutes } from '../modules/inventory/routes/item.routes';
import { grnRoutes } from '../modules/inventory/routes/grn.routes';
import { receiptRoutes } from '../modules/inventory/routes/receipt.routes';
import { inventoryTransactionRoutes } from '../modules/inventory/routes/inventoryTransaction.routes';

// Procurement Module
import { purchaseOrderRoutes } from '../modules/procurement/routes/purchaseOrder.routes';
import { poLineRoutes } from '../modules/procurement/routes/poLine.routes';
import { grnHeaderRoutes } from '../modules/procurement/routes/grnHeader.routes';
import { grnDetailRoutes } from '../modules/procurement/routes/grnDetail.routes';
import { purchaseRequestRoutes } from '../modules/procurement/routes/purchaseRequest.routes';
import { vendorInvoiceRoutes } from '../modules/procurement/routes/vendorInvoice.routes';
import { threeWayMatchingRoutes } from '../modules/procurement/routes/threeWayMatching.routes';
import { procurementDashboardRoutes } from '../modules/procurement/routes/procurementDashboard.routes';

// Extended Modules
import { approvalWorkflowRoutes } from '../modules/masters/routes/approvalWorkflow.routes';
import { documentAttachmentRoutes } from '../modules/masters/routes/documentAttachment.routes';
import { stockBalanceRoutes } from '../modules/inventory/routes/stockBalance.routes';
import { materialIssueRoutes } from '../modules/inventory/routes/materialIssue.routes';

const router = Router();

// Authorization Routes
router.use('/auth', authRoutes);

// Masters Routes
router.use('/categories', categoryRoutes);
router.use('/modules', moduleRoutes);
router.use('/units', unitRoutes);
router.use('/warehouses', warehouseRoutes);
router.use('/vendors', vendorRoutes);

// Inventory Routes
router.use('/items', itemRoutes);
router.use('/grn', grnRoutes);
router.use('/receipts', receiptRoutes);
router.use('/inventory', inventoryTransactionRoutes);

// Procurement Routes
router.use('/purchase-orders', purchaseOrderRoutes);
router.use('/po-lines', poLineRoutes);
router.use('/grn-headers', grnHeaderRoutes);
router.use('/grn-details', grnDetailRoutes);
router.use('/purchase-requests', purchaseRequestRoutes);
router.use('/vendor-invoices', vendorInvoiceRoutes);
router.use('/three-way-matching', threeWayMatchingRoutes);
router.use('/procurement/dashboard', procurementDashboardRoutes);

// Extended Routes
router.use('/approvals', approvalWorkflowRoutes);
router.use('/attachments', documentAttachmentRoutes);
router.use('/stock-balances', stockBalanceRoutes);
router.use('/material-issues', materialIssueRoutes);

export { router as apiRoutes };