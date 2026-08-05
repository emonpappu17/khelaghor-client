"use client"

import { useRouter, usePathname } from "next/navigation"
import type { User, PaginationMeta } from "@/types/api.types"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  UserGroupIcon,
  ChevronLeft,
  ChevronRight,
  EyeIcon,
} from "@hugeicons/core-free-icons"
import Link from "next/link"

type AdminUsersContentProps = {
  initialUsers: User[]
  meta: PaginationMeta
  currentPage: number
  currentRole: string
  currentStatus: string
}

const ROLE_OPTIONS = [
  { value: "all", label: "All Roles" },
  { value: "USER", label: "User" },
  { value: "HOST", label: "Host" },
  { value: "ADMIN", label: "Admin" },
  { value: "SUPER_ADMIN", label: "Super Admin" },
]

const STATUS_OPTIONS = [
  { value: "all", label: "All Status" },
  { value: "ACTIVE", label: "Active" },
  { value: "SUSPENDED", label: "Suspended" },
  { value: "BLOCKED", label: "Blocked" },
  { value: "INACTIVE", label: "Inactive" },
]

function getUserInitials(name: string) {
  return name
    ?.split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase() || "U"
}

function getStatusBadgeVariant(status: string) {
  switch (status) {
    case "ACTIVE":
      return "bg-emerald-500/10 text-emerald-600 border-emerald-500/20 dark:text-emerald-400"
    case "SUSPENDED":
      return "bg-amber-500/10 text-amber-600 border-amber-500/20 dark:text-amber-400"
    case "BLOCKED":
      return "bg-red-500/10 text-red-600 border-red-500/20 dark:text-red-400"
    case "INACTIVE":
      return "bg-gray-500/10 text-gray-600 border-gray-500/20 dark:text-gray-400"
    default:
      return "bg-gray-500/10 text-gray-600 border-gray-500/20 dark:text-gray-400"
  }
}

export function AdminUsersContent({
  initialUsers,
  meta,
  currentPage,
  currentRole,
  currentStatus,
}: AdminUsersContentProps) {
  const router = useRouter()
  const pathname = usePathname()

  const handleFilterChange = (key: string, value: string) => {
    const params = new URLSearchParams(window.location.search)
    if (value === "all") {
      params.delete(key)
    } else {
      params.set(key, value)
    }
    params.set("page", "1")
    router.push(`${pathname}?${params.toString()}`)
  }

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(window.location.search)
    params.set("page", String(newPage))
    router.push(`${pathname}?${params.toString()}`)
  }

  const totalPages = Math.ceil(meta.total / meta.limit)

  return (
    <div className="space-y-6">
      {/* FILTERS HEADER */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        {/* Role Filter Tabs */}
        <div className="flex flex-wrap gap-2">
          {ROLE_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => handleFilterChange("role", opt.value)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                currentRole === opt.value
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high border border-border/20"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>

        {/* Status Filter Tabs */}
        <div className="flex flex-wrap gap-2">
          {STATUS_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => handleFilterChange("status", opt.value)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                currentStatus === opt.value
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high border border-border/20"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* USERS TABLE */}
      <div className="rounded-2xl border border-border/40 overflow-hidden bg-card/40 backdrop-blur-md shadow-xl">
        <Table>
          <TableHeader className="bg-surface-container-low border-b border-border/30">
            <TableRow className="hover:bg-transparent">
              <TableHead className="font-bold text-xs uppercase tracking-wider py-4 text-on-surface-variant/80">User</TableHead>
              <TableHead className="font-bold text-xs uppercase tracking-wider py-4 text-on-surface-variant/80">Email</TableHead>
              <TableHead className="font-bold text-xs uppercase tracking-wider py-4 text-on-surface-variant/80">Role</TableHead>
              <TableHead className="font-bold text-xs uppercase tracking-wider py-4 text-on-surface-variant/80">Status</TableHead>
              <TableHead className="font-bold text-xs uppercase tracking-wider py-4 text-on-surface-variant/80">Verified</TableHead>
              <TableHead className="text-right font-bold text-xs uppercase tracking-wider py-4 text-on-surface-variant/80 pr-6">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {initialUsers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-64 text-center">
                  <div className="flex flex-col items-center justify-center gap-3">
                    <div className="p-4 rounded-2xl bg-surface-container border border-border/20 text-on-surface-variant/40">
                      <HugeiconsIcon icon={UserGroupIcon} strokeWidth={2} className="size-8" />
                    </div>
                    <p className="font-bold text-sm text-on-surface">No users found</p>
                    <p className="text-xs text-on-surface-variant">
                      Try adjusting your filters.
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              initialUsers.map((u) => {
                const initials = getUserInitials(u.name)
                return (
                  <TableRow key={u.id} className="hover:bg-surface-container/30 transition-colors border-b border-border/20 last:border-0">
                    <TableCell className="py-4">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9 rounded-xl border border-border/30">
                          <AvatarImage src={u.avatar || undefined} alt={u.name} />
                          <AvatarFallback className="rounded-xl text-xs font-bold bg-primary/10 text-primary">
                            {initials}
                          </AvatarFallback>
                        </Avatar>
                        <span className="font-bold text-sm text-on-surface">{u.name}</span>
                      </div>
                    </TableCell>
                    <TableCell className="py-4 text-sm text-on-surface-variant font-medium">
                      {u.email}
                    </TableCell>
                    <TableCell className="py-4">
                      <Badge className="bg-primary/10 text-primary border border-primary/20 font-bold uppercase tracking-wider text-[10px] rounded-full px-2.5">
                        {u.role}
                      </Badge>
                    </TableCell>
                    <TableCell className="py-4">
                      <Badge className={`${getStatusBadgeVariant(u.status)} font-bold uppercase tracking-wider text-[10px] rounded-full px-2.5`}>
                        {u.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="py-4 text-sm font-medium">
                      {u.isVerified ? (
                        <span className="text-emerald-500">Yes</span>
                      ) : (
                        <span className="text-on-surface-variant/50">No</span>
                      )}
                    </TableCell>
                    <TableCell className="py-4 text-right pr-6">
                      <Link
                        href={`/admin/users/${u.id}`}
                        className="inline-flex items-center justify-center size-8 rounded-lg border border-border/40 hover:bg-primary/10 hover:text-primary transition-all"
                      >
                        <HugeiconsIcon icon={EyeIcon} strokeWidth={2} className="size-4 text-primary" />
                      </Link>
                    </TableCell>
                  </TableRow>
                )
              })
            )}
          </TableBody>
        </Table>
      </div>

      {/* PAGINATION */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between py-2 px-1">
          <span className="text-xs font-semibold text-on-surface-variant">
            Page {currentPage} of {totalPages} ({meta.total} total users)
          </span>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage <= 1}
              onClick={() => handlePageChange(currentPage - 1)}
              className="rounded-xl border-border/40 h-9 font-bold text-xs"
            >
              <HugeiconsIcon icon={ChevronLeft} strokeWidth={2} className="size-4 mr-1" />
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage >= totalPages}
              onClick={() => handlePageChange(currentPage + 1)}
              className="rounded-xl border-border/40 h-9 font-bold text-xs"
            >
              Next
              <HugeiconsIcon icon={ChevronRight} strokeWidth={2} className="size-4 ml-1" />
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
