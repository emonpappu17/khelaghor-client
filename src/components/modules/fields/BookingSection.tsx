import "server-only"
import { getFieldSlots } from "@/queries/field.queries"
import { getCurrentUser } from "@/queries/user.queries"
import type { Slot } from "@/types/field.types"
import type { AuthUser } from "@/types/api.types"
import { SlotBooking } from "./SlotBooking"

interface Props {
    fieldId: string
}

export default async function BookingSection({ fieldId }: Props) {
    // Fetch slots and current user in parallel inside this section
    const [slotsRes, userRes] = await Promise.all([
        getFieldSlots(fieldId),
        getCurrentUser(),
    ])

    const slots: Slot[] = slotsRes?.data || []
    const user: AuthUser | null = userRes?.data || null

    return (
        <SlotBooking slots={slots} fieldId={fieldId} user={user} />
    )
}
