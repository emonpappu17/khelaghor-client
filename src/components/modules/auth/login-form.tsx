"use client"

import { useActionState, useRef, useEffect } from "react"
import { useFormStatus } from "react-dom"
import { useSearchParams } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    Field,
    FieldDescription,
    FieldGroup,
    FieldLabel,
} from "@/components/ui/field"
import {
    EyeIcon,
    EyeOffIcon,
    TriangleAlertIcon,
    CheckCircleIcon,
} from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { loginAction, type LoginState } from "@/actions/auth.actions"

// ── Submit button — reads pending from useFormStatus ─────────────────────────

function SubmitButton() {
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
                    Signing in…
                </span>
            ) : (
                "Sign In"
            )}
        </Button>
    )
}

// ── Inline field error ────────────────────────────────────────────────────────

function FieldError({ messages, id }: { messages?: string[]; id?: string }) {
    if (!messages?.length) return null
    return (
        <ul id={id} role="alert" aria-live="polite" className="mt-1 space-y-0.5">
            {messages.map((msg, i) => (
                <li
                    key={i}
                    className="text-xs font-medium text-destructive flex items-center gap-1"
                >
                    <TriangleAlertIcon className="h-3 w-3 shrink-0" aria-hidden="true" />
                    {msg}
                </li>
            ))}
        </ul>
    )
}

// ── Main form ─────────────────────────────────────────────────────────────────

const initialState: LoginState = {}

export function LoginForm({ className, ...props }: React.ComponentProps<"div">) {
    const [showPassword, setShowPassword] = useState(false)
    const passwordRef = useRef<HTMLInputElement>(null)
    const searchParams = useSearchParams()

    // Was the user just redirected here after successful registration?
    const justRegistered = searchParams.get("registered") === "true"
    // Was the user redirected here after a successful password reset?
    const justReset = searchParams.get("passwordReset") === "true"

    const [state, action] = useActionState<LoginState, FormData>(
        loginAction,
        initialState
    )

    // Clear the password field on server-returned error (never echo passwords)
    useEffect(() => {
        if (state.errors && passwordRef.current) {
            passwordRef.current.value = ""
        }
    }, [state.errors])

    const f = state.fields

    return (
        <div className={cn("flex flex-col gap-5", className)} {...props}>
            <form action={action} noValidate>
                <FieldGroup>
                    {/* ── Header ── */}
                    <div className="flex flex-col gap-1 text-center">
                        <h1 className="font-headline text-3xl font-black italic uppercase tracking-tight">
                            Welcome Back
                        </h1>
                        <p className="text-sm text-on-surface-variant text-balance">
                            Sign in to book fields or manage your venues.
                        </p>
                    </div>

                    {/* ── Registration success banner ── */}
                    {justRegistered && (
                        <div
                            role="status"
                            aria-live="polite"
                            className="flex items-start gap-3 rounded-lg border border-green-500/30 bg-green-500/10 px-4 py-3 text-sm text-green-400"
                        >
                            <CheckCircleIcon className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                            <p>Account created! Sign in to get started.</p>
                        </div>
                    )}

                    {/* ── Password reset success banner ── */}
                    {justReset && (
                        <div
                            role="status"
                            aria-live="polite"
                            className="flex items-start gap-3 rounded-lg border border-green-500/30 bg-green-500/10 px-4 py-3 text-sm text-green-400"
                        >
                            <CheckCircleIcon className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                            <p>Password reset successfully. Sign in with your new password.</p>
                        </div>
                    )}

                    {/* ── Global / server error banner ── */}
                    {state.errors?._form && (
                        <div
                            role="alert"
                            aria-live="assertive"
                            className="flex items-start gap-3 rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive"
                        >
                            <TriangleAlertIcon className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                            <div className="space-y-0.5">
                                {state.errors._form.map((msg, i) => (
                                    <p key={i}>{msg}</p>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* ── Email ── */}
                    <Field>
                        <FieldLabel htmlFor="email">Email</FieldLabel>
                        <Input
                            id="email"
                            name="email"
                            type="email"
                            placeholder="you@example.com"
                            autoComplete="email"
                            defaultValue={f?.email ?? ""}
                            required
                            aria-invalid={!!state.errors?.email}
                            aria-describedby={state.errors?.email ? "email-error" : undefined}
                            className="bg-background"
                        />
                        <FieldError id="email-error" messages={state.errors?.email} />
                    </Field>

                    {/* ── Password ── */}
                    <Field>
                        <div className="flex items-center justify-between">
                            <FieldLabel htmlFor="password">Password</FieldLabel>
                            <Link
                                href="/forgot-password"
                                className="text-[11px] font-medium uppercase tracking-widest text-primary-container underline-offset-4 hover:underline"
                                tabIndex={0}
                            >
                                Forgot password?
                            </Link>
                        </div>
                        <div className="relative">
                            <Input
                                id="password"
                                name="password"
                                ref={passwordRef}
                                type={showPassword ? "text" : "password"}
                                placeholder="Your password"
                                autoComplete="current-password"
                                required
                                aria-invalid={!!state.errors?.password}
                                aria-describedby={
                                    state.errors?.password ? "pw-error" : undefined
                                }
                                className="bg-background pr-11"
                            />
                            <button
                                type="button"
                                aria-label={showPassword ? "Hide password" : "Show password"}
                                onClick={() => setShowPassword((v) => !v)}
                                tabIndex={0}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant transition hover:text-white focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary-container rounded"
                            >
                                {showPassword ? (
                                    <EyeOffIcon className="h-4 w-4" aria-hidden="true" />
                                ) : (
                                    <EyeIcon className="h-4 w-4" aria-hidden="true" />
                                )}
                            </button>
                        </div>
                        <FieldError id="pw-error" messages={state.errors?.password} />
                    </Field>

                    {/* ── Submit ── */}
                    <Field>
                        <SubmitButton />
                    </Field>

                    {/* ── Divider ── */}
                    <div className="relative flex items-center gap-3">
                        <div className="h-px flex-1 bg-white/10" />
                        <span className="text-[11px] font-medium uppercase tracking-widest text-on-surface-variant">
                            Or continue with
                        </span>
                        <div className="h-px flex-1 bg-white/10" />
                    </div>

                    {/* ── Google OAuth ── */}
                    <Field>
                        <Button
                            variant="outline"
                            type="button"
                            className="w-full"
                            onClick={() => {
                                window.location.href = `${process.env.NEXT_PUBLIC_BASE_URL}/auth/google?redirect=/dashboard`
                            }}
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                className="mr-2 h-4 w-4"
                                aria-hidden="true"
                            >
                                <path
                                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                    fill="#4285F4"
                                />
                                <path
                                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                    fill="#34A853"
                                />
                                <path
                                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                    fill="#FBBC05"
                                />
                                <path
                                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                    fill="#EA4335"
                                />
                            </svg>
                            Continue with Google
                        </Button>

                        <FieldDescription className="text-center text-xs">
                            Don&apos;t have an account?{" "}
                            <Link
                                href="/register"
                                className="font-bold text-primary-container underline-offset-4 hover:underline"
                            >
                                Create one
                            </Link>
                        </FieldDescription>
                    </Field>
                </FieldGroup>
            </form>
        </div>
    )
}
