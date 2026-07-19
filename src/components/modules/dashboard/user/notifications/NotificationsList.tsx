"use client"

import React, { useTransition } from "react"
import { useRouter, usePathname } from "next/navigation"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  Notification01Icon,
  StarIcon,
  UserAdd01Icon,
  AlertCircleIcon,
  CancelCircleIcon,
  CheckmarkCircle01Icon,
  Delete01Icon,
  ArrowLeft01Icon,
  ArrowRight01Icon,
  Mail01Icon,
} from "@hugeicons/core-free-icons"
import type { Notification, NotificationType } from "@/types/notification.types"
import type { PaginationMeta } from "@/types/api.types"
import {
  markNotificationReadAction,
  markAllNotificationsReadAction,
  deleteNotificationAction,
} from "@/actions/notification.actions"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"

type NotificationsListProps = {
  initialNotifications: Notification[]
  meta: PaginationMeta
  currentPage: number
  currentFilter: string
}

const notificationTypeConfig: Record<NotificationType, { icon: typeof Notification01Icon; color: string; bgColor: string }> = {
  BOOKING_CONFIRMED: {
    icon: CheckmarkCircle01Icon,
    color: "text-emerald-500",
    bgColor: "bg-emerald-500/10",
  },
  BOOKING_CANCELLED: {
    icon: CancelCircleIcon,
    color: "text-rose-500",
    bgColor: "bg-rose-500/10",
  },
  BOOKING_EXPIRED: {
    icon: AlertCircleIcon,
    color: "text-amber-500",
    bgColor: "bg-amber-500/10",
  },
  PAYMENT_SUCCESS: {
    icon: CheckmarkCircle01Icon,
    color: "text-emerald-500",
    bgColor: "bg-emerald-500/10",
  },
  PAYMENT_FAILED: {
    icon: CancelCircleIcon,
    color: "text-rose-500",
    bgColor: "bg-rose-500/10",
  },
  NEW_BOOKING: {
    icon: Notification01Icon,
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
  },
  NEW_REVIEW: {
    icon: StarIcon,
    color: "text-purple-500",
    bgColor: "bg-purple-500/10",
  },
  HOST_APPROVED: {
    icon: UserAdd01Icon,
    color: "text-emerald-500",
    bgColor: "bg-emerald-500/10",
  },
  SYSTEM: {
    icon: Notification01Icon,
    color: "text-on-surface-variant",
    bgColor: "bg-surface-container",
  },
}

function formatTimeAgo(dateStr: string): string {
  try {
    const now = Date.now()
    const date = new Date(dateStr).getTime()
    const diffMs = now - date
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 1) return "Just now"
    if (diffMins < 60) return `${diffMins}m ago`
    if (diffHours < 24) return `${diffHours}h ago`
    if (diffDays < 7) return `${diffDays}d ago`

    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(new Date(dateStr))
  } catch {
    return dateStr
  }
}

