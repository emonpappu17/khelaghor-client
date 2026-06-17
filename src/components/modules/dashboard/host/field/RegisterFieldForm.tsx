"use client"

import { useActionState, useState, useEffect, useRef } from "react"
import { createFieldAction, type CreateFieldState } from "@/actions/field.actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Field, FieldGroup, FieldLabel, FieldError } from "@/components/ui/field"
import { Spinner } from "@/components/ui/spinner"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

const SPORT_TYPES = [
    { value: "FOOTBALL", label: "Football" },
    { value: "CRICKET", label: "Cricket" },
    { value: "BADMINTON", label: "Badminton" },
    { value: "BASKETBALL", label: "Basketball" },
    { value: "TENNIS", label: "Tennis" },
] as const

const BANGLADESH_DIVISIONS = [
    { value: "Dhaka", label: "Dhaka" },
    { value: "Chattogram", label: "Chattogram" },
    { value: "Rajshahi", label: "Rajshahi" },
    { value: "Khulna", label: "Khulna" },
    { value: "Barishal", label: "Barishal" },
    { value: "Sylhet", label: "Sylhet" },
    { value: "Rangpur", label: "Rangpur" },
    { value: "Mymensingh", label: "Mymensingh" },
] as const

const initialState: CreateFieldState = {}

