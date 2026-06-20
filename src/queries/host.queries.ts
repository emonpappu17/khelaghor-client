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
    HostProfile,
    User,
} from "@/types/api.types"

export type HostWithUser = HostProfile & {
    user: Pick<User, "id" | "name" | "email" | "phone" | "avatar" | "status">
}

export type HostsListData = HostWithUser[]
// export type HostsListData = {
//     hosts: HostWithUser[]
// }

export async function getHosts(
    accessToken: string,
    params: {
        isApproved?: boolean
        page?: number
        limit?: number
    } = {}
): Promise<ApiResponse<HostsListData> | null> {
    "use cache"

    const isApprovedStr = params.isApproved !== undefined ? String(params.isApproved) : "all"
    const page = params.page ?? 1
    const limit = params.limit ?? 10

    cacheTag("hosts", `hosts-approved-${isApprovedStr}`, `hosts-page-${page}`)

    cacheLife({
        stale: 10,
        revalidate: 30,
        expire: 60,
    })

    const queryParams = new URLSearchParams()
    if (params.isApproved !== undefined) {
        queryParams.set("isApproved", String(params.isApproved))
    }
    queryParams.set("page", String(page))
    queryParams.set("limit", String(limit))
    // console.log('params==>', params);
    // console.log('==>', queryParams.toString());
    const response = await apiFetch.get(
        `/hosts?${queryParams.toString()}`,
        { accessToken }
    )

    const res = await parseResponse<HostsListData>(response)
    // console.log('res==>', res);
    return res.success ? res : null
}


export async function getHostById(
    hostId: string,
    accessToken: string
): Promise<ApiResponse<HostWithUser> | null> {
    // "use cache"

    // cacheTag("hosts", `host-${hostId}`)

    // cacheLife({
    //     stale: 10,
    //     revalidate: 30,
    //     expire: 60,
    // })

    const response = await apiFetch.get(
        `/hosts/${hostId}`,
        { accessToken }
    )

    const res = await parseResponse<HostWithUser>(response)

    return res.success ? res : null
}
