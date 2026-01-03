import { db } from "../db";
import { tblPurchaseRequests } from "../db/schema";
import { eq, and } from "drizzle-orm";

export class PurchaseRequestService {
  static async getAll() {
    return await db.select().from(tblPurchaseRequests).where(eq(tblPurchaseRequests.is_deleted, false));
  }

  static async getById(id: number) {
    const [pr] = await db.select().from(tblPurchaseRequests).where(and(eq(tblPurchaseRequests.id, id), eq(tblPurchaseRequests.is_deleted, false)));
    return pr;
  }

  static async create(data: any) {
    const [pr] = await db.insert(tblPurchaseRequests).values(data).returning();
    return pr;
  }

  static async update(id: number, data: any) {
    const [pr] = await db.update(tblPurchaseRequests).set({ ...data, updated_at: new Date() }).where(eq(tblPurchaseRequests.id, id)).returning();
    return pr;
  }

  static async delete(id: number) {
    const [pr] = await db.update(tblPurchaseRequests).set({ is_deleted: true, deleted_at: new Date() }).where(eq(tblPurchaseRequests.id, id)).returning();
    return pr;
  }
}