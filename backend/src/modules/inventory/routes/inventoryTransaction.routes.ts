import { Router } from "express";
import { InventoryTransactionController } from "../controllers/inventoryTransaction.controller";

const router = Router();
const inventoryTransactionController = new InventoryTransactionController();

router.post("/stock-in", inventoryTransactionController.stockIn);
router.post("/stock-out", inventoryTransactionController.stockOut);
router.get("/transactions", inventoryTransactionController.getTransactions);
router.get("/transactions/item/:itemId", inventoryTransactionController.getTransactionsByItem);
router.get("/stock/:itemId", inventoryTransactionController.getCurrentStock);

export { router as inventoryTransactionRoutes };