'use client';

import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { motion } from "motion/react";
import { ContainerTextFlip } from "../ui/container-text-flip";
import { InteractiveHoverButton } from "@/components/magicui/interactive-hover-button";
import Image from "next/image";

const HeroSection = () => {
    const words = ["University", "College", "Program"];

    return (
        <section className="bg-[#ffffff] w-full h-[65vh] relative overflow-hidden flex items-center justify-center pt-10 pb-10">


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
                                <div className="mb-2 text-[#1d1d1f]">
                                    Find Your Perfect
                                </div>
                                <div className="flex items-baseline flex-wrap xl:flex-nowrap">
                                    <span className="text-[#1d1d1f] text-5xl md:text-6xl lg:text-7xl xl:text-8xl 2xl:text-9xl font-bold">Canadian</span>
                                    <div className="text-5xl md:text-6xl lg:text-7xl xl:text-8xl 2xl:text-9xl font-bold w-[280px] md:w-[420px] lg:w-[520px] xl:w-[640px] 2xl:w-[720px] ml-3">
                                        <ContainerTextFlip words={words} />
                                    </div>
                                </div>
                            </motion.h1>
                            {/* Description */}
                            <p className="text-base md:text-lg text-[#1d1d1f] mb-10 md:mb-15 max-w-xl leading-relaxed font-medium opacity-70">
                                Honest insights from Canadian students to help you choose the right school, program, and path
                            </p>
                            {/* Action Buttons */}
                            <div className="flex flex-col sm:flex-row gap-4 justify-start items-start sm:items-center">
                                <Link href="/programs">
                                    <InteractiveHoverButton
                                        className="text-[#FBFF12] bg-[#0C0F0A] px-6 py-3 md:px-8 md:py-3 cursor-pointer rounded-lg font-semibold text-base md:text-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2"
                                    >
                                        Browse Schools
                                    </InteractiveHoverButton>
                                </Link>
                                <Link href="/programs">
                                    <Button
                                        variant="outline"
                                        size="lg"
                                        className="text-[#FBFF12] bg-[#0C0F0A] border-none px-6 py-3 md:px-8 md:py-7 cursor-pointer rounded-lg font-semibold text-base md:text-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2"
                                    >

                                        Write a Review
                                    </Button>
                                </Link>
                            </div>
                        </div>
                        {/* Right: Iphone image */}
                        <div className="flex-1 hidden md:flex justify-center items-center flex-shrink-0 ml-7 mt-30">
                            <Image
                                src="/Iphone.png"
                                alt="iPhone"
                                className="h-[500px] lg:h-[700px] 2xl:h-[900px] 4xl:h-[1200px] w-auto object-cover drop-shadow-2xl"
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