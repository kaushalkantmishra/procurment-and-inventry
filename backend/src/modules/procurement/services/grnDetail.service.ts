import { db } from "../../../db/index";
import { tblGrnDetails } from "../../../db/schema";
import { eq, and } from "drizzle-orm";

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

  async create(data: any) {
    const [detail] = await db.insert(tblGrnDetails).values(data).returning();
    return detail;
  }

  async update(id: number, data: any) {
    const [detail] = await db
      .update(tblGrnDetails)
      .set({ ...data, updated_at: new Date() })
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
