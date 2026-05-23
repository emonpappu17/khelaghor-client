import type { Metadata } from "next"

export const metadata: Metadata = {
    title: "Manage Hosts | Khelaghor Admin",
    description: "Review, approve, and manage host profiles on Khelaghor.",
}

export default function AdminHostsPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="font-headline text-3xl font-bold text-on-surface">
                    Hosts
                </h1>
                <p className="mt-1 text-on-surface-variant">
                    Review host applications, approve profiles, and manage existing hosts.
                </p>
            </div>
        </div>
    )
}
