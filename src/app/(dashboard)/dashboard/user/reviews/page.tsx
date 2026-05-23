import type { Metadata } from "next"

export const metadata: Metadata = {
    title: "My Reviews | Khelaghor Dashboard",
    description: "View and manage your reviews for sports fields on Khelaghor.",
}

export default function ReviewPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="font-headline text-3xl font-bold text-on-surface">
                    My Reviews
                </h1>
                <p className="mt-1 text-on-surface-variant">
                    View and manage reviews you&apos;ve written for booked fields.
                </p>
            </div>
        </div>
    )
}
