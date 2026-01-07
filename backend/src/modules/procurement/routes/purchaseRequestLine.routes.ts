import { Router } from 'express';
import { PurchaseRequestLineController } from '../controllers/purchaseRequestLine.controller';

const router = Router();
const controller = new PurchaseRequestLineController();

// GET /api/purchase-request-lines?prId=:prId
router.get('/', controller.getByPrId);

// POST /api/purchase-request-lines
router.post('/', controller.create);

// PUT /api/purchase-request-lines/:id
router.put('/:id', controller.update);

// DELETE /api/purchase-request-lines/:id
router.delete('/:id', controller.delete);

export { router as purchaseRequestLineRoutes };