import type { Metadata } from "next"
import { Suspense } from "react"
import { NotificationsPageContent } from "@/components/modules/dashboard/user/notifications/NotificationsPageContent"

export const metadata: Metadata = {
  title: "Notifications | Khelaghor Dashboard",
  description: "View your notifications and updates from Khelaghor.",
}

type PageProps = {
  searchParams: Promise<{
    page?: string
    isRead?: string
  }>
}

export default function HostNotificationsPage({ searchParams }: PageProps) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-headline text-3xl font-bold text-on-surface">
          Notifications
        </h1>
        <p className="mt-1 text-on-surface-variant">
          Stay updated with booking confirmations, new reviews, and platform announcements.
        </p>
      </div>

      <Suspense
        fallback={
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="h-20 rounded-2xl bg-surface-container animate-pulse border border-border/20"
              />
            ))}
          </div>
        }
      >
        <NotificationsPageContent searchParams={searchParams} />
      </Suspense>
    </div>
  )
}
