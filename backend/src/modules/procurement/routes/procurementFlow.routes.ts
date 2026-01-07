import { Router } from 'express';
import { ProcurementFlowController } from '../controllers/procurementFlow.controller';

const router = Router();
const controller = new ProcurementFlowController();

// GET /api/procurement/flow/:poId
router.get('/:poId', controller.getFlowByPoId);

export { router as procurementFlowRoutes };