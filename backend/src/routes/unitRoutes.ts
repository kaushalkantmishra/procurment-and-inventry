import { Router } from 'express';
import { getAllUnits, createUnit } from '../controllers/unitController';

const router = Router();

router.get('/', getAllUnits);
router.post('/', createUnit);

export default router;