"use client"

import { useState, useMemo } from "react"
import { parse, format, addDays } from "date-fns"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { EditSlotDialog } from "./EditSlotDialog"
import { DeleteSlotDialog } from "./DeleteSlotDialog"
import type { Slot } from "@/types/field.types"
import { HugeiconsIcon } from "@hugeicons/react"
import {
    PencilEdit01Icon,
    Delete01Icon,
    Calendar02Icon,
    Ticket01Icon,
    Dollar02Icon,
    Clock01Icon,
} from "@hugeicons/core-free-icons"
import { cn } from "@/lib/utils"

const statusVariantColors: Record<string, string> = {
    AVAILABLE: "bg-primary/10 text-primary border-primary/25",
    BOOKED: "bg-secondary/10 text-secondary border-secondary/25",
    BLOCKED: "bg-destructive/10 text-destructive border-destructive/25",
}

const statusBorderColors: Record<string, string> = {
    AVAILABLE: "border-primary/20 hover:border-primary/50 bg-primary/[0.02] dark:hover:bg-primary/[0.04]",
    BOOKED: "border-secondary/25 bg-secondary/[0.02]",
    BLOCKED: "border-destructive/20 hover:border-destructive/50 bg-destructive/[0.02]",
}

type SlotTableProps = {
    slots: Slot[]
    fieldId: string
}

