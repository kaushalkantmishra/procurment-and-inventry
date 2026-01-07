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
      return ApiResponse.success(res, purchaseRequests, "Purchase requests retrieved successfully", 200, "purchase-requests-get-all", req);
    } catch (error) {
      return ApiResponse.error(res, ErrorHandler.getErrorMessage(error), 500, "purchase-requests-get-all", req);
    }
  };

  getById = async (req: Request, res: Response) => {
    try {
      const purchaseRequest = await this.purchaseRequestService.getById(parseInt(req.params.id));
      if (!purchaseRequest) {
        return ApiResponse.notFound(res, "Purchase request not found", "purchase-requests-get-by-id", req);
      }
      return ApiResponse.success(res, purchaseRequest, "Purchase request retrieved successfully", 200, "purchase-requests-get-by-id", req);
    } catch (error) {
      return ApiResponse.error(res, ErrorHandler.getErrorMessage(error), 500, "purchase-requests-get-by-id", req);
    }
  };

  create = async (req: Request, res: Response) => {
    try {
      const purchaseRequest = await this.purchaseRequestService.create(req.body);
      return ApiResponse.created(res, purchaseRequest, "Purchase request created successfully", "purchase-requests-create", req);
    } catch (error) {
      return ApiResponse.badRequest(res, ErrorHandler.getErrorMessage(error), "purchase-requests-create", req);
    }
  };

  update = async (req: Request, res: Response) => {
    try {
      const purchaseRequest = await this.purchaseRequestService.update(parseInt(req.params.id), req.body);
      return ApiResponse.success(res, purchaseRequest, "Purchase request updated successfully", 200, "purchase-requests-update", req);
    } catch (error) {
      return ApiResponse.badRequest(res, ErrorHandler.getErrorMessage(error), "purchase-requests-update", req);
    }
  };

  delete = async (req: Request, res: Response) => {
    try {
      await this.purchaseRequestService.delete(parseInt(req.params.id));
      return ApiResponse.success(res, null, "Purchase request deleted successfully", 200, "purchase-requests-delete", req);
    } catch (error) {
      return ApiResponse.badRequest(res, ErrorHandler.getErrorMessage(error), "purchase-requests-delete", req);
    }
  };
}
