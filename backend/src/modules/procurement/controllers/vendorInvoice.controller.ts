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
      return ApiResponse.success(res, invoices, "Vendor invoices retrieved successfully");
    } catch (error) {
      return ApiResponse.error(res, ErrorHandler.getErrorMessage(error));
    }
  };

  getById = async (req: Request, res: Response) => {
    try {
      const invoice = await this.vendorInvoiceService.getById(parseInt(req.params.id));
      if (!invoice) {
        return ApiResponse.notFound(res, "Vendor invoice not found");
      }
      return ApiResponse.success(res, invoice, "Vendor invoice retrieved successfully");
    } catch (error) {
      return ApiResponse.error(res, ErrorHandler.getErrorMessage(error));
    }
  };

  create = async (req: Request, res: Response) => {
    try {
      const invoice = await this.vendorInvoiceService.create(req.body);
      return ApiResponse.created(res, invoice, "Vendor invoice created successfully");
    } catch (error) {
      return ApiResponse.badRequest(res, ErrorHandler.getErrorMessage(error));
    }
  };

  performThreeWayMatch = async (req: Request, res: Response) => {
    try {
      const invoiceId = parseInt(req.params.invoiceId);
      const matchResults = await this.vendorInvoiceService.performThreeWayMatch(invoiceId);
      return ApiResponse.success(res, matchResults, "Three-way matching completed");
    } catch (error) {
      return ApiResponse.badRequest(res, ErrorHandler.getErrorMessage(error));
    }
  };

  update = async (req: Request, res: Response) => {
    try {
      const invoice = await this.vendorInvoiceService.update(parseInt(req.params.id), req.body);
      return ApiResponse.success(res, invoice, "Vendor invoice updated successfully");
    } catch (error) {
      return ApiResponse.badRequest(res, ErrorHandler.getErrorMessage(error));
    }
  };

  delete = async (req: Request, res: Response) => {
    try {
      await this.vendorInvoiceService.delete(parseInt(req.params.id));
      return ApiResponse.success(res, null, "Vendor invoice deleted successfully");
    } catch (error) {
      return ApiResponse.badRequest(res, ErrorHandler.getErrorMessage(error));
    }
  };

  validatePayment = async (req: Request, res: Response) => {
    try {
      const invoiceId = parseInt(req.params.invoiceId);
      const validation = await this.vendorInvoiceService.validatePayment(invoiceId);
      return ApiResponse.success(res, validation, "Payment validation completed");
    } catch (error) {
      return ApiResponse.badRequest(res, ErrorHandler.getErrorMessage(error));
    }
  };

  markAsPaid = async (req: Request, res: Response) => {
    try {
      const invoiceId = parseInt(req.params.invoiceId);
      const { paymentReference } = req.body;
      const result = await this.vendorInvoiceService.markAsPaid(invoiceId, paymentReference);
      return ApiResponse.success(res, result, "Invoice marked as paid successfully");
    } catch (error) {
      return ApiResponse.badRequest(res, ErrorHandler.getErrorMessage(error));
    }
  };
}