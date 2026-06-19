import { FieldSlotManager } from "./FieldSlotManager"
import { getAccessToken } from "@/lib/cookie"
import { getFieldSlots, getMyField } from "@/queries/field.queries"
import type { Slot } from "@/types/field.types"

export async function HostFieldPageContent() {
    const token = await getAccessToken()

    const fieldsRes = await getMyField(token)
    const field = fieldsRes?.data ?? null

    let slots: Slot[] = []

    if (field) {
        const slotsRes = await getFieldSlots(field.id, token)
        slots = slotsRes?.data ?? []
    }

    return <FieldSlotManager field={field} slots={slots} />
}
