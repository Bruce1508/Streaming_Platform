'use client'

import { SessionProvider } from "next-auth/react"

export default function NextAuthSessionProvider({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <SessionProvider // Refetch session mỗi 5 phút thay vì liên tục
            refetchInterval={5 * 60} // 5 minutes
            refetchOnWindowFocus={false} // Tắt refetch khi focus window>
        >
            {children}
        </ SessionProvider>
    );
}