import { Request, Response } from "express";
import { ThreeWayMatchingService } from "../services/threeWayMatching.service";
import { ApiResponse } from "../../../utils/response.util";
import { ErrorHandler } from "../../../utils/error.util";

export class ThreeWayMatchingController {
  private service: ThreeWayMatchingService;

  constructor() {
    this.service = new ThreeWayMatchingService();
  }

  getAll = async (req: Request, res: Response) => {
    try {
      const matches = await this.service.getAll();
      return ApiResponse.success(
        res,
        matches,
        "Three-way matching records retrieved successfully",
        200,
        "three-way-matching-get-all",
        req
      );
    } catch (error) {
      return ApiResponse.error(
        res,
        ErrorHandler.getErrorMessage(error),
        500,
        "three-way-matching-get-all",
        req
      );
    }
  };

  getById = async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const match = await this.service.getById(id);
      if (!match) {
        return ApiResponse.notFound(
          res,
          "Three-way matching record not found",
          "three-way-matching-get-by-id",
          req
        );
      }
      return ApiResponse.success(
        res,
        match,
        "Three-way matching record retrieved successfully",
        200,
        "three-way-matching-get-by-id",
        req
      );
    } catch (error) {
      return ApiResponse.error(
        res,
        ErrorHandler.getErrorMessage(error),
        500,
        "three-way-matching-get-by-id",
        req
      );
    }
  };

  create = async (req: Request, res: Response) => {
    try {
      const match = await this.service.create(req.body);
      return ApiResponse.created(
        res,
        match,
        "Three-way matching record created successfully",
        "three-way-matching-create",
        req
      );
    } catch (error) {
      return ApiResponse.badRequest(
        res,
        ErrorHandler.getErrorMessage(error),
        "three-way-matching-create",
        req
      );
    }
  };

  createAutomaticMatch = async (req: Request, res: Response) => {
    try {
      const { poLineId, grnDetailId, invoiceLineId } = req.body;
      const match = await this.service.createAutomaticMatch(
        poLineId,
        grnDetailId,
        invoiceLineId
      );
      return ApiResponse.created(
        res,
        match,
        "Automatic three-way match created successfully",
        "three-way-matching-auto-match",
        req
      );
    } catch (error) {
      return ApiResponse.badRequest(
        res,
        ErrorHandler.getErrorMessage(error),
        "three-way-matching-auto-match",
        req
      );
    }
  };

  update = async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const match = await this.service.update(id, req.body);
      return ApiResponse.success(
        res,
        match,
        "Three-way matching record updated successfully",
        200,
        "three-way-matching-update",
        req
      );
    } catch (error) {
      return ApiResponse.badRequest(
        res,
        ErrorHandler.getErrorMessage(error),
        "three-way-matching-update",
        req
      );
    }
  };

  delete = async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      await this.service.delete(id);
      return ApiResponse.success(
        res,
        null,
        "Three-way matching record deleted successfully",
        200,
        "three-way-matching-delete",
        req
      );
    } catch (error) {
      return ApiResponse.error(
        res,
        ErrorHandler.getErrorMessage(error),
        500,
        "three-way-matching-delete",
        req
      );
    }
  };
}
