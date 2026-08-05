import { HostProfileForm } from "@/components/modules/profile/HostProfileForm"
import { Badge } from "@/components/ui/badge"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import type { HostProfile } from "@/types/api.types"


export async function HostProfileSection({
    hostProfile,
}: {
    hostProfile: HostProfile
    userId: string
}) {
    return (
        <Card className="rounded-2xl border-border/40 bg-card/40 backdrop-blur-md">
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle className="font-headline text-xl font-black">Host Profile</CardTitle>
                        <CardDescription>Your venue host information and credentials.</CardDescription>
                    </div>
                    <Badge
                        className={
                            hostProfile?.isApproved
                                ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20 dark:text-emerald-400 font-bold uppercase tracking-wider text-[10px] rounded-full"
                                : "bg-amber-500/10 text-amber-600 border-amber-500/20 dark:text-amber-400 font-bold uppercase tracking-wider text-[10px] rounded-full"
                        }
                    >
                        {hostProfile?.isApproved ? "Approved" : "Pending Approval"}
                    </Badge>
                </div>
            </CardHeader>
            <CardContent>
                <HostProfileForm hostProfile={hostProfile} />
            </CardContent>
        </Card>
    )
}