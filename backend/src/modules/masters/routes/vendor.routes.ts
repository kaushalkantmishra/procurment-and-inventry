import { Router } from 'express';
import { VendorController } from '../controllers/vendor.controller';

const router = Router();
const vendorController = new VendorController();

router.get('/', vendorController.getAll);
router.post('/', vendorController.create);
router.get('/:id', vendorController.getById);
router.put('/:id', vendorController.update);
router.delete('/:id', vendorController.delete);

export { router as vendorRoutes };