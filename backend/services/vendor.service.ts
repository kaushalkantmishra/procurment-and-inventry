import { db } from '../src/db';
import { tblVendors } from '../src/db/schema';
import { eq } from 'drizzle-orm';

export class VendorService {
  async getAllVendors() {
    return await db.select().from(tblVendors).where(eq(tblVendors.is_deleted, false));
  }

  async createVendor(vendorData: any) {
    if (vendorData.vendor_code) vendorData.vendor_code = vendorData.vendor_code.substring(0, 50);
    if (vendorData.vendor_name) vendorData.vendor_name = vendorData.vendor_name.substring(0, 200);
    if (vendorData.contact_person) vendorData.contact_person = vendorData.contact_person.substring(0, 100);
    if (vendorData.email) vendorData.email = vendorData.email.substring(0, 100);
    if (vendorData.phone) vendorData.phone = vendorData.phone.substring(0, 20);
    if (vendorData.city) vendorData.city = vendorData.city.substring(0, 100);
    if (vendorData.country) vendorData.country = vendorData.country.substring(0, 100);
    if (vendorData.payment_terms) vendorData.payment_terms = vendorData.payment_terms.substring(0, 50);

    const [newVendor] = await db.insert(tblVendors).values(vendorData).returning();
    return newVendor;
  }
}
