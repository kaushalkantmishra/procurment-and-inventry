import { Router } from 'express';
import { ProcurementDashboardController } from '../controllers/procurementDashboard.controller';

const router = Router();

router.get('/', ProcurementDashboardController.getDashboard);

export { router as procurementDashboardRoutes };