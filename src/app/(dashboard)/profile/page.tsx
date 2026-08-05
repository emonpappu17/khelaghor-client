import { HostProfileSection } from "@/components/modules/profile/HostProfileSection"
import { ProfileForm } from "@/components/modules/profile/ProfileForm"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { getCurrentUser } from "@/queries/user.queries"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Profile | Khelaghor Dashboard",
  description: "View and edit your Khelaghor profile.",
}

export default async function ProfilePage() {
  const currentUser = await getCurrentUser()
  const user = currentUser?.data

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[40vh] gap-3 text-center">
        <p className="font-headline text-lg font-bold text-on-surface">Unable to load profile</p>
        <p className="text-sm text-on-surface-variant">Please refresh the page or try again later.</p>
      </div>
    )
  }

  const memberSince = new Date(user.createdAt).toLocaleDateString(undefined, {
    day: "numeric",
    month: "long",
    year: "numeric",
  })

  return (
    <div className="space-y-6">

      {/* ── Page heading ──────────────────────────────────────────────── */}
      <div>
        <h1 className="font-headline text-2xl font-bold text-on-surface">My Profile</h1>
        <p className="mt-0.5 text-sm text-on-surface-variant">
          Manage your personal information and account settings.
        </p>
      </div>

      {/* ── Two-column layout ─────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">

        {/* ══ LEFT — editable forms ════════════════════════════════════ */}
        <div className="space-y-6">

          {/* Personal information */}
          <Card className="rounded-2xl border-border/40 bg-card/60 backdrop-blur-md overflow-hidden">
            <CardHeader className="pb-4">
              <CardTitle className="font-headline text-base font-black">Personal Information</CardTitle>
              <CardDescription className="text-xs">
                Update your name, phone number, and profile photo.
              </CardDescription>
            </CardHeader>
            <Separator className="opacity-40" />
            <CardContent className="pt-5">
              <ProfileForm user={user} />
            </CardContent>
          </Card>

          {/* Host profile (HOST only) */}
          {user.role === "HOST" && user.hostProfile && (
            <HostProfileSection hostProfile={user.hostProfile} userId={user.id} />
          )}

        </div>

        {/* ══ RIGHT — read-only profile detail ════════════════════════ */}
        <div className="space-y-6 lg:sticky lg:top-6">

          {/* Identity summary */}
          <Card className="rounded-2xl border-border/40 bg-card/60 backdrop-blur-md overflow-hidden">
            <CardHeader className="pb-4">
              <CardTitle className="font-headline text-base font-black">Account Overview</CardTitle>
              <CardDescription className="text-xs">Your account information at a glance.</CardDescription>
            </CardHeader>
            <Separator className="opacity-40" />
            <CardContent className="pt-5 space-y-4">

              {/* Name + role + status badges */}
              <div className="space-y-1.5">
                <p className="font-headline font-black text-lg text-on-surface leading-tight">
                  {user.name}
                </p>
                <p className="text-sm text-on-surface-variant">{user.email}</p>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  <Badge className="bg-primary/10 text-primary border border-primary/20 font-bold uppercase tracking-wider text-[10px] rounded-full">
                    {user.role}
                  </Badge>
                  {user.isVerified ? (
                    <Badge className="bg-blue-500/15 text-blue-700 border border-blue-500/20 font-semibold text-[10px] rounded-full">
                      Verified
                    </Badge>
                  ) : (
                    <Badge className="bg-amber-500/15 text-amber-700 border border-amber-500/20 font-semibold text-[10px] rounded-full">
                      Unverified
                    </Badge>
                  )}
                  <Badge className="bg-green-500/15 text-green-700 border border-green-500/20 font-semibold text-[10px] rounded-full capitalize">
                    {user.status.toLowerCase()}
                  </Badge>
                </div>
              </div>

              <Separator className="opacity-40" />

              {/* Detail rows */}
              <dl className="space-y-3">
                {[
                  { label: "Phone", value: user.phone ?? "Not set" },
                  { label: "Member Since", value: memberSince },
                  { label: "Account ID", value: user.id },
                ].map(({ label, value }) => (
                  <div key={label} className="flex items-start justify-between gap-4">
                    <dt className="text-xs font-semibold uppercase tracking-widest text-on-surface-variant shrink-0">
                      {label}
                    </dt>
                    <dd className="text-xs font-medium text-on-surface text-right truncate max-w-[60%]">
                      {value}
                    </dd>
                  </div>
                ))}
              </dl>

            </CardContent>
          </Card>

          {/* Host profile detail (HOST only, read-only snapshot) */}
          {user.role === "HOST" && user.hostProfile && (
            <Card className="rounded-2xl border-border/40 bg-card/60 backdrop-blur-md overflow-hidden">
              <CardHeader className="pb-4">
                <CardTitle className="font-headline text-base font-black">Host Details</CardTitle>
                <CardDescription className="text-xs">Your host account information.</CardDescription>
              </CardHeader>
              <Separator className="opacity-40" />
              <CardContent className="pt-5 space-y-4">

                <div className="flex flex-wrap gap-1.5">
                  {user.hostProfile.isApproved ? (
                    <Badge className="bg-green-500/15 text-green-700 border border-green-500/20 font-semibold text-[10px] rounded-full">
                      Approved Host
                    </Badge>
                  ) : (
                    <Badge className="bg-amber-500/15 text-amber-700 border border-amber-500/20 font-semibold text-[10px] rounded-full">
                      Pending Approval
                    </Badge>
                  )}
                </div>

                <Separator className="opacity-40" />

                <dl className="space-y-3">
                  {[
                    { label: "Business Name", value: user.hostProfile.businessName },
                    { label: "NID Number", value: user.hostProfile.nidNumber ?? "Not set" },
                    ...(user.hostProfile.approvedAt
                      ? [{
                        label: "Approved On",
                        value: new Date(user.hostProfile.approvedAt).toLocaleDateString(undefined, {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        }),
                      }]
                      : []),
                  ].map(({ label, value }) => (
                    <div key={label} className="flex items-start justify-between gap-4">
                      <dt className="text-xs font-semibold uppercase tracking-widest text-on-surface-variant shrink-0">
                        {label}
                      </dt>
                      <dd className="text-xs font-medium text-on-surface text-right truncate max-w-[60%]">
                        {value}
                      </dd>
                    </div>
                  ))}
                </dl>

              </CardContent>
            </Card>
          )}

        </div>
      </div>
    </div>
  )
}