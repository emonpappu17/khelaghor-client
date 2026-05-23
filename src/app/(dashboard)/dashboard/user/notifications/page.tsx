import type { Metadata } from "next"

export const metadata: Metadata = {
    title: "Notifications | Khelaghor Dashboard",
    description: "View your notifications and updates from Khelaghor.",
}

export default function NotificationsPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="font-headline text-3xl font-bold text-on-surface">
                    Notifications
                </h1>
                <p className="mt-1 text-on-surface-variant">
                    Stay updated with booking confirmations, reminders, and platform announcements.
                </p>
            </div>
        </div>
    )
}
