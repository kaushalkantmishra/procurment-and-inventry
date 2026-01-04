import { Request, Response } from "express";
import { AuthService } from "../services/auth.service";
import { ApiResponse } from "../../../utils/response.util";
import { ErrorHandler } from "../../../utils/error.util";

export class AuthController {
  private authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  login = async (req: Request, res: Response) => {
    try {
      const result = await this.authService.login(req.body);
      return ApiResponse.success(res, result, "Login successful");
    } catch (error) {
      return ApiResponse.unauthorized(res, ErrorHandler.getErrorMessage(error));
    }
  };

  register = async (req: Request, res: Response) => {
    try {
      const result = await this.authService.register(req.body);
      return ApiResponse.created(res, result, "User registered successfully");
    } catch (error) {
      return ApiResponse.badRequest(res, ErrorHandler.getErrorMessage(error));
    }
  };

  logout = async (req: Request, res: Response) => {
    try {
      const result = await this.authService.logout();
      return ApiResponse.success(res, result, "Logged out successfully");
    } catch (error) {
      return ApiResponse.error(res, ErrorHandler.getErrorMessage(error));
    }
  };

  getCurrentUser = async (req: Request, res: Response) => {
    try {
      const token = req.headers.authorization?.replace("Bearer ", "");
      const user = await this.authService.getCurrentUser(token);
      return ApiResponse.success(res, user, "User retrieved successfully");
    } catch (error) {
      return ApiResponse.unauthorized(res, ErrorHandler.getErrorMessage(error));
    }
  };
}
