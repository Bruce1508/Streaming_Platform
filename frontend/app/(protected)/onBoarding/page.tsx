'use client'

import { completeOnboarding } from "@/lib/api"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import toast from "react-hot-toast"
import { useState } from "react"
import useAuthUser from "@/hooks/useAuthUser"

const Page = () => {

    const { authUser } = useAuthUser();
    const queryClient = useQueryClient();

    const [formState, setFormState] = useState({
        fullName: authUser?.fullName || "",
        bio: authUser?.bio || "",
        nativeLanguage: authUser?.nativeLanguage || "",
        learningLanguage: authUser?.learningLanguage || "",
        location: authUser?.location || "",
        profilePic: authUser?.profilePic || "",
    });

    const { mutate: onBoardingMutation, isPending } = useMutation({
        mutationFn: completeOnboarding,
        onSuccess: () => {
            toast.success("Profile onboarded successfully");
            queryClient.invalidateQueries({ queryKey: ["authUser"] });
        }
    })

    return (
        <div className="min-h-screen bg-base-100 flex items-center justify-center p-4">
            <div className="card bg-base-200 w-full max-w-3xl shadow-xl">
                <div className="card-body p-6 sm:p-8">
                    <h1 className="text-2xl sm:text-3xl font-bold text-center mb-6">Complete Your Profile</h1>

                    
                </div>
            </div>
        </div>
    )
}

export default Page