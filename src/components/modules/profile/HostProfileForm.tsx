/* eslint-disable react-hooks/set-state-in-effect */
"use client"

import { updateHostProfileAction } from "@/actions/profile.actions"
import { Badge } from "@/components/ui/badge"
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import type { ActionState, HostProfile } from "@/types/api.types"
import { CheckmarkCircle02Icon, TriangleIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { useActionState, useEffect, useRef, useState } from "react"
import { toast } from "sonner"
import { SubmitButton } from "./SubmitButton"

type HostProfileFormProps = {
  hostProfile: HostProfile
}

export function HostProfileForm({ hostProfile }: HostProfileFormProps) {
  const [state, action] = useActionState(updateHostProfileAction, null)

  const [businessName, setBusinessName] = useState(hostProfile.businessName ?? "")
  const [nidNumber, setNidNumber] = useState(hostProfile.nidNumber ?? "")

  const lastSuccessRef = useRef<ActionState | null>(null)

  useEffect(() => {
    setBusinessName(hostProfile.businessName ?? "")
    setNidNumber(hostProfile.nidNumber ?? "")
  }, [hostProfile.businessName, hostProfile.nidNumber])

  useEffect(() => {
    if (state?.success === true && state !== lastSuccessRef.current) {
      lastSuccessRef.current = state
      toast.success(state.message ?? "Host profile updated successfully!")
    }
  }, [state])

  const isDirty =
    businessName.trim() !== (hostProfile.businessName ?? "").trim() ||
    nidNumber.trim() !== (hostProfile.nidNumber ?? "").trim()

  return (
    <form action={action} noValidate>
      <FieldGroup className="space-y-0">

        {/* ── Global form error ────────────────────────────────────────── */}
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

        {/* ── Approval status banner ───────────────────────────────────── */}
        {hostProfile.approvedAt ? (
          <div className="flex items-center gap-3 rounded-xl bg-green-500/8 border border-green-500/20 px-4 py-3 mb-6">
            <HugeiconsIcon icon={CheckmarkCircle02Icon} strokeWidth={2} className="size-4 text-green-600 shrink-0" />
            <div className="flex items-center gap-2 flex-wrap">
              <Badge className="bg-green-500/15 text-green-700 border border-green-500/25 font-semibold text-[10px] rounded-full px-2">
                Approved
              </Badge>
              <span className="text-xs text-on-surface-variant">
                Your host profile was approved on{" "}
                <span className="font-medium text-on-surface">
                  {new Date(hostProfile.approvedAt).toLocaleDateString(undefined, {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </span>
              </span>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-3 rounded-xl bg-amber-500/8 border border-amber-500/20 px-4 py-3 mb-6">
            <HugeiconsIcon icon={TriangleIcon} strokeWidth={2} className="size-4 text-amber-600 shrink-0" />
            <div className="flex items-center gap-2 flex-wrap">
              <Badge className="bg-amber-500/15 text-amber-700 border border-amber-500/25 font-semibold text-[10px] rounded-full px-2">
                Pending
              </Badge>
              <span className="text-xs text-on-surface-variant">Your host profile is awaiting admin approval.</span>
            </div>
          </div>
        )}

        {/* ── Fields ───────────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <Field>
            <FieldLabel htmlFor="business_name">Business Name</FieldLabel>
            <Input
              id="business_name"
              name="business_name"
              type="text"
              autoComplete="organization"
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              aria-invalid={!!state?.errors?.business_name}
              className="bg-background"
            />
            <FieldError messages={state?.errors?.business_name} />
          </Field>

          <Field>
            <FieldLabel htmlFor="nid_number">
              NID Number
              <span className="ml-1.5 text-[10px] font-normal text-on-surface-variant normal-case tracking-normal">10 digits</span>
            </FieldLabel>
            <Input
              id="nid_number"
              name="nid_number"
              type="text"
              inputMode="numeric"
              maxLength={10}
              value={nidNumber}
              onChange={(e) => setNidNumber(e.target.value)}
              aria-invalid={!!state?.errors?.nid_number}
              className="bg-background tracking-widest font-mono"
            />
            <FieldError messages={state?.errors?.nid_number} />
          </Field>
        </div>

        {/* ── Submit ───────────────────────────────────────────────────── */}
        <div className="flex justify-end">
          <SubmitButton isDirty={isDirty} label="Save Host Profile" />
        </div>

      </FieldGroup>
    </form>
  )
}