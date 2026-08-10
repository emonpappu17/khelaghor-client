"use server"

import { apiFetch, parseResponse } from "@/lib/api"
import { getAccessToken } from "@/lib/cookie"
import type { ActionState } from "@/types/api.types"
import type {
  MarkReadData,
  UnreadCountData,
} from "@/types/notification.types"
import { updateTag } from "next/cache"

export async function markNotificationReadAction(
  notificationId: string
): Promise<ActionState> {
  try {
    const accessToken = await getAccessToken()

    if (!accessToken) {
      return { errors: { _form: ["You must be logged in."] } }
    }

    const response = await apiFetch.patch(
      `/notifications/${notificationId}/read`,
      { accessToken }
    )

    const res = await parseResponse(response)

    if (!res.success) {
      return {
        errors: {
          _form: [res.message ?? "Failed to mark notification as read."],
        },
      }
    }

    updateTag("notifications")
    updateTag("notifications-unread")

    return { success: true, message: res.message }
  } catch (error) {
    console.error("markNotificationReadAction:", error)

    return {
      errors: {
        _form: ["Something went wrong. Please try again later."],
      },
    }
  }
}

export async function markAllNotificationsReadAction(): Promise<
  ActionState<MarkReadData>
> {
  try {
    const accessToken = await getAccessToken()

    if (!accessToken) {
      return { errors: { _form: ["You must be logged in."] } }
    }

    const response = await apiFetch.patch("/notifications/read-all", {
      accessToken,
    })

    const res = await parseResponse<MarkReadData>(response)

    if (!res.success) {
      return {
        errors: {
          _form: [res.message ?? "Failed to mark all as read."],
        },
      }
    }

    updateTag("notifications")
    updateTag("notifications-unread")

    return {
      success: true,
      message: res.message,
      data: res.data,
    }
  } catch (error) {
    console.error("markAllNotificationsReadAction:", error)

    return {
      errors: {
        _form: ["Something went wrong. Please try again later."],
      },
    }
  }
}

export async function deleteNotificationAction(
  notificationId: string
): Promise<ActionState> {
  try {
    const accessToken = await getAccessToken()

    if (!accessToken) {
      return { errors: { _form: ["You must be logged in."] } }
    }

    const response = await apiFetch.delete(
      `/notifications/${notificationId}`,
      {
        accessToken,
      }
    )

    const res = await parseResponse(response)

    if (!res.success) {
      return {
        errors: {
          _form: [res.message ?? "Failed to delete notification."],
        },
      }
    }

    updateTag("notifications")
    updateTag("notifications-unread")

    return {
      success: true,
      message: res.message,
    }
  } catch (error) {
    console.error("deleteNotificationAction:", error)

    return {
      errors: {
        _form: ["Something went wrong. Please try again later."],
      },
    }
  }
}

export async function getUnreadCountAction(): Promise<number> {
  try {
    const accessToken = await getAccessToken()

    if (!accessToken) return 0

    const response = await apiFetch.get("/notifications/unread-count", {
      accessToken,
    })

    const res = await parseResponse<UnreadCountData>(response)

    if (!res.success || !res.data) return 0

    return res.data.unreadCount
  } catch (error) {
    console.error("getUnreadCountAction:", error)
    return 0
  }
}