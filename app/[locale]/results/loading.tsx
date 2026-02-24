// frontend/app/[locale]/results/loading.tsx | Task: FE-FIX-002 | Skeleton loading state
import { Skeleton } from "@/components/ui/skeleton";

export default function ResultsLoading() {
    return (
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            <Skeleton className="h-10 w-48 mb-2" />
            <Skeleton className="h-5 w-72 mb-8" />
            <div className="flex gap-4 mb-6">
                <Skeleton className="h-10 w-40" />
                <Skeleton className="h-10 w-40" />
                <Skeleton className="h-10 w-40" />
            </div>
            <div className="space-y-3">
                {Array.from({ length: 8 }).map((_, i) => (
                    <Skeleton key={i} className="h-14 w-full" />
                ))}
            </div>
        </div>
    );
}
