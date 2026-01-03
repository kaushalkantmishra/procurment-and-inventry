import { Router } from "express";
import { GRNHeaderController } from "../controllers/grnHeader.controller";

const router = Router();

router.get("/", GRNHeaderController.getAll);
router.get("/:id", GRNHeaderController.getById);
router.post("/", GRNHeaderController.create);
router.put("/:id", GRNHeaderController.update);
router.delete("/:id", GRNHeaderController.delete);

export { router as grnHeaderRoutes };