import { db } from '../db/index';
import { tblVendors } from '../db/schema';
import { eq } from 'drizzle-orm';

export class VendorService {
  async getAllVendors() {
    return await db.select().from(tblVendors).where(eq(tblVendors.is_deleted, false));
  }

  async createVendor(vendorData: any) {
    const [newVendor] = await db.insert(tblVendors).values(vendorData).returning();
    return newVendor;
  }

  async getVendorById(id: number) {
    const [vendor] = await db.select().from(tblVendors).where(eq(tblVendors.id, id));
    if (!vendor) throw new Error('Vendor not found');
    return vendor;
  }

  async updateVendor(id: number, vendorData: any) {
    const [updatedVendor] = await db.update(tblVendors)
      .set({ ...vendorData, updated_at: new Date() })
      .where(eq(tblVendors.id, id))
      .returning();
    if (!updatedVendor) throw new Error('Vendor not found');
    return updatedVendor;
  }

  async deleteVendor(id: number) {
    const [deletedVendor] = await db.update(tblVendors)
      .set({ is_deleted: true, deleted_at: new Date(), updated_at: new Date() })
      .where(eq(tblVendors.id, id))
      .returning();
    if (!deletedVendor) throw new Error('Vendor not found');
    return deletedVendor;
  }
}