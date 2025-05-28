(globalThis.TURBOPACK = globalThis.TURBOPACK || []).push([typeof document === "object" ? document.currentScript : undefined, {

"[project]/lib/api.ts [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "acceptFriendRequest": (()=>acceptFriendRequest),
    "completeOnBoarding": (()=>completeOnBoarding),
    "getAuthUser": (()=>getAuthUser),
    "getFriendRequests": (()=>getFriendRequests),
    "getOutgoingFriendReqs": (()=>getOutgoingFriendReqs),
    "getRecommendedUsers": (()=>getRecommendedUsers),
    "getStreamToken": (()=>getStreamToken),
    "getUserFriends": (()=>getUserFriends),
    "sendFriendRequest": (()=>sendFriendRequest),
    "signIn": (()=>signIn),
    "signUp": (()=>signUp)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
const BASE_URL = ("TURBOPACK compile-time value", "http://localhost:5001/api") || 'http://localhost:5001/api';
const makeAuthenticationRequest = async (endpoint, options = {})=>{
    const token = localStorage.getItem('auth_token');
    const headers = {
        'Content-Type': 'application/json',
        ...token && {
            Authorization: `Bearer ${token}`
        },
        ...options.headers
    };
    return fetch(`${BASE_URL}${endpoint}`, {
        ...options,
        headers
    });
};
const signUp = async (signUpData)=>{
    try {
        const response = await fetch(`${BASE_URL}/auth/sign-up`, {
            method: 'POST',
            body: JSON.stringify(signUpData),
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Signup error:', error);
        return {
            success: false,
            message: 'Network error occurred with signUp function in api.ts'
        };
    }
};
const signIn = async (loginData)=>{
    try {
        const response = await fetch(`${BASE_URL}/auth/sign-in`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(loginData)
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Login error in api.ts:', error);
        return {
            success: false,
            message: 'Something wrong with signIn function in api.ts'
        };
    }
};
const getAuthUser = async ()=>{
    try {
        const response = await makeAuthenticationRequest("/auth/me");
        if (!response.ok) {
            return null;
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Get auth user error in api.ts:', error);
        return null;
    }
};
const completeOnBoarding = async (userData)=>{
    try {
        const response = await makeAuthenticationRequest('/auth/onBoarding', {
            method: 'POST',
            body: JSON.stringify(userData)
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Onboarding error in api.ts: ", error);
        return {
            success: false,
            message: "Internal error in Onboarding in api.ts"
        };
    }
};
async function getUserFriends() {
    try {
        const response = await makeAuthenticationRequest('/users/friends');
        if (!response.ok) {
            throw new Error('Failed to fetch friends');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Get friends error:', error);
        throw error;
    }
    ;
}
async function getRecommendedUsers() {
    try {
        const response = await makeAuthenticationRequest('/users/');
        if (!response.ok) {
            throw new Error('Failed to fetch recommended users');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Get recommended users error:', error);
        throw error;
    }
}
async function getOutgoingFriendReqs() {
    try {
        const response = await makeAuthenticationRequest('/users/outgoing-friend-requests');
        if (!response.ok) {
            throw new Error('Failed to fetch outgoing requests');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Get outgoing requests error:', error);
        throw error;
    }
}
async function sendFriendRequest(userId) {
    try {
        const response = await makeAuthenticationRequest(`/users/friend-request/${userId}`, {
            method: 'POST'
        });
        if (!response.ok) {
            throw new Error('Failed to send friend request');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Send friend request error:', error);
        throw error;
    }
}
async function getFriendRequests() {
    try {
        const response = await makeAuthenticationRequest('/users/friend-requests');
        if (!response.ok) {
            throw new Error('Failed to fetch friend requests');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Get friend requests error:', error);
        throw error;
    }
}
async function acceptFriendRequest(requestId) {
    try {
        const response = await makeAuthenticationRequest(`/users/friend-request/${requestId}/accept`, {
            method: 'PUT'
        });
        if (!response.ok) {
            throw new Error('Failed to accept friend request');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Accept friend request error:', error);
        throw error;
    }
}
async function getStreamToken() {
    try {
        const response = await makeAuthenticationRequest('/chat/token');
        if (!response.ok) {
            throw new Error('Failed to get stream token');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Get stream token error:', error);
        throw error;
    }
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/lib/utils.ts [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "capitialize": (()=>capitialize)
});
const capitialize = (str)=>str.charAt(0).toUpperCase() + str.slice(1);
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/constants/index.ts [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "LANGUAGES": (()=>LANGUAGES),
    "LANGUAGE_TO_FLAG": (()=>LANGUAGE_TO_FLAG),
    "THEMES": (()=>THEMES)
});
const THEMES = [
    {
        name: "light",
        label: "Light",
        colors: [
            "#ffffff",
            "#5a67d8",
            "#8b5cf6",
            "#1a202c"
        ]
    },
    {
        name: "dark",
        label: "Dark",
        colors: [
            "#1f2937",
            "#8b5cf6",
            "#ec4899",
            "#1a202c"
        ]
    },
    {
        name: "cupcake",
        label: "Cupcake",
        colors: [
            "#f5f5f4",
            "#65c3c8",
            "#ef9fbc",
            "#291334"
        ]
    },
    {
        name: "forest",
        label: "Forest",
        colors: [
            "#1f1d1d",
            "#3ebc96",
            "#70c217",
            "#e2e8f0"
        ]
    },
    {
        name: "bumblebee",
        label: "Bumblebee",
        colors: [
            "#ffffff",
            "#f8e36f",
            "#f0d50c",
            "#1c1917"
        ]
    },
    {
        name: "emerald",
        label: "Emerald",
        colors: [
            "#ffffff",
            "#66cc8a",
            "#3b82f6",
            "#1e3a8a"
        ]
    },
    {
        name: "corporate",
        label: "Corporate",
        colors: [
            "#ffffff",
            "#4b6bfb",
            "#7b92b2",
            "#1d232a"
        ]
    },
    {
        name: "synthwave",
        label: "Synthwave",
        colors: [
            "#2d1b69",
            "#e779c1",
            "#58c7f3",
            "#f8f8f2"
        ]
    },
    {
        name: "retro",
        label: "Retro",
        colors: [
            "#e4d8b4",
            "#ea6962",
            "#6aaa64",
            "#282425"
        ]
    },
    {
        name: "cyberpunk",
        label: "Cyberpunk",
        colors: [
            "#ffee00",
            "#ff7598",
            "#75d1f0",
            "#1a103d"
        ]
    },
    {
        name: "valentine",
        label: "Valentine",
        colors: [
            "#f0d6e8",
            "#e96d7b",
            "#a991f7",
            "#37243c"
        ]
    },
    {
        name: "halloween",
        label: "Halloween",
        colors: [
            "#0d0d0d",
            "#ff7800",
            "#006400",
            "#ffffff"
        ]
    },
    {
        name: "garden",
        label: "Garden",
        colors: [
            "#e9e7e7",
            "#ec4899",
            "#16a34a",
            "#374151"
        ]
    },
    {
        name: "aqua",
        label: "Aqua",
        colors: [
            "#193549",
            "#4cd4e3",
            "#9059ff",
            "#f8d766"
        ]
    },
    {
        name: "lofi",
        label: "Lofi",
        colors: [
            "#0f0f0f",
            "#1a1919",
            "#232323",
            "#2c2c2c"
        ]
    },
    {
        name: "pastel",
        label: "Pastel",
        colors: [
            "#f7f3f5",
            "#d1c1d7",
            "#a1e3d8",
            "#4a98f1"
        ]
    },
    {
        name: "fantasy",
        label: "Fantasy",
        colors: [
            "#ffe7d6",
            "#a21caf",
            "#3b82f6",
            "#f59e0b"
        ]
    },
    {
        name: "wireframe",
        label: "Wireframe",
        colors: [
            "#e6e6e6",
            "#b3b3b3",
            "#b3b3b3",
            "#888888"
        ]
    },
    {
        name: "black",
        label: "Black",
        colors: [
            "#000000",
            "#191919",
            "#313131",
            "#4a4a4a"
        ]
    },
    {
        name: "luxury",
        label: "Luxury",
        colors: [
            "#171618",
            "#1e293b",
            "#94589c",
            "#d4a85a"
        ]
    },
    {
        name: "dracula",
        label: "Dracula",
        colors: [
            "#282a36",
            "#ff79c6",
            "#bd93f9",
            "#f8f8f2"
        ]
    },
    {
        name: "cmyk",
        label: "CMYK",
        colors: [
            "#f0f0f0",
            "#0891b2",
            "#ec4899",
            "#facc15"
        ]
    },
    {
        name: "autumn",
        label: "Autumn",
        colors: [
            "#f2f2f2",
            "#8c1f11",
            "#f28c18",
            "#6f4930"
        ]
    },
    {
        name: "business",
        label: "Business",
        colors: [
            "#f5f5f5",
            "#1e40af",
            "#3b82f6",
            "#f97316"
        ]
    },
    {
        name: "acid",
        label: "Acid",
        colors: [
            "#110e0e",
            "#ff00f2",
            "#ff7a00",
            "#99ff01"
        ]
    },
    {
        name: "lemonade",
        label: "Lemonade",
        colors: [
            "#ffffff",
            "#67e8f9",
            "#f5d742",
            "#2c3333"
        ]
    },
    {
        name: "night",
        label: "Night",
        colors: [
            "#0f172a",
            "#38bdf8",
            "#818cf8",
            "#e2e8f0"
        ]
    },
    {
        name: "coffee",
        label: "Coffee",
        colors: [
            "#20161f",
            "#dd9866",
            "#497174",
            "#eeeeee"
        ]
    },
    {
        name: "winter",
        label: "Winter",
        colors: [
            "#ffffff",
            "#0284c7",
            "#d946ef",
            "#0f172a"
        ]
    },
    {
        name: "dim",
        label: "Dim",
        colors: [
            "#1c1c27",
            "#10b981",
            "#ff5a5f",
            "#0f172a"
        ]
    },
    {
        name: "nord",
        label: "Nord",
        colors: [
            "#eceff4",
            "#5e81ac",
            "#81a1c1",
            "#3b4252"
        ]
    },
    {
        name: "sunset",
        label: "Sunset",
        colors: [
            "#1e293b",
            "#f5734c",
            "#ec4899",
            "#ffffff"
        ]
    }
];
const LANGUAGES = [
    "English",
    "Spanish",
    "French",
    "German",
    "Mandarin",
    "Japanese",
    "Korean",
    "Hindi",
    "Russian",
    "Portuguese",
    "Arabic",
    "Italian",
    "Turkish",
    "Dutch"
];
const LANGUAGE_TO_FLAG = {
    english: "gb",
    spanish: "es",
    french: "fr",
    german: "de",
    mandarin: "cn",
    japanese: "jp",
    korean: "kr",
    hindi: "in",
    russian: "ru",
    portuguese: "pt",
    arabic: "sa",
    italian: "it",
    turkish: "tr",
    dutch: "nl"
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/components/ui/FriendCard.tsx [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "default": (()=>__TURBOPACK__default__export__),
    "getLanguageFlag": (()=>getLanguageFlag)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/image.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$constants$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/constants/index.ts [app-client] (ecmascript)");
;
;
;
;
const FriendCard = ({ friend })=>{
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "card bg-base-200 hover:shadow-md transition-shadow",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "card-body p-4",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex items-center gap-3 mb-3",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "avatar size-12 rounded-full overflow-hidden relative",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                src: friend.profilePic,
                                alt: friend.fullName,
                                fill: true,
                                className: "object-cover",
                                sizes: "48px",
                                priority: false
                            }, void 0, false, {
                                fileName: "[project]/components/ui/FriendCard.tsx",
                                lineNumber: 26,
                                columnNumber: 25
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/components/ui/FriendCard.tsx",
                            lineNumber: 25,
                            columnNumber: 21
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                            className: "font-semibold truncate",
                            children: friend.fullName
                        }, void 0, false, {
                            fileName: "[project]/components/ui/FriendCard.tsx",
                            lineNumber: 35,
                            columnNumber: 21
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/ui/FriendCard.tsx",
                    lineNumber: 24,
                    columnNumber: 17
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex flex-wrap gap-1.5 mb-3",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "badge badge-secondary text-xs",
                            children: [
                                getLanguageFlag(friend.nativeLanguage),
                                "Native: ",
                                friend.nativeLanguage
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/ui/FriendCard.tsx",
                            lineNumber: 40,
                            columnNumber: 21
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "badge badge-outline text-xs",
                            children: [
                                getLanguageFlag(friend.learningLanguage),
                                "Learning: ",
                                friend.learningLanguage
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/ui/FriendCard.tsx",
                            lineNumber: 44,
                            columnNumber: 21
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/ui/FriendCard.tsx",
                    lineNumber: 39,
                    columnNumber: 17
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                    href: `/chat/${friend._id}`,
                    className: "btn btn-outline w-full",
                    children: "Message"
                }, void 0, false, {
                    fileName: "[project]/components/ui/FriendCard.tsx",
                    lineNumber: 51,
                    columnNumber: 17
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/components/ui/FriendCard.tsx",
            lineNumber: 22,
            columnNumber: 13
        }, this)
    }, void 0, false, {
        fileName: "[project]/components/ui/FriendCard.tsx",
        lineNumber: 21,
        columnNumber: 9
    }, this);
};
_c = FriendCard;
const __TURBOPACK__default__export__ = FriendCard;
function getLanguageFlag(language) {
    if (!language) return null;
    const langLower = language.toLowerCase();
    const countryCode = __TURBOPACK__imported__module__$5b$project$5d2f$constants$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["LANGUAGE_TO_FLAG"][langLower];
    if (countryCode) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "inline-block w-6 h-[18px] mr-1 relative",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                src: `https://flagcdn.com/24x18/${countryCode}.png`,
                alt: `${langLower} flag`,
                width: 24,
                height: 18,
                className: "object-cover",
                unoptimized: true
            }, void 0, false, {
                fileName: "[project]/components/ui/FriendCard.tsx",
                lineNumber: 71,
                columnNumber: 17
            }, this)
        }, void 0, false, {
            fileName: "[project]/components/ui/FriendCard.tsx",
            lineNumber: 70,
            columnNumber: 13
        }, this);
    }
    return null;
}
var _c;
__turbopack_context__.k.register(_c, "FriendCard");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/components/ui/NoFriendFound.tsx [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "default": (()=>__TURBOPACK__default__export__)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$user$2d$plus$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__UserPlusIcon$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/user-plus.js [app-client] (ecmascript) <export default as UserPlusIcon>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$users$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__UsersIcon$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/users.js [app-client] (ecmascript) <export default as UsersIcon>");
;
;
;
const NoFriendsFound = ()=>{
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "card bg-base-200 p-8 text-center",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mb-6",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$users$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__UsersIcon$3e$__["UsersIcon"], {
                        className: "size-16 mx-auto text-base-content opacity-30 mb-4"
                    }, void 0, false, {
                        fileName: "[project]/components/ui/NoFriendFound.tsx",
                        lineNumber: 8,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                        className: "font-semibold text-xl mb-2",
                        children: "No Friends Yet"
                    }, void 0, false, {
                        fileName: "[project]/components/ui/NoFriendFound.tsx",
                        lineNumber: 9,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-base-content opacity-70 max-w-md mx-auto",
                        children: "Start your language learning journey by connecting with other learners! Send friend requests to people who share your language interests."
                    }, void 0, false, {
                        fileName: "[project]/components/ui/NoFriendFound.tsx",
                        lineNumber: 10,
                        columnNumber: 17
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/ui/NoFriendFound.tsx",
                lineNumber: 7,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex flex-col sm:flex-row gap-3 justify-center items-center",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                        href: "/notifications",
                        className: "btn btn-outline",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$users$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__UsersIcon$3e$__["UsersIcon"], {
                                className: "size-4 mr-2"
                            }, void 0, false, {
                                fileName: "[project]/components/ui/NoFriendFound.tsx",
                                lineNumber: 18,
                                columnNumber: 21
                            }, this),
                            "Check Friend Requests"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/ui/NoFriendFound.tsx",
                        lineNumber: 17,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "text-sm opacity-70",
                        children: "or"
                    }, void 0, false, {
                        fileName: "[project]/components/ui/NoFriendFound.tsx",
                        lineNumber: 22,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center text-sm opacity-70",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$user$2d$plus$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__UserPlusIcon$3e$__["UserPlusIcon"], {
                                className: "size-4 mr-1"
                            }, void 0, false, {
                                fileName: "[project]/components/ui/NoFriendFound.tsx",
                                lineNumber: 25,
                                columnNumber: 21
                            }, this),
                            "Browse recommended users below"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/ui/NoFriendFound.tsx",
                        lineNumber: 24,
                        columnNumber: 17
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/ui/NoFriendFound.tsx",
                lineNumber: 16,
                columnNumber: 13
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/ui/NoFriendFound.tsx",
        lineNumber: 6,
        columnNumber: 9
    }, this);
};
_c = NoFriendsFound;
const __TURBOPACK__default__export__ = NoFriendsFound;
var _c;
__turbopack_context__.k.register(_c, "NoFriendsFound");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/app/(protected)/page.tsx [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "default": (()=>HomePage)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2d$big$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircleIcon$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/circle-check-big.js [app-client] (ecmascript) <export default as CheckCircleIcon>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$map$2d$pin$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MapPinIcon$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/map-pin.js [app-client] (ecmascript) <export default as MapPinIcon>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$user$2d$plus$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__UserPlusIcon$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/user-plus.js [app-client] (ecmascript) <export default as UserPlusIcon>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$users$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__UsersIcon$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/users.js [app-client] (ecmascript) <export default as UsersIcon>");
var __TURBOPACK__imported__module__$5b$project$5d2f$contexts$2f$AuthContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/contexts/AuthContext.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/api.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/utils.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$FriendCard$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/FriendCard.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$NoFriendFound$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/NoFriendFound.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$hot$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react-hot-toast/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/image.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
;
;
;
;
;
;
;
function HomePage() {
    _s();
    const { user } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$contexts$2f$AuthContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuth"])();
    // State management
    const [friends, setFriends] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [recommendedUsers, setRecommendedUsers] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [outgoingFriendReqs, setOutgoingFriendReqs] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [outgoingRequestsIds, setOutgoingRequestsIds] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(new Set());
    // Loading states
    const [loadingFriends, setLoadingFriends] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const [loadingUsers, setLoadingUsers] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const [loadingOutgoing, setLoadingOutgoing] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const [sendingRequest, setSendingRequest] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    // Fetch friends
    const fetchFriends = async ()=>{
        try {
            setLoadingFriends(true);
            const response = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getUserFriends"])();
            setFriends(response || []);
        } catch (error) {
            console.error('Error fetching friends:', error);
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$hot$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].error('Failed to load friends');
        } finally{
            setLoadingFriends(false);
        }
    };
    // Fetch recommended users
    const fetchRecommendedUsers = async ()=>{
        try {
            setLoadingUsers(true);
            const response = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getRecommendedUsers"])();
            setRecommendedUsers(response || []);
        } catch (error) {
            console.error('Error fetching recommended users:', error);
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$hot$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].error('Failed to load recommended users');
        } finally{
            setLoadingUsers(false);
        }
    };
    // Fetch outgoing friend requests
    const fetchOutgoingRequests = async ()=>{
        try {
            setLoadingOutgoing(true);
            const response = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getOutgoingFriendReqs"])();
            setOutgoingFriendReqs(response || []);
        } catch (error) {
            console.error('Error fetching outgoing requests:', error);
        } finally{
            setLoadingOutgoing(false);
        }
    };
    // Send friend request
    const handleSendFriendRequest = async (userId)=>{
        try {
            setSendingRequest(userId);
            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["sendFriendRequest"])(userId);
            // Refresh outgoing requests to update UI
            await fetchOutgoingRequests();
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$hot$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].success('Friend request sent!');
        } catch (error) {
            console.error('Error sending friend request:', error);
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$hot$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].error('Failed to send friend request');
        } finally{
            setSendingRequest(null);
        }
    };
    // Update outgoing requests IDs for UI state
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "HomePage.useEffect": ()=>{
            const outgoingIds = new Set();
            if (outgoingFriendReqs && outgoingFriendReqs.length > 0) {
                outgoingFriendReqs.forEach({
                    "HomePage.useEffect": (req)=>{
                        outgoingIds.add(req.recipient._id);
                    }
                }["HomePage.useEffect"]);
                setOutgoingRequestsIds(outgoingIds);
            }
        }
    }["HomePage.useEffect"], [
        outgoingFriendReqs
    ]);
    // Initial data fetch
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "HomePage.useEffect": ()=>{
            if (user) {
                fetchFriends();
                fetchRecommendedUsers();
                fetchOutgoingRequests();
            }
        }
    }["HomePage.useEffect"], [
        user
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "p-4 sm:p-6 lg:p-8",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "container mx-auto space-y-10",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                            className: "text-2xl sm:text-3xl font-bold tracking-tight",
                            children: "Your Friends"
                        }, void 0, false, {
                            fileName: "[project]/app/(protected)/page.tsx",
                            lineNumber: 137,
                            columnNumber: 6
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                            href: "/notifications",
                            className: "btn btn-outline btn-sm",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$users$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__UsersIcon$3e$__["UsersIcon"], {
                                    className: "mr-2 size-4"
                                }, void 0, false, {
                                    fileName: "[project]/app/(protected)/page.tsx",
                                    lineNumber: 139,
                                    columnNumber: 7
                                }, this),
                                "Friend Requests"
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/(protected)/page.tsx",
                            lineNumber: 138,
                            columnNumber: 6
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/(protected)/page.tsx",
                    lineNumber: 136,
                    columnNumber: 5
                }, this),
                loadingFriends ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex justify-center py-12",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "loading loading-spinner loading-lg"
                    }, void 0, false, {
                        fileName: "[project]/app/(protected)/page.tsx",
                        lineNumber: 147,
                        columnNumber: 7
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/app/(protected)/page.tsx",
                    lineNumber: 146,
                    columnNumber: 6
                }, this) : friends.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$NoFriendFound$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                    fileName: "[project]/app/(protected)/page.tsx",
                    lineNumber: 150,
                    columnNumber: 6
                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4",
                    children: friends.map((friend)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$FriendCard$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                            friend: friend
                        }, friend._id, false, {
                            fileName: "[project]/app/(protected)/page.tsx",
                            lineNumber: 154,
                            columnNumber: 8
                        }, this))
                }, void 0, false, {
                    fileName: "[project]/app/(protected)/page.tsx",
                    lineNumber: 152,
                    columnNumber: 6
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "mb-6 sm:mb-8",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                            className: "text-2xl sm:text-3xl font-bold tracking-tight",
                                            children: "Meet New Learners"
                                        }, void 0, false, {
                                            fileName: "[project]/app/(protected)/page.tsx",
                                            lineNumber: 164,
                                            columnNumber: 9
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "opacity-70",
                                            children: "Discover perfect language exchange partners based on your profile"
                                        }, void 0, false, {
                                            fileName: "[project]/app/(protected)/page.tsx",
                                            lineNumber: 165,
                                            columnNumber: 9
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/(protected)/page.tsx",
                                    lineNumber: 163,
                                    columnNumber: 8
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/app/(protected)/page.tsx",
                                lineNumber: 162,
                                columnNumber: 7
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/app/(protected)/page.tsx",
                            lineNumber: 161,
                            columnNumber: 6
                        }, this),
                        loadingUsers ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex justify-center py-12",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "loading loading-spinner loading-lg"
                            }, void 0, false, {
                                fileName: "[project]/app/(protected)/page.tsx",
                                lineNumber: 174,
                                columnNumber: 8
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/app/(protected)/page.tsx",
                            lineNumber: 173,
                            columnNumber: 7
                        }, this) : recommendedUsers.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "card bg-base-200 p-6 text-center",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                    className: "font-semibold text-lg mb-2",
                                    children: "No recommendations available"
                                }, void 0, false, {
                                    fileName: "[project]/app/(protected)/page.tsx",
                                    lineNumber: 178,
                                    columnNumber: 8
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-base-content opacity-70",
                                    children: "Check back later for new language partners!"
                                }, void 0, false, {
                                    fileName: "[project]/app/(protected)/page.tsx",
                                    lineNumber: 179,
                                    columnNumber: 8
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/(protected)/page.tsx",
                            lineNumber: 177,
                            columnNumber: 7
                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6",
                            children: recommendedUsers.map((user)=>{
                                const hasRequestBeenSent = outgoingRequestsIds.has(user._id);
                                const isCurrentlySending = sendingRequest === user._id;
                                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "card bg-base-200 hover:shadow-lg transition-all duration-300",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "card-body p-5 space-y-4",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex items-center gap-3",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "avatar size-16 rounded-full overflow-hidden relative w-32 h-32",
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                                            src: user.profilePic,
                                                            alt: user.fullName,
                                                            className: "w-full h-full object-cover",
                                                            fill: true
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/(protected)/page.tsx",
                                                            lineNumber: 197,
                                                            columnNumber: 14
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/(protected)/page.tsx",
                                                        lineNumber: 196,
                                                        columnNumber: 13
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                                className: "font-semibold text-lg",
                                                                children: user.fullName
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/(protected)/page.tsx",
                                                                lineNumber: 206,
                                                                columnNumber: 14
                                                            }, this),
                                                            user.location && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "flex items-center text-xs opacity-70 mt-1",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$map$2d$pin$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MapPinIcon$3e$__["MapPinIcon"], {
                                                                        className: "size-3 mr-1"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/app/(protected)/page.tsx",
                                                                        lineNumber: 209,
                                                                        columnNumber: 16
                                                                    }, this),
                                                                    user.location
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/app/(protected)/page.tsx",
                                                                lineNumber: 208,
                                                                columnNumber: 15
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/app/(protected)/page.tsx",
                                                        lineNumber: 205,
                                                        columnNumber: 13
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/(protected)/page.tsx",
                                                lineNumber: 195,
                                                columnNumber: 12
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex flex-wrap gap-1.5",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "badge badge-secondary",
                                                        children: [
                                                            (0, __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$FriendCard$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getLanguageFlag"])(user.nativeLanguage),
                                                            "Native: ",
                                                            (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["capitialize"])(user.nativeLanguage)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/app/(protected)/page.tsx",
                                                        lineNumber: 218,
                                                        columnNumber: 13
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "badge badge-outline",
                                                        children: [
                                                            (0, __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$FriendCard$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getLanguageFlag"])(user.learningLanguage),
                                                            "Learning: ",
                                                            (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["capitialize"])(user.learningLanguage)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/app/(protected)/page.tsx",
                                                        lineNumber: 222,
                                                        columnNumber: 13
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/(protected)/page.tsx",
                                                lineNumber: 217,
                                                columnNumber: 12
                                            }, this),
                                            user.bio && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-sm opacity-70",
                                                children: user.bio
                                            }, void 0, false, {
                                                fileName: "[project]/app/(protected)/page.tsx",
                                                lineNumber: 228,
                                                columnNumber: 25
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                className: `btn w-full mt-2 ${hasRequestBeenSent ? "btn-disabled" : "btn-primary"}`,
                                                onClick: ()=>handleSendFriendRequest(user._id),
                                                disabled: hasRequestBeenSent || isCurrentlySending,
                                                children: isCurrentlySending ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "loading loading-spinner loading-xs mr-2"
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/(protected)/page.tsx",
                                                            lineNumber: 239,
                                                            columnNumber: 15
                                                        }, this),
                                                        "Sending..."
                                                    ]
                                                }, void 0, true) : hasRequestBeenSent ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2d$big$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircleIcon$3e$__["CheckCircleIcon"], {
                                                            className: "size-4 mr-2"
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/(protected)/page.tsx",
                                                            lineNumber: 244,
                                                            columnNumber: 15
                                                        }, this),
                                                        "Request Sent"
                                                    ]
                                                }, void 0, true) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$user$2d$plus$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__UserPlusIcon$3e$__["UserPlusIcon"], {
                                                            className: "size-4 mr-2"
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/(protected)/page.tsx",
                                                            lineNumber: 249,
                                                            columnNumber: 15
                                                        }, this),
                                                        "Send Friend Request"
                                                    ]
                                                }, void 0, true)
                                            }, void 0, false, {
                                                fileName: "[project]/app/(protected)/page.tsx",
                                                lineNumber: 231,
                                                columnNumber: 12
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/(protected)/page.tsx",
                                        lineNumber: 194,
                                        columnNumber: 11
                                    }, this)
                                }, user._id, false, {
                                    fileName: "[project]/app/(protected)/page.tsx",
                                    lineNumber: 190,
                                    columnNumber: 10
                                }, this);
                            })
                        }, void 0, false, {
                            fileName: "[project]/app/(protected)/page.tsx",
                            lineNumber: 184,
                            columnNumber: 7
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/(protected)/page.tsx",
                    lineNumber: 160,
                    columnNumber: 5
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/app/(protected)/page.tsx",
            lineNumber: 134,
            columnNumber: 4
        }, this)
    }, void 0, false, {
        fileName: "[project]/app/(protected)/page.tsx",
        lineNumber: 133,
        columnNumber: 3
    }, this);
}
_s(HomePage, "rO4ROMdE4ZVwpwy0gLJBLZhmsMk=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$contexts$2f$AuthContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuth"]
    ];
});
_c = HomePage;
var _c;
__turbopack_context__.k.register(_c, "HomePage");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
}]);

//# sourceMappingURL=_6407ccf8._.js.map