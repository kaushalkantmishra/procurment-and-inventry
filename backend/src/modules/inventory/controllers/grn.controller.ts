import { Request, Response } from "express";
import { GRNService } from "../services/grn.service";
import { ApiResponse } from "../../../utils/response.util";
import { ErrorHandler } from "../../../utils/error.util";

export class GRNController {
  private grnService: GRNService;

  constructor() {
    this.grnService = new GRNService();
  }

  getAll = async (req: Request, res: Response) => {
    try {
      const grns = await this.grnService.getAll();
      return ApiResponse.success(res, grns, "GRNs retrieved successfully");
    } catch (error) {
      return ApiResponse.error(res, ErrorHandler.getErrorMessage(error));
    }
  };

  getById = async (req: Request, res: Response) => {
    try {
      const grn = await this.grnService.getById(parseInt(req.params.id));
      return ApiResponse.success(res, grn, "GRN retrieved successfully");
    } catch (error) {
      return ApiResponse.notFound(res, ErrorHandler.getErrorMessage(error));
    }
  };

  create = async (req: Request, res: Response) => {
    try {
      const grn = await this.grnService.create(req.body);
      return ApiResponse.created(res, grn, "GRN created successfully");
    } catch (error) {
      return ApiResponse.badRequest(res, ErrorHandler.getErrorMessage(error));
    }
  };

  update = async (req: Request, res: Response) => {
    try {
      const grn = await this.grnService.update(parseInt(req.params.id), req.body);
      return ApiResponse.success(res, grn, "GRN updated successfully");
    } catch (error) {
      return ApiResponse.badRequest(res, ErrorHandler.getErrorMessage(error));
    }
  };

  delete = async (req: Request, res: Response) => {
    try {
      await this.grnService.delete(parseInt(req.params.id));
      return ApiResponse.success(res, null, "GRN deleted successfully");
    } catch (error) {
      return ApiResponse.badRequest(res, ErrorHandler.getErrorMessage(error));
    }
  };
}
