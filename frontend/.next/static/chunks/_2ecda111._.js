(globalThis.TURBOPACK = globalThis.TURBOPACK || []).push([typeof document === "object" ? document.currentScript : undefined, {

"[project]/types/Upload.ts [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "MAX_FILE_SIZE": (()=>MAX_FILE_SIZE),
    "SUPPORTED_TYPES": (()=>SUPPORTED_TYPES)
});
const SUPPORTED_TYPES = [
    'application/pdf',
    'image/jpeg',
    'image/png',
    'image/gif',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'text/plain'
];
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/lib/utils.ts [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "capitialize": (()=>capitialize),
    "cn": (()=>cn),
    "formatFileSize": (()=>formatFileSize),
    "getFileCategory": (()=>getFileCategory),
    "getFileInfo": (()=>getFileInfo),
    "getSupportedFileTypes": (()=>getSupportedFileTypes),
    "isSupportedFileType": (()=>isSupportedFileType),
    "validateFile": (()=>validateFile)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$types$2f$Upload$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/types/Upload.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/clsx/dist/clsx.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$tailwind$2d$merge$2f$dist$2f$bundle$2d$mjs$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/tailwind-merge/dist/bundle-mjs.mjs [app-client] (ecmascript)");
;
;
;
const capitialize = (str)=>str.charAt(0).toUpperCase() + str.slice(1);
const validateFile = (file)=>{
    if (!__TURBOPACK__imported__module__$5b$project$5d2f$types$2f$Upload$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SUPPORTED_TYPES"].includes(file.type)) {
        return 'Unsupported file type. Supported: PDF, Images, Word documents, Text files';
    }
    if (file.size > __TURBOPACK__imported__module__$5b$project$5d2f$types$2f$Upload$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MAX_FILE_SIZE"]) {
        return 'File size exceeds 10MB limit';
    }
    if (file.size === 0) {
        return 'Empty file not allowed';
    }
    return null;
};
const getFileInfo = (file)=>{
    return {
        name: file.name,
        size: file.size,
        type: file.type,
        lastModified: file.lastModified,
        category: file.type.startsWith('image/') ? 'image' : file.type === 'application/pdf' ? 'pdf' : 'document',
        sizeFormatted: formatFileSize(file.size)
    };
};
const formatFileSize = (bytes)=>{
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = [
        'Bytes',
        'KB',
        'MB',
        'GB'
    ];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};
const getFileCategory = (file)=>{
    if (file.type.startsWith('image/')) return 'image';
    if (file.type === 'application/pdf') return 'pdf';
    return 'document';
};
const isSupportedFileType = (file)=>{
    return __TURBOPACK__imported__module__$5b$project$5d2f$types$2f$Upload$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SUPPORTED_TYPES"].includes(file.type);
};
const getSupportedFileTypes = ()=>({
        types: __TURBOPACK__imported__module__$5b$project$5d2f$types$2f$Upload$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SUPPORTED_TYPES"],
        extensions: [
            '.pdf',
            '.jpg',
            '.jpeg',
            '.png',
            '.gif',
            '.doc',
            '.docx',
            '.txt'
        ],
        maxSize: __TURBOPACK__imported__module__$5b$project$5d2f$types$2f$Upload$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MAX_FILE_SIZE"],
        maxSizeFormatted: formatFileSize(__TURBOPACK__imported__module__$5b$project$5d2f$types$2f$Upload$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MAX_FILE_SIZE"])
    });
function cn(...inputs) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$tailwind$2d$merge$2f$dist$2f$bundle$2d$mjs$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["twMerge"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["clsx"])(inputs));
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/components/ui/Button.tsx [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
// components/ui/button.tsx
__turbopack_context__.s({
    "Button": (()=>Button)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/utils.ts [app-client] (ecmascript)");
;
;
;
const Button = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"])(_c = ({ className, variant = "default", size = "default", asChild = false, ...props }, ref)=>{
    const baseStyles = "inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50";
    const variants = {
        default: "bg-primary text-primary-foreground hover:bg-primary/90 bg-blue-600 text-white hover:bg-blue-700",
        destructive: "bg-red-600 text-white hover:bg-red-700",
        outline: "border border-gray-300 bg-white hover:bg-gray-50 hover:text-gray-900",
        secondary: "bg-gray-100 text-gray-900 hover:bg-gray-200",
        ghost: "hover:bg-gray-100 hover:text-gray-900",
        link: "text-blue-600 underline-offset-4 hover:underline"
    };
    const sizes = {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10"
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])(baseStyles, variants[variant], sizes[size], className),
        ref: ref,
        ...props
    }, void 0, false, {
        fileName: "[project]/components/ui/Button.tsx",
        lineNumber: 33,
        columnNumber: 13
    }, this);
});
_c1 = Button;
Button.displayName = "Button";
;
var _c, _c1;
__turbopack_context__.k.register(_c, "Button$React.forwardRef");
__turbopack_context__.k.register(_c1, "Button");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/components/landing/LandingNavBar.tsx [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "default": (()=>__TURBOPACK__default__export__)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/image.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2d$auth$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next-auth/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$Button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/Button.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$user$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__UserIcon$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/user.js [app-client] (ecmascript) <export default as UserIcon>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$down$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronDownIcon$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/chevron-down.js [app-client] (ecmascript) <export default as ChevronDownIcon>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
;
;
;
const LandingNavBar = ()=>{
    _s();
    const { data: session } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2d$auth$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSession"])();
    const user = session?.user;
    const [showUserMenu, setShowUserMenu] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [showAccountModal, setShowAccountModal] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const modalRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const [isScrolled, setIsScrolled] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    // Đóng modal khi click ngoài
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "LandingNavBar.useEffect": ()=>{
            function handleClickOutside(event) {
                if (modalRef.current && !modalRef.current.contains(event.target)) {
                    setShowAccountModal(false);
                }
            }
            if (showAccountModal) {
                document.addEventListener('mousedown', handleClickOutside);
            } else {
                document.removeEventListener('mousedown', handleClickOutside);
            }
            return ({
                "LandingNavBar.useEffect": ()=>{
                    document.removeEventListener('mousedown', handleClickOutside);
                }
            })["LandingNavBar.useEffect"];
        }
    }["LandingNavBar.useEffect"], [
        showAccountModal
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "LandingNavBar.useEffect": ()=>{
            const handleScroll = {
                "LandingNavBar.useEffect.handleScroll": ()=>{
                    setIsScrolled(window.scrollY > 0);
                }
            }["LandingNavBar.useEffect.handleScroll"];
            window.addEventListener('scroll', handleScroll);
            return ({
                "LandingNavBar.useEffect": ()=>window.removeEventListener('scroll', handleScroll)
            })["LandingNavBar.useEffect"];
        }
    }["LandingNavBar.useEffect"], []);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("header", {
        className: `top-0 left-0 right-0 z-50 w-full transition-all duration-300
                ${isScrolled ? 'fixed backdrop-blur-sm bg-[#18191A]/70 shadow-lg' : 'absolute bg-transparent'}`,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("nav", {
                className: "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 hidden md:flex items-center gap-8 font-medium text-white",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                        href: "/",
                        className: "hover:text-gray-200",
                        children: "Home"
                    }, void 0, false, {
                        fileName: "[project]/components/landing/LandingNavBar.tsx",
                        lineNumber: 50,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                        href: "/courses",
                        className: "hover:text-gray-200",
                        children: "Courses"
                    }, void 0, false, {
                        fileName: "[project]/components/landing/LandingNavBar.tsx",
                        lineNumber: 51,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                        href: "/programs",
                        className: "hover:text-gray-200",
                        children: "Programs"
                    }, void 0, false, {
                        fileName: "[project]/components/landing/LandingNavBar.tsx",
                        lineNumber: 52,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                        href: "/resources",
                        className: "hover:text-gray-200",
                        children: "Resources"
                    }, void 0, false, {
                        fileName: "[project]/components/landing/LandingNavBar.tsx",
                        lineNumber: 53,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                        href: "/about",
                        className: "hover:text-gray-200",
                        children: "About"
                    }, void 0, false, {
                        fileName: "[project]/components/landing/LandingNavBar.tsx",
                        lineNumber: 54,
                        columnNumber: 17
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/landing/LandingNavBar.tsx",
                lineNumber: 49,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center justify-between h-20 w-full px-6 xl:px-16 2xl:px-32 text-white",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                            href: "/",
                            className: "flex items-center gap-2.5",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-3xl md:text-4xl font-bold",
                                children: "StudyBuddy"
                            }, void 0, false, {
                                fileName: "[project]/components/landing/LandingNavBar.tsx",
                                lineNumber: 60,
                                columnNumber: 25
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/components/landing/LandingNavBar.tsx",
                            lineNumber: 59,
                            columnNumber: 21
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/components/landing/LandingNavBar.tsx",
                        lineNumber: 58,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center gap-4",
                        children: user ? // Logged in user
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex items-center gap-3",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "relative",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: ()=>setShowAccountModal(true),
                                        className: "flex items-center gap-2 p-1 rounded-full bg-white/20 hover:bg-white/30 transition-colors",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "w-8 h-8 rounded-full overflow-hidden bg-white/30",
                                                children: user.image ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                                    src: user.image,
                                                    alt: "User Avatar",
                                                    width: 28,
                                                    height: 28,
                                                    className: "object-cover w-full h-full"
                                                }, void 0, false, {
                                                    fileName: "[project]/components/landing/LandingNavBar.tsx",
                                                    lineNumber: 88,
                                                    columnNumber: 45
                                                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "w-full h-full flex items-center justify-center",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$user$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__UserIcon$3e$__["UserIcon"], {
                                                        className: "w-5 h-5 text-white"
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/landing/LandingNavBar.tsx",
                                                        lineNumber: 97,
                                                        columnNumber: 49
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/components/landing/LandingNavBar.tsx",
                                                    lineNumber: 96,
                                                    columnNumber: 45
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/components/landing/LandingNavBar.tsx",
                                                lineNumber: 86,
                                                columnNumber: 37
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$down$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronDownIcon$3e$__["ChevronDownIcon"], {
                                                className: "w-4 h-4 text-white"
                                            }, void 0, false, {
                                                fileName: "[project]/components/landing/LandingNavBar.tsx",
                                                lineNumber: 101,
                                                columnNumber: 37
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/landing/LandingNavBar.tsx",
                                        lineNumber: 82,
                                        columnNumber: 33
                                    }, this),
                                    showAccountModal && user && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "absolute top-full mt-5 right-0 z-[100]",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            ref: modalRef,
                                            className: "relative bg-[#343434] rounded-3xl shadow-2xl w-80 max-w-full px-8 pt-8 pb-4 flex flex-col items-center animate-fade-in",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    onClick: ()=>setShowAccountModal(false),
                                                    className: "absolute top-4 right-4 text-gray-400 hover:text-white text-2xl font-bold focus:outline-none",
                                                    children: "×"
                                                }, void 0, false, {
                                                    fileName: "[project]/components/landing/LandingNavBar.tsx",
                                                    lineNumber: 108,
                                                    columnNumber: 45
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "text-gray-300 text-sm mb-5 font-medium",
                                                    children: user.email
                                                }, void 0, false, {
                                                    fileName: "[project]/components/landing/LandingNavBar.tsx",
                                                    lineNumber: 110,
                                                    columnNumber: 45
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "w-16 h-16 rounded-full overflow-hidden bg-gray-700 mb-4 flex items-center justify-center border-2 border-white mx-auto",
                                                    children: user.image ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                                        src: user.image,
                                                        alt: "User Avatar",
                                                        width: 64,
                                                        height: 64,
                                                        className: "object-cover w-full h-full"
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/landing/LandingNavBar.tsx",
                                                        lineNumber: 114,
                                                        columnNumber: 53
                                                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$user$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__UserIcon$3e$__["UserIcon"], {
                                                        className: "w-10 h-10 text-white"
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/landing/LandingNavBar.tsx",
                                                        lineNumber: 116,
                                                        columnNumber: 53
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/components/landing/LandingNavBar.tsx",
                                                    lineNumber: 112,
                                                    columnNumber: 45
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                                    className: "text-2xl font-semibold text-white mb-6",
                                                    children: [
                                                        "Hi, ",
                                                        user.name?.split(' ')[0] || user.email?.split('@')[0],
                                                        "!"
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/components/landing/LandingNavBar.tsx",
                                                    lineNumber: 120,
                                                    columnNumber: 45
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                                    href: "/profile",
                                                    className: "w-full mb-5",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                        className: "w-full py-2 rounded-full text-white font-semibold text-base shadow-none bg-transparent hover:bg-white/10 transition cursor-pointer border border-gray-500",
                                                        children: "Manage your Account"
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/landing/LandingNavBar.tsx",
                                                        lineNumber: 123,
                                                        columnNumber: 49
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/components/landing/LandingNavBar.tsx",
                                                    lineNumber: 122,
                                                    columnNumber: 45
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    onClick: ()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2d$auth$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["signOut"])({
                                                            redirect: true,
                                                            callbackUrl: '/sign-in'
                                                        }),
                                                    className: "w-full py-2 rounded-full text-gray-300 border border-gray-500 font-semibold text-base shadow-none bg-transparent hover:bg-white/10 transition cursor-pointer",
                                                    children: "Sign out"
                                                }, void 0, false, {
                                                    fileName: "[project]/components/landing/LandingNavBar.tsx",
                                                    lineNumber: 125,
                                                    columnNumber: 45
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "w-full flex justify-center mt-5",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "text-xs text-gray-500",
                                                        children: "Privacy policy · Terms of Service"
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/landing/LandingNavBar.tsx",
                                                        lineNumber: 127,
                                                        columnNumber: 49
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/components/landing/LandingNavBar.tsx",
                                                    lineNumber: 126,
                                                    columnNumber: 45
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/components/landing/LandingNavBar.tsx",
                                            lineNumber: 106,
                                            columnNumber: 41
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/components/landing/LandingNavBar.tsx",
                                        lineNumber: 105,
                                        columnNumber: 37
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/landing/LandingNavBar.tsx",
                                lineNumber: 81,
                                columnNumber: 29
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/components/landing/LandingNavBar.tsx",
                            lineNumber: 78,
                            columnNumber: 25
                        }, this) : // Not logged in
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                    href: "/sign-in",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$Button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                        variant: "secondary",
                                        className: "rounded-full bg-white text-blue-600 hover:bg-gray-200",
                                        children: "Log In"
                                    }, void 0, false, {
                                        fileName: "[project]/components/landing/LandingNavBar.tsx",
                                        lineNumber: 138,
                                        columnNumber: 33
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/components/landing/LandingNavBar.tsx",
                                    lineNumber: 137,
                                    columnNumber: 29
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                    href: "/sign-up",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$Button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                        variant: "default",
                                        className: "rounded-full",
                                        children: "Sign Up"
                                    }, void 0, false, {
                                        fileName: "[project]/components/landing/LandingNavBar.tsx",
                                        lineNumber: 143,
                                        columnNumber: 33
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/components/landing/LandingNavBar.tsx",
                                    lineNumber: 142,
                                    columnNumber: 29
                                }, this)
                            ]
                        }, void 0, true)
                    }, void 0, false, {
                        fileName: "[project]/components/landing/LandingNavBar.tsx",
                        lineNumber: 66,
                        columnNumber: 17
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/landing/LandingNavBar.tsx",
                lineNumber: 56,
                columnNumber: 13
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/landing/LandingNavBar.tsx",
        lineNumber: 44,
        columnNumber: 9
    }, this);
};
_s(LandingNavBar, "73GJMrRT70ze1AvOCoQrekEuKM4=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2d$auth$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSession"]
    ];
});
_c = LandingNavBar;
const __TURBOPACK__default__export__ = LandingNavBar;
var _c;
__turbopack_context__.k.register(_c, "LandingNavBar");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/constants/programData.ts [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "programs": (()=>programs)
});
const programs = [
    {
        _id: '1',
        code: 'ANIM001',
        name: '3D Animation',
        description: 'Comprehensive program covering 3D modeling, animation techniques, rigging, and visual effects for film, television, and gaming industries.',
        credits: 6,
        level: '2',
        difficulty: 'intermediate',
        delivery: [
            'in-person',
            'hybrid'
        ],
        language: 'english',
        school: {
            name: 'Seneca Polytechnic',
            shortName: 'Seneca'
        },
        programs: [
            {
                program: {
                    name: 'Creative Arts, Animation & Design',
                    code: 'CAAD'
                },
                semester: 1
            }
        ],
        professors: [
            {
                name: 'Prof. Michael Chen',
                rating: 4.2
            }
        ],
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
        delivery: [
            'in-person'
        ],
        language: 'english',
        school: {
            name: 'Seneca Polytechnic',
            shortName: 'Seneca'
        },
        programs: [
            {
                program: {
                    name: 'Law, Administration & Public Safety',
                    code: 'LAPS'
                },
                semester: 1
            }
        ],
        professors: [
            {
                name: 'Prof. Janet Rodriguez',
                rating: 4.5
            }
        ],
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
        delivery: [
            'in-person',
            'online'
        ],
        language: 'english',
        school: {
            name: 'Seneca Polytechnic',
            shortName: 'Seneca'
        },
        programs: [
            {
                program: {
                    name: 'Liberal Arts & University Transfers',
                    code: 'LAUT'
                },
                semester: 1
            }
        ],
        professors: [
            {
                name: 'Prof. Sarah Williams',
                rating: 4.0
            }
        ],
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
        delivery: [
            'in-person',
            'online'
        ],
        language: 'english',
        school: {
            name: 'Seneca Polytechnic',
            shortName: 'Seneca'
        },
        programs: [
            {
                program: {
                    name: 'Business',
                    code: 'BUS'
                },
                semester: 1
            }
        ],
        professors: [
            {
                name: 'Prof. David Thompson',
                rating: 4.3
            }
        ],
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
        delivery: [
            'in-person',
            'hybrid'
        ],
        language: 'english',
        school: {
            name: 'Seneca Polytechnic',
            shortName: 'Seneca'
        },
        programs: [
            {
                program: {
                    name: 'Business',
                    code: 'BUS'
                },
                semester: 1
            }
        ],
        professors: [
            {
                name: 'Prof. Lisa Chang',
                rating: 4.4
            }
        ],
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
        delivery: [
            'in-person',
            'online'
        ],
        language: 'english',
        school: {
            name: 'Seneca Polytechnic',
            shortName: 'Seneca'
        },
        programs: [
            {
                program: {
                    name: 'Business',
                    code: 'BUS'
                },
                semester: 1
            }
        ],
        professors: [
            {
                name: 'Prof. Robert Kim',
                rating: 4.1
            }
        ],
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
        delivery: [
            'in-person'
        ],
        language: 'english',
        school: {
            name: 'Seneca Polytechnic',
            shortName: 'Seneca'
        },
        programs: [
            {
                program: {
                    name: 'Creative Arts, Animation & Design',
                    code: 'CAAD'
                },
                semester: 1
            }
        ],
        professors: [
            {
                name: 'Prof. Maria Santos',
                rating: 4.6
            }
        ],
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
        delivery: [
            'in-person'
        ],
        language: 'english',
        school: {
            name: 'Seneca Polytechnic',
            shortName: 'Seneca'
        },
        programs: [
            {
                program: {
                    name: 'Law, Administration & Public Safety',
                    code: 'LAPS'
                },
                semester: 1
            }
        ],
        professors: [
            {
                name: 'Prof. James Wilson',
                rating: 4.5
            }
        ],
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
        delivery: [
            'in-person',
            'hybrid'
        ],
        language: 'english',
        school: {
            name: 'Seneca Polytechnic',
            shortName: 'Seneca'
        },
        programs: [
            {
                program: {
                    name: 'Creative Arts, Animation & Design',
                    code: 'CAAD'
                },
                semester: 1
            }
        ],
        professors: [
            {
                name: 'Prof. Alex Turner',
                rating: 4.3
            }
        ],
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
        delivery: [
            'in-person'
        ],
        language: 'english',
        school: {
            name: 'Seneca Polytechnic',
            shortName: 'Seneca'
        },
        programs: [
            {
                program: {
                    name: 'Creative Arts, Animation & Design',
                    code: 'CAAD'
                },
                semester: 1
            }
        ],
        professors: [
            {
                name: 'Prof. Emma Davis',
                rating: 4.1
            }
        ],
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
        delivery: [
            'in-person',
            'online'
        ],
        language: 'english',
        school: {
            name: 'Seneca Polytechnic',
            shortName: 'Seneca'
        },
        programs: [
            {
                program: {
                    name: 'Information Technology',
                    code: 'IT'
                },
                semester: 1
            }
        ],
        professors: [
            {
                name: 'Prof. Dr. Sarah Johnson',
                rating: 4.7
            }
        ],
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
        delivery: [
            'in-person',
            'online'
        ],
        language: 'english',
        school: {
            name: 'Seneca Polytechnic',
            shortName: 'Seneca'
        },
        programs: [
            {
                program: {
                    name: 'Liberal Arts & University Transfers',
                    code: 'LAUT'
                },
                semester: 1
            }
        ],
        professors: [
            {
                name: 'Prof. Jennifer Brown',
                rating: 3.9
            }
        ],
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
        delivery: [
            'in-person',
            'hybrid'
        ],
        language: 'english',
        school: {
            name: 'Seneca Polytechnic',
            shortName: 'Seneca'
        },
        programs: [
            {
                program: {
                    name: 'Business',
                    code: 'BUS'
                },
                semester: 1
            }
        ],
        professors: [
            {
                name: 'Prof. Mark Johnson',
                rating: 4.2
            }
        ],
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
        delivery: [
            'in-person'
        ],
        language: 'english',
        school: {
            name: 'Seneca Polytechnic',
            shortName: 'Seneca'
        },
        programs: [
            {
                program: {
                    name: 'Aviation',
                    code: 'AVIA'
                },
                semester: 1
            }
        ],
        professors: [
            {
                name: 'Prof. Captain John Smith',
                rating: 4.4
            }
        ],
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
        delivery: [
            'in-person'
        ],
        language: 'english',
        school: {
            name: 'Seneca Polytechnic',
            shortName: 'Seneca'
        },
        programs: [
            {
                program: {
                    name: 'Aviation',
                    code: 'AVIA'
                },
                semester: 1
            }
        ],
        professors: [
            {
                name: 'Prof. Sarah Mitchell',
                rating: 4.6
            }
        ],
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
        delivery: [
            'in-person',
            'hybrid'
        ],
        language: 'english',
        school: {
            name: 'Seneca Polytechnic',
            shortName: 'Seneca'
        },
        programs: [
            {
                program: {
                    name: 'Business',
                    code: 'BUS'
                },
                semester: 1
            }
        ],
        professors: [
            {
                name: 'Prof. Dr. Patricia Lee',
                rating: 4.5
            }
        ],
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
        delivery: [
            'in-person',
            'hybrid'
        ],
        language: 'english',
        school: {
            name: 'Seneca Polytechnic',
            shortName: 'Seneca'
        },
        programs: [
            {
                program: {
                    name: 'Information Technology',
                    code: 'IT'
                },
                semester: 1
            }
        ],
        professors: [
            {
                name: 'Prof. Dr. Michael Wang',
                rating: 4.6
            }
        ],
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
        delivery: [
            'in-person'
        ],
        language: 'english',
        school: {
            name: 'Seneca Polytechnic',
            shortName: 'Seneca'
        },
        programs: [
            {
                program: {
                    name: 'Engineering Technology',
                    code: 'ENGR'
                },
                semester: 1
            }
        ],
        professors: [
            {
                name: 'Prof. Dr. Ahmed Hassan',
                rating: 4.7
            }
        ],
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
        delivery: [
            'in-person',
            'hybrid'
        ],
        language: 'english',
        school: {
            name: 'Seneca Polytechnic',
            shortName: 'Seneca'
        },
        programs: [
            {
                program: {
                    name: 'Science',
                    code: 'SCI'
                },
                semester: 1
            }
        ],
        professors: [
            {
                name: 'Prof. Dr. Lisa Park',
                rating: 4.3
            }
        ],
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
        delivery: [
            'in-person',
            'online'
        ],
        language: 'english',
        school: {
            name: 'Seneca Polytechnic',
            shortName: 'Seneca'
        },
        programs: [
            {
                program: {
                    name: 'Education, Community & Social Services',
                    code: 'ECSS'
                },
                semester: 1
            }
        ],
        professors: [
            {
                name: 'Prof. Dr. Rachel Green',
                rating: 4.1
            }
        ],
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
        delivery: [
            'in-person'
        ],
        language: 'english',
        school: {
            name: 'Seneca Polytechnic',
            shortName: 'Seneca'
        },
        programs: [
            {
                program: {
                    name: 'Science',
                    code: 'SCI'
                },
                semester: 1
            }
        ],
        professors: [
            {
                name: 'Prof. Dr. Thomas Anderson',
                rating: 4.4
            }
        ],
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
        delivery: [
            'in-person',
            'hybrid'
        ],
        language: 'english',
        school: {
            name: 'Seneca Polytechnic',
            shortName: 'Seneca'
        },
        programs: [
            {
                program: {
                    name: 'Business',
                    code: 'BUS'
                },
                semester: 1
            }
        ],
        professors: [
            {
                name: 'Prof. Amanda White',
                rating: 4.2
            }
        ],
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
        delivery: [
            'in-person'
        ],
        language: 'english',
        school: {
            name: 'Seneca Polytechnic',
            shortName: 'Seneca'
        },
        programs: [
            {
                program: {
                    name: 'Media & Communications',
                    code: 'MCOM'
                },
                semester: 1
            }
        ],
        professors: [
            {
                name: 'Prof. Steve Morrison',
                rating: 4.3
            }
        ],
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
        delivery: [
            'in-person'
        ],
        language: 'english',
        school: {
            name: 'Seneca Polytechnic',
            shortName: 'Seneca'
        },
        programs: [
            {
                program: {
                    name: 'Media & Communications',
                    code: 'MCOM'
                },
                semester: 1
            }
        ],
        professors: [
            {
                name: 'Prof. Diana Rodriguez',
                rating: 4.4
            }
        ],
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
        delivery: [
            'in-person'
        ],
        language: 'english',
        school: {
            name: 'Seneca Polytechnic',
            shortName: 'Seneca'
        },
        programs: [
            {
                program: {
                    name: 'Engineering Technology',
                    code: 'ENGR'
                },
                semester: 1
            }
        ],
        professors: [
            {
                name: 'Prof. Robert Chen',
                rating: 4.1
            }
        ],
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
        delivery: [
            'in-person',
            'online'
        ],
        language: 'english',
        school: {
            name: 'Seneca Polytechnic',
            shortName: 'Seneca'
        },
        programs: [
            {
                program: {
                    name: 'Business',
                    code: 'BUS'
                },
                semester: 1
            }
        ],
        professors: [
            {
                name: 'Prof. Karen Taylor',
                rating: 4.0
            }
        ],
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
        delivery: [
            'in-person',
            'hybrid'
        ],
        language: 'english',
        school: {
            name: 'Seneca Polytechnic',
            shortName: 'Seneca'
        },
        programs: [
            {
                program: {
                    name: 'Business',
                    code: 'BUS'
                },
                semester: 1
            }
        ],
        professors: [
            {
                name: 'Prof. Michelle Adams',
                rating: 4.2
            }
        ],
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
        delivery: [
            'in-person',
            'online'
        ],
        language: 'english',
        school: {
            name: 'Seneca Polytechnic',
            shortName: 'Seneca'
        },
        programs: [
            {
                program: {
                    name: 'Business',
                    code: 'BUS'
                },
                semester: 1
            }
        ],
        professors: [
            {
                name: 'Prof. Daniel Wilson',
                rating: 4.3
            }
        ],
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
        delivery: [
            'in-person',
            'hybrid'
        ],
        language: 'english',
        school: {
            name: 'Seneca Polytechnic',
            shortName: 'Seneca'
        },
        programs: [
            {
                program: {
                    name: 'Business',
                    code: 'BUS'
                },
                semester: 1
            }
        ],
        professors: [
            {
                name: 'Prof. Maria Gonzalez',
                rating: 4.4
            }
        ],
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
        delivery: [
            'in-person',
            'online'
        ],
        language: 'english',
        school: {
            name: 'Seneca Polytechnic',
            shortName: 'Seneca'
        },
        programs: [
            {
                program: {
                    name: 'Business',
                    code: 'BUS'
                },
                semester: 1
            }
        ],
        professors: [
            {
                name: 'Prof. James Peterson',
                rating: 4.1
            }
        ],
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
        delivery: [
            'in-person',
            'hybrid'
        ],
        language: 'english',
        school: {
            name: 'Seneca Polytechnic',
            shortName: 'Seneca'
        },
        programs: [
            {
                program: {
                    name: 'Business',
                    code: 'BUS'
                },
                semester: 1
            }
        ],
        professors: [
            {
                name: 'Prof. Sarah Kim',
                rating: 4.3
            }
        ],
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
        delivery: [
            'in-person',
            'hybrid'
        ],
        language: 'english',
        school: {
            name: 'Seneca Polytechnic',
            shortName: 'Seneca'
        },
        programs: [
            {
                program: {
                    name: 'Business',
                    code: 'BUS'
                },
                semester: 1
            }
        ],
        professors: [
            {
                name: 'Prof. Kevin Liu',
                rating: 4.2
            }
        ],
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
        delivery: [
            'in-person',
            'online'
        ],
        language: 'english',
        school: {
            name: 'Seneca Polytechnic',
            shortName: 'Seneca'
        },
        programs: [
            {
                program: {
                    name: 'Business',
                    code: 'BUS'
                },
                semester: 1
            }
        ],
        professors: [
            {
                name: 'Prof. Dr. Angela Chen',
                rating: 4.5
            }
        ],
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
        delivery: [
            'in-person',
            'hybrid'
        ],
        language: 'english',
        school: {
            name: 'Seneca Polytechnic',
            shortName: 'Seneca'
        },
        programs: [
            {
                program: {
                    name: 'Information Technology',
                    code: 'IT'
                },
                semester: 1
            }
        ],
        professors: [
            {
                name: 'Prof. Richard Park',
                rating: 4.3
            }
        ],
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
        delivery: [
            'in-person',
            'online'
        ],
        language: 'english',
        school: {
            name: 'Seneca Polytechnic',
            shortName: 'Seneca'
        },
        programs: [
            {
                program: {
                    name: 'Business',
                    code: 'BUS'
                },
                semester: 1
            }
        ],
        professors: [
            {
                name: 'Prof. Carol Thompson',
                rating: 4.1
            }
        ],
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
        delivery: [
            'in-person',
            'hybrid'
        ],
        language: 'english',
        school: {
            name: 'Seneca Polytechnic',
            shortName: 'Seneca'
        },
        programs: [
            {
                program: {
                    name: 'Business',
                    code: 'BUS'
                },
                semester: 1
            }
        ],
        professors: [
            {
                name: 'Prof. Tony Martinez',
                rating: 4.4
            }
        ],
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
        delivery: [
            'in-person',
            'online'
        ],
        language: 'english',
        school: {
            name: 'Seneca Polytechnic',
            shortName: 'Seneca'
        },
        programs: [
            {
                program: {
                    name: 'Business',
                    code: 'BUS'
                },
                semester: 1
            }
        ],
        professors: [
            {
                name: 'Prof. Linda Johnson',
                rating: 4.0
            }
        ],
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
        delivery: [
            'in-person',
            'hybrid'
        ],
        language: 'english',
        school: {
            name: 'Seneca Polytechnic',
            shortName: 'Seneca'
        },
        programs: [
            {
                program: {
                    name: 'Business',
                    code: 'BUS'
                },
                semester: 1
            }
        ],
        professors: [
            {
                name: 'Prof. Elena Petrov',
                rating: 4.3
            }
        ],
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
        delivery: [
            'in-person',
            'online'
        ],
        language: 'english',
        school: {
            name: 'Seneca Polytechnic',
            shortName: 'Seneca'
        },
        programs: [
            {
                program: {
                    name: 'Business',
                    code: 'BUS'
                },
                semester: 1
            }
        ],
        professors: [
            {
                name: 'Prof. Michael Davis',
                rating: 4.2
            }
        ],
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
        delivery: [
            'in-person',
            'hybrid'
        ],
        language: 'english',
        school: {
            name: 'Seneca Polytechnic',
            shortName: 'Seneca'
        },
        programs: [
            {
                program: {
                    name: 'Business',
                    code: 'BUS'
                },
                semester: 1
            }
        ],
        professors: [
            {
                name: 'Prof. Robert Singh',
                rating: 4.1
            }
        ],
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
        delivery: [
            'in-person'
        ],
        language: 'english',
        school: {
            name: 'Seneca Polytechnic',
            shortName: 'Seneca'
        },
        programs: [
            {
                program: {
                    name: 'Science',
                    code: 'SCI'
                },
                semester: 1
            }
        ],
        professors: [
            {
                name: 'Prof. Dr. Jennifer Walsh',
                rating: 4.2
            }
        ],
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
        delivery: [
            'in-person'
        ],
        language: 'english',
        school: {
            name: 'Seneca Polytechnic',
            shortName: 'Seneca'
        },
        programs: [
            {
                program: {
                    name: 'Engineering Technology',
                    code: 'ENGR'
                },
                semester: 1
            }
        ],
        professors: [
            {
                name: 'Prof. Dr. Hassan Ali',
                rating: 4.3
            }
        ],
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
        delivery: [
            'in-person'
        ],
        language: 'english',
        school: {
            name: 'Seneca Polytechnic',
            shortName: 'Seneca'
        },
        programs: [
            {
                program: {
                    name: 'Science',
                    code: 'SCI'
                },
                semester: 1
            }
        ],
        professors: [
            {
                name: 'Prof. Maria Rodriguez',
                rating: 4.1
            }
        ],
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
        delivery: [
            'in-person'
        ],
        language: 'english',
        school: {
            name: 'Seneca Polytechnic',
            shortName: 'Seneca'
        },
        programs: [
            {
                program: {
                    name: 'Science',
                    code: 'SCI'
                },
                semester: 1
            }
        ],
        professors: [
            {
                name: 'Prof. Dr. Susan Lee',
                rating: 4.4
            }
        ],
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
        delivery: [
            'in-person',
            'hybrid'
        ],
        language: 'english',
        school: {
            name: 'Seneca Polytechnic',
            shortName: 'Seneca'
        },
        programs: [
            {
                program: {
                    name: 'Education, Community & Social Services',
                    code: 'ECSS'
                },
                semester: 1
            }
        ],
        professors: [
            {
                name: 'Prof. Karen Mitchell',
                rating: 4.5
            }
        ],
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
        delivery: [
            'in-person'
        ],
        language: 'english',
        school: {
            name: 'Seneca Polytechnic',
            shortName: 'Seneca'
        },
        programs: [
            {
                program: {
                    name: 'Education, Community & Social Services',
                    code: 'ECSS'
                },
                semester: 1
            }
        ],
        professors: [
            {
                name: 'Prof. Lisa Thompson',
                rating: 4.3
            }
        ],
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
        delivery: [
            'in-person'
        ],
        language: 'english',
        school: {
            name: 'Seneca Polytechnic',
            shortName: 'Seneca'
        },
        programs: [
            {
                program: {
                    name: 'Engineering Technology',
                    code: 'ENGR'
                },
                semester: 1
            }
        ],
        professors: [
            {
                name: 'Prof. Andrew Wilson',
                rating: 4.2
            }
        ],
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
        delivery: [
            'in-person'
        ],
        language: 'english',
        school: {
            name: 'Seneca Polytechnic',
            shortName: 'Seneca'
        },
        programs: [
            {
                program: {
                    name: 'Engineering Technology',
                    code: 'ENGR'
                },
                semester: 1
            }
        ],
        professors: [
            {
                name: 'Prof. Dr. Robert Zhang',
                rating: 4.4
            }
        ],
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
        delivery: [
            'in-person',
            'online'
        ],
        language: 'english',
        school: {
            name: 'Seneca Polytechnic',
            shortName: 'Seneca'
        },
        programs: [
            {
                program: {
                    name: 'Health & Wellness',
                    code: 'HW'
                },
                semester: 1
            }
        ],
        professors: [
            {
                name: 'Prof. Dr. Patricia Kim',
                rating: 4.5
            }
        ],
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
        delivery: [
            'in-person',
            'online'
        ],
        language: 'english',
        school: {
            name: 'Seneca Polytechnic',
            shortName: 'Seneca'
        },
        programs: [
            {
                program: {
                    name: 'Information Technology',
                    code: 'IT'
                },
                semester: 1
            }
        ],
        professors: [
            {
                name: 'Prof. Dr. Jason Park',
                rating: 4.6
            }
        ],
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
        delivery: [
            'in-person'
        ],
        language: 'english',
        school: {
            name: 'Seneca Polytechnic',
            shortName: 'Seneca'
        },
        programs: [
            {
                program: {
                    name: 'Information Technology',
                    code: 'IT'
                },
                semester: 1
            }
        ],
        professors: [
            {
                name: 'Prof. Mark Anderson',
                rating: 4.3
            }
        ],
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
        delivery: [
            'in-person',
            'online'
        ],
        language: 'english',
        school: {
            name: 'Seneca Polytechnic',
            shortName: 'Seneca'
        },
        programs: [
            {
                program: {
                    name: 'Information Technology',
                    code: 'IT'
                },
                semester: 1
            }
        ],
        professors: [
            {
                name: 'Prof. Daniel Chen',
                rating: 4.4
            }
        ],
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
        delivery: [
            'in-person',
            'hybrid'
        ],
        language: 'english',
        school: {
            name: 'Seneca Polytechnic',
            shortName: 'Seneca'
        },
        programs: [
            {
                program: {
                    name: 'Information Technology',
                    code: 'IT'
                },
                semester: 1
            }
        ],
        professors: [
            {
                name: 'Prof. Dr. Michelle Wang',
                rating: 4.5
            }
        ],
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
        delivery: [
            'in-person'
        ],
        language: 'english',
        school: {
            name: 'Seneca Polytechnic',
            shortName: 'Seneca'
        },
        programs: [
            {
                program: {
                    name: 'Information Technology',
                    code: 'IT'
                },
                semester: 1
            }
        ],
        professors: [
            {
                name: 'Prof. Steve Johnson',
                rating: 4.1
            }
        ],
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
        delivery: [
            'in-person',
            'hybrid'
        ],
        language: 'english',
        school: {
            name: 'Seneca Polytechnic',
            shortName: 'Seneca'
        },
        programs: [
            {
                program: {
                    name: 'Information Technology',
                    code: 'IT'
                },
                semester: 1
            }
        ],
        professors: [
            {
                name: 'Prof. Dr. Kevin Liu',
                rating: 4.4
            }
        ],
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
        delivery: [
            'in-person'
        ],
        language: 'english',
        school: {
            name: 'Seneca Polytechnic',
            shortName: 'Seneca'
        },
        programs: [
            {
                program: {
                    name: 'Science',
                    code: 'SCI'
                },
                semester: 1
            }
        ],
        professors: [
            {
                name: 'Prof. Dr. Angela Martinez',
                rating: 4.2
            }
        ],
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
        delivery: [
            'in-person'
        ],
        language: 'english',
        school: {
            name: 'Seneca Polytechnic',
            shortName: 'Seneca'
        },
        programs: [
            {
                program: {
                    name: 'Fashion & Esthetics',
                    code: 'FE'
                },
                semester: 1
            }
        ],
        professors: [
            {
                name: 'Prof. Isabella Garcia',
                rating: 4.3
            }
        ],
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
        delivery: [
            'in-person',
            'hybrid'
        ],
        language: 'english',
        school: {
            name: 'Seneca Polytechnic',
            shortName: 'Seneca'
        },
        programs: [
            {
                program: {
                    name: 'Creative Arts, Animation & Design',
                    code: 'CAAD'
                },
                semester: 1
            }
        ],
        professors: [
            {
                name: 'Prof. Ryan O\'Connor',
                rating: 4.4
            }
        ],
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
        delivery: [
            'in-person',
            'online'
        ],
        language: 'english',
        school: {
            name: 'Seneca Polytechnic',
            shortName: 'Seneca'
        },
        programs: [
            {
                program: {
                    name: 'Information Technology',
                    code: 'IT'
                },
                semester: 1
            }
        ],
        professors: [
            {
                name: 'Prof. Dr. Sarah Kim',
                rating: 4.6
            }
        ],
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
        delivery: [
            'in-person',
            'online'
        ],
        language: 'english',
        school: {
            name: 'Seneca Polytechnic',
            shortName: 'Seneca'
        },
        programs: [
            {
                program: {
                    name: 'Information Technology',
                    code: 'IT'
                },
                semester: 1
            }
        ],
        professors: [
            {
                name: 'Prof. Thomas Lee',
                rating: 4.3
            }
        ],
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
        delivery: [
            'in-person',
            'online'
        ],
        language: 'english',
        school: {
            name: 'Seneca Polytechnic',
            shortName: 'Seneca'
        },
        programs: [
            {
                program: {
                    name: 'Media & Communications',
                    code: 'MCOM'
                },
                semester: 1
            }
        ],
        professors: [
            {
                name: 'Prof. Ashley Wong',
                rating: 4.4
            }
        ],
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
        delivery: [
            'in-person'
        ],
        language: 'english',
        school: {
            name: 'Seneca Polytechnic',
            shortName: 'Seneca'
        },
        programs: [
            {
                program: {
                    name: 'Media & Communications',
                    code: 'MCOM'
                },
                semester: 1
            }
        ],
        professors: [
            {
                name: 'Prof. Michael Roberts',
                rating: 4.5
            }
        ],
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
        delivery: [
            'in-person'
        ],
        language: 'english',
        school: {
            name: 'Seneca Polytechnic',
            shortName: 'Seneca'
        },
        programs: [
            {
                program: {
                    name: 'Media & Communications',
                    code: 'MCOM'
                },
                semester: 1
            }
        ],
        professors: [
            {
                name: 'Prof. David Martinez',
                rating: 4.6
            }
        ],
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
        delivery: [
            'in-person',
            'hybrid'
        ],
        language: 'english',
        school: {
            name: 'Seneca Polytechnic',
            shortName: 'Seneca'
        },
        programs: [
            {
                program: {
                    name: 'Education, Community & Social Services',
                    code: 'ECSS'
                },
                semester: 1
            }
        ],
        professors: [
            {
                name: 'Prof. Mary Johnson',
                rating: 4.4
            }
        ],
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
        delivery: [
            'in-person',
            'online'
        ],
        language: 'english',
        school: {
            name: 'Seneca Polytechnic',
            shortName: 'Seneca'
        },
        programs: [
            {
                program: {
                    name: 'Education, Community & Social Services',
                    code: 'ECSS'
                },
                semester: 1
            }
        ],
        professors: [
            {
                name: 'Prof. Linda Thompson',
                rating: 4.2
            }
        ],
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
        delivery: [
            'in-person'
        ],
        language: 'english',
        school: {
            name: 'Seneca Polytechnic',
            shortName: 'Seneca'
        },
        programs: [
            {
                program: {
                    name: 'Engineering Technology',
                    code: 'ENGR'
                },
                semester: 1
            }
        ],
        professors: [
            {
                name: 'Prof. Dr. Roberto Silva',
                rating: 4.5
            }
        ],
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
        delivery: [
            'in-person'
        ],
        language: 'english',
        school: {
            name: 'Seneca Polytechnic',
            shortName: 'Seneca'
        },
        programs: [
            {
                program: {
                    name: 'Engineering Technology',
                    code: 'ENGR'
                },
                semester: 1
            }
        ],
        professors: [
            {
                name: 'Prof. James Wilson',
                rating: 4.2
            }
        ],
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
        delivery: [
            'in-person'
        ],
        language: 'english',
        school: {
            name: 'Seneca Polytechnic',
            shortName: 'Seneca'
        },
        programs: [
            {
                program: {
                    name: 'Engineering Technology',
                    code: 'ENGR'
                },
                semester: 1
            }
        ],
        professors: [
            {
                name: 'Prof. Dr. Susan Chen',
                rating: 4.4
            }
        ],
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
        delivery: [
            'in-person'
        ],
        language: 'english',
        school: {
            name: 'Seneca Polytechnic',
            shortName: 'Seneca'
        },
        programs: [
            {
                program: {
                    name: 'Science',
                    code: 'SCI'
                },
                semester: 1
            }
        ],
        professors: [
            {
                name: 'Prof. Jennifer Green',
                rating: 4.1
            }
        ],
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
        delivery: [
            'in-person'
        ],
        language: 'english',
        school: {
            name: 'Seneca Polytechnic',
            shortName: 'Seneca'
        },
        programs: [
            {
                program: {
                    name: 'Science',
                    code: 'SCI'
                },
                semester: 1
            }
        ],
        professors: [
            {
                name: 'Prof. Mark Davis',
                rating: 4.2
            }
        ],
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
        delivery: [
            'in-person',
            'hybrid'
        ],
        language: 'english',
        school: {
            name: 'Seneca Polytechnic',
            shortName: 'Seneca'
        },
        programs: [
            {
                program: {
                    name: 'Science',
                    code: 'SCI'
                },
                semester: 1
            }
        ],
        professors: [
            {
                name: 'Prof. Dr. Patricia Rodriguez',
                rating: 4.3
            }
        ],
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
        delivery: [
            'in-person',
            'online'
        ],
        language: 'english',
        school: {
            name: 'Seneca Polytechnic',
            shortName: 'Seneca'
        },
        programs: [
            {
                program: {
                    name: 'Business',
                    code: 'BUS'
                },
                semester: 1
            }
        ],
        professors: [
            {
                name: 'Prof. Alex Kim',
                rating: 4.3
            }
        ],
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
        delivery: [
            'in-person'
        ],
        language: 'english',
        school: {
            name: 'Seneca Polytechnic',
            shortName: 'Seneca'
        },
        programs: [
            {
                program: {
                    name: 'Fashion & Esthetics',
                    code: 'FE'
                },
                semester: 1
            }
        ],
        professors: [
            {
                name: 'Prof. Maria Santos',
                rating: 4.4
            }
        ],
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
        delivery: [
            'in-person'
        ],
        language: 'english',
        school: {
            name: 'Seneca Polytechnic',
            shortName: 'Seneca'
        },
        programs: [
            {
                program: {
                    name: 'Fashion & Esthetics',
                    code: 'FE'
                },
                semester: 1
            }
        ],
        professors: [
            {
                name: 'Prof. Dr. Angela White',
                rating: 4.5
            }
        ],
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
        delivery: [
            'in-person'
        ],
        language: 'english',
        school: {
            name: 'Seneca Polytechnic',
            shortName: 'Seneca'
        },
        programs: [
            {
                program: {
                    name: 'Media & Communications',
                    code: 'MCOM'
                },
                semester: 1
            }
        ],
        professors: [
            {
                name: 'Prof. Rachel Brown',
                rating: 4.3
            }
        ],
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
        delivery: [
            'in-person',
            'hybrid'
        ],
        language: 'english',
        school: {
            name: 'Seneca Polytechnic',
            shortName: 'Seneca'
        },
        programs: [
            {
                program: {
                    name: 'Creative Arts, Animation & Design',
                    code: 'CAAD'
                },
                semester: 1
            }
        ],
        professors: [
            {
                name: 'Prof. Sophie Turner',
                rating: 4.4
            }
        ],
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
        delivery: [
            'in-person'
        ],
        language: 'english',
        school: {
            name: 'Seneca Polytechnic',
            shortName: 'Seneca'
        },
        programs: [
            {
                program: {
                    name: 'Fashion & Esthetics',
                    code: 'FE'
                },
                semester: 1
            }
        ],
        professors: [
            {
                name: 'Prof. Isabella Martinez',
                rating: 4.3
            }
        ],
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
        delivery: [
            'in-person',
            'hybrid'
        ],
        language: 'english',
        school: {
            name: 'Seneca Polytechnic',
            shortName: 'Seneca'
        },
        programs: [
            {
                program: {
                    name: 'Fashion & Esthetics',
                    code: 'FE'
                },
                semester: 1
            }
        ],
        professors: [
            {
                name: 'Prof. Victoria Chen',
                rating: 4.2
            }
        ],
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
        delivery: [
            'in-person',
            'hybrid'
        ],
        language: 'english',
        school: {
            name: 'Seneca Polytechnic',
            shortName: 'Seneca'
        },
        programs: [
            {
                program: {
                    name: 'Fashion & Esthetics',
                    code: 'FE'
                },
                semester: 1
            }
        ],
        professors: [
            {
                name: 'Prof. Amanda Johnson',
                rating: 4.3
            }
        ],
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
        delivery: [
            'in-person',
            'online'
        ],
        language: 'english',
        school: {
            name: 'Seneca Polytechnic',
            shortName: 'Seneca'
        },
        programs: [
            {
                program: {
                    name: 'Fashion & Esthetics',
                    code: 'FE'
                },
                semester: 1
            }
        ],
        professors: [
            {
                name: 'Prof. Dr. Emma Wilson',
                rating: 4.1
            }
        ],
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
        delivery: [
            'in-person',
            'online'
        ],
        language: 'english',
        school: {
            name: 'Seneca Polytechnic',
            shortName: 'Seneca'
        },
        programs: [
            {
                program: {
                    name: 'Business',
                    code: 'BUS'
                },
                semester: 1
            }
        ],
        professors: [
            {
                name: 'Prof. Robert Anderson',
                rating: 4.4
            }
        ],
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
        delivery: [
            'in-person',
            'hybrid'
        ],
        language: 'english',
        school: {
            name: 'Seneca Polytechnic',
            shortName: 'Seneca'
        },
        programs: [
            {
                program: {
                    name: 'Business',
                    code: 'BUS'
                },
                semester: 1
            }
        ],
        professors: [
            {
                name: 'Prof. Lisa Park',
                rating: 4.2
            }
        ],
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
        delivery: [
            'in-person',
            'online'
        ],
        language: 'english',
        school: {
            name: 'Seneca Polytechnic',
            shortName: 'Seneca'
        },
        programs: [
            {
                program: {
                    name: 'Business',
                    code: 'BUS'
                },
                semester: 1
            }
        ],
        professors: [
            {
                name: 'Prof. Michelle Wong',
                rating: 4.1
            }
        ],
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
        delivery: [
            'in-person',
            'online'
        ],
        language: 'english',
        school: {
            name: 'Seneca Polytechnic',
            shortName: 'Seneca'
        },
        programs: [
            {
                program: {
                    name: 'Information Technology',
                    code: 'IT'
                },
                semester: 1
            }
        ],
        professors: [
            {
                name: 'Prof. Dr. Kevin Zhang',
                rating: 4.5
            }
        ],
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
        delivery: [
            'in-person'
        ],
        language: 'english',
        school: {
            name: 'Seneca Polytechnic',
            shortName: 'Seneca'
        },
        programs: [
            {
                program: {
                    name: 'Engineering Technology',
                    code: 'ENGR'
                },
                semester: 1
            }
        ],
        professors: [
            {
                name: 'Prof. Captain Mike Davis',
                rating: 4.3
            }
        ],
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
        delivery: [
            'in-person'
        ],
        language: 'english',
        school: {
            name: 'Seneca Polytechnic',
            shortName: 'Seneca'
        },
        programs: [
            {
                program: {
                    name: 'Engineering Technology',
                    code: 'ENGR'
                },
                semester: 1
            }
        ],
        professors: [
            {
                name: 'Prof. Dr. Sandra Mitchell',
                rating: 4.4
            }
        ],
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
        delivery: [
            'in-person'
        ],
        language: 'english',
        school: {
            name: 'Seneca Polytechnic',
            shortName: 'Seneca'
        },
        programs: [
            {
                program: {
                    name: 'Law, Administration & Public Safety',
                    code: 'LAPS'
                },
                semester: 1
            }
        ],
        professors: [
            {
                name: 'Prof. Chief Robert Wilson',
                rating: 4.6
            }
        ],
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
        delivery: [
            'in-person',
            'hybrid'
        ],
        language: 'english',
        school: {
            name: 'Seneca Polytechnic',
            shortName: 'Seneca'
        },
        programs: [
            {
                program: {
                    name: 'Health & Wellness',
                    code: 'HW'
                },
                semester: 1
            }
        ],
        professors: [
            {
                name: 'Prof. Dr. Lisa Johnson',
                rating: 4.3
            }
        ],
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
        delivery: [
            'in-person'
        ],
        language: 'english',
        school: {
            name: 'Seneca Polytechnic',
            shortName: 'Seneca'
        },
        programs: [
            {
                program: {
                    name: 'Aviation',
                    code: 'AVIA'
                },
                semester: 1
            }
        ],
        professors: [
            {
                name: 'Prof. Captain Sarah Lee',
                rating: 4.4
            }
        ],
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
        delivery: [
            'in-person'
        ],
        language: 'english',
        school: {
            name: 'Seneca Polytechnic',
            shortName: 'Seneca'
        },
        programs: [
            {
                program: {
                    name: 'Aviation',
                    code: 'AVIA'
                },
                semester: 1
            }
        ],
        professors: [
            {
                name: 'Prof. Maria Rodriguez',
                rating: 4.3
            }
        ],
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
        delivery: [
            'in-person'
        ],
        language: 'english',
        school: {
            name: 'Seneca Polytechnic',
            shortName: 'Seneca'
        },
        programs: [
            {
                program: {
                    name: 'Creative Arts, Animation & Design',
                    code: 'CAAD'
                },
                semester: 1
            }
        ],
        professors: [
            {
                name: 'Prof. Jennifer Green',
                rating: 4.2
            }
        ],
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
        delivery: [
            'in-person',
            'hybrid'
        ],
        language: 'english',
        school: {
            name: 'Seneca Polytechnic',
            shortName: 'Seneca'
        },
        programs: [
            {
                program: {
                    name: 'Business',
                    code: 'BUS'
                },
                semester: 1
            }
        ],
        professors: [
            {
                name: 'Prof. Dr. Michael Thompson',
                rating: 4.5
            }
        ],
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
        delivery: [
            'in-person'
        ],
        language: 'english',
        school: {
            name: 'Seneca Polytechnic',
            shortName: 'Seneca'
        },
        programs: [
            {
                program: {
                    name: 'Creative Arts, Animation & Design',
                    code: 'CAAD'
                },
                semester: 1
            }
        ],
        professors: [
            {
                name: 'Prof. Alex Turner',
                rating: 4.4
            }
        ],
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
        delivery: [
            'in-person',
            'online'
        ],
        language: 'english',
        school: {
            name: 'Seneca Polytechnic',
            shortName: 'Seneca'
        },
        programs: [
            {
                program: {
                    name: 'Liberal Arts & University Transfers',
                    code: 'LAUT'
                },
                semester: 1
            }
        ],
        professors: [
            {
                name: 'Prof. Susan Miller',
                rating: 4.0
            }
        ],
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
        delivery: [
            'in-person',
            'online'
        ],
        language: 'english',
        school: {
            name: 'Seneca Polytechnic',
            shortName: 'Seneca'
        },
        programs: [
            {
                program: {
                    name: 'Liberal Arts & University Transfers',
                    code: 'LAUT'
                },
                semester: 1
            }
        ],
        professors: [
            {
                name: 'Prof. Jennifer Adams',
                rating: 3.8
            }
        ],
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
        delivery: [
            'in-person',
            'hybrid'
        ],
        language: 'english',
        school: {
            name: 'Seneca Polytechnic',
            shortName: 'Seneca'
        },
        programs: [
            {
                program: {
                    name: 'Business',
                    code: 'BUS'
                },
                semester: 1
            }
        ],
        professors: [
            {
                name: 'Prof. Dr. Elena Petrov',
                rating: 4.4
            }
        ],
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
        delivery: [
            'in-person',
            'hybrid'
        ],
        language: 'english',
        school: {
            name: 'Seneca Polytechnic',
            shortName: 'Seneca'
        },
        programs: [
            {
                program: {
                    name: 'Hospitality & Tourism',
                    code: 'HT'
                },
                semester: 1
            }
        ],
        professors: [
            {
                name: 'Prof. Maria Gonzalez',
                rating: 4.3
            }
        ],
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
        delivery: [
            'in-person',
            'hybrid'
        ],
        language: 'english',
        school: {
            name: 'Seneca Polytechnic',
            shortName: 'Seneca'
        },
        programs: [
            {
                program: {
                    name: 'Hospitality & Tourism',
                    code: 'HT'
                },
                semester: 1
            }
        ],
        professors: [
            {
                name: 'Prof. James Chen',
                rating: 4.2
            }
        ],
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
        delivery: [
            'in-person',
            'hybrid'
        ],
        language: 'english',
        school: {
            name: 'Seneca Polytechnic',
            shortName: 'Seneca'
        },
        programs: [
            {
                program: {
                    name: 'Hospitality & Tourism',
                    code: 'HT'
                },
                semester: 1
            }
        ],
        professors: [
            {
                name: 'Prof. Dr. Sarah Kim',
                rating: 4.5
            }
        ],
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
        delivery: [
            'in-person',
            'hybrid'
        ],
        language: 'english',
        school: {
            name: 'Seneca Polytechnic',
            shortName: 'Seneca'
        },
        programs: [
            {
                program: {
                    name: 'Law, Administration & Public Safety',
                    code: 'LAPS'
                },
                semester: 1
            }
        ],
        professors: [
            {
                name: 'Prof. Dr. Patricia Wilson',
                rating: 4.3
            }
        ],
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
        delivery: [
            'in-person',
            'hybrid'
        ],
        language: 'english',
        school: {
            name: 'Seneca Polytechnic',
            shortName: 'Seneca'
        },
        programs: [
            {
                program: {
                    name: 'Creative Arts, Animation & Design',
                    code: 'CAAD'
                },
                semester: 1
            }
        ],
        professors: [
            {
                name: 'Prof. Ryan Mitchell',
                rating: 4.4
            }
        ],
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
        delivery: [
            'in-person'
        ],
        language: 'english',
        school: {
            name: 'Seneca Polytechnic',
            shortName: 'Seneca'
        },
        programs: [
            {
                program: {
                    name: 'Aviation',
                    code: 'AVIA'
                },
                semester: 1
            }
        ],
        professors: [
            {
                name: 'Prof. Dr. Captain Robert Johnson',
                rating: 4.6
            }
        ],
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
        delivery: [
            'in-person',
            'hybrid'
        ],
        language: 'english',
        school: {
            name: 'Seneca Polytechnic',
            shortName: 'Seneca'
        },
        programs: [
            {
                program: {
                    name: 'Education, Community & Social Services',
                    code: 'ECSS'
                },
                semester: 1
            }
        ],
        professors: [
            {
                name: 'Prof. Dr. Rachel Green',
                rating: 4.5
            }
        ],
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
        delivery: [
            'in-person',
            'hybrid'
        ],
        language: 'english',
        school: {
            name: 'Seneca Polytechnic',
            shortName: 'Seneca'
        },
        programs: [
            {
                program: {
                    name: 'Education, Community & Social Services',
                    code: 'ECSS'
                },
                semester: 1
            }
        ],
        professors: [
            {
                name: 'Prof. Dr. Karen Mitchell',
                rating: 4.4
            }
        ],
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
        delivery: [
            'in-person',
            'hybrid'
        ],
        language: 'english',
        school: {
            name: 'Seneca Polytechnic',
            shortName: 'Seneca'
        },
        programs: [
            {
                program: {
                    name: 'Business',
                    code: 'BUS'
                },
                semester: 1
            }
        ],
        professors: [
            {
                name: 'Prof. Dr. David Thompson',
                rating: 4.5
            }
        ],
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
        delivery: [
            'in-person',
            'hybrid'
        ],
        language: 'english',
        school: {
            name: 'Seneca Polytechnic',
            shortName: 'Seneca'
        },
        programs: [
            {
                program: {
                    name: 'Business',
                    code: 'BUS'
                },
                semester: 1
            }
        ],
        professors: [
            {
                name: 'Prof. Dr. Patricia Lee',
                rating: 4.4
            }
        ],
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
        delivery: [
            'in-person',
            'hybrid'
        ],
        language: 'english',
        school: {
            name: 'Seneca Polytechnic',
            shortName: 'Seneca'
        },
        programs: [
            {
                program: {
                    name: 'Business',
                    code: 'BUS'
                },
                semester: 1
            }
        ],
        professors: [
            {
                name: 'Prof. Dr. Richard Park',
                rating: 4.5
            }
        ],
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
        delivery: [
            'in-person',
            'hybrid'
        ],
        language: 'english',
        school: {
            name: 'Seneca Polytechnic',
            shortName: 'Seneca'
        },
        programs: [
            {
                program: {
                    name: 'Business',
                    code: 'BUS'
                },
                semester: 1
            }
        ],
        professors: [
            {
                name: 'Prof. Dr. Michelle Wong',
                rating: 4.4
            }
        ],
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
        delivery: [
            'in-person',
            'hybrid'
        ],
        language: 'english',
        school: {
            name: 'Seneca Polytechnic',
            shortName: 'Seneca'
        },
        programs: [
            {
                program: {
                    name: 'Business',
                    code: 'BUS'
                },
                semester: 1
            }
        ],
        professors: [
            {
                name: 'Prof. Dr. Daniel Wilson',
                rating: 4.3
            }
        ],
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
        delivery: [
            'in-person',
            'hybrid'
        ],
        language: 'english',
        school: {
            name: 'Seneca Polytechnic',
            shortName: 'Seneca'
        },
        programs: [
            {
                program: {
                    name: 'Business',
                    code: 'BUS'
                },
                semester: 1
            }
        ],
        professors: [
            {
                name: 'Prof. Dr. Maria Gonzalez',
                rating: 4.5
            }
        ],
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
        delivery: [
            'in-person',
            'hybrid'
        ],
        language: 'english',
        school: {
            name: 'Seneca Polytechnic',
            shortName: 'Seneca'
        },
        programs: [
            {
                program: {
                    name: 'Business',
                    code: 'BUS'
                },
                semester: 1
            }
        ],
        professors: [
            {
                name: 'Prof. Dr. Sarah Kim',
                rating: 4.4
            }
        ],
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
        delivery: [
            'in-person',
            'hybrid'
        ],
        language: 'english',
        school: {
            name: 'Seneca Polytechnic',
            shortName: 'Seneca'
        },
        programs: [
            {
                program: {
                    name: 'Media & Communications',
                    code: 'MCOM'
                },
                semester: 1
            }
        ],
        professors: [
            {
                name: 'Prof. Dr. Jennifer Brown',
                rating: 4.4
            }
        ],
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
        delivery: [
            'in-person',
            'hybrid'
        ],
        language: 'english',
        school: {
            name: 'Seneca Polytechnic',
            shortName: 'Seneca'
        },
        programs: [
            {
                program: {
                    name: 'Law, Administration & Public Safety',
                    code: 'LAPS'
                },
                semester: 1
            }
        ],
        professors: [
            {
                name: 'Prof. Dr. James Wilson',
                rating: 4.5
            }
        ],
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
        delivery: [
            'in-person',
            'online'
        ],
        language: 'english',
        school: {
            name: 'Seneca Polytechnic',
            shortName: 'Seneca'
        },
        programs: [
            {
                program: {
                    name: 'Information Technology',
                    code: 'IT'
                },
                semester: 1
            }
        ],
        professors: [
            {
                name: 'Prof. Dr. Angela Chen',
                rating: 4.6
            }
        ],
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
        delivery: [
            'in-person',
            'hybrid'
        ],
        language: 'english',
        school: {
            name: 'Seneca Polytechnic',
            shortName: 'Seneca'
        },
        programs: [
            {
                program: {
                    name: 'Creative Arts, Animation & Design',
                    code: 'CAAD'
                },
                semester: 1
            }
        ],
        professors: [
            {
                name: 'Prof. Dr. Ryan Mitchell',
                rating: 4.5
            }
        ],
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
        delivery: [
            'in-person',
            'hybrid'
        ],
        language: 'english',
        school: {
            name: 'Seneca Polytechnic',
            shortName: 'Seneca'
        },
        programs: [
            {
                program: {
                    name: 'Health & Wellness',
                    code: 'HW'
                },
                semester: 1
            }
        ],
        professors: [
            {
                name: 'Prof. Dr. Patricia Kim',
                rating: 4.4
            }
        ],
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
        delivery: [
            'in-person',
            'hybrid'
        ],
        language: 'english',
        school: {
            name: 'Seneca Polytechnic',
            shortName: 'Seneca'
        },
        programs: [
            {
                program: {
                    name: 'Information Technology',
                    code: 'IT'
                },
                semester: 1
            }
        ],
        professors: [
            {
                name: 'Prof. Dr. Kevin Zhang',
                rating: 4.5
            }
        ],
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
        delivery: [
            'in-person',
            'online'
        ],
        language: 'english',
        school: {
            name: 'Seneca Polytechnic',
            shortName: 'Seneca'
        },
        programs: [
            {
                program: {
                    name: 'Information Technology',
                    code: 'IT'
                },
                semester: 1
            }
        ],
        professors: [
            {
                name: 'Prof. Dr. Sarah Kim',
                rating: 4.6
            }
        ],
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
        delivery: [
            'in-person',
            'hybrid'
        ],
        language: 'english',
        school: {
            name: 'Seneca Polytechnic',
            shortName: 'Seneca'
        },
        programs: [
            {
                program: {
                    name: 'Liberal Arts & University Transfers',
                    code: 'LAUT'
                },
                semester: 1
            }
        ],
        professors: [
            {
                name: 'Prof. Dr. Jennifer Adams',
                rating: 4.2
            }
        ],
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
        delivery: [
            'in-person',
            'hybrid'
        ],
        language: 'english',
        school: {
            name: 'Seneca Polytechnic',
            shortName: 'Seneca'
        },
        programs: [
            {
                program: {
                    name: 'Health & Wellness',
                    code: 'HW'
                },
                semester: 1
            }
        ],
        professors: [
            {
                name: 'Prof. Dr. Rachel Green',
                rating: 4.5
            }
        ],
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
        delivery: [
            'in-person'
        ],
        language: 'english',
        school: {
            name: 'Seneca Polytechnic',
            shortName: 'Seneca'
        },
        programs: [
            {
                program: {
                    name: 'Science',
                    code: 'SCI'
                },
                semester: 1
            }
        ],
        professors: [
            {
                name: 'Prof. Dr. Thomas Anderson',
                rating: 4.5
            }
        ],
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
        delivery: [
            'in-person'
        ],
        language: 'english',
        school: {
            name: 'Seneca Polytechnic',
            shortName: 'Seneca'
        },
        programs: [
            {
                program: {
                    name: 'Health & Wellness',
                    code: 'HW'
                },
                semester: 1
            }
        ],
        professors: [
            {
                name: 'Prof. Dr. Lisa Johnson',
                rating: 4.6
            }
        ],
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
        delivery: [
            'in-person',
            'hybrid'
        ],
        language: 'english',
        school: {
            name: 'Seneca Polytechnic',
            shortName: 'Seneca'
        },
        programs: [
            {
                program: {
                    name: 'Health & Wellness',
                    code: 'HW'
                },
                semester: 1
            }
        ],
        professors: [
            {
                name: 'Prof. Dr. Patricia Miller',
                rating: 4.4
            }
        ],
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
        delivery: [
            'in-person'
        ],
        language: 'english',
        school: {
            name: 'Seneca Polytechnic',
            shortName: 'Seneca'
        },
        programs: [
            {
                program: {
                    name: 'Health & Wellness',
                    code: 'HW'
                },
                semester: 1
            }
        ],
        professors: [
            {
                name: 'Prof. Dr. Karen White',
                rating: 4.5
            }
        ],
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
        delivery: [
            'in-person',
            'online'
        ],
        language: 'english',
        school: {
            name: 'Seneca Polytechnic',
            shortName: 'Seneca'
        },
        programs: [
            {
                program: {
                    name: 'Information Technology',
                    code: 'IT'
                },
                semester: 1
            }
        ],
        professors: [
            {
                name: 'Prof. Dr. Michael Chen',
                rating: 4.6
            }
        ],
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
        delivery: [
            'in-person',
            'hybrid'
        ],
        language: 'english',
        school: {
            name: 'Seneca Polytechnic',
            shortName: 'Seneca'
        },
        programs: [
            {
                program: {
                    name: 'Health & Wellness',
                    code: 'HW'
                },
                semester: 1
            }
        ],
        professors: [
            {
                name: 'Prof. Dr. Susan Rodriguez',
                rating: 4.4
            }
        ],
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
        delivery: [
            'in-person'
        ],
        language: 'english',
        school: {
            name: 'Seneca Polytechnic',
            shortName: 'Seneca'
        },
        programs: [
            {
                program: {
                    name: 'Health & Wellness',
                    code: 'HW'
                },
                semester: 1
            }
        ],
        professors: [
            {
                name: 'Prof. Mary Thompson',
                rating: 4.1
            }
        ],
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
        delivery: [
            'in-person',
            'hybrid'
        ],
        language: 'english',
        school: {
            name: 'Seneca Polytechnic',
            shortName: 'Seneca'
        },
        programs: [
            {
                program: {
                    name: 'Health & Wellness',
                    code: 'HW'
                },
                semester: 1
            }
        ],
        professors: [
            {
                name: 'Prof. Jennifer Park',
                rating: 4.3
            }
        ],
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
        delivery: [
            'in-person',
            'hybrid'
        ],
        language: 'english',
        school: {
            name: 'Seneca Polytechnic',
            shortName: 'Seneca'
        },
        programs: [
            {
                program: {
                    name: 'Health & Wellness',
                    code: 'HW'
                },
                semester: 1
            }
        ],
        professors: [
            {
                name: 'Prof. Linda Davis',
                rating: 4.1
            }
        ],
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
        delivery: [
            'in-person',
            'hybrid'
        ],
        language: 'english',
        school: {
            name: 'Seneca Polytechnic',
            shortName: 'Seneca'
        },
        programs: [
            {
                program: {
                    name: 'Health & Wellness',
                    code: 'HW'
                },
                semester: 1
            }
        ],
        professors: [
            {
                name: 'Prof. Robert Wilson',
                rating: 4.2
            }
        ],
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
        delivery: [
            'in-person'
        ],
        language: 'english',
        school: {
            name: 'Seneca Polytechnic',
            shortName: 'Seneca'
        },
        programs: [
            {
                program: {
                    name: 'Engineering Technology',
                    code: 'ENGR'
                },
                semester: 1
            }
        ],
        professors: [
            {
                name: 'Prof. James Martinez',
                rating: 4.3
            }
        ],
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
        delivery: [
            'in-person'
        ],
        language: 'english',
        school: {
            name: 'Seneca Polytechnic',
            shortName: 'Seneca'
        },
        programs: [
            {
                program: {
                    name: 'Engineering Technology',
                    code: 'ENGR'
                },
                semester: 1
            }
        ],
        professors: [
            {
                name: 'Prof. Dr. Patricia Lee',
                rating: 4.4
            }
        ],
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
        delivery: [
            'in-person',
            'hybrid'
        ],
        language: 'english',
        school: {
            name: 'Seneca Polytechnic',
            shortName: 'Seneca'
        },
        programs: [
            {
                program: {
                    name: 'Hospitality & Tourism',
                    code: 'HT'
                },
                semester: 1
            }
        ],
        professors: [
            {
                name: 'Prof. Maria Santos',
                rating: 4.2
            }
        ],
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
        delivery: [
            'in-person',
            'hybrid'
        ],
        language: 'english',
        school: {
            name: 'Seneca Polytechnic',
            shortName: 'Seneca'
        },
        programs: [
            {
                program: {
                    name: 'Hospitality & Tourism',
                    code: 'HT'
                },
                semester: 1
            }
        ],
        professors: [
            {
                name: 'Prof. Dr. Jennifer Chen',
                rating: 4.3
            }
        ],
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
        delivery: [
            'in-person',
            'online'
        ],
        language: 'english',
        school: {
            name: 'Seneca Polytechnic',
            shortName: 'Seneca'
        },
        programs: [
            {
                program: {
                    name: 'Business',
                    code: 'BUS'
                },
                semester: 1
            }
        ],
        professors: [
            {
                name: 'Prof. Rachel Brown',
                rating: 4.2
            }
        ],
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
        delivery: [
            'in-person',
            'hybrid'
        ],
        language: 'english',
        school: {
            name: 'Seneca Polytechnic',
            shortName: 'Seneca'
        },
        programs: [
            {
                program: {
                    name: 'Business',
                    code: 'BUS'
                },
                semester: 1
            }
        ],
        professors: [
            {
                name: 'Prof. Dr. David Kim',
                rating: 4.3
            }
        ],
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
        delivery: [
            'in-person',
            'hybrid'
        ],
        language: 'english',
        school: {
            name: 'Seneca Polytechnic',
            shortName: 'Seneca'
        },
        programs: [
            {
                program: {
                    name: 'Education, Community & Social Services',
                    code: 'ECSS'
                },
                semester: 1
            }
        ],
        professors: [
            {
                name: 'Prof. Dr. Margaret Wilson',
                rating: 4.1
            }
        ],
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
        delivery: [
            'in-person',
            'hybrid'
        ],
        language: 'english',
        school: {
            name: 'Seneca Polytechnic',
            shortName: 'Seneca'
        },
        programs: [
            {
                program: {
                    name: 'Business',
                    code: 'BUS'
                },
                semester: 1
            }
        ],
        professors: [
            {
                name: 'Prof. Dr. Elena Petrov',
                rating: 4.4
            }
        ],
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
        delivery: [
            'in-person',
            'hybrid'
        ],
        language: 'english',
        school: {
            name: 'Seneca Polytechnic',
            shortName: 'Seneca'
        },
        programs: [
            {
                program: {
                    name: 'Business',
                    code: 'BUS'
                },
                semester: 1
            }
        ],
        professors: [
            {
                name: 'Prof. Dr. Maria Gonzalez',
                rating: 4.3
            }
        ],
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
        delivery: [
            'in-person',
            'hybrid'
        ],
        language: 'english',
        school: {
            name: 'Seneca Polytechnic',
            shortName: 'Seneca'
        },
        programs: [
            {
                program: {
                    name: 'Business',
                    code: 'BUS'
                },
                semester: 1
            }
        ],
        professors: [
            {
                name: 'Prof. Richard Park',
                rating: 4.2
            }
        ],
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
        delivery: [
            'in-person',
            'hybrid'
        ],
        language: 'english',
        school: {
            name: 'Seneca Polytechnic',
            shortName: 'Seneca'
        },
        programs: [
            {
                program: {
                    name: 'Creative Arts, Animation & Design',
                    code: 'CAAD'
                },
                semester: 1
            }
        ],
        professors: [
            {
                name: 'Prof. Sophie Turner',
                rating: 4.2
            }
        ],
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
        delivery: [
            'in-person'
        ],
        language: 'english',
        school: {
            name: 'Seneca Polytechnic',
            shortName: 'Seneca'
        },
        programs: [
            {
                program: {
                    name: 'Creative Arts, Animation & Design',
                    code: 'CAAD'
                },
                semester: 1
            }
        ],
        professors: [
            {
                name: 'Prof. Alex Kim',
                rating: 4.4
            }
        ],
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
        delivery: [
            'in-person',
            'hybrid'
        ],
        language: 'english',
        school: {
            name: 'Seneca Polytechnic',
            shortName: 'Seneca'
        },
        programs: [
            {
                program: {
                    name: 'Creative Arts, Animation & Design',
                    code: 'CAAD'
                },
                semester: 1
            }
        ],
        professors: [
            {
                name: 'Prof. Dr. Ryan Mitchell',
                rating: 4.3
            }
        ],
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
        delivery: [
            'in-person',
            'online'
        ],
        language: 'english',
        school: {
            name: 'Seneca Polytechnic',
            shortName: 'Seneca'
        },
        programs: [
            {
                program: {
                    name: 'Information Technology',
                    code: 'IT'
                },
                semester: 1
            }
        ],
        professors: [
            {
                name: 'Prof. Dr. Kevin Zhang',
                rating: 4.5
            }
        ],
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
        delivery: [
            'in-person',
            'hybrid'
        ],
        language: 'english',
        school: {
            name: 'Seneca Polytechnic',
            shortName: 'Seneca'
        },
        programs: [
            {
                program: {
                    name: 'Media & Communications',
                    code: 'MCOM'
                },
                semester: 1
            }
        ],
        professors: [
            {
                name: 'Prof. Jennifer Brown',
                rating: 4.3
            }
        ],
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
        delivery: [
            'in-person'
        ],
        language: 'english',
        school: {
            name: 'Seneca Polytechnic',
            shortName: 'Seneca'
        },
        programs: [
            {
                program: {
                    name: 'Creative Arts, Animation & Design',
                    code: 'CAAD'
                },
                semester: 1
            }
        ],
        professors: [
            {
                name: 'Prof. Isabella Martinez',
                rating: 4.1
            }
        ],
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
        delivery: [
            'in-person',
            'hybrid'
        ],
        language: 'english',
        school: {
            name: 'Seneca Polytechnic',
            shortName: 'Seneca'
        },
        programs: [
            {
                program: {
                    name: 'Law, Administration & Public Safety',
                    code: 'LAPS'
                },
                semester: 1
            }
        ],
        professors: [
            {
                name: 'Prof. Dr. James Wilson',
                rating: 4.3
            }
        ],
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
        delivery: [
            'in-person',
            'hybrid'
        ],
        language: 'english',
        school: {
            name: 'Seneca Polytechnic',
            shortName: 'Seneca'
        },
        programs: [
            {
                program: {
                    name: 'Law, Administration & Public Safety',
                    code: 'LAPS'
                },
                semester: 1
            }
        ],
        professors: [
            {
                name: 'Prof. Patricia Kim',
                rating: 4.4
            }
        ],
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
        delivery: [
            'in-person',
            'online'
        ],
        language: 'english',
        school: {
            name: 'Seneca Polytechnic',
            shortName: 'Seneca'
        },
        programs: [
            {
                program: {
                    name: 'Liberal Arts & University Transfers',
                    code: 'LAUT'
                },
                semester: 1
            }
        ],
        professors: [
            {
                name: 'Prof. Susan Miller',
                rating: 4.1
            }
        ],
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
        delivery: [
            'in-person',
            'online'
        ],
        language: 'english',
        school: {
            name: 'Seneca Polytechnic',
            shortName: 'Seneca'
        },
        programs: [
            {
                program: {
                    name: 'Business',
                    code: 'BUS'
                },
                semester: 1
            }
        ],
        professors: [
            {
                name: 'Prof. Dr. Sarah Kim',
                rating: 4.3
            }
        ],
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
        delivery: [
            'in-person',
            'hybrid'
        ],
        language: 'english',
        school: {
            name: 'Seneca Polytechnic',
            shortName: 'Seneca'
        },
        programs: [
            {
                program: {
                    name: 'Business',
                    code: 'BUS'
                },
                semester: 1
            }
        ],
        professors: [
            {
                name: 'Prof. Dr. Michelle Wong',
                rating: 4.4
            }
        ],
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
        delivery: [
            'in-person',
            'online'
        ],
        language: 'english',
        school: {
            name: 'Seneca Polytechnic',
            shortName: 'Seneca'
        },
        programs: [
            {
                program: {
                    name: 'Information Technology',
                    code: 'IT'
                },
                semester: 1
            }
        ],
        professors: [
            {
                name: 'Prof. Dr. Angela Chen',
                rating: 4.7
            }
        ],
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
        delivery: [
            'in-person'
        ],
        language: 'english',
        school: {
            name: 'Seneca Polytechnic',
            shortName: 'Seneca'
        },
        programs: [
            {
                program: {
                    name: 'Engineering Technology',
                    code: 'ENGR'
                },
                semester: 1
            }
        ],
        professors: [
            {
                name: 'Prof. Robert Johnson',
                rating: 4.3
            }
        ],
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
        delivery: [
            'in-person'
        ],
        language: 'english',
        school: {
            name: 'Seneca Polytechnic',
            shortName: 'Seneca'
        },
        programs: [
            {
                program: {
                    name: 'Engineering Technology',
                    code: 'ENGR'
                },
                semester: 1
            }
        ],
        professors: [
            {
                name: 'Prof. Dr. Patricia Lee',
                rating: 4.4
            }
        ],
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
        delivery: [
            'in-person'
        ],
        language: 'english',
        school: {
            name: 'Seneca Polytechnic',
            shortName: 'Seneca'
        },
        programs: [
            {
                program: {
                    name: 'Engineering Technology',
                    code: 'ENGR'
                },
                semester: 1
            }
        ],
        professors: [
            {
                name: 'Prof. Dr. David Thompson',
                rating: 4.3
            }
        ],
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
        delivery: [
            'in-person'
        ],
        language: 'english',
        school: {
            name: 'Seneca Polytechnic',
            shortName: 'Seneca'
        },
        programs: [
            {
                program: {
                    name: 'Engineering Technology',
                    code: 'ENGR'
                },
                semester: 1
            }
        ],
        professors: [
            {
                name: 'Prof. James Martinez',
                rating: 4.2
            }
        ],
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
        delivery: [
            'in-person'
        ],
        language: 'english',
        school: {
            name: 'Seneca Polytechnic',
            shortName: 'Seneca'
        },
        programs: [
            {
                program: {
                    name: 'Health & Wellness',
                    code: 'HW'
                },
                semester: 1
            }
        ],
        professors: [
            {
                name: 'Prof. Dr. Lisa Johnson',
                rating: 4.4
            }
        ],
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
        delivery: [
            'in-person',
            'hybrid'
        ],
        language: 'english',
        school: {
            name: 'Seneca Polytechnic',
            shortName: 'Seneca'
        },
        programs: [
            {
                program: {
                    name: 'Health & Wellness',
                    code: 'HW'
                },
                semester: 1
            }
        ],
        professors: [
            {
                name: 'Prof. Dr. Rachel Green',
                rating: 4.3
            }
        ],
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
        delivery: [
            'in-person',
            'hybrid'
        ],
        language: 'english',
        school: {
            name: 'Seneca Polytechnic',
            shortName: 'Seneca'
        },
        programs: [
            {
                program: {
                    name: 'Education, Community & Social Services',
                    code: 'ECSS'
                },
                semester: 1
            }
        ],
        professors: [
            {
                name: 'Prof. Dr. Margaret Wilson',
                rating: 4.2
            }
        ],
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
        delivery: [
            'in-person'
        ],
        language: 'english',
        school: {
            name: 'Seneca Polytechnic',
            shortName: 'Seneca'
        },
        programs: [
            {
                program: {
                    name: 'Health & Wellness',
                    code: 'HW'
                },
                semester: 1
            }
        ],
        professors: [
            {
                name: 'Prof. Dr. Patricia Kim',
                rating: 4.4
            }
        ],
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
        delivery: [
            'in-person',
            'hybrid'
        ],
        language: 'english',
        school: {
            name: 'Seneca Polytechnic',
            shortName: 'Seneca'
        },
        programs: [
            {
                program: {
                    name: 'Business',
                    code: 'BUS'
                },
                semester: 1
            }
        ],
        professors: [
            {
                name: 'Prof. Linda Davis',
                rating: 4.1
            }
        ],
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
        delivery: [
            'in-person',
            'hybrid'
        ],
        language: 'english',
        school: {
            name: 'Seneca Polytechnic',
            shortName: 'Seneca'
        },
        programs: [
            {
                program: {
                    name: 'Health & Wellness',
                    code: 'HW'
                },
                semester: 1
            }
        ],
        professors: [
            {
                name: 'Prof. Jennifer Park',
                rating: 4.2
            }
        ],
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
        delivery: [
            'in-person',
            'hybrid'
        ],
        language: 'english',
        school: {
            name: 'Seneca Polytechnic',
            shortName: 'Seneca'
        },
        programs: [
            {
                program: {
                    name: 'Law, Administration & Public Safety',
                    code: 'LAPS'
                },
                semester: 1
            }
        ],
        professors: [
            {
                name: 'Prof. Patricia Kim',
                rating: 4.3
            }
        ],
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
        delivery: [
            'in-person'
        ],
        language: 'english',
        school: {
            name: 'Seneca Polytechnic',
            shortName: 'Seneca'
        },
        programs: [
            {
                program: {
                    name: 'Health & Wellness',
                    code: 'HW'
                },
                semester: 1
            }
        ],
        professors: [
            {
                name: 'Prof. Dr. Thomas Anderson',
                rating: 4.3
            }
        ],
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
        delivery: [
            'in-person',
            'hybrid'
        ],
        language: 'english',
        school: {
            name: 'Seneca Polytechnic',
            shortName: 'Seneca'
        },
        programs: [
            {
                program: {
                    name: 'Law, Administration & Public Safety',
                    code: 'LAPS'
                },
                semester: 1
            }
        ],
        professors: [
            {
                name: 'Prof. Dr. James Wilson',
                rating: 4.4
            }
        ],
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
        delivery: [
            'in-person',
            'hybrid'
        ],
        language: 'english',
        school: {
            name: 'Seneca Polytechnic',
            shortName: 'Seneca'
        },
        programs: [
            {
                program: {
                    name: 'Law, Administration & Public Safety',
                    code: 'LAPS'
                },
                semester: 1
            }
        ],
        professors: [
            {
                name: 'Prof. Dr. Patricia Wilson',
                rating: 4.3
            }
        ],
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
        delivery: [
            'in-person'
        ],
        language: 'english',
        school: {
            name: 'Seneca Polytechnic',
            shortName: 'Seneca'
        },
        programs: [
            {
                program: {
                    name: 'Health & Wellness',
                    code: 'HW'
                },
                semester: 1
            }
        ],
        professors: [
            {
                name: 'Prof. Mary Thompson',
                rating: 4.1
            }
        ],
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
        delivery: [
            'in-person',
            'hybrid'
        ],
        language: 'english',
        school: {
            name: 'Seneca Polytechnic',
            shortName: 'Seneca'
        },
        programs: [
            {
                program: {
                    name: 'Science',
                    code: 'SCI'
                },
                semester: 1
            }
        ],
        professors: [
            {
                name: 'Prof. Dr. Susan Rodriguez',
                rating: 4.5
            }
        ],
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
        delivery: [
            'in-person'
        ],
        language: 'english',
        school: {
            name: 'Seneca Polytechnic',
            shortName: 'Seneca'
        },
        programs: [
            {
                program: {
                    name: 'Law, Administration & Public Safety',
                    code: 'LAPS'
                },
                semester: 1
            }
        ],
        professors: [
            {
                name: 'Prof. Captain Robert Johnson',
                rating: 4.2
            }
        ],
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
        delivery: [
            'in-person'
        ],
        language: 'english',
        school: {
            name: 'Seneca Polytechnic',
            shortName: 'Seneca'
        },
        programs: [
            {
                program: {
                    name: 'Health & Wellness',
                    code: 'HW'
                },
                semester: 1
            }
        ],
        professors: [
            {
                name: 'Prof. Dr. Lisa Johnson',
                rating: 4.4
            }
        ],
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
        delivery: [
            'in-person',
            'online'
        ],
        language: 'english',
        school: {
            name: 'Seneca Polytechnic',
            shortName: 'Seneca'
        },
        programs: [
            {
                program: {
                    name: 'Business',
                    code: 'BUS'
                },
                semester: 1
            }
        ],
        professors: [
            {
                name: 'Prof. Jennifer Adams',
                rating: 3.9
            }
        ],
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
        delivery: [
            'in-person',
            'online'
        ],
        language: 'english',
        school: {
            name: 'Seneca Polytechnic',
            shortName: 'Seneca'
        },
        programs: [
            {
                program: {
                    name: 'Health & Wellness',
                    code: 'HW'
                },
                semester: 1
            }
        ],
        professors: [
            {
                name: 'Prof. Dr. Thomas Anderson',
                rating: 4.1
            }
        ],
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
        delivery: [
            'in-person',
            'hybrid'
        ],
        language: 'english',
        school: {
            name: 'Seneca Polytechnic',
            shortName: 'Seneca'
        },
        programs: [
            {
                program: {
                    name: 'Business',
                    code: 'BUS'
                },
                semester: 1
            }
        ],
        professors: [
            {
                name: 'Prof. Dr. David Thompson',
                rating: 4.4
            }
        ],
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
        delivery: [
            'in-person',
            'hybrid'
        ],
        language: 'english',
        school: {
            name: 'Seneca Polytechnic',
            shortName: 'Seneca'
        },
        programs: [
            {
                program: {
                    name: 'Business',
                    code: 'BUS'
                },
                semester: 1
            }
        ],
        professors: [
            {
                name: 'Prof. Richard Park',
                rating: 4.2
            }
        ],
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
        delivery: [
            'in-person',
            'hybrid'
        ],
        language: 'english',
        school: {
            name: 'Seneca Polytechnic',
            shortName: 'Seneca'
        },
        programs: [
            {
                program: {
                    name: 'Science',
                    code: 'SCI'
                },
                semester: 1
            }
        ],
        professors: [
            {
                name: 'Prof. Dr. Sarah Kim',
                rating: 4.3
            }
        ],
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
        delivery: [
            'in-person',
            'online'
        ],
        language: 'english',
        school: {
            name: 'Seneca Polytechnic',
            shortName: 'Seneca'
        },
        programs: [
            {
                program: {
                    name: 'Information Technology',
                    code: 'IT'
                },
                semester: 1
            }
        ],
        professors: [
            {
                name: 'Prof. Dr. Kevin Zhang',
                rating: 4.4
            }
        ],
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
        delivery: [
            'in-person',
            'hybrid'
        ],
        language: 'english',
        school: {
            name: 'Seneca Polytechnic',
            shortName: 'Seneca'
        },
        programs: [
            {
                program: {
                    name: 'Law, Administration & Public Safety',
                    code: 'LAPS'
                },
                semester: 1
            }
        ],
        professors: [
            {
                name: 'Prof. Dr. Patricia Wilson',
                rating: 4.2
            }
        ],
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
        delivery: [
            'in-person',
            'hybrid'
        ],
        language: 'english',
        school: {
            name: 'Seneca Polytechnic',
            shortName: 'Seneca'
        },
        programs: [
            {
                program: {
                    name: 'Media & Communications',
                    code: 'MCOM'
                },
                semester: 1
            }
        ],
        professors: [
            {
                name: 'Prof. Dr. Jennifer Brown',
                rating: 4.3
            }
        ],
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
        delivery: [
            'in-person',
            'hybrid'
        ],
        language: 'english',
        school: {
            name: 'Seneca Polytechnic',
            shortName: 'Seneca'
        },
        programs: [
            {
                program: {
                    name: 'Business',
                    code: 'BUS'
                },
                semester: 1
            }
        ],
        professors: [
            {
                name: 'Prof. Daniel Wilson',
                rating: 4.2
            }
        ],
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
        delivery: [
            'in-person',
            'hybrid'
        ],
        language: 'english',
        school: {
            name: 'Seneca Polytechnic',
            shortName: 'Seneca'
        },
        programs: [
            {
                program: {
                    name: 'Business',
                    code: 'BUS'
                },
                semester: 1
            }
        ],
        professors: [
            {
                name: 'Prof. Michelle Wong',
                rating: 4.1
            }
        ],
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
        delivery: [
            'in-person',
            'hybrid'
        ],
        language: 'english',
        school: {
            name: 'Seneca Polytechnic',
            shortName: 'Seneca'
        },
        programs: [
            {
                program: {
                    name: 'Education, Community & Social Services',
                    code: 'ECSS'
                },
                semester: 1
            }
        ],
        professors: [
            {
                name: 'Prof. Dr. Rachel Green',
                rating: 4.3
            }
        ],
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
        delivery: [
            'in-person',
            'hybrid'
        ],
        language: 'english',
        school: {
            name: 'Seneca Polytechnic',
            shortName: 'Seneca'
        },
        programs: [
            {
                program: {
                    name: 'Education, Community & Social Services',
                    code: 'ECSS'
                },
                semester: 1
            }
        ],
        professors: [
            {
                name: 'Prof. Dr. Karen Mitchell',
                rating: 4.2
            }
        ],
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
        delivery: [
            'in-person',
            'hybrid'
        ],
        language: 'english',
        school: {
            name: 'Seneca Polytechnic',
            shortName: 'Seneca'
        },
        programs: [
            {
                program: {
                    name: 'Education, Community & Social Services',
                    code: 'ECSS'
                },
                semester: 1
            }
        ],
        professors: [
            {
                name: 'Prof. Dr. Margaret Wilson',
                rating: 4.1
            }
        ],
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
        delivery: [
            'in-person',
            'hybrid'
        ],
        language: 'english',
        school: {
            name: 'Seneca Polytechnic',
            shortName: 'Seneca'
        },
        programs: [
            {
                program: {
                    name: 'Education, Community & Social Services',
                    code: 'ECSS'
                },
                semester: 1
            }
        ],
        professors: [
            {
                name: 'Prof. Dr. Elena Petrov',
                rating: 4.2
            }
        ],
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
        delivery: [
            'in-person',
            'hybrid'
        ],
        language: 'english',
        school: {
            name: 'Seneca Polytechnic',
            shortName: 'Seneca'
        },
        programs: [
            {
                program: {
                    name: 'Education, Community & Social Services',
                    code: 'ECSS'
                },
                semester: 1
            }
        ],
        professors: [
            {
                name: 'Prof. Maria Gonzalez',
                rating: 4.1
            }
        ],
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
        delivery: [
            'in-person',
            'hybrid'
        ],
        language: 'english',
        school: {
            name: 'Seneca Polytechnic',
            shortName: 'Seneca'
        },
        programs: [
            {
                program: {
                    name: 'Business',
                    code: 'BUS'
                },
                semester: 1
            }
        ],
        professors: [
            {
                name: 'Prof. Alex Kim',
                rating: 4.3
            }
        ],
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
        delivery: [
            'in-person',
            'hybrid'
        ],
        language: 'english',
        school: {
            name: 'Seneca Polytechnic',
            shortName: 'Seneca'
        },
        programs: [
            {
                program: {
                    name: 'Business',
                    code: 'BUS'
                },
                semester: 1
            }
        ],
        professors: [
            {
                name: 'Prof. Dr. Richard Park',
                rating: 4.4
            }
        ],
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
        delivery: [
            'in-person',
            'hybrid'
        ],
        language: 'english',
        school: {
            name: 'Seneca Polytechnic',
            shortName: 'Seneca'
        },
        programs: [
            {
                program: {
                    name: 'Business',
                    code: 'BUS'
                },
                semester: 1
            }
        ],
        professors: [
            {
                name: 'Prof. Dr. Sarah Kim',
                rating: 4.4
            }
        ],
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
        delivery: [
            'in-person',
            'hybrid'
        ],
        language: 'english',
        school: {
            name: 'Seneca Polytechnic',
            shortName: 'Seneca'
        },
        programs: [
            {
                program: {
                    name: 'Engineering Technology',
                    code: 'ENGR'
                },
                semester: 1
            }
        ],
        professors: [
            {
                name: 'Prof. Dr. Patricia Lee',
                rating: 4.3
            }
        ],
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
        delivery: [
            'in-person',
            'online'
        ],
        language: 'english',
        school: {
            name: 'Seneca Polytechnic',
            shortName: 'Seneca'
        },
        programs: [
            {
                program: {
                    name: 'Education, Community & Social Services',
                    code: 'ECSS'
                },
                semester: 1
            }
        ],
        professors: [
            {
                name: 'Prof. Susan Miller',
                rating: 4.1
            }
        ],
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
        delivery: [
            'in-person',
            'online'
        ],
        language: 'english',
        school: {
            name: 'Seneca Polytechnic',
            shortName: 'Seneca'
        },
        programs: [
            {
                program: {
                    name: 'Education, Community & Social Services',
                    code: 'ECSS'
                },
                semester: 1
            }
        ],
        professors: [
            {
                name: 'Prof. Jennifer Adams',
                rating: 4.2
            }
        ],
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
        delivery: [
            'in-person',
            'online'
        ],
        language: 'english',
        school: {
            name: 'Seneca Polytechnic',
            shortName: 'Seneca'
        },
        programs: [
            {
                program: {
                    name: 'Media & Communications',
                    code: 'MCOM'
                },
                semester: 1
            }
        ],
        professors: [
            {
                name: 'Prof. Dr. Jennifer Brown',
                rating: 4.2
            }
        ],
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
        delivery: [
            'in-person',
            'hybrid'
        ],
        language: 'english',
        school: {
            name: 'Seneca Polytechnic',
            shortName: 'Seneca'
        },
        programs: [
            {
                program: {
                    name: 'Hospitality & Tourism',
                    code: 'HT'
                },
                semester: 1
            }
        ],
        professors: [
            {
                name: 'Prof. Maria Santos',
                rating: 4.2
            }
        ],
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
        delivery: [
            'in-person',
            'hybrid'
        ],
        language: 'english',
        school: {
            name: 'Seneca Polytechnic',
            shortName: 'Seneca'
        },
        programs: [
            {
                program: {
                    name: 'Hospitality & Tourism',
                    code: 'HT'
                },
                semester: 1
            }
        ],
        professors: [
            {
                name: 'Prof. Dr. Jennifer Chen',
                rating: 4.1
            }
        ],
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
        delivery: [
            'in-person',
            'hybrid'
        ],
        language: 'english',
        school: {
            name: 'Seneca Polytechnic',
            shortName: 'Seneca'
        },
        programs: [
            {
                program: {
                    name: 'Hospitality & Tourism',
                    code: 'HT'
                },
                semester: 1
            }
        ],
        professors: [
            {
                name: 'Prof. James Chen',
                rating: 4.0
            }
        ],
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
        delivery: [
            'in-person'
        ],
        language: 'english',
        school: {
            name: 'Seneca Polytechnic',
            shortName: 'Seneca'
        },
        programs: [
            {
                program: {
                    name: 'Health & Wellness',
                    code: 'HW'
                },
                semester: 1
            }
        ],
        professors: [
            {
                name: 'Prof. Dr. Thomas Anderson',
                rating: 4.2
            }
        ],
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
        delivery: [
            'in-person'
        ],
        language: 'english',
        school: {
            name: 'Seneca Polytechnic',
            shortName: 'Seneca'
        },
        programs: [
            {
                program: {
                    name: 'Health & Wellness',
                    code: 'HW'
                },
                semester: 1
            }
        ],
        professors: [
            {
                name: 'Prof. Dr. Lisa Johnson',
                rating: 4.3
            }
        ],
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
        delivery: [
            'in-person',
            'hybrid'
        ],
        language: 'english',
        school: {
            name: 'Seneca Polytechnic',
            shortName: 'Seneca'
        },
        programs: [
            {
                program: {
                    name: 'Creative Arts, Animation & Design',
                    code: 'CAAD'
                },
                semester: 1
            }
        ],
        professors: [
            {
                name: 'Prof. Alex Kim',
                rating: 4.2
            }
        ],
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
        delivery: [
            'in-person'
        ],
        language: 'english',
        school: {
            name: 'Seneca Polytechnic',
            shortName: 'Seneca'
        },
        programs: [
            {
                program: {
                    name: 'Creative Arts, Animation & Design',
                    code: 'CAAD'
                },
                semester: 1
            }
        ],
        professors: [
            {
                name: 'Prof. Ryan Mitchell',
                rating: 4.4
            }
        ],
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
        delivery: [
            'in-person',
            'hybrid'
        ],
        language: 'english',
        school: {
            name: 'Seneca Polytechnic',
            shortName: 'Seneca'
        },
        programs: [
            {
                program: {
                    name: 'Creative Arts, Animation & Design',
                    code: 'CAAD'
                },
                semester: 1
            }
        ],
        professors: [
            {
                name: 'Prof. Sophie Turner',
                rating: 4.1
            }
        ],
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
        delivery: [
            'in-person',
            'hybrid'
        ],
        language: 'english',
        school: {
            name: 'Seneca Polytechnic',
            shortName: 'Seneca'
        },
        programs: [
            {
                program: {
                    name: 'Health & Wellness',
                    code: 'HW'
                },
                semester: 1
            }
        ],
        professors: [
            {
                name: 'Prof. Robert Wilson',
                rating: 4.2
            }
        ],
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
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/app/(protected)/programs/page.tsx [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "default": (()=>__TURBOPACK__default__export__)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$search$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Search$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/search.js [app-client] (ecmascript) <export default as Search>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$star$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Star$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/star.js [app-client] (ecmascript) <export default as Star>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$right$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronRight$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/chevron-right.js [app-client] (ecmascript) <export default as ChevronRight>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$left$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronLeft$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/chevron-left.js [app-client] (ecmascript) <export default as ChevronLeft>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/image.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2d$auth$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next-auth/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$landing$2f$LandingNavBar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/landing/LandingNavBar.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$constants$2f$programData$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/constants/programData.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
;
;
const CoursesPage = ()=>{
    _s();
    const { data: session } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2d$auth$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSession"])();
    const [courses, setCourses] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const [searchTerm, setSearchTerm] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [filters, setFilters] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        level: '',
        difficulty: '',
        delivery: '',
        school: [],
        course: '',
        sort: 'relevance'
    });
    const [currentPage, setCurrentPage] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(1);
    const [totalPages, setTotalPages] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(1);
    const resultsRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const coursesPerPage = 10;
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "CoursesPage.useEffect": ()=>{
            // Chỉ fetch lần đầu
            setLoading(true);
            setTimeout({
                "CoursesPage.useEffect": ()=>{
                    setCourses(__TURBOPACK__imported__module__$5b$project$5d2f$constants$2f$programData$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["programs"]);
                    setLoading(false);
                }
            }["CoursesPage.useEffect"], 1000);
        }
    }["CoursesPage.useEffect"], []);
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
        const matchesSchool = !filters.school || course.programs.some((prog)=>filters.school.includes(prog.program.name));
        return matchesSearch && matchesLevel && matchesDifficulty && matchesDelivery && matchesSchool;
    });
    // Calculate pagination
    const indexOfLastCourse = currentPage * coursesPerPage;
    const indexOfFirstCourse = indexOfLastCourse - coursesPerPage;
    const currentCourses = filteredCourses.slice(indexOfFirstCourse, indexOfLastCourse);
    // Update total pages when filtered courses change
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "CoursesPage.useEffect": ()=>{
            setTotalPages(Math.ceil(filteredCourses.length / coursesPerPage));
            setCurrentPage(1); // Reset to first page when filters change
        }
    }["CoursesPage.useEffect"], [
        filteredCourses.length
    ]);
    const handlePageChange = (pageNumber)=>{
        setCurrentPage(pageNumber);
        // Scroll to top of results
        resultsRef.current?.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    };
    const programFilters = [
        "Aviation",
        "Business",
        "Creative Arts, Animation & Design",
        "Education, Community & Social Services",
        "Engineering Technology",
        "Fashion & Esthetics",
        "Health & Wellness",
        "Hospitality & Tourism",
        "Information Technology",
        "Law, Administration & Public Safety",
        "Liberal Arts & University Transfers",
        "Media & Communications",
        "Science"
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
    const handleSearchKeyDown = (e)=>{
        if (e.key === 'Enter') {
            e.preventDefault();
            resultsRef.current?.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    };
    const handleFilterClick = (filter)=>{
        if (filters.school.includes(filter)) {
            setFilters((f)=>({
                    ...f,
                    school: f.school.filter((item)=>item !== filter)
                }));
        } else {
            setFilters((f)=>({
                    ...f,
                    school: [
                        ...f.school,
                        filter
                    ]
                }));
        }
        // Scroll to results after a short delay to ensure state update
        setTimeout(()=>{
            resultsRef.current?.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }, 100);
    };
    const clearAllFilters = ()=>{
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
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "min-h-screen bg-gray-50 p-6",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "max-w-7xl mx-auto",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "animate-pulse",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "h-8 bg-gray-300 rounded w-1/4 mb-6"
                        }, void 0, false, {
                            fileName: "[project]/app/(protected)/programs/page.tsx",
                            lineNumber: 137,
                            columnNumber: 25
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6",
                            children: [
                                1,
                                2,
                                3,
                                4,
                                5,
                                6
                            ].map((i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "bg-white rounded-lg shadow-md p-6",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "h-4 bg-gray-300 rounded w-3/4 mb-2"
                                        }, void 0, false, {
                                            fileName: "[project]/app/(protected)/programs/page.tsx",
                                            lineNumber: 141,
                                            columnNumber: 37
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "h-4 bg-gray-300 rounded w-1/2 mb-4"
                                        }, void 0, false, {
                                            fileName: "[project]/app/(protected)/programs/page.tsx",
                                            lineNumber: 142,
                                            columnNumber: 37
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "h-20 bg-gray-300 rounded mb-4"
                                        }, void 0, false, {
                                            fileName: "[project]/app/(protected)/programs/page.tsx",
                                            lineNumber: 143,
                                            columnNumber: 37
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex justify-between",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "h-4 bg-gray-300 rounded w-1/4"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/(protected)/programs/page.tsx",
                                                    lineNumber: 145,
                                                    columnNumber: 41
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "h-4 bg-gray-300 rounded w-1/4"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/(protected)/programs/page.tsx",
                                                    lineNumber: 146,
                                                    columnNumber: 41
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/(protected)/programs/page.tsx",
                                            lineNumber: 144,
                                            columnNumber: 37
                                        }, this)
                                    ]
                                }, i, true, {
                                    fileName: "[project]/app/(protected)/programs/page.tsx",
                                    lineNumber: 140,
                                    columnNumber: 33
                                }, this))
                        }, void 0, false, {
                            fileName: "[project]/app/(protected)/programs/page.tsx",
                            lineNumber: 138,
                            columnNumber: 25
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/(protected)/programs/page.tsx",
                    lineNumber: 136,
                    columnNumber: 21
                }, this)
            }, void 0, false, {
                fileName: "[project]/app/(protected)/programs/page.tsx",
                lineNumber: 135,
                columnNumber: 17
            }, this)
        }, void 0, false, {
            fileName: "[project]/app/(protected)/programs/page.tsx",
            lineNumber: 134,
            columnNumber: 13
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "min-h-screen bg-[#1a1a1a] text-white",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "sticky top-0 z-30 bg-[#18191A]",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$landing$2f$LandingNavBar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                    fileName: "[project]/app/(protected)/programs/page.tsx",
                    lineNumber: 160,
                    columnNumber: 17
                }, this)
            }, void 0, false, {
                fileName: "[project]/app/(protected)/programs/page.tsx",
                lineNumber: 159,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "h-20"
            }, void 0, false, {
                fileName: "[project]/app/(protected)/programs/page.tsx",
                lineNumber: 162,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "border-b border-white/10 w-full"
            }, void 0, false, {
                fileName: "[project]/app/(protected)/programs/page.tsx",
                lineNumber: 163,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "w-full border-b border-[#232425] min-h-screen flex items-center justify-center",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "max-w-6xl mx-auto px-6 py-30 text-center",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                            className: "text-8xl font-bold mb-5",
                            children: "Programs Reviews"
                        }, void 0, false, {
                            fileName: "[project]/app/(protected)/programs/page.tsx",
                            lineNumber: 167,
                            columnNumber: 21
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "text-gray-300 mb-15 max-w-full mx-auto text-lg",
                            children: "Explore a wealth of resources shared by your peers, categorized by program and course."
                        }, void 0, false, {
                            fileName: "[project]/app/(protected)/programs/page.tsx",
                            lineNumber: 168,
                            columnNumber: 21
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "relative w-full max-w-2xl mb-10 mx-auto",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$search$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Search$3e$__["Search"], {
                                    className: "absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5"
                                }, void 0, false, {
                                    fileName: "[project]/app/(protected)/programs/page.tsx",
                                    lineNumber: 172,
                                    columnNumber: 25
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                    type: "text",
                                    value: searchTerm,
                                    onChange: (e)=>setSearchTerm(e.target.value),
                                    placeholder: "Search for programs or materials...",
                                    className: "w-full pl-12 pr-4 py-5 rounded-full bg-[#232425] text-white placeholder-gray-400 focus:ring-2 focus:ring-amber-50 outline-none transition cursor-text",
                                    onKeyDown: handleSearchKeyDown
                                }, void 0, false, {
                                    fileName: "[project]/app/(protected)/programs/page.tsx",
                                    lineNumber: 173,
                                    columnNumber: 25
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/(protected)/programs/page.tsx",
                            lineNumber: 171,
                            columnNumber: 21
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex flex-wrap gap-4 mb-4 justify-center",
                            children: programFilters.map((filter)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    className: `px-6 py-3 rounded-xl cursor-pointer font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg
                                    ${filters.school.includes(filter) ? "bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-orange-500/50 shadow-xl border-2 border-orange-400" : "bg-gradient-to-r from-gray-800/80 to-gray-700/80 text-gray-200 hover:from-orange-600/20 hover:to-red-600/20 hover:text-white border-2 border-gray-600/50 hover:border-orange-400/50 hover:shadow-orange-500/25 hover:shadow-xl backdrop-blur-sm"}
                                `,
                                    onClick: ()=>handleFilterClick(filter),
                                    children: filter
                                }, filter, false, {
                                    fileName: "[project]/app/(protected)/programs/page.tsx",
                                    lineNumber: 185,
                                    columnNumber: 29
                                }, this))
                        }, void 0, false, {
                            fileName: "[project]/app/(protected)/programs/page.tsx",
                            lineNumber: 183,
                            columnNumber: 21
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/(protected)/programs/page.tsx",
                    lineNumber: 166,
                    columnNumber: 17
                }, this)
            }, void 0, false, {
                fileName: "[project]/app/(protected)/programs/page.tsx",
                lineNumber: 165,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "max-w-6xl mx-auto px-6 pb-20 pt-10 flex flex-col gap-10",
                ref: resultsRef,
                children: [
                    filteredCourses.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "mb-2",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "font-semibold mr-4",
                                children: "Sort By"
                            }, void 0, false, {
                                fileName: "[project]/app/(protected)/programs/page.tsx",
                                lineNumber: 208,
                                columnNumber: 25
                            }, this),
                            sortOptions.map((opt)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    className: `px-4 py-2 rounded-lg font-medium transition-colors mr-2 cursor-pointer
                                    ${filters.sort === opt.value || !filters.sort && opt.value === "relevance" ? "bg-[#36454F] text-white" : "bg-[#36454F]/60 text-gray-300 hover:bg-[#232425]"}
                                `,
                                    onClick: ()=>setFilters((f)=>({
                                                ...f,
                                                sort: opt.value
                                            })),
                                    children: opt.label
                                }, opt.value, false, {
                                    fileName: "[project]/app/(protected)/programs/page.tsx",
                                    lineNumber: 210,
                                    columnNumber: 29
                                }, this))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/(protected)/programs/page.tsx",
                        lineNumber: 207,
                        columnNumber: 21
                    }, this),
                    filteredCourses.length > 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex flex-col gap-8",
                        children: currentCourses.map((course, idx)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex flex-col md:flex-row items-stretch rounded-xl overflow-hidden shadow-lg bg-[#232425] transition-transform duration-300 ease-in-out hover:shadow-2xl hover:scale-105 cursor-pointer",
                                onClick: ()=>router.push(`/programs/${course._id}`),
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex-1 p-10 flex flex-col justify-center",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "text-sm text-gray-400 mb-1",
                                                children: course.school.name
                                            }, void 0, false, {
                                                fileName: "[project]/app/(protected)/programs/page.tsx",
                                                lineNumber: 236,
                                                columnNumber: 37
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                                className: "text-xl font-bold mb-1",
                                                children: course.name
                                            }, void 0, false, {
                                                fileName: "[project]/app/(protected)/programs/page.tsx",
                                                lineNumber: 237,
                                                columnNumber: 37
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-gray-200 font-medium mb-2",
                                                children: course.code
                                            }, void 0, false, {
                                                fileName: "[project]/app/(protected)/programs/page.tsx",
                                                lineNumber: 238,
                                                columnNumber: 37
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-gray-300 mb-4",
                                                children: course.description
                                            }, void 0, false, {
                                                fileName: "[project]/app/(protected)/programs/page.tsx",
                                                lineNumber: 239,
                                                columnNumber: 37
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex flex-wrap gap-4 text-sm text-gray-400",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        children: [
                                                            course.credits,
                                                            " credits"
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/app/(protected)/programs/page.tsx",
                                                        lineNumber: 241,
                                                        columnNumber: 41
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        children: [
                                                            "Level ",
                                                            course.level
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/app/(protected)/programs/page.tsx",
                                                        lineNumber: 242,
                                                        columnNumber: 41
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "capitalize",
                                                        children: course.difficulty
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/(protected)/programs/page.tsx",
                                                        lineNumber: 243,
                                                        columnNumber: 41
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        children: [
                                                            course.stats.enrollmentCount,
                                                            " enrolled"
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/app/(protected)/programs/page.tsx",
                                                        lineNumber: 244,
                                                        columnNumber: 41
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$star$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Star$3e$__["Star"], {
                                                                className: "inline w-4 h-4 text-yellow-400 mr-1"
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/(protected)/programs/page.tsx",
                                                                lineNumber: 246,
                                                                columnNumber: 45
                                                            }, this),
                                                            course.stats.rating.average,
                                                            " (",
                                                            course.stats.rating.count,
                                                            ")"
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/app/(protected)/programs/page.tsx",
                                                        lineNumber: 245,
                                                        columnNumber: 41
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/(protected)/programs/page.tsx",
                                                lineNumber: 240,
                                                columnNumber: 37
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/(protected)/programs/page.tsx",
                                        lineNumber: 235,
                                        columnNumber: 33
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "md:w-64 h-64 flex-shrink-0 flex items-center justify-center",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                            src: course.imageUrl,
                                            alt: course.name,
                                            width: 256,
                                            height: 192,
                                            className: "object-cover object-center w-full h-full rounded-none"
                                        }, void 0, false, {
                                            fileName: "[project]/app/(protected)/programs/page.tsx",
                                            lineNumber: 253,
                                            columnNumber: 37
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/app/(protected)/programs/page.tsx",
                                        lineNumber: 252,
                                        columnNumber: 33
                                    }, this)
                                ]
                            }, course._id, true, {
                                fileName: "[project]/app/(protected)/programs/page.tsx",
                                lineNumber: 229,
                                columnNumber: 29
                            }, this))
                    }, void 0, false, {
                        fileName: "[project]/app/(protected)/programs/page.tsx",
                        lineNumber: 227,
                        columnNumber: 21
                    }, this) : /* No results message */ /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "text-center py-20",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "text-6xl mb-4",
                                children: "🔍"
                            }, void 0, false, {
                                fileName: "[project]/app/(protected)/programs/page.tsx",
                                lineNumber: 267,
                                columnNumber: 25
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                className: "text-2xl font-bold text-gray-300 mb-2",
                                children: "No courses found"
                            }, void 0, false, {
                                fileName: "[project]/app/(protected)/programs/page.tsx",
                                lineNumber: 268,
                                columnNumber: 25
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-gray-400",
                                children: "Try adjusting your search terms or filters to find what you're looking for."
                            }, void 0, false, {
                                fileName: "[project]/app/(protected)/programs/page.tsx",
                                lineNumber: 269,
                                columnNumber: 25
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/(protected)/programs/page.tsx",
                        lineNumber: 266,
                        columnNumber: 21
                    }, this),
                    filteredCourses.length > 0 && totalPages > 1 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex justify-center items-center gap-4 mt-10",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>handlePageChange(currentPage - 1),
                                disabled: currentPage === 1,
                                className: `px-4 py-2 rounded-lg font-medium transition-colors cursor-pointer ${currentPage === 1 ? 'bg-gray-700 text-gray-500 cursor-not-allowed' : 'bg-[#36454F] text-white hover:bg-[#232425]'}`,
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$left$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronLeft$3e$__["ChevronLeft"], {
                                    className: "w-5 h-5"
                                }, void 0, false, {
                                    fileName: "[project]/app/(protected)/programs/page.tsx",
                                    lineNumber: 288,
                                    columnNumber: 29
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/app/(protected)/programs/page.tsx",
                                lineNumber: 279,
                                columnNumber: 25
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex gap-2",
                                children: Array.from({
                                    length: totalPages
                                }, (_, i)=>i + 1).map((page)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: ()=>handlePageChange(page),
                                        className: `px-3 py-2 rounded-lg font-medium transition-colors cursor-pointer ${currentPage === page ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white' : 'bg-[#36454F] text-gray-300 hover:bg-[#232425]'}`,
                                        children: page
                                    }, page, false, {
                                        fileName: "[project]/app/(protected)/programs/page.tsx",
                                        lineNumber: 294,
                                        columnNumber: 33
                                    }, this))
                            }, void 0, false, {
                                fileName: "[project]/app/(protected)/programs/page.tsx",
                                lineNumber: 292,
                                columnNumber: 25
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>handlePageChange(currentPage + 1),
                                disabled: currentPage === totalPages,
                                className: `px-4 py-2 rounded-lg font-medium transition-colors cursor-pointer ${currentPage === totalPages ? 'bg-gray-700 text-gray-500 cursor-not-allowed' : 'bg-[#36454F] text-white hover:bg-[#232425]'}`,
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$right$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronRight$3e$__["ChevronRight"], {
                                    className: "w-5 h-5"
                                }, void 0, false, {
                                    fileName: "[project]/app/(protected)/programs/page.tsx",
                                    lineNumber: 318,
                                    columnNumber: 29
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/app/(protected)/programs/page.tsx",
                                lineNumber: 309,
                                columnNumber: 25
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/(protected)/programs/page.tsx",
                        lineNumber: 277,
                        columnNumber: 21
                    }, this),
                    filteredCourses.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "text-center text-gray-400 mt-4",
                        children: [
                            "Showing ",
                            indexOfFirstCourse + 1,
                            " to ",
                            Math.min(indexOfLastCourse, filteredCourses.length),
                            " of ",
                            filteredCourses.length,
                            " courses"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/(protected)/programs/page.tsx",
                        lineNumber: 325,
                        columnNumber: 21
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/(protected)/programs/page.tsx",
                lineNumber: 204,
                columnNumber: 13
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/(protected)/programs/page.tsx",
        lineNumber: 158,
        columnNumber: 9
    }, this);
};
_s(CoursesPage, "xADJSyiRDOqrUDm1FP/VBWdyC/c=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2d$auth$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useSession"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"]
    ];
});
_c = CoursesPage;
const __TURBOPACK__default__export__ = CoursesPage;
var _c;
__turbopack_context__.k.register(_c, "CoursesPage");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
}]);

//# sourceMappingURL=_2ecda111._.js.map