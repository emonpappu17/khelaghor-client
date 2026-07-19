export type NotificationType =
  | "BOOKING_CONFIRMED"
  | "BOOKING_CANCELLED"
  | "BOOKING_EXPIRED"
  | "PAYMENT_SUCCESS"
  | "PAYMENT_FAILED"
  | "NEW_BOOKING"
  | "NEW_REVIEW"
  | "HOST_APPROVED"
  | "SYSTEM"

export type Notification = {
  id: string
  type: NotificationType
  title: string
  body: string
  metadata: Record<string, string> | null
  isRead: boolean
  readAt: string | null
  createdAt: string
}

export type NotificationListData = {
  notifications: Notification[]
}

export type UnreadCountData = {
  unreadCount: number
}

export type MarkReadData = {
  markedCount: number
}
