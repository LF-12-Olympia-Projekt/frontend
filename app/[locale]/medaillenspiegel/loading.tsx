// frontend/app/[locale]/medaillenspiegel/loading.tsx | Task: FE-FIX-002 | Skeleton loading
import { Skeleton } from "@/components/ui/skeleton";

export default function MedalTableLoading() {
    return (
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            <Skeleton className="h-10 w-56 mb-2" />
            <Skeleton className="h-5 w-80 mb-8" />
            <Skeleton className="h-10 w-64 mb-6" />
            <div className="space-y-3">
                {Array.from({ length: 10 }).map((_, i) => (
                    <Skeleton key={i} className="h-12 w-full" />
                ))}
            </div>
        </div>
    );
}
