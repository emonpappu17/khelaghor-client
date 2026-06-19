import { HostFieldPageContent } from "@/components/modules/dashboard/host/field/HostFieldPageContent"
import { HostFieldPageSkeleton } from "@/components/modules/dashboard/host/field/HostFieldPageSkeleton"
import type { Metadata } from "next"
import { Suspense } from "react"

export const metadata: Metadata = {
    title: "Field Management | Khelaghor Dashboard",
    description: "Manage your registered sports field, slots, and availability on Khelaghor.",
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
            <Suspense fallback={<HostFieldPageSkeleton />}>
                <HostFieldPageContent />
            </Suspense>
            {/* <HostFieldPageSkeleton></HostFieldPageSkeleton> */}
        </div>
    )
}

