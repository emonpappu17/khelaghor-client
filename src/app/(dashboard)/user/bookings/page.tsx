import type { Metadata } from "next"

export const metadata: Metadata = {
    title: "My Bookings | Khelaghor Dashboard",
    description: "View and manage your sports field bookings on Khelaghor.",
}

export default function BookingsPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="font-headline text-3xl font-bold text-on-surface">
                    My Bookings
                </h1>
                <p className="mt-1 text-on-surface-variant">
                    Track your upcoming, active, and past bookings.
                </p>
            </div>
        </div>
    )
}
