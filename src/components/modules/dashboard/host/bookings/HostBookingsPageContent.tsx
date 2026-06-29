import React from "react"
import { getAccessToken } from "@/lib/cookie"
import { getHostBookings } from "@/queries/booking.queries"
import { HostBookingsContent } from "./HostBookingsContent"
// import { HostBookingsContent } from "./HostBookingsContent"

type Props = {
    searchParams: Promise<{
        page?: string
        status?: string
        q?: string
    }>
}

export async function HostBookingsPageContent({ searchParams }: Props) {
    const resolvedParams = await searchParams
    const page = resolvedParams.page ? parseInt(resolvedParams.page) : 1
    const status = resolvedParams.status || "all"
    const searchQuery = resolvedParams.q || ""

    const token = await getAccessToken()

    if (!token) {
        return (
            <div className="flex flex-col items-center justify-center p-8 border border-dashed rounded-2xl bg-surface-container-low text-center">
                <p className="text-on-surface-variant font-medium">
                    You must be logged in as a host to view your bookings.
                </p>
            </div>
        )
    }

    const bookingsRes = await getHostBookings(token, {
        status,
        page,
        limit: 10, // Hosts have a table, showing 10 items per page is standard
    })

    // console.log('bookingsRes==>', bookingsRes);
    const bookings = bookingsRes?.data ?? []
    // console.log('bookings==>', bookings);

    const meta = bookingsRes?.meta ?? { page: 1, limit: 10, total: 0 }

    return (
        <HostBookingsContent
            initialBookings={bookings}
            meta={meta}
            currentPage={page}
            currentTab={status}
            searchQuery={searchQuery}
        />
    )
}
