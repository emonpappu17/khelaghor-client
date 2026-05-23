import { TJwtPayload, verifyTokenUser } from "@/lib/cookie"
import { getDefaultDashboardRoute } from "@/lib/route.config"

export default async function DashboardPage() {
    const session = await verifyTokenUser() as TJwtPayload
    getDefaultDashboardRoute(session.role)
}