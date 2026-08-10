"use client"

import Image from "next/image"
import { createColumnHelper } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
import type { User } from "@/types/api.types"
import { DataTableFeatures } from "@/components/shared/data-table/data-table-features"
import { DataTableColumnHeader } from "@/components/shared/data-table/data-table-column-header"
import { UserActionsCell } from "./user-actions-cell"

const columnHelper = createColumnHelper<DataTableFeatures, User>()

export const userColumns = columnHelper.columns([
  columnHelper.accessor("name", {
    header: () => <DataTableColumnHeader title="Name" sortKey="name" />,
    cell: ({ row }) => {
      const user = row.original
      return (
        <div className="flex items-center gap-2">
          {user.avatar ? (
            <Image
              src={user.avatar}
              alt={user.name}
              width={28}
              height={28}
              className="rounded-full object-cover"
            />
          ) : (
            <div className="h-7 w-7 rounded-full bg-muted" />
          )}
          <div className="flex flex-col">
            <span className="font-medium leading-none">{user.name}</span>
            <span className="text-xs text-muted-foreground">
              {user.email}
            </span>
          </div>
        </div>
      )
    },
  }),
  columnHelper.accessor("role", {
    header: "Role",
    cell: ({ getValue }) => <Badge variant="outline">{getValue()}</Badge>,
  }),
  columnHelper.accessor("status", {
    header: "Status",
    cell: ({ getValue }) => {
      const status = getValue()
      // Adjust variant mapping to your actual UserStatus enum values.
      return (
        <Badge variant={status === "ACTIVE" ? "default" : "destructive"}>
          {status}
        </Badge>
      )
    },
  }),
  columnHelper.accessor("isVerified", {
    header: "Verified",
    cell: ({ getValue }) => (getValue() ? "✓" : "—"),
  }),
  columnHelper.accessor((row) => row.hostProfile?.isApproved, {
    id: "hostApproved",
    header: "Host Approved",
    cell: ({ row }) => {
      const host = row.original.hostProfile
      if (!host) return <span className="text-muted-foreground">—</span>
      return host.isApproved ? (
        <Badge>Approved</Badge>
      ) : (
        <Badge variant="secondary">Pending</Badge>
      )
    },
  }),
  columnHelper.accessor("createdAt", {
    header: () => <DataTableColumnHeader title="Joined" sortKey="createdAt" />,
    cell: ({ getValue }) => new Date(getValue()).toLocaleDateString(),
  }),
  columnHelper.display({
    id: "actions",
    cell: ({ row }) => <UserActionsCell user={row.original} />,
  }),
])
