import { db } from "../../../db/index";
import { tblGrnHeaders, tblGrnDetails, tblPoLines } from "../../../db/procurement.schema";
import { eq, and } from "drizzle-orm";
import { InventoryTransactionService } from "../../inventory/services/inventoryTransaction.service";
import { CreateGrnHeaderRequest, UpdateGrnHeaderRequest } from '../types';

export class GRNHeaderService {
  async getAll() {
    return await db
      .select()
      .from(tblGrnHeaders)
      .where(eq(tblGrnHeaders.is_deleted, false));
  }

  async getById(id: number) {
    const [grn] = await db
      .select()
      .from(tblGrnHeaders)
      .where(
        and(eq(tblGrnHeaders.id, id), eq(tblGrnHeaders.is_deleted, false))
      );
    return grn;
  }

  async create(request: CreateGrnHeaderRequest & { details?: any[] }) {
    const { details, grn_number, po_id, supplier_id, delivery_note_ref, vehicle_reg_no, received_by_user, inspection_status, remarks } = request;
    
    return await db.transaction(async (tx) => {
      try {
        // Create GRN header
        const [grn] = await tx.insert(tblGrnHeaders).values({
          grn_number,
          po_id,
          supplier_id,
          delivery_note_ref,
          vehicle_reg_no,
          received_by_user,
          inspection_status: inspection_status || 'Pending',
          remarks,
          receipt_date: new Date()
        }).returning();
        
        // Create GRN details if provided
        if (details && details.length > 0) {
          const grnDetails = details.map((detail: any) => ({
            ...detail,
            grn_id: grn.id 
          }));
          await tx.insert(tblGrnDetails).values(grnDetails).returning();
        }
        
        return grn;
      } catch (error) {
        throw error;
      }
    });
  }

  async update(id: number, request: UpdateGrnHeaderRequest) {
    const { supplier_id, delivery_note_ref, vehicle_reg_no, received_by_user, inspection_status, remarks, status } = request;
    
    const [grn] = await db
      .update(tblGrnHeaders)
      .set({ 
        supplier_id,
        delivery_note_ref,
        vehicle_reg_no,
        received_by_user,
        inspection_status,
        remarks,
        status,
        updated_at: new Date() 
      })
      .where(eq(tblGrnHeaders.id, id))
      .returning();
    if (!grn) throw new Error("GRN header not found");
    return grn;
  }

  async delete(id: number) {
    const [grn] = await db
      .update(tblGrnHeaders)
      .set({ is_deleted: true, deleted_at: new Date() })
      .where(eq(tblGrnHeaders.id, id))
      .returning();
    if (!grn) throw new Error("GRN header not found");
    return grn;
  }

  async approve(id: number, approvedBy: string) {
    return await db.transaction(async (tx) => {
      // Update GRN status to Approved
      const [grn] = await tx.update(tblGrnHeaders)
        .set({ inspection_status: 'Approved', updated_at: new Date() })
        .where(eq(tblGrnHeaders.id, id))
        .returning();
      
      if (!grn) throw new Error('GRN not found');
      
      // Get GRN details for inventory updates
      const grnDetails = await tx.select()
        .from(tblGrnDetails)
        .where(eq(tblGrnDetails.grn_id, id));  
      
      // Update inventory for each accepted item
      for (const detail of grnDetails) {
        if (detail.accepted_qty > 0 && detail.po_line_id) {
          // Get PO line for costing information
          const [poLine] = await tx.select()
            .from(tblPoLines)
            .where(eq(tblPoLines.id, detail.po_line_id));
          
          const unitCost = poLine ? parseFloat(poLine.unit_price) : 0;
          
          // Call inventory API to update stock
          await this.updateInventoryStock({
            item_id: detail.item_id,
            quantity: detail.accepted_qty,
            warehouse_id: 1,
            unit_cost: unitCost,
            reference_id: id,
            reference_number: grn.grn_number
          });
        }
      }
      
      return { message: 'GRN approved and inventory updated successfully', grn };
    });
  }

  async reject(id: number, rejectedBy: string, reason: string) {
    const [grn] = await db.update(tblGrnHeaders)
      .set({ 
        inspection_status: 'Rejected', 
        remarks: reason,
        updated_at: new Date() 
      })
      .where(eq(tblGrnHeaders.id, id))
      .returning();
    
    if (!grn) throw new Error('GRN not found');
    return { message: 'GRN rejected successfully', grn };
  }

  private async updateInventoryStock(data: any) {
    try {
      const inventoryService = new InventoryTransactionService();
      
      await inventoryService.stockIn({
        item_id: data.item_id,
        quantity: data.quantity,
        reference_type: 'GRN',
        reference_id: data.reference_id,
        reference_number: data.reference_number,
        notes: `Stock received via GRN ${data.reference_number}`,
        created_by: 'SYSTEM'
      });
    } catch (error) {
      throw new Error(`Inventory update failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}
