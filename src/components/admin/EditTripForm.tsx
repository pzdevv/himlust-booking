"use client";

import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import { Plus, Trash2, Upload, CheckCircle, AlertCircle, X, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { updateTrip, deleteTrip } from "@/lib/admin-actions";

interface EditTripFormProps {
    tripId: string;
    token?: string;
}

export default function EditTripForm({ tripId, token }: EditTripFormProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState<"success" | "error">("success");

    // Authenticated client (for Storage / Actions if needed)
    const supabaseAuth = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        token ? {
            global: {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            },
        } : {}
    );

    // Anonymous client (for fetching public data) to avoid header issues
    const supabaseAnon = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    // Use the appropriate client
    const supabase = supabaseAnon; // Default to anon for fetching

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

    const [existingImages, setExistingImages] = useState<{ id: string, storage_path: string }[]>([]);
    const [newImages, setNewImages] = useState<File[]>([]);
    const [pdfFile, setPdfFile] = useState<File | null>(null);
    const [existingPdf, setExistingPdf] = useState<string | null>(null);

    const [itinerary, setItinerary] = useState([
        { day: 1, title: "", description: "" },
    ]);

    const [included, setIncluded] = useState<string[]>([""]);
    const [excluded, setExcluded] = useState<string[]>([""]);

    useEffect(() => {
        const fetchTrip = async () => {
            // Basic fetch of trip + related data
            const { data: trip, error } = await supabase
                .from("trips")
                .select("*")
                .eq("id", tripId)
                .single();

            if (error) {
                setMessage("Error fetching trip: " + error.message);
                setMessageType("error");
                setLoading(false);
                return;
            }

            // Populate basic data
            setFormData({
                title: trip.title,
                slug: trip.slug,
                overview: trip.overview || "",
                difficulty: trip.difficulty || "Moderate",
                duration_days: trip.duration_days,
                min_pax: trip.min_pax,
                max_pax: trip.max_pax,
                max_altitude: trip.max_altitude || "",
                best_season: trip.best_season || "",
                location: trip.start_point || "",
                price: 0, // fetch below
                child_price: 0, // fetch below
            });
            setExistingPdf(trip.pdf_path);

            // Fetch Pricing
            const { data: pricing } = await supabase.from("trip_pricing").select("*").eq("trip_id", tripId);
            if (pricing) {
                const adult = pricing.find((p: any) => p.type === 'adult');
                const child = pricing.find((p: any) => p.type === 'child');
                setFormData(prev => ({
                    ...prev,
                    price: adult ? adult.price : 0,
                    child_price: child ? child.price : 0
                }));
            }

            // Fetch Images
            const { data: images } = await supabase.from("trip_images").select("*").eq("trip_id", tripId).order('position');
            if (images) {
                setExistingImages(images);
            }

            // Fetch Itinerary
            const { data: itin } = await supabase.from("trip_itinerary").select("*").eq("trip_id", tripId).order('day_number');
            if (itin && itin.length > 0) {
                setItinerary(itin.map((d: any) => ({ day: d.day_number, title: d.title, description: d.description || "" })));
            }

            // Fetch Meta (Inc/Exc)
            const { data: meta } = await supabase.from("trip_meta").select("*").eq("trip_id", tripId);
            if (meta) {
                const inc = meta.filter((m: any) => m.key === 'included').map((m: any) => m.value);
                const exc = meta.filter((m: any) => m.key === 'excluded').map((m: any) => m.value);
                if (inc.length > 0) setIncluded(inc);
                if (exc.length > 0) setExcluded(exc);
            }

            setLoading(false);
        };

        fetchTrip();
    }, [tripId]);


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
            setNewImages(Array.from(e.target.files));
        }
    };

    const handlePdfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setPdfFile(e.target.files[0]);
        }
    };

    const handleDeleteImage = async (imageId: string) => {
        if (!confirm("Are you sure you want to delete this image?")) return;

        const { error } = await supabase.from("trip_images").delete().eq("id", imageId);
        if (error) {
            alert("Error deleting image: " + error.message);
        } else {
            setExistingImages(prev => prev.filter(img => img.id !== imageId));
        }
    };

    const handleDeleteTrip = async () => {
        if (!confirm("⚠️ Are you sure you want to DELETE this trip? This action cannot be undone.")) return;
        setDeleting(true);

        const result = await deleteTrip(tripId);
        if (result.success) {
            router.push("/admin/trips");
        } else {
            alert("Error deleting trip: " + result.error);
            setDeleting(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setMessage("");

        try {
            // 1. Upload New Images (Client Side to avoid sending files to server action directly)
            // We use the authenticated client so this should work now.
            if (newImages.length > 0) {
                const startPos = existingImages.length;
                for (let i = 0; i < newImages.length; i++) {
                    const file = newImages[i];
                    const fileExt = file.name.split(".").pop();
                    const fileName = `${tripId}/${Date.now()}_new_${i}.${fileExt}`;

                    const { error: uploadError } = await supabase.storage
                        .from("trip-images")
                        .upload(fileName, file);

                    if (!uploadError) {
                        const { data: { publicUrl } } = supabase.storage.from("trip-images").getPublicUrl(fileName);
                        // Insert record
                        await supabase.from("trip_images").insert({
                            trip_id: tripId,
                            storage_path: publicUrl,
                            position: startPos + i,
                        });
                    } else {
                        console.error("Image upload failed", uploadError);
                    }
                }
            }

            // 2. Upload PDF
            let uploadedPdfPath: string | undefined;
            if (pdfFile) {
                const fileExt = pdfFile.name.split(".").pop();
                const fileName = `${tripId}/itinerary_${Date.now()}.${fileExt}`;
                const { error: pdfUploadError } = await supabaseAuth.storage
                    .from("trip-images")
                    .upload(fileName, pdfFile);

                if (!pdfUploadError) {
                    const { data: { publicUrl } } = supabaseAuth.storage
                        .from("trip-images")
                        .getPublicUrl(fileName);
                    uploadedPdfPath = publicUrl;
                }
            }

            // 3. Update Data via Server Action
            const payload = {
                id: tripId,
                ...formData,
                pdf_path: uploadedPdfPath ?? existingPdf,
                itinerary,
                included,
                excluded,
            };

            const result = await updateTrip(payload);

            if (result.success) {
                setMessageType("success");
                setMessage("Trip updated successfully!");
                router.refresh();
            } else {
                throw new Error(result.error);
            }

        } catch (error: any) {
            console.error(error);
            setMessageType("error");
            setMessage(error.message || "An unexpected error occurred.");
        } finally {
            setSaving(false);
        }
    };

    const inputClass =
        "w-full h-10 px-3 rounded-xl border border-[#e0e0e6] bg-[#fafafe] text-sm text-[#0e0f1b] placeholder:text-[#bbb] outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all";
    const textareaClass =
        "w-full px-3 py-2.5 rounded-xl border border-[#e0e0e6] bg-[#fafafe] text-sm text-[#0e0f1b] placeholder:text-[#bbb] outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all resize-none";
    const labelClass = "block text-xs font-semibold text-[#888] mb-1.5 uppercase tracking-wider";

    if (loading) return <div className="p-10 text-center text-gray-500">Loading trip details...</div>;

    return (
        <div className="max-w-3xl mx-auto pb-20">
            <div className="mb-8 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link href="/admin/trips" className="p-2 rounded-xl bg-white border border-gray-200 hover:bg-gray-50 text-gray-500 transition-colors">
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-extrabold text-[#0e0f1b]">Edit Trip</h1>
                        <p className="text-sm text-[#888] mt-1">
                            Updating: <span className="font-bold">{formData.title}</span>
                        </p>
                    </div>
                </div>
                <button
                    type="button"
                    onClick={handleDeleteTrip}
                    disabled={deleting}
                    className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 font-bold rounded-xl hover:bg-red-100 transition-colors"
                >
                    {deleting ? "Deleting..." : <><Trash2 className="w-4 h-4" /> Delete Trip</>}
                </button>
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
                                className={inputClass}
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
                            />
                        </div>
                        <div>
                            <label className={labelClass}>Best Season</label>
                            <input
                                name="best_season"
                                value={formData.best_season}
                                onChange={handleInputChange}
                                className={inputClass}
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

                    {/* Existing Images */}
                    {existingImages.length > 0 && (
                        <div className="flex gap-4 flex-wrap mb-4">
                            {existingImages.map((img) => (
                                <div key={img.id} className="relative group w-24 h-24 rounded-lg overflow-hidden border border-gray-200">
                                    <img src={img.storage_path} alt="" className="w-full h-full object-cover" />
                                    <button
                                        type="button"
                                        onClick={() => handleDeleteImage(img.id)}
                                        className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity"
                                    >
                                        <Trash2 className="w-6 h-6" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}

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
                                Add more images
                            </span>
                        </label>
                    </div>
                    {newImages.length > 0 && (
                        <div className="flex gap-2 flex-wrap text-sm text-gray-500">
                            {newImages.length} new files selected.
                        </div>
                    )}
                </section>

                {/* ── Itinerary PDF ────────────────────────────────── */}
                <section className="bg-white rounded-2xl border border-[#e8e9f3] p-6 space-y-5">
                    <h2 className="text-sm font-bold text-[#0e0f1b] uppercase tracking-wider">
                        Itinerary PDF
                    </h2>
                    {existingPdf && (
                        <div className="flex items-center gap-2 text-sm text-blue-600 mb-4 bg-blue-50 p-3 rounded-lg">
                            <CheckCircle className="w-4 h-4" />
                            Current PDF available. Uploading new one replaces it.
                        </div>
                    )}
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
                                {pdfFile ? pdfFile.name : (existingPdf ? "Replace PDF" : "Upload Itinerary PDF")}
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
                                            placeholder="Day title"
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
                    disabled={saving}
                    className="w-full h-12 rounded-xl bg-primary text-white text-sm font-bold hover:bg-primary-light transition-all shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/35 disabled:opacity-50 cursor-pointer"
                >
                    {saving ? (
                        <span className="flex items-center justify-center gap-2">
                            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            Updating...
                        </span>
                    ) : (
                        "Update Trip"
                    )}
                </button>
            </form>
        </div>
    );
}
