import { Router } from "express";
import { PurchaseOrderController } from "../controllers/purchaseOrder.controller";

const router = Router();
const purchaseOrderController = new PurchaseOrderController();

router.get("/", purchaseOrderController.getAll);
router.get("/:id", purchaseOrderController.getById);
router.post("/", purchaseOrderController.create);
router.post("/from-pr/:prId", purchaseOrderController.createFromPR);
router.put("/:id", purchaseOrderController.update);
router.post("/:id/submit-approval", purchaseOrderController.submitForApproval);
router.post("/:id/approve", purchaseOrderController.approve);
router.post("/:id/reject", purchaseOrderController.reject);
router.delete("/:id", purchaseOrderController.delete);

export { router as purchaseOrderRoutes };