import { Router } from "express";
import { DocumentAttachmentController } from "../controllers/documentAttachment.controller";
import { upload } from "../../../utils/multer.util";

const router = Router();
const documentAttachmentController = new DocumentAttachmentController();

router.post("/upload", upload.single('file'), documentAttachmentController.uploadAttachment);
router.get("/", documentAttachmentController.getAttachments);
router.delete("/:id", documentAttachmentController.deleteAttachment);

export { router as documentAttachmentRoutes };