import { Request, Response } from "express";
import { PurchaseOrderService } from "../services/purchaseOrder.service";
import { ApiResponse } from '../utils/response.util';
import { ErrorHandler } from '../utils/error.util';

export class PurchaseOrderController {
  static async getAll(req: Request, res: Response) {
    try {
      const purchaseOrders = await PurchaseOrderService.getAll();
      return ApiResponse.success(res, "Purchase orders retrieved successfully", purchaseOrders);
    } catch (error) {
      return ErrorHandler.handleError(res, error);
    }
  }

  static async getById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const purchaseOrder = await PurchaseOrderService.getById(parseInt(id));
      if (!purchaseOrder) {
        return ApiResponse.error(res, "Purchase order not found", 404);
      }
      return ApiResponse.success(res, "Purchase order retrieved successfully", purchaseOrder);
    } catch (error) {
      return ErrorHandler.handleError(res, error);
    }
  }

  static async create(req: Request, res: Response) {
    try {
      const purchaseOrder = await PurchaseOrderService.create(req.body);
      return ApiResponse.success(res, "Purchase order created successfully", purchaseOrder, 201);
    } catch (error) {
      return ErrorHandler.handleError(res, error);
    }
  }

  static async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const purchaseOrder = await PurchaseOrderService.update(parseInt(id), req.body);
      return ApiResponse.success(res, "Purchase order updated successfully", purchaseOrder);
    } catch (error) {
      return ErrorHandler.handleError(res, error);
    }
  }

  static async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;
      await PurchaseOrderService.delete(parseInt(id));
      return ApiResponse.success(res, "Purchase order deleted successfully");
    } catch (error) {
      return ErrorHandler.handleError(res, error);
    }
  }
}