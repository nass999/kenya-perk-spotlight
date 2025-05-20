
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { UserRole } from '@/lib/supabase';

interface ProtectedRouteProps {
  allowedRoles?: UserRole[];
}

const ProtectedRoute = ({ allowedRoles }: ProtectedRouteProps) => {
  const { authState } = useAuth();
  const location = useLocation();
  
  // Debug logging to track auth state during routing
  console.log("ProtectedRoute check - Auth state:", 
    { loading: authState.loading, isAuthenticated: !!authState.user, 
      role: authState.user?.role, pathname: location.pathname });
  
  // Still loading auth state
  if (authState.loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-semibold mb-2">Loading...</h1>
          <p className="text-gray-500">Please wait</p>
        </div>
      </div>
    );
  }
  
  // Not authenticated
  if (!authState.user) {
    console.log("User not authenticated, redirecting to login from protected route");
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  // Check role-based access if roles are specified
  if (allowedRoles && !allowedRoles.includes(authState.user.role)) {
    console.log("User not authorized for this route, redirecting to unauthorized");
    return <Navigate to="/unauthorized" replace />;
  }
  
  // User is authenticated and authorized
  console.log("User authenticated and authorized, rendering protected content");
  return <Outlet />;
};

export default ProtectedRoute;
