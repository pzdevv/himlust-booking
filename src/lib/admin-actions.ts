"use server";

import { createServerClient } from "@/lib/supabase-server";
import { revalidatePath, revalidateTag } from "next/cache";

export async function deleteTrip(tripId: string) {
    const supabase = await createServerClient();

    // Check auth via RLS indirectly or explicit check
    // Since we pass the token, supabase client is authenticated.
    // We can also verify user exists.
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    // If token is invalid/expired, getUser fails or returns null
    if (authError || !user) {
        return { error: "Unauthorized: Please log in again." };
    }

    const { error } = await supabase.from("trips").delete().eq("id", tripId);

    if (error) {
        return { error: error.message };
    }

    revalidatePath("/admin/trips");
    revalidatePath("/trips");
    return { success: true };
}

export async function updateTrip(formData: any) {
    const supabase = await createServerClient();

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
        return { error: "Unauthorized: Please log in again." };
    }

    const tripId = formData.id;
    if (!tripId) return { error: "Trip ID missing" };

    try {
        // 1. Update Trip Base
        const { error: tripError } = await supabase
            .from("trips")
            .update({
                title: formData.title,
                slug: formData.slug,
                overview: formData.overview,
                difficulty: formData.difficulty,
                duration_days: formData.duration_days,
                min_pax: formData.min_pax,
                max_pax: formData.max_pax,
                max_altitude: formData.max_altitude,
                best_season: formData.best_season,
                start_point: formData.location,
                pdf_path: formData.pdf_path,
            })
            .eq("id", tripId);

        if (tripError) throw tripError;

        // 2. Pricing
        const { error: pricingError } = await supabase.from("trip_pricing").upsert([
            { trip_id: tripId, type: "adult", price: formData.price },
            { trip_id: tripId, type: "child", price: formData.child_price },
        ], { onConflict: 'trip_id,type' });
        if (pricingError) throw pricingError;

        // 3. Itinerary
        await supabase.from("trip_itinerary").delete().eq("trip_id", tripId);
        if (formData.itinerary && formData.itinerary.length > 0) {
            const { error: itinError } = await supabase.from("trip_itinerary").insert(
                formData.itinerary.map((day: any) => ({
                    trip_id: tripId,
                    day_number: day.day,
                    title: day.title,
                    description: day.description,
                }))
            );
            if (itinError) throw itinError;
        }

        // 4. Meta (Inc/Exc)
        await supabase.from("trip_meta").delete().eq("trip_id", tripId);
        const metaInserts: { trip_id: any; key: string; value: string; }[] = [];

        if (formData.included && Array.isArray(formData.included)) {
            formData.included.filter((i: string) => i && i.trim() !== "").forEach((val: string) =>
                metaInserts.push({ trip_id: tripId, key: "included", value: val })
            );
        }
        if (formData.excluded && Array.isArray(formData.excluded)) {
            formData.excluded.filter((e: string) => e && e.trim() !== "").forEach((val: string) =>
                metaInserts.push({ trip_id: tripId, key: "excluded", value: val })
            );
        }

        if (metaInserts.length > 0) {
            const { error: metaError } = await supabase.from("trip_meta").insert(metaInserts);
            if (metaError) throw metaError;
        }

        revalidatePath("/admin/trips");
        revalidatePath(`/trips/${formData.slug}`);
        revalidateTag("trips");
        return { success: true };
    } catch (e: any) {
        return { error: e.message };
    }
}
