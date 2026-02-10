"use client";

import { useState } from "react";
import { signIn } from "@/lib/auth-actions";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Lock, Mail } from "lucide-react";

export default function LoginPage() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        const formData = new FormData(e.currentTarget);
        const result = await signIn(formData);

        if (result?.error) {
            setError(result.error);
            setLoading(false);
        } else {
            router.push("/admin/trips/new");
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-[#f6f6f8] px-4">
            {/* Decorative background */}
            <div className="fixed inset-0 -z-10">
                <div className="absolute top-[-40%] right-[-20%] w-[600px] h-[600px] rounded-full bg-primary/5 blur-3xl" />
                <div className="absolute bottom-[-30%] left-[-10%] w-[500px] h-[500px] rounded-full bg-primary-light/5 blur-3xl" />
            </div>

            <div className="w-full max-w-sm">
                {/* Logo */}
                <div className="flex flex-col items-center mb-8">
                    <div className="relative w-16 h-16 rounded-full overflow-hidden ring-4 ring-primary/10 mb-4">
                        <Image src="/himalayan.png" alt="Himalayan Lust" fill className="object-cover" />
                    </div>
                    <h1 className="text-2xl font-extrabold text-[#0e0f1b]">
                        Himalayan<span className="text-primary"> Lust</span>
                    </h1>
                    <p className="text-sm text-[#666] mt-1">Admin Dashboard</p>
                </div>

                {/* Card */}
                <div className="rounded-2xl bg-white border border-[#e8e9f3] p-8 shadow-xl shadow-black/5">
                    <h2 className="text-xl font-bold text-[#0e0f1b] mb-1">Welcome back</h2>
                    <p className="text-sm text-[#888] mb-6">Sign in to manage trips & bookings</p>

                    {error && (
                        <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600 mb-4 flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-red-500 flex-shrink-0" />
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-xs font-semibold text-[#666] mb-1.5 uppercase tracking-wider">
                                Email
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#bbb]" />
                                <input
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    className="w-full h-11 pl-10 pr-4 rounded-xl border border-[#e0e0e6] bg-[#fafafe] text-sm text-[#0e0f1b] placeholder:text-[#bbb] outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
                                    placeholder="admin@himalayanlust.com"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-[#666] mb-1.5 uppercase tracking-wider">
                                Password
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#bbb]" />
                                <input
                                    name="password"
                                    type="password"
                                    autoComplete="current-password"
                                    required
                                    className="w-full h-11 pl-10 pr-4 rounded-xl border border-[#e0e0e6] bg-[#fafafe] text-sm text-[#0e0f1b] placeholder:text-[#bbb] outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full h-11 rounded-xl bg-primary text-white text-sm font-bold hover:bg-primary-light transition-all shadow-md shadow-primary/25 hover:shadow-lg hover:shadow-primary/35 disabled:opacity-50 mt-2 cursor-pointer"
                        >
                            {loading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    Signing in...
                                </span>
                            ) : (
                                "Sign in"
                            )}
                        </button>
                    </form>
                </div>

                <p className="text-center text-xs text-[#bbb] mt-6">
                    Protected area · Unauthorized access is prohibited
                </p>
            </div>
        </div>
    );
}
