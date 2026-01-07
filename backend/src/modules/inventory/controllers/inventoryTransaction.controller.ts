import { Request, Response } from "express";
import { InventoryTransactionService } from "../services/inventoryTransaction.service";
import { ApiResponse } from "../../../utils/response.util";
import { ErrorHandler } from "../../../utils/error.util";

export class InventoryTransactionController {
  private inventoryTransactionService: InventoryTransactionService;

  constructor() {
    this.inventoryTransactionService = new InventoryTransactionService();
  }

  stockIn = async (req: Request, res: Response) => {
    try {
      const result = await this.inventoryTransactionService.stockIn(req.body);
      return ApiResponse.success(res, result, "Stock in transaction completed successfully");
    } catch (error) {
      return ApiResponse.badRequest(res, ErrorHandler.getErrorMessage(error));
    }
  };

  stockOut = async (req: Request, res: Response) => {
    try {
      const result = await this.inventoryTransactionService.stockOut(req.body);
      return ApiResponse.success(res, result, "Stock out transaction completed successfully");
    } catch (error) {
      return ApiResponse.badRequest(res, ErrorHandler.getErrorMessage(error));
    }
  };

  getTransactions = async (req: Request, res: Response) => {
    try {
      const transactions = await this.inventoryTransactionService.getAll();
      return ApiResponse.success(res, transactions, "Inventory transactions retrieved successfully");
    } catch (error) {
      return ApiResponse.error(res, ErrorHandler.getErrorMessage(error));
    }
  };

  getTransactionsByItem = async (req: Request, res: Response) => {
    try {
      const itemId = parseInt(req.params.itemId);
      const transactions = await this.inventoryTransactionService.getByItem(itemId);
      return ApiResponse.success(res, transactions, "Item transactions retrieved successfully");
    } catch (error) {
      return ApiResponse.error(res, ErrorHandler.getErrorMessage(error));
    }
  };

  getCurrentStock = async (req: Request, res: Response) => {
    try {
      const itemId = parseInt(req.params.itemId);
      const warehouseId = req.query.warehouseId ? parseInt(req.query.warehouseId as string) : 1;
      const stock = await this.inventoryTransactionService.getCurrentStock(itemId, warehouseId);
      return ApiResponse.success(res, stock, "Current stock retrieved successfully");
    } catch (error) {
      return ApiResponse.error(res, ErrorHandler.getErrorMessage(error));
    }
  };
}