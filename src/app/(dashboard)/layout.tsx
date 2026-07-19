import { AppSidebar } from '@/components/layout/AppSidebar';
import HeaderActions from '@/components/layout/HeaderActions';
import { Separator } from "@/components/ui/separator";
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { getAccessToken } from '@/lib/cookie';
import { getCurrentUser } from '@/queries/user.queries';
import { getUnreadCount } from '@/queries/notification.queries';
import React from 'react';

const DashboardLayout = async ({ children }: { children: React.ReactNode }) => {
    const currentUser = await getCurrentUser()
    const user = currentUser?.data
        ? { name: currentUser.data.name, email: currentUser.data.email, avatar: currentUser.data.avatar, role: currentUser.data.role }
        : null

    const accessToken = await getAccessToken()
    const unreadCount = accessToken ? await getUnreadCount(accessToken) : 0

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
                    <div className="ml-auto">
                        <HeaderActions user={user} unreadCount={unreadCount} />
                    </div>
                </header>
                <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
                    {children}
                </div>
            </SidebarInset>
        </SidebarProvider>
    );
};

export default DashboardLayout;