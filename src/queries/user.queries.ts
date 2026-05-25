import "server-only"

import { cache } from "react"

import { apiFetch } from "@/lib/api"

import type { ApiResponse, User } from "@/types/api.types"

export const getCurrentUser = cache(
    async (): Promise<ApiResponse<User> | null> => {
        const response = await apiFetch<User>(
            "/users/me"
        )

        if (!response.success) {
            return null
        }

        return response
    }
)