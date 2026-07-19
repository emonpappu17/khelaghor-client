import "server-only"

import { cacheLife, cacheTag } from "next/cache"

import { apiFetch, parseResponse } from "@/lib/api"

import type { ApiResponse } from "@/types/api.types"
import type { Notification, UnreadCountData } from "@/types/notification.types"

export async function getNotifications(
  accessToken: string,
  params: {
    page?: number
    limit?: number
    isRead?: string
  } = {}
): Promise<ApiResponse<Notification[]> | null> {
  "use cache"

  const page = params.page ?? 1
  const limit = params.limit ?? 10
  const isRead = params.isRead

  cacheTag(
    "notifications",
    "notifications-user",
    `notifications-user-page-${page}`,
    `notifications-user-limit-${limit}`,
    isRead ? `notifications-user-isRead-${isRead}` : "notifications-user-isRead-all"
  )

  cacheLife({
    stale: 10,
    revalidate: 30,
    expire: 60,
  })

  const queryParams = new URLSearchParams()
  queryParams.set("page", String(page))
  queryParams.set("limit", String(limit))
  if (isRead) {
    queryParams.set("isRead", isRead)
  }

  const response = await apiFetch.get(
    `/notifications?${queryParams.toString()}`,
    { accessToken }
  )

  const res = await parseResponse<Notification[]>(response)
  return res.success ? res : null
}

export async function getUnreadCount(
  accessToken: string
): Promise<number> {
  "use cache"

  cacheTag("notifications", "notifications-unread")

  cacheLife({
    stale: 10,
    revalidate: 30,
    expire: 60,
  })

  const response = await apiFetch.get("/notifications/unread-count", { accessToken })
  const res = await parseResponse<UnreadCountData>(response)

  if (!res.success || !res.data) return 0

  return res.data.unreadCount
}
