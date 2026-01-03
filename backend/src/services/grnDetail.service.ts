import { db } from "../db";
import { tblGrnDetails } from "../db/schema";
import { eq, and } from "drizzle-orm";

export class GRNDetailService {
  static async getAll() {
    return await db.select().from(tblGrnDetails).where(eq(tblGrnDetails.is_deleted, false));
  }

  static async getById(id: number) {
    const [detail] = await db.select().from(tblGrnDetails).where(and(eq(tblGrnDetails.id, id), eq(tblGrnDetails.is_deleted, false)));
    return detail;
  }

  static async getByGRNId(grnId: number) {
    return await db.select().from(tblGrnDetails).where(and(eq(tblGrnDetails.grn_id, grnId), eq(tblGrnDetails.is_deleted, false)));
  }

  static async create(data: any) {
    const [detail] = await db.insert(tblGrnDetails).values(data).returning();
    return detail;
  }

  static async update(id: number, data: any) {
    const [detail] = await db.update(tblGrnDetails).set({ ...data, updated_at: new Date() }).where(eq(tblGrnDetails.id, id)).returning();
    return detail;
  }

  static async delete(id: number) {
    const [detail] = await db.update(tblGrnDetails).set({ is_deleted: true, deleted_at: new Date() }).where(eq(tblGrnDetails.id, id)).returning();
    return detail;
  }
}