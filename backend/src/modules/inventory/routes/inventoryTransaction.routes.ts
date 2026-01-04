import { Router } from "express";
import { InventoryTransactionController } from "../controllers/inventoryTransaction.controller";

const router = Router();
const inventoryTransactionController = new InventoryTransactionController();

router.get("/", inventoryTransactionController.getAll);
router.get("/:id", inventoryTransactionController.getById);
router.post("/", inventoryTransactionController.create);
router.post("/stock-in", inventoryTransactionController.stockIn);
router.post("/stock-out", inventoryTransactionController.stockOut);

export { router as inventoryTransactionRoutes };