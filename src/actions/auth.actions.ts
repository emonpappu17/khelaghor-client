"use server"

import { zodErrors } from "@/actions/_helpers"
import { apiFetch, apiFetchRaw, forwardAuthCookies, mapApiErrors } from "@/lib/api"
import type { ActionState, LoginData, User } from "@/types/api.types"
import {
    loginSchema,
    registerSchema,
    sendVerificationOtpSchema,
    verifyEmailOtpSchema
} from "@/zod/auth.schemas"
import { redirect } from "next/navigation"

export type RegisterState = ActionState<Pick<User, "id" | "name" | "email" | "role">>

export async function registerAction(
    _prev: RegisterState,
    formData: FormData
): Promise<RegisterState> {
    const raw = {
        name: formData.get("name") as string,
        email: formData.get("email") as string,
        password: formData.get("password") as string,
        phone: (formData.get("phone") as string) || undefined,
        role: (formData.get("role") as string) || "USER",
        business_name: (formData.get("business_name") as string) || undefined,
        nid_number: (formData.get("nid_number") as string) || undefined,
    }

    const parsed = registerSchema.safeParse(raw)
    if (!parsed.success) {
        return {
            errors: zodErrors(parsed.error),
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

    const res = await apiFetch<RegisterState["data"]>("/auth/register", {
        method: "POST",
        body: parsed.data,
        withAuth: false,
        cache: "no-store",
    })

    if (!res.success) {
        return {
            errors: mapApiErrors(res, [
                "name", "email", "password", "phone", "business_name", "nid_number",
            ]),
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

    redirect(`/verify-email?email=${encodeURIComponent(parsed.data.email)}`)
}

export type LoginState = ActionState<LoginData>

export async function loginAction(
    _prev: LoginState,
    formData: FormData
): Promise<LoginState> {
    const raw = {
        email: formData.get("email") as string,
        password: formData.get("password") as string,
    }

    const parsed = loginSchema.safeParse(raw)
    if (!parsed.success) {
        return {
            errors: zodErrors(parsed.error),
            fields: { email: raw.email ?? "" },
        }
    }

    // apiFetchRaw so we can capture and forward Set-Cookie headers
    const response = await apiFetchRaw("/auth/login", {
        method: "POST",
        body: parsed.data,
        withAuth: false,
    })

    const json: { success: boolean; message: string; data?: LoginData } =
        await response.json().catch(() => ({
            success: false,
            message: "Failed to parse server response.",
        }))

    if (!response.ok || !json.success) {
        return {
            errors: { _form: [json.message ?? "Invalid email or password."] },
            fields: { email: raw.email ?? "" },
        }
    }

    // Mirror backend Set-Cookie (accessToken + refreshToken) into Next.js
    await forwardAuthCookies(response)

    redirect("/dashboard")
}

export type SendOtpState = ActionState<{ sent: boolean }>

export async function sendVerificationOtpAction(
    email: string
): Promise<SendOtpState> {
    const parsed = sendVerificationOtpSchema.safeParse({ email })
    if (!parsed.success) {
        return {
            errors: zodErrors(parsed.error),
        }
    }

    const res = await apiFetch<SendOtpState["data"]>("/auth/send-verification-otp", {
        method: "POST",
        body: parsed.data,
        withAuth: false,
        cache: "no-store",
    })

    if (!res.success) {
        return {
            errors: mapApiErrors(res, ["email"]),
        }
    }

    return { data: { sent: true } }
}

export type VerifyOtpState = ActionState<{ verified: boolean }>

export async function verifyEmailOtpAction(
    email: string,
    otp: number
): Promise<VerifyOtpState> {
    const parsed = verifyEmailOtpSchema.safeParse({ email, otp })
    if (!parsed.success) {
        return {
            errors: zodErrors(parsed.error),
        }
    }

    const res = await apiFetch<VerifyOtpState["data"]>("/auth/verify-email-otp", {
        method: "POST",
        body: parsed.data,
        withAuth: false,
        cache: "no-store",
    })

    if (!res.success) {
        return {
            errors: mapApiErrors(res, ["email", "otp"]),
        }
    }

    return { data: { verified: true } }
}
 