"use client";

import useEmblaCarousel from "embla-carousel-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface TripCarouselProps {
    images: string[];
    className?: string;
    children?: React.ReactNode;
}

export default function TripCarousel({ images, className, children }: TripCarouselProps) {
    const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, duration: 30 });
    const [selectedIndex, setSelectedIndex] = useState(0);

    useEffect(() => {
        if (!emblaApi) return;

        emblaApi.on("select", () => {
            setSelectedIndex(emblaApi.selectedScrollSnap());
        });
        
        // Auto-play
        const interval = setInterval(() => {
             if (emblaApi) emblaApi.scrollNext();
        }, 5000);

        return () => clearInterval(interval);
    }, [emblaApi]);

    if (!images || images.length === 0) return null;

    return (
        <div className={cn("relative overflow-hidden group", className)}>
            <div className="absolute inset-0 z-0" ref={emblaRef}>
                <div className="flex h-full">
                    {images.map((src, index) => (
                        <div className="relative flex-[0_0_100%] min-w-0 h-full" key={index}>
                            <Image
                                src={src}
                                alt={`Slide ${index + 1}`}
                                fill
                                className="object-cover"
                                priority={index === 0}
                            />
                            {/* Dark Gradient Overlay for text readability */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                        </div>
                    ))}
                </div>
            </div>

            {/* Content Overlay (Title, etc) */}
            <div className="relative z-10 h-full pointer-events-none">
                {children}
            </div>

            {/* Dots */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-20 pointer-events-auto">
                {images.map((_, index) => (
                    <button
                        key={index}
                        className={cn(
                            "w-2.5 h-2.5 rounded-full transition-all shadow-sm backdrop-blur-sm border border-white/20",
                            index === selectedIndex
                                ? "bg-white scale-110"
                                : "bg-white/30 hover:bg-white/60"
                        )}
                        onClick={() => emblaApi?.scrollTo(index)}
                        aria-label={`Go to slide ${index + 1}`}
                    />
                ))}
            </div>
        </div>
    );
}
