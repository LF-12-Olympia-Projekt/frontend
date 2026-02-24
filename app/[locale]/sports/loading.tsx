// frontend/app/[locale]/sports/loading.tsx | Task: FE-FIX-002 | Skeleton loading state
import { Skeleton } from "@/components/ui/skeleton";

export default function SportsLoading() {
    return (
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            <Skeleton className="h-10 w-48 mb-2" />
            <Skeleton className="h-5 w-72 mb-8" />
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: 6 }).map((_, i) => (
                    <Skeleton key={i} className="h-40 w-full rounded-xl" />
                ))}
            </div>
        </div>
    );
}
