import { Button } from '@/components/ui/button';
import { ArrowRightIcon } from 'lucide-react';
import Image from 'next/image';
import React from 'react';

const CTA = () => {
    return (
        <section aria-labelledby="cta-heading" className="py-32 px-8">
            <div className="max-w-7xl mx-auto relative rounded-3xl overflow-hidden bg-primary-container py-24 px-12 text-center group">
                <div className="absolute inset-0 z-0 opacity-10" aria-hidden="true">
                    <Image
                        className="w-full h-full object-cover"
                        alt=""
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuAwf_oEJbVhLHmY_cRuWrarjhQvhzNtpszwI9L8bQxi4gyzFm_0bwRNQl3dGEnPJaDaYI8cyjkCDaMrDn__4kG0nl-UpPGcRaov9frEXWyfgvZRtt2yRiWvQcXRk5RzVjGB-SvV_WzpilDuJfO-lNQvM2KybVX8j9sPcTZDJvx9wD7hYWE0cPXUZVc7o7GUOgJZOswUA0P7BvomjWcwnJd-zz7UUSoQUS7cCvdzqakhl8hWEFjB1X_YsMUDyhdWn00K6C0ouMzsfrA"
                        fill
                    />
                </div>
                <div className="relative z-10">
                    <h2
                        id="cta-heading"
                        className="text-black font-headline text-5xl md:text-7xl font-black italic mb-8 uppercase tracking-tighter"
                    >
                        READY TO PLAY?
                    </h2>
                    <p className="text-black/70 text-xl font-bold mb-12 max-w-xl mx-auto">
                        Join 20,000+ athletes who book with FieldFlow every week.
                    </p>
                    <div className="flex flex-col md:flex-row items-center justify-center space-y-4 md:space-y-0 md:space-x-6">
                        <Button
                            size="lg"
                            className="bg-black text-[#CCFF00] px-10 py-8 rounded-lg font-black text-lg hover:bg-black/90 hover:scale-105 active:scale-95 transition-all shadow-2xl"
                        >
                            JOIN FIELDFLOW
                        </Button>
                        <Button
                            variant="link"
                            className="text-black font-black flex items-center space-x-2 border-b-2 border-black pb-1 hover:border-transparent transition-all rounded-none h-auto px-0 py-0"
                        >
                            <span>List Your Facility</span>
                            <ArrowRightIcon className="w-5 h-5 ml-1" aria-hidden="true" />
                        </Button>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default CTA;