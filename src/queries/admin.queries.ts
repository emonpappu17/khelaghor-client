// import "server-only"

// import { cacheLife, cacheTag } from "next/cache"

// import { apiFetch, parseResponse } from "@/lib/api"

// import type { ApiResponse, User } from "@/types/api.types"

// export type UsersListData = User[]

// export async function getUsers(
//   accessToken: string,
//   params: {
//     role?: string
//     status?: string
//     page?: number
//     limit?: number
//   } = {}
// ): Promise<ApiResponse<UsersListData> | null> {
//   "use cache"

//   const roleStr = params.role ?? "all"
//   const statusStr = params.status ?? "all"
//   const page = params.page ?? 1
//   const limit = params.limit ?? 10

//   cacheTag(
//     "users",
//     `users-role-${roleStr}`,
//     `users-status-${statusStr}`,
//     `users-page-${page}`
//   )

//   cacheLife({
//     stale: 10,
//     revalidate: 30,
//     expire: 60,
//   })

//   const queryParams = new URLSearchParams()
//   if (params.role && params.role !== "all") {
//     queryParams.set("role", params.role)
//   }
//   if (params.status && params.status !== "all") {
//     queryParams.set("status", params.status)
//   }
//   queryParams.set("page", String(page))
//   queryParams.set("limit", String(limit))

//   try {
//     const response = await apiFetch.get(
//       `/users?${queryParams.toString()}`,
//       { accessToken }
//     )

//     const res = await parseResponse<UsersListData>(response)
//     return res.success ? res : null
//   } catch (error) {
//     console.error("getUsers error:", error)
//     return null
//   }
// }

import "server-only"

import { cacheLife, cacheTag } from "next/cache"

import { apiFetch, parseResponse } from "@/lib/api"

import type { ApiResponse, User } from "@/types/api.types"

export type UsersListData = User[]

export type GetUsersParams = {
  search?: string
  role?: string
  status?: string
  isVerified?: boolean
  isDeleted?: boolean
  isApproved?: boolean
  sortBy?: string
  sortOrder?: "asc" | "desc"
  page?: number
  limit?: number
}

export async function getUsers(
  accessToken: string,
  params: GetUsersParams = {}
): Promise<ApiResponse<UsersListData> | null> {
  "use cache"

  const searchStr = params.search?.trim() ?? ""
  const roleStr = params.role ?? "all"
  const statusStr = params.status ?? "all"
  const isVerifiedStr = params.isVerified === undefined ? "all" : String(params.isVerified)
  const isDeletedStr = String(params.isDeleted ?? false) // mirror service default
  const isApprovedStr = params.isApproved === undefined ? "all" : String(params.isApproved)
  const sortBy = params.sortBy ?? "createdAt"
  const sortOrder = params.sortOrder ?? "desc"
  const page = params.page ?? 1
  const limit = params.limit ?? 10

  // Broad tags only — invalidate the whole "users" bucket on any mutation.
  // Per-filter-combo tags don't scale once you have 6+ filter dimensions.
  cacheTag("users", "users-list")

  cacheLife(
    searchStr
      ? { stale: 5, revalidate: 15, expire: 30 } // search queries churn fast, cache briefly
      : { stale: 10, revalidate: 30, expire: 60 }
  )

  const queryParams = new URLSearchParams()
  if (searchStr) queryParams.set("search", searchStr)
  if (params.role && params.role !== "all") queryParams.set("role", params.role)
  if (params.status && params.status !== "all") queryParams.set("status", params.status)
  if (params.isVerified !== undefined) queryParams.set("isVerified", String(params.isVerified))
  if (params.isDeleted !== undefined) queryParams.set("isDeleted", String(params.isDeleted))
  if (params.isApproved !== undefined) queryParams.set("isApproved", String(params.isApproved))
  queryParams.set("sortBy", sortBy)
  queryParams.set("sortOrder", sortOrder)
  queryParams.set("page", String(page))
  queryParams.set("limit", String(limit))
  console.log(queryParams);
  try {
    const response = await apiFetch.get(
      `/users?${queryParams.toString()}`,
      { accessToken }
    )

    const res = await parseResponse<UsersListData>(response)
    console.log(res);
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