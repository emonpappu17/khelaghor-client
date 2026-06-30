import { AdminBookingsPageContent } from "@/components/modules/dashboard/admin/bookings/AdminBookingsPageContent"
import { AdminBookingsSkeleton } from "@/components/modules/dashboard/admin/bookings/AdminBookingsSkeleton"
import type { Metadata } from "next"
import { Suspense } from "react"

export const metadata: Metadata = {
    title: "Manage Bookings | Khelaghor Admin",
    description: "View and manage all bookings across the Khelaghor platform.",
}

type Props = {
    searchParams: Promise<{
        page?: string
        status?: string
        searchTerm?: string
        sportType?: string
        paymentStatus?: string
        division?: string
        area?: string
        minAmount?: string
        maxAmount?: string
        startDate?: string
        endDate?: string
        sortBy?: string
        sortOrder?: string
    }>
}

export default async function AdminBookingsPage({ searchParams }: Props) {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="font-headline text-3xl font-bold text-on-surface">
                    Bookings
                </h1>
                <p className="mt-1 text-on-surface-variant">
                    Monitor all platform bookings — track payments, disputes, and cancellations.
                </p>
            </div>

            <Suspense fallback={<AdminBookingsSkeleton />}>
                <AdminBookingsPageContent searchParams={searchParams} />
            </Suspense>
        </div>
    )
}
