
import { 
  Home, 
  ShoppingBag, 
  CreditCard,
  Users,
  BarChart,
  Settings,
  User
} from 'lucide-react';
import { UserRole } from '@/lib/supabase';

export type NavigationItem = {
  name: string;
  href: string;
  icon: React.ComponentType<any>;
};

export const getNavigationByRole = (role: UserRole | undefined): NavigationItem[] => {
  const navigation: NavigationItem[] = [];
  
  if (role === 'master_admin') {
    navigation.push(
      { name: 'Dashboard', href: '/dashboard', icon: Home },
      { name: 'Manage Perks', href: '/dashboard/manage-perks', icon: ShoppingBag },
      { name: 'Manage Users', href: '/dashboard/manage-users', icon: Users },
      { name: 'Manage Vendors', href: '/dashboard/manage-vendors', icon: BarChart },
      { name: 'Settings', href: '/dashboard/settings', icon: Settings }
    );
  } else if (role === 'company_admin') {
    navigation.push(
      { name: 'Dashboard', href: '/dashboard', icon: Home },
      { name: 'Manage Perks', href: '/dashboard/manage-perks', icon: ShoppingBag },
      { name: 'Manage Users', href: '/dashboard/manage-users', icon: Users },
      { name: 'Browse Perks', href: '/dashboard/browse-perks', icon: CreditCard },
      { name: 'Settings', href: '/dashboard/settings', icon: Settings }
    );
  } else {
    // Employee role
    navigation.push(
      { name: 'Dashboard', href: '/dashboard', icon: Home },
      { name: 'Browse Perks', href: '/dashboard/browse-perks', icon: ShoppingBag },
      { name: 'My Redemptions', href: '/dashboard/my-redemptions', icon: CreditCard },
      { name: 'Vendor Recommendations', href: '/dashboard/vendor-recommendations', icon: User }
    );
  }
  
  return navigation;
};
