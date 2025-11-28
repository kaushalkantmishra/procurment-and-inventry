import { Router } from 'express';
import { stockIn, stockOut, getTransactions } from '../controllers/inventoryController';

const router = Router();

router.get('/transactions', getTransactions);
router.post('/stock-in', stockIn);
router.post('/stock-out', stockOut);

export default router;