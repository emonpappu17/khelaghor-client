import Footer from "@/components/layout/Footer"
import Navbar from "@/components/layout/Navbar"
// import { getCurrentUser } from "@/queries/user.queries"


export default async function Layout({
    children,
}: {
    children: React.ReactNode
}) {
    // const currentUser = await getCurrentUser();
    // console.log(currentUser);
    return (
        <>
            <Navbar />
            <main className="min-h-screen">
                {children}
            </main>
            <Footer />
        </>
    )
}