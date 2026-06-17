"use client"

import { useActionState, useState } from "react"
import { createFieldAction, type CreateFieldState } from "@/actions/field.actions"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Field, FieldGroup, FieldLabel, FieldError } from "@/components/ui/field"
import { Spinner } from "@/components/ui/spinner"
import { toast } from "sonner"
import { useEffect, useRef } from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import { PlusSignIcon } from "@hugeicons/core-free-icons"

const SPORT_TYPES = [
    { value: "FOOTBALL", label: "Football" },
    { value: "CRICKET", label: "Cricket" },
    { value: "BADMINTON", label: "Badminton" },
    { value: "BASKETBALL", label: "Basketball" },
    { value: "TENNIS", label: "Tennis" },
] as const

const initialState: CreateFieldState = {}

export function CreateFieldDialog() {
    const [open, setOpen] = useState(false)
    const [state, formAction, pending] = useActionState(createFieldAction, initialState)
    const formRef = useRef<HTMLFormElement>(null)

    useEffect(() => {
        if (state.success) {
            toast.success(state.message ?? "Field created!")
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setOpen(false)
            formRef.current?.reset()
        }
    }, [state])

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>
                    <HugeiconsIcon icon={PlusSignIcon} data-icon="inline-start" />
                    Register Field
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Register Sports Field</DialogTitle>
                    <DialogDescription>
                        Create your profile by listing your sports field on Khelaghor.
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
                                <FieldLabel htmlFor="create-name">Field Name</FieldLabel>
                                <Input
                                    id="create-name"
                                    name="name"
                                    placeholder="Green Valley Ground"
                                    defaultValue={state.fields?.name}
                                    aria-invalid={!!state.errors?.name || undefined}
                                    required
                                />
                                <FieldError messages={state.errors?.name} />
                            </Field>

                            <Field data-invalid={!!state.errors?.sportType || undefined}>
                                <FieldLabel htmlFor="create-sportType">Sport Type</FieldLabel>
                                <Select name="sportType" defaultValue={state.fields?.sportType} required>
                                    <SelectTrigger id="create-sportType" className="w-full" aria-invalid={!!state.errors?.sportType || undefined}>
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
                            <FieldLabel htmlFor="create-description">Description</FieldLabel>
                            <Textarea
                                id="create-description"
                                name="description"
                                placeholder="Describe the field, surface type, amenities..."
                                rows={3}
                                defaultValue={state.fields?.description}
                                aria-invalid={!!state.errors?.description || undefined}
                                required
                            />
                            <FieldError messages={state.errors?.description} />
                        </Field>

                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <Field data-invalid={!!state.errors?.maxPlayers || undefined}>
                                <FieldLabel htmlFor="create-maxPlayers">Max Players</FieldLabel>
                                <Input
                                    id="create-maxPlayers"
                                    name="maxPlayers"
                                    type="number"
                                    placeholder="22"
                                    defaultValue={state.fields?.maxPlayers}
                                    aria-invalid={!!state.errors?.maxPlayers || undefined}
                                />
                                <FieldError messages={state.errors?.maxPlayers} />
                            </Field>

                            <Field data-invalid={!!state.errors?.facilities || undefined}>
                                <FieldLabel htmlFor="create-facilities">Facilities</FieldLabel>
                                <Input
                                    id="create-facilities"
                                    name="facilities"
                                    placeholder="Parking, Floodlights, Changing Room"
                                    defaultValue={state.fields?.facilities}
                                    aria-invalid={!!state.errors?.facilities || undefined}
                                />
                                <FieldError messages={state.errors?.facilities} />
                            </Field>
                        </div>

                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <Field data-invalid={!!state.errors?.division || undefined}>
                                <FieldLabel htmlFor="create-division">Division</FieldLabel>
                                <Input
                                    id="create-division"
                                    name="division"
                                    placeholder="Dhaka"
                                    defaultValue={state.fields?.division}
                                    aria-invalid={!!state.errors?.division || undefined}
                                    required
                                />
                                <FieldError messages={state.errors?.division} />
                            </Field>

                            <Field data-invalid={!!state.errors?.area || undefined}>
                                <FieldLabel htmlFor="create-area">Area</FieldLabel>
                                <Input
                                    id="create-area"
                                    name="area"
                                    placeholder="Mirpur"
                                    defaultValue={state.fields?.area}
                                    aria-invalid={!!state.errors?.area || undefined}
                                    required
                                />
                                <FieldError messages={state.errors?.area} />
                            </Field>
                        </div>

                        <Field data-invalid={!!state.errors?.address || undefined}>
                            <FieldLabel htmlFor="create-address">Address</FieldLabel>
                            <Input
                                id="create-address"
                                name="address"
                                placeholder="Mirpur-10, Dhaka"
                                defaultValue={state.fields?.address}
                                aria-invalid={!!state.errors?.address || undefined}
                                required
                            />
                            <FieldError messages={state.errors?.address} />
                        </Field>

                        <Field>
                            <FieldLabel htmlFor="create-files">Images (optional, max 10)</FieldLabel>
                            <Input
                                id="create-files"
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
                            {pending ? "Creating..." : "Create Field"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
