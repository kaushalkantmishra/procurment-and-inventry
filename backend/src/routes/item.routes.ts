import { Router } from 'express';
import { ItemController } from '../controllers/item.controller';

const router = Router();
const itemController = new ItemController();

router.get('/', itemController.getAll);
router.post('/', itemController.create);
router.get('/:id', itemController.getById);
router.put('/:id', itemController.update);
router.delete('/:id', itemController.delete);

export { router as itemRoutes };