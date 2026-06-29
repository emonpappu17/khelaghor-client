"use client"

import React, { useState, useTransition } from "react"
import { useRouter, usePathname } from "next/navigation"
import type { Booking, BookingStatus } from "@/types/booking.types"
import type { PaginationMeta } from "@/types/api.types"
import { cancelBookingAction } from "@/actions/booking.actions"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Spinner } from "@/components/ui/spinner"
import { toast } from "sonner"
import {
    Search,
    MapPin,
    Calendar,
    Clock,
    CreditCard,
    X,
    ChevronLeft,
    ChevronRight,
    AlertCircle,
    Trophy,
    Activity,
    CalendarCheck,
} from "lucide-react"

type UserBookingsContentProps = {
    initialBookings: Booking[]
    meta: PaginationMeta
    currentPage: number
    currentTab: string
    searchQuery: string
}

export function UserBookingsContent({
    initialBookings,
    meta,
    currentPage,
    currentTab,
    searchQuery,
}: UserBookingsContentProps) {
    const router = useRouter()
    const pathname = usePathname()
    const [search, setSearch] = useState(searchQuery)
    const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null)
    const [cancelOpen, setCancelOpen] = useState(false)
    const [cancelReason, setCancelReason] = useState("")
    const [isPending, startTransition] = useTransition()

    const filteredBookings = initialBookings.filter((booking) => {
        if (!searchQuery) return true
        const q = searchQuery.toLowerCase()
        return (
            booking.slot.field.name.toLowerCase().includes(q) ||
            booking.slot.field.address.toLowerCase().includes(q) ||
            booking.slot.field.area.toLowerCase().includes(q) ||
            booking.slot.field.sportType.toLowerCase().includes(q)
        )
    })

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        const params = new URLSearchParams(window.location.search)
        if (search.trim()) {
            params.set("q", search.trim())
        } else {
            params.delete("q")
        }
        params.set("page", "1")
        router.push(`${pathname}?${params.toString()}`)
    }

    const handleClearSearch = () => {
        setSearch("")
        const params = new URLSearchParams(window.location.search)
        params.delete("q")
        params.set("page", "1")
        router.push(`${pathname}?${params.toString()}`)
    }

    const handleTabChange = (tab: string) => {
        const params = new URLSearchParams(window.location.search)
        if (tab === "all") {
            params.delete("status")
        } else {
            params.set("status", tab)
        }
        params.set("page", "1")
        router.push(`${pathname}?${params.toString()}`)
    }

    const handlePageChange = (newPage: number) => {
        const params = new URLSearchParams(window.location.search)
        params.set("page", String(newPage))
        router.push(`${pathname}?${params.toString()}`)
    }

    const handleCancelBooking = (bookingId: string) => {
        startTransition(async () => {
            const res = await cancelBookingAction(bookingId, cancelReason.trim() || undefined)
            if (res.success) {
                toast.success(res.message || "Booking cancelled successfully!")
                setCancelOpen(false)
                setCancelReason("")
                setSelectedBooking(null)
            } else {
                toast.error(res.errors?._form?.[0] || "Failed to cancel booking.")
            }
        })
    }

    const handlePayNow = (booking: Booking) => {
        const pendingPayment = booking.payments.find(
            (p) => p.status === "PENDING" && p.gatewayPageURL
        )
        const paymentUrl = pendingPayment?.gatewayPageURL || booking.paymentUrl
        if (paymentUrl) {
            toast.loading("Redirecting to payment gateway...")
            window.location.assign(paymentUrl)
        } else {
            toast.error("Payment link is missing. Please contact support or book again.")
        }
    }

    const totalPages = Math.ceil(meta.total / meta.limit)

    const getStatusBadge = (status: BookingStatus) => {
        switch (status) {
            case "PENDING":
                return (
                    <Badge className="bg-amber-500/10 text-amber-600 border border-amber-500/20 dark:text-amber-400 font-bold uppercase tracking-wider text-[10px] rounded-full px-2.5">
                        Pending
                    </Badge>
                )
            case "CONFIRMED":
                return (
                    <Badge className="bg-primary/10 text-primary border border-primary/20 font-bold uppercase tracking-wider text-[10px] rounded-full px-2.5">
                        Confirmed
                    </Badge>
                )
            case "COMPLETED":
                return (
                    <Badge className="bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 dark:text-emerald-400 font-bold uppercase tracking-wider text-[10px] rounded-full px-2.5">
                        Completed
                    </Badge>
                )
            case "CANCELLED":
                return (
                    <Badge className="bg-rose-500/10 text-rose-600 border border-rose-500/20 dark:text-rose-400 font-bold uppercase tracking-wider text-[10px] rounded-full px-2.5">
                        Cancelled
                    </Badge>
                )
            default:
                return (
                    <Badge variant="secondary" className="font-bold uppercase tracking-wider text-[10px] rounded-full px-2.5">
                        {status}
                    </Badge>
                )
        }
    }

    const getSportIcon = (type: string) => {
        switch (type?.toUpperCase()) {
            case "FOOTBALL":
                return <Activity className="size-3.5 text-primary shrink-0" />
            case "CRICKET":
                return <Trophy className="size-3.5 text-amber-500 shrink-0" />
            default:
                return <Trophy className="size-3.5 text-blue-500 shrink-0" />
        }
    }

    const formatDate = (dateStr: string) => {
        try {
            return new Intl.DateTimeFormat("en-US", {
                weekday: "short",
                month: "short",
                day: "numeric",
                year: "numeric",
            }).format(new Date(dateStr))
        } catch {
            return dateStr
        }
    }

    const formatTime = (time24: string) => {
        try {
            const [hourStr, minStr] = time24.split(":")
            const hour = parseInt(hourStr)
            const ampm = hour >= 12 ? "PM" : "AM"
            const hour12 = hour % 12 || 12
            return `${hour12}:${minStr} ${ampm}`
        } catch {
            return time24
        }
    }

    const TABS = [
        { label: "All Bookings", value: "all" },
        { label: "Pending", value: "PENDING" },
        { label: "Confirmed", value: "CONFIRMED" },
        { label: "Completed", value: "COMPLETED" },
        { label: "Cancelled", value: "CANCELLED" },
    ]

    return (
        <div className="space-y-6">
            {/* SEARCH & FILTERS HEADER */}
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
                {/* Status Tabs */}
                <div className="flex bg-surface-container border border-border/30 rounded-xl p-1 shrink-0 overflow-x-auto max-w-full">
                    {TABS.map((tab) => (
                        <button
                            key={tab.value}
                            onClick={() => handleTabChange(tab.value)}
                            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                                currentTab === tab.value
                                    ? "bg-primary text-primary-foreground shadow-sm"
                                    : "text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high"
                            }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Search form */}
                <form onSubmit={handleSearchSubmit} className="relative w-full sm:max-w-md flex gap-2">
                    <div className="relative flex-1">
                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-on-surface-variant/60" />
                        <Input
                            placeholder="Search by ground, area, sport..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="pl-10 pr-10 w-full rounded-xl bg-surface-container border-border/40 focus:border-primary/50 text-sm h-10"
                        />
                        {search && (
                            <button
                                type="button"
                                onClick={handleClearSearch}
                                className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 rounded-full hover:bg-surface-container-high text-on-surface-variant"
                            >
                                <X className="size-3.5" />
                            </button>
                        )}
                    </div>
                    <Button type="submit" variant="secondary" className="rounded-xl h-10 px-4 font-bold text-xs">
                        Search
                    </Button>
                </form>
            </div>

            {/* BOOKINGS GRID */}
            {filteredBookings.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-64 gap-3">
                    <div className="p-4 rounded-2xl bg-surface-container border border-border/20 text-on-surface-variant/40">
                        <CalendarCheck className="size-8" />
                    </div>
                    <p className="font-bold text-sm text-on-surface">No bookings found</p>
                    <p className="text-xs text-on-surface-variant">
                        Try adjusting your filters or search criteria.
                    </p>
                </div>
            ) : (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {filteredBookings.map((booking) => {
                        const hasPendingPayment =
                            booking.bookingStatus === "PENDING" &&
                            booking.payments.some((p) => p.status === "PENDING")
                        const firstFieldImg = booking.slot.field.images?.[0]

                        return (
                            <div
                                key={booking.id}
                                className="group relative rounded-2xl border border-border/40 bg-card/40 backdrop-blur-md shadow-md hover:shadow-lg flex flex-col justify-between transition-all duration-300 hover:-translate-y-0.5 overflow-hidden"
                            >
                                {/* Field Image Banner */}
                                {firstFieldImg ? (
                                    // eslint-disable-next-line @next/next/no-img-element
                                    <img
                                        src={firstFieldImg}
                                        alt={booking.slot.field.name}
                                        className="w-full h-32 object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-32 bg-surface-container flex items-center justify-center border-b border-border/20">
                                        <Trophy className="size-8 text-on-surface-variant/30" />
                                    </div>
                                )}

                                <div className="p-4 space-y-3 flex flex-col flex-1">
                                    {/* Status + Sport row */}
                                    <div className="flex justify-between items-center">
                                        <div className="flex items-center gap-1.5 bg-surface-container-low border border-border/20 px-2 py-1 rounded-lg text-[10px] font-bold text-on-surface-variant uppercase tracking-wide">
                                            {getSportIcon(booking.slot.field.sportType)}
                                            <span>{booking.slot.field.sportType}</span>
                                        </div>
                                        {getStatusBadge(booking.bookingStatus)}
                                    </div>

                                    {/* Field name & address */}
                                    <div className="space-y-0.5">
                                        <h4 className="font-bold text-sm text-on-surface group-hover:text-primary transition-colors leading-tight">
                                            {booking.slot.field.name}
                                        </h4>
                                        <div className="flex items-center gap-1 text-xs text-on-surface-variant">
                                            <MapPin className="size-3 shrink-0" />
                                            <span className="truncate">{booking.slot.field.address}</span>
                                        </div>
                                    </div>

                                    {/* Date & Time */}
                                    <div className="rounded-xl bg-surface-container-low border border-border/20 p-2.5 space-y-1.5 text-xs">
                                        <div className="flex items-center gap-2 text-on-surface">
                                            <Calendar className="size-3.5 text-primary shrink-0" />
                                            <span className="font-bold">{formatDate(booking.slot.date)}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-on-surface-variant">
                                            <Clock className="size-3.5 text-primary shrink-0" />
                                            <span className="font-medium">
                                                {formatTime(booking.slot.startTime)} – {formatTime(booking.slot.endTime)}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Payment summary */}
                                    <div className="flex justify-between items-center text-xs border-t border-border/20 pt-2.5 mt-auto">
                                        <div className="flex items-center gap-1.5 text-on-surface-variant">
                                            <CreditCard className="size-3.5 shrink-0" />
                                            <span>
                                                Paid:{" "}
                                                <span className="font-semibold text-emerald-500">
                                                    ৳{booking.paidAmount}
                                                </span>
                                                {booking.dueAmount > 0 && (
                                                    <span className="text-rose-500 font-semibold">
                                                        {" "}(Due: ৳{booking.dueAmount})
                                                    </span>
                                                )}
                                            </span>
                                        </div>
                                        <div className="text-right">
                                            <span className="text-[10px] text-on-surface-variant uppercase font-bold leading-none block">
                                                Total
                                            </span>
                                            <span className="font-bold text-sm text-primary leading-tight">
                                                ৳{booking.totalAmount}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Cancellation reason pill */}
                                    {booking.bookingStatus === "CANCELLED" && booking.cancellationReason && (
                                        <div className="flex items-start gap-1.5 rounded-lg bg-rose-500/5 border border-rose-500/15 px-2.5 py-2 text-[10px] text-rose-400 font-medium">
                                            <AlertCircle className="size-3 shrink-0 mt-0.5" />
                                            <span>{booking.cancellationReason}</span>
                                        </div>
                                    )}

                                    {/* Action Buttons */}
                                    <div className="flex items-center gap-2 pt-1">
                                        {hasPendingPayment && (
                                            <Button
                                                onClick={() => handlePayNow(booking)}
                                                size="sm"
                                                className="flex-1 rounded-xl font-bold bg-primary text-primary-foreground hover:bg-primary-dim text-xs h-9"
                                            >
                                                Pay Now
                                            </Button>
                                        )}
                                        {booking.bookingStatus === "PENDING" ||
                                        booking.bookingStatus === "CONFIRMED" ? (
                                            <Button
                                                onClick={() => {
                                                    setSelectedBooking(booking)
                                                    setCancelOpen(true)
                                                }}
                                                variant="outline"
                                                size="sm"
                                                className={`rounded-xl font-bold border-border/40 hover:bg-rose-500/10 hover:text-rose-500 hover:border-rose-500/30 text-xs h-9 transition-all ${
                                                    !hasPendingPayment ? "flex-1" : ""
                                                }`}
                                            >
                                                Cancel
                                            </Button>
                                        ) : booking.bookingStatus === "COMPLETED" ? (
                                            <div className="flex-1 text-center py-1.5 bg-emerald-500/5 text-emerald-600 font-bold text-[10px] uppercase tracking-wider rounded-xl border border-emerald-500/15">
                                                Completed Session
                                            </div>
                                        ) : (
                                            <div className="flex-1 text-center py-1.5 bg-surface-container text-on-surface-variant/50 font-bold text-[10px] uppercase tracking-wider rounded-xl border border-border/20">
                                                Booking Cancelled
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            )}

            {/* PAGINATION */}
            {totalPages > 1 && (
                <div className="flex items-center justify-between py-2 px-1">
                    <span className="text-xs font-semibold text-on-surface-variant">
                        Showing Page {currentPage} of {totalPages} ({meta.total} total bookings)
                    </span>
                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            disabled={currentPage <= 1}
                            onClick={() => handlePageChange(currentPage - 1)}
                            className="rounded-xl border-border/40 h-9 font-bold text-xs"
                        >
                            <ChevronLeft className="size-4 mr-1" />
                            Previous
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            disabled={currentPage >= totalPages}
                            onClick={() => handlePageChange(currentPage + 1)}
                            className="rounded-xl border-border/40 h-9 font-bold text-xs"
                        >
                            Next
                            <ChevronRight className="size-4 ml-1" />
                        </Button>
                    </div>
                </div>
            )}

            {/* CANCELLATION DIALOG */}
            <Dialog
                open={cancelOpen}
                onOpenChange={(open) => {
                    if (!open && !isPending) {
                        setCancelOpen(false)
                        setSelectedBooking(null)
                        setCancelReason("")
                    }
                }}
            >
                <DialogContent className="sm:max-w-md rounded-2xl border-border/40 bg-card">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2 text-xl font-bold tracking-tight">
                            <AlertCircle className="size-5 text-rose-500" />
                            Cancel Booking
                        </DialogTitle>
                        <DialogDescription className="text-on-surface-variant text-sm mt-1">
                            Are you sure you want to cancel your booking at{" "}
                            <span className="font-bold text-on-surface">
                                {selectedBooking?.slot.field.name}
                            </span>
                            ?
                            {selectedBooking?.bookingStatus === "CONFIRMED" && (
                                <span className="block mt-2 font-semibold text-rose-400 text-xs">
                                    This booking is CONFIRMED. Completed payments will be marked as REFUNDED.
                                </span>
                            )}
                        </DialogDescription>
                    </DialogHeader>

                    <div className="grid gap-5 py-4">
                        <div className="rounded-xl border border-border/20 p-4 bg-surface-container/20 space-y-3">
                            <div className="flex items-center gap-1.5 border-b border-border/20 pb-2 mb-1">
                                <AlertCircle className="size-4 text-rose-500" />
                                <span className="text-xs font-black uppercase tracking-widest text-on-surface-variant">
                                    Cancellation Reason
                                </span>
                            </div>
                            <Textarea
                                id="cancel-reason"
                                placeholder="e.g. Schedule conflict, weather issues, personal reasons..."
                                value={cancelReason}
                                onChange={(e) => setCancelReason(e.target.value)}
                                disabled={isPending}
                                className="rounded-xl border-border/40 focus:border-rose-500/50 bg-surface-container-low min-h-24 text-sm resize-none"
                            />
                            <p className="text-[10px] text-on-surface-variant font-medium">
                                Optional — helps us improve the platform.
                            </p>
                        </div>
                    </div>

                    <DialogFooter className="gap-2">
                        <Button
                            variant="outline"
                            onClick={() => {
                                setCancelOpen(false)
                                setSelectedBooking(null)
                                setCancelReason("")
                            }}
                            disabled={isPending}
                            className="rounded-xl border-border/40"
                        >
                            Keep Booking
                        </Button>
                        <Button
                            onClick={() => selectedBooking && handleCancelBooking(selectedBooking.id)}
                            disabled={isPending}
                            className="rounded-xl font-bold bg-rose-500 hover:bg-rose-600 text-white flex items-center gap-1"
                        >
                            {isPending ? (
                                <>
                                    <Spinner data-icon="inline-start" />
                                    Cancelling...
                                </>
                            ) : (
                                "Confirm Cancellation"
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}