import type { Metadata } from "next"

export const metadata: Metadata = {
    title: "Host Bookings | Khelaghor Dashboard",
    description: "View and manage bookings for your sports fields on Khelaghor.",
}

export default function HostBookingsPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="font-headline text-3xl font-bold text-on-surface">
                    Field Bookings
                </h1>
                <p className="mt-1 text-on-surface-variant">
                    View all bookings for your fields — upcoming, confirmed, and completed.
                </p>
            </div>
        </div>
    )
}
