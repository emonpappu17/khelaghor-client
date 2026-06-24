import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type { Field } from "@/types/field.types"
import { MapPinIcon, StarIcon, UsersIcon } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

interface FieldCardProps {
    field: Field
    layout?: "grid" | "list"
}

export function FieldCard({ field, layout = "grid" }: FieldCardProps) {
    const defaultImage = "https://lh3.googleusercontent.com/aida-public/AB6AXuATMvgp21zV6gHYMRghON2uOvIWQpqgPlPITFG4V1yUz1N5sgdPqinhTWugHpbZc9neum3yQVDWiN8RYFxf1dktDlJzZ6FDZqW0EKuLTvEvg3sLMqsuys2y4xNqjP3xiPM4Kcx_gcUhjONO-bdXlks4zAr22KSUDGBEqhuxEhcVjhv2Mt5LXCi6EocRrGPyEiiS8jajPrOY_RQE4w45yjELpnpl0vdUcIL5Og2tdMxS4li7mBeSlA4nEKf594s9h9JqP_msuy4PqhU"
    const displayImage = field.images?.[0] || defaultImage

    if (layout === "list") {
        return (
            <article className="group bg-surface-container rounded-xl overflow-hidden hover:shadow-xl hover:shadow-primary-container/5 transition-all duration-500 border border-white/5 flex flex-col md:flex-row">
                {/* Image Section — always needs an explicit height so next/image fill works */}
                <div className="relative h-56 md:h-auto md:min-h-50 md:w-72 lg:w-80 shrink-0 overflow-hidden">
                    <Image
                        src={displayImage}
                        alt={`${field.name} - ${field.sportType} field`}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, 320px"
                    />
                    <div className="absolute top-4 left-4 bg-primary-container text-on-primary-container px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider z-10">
                        {field.sportType}
                    </div>
                    <div
                        className="absolute top-4 right-4 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-full text-xs font-bold flex items-center gap-1 z-10 border border-white/5"
                        aria-label={`Rating: ${field.averageRating} out of 5`}
                    >
                        <StarIcon className="w-3.5 h-3.5 fill-tertiary-fixed text-tertiary-fixed" strokeWidth={0} />
                        <span>{field.averageRating > 0 ? field.averageRating.toFixed(1) : "New"}</span>
                    </div>
                </div>

                {/* Content Section */}
                <div className="p-6 md:p-8 flex flex-col justify-between flex-1">
                    <div>
                        <div className="flex items-start justify-between gap-4 mb-2">
                            <h3 className="font-headline text-xl md:text-2xl font-black italic tracking-wide group-hover:text-primary-container transition-colors">
                                {field.name}
                            </h3>
                        </div>

                        <address className="flex items-center text-on-surface-variant text-sm mb-4 not-italic font-medium">
                            <MapPinIcon className="w-4 h-4 mr-1.5 shrink-0 text-primary-container" />
                            <span>{field.area}, {field.division}</span>
                        </address>

                        <p className="text-on-surface-variant text-sm line-clamp-2 mb-6">
                            {field.description}
                        </p>

                        <div className="flex flex-wrap gap-1.5 mb-6">
                            {field.facilities?.slice(0, 4).map((facility, index) => (
                                <Badge key={index} variant="outline" className="bg-background border-white/5 text-xs text-on-surface font-semibold py-0.5">
                                    {facility}
                                </Badge>
                            ))}
                            {field.facilities?.length > 4 && (
                                <Badge variant="outline" className="bg-background border-white/5 text-xs text-on-surface-variant font-semibold">
                                    +{field.facilities.length - 4} More
                                </Badge>
                            )}
                        </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-white/5">
                        <div className="flex items-center gap-1.5 text-xs text-on-surface-variant font-bold uppercase tracking-wider">
                            <UsersIcon className="h-4 w-4 text-primary-container" />
                            <span>Max {field.maxPlayers} players</span>
                        </div>
                        <Button asChild className="bg-primary-container text-on-primary-container font-black uppercase tracking-wider text-xs px-6 py-2.5 rounded-lg transition-all hover:scale-95 hover:brightness-110">
                            <Link href={`/fields/${field.id}`}>
                                View slots
                            </Link>
                        </Button>
                    </div>
                </div>
            </article>
        )
    }


    // Grid Layout (Default)
    return (
        <article className="group bg-surface-container rounded-xl overflow-hidden hover:shadow-2xl hover:shadow-primary-container/5 hover:scale-[1.01] transition-all duration-500 border border-white/5 flex flex-col h-full">
            {/* Image Section */}
            <div className="relative h-56 overflow-hidden shrink-0">
                <Image
                    src={displayImage}
                    alt={`${field.name} - ${field.sportType} field`}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 33vw"
                />
                <div className="absolute top-4 left-4 bg-primary-container text-on-primary-container px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider z-10">
                    {field.sportType}
                </div>
                <div
                    className="absolute top-4 right-4 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-full text-xs font-bold flex items-center space-x-1 z-10 border border-white/5"
                    aria-label={`Rating: ${field.averageRating} out of 5`}
                >
                    <StarIcon className="w-3.5 h-3.5 fill-tertiary-fixed text-tertiary-fixed" strokeWidth={0} />
                    <span>{field.averageRating > 0 ? field.averageRating.toFixed(1) : "New"}</span>
                </div>
            </div>

            {/* Content Section */}
            <div className="p-6 md:p-8 flex flex-col justify-between flex-1">
                <div>
                    <h3 className="font-headline text-xl font-black italic tracking-wide mb-2 line-clamp-1 group-hover:text-primary-container transition-colors">
                        {field.name}
                    </h3>
                    <address className="flex items-center text-on-surface-variant text-sm mb-4 not-italic font-medium">
                        <MapPinIcon className="w-4 h-4 mr-1.5 shrink-0 text-primary-container" />
                        <span className="truncate">{field.area}, {field.division}</span>
                    </address>
                    <p className="text-on-surface-variant text-sm line-clamp-2 mb-6">
                        {field.description}
                    </p>
                    <div className="flex flex-wrap gap-1.5 mb-6">
                        {field.facilities?.slice(0, 3).map((facility, index) => (
                            <Badge key={index} variant="outline" className="bg-background border-white/5 text-[11px] text-on-surface font-semibold py-0.5">
                                {facility}
                            </Badge>
                        ))}
                        {field.facilities?.length > 3 && (
                            <Badge variant="outline" className="bg-background border-white/5 text-[11px] text-on-surface-variant font-semibold">
                                +{field.facilities.length - 3} More
                            </Badge>
                        )}
                    </div>
                </div>

                <div className="flex items-center justify-between pt-5 border-t border-white/5">
                    <div className="flex items-center gap-1.5 text-xs text-on-surface-variant font-bold uppercase tracking-wider">
                        <UsersIcon className="h-4 w-4 text-primary-container" />
                        <span>Max {field.maxPlayers} players</span>
                    </div>
                    <Button asChild className="bg-primary-container text-on-primary-container font-black uppercase tracking-wider text-xs px-5 py-2 rounded-lg transition-all hover:scale-95 hover:brightness-110">
                        <Link href={`/fields/${field.id}`}>
                            Details
                        </Link>
                    </Button>
                </div>
            </div>
        </article>
    )
}
