"use client"

import { cn } from "@/lib/utils"

type Role = "USER" | "HOST"

interface RolePillProps {
    value: Role
    active: boolean
    icon: React.ReactNode
    label: string
    sublabel: string
    onClick: () => void
}
export function RolePill({ active, icon, label, sublabel, onClick }: RolePillProps) {
    return (
        <button
            type="button"
            role="radio"
            aria-checked={active}
            aria-label={`Register as ${label}`}
            onClick={onClick}
            className={cn(
                "relative flex flex-1 flex-col items-center gap-2 rounded-xl border px-4 py-5 text-center transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-container",
                active
                    ? "border-primary-container bg-primary-container/10 text-primary-container"
                    : "border-white/10 bg-surface-container text-on-surface-variant hover:border-white/20 hover:bg-surface-container-high"
            )}
        >
            <span
                aria-hidden="true"
                className={cn(
                    "absolute right-3 top-3 h-2 w-2 rounded-full transition-colors",
                    active ? "bg-primary-container" : "bg-white/10"
                )}
            />
            <span
                aria-hidden="true"
                className={cn(
                    "flex h-10 w-10 items-center justify-center rounded-full transition-colors",
                    active
                        ? "bg-primary-container/20 text-primary-container"
                        : "bg-white/5 text-on-surface-variant"
                )}
            >
                {icon}
            </span>
            <span className="font-headline text-sm font-black uppercase tracking-widest">
                {label}
            </span>
            <span className={cn("text-[11px] leading-snug", active ? "text-primary-container/70" : "text-on-surface-variant")}>
                {sublabel}
            </span>
        </button>
    )
}