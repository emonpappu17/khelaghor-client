import { ActivityIcon } from 'lucide-react';
import Image from 'next/image';

const Categories = () => {
    return (
        <section aria-labelledby="disciplines-heading" className="py-24 px-8 max-w-7xl mx-auto">
            <div className="flex justify-between items-end mb-16">
                <div>
                    <p className="text-primary-container font-headline text-sm tracking-[0.2em] uppercase">
                        Disciplines
                    </p>
                    <h2 id="disciplines-heading" className="font-headline text-5xl font-black mt-2">
                        ELITE VENUES
                    </h2>
                </div>
                <p className="text-on-surface-variant max-w-xs text-right">
                    Optimized for performance across multiple athletic domains.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 h-[600px]">
                <div className="md:col-span-8 relative rounded-xl overflow-hidden group cursor-pointer">
                    <Image
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        alt="A well-lit football pitch with high-traction synthetic turf"
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuATMvgp21zV6gHYMRghON2uOvIWQpqgPlPITFG4V1yUz1N5sgdPqinhTWugHpbZc9neum3yQVDWiN8RYFxf1dktDlJzZ6FDZqW0EKuLTvEvg3sLMqsuys2y4xNqjP3xiPM4Kcx_gcUhjONO-bdXlks4zAr22KSUDGBEqhuxEhcVjhv2Mt5LXCi6EocRrGPyEiiS8jajPrOY_RQE4w45yjELpnpl0vdUcIL5Og2tdMxS4li7mBeSlA4nEKf594s9h9JqP_msuy4PqhU"
                        fill
                        sizes="(max-width: 768px) 100vw, 66vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" aria-hidden="true" />
                    <div className="absolute bottom-8 left-8 p-4">
                        <ActivityIcon className="text-primary-container w-10 h-10 mb-4" aria-hidden="true" />
                        <h3 className="font-headline text-3xl font-bold italic">FOOTBALL</h3>
                        <p className="text-on-surface-variant">High-traction synthetic &amp; hybrid turf</p>
                    </div>
                </div>

                <div className="md:col-span-4 relative rounded-xl overflow-hidden group cursor-pointer">
                    <Image
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        alt="A cricket pitch with precision clay and grass wickets"
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuBQ4n8JMP_sujNGrzN1KR69cXuwIsWBpWnohNWkSpfE1-pQZqGne9QxoiO__Li2ejr6J7Acx3tTDRipKs9sFznaaXDZ3KbLMu5Jvu-PKmT7u8lLJefsjzh2-kgtyMXGg-FFl7JKEX0S_yU3F0dknoskPfqEkvOsQiyjLVe1AGY4jFuCFUP4q5oU0Q5kPXpaAYrkpFISLtB8fIT70hVTu33hS_Z-6MrehaBHrRsbsh2i3rzHa-zwNJ1BdZnMk38YPpOBVKXZU0zxnXo"
                        fill
                        sizes="(max-width: 768px) 100vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" aria-hidden="true" />
                    <div className="absolute bottom-8 left-8 p-4">
                        <ActivityIcon className="text-primary-container w-10 h-10 mb-4" aria-hidden="true" />
                        <h3 className="font-headline text-3xl font-bold italic">CRICKET</h3>
                        <p className="text-on-surface-variant">Precision clay &amp; grass wickets</p>
                    </div>
                </div>

                <div className="md:col-span-4 relative rounded-xl overflow-hidden group cursor-pointer">
                    <Image
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        alt="A badminton court with shock-absorbent PVC flooring"
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuBlnD_7P8s0OReccbxd8ozkf05j5gcxzj6D-gsXZe3iqVyOxxVY7pDhN47Nw-BJfkmh3f1iHjEHAmvSgDetAZj14A1tquvbc2wyUEc7MLGTbYB3ofFnO-6OMJoQKdWUJq8BrpszbnYTzYemfUDF5oZ36qlJ1NAJD33M07McRMcQWiHiNRs1clPravUsGAYTUJIIOlGlPouDcjLtWR6QqMDnKCXzATVYCdMkwUF-TqO7lQkjPCq5PdwBJXVLRd-Q7HHVu3hpyIF7z80"
                        fill
                        sizes="(max-width: 768px) 100vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" aria-hidden="true" />
                    <div className="absolute bottom-8 left-8 p-4">
                        <ActivityIcon className="text-primary-container w-10 h-10 mb-4" aria-hidden="true" />
                        <h3 className="font-headline text-3xl font-bold italic">BADMINTON</h3>
                        <p className="text-on-surface-variant">Shock-absorbent PVC flooring</p>
                    </div>
                </div>

                <div className="md:col-span-8 relative rounded-xl overflow-hidden group cursor-pointer">
                    <div className="absolute inset-0 bg-surface-container-high p-12 flex flex-col justify-center items-center text-center border border-white/5">
                        <span className="text-primary-container font-headline text-6xl mb-4" aria-hidden="true">24/7</span>
                        <h3 className="font-headline text-3xl font-bold italic">ANYTIME ACCESS</h3>
                        <p className="text-on-surface-variant mt-2">
                            Smart lighting systems and automated check-ins for late-night sessions.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Categories;