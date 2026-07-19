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
    // DASHBOARD: "",
    PROFILE: "/profile",
    SETTINGS: "/settings",

    // User
    USER_BOOKINGS: "/user/bookings",
    USER_NOTIFICATIONS: "/user/notifications",
    USER_BECOME_HOST: "/user/become-host",
    USER_REVIEWS: "/user/reviews",

    // Host
    HOST_FIELDS: "/host/field",
    HOST_BOOKINGS: "/host/bookings",
    HOST_NOTIFICATIONS: "/host/notifications",

    // Admin
    ADMIN_USERS: "/admin/users",
    ADMIN_HOSTS: "/admin/hosts",
    ADMIN_FIELDS: "/admin/fields",
    ADMIN_BOOKINGS: "/admin/bookings",
    ADMIN_REVIEWS: "/admin/reviews",
    ADMIN_NOTIFICATIONS: "/admin/notifications",
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
        prefix: "/admin",
        roles: ["ADMIN", "SUPER_ADMIN"],
    },

    //  HOST
    {
        prefix: "/host",
        roles: ["HOST"],
    },

    //  USER ROUTES 
    {
        prefix: "/user",
        roles: ["USER"],
    },

    //  COMMON DASHBOARD 
    // {
    //     prefix: "",
    //     roles: ["USER", "HOST", "ADMIN", "SUPER_ADMIN"],
    // },
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
            return "/admin";

        case "HOST":
            return "/host";

        case "USER":
            return "/user";

        default:
            return "/";
    }
}

// export const REDIRECT = {
//     AFTER_LOGIN: "",
//     AFTER_LOGOUT: "/login",
//     UNAUTHORIZED: "",
// } as const;