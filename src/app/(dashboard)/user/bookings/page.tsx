import { UserBookingsPageContent } from "@/components/modules/dashboard/user/bookings/UserBookingsPageContent"
import { UserBookingsSkeleton } from "@/components/modules/dashboard/user/bookings/UserBookingsSkeleton"
// import { UserBookingsSkeleton } from "@/components/modules/dashboard/user/bookings/UserBookingsSkeleton"
import type { Metadata } from "next"
import { Suspense } from "react"

export const metadata: Metadata = {
    title: "My Bookings | Khelaghor Dashboard",
    description: "View and manage your sports field bookings on Khelaghor.",
}

type Props = {
    searchParams: Promise<{
        page?: string
        status?: string
        q?: string
    }>
}


export default async function BookingsPage({ searchParams }: Props) {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="font-headline text-3xl font-bold text-on-surface">
                    My Bookings
                </h1>
                <p className="mt-1 text-on-surface-variant">
                    Track your upcoming, active, and past bookings.
                </p>
            </div>

            <Suspense fallback={<UserBookingsSkeleton />}>
                <UserBookingsPageContent searchParams={searchParams} />
            </Suspense>
        </div>
    )
}

