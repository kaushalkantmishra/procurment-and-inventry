import { Router } from "express";
import { GRNHeaderController } from "../controllers/grnHeader.controller";

const router = Router();
const grnHeaderController = new GRNHeaderController();

router.get("/", grnHeaderController.getAll);
router.get("/:id", grnHeaderController.getById);
router.post("/", grnHeaderController.create);
router.put("/:id", grnHeaderController.update);
router.post("/:id/approve", grnHeaderController.approve);
router.post("/:id/reject", grnHeaderController.reject);
router.delete("/:id", grnHeaderController.delete);

export { router as grnHeaderRoutes };