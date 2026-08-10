import { AdminUsersTableContent } from "@/components/modules/dashboard/admin/users/AdminUsersTableContent"
import { UsersTableSkeleton } from "@/components/modules/dashboard/admin/users/users-table-skeleton"
import { Suspense } from "react"

interface AdminUsersPageProps {
  searchParams: Promise<Record<string, string | undefined>>
}

export default async function AdminUsersPage({
  searchParams,
}: AdminUsersPageProps) {
  const params = await searchParams

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Users</h1>
        <p className="text-sm text-muted-foreground">
          Manage platform users, hosts, and admins.
        </p>
      </div>

      {/*
        Reading searchParams makes this subtree dynamic, which is exactly
        what you want with cacheComponents on: the shell above renders
        instantly, and only this part suspends/streams when filters change.
        `key` forces a clean remount per param combo instead of reusing
        stale Suspense state.
      */}
      <Suspense fallback={<UsersTableSkeleton />} key={JSON.stringify(params)}>
        <AdminUsersTableContent searchParams={params} />
      </Suspense>
    </div>
  )
}


