import { Suspense } from "react"
import { LoginForm } from "@/components/modules/auth/login-form"
import { HugeiconsIcon } from "@hugeicons/react"
import { LayoutBottomIcon } from "@hugeicons/core-free-icons"
import Image from "next/image"
import Link from "next/link"
import type { Metadata } from "next"

// ─── Metadata ─────────────────────────────────────────────────────────────────

export const metadata: Metadata = {
    title: "Sign In | Khelaghor",
    description:
        "Sign in to your Khelaghor account to book sports fields or manage your venue.",
}

// ─── Page — pure Server Component ────────────────────────────────────────────

export default function LoginPage() {
    return (
        <div className="grid min-h-svh lg:grid-cols-2">
            {/* ── Left panel — form ── */}
            <div className="flex flex-col gap-4 p-6 md:p-10">
                <div className="flex justify-center gap-2 md:justify-start">
                    <Link
                        href="/"
                        className="flex items-center gap-2 font-headline font-black italic uppercase tracking-tight text-primary-container text-xl"
                    >
                        <div className="flex size-6 items-center justify-center rounded-md bg-primary-container text-on-primary-container">
                            <HugeiconsIcon
                                icon={LayoutBottomIcon}
                                strokeWidth={2}
                                className="size-4"
                            />
                        </div>
                        Khelaghor
                    </Link>
                </div>

                <div className="flex flex-1 items-center justify-center">
                    <div className="w-full max-w-sm">
                        <Suspense
                            fallback={
                                <div className="flex flex-col gap-5 animate-pulse">
                                    <div className="h-10 rounded-lg bg-white/5" />
                                    <div className="h-10 rounded-lg bg-white/5" />
                                    <div className="h-10 rounded-lg bg-white/5" />
                                    <div className="h-10 rounded-lg bg-white/5" />
                                </div>
                            }
                        >
                            <LoginForm />
                        </Suspense>
                    </div>
                </div>
            </div>

            {/* ── Right panel — decorative image ── */}
            <div className="relative hidden lg:block">
                <Image
                    src="/field-home.png"
                    alt="An aerial view of a floodlit sports field at night"
                    fill
                    className="object-cover brightness-50"
                    priority
                />

                <div className="absolute inset-0 flex flex-col justify-end p-16">
                    <blockquote className="border-l-4 border-primary-container pl-6">
                        <p className="font-headline text-4xl font-black italic uppercase leading-tight text-white">
                            BACK ON<br />
                            <span className="text-primary-container">THE FIELD.</span>
                        </p>
                        <p className="mt-4 text-sm font-medium uppercase tracking-widest text-on-surface-variant">
                            Sign in and pick up where you left off
                        </p>
                    </blockquote>
                </div>
            </div>
        </div>
    )
}
