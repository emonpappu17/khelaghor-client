"use client"

import { useState, useTransition } from "react"
import { deleteFieldAction } from "@/actions/field.actions"
import { Button } from "@/components/ui/button"
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

type DeleteFieldDialogProps = {
    fieldId: string
    fieldName: string
    open: boolean
    onOpenChange: (open: boolean) => void
}

export function DeleteFieldDialog({ fieldId, fieldName, open, onOpenChange }: DeleteFieldDialogProps) {
    const [isPending, startTransition] = useTransition()

    function handleDelete() {
        startTransition(async () => {
            const result = await deleteFieldAction(fieldId)
            if (result.success) {
                toast.success(result.message ?? "Field deleted!")
                onOpenChange(false)
            } else {
                toast.error(result.errors?._form?.[0] ?? "Failed to delete field.")
            }
        })
    }

    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Delete Field</AlertDialogTitle>
                    <AlertDialogDescription>
                        Are you sure you want to delete <strong>{fieldName}</strong>? This will set the field as inactive. This action cannot be easily undone.
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
