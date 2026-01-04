import { db } from "../../../db";
import { tblDocumentAttachments, tblAuditLogs } from "../../../db/masters.schema";
import { eq, and } from "drizzle-orm";
import { cloudinary } from "../../../utils/cloudinary.util";
import * as fs from 'fs';


export class DocumentAttachmentService {
  async uploadAttachment(file: Express.Multer.File, data: {
    documentType: string;
    documentId: number;
    uploadedBy: string;
  }) {
    try {
      const result = await cloudinary.uploader.upload(file.path, {
        folder: `erp/${data.documentType.toLowerCase()}`,
        resource_type: "auto",
        public_id: `${data.documentType}_${data.documentId}_${Date.now()}`,
      });

      if (fs.existsSync(file.path)) {
        fs.unlinkSync(file.path);
      }

      const [attachment] = await db.insert(tblDocumentAttachments).values({
        document_type: data.documentType,
        document_id: data.documentId,
        file_name: result.public_id,
        original_name: file.originalname,
        file_path: result.secure_url,
        file_size: file.size,
        mime_type: file.mimetype,
        uploaded_by: data.uploadedBy,
      }).returning();

      return attachment;
    } catch (error) {
      if (file?.path && fs.existsSync(file.path)) {
        fs.unlinkSync(file.path);
      }
      throw error;
    }
  }

  async getAttachments(documentType: string, documentId: number) {
    return await db.select().from(tblDocumentAttachments)
      .where(and(
        eq(tblDocumentAttachments.document_type, documentType),
        eq(tblDocumentAttachments.document_id, documentId),
        eq(tblDocumentAttachments.is_deleted, false)
      ));
  }

  async deleteAttachment(id: number) {
    const attachment = await this.getAttachmentById(id);
    if (attachment) {
      try {
        await cloudinary.uploader.destroy(attachment.file_name);
      } catch (error) {
        console.error('Failed to delete from Cloudinary:', error);
      }
    }

    const [deleted] = await db.update(tblDocumentAttachments)
      .set({ is_deleted: true, deleted_at: new Date() })
      .where(eq(tblDocumentAttachments.id, id))
      .returning();
    return deleted;
  }

  async getAttachmentById(id: number) {
    const [attachment] = await db.select().from(tblDocumentAttachments)
      .where(and(
        eq(tblDocumentAttachments.id, id),
        eq(tblDocumentAttachments.is_deleted, false)
      ));
    return attachment;
  }
}

export class AuditLogService {
  async logAction(data: {
    userId?: string;
    action: string;
    tableName: string;
    recordId: number;
    oldValues?: any;
    newValues?: any;
    ipAddress?: string;
    userAgent?: string;
  }) {
    const [log] = await db.insert(tblAuditLogs).values({
      user_id: data.userId,
      action: data.action,
      table_name: data.tableName,
      record_id: data.recordId,
      old_values: data.oldValues ? JSON.stringify(data.oldValues) : null,
      new_values: data.newValues ? JSON.stringify(data.newValues) : null,
      ip_address: data.ipAddress,
      user_agent: data.userAgent,
    }).returning();
    return log;
  }

  async getAuditLogs(tableName?: string, recordId?: number) {
    if (tableName && recordId) {
      return await db.select().from(tblAuditLogs)
        .where(and(
          eq(tblAuditLogs.table_name, tableName),
          eq(tblAuditLogs.record_id, recordId)
        ));
    } else if (tableName) {
      return await db.select().from(tblAuditLogs)
        .where(eq(tblAuditLogs.table_name, tableName));
    }

    return await db.select().from(tblAuditLogs);
  }
}