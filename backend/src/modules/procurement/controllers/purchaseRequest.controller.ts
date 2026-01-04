import { Request, Response } from "express";
import { PurchaseRequestService } from "../services/purchaseRequest.service";
import { ApiResponse } from "../../../utils/response.util";
import { ErrorHandler } from "../../../utils/error.util";

export class PurchaseRequestController {
  private purchaseRequestService: PurchaseRequestService;

  constructor() {
    this.purchaseRequestService = new PurchaseRequestService();
  }

  getAll = async (req: Request, res: Response) => {
    try {
      const purchaseRequests = await this.purchaseRequestService.getAll();
      return ApiResponse.success(res, purchaseRequests, "Purchase requests retrieved successfully");
    } catch (error) {
      return ApiResponse.error(res, ErrorHandler.getErrorMessage(error));
    }
  };

  getById = async (req: Request, res: Response) => {
    try {
      const purchaseRequest = await this.purchaseRequestService.getById(parseInt(req.params.id));
      if (!purchaseRequest) {
        return ApiResponse.notFound(res, "Purchase request not found");
      }
      return ApiResponse.success(res, purchaseRequest, "Purchase request retrieved successfully");
    } catch (error) {
      return ApiResponse.error(res, ErrorHandler.getErrorMessage(error));
    }
  };

  create = async (req: Request, res: Response) => {
    try {
      const purchaseRequest = await this.purchaseRequestService.create(req.body);
      return ApiResponse.created(res, purchaseRequest, "Purchase request created successfully");
    } catch (error) {
      return ApiResponse.badRequest(res, ErrorHandler.getErrorMessage(error));
    }
  };

  update = async (req: Request, res: Response) => {
    try {
      const purchaseRequest = await this.purchaseRequestService.update(parseInt(req.params.id), req.body);
      return ApiResponse.success(res, purchaseRequest, "Purchase request updated successfully");
    } catch (error) {
      return ApiResponse.badRequest(res, ErrorHandler.getErrorMessage(error));
    }
  };

  delete = async (req: Request, res: Response) => {
    try {
      await this.purchaseRequestService.delete(parseInt(req.params.id));
      return ApiResponse.success(res, null, "Purchase request deleted successfully");
    } catch (error) {
      return ApiResponse.badRequest(res, ErrorHandler.getErrorMessage(error));
    }
  };
}
