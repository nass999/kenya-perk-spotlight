
import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { 
  User, 
  LogOut, 
  Menu, 
  X, 
  Home, 
  ShoppingBag, 
  CreditCard,
  Users,
  BarChart,
  Settings,
  Bell
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Separator } from '@/components/ui/separator';

const DashboardLayout = () => {
  const { authState, signOut } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  const handleSignOut = () => {
    signOut();
  };
  
  const userInitials = authState.user?.full_name
    ? authState.user.full_name
        .split(' ')
        .map((name) => name[0])
        .join('')
        .toUpperCase()
    : 'U';
  
  const roleLabel = {
    master_admin: 'Platform Admin',
    company_admin: 'Company Admin',
    employee: 'Employee'
  }[authState.user?.role || 'employee'];
  
  // Navigation based on user role
  const navigation = [];
  
  if (authState.user?.role === 'master_admin') {
    navigation.push(
      { name: 'Dashboard', href: '/dashboard', icon: Home },
      { name: 'Companies', href: '/dashboard/companies', icon: Users },
      { name: 'All Perks', href: '/dashboard/all-perks', icon: ShoppingBag },
      { name: 'Analytics', href: '/dashboard/analytics', icon: BarChart },
      { name: 'Settings', href: '/dashboard/settings', icon: Settings }
    );
  } else if (authState.user?.role === 'company_admin') {
    navigation.push(
      { name: 'Dashboard', href: '/dashboard', icon: Home },
      { name: 'Manage Perks', href: '/dashboard/perks', icon: ShoppingBag },
      { name: 'Employees', href: '/dashboard/employees', icon: Users },
      { name: 'Company Analytics', href: '/dashboard/company-analytics', icon: BarChart },
      { name: 'Settings', href: '/dashboard/settings', icon: Settings }
    );
  } else {
    // Employee role
    navigation.push(
      { name: 'Dashboard', href: '/dashboard', icon: Home },
      { name: 'Browse Perks', href: '/dashboard/browse-perks', icon: ShoppingBag },
      { name: 'My Redemptions', href: '/dashboard/my-redemptions', icon: CreditCard },
      { name: 'Profile', href: '/dashboard/profile', icon: User }
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile menu button */}
      <div className="md:hidden fixed top-4 left-4 z-30">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="bg-white"
        >
          {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {/* Sidebar for mobile */}
      <div
        className={`fixed inset-0 z-20 transform transition-transform duration-300 ease-in-out md:hidden ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)}></div>
        <div className="relative flex h-full w-3/4 max-w-xs flex-col overflow-y-auto border-r border-gray-200 bg-white pt-5 pb-4">
          <div className="flex items-center justify-between px-4">
            <div className="flex items-center">
              <span className="font-bold text-xl text-[#da7756]">Africa<span className="text-black">rewards</span><span className="text-[#da7756]">network</span></span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
          <Separator className="my-4" />
          <nav className="mt-5 flex-1 space-y-1 px-2">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className="group flex items-center rounded-md px-2 py-2 text-base font-medium text-gray-600 hover:bg-gray-50 hover:text-[#da7756]"
                onClick={() => setSidebarOpen(false)}
              >
                <item.icon className="mr-4 h-5 w-5 flex-shrink-0 text-gray-500 group-hover:text-[#da7756]" />
                {item.name}
              </Link>
            ))}
          </nav>
          <div className="border-t border-gray-200 p-4">
            <div className="flex items-center">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-[#da7756] text-white">{userInitials}</AvatarFallback>
              </Avatar>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-700">{authState.user?.full_name}</p>
                <p className="text-xs text-gray-500">{roleLabel}</p>
              </div>
            </div>
            <Button variant="ghost" className="mt-3 w-full justify-start text-gray-500 hover:text-red-600" onClick={handleSignOut}>
              <LogOut className="mr-2 h-4 w-4" />
              Sign out
            </Button>
          </div>
        </div>
      </div>

      {/* Sidebar for desktop */}
      <div className="hidden md:fixed md:inset-y-0 md:flex md:w-64 md:flex-col">
        <div className="flex min-h-0 flex-1 flex-col border-r border-gray-200 bg-white">
          <div className="flex flex-shrink-0 flex-col items-center px-4 pt-5">
            <div className="flex items-center">
              <span className="font-bold text-xl text-[#da7756]">Africa<span className="text-black">rewards</span><span className="text-[#da7756]">network</span></span>
            </div>
          </div>
          <Separator className="my-4" />
          <div className="flex flex-1 flex-col overflow-y-auto pt-5">
            <nav className="flex-1 space-y-1 px-2">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className="group flex items-center rounded-md px-2 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-[#da7756]"
                >
                  <item.icon className="mr-3 h-5 w-5 flex-shrink-0 text-gray-400 group-hover:text-[#da7756]" />
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>
          <div className="border-t border-gray-200 p-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div className="flex cursor-pointer items-center">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-[#da7756] text-white">{userInitials}</AvatarFallback>
                  </Avatar>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-700 truncate">{authState.user?.full_name}</p>
                    <p className="text-xs text-gray-500">{roleLabel}</p>
                  </div>
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-56">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <Link to="/dashboard/profile">
                  <DropdownMenuItem>
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                </Link>
                <Link to="/dashboard/notifications">
                  <DropdownMenuItem>
                    <Bell className="mr-2 h-4 w-4" />
                    <span>Notifications</span>
                  </DropdownMenuItem>
                </Link>
                <Link to="/dashboard/settings">
                  <DropdownMenuItem>
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </DropdownMenuItem>
                </Link>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut} className="text-red-600 focus:text-red-700">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Sign out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="md:pl-64">
        <main className="min-h-screen py-6 px-4 sm:px-6 md:px-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
