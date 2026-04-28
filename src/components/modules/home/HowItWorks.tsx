import { ActivityIcon, CalendarIcon, MapPinIcon } from 'lucide-react';

const HowItWorks = () => {
    return (
        <section
            aria-labelledby="protocol-heading"
            className="py-24 max-w-7xl mx-auto px-8"
        >
            <div className="text-center mb-20">
                <p className="text-primary-container font-headline text-sm tracking-[0.2em] uppercase">
                    Architecture
                </p>
                <h2
                    id="protocol-heading"
                    className="font-headline text-5xl font-black mt-2"
                >
                    FIELD PROTOCOL
                </h2>
            </div>

            <ol className="grid grid-cols-1 md:grid-cols-3 gap-16 relative list-none">
                <div
                    className="absolute top-1/2 left-0 w-full h-[1px] bg-white/5 hidden md:block -z-10"
                    aria-hidden="true"
                />
                <li className="flex flex-col items-center text-center">
                    <div className="w-20 h-20 rounded-full bg-surface-container flex items-center justify-center mb-8 border border-white/5 shadow-xl">
                        <MapPinIcon className="text-primary-container w-8 h-8" aria-hidden="true" />
                    </div>
                    <h3 className="font-headline text-2xl font-bold mb-4 uppercase italic">
                        01. Locate
                    </h3>
                    <p className="text-on-surface-variant leading-relaxed">
                        Search through our verified network of premium athletic facilities near you.
                    </p>
                </li>

                <li className="flex flex-col items-center text-center">
                    <div className="w-20 h-20 rounded-full bg-surface-container flex items-center justify-center mb-8 border border-white/5 shadow-xl">
                        <CalendarIcon className="text-primary-container w-8 h-8" aria-hidden="true" />
                    </div>
                    <h3 className="font-headline text-2xl font-bold mb-4 uppercase italic">
                        02. Synchronize
                    </h3>
                    <p className="text-on-surface-variant leading-relaxed">
                        Select your optimal time-slot and sport type with real-time availability sync.
                    </p>
                </li>

                <li className="flex flex-col items-center text-center">
                    <div className="w-20 h-20 rounded-full bg-surface-container flex items-center justify-center mb-8 border border-white/5 shadow-xl">
                        <ActivityIcon className="text-primary-container w-8 h-8" aria-hidden="true" />
                    </div>
                    <h3 className="font-headline text-2xl font-bold mb-4 uppercase italic">
                        03. Execute
                    </h3>
                    <p className="text-on-surface-variant leading-relaxed">
                        Instant confirmation with digital entry pass. Show up and dominate the field.
                    </p>
                </li>
            </ol>
        </section>
    );
};

export default HowItWorks;