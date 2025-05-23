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
                            <div className="relative w-32 h-32 rounded-full bg-base-300 overflow-hidden">
                                {profilePic ? (
                                    <Image
                                        src={profilePic}
                                        alt="Profile Preview"
                                        fill
                                        priority
                                        className="object-cover"
                                        sizes="(max-width: 768px) 100vw, 33vw"
                                    />
                                ) : (
                                    <div className="flex items-center justify-center w-full h-full">
                                        <CameraIcon className="w-12 h-12 text-base-content opacity-40" />
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
                                    <ShuffleIcon className="w-4 h-4 mr-2" />
                                    Generate Random Avatar
                                </button>
                            </div>
                        </div>

                        {/* FULL NAME */}
                        <fieldset className="fieldset">
                            <label className="label" htmlFor="fullName">
                                <span>Full Name *</span>
                            </label>
                            <input
                                id="fullName"
                                type="text"
                                name="fullName"
                                defaultValue={authUser?.fullName || ""}
                                className="input w-full"
                                placeholder="Your full name"
                                required
                            />
                            {state.errors?.fullName && (
                                <label className="label">
                                    <span className="text-error">
                                        {state.errors.fullName}
                                    </span>
                                </label>
                            )}
                        </fieldset>

                        {/* BIO */}
                        <fieldset className="fieldset">
                            <label className="label" htmlFor="bio">
                                <span>Bio</span>
                            </label>
                            <textarea
                                id="bio"
                                name="bio"
                                defaultValue={authUser?.bio || ""}
                                className="textarea w-full h-24 resize-none"
                                placeholder="Tell others about yourself and your language learning goals"
                            />
                        </fieldset>

                        {/* LANGUAGES */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* NATIVE LANGUAGE */}
                            <fieldset className="fieldset">
                                <label className="label" htmlFor="nativeLanguage">
                                    <span>Native Language *</span>
                                </label>
                                <select
                                    id="nativeLanguage"
                                    name="nativeLanguage"
                                    className="select w-full"
                                    required
                                    defaultValue={authUser?.nativeLanguage || ""}
                                >
                                    <option value="" disabled hidden>Select your native language</option>
                                    {LANGUAGES.map((lang) => (
                                        <option key={`native-${lang}`} value={lang.toLowerCase()}>
                                            {lang}
                                        </option>
                                    ))}
                                </select>
                                {state.errors?.nativeLanguage && (
                                    <label className="label">
                                        <span className="text-error">
                                            {state.errors.nativeLanguage}
                                        </span>
                                    </label>
                                )}
                            </fieldset>
                            {/* LEARNING LANGUAGE */}
                            <fieldset className="fieldset">
                                <label className="label" htmlFor="learningLanguage">
                                    <span>Learning Language *</span>
                                </label>
                                <select
                                    id="learningLanguage"
                                    name="learningLanguage"
                                    className="select w-full"
                                    required
                                    defaultValue={authUser?.learningLanguage || ""}
                                >
                                    <option value="" disabled hidden>Select the language you like to learn</option>
                                    {LANGUAGES.map((lang) => (
                                        <option key={`learning-${lang}`} value={lang.toLowerCase()}>
                                            {lang}
                                        </option>
                                    ))}
                                </select>
                                {state.errors?.learningLanguage && (
                                    <label className="label">
                                        <span className="text-error">
                                            {state.errors.learningLanguage}
                                        </span>
                                    </label>
                                )}
                            </fieldset>
                        </div>

                        {/* LOCATION */}
                        <fieldset className="fieldset">
                            <label className="label" htmlFor="location">
                                <span>Location</span>
                            </label>
                            <div className="relative">
                                <MapPinIcon className="absolute top-1/2 transform -translate-y-1/2 left-3 w-5 h-5 text-base-content opacity-70" />
                                <input
                                    id="location"
                                    type="text"
                                    name="location"
                                    defaultValue={authUser?.location || ""}
                                    className="input w-full pl-[2.5rem]"
                                    placeholder="City, Country"
                                />
                            </div>
                        </fieldset>

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