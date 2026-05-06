import { AlertTriangle } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"


export function FormError({ messages }: { messages?: string[] }) {
    if (!messages?.length) return null
    return (
        <div
            role="alert"
            aria-live="assertive"
            className="flex items-start gap-3 rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive"
        >
            <HugeiconsIcon icon={AlertTriangle} className="mt-0.5 size-4 shrink-0" aria-hidden />
            <div className="flex flex-col gap-0.5">
                {messages.map((msg, i) => <p key={i}>{msg}</p>)}
            </div>
        </div>
    )
}