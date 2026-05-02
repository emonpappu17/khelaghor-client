"use server"

import { zodErrors } from "@/actions/_helpers"
import { apiFetch, mapApiErrors } from "@/lib/api"
import type { ActionState, User } from "@/types/api.types"
import {
    registerSchema
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

    redirect("/login?registered=true")
}
