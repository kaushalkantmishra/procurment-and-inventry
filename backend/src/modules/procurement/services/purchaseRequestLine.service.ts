import { db } from '../../../db';
import { tblPurchaseRequestLines, tblPurchaseRequests } from '../../../db/procurement.schema';
import { eq, and } from 'drizzle-orm';
import { CreatePurchaseRequestLineRequest, UpdatePurchaseRequestLineRequest } from '../types';

export class PurchaseRequestLineService {
  async getByPrId(prId: number) {
    return await db
      .select()
      .from(tblPurchaseRequestLines)
      .where(
        and(
          eq(tblPurchaseRequestLines.pr_id, prId),
          eq(tblPurchaseRequestLines.is_deleted, false)
        )
      );
  }

  async getById(id: number) {
    const [line] = await db
      .select()
      .from(tblPurchaseRequestLines)
      .where(
        and(
          eq(tblPurchaseRequestLines.id, id),
          eq(tblPurchaseRequestLines.is_deleted, false)
        )
      );
    return line;
  }

  async create(request: CreatePurchaseRequestLineRequest) {
    const { pr_id, item_id, quantity, estimated_unit_price } = request;
    
    // Validate PR exists and status is Saved
    const [pr] = await db
      .select()
      .from(tblPurchaseRequests)
      .where(eq(tblPurchaseRequests.id, pr_id));
    
    if (!pr) {
      throw new Error('Purchase Request not found');
    }
    
    if (pr.status !== 'Saved') {
      throw new Error('Cannot modify PR lines when status is not Saved');
    }

    // Validate quantity > 0
    if (!quantity || quantity <= 0) {
      throw new Error('Quantity must be greater than 0');
    }

    // Calculate line_total = quantity × estimated_unit_price
    const lineTotal = quantity * parseFloat(estimated_unit_price || '0');
    
    const lineData = {
      pr_id,
      item_id,
      quantity,
      estimated_unit_price,
      line_total: lineTotal.toString(),
    };

    const [line] = await db.insert(tblPurchaseRequestLines).values(lineData).returning();
    return line;
  }

  async update(id: number, request: UpdatePurchaseRequestLineRequest) {
    const { item_id, quantity, estimated_unit_price } = request;
    
    // Get existing line to check PR status
    const [existingLine] = await db
      .select({
        id: tblPurchaseRequestLines.id,
        pr_id: tblPurchaseRequestLines.pr_id,
        pr_status: tblPurchaseRequests.status
      })
      .from(tblPurchaseRequestLines)
      .innerJoin(tblPurchaseRequests, eq(tblPurchaseRequestLines.pr_id, tblPurchaseRequests.id))
      .where(eq(tblPurchaseRequestLines.id, id));

    if (!existingLine) {
      throw new Error('Purchase Request Line not found');
    }

    if (existingLine.pr_status !== 'Saved') {
      throw new Error('Cannot modify PR lines when status is not Saved');
    }

    // Validate quantity > 0 if provided
    if (quantity !== undefined && quantity <= 0) {
      throw new Error('Quantity must be greater than 0');
    }

    // Recalculate line_total if quantity or price changed
    let updateData: any = { item_id, quantity, estimated_unit_price };
    
    if (quantity !== undefined || estimated_unit_price !== undefined) {
      const currentLine = await this.getById(id);
      const newQuantity = quantity !== undefined ? quantity : currentLine.quantity;
      const newUnitPrice = estimated_unit_price !== undefined ? estimated_unit_price : currentLine.estimated_unit_price;
      updateData.line_total = (newQuantity * parseFloat(newUnitPrice || '0')).toString();
    }

    updateData.updated_at = new Date();

    const [line] = await db
      .update(tblPurchaseRequestLines)
      .set(updateData)
      .where(eq(tblPurchaseRequestLines.id, id))
      .returning();
    
    return line;
  }

  async delete(id: number) {
    // Get existing line to check PR status
    const [existingLine] = await db
      .select({
        id: tblPurchaseRequestLines.id,
        pr_id: tblPurchaseRequestLines.pr_id,
        pr_status: tblPurchaseRequests.status
      })
      .from(tblPurchaseRequestLines)
      .innerJoin(tblPurchaseRequests, eq(tblPurchaseRequestLines.pr_id, tblPurchaseRequests.id))
      .where(eq(tblPurchaseRequestLines.id, id));

    if (!existingLine) {
      throw new Error('Purchase Request Line not found');
    }

    if (existingLine.pr_status !== 'Saved') {
      throw new Error('Cannot modify PR lines when status is not Saved');
    }

    // Soft delete only
    const [line] = await db
      .update(tblPurchaseRequestLines)
      .set({ is_deleted: true, deleted_at: new Date() })
      .where(eq(tblPurchaseRequestLines.id, id))
      .returning();
    
    return line;
  }
}