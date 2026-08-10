import { UsersTable } from "@/components/modules/dashboard/admin/users/users-table"
import { getAccessToken } from "@/lib/cookie"
import { getUsers } from "@/queries/admin.queries"
import { User } from "@/types/api.types"

export async function AdminUsersTableContent({
    searchParams,
}: {
    searchParams: Record<string, string | undefined>
}) {
    const accessToken = await getAccessToken()
    if (!accessToken) {
        return <p className="text-destructive">Unauthorized.</p>
    }

    const page = Number(searchParams.page ?? 1)
    const limit = Number(searchParams.limit ?? 10)

    const result = await getUsers(accessToken, {
        search: searchParams.search,
        role: searchParams.role,
        status: searchParams.status,
        isVerified:
            searchParams.isVerified === undefined
                ? undefined
                : searchParams.isVerified === "true",
        isApproved:
            searchParams.isApproved === undefined
                ? undefined
                : searchParams.isApproved === "true",
        sortBy: searchParams.sortBy,
        sortOrder: (searchParams.sortOrder as "asc" | "desc") ?? "desc",
        page,
        limit,
    })

    if (!result) {
        return <p className="text-destructive">Failed to load users.</p>
    }

    return (
        <UsersTable
            data={result.data as User[]}
            total={result.meta?.total ?? 0}
            limit={result.meta?.limit ?? limit}
        />
    )
}