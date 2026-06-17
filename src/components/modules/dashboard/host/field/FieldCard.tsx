"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
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
} from "@hugeicons/core-free-icons"

const sportLabels: Record<string, string> = {
    FOOTBALL: "Football",
    CRICKET: "Cricket",
    BADMINTON: "Badminton",
    BASKETBALL: "Basketball",
    TENNIS: "Tennis",
}

const statusColors: Record<string, string> = {
    ACTIVE: "bg-primary/10 text-primary border-primary/20",
    INACTIVE: "bg-muted text-muted-foreground border-border",
    SUSPENDED: "bg-destructive/10 text-destructive border-destructive/25",
}

type FieldCardProps = {
    field: Field
}

export function FieldCard({ field }: FieldCardProps) {
    const [editOpen, setEditOpen] = useState(false)
    const [deleteOpen, setDeleteOpen] = useState(false)
    const [activeImage, setActiveImage] = useState(field.images?.[0] || "")

    return (
        <>
            <Card className="w-full overflow-hidden border-border/40 shadow-lg bg-card/70 backdrop-blur-sm relative flex flex-col justify-between h-full">
                <div className="absolute top-0 left-0 w-full h-[4px] bg-gradient-to-r from-primary to-secondary" />

                <CardHeader className="border-b border-border/30 px-6 py-5 bg-muted/20">
                    <div className="space-y-2">
                        <div className="flex items-center justify-between gap-2 flex-wrap">
                            <CardTitle className="text-xl font-black tracking-tight text-foreground">
                                {field.name}
                            </CardTitle>
                            <Badge variant="outline" className={`px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider text-[10px] ${statusColors[field.status] || ""}`}>
                                {field.status}
                            </Badge>
                        </div>
                        <CardDescription className="flex flex-wrap gap-2 items-center text-xs">
                            <Badge variant="secondary" className="font-semibold bg-primary/10 text-primary border border-primary/20">
                                {sportLabels[field.sportType] ?? field.sportType}
                            </Badge>
                            <span className="text-muted-foreground">•</span>
                            <span className="flex items-center gap-1 text-muted-foreground font-semibold">
                                <HugeiconsIcon icon={Calendar02Icon} className="size-3.5" />
                                {new Date(field.createdAt).toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" })}
                            </span>
                        </CardDescription>
                    </div>
                </CardHeader>

                <CardContent className="p-6 space-y-6 flex-1">
                    {/* Photo Showcase */}
                    {field.images && field.images.length > 0 ? (
                        <div className="space-y-2">
                            <div className="relative aspect-[16/10] rounded-xl overflow-hidden border border-border/40 bg-muted">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                    src={activeImage || field.images[0]}
                                    alt={field.name}
                                    className="object-cover w-full h-full hover:scale-105 transition-transform duration-500"
                                />
                            </div>
                            {field.images.length > 1 && (
                                <div className="flex gap-2 overflow-x-auto py-1 scrollbar-thin">
                                    {field.images.map((img, i) => (
                                        <button
                                            key={i}
                                            onClick={() => setActiveImage(img)}
                                            className={`relative size-12 rounded-lg overflow-hidden border-2 shrink-0 transition-all ${activeImage === img ? "border-primary scale-95 shadow-md shadow-primary/10" : "border-transparent"
                                                }`}
                                        >
                                            {/* eslint-disable-next-line @next/next/no-img-element */}
                                            <img src={img} alt={`${field.name} preview`} className="object-cover w-full h-full" />
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="aspect-[16/10] rounded-xl border border-dashed flex flex-col items-center justify-center gap-2 bg-muted/20 relative group overflow-hidden">
                            <span className="text-xs font-semibold text-muted-foreground">No showcase images uploaded</span>
                            <span className="text-[10px] text-muted-foreground/75">Update field info to add images</span>
                        </div>
                    )}

                    {/* About Arena */}
                    <div className="space-y-2">
                        <h4 className="text-[11px] font-black uppercase tracking-widest text-primary">
                            Description
                        </h4>
                        <p className="text-xs text-foreground/80 leading-relaxed whitespace-pre-wrap font-medium">
                            {field.description}
                        </p>
                    </div>

                    {/* Amenities */}
                    {field.facilities.length > 0 && (
                        <div className="space-y-2">
                            <h4 className="text-[11px] font-black uppercase tracking-widest text-primary">
                                Amenities
                            </h4>
                            <div className="flex flex-wrap gap-1.5">
                                {field.facilities.map((f) => (
                                    <Badge key={f} variant="secondary" className="px-2.5 py-0.5 rounded-lg text-[10px] font-bold bg-muted hover:bg-muted/80 border border-border/40 transition-colors">
                                        {f}
                                    </Badge>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Location Info (Division, Area, Address) */}
                    <div className="space-y-2 border-t border-border/30 pt-4">
                        <h4 className="text-[11px] font-black uppercase tracking-widest text-primary">
                            Location & Address
                        </h4>
                        <div className="space-y-2 bg-muted/30 p-3.5 rounded-xl border border-border/30 text-xs">
                            <div className="flex items-start gap-2">
                                <HugeiconsIcon icon={Location01Icon} className="size-4 mt-0.5 text-primary shrink-0" />
                                <div className="space-y-1">
                                    <p className="font-bold text-foreground leading-snug">{field.address}</p>
                                    <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">
                                        {field.area}, {field.division}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Stats Block (Capacity & Ratings) */}
                    <div className="grid grid-cols-2 gap-4 bg-muted/20 p-4 rounded-xl border border-border/20 text-xs font-semibold">
                        <div className="space-y-1">
                            <span className="text-muted-foreground text-[10px] uppercase font-black tracking-wider block">Turf Capacity</span>
                            <p className="text-foreground flex items-center gap-1.5 text-xs font-bold">
                                <HugeiconsIcon icon={UserGroupIcon} className="size-4 text-primary shrink-0" />
                                {field.maxPlayers ? `${field.maxPlayers} players` : "Unlimited"}
                            </p>
                        </div>
                        <div className="space-y-1">
                            <span className="text-muted-foreground text-[10px] uppercase font-black tracking-wider block">Rating</span>
                            <p className="text-foreground text-xs font-bold flex items-center gap-1">
                                {field.averageRating > 0 ? (
                                    <span className="flex items-center gap-1">
                                        <HugeiconsIcon icon={StarIcon} className="size-4 text-primary shrink-0 fill-primary" />
                                        {field.averageRating.toFixed(1)} ({field.totalReviews})
                                    </span>
                                ) : (
                                    <span className="text-muted-foreground text-[10px] font-semibold">No reviews</span>
                                )}
                            </p>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-2 pt-2 border-t border-border/20">
                        <Button variant="outline" size="sm" onClick={() => setEditOpen(true)} className="flex-1 flex items-center justify-center gap-1.5 rounded-lg border-border hover:bg-primary/10 hover:text-primary hover:border-primary/30 transition-all font-bold text-xs py-4">
                            <HugeiconsIcon icon={PencilEdit01Icon} className="size-4 text-primary" />
                            Edit Turf
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => setDeleteOpen(true)} className="flex-1 flex items-center justify-center gap-1.5 text-destructive hover:bg-destructive/10 hover:text-destructive border-destructive/20 rounded-lg transition-all font-bold text-xs py-4">
                            <HugeiconsIcon icon={Delete01Icon} className="size-4" />
                            Delete Field
                        </Button>
                    </div>
                </CardContent>
            </Card>

            <EditFieldDialog field={field} open={editOpen} onOpenChange={setEditOpen} />
            <DeleteFieldDialog fieldId={field.id} fieldName={field.name} open={deleteOpen} onOpenChange={setDeleteOpen} />
        </>
    )
}
