import { Router } from 'express';
import { createGRN, getAllGRNs } from '../controllers/grnController';

const router = Router();

router.post('/', createGRN);
router.get('/', getAllGRNs);

export default router;
