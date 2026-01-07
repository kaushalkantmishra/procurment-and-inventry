import { db } from "../../../db";
import { tblPurchaseOrders, tblPoLines, tblPurchaseRequests, tblPurchaseRequestLines } from "../../../db/procurement.schema";
import { eq, and } from "drizzle-orm";
import { DocumentStatusHistoryService } from './documentStatusHistory.service';

const statusHistoryService = new DocumentStatusHistoryService();

export class PurchaseOrderService {
  async getAll() {
    return await db
      .select()
      .from(tblPurchaseOrders)
      .where(eq(tblPurchaseOrders.is_deleted, false));
  }

  async getById(id: number) {
    const [po] = await db
      .select()
      .from(tblPurchaseOrders)
      .where(
        and(
          eq(tblPurchaseOrders.id, id),
          eq(tblPurchaseOrders.is_deleted, false)
        )
      );
    return po;
  }

  async create(data: any) {
    const { lines, ...poData } = data;
    
    // Create the PO first
    const [po] = await db.insert(tblPurchaseOrders).values(poData).returning();
    
    // Create PO lines if provided
    if (lines && lines.length > 0) {
      const poLines = lines.map((line: any) => ({
        ...line,
        po_id: po.id
      }));
      await db.insert(tblPoLines).values(poLines).returning();
    }
    
    return po;
  }

  async update(id: number, data: any) {
    const [po] = await db
      .update(tblPurchaseOrders)
      .set({ ...data, updated_at: new Date() })
      .where(eq(tblPurchaseOrders.id, id))
      .returning();
    if (!po) throw new Error("Purchase order not found");
    return po;
  }

  async submitForApproval(id: number, submittedBy: string) {
    const [po] = await db.select().from(tblPurchaseOrders).where(eq(tblPurchaseOrders.id, id));
    if (!po) throw new Error('Purchase order not found');
    
    const oldStatus = po.status;
    const newStatus = 'Pending';
    
    // Update PO status
    const [updatedPo] = await db.update(tblPurchaseOrders)
      .set({ status: newStatus, updated_at: new Date() })
      .where(eq(tblPurchaseOrders.id, id))
      .returning();
    
    // Log status change
    await statusHistoryService.logStatusChange(
      'PO', id, oldStatus, newStatus, submittedBy, 'Submitted for approval'
    );
    
    return {
      message: 'Purchase order submitted for approval successfully',
      po: updatedPo
    };
  }

  async approve(id: number, approvedBy: string) {
    const [po] = await db.select().from(tblPurchaseOrders).where(eq(tblPurchaseOrders.id, id));
    if (!po) throw new Error('Purchase order not found');
    
    const oldStatus = po.status;
    const newStatus = 'Approved';
    
    await this.update(id, { status: newStatus });
    
    // Log status change
    await statusHistoryService.logStatusChange(
      'PO', id, oldStatus, newStatus, approvedBy, 'Purchase order approved'
    );
    
    return { message: 'Purchase order approved successfully' };
  }

  async reject(id: number, rejectedBy: string, reason: string) {
    const [po] = await db.select().from(tblPurchaseOrders).where(eq(tblPurchaseOrders.id, id));
    if (!po) throw new Error('Purchase order not found');
    
    const oldStatus = po.status;
    const newStatus = 'Rejected';
    
    await this.update(id, { status: newStatus });
    
    // Log status change
    await statusHistoryService.logStatusChange(
      'PO', id, oldStatus, newStatus, rejectedBy, `Rejected: ${reason}`
    );
    
    return { message: 'Purchase order rejected successfully' };
  }

  async createFromPR(prId: number, createdBy: string) {
    return await db.transaction(async (tx) => {
      // Validate PR exists and status = Approved
      const [pr] = await tx.select().from(tblPurchaseRequests).where(eq(tblPurchaseRequests.id, prId));
      
      if (!pr) {
        throw new Error('Purchase Request not found');
      }
      
      if (pr.status !== 'Approved') {
        throw new Error('Purchase Request must be Approved to convert to PO');
      }
      
      // Check if already converted
      const existingPO = await tx.select().from(tblPurchaseOrders)
        .where(eq(tblPurchaseOrders.id, prId)); // Assuming we store PR reference
      
      if (existingPO.length > 0) {
        throw new Error('Purchase Request already converted to Purchase Order');
      }
      
      // Get PR lines
      const prLines = await tx.select().from(tblPurchaseRequestLines)
        .where(and(
          eq(tblPurchaseRequestLines.pr_id, prId),
          eq(tblPurchaseRequestLines.is_deleted, false)
        ));
      
      if (prLines.length === 0) {
        throw new Error('Purchase Request has no valid lines');
      }
      
      // Calculate total from PR lines
      const totalAmount = prLines.reduce((sum, line) => {
        return sum + parseFloat(line.line_total || '0');
      }, 0);
      
      // Generate PO number (simplified - should use sequence)
      const poNumber = `PO-${Date.now()}`;
      
      // Create PO header
      const [po] = await tx.insert(tblPurchaseOrders).values({
        po_number: poNumber,
        supplier_id: null, // To be filled later
        total_amount: totalAmount.toString(),
        status: 'Draft',
        created_at: new Date(),
      }).returning();
      
      // Convert PR lines to PO lines
      const poLinesData = prLines.map((prLine, index) => ({
        po_id: po.id,
        line_number: index + 1,
        item_id: prLine.item_id,
        quantity: prLine.quantity,
        unit_price: prLine.estimated_unit_price || '0',
        line_total: prLine.line_total || '0',
        status: 1,
      }));
      
      await tx.insert(tblPoLines).values(poLinesData);
      
      // Update PR status to Converted
      await tx.update(tblPurchaseRequests)
        .set({ status: 'Converted', updated_at: new Date() })
        .where(eq(tblPurchaseRequests.id, prId));
      
      // Log status changes
      await statusHistoryService.logStatusChange(
        'PR', prId, 'Approved', 'Converted', createdBy, `Converted to PO ${poNumber}`
      );
      
      await statusHistoryService.logStatusChange(
        'PO', po.id, null, 'Draft', createdBy, `Created from PR ${prId}`
      );
      
      return {
        message: 'Purchase Request converted to Purchase Order successfully',
        po,
        prId
      };
    });
  }

  async delete(id: number) {
    const [po] = await db
      .update(tblPurchaseOrders)
      .set({ is_deleted: true, deleted_at: new Date() })
      .where(eq(tblPurchaseOrders.id, id))
      .returning();
    if (!po) throw new Error("Purchase order not found");
    return po;
  }
}
