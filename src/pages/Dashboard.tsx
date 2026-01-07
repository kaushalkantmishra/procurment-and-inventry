import React, { useEffect, useState } from "react";
import {
  Package,
  Users,
  ShoppingCart,
  DollarSign,
  TrendingUp,
  Clock,
  Wifi,
  WifiOff,
  FileText,
  AlertTriangle,
} from "lucide-react";
import { KPICard } from "../components/ui/KPICard";
import { Badge } from "../components/ui/Badge";
import { useStore } from "../store/useStore";
import { apiService } from "../services/api";

export const Dashboard: React.FC = () => {
  const { 
    items, 
    purchaseOrders, 
    purchaseRequests, 
    grns, 
    vendorInvoices, 
    loading, 
    fetchItems, 
    fetchPurchaseOrders, 
    fetchPurchaseRequests, 
    fetchGRNs, 
    fetchVendorInvoices 
  } = useStore();
  const [apiStatus, setApiStatus] = useState<'connected' | 'disconnected' | 'checking'>('checking');

  useEffect(() => {
    // Check API connectivity
    const checkApiStatus = async () => {
      try {
        await apiService.healthCheck();
        setApiStatus('connected');
      } catch (error) {
        setApiStatus('disconnected');
      }
    };

    checkApiStatus();
    fetchItems();
    fetchPurchaseOrders();
    fetchPurchaseRequests();
    fetchGRNs();
    fetchVendorInvoices();
  }, [fetchItems, fetchPurchaseOrders, fetchPurchaseRequests, fetchGRNs, fetchVendorInvoices]);

  // Calculate KPIs from real procurement data
  const totalPRs = purchaseRequests.length;
  const pendingPRs = purchaseRequests.filter(
    (pr) => pr.status === "Saved" || pr.status === "Submitted"
  ).length;
  const openPOs = purchaseOrders.filter(
    (po) => po.status === "Draft" || po.status === "Approved"
  ).length;
  const pendingGRNs = grns.filter(
    (grn) => grn.inspection_status === "Pending"
  ).length;
  const pendingInvoices = vendorInvoices.filter(
    (inv) => inv.match_status === "UNMATCHED"
  ).length;
  const totalPOValue = purchaseOrders.reduce(
    (sum, po) => sum + parseFloat(po.total_amount || '0'),
    0
  );

  // Recent procurement activity
  const recentActivity = [
    ...purchaseRequests.slice(0, 2).map((pr) => ({
      id: `pr-${pr.id}`,
      action: "Purchase Request",
      description: `PR-${pr.id} ${pr.status.toLowerCase()} - ${pr.justification?.substring(0, 50)}...`,
      time: new Date(pr.created_at).toLocaleDateString(),
      type: "pr",
    })),
    ...purchaseOrders.slice(0, 2).map((po) => ({
      id: `po-${po.id}`,
      action: "Purchase Order",
      description: `${po.po_number} ${po.status.toLowerCase()} - ${po.supplier_id}`,
      time: new Date(po.created_at).toLocaleDateString(),
      type: "po",
    })),
    ...grns.slice(0, 1).map((grn) => ({
      id: `grn-${grn.id}`,
      action: "Goods Receipt",
      description: `${grn.grn_number} received from ${grn.supplier_id}`,
      time: new Date(grn.created_at).toLocaleDateString(),
      type: "grn",
    })),
  ].sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime()).slice(0, 5);

  const getBadgeVariant = (type: string) => {
    switch (type) {
      case "pr":
        return "info";
      case "po":
        return "success";
      case "grn":
        return "warning";
      case "invoice":
        return "danger";
      default:
        return "default";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          Procurement Dashboard
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Monitor your procurement operations and key metrics
        </p>
      </div>

      {/* API Status */}
      <div className="mb-6">
        <div className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium ${
          apiStatus === 'connected' 
            ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
            : apiStatus === 'disconnected'
            ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
            : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
        }`}>
          {apiStatus === 'connected' ? <Wifi size={16} /> : <WifiOff size={16} />}
          API Status: {apiStatus === 'connected' ? 'Connected' : apiStatus === 'disconnected' ? 'Disconnected' : 'Checking...'}
        </div>
      </div>

      {loading && (
        <div className="text-center py-8">
          <p className="text-gray-600 dark:text-gray-400">Loading dashboard data...</p>
        </div>
      )}

      {!loading && (
        <>
          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
            <KPICard
              title="Total PRs"
              value={totalPRs}
              icon={FileText}
              trend={{ value: 12, isPositive: true }}
              iconColor="text-blue-600"
            />
            <KPICard
              title="Pending PRs"
              value={pendingPRs}
              icon={AlertTriangle}
              trend={{ value: 5, isPositive: false }}
              iconColor="text-orange-600"
            />
            <KPICard
              title="Open POs"
              value={openPOs}
              icon={ShoppingCart}
              trend={{ value: 8, isPositive: true }}
              iconColor="text-green-600"
            />
            <KPICard
              title="Pending GRNs"
              value={pendingGRNs}
              icon={Package}
              trend={{ value: 3, isPositive: false }}
              iconColor="text-purple-600"
            />
            <KPICard
              title="Pending Invoices"
              value={pendingInvoices}
              icon={AlertTriangle}
              trend={{ value: 2, isPositive: false }}
              iconColor="text-red-600"
            />
            <KPICard
              title="PO Value"
              value={`$${totalPOValue.toLocaleString("en-US", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}`}
              icon={DollarSign}
              trend={{ value: 15, isPositive: true }}
              iconColor="text-emerald-600"
            />
          </div>
        </>
      )}

      {/* Quick Actions & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-soft border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
            <TrendingUp size={20} className="text-primary-600" />
            Quick Actions
          </h3>
          <div className="space-y-3">
            <button className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-left">
              <div className="w-10 h-10 rounded-lg bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
                <ShoppingCart size={20} className="text-primary-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  Create Purchase Order
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  New PO for vendor
                </p>
              </div>
            </button>
            <button className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-left">
              <div className="w-10 h-10 rounded-lg bg-success-100 dark:bg-success-900/30 flex items-center justify-center">
                <Package size={20} className="text-success-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  Add New Product
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Expand catalog
                </p>
              </div>
            </button>
            <button className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-left">
              <div className="w-10 h-10 rounded-lg bg-warning-100 dark:bg-warning-900/30 flex items-center justify-center">
                <Users size={20} className="text-warning-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  Add Vendor
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Register new supplier
                </p>
              </div>
            </button>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl p-6 shadow-soft border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
            <Clock size={20} className="text-primary-600" />
            Recent Activity
          </h3>
          <div className="space-y-4">
            {recentActivity.map((activity) => (
              <div
                key={activity.id}
                className="flex items-start gap-4 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <div className="w-2 h-2 mt-2 rounded-full bg-primary-500 flex-shrink-0"></div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        {activity.action}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {activity.description}
                      </p>
                    </div>
                    <Badge variant={getBadgeVariant(activity.type)}>
                      {activity.type}
                    </Badge>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                    {activity.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
