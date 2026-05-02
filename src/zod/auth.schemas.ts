import { z } from "zod"

export const registerSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    phone: z.string().optional(),
    role: z.enum(["USER", "HOST"]).default("USER"),
    business_name: z
        .string()
        .min(2, "Business name must be at least 2 characters")
        .optional(),
    nid_number: z
        .string()
        .length(10, "NID must be exactly 10 digits")
        .optional(),
})

export type RegisterInput = z.infer<typeof registerSchema>