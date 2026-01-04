import { db } from "../../../db/index";
import { tblGrnHeaders } from "../../../db/schema";
import { eq } from "drizzle-orm";

export class GRNService {
  async getAll() {
    return await db
      .select()
      .from(tblGrnHeaders)
      .where(eq(tblGrnHeaders.is_deleted, false));
  }

  async getById(id: number) {
    const result = await db
      .select()
      .from(tblGrnHeaders)
      .where(eq(tblGrnHeaders.id, id));
    if (!result[0]) {
      throw new Error("GRN not found");
    }
    return result[0];
  }

  async create(data: any) {
    const result = await db
      .insert(tblGrnHeaders)
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
      .update(tblGrnHeaders)
      .set({ ...data, updated_at: new Date() })
      .where(eq(tblGrnHeaders.id, id))
      .returning();
    if (!result[0]) {
      throw new Error("GRN not found");
    }
    return result[0];
  }

  async delete(id: number) {
    const result = await db
      .update(tblGrnHeaders)
      .set({ is_deleted: true, updated_at: new Date() })
      .where(eq(tblGrnHeaders.id, id))
      .returning();
    if (!result[0]) {
      throw new Error("GRN not found");
    }
  }
}
