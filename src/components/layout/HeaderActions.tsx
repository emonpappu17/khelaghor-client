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
import { Notification01Icon, LogoutIcon, UnfoldMoreIcon } from "@hugeicons/core-free-icons"
import { logoutAction } from "@/actions/auth.actions"
import React from "react"

export default function HeaderActions({
  user,
  unreadCount = 0,
}: {
  user: { name: string; email: string; avatar?: string | null } | null
  unreadCount?: number
}) {
  const pathname = usePathname()

  return (
    <div className="ml-auto flex items-center gap-3 px-4">
      <Link
        href="/dashboard/user/notifications"
        aria-current={pathname === "/dashboard/user/notifications" ? "page" : undefined}
        className="relative inline-flex h-9 w-9 items-center justify-center rounded-lg border border-white/5 bg-surface-container text-on-surface-variant hover:bg-muted"
        aria-label="Notifications"
      >
        <HugeiconsIcon icon={Notification01Icon} strokeWidth={2} className="size-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-rose-600 px-1.5 text-xs font-medium text-white">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </Link>

      {user ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="inline-flex items-center gap-2 rounded-lg px-2 py-1 hover:bg-muted">
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage src={user.avatar || undefined} alt={user.name} />
                <AvatarFallback className="rounded-lg">
                  {user.name
                    ?.split(" ")
                    .map((w) => w[0])
                    .join("")
                    .slice(0, 2)
                    .toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <span className="hidden truncate text-sm font-medium sm:inline">{user.name}</span>
              <HugeiconsIcon icon={UnfoldMoreIcon} strokeWidth={2} className="ml-1 size-4" />
            </button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" sideOffset={8}>
            <DropdownMenuLabel className="p-0">
              <div className="flex items-center gap-2 px-2 py-2 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage src={user.avatar || undefined} alt={user.name} />
                  <AvatarFallback className="rounded-lg">
                    {user.name
                      ?.split(" ")
                      .map((w) => w[0])
                      .join("")
                      .slice(0, 2)
                      .toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{user.name}</span>
                  <span className="truncate text-xs">{user.email}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Link href="/dashboard/profile" className="flex w-full items-center">
                Profile
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Link href="/dashboard/settings" className="flex w-full items-center">
                Settings
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={logoutAction} className="text-destructive">
              <HugeiconsIcon icon={LogoutIcon} strokeWidth={2} className="mr-2" />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <Link href="/login" className="rounded-lg px-3 py-2 text-sm font-medium hover:bg-muted">
          Sign in
        </Link>
      )}
    </div>
  )
}
