"use server";

import { supabase } from "@/lib/supabase";
import { Trip } from "@/data/trips";
import { unstable_cache } from "next/cache";

export const getTrips = unstable_cache(
    async (): Promise<Trip[]> => {
        const { data, error } = await supabase
            .from("trips")
            .select(
                `
      *,
      trip_images (storage_path),
      trip_pricing (type, price),
      trip_itinerary (day_number, title, description),
      trip_meta (key, value)
    `
            )
            .eq("status", "published")
            .order("created_at", { ascending: false });

        if (error) {
            console.error("Error fetching trips:", error);
            return [];
        }

        return data.map((t: any) => ({
            id: t.id,
            title: t.title,
            images: t.trip_images.map((img: any) => img.storage_path),
            days: t.duration_days,
            location: t.start_point,
            price:
                t.trip_pricing.find((p: any) => p.type === "adult")?.price || 0,
            childPrice:
                t.trip_pricing.find((p: any) => p.type === "child")?.price || 0,
            difficulty: t.difficulty,
            isLastMinute: false,
            overview: t.overview,
            highlights: t.trip_meta
                .filter((m: any) => m.key === "highlight")
                .map((m: any) => m.value),
            maxAltitude: t.max_altitude,
            bestSeason: t.best_season,
            startPoint: t.start_point,
            endPoint: t.end_point,
            minPax: t.min_pax,
            maxPax: t.max_pax,
            itinerary: t.trip_itinerary.map((d: any) => ({
                day: d.day_number,
                title: d.title,
                description: d.description,
            })),
            included: t.trip_meta.filter((m: any) => m.key === 'included').map((m: any) => m.value),
            excluded: t.trip_meta.filter((m: any) => m.key === 'excluded').map((m: any) => m.value),
            pdf_path: t.pdf_path,
        }));
    },
    ["trips-list"],
    { revalidate: 3600, tags: ["trips"] }
);

export const getTripBySlug = unstable_cache(
    async (slug: string): Promise<Trip | null> => {
        const { data, error } = await supabase
            .from("trips")
            .select(
                `
      *,
      trip_images (storage_path),
      trip_pricing (type, price),
      trip_itinerary (day_number, title, description),
      trip_meta (key, value)
    `
            )
            .eq("slug", slug)
            .single();

        if (error || !data) return null;

        return {
            id: data.id,
            title: data.title,
            images: data.trip_images.map((img: any) => img.storage_path),
            days: data.duration_days,
            location: data.start_point,
            price:
                data.trip_pricing.find((p: any) => p.type === "adult")?.price || 0,
            childPrice:
                data.trip_pricing.find((p: any) => p.type === "child")?.price || 0,
            difficulty: data.difficulty,
            isLastMinute: false,
            overview: data.overview,
            highlights: data.trip_meta
                .filter((m: any) => m.key === "highlight")
                .map((m: any) => m.value),
            maxAltitude: data.max_altitude,
            bestSeason: data.best_season,
            startPoint: data.start_point,
            endPoint: data.end_point,
            minPax: data.min_pax,
            maxPax: data.max_pax,
            itinerary: data.trip_itinerary.map((d: any) => ({
                day: d.day_number,
                title: d.title,
                description: d.description,
            })),
            included: data.trip_meta.filter((m: any) => m.key === 'included').map((m: any) => m.value),
            excluded: data.trip_meta.filter((m: any) => m.key === 'excluded').map((m: any) => m.value),
            pdf_path: data.pdf_path,
        };
    },
    ["trip-detail-slug"],
    // Ideally user key would be part of cache key: `trip-detail-${slug}` but unstable_cache signature here is static.
    // For per-slug caching, we'd need to wrap the function logic inside.
    // However, since we're passing arguments, `unstable_cache` automatically generates a key based on args + keyParts.
    // So this is fine.
    { revalidate: 3600, tags: ["trips"] }
);
