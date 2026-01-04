import { Request, Response } from "express";
import { ApprovalWorkflowService } from "../services/approvalWorkflow.service";
import { ApiResponse } from "../../../utils/response.util";
import { ErrorHandler } from "../../../utils/error.util";

export class ApprovalWorkflowController {
  private approvalWorkflowService: ApprovalWorkflowService;

  constructor() {
    this.approvalWorkflowService = new ApprovalWorkflowService();
  }

  submitForApproval = async (req: Request, res: Response) => {
    try {
      const instance = await this.approvalWorkflowService.submitForApproval(req.body);
      return ApiResponse.created(res, instance, "Submitted for approval successfully");
    } catch (error) {
      return ApiResponse.badRequest(res, ErrorHandler.getErrorMessage(error));
    }
  };

  getPendingApprovals = async (req: Request, res: Response) => {
    try {
      const { userId } = req.query;
      const approvals = await this.approvalWorkflowService.getPendingApprovals(userId as string);
      return ApiResponse.success(res, approvals, "Pending approvals retrieved successfully");
    } catch (error) {
      return ApiResponse.error(res, ErrorHandler.getErrorMessage(error));
    }
  };

  processApproval = async (req: Request, res: Response) => {
    try {
      const instanceId = parseInt(req.params.instanceId);
      const result = await this.approvalWorkflowService.processApproval(instanceId, req.body);
      return ApiResponse.success(res, result, "Approval processed successfully");
    } catch (error) {
      return ApiResponse.badRequest(res, ErrorHandler.getErrorMessage(error));
    }
  };

  getWorkflows = async (req: Request, res: Response) => {
    try {
      const workflows = await this.approvalWorkflowService.getWorkflows();
      return ApiResponse.success(res, workflows, "Workflows retrieved successfully");
    } catch (error) {
      return ApiResponse.error(res, ErrorHandler.getErrorMessage(error));
    }
  };

  createWorkflow = async (req: Request, res: Response) => {
    try {
      const workflow = await this.approvalWorkflowService.createWorkflow(req.body);
      return ApiResponse.created(res, workflow, "Workflow created successfully");
    } catch (error) {
      return ApiResponse.badRequest(res, ErrorHandler.getErrorMessage(error));
    }
  };
}