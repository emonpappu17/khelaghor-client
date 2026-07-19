import React from "react"
import { getAccessToken } from "@/lib/cookie"
import { getNotifications } from "@/queries/notification.queries"
import { NotificationsList } from "./NotificationsList"

type Props = {
  searchParams: Promise<{
    page?: string
    isRead?: string
  }>
}

export async function NotificationsPageContent({ searchParams }: Props) {
  const resolvedParams = await searchParams
  const page = resolvedParams.page ? parseInt(resolvedParams.page) : 1
  const isRead = resolvedParams.isRead || undefined

  const token = await getAccessToken()

  if (!token) {
    return (
      <div className="flex flex-col items-center justify-center p-8 border border-dashed rounded-2xl bg-surface-container-low text-center">
        <p className="text-on-surface-variant font-medium">
          You must be logged in to view notifications.
        </p>
      </div>
    )
  }

  const notifRes = await getNotifications(token, {
    page,
    limit: 10,
    isRead,
  })

  const notifications = notifRes?.data ?? []
  const meta = notifRes?.meta ?? { page: 1, limit: 10, total: 0 }

  return (
    <NotificationsList
      initialNotifications={notifications}
      meta={meta}
      currentPage={page}
      currentFilter={isRead ?? "all"}
    />
  )
}
