import {
    BookOpen02Icon,
    Building01Icon,
    Calendar01Icon,
    Calendar03Icon,
    GridTableIcon,
    GridViewIcon,
    Notification01Icon,
    Sad01Icon,
    Settings05Icon,
    Stairs01Icon,
    StarIcon,
    UserAdd01Icon,
    UserCircleIcon,
    UserGroupIcon,
} from "@hugeicons/core-free-icons";

export const sidebarIcons = {
    dashboard: GridViewIcon,

    profile: UserCircleIcon,

    settings: Settings05Icon,

    bookings: Calendar03Icon,

    notifications: Notification01Icon,

    becomeHost: UserAdd01Icon,

    reviews: StarIcon,

    fields: Sad01Icon,

    users: UserGroupIcon,

    hosts: Building01Icon,

    adminFields: GridTableIcon,

    adminBookings: BookOpen02Icon,

    hostBookings: Calendar01Icon,

    adminReviews: Stairs01Icon,
} as const;