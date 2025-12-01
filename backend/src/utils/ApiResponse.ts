class ApiResponse<T = any> {
  statusCode: number;
  data: T;
  message: string;
  success: boolean;

  constructor(statusCode: number, data: T, message = "Success") {
    this.success = statusCode < 400;
    this.statusCode = statusCode;
    this.message = message;
    this.data = data;
  }

  static success<T>(res: any, data: T, message = "Success", statusCode = 200) {
    return res
      .status(statusCode)
      .json(new ApiResponse(statusCode, data, message));
  }

  static error(res: any, message: string, statusCode = 400, data = null) {
    return res
      .status(statusCode)
      .json(new ApiResponse(statusCode, data, message));
  }
}

export { ApiResponse };
