import { Request, Response } from "express";
import { ProcurementFlowService } from "../services/procurementFlow.service";
import { ApiResponse } from "../../../utils/response.util";

export class ProcurementFlowController {
  private service: ProcurementFlowService;

  constructor() {
    this.service = new ProcurementFlowService();
  }

  getFlowByPoId = async (req: Request, res: Response) => {
    try {
      const poId = parseInt(req.params.poId);

      if (!poId) {
        return ApiResponse.badRequest(
          res,
          "Invalid PO ID",
          "procurement-flow-get"
        );
      }

      const flow = await this.service.getFlowByPoId(poId);
      return ApiResponse.success(
        res,
        flow,
        "Procurement flow retrieved successfully",
        200,
        "procurement-flow-get"
      );
    } catch (error: any) {
      if (error.message.includes("not found")) {
        return ApiResponse.notFound(res, error.message, "procurement-flow-get");
      }
      return ApiResponse.error(res, error.message, 500, "procurement-flow-get");
    }
  };
}
