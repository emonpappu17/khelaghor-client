import { UserRole } from "@/types/api.types";

export const ROUTES = {
    // Public
    HOME: "/",
    FIELDS: "/fields",
    ABOUT: "/about",
    TERMS: "/terms",

    // Auth 
    LOGIN: "/login",
    REGISTER: "/register",
    FORGOT_PASSWORD: "/forgot-password",
    VERIFY_EMAIL: "/verify-email",
    RESET_PASSWORD: "/reset-password",

    // Shared dashboard
    DASHBOARD: "/dashboard",
    PROFILE: "/dashboard/profile",
    SETTINGS: "/dashboard/settings",

    // User
    USER_BOOKINGS: "/dashboard/user/bookings",
    USER_NOTIFICATIONS: "/dashboard/user/notifications",
    USER_BECOME_HOST: "/dashboard/user/become-host",
    USER_REVIEWS: "/dashboard/user/reviews",

    // Host
    HOST_FIELDS: "/dashboard/host/field",
    HOST_BOOKINGS: "/dashboard/host/bookings",

    // Admin
    ADMIN_USERS: "/dashboard/admin/users",
    ADMIN_HOSTS: "/dashboard/admin/hosts",
    ADMIN_FIELDS: "/dashboard/admin/fields",
    ADMIN_BOOKINGS: "/dashboard/admin/bookings",
    ADMIN_REVIEWS: "/dashboard/admin/reviews",
} as const;


export const PUBLIC_ROUTES: string[] = [
    ROUTES.HOME,
    ROUTES.FIELDS,
    ROUTES.ABOUT,
    ROUTES.TERMS,
];

export const AUTH_ROUTES: string[] = [
    ROUTES.LOGIN,
    ROUTES.REGISTER,
    ROUTES.FORGOT_PASSWORD,
    ROUTES.VERIFY_EMAIL,
    ROUTES.RESET_PASSWORD,
];

type RoleGate = {
    prefix: string;
    roles: UserRole[];
};

export const ROLE_GATES: RoleGate[] = [
    //  ADMIN
    {
        prefix: "/dashboard/admin",
        roles: ["ADMIN", "SUPER_ADMIN"],
    },

    //  HOST
    {
        prefix: "/dashboard/host",
        roles: ["HOST"],
    },

    //  USER ROUTES 
    {
        prefix: "/dashboard/user",
        roles: ["USER"],
    },

    //  COMMON DASHBOARD 
    {
        prefix: "/dashboard",
        roles: ["USER", "HOST", "ADMIN", "SUPER_ADMIN"],
    },
];

export function isPublicRoute(pathname: string): boolean {
    if (pathname === "/") return true;

    return PUBLIC_ROUTES.some(
        (route) => route !== "/" && pathname.startsWith(route)
    );
}

export function isAuthRoute(pathname: string): boolean {
    return AUTH_ROUTES.some((route) => pathname.startsWith(route));
}

export function isProtectedRoute(pathname: string): boolean {
    return ROLE_GATES.some((gate) => pathname.startsWith(gate.prefix));
}

export function getAllowedRoles(pathname: string): UserRole[] | null {
    const matchedGate = ROLE_GATES.find((gate) =>
        pathname.startsWith(gate.prefix)
    );

    return matchedGate?.roles ?? null;
}

export function canAccessRoute(
    pathname: string,
    role: UserRole
): boolean {
    const allowedRoles = getAllowedRoles(pathname);

    // Public route
    if (!allowedRoles) return true;

    return allowedRoles.includes(role);
}

export function getDefaultDashboardRoute(
    role: UserRole | null
): string {
    switch (role) {
        case "SUPER_ADMIN":
        case "ADMIN":
            return "/dashboard/admin";

        case "HOST":
            return "/dashboard/host";

        case "USER":
            return "/dashboard/user";

        default:
            return "/";
    }
}

export const REDIRECT = {
    AFTER_LOGIN: "/dashboard",
    AFTER_LOGOUT: "/login",
    UNAUTHORIZED: "/dashboard",
} as const;