import { Request, Response } from "express";
import { POLineService } from "../services/poLine.service";
import { ApiResponse } from '../utils/response.util';
import { ErrorHandler } from '../utils/error.util';

export class POLineController {
  static async getAll(req: Request, res: Response) {
    try {
      const lines = await POLineService.getAll();
      return ApiResponse.success(res, "PO lines retrieved successfully", lines);
    } catch (error) {
      return ErrorHandler.handleError(res, error);
    }
  }

  static async getById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const line = await POLineService.getById(parseInt(id));
      if (!line) {
        return ApiResponse.error(res, "PO line not found", 404);
      }
      return ApiResponse.success(res, "PO line retrieved successfully", line);
    } catch (error) {
      return ErrorHandler.handleError(res, error);
    }
  }

  static async getByPOId(req: Request, res: Response) {
    try {
      const { poId } = req.params;
      const lines = await POLineService.getByPOId(parseInt(poId));
      return ApiResponse.success(res, "PO lines retrieved successfully", lines);
    } catch (error) {
      return ErrorHandler.handleError(res, error);
    }
  }

  static async create(req: Request, res: Response) {
    try {
      const line = await POLineService.create(req.body);
      return ApiResponse.success(res, "PO line created successfully", line, 201);
    } catch (error) {
      return ErrorHandler.handleError(res, error);
    }
  }

  static async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const line = await POLineService.update(parseInt(id), req.body);
      return ApiResponse.success(res, "PO line updated successfully", line);
    } catch (error) {
      return ErrorHandler.handleError(res, error);
    }
  }

  static async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;
      await POLineService.delete(parseInt(id));
      return ApiResponse.success(res, "PO line deleted successfully");
    } catch (error) {
      return ErrorHandler.handleError(res, error);
    }
  }
}