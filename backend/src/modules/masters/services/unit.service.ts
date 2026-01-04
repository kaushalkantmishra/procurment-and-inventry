import { db } from "../../../db/index";
import { tblUnits } from "../../../db/schema";
import { eq } from "drizzle-orm";

export class UnitService {
  async getAllUnits() {
    return await db
      .select()
      .from(tblUnits)
      .where(eq(tblUnits.is_deleted, false));
  }

  async createUnit(unitData: any) {
    const [newUnit] = await db.insert(tblUnits).values(unitData).returning();
    return newUnit;
  }

  async getUnitById(id: number) {
    const [unit] = await db.select().from(tblUnits).where(eq(tblUnits.id, id));
    if (!unit) throw new Error("Unit not found");
    return unit;
  }

  async updateUnit(id: number, unitData: any) {
    const [updatedUnit] = await db
      .update(tblUnits)
      .set({ ...unitData, updated_at: new Date() })
      .where(eq(tblUnits.id, id))
      .returning();
    if (!updatedUnit) throw new Error("Unit not found");
    return updatedUnit;
  }

  async deleteUnit(id: number) {
    const [deletedUnit] = await db
      .update(tblUnits)
      .set({ is_deleted: true, deleted_at: new Date(), updated_at: new Date() })
      .where(eq(tblUnits.id, id))
      .returning();
    if (!deletedUnit) throw new Error("Unit not found");
    return deletedUnit;
  }
}
