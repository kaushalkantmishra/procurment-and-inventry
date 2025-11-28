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
} from "lucide-react";
import { KPICard } from "../components/ui/KPICard";
import { Badge } from "../components/ui/Badge";
import { useStore } from "../store/useStore";
import { apiService } from "../services/api";

export const Dashboard: React.FC = () => {
  const { items, purchaseOrders, loading, fetchItems, fetchPurchaseOrders } = useStore();
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
  }, [fetchItems, fetchPurchaseOrders]);

  // Calculate KPIs from real data
  const lowStockItems = items.filter(
    (item) => item.safetyStock <= item.reorderLevel
  ).length;
  const totalVendors = 5; // Static for now
  const openPOs = purchaseOrders.filter(
    (po) => po.status === "Draft" || po.status === "Approved"
  ).length;
  const stockValue = items.reduce(
    (sum, item) => sum + parseFloat(item.sellingPrice || '0') * (item.safetyStock || 0),
    0
  );

  // Recent activity (dummy data)
  const recentActivity = [
    {
      id: 1,
      action: "New Purchase Order",
      description: "PO-2024-010 created for Office Essentials Inc.",
      time: "2 hours ago",
      type: "po",
    },
    {
      id: 2,
      action: "Low Stock Alert",
      description: "Safety Helmet stock below reorder level",
      time: "3 hours ago",
      type: "alert",
    },
    {
      id: 3,
      action: "Vendor Added",
      description: "Reliable Chemical Supplies added to vendor list",
      time: "5 hours ago",
      type: "vendor",
    },
    {
      id: 4,
      action: "Stock Received",
      description: "50 units of Laptop Computer received",
      time: "1 day ago",
      type: "stock",
    },
    {
      id: 5,
      action: "PO Approved",
      description: "PO-2024-008 approved by manager",
      time: "2 days ago",
      type: "po",
    },
  ];

  const getBadgeVariant = (type: string) => {
    switch (type) {
      case "po":
        return "info";
      case "alert":
        return "warning";
      case "vendor":
        return "success";
      case "stock":
        return "success";
      default:
        return "default";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          Dashboard
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Welcome back! Here's what's happening with your inventory.
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <KPICard
              title="Total Products"
              value={items.length}
              icon={Package}
              trend={{ value: 12, isPositive: true }}
              iconColor="text-primary-600"
            />
            <KPICard
              title="Low Stock Items"
              value={lowStockItems}
              icon={Package}
              trend={{ value: 12, isPositive: false }}
              iconColor="text-warning-600"
            />
            <KPICard
              title="Purchase Orders"
              value={purchaseOrders.length}
              icon={ShoppingCart}
              trend={{ value: 5, isPositive: true }}
              iconColor="text-success-600"
            />
            <KPICard
              title="Total Stock Value"
              value={`$${stockValue.toLocaleString("en-US", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}`}
              icon={DollarSign}
              trend={{ value: 15, isPositive: true }}
              iconColor="text-secondary-600"
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
