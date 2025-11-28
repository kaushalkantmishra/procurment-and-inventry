import React, { useState } from "react";
import { Search, Sun, Moon, Bell, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useStore } from "../../store/useStore";
import { useTheme } from "../ThemeProvider";

export const Topbar: React.FC = () => {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const logout = useStore((state) => state.logout);
  const user = useStore((state) => state.user);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="h-16 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between px-6">
      {/* Search */}
      <div className="flex-1 max-w-2xl">
        <div className="relative">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            size={18}
          />
          <input
            type="text"
            placeholder="Search products, vendors, orders..."
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-4 ml-6">
        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400 transition-colors"
          title={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
        >
          {theme === "light" ? <Moon size={20} /> : <Sun size={20} />}
        </button>

        {/* Notifications */}
        <button className="relative p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400 transition-colors">
          <Bell size={20} />
          <span className="absolute top-1 right-1 w-2 h-2 bg-danger-500 rounded-full"></span>
        </button>

        {/* Profile Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center text-white text-sm font-semibold">
              {user?.name?.charAt(0) || "A"}
            </div>
          </button>

          {showProfileMenu && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setShowProfileMenu(false)}
              />
              <div className="absolute right-0 top-full mt-2 w-56 bg-white dark:bg-gray-800 rounded-lg shadow-soft-lg border border-gray-200 dark:border-gray-700 z-20 animate-scale-in">
                <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    {user?.name || "Admin User"}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {user?.email || "admin@procuredesk.com"}
                  </p>
                </div>
                <div className="p-2">
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-danger-50 dark:hover:bg-danger-900/20 text-danger-600 dark:text-danger-400 transition-colors text-sm"
                  >
                    <LogOut size={16} />
                    <span>Logout</span>
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
};
