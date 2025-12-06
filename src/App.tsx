
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './contexts/auth';
import { Toaster } from '@/components/ui/toaster';

// Import our admin extension early to ensure it's initialized
import '@/lib/supabase-admin';

// Pages
import Index from './pages/Index';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import NotFound from './pages/NotFound';
import Unauthorized from './pages/Unauthorized';

import AuthCallback from './pages/AuthCallback';
import VendorInquiry from './pages/VendorInquiry';
import VendorApplication from './pages/VendorApplication';
import CompanyInquiry from './pages/CompanyInquiry';
import TestCredentials from './pages/TestCredentials';

// Dashboard Pages
import MyRedemptions from './pages/dashboard/MyRedemptions';
import VendorRecommendations from './pages/dashboard/VendorRecommendations';
import ManagePerks from './pages/dashboard/ManagePerks';
import ManageUsers from './pages/dashboard/ManageUsers';
import ManageVendors from './pages/dashboard/ManageVendors';
import Analytics from './pages/dashboard/Analytics';
import VendorProfile from './pages/dashboard/VendorProfile';
import VendorPerks from './pages/dashboard/VendorPerks';
import CompanyUserDatabase from './pages/dashboard/CompanyUserDatabase';
import TestDataGeneratorPage from './pages/dashboard/TestDataGenerator';

// Components
import DashboardLayout from './components/DashboardLayout';
import ProtectedRoute from './components/ProtectedRoute';
import { UserRole } from './lib/supabase';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries:{
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 1,
    },
  },
});

function App() {
  return (
    <div className="App">
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <AuthProvider>
            <Routes>
              <Route path="/" element={<Index />} />
              
              <Route path="/vendor-inquiry" element={<VendorInquiry />} />
              <Route path="/vendor-application" element={<VendorApplication />} />
              <Route path="/company-inquiry" element={<CompanyInquiry />} />
              <Route path="/test-credentials" element={<TestCredentials />} />
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
                  <Route path="company-user-database" element={
                    <ProtectedRoute allowedRoles={['master_admin'] as UserRole[]}>
                      <CompanyUserDatabase />
                    </ProtectedRoute>
                  } />
                  <Route path="test-data-generator" element={
                    <ProtectedRoute allowedRoles={['master_admin'] as UserRole[]}>
                      <TestDataGeneratorPage />
                    </ProtectedRoute>
                  } />
                  
                  {/* Vendor Routes */}
                  <Route path="vendor-profile" element={
                    <ProtectedRoute allowedRoles={['vendor'] as UserRole[]}>
                      <VendorProfile />
                    </ProtectedRoute>
                  } />
                  <Route path="vendor-perks" element={
                    <ProtectedRoute allowedRoles={['vendor'] as UserRole[]}>
                      <VendorPerks />
                    </ProtectedRoute>
                  } />
                </Route>
              </Route>
              
              <Route path="*" element={<NotFound />} />
            </Routes>
            <Toaster />
          </AuthProvider>
        </BrowserRouter>
      </QueryClientProvider>
    </div>
  );
}

export default App;
