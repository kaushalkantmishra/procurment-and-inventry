import { Router } from 'express';
import { UnitController } from '../controllers/unit.controller';

const router = Router();
const unitController = new UnitController();

router.get('/', unitController.getAll);
router.post('/', unitController.create);
router.get('/:id', unitController.getById);
router.put('/:id', unitController.update);
router.delete('/:id', unitController.delete);

export { router as unitRoutes };