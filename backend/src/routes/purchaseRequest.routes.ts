import { Router } from "express";
import { PurchaseRequestController } from "../controllers/purchaseRequest.controller";

const router = Router();

router.get("/", PurchaseRequestController.getAll);
router.get("/:id", PurchaseRequestController.getById);
router.post("/", PurchaseRequestController.create);
router.put("/:id", PurchaseRequestController.update);
router.delete("/:id", PurchaseRequestController.delete);

export { router as purchaseRequestRoutes };