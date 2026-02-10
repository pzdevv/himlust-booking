import Link from "next/link";
import { Compass, Map, Home } from "lucide-react";

export default function NotFound() {
    return (
        <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center animate-fade-in">
            {/* Animation/Icon */}
            <div className="relative mb-8">
                <div className="w-32 h-32 bg-primary/10 rounded-full flex items-center justify-center animate-pulse">
                    <Compass className="w-16 h-16 text-primary animate-spin-slow" />
                </div>
                <div className="absolute -bottom-2 -right-2 bg-white dark:bg-gray-800 p-2 rounded-full shadow-lg">
                    <Map className="w-8 h-8 text-gray-400" />
                </div>
            </div>

            <h1 className="text-4xl md:text-6xl font-black text-[#0e0f1b] dark:text-white mb-4">
                Off the Trail?
            </h1>
            <p className="text-lg text-gray-500 max-w-md mb-8">
                It looks like you've wandered into uncharted territory. This path doesn't exist on our map.
            </p>

            <Link
                href="/"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-primary text-white font-bold hover:bg-primary-light transition-all shadow-xl shadow-primary/20 hover:scale-105 transform duration-200"
            >
                <Home className="w-5 h-5" />
                Return to Base Camp
            </Link>
        </div>
    );
}
