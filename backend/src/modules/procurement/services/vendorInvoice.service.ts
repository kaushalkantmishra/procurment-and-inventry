import { db } from "../../../db";
import { tblVendorInvoices, tblInvoiceLines, tblThreeWayMatching, tblPoLines, tblGrnDetails } from "../../../db/procurement.schema";
import { eq, and } from "drizzle-orm";
import { NUMBER_PREFIXES, MATCH_STATUS, PAYMENT_STATUS, ERROR_MESSAGES, VARIANCE_THRESHOLDS } from "../../../constants";

export class VendorInvoiceService {
  async getAll() {
    return await db.select().from(tblVendorInvoices)
      .where(eq(tblVendorInvoices.is_deleted, false));
  }

  async getById(id: number) {
    const [invoice] = await db.select().from(tblVendorInvoices)
      .where(and(eq(tblVendorInvoices.id, id), eq(tblVendorInvoices.is_deleted, false)));
    return invoice;
  }

  async create(data: any) {
    const [invoice] = await db.insert(tblVendorInvoices).values({
      invoice_number: `${NUMBER_PREFIXES.INVOICE}-${Date.now()}`,
      ...data
    }).returning();

    if (data.lines) {
      await db.insert(tblInvoiceLines).values(
        data.lines.map((line: any) => ({
          invoice_id: invoice.id,
          ...line
        }))
      );
    }

    return invoice;
  }

  async performThreeWayMatch(invoiceId: number) {
    return await db.transaction(async (tx) => {
      const invoice = await this.getById(invoiceId);
      if (!invoice) throw new Error(ERROR_MESSAGES.INVOICE_NOT_FOUND);

      const invoiceLines = await tx.select().from(tblInvoiceLines)
        .where(eq(tblInvoiceLines.invoice_id, invoiceId));

      const matchResults = [];

      for (const line of invoiceLines) {
        if (!line.po_line_id) continue;

        const poLine = await tx.select().from(tblPoLines)
          .where(eq(tblPoLines.id, line.po_line_id)).limit(1);

        const grnDetails = await tx.select().from(tblGrnDetails)
          .where(eq(tblGrnDetails.po_line_id, line.po_line_id));

        if (poLine[0] && grnDetails[0]) {
          const quantityVariance = line.quantity - grnDetails[0].received_qty;
          const priceVariance = parseFloat(line.unit_price.toString()) - parseFloat(poLine[0].unit_price.toString());

          const [match] = await tx.insert(tblThreeWayMatching).values({
            po_line_id: line.po_line_id,
            grn_detail_id: grnDetails[0].id,
            invoice_line_id: line.id,
            match_status: (quantityVariance === 0 && priceVariance === 0) ? MATCH_STATUS.MATCHED : MATCH_STATUS.VARIANCE,
            quantity_variance: quantityVariance,
            price_variance: priceVariance.toString(),
          }).returning();

          matchResults.push(match);
        }
      }

      // Update invoice match status
      const overallStatus = matchResults.every(m => m.match_status === MATCH_STATUS.MATCHED) ? MATCH_STATUS.MATCHED : MATCH_STATUS.VARIANCE;
      await tx.update(tblVendorInvoices)
        .set({ match_status: overallStatus, updated_at: new Date() })
        .where(eq(tblVendorInvoices.id, invoiceId));

      return matchResults;
    });
  }

  async update(id: number, data: any) {
    const [invoice] = await db.update(tblVendorInvoices)
      .set({ ...data, updated_at: new Date() })
      .where(eq(tblVendorInvoices.id, id))
      .returning();
    return invoice;
  }

  async delete(id: number) {
    const [invoice] = await db.update(tblVendorInvoices)
      .set({ is_deleted: true, deleted_at: new Date() })
      .where(eq(tblVendorInvoices.id, id))
      .returning();
    return invoice;
  }

  async validatePayment(invoiceId: number): Promise<{ canPay: boolean; reason?: string }> {
    const invoice = await this.getById(invoiceId);
    if (!invoice) {
      return { canPay: false, reason: ERROR_MESSAGES.INVOICE_NOT_FOUND };
    }

    if (invoice.payment_status === PAYMENT_STATUS.PAID) {
      return { canPay: false, reason: ERROR_MESSAGES.INVOICE_ALREADY_PAID };
    }

    if (invoice.match_status === MATCH_STATUS.UNMATCHED) {
      return { canPay: false, reason: ERROR_MESSAGES.INVOICE_NOT_MATCHED };
    }

    if (invoice.match_status === MATCH_STATUS.VARIANCE) {
      // Check if variances are within acceptable limits or approved
      const variances = await db.select().from(tblThreeWayMatching)
        .where(eq(tblThreeWayMatching.invoice_line_id, invoiceId));
      
      const hasSignificantVariance = variances.some(v => 
        Math.abs(v.quantity_variance ?? 0) > VARIANCE_THRESHOLDS.QUANTITY_TOLERANCE || 
        Math.abs(parseFloat(v.price_variance ?? '0')) > VARIANCE_THRESHOLDS.PRICE_TOLERANCE
      );
      
      if (hasSignificantVariance) {
        return { canPay: false, reason: ERROR_MESSAGES.INVOICE_HAS_VARIANCES };
      }
    }

    return { canPay: true };
  }

  async markAsPaid(invoiceId: number, paymentReference: string) {
    const validation = await this.validatePayment(invoiceId);
    if (!validation.canPay) {
      throw new Error(validation.reason);
    }

    const [updated] = await db.update(tblVendorInvoices)
      .set({ 
        payment_status: PAYMENT_STATUS.PAID, 
        updated_at: new Date()
      })
      .where(eq(tblVendorInvoices.id, invoiceId))
      .returning();

    return updated;
  }
}