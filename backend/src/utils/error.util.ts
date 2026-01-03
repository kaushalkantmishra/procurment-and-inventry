export class ErrorHandler {
  static getErrorMessage(error: unknown): string {
    if (error instanceof Error) {
      return error.message;
    }
    if (typeof error === 'string') {
      return error;
    }
    return 'An unexpected error occurred';
  }

  static handleError(res: any, error: unknown) {
    const message = this.getErrorMessage(error);
    return res.status(500).json({
      success: false,
      message,
      data: null
    });
  }
}