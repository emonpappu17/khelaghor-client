/* eslint-disable react-hooks/set-state-in-effect */
"use client"

import { updateProfileAction } from "@/actions/profile.actions"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import type { ActionState, User } from "@/types/api.types"
import { TriangleIcon, Upload04Icon, Delete02Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { useActionState, useEffect, useRef, useState } from "react"
import { toast } from "sonner"
import { SubmitButton } from "./SubmitButton"

type ProfileFormProps = {
  user: User
}

export function ProfileForm({ user }: ProfileFormProps) {
  const [state, action] = useActionState(updateProfileAction, null)

  const [name, setName] = useState(user.name)
  const [phone, setPhone] = useState(user.phone ?? "")

  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)
  const [avatarSizeError, setAvatarSizeError] = useState<string | null>(null)

  const fileInputRef = useRef<HTMLInputElement>(null)
  const lastSuccessRef = useRef<ActionState | null>(null)

  useEffect(() => {
    setName(user.name)
    setPhone(user.phone ?? "")
  }, [user.name, user.phone])

  useEffect(() => {
    if (state?.success === true && state !== lastSuccessRef.current) {
      lastSuccessRef.current = state
      setAvatarFile(null)
      setAvatarPreview(null)
      setAvatarSizeError(null)
      if (fileInputRef.current) fileInputRef.current.value = ""
      toast.success(state.message ?? "Profile updated successfully!")
    }
  }, [state])

  useEffect(() => {
    return () => {
      if (avatarPreview) URL.revokeObjectURL(avatarPreview)
    }
  }, [avatarPreview])

  const isDirty =
    name.trim() !== user.name.trim() ||
    phone.trim() !== (user.phone ?? "").trim() ||
    avatarFile !== null

  function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > 5 * 1024 * 1024) {
      setAvatarSizeError("File must be 5 MB or smaller.")
      e.target.value = ""
      return
    }

    setAvatarSizeError(null)
    if (avatarPreview) URL.revokeObjectURL(avatarPreview)
    setAvatarFile(file)
    setAvatarPreview(URL.createObjectURL(file))
  }

  function handleRemoveAvatar() {
    if (avatarPreview) URL.revokeObjectURL(avatarPreview)
    setAvatarFile(null)
    setAvatarPreview(null)
    setAvatarSizeError(null)
    if (fileInputRef.current) fileInputRef.current.value = ""
  }

  const initials = user.name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)

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

        {/* ── Avatar banner ────────────────────────────────────────────── */}
        <div className="flex flex-col items-center gap-3 rounded-xl bg-muted/40 border border-border/30 p-6 mb-6">
          <div className="relative">
            <Avatar className="size-24 rounded-2xl  border-border/40 shadow-sm">
              <AvatarImage src={avatarPreview ?? user.avatar ?? undefined} alt={user.name} />
              <AvatarFallback className="rounded-2xl bg-primary/10 text-2xl font-bold text-primary">
                {initials}
              </AvatarFallback>
            </Avatar>
            {avatarPreview && (
              <button
                type="button"
                onClick={handleRemoveAvatar}
                className="absolute -top-2 -right-2 size-5 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center shadow-sm hover:brightness-110 transition"
                aria-label="Remove selected photo"
              >
                <HugeiconsIcon icon={Delete02Icon} strokeWidth={2.5} className="size-3" />
              </button>
            )}
          </div>

          <div className="flex flex-col items-center gap-1 text-center">
            <p className="font-semibold text-sm text-on-surface leading-tight">{user.name}</p>
            <p className="text-xs text-on-surface-variant">{user.email}</p>
          </div>

          <div className="flex flex-col items-center gap-1.5">
            <input
              ref={fileInputRef}
              type="file"
              name="avatar"
              accept="image/*"
              className="hidden"
              onChange={handleAvatarChange}
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              className="h-8 rounded-lg border-border/50 text-xs gap-1.5"
            >
              <HugeiconsIcon icon={Upload04Icon} strokeWidth={2} className="size-3.5" />
              {avatarPreview ? "Change photo" : "Upload photo"}
            </Button>
            <span className="text-[11px] text-on-surface-variant">JPG, PNG, WEBP · max 5 MB</span>
            {(avatarSizeError || state?.errors?.avatar) && (
              <p className="text-xs text-destructive">
                {avatarSizeError ?? state?.errors?.avatar?.[0]}
              </p>
            )}
          </div>
        </div>

        <Separator className="mb-6 opacity-50" />

        {/* ── Fields ───────────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <Field>
            <FieldLabel htmlFor="name">Full Name</FieldLabel>
            <Input
              id="name"
              name="name"
              type="text"
              autoComplete="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="bg-background"
            />
            <FieldError messages={state?.errors?.name} />
          </Field>

          <Field>
            <FieldLabel htmlFor="phone">Phone Number</FieldLabel>
            <Input
              id="phone"
              name="phone"
              type="tel"
              autoComplete="tel"
              placeholder="Optional"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="bg-background"
            />
            <FieldError messages={state?.errors?.phone} />
          </Field>
        </div>

        {/* ── Submit ───────────────────────────────────────────────────── */}
        <div className="flex justify-end">
          <SubmitButton isDirty={isDirty} />
        </div>

      </FieldGroup>
    </form>
  )
}