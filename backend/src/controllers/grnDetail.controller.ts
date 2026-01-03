import { Request, Response } from "express";
import { GRNDetailService } from "../services/grnDetail.service";
import { ApiResponse } from '../utils/response.util';
import { ErrorHandler } from '../utils/error.util';

export class GRNDetailController {
  static async getAll(req: Request, res: Response) {
    try {
      const details = await GRNDetailService.getAll();
      return ApiResponse.success(res, "GRN details retrieved successfully", details);
    } catch (error) {
      return ErrorHandler.handleError(res, error);
    }
  }

  static async getById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const detail = await GRNDetailService.getById(parseInt(id));
      if (!detail) {
        return ApiResponse.error(res, "GRN detail not found", 404);
      }
      return ApiResponse.success(res, "GRN detail retrieved successfully", detail);
    } catch (error) {
      return ErrorHandler.handleError(res, error);
    }
  }

  static async getByGRNId(req: Request, res: Response) {
    try {
      const { grnId } = req.params;
      const details = await GRNDetailService.getByGRNId(parseInt(grnId));
      return ApiResponse.success(res, "GRN details retrieved successfully", details);
    } catch (error) {
      return ErrorHandler.handleError(res, error);
    }
  }

  static async create(req: Request, res: Response) {
    try {
      const detail = await GRNDetailService.create(req.body);
      return ApiResponse.success(res, "GRN detail created successfully", detail, 201);
    } catch (error) {
      return ErrorHandler.handleError(res, error);
    }
  }

  static async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const detail = await GRNDetailService.update(parseInt(id), req.body);
      return ApiResponse.success(res, "GRN detail updated successfully", detail);
    } catch (error) {
      return ErrorHandler.handleError(res, error);
    }
  }

  static async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;
      await GRNDetailService.delete(parseInt(id));
      return ApiResponse.success(res, "GRN detail deleted successfully");
    } catch (error) {
      return ErrorHandler.handleError(res, error);
    }
  }
}