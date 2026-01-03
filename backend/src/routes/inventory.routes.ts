import { Router } from 'express';
import { InventoryTransactionController } from '../controllers/inventory-transaction.controller';

const router = Router();

router.get('/transactions', InventoryTransactionController.getAll);
router.get('/transactions/:id', InventoryTransactionController.getById);
router.post('/transactions', InventoryTransactionController.create);
router.put('/transactions/:id', InventoryTransactionController.update);
router.delete('/transactions/:id', InventoryTransactionController.delete);

export { router as inventoryRoutes };