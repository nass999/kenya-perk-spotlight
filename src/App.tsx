
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import PricingPage from "./pages/PricingPage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AuthCallback from "./pages/AuthCallback";
import Dashboard from "./pages/Dashboard";
import DashboardLayout from "./components/DashboardLayout";
import ProtectedRoute from "./components/ProtectedRoute";
import Unauthorized from "./pages/Unauthorized";
import BrowsePerks from "./pages/dashboard/BrowsePerks";
import MyRedemptions from "./pages/dashboard/MyRedemptions";
import ManagePerks from "./pages/dashboard/ManagePerks";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Index />} />
            <Route path="/pricing" element={<PricingPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/auth/callback" element={<AuthCallback />} />
            <Route path="/unauthorized" element={<Unauthorized />} />
            
            {/* Protected routes for all authenticated users */}
            <Route element={<ProtectedRoute />}>
              <Route element={<DashboardLayout />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/dashboard/browse-perks" element={<BrowsePerks />} />
                <Route path="/dashboard/my-redemptions" element={<MyRedemptions />} />
              </Route>
            </Route>
            
            {/* Protected routes for master_admin and company_admin */}
            <Route element={<ProtectedRoute allowedRoles={['company_admin', 'master_admin']} />}>
              <Route element={<DashboardLayout />}>
                <Route path="/dashboard/perks" element={<ManagePerks />} />
              </Route>
            </Route>
            
            {/* Protected routes for master_admin only */}
            <Route element={<ProtectedRoute allowedRoles={['master_admin']} />}>
              <Route element={<DashboardLayout />}>
                {/* Add more master admin specific routes here */}
              </Route>
            </Route>
            
            {/* Catch-all route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
          
          {/* Quick access dashboard link */}
          <div className="fixed bottom-4 right-4 z-50">
            <Link 
              to="/dashboard" 
              className="bg-[#da7756] text-white px-4 py-2 rounded-full shadow-lg hover:bg-[#c56a4b] transition-colors"
            >
              Go to Dashboard
            </Link>
          </div>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
