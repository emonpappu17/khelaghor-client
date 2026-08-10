"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { RotateCw } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

interface DataTableRefreshButtonProps {
    onRefresh?: () => Promise<void>
}

export function DataTableRefreshButton({
    onRefresh,
}: DataTableRefreshButtonProps) {
    const router = useRouter()
    const [isPending, startTransition] = React.useTransition()

    return (
        <Button
            variant="outline"
            size="sm"
            className="h-8 px-2 lg:px-3"
            disabled={isPending}
            onClick={() =>
                startTransition(async () => {
                    if (onRefresh) {
                        await onRefresh()
                    }
                    router.refresh()
                })
            }
        >
            <RotateCw className={cn("h-4 w-4", isPending && "animate-spin")} />
            <span className="ml-2 hidden sm:inline">Refresh</span>
        </Button>
    )
}
