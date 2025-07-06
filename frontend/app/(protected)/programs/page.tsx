"use client";

import React, { useState, useEffect, useRef } from "react";
import { Search } from "lucide-react";
import LandingNavBar from "@/components/landing/LandingNavBar";
import { Button } from "@/components/ui/Button";
import PageLoader from "@/components/ui/PageLoader";
import { programAPI } from "@/lib/api";
import { Program } from "@/types/Program";

// Simple FilterDropDown component
interface FilterDropDownProps {
    options: { label: string; value: string }[];
    value: string;
    onChange: (value: string) => void;
    placeholder: string;
}

const FilterDropDown: React.FC<FilterDropDownProps> = ({ options, value, onChange, placeholder }) => {
    return (
        <select
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-[#232425] text-white"
        >
            <option value="">{placeholder}</option>
            {options.map((option) => (
                <option key={option.value} value={option.value}>
                    {option.label}
                </option>
            ))}
        </select>
    );
};

const ProgramsPage = () => {
    // State management
    const [programs, setPrograms] = useState<Program[]>([]);
    const [filteredPrograms, setFilteredPrograms] = useState<Program[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    
    // Filter states
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedSchool, setSelectedSchool] = useState("");
    const [selectedLevel, setSelectedLevel] = useState("");
    const [selectedCredential, setSelectedCredential] = useState("");
    const [sortBy, setSortBy] = useState("name");

    // Pagination states
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(0);

    // Ref for scrolling to results
    const resultsRef = useRef<HTMLDivElement>(null);

    // Fetch programs from API
    const fetchPrograms = async (page = 1) => {
        try {
            setLoading(true);
            setError(null);
            
            // Build clean params object without undefined values
            const params: Record<string, any> = {
                page,
                limit: 12,
                sortBy: sortBy || 'name',
                sortOrder: 'asc'
            };

            // Only add filter params if they have values
            if (searchTerm && searchTerm.trim()) {
                params.search = searchTerm.trim();
            }
            if (selectedSchool) {
                params.school = selectedSchool;
            }
            if (selectedLevel) {
                params.level = selectedLevel;
            }
            if (selectedCredential) {
                params.credential = selectedCredential;
            }
            
            const response = await programAPI.getPrograms(params);

            if (response.success) {
                setPrograms(response.data.data);
                setFilteredPrograms(response.data.data);
                setCurrentPage(response.data.pagination.currentPage);
                setTotalPages(response.data.pagination.totalPages);
                setTotalItems(response.data.pagination.totalItems);
            } else {
                setError('Failed to fetch programs');
            }
        } catch (err) {
            console.error('Error fetching programs:', err);
            setError('Error loading programs. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    // Initial load
    useEffect(() => {
        fetchPrograms(1);
    }, []);

    // Refetch when filters change
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            fetchPrograms(1);
        }, 500); // Debounce search

        return () => clearTimeout(timeoutId);
    }, [searchTerm, selectedSchool, selectedLevel, selectedCredential, sortBy]);

    // Get unique values for filter dropdowns
    const getUniqueValues = (key: keyof Program): string[] => {
        const values = programs.map(program => {
            if (key === 'campus') {
                return program[key].join(', '); // Join campus array
            }
            return program[key] as string;
        }).filter(Boolean);
        return [...new Set(values)].sort();
    };

    // Handle pagination
    const handlePageChange = (page: number) => {
        fetchPrograms(page);
    };

    // Handle search key down
    const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            fetchPrograms(1);
            // Scroll to results after a short delay to ensure state update
            setTimeout(() => {
                resultsRef.current?.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }, 100);
        }
    };

    // Handle search button click
    const handleSearchClick = () => {
        fetchPrograms(1);
        // Scroll to results after a short delay to ensure state update
        setTimeout(() => {
            resultsRef.current?.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }, 100);
    };

    // Filter options
    const schoolOptions = getUniqueValues('school').map(school => ({ 
        label: school, 
        value: school 
    }));

    const levelOptions = getUniqueValues('level').map(level => ({ 
        label: level, 
        value: level 
    }));

    const credentialOptions = getUniqueValues('credential').map(credential => ({ 
        label: credential, 
        value: credential 
    }));

    const sortOptions = [
        { label: "Name", value: "name" },
        { label: "Code", value: "code" },
        { label: "School", value: "school" },
        { label: "Level", value: "level" }
    ];

    // Get program image based on program name/category
    const getProgramImage = (programName: string, school: string): string => {
        const name = programName.toLowerCase();
        const schoolName = school.toLowerCase();
        
        // Technology & IT Programs
        if (name.includes('computer') || name.includes('software') || name.includes('information technology') || 
            name.includes('cybersecurity') || name.includes('data') || name.includes('programming') || 
            name.includes('web') || name.includes('network') || name.includes('it ')) {
            return 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=250&fit=crop&crop=center';
        }
        
        // Business & Management
        if (name.includes('business') || name.includes('management') || name.includes('marketing') || 
            name.includes('finance') || name.includes('accounting') || name.includes('administration') ||
            name.includes('entrepreneurship') || name.includes('economics')) {
            return 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=250&fit=crop&crop=center';
        }
        
        // Health & Medical
        if (name.includes('health') || name.includes('medical') || name.includes('nursing') || 
            name.includes('pharmacy') || name.includes('dental') || name.includes('therapy') ||
            name.includes('healthcare') || name.includes('medicine')) {
            return 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=250&fit=crop&crop=center';
        }
        
        // Engineering & Technology
        if (name.includes('engineering') || name.includes('mechanical') || name.includes('electrical') || 
            name.includes('civil') || name.includes('chemical') || name.includes('aerospace') ||
            name.includes('automotive') || name.includes('manufacturing')) {
            return 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400&h=250&fit=crop&crop=center';
        }
        
        // Creative Arts & Design
        if (name.includes('design') || name.includes('art') || name.includes('creative') || 
            name.includes('animation') || name.includes('graphic') || name.includes('fashion') ||
            name.includes('interior') || name.includes('photography') || name.includes('media')) {
            return 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400&h=250&fit=crop&crop=center';
        }
        
        // Hospitality & Tourism
        if (name.includes('hospitality') || name.includes('tourism') || name.includes('hotel') || 
            name.includes('culinary') || name.includes('chef') || name.includes('restaurant') ||
            name.includes('food') || name.includes('beverage')) {
            return 'https://images.unsplash.com/photo-1551218808-94e220e084d2?w=400&h=250&fit=crop&crop=center';
        }
        
        // Education & Social Services
        if (name.includes('education') || name.includes('teaching') || name.includes('social') || 
            name.includes('community') || name.includes('psychology') || name.includes('counseling') ||
            name.includes('child') || name.includes('early childhood')) {
            return 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=400&h=250&fit=crop&crop=center';
        }
        
        // Aviation & Transportation
        if (name.includes('aviation') || name.includes('pilot') || name.includes('aircraft') || 
            name.includes('transportation') || name.includes('logistics') || name.includes('supply chain')) {
            return 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=400&h=250&fit=crop&crop=center';
        }
        
        // Law & Public Safety
        if (name.includes('law') || name.includes('legal') || name.includes('police') || 
            name.includes('security') || name.includes('justice') || name.includes('paralegal') ||
            name.includes('public safety') || name.includes('criminal')) {
            return 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=400&h=250&fit=crop&crop=center';
        }
        
        // Science & Research
        if (name.includes('science') || name.includes('biology') || name.includes('chemistry') || 
            name.includes('physics') || name.includes('research') || name.includes('laboratory') ||
            name.includes('environmental') || name.includes('biotechnology')) {
            return 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=400&h=250&fit=crop&crop=center';
        }
        
        // Default image for general programs
        return 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=400&h=250&fit=crop&crop=center';
    };

    if (loading && programs.length === 0) {
        return <PageLoader />;
    }

    if (error) {
        return (
            <div className="min-h-screen bg-[#1a1a1a] text-white">
                <div className="sticky top-0 z-30 bg-[#18191A]">
                    <LandingNavBar />
                </div>
                <div className="h-20" />
                <div className="container mx-auto px-4 py-8">
                    <div className="text-center">
                        <h2 className="text-2xl font-bold text-red-400 mb-4">Error</h2>
                        <p className="text-gray-300 mb-4">{error}</p>
                        <Button onClick={() => fetchPrograms(1)}>
                            Try Again
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#1a1a1a] text-white">
            <div className="sticky top-0 z-30 bg-[#18191A]">
                <LandingNavBar />
            </div>
            <div className="h-20" />
            <div className="border-b border-white/10 w-full" />
            
            {/* Header */}
            <div className="w-full border-b border-[#232425] min-h-screen flex items-center justify-center">
                <div className="max-w-6xl mx-auto px-6 py-30 text-center">
                    <h1 className="text-8xl font-bold mb-5">Programs Reviews</h1>
                    <p className="text-gray-300 mb-15 max-w-full mx-auto text-lg">
                        Explore a wealth of resources shared by your peers, categorized by program and course.
                    </p>
                    <div className="relative w-full max-w-2xl mb-10 mx-auto">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            placeholder="Search for programs or materials..."
                            className="w-full pl-12 pr-4 py-5 rounded-full bg-[#232425] text-white placeholder-gray-400 focus:ring-2 focus:ring-amber-50 outline-none transition cursor-text"
                            onKeyDown={handleSearchKeyDown}
                        />
                        <button
                            onClick={handleSearchClick}
                            className="absolute right-2 top-1/2 -translate-y-1/2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white px-4 py-2 rounded-full transition-colors"
                        >
                            Search
                        </button>
                    </div>
                </div>
            </div>

            {/* Results Section */}
            <div ref={resultsRef} className="max-w-6xl mx-auto px-6 pb-20 pt-10">
                {/* Filters */}
                <div className="mb-8 bg-[#232425] rounded-lg shadow-sm border border-[#36454F] p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
                        {/* School Filter */}
                        <FilterDropDown
                            options={schoolOptions}
                            value={selectedSchool}
                            onChange={setSelectedSchool}
                            placeholder="All Schools"
                        />

                        {/* Level Filter */}
                        <FilterDropDown
                            options={levelOptions}
                            value={selectedLevel}
                            onChange={setSelectedLevel}
                            placeholder="All Levels"
                        />

                        {/* Credential Filter */}
                        <FilterDropDown
                            options={credentialOptions}
                            value={selectedCredential}
                            onChange={setSelectedCredential}
                            placeholder="All Credentials"
                        />

                        {/* Sort */}
                        <FilterDropDown
                            options={sortOptions}
                            value={sortBy}
                            onChange={setSortBy}
                            placeholder="Sort by"
                        />
                    </div>
                </div>

                {/* Results Count */}
                <div className="mb-6">
                    <p className="text-gray-300">
                        Showing {filteredPrograms.length} of {totalItems} programs
                        {loading && <span className="ml-2 text-amber-400">Loading...</span>}
                    </p>
                </div>

                {/* Programs Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
                    {filteredPrograms.map((program, index) => (
                        <div
                            key={program._id}
                            className="group bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 border border-gray-200 overflow-hidden hover:scale-105 cursor-pointer transform hover:-translate-y-2"
                            style={{
                                animationDelay: `${index * 100}ms`,
                                animation: 'fadeInUp 0.6s ease-out forwards'
                            }}
                            onClick={() => {
                                window.location.href = `/programs/${program.programId}`;
                            }}
                        >
                            {/* Image Header */}
                            <div className="relative h-48 overflow-hidden">
                                <img 
                                    src={getProgramImage(program.name, program.school)}
                                    alt={program.name}
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                />
                                {/* Overlay gradient */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-60"></div>
                                
                                {/* Campus badge */}
                                {/* <div className="absolute top-4 left-4">
                                    <span className="inline-block bg-white/90 backdrop-blur-sm text-gray-800 text-xs font-semibold px-3 py-1 rounded-full shadow-lg">
                                        {program.campus.join(', ') || 'Multiple Campuses'}
                                    </span>
                                </div> */}
                                
                                {/* Program Code badge */}
                                <div className="absolute top-4 right-4">
                                    <span className="inline-block bg-gradient-to-r from-amber-400 to-orange-400 text-black text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                                        {program.code}
                                    </span>
                                </div>
                                
                                {/* Decorative elements */}
                                <div className="absolute bottom-0 right-0 w-20 h-20 bg-white/10 rounded-full translate-y-10 translate-x-10"></div>
                                <div className="absolute top-0 left-0 w-16 h-16 bg-white/5 rounded-full -translate-y-8 -translate-x-8"></div>
                            </div>

                            {/* Content */}
                            <div className="p-6 relative bg-white">
                                {/* Program Name */}
                                <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-amber-600 transition-colors duration-300">
                                    {program.name}
                                </h3>

                                {/* Overview */}
                                <p className="text-gray-600 text-sm mb-4 line-clamp-3 leading-relaxed">
                                    {program.overview}
                                </p>

                                {/* Additional Info with Icons */}
                                <div className="space-y-2 text-xs text-gray-500 mb-6">
                                    <div className="flex items-center space-x-2">
                                        <div className="w-4 h-4 bg-amber-100 rounded-full flex items-center justify-center">
                                            <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                                        </div>
                                        <span className="font-medium text-gray-700">Duration:</span>
                                        <span>{program.duration}</span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <div className="w-4 h-4 bg-orange-100 rounded-full flex items-center justify-center">
                                            <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                                        </div>
                                        <span className="font-medium text-gray-700">Level:</span>
                                        <span>{program.level}</span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <div className="w-4 h-4 bg-blue-100 rounded-full flex items-center justify-center">
                                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                        </div>
                                        <span className="font-medium text-gray-700">Campus:</span>
                                        <span className="line-clamp-1">{program.campus.join(', ') || 'Multiple Campuses'}</span>
                                    </div>
                                </div>

                                {/* Action Button */}
                                <div className="mt-6">
                                    <Button
                                        variant="default"
                                        size="sm"
                                        className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold py-3 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 group-hover:from-orange-500 group-hover:to-red-500"
                                    >
                                        <span className="flex items-center justify-center space-x-2">
                                            <span>View Details</span>
                                            <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                            </svg>
                                        </span>
                                    </Button>
                                </div>

                                {/* Hover overlay effect */}
                                <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-orange-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl pointer-events-none"></div>
                            </div>

                            {/* Bottom accent line */}
                            <div className="h-1 bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
                        </div>
                    ))}
                </div>

                {/* Empty State */}
                {filteredPrograms.length === 0 && !loading && (
                    <div className="text-center py-20">
                        <div className="text-6xl mb-4">🔍</div>
                        <h3 className="text-2xl font-bold text-gray-300 mb-2">No programs found</h3>
                        <p className="text-gray-400 mb-6">
                            Try adjusting your search terms or filters to find what you're looking for.
                        </p>
                        <Button
                            onClick={() => {
                                setSearchTerm("");
                                setSelectedSchool("");
                                setSelectedLevel("");
                                setSelectedCredential("");
                            }}
                            className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600"
                        >
                            Clear Filters
                        </Button>
                    </div>
                )}

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="flex justify-center items-center gap-4 mt-10">
                        <Button
                            variant="outline"
                            size="sm"
                            disabled={currentPage === 1 || loading}
                            onClick={() => handlePageChange(currentPage - 1)}
                            className="border-[#36454F] text-gray-300 hover:bg-[#36454F]"
                        >
                            Previous
                        </Button>
                        
                        <div className="flex gap-2">
                            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                const page = i + Math.max(1, currentPage - 2);
                                if (page > totalPages) return null;
                                
                                return (
                                    <Button
                                        key={page}
                                        variant={currentPage === page ? "default" : "outline"}
                                        size="sm"
                                        onClick={() => handlePageChange(page)}
                                        disabled={loading}
                                        className={currentPage === page 
                                            ? "bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600" 
                                            : "border-[#36454F] text-gray-300 hover:bg-[#36454F]"
                                        }
                                    >
                                        {page}
                                    </Button>
                                );
                            })}
                        </div>

                        <Button
                            variant="outline"
                            size="sm"
                            disabled={currentPage === totalPages || loading}
                            onClick={() => handlePageChange(currentPage + 1)}
                            className="border-[#36454F] text-gray-300 hover:bg-[#36454F]"
                        >
                            Next
                        </Button>
                    </div>
                )}
            </div>

            {/* Add CSS animations */}
            <style jsx>{`
                @keyframes fadeInUp {
                    from {
                        opacity: 0;
                        transform: translateY(30px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
            `}</style>
        </div>
    );
};

export default ProgramsPage;

