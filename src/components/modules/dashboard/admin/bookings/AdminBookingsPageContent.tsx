import React from "react"
import { AdminBookingsContent } from "./AdminBookingsContent"
import { getAccessToken } from "@/lib/cookie"
import { getAllBookings } from "@/queries/booking.queries"

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

export async function AdminBookingsPageContent({ searchParams }: Props) {
    const resolvedParams = await searchParams
    const page = resolvedParams.page ? parseInt(resolvedParams.page) : 1
    const status = resolvedParams.status || "all"
    const searchTerm = resolvedParams.searchTerm || ""
    const sportType = resolvedParams.sportType || "all"
    const paymentStatus = resolvedParams.paymentStatus || "all"
    const division = resolvedParams.division || undefined
    const area = resolvedParams.area || undefined
    const minAmount = resolvedParams.minAmount ? parseFloat(resolvedParams.minAmount) : undefined
    const maxAmount = resolvedParams.maxAmount ? parseFloat(resolvedParams.maxAmount) : undefined
    const startDate = resolvedParams.startDate || undefined
    const endDate = resolvedParams.endDate || undefined
    const sortBy = resolvedParams.sortBy || "createdAt"
    const sortOrder = resolvedParams.sortOrder || "desc"

    const token = await getAccessToken()

    if (!token) {
        return (
            <div className="flex flex-col items-center justify-center p-8 border border-dashed rounded-2xl bg-surface-container-low text-center">
                <p className="text-on-surface-variant font-medium">
                    You must be logged in as an administrator to view this page.
                </p>
            </div>
        )
    }

    const bookingsRes = await getAllBookings(token, {
        page,
        limit: 10,
        sortBy,
        sortOrder,
        searchTerm,
        status,
        paymentStatus,
        sportType,
        division,
        area,
        minAmount,
        maxAmount,
        startDate,
        endDate,
    })

    const bookings = bookingsRes?.data ?? []
    const meta = bookingsRes?.meta ?? { page: 1, limit: 10, total: 0 }

    return (
        <AdminBookingsContent
            initialBookings={bookings}
            meta={meta}
            currentPage={page}
            currentTab={status}
            searchQuery={searchTerm}
        />
    )
}
