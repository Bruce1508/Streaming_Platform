'use client';

import React from 'react';
import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "@/lib/axiosInstance";

export default function Home() {
  const { data, isLoading, error } = useQuery({
        queryKey: ["todos"],
        queryFn: async () => {
            const res = await axiosInstance.get("/auth/me");
            return res.data;
        },
        retry: false,
    });

    console.log(data);

  return (
    <main>
      <h1>hello</h1>
    </main>
  )
}