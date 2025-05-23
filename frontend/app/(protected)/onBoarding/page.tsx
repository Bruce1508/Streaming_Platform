'use client'

import { handleOnBoarded } from "@/app/actions/auth";
import { useEffect, useState } from "react";
import { useActionState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import useAuthUser from "@/hooks/useAuthUser";
import { useQueryClient } from "@tanstack/react-query";
import { LoaderIcon, MapPinIcon, ShipWheelIcon, ShuffleIcon, CameraIcon } from "lucide-react";
import { LANGUAGES } from "@/constants";
import Image from "next/image";

const Page = () => {
    const router = useRouter();
    const { authUser } = useAuthUser();
    const queryClient = useQueryClient();
    
    // Chỉ cần state cho avatar để có live preview và random button
    const [profilePic, setProfilePic] = useState(authUser?.profilePic || "");
    
    const initialState = {
        success: false,
        message: null,
        errors: {}
    };
    
    const [state, formAction, isPending] = useActionState(handleOnBoarded, initialState);

    // Generate random avatar
    const handleRandomAvatar = () => {
        const idx = Math.floor(Math.random() * 100) + 1;
        const randomAvatar = `https://avatar.iran.liara.run/public/${idx}.png`;
        setProfilePic(randomAvatar);
        toast.success("Random profile picture generated!");
    };

    useEffect(() => {
        if (state.success) {
            toast.success(state.message || "Profile completed successfully!");
            queryClient.invalidateQueries({ queryKey: ['authUser'] });
            
            const timer = setTimeout(() => {
                router.push('/');
            }, 2000);
            
            return () => clearTimeout(timer);
        }
    }, [state.success, state.message, router, queryClient]);

    return (
        <div className="min-h-screen bg-base-100 flex items-center justify-center p-4">
            <div className="card bg-base-200 w-full max-w-3xl shadow-xl">
                <div className="card-body p-6 sm:p-8">
                    <h1 className="text-2xl sm:text-3xl font-bold text-center mb-6">
                        Complete Your Profile
                    </h1>

                    {/* ERROR MESSAGE */}
                    {state.message && !state.success && (
                        <div className="alert alert-error mb-4">
                            <span>{state.message}</span>
                        </div>
                    )}

                    {/* SUCCESS MESSAGE */}
                    {state.success && (
                        <div className="alert alert-success mb-4">
                            <span>{state.message}</span>
                        </div>
                    )}

                    <form action={formAction} className="space-y-6">
                        {/* PROFILE PIC CONTAINER */}
                        <div className="flex flex-col items-center justify-center space-y-4">
                            {/* IMAGE PREVIEW */}
                            <div className="size-32 rounded-full bg-base-300 overflow-hidden">
                                {profilePic ? (
                                    <Image
                                        src={profilePic}
                                        alt="Profile Preview"
                                        fill
                                        priority
                                        className="w-full h-full object-cover" 
                                        sizes="(max-width: 768px) 100vw, 33vw"
                                    />
                                ) : (
                                    <div className="flex items-center justify-center h-full">
                                        <CameraIcon className="size-12 text-base-content opacity-40" />
                                    </div>
                                )}
                            </div>

                            {/* Hidden input để gửi profilePic data */}
                            <input 
                                type="hidden" 
                                name="profilePic" 
                                value={profilePic} 
                            />

                            {/* Generate Random Avatar BTN */}
                            <div className="flex items-center gap-2">
                                <button 
                                    type="button" 
                                    onClick={handleRandomAvatar} 
                                    className="btn btn-accent"
                                    disabled={isPending}
                                >
                                    <ShuffleIcon className="size-4 mr-2" />
                                    Generate Random Avatar
                                </button>
                            </div>
                        </div>

                        {/* FULL NAME */}
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Full Name *</span>
                            </label>
                            <input
                                type="text"
                                name="fullName"
                                defaultValue={authUser?.fullName || ""}
                                className="input input-bordered w-full"
                                placeholder="Your full name"
                                required
                            />
                            {state.errors?.fullName && (
                                <label className="label">
                                    <span className="label-text-alt text-error">
                                        {state.errors.fullName}
                                    </span>
                                </label>
                            )}
                        </div>

                        {/* BIO */}
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Bio</span>
                            </label>
                            <textarea
                                name="bio"
                                defaultValue={authUser?.bio || ""}
                                className="textarea textarea-bordered h-24"
                                placeholder="Tell others about yourself and your language learning goals"
                            />
                        </div>

                        {/* LANGUAGES */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* NATIVE LANGUAGE */}
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text">Native Language *</span>
                                </label>
                                <select
                                    name="nativeLanguage"
                                    defaultValue={authUser?.nativeLanguage || ""}
                                    className="select select-bordered w-full"
                                    required
                                >
                                    <option value="">Select your native language</option>
                                    {LANGUAGES.map((lang) => (
                                        <option key={`native-${lang}`} value={lang.toLowerCase()}>
                                            {lang}
                                        </option>
                                    ))}
                                </select>
                                {state.errors?.nativeLanguage && (
                                    <label className="label">
                                        <span className="label-text-alt text-error">
                                            {state.errors.nativeLanguage}
                                        </span>
                                    </label>
                                )}
                            </div>

                            {/* LEARNING LANGUAGE */}
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text">Learning Language *</span>
                                </label>
                                <select
                                    name="learningLanguage"
                                    defaultValue={authUser?.learningLanguage || ""}
                                    className="select select-bordered w-full"
                                    required
                                >
                                    <option value="">Select language you are learning</option>
                                    {LANGUAGES.map((lang) => (
                                        <option key={`learning-${lang}`} value={lang.toLowerCase()}>
                                            {lang}
                                        </option>
                                    ))}
                                </select>
                                {state.errors?.learningLanguage && (
                                    <label className="label">
                                        <span className="label-text-alt text-error">
                                            {state.errors.learningLanguage}
                                        </span>
                                    </label>
                                )}
                            </div>
                        </div>

                        {/* LOCATION */}
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Location</span>
                            </label>
                            <div className="relative">
                                <MapPinIcon className="absolute top-1/2 transform -translate-y-1/2 left-3 size-5 text-base-content opacity-70" />
                                <input
                                    type="text"
                                    name="location"
                                    defaultValue={authUser?.location || ""}
                                    className="input input-bordered w-full pl-10"
                                    placeholder="City, Country"
                                />
                            </div>
                        </div>

                        {/* SUBMIT BUTTON */}
                        <button 
                            className="btn btn-primary w-full" 
                            disabled={isPending} 
                            type="submit"
                        >
                            {!isPending ? (
                                <>
                                    <ShipWheelIcon className="size-5 mr-2" />
                                    Complete Onboarding
                                </>
                            ) : (
                                <>
                                    <LoaderIcon className="animate-spin size-5 mr-2" />
                                    Onboarding...
                                </>
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Page;