import { Request, Response } from 'express';
import { PurchaseRequestLineService } from '../services/purchaseRequestLine.service';

export class PurchaseRequestLineController {
  private service: PurchaseRequestLineService;

  constructor() {
    this.service = new PurchaseRequestLineService();
  }

  getByPrId = async (req: Request, res: Response) => {
    try {
      const prId = parseInt(req.query.prId as string);
      
      if (!prId) {
        return res.status(400).json({ error: 'prId query parameter is required' });
      }

      const lines = await this.service.getByPrId(prId);
      res.json(lines);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  };

  create = async (req: Request, res: Response) => {
    try {
      const line = await this.service.create(req.body);
      res.status(201).json(line);
    } catch (error: any) {
      if (error.message.includes('not found') || error.message.includes('Cannot modify')) {
        return res.status(400).json({ error: error.message });
      }
      res.status(500).json({ error: error.message });
    }
  };

  update = async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const line = await this.service.update(id, req.body);
      res.json(line);
    } catch (error: any) {
      if (error.message.includes('not found') || error.message.includes('Cannot modify')) {
        return res.status(400).json({ error: error.message });
      }
      res.status(500).json({ error: error.message });
    }
  };

  delete = async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const line = await this.service.delete(id);
      res.json({ message: 'Purchase Request Line deleted successfully', line });
    } catch (error: any) {
      if (error.message.includes('not found') || error.message.includes('Cannot modify')) {
        return res.status(400).json({ error: error.message });
      }
      res.status(500).json({ error: error.message });
    }
  };
}