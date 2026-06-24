import { FieldCard } from "@/components/modules/fields/FieldCard"
import { Button } from "@/components/ui/button"
import { getFields } from "@/queries/field.queries"
import { ChevronLeftIcon, ChevronRightIcon, InfoIcon } from "lucide-react"
import Link from "next/link"
interface FieldsPageProps {
    searchParams: Promise<{
        sportType?: string
        division?: string
        searchTerm?: string
        page?: string
        limit?: string
        layout?: "grid" | "list"
    }>
}

const FieldsPageContent = async ({ searchParams }: FieldsPageProps) => {
    const resolvedParams = await searchParams
    const sportType = resolvedParams.sportType === "ALL" ? undefined : resolvedParams.sportType
    const division = resolvedParams.division === "ALL" ? undefined : resolvedParams.division
    const searchTerm = resolvedParams.searchTerm || undefined
    const layout = resolvedParams.layout || "grid"

    const page = resolvedParams.page ? parseInt(resolvedParams.page) : 1
    const limit = resolvedParams.limit ? parseInt(resolvedParams.limit) : 9

    // Fetch fields on the server
    const fieldsResponse = await getFields(
        { sportType, division, status: "ACTIVE", searchTerm },
        { page, limit, sortBy: "createdAt", sortOrder: "desc" }
    )

    const fields = fieldsResponse?.data || []
    const meta = fieldsResponse?.meta || { total: 0, page: 1, limit: 9 }
    const totalPages = Math.ceil(meta.total / meta.limit)

    // Build URL search params for pagination helper
    const getPageUrl = (targetPage: number) => {
        const params = new URLSearchParams()
        if (resolvedParams.sportType) params.set("sportType", resolvedParams.sportType)
        if (resolvedParams.division) params.set("division", resolvedParams.division)
        if (resolvedParams.searchTerm) params.set("searchTerm", resolvedParams.searchTerm)
        if (resolvedParams.layout) params.set("layout", resolvedParams.layout)
        params.set("page", String(targetPage))
        return `/fields?${params.toString()}`
    }

    return (
        <div className="mt-12">
            {fields.length === 0 ? (
                <div className="flex flex-col items-center justify-center text-center py-20 bg-surface-container/30 rounded-2xl border border-white/5 p-8">
                    <InfoIcon className="h-12 w-12 text-on-surface-variant mb-4" />
                    <h3 className="font-headline text-2xl font-bold uppercase tracking-wider mb-2">No venues found</h3>
                    <p className="text-on-surface-variant max-w-md text-sm">
                        We couldn&apos;t find any active venues matching your criteria. Try adjusting your search query, selecting another sport type, or resetting filters.
                    </p>
                </div>
            ) : (
                <>
                    {/* Layout grid vs list display */}
                    <div
                        className={
                            layout === "list"
                                ? "flex flex-col gap-6"
                                : "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                        }
                    >
                        {fields.map((field) => (
                            <FieldCard key={field.id} field={field} layout={layout} />
                        ))}
                    </div>

                    {/* Pagination Controls */}
                    {totalPages > 1 && (
                        <div className="mt-16 flex items-center justify-center gap-2">
                            {page > 1 ? (
                                <Button asChild variant="outline" size="icon" className="w-10 h-10 rounded-full border-white/5 hover:bg-white/5 bg-transparent text-white border transition-colors">
                                    <Link href={getPageUrl(page - 1)} aria-label="Previous Page">
                                        <ChevronLeftIcon className="h-5 w-5" />
                                    </Link>
                                </Button>
                            ) : (
                                <Button disabled variant="outline" size="icon" className="w-10 h-10 rounded-full border-white/5 opacity-40 bg-transparent text-white border">
                                    <ChevronLeftIcon className="h-5 w-5" />
                                </Button>
                            )}

                            <div className="text-sm font-bold text-on-surface-variant px-4 py-2 bg-surface-container rounded-full border border-white/5">
                                Page <span className="text-white font-black">{page}</span> of <span className="text-white font-black">{totalPages}</span>
                            </div>

                            {page < totalPages ? (
                                <Button asChild variant="outline" size="icon" className="w-10 h-10 rounded-full border-white/5 hover:bg-white/5 bg-transparent text-white border transition-colors">
                                    <Link href={getPageUrl(page + 1)} aria-label="Next Page">
                                        <ChevronRightIcon className="h-5 w-5" />
                                    </Link>
                                </Button>
                            ) : (
                                <Button disabled variant="outline" size="icon" className="w-10 h-10 rounded-full border-white/5 opacity-40 bg-transparent text-white border">
                                    <ChevronRightIcon className="h-5 w-5" />
                                </Button>
                            )}
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default FieldsPageContent;