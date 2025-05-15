'use client';

import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "@/lib/axiosInstance";

export default function Home() {
  const { data: authData, isLoading, error } = useQuery({
        queryKey: ["authUser"],
        queryFn: async () => {
            const res = await axiosInstance.get("/auth/me");
            return res.data;
        },
        retry: false,
    });

    const authUser = authData?.user;
    console.log(authUser);

    const isAuthenticated = Boolean(authUser);
    const isOnboarded = authUser?.isOnboarded;


  return (
    <main>
      <h1>hello</h1>
    </main>
  )
}