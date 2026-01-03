import { Router } from 'express';
import { ModuleController } from '../controllers/module.controller';

const router = Router();
const moduleController = new ModuleController();

router.get('/', moduleController.getAll);
router.post('/', moduleController.create);
router.get('/:id', moduleController.getById);
router.put('/:id', moduleController.update);
router.delete('/:id', moduleController.delete);

export { router as moduleRoutes };