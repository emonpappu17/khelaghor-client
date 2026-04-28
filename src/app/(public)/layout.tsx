import Footer from "@/components/layout/Footer"
import Navbar from "@/components/layout/Navbar"

export default async function Layout({
    children,
}: {
    children: React.ReactNode
}) {

    return (
        // <main className="min-h-screen flex flex-col">
        //     <Navbar></Navbar>
        //     <div className="grow">
        //         {children}
        //     </div>
        //     <Footer></Footer>
        // </main>

        <>
            <Navbar />
            <main className="min-h-screen">
                {children}
            </main>
            <Footer />
        </>
    )
}