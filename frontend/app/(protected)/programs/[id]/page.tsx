'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import LandingNavBar from '@/components/landing/LandingNavBar';
import { Button } from '@/components/ui/Button';
import PageLoader from '@/components/ui/PageLoader';
import { programAPI, courseAPI } from '@/lib/api';
import { 
    Clock, 
    Award, 
    Users, 
    Building, 
    BookOpen, 
    MapPin, 
    ExternalLink,
    ArrowLeft,
    Star,
    TrendingUp,
    GraduationCap,
    Briefcase,
    CheckCircle,
    AlertCircle
} from 'lucide-react';
import ProgramReviewDisplay from '@/components/program/ProgramReviewDisplay';
import ProgramScoreOverview from '@/components/program/ProgramScoreOverview';

interface Course {
    id?: string;
    code?: string;
    name?: string;
    credits?: number;
    description?: string;
}

interface Requirement {
    id: string;
    type: 'general_education' | 'professional_options' | 'electives' | 'other';
    title: string;
    description: string;
    selectCount: number;
    availableCourses: Course[];
    isRequired: boolean;
    category?: string;
    externalLinks?: string[];
}

interface Semester {
    id?: string;
    name?: string;
    type: 'regular' | 'work_integrated_learning' | 'coop';
    order: number;
    coreCourses: Course[];
    requirements: Requirement[];
    totalCredits?: number;
    prerequisites?: string[];
    notes?: string;
    isOptional?: boolean;
}

interface ProgramCourses {
    programId: string;
    programName: string;
    semesters: Semester[];
    totalSemesters: number;
    totalCredits?: number;
    hasWorkIntegratedLearning?: boolean;
    stats?: {
        totalSemesters: number;
        regularSemesters: number;
        workIntegratedSemesters: number;
        totalCoreCourses: number;
        totalRequirements: number;
        totalCourses: number;
        hasWorkIntegratedLearning: boolean;
        coursesPerSemester: Array<{
            semester: string;
            type: string;
            coreCourses: number;
            requirements: number;
            totalCourses: number;
            isOptional: boolean;
        }>;
    };
}

interface Program {
    _id: string;
    programId: string;
    code: string;
    name: string;
    overview: string;
    duration: string;
    campus: string[];
    delivery?: string;
    credential: string;
    school: string;
    level: string;
    isActive: boolean;
    stats?: {
        enrollmentCount: number;
        graduationRate?: number;
        employmentRate?: number;
    };
}

