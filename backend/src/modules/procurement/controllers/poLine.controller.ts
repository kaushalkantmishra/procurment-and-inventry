import { Request, Response } from "express";
import { POLineService } from "../services/poLine.service";
import { ApiResponse } from "../../../utils/response.util";
import { ErrorHandler } from "../../../utils/error.util";

export class POLineController {
  private poLineService: POLineService;

  constructor() {
    this.poLineService = new POLineService();
  }

  getAll = async (req: Request, res: Response) => {
    try {
      const lines = await this.poLineService.getAll();
      return ApiResponse.success(
        res,
        lines,
        "PO lines retrieved successfully",
        200,
        "po-lines-get-all",
        req
      );
    } catch (error) {
      return ApiResponse.error(
        res,
        ErrorHandler.getErrorMessage(error),
        500,
        "po-lines-get-all",
        req
      );
    }
  };

  getById = async (req: Request, res: Response) => {
    try {
      const line = await this.poLineService.getById(parseInt(req.params.id));
      if (!line) {
        return ApiResponse.notFound(
          res,
          "PO line not found",
          "po-lines-get-by-id",
          req
        );
      }
      return ApiResponse.success(
        res,
        line,
        "PO line retrieved successfully",
        200,
        "po-lines-get-by-id",
        req
      );
    } catch (error) {
      return ApiResponse.error(
        res,
        ErrorHandler.getErrorMessage(error),
        500,
        "po-lines-get-by-id",
        req
      );
    }
  };

  getByPOId = async (req: Request, res: Response) => {
    try {
      const lines = await this.poLineService.getByPOId(
        parseInt(req.params.poId)
      );
      return ApiResponse.success(
        res,
        lines,
        "PO lines retrieved successfully",
        200,
        "po-lines-get-by-po",
        req
      );
    } catch (error) {
      return ApiResponse.error(
        res,
        ErrorHandler.getErrorMessage(error),
        500,
        "po-lines-get-by-po",
        req
      );
    }
  };

  create = async (req: Request, res: Response) => {
    try {
      const line = await this.poLineService.create(req.body);
      return ApiResponse.created(
        res,
        line,
        "PO line created successfully",
        "po-lines-create",
        req
      );
    } catch (error) {
      return ApiResponse.badRequest(
        res,
        ErrorHandler.getErrorMessage(error),
        "po-lines-create",
        req
      );
    }
  };

  update = async (req: Request, res: Response) => {
    try {
      const line = await this.poLineService.update(
        parseInt(req.params.id),
        req.body
      );
      return ApiResponse.success(
        res,
        line,
        "PO line updated successfully",
        200,
        "po-lines-update",
        req
      );
    } catch (error) {
      return ApiResponse.badRequest(
        res,
        ErrorHandler.getErrorMessage(error),
        "po-lines-update",
        req
      );
    }
  };

  delete = async (req: Request, res: Response) => {
    try {
      await this.poLineService.delete(parseInt(req.params.id));
      return ApiResponse.success(
        res,
        null,
        "PO line deleted successfully",
        200,
        "po-lines-delete",
        req
      );
    } catch (error) {
      return ApiResponse.badRequest(
        res,
        ErrorHandler.getErrorMessage(error),
        "po-lines-delete",
        req
      );
    }
  };
}
