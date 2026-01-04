import { Router } from "express";
import { GRNDetailController } from "../controllers/grnDetail.controller";

const router = Router();
const grnDetailController = new GRNDetailController();

router.get("/", grnDetailController.getAll);
router.get("/:id", grnDetailController.getById);
router.get("/grn/:grnId", grnDetailController.getByGRNId);
router.post("/", grnDetailController.create);
router.put("/:id", grnDetailController.update);
router.delete("/:id", grnDetailController.delete);

export { router as grnDetailRoutes };