import { FieldsFilterControls } from "@/components/modules/fields/FieldsFilterControls"
import FieldsPageContent from "@/components/modules/fields/FieldsPageContent"
import { CompassIcon } from "lucide-react"
import type { Metadata } from "next"
import { Suspense } from "react"

// Dynamic SEO metadata
export const metadata: Metadata = {
    title: "Elite Venues & Sports Fields | Khelaghor",
    description:
        "Browse, search, and book elite-grade sports facilities across Bangladesh. Football turfs, cricket wickets, badminton courts, tennis and basketball venues.",
}

interface FieldsPageProps {
    searchParams: Promise<{
        sportType?: string
        division?: string
        searchTerm?: string
        page?: string
        limit?: string
        layout?: "grid" | "list"
    }>
}

export default async function FieldsPage({ searchParams }: FieldsPageProps) {
    return (
        <div className="bg-background text-foreground min-h-screen pb-24">
            {/* Header Hero Section */}
            <div className="relative py-20 bg-surface-container-lowest border-b border-white/5 overflow-hidden">
                <div className="absolute inset-0 bg-grid-pattern opacity-10 pointer-events-none" />
                <div className="absolute top-0 right-0 w-125 h-125 bg-primary-container/10 rounded-full blur-[120px] pointer-events-none" />

                <div className="max-w-7xl mx-auto px-8 relative flex flex-col items-center md:items-start text-center md:text-left">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary-container/10 border border-primary-container/20 text-primary-container text-xs font-bold uppercase tracking-widest mb-6">
                        <CompassIcon className="h-3.5 w-3.5" />
                        <span>Explore Facilities</span>
                    </div>
                    <h1 className="font-headline text-5xl md:text-7xl font-black italic uppercase leading-tight tracking-tight mb-4">
                        ELITE <br className="md:hidden" />
                        <span className="text-primary-container">VENUES</span>
                    </h1>
                    <p className="text-on-surface-variant text-base md:text-lg max-w-xl font-medium">
                        Optimized for surgical precision, high-octane performance, and seamless instant reservations.
                    </p>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-8 mt-12">
                {/* Search & Filter Controls */}
                <FieldsFilterControls />


                {/* Results Section */}
                <Suspense fallback={<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <div
                            key={i}
                            className="h-80 rounded-xl bg-surface-container animate-pulse"
                        />
                    ))}
                </div>}>
                    <FieldsPageContent searchParams={searchParams} />
                </Suspense>
            </div>
        </div>
    )
}