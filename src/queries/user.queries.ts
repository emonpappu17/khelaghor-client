import "server-only"

import { cache } from "react"

import { apiFetch, parseResponse } from "@/lib/api"

import type { ApiResponse, User } from "@/types/api.types"
import { getAccessToken } from "@/lib/cookie"

export const getCurrentUser = cache(
    async (): Promise<ApiResponse<User> | null> => {
        const accessToken = await getAccessToken();

        const response = await apiFetch.get("/users/me", { accessToken })

        const res = await parseResponse<User>(response)

        return res.success ? res : null
    }
)