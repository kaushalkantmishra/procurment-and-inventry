import { db } from '../db';
import { tblReceiptHeaders } from '../db/schema';
import { eq } from 'drizzle-orm';

export class ReceiptService {
  static async getAll() {
    return await db.select().from(tblReceiptHeaders).where(eq(tblReceiptHeaders.is_deleted, false));
  }

  static async getById(id: number) {
    const result = await db.select().from(tblReceiptHeaders).where(eq(tblReceiptHeaders.id, id));
    return result[0] || null;
  }

  static async create(data: any) {
    const result = await db.insert(tblReceiptHeaders).values({
      ...data,
      created_at: new Date(),
      updated_at: new Date()
    }).returning();
    return result[0];
  }

  static async update(id: number, data: any) {
    const result = await db.update(tblReceiptHeaders)
      .set({ ...data, updated_at: new Date() })
      .where(eq(tblReceiptHeaders.id, id))
      .returning();
    return result[0];
  }

  static async delete(id: number) {
    await db.update(tblReceiptHeaders)
      .set({ is_deleted: true, updated_at: new Date() })
      .where(eq(tblReceiptHeaders.id, id));
  }
}