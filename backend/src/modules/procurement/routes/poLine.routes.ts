import { Router } from "express";
import { POLineController } from "../controllers/poLine.controller";

const router = Router();
const poLineController = new POLineController();

router.get("/", poLineController.getAll);
router.get("/:id", poLineController.getById);
router.get("/po/:poId", poLineController.getByPOId);
router.post("/", poLineController.create);
router.put("/:id", poLineController.update);
router.delete("/:id", poLineController.delete);

export { router as poLineRoutes };