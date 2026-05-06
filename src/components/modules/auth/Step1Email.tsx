/* eslint-disable react/no-unescaped-entities */
import {
    forgotPasswordAction,
    ForgotPasswordState
} from "@/actions/auth.actions"
import {
    Field,
    FieldDescription,
    FieldError,
    FieldGroup,
    FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
    CheckCircle,
    Mail01Icon
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import Link from "next/link"
import { useActionState, useEffect, useRef } from "react"
import { FormError } from "./FormError"
import { SubmitButton } from "./SubmitButton"

const fpInitial: ForgotPasswordState = {}

function SuccessBanner({ message }: { message: string }) {
    return (
        <div
            role="status"
            aria-live="polite"
            className="flex items-start gap-3 rounded-xl border border-primary/30 bg-primary/10 px-4 py-3 text-sm text-primary"
        >
            <HugeiconsIcon icon={CheckCircle} className="mt-0.5 size-4 shrink-0" aria-hidden />
            <p>{message}</p>
        </div>
    )
}

export function Step1Email({ onSuccess }: { onSuccess: (email: string) => void }) {
    const [state, action] = useActionState<ForgotPasswordState, FormData>(
        forgotPasswordAction,
        fpInitial
    )
    const emailRef = useRef<string>("")

    // Transition to step 2 when action succeeds
    useEffect(() => {
        if (state.success) {
            onSuccess(emailRef.current)
        }
    }, [state.success, onSuccess])

    return (
        <form
            action={(fd) => {
                emailRef.current = fd.get("email") as string
                action(fd)
            }}
            noValidate
        >
            <FieldGroup>
                {/* Header */}
                <div className="flex flex-col gap-1 text-center">
                    <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-primary-container/15 mb-2">
                        <HugeiconsIcon icon={Mail01Icon} className="size-7 text-primary-container" />
                    </div>
                    <h1 className="font-headline text-2xl font-black italic uppercase tracking-tight">
                        Forgot Password?
                    </h1>
                    <p className="text-sm text-on-surface-variant text-balance">
                        Enter your registered email and we'll send a one-time code.
                    </p>
                </div>

                <FormError messages={state.errors?._form} />
                {state.success && <SuccessBanner message={state.message ?? "OTP sent!"} />}

                <Field>
                    <FieldLabel htmlFor="email">Email address</FieldLabel>
                    <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="you@example.com"
                        autoComplete="email"
                        autoFocus
                        defaultValue={state.fields?.email ?? ""}
                        required
                        aria-invalid={!!state.errors?.email}
                        aria-describedby={state.errors?.email ? "fp-email-error" : undefined}
                        className="bg-background"
                    />
                    <FieldError id="fp-email-error" messages={state.errors?.email} />
                </Field>

                <Field>
                    <SubmitButton label="Send OTP" pendingLabel="Sending…" />
                </Field>

                <FieldDescription className="text-center text-xs">
                    Remember your password?{" "}
                    <Link href="/login" className="font-bold text-primary-container underline-offset-4 hover:underline">
                        Sign in
                    </Link>
                </FieldDescription>
            </FieldGroup>
        </form>
    )
}