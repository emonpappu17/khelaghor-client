"use server"

import {
    apiFetch,
    parseResponse,
} from "@/lib/api"
import { getAccessToken } from "@/lib/cookie"
import type { ActionState } from "@/types/api.types"
import { updateTag } from "next/cache"

export type ApproveHostState = ActionState<{
    id: string
    isApproved: boolean
    approvedAt: string | null
}>

export async function approveHostAction(
    hostId: string
): Promise<ApproveHostState> {
    const accessToken = await getAccessToken()
    if (!accessToken) {
        return {
            errors: {
                _form: ["Unauthorized: Please log in as an administrator."],
            },
        }
    }

    const response = await apiFetch.patch(
        `/hosts/${hostId}/approve`,
        { accessToken }
    )

    const res = await parseResponse<{
        id: string
        isApproved: boolean
        approvedAt: string | null
    }>(response)

    if (!res.success) {
        return {
            errors: {
                _form: [res.message ?? "Failed to approve host."],
            },
        }
    }

    // Trigger cache revalidation for host queries
    updateTag("hosts")

    return {
        success: true,
        message: res.message ?? "Host profile approved successfully!",
        data: res.data,
    }
}
