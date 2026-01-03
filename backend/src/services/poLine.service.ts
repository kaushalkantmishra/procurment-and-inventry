import { db } from "../db";
import { tblPoLines } from "../db/schema";
import { eq, and } from "drizzle-orm";

export class POLineService {
  static async getAll() {
    return await db.select().from(tblPoLines).where(eq(tblPoLines.is_deleted, false));
  }

  static async getById(id: number) {
    const [line] = await db.select().from(tblPoLines).where(and(eq(tblPoLines.id, id), eq(tblPoLines.is_deleted, false)));
    return line;
  }

  static async getByPOId(poId: number) {
    return await db.select().from(tblPoLines).where(and(eq(tblPoLines.po_id, poId), eq(tblPoLines.is_deleted, false)));
  }

  static async create(data: any) {
    const [line] = await db.insert(tblPoLines).values(data).returning();
    return line;
  }

  static async update(id: number, data: any) {
    const [line] = await db.update(tblPoLines).set({ ...data, updated_at: new Date() }).where(eq(tblPoLines.id, id)).returning();
    return line;
  }

  static async delete(id: number) {
    const [line] = await db.update(tblPoLines).set({ is_deleted: true, deleted_at: new Date() }).where(eq(tblPoLines.id, id)).returning();
    return line;
  }
}