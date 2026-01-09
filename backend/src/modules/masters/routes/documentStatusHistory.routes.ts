import { Router } from 'express';
import { DocumentStatusHistoryController } from '../controllers/documentStatusHistory.controller';

const router = Router();
const controller = new DocumentStatusHistoryController();

// GET /api/document-status-history?documentType=PO&documentId=123
router.get('/', controller.getByDocument);

export { router as documentStatusHistoryRoutes };