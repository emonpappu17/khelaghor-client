/* eslint-disable @typescript-eslint/no-unused-vars */
import "server-only"


import { apiFetch, parseResponse } from "@/lib/api"

import { getAccessToken } from "@/lib/cookie"
import type { ApiResponse, User } from "@/types/api.types"

export const getCurrentUser = async (): Promise<ApiResponse<User> | null> => {
    try {
        const accessToken = await getAccessToken();

        const response = await apiFetch.get("/users/me", { accessToken })

        const res = await parseResponse<User>(response)

        return res.success ? res : null
    } catch (error) {
        return null
    }
}
// export const getCurrentUser = (
//     async (): Promise<ApiResponse<User> | null> => {
//         const accessToken = await getAccessToken();

//         const response = await apiFetch.get("/users/me", { accessToken })

//         const res = await parseResponse<User>(response)

//         return res.success ? res : null
//     }
// )