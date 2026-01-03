import { Request, Response } from 'express';
import { CategoryService } from '../services/category.service';
import { ApiResponse } from '../utils/response.util';
import { ErrorHandler } from '../utils/error.util';

export class CategoryController {
  private categoryService: CategoryService;

  constructor() {
    this.categoryService = new CategoryService();
  }

  getAll = async (req: Request, res: Response) => {
    try {
      const categories = await this.categoryService.getAllCategories();
      return ApiResponse.success(res, categories, 'Categories retrieved successfully');
    } catch (error) {
      return ApiResponse.error(res, ErrorHandler.getErrorMessage(error));
    }
  };

  create = async (req: Request, res: Response) => {
    try {
      const category = await this.categoryService.createCategory(req.body);
      return ApiResponse.created(res, category, 'Category created successfully');
    } catch (error) {
      return ApiResponse.badRequest(res, ErrorHandler.getErrorMessage(error));
    }
  };

  getById = async (req: Request, res: Response) => {
    try {
      const category = await this.categoryService.getCategoryById(parseInt(req.params.id));
      return ApiResponse.success(res, category, 'Category retrieved successfully');
    } catch (error) {
      return ApiResponse.notFound(res, ErrorHandler.getErrorMessage(error));
    }
  };

  update = async (req: Request, res: Response) => {
    try {
      const category = await this.categoryService.updateCategory(parseInt(req.params.id), req.body);
      return ApiResponse.success(res, category, 'Category updated successfully');
    } catch (error) {
      return ApiResponse.badRequest(res, ErrorHandler.getErrorMessage(error));
    }
  };

  delete = async (req: Request, res: Response) => {
    try {
      const category = await this.categoryService.deleteCategory(parseInt(req.params.id));
      return ApiResponse.success(res, category, 'Category deleted successfully');
    } catch (error) {
      return ApiResponse.badRequest(res, ErrorHandler.getErrorMessage(error));
    }
  };
}