import { Response } from 'express';

export class ApiResponse {
  static success(res: Response, data: any, message: string = 'Success', statusCode: number = 200) {
    return res.status(statusCode).json({
      success: true,
      message,
      data
    });
  }

  static created(res: Response, data: any, message: string = 'Created successfully') {
    return this.success(res, data, message, 201);
  }

  static error(res: Response, message: string = 'Internal server error', statusCode: number = 500) {
    return res.status(statusCode).json({
      success: false,
      message,
      data: null
    });
  }

  static badRequest(res: Response, message: string = 'Bad request') {
    return this.error(res, message, 400);
  }

  static notFound(res: Response, message: string = 'Resource not found') {
    return this.error(res, message, 404);
  }

  static unauthorized(res: Response, message: string = 'Unauthorized') {
    return this.error(res, message, 401);
  }
}