"use client"

import { deleteUserAction, updateUserRoleAction, updateUserStatusAction } from "@/actions/admin.actions"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type { User, UserRole, UserStatus } from "@/types/api.types"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  UserCircleIcon,
  Mail01Icon,
  CallIcon,
  Alert02Icon,
  CheckmarkCircle02Icon,
} from "@hugeicons/core-free-icons"
import { useRouter } from "next/navigation"
import { useState, useTransition } from "react"
import { toast } from "sonner"

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

type AdminUserDetailClientProps = {
  user: User
}

export function AdminUserDetailClient({ user }: AdminUserDetailClientProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [status, setStatus] = useState<UserStatus>(user.status)
  const [role, setRole] = useState<UserRole>(user.role)

  const handleStatusChange = (newStatus: UserStatus) => {
    setStatus(newStatus)
    startTransition(async () => {
      const res = await updateUserStatusAction(user.id, newStatus)
      if (res.success) {
        toast.success(res.message ?? "Status updated!")
      } else {
        toast.error(res.errors?._form?.[0] ?? "Failed to update status.")
        setStatus(user.status)
      }
    })
  }

  const handleRoleChange = (newRole: UserRole) => {
    setRole(newRole)
    startTransition(async () => {
      const res = await updateUserRoleAction(user.id, newRole)
      if (res.success) {
        toast.success(res.message ?? "Role updated!")
      } else {
        toast.error(res.errors?._form?.[0] ?? "Failed to update role.")
        setRole(user.role)
      }
    })
  }

  const handleDeleteUser = () => {
    startTransition(async () => {
      const res = await deleteUserAction(user.id)
      if (res.success) {
        toast.success(res.message ?? "User deleted!")
        router.push("/admin/users")
      } else {
        toast.error(res.errors?._form?.[0] ?? "Failed to delete user.")
      }
    })
  }

  return (
    <div className="space-y-6">
      {/* User Info Card */}
      <Card className="rounded-2xl border-border/40 bg-card/40 backdrop-blur-md">
        <CardHeader>
          <CardTitle className="font-headline text-xl font-black">User Information</CardTitle>
          <CardDescription>Basic profile details for this user.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-6">
            <Avatar className="size-16 rounded-xl border border-border/30">
              <AvatarImage src={user.avatar || undefined} alt={user.name} />
              <AvatarFallback className="rounded-xl text-lg font-bold bg-primary/10 text-primary">
                {getUserInitials(user.name)}
              </AvatarFallback>
            </Avatar>
            <div>
              <h2 className="font-bold text-xl text-on-surface">{user.name}</h2>
              <div className="flex items-center gap-2 mt-1">
                <Badge className="bg-primary/10 text-primary border border-primary/20 font-bold uppercase tracking-wider text-[10px] rounded-full">
                  {user.role}
                </Badge>
                <Badge className={`${getStatusBadgeVariant(user.status)} font-bold uppercase tracking-wider text-[10px] rounded-full`}>
                  {user.status}
                </Badge>
              </div>
            </div>
          </div>

          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="rounded-xl border border-border/20 p-4 bg-surface-container/20">
              <dt className="text-xs font-semibold uppercase tracking-widest text-on-surface-variant flex items-center gap-1">
                <HugeiconsIcon icon={Mail01Icon} strokeWidth={2} className="size-3" />
                Email
              </dt>
              <dd className="mt-1 font-bold text-on-surface">{user.email}</dd>
            </div>
            <div className="rounded-xl border border-border/20 p-4 bg-surface-container/20">
              <dt className="text-xs font-semibold uppercase tracking-widest text-on-surface-variant flex items-center gap-1">
                <HugeiconsIcon icon={CallIcon} strokeWidth={2} className="size-3" />
                Phone
              </dt>
              <dd className="mt-1 font-bold text-on-surface">{user.phone || "—"}</dd>
            </div>
            <div className="rounded-xl border border-border/20 p-4 bg-surface-container/20">
              <dt className="text-xs font-semibold uppercase tracking-widest text-on-surface-variant flex items-center gap-1">
                <HugeiconsIcon icon={CheckmarkCircle02Icon} strokeWidth={2} className="size-3" />
                Verified
              </dt>
              <dd className="mt-1 font-bold text-on-surface">{user.isVerified ? "Yes" : "No"}</dd>
            </div>
            <div className="rounded-xl border border-border/20 p-4 bg-surface-container/20">
              <dt className="text-xs font-semibold uppercase tracking-widest text-on-surface-variant flex items-center gap-1">
                <HugeiconsIcon icon={UserCircleIcon} strokeWidth={2} className="size-3" />
                Member Since
              </dt>
              <dd className="mt-1 font-bold text-on-surface">
                {new Date(user.createdAt).toLocaleDateString(undefined, {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </dd>
            </div>
          </dl>
        </CardContent>
      </Card>

      {/* Management Controls */}
      <Card className="rounded-2xl border-border/40 bg-card/40 backdrop-blur-md">
        <CardHeader>
          <CardTitle className="font-headline text-xl font-black">Management</CardTitle>
          <CardDescription>Change user role or account status.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Status Control */}
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-widest text-on-surface-variant">
                Account Status
              </label>
              <Select
                value={status}
                onValueChange={(v) => handleStatusChange(v as UserStatus)}
                disabled={isPending}
              >
                <SelectTrigger className="w-full rounded-xl border-border/40 bg-background">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-border/40 bg-card">
                  <SelectItem value="ACTIVE">Active</SelectItem>
                  <SelectItem value="SUSPENDED">Suspended</SelectItem>
                  <SelectItem value="BLOCKED">Blocked</SelectItem>
                  <SelectItem value="INACTIVE">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Role Control */}
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-widest text-on-surface-variant">
                User Role
              </label>
              <Select
                value={role}
                onValueChange={(v) => handleRoleChange(v as UserRole)}
                disabled={isPending}
              >
                <SelectTrigger className="w-full rounded-xl border-border/40 bg-background">
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-border/40 bg-card">
                  <SelectItem value="USER">User</SelectItem>
                  <SelectItem value="HOST">Host</SelectItem>
                  <SelectItem value="ADMIN">Admin</SelectItem>
                  <SelectItem value="SUPER_ADMIN">Super Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="rounded-2xl border-border/40 border-destructive/20 bg-card/40 backdrop-blur-md">
        <CardHeader>
          <div className="flex items-center gap-2">
            <HugeiconsIcon icon={Alert02Icon} strokeWidth={2} className="size-5 text-destructive" />
            <CardTitle className="font-headline text-xl font-black text-destructive">Danger Zone</CardTitle>
          </div>
          <CardDescription>
            Permanently delete this user and all associated data.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="destructive"
                className="font-headline font-black uppercase tracking-widest"
              >
                Delete User
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="rounded-2xl border-border/40 bg-card">
              <AlertDialogHeader>
                <AlertDialogTitle className="font-headline text-xl font-black">
                  Delete this user?
                </AlertDialogTitle>
                <AlertDialogDescription>
                  This will permanently delete <strong>{user.name}</strong> ({user.email}) and all associated data. This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel className="rounded-xl border-border/40">Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDeleteUser}
                  disabled={isPending}
                  className="rounded-xl bg-destructive text-destructive-foreground hover:bg-destructive/90 font-bold"
                >
                  {isPending ? "Deleting..." : "Yes, Delete User"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardContent>
      </Card>
    </div>
  )
}
