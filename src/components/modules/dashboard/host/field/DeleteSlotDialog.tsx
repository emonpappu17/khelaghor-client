"use client"

import { useTransition } from "react"
import { deleteSlotAction } from "@/actions/field.actions"
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
import { Spinner } from "@/components/ui/spinner"
import { toast } from "sonner"

type DeleteSlotDialogProps = {
    fieldId: string
    slotId: string
    slotLabel: string
    open: boolean
    onOpenChange: (open: boolean) => void
}

export function DeleteSlotDialog({ fieldId, slotId, slotLabel, open, onOpenChange }: DeleteSlotDialogProps) {
    const [isPending, startTransition] = useTransition()

    function handleDelete() {
        startTransition(async () => {
            const result = await deleteSlotAction(fieldId, slotId)
            if (result.success) {
                toast.success(result.message ?? "Slot deleted!")
                onOpenChange(false)
            } else {
                toast.error(result.errors?._form?.[0] ?? "Failed to delete slot.")
            }
        })
    }

    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Delete Slot</AlertDialogTitle>
                    <AlertDialogDescription>
                        Are you sure you want to delete the slot <strong>{slotLabel}</strong>? This action is permanent.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                        variant="destructive"
                        disabled={isPending}
                        onClick={handleDelete}
                    >
                        {isPending && <Spinner data-icon="inline-start" />}
                        {isPending ? "Deleting..." : "Delete"}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}
