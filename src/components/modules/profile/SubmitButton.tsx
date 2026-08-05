import { Button } from "@/components/ui/button"
import { useFormStatus } from "react-dom"

type SubmitButtonProps = {
    isDirty: boolean
    label?: string
}

export function SubmitButton({ isDirty, label = "Save Changes" }: SubmitButtonProps) {
    const { pending } = useFormStatus()
    const isDisabled = !isDirty || pending

    return (
        <Button
            type="submit"
            disabled={isDisabled}
            aria-disabled={isDisabled}
            className="w-full font-headline font-black uppercase tracking-widest transition-all active:scale-95 bg-primary-container text-on-primary-container hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed"
        >
            {pending ? (
                <span className="flex items-center justify-center gap-2">
                    <span className="size-4 rounded-full border-2 border-current border-t-transparent animate-spin" />
                    Saving…
                </span>
            ) : (
                label
            )}
        </Button>
    )
}