export function SlotTable({ slots, fieldId }: SlotTableProps) {
    const [editSlot, setEditSlot] = useState<Slot | null>(null)
    const [deleteSlot, setDeleteSlot] = useState<Slot | null>(null)
    const [statusFilter, setStatusFilter] = useState<"ALL" | "AVAILABLE" | "BOOKED" | "BLOCKED">("ALL")

    const formatTime = (timeStr: string) => {
        const parsed = parse(timeStr, "HH:mm", new Date())
        return format(parsed, "h:mm aa").toLowerCase()
    }

    // Group slots by date
    const slotsByDate = useMemo(() => {
        const groups: Record<string, Slot[]> = {}
        slots.forEach((slot) => {
            const dateStr = slot.date.split("T")[0]
            if (!groups[dateStr]) {
                groups[dateStr] = []
            }
            groups[dateStr].push(slot)
        })

        // Sort slots inside each date chronologically by start time
        Object.keys(groups).forEach((dateStr) => {
            groups[dateStr].sort((a, b) => a.startTime.localeCompare(b.startTime))
        })

        return groups
    }, [slots])

    // Get sorted list of unique dates
    const uniqueDates = useMemo(() => {
        return Object.keys(slotsByDate).sort()
    }, [slotsByDate])

    // Default to the first date in the list, or null if no dates
    const [selectedDate, setSelectedDate] = useState<string | null>(null)

    // Sync selected date when dates list updates
    const activeDate = selectedDate || uniqueDates[0] || null

    // Compute stats
    const stats = useMemo(() => {
        const total = slots.length
        const booked = slots.filter((s) => s.status === "BOOKED").length
        const available = slots.filter((s) => s.status === "AVAILABLE").length
        const blocked = slots.filter((s) => s.status === "BLOCKED").length
        const rate = total > 0 ? Math.round((booked / total) * 100) : 0
        const revenue = slots
            .filter((s) => s.status === "BOOKED")
            .reduce((sum, s) => sum + s.pricePerSlot, 0)
        const potentialRevenue = slots
            .filter((s) => s.status === "AVAILABLE")
            .reduce((sum, s) => sum + s.pricePerSlot, 0)

        return { total, booked, available, blocked, rate, revenue, potentialRevenue }
    }, [slots])

    // Filter slots for the active date
    const filteredActiveSlots = useMemo(() => {
        if (!activeDate) return []
        const daySlots = slotsByDate[activeDate] || []
        if (statusFilter === "ALL") return daySlots
        return daySlots.filter((s) => s.status === statusFilter)
    }, [activeDate, slotsByDate, statusFilter])

    const today = useMemo(() => new Date().toISOString().split("T")[0], [])
    const tomorrow = useMemo(() => addDays(new Date(), 1).toISOString().split("T")[0], [])

    const formatDateTab = (dateStr: string) => {
        const dateObj = new Date(dateStr)

        if (dateStr === today) return "Today"
        if (dateStr === tomorrow) return "Tomorrow"

        return dateObj.toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            weekday: "short",
        })
    }

    const formatDateHeading = (dateStr: string) => {
        return new Date(dateStr).toLocaleDateString("en-GB", {
            weekday: "long",
            day: "2-digit",
            month: "long",
            year: "numeric",
        })
    }

    return (
        <div className="space-y-6">
            {/* Slot Performance / Booking Stats (Turf-Booking Style Analytics) */}
            <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
                <Card className="border-border/30 bg-card/60 backdrop-blur-sm shadow-md overflow-hidden relative">
                    <div className="absolute top-0 left-0 w-[4px] h-full bg-secondary" />
                    <CardContent className="p-4 flex items-center justify-between">
                        <div className="space-y-1">
                            <span className="text-muted-foreground text-[10px] uppercase font-bold tracking-wider block">Booking Analytics</span>
                            <div className="flex items-baseline gap-2">
                                <span className="text-2xl font-black text-foreground">{stats.booked}</span>
                                <span className="text-xs text-muted-foreground">/ {stats.total} slots booked</span>
                            </div>
                            <span className="text-xs text-secondary font-bold block">
                                {stats.rate}% occupancy rate
                            </span>
                        </div>
                        <div className="size-10 bg-secondary/10 rounded-xl flex items-center justify-center text-secondary">
                            <HugeiconsIcon icon={Ticket01Icon} className="size-5" />
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-border/30 bg-card/60 backdrop-blur-sm shadow-md overflow-hidden relative">
                    <div className="absolute top-0 left-0 w-[4px] h-full bg-primary" />
                    <CardContent className="p-4 flex items-center justify-between">
                        <div className="space-y-1">
                            <span className="text-muted-foreground text-[10px] uppercase font-bold tracking-wider block">Active Revenue (BDT)</span>
                            <div className="flex items-baseline gap-2">
                                <span className="text-2xl font-black text-foreground">৳{stats.revenue.toLocaleString()}</span>
                            </div>
                            <span className="text-xs text-primary font-bold block">
                                Potential +৳{stats.potentialRevenue.toLocaleString()} available
                            </span>
                        </div>
                        <div className="size-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                            <HugeiconsIcon icon={Dollar02Icon} className="size-5" />
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-border/30 bg-card/60 backdrop-blur-sm shadow-md overflow-hidden relative">
                    <div className="absolute top-0 left-0 w-[4px] h-full bg-foreground/30" />
                    <CardContent className="p-4 flex items-center justify-between">
                        <div className="space-y-1">
                            <span className="text-muted-foreground text-[10px] uppercase font-bold tracking-wider block">Availability Tracker</span>
                            <div className="flex items-baseline gap-2">
                                <span className="text-2xl font-black text-foreground">{stats.available}</span>
                                <span className="text-xs text-muted-foreground">slots open for booking</span>
                            </div>
                            <span className="text-xs text-muted-foreground font-bold block">
                                {stats.blocked} slots blocked
                            </span>
                        </div>
                        <div className="size-10 bg-muted rounded-xl flex items-center justify-center text-muted-foreground">
                            <HugeiconsIcon icon={Clock01Icon} className="size-5" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Date Selection Tab Bar (Sporty Horizontal Scroller) */}
            {uniqueDates.length > 0 && (
                <div className="flex flex-col gap-4">
                    <div className="flex items-center justify-between border-b border-border/40 pb-2.5">
                        <h3 className="text-sm font-bold text-foreground flex items-center gap-1.5">
                            <HugeiconsIcon icon={Calendar02Icon} className="size-4 text-primary" />
                            Select Booking Date
                        </h3>

                        {/* Status Filters */}
                        <div className="flex items-center gap-1.5 bg-muted/65 p-1 rounded-xl border border-border/40 text-[10px] font-bold">
                            {(["ALL", "AVAILABLE", "BOOKED", "BLOCKED"] as const).map((filter) => (
                                <button
                                    key={filter}
                                    onClick={() => setStatusFilter(filter)}
                                    className={cn(
                                        "px-2.5 py-1 rounded-lg transition-colors capitalize",
                                        statusFilter === filter
                                            ? "bg-background shadow-sm text-foreground"
                                            : "text-muted-foreground hover:text-foreground"
                                    )}
                                >
                                    {filter.toLowerCase()}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="flex gap-2.5 overflow-x-auto pb-2 -mx-1 px-1 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-muted">
                        {uniqueDates.map((dateStr) => {
                            const isSelected = activeDate === dateStr
                            const count = slotsByDate[dateStr]?.length || 0
                            const bookedCount = slotsByDate[dateStr]?.filter((s) => s.status === "BOOKED").length || 0
                            const isFullyBooked = count > 0 && bookedCount === count

                            return (
                                <button
                                    key={dateStr}
                                    onClick={() => {
                                        setSelectedDate(dateStr)
                                        setStatusFilter("ALL")
                                    }}
                                    className={cn(
                                        "flex flex-col items-center justify-center py-2.5 px-4 rounded-xl border font-bold min-w-[95px] transition-all text-xs select-none shadow-sm",
                                        isSelected
                                            ? "bg-primary text-primary-foreground border-primary scale-[1.03] shadow-primary/10"
                                            : isFullyBooked
                                                ? "bg-muted/40 text-muted-foreground/60 border-border/30 line-through"
                                                : "bg-card hover:bg-muted/40 border-border hover:border-border-hover"
                                    )}
                                >
                                    <span>{formatDateTab(dateStr)}</span>
                                    <span className={cn(
                                        "text-[10px] mt-1 font-semibold",
                                        isSelected ? "text-primary-foreground/80" : "text-muted-foreground"
                                    )}>
                                        {count} {count === 1 ? "Slot" : "Slots"}
                                    </span>
                                </button>
                            )
                        })}
                    </div>
                </div>
            )}

            {/* Active Date slots grid */}
            {activeDate ? (
                <div className="space-y-4">
                    <div className="flex flex-col gap-1">
                        <span className="text-[10px] font-black uppercase tracking-wider text-primary">
                            Available slots for
                        </span>
                        <h4 className="text-base font-black text-foreground">
                            {formatDateHeading(activeDate)}
                        </h4>
                    </div>

                    {filteredActiveSlots.length === 0 ? (
                        <div className="py-12 border border-dashed rounded-2xl flex flex-col items-center justify-center text-center bg-muted/10 gap-2">
                            <h5 className="font-bold text-sm">No slots match search filter</h5>
                            <p className="text-xs text-muted-foreground max-w-[200px]">
                                Try resetting the status filters or select another date from the calendar.
                            </p>
                        </div>
                    ) : (
                        <div className="grid gap-3.5 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
                            {filteredActiveSlots.map((slot) => {
                                const isBooked = slot.status === "BOOKED"
                                const isBlocked = slot.status === "BLOCKED"

                                return (
                                    <Card
                                        key={slot.id}
                                        className={cn(
                                            "border transition-all duration-300 relative group overflow-hidden shadow-sm hover:shadow-md",
                                            statusBorderColors[slot.status] || "border-border"
                                        )}
                                    >
                                        <CardContent className="p-4 flex flex-col justify-between gap-4 h-full">
                                            {/* Status Badge & Price */}
                                            <div className="flex items-center justify-between">
                                                <Badge
                                                    variant="outline"
                                                    className={cn(
                                                        "text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider",
                                                        statusVariantColors[slot.status] || ""
                                                    )}
                                                >
                                                    {slot.status}
                                                </Badge>
                                                <span className="text-sm font-black text-foreground">
                                                    ৳{slot.pricePerSlot.toLocaleString()}
                                                </span>
                                            </div>

                                            {/* Time block */}
                                            <div className="flex items-center gap-2">
                                                <span className="text-base font-bold text-foreground">
                                                    {formatTime(slot.startTime)} – {formatTime(slot.endTime)}
                                                </span>
                                            </div>

                                            {/* Action panel (Only edit/delete if not booked) */}
                                            <div className="flex items-center justify-between border-t border-border/20 pt-2.5">
                                                <span className="text-[10px] text-muted-foreground font-semibold flex items-center gap-1">
                                                    <HugeiconsIcon icon={Clock01Icon} className="size-3.5 text-primary" />
                                                    1 Hr Turf Slot
                                                </span>
                                                <div className="flex gap-1.5 opacity-80 group-hover:opacity-100 transition-opacity">
                                                    <Button
                                                        variant="ghost"
                                                        size="icon-sm"
                                                        onClick={() => setEditSlot(slot)}
                                                        disabled={isBooked}
                                                        className="size-7 hover:bg-primary/10 hover:text-primary disabled:opacity-30 rounded-lg"
                                                        aria-label="Edit slot details"
                                                    >
                                                        <HugeiconsIcon icon={PencilEdit01Icon} className="size-3.5" />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon-sm"
                                                        onClick={() => setDeleteSlot(slot)}
                                                        disabled={isBooked}
                                                        className="size-7 hover:bg-destructive/10 text-destructive disabled:opacity-30 rounded-lg"
                                                        aria-label="Delete slot"
                                                    >
                                                        <HugeiconsIcon icon={Delete01Icon} className="size-3.5" />
                                                    </Button>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                )
                            })}
                        </div>
                    )}
                </div>
            ) : (
                <div className="py-16 border border-dashed rounded-2xl flex flex-col items-center justify-center text-center bg-muted/10 gap-2">
                    <HugeiconsIcon icon={Calendar02Icon} className="size-8 text-muted-foreground animate-bounce" />
                    <h5 className="font-bold text-sm">Create Slots to Get Started</h5>
                    <p className="text-xs text-muted-foreground max-w-xs">
                        Generate booking dates and price rates for your turf field above so players can start reserving slots!
                    </p>
                </div>
            )}

            {/* Dialog structures */}
            {editSlot && (
                <EditSlotDialog
                    slot={editSlot}
                    open={!!editSlot}
                    onOpenChange={(open) => {
                        if (!open) setEditSlot(null)
                    }}
                />
            )}

            {deleteSlot && (
                <DeleteSlotDialog
                    fieldId={fieldId}
                    slotId={deleteSlot.id}
                    slotLabel={`${formatTime(deleteSlot.startTime)}–${formatTime(deleteSlot.endTime)} on ${new Date(
                        deleteSlot.date
                    ).toLocaleDateString()}`}
                    open={!!deleteSlot}
                    onOpenChange={(open) => {
                        if (!open) setDeleteSlot(null)
                    }}
                />
            )}
        </div>
    )
}