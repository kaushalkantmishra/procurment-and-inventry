import React from "react";
import { HashRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "./components/ThemeProvider";
import { useStore } from "./store/useStore";
import { Layout } from "./components/layout/Layout";

// Pages
import { Login } from "./pages/Login";
import { Dashboard } from "./pages/Dashboard";
import { Vendors } from "./pages/Vendors";
import { Products } from "./pages/Products";
import { PurchaseOrders } from "./pages/PurchaseOrders";
import { Inventory } from "./pages/Inventory";
import { Reports } from "./pages/Reports";
import { Settings } from "./pages/Settings";
import { Categories } from "./pages/masters/Categories";
import { Units } from "./pages/masters/Units";
import { Warehouses } from "./pages/masters/Warehouses";

// Protected Route Component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const isAuthenticated = useStore((state) => state.isAuthenticated);
  return isAuthenticated ? <>{children}</> : <Navigate to="/" replace />;
};

// Public Route Component (redirect to dashboard if already logged in)
const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const isAuthenticated = useStore((state) => state.isAuthenticated);
  return isAuthenticated ? (
    <Navigate to="/dashboard" replace />
  ) : (
    <>{children}</>
  );
};

function App() {
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

          {/* Protected Routes with Layout */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Layout>
                  <Dashboard />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/vendors"
            element={
              <ProtectedRoute>
                <Layout>
                  <Vendors />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/products"
            element={
              <ProtectedRoute>
                <Layout>
                  <Products />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/purchase-orders"
            element={
              <ProtectedRoute>
                <Layout>
                  <PurchaseOrders />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/inventory"
            element={
              <ProtectedRoute>
                <Layout>
                  <Inventory />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/reports"
            element={
              <ProtectedRoute>
                <Layout>
                  <Reports />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <Layout>
                  <Settings />
                </Layout>
              </ProtectedRoute>
            }
          />
          
          {/* Master Pages */}
          <Route
            path="/masters/categories"
            element={
              <ProtectedRoute>
                <Layout>
                  <Categories />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/masters/units"
            element={
              <ProtectedRoute>
                <Layout>
                  <Units />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/masters/warehouses"
            element={
              <ProtectedRoute>
                <Layout>
                  <Warehouses />
                </Layout>
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
