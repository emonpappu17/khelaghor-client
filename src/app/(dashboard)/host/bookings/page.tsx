import { HostBookingsPageContent } from "@/components/modules/dashboard/host/bookings/HostBookingsPageContent"
import { HostBookingsSkeleton } from "@/components/modules/dashboard/host/bookings/HostBookingsSkeleton"
// import { HostBookingsSkeleton } from "@/components/modules/dashboard/host/bookings/HostBookingsSkeleton"
import type { Metadata } from "next"
import { Suspense } from "react"

export const metadata: Metadata = {
    title: "Host Bookings | Khelaghor Dashboard",
    description: "View and manage bookings for your sports fields on Khelaghor.",
}

type Props = {
    searchParams: Promise<{
        page?: string
        status?: string
        q?: string
    }>
}


export default async function HostBookingsPage({ searchParams }: Props) {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="font-headline text-3xl font-bold text-on-surface">
                    Field Bookings
                </h1>
                <p className="mt-1 text-on-surface-variant">
                    View all bookings for your fields — upcoming, confirmed, and completed.
                </p>
            </div>

            <Suspense fallback={<HostBookingsSkeleton />}>
                <HostBookingsPageContent searchParams={searchParams} />
            </Suspense>
        </div>
    )
}

