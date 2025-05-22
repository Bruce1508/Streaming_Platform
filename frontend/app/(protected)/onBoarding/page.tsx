'use client'

import { handleOnBoarded } from "@/app/actions/auth";
import { useEffect, useState } from "react";
import { useActionState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import useAuthUser from "@/hooks/useAuthUser";
import SubmitButton from "@/components/ui/submitButton";
import { useQueryClient } from "@tanstack/react-query";
import Image from "next/image";

const Page = () => {
    const router = useRouter();
    const { authUser } = useAuthUser();
    const queryClient = useQueryClient();

    // Chỉ state cho avatar để có live preview
    const [avatarUrl, setAvatarUrl] = useState(authUser?.profilePic || "");

    const initialState = {
        success: false,
        message: null,
        errors: {}
    };

    const [state, formAction] = useActionState(handleOnBoarded, initialState);

    // Generate random avatar
    const handleRandomAvatar = () => {
        const randomId = Math.floor(Math.random() * 1000);
        const newAvatarUrl = `https://api.dicebear.com/7.x/avataaars/svg?seed=${randomId}`;
        setAvatarUrl(newAvatarUrl);
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
                    <h1 className="text-2xl sm:text-3xl font-bold text-center mb-6">Complete Your Profile</h1>

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

                    <form action={formAction}>
                        {/* FULL NAME - Uncontrolled */}
                        <div className="form-control mb-4">
                            <label className="label">
                                <span className="label-text">Full Name</span>
                            </label>
                            <input
                                type="text"
                                name="fullName"
                                defaultValue={authUser?.fullName || ""}
                                className="input input-bordered w-full"
                                placeholder="Your full name"
                            />
                        </div>

                        {/* BIO - Uncontrolled */}
                        <div className="form-control mb-4">
                            <label className="label">
                                <span className="label-text">Bio</span>
                            </label>
                            <textarea
                                name="bio"
                                defaultValue={authUser?.bio || ""}
                                className="textarea textarea-bordered w-full"
                                placeholder="Tell us a bit about yourself"
                                rows={3}
                            />
                        </div>

                        {/* NATIVE LANGUAGE - Uncontrolled */}
                        <div className="form-control mb-4">
                            <label className="label">
                                <span className="label-text">Native Language *</span>
                            </label>
                            <select
                                name="nativeLanguage"
                                defaultValue={authUser?.nativeLanguage || ""}
                                className="select select-bordered w-full"
                                required
                            >
                                <option value="" disabled>Select your native language</option>
                                <option value="english">English</option>
                                <option value="spanish">Spanish</option>
                                <option value="french">French</option>
                                <option value="german">German</option>
                                <option value="japanese">Japanese</option>
                                <option value="korean">Korean</option>
                                <option value="chinese">Chinese</option>
                                <option value="vietnamese">Vietnamese</option>
                            </select>
                            {state.errors?.nativeLanguage && (
                                <label className="label">
                                    <span className="label-text-alt text-error">{state.errors.nativeLanguage}</span>
                                </label>
                            )}
                        </div>

                        {/* LEARNING LANGUAGE - Uncontrolled */}
                        <div className="form-control mb-4">
                            <label className="label">
                                <span className="label-text">Learning Language *</span>
                            </label>
                            <select
                                name="learningLanguage"
                                defaultValue={authUser?.learningLanguage || ""}
                                className="select select-bordered w-full"
                                required
                            >
                                <option value="" disabled>Select language you want to learn</option>
                                <option value="english">English</option>
                                <option value="spanish">Spanish</option>
                                <option value="french">French</option>
                                <option value="german">German</option>
                                <option value="japanese">Japanese</option>
                                <option value="korean">Korean</option>
                                <option value="chinese">Chinese</option>
                                <option value="vietnamese">Vietnamese</option>
                            </select>
                            {state.errors?.learningLanguage && (
                                <label className="label">
                                    <span className="label-text-alt text-error">{state.errors.learningLanguage}</span>
                                </label>
                            )}
                        </div>

                        {/* LOCATION - Uncontrolled */}
                        <div className="form-control mb-4">
                            <label className="label">
                                <span className="label-text">Location</span>
                            </label>
                            <input
                                type="text"
                                name="location"
                                defaultValue={authUser?.location || ""}
                                className="input input-bordered w-full"
                                placeholder="City, Country"
                            />
                        </div>

                        {/* PROFILE PICTURE - Controlled chỉ cho field này */}
                        <div className="form-control mb-6">
                            <label className="label">
                                <span className="label-text">Profile Picture</span>
                            </label>

                            {/* Live Preview */}
                            {avatarUrl && (
                                <div className="avatar mb-4">
                                    <div className="w-24 rounded-full">
                                        <Image 
                                            alt="Profile Picture Preview"
                                            src={authUser?.profilePic || ""}
                                        />
                                    </div>
                                </div>
                            )}

                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    name="profilePic"
                                    value={avatarUrl}
                                    onChange={(e) => setAvatarUrl(e.target.value)}
                                    placeholder="Profile picture URL"
                                    className="input input-bordered flex-1"
                                />
                                <button
                                    type="button"
                                    onClick={handleRandomAvatar}
                                    className="btn btn-accent"
                                >
                                    Random
                                </button>
                            </div>
                        </div>

                        <SubmitButton text="Complete Profile" loadingText="Saving..." />
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Page;