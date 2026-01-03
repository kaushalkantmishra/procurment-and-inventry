import { Request, Response } from "express";
import { GRNHeaderService } from "../services/grnHeader.service";
import { ApiResponse } from '../utils/response.util';
import { ErrorHandler } from '../utils/error.util';
export class GRNHeaderController {
  static async getAll(req: Request, res: Response) {
    try {
      const grnHeaders = await GRNHeaderService.getAll();
      return ApiResponse.success(res, "GRN headers retrieved successfully", grnHeaders);
    } catch (error) {
      return ErrorHandler.handleError(res, error);
    }
  }

  static async getById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const grnHeader = await GRNHeaderService.getById(parseInt(id));
      if (!grnHeader) {
        return ApiResponse.error(res, "GRN header not found", 404);
      }
      return ApiResponse.success(res, "GRN header retrieved successfully", grnHeader);
    } catch (error) {
      return ErrorHandler.handleError(res, error);
    }
  }

  static async create(req: Request, res: Response) {
    try {
      const grnHeader = await GRNHeaderService.create(req.body);
      return ApiResponse.success(res, "GRN header created successfully", grnHeader, 201);
    } catch (error) {
      return ErrorHandler.handleError(res, error);
    }
  }

  static async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const grnHeader = await GRNHeaderService.update(parseInt(id), req.body);
      return ApiResponse.success(res, "GRN header updated successfully", grnHeader);
    } catch (error) {
      return ErrorHandler.handleError(res, error);
    }
  }

  static async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;
      await GRNHeaderService.delete(parseInt(id));
      return ApiResponse.success(res, "GRN header deleted successfully");
    } catch (error) {
      return ErrorHandler.handleError(res, error);
    }
  }
}