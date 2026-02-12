import { notFound } from "next/navigation";
import Image from "next/image";
import { Clock, MapPin, Download, Check, X, Mountain, Calendar, ArrowDown, Share2 } from "lucide-react";
import type { Metadata } from "next";
import TripCarousel from "@/components/trips/TripCarousel";
import BookingWidget from "@/components/trips/BookingWidget";
import Itinerary from "@/components/trips/Itinerary";
import { getTrips } from "@/lib/actions";
import { FadeIn, FadeInUp } from "@/components/ui/MotionWrapper";

interface PageProps {
    params: Promise<{
        id: string;
    }>;
}

// Generate static params for all trips
export async function generateStaticParams() {
    const trips = await getTrips();
    return trips.map((trip) => ({
        id: trip.id,
    }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { id } = await params;
    const trips = await getTrips();
    const trip = trips.find((t) => t.id === id);

    if (!trip) {
        return {
            title: "Trip Not Found",
        };
    }

    return {
        title: `${trip.title} | Himalayan Lust`,
        description: trip.overview.substring(0, 160),
        openGraph: {
            title: trip.title,
            description: trip.overview.substring(0, 160),
            images: trip.images.length > 0 ? [trip.images[0]] : [],
        },
    };
}

export default async function TripPage({ params }: PageProps) {
    const { id } = await params;
    const trips = await getTrips();
    const trip = trips.find((t) => t.id === id);

    if (!trip) {
        notFound();
    }

    const difficultyColors: Record<string, string> = {
        Easy: "bg-emerald-500 text-white border-emerald-600",
        Moderate: "bg-amber-500 text-white border-amber-600",
        Challenging: "bg-rose-500 text-white border-rose-600",
    };

    return (
        <article className="relative bg-white min-h-screen">
            {/* 1. HERO SECTION (Premium Full Width) */}
            <FadeIn className="relative h-[70vh] w-full rounded-b-[3rem] md:rounded-3xl overflow-hidden shadow-2xl mb-12 group mx-auto max-w-[98%] mt-2 md:mt-4">
                {/* Carousel Background */}
                <TripCarousel
                    images={trip.images.length > 0 ? trip.images : ["/placeholder-trip.jpg"]}
                    className="h-full w-full"
                >
                    {/* Content Overlay */}
                    <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-12 text-white z-20">
                        <div className="max-w-7xl mx-auto w-full items-end flex justify-between flex-wrap gap-6">
                            <div className="space-y-4 max-w-3xl">
                                <FadeInUp delay={0.2} className="flex flex-wrap items-center gap-3">
                                    <span
                                        className={`text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-full border shadow-sm ${difficultyColors[trip.difficulty] || "bg-gray-500 text-white"
                                            }`}
                                    >
                                        {trip.difficulty}
                                    </span>
                                    <div className="flex items-center gap-1.5 text-white/90 text-sm font-medium bg-black/30 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/20">
                                        <MapPin className="w-4 h-4" />
                                        <span>{trip.location}</span>
                                    </div>
                                </FadeInUp>
                                <FadeInUp delay={0.3}>
                                    <h1 className="text-4xl md:text-7xl font-black tracking-tight leading-none drop-shadow-xl text-white">
                                        {trip.title}
                                    </h1>
                                </FadeInUp>
                                <FadeInUp delay={0.4}>
                                    <p className="text-lg md:text-xl text-white/90 font-light max-w-xl drop-shadow-md">
                                        {trip.days} Days • {trip.bestSeason} • Max Alt {trip.maxAltitude}
                                    </p>
                                </FadeInUp>
                            </div>

                            {/* Action buttons */}
                            <FadeInUp delay={0.5} className="hidden md:flex gap-3">
                                <button className="p-3 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white hover:bg-white hover:text-primary transition-all">
                                    <Share2 className="w-6 h-6" />
                                </button>
                            </FadeInUp>
                        </div>
                    </div>
                </TripCarousel>
            </FadeIn>

            {/* Main Layout Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-12 max-w-7xl mx-auto px-4 md:px-0 pb-20">
                {/* Left Column: Content */}
                <div className="flex flex-col gap-16">

                    {/* Overview & Highlights */}
                    <section className="space-y-8">
                        <FadeInUp delay={0.6} className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 bg-white rounded-2xl border border-gray-100 shadow-sm relative -mt-20 z-10 mx-2 md:mx-0 backdrop-blur-xl">
                            <div className="space-y-1 text-center">
                                <div className="text-gray-400 text-[10px] uppercase tracking-widest font-bold">Duration</div>
                                <div className="font-bold text-xl text-[#0e0f1b]">{trip.days} <span className="text-sm font-normal text-gray-500">days</span></div>
                            </div>
                            <div className="space-y-1 text-center border-l border-gray-100">
                                <div className="text-gray-400 text-[10px] uppercase tracking-widest font-bold">Max Alt</div>
                                <div className="font-bold text-xl text-[#0e0f1b]">{trip.maxAltitude}</div>
                            </div>
                            <div className="space-y-1 text-center border-l border-gray-100">
                                <div className="text-gray-400 text-[10px] uppercase tracking-widest font-bold">Group</div>
                                <div className="font-bold text-xl text-[#0e0f1b]">{trip.minPax}-{trip.maxPax}</div>
                            </div>
                            <div className="space-y-1 text-center border-l border-gray-100">
                                <div className="text-gray-400 text-[10px] uppercase tracking-widest font-bold">Season</div>
                                <div className="font-bold text-xl text-[#0e0f1b]">{trip.bestSeason}</div>
                            </div>
                        </FadeInUp>

                        <div className="space-y-6">
                            <h2 className="text-2xl font-bold text-[#0e0f1b]">Trip Overview</h2>
                            <p className="text-gray-700 leading-loose text-lg font-light">
                                {trip.overview}
                            </p>
                        </div>

                        <div className="space-y-4">
                            <h3 className="font-bold text-lg text-[#0e0f1b]">Highlights</h3>
                            <div className="flex flex-wrap gap-3">
                                {trip.highlights.map((highlight, index) => (
                                    <span key={index} className="px-4 py-2 rounded-xl bg-primary/5 text-primary text-sm font-medium border border-primary/10">
                                        ✨ {highlight}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* Includes / Excludes (New Premium Design) */}
                    <FadeInUp className="grid grid-cols-1 md:grid-cols-2 gap-0 border border-gray-200 rounded-3xl overflow-hidden shadow-sm">
                        <div className="bg-emerald-50/50 p-8 space-y-6 border-b md:border-b-0 md:border-r border-gray-200">
                            <h3 className="text-xl font-bold text-emerald-700 flex items-center gap-2">
                                <span className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
                                    <Check className="w-5 h-5" />
                                </span>
                                What's Included
                            </h3>
                            <ul className="space-y-4">
                                {trip.included && trip.included.length > 0 ? (
                                    trip.included.map((item, i) => (
                                        <li key={i} className="flex items-start gap-3 text-gray-700 text-sm leading-relaxed">
                                            <Check className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-1" />
                                            <span>{item}</span>
                                        </li>
                                    ))
                                ) : (
                                    <p className="text-gray-400 italic text-sm">Details pending...</p>
                                )}
                            </ul>
                        </div>
                        <div className="bg-rose-50/50 p-8 space-y-6">
                            <h3 className="text-xl font-bold text-rose-700 flex items-center gap-2">
                                <span className="w-8 h-8 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center">
                                    <X className="w-5 h-5" />
                                </span>
                                What's Excluded
                            </h3>
                            <ul className="space-y-4">
                                {trip.excluded && trip.excluded.length > 0 ? (
                                    trip.excluded.map((item, i) => (
                                        <li key={i} className="flex items-start gap-3 text-gray-700 text-sm leading-relaxed">
                                            <X className="w-4 h-4 text-rose-500 flex-shrink-0 mt-1" />
                                            <span>{item}</span>
                                        </li>
                                    ))
                                ) : (
                                    <p className="text-gray-400 italic text-sm">Details pending...</p>
                                )}
                            </ul>
                        </div>
                    </FadeInUp>

                    {/* Itinerary */}
                    <section className="space-y-8">
                        <div className="flex items-center justify-between">
                            <h2 className="text-3xl font-bold text-[#0e0f1b]">Itinerary</h2>
                            {trip.pdf_path && (
                                <a
                                    href={`${trip.pdf_path}?download=`}
                                    download
                                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary/10 text-primary text-sm font-bold hover:bg-primary hover:text-white transition-all shadow-sm"
                                >
                                    <Download className="w-4 h-4" />
                                    Download Itinerary
                                </a>
                            )}
                        </div>
                        <Itinerary days={trip.itinerary} />
                    </section>
                </div>

                {/* Right Column: Booking Widget */}
                {/* Fixed Sticky Behavior: lg:sticky lg:top-24 */}
                <div className="relative">
                    <div className="space-y-8 lg:sticky lg:top-24 z-20">
                        <BookingWidget trip={trip} />

                        {/* Contact Helper */}
                        <div className="bg-blue-50 p-6 rounded-2xl flex items-start gap-4">
                            <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center flex-shrink-0">
                                ?
                            </div>
                            <div>
                                <h4 className="font-bold text-[#0e0f1b]">Have Questions?</h4>
                                <p className="text-sm text-gray-600 mt-1 mb-2">Speak to our expert trek planners.</p>
                                <a href="https://himalayanlust.com/contact" className="text-sm font-bold text-blue-600 hover:underline">Contact Us &toea;</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </article>
    );
}
