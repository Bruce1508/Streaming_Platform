(globalThis.TURBOPACK = globalThis.TURBOPACK || []).push([typeof document === "object" ? document.currentScript : undefined, {

"[project]/components/ui/PageLoader.tsx [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "default": (()=>__TURBOPACK__default__export__)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__LoaderIcon$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/loader.js [app-client] (ecmascript) <export default as LoaderIcon>");
;
;
const PageLoader = ()=>{
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "min-h-screen flex items-center justify-center",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$loader$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__LoaderIcon$3e$__["LoaderIcon"], {
            className: "animate-spin size-10 text-primary"
        }, void 0, false, {
            fileName: "[project]/components/ui/PageLoader.tsx",
            lineNumber: 6,
            columnNumber: 13
        }, this)
    }, void 0, false, {
        fileName: "[project]/components/ui/PageLoader.tsx",
        lineNumber: 5,
        columnNumber: 9
    }, this);
};
_c = PageLoader;
const __TURBOPACK__default__export__ = PageLoader;
var _c;
__turbopack_context__.k.register(_c, "PageLoader");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/lib/axios.ts [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "axiosInstance": (()=>axiosInstance)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/axios/lib/axios.js [app-client] (ecmascript)");
;
const BASE_URL = ("TURBOPACK compile-time value", "http://localhost:5001/api") || "http://localhost:5001/api";
console.log('🔧 Axios config - BASE_URL:', BASE_URL);
const axiosInstance = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].create({
    baseURL: BASE_URL,
    withCredentials: true,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json'
    }
});
// Debug interceptors
axiosInstance.interceptors.request.use((config)=>{
    console.log('📤 Axios request:', {
        url: config.url,
        fullUrl: (config.baseURL || '') + (config.url || ''),
        method: config.method,
        withCredentials: config.withCredentials,
        headers: config.headers
    });
    return config;
}, (error)=>{
    console.log('❌ Request interceptor error:', error);
    return Promise.reject(error);
});
axiosInstance.interceptors.response.use((response)=>{
    console.log('📥 Axios response:', {
        status: response.status,
        url: response.config.url,
        data: response.data
    });
    return response;
}, (error)=>{
    console.log('❌ Response interceptor error:', {
        status: error.response?.status,
        data: error.response?.data,
        url: error.config?.url,
        message: error.message
    });
    return Promise.reject(error);
});
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/lib/api.ts [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
// lib/api.ts
__turbopack_context__.s({
    "acceptFriendRequest": (()=>acceptFriendRequest),
    "completeOnboarding": (()=>completeOnboarding),
    "getAuthUser": (()=>getAuthUser),
    "getFriendRequests": (()=>getFriendRequests),
    "getOutgoingFriendReqs": (()=>getOutgoingFriendReqs),
    "getRecommendedUsers": (()=>getRecommendedUsers),
    "getStreamToken": (()=>getStreamToken),
    "getUserFriends": (()=>getUserFriends),
    "login": (()=>login),
    "logout": (()=>logout),
    "sendFriendRequest": (()=>sendFriendRequest),
    "signup": (()=>signup)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$axios$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/axios.ts [app-client] (ecmascript)");
;
const signup = async (signupData)=>{
    try {
        console.log("Sending signup data:", signupData);
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$axios$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["axiosInstance"].post("/auth/sign-up", signupData);
        console.log("Signup response:", response.data);
        return response.data;
    } catch (error) {
        if (error.response) {
            // Thông tin chi tiết hơn về lỗi từ server
            console.error("Error status:", error.response.status);
            console.error("Error data:", error.response.data);
            console.error("Error headers:", error.response.headers);
        } else if (error.request) {
            // Request đã được gửi nhưng không nhận được response
            console.error("Error request:", error.request);
        } else {
            // Lỗi khi setting up request
            console.error("Error message:", error.message);
        }
        return {
            success: false,
            message: error.response?.data?.message || 'Failed to sign up'
        };
    }
};
const login = async (loginData)=>{
    try {
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$axios$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["axiosInstance"].post("/auth/login", loginData);
        return response.data;
    } catch (error) {
        return {
            success: false,
            message: error.response?.data?.message || 'Failed to sign in'
        };
    }
};
const logout = async ()=>{
    const response = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$axios$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["axiosInstance"].post("/auth/logout");
    return response.data;
};
const getAuthUser = async ()=>{
    try {
        console.log('🚀 Starting getAuthUser...');
        console.log('🌐 Base URL:', ("TURBOPACK compile-time value", "http://localhost:5001/api"));
        console.log('🔗 Making request to:', `${("TURBOPACK compile-time value", "http://localhost:5001/api")}/auth/me`);
        const res = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$axios$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["axiosInstance"].get("/auth/me");
        console.log('✅ Response from /auth/me:', res.data);
        return res.data;
    } catch (error) {
        console.log("❌ Detailed error in getAuthUser:");
        console.log("Status:", error.response?.status);
        console.log("Data:", error.response?.data);
        console.log("Headers:", error.response?.headers);
        console.log("Config:", error.config);
        console.log("Full error:", error);
        return null;
    }
};
const completeOnboarding = async (userData, options)=>{
    try {
        // Nếu có cookieHeader, sử dụng fetch (cho Server Actions)
        if (options?.cookieHeader) {
            const backendUrl = ("TURBOPACK compile-time value", "http://localhost:5001/api") || 'http://localhost:5001/api';
            const response = await fetch(`${backendUrl}/auth/onBoarding`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Cookie': options.cookieHeader
                },
                credentials: 'include',
                body: JSON.stringify(userData)
            });
            const data = await response.json();
            return data;
        } else {
            const response = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$axios$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["axiosInstance"].post("/auth/onBoarding", userData);
            return response.data;
        }
    } catch (error) {
        return {
            success: false,
            message: error.response?.data?.message || 'Failed to complete onboarding'
        };
    }
};
async function getUserFriends() {
    const response = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$axios$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["axiosInstance"].get("/users/friends");
    return response.data;
}
async function getRecommendedUsers() {
    const response = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$axios$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["axiosInstance"].get("/users");
    return response.data;
}
async function getOutgoingFriendReqs() {
    const response = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$axios$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["axiosInstance"].get("/users/outgoing-friend-requests");
    return response.data;
}
async function sendFriendRequest(userId) {
    const response = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$axios$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["axiosInstance"].post(`/users/friend-request/${userId}`);
    return response.data;
}
async function getFriendRequests() {
    const response = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$axios$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["axiosInstance"].get("/users/friend-requests");
    return response.data;
}
async function acceptFriendRequest(requestId) {
    const response = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$axios$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["axiosInstance"].put(`/users/friend-request/${requestId}/accept`);
    return response.data;
}
async function getStreamToken() {
    const response = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$axios$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["axiosInstance"].get("/chat/token");
    return response.data;
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/hooks/useAuthUser.ts [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "default": (()=>__TURBOPACK__default__export__)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/api.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@tanstack/react-query/build/modern/useQuery.js [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
;
;
const useAuthUser = ()=>{
    _s();
    const authUser = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"])({
        queryKey: [
            "authUser"
        ],
        queryFn: {
            "useAuthUser.useQuery[authUser]": async ()=>{
                console.log('🔄 Calling getAuthUser...');
                const result = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getAuthUser"])();
                console.log('📦 getAuthUser result:', result);
                return result;
            }
        }["useAuthUser.useQuery[authUser]"],
        retry: false,
        staleTime: 0,
        refetchOnMount: true
    });
    console.log('🎯 useAuthUser state:', {
        isLoading: authUser.isLoading,
        error: authUser.error,
        data: authUser.data,
        user: authUser.data?.user
    });
    return {
        isLoading: authUser.isLoading,
        authUser: authUser.data?.user
    };
};
_s(useAuthUser, "WhTKLJ00p/ToWxyLcwggbKdf81s=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$useQuery$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useQuery"]
    ];
});
const __TURBOPACK__default__export__ = useAuthUser;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/app/(protected)/layout.tsx [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "default": (()=>ProtectedLayout)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$PageLoader$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/PageLoader.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$useAuthUser$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/hooks/useAuthUser.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
;
;
function ProtectedLayout({ children }) {
    _s();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const pathname = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePathname"])();
    // Kiểm tra nếu người dùng vừa đăng ký
    const justSignedUp = "object" !== 'undefined' && sessionStorage.getItem('justSignedUp') === 'true';
    const { isLoading, authUser } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$useAuthUser$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])();
    const isAuthenticated = Boolean(authUser) || justSignedUp;
    const isOnboarded = authUser?.isOnboarded || justSignedUp;
    console.log('Protected layout - Auth data:', authUser);
    console.log('Protected layout - isAuthenticated:', isAuthenticated);
    console.log('Protected layout - isOnboarded:', isOnboarded);
    console.log('Protected layout - justSignedUp:', justSignedUp);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ProtectedLayout.useEffect": ()=>{
            if (isLoading) return;
            if (!isAuthenticated) {
                router.push("/sign-up");
                return;
            }
            switch(pathname){
                case "/onBoarding":
                    break;
                case "/call":
                case "/chat":
                case "/notifications":
                    if (!isOnboarded) {
                        router.push("/onBoarding");
                    }
                    ;
                    break;
                default:
                    // For other protected routes, require onboarding
                    if (!isOnboarded) {
                        router.push("/onboarding");
                    }
            }
            // Clear sign-up flag after use
            if (justSignedUp && authUser) {
                sessionStorage.removeItem('justSignedUp');
            }
        }
    }["ProtectedLayout.useEffect"], [
        isLoading,
        isAuthenticated,
        isOnboarded,
        router,
        pathname,
        authUser,
        justSignedUp
    ]);
    if (isLoading) return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$PageLoader$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
        fileName: "[project]/app/(protected)/layout.tsx",
        lineNumber: 58,
        columnNumber: 27
    }, this);
    // Don't render loader for onboarding page if user is authenticated but not onboarded
    if (pathname === "/onboarding" && isAuthenticated) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
            children: children
        }, void 0, false);
    }
    // Nếu không xác thực hoặc không onboarded (trừ trang onboarding),
    if (!isAuthenticated || !isOnboarded && pathname !== "/onboarding") {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$PageLoader$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
            fileName: "[project]/app/(protected)/layout.tsx",
            lineNumber: 67,
            columnNumber: 16
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
        children: children
    }, void 0, false);
}
_s(ProtectedLayout, "gpfsQIkxPhMYPen0VDg+azClWUg=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePathname"],
        __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$useAuthUser$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]
    ];
});
_c = ProtectedLayout;
var _c;
__turbopack_context__.k.register(_c, "ProtectedLayout");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
}]);

//# sourceMappingURL=_31569336._.js.map