import { Search, ChevronDown, ArrowUpDown } from "lucide-react";
import TripGrid from "@/components/trips/TripGrid";
import { getTrips } from "@/lib/actions";

export const revalidate = 3600; // Revalidate every hour

export default async function Home() {
  const trips = await getTrips();
  // Client-side filtering/load more logic needs to be adapted or moved to client component
  // For simplicity in this server component version, we will toggle "load more" approach
  // or just show all. To keep "Load More", we should make a Client Component wrapper
  // or just pass data to a client component Grid.
  // Let's refactor to use a Client Component for the Grid part to keep the interactivity.


  return (
    <div className="flex flex-col gap-10">
      {/* Hero Header Section */}


      {/* Filters & Sorting Bar */}
      <div className="flex flex-col lg:flex-row items-center gap-4 p-2 bg-white dark:bg-white/5 rounded-xl shadow-sm border border-[#e8e9f3] dark:border-white/10">
        {/* Main Search */}
        <div className="relative w-full lg:flex-1">
          <div className="flex items-center pl-4 h-12">
            <Search className="text-gray-400 w-5 h-5" />
            <input
              className="flex-1 border-none focus:ring-0 bg-transparent text-base px-3 placeholder:text-gray-400 outline-none"
              placeholder="Search by destination or trek name..."
              type="text"
            />
          </div>
        </div>

        {/* Filter Dropdowns */}
        <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto p-2 lg:p-0">
          <button className="flex h-10 items-center gap-2 rounded-lg bg-background dark:bg-white/10 px-4 hover:bg-gray-200 dark:hover:bg-white/20 transition-all">
            <span className="text-sm font-semibold">Price Range</span>
            <ChevronDown className="w-4 h-4" />
          </button>
          <button className="flex h-10 items-center gap-2 rounded-lg bg-background dark:bg-white/10 px-4 hover:bg-gray-200 dark:hover:bg-white/20 transition-all">
            <span className="text-sm font-semibold">Duration</span>
            <ChevronDown className="w-4 h-4" />
          </button>
          <button className="flex h-10 items-center gap-2 rounded-lg bg-background dark:bg-white/10 px-4 hover:bg-gray-200 dark:hover:bg-white/20 transition-all">
            <span className="text-sm font-semibold">Difficulty</span>
            <ChevronDown className="w-4 h-4" />
          </button>

          <div className="h-6 w-px bg-gray-300 dark:bg-white/20 hidden lg:block mx-1"></div>

          <button className="flex h-10 items-center gap-2 rounded-lg bg-primary/10 text-primary px-4 hover:bg-primary hover:text-white transition-all">
            <span className="text-sm font-bold">Recently Added</span>
            <ArrowUpDown className="w-4 h-4" />
          </button>
        </div>
      </div>

      <TripGrid trips={trips} />
    </div>
  );
}
