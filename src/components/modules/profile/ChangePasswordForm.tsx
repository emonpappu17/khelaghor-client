/* eslint-disable react-hooks/set-state-in-effect */
"use client"

import { changePasswordAction } from "@/actions/profile.actions"
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import type { ActionState } from "@/types/api.types"
import { EyeIcon, TriangleIcon, ViewOffIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { useActionState, useEffect, useRef, useState } from "react"
import { toast } from "sonner"
import { SubmitButton } from "./SubmitButton"

export function ChangePasswordForm() {
  const [state, action] = useActionState(
    changePasswordAction,
    null
  )

  const [showOld, setShowOld] = useState(false)
  const [showNew, setShowNew] = useState(false)
  const [oldPassword, setOldPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")

  const formRef = useRef<HTMLFormElement>(null)
  const lastSuccessRef = useRef<ActionState | null>(null)

  // ── Toast + reset on successful save ──────────────────────────────────────
  useEffect(() => {
    if (state?.success === true && state !== lastSuccessRef.current) {
      lastSuccessRef.current = state
      toast.success(state.message ?? "Password changed successfully!")
      setOldPassword("")
      setNewPassword("")
    }
  }, [state])

  const isDirty = oldPassword.trim().length > 0 && newPassword.trim().length > 0

  return (
    <form ref={formRef} action={action} noValidate>
      <FieldGroup className="space-y-0">

        {/* ── Global form error ─────────────────────────────────────────── */}
        {state?.errors?._form && (
          <div
            role="alert"
            aria-live="assertive"
            className="flex items-start gap-3 rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive mb-6"
          >
            <HugeiconsIcon icon={TriangleIcon} strokeWidth={2} className="mt-0.5 size-4 shrink-0" />
            <div className="space-y-0.5">
              {state.errors._form.map((msg, i) => <p key={i}>{msg}</p>)}
            </div>
          </div>
        )}

        {/* ── Fields ───────────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">

          {/* Current Password */}
          <Field>
            <FieldLabel htmlFor="oldPassword">Current Password</FieldLabel>
            <div className="relative">
              <Input
                id="oldPassword"
                name="oldPassword"
                type={showOld ? "text" : "password"}
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                placeholder="Enter current password"
                autoComplete="current-password"
                aria-invalid={!!state?.errors?.oldPassword}
                className="bg-background pr-11"
              />
              <button
                type="button"
                aria-label={showOld ? "Hide password" : "Show password"}
                onClick={() => setShowOld((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface transition"
              >
                <HugeiconsIcon icon={showOld ? ViewOffIcon : EyeIcon} strokeWidth={2} className="size-4" />
              </button>
            </div>
            <FieldError messages={state?.errors?.oldPassword} />
          </Field>

          {/* New Password */}
          <Field>
            <FieldLabel htmlFor="newPassword">New Password</FieldLabel>
            <div className="relative">
              <Input
                id="newPassword"
                name="newPassword"
                type={showNew ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Min. 6 characters"
                autoComplete="new-password"
                aria-invalid={!!state?.errors?.newPassword}
                className="bg-background pr-11"
              />
              <button
                type="button"
                aria-label={showNew ? "Hide password" : "Show password"}
                onClick={() => setShowNew((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface transition"
              >
                <HugeiconsIcon icon={showNew ? ViewOffIcon : EyeIcon} strokeWidth={2} className="size-4" />
              </button>
            </div>
            <FieldError messages={state?.errors?.newPassword} />
          </Field>

        </div>

        {/* ── Submit ───────────────────────────────────────────────────── */}
        <div className="flex justify-end">
          <SubmitButton isDirty={isDirty} label="Change Password" />
        </div>

      </FieldGroup>
    </form>
  )
}