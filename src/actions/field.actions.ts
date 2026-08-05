"use server"

import { mapApiErrors, zodErrors } from "@/actions/_helpers"
import { apiFetch, parseResponse } from "@/lib/api"
import { getAccessToken } from "@/lib/cookie"
import type { ActionState } from "@/types/api.types"
import type { CreateSlotsResult, Field, Slot } from "@/types/field.types"
import {
    createFieldSchema,
    createSlotsSchema,
    updateFieldSchema,
    updateSlotSchema,
} from "@/zod/field.schemas"
import { updateTag } from "next/cache"

// ─── Field Action Types ───────────────────────────────────
export type CreateFieldState = ActionState<Field>
export type UpdateFieldState = ActionState<Field>
export type DeleteFieldState = ActionState<{ deleted: boolean }>
export type CreateSlotsState = ActionState<CreateSlotsResult>
export type UpdateSlotState = ActionState<Slot>
export type DeleteSlotState = ActionState<{ deleted: boolean }>

// ─── Field Actions ────────────────────────────────────────

// export async function createFieldAction(
//     _prev: CreateFieldState,
//     formData: FormData
// ): Promise<CreateFieldState> {
//     const raw = {
//         name: formData.get("name") as string,
//         sportType: formData.get("sportType") as string,
//         description: formData.get("description") as string,
//         maxPlayers: formData.get("maxPlayers") as string || undefined,
//         facilities: formData.get("facilities") as string || undefined,
//         division: formData.get("division") as string,
//         address: formData.get("address") as string,
//         area: formData.get("area") as string,
//     }
//     console.log('raw==>', raw);
//     const parsed = createFieldSchema.safeParse(raw)
//     if (!parsed.success) {
//         return {
//             errors: zodErrors(parsed.error),
//             fields: {
//                 name: raw.name ?? "",
//                 sportType: raw.sportType ?? "",
//                 description: raw.description ?? "",
//                 maxPlayers: raw.maxPlayers ?? "",
//                 facilities: raw.facilities ?? "",
//                 division: raw.division ?? "",
//                 address: raw.address ?? "",
//                 area: raw.area ?? "",
//             },
//         }
//     }

//     // console.log('parsed==>', parsed);

//     const apiFormData = new FormData()
//     apiFormData.set("name", parsed.data.name)
//     apiFormData.set("sportType", parsed.data.sportType)
//     apiFormData.set("description", parsed.data.description)
//     if (parsed.data.maxPlayers) {
//         apiFormData.set("maxPlayers", String(parsed.data.maxPlayers))
//     }
//     apiFormData.set("division", parsed.data.division)
//     apiFormData.set("address", parsed.data.address)
//     apiFormData.set("area", parsed.data.area)

//     if (parsed.data.facilities) {
//         parsed.data.facilities
//             .split(",")
//             .map((f) => f.trim())
//             .filter(Boolean)
//             .forEach((f) => apiFormData.append("facilities", f))
//     }

//     const files = formData.getAll("files") as File[]
//     files.forEach((file) => {
//         if (file && file.size > 0) apiFormData.append("files", file)
//     })
//     // console.log(' apiFormData==>', apiFormData);
//     const accessToken = await getAccessToken();
//     const response = await apiFetch.post("/fields", { body: apiFormData, accessToken })
//     const res = await parseResponse<Field>(response)

//     // console.log('res==>', res);

//     if (!res.success) {
//         return {
//             errors: mapApiErrors(res, [
//                 "name", "sportType", "description", "maxPlayers",
//                 "facilities", "division", "address", "area",
//             ]),
//             fields: {
//                 name: raw.name ?? "",
//                 sportType: raw.sportType ?? "",
//                 description: raw.description ?? "",
//                 maxPlayers: raw.maxPlayers ?? "",
//                 facilities: raw.facilities ?? "",
//                 division: raw.division ?? "",
//                 address: raw.address ?? "",
//                 area: raw.area ?? "",
//             },
//         }
//     }

//     updateTag("my-field")
//     return { success: true, message: "Field created successfully!", data: res.data }
// }

