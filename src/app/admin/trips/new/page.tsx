"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { Plus, Trash2, Upload, CheckCircle, AlertCircle, X } from "lucide-react";

export default function CreateTripPage() {
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState<"success" | "error">("success");

    const [formData, setFormData] = useState({
        title: "",
        slug: "",
        overview: "",
        difficulty: "Moderate",
        duration_days: 12,
        min_pax: 1,
        max_pax: 12,
        price: 0,
        child_price: 0,
        max_altitude: "",
        best_season: "",
        location: "",
    });

    const [images, setImages] = useState<File[]>([]);
    const [pdfFile, setPdfFile] = useState<File | null>(null);
    const [itinerary, setItinerary] = useState([
        { day: 1, title: "", description: "" },
    ]);

    // New State for Includes/Excludes
    const [included, setIncluded] = useState<string[]>([""]);
    const [excluded, setExcluded] = useState<string[]>([""]);

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleItineraryChange = (index: number, field: "title" | "description", value: string) => {
        const updated = [...itinerary];
        updated[index] = { ...updated[index], [field]: value };
        setItinerary(updated);
    };

    const addDay = () => {
        setItinerary((prev) => [
            ...prev,
            { day: prev.length + 1, title: "", description: "" },
        ]);
    };

    const removeDay = (index: number) => {
        if (itinerary.length <= 1) return;
        setItinerary((prev) =>
            prev.filter((_, i) => i !== index).map((d, i) => ({ ...d, day: i + 1 }))
        );
    };

    // Handlers for Included/Excluded
    const handleListChange = (setter: React.Dispatch<React.SetStateAction<string[]>>, index: number, value: string) => {
        setter(prev => {
            const updated = [...prev];
            updated[index] = value;
            return updated;
        });
    };

    const addListItem = (setter: React.Dispatch<React.SetStateAction<string[]>>) => {
        setter(prev => [...prev, ""]);
    };

    const removeListItem = (setter: React.Dispatch<React.SetStateAction<string[]>>, index: number) => {
        setter(prev => prev.filter((_, i) => i !== index));
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setImages(Array.from(e.target.files));
        }
    };

    const handlePdfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setPdfFile(e.target.files[0]);
        }
    };

    const generateSlug = () => {
        if (!formData.title) return;
        const slug = formData.title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/(^-|-$)+/g, "");
        setFormData((prev) => ({ ...prev, slug }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage("");

        // Basic validation
        if (!formData.slug) {
            // Fallback slug generation
            const fallbackSlug = formData.title.toLowerCase().replace(/[^a-z0-9]+/g, "-");
            formData.slug = fallbackSlug;
        }

        try {
            // 1. Create Trip
            const { data: trip, error: tripError } = await supabase
                .from("trips")
                .insert({
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
                    status: "published",
                })
                .select()
                .single();

            if (tripError) throw tripError;
            const tripId = trip.id;

            // 2. Upload Images
            if (images.length > 0) {
                // Ensure bucket exists or handleError
                for (let i = 0; i < images.length; i++) {
                    const file = images[i];
                    const fileExt = file.name.split(".").pop();
                    const fileName = `${tripId}/${Date.now()}_${i}.${fileExt}`;

                    const { error: uploadError } = await supabase.storage
                        .from("trip-images")
                        .upload(fileName, file);
                    if (uploadError) {
                        console.error("Image upload failed:", uploadError);
                        // Continue? Or throw? Let's continue but log.
                    } else {
                        const { data: { publicUrl } } = supabase.storage.from("trip-images").getPublicUrl(fileName);
                        await supabase.from("trip_images").insert({
                            trip_id: tripId,
                            storage_path: publicUrl,
                            position: i,
                        });
                    }
                }
            }

            // 3. Add Pricing
            await supabase.from("trip_pricing").insert([
                { trip_id: tripId, type: "adult", price: formData.price },
                { trip_id: tripId, type: "child", price: formData.child_price },
            ]);

            // 4. Add Itinerary
            if (itinerary.length > 0) {
                await supabase.from("trip_itinerary").insert(
                    itinerary.map((day) => ({
                        trip_id: tripId,
                        day_number: day.day,
                        title: day.title,
                        description: day.description,
                    }))
                );
            }

            // 5. Add Meta (Included / Excluded)
            // Filter out empty strings
            const validIncluded = included.filter(i => i.trim() !== "");
            const validExcluded = excluded.filter(e => e.trim() !== "");

            const metaInserts = [];
            validIncluded.forEach(val => metaInserts.push({ trip_id: tripId, key: "included", value: val }));
            validExcluded.forEach(val => metaInserts.push({ trip_id: tripId, key: "excluded", value: val }));
            // Add highlights as simple strings if needed, currently reusing 'included' pattern logic if we had highlights field
            // Since User didn't ask for highlights explicitly but it's in schema, I'll stick to Includes/Excludes for now.
            // If we want highlights, we should add a similar field. I'll stick to request.

            if (metaInserts.length > 0) {
                await supabase.from("trip_meta").insert(metaInserts);
            }

            // 6. Upload PDF if exists
            if (pdfFile) {
                const fileExt = pdfFile.name.split(".").pop();
                const fileName = `${tripId}/itinerary_${Date.now()}.${fileExt}`;
                const { error: pdfUploadError } = await supabase.storage
                    .from("trip-images")
                    .upload(fileName, pdfFile);

                if (!pdfUploadError) {
                    const { data: { publicUrl } } = supabase.storage
                        .from("trip-images")
                        .getPublicUrl(fileName);

                    await supabase
                        .from("trips")
                        .update({ pdf_path: publicUrl })
                        .eq("id", tripId);
                }
            }

            setMessageType("success");
            setMessage("Trip published successfully! Redirecting...");
            // Optional: Redirect
            setTimeout(() => {
                window.location.href = "/admin/trips";
            }, 1500);

        } catch (error: any) {
            console.error(error);
            setMessageType("error");
            setMessage(error.message || "An unexpected error occurred.");
        } finally {
            setLoading(false);
        }
    };

    const inputClass =
        "w-full h-10 px-3 rounded-xl border border-[#e0e0e6] bg-[#fafafe] text-sm text-[#0e0f1b] placeholder:text-[#bbb] outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all";
    const textareaClass =
        "w-full px-3 py-2.5 rounded-xl border border-[#e0e0e6] bg-[#fafafe] text-sm text-[#0e0f1b] placeholder:text-[#bbb] outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all resize-none";
    const labelClass = "block text-xs font-semibold text-[#888] mb-1.5 uppercase tracking-wider";

    return (
        <div className="max-w-3xl mx-auto pb-20">
            {/* Page Header */}
            <div className="mb-8">
                <h1 className="text-2xl font-extrabold text-[#0e0f1b]">Create New Trip</h1>
                <p className="text-sm text-[#888] mt-1">
                    Fill in the details below to publish a new trek on the website.
                </p>
            </div>

            {/* Status Message */}
            {message && (
                <div
                    className={`flex items-center gap-3 p-4 mb-6 rounded-xl border text-sm font-medium ${messageType === "error"
                        ? "bg-red-50 border-red-200 text-red-600"
                        : "bg-emerald-50 border-emerald-200 text-emerald-600"
                        }`}
                >
                    {messageType === "error" ? (
                        <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    ) : (
                        <CheckCircle className="w-4 h-4 flex-shrink-0" />
                    )}
                    {message}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-8">
                {/* ── Basic Details ────────────────────────────────── */}
                <section className="bg-white rounded-2xl border border-[#e8e9f3] p-6 space-y-5">
                    <h2 className="text-sm font-bold text-[#0e0f1b] uppercase tracking-wider">
                        Basic Details
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className={labelClass}>Trip Title</label>
                            <input
                                name="title"
                                value={formData.title}
                                onChange={handleInputChange}
                                onBlur={generateSlug}
                                className={inputClass}
                                placeholder="e.g. Everest Base Camp Trek"
                                required
                            />
                        </div>
                        <div>
                            <label className={labelClass}>Slug (URL)</label>
                            <input
                                name="slug"
                                value={formData.slug}
                                onChange={handleInputChange}
                                className={inputClass}
                                placeholder="auto-generated from title"
                                required
                            />
                        </div>
                        <div className="md:col-span-2">
                            <label className={labelClass}>Overview</label>
                            <textarea
                                name="overview"
                                value={formData.overview}
                                onChange={handleInputChange}
                                className={`${textareaClass} h-28`}
                                placeholder="Describe the trek experience, highlights, and what makes it special..."
                                required
                            />
                        </div>
                        <div>
                            <label className={labelClass}>Location</label>
                            <input
                                name="location"
                                value={formData.location}
                                onChange={handleInputChange}
                                className={inputClass}
                                placeholder="e.g. Nepal, Solukhumbu"
                            />
                        </div>
                        <div>
                            <label className={labelClass}>Difficulty</label>
                            <select
                                name="difficulty"
                                value={formData.difficulty}
                                onChange={handleInputChange}
                                className={inputClass}
                            >
                                <option>Easy</option>
                                <option>Moderate</option>
                                <option>Challenging</option>
                            </select>
                        </div>
                        <div>
                            <label className={labelClass}>Max Altitude</label>
                            <input
                                name="max_altitude"
                                value={formData.max_altitude}
                                onChange={handleInputChange}
                                className={inputClass}
                                placeholder="e.g. 5,364m"
                            />
                        </div>
                        <div>
                            <label className={labelClass}>Best Season</label>
                            <input
                                name="best_season"
                                value={formData.best_season}
                                onChange={handleInputChange}
                                className={inputClass}
                                placeholder="e.g. Mar-May, Sep-Nov"
                            />
                        </div>
                    </div>
                </section>

                {/* ── Inclusions & Exclusions ──────────────────────── */}
                <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white rounded-2xl border border-[#e8e9f3] p-6 space-y-5">
                        <div className="flex items-center justify-between">
                            <h2 className="text-sm font-bold text-emerald-600 uppercase tracking-wider flex items-center gap-2">
                                <CheckCircle className="w-4 h-4" /> Included
                            </h2>
                            <button
                                type="button"
                                onClick={() => addListItem(setIncluded)}
                                className="text-xs text-emerald-600 font-bold hover:bg-emerald-50 px-2 py-1 rounded transition-colors"
                            >
                                + Add Item
                            </button>
                        </div>
                        <div className="space-y-2">
                            {included.map((item, index) => (
                                <div key={index} className="flex gap-2">
                                    <input
                                        value={item}
                                        onChange={(e) => handleListChange(setIncluded, index, e.target.value)}
                                        className={inputClass}
                                        placeholder="e.g. Airport transfers"
                                    />
                                    {included.length > 1 && (
                                        <button
                                            type="button"
                                            onClick={() => removeListItem(setIncluded, index)}
                                            className="text-gray-400 hover:text-red-500 transition-colors"
                                        >
                                            <X className="w-5 h-5" />
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl border border-[#e8e9f3] p-6 space-y-5">
                        <div className="flex items-center justify-between">
                            <h2 className="text-sm font-bold text-rose-600 uppercase tracking-wider flex items-center gap-2">
                                <AlertCircle className="w-4 h-4" /> Excluded
                            </h2>
                            <button
                                type="button"
                                onClick={() => addListItem(setExcluded)}
                                className="text-xs text-rose-600 font-bold hover:bg-rose-50 px-2 py-1 rounded transition-colors"
                            >
                                + Add Item
                            </button>
                        </div>
                        <div className="space-y-2">
                            {excluded.map((item, index) => (
                                <div key={index} className="flex gap-2">
                                    <input
                                        value={item}
                                        onChange={(e) => handleListChange(setExcluded, index, e.target.value)}
                                        className={inputClass}
                                        placeholder="e.g. International flights"
                                    />
                                    {excluded.length > 1 && (
                                        <button
                                            type="button"
                                            onClick={() => removeListItem(setExcluded, index)}
                                            className="text-gray-400 hover:text-red-500 transition-colors"
                                        >
                                            <X className="w-5 h-5" />
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </section>


                {/* ── Logistics & Pricing ──────────────────────────── */}
                <section className="bg-white rounded-2xl border border-[#e8e9f3] p-6 space-y-5">
                    <h2 className="text-sm font-bold text-[#0e0f1b] uppercase tracking-wider">
                        Logistics & Pricing
                    </h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div>
                            <label className={labelClass}>Duration (Days)</label>
                            <input
                                type="number"
                                name="duration_days"
                                value={formData.duration_days}
                                onChange={handleInputChange}
                                className={inputClass}
                            />
                        </div>
                        <div>
                            <label className={labelClass}>Min Pax</label>
                            <input
                                type="number"
                                name="min_pax"
                                value={formData.min_pax}
                                onChange={handleInputChange}
                                className={inputClass}
                            />
                        </div>
                        <div>
                            <label className={labelClass}>Adult Price ($)</label>
                            <input
                                type="number"
                                name="price"
                                value={formData.price}
                                onChange={handleInputChange}
                                className={inputClass}
                            />
                        </div>
                        <div>
                            <label className={labelClass}>Child Price ($)</label>
                            <input
                                type="number"
                                name="child_price"
                                value={formData.child_price}
                                onChange={handleInputChange}
                                className={inputClass}
                            />
                        </div>
                    </div>
                </section>

                {/* ── Images ───────────────────────────────────────── */}
                <section className="bg-white rounded-2xl border border-[#e8e9f3] p-6 space-y-5">
                    <h2 className="text-sm font-bold text-[#0e0f1b] uppercase tracking-wider">
                        Images
                    </h2>
                    <div className="border-2 border-dashed border-[#d5d6e0] rounded-xl p-8 text-center hover:border-primary/40 transition-colors">
                        <input
                            type="file"
                            multiple
                            accept="image/*"
                            onChange={handleImageChange}
                            className="hidden"
                            id="image-upload"
                        />
                        <label
                            htmlFor="image-upload"
                            className="cursor-pointer flex flex-col items-center gap-2"
                        >
                            <Upload className="w-8 h-8 text-[#bbb]" />
                            <span className="text-sm font-bold text-primary">
                                Click to upload images
                            </span>
                            <span className="text-xs text-[#aaa]">
                                First image = cover photo · PNG, JPG up to 5MB
                            </span>
                        </label>
                    </div>
                    {images.length > 0 && (
                        <div className="flex gap-2 flex-wrap">
                            {images.map((img, i) => (
                                <span
                                    key={i}
                                    className="inline-flex items-center gap-1 text-xs bg-primary/8 text-primary px-2.5 py-1 rounded-lg font-medium"
                                >
                                    {img.name}
                                </span>
                            ))}
                        </div>
                    )}
                </section>

                {/* ── Itinerary PDF ────────────────────────────────── */}
                <section className="bg-white rounded-2xl border border-[#e8e9f3] p-6 space-y-5">
                    <h2 className="text-sm font-bold text-[#0e0f1b] uppercase tracking-wider">
                        Itinerary PDF
                    </h2>
                    <div className="border-2 border-dashed border-[#d5d6e0] rounded-xl p-6 text-center hover:border-primary/40 transition-colors">
                        <input
                            type="file"
                            accept=".pdf"
                            onChange={handlePdfChange}
                            className="hidden"
                            id="pdf-upload"
                        />
                        <label
                            htmlFor="pdf-upload"
                            className="cursor-pointer flex flex-col items-center gap-2"
                        >
                            <Upload className="w-6 h-6 text-[#bbb]" />
                            <span className="text-sm font-bold text-primary">
                                {pdfFile ? pdfFile.name : "Upload Itinerary PDF"}
                            </span>
                            <span className="text-xs text-[#aaa]">
                                Optional · PDF only
                            </span>
                        </label>
                    </div>
                </section>

                {/* ── Itinerary ────────────────────────────────────── */}
                <section className="bg-white rounded-2xl border border-[#e8e9f3] p-6 space-y-5">
                    <div className="flex items-center justify-between">
                        <h2 className="text-sm font-bold text-[#0e0f1b] uppercase tracking-wider">
                            Itinerary
                        </h2>
                        <button
                            type="button"
                            onClick={addDay}
                            className="text-xs text-primary font-bold flex items-center gap-1 px-3 py-1.5 rounded-lg bg-primary/8 hover:bg-primary/15 transition-colors cursor-pointer"
                        >
                            <Plus className="w-3.5 h-3.5" /> Add Day
                        </button>
                    </div>
                    <div className="space-y-3">
                        {itinerary.map((day, index) => (
                            <div
                                key={index}
                                className="relative p-4 rounded-xl border border-[#e8e9f3] bg-[#fafafe] group"
                            >
                                <div className="flex items-start gap-3">
                                    <div className="flex-shrink-0 w-9 h-9 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-extrabold mt-0.5">
                                        {day.day}
                                    </div>
                                    <div className="flex-1 space-y-2">
                                        <input
                                            placeholder="Day title (e.g. Arrival in Kathmandu)"
                                            value={day.title}
                                            onChange={(e) =>
                                                handleItineraryChange(index, "title", e.target.value)
                                            }
                                            className={inputClass}
                                        />
                                        <textarea
                                            placeholder="What happens on this day..."
                                            value={day.description}
                                            onChange={(e) =>
                                                handleItineraryChange(index, "description", e.target.value)
                                            }
                                            className={`${textareaClass} h-16`}
                                        />
                                    </div>
                                    {itinerary.length > 1 && (
                                        <button
                                            type="button"
                                            onClick={() => removeDay(index)}
                                            className="p-1.5 rounded-lg text-[#ccc] hover:text-red-500 hover:bg-red-50 transition-all opacity-0 group-hover:opacity-100 cursor-pointer"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* ── Submit ───────────────────────────────────────── */}
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full h-12 rounded-xl bg-primary text-white text-sm font-bold hover:bg-primary-light transition-all shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/35 disabled:opacity-50 cursor-pointer"
                >
                    {loading ? (
                        <span className="flex items-center justify-center gap-2">
                            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            Publishing...
                        </span>
                    ) : (
                        "Publish Trip"
                    )}
                </button>
            </form>
        </div>
    );
}
