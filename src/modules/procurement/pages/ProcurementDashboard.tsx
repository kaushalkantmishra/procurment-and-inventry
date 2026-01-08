import React, { useState, useEffect } from 'react';
import { ShoppingCart, FileText, Package, AlertTriangle, DollarSign, TrendingUp, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { KPICard } from '../../../components/ui/KPICard';
import { apiService } from '../../../services/api';
import { useAuthStore } from '../../../store/authStore';
import { formatCurrency, formatLargeNumber } from '../../../utils/currency';

interface StatusCard {
  status: string;
  count: number;
  color: string;
}

interface AlertItem {
  id: number;
  document_number: string;
  status: string;
  created_at: string;
}

export const ProcurementDashboard: React.FC = () => {
  const [dashboardData, setDashboardData] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const { user } = useAuthStore();

  const userRoles = user?.roles || [];
  const isAdmin = userRoles.includes('ADMIN');
  const isApprover = userRoles.includes('APPROVER');
  const isProcurement = userRoles.includes('PROCUREMENT');
  const isStore = userRoles.includes('STORE');
  const isFinance = userRoles.includes('FINANCE');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const dashboardResponse = await apiService.getProcurementDashboard();
      const data = dashboardResponse?.data || dashboardResponse;
      setDashboardData(data);
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
      setDashboardData({});
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    const colorMap: { [key: string]: string } = {
      'Saved': 'bg-gray-100 text-gray-800',
      'Submitted': 'bg-blue-100 text-blue-800',
      'Approved': 'bg-green-100 text-green-800',
      'Rejected': 'bg-red-100 text-red-800',
      'Draft': 'bg-yellow-100 text-yellow-800',
      'Pending Approval': 'bg-orange-100 text-orange-800',
      'Closed': 'bg-gray-100 text-gray-800',
      'Pending': 'bg-orange-100 text-orange-800',
      'Accepted': 'bg-green-100 text-green-800',
      'UNMATCHED': 'bg-red-100 text-red-800',
      'MATCHED': 'bg-green-100 text-green-800',
      'VARIANCE': 'bg-yellow-100 text-yellow-800',
      'PAID': 'bg-blue-100 text-blue-800'
    };
    return colorMap[status] || 'bg-gray-100 text-gray-800';
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'PR_CREATED': return <FileText size={16} className="text-blue-600" />;
      case 'PO_APPROVED': return <CheckCircle size={16} className="text-green-600" />;
      case 'PO_REJECTED': return <XCircle size={16} className="text-red-600" />;
      case 'GRN_INSPECTION': return <Package size={16} className="text-purple-600" />;
      case 'INVOICE_MATCHED': return <DollarSign size={16} className="text-emerald-600" />;
      default: return <AlertCircle size={16} className="text-gray-600" />;
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
    <div className="max-w-[1400px] mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          Procurement Dashboard
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Monitor your procurement operations and key metrics
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {(isAdmin || isProcurement || isApprover) && (
          <KPICard
            title="Total PRs"
            value={dashboardData.purchaseRequests?.total || 0}
            icon={FileText}
            iconColor="text-blue-600"
          />
        )}
        {(isAdmin || isApprover) && (
          <KPICard
            title="Pending PRs"
            value={dashboardData.purchaseRequests?.pending || 0}
            icon={AlertTriangle}
            iconColor="text-orange-600"
          />
        )}
        {(isAdmin || isProcurement) && (
          <KPICard
            title="Open POs"
            value={dashboardData.purchaseOrders?.open || 0}
            icon={ShoppingCart}
            iconColor="text-green-600"
          />
        )}
        {(isAdmin || isStore) && (
          <KPICard
            title="Pending GRNs"
            value={dashboardData.grns?.pending || 0}
            icon={Package}
            iconColor="text-purple-600"
          />
        )}
        {(isAdmin || isFinance) && (
          <KPICard
            title="Unmatched Invoices"
            value={formatLargeNumber(dashboardData.invoices?.unmatched || 0)}
            icon={AlertTriangle}
            iconColor="text-red-600"
          />
        )}
        {(isAdmin || isProcurement || isFinance) && (
          <KPICard
            title="PO Value"
            value={formatCurrency(dashboardData.purchaseOrders?.totalValue || 0)}
            icon={DollarSign}
            iconColor="text-emerald-600"
          />
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {/* Status Breakdown */}
        {(isAdmin || isProcurement) && dashboardData.statusBreakdown && (
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-soft border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
              Purchase Requests Status
            </h3>
            <div className="space-y-2">
              {dashboardData.statusBreakdown.purchaseRequests?.map((item: StatusCard) => (
                <div key={item.status} className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700">
                  <span className="text-sm text-gray-700 dark:text-gray-300">{item.status}</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                    {item.count}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Attention Required */}
        {(isAdmin || isApprover) && dashboardData.alerts && (
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-soft border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
              <AlertTriangle size={20} className="text-orange-600" />
              Attention Required
            </h3>
            <div className="space-y-3">
              {dashboardData.alerts.pendingPRs?.slice(0, 3).map((item: AlertItem) => (
                <div key={item.id} className="flex items-center justify-between p-3 rounded-lg bg-orange-50 dark:bg-orange-900/20">
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      PR {item.document_number}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Pending {'>'} 2 days
                    </p>
                  </div>
                  <Clock size={16} className="text-orange-600" />
                </div>
              ))}
              {dashboardData.alerts.pendingPOs?.slice(0, 2).map((item: AlertItem) => (
                <div key={item.id} className="flex items-center justify-between p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20">
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      PO {item.document_number}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Pending approval
                    </p>
                  </div>
                  <AlertCircle size={16} className="text-blue-600" />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recent Activity */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-soft border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
            <TrendingUp size={20} className="text-primary-600" />
            Recent Activity
          </h3>
          <div className="space-y-3">
            {dashboardData.recentActivities?.slice(0, 5).map((activity: any, index: number) => (
              <div key={index} className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700">
                {getActivityIcon(activity.type)}
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    {activity.description}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {new Date(activity.timestamp).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Trends Section */}
      {(isAdmin || isFinance) && dashboardData.trends && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-soft border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
              PR vs PO (Last 30 Days)
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <p className="text-2xl font-bold text-blue-600">{dashboardData.trends.prVsPo?.pr_count || 0}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Purchase Requests</p>
              </div>
              <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <p className="text-2xl font-bold text-green-600">{dashboardData.trends.prVsPo?.po_count || 0}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Purchase Orders</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-soft border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
              Invoice Match Ratio
            </h3>
            <div className="grid grid-cols-3 gap-2">
              <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <p className="text-lg font-bold text-green-600">{dashboardData.trends.invoiceMatchRatio?.matched || 0}</p>
                <p className="text-xs text-gray-600 dark:text-gray-400">Matched</p>
              </div>
              <div className="text-center p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                <p className="text-lg font-bold text-red-600">{dashboardData.trends.invoiceMatchRatio?.unmatched || 0}</p>
                <p className="text-xs text-gray-600 dark:text-gray-400">Unmatched</p>
              </div>
              <div className="text-center p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                <p className="text-lg font-bold text-yellow-600">{dashboardData.trends.invoiceMatchRatio?.variance || 0}</p>
                <p className="text-xs text-gray-600 dark:text-gray-400">Variance</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};