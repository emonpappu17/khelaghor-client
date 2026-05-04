"use client"

import { startTransition, useActionState, useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from "@/components/ui/input-otp"
import {
    Field,
    FieldDescription,
    FieldGroup,
    FieldLabel,
} from "@/components/ui/field"
import { TriangleAlertIcon, MailIcon, RefreshCwIcon } from "lucide-react"
import Link from "next/link"
import { sendVerificationOtpAction, verifyEmailOtpAction, SendOtpState, VerifyOtpState } from "@/actions/auth.actions"
import { useRouter } from "next/navigation"

export function VerifyEmailForm({ className, ...props }: React.ComponentProps<"div">) {
    const searchParams = useSearchParams()
    const email = searchParams.get("email") || ""
    const router = useRouter()

    const [otpSent, setOtpSent] = useState(false)
    const [resendTimer, setResendTimer] = useState(0)
    const [otpValue, setOtpValue] = useState("")
    const [sendState, sendAction, sendPending] = useActionState<SendOtpState, void>(
        () => sendVerificationOtpAction(email),
        {}
    )
    const [verifyState, verifyAction, verifyPending] = useActionState<VerifyOtpState, void>(
        async (_prev: VerifyOtpState): Promise<VerifyOtpState> => {
            const otp = parseInt(otpValue)
            return await verifyEmailOtpAction(email, otp)
        },
        {}
    )

    useEffect(() => {
        if (sendState.data?.sent) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setOtpSent(true)
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setResendTimer(15)
        }
    }, [sendState])

    useEffect(() => {
        if (resendTimer > 0) {
            const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000)
            return () => clearTimeout(timer)
        }
    }, [resendTimer])

    useEffect(() => {
        if (verifyState.data?.verified) {
            setTimeout(() => router.push("/login?verified=true"), 2000)
        }
    }, [verifyState, router])

    const handleSendOtp = () => {
        startTransition(() => {
            sendAction()
        })
    }

    if (!email) {
        return (
            <div className="text-center">
                <p className="text-destructive">No email provided. Please register first.</p>
                <Link href="/register" className="text-primary-container underline">
                    Go to Register
                </Link>
            </div>
        )
    }

    return (
        <div className={cn("flex flex-col gap-5 text-center", className)} {...props}>
            <FieldGroup>
                {/* ── Header ── */}
                <div className="flex flex-col gap-1 text-center">
                    <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary-container/10">
                        <MailIcon className="h-6 w-6 text-primary-container" />
                    </div>
                    <h1 className="font-headline text-3xl font-black italic uppercase tracking-tight">
                        Verify Your Email
                    </h1>
                    <p className="text-sm text-on-surface-variant text-balance">
                        Confirm to send a 6-digit code to <strong>{email}</strong>
                    </p>
                </div>

                {/* ── Global error banner ── */}
                {(sendState.errors?._form || verifyState.errors?._form) && (
                    <div
                        role="alert"
                        aria-live="assertive"
                        className="flex items-start gap-3 rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive"
                    >
                        <TriangleAlertIcon className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                        <div className="space-y-0.5">
                            {(sendState.errors?._form || verifyState.errors?._form)?.map((msg, i) => (
                                <p key={i}>{msg}</p>
                            ))}
                        </div>
                    </div>
                )}

                {/* ── Success message ── */}
                {verifyState.data?.verified && (
                    <div
                        role="alert"
                        aria-live="assertive"
                        className="flex items-start gap-3 rounded-lg border border-green-500/30 bg-green-500/10 px-4 py-3 text-sm text-green-600"
                    >
                        <MailIcon className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                        <p>Email verified successfully! Redirecting to login...</p>
                    </div>
                )}

                {!otpSent ? (
                    /* ── Send OTP Button ── */
                    <Field>
                        <Button
                            onClick={handleSendOtp}
                            disabled={sendPending}
                            className="w-full font-headline font-black uppercase tracking-widest transition-all active:scale-95 bg-primary-container text-on-primary-container hover:brightness-110 disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                            {sendPending ? (
                                <span className="flex items-center gap-2">
                                    <svg
                                        className="h-4 w-4 animate-spin"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        aria-hidden="true"
                                    >
                                        <circle
                                            className="opacity-25"
                                            cx="12" cy="12" r="10"
                                            stroke="currentColor" strokeWidth="4"
                                        />
                                        <path
                                            className="opacity-75"
                                            fill="currentColor"
                                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                                        />
                                    </svg>
                                    Sending…
                                </span>
                            ) : (
                                "Send Verification Code"
                            )}
                        </Button>
                    </Field>
                ) : (
                    <>
                        {/* ── OTP Input ── */}
                        <Field className="text-center">
                            <FieldLabel className="w-full justify-center text-center">Verification Code</FieldLabel>
                            <div className="flex justify-center">
                                <InputOTP
                                    maxLength={6}
                                    value={otpValue}
                                    onChange={setOtpValue}
                                    containerClassName="justify-center"
                                >
                                    <InputOTPGroup>
                                        <InputOTPSlot className="bg-background" index={0} />
                                        <InputOTPSlot className="bg-background" index={1} />
                                        <InputOTPSlot className="bg-background" index={2} />
                                    </InputOTPGroup>
                                    <InputOTPSeparator />
                                    <InputOTPGroup>
                                        <InputOTPSlot className="bg-background" index={3} />
                                        <InputOTPSlot className="bg-background" index={4} />
                                        <InputOTPSlot className="bg-background" index={5} />
                                    </InputOTPGroup>
                                </InputOTP>
                            </div>
                            <FieldDescription className="text-center">
                                Enter the 6-digit code sent to your email.
                            </FieldDescription>
                        </Field>

                        {/* ── Verify Button ── */}
                        <Field>
                            <Button
                                onClick={() => startTransition(() => verifyAction())}
                                disabled={verifyPending || otpValue.length !== 6}
                                className="w-full font-headline font-black uppercase tracking-widest transition-all active:scale-95 bg-primary-container text-on-primary-container hover:brightness-110 disabled:opacity-60 disabled:cursor-not-allowed"
                            >
                                {verifyPending ? (
                                    <span className="flex items-center gap-2">
                                        <svg
                                            className="h-4 w-4 animate-spin"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            aria-hidden="true"
                                        >
                                            <circle
                                                className="opacity-25"
                                                cx="12" cy="12" r="10"
                                                stroke="currentColor" strokeWidth="4"
                                            />
                                            <path
                                                className="opacity-75"
                                                fill="currentColor"
                                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                                            />
                                        </svg>
                                        Verifying…
                                    </span>
                                ) : (
                                    "Verify Email"
                                )}
                            </Button>
                        </Field>

                        {/* ── Resend Button ── */}
                        <Field>
                            <Button
                                onClick={handleSendOtp}
                                disabled={resendTimer > 0 || sendPending}
                                variant="outline"
                                className="w-full"
                            >
                                {sendPending ? (
                                    <RefreshCwIcon className="mr-2 h-4 w-4 animate-spin" />
                                ) : resendTimer > 0 ? (
                                    <span className="mr-2">⏱️</span>
                                ) : (
                                    <RefreshCwIcon className="mr-2 h-4 w-4" />
                                )}
                                {resendTimer > 0 ? `Resend in ${resendTimer}s` : "Resend Code"}
                            </Button>
                        </Field>
                    </>
                )}

                {/* ── Back to Register ── */}
                <FieldDescription className="text-center text-xs">
                    Wrong email?{" "}
                    <Link
                        href="/register"
                        className="font-bold text-primary-container underline-offset-4 hover:underline"
                    >
                        Register again
                    </Link>
                </FieldDescription>
            </FieldGroup>
        </div>
    )
}