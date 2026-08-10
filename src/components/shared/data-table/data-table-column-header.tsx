"use client"

import { ArrowDown, ArrowUp, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { useTableSearchParams } from "@/hooks/use-table-search-params"

interface DataTableColumnHeaderProps {
    title: string
    /** the API field name this column sorts by, e.g. "createdAt". Omit for non-sortable columns. */
    sortKey?: string
    className?: string
}

export function DataTableColumnHeader({
    title,
    sortKey,
    className,
}: DataTableColumnHeaderProps) {
    const { sortBy, sortOrder, setParams } = useTableSearchParams()

    if (!sortKey) {
        return <div className={cn(className)}>{title}</div>
    }

    const isActive = sortBy === sortKey
    const nextOrder = isActive && sortOrder === "asc" ? "desc" : "asc"

    return (
        <Button
            variant="ghost"
            size="sm"
            className={cn("-ml-3 h-8", className)}
            onClick={() => setParams({ sortBy: sortKey, sortOrder: nextOrder })}
        >
            {title}
            {isActive && sortOrder === "asc" ? (
                <ArrowUp className="ml-2 h-4 w-4" />
            ) : isActive && sortOrder === "desc" ? (
                <ArrowDown className="ml-2 h-4 w-4" />
            ) : (
                <ChevronsUpDown className="ml-2 h-4 w-4 text-muted-foreground/50" />
            )}
        </Button>
    )
}
