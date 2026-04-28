import { BarChart2Icon, ShareIcon } from 'lucide-react';
import Link from 'next/link';

const Footer = () => {
    return (
        // FIX: <footer> is already the correct landmark. No changes needed here.
        <footer className="bg-[#0e0e0e] w-full py-12 px-8 border-t border-white/5">
            <div className="grid grid-cols-4 gap-8 max-w-7xl mx-auto">

                {/* Brand */}
                <div className="col-span-4 md:col-span-1">
                    <p className="text-lg font-bold text-white mb-6">FieldFlow</p>
                    <p className="text-neutral-600 font-body text-xs uppercase tracking-widest leading-loose">
                        Kinetic Precision in Sports Facility Management.
                    </p>
                </div>

                {/* FIX: Wrap each column of links in <nav> with aria-label so
                    assistive tech can distinguish between the two link groups. */}
                <nav aria-label="Legal">
                    <h2 className="text-[#CCFF00] font-body text-xs tracking-widest uppercase mb-6">
                        Navigation
                    </h2>
                    <ul className="space-y-4 text-neutral-600 font-body text-xs tracking-widest uppercase">
                        <li><Link className="hover:text-[#CCFF00] transition-colors" href="#">Privacy</Link></li>
                        <li><Link className="hover:text-[#CCFF00] transition-colors" href="#">Terms</Link></li>
                    </ul>
                </nav>

                <nav aria-label="Support">
                    <h2 className="text-[#CCFF00] font-body text-xs tracking-widest uppercase mb-6">
                        Support
                    </h2>
                    <ul className="space-y-4 text-neutral-600 font-body text-xs tracking-widest uppercase">
                        <li><Link className="hover:text-[#CCFF00] transition-colors" href="#">Support</Link></li>
                        <li><Link className="hover:text-[#CCFF00] transition-colors" href="#">Contact</Link></li>
                    </ul>
                </nav>

                <div className="flex flex-col items-end">
                    {/* FIX: Icon-only links must have aria-label — without it
                        screen readers announce nothing meaningful. */}
                    <nav aria-label="Social media" className="flex space-x-4 mb-8">
                        <Link
                            aria-label="FieldFlow on Analytics"
                            className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-white hover:bg-[#CCFF00] hover:text-black transition-all"
                            href="#"
                        >
                            <BarChart2Icon className="w-4 h-4" aria-hidden="true" />
                        </Link>
                        <Link
                            aria-label="FieldFlow on Social"
                            className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-white hover:bg-[#CCFF00] hover:text-black transition-all"
                            href="#"
                        >
                            <ShareIcon className="w-4 h-4" aria-hidden="true" />
                        </Link>
                    </nav>
                    <p className="text-neutral-600 font-body text-xs tracking-widest uppercase">
                        © 2024 FieldFlow Kinetic Precision.
                    </p>
                </div>

            </div>
        </footer>
    );
};

export default Footer;