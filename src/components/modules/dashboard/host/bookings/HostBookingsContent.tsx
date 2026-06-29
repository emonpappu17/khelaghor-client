"use client"

import React, { useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import type { Booking, BookingStatus } from "@/types/booking.types"
import type { PaginationMeta } from "@/types/api.types"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    Search,
    X,
    ChevronLeft,
    ChevronRight,
    UserCheck,
    Info,
    Calendar,
    Clock,
    DollarSign,
    Mail,
    Phone,
    CreditCard,
    Receipt,
    AlertCircle,
} from "lucide-react"

type HostBookingsContentProps = {
    initialBookings: Booking[]
    meta: PaginationMeta
    currentPage: number
    currentTab: string
    searchQuery: string
}

export function HostBookingsContent({
    initialBookings,
    meta,
    currentPage,
    currentTab,
    searchQuery,
}: HostBookingsContentProps) {
    const router = useRouter()
    const pathname = usePathname()
    const [search, setSearch] = useState(searchQuery)
    const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null)
    const [detailsOpen, setDetailsOpen] = useState(false)

    const filteredBookings = initialBookings.filter((booking) => {
        if (!searchQuery) return true
        const q = searchQuery.toLowerCase()
        return (
            booking.user?.name?.toLowerCase().includes(q) ||
            booking.user?.email?.toLowerCase().includes(q) ||
            booking.user?.phone?.toLowerCase().includes(q) ||
            booking.id.toLowerCase().includes(q)
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
                            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${currentTab === tab.value
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
                            placeholder="Search by name, email, phone..."
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

            {/* BOOKINGS TABLE */}
            <div className="rounded-2xl border border-border/40 overflow-hidden bg-card/40 backdrop-blur-md shadow-xl">
                <Table>
                    <TableHeader className="bg-surface-container-low border-b border-border/30">
                        <TableRow className="hover:bg-transparent">
                            <TableHead className="font-bold text-xs uppercase tracking-wider py-4 text-on-surface-variant/80">
                                Customer
                            </TableHead>
                            <TableHead className="font-bold text-xs uppercase tracking-wider py-4 text-on-surface-variant/80">
                                Date & Time
                            </TableHead>
                            <TableHead className="font-bold text-xs uppercase tracking-wider py-4 text-on-surface-variant/80">
                                Total / Paid
                            </TableHead>
                            <TableHead className="font-bold text-xs uppercase tracking-wider py-4 text-on-surface-variant/80">
                                Host Share
                            </TableHead>
                            <TableHead className="font-bold text-xs uppercase tracking-wider py-4 text-on-surface-variant/80">
                                Status
                            </TableHead>
                            <TableHead className="text-right font-bold text-xs uppercase tracking-wider py-4 text-on-surface-variant/80 pr-6">
                                Actions
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredBookings.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="h-64 text-center">
                                    <div className="flex flex-col items-center justify-center gap-3">
                                        <div className="p-4 rounded-2xl bg-surface-container border border-border/20 text-on-surface-variant/40">
                                            <UserCheck className="size-8" />
                                        </div>
                                        <p className="font-bold text-sm text-on-surface">No bookings found</p>
                                        <p className="text-xs text-on-surface-variant">
                                            Try adjusting your filters or search criteria.
                                        </p>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredBookings.map((booking) => {
                                const initials =
                                    booking.user?.name
                                        ?.split(" ")
                                        .map((w) => w[0])
                                        .join("")
                                        .slice(0, 2)
                                        .toUpperCase() ?? "U"

                                return (
                                    <TableRow
                                        key={booking.id}
                                        className="hover:bg-surface-container/30 transition-colors border-b border-border/20 last:border-0"
                                    >
                                        {/* Customer */}
                                        <TableCell className="py-4">
                                            <div className="flex items-center gap-3">
                                                <Avatar className="h-9 w-9 rounded-xl border border-border/30">
                                                    <AvatarImage
                                                        src={booking.user?.avatar || undefined}
                                                        alt={booking.user?.name}
                                                    />
                                                    <AvatarFallback className="rounded-xl text-xs font-bold bg-primary/10 text-primary">
                                                        {initials}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div className="grid leading-tight">
                                                    <span className="font-bold text-sm text-on-surface">
                                                        {booking.user?.name ?? "Anonymous"}
                                                    </span>
                                                    <span className="text-[11px] text-on-surface-variant font-medium">
                                                        {booking.user?.email ?? "—"}
                                                    </span>
                                                    {booking.user?.phone && (
                                                        <span className="text-[10px] text-on-surface-variant/70 mt-0.5">
                                                            {booking.user.phone}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </TableCell>

                                        {/* Date & Time */}
                                        <TableCell className="py-4">
                                            <div className="grid leading-tight gap-1">
                                                <span className="flex items-center gap-1.5 font-bold text-sm text-on-surface">
                                                    <Calendar className="size-3.5 text-primary shrink-0" />
                                                    {formatDate(booking.slot.date)}
                                                </span>
                                                <span className="flex items-center gap-1.5 font-medium text-xs text-on-surface-variant">
                                                    <Clock className="size-3 text-primary shrink-0" />
                                                    {formatTime(booking.slot.startTime)} – {formatTime(booking.slot.endTime)}
                                                </span>
                                            </div>
                                        </TableCell>

                                        {/* Total / Paid */}
                                        <TableCell className="py-4">
                                            <div className="grid leading-tight gap-0.5">
                                                <span className="font-bold text-sm text-on-surface">
                                                    ৳{booking.totalAmount}
                                                </span>
                                                <span className="text-[11px] font-medium text-on-surface-variant">
                                                    Paid:{" "}
                                                    <span className="text-emerald-500 font-semibold">
                                                        ৳{booking.paidAmount}
                                                    </span>
                                                </span>
                                                {booking.dueAmount > 0 && (
                                                    <span className="text-[10px] font-semibold text-rose-500">
                                                        Due: ৳{booking.dueAmount}
                                                    </span>
                                                )}
                                            </div>
                                        </TableCell>

                                        {/* Host Share */}
                                        <TableCell className="py-4">
                                            <div className="grid leading-tight gap-0.5">
                                                <span className="font-bold text-sm text-primary">
                                                    ৳{booking.hostAmount}
                                                </span>
                                                <span className="text-[10px] text-on-surface-variant font-medium">
                                                    Fee: ৳{booking.platformFee}
                                                </span>
                                            </div>
                                        </TableCell>

                                        {/* Status */}
                                        <TableCell className="py-4">
                                            {getStatusBadge(booking.bookingStatus)}
                                        </TableCell>

                                        {/* Actions */}
                                        <TableCell className="py-4 text-right pr-6">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => {
                                                    setSelectedBooking(booking)
                                                    setDetailsOpen(true)
                                                }}
                                                className="size-8 p-0 rounded-lg border-border/40 bg-transparent hover:bg-primary/10 hover:text-primary transition-all"
                                            >
                                                <Info className="size-4 text-primary" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                )
                            })
                        )}
                    </TableBody>
                </Table>
            </div>

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

            {/* DETAILS DIALOG */}
            <Dialog
                open={detailsOpen}
                onOpenChange={(open) => {
                    if (!open) {
                        setDetailsOpen(false)
                        setSelectedBooking(null)
                    }
                }}
            >
                <DialogContent className="sm:max-w-xl rounded-2xl border-border/40 bg-card">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2 text-xl font-bold tracking-tight">
                            <Receipt className="size-5 text-primary" />
                            Booking Details
                        </DialogTitle>
                        <DialogDescription>
                            Full breakdown for reservation{" "}
                            <span className="font-mono text-on-surface font-semibold text-xs">
                                {selectedBooking?.id}
                            </span>
                        </DialogDescription>
                    </DialogHeader>

                    {selectedBooking && (
                        <div className="grid gap-5 py-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* Customer Info Card */}
                                <div className="rounded-xl border border-border/20 p-4 bg-surface-container/20 space-y-3">
                                    <div className="flex items-center gap-1.5 border-b border-border/20 pb-2 mb-2">
                                        <Mail className="size-4 text-primary" />
                                        <span className="text-xs font-black uppercase tracking-widest text-on-surface-variant">
                                            Customer Info
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <Avatar className="h-12 w-12 rounded-xl">
                                            <AvatarImage
                                                src={selectedBooking.user?.avatar || undefined}
                                                alt={selectedBooking.user?.name}
                                            />
                                            <AvatarFallback className="text-sm font-bold bg-primary/10 text-primary">
                                                {selectedBooking.user?.name
                                                    ?.split(" ")
                                                    .map((w) => w[0])
                                                    .join("")
                                                    .toUpperCase()
                                                    .slice(0, 2) ?? "U"}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <h4 className="font-bold text-sm text-on-surface">
                                                {selectedBooking.user?.name ?? "Anonymous"}
                                            </h4>
                                            <p className="text-xs text-on-surface-variant">
                                                {selectedBooking.user?.email ?? "—"}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-xs space-y-1.5 pt-1">
                                        <p className="flex justify-between">
                                            <span className="text-on-surface-variant font-semibold flex items-center gap-1">
                                                <Phone className="size-3" /> Phone:
                                            </span>
                                            <span className="font-bold text-on-surface">
                                                {selectedBooking.user?.phone ?? "—"}
                                            </span>
                                        </p>
                                    </div>
                                </div>

                                {/* Slot Details Card */}
                                <div className="rounded-xl border border-border/20 p-4 bg-surface-container/20 space-y-3">
                                    <div className="flex items-center gap-1.5 border-b border-border/20 pb-2 mb-2">
                                        <Calendar className="size-4 text-primary" />
                                        <span className="text-xs font-black uppercase tracking-widest text-on-surface-variant">
                                            Slot Info
                                        </span>
                                    </div>
                                    <div className="text-xs space-y-2">
                                        <div>
                                            <span className="text-on-surface-variant font-semibold block mb-0.5">Date:</span>
                                            <span className="font-bold text-sm text-on-surface">
                                                {formatDate(selectedBooking.slot.date)}
                                            </span>
                                        </div>
                                        <div>
                                            <span className="text-on-surface-variant font-semibold block mb-0.5">Time:</span>
                                            <span className="font-bold text-on-surface">
                                                {formatTime(selectedBooking.slot.startTime)} – {formatTime(selectedBooking.slot.endTime)}
                                            </span>
                                        </div>
                                        <div>
                                            <span className="text-on-surface-variant font-semibold block mb-0.5">Slot Rate:</span>
                                            <span className="font-bold text-on-surface">
                                                ৳{selectedBooking.slot.pricePerSlot}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Financial Sheet */}
                            <div className="rounded-xl border border-border/20 p-4 bg-surface-container/25 space-y-2">
                                <div className="flex items-center gap-1.5 border-b border-border/20 pb-2 mb-1">
                                    <DollarSign className="size-4 text-primary" />
                                    <span className="text-xs font-black uppercase tracking-widest text-on-surface-variant">
                                        Financial Sheet
                                    </span>
                                </div>
                                <div className="text-xs space-y-1.5 pt-1">
                                    <div className="flex justify-between text-on-surface-variant">
                                        <span className="font-semibold">Total Amount:</span>
                                        <span className="font-bold text-on-surface">৳{selectedBooking.totalAmount}</span>
                                    </div>
                                    <div className="flex justify-between text-on-surface-variant border-b border-border/15 pb-1.5">
                                        <span className="font-semibold">Platform Fee (5%):</span>
                                        <span className="font-bold text-rose-500">–৳{selectedBooking.platformFee}</span>
                                    </div>
                                    <div className="flex justify-between font-black text-sm pt-0.5">
                                        <span className="text-on-surface">Your Net Share:</span>
                                        <span className="text-primary">৳{selectedBooking.hostAmount}</span>
                                    </div>
                                    <div className="flex justify-between text-on-surface-variant border-t border-border/15 pt-1.5 mt-1">
                                        <span className="font-semibold">Paid by Customer:</span>
                                        <span className="font-bold text-emerald-500">৳{selectedBooking.paidAmount}</span>
                                    </div>
                                    {selectedBooking.dueAmount > 0 && (
                                        <div className="flex justify-between text-on-surface-variant">
                                            <span className="font-semibold">Outstanding Due:</span>
                                            <span className="font-bold text-rose-500">৳{selectedBooking.dueAmount}</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Payment Logs */}
                            {selectedBooking.payments.length > 0 && (
                                <div className="rounded-xl border border-border/20 p-4 bg-surface-container/20 space-y-3">
                                    <div className="flex items-center gap-1.5 border-b border-border/20 pb-2 mb-2">
                                        <CreditCard className="size-4 text-primary" />
                                        <span className="text-xs font-black uppercase tracking-widest text-on-surface-variant">
                                            Payment Logs
                                        </span>
                                    </div>
                                    <div className="space-y-2 max-h-32 overflow-y-auto pr-1">
                                        {selectedBooking.payments.map((p) => (
                                            <div
                                                key={p.id}
                                                className="text-xs border-b border-border/10 pb-1.5 last:border-b-0 last:pb-0"
                                            >
                                                <div className="flex justify-between items-center">
                                                    <span className="font-bold text-on-surface capitalize">
                                                        {p.type?.toLowerCase() ?? "—"} payment
                                                    </span>
                                                    <Badge
                                                        className={`text-[10px] font-bold uppercase tracking-wider rounded-full px-2 ${p.status === "COMPLETED"
                                                                ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20"
                                                                : "bg-rose-500/10 text-rose-500 border border-rose-500/20"
                                                            }`}
                                                    >
                                                        {p.status}
                                                    </Badge>
                                                </div>
                                                <div className="flex justify-between text-[10px] text-on-surface-variant mt-0.5">
                                                    <span>Method: {p.paymentMethod ?? "SSL Gateway"}</span>
                                                    <span className="font-semibold text-on-surface">৳{p.amount}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Cancellation Notice */}
                            {selectedBooking.bookingStatus === "CANCELLED" && (
                                <div className="rounded-xl border border-rose-500/20 p-4 bg-rose-500/5 space-y-1">
                                    <div className="flex items-center gap-1.5">
                                        <AlertCircle className="size-4 text-rose-500" />
                                        <span className="text-xs font-black uppercase tracking-widest text-rose-500">
                                            Cancellation Log
                                        </span>
                                    </div>
                                    <p className="text-xs text-rose-400 pt-1">
                                        {selectedBooking?.cancellationReason ?? "This booking was cancelled."}
                                    </p>
                                    {selectedBooking.cancelledAt && (
                                        <p className="text-[10px] text-rose-400/70 font-medium">
                                            Cancelled at:{" "}
                                            {new Date(selectedBooking.cancelledAt).toLocaleString(undefined, {
                                                day: "numeric",
                                                month: "short",
                                                year: "numeric",
                                                hour: "2-digit",
                                                minute: "2-digit",
                                            })}
                                        </p>
                                    )}
                                </div>
                            )}
                        </div>
                    )}

                    <DialogFooter className="gap-2">
                        <Button
                            variant="outline"
                            onClick={() => {
                                setDetailsOpen(false)
                                setSelectedBooking(null)
                            }}
                            className="rounded-xl border-border/40"
                        >
                            Close
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}