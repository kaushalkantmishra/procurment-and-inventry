import { Router } from 'express';
import { getAllItems, createItem, getItemById } from '../controllers/itemController';

const router = Router();

router.get('/', getAllItems);
router.post('/', createItem);
router.get('/:id', getItemById);

export default router;
