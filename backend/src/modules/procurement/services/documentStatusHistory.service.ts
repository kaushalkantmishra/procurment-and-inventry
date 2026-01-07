import { db } from '../../../db';
import { tblDocumentStatusHistory } from '../../../db/procurement.schema';
import { eq, and } from 'drizzle-orm';

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

  async create(data: {
    document_type: string;
    document_id: number;
    old_status?: string;
    new_status: string;
    changed_by: string;
    remarks?: string;
  }) {
    const [history] = await db
      .insert(tblDocumentStatusHistory)
      .values({
        ...data,
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