export default function BookingSectionSkeleton() {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start animate-pulse">
            <div className="lg:col-span-8 space-y-6">
                <div className="h-8 bg-background/40 rounded-md w-48" />
                <div className="h-36 bg-surface-container/30 rounded-xl border border-white/5" />
                <div className="h-6 bg-background/40 rounded-md w-40" />
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    <div className="h-12 bg-surface-container/30 rounded-lg col-span-1" />
                    <div className="h-12 bg-surface-container/30 rounded-lg col-span-1" />
                    <div className="h-12 bg-surface-container/30 rounded-lg col-span-1" />
                </div>
            </div>

            <div className="lg:col-span-4">
                <div className="bg-surface-container border-white/5 p-6 rounded-xl">
                    <div className="h-6 bg-background/40 rounded-md w-40 mb-6" />
                    <div className="space-y-4">
                        <div className="h-12 bg-background/30 rounded-md" />
                        <div className="h-12 bg-background/30 rounded-md" />
                        <div className="h-12 bg-background/30 rounded-md" />
                    </div>
                    <div className="h-12 bg-primary-container/20 rounded-xl mt-6" />
                </div>
            </div>
        </div>
    )
}
