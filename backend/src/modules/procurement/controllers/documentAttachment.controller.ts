import { Request, Response } from 'express';
import { DocumentAttachmentService } from '../services/documentAttachment.service';

export class DocumentAttachmentController {
  private service: DocumentAttachmentService;

  constructor() {
    this.service = new DocumentAttachmentService();
  }

  getByDocument = async (req: Request, res: Response) => {
    try {
      const { documentType, documentId } = req.query;
      
      if (!documentType || !documentId) {
        return res.status(400).json({ 
          error: 'documentType and documentId query parameters are required' 
        });
      }

      const attachments = await this.service.getByDocument(
        documentType as string, 
        parseInt(documentId as string)
      );
      
      res.json(attachments);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  };

  create = async (req: Request, res: Response) => {
    try {
      const attachment = await this.service.create(req.body);
      res.status(201).json(attachment);
    } catch (error: any) {
      if (error.message.includes('File size exceeds') || error.message.includes('File type not supported')) {
        return res.status(400).json({ error: error.message });
      }
      res.status(500).json({ error: error.message });
    }
  };

  delete = async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const attachment = await this.service.delete(id);
      res.json({ message: 'Attachment deleted successfully', attachment });
    } catch (error: any) {
      if (error.message.includes('not found')) {
        return res.status(404).json({ error: error.message });
      }
      res.status(500).json({ error: error.message });
    }
  };
}