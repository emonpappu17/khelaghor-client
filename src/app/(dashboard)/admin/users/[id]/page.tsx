import { getAccessToken } from "@/lib/cookie"
import { getUserById } from "@/queries/admin.queries"
import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { AdminUserDetailClient } from "./AdminUserDetailClient"

type Props = {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  return {
    title: `User ${id.slice(0, 8)}... | Khelaghor Admin`,
    description: "View and manage user details.",
  }
}

export default async function AdminUserDetailPage({ params }: Props) {
  const { id } = await params
  const accessToken = await getAccessToken()
  if (!accessToken) {
    return <p className="text-on-surface-variant">Unauthorized. Please log in.</p>
  }

  const userRes = await getUserById(id, accessToken)
  if (!userRes?.data) {
    notFound()
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-headline text-3xl font-bold text-on-surface">User Details</h1>
        <p className="mt-1 text-on-surface-variant">
          Manage user account, status, role, and more.
        </p>
      </div>

      <AdminUserDetailClient user={userRes.data} />
    </div>
  )
}
