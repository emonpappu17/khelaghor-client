"use client"

import { useState, useTransition } from "react"
import { useRouter, usePathname } from "next/navigation"
import { approveHostAction } from "@/actions/host.actions"
import type { HostWithUser } from "@/queries/host.queries"
import type { PaginationMeta } from "@/types/api.types"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Spinner } from "@/components/ui/spinner"
import { toast } from "sonner"
import {
    Search,
    Eye,
    Check,
    ChevronLeft,
    ChevronRight,
    Building2,
    User,
    FileText,
    Calendar,
    X,
} from "lucide-react"

type AdminHostsContentProps = {
    initialHosts: HostWithUser[]
    meta: PaginationMeta
    currentPage: number
    currentTab: string
    searchQuery: string
}

export function AdminHostsContent({
    initialHosts,
    meta,
    currentPage,
    currentTab,
    searchQuery,
}: AdminHostsContentProps) {
    const router = useRouter()
    const pathname = usePathname()
    const [search, setSearch] = useState(searchQuery)
    const [selectedHost, setSelectedHost] = useState<HostWithUser | null>(null)
    const [detailsOpen, setDetailsOpen] = useState(false)
    const [isPending, startTransition] = useTransition()

    // Client-side filtering in combination with server-side queries
    const filteredHosts = initialHosts.filter((host) => {
        if (!searchQuery) return true
        const q = searchQuery.toLowerCase()
        return (
            host.businessName?.toLowerCase().includes(q) ||
            host.nidNumber?.toLowerCase().includes(q) ||
            host.user.name?.toLowerCase().includes(q) ||
            host.user.email?.toLowerCase().includes(q) ||
            (host.user.phone && host.user.phone.toLowerCase().includes(q))
        )
    })

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        const params = new URLSearchParams(window.location.search)
        if (search.trim()) {
            params.set("q", search.trim())
        } else {
            params.delete("q")
        }
        params.set("page", "1")
        router.push(`${pathname}?${params.toString()}`)
    }

    const handleClearSearch = () => {
        setSearch("")
        const params = new URLSearchParams(window.location.search)
        params.delete("q")
        params.set("page", "1")
        router.push(`${pathname}?${params.toString()}`)
    }

    const handleTabChange = (tab: string) => {
        const params = new URLSearchParams(window.location.search)
        if (tab === "all") {
            params.delete("isApproved")
        } else {
            params.set("isApproved", tab)
        }
        params.set("page", "1")
        router.push(`${pathname}?${params.toString()}`)
    }

    const handlePageChange = (newPage: number) => {
        const params = new URLSearchParams(window.location.search)
        params.set("page", String(newPage))
        router.push(`${pathname}?${params.toString()}`)
    }

    const handleApproveHost = (hostId: string, businessName: string) => {
        startTransition(async () => {
            const res = await approveHostAction(hostId)
            if (res.success) {
                toast.success(res.message ?? `Approved ${businessName}!`)
                setDetailsOpen(false)
            } else {
                toast.error(res.errors?._form?.[0] ?? "Failed to approve host.")
            }
        })
    }

    const totalPages = Math.ceil(meta.total / meta.limit)

    return (
        <div className="space-y-6">
            {/* SEARCH & FILTERS HEADER */}
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
                {/* Custom Tabs */}
                <div className="flex bg-surface-container border border-border/30 rounded-xl p-1 shrink-0">
                    <button
                        id="tab-all"
                        onClick={() => handleTabChange("all")}
                        className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                            currentTab === "all"
                                ? "bg-primary text-primary-foreground shadow-sm"
                                : "text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high"
                        }`}
                    >
                        All Hosts
                    </button>
                    <button
                        id="tab-pending"
                        onClick={() => handleTabChange("false")}
                        className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                            currentTab === "false"
                                ? "bg-primary text-primary-foreground shadow-sm"
                                : "text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high"
                        }`}
                    >
                        Pending Review
                    </button>
                    <button
                        id="tab-approved"
                        onClick={() => handleTabChange("true")}
                        className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                            currentTab === "true"
                                ? "bg-primary text-primary-foreground shadow-sm"
                                : "text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high"
                        }`}
                    >
                        Approved
                    </button>
                </div>

                {/* Search input form */}
                <form onSubmit={handleSearchSubmit} className="relative w-full sm:max-w-md flex gap-2">
                    <div className="relative flex-1">
                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-on-surface-variant/60" />
                        <Input
                            id="host-search-input"
                            placeholder="Search by business, name, email..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="pl-10 pr-10 w-full rounded-xl bg-surface-container border-border/40 focus:border-primary/50 text-sm h-10"
                        />
                        {search && (
                            <button
                                type="button"
                                onClick={handleClearSearch}
                                className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 rounded-full hover:bg-surface-container-high text-on-surface-variant"
                            >
                                <X className="size-3.5" />
                            </button>
                        )}
                    </div>
                    <Button type="submit" variant="secondary" className="rounded-xl h-10 px-4 font-bold text-xs">
                        Search
                    </Button>
                </form>
            </div>

            {/* HOSTS LIST TABLE */}
            <div className="rounded-2xl border border-border/40 overflow-hidden bg-card/40 backdrop-blur-md shadow-xl">
                <Table>
                    <TableHeader className="bg-surface-container-low border-b border-border/30">
                        <TableRow className="hover:bg-transparent">
                            <TableHead className="font-bold text-xs uppercase tracking-wider py-4 text-on-surface-variant/80">User / Applicant</TableHead>
                            <TableHead className="font-bold text-xs uppercase tracking-wider py-4 text-on-surface-variant/80">Business Name</TableHead>
                            <TableHead className="font-bold text-xs uppercase tracking-wider py-4 text-on-surface-variant/80">NID Number</TableHead>
                            <TableHead className="font-bold text-xs uppercase tracking-wider py-4 text-on-surface-variant/80">Status</TableHead>
                            <TableHead className="font-bold text-xs uppercase tracking-wider py-4 text-on-surface-variant/80">Date Approved</TableHead>
                            <TableHead className="text-right font-bold text-xs uppercase tracking-wider py-4 text-on-surface-variant/80 pr-6">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredHosts.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="h-64 text-center">
                                    <div className="flex flex-col items-center justify-center gap-3">
                                        <div className="p-4 rounded-2xl bg-surface-container border border-border/20 text-on-surface-variant/40">
                                            <Building2 className="size-8" />
                                        </div>
                                        <p className="font-bold text-sm text-on-surface">No host applications found</p>
                                        <p className="text-xs text-on-surface-variant">
                                            Try adjusting your filters or search criteria.
                                        </p>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredHosts.map((host) => {
                                const initials = host.user.name
                                    ?.split(" ")
                                    .map((w) => w[0])
                                    .join("")
                                    .slice(0, 2)
                                    .toUpperCase() || "H"

                                return (
                                    <TableRow key={host.id} className="hover:bg-surface-container/30 transition-colors border-b border-border/20 last:border-0">
                                        <TableCell className="py-4">
                                            <div className="flex items-center gap-3">
                                                <Avatar className="h-9 w-9 rounded-xl border border-border/30">
                                                    <AvatarImage src={host.user.avatar || undefined} alt={host.user.name} />
                                                    <AvatarFallback className="rounded-xl text-xs font-bold bg-primary/10 text-primary">
                                                        {initials}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div className="grid leading-tight">
                                                    <span className="font-bold text-sm text-on-surface">{host.user.name}</span>
                                                    <span className="text-[11px] text-on-surface-variant font-medium">{host.user.email}</span>
                                                    {host.user.phone && (
                                                        <span className="text-[10px] text-on-surface-variant/70 mt-0.5">{host.user.phone}</span>
                                                    )}
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell className="py-4 font-bold text-sm text-on-surface">
                                            {host.businessName}
                                        </TableCell>
                                        <TableCell className="py-4 font-mono text-xs text-on-surface-variant font-semibold">
                                            {host.nidNumber || "—"}
                                        </TableCell>
                                        <TableCell className="py-4">
                                            {host.isApproved ? (
                                                <Badge className="bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 dark:text-emerald-400 font-bold uppercase tracking-wider text-[10px] rounded-full px-2.5">
                                                    Approved
                                                </Badge>
                                            ) : (
                                                <Badge className="bg-amber-500/10 text-amber-600 border border-amber-500/20 dark:text-amber-400 font-bold uppercase tracking-wider text-[10px] rounded-full px-2.5">
                                                    Pending Approval
                                                </Badge>
                                            )}
                                        </TableCell>
                                        <TableCell className="py-4 text-xs text-on-surface-variant font-medium">
                                            {host.approvedAt ? (
                                                new Date(host.approvedAt).toLocaleDateString(undefined, {
                                                    day: "numeric",
                                                    month: "short",
                                                    year: "numeric",
                                                })
                                            ) : (
                                                <span className="text-on-surface-variant/40">—</span>
                                            )}
                                        </TableCell>
                                        <TableCell className="py-4 text-right pr-6">
                                            <div className="flex items-center justify-end gap-2">
                                                <Button
                                                    id={`view-details-${host.id}`}
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => {
                                                        setSelectedHost(host)
                                                        setDetailsOpen(true)
                                                    }}
                                                    className="size-8 p-0 rounded-lg border-border/40 bg-transparent hover:bg-primary/10 hover:text-primary transition-all"
                                                >
                                                    <Eye className="size-4 text-primary" />
                                                </Button>

                                                {!host.isApproved && (
                                                    <Button
                                                        id={`approve-host-${host.id}`}
                                                        size="sm"
                                                        disabled={isPending}
                                                        onClick={() => handleApproveHost(host.id, host.businessName)}
                                                        className="h-8 rounded-lg bg-primary hover:bg-primary-dim text-primary-foreground text-xs font-bold px-3 transition-all flex items-center gap-1"
                                                    >
                                                        <Check className="size-3.5" />
                                                        Approve
                                                    </Button>
                                                )}
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                )
                            })
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* PAGINATION CONTROLS */}
            {totalPages > 1 && (
                <div className="flex items-center justify-between py-2 px-1">
                    <span className="text-xs font-semibold text-on-surface-variant">
                        Showing Page {currentPage} of {totalPages} ({meta.total} total hosts)
                    </span>
                    <div className="flex gap-2">
                        <Button
                            id="pagination-prev"
                            variant="outline"
                            size="sm"
                            disabled={currentPage <= 1}
                            onClick={() => handlePageChange(currentPage - 1)}
                            className="rounded-xl border-border/40 h-9 font-bold text-xs"
                        >
                            <ChevronLeft className="size-4 mr-1" />
                            Previous
                        </Button>
                        <Button
                            id="pagination-next"
                            variant="outline"
                            size="sm"
                            disabled={currentPage >= totalPages}
                            onClick={() => handlePageChange(currentPage + 1)}
                            className="rounded-xl border-border/40 h-9 font-bold text-xs"
                        >
                            Next
                            <ChevronRight className="size-4 ml-1" />
                        </Button>
                    </div>
                </div>
            )}

            {/* DETAILS DIALOG */}
            <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
                <DialogContent className="sm:max-w-xl rounded-2xl border-border/40 bg-card">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2 text-xl font-bold tracking-tight">
                            <Building2 className="size-5 text-primary" />
                            Host Application Profile
                        </DialogTitle>
                        <DialogDescription>
                            Review full credentials and associated details for this applicant.
                        </DialogDescription>
                    </DialogHeader>

                    {selectedHost && (
                        <div className="grid gap-5 py-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* Applicant Detail Card */}
                                <div className="rounded-xl border border-border/20 p-4 bg-surface-container/20 space-y-3">
                                    <div className="flex items-center gap-1.5 border-b border-border/20 pb-2 mb-2">
                                        <User className="size-4 text-primary" />
                                        <span className="text-xs font-black uppercase tracking-widest text-on-surface-variant">
                                            Applicant Info
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <Avatar className="h-12 w-12 rounded-xl">
                                            <AvatarImage src={selectedHost.user.avatar || undefined} alt={selectedHost.user.name} />
                                            <AvatarFallback className="text-sm font-bold bg-primary/10 text-primary">
                                                {selectedHost.user.name
                                                    ?.split(" ")
                                                    .map((w) => w[0])
                                                    .join("")
                                                    .toUpperCase()
                                                    .slice(0, 2)}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <h4 className="font-bold text-sm text-on-surface">{selectedHost.user.name}</h4>
                                            <p className="text-xs text-on-surface-variant">{selectedHost.user.email}</p>
                                        </div>
                                    </div>
                                    <div className="text-xs space-y-1.5 pt-2">
                                        <p className="flex justify-between">
                                            <span className="text-on-surface-variant font-semibold">Phone:</span>
                                            <span className="font-bold text-on-surface">{selectedHost.user.phone || "—"}</span>
                                        </p>
                                        <p className="flex justify-between">
                                            <span className="text-on-surface-variant font-semibold">Account Status:</span>
                                            <span className="font-bold text-on-surface">{selectedHost.user.status}</span>
                                        </p>
                                    </div>
                                </div>

                                {/* Business Credential Card */}
                                <div className="rounded-xl border border-border/20 p-4 bg-surface-container/20 space-y-3">
                                    <div className="flex items-center gap-1.5 border-b border-border/20 pb-2 mb-2">
                                        <FileText className="size-4 text-primary" />
                                        <span className="text-xs font-black uppercase tracking-widest text-on-surface-variant">
                                            Business Profile
                                        </span>
                                    </div>
                                    <div className="text-xs space-y-2">
                                        <div>
                                            <span className="text-on-surface-variant font-semibold block mb-0.5">Business name:</span>
                                            <span className="font-bold text-sm text-on-surface">{selectedHost.businessName}</span>
                                        </div>
                                        <div>
                                            <span className="text-on-surface-variant font-semibold block mb-0.5">NID Number:</span>
                                            <span className="font-mono font-bold text-on-surface">{selectedHost.nidNumber || "—"}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Approval Info / Action Banner */}
                            <div className="rounded-xl border border-border/20 p-4 bg-surface-container/25 space-y-2">
                                <div className="flex items-center gap-1.5 border-b border-border/20 pb-2 mb-1">
                                    <Calendar className="size-4 text-primary" />
                                    <span className="text-xs font-black uppercase tracking-widest text-on-surface-variant">
                                        Verification Status
                                    </span>
                                </div>
                                <div className="flex justify-between items-center pt-1 text-xs">
                                    <div>
                                        <p className="font-semibold text-on-surface-variant">
                                            Approval status:
                                        </p>
                                        <p className="font-bold text-on-surface mt-0.5">
                                            {selectedHost.isApproved ? "Verification Complete" : "Pending Review"}
                                        </p>
                                    </div>
                                    {selectedHost.isApproved ? (
                                        <div className="text-right">
                                            <p className="font-semibold text-on-surface-variant">Approved on:</p>
                                            <p className="font-bold text-on-surface mt-0.5">
                                                {new Date(selectedHost.approvedAt!).toLocaleDateString(undefined, {
                                                    day: "numeric",
                                                    month: "long",
                                                    year: "numeric",
                                                })}
                                            </p>
                                        </div>
                                    ) : (
                                        <Badge className="bg-amber-500/10 text-amber-600 border border-amber-500/20 font-bold uppercase tracking-wider text-[9px] rounded-full">
                                            Action Needed
                                        </Badge>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    <DialogFooter className="gap-2">
                        <Button
                            id="close-details-dialog"
                            variant="outline"
                            onClick={() => setDetailsOpen(false)}
                            className="rounded-xl border-border/40"
                        >
                            Close
                        </Button>
                        {selectedHost && !selectedHost.isApproved && (
                            <Button
                                id="approve-host-dialog"
                                disabled={isPending}
                                onClick={() => handleApproveHost(selectedHost.id, selectedHost.businessName)}
                                className="rounded-xl bg-primary hover:bg-primary-dim text-primary-foreground font-bold flex items-center gap-1"
                            >
                                {isPending ? <Spinner data-icon="inline-start" /> : <Check className="size-4" />}
                                {isPending ? "Approving..." : "Approve Profile"}
                            </Button>
                        )}
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
