"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Search, ChevronDown } from "lucide-react";
import LandingNavBar from "@/components/landing/LandingNavBar";
import { Button } from "@/components/ui/Button";
import PageLoader from "@/components/ui/PageLoader";
import { programAPI } from "@/lib/api";
import { Program } from "@/types/Program";
import Footer from '@/components/Footer';
import { schoolCounts } from "@/constants/programData";
import Image from 'next/image';

const ProgramsPage = () => {
    const router = useRouter();
    
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
            {/* Navigation - đưa ra ngoài không bị sticky */}
            <LandingNavBar />

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
            <div className="max-w-7xl mx-auto px-6 pt-10 pb-30">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    {/* Left Sidebar - Filter */}
                    <div className="lg:col-span-1">
                        <div className="bg-[#E0E0E0] rounded-lg p-6 shadow-sm sticky top-8 py-10">
                            <div className="flex items-center justify-between mb-15">
                                <h2 className="text-2xl font-bold text-gray-900">Filters</h2>
                                <button
                                    className="text-md text-indigo-500 hover:underline cursor-pointer font-medium px-0 py-0 bg-transparent shadow-none border-none outline-none"
                                    onClick={() => {
                                        setSearchTerm("");
                                        setSelectedSchool("");
                                        setSelectedLevel("");
                                        setSelectedCredential("");
                                        fetchPrograms(1);
                                    }}
                                    type="button"
                                >
                                    Reset all
                                </button>
                            </div>

                            {/* School Names Filter */}
                            <div className="mb-8">
                                <h3 className="text-lg font-medium mb-4 text-gray-900">School</h3>
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
                                    <button type="button" className="text-gray-600 text-sm mt-3 hover:text-gray-800 transition-colors opacity-50 cursor-pointer" onClick={() => setShowMoreSchools(true)}>
                                        + Show more
                                    </button>
                                )}
                                {availableFilters.schools.length > 5 && showMoreSchools && (
                                    <button type="button" className="text-gray-600 text-sm mt-3 hover:text-gray-800 transition-colors opacity-50 cursor-pointer" onClick={() => setShowMoreSchools(false)}>
                                        Show less
                                    </button>
                                )}
                            </div>

                            {/* Study Level Filter */}
                            <div className="mb-8">
                                <h3 className="text-lg font-medium mb-4 text-gray-900">Study Level</h3>
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
                                <h3 className="text-lg font-medium text-gray-900 mb-4">Degree</h3>
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

                        {/* School Filter Buttons */}
                        <div className="mb-8 mt-4">
                            <div className="flex gap-2 flex-wrap">
                                <button
                                    onClick={() => setSelectedSchool("")}
                                    className={`px-4 py-2 rounded-lg cursor-pointer border transition-colors
                                        ${selectedSchool === ""
                                            ? "border-black bg-white font-semibold shadow-sm"
                                            : "border border-gray-200 bg-gray-50 text-gray-700 hover:bg-gray-100"}
                                    `}
                                >
                                    All Schools
                                </button>
                                {availableFilters.schools.slice(0, 8).map((school) => (
                                    <button
                                        key={school}
                                        onClick={() => setSelectedSchool(school)}
                                        className={`px-4 py-2 rounded-lg border cursor-pointer transition-colors
                                            ${selectedSchool === school
                                                ? "border-black bg-white font-semibold shadow-sm"
                                                : "border border-gray-200 bg-gray-50 text-gray-700 hover:bg-gray-100"}
                                        `}
                                    >
                                        {school}
                                    </button>
                                ))}
                            </div>
                        </div>


                        {/* Programs Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-6">
                            {loading && filteredPrograms.length === 0 && (
                                <div className="text-center py-12">
                                    <div className="animate-spin w-8 h-8 border-4 border-gray-400 border-t-transparent rounded-full mx-auto mb-4"></div>
                                    <p className="text-gray-600">Loading universities...</p>
                                </div>
                            )}

                            {!loading && filteredPrograms.map((program, index) => {
                                // Map school name to logo file name
                                const schoolLogoMap: Record<string, string> = {
                                    'Humber College': '/Humber_College_logo.svg',
                                    'Seneca College': '/Seneca-logo.svg',
                                    'Centennial College': '/centennial.png',
                                    'George Brown College': '/George_Brown_College_logo.svg',
                                    'Toronto Metropolitan University': '/TMU_logo.svg',
                                    'York University': '/Logo_York_University.svg',
                                    'University of Manitoba': '/University-of-Manitoba-logo_1.png',
                                };
                                const logoSrc = schoolLogoMap[program.school] || '/logo.png';
                                
                                // Location mapping
                                const getLocation = (school: string) => {
                                    if (school === 'University of Manitoba') return 'Winnipeg, MB';
                                    return 'Ontario, CA';
                                };
                                
                                // Generate random colors for card backgrounds
                                const cardColors = ['bg-purple-200/60', 'bg-green-100', 'bg-red-100', 'bg-blue-100', 'bg-yellow-100'];
                                const cardColor = cardColors[index % cardColors.length];
                                
                                return (
                                    <div
                                        key={program._id}
                                        className={`${cardColor} rounded-2xl border border-gray-200 px-8 py-6 hover:shadow-lg transition-shadow relative flex flex-col w-full min-h-[200px]`}
                                    >
                                        {/* Top section with salary/tuition */}
                                        <div className="mb-3">
                                            <div className="text-xl font-bold text-gray-900 mb-1 leading-tight">
                                                {program.name}
                                            </div>
                                        </div>

                                        {/* Program name and school with logo */}
                                        <div className="flex items-start justify-between mb-3">
                                            <div className="flex-1 pr-4">
                                                <p className="text-gray-700 font-medium text-lg">
                                                    {program.school}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Location and credential info */}
                                        <div className="flex items-center justify-between mb-3">
                                            {/* Left: Location + Credential */}
                                            <div className="space-y-1">
                                                <div className="flex items-center text-gray-600">
                                                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                                    </svg>
                                                    <span>{getLocation(program.school)}</span>
                                                </div>
                                                <div className="flex items-center text-gray-600">
                                                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                    </svg>
                                                    <span>{program.credential ? program.credential.charAt(0).toUpperCase() + program.credential.slice(1) : 'Various Programs'}</span>
                                                </div>
                                            </div>
                                            {/* Right: Logo */}
                                            <div className="flex-shrink-0 flex items-center h-full">
                                                <Image
                                                    src={logoSrc}
                                                    alt={program.school}
                                                    width={program.school === 'Humber College' ? 100 : program.school === 'University of Manitoba' ? 140 : 64}
                                                    height={program.school === 'Humber College' ? 100 : 64}
                                                    className="object-contain"
                                                />
                                            </div>
                                        </div>

                                        {/* Tags */}
                                        <div className="flex flex-wrap gap-2 mb-4">
                                            {program.level && (
                                                <span className="bg-gray-100 text-gray-700 text-xs font-medium px-3 py-1 rounded-full">
                                                    {program.level}
                                                </span>
                                            )}
                                            <span className="bg-gray-100 text-gray-700 text-xs font-medium px-3 py-1 rounded-full">
                                                {program.credential ? program.credential.charAt(0).toUpperCase() + program.credential.slice(1) : 'Program'}
                                            </span>
                                            <span className="bg-gray-100 text-gray-700 text-xs font-medium px-3 py-1 rounded-full">
                                                {Math.floor(Math.random() * 3) + 2}-{Math.floor(Math.random() * 2) + 4} years
                                            </span>
                                        </div>

                                        {/* Action Buttons */}
                                        <div className="flex gap-3 mt-auto">
                                            <button
                                                onClick={() => {
                                                    router.push(`/programs/${program.programId}`);
                                                }}
                                                className="cursor-pointer bg-[#36454F] hover:bg-gray-600 text-white font-medium py-3 px-4 rounded-xl flex-1 transition-colors"
                                            >
                                                See more
                                            </button>
                                            <button className="w-12 h-12 bg-white hover:bg-gray-50 border border-gray-200 rounded-xl flex items-center justify-center transition-colors cursor-pointer" onClick={() => {
                                                // Heart/favorite functionality
                                            }}>
                                                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                                </svg>
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
            <div className="pb-60"></div>
            <Footer />
        </div>
    );
};

export default ProgramsPage;

