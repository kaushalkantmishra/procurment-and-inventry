import React from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Warehouse,
  BarChart3,
  Settings,
  ChevronLeft,
  ChevronRight,
  Database,
  Tag,
  Ruler,
} from "lucide-react";
import { useStore } from "../../store/useStore";
import { clsx } from "clsx";

const navItems = [
  { path: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { path: "/vendors", label: "Vendors", icon: Users },
  { path: "/products", label: "Products", icon: Package },
  { path: "/purchase-orders", label: "Purchase Orders", icon: ShoppingCart },
  { path: "/inventory", label: "Inventory", icon: Warehouse },
  { path: "/reports", label: "Reports", icon: BarChart3 },
  { path: "/settings", label: "Settings", icon: Settings },
];

const masterItems = [
  { path: "/masters/categories", label: "Categories", icon: Tag },
  { path: "/masters/units", label: "Units", icon: Ruler },
  { path: "/masters/warehouses", label: "Warehouses", icon: Warehouse },
];

export const Sidebar: React.FC = () => {
  const sidebarCollapsed = useStore((state) => state.sidebarCollapsed);
  const toggleSidebar = useStore((state) => state.toggleSidebar);

  return (
    <aside
      className={clsx(
        "bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-all duration-300 flex flex-col",
        sidebarCollapsed ? "w-20" : "w-64"
      )}
    >
      {/* Logo */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-gray-200 dark:border-gray-700">
        {!sidebarCollapsed && (
          <h1 className="text-xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
            ProcureDesk
          </h1>
        )}
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400 transition-colors ml-auto"
        >
          {sidebarCollapsed ? (
            <ChevronRight size={20} />
          ) : (
            <ChevronLeft size={20} />
          )}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              clsx(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200",
                "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700",
                isActive &&
                  "bg-gradient-to-r from-primary-500 to-primary-600 text-white hover:from-primary-600 hover:to-primary-700 shadow-md",
                sidebarCollapsed && "justify-center"
              )
            }
          >
            <item.icon size={20} />
            {!sidebarCollapsed && (
              <span className="font-medium text-sm">{item.label}</span>
            )}
          </NavLink>
        ))}
        
        {/* Masters Section */}
        {!sidebarCollapsed && (
          <div className="pt-4">
            <div className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              <Database size={16} />
              Masters
            </div>
            {masterItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  clsx(
                    "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200",
                    "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700",
                    isActive &&
                      "bg-gradient-to-r from-primary-500 to-primary-600 text-white hover:from-primary-600 hover:to-primary-700 shadow-md"
                  )
                }
              >
                <item.icon size={18} />
                <span className="font-medium text-sm">{item.label}</span>
              </NavLink>
            ))}
          </div>
        )}
      </nav>

      {/* User Info */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <div
          className={clsx(
            "flex items-center gap-3",
            sidebarCollapsed && "justify-center"
          )}
        >
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center text-white font-semibold">
            A
          </div>
          {!sidebarCollapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                Admin User
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                Administrator
              </p>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};
