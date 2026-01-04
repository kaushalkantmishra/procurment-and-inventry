import { Router } from "express";
import { VendorInvoiceController } from "../controllers/vendorInvoice.controller";

const router = Router();
const vendorInvoiceController = new VendorInvoiceController();

router.get("/", vendorInvoiceController.getAll);
router.get("/:id", vendorInvoiceController.getById);
router.post("/", vendorInvoiceController.create);
router.post("/:invoiceId/match", vendorInvoiceController.performThreeWayMatch);
router.post("/:invoiceId/validate-payment", vendorInvoiceController.validatePayment);
router.post("/:invoiceId/mark-paid", vendorInvoiceController.markAsPaid);
router.put("/:id", vendorInvoiceController.update);
router.delete("/:id", vendorInvoiceController.delete);

export { router as vendorInvoiceRoutes };