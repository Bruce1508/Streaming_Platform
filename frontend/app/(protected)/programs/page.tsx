"use client";

import React, { useState, useEffect, useRef } from "react";
import { Search, ChevronDown } from "lucide-react";
import LandingNavBar from "@/components/landing/LandingNavBar";
import { Button } from "@/components/ui/Button";
import PageLoader from "@/components/ui/PageLoader";
import { programAPI } from "@/lib/api";
import { Program } from "@/types/Program";
import { Listbox } from '@headlessui/react';
import Footer from '@/components/Footer';

const ProgramsPage = () => {
    // State management
    const [programs, setPrograms] = useState<Program[]>([]);
    const [filteredPrograms, setFilteredPrograms] = useState<Program[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Filter states
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedSchool, setSelectedSchool] = useState("");
    const [selectedLevel, setSelectedLevel] = useState("");
    const [selectedCredential, setSelectedCredential] = useState("");

    // Pagination states
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(0);

    // Autocomplete states
    const [suggestions, setSuggestions] = useState<Array<{
        id: string;
        name: string;
        code: string;
        school: string;
        level: string;
        credential: string;
    }>>([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [suggestionsLoading, setSuggestionsLoading] = useState(false);

    // Filter options
    const [availableFilters, setAvailableFilters] = useState<{
        schools: string[];
        levels: string[];
        credentials: string[];
    }>({
        schools: [],
        levels: [],
        credentials: []
    });

    // Show more schools state
    const [showMoreSchools, setShowMoreSchools] = useState(false);

    // Refs
    const searchInputRef = useRef<HTMLInputElement>(null);
    const suggestionsRef = useRef<HTMLDivElement>(null);

    // Fetch initial filter options and programs
    const fetchInitialData = async () => {
        try {
            setLoading(true);
            const [schoolsRes, levelsRes, credentialsRes, programsRes] = await Promise.all([
                programAPI.getProgramSchools(),
                programAPI.getProgramLevels(),
                programAPI.getProgramCredentials(),
                programAPI.getPrograms({ page: 1, limit: 12, sortBy: 'name', sortOrder: 'asc' })
            ]);

            setAvailableFilters({
                schools: schoolsRes.data.schools || [],
                levels: levelsRes.data.levels || [],
                credentials: credentialsRes.data.credentials || []
            });

            if (programsRes.success) {
                setPrograms(programsRes.data.data);
                setFilteredPrograms(programsRes.data.data);
                setCurrentPage(programsRes.data.pagination.currentPage);
                setTotalPages(programsRes.data.pagination.totalPages);
                setTotalItems(programsRes.data.pagination.totalItems);
            }
        } catch (error) {
            console.error('Error fetching initial data:', error);
            setError('Error loading data. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    // Load initial data on component mount
    useEffect(() => {
        fetchInitialData();
    }, []);

    // Fetch programs from API
    const fetchPrograms = async (page = 1) => {
        try {
            setLoading(true);
            setError(null);

            const params: Record<string, any> = {
                page,
                limit: 12,
                sortBy: 'name',
                sortOrder: 'asc'
            };

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

    // Fetch suggestions for autocomplete
    const fetchSuggestions = async (query: string) => {
        if (query.length < 2) {
            setSuggestions([]);
            setShowSuggestions(false);
            return;
        }

        try {
            setSuggestionsLoading(true);
            const response = await programAPI.getProgramSuggestions(query);

            if (response.success) {
                setSuggestions(response.data.suggestions);
                setShowSuggestions(true);
            }
        } catch (error) {
            console.error('Error fetching suggestions:', error);
            setSuggestions([]);
            setShowSuggestions(false);
        } finally {
            setSuggestionsLoading(false);
        }
    };

    // Handle suggestion click
    const handleSuggestionClick = (suggestion: any) => {
        setSearchTerm(suggestion.name);
        setShowSuggestions(false);
        fetchPrograms(1);
    };

    // Handle input change with debounced suggestions
    const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSearchTerm(value);

        // Debounce suggestions
        setTimeout(() => {
            fetchSuggestions(value);
        }, 300);
    };

    // Handle click outside to close suggestions
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                suggestionsRef.current &&
                !suggestionsRef.current.contains(event.target as Node) &&
                searchInputRef.current &&
                !searchInputRef.current.contains(event.target as Node)
            ) {
                setShowSuggestions(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Refetch when filters change 
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            fetchPrograms(1);
        }, 500);

        return () => clearTimeout(timeoutId);
    }, [selectedSchool, selectedLevel, selectedCredential, searchTerm]);

    // Handle pagination
    const handlePageChange = (page: number) => {
        fetchPrograms(page);
    };

    // Handle search key down
    const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            setShowSuggestions(false);
            fetchPrograms(1);
        } else if (e.key === 'Escape') {
            setShowSuggestions(false);
        }
    };

    
    const schoolCounts: { [key: string]: number } = {
        "Seneca College": 195,
        "Centennial College": 138,
        "George Brown College": 114,
        "Humber College": 52,
        "Toronto Metropolitan University": 65,
        "York University": 192,
        "University of Manitoba": 120 // Placeholder, update with real count if available
    };

    if (loading && programs.length === 0) {
        return <PageLoader />;
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50">
                <div className="sticky top-0 z-30 bg-white">
                    <LandingNavBar />
                </div>
                <div className="container mx-auto px-4 py-8">
                    <div className="text-center">
                        <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
                        <p className="text-gray-600 mb-4">{error}</p>
                        <Button onClick={fetchInitialData}>
                            Try Again
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#FAF9F6]">
            {/* Navigation */}
            <div className="sticky top-0 z-30">
                <LandingNavBar />
            </div>

            {/* Hero Section */}
            <div className="relative h-[500px] overflow-hidden">
                {/* Background Image */}
                <div
                    className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                    style={{
                        backgroundImage: 'url("https://images.unsplash.com/photo-1607237138185-eedd9c632b0b?q=80&w=2070&auto=format&fit=crop")',
                    }}
                />

                {/* Dark overlay */}
                <div className="absolute inset-0 bg-black/60" />

                {/* Content */}
                <div className="relative z-10 h-full flex items-center justify-center">
                    <div className="max-w-4xl mx-auto px-6 text-center">
                        <div className="text-[#F9F6EE]">
                            <h1 className="text-5xl md:text-6xl font-bold mb-6 text-center">
                                Search for programs
                            </h1>

                            {/* Yellow accent bar */}
                            <div className="w-30 h-1 bg-yellow-400 mb-10 mx-auto" />

                            <div className="max-w-3xl mx-auto">
                                <p className="text-md text-[#F9F6EE] leading-relaxed">
                                    We have collected the most complete database of universities in Canada. We will help you find
                                    universities by various criteria, including countries, degrees.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Search Section */}
            <div className="py-12">
                <div className="max-w-4xl mx-auto px-6">
                    {/* Search Bar */}
                    <div className="relative -mt-21 z-50">
                        <div className="absolute inset-0 w-full h-full rounded-2xl pointer-events-none" style={{ boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.25), 0 1.5px 8px 0 rgba(0,0,0,0.10)' }} />
                        <div className="relative">
                            
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-6 h-6" />
                            <input
                                ref={searchInputRef}
                                type="text"
                                value={searchTerm}
                                onChange={handleSearchInputChange}
                                placeholder="Find a program"
                                className="w-full pl-14 pr-4 py-5 text-lg bg-[#FAF9F6] text-gray-900 placeholder-gray-500 border border-gray-300 rounded-xl  focus:ring-gray-500 focus:border-gray-500 outline-none shadow-sm"
                                onKeyDown={handleSearchKeyDown}
                                onFocus={() => {
                                    if (searchTerm.length >= 2 && suggestions.length > 0) {
                                        setShowSuggestions(true);
                                    }
                                }}
                            />
                        </div>

                        {/* Suggestions Dropdown */}
                        {showSuggestions && (
                            <div
                                ref={suggestionsRef}
                                className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-xl z-50 max-h-80 overflow-y-auto"
                                style={{ minHeight: suggestions.length > 0 || suggestionsLoading ? '60px' : undefined }}
                            >
                                {suggestionsLoading ? (
                                    <div className="p-4 text-center text-gray-500">
                                        <div className="animate-spin w-5 h-5 border-2 border-gray-400 border-t-transparent rounded-full mx-auto"></div>
                                        <span className="mt-2 block">Loading...</span>
                                    </div>
                                ) : suggestions.length > 0 ? (
                                    <div className="py-2">
                                        {suggestions.map((suggestion, index) => (
                                            <button
                                                key={suggestion.id}
                                                onClick={() => handleSuggestionClick(suggestion)}
                                                className="w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0"
                                            >
                                                <div className="flex items-center justify-between">
                                                    <div className="flex-1">
                                                        <div className="font-medium text-gray-900 line-clamp-1">
                                                            {suggestion.name}
                                                        </div>
                                                        <div className="text-sm text-gray-500 mt-1">
                                                            {suggestion.school} • {suggestion.level} • {suggestion.credential}
                                                        </div>
                                                    </div>
                                                    <div className="ml-3 flex-shrink-0">
                                                        <span className="bg-gray-800 text-white text-xs font-bold px-2 py-1 rounded">
                                                            {suggestion.code}
                                                        </span>
                                                    </div>
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="p-4 text-center text-gray-500">
                                        No programs found
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
                {/* Thêm margin-bottom để tránh suggestions che nội dung bên dưới */}
                <div style={{ marginBottom: showSuggestions ? 300 : 0 }} />
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-6 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Left Sidebar - Filter */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-lg p-6 shadow-sm sticky top-8 py-10">
                            {/* <h2 className="text-xl font-semibold mb-6 text-gray-900">Filters</h2> */}

                            {/* School Names Filter */}
                            <div className="mb-8">
                                <h3 className="text-lg font-medium mb-4 text-gray-900">SCHOOL</h3>
                                <div className="space-y-3">
                                    {(showMoreSchools ? availableFilters.schools : availableFilters.schools.slice(0, 5)).map((school, index) => (
                                        <label key={school} className="flex items-center justify-between cursor-pointer group">
                                            <div className="flex items-center">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedSchool === school}
                                                    onChange={(e) => setSelectedSchool(e.target.checked ? school : "")}
                                                    className="w-4 h-4 text-gray-600 bg-gray-100 border-gray-300 rounded focus:ring-gray-500 focus:ring-2"
                                                />
                                                <span className="ml-3 text-gray-700 group-hover:text-gray-900 transition-colors">
                                                    {school}
                                                </span>
                                            </div>
                                            <span className="text-sm text-gray-400 font-medium">
                                                {schoolCounts[school] || 0}
                                            </span>
                                        </label>
                                    ))}
                                </div>
                                {availableFilters.schools.length > 5 && !showMoreSchools && (
                                    <button type="button" className="text-gray-600 text-sm mt-3 hover:text-gray-800 transition-colors" onClick={() => setShowMoreSchools(true)}>
                                        + Show more
                                    </button>
                                )}
                                {availableFilters.schools.length > 5 && showMoreSchools && (
                                    <button type="button" className="text-gray-600 text-sm mt-3 hover:text-gray-800 transition-colors" onClick={() => setShowMoreSchools(false)}>
                                        Show less
                                    </button>
                                )}
                            </div>

                            {/* Study Level Filter */}
                            <div className="mb-8">
                                <h3 className="text-lg font-medium mb-4 text-gray-900">STUDY LEVEL</h3>
                                <div className="space-y-3">
                                    <label className="flex items-center cursor-pointer group">
                                        <input
                                            type="radio"
                                            name="studyLevel"
                                            checked={selectedLevel === ""}
                                            onChange={() => setSelectedLevel("")}
                                            className="w-4 h-4 text-gray-600 bg-gray-100 border-gray-300 focus:ring-gray-500 focus:ring-2"
                                        />
                                        <span className="ml-3 text-gray-700 group-hover:text-gray-900 transition-colors">
                                            All Levels
                                        </span>
                                    </label>
                                    <label className="flex items-center cursor-pointer group">
                                        <input
                                            type="radio"
                                            name="studyLevel"
                                            checked={selectedLevel === "University"}
                                            onChange={() => setSelectedLevel("University")}
                                            className="w-4 h-4 text-gray-600 bg-gray-100 border-gray-300 focus:ring-gray-500 focus:ring-2"
                                        />
                                        <span className="ml-3 text-gray-700 group-hover:text-gray-900 transition-colors">
                                            University
                                        </span>
                                    </label>
                                    <label className="flex items-center cursor-pointer group">
                                        <input
                                            type="radio"
                                            name="studyLevel"
                                            checked={selectedLevel === "College"}
                                            onChange={() => setSelectedLevel("College")}
                                            className="w-4 h-4 text-gray-600 bg-gray-100 border-gray-300 focus:ring-gray-500 focus:ring-2"
                                        />
                                        <span className="ml-3 text-gray-700 group-hover:text-gray-900 transition-colors">
                                            College
                                        </span>
                                    </label>
                                </div>
                            </div>

                            {/* Credentials Filter */}
                            <div>
                                <h3 className="text-lg font-medium text-gray-900">DEGREE</h3>
                                <div className="space-y-3">
                                    {availableFilters.credentials.slice(0, 6).map((credential, index) => (
                                        <label key={credential} className="flex items-center justify-between cursor-pointer group">
                                            <div className="flex items-center">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedCredential === credential}
                                                    onChange={(e) => setSelectedCredential(e.target.checked ? credential : "")}
                                                    className="w-4 h-4 text-gray-600 bg-gray-100 border-gray-300 rounded focus:ring-gray-500 focus:ring-2"
                                                />
                                                <span className="ml-3 text-gray-700 group-hover:text-gray-900 transition-colors">
                                                    {credential.charAt(0).toUpperCase() + credential.slice(1)}
                                                </span>
                                            </div>
                                            <span className="text-sm text-gray-400 font-medium">
                                                {Math.floor(Math.random() * 20) + 1}
                                            </span>
                                        </label>
                                    ))}
                                </div>
                                {availableFilters.credentials.length > 6 && (
                                    <button className="text-gray-600 text-sm mt-3 hover:text-gray-800 transition-colors">
                                        + Show more
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Right Content - Results */}
                    <div className="lg:col-span-3">

                        {/* Info Notice */}
                        <div className="bg-white border border-gray-200 rounded-xl flex items-center gap-5 p-6 mb-8 mt-4 shadow-sm">
                            <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gray-700 flex items-center justify-center">
                                <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none" />
                                    <line x1="12" y1="8" x2="12" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                    <circle cx="12" cy="16" r="1.5" fill="currentColor" />
                                </svg>
                            </div>
                            <div className="text-lg text-gray-900 font-normal">
                                The information is for informational purposes only. Check more details on the official website of the educational institution.
                            </div>
                        </div>


                        {/* Programs Grid */}
                        <div className="space-y-6">
                            {loading && filteredPrograms.length === 0 && (
                                <div className="text-center py-12">
                                    <div className="animate-spin w-8 h-8 border-4 border-gray-400 border-t-transparent rounded-full mx-auto mb-4"></div>
                                    <p className="text-gray-600">Loading universities...</p>
                                </div>
                            )}

                            {!loading && filteredPrograms.map((program, index) => {
                                console.log("Program you just clicked", program);
                                return (
                                    <div
                                        key={program._id}
                                        className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow"
                                    >
                                        {/* Header with school name and location */}
                                        <div className="mb-4">
                                            <h3 className="text-xl font-bold text-gray-900 mb-2">
                                                {program.name}
                                            </h3>
                                            <div className="flex items-center text-gray-600 mb-4">
                                                <span className="text-lg">🇨🇦</span>
                                                <span className="ml-2">Canada, {program.campus[0] || 'Multiple Locations'}</span>
                                            </div>

                                            {/* Rankings */}
                                            <div className="flex flex-wrap gap-2 mb-6">
                                                <span className="bg-gray-100 text-gray-800 text-xs font-medium px-3 py-1 rounded-full">
                                                    #{Math.floor(Math.random() * 50) + 1} QS Rankings
                                                </span>
                                                <span className="bg-gray-100 text-gray-800 text-xs font-medium px-3 py-1 rounded-full">
                                                    #{Math.floor(Math.random() * 50) + 1} THE Rankings
                                                </span>
                                                <span className="bg-gray-100 text-gray-800 text-xs font-medium px-3 py-1 rounded-full">
                                                    #{Math.floor(Math.random() * 50) + 1} ARWU Rankings
                                                </span>
                                            </div>
                                        </div>

                                        {/* Degree Programs and Pricing */}
                                        <div className="grid grid-cols-3 gap-6 mb-6">
                                            {/* Bachelor's degree */}
                                            <div className="text-center">
                                                <h4 className="font-semibold text-gray-800 mb-3">Bachelor's degree</h4>
                                                <div className="space-y-1">
                                                    <div className="text-xs text-gray-500">from</div>
                                                    <div className="text-lg font-bold text-gray-900">
                                                        {(Math.floor(Math.random() * 5000) + 15000).toLocaleString()} <span className="text-xs font-normal text-gray-600">USD</span>
                                                    </div>
                                                    <div className="text-xs text-gray-500">to</div>
                                                    <div className="text-lg font-bold text-gray-900">
                                                        {(Math.floor(Math.random() * 15000) + 35000).toLocaleString()} <span className="text-xs font-normal text-gray-600">USD</span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Master's degree */}
                                            <div className="text-center">
                                                <h4 className="font-semibold text-gray-800 mb-3">Master's degree</h4>
                                                <div className="space-y-1">
                                                    <div className="text-xs text-gray-500">from</div>
                                                    <div className="text-lg font-bold text-gray-900">
                                                        {(Math.floor(Math.random() * 8000) + 20000).toLocaleString()} <span className="text-xs font-normal text-gray-600">USD</span>
                                                    </div>
                                                    <div className="text-xs text-gray-500">to</div>
                                                    <div className="text-lg font-bold text-gray-900">
                                                        {(Math.floor(Math.random() * 20000) + 45000).toLocaleString()} <span className="text-xs font-normal text-gray-600">USD</span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Doctoral studies */}
                                            <div className="text-center">
                                                <h4 className="font-semibold text-gray-800 mb-3">Doctoral studies</h4>
                                                <div className="space-y-1">
                                                    <div className="text-xs text-gray-500">from</div>
                                                    <div className="text-lg font-bold text-gray-900">
                                                        {(Math.floor(Math.random() * 5000) + 25000).toLocaleString()} <span className="text-xs font-normal text-gray-600">USD</span>
                                                    </div>
                                                    <div className="text-xs text-gray-500">to</div>
                                                    <div className="text-lg font-bold text-gray-900">
                                                        {(Math.floor(Math.random() * 10000) + 35000).toLocaleString()} <span className="text-xs font-normal text-gray-600">USD</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Action Buttons */}
                                        <div className="flex gap-4">
                                            <button
                                                onClick={() => {
                                                    // Use program.url if available, otherwise navigate to program detail page
                                                    if (program.url) {
                                                        window.open(program.url, '_blank', 'noopener,noreferrer');
                                                    } else {
                                                        window.location.href = `/programs/${program.programId}`;
                                                    }
                                                }}
                                                className="cursor-pointer flex-1 bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 font-medium py-3 px-4 rounded-lg transition-colors"
                                            >
                                                {program.url ? 'Visit Official Page' : 'Read more'}
                                            </button>
                                            <button className="cursor-pointer flex-1 bg-gray-800 hover:bg-gray-900 text-white font-medium py-3 px-4 rounded-lg transition-colors" onClick={() => {
                                                window.location.href = `/programs/${program.programId}`;
                                            }}>
                                                Write a review
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Empty State */}
                        {!loading && filteredPrograms.length === 0 && (
                            <div className="text-center py-20">
                                <div className="text-6xl mb-4">🔍</div>
                                <h3 className="text-2xl font-bold text-gray-800 mb-2">No universities found</h3>
                                <p className="text-gray-600 mb-6">
                                    Try adjusting your search terms or filters to find what you're looking for.
                                </p>
                                <Button
                                    onClick={() => {
                                        setSearchTerm("");
                                        setSelectedSchool("");
                                        setSelectedLevel("");
                                        setSelectedCredential("");
                                        fetchPrograms(1);
                                    }}
                                    className="bg-gray-800 hover:bg-gray-900 text-white"
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
                                    className="border-gray-300 text-gray-700 hover:bg-gray-50"
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
                                                    ? "bg-gray-800 hover:bg-gray-900 text-white"
                                                    : "border-gray-300 text-gray-700 hover:bg-gray-50"
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
                                    className="border-gray-300 text-gray-700 hover:bg-gray-50"
                                >
                                    Next
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default ProgramsPage;

