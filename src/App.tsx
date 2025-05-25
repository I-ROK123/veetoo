import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// Pages
import LoginPage from './pages/auth/LoginPage';
import SalespersonDashboard from './pages/dashboard/SalespersonDashboard';
import SupervisorDashboard from './pages/dashboard/SupervisorDashboard';
import CEODashboard from './pages/dashboard/CEODashboard';

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