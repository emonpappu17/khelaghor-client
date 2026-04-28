"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MenuIcon, XIcon } from "lucide-react";

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const pathname = usePathname();

    const navLinks = [
        { name: "Home", href: "/" },
        { name: "Fields", href: "/fields" },
        { name: "About Us", href: "#about" },
    ];

    const isActive = (href: string) => {
        if (href.startsWith("#")) return false;
        return pathname === href;
    };

    return (
        <header className="sticky inset-x-0 top-0 z-50 border-b border-white/5 bg-background/80 backdrop-blur-2xl">
            <div className="mx-auto flex container items-center justify-between px-8 py-5">
                {/* Logo — outside <nav> since it is a site identity link, not navigation */}
                <Link
                    href="/"
                    aria-label="Khelaghor — go to homepage"
                    className="font-headline text-2xl font-black italic uppercase tracking-tight text-primary-container"
                >
                    Khelaghor
                </Link>

                {/* Desktop Navigation */}
                <nav aria-label="Primary navigation" className="hidden items-center gap-10 md:flex">
                    {navLinks.map((item) => (
                        <Link
                            key={item.name}
                            href={item.href}
                            aria-current={isActive(item.href) ? "page" : undefined}
                            className={`text-sm font-bold uppercase tracking-wider transition ${isActive(item.href)
                                    ? "text-primary-container"
                                    : "text-on-surface-variant hover:text-white"
                                }`}
                        >
                            {item.name}
                        </Link>
                    ))}

                    <Link
                        href="/register"
                        aria-current={pathname === "/register" ? "page" : undefined}
                        className="rounded-lg px-6 py-3 text-sm font-black uppercase tracking-wide transition-all active:scale-95 bg-primary-container text-on-primary-container hover:brightness-110"
                    >
                        Become Host
                    </Link>
                </nav>

                {/* Mobile Toggle — outside <nav> since it controls visibility, not navigation itself */}
                <button
                    type="button"
                    onClick={() => setIsOpen(!isOpen)}
                    aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
                    aria-expanded={isOpen}
                    aria-controls="mobile-menu"
                    className="inline-flex h-11 w-11 items-center justify-center rounded-lg border border-white/5 bg-surface-container text-white transition hover:bg-white/5 md:hidden"
                >
                    {isOpen ? (
                        <XIcon className="h-5 w-5" aria-hidden="true" />
                    ) : (
                        <MenuIcon className="h-5 w-5" aria-hidden="true" />
                    )}
                </button>
            </div>

            {/* Mobile Menu */}
            <nav
                id="mobile-menu"
                aria-label="Mobile navigation"
                // FIX: use aria-hidden instead of display:none so keyboard focus
                // cannot reach hidden links when the menu is closed.
                aria-hidden={!isOpen}
                className={`${isOpen ? "block" : "hidden"
                    } border-t border-white/5 bg-surface-container-low/95 backdrop-blur-xl md:hidden`}
            >
                <ul className="space-y-2 px-6 py-6">
                    {navLinks.map((item) => (
                        <li key={item.name}>
                            <Link
                                href={item.href}
                                onClick={() => setIsOpen(false)}
                                aria-current={isActive(item.href) ? "page" : undefined}
                                className={`block rounded-lg px-4 py-3 text-sm font-bold uppercase tracking-wide transition ${isActive(item.href)
                                        ? "text-primary-container bg-white/5"
                                        : "text-on-surface-variant hover:bg-white/5"
                                    }`}
                            >
                                {item.name}
                            </Link>
                        </li>
                    ))}
                    <li>
                        <Link
                            href="/register"
                            onClick={() => setIsOpen(false)}
                            aria-current={pathname === "/register" ? "page" : undefined}
                            className="mt-2 block rounded-lg px-4 py-4 text-center text-sm font-black uppercase tracking-wide transition bg-primary-container text-on-primary-container hover:brightness-110"
                        >
                            Become Host
                        </Link>
                    </li>
                </ul>
            </nav>
        </header>
    );
}