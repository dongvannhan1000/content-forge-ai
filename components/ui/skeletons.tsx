/**
 * Loading skeleton components for better UX during data fetching
 */

export function ArticleCardSkeleton() {
    return (
        <div className="bg-card border border-border rounded-xl overflow-hidden animate-pulse">
            {/* Image skeleton */}
            <div className="h-48 bg-secondary/50" />

            {/* Content skeleton */}
            <div className="p-4 space-y-3">
                {/* Title skeleton */}
                <div className="h-6 bg-secondary/50 rounded w-3/4" />
                <div className="h-6 bg-secondary/50 rounded w-1/2" />

                {/* Content preview skeleton */}
                <div className="space-y-2">
                    <div className="h-4 bg-secondary/30 rounded w-full" />
                    <div className="h-4 bg-secondary/30 rounded w-5/6" />
                </div>

                {/* Info box skeleton */}
                <div className="h-16 bg-secondary/20 rounded" />

                {/* Buttons skeleton */}
                <div className="flex gap-2 pt-2">
                    <div className="h-9 bg-secondary/30 rounded flex-1" />
                    <div className="h-9 bg-secondary/30 rounded flex-1" />
                    <div className="h-9 bg-secondary/30 rounded w-9" />
                </div>
            </div>
        </div>
    );
}

export function ArticleCardsGridSkeleton({ count = 6 }: { count?: number }) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: count }).map((_, i) => (
                <ArticleCardSkeleton key={i} />
            ))}
        </div>
    );
}

export function SettingsPageSkeleton() {
    return (
        <div className="space-y-6 animate-pulse">
            {/* Header skeleton */}
            <div className="h-8 bg-secondary/50 rounded w-48" />

            {/* Settings sections */}
            {[1, 2, 3].map((section) => (
                <div key={section} className="bg-card border border-border rounded-xl p-6 space-y-4">
                    {/* Section title */}
                    <div className="h-6 bg-secondary/50 rounded w-32" />

                    {/* Settings fields */}
                    {[1, 2, 3].map((field) => (
                        <div key={field} className="space-y-2">
                            <div className="h-4 bg-secondary/30 rounded w-24" />
                            <div className="h-10 bg-secondary/20 rounded w-full" />
                        </div>
                    ))}
                </div>
            ))}

            {/* Save button skeleton */}
            <div className="h-10 bg-secondary/30 rounded w-32" />
        </div>
    );
}
