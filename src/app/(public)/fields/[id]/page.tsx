/* eslint-disable @typescript-eslint/no-unused-vars */
import { SlotBooking } from "@/components/modules/fields/SlotBooking"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { getFieldById, getFieldSlots } from "@/queries/field.queries"
import { getFieldReviews } from "@/queries/review.queries"
import { getCurrentUser } from "@/queries/user.queries"
import {
    CheckCircle2Icon,
    ChevronLeftIcon,
    MapPinIcon,
    MessageSquareIcon,
    StarIcon,
    UsersIcon
} from "lucide-react"
import type { Metadata, ResolvingMetadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"

import { cn } from "@/lib/utils"

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

    // Concurrent server-side fetching
    const [fieldRes, slotsRes, reviewsRes, userRes] = await Promise.all([
        getFieldById(id),
        getFieldSlots(id),
        getFieldReviews(id),
        getCurrentUser(),
    ])

    const field = fieldRes?.data
    if (!field) {
        notFound()
    }

    const slots = slotsRes?.data || []
    const reviewsData = reviewsRes?.data || { averageRating: 0, totalReviews: 0, reviews: [] }
    const user = userRes?.data || null

    const defaultImage = "https://lh3.googleusercontent.com/aida-public/AB6AXuATMvgp21zV6gHYMRghON2uOvIWQpqgPlPITFG4V1yUz1N5sgdPqinhTWugHpbZc9neum3yQVDWiN8RYFxf1dktDlJzZ6FDZqW0EKuLTvEvg3sLMqsuys2y4xNqjP3xiPM4Kcx_gcUhjONO-bdXlks4zAr22KSUDGBEqhuxEhcVjhv2Mt5LXCi6EocRrGPyEiiS8jajPrOY_RQE4w45yjELpnpl0vdUcIL5Og2tdMxS4li7mBeSlA4nEKf594s9h9JqP_msuy4PqhU"
    const images = field.images && field.images.length > 0 ? field.images : [defaultImage]

    return (
        <div className="bg-background text-foreground min-h-screen pb-24">
            {/* Top Navigation / Breadcrumbs */}
            <div className="max-w-7xl mx-auto px-8 pt-8">
                <Link
                    href="/fields"
                    className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-on-surface-variant hover:text-white transition-colors"
                >
                    <ChevronLeftIcon className="h-4 w-4 text-primary-container" />
                    <span>Back to all fields</span>
                </Link>
            </div>

            {/* Main Venue Title and Quick Info */}
            <div className="max-w-7xl mx-auto px-8 mt-6">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
                    <div>
                        <div className="flex items-center gap-2.5 mb-3">
                            <Badge className="bg-primary-container text-on-primary-container font-black uppercase text-[10px] tracking-widest px-2.5 py-1">
                                {field.sportType}
                            </Badge>
                            <Badge variant="outline" className="border-white/10 text-on-surface-variant font-bold text-[10px] tracking-widest uppercase">
                                {field.status}
                            </Badge>
                        </div>
                        <h1 className="font-headline text-4xl md:text-5xl lg:text-6xl font-black italic uppercase tracking-wide leading-none">
                            {field.name}
                        </h1>
                        <address className="flex items-center text-on-surface-variant text-sm md:text-base mt-3 not-italic font-medium">
                            <MapPinIcon className="w-4 h-4 mr-2 shrink-0 text-primary-container" />
                            <span>{field.address}, {field.area}, {field.division}</span>
                        </address>
                    </div>

                    <div className="flex items-center gap-4">
                        <div
                            className="flex flex-col items-center justify-center bg-surface-container border border-white/5 rounded-xl px-5 py-3 shrink-0"
                            aria-label={`Rating: ${field.averageRating} out of 5 stars`}
                        >
                            <div className="flex items-center gap-1.5 text-lg font-black text-white">
                                <StarIcon className="w-5 h-5 fill-tertiary-fixed text-tertiary-fixed" strokeWidth={0} />
                                <span>{field.averageRating > 0 ? field.averageRating.toFixed(1) : "New"}</span>
                            </div>
                            <span className="text-[10px] uppercase font-bold text-on-surface-variant tracking-wider mt-1">
                                {field.totalReviews} {field.totalReviews === 1 ? "Review" : "Reviews"}
                            </span>
                        </div>

                        <div className="flex flex-col items-center justify-center bg-surface-container border border-white/5 rounded-xl px-5 py-3 shrink-0">
                            <div className="flex items-center gap-1.5 text-lg font-black text-white">
                                <UsersIcon className="w-5 h-5 text-primary-container" />
                                <span>{field.maxPlayers}</span>
                            </div>
                            <span className="text-[10px] uppercase font-bold text-on-surface-variant tracking-wider mt-1">
                                Max Capacity
                            </span>
                        </div>
                    </div>
                </div>

                {/* Photo Gallery Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 rounded-2xl overflow-hidden border border-white/5 bg-surface-container/20">
                    <div className={cn(
                        "relative h-75 md:h-112.5",
                        images.length === 1 ? "md:col-span-3" : "md:col-span-2"
                    )}>
                        <Image
                            src={images[0]}
                            alt={`${field.name} primary photo`}
                            fill
                            className="object-cover"
                            priority
                            sizes="(max-width: 768px) 100vw, 66vw"
                        />
                    </div>
                    {images.length > 1 && (
                        <div className={cn(
                            "grid gap-4 h-75 md:h-112.5",
                            images.length === 2 ? "grid-rows-1" : "grid-rows-2"
                        )}>
                            {images.slice(1, 3).map((img, idx) => (
                                <div key={idx} className="relative h-full w-full overflow-hidden">
                                    <Image
                                        src={img}
                                        alt={`${field.name} secondary photo ${idx + 1}`}
                                        fill
                                        className="object-cover"
                                        sizes="(max-width: 768px) 100vw, 33vw"
                                    />
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Detailed Description and Facilities */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mt-12">
                    <div className="lg:col-span-8 space-y-8">
                        <div>
                            <h2 className="text-xl font-headline font-black italic uppercase tracking-wider text-white mb-4 border-b border-white/5 pb-2">
                                Venue Overview
                            </h2>
                            <p className="text-on-surface-variant text-base leading-relaxed whitespace-pre-line">
                                {field.description}
                            </p>
                        </div>

                        <div>
                            <h2 className="text-xl font-headline font-black italic uppercase tracking-wider text-white mb-4 border-b border-white/5 pb-2">
                                Facilities &amp; Amenities
                            </h2>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                {field.facilities?.map((facility, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center gap-2.5 bg-surface-container border border-white/5 rounded-xl px-4 py-3 text-sm text-on-surface font-semibold"
                                    >
                                        <CheckCircle2Icon className="h-4.5 w-4.5 text-primary-container shrink-0" />
                                        <span>{facility}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="lg:col-span-4 bg-surface-container/30 border border-white/5 rounded-2xl p-6 h-fit">
                        <h3 className="text-lg font-headline font-black italic uppercase tracking-wider text-white mb-4">
                            Location Details
                        </h3>
                        <div className="space-y-4 text-sm font-medium text-on-surface-variant">
                            <div>
                                <span className="block text-[10px] uppercase font-black tracking-widest text-primary-container mb-1">
                                    Division
                                </span>
                                <span className="text-white font-bold text-base">{field.division}</span>
                            </div>
                            <div>
                                <span className="block text-[10px] uppercase font-black tracking-widest text-primary-container mb-1">
                                    District
                                </span>
                                <span className="text-white font-bold text-base">{field.area}</span>
                            </div>
                            <div>
                                <span className="block text-[10px] uppercase font-black tracking-widest text-primary-container mb-1">
                                    Full Address
                                </span>
                                <span className="text-white font-semibold leading-relaxed">{field.address}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <Separator className="my-16 border-white/5" />

                {/* Slot Booking Widget Section */}
                <div id="booking-section" className="scroll-mt-24">
                    <h2 className="text-2xl md:text-3xl font-headline font-black italic uppercase tracking-wider text-white mb-8">
                        Reserve Your Session
                    </h2>
                    <SlotBooking slots={slots} fieldId={field.id} user={user} />
                </div>

                <Separator className="my-16 border-white/5" />

                {/* Customer Reviews Section */}
                <div>
                    <div className="flex items-center justify-between mb-8 border-b border-white/5 pb-4">
                        <h2 className="text-2xl md:text-3xl font-headline font-black italic uppercase tracking-wider text-white flex items-center gap-3">
                            <MessageSquareIcon className="h-7 w-7 text-primary-container" />
                            <span>Customer Reviews</span>
                        </h2>
                        {reviewsData.averageRating > 0 && (
                            <div className="flex items-center gap-2">
                                <StarIcon className="w-5 h-5 fill-tertiary-fixed text-tertiary-fixed" strokeWidth={0} />
                                <span className="text-lg font-black text-white">{reviewsData.averageRating.toFixed(1)}</span>
                                <span className="text-xs font-bold text-on-surface-variant">
                                    ({reviewsData.totalReviews} Total)
                                </span>
                            </div>
                        )}
                    </div>

                    {reviewsData.reviews.length === 0 ? (
                        <div className="bg-surface-container/30 border border-white/5 rounded-2xl p-10 text-center text-on-surface-variant font-medium text-sm">
                            No reviews have been posted for this venue yet. Be the first to play and review!
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {reviewsData.reviews.map((review) => (
                                <article
                                    key={review.id}
                                    className="bg-surface-container border border-white/5 rounded-2xl p-6 flex flex-col justify-between"
                                >
                                    <div>
                                        <div className="flex items-center justify-between gap-4 mb-4">
                                            <div className="flex items-center gap-3">
                                                <div className="relative h-10 w-10 rounded-full overflow-hidden bg-surface-container-high border border-white/5 flex items-center justify-center font-black uppercase text-sm text-primary-container">
                                                    {review.user?.avatar ? (
                                                        <Image
                                                            src={review.user.avatar}
                                                            alt={`${review.user.name} avatar`}
                                                            fill
                                                            className="object-cover"
                                                        />
                                                    ) : (
                                                        review.user?.name?.slice(0, 2)
                                                    )}
                                                </div>
                                                <div>
                                                    <span className="block font-bold text-sm text-white">
                                                        {review.user?.name || "Khelaghor Player"}
                                                    </span>
                                                    <span className="block text-[10px] text-on-surface-variant font-bold">
                                                        {new Date(review.createdAt).toLocaleDateString("en-US", {
                                                            year: "numeric",
                                                            month: "long",
                                                            day: "numeric",
                                                        })}
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-1 bg-black/30 px-2 py-0.5 rounded-full border border-white/5 text-xs font-black">
                                                <StarIcon className="w-3.5 h-3.5 fill-tertiary-fixed text-tertiary-fixed" strokeWidth={0} />
                                                <span>{review.rating}</span>
                                            </div>
                                        </div>

                                        <p className="text-on-surface-variant text-sm leading-relaxed italic">
                                            &ldquo;{review.comment}&rdquo;
                                        </p>
                                    </div>
                                </article>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}