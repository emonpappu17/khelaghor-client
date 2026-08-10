"use client"

import { useRouter } from "next/navigation"
import {
    Ban,
    CheckCircle2,
    Loader2,
    MoreHorizontal,
    Trash2,
    Eye,
} from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"

import type { User } from "@/types/api.types"
import { deleteUserAction, updateUserStatusAction } from "@/actions/admin.actions"
import { useState, useTransition } from "react"

export function UserActionsCell({ user }: { user: User }) {
    const router = useRouter()
    const [isPending, startTransition] = useTransition()
    const [showDeleteDialog, setShowDeleteDialog] = useState(false)

    // Adjust "SUSPENDED" / "ACTIVE" to your actual UserStatus enum values.
    const isSuspended = user.status === "SUSPENDED"

    function handleStatusToggle() {
        startTransition(async () => {
            const nextStatus = isSuspended ? "ACTIVE" : "SUSPENDED"
            const result = await updateUserStatusAction(user.id, nextStatus as never)
            if (result.errors) {
                toast.error(result.errors._form?.[0] ?? "Failed to update status.")
            } else {
                toast.success(result.message)
            }
        })
    }

    function handleDelete() {
        startTransition(async () => {
            const result = await deleteUserAction(user.id)
            if (result.errors) {
                toast.error(result.errors._form?.[0] ?? "Failed to delete user.")
            } else {
                toast.success(result.message)
            }
            setShowDeleteDialog(false)
        })
    }

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0" disabled={isPending}>
                        <span className="sr-only">Open menu</span>
                        {isPending ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                            <MoreHorizontal className="h-4 w-4" />
                        )}
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuItem
                        onClick={() => router.push(`/admin/users/${user.id}`)}
                    >
                        <Eye className="mr-2 h-4 w-4" />
                        View
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleStatusToggle}>
                        {isSuspended ? (
                            <>
                                <CheckCircle2 className="mr-2 h-4 w-4" />
                                Activate
                            </>
                        ) : (
                            <>
                                <Ban className="mr-2 h-4 w-4" />
                                Suspend
                            </>
                        )}
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                        className="text-destructive focus:text-destructive"
                        onClick={() => setShowDeleteDialog(true)}
                    >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete {user.name}?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This soft-deletes the user (matches your `isDeleted` filter) —
                            they&apos;ll disappear from the active list but can be restored
                            later.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            disabled={isPending}
                            onClick={(e) => {
                                e.preventDefault()
                                handleDelete()
                            }}
                        >
                            {isPending ? "Deleting..." : "Delete"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    )
}
