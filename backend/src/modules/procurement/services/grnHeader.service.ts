import { db } from "../../../db/index";
import { tblGrnHeaders } from "../../../db/schema";
import { eq, and } from "drizzle-orm";

export class GRNHeaderService {
  async getAll() {
    return await db
      .select()
      .from(tblGrnHeaders)
      .where(eq(tblGrnHeaders.is_deleted, false));
  }

  async getById(id: number) {
    const [grn] = await db
      .select()
      .from(tblGrnHeaders)
      .where(
        and(eq(tblGrnHeaders.id, id), eq(tblGrnHeaders.is_deleted, false))
      );
    return grn;
  }

  async create(data: any) {
    const [grn] = await db.insert(tblGrnHeaders).values(data).returning();
    return grn;
  }

  async update(id: number, data: any) {
    const [grn] = await db
      .update(tblGrnHeaders)
      .set({ ...data, updated_at: new Date() })
      .where(eq(tblGrnHeaders.id, id))
      .returning();
    if (!grn) throw new Error("GRN header not found");
    return grn;
  }

  async delete(id: number) {
    const [grn] = await db
      .update(tblGrnHeaders)
      .set({ is_deleted: true, deleted_at: new Date() })
      .where(eq(tblGrnHeaders.id, id))
      .returning();
    if (!grn) throw new Error("GRN header not found");
    return grn;
  }
}
