import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { LogIn, Package, Sun, Moon } from "lucide-react";
import { useAuthStore } from "../store/authStore";
import { useTheme } from "../components/ThemeProvider";
import { Input } from "../components/ui/Input";
import { Button } from "../components/ui/Button";

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login, isAuthenticated, isLoading } = useAuthStore();
  const { theme, toggleTheme } = useTheme();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // Redirect to dashboard when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please enter both email and password");
      return;
    }

    const result = await login(email, password);

    if (!result.success) {
      setError(result.message || "Login failed");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex flex-col">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-12">
            <div className="flex items-center">
              <Package
                className="text-primary-600 dark:text-primary-400 mr-3"
                size={32}
              />
              <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                ERP Desk
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Enterprise Resource Planning
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleTheme}
                className="flex items-center p-2 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                {theme === "light" ? (
                  <Moon
                    size={20}
                    className="text-gray-600 dark:text-gray-300"
                  />
                ) : (
                  <Sun size={20} className="text-gray-600 dark:text-gray-300" />
                )}
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex">
        {/* Left Side - Login Form */}
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="w-full max-w-md">
            {/* Logo & Title */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-600 rounded-2xl shadow-lg mb-4">
                <Package className="text-white" size={32} />
              </div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                Welcome Back
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Sign in to your ERP Desk account
              </p>
            </div>

            {/* Login Card */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                <Input
                  type="email"
                  label="Email Address"
                  placeholder="admin@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />

                <Input
                  type="password"
                  label="Password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />

                {error && (
                  <div className="text-red-600 text-sm text-center bg-red-50 p-3 rounded-lg border border-red-200">
                    {error}
                  </div>
                )}

                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  className="w-full"
                  isLoading={isLoading}
                  disabled={isLoading}
                >
                  <LogIn size={20} className="mr-2" />
                  {isLoading ? "Signing In..." : "Sign In"}
                </Button>
              </form>

              <div className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
                <p className="mb-2 font-medium">Demo Credentials:</p>
                <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg text-xs">
                  <p className="mb-1">
                    <strong>Admin:</strong> admin@company.com / admin123
                  </p>
                  <p>
                    <strong>Employee:</strong> employee@company.com /
                    employee123
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Branding */}
        <div className="flex-1 flex items-center justify-center p-8 relative overflow-hidden">
          {/* Branding Content */}
          <div className="relative z-10 text-center text-gray-900 dark:text-gray-100 max-w-lg">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-primary-100 dark:bg-primary-900/30 rounded-3xl shadow-2xl mb-8">
              <Package
                className="text-primary-600 dark:text-primary-400"
                size={48}
              />
            </div>

            <h1 className="text-5xl font-bold mb-4">ERP Desk</h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
              Complete Enterprise Resource Planning Solution
            </p>

            <div className="grid grid-cols-2 gap-6 text-center">
              <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="text-2xl font-bold mb-1">💰</div>
                <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Financial Management
                </div>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="text-2xl font-bold mb-1">👥</div>
                <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Human Resources
                </div>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="text-2xl font-bold mb-1">🛒</div>
                <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Procurement
                </div>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="text-2xl font-bold mb-1">📦</div>
                <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Inventory
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white dark:bg-gray-800 shadow-sm border-t border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-12">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              © 2026 ERP Desk. All rights reserved.
            </p>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Version 1.0.0
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
