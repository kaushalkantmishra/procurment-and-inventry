import { Request, Response } from "express";
import { PurchaseRequestLineService } from "../services/purchaseRequestLine.service";
import { ApiResponse } from "../../../utils/response.util";

export class PurchaseRequestLineController {
  private service: PurchaseRequestLineService;

  constructor() {
    this.service = new PurchaseRequestLineService();
  }

  getByPrId = async (req: Request, res: Response) => {
    try {
      const prId = parseInt(req.query.prId as string);

      if (!prId) {
        return ApiResponse.badRequest(
          res,
          "prId query parameter is required",
          "pr-lines-get-by-pr",
          req
        );
      }

      const lines = await this.service.getByPrId(prId);
      return ApiResponse.success(
        res,
        lines,
        "Purchase request lines retrieved successfully",
        200,
        "pr-lines-get-by-pr",
        req
      );
    } catch (error: any) {
      return ApiResponse.error(
        res,
        error.message,
        500,
        "pr-lines-get-by-pr",
        req
      );
    }
  };

  create = async (req: Request, res: Response) => {
    try {
      const line = await this.service.create(req.body);
      return ApiResponse.created(
        res,
        line,
        "Purchase request line created successfully",
        "pr-lines-create",
        req
      );
    } catch (error: any) {
      if (
        error.message.includes("not found") ||
        error.message.includes("Cannot modify")
      ) {
        return ApiResponse.badRequest(
          res,
          error.message,
          "pr-lines-create",
          req
        );
      }
      return ApiResponse.error(res, error.message, 500, "pr-lines-create", req);
    }
  };

  update = async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const line = await this.service.update(id, req.body);
      return ApiResponse.success(
        res,
        line,
        "Purchase request line updated successfully",
        200,
        "pr-lines-update",
        req
      );
    } catch (error: any) {
      if (
        error.message.includes("not found") ||
        error.message.includes("Cannot modify")
      ) {
        return ApiResponse.badRequest(
          res,
          error.message,
          "pr-lines-update",
          req
        );
      }
      return ApiResponse.error(res, error.message, 500, "pr-lines-update", req);
    }
  };

  delete = async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const line = await this.service.delete(id);
      return ApiResponse.success(
        res,
        line,
        "Purchase request line deleted successfully",
        200,
        "pr-lines-delete",
        req
      );
    } catch (error: any) {
      if (
        error.message.includes("not found") ||
        error.message.includes("Cannot modify")
      ) {
        return ApiResponse.badRequest(
          res,
          error.message,
          "pr-lines-delete",
          req
        );
      }
      return ApiResponse.error(res, error.message, 500, "pr-lines-delete", req);
    }
  };
}
