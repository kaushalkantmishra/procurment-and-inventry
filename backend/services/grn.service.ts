import { db } from '../src/db';
import { tblGrnHeaders, tblGrnDetails } from '../src/db/schema';

export class GRNService {
  async getAllGRNs() {
    return await db.query.tblGrnHeaders.findMany({
      with: { details: true },
    });
  }

  async createGRN(grnData: any) {
    const { details, ...headerData } = grnData;

    return await db.transaction(async (tx) => {
      const [grn] = await tx.insert(tblGrnHeaders).values(headerData).returning();

      if (details && details.length > 0) {
        const detailsWithGrnId = details.map((detail: any) => ({ ...detail, grn_id: grn.id }));
        await tx.insert(tblGrnDetails).values(detailsWithGrnId);
      }

      return grn;
    });
  }
}
