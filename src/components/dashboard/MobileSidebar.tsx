
import React from 'react';
import { Link } from 'react-router-dom';
import { X, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { NavigationItem } from '@/utils/navigationItems';

type MobileSidebarProps = {
  isOpen: boolean;
  onClose: () => void;
  navigation: NavigationItem[];
  userInitials: string;
  userName: string | undefined;
  roleLabel: string;
  onSignOut: () => void;
};

const MobileSidebar = ({
  isOpen,
  onClose,
  navigation,
  userInitials,
  userName,
  roleLabel,
  onSignOut
}: MobileSidebarProps) => {
  return (
    <div
      className={`fixed inset-0 z-20 transform transition-transform duration-300 ease-in-out md:hidden ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}
    >
      <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={onClose}></div>
      <div className="relative flex h-full w-3/4 max-w-xs flex-col overflow-y-auto border-r border-gray-200 bg-white pt-5 pb-4">
        <div className="flex items-center justify-between px-4">
          <div className="flex items-center">
            <span className="font-bold text-xl text-[#da7756]">Africa<span className="text-black">rewards</span><span className="text-[#da7756]">network</span></span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
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
              onClick={onClose}
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
              <p className="text-sm font-medium text-gray-700">{userName}</p>
              <p className="text-xs text-gray-500">{roleLabel}</p>
            </div>
          </div>
          <Button variant="ghost" className="mt-3 w-full justify-start text-gray-500 hover:text-red-600" onClick={onSignOut}>
            <LogOut className="mr-2 h-4 w-4" />
            Sign out
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MobileSidebar;
