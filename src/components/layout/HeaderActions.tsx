"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  Notification01Icon,
  LogoutIcon,
  UnfoldMoreIcon,
  DashboardSquare01Icon,
  UserIcon,
  Settings02Icon
} from "@hugeicons/core-free-icons"
import { logoutAction } from "@/actions/auth.actions"
import React from "react"

function getNotificationsUrl(role?: string): string {
  switch (role) {
    case "ADMIN":
    case "SUPER_ADMIN":
      return "/admin/notifications"
    case "HOST":
      return "/host/notifications"
    default:
      return "/user/notifications"
  }
}

export default function HeaderActions({
  user,
  unreadCount = 0,
}: {
  user: { name: string; email: string; avatar?: string | null; role?: string } | null
  unreadCount?: number
}) {
  const pathname = usePathname()

  const getUserInitials = (name: string) => {
    return name
      ?.split(" ")
      .map((w) => w[0])
      .join("")
      .slice(0, 2)
      .toUpperCase()
  }

  if (!user) {
    return (
      <Link
        href="/login"
        className="rounded-lg px-4 py-2.5 text-sm font-bold uppercase tracking-wide transition-all bg-primary-container text-on-primary-container hover:brightness-110"
      >
        Sign In
      </Link>
    )
  }

  return (
    <div className="flex items-center gap-3">
      {/* Notification Icon */}
      <Link
        href={getNotificationsUrl(user.role)}
        aria-current={pathname === getNotificationsUrl(user.role) ? "page" : undefined}
        className="relative inline-flex h-10 w-10 items-center justify-center rounded-lg border border-white/5 bg-surface-container text-on-surface-variant hover:bg-white/5 transition-colors"
        aria-label="Notifications"
      >
        <HugeiconsIcon icon={Notification01Icon} strokeWidth={2} className="size-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-1.5 -right-1.5 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-rose-600 px-1.5 text-xs font-bold text-white">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </Link>

      {/* Profile Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="inline-flex items-center gap-2 rounded-lg p-1.5 hover:bg-white/5 transition-colors">
            <Avatar className="h-9 w-9 rounded-lg border-white/10">
              <AvatarImage src={user.avatar || undefined} alt={user.name} />
              <AvatarFallback className="rounded-lg bg-primary-container/20 text-sm font-bold">
                {getUserInitials(user.name)}
              </AvatarFallback>
            </Avatar>
            <span className="hidden lg:inline text-sm font-medium truncate max-w-30">
              {user.name}
            </span>
            <HugeiconsIcon
              icon={UnfoldMoreIcon}
              strokeWidth={2}
              className="hidden lg:block size-4 text-on-surface-variant"
            />
          </button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" sideOffset={8} className="w-64">
          <DropdownMenuLabel className="p-0">
            <div className="flex items-center gap-3 px-3 py-3">
              <Avatar className="h-10 w-10 rounded-lg">
                <AvatarImage src={user.avatar || undefined} alt={user.name} />
                <AvatarFallback className="rounded-lg bg-primary-container/20 text-sm font-bold">
                  {getUserInitials(user.name)}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left leading-tight">
                <span className="truncate font-semibold">{user.name}</span>
                <span className="truncate text-xs text-muted-foreground">{user.email}</span>
              </div>
            </div>
          </DropdownMenuLabel>

          <DropdownMenuSeparator />

          {/* Dashboard - show for all authenticated users */}
          <DropdownMenuItem asChild>
            <Link href={`/${user?.role?.toLowerCase() === 'super_admin' ? 'admin' : `${user?.role?.toLowerCase()}`}`} className="flex items-center gap-2 cursor-pointer">
              <HugeiconsIcon icon={DashboardSquare01Icon} strokeWidth={2} className="size-4" />
              Dashboard
            </Link>
          </DropdownMenuItem>

          <DropdownMenuItem asChild>
            <Link href="/profile" className="flex items-center gap-2 cursor-pointer">
              <HugeiconsIcon icon={UserIcon} strokeWidth={2} className="size-4" />
              Profile
            </Link>
          </DropdownMenuItem>

          <DropdownMenuItem asChild>
            <Link href="/settings" className="flex items-center gap-2 cursor-pointer">
              <HugeiconsIcon icon={Settings02Icon} strokeWidth={2} className="size-4" />
              Settings
            </Link>
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem
            onClick={logoutAction}
            className="text-destructive focus:text-destructive cursor-pointer"
          >
            <HugeiconsIcon icon={LogoutIcon} strokeWidth={2} className="size-4 mr-2" />
            Log out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}