export function RegisterFieldForm() {
    const [state, formAction, pending] = useActionState(createFieldAction, initialState)
    const formRef = useRef<HTMLFormElement>(null)
    const [previewImages, setPreviewImages] = useState<string[]>([])

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files
        if (!files) return

        const fileArray = Array.from(files)
        const previews = fileArray.map((file) => URL.createObjectURL(file))
        setPreviewImages(previews)
    }

    useEffect(() => {
        if (state.success) {
            toast.success(state.message ?? "Field created successfully!")
            formRef.current?.reset()
            setPreviewImages([])
        } else if (state.errors?._form) {
            toast.error(state.errors._form.join(", "))
        }
    }, [state])

    return (
        <div className="max-w-4xl mx-auto items-stretch animate-in fade-in duration-300">
            <Card className="border-border/40 shadow-xl overflow-hidden relative bg-card/65 backdrop-blur-sm">
                <div className="absolute top-0 left-0 w-full h-[4px] bg-gradient-to-r from-primary via-secondary to-primary" />
                <CardHeader className="pb-6 border-b border-border/30 bg-muted/20">
                    <CardTitle className="text-2xl font-black uppercase tracking-tight text-foreground">
                        Register Your Arena
                    </CardTitle>
                    <CardDescription className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mt-1">
                        Create a premium listing for your turf, court, or sports ground to start accepting bookings.
                    </CardDescription>
                </CardHeader>

                <CardContent className="p-6 sm:p-8 space-y-6">
                    {state.errors?._form && (
                        <div role="alert" className="p-4 text-xs font-bold rounded-xl bg-destructive/10 text-destructive border border-destructive/25 flex items-start gap-2 animate-in fade-in">
                            <span>{state.errors._form.join(", ")}</span>
                        </div>
                    )}

                    <form ref={formRef} action={formAction} className="space-y-8">
                        <FieldGroup className="gap-8">
                            {/* Section 1: Basic Information */}
                            <div className="space-y-4">
                                <h3 className="text-xs font-black text-primary uppercase tracking-widest border-b border-primary/20 pb-1">
                                    1. Basic Info
                                </h3>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <Field data-invalid={!!state.errors?.name || undefined}>
                                        <FieldLabel htmlFor="create-name" className="text-xs font-black uppercase tracking-wider text-muted-foreground">Arena Name</FieldLabel>
                                        <Input
                                            id="create-name"
                                            name="name"
                                            placeholder="e.g. Mirpur Turf Arena"
                                            defaultValue={state.fields?.name}
                                            required
                                            className="focus-visible:ring-primary rounded-xl"
                                        />
                                        <FieldError messages={state.errors?.name} />
                                    </Field>

                                    <Field data-invalid={!!state.errors?.sportType || undefined}>
                                        <FieldLabel htmlFor="create-sportType" className="text-xs font-black uppercase tracking-wider text-muted-foreground">Sport Category</FieldLabel>
                                        <Select name="sportType" defaultValue={state.fields?.sportType} required>
                                            <SelectTrigger id="create-sportType" className="w-full focus:ring-primary rounded-xl">
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
                                    <FieldLabel htmlFor="create-description" className="text-xs font-black uppercase tracking-wider text-muted-foreground">Description & Booking Rules</FieldLabel>
                                    <Textarea
                                        id="create-description"
                                        name="description"
                                        placeholder="Outline turf type, amenities, washrooms, changing rooms, floodlight charges, or timing policies..."
                                        rows={4}
                                        defaultValue={state.fields?.description}
                                        required
                                        className="focus-visible:ring-primary resize-none rounded-xl"
                                    />
                                    <FieldError messages={state.errors?.description} />
                                </Field>
                            </div>

                            {/* Section 2: Capacity & Amenities */}
                            <div className="space-y-4">
                                <h3 className="text-xs font-black text-primary uppercase tracking-widest border-b border-primary/20 pb-1">
                                    2. Facilities & Limits
                                </h3>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <Field data-invalid={!!state.errors?.maxPlayers || undefined}>
                                        <FieldLabel htmlFor="create-maxPlayers" className="text-xs font-black uppercase tracking-wider text-muted-foreground">
                                            Max Capacity (Players)
                                        </FieldLabel>
                                        <Input
                                            id="create-maxPlayers"
                                            name="maxPlayers"
                                            type="number"
                                            placeholder="e.g. 14"
                                            defaultValue={state.fields?.maxPlayers}
                                            className="focus-visible:ring-primary rounded-xl"
                                        />
                                        <FieldError messages={state.errors?.maxPlayers} />
                                    </Field>

                                    <Field data-invalid={!!state.errors?.facilities || undefined}>
                                        <FieldLabel htmlFor="create-facilities" className="text-xs font-black uppercase tracking-wider text-muted-foreground">Facilities (Comma Separated)</FieldLabel>
                                        <Input
                                            id="create-facilities"
                                            name="facilities"
                                            placeholder="Parking, Changing Room, Washrooms, Tea Stall"
                                            defaultValue={state.fields?.facilities}
                                            className="focus-visible:ring-primary rounded-xl"
                                        />
                                        <FieldError messages={state.errors?.facilities} />
                                    </Field>
                                </div>
                            </div>

                            {/* Section 3: Location Details */}
                            <div className="space-y-4">
                                <h3 className="text-xs font-black text-primary uppercase tracking-widest border-b border-primary/20 pb-1">
                                    3. Location Details
                                </h3>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <Field data-invalid={!!state.errors?.division || undefined}>
                                        <FieldLabel htmlFor="create-division" className="text-xs font-black uppercase tracking-wider text-muted-foreground">Division</FieldLabel>
                                        <Select name="division" defaultValue={state.fields?.division} required>
                                            <SelectTrigger id="create-division" className="w-full focus:ring-primary rounded-xl">
                                                <SelectValue placeholder="Select division" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectGroup>
                                                    {BANGLADESH_DIVISIONS.map((div) => (
                                                        <SelectItem key={div.value} value={div.value}>
                                                            {div.label}
                                                        </SelectItem>
                                                    ))}
                                                </SelectGroup>
                                            </SelectContent>
                                        </Select>
                                        <FieldError messages={state.errors?.division} />
                                    </Field>

                                    <Field data-invalid={!!state.errors?.area || undefined}>
                                        <FieldLabel htmlFor="create-area" className="text-xs font-black uppercase tracking-wider text-muted-foreground">Area / Location</FieldLabel>
                                        <Input
                                            id="create-area"
                                            name="area"
                                            placeholder="e.g. Mirpur-11"
                                            defaultValue={state.fields?.area}
                                            required
                                            className="focus-visible:ring-primary rounded-xl"
                                        />
                                        <FieldError messages={state.errors?.area} />
                                    </Field>
                                </div>

                                <Field data-invalid={!!state.errors?.address || undefined}>
                                    <FieldLabel htmlFor="create-address" className="text-xs font-black uppercase tracking-wider text-muted-foreground">Full Address</FieldLabel>
                                    <Input
                                        id="create-address"
                                        name="address"
                                        placeholder="e.g. Avenue 4, Road 12, Mirpur DOHS, Dhaka"
                                        defaultValue={state.fields?.address}
                                        required
                                        className="focus-visible:ring-primary rounded-xl"
                                    />
                                    <FieldError messages={state.errors?.address} />
                                </Field>
                            </div>

                            {/* Section 4: Photo Gallery */}
                            <div className="space-y-4">
                                <h3 className="text-xs font-black text-primary uppercase tracking-widest border-b border-primary/20 pb-1">
                                    4. Arena Showcase (Images)
                                </h3>

                                <Field>
                                    <FieldLabel htmlFor="create-files" className="cursor-pointer border border-dashed border-border hover:border-primary/50 p-6 rounded-xl flex flex-col items-center justify-center gap-2 hover:bg-muted/10 transition-colors bg-background/30">
                                        <span className="text-sm font-bold text-foreground">Upload Turf Images</span>
                                        <span className="text-xs text-muted-foreground text-center max-w-[240px]">Select up to 10 photos showcasing your turf quality, lights, and layout.</span>
                                        <Input
                                            id="create-files"
                                            name="files"
                                            type="file"
                                            accept="image/*"
                                            multiple
                                            onChange={handleFileChange}
                                            className="hidden"
                                        />
                                    </FieldLabel>
                                </Field>

                                {/* Previews Grid */}
                                {previewImages.length > 0 && (
                                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
                                        {previewImages.map((src, i) => (
                                            <div key={i} className="relative aspect-[16/10] rounded-xl overflow-hidden border border-border/40 bg-muted">
                                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                                <img src={src} alt={`Preview ${i + 1}`} className="object-cover w-full h-full" />
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </FieldGroup>

                        <div className="pt-6 border-t border-border/30 flex justify-end">
                            <Button
                                type="submit"
                                size="lg"
                                disabled={pending}
                                className={cn(
                                    "px-8 rounded-xl font-bold transition-all shadow-md bg-primary hover:bg-primary/90 text-primary-foreground shadow-primary/10"
                                )}
                            >
                                {pending && <Spinner data-icon="inline-start" />}
                                {pending ? "Publishing Listing..." : "Publish Field Listing"}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
