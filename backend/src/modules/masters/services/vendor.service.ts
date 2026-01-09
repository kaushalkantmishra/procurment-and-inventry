import { db } from "../../../db/index";
import { tblVendors } from "../../../db/schema";
import { eq, and } from "drizzle-orm";
import { CreateVendorRequest, UpdateVendorRequest } from '../types';

export class VendorService {
  async getAllVendors() {
    return await db
      .select()
      .from(tblVendors)
      .where(eq(tblVendors.is_deleted, false));
  }

  async createVendor(vendorData: CreateVendorRequest) {
    const [newVendor] = await db
      .insert(tblVendors)
      .values(vendorData)
      .returning();
    return newVendor;
  }

  async getVendorById(id: number) {
    const [vendor] = await db
      .select()
      .from(tblVendors)
      .where(and(eq(tblVendors.id, id), eq(tblVendors.is_deleted, false)));
    if (!vendor) throw new Error("Vendor not found");
    return vendor;
  }

  async updateVendor(id: number, vendorData: UpdateVendorRequest) {
    const [updatedVendor] = await db
      .update(tblVendors)
      .set({ ...vendorData, updated_at: new Date() })
      .where(eq(tblVendors.id, id))
      .returning();
    if (!updatedVendor) throw new Error("Vendor not found");
    return updatedVendor;
  }

  async deleteVendor(id: number) {
    const [deletedVendor] = await db
      .update(tblVendors)
      .set({ is_deleted: true, deleted_at: new Date(), updated_at: new Date() })
      .where(eq(tblVendors.id, id))
      .returning();
    if (!deletedVendor) throw new Error("Vendor not found");
    return deletedVendor;
  }
}