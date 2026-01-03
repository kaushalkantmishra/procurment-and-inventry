import { Request, Response } from 'express';
import { ReceiptService } from '../services/receipt.service';
import { ApiResponse } from '../utils/response.util';
import { ErrorHandler } from '../utils/error.util';

export class ReceiptController {
  static async getAll(req: Request, res: Response) {
    try {
      const receipts = await ReceiptService.getAll();
      return ApiResponse.success(res, receipts, 'Receipts retrieved successfully');
    } catch (error) {
      const message = ErrorHandler.getErrorMessage(error);
      return ApiResponse.error(res, message, 500);
    }
  }

  static async getById(req: Request, res: Response) {
    try {
      const receipt = await ReceiptService.getById(parseInt(req.params.id));
      if (!receipt) {
        return ApiResponse.notFound(res, 'Receipt not found');
      }
      return ApiResponse.success(res, receipt, 'Receipt retrieved successfully');
    } catch (error) {
      const message = ErrorHandler.getErrorMessage(error);
      return ApiResponse.error(res, message, 500);
    }
  }

  static async create(req: Request, res: Response) {
    try {
      const receipt = await ReceiptService.create(req.body);
      return ApiResponse.created(res, receipt, 'Receipt created successfully');
    } catch (error) {
      const message = ErrorHandler.getErrorMessage(error);
      return ApiResponse.error(res, message, 500);
    }
  }

  static async update(req: Request, res: Response) {
    try {
      const receipt = await ReceiptService.update(parseInt(req.params.id), req.body);
      return ApiResponse.success(res, receipt, 'Receipt updated successfully');
    } catch (error) {
      const message = ErrorHandler.getErrorMessage(error);
      return ApiResponse.error(res, message, 500);
    }
  }

  static async delete(req: Request, res: Response) {
    try {
      await ReceiptService.delete(parseInt(req.params.id));
      return ApiResponse.success(res, null, 'Receipt deleted successfully');
    } catch (error) {
      const message = ErrorHandler.getErrorMessage(error);
      return ApiResponse.error(res, message, 500);
    }
  }
}