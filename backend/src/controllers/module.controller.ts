import { Request, Response } from 'express';
import { ModuleService } from '../services/module.service';
import { ApiResponse } from '../utils/response.util';
import { ErrorHandler } from '../utils/error.util';

export class ModuleController {
  private moduleService: ModuleService;

  constructor() {
    this.moduleService = new ModuleService();
  }

  getAll = async (req: Request, res: Response) => {
    try {
      const modules = await this.moduleService.getAllModules();
      return ApiResponse.success(res, modules, 'Modules retrieved successfully');
    } catch (error) {
      return ApiResponse.error(res, ErrorHandler.getErrorMessage(error));
    }
  };

  create = async (req: Request, res: Response) => {
    try {
      const module = await this.moduleService.createModule(req.body);
      return ApiResponse.created(res, module, 'Module created successfully');
    } catch (error) {
      return ApiResponse.badRequest(res, ErrorHandler.getErrorMessage(error));
    }
  };

  getById = async (req: Request, res: Response) => {
    try {
      const module = await this.moduleService.getModuleById(parseInt(req.params.id));
      return ApiResponse.success(res, module, 'Module retrieved successfully');
    } catch (error) {
      return ApiResponse.notFound(res, ErrorHandler.getErrorMessage(error));
    }
  };

  update = async (req: Request, res: Response) => {
    try {
      const module = await this.moduleService.updateModule(parseInt(req.params.id), req.body);
      return ApiResponse.success(res, module, 'Module updated successfully');
    } catch (error) {
      return ApiResponse.badRequest(res, ErrorHandler.getErrorMessage(error));
    }
  };

  delete = async (req: Request, res: Response) => {
    try {
      const module = await this.moduleService.deleteModule(parseInt(req.params.id));
      return ApiResponse.success(res, module, 'Module deleted successfully');
    } catch (error) {
      return ApiResponse.badRequest(res, ErrorHandler.getErrorMessage(error));
    }
  };
}