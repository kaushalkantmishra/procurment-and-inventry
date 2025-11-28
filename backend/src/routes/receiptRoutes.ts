import { Router } from 'express';
import { createReceipt, getAllReceipts } from '../controllers/receiptController';

const router = Router();

router.post('/', createReceipt);
router.get('/', getAllReceipts);

export default router;
