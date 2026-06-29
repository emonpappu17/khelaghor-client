import "server-only"

import {
    cacheLife,
    cacheTag,
} from "next/cache"

import {
    apiFetch,
    parseResponse,
} from "@/lib/api"

import type { ApiResponse } from "@/types/api.types"
import type { Booking, BookingsResponseData } from "@/types/booking.types"

/**
 * Fetch the authenticated user's own bookings.
 */
export async function getUserBookings(
    accessToken: string,
    params: {
        status?: string
        page?: number
        limit?: number
    } = {}
): Promise<ApiResponse<Booking[]> | null> {
    "use cache"

    const statusStr = params.status ?? "all"
    const page = params.page ?? 1
    const limit = params.limit ?? 10

    cacheTag(
        "bookings",
        "bookings-user",
        `bookings-user-status-${statusStr}`,
        `bookings-user-page-${page}`
    )

    cacheLife({
        stale: 10,
        revalidate: 30,
        expire: 60,
    })

    const queryParams = new URLSearchParams()
    if (params.status && params.status !== "all") {
        queryParams.set("status", params.status)
    }
    queryParams.set("page", String(page))
    queryParams.set("limit", String(limit))

    const response = await apiFetch.get(
        `/bookings/my?${queryParams.toString()}`,
        { accessToken }
    )

    const res = await parseResponse<Booking[]>(response)
    return res.success ? res : null
}

/**
 * Fetch bookings for the fields managed by the authenticated host.
 */
export async function getHostBookings(
    accessToken: string,
    params: {
        status?: string
        page?: number
        limit?: number
    } = {}
): Promise<ApiResponse<Booking[]> | null> {
    "use cache"

    const statusStr = params.status ?? "all"
    const page = params.page ?? 1
    const limit = params.limit ?? 10

    cacheTag(
        "bookings",
        "bookings-host",
        `bookings-host-status-${statusStr}`,
        `bookings-host-page-${page}`
    )

    cacheLife({
        stale: 10,
        revalidate: 30,
        expire: 60,
    })

    const queryParams = new URLSearchParams()
    if (params.status && params.status !== "all") {
        queryParams.set("status", params.status)
    }
    queryParams.set("page", String(page))
    queryParams.set("limit", String(limit))

    const response = await apiFetch.get(
        `/bookings/host?${queryParams.toString()}`,
        { accessToken }
    )

    const res = await parseResponse<Booking[]>(response)
    return res.success ? res : null
}
