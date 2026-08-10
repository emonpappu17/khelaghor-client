"use client"

import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { useTableSearchParams } from "@/hooks/use-table-search-params"
import { useEffect, useState } from "react"

interface DataTableSearchProps {
  paramKey?: string
  placeholder?: string
  debounceMs?: number
}

export function DataTableSearch({
  paramKey = "search",
  placeholder = "Search...",
  debounceMs = 400,
}: DataTableSearchProps) {
  const { get, setParams } = useTableSearchParams()
  const [value, setValue] = useState(get(paramKey) ?? "")

  useEffect(() => {
    const timeout = setTimeout(() => {
      const current = get(paramKey) ?? ""
      if (value !== current) {
        setParams({ [paramKey]: value || undefined })
      }
    }, debounceMs)
    return () => clearTimeout(timeout)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value])

  return (
    <div className="relative w-full max-w-sm">
      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
      <Input
        placeholder={placeholder}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="pl-8"
      />
    </div>
  )
}
