import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { DashboardLayout } from "@/components/layout/DashboardLayout";

// Pages
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import CandidateManagement from "./pages/CandidateManagement";
import VoterManagement from "./pages/VoterManagement";
import DeviceManagement from "./pages/DeviceManagement";
import ElectionDetails from "./pages/ElectionDetails";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";
import { AdminAuthProvider } from "./contexts/AdminAuthContext";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AdminAuthProvider>
    <ThemeProvider>

      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<DashboardLayout />}>
              <Route index element={<Dashboard />} />
              <Route path="candidates" element={<CandidateManagement />} />
              <Route path="voters" element={<VoterManagement />} />
              <Route path="devices" element={<DeviceManagement />} />
              <Route path="elections" element={<ElectionDetails />} />
              <Route path="profile" element={<Profile />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>      
    </AdminAuthProvider>
  </QueryClientProvider>
);

export default App;
