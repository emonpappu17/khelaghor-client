import type { Metadata } from "next"

export const metadata: Metadata = {
    title: "Manage Fields | Khelaghor Admin",
    description: "View and manage all sports fields listed on Khelaghor.",
}

export default function AdminFieldsPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="font-headline text-3xl font-bold text-on-surface">
                    Fields
                </h1>
                <p className="mt-1 text-on-surface-variant">
                    Browse all listed sports fields — filter by sport type, location, and status.
                </p>
            </div>
        </div>
    )
}
