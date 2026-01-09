import { db } from "../../../db";
import { tblPurchaseOrders, tblPoLines, tblPurchaseRequests, tblPurchaseRequestLines } from "../../../db/procurement.schema";
import { eq, and } from "drizzle-orm";
import { DocumentStatusHistoryService } from '../../masters/services/documentStatusHistory.service';
import { 
  CreatePurchaseOrderRequest, 
  UpdatePurchaseOrderRequest, 
  CreatePRToPORequest,
  SubmitForApprovalRequest,
  ApproveRequest,
  RejectRequest
} from '../types';

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

  async create(request: CreatePurchaseOrderRequest) {
    const { lines, po_number, supplier_id, buyer_id, payment_terms } = request;
    
    // Create the PO first
    const [po] = await db.insert(tblPurchaseOrders).values({
      po_number,
      supplier_id,
      buyer_id,
      payment_terms
    }).returning();
    
    // Create PO lines if provided
    if (lines && lines.length > 0) {
      const poLines = lines.map((line) => ({
        ...line,
        po_id: po.id
      }));
      await db.insert(tblPoLines).values(poLines).returning();
    }
    
    return po;
  }

  async update(id: number, request: UpdatePurchaseOrderRequest) {
    const { supplier_id, buyer_id, payment_terms, status } = request;
    
    const [po] = await db
      .update(tblPurchaseOrders)
      .set({ 
        supplier_id,
        buyer_id,
        payment_terms,
        status,
        updated_at: new Date() 
      })
      .where(eq(tblPurchaseOrders.id, id))
      .returning();
    if (!po) throw new Error("Purchase order not found");
    return po;
  }

  async submitForApproval(id: number, request: SubmitForApprovalRequest) {
    const { submittedBy } = request;
    
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

  async approve(id: number, request: ApproveRequest) {
    const { approvedBy } = request;
    
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

  async reject(id: number, request: RejectRequest) {
    const { rejectedBy, reason } = request;
    
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

  async createFromPR(prId: number, request: CreatePRToPORequest) {
    const { createdBy } = request;
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
