import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// Pages
import LoginPage from './pages/auth/LoginPage';
import SalespersonDashboard from './pages/dashboard/SalespersonDashboard';
import SupervisorDashboard from './pages/dashboard/SupervisorDashboard';
import CEODashboard from './pages/dashboard/CEODashboard';
import StoreManagementPage from './pages/stores/StoreManagementPage';
import MultiStoreInventoryPage from './pages/inventory/MultiStoreInventoryPage';
import ReconciliationPage from './pages/reconciliation/ReconciliationPage';
import InvoicesPage from './pages/invoices/InvoicesPage';
import TeamPage from './pages/team/TeamPage';
import BankingPage from './pages/banking/BankingPage';
import DebtPage from './pages/debt/DebtPage';
import ReportsPage from './pages/reports/ReportsPage';
import SettingsPage from './pages/settings/SettingsPage';

// Components
import ProtectedRoute from './components/auth/ProtectedRoute';

// Hooks
import { useAuthStore } from './hooks/useAuthStore';
import { useThemeStore } from './hooks/useThemeStore';

const App: React.FC = () => {
  const { isAuthenticated, userRole } = useAuthStore();
  const { theme, initTheme } = useThemeStore();

  useEffect(() => {
    // Initialize theme from localStorage
    initTheme();
  }, [initTheme]);

  useEffect(() => {
    // Apply theme class to document element
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: theme === 'dark' ? '#1E293B' : '#FFFFFF',
            color: theme === 'dark' ? '#FFFFFF' : '#0F172A',
          },
        }}
      />
      <Routes>
        <Route path="/login" element={!isAuthenticated ? <LoginPage /> : <Navigate to="/dashboard" />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              {userRole === 'salesperson' && <SalespersonDashboard />}
              {userRole === 'supervisor' && <SupervisorDashboard />}
              {userRole === 'ceo' && <CEODashboard />}
            </ProtectedRoute>
          }
        />

        {/* Store Management - CEO/Supervisor only */}
        <Route
          path="/stores"
          element={
            <ProtectedRoute allowedRoles={['ceo', 'supervisor']}>
              <StoreManagementPage />
            </ProtectedRoute>
          }
        />

        {/* Multi-Store Inventory - All roles */}
        <Route
          path="/inventory"
          element={
            <ProtectedRoute>
              <MultiStoreInventoryPage />
            </ProtectedRoute>
          }
        />

        {/* New Pages - Role access to be refined later */}
        <Route
          path="/invoices"
          element={
            <ProtectedRoute>
              <InvoicesPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/team"
          element={
            <ProtectedRoute allowedRoles={['ceo', 'supervisor']}>
              <TeamPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/banking"
          element={
            <ProtectedRoute allowedRoles={['ceo', 'supervisor']}>
              <BankingPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/debt"
          element={
            <ProtectedRoute>
              <DebtPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/reports"
          element={
            <ProtectedRoute allowedRoles={['ceo', 'supervisor']}>
              <ReportsPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <SettingsPage />
            </ProtectedRoute>
          }
        />

        {/* Alias for store/stores mismatch */}
        <Route path="/store" element={<Navigate to="/stores" />} />

        {/* Invoice Reconciliation - CEO/Supervisor only */}
        <Route
          path="/reconciliation"
          element={
            <ProtectedRoute allowedRoles={['ceo', 'supervisor']}>
              <ReconciliationPage />
            </ProtectedRoute>
          }
        />

        {/* Redirect based on role */}
        <Route
          path="/"
          element={
            isAuthenticated ? (
              <Navigate to="/dashboard" />
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        {/* 404 route */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
};

export default App;