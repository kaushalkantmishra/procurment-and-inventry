import { db } from '../../../db';
import { 
  tblPurchaseRequests, 
  tblPurchaseRequestLines,
  tblPurchaseOrders, 
  tblPoLines,
  tblGrnHeaders,
  tblGrnDetails,
  tblVendorInvoices,
  tblInvoiceLines,
  tblThreeWayMatching
} from '../../../db/procurement.schema';
import { eq } from 'drizzle-orm';

export class ProcurementFlowService {
  async getFlowByPoId(poId: number) {
    try {
      // Get PO header and lines
      const [po] = await db
        .select()
        .from(tblPurchaseOrders)
        .where(eq(tblPurchaseOrders.id, poId));

      if (!po) {
        throw new Error('Purchase Order not found');
      }

      const poLines = await db
        .select()
        .from(tblPoLines)
        .where(eq(tblPoLines.po_id, poId));

      // Get GRN headers and details for this PO
      const grnHeaders = await db
        .select()
        .from(tblGrnHeaders)
        .where(eq(tblGrnHeaders.po_id, poId));

      const grnDetails: any[] = [];
      for (const grn of grnHeaders) {
        const details = await db
          .select()
          .from(tblGrnDetails)
          .where(eq(tblGrnDetails.grn_id, grn.id));
        grnDetails.push(...details);
      }

      // Get vendor invoices for this PO
      const vendorInvoices = await db
        .select()
        .from(tblVendorInvoices)
        .where(eq(tblVendorInvoices.po_id, poId));

      const invoiceLines: any[] = [];
      for (const invoice of vendorInvoices) {
        const lines = await db
          .select()
          .from(tblInvoiceLines)
          .where(eq(tblInvoiceLines.invoice_id, invoice.id));
        invoiceLines.push(...lines);
      }

      // Get three-way matching results for PO lines
      const threeWayMatches: any[] = [];
      for (const poLine of poLines) {
        const matches = await db
          .select()
          .from(tblThreeWayMatching)
          .where(eq(tblThreeWayMatching.po_line_id, poLine.id));
        threeWayMatches.push(...matches);
      }

      // Compile the complete flow
      const flow = {
        purchaseOrder: {
          header: po,
          lines: poLines
        },
        goodsReceiptNotes: grnHeaders.map(grn => ({
          header: grn,
          details: grnDetails.filter(detail => detail.grn_id === grn.id)
        })),
        vendorInvoices: vendorInvoices.map(invoice => ({
          header: invoice,
          lines: invoiceLines.filter(line => line.invoice_id === invoice.id)
        })),
        threeWayMatching: threeWayMatches,
        summary: {
          po_total: parseFloat(po.total_amount || '0'),
          grn_count: grnHeaders.length,
          invoice_count: vendorInvoices.length,
          matched_lines: threeWayMatches.filter(m => m.match_status === 'MATCHED').length,
          variance_lines: threeWayMatches.filter(m => m.match_status === 'VARIANCE').length,
          payment_status: this.calculatePaymentStatus(vendorInvoices)
        }
      };

      return flow;
    } catch (error) {
      console.error('Procurement flow fetch error:', error);
      throw error;
    }
  }

  private calculatePaymentStatus(invoices: any[]) {
    if (invoices.length === 0) return 'NO_INVOICES';
    
    const paidCount = invoices.filter(inv => inv.payment_status === 'PAID').length;
    const pendingCount = invoices.filter(inv => inv.payment_status === 'PENDING').length;
    
    if (paidCount === invoices.length) return 'FULLY_PAID';
    if (paidCount > 0) return 'PARTIALLY_PAID';
    if (pendingCount > 0) return 'PENDING_PAYMENT';
    
    return 'UNKNOWN';
  }
}