import React from "react";
import { Sun, Moon, User, Bell, Lock, Globe } from "lucide-react";
import { useTheme } from "../components/ThemeProvider";
import { useStore } from "../store/useStore";
import { Input } from "../components/ui/Input";
import { Select } from "../components/ui/Select";
import { Button } from "../components/ui/Button";

export const Settings: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const user = useStore((state) => state.user);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          Settings
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Manage your application preferences
        </p>
      </div>

      {/* Settings Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Appearance */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-soft border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-lg bg-primary-100 dark:bg-primary-900/30">
              {theme === "light" ? (
                <Sun size={24} className="text-primary-600" />
              ) : (
                <Moon size={24} className="text-primary-600" />
              )}
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Appearance
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Customize the look and feel
              </p>
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div>
                <p className="font-medium text-gray-900 dark:text-gray-100">
                  Theme Mode
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Current: {theme === "light" ? "Light" : "Dark"}
                </p>
              </div>
              <button
                onClick={toggleTheme}
                className="relative inline-flex h-8 w-14 items-center rounded-full bg-primary-600 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
              >
                <span
                  className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                    theme === "dark" ? "translate-x-7" : "translate-x-1"
                  }`}
                />
              </button>
            </div>
            <Select
              label="Language"
              options={[
                { value: "en", label: "English" },
                { value: "es", label: "Spanish" },
                { value: "fr", label: "French" },
                { value: "de", label: "German" },
              ]}
              defaultValue="en"
            />
          </div>
        </div>

        {/* Profile Information */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-soft border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-lg bg-success-100 dark:bg-success-900/30">
              <User size={24} className="text-success-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Profile Information
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Update your account details
              </p>
            </div>
          </div>
          <form className="space-y-4">
            <Input
              label="Full Name"
              placeholder="Your name"
              defaultValue={user?.name || "Admin User"}
            />
            <Input
              type="email"
              label="Email Address"
              placeholder="your@email.com"
              defaultValue={user?.email || "admin@procuredesk.com"}
            />
            <Input
              label="Role"
              placeholder="Administrator"
              defaultValue={user?.role || "Administrator"}
              disabled
            />
            <Button type="submit" variant="primary">
              Update Profile
            </Button>
          </form>
        </div>

        {/* Notifications */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-soft border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-lg bg-warning-100 dark:bg-warning-900/30">
              <Bell size={24} className="text-warning-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Notifications
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Configure notification preferences
              </p>
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  Low Stock Alerts
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  Get notified when stock is low
                </p>
              </div>
              <input
                type="checkbox"
                defaultChecked
                className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  PO Approvals
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  Notify on purchase order approvals
                </p>
              </div>
              <input
                type="checkbox"
                defaultChecked
                className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  Email Notifications
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  Receive email updates
                </p>
              </div>
              <input
                type="checkbox"
                className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
            </div>
          </div>
        </div>

        {/* Security */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-soft border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-lg bg-danger-100 dark:bg-danger-900/30">
              <Lock size={24} className="text-danger-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Security
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Manage your security settings
              </p>
            </div>
          </div>
          <form className="space-y-4">
            <Input
              type="password"
              label="Current Password"
              placeholder="••••••••"
            />
            <Input
              type="password"
              label="New Password"
              placeholder="••••••••"
            />
            <Input
              type="password"
              label="Confirm New Password"
              placeholder="••••••••"
            />
            <Button type="submit" variant="danger">
              Change Password
            </Button>
          </form>
        </div>
      </div>

      {/* App Info */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-soft border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-1">
              ProcureDesk UI
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Version 1.0.0 • Procurement & Inventory Management System
            </p>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <Globe size={16} />
            <span>UI Demo Mode (No Backend)</span>
          </div>
        </div>
      </div>
    </div>
  );
};
