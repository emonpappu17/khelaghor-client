import React from "react"
import { getAccessToken } from "@/lib/cookie"
import { getUserBookings } from "@/queries/booking.queries"
import { UserBookingsContent } from "./UserBookingsContent"

type Props = {
    searchParams: Promise<{
        page?: string
        status?: string
        q?: string
    }>
}

export async function UserBookingsPageContent({ searchParams }: Props) {
    const resolvedParams = await searchParams
    const page = resolvedParams.page ? parseInt(resolvedParams.page) : 1
    const status = resolvedParams.status || "all"
    const searchQuery = resolvedParams.q || ""

    const token = await getAccessToken()

    if (!token) {
        return (
            <div className="flex flex-col items-center justify-center p-8 border border-dashed rounded-2xl bg-surface-container-low text-center">
                <p className="text-on-surface-variant font-medium">
                    You must be logged in to view your bookings.
                </p>
            </div>
        )
    }

    const bookingsRes = await getUserBookings(token, {
        status,
        page,
        limit: 6, // Show 6 bookings per page for user cards layout
    })

    const bookings = bookingsRes?.data ?? []
    const meta = bookingsRes?.meta ?? { page: 1, limit: 6, total: 0 }
    // console.log('bookings===>', bookings);
    return (
        <UserBookingsContent
            initialBookings={bookings}
            meta={meta}
            currentPage={page}
            currentTab={status}
            searchQuery={searchQuery}
        />
    )
}
