export interface Course {
    _id: string;
    code: string;
    name: string;
    description: string;
    credits: number;
    level: string;
    difficulty: 'beginner' | 'intermediate' | 'advanced';
    delivery: string[];
    language: string;
    school: {
        name: string;
        shortName: string;
    };
    programs: Array<{
        program: {
            name: string;
            code: string;
        };
        semester: number;
    }>;
    professors: Array<{
        name: string;
        rating?: number;
    }>;
    stats: {
        enrollmentCount: number;
        rating: {
            average: number;
            count: number;
        };
        materialCount: number;
    };
    imageUrl: string;
}

export const programs: Course[] = [
    {
        _id: '1',
        code: 'ANIM001',
        name: '3D Animation',
        description: 'Comprehensive program covering 3D modeling, animation techniques, rigging, and visual effects for film, television, and gaming industries.',
        credits: 6,
        level: '2',
        difficulty: 'intermediate',
        delivery: ['in-person', 'hybrid'],
        language: 'english',
        school: {
            name: 'Seneca Polytechnic',
            shortName: 'Seneca'
        },
        programs: [{
            program: {
                name: 'Creative Arts, Animation & Design',
                code: 'CAAD'
            },
            semester: 1
        }],
        professors: [{
            name: 'Prof. Michael Chen',
            rating: 4.2
        }],
        stats: {
            enrollmentCount: 85,
            rating: {
                average: 4.1,
                count: 42
            },
            materialCount: 15
        },
        imageUrl: '/animation.jpg'
    },
    {
        _id: '2',
        code: 'EMRG001',
        name: '911 & Emergency Services Communications',
        description: 'Training program for emergency dispatch operators covering communication protocols, crisis management, and emergency response coordination.',
        credits: 4,
        level: '2',
        difficulty: 'intermediate',
        delivery: ['in-person'],
        language: 'english',
        school: {
            name: 'Seneca Polytechnic',
            shortName: 'Seneca'
        },
        programs: [{
            program: {
                name: 'Law, Administration & Public Safety',
                code: 'LAPS'
            },
            semester: 1
        }],
        professors: [{
            name: 'Prof. Janet Rodriguez',
            rating: 4.5
        }],
        stats: {
            enrollmentCount: 45,
            rating: {
                average: 4.3,
                count: 28
            },
            materialCount: 12
        },
        imageUrl: '/marketing.jpg'
    },
    {
        _id: '3',
        code: 'ACUP001',
        name: 'Academic Upgrading',
        description: 'Foundation program helping students develop essential academic skills and knowledge required for post-secondary education.',
        credits: 3,
        level: '1',
        difficulty: 'beginner',
        delivery: ['in-person', 'online'],
        language: 'english',
        school: {
            name: 'Seneca Polytechnic',
            shortName: 'Seneca'
        },
        programs: [{
            program: {
                name: 'Liberal Arts & University Transfers',
                code: 'LAUT'
            },
            semester: 1
        }],
        professors: [{
            name: 'Prof. Sarah Williams',
            rating: 4.0
        }],
        stats: {
            enrollmentCount: 120,
            rating: {
                average: 3.9,
                count: 65
            },
            materialCount: 8
        },
        imageUrl: '/math.jpg'
    },
    {
        _id: '4',
        code: 'ACCT001',
        name: 'Accounting',
        description: 'Comprehensive accounting program covering financial reporting, auditing, taxation, and business finance principles.',
        credits: 6,
        level: '2',
        difficulty: 'intermediate',
        delivery: ['in-person', 'online'],
        language: 'english',
        school: {
            name: 'Seneca Polytechnic',
            shortName: 'Seneca'
        },
        programs: [{
            program: {
                name: 'Business',
                code: 'BUS'
            },
            semester: 1
        }],
        professors: [{
            name: 'Prof. David Thompson',
            rating: 4.3
        }],
        stats: {
            enrollmentCount: 180,
            rating: {
                average: 4.2,
                count: 95
            },
            materialCount: 18
        },
        imageUrl: '/marketing.jpg'
    },
    {
        _id: '5',
        code: 'ACFN001',
        name: 'Accounting & Finance',
        description: 'Integrated program combining accounting principles with financial management, investment analysis, and corporate finance.',
        credits: 6,
        level: '2',
        difficulty: 'intermediate',
        delivery: ['in-person', 'hybrid'],
        language: 'english',
        school: {
            name: 'Seneca Polytechnic',
            shortName: 'Seneca'
        },
        programs: [{
            program: {
                name: 'Business',
                code: 'BUS'
            },
            semester: 1
        }],
        professors: [{
            name: 'Prof. Lisa Chang',
            rating: 4.4
        }],
        stats: {
            enrollmentCount: 145,
            rating: {
                average: 4.3,
                count: 78
            },
            materialCount: 20
        },
        imageUrl: '/marketing.jpg'
    },
    {
        _id: '6',
        code: 'ACPY001',
        name: 'Accounting & Payroll',
        description: 'Specialized program focusing on payroll administration, tax compliance, and accounting procedures for small to medium businesses.',
        credits: 4,
        level: '2',
        difficulty: 'intermediate',
        delivery: ['in-person', 'online'],
        language: 'english',
        school: {
            name: 'Seneca Polytechnic',
            shortName: 'Seneca'
        },
        programs: [{
            program: {
                name: 'Business',
                code: 'BUS'
            },
            semester: 1
        }],
        professors: [{
            name: 'Prof. Robert Kim',
            rating: 4.1
        }],
        stats: {
            enrollmentCount: 95,
            rating: {
                average: 4.0,
                count: 52
            },
            materialCount: 14
        },
        imageUrl: '/marketing.jpg'
    },
    {
        _id: '7',
        code: 'ACTV001',
        name: 'Acting for Camera & Voice',
        description: 'Professional acting program focusing on screen performance, voice acting techniques, and character development for film and television.',
        credits: 4,
        level: '2',
        difficulty: 'intermediate',
        delivery: ['in-person'],
        language: 'english',
        school: {
            name: 'Seneca Polytechnic',
            shortName: 'Seneca'
        },
        programs: [{
            program: {
                name: 'Creative Arts, Animation & Design',
                code: 'CAAD'
            },
            semester: 1
        }],
        professors: [{
            name: 'Prof. Maria Santos',
            rating: 4.6
        }],
        stats: {
            enrollmentCount: 65,
            rating: {
                average: 4.4,
                count: 38
            },
            materialCount: 10
        },
        imageUrl: '/comp.jpg'
    },
    {
        _id: '8',
        code: 'ADIE001',
        name: 'Advanced Investigations & Enforcement',
        description: 'Advanced training in investigative techniques, evidence collection, surveillance, and enforcement procedures for law enforcement professionals.',
        credits: 5,
        level: '3',
        difficulty: 'advanced',
        delivery: ['in-person'],
        language: 'english',
        school: {
            name: 'Seneca Polytechnic',
            shortName: 'Seneca'
        },
        programs: [{
            program: {
                name: 'Law, Administration & Public Safety',
                code: 'LAPS'
            },
            semester: 1
        }],
        professors: [{
            name: 'Prof. James Wilson',
            rating: 4.5
        }],
        stats: {
            enrollmentCount: 35,
            rating: {
                average: 4.5,
                count: 22
            },
            materialCount: 16
        },
        imageUrl: '/marketing.jpg'
    },
    {
        _id: '9',
        code: 'ANIM002',
        name: 'Animation',
        description: 'Comprehensive animation program covering traditional and digital animation techniques, storyboarding, and multimedia production.',
        credits: 6,
        level: '2',
        difficulty: 'intermediate',
        delivery: ['in-person', 'hybrid'],
        language: 'english',
        school: {
            name: 'Seneca Polytechnic',
            shortName: 'Seneca'
        },
        programs: [{
            program: {
                name: 'Creative Arts, Animation & Design',
                code: 'CAAD'
            },
            semester: 1
        }],
        professors: [{
            name: 'Prof. Alex Turner',
            rating: 4.3
        }],
        stats: {
            enrollmentCount: 110,
            rating: {
                average: 4.2,
                count: 67
            },
            materialCount: 19
        },
        imageUrl: '/comp.jpg'
    },
    {
        _id: '10',
        code: 'ARTD001',
        name: 'Art & Design Foundations',
        description: 'Foundation program in visual arts covering drawing, color theory, design principles, and artistic techniques across various media.',
        credits: 4,
        level: '1',
        difficulty: 'beginner',
        delivery: ['in-person'],
        language: 'english',
        school: {
            name: 'Seneca Polytechnic',
            shortName: 'Seneca'
        },
        programs: [{
            program: {
                name: 'Creative Arts, Animation & Design',
                code: 'CAAD'
            },
            semester: 1
        }],
        professors: [{
            name: 'Prof. Emma Davis',
            rating: 4.1
        }],
        stats: {
            enrollmentCount: 135,
            rating: {
                average: 4.0,
                count: 78
            },
            materialCount: 12
        },
        imageUrl: '/comp.jpg'
    },
    {
        _id: '11',
        code: 'ARTI001',
        name: 'Artificial Intelligence',
        description: 'Advanced program in AI technologies, machine learning algorithms, neural networks, and AI application development.',
        credits: 6,
        level: '3',
        difficulty: 'advanced',
        delivery: ['in-person', 'online'],
        language: 'english',
        school: {
            name: 'Seneca Polytechnic',
            shortName: 'Seneca'
        },
        programs: [{
            program: {
                name: 'Information Technology',
                code: 'IT'
            },
            semester: 1
        }],
        professors: [{
            name: 'Prof. Dr. Sarah Johnson',
            rating: 4.7
        }],
        stats: {
            enrollmentCount: 75,
            rating: {
                average: 4.6,
                count: 45
            },
            materialCount: 22
        },
        imageUrl: '/comp.jpg'
    },
    {
        _id: '12',
        code: 'ARSC001',
        name: 'Arts and Science – University Transfer',
        description: 'University transfer program providing foundational courses in arts and sciences for students planning to transfer to degree programs.',
        credits: 3,
        level: '1',
        difficulty: 'beginner',
        delivery: ['in-person', 'online'],
        language: 'english',
        school: {
            name: 'Seneca Polytechnic',
            shortName: 'Seneca'
        },
        programs: [{
            program: {
                name: 'Liberal Arts & University Transfers',
                code: 'LAUT'
            },
            semester: 1
        }],
        professors: [{
            name: 'Prof. Jennifer Brown',
            rating: 3.9
        }],
        stats: {
            enrollmentCount: 200,
            rating: {
                average: 3.8,
                count: 112
            },
            materialCount: 10
        },
        imageUrl: '/transfer.jpg'
    },
    {
        _id: '13',
        code: 'ASTM001',
        name: 'Asset Management',
        description: 'Program covering investment strategies, portfolio management, risk assessment, and financial planning for asset management professionals.',
        credits: 5,
        level: '2',
        difficulty: 'intermediate',
        delivery: ['in-person', 'hybrid'],
        language: 'english',
        school: {
            name: 'Seneca Polytechnic',
            shortName: 'Seneca'
        },
        programs: [{
            program: {
                name: 'Business',
                code: 'BUS'
            },
            semester: 1
        }],
        professors: [{
            name: 'Prof. Mark Johnson',
            rating: 4.2
        }],
        stats: {
            enrollmentCount: 68,
            rating: {
                average: 4.1,
                count: 35
            },
            materialCount: 17
        },
        imageUrl: '/asset.jpg'
    },
    {
        _id: '14',
        code: 'AVOP001',
        name: 'Aviation Operations',
        description: 'Comprehensive program in aviation operations, airport management, flight coordination, and aviation safety protocols.',
        credits: 6,
        level: '2',
        difficulty: 'intermediate',
        delivery: ['in-person'],
        language: 'english',
        school: {
            name: 'Seneca Polytechnic',
            shortName: 'Seneca'
        },
        programs: [{
            program: {
                name: 'Aviation',
                code: 'AVIA'
            },
            semester: 1
        }],
        professors: [{
            name: 'Prof. Captain John Smith',
            rating: 4.4
        }],
        stats: {
            enrollmentCount: 55,
            rating: {
                average: 4.3,
                count: 32
            },
            materialCount: 20
        },
        imageUrl: '/aviation.jpg'
    },
    {
        _id: '15',
        code: 'AVSA001',
        name: 'Aviation Safety',
        description: 'Specialized program focusing on aviation safety management systems, risk assessment, and accident investigation procedures.',
        credits: 5,
        level: '2',
        difficulty: 'intermediate',
        delivery: ['in-person'],
        language: 'english',
        school: {
            name: 'Seneca Polytechnic',
            shortName: 'Seneca'
        },
        programs: [{
            program: {
                name: 'Aviation',
                code: 'AVIA'
            },
            semester: 1
        }],
        professors: [{
            name: 'Prof. Sarah Mitchell',
            rating: 4.6
        }],
        stats: {
            enrollmentCount: 42,
            rating: {
                average: 4.5,
                count: 28
            },
            materialCount: 18
        },
        imageUrl: '/safety.jpg'
    },
    {
        _id: '16',
        code: 'BBA001',
        name: 'Bachelor of Business Administration',
        description: 'Comprehensive undergraduate business degree covering management, marketing, finance, operations, and strategic planning.',
        credits: 8,
        level: '4',
        difficulty: 'advanced',
        delivery: ['in-person', 'hybrid'],
        language: 'english',
        school: {
            name: 'Seneca Polytechnic',
            shortName: 'Seneca'
        },
        programs: [{
            program: {
                name: 'Business',
                code: 'BUS'
            },
            semester: 1
        }],
        professors: [{
            name: 'Prof. Dr. Patricia Lee',
            rating: 4.5
        }],
        stats: {
            enrollmentCount: 320,
            rating: {
                average: 4.3,
                count: 185
            },
            materialCount: 30
        },
        imageUrl: '/bba.jpg'
    },
    {
        _id: '17',
        code: 'BCS001',
        name: 'Bachelor of Computer Science',
        description: 'Comprehensive computer science degree covering programming, algorithms, software engineering, and computer systems.',
        credits: 8,
        level: '4',
        difficulty: 'advanced',
        delivery: ['in-person', 'hybrid'],
        language: 'english',
        school: {
            name: 'Seneca Polytechnic',
            shortName: 'Seneca'
        },
        programs: [{
            program: {
                name: 'Information Technology',
                code: 'IT'
            },
            semester: 1
        }],
        professors: [{
            name: 'Prof. Dr. Michael Wang',
            rating: 4.6
        }],
        stats: {
            enrollmentCount: 280,
            rating: {
                average: 4.4,
                count: 165
            },
            materialCount: 35
        },
        imageUrl: '/cs.jpg'
    },
    {
        _id: '18',
        code: 'BSE001',
        name: 'Bachelor of Engineering (Software Engineering)',
        description: 'Professional engineering degree focusing on software development, system design, and engineering principles for software solutions.',
        credits: 8,
        level: '4',
        difficulty: 'advanced',
        delivery: ['in-person'],
        language: 'english',
        school: {
            name: 'Seneca Polytechnic',
            shortName: 'Seneca'
        },
        programs: [{
            program: {
                name: 'Engineering Technology',
                code: 'ENGR'
            },
            semester: 1
        }],
        professors: [{
            name: 'Prof. Dr. Ahmed Hassan',
            rating: 4.7
        }],
        stats: {
            enrollmentCount: 195,
            rating: {
                average: 4.5,
                count: 118
            },
            materialCount: 40
        },
        imageUrl: '/software.jpg'
    },
    {
        _id: '19',
        code: 'BSCS001',
        name: 'Bachelor of Science – Cosmetic Science',
        description: 'Specialized science degree focusing on cosmetic chemistry, product development, and safety testing in the beauty industry.',
        credits: 8,
        level: '4',
        difficulty: 'advanced',
        delivery: ['in-person', 'hybrid'],
        language: 'english',
        school: {
            name: 'Seneca Polytechnic',
            shortName: 'Seneca'
        },
        programs: [{
            program: {
                name: 'Science',
                code: 'SCI'
            },
            semester: 1
        }],
        professors: [{
            name: 'Prof. Dr. Lisa Park',
            rating: 4.3
        }],
        stats: {
            enrollmentCount: 85,
            rating: {
                average: 4.2,
                count: 48
            },
            materialCount: 28
        },
        imageUrl: '/cosmetic.jpg'
    },
    {
        _id: '20',
        code: 'BEHV001',
        name: 'Behavioural Sciences',
        description: 'Interdisciplinary program studying human behavior, psychology, sociology, and research methods in behavioral analysis.',
        credits: 6,
        level: '2',
        difficulty: 'intermediate',
        delivery: ['in-person', 'online'],
        language: 'english',
        school: {
            name: 'Seneca Polytechnic',
            shortName: 'Seneca'
        },
        programs: [{
            program: {
                name: 'Education, Community & Social Services',
                code: 'ECSS'
            },
            semester: 1
        }],
        professors: [{
            name: 'Prof. Dr. Rachel Green',
            rating: 4.1
        }],
        stats: {
            enrollmentCount: 125,
            rating: {
                average: 4.0,
                count: 72
            },
            materialCount: 22
        },
        imageUrl: '/behavior.jpg'
    },
    {
        _id: '21',
        code: 'BIOT001',
        name: 'Biotechnology – Advanced',
        description: 'Advanced biotechnology program covering genetic engineering, molecular biology, bioinformatics, and biotechnological applications.',
        credits: 6,
        level: '3',
        difficulty: 'advanced',
        delivery: ['in-person'],
        language: 'english',
        school: {
            name: 'Seneca Polytechnic',
            shortName: 'Seneca'
        },
        programs: [{
            program: {
                name: 'Science',
                code: 'SCI'
            },
            semester: 1
        }],
        professors: [{
            name: 'Prof. Dr. Thomas Anderson',
            rating: 4.4
        }],
        stats: {
            enrollmentCount: 65,
            rating: {
                average: 4.3,
                count: 38
            },
            materialCount: 30
        },
        imageUrl: '/biotech.jpg'
    },
    {
        _id: '22',
        code: 'BRND001',
        name: 'Brand Management',
        description: 'Strategic brand management program covering brand development, positioning, marketing communications, and brand equity measurement.',
        credits: 5,
        level: '2',
        difficulty: 'intermediate',
        delivery: ['in-person', 'hybrid'],
        language: 'english',
        school: {
            name: 'Seneca Polytechnic',
            shortName: 'Seneca'
        },
        programs: [{
            program: {
                name: 'Business',
                code: 'BUS'
            },
            semester: 1
        }],
        professors: [{
            name: 'Prof. Amanda White',
            rating: 4.2
        }],
        stats: {
            enrollmentCount: 95,
            rating: {
                average: 4.1,
                count: 55
            },
            materialCount: 16
        },
        imageUrl: '/brand.jpg'
    },
    {
        _id: '23',
        code: 'BROD001',
        name: 'Broadcasting – Radio',
        description: 'Radio broadcasting program covering audio production, on-air performance, programming, and radio station operations.',
        credits: 4,
        level: '2',
        difficulty: 'intermediate',
        delivery: ['in-person'],
        language: 'english',
        school: {
            name: 'Seneca Polytechnic',
            shortName: 'Seneca'
        },
        programs: [{
            program: {
                name: 'Media & Communications',
                code: 'MCOM'
            },
            semester: 1
        }],
        professors: [{
            name: 'Prof. Steve Morrison',
            rating: 4.3
        }],
        stats: {
            enrollmentCount: 72,
            rating: {
                average: 4.2,
                count: 42
            },
            materialCount: 14
        },
        imageUrl: '/radio.jpg'
    },
    {
        _id: '24',
        code: 'BRTV001',
        name: 'Broadcasting – Television',
        description: 'Television broadcasting program covering video production, directing, editing, and television station operations.',
        credits: 5,
        level: '2',
        difficulty: 'intermediate',
        delivery: ['in-person'],
        language: 'english',
        school: {
            name: 'Seneca Polytechnic',
            shortName: 'Seneca'
        },
        programs: [{
            program: {
                name: 'Media & Communications',
                code: 'MCOM'
            },
            semester: 1
        }],
        professors: [{
            name: 'Prof. Diana Rodriguez',
            rating: 4.4
        }],
        stats: {
            enrollmentCount: 88,
            rating: {
                average: 4.3,
                count: 52
            },
            materialCount: 18
        },
        imageUrl: '/tv.jpg'
    },
    {
        _id: '25',
        code: 'BSET001',
        name: 'Building Systems Engineering Technician',
        description: 'Technical program focusing on HVAC systems, building automation, energy management, and mechanical systems maintenance.',
        credits: 5,
        level: '2',
        difficulty: 'intermediate',
        delivery: ['in-person'],
        language: 'english',
        school: {
            name: 'Seneca Polytechnic',
            shortName: 'Seneca'
        },
        programs: [{
            program: {
                name: 'Engineering Technology',
                code: 'ENGR'
            },
            semester: 1
        }],
        professors: [{
            name: 'Prof. Robert Chen',
            rating: 4.1
        }],
        stats: {
            enrollmentCount: 105,
            rating: {
                average: 4.0,
                count: 62
            },
            materialCount: 20
        },
        imageUrl: '/building.jpg'
    },
    {
        _id: '26',
        code: 'BUS001',
        name: 'Business',
        description: 'General business program covering fundamental business principles, management, marketing, and entrepreneurship.',
        credits: 4,
        level: '2',
        difficulty: 'intermediate',
        delivery: ['in-person', 'online'],
        language: 'english',
        school: {
            name: 'Seneca Polytechnic',
            shortName: 'Seneca'
        },
        programs: [{
            program: {
                name: 'Business',
                code: 'BUS'
            },
            semester: 1
        }],
        professors: [{
            name: 'Prof. Karen Taylor',
            rating: 4.0
        }],
        stats: {
            enrollmentCount: 250,
            rating: {
                average: 3.9,
                count: 145
            },
            materialCount: 15
        },
        imageUrl: '/business.jpg'
    },
    {
        _id: '27',
        code: 'BAFP001',
        name: 'Business Administration – Financial Planning',
        description: 'Business administration program specializing in financial planning, investment strategies, and personal financial management.',
        credits: 6,
        level: '2',
        difficulty: 'intermediate',
        delivery: ['in-person', 'hybrid'],
        language: 'english',
        school: {
            name: 'Seneca Polytechnic',
            shortName: 'Seneca'
        },
        programs: [{
            program: {
                name: 'Business',
                code: 'BUS'
            },
            semester: 1
        }],
        professors: [{
            name: 'Prof. Michelle Adams',
            rating: 4.2
        }],
        stats: {
            enrollmentCount: 115,
            rating: {
                average: 4.1,
                count: 68
            },
            materialCount: 19
        },
        imageUrl: '/financial.jpg'
    },
    {
        _id: '28',
        code: 'BAHR001',
        name: 'Business Administration – Human Resources',
        description: 'Business administration program focusing on human resource management, organizational behavior, and employee relations.',
        credits: 6,
        level: '2',
        difficulty: 'intermediate',
        delivery: ['in-person', 'online'],
        language: 'english',
        school: {
            name: 'Seneca Polytechnic',
            shortName: 'Seneca'
        },
        programs: [{
            program: {
                name: 'Business',
                code: 'BUS'
            },
            semester: 1
        }],
        professors: [{
            name: 'Prof. Daniel Wilson',
            rating: 4.3
        }],
        stats: {
            enrollmentCount: 135,
            rating: {
                average: 4.2,
                count: 78
            },
            materialCount: 17
        },
        imageUrl: '/hr.jpg'
    },
    {
        _id: '29',
        code: 'BAIB001',
        name: 'Business Administration – International Business',
        description: 'Business administration program specializing in international trade, global markets, and cross-cultural business practices.',
        credits: 6,
        level: '2',
        difficulty: 'intermediate',
        delivery: ['in-person', 'hybrid'],
        language: 'english',
        school: {
            name: 'Seneca Polytechnic',
            shortName: 'Seneca'
        },
        programs: [{
            program: {
                name: 'Business',
                code: 'BUS'
            },
            semester: 1
        }],
        professors: [{
            name: 'Prof. Maria Gonzalez',
            rating: 4.4
        }],
        stats: {
            enrollmentCount: 125,
            rating: {
                average: 4.3,
                count: 72
            },
            materialCount: 21
        },
        imageUrl: '/international.jpg'
    },
    {
        _id: '30',
        code: 'BAMG001',
        name: 'Business Administration – Management',
        description: 'Business administration program focusing on management principles, leadership, organizational strategy, and operations management.',
        credits: 6,
        level: '2',
        difficulty: 'intermediate',
        delivery: ['in-person', 'online'],
        language: 'english',
        school: {
            name: 'Seneca Polytechnic',
            shortName: 'Seneca'
        },
        programs: [{
            program: {
                name: 'Business',
                code: 'BUS'
            },
            semester: 1
        }],
        professors: [{
            name: 'Prof. James Peterson',
            rating: 4.1
        }],
        stats: {
            enrollmentCount: 165,
            rating: {
                average: 4.0,
                count: 95
            },
            materialCount: 18
        },
        imageUrl: '/management.jpg'
    },
    {
        _id: '31',
        code: 'BAMK001',
        name: 'Business Administration – Marketing',
        description: 'Business administration program specializing in marketing strategy, consumer behavior, digital marketing, and brand management.',
        credits: 6,
        level: '2',
        difficulty: 'intermediate',
        delivery: ['in-person', 'hybrid'],
        language: 'english',
        school: {
            name: 'Seneca Polytechnic',
            shortName: 'Seneca'
        },
        programs: [{
            program: {
                name: 'Business',
                code: 'BUS'
            },
            semester: 1
        }],
        professors: [{
            name: 'Prof. Sarah Kim',
            rating: 4.3
        }],
        stats: {
            enrollmentCount: 185,
            rating: {
                average: 4.2,
                count: 108
            },
            materialCount: 20
        },
        imageUrl: '/marketing.jpg'
    },
    {
        _id: '32',
        code: 'BAPS001',
        name: 'Business Administration – Purchasing & Supply Management',
        description: 'Business administration program focusing on procurement, supply chain management, vendor relations, and logistics coordination.',
        credits: 6,
        level: '2',
        difficulty: 'intermediate',
        delivery: ['in-person', 'hybrid'],
        language: 'english',
        school: {
            name: 'Seneca Polytechnic',
            shortName: 'Seneca'
        },
        programs: [{
            program: {
                name: 'Business',
                code: 'BUS'
            },
            semester: 1
        }],
        professors: [{
            name: 'Prof. Kevin Liu',
            rating: 4.2
        }],
        stats: {
            enrollmentCount: 98,
            rating: {
                average: 4.1,
                count: 56
            },
            materialCount: 16
        },
        imageUrl: '/supply.jpg'
    },
    {
        _id: '33',
        code: 'BANA001',
        name: 'Business Analytics',
        description: 'Program combining business knowledge with data analytics, statistical analysis, and business intelligence tools.',
        credits: 6,
        level: '2',
        difficulty: 'intermediate',
        delivery: ['in-person', 'online'],
        language: 'english',
        school: {
            name: 'Seneca Polytechnic',
            shortName: 'Seneca'
        },
        programs: [{
            program: {
                name: 'Business',
                code: 'BUS'
            },
            semester: 1
        }],
        professors: [{
            name: 'Prof. Dr. Angela Chen',
            rating: 4.5
        }],
        stats: {
            enrollmentCount: 145,
            rating: {
                average: 4.4,
                count: 85
            },
            materialCount: 24
        },
        imageUrl: '/analytics.jpg'
    },
    {
        _id: '34',
        code: 'BIT001',
        name: 'Business Information Technology',
        description: 'Integration of business processes with information technology, covering systems analysis, database management, and IT strategy.',
        credits: 6,
        level: '2',
        difficulty: 'intermediate',
        delivery: ['in-person', 'hybrid'],
        language: 'english',
        school: {
            name: 'Seneca Polytechnic',
            shortName: 'Seneca'
        },
        programs: [{
            program: {
                name: 'Information Technology',
                code: 'IT'
            },
            semester: 1
        }],
        professors: [{
            name: 'Prof. Richard Park',
            rating: 4.3
        }],
        stats: {
            enrollmentCount: 155,
            rating: {
                average: 4.2,
                count: 89
            },
            materialCount: 22
        },
        imageUrl: '/bit.jpg'
    },
    {
        _id: '35',
        code: 'BMGT001',
        name: 'Business Management',
        description: 'Comprehensive business management program covering leadership, strategic planning, operations, and organizational development.',
        credits: 5,
        level: '2',
        difficulty: 'intermediate',
        delivery: ['in-person', 'online'],
        language: 'english',
        school: {
            name: 'Seneca Polytechnic',
            shortName: 'Seneca'
        },
        programs: [{
            program: {
                name: 'Business',
                code: 'BUS'
            },
            semester: 1
        }],
        professors: [{
            name: 'Prof. Carol Thompson',
            rating: 4.1
        }],
        stats: {
            enrollmentCount: 175,
            rating: {
                average: 4.0,
                count: 102
            },
            materialCount: 18
        },
        imageUrl: '/bmgt.jpg'
    },
    {
        _id: '36',
        code: 'BMEI001',
        name: 'Business Management – Entrepreneurship & Innovation',
        description: 'Business management program focusing on entrepreneurial skills, innovation strategies, startup development, and venture management.',
        credits: 5,
        level: '2',
        difficulty: 'intermediate',
        delivery: ['in-person', 'hybrid'],
        language: 'english',
        school: {
            name: 'Seneca Polytechnic',
            shortName: 'Seneca'
        },
        programs: [{
            program: {
                name: 'Business',
                code: 'BUS'
            },
            semester: 1
        }],
        professors: [{
            name: 'Prof. Tony Martinez',
            rating: 4.4
        }],
        stats: {
            enrollmentCount: 88,
            rating: {
                average: 4.3,
                count: 51
            },
            materialCount: 19
        },
        imageUrl: '/entrepreneur.jpg'
    },
    {
        _id: '37',
        code: 'BINS001',
        name: 'Business – Insurance',
        description: 'Specialized business program focusing on insurance principles, risk management, underwriting, and claims processing.',
        credits: 5,
        level: '2',
        difficulty: 'intermediate',
        delivery: ['in-person', 'online'],
        language: 'english',
        school: {
            name: 'Seneca Polytechnic',
            shortName: 'Seneca'
        },
        programs: [{
            program: {
                name: 'Business',
                code: 'BUS'
            },
            semester: 1
        }],
        professors: [{
            name: 'Prof. Linda Johnson',
            rating: 4.0
        }],
        stats: {
            enrollmentCount: 75,
            rating: {
                average: 3.9,
                count: 43
            },
            materialCount: 15
        },
        imageUrl: '/insurance.jpg'
    },
    {
        _id: '38',
        code: 'BIB001',
        name: 'Business – International Business',
        description: 'Business program specializing in global trade, international economics, cross-cultural management, and export-import operations.',
        credits: 5,
        level: '2',
        difficulty: 'intermediate',
        delivery: ['in-person', 'hybrid'],
        language: 'english',
        school: {
            name: 'Seneca Polytechnic',
            shortName: 'Seneca'
        },
        programs: [{
            program: {
                name: 'Business',
                code: 'BUS'
            },
            semester: 1
        }],
        professors: [{
            name: 'Prof. Elena Petrov',
            rating: 4.3
        }],
        stats: {
            enrollmentCount: 112,
            rating: {
                average: 4.2,
                count: 65
            },
            materialCount: 20
        },
        imageUrl: '/intlbusiness.jpg'
    },
    {
        _id: '39',
        code: 'BMKT001',
        name: 'Business – Marketing',
        description: 'Business program with marketing specialization covering market research, advertising, sales management, and digital marketing strategies.',
        credits: 5,
        level: '2',
        difficulty: 'intermediate',
        delivery: ['in-person', 'online'],
        language: 'english',
        school: {
            name: 'Seneca Polytechnic',
            shortName: 'Seneca'
        },
        programs: [{
            program: {
                name: 'Business',
                code: 'BUS'
            },
            semester: 1
        }],
        professors: [{
            name: 'Prof. Michael Davis',
            rating: 4.2
        }],
        stats: {
            enrollmentCount: 165,
            rating: {
                average: 4.1,
                count: 96
            },
            materialCount: 18
        },
        imageUrl: '/busmarketing.jpg'
    },
    {
        _id: '40',
        code: 'BSCO001',
        name: 'Business – Supply Chain & Operations',
        description: 'Business program focusing on supply chain management, operations optimization, logistics, and inventory management.',
        credits: 5,
        level: '2',
        difficulty: 'intermediate',
        delivery: ['in-person', 'hybrid'],
        language: 'english',
        school: {
            name: 'Seneca Polytechnic',
            shortName: 'Seneca'
        },
        programs: [{
            program: {
                name: 'Business',
                code: 'BUS'
            },
            semester: 1
        }],
        professors: [{
            name: 'Prof. Robert Singh',
            rating: 4.1
        }],
        stats: {
            enrollmentCount: 92,
            rating: {
                average: 4.0,
                count: 54
            },
            materialCount: 17
        },
        imageUrl: '/operations.jpg'
    },
    {
        _id: '41',
        code: 'CANB001',
        name: 'Cannabis Regulation & Quality Assurance',
        description: 'Specialized program covering cannabis industry regulations, quality control, testing procedures, and compliance management.',
        credits: 4,
        level: '2',
        difficulty: 'intermediate',
        delivery: ['in-person'],
        language: 'english',
        school: {
            name: 'Seneca Polytechnic',
            shortName: 'Seneca'
        },
        programs: [{
            program: {
                name: 'Science',
                code: 'SCI'
            },
            semester: 1
        }],
        professors: [{
            name: 'Prof. Dr. Jennifer Walsh',
            rating: 4.2
        }],
        stats: {
            enrollmentCount: 58,
            rating: {
                average: 4.1,
                count: 32
            },
            materialCount: 14
        },
        imageUrl: '/cannabis.jpg'
    },
    {
        _id: '42',
        code: 'CHET001',
        name: 'Chemical Engineering Technology',
        description: 'Technical program in chemical processes, plant operations, process control, and chemical manufacturing systems.',
        credits: 6,
        level: '2',
        difficulty: 'intermediate',
        delivery: ['in-person'],
        language: 'english',
        school: {
            name: 'Seneca Polytechnic',
            shortName: 'Seneca'
        },
        programs: [{
            program: {
                name: 'Engineering Technology',
                code: 'ENGR'
            },
            semester: 1
        }],
        professors: [{
            name: 'Prof. Dr. Hassan Ali',
            rating: 4.3
        }],
        stats: {
            enrollmentCount: 78,
            rating: {
                average: 4.2,
                count: 45
            },
            materialCount: 25
        },
        imageUrl: '/chemical.jpg'
    },
    {
        _id: '43',
        code: 'CLT001',
        name: 'Chemical Laboratory Technician',
        description: 'Technical program training students in laboratory procedures, chemical analysis, instrumentation, and quality control testing.',
        credits: 4,
        level: '2',
        difficulty: 'intermediate',
        delivery: ['in-person'],
        language: 'english',
        school: {
            name: 'Seneca Polytechnic',
            shortName: 'Seneca'
        },
        programs: [{
            program: {
                name: 'Science',
                code: 'SCI'
            },
            semester: 1
        }],
        professors: [{
            name: 'Prof. Maria Rodriguez',
            rating: 4.1
        }],
        stats: {
            enrollmentCount: 65,
            rating: {
                average: 4.0,
                count: 38
            },
            materialCount: 18
        },
        imageUrl: '/lab.jpg'
    },
    {
        _id: '44',
        code: 'CLTP001',
        name: 'Chemical Laboratory Technology – Pharmaceutical',
        description: 'Specialized laboratory technology program focusing on pharmaceutical testing, drug analysis, and pharmaceutical quality control.',
        credits: 5,
        level: '2',
        difficulty: 'intermediate',
        delivery: ['in-person'],
        language: 'english',
        school: {
            name: 'Seneca Polytechnic',
            shortName: 'Seneca'
        },
        programs: [{
            program: {
                name: 'Science',
                code: 'SCI'
            },
            semester: 1
        }],
        professors: [{
            name: 'Prof. Dr. Susan Lee',
            rating: 4.4
        }],
        stats: {
            enrollmentCount: 72,
            rating: {
                average: 4.3,
                count: 41
            },
            materialCount: 22
        },
        imageUrl: '/pharma.jpg'
    },
    {
        _id: '45',
        code: 'CYC001',
        name: 'Child & Youth Care',
        description: 'Program preparing students to work with children and youth in various settings, covering child development and intervention strategies.',
        credits: 6,
        level: '2',
        difficulty: 'intermediate',
        delivery: ['in-person', 'hybrid'],
        language: 'english',
        school: {
            name: 'Seneca Polytechnic',
            shortName: 'Seneca'
        },
        programs: [{
            program: {
                name: 'Education, Community & Social Services',
                code: 'ECSS'
            },
            semester: 1
        }],
        professors: [{
            name: 'Prof. Karen Mitchell',
            rating: 4.5
        }],
        stats: {
            enrollmentCount: 145,
            rating: {
                average: 4.4,
                count: 83
            },
            materialCount: 20
        },
        imageUrl: '/childcare.jpg'
    },
    {
        _id: '46',
        code: 'CDP001',
        name: 'Child Development Practitioner',
        description: 'Specialized program focusing on early childhood development, assessment techniques, and intervention strategies for young children.',
        credits: 5,
        level: '2',
        difficulty: 'intermediate',
        delivery: ['in-person'],
        language: 'english',
        school: {
            name: 'Seneca Polytechnic',
            shortName: 'Seneca'
        },
        programs: [{
            program: {
                name: 'Education, Community & Social Services',
                code: 'ECSS'
            },
            semester: 1
        }],
        professors: [{
            name: 'Prof. Lisa Thompson',
            rating: 4.3
        }],
        stats: {
            enrollmentCount: 85,
            rating: {
                average: 4.2,
                count: 49
            },
            materialCount: 16
        },
        imageUrl: '/development.jpg'
    },
    {
        _id: '47',
        code: 'CET001',
        name: 'Civil Engineering Technician',
        description: 'Technical program in civil engineering supporting construction, surveying, materials testing, and infrastructure projects.',
        credits: 5,
        level: '2',
        difficulty: 'intermediate',
        delivery: ['in-person'],
        language: 'english',
        school: {
            name: 'Seneca Polytechnic',
            shortName: 'Seneca'
        },
        programs: [{
            program: {
                name: 'Engineering Technology',
                code: 'ENGR'
            },
            semester: 1
        }],
        professors: [{
            name: 'Prof. Andrew Wilson',
            rating: 4.2
        }],
        stats: {
            enrollmentCount: 125,
            rating: {
                average: 4.1,
                count: 72
            },
            materialCount: 24
        },
        imageUrl: '/civil.jpg'
    },
    {
        _id: '48',
        code: 'CIVT001',
        name: 'Civil Engineering Technology',
        description: 'Advanced civil engineering technology program covering structural design, transportation systems, and environmental engineering.',
        credits: 6,
        level: '3',
        difficulty: 'advanced',
        delivery: ['in-person'],
        language: 'english',
        school: {
            name: 'Seneca Polytechnic',
            shortName: 'Seneca'
        },
        programs: [{
            program: {
                name: 'Engineering Technology',
                code: 'ENGR'
            },
            semester: 1
        }],
        professors: [{
            name: 'Prof. Dr. Robert Zhang',
            rating: 4.4
        }],
        stats: {
            enrollmentCount: 95,
            rating: {
                average: 4.3,
                count: 55
            },
            materialCount: 28
        },
        imageUrl: '/civiltech.jpg'
    },
    {
        _id: '49',
        code: 'CLRE001',
        name: 'Clinical Research',
        description: 'Program covering clinical trial design, regulatory compliance, data management, and ethical considerations in medical research.',
        credits: 5,
        level: '2',
        difficulty: 'intermediate',
        delivery: ['in-person', 'online'],
        language: 'english',
        school: {
            name: 'Seneca Polytechnic',
            shortName: 'Seneca'
        },
        programs: [{
            program: {
                name: 'Health & Wellness',
                code: 'HW'
            },
            semester: 1
        }],
        professors: [{
            name: 'Prof. Dr. Patricia Kim',
            rating: 4.5
        }],
        stats: {
            enrollmentCount: 68,
            rating: {
                average: 4.4,
                count: 39
            },
            materialCount: 21
        },
        imageUrl: '/clinical.jpg'
    },
    {
        _id: '50',
        code: 'CLAD001',
        name: 'Cloud Architecture & Administration',
        description: 'Advanced program in cloud computing architecture, infrastructure management, security, and cloud service administration.',
        credits: 6,
        level: '3',
        difficulty: 'advanced',
        delivery: ['in-person', 'online'],
        language: 'english',
        school: {
            name: 'Seneca Polytechnic',
            shortName: 'Seneca'
        },
        programs: [{
            program: {
                name: 'Information Technology',
                code: 'IT'
            },
            semester: 1
        }],
        professors: [{
            name: 'Prof. Dr. Jason Park',
            rating: 4.6
        }],
        stats: {
            enrollmentCount: 115,
            rating: {
                average: 4.5,
                count: 67
            },
            materialCount: 30
        },
        imageUrl: '/cloud.jpg'
    },
    {
        _id: '51',
        code: 'COET001',
        name: 'Computer Engineering Technology',
        description: 'Technology program combining computer hardware and software, covering embedded systems, networking, and digital systems.',
        credits: 6,
        level: '2',
        difficulty: 'intermediate',
        delivery: ['in-person'],
        language: 'english',
        school: {
            name: 'Seneca Polytechnic',
            shortName: 'Seneca'
        },
        programs: [{
            program: {
                name: 'Information Technology',
                code: 'IT'
            },
            semester: 1
        }],
        professors: [{
            name: 'Prof. Mark Anderson',
            rating: 4.3
        }],
        stats: {
            enrollmentCount: 155,
            rating: {
                average: 4.2,
                count: 89
            },
            materialCount: 26
        },
        imageUrl: '/computer.jpg'
    },
    {
        _id: '52',
        code: 'PROG001',
        name: 'Computer Programming',
        description: 'Fundamental programming program covering multiple programming languages, software development, and application design.',
        credits: 5,
        level: '2',
        difficulty: 'intermediate',
        delivery: ['in-person', 'online'],
        language: 'english',
        school: {
            name: 'Seneca Polytechnic',
            shortName: 'Seneca'
        },
        programs: [{
            program: {
                name: 'Information Technology',
                code: 'IT'
            },
            semester: 1
        }],
        professors: [{
            name: 'Prof. Daniel Chen',
            rating: 4.4
        }],
        stats: {
            enrollmentCount: 195,
            rating: {
                average: 4.3,
                count: 112
            },
            materialCount: 22
        },
        imageUrl: '/programming.jpg'
    },
    {
        _id: '53',
        code: 'CPA001',
        name: 'Computer Programming & Analysis',
        description: 'Advanced programming program combining coding skills with systems analysis, database design, and software engineering principles.',
        credits: 6,
        level: '3',
        difficulty: 'advanced',
        delivery: ['in-person', 'hybrid'],
        language: 'english',
        school: {
            name: 'Seneca Polytechnic',
            shortName: 'Seneca'
        },
        programs: [{
            program: {
                name: 'Information Technology',
                code: 'IT'
            },
            semester: 1
        }],
        professors: [{
            name: 'Prof. Dr. Michelle Wang',
            rating: 4.5
        }],
        stats: {
            enrollmentCount: 165,
            rating: {
                average: 4.4,
                count: 95
            },
            materialCount: 28
        },
        imageUrl: '/analysis.jpg'
    },
    {
        _id: '54',
        code: 'CST001',
        name: 'Computer Systems Technician',
        description: 'Technical program focusing on computer hardware, networking, system maintenance, and technical support services.',
        credits: 4,
        level: '2',
        difficulty: 'intermediate',
        delivery: ['in-person'],
        language: 'english',
        school: {
            name: 'Seneca Polytechnic',
            shortName: 'Seneca'
        },
        programs: [{
            program: {
                name: 'Information Technology',
                code: 'IT'
            },
            semester: 1
        }],
        professors: [{
            name: 'Prof. Steve Johnson',
            rating: 4.1
        }],
        stats: {
            enrollmentCount: 145,
            rating: {
                average: 4.0,
                count: 83
            },
            materialCount: 20
        },
        imageUrl: '/systems.jpg'
    },
    {
        _id: '55',
        code: 'CSYT001',
        name: 'Computer Systems Technology',
        description: 'Advanced computer systems program covering network administration, server management, and enterprise IT infrastructure.',
        credits: 6,
        level: '3',
        difficulty: 'advanced',
        delivery: ['in-person', 'hybrid'],
        language: 'english',
        school: {
            name: 'Seneca Polytechnic',
            shortName: 'Seneca'
        },
        programs: [{
            program: {
                name: 'Information Technology',
                code: 'IT'
            },
            semester: 1
        }],
        professors: [{
            name: 'Prof. Dr. Kevin Liu',
            rating: 4.4
        }],
        stats: {
            enrollmentCount: 125,
            rating: {
                average: 4.3,
                count: 72
            },
            materialCount: 25
        },
        imageUrl: '/systemstech.jpg'
    },
    {
        _id: '56',
        code: 'COSM001',
        name: 'Cosmetic Science',
        description: 'Scientific program covering cosmetic chemistry, product formulation, safety testing, and regulatory compliance in beauty industry.',
        credits: 5,
        level: '2',
        difficulty: 'intermediate',
        delivery: ['in-person'],
        language: 'english',
        school: {
            name: 'Seneca Polytechnic',
            shortName: 'Seneca'
        },
        programs: [{
            program: {
                name: 'Science',
                code: 'SCI'
            },
            semester: 1
        }],
        professors: [{
            name: 'Prof. Dr. Angela Martinez',
            rating: 4.2
        }],
        stats: {
            enrollmentCount: 78,
            rating: {
                average: 4.1,
                count: 45
            },
            materialCount: 19
        },
        imageUrl: '/cosmetic.jpg'
    },
    {
        _id: '57',
        code: 'CTM001',
        name: 'Cosmetic Techniques & Management',
        description: 'Program combining cosmetic application techniques with business management skills for beauty industry professionals.',
        credits: 4,
        level: '2',
        difficulty: 'intermediate',
        delivery: ['in-person'],
        language: 'english',
        school: {
            name: 'Seneca Polytechnic',
            shortName: 'Seneca'
        },
        programs: [{
            program: {
                name: 'Fashion & Esthetics',
                code: 'FE'
            },
            semester: 1
        }],
        professors: [{
            name: 'Prof. Isabella Garcia',
            rating: 4.3
        }],
        stats: {
            enrollmentCount: 65,
            rating: {
                average: 4.2,
                count: 37
            },
            materialCount: 15
        },
        imageUrl: '/techniques.jpg'
    },
    {
        _id: '58',
        code: 'CRAD001',
        name: 'Creative Advertising',
        description: 'Creative program focusing on advertising design, campaign development, copywriting, and multimedia advertising production.',
        credits: 5,
        level: '2',
        difficulty: 'intermediate',
        delivery: ['in-person', 'hybrid'],
        language: 'english',
        school: {
            name: 'Seneca Polytechnic',
            shortName: 'Seneca'
        },
        programs: [{
            program: {
                name: 'Creative Arts, Animation & Design',
                code: 'CAAD'
            },
            semester: 1
        }],
        professors: [{
            name: 'Prof. Ryan O\'Connor',
            rating: 4.4
        }],
        stats: {
            enrollmentCount: 92,
            rating: {
                average: 4.3,
                count: 53
            },
            materialCount: 17
        },
        imageUrl: '/advertising.jpg'
    },
    {
        _id: '59',
        code: 'CYTM001',
        name: 'Cybersecurity & Threat Management',
        description: 'Advanced cybersecurity program covering threat analysis, incident response, security architecture, and risk management.',
        credits: 6,
        level: '3',
        difficulty: 'advanced',
        delivery: ['in-person', 'online'],
        language: 'english',
        school: {
            name: 'Seneca Polytechnic',
            shortName: 'Seneca'
        },
        programs: [{
            program: {
                name: 'Information Technology',
                code: 'IT'
            },
            semester: 1
        }],
        professors: [{
            name: 'Prof. Dr. Sarah Kim',
            rating: 4.6
        }],
        stats: {
            enrollmentCount: 135,
            rating: {
                average: 4.5,
                count: 78
            },
            materialCount: 32
        },
        imageUrl: '/cybersecurity.jpg'
    },
    {
        _id: '60',
        code: 'DAD001',
        name: 'Database Application Developer',
        description: 'Specialized program in database design, SQL programming, database administration, and application development with databases.',
        credits: 5,
        level: '2',
        difficulty: 'intermediate',
        delivery: ['in-person', 'online'],
        language: 'english',
        school: {
            name: 'Seneca Polytechnic',
            shortName: 'Seneca'
        },
        programs: [{
            program: {
                name: 'Information Technology',
                code: 'IT'
            },
            semester: 1
        }],
        professors: [{
            name: 'Prof. Thomas Lee',
            rating: 4.3
        }],
        stats: {
            enrollmentCount: 105,
            rating: {
                average: 4.2,
                count: 61
            },
            materialCount: 23
        },
        imageUrl: '/database.jpg'
    },
    {
        _id: '61',
        code: 'DSMM001',
        name: 'Digital & Social Media Marketing',
        description: 'Modern marketing program focusing on digital platforms, social media strategy, content marketing, and online advertising.',
        credits: 5,
        level: '2',
        difficulty: 'intermediate',
        delivery: ['in-person', 'online'],
        language: 'english',
        school: {
            name: 'Seneca Polytechnic',
            shortName: 'Seneca'
        },
        programs: [{
            program: {
                name: 'Media & Communications',
                code: 'MCOM'
            },
            semester: 1
        }],
        professors: [{
            name: 'Prof. Ashley Wong',
            rating: 4.4
        }],
        stats: {
            enrollmentCount: 175,
            rating: {
                average: 4.3,
                count: 102
            },
            materialCount: 20
        },
        imageUrl: '/digital.jpg'
    },
    {
        _id: '62',
        code: 'DNFM001',
        name: 'Documentary & Non-Fiction Media Production',
        description: 'Media production program specializing in documentary filmmaking, non-fiction storytelling, and investigative journalism.',
        credits: 5,
        level: '2',
        difficulty: 'intermediate',
        delivery: ['in-person'],
        language: 'english',
        school: {
            name: 'Seneca Polytechnic',
            shortName: 'Seneca'
        },
        programs: [{
            program: {
                name: 'Media & Communications',
                code: 'MCOM'
            },
            semester: 1
        }],
        professors: [{
            name: 'Prof. Michael Roberts',
            rating: 4.5
        }],
        stats: {
            enrollmentCount: 68,
            rating: {
                average: 4.4,
                count: 39
            },
            materialCount: 18
        },
        imageUrl: '/documentary.jpg'
    },
    {
        _id: '63',
        code: 'DFI001',
        name: 'Documentary Filmmaking Institute',
        description: 'Intensive institute program for advanced documentary production, covering all aspects of documentary creation from concept to distribution',
        credits: 6,
        level: '3',
        difficulty: 'advanced',
        delivery: ['in-person'],
        language: 'english',
        school: {
            name: 'Seneca Polytechnic',
            shortName: 'Seneca'
        },
        programs: [{
            program: {
                name: 'Media & Communications',
                code: 'MCOM'
            },
            semester: 1
        }],
        professors: [{
            name: 'Prof. David Martinez',
            rating: 4.6
        }],
        stats: {
            enrollmentCount: 45,
            rating: {
                average: 4.5,
                count: 26
            },
            materialCount: 22
        },
        imageUrl: '/filmmaking.jpg'
    },
    {
        _id: '64',
        code: 'ECE001',
        name: 'Early Childhood Education',
        description: 'Comprehensive program preparing educators to work with young children, covering child development, curriculum planning, and classroom management.',
        credits: 6,
        level: '2',
        difficulty: 'intermediate',
        delivery: ['in-person', 'hybrid'],
        language: 'english',
        school: {
            name: 'Seneca Polytechnic',
            shortName: 'Seneca'
        },
        programs: [{
            program: {
                name: 'Education, Community & Social Services',
                code: 'ECSS'
            },
            semester: 1
        }],
        professors: [{
            name: 'Prof. Mary Johnson',
            rating: 4.4
        }],
        stats: {
            enrollmentCount: 185,
            rating: {
                average: 4.3,
                count: 108
            },
            materialCount: 24
        },
        imageUrl: '/earlychildhood.jpg'
    },
    {
        _id: '65',
        code: 'ECEA001',
        name: 'Early Childhood Education (Accelerated)',
        description: 'Fast-track early childhood education program for students with prior experience or education in related fields.',
        credits: 4,
        level: '2',
        difficulty: 'intermediate',
        delivery: ['in-person', 'online'],
        language: 'english',
        school: {
            name: 'Seneca Polytechnic',
            shortName: 'Seneca'
        },
        programs: [{
            program: {
                name: 'Education, Community & Social Services',
                code: 'ECSS'
            },
            semester: 1
        }],
        professors: [{
            name: 'Prof. Linda Thompson',
            rating: 4.2
        }],
        stats: {
            enrollmentCount: 95,
            rating: {
                average: 4.1,
                count: 55
            },
            materialCount: 18
        },
        imageUrl: '/eceaccel.jpg'
    },
    {
        _id: '66',
        code: 'EETA001',
        name: 'Electromechanical Engineering Technology – Automation',
        description: 'Advanced engineering technology program combining electrical and mechanical systems with automation and control technologies.',
        credits: 6,
        level: '3',
        difficulty: 'advanced',
        delivery: ['in-person'],
        language: 'english',
        school: {
            name: 'Seneca Polytechnic',
            shortName: 'Seneca'
        },
        programs: [{
            program: {
                name: 'Engineering Technology',
                code: 'ENGR'
            },
            semester: 1
        }],
        professors: [{
            name: 'Prof. Dr. Roberto Silva',
            rating: 4.5
        }],
        stats: {
            enrollmentCount: 85,
            rating: {
                average: 4.4,
                count: 49
            },
            materialCount: 30
        },
        imageUrl: '/automation.jpg'
    },
    {
        _id: '67',
        code: 'EET001',
        name: 'Electronics Engineering Technician',
        description: 'Technical program in electronics covering circuit analysis, digital systems, microprocessors, and electronic troubleshooting.',
        credits: 5,
        level: '2',
        difficulty: 'intermediate',
        delivery: ['in-person'],
        language: 'english',
        school: {
            name: 'Seneca Polytechnic',
            shortName: 'Seneca'
        },
        programs: [{
            program: {
                name: 'Engineering Technology',
                code: 'ENGR'
            },
            semester: 1
        }],
        professors: [{
            name: 'Prof. James Wilson',
            rating: 4.2
        }],
        stats: {
            enrollmentCount: 115,
            rating: {
                average: 4.1,
                count: 66
            },
            materialCount: 26
        },
        imageUrl: '/electronics.jpg'
    },
    {
        _id: '68',
        code: 'EETT001',
        name: 'Electronics Engineering Technology',
        description: 'Advanced electronics engineering technology program covering advanced circuits, embedded systems, and telecommunications.',
        credits: 6,
        level: '3',
        difficulty: 'advanced',
        delivery: ['in-person'],
        language: 'english',
        school: {
            name: 'Seneca Polytechnic',
            shortName: 'Seneca'
        },
        programs: [{
            program: {
                name: 'Engineering Technology',
                code: 'ENGR'
            },
            semester: 1
        }],
        professors: [{
            name: 'Prof. Dr. Susan Chen',
            rating: 4.4
        }],
        stats: {
            enrollmentCount: 95,
            rating: {
                average: 4.3,
                count: 55
            },
            materialCount: 28
        },
        imageUrl: '/electronicstech.jpg'
    },
    {
        _id: '69',
        code: 'ELM001',
        name: 'Environmental Landscape Management',
        description: 'Program focusing on sustainable landscape design, environmental restoration, horticulture, and landscape maintenance.',
        credits: 5,
        level: '2',
        difficulty: 'intermediate',
        delivery: ['in-person'],
        language: 'english',
        school: {
            name: 'Seneca Polytechnic',
            shortName: 'Seneca'
        },
        programs: [{
            program: {
                name: 'Science',
                code: 'SCI'
            },
            semester: 1
        }],
        professors: [{
            name: 'Prof. Jennifer Green',
            rating: 4.1
        }],
        stats: {
            enrollmentCount: 78,
            rating: {
                average: 4.0,
                count: 45
            },
            materialCount: 19
        },
        imageUrl: '/landscape.jpg'
    },
    {
        _id: '70',
        code: 'ENVT001',
        name: 'Environmental Technician',
        description: 'Technical program in environmental monitoring, pollution control, waste management, and environmental assessment procedures.',
        credits: 4,
        level: '2',
        difficulty: 'intermediate',
        delivery: ['in-person'],
        language: 'english',
        school: {
            name: 'Seneca Polytechnic',
            shortName: 'Seneca'
        },
        programs: [{
            program: {
                name: 'Science',
                code: 'SCI'
            },
            semester: 1
        }],
        professors: [{
            name: 'Prof. Mark Davis',
            rating: 4.2
        }],
        stats: {
            enrollmentCount: 92,
            rating: {
                average: 4.1,
                count: 53
            },
            materialCount: 21
        },
        imageUrl: '/environmental.jpg'
    },
    {
        _id: '71',
        code: 'ENVTECH001',
        name: 'Environmental Technology',
        description: 'Advanced environmental technology program covering environmental engineering, remediation technologies, and environmental management systems.',
        credits: 6,
        level: '3',
        difficulty: 'advanced',
        delivery: ['in-person', 'hybrid'],
        language: 'english',
        school: {
            name: 'Seneca Polytechnic',
            shortName: 'Seneca'
        },
        programs: [{
            program: {
                name: 'Science',
                code: 'SCI'
            },
            semester: 1
        }],
        professors: [{
            name: 'Prof. Dr. Patricia Rodriguez',
            rating: 4.3
        }],
        stats: {
            enrollmentCount: 72,
            rating: {
                average: 4.2,
                count: 41
            },
            materialCount: 25
        },
        imageUrl: '/envtech.jpg'
    },
    {
        _id: '72',
        code: 'ESPM001',
        name: 'Esports Marketing Management',
        description: 'Specialized program combining marketing principles with esports industry knowledge, covering event management and digital marketing.',
        credits: 5,
        level: '2',
        difficulty: 'intermediate',
        delivery: ['in-person', 'online'],
        language: 'english',
        school: {
            name: 'Seneca Polytechnic',
            shortName: 'Seneca'
        },
        programs: [{
            program: {
                name: 'Business',
                code: 'BUS'
            },
            semester: 1
        }],
        professors: [{
            name: 'Prof. Alex Kim',
            rating: 4.3
        }],
        stats: {
            enrollmentCount: 88,
            rating: {
                average: 4.2,
                count: 51
            },
            materialCount: 17
        },
        imageUrl: '/esports.jpg'
    },
    {
        _id: '73',
        code: 'ESTH001',
        name: 'Esthetician',
        description: 'Professional esthetics program covering skin care treatments, facial techniques, product knowledge, and client consultation.',
        credits: 4,
        level: '2',
        difficulty: 'intermediate',
        delivery: ['in-person'],
        language: 'english',
        school: {
            name: 'Seneca Polytechnic',
            shortName: 'Seneca'
        },
        programs: [{
            program: {
                name: 'Fashion & Esthetics',
                code: 'FE'
            },
            semester: 1
        }],
        professors: [{
            name: 'Prof. Maria Santos',
            rating: 4.4
        }],
        stats: {
            enrollmentCount: 105,
            rating: {
                average: 4.3,
                count: 61
            },
            materialCount: 16
        },
        imageUrl: '/esthetician.jpg'
    },
    {
        _id: '74',
        code: 'EMST001',
        name: 'Esthetics & Medical Spa Therapies',
        description: 'Advanced esthetics program combining traditional spa treatments with medical spa procedures and advanced skin therapies.',
        credits: 5,
        level: '2',
        difficulty: 'intermediate',
        delivery: ['in-person'],
        language: 'english',
        school: {
            name: 'Seneca Polytechnic',
            shortName: 'Seneca'
        },
        programs: [{
            program: {
                name: 'Fashion & Esthetics',
                code: 'FE'
            },
            semester: 1
        }],
        professors: [{
            name: 'Prof. Dr. Angela White',
            rating: 4.5
        }],
        stats: {
            enrollmentCount: 75,
            rating: {
                average: 4.4,
                count: 43
            },
            materialCount: 20
        },
        imageUrl: '/medspa.jpg'
    },
    {
        _id: '75',
        code: 'EMP001',
        name: 'Event & Media Production',
        description: 'Program combining event planning with media production skills, covering live event management and multimedia production.',
        credits: 5,
        level: '2',
        difficulty: 'intermediate',
        delivery: ['in-person'],
        language: 'english',
        school: {
            name: 'Seneca Polytechnic',
            shortName: 'Seneca'
        },
        programs: [{
            program: {
                name: 'Media & Communications',
                code: 'MCOM'
            },
            semester: 1
        }],
        professors: [{
            name: 'Prof. Rachel Brown',
            rating: 4.3
        }],
        stats: {
            enrollmentCount: 85,
            rating: {
                average: 4.2,
                count: 49
            },
            materialCount: 18
        },
        imageUrl: '/eventmedia.jpg'
    },
    {
        _id: '76',
        code: 'EMCD001',
        name: 'Event Management – Creative Design',
        description: 'Specialized event management program focusing on creative design elements, artistic planning, and innovative event concepts.',
        credits: 5,
        level: '2',
        difficulty: 'intermediate',
        delivery: ['in-person', 'hybrid'],
        language: 'english',
        school: {
            name: 'Seneca Polytechnic',
            shortName: 'Seneca'
        },
        programs: [{
            program: {
                name: 'Creative Arts, Animation & Design',
                code: 'CAAD'
            },
            semester: 1
        }],
        professors: [{
            name: 'Prof. Sophie Turner',
            rating: 4.4
        }],
        stats: {
            enrollmentCount: 68,
            rating: {
                average: 4.3,
                count: 39
            },
            materialCount: 16
        },
        imageUrl: '/eventdesign.jpg'
    },
    {
        _id: '77',
        code: 'FASH001',
        name: 'Fashion Arts',
        description: 'Creative fashion program covering fashion design, illustration, pattern making, and garment construction techniques.',
        credits: 5,
        level: '2',
        difficulty: 'intermediate',
        delivery: ['in-person'],
        language: 'english',
        school: {
            name: 'Seneca Polytechnic',
            shortName: 'Seneca'
        },
        programs: [{
            program: {
                name: 'Fashion & Esthetics',
                code: 'FE'
            },
            semester: 1
        }],
        professors: [{
            name: 'Prof. Isabella Martinez',
            rating: 4.3
        }],
        stats: {
            enrollmentCount: 95,
            rating: {
                average: 4.2,
                count: 55
            },
            materialCount: 19
        },
        imageUrl: '/fashionarts.jpg'
    },
    {
        _id: '78',
        code: 'FBUS001',
        name: 'Fashion Business',
        description: 'Business program specializing in fashion industry operations, retail management, fashion marketing, and merchandising.',
        credits: 5,
        level: '2',
        difficulty: 'intermediate',
        delivery: ['in-person', 'hybrid'],
        language: 'english',
        school: {
            name: 'Seneca Polytechnic',
            shortName: 'Seneca'
        },
        programs: [{
            program: {
                name: 'Fashion & Esthetics',
                code: 'FE'
            },
            semester: 1
        }],
        professors: [{
            name: 'Prof. Victoria Chen',
            rating: 4.2
        }],
        stats: {
            enrollmentCount: 115,
            rating: {
                average: 4.1,
                count: 66
            },
            materialCount: 17
        },
        imageUrl: '/fashionbusiness.jpg'
    },
    {
        _id: '79',
        code: 'FBM001',
        name: 'Fashion Business Management',
        description: 'Advanced fashion business program combining management principles with fashion industry expertise and strategic planning.',
        credits: 6,
        level: '2',
        difficulty: 'intermediate',
        delivery: ['in-person', 'hybrid'],
        language: 'english',
        school: {
            name: 'Seneca Polytechnic',
            shortName: 'Seneca'
        },
        programs: [{
            program: {
                name: 'Fashion & Esthetics',
                code: 'FE'
            },
            semester: 1
        }],
        professors: [{
            name: 'Prof. Amanda Johnson',
            rating: 4.3
        }],
        stats: {
            enrollmentCount: 88,
            rating: {
                average: 4.2,
                count: 51
            },
            materialCount: 20
        },
        imageUrl: '/fashionmgmt.jpg'
    },
    {
        _id: '80',
        code: 'FSTD001',
        name: 'Fashion Studies',
        description: 'Comprehensive fashion program covering fashion history, cultural studies, trend analysis, and contemporary fashion theory.',
        credits: 4,
        level: '2',
        difficulty: 'intermediate',
        delivery: ['in-person', 'online'],
        language: 'english',
        school: {
            name: 'Seneca Polytechnic',
            shortName: 'Seneca'
        },
        programs: [{
            program: {
                name: 'Fashion & Esthetics',
                code: 'FE'
            },
            semester: 1
        }],
        professors: [{
            name: 'Prof. Dr. Emma Wilson',
            rating: 4.1
        }],
        stats: {
            enrollmentCount: 78,
            rating: {
                average: 4.0,
                count: 45
            },
            materialCount: 15
        },
        imageUrl: '/fashionstudies.jpg'
    },
    {
        _id: '81',
        code: 'FINP001',
        name: 'Financial Planning',
        description: 'Professional financial planning program covering investment planning, retirement planning, tax strategies, and client relations.',
        credits: 6,
        level: '2',
        difficulty: 'intermediate',
        delivery: ['in-person', 'online'],
        language: 'english',
        school: {
            name: 'Seneca Polytechnic',
            shortName: 'Seneca'
        },
        programs: [{
            program: {
                name: 'Business',
                code: 'BUS'
            },
            semester: 1
        }],
        professors: [{
            name: 'Prof. Robert Anderson',
            rating: 4.4
        }],
        stats: {
            enrollmentCount: 125,
            rating: {
                average: 4.3,
                count: 72
            },
            materialCount: 22
        },
        imageUrl: '/financialplan.jpg'
    },
    {
        _id: '82',
        code: 'FSCA001',
        name: 'Financial Services Compliance Administration',
        description: 'Specialized program in financial services regulations, compliance procedures, and administrative processes in financial institutions.',
        credits: 5,
        level: '2',
        difficulty: 'intermediate',
        delivery: ['in-person', 'hybrid'],
        language: 'english',
        school: {
            name: 'Seneca Polytechnic',
            shortName: 'Seneca'
        },
        programs: [{
            program: {
                name: 'Business',
                code: 'BUS'
            },
            semester: 1
        }],
        professors: [{
            name: 'Prof. Lisa Park',
            rating: 4.2
        }],
        stats: {
            enrollmentCount: 85,
            rating: {
                average: 4.1,
                count: 49
            },
            materialCount: 18
        },
        imageUrl: '/compliance.jpg'
    },
    {
        _id: '83',
        code: 'FSCS001',
        name: 'Financial Services – Client Services',
        description: 'Program focusing on client relationship management, customer service excellence, and financial product knowledge.',
        credits: 4,
        level: '2',
        difficulty: 'intermediate',
        delivery: ['in-person', 'online'],
        language: 'english',
        school: {
            name: 'Seneca Polytechnic',
            shortName: 'Seneca'
        },
        programs: [{
            program: {
                name: 'Business',
                code: 'BUS'
            },
            semester: 1
        }],
        professors: [{
            name: 'Prof. Michelle Wong',
            rating: 4.1
        }],
        stats: {
            enrollmentCount: 105,
            rating: {
                average: 4.0,
                count: 61
            },
            materialCount: 16
        },
        imageUrl: '/clientservices.jpg'
    },
    {
        _id: '84',
        code: 'FINT001',
        name: 'Financial Technology',
        description: 'Innovative program combining finance with technology, covering fintech applications, blockchain, and digital payment systems.',
        credits: 6,
        level: '2',
        difficulty: 'intermediate',
        delivery: ['in-person', 'online'],
        language: 'english',
        school: {
            name: 'Seneca Polytechnic',
            shortName: 'Seneca'
        },
        programs: [{
            program: {
                name: 'Information Technology',
                code: 'IT'
            },
            semester: 1
        }],
        professors: [{
            name: 'Prof. Dr. Kevin Zhang',
            rating: 4.5
        }],
        stats: {
            enrollmentCount: 135,
            rating: {
                average: 4.4,
                count: 78
            },
            materialCount: 26
        },
        imageUrl: '/fintech.jpg'
    },
    {
        _id: '85',
        code: 'FPET001',
        name: 'Fire Protection Engineering Technician',
        description: 'Technical program in fire protection systems, safety codes, sprinkler systems, and fire prevention technologies.',
        credits: 5,
        level: '2',
        difficulty: 'intermediate',
        delivery: ['in-person'],
        language: 'english',
        school: {
            name: 'Seneca Polytechnic',
            shortName: 'Seneca'
        },
        programs: [{
            program: {
                name: 'Engineering Technology',
                code: 'ENGR'
            },
            semester: 1
        }],
        professors: [{
            name: 'Prof. Captain Mike Davis',
            rating: 4.3
        }],
        stats: {
            enrollmentCount: 65,
            rating: {
                average: 4.2,
                count: 37
            },
            materialCount: 21
        },
        imageUrl: '/fireprotection.jpg'
    },
    {
        _id: '86',
        code: 'FPETT001',
        name: 'Fire Protection Engineering Technology',
        description: 'Advanced fire protection engineering program covering complex fire safety systems, building codes, and emergency response planning.',
        credits: 6,
        level: '3',
        difficulty: 'advanced',
        delivery: ['in-person'],
        language: 'english',
        school: {
            name: 'Seneca Polytechnic',
            shortName: 'Seneca'
        },
        programs: [{
            program: {
                name: 'Engineering Technology',
                code: 'ENGR'
            },
            semester: 1
        }],
        professors: [{
            name: 'Prof. Dr. Sandra Mitchell',
            rating: 4.4
        }],
        stats: {
            enrollmentCount: 48,
            rating: {
                average: 4.3,
                count: 28
            },
            materialCount: 24
        },
        imageUrl: '/firetech.jpg'
    },
    {
        _id: '87',
        code: 'FIRE001',
        name: 'Firefighter, Pre-Service Education and Training',
        description: 'Comprehensive firefighter training program covering emergency response, rescue operations, fire suppression, and safety protocols.',
        credits: 6,
        level: '2',
        difficulty: 'intermediate',
        delivery: ['in-person'],
        language: 'english',
        school: {
            name: 'Seneca Polytechnic',
            shortName: 'Seneca'
        },
        programs: [{
            program: {
                name: 'Law, Administration & Public Safety',
                code: 'LAPS'
            },
            semester: 1
        }],
        professors: [{
            name: 'Prof. Chief Robert Wilson',
            rating: 4.6
        }],
        stats: {
            enrollmentCount: 95,
            rating: {
                average: 4.5,
                count: 55
            },
            materialCount: 28
        },
        imageUrl: '/firefighter.jpg'
    },
    {
        _id: '88',
        code: 'FHP001',
        name: 'Fitness & Health Promotion',
        description: 'Program combining fitness training with health promotion, covering exercise science, nutrition, and wellness program development.',
        credits: 5,
        level: '2',
        difficulty: 'intermediate',
        delivery: ['in-person', 'hybrid'],
        language: 'english',
        school: {
            name: 'Seneca Polytechnic',
            shortName: 'Seneca'
        },
        programs: [{
            program: {
                name: 'Health & Wellness',
                code: 'HW'
            },
            semester: 1
        }],
        professors: [{
            name: 'Prof. Dr. Lisa Johnson',
            rating: 4.3
        }],
        stats: {
            enrollmentCount: 145,
            rating: {
                average: 4.2,
                count: 83
            },
            materialCount: 20
        },
        imageUrl: '/fitness.jpg'
    },
    {
        _id: '89',
        code: 'FLTS001',
        name: 'Flight Services',
        description: 'Aviation program covering flight operations, air traffic services, weather services, and airport operations management.',
        credits: 5,
        level: '2',
        difficulty: 'intermediate',
        delivery: ['in-person'],
        language: 'english',
        school: {
            name: 'Seneca Polytechnic',
            shortName: 'Seneca'
        },
        programs: [{
            program: {
                name: 'Aviation',
                code: 'AVIA'
            },
            semester: 1
        }],
        professors: [{
            name: 'Prof. Captain Sarah Lee',
            rating: 4.4
        }],
        stats: {
            enrollmentCount: 78,
            rating: {
                average: 4.3,
                count: 45
            },
            materialCount: 22
        },
        imageUrl: '/flightservices.jpg'
    },
    {
        _id: '90',
        code: 'FSOC001',
        name: 'Flight Services – Operations & Cabin Management',
        description: 'Specialized flight services program focusing on cabin operations, passenger services, and airline operational procedures.',
        credits: 5,
        level: '2',
        difficulty: 'intermediate',
        delivery: ['in-person'],
        language: 'english',
        school: {
            name: 'Seneca Polytechnic',
            shortName: 'Seneca'
        },
        programs: [{
            program: {
                name: 'Aviation',
                code: 'AVIA'
            },
            semester: 1
        }],
        professors: [{
            name: 'Prof. Maria Rodriguez',
            rating: 4.3
        }],
        stats: {
            enrollmentCount: 68,
            rating: {
                average: 4.2,
                count: 39
            },
            materialCount: 19
        },
        imageUrl: '/cabinmgmt.jpg'
    },
    {
        _id: '91',
        code: 'FLOR001',
        name: 'Floral Design',
        description: 'Creative program in floral artistry covering flower arrangement, wedding design, event florals, and business operations.',
        credits: 4,
        level: '2',
        difficulty: 'intermediate',
        delivery: ['in-person'],
        language: 'english',
        school: {
            name: 'Seneca Polytechnic',
            shortName: 'Seneca'
        },
        programs: [{
            program: {
                name: 'Creative Arts, Animation & Design',
                code: 'CAAD'
            },
            semester: 1
        }],
        professors: [{
            name: 'Prof. Jennifer Green',
            rating: 4.2
        }],
        stats: {
            enrollmentCount: 55,
            rating: {
                average: 4.1,
                count: 32
            },
            materialCount: 14
        },
        imageUrl: '/floral.jpg'
    },
    {
        _id: '92',
        code: 'FRFA001',
        name: 'Fraud Examination & Forensic Accounting',
        description: 'Specialized accounting program focusing on fraud detection, forensic investigation techniques, and financial crime analysis.',
        credits: 6,
        level: '3',
        difficulty: 'advanced',
        delivery: ['in-person', 'hybrid'],
        language: 'english',
        school: {
            name: 'Seneca Polytechnic',
            shortName: 'Seneca'
        },
        programs: [{
            program: {
                name: 'Business',
                code: 'BUS'
            },
            semester: 1
        }],
        professors: [{
            name: 'Prof. Dr. Michael Thompson',
            rating: 4.5
        }],
        stats: {
            enrollmentCount: 65,
            rating: {
                average: 4.4,
                count: 37
            },
            materialCount: 25
        },
        imageUrl: '/fraud.jpg'
    },
    {
        _id: '93',
        code: 'GAA001',
        name: 'Game Art & Animation',
        description: 'Specialized program in video game art creation, character design, environment modeling, and game animation techniques.',
        credits: 6,
        level: '2',
        difficulty: 'intermediate',
        delivery: ['in-person'],
        language: 'english',
        school: {
            name: 'Seneca Polytechnic',
            shortName: 'Seneca'
        },
        programs: [{
            program: {
                name: 'Creative Arts, Animation & Design',
                code: 'CAAD'
            },
            semester: 1
        }],
        professors: [{
            name: 'Prof. Alex Turner',
            rating: 4.4
        }],
        stats: {
            enrollmentCount: 125,
            rating: {
                average: 4.3,
                count: 72
            },
            materialCount: 24
        },
        imageUrl: '/gameart.jpg'
    },
    {
        _id: '94',
        code: 'GAEA001',
        name: 'General Arts – English for Academic Purposes',
        description: 'Foundation program helping international students develop English language skills for academic success in post-secondary education.',
        credits: 3,
        level: '1',
        difficulty: 'beginner',
        delivery: ['in-person', 'online'],
        language: 'english',
        school: {
            name: 'Seneca Polytechnic',
            shortName: 'Seneca'
        },
        programs: [{
            program: {
                name: 'Liberal Arts & University Transfers',
                code: 'LAUT'
            },
            semester: 1
        }],
        professors: [{
            name: 'Prof. Susan Miller',
            rating: 4.0
        }],
        stats: {
            enrollmentCount: 165,
            rating: {
                average: 3.9,
                count: 95
            },
            materialCount: 12
        },
        imageUrl: '/eap.jpg'
    },
    {
        _id: '95',
        code: 'GAOY001',
        name: 'General Arts – One Year Certificate',
        description: 'One-year general arts certificate program providing foundational knowledge across multiple disciplines.',
        credits: 3,
        level: '1',
        difficulty: 'beginner',
        delivery: ['in-person', 'online'],
        language: 'english',
        school: {
            name: 'Seneca Polytechnic',
            shortName: 'Seneca'
        },
        programs: [{
            program: {
                name: 'Liberal Arts & University Transfers',
                code: 'LAUT'
            },
            semester: 1
        }],
        professors: [{
            name: 'Prof. Jennifer Adams',
            rating: 3.8
        }],
        stats: {
            enrollmentCount: 185,
            rating: {
                average: 3.7,
                count: 108
            },
            materialCount: 10
        },
        imageUrl: '/generalarts.jpg'
    },
    {
        _id: '96',
        code: 'GBM001',
        name: 'Global Business Management',
        description: 'International business program covering global markets, cross-cultural management, and international trade strategies.',
        credits: 6,
        level: '2',
        difficulty: 'intermediate',
        delivery: ['in-person', 'hybrid'],
        language: 'english',
        school: {
            name: 'Seneca Polytechnic',
            shortName: 'Seneca'
        },
        programs: [{
            program: {
                name: 'Business',
                code: 'BUS'
            },
            semester: 1
        }],
        professors: [{
            name: 'Prof. Dr. Elena Petrov',
            rating: 4.4
        }],
        stats: {
            enrollmentCount: 145,
            rating: {
                average: 4.3,
                count: 83
            },
            materialCount: 23
        },
        imageUrl: '/globalbusiness.jpg'
    },
    {
        _id: '97',
        code: 'GHBD001',
        name: 'Global Hospitality Business Development',
        description: 'Hospitality program focusing on international hotel development, resort management, and global hospitality trends.',
        credits: 6,
        level: '2',
        difficulty: 'intermediate',
        delivery: ['in-person', 'hybrid'],
        language: 'english',
        school: {
            name: 'Seneca Polytechnic',
            shortName: 'Seneca'
        },
        programs: [{
            program: {
                name: 'Hospitality & Tourism',
                code: 'HT'
            },
            semester: 1
        }],
        professors: [{
            name: 'Prof. Maria Gonzalez',
            rating: 4.3
        }],
        stats: {
            enrollmentCount: 85,
            rating: {
                average: 4.2,
                count: 49
            },
            materialCount: 20
        },
        imageUrl: '/globalhospitality.jpg'
    },
    {
        _id: '98',
        code: 'GHOM001',
        name: 'Global Hospitality Operations Management',
        description: 'Operations-focused hospitality program covering international hotel operations, service management, and quality control.',
        credits: 6,
        level: '2',
        difficulty: 'intermediate',
        delivery: ['in-person', 'hybrid'],
        language: 'english',
        school: {
            name: 'Seneca Polytechnic',
            shortName: 'Seneca'
        },
        programs: [{
            program: {
                name: 'Hospitality & Tourism',
                code: 'HT'
            },
            semester: 1
        }],
        professors: [{
            name: 'Prof. James Chen',
            rating: 4.2
        }],
        stats: {
            enrollmentCount: 92,
            rating: {
                average: 4.1,
                count: 53
            },
            materialCount: 19
        },
        imageUrl: '/hospitalityops.jpg'
    },
    {
        _id: '99',
        code: 'GHSL001',
        name: 'Global Hospitality Sustainable Leadership',
        description: 'Leadership-focused hospitality program emphasizing sustainability, environmental responsibility, and ethical hospitality practices.',
        credits: 6,
        level: '3',
        difficulty: 'advanced',
        delivery: ['in-person', 'hybrid'],
        language: 'english',
        school: {
            name: 'Seneca Polytechnic',
            shortName: 'Seneca'
        },
        programs: [{
            program: {
                name: 'Hospitality & Tourism',
                code: 'HT'
            },
            semester: 1
        }],
        professors: [{
            name: 'Prof. Dr. Sarah Kim',
            rating: 4.5
        }],
        stats: {
            enrollmentCount: 68,
            rating: {
                average: 4.4,
                count: 39
            },
            materialCount: 22
        },
        imageUrl: '/sustainable.jpg'
    },
    {
        _id: '100',
        code: 'GOVR001',
        name: 'Government Relations',
        description: 'Program covering government operations, public policy analysis, lobbying practices, and stakeholder engagement.',
        credits: 5,
        level: '2',
        difficulty: 'intermediate',
        delivery: ['in-person', 'hybrid'],
        language: 'english',
        school: {
            name: 'Seneca Polytechnic',
            shortName: 'Seneca'
        },
        programs: [{
            program: {
                name: 'Law, Administration & Public Safety',
                code: 'LAPS'
            },
            semester: 1
        }],
        professors: [{
            name: 'Prof. Dr. Patricia Wilson',
            rating: 4.3
        }],
        stats: {
            enrollmentCount: 75,
            rating: {
                average: 4.2,
                count: 43
            },
            materialCount: 18
        },
        imageUrl: '/government.jpg'
    },
    {
        _id: '101',
        code: 'GDES001',
        name: 'Graphic Design',
        description: 'Creative design program covering visual communication, branding, digital design, and print media production.',
        credits: 5,
        level: '2',
        difficulty: 'intermediate',
        delivery: ['in-person', 'hybrid'],
        language: 'english',
        school: {
            name: 'Seneca Polytechnic',
            shortName: 'Seneca'
        },
        programs: [{
            program: {
                name: 'Creative Arts, Animation & Design',
                code: 'CAAD'
            },
            semester: 1
        }],
        professors: [{
            name: 'Prof. Ryan Mitchell',
            rating: 4.4
        }],
        stats: {
            enrollmentCount: 165,
            rating: {
                average: 4.3,
                count: 95
            },
            materialCount: 21
        },
        imageUrl: '/graphic.jpg'
    },
    {
        _id: '102',
        code: 'HBAT001',
        name: 'Honours Bachelor of Aviation Technology',
        description: 'Bachelor degree in aviation technology covering advanced aircraft systems, aviation management, and aerospace engineering.',
        credits: 8,
        level: '4',
        difficulty: 'advanced',
        delivery: ['in-person'],
        language: 'english',
        school: {
            name: 'Seneca Polytechnic',
            shortName: 'Seneca'
        },
        programs: [{
            program: {
                name: 'Aviation',
                code: 'AVIA'
            },
            semester: 1
        }],
        professors: [{
            name: 'Prof. Dr. Captain Robert Johnson',
            rating: 4.6
        }],
        stats: {
            enrollmentCount: 95,
            rating: {
                average: 4.5,
                count: 55
            },
            materialCount: 35
        },
        imageUrl: '/aviationtech.jpg'
    },
    {
        _id: '103',
        code: 'HBBP001',
        name: 'Honours Bachelor of Behavioural Psychology',
        description: 'Bachelor degree in psychology focusing on human behavior analysis, research methods, and psychological assessment.',
        credits: 8,
        level: '4',
        difficulty: 'advanced',
        delivery: ['in-person', 'hybrid'],
        language: 'english',
        school: {
            name: 'Seneca Polytechnic',
            shortName: 'Seneca'
        },
        programs: [{
            program: {
                name: 'Education, Community & Social Services',
                code: 'ECSS'
            },
            semester: 1
        }],
        professors: [{
            name: 'Prof. Dr. Rachel Green',
            rating: 4.5
        }],
        stats: {
            enrollmentCount: 125,
            rating: {
                average: 4.4,
                count: 72
            },
            materialCount: 32
        },
        imageUrl: '/psychology.jpg'
    },
    {
        _id: '104',
        code: 'HBCD001',
        name: 'Honours Bachelor of Child Development',
        description: 'Bachelor degree specializing in child development, early intervention, and developmental psychology.',
        credits: 8,
        level: '4',
        difficulty: 'advanced',
        delivery: ['in-person', 'hybrid'],
        language: 'english',
        school: {
            name: 'Seneca Polytechnic',
            shortName: 'Seneca'
        },
        programs: [{
            program: {
                name: 'Education, Community & Social Services',
                code: 'ECSS'
            },
            semester: 1
        }],
        professors: [{
            name: 'Prof. Dr. Karen Mitchell',
            rating: 4.4
        }],
        stats: {
            enrollmentCount: 85,
            rating: {
                average: 4.3,
                count: 49
            },
            materialCount: 30
        },
        imageUrl: '/childdevel.jpg'
    },
    {
        _id: '105',
        code: 'HBCAF001',
        name: 'Honours Bachelor of Commerce – Accounting & Finance',
        description: 'Bachelor degree combining accounting and finance with advanced business principles and strategic financial management.',
        credits: 8,
        level: '4',
        difficulty: 'advanced',
        delivery: ['in-person', 'hybrid'],
        language: 'english',
        school: {
            name: 'Seneca Polytechnic',
            shortName: 'Seneca'
        },
        programs: [{
            program: {
                name: 'Business',
                code: 'BUS'
            },
            semester: 1
        }],
        professors: [{
            name: 'Prof. Dr. David Thompson',
            rating: 4.5
        }],
        stats: {
            enrollmentCount: 185,
            rating: {
                average: 4.4,
                count: 108
            },
            materialCount: 38
        },
        imageUrl: '/commerceaf.jpg'
    },
    {
        _id: '106',
        code: 'HBCBM001',
        name: 'Honours Bachelor of Commerce – Business Management',
        description: 'Bachelor degree in business management covering strategic planning, operations management, and organizational leadership.',
        credits: 8,
        level: '4',
        difficulty: 'advanced',
        delivery: ['in-person', 'hybrid'],
        language: 'english',
        school: {
            name: 'Seneca Polytechnic',
            shortName: 'Seneca'
        },
        programs: [{
            program: {
                name: 'Business',
                code: 'BUS'
            },
            semester: 1
        }],
        professors: [{
            name: 'Prof. Dr. Patricia Lee',
            rating: 4.4
        }],
        stats: {
            enrollmentCount: 225,
            rating: {
                average: 4.3,
                count: 135
            },
            materialCount: 36
        },
        imageUrl: '/commercebm.jpg'
    },
    {
        _id: '107',
        code: 'HBCBTM001',
        name: 'Honours Bachelor of Commerce – Business Technology Management',
        description: 'Bachelor degree integrating business management with technology strategy and digital transformation.',
        credits: 8,
        level: '4',
        difficulty: 'advanced',
        delivery: ['in-person', 'hybrid'],
        language: 'english',
        school: {
            name: 'Seneca Polytechnic',
            shortName: 'Seneca'
        },
        programs: [{
            program: {
                name: 'Business',
                code: 'BUS'
            },
            semester: 1
        }],
        professors: [{
            name: 'Prof. Dr. Richard Park',
            rating: 4.5
        }],
        stats: {
            enrollmentCount: 165,
            rating: {
                average: 4.4,
                count: 95
            },
            materialCount: 34
        },
        imageUrl: '/businesstech.jpg'
    },
    {
        _id: '108',
        code: 'HBCFP001',
        name: 'Honours Bachelor of Commerce – Financial Planning',
        description: 'Bachelor degree specializing in comprehensive financial planning, investment strategies, and wealth management.',
        credits: 8,
        level: '4',
        difficulty: 'advanced',
        delivery: ['in-person', 'hybrid'],
        language: 'english',
        school: {
            name: 'Seneca Polytechnic',
            shortName: 'Seneca'
        },
        programs: [{
            program: {
                name: 'Business',
                code: 'BUS'
            },
            semester: 1
        }],
        professors: [{
            name: 'Prof. Dr. Michelle Wong',
            rating: 4.4
        }],
        stats: {
            enrollmentCount: 145,
            rating: {
                average: 4.3,
                count: 83
            },
            materialCount: 32
        },
        imageUrl: '/financialplanning.jpg'
    },
    {
        _id: '109',
        code: 'HBCHRM001',
        name: 'Honours Bachelor of Commerce – Human Resources Management',
        description: 'Bachelor degree in human resources management covering organizational behavior, labor relations, and strategic HR planning.',
        credits: 8,
        level: '4',
        difficulty: 'advanced',
        delivery: ['in-person', 'hybrid'],
        language: 'english',
        school: {
            name: 'Seneca Polytechnic',
            shortName: 'Seneca'
        },
        programs: [{
            program: {
                name: 'Business',
                code: 'BUS'
            },
            semester: 1
        }],
        professors: [{
            name: 'Prof. Dr. Daniel Wilson',
            rating: 4.3
        }],
        stats: {
            enrollmentCount: 155,
            rating: {
                average: 4.2,
                count: 89
            },
            materialCount: 30
        },
        imageUrl: '/hrmanagement.jpg'
    },
    {
        _id: '110',
        code: 'HBCIBM001',
        name: 'Honours Bachelor of Commerce – International Business Management',
        description: 'Bachelor degree in international business covering global trade, cross-cultural management, and international marketing.',
        credits: 8,
        level: '4',
        difficulty: 'advanced',
        delivery: ['in-person', 'hybrid'],
        language: 'english',
        school: {
            name: 'Seneca Polytechnic',
            shortName: 'Seneca'
        },
        programs: [{
            program: {
                name: 'Business',
                code: 'BUS'
            },
            semester: 1
        }],
        professors: [{
            name: 'Prof. Dr. Maria Gonzalez',
            rating: 4.5
        }],
        stats: {
            enrollmentCount: 135,
            rating: {
                average: 4.4,
                count: 78
            },
            materialCount: 33
        },
        imageUrl: '/intlbusinessmgmt.jpg'
    },
    {
        _id: '111',
        code: 'HBCMKT001',
        name: 'Honours Bachelor of Commerce – Marketing',
        description: 'Bachelor degree in marketing covering brand management, consumer behavior, digital marketing, and marketing research.',
        credits: 8,
        level: '4',
        difficulty: 'advanced',
        delivery: ['in-person', 'hybrid'],
        language: 'english',
        school: {
            name: 'Seneca Polytechnic',
            shortName: 'Seneca'
        },
        programs: [{
            program: {
                name: 'Business',
                code: 'BUS'
            },
            semester: 1
        }],
        professors: [{
            name: 'Prof. Dr. Sarah Kim',
            rating: 4.4
        }],
        stats: {
            enrollmentCount: 195,
            rating: {
                average: 4.3,
                count: 112
            },
            materialCount: 35
        },
        imageUrl: '/marketingdegree.jpg'
    },
    {
        _id: '112',
        code: 'HBCM001',
        name: 'Honours Bachelor of Communications & Media',
        description: 'Bachelor degree in communications covering journalism, media production, public relations, and digital media.',
        credits: 8,
        level: '4',
        difficulty: 'advanced',
        delivery: ['in-person', 'hybrid'],
        language: 'english',
        school: {
            name: 'Seneca Polytechnic',
            shortName: 'Seneca'
        },
        programs: [{
            program: {
                name: 'Media & Communications',
                code: 'MCOM'
            },
            semester: 1
        }],
        professors: [{
            name: 'Prof. Dr. Jennifer Brown',
            rating: 4.4
        }],
        stats: {
            enrollmentCount: 165,
            rating: {
                average: 4.3,
                count: 95
            },
            materialCount: 32
        },
        imageUrl: '/communications.jpg'
    },
    {
        _id: '113',
        code: 'HBCIA001',
        name: 'Honours Bachelor of Crime & Intelligence Analysis',
        description: 'Bachelor degree specializing in criminal intelligence, data analysis, investigative techniques, and security analysis.',
        credits: 8,
        level: '4',
        difficulty: 'advanced',
        delivery: ['in-person', 'hybrid'],
        language: 'english',
        school: {
            name: 'Seneca Polytechnic',
            shortName: 'Seneca'
        },
        programs: [{
            program: {
                name: 'Law, Administration & Public Safety',
                code: 'LAPS'
            },
            semester: 1
        }],
        professors: [{
            name: 'Prof. Dr. James Wilson',
            rating: 4.5
        }],
        stats: {
            enrollmentCount: 85,
            rating: {
                average: 4.4,
                count: 49
            },
            materialCount: 28
        },
        imageUrl: '/crimeintel.jpg'
    },
    {
        _id: '114',
        code: 'HBDSA001',
        name: 'Honours Bachelor of Data Science and Analytics',
        description: 'Bachelor degree in data science covering statistical analysis, machine learning, data visualization, and big data technologies.',
        credits: 8,
        level: '4',
        difficulty: 'advanced',
        delivery: ['in-person', 'online'],
        language: 'english',
        school: {
            name: 'Seneca Polytechnic',
            shortName: 'Seneca'
        },
        programs: [{
            program: {
                name: 'Information Technology',
                code: 'IT'
            },
            semester: 1
        }],
        professors: [{
            name: 'Prof. Dr. Angela Chen',
            rating: 4.6
        }],
        stats: {
            enrollmentCount: 175,
            rating: {
                average: 4.5,
                count: 102
            },
            materialCount: 40
        },
        imageUrl: '/datascience.jpg'
    },
    {
        _id: '115',
        code: 'HBDIM001',
        name: 'Honours Bachelor of Design in Interactive Media',
        description: 'Bachelor degree in interactive media design covering user experience, interface design, and digital media creation.',
        credits: 8,
        level: '4',
        difficulty: 'advanced',
        delivery: ['in-person', 'hybrid'],
        language: 'english',
        school: {
            name: 'Seneca Polytechnic',
            shortName: 'Seneca'
        },
        programs: [{
            program: {
                name: 'Creative Arts, Animation & Design',
                code: 'CAAD'
            },
            semester: 1
        }],
        professors: [{
            name: 'Prof. Dr. Ryan Mitchell',
            rating: 4.5
        }],
        stats: {
            enrollmentCount: 125,
            rating: {
                average: 4.4,
                count: 72
            },
            materialCount: 30
        },
        imageUrl: '/interactivemedia.jpg'
    },
    {
        _id: '116',
        code: 'HBHA001',
        name: 'Honours Bachelor of Health Administration',
        description: 'Bachelor degree in health administration covering healthcare management, policy analysis, and health system operations.',
        credits: 8,
        level: '4',
        difficulty: 'advanced',
        delivery: ['in-person', 'hybrid'],
        language: 'english',
        school: {
            name: 'Seneca Polytechnic',
            shortName: 'Seneca'
        },
        programs: [{
            program: {
                name: 'Health & Wellness',
                code: 'HW'
            },
            semester: 1
        }],
        professors: [{
            name: 'Prof. Dr. Patricia Kim',
            rating: 4.4
        }],
        stats: {
            enrollmentCount: 105,
            rating: {
                average: 4.3,
                count: 61
            },
            materialCount: 26
        },
        imageUrl: '/healthadmin.jpg'
    },
    {
        _id: '117',
        code: 'HBITDM001',
        name: 'Honours Bachelor of Information Technology Design and Management',
        description: 'Bachelor degree combining IT design with management principles, covering system design and technology leadership.',
        credits: 8,
        level: '4',
        difficulty: 'advanced',
        delivery: ['in-person', 'hybrid'],
        language: 'english',
        school: {
            name: 'Seneca Polytechnic',
            shortName: 'Seneca'
        },
        programs: [{
            program: {
                name: 'Information Technology',
                code: 'IT'
            },
            semester: 1
        }],
        professors: [{
            name: 'Prof. Dr. Kevin Zhang',
            rating: 4.5
        }],
        stats: {
            enrollmentCount: 145,
            rating: {
                average: 4.4,
                count: 83
            },
            materialCount: 32
        },
        imageUrl: '/itdesign.jpg'
    },
    {
        _id: '118',
        code: 'HBITC001',
        name: 'Honours Bachelor of Information Technology – Cybersecurity',
        description: 'Bachelor degree specializing in cybersecurity, covering information security, ethical hacking, and security management.',
        credits: 8,
        level: '4',
        difficulty: 'advanced',
        delivery: ['in-person', 'online'],
        language: 'english',
        school: {
            name: 'Seneca Polytechnic',
            shortName: 'Seneca'
        },
        programs: [{
            program: {
                name: 'Information Technology',
                code: 'IT'
            },
            semester: 1
        }],
        professors: [{
            name: 'Prof. Dr. Sarah Kim',
            rating: 4.6
        }],
        stats: {
            enrollmentCount: 155,
            rating: {
                average: 4.5,
                count: 89
            },
            materialCount: 38
        },
        imageUrl: '/cybersecuritydegree.jpg'
    },
    {
        _id: '119',
        code: 'HBIS001',
        name: 'Honours Bachelor of Interdisciplinary Studies',
        description: 'Bachelor degree allowing students to combine multiple disciplines for a customized educational experience.',
        credits: 8,
        level: '4',
        difficulty: 'advanced',
        delivery: ['in-person', 'hybrid'],
        language: 'english',
        school: {
            name: 'Seneca Polytechnic',
            shortName: 'Seneca'
        },
        programs: [{
            program: {
                name: 'Liberal Arts & University Transfers',
                code: 'LAUT'
            },
            semester: 1
        }],
        professors: [{
            name: 'Prof. Dr. Jennifer Adams',
            rating: 4.2
        }],
        stats: {
            enrollmentCount: 95,
            rating: {
                average: 4.1,
                count: 55
            },
            materialCount: 24
        },
        imageUrl: '/interdisciplinary.jpg'
    },
    {
        _id: '120',
        code: 'HBMHA001',
        name: 'Honours Bachelor of Mental Health and Addiction',
        description: 'Bachelor degree specializing in mental health services, addiction counseling, and therapeutic interventions.',
        credits: 8,
        level: '4',
        difficulty: 'advanced',
        delivery: ['in-person', 'hybrid'],
        language: 'english',
        school: {
            name: 'Seneca Polytechnic',
            shortName: 'Seneca'
        },
        programs: [{
            program: {
                name: 'Health & Wellness',
                code: 'HW'
            },
            semester: 1
        }],
        professors: [{
            name: 'Prof. Dr. Rachel Green',
            rating: 4.5
        }],
        stats: {
            enrollmentCount: 115,
            rating: {
                average: 4.4,
                count: 66
            },
            materialCount: 28
        },
        imageUrl: '/mentalhealth.jpg'
    },
    {
        _id: '121',
        code: 'HBSB001',
        name: 'Honours Bachelor of Science – Biotechnology',
        description: 'Bachelor degree in biotechnology covering molecular biology, genetic engineering, and biotechnological applications.',
        credits: 8,
        level: '4',
        difficulty: 'advanced',
        delivery: ['in-person'],
        language: 'english',
        school: {
            name: 'Seneca Polytechnic',
            shortName: 'Seneca'
        },
        programs: [{
            program: {
                name: 'Science',
                code: 'SCI'
            },
            semester: 1
        }],
        professors: [{
            name: 'Prof. Dr. Thomas Anderson',
            rating: 4.5
        }],
        stats: {
            enrollmentCount: 85,
            rating: {
                average: 4.4,
                count: 49
            },
            materialCount: 35
        },
        imageUrl: '/biotechdegree.jpg'
    },
    {
        _id: '122',
        code: 'HBSN001',
        name: 'Honours Bachelor of Science – Nursing',
        description: 'Bachelor degree in nursing covering patient care, health assessment, nursing theory, and clinical practice.',
        credits: 8,
        level: '4',
        difficulty: 'advanced',
        delivery: ['in-person'],
        language: 'english',
        school: {
            name: 'Seneca Polytechnic',
            shortName: 'Seneca'
        },
        programs: [{
            program: {
                name: 'Health & Wellness',
                code: 'HW'
            },
            semester: 1
        }],
        professors: [{
            name: 'Prof. Dr. Lisa Johnson',
            rating: 4.6
        }],
        stats: {
            enrollmentCount: 225,
            rating: {
                average: 4.5,
                count: 135
            },
            materialCount: 40
        },
        imageUrl: '/nursing.jpg'
    },
    {
        _id: '123',
        code: 'HBSNB001',
        name: 'Honours Bachelor of Science – Nursing (Bridge)',
        description: 'Bridge nursing program for registered practical nurses seeking to complete their bachelor degree in nursing.',
        credits: 6,
        level: '4',
        difficulty: 'advanced',
        delivery: ['in-person', 'hybrid'],
        language: 'english',
        school: {
            name: 'Seneca Polytechnic',
            shortName: 'Seneca'
        },
        programs: [{
            program: {
                name: 'Health & Wellness',
                code: 'HW'
            },
            semester: 1
        }],
        professors: [{
            name: 'Prof. Dr. Patricia Miller',
            rating: 4.4
        }],
        stats: {
            enrollmentCount: 95,
            rating: {
                average: 4.3,
                count: 55
            },
            materialCount: 30
        },
        imageUrl: '/nursingbridge.jpg'
    },
    {
        _id: '124',
        code: 'HBSNF001',
        name: 'Honours Bachelor of Science – Nursing (Fast track)',
        description: 'Accelerated nursing program for students with previous healthcare experience or related degrees.',
        credits: 6,
        level: '4',
        difficulty: 'advanced',
        delivery: ['in-person'],
        language: 'english',
        school: {
            name: 'Seneca Polytechnic',
            shortName: 'Seneca'
        },
        programs: [{
            program: {
                name: 'Health & Wellness',
                code: 'HW'
            },
            semester: 1
        }],
        professors: [{
            name: 'Prof. Dr. Karen White',
            rating: 4.5
        }],
        stats: {
            enrollmentCount: 75,
            rating: {
                average: 4.4,
                count: 43
            },
            materialCount: 32
        },
        imageUrl: '/nursingfast.jpg'
    },
    {
        _id: '125',
        code: 'HBSSE001',
        name: 'Honours Bachelor of Software Systems Engineering',
        description: 'Bachelor degree in software engineering covering system design, software architecture, and engineering principles.',
        credits: 8,
        level: '4',
        difficulty: 'advanced',
        delivery: ['in-person', 'online'],
        language: 'english',
        school: {
            name: 'Seneca Polytechnic',
            shortName: 'Seneca'
        },
        programs: [{
            program: {
                name: 'Information Technology',
                code: 'IT'
            },
            semester: 1
        }],
        professors: [{
            name: 'Prof. Dr. Michael Chen',
            rating: 4.6
        }],
        stats: {
            enrollmentCount: 185,
            rating: {
                average: 4.5,
                count: 108
            },
            materialCount: 42
        },
        imageUrl: '/softwareeng.jpg'
    },
    {
        _id: '126',
        code: 'HBTH001',
        name: 'Honours Bachelor of Technology – Health Informatics',
        description: 'Bachelor degree combining healthcare with information technology, focusing on health data management and medical systems.',
        credits: 8,
        level: '4',
        difficulty: 'advanced',
        delivery: ['in-person', 'hybrid'],
        language: 'english',
        school: {
            name: 'Seneca Polytechnic',
            shortName: 'Seneca'
        },
        programs: [{
            program: {
                name: 'Health & Wellness',
                code: 'HW'
            },
            semester: 1
        }],
        professors: [{
            name: 'Prof. Dr. Susan Rodriguez',
            rating: 4.4
        }],
        stats: {
            enrollmentCount: 105,
            rating: {
                average: 4.3,
                count: 61
            },
            materialCount: 28
        },
        imageUrl: '/healthinformatics.jpg'
    },
    {
        _id: '127',
        code: 'HEA001',
        name: 'Health Care Aide',
        description: 'Entry-level healthcare program covering basic patient care, personal support, and health and safety procedures.',
        credits: 3,
        level: '1',
        difficulty: 'beginner',
        delivery: ['in-person'],
        language: 'english',
        school: {
            name: 'Seneca Polytechnic',
            shortName: 'Seneca'
        },
        programs: [{
            program: {
                name: 'Health & Wellness',
                code: 'HW'
            },
            semester: 1
        }],
        professors: [{
            name: 'Prof. Mary Thompson',
            rating: 4.1
        }],
        stats: {
            enrollmentCount: 145,
            rating: {
                average: 4.0,
                count: 83
            },
            materialCount: 12
        },
        imageUrl: '/healthaide.jpg'
    },
    {
        _id: '128',
        code: 'HIT001',
        name: 'Health Information Management',
        description: 'Program covering medical records management, health data analysis, and healthcare information systems.',
        credits: 5,
        level: '2',
        difficulty: 'intermediate',
        delivery: ['in-person', 'hybrid'],
        language: 'english',
        school: {
            name: 'Seneca Polytechnic',
            shortName: 'Seneca'
        },
        programs: [{
            program: {
                name: 'Health & Wellness',
                code: 'HW'
            },
            semester: 1
        }],
        professors: [{
            name: 'Prof. Jennifer Park',
            rating: 4.3
        }],
        stats: {
            enrollmentCount: 95,
            rating: {
                average: 4.2,
                count: 55
            },
            materialCount: 18
        },
        imageUrl: '/healthinfo.jpg'
    },
    {
        _id: '129',
        code: 'HOF001',
        name: 'Health Office Administration',
        description: 'Administrative program for healthcare settings covering medical office procedures, patient scheduling, and healthcare billing.',
        credits: 4,
        level: '2',
        difficulty: 'intermediate',
        delivery: ['in-person', 'hybrid'],
        language: 'english',
        school: {
            name: 'Seneca Polytechnic',
            shortName: 'Seneca'
        },
        programs: [{
            program: {
                name: 'Health & Wellness',
                code: 'HW'
            },
            semester: 1
        }],
        professors: [{
            name: 'Prof. Linda Davis',
            rating: 4.1
        }],
        stats: {
            enrollmentCount: 115,
            rating: {
                average: 4.0,
                count: 66
            },
            materialCount: 15
        },
        imageUrl: '/healthoffice.jpg'
    },
    {
        _id: '130',
        code: 'HSE001',
        name: 'Health, Safety & Environmental Compliance',
        description: 'Program covering workplace safety, environmental regulations, and occupational health and safety management.',
        credits: 5,
        level: '2',
        difficulty: 'intermediate',
        delivery: ['in-person', 'hybrid'],
        language: 'english',
        school: {
            name: 'Seneca Polytechnic',
            shortName: 'Seneca'
        },
        programs: [{
            program: {
                name: 'Health & Wellness',
                code: 'HW'
            },
            semester: 1
        }],
        professors: [{
            name: 'Prof. Robert Wilson',
            rating: 4.2
        }],
        stats: {
            enrollmentCount: 85,
            rating: {
                average: 4.1,
                count: 49
            },
            materialCount: 19
        },
        imageUrl: '/healthsafety.jpg'
    },
    {
        _id: '131',
        code: 'HVAC001',
        name: 'Heating, Ventilation & Air Conditioning Technician',
        description: 'Technical program covering HVAC systems installation, maintenance, refrigeration, and energy efficiency.',
        credits: 5,
        level: '2',
        difficulty: 'intermediate',
        delivery: ['in-person'],
        language: 'english',
        school: {
            name: 'Seneca Polytechnic',
            shortName: 'Seneca'
        },
        programs: [{
            program: {
                name: 'Engineering Technology',
                code: 'ENGR'
            },
            semester: 1
        }],
        professors: [{
            name: 'Prof. James Martinez',
            rating: 4.3
        }],
        stats: {
            enrollmentCount: 125,
            rating: {
                average: 4.2,
                count: 72
            },
            materialCount: 22
        },
        imageUrl: '/hvac.jpg'
    },
    {
        _id: '132',
        code: 'HVETT001',
        name: 'Heating, Ventilation & Air Conditioning Engineering Technology',
        description: 'Advanced HVAC engineering technology program covering system design, building automation, and energy management.',
        credits: 6,
        level: '3',
        difficulty: 'advanced',
        delivery: ['in-person'],
        language: 'english',
        school: {
            name: 'Seneca Polytechnic',
            shortName: 'Seneca'
        },
        programs: [{
            program: {
                name: 'Engineering Technology',
                code: 'ENGR'
            },
            semester: 1
        }],
        professors: [{
            name: 'Prof. Dr. Patricia Lee',
            rating: 4.4
        }],
        stats: {
            enrollmentCount: 75,
            rating: {
                average: 4.3,
                count: 43
            },
            materialCount: 26
        },
        imageUrl: '/hvactech.jpg'
    },
    {
        _id: '133',
        code: 'HOSP001',
        name: 'Hospitality – Hotel & Restaurant Operations',
        description: 'Hospitality program covering hotel management, restaurant operations, customer service, and hospitality industry practices.',
        credits: 5,
        level: '2',
        difficulty: 'intermediate',
        delivery: ['in-person', 'hybrid'],
        language: 'english',
        school: {
            name: 'Seneca Polytechnic',
            shortName: 'Seneca'
        },
        programs: [{
            program: {
                name: 'Hospitality & Tourism',
                code: 'HT'
            },
            semester: 1
        }],
        professors: [{
            name: 'Prof. Maria Santos',
            rating: 4.2
        }],
        stats: {
            enrollmentCount: 165,
            rating: {
                average: 4.1,
                count: 95
            },
            materialCount: 20
        },
        imageUrl: '/hospitality.jpg'
    },
    {
        _id: '134',
        code: 'HOSPM001',
        name: 'Hospitality Management',
        description: 'Management-focused hospitality program covering operations management, financial planning, and strategic hospitality planning.',
        credits: 6,
        level: '2',
        difficulty: 'intermediate',
        delivery: ['in-person', 'hybrid'],
        language: 'english',
        school: {
            name: 'Seneca Polytechnic',
            shortName: 'Seneca'
        },
        programs: [{
            program: {
                name: 'Hospitality & Tourism',
                code: 'HT'
            },
            semester: 1
        }],
        professors: [{
            name: 'Prof. Dr. Jennifer Chen',
            rating: 4.3
        }],
        stats: {
            enrollmentCount: 135,
            rating: {
                average: 4.2,
                count: 78
            },
            materialCount: 23
        },
        imageUrl: '/hospitalitymgmt.jpg'
    },
    {
        _id: '135',
        code: 'HRES001',
        name: 'Human Resources',
        description: 'Human resources program covering recruitment, employee relations, compensation management, and HR policies.',
        credits: 5,
        level: '2',
        difficulty: 'intermediate',
        delivery: ['in-person', 'online'],
        language: 'english',
        school: {
            name: 'Seneca Polytechnic',
            shortName: 'Seneca'
        },
        programs: [{
            program: {
                name: 'Business',
                code: 'BUS'
            },
            semester: 1
        }],
        professors: [{
            name: 'Prof. Rachel Brown',
            rating: 4.2
        }],
        stats: {
            enrollmentCount: 155,
            rating: {
                average: 4.1,
                count: 89
            },
            materialCount: 18
        },
        imageUrl: '/humanresources.jpg'
    },
    {
        _id: '136',
        code: 'HRESM001',
        name: 'Human Resources Management',
        description: 'Advanced human resources program focusing on strategic HR planning, organizational development, and leadership.',
        credits: 6,
        level: '2',
        difficulty: 'intermediate',
        delivery: ['in-person', 'hybrid'],
        language: 'english',
        school: {
            name: 'Seneca Polytechnic',
            shortName: 'Seneca'
        },
        programs: [{
            program: {
                name: 'Business',
                code: 'BUS'
            },
            semester: 1
        }],
        professors: [{
            name: 'Prof. Dr. David Kim',
            rating: 4.3
        }],
        stats: {
            enrollmentCount: 125,
            rating: {
                average: 4.2,
                count: 72
            },
            materialCount: 21
        },
        imageUrl: '/hrmgmt.jpg'
    },
    {
        _id: '137',
        code: 'HSSP001',
        name: 'Human Services – Gerontology',
        description: 'Program specializing in services for elderly populations, covering aging processes, elder care, and support services.',
        credits: 5,
        level: '2',
        difficulty: 'intermediate',
        delivery: ['in-person', 'hybrid'],
        language: 'english',
        school: {
            name: 'Seneca Polytechnic',
            shortName: 'Seneca'
        },
        programs: [{
            program: {
                name: 'Education, Community & Social Services',
                code: 'ECSS'
            },
            semester: 1
        }],
        professors: [{
            name: 'Prof. Dr. Margaret Wilson',
            rating: 4.1
        }],
        stats: {
            enrollmentCount: 75,
            rating: {
                average: 4.0,
                count: 43
            },
            materialCount: 16
        },
        imageUrl: '/gerontology.jpg'
    },
    {
        _id: '138',
        code: 'IBMF001',
        name: 'International Business Management – Finance',
        description: 'Specialized international business program focusing on global finance, foreign exchange, and international financial markets.',
        credits: 6,
        level: '2',
        difficulty: 'intermediate',
        delivery: ['in-person', 'hybrid'],
        language: 'english',
        school: {
            name: 'Seneca Polytechnic',
            shortName: 'Seneca'
        },
        programs: [{
            program: {
                name: 'Business',
                code: 'BUS'
            },
            semester: 1
        }],
        professors: [{
            name: 'Prof. Dr. Elena Petrov',
            rating: 4.4
        }],
        stats: {
            enrollmentCount: 105,
            rating: {
                average: 4.3,
                count: 61
            },
            materialCount: 24
        },
        imageUrl: '/intlbizfinance.jpg'
    },
    {
        _id: '139',
        code: 'IBMM001',
        name: 'International Business Management – Marketing',
        description: 'International business program specializing in global marketing strategies, cross-cultural marketing, and international trade.',
        credits: 6,
        level: '2',
        difficulty: 'intermediate',
        delivery: ['in-person', 'hybrid'],
        language: 'english',
        school: {
            name: 'Seneca Polytechnic',
            shortName: 'Seneca'
        },
        programs: [{
            program: {
                name: 'Business',
                code: 'BUS'
            },
            semester: 1
        }],
        professors: [{
            name: 'Prof. Dr. Maria Gonzalez',
            rating: 4.3
        }],
        stats: {
            enrollmentCount: 115,
            rating: {
                average: 4.2,
                count: 66
            },
            materialCount: 22
        },
        imageUrl: '/intlbizmktg.jpg'
    },
    {
        _id: '140',
        code: 'IBTO001',
        name: 'International Business – Trade & Operations',
        description: 'International business program covering global supply chains, import/export procedures, and international operations.',
        credits: 5,
        level: '2',
        difficulty: 'intermediate',
        delivery: ['in-person', 'hybrid'],
        language: 'english',
        school: {
            name: 'Seneca Polytechnic',
            shortName: 'Seneca'
        },
        programs: [{
            program: {
                name: 'Business',
                code: 'BUS'
            },
            semester: 1
        }],
        professors: [{
            name: 'Prof. Richard Park',
            rating: 4.2
        }],
        stats: {
            enrollmentCount: 95,
            rating: {
                average: 4.1,
                count: 55
            },
            materialCount: 19
        },
        imageUrl: '/tradeopns.jpg'
    },
    {
        _id: '141',
        code: 'IDTG001',
        name: 'Interior Decorating',
        description: 'Creative program in interior design covering space planning, color theory, furniture selection, and decorative elements.',
        credits: 4,
        level: '2',
        difficulty: 'intermediate',
        delivery: ['in-person', 'hybrid'],
        language: 'english',
        school: {
            name: 'Seneca Polytechnic',
            shortName: 'Seneca'
        },
        programs: [{
            program: {
                name: 'Creative Arts, Animation & Design',
                code: 'CAAD'
            },
            semester: 1
        }],
        professors: [{
            name: 'Prof. Sophie Turner',
            rating: 4.2
        }],
        stats: {
            enrollmentCount: 85,
            rating: {
                average: 4.1,
                count: 49
            },
            materialCount: 16
        },
        imageUrl: '/interiordecorating.jpg'
    },
    {
        _id: '142',
        code: 'IDAT001',
        name: 'Interactive Digital Animation',
        description: 'Animation program focusing on interactive media, digital storytelling, and animation for games and web applications.',
        credits: 6,
        level: '2',
        difficulty: 'intermediate',
        delivery: ['in-person'],
        language: 'english',
        school: {
            name: 'Seneca Polytechnic',
            shortName: 'Seneca'
        },
        programs: [{
            program: {
                name: 'Creative Arts, Animation & Design',
                code: 'CAAD'
            },
            semester: 1
        }],
        professors: [{
            name: 'Prof. Alex Kim',
            rating: 4.4
        }],
        stats: {
            enrollmentCount: 105,
            rating: {
                average: 4.3,
                count: 61
            },
            materialCount: 22
        },
        imageUrl: '/interactiveanimation.jpg'
    },
    {
        _id: '143',
        code: 'IMDG001',
        name: 'Interactive Media Design',
        description: 'Digital design program covering user interface design, user experience, web design, and interactive media creation.',
        credits: 5,
        level: '2',
        difficulty: 'intermediate',
        delivery: ['in-person', 'hybrid'],
        language: 'english',
        school: {
            name: 'Seneca Polytechnic',
            shortName: 'Seneca'
        },
        programs: [{
            program: {
                name: 'Creative Arts, Animation & Design',
                code: 'CAAD'
            },
            semester: 1
        }],
        professors: [{
            name: 'Prof. Dr. Ryan Mitchell',
            rating: 4.3
        }],
        stats: {
            enrollmentCount: 145,
            rating: {
                average: 4.2,
                count: 83
            },
            materialCount: 20
        },
        imageUrl: '/interactivemediadesign.jpg'
    },
    {
        _id: '144',
        code: 'IIT001',
        name: 'Internet of Things',
        description: 'Technology program covering IoT systems, sensor networks, embedded programming, and connected device development.',
        credits: 6,
        level: '2',
        difficulty: 'intermediate',
        delivery: ['in-person', 'online'],
        language: 'english',
        school: {
            name: 'Seneca Polytechnic',
            shortName: 'Seneca'
        },
        programs: [{
            program: {
                name: 'Information Technology',
                code: 'IT'
            },
            semester: 1
        }],
        professors: [{
            name: 'Prof. Dr. Kevin Zhang',
            rating: 4.5
        }],
        stats: {
            enrollmentCount: 95,
            rating: {
                average: 4.4,
                count: 55
            },
            materialCount: 28
        },
        imageUrl: '/iot.jpg'
    },
    {
        _id: '145',
        code: 'JOUR001',
        name: 'Journalism',
        description: 'Media program covering news writing, investigative reporting, digital journalism, and media ethics.',
        credits: 5,
        level: '2',
        difficulty: 'intermediate',
        delivery: ['in-person', 'hybrid'],
        language: 'english',
        school: {
            name: 'Seneca Polytechnic',
            shortName: 'Seneca'
        },
        programs: [{
            program: {
                name: 'Media & Communications',
                code: 'MCOM'
            },
            semester: 1
        }],
        professors: [{
            name: 'Prof. Jennifer Brown',
            rating: 4.3
        }],
        stats: {
            enrollmentCount: 125,
            rating: {
                average: 4.2,
                count: 72
            },
            materialCount: 19
        },
        imageUrl: '/journalism.jpg'
    },
    {
        _id: '146',
        code: 'JEWL001',
        name: 'Jewellery Essentials',
        description: 'Creative program in jewelry making covering basic metalworking, stone setting, design principles, and jewelry repair.',
        credits: 3,
        level: '2',
        difficulty: 'intermediate',
        delivery: ['in-person'],
        language: 'english',
        school: {
            name: 'Seneca Polytechnic',
            shortName: 'Seneca'
        },
        programs: [{
            program: {
                name: 'Creative Arts, Animation & Design',
                code: 'CAAD'
            },
            semester: 1
        }],
        professors: [{
            name: 'Prof. Isabella Martinez',
            rating: 4.1
        }],
        stats: {
            enrollmentCount: 45,
            rating: {
                average: 4.0,
                count: 26
            },
            materialCount: 12
        },
        imageUrl: '/jewellery.jpg'
    },
    {
        _id: '147',
        code: 'LAWS001',
        name: 'Law & Security Administration',
        description: 'Program covering legal procedures, security operations, court administration, and law enforcement support.',
        credits: 5,
        level: '2',
        difficulty: 'intermediate',
        delivery: ['in-person', 'hybrid'],
        language: 'english',
        school: {
            name: 'Seneca Polytechnic',
            shortName: 'Seneca'
        },
        programs: [{
            program: {
                name: 'Law, Administration & Public Safety',
                code: 'LAPS'
            },
            semester: 1
        }],
        professors: [{
            name: 'Prof. Dr. James Wilson',
            rating: 4.3
        }],
        stats: {
            enrollmentCount: 105,
            rating: {
                average: 4.2,
                count: 61
            },
            materialCount: 20
        },
        imageUrl: '/lawsecurity.jpg'
    },
    {
        _id: '148',
        code: 'LAWC001',
        name: 'Law Clerk',
        description: 'Legal support program covering legal research, document preparation, court procedures, and client services.',
        credits: 6,
        level: '2',
        difficulty: 'intermediate',
        delivery: ['in-person', 'hybrid'],
        language: 'english',
        school: {
            name: 'Seneca Polytechnic',
            shortName: 'Seneca'
        },
        programs: [{
            program: {
                name: 'Law, Administration & Public Safety',
                code: 'LAPS'
            },
            semester: 1
        }],
        professors: [{
            name: 'Prof. Patricia Kim',
            rating: 4.4
        }],
        stats: {
            enrollmentCount: 135,
            rating: {
                average: 4.3,
                count: 78
            },
            materialCount: 24
        },
        imageUrl: '/lawclerk.jpg'
    },
    {
        _id: '149',
        code: 'LIBR001',
        name: 'Library & Information Technician',
        description: 'Information sciences program covering library operations, cataloging, information retrieval, and digital resources management.',
        credits: 5,
        level: '2',
        difficulty: 'intermediate',
        delivery: ['in-person', 'online'],
        language: 'english',
        school: {
            name: 'Seneca Polytechnic',
            shortName: 'Seneca'
        },
        programs: [{
            program: {
                name: 'Liberal Arts & University Transfers',
                code: 'LAUT'
            },
            semester: 1
        }],
        professors: [{
            name: 'Prof. Susan Miller',
            rating: 4.1
        }],
        stats: {
            enrollmentCount: 65,
            rating: {
                average: 4.0,
                count: 37
            },
            materialCount: 16
        },
        imageUrl: '/library.jpg'
    },
    {
        _id: '150',
        code: 'MKTG001',
        name: 'Marketing & Communications Strategy',
        description: 'Comprehensive marketing program covering consumer behavior, advertising, digital marketing, and market research.',
        credits: 5,
        level: '2',
        difficulty: 'intermediate',
        delivery: ['in-person', 'online'],
        language: 'english',
        school: {
            name: 'Seneca Polytechnic',
            shortName: 'Seneca'
        },
        programs: [{
            program: {
                name: 'Business',
                code: 'BUS'
            },
            semester: 1
        }],
        professors: [{
            name: 'Prof. Dr. Sarah Kim',
            rating: 4.3
        }],
        stats: {
            enrollmentCount: 185,
            rating: {
                average: 4.2,
                count: 108
            },
            materialCount: 21
        },
        imageUrl: '/marketing.jpg'
    },
    {
        _id: '151',
        code: 'MKTGM001',
        name: 'Marketing Management',
        description: 'Advanced marketing program focusing on strategic marketing planning, brand management, and marketing leadership.',
        credits: 6,
        level: '2',
        difficulty: 'intermediate',
        delivery: ['in-person', 'hybrid'],
        language: 'english',
        school: {
            name: 'Seneca Polytechnic',
            shortName: 'Seneca'
        },
        programs: [{
            program: {
                name: 'Business',
                code: 'BUS'
            },
            semester: 1
        }],
        professors: [{
            name: 'Prof. Dr. Michelle Wong',
            rating: 4.4
        }],
        stats: {
            enrollmentCount: 155,
            rating: {
                average: 4.3,
                count: 89
            },
            materialCount: 25
        },
        imageUrl: '/marketingmgmt.jpg'
    },
    {
        _id: '152',
        code: 'MAIDD001',
        name: 'Master of Artificial Intelligence Design & Development',
        description: 'Graduate program in AI covering machine learning, neural networks, AI system design, and ethical AI development.',
        credits: 10,
        level: '5',
        difficulty: 'advanced',
        delivery: ['in-person', 'online'],
        language: 'english',
        school: {
            name: 'Seneca Polytechnic',
            shortName: 'Seneca'
        },
        programs: [{
            program: {
                name: 'Information Technology',
                code: 'IT'
            },
            semester: 1
        }],
        professors: [{
            name: 'Prof. Dr. Angela Chen',
            rating: 4.7
        }],
        stats: {
            enrollmentCount: 85,
            rating: {
                average: 4.6,
                count: 49
            },
            materialCount: 45
        },
        imageUrl: '/masterai.jpg'
    },
    {
        _id: '153',
        code: 'METT001',
        name: 'Mechanical Engineering Technician (Tool Design)',
        description: 'Technical program specializing in tool and die design, precision manufacturing, and mechanical design principles.',
        credits: 5,
        level: '2',
        difficulty: 'intermediate',
        delivery: ['in-person'],
        language: 'english',
        school: {
            name: 'Seneca Polytechnic',
            shortName: 'Seneca'
        },
        programs: [{
            program: {
                name: 'Engineering Technology',
                code: 'ENGR'
            },
            semester: 1
        }],
        professors: [{
            name: 'Prof. Robert Johnson',
            rating: 4.3
        }],
        stats: {
            enrollmentCount: 95,
            rating: {
                average: 4.2,
                count: 55
            },
            materialCount: 28
        },
        imageUrl: '/mechanicaltool.jpg'
    },
    {
        _id: '154',
        code: 'METBS001',
        name: 'Mechanical Engineering Technology – Building Sciences',
        description: 'Engineering technology program focusing on building systems, HVAC design, energy efficiency, and building automation.',
        credits: 6,
        level: '3',
        difficulty: 'advanced',
        delivery: ['in-person'],
        language: 'english',
        school: {
            name: 'Seneca Polytechnic',
            shortName: 'Seneca'
        },
        programs: [{
            program: {
                name: 'Engineering Technology',
                code: 'ENGR'
            },
            semester: 1
        }],
        professors: [{
            name: 'Prof. Dr. Patricia Lee',
            rating: 4.4
        }],
        stats: {
            enrollmentCount: 75,
            rating: {
                average: 4.3,
                count: 43
            },
            materialCount: 30
        },
        imageUrl: '/mechbuilding.jpg'
    },
    {
        _id: '155',
        code: 'METID001',
        name: 'Mechanical Engineering Technology – Industrial Design',
        description: 'Engineering technology program combining mechanical principles with industrial design, product development, and manufacturing.',
        credits: 6,
        level: '3',
        difficulty: 'advanced',
        delivery: ['in-person'],
        language: 'english',
        school: {
            name: 'Seneca Polytechnic',
            shortName: 'Seneca'
        },
        programs: [{
            program: {
                name: 'Engineering Technology',
                code: 'ENGR'
            },
            semester: 1
        }],
        professors: [{
            name: 'Prof. Dr. David Thompson',
            rating: 4.3
        }],
        stats: {
            enrollmentCount: 85,
            rating: {
                average: 4.2,
                count: 49
            },
            materialCount: 32
        },
        imageUrl: '/mechindustrial.jpg'
    },
    {
        _id: '156',
        code: 'MTCNC001',
        name: 'Mechanical Technician – CNC Programming',
        description: 'Technical program specializing in computer numerical control programming, precision machining, and automated manufacturing.',
        credits: 5,
        level: '2',
        difficulty: 'intermediate',
        delivery: ['in-person'],
        language: 'english',
        school: {
            name: 'Seneca Polytechnic',
            shortName: 'Seneca'
        },
        programs: [{
            program: {
                name: 'Engineering Technology',
                code: 'ENGR'
            },
            semester: 1
        }],
        professors: [{
            name: 'Prof. James Martinez',
            rating: 4.2
        }],
        stats: {
            enrollmentCount: 105,
            rating: {
                average: 4.1,
                count: 61
            },
            materialCount: 24
        },
        imageUrl: '/cnc.jpg'
    },
    {
        _id: '157',
        code: 'MENA001',
        name: 'Medical Esthetics Nursing',
        description: 'Specialized nursing program covering cosmetic procedures, dermatological treatments, and aesthetic patient care.',
        credits: 4,
        level: '3',
        difficulty: 'advanced',
        delivery: ['in-person'],
        language: 'english',
        school: {
            name: 'Seneca Polytechnic',
            shortName: 'Seneca'
        },
        programs: [{
            program: {
                name: 'Health & Wellness',
                code: 'HW'
            },
            semester: 1
        }],
        professors: [{
            name: 'Prof. Dr. Lisa Johnson',
            rating: 4.4
        }],
        stats: {
            enrollmentCount: 55,
            rating: {
                average: 4.3,
                count: 32
            },
            materialCount: 18
        },
        imageUrl: '/medicalesthetics.jpg'
    },
    {
        _id: '158',
        code: 'MHI001',
        name: 'Mental Health Intervention',
        description: 'Mental health program covering crisis intervention, counseling techniques, and mental health support services.',
        credits: 5,
        level: '2',
        difficulty: 'intermediate',
        delivery: ['in-person', 'hybrid'],
        language: 'english',
        school: {
            name: 'Seneca Polytechnic',
            shortName: 'Seneca'
        },
        programs: [{
            program: {
                name: 'Health & Wellness',
                code: 'HW'
            },
            semester: 1
        }],
        professors: [{
            name: 'Prof. Dr. Rachel Green',
            rating: 4.3
        }],
        stats: {
            enrollmentCount: 95,
            rating: {
                average: 4.2,
                count: 55
            },
            materialCount: 20
        },
        imageUrl: '/mentalhealth.jpg'
    },
    {
        _id: '159',
        code: 'NPSM001',
        name: 'Non-Profit & Social Sector Management',
        description: 'Management program for non-profit organizations covering fundraising, volunteer management, and social impact measurement.',
        credits: 6,
        level: '2',
        difficulty: 'intermediate',
        delivery: ['in-person', 'hybrid'],
        language: 'english',
        school: {
            name: 'Seneca Polytechnic',
            shortName: 'Seneca'
        },
        programs: [{
            program: {
                name: 'Education, Community & Social Services',
                code: 'ECSS'
            },
            semester: 1
        }],
        professors: [{
            name: 'Prof. Dr. Margaret Wilson',
            rating: 4.2
        }],
        stats: {
            enrollmentCount: 75,
            rating: {
                average: 4.1,
                count: 43
            },
            materialCount: 22
        },
        imageUrl: '/nonprofit.jpg'
    },
    {
        _id: '160',
        code: 'OTAPA001',
        name: 'Occupational Therapist Assistant and Physiotherapist Assistant',
        description: 'Healthcare program training assistants for occupational therapy and physiotherapy services and patient rehabilitation.',
        credits: 6,
        level: '2',
        difficulty: 'intermediate',
        delivery: ['in-person'],
        language: 'english',
        school: {
            name: 'Seneca Polytechnic',
            shortName: 'Seneca'
        },
        programs: [{
            program: {
                name: 'Health & Wellness',
                code: 'HW'
            },
            semester: 1
        }],
        professors: [{
            name: 'Prof. Dr. Patricia Kim',
            rating: 4.4
        }],
        stats: {
            enrollmentCount: 85,
            rating: {
                average: 4.3,
                count: 49
            },
            materialCount: 26
        },
        imageUrl: '/otpta.jpg'
    },
    {
        _id: '161',
        code: 'OAEX001',
        name: 'Office Administration – Executive',
        description: 'Advanced office administration program covering executive support, project coordination, and administrative leadership.',
        credits: 5,
        level: '2',
        difficulty: 'intermediate',
        delivery: ['in-person', 'hybrid'],
        language: 'english',
        school: {
            name: 'Seneca Polytechnic',
            shortName: 'Seneca'
        },
        programs: [{
            program: {
                name: 'Business',
                code: 'BUS'
            },
            semester: 1
        }],
        professors: [{
            name: 'Prof. Linda Davis',
            rating: 4.1
        }],
        stats: {
            enrollmentCount: 125,
            rating: {
                average: 4.0,
                count: 72
            },
            materialCount: 18
        },
        imageUrl: '/officeexec.jpg'
    },
    {
        _id: '162',
        code: 'OAHS001',
        name: 'Office Administration – Health Services',
        description: 'Office administration program specializing in healthcare settings, medical terminology, and health information management.',
        credits: 5,
        level: '2',
        difficulty: 'intermediate',
        delivery: ['in-person', 'hybrid'],
        language: 'english',
        school: {
            name: 'Seneca Polytechnic',
            shortName: 'Seneca'
        },
        programs: [{
            program: {
                name: 'Health & Wellness',
                code: 'HW'
            },
            semester: 1
        }],
        professors: [{
            name: 'Prof. Jennifer Park',
            rating: 4.2
        }],
        stats: {
            enrollmentCount: 105,
            rating: {
                average: 4.1,
                count: 61
            },
            materialCount: 16
        },
        imageUrl: '/officehealth.jpg'
    },
    {
        _id: '163',
        code: 'OALG001',
        name: 'Office Administration – Legal',
        description: 'Office administration program for legal environments covering legal documentation, court procedures, and legal support services.',
        credits: 5,
        level: '2',
        difficulty: 'intermediate',
        delivery: ['in-person', 'hybrid'],
        language: 'english',
        school: {
            name: 'Seneca Polytechnic',
            shortName: 'Seneca'
        },
        programs: [{
            program: {
                name: 'Law, Administration & Public Safety',
                code: 'LAPS'
            },
            semester: 1
        }],
        professors: [{
            name: 'Prof. Patricia Kim',
            rating: 4.3
        }],
        stats: {
            enrollmentCount: 95,
            rating: {
                average: 4.2,
                count: 55
            },
            materialCount: 19
        },
        imageUrl: '/officelegal.jpg'
    },
    {
        _id: '164',
        code: 'OPT001',
        name: 'Opticianry',
        description: 'Healthcare program training optical professionals in eyewear fitting, lens grinding, and optical equipment operation.',
        credits: 6,
        level: '2',
        difficulty: 'intermediate',
        delivery: ['in-person'],
        language: 'english',
        school: {
            name: 'Seneca Polytechnic',
            shortName: 'Seneca'
        },
        programs: [{
            program: {
                name: 'Health & Wellness',
                code: 'HW'
            },
            semester: 1
        }],
        professors: [{
            name: 'Prof. Dr. Thomas Anderson',
            rating: 4.3
        }],
        stats: {
            enrollmentCount: 65,
            rating: {
                average: 4.2,
                count: 37
            },
            materialCount: 22
        },
        imageUrl: '/opticianry.jpg'
    },
    {
        _id: '165',
        code: 'PARA001',
        name: 'Paralegal',
        description: 'Legal program covering paralegal practice, legal research, litigation support, and client services in various legal areas.',
        credits: 6,
        level: '2',
        difficulty: 'intermediate',
        delivery: ['in-person', 'hybrid'],
        language: 'english',
        school: {
            name: 'Seneca Polytechnic',
            shortName: 'Seneca'
        },
        programs: [{
            program: {
                name: 'Law, Administration & Public Safety',
                code: 'LAPS'
            },
            semester: 1
        }],
        professors: [{
            name: 'Prof. Dr. James Wilson',
            rating: 4.4
        }],
        stats: {
            enrollmentCount: 145,
            rating: {
                average: 4.3,
                count: 83
            },
            materialCount: 28
        },
        imageUrl: '/paralegal.jpg'
    },
    {
        _id: '166',
        code: 'PARAA001',
        name: 'Paralegal (Accelerated)',
        description: 'Accelerated paralegal program for students with prior legal education or experience, covering advanced paralegal practice.',
        credits: 4,
        level: '2',
        difficulty: 'intermediate',
        delivery: ['in-person', 'hybrid'],
        language: 'english',
        school: {
            name: 'Seneca Polytechnic',
            shortName: 'Seneca'
        },
        programs: [{
            program: {
                name: 'Law, Administration & Public Safety',
                code: 'LAPS'
            },
            semester: 1
        }],
        professors: [{
            name: 'Prof. Dr. Patricia Wilson',
            rating: 4.3
        }],
        stats: {
            enrollmentCount: 85,
            rating: {
                average: 4.2,
                count: 49
            },
            materialCount: 24
        },
        imageUrl: '/paralegalaccel.jpg'
    },
    {
        _id: '167',
        code: 'PSW001',
        name: 'Personal Support Worker',
        description: 'Healthcare program training personal support workers in patient care, daily living assistance, and health monitoring.',
        credits: 3,
        level: '1',
        difficulty: 'beginner',
        delivery: ['in-person'],
        language: 'english',
        school: {
            name: 'Seneca Polytechnic',
            shortName: 'Seneca'
        },
        programs: [{
            program: {
                name: 'Health & Wellness',
                code: 'HW'
            },
            semester: 1
        }],
        professors: [{
            name: 'Prof. Mary Thompson',
            rating: 4.1
        }],
        stats: {
            enrollmentCount: 185,
            rating: {
                average: 4.0,
                count: 108
            },
            materialCount: 14
        },
        imageUrl: '/psw.jpg'
    },
    {
        _id: '168',
        code: 'PRAQ001',
        name: 'Pharmaceutical Regulatory Affairs & Quality Operations',
        description: 'Specialized program covering pharmaceutical regulations, quality assurance, drug development processes, and regulatory compliance.',
        credits: 6,
        level: '3',
        difficulty: 'advanced',
        delivery: ['in-person', 'hybrid'],
        language: 'english',
        school: {
            name: 'Seneca Polytechnic',
            shortName: 'Seneca'
        },
        programs: [{
            program: {
                name: 'Science',
                code: 'SCI'
            },
            semester: 1
        }],
        professors: [{
            name: 'Prof. Dr. Susan Rodriguez',
            rating: 4.5
        }],
        stats: {
            enrollmentCount: 75,
            rating: {
                average: 4.4,
                count: 43
            },
            materialCount: 30
        },
        imageUrl: '/pharmaceutical.jpg'
    },
    {
        _id: '169',
        code: 'PF001',
        name: 'Police Foundations',
        description: 'Law enforcement preparation program covering criminal law, investigation techniques, community policing, and police procedures.',
        credits: 5,
        level: '2',
        difficulty: 'intermediate',
        delivery: ['in-person'],
        language: 'english',
        school: {
            name: 'Seneca Polytechnic',
            shortName: 'Seneca'
        },
        programs: [{
            program: {
                name: 'Law, Administration & Public Safety',
                code: 'LAPS'
            },
            semester: 1
        }],
        professors: [{
            name: 'Prof. Captain Robert Johnson',
            rating: 4.2
        }],
        stats: {
            enrollmentCount: 165,
            rating: {
                average: 4.1,
                count: 95
            },
            materialCount: 24
        },
        imageUrl: '/police.jpg'
    },
    {
        _id: '170',
        code: 'PN001',
        name: 'Practical Nursing',
        description: 'Nursing program preparing practical nurses for patient care, medication administration, and healthcare support services.',
        credits: 6,
        level: '2',
        difficulty: 'intermediate',
        delivery: ['in-person'],
        language: 'english',
        school: {
            name: 'Seneca Polytechnic',
            shortName: 'Seneca'
        },
        programs: [{
            program: {
                name: 'Health & Wellness',
                code: 'HW'
            },
            semester: 1
        }],
        professors: [{
            name: 'Prof. Dr. Lisa Johnson',
            rating: 4.4
        }],
        stats: {
            enrollmentCount: 205,
            rating: {
                average: 4.3,
                count: 118
            },
            materialCount: 32
        },
        imageUrl: '/practicalnursing.jpg'
    },
    {
        _id: '171',
        code: 'PREB001',
        name: 'Pre-Business',
        description: 'Preparatory program for business studies covering basic business concepts, mathematics, and communication skills.',
        credits: 3,
        level: '1',
        difficulty: 'beginner',
        delivery: ['in-person', 'online'],
        language: 'english',
        school: {
            name: 'Seneca Polytechnic',
            shortName: 'Seneca'
        },
        programs: [{
            program: {
                name: 'Business',
                code: 'BUS'
            },
            semester: 1
        }],
        professors: [{
            name: 'Prof. Jennifer Adams',
            rating: 3.9
        }],
        stats: {
            enrollmentCount: 155,
            rating: {
                average: 3.8,
                count: 89
            },
            materialCount: 10
        },
        imageUrl: '/prebusiness.jpg'
    },
    {
        _id: '172',
        code: 'PREH001',
        name: 'Pre-Health Sciences Pathway to Advanced Diplomas & Degrees',
        description: 'Preparatory program for health sciences covering biology, chemistry, anatomy, and academic skills for health programs.',
        credits: 4,
        level: '1',
        difficulty: 'beginner',
        delivery: ['in-person', 'online'],
        language: 'english',
        school: {
            name: 'Seneca Polytechnic',
            shortName: 'Seneca'
        },
        programs: [{
            program: {
                name: 'Health & Wellness',
                code: 'HW'
            },
            semester: 1
        }],
        professors: [{
            name: 'Prof. Dr. Thomas Anderson',
            rating: 4.1
        }],
        stats: {
            enrollmentCount: 185,
            rating: {
                average: 4.0,
                count: 108
            },
            materialCount: 16
        },
        imageUrl: '/prehealth.jpg'
    },
    {
        _id: '173',
        code: 'PAP001',
        name: 'Professional Accounting Practice',
        description: 'Advanced accounting program covering professional accounting standards, auditing, taxation, and financial reporting.',
        credits: 6,
        level: '3',
        difficulty: 'advanced',
        delivery: ['in-person', 'hybrid'],
        language: 'english',
        school: {
            name: 'Seneca Polytechnic',
            shortName: 'Seneca'
        },
        programs: [{
            program: {
                name: 'Business',
                code: 'BUS'
            },
            semester: 1
        }],
        professors: [{
            name: 'Prof. Dr. David Thompson',
            rating: 4.4
        }],
        stats: {
            enrollmentCount: 125,
            rating: {
                average: 4.3,
                count: 72
            },
            materialCount: 28
        },
        imageUrl: '/profaccounting.jpg'
    },
    {
        _id: '174',
        code: 'PS001',
        name: 'Professional Selling',
        description: 'Sales program covering sales techniques, customer relationship management, negotiation skills, and sales management.',
        credits: 5,
        level: '2',
        difficulty: 'intermediate',
        delivery: ['in-person', 'hybrid'],
        language: 'english',
        school: {
            name: 'Seneca Polytechnic',
            shortName: 'Seneca'
        },
        programs: [{
            program: {
                name: 'Business',
                code: 'BUS'
            },
            semester: 1
        }],
        professors: [{
            name: 'Prof. Richard Park',
            rating: 4.2
        }],
        stats: {
            enrollmentCount: 105,
            rating: {
                average: 4.1,
                count: 61
            },
            materialCount: 19
        },
        imageUrl: '/professionalselling.jpg'
    },
    {
        _id: '175',
        code: 'PME001',
        name: 'Project Management – Environmental',
        description: 'Project management program specializing in environmental projects, sustainability initiatives, and environmental compliance.',
        credits: 6,
        level: '2',
        difficulty: 'intermediate',
        delivery: ['in-person', 'hybrid'],
        language: 'english',
        school: {
            name: 'Seneca Polytechnic',
            shortName: 'Seneca'
        },
        programs: [{
            program: {
                name: 'Science',
                code: 'SCI'
            },
            semester: 1
        }],
        professors: [{
            name: 'Prof. Dr. Sarah Kim',
            rating: 4.3
        }],
        stats: {
            enrollmentCount: 85,
            rating: {
                average: 4.2,
                count: 49
            },
            materialCount: 24
        },
        imageUrl: '/pmenvironmental.jpg'
    },
    {
        _id: '176',
        code: 'PMIT001',
        name: 'Project Management – Information Technology',
        description: 'Project management program focusing on IT projects, software development lifecycle, and technology implementation.',
        credits: 6,
        level: '2',
        difficulty: 'intermediate',
        delivery: ['in-person', 'online'],
        language: 'english',
        school: {
            name: 'Seneca Polytechnic',
            shortName: 'Seneca'
        },
        programs: [{
            program: {
                name: 'Information Technology',
                code: 'IT'
            },
            semester: 1
        }],
        professors: [{
            name: 'Prof. Dr. Kevin Zhang',
            rating: 4.4
        }],
        stats: {
            enrollmentCount: 115,
            rating: {
                average: 4.3,
                count: 66
            },
            materialCount: 26
        },
        imageUrl: '/pmit.jpg'
    },
    {
        _id: '177',
        code: 'PA001',
        name: 'Public Administration',
        description: 'Program covering government operations, public policy, municipal administration, and public sector management.',
        credits: 6,
        level: '2',
        difficulty: 'intermediate',
        delivery: ['in-person', 'hybrid'],
        language: 'english',
        school: {
            name: 'Seneca Polytechnic',
            shortName: 'Seneca'
        },
        programs: [{
            program: {
                name: 'Law, Administration & Public Safety',
                code: 'LAPS'
            },
            semester: 1
        }],
        professors: [{
            name: 'Prof. Dr. Patricia Wilson',
            rating: 4.2
        }],
        stats: {
            enrollmentCount: 95,
            rating: {
                average: 4.1,
                count: 55
            },
            materialCount: 22
        },
        imageUrl: '/publicadmin.jpg'
    },
    {
        _id: '178',
        code: 'PRCC001',
        name: 'Public Relations – Corporate Communications',
        description: 'Communications program covering public relations strategy, corporate communications, media relations, and crisis communication.',
        credits: 5,
        level: '2',
        difficulty: 'intermediate',
        delivery: ['in-person', 'hybrid'],
        language: 'english',
        school: {
            name: 'Seneca Polytechnic',
            shortName: 'Seneca'
        },
        programs: [{
            program: {
                name: 'Media & Communications',
                code: 'MCOM'
            },
            semester: 1
        }],
        professors: [{
            name: 'Prof. Dr. Jennifer Brown',
            rating: 4.3
        }],
        stats: {
            enrollmentCount: 125,
            rating: {
                average: 4.2,
                count: 72
            },
            materialCount: 21
        },
        imageUrl: '/publicrelations.jpg'
    },
    {
        _id: '179',
        code: 'RPAA001',
        name: 'Real Property Administration (Assessment & Appraisal)',
        description: 'Property program covering real estate assessment, property appraisal, municipal assessment, and property valuation.',
        credits: 6,
        level: '2',
        difficulty: 'intermediate',
        delivery: ['in-person', 'hybrid'],
        language: 'english',
        school: {
            name: 'Seneca Polytechnic',
            shortName: 'Seneca'
        },
        programs: [{
            program: {
                name: 'Business',
                code: 'BUS'
            },
            semester: 1
        }],
        professors: [{
            name: 'Prof. Daniel Wilson',
            rating: 4.2
        }],
        stats: {
            enrollmentCount: 75,
            rating: {
                average: 4.1,
                count: 43
            },
            materialCount: 20
        },
        imageUrl: '/realproperty.jpg'
    },
    {
        _id: '180',
        code: 'RPAAA001',
        name: 'Real Property Administration (Assessment & Appraisal) (Accelerated)',
        description: 'Accelerated property program for experienced professionals in real estate assessment and property appraisal.',
        credits: 4,
        level: '2',
        difficulty: 'intermediate',
        delivery: ['in-person', 'hybrid'],
        language: 'english',
        school: {
            name: 'Seneca Polytechnic',
            shortName: 'Seneca'
        },
        programs: [{
            program: {
                name: 'Business',
                code: 'BUS'
            },
            semester: 1
        }],
        professors: [{
            name: 'Prof. Michelle Wong',
            rating: 4.1
        }],
        stats: {
            enrollmentCount: 45,
            rating: {
                average: 4.0,
                count: 26
            },
            materialCount: 16
        },
        imageUrl: '/realpropertyaccel.jpg'
    },
    {
        _id: '181',
        code: 'SSW001',
        name: 'Social Service Worker',
        description: 'Social work program covering counseling skills, community services, social advocacy, and client support services.',
        credits: 6,
        level: '2',
        difficulty: 'intermediate',
        delivery: ['in-person', 'hybrid'],
        language: 'english',
        school: {
            name: 'Seneca Polytechnic',
            shortName: 'Seneca'
        },
        programs: [{
            program: {
                name: 'Education, Community & Social Services',
                code: 'ECSS'
            },
            semester: 1
        }],
        professors: [{
            name: 'Prof. Dr. Rachel Green',
            rating: 4.3
        }],
        stats: {
            enrollmentCount: 145,
            rating: {
                average: 4.2,
                count: 83
            },
            materialCount: 24
        },
        imageUrl: '/socialservice.jpg'
    },
    {
        _id: '182',
        code: 'SSWA001',
        name: 'Social Service Worker (Accelerated)',
        description: 'Accelerated social service program for students with previous experience in social services or related fields.',
        credits: 4,
        level: '2',
        difficulty: 'intermediate',
        delivery: ['in-person', 'hybrid'],
        language: 'english',
        school: {
            name: 'Seneca Polytechnic',
            shortName: 'Seneca'
        },
        programs: [{
            program: {
                name: 'Education, Community & Social Services',
                code: 'ECSS'
            },
            semester: 1
        }],
        professors: [{
            name: 'Prof. Dr. Karen Mitchell',
            rating: 4.2
        }],
        stats: {
            enrollmentCount: 85,
            rating: {
                average: 4.1,
                count: 49
            },
            materialCount: 20
        },
        imageUrl: '/socialserviceaccel.jpg'
    },
    {
        _id: '183',
        code: 'SSWG001',
        name: 'Social Service Worker – Gerontology',
        description: 'Social service program specializing in services for elderly populations, covering aging processes and elder care.',
        credits: 6,
        level: '2',
        difficulty: 'intermediate',
        delivery: ['in-person', 'hybrid'],
        language: 'english',
        school: {
            name: 'Seneca Polytechnic',
            shortName: 'Seneca'
        },
        programs: [{
            program: {
                name: 'Education, Community & Social Services',
                code: 'ECSS'
            },
            semester: 1
        }],
        professors: [{
            name: 'Prof. Dr. Margaret Wilson',
            rating: 4.1
        }],
        stats: {
            enrollmentCount: 75,
            rating: {
                average: 4.0,
                count: 43
            },
            materialCount: 22
        },
        imageUrl: '/socialgerontology.jpg'
    },
    {
        _id: '184',
        code: 'SSWIR001',
        name: 'Social Service Worker – Immigrants and Refugees',
        description: 'Social service program specializing in services for immigrants and refugees, covering settlement and integration services.',
        credits: 6,
        level: '2',
        difficulty: 'intermediate',
        delivery: ['in-person', 'hybrid'],
        language: 'english',
        school: {
            name: 'Seneca Polytechnic',
            shortName: 'Seneca'
        },
        programs: [{
            program: {
                name: 'Education, Community & Social Services',
                code: 'ECSS'
            },
            semester: 1
        }],
        professors: [{
            name: 'Prof. Dr. Elena Petrov',
            rating: 4.2
        }],
        stats: {
            enrollmentCount: 95,
            rating: {
                average: 4.1,
                count: 55
            },
            materialCount: 26
        },
        imageUrl: '/socialimmigrants.jpg'
    },
    {
        _id: '185',
        code: 'SSWIRA001',
        name: 'Social Service Worker – Immigrants and Refugees (Accelerated)',
        description: 'Accelerated program for social services with immigrants and refugees, for experienced practitioners.',
        credits: 4,
        level: '2',
        difficulty: 'intermediate',
        delivery: ['in-person', 'hybrid'],
        language: 'english',
        school: {
            name: 'Seneca Polytechnic',
            shortName: 'Seneca'
        },
        programs: [{
            program: {
                name: 'Education, Community & Social Services',
                code: 'ECSS'
            },
            semester: 1
        }],
        professors: [{
            name: 'Prof. Maria Gonzalez',
            rating: 4.1
        }],
        stats: {
            enrollmentCount: 65,
            rating: {
                average: 4.0,
                count: 37
            },
            materialCount: 22
        },
        imageUrl: '/socialimmigrantsaccel.jpg'
    },
    {
        _id: '186',
        code: 'SEEM001',
        name: 'Sports, Entertainment & Event Marketing',
        description: 'Marketing program specializing in sports and entertainment industries, covering event management and sports marketing.',
        credits: 5,
        level: '2',
        difficulty: 'intermediate',
        delivery: ['in-person', 'hybrid'],
        language: 'english',
        school: {
            name: 'Seneca Polytechnic',
            shortName: 'Seneca'
        },
        programs: [{
            program: {
                name: 'Business',
                code: 'BUS'
            },
            semester: 1
        }],
        professors: [{
            name: 'Prof. Alex Kim',
            rating: 4.3
        }],
        stats: {
            enrollmentCount: 115,
            rating: {
                average: 4.2,
                count: 66
            },
            materialCount: 20
        },
        imageUrl: '/sportsmarketing.jpg'
    },
    {
        _id: '187',
        code: 'SCMGL001',
        name: 'Supply Chain Management – Global Logistics',
        description: 'Supply chain program specializing in global logistics, international shipping, and supply chain optimization.',
        credits: 6,
        level: '2',
        difficulty: 'intermediate',
        delivery: ['in-person', 'hybrid'],
        language: 'english',
        school: {
            name: 'Seneca Polytechnic',
            shortName: 'Seneca'
        },
        programs: [{
            program: {
                name: 'Business',
                code: 'BUS'
            },
            semester: 1
        }],
        professors: [{
            name: 'Prof. Dr. Richard Park',
            rating: 4.4
        }],
        stats: {
            enrollmentCount: 105,
            rating: {
                average: 4.3,
                count: 61
            },
            materialCount: 25
        },
        imageUrl: '/supplychain.jpg'
    },
    {
        _id: '188',
        code: 'SBM001',
        name: 'Sustainable Business Management',
        description: 'Business program focusing on sustainability, environmental responsibility, and sustainable business practices.',
        credits: 6,
        level: '2',
        difficulty: 'intermediate',
        delivery: ['in-person', 'hybrid'],
        language: 'english',
        school: {
            name: 'Seneca Polytechnic',
            shortName: 'Seneca'
        },
        programs: [{
            program: {
                name: 'Business',
                code: 'BUS'
            },
            semester: 1
        }],
        professors: [{
            name: 'Prof. Dr. Sarah Kim',
            rating: 4.4
        }],
        stats: {
            enrollmentCount: 95,
            rating: {
                average: 4.3,
                count: 55
            },
            materialCount: 23
        },
        imageUrl: '/sustainablebusiness.jpg'
    },
    {
        _id: '189',
        code: 'SUTP001',
        name: 'Sustainable Urban & Transportation Planning',
        description: 'Planning program covering sustainable city development, transportation systems, and urban environmental planning.',
        credits: 6,
        level: '2',
        difficulty: 'intermediate',
        delivery: ['in-person', 'hybrid'],
        language: 'english',
        school: {
            name: 'Seneca Polytechnic',
            shortName: 'Seneca'
        },
        programs: [{
            program: {
                name: 'Engineering Technology',
                code: 'ENGR'
            },
            semester: 1
        }],
        professors: [{
            name: 'Prof. Dr. Patricia Lee',
            rating: 4.3
        }],
        stats: {
            enrollmentCount: 75,
            rating: {
                average: 4.2,
                count: 43
            },
            materialCount: 24
        },
        imageUrl: '/sustainableurban.jpg'
    },
    {
        _id: '190',
        code: 'TESL1001',
        name: 'TESL 1',
        description: 'Teaching English as a Second Language foundation course covering basic ESL teaching methods and language learning theory.',
        credits: 3,
        level: '2',
        difficulty: 'intermediate',
        delivery: ['in-person', 'online'],
        language: 'english',
        school: {
            name: 'Seneca Polytechnic',
            shortName: 'Seneca'
        },
        programs: [{
            program: {
                name: 'Education, Community & Social Services',
                code: 'ECSS'
            },
            semester: 1
        }],
        professors: [{
            name: 'Prof. Susan Miller',
            rating: 4.1
        }],
        stats: {
            enrollmentCount: 85,
            rating: {
                average: 4.0,
                count: 49
            },
            materialCount: 15
        },
        imageUrl: '/tesl1.jpg'
    },
    {
        _id: '191',
        code: 'TESL2001',
        name: 'TESL 2',
        description: 'Advanced Teaching English as a Second Language course covering advanced teaching methods and curriculum development.',
        credits: 3,
        level: '2',
        difficulty: 'intermediate',
        delivery: ['in-person', 'online'],
        language: 'english',
        school: {
            name: 'Seneca Polytechnic',
            shortName: 'Seneca'
        },
        programs: [{
            program: {
                name: 'Education, Community & Social Services',
                code: 'ECSS'
            },
            semester: 1
        }],
        professors: [{
            name: 'Prof. Jennifer Adams',
            rating: 4.2
        }],
        stats: {
            enrollmentCount: 75,
            rating: {
                average: 4.1,
                count: 43
            },
            materialCount: 16
        },
        imageUrl: '/tesl2.jpg'
    },
    {
        _id: '192',
        code: 'TC001',
        name: 'Technical Communication',
        description: 'Communication program focusing on technical writing, documentation, and professional communication in technical fields.',
        credits: 4,
        level: '2',
        difficulty: 'intermediate',
        delivery: ['in-person', 'online'],
        language: 'english',
        school: {
            name: 'Seneca Polytechnic',
            shortName: 'Seneca'
        },
        programs: [{
            program: {
                name: 'Media & Communications',
                code: 'MCOM'
            },
            semester: 1
        }],
        professors: [{
            name: 'Prof. Dr. Jennifer Brown',
            rating: 4.2
        }],
        stats: {
            enrollmentCount: 95,
            rating: {
                average: 4.1,
                count: 55
            },
            materialCount: 18
        },
        imageUrl: '/techcomm.jpg'
    },
    {
        _id: '193',
        code: 'TSMGTB001',
        name: 'Tourism – Services Management – Global Tourism Business Specialization',
        description: 'Tourism program specializing in global tourism business operations, international travel, and tourism management.',
        credits: 6,
        level: '2',
        difficulty: 'intermediate',
        delivery: ['in-person', 'hybrid'],
        language: 'english',
        school: {
            name: 'Seneca Polytechnic',
            shortName: 'Seneca'
        },
        programs: [{
            program: {
                name: 'Hospitality & Tourism',
                code: 'HT'
            },
            semester: 1
        }],
        professors: [{
            name: 'Prof. Maria Santos',
            rating: 4.2
        }],
        stats: {
            enrollmentCount: 85,
            rating: {
                average: 4.1,
                count: 49
            },
            materialCount: 22
        },
        imageUrl: '/tourismbusiness.jpg'
    },
    {
        _id: '194',
        code: 'TSMTS001',
        name: 'Tourism – Services Management – Travel Services Specialization',
        description: 'Tourism program specializing in travel services, travel agency operations, and customer service in tourism.',
        credits: 6,
        level: '2',
        difficulty: 'intermediate',
        delivery: ['in-person', 'hybrid'],
        language: 'english',
        school: {
            name: 'Seneca Polytechnic',
            shortName: 'Seneca'
        },
        programs: [{
            program: {
                name: 'Hospitality & Tourism',
                code: 'HT'
            },
            semester: 1
        }],
        professors: [{
            name: 'Prof. Dr. Jennifer Chen',
            rating: 4.1
        }],
        stats: {
            enrollmentCount: 95,
            rating: {
                average: 4.0,
                count: 55
            },
            materialCount: 20
        },
        imageUrl: '/travelservices.jpg'
    },
    {
        _id: '195',
        code: 'TTO001',
        name: 'Tourism – Travel Operations',
        description: 'Tourism program covering travel operations, tour planning, destination management, and tourism industry operations.',
        credits: 5,
        level: '2',
        difficulty: 'intermediate',
        delivery: ['in-person', 'hybrid'],
        language: 'english',
        school: {
            name: 'Seneca Polytechnic',
            shortName: 'Seneca'
        },
        programs: [{
            program: {
                name: 'Hospitality & Tourism',
                code: 'HT'
            },
            semester: 1
        }],
        professors: [{
            name: 'Prof. James Chen',
            rating: 4.0
        }],
        stats: {
            enrollmentCount: 105,
            rating: {
                average: 3.9,
                count: 61
            },
            materialCount: 19
        },
        imageUrl: '/travelops.jpg'
    },
    {
        _id: '196',
        code: 'VA001',
        name: 'Veterinary Assistant',
        description: 'Animal healthcare program covering basic veterinary procedures, animal care, and veterinary office operations.',
        credits: 4,
        level: '2',
        difficulty: 'intermediate',
        delivery: ['in-person'],
        language: 'english',
        school: {
            name: 'Seneca Polytechnic',
            shortName: 'Seneca'
        },
        programs: [{
            program: {
                name: 'Health & Wellness',
                code: 'HW'
            },
            semester: 1
        }],
        professors: [{
            name: 'Prof. Dr. Thomas Anderson',
            rating: 4.2
        }],
        stats: {
            enrollmentCount: 75,
            rating: {
                average: 4.1,
                count: 43
            },
            materialCount: 18
        },
        imageUrl: '/vetassistant.jpg'
    },
    {
        _id: '197',
        code: 'VT001',
        name: 'Veterinary Technician',
        description: 'Advanced animal healthcare program covering veterinary technology, laboratory procedures, and surgical assistance.',
        credits: 6,
        level: '2',
        difficulty: 'intermediate',
        delivery: ['in-person'],
        language: 'english',
        school: {
            name: 'Seneca Polytechnic',
            shortName: 'Seneca'
        },
        programs: [{
            program: {
                name: 'Health & Wellness',
                code: 'HW'
            },
            semester: 1
        }],
        professors: [{
            name: 'Prof. Dr. Lisa Johnson',
            rating: 4.3
        }],
        stats: {
            enrollmentCount: 95,
            rating: {
                average: 4.2,
                count: 55
            },
            materialCount: 24
        },
        imageUrl: '/vettech.jpg'
    },
    {
        _id: '198',
        code: 'VCC001',
        name: 'Visual Content Creation',
        description: 'Digital media program covering visual content production, photography, videography, and digital storytelling.',
        credits: 5,
        level: '2',
        difficulty: 'intermediate',
        delivery: ['in-person', 'hybrid'],
        language: 'english',
        school: {
            name: 'Seneca Polytechnic',
            shortName: 'Seneca'
        },
        programs: [{
            program: {
                name: 'Creative Arts, Animation & Design',
                code: 'CAAD'
            },
            semester: 1
        }],
        professors: [{
            name: 'Prof. Alex Kim',
            rating: 4.2
        }],
        stats: {
            enrollmentCount: 125,
            rating: {
                average: 4.1,
                count: 72
            },
            materialCount: 21
        },
        imageUrl: '/visualcontent.jpg'
    },
    {
        _id: '199',
        code: 'VFX001',
        name: 'Visual Effects for Film & Television',
        description: 'Specialized program in visual effects covering CGI, compositing, motion graphics, and post-production for entertainment industry.',
        credits: 6,
        level: '2',
        difficulty: 'intermediate',
        delivery: ['in-person'],
        language: 'english',
        school: {
            name: 'Seneca Polytechnic',
            shortName: 'Seneca'
        },
        programs: [{
            program: {
                name: 'Creative Arts, Animation & Design',
                code: 'CAAD'
            },
            semester: 1
        }],
        professors: [{
            name: 'Prof. Ryan Mitchell',
            rating: 4.4
        }],
        stats: {
            enrollmentCount: 85,
            rating: {
                average: 4.3,
                count: 49
            },
            materialCount: 28
        },
        imageUrl: '/vfx.jpg'
    },
    {
        _id: '200',
        code: 'VMA001',
        name: 'Visual Merchandising Arts',
        description: 'Creative program in visual merchandising covering retail display design, store layout, and commercial visual presentation.',
        credits: 4,
        level: '2',
        difficulty: 'intermediate',
        delivery: ['in-person', 'hybrid'],
        language: 'english',
        school: {
            name: 'Seneca Polytechnic',
            shortName: 'Seneca'
        },
        programs: [{
            program: {
                name: 'Creative Arts, Animation & Design',
                code: 'CAAD'
            },
            semester: 1
        }],
        professors: [{
            name: 'Prof. Sophie Turner',
            rating: 4.1
        }],
        stats: {
            enrollmentCount: 65,
            rating: {
                average: 4.0,
                count: 37
            },
            materialCount: 16
        },
        imageUrl: '/visualmerchandising.jpg'
    },
    {
        _id: '201',
        code: 'WSP001',
        name: 'Workplace Safety & Prevention',
        description: 'Safety program covering occupational health and safety, workplace hazard identification, and safety management systems.',
        credits: 5,
        level: '2',
        difficulty: 'intermediate',
        delivery: ['in-person', 'hybrid'],
        language: 'english',
        school: {
            name: 'Seneca Polytechnic',
            shortName: 'Seneca'
        },
        programs: [{
            program: {
                name: 'Health & Wellness',
                code: 'HW'
            },
            semester: 1
        }],
        professors: [{
            name: 'Prof. Robert Wilson',
            rating: 4.2
        }],
        stats: {
            enrollmentCount: 105,
            rating: {
                average: 4.1,
                count: 61
            },
            materialCount: 22
        },
        imageUrl: '/workplacesafety.jpg'
    }
];

