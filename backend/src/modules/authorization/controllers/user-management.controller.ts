import { Request, Response } from "express";
import { UserManagementService } from "../services/user-management.service";
import { ApiResponse } from "../../../utils/response.util";
import { ErrorHandler } from "../../../utils/error.util";

export class UserManagementController {
  private userManagementService: UserManagementService;

  constructor() {
    this.userManagementService = new UserManagementService();
  }

  assignRoles = async (req: Request, res: Response) => {
    try {
      const { userId, roleIds, primaryRoleId } = req.body;
      
      if (!userId || !roleIds || !Array.isArray(roleIds)) {
        return ApiResponse.badRequest(res, "userId and roleIds array are required");
      }

      const result = await this.userManagementService.assignRoles(userId, roleIds, primaryRoleId);
      return ApiResponse.success(res, result, "Roles assigned successfully");
    } catch (error) {
      return ApiResponse.error(res, ErrorHandler.getErrorMessage(error));
    }
  };

  getUserRoles = async (req: Request, res: Response) => {
    try {
      const { userId } = req.params;
      const roles = await this.userManagementService.getUserRoles(userId);
      return ApiResponse.success(res, roles, "User roles retrieved successfully");
    } catch (error) {
      return ApiResponse.error(res, ErrorHandler.getErrorMessage(error));
    }
  };

  getAllRoles = async (req: Request, res: Response) => {
    try {
      const roles = await this.userManagementService.getAllRoles();
      return ApiResponse.success(res, roles, "Roles retrieved successfully");
    } catch (error) {
      return ApiResponse.error(res, ErrorHandler.getErrorMessage(error));
    }
  };

  getAllUsers = async (req: Request, res: Response) => {
    try {
      const users = await this.userManagementService.getAllUsers();
      return ApiResponse.success(res, users, "Users retrieved successfully");
    } catch (error) {
      return ApiResponse.error(res, ErrorHandler.getErrorMessage(error));
    }
  };
}