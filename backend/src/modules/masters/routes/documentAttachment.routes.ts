import { Router } from "express";
import { DocumentAttachmentController } from "../controllers/documentAttachment.controller";

const router = Router();
const controller = new DocumentAttachmentController();

// POST /api/attachments
router.post('/', controller.create);

// GET /api/attachments?documentType=PO&documentId=1
router.get('/', controller.getByDocument);

// DELETE /api/attachments/:id
router.delete('/:id', controller.delete);

export { router as documentAttachmentRoutes };