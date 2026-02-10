"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import TripCard from "@/components/trips/TripCard";
import { Trip } from "@/data/trips";

export default function TripGrid({ trips }: { trips: Trip[] }) {
    const [visibleTrips, setVisibleTrips] = useState(8);

    const loadMore = () => {
        setVisibleTrips((prev) => Math.min(prev + 4, trips.length));
    };

    return (
        <>
            {/* Trip Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {trips.slice(0, visibleTrips).map((trip) => (
                    <TripCard key={trip.id} {...trip} />
                ))}
            </div>

            {/* Load More Section */}
            <div className="mt-10 flex flex-col items-center gap-6">
                <p className="text-gray-500 text-sm">
                    Showing {Math.min(visibleTrips, trips.length)} of {trips.length} trips
                </p>
                <div className="w-64 h-2 bg-gray-200 dark:bg-white/10 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-primary rounded-full transition-all duration-300"
                        style={{ width: `${(visibleTrips / trips.length) * 100}%` }}
                    ></div>
                </div>
                {visibleTrips < trips.length && (
                    <button
                        onClick={loadMore}
                        className="flex items-center gap-2 px-8 py-3 rounded-lg border-2 border-primary text-primary font-bold hover:bg-primary hover:text-white transition-all"
                    >
                        <span>Load More Adventures</span>
                        <ChevronDown className="w-5 h-5" />
                    </button>
                )}
            </div>
        </>
    );
}
