
import React from 'react';
import { Link } from 'react-router-dom';
import { LogOut, User, Bell, Settings } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { NavigationItem } from '@/utils/navigationItems';

type DesktopSidebarProps = {
  navigation: NavigationItem[];
  userInitials: string;
  userName: string | undefined;
  roleLabel: string;
  onSignOut: () => void;
};

const DesktopSidebar = ({
  navigation,
  userInitials,
  userName,
  roleLabel,
  onSignOut
}: DesktopSidebarProps) => {
  return (
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
                  <p className="text-sm font-medium text-gray-700 truncate">{userName}</p>
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
              <DropdownMenuItem onClick={onSignOut} className="text-red-600 focus:text-red-700">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Sign out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
};

export default DesktopSidebar;
