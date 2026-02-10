"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";

function ItineraryItem({
    day,
    title,
    description,
}: {
    day: number;
    title: string;
    description: string;
}) {
    const [isOpen, setIsOpen] = useState(false);
    const onToggle = () => setIsOpen(!isOpen);

    return (
        <div className="border border-gray-200 rounded-lg shadow-sm bg-white">
            <button
                onClick={onToggle}
                className="w-full flex items-center justify-between p-4 bg-white hover:bg-gray-50 transition-colors text-left rounded-lg"
            >
                <div className="flex items-center gap-4">
                    <span className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm shrink-0">
                        {day}
                    </span>
                    <span className="font-bold text-lg text-[#0e0f1b]">{title}</span>
                </div>
                {isOpen ? (
                    <ChevronUp className="w-5 h-5 text-gray-400" />
                ) : (
                    <ChevronDown className="w-5 h-5 text-gray-400" />
                )}
            </button>

            <div
                className={`bg-gray-50 transition-all duration-300 ease-in-out ${isOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
                    } overflow-hidden`}
            >
                <div className="p-4 pt-0 text-gray-700 leading-relaxed border-t border-gray-200">
                    <div className="pt-4">{description}</div>
                </div>
            </div>
        </div>
    );
}

export default function Itinerary({
    days,
}: {
    days: { day: number; title: string; description: string }[];
}) {
    return (
        <div className="space-y-3">
            {days.map((day) => (
                <ItineraryItem key={day.day} {...day} />
            ))}
        </div>
    );
}
