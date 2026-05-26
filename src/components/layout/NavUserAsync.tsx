import { getCurrentUser } from "@/queries/user.queries";
import { NavUser } from "../nav-user";

export async function NavUserAsync() {
    const currentUser = await getCurrentUser();
    return (
        <NavUser user={{
            name: currentUser?.data?.name as string,
            email: currentUser?.data?.email as string,
            avatar: currentUser?.data?.avatar ?? "",
        }} />
    );
}