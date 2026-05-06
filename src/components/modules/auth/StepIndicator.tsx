import { cn } from "@/lib/utils"

export function StepIndicator({ current }: { current: 1 | 2 | 3 }) {
    const steps = [
        { n: 1, label: "Email" },
        { n: 2, label: "OTP" },
        { n: 3, label: "Reset" },
    ]
    return (
        <div className="flex items-center justify-center gap-2" aria-label="Progress">
            {steps.map((s, i) => (
                <div key={s.n} className="flex items-center gap-2">
                    <div className={cn(
                        "flex size-7 items-center justify-center rounded-full text-xs font-black font-headline uppercase transition-all duration-300",
                        current === s.n
                            ? "bg-primary-container text-on-primary-container scale-110"
                            : current > s.n
                                ? "bg-primary-container/40 text-on-primary-container"
                                : "bg-surface-container text-on-surface-variant"
                    )}>
                        {s.n}
                    </div>
                    <span className={cn(
                        "text-[10px] uppercase tracking-widest font-bold hidden sm:block",
                        current === s.n ? "text-primary-container" : "text-on-surface-variant"
                    )}>
                        {s.label}
                    </span>
                    {i < steps.length - 1 && (
                        <div className={cn(
                            "h-px w-8 transition-colors duration-300",
                            current > s.n ? "bg-primary-container/60" : "bg-white/10"
                        )} />
                    )}
                </div>
            ))}
        </div>
    )
}