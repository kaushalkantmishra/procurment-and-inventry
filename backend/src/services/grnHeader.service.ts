import { db } from "../db";
import { tblGrnHeaders } from "../db/schema";
import { eq, and } from "drizzle-orm";

export class GRNHeaderService {
  static async getAll() {
    return await db.select().from(tblGrnHeaders).where(eq(tblGrnHeaders.is_deleted, false));
  }

  static async getById(id: number) {
    const [grn] = await db.select().from(tblGrnHeaders).where(and(eq(tblGrnHeaders.id, id), eq(tblGrnHeaders.is_deleted, false)));
    return grn;
  }

  static async create(data: any) {
    const [grn] = await db.insert(tblGrnHeaders).values(data).returning();
    return grn;
  }

  static async update(id: number, data: any) {
    const [grn] = await db.update(tblGrnHeaders).set({ ...data, updated_at: new Date() }).where(eq(tblGrnHeaders.id, id)).returning();
    return grn;
  }

  static async delete(id: number) {
    const [grn] = await db.update(tblGrnHeaders).set({ is_deleted: true, deleted_at: new Date() }).where(eq(tblGrnHeaders.id, id)).returning();
    return grn;
  }
}