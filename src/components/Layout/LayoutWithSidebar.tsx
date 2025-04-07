
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  SidebarProvider,
  Sidebar,
  SidebarContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader
} from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';
import { BoxSelect, History, Smartphone } from 'lucide-react';

interface LayoutWithSidebarProps {
  children: React.ReactNode;
}

const LayoutWithSidebar: React.FC<LayoutWithSidebarProps> = ({ children }) => {
  const location = useLocation();
  
  const menuItems = [
    {
      title: 'Single App',
      path: '/',
      icon: Smartphone,
    },
    {
      title: 'Multiple Apps',
      path: '/multiple-apps',
      icon: BoxSelect,
    },
    {
      title: 'Build History',
      path: '/build-history',
      icon: History,
    },
  ];

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-gray-100 dark:bg-gray-900">
        <Sidebar variant="inset">
          <SidebarHeader className="flex items-center px-4 py-2">
            <div className="flex items-center space-x-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-md bg-orange-500">
                <svg viewBox="0 0 24 24" className="h-5 w-5 text-white">
                  <path fill="currentColor" d="M12 2L2 12h5v10h10V12h5L12 2z" />
                </svg>
              </div>
              <div className="font-medium text-xl">Pharmacy App Builder</div>
            </div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.path}>
                  <SidebarMenuButton 
                    asChild 
                    isActive={location.pathname === item.path}
                  >
                    <Link to={item.path}>
                      <item.icon className="h-5 w-5" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarContent>
        </Sidebar>
        <div className="flex-1 p-4 md:p-8">
          {children}
        </div>
      </div>
    </SidebarProvider>
  );
};

export default LayoutWithSidebar;
