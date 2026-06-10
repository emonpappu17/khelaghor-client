"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardAction, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { EditFieldDialog } from "./EditFieldDialog"
import { DeleteFieldDialog } from "./DeleteFieldDialog"
import type { Field } from "@/types/field.types"
import { HugeiconsIcon } from "@hugeicons/react"
import { PencilEdit01Icon, Delete01Icon, Location01Icon, UserGroupIcon } from "@hugeicons/core-free-icons"

const sportLabels: Record<string, string> = {
    FOOTBALL: "Football",
    CRICKET: "Cricket",
    BADMINTON: "Badminton",
    BASKETBALL: "Basketball",
    TENNIS: "Tennis",
}

const statusVariant: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
    ACTIVE: "default",
    INACTIVE: "secondary",
    SUSPENDED: "destructive",
}

type FieldCardProps = {
    field: Field
}

export function FieldCard({ field }: FieldCardProps) {
    const [editOpen, setEditOpen] = useState(false)
    const [deleteOpen, setDeleteOpen] = useState(false)

    return (
        <>
            <Card className="w-full overflow-hidden border-border/40 shadow-md">
                <CardHeader className="border-b bg-muted/30 px-6 py-4">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div>
                            <CardTitle className="text-2xl font-bold tracking-tight">{field.name}</CardTitle>
                            <CardDescription className="mt-1.5 flex flex-wrap gap-2 items-center">
                                <Badge variant={statusVariant[field.status] ?? "outline"}>
                                    {field.status}
                                </Badge>
                                <Badge variant="outline">
                                    {sportLabels[field.sportType] ?? field.sportType}
                                </Badge>
                            </CardDescription>
                        </div>
                        <div className="flex items-center gap-2 self-start md:self-center">
                            <Button variant="outline" size="sm" onClick={() => setEditOpen(true)} className="flex items-center gap-1.5">
                                <HugeiconsIcon icon={PencilEdit01Icon} className="size-4" />
                                Edit Info
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => setDeleteOpen(true)} className="flex items-center gap-1.5 text-destructive hover:bg-destructive/10 hover:text-destructive border-destructive/20">
                                <HugeiconsIcon icon={Delete01Icon} className="size-4" />
                                Delete
                            </Button>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="flex flex-col gap-4">
                            <div>
                                <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">About the Field</h4>
                                <p className="mt-2 text-sm text-foreground leading-relaxed whitespace-pre-wrap">{field.description}</p>
                            </div>
                            
                            {field.facilities.length > 0 && (
                                <div>
                                    <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Amenities & Facilities</h4>
                                    <div className="flex flex-wrap gap-1.5">
                                        {field.facilities.map((f) => (
                                            <Badge key={f} variant="secondary" className="px-2.5 py-0.5 text-xs font-normal">
                                                {f}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="flex flex-col gap-4 border-t md:border-t-0 md:border-l md:pl-6 pt-4 md:pt-0">
                            <div>
                                <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Location</h4>
                                <div className="space-y-2 text-sm text-muted-foreground">
                                    <div className="flex items-start gap-2">
                                        <HugeiconsIcon icon={Location01Icon} className="size-4 mt-0.5 flex-shrink-0 text-primary" />
                                        <span>
                                            <strong className="text-foreground">{field.address}</strong>
                                            <br />
                                            {field.area}, {field.district}, {field.division}
                                        </span>
                                    </div>
                                    <div className="text-xs font-mono pl-6">
                                        Lat: {field.latitude.toFixed(4)}, Lng: {field.longitude.toFixed(4)}
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4 pt-2 border-t border-dashed">
                                <div>
                                    <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Capacity</h4>
                                    <p className="mt-1 text-sm font-medium text-foreground flex items-center gap-1.5">
                                        <HugeiconsIcon icon={UserGroupIcon} className="size-4 text-muted-foreground" />
                                        {field.maxPlayers ? `${field.maxPlayers} players max` : "Not specified"}
                                    </p>
                                </div>
                                <div>
                                    <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Rating</h4>
                                    <p className="mt-1 text-sm font-medium text-foreground">
                                        {field.averageRating > 0 ? (
                                            <span className="flex items-center gap-1">
                                                <span className="text-yellow-500">★</span>
                                                {field.averageRating.toFixed(1)} ({field.totalReviews} reviews)
                                            </span>
                                        ) : (
                                            <span className="text-muted-foreground text-xs font-normal">No ratings yet</span>
                                        )}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <EditFieldDialog field={field} open={editOpen} onOpenChange={setEditOpen} />
            <DeleteFieldDialog fieldId={field.id} fieldName={field.name} open={deleteOpen} onOpenChange={setDeleteOpen} />
        </>
    )
}
