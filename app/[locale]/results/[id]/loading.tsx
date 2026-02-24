// frontend/app/[locale]/results/[id]/loading.tsx | Task: FE-FIX-002 | Skeleton loading state
import { Skeleton } from "@/components/ui/skeleton";

export default function ResultDetailLoading() {
    return (
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            <Skeleton className="h-6 w-32 mb-6" />
            <Skeleton className="h-10 w-64 mb-4" />
            <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-4">
                    <Skeleton className="h-6 w-40" />
                    <Skeleton className="h-5 w-full" />
                    <Skeleton className="h-5 w-full" />
                    <Skeleton className="h-5 w-3/4" />
                </div>
                <div className="space-y-4">
                    <Skeleton className="h-6 w-40" />
                    <Skeleton className="h-5 w-full" />
                    <Skeleton className="h-5 w-full" />
                </div>
            </div>
        </div>
    );
}
