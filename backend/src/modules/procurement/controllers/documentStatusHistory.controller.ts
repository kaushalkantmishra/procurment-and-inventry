import { Request, Response } from 'express';
import { DocumentStatusHistoryService } from '../services/documentStatusHistory.service';

export class DocumentStatusHistoryController {
  private service: DocumentStatusHistoryService;

  constructor() {
    this.service = new DocumentStatusHistoryService();
  }

  getByDocument = async (req: Request, res: Response) => {
    try {
      const { documentType, documentId } = req.query;
      
      if (!documentType || !documentId) {
        return res.status(400).json({ 
          error: 'documentType and documentId query parameters are required' 
        });
      }

      const history = await this.service.getByDocument(
        documentType as string, 
        parseInt(documentId as string)
      );
      
      res.json(history);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  };
}