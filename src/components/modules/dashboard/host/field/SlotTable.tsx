"use client"

import { useState } from "react"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { EditSlotDialog } from "./EditSlotDialog"
import { DeleteSlotDialog } from "./DeleteSlotDialog"
import type { Slot } from "@/types/field.types"
import { HugeiconsIcon } from "@hugeicons/react"
import { PencilEdit01Icon, Delete01Icon } from "@hugeicons/core-free-icons"

const statusVariant: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
    AVAILABLE: "default",
    BOOKED: "secondary",
    BLOCKED: "destructive",
}

type SlotTableProps = {
    slots: Slot[]
    fieldId: string
}

export function SlotTable({ slots, fieldId }: SlotTableProps) {
    const [editSlot, setEditSlot] = useState<Slot | null>(null)
    const [deleteSlot, setDeleteSlot] = useState<Slot | null>(null)

    return (
        <>
            <div className="rounded-xl border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Date</TableHead>
                            <TableHead>Time</TableHead>
                            <TableHead>Price (BDT)</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {slots.map((slot) => {
                            const dateStr = new Date(slot.date).toLocaleDateString("en-GB", {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                            })
                            const isBooked = slot.status === "BOOKED"

                            return (
                                <TableRow key={slot.id}>
                                    <TableCell>{dateStr}</TableCell>
                                    <TableCell>
                                        {slot.startTime} – {slot.endTime}
                                    </TableCell>
                                    <TableCell>৳{slot.pricePerSlot.toLocaleString()}</TableCell>
                                    <TableCell>
                                        <Badge variant={statusVariant[slot.status] ?? "outline"}>
                                            {slot.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-1">
                                            <Button
                                                variant="ghost"
                                                size="icon-sm"
                                                onClick={() => setEditSlot(slot)}
                                                disabled={isBooked}
                                                aria-label="Edit slot"
                                            >
                                                <HugeiconsIcon icon={PencilEdit01Icon} />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon-sm"
                                                onClick={() => setDeleteSlot(slot)}
                                                disabled={isBooked}
                                                aria-label="Delete slot"
                                            >
                                                <HugeiconsIcon icon={Delete01Icon} className="text-destructive" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            )
                        })}
                    </TableBody>
                </Table>
            </div>

            {editSlot && (
                <EditSlotDialog
                    slot={editSlot}
                    open={!!editSlot}
                    onOpenChange={(open) => { if (!open) setEditSlot(null) }}
                />
            )}

            {deleteSlot && (
                <DeleteSlotDialog
                    fieldId={fieldId}
                    slotId={deleteSlot.id}
                    slotLabel={`${deleteSlot.startTime}–${deleteSlot.endTime} on ${new Date(deleteSlot.date).toLocaleDateString()}`}
                    open={!!deleteSlot}
                    onOpenChange={(open) => { if (!open) setDeleteSlot(null) }}
                />
            )}
        </>
    )
}
