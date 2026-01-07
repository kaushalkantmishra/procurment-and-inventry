import { Request, Response } from 'express';
import { ProcurementFlowService } from '../services/procurementFlow.service';

export class ProcurementFlowController {
  private service: ProcurementFlowService;

  constructor() {
    this.service = new ProcurementFlowService();
  }

  getFlowByPoId = async (req: Request, res: Response) => {
    try {
      const poId = parseInt(req.params.poId);
      
      if (!poId) {
        return res.status(400).json({ error: 'Invalid PO ID' });
      }

      const flow = await this.service.getFlowByPoId(poId);
      res.json(flow);
    } catch (error: any) {
      if (error.message.includes('not found')) {
        return res.status(404).json({ error: error.message });
      }
      res.status(500).json({ error: error.message });
    }
  };
}