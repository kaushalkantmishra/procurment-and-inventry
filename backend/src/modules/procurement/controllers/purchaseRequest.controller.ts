import { Request, Response } from "express";
import { PurchaseRequestService } from "../services/purchaseRequest.service";
import { ApiResponse } from "../../../utils/response.util";
import { ErrorHandler } from "../../../utils/error.util";
import { cloudinary } from "../../../utils/cloudinary.util";
import multer from 'multer';

const upload = multer({ storage: multer.memoryStorage() });

export class PurchaseRequestController {
  private purchaseRequestService: PurchaseRequestService;
  public uploadMiddleware = upload.array('attachments', 10);

  constructor() {
    this.purchaseRequestService = new PurchaseRequestService();
  }

  getAll = async (req: Request, res: Response) => {
    try {
      // console.log(req.user, "user");
      const purchaseRequests = await this.purchaseRequestService.getAll();
      return ApiResponse.success(
        res,
        purchaseRequests,
        "Purchase requests retrieved successfully",
        200,
        "purchase-requests-get-all",
        req
      );
    } catch (error) {
      return ApiResponse.error(
        res,
        ErrorHandler.getErrorMessage(error),
        500,
        "purchase-requests-get-all",
        req
      );
    }
  };

  getById = async (req: Request, res: Response) => {
    try {
      const purchaseRequest = await this.purchaseRequestService.getById(
        parseInt(req.params.id)
      );
      if (!purchaseRequest) {
        return ApiResponse.notFound(
          res,
          "Purchase request not found",
          "purchase-requests-get-by-id",
          req
        );
      }
      return ApiResponse.success(
        res,
        purchaseRequest,
        "Purchase request retrieved successfully",
        200,
        "purchase-requests-get-by-id",
        req
      );
    } catch (error) {
      return ApiResponse.error(
        res,
        ErrorHandler.getErrorMessage(error),
        500,
        "purchase-requests-get-by-id",
        req
      );
    }
  };

  create = async (req: Request, res: Response) => {
    try {
      // Parse lines from JSON string if it's a string
      let lines = req.body.lines;
      if (typeof lines === 'string') {
        lines = JSON.parse(lines);
      }
      
      // Validate request payload
      if (!lines || !Array.isArray(lines) || lines.length === 0) {
        return ApiResponse.badRequest(
          res,
          "At least one PR line is required",
          "purchase-requests-create",
          req
        );
      }

      // Validate each line
      for (const line of lines) {
        if (!line.item_id || !line.quantity || line.quantity <= 0) {
          return ApiResponse.badRequest(
            res,
            "Each line must have item_id and quantity > 0",
            "purchase-requests-create",
            req
          );
        }
      }

      // Handle file uploads if present
      const attachments = [];
      if (req.files && Array.isArray(req.files)) {
        for (const file of req.files as Express.Multer.File[]) {
          try {
            const uploadResult = await new Promise((resolve, reject) => {
              const uploadStream = cloudinary.uploader.upload_stream(
                {
                  folder: 'pr-attachments',
                  resource_type: 'auto',
                  public_id: `${Date.now()}-${file.originalname.replace(/\.[^/.]+$/, "")}`
                },
                (error, result) => {
                  if (error) {
                    console.error('Cloudinary upload error:', error);
                    reject(error);
                  } else {
                    resolve(result);
                  }
                }
              );
              uploadStream.end(file.buffer);
            }) as any;

            attachments.push({
              file_name: uploadResult.public_id,
              original_name: file.originalname,
              file_path: uploadResult.secure_url,
              file_size: file.size,
              mime_type: file.mimetype
            });
          } catch (uploadError) {
            console.error('Failed to upload file:', file.originalname, uploadError);
            // Continue with other files instead of failing completely
          }
        }
      }

      const requestData = {
        ...req.body,
        lines,
        attachments
      };

      const purchaseRequest = await this.purchaseRequestService.create(
        requestData,
        req.user!.user_id
      );
      return ApiResponse.created(
        res,
        purchaseRequest,
        "Purchase request created successfully",
        "purchase-requests-create",
        req
      );
    } catch (error) {
      return ApiResponse.badRequest(
        res,
        ErrorHandler.getErrorMessage(error),
        "purchase-requests-create",
        req
      );
    }
  };

  update = async (req: Request, res: Response) => {
    try {
      const purchaseRequest = await this.purchaseRequestService.update(
        parseInt(req.params.id),
        req.body
      );
      return ApiResponse.success(
        res,
        purchaseRequest,
        "Purchase request updated successfully",
        200,
        "purchase-requests-update",
        req
      );
    } catch (error) {
      return ApiResponse.badRequest(
        res,
        ErrorHandler.getErrorMessage(error),
        "purchase-requests-update",
        req
      );
    }
  };

  delete = async (req: Request, res: Response) => {
    try {
      await this.purchaseRequestService.delete(parseInt(req.params.id));
      return ApiResponse.success(
        res,
        null,
        "Purchase request deleted successfully",
        200,
        "purchase-requests-delete",
        req
      );
    } catch (error) {
      return ApiResponse.badRequest(
        res,
        ErrorHandler.getErrorMessage(error),
        "purchase-requests-delete",
        req
      );
    }
  };
}
