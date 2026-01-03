import { Router } from "express";
import { PurchaseOrderController } from "../controllers/purchaseOrder.controller";

const router = Router();

router.get("/", PurchaseOrderController.getAll);
router.get("/:id", PurchaseOrderController.getById);
router.post("/", PurchaseOrderController.create);
router.put("/:id", PurchaseOrderController.update);
router.delete("/:id", PurchaseOrderController.delete);

export { router as purchaseOrderRoutes };