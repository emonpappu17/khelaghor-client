// import "server-only"

// import { cacheTag } from "next/cache"
// import { apiFetch } from "@/lib/api"
// import type { ApiResponse } from "@/types/api.types"
// import type { Field, FieldsListData, SlotsListData } from "@/types/field.types"

// export async function getMyField(): Promise<ApiResponse<FieldsListData> | null> {
//     "use cache"
//     cacheTag("my-field")

//     const response = await apiFetch<FieldsListData>("/fields/my", { withAuth: false })

//     if (!response.success) {
//         return null
//     }

//     return response
// }

// export async function getFieldSlots(fieldId: string): Promise<ApiResponse<SlotsListData> | null> {
//     "use cache"
//     cacheTag("field-slots", `field-slots-${fieldId}`)

//     const response = await apiFetch<SlotsListData>(`/slots/${fieldId}`, { withAuth: false })

//     if (!response.success) {
//         return null
//     }

//     return response
// }

// export async function getFieldById(fieldId: string): Promise<ApiResponse<Field> | null> {
//     "use cache"
//     cacheTag("my-field", `field-${fieldId}`)

//     const response = await apiFetch<Field>(`/fields/${fieldId}`)

//     if (!response.success) {
//         return null
//     }

//     return response
// }


// import "server-only"

// import { apiFetch, parseResponse } from "@/lib/api"
// import type { ApiResponse } from "@/types/api.types"
// import type { Field, SlotsListData } from "@/types/field.types"

// export async function getMyField(): Promise<ApiResponse<Field> | null> {
//     console.log("CACHE CHECK", Date.now())
//     const response = await apiFetch.get("/fields/my", {
//         // tags: ["my-field"],
//         // cache:"force-cache"
//     })
//     const res = await parseResponse<Field>(response)

//     if (!res.success) return null
//     return res
// }

// export async function getFieldSlots(fieldId: string): Promise<ApiResponse<SlotsListData> | null> {
//     const response = await apiFetch.get(`/slots/${fieldId}`, {
//         tags: ["field-slots", `field-slots-${fieldId}`],
//         cache:"force-cache"

//     })
//     const res = await parseResponse<SlotsListData>(response)

//     if (!res.success) return null
//     return res
// }

// export async function getFieldById(fieldId: string): Promise<ApiResponse<Field> | null> {
//     const response = await apiFetch.get(`/fields/${fieldId}`, {
//         tags: ["fields", `field-${fieldId}`],
//     })
//     const res = await parseResponse<Field>(response)

//     if (!res.success) return null
//     return res
// }



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