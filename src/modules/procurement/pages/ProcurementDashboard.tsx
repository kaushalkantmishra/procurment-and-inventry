import React, { useState, useEffect } from 'react';
import { ShoppingCart, FileText, Package, AlertTriangle, DollarSign, TrendingUp } from 'lucide-react';
import { KPICard } from '../../../components/ui/KPICard';
import { Badge } from '../../../components/ui/Badge';
import { apiService } from '../../../services/api';

export const ProcurementDashboard: React.FC = () => {
  const [dashboardData, setDashboardData] = useState<any>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      // Try to use the dedicated dashboard API first
      try {
        const dashboardResponse = await apiService.getProcurementDashboard();
        const data = dashboardResponse?.data || dashboardResponse;
        
        setDashboardData({
          totalPRs: data.purchaseRequests?.total || 0,
          pendingPRs: data.purchaseRequests?.pending || 0,
          openPOs: data.purchaseOrders?.open || 0,
          pendingGRNs: data.grns?.pending || 0,
          pendingInvoices: data.invoices?.unmatched || 0,
          totalPOValue: data.purchaseOrders?.totalValue || 0,
          recentActivity: []
        });
      } catch (dashboardError) {
        // Fallback to individual API calls if dashboard API fails
        console.warn('Dashboard API failed, using fallback:', dashboardError);
        const [prs, pos, grns, invoices] = await Promise.all([
          apiService.getPurchaseRequests(),
          apiService.getPurchaseOrders(),
          apiService.getGRNs(),
          apiService.getVendorInvoices()
        ]);

        const prData = Array.isArray(prs?.data) ? prs.data : Array.isArray(prs) ? prs : [];
        const poData = Array.isArray(pos?.data) ? pos.data : Array.isArray(pos) ? pos : [];
        const grnData = Array.isArray(grns?.data) ? grns.data : Array.isArray(grns) ? grns : [];
        const invoiceData = Array.isArray(invoices?.data) ? invoices.data : Array.isArray(invoices) ? invoices : [];

        setDashboardData({
          totalPRs: prData.length,
          pendingPRs: prData.filter((pr: any) => pr.status === 'Saved' || pr.status === 'Submitted').length,
          openPOs: poData.filter((po: any) => po.status === 'Draft' || po.status === 'Approved').length,
          pendingGRNs: grnData.filter((grn: any) => grn.inspection_status === 'Pending').length,
          pendingInvoices: invoiceData.filter((inv: any) => inv.match_status === 'UNMATCHED').length,
          totalPOValue: poData.reduce((sum: number, po: any) => sum + parseFloat(po.total_amount || '0'), 0),
          recentActivity: [
            ...prData.slice(0, 3).map((pr: any) => ({
              type: 'PR',
              description: `PR created for ${pr.justification || 'procurement'}`,
              time: new Date(pr.created_at).toLocaleDateString()
            })),
            ...poData.slice(0, 2).map((po: any) => ({
              type: 'PO',
              description: `PO ${po.po_number} ${po.status.toLowerCase()}`,
              time: new Date(po.created_at).toLocaleDateString()
            }))
          ]
        });
      }
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
      // Set default values on complete failure
      setDashboardData({
        totalPRs: 0,
        pendingPRs: 0,
        openPOs: 0,
        pendingGRNs: 0,
        pendingInvoices: 0,
        totalPOValue: 0,
        recentActivity: []
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600 dark:text-gray-400">Loading procurement dashboard...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          Procurement Dashboard
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Monitor your procurement operations and key metrics
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <KPICard
          title="Total PRs"
          value={dashboardData.totalPRs || 0}
          icon={FileText}
          iconColor="text-blue-600"
        />
        <KPICard
          title="Pending PRs"
          value={dashboardData.pendingPRs || 0}
          icon={AlertTriangle}
          iconColor="text-orange-600"
        />
        <KPICard
          title="Open POs"
          value={dashboardData.openPOs || 0}
          icon={ShoppingCart}
          iconColor="text-green-600"
        />
        <KPICard
          title="Pending GRNs"
          value={dashboardData.pendingGRNs || 0}
          icon={Package}
          iconColor="text-purple-600"
        />
        <KPICard
          title="Pending Invoices"
          value={dashboardData.pendingInvoices || 0}
          icon={AlertTriangle}
          iconColor="text-red-600"
        />
        <KPICard
          title="PO Value"
          value={`$${(dashboardData.totalPOValue || 0).toLocaleString()}`}
          icon={DollarSign}
          iconColor="text-emerald-600"
        />
      </div>

      {/* Recent Activity */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-soft border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
          <TrendingUp size={20} className="text-primary-600" />
          Recent Activity
        </h3>
        <div className="space-y-3">
          {dashboardData.recentActivity?.map((activity: any, index: number) => (
            <div key={index} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700">
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  {activity.description}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {activity.time}
                </p>
              </div>
              <Badge variant={activity.type === 'PR' ? 'info' : 'success'}>
                {activity.type}
              </Badge>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};