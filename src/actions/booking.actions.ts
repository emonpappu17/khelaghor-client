/* eslint-disable @typescript-eslint/no-explicit-any */
"use server"

import { apiFetch, parseResponse } from "@/lib/api"
import { getAccessToken } from "@/lib/cookie"
import type { ActionState } from "@/types/api.types"

export type BookingResult = {
    booking: {
        id: string
        totalAmount: number
        paidAmount: number
        dueAmount: number
        platformFee: number
        hostAmount: number
        bookingStatus: string
        expiresAt: string
    }
    payment: {
        id: string
        amount: number
        transactionId: string
        gatewayPageURL: string
    }
    paymentUrl: string
}

export type CreateBookingState = ActionState<BookingResult>

export async function createBookingAction(
    _prev: CreateBookingState,
    formData: FormData
): Promise<CreateBookingState> {
    const slotId = formData.get("slotId") as string
    const paymentType = formData.get("paymentType") as string

    if (!slotId) {
        return {
            errors: { slotId: ["Slot selection is required."] }
        }
    }

    if (!paymentType || (paymentType !== "FULL" && paymentType !== "PARTIAL")) {
        return {
            errors: { paymentType: ["Payment type must be FULL or PARTIAL."] }
        }
    }

    const accessToken = await getAccessToken()
    if (!accessToken) {
        return {
            errors: { _form: ["You must be logged in to book a slot."] }
        }
    }

    try {
        const response = await apiFetch.post("/bookings", {
            body: { slotId, paymentType },
            accessToken
        })

        const res = await parseResponse<BookingResult>(response)

        if (!res.success) {
            return {
                errors: { _form: [res.message || "Failed to create booking."] }
            }
        }

        return {
            success: true,
            message: res.message || "Booking created successfully!",
            data: res.data
        }
    } catch (err: any) {
        return {
            errors: { _form: [err?.message || "An unexpected error occurred."] }
        }
    }
}
