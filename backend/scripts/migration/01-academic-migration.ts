// scripts/migration/01-academic-migration.ts

import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

// Import only existing models (NO Material import!)
import User from '../../src/models/User';
import { StudyMaterial } from '../../src/models/StudyMaterial'; // New model only
import { School } from '../../src/models/School';
import { Program } from '../../src/models/Program';
import { Course } from '../../src/models/Course';

// Type definitions
interface CollegeProgram {
    // ✅ Existing fields
    name: string;
    code: string;
    level: string;
    duration: string;
    faculty: string;
    totalCredits: number;
    durationYears: number;
    durationSemesters: number;
    
    // ✅ Add new fields
    courses?: CourseData[]; // Optional array of courses
}

// ✅ Add new interface for courses
interface CourseData {
    code: string;
    name: string;
    semester: number;
    credits: number;
    level: '1'| '2'| '3'| '4'| 'graduate'| 'undergraduate';
    totalHours: number;
    studyMaterials?: StudyMaterialData[]; // Optional study materials
}

// ✅ Add new interface for study materials
interface StudyMaterialData {
    title: string;
    description: string;
    type: string;
    category: string;
    difficulty: string;
    semester: {
        year: number;
        term: string;
    };
    content?: {
        text?: string;
        attachments?: any[];
    };
    tags?: string[];
    language?: string;
    estimatedReadTime?: number;
}

// ✅ Enhanced CollegeData interface  
interface CollegeData {
    name: string;
    code: string;
    type: 'College' | 'University' | 'Institute';
    location: string;
    website: string;
    established: number;
    programs: CollegeProgram[];
    // ✅ Move semester/difficulty/category to StudyMaterial level (more appropriate)
}

// Sample academic materials to create (thay vì migrate old data)
interface SampleMaterial {
    title: string;
    description: string;
    category: string;
    content?: string;
    difficulty: 'easy' | 'medium' | 'hard';
}

