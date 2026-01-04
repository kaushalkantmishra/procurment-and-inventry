import { Request, Response } from "express";
import { ReceiptService } from "../services/receipt.service";
import { ApiResponse } from "../../../utils/response.util";
import { ErrorHandler } from "../../../utils/error.util";

export class ReceiptController {
  private receiptService: ReceiptService;

  constructor() {
    this.receiptService = new ReceiptService();
  }

  getAll = async (req: Request, res: Response) => {
    try {
      const receipts = await this.receiptService.getAll();
      return ApiResponse.success(
        res,
        receipts,
        "Receipts retrieved successfully"
      );
    } catch (error) {
      return ApiResponse.error(res, ErrorHandler.getErrorMessage(error));
    }
  };

  getById = async (req: Request, res: Response) => {
    try {
      const receipt = await this.receiptService.getById(parseInt(req.params.id));
      return ApiResponse.success(
        res,
        receipt,
        "Receipt retrieved successfully"
      );
    } catch (error) {
      return ApiResponse.notFound(res, ErrorHandler.getErrorMessage(error));
    }
  };

  create = async (req: Request, res: Response) => {
    try {
      const receipt = await this.receiptService.create(req.body);
      return ApiResponse.created(res, receipt, "Receipt created successfully");
    } catch (error) {
      return ApiResponse.badRequest(res, ErrorHandler.getErrorMessage(error));
    }
  };

  update = async (req: Request, res: Response) => {
    try {
      const receipt = await this.receiptService.update(
        parseInt(req.params.id),
        req.body
      );
      return ApiResponse.success(res, receipt, "Receipt updated successfully");
    } catch (error) {
      return ApiResponse.badRequest(res, ErrorHandler.getErrorMessage(error));
    }
  };

  delete = async (req: Request, res: Response) => {
    try {
      await this.receiptService.delete(parseInt(req.params.id));
      return ApiResponse.success(res, null, "Receipt deleted successfully");
    } catch (error) {
      return ApiResponse.badRequest(res, ErrorHandler.getErrorMessage(error));
    }
  };
}
