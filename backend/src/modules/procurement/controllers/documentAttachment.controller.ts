import { Request, Response } from "express";
import { DocumentAttachmentService } from "../services/documentAttachment.service";
import { ApiResponse } from "../../../utils/response.util";
import { ErrorHandler } from "../../../utils/error.util";

export class DocumentAttachmentController {
  private service: DocumentAttachmentService;

  constructor() {
    this.service = new DocumentAttachmentService();
  }

  getByDocument = async (req: Request, res: Response) => {
    try {
      const { documentType, documentId } = req.query;

      if (!documentType || !documentId) {
        return ApiResponse.badRequest(
          res,
          "documentType and documentId query parameters are required",
          "attachments-get",
          req
        );
      }

      const attachments = await this.service.getByDocument(
        documentType as string,
        parseInt(documentId as string)
      );

      return ApiResponse.success(
        res,
        attachments,
        "Attachments retrieved successfully",
        200,
        "attachments-get",
        req
      );
    } catch (error) {
      return ApiResponse.error(
        res,
        ErrorHandler.getErrorMessage(error),
        500,
        "attachments-get",
        req
      );
    }
  };

  create = async (req: Request, res: Response) => {
    try {
      const attachment = await this.service.create(req.body);
      return ApiResponse.created(
        res,
        attachment,
        "Attachment created successfully",
        "attachments-create",
        req
      );
    } catch (error) {
      return ApiResponse.badRequest(
        res,
        ErrorHandler.getErrorMessage(error),
        "attachments-create",
        req
      );
    }
  };

  delete = async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const attachment = await this.service.delete(id);
      return ApiResponse.success(
        res,
        attachment,
        "Attachment deleted successfully",
        200,
        "attachments-delete",
        req
      );
    } catch (error) {
      if (ErrorHandler.getErrorMessage(error).includes("not found")) {
        return ApiResponse.notFound(
          res,
          ErrorHandler.getErrorMessage(error),
          "attachments-delete",
          req
        );
      }
      return ApiResponse.error(
        res,
        ErrorHandler.getErrorMessage(error),
        500,
        "attachments-delete",
        req
      );
    }
  };
}