export function NotificationsList({
  initialNotifications,
  meta,
  currentPage,
  currentFilter,
}: NotificationsListProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [isPending, startTransition] = useTransition()

  const totalPages = Math.ceil(meta.total / meta.limit)

  const handleFilterChange = (filter: string) => {
    const params = new URLSearchParams(window.location.search)
    if (filter === "all") {
      params.delete("isRead")
    } else {
      params.set("isRead", filter)
    }
    params.set("page", "1")
    router.push(`${pathname}?${params.toString()}`)
  }

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(window.location.search)
    params.set("page", String(newPage))
    router.push(`${pathname}?${params.toString()}`)
  }

  const handleMarkRead = (id: string) => {
    startTransition(async () => {
      const res = await markNotificationReadAction(id)
      if (res.success) {
        toast.success(res.message || "Marked as read")
      } else {
        toast.error(res.errors?._form?.[0] || "Failed to mark as read")
      }
    })
  }

  const handleMarkAllRead = () => {
    startTransition(async () => {
      const res = await markAllNotificationsReadAction()
      if (res.success) {
        toast.success(res.message || "All notifications marked as read")
      } else {
        toast.error(res.errors?._form?.[0] || "Failed to mark all as read")
      }
    })
  }

  const handleDelete = (id: string) => {
    startTransition(async () => {
      const res = await deleteNotificationAction(id)
      if (res.success) {
        toast.success(res.message || "Notification deleted")
      } else {
        toast.error(res.errors?._form?.[0] || "Failed to delete notification")
      }
    })
  }

  const hasUnread = initialNotifications.some((n) => !n.isRead)

  const FILTERS = [
    { label: "All", value: "all" },
    { label: "Unread", value: "false" },
    { label: "Read", value: "true" },
  ]

  return (
    <div className="space-y-6">
      {/* Header with Mark All Read */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        {/* Filter Tabs */}
        <div className="flex bg-surface-container border border-border/30 rounded-xl p-1 shrink-0 overflow-x-auto max-w-full">
          {FILTERS.map((filter) => (
            <button
              key={filter.value}
              onClick={() => handleFilterChange(filter.value)}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                currentFilter === filter.value
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high"
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>

        {hasUnread && (
          <Button
            onClick={handleMarkAllRead}
            disabled={isPending}
            variant="outline"
            size="sm"
            className="rounded-xl border-border/40 h-9 font-bold text-xs"
          >
            <HugeiconsIcon icon={Mail01Icon} strokeWidth={2} className="size-4 mr-1.5" />
            Mark All as Read
          </Button>
        )}
      </div>

      {/* Notifications List */}
      {initialNotifications.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 gap-3">
          <div className="p-4 rounded-2xl bg-surface-container border border-border/20 text-on-surface-variant/40">
            <HugeiconsIcon icon={Notification01Icon} strokeWidth={2} className="size-8" />
          </div>
          <p className="font-bold text-sm text-on-surface">No notifications found</p>
          <p className="text-xs text-on-surface-variant">
            {currentFilter !== "all"
              ? "No notifications match the selected filter."
              : "You're all caught up! Notifications will appear here when you have new activity."}
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {initialNotifications.map((notification) => {
            const config = notificationTypeConfig[notification.type] ?? notificationTypeConfig.SYSTEM

            return (
              <div
                key={notification.id}
                className={`group relative rounded-2xl border transition-all duration-200 ${
                  notification.isRead
                    ? "border-border/20 bg-card/30"
                    : "border-border/30 bg-surface-container-low shadow-sm"
                }`}
              >
                <div className="flex items-start gap-3 p-4">
                  {/* Type Icon */}
                  <div
                    className={`shrink-0 flex items-center justify-center w-10 h-10 rounded-xl ${config.bgColor}`}
                  >
                    <HugeiconsIcon
                      icon={config.icon}
                      strokeWidth={2}
                      className={`size-5 ${config.color}`}
                    />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <h4
                            className={`text-sm leading-tight ${
                              notification.isRead
                                ? "font-medium text-on-surface-variant"
                                : "font-bold text-on-surface"
                            }`}
                          >
                            {notification.title}
                          </h4>
                          {!notification.isRead && (
                            <span className="shrink-0 size-2 rounded-full bg-primary" />
                          )}
                        </div>
                        <p className="text-xs text-on-surface-variant/80 leading-relaxed line-clamp-2">
                          {notification.body}
                        </p>
                        <p className="text-[10px] text-on-surface-variant/50 font-medium pt-1">
                          {formatTimeAgo(notification.createdAt)}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="shrink-0 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    {!notification.isRead && (
                      <button
                        onClick={() => handleMarkRead(notification.id)}
                        disabled={isPending}
                        className="inline-flex items-center justify-center w-8 h-8 rounded-lg text-on-surface-variant hover:text-emerald-500 hover:bg-emerald-500/10 transition-colors"
                        title="Mark as read"
                      >
                        <HugeiconsIcon icon={CheckmarkCircle01Icon} strokeWidth={2} className="size-4" />
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(notification.id)}
                      disabled={isPending}
                      className="inline-flex items-center justify-center w-8 h-8 rounded-lg text-on-surface-variant hover:text-rose-500 hover:bg-rose-500/10 transition-colors"
                      title="Delete notification"
                    >
                      <HugeiconsIcon icon={Delete01Icon} strokeWidth={2} className="size-4" />
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between py-2 px-1">
          <span className="text-xs font-semibold text-on-surface-variant">
            Showing Page {currentPage} of {totalPages} ({meta.total} total notifications)
          </span>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage <= 1}
              onClick={() => handlePageChange(currentPage - 1)}
              className="rounded-xl border-border/40 h-9 font-bold text-xs"
            >
              <HugeiconsIcon icon={ArrowLeft01Icon} strokeWidth={2} className="size-4 mr-1" />
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage >= totalPages}
              onClick={() => handlePageChange(currentPage + 1)}
              className="rounded-xl border-border/40 h-9 font-bold text-xs"
            >
              Next
              <HugeiconsIcon icon={ArrowRight01Icon} strokeWidth={2} className="size-4 ml-1" />
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