export async function createFieldAction(
    _prev: CreateFieldState,
    formData: FormData
): Promise<CreateFieldState> {
    const raw = {
        name: formData.get("name") as string,
        sportType: formData.get("sportType") as string,
        description: formData.get("description") as string,
        maxPlayers: (formData.get("maxPlayers") as string) || undefined,
        facilities: (formData.get("facilities") as string) || undefined,
        division: formData.get("division") as string,
        address: formData.get("address") as string,
        area: formData.get("area") as string,
    }

    // Normalized version for display back in the form (Record<string, string>)
    const fieldsForDisplay: Record<string, string> = {
        name: raw.name ?? "",
        sportType: raw.sportType ?? "",
        description: raw.description ?? "",
        maxPlayers: raw.maxPlayers ?? "",
        facilities: raw.facilities ?? "",
        division: raw.division ?? "",
        address: raw.address ?? "",
        area: raw.area ?? "",
    }

    const parsed = createFieldSchema.safeParse(raw)
    if (!parsed.success) {
        return {
            errors: zodErrors(parsed.error),
            fields: fieldsForDisplay,
        }
    }

    const apiFormData = new FormData()
    apiFormData.set("name", parsed.data.name)
    apiFormData.set("sportType", parsed.data.sportType)
    apiFormData.set("description", parsed.data.description)
    if (parsed.data.maxPlayers) {
        apiFormData.set("maxPlayers", String(parsed.data.maxPlayers))
    }
    apiFormData.set("division", parsed.data.division)
    apiFormData.set("address", parsed.data.address)
    apiFormData.set("area", parsed.data.area)

    if (parsed.data.facilities) {
        parsed.data.facilities
            .split(",")
            .map((f) => f.trim())
            .filter(Boolean)
            .forEach((f) => apiFormData.append("facilities", f))
    }

    const files = formData.getAll("files") as File[]
    files.forEach((file) => {
        if (file && file.size > 0) apiFormData.append("files", file)
    })

    try {
        const accessToken = await getAccessToken()
        const response = await apiFetch.post("/fields", { body: apiFormData, accessToken })
        const res = await parseResponse<Field>(response)

        if (!res.success) {
            return {
                errors: mapApiErrors(res, [
                    "name", "sportType", "description", "maxPlayers",
                    "facilities", "division", "address", "area",
                ]),
                fields: fieldsForDisplay,
            }
        }

        updateTag("my-field")
        return { success: true, message: "Field created successfully!", data: res.data }
    } catch (err) {
        console.error("createFieldAction unexpected error:", err)

        const message =
            err instanceof TypeError && err.message === "fetch failed"
                ? "Could not reach the server. Please check your connection and try again."
                : "Something went wrong while creating the field. Please try again."

        return {
            errors: { _form: [message] },
            fields: fieldsForDisplay,
        }
    }
}

export async function updateFieldAction(
    fieldId: string,
    _prev: UpdateFieldState,
    formData: FormData
): Promise<UpdateFieldState> {
    const raw = {
        name: formData.get("name") as string || undefined,
        sportType: formData.get("sportType") as string || undefined,
        description: formData.get("description") as string || undefined,
        maxPlayers: formData.get("maxPlayers") as string || undefined,
        facilities: formData.get("facilities") as string || undefined,
        division: formData.get("division") as string || undefined,
        address: formData.get("address") as string || undefined,
        area: formData.get("area") as string || undefined,
    }

    const parsed = updateFieldSchema.safeParse(raw)
    if (!parsed.success) {
        return { errors: zodErrors(parsed.error) }
    }

    const apiFormData = new FormData()
    for (const [key, value] of Object.entries(parsed.data)) {
        if (value !== undefined && key !== "facilities") {
            apiFormData.set(key, String(value))
        }
    }

    if (parsed.data.facilities) {
        parsed.data.facilities
            .split(",")
            .map((f) => f.trim())
            .filter(Boolean)
            .forEach((f) => apiFormData.append("facilities", f))
    }

    const files = formData.getAll("files") as File[]
    files.forEach((file) => {
        if (file && file.size > 0) apiFormData.append("files", file)
    })

    const accessToken = await getAccessToken();
    const response = await apiFetch.patch(`/fields/${fieldId}`, { body: apiFormData, accessToken })
    const res = await parseResponse<Field>(response)

    if (!res.success) {
        return {
            errors: mapApiErrors(res, [
                "name", "sportType", "description", "maxPlayers",
                "facilities", "division", "address", "area",
            ]),
        }
    }

    updateTag("my-field")
    return { success: true, message: "Field updated successfully!", data: res.data }
}

