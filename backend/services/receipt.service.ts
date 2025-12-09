import { db } from '../src/db';
import { tblReceiptHeaders, tblReceiptLines, tblPayments } from '../src/db/schema';

export class ReceiptService {
  async getAllReceipts() {
    return await db.query.tblReceiptHeaders.findMany({
      with: {
        lines: true,
        payments: true,
      },
    });
  }

  async createReceipt(receiptData: any) {
    const { lines, payments: paymentData, ...headerData } = receiptData;

    return await db.transaction(async (tx) => {
      const [receipt] = await tx.insert(tblReceiptHeaders).values(headerData).returning();

      if (lines && lines.length > 0) {
        const linesWithReceiptId = lines.map((line: any) => ({ ...line, receipt_id: receipt.id }));
        await tx.insert(tblReceiptLines).values(linesWithReceiptId);
      }

      if (paymentData && paymentData.length > 0) {
        const paymentsWithReceiptId = paymentData.map((payment: any) => ({ ...payment, receipt_id: receipt.id }));
        await tx.insert(tblPayments).values(paymentsWithReceiptId);
      }

      return receipt;
    });
  }
}
