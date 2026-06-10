"use client"

import { FieldCard } from "./FieldCard"
import { CreateFieldDialog } from "./CreateFieldDialog"
import { CreateSlotsDialog } from "./CreateSlotsDialog"
import { SlotTable } from "./SlotTable"
import type { Field, Slot } from "@/types/field.types"
import { HugeiconsIcon } from "@hugeicons/react"
import { SquareArrowShrink02Icon, Calendar03Icon } from "@hugeicons/core-free-icons"

type FieldSlotManagerProps = {
    field: Field | null
    slots: Slot[]
}

export function FieldSlotManager({ field, slots }: FieldSlotManagerProps) {
    if (!field) {
        return (
            <div className="flex flex-col items-center justify-center rounded-xl border border-dashed py-16 text-center">
                <div className="mb-4 rounded-full bg-muted p-4">
                    <HugeiconsIcon icon={SquareArrowShrink02Icon} className="size-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-medium">No field yet</h3>
                <p className="mt-1 max-w-sm text-sm text-muted-foreground">
                    Register your sports field to start managing bookings and slot availability.
                </p>
                <div className="mt-6">
                    <CreateFieldDialog />
                </div>
            </div>
        )
    }

    return (
        <div className="flex flex-col gap-8">
            {/* Field Information Block */}
            <div className="space-y-4">
                <h2 className="text-xl font-semibold tracking-tight text-foreground">Field Information</h2>
                <FieldCard field={field} />
            </div>

            {/* Slots and Availability Management Block */}
            <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h2 className="text-xl font-semibold tracking-tight text-foreground">Slots & Availability</h2>
                        <p className="text-sm text-muted-foreground mt-0.5">
                            Generate and manage time slots for your field.
                        </p>
                    </div>
                    <CreateSlotsDialog fieldId={field.id} fieldName={field.name} />
                </div>

                {slots.length === 0 ? (
                    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed py-12 text-center bg-muted/10">
                        <div className="mb-3 rounded-full bg-muted p-3">
                            <HugeiconsIcon icon={Calendar03Icon} className="size-6 text-muted-foreground" />
                        </div>
                        <h3 className="text-md font-medium">No slots generated yet</h3>
                        <p className="mt-1 max-w-xs text-xs text-muted-foreground">
                            Generate time slots for <strong>{field.name}</strong> so players can find and book your field.
                        </p>
                        <div className="mt-4">
                            <CreateSlotsDialog fieldId={field.id} fieldName={field.name} />
                        </div>
                    </div>
                ) : (
                    <SlotTable slots={slots} fieldId={field.id} />
                )}
            </div>
        </div>
    )
}
