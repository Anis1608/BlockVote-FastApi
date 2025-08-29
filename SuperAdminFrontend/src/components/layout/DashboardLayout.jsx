import React from 'react';
import { SidebarProvider } from '@/components/ui/sidebar-simple';
import { AppSidebar } from '@/components/layout/AppSidebar';
import { DashboardHeader } from '@/components/layout/DashboardHeader';
import { Outlet } from 'react-router-dom';

export const DashboardLayout = () => {
  return (
    <SidebarProvider defaultOpen={true}>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />
        <div className="flex-1 flex flex-col">
          <DashboardHeader />
          <main className="flex-1 p-4 md:p-6 overflow-auto">
            {/* 👇 Yaha nested route ka content render hoga */}
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};
