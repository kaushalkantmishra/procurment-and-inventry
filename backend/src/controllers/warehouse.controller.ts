import { Request, Response } from 'express';
import { WarehouseService } from '../services/warehouse.service';
import { ApiResponse } from '../utils/response.util';
import { ErrorHandler } from '../utils/error.util';

export class WarehouseController {
  private warehouseService: WarehouseService;

  constructor() {
    this.warehouseService = new WarehouseService();
  }

  getAll = async (req: Request, res: Response) => {
    try {
      const warehouses = await this.warehouseService.getAllWarehouses();
      return ApiResponse.success(res, warehouses, 'Warehouses retrieved successfully');
    } catch (error) {
      return ApiResponse.error(res, ErrorHandler.getErrorMessage(error));
    }
  };

  create = async (req: Request, res: Response) => {
    try {
      const warehouse = await this.warehouseService.createWarehouse(req.body);
      return ApiResponse.created(res, warehouse, 'Warehouse created successfully');
    } catch (error) {
      return ApiResponse.badRequest(res, ErrorHandler.getErrorMessage(error));
    }
  };

  getById = async (req: Request, res: Response) => {
    try {
      const warehouse = await this.warehouseService.getWarehouseById(parseInt(req.params.id));
      return ApiResponse.success(res, warehouse, 'Warehouse retrieved successfully');
    } catch (error) {
      return ApiResponse.notFound(res, ErrorHandler.getErrorMessage(error));
    }
  };

  update = async (req: Request, res: Response) => {
    try {
      const warehouse = await this.warehouseService.updateWarehouse(parseInt(req.params.id), req.body);
      return ApiResponse.success(res, warehouse, 'Warehouse updated successfully');
    } catch (error) {
      return ApiResponse.badRequest(res, ErrorHandler.getErrorMessage(error));
    }
  };

  delete = async (req: Request, res: Response) => {
    try {
      const warehouse = await this.warehouseService.deleteWarehouse(parseInt(req.params.id));
      return ApiResponse.success(res, warehouse, 'Warehouse deleted successfully');
    } catch (error) {
      return ApiResponse.badRequest(res, ErrorHandler.getErrorMessage(error));
    }
  };
}