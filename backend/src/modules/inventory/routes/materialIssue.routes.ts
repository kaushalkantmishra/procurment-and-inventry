import { Router } from "express";
import { MaterialIssueController } from "../controllers/materialIssue.controller";

const router = Router();
const materialIssueController = new MaterialIssueController();

router.get("/", materialIssueController.getAll);
router.get("/:id", materialIssueController.getById);
router.post("/", materialIssueController.create);
router.post("/:issueId/issue", materialIssueController.issueMaterials);
router.delete("/:id", materialIssueController.delete);

export { router as materialIssueRoutes };