import "server-only"

import {
    cacheLife,
    cacheTag,
} from "next/cache"

import {
    apiFetch,
    parseResponse,
} from "@/lib/api"

import type {
    ApiResponse,
} from "@/types/api.types"

import type {
    Field,
    SlotsListData,
} from "@/types/field.types"

export async function getMyField(
    accessToken: string
): Promise<ApiResponse<Field> | null> {
    "use cache"

    cacheTag("my-field")

    cacheLife({
        stale: 60,
        revalidate: 300,
        expire: 3600,
    })

    const response = await apiFetch.get(
        "/fields/my",
        { accessToken }
    )

    const res = await parseResponse<Field>(
        response
    )

    return res.success
        ? res
        : null
}

export async function getFieldSlots(
    fieldId: string,
    accessToken?: string
): Promise<
    ApiResponse<SlotsListData>
    | null
> {
    "use cache"

    cacheTag("field-slots", `field-slots-${fieldId}`)

    cacheLife({
        stale: 30,
        revalidate: 60,
        expire: 600,
    })

    const response = await apiFetch.get(
        `/slots/${fieldId}`,
        accessToken ? { accessToken } : undefined
    )

    const res =
        await parseResponse<
            SlotsListData
        >(response)

    return res.success ? res : null
}

export async function getFieldById(
    fieldId: string
): Promise<ApiResponse<Field> | null> {
    "use cache"

    cacheTag("fields", `field-${fieldId}`)

    cacheLife({
        stale: 300,
        revalidate: 1800,
        expire: 86400,
    })

    const response = await apiFetch.get(
        `/fields/${fieldId}`
    )

    const res = await parseResponse<Field>(
        response
    )

    return res.success ? res : null
}

export async function getFields(
    filters: {
        sportType?: string
        division?: string
        status?: string
        searchTerm?: string
    },
    options?: {
        limit?: number
        page?: number
        sortBy?: string
        sortOrder?: string
    }
): Promise<ApiResponse<Field[]> | null> {
    "use cache"

    cacheTag("fields-list")

    cacheLife({
        stale: 60,
        revalidate: 300,
        expire: 3600,
    })

    const queryParams = new URLSearchParams()
    if (filters.sportType) queryParams.set("sportType", filters.sportType)
    if (filters.division) queryParams.set("division", filters.division)
    if (filters.status) queryParams.set("status", filters.status)
    if (filters.searchTerm) queryParams.set("searchTerm", filters.searchTerm)

    if (options?.limit) queryParams.set("limit", String(options.limit))
    if (options?.page) queryParams.set("page", String(options.page))
    if (options?.sortBy) queryParams.set("sortBy", options.sortBy)
    if (options?.sortOrder) queryParams.set("sortOrder", options.sortOrder)

    const queryString = queryParams.toString()
    const url = `/fields${queryString ? `?${queryString}` : ""}`

    const response = await apiFetch.get(url)
    const res = await parseResponse<Field[]>(response)

    return res.success ? res : null
}