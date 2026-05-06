/* eslint-disable react/no-unescaped-entities */
"use client"

import { cn } from "@/lib/utils"
import { useState } from "react"
import { Step1Email } from "./Step1Email"
import { Step2Otp } from "./Step2Otp"
import { Step3Reset } from "./Step3Reset"
import { StepIndicator } from "./StepIndicator"


export function ForgotPasswordForm({ className }: { className?: string }) {
    const [step, setStep] = useState<1 | 2 | 3>(1)
    const [email, setEmail] = useState("")
    const [resetToken, setResetToken] = useState("")

    return (
        <div className={cn("flex flex-col gap-6", className)}>
            <StepIndicator current={step} />

            <div className="relative overflow-hidden">
                {step === 1 && (
                    <Step1Email
                        onSuccess={(e) => {
                            setEmail(e)
                            setStep(2)
                        }}
                    />
                )}

                {step === 2 && (
                    <Step2Otp
                        email={email}
                        onSuccess={(token) => {
                            setResetToken(token)
                            setStep(3)
                        }}
                        onBack={() => setStep(1)}
                    />
                )}

                {step === 3 && (
                    <Step3Reset email={email} resetToken={resetToken} />
                )}
            </div>
        </div>
    )
}
