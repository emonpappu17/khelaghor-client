import * as React from "react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "@/components/ui/sidebar";

import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import { TeamSwitcher } from "@/components/team-switcher";

import { TJwtPayload, verifyTokenUser } from "@/lib/cookie";

import {
  getNavItemsByRole,
} from "@/lib/sidebar.config";
import { getCurrentUser } from "@/queries/user.queries";

const teams = [
  {
    name: "Khelaghor",
    logo: (
      <span className="font-bold text-sm">
        KG
      </span>
    ),
    plan: "Sports Booking",
  },
];

export async function AppSidebar(
  props: React.ComponentProps<typeof Sidebar>
) {
  const user = await verifyTokenUser() as TJwtPayload;

  const navItems = getNavItemsByRole(user.role);
  const currentUser = await getCurrentUser();

  return (
    <Sidebar
      variant="floating"
      collapsible="icon"
      {...props}
    >
      <SidebarHeader>
        <TeamSwitcher teams={teams} />
      </SidebarHeader>

      <SidebarContent>
        <NavMain items={navItems} />
      </SidebarContent>

      <SidebarFooter>
        <NavUser
          user={{
            name: currentUser?.data?.name as string,
            email: currentUser?.data?.email as string,
            avatar: currentUser?.data?.avatar as string ?? "",
          }}
        />
      </SidebarFooter>
    </Sidebar>
  );
}