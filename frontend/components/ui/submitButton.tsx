'use client';

import { useFormStatus } from "react-dom";

interface submitButtonProps {
    text: string;
    loadingText?: string;
}

export default function SubmitButton({text, loadingText = "Loading..."}: submitButtonProps) {
    const { pending } = useFormStatus();

    return (
        <button
            className="btn btn-primary w-full"
            type="submit"
            disabled={pending}
        >
            {pending ? (
                <>
                    <span className="loading loading-spinner loading-xs"></span>
                    {loadingText}
                </>
            ) : (
                text
            )}
        </button>
    );
}