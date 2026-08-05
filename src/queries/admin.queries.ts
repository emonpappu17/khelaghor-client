import "server-only"

import { cacheLife, cacheTag } from "next/cache"

import { apiFetch, parseResponse } from "@/lib/api"

import type { ApiResponse, User } from "@/types/api.types"

export type UsersListData = User[]

export async function getUsers(
  accessToken: string,
  params: {
    role?: string
    status?: string
    page?: number
    limit?: number
  } = {}
): Promise<ApiResponse<UsersListData> | null> {
  "use cache"

  const roleStr = params.role ?? "all"
  const statusStr = params.status ?? "all"
  const page = params.page ?? 1
  const limit = params.limit ?? 10

  cacheTag(
    "users",
    `users-role-${roleStr}`,
    `users-status-${statusStr}`,
    `users-page-${page}`
  )

  cacheLife({
    stale: 10,
    revalidate: 30,
    expire: 60,
  })

  const queryParams = new URLSearchParams()
  if (params.role && params.role !== "all") {
    queryParams.set("role", params.role)
  }
  if (params.status && params.status !== "all") {
    queryParams.set("status", params.status)
  }
  queryParams.set("page", String(page))
  queryParams.set("limit", String(limit))

  try {
    const response = await apiFetch.get(
      `/users?${queryParams.toString()}`,
      { accessToken }
    )

    const res = await parseResponse<UsersListData>(response)
    return res.success ? res : null
  } catch (error) {
    console.error("getUsers error:", error)
    return null
  }
}

export async function getUserById(
  userId: string,
  accessToken: string
): Promise<ApiResponse<User> | null> {
  "use cache"

  cacheTag("users", `user-${userId}`)

  cacheLife({
    stale: 10,
    revalidate: 30,
    expire: 60,
  })

  try {
    const response = await apiFetch.get(`/users/${userId}`, { accessToken })
    const res = await parseResponse<User>(response)
    return res.success ? res : null
  } catch (error) {
    console.error("getUserById error:", error)
    return null
  }
}