import type { Metadata } from "next"

export const metadata: Metadata = {
    title: "My Fields | Khelaghor Dashboard",
    description: "Manage your sports fields, slots, and availability on Khelaghor.",
}

export default function HostFieldPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="font-headline text-3xl font-bold text-on-surface">
                    My Fields
                </h1>
                <p className="mt-1 text-on-surface-variant">
                    Manage your listed sports fields, update availability, and configure slots.
                </p>
            </div>
        </div>
    )
}
