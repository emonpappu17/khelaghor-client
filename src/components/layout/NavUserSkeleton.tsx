import { Skeleton } from "@/components/ui/skeleton";

export function NavUserSkeleton() {
    return (
        <div className="flex items-center gap-3 rounded-lg px-2 py-2">
            <Skeleton className="h-8 w-8 rounded-lg shrink-0" />
            <div className="grid flex-1 gap-2 group-data-[collapsible=icon]:hidden">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-3 w-32" />
            </div>
        </div>
    );
}