import { Router } from "express";
import { PurchaseOrderController } from "../controllers/purchaseOrder.controller";

const router = Router();
const purchaseOrderController = new PurchaseOrderController();

router.get("/", purchaseOrderController.getAll);
router.get("/:id", purchaseOrderController.getById);
router.post("/", purchaseOrderController.create);
router.put("/:id", purchaseOrderController.update);
router.delete("/:id", purchaseOrderController.delete);

export { router as purchaseOrderRoutes };