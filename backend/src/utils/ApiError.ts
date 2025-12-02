class ApiError<T = any> {
  statusCode: number;
  message: string;
  success: boolean;

  constructor(statusCode: number, message = "Success") {
    this.success = statusCode < 400;
    this.statusCode = statusCode;
    this.message = message;
  }

  static success<T>(res: any, message = "Success", statusCode = 200) {
    return res.status(statusCode).json(new ApiError(statusCode, message));
  }

  static error(res: any, message: string, statusCode = 400) {
    return res.status(statusCode).json(new ApiError(statusCode, message));
  }
}

export { ApiError };
