import { Router } from 'express';
import { ReceiptController } from '../controllers/receipt.controller';

const router = Router();

router.get('/', ReceiptController.getAll);
router.get('/:id', ReceiptController.getById);
router.post('/', ReceiptController.create);
router.put('/:id', ReceiptController.update);
router.delete('/:id', ReceiptController.delete);

export { router as receiptRoutes };