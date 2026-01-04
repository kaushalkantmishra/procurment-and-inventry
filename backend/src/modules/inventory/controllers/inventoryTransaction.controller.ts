import { Request, Response } from "express";
import { InventoryTransactionService } from "../services/inventoryTransaction.service";
import { ApiResponse } from "../../../utils/response.util";
import { ErrorHandler } from "../../../utils/error.util";

export class InventoryTransactionController {
  private inventoryTransactionService: InventoryTransactionService;

  constructor() {
    this.inventoryTransactionService = new InventoryTransactionService();
  }

  getAll = async (req: Request, res: Response) => {
    try {
      const transactions = await this.inventoryTransactionService.getAll();
      return ApiResponse.success(
        res,
        transactions,
        "Inventory transactions retrieved successfully"
      );
    } catch (error) {
      return ApiResponse.error(res, ErrorHandler.getErrorMessage(error));
    }
  };

  getById = async (req: Request, res: Response) => {
    try {
      const transaction = await this.inventoryTransactionService.getById(
        parseInt(req.params.id)
      );
      return ApiResponse.success(
        res,
        transaction,
        "Inventory transaction retrieved successfully"
      );
    } catch (error) {
      return ApiResponse.notFound(res, ErrorHandler.getErrorMessage(error));
    }
  };

  create = async (req: Request, res: Response) => {
    try {
      const transaction = await this.inventoryTransactionService.create(req.body);
      return ApiResponse.created(
        res,
        transaction,
        "Inventory transaction created successfully"
      );
    } catch (error) {
      return ApiResponse.badRequest(res, ErrorHandler.getErrorMessage(error));
    }
  };

  stockIn = async (req: Request, res: Response) => {
    try {
      const transaction = await this.inventoryTransactionService.stockIn(req.body);
      return ApiResponse.created(
        res,
        transaction,
        "Stock in transaction completed successfully"
      );
    } catch (error) {
      return ApiResponse.badRequest(res, ErrorHandler.getErrorMessage(error));
    }
  };

  stockOut = async (req: Request, res: Response) => {
    try {
      const transaction = await this.inventoryTransactionService.stockOut(req.body);
      return ApiResponse.created(
        res,
        transaction,
        "Stock out transaction completed successfully"
      );
    } catch (error) {
      return ApiResponse.badRequest(res, ErrorHandler.getErrorMessage(error));
    }
  };
}
