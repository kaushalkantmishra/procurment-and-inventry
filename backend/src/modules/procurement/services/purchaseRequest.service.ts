import { db } from "../../../db/index";
import { tblPurchaseRequests, tblPurchaseRequestLines } from '../../../db/procurement.schema';
import { tblDocumentAttachments } from '../../../db/masters.schema';
import { tblItems } from '../../../db/inventory.schema';
import { eq, and } from "drizzle-orm";
import { CreatePurchaseRequestRequest, UpdatePurchaseRequestRequest } from '../types';

export class PurchaseRequestService {
  async getAll() {
    return await db
      .select()
      .from(tblPurchaseRequests)
      .where(eq(tblPurchaseRequests.is_deleted, false));
  }

  async getById(id: number) {
    const [pr] = await db
      .select()
      .from(tblPurchaseRequests)
      .where(
        and(
          eq(tblPurchaseRequests.id, id),
          eq(tblPurchaseRequests.is_deleted, false)
        )
      );
    
    if (!pr) return null;

    // Get PR lines with item details
    const lines = await db
      .select({
        id: tblPurchaseRequestLines.id,
        pr_id: tblPurchaseRequestLines.pr_id,
        item_id: tblPurchaseRequestLines.item_id,
        quantity: tblPurchaseRequestLines.quantity,
        estimated_unit_price: tblPurchaseRequestLines.estimated_unit_price,
        line_total: tblPurchaseRequestLines.line_total,
        item_name: tblItems.item_name,
        sku: tblItems.sku
      })
      .from(tblPurchaseRequestLines)
      .leftJoin(tblItems, eq(tblPurchaseRequestLines.item_id, tblItems.id))
      .where(
        and(
          eq(tblPurchaseRequestLines.pr_id, id),
          eq(tblPurchaseRequestLines.is_deleted, false)
        )
      );

    // Get attachments
    const attachments = await db
      .select()
      .from(tblDocumentAttachments)
      .where(
        and(
          eq(tblDocumentAttachments.document_type, 'PR'),
          eq(tblDocumentAttachments.document_id, id),
          eq(tblDocumentAttachments.is_deleted, false)
        )
      );

    return {
      ...pr,
      lines,
      attachments
    };
  }

  async create(request: CreatePurchaseRequestRequest, userId: string) {
    const {
      requesting_department,
      required_date,
      justification,
      maintenance_work_order,
      lines,
      attachments
    } = request;

    // Validation
    if (!lines || lines.length === 0) {
      throw new Error('At least one PR line is required');
    }

    for (const line of lines) {
      if (!line.quantity || line.quantity <= 0) {
        throw new Error('Quantity must be greater than 0');
      }
    }

    return await db.transaction(async (tx) => {
      try {
        // Insert PR header
        const [pr] = await tx.insert(tblPurchaseRequests).values({
          requesting_department,
          requested_by_user_id: userId,
          required_date: required_date || null,
          justification,
          maintenance_work_order: maintenance_work_order || null,
          status: 'Saved'
        }).returning();

        // Insert PR lines
        const prLines = [];
        for (const line of lines) {
          const lineTotal = line.estimated_unit_price 
            ? (line.quantity * parseFloat(line.estimated_unit_price))
            : null;

          const [prLine] = await tx.insert(tblPurchaseRequestLines).values({
            pr_id: pr.id,
            item_id: line.item_id,
            quantity: line.quantity,
            estimated_unit_price: line.estimated_unit_price || null,
            line_total: lineTotal ? lineTotal.toString() : null
          }).returning();
          
          prLines.push(prLine);
        }

        // Insert attachments if provided
        const prAttachments = [];
        if (attachments && attachments.length > 0) {
          for (const attachment of attachments) {
            const [prAttachment] = await tx.insert(tblDocumentAttachments).values({
              document_type: 'PR',
              document_id: pr.id,
              file_name: attachment.file_name,
              original_name: attachment.original_name,
              file_path: attachment.file_path,
              file_size: attachment.file_size,
              mime_type: attachment.mime_type,
              uploaded_by: userId
            }).returning();
            
            prAttachments.push(prAttachment);
          }
        }

        return {
          pr,
          lines: prLines,
          attachments: prAttachments
        };
      } catch (error: any) {
        console.error('Database error:', error);
        if (error.code === '23503') {
          throw new Error('Invalid user ID or item ID reference');
        }
        throw error;
      }
    });
  }

  async update(id: number, request: UpdatePurchaseRequestRequest) {
    const {
      requesting_department,
      required_date,
      justification,
      maintenance_work_order,
      status
    } = request;
    
    const [pr] = await db
      .update(tblPurchaseRequests)
      .set({ 
        requesting_department,
        required_date: required_date || null,
        justification,
        maintenance_work_order: maintenance_work_order || null,
        status,
        updated_at: new Date() 
      })
      .where(eq(tblPurchaseRequests.id, id))
      .returning();
    if (!pr) throw new Error("Purchase request not found");
    return pr;
  }

  async delete(id: number) {
    const [pr] = await db
      .update(tblPurchaseRequests)
      .set({ is_deleted: true, deleted_at: new Date() })
      .where(eq(tblPurchaseRequests.id, id))
      .returning();
    if (!pr) throw new Error("Purchase request not found");
    return pr;
  }
}
