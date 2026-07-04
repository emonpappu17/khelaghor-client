import {
    getAllowedRoles,
    getDefaultDashboardRoute,
    isAuthRoute,
    isProtectedRoute,
    isPublicRoute,
    ROUTES,
} from "@/lib/route.config";
import { NextRequest, NextResponse } from "next/server";

import { getCookie, verifyTokenUser } from "./lib/cookie";


export async function proxy(request: NextRequest) {
    const { pathname, search } = request.nextUrl;

    console.log('pathname==>', pathname);

    if (isPublicRoute(pathname)) {
        return NextResponse.next();
    }

    const accessToken = await getCookie("accessToken");

    const user = accessToken
        ? await verifyTokenUser()
        : null;

    if (isAuthRoute(pathname)) {
        if (user) {
            const dashboardUrl = getDefaultDashboardRoute(user.role);

            return NextResponse.redirect(
                new URL(dashboardUrl, request.url)
            );
        }

        return NextResponse.next();
    }

    if (isProtectedRoute(pathname)) {
        if (!user) {
            const loginUrl = new URL(ROUTES.LOGIN, request.url);

            const callbackUrl = `${pathname}${search}`;

            loginUrl.searchParams.set("callbackUrl", callbackUrl);

            return NextResponse.redirect(loginUrl);
        }

        const allowedRoles = getAllowedRoles(pathname);

        if (
            allowedRoles &&
            !allowedRoles.includes(user.role)
        ) {
            const redirectUrl = getDefaultDashboardRoute(
                user.role
            );

            return NextResponse.redirect(
                new URL(redirectUrl, request.url)
            );
        }

        return NextResponse.next();
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|.well-known).*)',
    ],
}
