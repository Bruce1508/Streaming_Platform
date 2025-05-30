import { MessageCircleIcon } from "lucide-react";

const ChatLoader = () => {
    return (
        <div className="flex flex-col items-center justify-center h-[calc(100vh-4rem)]">
            <div className="text-center space-y-4">
                <MessageCircleIcon className="size-16 mx-auto text-primary animate-pulse" />
                <div className="space-y-2">
                    <h3 className="text-xl font-semibold">Connecting to chat...</h3>
                    <p className="text-base-content opacity-70">
                        Setting up your secure conversation
                    </p>
                </div>
                <div className="flex justify-center">
                    <span className="loading loading-spinner loading-lg text-primary"></span>
                </div>
            </div>
        </div>
    );
};

export default ChatLoader;