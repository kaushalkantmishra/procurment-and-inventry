import { db } from "../db";
import { tblPurchaseOrders } from "../db/schema";
import { eq, and } from "drizzle-orm";

export class PurchaseOrderService {
  static async getAll() {
    return await db.select().from(tblPurchaseOrders).where(eq(tblPurchaseOrders.is_deleted, false));
  }

  static async getById(id: number) {
    const [po] = await db.select().from(tblPurchaseOrders).where(and(eq(tblPurchaseOrders.id, id), eq(tblPurchaseOrders.is_deleted, false)));
    return po;
  }

  static async create(data: any) {
    const [po] = await db.insert(tblPurchaseOrders).values(data).returning();
    return po;
  }

  static async update(id: number, data: any) {
    const [po] = await db.update(tblPurchaseOrders).set({ ...data, updated_at: new Date() }).where(eq(tblPurchaseOrders.id, id)).returning();
    return po;
  }

  static async delete(id: number) {
    const [po] = await db.update(tblPurchaseOrders).set({ is_deleted: true, deleted_at: new Date() }).where(eq(tblPurchaseOrders.id, id)).returning();
    return po;
  }
}