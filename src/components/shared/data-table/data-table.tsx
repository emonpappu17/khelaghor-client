"use client"

import {
    OnChangeFn,
    useTable,
    type ColumnDef,
    type ColumnVisibilityState,
    type RowData,
    type RowSelectionState,
} from "@tanstack/react-table"

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

import { features, type DataTableFeatures } from "./data-table-features"
import { DataTablePagination } from "./data-table-pagination"
import { useState } from "react"

interface DataTableProps<TData extends RowData> {
    columns: ColumnDef<DataTableFeatures, TData>[]
    data: TData[]
    /** total rows matching the current filters, from your API's `meta.total` */
    totalCount: number
    /** ceil(totalCount / limit) — pass 1 when there's no data */
    pageCount: number
    getRowId?: (row: TData) => string
    rowSelection?: RowSelectionState
    onRowSelectionChange?: OnChangeFn<RowSelectionState>
    // onRowSelectionChange?: (state: RowSelectionState) => void
    emptyMessage?: string
    /** hide the built-in pagination footer if you're rendering your own */
    hidePagination?: boolean
}

export function DataTable<TData extends RowData>({
    columns,
    data,
    totalCount,
    pageCount,
    getRowId,
    rowSelection,
    onRowSelectionChange,
    emptyMessage = "No results.",
    hidePagination,
}: DataTableProps<TData>) {
    const [columnVisibility, setColumnVisibility] =
        useState<ColumnVisibilityState>({})
    const [internalSelection, setInternalSelection] =
        useState<RowSelectionState>({})

    const selection = rowSelection ?? internalSelection
    const setSelection = onRowSelectionChange ?? setInternalSelection

    const table = useTable({
        features,
        data,
        columns,
        getRowId: getRowId as ((row: TData) => string) | undefined,
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setSelection,
        state: {
            columnVisibility,
            rowSelection: selection,
        },
    })

    return (
        <div className="space-y-4">
            <div className="overflow-hidden rounded-md border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <TableHead key={header.id}>
                                        {header.isPlaceholder ? null : (
                                            <table.FlexRender header={header} />
                                        )}
                                    </TableHead>
                                ))}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={row.getIsSelected() && "selected"}
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            <table.FlexRender cell={cell} />
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell
                                    colSpan={columns.length}
                                    className="h-24 text-center text-muted-foreground"
                                >
                                    {emptyMessage}
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            {!hidePagination && (
                <DataTablePagination totalCount={totalCount} pageCount={pageCount} />
            )}
        </div>
    )
}
