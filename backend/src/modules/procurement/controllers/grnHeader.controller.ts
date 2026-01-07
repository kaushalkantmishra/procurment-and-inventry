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
      return ApiResponse.success(res, grnHeaders, "GRN headers retrieved successfully");
    } catch (error) {
      return ApiResponse.error(res, ErrorHandler.getErrorMessage(error));
    }
  };

  getById = async (req: Request, res: Response) => {
    try {
      const grnHeader = await this.grnHeaderService.getById(parseInt(req.params.id));
      if (!grnHeader) {
        return ApiResponse.notFound(res, "GRN header not found");
      }
      return ApiResponse.success(res, grnHeader, "GRN header retrieved successfully");
    } catch (error) {
      return ApiResponse.error(res, ErrorHandler.getErrorMessage(error));
    }
  };

  create = async (req: Request, res: Response) => {
    try {
      console.log('GRN Controller - Received data:', req.body); // Debug log
      const grnHeader = await this.grnHeaderService.create(req.body);
      console.log('GRN Controller - Created GRN:', grnHeader); // Debug log
      return ApiResponse.created(res, grnHeader, "GRN header created successfully");
    } catch (error) {
      console.error('GRN Controller - Error:', error); // Debug log
      return ApiResponse.badRequest(res, ErrorHandler.getErrorMessage(error));
    }
  };

  update = async (req: Request, res: Response) => {
    try {
      const grnHeader = await this.grnHeaderService.update(parseInt(req.params.id), req.body);
      return ApiResponse.success(res, grnHeader, "GRN header updated successfully");
    } catch (error) {
      return ApiResponse.badRequest(res, ErrorHandler.getErrorMessage(error));
    }
  };

  delete = async (req: Request, res: Response) => {
    try {
      await this.grnHeaderService.delete(parseInt(req.params.id));
      return ApiResponse.success(res, null, "GRN header deleted successfully");
    } catch (error) {
      return ApiResponse.badRequest(res, ErrorHandler.getErrorMessage(error));
    }
  };

  approve = async (req: Request, res: Response) => {
    try {
      const result = await this.grnHeaderService.approve(
        parseInt(req.params.id),
        req.body.approvedBy || 'ADMIN'
      );
      return ApiResponse.success(
        res,
        result,
        "GRN approved successfully"
      );
    } catch (error) {
      return ApiResponse.badRequest(res, ErrorHandler.getErrorMessage(error));
    }
  };

  reject = async (req: Request, res: Response) => {
    try {
      const result = await this.grnHeaderService.reject(
        parseInt(req.params.id),
        req.body.rejectedBy || 'ADMIN',
        req.body.reason || 'No reason provided'
      );
      return ApiResponse.success(
        res,
        result,
        "GRN rejected successfully"
      );
    } catch (error) {
      return ApiResponse.badRequest(res, ErrorHandler.getErrorMessage(error));
    }
  };
}