// Canadian college data (same as before)
const CANADIAN_COLLEGES: CollegeData[] = [
    {
        name: "Seneca Polytechnic",
        code: "SENECA",
        type: "College",
        location: "Toronto, Ontario",
        website: "https://www.senecapolytechnic.ca",
        established: 1967,
        programs: [
            {
                name: "Computer Programming",
                code: "CPP",
                level: "Diploma",
                duration: "3 years",
                faculty: "School of Software Design & Data Science",
                totalCredits: 90, // ✅ Required
                durationYears: 3, // ✅ Required
                durationSemesters: 6, // ✅ Required
                courses: [ // ✅ Add courses array
                    {
                        code: 'IPC144',
                        name: 'Introduction to Programming Using C',
                        credits: 4,
                        semester: 1, // ✅ Semester number
                        level: '1',
                        totalHours: 6, // ✅ Under 10 limit
                        studyMaterials: [
                            {
                                title: 'IPC144 - Lecture Notes',
                                description: 'Comprehensive lecture notes for Introduction to Programming Using C',
                                type: 'document',
                                category: 'lecture-notes',
                                difficulty: 'beginner',
                                semester: {
                                    term: 'fall',
                                    year: 2024
                                },
                                content: {
                                    text: 'Sample lecture notes content for C programming fundamentals',
                                    attachments: []
                                },
                                tags: ['ipc144', 'c-programming', 'introduction'],
                                language: 'en',
                                estimatedReadTime: 30
                            },
                            {
                                title: 'IPC144 - Lab Exercises',
                                description: 'Hands-on programming exercises in C',
                                type: 'exercise',
                                category: 'lab-report',
                                difficulty: 'beginner',
                                semester: {
                                    term: 'fall',
                                    year: 2024
                                },
                                content: {
                                    text: 'Sample lab exercises for C programming practice',
                                    attachments: []
                                },
                                tags: ['ipc144', 'lab', 'exercises'],
                                language: 'en',
                                estimatedReadTime: 45
                            },
                            {
                                title: 'IPC144 - Assignment Guide',
                                description: 'Assignment guidelines and rubrics',
                                type: 'document',
                                category: 'assignment',
                                difficulty: 'intermediate',
                                semester: {
                                    term: 'fall',
                                    year: 2024
                                },
                                content: {
                                    text: 'Sample assignment guidelines and evaluation criteria',
                                    attachments: []
                                },
                                tags: ['ipc144', 'assignment', 'guidelines'],
                                language: 'en',
                                estimatedReadTime: 20
                            }
                        ]
                    },
                    {
                        code: 'ULI101',
                        name: 'Introduction to UNIX/Linux and the Internet',
                        credits: 4,
                        semester: 1,
                        level: '1',
                        totalHours: 6,
                        studyMaterials: [
                            {
                                title: 'ULI101 - UNIX Commands Reference',
                                description: 'Essential UNIX/Linux commands reference guide',
                                type: 'document',
                                category: 'reference',
                                difficulty: 'beginner',
                                semester: {
                                    term: 'fall',
                                    year: 2024
                                },
                                content: {
                                    text: 'Comprehensive UNIX/Linux commands reference',
                                    attachments: []
                                },
                                tags: ['uli101', 'unix', 'linux', 'commands'],
                                language: 'en',
                                estimatedReadTime: 25
                            },
                            {
                                title: 'ULI101 - Terminal Lab Sessions',
                                description: 'Interactive terminal exercises',
                                type: 'exercise',
                                category: 'lab-report',
                                difficulty: 'beginner',
                                semester: {
                                    term: 'fall',
                                    year: 2024
                                },
                                content: {
                                    text: 'Hands-on terminal exercises and practice sessions',
                                    attachments: []
                                },
                                tags: ['uli101', 'terminal', 'practice'],
                                language: 'en',
                                estimatedReadTime: 40
                            }
                        ]
                    },
                    {
                        code: 'EAC150',
                        name: 'English and Academic Communication',
                        credits: 3,
                        semester: 1,
                        level: '1',
                        totalHours: 5,
                        studyMaterials: [
                            {
                                title: 'EAC150 - Communication Strategies',
                                description: 'Academic communication techniques and strategies',
                                type: 'document',
                                category: 'lecture-notes',
                                difficulty: 'beginner',
                                semester: {
                                    term: 'fall',
                                    year: 2024
                                },
                                tags: ['eac150', 'communication', 'academic-writing'],
                                language: 'en',
                                estimatedReadTime: 25
                            }
                        ]
                    }
                ]
            },
            {
                name: "Business Administration",
                code: "BBA",
                level: "Diploma",
                duration: "2 years",
                faculty: "School of Business",
                totalCredits: 60,
                durationYears: 2,
                durationSemesters: 4,
                courses: [
                    {
                        code: 'BUS100',
                        name: 'Introduction to Business',
                        credits: 3,
                        semester: 1,
                        level: '1',
                        totalHours: 5,
                        studyMaterials: [
                            {
                                title: 'BUS100 - Business Fundamentals',
                                description: 'Core business concepts and principles',
                                type: 'document',
                                category: 'lecture-notes',
                                difficulty: 'beginner',
                                semester: {
                                    term: 'fall',
                                    year: 2024
                                },
                                tags: ['bus100', 'business', 'fundamentals'],
                                language: 'en',
                                estimatedReadTime: 20
                            }
                        ]
                    }
                ]
            },
            {
                name: "Nursing",
                code: "BSN",
                level: "Bachelor",
                duration: "4 years",
                faculty: "School of Health Sciences",
                totalCredits: 120,
                durationYears: 4,
                durationSemesters: 8,
                courses: [
                    {
                        code: 'NSG101',
                        name: 'Fundamentals of Nursing',
                        credits: 4,
                        semester: 1,
                        level: '1',
                        totalHours: 8,
                        studyMaterials: [
                            {
                                title: 'NSG101 - Nursing Foundations',
                                description: 'Basic nursing principles and practices',
                                type: 'document',
                                category: 'lecture-notes',
                                difficulty: 'beginner',
                                semester: {
                                    term: 'fall',
                                    year: 2024
                                },
                                tags: ['nsg101', 'nursing', 'foundations'],
                                language: 'en',
                                estimatedReadTime: 35
                            }
                        ]
                    }
                ]
            }
        ]
    },
    {
        name: "Humber College",
        code: "HUMBER",
        type: "College",
        location: "Toronto, Ontario",
        website: "https://humber.ca",
        established: 1967,
        programs: [
            {
                name: "Computer Programming",
                code: "CPP",
                level: "Diploma",
                duration: "3 years",
                faculty: "Faculty of Applied Sciences & Technology",
                totalCredits: 90,
                durationYears: 3,
                durationSemesters: 6,
                courses: [
                    {
                        code: 'COMP1030',
                        name: 'Programming Fundamentals',
                        credits: 4,
                        semester: 1,
                        level: '1',
                        totalHours: 6,
                        studyMaterials: [
                            {
                                title: 'COMP1030 - Programming Basics',
                                description: 'Fundamental programming concepts and principles',
                                type: 'document',
                                category: 'lecture-notes',
                                difficulty: 'beginner',
                                semester: {
                                    term: 'fall',
                                    year: 2024
                                },
                                tags: ['comp1030', 'programming', 'fundamentals'],
                                language: 'en',
                                estimatedReadTime: 35
                            }
                        ]
                    }
                ]
            }
        ]
    }
];

