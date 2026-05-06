import {
    resetPasswordAction,
    ResetPasswordState
} from "@/actions/auth.actions"
import {
    Field,
    FieldError,
    FieldGroup,
    FieldLabel
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import {
    AlertTriangle,
    EyeIcon,
    EyeOff,
    LockPasswordIcon
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { useActionState, useState } from "react"
import { FormError } from "./FormError"
import { SubmitButton } from "./SubmitButton"

const rpInitial: ResetPasswordState = {}

export function Step3Reset({
    email,
    resetToken,
}: {
    email: string
    resetToken: string
}) {
    const [state, action] = useActionState<ResetPasswordState, FormData>(
        resetPasswordAction,
        rpInitial
    )
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirm, setShowConfirm] = useState(false)
    const [password, setPassword] = useState("")
    const [confirm, setConfirm] = useState("")
    const mismatch = confirm.length > 0 && password !== confirm

    return (
        <form action={action} noValidate>
            {/* Hidden fields */}
            <input type="hidden" name="email" value={email} />
            <input type="hidden" name="resetToken" value={resetToken} />

            <FieldGroup>
                {/* Header */}
                <div className="flex flex-col gap-1 text-center">
                    <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-primary-container/15 mb-2">
                        <HugeiconsIcon icon={LockPasswordIcon} className="size-7 text-primary-container" />
                    </div>
                    <h2 className="font-headline text-2xl font-black italic uppercase tracking-tight">
                        New Password
                    </h2>
                    <p className="text-sm text-on-surface-variant text-balance">
                        Set a strong password for your account.
                    </p>
                </div>

                <FormError messages={state.errors?._form} />

                {/* New password */}
                <Field data-invalid={!!state.errors?.password || undefined}>
                    <FieldLabel htmlFor="rp-password">New Password</FieldLabel>
                    <div className="relative">
                        <Input
                            id="rp-password"
                            name="password"
                            type={showPassword ? "text" : "password"}
                            placeholder="Min. 6 characters"
                            autoComplete="new-password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            minLength={6}
                            aria-invalid={!!state.errors?.password}
                            aria-describedby={state.errors?.password ? "rp-pw-error" : undefined}
                            className="bg-background pr-11"
                        />
                        <button
                            type="button"
                            aria-label={showPassword ? "Hide password" : "Show password"}
                            onClick={() => setShowPassword((v) => !v)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-foreground transition focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary-container rounded"
                        >
                            <HugeiconsIcon icon={showPassword ? EyeOff : EyeIcon} className="size-4" aria-hidden />
                        </button>
                    </div>
                    <FieldError id="rp-pw-error" messages={state.errors?.password} />
                </Field>

                {/* Confirm password */}
                <Field data-invalid={mismatch || undefined}>
                    <FieldLabel htmlFor="rp-confirm">Confirm Password</FieldLabel>
                    <div className="relative">
                        <Input
                            id="rp-confirm"
                            type={showConfirm ? "text" : "password"}
                            placeholder="Repeat your password"
                            autoComplete="new-password"
                            value={confirm}
                            onChange={(e) => setConfirm(e.target.value)}
                            required
                            aria-invalid={mismatch}
                            aria-describedby={mismatch ? "rp-confirm-error" : undefined}
                            className="bg-background pr-11"
                        />
                        <button
                            type="button"
                            aria-label={showConfirm ? "Hide password" : "Show password"}
                            onClick={() => setShowConfirm((v) => !v)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-foreground transition focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary-container rounded"
                        >
                            <HugeiconsIcon icon={showConfirm ? EyeOff : EyeIcon} className="size-4" aria-hidden />
                        </button>
                    </div>
                    {mismatch && (
                        <p id="rp-confirm-error" className="flex items-center gap-1.5 mt-1 text-xs font-medium text-destructive">
                            <HugeiconsIcon icon={AlertTriangle} className="size-3 shrink-0" aria-hidden />
                            Passwords do not match
                        </p>
                    )}
                </Field>

                {/* Strength hints */}
                {password.length > 0 && (
                    <div className="flex gap-1.5" aria-label="Password strength">
                        {[6, 10, 14].map((threshold, i) => (
                            <div
                                key={i}
                                className={cn(
                                    "h-1 flex-1 rounded-full transition-colors duration-300",
                                    password.length >= threshold
                                        ? i === 0 ? "bg-destructive" : i === 1 ? "bg-yellow-400" : "bg-primary-container"
                                        : "bg-white/10"
                                )}
                            />
                        ))}
                        <span className="text-[10px] text-on-surface-variant self-center ml-1">
                            {password.length < 6 ? "Too short" : password.length < 10 ? "Fair" : password.length < 14 ? "Good" : "Strong"}
                        </span>
                    </div>
                )}

                <Field>
                    <SubmitButton label="Reset Password" pendingLabel="Resetting…" />
                </Field>
            </FieldGroup>
        </form>
    )
}