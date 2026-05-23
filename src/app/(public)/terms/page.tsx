import type { Metadata } from "next"

export const metadata: Metadata = {
    title: "Terms & Conditions | Khelaghor",
    description: "Read the terms and conditions for using the Khelaghor sports field booking platform.",
}

export default function TermsPage() {
    return (
        <section className="container mx-auto max-w-4xl px-4 py-20">
            <h1 className="font-headline text-4xl font-bold text-on-surface md:text-5xl">
                Terms &amp; Conditions
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-on-surface-variant">
                By using Khelaghor, you agree to the following terms and conditions.
                Please read them carefully before booking any sports field or registering
                as a host on our platform.
            </p>
        </section>
    )
}
