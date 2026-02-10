import Image from "next/image";
import Link from "next/link";
import { signOut } from "@/lib/auth-actions";
import { Mountain, Plus, LayoutDashboard, List, LogOut, ArrowLeft } from "lucide-react";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-[#f4f5f9] flex text-[#0e0f1b]">
            {/* Sidebar */}
            <aside className="w-72 min-h-screen bg-white border-r border-[#e8e9f3] flex flex-col hidden md:flex">
                {/* Sidebar Header */}
                <div className="p-6 border-b border-[#e8e9f3]">
                    <Link href="/" className="flex items-center gap-3 group">
                        <div className="relative w-9 h-9 rounded-full overflow-hidden ring-2 ring-primary/15">
                            <Image src="/himalayan.png" alt="Himalayan Lust" fill className="object-cover" />
                        </div>
                        <div>
                            <span className="block text-sm font-extrabold text-[#0e0f1b] leading-tight">
                                Himalayan Lust
                            </span>
                            <span className="block text-xs text-[#999] font-medium">Admin Panel</span>
                        </div>
                    </Link>
                </div>

                {/* Navigation */}
                <nav className="flex-1 p-4 space-y-1">
                    <span className="block text-[10px] font-bold uppercase tracking-widest text-[#bbb] px-3 mb-2">
                        Overview
                    </span>
                    <Link
                        href="/admin"
                        className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-gray-500 hover:text-primary hover:bg-primary/5 transition-all"
                    >
                        <LayoutDashboard className="w-4 h-4" />
                        Dashboard
                    </Link>

                    <span className="block text-[10px] font-bold uppercase tracking-widest text-[#bbb] px-3 mb-2 mt-6">
                        Management
                    </span>
                    <Link
                        href="/admin/trips"
                        className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-gray-500 hover:text-primary hover:bg-primary/5 transition-all"
                    >
                        <Mountain className="w-4 h-4" />
                        All Trips
                    </Link>
                    <Link
                        href="/admin/trips/new"
                        className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-gray-500 hover:text-primary hover:bg-primary/5 transition-all"
                    >
                        <Plus className="w-4 h-4" />
                        New Trip
                    </Link>
                    <Link
                        href="/admin/bookings"
                        className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-gray-500 hover:text-primary hover:bg-primary/5 transition-all"
                    >
                        <List className="w-4 h-4" />
                        Bookings
                    </Link>
                </nav>

                {/* Sidebar Footer */}
                <div className="p-4 border-t border-[#e8e9f3] space-y-1">
                    <Link
                        href="/"
                        className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-[#888] hover:text-[#0e0f1b] hover:bg-[#f4f5f9] transition-all"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Site
                    </Link>
                    <form action={signOut}>
                        <button
                            type="submit"
                            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-400 hover:text-red-600 hover:bg-red-50 transition-all cursor-pointer"
                        >
                            <LogOut className="w-4 h-4" />
                            Sign Out
                        </button>
                    </form>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col">
                {/* Top Bar (mobile) */}
                <div className="md:hidden flex items-center justify-between p-4 bg-white border-b border-[#e8e9f3]">
                    <Link href="/" className="flex items-center gap-2">
                        <div className="relative w-8 h-8 rounded-full overflow-hidden">
                            <Image src="/himalayan.png" alt="Himalayan Lust" fill className="object-cover" />
                        </div>
                        <span className="text-sm font-bold text-[#0e0f1b]">Admin</span>
                    </Link>
                    <form action={signOut}>
                        <button className="text-xs text-red-400 font-medium cursor-pointer">Sign Out</button>
                    </form>
                </div>

                {/* Page Content */}
                <main className="flex-1 p-6 md:p-10">
                    {children}
                </main>
            </div>
        </div>
    );
}
