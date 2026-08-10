"use client"

import {
    ChevronLeft,
    ChevronRight,
    ChevronsLeft,
    ChevronsRight,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { useTableSearchParams } from "@/hooks/use-table-search-params"

interface DataTablePaginationProps {
    totalCount: number
    pageCount: number
    pageSizeOptions?: number[]
}

export function DataTablePagination({
    totalCount,
    pageCount,
    pageSizeOptions = [10, 20, 30, 50],
}: DataTablePaginationProps) {
    const { page, limit, setParams, isPending } = useTableSearchParams()

    return (
        <div className="flex flex-col-reverse items-center justify-between gap-4 px-2 sm:flex-row">
            <div className="text-sm text-muted-foreground">
                {totalCount} row{totalCount === 1 ? "" : "s"} total
            </div>
            <div className="flex items-center space-x-6 lg:space-x-8">
                <div className="flex items-center space-x-2">
                    <p className="text-sm font-medium">Rows per page</p>
                    <Select
                        value={String(limit)}
                        onValueChange={(value) => setParams({ limit: value, page: 1 })}
                    >
                        <SelectTrigger className="h-8 w-17.5">
                            <SelectValue placeholder={limit} />
                        </SelectTrigger>
                        <SelectContent side="top">
                            {pageSizeOptions.map((size) => (
                                <SelectItem key={size} value={String(size)}>
                                    {size}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <div className="flex w-27.5 items-center justify-center text-sm font-medium">
                    Page {page} of {Math.max(pageCount, 1)}
                </div>
                <div className="flex items-center space-x-2">
                    <Button
                        variant="outline"
                        size="icon"
                        className="hidden h-8 w-8 lg:flex"
                        disabled={page <= 1 || isPending}
                        onClick={() => setParams({ page: 1 })}
                    >
                        <ChevronsLeft className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        disabled={page <= 1 || isPending}
                        onClick={() => setParams({ page: page - 1 })}
                    >
                        <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        disabled={page >= pageCount || isPending}
                        onClick={() => setParams({ page: page + 1 })}
                    >
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="outline"
                        size="icon"
                        className="hidden h-8 w-8 lg:flex"
                        disabled={page >= pageCount || isPending}
                        onClick={() => setParams({ page: pageCount })}
                    >
                        <ChevronsRight className="h-4 w-4" />
                    </Button>
                </div>
            </div>
        </div>
    )
}
