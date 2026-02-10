import Link from "next/link";
import { Mountain, Users, Calendar, ArrowRight } from "lucide-react";
import { getTrips } from "@/lib/actions";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
    // For dashboard stats, we might want a dedicated stats function, 
    // but typically getTrips() is fast enough if cached or we can count.
    // For now, let's just show links.
    const trips = await getTrips();
    const tripCount = trips.length;

    return (
        <div className="max-w-6xl mx-auto space-y-8">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-black text-[#0e0f1b]">Dashboard</h1>
                <p className="text-sm text-gray-500">Welcome back, Admin</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between group hover:border-primary/20 transition-colors">
                    <div>
                        <div className="text-sm text-gray-500 font-medium mb-1">Total Trips</div>
                        <div className="text-3xl font-black text-[#0e0f1b]">{tripCount}</div>
                    </div>
                    <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Mountain className="w-6 h-6" />
                    </div>
                </div>
                {/* Placeholders for Bookings/Revenue since we don't have that data fetcher handy yet without fixing the page */}
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between group hover:border-emerald-500/20 transition-colors">
                    <div>
                        <div className="text-sm text-gray-500 font-medium mb-1">Bookings</div>
                        <div className="text-3xl font-black text-[#0e0f1b]">-</div>
                    </div>
                    <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Calendar className="w-6 h-6" />
                    </div>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between group hover:border-amber-500/20 transition-colors">
                    <div>
                        <div className="text-sm text-gray-500 font-medium mb-1">Revenue</div>
                        <div className="text-3xl font-black text-[#0e0f1b]">$0.00</div>
                    </div>
                    <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Users className="w-6 h-6" />
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Link href="/admin/trips" className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all group">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xl font-bold text-[#0e0f1b]">Manage Trips</h3>
                        <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-primary transition-colors transform group-hover:translate-x-1" />
                    </div>
                    <p className="text-gray-500 text-sm leading-relaxed">
                        View, edit, or delete existing travel packages. Update itineraries, pricing, and images.
                    </p>
                </Link>
                <Link href="/admin/bookings" className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all group">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xl font-bold text-[#0e0f1b]">View Bookings</h3>
                        <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-primary transition-colors transform group-hover:translate-x-1" />
                    </div>
                    <p className="text-gray-500 text-sm leading-relaxed">
                        Track new bookings, manage customer details, and update booking statuses.
                    </p>
                </Link>
            </div>
        </div>
    );
}
