import Footer from "@/components/layout/Footer"
import Navbar from "@/components/layout/Navbar"
import { getCurrentUser } from "@/queries/user.queries"

export default async function Layout({
    children,
}: {
    children: React.ReactNode
}) {
    const userRes = await getCurrentUser()
    const user = userRes?.data || null

    return (
        <>
            <Navbar user={user} />
            <main className="min-h-screen">
                {children}
            </main>
            <Footer />
        </>
    )
}