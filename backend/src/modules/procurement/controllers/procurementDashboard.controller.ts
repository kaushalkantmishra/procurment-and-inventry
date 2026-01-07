import { Request, Response } from "express";
import { ProcurementDashboardService } from "../services/procurementDashboard.service";
import { ApiResponse } from "../../../utils/response.util";
import { ErrorHandler } from "../../../utils/error.util";

export class ProcurementDashboardController {
  private service: ProcurementDashboardService;

  constructor() {
    this.service = new ProcurementDashboardService();
  }

  getDashboard = async (req: Request, res: Response) => {
    try {
      const dashboardData = await this.service.getDashboardData();
      return ApiResponse.success(
        res,
        dashboardData,
        "Dashboard data retrieved successfully",
        200,
        "procurement-dashboard-get",
        req
      );
    } catch (error) {
      return ApiResponse.error(
        res,
        ErrorHandler.getErrorMessage(error),
        500,
        "procurement-dashboard-get",
        req
      );
    }
  };
}
