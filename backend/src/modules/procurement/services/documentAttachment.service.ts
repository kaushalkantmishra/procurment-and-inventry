import { db } from '../../../db';
import { tblDocumentAttachments } from '../../../db/masters.schema';
import { eq, and } from 'drizzle-orm';

export class DocumentAttachmentService {
  async getByDocument(documentType: string, documentId: number) {
    return await db
      .select()
      .from(tblDocumentAttachments)
      .where(
        and(
          eq(tblDocumentAttachments.document_type, documentType),
          eq(tblDocumentAttachments.document_id, documentId),
          eq(tblDocumentAttachments.is_deleted, false)
        )
      );
  }

  async create(data: {
    document_type: string;
    document_id: number;
    file_name: string;
    original_name: string;
    file_path: string;
    file_size: number;
    mime_type: string;
    uploaded_by: string;
  }) {
    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB in bytes
    if (data.file_size > maxSize) {
      throw new Error('File size exceeds maximum limit of 10MB');
    }

    // Validate file type (PDF, images)
    const allowedTypes = [
      'application/pdf',
      'image/jpeg',
      'image/jpg', 
      'image/png',
      'image/gif',
      'image/bmp',
      'image/webp'
    ];
    
    if (!allowedTypes.includes(data.mime_type.toLowerCase())) {
      throw new Error('File type not supported. Only PDF and image files are allowed');
    }

    const [attachment] = await db
      .insert(tblDocumentAttachments)
      .values(data)
      .returning();
    
    return attachment;
  }

  async delete(id: number) {
    // Soft delete only
    const [attachment] = await db
      .update(tblDocumentAttachments)
      .set({ is_deleted: true, deleted_at: new Date() })
      .where(eq(tblDocumentAttachments.id, id))
      .returning();
    
    if (!attachment) {
      throw new Error('Attachment not found');
    }
    
    return attachment;
  }

  async getById(id: number) {
    const [attachment] = await db
      .select()
      .from(tblDocumentAttachments)
      .where(
        and(
          eq(tblDocumentAttachments.id, id),
          eq(tblDocumentAttachments.is_deleted, false)
        )
      );
    
    return attachment;
  }
}