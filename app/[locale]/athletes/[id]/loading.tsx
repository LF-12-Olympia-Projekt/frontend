// frontend/app/[locale]/athletes/[id]/loading.tsx | Task: FE-FIX-002 | Skeleton loading
import { Skeleton } from "@/components/ui/skeleton";

export default function AthleteLoading() {
    return (
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            <Skeleton className="h-6 w-32 mb-6" />
            <div className="flex items-center gap-6 mb-8">
                <Skeleton className="h-24 w-24 rounded-full" />
                <div>
                    <Skeleton className="h-8 w-48 mb-2" />
                    <Skeleton className="h-5 w-32 mb-1" />
                    <Skeleton className="h-5 w-24" />
                </div>
            </div>
            <Skeleton className="h-8 w-40 mb-4" />
            <div className="space-y-3">
                {Array.from({ length: 4 }).map((_, i) => (
                    <Skeleton key={i} className="h-14 w-full" />
                ))}
            </div>
        </div>
    );
}
