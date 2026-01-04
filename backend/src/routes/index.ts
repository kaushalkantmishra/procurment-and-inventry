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
router.use('/inventory-transactions', inventoryTransactionRoutes);

// Procurement Routes
router.use('/purchase-orders', purchaseOrderRoutes);
router.use('/po-lines', poLineRoutes);
router.use('/grn-headers', grnHeaderRoutes);
router.use('/grn-details', grnDetailRoutes);
router.use('/purchase-requests', purchaseRequestRoutes);

export { router as apiRoutes };