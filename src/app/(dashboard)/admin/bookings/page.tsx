import type { Metadata } from "next"

export const metadata: Metadata = {
    title: "Manage Bookings | Khelaghor Admin",
    description: "View and manage all bookings across the Khelaghor platform.",
}

export default function AdminBookingsPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="font-headline text-3xl font-bold text-on-surface">
                    Bookings
                </h1>
                <p className="mt-1 text-on-surface-variant">
                    Monitor all platform bookings — track payments, disputes, and cancellations.
                </p>
            </div>
        </div>
    )
}
