import { Request, Response } from 'express';
import { GRNService } from '../services/grn.service';
import { ApiResponse } from '../utils/response.util';
import { ErrorHandler } from '../utils/error.util';

export class GRNController {
  static async getAll(req: Request, res: Response) {
    try {
      const grns = await GRNService.getAll();
      return ApiResponse.success(res, grns, 'GRNs retrieved successfully');
    } catch (error) {
      const message = ErrorHandler.getErrorMessage(error);
      return ApiResponse.error(res, message, 500);
    }
  }

  static async getById(req: Request, res: Response) {
    try {
      const grn = await GRNService.getById(parseInt(req.params.id));
      if (!grn) {
        return ApiResponse.notFound(res, 'GRN not found');
      }
      return ApiResponse.success(res, grn, 'GRN retrieved successfully');
    } catch (error) {
      const message = ErrorHandler.getErrorMessage(error);
      return ApiResponse.error(res, message, 500);
    }
  }

  static async create(req: Request, res: Response) {
    try {
      const grn = await GRNService.create(req.body);
      return ApiResponse.created(res, grn, 'GRN created successfully');
    } catch (error) {
      const message = ErrorHandler.getErrorMessage(error);
      return ApiResponse.error(res, message, 500);
    }
  }

  static async update(req: Request, res: Response) {
    try {
      const grn = await GRNService.update(parseInt(req.params.id), req.body);
      return ApiResponse.success(res, grn, 'GRN updated successfully');
    } catch (error) {
      const message = ErrorHandler.getErrorMessage(error);
      return ApiResponse.error(res, message, 500);
    }
  }

  static async delete(req: Request, res: Response) {
    try {
      await GRNService.delete(parseInt(req.params.id));
      return ApiResponse.success(res, null, 'GRN deleted successfully');
    } catch (error) {
      const message = ErrorHandler.getErrorMessage(error);
      return ApiResponse.error(res, message, 500);
    }
  }
}