export async function deleteFieldAction(fieldId: string): Promise<DeleteFieldState> {
    const accessToken = await getAccessToken();
    const response = await apiFetch.delete(`/fields/${fieldId}`, { accessToken })
    const res = await parseResponse(response)

    if (!res.success) {
        return { errors: { _form: [res.message ?? "Failed to delete field."] } }
    }

    updateTag("my-field")
    // updateTag(`field-slots-${fieldId}`)
    // updateTag("field-slots")
    // updateTag("fields")
    // updateTag(`field-${fieldId}`)

    return { success: true, message: "Field deleted successfully!", data: { deleted: true } }
}

// ─── Slot Actions ─────────────────────────────────────────

export async function createSlotsAction(
    fieldId: string,
    _prev: CreateSlotsState,
    formData: FormData
): Promise<CreateSlotsState> {
    const raw = {
        startDate: formData.get("startDate") as string,
        endDate: formData.get("endDate") as string,
        startTime: formData.get("startTime") as string,
        endTime: formData.get("endTime") as string,
        slotDurationMinutes: formData.get("slotDurationMinutes") as string,
        pricePerSlot: formData.get("pricePerSlot") as string,
    }

    // console.log('raw==>', raw);

    const parsed = createSlotsSchema.safeParse(raw)
    if (!parsed.success) {
        return {
            errors: zodErrors(parsed.error),
            fields: {
                startDate: raw.startDate ?? "",
                endDate: raw.endDate ?? "",
                startTime: raw.startTime ?? "",
                endTime: raw.endTime ?? "",
                slotDurationMinutes: raw.slotDurationMinutes ?? "60",
                pricePerSlot: raw.pricePerSlot ?? "",
            },
        }
    }

    const accessToken = await getAccessToken();
    const response = await apiFetch.post(`/slots/${fieldId}`, {
        body: parsed.data as unknown as Record<string, unknown>,
        accessToken
    })
    const res = await parseResponse<CreateSlotsResult>(response)

    if (!res.success) {
        return {
            errors: mapApiErrors(res, [
                "startDate", "endDate", "startTime", "endTime",
                "slotDurationMinutes", "pricePerSlot",
            ]),
            fields: {
                startDate: raw.startDate ?? "",
                endDate: raw.endDate ?? "",
                startTime: raw.startTime ?? "",
                endTime: raw.endTime ?? "",
                slotDurationMinutes: raw.slotDurationMinutes ?? "60",
                pricePerSlot: raw.pricePerSlot ?? "",
            },
        }
    }

    updateTag("field-slots")
    return { success: true, message: res.data?.message ?? "Slots created!", data: res.data }
}

export async function updateSlotAction(
    fieldId: string,
    slotId: string,
    _prev: UpdateSlotState,
    formData: FormData
): Promise<UpdateSlotState> {
    const raw = {
        pricePerSlot: formData.get("pricePerSlot") as string || undefined,
        status: formData.get("status") as string || undefined,
    }

    const parsed = updateSlotSchema.safeParse(raw)
    if (!parsed.success) {
        return { errors: zodErrors(parsed.error) }
    }
    const accessToken = await getAccessToken();

    const response = await apiFetch.patch(`/slots/${fieldId}/${slotId}`, {
        body: parsed.data as unknown as Record<string, unknown>,
        accessToken
    })
    const res = await parseResponse<Slot>(response)

    if (!res.success) {
        return { errors: mapApiErrors(res, ["pricePerSlot", "status"]) }
    }

    updateTag("field-slots")
    return { success: true, message: "Slot updated successfully!", data: res.data }
}

export async function deleteSlotAction(
    fieldId: string,
    slotId: string
): Promise<DeleteSlotState> {
    const accessToken = await getAccessToken();
    const response = await apiFetch.delete(`/slots/${fieldId}/${slotId}`, { accessToken })
    const res = await parseResponse(response)

    if (!res.success) {
        return { errors: { _form: [res.message ?? "Failed to delete slot."] } }
    }

    updateTag("field-slots")
    return { success: true, message: "Slot deleted successfully!", data: { deleted: true } }
}