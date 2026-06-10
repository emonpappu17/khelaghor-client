export type SportType = "FOOTBALL" | "CRICKET" | "BADMINTON" | "BASKETBALL" | "TENNIS"

export type FieldStatus = "ACTIVE" | "INACTIVE" | "SUSPENDED"

export type SlotStatus = "AVAILABLE" | "BOOKED" | "BLOCKED"

export type Field = {
    id: string
    hostId: string
    name: string
    sportType: SportType
    description: string
    maxPlayers: number
    facilities: string[]
    images: string[]
    division: string
    district: string
    address: string
    area: string
    latitude: number
    longitude: number
    status: FieldStatus
    averageRating: number
    totalReviews: number
    createdAt: string
    updatedAt: string
}

export type Slot = {
    id: string
    fieldId: string
    date: string
    startTime: string
    endTime: string
    pricePerSlot: number
    status: SlotStatus
    createdAt: string
    updatedAt: string
}

export type FieldsListData = {
    fields: Field[]
}

export type SlotsListData = Slot[]

export type CreateSlotsResult = {
    count: number
    totalGenerated: number
    message: string
}
