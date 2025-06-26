module.exports = {

"[project]/app/(protected)/courses/page.tsx [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "default": (()=>__TURBOPACK__default__export__)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$star$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Star$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/star.js [app-ssr] (ecmascript) <export default as Star>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/image.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2d$auth$2f$react$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next-auth/react/index.js [app-ssr] (ecmascript)");
"use client";
;
;
;
;
;
const CoursesPage = ()=>{
    const { data: session } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2d$auth$2f$react$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useSession"])();
    const [courses, setCourses] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(true);
    const [searchTerm, setSearchTerm] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])('');
    const [filters, setFilters] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])({
        level: '',
        difficulty: '',
        delivery: '',
        school: '',
        course: '',
        sort: 'relevance'
    });
    const [currentPage, setCurrentPage] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(1);
    const [totalPages, setTotalPages] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(1);
    // Mock data for development
    const mockCourses = [
        {
            _id: '1',
            code: 'CS101',
            name: 'Introduction to Computer Science',
            description: 'Fundamental concepts of computer science including programming basics, algorithms, and data structures.',
            credits: 3,
            level: '1',
            difficulty: 'beginner',
            delivery: [
                'in-person',
                'online'
            ],
            language: 'english',
            school: {
                name: 'University of Toronto',
                shortName: 'UofT'
            },
            programs: [
                {
                    program: {
                        name: 'Computer Science',
                        code: 'CS'
                    },
                    semester: 1
                }
            ],
            professors: [
                {
                    name: 'Dr. Sarah Johnson',
                    rating: 4.5
                }
            ],
            stats: {
                enrollmentCount: 245,
                rating: {
                    average: 4.3,
                    count: 89
                },
                materialCount: 12
            }
        },
        {
            _id: '2',
            code: 'MATH200',
            name: 'Calculus II',
            description: 'Integral calculus, applications of integration, infinite series, and differential equations.',
            credits: 4,
            level: '2',
            difficulty: 'intermediate',
            delivery: [
                'in-person'
            ],
            language: 'english',
            school: {
                name: 'York University',
                shortName: 'YorkU'
            },
            programs: [
                {
                    program: {
                        name: 'Mathematics',
                        code: 'MATH'
                    },
                    semester: 3
                }
            ],
            professors: [
                {
                    name: 'Prof. Michael Chen',
                    rating: 4.8
                }
            ],
            stats: {
                enrollmentCount: 189,
                rating: {
                    average: 4.6,
                    count: 67
                },
                materialCount: 15
            }
        },
        {
            _id: '3',
            code: 'BUS301',
            name: 'Digital Marketing Strategy',
            description: 'Comprehensive study of digital marketing channels, analytics, and campaign optimization.',
            credits: 3,
            level: '3',
            difficulty: 'intermediate',
            delivery: [
                'online',
                'hybrid'
            ],
            language: 'english',
            school: {
                name: 'Ryerson University',
                shortName: 'TMU'
            },
            programs: [
                {
                    program: {
                        name: 'Business Administration',
                        code: 'BUS'
                    },
                    semester: 5
                }
            ],
            professors: [
                {
                    name: 'Dr. Emily Rodriguez',
                    rating: 4.2
                }
            ],
            stats: {
                enrollmentCount: 156,
                rating: {
                    average: 4.1,
                    count: 43
                },
                materialCount: 8
            }
        }
    ];
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        // Simulate API call
        const fetchCourses = async ()=>{
            setLoading(true);
            // In real app, this would be an API call
            setTimeout(()=>{
                setCourses(mockCourses);
                setLoading(false);
            }, 1000);
        };
        fetchCourses();
    }, [
        searchTerm,
        filters,
        currentPage
    ]);
    const getDifficultyColor = (difficulty)=>{
        switch(difficulty){
            case 'beginner':
                return 'bg-green-100 text-green-800';
            case 'intermediate':
                return 'bg-yellow-100 text-yellow-800';
            case 'advanced':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };
    const filteredCourses = courses.filter((course)=>{
        const matchesSearch = course.name.toLowerCase().includes(searchTerm.toLowerCase()) || course.code.toLowerCase().includes(searchTerm.toLowerCase()) || course.description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesLevel = !filters.level || course.level === filters.level;
        const matchesDifficulty = !filters.difficulty || course.difficulty === filters.difficulty;
        const matchesDelivery = !filters.delivery || course.delivery.includes(filters.delivery);
        const matchesSchool = !filters.school || course.school.shortName === filters.school;
        return matchesSearch && matchesLevel && matchesDifficulty && matchesDelivery && matchesSchool;
    });
    const programFilters = [
        "All Programs",
        "Engineering",
        "Business",
        "Arts & Sciences",
        "Health Sciences"
    ];
    const courseFilters = [
        "All Courses",
        "Calculus I",
        "Linear Algebra",
        "Organic Chemistry",
        "Introduction to Psychology"
    ];
    const sortOptions = [
        {
            label: "Relevance",
            value: "relevance"
        },
        {
            label: "Popularity",
            value: "popularity"
        },
        {
            label: "Date",
            value: "date"
        }
    ];
    if (loading) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "min-h-screen bg-gray-50 p-6",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "max-w-7xl mx-auto",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "animate-pulse",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "h-8 bg-gray-300 rounded w-1/4 mb-6"
                        }, void 0, false, {
                            fileName: "[project]/app/(protected)/courses/page.tsx",
                            lineNumber: 219,
                            columnNumber: 25
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6",
                            children: [
                                1,
                                2,
                                3,
                                4,
                                5,
                                6
                            ].map((i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "bg-white rounded-lg shadow-md p-6",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "h-4 bg-gray-300 rounded w-3/4 mb-2"
                                        }, void 0, false, {
                                            fileName: "[project]/app/(protected)/courses/page.tsx",
                                            lineNumber: 223,
                                            columnNumber: 37
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "h-4 bg-gray-300 rounded w-1/2 mb-4"
                                        }, void 0, false, {
                                            fileName: "[project]/app/(protected)/courses/page.tsx",
                                            lineNumber: 224,
                                            columnNumber: 37
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "h-20 bg-gray-300 rounded mb-4"
                                        }, void 0, false, {
                                            fileName: "[project]/app/(protected)/courses/page.tsx",
                                            lineNumber: 225,
                                            columnNumber: 37
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex justify-between",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "h-4 bg-gray-300 rounded w-1/4"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/(protected)/courses/page.tsx",
                                                    lineNumber: 227,
                                                    columnNumber: 41
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "h-4 bg-gray-300 rounded w-1/4"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/(protected)/courses/page.tsx",
                                                    lineNumber: 228,
                                                    columnNumber: 41
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/(protected)/courses/page.tsx",
                                            lineNumber: 226,
                                            columnNumber: 37
                                        }, this)
                                    ]
                                }, i, true, {
                                    fileName: "[project]/app/(protected)/courses/page.tsx",
                                    lineNumber: 222,
                                    columnNumber: 33
                                }, this))
                        }, void 0, false, {
                            fileName: "[project]/app/(protected)/courses/page.tsx",
                            lineNumber: 220,
                            columnNumber: 25
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/(protected)/courses/page.tsx",
                    lineNumber: 218,
                    columnNumber: 21
                }, this)
            }, void 0, false, {
                fileName: "[project]/app/(protected)/courses/page.tsx",
                lineNumber: 217,
                columnNumber: 17
            }, this)
        }, void 0, false, {
            fileName: "[project]/app/(protected)/courses/page.tsx",
            lineNumber: 216,
            columnNumber: 13
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "min-h-screen bg-[#1a1a1a] text-white",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "w-full border-b border-[#232425]",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "max-w-6xl mx-auto px-6 py-10",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                            className: "text-4xl font-bold mb-2",
                            children: "Community Materials"
                        }, void 0, false, {
                            fileName: "[project]/app/(protected)/courses/page.tsx",
                            lineNumber: 244,
                            columnNumber: 21
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "text-gray-300 mb-8 max-w-2xl",
                            children: "Explore a wealth of resources shared by your peers, categorized by program and course. Find exactly what you need to excel in your studies."
                        }, void 0, false, {
                            fileName: "[project]/app/(protected)/courses/page.tsx",
                            lineNumber: 245,
                            columnNumber: 21
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex flex-wrap gap-3 mb-4",
                            children: programFilters.map((filter)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    className: `px-5 py-2 rounded-lg font-medium transition-colors
                                    ${filters.school === filter || filter === "All Programs" && !filters.school ? "bg-[#232425] text-white" : "bg-[#36454F]/60 text-gray-300 hover:bg-orange-300 hover:text-white transition-colors"}
                                `,
                                    onClick: ()=>setFilters((f)=>({
                                                ...f,
                                                school: filter === "All Programs" ? "" : filter
                                            })),
                                    children: filter
                                }, filter, false, {
                                    fileName: "[project]/app/(protected)/courses/page.tsx",
                                    lineNumber: 251,
                                    columnNumber: 29
                                }, this))
                        }, void 0, false, {
                            fileName: "[project]/app/(protected)/courses/page.tsx",
                            lineNumber: 249,
                            columnNumber: 21
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex flex-wrap gap-3 mb-8",
                            children: courseFilters.map((filter)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    className: `px-4 py-2 rounded-lg font-medium transition-colors
                                    ${filters.course === filter || filter === "All Courses" && !filters.course ? "bg-[#232425] text-white" : "bg-[#36454F]/60 text-gray-300 hover:bg-orange-300 hover:text-white transition-colors"}
                                `,
                                    onClick: ()=>setFilters((f)=>({
                                                ...f,
                                                course: filter === "All Courses" ? "" : filter
                                            })),
                                    children: filter
                                }, filter, false, {
                                    fileName: "[project]/app/(protected)/courses/page.tsx",
                                    lineNumber: 267,
                                    columnNumber: 29
                                }, this))
                        }, void 0, false, {
                            fileName: "[project]/app/(protected)/courses/page.tsx",
                            lineNumber: 265,
                            columnNumber: 21
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "mb-2",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "font-semibold mr-4",
                                    children: "Sort By"
                                }, void 0, false, {
                                    fileName: "[project]/app/(protected)/courses/page.tsx",
                                    lineNumber: 282,
                                    columnNumber: 25
                                }, this),
                                sortOptions.map((opt)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        className: `px-4 py-2 rounded-lg font-medium transition-colors mr-2
                                    ${filters.sort === opt.value || !filters.sort && opt.value === "relevance" ? "bg-[#36454F] text-white" : "bg-[#36454F]/60 text-gray-300 hover:bg-[#232425]"}
                                `,
                                        onClick: ()=>setFilters((f)=>({
                                                    ...f,
                                                    sort: opt.value
                                                })),
                                        children: opt.label
                                    }, opt.value, false, {
                                        fileName: "[project]/app/(protected)/courses/page.tsx",
                                        lineNumber: 284,
                                        columnNumber: 29
                                    }, this))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/(protected)/courses/page.tsx",
                            lineNumber: 281,
                            columnNumber: 21
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/(protected)/courses/page.tsx",
                    lineNumber: 243,
                    columnNumber: 17
                }, this)
            }, void 0, false, {
                fileName: "[project]/app/(protected)/courses/page.tsx",
                lineNumber: 242,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "max-w-6xl mx-auto px-6 py-10",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex flex-col gap-8",
                    children: filteredCourses.map((course, idx)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex flex-col md:flex-row items-stretch bg-[#232425] rounded-xl overflow-hidden shadow-lg",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex-1 p-6 flex flex-col justify-center",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "text-sm text-gray-400 mb-1",
                                            children: course.school.name
                                        }, void 0, false, {
                                            fileName: "[project]/app/(protected)/courses/page.tsx",
                                            lineNumber: 310,
                                            columnNumber: 33
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                            className: "text-xl font-bold mb-1",
                                            children: course.name
                                        }, void 0, false, {
                                            fileName: "[project]/app/(protected)/courses/page.tsx",
                                            lineNumber: 311,
                                            columnNumber: 33
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-gray-200 font-medium mb-2",
                                            children: course.code
                                        }, void 0, false, {
                                            fileName: "[project]/app/(protected)/courses/page.tsx",
                                            lineNumber: 312,
                                            columnNumber: 33
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-gray-300 mb-4",
                                            children: course.description
                                        }, void 0, false, {
                                            fileName: "[project]/app/(protected)/courses/page.tsx",
                                            lineNumber: 313,
                                            columnNumber: 33
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex flex-wrap gap-4 text-sm text-gray-400",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    children: [
                                                        course.credits,
                                                        " credits"
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/app/(protected)/courses/page.tsx",
                                                    lineNumber: 315,
                                                    columnNumber: 37
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    children: [
                                                        "Level ",
                                                        course.level
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/app/(protected)/courses/page.tsx",
                                                    lineNumber: 316,
                                                    columnNumber: 37
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "capitalize",
                                                    children: course.difficulty
                                                }, void 0, false, {
                                                    fileName: "[project]/app/(protected)/courses/page.tsx",
                                                    lineNumber: 317,
                                                    columnNumber: 37
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    children: [
                                                        course.stats.enrollmentCount,
                                                        " enrolled"
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/app/(protected)/courses/page.tsx",
                                                    lineNumber: 318,
                                                    columnNumber: 37
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$star$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Star$3e$__["Star"], {
                                                            className: "inline w-4 h-4 text-yellow-400 mr-1"
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/(protected)/courses/page.tsx",
                                                            lineNumber: 320,
                                                            columnNumber: 41
                                                        }, this),
                                                        course.stats.rating.average,
                                                        " (",
                                                        course.stats.rating.count,
                                                        ")"
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/app/(protected)/courses/page.tsx",
                                                    lineNumber: 319,
                                                    columnNumber: 37
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/(protected)/courses/page.tsx",
                                            lineNumber: 314,
                                            columnNumber: 33
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/(protected)/courses/page.tsx",
                                    lineNumber: 309,
                                    columnNumber: 29
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "md:w-64 flex-shrink-0 flex items-center justify-center bg-[#232425]",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                        src: `https://source.unsplash.com/400x300/?study,notes,${idx}`,
                                        alt: course.name,
                                        width: 256,
                                        height: 192,
                                        className: "object-cover w-full h-full"
                                    }, void 0, false, {
                                        fileName: "[project]/app/(protected)/courses/page.tsx",
                                        lineNumber: 327,
                                        columnNumber: 33
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/app/(protected)/courses/page.tsx",
                                    lineNumber: 326,
                                    columnNumber: 29
                                }, this)
                            ]
                        }, course._id, true, {
                            fileName: "[project]/app/(protected)/courses/page.tsx",
                            lineNumber: 304,
                            columnNumber: 25
                        }, this))
                }, void 0, false, {
                    fileName: "[project]/app/(protected)/courses/page.tsx",
                    lineNumber: 302,
                    columnNumber: 17
                }, this)
            }, void 0, false, {
                fileName: "[project]/app/(protected)/courses/page.tsx",
                lineNumber: 301,
                columnNumber: 13
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/(protected)/courses/page.tsx",
        lineNumber: 240,
        columnNumber: 9
    }, this);
};
const __TURBOPACK__default__export__ = CoursesPage;
}}),

};

//# sourceMappingURL=app_%28protected%29_courses_page_tsx_77c54a5d._.js.map