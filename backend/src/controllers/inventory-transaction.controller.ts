import { Request, Response } from 'express';
import { InventoryTransactionService } from '../services/inventory-transaction.service';
import { ApiResponse } from '../utils/response.util';
import { ErrorHandler } from '../utils/error.util';

export class InventoryTransactionController {
  static async getAll(req: Request, res: Response) {
    try {
      const transactions = await InventoryTransactionService.getAll();
      return ApiResponse.success(res, transactions, 'Inventory transactions retrieved successfully');
    } catch (error) {
      const message = ErrorHandler.getErrorMessage(error);
      return ApiResponse.error(res, message, 500);
    }
  }

  static async getById(req: Request, res: Response) {
    try {
      const transaction = await InventoryTransactionService.getById(parseInt(req.params.id));
      if (!transaction) {
        return ApiResponse.notFound(res, 'Inventory transaction not found');
      }
      return ApiResponse.success(res, transaction, 'Inventory transaction retrieved successfully');
    } catch (error) {
      const message = ErrorHandler.getErrorMessage(error);
      return ApiResponse.error(res, message, 500);
    }
  }

  static async create(req: Request, res: Response) {
    try {
      const transaction = await InventoryTransactionService.create(req.body);
      return ApiResponse.created(res, transaction, 'Inventory transaction created successfully');
    } catch (error) {
      const message = ErrorHandler.getErrorMessage(error);
      return ApiResponse.error(res, message, 500);
    }
  }

  static async update(req: Request, res: Response) {
    try {
      const transaction = await InventoryTransactionService.update(parseInt(req.params.id), req.body);
      return ApiResponse.success(res, transaction, 'Inventory transaction updated successfully');
    } catch (error) {
      const message = ErrorHandler.getErrorMessage(error);
      return ApiResponse.error(res, message, 500);
    }
  }

  static async delete(req: Request, res: Response) {
    try {
      await InventoryTransactionService.delete(parseInt(req.params.id));
      return ApiResponse.success(res, null, 'Inventory transaction deleted successfully');
    } catch (error) {
      const message = ErrorHandler.getErrorMessage(error);
      return ApiResponse.error(res, message, 500);
    }
  }
}