const ProgramDetailPage = () => {
    const params = useParams();
    const router = useRouter();
    const [program, setProgram] = useState<Program | null>(null);
    const [programCourses, setProgramCourses] = useState<ProgramCourses | null>(null);
    const [loading, setLoading] = useState(true);
    const [coursesLoading, setCoursesLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [openSemesterIndex, setOpenSemesterIndex] = useState(0);

    useEffect(() => {
        const fetchProgramData = async () => {
            try {
                setLoading(true);
                setError(null);
                const programId = params.id as string;
                
                console.log('Fetching program with ID:', programId);
                
                // Fetch program basic info
                const programResponse = await programAPI.getProgramById(programId.toUpperCase());
                
                console.log('Program API Response:', programResponse);
                
                if (programResponse.success && programResponse.data) {
                    setProgram(programResponse.data);
                    
                    // Fetch program courses
                    setCoursesLoading(true);
                    try {
                        console.log('Fetching courses for program:', programId.toUpperCase());
                        const coursesResponse = await courseAPI.getProgramCourses(programId.toUpperCase());
                        console.log('Courses API Response:', coursesResponse);
                        
                        if (coursesResponse.success && coursesResponse.data) {
                            setProgramCourses(coursesResponse.data);
                            console.log('Program courses data:', coursesResponse.data);
                        } else {
                            console.warn('No courses found for program:', programId);
                        }
                    } catch (coursesError: any) {
                        console.warn('Failed to fetch courses:', coursesError);
                        // Don't set error - courses are optional
                    } finally {
                        setCoursesLoading(false);
                    }
                } else {
                    console.error('Program not found in response:', programResponse);
                    setError('Program not found');
                }
            } catch (err: any) {
                console.error('Error fetching program:', err);
                console.error('Error details:', {
                    message: err.message,
                    response: err.response,
                    status: err.response?.status,
                    data: err.response?.data
                });
                setError('Failed to load program details');
            } finally {
                setLoading(false);
            }
        };

        if (params.id) {
            fetchProgramData();
        }
    }, [params.id]);

    const getProgramImage = (programName: string, school: string): string => {
        const name = programName.toLowerCase();
        
        if (name.includes('computer') || name.includes('software') || name.includes('information technology') || 
            name.includes('cybersecurity') || name.includes('data') || name.includes('programming') || 
            name.includes('web') || name.includes('network') || name.includes('it ')) {
            return 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=1200&h=400&fit=crop&crop=center';
        }
        
        if (name.includes('business') || name.includes('management') || name.includes('marketing') || 
            name.includes('finance') || name.includes('accounting') || name.includes('administration') ||
            name.includes('entrepreneurship') || name.includes('economics')) {
            return 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1200&h=400&fit=crop&crop=center';
        }
        
        return 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=1200&h=400&fit=crop&crop=center';
    };

    const getRequirementTypeIcon = (type: string) => {
        switch (type) {
            case 'general_education':
                return <BookOpen className="w-5 h-5 text-blue-400" />;
            case 'professional_options':
                return <Briefcase className="w-5 h-5 text-green-400" />;
            case 'electives':
                return <Star className="w-5 h-5 text-purple-400" />;
            default:
                return <CheckCircle className="w-5 h-5 text-gray-400" />;
        }
    };

    const getRequirementTypeColor = (type: string) => {
        switch (type) {
            case 'general_education':
                return 'border-blue-400 bg-blue-400/10';
            case 'professional_options':
                return 'border-green-400 bg-green-400/10';
            case 'electives':
                return 'border-purple-400 bg-purple-400/10';
            default:
                return 'border-gray-400 bg-gray-400/10';
        }
    };

    if (loading) {
        return <PageLoader />;
    }

    if (error || !program) {
        return (
            <div className="min-h-screen bg-[#1a1a1a] text-white">
                <div className="sticky top-0 z-30 bg-[#18191A]">
                    <LandingNavBar />
                </div>
                <div className="h-20" />
                <div className="max-w-6xl mx-auto px-6 py-20 text-center">
                    <div className="text-6xl mb-4">😔</div>
                    <h1 className="text-4xl font-bold text-gray-300 mb-4">Program Not Found</h1>
                    <p className="text-gray-400 mb-8">
                        The program you're looking for doesn't exist or has been moved.
                    </p>
                    <Button
                        onClick={() => router.push('/programs')}
                        className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Programs
                    </Button>
                </div>
            </div>
        );
    }

    // Debug: log program data
    console.log('Program detail data:', program);

    return (
        <div className="min-h-screen bg-[#1a1a1a] text-white">
            <div className="sticky top-0 z-30 bg-[#18191A]">
                <LandingNavBar />
            </div>
            <div className="h-20" />
            
            {/* Hero Section */}
            <div className="relative h-[520px] md:h-[700px] overflow-hidden">
                <img 
                    src={getProgramImage(program.name, program.school)}
                    alt={program.name}
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-black/80"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                        <h1 className="text-5xl md:text-7xl font-bold text-white drop-shadow-lg mb-4">
                            {program.name} 
                        </h1>
                        {programCourses?.hasWorkIntegratedLearning && (
                            <div className="inline-flex items-center bg-gradient-to-r from-blue-600/90 to-purple-600/90 px-6 py-3 rounded-full backdrop-blur-sm">
                                <Briefcase className="w-5 h-5 mr-2" />
                                <span className="font-semibold">Work-Integrated Learning Program</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-6 py-16">
                {/* Quick Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
                    <div className="bg-gradient-to-br from-[#2a2b2c] to-[#1f2021] rounded-2xl p-6 text-center border border-[#36454F] hover:border-amber-400/50 transition-all duration-300 hover:scale-105">
                        <Clock className="w-8 h-8 text-amber-400 mx-auto mb-3" />
                        <div className="text-2xl font-bold text-white mb-1">{program.duration}</div>
                        <div className="text-gray-400 text-sm">Duration</div>
                    </div>
                    <div className="bg-gradient-to-br from-[#2a2b2c] to-[#1f2021] rounded-2xl p-6 text-center border border-[#36454F] hover:border-amber-400/50 transition-all duration-300 hover:scale-105">
                        <Award className="w-8 h-8 text-orange-400 mx-auto mb-3" />
                        <div className="text-lg font-bold text-white mb-1">{program.credential}</div>
                        <div className="text-gray-400 text-sm">Credential</div>
                    </div>
                    <div className="bg-gradient-to-br from-[#2a2b2c] to-[#1f2021] rounded-2xl p-6 text-center border border-[#36454F] hover:border-amber-400/50 transition-all duration-300 hover:scale-105">
                        <MapPin className="w-8 h-8 text-blue-400 mx-auto mb-3" />
                        <div className="text-lg font-bold text-white mb-1">{program.campus.slice(0, 2).join(', ')}</div>
                        <div className="text-gray-400 text-sm">Campus{program.campus.length > 1 ? 'es' : ''}</div>
                    </div>
                    <div className="bg-gradient-to-br from-[#2a2b2c] to-[#1f2021] rounded-2xl p-6 text-center border border-[#36454F] hover:border-amber-400/50 transition-all duration-300 hover:scale-105">
                        <Building className="w-8 h-8 text-green-400 mx-auto mb-3" />
                        <div className="text-lg font-bold text-white mb-1">{program.school}</div>
                        <div className="text-gray-400 text-sm">School</div>
                    </div>
                </div>

                {/* Program Overview */}
                <section className="mb-16">
                    <h2 className="text-4xl font-bold mb-8 text-center">Program Overview</h2>
                    <div className="bg-gradient-to-br from-[#2a2b2c] to-[#1f2021] rounded-2xl p-8 border border-[#36454F]">
                        <p className="text-lg text-gray-300 leading-relaxed text-center max-w-4xl mx-auto">
                            {program.overview}
                        </p>
                    </div>
                </section>

                {/* Course Curriculum */}
                {programCourses && programCourses.semesters.length > 0 && (
                    <section className="mb-16">
                        <h2 className="text-4xl font-bold mb-8 text-center">Course Curriculum</h2>
                        
                        {/* Course Statistics */}
                        {programCourses.stats && (
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                                <div className="bg-gradient-to-br from-[#2a2b2c] to-[#1f2021] rounded-xl p-4 text-center border border-[#36454F]">
                                    <div className="text-2xl font-bold text-amber-400">{programCourses.stats.totalSemesters}</div>
                                    <div className="text-gray-400 text-sm">Total Semesters</div>
                                </div>
                                <div className="bg-gradient-to-br from-[#2a2b2c] to-[#1f2021] rounded-xl p-4 text-center border border-[#36454F]">
                                    <div className="text-2xl font-bold text-blue-400">{programCourses.stats.totalCoreCourses}</div>
                                    <div className="text-gray-400 text-sm">Core Courses</div>
                                </div>
                                <div className="bg-gradient-to-br from-[#2a2b2c] to-[#1f2021] rounded-xl p-4 text-center border border-[#36454F]">
                                    <div className="text-2xl font-bold text-green-400">{programCourses.stats.totalRequirements}</div>
                                    <div className="text-gray-400 text-sm">Requirements</div>
                                </div>
                                <div className="bg-gradient-to-br from-[#2a2b2c] to-[#1f2021] rounded-xl p-4 text-center border border-[#36454F]">
                                    <div className="text-2xl font-bold text-purple-400">{programCourses.stats.totalCourses}</div>
                                    <div className="text-gray-400 text-sm">Total Courses</div>
                                </div>
                            </div>
                        )}

                        {coursesLoading ? (
                            <div className="text-center py-12">
                                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-amber-400"></div>
                                <p className="text-gray-400 mt-4">Loading course curriculum...</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {programCourses.semesters
                                    .sort((a, b) => a.order - b.order)
                                    .map((semester, index) => (
                                    <div key={semester.id} className={`rounded-2xl border border-[#36454F] bg-gradient-to-br from-[#232526] to-[#1f2021] shadow-md overflow-hidden transition-all duration-500 ${openSemesterIndex === index ? 'ring-2 ring-amber-400/40 shadow-2xl scale-[1.01]' : ''}`}>
                                        <button
                                            className={`w-full flex items-center justify-between px-6 py-5 focus:outline-none transition-colors duration-300 group ${openSemesterIndex === index ? 'bg-amber-500/10' : 'hover:bg-[#232526]/80 hover:shadow-lg'}`}
                                            onClick={() => setOpenSemesterIndex(openSemesterIndex === index ? -1 : index)}
                                            aria-expanded={openSemesterIndex === index}
                                        >
                                            <div className="flex items-center gap-4">
                                                <span className="text-2xl font-bold text-white drop-shadow">{semester.name}</span>
                                                {semester.type === 'work_integrated_learning' && (
                                                    <span className="ml-2 flex items-center bg-blue-600/20 text-blue-300 px-3 py-1 rounded-full text-sm">
                                                        <Briefcase className="w-4 h-4 mr-1" />
                                                        Work-Integrated Learning
                                                    </span>
                                                )}
                                                {semester.isOptional && (
                                                    <span className="ml-2 flex items-center bg-orange-600/20 text-orange-300 px-3 py-1 rounded-full text-sm">
                                                        <AlertCircle className="w-4 h-4 mr-1" />
                                                        Optional
                                                    </span>
                                                )}
                                            </div>
                                            <span className="text-sm text-gray-400 font-medium">
                                                {semester.coreCourses.length + semester.requirements.reduce((sum, req) => sum + req.selectCount, 0)} courses
                                            </span>
                                            <span className={`ml-4 transition-transform duration-500 ${openSemesterIndex === index ? 'rotate-180' : ''}`}>
                                                <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-chevron-down text-amber-400"><polyline points="6 9 12 15 18 9"></polyline></svg>
                                            </span>
                                        </button>
                                        <div
                                            className={`transition-all duration-700 ease-in-out overflow-hidden bg-gradient-to-r from-[#232526]/80 to-[#1f2021]/90 ${openSemesterIndex === index ? 'max-h-[2000px] opacity-100 py-6 px-6' : 'max-h-0 opacity-0 py-0 px-6'}`}
                                            style={{ background: openSemesterIndex === index ? 'linear-gradient(90deg, #232526 0%, #1f2021 100%)' : undefined }}
                                        >
                                            {openSemesterIndex === index && (
                                                <>
                                                    {semester.notes && (
                                                        <div className="mb-6 p-4 bg-blue-600/10 border border-blue-600/30 rounded-lg">
                                                            <p className="text-blue-300 text-sm">{semester.notes}</p>
                                                        </div>
                                                    )}
                                                    {/* Core Courses */}
                                                    {semester.coreCourses.length > 0 && (
                                                        <div className="mb-6">
                                                            <h4 className="text-lg font-semibold text-amber-400 mb-4 flex items-center">
                                                                <CheckCircle className="w-5 h-5 mr-2" />
                                                                Core Courses ({semester.coreCourses.length})
                                                            </h4>
                                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                                {semester.coreCourses.map((course, courseIndex) => (
                                                                    <div key={courseIndex} className="bg-[#1f2021] rounded-lg p-4 border border-[#36454F] hover:border-amber-400/50 transition-colors">
                                                                        <div className="flex items-start justify-between">
                                                                            <div>
                                                                                <div className="font-semibold text-white text-sm mb-1">
                                                                                    {course.code}
                                                                                </div>
                                                                                <div className="text-gray-300 text-sm">
                                                                                    {course.name}
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    )}
                                                    {/* Requirements */}
                                                    {semester.requirements.length > 0 && (
                                                        <div>
                                                            <h4 className="text-lg font-semibold text-green-400 mb-4 flex items-center">
                                                                <Star className="w-5 h-5 mr-2" />
                                                                Course Requirements ({semester.requirements.length})
                                                            </h4>
                                                            <div className="space-y-4">
                                                                {semester.requirements.map((requirement, reqIndex) => (
                                                                    <div key={reqIndex} className={`bg-[#1f2021] rounded-lg p-4 border ${getRequirementTypeColor(requirement.type)} transition-colors`}>
                                                                        <div className="flex items-start justify-between mb-3">
                                                                            <div className="flex items-center">
                                                                                {getRequirementTypeIcon(requirement.type)}
                                                                                <div className="ml-3">
                                                                                    <div className="font-semibold text-white text-sm">
                                                                                        {requirement.title}
                                                                                    </div>
                                                                                    <div className="text-gray-400 text-sm">
                                                                                        Select {requirement.selectCount} course{requirement.selectCount > 1 ? 's' : ''}
                                                                                        {requirement.availableCourses.length > 0 ? 
                                                                                            ` from ${requirement.availableCourses.length} options` : 
                                                                                            ' (see course catalog)'
                                                                                        }
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                            
                                                                            {requirement.externalLinks && requirement.externalLinks.length > 0 && (
                                                                                <div className="mt-3">
                                                                                    <p className="text-xs text-gray-400 mb-2">For course options, visit:</p>
                                                                                    {requirement.externalLinks.map((link, linkIndex) => (
                                                                                        <a 
                                                                                            key={linkIndex}
                                                                                            href={link} 
                                                                                            target="_blank" 
                                                                                            rel="noopener noreferrer"
                                                                                            className="inline-flex items-center text-blue-400 hover:text-blue-300 text-xs mr-4"
                                                                                        >
                                                                                            <ExternalLink className="w-3 h-3 mr-1" />
                                                                                            Course Catalog
                                                                                        </a>
                                                                                    ))}
                                                                                </div>
                                                                            )}

                                                                            {requirement.availableCourses.length > 0 && (
                                                                                <div className="mt-3">
                                                                                    <p className="text-xs text-gray-400 mb-2">Available Options:</p>
                                                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                                                                        {requirement.availableCourses.slice(0, 6).map((course, courseIndex) => (
                                                                                            <div key={courseIndex} className="bg-[#36454F]/30 rounded p-2">
                                                                                                <div className="text-xs font-medium text-white">{course.code}</div>
                                                                                                <div className="text-xs text-gray-400">{course.name}</div>
                                                                                            </div>
                                                                                        ))}
                                                                                        {requirement.availableCourses.length > 6 && (
                                                                                            <div className="bg-[#36454F]/30 rounded p-2 flex items-center justify-center">
                                                                                                <span className="text-xs text-gray-400">
                                                                                                    +{requirement.availableCourses.length - 6} more
                                                                                                </span>
                                                                                            </div>
                                                                                        )}
                                                                                    </div>
                                                                                </div>
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    )}
                                                </>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </section>
                )}

                {/* Divider before Student Reviews */}
                <hr className="border-t border-gray-700/40 my-16" />
                <section className="mb-20 mt-20">
                    <h2 className="text-6xl font-bold mb-20 text-center">Student Reviews</h2>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Score Overview - Left Side */}
                        <div className="lg:col-span-1">
                            {typeof window !== 'undefined' && typeof document !== 'undefined' &&
                                <ProgramScoreOverview
                                    programId={program._id}
                                    schoolName={program.school}
                                    hideIfNoReview
                                />
                            }
                        </div>
                        
                        {/* Reviews Display - Right Side */}
                        <div className="lg:col-span-2">
                            <ProgramReviewDisplay
                                programId={program._id}
                                programName={program.name}
                                schoolName={program.school}
                            />
                        </div>
                    </div>
                </section>

                {/* Apply Now Section */}
                <section className="text-center">
                    <div className="bg-gradient-to-r from-amber-500/20 to-orange-500/20 rounded-2xl p-12 border border-amber-500/30">
                        <h2 className="text-3xl font-bold mb-4">Ready to Apply?</h2>
                        <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
                            Take the next step in your career journey. Apply now to secure your spot in this program.
                        </p>
                        <Button
                            onClick={() => window.open(`https://www.senecapolytechnic.ca/programs/fulltime/${program.code}/apply-now.html#menu`, '_blank')}
                            className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white px-8 py-4 text-lg font-semibold"
                        >
                            <ExternalLink className="w-5 h-5 mr-2" />
                            Apply Now at Seneca
                        </Button>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default ProgramDetailPage; 