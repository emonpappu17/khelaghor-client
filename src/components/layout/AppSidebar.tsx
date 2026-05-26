import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "@/components/ui/sidebar";

import { TeamSwitcher } from "@/components/team-switcher";
import { Suspense } from "react";
import { NavMainAsync } from "./NavMainAsync";
import { NavMainSkeleton } from "./NavMainSkeleton";
import { NavUserAsync } from "./NavUserAsync";
import { NavUserSkeleton } from "./NavUserSkeleton";


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

  return (
    <Sidebar variant="floating" collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={teams} />
      </SidebarHeader>

      <SidebarContent>
        <Suspense fallback={<NavMainSkeleton />}>
          <NavMainAsync />
        </Suspense>
      </SidebarContent>

      <SidebarFooter>
        <Suspense fallback={<NavUserSkeleton />}>
          <NavUserAsync />
        </Suspense>
      </SidebarFooter>
    </Sidebar>
  );
}