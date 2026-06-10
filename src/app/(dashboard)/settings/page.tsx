import type { Metadata } from "next"

export const metadata: Metadata = {
    title: "Settings | Khelaghor Dashboard",
    description: "Manage your Khelaghor account settings and preferences.",
}

export default function SettingsPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="font-headline text-3xl font-bold text-on-surface">
                    Settings
                </h1>
                <p className="mt-1 text-on-surface-variant">
                    Configure your account preferences, notifications, and security settings.
                </p>
            </div>
        </div>
    )
}
