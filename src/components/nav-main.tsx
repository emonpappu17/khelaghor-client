// "use client";

// import Link from "next/link";
// import { usePathname } from "next/navigation";

// import {
//   SidebarGroup,
//   SidebarMenu,
//   SidebarMenuButton,
//   SidebarMenuItem,
// } from "@/components/ui/sidebar";

// import { NavItem } from "@/lib/sidebar.config";
// import { sidebarIcons } from "@/lib/sidebar-icons";

// import { HugeiconsIcon } from "@hugeicons/react";

// export function NavMain({
//   items,
// }: {
//   items: NavItem[];
// }) {
//   const pathname = usePathname();

//   return (
//     <SidebarGroup>
//       <SidebarMenu className="space-y-3">
//         {items.map((item) => {
//           const isActive =
//             pathname === item.url
//           const IconComponent =
//             sidebarIcons[
//             item.icon as keyof typeof sidebarIcons
//             ];

//           return (
//             <SidebarMenuItem key={item.title}>
//               <SidebarMenuButton
//                 asChild
//                 tooltip={item.title}
//                 isActive={isActive}
//               >
//                 <Link href={item.url}>
//                   {IconComponent && (
//                     <HugeiconsIcon
//                       icon={IconComponent}
//                       strokeWidth={2}
//                     />
//                   )}

//                   <span>{item.title}</span>
//                 </Link>
//               </SidebarMenuButton>
//             </SidebarMenuItem>
//           );
//         })}
//       </SidebarMenu>
//     </SidebarGroup>
//   );
// }



"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

import { NavItem } from "@/lib/sidebar.config";
import { sidebarIcons } from "@/lib/sidebar-icons";

import { HugeiconsIcon } from "@hugeicons/react";

export function NavMain({
  items,
}: {
  items: NavItem[];
}) {
  const pathname = usePathname();

  return (
    <SidebarGroup>
      <SidebarMenu className="space-y-3">
        {items.map((item) => {
          const isActive = pathname === item.url;

          const Icon = sidebarIcons[item.icon];

          return (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                asChild
                tooltip={item.title}
                isActive={isActive}
              >
                <Link href={item.url}>
                  <HugeiconsIcon
                    icon={Icon}
                    strokeWidth={2}
                  />

                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}