import { Router } from "express";
import { POLineController } from "../controllers/poLine.controller";

const router = Router();

router.get("/", POLineController.getAll);
router.get("/:id", POLineController.getById);
router.get("/po/:poId", POLineController.getByPOId);
router.post("/", POLineController.create);
router.put("/:id", POLineController.update);
router.delete("/:id", POLineController.delete);

export { router as poLineRoutes };