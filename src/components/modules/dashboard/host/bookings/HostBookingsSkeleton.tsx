import React from "react"
import { Skeleton } from "@/components/ui/skeleton"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

export function HostBookingsSkeleton() {
    return (
        <div className="space-y-6 animate-pulse">
            {/* SEARCH & FILTERS HEADER PLACEHOLDER */}
            <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
                {/* Tabs */}
                <div className="flex bg-surface-container border border-border/10 rounded-xl p-1 shrink-0 w-full md:w-auto">
                    {[1, 2, 3, 4, 5].map((idx) => (
                        <div key={idx} className="h-8 w-20 md:w-24 rounded-lg bg-surface-container-high m-0.5" />
                    ))}
                </div>

                {/* Search input */}
                <div className="w-full md:max-w-md h-10 rounded-xl bg-surface-container border border-border/10" />
            </div>

            {/* TABLE PLACEHOLDER (Desktop) */}
            <div className="hidden lg:block border border-border/10 rounded-2xl overflow-hidden bg-surface-container">
                <Table>
                    <TableHeader className="bg-surface-container-low border-b border-border/10">
                        <TableRow className="hover:bg-transparent">
                            <TableHead className="h-12"><Skeleton className="h-4 w-16 bg-surface-container-high" /></TableHead>
                            <TableHead className="h-12"><Skeleton className="h-4 w-12 bg-surface-container-high" /></TableHead>
                            <TableHead className="h-12"><Skeleton className="h-4 w-20 bg-surface-container-high" /></TableHead>
                            <TableHead className="h-12"><Skeleton className="h-4 w-20 bg-surface-container-high" /></TableHead>
                            <TableHead className="h-12"><Skeleton className="h-4 w-16 bg-surface-container-high" /></TableHead>
                            <TableHead className="h-12"><Skeleton className="h-4 w-14 bg-surface-container-high" /></TableHead>
                            <TableHead className="h-12 text-right"><Skeleton className="h-4 w-12 ml-auto bg-surface-container-high" /></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {[1, 2, 3, 4, 5].map((rowIdx) => (
                            <TableRow key={rowIdx} className="border-b border-border/10 hover:bg-transparent">
                                <TableCell className="py-3">
                                    <div className="flex items-center gap-3">
                                        <Skeleton className="size-9 rounded-xl bg-surface-container-high" />
                                        <div className="space-y-2">
                                            <Skeleton className="h-3.5 w-24 bg-surface-container-high" />
                                            <Skeleton className="h-3 w-32 bg-surface-container-high" />
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell className="py-3">
                                    <div className="space-y-2">
                                        <Skeleton className="h-3.5 w-28 bg-surface-container-high" />
                                        <Skeleton className="h-3 w-16 bg-surface-container-high" />
                                    </div>
                                </TableCell>
                                <TableCell className="py-3">
                                    <div className="space-y-2">
                                        <Skeleton className="h-3 w-20 bg-surface-container-high" />
                                        <Skeleton className="h-3 w-24 bg-surface-container-high" />
                                    </div>
                                </TableCell>
                                <TableCell className="py-3">
                                    <div className="space-y-2">
                                        <Skeleton className="h-3.5 w-16 bg-surface-container-high" />
                                        <Skeleton className="h-3 w-20 bg-surface-container-high" />
                                    </div>
                                </TableCell>
                                <TableCell className="py-3">
                                    <div className="space-y-2">
                                        <Skeleton className="h-3.5 w-14 bg-surface-container-high" />
                                        <Skeleton className="h-2.5 w-16 bg-surface-container-high" />
                                    </div>
                                </TableCell>
                                <TableCell className="py-3">
                                    <Skeleton className="h-6 w-16 rounded-lg bg-surface-container-high" />
                                </TableCell>
                                <TableCell className="py-3 text-right">
                                    <Skeleton className="h-8 w-16 rounded-xl ml-auto bg-surface-container-high" />
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            {/* CARD PLACEHOLDER (Mobile) */}
            <div className="grid gap-4 sm:grid-cols-2 lg:hidden">
                {[1, 2, 3, 4].map((idx) => (
                    <div
                        key={idx}
                        className="rounded-2xl border border-border/10 bg-surface-container p-4 space-y-4"
                    >
                        <div className="flex justify-between items-center">
                            <div className="flex items-center gap-3">
                                <Skeleton className="size-10 rounded-xl bg-surface-container-high" />
                                <div className="space-y-2">
                                    <Skeleton className="h-3 w-20 bg-surface-container-high" />
                                    <Skeleton className="h-2.5 w-28 bg-surface-container-high" />
                                </div>
                            </div>
                            <Skeleton className="h-6 w-16 rounded-lg bg-surface-container-high" />
                        </div>

                        <div className="rounded-xl bg-surface-container-low p-3 space-y-2">
                            <Skeleton className="h-3 w-1/2 bg-surface-container-high" />
                            <Skeleton className="h-3 w-1/3 bg-surface-container-high" />
                            <Skeleton className="h-3 w-2/3 bg-surface-container-high" />
                        </div>

                        <div className="flex justify-between items-center pt-2 border-t border-border/10">
                            <div className="space-y-1">
                                <Skeleton className="h-2.5 w-12 bg-surface-container-high" />
                                <Skeleton className="h-4 w-16 bg-surface-container-high" />
                            </div>
                            <div className="space-y-1 text-right">
                                <Skeleton className="h-3 w-14 bg-surface-container-high" />
                                <Skeleton className="h-3 w-16 bg-surface-container-high" />
                            </div>
                        </div>

                        <Skeleton className="h-9 w-full rounded-xl bg-surface-container-high" />
                    </div>
                ))}
            </div>
        </div>
    )
}
