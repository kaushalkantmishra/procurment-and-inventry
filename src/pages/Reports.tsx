import React from "react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { products } from "../data/products";
import { vendors } from "../data/vendors";
import { purchaseOrders } from "../data/purchaseOrders";
import { TrendingUp, Package, Users } from "lucide-react";

export const Reports: React.FC = () => {
  // Inventory trend data (dummy monthly data)
  const inventoryTrendData = [
    { month: "Jan", value: 125000 },
    { month: "Feb", value: 132000 },
    { month: "Mar", value: 128000 },
    { month: "Apr", value: 145000 },
    { month: "May", value: 138000 },
    { month: "Jun", value: 152000 },
  ];

  // Category distribution
  const categoryData = products.reduce((acc, product) => {
    const existing = acc.find((item) => item.name === product.category);
    if (existing) {
      existing.value += 1;
    } else {
      acc.push({ name: product.category, value: 1 });
    }
    return acc;
  }, [] as { name: string; value: number }[]);

  // Vendor performance (dummy data based on POs)
  const vendorPerformance = vendors.slice(0, 5).map((vendor) => {
    const vendorPOs = purchaseOrders.filter((po) => po.vendorId === vendor.id);
    const totalAmount = vendorPOs.reduce((sum, po) => sum + po.totalAmount, 0);
    return {
      name: vendor.name,
      amount: totalAmount,
      orders: vendorPOs.length,
    };
  });

  const COLORS = [
    "#0ea5e9",
    "#d946ef",
    "#22c55e",
    "#f59e0b",
    "#ef4444",
    "#8b5cf6",
    "#06b6d4",
    "#ec4899",
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          Reports & Analytics
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Visualize your procurement and inventory data
        </p>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Inventory Value Trend */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-soft border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-lg bg-primary-100 dark:bg-primary-900/30">
              <TrendingUp size={24} className="text-primary-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Inventory Value Trend
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Last 6 months
              </p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={inventoryTrendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="month" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#fff",
                  border: "1px solid #e5e7eb",
                  borderRadius: "8px",
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="value"
                name="Inventory Value ($)"
                stroke="#0ea5e9"
                strokeWidth={3}
                dot={{ fill: "#0ea5e9", strokeWidth: 2, r: 5 }}
                activeDot={{ r: 7 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Category Distribution */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-soft border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-lg bg-secondary-100 dark:bg-secondary-900/30">
              <Package size={24} className="text-secondary-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Product Category Distribution
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                By product count
              </p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) =>
                  `${name} ${(percent * 100).toFixed(0)}%`
                }
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {categoryData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Vendor Performance */}
        <div className="xl:col-span-2 bg-white dark:bg-gray-800 rounded-xl p-6 shadow-soft border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-lg bg-success-100 dark:bg-success-900/30">
              <Users size={24} className="text-success-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Top Vendor Performance
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                By total purchase amount
              </p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={vendorPerformance}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="name" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#fff",
                  border: "1px solid #e5e7eb",
                  borderRadius: "8px",
                }}
              />
              <Legend />
              <Bar
                dataKey="amount"
                name="Total Amount ($)"
                fill="#0ea5e9"
                radius={[8, 8, 0, 0]}
              />
              <Bar
                dataKey="orders"
                name="Number of Orders"
                fill="#d946ef"
                radius={[8, 8, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
