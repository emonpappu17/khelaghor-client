import { FieldSlotManager } from "@/components/modules/dashboard/host/field/FieldSlotManager"
import { Skeleton } from "@/components/ui/skeleton"
import { getAccessToken } from "@/lib/cookie"
import { getFieldSlots, getMyField } from "@/queries/field.queries"
import type { Slot } from "@/types/field.types"
import type { Metadata } from "next"
import { Suspense } from "react"

export const metadata: Metadata = {
    title: "Field Management | Khelaghor Dashboard",
    description: "Manage your sports field, slots, and availability on Khelaghor.",
}

async function FieldPageContent() {
    const token = await getAccessToken();

    const fieldsRes =
        await getMyField(
            token
        )
    // const fieldsRes = await getMyField()
    const field = fieldsRes?.data ?? null

    let slots: Slot[] = []
    
    if (field) {
        const slotsRes = await getFieldSlots(field.id, token)
        slots = slotsRes?.data ?? []
    }

    return (
        <FieldSlotManager
            field={field}
            slots={slots}
        />
    )
}

function FieldPageSkeleton() {
    return (
        <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
                <Skeleton className="h-9 w-48" />
                <Skeleton className="h-8 w-28" />
            </div>
            <Skeleton className="h-52 rounded-xl w-full" />
            <Skeleton className="h-96 rounded-xl w-full" />
        </div>
    )
}

export default function HostFieldPage() {
    return (
        <div className="flex flex-col gap-6">
            <div>
                <h1 className="font-headline text-3xl font-bold text-on-surface">
                    Field Management
                </h1>
                <p className="mt-1 text-on-surface-variant">
                    Manage your registered sports field, update availability, and configure slots.
                </p>
            </div>
            <Suspense fallback={<FieldPageSkeleton />}>
                <FieldPageContent />
            </Suspense>
        </div>
    )
}
