import type { Metadata } from "next"

export const metadata: Metadata = {
    title: "About | Khelaghor",
    description: "Learn about Khelaghor — Bangladesh's premier sports field booking platform.",
}

export default function AboutPage() {
    return (
        <section className="container mx-auto max-w-4xl px-4 py-20">
            <h1 className="font-headline text-4xl font-bold text-on-surface md:text-5xl">
                About <span className="text-primary-container">Khelaghor</span>
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-on-surface-variant">
                Khelaghor is Bangladesh&apos;s premier platform for discovering and booking
                sports fields. Whether you&apos;re looking for a football turf, cricket
                pitch, badminton court, or basketball arena — we connect players with the
                best venues across the country.
            </p>
        </section>
    )
}
