import { Response, Request } from "express";

interface ApiMetadata {
  apiId: string;
  version: number;
  responsetime: number;
  action: string;
}

export class ApiResponse {
  private static readonly API_VERSION = 1;

  static success(
    res: Response,
    data: any,
    message: string = "Success",
    statusCode: number = 200,
    apiId: string = "",
    req?: Request
  ) {
    const startTime = req ? (req as any).startTime : Date.now();
    const responseTime = parseFloat(
      ((Date.now() - startTime) / 1000).toFixed(2)
    );

    return res.status(statusCode).json({
      status: statusCode,
      message,
      metadata: this.generateMetadata(
        apiId,
        responseTime,
        req?.method || "GET"
      ),
      data,
    });
  }

  static created(
    res: Response,
    data: any,
    message: string = "Created successfully",
    apiId: string = "",
    req?: Request
  ) {
    return this.success(res, data, message, 201, apiId, req);
  }

  static error(
    res: Response,
    message: string = "Internal server error",
    statusCode: number = 500,
    apiId: string = "",
    req?: Request
  ) {
    const startTime = req ? (req as any).startTime : Date.now();
    const responseTime = parseFloat(
      ((Date.now() - startTime) / 1000).toFixed(2)
    );

    return res.status(statusCode).json({
      status: statusCode,
      message,
      metadata: this.generateMetadata(
        apiId,
        responseTime,
        req?.method || "GET"
      ),
      data: null,
    });
  }

  static badRequest(
    res: Response,
    message: string = "Bad request",
    apiId: string = "",
    req?: Request
  ) {
    return this.error(res, message, 400, apiId, req);
  }

  static notFound(
    res: Response,
    message: string = "Resource not found",
    apiId: string = "",
    req?: Request
  ) {
    return this.error(res, message, 404, apiId, req);
  }

  static unauthorized(
    res: Response,
    message: string = "Unauthorized",
    apiId: string = "",
    req?: Request
  ) {
    return this.error(res, message, 401, apiId, req);
  }

  private static generateMetadata(
    apiId: string,
    responsetime: number,
    action: string
  ): ApiMetadata {
    return {
      apiId,
      version: this.API_VERSION,
      responsetime,
      action,
    };
  }
}
