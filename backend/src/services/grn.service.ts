import { db } from '../db';
import { tblGrnHeaders } from '../db/schema';
import { eq } from 'drizzle-orm';

export class GRNService {
  static async getAll() {
    return await db.select().from(tblGrnHeaders).where(eq(tblGrnHeaders.is_deleted, false));
  }

  static async getById(id: number) {
    const result = await db.select().from(tblGrnHeaders).where(eq(tblGrnHeaders.id, id));
    return result[0] || null;
  }

  static async create(data: any) {
    const result = await db.insert(tblGrnHeaders).values({
      ...data,
      created_at: new Date(),
      updated_at: new Date()
    }).returning();
    return result[0];
  }

  static async update(id: number, data: any) {
    const result = await db.update(tblGrnHeaders)
      .set({ ...data, updated_at: new Date() })
      .where(eq(tblGrnHeaders.id, id))
      .returning();
    return result[0];
  }

  static async delete(id: number) {
    await db.update(tblGrnHeaders)
      .set({ is_deleted: true, updated_at: new Date() })
      .where(eq(tblGrnHeaders.id, id));
  }
}