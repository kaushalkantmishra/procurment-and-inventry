import { Router } from 'express';
import { WarehouseController } from '../controllers/warehouse.controller';

const router = Router();
const warehouseController = new WarehouseController();

router.get('/', warehouseController.getAll);
router.post('/', warehouseController.create);
router.get('/:id', warehouseController.getById);
router.put('/:id', warehouseController.update);
router.delete('/:id', warehouseController.delete);

export { router as warehouseRoutes };