import { z } from "zod"

// ─── Sport type values ────────────────────────────────────
const SPORT_TYPES = ["FOOTBALL", "CRICKET", "BADMINTON", "BASKETBALL", "TENNIS"] as const
const SLOT_STATUSES = ["AVAILABLE", "BOOKED", "BLOCKED"] as const

// ─── Field schemas ────────────────────────────────────────

export const createFieldSchema = z.object({
    name: z.string().min(2, "Field name must be at least 2 characters"),
    sportType: z.enum(SPORT_TYPES, { message: "Invalid sport type" }),
    description: z.string().min(10, "Description must be at least 10 characters"),
    maxPlayers: z.coerce.number().int().positive("Max players must be a positive integer").optional(),
    facilities: z.string().optional(), // comma-separated, parsed in action
    division: z.string().min(2, "Division must be at least 2 characters"),
    district: z.string().min(2, "District must be at least 2 characters"),
    address: z.string().min(4, "Address must be at least 4 characters"),
    area: z.string().min(2, "Area must be at least 2 characters"),
    latitude: z.coerce.number({ message: "Latitude is required" }),
    longitude: z.coerce.number({ message: "Longitude is required" }),
})

export const updateFieldSchema = createFieldSchema.partial()

export type CreateFieldInput = z.infer<typeof createFieldSchema>
export type UpdateFieldInput = z.infer<typeof updateFieldSchema>

// ─── Slot schemas ─────────────────────────────────────────

const dateRegex = /^\d{4}-\d{2}-\d{2}$/
const timeRegex = /^([01]?\d|2[0-3]):([0-5]\d)$/

const timeToMinutes = (time: string): number => {
    const [hours, minutes] = time.split(":").map(Number)
    return hours * 60 + minutes
}

export const createSlotsSchema = z
    .object({
        startDate: z.string().regex(dateRegex, "Date must be in YYYY-MM-DD format"),
        endDate: z.string().regex(dateRegex, "Date must be in YYYY-MM-DD format"),
        startTime: z.string().regex(timeRegex, "Time must be in HH:mm format"),
        endTime: z.string().regex(timeRegex, "Time must be in HH:mm format"),
        slotDurationMinutes: z.coerce
            .number()
            .int()
            .min(15, "Slot duration must be at least 15 minutes")
            .max(480, "Slot duration can be max 480 minutes (8 hours)")
            .default(60),
        pricePerSlot: z.coerce.number().positive("Price per slot must be a positive number"),
    })
    .refine(
        (data) => {
            const start = new Date(data.startDate)
            const end = new Date(data.endDate)
            return end >= start
        },
        { message: "End date must be on or after start date", path: ["endDate"] }
    )
    .refine(
        (data) => {
            return timeToMinutes(data.endTime) > timeToMinutes(data.startTime)
        },
        { message: "End time must be after start time", path: ["endTime"] }
    )

export const updateSlotSchema = z
    .object({
        pricePerSlot: z.coerce.number().positive("Price must be a positive number").optional(),
        status: z.enum(SLOT_STATUSES, { message: "Invalid slot status" }).optional(),
    })
    .refine(
        (data) => data.pricePerSlot !== undefined || data.status !== undefined,
        { message: "At least one of price or status must be provided" }
    )

export type CreateSlotsInput = z.infer<typeof createSlotsSchema>
export type UpdateSlotInput = z.infer<typeof updateSlotSchema>
