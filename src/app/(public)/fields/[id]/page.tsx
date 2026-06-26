/* eslint-disable @typescript-eslint/no-unused-vars */
import BookingSection from "@/components/modules/fields/BookingSection"
import BookingSectionSkeleton from "@/components/modules/fields/BookingSectionSkeleton"
import FieldHeroSection from "@/components/modules/fields/FieldHeroSection"
import ReviewsSection from "@/components/modules/fields/ReviewsSection"
import ReviewsSectionSkeleton from "@/components/modules/fields/ReviewsSectionSkeleton"
import { Separator } from "@/components/ui/separator"
import { getFieldById } from "@/queries/field.queries"
import { MessageSquareIcon } from "lucide-react"
import type { Metadata, ResolvingMetadata } from "next"
import { notFound } from "next/navigation"
import { Suspense } from "react"


interface FieldDetailPageProps {
    params: Promise<{ id: string }>
}

// Generate dynamic SEO metadata based on field details
export async function generateMetadata(
    { params }: FieldDetailPageProps,
    parent: ResolvingMetadata
): Promise<Metadata> {
    const { id } = await params
    const fieldRes = await getFieldById(id)
    const field = fieldRes?.data

    if (!field) {
        return {
            title: "Venue Not Found | Khelaghor",
        }
    }

    return {
        title: `Book ${field.name} in ${field.area} | Khelaghor`,
        description: `Book slots for ${field.name} located in ${field.area}, ${field.division}. Features: ${field.facilities?.join(", ")}. Max players: ${field.maxPlayers}.`,
        openGraph: {
            title: `Book ${field.name} - ${field.sportType} Venue | Khelaghor`,
            description: field.description,
            images: field.images?.[0] ? [{ url: field.images[0] }] : [],
        },
    }
}

export default async function FieldDetailPage({ params }: FieldDetailPageProps) {
    const { id } = await params

    // Fetch only the field at page level so the rest can stream
    const fieldRes = await getFieldById(id)
    const field = fieldRes?.data
    if (!field) notFound()

    const defaultImage = "https://lh3.googleusercontent.com/aida-public/AB6AXuATMvgp21zV6gHYMRghON2uOvIWQpqgPlPITFG4V1yUz1N5sgdPqinhTWugHpbZc9neum3yQVDWiN8RYFxf1dktDlJzZ6FDZqW0EKuLTvEvg3sLMqsuys2y4xNqjP3xiPM4Kcx_gcUhjONO-bdXlks4zAr22KSUDGBEqhuxEhcVjhv2Mt5LXCi6EocRrGPyEiiS8jajPrOY_RQE4w45yjELpnpl0vdUcIL5Og2tdMxS4li7mBeSlA4nEKf594s9h9JqP_msuy4PqhU"
    const images = field.images && field.images.length > 0 ? field.images : [defaultImage]

    return (
        <div className="bg-background text-foreground min-h-screen pb-24">
            {/* Field hero (depends on field) */}
            <FieldHeroSection field={field} images={images} />
            {/* <h1>hi</h1> */}
            <Separator className="my-16 border-white/5" />

            {/* Slot Booking Widget Section (streams independently) */}
            <div className="max-w-7xl mx-auto px-8">
                <div id="booking-section" className="scroll-mt-24">
                    <h2 className="text-2xl md:text-3xl font-headline font-black italic uppercase tracking-wider text-white mb-8">
                        Reserve Your Session
                    </h2>
                    <Suspense fallback={<BookingSectionSkeleton />}>
                        <BookingSection fieldId={field.id} />
                    </Suspense>
                </div>

                <Separator className="my-16 border-white/5" />

                {/* Customer Reviews Section (streams independently) */}
                <div>
                    <div className="flex items-center justify-between mb-8 border-b border-white/5 pb-4">
                        <h2 className="text-2xl md:text-3xl font-headline font-black italic uppercase tracking-wider text-white flex items-center gap-3">
                            <MessageSquareIcon className="h-7 w-7 text-primary-container" />
                            <span>Customer Reviews</span>
                        </h2>
                    </div>

                    <Suspense fallback={<ReviewsSectionSkeleton />}>
                        <ReviewsSection fieldId={field.id} />
                    </Suspense>
                </div>
            </div>
        </div>
    )
}