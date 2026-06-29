import type { SportType } from "./field.types"

export type BookingStatus = "PENDING" | "CONFIRMED" | "COMPLETED" | "CANCELLED"
export type PaymentStatus = "PENDING" | "COMPLETED" | "FAILED" | "CANCELLED" | "REFUNDED"
export type PaymentType = "FULL" | "PARTIAL"

export interface BookingPayment {
    id: string
    bookingId: string
    amount: number
    type: PaymentType
    status: PaymentStatus
    transactionId: string
    gatewayPageURL?: string | null
    valId?: string | null
    paymentMethod?: string | null
    paidAt?: string | null
    createdAt: string
    updatedAt: string
}

export interface BookingSlot {
    id: string
    fieldId: string
    date: string
    startTime: string
    endTime: string
    pricePerSlot: number
    status: string
    field: {
        id: string
        name: string
        sportType: SportType
        address: string
        division: string
        district: string
        area: string
        images?: string[]
    }
}

export interface BookingUser {
    id: string
    name: string
    email: string
    phone: string | null
    avatar: string | null
}

export interface Booking {
    id: string
    slotId: string
    userId: string
    totalAmount: number
    paidAmount: number
    dueAmount: number
    platformFee: number
    hostAmount: number
    bookingStatus: BookingStatus
    cancellationReason: string
    cancelledAt: string
    expiresAt: string
    createdAt: string
    updatedAt: string
    slot: BookingSlot
    payments: BookingPayment[]
    user?: BookingUser
    paymentUrl?: string | null
}

export interface BookingsResponseData {
    bookings: Booking[]
}

// export interface BookingsResponseData {
//     bookings: Booking[]
// }
