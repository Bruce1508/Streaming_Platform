"use client";

import { Box, Lock, Search, Settings, Sparkles } from "lucide-react";
import { GlowingEffect } from "@/components/ui/glowing-effect";

export function GlowingEffectDemoSecond() {
    return (
        <div className="pb-20">
            <div className="container mx-auto px-6 xl:px-16 2xl:max-w-7xl">
                {/* Title Section */}
                <div className="w-full mb-16">
                    <h4 className="text-3xl lg:text-5xl lg:leading-tight max-w-5xl mx-auto text-center tracking-tight font-medium text-black dark:text-white">
                        <span>The Leading Platform</span> for <span className="text-red-600">Program &</span> <span className="text-red-600"> School</span> Reviews in <span className="text-red-600">Canada</span>
                    </h4>
                    <p className="text-sm lg:text-base max-w-2xl my-4 mx-auto text-neutral-500 text-center font-normal dark:text-neutral-300">
                        Browse real student reviews, compare programs, and help others make informed decisions about their education across Canada.
                    </p>
                </div>

                {/* Features Grid */}
                <ul className="grid grid-cols-1 grid-rows-none gap-4 md:grid-cols-12 md:grid-rows-3 lg:gap-4 xl:max-h-[34rem] xl:grid-rows-2">
                <GridItem
                    area="md:[grid-area:1/1/2/7] xl:[grid-area:1/1/2/5]"
                    icon={<Search className="h-4 w-4 text-black dark:text-neutral-400" />}
                    title="Find Your Perfect Program"
                    description="Search through thousands of programs from universities and colleges across Canada with advanced filters."
                />

                <GridItem
                    area="md:[grid-area:1/7/2/13] xl:[grid-area:2/1/3/5]"
                    icon={<Settings className="h-4 w-4 text-black dark:text-neutral-400" />}
                    title="Write Honest Reviews"
                    description="Share your real experience with courses, professors, and campus life to help future students."
                />

                <GridItem
                    area="md:[grid-area:2/1/3/7] xl:[grid-area:1/5/3/8]"
                    icon={<Box className="h-4 w-4 text-black dark:text-neutral-400" />}
                    title="Compare Programs Side-by-Side"
                    description="Make informed decisions by comparing tuition, requirements, and student satisfaction ratings."
                />

                <GridItem
                    area="md:[grid-area:2/7/3/13] xl:[grid-area:1/8/2/13]"
                    icon={<Sparkles className="h-4 w-4 text-black dark:text-neutral-400" />}
                    title="Real Student Insights"
                    description="Access authentic reviews from students who have experienced the programs firsthand."
                />

                <GridItem
                    area="md:[grid-area:3/1/4/13] xl:[grid-area:2/8/3/13]"
                    icon={<Lock className="h-4 w-4 text-black dark:text-neutral-400" />}
                    title="Rankings & Statistics"
                    description="View program rankings based on student reviews, employment rates, and satisfaction scores."
                />
            </ul>
            </div>
        </div>
    );
}

interface GridItemProps {
    area: string;
    icon: React.ReactNode;
    title: string;
    description: React.ReactNode;
}

const GridItem = ({ area, icon, title, description }: GridItemProps) => {
    return (
        <li className={`min-h-[14rem] list-none ${area}`}>
            <div className="relative h-full rounded-2xl border border-gray-200 shadow-md hover:shadow-lg transition-all duration-300 p-2 md:rounded-3xl md:p-3">
                <GlowingEffect
                    blur={0}
                    borderWidth={4}
                    spread={100}
                    glow={true}
                    disabled={false}
                    proximity={80}
                    inactiveZone={0.01}
                />
                <div className="border-0.75 relative flex h-full flex-col justify-between gap-6 overflow-hidden rounded-xl p-6 md:p-6 dark:shadow-[0px_0px_27px_0px_#2D2D2D]">
                    <div className="relative flex flex-1 flex-col justify-between gap-3">
                        <div className="w-fit rounded-lg border border-gray-600 p-2">
                            {icon}
                        </div>
                        <div className="space-y-3">
                            <h3 className="-tracking-4 pt-0.5 font-sans text-xl/[1.375rem] font-semibold text-balance text-black md:text-2xl/[1.875rem] dark:text-white">
                                {title}
                            </h3>
                            <h2 className="font-sans text-sm/[1.125rem] text-black md:text-base/[1.375rem] dark:text-neutral-400 [&_b]:md:font-semibold [&_strong]:md:font-semibold">
                                {description}
                            </h2>
                        </div>
                    </div>
                </div>
            </div>
        </li>
    );
};
