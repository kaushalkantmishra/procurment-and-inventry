import { Router } from "express";
import { ApprovalWorkflowController } from "../controllers/approvalWorkflow.controller";

const router = Router();
const approvalWorkflowController = new ApprovalWorkflowController();

router.post("/submit", approvalWorkflowController.submitForApproval);
router.get("/pending", approvalWorkflowController.getPendingApprovals);
router.post("/:instanceId/action", approvalWorkflowController.processApproval);
router.get("/workflows", approvalWorkflowController.getWorkflows);
router.post("/workflows", approvalWorkflowController.createWorkflow);

export { router as approvalWorkflowRoutes };