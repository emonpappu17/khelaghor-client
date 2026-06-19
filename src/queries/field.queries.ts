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
    accessToken: string
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
        { accessToken }
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