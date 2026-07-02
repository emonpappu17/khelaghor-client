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
import type { Booking } from "@/types/booking.types"

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

/**
 * Fetch all platform bookings (restricted to ADMIN and SUPER_ADMIN).
 */
export async function getAllBookings(
    accessToken: string,
    params: {
        page?: number
        limit?: number
        sortBy?: string
        sortOrder?: string
        searchTerm?: string
        status?: string
        paymentStatus?: string
        sportType?: string
        division?: string
        area?: string
        userId?: string
        hostId?: string
        fieldId?: string
        startDate?: string
        endDate?: string
        minAmount?: number
        maxAmount?: number
    } = {}
): Promise<ApiResponse<Booking[]> | null> {
    "use cache"

    const page = params.page ?? 1
    const limit = params.limit ?? 10
    const sortBy = params.sortBy ?? "createdAt"
    const sortOrder = params.sortOrder ?? "desc"

    cacheTag(
        "bookings",
        "bookings-all",
        `bookings-all-page-${page}`,
        `bookings-all-limit-${limit}`,
        `bookings-all-sortBy-${sortBy}`,
        `bookings-all-sortOrder-${sortOrder}`,
        params.status ? `bookings-all-status-${params.status}` : "bookings-all-status-all",
        params.paymentStatus ? `bookings-all-payment-${params.paymentStatus}` : "bookings-all-payment-all",
        params.sportType ? `bookings-all-sport-${params.sportType}` : "bookings-all-sport-all"
    )

    cacheLife({
        stale: 10,
        revalidate: 30,
        expire: 60,
    })

    const queryParams = new URLSearchParams()
    queryParams.set("page", String(page))
    queryParams.set("limit", String(limit))
    queryParams.set("sortBy", sortBy)
    queryParams.set("sortOrder", sortOrder)

    if (params.searchTerm) {
        queryParams.set("searchTerm", params.searchTerm)
    }
    if (params.status && params.status !== "all") {
        queryParams.set("status", params.status)
    }
    if (params.paymentStatus && params.paymentStatus !== "all") {
        queryParams.set("paymentStatus", params.paymentStatus)
    }
    if (params.sportType && params.sportType !== "all") {
        queryParams.set("sportType", params.sportType)
    }
    if (params.division) {
        queryParams.set("division", params.division)
    }
    if (params.area) {
        queryParams.set("area", params.area)
    }
    if (params.userId) {
        queryParams.set("userId", params.userId)
    }
    if (params.hostId) {
        queryParams.set("hostId", params.hostId)
    }
    if (params.fieldId) {
        queryParams.set("fieldId", params.fieldId)
    }
    if (params.startDate) {
        queryParams.set("startDate", params.startDate)
    }
    if (params.endDate) {
        queryParams.set("endDate", params.endDate)
    }
    if (params.minAmount !== undefined) {
        queryParams.set("minAmount", String(params.minAmount))
    }
    if (params.maxAmount !== undefined) {
        queryParams.set("maxAmount", String(params.maxAmount))
    }

    const response = await apiFetch.get(
        `/bookings/all-bookings?${queryParams.toString()}`,
        { accessToken }
    )

    const res = await parseResponse<Booking[]>(response)
    return res.success ? res : null
}

