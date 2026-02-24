// frontend/app/[locale]/sports/[sportId]/loading.tsx | Task: FE-FIX-002 | Skeleton loading
import { Skeleton } from "@/components/ui/skeleton";

export default function SportDetailLoading() {
    return (
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            <Skeleton className="h-6 w-32 mb-6" />
            <Skeleton className="h-48 w-full rounded-xl mb-8" />
            <Skeleton className="h-8 w-56 mb-4" />
            <div className="space-y-3">
                {Array.from({ length: 5 }).map((_, i) => (
                    <Skeleton key={i} className="h-16 w-full rounded-lg" />
                ))}
            </div>
        </div>
    );
}