const COURSE_DATA: Record<string, CourseData[]> = {
    'SENECA-CPP': [
        {
            code: 'IPC144',
            name: 'Introduction to Programming Using C',
            credits: 4,
            semester: 1, // ✅ Add semester
            level: '1',
            totalHours: 6,
            studyMaterials: [ // ✅ Add study materials
                {
                    title: 'IPC144 - Lecture Notes',
                    description: 'Comprehensive lecture notes for Introduction to Programming Using C',
                    type: 'document',
                    category: 'lecture-notes',
                    difficulty: 'beginner',
                    semester: {
                        term: 'fall',
                        year: 2024
                    },
                    content: {
                        text: 'Sample lecture notes content for C programming fundamentals',
                        attachments: []
                    },
                    tags: ['ipc144', 'c-programming', 'introduction'],
                    language: 'en',
                    estimatedReadTime: 30
                },
                {
                    title: 'IPC144 - Lab Exercises',
                    description: 'Hands-on programming exercises in C',
                    type: 'exercise',
                    category: 'lab-report',
                    difficulty: 'beginner',
                    semester: {
                        term: 'fall',
                        year: 2024
                    },
                    content: {
                        text: 'Sample lab exercises for C programming practice',
                        attachments: []
                    },
                    tags: ['ipc144', 'lab', 'exercises'],
                    language: 'en',
                    estimatedReadTime: 45
                },
                {
                    title: 'IPC144 - Assignment Guide',
                    description: 'Assignment guidelines and rubrics',
                    type: 'document',
                    category: 'assignment',
                    difficulty: 'intermediate',
                    semester: {
                        term: 'fall',
                        year: 2024
                    },
                    content: {
                        text: 'Sample assignment guidelines and evaluation criteria',
                        attachments: []
                    },
                    tags: ['ipc144', 'assignment', 'guidelines'],
                    language: 'en',
                    estimatedReadTime: 20
                }
            ]
        },
        {
            code: 'ULI101',
            name: 'Introduction to UNIX/Linux and the Internet',
            credits: 4,
            semester: 1, // ✅ Add semester
            level: '1',
            totalHours: 6,
            studyMaterials: [
                {
                    title: 'ULI101 - UNIX Commands Reference',
                    description: 'Essential UNIX/Linux commands reference guide',
                    type: 'document',
                    category: 'reference',
                    difficulty: 'beginner',
                    semester: {
                        term: 'fall',
                        year: 2024
                    },
                    content: {
                        text: 'Comprehensive UNIX/Linux commands reference',
                        attachments: []
                    },
                    tags: ['uli101', 'unix', 'linux', 'commands'],
                    language: 'en',
                    estimatedReadTime: 25
                },
                {
                    title: 'ULI101 - Terminal Lab Sessions',
                    description: 'Interactive terminal exercises',
                    type: 'exercise',
                    category: 'lab-report',
                    difficulty: 'beginner',
                    semester: {
                        term: 'fall',
                        year: 2024
                    },
                    content: {
                        text: 'Hands-on terminal exercises and practice sessions',
                        attachments: []
                    },
                    tags: ['uli101', 'terminal', 'practice'],
                    language: 'en',
                    estimatedReadTime: 40
                }
            ]
        },
        {
            code: 'EAC150',
            name: 'English and Academic Communication',
            credits: 3,
            semester: 1, // ✅ Add semester
            level: '1',
            totalHours: 5,
            studyMaterials: [
                {
                    title: 'EAC150 - Communication Strategies',
                    description: 'Academic communication techniques and strategies',
                    type: 'document',
                    category: 'lecture-notes',
                    difficulty: 'beginner',
                    semester: {
                        term: 'fall',
                        year: 2024
                    },
                    content: {
                        text: 'Academic writing and communication fundamentals',
                        attachments: []
                    },
                    tags: ['eac150', 'communication', 'academic-writing'],
                    language: 'en',
                    estimatedReadTime: 25
                },
                {
                    title: 'EAC150 - Essay Writing Guide',
                    description: 'Step-by-step essay writing techniques',
                    type: 'document',
                    category: 'tutorial',
                    difficulty: 'intermediate',
                    semester: {
                        term: 'fall',
                        year: 2024
                    },
                    content: {
                        text: 'Comprehensive guide to academic essay writing',
                        attachments: []
                    },
                    tags: ['eac150', 'essay', 'writing'],
                    language: 'en',
                    estimatedReadTime: 30
                }
            ]
        },
        {
            code: 'DBS211',
            name: 'Introduction to Database Design',
            credits: 4,
            semester: 2, // ✅ Add semester
            level: '1',
            totalHours: 6,
            studyMaterials: [
                {
                    title: 'DBS211 - Database Fundamentals',
                    description: 'Core database concepts and design principles',
                    type: 'document',
                    category: 'lecture-notes',
                    difficulty: 'beginner',
                    semester: {
                        term: 'winter',
                        year: 2024
                    },
                    content: {
                        text: 'Database design fundamentals and SQL basics',
                        attachments: []
                    },
                    tags: ['dbs211', 'database', 'sql'],
                    language: 'en',
                    estimatedReadTime: 35
                },
                {
                    title: 'DBS211 - SQL Practice Exercises',
                    description: 'Hands-on SQL query exercises',
                    type: 'exercise',
                    category: 'lab-report',
                    difficulty: 'intermediate',
                    semester: {
                        term: 'winter',
                        year: 2024
                    },
                    content: {
                        text: 'SQL practice exercises and solutions',
                        attachments: []
                    },
                    tags: ['dbs211', 'sql', 'practice'],
                    language: 'en',
                    estimatedReadTime: 50
                }
            ]
        },
        {
            code: 'OOP244',
            name: 'Introduction to Object Oriented Programming',
            credits: 4,
            semester: 2, // ✅ Add semester
            level: '1',
            totalHours: 6,
            studyMaterials: [
                {
                    title: 'OOP244 - OOP Concepts',
                    description: 'Object-oriented programming principles and concepts',
                    type: 'document',
                    category: 'lecture-notes',
                    difficulty: 'intermediate',
                    semester: {
                        term: 'winter',
                        year: 2024
                    },
                    content: {
                        text: 'OOP fundamentals: classes, objects, inheritance, polymorphism',
                        attachments: []
                    },
                    tags: ['oop244', 'oop', 'programming'],
                    language: 'en',
                    estimatedReadTime: 40
                },
                {
                    title: 'OOP244 - C++ Programming Labs',
                    description: 'Practical C++ programming exercises',
                    type: 'exercise',
                    category: 'lab-report',
                    difficulty: 'intermediate',
                    semester: {
                        term: 'winter',
                        year: 2024
                    },
                    content: {
                        text: 'C++ OOP programming exercises and projects',
                        attachments: []
                    },
                    tags: ['oop244', 'cpp', 'lab'],
                    language: 'en',
                    estimatedReadTime: 60
                }
            ]
        },
        {
            code: 'WEB222',
            name: 'Web Programming Principles',
            credits: 4,
            semester: 2, // ✅ Add semester
            level: '1',
            totalHours: 6,
            studyMaterials: [
                {
                    title: 'WEB222 - HTML & CSS Fundamentals',
                    description: 'Basic web development with HTML and CSS',
                    type: 'document',
                    category: 'lecture-notes',
                    difficulty: 'beginner',
                    semester: {
                        term: 'winter',
                        year: 2024
                    },
                    content: {
                        text: 'HTML structure and CSS styling fundamentals',
                        attachments: []
                    },
                    tags: ['web222', 'html', 'css'],
                    language: 'en',
                    estimatedReadTime: 35
                },
                {
                    title: 'WEB222 - JavaScript Introduction',
                    description: 'JavaScript programming for web development',
                    type: 'document',
                    category: 'lecture-notes',
                    difficulty: 'intermediate',
                    semester: {
                        term: 'winter',
                        year: 2024
                    },
                    content: {
                        text: 'JavaScript basics for interactive web pages',
                        attachments: []
                    },
                    tags: ['web222', 'javascript', 'programming'],
                    language: 'en',
                    estimatedReadTime: 45
                },
                {
                    title: 'WEB222 - Web Project Templates',
                    description: 'Sample web development projects',
                    type: 'document',
                    category: 'project',
                    difficulty: 'intermediate',
                    semester: {
                        term: 'winter',
                        year: 2024
                    },
                    content: {
                        text: 'Complete web development project examples',
                        attachments: []
                    },
                    tags: ['web222', 'project', 'template'],
                    language: 'en',
                    estimatedReadTime: 30
                }
            ]
        }
    ],
    'HUMBER-CPP': [
        {
            code: 'COMP1030',
            name: 'Programming Fundamentals',
            semester: 1,
            credits: 4,
            level: '1',
            totalHours: 6,
            studyMaterials: [
                {
                    title: 'COMP1030 - Programming Basics',
                    description: 'Fundamental programming concepts and principles',
                    type: 'document',
                    category: 'lecture-notes',
                    difficulty: 'beginner',
                    semester: {
                        term: 'fall',
                        year: 2024
                    },
                    content: {
                        text: 'Core programming fundamentals and basic concepts',
                        attachments: []
                    },
                    tags: ['comp1030', 'programming', 'fundamentals'],
                    language: 'en',
                    estimatedReadTime: 35
                },
                {
                    title: 'COMP1030 - Coding Exercises',
                    description: 'Basic programming exercises and challenges',
                    type: 'exercise',
                    category: 'lab-report',
                    difficulty: 'beginner',
                    semester: {
                        term: 'fall',
                        year: 2024
                    },
                    content: {
                        text: 'Step-by-step programming exercises for beginners',
                        attachments: []
                    },
                    tags: ['comp1030', 'exercises', 'coding'],
                    language: 'en',
                    estimatedReadTime: 40
                }
            ]
        },
        {
            code: 'MATH1500',
            name: 'Mathematics for Computer Studies',
            semester: 1,
            credits: 4,
            level: '1',
            totalHours: 6,
            studyMaterials: [
                {
                    title: 'MATH1500 - Mathematical Foundations',
                    description: 'Essential mathematics for computer science',
                    type: 'document',
                    category: 'lecture-notes',
                    difficulty: 'intermediate',
                    semester: {
                        term: 'fall',
                        year: 2024
                    },
                    content: {
                        text: 'Mathematical concepts essential for computer studies',
                        attachments: []
                    },
                    tags: ['math1500', 'mathematics', 'computer-science'],
                    language: 'en',
                    estimatedReadTime: 30
                },
                {
                    title: 'MATH1500 - Formula Reference Sheet',
                    description: 'Quick reference for mathematical formulas',
                    type: 'document',
                    category: 'cheat-sheet',
                    difficulty: 'beginner',
                    semester: {
                        term: 'fall',
                        year: 2024
                    },
                    content: {
                        text: 'Handy reference sheet for mathematical formulas',
                        attachments: []
                    },
                    tags: ['math1500', 'formulas', 'reference'],
                    language: 'en',
                    estimatedReadTime: 15
                }
            ]
        },
        {
            code: 'COMP1230',
            name: 'Object Oriented Programming',
            semester: 2,
            credits: 4,
            level: '1',
            totalHours: 6,
            studyMaterials: [
                {
                    title: 'COMP1230 - OOP Design Patterns',
                    description: 'Object-oriented design patterns and best practices',
                    type: 'document',
                    category: 'lecture-notes',
                    difficulty: 'advanced',
                    semester: {
                        term: 'winter',
                        year: 2024
                    },
                    content: {
                        text: 'Advanced OOP concepts and design patterns',
                        attachments: []
                    },
                    tags: ['comp1230', 'oop', 'design-patterns'],
                    language: 'en',
                    estimatedReadTime: 50
                },
                {
                    title: 'COMP1230 - Java Programming Projects',
                    description: 'Practical Java OOP projects and assignments',
                    type: 'exercise',
                    category: 'project',
                    difficulty: 'intermediate',
                    semester: {
                        term: 'winter',
                        year: 2024
                    },
                    content: {
                        text: 'Complete Java OOP projects with source code',
                        attachments: []
                    },
                    tags: ['comp1230', 'java', 'projects'],
                    language: 'en',
                    estimatedReadTime: 60
                }
            ]
        }
    ]
};

