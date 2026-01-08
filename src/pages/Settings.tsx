import React, { useState, useEffect } from "react";
import { Sun, Moon, User, Bell, Lock, Globe, Users, Settings as SettingsIcon, Mail, Database, Shield } from "lucide-react";
import { useTheme } from "../components/ThemeProvider";
import { useAuthStore } from "../store/authStore";
import { apiService } from "../services/api";
import { Input } from "../components/ui/Input";
import { Select } from "../components/ui/Select";
import { Button } from "../components/ui/Button";

interface Role {
  id: number;
  role_code: string;
  role_name: string;
  description: string;
}

interface UserData {
  id: string;
  name: string;
  email: string;
  is_active: boolean;
  created_at: string;
}

export const Settings: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState<UserData[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [selectedUser, setSelectedUser] = useState<string>("");
  const [selectedRoles, setSelectedRoles] = useState<number[]>([]);
  const [profileData, setProfileData] = useState({ name: "", email: "" });
  const [passwordData, setPasswordData] = useState({ current: "", new: "", confirm: "" });
  const [message, setMessage] = useState("");

  const isAdmin = user?.roles?.includes("ADMIN");

  useEffect(() => {
    if (user) {
      setProfileData({ name: user.name, email: user.email });
    }
    if (isAdmin) {
      loadAdminData();
    }
  }, [user, isAdmin]);

  const loadAdminData = async () => {
    try {
      const [usersRes, rolesRes] = await Promise.all([
        apiService.getAllUsers(),
        apiService.getAllRoles()
      ]);
      setUsers(usersRes.data || []);
      setRoles(rolesRes.data || []);
    } catch (error) {
      console.error('Failed to load admin data:', error);
    }
  };

  const handleAssignRoles = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser || selectedRoles.length === 0) return;
    
    setLoading(true);
    try {
      await apiService.assignRoles(selectedUser, selectedRoles, selectedRoles[0]);
      setMessage("Roles assigned successfully");
      setSelectedUser("");
      setSelectedRoles([]);
    } catch (error: any) {
      setMessage(error.message || "Failed to assign roles");
    }
    setLoading(false);
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await apiService.updateProfile(profileData);
      setMessage("Profile updated successfully");
    } catch (error: any) {
      setMessage(error.message || "Failed to update profile");
    }
    setLoading(false);
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordData.new !== passwordData.confirm) {
      setMessage("New passwords don't match");
      return;
    }
    
    setLoading(true);
    try {
      await apiService.changePassword(passwordData.current, passwordData.new);
      setMessage("Password changed successfully");
      setPasswordData({ current: "", new: "", confirm: "" });
    } catch (error: any) {
      setMessage(error.message || "Failed to change password");
    }
    setLoading(false);
  };

  const handleUserSelection = async (userId: string) => {
    setSelectedUser(userId);
    if (userId) {
      try {
        const userRoles = await apiService.getUserRoles(userId);
        const roleIds = userRoles.data?.map((role: any) => role.role_id) || [];
        setSelectedRoles(roleIds);
      } catch (error) {
        console.error('Failed to load user roles:', error);
        setSelectedRoles([]);
      }
    } else {
      setSelectedRoles([]);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          Settings
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Manage your application preferences and system settings
        </p>
      </div>

      {message && (
        <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded-lg">
          {message}
        </div>
      )}

      {/* Settings Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
          <form onSubmit={handleUpdateProfile} className="space-y-4">
            <Input
              label="Full Name"
              placeholder="Your name"
              value={profileData.name}
              onChange={(e) => setProfileData(prev => ({ ...prev, name: e.target.value }))}
            />
            <Input
              type="email"
              label="Email Address"
              placeholder="your@email.com"
              value={profileData.email}
              onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
            />
            <Input
              label="Roles"
              value={user?.roles?.join(", ") || ""}
              disabled
            />
            <Button type="submit" variant="primary" isLoading={loading}>
              Update Profile
            </Button>
          </form>
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
                Change your password
              </p>
            </div>
          </div>
          <form onSubmit={handleChangePassword} className="space-y-4">
            <Input
              type="password"
              label="Current Password"
              placeholder="••••••••"
              value={passwordData.current}
              onChange={(e) => setPasswordData(prev => ({ ...prev, current: e.target.value }))}
            />
            <Input
              type="password"
              label="New Password"
              placeholder="••••••••"
              value={passwordData.new}
              onChange={(e) => setPasswordData(prev => ({ ...prev, new: e.target.value }))}
            />
            <Input
              type="password"
              label="Confirm New Password"
              placeholder="••••••••"
              value={passwordData.confirm}
              onChange={(e) => setPasswordData(prev => ({ ...prev, confirm: e.target.value }))}
            />
            <Button type="submit" variant="danger" isLoading={loading}>
              Change Password
            </Button>
          </form>
        </div>

        {/* Admin: Role Assignment */}
        {isAdmin && (
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-soft border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/30">
                <Users size={24} className="text-purple-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  Role Assignment
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Assign roles to users
                </p>
              </div>
            </div>
            <form onSubmit={handleAssignRoles} className="space-y-4">
              <Select
                label="Select User"
                value={selectedUser}
                onChange={(e) => handleUserSelection(e.target.value)}
                options={[
                  { value: "", label: "Choose a user..." },
                  ...users.map(u => ({ value: u.id, label: `${u.name} (${u.email})` }))
                ]}
              />
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Select Roles
                </label>
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {roles.map(role => (
                    <label key={role.id} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={selectedRoles.includes(role.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedRoles(prev => [...prev, role.id]);
                          } else {
                            setSelectedRoles(prev => prev.filter(id => id !== role.id));
                          }
                        }}
                        className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                      />
                      <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                        {role.role_name}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
              <Button type="submit" variant="primary" isLoading={loading}>
                Assign Roles
              </Button>
            </form>
          </div>
        )}

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
          </div>
        </div>

        {/* System Settings */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-soft border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-lg bg-indigo-100 dark:bg-indigo-900/30">
              <SettingsIcon size={24} className="text-indigo-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                System Settings
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                ERP system configurations
              </p>
            </div>
          </div>
          <div className="space-y-4">
            <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-1">
                Auto-approve POs under $1000
              </p>
              <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                Automatically approve purchase orders below threshold
              </p>
              <input type="checkbox" className="rounded border-gray-300 text-primary-600 focus:ring-primary-500" />
            </div>
            <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-1">
                Stock reorder alerts
              </p>
              <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                Send alerts when stock reaches reorder level
              </p>
              <input type="checkbox" defaultChecked className="rounded border-gray-300 text-primary-600 focus:ring-primary-500" />
            </div>
          </div>
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
          </div>
        </div>

        {/* Email Settings */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-soft border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/30">
              <Mail size={24} className="text-green-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Email Settings
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Configure email notifications
              </p>
            </div>
          </div>
          <div className="space-y-4">
            <Input
              label="SMTP Server"
              placeholder="smtp.company.com"
              defaultValue="smtp.company.com"
              disabled
            />
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Port"
                placeholder="587"
                defaultValue="587"
                disabled
              />
              <Select
                label="Security"
                defaultValue="tls"
                options={[
                  { value: "tls", label: "TLS" },
                  { value: "ssl", label: "SSL" },
                  { value: "none", label: "None" }
                ]}
                disabled
              />
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Email configuration will be available in future updates
            </p>
          </div>
        </div>
      </div>

      {/* App Info */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-soft border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-1">
              ERP Desk
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Version 1.0.0 • Procurement & Inventory Management System
            </p>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <Database size={16} />
            <span>Connected to Backend API</span>
          </div>
        </div>
      </div>
    </div>
  );
};
