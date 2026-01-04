import { Request, Response } from "express";
import { VendorService } from "../services/vendor.service";
import { ApiResponse } from "../../../utils/response.util";
import { ErrorHandler } from "../../../utils/error.util";

export class VendorController {
  private vendorService: VendorService;

  constructor() {
    this.vendorService = new VendorService();
  }

  getAll = async (req: Request, res: Response) => {
    try {
      const vendors = await this.vendorService.getAllVendors();
      return ApiResponse.success(
        res,
        vendors,
        "Vendors retrieved successfully"
      );
    } catch (error) {
      return ApiResponse.error(res, ErrorHandler.getErrorMessage(error));
    }
  };

  create = async (req: Request, res: Response) => {
    try {
      const vendor = await this.vendorService.createVendor(req.body);
      return ApiResponse.created(res, vendor, "Vendor created successfully");
    } catch (error) {
      return ApiResponse.badRequest(res, ErrorHandler.getErrorMessage(error));
    }
  };

  getById = async (req: Request, res: Response) => {
    try {
      const vendor = await this.vendorService.getVendorById(
        parseInt(req.params.id)
      );
      return ApiResponse.success(res, vendor, "Vendor retrieved successfully");
    } catch (error) {
      return ApiResponse.notFound(res, ErrorHandler.getErrorMessage(error));
    }
  };

  update = async (req: Request, res: Response) => {
    try {
      const vendor = await this.vendorService.updateVendor(
        parseInt(req.params.id),
        req.body
      );
      return ApiResponse.success(res, vendor, "Vendor updated successfully");
    } catch (error) {
      return ApiResponse.badRequest(res, ErrorHandler.getErrorMessage(error));
    }
  };

  delete = async (req: Request, res: Response) => {
    try {
      const vendor = await this.vendorService.deleteVendor(
        parseInt(req.params.id)
      );
      return ApiResponse.success(res, vendor, "Vendor deleted successfully");
    } catch (error) {
      return ApiResponse.badRequest(res, ErrorHandler.getErrorMessage(error));
    }
  };
}
