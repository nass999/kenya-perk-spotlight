
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/auth';
import { Toaster } from '@/components/ui/toaster';

// Pages
import Index from './pages/Index';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import NotFound from './pages/NotFound';
import Unauthorized from './pages/Unauthorized';
import PricingPage from './pages/PricingPage';
import AuthCallback from './pages/AuthCallback';

// Dashboard Pages
import MyRedemptions from './pages/dashboard/MyRedemptions';
import VendorRecommendations from './pages/dashboard/VendorRecommendations';
import ManagePerks from './pages/dashboard/ManagePerks';
import ManageUsers from './pages/dashboard/ManageUsers';
import ManageVendors from './pages/dashboard/ManageVendors';
import Analytics from './pages/dashboard/Analytics';

// Components
import DashboardLayout from './components/DashboardLayout';
import ProtectedRoute from './components/ProtectedRoute';
import { UserRole } from './lib/supabase';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/pricing" element={<PricingPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/auth/callback" element={<AuthCallback />} />
            <Route path="/unauthorized" element={<Unauthorized />} />
            
            {/* Protected Routes - All require authentication */}
            <Route element={<ProtectedRoute />}>
              <Route path="/dashboard" element={<DashboardLayout />}>
                <Route index element={<Dashboard />} />
                
                {/* Employee Routes */}
                <Route path="my-redemptions" element={<MyRedemptions />} />
                <Route path="vendor-recommendations" element={<VendorRecommendations />} />
                
                {/* Admin Routes */}
                <Route path="manage-perks" element={
                  <ProtectedRoute allowedRoles={['master_admin', 'company_admin', 'employee'] as UserRole[]}>
                    <ManagePerks />
                  </ProtectedRoute>
                } />
                <Route path="manage-users" element={
                  <ProtectedRoute allowedRoles={['master_admin', 'company_admin'] as UserRole[]}>
                    <ManageUsers />
                  </ProtectedRoute>
                } />
                <Route path="manage-vendors" element={
                  <ProtectedRoute allowedRoles={['master_admin'] as UserRole[]}>
                    <ManageVendors />
                  </ProtectedRoute>
                } />
                <Route path="analytics" element={
                  <ProtectedRoute allowedRoles={['master_admin', 'company_admin'] as UserRole[]}>
                    <Analytics />
                  </ProtectedRoute>
                } />
              </Route>
            </Route>
            
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Toaster />
        </AuthProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
