import { db } from '../db/index';
import { tblWarehouses } from '../db/schema';
import { eq } from 'drizzle-orm';

export class WarehouseService {
  async getAllWarehouses() {
    return await db.select().from(tblWarehouses).where(eq(tblWarehouses.is_deleted, false));
  }

  async createWarehouse(warehouseData: any) {
    const [newWarehouse] = await db.insert(tblWarehouses).values(warehouseData).returning();
    return newWarehouse;
  }

  async getWarehouseById(id: number) {
    const [warehouse] = await db.select().from(tblWarehouses).where(eq(tblWarehouses.id, id));
    if (!warehouse) throw new Error('Warehouse not found');
    return warehouse;
  }

  async updateWarehouse(id: number, warehouseData: any) {
    const [updatedWarehouse] = await db.update(tblWarehouses)
      .set({ ...warehouseData, updated_at: new Date() })
      .where(eq(tblWarehouses.id, id))
      .returning();
    if (!updatedWarehouse) throw new Error('Warehouse not found');
    return updatedWarehouse;
  }

  async deleteWarehouse(id: number) {
    const [deletedWarehouse] = await db.update(tblWarehouses)
      .set({ is_deleted: true, deleted_at: new Date(), updated_at: new Date() })
      .where(eq(tblWarehouses.id, id))
      .returning();
    if (!deletedWarehouse) throw new Error('Warehouse not found');
    return deletedWarehouse;
  }
}