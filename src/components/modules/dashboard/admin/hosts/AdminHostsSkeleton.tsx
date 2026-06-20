import { Skeleton } from "@/components/ui/skeleton";

export function AdminHostsSkeleton() {
    return (
        <div className="space-y-6">
            {/* Search & Filters Skeleton */}
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
                <div className="flex bg-surface-container border border-border/30 rounded-xl p-1 gap-2">
                    <Skeleton className="h-8 w-20 rounded-lg" />
                    <Skeleton className="h-8 w-24 rounded-lg" />
                    <Skeleton className="h-8 w-20 rounded-lg" />
                </div>
                <div className="flex gap-2 w-full sm:max-w-md">
                    <Skeleton className="h-10 flex-1 rounded-xl" />
                    <Skeleton className="h-10 w-20 rounded-xl" />
                </div>
            </div>

            {/* Table Skeleton */}
            <div className="rounded-2xl border border-border/40 overflow-hidden bg-card/40 backdrop-blur-md shadow-xl">
                <div className="p-4 border-b border-border/30 bg-surface-container-low flex justify-between">
                    <Skeleton className="h-4 w-40" />
                    <Skeleton className="h-4 w-28" />
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-4 w-28" />
                    <Skeleton className="h-4 w-16" />
                </div>
                <div className="divide-y divide-border/20">
                    {Array.from({ length: 5 }).map((_, i) => (
                        <div key={i} className="p-4 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <Skeleton className="size-9 rounded-xl" />
                                <div className="space-y-1">
                                    <Skeleton className="h-4 w-28" />
                                    <Skeleton className="h-3.5 w-40" />
                                </div>
                            </div>
                            <Skeleton className="h-4 w-32" />
                            <Skeleton className="h-4 w-24" />
                            <Skeleton className="h-5 w-20 rounded-full" />
                            <Skeleton className="h-4 w-24" />
                            <div className="flex gap-2">
                                <Skeleton className="size-8 rounded-lg" />
                                <Skeleton className="h-8 w-20 rounded-lg" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}