import { FieldSlotManager } from "@/components/modules/dashboard/host/field/FieldSlotManager"
import { Skeleton } from "@/components/ui/skeleton"
import { getAccessToken } from "@/lib/cookie"
import { getFieldSlots, getMyField } from "@/queries/field.queries"
import type { Slot } from "@/types/field.types"
import type { Metadata } from "next"
import { Suspense } from "react"

export const metadata: Metadata = {
    title: "Field Management | Khelaghor Dashboard",
    description: "Manage your registered sports field, slots, and availability on Khelaghor.",
}

async function FieldPageContent() {
    const token = await getAccessToken()

    const fieldsRes = await getMyField(token)
    const field = fieldsRes?.data ?? null

    let slots: Slot[] = []

    if (field) {
        const slotsRes = await getFieldSlots(field.id, token)
        slots = slotsRes?.data ?? []
    }

    return <FieldSlotManager field={field} slots={slots} />
}

function FieldPageSkeleton() {
    return (
        <div className="space-y-10 animate-pulse">
            {/* Top Overview Banner Skeleton */}
            <div className="bg-muted/40 p-5 rounded-2xl border border-border/20 max-w-4xl space-y-2">
                <Skeleton className="h-6 w-1/3 bg-muted/80" />
                <Skeleton className="h-4 w-2/3 bg-muted/80" />
            </div>

            {/* Field Details Block Skeleton */}
            <div className="space-y-4">
                <div className="flex items-center gap-2">
                    <Skeleton className="size-5 rounded bg-muted/80" />
                    <Skeleton className="h-6 w-36 bg-muted/80" />
                </div>
                
                {/* Field Card Split Layout Skeleton */}
                <div className="border border-border/30 rounded-2xl p-6 bg-card/65 backdrop-blur-sm grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Left Column (Images, Info) */}
                    <div className="lg:col-span-7 space-y-6">
                        {/* Image preview box */}
                        <Skeleton className="w-full aspect-[21/9] rounded-xl bg-muted/80" />
                        <div className="space-y-3">
                            <Skeleton className="h-4 w-1/4 bg-muted/80" />
                            <Skeleton className="h-4 w-full bg-muted/80" />
                            <Skeleton className="h-4 w-5/6 bg-muted/80" />
                        </div>
                        <div className="flex gap-2">
                            <Skeleton className="h-7 w-20 rounded-lg bg-muted/80" />
                            <Skeleton className="h-7 w-24 rounded-lg bg-muted/80" />
                            <Skeleton className="h-7 w-16 rounded-lg bg-muted/80" />
                        </div>
                    </div>
                    {/* Right Column (Map, Details) */}
                    <div className="lg:col-span-5 space-y-6 lg:border-l lg:border-border/30 lg:pl-6">
                        <Skeleton className="h-4 w-1/3 bg-muted/80" />
                        <Skeleton className="h-14 w-full rounded-xl bg-muted/80" />
                        <Skeleton className="w-full h-48 rounded-xl bg-muted/80" />
                        <Skeleton className="h-14 w-full rounded-xl bg-muted/80" />
                    </div>
                </div>
            </div>

            {/* Slots and Availability Management Block Skeleton */}
            <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border/30 pb-4">
                    <div className="space-y-2">
                        <Skeleton className="h-6 w-48 bg-muted/80" />
                        <Skeleton className="h-4 w-64 bg-muted/80" />
                    </div>
                    <Skeleton className="h-10 w-28 rounded-xl bg-muted/80" />
                </div>

                {/* Stats Cards Skeleton */}
                <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
                    <Skeleton className="h-20 rounded-xl bg-muted/80" />
                    <Skeleton className="h-20 rounded-xl bg-muted/80" />
                    <Skeleton className="h-20 rounded-xl bg-muted/80" />
                </div>

                {/* Horizontal Date Selector Skeleton */}
                <div className="space-y-3">
                    <Skeleton className="h-4 w-28 bg-muted/80" />
                    <div className="flex gap-2.5 overflow-x-auto pb-2">
                        {Array.from({ length: 5 }).map((_, i) => (
                            <Skeleton key={i} className="h-14 min-w-[95px] rounded-xl bg-muted/80 shrink-0" />
                        ))}
                    </div>
                </div>

                {/* Slots Grid Skeleton */}
                <div className="grid gap-3.5 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
                    {Array.from({ length: 4 }).map((_, i) => (
                        <Skeleton key={i} className="h-28 rounded-xl bg-muted/80" />
                    ))}
                </div>
            </div>
        </div>
    )
}

export default function HostFieldPage() {
    return (
        <div className="flex flex-col gap-6">
            <div>
                <h1 className="font-headline text-3xl font-black text-on-surface">
                    Field Management
                </h1>
                <p className="mt-1 text-xs text-on-surface-variant font-medium">
                    Configure your registered sports field, generate slots and manage prices, and check booking occupancies.
                </p>
            </div>
            <Suspense fallback={<FieldPageSkeleton />}>
                <FieldPageContent />
            </Suspense>
        </div>
    )
}
