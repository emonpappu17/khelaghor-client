"use client"

import { deleteAccountAction } from "@/actions/profile.actions"
import { ChangePasswordForm } from "@/components/modules/profile/ChangePasswordForm"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { HugeiconsIcon } from "@hugeicons/react"
import { Alert02Icon } from "@hugeicons/core-free-icons"
import { useTransition } from "react"
import { toast } from "sonner"

export default function SettingsPage() {
  const [isPending, startTransition] = useTransition()

  const handleDeleteAccount = () => {
    startTransition(async () => {
      const res = await deleteAccountAction()
      if (res.errors) {
        toast.error(res.errors._form?.[0] ?? "Failed to delete account.")
      }
    })
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-headline text-3xl font-bold text-on-surface">Settings</h1>
        <p className="mt-1 text-on-surface-variant">
          Configure your account preferences, notifications, and security settings.
        </p>
      </div>

      {/* Change Password */}
      <Card className="rounded-2xl border-border/40 bg-card/40 backdrop-blur-md">
        <CardHeader>
          <CardTitle className="font-headline text-xl font-black">Change Password</CardTitle>
          <CardDescription>
            Update your password. You will need your current password to set a new one.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ChangePasswordForm />
        </CardContent>
      </Card>

      {/* Delete Account */}
      <Card className="rounded-2xl border-border/40  bg-card/40 backdrop-blur-md">
        <CardHeader>
          <div className="flex items-center gap-2">
            <HugeiconsIcon icon={Alert02Icon} strokeWidth={2} className="size-5 text-destructive" />
            <CardTitle className="font-headline text-xl font-black text-destructive">Danger Zone</CardTitle>
          </div>
          <CardDescription>
            Permanently delete your account and all associated data. This action cannot be undone.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="destructive"
                className="font-headline font-black uppercase tracking-widest"
              >
                Delete Account
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="rounded-2xl border-border/40 bg-card">
              <AlertDialogHeader>
                <AlertDialogTitle className="font-headline text-xl font-black">
                  Are you absolutely sure?
                </AlertDialogTitle>
                <AlertDialogDescription>
                  This action permanently deletes your account and all associated data.
                  You will be logged out and will not be able to recover your account.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel className="rounded-xl border-border/40">Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDeleteAccount}
                  disabled={isPending}
                  className="rounded-xl bg-destructive text-destructive-foreground hover:bg-destructive/90 font-bold"
                >
                  {isPending ? "Deleting..." : "Yes, Delete My Account"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardContent>
      </Card>
    </div>
  )
}
