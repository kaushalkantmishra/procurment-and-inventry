import { Request, Response } from "express";
import { StockBalanceService } from "../services/stockBalance.service";
import { ApiResponse } from "../../../utils/response.util";
import { ErrorHandler } from "../../../utils/error.util";

export class StockBalanceController {
  private stockBalanceService: StockBalanceService;

  constructor() {
    this.stockBalanceService = new StockBalanceService();
  }

  getStockBalance = async (req: Request, res: Response) => {
    try {
      const { itemId, warehouseId } = req.query;
      const balance = await this.stockBalanceService.getStockBalance(
        parseInt(itemId as string),
        parseInt(warehouseId as string)
      );
      return ApiResponse.success(res, balance, "Stock balance retrieved successfully");
    } catch (error) {
      return ApiResponse.error(res, ErrorHandler.getErrorMessage(error));
    }
  };

  syncStockBalances = async (req: Request, res: Response) => {
    try {
      const { warehouseId } = req.body;
      const result = await this.stockBalanceService.syncStockBalances(warehouseId);
      return ApiResponse.success(res, result, "Stock balances synchronized successfully");
    } catch (error) {
      return ApiResponse.error(res, ErrorHandler.getErrorMessage(error));
    }
  };

  reserveStock = async (req: Request, res: Response) => {
    try {
      const { itemId, warehouseId, quantity, reference } = req.body;
      const result = await this.stockBalanceService.reserveStock(itemId, warehouseId, quantity, reference);
      return ApiResponse.success(res, result, "Stock reserved successfully");
    } catch (error) {
      return ApiResponse.badRequest(res, ErrorHandler.getErrorMessage(error));
    }
  };

  releaseReservation = async (req: Request, res: Response) => {
    try {
      const { itemId, warehouseId, quantity, reference } = req.body;
      const result = await this.stockBalanceService.releaseReservation(itemId, warehouseId, quantity, reference);
      return ApiResponse.success(res, result, "Reservation released successfully");
    } catch (error) {
      return ApiResponse.badRequest(res, ErrorHandler.getErrorMessage(error));
    }
  };
}