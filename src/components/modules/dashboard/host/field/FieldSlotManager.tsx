/* eslint-disable react/no-unescaped-entities */
import { FieldCard } from "./FieldCard"
import { RegisterFieldForm } from "./RegisterFieldForm"
import { CreateSlotsDialog } from "./CreateSlotsDialog"
import { SlotTable } from "./SlotTable"
import type { Field, Slot } from "@/types/field.types"
import { HugeiconsIcon } from "@hugeicons/react"
import { Calendar03Icon } from "@hugeicons/core-free-icons"

type FieldSlotManagerProps = {
    field: Field | null
    slots: Slot[]
}

export function FieldSlotManager({ field, slots }: FieldSlotManagerProps) {
    if (!field) {
        return (
            <div className="space-y-6 animate-in fade-in duration-300">
                <div className="bg-linear-to-r from-primary/10 to-secondary/10 p-5 rounded-2xl border border-primary/20 max-w-4xl">
                    <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
                        Welcome to Khelaghor Hosting
                    </h2>
                    <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                        To start hosting, list your sports venue below. Specify your venue's rules, division, area and details, and immediately begin managing price slots for players to book!
                    </p>
                </div>
                <RegisterFieldForm />
            </div>
        )
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start animate-in fade-in duration-300">
            {/* Left Side: Field Information */}
            <div className="lg:col-span-4 space-y-4 lg:sticky lg:top-6">
                <h2 className="text-sm font-black uppercase tracking-wider text-muted-foreground">
                    Field Information
                </h2>
                <FieldCard field={field} />
            </div>

            {/* Right Side: Slots & Availability */}
            <div className="lg:col-span-8 space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border/30 pb-4">
                    <div>
                        <h2 className="text-xl font-black tracking-tight text-foreground uppercase">
                            Time Slots & Pricing
                        </h2>
                        <p className="text-xs text-muted-foreground mt-1">
                            Generate date-wise time slots, assign booking rates, and manage availability status.
                        </p>
                    </div>
                    <CreateSlotsDialog fieldId={field.id} fieldName={field.name} />
                </div>

                {slots.length === 0 ? (
                    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed py-16 text-center bg-muted/5 gap-3 max-w-md mx-auto">
                        <div className="rounded-full bg-primary/10 p-4 text-primary">
                            <HugeiconsIcon icon={Calendar03Icon} className="size-8" />
                        </div>
                        <div className="space-y-1 px-4">
                            <h3 className="font-bold text-sm">No slots generated yet</h3>
                            <p className="text-xs text-muted-foreground leading-relaxed">
                                Generate slots for {field.name} so that players can discover your field and book games!
                            </p>
                        </div>
                        <div className="mt-2">
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
