import type { Metadata } from "next"

export const metadata: Metadata = {
    title: "User Overview | Khelaghor Dashboard",
    description:
        "Manage your bookings, notifications, and activity in your Khelaghor dashboard.",
}

export default function UserOverviewPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="font-headline text-3xl font-bold text-on-surface">
                    User Dashboard
                </h1>

                <p className="mt-1 text-on-surface-variant">
                    Welcome back! Manage your bookings, notifications, and reviews.
                </p>
            </div>

            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                <div className="rounded-2xl border p-5">
                    <h3 className="text-sm text-muted-foreground">
                        Total Bookings
                    </h3>
                    <p className="mt-2 text-3xl font-bold">12</p>
                </div>

                <div className="rounded-2xl border p-5">
                    <h3 className="text-sm text-muted-foreground">
                        Upcoming Matches
                    </h3>
                    <p className="mt-2 text-3xl font-bold">3</p>
                </div>

                <div className="rounded-2xl border p-5">
                    <h3 className="text-sm text-muted-foreground">
                        Notifications
                    </h3>
                    <p className="mt-2 text-3xl font-bold">5</p>
                </div>

                <div className="rounded-2xl border p-5">
                    <h3 className="text-sm text-muted-foreground">
                        Reviews Given
                    </h3>
                    <p className="mt-2 text-3xl font-bold">8</p>
                </div>
            </div>
        </div>
    )
}