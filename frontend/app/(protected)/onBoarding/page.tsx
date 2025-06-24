'use client';

import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { completeOnBoarding } from "@/lib/api";
import { LoaderIcon, MapPinIcon, ShipWheelIcon, ShuffleIcon, CameraIcon } from "lucide-react";
import { LANGUAGES } from "@/constants";
import Image from "next/image";

// Define the error type for form errors
interface FormErrors {
    fullName?: string;
    bio?: string;
    nativeLanguage?: string;
    learningLanguage?: string;
    location?: string;
}

export default function OnboardingPage() {
    const router = useRouter();
    const { data: session, update } = useSession();
    const user = session?.user;
    
    const [profilePic, setProfilePic] = useState((user as any)?.profilePic || "");
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState<FormErrors>({});

    const handleRandomAvatar = () => {
        const idx = Math.floor(Math.random() * 100) + 1;
        const randomAvatar = `https://avatar.iran.liara.run/public/${idx}.png`;
        setProfilePic(randomAvatar);
        toast.success("Random profile picture generated!");
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);
        setErrors({});

        const formData = new FormData(e.currentTarget);
        const fullName = (formData.get('fullName') as string)?.trim();
        const bio = (formData.get('bio') as string)?.trim();
        const nativeLanguage = formData.get('nativeLanguage') as string;
        const learningLanguage = formData.get('learningLanguage') as string;
        const location = (formData.get('location') as string)?.trim();

        // Client-side validation
        const newErrors: FormErrors = {};
        if (!fullName) newErrors.fullName = 'Full name is required';
        if (!nativeLanguage) newErrors.nativeLanguage = 'Native language is required';
        if (!learningLanguage) newErrors.learningLanguage = 'Learning language is required';
        if (nativeLanguage === learningLanguage) {
            newErrors.learningLanguage = 'Learning language must be different from native language';
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            setIsLoading(false);
            return;
        }

        try {
            const result = await completeOnBoarding({
                fullName,
                bio: bio || "",
                nativeLanguage,
                learningLanguage,
                location: location || "",
                profilePic,
            });

            if (result.success && result.user) {
                // Update NextAuth session with new user data
                await update({
                    ...session,
                    user: {
                        ...session?.user,
                        ...result.user,
                        isOnboarded: true
                    }
                });
                
                toast.success("Profile completed successfully!");
                
                setTimeout(() => {
                    router.push('/dashboard');
                }, 1000);
            } else {
                toast.error(result.message || "Failed to complete onboarding");
            }
        } catch (error) {
            console.error('Onboarding error:', error);
            toast.error("An unexpected error occurred");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-base-100 flex items-center justify-center p-4">
            <div className="card bg-base-200 w-full max-w-3xl shadow-xl">
                <div className="card-body p-6 sm:p-8">
                    <h1 className="text-2xl sm:text-3xl font-bold text-center mb-6">
                        Complete Your Profile
                    </h1>

                    <form onSubmit={handleSubmit} className="space-y-6">
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

                            {/* Generate Random Avatar BTN */}
                            <button 
                                type="button" 
                                onClick={handleRandomAvatar} 
                                className="btn btn-accent"
                                disabled={isLoading}
                            >
                                <ShuffleIcon className="w-4 h-4 mr-2" />
                                Generate Random Avatar
                            </button>
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
                                defaultValue={(user as any)?.fullName || user?.name || ""}
                                className="input w-full"
                                placeholder="Your full name"
                                disabled={isLoading}
                            />
                            {errors.fullName && (
                                <label className="label">
                                    <span className="text-error text-sm">{errors.fullName}</span>
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
                                defaultValue={(user as any)?.bio || ""}
                                className="textarea w-full h-24 resize-none"
                                placeholder="Tell others about yourself and your study goals"
                                disabled={isLoading}
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
                                    defaultValue={(user as any)?.nativeLanguage || ""}
                                    disabled={isLoading}
                                >
                                    <option value="" disabled hidden>Select your native language</option>
                                    {LANGUAGES.map((lang) => (
                                        <option key={`native-${lang}`} value={lang.toLowerCase()}>
                                            {lang}
                                        </option>
                                    ))}
                                </select>
                                {errors.nativeLanguage && (
                                    <label className="label">
                                        <span className="text-error text-sm">{errors.nativeLanguage}</span>
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
                                    defaultValue={(user as any)?.learningLanguage || ""}
                                    disabled={isLoading}
                                >
                                    <option value="" disabled hidden>Select the language you want to learn</option>
                                    {LANGUAGES.map((lang) => (
                                        <option key={`learning-${lang}`} value={lang.toLowerCase()}>
                                            {lang}
                                        </option>
                                    ))}
                                </select>
                                {errors.learningLanguage && (
                                    <label className="label">
                                        <span className="text-error text-sm">{errors.learningLanguage}</span>
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
                                    defaultValue={(user as any)?.location || ""}
                                    className="input w-full pl-[2.5rem]"
                                    placeholder="City, Country"
                                    disabled={isLoading}
                                />
                            </div>
                        </fieldset>

                        {/* SUBMIT BUTTON */}
                        <button 
                            className="btn btn-primary w-full" 
                            disabled={isLoading} 
                            type="submit"
                        >
                            {isLoading ? (
                                <>
                                    <LoaderIcon className="animate-spin size-5 mr-2" />
                                    Completing Onboarding...
                                </>
                            ) : (
                                <>
                                    <ShipWheelIcon className="size-5 mr-2" />
                                    Complete Onboarding
                                </>
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}