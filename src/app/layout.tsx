import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/ui/Navbar";
import Footer from "@/components/ui/Footer";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Himalayan Lust - Experiential Treks",
  description: "Uncover breathtaking landscapes and hidden trails.",
  icons: {
    icon: "/himalayan.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${jakarta.variable} ${inter.variable}`}>
      <body className="antialiased bg-white text-slate-900 transition-colors duration-200">
        <div className="relative flex min-h-screen flex-col">
          <Navbar />
          <main className="flex-1 w-full max-w-7xl mx-auto px-6 lg:px-10 py-12">
            {children}
          </main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
