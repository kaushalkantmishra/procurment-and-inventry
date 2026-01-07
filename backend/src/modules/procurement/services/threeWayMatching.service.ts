import { db } from '../../../db';
import { tblThreeWayMatching, tblPoLines, tblGrnDetails } from '../../../db/procurement.schema';
import { eq } from 'drizzle-orm';

export class ThreeWayMatchingService {
  async getAll() {
    return await db.select().from(tblThreeWayMatching);
  }

  async getById(id: number) {
    const result = await db.select().from(tblThreeWayMatching).where(eq(tblThreeWayMatching.id, id));
    return result[0];
  }

  async create(data: any) {
    const result = await db.insert(tblThreeWayMatching).values(data).returning();
    return result[0];
  }

  async createAutomaticMatch(poLineId: number, grnDetailId: number, invoiceLineId: number) {
    // Get data from all three documents
    const [poLine] = await db.select().from(tblPoLines).where(eq(tblPoLines.id, poLineId));
    const [grnDetail] = await db.select().from(tblGrnDetails).where(eq(tblGrnDetails.id, grnDetailId));
    
    if (!poLine || !grnDetail) {
      throw new Error('PO Line or GRN Detail not found');
    }
    
    // Calculate variances
    const quantityVariance = (grnDetail.accepted_qty || 0) - (poLine.quantity || 0);
    const priceVariance = 0; // GRN doesn't have unit_price, price variance calculated against invoice
    const totalVariance = quantityVariance * parseFloat(poLine.unit_price || '0');
    
    // Determine match status
    let matchStatus = 'MATCHED';
    if (Math.abs(quantityVariance) > 0 || Math.abs(priceVariance) > 0.01) {
      matchStatus = 'VARIANCE';
    }
    
    const matchData = {
      po_line_id: poLineId,
      grn_detail_id: grnDetailId,
      invoice_line_id: invoiceLineId,
      quantity_variance: quantityVariance,
      price_variance: priceVariance.toString(),
      variance_reason: matchStatus === 'VARIANCE' ? 'Automatic variance detection' : null,
      matched_by: 'SYSTEM',
      matched_at: new Date()
    };
    
    const result = await db.insert(tblThreeWayMatching).values(matchData).returning();
    return result[0];
  }

  async update(id: number, data: any) {
    const result = await db.update(tblThreeWayMatching)
      .set({ ...data, updated_at: new Date() })
      .where(eq(tblThreeWayMatching.id, id))
      .returning();
    return result[0];
  }

  async delete(id: number) {
    await db.delete(tblThreeWayMatching).where(eq(tblThreeWayMatching.id, id));
    return { success: true };
  }
}