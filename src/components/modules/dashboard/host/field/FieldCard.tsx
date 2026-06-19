"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { EditFieldDialog } from "./EditFieldDialog"
import { DeleteFieldDialog } from "./DeleteFieldDialog"
import type { Field } from "@/types/field.types"
import { HugeiconsIcon } from "@hugeicons/react"
import {
    PencilEdit01Icon,
    Delete01Icon,
    Location01Icon,
    UserGroupIcon,
    Calendar02Icon,
    StarIcon,
    ImageNotFound01Icon,
} from "@hugeicons/core-free-icons"
// import { format } from "date-fns";


const sportLabels: Record<string, string> = {
    FOOTBALL: "Football",
    CRICKET: "Cricket",
    BADMINTON: "Badminton",
    BASKETBALL: "Basketball",
    TENNIS: "Tennis",
}

const statusColors: Record<string, string> = {
    ACTIVE: "bg-emerald-500/10 text-emerald-600 border-emerald-500/25 dark:text-emerald-400",
    INACTIVE: "bg-muted text-muted-foreground border-border",
    SUSPENDED: "bg-destructive/10 text-destructive border-destructive/25",
}

type FieldCardProps = {
    field: Field
}

const AUTO_CYCLE_INTERVAL = 3500

export function FieldCard({ field }: FieldCardProps) {
    const [editOpen, setEditOpen] = useState(false)
    const [deleteOpen, setDeleteOpen] = useState(false)
    const [activeIndex, setActiveIndex] = useState(0)
    const [isHoveringGallery, setIsHoveringGallery] = useState(false)

    const images = field.images ?? []
    const hasImages = images.length > 0

    const advance = useCallback(() => {
        if (images.length > 1) {
            setActiveIndex((i) => (i + 1) % images.length)
        }
    }, [images.length])

    useEffect(() => {
        if (!hasImages || isHoveringGallery || images.length <= 1) return
        const timer = setInterval(advance, AUTO_CYCLE_INTERVAL)
        return () => clearInterval(timer)
    }, [advance, hasImages, images.length, isHoveringGallery])

    return (
        <>
            <Card className="w-full overflow-hidden border-border/40 shadow-lg bg-card/70 backdrop-blur-sm flex flex-col h-full rounded-2xl p-0">

                {/* ── IMAGE GALLERY (TOP) ── */}
                <div
                    className="relative w-full aspect-16/10 bg-muted/50 shrink-0 overflow-hidden"
                    onMouseEnter={() => setIsHoveringGallery(true)}
                    onMouseLeave={() => setIsHoveringGallery(false)}
                >
                    {hasImages ? (
                        <>
                            {images.map((img, i) => (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img
                                    key={img}
                                    src={img}
                                    alt={`${field.name} — photo ${i + 1}`}
                                    className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${i === activeIndex ? "opacity-100" : "opacity-0"
                                        }`}
                                />
                            ))}

                            <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-black/10 pointer-events-none" />

                            {/* Floating badges */}
                            <div className="absolute top-3 left-3 flex items-center gap-2">
                                <Badge className="bg-black/50 text-white border-white/20 backdrop-blur-sm text-[10px] font-bold uppercase tracking-wider rounded-full px-2.5">
                                    {sportLabels[field.sportType] ?? field.sportType}
                                </Badge>
                            </div>
                            <div className="absolute top-3 right-3">
                                <Badge variant="outline" className={`px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider text-[10px] backdrop-blur-sm bg-black/30 border ${statusColors[field.status] ?? ""}`}>
                                    {field.status}
                                </Badge>
                            </div>

                            {/* Dot indicators */}
                            {images.length > 1 && (
                                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                                    {images.map((_, i) => (
                                        <button
                                            key={i}
                                            onClick={() => setActiveIndex(i)}
                                            className={`h-1.5 rounded-full transition-all duration-300 ${i === activeIndex ? "w-5 bg-white" : "w-1.5 bg-white/50 hover:bg-white/75"
                                                }`}
                                        />
                                    ))}
                                </div>
                            )}

                            {/* Thumbnail strip */}
                            {images.length > 1 && (
                                <div className="absolute bottom-3 right-3 flex gap-1.5">
                                    {images.map((img, i) => (
                                        <button
                                            key={i}
                                            onClick={() => setActiveIndex(i)}
                                            className={`size-9 rounded-lg overflow-hidden border-2 shrink-0 transition-all duration-200 ${i === activeIndex
                                                ? "border-white scale-110 shadow-lg"
                                                : "border-white/30 opacity-70 hover:opacity-100 hover:border-white/60"
                                                }`}
                                        >
                                            {/* eslint-disable-next-line @next/next/no-img-element */}
                                            <img src={img} alt="" className="object-cover w-full h-full" />
                                        </button>
                                    ))}
                                </div>
                            )}
                        </>
                    ) : (
                        /* Empty state — uses muted/20 to stay within bg-card/70 language */
                        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-muted/20">
                            <HugeiconsIcon icon={ImageNotFound01Icon} className="size-8 text-muted-foreground/40" />
                            <p className="text-xs font-semibold text-muted-foreground/60">No images uploaded</p>
                            <p className="text-[10px] text-muted-foreground/40">Edit this field to add photos</p>
                        </div>
                    )}
                </div>

                {/* ── CARD BODY ── */}
                <CardContent className="p-5 flex flex-col gap-4 flex-1">

                    {/* Title + date */}
                    <div className="space-y-1">
                        <h3 className="text-lg font-black tracking-tight text-foreground leading-tight">
                            {field.name}
                        </h3>
                        <p className="flex items-center gap-1 text-[11px] text-muted-foreground font-semibold">
                            <HugeiconsIcon icon={Calendar02Icon} className="size-3.5" />
                            Added {new Date(field.createdAt).toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" })}
                            {/* {format(new Date(field.createdAt), "d, MMM yyyy")} */}
                        </p>
                    </div>

                    {/* Description */}
                    <p className="text-xs text-foreground/80 leading-relaxed font-medium line-clamp-3">
                        {field.description}
                    </p>

                    {/* Facilities */}
                    {field.facilities.length > 0 && (
                        <div className="flex flex-wrap gap-1.5">
                            {field.facilities.map((f) => (
                                <Badge
                                    key={f}
                                    variant="secondary"
                                    className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-muted/60 border border-border/40"
                                >
                                    {f}
                                </Badge>
                            ))}
                        </div>
                    )}

                    {/* Location — bg-muted/20 keeps it lighter than a solid muted */}
                    <div className="flex items-start gap-2 bg-muted/20 rounded-xl p-3 border border-border/30">
                        <HugeiconsIcon icon={Location01Icon} className="size-4 text-primary mt-0.5 shrink-0" />
                        <div>
                            <p className="text-xs font-bold text-foreground leading-snug">{field.address}</p>
                            <p className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider mt-0.5">
                                {field.area}, {field.division}
                            </p>
                        </div>
                    </div>

                    {/* Stats — bg-muted/20 matches location block */}
                    <div className="grid grid-cols-2 gap-3">
                        <div className="bg-muted/20 rounded-xl p-3 border border-border/20 space-y-1">
                            <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground block">
                                Capacity
                            </span>
                            <p className="text-xs font-bold text-foreground flex items-center gap-1.5">
                                <HugeiconsIcon icon={UserGroupIcon} className="size-3.5 text-primary" />
                                {field.maxPlayers ? `${field.maxPlayers} players` : "Unlimited"}
                            </p>
                        </div>
                        <div className="bg-muted/20 rounded-xl p-3 border border-border/20 space-y-1">
                            <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground block">
                                Rating
                            </span>
                            {field.averageRating > 0 ? (
                                <p className="text-xs font-bold text-foreground flex items-center gap-1">
                                    <HugeiconsIcon icon={StarIcon} className="size-3.5 text-amber-500 fill-amber-500" />
                                    {field.averageRating.toFixed(1)}
                                    <span className="text-muted-foreground font-semibold">({field.totalReviews})</span>
                                </p>
                            ) : (
                                <p className="text-[10px] text-muted-foreground font-semibold">No reviews yet</p>
                            )}
                        </div>
                    </div>

                    <div className="flex-1" />

                    {/* Action buttons */}
                    <div className="flex gap-2 pt-1 border-t border-border/20">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setEditOpen(true)}
                            className="flex-1 gap-1.5 rounded-xl border-border/40 bg-transparent hover:bg-primary/10 hover:text-primary hover:border-primary/30 font-bold text-xs h-9 transition-all"
                        >
                            <HugeiconsIcon icon={PencilEdit01Icon} className="size-3.5 text-primary" />
                            Edit Turf
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setDeleteOpen(true)}
                            className="flex-1 gap-1.5 rounded-xl bg-transparent text-destructive hover:bg-destructive/10 hover:border-destructive/40 border-destructive/20 font-bold text-xs h-9 transition-all"
                        >
                            <HugeiconsIcon icon={Delete01Icon} className="size-3.5" />
                            Delete
                        </Button>
                    </div>
                </CardContent>
            </Card>

            <EditFieldDialog field={field} open={editOpen} onOpenChange={setEditOpen} />
            <DeleteFieldDialog fieldId={field.id} fieldName={field.name} open={deleteOpen} onOpenChange={setDeleteOpen} />
        </>
    )
}