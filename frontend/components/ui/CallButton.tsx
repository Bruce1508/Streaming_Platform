'use client';

import { VideoIcon } from "lucide-react";

interface CallButtonProps {
    handleVideoCall: () => void;
}

const CallButton = ({ handleVideoCall }: CallButtonProps) => {
    return (
        <div className="absolute top-4 right-4 z-10">
            <button
                onClick={handleVideoCall}
                className="btn btn-primary btn-sm gap-2"
                title="Start video call"
            >
                <VideoIcon className="size-4" />
                Video Call
            </button>
        </div>
    );
};

export default CallButton;