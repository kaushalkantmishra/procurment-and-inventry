import { Router } from "express";
import { StockBalanceController } from "../controllers/stockBalance.controller";

const router = Router();
const stockBalanceController = new StockBalanceController();

router.get("/", stockBalanceController.getStockBalance);
router.post("/sync", stockBalanceController.syncStockBalances);
router.post("/reserve", stockBalanceController.reserveStock);
router.post("/release", stockBalanceController.releaseReservation);

export { router as stockBalanceRoutes };