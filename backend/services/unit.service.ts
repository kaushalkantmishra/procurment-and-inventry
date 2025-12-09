import { db } from '../src/db';
import { tblUnits } from '../src/db/schema';
import { eq } from 'drizzle-orm';

export class UnitService {
  async getAllUnits() {
    return await db.select().from(tblUnits).where(eq(tblUnits.is_deleted, false));
  }

  async createUnit(unitData: any) {
    const [newUnit] = await db.insert(tblUnits).values(unitData).returning();
    return newUnit;
  }
}
