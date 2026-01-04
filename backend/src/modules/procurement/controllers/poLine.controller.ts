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
      return ApiResponse.success(res, lines, "PO lines retrieved successfully");
    } catch (error) {
      return ApiResponse.error(res, ErrorHandler.getErrorMessage(error));
    }
  };

  getById = async (req: Request, res: Response) => {
    try {
      const line = await this.poLineService.getById(parseInt(req.params.id));
      if (!line) {
        return ApiResponse.notFound(res, "PO line not found");
      }
      return ApiResponse.success(res, line, "PO line retrieved successfully");
    } catch (error) {
      return ApiResponse.error(res, ErrorHandler.getErrorMessage(error));
    }
  };

  getByPOId = async (req: Request, res: Response) => {
    try {
      const lines = await this.poLineService.getByPOId(parseInt(req.params.poId));
      return ApiResponse.success(res, lines, "PO lines retrieved successfully");
    } catch (error) {
      return ApiResponse.error(res, ErrorHandler.getErrorMessage(error));
    }
  };

  create = async (req: Request, res: Response) => {
    try {
      const line = await this.poLineService.create(req.body);
      return ApiResponse.created(res, line, "PO line created successfully");
    } catch (error) {
      return ApiResponse.badRequest(res, ErrorHandler.getErrorMessage(error));
    }
  };

  update = async (req: Request, res: Response) => {
    try {
      const line = await this.poLineService.update(parseInt(req.params.id), req.body);
      return ApiResponse.success(res, line, "PO line updated successfully");
    } catch (error) {
      return ApiResponse.badRequest(res, ErrorHandler.getErrorMessage(error));
    }
  };

  delete = async (req: Request, res: Response) => {
    try {
      await this.poLineService.delete(parseInt(req.params.id));
      return ApiResponse.success(res, null, "PO line deleted successfully");
    } catch (error) {
      return ApiResponse.badRequest(res, ErrorHandler.getErrorMessage(error));
    }
  };
}
