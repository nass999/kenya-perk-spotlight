import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
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
import BrowsePerks from './pages/dashboard/BrowsePerks';
import MyRedemptions from './pages/dashboard/MyRedemptions';
import VendorRecommendations from './pages/dashboard/VendorRecommendations';
import ManagePerks from './pages/dashboard/ManagePerks';
import ManageUsers from './pages/dashboard/ManageUsers'; // Import the new page

// Components
import DashboardLayout from './components/DashboardLayout';
import ProtectedRoute from './components/ProtectedRoute';

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
            
            {/* Protected Routes */}
            <Route element={<ProtectedRoute />}>
              <Route path="/dashboard" element={<DashboardLayout />}>
                <Route index element={<Dashboard />} />
                <Route path="browse-perks" element={<BrowsePerks />} />
                <Route path="my-redemptions" element={<MyRedemptions />} />
                <Route path="vendor-recommendations" element={<VendorRecommendations />} />
                
                {/* Admin Routes - Add the new route for user management */}
                <Route path="manage-perks" element={<ManagePerks />} />
                <Route path="manage-users" element={<ManageUsers />} />
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
