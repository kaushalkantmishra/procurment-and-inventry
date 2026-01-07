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
        "Purchase orders retrieved successfully",
        200,
        "purchase-orders-get-all",
        req
      );
    } catch (error) {
      return ApiResponse.error(
        res,
        ErrorHandler.getErrorMessage(error),
        500,
        "purchase-orders-get-all",
        req
      );
    }
  };

  getById = async (req: Request, res: Response) => {
    try {
      const purchaseOrder = await this.purchaseOrderService.getById(
        parseInt(req.params.id)
      );
      if (!purchaseOrder) {
        return ApiResponse.notFound(
          res,
          "Purchase order not found",
          "purchase-orders-get-by-id",
          req
        );
      }
      return ApiResponse.success(
        res,
        purchaseOrder,
        "Purchase order retrieved successfully",
        200,
        "purchase-orders-get-by-id",
        req
      );
    } catch (error) {
      return ApiResponse.error(
        res,
        ErrorHandler.getErrorMessage(error),
        500,
        "purchase-orders-get-by-id",
        req
      );
    }
  };

  create = async (req: Request, res: Response) => {
    try {
      const purchaseOrder = await this.purchaseOrderService.create(req.body);
      return ApiResponse.created(
        res,
        purchaseOrder,
        "Purchase order created successfully",
        "purchase-orders-create",
        req
      );
    } catch (error) {
      return ApiResponse.badRequest(
        res,
        ErrorHandler.getErrorMessage(error),
        "purchase-orders-create",
        req
      );
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
        "Purchase order updated successfully",
        200,
        "purchase-orders-update",
        req
      );
    } catch (error) {
      return ApiResponse.badRequest(
        res,
        ErrorHandler.getErrorMessage(error),
        "purchase-orders-update",
        req
      );
    }
  };

  submitForApproval = async (req: Request, res: Response) => {
    try {
      const result = await this.purchaseOrderService.submitForApproval(
        parseInt(req.params.id),
        { submittedBy: req.body.submittedBy || "ADMIN" }
      );
      return ApiResponse.success(
        res,
        result,
        "Purchase order submitted for approval successfully",
        200,
        "purchase-orders-submit-approval",
        req
      );
    } catch (error) {
      return ApiResponse.badRequest(
        res,
        ErrorHandler.getErrorMessage(error),
        "purchase-orders-submit-approval",
        req
      );
    }
  };

  approve = async (req: Request, res: Response) => {
    try {
      const result = await this.purchaseOrderService.approve(
        parseInt(req.params.id),
        { approvedBy: req.body.approvedBy || "ADMIN" }
      );
      return ApiResponse.success(
        res,
        result,
        "Purchase order approved successfully",
        200,
        "purchase-orders-approve",
        req
      );
    } catch (error) {
      return ApiResponse.badRequest(
        res,
        ErrorHandler.getErrorMessage(error),
        "purchase-orders-approve",
        req
      );
    }
  };

  reject = async (req: Request, res: Response) => {
    try {
      const result = await this.purchaseOrderService.reject(
        parseInt(req.params.id),
        {
          rejectedBy: req.body.rejectedBy || "ADMIN",
          reason: req.body.reason || "No reason provided",
        }
      );
      return ApiResponse.success(
        res,
        result,
        "Purchase order rejected successfully",
        200,
        "purchase-orders-reject",
        req
      );
    } catch (error) {
      return ApiResponse.badRequest(
        res,
        ErrorHandler.getErrorMessage(error),
        "purchase-orders-reject",
        req
      );
    }
  };

  delete = async (req: Request, res: Response) => {
    try {
      await this.purchaseOrderService.delete(parseInt(req.params.id));
      return ApiResponse.success(
        res,
        null,
        "Purchase order deleted successfully",
        200,
        "purchase-orders-delete",
        req
      );
    } catch (error) {
      return ApiResponse.badRequest(
        res,
        ErrorHandler.getErrorMessage(error),
        "purchase-orders-delete",
        req
      );
    }
  };

  createFromPR = async (req: Request, res: Response) => {
    try {
      const result = await this.purchaseOrderService.createFromPR(
        parseInt(req.params.prId),
        { createdBy: req.body.createdBy || "ADMIN" }
      );
      return ApiResponse.created(
        res,
        result,
        "Purchase Request converted to Purchase Order successfully",
        "purchase-orders-create-from-pr",
        req
      );
    } catch (error) {
      return ApiResponse.badRequest(
        res,
        ErrorHandler.getErrorMessage(error),
        "purchase-orders-create-from-pr",
        req
      );
    }
  };
}
