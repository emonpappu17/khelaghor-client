"use client"

import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { LayoutGridIcon, ListIcon, SearchIcon, RotateCcwIcon } from "lucide-react"
import { useEffect, useState, useTransition } from "react"
import { cn } from "@/lib/utils"

const SPORT_TYPES = [
    { label: "All Sports", value: "ALL" },
    { label: "Football", value: "FOOTBALL" },
    { label: "Cricket", value: "CRICKET" },
    { label: "Badminton", value: "BADMINTON" },
    { label: "Basketball", value: "BASKETBALL" },
    { label: "Tennis", value: "TENNIS" },
]

const DIVISIONS = [
    { label: "All Divisions", value: "ALL" },
    { label: "Dhaka", value: "Dhaka" },
    { label: "Chattogram", value: "Chattogram" },
    { label: "Sylhet", value: "Sylhet" },
    { label: "Khulna", value: "Khulna" },
    { label: "Barisal", value: "Barisal" },
    { label: "Rajshahi", value: "Rajshahi" },
    { label: "Rangpur", value: "Rangpur" },
    { label: "Mymensingh", value: "Mymensingh" },
]

export function FieldsFilterControls() {
    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()
    const [isPending, startTransition] = useTransition()

    const currentSport = searchParams.get("sportType") || "ALL"
    const currentDivision = searchParams.get("division") || "ALL"
    const currentLayout = searchParams.get("layout") || "grid"
    const [searchTerm, setSearchTerm] = useState(searchParams.get("searchTerm") || "")

    // Debounced search updates
    useEffect(() => {
        const urlSearchTerm = searchParams.get("searchTerm") || ""
        if (searchTerm === urlSearchTerm) {
            return
        }

        const handler = setTimeout(() => {
            const params = new URLSearchParams(searchParams.toString())
            if (searchTerm) {
                params.set("searchTerm", searchTerm)
            } else {
                params.delete("searchTerm")
            }
            params.set("page", "1")
            startTransition(() => {
                router.push(`${pathname}?${params.toString()}`)
            })
        }, 400)

        return () => clearTimeout(handler)
    }, [searchTerm, router, pathname, searchParams])

    const handleSelectChange = (key: string, value: string) => {
        const params = new URLSearchParams(searchParams.toString())
        if (value && value !== "ALL") {
            params.set(key, value)
        } else {
            params.delete(key)
        }
        params.set("page", "1")
        router.push(`${pathname}?${params.toString()}`)
    }

    const toggleLayout = (layoutType: "grid" | "list") => {
        const params = new URLSearchParams(searchParams.toString())
        params.set("layout", layoutType)
        router.push(`${pathname}?${params.toString()}`)
    }

    const handleReset = () => {
        setSearchTerm("")
        const params = new URLSearchParams()
        params.set("layout", currentLayout)
        router.push(`${pathname}?${params.toString()}`)
    }

    const hasActiveFilters =
        searchParams.has("sportType") ||
        searchParams.has("division") ||
        searchParams.has("searchTerm")

    return (
        <div className="w-full flex flex-col gap-4 bg-surface-container rounded-xl p-6 border border-white/5 shadow-lg">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                {/* Search Term input */}
                <div className="md:col-span-5 relative">
                    <SearchIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-on-surface-variant" />
                    <Input
                        type="text"
                        placeholder="Search venues by name or facilities..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 bg-background border-white/5 focus-visible:ring-primary-container focus-visible:border-primary-container"
                    />
                </div>

                {/* Sport Type select */}
                <div className="md:col-span-3">
                    <Select
                        value={currentSport}
                        onValueChange={(val) => handleSelectChange("sportType", val)}
                    >
                        <SelectTrigger className="bg-background border-white/5 text-on-surface">
                            <SelectValue placeholder="Filter by Sport" />
                        </SelectTrigger>
                        <SelectContent className="bg-surface-container border-white/10 text-on-surface">
                            {SPORT_TYPES.map((type) => (
                                <SelectItem key={type.value} value={type.value}>
                                    {type.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {/* Division select */}
                <div className="md:col-span-2">
                    <Select
                        value={currentDivision}
                        onValueChange={(val) => handleSelectChange("division", val)}
                    >
                        <SelectTrigger className="bg-background border-white/5 text-on-surface">
                            <SelectValue placeholder="Filter by Division" />
                        </SelectTrigger>
                        <SelectContent className="bg-surface-container border-white/10 text-on-surface">
                            {DIVISIONS.map((div) => (
                                <SelectItem key={div.value} value={div.value}>
                                    {div.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {/* Actions & Layout Switcher */}
                <div className="md:col-span-2 flex items-center justify-between gap-3">
                    <div className="flex border border-white/5 bg-background rounded-lg p-1">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => toggleLayout("grid")}
                            className={cn(
                                "h-8 w-8 rounded-md transition-colors",
                                currentLayout === "grid"
                                    ? "bg-primary-container text-on-primary-container font-bold"
                                    : "text-on-surface-variant hover:text-white"
                            )}
                            aria-label="Grid View"
                        >
                            <LayoutGridIcon className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => toggleLayout("list")}
                            className={cn(
                                "h-8 w-8 rounded-md transition-colors",
                                currentLayout === "list"
                                    ? "bg-primary-container text-on-primary-container font-bold"
                                    : "text-on-surface-variant hover:text-white"
                            )}
                            aria-label="List View"
                        >
                            <ListIcon className="h-4 w-4" />
                        </Button>
                    </div>

                    {hasActiveFilters && (
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={handleReset}
                            className="h-10 w-10 border-white/5 bg-background hover:bg-white/5 transition-colors"
                            title="Reset filters"
                        >
                            <RotateCcwIcon className="h-4 w-4 text-on-surface-variant" />
                        </Button>
                    )}
                </div>
            </div>
            {isPending && (
                <div className="text-xs text-primary-container animate-pulse flex items-center gap-1.5 font-bold tracking-wider uppercase">
                    Updating results...
                </div>
            )}
        </div>
    )
}
