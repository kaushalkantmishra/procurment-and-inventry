import { Request, Response } from "express";
import { VendorInvoiceService } from "../services/vendorInvoice.service";
import { ApiResponse } from "../../../utils/response.util";
import { ErrorHandler } from "../../../utils/error.util";

export class VendorInvoiceController {
  private vendorInvoiceService: VendorInvoiceService;

  constructor() {
    this.vendorInvoiceService = new VendorInvoiceService();
  }

  getAll = async (req: Request, res: Response) => {
    try {
      const invoices = await this.vendorInvoiceService.getAll();
      return ApiResponse.success(
        res,
        invoices,
        "Vendor invoices retrieved successfully",
        200,
        "vendor-invoices-get-all",
        req
      );
    } catch (error) {
      return ApiResponse.error(
        res,
        ErrorHandler.getErrorMessage(error),
        500,
        "vendor-invoices-get-all",
        req
      );
    }
  };

  getById = async (req: Request, res: Response) => {
    try {
      const invoice = await this.vendorInvoiceService.getById(
        parseInt(req.params.id)
      );
      if (!invoice) {
        return ApiResponse.notFound(
          res,
          "Vendor invoice not found",
          "vendor-invoices-get-by-id",
          req
        );
      }
      return ApiResponse.success(
        res,
        invoice,
        "Vendor invoice retrieved successfully",
        200,
        "vendor-invoices-get-by-id",
        req
      );
    } catch (error) {
      return ApiResponse.error(
        res,
        ErrorHandler.getErrorMessage(error),
        500,
        "vendor-invoices-get-by-id",
        req
      );
    }
  };

  create = async (req: Request, res: Response) => {
    try {
      const invoice = await this.vendorInvoiceService.create(req.body);
      return ApiResponse.created(
        res,
        invoice,
        "Vendor invoice created successfully",
        "vendor-invoices-create",
        req
      );
    } catch (error) {
      return ApiResponse.badRequest(
        res,
        ErrorHandler.getErrorMessage(error),
        "vendor-invoices-create",
        req
      );
    }
  };

  performThreeWayMatch = async (req: Request, res: Response) => {
    try {
      const invoiceId = parseInt(req.params.invoiceId);
      const matchResults = await this.vendorInvoiceService.performThreeWayMatch(
        invoiceId
      );
      return ApiResponse.success(
        res,
        matchResults,
        "Three-way matching completed",
        200,
        "vendor-invoices-three-way-match",
        req
      );
    } catch (error) {
      return ApiResponse.badRequest(
        res,
        ErrorHandler.getErrorMessage(error),
        "vendor-invoices-three-way-match",
        req
      );
    }
  };

  update = async (req: Request, res: Response) => {
    try {
      const invoice = await this.vendorInvoiceService.update(
        parseInt(req.params.id),
        req.body
      );
      return ApiResponse.success(
        res,
        invoice,
        "Vendor invoice updated successfully",
        200,
        "vendor-invoices-update",
        req
      );
    } catch (error) {
      return ApiResponse.badRequest(
        res,
        ErrorHandler.getErrorMessage(error),
        "vendor-invoices-update",
        req
      );
    }
  };

  delete = async (req: Request, res: Response) => {
    try {
      await this.vendorInvoiceService.delete(parseInt(req.params.id));
      return ApiResponse.success(
        res,
        null,
        "Vendor invoice deleted successfully",
        200,
        "vendor-invoices-delete",
        req
      );
    } catch (error) {
      return ApiResponse.badRequest(
        res,
        ErrorHandler.getErrorMessage(error),
        "vendor-invoices-delete",
        req
      );
    }
  };

  validatePayment = async (req: Request, res: Response) => {
    try {
      const invoiceId = parseInt(req.params.invoiceId);
      const validation = await this.vendorInvoiceService.validatePayment(
        invoiceId
      );
      return ApiResponse.success(
        res,
        validation,
        "Payment validation completed",
        200,
        "vendor-invoices-validate-payment",
        req
      );
    } catch (error) {
      return ApiResponse.badRequest(
        res,
        ErrorHandler.getErrorMessage(error),
        "vendor-invoices-validate-payment",
        req
      );
    }
  };

  markAsPaid = async (req: Request, res: Response) => {
    try {
      const invoiceId = parseInt(req.params.invoiceId);
      const { paymentReference } = req.body;
      const result = await this.vendorInvoiceService.markAsPaid(
        invoiceId,
        paymentReference
      );
      return ApiResponse.success(
        res,
        result,
        "Invoice marked as paid successfully",
        200,
        "vendor-invoices-mark-paid",
        req
      );
    } catch (error) {
      return ApiResponse.badRequest(
        res,
        ErrorHandler.getErrorMessage(error),
        "vendor-invoices-mark-paid",
        req
      );
    }
  };
}
