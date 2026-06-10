"use client"

import { useActionState, useEffect, useRef } from "react"
import { updateSlotAction, type UpdateSlotState } from "@/actions/field.actions"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Field, FieldGroup, FieldLabel, FieldError } from "@/components/ui/field"
import { Spinner } from "@/components/ui/spinner"
import { toast } from "sonner"
import type { Slot } from "@/types/field.types"

const SLOT_STATUSES = [
    { value: "AVAILABLE", label: "Available" },
    { value: "BLOCKED", label: "Blocked" },
] as const

type EditSlotDialogProps = {
    slot: Slot
    open: boolean
    onOpenChange: (open: boolean) => void
}

export function EditSlotDialog({ slot, open, onOpenChange }: EditSlotDialogProps) {
    const boundAction = updateSlotAction.bind(null, slot.fieldId, slot.id)
    const initialState: UpdateSlotState = {}
    const [state, formAction, pending] = useActionState(boundAction, initialState)
    const formRef = useRef<HTMLFormElement>(null)

    useEffect(() => {
        if (state.success) {
            toast.success(state.message ?? "Slot updated!")
            onOpenChange(false)
        }
    }, [state, onOpenChange])

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-sm">
                <DialogHeader>
                    <DialogTitle>Edit Slot</DialogTitle>
                    <DialogDescription>
                        {slot.startTime} – {slot.endTime} on {new Date(slot.date).toLocaleDateString()}
                    </DialogDescription>
                </DialogHeader>

                {state.errors?._form && (
                    <div role="alert" className="text-sm text-destructive">
                        {state.errors._form.join(", ")}
                    </div>
                )}

                <form ref={formRef} action={formAction}>
                    <FieldGroup>
                        <Field data-invalid={!!state.errors?.pricePerSlot || undefined}>
                            <FieldLabel htmlFor="edit-slot-price">Price (BDT)</FieldLabel>
                            <Input
                                id="edit-slot-price"
                                name="pricePerSlot"
                                type="number"
                                min={1}
                                step="any"
                                defaultValue={slot.pricePerSlot}
                                aria-invalid={!!state.errors?.pricePerSlot || undefined}
                            />
                            <FieldError messages={state.errors?.pricePerSlot} />
                        </Field>

                        <Field data-invalid={!!state.errors?.status || undefined}>
                            <FieldLabel htmlFor="edit-slot-status">Status</FieldLabel>
                            <Select name="status" defaultValue={slot.status}>
                                <SelectTrigger id="edit-slot-status" className="w-full" aria-invalid={!!state.errors?.status || undefined}>
                                    <SelectValue placeholder="Select status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        {SLOT_STATUSES.map((s) => (
                                            <SelectItem key={s.value} value={s.value}>
                                                {s.label}
                                            </SelectItem>
                                        ))}
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                            <FieldError messages={state.errors?.status} />
                        </Field>
                    </FieldGroup>

                    <DialogFooter className="mt-4">
                        <Button type="submit" disabled={pending}>
                            {pending && <Spinner data-icon="inline-start" />}
                            {pending ? "Saving..." : "Save"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
