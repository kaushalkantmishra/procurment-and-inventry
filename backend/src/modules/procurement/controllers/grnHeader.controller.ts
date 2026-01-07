import { Request, Response } from "express";
import { GRNHeaderService } from "../services/grnHeader.service";
import { ApiResponse } from "../../../utils/response.util";
import { ErrorHandler } from "../../../utils/error.util";
export class GRNHeaderController {
  private grnHeaderService: GRNHeaderService;

  constructor() {
    this.grnHeaderService = new GRNHeaderService();
  }

  getAll = async (req: Request, res: Response) => {
    try {
      const grnHeaders = await this.grnHeaderService.getAll();
      return ApiResponse.success(
        res,
        grnHeaders,
        "GRN headers retrieved successfully",
        200,
        "grn-headers-get-all",
        req
      );
    } catch (error) {
      return ApiResponse.error(
        res,
        ErrorHandler.getErrorMessage(error),
        500,
        "grn-headers-get-all",
        req
      );
    }
  };

  getById = async (req: Request, res: Response) => {
    try {
      const grnHeader = await this.grnHeaderService.getById(
        parseInt(req.params.id)
      );
      if (!grnHeader) {
        return ApiResponse.notFound(
          res,
          "GRN header not found",
          "grn-headers-get-by-id",
          req
        );
      }
      return ApiResponse.success(
        res,
        grnHeader,
        "GRN header retrieved successfully",
        200,
        "grn-headers-get-by-id",
        req
      );
    } catch (error) {
      return ApiResponse.error(
        res,
        ErrorHandler.getErrorMessage(error),
        500,
        "grn-headers-get-by-id",
        req
      );
    }
  };

  create = async (req: Request, res: Response) => {
    try {
      const grnHeader = await this.grnHeaderService.create(req.body);
      return ApiResponse.created(
        res,
        grnHeader,
        "GRN header created successfully",
        "grn-headers-create",
        req
      );
    } catch (error) {
      return ApiResponse.badRequest(
        res,
        ErrorHandler.getErrorMessage(error),
        "grn-headers-create",
        req
      );
    }
  };

  update = async (req: Request, res: Response) => {
    try {
      const grnHeader = await this.grnHeaderService.update(
        parseInt(req.params.id),
        req.body
      );
      return ApiResponse.success(
        res,
        grnHeader,
        "GRN header updated successfully",
        200,
        "grn-headers-update",
        req
      );
    } catch (error) {
      return ApiResponse.badRequest(
        res,
        ErrorHandler.getErrorMessage(error),
        "grn-headers-update",
        req
      );
    }
  };

  delete = async (req: Request, res: Response) => {
    try {
      await this.grnHeaderService.delete(parseInt(req.params.id));
      return ApiResponse.success(
        res,
        null,
        "GRN header deleted successfully",
        200,
        "grn-headers-delete",
        req
      );
    } catch (error) {
      return ApiResponse.badRequest(
        res,
        ErrorHandler.getErrorMessage(error),
        "grn-headers-delete",
        req
      );
    }
  };

  approve = async (req: Request, res: Response) => {
    try {
      const result = await this.grnHeaderService.approve(
        parseInt(req.params.id),
        req.body.approvedBy || "ADMIN"
      );
      return ApiResponse.success(
        res,
        result,
        "GRN approved successfully",
        200,
        "grn-headers-approve",
        req
      );
    } catch (error) {
      return ApiResponse.badRequest(
        res,
        ErrorHandler.getErrorMessage(error),
        "grn-headers-approve",
        req
      );
    }
  };

  reject = async (req: Request, res: Response) => {
    try {
      const result = await this.grnHeaderService.reject(
        parseInt(req.params.id),
        req.body.rejectedBy || "ADMIN",
        req.body.reason || "No reason provided"
      );
      return ApiResponse.success(
        res,
        result,
        "GRN rejected successfully",
        200,
        "grn-headers-reject",
        req
      );
    } catch (error) {
      return ApiResponse.badRequest(
        res,
        ErrorHandler.getErrorMessage(error),
        "grn-headers-reject",
        req
      );
    }
  };
}
