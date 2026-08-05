import { AdminUsersSkeleton } from "@/components/modules/dashboard/admin/users/AdminUsersSkeleton"
import type { Metadata } from "next"
import { Suspense } from "react"
import dynamic from "next/dynamic"

const AdminUsersPageContent = dynamic(
  () => import("@/components/modules/dashboard/admin/users/AdminUsersPageContent"),
  { ssr: true }
)

export const metadata: Metadata = {
  title: "Manage Users | Khelaghor Admin",
  description: "View, filter, and manage all registered users on Khelaghor.",
}

type Props = {
  searchParams: Promise<{
    page?: string
    role?: string
    status?: string
  }>
}

export default async function AdminUsersPage({ searchParams }: Props) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-headline text-3xl font-bold text-on-surface">Users</h1>
        <p className="mt-1 text-on-surface-variant">
          View all registered users — filter by role, status, and manage accounts.
        </p>
      </div>

      <Suspense fallback={<AdminUsersSkeleton />}>
        <AdminUsersPageContent searchParams={searchParams} />
      </Suspense>
    </div>
  )
}
