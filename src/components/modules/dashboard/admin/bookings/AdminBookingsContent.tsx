"use client"

import React, { useState, useTransition } from "react"
import { useRouter, usePathname, useSearchParams } from "next/navigation"
import type { Booking, BookingStatus, PaymentStatus } from "@/types/booking.types"
import type { PaginationMeta } from "@/types/api.types"
import type { SportType } from "@/types/field.types"
import { cancelBookingAction } from "@/actions/booking.actions"
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
import { Label } from "@/components/ui/label"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Spinner } from "@/components/ui/spinner"
import { toast } from "sonner"
import {
    Search,
    X,
    ChevronLeft,
    ChevronRight,
    Info,
    Calendar,
    Clock,
    DollarSign,
    Mail,
    Phone,
    CreditCard,
    Receipt,
    AlertCircle,
    MapPin,
    SlidersHorizontal,
    Trash2,
    Building2,
    ShieldAlert,
} from "lucide-react"

type AdminBookingsContentProps = {
    initialBookings: Booking[]
    meta: PaginationMeta
    currentPage: number
    currentTab: string
    searchQuery: string
}

export function AdminBookingsContent({
    initialBookings,
    meta,
    currentPage,
    currentTab,
    searchQuery,
}: AdminBookingsContentProps) {
    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()

    const [isPending, startTransition] = useTransition()

    // Filter states
    const [searchTerm, setSearchTerm] = useState(searchQuery)
    const [sportType, setSportType] = useState(searchParams.get("sportType") || "all")
    const [paymentStatus, setPaymentStatus] = useState(searchParams.get("paymentStatus") || "all")
    const [division, setDivision] = useState(searchParams.get("division") || "")
    const [area, setArea] = useState(searchParams.get("area") || "")
    const [minAmount, setMinAmount] = useState(searchParams.get("minAmount") || "")
    const [maxAmount, setMaxAmount] = useState(searchParams.get("maxAmount") || "")
    const [startDate, setStartDate] = useState(searchParams.get("startDate") || "")
    const [endDate, setEndDate] = useState(searchParams.get("endDate") || "")

    // Sorting states
    const [sortBy, setSortBy] = useState(searchParams.get("sortBy") || "createdAt")
    const [sortOrder, setSortOrder] = useState(searchParams.get("sortOrder") || "desc")

    // Panel & Modal states
    const [showAdvancedFilters, setShowAdvancedFilters] = useState(false)
    const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null)
    const [detailsOpen, setDetailsOpen] = useState(false)
    const [cancelOpen, setCancelOpen] = useState(false)
    const [cancelReason, setCancelReason] = useState("")

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        applyFilters()
    }

    const applyFilters = () => {
        const params = new URLSearchParams(window.location.search)

        // Set pagination
        params.set("page", "1")

        // Set search
        if (searchTerm.trim()) {
            params.set("searchTerm", searchTerm.trim())
        } else {
            params.delete("searchTerm")
        }

        // Set tabs
        if (currentTab !== "all") {
            params.set("status", currentTab)
        } else {
            params.delete("status")
        }

        // Set dropdowns
        if (sportType !== "all") {
            params.set("sportType", sportType)
        } else {
            params.delete("sportType")
        }

        if (paymentStatus !== "all") {
            params.set("paymentStatus", paymentStatus)
        } else {
            params.delete("paymentStatus")
        }

        // Set advanced filters
        if (division.trim()) {
            params.set("division", division.trim())
        } else {
            params.delete("division")
        }

        if (area.trim()) {
            params.set("area", area.trim())
        } else {
            params.delete("area")
        }

        if (minAmount.trim()) {
            params.set("minAmount", minAmount.trim())
        } else {
            params.delete("minAmount")
        }

        if (maxAmount.trim()) {
            params.set("maxAmount", maxAmount.trim())
        } else {
            params.delete("maxAmount")
        }

        if (startDate) {
            params.set("startDate", startDate)
        } else {
            params.delete("startDate")
        }

        if (endDate) {
            params.set("endDate", endDate)
        } else {
            params.delete("endDate")
        }

        // Set Sorting
        params.set("sortBy", sortBy)
        params.set("sortOrder", sortOrder)

        router.push(`${pathname}?${params.toString()}`)
    }

    const handleClearAllFilters = () => {
        setSearchTerm("")
        setSportType("all")
        setPaymentStatus("all")
        setDivision("")
        setArea("")
        setMinAmount("")
        setMaxAmount("")
        setStartDate("")
        setEndDate("")
        setSortBy("createdAt")
        setSortOrder("desc")

        const params = new URLSearchParams()
        params.set("page", "1")
        if (currentTab !== "all") {
            params.set("status", currentTab)
        }
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

    const handleCancelBooking = (e: React.FormEvent) => {
        e.preventDefault()
        if (!selectedBooking) return

        startTransition(async () => {
            const result = await cancelBookingAction(selectedBooking.id, cancelReason || "Cancelled by admin.")
            if (result.success) {
                toast.success(result.message || "Booking successfully cancelled.")
                setCancelOpen(false)
                setDetailsOpen(false)
                setCancelReason("")
                setSelectedBooking(null)
            } else {
                toast.error(result.errors?._form?.[0] || "Failed to cancel booking.")
            }
        })
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

    const getPaymentStatusBadge = (status: PaymentStatus) => {
        switch (status) {
            case "COMPLETED":
                return (
                    <Badge className="bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 dark:text-emerald-400 font-bold uppercase tracking-wider text-[10px] rounded-full px-2.5">
                        Completed
                    </Badge>
                )
            case "PENDING":
                return (
                    <Badge className="bg-amber-500/10 text-amber-600 border border-amber-500/20 dark:text-amber-400 font-bold uppercase tracking-wider text-[10px] rounded-full px-2.5">
                        Pending
                    </Badge>
                )
            case "FAILED":
                return (
                    <Badge className="bg-rose-500/10 text-rose-600 border border-rose-500/20 dark:text-rose-400 font-bold uppercase tracking-wider text-[10px] rounded-full px-2.5">
                        Failed
                    </Badge>
                )
            case "CANCELLED":
                return (
                    <Badge className="bg-slate-500/10 text-slate-600 border border-slate-500/20 dark:text-slate-400 font-bold uppercase tracking-wider text-[10px] rounded-full px-2.5">
                        Cancelled
                    </Badge>
                )
            case "REFUNDED":
                return (
                    <Badge className="bg-indigo-500/10 text-indigo-600 border border-indigo-500/20 dark:text-indigo-400 font-bold uppercase tracking-wider text-[10px] rounded-full px-2.5">
                        Refunded
                    </Badge>
                )
            default:
                return (
                    <Badge variant="outline" className="font-bold uppercase tracking-wider text-[10px] rounded-full px-2.5">
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
            <div className="flex flex-col gap-4">
                <div className="flex flex-col lg:flex-row gap-4 justify-between items-start lg:items-center">
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

                    {/* Search Form & Controls */}
                    <form onSubmit={handleSearchSubmit} className="relative w-full lg:max-w-xl flex flex-wrap sm:flex-nowrap gap-2">
                        <div className="relative flex-1 min-w-[200px]">
                            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-on-surface-variant/60" />
                            <Input
                                placeholder="Search by user, email, phone, field, ID..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10 pr-10 w-full rounded-xl bg-surface-container border-border/40 focus:border-primary/50 text-sm h-10"
                            />
                            {searchTerm && (
                                <button
                                    type="button"
                                    onClick={() => {
                                        setSearchTerm("")
                                        const params = new URLSearchParams(window.location.search)
                                        params.delete("searchTerm")
                                        params.set("page", "1")
                                        router.push(`${pathname}?${params.toString()}`)
                                    }}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 rounded-full hover:bg-surface-container-high text-on-surface-variant"
                                >
                                    <X className="size-3.5" />
                                </button>
                            )}
                        </div>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                            className={`rounded-xl h-10 px-3.5 font-bold text-xs gap-1.5 border-border/40 ${
                                showAdvancedFilters ? "bg-primary/10 text-primary border-primary/30" : "bg-surface-container hover:bg-surface-container-high"
                            }`}
                        >
                            <SlidersHorizontal className="size-4" />
                            Filters
                        </Button>
                        <Button type="submit" className="rounded-xl h-10 px-5 font-bold text-xs">
                            Search
                        </Button>
                    </form>
                </div>

                {/* Collapsible Advanced Filters Panel */}
                {showAdvancedFilters && (
                    <div className="p-5 rounded-2xl border border-border/30 bg-card/60 backdrop-blur-md shadow-lg grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 animate-in fade-in slide-in-from-top-2 duration-200">
                        {/* Sport Type */}
                        <div className="space-y-1.5">
                            <Label className="text-[11px] font-bold uppercase tracking-wider text-on-surface-variant/80">Sport Type</Label>
                            <Select value={sportType} onValueChange={setSportType}>
                                <SelectTrigger className="rounded-xl bg-surface-container border-border/30 h-10 text-xs">
                                    <SelectValue placeholder="All Sports" />
                                </SelectTrigger>
                                <SelectContent className="rounded-xl bg-card border-border/30">
                                    <SelectItem value="all">All Sports</SelectItem>
                                    <SelectItem value="FOOTBALL">Football</SelectItem>
                                    <SelectItem value="CRICKET">Cricket</SelectItem>
                                    <SelectItem value="BADMINTON">Badminton</SelectItem>
                                    <SelectItem value="BASKETBALL">Basketball</SelectItem>
                                    <SelectItem value="TENNIS">Tennis</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Payment Status */}
                        <div className="space-y-1.5">
                            <Label className="text-[11px] font-bold uppercase tracking-wider text-on-surface-variant/80">Payment Status</Label>
                            <Select value={paymentStatus} onValueChange={setPaymentStatus}>
                                <SelectTrigger className="rounded-xl bg-surface-container border-border/30 h-10 text-xs">
                                    <SelectValue placeholder="All Payments" />
                                </SelectTrigger>
                                <SelectContent className="rounded-xl bg-card border-border/30">
                                    <SelectItem value="all">All Statuses</SelectItem>
                                    <SelectItem value="PENDING">Pending</SelectItem>
                                    <SelectItem value="COMPLETED">Completed</SelectItem>
                                    <SelectItem value="FAILED">Failed</SelectItem>
                                    <SelectItem value="CANCELLED">Cancelled</SelectItem>
                                    <SelectItem value="REFUNDED">Refunded</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Division */}
                        <div className="space-y-1.5">
                            <Label className="text-[11px] font-bold uppercase tracking-wider text-on-surface-variant/80">Division</Label>
                            <Input
                                placeholder="e.g. Dhaka"
                                value={division}
                                onChange={(e) => setDivision(e.target.value)}
                                className="rounded-xl bg-surface-container border-border/30 h-10 text-xs"
                            />
                        </div>

                        {/* Area */}
                        <div className="space-y-1.5">
                            <Label className="text-[11px] font-bold uppercase tracking-wider text-on-surface-variant/80">Area</Label>
                            <Input
                                placeholder="e.g. Mirpur"
                                value={area}
                                onChange={(e) => setArea(e.target.value)}
                                className="rounded-xl bg-surface-container border-border/30 h-10 text-xs"
                            />
                        </div>

                        {/* Min Amount */}
                        <div className="space-y-1.5">
                            <Label className="text-[11px] font-bold uppercase tracking-wider text-on-surface-variant/80">Min Amount (৳)</Label>
                            <Input
                                type="number"
                                placeholder="0"
                                value={minAmount}
                                onChange={(e) => setMinAmount(e.target.value)}
                                className="rounded-xl bg-surface-container border-border/30 h-10 text-xs"
                            />
                        </div>

                        {/* Max Amount */}
                        <div className="space-y-1.5">
                            <Label className="text-[11px] font-bold uppercase tracking-wider text-on-surface-variant/80">Max Amount (৳)</Label>
                            <Input
                                type="number"
                                placeholder="5000"
                                value={maxAmount}
                                onChange={(e) => setMaxAmount(e.target.value)}
                                className="rounded-xl bg-surface-container border-border/30 h-10 text-xs"
                            />
                        </div>

                        {/* Start Date */}
                        <div className="space-y-1.5">
                            <Label className="text-[11px] font-bold uppercase tracking-wider text-on-surface-variant/80">Start Date</Label>
                            <Input
                                type="date"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                className="rounded-xl bg-surface-container border-border/30 h-10 text-xs text-on-surface"
                            />
                        </div>

                        {/* End Date */}
                        <div className="space-y-1.5">
                            <Label className="text-[11px] font-bold uppercase tracking-wider text-on-surface-variant/80">End Date</Label>
                            <Input
                                type="date"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                                className="rounded-xl bg-surface-container border-border/30 h-10 text-xs text-on-surface"
                            />
                        </div>

                        {/* Sorting Column */}
                        <div className="space-y-1.5">
                            <Label className="text-[11px] font-bold uppercase tracking-wider text-on-surface-variant/80">Sort By</Label>
                            <Select value={sortBy} onValueChange={setSortBy}>
                                <SelectTrigger className="rounded-xl bg-surface-container border-border/30 h-10 text-xs">
                                    <SelectValue placeholder="Sort Column" />
                                </SelectTrigger>
                                <SelectContent className="rounded-xl bg-card border-border/30">
                                    <SelectItem value="createdAt">Date Created</SelectItem>
                                    <SelectItem value="updatedAt">Date Updated</SelectItem>
                                    <SelectItem value="totalAmount">Total Amount</SelectItem>
                                    <SelectItem value="paidAmount">Paid Amount</SelectItem>
                                    <SelectItem value="dueAmount">Due Amount</SelectItem>
                                    <SelectItem value="expiresAt">Expiration Date</SelectItem>
                                    <SelectItem value="bookingStatus">Booking Status</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Sort Order */}
                        <div className="space-y-1.5">
                            <Label className="text-[11px] font-bold uppercase tracking-wider text-on-surface-variant/80">Sort Order</Label>
                            <Select value={sortOrder} onValueChange={setSortOrder}>
                                <SelectTrigger className="rounded-xl bg-surface-container border-border/30 h-10 text-xs">
                                    <SelectValue placeholder="Sort Order" />
                                </SelectTrigger>
                                <SelectContent className="rounded-xl bg-card border-border/30">
                                    <SelectItem value="desc">Descending</SelectItem>
                                    <SelectItem value="asc">Ascending</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Action buttons */}
                        <div className="sm:col-span-2 md:col-span-3 lg:col-span-2 flex items-end justify-end gap-2 pt-2">
                            <Button
                                type="button"
                                variant="ghost"
                                onClick={handleClearAllFilters}
                                className="rounded-xl h-10 text-xs font-bold hover:bg-rose-500/10 hover:text-rose-500"
                            >
                                Clear All
                            </Button>
                            <Button
                                type="button"
                                onClick={applyFilters}
                                className="rounded-xl h-10 text-xs font-bold px-6"
                            >
                                Apply Filters
                            </Button>
                        </div>
                    </div>
                )}
            </div>

            {/* BOOKINGS TABLE (Desktop) */}
            <div className=" rounded-2xl border border-border/40 overflow-hidden bg-card/40 backdrop-blur-md shadow-xl">
                <Table>
                    <TableHeader className="bg-surface-container-low border-b border-border/30">
                        <TableRow className="hover:bg-transparent">
                            <TableHead className="font-bold text-xs uppercase tracking-wider py-4 text-on-surface-variant/80">Customer</TableHead>
                            <TableHead className="font-bold text-xs uppercase tracking-wider py-4 text-on-surface-variant/80">Field & Host</TableHead>
                            <TableHead className="font-bold text-xs uppercase tracking-wider py-4 text-on-surface-variant/80">Date & Time</TableHead>
                            <TableHead className="font-bold text-xs uppercase tracking-wider py-4 text-on-surface-variant/80">Amounts</TableHead>
                            <TableHead className="font-bold text-xs uppercase tracking-wider py-4 text-on-surface-variant/80">Status</TableHead>
                            <TableHead className="text-right font-bold text-xs uppercase tracking-wider py-4 text-on-surface-variant/80 pr-6">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {initialBookings.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="h-64 text-center">
                                    <div className="flex flex-col items-center justify-center gap-3">
                                        <div className="p-4 rounded-2xl bg-surface-container border border-border/20 text-on-surface-variant/40">
                                            <Receipt className="size-8" />
                                        </div>
                                        <p className="font-bold text-sm text-on-surface">No bookings found</p>
                                        <p className="text-xs text-on-surface-variant">Try adjusting your filters or search criteria.</p>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : (
                            initialBookings.map((booking) => {
                                const initials = booking.user?.name
                                    ?.split(" ")
                                    .map((w: string) => w[0])
                                    .join("")
                                    .slice(0, 2)
                                    .toUpperCase() || "U"

                                return (
                                    <TableRow
                                        key={booking.id}
                                        className="hover:bg-surface-container/30 transition-colors border-b border-border/20 last:border-0"
                                    >
                                        {/* Customer */}
                                        <TableCell className="py-4">
                                            <div className="flex items-center gap-3">
                                                <Avatar className="h-9 w-9 rounded-xl border border-border/30">
                                                    <AvatarImage src={booking.user?.avatar || undefined} alt={booking.user?.name} />
                                                    <AvatarFallback className="rounded-xl text-xs font-bold bg-primary/10 text-primary">
                                                        {initials}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div className="grid leading-tight max-w-[180px]">
                                                    <span className="font-bold text-sm text-on-surface truncate">{booking.user?.name || "Anonymous"}</span>
                                                    <span className="text-[11px] text-on-surface-variant font-medium truncate">{booking.user?.email || "—"}</span>
                                                    {booking.user?.phone && <span className="text-[10px] text-on-surface-variant/70 mt-0.5">{booking.user.phone}</span>}
                                                </div>
                                            </div>
                                        </TableCell>

                                        {/* Field & Host */}
                                        <TableCell className="py-4">
                                            <div className="grid leading-tight max-w-[200px]">
                                                <span className="font-bold text-sm text-on-surface truncate">{booking.slot?.field?.name || "Field"}</span>
                                                <span className="text-[11px] text-primary font-bold mt-0.5 truncate flex items-center gap-1">
                                                    <Building2 className="size-3" />
                                                    {booking.slot?.field?.host?.businessName || booking.slot?.field?.host?.user?.name || "Host Profile"}
                                                </span>
                                                <span className="text-[10px] text-on-surface-variant/80 truncate flex items-center gap-0.5 mt-0.5">
                                                    <MapPin className="size-2.5 shrink-0" />
                                                    {booking.slot?.field?.area}, {booking.slot?.field?.division}
                                                </span>
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

                                        {/* Amounts */}
                                        <TableCell className="py-4">
                                            <div className="grid leading-tight gap-0.5">
                                                <span className="font-bold text-sm text-on-surface">৳{booking.totalAmount}</span>
                                                <span className="text-[11px] font-medium text-on-surface-variant">
                                                    Paid: <span className="text-emerald-500 font-semibold">৳{booking.paidAmount}</span>
                                                </span>
                                                {booking.dueAmount > 0 && (
                                                    <span className="text-[10px] font-semibold text-rose-500">Due: ৳{booking.dueAmount}</span>
                                                )}
                                            </div>
                                        </TableCell>

                                        {/* Statuses */}
                                        <TableCell className="py-4">
                                            <div className="flex flex-col gap-1.5 items-start">
                                                {getStatusBadge(booking.bookingStatus)}
                                                {booking.payments[0] && getPaymentStatusBadge(booking.payments[0].status)}
                                            </div>
                                        </TableCell>

                                        {/* Actions */}
                                        <TableCell className="py-4 text-right pr-6">
                                            <div className="flex items-center justify-end gap-1.5">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => {
                                                        setSelectedBooking(booking)
                                                        setDetailsOpen(true)
                                                    }}
                                                    className="size-8 p-0 rounded-lg border-border/40 bg-transparent hover:bg-primary/10 hover:text-primary transition-all"
                                                    title="View Details"
                                                >
                                                    <Info className="size-4 text-primary" />
                                                </Button>

                                                {(booking.bookingStatus === "PENDING" || booking.bookingStatus === "CONFIRMED") && (
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => {
                                                            setSelectedBooking(booking)
                                                            setCancelOpen(true)
                                                        }}
                                                        className="size-8 p-0 rounded-lg border-border/40 bg-transparent hover:bg-rose-500/10 hover:text-rose-500 hover:border-rose-500/20 transition-all"
                                                        title="Cancel Booking"
                                                    >
                                                        <Trash2 className="size-4 text-rose-500" />
                                                    </Button>
                                                )}
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                )
                            })
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* CARD LISTING (Mobile / Tablet) */}
            {/* <div className="grid gap-4 sm:grid-cols-2 lg:hidden">
                {initialBookings.length === 0 ? (
                    <div className="sm:col-span-2 text-center p-12 border border-dashed border-border/30 rounded-2xl bg-card/20 text-on-surface-variant">
                        <p className="font-bold">No bookings found</p>
                        <p className="text-xs">Adjust your search parameters to find bookings.</p>
                    </div>
                ) : (
                    initialBookings.map((booking) => {
                        const initials = booking.user?.name
                            ?.split(" ")
                            .map((w: string) => w[0])
                            .join("")
                            .slice(0, 2)
                            .toUpperCase() || "U"

                        return (
                            <div
                                key={booking.id}
                                className="rounded-2xl border border-border/30 bg-card/50 backdrop-blur-md p-4 space-y-4 shadow-sm"
                            >
                                <div className="flex justify-between items-start">
                                    <div className="flex items-center gap-3">
                                        <Avatar className="h-10 w-10 rounded-xl border border-border/30">
                                            <AvatarImage src={booking.user?.avatar || undefined} alt={booking.user?.name} />
                                            <AvatarFallback className="rounded-xl text-xs font-bold bg-primary/10 text-primary">
                                                {initials}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="grid leading-tight">
                                            <span className="font-bold text-sm text-on-surface truncate max-w-[140px]">{booking.user?.name || "Anonymous"}</span>
                                            <span className="text-[10px] text-on-surface-variant truncate max-w-[140px]">{booking.user?.email || "—"}</span>
                                        </div>
                                    </div>
                                    <div className="flex flex-col gap-1 items-end">
                                        {getStatusBadge(booking.bookingStatus)}
                                        {booking.payments[0] && getPaymentStatusBadge(booking.payments[0].status)}
                                    </div>
                                </div>

                                <div className="rounded-xl bg-surface-container-low/50 border border-border/20 p-3 space-y-2 text-xs">
                                    <div>
                                        <span className="text-on-surface-variant font-bold block text-[10px] uppercase tracking-wider mb-0.5">Field</span>
                                        <span className="font-semibold text-on-surface text-xs">{booking.slot?.field?.name}</span>
                                        <span className="block text-[10px] text-primary font-medium mt-0.5">
                                            {booking.slot?.field?.host?.businessName || "Host Profile"}
                                        </span>
                                    </div>
                                    <div className="grid grid-cols-2 gap-2 pt-1 border-t border-border/10">
                                        <div>
                                            <span className="text-on-surface-variant font-bold block text-[10px] uppercase tracking-wider mb-0.5">Date</span>
                                            <span className="font-medium text-on-surface">{formatDate(booking.slot.date)}</span>
                                        </div>
                                        <div>
                                            <span className="text-on-surface-variant font-bold block text-[10px] uppercase tracking-wider mb-0.5">Time</span>
                                            <span className="font-medium text-on-surface">{formatTime(booking.slot.startTime)}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex justify-between items-center pt-2 border-t border-border/20">
                                    <div className="grid leading-none">
                                        <span className="text-[10px] text-on-surface-variant font-bold uppercase tracking-wider mb-0.5">Total / Paid</span>
                                        <span className="font-black text-sm text-on-surface">৳{booking.totalAmount} / <span className="text-emerald-500">৳{booking.paidAmount}</span></span>
                                    </div>

                                    <div className="flex gap-1.5">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => {
                                                setSelectedBooking(booking)
                                                setDetailsOpen(true)
                                            }}
                                            className="h-9 px-3 rounded-xl border-border/30 bg-transparent text-primary hover:bg-primary/10 transition-all font-bold text-xs flex items-center gap-1"
                                        >
                                            <Info className="size-4" />
                                            Details
                                        </Button>
                                        {(booking.bookingStatus === "PENDING" || booking.bookingStatus === "CONFIRMED") && (
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => {
                                                    setSelectedBooking(booking)
                                                    setCancelOpen(true)
                                                }}
                                                className="size-9 p-0 rounded-xl border-border/30 bg-transparent text-rose-500 hover:bg-rose-500/10 hover:border-rose-500/20 transition-all flex items-center justify-center"
                                            >
                                                <Trash2 className="size-4" />
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )
                    })
                )}
            </div> */}

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
                <DialogContent className="sm:max-w-xl rounded-2xl border-border/40 bg-card overflow-hidden">
                    <DialogHeader className="border-b border-border/20 pb-4 mb-2">
                        <DialogTitle className="flex items-center gap-2 text-xl font-bold tracking-tight">
                            <Receipt className="size-5 text-primary" />
                            Booking Details
                        </DialogTitle>
                        <DialogDescription className="text-xs">
                            Full breakdown for reservation{" "}
                            <span className="font-mono text-on-surface font-semibold text-xs bg-surface-container px-1.5 py-0.5 rounded">
                                {selectedBooking?.id}
                            </span>
                        </DialogDescription>
                    </DialogHeader>

                    {selectedBooking && (
                        <div className="grid gap-4 py-2 max-h-[60vh] overflow-y-auto pr-1">
                            {/* User & Host Info Card */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="rounded-xl border border-border/25 p-4 bg-surface-container/20 space-y-3">
                                    <div className="flex items-center gap-1.5 border-b border-border/20 pb-2 mb-1">
                                        <Mail className="size-3.5 text-primary" />
                                        <span className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant">Customer Info</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <Avatar className="h-10 w-10 rounded-xl">
                                            <AvatarImage src={selectedBooking.user?.avatar || undefined} alt={selectedBooking.user?.name} />
                                            <AvatarFallback className="text-xs font-bold bg-primary/10 text-primary">
                                                {selectedBooking.user?.name?.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2) ?? "U"}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="grid leading-tight">
                                            <h4 className="font-bold text-sm text-on-surface">{selectedBooking.user?.name ?? "Anonymous"}</h4>
                                            <p className="text-xs text-on-surface-variant truncate max-w-[180px]">{selectedBooking.user?.email ?? "—"}</p>
                                        </div>
                                    </div>
                                    <div className="text-[11px] space-y-1">
                                        <p className="flex justify-between">
                                            <span className="text-on-surface-variant font-medium flex items-center gap-1"><Phone className="size-3" /> Phone:</span>
                                            <span className="font-bold text-on-surface">{selectedBooking.user?.phone || "—"}</span>
                                        </p>
                                    </div>
                                </div>

                                <div className="rounded-xl border border-border/25 p-4 bg-surface-container/20 space-y-3">
                                    <div className="flex items-center gap-1.5 border-b border-border/20 pb-2 mb-1">
                                        <Building2 className="size-3.5 text-primary" />
                                        <span className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant">Host Info</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <Avatar className="h-10 w-10 rounded-xl">
                                            <AvatarImage src={selectedBooking.slot?.field?.host?.user?.avatar || undefined} alt={selectedBooking.slot?.field?.host?.user?.name} />
                                            <AvatarFallback className="text-xs font-bold bg-primary/10 text-primary">
                                                {selectedBooking.slot?.field?.host?.user?.name?.split(" ").map((w: string) => w[0]).join("").toUpperCase().slice(0, 2) ?? "H"}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="grid leading-tight">
                                            <h4 className="font-bold text-sm text-on-surface">
                                                {selectedBooking.slot?.field?.host?.businessName || selectedBooking.slot?.field?.host?.user?.name || "Host Profile"}
                                            </h4>
                                            <p className="text-xs text-on-surface-variant truncate max-w-[180px]">{selectedBooking.slot?.field?.host?.user?.email || "—"}</p>
                                        </div>
                                    </div>
                                    <div className="text-[11px] space-y-1">
                                        <p className="flex justify-between">
                                            <span className="text-on-surface-variant font-medium flex items-center gap-1"><Phone className="size-3" /> Phone:</span>
                                            <span className="font-bold text-on-surface">{selectedBooking.slot?.field?.host?.user?.phone || "—"}</span>
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Slot and Field Details */}
                            <div className="rounded-xl border border-border/25 p-4 bg-surface-container/20 space-y-3">
                                <div className="flex items-center gap-1.5 border-b border-border/20 pb-2 mb-1">
                                    <Calendar className="size-3.5 text-primary" />
                                    <span className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant">Field & Slot Details</span>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                                    <div className="space-y-1.5">
                                        <p><span className="text-on-surface-variant font-semibold">Field Name:</span> <span className="font-bold text-on-surface">{selectedBooking.slot?.field?.name}</span></p>
                                        <p><span className="text-on-surface-variant font-semibold">Sport Type:</span> <Badge className="text-[9px] font-bold py-0.5 rounded px-2">{selectedBooking.slot?.field?.sportType}</Badge></p>
                                        <p><span className="text-on-surface-variant font-semibold">Location:</span> <span className="font-bold text-on-surface">{selectedBooking.slot?.field?.address}, {selectedBooking.slot?.field?.area}, {selectedBooking.slot?.field?.division}</span></p>
                                    </div>
                                    <div className="space-y-1.5">
                                        <p><span className="text-on-surface-variant font-semibold">Booking Date:</span> <span className="font-bold text-on-surface">{formatDate(selectedBooking.slot.date)}</span></p>
                                        <p><span className="text-on-surface-variant font-semibold">Time Interval:</span> <span className="font-bold text-on-surface">{formatTime(selectedBooking.slot.startTime)} – {formatTime(selectedBooking.slot.endTime)}</span></p>
                                        <p><span className="text-on-surface-variant font-semibold">Base Price:</span> <span className="font-bold text-on-surface">৳{selectedBooking.slot.pricePerSlot}</span></p>
                                    </div>
                                </div>
                            </div>

                            {/* Financial Breakdown */}
                            <div className="rounded-xl border border-border/25 p-4 bg-surface-container/25 space-y-2">
                                <div className="flex items-center gap-1.5 border-b border-border/20 pb-2 mb-1">
                                    <DollarSign className="size-3.5 text-primary" />
                                    <span className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant">Financial breakdown</span>
                                </div>
                                <div className="text-xs space-y-1.5 pt-1">
                                    <div className="flex justify-between text-on-surface-variant">
                                        <span className="font-semibold">Gross Amount:</span>
                                        <span className="font-bold text-on-surface">৳{selectedBooking.totalAmount}</span>
                                    </div>
                                    <div className="flex justify-between text-on-surface-variant">
                                        <span className="font-semibold">Platform Fee:</span>
                                        <span className="font-bold text-rose-500">৳{selectedBooking.platformFee}</span>
                                    </div>
                                    <div className="flex justify-between text-on-surface-variant border-b border-border/15 pb-1.5">
                                        <span className="font-semibold">Host Net Payout:</span>
                                        <span className="font-bold text-primary">৳{selectedBooking.hostAmount}</span>
                                    </div>
                                    <div className="flex justify-between font-black text-xs pt-1">
                                        <span className="text-on-surface">Amount Paid by Customer:</span>
                                        <span className="text-emerald-500">৳{selectedBooking.paidAmount}</span>
                                    </div>
                                    {selectedBooking.dueAmount > 0 && (
                                        <div className="flex justify-between text-on-surface-variant">
                                            <span className="font-bold text-rose-500">Outstanding Due:</span>
                                            <span className="font-bold text-rose-500">৳{selectedBooking.dueAmount}</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Payment Logs */}
                            {selectedBooking.payments.length > 0 && (
                                <div className="rounded-xl border border-border/25 p-4 bg-surface-container/20 space-y-3">
                                    <div className="flex items-center gap-1.5 border-b border-border/20 pb-2 mb-1">
                                        <CreditCard className="size-3.5 text-primary" />
                                        <span className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant">Payment logs</span>
                                    </div>
                                    <div className="space-y-2 max-h-36 overflow-y-auto pr-1">
                                        {selectedBooking.payments.map((p) => (
                                            <div
                                                key={p.id}
                                                className="text-xs border-b border-border/10 pb-1.5 last:border-b-0 last:pb-0"
                                            >
                                                <div className="flex justify-between items-center">
                                                    <span className="font-bold text-on-surface capitalize">{p.type?.toLowerCase() || "—"} payment</span>
                                                    <Badge
                                                        className={`text-[9px] font-bold uppercase tracking-wider rounded-full px-2 ${
                                                            p.status === "COMPLETED"
                                                                ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20"
                                                                : "bg-rose-500/10 text-rose-500 border border-rose-500/20"
                                                        }`}
                                                    >
                                                        {p.status}
                                                    </Badge>
                                                </div>
                                                <div className="flex justify-between text-[10px] text-on-surface-variant mt-1.5">
                                                    <span>Method: {p.paymentMethod || "SSL Gateway"}</span>
                                                    <span className="font-semibold text-on-surface">৳{p.amount}</span>
                                                </div>
                                                {p.paidAt && (
                                                    <div className="text-[9px] text-on-surface-variant/70 mt-0.5">
                                                        Paid at: {new Date(p.paidAt).toLocaleString()}
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Cancellation Reason */}
                            {selectedBooking.bookingStatus === "CANCELLED" && (
                                <div className="rounded-xl border border-rose-500/20 p-4 bg-rose-500/5 space-y-1">
                                    <div className="flex items-center gap-1.5">
                                        <AlertCircle className="size-3.5 text-rose-500" />
                                        <span className="text-[10px] font-black uppercase tracking-widest text-rose-500">Cancellation log</span>
                                    </div>
                                    <p className="text-xs text-rose-600 dark:text-rose-400 pt-1">
                                        {selectedBooking?.cancellationReason || "This booking was cancelled."}
                                    </p>
                                    {selectedBooking.cancelledAt && (
                                        <p className="text-[9px] text-rose-500/70 font-medium">
                                            Cancelled at: {new Date(selectedBooking.cancelledAt).toLocaleString()}
                                        </p>
                                    )}
                                </div>
                            )}
                        </div>
                    )}

                    <DialogFooter className="gap-2 border-t border-border/20 pt-4 mt-2">
                        {(selectedBooking?.bookingStatus === "PENDING" || selectedBooking?.bookingStatus === "CONFIRMED") && (
                            <Button
                                variant="destructive"
                                onClick={() => setCancelOpen(true)}
                                className="rounded-xl font-bold text-xs mr-auto flex items-center gap-1"
                            >
                                <Trash2 className="size-3.5" />
                                Cancel Booking
                            </Button>
                        )}
                        <Button
                            variant="outline"
                            onClick={() => {
                                setDetailsOpen(false)
                                setSelectedBooking(null)
                            }}
                            className="rounded-xl border-border/40 font-bold text-xs"
                        >
                            Close
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* CANCEL CONFIRMATION DIALOG */}
            <Dialog
                open={cancelOpen}
                onOpenChange={(open) => {
                    if (!open) {
                        setCancelOpen(false)
                        setCancelReason("")
                    }
                }}
            >
                <DialogContent className="sm:max-w-md rounded-2xl border-border/40 bg-card">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2 text-rose-500 font-bold text-lg">
                            <ShieldAlert className="size-5 text-rose-500" />
                            Cancel Booking
                        </DialogTitle>
                        <DialogDescription className="text-xs">
                            Are you absolutely sure you want to cancel booking <span className="font-mono text-on-surface font-semibold">{selectedBooking?.id}</span>? This action is irreversible.
                        </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={handleCancelBooking} className="space-y-4 py-2">
                        <div className="space-y-2">
                            <Label htmlFor="cancel-reason" className="text-xs font-bold text-on-surface-variant">Cancellation Reason</Label>
                            <Input
                                id="cancel-reason"
                                placeholder="Provide a reason for the cancellation..."
                                value={cancelReason}
                                onChange={(e) => setCancelReason(e.target.value)}
                                className="rounded-xl bg-surface-container border-border/30 text-xs"
                                required
                            />
                        </div>

                        <DialogFooter className="gap-2 pt-2 border-t border-border/10">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setCancelOpen(false)}
                                className="rounded-xl border-border/40 font-bold text-xs"
                                disabled={isPending}
                            >
                                Go Back
                            </Button>
                            <Button
                                type="submit"
                                variant="destructive"
                                className="rounded-xl font-bold text-xs min-w-[100px]"
                                disabled={isPending}
                            >
                                {isPending ? <Spinner className="size-3.5 mr-1" /> : "Confirm Cancel"}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    )
}
