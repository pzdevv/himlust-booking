"use client";

import Image from "next/image";
import Link from "next/link";
import { Clock, MapPin, Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import { useInView } from "@/lib/hooks";

interface TripCardProps {
    id: string;
    title: string;
    images: string[];
    days: number;
    location: string;
    price: number;
    difficulty: "Easy" | "Moderate" | "Challenging";
    isLastMinute?: boolean;
}

export default function TripCard({
    id,
    title,
    images,
    days,
    location,
    price,
    difficulty,
    isLastMinute,
}: TripCardProps) {
    const { ref, isInView } = useInView({ threshold: 0.1 });
    const difficultyColors = {
        Easy: "bg-emerald-500",
        Moderate: "bg-amber-500",
        Challenging: "bg-rose-500",
    };

    return (
        <div
            ref={ref}
            className={cn(
                "group flex flex-col bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-700 border border-gray-100 opacity-0 translate-y-8",
                isInView && "opacity-100 translate-y-0"
            )}
        >
            <div className="relative aspect-[4/3] overflow-hidden">
                <div
                    className="w-full h-full bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                    style={{ backgroundImage: `url('${images[0]}')` }}
                />
                <div className="absolute top-4 left-4">
                    <span
                        className={cn(
                            "text-white text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full shadow-lg",
                            difficultyColors[difficulty] || "bg-primary"
                        )}
                    >
                        {difficulty}
                    </span>
                </div>
                {isLastMinute && (
                    <div className="absolute bottom-4 left-4">
                        <span className="bg-white/90 backdrop-blur-sm text-[#0e0f1b] text-[10px] font-bold px-2 py-0.5 rounded border border-gray-200">
                            Last minute
                        </span>
                    </div>
                )}
                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="p-2 bg-white/90 rounded-full text-primary hover:text-red-500 shadow-lg transition-colors cursor-pointer">
                        <Heart className="w-5 h-5" />
                    </button>
                </div>
            </div>
            <div className="p-5 flex flex-col flex-1">
                <div className="flex items-center gap-1 text-gray-400 text-xs mb-2">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{days} Days</span>
                    <span className="mx-1">•</span>
                    <MapPin className="w-3.5 h-3.5" />
                    <span>{location}</span>
                </div>
                <h3 className="text-lg font-bold text-[#0e0f1b] mb-4 group-hover:text-primary transition-colors">
                    {title}
                </h3>
                <div className="mt-auto flex items-center justify-between border-t border-gray-100 pt-4">
                    <div className="flex flex-col">
                        <span className="text-xs text-gray-400">Starting from</span>
                        <span className="text-lg font-black text-primary">
                            ${price.toLocaleString()}
                        </span>
                    </div>
                    <Link
                        href={`/trips/${id}`}
                        className="h-10 px-4 flex items-center rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white text-sm font-bold transition-all"
                    >
                        View Trip
                    </Link>
                </div>
            </div>
        </div>
    );
}
