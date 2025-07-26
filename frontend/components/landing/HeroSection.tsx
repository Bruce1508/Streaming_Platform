'use client';

import { Button } from "@/components/ui/Button";
import { MapPin, Edit3 } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { motion } from "motion/react";
import { ContainerTextFlip } from "../ui/container-text-flip";
import { InteractiveHoverButton } from "@/components/magicui/interactive-hover-button";
import Image from "next/image";

const HeroSection = () => {
    const words = ["University", "College", "Program"];

    return (
        <section className="w-full h-screen relative overflow-hidden flex items-center justify-center ">
            <div
                className={cn(
                    "absolute inset-0",
                    "[background-size:40px_40px]",
                    "[background-image:linear-gradient(to_right,#e4e4e7_1px,transparent_1px),linear-gradient(to_bottom,#e4e4e7_1px,transparent_1px)]",
                    "dark:[background-image:linear-gradient(to_right,#262626_1px,transparent_1px),linear-gradient(to_bottom,#262626_1px,transparent_1px)]",
                )}
            />
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-[#FAF9F6] [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)] dark:bg-black"></div>

            {/* Content Container - Left Aligned */}
            <div className="w-full relative z-10 flex items-center min-h-full">
                <div className="container mx-auto px-6 xl:px-16 2xl:px-32 w-full">
                    <div className="flex flex-col md:flex-row items-center w-full">
                        {/* Left: Content */}
                        <div className="flex-1 max-w-4xl text-left flex-shrink-0 min-h-[600px] flex flex-col justify-center">
                            {/* Main Heading */}
                            <motion.h1
                                initial={{ opacity: 0 }}
                                whileInView={{ opacity: 1 }}
                                className={cn(
                                    "relative mb-6 max-w-4xl text-left text-4xl leading-normal font-bold tracking-tight text-gray-900 md:text-6xl lg:text-7xl",
                                )}
                                layout
                            >
                                <div className="mb-2">
                                    Find Your Perfect
                                </div>
                                <div className="flex items-baseline flex-wrap xl:flex-nowrap">
                                    <span className="text-red-600 text-5xl md:text-6xl lg:text-7xl xl:text-8xl 2xl:text-9xl font-bold">Canadian</span>
                                    <div className="text-5xl md:text-6xl lg:text-7xl xl:text-8xl 2xl:text-9xl font-bold w-[280px] md:w-[420px] lg:w-[520px] xl:w-[640px] 2xl:w-[720px] ml-3">
                                        <ContainerTextFlip words={words} />
                                    </div>
                                </div>
                            </motion.h1>
                            {/* Description */}
                            <p className="text-base md:text-lg text-gray-7s00 mb-10 md:mb-15 max-w-xl leading-relaxed">
                                Honest insights from Canadian students to help you choose the right school, program, and path
                            </p>
                            {/* Action Buttons */}
                            <div className="flex flex-col sm:flex-row gap-4 justify-start items-start sm:items-center">
                                <Link href="/programs">
                                    <InteractiveHoverButton
                                        className="bg-red-600 text-white px-6 py-3 md:px-8 md:py-4 cursor-pointer rounded-lg font-semibold text-base md:text-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2"
                                    >
                                        Browse Schools
                                    </InteractiveHoverButton>
                                </Link>
                                <Link href="/programs">
                                    <Button
                                        variant="outline"
                                        size="lg"
                                        className="border-2 border-red-600 text-red-600 hover:bg-red-600 hover:text-white px-6 py-3 md:px-8 md:py-7 cursor-pointer rounded-lg font-semibold text-base md:text-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2"
                                    >

                                        Write a Review
                                    </Button>
                                </Link>
                            </div>
                        </div>
                        {/* Right: Iphone image */}
                        <div className="flex-1 hidden md:flex justify-center items-center flex-shrink-0 ml-7 mt-25">
                            <Image
                                src="/Iphone.png"
                                alt="iPhone"
                                className="h-[500px] lg:h-[700px] 2xl:h-[800px] 4xl:h-[1000px] w-auto object-cover drop-shadow-2xl"
                                width={500}
                                height={500}
                                priority
                            />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default HeroSection; 