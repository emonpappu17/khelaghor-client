"use client"
import { useRouter } from "next/navigation"
import { RotateCw } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { useState } from "react"

interface DataTableRefreshButtonProps {
    onRefresh?: () => Promise<void>
}

export function DataTableRefreshButton({
    onRefresh,
}: DataTableRefreshButtonProps) {
    const router = useRouter()
    const [isRefreshing, setIsRefreshing] = useState(false)

    async function handleRefresh() {
        if (isRefreshing) return
        setIsRefreshing(true)
        try {
            if (onRefresh) await onRefresh()
        } catch (error) {
            console.error("refreshUsersAction failed:", error)
        } finally {
            router.refresh()
            setTimeout(() => setIsRefreshing(false), 500) 
        }
    }

    return (
        <Button
            variant="outline"
            size="sm"
            className="h-8 px-2 lg:px-3"
            disabled={isRefreshing}
            onClick={handleRefresh}
        >
            <RotateCw className={cn("h-4 w-4", isRefreshing && "animate-spin")} />
            <span className="ml-2 hidden sm:inline">Refresh</span>
        </Button>
    )
}