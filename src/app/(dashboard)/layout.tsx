import { AppSidebar } from '@/components/layout/AppSidebar';
import { Separator } from "@/components/ui/separator";
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import React from 'react';
// import HeaderActions from '@/components/layout/HeaderActions';
// import { getCurrentUser } from '@/queries/user.queries';
// import { apiFetch } from '@/lib/api';

const DashboardLayout =  ({ children }: { children: React.ReactNode }) => {
    // const userRes = await getCurrentUser();
    // const user = userRes?.data ?? null;

    // let unreadCount = 0;
    // try {
    //     const res = await apiFetch<{ count: number }>("/notifications/unread-count");
    //     if (res?.success && typeof res.data?.count === "number") {
    //         unreadCount = res.data.count;
    //     }
    // } catch {
    //     // ignore — fallback to 0
    // }

    // const headerUser = user
    //     ? { name: user.name, email: user.email, avatar: user.avatar ?? undefined }
    //     : null

    return (
        <SidebarProvider>
            <AppSidebar />

            <SidebarInset>
                <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
                    <div className="flex items-center gap-2 px-4">
                        <SidebarTrigger className="-ml-1" />
                        <Separator
                            orientation="vertical"
                            className="mr-2 data-vertical:h-4 data-vertical:self-auto"
                        />
                    </div>
                    {/* 
                    <HeaderActions user={headerUser} unreadCount={unreadCount} /> */}
                </header>
                <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
                    {children}
                </div>
            </SidebarInset>
        </SidebarProvider>
    );
};

export default DashboardLayout;