// Sample materials to create for each course type
const SAMPLE_MATERIALS: Record<string, SampleMaterial[]> = {
    'lecture-notes': [
        {
            title: "Introduction to Variables and Data Types",
            description: "Comprehensive notes on C programming fundamentals",
            category: "lecture-notes",
            content: "# Variables in C\n\nIn C programming, variables are used to store data...",
            difficulty: "easy"
        },
        {
            title: "Object-Oriented Programming Concepts",
            description: "Core OOP principles and implementation",
            category: "lecture-notes",
            difficulty: "medium"
        }
    ],
    'assignments': [
        {
            title: "Lab Assignment 1 - Hello World Program",
            description: "Create your first C program with input/output",
            category: "assignments",
            difficulty: "easy"
        },
        {
            title: "Database Design Project",
            description: "Design and implement a relational database system",
            category: "assignments",
            difficulty: "hard"
        }
    ],
    'lab-materials': [
        {
            title: "Lab 3 - Arrays and Loops",
            description: "Hands-on practice with arrays and iteration",
            category: "lab-materials",
            difficulty: "medium"
        }
    ],
    'practice-exams': [
        {
            title: "Midterm Practice Questions",
            description: "Sample questions for midterm preparation",
            category: "practice-exams",
            difficulty: "medium"
        }
    ]
};

