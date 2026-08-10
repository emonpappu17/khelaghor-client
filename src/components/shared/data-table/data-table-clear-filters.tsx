"use client"

import { X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { useTableSearchParams } from "@/hooks/use-table-search-params"

interface DataTableClearFiltersProps {
  /**
   * URL param names that count as "filters" for this table — everything
   * except page/limit/sortBy/sortOrder. e.g. ["search", "role", "status"].
   * Only these get cleared; sort order and page size are left alone.
   */
  paramKeys: string[]
}

export function DataTableClearFilters({
  paramKeys,
}: DataTableClearFiltersProps) {
  const { get, setParams } = useTableSearchParams()

  const hasActiveFilters = paramKeys.some((key) => get(key) !== undefined)
  if (!hasActiveFilters) return null

  return (
    <Button
      variant="ghost"
      size="sm"
      className="h-8 px-2 lg:px-3"
      onClick={() =>
        setParams(
          Object.fromEntries(paramKeys.map((key) => [key, undefined]))
        )
      }
    >
      Clear
      <X className="ml-2 h-4 w-4" />
    </Button>
  )
}
