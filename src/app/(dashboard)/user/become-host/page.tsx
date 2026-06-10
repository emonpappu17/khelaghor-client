import type { Metadata } from "next"

export const metadata: Metadata = {
    title: "Become a Host | Khelaghor Dashboard",
    description: "Apply to become a host on Khelaghor and list your sports fields.",
}

export default function BecomeHostPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="font-headline text-3xl font-bold text-on-surface">
                    Become a Host
                </h1>
                <p className="mt-1 text-on-surface-variant">
                    List your sports fields on Khelaghor and start earning. Submit your
                    application below to get started.
                </p>
            </div>
        </div>
    )
}
