
import { 
  Home, 
  BarChart,
  CreditCard,
  Users,
  Settings,
  User,
  ShoppingBag,
  UserPlus
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
      { name: 'Analytics', href: '/dashboard/analytics', icon: BarChart }
    );
  } else if (role === 'company_admin') {
    navigation.push(
      { name: 'Dashboard', href: '/dashboard', icon: Home },
      { name: 'Manage Perks', href: '/dashboard/manage-perks', icon: ShoppingBag },
      { name: 'Manage Users', href: '/dashboard/manage-users', icon: Users },
      { name: 'Analytics', href: '/dashboard/analytics', icon: BarChart },
      { name: 'Settings', href: '/dashboard/settings', icon: Settings }
    );
  } else if (role === 'vendor') {
    navigation.push(
      { name: 'Dashboard', href: '/dashboard', icon: Home },
      { name: 'My Perks', href: '/dashboard/vendor-perks', icon: ShoppingBag },
      { name: 'Profile', href: '/dashboard/vendor-profile', icon: User },
      { name: 'Analytics', href: '/dashboard/analytics', icon: BarChart },
    );
  } else {
    // Employee role
    navigation.push(
      { name: 'Perks', href: '/dashboard', icon: ShoppingBag },
      { name: 'My Redemptions', href: '/dashboard/my-redemptions', icon: CreditCard },
      { name: 'Vendor Recommendations', href: '/dashboard/vendor-recommendations', icon: UserPlus }
    );
  }
  
  return navigation;
};
