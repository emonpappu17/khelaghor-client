import type { Metadata } from "next"

export const metadata: Metadata = {
    title: "Manage Reviews | Khelaghor Admin",
    description: "Moderate and manage user reviews on the Khelaghor platform.",
}

export default function AdminReviewPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="font-headline text-3xl font-bold text-on-surface">
                    Reviews
                </h1>
                <p className="mt-1 text-on-surface-variant">
                    Moderate user reviews — flag inappropriate content and manage ratings.
                </p>
            </div>
        </div>
    )
}
