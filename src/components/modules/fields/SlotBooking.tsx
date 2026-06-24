"use client"

import { useActionState, useEffect, useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { createBookingAction } from "@/actions/booking.actions"
import type { Slot } from "@/types/field.types"
import type { AuthUser } from "@/types/api.types"
import { CalendarIcon, ClockIcon, CreditCardIcon, LogInIcon, SparklesIcon } from "lucide-react"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

interface SlotBookingProps {
    slots: Slot[]
    fieldId: string
    user: AuthUser | null
}

export function SlotBooking({ slots, fieldId, user }: SlotBookingProps) {
    const router = useRouter()
    const [isRedirecting, startRedirectTransition] = useTransition()

    // Group slots by date
    const slotsByDate = slots.reduce<Record<string, Slot[]>>((acc, slot) => {
        const dateKey = slot.date.split("T")[0]
        if (!acc[dateKey]) acc[dateKey] = []
        acc[dateKey].push(slot)
        return acc
    }, {})

    // Sort dates chronologically
    const dates = Object.keys(slotsByDate).sort()
    
    // States
    const [selectedDate, setSelectedDate] = useState(dates[0] || "")
    const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null)
    const [paymentType, setPaymentType] = useState<"FULL" | "PARTIAL">("FULL")

    // Server action state
    const [state, action, isPending] = useActionState(createBookingAction, {})

    // Update selected date if slots change and previous date is not in list
    useEffect(() => {
        if (dates.length > 0 && (!selectedDate || !dates.includes(selectedDate))) {
            setSelectedDate(dates[0])
            setSelectedSlot(null)
        }
    }, [slots, dates, selectedDate])

    // Handle successful checkout redirect
    useEffect(() => {
        if (state?.success && state?.data?.paymentUrl) {
            toast.success("Redirecting to payment gateway...")
            window.location.href = state.data.paymentUrl
        } else if (state?.errors?._form) {
            toast.error(state.errors._form[0])
        }
    }, [state])

    const activeSlots = selectedDate ? slotsByDate[selectedDate] || [] : []

    // Sort active slots by startTime
    const sortedSlots = [...activeSlots].sort((a, b) => a.startTime.localeCompare(b.startTime))

    const handleLoginRedirect = () => {
        startRedirectTransition(() => {
            const redirectTo = `/fields/${fieldId}`
            router.push(`/login?redirectTo=${encodeURIComponent(redirectTo)}`)
        })
    }

    const formatDateTab = (dateStr: string) => {
        const date = new Date(dateStr)
        const weekday = date.toLocaleDateString("en-US", { weekday: "short" })
        const dayMonth = date.toLocaleDateString("en-US", { day: "numeric", month: "short" })
        return { weekday, dayMonth }
    }

    // Calculations
    const price = selectedSlot?.pricePerSlot || 0
    const platformFee = Math.round(price * 0.05)
    const totalAmount = price + platformFee
    const dueAmount = paymentType === "PARTIAL" ? Math.round(totalAmount / 2) : totalAmount
    const upfrontPayment = paymentType === "PARTIAL" ? Math.round(totalAmount / 2) : totalAmount

    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left side: Date & Slot Selectors */}
            <div className="lg:col-span-8 space-y-6">
                <div>
                    <h3 className="text-xl font-headline font-black italic uppercase tracking-wider text-white mb-4">
                        1. Select a Date
                    </h3>
                    {dates.length === 0 ? (
                        <div className="bg-surface-container/50 border border-white/5 rounded-xl p-8 text-center text-on-surface-variant text-sm font-medium">
                            No slots currently scheduled for this field.
                        </div>
                    ) : (
                        <div className="flex gap-3 overflow-x-auto pb-3 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                            {dates.map((dateStr) => {
                                const { weekday, dayMonth } = formatDateTab(dateStr)
                                const isSelected = selectedDate === dateStr
                                return (
                                    <button
                                        key={dateStr}
                                        onClick={() => {
                                            setSelectedDate(dateStr)
                                            setSelectedSlot(null)
                                        }}
                                        className={cn(
                                            "flex flex-col items-center justify-center min-w-20 px-4 py-3.5 rounded-xl border transition-all duration-300",
                                            isSelected
                                                ? "bg-primary-container border-primary-container text-on-primary-container scale-[1.02] shadow-lg shadow-primary-container/10"
                                                : "bg-surface-container border-white/5 text-on-surface-variant hover:border-white/10 hover:text-white"
                                        )}
                                    >
                                        <span className="text-[10px] uppercase font-bold tracking-widest opacity-80">
                                            {weekday}
                                        </span>
                                        <span className="text-sm font-black mt-1">
                                            {dayMonth}
                                        </span>
                                    </button>
                                )
                            })}
                        </div>
                    )}
                </div>

                {selectedDate && (
                    <div>
                        <h3 className="text-xl font-headline font-black italic uppercase tracking-wider text-white mb-4">
                            2. Pick a Session
                        </h3>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                            {sortedSlots.map((slot) => {
                                const isSelected = selectedSlot?.id === slot.id
                                const isAvailable = slot.status === "AVAILABLE"

                                return (
                                    <button
                                        key={slot.id}
                                        disabled={!isAvailable}
                                        onClick={() => setSelectedSlot(slot)}
                                        className={cn(
                                            "relative flex flex-col p-4 rounded-xl border text-left transition-all duration-300",
                                            !isAvailable && "opacity-40 bg-background/50 border-white/5 cursor-not-allowed",
                                            isAvailable && isSelected && "bg-primary-container/10 border-primary-container text-white ring-1 ring-primary-container",
                                            isAvailable && !isSelected && "bg-surface-container border-white/5 text-on-surface hover:border-white/15"
                                        )}
                                    >
                                        <div className="flex items-center gap-1.5 text-xs font-bold text-on-surface-variant mb-2">
                                            <ClockIcon className="h-3.5 w-3.5 text-primary-container" />
                                            <span>{slot.startTime} - {slot.endTime}</span>
                                        </div>
                                        <div className="text-base font-black text-white mt-auto">
                                            {slot.pricePerSlot.toLocaleString()} BDT
                                        </div>
                                        <div className="absolute top-2.5 right-2.5">
                                            <span className={cn(
                                                "text-[9px] font-black uppercase px-2 py-0.5 rounded-full tracking-wider",
                                                slot.status === "AVAILABLE" && "bg-green-500/10 text-green-400 border border-green-500/20",
                                                slot.status === "BOOKED" && "bg-red-500/10 text-red-400 border border-red-500/20",
                                                slot.status === "BLOCKED" && "bg-white/10 text-on-surface-variant border border-white/5"
                                            )}>
                                                {slot.status.toLowerCase()}
                                            </span>
                                        </div>
                                    </button>
                                )
                            })}
                        </div>
                    </div>
                )}
            </div>

            {/* Right side: Checkout Summary Box */}
            <div className="lg:col-span-4">
                <Card className="bg-surface-container border-white/5 p-6 rounded-xl shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary-container/5 rounded-full blur-2xl pointer-events-none" />
                    
                    <h3 className="text-xl font-headline font-black italic uppercase tracking-wider text-white mb-6 border-b border-white/5 pb-4">
                        Booking Invoice
                    </h3>

                    {selectedSlot ? (
                        <div className="space-y-6">
                            {/* Selected Slot summary details */}
                            <div className="space-y-3.5 bg-background/50 border border-white/5 rounded-xl p-4">
                                <div className="flex items-center gap-2.5 text-sm font-bold text-on-surface">
                                    <CalendarIcon className="h-4 w-4 text-primary-container shrink-0" />
                                    <span>
                                        {new Date(selectedSlot.date).toLocaleDateString("en-US", {
                                            weekday: "long",
                                            year: "numeric",
                                            month: "long",
                                            day: "numeric",
                                        })}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2.5 text-sm font-bold text-on-surface">
                                    <ClockIcon className="h-4 w-4 text-primary-container shrink-0" />
                                    <span>{selectedSlot.startTime} - {selectedSlot.endTime} (60 min)</span>
                                </div>
                            </div>

                            {/* Payment type selector */}
                            <div className="space-y-2">
                                <span className="text-[10px] uppercase font-black text-on-surface-variant tracking-widest">
                                    Choose Payment Option
                                </span>
                                <div className="grid grid-cols-2 gap-2 mt-1.5">
                                    <button
                                        type="button"
                                        onClick={() => setPaymentType("FULL")}
                                        className={cn(
                                            "flex flex-col items-center justify-center p-3 rounded-lg border text-xs font-bold transition-all",
                                            paymentType === "FULL"
                                                ? "bg-primary-container/10 border-primary-container text-white"
                                                : "bg-background border-white/5 text-on-surface-variant hover:border-white/10"
                                        )}
                                    >
                                        <SparklesIcon className="h-4 w-4 mb-1 text-primary-container" />
                                        <span>Full Amount</span>
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setPaymentType("PARTIAL")}
                                        className={cn(
                                            "flex flex-col items-center justify-center p-3 rounded-lg border text-xs font-bold transition-all",
                                            paymentType === "PARTIAL"
                                                ? "bg-primary-container/10 border-primary-container text-white"
                                                : "bg-background border-white/5 text-on-surface-variant hover:border-white/10"
                                        )}
                                    >
                                        <CreditCardIcon className="h-4 w-4 mb-1 text-primary-container" />
                                        <span>50% Advance</span>
                                    </button>
                                </div>
                            </div>

                            {/* Cost Breakdown */}
                            <div className="space-y-2 border-t border-white/5 pt-4">
                                <div className="flex justify-between text-sm text-on-surface-variant font-medium">
                                    <span>Hourly Rate</span>
                                    <span className="text-on-surface font-bold">{price.toLocaleString()} BDT</span>
                                </div>
                                <div className="flex justify-between text-sm text-on-surface-variant font-medium">
                                    <span>Platform Fee (5%)</span>
                                    <span className="text-on-surface font-bold">{platformFee.toLocaleString()} BDT</span>
                                </div>
                                <div className="flex justify-between text-sm text-on-surface-variant font-medium pt-2 border-t border-white/5">
                                    <span>Total Invoice</span>
                                    <span className="text-white font-black">{totalAmount.toLocaleString()} BDT</span>
                                </div>

                                {paymentType === "PARTIAL" && (
                                    <>
                                        <div className="flex justify-between text-sm text-primary-container font-black pt-2">
                                            <span>Pay Upfront (50%)</span>
                                            <span>{upfrontPayment.toLocaleString()} BDT</span>
                                        </div>
                                        <div className="flex justify-between text-[11px] text-on-surface-variant font-semibold">
                                            <span>Due at Venue</span>
                                            <span>{dueAmount.toLocaleString()} BDT</span>
                                        </div>
                                    </>
                                )}
                            </div>

                            {/* Booking Action Button */}
                            <form action={action}>
                                <input type="hidden" name="slotId" value={selectedSlot.id} />
                                <input type="hidden" name="paymentType" value={paymentType} />

                                {user ? (
                                    <Button
                                        type="submit"
                                        disabled={isPending}
                                        className="w-full bg-primary-container text-on-primary-container font-black uppercase tracking-wider py-6 rounded-xl hover:brightness-110 active:scale-95 transition-all text-xs"
                                    >
                                        {isPending ? "Locking slot..." : "Confirm & Pay Upfront"}
                                    </Button>
                                ) : (
                                    <Button
                                        type="button"
                                        onClick={handleLoginRedirect}
                                        disabled={isRedirecting}
                                        className="w-full bg-surface-variant text-white border border-white/10 font-black uppercase tracking-wider py-6 rounded-xl hover:bg-white/10 active:scale-95 transition-all text-xs flex items-center justify-center gap-2"
                                    >
                                        <LogInIcon className="h-4 w-4" />
                                        {isRedirecting ? "Redirecting..." : "Login to reserve"}
                                    </Button>
                                )}
                            </form>
                        </div>
                    ) : (
                        <div className="text-center py-12 text-on-surface-variant text-sm font-medium">
                            Select an available time slot on the left to review price breakdown and finalize your booking.
                        </div>
                    )}
                </Card>
            </div>
        </div>
    )
}
