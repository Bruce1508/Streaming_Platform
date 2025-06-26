'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import LandingNavBar from '@/components/landing/LandingNavBar';
import { programAPI } from '@/lib/api';
import { Clock, Award, Users, Building, Calendar } from 'lucide-react';

interface Program {
    _id: string;
    name: string;
    code: string;
    description: string;
    level: string;
    duration: {
        semesters: number;
        years: number;
    };
    school: {
        _id: string;
        name: string;
        code: string;
    };
    totalCredits: number;
    stats: {
        enrollmentCount: number;
        graduationRate: number;
        employmentRate: number;
    };
    isActive: boolean;
}

const ProgramDetailPage = () => {
    const params = useParams();
    const [program, setProgram] = useState<Program | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchProgram = async () => {
            try {
                setLoading(true);
                const programId = params.id as string;
                
                // Fetch program by code (CPA, ACC, etc.)
                const response = await programAPI.getProgramById(programId.toUpperCase());
                
                if (response.success && response.data) {
                    setProgram(response.data);
                } else {
                    setError('Program not found');
                }
            } catch (err) {
                console.error('Error fetching program:', err);
                setError('Failed to load program details');
            } finally {
                setLoading(false);
            }
        };

        if (params.id) {
            fetchProgram();
        }
    }, [params.id]);

    if (loading) {
        return (
            <div className="min-h-screen bg-[#1a1a1a] text-white">
                <div className="sticky top-0 z-30 bg-[#18191A]">
                    <LandingNavBar />
                </div>
                <div className="h-20" />
                <div className="max-w-6xl mx-auto px-6 py-16">
                    <div className="animate-pulse">
                        <div className="h-12 bg-gray-700 rounded w-2/3 mb-6"></div>
                        <div className="h-6 bg-gray-700 rounded w-1/2 mb-8"></div>
                        <div className="space-y-4">
                            {[1, 2, 3, 4, 5].map(i => (
                                <div key={i} className="h-4 bg-gray-700 rounded"></div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (error || !program) {
        return (
            <div className="min-h-screen bg-[#1a1a1a] text-white">
                <div className="sticky top-0 z-30 bg-[#18191A]">
                    <LandingNavBar />
                </div>
                <div className="h-20" />
                <div className="max-w-6xl mx-auto px-6 py-16 text-center">
                    <h1 className="text-4xl font-bold mb-4">Program Not Found</h1>
                    <p className="text-gray-400">The program you're looking for doesn't exist.</p>
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
            
            <div className="max-w-6xl mx-auto px-6 py-16">
                {/* Header */}
                <div className="mb-12">
                    <div className="flex items-center gap-4 mb-4">
                        <span className="px-4 py-2 bg-orange-600 text-white rounded-lg text-sm font-semibold">
                            {program.code}
                        </span>
                        <span className="px-4 py-2 bg-gray-700 text-gray-200 rounded-lg text-sm">
                            {program.level}
                        </span>
                    </div>
                    <h1 className="text-5xl font-bold mb-4">{program.name} Reviews</h1>
                    <p className="text-gray-300 text-lg">
                        Explore reviews and insights from students about the {program.name} at {program.school.name}.
                    </p>
                </div>

                {/* Program Overview */}
                <section className="mb-12">
                    <h2 className="text-3xl font-bold mb-6">Program Overview</h2>
                    <div className="bg-[#232425] rounded-lg p-8">
                        <p className="text-gray-300 leading-relaxed text-lg mb-8">
                            {program.description}
                        </p>
                        
                        {/* Program Info Grid */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                            <div className="bg-[#2a2b2c] rounded-lg p-4 text-center">
                                <Clock className="w-8 h-8 text-orange-400 mx-auto mb-2" />
                                <div className="text-2xl font-bold text-white">{program.duration.years}</div>
                                <div className="text-gray-400 text-sm">Years</div>
                                <div className="text-gray-400 text-xs">({program.duration.semesters} Semesters)</div>
                            </div>
                            <div className="bg-[#2a2b2c] rounded-lg p-4 text-center">
                                <Award className="w-8 h-8 text-orange-400 mx-auto mb-2" />
                                <div className="text-2xl font-bold text-white">{program.totalCredits}</div>
                                <div className="text-gray-400 text-sm">Credits</div>
                            </div>
                            <div className="bg-[#2a2b2c] rounded-lg p-4 text-center">
                                <Users className="w-8 h-8 text-orange-400 mx-auto mb-2" />
                                <div className="text-2xl font-bold text-white">{program.stats.enrollmentCount}</div>
                                <div className="text-gray-400 text-sm">Students</div>
                            </div>
                            <div className="bg-[#2a2b2c] rounded-lg p-4 text-center">
                                <Building className="w-8 h-8 text-orange-400 mx-auto mb-2" />
                                <div className="text-lg font-bold text-white">{program.school.code}</div>
                                <div className="text-gray-400 text-sm">School</div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Program Information */}
                <section className="mb-12">
                    <h2 className="text-3xl font-bold mb-6">Program Information</h2>
                    <div className="grid md:grid-cols-2 gap-8">
                        {/* School Info */}
                        <div className="bg-[#232425] rounded-lg p-6">
                            <div className="flex items-center gap-3 mb-4">
                                <Building className="w-6 h-6 text-orange-400" />
                                <h3 className="text-xl font-semibold text-white">School</h3>
                            </div>
                            <p className="text-gray-300 text-lg">{program.school.name}</p>
                            <p className="text-gray-400">Part of {program.school.name}</p>
                        </div>

                        {/* Credential Info */}
                        <div className="bg-[#232425] rounded-lg p-6">
                            <div className="flex items-center gap-3 mb-4">
                                <Award className="w-6 h-6 text-orange-400" />
                                <h3 className="text-xl font-semibold text-white">Credential</h3>
                            </div>
                            <p className="text-gray-300 text-lg">{program.level}</p>
                            <p className="text-gray-400">Upon successful completion</p>
                        </div>

                        {/* Duration Info */}
                        <div className="bg-[#232425] rounded-lg p-6">
                            <div className="flex items-center gap-3 mb-4">
                                <Clock className="w-6 h-6 text-orange-400" />
                                <h3 className="text-xl font-semibold text-white">Duration</h3>
                            </div>
                            <p className="text-gray-300 text-lg">{program.duration.years} Years</p>
                            <p className="text-gray-400">{program.duration.semesters} Semesters</p>
                        </div>

                        {/* Credits Info */}
                        <div className="bg-[#232425] rounded-lg p-6">
                            <div className="flex items-center gap-3 mb-4">
                                <Calendar className="w-6 h-6 text-orange-400" />
                                <h3 className="text-xl font-semibold text-white">Credits</h3>
                            </div>
                            <p className="text-gray-300 text-lg">{program.totalCredits} Total Credits</p>
                            <p className="text-gray-400">Required for graduation</p>
                        </div>
                    </div>
                </section>

                {/* Program Success Metrics */}
                <section className="mb-12">
                    <h2 className="text-3xl font-bold mb-6">Program Metrics</h2>
                    <div className="grid md:grid-cols-3 gap-6">
                        <div className="bg-[#232425] rounded-lg p-6 text-center">
                            <div className="text-4xl font-bold text-green-400 mb-2">
                                {program.stats.graduationRate}%
                            </div>
                            <h4 className="text-gray-400 font-semibold mb-2">Graduation Rate</h4>
                            <p className="text-gray-500 text-sm">Students who complete the program</p>
                        </div>
                        <div className="bg-[#232425] rounded-lg p-6 text-center">
                            <div className="text-4xl font-bold text-blue-400 mb-2">
                                {program.stats.employmentRate}%
                            </div>
                            <h4 className="text-gray-400 font-semibold mb-2">Employment Rate</h4>
                            <p className="text-gray-500 text-sm">Graduates employed within 6 months</p>
                        </div>
                        <div className="bg-[#232425] rounded-lg p-6 text-center">
                            <div className="text-4xl font-bold text-orange-400 mb-2">
                                {program.stats.enrollmentCount}
                            </div>
                            <h4 className="text-gray-400 font-semibold mb-2">Current Students</h4>
                            <p className="text-gray-500 text-sm">Enrolled in this program</p>
                        </div>
                    </div>
                </section>

                {/* Student Resources */}
                <section className="mb-12">
                    <h2 className="text-3xl font-bold mb-6">Student Resources</h2>
                    <div className="bg-[#232425] rounded-lg p-8">
                        <p className="text-gray-300 mb-6">
                            As a student in the {program.name}, you'll have access to various support services and resources to help you succeed.
                        </p>
                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="flex items-center gap-4 p-4 bg-[#2a2b2c] rounded-lg">
                                <Users className="w-8 h-8 text-orange-400" />
                                <div>
                                    <h4 className="text-white font-semibold">Academic Advising</h4>
                                    <p className="text-gray-400 text-sm">Get guidance on course selection and academic planning</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4 p-4 bg-[#2a2b2c] rounded-lg">
                                <Award className="w-8 h-8 text-orange-400" />
                                <div>
                                    <h4 className="text-white font-semibold">Career Services</h4>
                                    <p className="text-gray-400 text-sm">Support for job search and career development</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Call to Action */}
                <section className="mb-12">
                    <div className="bg-gradient-to-r from-orange-600 to-red-600 rounded-lg p-8 text-center">
                        <h2 className="text-3xl font-bold mb-4">Interested in This Program?</h2>
                        <p className="text-lg mb-6 opacity-90">
                            Learn more about admission requirements and how to apply to {program.name}.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <a 
                                href={`https://www.senecapolytechnic.ca/programs/fulltime/${program.code}.html`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-8 py-3 bg-white text-orange-600 font-semibold rounded-lg hover:bg-gray-100 transition"
                            >
                                View Official Program Page
                            </a>
                            <button className="px-8 py-3 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-orange-600 transition">
                                Apply Now
                            </button>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default ProgramDetailPage;
