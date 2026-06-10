import type { Metadata } from "next"

export const metadata: Metadata = {
    title: "Manage Users | Khelaghor Admin",
    description: "View, filter, and manage all registered users on Khelaghor.",
}

export default function AdminUsersPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="font-headline text-3xl font-bold text-on-surface">
                    Users
                </h1>
                <p className="mt-1 text-on-surface-variant">
                    View all registered users — filter by role, status, and manage accounts.
                </p>
            </div>
        </div>
    )
}
