import { Button } from "@/components/ui/button";
import { useFormStatus } from "react-dom";

export function SubmitButton({ label, pendingLabel }: { label: string; pendingLabel: string }) {
    const { pending } = useFormStatus()
    return (
        <Button
            type="submit"
            disabled={pending}
            aria-disabled={pending}
            className="w-full font-headline font-black uppercase tracking-widest transition-all active:scale-95 bg-primary-container text-on-primary-container hover:brightness-110 disabled:opacity-60 disabled:cursor-not-allowed"
        >
            {pending ? (
                <span className="flex items-center gap-2">
                    <svg className="size-4 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden>
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    {pendingLabel}
                </span>
            ) : label}
        </Button>
    )
}