import { getNavItemsByRole } from "@/lib/sidebar.config";
import { getCurrentUser } from "@/queries/user.queries";
import { UserRole } from "@/types/api.types";
import { NavMain } from "../nav-main";

export async function NavMainAsync() {
    const currentUser = await getCurrentUser();
    const navItems = getNavItemsByRole(currentUser?.data?.role as UserRole);
    return <NavMain items={navItems} />;
}