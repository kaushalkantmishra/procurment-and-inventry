import { Request, Response } from "express";
import { ItemService } from "../services/item.service";
import { ApiResponse } from "../../../utils/response.util";
import { ErrorHandler } from "../../../utils/error.util";

export class ItemController {
  private itemService: ItemService;

  constructor() {
    this.itemService = new ItemService();
  }

  getAll = async (req: Request, res: Response) => {
    try {
      const items = await this.itemService.getAllItems();
      return ApiResponse.success(res, items, "Items retrieved successfully");
    } catch (error) {
      return ApiResponse.error(res, ErrorHandler.getErrorMessage(error));
    }
  };

  create = async (req: Request, res: Response) => {
    try {
      const item = await this.itemService.createItem(req.body);
      return ApiResponse.created(res, item, "Item created successfully");
    } catch (error) {
      return ApiResponse.badRequest(res, ErrorHandler.getErrorMessage(error));
    }
  };

  getById = async (req: Request, res: Response) => {
    try {
      const item = await this.itemService.getItemById(parseInt(req.params.id));
      return ApiResponse.success(res, item, "Item retrieved successfully");
    } catch (error) {
      return ApiResponse.notFound(res, ErrorHandler.getErrorMessage(error));
    }
  };

  update = async (req: Request, res: Response) => {
    try {
      const item = await this.itemService.updateItem(
        parseInt(req.params.id),
        req.body
      );
      return ApiResponse.success(res, item, "Item updated successfully");
    } catch (error) {
      return ApiResponse.badRequest(res, ErrorHandler.getErrorMessage(error));
    }
  };

  delete = async (req: Request, res: Response) => {
    try {
      const item = await this.itemService.deleteItem(parseInt(req.params.id));
      return ApiResponse.success(res, item, "Item deleted successfully");
    } catch (error) {
      return ApiResponse.badRequest(res, ErrorHandler.getErrorMessage(error));
    }
  };
}
