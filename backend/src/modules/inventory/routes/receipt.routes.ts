import { Router } from 'express';
import { ReceiptController } from '../controllers/receipt.controller';

const router = Router();
const receiptController = new ReceiptController();

router.get('/', receiptController.getAll);
router.get('/:id', receiptController.getById);
router.post('/', receiptController.create);
router.put('/:id', receiptController.update);
router.delete('/:id', receiptController.delete);

export { router as receiptRoutes };