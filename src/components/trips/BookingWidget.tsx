"use client";

import { useState, startTransition, useActionState } from "react";
import { Trip } from "@/data/trips";
import { submitBooking } from "@/lib/booking-actions";

export default function BookingWidget({ trip }: { trip: Trip }) {
    const [adults, setAdults] = useState(1);
    const [children, setChildren] = useState(0);

    const totalPax = adults + children;
    const totalPrice = adults * trip.price + children * trip.childPrice;
    const isValid = totalPax >= trip.minPax && totalPax <= trip.maxPax;

    const [state, formAction, isPending] = useActionState(submitBooking, {
        success: false,
    });

    if (state.success) {
        return (
            <div className="bg-white rounded-xl border border-emerald-500 p-6 shadow-lg sticky top-24 text-center">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg
                        className="w-8 h-8"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M5 13l4 4L19 7"
                        />
                    </svg>
                </div>
                <h3 className="text-xl font-bold text-emerald-600 mb-2">
                    Booking Confirmed!
                </h3>
                <p className="text-gray-600">
                    Thank you for booking. We will contact you shortly at your provided
                    email.
                </p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-xl border border-[#e8e9f3] p-6 shadow-lg">
            <div className="mb-6">
                <p className="text-sm text-gray-500 mb-1">Starting from</p>
                <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-black text-primary">
                        ${trip.price.toLocaleString()}
                    </span>
                    <span className="text-gray-400">/ adult</span>
                </div>
            </div>

            <form action={formAction} className="space-y-4">
                {/* Honeypot Field */}
                <input type="text" name="website_hp" className="hidden" tabIndex={-1} autoComplete="off" />

                <input type="hidden" name="tripId" value={trip.id} />
                <input type="hidden" name="totalPrice" value={totalPrice} />
                <input type="hidden" name="adults" value={adults} />
                <input type="hidden" name="children" value={children} />

                {/* Pax Selection */}
                <div className="space-y-4 mb-6">
                    {/* Adults */}
                    <div className="flex justify-between items-center">
                        <div>
                            <span className="block font-bold text-sm text-[#0e0f1b]">Adults</span>
                            <span className="text-xs text-gray-400">Age 12+</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <button
                                type="button"
                                onClick={() => setAdults(Math.max(1, adults - 1))}
                                className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 text-gray-600"
                            >
                                -
                            </button>
                            <span className="w-4 text-center font-bold text-[#0e0f1b]">{adults}</span>
                            <button
                                type="button"
                                onClick={() => setAdults(adults + 1)}
                                className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 text-gray-600"
                            >
                                +
                            </button>
                        </div>
                    </div>

                    {/* Children */}
                    <div className="flex justify-between items-center">
                        <div>
                            <span className="block font-bold text-sm text-[#0e0f1b]">Children</span>
                            <span className="text-xs text-gray-400">Age 5-11</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <button
                                type="button"
                                onClick={() => setChildren(Math.max(0, children - 1))}
                                className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 text-gray-600"
                            >
                                -
                            </button>
                            <span className="w-4 text-center font-bold text-[#0e0f1b]">{children}</span>
                            <button
                                type="button"
                                onClick={() => setChildren(children + 1)}
                                className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 text-gray-600"
                            >
                                +
                            </button>
                        </div>
                    </div>

                    {!isValid && (
                        <p className="text-red-500 text-xs mt-2">
                            Min travelers: {trip.minPax}, Max: {trip.maxPax}
                        </p>
                    )}
                </div>

                {/* Contact Info */}
                <div className="space-y-3">
                    <input
                        name="name"
                        placeholder="Full Name"
                        required
                        className="w-full p-3 rounded-lg border border-gray-300 bg-white text-[#0e0f1b] outline-none focus:border-primary placeholder:text-gray-400"
                    />
                    <input
                        name="email"
                        type="email"
                        placeholder="Email Address"
                        required
                        className="w-full p-3 rounded-lg border border-gray-300 bg-white text-[#0e0f1b] outline-none focus:border-primary placeholder:text-gray-400"
                    />
                    <input
                        name="phone"
                        type="tel"
                        placeholder="Phone Number"
                        className="w-full p-3 rounded-lg border border-gray-300 bg-white text-[#0e0f1b] outline-none focus:border-primary placeholder:text-gray-400"
                    />
                </div>

                {state.message && !state.success && (
                    <p className="text-red-500 text-sm">{state.message}</p>
                )}

                <div className="border-t border-gray-100 py-4 mb-2">
                    <div className="flex justify-between items-center mb-1">
                        <span className="text-gray-500">Total Price</span>
                        <span className="font-bold text-xl text-[#0e0f1b]">
                            ${totalPrice.toLocaleString()}
                        </span>
                    </div>
                </div>

                <button
                    disabled={!isValid || isPending}
                    className="w-full h-12 rounded-lg bg-primary text-white font-bold text-lg hover:bg-primary-light transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-xl shadow-primary/20 flex items-center justify-center cursor-pointer"
                >
                    {isPending ? "Processing..." : "Book Now"}
                </button>
            </form>

            <p className="text-center text-xs text-gray-400 mt-4">
                Secure payment • Instant confirmation
            </p>
        </div>
    );
}
