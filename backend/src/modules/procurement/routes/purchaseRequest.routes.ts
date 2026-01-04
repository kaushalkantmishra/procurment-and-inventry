import { Router } from "express";
import { PurchaseRequestController } from "../controllers/purchaseRequest.controller";

const router = Router();
const purchaseRequestController = new PurchaseRequestController();

router.get("/", purchaseRequestController.getAll);
router.get("/:id", purchaseRequestController.getById);
router.post("/", purchaseRequestController.create);
router.put("/:id", purchaseRequestController.update);
router.delete("/:id", purchaseRequestController.delete);

export { router as purchaseRequestRoutes };