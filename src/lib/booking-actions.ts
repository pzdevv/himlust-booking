"use server";

import { supabase } from "@/lib/supabase";
import { revalidatePath } from "next/cache";

interface BookingState {
    success: boolean;
    message?: string;
    errors?: {
        adults?: string;
        children?: string;
        email?: string;
        phone?: string;
        server?: string;
    };
}

export async function submitBooking(
    prevState: BookingState,
    formData: FormData
): Promise<BookingState> {
    const tripId = formData.get("tripId") as string;
    const adults = parseInt(formData.get("adults") as string);
    const children = parseInt(formData.get("children") as string);
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const phone = formData.get("phone") as string;
    const totalPrice = parseFloat(formData.get("totalPrice") as string);

    // 1. Basic Validation
    const honeyPot = formData.get("website_hp");
    if (honeyPot) {
        // Silent success for bots
        return { success: true, message: "Booking submitted successfully!" };
    }

    if (!tripId || !name || !email) {
        return {
            success: false,
            message: "Please fill in all required fields.",
        };
    }

    // Strict Validations
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return { success: false, message: "Please enter a valid email address." };
    }

    if (phone) {
        // Allow +, -, space, brackets, digits. Min 7, max 20 chars.
        const phoneRegex = /^\+?[0-9\s\-()]{7,20}$/;
        if (!phoneRegex.test(phone)) {
            return { success: false, message: "Please enter a valid phone number." };
        }
    }

    // 2. Insert into Supabase
    const { error } = await supabase.from("bookings").insert({
        trip_id: tripId,
        customer_name: name,
        customer_email: email,
        customer_phone: phone,
        adults,
        children,
        total_price: totalPrice,
        status: "pending",
    });

    if (error) {
        console.error("Booking error:", error);
        return {
            success: false,
            message: "Failed to submit booking. Please try again.",
            errors: { server: error.message },
        };
    }

    revalidatePath("/");
    return { success: true, message: "Booking submitted successfully!" };
}
