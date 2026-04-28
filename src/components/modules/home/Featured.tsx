import { Button } from '@/components/ui/button';
import { ChevronLeftIcon, ChevronRightIcon, MapPinIcon, StarIcon } from 'lucide-react';
import Image from 'next/image';

const Featured = () => {
    return (
        <section
            aria-labelledby="top-fields-heading"
            className="py-24 bg-surface-container-low"
        >
            <div className="max-w-7xl mx-auto px-8">
                <div className="flex justify-between items-center mb-16">
                    <h2
                        id="top-fields-heading"
                        className="font-headline text-5xl font-black italic"
                    >
                        TOP RATED FIELDS
                    </h2>
                    {/* FIX: Carousel controls need accessible labels */}
                    <div role="group" aria-label="Carousel controls" className="flex space-x-2">
                        <Button
                            variant="outline"
                            size="icon"
                            aria-label="Previous fields"
                            className="w-12 h-12 rounded-full border-outline-variant hover:bg-white/5 transition-colors bg-transparent border"
                        >
                            <ChevronLeftIcon className="w-5 h-5" aria-hidden="true" />
                        </Button>
                        <Button
                            variant="outline"
                            size="icon"
                            aria-label="Next fields"
                            className="w-12 h-12 rounded-full border-outline-variant hover:bg-white/5 transition-colors bg-transparent border"
                        >
                            <ChevronRightIcon className="w-5 h-5" aria-hidden="true" />
                        </Button>
                    </div>
                </div>

                {/* FIX: Each card is a self-contained content unit → <article>.
                        This lets screen readers navigate between cards independently. */}
                <ul className="grid grid-cols-1 md:grid-cols-3 gap-8 list-none">
                    {/* Card 1 */}
                    <li>
                        <article className="group bg-surface-container rounded-xl overflow-hidden hover:shadow-2xl hover:shadow-primary-container/5 transition-all duration-500">
                            <div className="relative h-64 overflow-hidden">
                                <Image
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                    alt="The Apex Arena — floodlit soccer field at the East Side Sport Complex"
                                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuBYau607EDXYbJQBeBHS6XSmIAgv2X1sDYgUUxjEKNnNZYJgBEXdhYyYBmEjPMrGO8jITiV9TLoedrVHcEFT4niZTNOUdQ0Iv-1GS8L1H1UEi-FpEIv499ssXmSm6suaqL1VaU5hcS8YJFXi_GqKGf4Px-Q5tsmY_f_Hq_U0SCmJ09fNTprOewXy9tgCKKBKZ1haxuXvtIQQIB7G9Ffcs3-yKO50DbYnsoJjoWcS5sl2-YS8_1d_FiFj3oeN9PbL9bxst-ws46Q2eA"
                                    fill
                                    sizes="(max-width: 768px) 100vw, 33vw"
                                />
                                <div className="absolute top-4 left-4 bg-primary-container text-on-primary-container px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider z-10">
                                    Featured
                                </div>
                                {/* FIX: Star rating — expose numeric value to screen readers */}
                                <div
                                    className="absolute top-4 right-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold flex items-center space-x-1 z-10"
                                    aria-label="Rating: 4.9 out of 5"
                                >
                                    <StarIcon className="w-4 h-4 fill-tertiary-fixed text-tertiary-fixed" strokeWidth={0} aria-hidden="true" />
                                    <span aria-hidden="true">4.9</span>
                                </div>
                            </div>
                            <div className="p-8">
                                <h3 className="font-headline text-xl font-bold mb-2">The Apex Arena</h3>
                                <address className="flex items-center text-on-surface-variant text-sm mb-6 not-italic">
                                    <MapPinIcon className="w-4 h-4 mr-1 shrink-0" aria-hidden="true" />
                                    <span>East Side Sport Complex</span>
                                </address>
                                <div className="flex items-center justify-between pt-6 border-t border-white/5">
                                    <div>
                                        <span className="block text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">
                                            Hourly Rate
                                        </span>
                                        <span className="text-xl font-black text-primary-container">$45.00</span>
                                    </div>
                                    <Button className="bg-surface-variant text-white px-5 py-2.5 rounded-lg font-bold hover:bg-white/10 transition-colors">
                                        Details
                                    </Button>
                                </div>
                            </div>
                        </article>
                    </li>

                    {/* Card 2 */}
                    <li>
                        <article className="group bg-surface-container rounded-xl overflow-hidden hover:shadow-2xl hover:shadow-primary-container/5 transition-all duration-500">
                            <div className="relative h-64 overflow-hidden">
                                <Image
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                    alt="Kinetic Hub — indoor basketball court in the Downtown Athletic District"
                                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuAwSHy3JSzQMp2AuiokhYbBODZ-0ax170r6t4a2rNvimhNfPG9GvbyaglUGCUf0jxZdqPOz3rMuEVOjmk0tMzvteHiyFZsfpqAXi9_2hFDZ2-p0PWsAY2JLfbkN8fd47GTZDYtAaLuY4ZZvC5OqzSBR7pp-FFLbHZx-rjbZG6lsCJoqse46RBc1ChxnPDTm9zyk8zF7vffZV0j70ABRF9NNjJNvvYQfufSFVdMtkVFxzYPJ8YSHvBtwCQh9QlDukX4PskhfLWQVetU"
                                    fill
                                    sizes="(max-width: 768px) 100vw, 33vw"
                                />
                                <div
                                    className="absolute top-4 right-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold flex items-center space-x-1 z-10"
                                    aria-label="Rating: 4.8 out of 5"
                                >
                                    <StarIcon className="w-4 h-4 fill-tertiary-fixed text-tertiary-fixed" strokeWidth={0} aria-hidden="true" />
                                    <span aria-hidden="true">4.8</span>
                                </div>
                            </div>
                            <div className="p-8">
                                <h3 className="font-headline text-xl font-bold mb-2">Kinetic Hub</h3>
                                <address className="flex items-center text-on-surface-variant text-sm mb-6 not-italic">
                                    <MapPinIcon className="w-4 h-4 mr-1 shrink-0" aria-hidden="true" />
                                    <span>Downtown Athletic District</span>
                                </address>
                                <div className="flex items-center justify-between pt-6 border-t border-white/5">
                                    <div>
                                        <span className="block text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">
                                            Hourly Rate
                                        </span>
                                        <span className="text-xl font-black text-primary-container">$38.00</span>
                                    </div>
                                    <Button className="bg-surface-variant text-white px-5 py-2.5 rounded-lg font-bold hover:bg-white/10 transition-colors">
                                        Details
                                    </Button>
                                </div>
                            </div>
                        </article>
                    </li>

                    {/* Card 3 */}
                    <li>
                        <article className="group bg-surface-container rounded-xl overflow-hidden hover:shadow-2xl hover:shadow-primary-container/5 transition-all duration-500">
                            <div className="relative h-64 overflow-hidden">
                                <Image
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                    alt="Vortex Courts — outdoor tennis courts at Riverside Sports Plaza"
                                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuB5NfzAt8kiESdHP443WY3PROWE3lNdCKTCm1zbwlxUOCwk8tkNmO8AtlXFOlXn-E-ecmh7WPYXJjJP0vLD8wcojzJ3N_M-ddQNZxci3Z74C0vKwEnK7wiNy2CoxRrhsvvyq7EQKFRvoSWF21fgrdvMHtjyNuS_kdY0D9F_o2qhnd6VBzE-G9INd04OeC82gTvSNaKGfipkHMoDCw6GCD_zPs_aN7G9wre7CChXkWThvut-5c14I6FKBxWh3TtDeAMNOnNNcNCDdpM"
                                    fill
                                    sizes="(max-width: 768px) 100vw, 33vw"
                                />
                                <div
                                    className="absolute top-4 right-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold flex items-center space-x-1 z-10"
                                    aria-label="Rating: 5.0 out of 5"
                                >
                                    <StarIcon className="w-4 h-4 fill-tertiary-fixed text-tertiary-fixed" strokeWidth={0} aria-hidden="true" />
                                    <span aria-hidden="true">5.0</span>
                                </div>
                            </div>
                            <div className="p-8">
                                <h3 className="font-headline text-xl font-bold mb-2">Vortex Courts</h3>
                                <address className="flex items-center text-on-surface-variant text-sm mb-6 not-italic">
                                    <MapPinIcon className="w-4 h-4 mr-1 shrink-0" aria-hidden="true" />
                                    <span>Riverside Sports Plaza</span>
                                </address>
                                <div className="flex items-center justify-between pt-6 border-t border-white/5">
                                    <div>
                                        <span className="block text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">
                                            Hourly Rate
                                        </span>
                                        <span className="text-xl font-black text-primary-container">$55.00</span>
                                    </div>
                                    <Button className="bg-surface-variant text-white px-5 py-2.5 rounded-lg font-bold hover:bg-white/10 transition-colors">
                                        Details
                                    </Button>
                                </div>
                            </div>
                        </article>
                    </li>
                </ul>
            </div>
        </section>
    );
};

export default Featured;