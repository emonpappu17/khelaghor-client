import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Calendar02Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

export function HostFieldPageSkeleton() {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start animate-pulse">
            {/* Left Side: Field Information Skeleton */}
            <div className="lg:col-span-4 space-y-4 lg:sticky lg:top-6">
                <h2 className="text-sm font-black uppercase tracking-wider text-muted-foreground">
                    Field Information
                </h2>

                <Card className="w-full overflow-hidden border-border/40 shadow-lg bg-card/70 backdrop-blur-sm flex flex-col h-full rounded-2xl p-0">

                    {/* ── IMAGE GALLERY SKELETON (TOP) ── */}
                    <div className="relative w-full aspect-[16/10] bg-muted/20 shrink-0 overflow-hidden">
                        <Skeleton className="w-full h-full bg-muted/80 rounded-none" />

                        {/* Floating badge skeletons */}
                        <div className="absolute top-3 left-3">
                            <Skeleton className="h-5 w-20 bg-white/20 rounded-full" />
                        </div>
                        <div className="absolute top-3 right-3">
                            <Skeleton className="h-5 w-16 bg-white/20 rounded-full" />
                        </div>

                        {/* Dot indicators skeleton */}
                        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                            <Skeleton className="h-1.5 w-5 bg-white/30 rounded-full" />
                            <Skeleton className="h-1.5 w-1.5 bg-white/20 rounded-full" />
                            <Skeleton className="h-1.5 w-1.5 bg-white/20 rounded-full" />
                        </div>

                        {/* Thumbnail strip skeleton */}
                        <div className="absolute bottom-3 right-3 flex gap-1.5">
                            <Skeleton className="size-9 bg-white/20 rounded-lg shrink-0" />
                            <Skeleton className="size-9 bg-white/20 rounded-lg shrink-0" />
                            <Skeleton className="size-9 bg-white/20 rounded-lg shrink-0" />
                        </div>
                    </div>

                    {/* ── CARD BODY SKELETON ── */}
                    <CardContent className="p-5 flex flex-col gap-4 flex-1">

                        {/* Title + date */}
                        <div className="space-y-1">
                            <Skeleton className="h-6 w-40 bg-muted/80 rounded" />
                            <Skeleton className="h-3.5 w-28 bg-muted/80 rounded" />
                        </div>

                        {/* Description */}
                        <div className="space-y-1.5">
                            <Skeleton className="h-3 w-full bg-muted/80 rounded" />
                            <Skeleton className="h-3 w-5/6 bg-muted/80 rounded" />
                            <Skeleton className="h-3 w-2/3 bg-muted/80 rounded" />
                        </div>

                        {/* Facilities */}
                        <div className="flex flex-wrap gap-1.5">
                            <Skeleton className="h-5 w-14 bg-muted/80 rounded-md" />
                            <Skeleton className="h-5 w-12 bg-muted/80 rounded-md" />
                            <Skeleton className="h-5 w-16 bg-muted/80 rounded-md" />
                            <Skeleton className="h-5 w-10 bg-muted/80 rounded-md" />
                        </div>

                        {/* Location */}
                        <div className="flex items-start gap-2 bg-muted/20 rounded-xl p-3 border border-border/30">
                            <Skeleton className="size-4 bg-muted/80 rounded mt-0.5 shrink-0" />
                            <div className="space-y-1.5 flex-1">
                                <Skeleton className="h-3.5 w-3/4 bg-muted/80 rounded" />
                                <Skeleton className="h-3 w-1/2 bg-muted/80 rounded" />
                            </div>
                        </div>

                        {/* Stats */}
                        <div className="grid grid-cols-2 gap-3">
                            <div className="bg-muted/20 rounded-xl p-3 border border-border/20 space-y-1">
                                <Skeleton className="h-2.5 w-14 bg-muted/80 rounded" />
                                <Skeleton className="h-4 w-20 bg-muted/80 rounded" />
                            </div>
                            <div className="bg-muted/20 rounded-xl p-3 border border-border/20 space-y-1">
                                <Skeleton className="h-2.5 w-10 bg-muted/80 rounded" />
                                <Skeleton className="h-4 w-16 bg-muted/80 rounded" />
                            </div>
                        </div>

                        <div className="flex-1" />

                        {/* Action buttons */}
                        <div className="flex gap-2 pt-1 border-t border-border/20">
                            <Skeleton className="h-9 flex-1 bg-muted/80 rounded-xl" />
                            <Skeleton className="h-9 flex-1 bg-muted/80 rounded-xl" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Right Side: Slots & Availability Skeleton */}
            <div className="lg:col-span-8 space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border/30 pb-4">
                    <div>
                        <h2 className="text-xl font-black tracking-tight text-foreground uppercase">
                            Time Slots & Pricing
                        </h2>
                        <p className="text-xs text-muted-foreground mt-1">
                            Generate date-wise time slots, assign booking rates, and manage availability status.
                        </p>
                    </div>
                    <Skeleton className="h-10 w-32 bg-muted/80 rounded-xl shrink-0" />
                </div>

                {/* Stats Cards Skeleton */}
                <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
                    {/* Stat Card 1 */}
                    <Card className="border border-border/30 bg-card/60 backdrop-blur-sm shadow-md overflow-hidden relative">
                        <div className="absolute top-0 left-0 w-[4px] h-full bg-secondary opacity-50" />
                        <CardContent className="p-4 flex items-center justify-between">
                            <div className="space-y-1 flex-1">
                                <span className="text-muted-foreground text-[10px] uppercase font-bold tracking-wider block">Booking Analytics</span>
                                <div className="flex items-baseline gap-2 mt-1">
                                    <Skeleton className="h-8 w-16 bg-muted/80 rounded" />
                                </div>
                                <Skeleton className="h-3 w-28 bg-muted/80 rounded mt-1" />
                            </div>
                            <Skeleton className="size-10 bg-muted/80 rounded-xl shrink-0 ml-2" />
                        </CardContent>
                    </Card>

                    {/* Stat Card 2 */}
                    <Card className="border border-border/30 bg-card/60 backdrop-blur-sm shadow-md overflow-hidden relative">
                        <div className="absolute top-0 left-0 w-[4px] h-full bg-primary opacity-50" />
                        <CardContent className="p-4 flex items-center justify-between">
                            <div className="space-y-1 flex-1">
                                <span className="text-muted-foreground text-[10px] uppercase font-bold tracking-wider block">Active Revenue (BDT)</span>
                                <div className="flex items-baseline gap-2 mt-1">
                                    <Skeleton className="h-8 w-24 bg-muted/80 rounded" />
                                </div>
                                <Skeleton className="h-3 w-36 bg-muted/80 rounded mt-1" />
                            </div>
                            <Skeleton className="size-10 bg-muted/80 rounded-xl shrink-0 ml-2" />
                        </CardContent>
                    </Card>

                    {/* Stat Card 3 */}
                    <Card className="border border-border/30 bg-card/60 backdrop-blur-sm shadow-md overflow-hidden relative">
                        <div className="absolute top-0 left-0 w-[4px] h-full bg-foreground/30" />
                        <CardContent className="p-4 flex items-center justify-between">
                            <div className="space-y-1 flex-1">
                                <span className="text-muted-foreground text-[10px] uppercase font-bold tracking-wider block">Availability Tracker</span>
                                <div className="flex items-baseline gap-2 mt-1">
                                    <Skeleton className="h-8 w-16 bg-muted/80 rounded" />
                                </div>
                                <Skeleton className="h-3 w-24 bg-muted/80 rounded mt-1" />
                            </div>
                            <Skeleton className="size-10 bg-muted/80 rounded-xl shrink-0 ml-2" />
                        </CardContent>
                    </Card>
                </div>

                {/* Date Selection Tab Bar Skeleton */}
                <div className="flex flex-col gap-4">
                    <div className="flex items-center justify-between border-b border-border/40 pb-2.5 flex-wrap gap-2">
                        <h3 className="text-sm font-bold text-foreground flex items-center gap-1.5">
                            <HugeiconsIcon icon={Calendar02Icon} className="size-4 text-primary/75" />
                            Select Booking Date
                        </h3>
                        <div className="flex items-center gap-1.5 bg-muted/65 p-1 rounded-xl border border-border/40 text-[10px] font-bold">
                            <span className="px-2.5 py-1 text-muted-foreground opacity-60">all</span>
                            <span className="px-2.5 py-1 text-muted-foreground opacity-60">available</span>
                            <span className="px-2.5 py-1 text-muted-foreground opacity-60">booked</span>
                            <span className="px-2.5 py-1 text-muted-foreground opacity-60">blocked</span>
                        </div>
                    </div>

                    <div className="flex gap-2.5 overflow-x-auto pb-2">
                        {Array.from({ length: 5 }).map((_, i) => (
                            <div
                                key={i}
                                className="flex flex-col items-center justify-center py-2.5 px-4 rounded-xl border border-border min-w-[95px] bg-card/50"
                            >
                                <Skeleton className="h-4 w-12 bg-muted/80 rounded" />
                                <Skeleton className="h-3.5 w-10 bg-muted/80 rounded mt-1.5" />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Active Date Slots Grid Skeleton */}
                <div className="space-y-4">
                    <div className="flex flex-col gap-1">
                        <span className="text-[10px] font-black uppercase tracking-wider text-primary/75">
                            Available slots for
                        </span>
                        <Skeleton className="h-6 w-48 bg-muted/80 rounded" />
                    </div>

                    <div className="grid gap-3.5 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
                        {Array.from({ length: 4 }).map((_, i) => (
                            <Card key={i} className="border border-border/40 bg-card/60 shadow-sm rounded-xl">
                                <CardContent className="p-4 flex flex-col justify-between gap-4 h-full">
                                    <div className="flex items-center justify-between">
                                        <Skeleton className="h-5 w-16 bg-muted/80 rounded-full" />
                                        <Skeleton className="h-5 w-12 bg-muted/80 rounded" />
                                    </div>
                                    <Skeleton className="h-6 w-24 bg-muted/80 rounded" />
                                    <div className="flex items-center justify-between border-t border-border/20 pt-2.5">
                                        <Skeleton className="h-3.5 w-16 bg-muted/80 rounded" />
                                        <div className="flex gap-1.5">
                                            <Skeleton className="size-7 bg-muted/80 rounded-lg" />
                                            <Skeleton className="size-7 bg-muted/80 rounded-lg" />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}
