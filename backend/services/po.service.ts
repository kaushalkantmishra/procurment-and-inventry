import { db } from '../src/db';
import { tblPurchaseOrders, tblPoLines } from '../src/db/schema';

export class POService {
  async getAllPurchaseOrders() {
    return await db.query.tblPurchaseOrders.findMany({
      with: { lines: true },
    });
  }

  async createPurchaseOrder(poData: any) {
    const { lines, ...headerData } = poData;

    return await db.transaction(async (tx) => {
      const [po] = await tx.insert(tblPurchaseOrders).values(headerData).returning();

      if (lines && lines.length > 0) {
        const linesWithPoId = lines.map((line: any) => ({ ...line, po_id: po.id }));
        await tx.insert(tblPoLines).values(linesWithPoId);
      }

      return po;
    });
  }
}
