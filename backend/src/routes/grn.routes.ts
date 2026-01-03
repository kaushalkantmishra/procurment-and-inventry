import { Router } from 'express';
import { GRNController } from '../controllers/grn.controller';

const router = Router();

router.get('/', GRNController.getAll);
router.get('/:id', GRNController.getById);
router.post('/', GRNController.create);
router.put('/:id', GRNController.update);
router.delete('/:id', GRNController.delete);

export { router as grnRoutes };