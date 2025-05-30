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
        console.log('🌐 Making API call to /users/friend-requests');
        const response = await makeAuthenticationRequest('/users/friend-requests');
        console.log('📡 Response status:', response.status);
        if (!response.ok) {
            console.error('❌ Response not OK:', response.status, response.statusText);
            throw new Error('Failed to fetch friend requests');
        }
        const data = await response.json();
        console.log('📦 Raw API response:', data);
        // Check backend response structure
        const result = {
            incomingRequests: data.incomingRequests || data.incomingReqs || [],
            acceptedRequests: data.acceptedRequests || data.acceptedReqs || []
        };
        console.log('🔄 Mapped result:', result);
        return result;
    } catch (error) {
        console.error('❌ Get friend requests error:', error);
        throw error;
    }
}
async function acceptFriendRequest(requestId) {
    try {
        console.log('🔄 Accepting friend request:', requestId);
        const response = await makeAuthenticationRequest(`/users/friend-request/${requestId}/accept`, {
            method: 'PUT'
        });
        console.log('📡 Accept response status:', response.status);
        if (!response.ok) {
            const errorData = await response.json();
            console.error('❌ Accept failed:', errorData);
            throw new Error(errorData.message || 'Failed to accept friend request');
        }
        const data = await response.json();
        console.log('✅ Accept success:', data);
        return data;
    } catch (error) {
        console.error('❌ Accept friend request error:', error);
        throw error;
    }
}
async function getStreamToken() {
    try {
        console.log('🔄 Requesting Stream token...');
        const response = await makeAuthenticationRequest('/chat/token');
        console.log('📡 Response status:', response.status);
        if (!response.ok) {
            const errorData = await response.json();
            console.error('❌ Token request failed:', errorData);
            throw new Error(errorData.message || 'Failed to get stream token in frontend api.ts');
        }
        const data = await response.json();
        console.log('✅ Stream token received:', data);
        return data;
    } catch (error) {
        console.error('❌ Get stream token error in the frontend:', error);
        throw error;
    }
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/components/ui/ChatLoader.tsx [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "default": (()=>__TURBOPACK__default__export__)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$message$2d$circle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MessageCircleIcon$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/message-circle.js [app-client] (ecmascript) <export default as MessageCircleIcon>");
;
;
const ChatLoader = ()=>{
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "flex flex-col items-center justify-center h-[calc(100vh-4rem)]",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "text-center space-y-4",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$message$2d$circle$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MessageCircleIcon$3e$__["MessageCircleIcon"], {
                    className: "size-16 mx-auto text-primary animate-pulse"
                }, void 0, false, {
                    fileName: "[project]/components/ui/ChatLoader.tsx",
                    lineNumber: 7,
                    columnNumber: 17
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "space-y-2",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                            className: "text-xl font-semibold",
                            children: "Connecting to chat..."
                        }, void 0, false, {
                            fileName: "[project]/components/ui/ChatLoader.tsx",
                            lineNumber: 9,
                            columnNumber: 21
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "text-base-content opacity-70",
                            children: "Setting up your secure conversation"
                        }, void 0, false, {
                            fileName: "[project]/components/ui/ChatLoader.tsx",
                            lineNumber: 10,
                            columnNumber: 21
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/ui/ChatLoader.tsx",
                    lineNumber: 8,
                    columnNumber: 17
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex justify-center",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "loading loading-spinner loading-lg text-primary"
                    }, void 0, false, {
                        fileName: "[project]/components/ui/ChatLoader.tsx",
                        lineNumber: 15,
                        columnNumber: 21
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/components/ui/ChatLoader.tsx",
                    lineNumber: 14,
                    columnNumber: 17
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/components/ui/ChatLoader.tsx",
            lineNumber: 6,
            columnNumber: 13
        }, this)
    }, void 0, false, {
        fileName: "[project]/components/ui/ChatLoader.tsx",
        lineNumber: 5,
        columnNumber: 9
    }, this);
};
_c = ChatLoader;
const __TURBOPACK__default__export__ = ChatLoader;
var _c;
__turbopack_context__.k.register(_c, "ChatLoader");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/components/ui/CallButton.tsx [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "default": (()=>__TURBOPACK__default__export__)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$video$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__VideoIcon$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/video.js [app-client] (ecmascript) <export default as VideoIcon>");
'use client';
;
;
const CallButton = ({ handleVideoCall })=>{
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "absolute top-4 right-4 z-10",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
            onClick: handleVideoCall,
            className: "btn btn-primary btn-sm gap-2 shadow-lg",
            title: "Start video call",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$video$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__VideoIcon$3e$__["VideoIcon"], {
                    className: "size-4"
                }, void 0, false, {
                    fileName: "[project]/components/ui/CallButton.tsx",
                    lineNumber: 17,
                    columnNumber: 17
                }, this),
                "Start Video Call"
            ]
        }, void 0, true, {
            fileName: "[project]/components/ui/CallButton.tsx",
            lineNumber: 12,
            columnNumber: 13
        }, this)
    }, void 0, false, {
        fileName: "[project]/components/ui/CallButton.tsx",
        lineNumber: 11,
        columnNumber: 9
    }, this);
};
_c = CallButton;
const __TURBOPACK__default__export__ = CallButton;
var _c;
__turbopack_context__.k.register(_c, "CallButton");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/app/(protected)/chat/[id]/page.tsx [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "default": (()=>__TURBOPACK__default__export__)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$stream$2d$chat$2f$dist$2f$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/stream-chat/dist/esm/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$contexts$2f$AuthContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/contexts/AuthContext.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/api.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$hot$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react-hot-toast/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$ChatLoader$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/ChatLoader.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$stream$2d$chat$2d$react$2f$dist$2f$components$2f$Channel$2f$Channel$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/stream-chat-react/dist/components/Channel/Channel.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$stream$2d$chat$2d$react$2f$dist$2f$components$2f$ChannelHeader$2f$ChannelHeader$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/stream-chat-react/dist/components/ChannelHeader/ChannelHeader.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$stream$2d$chat$2d$react$2f$dist$2f$components$2f$Chat$2f$Chat$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/stream-chat-react/dist/components/Chat/Chat.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$stream$2d$chat$2d$react$2f$dist$2f$components$2f$MessageInput$2f$MessageInput$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/stream-chat-react/dist/components/MessageInput/MessageInput.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$stream$2d$chat$2d$react$2f$dist$2f$components$2f$MessageList$2f$MessageList$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/stream-chat-react/dist/components/MessageList/MessageList.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$stream$2d$chat$2d$react$2f$dist$2f$components$2f$Thread$2f$Thread$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/stream-chat-react/dist/components/Thread/Thread.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$stream$2d$chat$2d$react$2f$dist$2f$components$2f$Window$2f$Window$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/stream-chat-react/dist/components/Window/Window.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$CallButton$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/CallButton.tsx [app-client] (ecmascript)");
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
const STREAM_API_KEY = ("TURBOPACK compile-time value", "a79wc9pemrcb");
console.log('🔧 Environment check:', {
    STREAM_API_KEY: STREAM_API_KEY,
    hasApiKey: !!STREAM_API_KEY,
    allEnvVars: Object.keys(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].env).filter((key)=>key.startsWith('NEXT_PUBLIC_'))
});
const ChatPage = ()=>{
    _s();
    const params = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useParams"])();
    const targetUserId = params.id;
    const [chatClient, setChatClient] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [channel, setChannel] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const [tokenData, setTokenData] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const { user: authUser } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$contexts$2f$AuthContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuth"])();
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ChatPage.useEffect": ()=>{
            const fetchToken = {
                "ChatPage.useEffect.fetchToken": async ()=>{
                    if (!authUser) return;
                    try {
                        console.log('🔑 Fetching Stream token...');
                        const response = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getStreamToken"])();
                        setTokenData(response);
                        console.log('✅ Stream token received');
                    } catch (error) {
                        console.error('❌ Error fetching token:', error);
                        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$hot$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].error('Failed to get chat token');
                    }
                }
            }["ChatPage.useEffect.fetchToken"];
            fetchToken();
        }
    }["ChatPage.useEffect"], [
        authUser
    ]);
    // Initialize chat client and channel
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ChatPage.useEffect": ()=>{
            const initChat = {
                "ChatPage.useEffect.initChat": async ()=>{
                    if (!tokenData?.token || !authUser || !STREAM_API_KEY) {
                        console.log('⏳ Waiting for dependencies...', {
                            hasToken: !!tokenData?.token,
                            hasAuthUser: !!authUser,
                            hasApiKey: !!STREAM_API_KEY
                        });
                        return;
                    }
                    try {
                        console.log("🚀 Initializing stream chat client...");
                        // Create Stream client
                        const client = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$stream$2d$chat$2f$dist$2f$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["StreamChat"].getInstance(STREAM_API_KEY);
                        // Connect user
                        await client.connectUser({
                            id: authUser._id,
                            name: authUser.fullName,
                            image: authUser.profilePic
                        }, tokenData.token);
                        console.log('👤 User connected to Stream');
                        // Create channel ID (consistent regardless of who starts chat)
                        const channelId = [
                            authUser._id,
                            targetUserId
                        ].sort().join("-");
                        console.log('💬 Channel ID:', channelId);
                        // Create/get channel
                        const currChannel = client.channel("messaging", channelId, {
                            members: [
                                authUser._id,
                                targetUserId
                            ]
                        });
                        await currChannel.watch();
                        console.log('👀 Channel watching started');
                        setChatClient(client);
                        setChannel(currChannel);
                    } catch (error) {
                        console.error("❌ Error initializing chat:", error);
                        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$hot$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].error("Could not connect to chat. Please try again.");
                    } finally{
                        setLoading(false);
                    }
                }
            }["ChatPage.useEffect.initChat"];
            initChat();
            // Cleanup function
            return ({
                "ChatPage.useEffect": ()=>{
                    if (chatClient) {
                        console.log('🧹 Cleaning up chat client...');
                        chatClient.disconnectUser();
                    }
                }
            })["ChatPage.useEffect"];
        }
    }["ChatPage.useEffect"], [
        tokenData,
        authUser,
        targetUserId,
        chatClient
    ]);
    const handleVideoCall = ()=>{
        if (channel) {
            const callUrl = `${window.location.origin}/call/${channel.id}`;
            // Send message in chat
            channel.sendMessage({
                text: `🎥 I've started a video call. Join me here: ${callUrl}`
            });
            // Immediately join the call
            window.open(callUrl, '_blank');
            __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$hot$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].success("Video call started!");
        }
    };
    // Loading state
    if (loading || !chatClient || !channel) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$ChatLoader$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
            fileName: "[project]/app/(protected)/chat/[id]/page.tsx",
            lineNumber: 138,
            columnNumber: 16
        }, this);
    }
    // Error state
    if ("TURBOPACK compile-time falsy", 0) {
        "TURBOPACK unreachable";
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "h-[calc(100vh-4rem)]",
        children: [
            " ",
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$stream$2d$chat$2d$react$2f$dist$2f$components$2f$Chat$2f$Chat$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Chat"], {
                client: chatClient,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$stream$2d$chat$2d$react$2f$dist$2f$components$2f$Channel$2f$Channel$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Channel"], {
                    channel: channel,
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "w-full relative h-full",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$CallButton$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                    handleVideoCall: handleVideoCall
                                }, void 0, false, {
                                    fileName: "[project]/app/(protected)/chat/[id]/page.tsx",
                                    lineNumber: 160,
                                    columnNumber: 25
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$stream$2d$chat$2d$react$2f$dist$2f$components$2f$Window$2f$Window$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Window"], {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$stream$2d$chat$2d$react$2f$dist$2f$components$2f$ChannelHeader$2f$ChannelHeader$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ChannelHeader"], {}, void 0, false, {
                                            fileName: "[project]/app/(protected)/chat/[id]/page.tsx",
                                            lineNumber: 162,
                                            columnNumber: 29
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$stream$2d$chat$2d$react$2f$dist$2f$components$2f$MessageList$2f$MessageList$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MessageList"], {}, void 0, false, {
                                            fileName: "[project]/app/(protected)/chat/[id]/page.tsx",
                                            lineNumber: 163,
                                            columnNumber: 29
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$stream$2d$chat$2d$react$2f$dist$2f$components$2f$MessageInput$2f$MessageInput$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MessageInput"], {
                                            focus: true
                                        }, void 0, false, {
                                            fileName: "[project]/app/(protected)/chat/[id]/page.tsx",
                                            lineNumber: 164,
                                            columnNumber: 29
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/(protected)/chat/[id]/page.tsx",
                                    lineNumber: 161,
                                    columnNumber: 25
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/(protected)/chat/[id]/page.tsx",
                            lineNumber: 159,
                            columnNumber: 21
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$stream$2d$chat$2d$react$2f$dist$2f$components$2f$Thread$2f$Thread$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Thread"], {}, void 0, false, {
                            fileName: "[project]/app/(protected)/chat/[id]/page.tsx",
                            lineNumber: 167,
                            columnNumber: 21
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/(protected)/chat/[id]/page.tsx",
                    lineNumber: 158,
                    columnNumber: 17
                }, this)
            }, void 0, false, {
                fileName: "[project]/app/(protected)/chat/[id]/page.tsx",
                lineNumber: 157,
                columnNumber: 13
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/(protected)/chat/[id]/page.tsx",
        lineNumber: 156,
        columnNumber: 9
    }, this);
};
_s(ChatPage, "Ev27Gll71BGymJ+R2OJ4+UF/mMQ=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useParams"],
        __TURBOPACK__imported__module__$5b$project$5d2f$contexts$2f$AuthContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuth"]
    ];
});
_c = ChatPage;
const __TURBOPACK__default__export__ = ChatPage;
var _c;
__turbopack_context__.k.register(_c, "ChatPage");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
}]);

//# sourceMappingURL=_a237e867._.js.map