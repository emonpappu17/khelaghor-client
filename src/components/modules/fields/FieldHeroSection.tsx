import Image from "next/image"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2Icon, ChevronLeftIcon, MapPinIcon, StarIcon, UsersIcon } from "lucide-react"
import type { Field } from "@/types/field.types"
import { cn } from "@/lib/utils"

interface Props {
    field: Field
    images: string[]
}

export default function FieldHeroSection({ field, images }: Props) {
    return (
        <>
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
            </div>
        </>
    )
}
