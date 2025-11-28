import { Router } from 'express';
import { createPO, getAllPOs } from '../controllers/poController';

const router = Router();

router.post('/', createPO);
router.get('/', getAllPOs);

export default router;
