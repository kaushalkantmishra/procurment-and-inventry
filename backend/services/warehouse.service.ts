import { db } from '../src/db';
import { tblWarehouses } from '../src/db/schema';
import { eq } from 'drizzle-orm';

export class WarehouseService {
  async getAllWarehouses() {
    return await db.select().from(tblWarehouses).where(eq(tblWarehouses.is_deleted, false));
  }

  async createWarehouse(warehouseData: any) {
    const [newWarehouse] = await db.insert(tblWarehouses).values(warehouseData).returning();
    return newWarehouse;
  }
}
