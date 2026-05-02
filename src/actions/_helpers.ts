import { z } from "zod"
import type { ActionState } from "@/types/api.types"

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
