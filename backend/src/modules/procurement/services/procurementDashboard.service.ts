import { db } from '../../../db';
import { tblPurchaseRequests, tblPurchaseOrders, tblGrnHeaders, tblVendorInvoices } from '../../../db/procurement.schema';
import { eq, count, sum } from 'drizzle-orm';

export class ProcurementDashboardService {
  async getDashboardData() {
    try {
      // Get counts and metrics
      const [prStats, poStats, grnStats, invoiceStats] = await Promise.all([
        // Purchase Requests stats
        db.select({
          total: count(),
          pending: count(eq(tblPurchaseRequests.status, 'Saved'))
        }).from(tblPurchaseRequests),
        
        // Purchase Orders stats
        db.select({
          total: count(),
          open: count(eq(tblPurchaseOrders.status, 'Draft')),
          totalValue: sum(tblPurchaseOrders.total_amount)
        }).from(tblPurchaseOrders),
        
        // GRN stats
        db.select({
          total: count(),
          pending: count(eq(tblGrnHeaders.inspection_status, 'Pending'))
        }).from(tblGrnHeaders),
        
        // Invoice stats
        db.select({
          total: count(),
          unmatched: count(eq(tblVendorInvoices.match_status, 'UNMATCHED'))
        }).from(tblVendorInvoices)
      ]);

      return {
        purchaseRequests: {
          total: prStats[0]?.total || 0,
          pending: prStats[0]?.pending || 0
        },
        purchaseOrders: {
          total: poStats[0]?.total || 0,
          open: poStats[0]?.open || 0,
          totalValue: parseFloat(poStats[0]?.totalValue || '0')
        },
        grns: {
          total: grnStats[0]?.total || 0,
          pending: grnStats[0]?.pending || 0
        },
        invoices: {
          total: invoiceStats[0]?.total || 0,
          unmatched: invoiceStats[0]?.unmatched || 0
        }
      };
    } catch (error) {
      console.error('Dashboard data fetch error:', error);
      return {
        purchaseRequests: { total: 0, pending: 0 },
        purchaseOrders: { total: 0, open: 0, totalValue: 0 },
        grns: { total: 0, pending: 0 },
        invoices: { total: 0, unmatched: 0 }
      };
    }
  }
}