interface MigrationStats {
    schoolsCreated: number;
    programsCreated: number;
    coursesCreated: number;
    sampleMaterialsCreated: number; // Changed from materialsConverted
    usersUpdated: number;
}

export async function runAcademicMigration(): Promise<MigrationStats> {
    try {
        console.log('🚀 Starting Academic Migration...');

        // Connect to MongoDB
        if (mongoose.connection.readyState === 0) {
            await mongoose.connect(process.env.MONGODB_URL!);
        }
        console.log('✅ Connected to MongoDB');

        const stats: MigrationStats = {
            schoolsCreated: 0,
            programsCreated: 0,
            coursesCreated: 0,
            sampleMaterialsCreated: 0, // Changed
            usersUpdated: 0
        };

        // 1. Create Academic Collections
        console.log('📚 Creating academic data...');

        // Clear existing academic data
        await School.deleteMany({});
        await Program.deleteMany({});
        await Course.deleteMany({});
        await StudyMaterial.deleteMany({}); // Clear study materials
        console.log('🗑️ Cleared existing academic data');

        // Insert schools and programs
        // Enhanced migration with courses and study materials
        for (const collegeData of CANADIAN_COLLEGES) {
            try {
                // Create school
                const school = await School.create({
                    name: collegeData.name,
                    code: collegeData.code,
                    type: collegeData.type,
                    location: collegeData.location,
                    website: collegeData.website,
                    established: collegeData.established,
                    isActive: true
                });

                console.log(`✅ Created school: ${school.name}`);

                // Create programs
                for (const programData of collegeData.programs) {
                    const program = await Program.create({
                        school: school._id,
                        name: programData.name,
                        code: programData.code,
                        level: programData.level,
                        duration: {
                            years: programData.durationYears,
                            semesters: programData.durationSemesters
                        },
                        description: `${programData.level} program in ${programData.name} at ${collegeData.name}`,
                        totalCredits: programData.totalCredits,
                        isActive: true
                    });

                    console.log(`✅ Created program: ${program.name} (${program.code})`);

                    // Create courses if they exist
                    if (programData.courses && programData.courses.length > 0) {
                        for (const courseData of programData.courses) {
                            const course = await Course.create({
                                school: school._id,
                                program: program._id,
                                code: courseData.code,
                                name: courseData.name,
                                semester: courseData.semester,
                                credits: courseData.credits,
                                level: courseData.level,
                                hours: {
                                    total: courseData.totalHours,
                                    lecture: Math.floor(courseData.totalHours * 0.6),
                                    lab: Math.floor(courseData.totalHours * 0.4),
                                    tutorial: 0
                                },
                                description: `${courseData.name} - Core course for ${programData.name} program`,
                                isActive: true
                            });

                            console.log(`✅ Created course: ${course.name} (${course.code})`);

                            // Create study materials if they exist
                            if (courseData.studyMaterials && courseData.studyMaterials.length > 0) {
                                for (const materialData of courseData.studyMaterials) {
                                    try {
                                        const material = await StudyMaterial.create({
                                            title: materialData.title,
                                            description: materialData.description,
                                            type: materialData.type,
                                            category: materialData.category,
                                            content: materialData.content || {
                                                text: `Sample content for ${materialData.title}`,
                                                attachments: []
                                            },
                                            metadata: {
                                                difficulty: materialData.difficulty,
                                                tags: materialData.tags || [courseData.code.toLowerCase()],
                                                language: materialData.language || 'en',
                                                estimatedReadTime: materialData.estimatedReadTime || 15
                                            },
                                            academic: {
                                                course: course._id,
                                                program: program._id,
                                                semester: materialData.semester
                                            },
                                            author: {
                                                name: 'System Admin',
                                                role: 'administrator'
                                            },
                                            isPublic: true,
                                            isActive: true
                                        });

                                        console.log(`✅ Created study material: ${material.title}`);
                                    } catch (error) {
                                        const msg = error instanceof Error ? error.message : String(error);
                                        console.error(`❌ Error creating study material for course ${courseData.code}:`, msg);
                                    }
                                }
                            }
                        }
                    }
                }
            } catch (error) {
                const msg = error instanceof Error ? error.message : String(error);
                console.error(`❌ Error creating data for ${collegeData.name}:`, msg);
            }
        }

        // 2. Update Users to Academic Context (optional - only if you want)
        console.log('👥 Updating users to academic context...');

        const users = await User.find({});
        console.log(`Found ${users.length} users to update`);

        const schools = await School.find({});

        // Add academic context to existing users
        for (const user of users) {
            try {
                // Randomly assign academic info for demo
                const randomSchool = schools[Math.floor(Math.random() * schools.length)];
                const programs = await Program.find({ school: randomSchool._id });

                if (programs.length > 0) {
                    const randomProgram = programs[Math.floor(Math.random() * programs.length)];

                    await User.findByIdAndUpdate(user._id, {
                        $set: {
                            'academic.school': randomSchool._id,
                            'academic.program': randomProgram._id,
                            'academic.year': Math.ceil(Math.random() * 4), // Random year 1-4
                            'academic.semester': ['Fall', 'Winter', 'Summer'][Math.floor(Math.random() * 3)],
                            'academic.graduationYear': new Date().getFullYear() + Math.ceil(Math.random() * 3),
                            'academic.studentId': `${randomSchool.code}${Date.now().toString().slice(-6)}`
                        }
                    });

                    stats.usersUpdated++;
                }
            } catch (error) {
                const msg = error instanceof Error ? error.message : String(error);
                console.error(`Error updating user ${user._id}:`, msg);
            }
        }

        console.log('✅ Migration completed successfully!');
        return stats;

    } catch (error) {
        const msg = error instanceof Error ? error.message : String(error);
        console.error('❌ Migration failed:', msg);
        throw error;
    }
}

