import type { Metadata } from "next"

export const metadata: Metadata = {
    title: "Admin Overview | Khelaghor Dashboard",
    description:
        "Manage users, hosts, fields, bookings, and platform analytics.",
}

export default function AdminOverviewPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="font-headline text-3xl font-bold text-on-surface">
                    Admin Dashboard
                </h1>

                <p className="mt-1 text-on-surface-variant">
                    Monitor platform activity, users, bookings, and hosts.
                </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                <div className="rounded-2xl border p-5">
                    <h3 className="text-sm text-muted-foreground">
                        Total Users
                    </h3>
                    <p className="mt-2 text-3xl font-bold">1,245</p>
                </div>

                <div className="rounded-2xl border p-5">
                    <h3 className="text-sm text-muted-foreground">
                        Total Hosts
                    </h3>
                    <p className="mt-2 text-3xl font-bold">54</p>
                </div>

                <div className="rounded-2xl border p-5">
                    <h3 className="text-sm text-muted-foreground">
                        Total Bookings
                    </h3>
                    <p className="mt-2 text-3xl font-bold">3,412</p>
                </div>

                <div className="rounded-2xl border p-5">
                    <h3 className="text-sm text-muted-foreground">
                        Active Fields
                    </h3>
                    <p className="mt-2 text-3xl font-bold">76</p>
                </div>
            </div>
        </div>
    )
}