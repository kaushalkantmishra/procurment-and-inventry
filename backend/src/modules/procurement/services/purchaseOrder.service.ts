import { db } from "../../../db";
import { tblPurchaseOrders } from "../../../db/schema";
import { eq, and } from "drizzle-orm";

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
    const [po] = await db.insert(tblPurchaseOrders).values(data).returning();
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
