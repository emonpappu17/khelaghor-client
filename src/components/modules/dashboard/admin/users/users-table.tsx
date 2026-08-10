"use client"

import type { User } from "@/types/api.types"
import { userColumns } from "./columns"
import { DataTableSearch } from "@/components/shared/data-table/data-table-search"
import { DataTableFacetedFilter } from "@/components/shared/data-table/data-table-faceted-filter"
import { DataTable } from "@/components/shared/data-table/data-table"
import { DataTableClearFilters } from "@/components/shared/data-table/data-table-clear-filters"
import { DataTableRefreshButton } from "@/components/shared/data-table/data-table-refresh-button"
import { refreshUsersAction } from "@/actions/admin.actions"

const FILTER_KEYS = ["search", "role", "status"]

interface UsersTableProps {
  data: User[]
  total: number
  limit: number
}

const ROLE_OPTIONS = [
  { label: "Super admin", value: "SUPER_ADMIN" },
  { label: "Admin", value: "ADMIN" },
  { label: "Host", value: "HOST" },
  { label: "User", value: "USER" },
]

const STATUS_OPTIONS = [
  { label: "Active", value: "ACTIVE" },
  { label: "Suspended", value: "SUSPENDED" },
  { label: "Blocked", value: "BLOCKED" },
  { label: "Inactive", value: "INACTIVE" },
]

export function UsersTable({ data, total, limit }: UsersTableProps) {
  const pageCount = Math.max(Math.ceil(total / limit), 1)

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <DataTableSearch placeholder="Search name, email, phone..." />
        <DataTableFacetedFilter
          paramKey="role"
          title="Role"
          options={ROLE_OPTIONS}
        />
        <DataTableFacetedFilter
          paramKey="status"
          title="Status"
          options={STATUS_OPTIONS}
        />
        <DataTableClearFilters paramKeys={FILTER_KEYS} />
        <div className="ml-auto">
          <DataTableRefreshButton onRefresh={refreshUsersAction} />
        </div>
      </div>

      <DataTable
        columns={userColumns}
        data={data}
        totalCount={total}
        pageCount={pageCount}
        getRowId={(row) => row.id}
        emptyMessage="No users found."
      />
    </div>
  )
}
