import { z } from "zod"
import type { ActionState, ApiResponse } from "@/types/api.types"

export function zodErrors(error: z.ZodError): ActionState["errors"] {
    const flat = z.flattenError(error).fieldErrors
    const result: NonNullable<ActionState["errors"]> = {}
    for (const [key, messages] of Object.entries(flat)) {
        if (Array.isArray(messages) && messages.length > 0) {
            result[key] = messages
        }
    }
    return result
}

export function mapApiErrors(
    json: ApiResponse,
    allowedFields: string[]
): Record<string, string[]> {
    const result: Record<string, string[]> = {}

    for (const err of json.errors ?? []) {
        const key = err.field && allowedFields.includes(err.field) ? err.field : "_form"
        result[key] = [...(result[key] ?? []), err.message]
    }

    if (!Object.keys(result).length) {
        result._form = [json.message ?? "An unexpected error occurred."]
    }

    return result
}