import React from 'react';
import { AdminHostsContent } from './AdminHostsContent';
import { getAccessToken } from '@/lib/cookie';
import { getHosts } from '@/queries/host.queries';
type Props = {
    searchParams: Promise<{
        page?: string
        isApproved?: string
        q?: string
    }>
}

const AdminHostsPageContent = async ({ searchParams }: Props) => {
    const resolvedParams = await searchParams
    const page = resolvedParams.page ? parseInt(resolvedParams.page) : 1
    const isApprovedStr = resolvedParams.isApproved
    const isApproved = isApprovedStr === "true" ? true : isApprovedStr === "false" ? false : undefined
    const search = resolvedParams.q || ""

    const token = await getAccessToken()

    const hostsRes = await getHosts(token, {
        isApproved,
        page,
        limit: 10,
    })

    const hosts = hostsRes?.data ?? []
    const meta = hostsRes?.meta ?? { page: 1, limit: 10, total: 0 }
    return (
        <div>
            <AdminHostsContent
                initialHosts={hosts}
                meta={meta}
                currentPage={page}
                currentTab={isApprovedStr || "all"}
                searchQuery={search}
            />
        </div>
    );
};

export default AdminHostsPageContent;