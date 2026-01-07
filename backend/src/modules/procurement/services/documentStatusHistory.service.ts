import { db } from '../../../db';
import { tblDocumentStatusHistory } from '../../../db/procurement.schema';
import { eq, and } from 'drizzle-orm';
import { CreateDocumentStatusHistoryRequest } from '../types';

export class DocumentStatusHistoryService {
  async getByDocument(documentType: string, documentId: number) {
    return await db
      .select()
      .from(tblDocumentStatusHistory)
      .where(
        and(
          eq(tblDocumentStatusHistory.document_type, documentType),
          eq(tblDocumentStatusHistory.document_id, documentId)
        )
      )
      .orderBy(tblDocumentStatusHistory.changed_at);
  }

  async create(request: CreateDocumentStatusHistoryRequest) {
    const {
      document_type,
      document_id,
      old_status,
      new_status,
      changed_by,
      remarks
    } = request;
    
    const [history] = await db
      .insert(tblDocumentStatusHistory)
      .values({
        document_type,
        document_id,
        old_status,
        new_status,
        changed_by,
        remarks,
        changed_at: new Date(),
      })
      .returning();
    
    return history;
  }

  // Helper method to log status changes automatically
  async logStatusChange(
    documentType: string,
    documentId: number,
    oldStatus: string | null,
    newStatus: string,
    changedBy: string,
    remarks?: string
  ) {
    return await this.create({
      document_type: documentType,
      document_id: documentId,
      old_status: oldStatus || undefined,
      new_status: newStatus,
      changed_by: changedBy,
      remarks,
    });
  }
}