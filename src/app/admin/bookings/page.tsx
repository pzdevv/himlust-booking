import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function AdminBookingsPage() {
    const cookieStore = await cookies();
    const token = cookieStore.get("sb-access-token")?.value;

    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            global: {
                headers: {
                    Authorization: token ? `Bearer ${token}` : "",
                },
            },
        }
    );

    const { data: bookings, error } = await supabase
        .from("bookings")
        .select("*, trips(title)")
        .order("created_at", { ascending: false });

    if (error) {
        console.error("Error fetching bookings:", error.message, error.details, error.hint);
        if (error.message.includes("JWT expired") || error.message.includes("Invalid token") || error.code === "PGRST301") {
            redirect("/login");
        }
    }

    return (
        <div className="max-w-6xl mx-auto">
            <h1 className="text-2xl font-extrabold text-[#0e0f1b] mb-8">Bookings</h1>

            <div className="bg-white rounded-2xl border border-[#e8e9f3] overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-[#fafafe] border-b border-[#e8e9f3]">
                            <tr>
                                <th className="px-6 py-4 font-bold text-[#0e0f1b]">Client</th>
                                <th className="px-6 py-4 font-bold text-[#0e0f1b]">Trip</th>
                                <th className="px-6 py-4 font-bold text-[#0e0f1b]">Pax</th>
                                <th className="px-6 py-4 font-bold text-[#0e0f1b] text-right">Date</th>
                                <th className="px-6 py-4 font-bold text-[#0e0f1b]">Status</th>
                                <th className="px-6 py-4 font-bold text-[#0e0f1b] text-right">Amount</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#e8e9f3]">
                            {bookings?.map((booking: any) => (
                                <tr key={booking.id} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="font-semibold text-[#0e0f1b]">{booking.customer_name}</div>
                                        <div className="text-xs text-gray-500">{booking.customer_email}</div>
                                        {booking.customer_phone && <div className="text-xs text-gray-400">{booking.customer_phone}</div>}
                                    </td>
                                    <td className="px-6 py-4 font-medium text-gray-700">
                                        {booking.trips?.title || "Unknown Trip"}
                                    </td>
                                    <td className="px-6 py-4 text-gray-600">
                                        <span className="font-medium text-[#0e0f1b]">{booking.total_pax}</span>
                                        <span className="text-xs text-gray-400 ml-1">({booking.adults}A, {booking.children}C)</span>
                                    </td>
                                    <td className="px-6 py-4 text-gray-600 text-right tabular-nums">
                                        {new Date(booking.created_at).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold capitalize
                      ${booking.status === 'confirmed' ? 'bg-emerald-100 text-emerald-700' :
                                                booking.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                                                    'bg-amber-100 text-amber-700'}`}>
                                            {booking.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 font-bold text-[#0e0f1b] text-right tabular-nums">
                                        ${booking.total_price}
                                    </td>
                                </tr>
                            ))}
                            {(!bookings || bookings.length === 0) && (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                                        {error ? (
                                            <div className="flex flex-col items-center gap-2">
                                                <span>Error loading bookings.</span>
                                                <span className="text-xs text-gray-400">{error.message}</span>
                                            </div>
                                        ) : "No bookings found."}
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
