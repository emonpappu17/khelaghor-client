"use server"

import { z } from "zod"
import { redirect } from "next/navigation"

export type RegisterState = {
    errors?: {
        name?: string[]
        email?: string[]
        password?: string[]
        phone?: string[]
        business_name?: string[]
        nid_number?: string[]
        _form?: string[] // global / server-level errors
    }
    success?: boolean
    message?: string
    // Echo back values so the form can repopulate on error
    fields?: Record<string, string>
}

const baseSchema = z.object({
    name: z
        .string()
        .min(2, "Name must be at least 2 characters"),

    business_name: z
        .string()
        .min(2, "Business name must be at least 2 characters")
        .optional(),

    email: z
        .email("Invalid email address"),

    password: z
        .string()
        .min(6, "Password must be at least 6 characters"),

    phone: z
        .string()
        .optional(),

    nid_number: z
        .string()
        .length(10, "NID must be exactly 10 characters")
        .optional(),

    role: z
        .enum(["USER", "HOST"])
        .default("USER"),
});

const API_BASE = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:5000/api/v1"

export async function registerAction(
    _prevState: RegisterState,
    formData: FormData
): Promise<RegisterState> {
    // 1. Extract raw values
    const raw = {
        name: formData.get("name") as string,
        email: formData.get("email") as string,
        password: formData.get("password") as string,
        phone: (formData.get("phone") as string) || undefined,
        role: (formData.get("role") as string) || "USER",
        business_name: (formData.get("business_name") as string) || undefined,
        nid_number: (formData.get("nid_number") as string) || undefined,
    }

    console.log('raw==>', raw);

    // 2. Server-side Zod validation
    const validated = baseSchema.safeParse(raw)

    if (!validated.success) {
        // ← Updated for Zod v4
        const fieldErrors = z.flattenError(validated.error).fieldErrors

        console.log('fieldErrors ==>', fieldErrors);

        return {
            errors: {
                name: fieldErrors.name,
                email: fieldErrors.email,
                password: fieldErrors.password,
                phone: fieldErrors.phone,
                business_name: fieldErrors.business_name,
                nid_number: fieldErrors.nid_number,
            },
            // Echo back safe fields (never password)
            fields: {
                name: raw.name ?? "",
                email: raw.email ?? "",
                phone: raw.phone ?? "",
                role: raw.role ?? "USER",
                business_name: raw.business_name ?? "",
                nid_number: raw.nid_number ?? "",
            },
        }
    }

    // 3. Call the Khelaghor API
    let response: Response

    try {
        response = await fetch(`${API_BASE}/auth/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(validated.data),
            cache: "no-store",
        })
    } catch {
        return {
            errors: {
                _form: [
                    "Unable to reach the server. Please check your connection and try again.",
                ],
            },
            fields: {
                name: raw.name ?? "",
                email: raw.email ?? "",
                phone: raw.phone ?? "",
                role: raw.role ?? "USER",
                business_name: raw.business_name ?? "",
                nid_number: raw.nid_number ?? "",
            },
        }
    }

    // 4. Map API error responses
    if (!response.ok) {
        const body = await response.json().catch(() => null)
        console.log('body==>', body);
        const serverMessage: string =
            body?.message ?? "Registration failed. Please try again."

        const apiErrors: Array<{ field?: string; message: string }> =
            body?.errors ?? []
        console.log('apiErrors ==>', apiErrors);
        if (apiErrors.length > 0) {
            const mapped: RegisterState["errors"] = {}

            for (const err of apiErrors) {
                const key = err.field as keyof typeof mapped | undefined
                if (key && ["name", "email", "password", "phone", "business_name", "nid_number"].includes(key)) {
                    mapped[key] = [...(mapped[key] ?? []), err.message]
                } else {
                    mapped._form = [...(mapped._form ?? []), err.message]
                }
            }

            return {
                errors: mapped,
                fields: {
                    name: raw.name ?? "",
                    email: raw.email ?? "",
                    phone: raw.phone ?? "",
                    role: raw.role ?? "USER",
                    business_name: raw.business_name ?? "",
                    nid_number: raw.nid_number ?? "",
                },
            }
        }

        return {
            errors: { _form: [serverMessage] },
            fields: {
                name: raw.name ?? "",
                email: raw.email ?? "",
                phone: raw.phone ?? "",
                role: raw.role ?? "USER",
                business_name: raw.business_name ?? "",
                nid_number: raw.nid_number ?? "",
            },
        }
    }

    // 5. Success
    redirect("/login?registered=true")
}