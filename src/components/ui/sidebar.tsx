
import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  Gift as GiftIcon,
  TicketCheck,
  Star,
  Package,
  Users,
  Menu,
  X,
  Home,
  Store,
} from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useIsMobile } from '@/hooks/use-mobile';

interface SidebarLinkProps {
  to: string;
  active: boolean;
  children: React.ReactNode;
  onClick?: () => void;
}

const SidebarLink: React.FC<SidebarLinkProps> = ({ to, active, children, onClick }) => (
  <Link to={to} className={`flex items-center space-x-2 p-3 rounded-md hover:bg-gray-100 transition-colors duration-200 ${active ? 'bg-gray-100 font-semibold' : ''}`} onClick={onClick}>
    {children}
  </Link>
);

export function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { authState, signOut } = useAuth();
  const isMobile = useIsMobile();
  const [isOpen, setIsOpen] = useState(!isMobile);
  
  useEffect(() => {
    setIsOpen(!isMobile);
  }, [isMobile]);
  
  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };
  
  const userRole = authState.user?.role || 'employee';
  console.log("Current user role in sidebar:", userRole);
  
  const isAdmin = userRole === 'master_admin' || userRole === 'company_admin';
  const isMasterAdmin = userRole === 'master_admin';
  
  const closeOnMobile = () => {
    if (isMobile) {
      setIsOpen(false);
    }
  };
  
  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };
  
  return (
    <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 shadow-md transition-transform duration-300 transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} ${isMobile ? '' : 'translate-x-0'}`}>
      {/* Mobile Header */}
      {isMobile && (
        <div className="sticky top-0 z-50 bg-white border-b border-gray-200 h-16 flex items-center justify-between px-4">
          <span className="font-bold text-lg">Africa Rewards</span>
          <Button variant="ghost" size="icon" onClick={toggleSidebar}>
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>
      )}
      
      {/* Sidebar Content */}
      <div className="flex flex-col h-full">
        {/* Logo and Branding */}
        <div className="flex items-center justify-center h-16 border-b border-gray-200">
          <span className="font-bold text-lg">Africa Rewards</span>
        </div>
        
        {/* Navigation Links */}
        <nav className="space-y-1 mt-6 overflow-y-auto">
          {/* Home Link - Always visible */}
          <SidebarLink to="/" active={location.pathname === '/'} onClick={closeOnMobile}>
            <Home className="h-5 w-5 mr-3" />
            Main Page
          </SidebarLink>
          
          <SidebarLink to="/dashboard" active={location.pathname === '/dashboard'} onClick={closeOnMobile}>
            <LayoutDashboard className="h-5 w-5 mr-3" />
            Dashboard
          </SidebarLink>
          
          <SidebarLink to="/dashboard/browse-perks" active={location.pathname === '/dashboard/browse-perks'} onClick={closeOnMobile}>
            <GiftIcon className="h-5 w-5 mr-3" />
            Browse Perks
          </SidebarLink>
          
          {/* Only show My Redemptions for non-master admins */}
          {userRole !== 'master_admin' && (
            <SidebarLink to="/dashboard/my-redemptions" active={location.pathname === '/dashboard/my-redemptions'} onClick={closeOnMobile}>
              <TicketCheck className="h-5 w-5 mr-3" />
              My Redemptions
            </SidebarLink>
          )}
          
          <SidebarLink to="/dashboard/vendor-recommendations" active={location.pathname === '/dashboard/vendor-recommendations'} onClick={closeOnMobile}>
            <Star className="h-5 w-5 mr-3" />
            Recommend Vendors
          </SidebarLink>
          
          {/* Admin Links */}
          {isAdmin && (
            <>
              <div className="pt-4 pb-2">
                <div className="px-4">
                  <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Admin Actions
                  </h2>
                </div>
              </div>
              
              <SidebarLink to="/dashboard/manage-perks" active={location.pathname === '/dashboard/manage-perks'} onClick={closeOnMobile}>
                <Package className="h-5 w-5 mr-3" />
                Manage Perks
              </SidebarLink>
              
              <SidebarLink to="/dashboard/manage-users" active={location.pathname === '/dashboard/manage-users'} onClick={closeOnMobile}>
                <Users className="h-5 w-5 mr-3" />
                Manage Users
              </SidebarLink>
              
              {/* Only show vendor management to master admins */}
              {isMasterAdmin && (
                <SidebarLink to="/dashboard/manage-vendors" active={location.pathname.includes('/dashboard/manage-vendors')} onClick={closeOnMobile}>
                  <Store className="h-5 w-5 mr-3" />
                  Manage Vendors
                </SidebarLink>
              )}
            </>
          )}
        </nav>
        
        {/* User Profile Section */}
        <div className="mt-auto border-t border-gray-200 p-4">
          <div className="flex items-center space-x-4">
            <Avatar>
              <AvatarImage src="https://github.com/shadcn.png" alt="Avatar" />
              <AvatarFallback>{authState.user?.full_name?.charAt(0) || 'U'}</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-semibold">{authState.user?.full_name || 'User'}</p>
              <p className="text-xs text-gray-500">{authState.user?.email}</p>
            </div>
          </div>
          <Button variant="outline" className="w-full mt-4" onClick={handleSignOut}>
            Sign Out
          </Button>
        </div>
      </div>
    </div>
  );
}
