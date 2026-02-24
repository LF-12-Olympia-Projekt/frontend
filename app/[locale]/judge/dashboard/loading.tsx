// frontend/app/[locale]/judge/dashboard/loading.tsx | Task: REM-008 | Skeleton loading state
import { Skeleton } from "@/components/ui/skeleton";

export default function JudgeDashboardLoading() {
    return (
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            <Skeleton className="h-10 w-64 mb-2" />
            <Skeleton className="h-5 w-48 mb-8" />
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
                {Array.from({ length: 4 }).map((_, i) => (
                    <Skeleton key={i} className="h-28 w-full rounded-lg" />
                ))}
            </div>
            <div className="space-y-3">
                {Array.from({ length: 5 }).map((_, i) => (
                    <Skeleton key={i} className="h-14 w-full" />
                ))}
            </div>
        </div>
    );
}
