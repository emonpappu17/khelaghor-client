import type { Metadata } from "next"

export const metadata: Metadata = {
    title: "Reset Password | Khelaghor",
    description: "Set a new password for your Khelaghor account.",
}

export default function ResetPasswordPage() {
    return (
        <div className="flex min-h-screen items-center justify-center bg-background px-4 py-12">
            <div className="w-full max-w-md space-y-6 text-center">
                <h1 className="font-headline text-3xl font-bold text-on-surface">
                    Reset Password
                </h1>
                <p className="text-on-surface-variant">
                    Enter your new password below.
                </p>
            </div>
        </div>
    )
}
