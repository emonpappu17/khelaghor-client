"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MenuIcon, XIcon } from "lucide-react";
import type { AuthUser } from "@/types/api.types";
import HeaderActions from "./HeaderActions";

export default function Navbar({ user }: { user: AuthUser | null }) {
    const [isOpen, setIsOpen] = useState(false);
    const pathname = usePathname();

    const navLinks = [
        { name: "Home", href: "/" },
        { name: "Fields", href: "/fields" },
        { name: "About Us", href: "/about" },
    ];

    const isActive = (href: string) => {
        if (href.startsWith("#")) return false;
        return pathname === href;
    };

    const isLoggedOut = !user;

    return (
        <header className="sticky inset-x-0 top-0 z-50 border-b border-white/5 bg-background/20 backdrop-blur-2xl">
            <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8 py-4">
                {/* Logo */}
                <Link
                    href="/"
                    aria-label="Khelaghor — go to homepage"
                    className="font-headline text-xl sm:text-2xl font-black italic uppercase tracking-tight text-primary-container shrink-0"
                >
                    Khelaghor
                </Link>

                {/* Desktop Navigation */}
                <nav aria-label="Primary navigation" className="hidden lg:flex items-center gap-8">
                    {navLinks.map((item) => (
                        <Link
                            key={item.name}
                            href={item.href}
                            aria-current={isActive(item.href) ? "page" : undefined}
                            className={`text-sm font-bold uppercase tracking-wider transition-colors ${isActive(item.href)
                                ? "text-primary-container"
                                : "text-on-surface-variant hover:text-white"
                                }`}
                        >
                            {item.name}
                        </Link>
                    ))}
                </nav>

                {/* Desktop Right Section */}
                <div className="hidden lg:flex items-center gap-4">
                    {isLoggedOut && (
                        <Link
                            href="/login"
                            className="rounded-lg px-5 py-2.5 text-sm font-black uppercase tracking-wide transition-all active:scale-95 bg-primary-container text-on-primary-container hover:brightness-110"
                        >
                            Get Started
                        </Link>
                    )}
                    {user && <HeaderActions user={user} />}
                </div>

                {/* Mobile Toggle */}
                <button
                    type="button"
                    onClick={() => setIsOpen(!isOpen)}
                    aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
                    aria-expanded={isOpen}
                    aria-controls="mobile-menu"
                    className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-white/5 bg-surface-container text-white transition hover:bg-white/5 lg:hidden"
                >
                    {isOpen ? (
                        <XIcon className="h-5 w-5" aria-hidden="true" />
                    ) : (
                        <MenuIcon className="h-5 w-5" aria-hidden="true" />
                    )}
                </button>
            </div>

            {/* Mobile Menu */}
            <div
                id="mobile-menu"
                aria-hidden={!isOpen}
                className={`${isOpen ? "block" : "hidden"
                    } border-t border-white/5 bg-surface-container-low/95 backdrop-blur-xl lg:hidden`}
            >
                <nav aria-label="Mobile navigation" className="px-4 py-4 space-y-1">
                    {navLinks.map((item) => (
                        <Link
                            key={item.name}
                            href={item.href}
                            onClick={() => setIsOpen(false)}
                            aria-current={isActive(item.href) ? "page" : undefined}
                            className={`block rounded-lg px-4 py-3 text-sm font-bold uppercase tracking-wide transition-colors ${isActive(item.href)
                                ? "text-primary-container bg-white/5"
                                : "text-on-surface-variant hover:bg-white/5 hover:text-white"
                                }`}
                        >
                            {item.name}
                        </Link>
                    ))}

                    {isLoggedOut && (
                        <Link
                            href="/login"
                            onClick={() => setIsOpen(false)}
                            className="mt-2 block rounded-lg px-4 py-3 text-center text-sm font-black uppercase tracking-wide transition-all bg-primary-container text-on-primary-container hover:brightness-110"
                        >
                            Get Started
                        </Link>
                    )}

                    {user && (
                        <div className="pt-4 mt-4 border-t border-white/5">
                            <HeaderActions user={user} />
                        </div>
                    )}
                </nav>
            </div>
        </header>
    );
}