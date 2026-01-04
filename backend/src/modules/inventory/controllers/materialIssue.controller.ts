import { Request, Response } from "express";
import { MaterialIssueService } from "../services/materialIssue.service";
import { ApiResponse } from "../../../utils/response.util";
import { ErrorHandler } from "../../../utils/error.util";

export class MaterialIssueController {
  private materialIssueService: MaterialIssueService;

  constructor() {
    this.materialIssueService = new MaterialIssueService();
  }

  getAll = async (req: Request, res: Response) => {
    try {
      const issues = await this.materialIssueService.getAll();
      return ApiResponse.success(res, issues, "Material issues retrieved successfully");
    } catch (error) {
      return ApiResponse.error(res, ErrorHandler.getErrorMessage(error));
    }
  };

  getById = async (req: Request, res: Response) => {
    try {
      const issue = await this.materialIssueService.getById(parseInt(req.params.id));
      if (!issue) {
        return ApiResponse.notFound(res, "Material issue not found");
      }
      return ApiResponse.success(res, issue, "Material issue retrieved successfully");
    } catch (error) {
      return ApiResponse.error(res, ErrorHandler.getErrorMessage(error));
    }
  };

  create = async (req: Request, res: Response) => {
    try {
      const issue = await this.materialIssueService.create(req.body);
      return ApiResponse.created(res, issue, "Material issue created successfully");
    } catch (error) {
      return ApiResponse.badRequest(res, ErrorHandler.getErrorMessage(error));
    }
  };

  issueMaterials = async (req: Request, res: Response) => {
    try {
      const issueId = parseInt(req.params.issueId);
      const result = await this.materialIssueService.issueMaterials(issueId, req.body);
      return ApiResponse.success(res, result, "Materials issued successfully");
    } catch (error) {
      return ApiResponse.badRequest(res, ErrorHandler.getErrorMessage(error));
    }
  };

  delete = async (req: Request, res: Response) => {
    try {
      await this.materialIssueService.delete(parseInt(req.params.id));
      return ApiResponse.success(res, null, "Material issue deleted successfully");
    } catch (error) {
      return ApiResponse.badRequest(res, ErrorHandler.getErrorMessage(error));
    }
  };
}