// 🆕 Helper function to create sample materials for each course
async function createSampleMaterialsForCourse(course: any, school: any, program: any, stats: MigrationStats): Promise<void> {
    // Get first user as sample author (or create default author)
    const sampleUser = await User.findOne({}) || { _id: new mongoose.Types.ObjectId() };

    // Create 2-3 sample materials per course
    const materialTypes = ['lecture-notes', 'assignments', 'lab-materials'];

    for (let i = 0; i < 2; i++) {
        const materialType = materialTypes[Math.floor(Math.random() * materialTypes.length)];
        const samples = SAMPLE_MATERIALS[materialType];

        if (samples && samples.length > 0) {
            const sampleMaterial = samples[Math.floor(Math.random() * samples.length)];

            try {
                await StudyMaterial.create({
                    title: `${course.code} - ${sampleMaterial.title}`,
                    description: `${sampleMaterial.description} for ${course.name}`,
                    category: sampleMaterial.category,
                    academic: {
                        school: school._id,
                        program: program._id,
                        course: course._id,
                        semester: course.semester,
                        academicYear: '2024-2025',
                        term: 'Fall'
                    },
                    content: sampleMaterial.content || `Sample content for ${course.code}`,
                    attachments: [],
                    author: sampleUser._id,
                    tags: [course.code, program.code, materialType],
                    difficulty: sampleMaterial.difficulty,
                    isPublic: true,
                    status: 'published',
                    views: Math.floor(Math.random() * 100),
                    saves: Math.floor(Math.random() * 20),
                    ratings: [],
                    comments: [],
                    averageRating: 0,
                    totalRatings: 0,
                    createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000), // Random date within last 30 days
                    updatedAt: new Date()
                });

                stats.sampleMaterialsCreated++;
            } catch (error) {
                const msg = error instanceof Error ? error.message : String(error);
                console.error(`Error creating sample material for course ${course.code}:`, msg);
            }
        }
    }
}

// Function to print migration summary
export function printMigrationSummary(stats: MigrationStats): void {
    console.log('\n📊 Migration Summary:');
    console.log(`🏫 Schools created: ${stats.schoolsCreated}`);
    console.log(`🎓 Programs created: ${stats.programsCreated}`);
    console.log(`📚 Courses created: ${stats.coursesCreated}`);
    console.log(`📄 Sample materials created: ${stats.sampleMaterialsCreated}`); // Changed
    console.log(`👥 Users updated: ${stats.usersUpdated}`);
    console.log('\n🎯 Next Steps:');
    console.log('1. Update API endpoints to use new academic models');
    console.log('2. Update frontend components for academic context');
    console.log('3. Test material upload with academic categorization');
    console.log('4. Run enrollment migration');
}

// Run migration if called directly
if (require.main === module) {
    runAcademicMigration()
        .then((stats) => {
            printMigrationSummary(stats);
            process.exit(0);
        })
        .catch((error) => {
            const msg = error instanceof Error ? error.message : String(error);
            console.error('❌ Migration failed:', msg);
            process.exit(1);
        });
}

export { CANADIAN_COLLEGES, COURSE_DATA };