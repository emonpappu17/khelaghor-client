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

export type ReviewUser = {
    id: string
    name: string
    avatar: string | null
}

export type Review = {
    id: string
    fieldId: string
    rating: number
    comment: string
    createdAt: string
    user: ReviewUser
}

export type FieldReviewsData = {
    averageRating: number
    totalReviews: number
    reviews: Review[]
}

export async function getFieldReviews(
    fieldId: string,
    params: {
        page?: number
        limit?: number
    } = {}
): Promise<ApiResponse<FieldReviewsData> | null> {
    "use cache"

    const page = params.page ?? 1
    const limit = params.limit ?? 10

    cacheTag("reviews", `reviews-field-${fieldId}`, `reviews-page-${page}`)

    cacheLife({
        stale: 120,
        revalidate: 300,
        expire: 3600,
    })

    const queryParams = new URLSearchParams()
    queryParams.set("page", String(page))
    queryParams.set("limit", String(limit))

    const response = await apiFetch.get(
        `/reviews/field/${fieldId}?${queryParams.toString()}`
    )

    const res = await parseResponse<FieldReviewsData>(response)

    return res.success ? res : null
}
