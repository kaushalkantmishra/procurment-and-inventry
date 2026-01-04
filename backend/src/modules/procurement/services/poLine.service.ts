import { db } from "../../../db/index";
import { tblPoLines } from "../../../db/schema";
import { eq, and } from "drizzle-orm";

export class POLineService {
  async getAll() {
    return await db
      .select()
      .from(tblPoLines)
      .where(eq(tblPoLines.is_deleted, false));
  }

  async getById(id: number) {
    const [line] = await db
      .select()
      .from(tblPoLines)
      .where(and(eq(tblPoLines.id, id), eq(tblPoLines.is_deleted, false)));
    return line;
  }

  async getByPOId(poId: number) {
    return await db
      .select()
      .from(tblPoLines)
      .where(and(eq(tblPoLines.po_id, poId), eq(tblPoLines.is_deleted, false)));
  }

  async create(data: any) {
    const [line] = await db.insert(tblPoLines).values(data).returning();
    return line;
  }

  async update(id: number, data: any) {
    const [line] = await db
      .update(tblPoLines)
      .set({ ...data, updated_at: new Date() })
      .where(eq(tblPoLines.id, id))
      .returning();
    if (!line) throw new Error("PO line not found");
    return line;
  }

  async delete(id: number) {
    const [line] = await db
      .update(tblPoLines)
      .set({ is_deleted: true, deleted_at: new Date() })
      .where(eq(tblPoLines.id, id))
      .returning();
    if (!line) throw new Error("PO line not found");
    return line;
  }
}
