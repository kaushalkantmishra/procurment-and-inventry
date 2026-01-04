import { db } from "../../../db/index";
import { tblReceiptHeaders } from "../../../db/schema";
import { eq } from "drizzle-orm";

export class ReceiptService {
  async getAll() {
    return await db
      .select()
      .from(tblReceiptHeaders)
      .where(eq(tblReceiptHeaders.is_deleted, false));
  }

  async getById(id: number) {
    const result = await db
      .select()
      .from(tblReceiptHeaders)
      .where(eq(tblReceiptHeaders.id, id));
    if (!result[0]) {
      throw new Error("Receipt not found");
    }
    return result[0];
  }

  async create(data: any) {
    const result = await db
      .insert(tblReceiptHeaders)
      .values({
        ...data,
        created_at: new Date(),
        updated_at: new Date(),
      })
      .returning();
    return result[0];
  }

  async update(id: number, data: any) {
    const result = await db
      .update(tblReceiptHeaders)
      .set({ ...data, updated_at: new Date() })
      .where(eq(tblReceiptHeaders.id, id))
      .returning();
    if (!result[0]) {
      throw new Error("Receipt not found");
    }
    return result[0];
  }

  async delete(id: number) {
    const result = await db
      .update(tblReceiptHeaders)
      .set({ is_deleted: true, updated_at: new Date() })
      .where(eq(tblReceiptHeaders.id, id))
      .returning();
    if (!result[0]) {
      throw new Error("Receipt not found");
    }
  }
}
