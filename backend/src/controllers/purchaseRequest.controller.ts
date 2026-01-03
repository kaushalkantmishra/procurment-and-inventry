import { Request, Response } from "express";
import { PurchaseRequestService } from "../services/purchaseRequest.service";
import { ApiResponse } from '../utils/response.util';
import { ErrorHandler } from '../utils/error.util';

export class PurchaseRequestController {
  static async getAll(req: Request, res: Response) {
    try {
      const purchaseRequests = await PurchaseRequestService.getAll();
      return ApiResponse.success(res, "Purchase requests retrieved successfully", purchaseRequests);
    } catch (error) {
      return ErrorHandler.handleError(res, error);
    }
  }

  static async getById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const purchaseRequest = await PurchaseRequestService.getById(parseInt(id));
      if (!purchaseRequest) {
        return ApiResponse.error(res, "Purchase request not found", 404);
      }
      return ApiResponse.success(res, "Purchase request retrieved successfully", purchaseRequest);
    } catch (error) {
      return ErrorHandler.handleError(res, error);
    }
  }

  static async create(req: Request, res: Response) {
    try {
      const purchaseRequest = await PurchaseRequestService.create(req.body);
      return ApiResponse.success(res, "Purchase request created successfully", purchaseRequest, 201);
    } catch (error) {
      return ErrorHandler.handleError(res, error);
    }
  }

  static async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const purchaseRequest = await PurchaseRequestService.update(parseInt(id), req.body);
      return ApiResponse.success(res, "Purchase request updated successfully", purchaseRequest);
    } catch (error) {
      return ErrorHandler.handleError(res, error);
    }
  }

  static async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;
      await PurchaseRequestService.delete(parseInt(id));
      return ApiResponse.success(res, "Purchase request deleted successfully");
    } catch (error) {
      return ErrorHandler.handleError(res, error);
    }
  }
}