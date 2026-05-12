// import { apiFetch } from "@/lib/api"
// import type { ApiResponse, User } from "@/types/api.types"


// export async function getMe(): Promise<ApiResponse<User>> {
//     return apiFetch<User>("/users/me", {
//         cache: "no-store",
//     })
// }



import "server-only"

import { cache } from "react"

import { apiFetch } from "@/lib/api"

import type { ApiResponse, User } from "@/types/api.types"

/**
 * Current authenticated user
 *
 * - Fresh runtime data
 * - Deduplicated during render
 * - Safe for Navbar, Sidebar, Dashboard, etc.
 */
export const getCurrentUser = cache(
    async (): Promise<ApiResponse<User> | null> => {
        console.log('called');
        const response = await apiFetch<User>(
            "/users/me"
        )

        if (!response.success) {
            return null
        }

        return response
    }
)
