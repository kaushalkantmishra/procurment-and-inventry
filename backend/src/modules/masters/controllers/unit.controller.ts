import { Request, Response } from "express";
import { UnitService } from "../services/unit.service";
import { ApiResponse } from "../../../utils/response.util";
import { ErrorHandler } from "../../../utils/error.util";

export class UnitController {
  private unitService: UnitService;

  constructor() {
    this.unitService = new UnitService();
  }

  getAll = async (req: Request, res: Response) => {
    try {
      const units = await this.unitService.getAllUnits();
      return ApiResponse.success(res, units, "Units retrieved successfully");
    } catch (error) {
      return ApiResponse.error(res, ErrorHandler.getErrorMessage(error));
    }
  };

  create = async (req: Request, res: Response) => {
    try {
      const unit = await this.unitService.createUnit(req.body);
      return ApiResponse.created(res, unit, "Unit created successfully");
    } catch (error) {
      return ApiResponse.badRequest(res, ErrorHandler.getErrorMessage(error));
    }
  };

  getById = async (req: Request, res: Response) => {
    try {
      const unit = await this.unitService.getUnitById(parseInt(req.params.id));
      return ApiResponse.success(res, unit, "Unit retrieved successfully");
    } catch (error) {
      return ApiResponse.notFound(res, ErrorHandler.getErrorMessage(error));
    }
  };

  update = async (req: Request, res: Response) => {
    try {
      const unit = await this.unitService.updateUnit(
        parseInt(req.params.id),
        req.body
      );
      return ApiResponse.success(res, unit, "Unit updated successfully");
    } catch (error) {
      return ApiResponse.badRequest(res, ErrorHandler.getErrorMessage(error));
    }
  };

  delete = async (req: Request, res: Response) => {
    try {
      const unit = await this.unitService.deleteUnit(parseInt(req.params.id));
      return ApiResponse.success(res, unit, "Unit deleted successfully");
    } catch (error) {
      return ApiResponse.badRequest(res, ErrorHandler.getErrorMessage(error));
    }
  };
}
