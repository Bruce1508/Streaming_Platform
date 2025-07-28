"use client"

import { Button } from "@/components/ui/Button";
import Link from "next/link";

export default function ReadyToGetStarted() {
    return (
        <section className="pt-20 pb-30 bg-[#F8FFE5] w-full">
            <div className="max-w-7xl mx-auto px-6">
                <div className="flex flex-col lg:flex-row items-start justify-between gap-16">
                    
                    {/* Left Side: Content */}
                    <div className="flex-1 max-w-lg">
                        <h2 className="text-3xl lg:text-4xl font-bold mb-6 text-gray-900">
                            Ready to get started?
                        </h2>
                        <p className="text-gray-600 text-lg mb-8 leading-relaxed">
                            Begin your Canadian education journey today. Explore programs, read student reviews, and connect with our community to make informed decisions.
                        </p>
                        
                        {/* Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4">
                            <Link href="/programs">
                                <Button className="bg-[#4CA771] hover:bg-[#013237] text-white cursor-pointer font-semibold px-6 py-3 rounded-lg transition-colors">
                                    Explore Programs →
                                </Button>
                            </Link>
                            <Link href="/contact">
                                <Button variant="ghost" className="text-[#013237] cursor-pointer hover:text-[#4CA771] font-semibold px-6 py-3 transition-colors">
                                    Contact Us →
                                </Button>
                            </Link>
                        </div>
                    </div>
                    
                    {/* Right Side: Feature Cards */}
                    <div className="flex-1 max-w-lg">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                            
                            {/* Card 1 */}
                            <div className= "text-[#013237]">
                                <div className="w-12 h-12 bg-[#013237] rounded-lg flex items-center justify-center mb-4">
                                    <svg className="w-6 h-6 text-[#F8FFE5]" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                    Find Your Perfect School
                                </h3>
                                <p className="text-gray-600 text-sm mb-4">
                                    Discover top Canadian universities and colleges with detailed program information and student reviews.
                                </p>
                                <Link href="/programs" className="text-red-600 text-sm hover:text-red-700 font-bold">
                                    Browse Schools →
                                </Link>
                            </div>

                            {/* Card 2 */}
                            <div>
                                <div className="w-12 h-12 bg-[#013237] rounded-lg flex items-center justify-center mb-4">
                                    <svg className="w-6 h-6 text-[#F8FFE5]" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                    Share Your Experience
                                </h3>
                                <p className="text-gray-600 text-sm mb-4">
                                    Help future students by writing honest reviews about your campus life and academic experience.
                                </p>
                                <Link href="/write-review" className="text-red-600 font-bold text-sm hover:text-red-700">
                                    Write Review →
                                </Link>
                            </div>

                        </div>
                    </div>
                    
                </div>
            </div>
        </section>
    );
} 