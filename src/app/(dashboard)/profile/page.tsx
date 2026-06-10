import type { Metadata } from "next"

export const metadata: Metadata = {
    title: "Profile | Khelaghor Dashboard",
    description: "View and edit your Khelaghor profile.",
}

export default function ProfilePage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="font-headline text-3xl font-bold text-on-surface">
                    Profile
                </h1>
                <p className="mt-1 text-on-surface-variant">
                    Manage your personal information and account details.
                </p>
            </div>
        </div>
    )
}
