// import { ForgotPasswordForm } from "@/components/modules/auth/forgot-password-form"
import { HugeiconsIcon } from "@hugeicons/react"
import { LayoutBottomIcon } from "@hugeicons/core-free-icons"
import Image from "next/image"
import type { Metadata } from "next"
import Link from "next/link"
import { ForgotPasswordForm } from "@/components/modules/auth/forgot-password-form"

export const metadata: Metadata = {
    title: "Forgot Password | Khelaghor",
    description: "Reset your Khelaghor account password in three simple steps.",
}

export default function ForgotPasswordPage() {
    return (
        <div className="grid min-h-svh lg:grid-cols-2">
            {/* ── Left panel ── */}
            <div className="flex flex-col gap-4 p-6 md:p-10">
                {/* Logo */}
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

                {/* Form */}
                <div className="flex flex-1 items-center justify-center">
                    <div className="w-full max-w-sm">
                        <ForgotPasswordForm />
                    </div>
                </div>
            </div>

            {/* ── Right panel ── */}
            <div className="relative hidden bg-muted lg:block">
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
                            Back on the field in
                            <br />
                            <span className="text-primary-container">seconds.</span>
                        </p>
                        <p className="mt-4 text-sm font-medium uppercase tracking-widest text-on-surface-variant">
                            Secure • One-time code • Instant access
                        </p>
                    </blockquote>
                </div>
            </div>
        </div>
    )
}
