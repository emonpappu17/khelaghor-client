"use client"

import { useActionState, useState, useEffect, useRef } from "react"
import { createSlotsAction, type CreateSlotsState } from "@/actions/field.actions"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Field, FieldGroup, FieldLabel, FieldError, FieldDescription } from "@/components/ui/field"
import { Spinner } from "@/components/ui/spinner"
import { toast } from "sonner"
import { HugeiconsIcon } from "@hugeicons/react"
import { PlusSignIcon } from "@hugeicons/core-free-icons"

type CreateSlotsDialogProps = {
    fieldId: string
    fieldName: string
}

export function CreateSlotsDialog({ fieldId, fieldName }: CreateSlotsDialogProps) {
    const [open, setOpen] = useState(false)
    const boundAction = createSlotsAction.bind(null, fieldId)
    const initialState: CreateSlotsState = {}
    const [state, formAction, pending] = useActionState(boundAction, initialState)
    const formRef = useRef<HTMLFormElement>(null)
    const [prevState, setPrevState] = useState(state)

    // Reset dialog state during render, not in an effect
    if (state !== prevState) {
        setPrevState(state)
        if (state.success) {
            setOpen(false)
        }
    }

    useEffect(() => {
        if (state.success) {
            toast.success(state.message ?? "Slots created!")
            // setOpen(false)
            formRef.current?.reset()
        }
    }, [state])

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>
                    <HugeiconsIcon icon={PlusSignIcon} data-icon="inline-start" />
                    Generate Slots
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Generate Slots</DialogTitle>
                    <DialogDescription>
                        Bulk-create time slots for <strong>{fieldName}</strong>.
                    </DialogDescription>
                </DialogHeader>

                {state.errors?._form && (
                    <div role="alert" className="text-sm text-destructive">
                        {state.errors._form.join(", ")}
                    </div>
                )}

                <form ref={formRef} action={formAction}>
                    <FieldGroup>
                        <div className="grid grid-cols-2 gap-4">
                            <Field data-invalid={!!state.errors?.startDate || undefined}>
                                <FieldLabel htmlFor="slot-startDate">Start Date</FieldLabel>
                                <Input
                                    id="slot-startDate"
                                    name="startDate"
                                    type="date"
                                    defaultValue={state.fields?.startDate}
                                    aria-invalid={!!state.errors?.startDate || undefined}
                                    required
                                />
                                <FieldError messages={state.errors?.startDate} />
                            </Field>

                            <Field data-invalid={!!state.errors?.endDate || undefined}>
                                <FieldLabel htmlFor="slot-endDate">End Date</FieldLabel>
                                <Input
                                    id="slot-endDate"
                                    name="endDate"
                                    type="date"
                                    defaultValue={state.fields?.endDate}
                                    aria-invalid={!!state.errors?.endDate || undefined}
                                    required
                                />
                                <FieldError messages={state.errors?.endDate} />
                            </Field>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <Field data-invalid={!!state.errors?.startTime || undefined}>
                                <FieldLabel htmlFor="slot-startTime">Start Time</FieldLabel>
                                <Input
                                    id="slot-startTime"
                                    name="startTime"
                                    type="time"
                                    defaultValue={state.fields?.startTime}
                                    aria-invalid={!!state.errors?.startTime || undefined}
                                    required
                                />
                                <FieldError messages={state.errors?.startTime} />
                            </Field>

                            <Field data-invalid={!!state.errors?.endTime || undefined}>
                                <FieldLabel htmlFor="slot-endTime">End Time</FieldLabel>
                                <Input
                                    id="slot-endTime"
                                    name="endTime"
                                    type="time"
                                    defaultValue={state.fields?.endTime}
                                    aria-invalid={!!state.errors?.endTime || undefined}
                                    required
                                />
                                <FieldError messages={state.errors?.endTime} />
                            </Field>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <Field data-invalid={!!state.errors?.slotDurationMinutes || undefined}>
                                <FieldLabel htmlFor="slot-duration">Duration (min)</FieldLabel>
                                <Input
                                    id="slot-duration"
                                    name="slotDurationMinutes"
                                    type="number"
                                    min={15}
                                    max={480}
                                    defaultValue={state.fields?.slotDurationMinutes ?? "60"}
                                    aria-invalid={!!state.errors?.slotDurationMinutes || undefined}
                                    required
                                />
                                <FieldDescription>15–480 minutes</FieldDescription>
                                <FieldError messages={state.errors?.slotDurationMinutes} />
                            </Field>

                            <Field data-invalid={!!state.errors?.pricePerSlot || undefined}>
                                <FieldLabel htmlFor="slot-price">Price per Slot (BDT)</FieldLabel>
                                <Input
                                    id="slot-price"
                                    name="pricePerSlot"
                                    type="number"
                                    min={1}
                                    step="any"
                                    placeholder="1500"
                                    defaultValue={state.fields?.pricePerSlot}
                                    aria-invalid={!!state.errors?.pricePerSlot || undefined}
                                    required
                                />
                                <FieldError messages={state.errors?.pricePerSlot} />
                            </Field>
                        </div>
                    </FieldGroup>

                    <DialogFooter className="mt-4">
                        <Button type="submit" disabled={pending}>
                            {pending && <Spinner data-icon="inline-start" />}
                            {pending ? "Generating..." : "Generate Slots"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
