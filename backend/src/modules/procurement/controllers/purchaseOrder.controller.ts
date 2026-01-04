import { Request, Response } from "express";
import { PurchaseOrderService } from "../services/purchaseOrder.service";
import { ApiResponse } from "../../../utils/response.util";
import { ErrorHandler } from "../../../utils/error.util";

export class PurchaseOrderController {
  private purchaseOrderService: PurchaseOrderService;

  constructor() {
    this.purchaseOrderService = new PurchaseOrderService();
  }

  getAll = async (req: Request, res: Response) => {
    try {
      const purchaseOrders = await this.purchaseOrderService.getAll();
      return ApiResponse.success(
        res,
        purchaseOrders,
        "Purchase orders retrieved successfully"
      );
    } catch (error) {
      return ApiResponse.error(res, ErrorHandler.getErrorMessage(error));
    }
  };

  getById = async (req: Request, res: Response) => {
    try {
      const purchaseOrder = await this.purchaseOrderService.getById(parseInt(req.params.id));
      if (!purchaseOrder) {
        return ApiResponse.notFound(res, "Purchase order not found");
      }
      return ApiResponse.success(
        res,
        purchaseOrder,
        "Purchase order retrieved successfully"
      );
    } catch (error) {
      return ApiResponse.error(res, ErrorHandler.getErrorMessage(error));
    }
  };

  create = async (req: Request, res: Response) => {
    try {
      const purchaseOrder = await this.purchaseOrderService.create(req.body);
      return ApiResponse.created(
        res,
        purchaseOrder,
        "Purchase order created successfully"
      );
    } catch (error) {
      return ApiResponse.badRequest(res, ErrorHandler.getErrorMessage(error));
    }
  };

  update = async (req: Request, res: Response) => {
    try {
      const purchaseOrder = await this.purchaseOrderService.update(
        parseInt(req.params.id),
        req.body
      );
      return ApiResponse.success(
        res,
        purchaseOrder,
        "Purchase order updated successfully"
      );
    } catch (error) {
      return ApiResponse.badRequest(res, ErrorHandler.getErrorMessage(error));
    }
  };

  delete = async (req: Request, res: Response) => {
    try {
      await this.purchaseOrderService.delete(parseInt(req.params.id));
      return ApiResponse.success(res, null, "Purchase order deleted successfully");
    } catch (error) {
      return ApiResponse.badRequest(res, ErrorHandler.getErrorMessage(error));
    }
  };
}
