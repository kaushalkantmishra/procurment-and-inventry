import { Router } from "express";
import { GRNDetailController } from "../controllers/grnDetail.controller";

const router = Router();

router.get("/", GRNDetailController.getAll);
router.get("/:id", GRNDetailController.getById);
router.get("/grn/:grnId", GRNDetailController.getByGRNId);
router.post("/", GRNDetailController.create);
router.put("/:id", GRNDetailController.update);
router.delete("/:id", GRNDetailController.delete);

export { router as grnDetailRoutes };