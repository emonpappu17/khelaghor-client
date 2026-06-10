"use server"

import { zodErrors } from "@/actions/_helpers"
import { apiFetch, forwardAuthCookies, mapApiErrors, parseResponse } from "@/lib/api"
import { deleteCookie } from "@/lib/cookie"
import { getDefaultDashboardRoute } from "@/lib/route.config"
import type { ActionState, LoginData, OtpVerifyData, User, UserRole } from "@/types/api.types"
import {
    forgotPasswordSchema,
    loginSchema,
    registerSchema,
    resetPasswordSchema,
    sendVerificationOtpSchema,
    verifyEmailOtpSchema,
    verifyOtpSchema
} from "@/zod/auth.schemas"
import { redirect } from "next/navigation"

export type RegisterState = ActionState<Pick<User, "id" | "name" | "email" | "role">>
export type LoginState = ActionState<LoginData>
export type SendOtpState = ActionState<{ sent: boolean }>
export type VerifyEmailOtpState = ActionState<{ verified: boolean }>
export type ForgotPasswordState = ActionState
export type ResetPasswordState = ActionState
export type VerifyOtpState = ActionState<OtpVerifyData>

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

    const response = await apiFetch.post("/auth/register", { body: parsed.data })
    const res = await parseResponse<RegisterState["data"]>(response)

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

    // apiFetch.post returns raw Response — we need it raw to forward Set-Cookie headers
    const response = await apiFetch.post("/auth/login", { body: parsed.data })

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

    await forwardAuthCookies(response)
    const route = getDefaultDashboardRoute(json.data?.user.role as UserRole)
    redirect(route)
}

export async function sendVerificationOtpAction(
    email: string
): Promise<SendOtpState> {
    const parsed = sendVerificationOtpSchema.safeParse({ email })
    if (!parsed.success) {
        return { errors: zodErrors(parsed.error) }
    }

    const response = await apiFetch.post("/auth/send-verification-otp", { body: parsed.data })
    const res = await parseResponse<SendOtpState["data"]>(response)

    if (!res.success) {
        return { errors: mapApiErrors(res, ["email"]) }
    }

    return { data: { sent: true } }
}

export async function verifyEmailOtpAction(
    email: string,
    otp: number
): Promise<VerifyEmailOtpState> {
    const parsed = verifyEmailOtpSchema.safeParse({ email, otp })
    if (!parsed.success) {
        return { errors: zodErrors(parsed.error) }
    }

    const response = await apiFetch.post("/auth/verify-email-otp", { body: parsed.data })
    const res = await parseResponse<VerifyEmailOtpState["data"]>(response)

    if (!res.success) {
        return { errors: mapApiErrors(res, ["email", "otp"]) }
    }

    return { data: { verified: true } }
}

export async function forgotPasswordAction(
    _prev: ForgotPasswordState,
    formData: FormData
): Promise<ForgotPasswordState> {
    const raw = { email: formData.get("email") as string }
    const parsed = forgotPasswordSchema.safeParse(raw)

    if (!parsed.success) {
        return { errors: zodErrors(parsed.error), fields: { email: raw.email ?? "" } }
    }

    const response = await apiFetch.post("/auth/forgot-password", { body: parsed.data })
    const res = await parseResponse(response)

    if (!res.success) {
        return {
            errors: { _form: [res.message ?? "Failed to send OTP."] },
            fields: { email: raw.email ?? "" },
        }
    }

    return { success: true, message: res.message ?? "OTP sent to your email." }
}

export async function verifyOtpAction(
    _prev: VerifyOtpState,
    formData: FormData
): Promise<VerifyOtpState> {
    const raw = {
        email: formData.get("email") as string,
        otp: formData.get("otp") as string,
    }
    const parsed = verifyOtpSchema.safeParse(raw)

    if (!parsed.success) {
        return { errors: zodErrors(parsed.error), fields: { email: raw.email ?? "" } }
    }

    const response = await apiFetch.post("/auth/verify-otp", { body: parsed.data })
    const res = await parseResponse<OtpVerifyData>(response)

    if (!res.success) {
        return { errors: { _form: [res.message ?? "OTP verification failed."] } }
    }

    return { success: true, message: res.message, data: res.data }
}

export async function resetPasswordAction(
    _prev: ResetPasswordState,
    formData: FormData
): Promise<ResetPasswordState> {
    const raw = {
        email: formData.get("email") as string,
        password: formData.get("password") as string,
        resetToken: formData.get("resetToken") as string,
    }
    const parsed = resetPasswordSchema.safeParse(raw)

    if (!parsed.success) {
        return { errors: zodErrors(parsed.error), fields: { email: raw.email ?? "" } }
    }

    const { resetToken, ...body } = parsed.data

    const response = await apiFetch.post("/auth/reset-password", {
        body,
        headers: { Authorization: resetToken },
    })
    const res = await parseResponse(response)

    if (!res.success) {
        return { errors: { _form: [res.message ?? "Password reset failed."] } }
    }

    redirect("/login?passwordReset=true")
}

export async function logoutAction(): Promise<void> {
    await apiFetch.post("/auth/logout")

    deleteCookie("accessToken")
    deleteCookie("refreshToken")

    redirect("/login")
}