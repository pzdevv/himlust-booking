import Link from "next/link";
import Image from "next/image";
import { Globe, Mail, Phone, MapPin } from "lucide-react";

const footerLinks = [
    { label: "Destinations", href: "#" },
    { label: "Treks", href: "#" },
    { label: "About Us", href: "#" },
    { label: "Contact", href: "https://himalayanlust.com/contact" },
    { label: "Privacy Policy", href: "#" },
];

export default function Footer() {
    return (
        <footer className="bg-white text-[#0e0f1b] border-t border-gray-200 mt-20">
            <div className="mx-auto max-w-7xl px-6 lg:px-10 py-14">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                    {/* Brand */}
                    <div className="space-y-4">
                        <Link href="/" className="flex items-center">
                            <Image
                                src="/himalayan.png"
                                alt="Himalayan Lust"
                                width={120}
                                height={40}
                                className="h-40 w-auto object-contain"
                            />
                        </Link>
                        <p className="text-sm text-gray-500 max-w-xs leading-relaxed">
                            Crafting unforgettable Himalayan experiences since 2020.
                            From towering peaks to hidden valleys, your next adventure starts here.
                        </p>
                    </div>

                    {/* Links */}
                    <div className="space-y-4">
                        <h3 className="text-sm font-bold uppercase tracking-wider text-gray-400">Quick Links</h3>
                        <nav className="flex flex-col gap-2">
                            {footerLinks.map((link) => (
                                <Link key={link.label} href={link.href} className="text-sm text-gray-500 hover:text-primary transition-colors">
                                    {link.label}
                                </Link>
                            ))}
                        </nav>
                    </div>

                    {/* Contact */}
                    <div className="space-y-4">
                        <h3 className="text-sm font-bold uppercase tracking-wider text-gray-400">Get in Touch</h3>
                        <div className="space-y-3">
                            <div className="flex items-center gap-3 text-gray-500 text-sm">
                                <MapPin className="w-4 h-4 text-primary flex-shrink-0" />
                                <span>Patan, Kathmandu, Nepal</span>
                            </div>
                            <a href="mailto:contact@himalayanlust.com" className="flex items-center gap-3 text-gray-500 hover:text-primary text-sm transition-colors">
                                <Mail className="w-4 h-4 text-primary flex-shrink-0" />
                                <span>contact@himalayanlust.com</span>
                            </a>
                            <a href="tel:+977-1234567890" className="flex items-center gap-3 text-gray-500 hover:text-primary text-sm transition-colors">
                                <Phone className="w-4 h-4 text-primary flex-shrink-0" />
                                <span>+977-1234567890</span>
                            </a>
                        </div>

                        {/* Social */}
                        <div className="flex items-center gap-3 pt-2">
                            <a href="#" className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-primary transition-all">
                                <Globe className="w-4 h-4" />
                            </a>
                            <a href="#" className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-primary transition-all">
                                <Mail className="w-4 h-4" />
                            </a>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="mt-12 pt-6 border-t border-gray-100 flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="text-xs text-gray-400">
                        © {new Date().getFullYear()} Himalayan Lust. All rights reserved.
                    </p>
                    <p className="text-xs text-gray-400">
                        Made by Swayam at Artyzn Labs
                    </p>
                </div>
            </div>
        </footer>
    );
}
