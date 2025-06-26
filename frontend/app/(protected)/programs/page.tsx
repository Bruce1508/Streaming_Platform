"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Search, Star, ChevronRight, ChevronLeft } from 'lucide-react';
import Image from 'next/image';
import { useSession } from 'next-auth/react';
import LandingNavBar from '@/components/landing/LandingNavBar';
import { programs, Course } from '@/constants/programData';
import { useRouter } from 'next/navigation';

const CoursesPage = () => {
    const { data: session } = useSession();
    const [courses, setCourses] = useState<Course[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filters, setFilters] = useState({
        level: '',
        difficulty: '',
        delivery: '',
        school: [] as string[],
        course: '',
        sort: 'relevance'
    });
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const resultsRef = useRef<HTMLDivElement>(null);
    const coursesPerPage = 10;
    const router = useRouter();

    useEffect(() => {
        // Chỉ fetch lần đầu
        setLoading(true);
        setTimeout(() => {
            setCourses(programs);
            setLoading(false);
        }, 1000);
    }, []);

    const getDifficultyColor = (difficulty: string) => {
        switch (difficulty) {
            case 'beginner': return 'bg-green-100 text-green-800';
            case 'intermediate': return 'bg-yellow-100 text-yellow-800';
            case 'advanced': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const filteredCourses = courses.filter(course => {
        const matchesSearch = course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            course.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
            course.description.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesLevel = !filters.level || course.level === filters.level;
        const matchesDifficulty = !filters.difficulty || course.difficulty === filters.difficulty;
        const matchesDelivery = !filters.delivery || course.delivery.includes(filters.delivery);
        const matchesSchool = !filters.school || course.programs.some(prog => filters.school.includes(prog.program.name));

        return matchesSearch && matchesLevel && matchesDifficulty && matchesDelivery && matchesSchool;
    });

    // Calculate pagination
    const indexOfLastCourse = currentPage * coursesPerPage;
    const indexOfFirstCourse = indexOfLastCourse - coursesPerPage;
    const currentCourses = filteredCourses.slice(indexOfFirstCourse, indexOfLastCourse);

    // Update total pages when filtered courses change
    useEffect(() => {
        setTotalPages(Math.ceil(filteredCourses.length / coursesPerPage));
        setCurrentPage(1); // Reset to first page when filters change
    }, [filteredCourses.length]);

    const handlePageChange = (pageNumber: number) => {
        setCurrentPage(pageNumber);
        // Scroll to top of results
        resultsRef.current?.scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
        });
    };

    const programFilters = [
        "Aviation", "Business", "Creative Arts, Animation & Design",
        "Education, Community & Social Services",
        "Engineering Technology", "Fashion & Esthetics", "Health & Wellness",
        "Hospitality & Tourism",
        "Information Technology", "Law, Administration & Public Safety",
        "Liberal Arts & University Transfers", "Media & Communications",
        "Science"
    ];
    const sortOptions = [
        { label: "Relevance", value: "relevance" },
        { label: "Popularity", value: "popularity" },
        { label: "Date", value: "date" }
    ];

    const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            resultsRef.current?.scrollIntoView({ 
                behavior: 'smooth',
                block: 'start'
            });
        }
    };

    const handleFilterClick = (filter: string) => {
        if (filters.school.includes(filter)) {
            setFilters(f => ({ ...f, school: f.school.filter((item) => item !== filter) }));
        } else {
            setFilters(f => ({ ...f, school: [...f.school, filter] }));
        }
        // Scroll to results after a short delay to ensure state update
        setTimeout(() => {
            resultsRef.current?.scrollIntoView({ 
                behavior: 'smooth',
                block: 'start'
            });
        }, 100);
    };

    const clearAllFilters = () => {
        setFilters({
            level: '',
            difficulty: '',
            delivery: '',
            school: [],
            course: '',
            sort: 'relevance'
        });
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 p-6">
                <div className="max-w-7xl mx-auto">
                    <div className="animate-pulse">
                        <div className="h-8 bg-gray-300 rounded w-1/4 mb-6"></div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {[1, 2, 3, 4, 5, 6].map(i => (
                                <div key={i} className="bg-white rounded-lg shadow-md p-6">
                                    <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
                                    <div className="h-4 bg-gray-300 rounded w-1/2 mb-4"></div>
                                    <div className="h-20 bg-gray-300 rounded mb-4"></div>
                                    <div className="flex justify-between">
                                        <div className="h-4 bg-gray-300 rounded w-1/4"></div>
                                        <div className="h-4 bg-gray-300 rounded w-1/4"></div>
                                    </div>
                                </div>
                            ))}
                        </div>
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
                    </div>
                    {/* Program Filters */}
                    <div className="flex flex-wrap gap-4 mb-4 justify-center">
                        {programFilters.map((filter) => (
                            <button
                                key={filter}
                                className={`px-6 py-3 rounded-xl cursor-pointer font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg
                                    ${filters.school.includes(filter)
                                        ? "bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-orange-500/50 shadow-xl border-2 border-orange-400"
                                        : "bg-gradient-to-r from-gray-800/80 to-gray-700/80 text-gray-200 hover:from-orange-600/20 hover:to-red-600/20 hover:text-white border-2 border-gray-600/50 hover:border-orange-400/50 hover:shadow-orange-500/25 hover:shadow-xl backdrop-blur-sm"
                                    }
                                `}
                                onClick={() => handleFilterClick(filter)}
                            >
                                {filter}
                            </button>
                        ))}
                    </div>
                    
                    
                </div>
            </div>
            {/* Course List */}
            <div className="max-w-6xl mx-auto px-6 pb-20 pt-10 flex flex-col gap-10" ref={resultsRef}>
                {/* Sort By - Only show when there are courses */}
                {filteredCourses.length > 0 && (
                    <div className="mb-2">
                        <span className="font-semibold mr-4">Sort By</span>
                        {sortOptions.map(opt => (
                            <button
                                key={opt.value}
                                className={`px-4 py-2 rounded-lg font-medium transition-colors mr-2 cursor-pointer
                                    ${filters.sort === opt.value || (!filters.sort && opt.value === "relevance")
                                        ? "bg-[#36454F] text-white"
                                        : "bg-[#36454F]/60 text-gray-300 hover:bg-[#232425]"}
                                `}
                                onClick={() => setFilters(f => ({ ...f, sort: opt.value }))}
                            >
                                {opt.label}
                            </button>
                        ))}
                    </div>
                )}

                {/* Course List */}
                {filteredCourses.length > 0 ? (
                    <div className="flex flex-col gap-8">
                        {currentCourses.map((course, idx) => (
                            <div
                                key={course._id}
                                className="flex flex-col md:flex-row items-stretch rounded-xl overflow-hidden shadow-lg bg-[#232425] transition-transform duration-300 ease-in-out hover:shadow-2xl hover:scale-105 cursor-pointer"
                                onClick={() => router.push(`/programs/${course._id}`)}
                            >
                                {/* Info */}
                                <div className="flex-1 p-10 flex flex-col justify-center">
                                    <span className="text-sm text-gray-400 mb-1">{course.school.name}</span>
                                    <h2 className="text-xl font-bold mb-1">{course.name}</h2>
                                    <p className="text-gray-200 font-medium mb-2">{course.code}</p>
                                    <p className="text-gray-300 mb-4">{course.description}</p>
                                    <div className="flex flex-wrap gap-4 text-sm text-gray-400">
                                        <span>{course.credits} credits</span>
                                        <span>Level {course.level}</span>
                                        <span className="capitalize">{course.difficulty}</span>
                                        <span>{course.stats.enrollmentCount} enrolled</span>
                                        <span>
                                            <Star className="inline w-4 h-4 text-yellow-400 mr-1" />
                                            {course.stats.rating.average} ({course.stats.rating.count})
                                        </span>
                                    </div>
                                </div>
                                {/* Image */}
                                <div className="md:w-64 h-64 flex-shrink-0 flex items-center justify-center">
                                    <Image
                                        src={course.imageUrl}
                                        alt={course.name}
                                        width={256}
                                        height={192}
                                        className="object-cover object-center w-full h-full rounded-none"
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    /* No results message */
                    <div className="text-center py-20">
                        <div className="text-6xl mb-4">🔍</div>
                        <h3 className="text-2xl font-bold text-gray-300 mb-2">No courses found</h3>
                        <p className="text-gray-400">
                            Try adjusting your search terms or filters to find what you're looking for.
                        </p>
                    </div>
                )}

                {/* Pagination - Only show when there are courses and multiple pages */}
                {filteredCourses.length > 0 && totalPages > 1 && (
                    <div className="flex justify-center items-center gap-4 mt-10">
                        {/* Previous button */}
                        <button
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                            className={`px-4 py-2 rounded-lg font-medium transition-colors cursor-pointer ${
                                currentPage === 1
                                    ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                                    : 'bg-[#36454F] text-white hover:bg-[#232425]'
                            }`}
                        >
                            <ChevronLeft className="w-5 h-5" />
                        </button>

                        {/* Page numbers */}
                        <div className="flex gap-2">
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                <button
                                    key={page}
                                    onClick={() => handlePageChange(page)}
                                    className={`px-3 py-2 rounded-lg font-medium transition-colors cursor-pointer ${
                                        currentPage === page
                                            ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white'
                                            : 'bg-[#36454F] text-gray-300 hover:bg-[#232425]'
                                    }`}
                                >
                                    {page}
                                </button>
                            ))}
                        </div>

                        {/* Next button */}
                        <button
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className={`px-4 py-2 rounded-lg font-medium transition-colors cursor-pointer ${
                                currentPage === totalPages
                                    ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                                    : 'bg-[#36454F] text-white hover:bg-[#232425]'
                            }`}
                        >
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    </div>
                )}

                {/* Results info - Only show when there are courses */}
                {filteredCourses.length > 0 && (
                    <div className="text-center text-gray-400 mt-4">
                        Showing {indexOfFirstCourse + 1} to {Math.min(indexOfLastCourse, filteredCourses.length)} of {filteredCourses.length} courses
                    </div>
                )}
            </div>
        </div>
    );
};

export default CoursesPage; 

