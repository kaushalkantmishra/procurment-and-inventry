import { db } from "../../../db/index";
import { tblGrnDetails } from "../../../db/procurement.schema";
import { eq, and } from "drizzle-orm";
import { CreateGrnDetailRequest, UpdateGrnDetailRequest } from '../types';

export class GRNDetailService {
  async getAll() {
    return await db
      .select()
      .from(tblGrnDetails)
      .where(eq(tblGrnDetails.is_deleted, false));
  }

  async getById(id: number) {
    const [detail] = await db
      .select()
      .from(tblGrnDetails)
      .where(
        and(eq(tblGrnDetails.id, id), eq(tblGrnDetails.is_deleted, false))
      );
    return detail;
  }

  async getByGRNId(grnId: number) {
    return await db
      .select()
      .from(tblGrnDetails)
      .where(
        and(
          eq(tblGrnDetails.grn_id, grnId),
          eq(tblGrnDetails.is_deleted, false)
        )
      );
  }

  async create(request: CreateGrnDetailRequest) {
    const {
      grn_id,
      po_line_id,
      item_id,
      uom,
      ordered_qty,
      received_qty,
      accepted_qty,
      rejected_qty,
      storage_location_id,
      condition_note,
      qad_check,
      qad_remarks
    } = request;
    
    const [detail] = await db.insert(tblGrnDetails).values({
      grn_id,
      po_line_id,
      item_id,
      uom,
      ordered_qty,
      received_qty,
      accepted_qty,
      rejected_qty,
      storage_location_id,
      condition_note,
      qad_check,
      qad_remarks
    }).returning();
    return detail;
  }

  async update(id: number, request: UpdateGrnDetailRequest) {
    const {
      uom,
      ordered_qty,
      received_qty,
      accepted_qty,
      rejected_qty,
      storage_location_id,
      condition_note,
      qad_check,
      qad_remarks,
      status
    } = request;
    
    const [detail] = await db
      .update(tblGrnDetails)
      .set({ 
        uom,
        ordered_qty,
        received_qty,
        accepted_qty,
        rejected_qty,
        storage_location_id,
        condition_note,
        qad_check,
        qad_remarks,
        status,
        updated_at: new Date() 
      })
      .where(eq(tblGrnDetails.id, id))
      .returning();
    if (!detail) throw new Error("GRN detail not found");
    return detail;
  }

  async delete(id: number) {
    const [detail] = await db
      .update(tblGrnDetails)
      .set({ is_deleted: true, deleted_at: new Date() })
      .where(eq(tblGrnDetails.id, id))
      .returning();
    if (!detail) throw new Error("GRN detail not found");
    return detail;
  }
}
