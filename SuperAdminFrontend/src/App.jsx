import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";
import { SuperAdminAuthContext } from "./context_api/SuperAdminAuthState";
import { ThemeProvider } from "./contexts/ThemeContext";
import { LoginPage } from "./components/auth/LoginPage";
import { DashboardLayout } from "./components/layout/DashboardLayout";
import Dashboard from "./pages/Dashboard";
import AdminManagement from "./pages/AdminManagement";
import ElectionManagement from "./pages/ElectionManagement";
import CandidateManagement from "./pages/CandidateManagement";
import ResultsDashboard from "./pages/ResultsDashboard";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import SuperAdminAuthState from "./context_api/SuperAdminAuthState";
import { useContext } from "react";
import SuperAdminDataState from "./context_api/SuperAdminDataState";
import SuperAdminLogState from "./context_api/SuperAdminLogState";

const queryClient = new QueryClient();

// ✅ Protected Route wrapper
const ProtectedRoute = () => {
  const { isAuthenticated } = useContext(SuperAdminAuthContext);

  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  return (
    <DashboardLayout>
      <Outlet />
    </DashboardLayout>
  );
};

// ✅ Public Route wrapper
const PublicRoute = ({ children }) => {
  const { isAuthenticated } = useContext(SuperAdminAuthContext);

  if (isAuthenticated()) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

const AppContent = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route
          path="/login"
          element={
            <PublicRoute>
              <LoginPage />
            </PublicRoute>
          }
        />

        {/* Protected Routes */}
        <Route path="/dashboard" element={<ProtectedRoute />}>
          <Route index element={<Dashboard />} />
          <Route path="admins" element={<AdminManagement />} />
          <Route path="elections" element={<ElectionManagement />} />
          <Route path="candidates" element={<CandidateManagement />} />
          <Route path="results" element={<ResultsDashboard />} />
          <Route path="settings" element={<Settings />} />
        </Route>

        {/* Root redirect */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* 404 Route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <SuperAdminAuthState>
      <SuperAdminDataState>
        <SuperAdminLogState>
        <ThemeProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <AppContent />
          </TooltipProvider>
        </ThemeProvider>
        </SuperAdminLogState>
      </SuperAdminDataState>
    </SuperAdminAuthState>
  </QueryClientProvider>
);

export default App;
