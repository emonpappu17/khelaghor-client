import "server-only"

import { cache } from "react"

import { apiFetch, parseResponse } from "@/lib/api"

import type { ApiResponse, User } from "@/types/api.types"

export const getCurrentUser = cache(
    async (): Promise<ApiResponse<User> | null> => {
        // const response = await apiFetch<User>(
        //     "/users/me"
        // )

        // if (!response.success) {
        //     return null
        // }

        const response = await apiFetch.get("/users/me")
        const res = await parseResponse<User>(response)

        if (!res.success) {
            return null
        }
        return res
    }
)