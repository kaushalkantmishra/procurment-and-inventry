import { Router } from 'express';
import { ProcurementDashboardController } from '../controllers/procurementDashboard.controller';

const router = Router();
const controller = new ProcurementDashboardController();

router.get('/', controller.getDashboard);

export { router as procurementDashboardRoutes };