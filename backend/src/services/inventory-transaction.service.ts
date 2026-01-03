import { db } from '../db';
import { tblInventoryTransactions } from '../db/schema';
import { eq } from 'drizzle-orm';

export class InventoryTransactionService {
  static async getAll() {
    return await db.select().from(tblInventoryTransactions).where(eq(tblInventoryTransactions.is_deleted, false));
  }

  static async getById(id: number) {
    const result = await db.select().from(tblInventoryTransactions).where(eq(tblInventoryTransactions.id, id));
    return result[0] || null;
  }

  static async create(data: any) {
    const result = await db.insert(tblInventoryTransactions).values({
      ...data,
      created_at: new Date(),
      updated_at: new Date()
    }).returning();
    return result[0];
  }

  static async update(id: number, data: any) {
    const result = await db.update(tblInventoryTransactions)
      .set({ ...data, updated_at: new Date() })
      .where(eq(tblInventoryTransactions.id, id))
      .returning();
    return result[0];
  }

  static async delete(id: number) {
    await db.update(tblInventoryTransactions)
      .set({ is_deleted: true, updated_at: new Date() })
      .where(eq(tblInventoryTransactions.id, id));
  }
}