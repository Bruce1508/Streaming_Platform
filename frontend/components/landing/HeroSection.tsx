'use client';

import { Button } from "@/components/ui/Button";
import { SearchIcon } from "lucide-react";

const HeroSection = () => {
    return (
        <section className="min-h-screen w-full flex flex-col justify-center items-center">
            {/* Background Image */}
            <div
                className="absolute inset-0 bg-cover bg-center z-0"
                style={{ backgroundImage: "url('https://images.unsplash.com/photo-1562774053-701939374585?q=80&w=2070&auto=format&fit=crop')" }}
            >
                {/* Overlay */}
                <div className="absolute inset-0 bg-black/60"></div>
            </div>

            {/* Content */}
            <div className="relative z-10 flex flex-col items-center text-center px-4">
                <h1 className="text-5xl md:text-6xl font-extrabold !leading-tight tracking-tight">
                    Find your course materials
                </h1>
                
                {/* Search Bar Wrapper */}
                <div className="mt-8 w-full max-w-2xl">
                    <div className="
                        relative 
                        bg-white/20 
                        backdrop-blur-sm 
                        rounded-full 
                        transition-all duration-300
                        focus-within:bg-white 
                        focus-within:ring-2 
                        focus-within:ring-white 
                        focus-within:shadow-lg
                    ">
                        <SearchIcon className="absolute left-6 top-1/2 -translate-y-1/2 h-6 w-6 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Enter course code or program name"
                            className="
                                w-full h-16 pl-16 pr-40 rounded-full text-lg 
                                bg-transparent text-white placeholder-gray-200 
                                focus:text-black focus:placeholder-gray-500
                                focus:outline-none
                            "
                        />
                        <Button 
                            size="lg" 
                            className="cursor-pointer absolute right-2 top-1/2 -translate-y-1/2 rounded-full h-12 px-8 bg-white/80 border border-white/70 text-primary font-bold shadow hover:bg-white/60 transition-colors"
                        >
                            Search
                        </Button>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default HeroSection; 