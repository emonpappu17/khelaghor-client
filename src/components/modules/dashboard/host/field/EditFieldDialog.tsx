"use client"

import { useActionState, useState, useEffect, useRef } from "react"
import { updateFieldAction, type UpdateFieldState } from "@/actions/field.actions"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Field, FieldGroup, FieldLabel, FieldError } from "@/components/ui/field"
import { Spinner } from "@/components/ui/spinner"
import { toast } from "sonner"
import type { Field as FieldType } from "@/types/field.types"

const SPORT_TYPES = [
    { value: "FOOTBALL", label: "Football" },
    { value: "CRICKET", label: "Cricket" },
    { value: "BADMINTON", label: "Badminton" },
    { value: "BASKETBALL", label: "Basketball" },
    { value: "TENNIS", label: "Tennis" },
] as const

type EditFieldDialogProps = {
    field: FieldType
    open: boolean
    onOpenChange: (open: boolean) => void
}

export function EditFieldDialog({ field, open, onOpenChange }: EditFieldDialogProps) {
    const boundAction = updateFieldAction.bind(null, field.id)
    const initialState: UpdateFieldState = {}
    const [state, formAction, pending] = useActionState(boundAction, initialState)
    const formRef = useRef<HTMLFormElement>(null)

    useEffect(() => {
        if (state.success) {
            toast.success(state.message ?? "Field updated!")
            onOpenChange(false)
        }
    }, [state, onOpenChange])

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Edit Field</DialogTitle>
                    <DialogDescription>
                        Update your field details.
                    </DialogDescription>
                </DialogHeader>

                {state.errors?._form && (
                    <div role="alert" className="text-sm text-destructive">
                        {state.errors._form.join(", ")}
                    </div>
                )}

                <form ref={formRef} action={formAction}>
                    <FieldGroup>
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <Field data-invalid={!!state.errors?.name || undefined}>
                                <FieldLabel htmlFor="edit-name">Field Name</FieldLabel>
                                <Input
                                    id="edit-name"
                                    name="name"
                                    defaultValue={field.name}
                                    aria-invalid={!!state.errors?.name || undefined}
                                />
                                <FieldError messages={state.errors?.name} />
                            </Field>

                            <Field data-invalid={!!state.errors?.sportType || undefined}>
                                <FieldLabel htmlFor="edit-sportType">Sport Type</FieldLabel>
                                <Select name="sportType" defaultValue={field.sportType}>
                                    <SelectTrigger id="edit-sportType" className="w-full" aria-invalid={!!state.errors?.sportType || undefined}>
                                        <SelectValue placeholder="Select sport" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            {SPORT_TYPES.map((sport) => (
                                                <SelectItem key={sport.value} value={sport.value}>
                                                    {sport.label}
                                                </SelectItem>
                                            ))}
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                                <FieldError messages={state.errors?.sportType} />
                            </Field>
                        </div>

                        <Field data-invalid={!!state.errors?.description || undefined}>
                            <FieldLabel htmlFor="edit-description">Description</FieldLabel>
                            <Textarea
                                id="edit-description"
                                name="description"
                                rows={3}
                                defaultValue={field.description}
                                aria-invalid={!!state.errors?.description || undefined}
                            />
                            <FieldError messages={state.errors?.description} />
                        </Field>

                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <Field data-invalid={!!state.errors?.maxPlayers || undefined}>
                                <FieldLabel htmlFor="edit-maxPlayers">Max Players</FieldLabel>
                                <Input
                                    id="edit-maxPlayers"
                                    name="maxPlayers"
                                    type="number"
                                    defaultValue={field.maxPlayers}
                                    aria-invalid={!!state.errors?.maxPlayers || undefined}
                                />
                                <FieldError messages={state.errors?.maxPlayers} />
                            </Field>

                            <Field data-invalid={!!state.errors?.facilities || undefined}>
                                <FieldLabel htmlFor="edit-facilities">Facilities</FieldLabel>
                                <Input
                                    id="edit-facilities"
                                    name="facilities"
                                    defaultValue={field.facilities.join(", ")}
                                    aria-invalid={!!state.errors?.facilities || undefined}
                                />
                                <FieldError messages={state.errors?.facilities} />
                            </Field>
                        </div>

                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <Field data-invalid={!!state.errors?.division || undefined}>
                                <FieldLabel htmlFor="edit-division">Division</FieldLabel>
                                <Input
                                    id="edit-division"
                                    name="division"
                                    defaultValue={field.division}
                                    aria-invalid={!!state.errors?.division || undefined}
                                />
                                <FieldError messages={state.errors?.division} />
                            </Field>

                            <Field data-invalid={!!state.errors?.area || undefined}>
                                <FieldLabel htmlFor="edit-area">Area</FieldLabel>
                                <Input
                                    id="edit-area"
                                    name="area"
                                    defaultValue={field.area}
                                    aria-invalid={!!state.errors?.area || undefined}
                                />
                                <FieldError messages={state.errors?.area} />
                            </Field>
                        </div>

                        <Field data-invalid={!!state.errors?.address || undefined}>
                            <FieldLabel htmlFor="edit-address">Address</FieldLabel>
                            <Input
                                id="edit-address"
                                name="address"
                                defaultValue={field.address}
                                aria-invalid={!!state.errors?.address || undefined}
                            />
                            <FieldError messages={state.errors?.address} />
                        </Field>

                        <Field>
                            <FieldLabel htmlFor="edit-files">Replace Images (optional)</FieldLabel>
                            <Input
                                id="edit-files"
                                name="files"
                                type="file"
                                accept="image/*"
                                multiple
                            />
                        </Field>
                    </FieldGroup>

                    <DialogFooter className="mt-4">
                        <Button type="submit" disabled={pending}>
                            {pending && <Spinner data-icon="inline-start" />}
                            {pending ? "Saving..." : "Save Changes"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
