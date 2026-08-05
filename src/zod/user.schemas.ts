import { z } from "zod"

export const updateProfileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  phone: z.string().optional(),
})

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>

export const changePasswordSchema = z.object({
  oldPassword: z.string().min(1, "Current password is required"),
  newPassword: z.string().min(6, "New password must be at least 6 characters"),
})

export type ChangePasswordInput = z.infer<typeof changePasswordSchema>

export const updateHostProfileSchema = z.object({
  business_name: z.string().min(2, "Business name must be at least 2 characters"),
  nid_number: z.string().length(10, "NID must be exactly 10 digits"),
})

export type UpdateHostProfileInput = z.infer<typeof updateHostProfileSchema>

export const updateUserStatusSchema = z.object({
  status: z.enum(["ACTIVE", "SUSPENDED", "BLOCKED", "INACTIVE"]),
})

export const updateUserRoleSchema = z.object({
  role: z.enum(["USER", "HOST", "ADMIN", "SUPER_ADMIN"]),
})
