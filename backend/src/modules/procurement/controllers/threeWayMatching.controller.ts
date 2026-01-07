import { Request, Response } from 'express';
import { ThreeWayMatchingService } from '../services/threeWayMatching.service';

export class ThreeWayMatchingController {
  static async getAll(req: Request, res: Response) {
    try {
      const service = new ThreeWayMatchingService();
      const matches = await service.getAll();
      res.json({ success: true, data: matches });
    } catch (error) {
      res.status(500).json({ success: false, error: 'Failed to fetch three-way matching records' });
    }
  }

  static async getById(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const service = new ThreeWayMatchingService();
      const match = await service.getById(id);
      if (!match) {
        return res.status(404).json({ success: false, error: 'Three-way matching record not found' });
      }
      res.json({ success: true, data: match });
    } catch (error) {
      res.status(500).json({ success: false, error: 'Failed to fetch three-way matching record' });
    }
  }

  static async create(req: Request, res: Response) {
    try {
      const service = new ThreeWayMatchingService();
      const match = await service.create(req.body);
      res.status(201).json({ success: true, data: match });
    } catch (error) {
      res.status(500).json({ success: false, error: 'Failed to create three-way matching record' });
    }
  }

  static async createAutomaticMatch(req: Request, res: Response) {
    try {
      const { poLineId, grnDetailId, invoiceLineId } = req.body;
      const service = new ThreeWayMatchingService();
      const match = await service.createAutomaticMatch(poLineId, grnDetailId, invoiceLineId);
      res.status(201).json({ success: true, data: match });
    } catch (error) {
      res.status(500).json({ success: false, error: 'Failed to create automatic three-way match' });
    }
  }

  static async update(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const service = new ThreeWayMatchingService();
      const match = await service.update(id, req.body);
      res.json({ success: true, data: match });
    } catch (error) {
      res.status(500).json({ success: false, error: 'Failed to update three-way matching record' });
    }
  }

  static async delete(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const service = new ThreeWayMatchingService();
      await service.delete(id);
      res.json({ success: true, message: 'Three-way matching record deleted successfully' });
    } catch (error) {
      res.status(500).json({ success: false, error: 'Failed to delete three-way matching record' });
    }
  }
}