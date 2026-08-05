/* eslint-disable @typescript-eslint/no-explicit-any */
"use server"

import { mapApiErrors, zodErrors } from "@/actions/_helpers"
import { apiFetch, parseResponse } from "@/lib/api"
import { getAccessToken } from "@/lib/cookie"
import type { ActionState } from "@/types/api.types"
import { changePasswordSchema, updateProfileSchema } from "@/zod/user.schemas"
import { updateTag } from "next/cache"
import { redirect } from "next/navigation"

export async function updateProfileAction(
  _prev: ActionState | null,
  formData: FormData
): Promise<ActionState> {
  try {
    console.log('called here');
    const raw = {
      name: formData.get("name") as string,
      phone: (formData.get("phone") as string) || undefined,
    }

    const parsed = updateProfileSchema.safeParse(raw)
    if (!parsed.success) {
      return {
        errors: zodErrors(parsed.error),
        fields: { name: raw.name ?? "", phone: raw.phone ?? "" },
      }
    }

    const accessToken = await getAccessToken()
    if (!accessToken) {
      return { errors: { _form: ["You must be logged in."] } }
    }

    const avatarFile = formData.get("avatar") as File | null

    const body = new FormData()
    body.append("name", parsed.data.name)
    if (parsed.data.phone) body.append("phone", parsed.data.phone)
    if (avatarFile && avatarFile.size > 0) body.append("file", avatarFile)

    const response = await apiFetch.patch("/users/me", { body, accessToken })
    const res = await parseResponse(response)

    if (!res.success) {
      return {
        errors: mapApiErrors(res, ["name", "phone", "avatar"]),
        fields: { name: raw.name ?? "", phone: raw.phone ?? "" },
      }
    }

    updateTag("user-profile")

    return { success: true, message: res.message ?? "Profile updated successfully!" }
  } catch (error) {
    console.error("updateProfileAction error:", error)
    return {
      errors: {
        _form: [
          error instanceof Error
            ? error.message
            : "An unexpected error occurred. Please try again.",
        ],
      },
    }
  }
}

export async function changePasswordAction(
  _prev: ActionState | null,
  formData: FormData
): Promise<ActionState> {
  const raw = {
    oldPassword: formData.get("oldPassword") as string,
    newPassword: formData.get("newPassword") as string,
  }

  const parsed = changePasswordSchema.safeParse(raw)
  if (!parsed.success) {
    return { errors: zodErrors(parsed.error) }
  }

  const accessToken = await getAccessToken()
  if (!accessToken) {
    return { errors: { _form: ["You must be logged in."] } }
  }

  try {
    const response = await apiFetch.post("/auth/change-password", {
      body: parsed.data,
      accessToken,
    })
    const res = await parseResponse(response)

    if (!res.success) {
      return { errors: mapApiErrors(res, ["oldPassword", "newPassword"]) }
    }

    return { success: true, message: res.message ?? "Password changed successfully!" }
  } catch (error) {
    console.error("changePasswordAction error:", error)
    return {
      errors: {
        _form: [
          error instanceof Error
            ? error.message
            : "An unexpected error occurred. Please try again.",
        ],
      },
    }
  }
}

export async function updateHostProfileAction(
  _prev: ActionState | null,
  formData: FormData
): Promise<ActionState> {
  const raw = {
    business_name: formData.get("business_name") as string,
    nid_number: formData.get("nid_number") as string,
  }

  const accessToken = await getAccessToken()
  if (!accessToken) {
    return { errors: { _form: ["You must be logged in."] } }
  }

  try {
    const response = await apiFetch.patch("/hosts/me", {
      body: raw,
      accessToken,
    })
    const res = await parseResponse(response)

    if (!res.success) {
      return {
        errors: mapApiErrors(res, ["business_name", "nid_number"]),
        fields: { business_name: raw.business_name ?? "", nid_number: raw.nid_number ?? "" },
      }
    }

    updateTag("user-profile")

    return { success: true, message: res.message ?? "Host profile updated successfully!" }
  } catch (error) {
    console.error("updateHostProfileAction error:", error)
    return {
      errors: {
        _form: [
          error instanceof Error
            ? error.message
            : "An unexpected error occurred. Please try again.",
        ],
      },
    }
  }
}

export async function deleteAccountAction(): Promise<ActionState> {
  const accessToken = await getAccessToken()
  if (!accessToken) {
    return { errors: { _form: ["You must be logged in."] } }
  }

  try {
    const response = await apiFetch.delete("/users/me", { accessToken })
    const res = await parseResponse(response)

    if (!res.success) {
      return { errors: { _form: [res.message ?? "Failed to delete account."] } }
    }

    redirect("/login")
  } catch (error) {
    // if (error instanceof Error && error.message === "NEXT_REDIRECT") throw error
    console.error("deleteAccountAction error:", error)
    return {
      errors: {
        _form: [
          error instanceof Error
            ? error.message
            : "An unexpected error occurred. Please try again.",
        ],
      },
    }
  }
}