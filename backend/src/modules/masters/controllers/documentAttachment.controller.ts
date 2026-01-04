import { Request, Response } from "express";
import { DocumentAttachmentService } from "../services/documentAttachment.service";
import { ApiResponse } from "../../../utils/response.util";
import { ErrorHandler } from "../../../utils/error.util";

export class DocumentAttachmentController {
  private documentAttachmentService: DocumentAttachmentService;

  constructor() {
    this.documentAttachmentService = new DocumentAttachmentService();
  }

  uploadAttachment = async (req: Request, res: Response) => {
    try {
      const file = req.file;
      if (!file) {
        return ApiResponse.badRequest(res, "No file uploaded");
      }

      const attachment = await this.documentAttachmentService.uploadAttachment(file, {
        documentType: req.body.documentType,
        documentId: parseInt(req.body.documentId),
        uploadedBy: req.body.uploadedBy,
      });

      return ApiResponse.created(res, attachment, "File uploaded successfully");
    } catch (error) {
      return ApiResponse.badRequest(res, ErrorHandler.getErrorMessage(error));
    }
  };

  getAttachments = async (req: Request, res: Response) => {
    try {
      const { documentType, documentId } = req.query;
      const attachments = await this.documentAttachmentService.getAttachments(
        documentType as string,
        parseInt(documentId as string)
      );
      return ApiResponse.success(res, attachments, "Attachments retrieved successfully");
    } catch (error) {
      return ApiResponse.error(res, ErrorHandler.getErrorMessage(error));
    }
  };

  deleteAttachment = async (req: Request, res: Response) => {
    try {
      const attachmentId = parseInt(req.params.id);
      await this.documentAttachmentService.deleteAttachment(attachmentId);
      return ApiResponse.success(res, null, "Attachment deleted successfully");
    } catch (error) {
      return ApiResponse.badRequest(res, ErrorHandler.getErrorMessage(error));
    }
  };
}