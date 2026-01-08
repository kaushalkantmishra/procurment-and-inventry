import { db } from '../../../db';
import { tblPurchaseRequests, tblPurchaseOrders, tblGrnHeaders, tblVendorInvoices } from '../../../db/procurement.schema';
import { tblUsers } from '../../../db/auth.schema';
import { eq, count, sum, sql, desc, and, gte } from 'drizzle-orm';

export class ProcurementDashboardService {
  async getDashboardData() {
    try {
      const now = new Date();
      const twoDaysAgo = new Date(now.getTime() - 48 * 60 * 60 * 1000);
      const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      const sixMonthsAgo = new Date(now.getTime() - 6 * 30 * 24 * 60 * 60 * 1000);

      // A. Status-wise Breakdown
      const [prStatusBreakdown, poStatusBreakdown, grnStatusBreakdown, invoiceStatusBreakdown] = await Promise.all([
        // PR Status breakdown
        db.select({
          status: tblPurchaseRequests.status,
          count: count()
        })
        .from(tblPurchaseRequests)
        .where(eq(tblPurchaseRequests.is_deleted, false))
        .groupBy(tblPurchaseRequests.status),

        // PO Status breakdown
        db.select({
          status: tblPurchaseOrders.status,
          count: count()
        })
        .from(tblPurchaseOrders)
        .where(eq(tblPurchaseOrders.is_deleted, false))
        .groupBy(tblPurchaseOrders.status),

        // GRN Status breakdown
        db.select({
          status: tblGrnHeaders.inspection_status,
          count: count()
        })
        .from(tblGrnHeaders)
        .where(eq(tblGrnHeaders.is_deleted, false))
        .groupBy(tblGrnHeaders.inspection_status),

        // Invoice Status breakdown
        db.select({
          status: tblVendorInvoices.match_status,
          count: count()
        })
        .from(tblVendorInvoices)
        .where(eq(tblVendorInvoices.is_deleted, false))
        .groupBy(tblVendorInvoices.match_status)
      ]);

      // B. Attention/Alerts Data
      const [pendingPRs, pendingPOs, pendingGRNs, varianceInvoices] = await Promise.all([
        // PRs pending > 48 hours
        db.select({
          id: tblPurchaseRequests.id,
          document_number: sql`CONCAT('PR-', ${tblPurchaseRequests.id})`.as('document_number'),
          status: tblPurchaseRequests.status,
          created_at: tblPurchaseRequests.created_at
        })
        .from(tblPurchaseRequests)
        .where(and(
          eq(tblPurchaseRequests.status, 'Submitted'),
          sql`${tblPurchaseRequests.created_at} < ${twoDaysAgo}`
        ))
        .limit(10),

        // POs pending approval
        db.select({
          id: tblPurchaseOrders.id,
          document_number: tblPurchaseOrders.po_number,
          status: tblPurchaseOrders.status,
          created_at: tblPurchaseOrders.created_at
        })
        .from(tblPurchaseOrders)
        .where(eq(tblPurchaseOrders.status, 'Pending Approval'))
        .limit(10),

        // GRNs pending inspection
        db.select({
          id: tblGrnHeaders.id,
          document_number: tblGrnHeaders.grn_number,
          status: tblGrnHeaders.inspection_status,
          created_at: tblGrnHeaders.created_at
        })
        .from(tblGrnHeaders)
        .where(eq(tblGrnHeaders.inspection_status, 'Pending'))
        .limit(10),

        // Invoices with variance
        db.select({
          id: tblVendorInvoices.id,
          document_number: tblVendorInvoices.invoice_number,
          status: tblVendorInvoices.match_status,
          created_at: tblVendorInvoices.created_at
        })
        .from(tblVendorInvoices)
        .where(eq(tblVendorInvoices.match_status, 'VARIANCE'))
        .limit(10)
      ]);

      // C. Recent Activity Feed
      const recentActivities = await db.select({
        type: sql`'PR_CREATED'`.as('type'),
        description: sql`CONCAT('Purchase Request PR-', ${tblPurchaseRequests.id}, ' created')`.as('description'),
        user: sql`NULL`.as('user'),
        timestamp: tblPurchaseRequests.created_at
      })
      .from(tblPurchaseRequests)
      .where(eq(tblPurchaseRequests.is_deleted, false))
      .orderBy(desc(tblPurchaseRequests.created_at))
      .limit(10);

      // D. Trend/Analytics Data
      const [prVsPo, monthlyPoValue, invoiceMatchRatio] = await Promise.all([
        // PR vs PO count (last 30 days)
        db.select({
          pr_count: count(tblPurchaseRequests.id),
          po_count: count(tblPurchaseOrders.id)
        })
        .from(tblPurchaseRequests)
        .leftJoin(tblPurchaseOrders, sql`DATE(${tblPurchaseRequests.created_at}) = DATE(${tblPurchaseOrders.created_at})`)
        .where(gte(tblPurchaseRequests.created_at, thirtyDaysAgo)),

        // Monthly PO value (last 6 months)
        db.select({
          month: sql`DATE_TRUNC('month', ${tblPurchaseOrders.created_at})`.as('month'),
          total_value: sum(tblPurchaseOrders.total_amount)
        })
        .from(tblPurchaseOrders)
        .where(gte(tblPurchaseOrders.created_at, sixMonthsAgo))
        .groupBy(sql`DATE_TRUNC('month', ${tblPurchaseOrders.created_at})`)
        .orderBy(sql`DATE_TRUNC('month', ${tblPurchaseOrders.created_at})`),

        // Invoice match ratio
        db.select({
          matched: count(sql`CASE WHEN ${tblVendorInvoices.match_status} = 'MATCHED' THEN 1 END`),
          unmatched: count(sql`CASE WHEN ${tblVendorInvoices.match_status} = 'UNMATCHED' THEN 1 END`),
          variance: count(sql`CASE WHEN ${tblVendorInvoices.match_status} = 'VARIANCE' THEN 1 END`)
        })
        .from(tblVendorInvoices)
        .where(eq(tblVendorInvoices.is_deleted, false))
      ]);

      // Legacy stats for backward compatibility
      const totalStats = {
        purchaseRequests: {
          total: prStatusBreakdown.reduce((sum, item) => sum + item.count, 0),
          pending: prStatusBreakdown.find(item => item.status === 'Submitted')?.count || 0
        },
        purchaseOrders: {
          total: poStatusBreakdown.reduce((sum, item) => sum + item.count, 0),
          open: poStatusBreakdown.find(item => item.status === 'Draft')?.count || 0,
          totalValue: monthlyPoValue.reduce((sum, item) => sum + parseFloat(item.total_value || '0'), 0)
        },
        grns: {
          total: grnStatusBreakdown.reduce((sum, item) => sum + item.count, 0),
          pending: grnStatusBreakdown.find(item => item.status === 'Pending')?.count || 0
        },
        invoices: {
          total: invoiceStatusBreakdown.reduce((sum, item) => sum + item.count, 0),
          unmatched: invoiceStatusBreakdown.find(item => item.status === 'UNMATCHED')?.count || 0
        }
      };

      return {
        ...totalStats,
        statusBreakdown: {
          purchaseRequests: prStatusBreakdown,
          purchaseOrders: poStatusBreakdown,
          grns: grnStatusBreakdown,
          invoices: invoiceStatusBreakdown
        },
        alerts: {
          pendingPRs,
          pendingPOs,
          pendingGRNs,
          varianceInvoices
        },
        recentActivities,
        trends: {
          prVsPo: prVsPo[0] || { pr_count: 0, po_count: 0 },
          monthlyPoValue,
          invoiceMatchRatio: invoiceMatchRatio[0] || { matched: 0, unmatched: 0, variance: 0 }
        }
      };
    } catch (error) {
      console.error('Dashboard data fetch error:', error);
      return {
        purchaseRequests: { total: 0, pending: 0 },
        purchaseOrders: { total: 0, open: 0, totalValue: 0 },
        grns: { total: 0, pending: 0 },
        invoices: { total: 0, unmatched: 0 },
        statusBreakdown: {
          purchaseRequests: [],
          purchaseOrders: [],
          grns: [],
          invoices: []
        },
        alerts: {
          pendingPRs: [],
          pendingPOs: [],
          pendingGRNs: [],
          varianceInvoices: []
        },
        recentActivities: [],
        trends: {
          prVsPo: { pr_count: 0, po_count: 0 },
          monthlyPoValue: [],
          invoiceMatchRatio: { matched: 0, unmatched: 0, variance: 0 }
        }
      };
    }
  }
}