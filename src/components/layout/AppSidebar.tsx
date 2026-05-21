import * as React from "react"

import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import { TeamSwitcher } from "@/components/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "@/components/ui/sidebar"
import { verifyTokenUser } from "@/lib/cookie"
import { UserRole } from "@/types/api.types"
import {
  BookOpen02Icon,
  Building01Icon,
  Calendar01Icon,
  // User
  Calendar03Icon,
  GridTableIcon,
  // Common
  GridViewIcon,
  Notification01Icon,
  // Host
  Sad01Icon,
  Settings05Icon,
  Stairs01Icon,
  StarIcon,
  UserAdd01Icon,
  UserCircleIcon,
  // Admin
  UserGroupIcon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

type NavItem = {
  title: string
  url: string
  icon: React.ReactNode
  isActive?: boolean
}

export const getCommonNavItems = (role: UserRole): NavItem[] => {
  // Overview URL is role-aware — each role lands on their own dashboard root
  const overviewUrl =
    role === "ADMIN" || role === "SUPER_ADMIN"
      ? "/dashboard/admin"
      : role === "HOST"
        ? "/dashboard/host"
        : "/dashboard"

  return [
    {
      title: "Overview",
      url: overviewUrl,
      icon: <HugeiconsIcon icon={GridViewIcon} strokeWidth={2} />,
    },
    {
      title: "Profile",
      url: "/dashboard/profile",
      icon: <HugeiconsIcon icon={UserCircleIcon} strokeWidth={2} />,
    },
    {
      title: "Settings",
      url: "/dashboard/settings",
      icon: <HugeiconsIcon icon={Settings05Icon} strokeWidth={2} />,
    },
  ]
}

export const userNavItems: NavItem[] = [
  {
    title: "Bookings",
    url: "/dashboard/bookings",
    icon: <HugeiconsIcon icon={Calendar03Icon} strokeWidth={2} />,
  },
  {
    title: "Notifications",
    url: "/dashboard/notifications",
    icon: <HugeiconsIcon icon={Notification01Icon} strokeWidth={2} />,
  },
  {
    title: "Become a Host",
    url: "/dashboard/become-host",
    icon: <HugeiconsIcon icon={UserAdd01Icon} strokeWidth={2} />,
  },
  {
    title: "Reviews",
    url: "/dashboard/reviews",
    icon: <HugeiconsIcon icon={StarIcon} strokeWidth={2} />,
  },
]

export const hostNavItems: NavItem[] = [
  {
    title: "My Field",
    url: "/dashboard/host/field",
    icon: <HugeiconsIcon icon={Sad01Icon} strokeWidth={2} />,
  },
  {
    title: "Bookings",
    url: "/dashboard/host/bookings",
    icon: <HugeiconsIcon icon={Calendar01Icon} strokeWidth={2} />,
  },
]

export const adminNavItems: NavItem[] = [
  {
    title: "Users",
    url: "/dashboard/admin/users",
    icon: <HugeiconsIcon icon={UserGroupIcon} strokeWidth={2} />,
  },
  {
    title: "Hosts",
    url: "/dashboard/admin/hosts",
    icon: <HugeiconsIcon icon={Building01Icon} strokeWidth={2} />,
  },
  {
    title: "Fields",
    url: "/dashboard/admin/fields",
    icon: <HugeiconsIcon icon={GridTableIcon} strokeWidth={2} />,
  },
  {
    title: "Bookings",
    url: "/dashboard/admin/bookings",
    icon: <HugeiconsIcon icon={BookOpen02Icon} strokeWidth={2} />,
  },
  {
    title: "Reviews",
    url: "/dashboard/admin/reviews",
    icon: <HugeiconsIcon icon={Stairs01Icon} strokeWidth={2} />,
  },
]

export const getNavItemsByRole = (role: UserRole): NavItem[] => {
  const common = getCommonNavItems(role)

  switch (role) {
    case "SUPER_ADMIN":
    case "ADMIN":
      return [...common, ...adminNavItems]

    case "HOST":
      return [...common, ...hostNavItems]

    case "USER":
      return [...common, ...userNavItems]

    default:
      return common
  }
}

const teams = [
  {
    name: "Khelaghor",
    logo: <span className="font-bold text-sm">KG</span>,
    plan: "Sports Booking",
  },
]

export async function AppSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const user = await verifyTokenUser()
  const navItems = getNavItemsByRole(user.role)

  return (
    <Sidebar variant="floating" collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navItems} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser
          user={{
            name: user.name,
            email: user.email,
            avatar: user.avatar ?? "",
          }}
        />
      </SidebarFooter>
    </Sidebar>
  )
}