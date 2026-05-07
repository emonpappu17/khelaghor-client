import {
    verifyOtpAction,
    VerifyOtpState
} from "@/actions/auth.actions"
import {
    Field,
    FieldError,
    FieldGroup,
    FieldLabel
} from "@/components/ui/field"
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSlot,
} from "@/components/ui/input-otp"
import {
    ArrowLeft01Icon
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { useActionState, useEffect, useState } from "react"
import { FormError } from "./FormError"
import { SubmitButton } from "./SubmitButton"
import { toast } from "sonner"

const otpInitial: VerifyOtpState = {}

export function Step2Otp({
    email,
    onSuccess,
    onBack,
}: {
    email: string
    onSuccess: (resetToken: string) => void
    onBack: () => void
}) {
    const [state, action] = useActionState<VerifyOtpState, FormData>(
        verifyOtpAction,
        otpInitial
    )
    const [otp, setOtp] = useState("")

    useEffect(() => {
        if (state.success && state.data?.resetToken) {
            onSuccess(state.data.resetToken)
            toast.success(state.message)

        }
    }, [state.success, state.message, state.data, onSuccess])

    return (
        <form action={action} noValidate>
            {/* Pass email silently */}
            <input type="hidden" name="email" value={email} />
            {/* OTP value from controlled InputOTP */}
            <input type="hidden" name="otp" value={otp} />

            <FieldGroup>
                {/* Header */}
                <div className="flex flex-col gap-1 text-center">
                    <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-primary-container/15 mb-2">
                        <span className="font-headline text-2xl font-black text-primary-container">OTP</span>
                    </div>
                    <h2 className="font-headline text-2xl font-black italic uppercase tracking-tight">
                        Verify Code
                    </h2>
                    <p className="text-sm text-on-surface-variant text-balance">
                        Enter the 6-digit code sent to{" "}
                        <span className="font-semibold text-foreground">{email}</span>
                    </p>
                </div>

                <FormError messages={state.errors?._form} />

                <Field>
                    <FieldLabel className="sr-only">One-time password</FieldLabel>
                    <div className="flex justify-center">
                        <InputOTP
                            maxLength={6}
                            value={otp}
                            onChange={setOtp}
                            aria-label="One-time password"
                            aria-invalid={!!state.errors?._form}
                        >
                            <InputOTPGroup>
                                <InputOTPSlot index={0} />
                                <InputOTPSlot index={1} />
                                <InputOTPSlot index={2} />
                                <InputOTPSlot index={3} />
                                <InputOTPSlot index={4} />
                                <InputOTPSlot index={5} />
                            </InputOTPGroup>
                        </InputOTP>
                    </div>
                    <FieldError messages={state.errors?.otp} />
                </Field>

                <Field>
                    <SubmitButton label="Verify Code" pendingLabel="Verifying…" />
                </Field>

                <button
                    type="button"
                    onClick={onBack}
                    className="flex items-center justify-center gap-1.5 w-full text-xs text-on-surface-variant hover:text-foreground transition-colors"
                >
                    <HugeiconsIcon icon={ArrowLeft01Icon} className="size-3.5" aria-hidden />
                    Change email address
                </button>
            </FieldGroup>
        </form>
    )
}