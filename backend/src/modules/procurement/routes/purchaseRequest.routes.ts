import { Router } from "express";
import { PurchaseRequestController } from "../controllers/purchaseRequest.controller";
import { requireProcurement } from "../../../middleware/role.middleware";

const router = Router();
const purchaseRequestController = new PurchaseRequestController();

router.get("/", requireProcurement, purchaseRequestController.getAll);
router.get("/:id", requireProcurement, purchaseRequestController.getById);
router.post("/", requireProcurement, purchaseRequestController.create);
router.put("/:id", requireProcurement, purchaseRequestController.update);
router.delete("/:id", requireProcurement, purchaseRequestController.delete);

export { router as purchaseRequestRoutes };