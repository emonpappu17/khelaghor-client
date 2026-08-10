export function UsersTableSkeleton() {
    return (
        <div className="space-y-4">
            <div className="h-9 w-full max-w-sm animate-pulse rounded-md bg-muted" />
            <div className="overflow-hidden rounded-md border">
                {Array.from({ length: 8 }).map((_, i) => (
                    <div
                        key={i}
                        className="h-12 animate-pulse border-b bg-muted/40 last:border-b-0"
                    />
                ))}
            </div>
        </div>
    )
}
