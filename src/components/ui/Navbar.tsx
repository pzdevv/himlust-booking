"use client";

import Image from "next/image";
import Link from "next/link";
import { Search, Menu, X } from "lucide-react";
import { useState } from "react";

export default function Navbar() {
    const [mobileOpen, setMobileOpen] = useState(false);

    return (
        <header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-lg border-b border-border">
            <div className="mx-auto max-w-7xl px-6 lg:px-10 h-[72px] flex items-center justify-between">
                {/* Logo — just the image, no circle, no text */}
                <Link href="/" className="flex items-center">
                    <Image
                        src="/himalayan.png"
                        alt="Himalayan Lust"
                        width={120}
                        height={40}
                        className="h-40 w-auto object-contain"
                        priority
                    />
                </Link>

                {/* Desktop Nav — only Trips */}
                <nav className="hidden md:flex items-center gap-1">
                    <a
                        href="https://himalayanlust.com/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 rounded-lg text-sm font-semibold text-gray-500 hover:text-primary transition-colors"
                    >
                        Home
                    </a>
                    <Link
                        href="/"
                        className="px-4 py-2 rounded-lg text-sm font-semibold text-primary bg-primary/8"
                    >
                        Trips
                    </Link>
                    <Link
                        href="https://himalayanlust.com/contact"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 rounded-lg text-sm font-semibold text-gray-500 hover:text-primary transition-colors"
                    >
                        Contact
                    </Link>
                </nav>

                {/* Right Side — Search only, no Login */}
                <div className="flex items-center gap-3">
                    <div className="hidden lg:flex items-center gap-2 px-3 py-2 bg-black/4 rounded-lg border border-transparent focus-within:border-primary/30 focus-within:bg-white focus-within:shadow-sm transition-all">
                        <Search className="text-foreground/30 w-4 h-4" />
                        <input
                            className="bg-transparent border-none text-sm w-40 placeholder:text-foreground/30 outline-none"
                            placeholder="Search treks..."
                            type="text"
                        />
                    </div>

                    {/* Mobile Toggle */}
                    <button
                        onClick={() => setMobileOpen(!mobileOpen)}
                        className="md:hidden p-2 rounded-lg hover:bg-black/5 transition-colors"
                    >
                        {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {mobileOpen && (
                <div className="md:hidden border-t border-border bg-white p-4 space-y-1 animate-fade-in-up">
                    <a
                        href="https://himalayanlust.com/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block px-4 py-3 rounded-lg text-sm font-semibold text-gray-500 hover:bg-gray-50 hover:text-primary transition-colors"
                    >
                        Home
                    </a>
                    <Link
                        href="/"
                        className="block px-4 py-3 rounded-lg text-sm font-semibold text-primary bg-primary/8"
                    >
                        Trips
                    </Link>
                    <Link
                        href="https://himalayanlust.com/contact"
                        className="block px-4 py-3 rounded-lg text-sm font-semibold text-gray-500 hover:bg-gray-50 hover:text-primary transition-colors"
                    >
                        Contact
                    </Link>
                </div>
            )}
        </header>
    );
}
