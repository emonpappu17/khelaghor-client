import { NextRequest, NextResponse } from "next/server"
// import { apiFetch } from "@/lib/apiFetch"
import { forwardAuthCookies } from "@/lib/cookie"
import { getDefaultDashboardRoute } from "@/lib/route.config"
import type { UserRole } from "@/types/api.types"
import { apiFetch } from "@/lib/api"

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams
    const code = searchParams.get("code")
    const redirectTo = searchParams.get("redirectTo")
    const error = searchParams.get("error")

    if (error || !code) {
        return NextResponse.redirect(
            new URL("/login?error=GoogleAuthFailed", request.url)
        )
    }

    const response = await apiFetch.post("/auth/google/exchange", {
        body: { code },
    })

    const json: {
        success: boolean
        message: string
        data?: { accessToken: string; user: { role: UserRole } }
    } = await response.json().catch(() => ({
        success: false,
        message: "Failed to parse server response.",
    }))

    if (!response.ok || !json.success) {
        return NextResponse.redirect(
            new URL("/login?error=GoogleAuthFailed", request.url)
        )
    }

    // Route Handlers CAN set cookies — this is the missing piece
    await forwardAuthCookies(response)

    const destination =
        redirectTo && redirectTo.startsWith("/")
            ? redirectTo
            : getDefaultDashboardRoute(json.data?.user.role as UserRole)

    return NextResponse.redirect(new URL(destination, request.url))
}