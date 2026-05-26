import { Skeleton } from "@/components/ui/skeleton";
import { SidebarMenu, SidebarMenuItem } from "@/components/ui/sidebar";

export function NavMainSkeleton() {
    return (
        <SidebarMenu className="space-y-3 px-2">
            {Array.from({ length: 6 }).map((_, index) => (
                <SidebarMenuItem key={index}>
                    <div className="flex items-center gap-3 rounded-md px-2 py-2">
                        <Skeleton className="size-5 rounded-md shrink-0" />
                        <Skeleton className="h-4 w-full max-w-35 group-data-[collapsible=icon]:hidden" />
                    </div>
                </SidebarMenuItem>
            ))}
        </SidebarMenu>
    );
}