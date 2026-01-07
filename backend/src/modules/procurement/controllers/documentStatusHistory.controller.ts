import { Request, Response } from "express";
import { DocumentStatusHistoryService } from "../services/documentStatusHistory.service";
import { ApiResponse } from "../../../utils/response.util";
import { ErrorHandler } from "../../../utils/error.util";

export class DocumentStatusHistoryController {
  private service: DocumentStatusHistoryService;

  constructor() {
    this.service = new DocumentStatusHistoryService();
  }

  getByDocument = async (req: Request, res: Response) => {
    try {
      const { documentType, documentId } = req.query;

      if (!documentType || !documentId) {
        return ApiResponse.badRequest(
          res,
          "documentType and documentId query parameters are required",
          "doc-status-history-get",
          req
        );
      }

      const history = await this.service.getByDocument(
        documentType as string,
        parseInt(documentId as string)
      );

      return ApiResponse.success(
        res,
        history,
        "Document status history retrieved successfully",
        200,
        "doc-status-history-get",
        req
      );
    } catch (error) {
      return ApiResponse.error(
        res,
        ErrorHandler.getErrorMessage(error),
        500,
        "doc-status-history-get",
        req
      );
    }
  };
}
