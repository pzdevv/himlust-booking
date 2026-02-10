import { Skeleton } from "@/components/ui/Skeleton";

export default function TripLoading() {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_350px] gap-10 animate-fade-in">
            <div className="flex flex-col gap-8">
                {/* Header Skeleton */}
                <div className="space-y-4">
                    <Skeleton className="h-6 w-32 rounded-full" />
                    <Skeleton className="h-12 w-3/4" />
                    <div className="flex gap-6">
                        <Skeleton className="h-4 w-20" />
                        <Skeleton className="h-4 w-20" />
                        <Skeleton className="h-4 w-20" />
                    </div>
                </div>

                {/* Carousel Skeleton */}
                <Skeleton className="h-[400px] w-full rounded-3xl" />

                {/* Overview Skeleton */}
                <div className="space-y-4">
                    <Skeleton className="h-8 w-40" />
                    <Skeleton className="h-32 w-full" />
                </div>

                {/* Highlights Skeleton */}
                <div className="space-y-4">
                    <Skeleton className="h-8 w-40" />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {[...Array(6)].map((_, i) => (
                            <Skeleton key={i} className="h-6 w-full" />
                        ))}
                    </div>
                </div>
            </div>

            {/* Booking Widget Skeleton */}
            <Skeleton className="h-[500px] w-full rounded-2xl" />
        </div>
    );
}
