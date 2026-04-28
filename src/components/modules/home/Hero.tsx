import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ActivityIcon, CalendarIcon, MapPinIcon, SearchIcon } from 'lucide-react';
import Image from 'next/image';

const Hero = () => {
    return (
        <section
            aria-label="Hero — book a field"
            className="relative min-h-screen flex items-center justify-center overflow-hidden pt-10"
        >
            <div className="absolute inset-0 z-0">
                <Image
                    className="w-full h-full object-cover"
                    alt="Dramatic wide-angle shot of a professional football stadium at night"
                    src="/field-home.png"
                    fill
                    priority
                />
                <div className="absolute inset-0 hero-gradient" aria-hidden="true" />
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-8 w-full text-center">
                <h1 className="font-headline text-6xl md:text-9xl font-black italic uppercase tracking-tighter leading-none mb-8 text-glow">
                    UNLEASH <span className="text-primary-container">PRECISION</span>
                </h1>
                <p className="max-w-2xl mx-auto text-on-surface-variant text-lg md:text-xl mb-12 font-medium">
                    Book elite-grade sports facilities with surgical efficiency. Experience
                    the next generation of athletic coordination.
                </p>

                {/* Search Bar
                        FIX: Added aria-label / id+htmlFor to every input and select
                        so screen readers can announce what each field is for.
                        The visible <span> text is decorative and not programmatically
                        associated without an explicit label.
                    */}
                <search className="max-w-4xl mx-auto glass-card p-2 rounded-xl shadow-2xl">
                    <div
                        role="search"
                        aria-label="Search for a field"
                        className="grid grid-cols-1 md:grid-cols-4 gap-2"
                    >
                        <div className="flex items-center space-x-3 px-6 py-4 bg-surface-container rounded-lg group">
                            <MapPinIcon className="w-5 h-5 text-primary-container" aria-hidden="true" />
                            <div className="text-left w-full">
                                <label
                                    htmlFor="search-location"
                                    className="block text-[10px] uppercase tracking-widest text-on-surface-variant font-bold"
                                >
                                    Location
                                </label>
                                <Input
                                    id="search-location"
                                    className="bg-transparent border-none p-0 focus-visible:ring-0 text-white font-medium placeholder-neutral-600 h-6 shadow-none"
                                    placeholder="Find a field..."
                                />
                            </div>
                        </div>

                        <div className="flex items-center space-x-3 px-6 py-4 bg-surface-container rounded-lg">
                            <CalendarIcon className="w-5 h-5 text-primary-container" aria-hidden="true" />
                            <div className="text-left w-full">
                                <label
                                    htmlFor="search-date"
                                    className="block text-[10px] uppercase tracking-widest text-on-surface-variant font-bold"
                                >
                                    Date
                                </label>
                                <Input
                                    id="search-date"
                                    type="date"
                                    className="bg-transparent border-none p-0 focus-visible:ring-0 text-white font-medium placeholder-neutral-600 h-6 shadow-none"
                                    placeholder="Select date"
                                />
                            </div>
                        </div>

                        <div className="flex items-center space-x-3 px-6 py-4 bg-surface-container rounded-lg">
                            <ActivityIcon className="w-5 h-5 text-primary-container" aria-hidden="true" />
                            <div className="text-left w-full">
                                <label
                                    htmlFor="search-sport"
                                    className="block text-[10px] uppercase tracking-widest text-on-surface-variant font-bold"
                                >
                                    Sport
                                </label>
                                <select
                                    id="search-sport"
                                    className="bg-transparent border-none p-0 focus:ring-0 text-white font-medium cursor-pointer w-full appearance-none outline-none"
                                >
                                    <option className="bg-surface-container">Football</option>
                                    <option className="bg-surface-container">Cricket</option>
                                    <option className="bg-surface-container">Badminton</option>
                                </select>
                            </div>
                        </div>

                        <Button
                            type="submit"
                            className="bg-primary-container text-on-primary-container flex items-center justify-center space-x-2 font-black rounded-lg transition-all hover:brightness-110 active:scale-95 h-full min-h-14 hover:bg-primary-container"
                        >
                            <SearchIcon className="w-5 h-5" aria-hidden="true" />
                            <span>SEARCH</span>
                        </Button>
                    </div>
                </search>
            </div>
        </section>
    );
};

export default Hero;