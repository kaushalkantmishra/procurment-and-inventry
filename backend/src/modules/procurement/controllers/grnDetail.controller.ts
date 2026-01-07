import { Request, Response } from "express";
import { GRNDetailService } from "../services/grnDetail.service";
import { ApiResponse } from "../../../utils/response.util";
import { ErrorHandler } from "../../../utils/error.util";

export class GRNDetailController {
  private grnDetailService: GRNDetailService;

  constructor() {
    this.grnDetailService = new GRNDetailService();
  }

  getAll = async (req: Request, res: Response) => {
    try {
      const details = await this.grnDetailService.getAll();
      return ApiResponse.success(
        res,
        details,
        "GRN details retrieved successfully",
        200,
        "grn-details-get-all",
        req
      );
    } catch (error) {
      return ApiResponse.error(
        res,
        ErrorHandler.getErrorMessage(error),
        500,
        "grn-details-get-all",
        req
      );
    }
  };

  getById = async (req: Request, res: Response) => {
    try {
      const detail = await this.grnDetailService.getById(
        parseInt(req.params.id)
      );
      if (!detail) {
        return ApiResponse.notFound(
          res,
          "GRN detail not found",
          "grn-details-get-by-id",
          req
        );
      }
      return ApiResponse.success(
        res,
        detail,
        "GRN detail retrieved successfully",
        200,
        "grn-details-get-by-id",
        req
      );
    } catch (error) {
      return ApiResponse.error(
        res,
        ErrorHandler.getErrorMessage(error),
        500,
        "grn-details-get-by-id",
        req
      );
    }
  };

  getByGRNId = async (req: Request, res: Response) => {
    try {
      const details = await this.grnDetailService.getByGRNId(
        parseInt(req.params.grnId)
      );
      return ApiResponse.success(
        res,
        details,
        "GRN details retrieved successfully",
        200,
        "grn-details-get-by-grn",
        req
      );
    } catch (error) {
      return ApiResponse.error(
        res,
        ErrorHandler.getErrorMessage(error),
        500,
        "grn-details-get-by-grn",
        req
      );
    }
  };

  create = async (req: Request, res: Response) => {
    try {
      const detail = await this.grnDetailService.create(req.body);
      return ApiResponse.created(
        res,
        detail,
        "GRN detail created successfully",
        "grn-details-create",
        req
      );
    } catch (error) {
      return ApiResponse.badRequest(
        res,
        ErrorHandler.getErrorMessage(error),
        "grn-details-create",
        req
      );
    }
  };

  update = async (req: Request, res: Response) => {
    try {
      const detail = await this.grnDetailService.update(
        parseInt(req.params.id),
        req.body
      );
      return ApiResponse.success(
        res,
        detail,
        "GRN detail updated successfully",
        200,
        "grn-details-update",
        req
      );
    } catch (error) {
      return ApiResponse.badRequest(
        res,
        ErrorHandler.getErrorMessage(error),
        "grn-details-update",
        req
      );
    }
  };

  delete = async (req: Request, res: Response) => {
    try {
      await this.grnDetailService.delete(parseInt(req.params.id));
      return ApiResponse.success(
        res,
        null,
        "GRN detail deleted successfully",
        200,
        "grn-details-delete",
        req
      );
    } catch (error) {
      return ApiResponse.badRequest(
        res,
        ErrorHandler.getErrorMessage(error),
        "grn-details-delete",
        req
      );
    }
  };
}
