import React from "react"
import { getAccessToken } from "@/lib/cookie"
import { getUsers } from "@/queries/admin.queries"
import { AdminUsersContent } from "./AdminUsersContent"

type Props = {
  searchParams: Promise<{
    page?: string
    role?: string
    status?: string
  }>
}

const AdminUsersPageContent = async ({ searchParams }: Props) => {
  const resolvedParams = await searchParams
  const page = resolvedParams.page ? parseInt(resolvedParams.page) : 1
  const role = resolvedParams.role
  const status = resolvedParams.status

  const token = await getAccessToken()

  const usersRes = await getUsers(token, {
    role: role && role !== "all" ? role : undefined,
    status: status && status !== "all" ? status : undefined,
    page,
    limit: 10,
  })

  const users = usersRes?.data ?? []
  const meta = usersRes?.meta ?? { page: 1, limit: 10, total: 0 }
  return (
    <div> 
      <AdminUsersContent
        initialUsers={users}
        meta={meta}
        currentPage={page}
        currentRole={role || "all"}
        currentStatus={status || "all"}
      />
    </div>
  )
}

export default AdminUsersPageContent
