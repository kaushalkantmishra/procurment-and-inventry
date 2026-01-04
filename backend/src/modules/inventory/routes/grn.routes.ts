import { Router } from 'express';
import { GRNController } from '../controllers/grn.controller';

const router = Router();
const grnController = new GRNController();

router.get('/', grnController.getAll);
router.get('/:id', grnController.getById);
router.post('/', grnController.create);
router.put('/:id', grnController.update);
router.delete('/:id', grnController.delete);

export { router as grnRoutes };