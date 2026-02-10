import { Skeleton } from "@/components/ui/Skeleton";

export default function Loading() {
    return (
        <div className="flex flex-col gap-10 animate-fade-in">
            {/* Search Bar Skeleton */}
            <Skeleton className="h-16 w-full rounded-xl" />

            {/* Grid Skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[...Array(6)].map((_, i) => (
                    <div key={i} className="flex flex-col space-y-3">
                        <Skeleton className="h-[400px] w-full rounded-2xl" />
                    </div>
                ))}
            </div>
        </div>
    );
}
