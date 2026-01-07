import { Request, Response } from 'express';
import { ProcurementDashboardService } from '../services/procurementDashboard.service';

export class ProcurementDashboardController {
  static async getDashboard(req: Request, res: Response) {
    try {
      const service = new ProcurementDashboardService();
      const dashboardData = await service.getDashboardData();
      res.json({ success: true, data: dashboardData });
    } catch (error) {
      res.status(500).json({ success: false, error: 'Failed to fetch dashboard data' });
    }
  }
}