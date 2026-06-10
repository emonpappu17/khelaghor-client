import type { Metadata } from "next"

export const metadata: Metadata = {
    title: "Host Overview | Khelaghor Dashboard",
    description:
        "Manage your sports fields, bookings, and hosting activity.",
}

export default function HostOverviewPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="font-headline text-3xl font-bold text-on-surface">
                    Host Dashboard
                </h1>

                <p className="mt-1 text-on-surface-variant">
                    Monitor your fields, bookings, and hosting performance.
                </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                <div className="rounded-2xl border p-5">
                    <h3 className="text-sm text-muted-foreground">
                        Total Fields
                    </h3>
                    <p className="mt-2 text-3xl font-bold">4</p>
                </div>

                <div className="rounded-2xl border p-5">
                    <h3 className="text-sm text-muted-foreground">
                        Active Bookings
                    </h3>
                    <p className="mt-2 text-3xl font-bold">18</p>
                </div>

                <div className="rounded-2xl border p-5">
                    <h3 className="text-sm text-muted-foreground">
                        Monthly Earnings
                    </h3>
                    <p className="mt-2 text-3xl font-bold">$1,240</p>
                </div>

                <div className="rounded-2xl border p-5">
                    <h3 className="text-sm text-muted-foreground">
                        Reviews
                    </h3>
                    <p className="mt-2 text-3xl font-bold">27</p>
                </div>
            </div>
        </div>
    )
}