import { ROUTES } from "@/lib/route.config";
import { UserRole } from "@/types/api.types";
import { sidebarIcons } from "./sidebar-icons";

export type NavItem = {
    title: string;
    url: string;
    icon: keyof typeof sidebarIcons;
    roles?: UserRole[];
};

export const getCommonTopNavItems = (
    role: UserRole
): NavItem[] => {
    const overviewUrl =
        role === "ADMIN" || role === "SUPER_ADMIN"
            ? "/admin"
            : role === "HOST"
                ? "/host"
                : "/user";

    return [
        {
            title: "Overview",
            url: overviewUrl,
            icon: "dashboard",
        },
    ];
};

export const commonBottomNavItems: NavItem[] = [
    {
        title: "Profile",
        url: ROUTES.PROFILE,
        icon: "profile",
    },
    {
        title: "Settings",
        url: ROUTES.SETTINGS,
        icon: "settings",
    },
];

export const userNavItems: NavItem[] = [
    {
        title: "Bookings",
        url: ROUTES.USER_BOOKINGS,
        icon: "bookings",
    },
    {
        title: "Notifications",
        url: ROUTES.USER_NOTIFICATIONS,
        icon: "notifications",
    },
    // {
    //     title: "Become a Host",
    //     url: ROUTES.USER_BECOME_HOST,
    //     icon: "becomeHost",
    // },
    {
        title: "Reviews",
        url: ROUTES.USER_REVIEWS,
        icon: "reviews",
    },
];

export const hostNavItems: NavItem[] = [
    {
        title: "Fields",
        url: ROUTES.HOST_FIELDS,
        icon: "fields",
    },
    {
        title: "Bookings",
        url: ROUTES.HOST_BOOKINGS,
        icon: "bookings",
    },
];

export const adminNavItems: NavItem[] = [
    {
        title: "Users",
        url: ROUTES.ADMIN_USERS,
        icon: "users",
    },
    {
        title: "Hosts",
        url: ROUTES.ADMIN_HOSTS,
        icon: "hosts",
    },
    {
        title: "Fields",
        url: ROUTES.ADMIN_FIELDS,
        icon: "fields",
    },
    {
        title: "Bookings",
        url: ROUTES.ADMIN_BOOKINGS,
        icon: "bookings",
    },
    {
        title: "Reviews",
        url: ROUTES.ADMIN_REVIEWS,
        icon: "reviews",
    },
];

export const getNavItemsByRole = (
    role: UserRole
): NavItem[] => {
    const top = getCommonTopNavItems(role);
    const bottom = commonBottomNavItems;

    switch (role) {
        case "SUPER_ADMIN":
        case "ADMIN":
            return [...top, ...adminNavItems, ...bottom];

        case "HOST":
            return [...top, ...hostNavItems, ...bottom];

        case "USER":
            return [...top, ...userNavItems, ...bottom];

        default:
            return [...top, ...bottom];
    }
};