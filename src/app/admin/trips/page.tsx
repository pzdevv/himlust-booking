import Link from "next/link";
import Image from "next/image";
import { Plus, Pencil, Trash2, ExternalLink } from "lucide-react";
import { getTrips } from "@/lib/actions";

export const dynamic = "force-dynamic";

export default async function AdminTripsPage() {
    const trips = await getTrips();

    return (
        <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-2xl font-extrabold text-[#0e0f1b]">All Trips</h1>
                <Link
                    href="/admin/trips/new"
                    className="flex items-center gap-2 px-4 py-2 bg-primary text-white text-sm font-bold rounded-xl hover:bg-primary-dark transition-colors shadow-lg shadow-primary/20"
                >
                    <Plus className="w-4 h-4" />
                    Create New
                </Link>
            </div>

            <div className="grid gap-4">
                {trips.map((trip) => (
                    <div
                        key={trip.id}
                        className="bg-white p-4 rounded-xl border border-gray-100 flex items-center gap-6 group hover:border-primary/20 transition-all shadow-sm hover:shadow-md"
                    >
                        {/* Image */}
                        <div className="relative w-24 h-24 rounded-lg overflow-hidden shrink-0 bg-gray-100">
                            {trip.images[0] && (
                                <Image
                                    src={trip.images[0]}
                                    alt={trip.title}
                                    fill
                                    className="object-cover"
                                />
                            )}
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                            <h3 className="font-bold text-lg text-[#0e0f1b] truncate">
                                {trip.title}
                            </h3>
                            <div className="flex items-center gap-3 text-sm text-gray-500 mt-1">
                                <span>{trip.days} Days</span>
                                <span>•</span>
                                <span>{trip.difficulty}</span>
                                <span>•</span>
                                <span className="text-primary font-bold">
                                    ${trip.price.toLocaleString()}
                                </span>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2">
                            <a
                                href={`/trips/${trip.id}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-2 rounded-lg text-gray-400 hover:text-primary hover:bg-primary/5 transition-colors"
                                title="View Live"
                            >
                                <ExternalLink className="w-4 h-4" />
                            </a>
                            <Link
                                href={`/admin/trips/${trip.id}/edit`}
                                className="p-2 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                                title="Edit"
                            >
                                <Pencil className="w-4 h-4" />
                            </Link>
                            {/* Delete would require a client component or server action form. For now just placeholder icon */}
                            <button
                                className="p-2 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-not-allowed opacity-50"
                                title="Delete (Not implemented yet)"
                                disabled
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                ))}

                {trips.length === 0 && (
                    <div className="p-12 text-center bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
                        <p className="text-gray-500">No trips found. Create one to get started.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
