import AdminHostsPageContent from "@/components/modules/dashboard/admin/hosts/AdminHostsPageContent"
import { AdminHostsSkeleton } from "@/components/modules/dashboard/admin/hosts/AdminHostsSkeleton"
import type { Metadata } from "next"
import { Suspense } from "react"

export const metadata: Metadata = {
    title: "Manage Hosts | Khelaghor Admin",
    description: "Review, approve, and manage host profiles on Khelaghor.",
}

type Props = {
    searchParams: Promise<{
        page?: string
        isApproved?: string
        q?: string
    }>
}

export default async function AdminHostsPage({ searchParams }: Props) {
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

            <Suspense fallback={<AdminHostsSkeleton />}>
                <AdminHostsPageContent searchParams={searchParams} />
            </Suspense>

            {/* <AdminHostsSkeleton></AdminHostsSkeleton> */}
        </div>
    )
}

