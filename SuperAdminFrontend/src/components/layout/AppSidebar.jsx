import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  useSidebar,
} from '@/components/ui/sidebar-simple';
import {
  Vote,
  
  Users,
  Calendar,
  UserCheck,
  BarChart3,
  Settings,
  Shield,
  Home
} from 'lucide-react';

const navigationItems = [
  {
    title: 'Dashboard',
    url: '/dashboard',
    icon: Home,
  },
  {
    title: 'Admin Management',
    url: '/dashboard/admins',
    icon: Users,
  },
  {
    title: 'Election Management',
    url: '/dashboard/elections',
    icon: Calendar,
  },
  {
    title: 'Candidate Management',
    url: '/dashboard/candidates',
    icon: UserCheck,
  },
  {
    title: 'Results Dashboard',
    url: '/dashboard/results',
    icon: BarChart3,
  },
  {
    title: 'Settings',
    url: '/dashboard/settings',
    icon: Settings,
  },
];

export const AppSidebar = () => {
  const { state, isMobile, setOpenMobile } = useSidebar();
  const location = useLocation();
  const currentPath = location.pathname;

  const isCollapsed = state === 'collapsed';

  const handleNavigation = () => {
    console.log('Navigation clicked, isMobile:', isMobile);
    if (isMobile) {
      console.log('Closing mobile sidebar');
      setOpenMobile(false);
    }
  };

  const isActive = (path) => {
    console.log('Checking active path:', path, 'Current path:', currentPath);
    if (path === '/dashboard') {
      return currentPath === '/dashboard';
    }
    return currentPath.startsWith(path);
  };

  return (
    <Sidebar className="border-r bg-sidebar">
      <SidebarHeader className="border-b border-sidebar-border">
        <div className="flex items-center gap-3 px-3 py-4">
          <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
            <Vote className="w-5 h-5 text-white" />
          </div>
          {!isCollapsed && (
            <div className="flex flex-col">
              <h1 className="font-poppins font-bold text-lg text-sidebar-foreground">
                BlockVote
              </h1>
              <p className="text-xs text-sidebar-foreground/70">
                Election Management
              </p>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-sidebar-foreground/70 font-medium">
            {!isCollapsed ? 'Main Navigation' : ''}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={isActive(item.url)}>
                    <NavLink 
                      to={item.url} 
                      onClick={handleNavigation}
                      className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-smooth ${
                        isActive(item.url)
                          ? 'bg-sidebar-accent text-sidebar-accent-foreground font-medium'
                          : 'text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground'
                      }`}
                    >
                      <item.icon className={`${isCollapsed ? 'w-5 h-5' : 'w-4 h-4'} flex-shrink-0`} />
                      {!isCollapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {!isCollapsed && (
          <SidebarGroup className="mt-auto">
            <SidebarGroupContent>
              <div className="px-3 py-4 bg-sidebar-accent/30 rounded-lg mx-3 mb-3">
                <div className="flex items-center gap-2 mb-2">
                  <Shield className="w-4 h-4 text-accent" />
                  <span className="text-sm font-medium text-sidebar-foreground">
                    Super Admin
                  </span>
                </div>
                <p className="text-xs text-sidebar-foreground/70">
                  Full system access with blockchain security
                </p>
              </div>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>
    </Sidebar>
  );
};
