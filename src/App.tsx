import React, { useEffect } from "react";
import { HashRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "./components/ThemeProvider";
import { useAuthStore } from "./store/authStore";
import { Layout } from "./components/layout/Layout";
import ModuleDashboard from "./components/ModuleDashboard";

// Pages
import { Login } from "./pages/Login";
import { Dashboard } from "./pages/Dashboard";
import { Vendors } from "./pages/Vendors";
import { Products } from "./pages/Products";
import { PurchaseOrders } from "./pages/PurchaseOrders";
import { Inventory } from "./pages/Inventory";
import { Reports } from "./pages/Reports";
import { Settings } from "./pages/Settings";
import { ComingSoon } from "./pages/ComingSoon";
import { Categories } from "./pages/masters/Categories";
import { Units } from "./pages/masters/Units";
import { Warehouses } from "./pages/masters/Warehouses";
import { VendorsMaster } from "./pages/masters/VendorsMaster";

// Protected Route Component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  return isAuthenticated ? <>{children}</> : <Navigate to="/" replace />;
};

// Public Route Component (redirect to dashboard if already logged in)
const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  return isAuthenticated ? (
    <Navigate to="/dashboard" replace />
  ) : (
    <>{children}</>
  );
};

function App() {
  const initializeAuth = useAuthStore(state => state.initializeAuth);

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  return (
    <HashRouter>
      <ThemeProvider>
        <Routes>
          {/* Public Routes */}
          <Route
            path="/"
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
          />

          {/* Main Dashboard - Module Selection */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <ModuleDashboard />
              </ProtectedRoute>
            }
          />

          {/* Procurement Module */}
          <Route
            path="/procurement/*"
            element={
              <ProtectedRoute>
                <Layout module="procurement">
                  <Routes>
                    <Route index element={<Dashboard />} />
                    <Route path="purchase-orders" element={<PurchaseOrders />} />
                    <Route path="vendors" element={<Vendors />} />
                    <Route path="reports" element={<Reports />} />
                  </Routes>
                </Layout>
              </ProtectedRoute>
            }
          />

          {/* Inventory Module */}
          <Route
            path="/inventory/*"
            element={
              <ProtectedRoute>
                <Layout module="inventory">
                  <Routes>
                    <Route index element={<Inventory />} />
                    <Route path="products" element={<Products />} />
                    <Route path="categories" element={<Categories />} />
                    <Route path="units" element={<Units />} />
                    <Route path="warehouses" element={<Warehouses />} />
                    <Route path="vendors" element={<VendorsMaster />} />
                  </Routes>
                </Layout>
              </ProtectedRoute>
            }
          />
          
          {/* Reports Module */}                            
          <Route
            path="/reports/*"
            element={
              <ProtectedRoute>
                <Layout module="reports">
                  <Routes>    
                    <Route index element={<Reports />} />
                  </Routes>
                </Layout>
              </ProtectedRoute>
            }
          />

          {/* Finance Module - Coming Soon */}
          <Route
            path="/finance/*"
            element={
              <ProtectedRoute>
                <Layout module="finance">
                  <div className="flex items-center justify-center h-64">
                    <div className="text-center">
                      <h2 className="text-2xl font-bold text-gray-900 mb-2">Finance Module</h2>
                      <p className="text-gray-600">Coming Soon...</p>
                    </div>
                  </div>
                </Layout>
              </ProtectedRoute>
            }
          />

          {/* Settings */}
          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <Layout module="settings">
                  <Settings />
                </Layout>
              </ProtectedRoute>
            }
          />

          {/* Coming Soon */}
          <Route
            path="/coming-soon"
            element={
              <ProtectedRoute>
                <ComingSoon />
              </ProtectedRoute>
            }
          />

          {/* Catch all - redirect to login */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </ThemeProvider>
    </HashRouter>
  );
}

export default App;
