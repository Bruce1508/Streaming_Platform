module.exports = {

"[externals]/util [external] (util, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("util", () => require("util"));

module.exports = mod;
}}),
"[externals]/stream [external] (stream, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("stream", () => require("stream"));

module.exports = mod;
}}),
"[externals]/http [external] (http, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("http", () => require("http"));

module.exports = mod;
}}),
"[externals]/https [external] (https, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("https", () => require("https"));

module.exports = mod;
}}),
"[externals]/fs [external] (fs, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("fs", () => require("fs"));

module.exports = mod;
}}),
"[externals]/crypto [external] (crypto, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("crypto", () => require("crypto"));

module.exports = mod;
}}),
"[externals]/assert [external] (assert, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("assert", () => require("assert"));

module.exports = mod;
}}),
"[externals]/tty [external] (tty, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("tty", () => require("tty"));

module.exports = mod;
}}),
"[externals]/os [external] (os, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("os", () => require("os"));

module.exports = mod;
}}),
"[externals]/zlib [external] (zlib, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("zlib", () => require("zlib"));

module.exports = mod;
}}),
"[externals]/events [external] (events, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("events", () => require("events"));

module.exports = mod;
}}),
"[project]/lib/axios.ts [app-rsc] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
// lib/axiosInstance.ts
__turbopack_context__.s({
    "axiosInstance": (()=>axiosInstance)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/axios/lib/axios.js [app-rsc] (ecmascript)");
;
const BASE_URL = ("TURBOPACK compile-time value", "http://localhost:5001/api") || "http://localhost:5001/api";
const axiosInstance = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"].create({
    baseURL: BASE_URL,
    withCredentials: true
});
axiosInstance.interceptors.response.use((response)=>response, (error)=>{
    // Xử lý lỗi globally, ví dụ: refresh token, redirect to login, v.v.
    return Promise.reject(error);
});
}}),
"[project]/lib/api.ts [app-rsc] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
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
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$axios$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/axios.ts [app-rsc] (ecmascript)");
;
const signup = async (signupData)=>{
    try {
        console.log("Sending signup data:", signupData);
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$axios$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["axiosInstance"].post("/auth/sign-up", signupData);
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
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$axios$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["axiosInstance"].post("/auth/login", loginData);
        return response.data;
    } catch (error) {
        return {
            success: false,
            message: error.response?.data?.message || 'Failed to sign in'
        };
    }
};
const logout = async ()=>{
    const response = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$axios$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["axiosInstance"].post("/auth/logout");
    return response.data;
};
const getAuthUser = async ()=>{
    try {
        const res = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$axios$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["axiosInstance"].get("/auth/me");
        return res.data;
    } catch (error) {
        console.log("Error in getAuthUser:", error);
        return null;
    }
};
const completeOnboarding = async (userData)=>{
    const response = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$axios$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["axiosInstance"].post("/auth/onboarding", userData);
    return response.data;
};
async function getUserFriends() {
    const response = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$axios$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["axiosInstance"].get("/users/friends");
    return response.data;
}
async function getRecommendedUsers() {
    const response = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$axios$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["axiosInstance"].get("/users");
    return response.data;
}
async function getOutgoingFriendReqs() {
    const response = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$axios$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["axiosInstance"].get("/users/outgoing-friend-requests");
    return response.data;
}
async function sendFriendRequest(userId) {
    const response = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$axios$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["axiosInstance"].post(`/users/friend-request/${userId}`);
    return response.data;
}
async function getFriendRequests() {
    const response = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$axios$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["axiosInstance"].get("/users/friend-requests");
    return response.data;
}
async function acceptFriendRequest(requestId) {
    const response = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$axios$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["axiosInstance"].put(`/users/friend-request/${requestId}/accept`);
    return response.data;
}
async function getStreamToken() {
    const response = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$axios$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["axiosInstance"].get("/chat/token");
    return response.data;
}
}}),
"[project]/app/actions/auth.ts [app-rsc] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
/* __next_internal_action_entry_do_not_use__ [{"606687f6e1265d1bebb6101e92f277303a2c2d945e":"signUp","608f27ea1a506244ea9535da98f33cda3eb1db258f":"handleOnBoarded"},"",""] */ __turbopack_context__.s({
    "handleOnBoarded": (()=>handleOnBoarded),
    "signUp": (()=>signUp)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/webpack/loaders/next-flight-loader/server-reference.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$app$2d$render$2f$encryption$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/app-render/encryption.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/api.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/webpack/loaders/next-flight-loader/action-validate.js [app-rsc] (ecmascript)");
;
;
;
async function signUp(prevState, formData) {
    try {
        const fullName = formData.get('fullName');
        const email = formData.get('email');
        const password = formData.get('password');
        const termsAccepted = formData.get('terms') === 'on';
        console.log("Server Action received data:", {
            fullName,
            email,
            password,
            termsAccepted
        });
        const errors = {};
        if (!fullName) errors.fullName = 'Full name is required';
        if (!email) errors.email = 'Email is required';
        if (!password) errors.password = 'Password is required';
        if (password && password.length < 6) errors.password = 'Password must be at least 6 characters';
        if (!termsAccepted) errors.terms = 'You must accept the terms';
        if (Object.keys(errors).length > 0) {
            return {
                success: false,
                message: 'Please fix the errors below',
                errors
            };
        }
        //gọi API signup từ api.ts và truyền dữ liệu từ form. cái này sẽ được gửi request đến backend
        const result = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["signup"])({
            fullName,
            email,
            password
        });
        if (result.success) {
            return {
                success: true,
                message: "Account created successfully!"
            };
        } else {
            return {
                success: false,
                message: result.message || 'Failed to create account'
            };
        }
    } catch (error) {
        console.error('SignUp error:', error);
        return {
            success: false,
            message: error.response?.data?.message || 'An unexpected error occurred in signUp function in auth.ts'
        };
    }
}
async function handleOnBoarded(prevState, formData) {
    try {
        const fullName = formData.get("fullName");
        const bio = formData.get("bio");
        const nativeLanguage = formData.get("nativeLanguage");
        const learningLanguage = formData.get("learningLanguage");
        const location = formData.get("location");
        const profilePic = formData.get("profilePic");
        console.log("Server action of onBoarding received data: ", {
            fullName,
            bio,
            nativeLanguage,
            learningLanguage,
            location,
            profilePic
        });
        const errors = {};
        // Validate required fields
        if (!fullName?.trim()) errors.fullName = 'Full name is required';
        if (!nativeLanguage) errors.nativeLanguage = 'Native language is required';
        if (!learningLanguage) errors.learningLanguage = 'Learning language is required';
        if (nativeLanguage === learningLanguage) {
            errors.learningLanguage = 'Learning language must be different from native language';
        }
        if (Object.keys(errors).length > 0) {
            return {
                success: false,
                message: 'Please fix the errors below',
                errors
            };
        }
        const result = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["completeOnboarding"])({
            fullName: fullName.trim(),
            bio: bio?.trim() || "",
            nativeLanguage,
            learningLanguage,
            location: location?.trim() || "",
            profilePic
        });
        if (result.success) {
            return {
                success: true,
                message: "Profile completed successfully!"
            };
        } else {
            return {
                success: false,
                message: result.message || "Failed to complete onboarding"
            };
        }
    } catch (error) {
        console.error('OnBoarding error:', error);
        return {
            success: false,
            message: error.response?.data?.message || 'An unexpected error occurred during onBoarding process'
        };
    }
}
;
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ensureServerEntryExports"])([
    signUp,
    handleOnBoarded
]);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(signUp, "606687f6e1265d1bebb6101e92f277303a2c2d945e", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(handleOnBoarded, "608f27ea1a506244ea9535da98f33cda3eb1db258f", null);
}}),
"[project]/.next-internal/server/app/(protected)/onBoarding/page/actions.js { ACTIONS_MODULE0 => \"[project]/app/actions/auth.ts [app-rsc] (ecmascript)\" } [app-rsc] (server actions loader, ecmascript) <locals>": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({});
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$actions$2f$auth$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/actions/auth.ts [app-rsc] (ecmascript)");
;
}}),
"[project]/.next-internal/server/app/(protected)/onBoarding/page/actions.js { ACTIONS_MODULE0 => \"[project]/app/actions/auth.ts [app-rsc] (ecmascript)\" } [app-rsc] (server actions loader, ecmascript) <module evaluation>": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({});
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$actions$2f$auth$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/actions/auth.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f2e$next$2d$internal$2f$server$2f$app$2f28$protected$292f$onBoarding$2f$page$2f$actions$2e$js__$7b$__ACTIONS_MODULE0__$3d3e$__$225b$project$5d2f$app$2f$actions$2f$auth$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$2922$__$7d$__$5b$app$2d$rsc$5d$__$28$server__actions__loader$2c$__ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i('[project]/.next-internal/server/app/(protected)/onBoarding/page/actions.js { ACTIONS_MODULE0 => "[project]/app/actions/auth.ts [app-rsc] (ecmascript)" } [app-rsc] (server actions loader, ecmascript) <locals>');
}}),
"[project]/.next-internal/server/app/(protected)/onBoarding/page/actions.js { ACTIONS_MODULE0 => \"[project]/app/actions/auth.ts [app-rsc] (ecmascript)\" } [app-rsc] (server actions loader, ecmascript) <exports>": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "608f27ea1a506244ea9535da98f33cda3eb1db258f": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$actions$2f$auth$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["handleOnBoarded"])
});
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$actions$2f$auth$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/actions/auth.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f2e$next$2d$internal$2f$server$2f$app$2f28$protected$292f$onBoarding$2f$page$2f$actions$2e$js__$7b$__ACTIONS_MODULE0__$3d3e$__$225b$project$5d2f$app$2f$actions$2f$auth$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$2922$__$7d$__$5b$app$2d$rsc$5d$__$28$server__actions__loader$2c$__ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i('[project]/.next-internal/server/app/(protected)/onBoarding/page/actions.js { ACTIONS_MODULE0 => "[project]/app/actions/auth.ts [app-rsc] (ecmascript)" } [app-rsc] (server actions loader, ecmascript) <locals>');
}}),
"[project]/.next-internal/server/app/(protected)/onBoarding/page/actions.js { ACTIONS_MODULE0 => \"[project]/app/actions/auth.ts [app-rsc] (ecmascript)\" } [app-rsc] (server actions loader, ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "608f27ea1a506244ea9535da98f33cda3eb1db258f": (()=>__TURBOPACK__imported__module__$5b$project$5d2f2e$next$2d$internal$2f$server$2f$app$2f28$protected$292f$onBoarding$2f$page$2f$actions$2e$js__$7b$__ACTIONS_MODULE0__$3d3e$__$225b$project$5d2f$app$2f$actions$2f$auth$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$2922$__$7d$__$5b$app$2d$rsc$5d$__$28$server__actions__loader$2c$__ecmascript$29$__$3c$exports$3e$__["608f27ea1a506244ea9535da98f33cda3eb1db258f"])
});
var __TURBOPACK__imported__module__$5b$project$5d2f2e$next$2d$internal$2f$server$2f$app$2f28$protected$292f$onBoarding$2f$page$2f$actions$2e$js__$7b$__ACTIONS_MODULE0__$3d3e$__$225b$project$5d2f$app$2f$actions$2f$auth$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$2922$__$7d$__$5b$app$2d$rsc$5d$__$28$server__actions__loader$2c$__ecmascript$29$__$3c$module__evaluation$3e$__ = __turbopack_context__.i('[project]/.next-internal/server/app/(protected)/onBoarding/page/actions.js { ACTIONS_MODULE0 => "[project]/app/actions/auth.ts [app-rsc] (ecmascript)" } [app-rsc] (server actions loader, ecmascript) <module evaluation>');
var __TURBOPACK__imported__module__$5b$project$5d2f2e$next$2d$internal$2f$server$2f$app$2f28$protected$292f$onBoarding$2f$page$2f$actions$2e$js__$7b$__ACTIONS_MODULE0__$3d3e$__$225b$project$5d2f$app$2f$actions$2f$auth$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$2922$__$7d$__$5b$app$2d$rsc$5d$__$28$server__actions__loader$2c$__ecmascript$29$__$3c$exports$3e$__ = __turbopack_context__.i('[project]/.next-internal/server/app/(protected)/onBoarding/page/actions.js { ACTIONS_MODULE0 => "[project]/app/actions/auth.ts [app-rsc] (ecmascript)" } [app-rsc] (server actions loader, ecmascript) <exports>');
}}),
"[project]/app/favicon.ico.mjs { IMAGE => \"[project]/app/favicon.ico (static in ecmascript)\" } [app-rsc] (structured image object, ecmascript, Next.js server component)": ((__turbopack_context__) => {

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.n(__turbopack_context__.i("[project]/app/favicon.ico.mjs { IMAGE => \"[project]/app/favicon.ico (static in ecmascript)\" } [app-rsc] (structured image object, ecmascript)"));
}}),
"[project]/app/layout.tsx [app-rsc] (ecmascript, Next.js server component)": ((__turbopack_context__) => {

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.n(__turbopack_context__.i("[project]/app/layout.tsx [app-rsc] (ecmascript)"));
}}),
"[project]/app/(protected)/layout.tsx [app-rsc] (ecmascript, Next.js server component)": ((__turbopack_context__) => {

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.n(__turbopack_context__.i("[project]/app/(protected)/layout.tsx [app-rsc] (ecmascript)"));
}}),
"[project]/app/(protected)/onBoarding/page.tsx (client reference/proxy) <module evaluation>": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "default": (()=>__TURBOPACK__default__export__)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2d$edge$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-server-dom-turbopack-server-edge.js [app-rsc] (ecmascript)");
;
const __TURBOPACK__default__export__ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2d$edge$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerClientReference"])(function() {
    throw new Error("Attempted to call the default export of [project]/app/(protected)/onBoarding/page.tsx <module evaluation> from the server, but it's on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.");
}, "[project]/app/(protected)/onBoarding/page.tsx <module evaluation>", "default");
}}),
"[project]/app/(protected)/onBoarding/page.tsx (client reference/proxy)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "default": (()=>__TURBOPACK__default__export__)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2d$edge$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-server-dom-turbopack-server-edge.js [app-rsc] (ecmascript)");
;
const __TURBOPACK__default__export__ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2d$edge$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerClientReference"])(function() {
    throw new Error("Attempted to call the default export of [project]/app/(protected)/onBoarding/page.tsx from the server, but it's on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.");
}, "[project]/app/(protected)/onBoarding/page.tsx", "default");
}}),
"[project]/app/(protected)/onBoarding/page.tsx [app-rsc] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f28$protected$292f$onBoarding$2f$page$2e$tsx__$28$client__reference$2f$proxy$29$__$3c$module__evaluation$3e$__ = __turbopack_context__.i("[project]/app/(protected)/onBoarding/page.tsx (client reference/proxy) <module evaluation>");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f28$protected$292f$onBoarding$2f$page$2e$tsx__$28$client__reference$2f$proxy$29$__ = __turbopack_context__.i("[project]/app/(protected)/onBoarding/page.tsx (client reference/proxy)");
;
__turbopack_context__.n(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f28$protected$292f$onBoarding$2f$page$2e$tsx__$28$client__reference$2f$proxy$29$__);
}}),
"[project]/app/(protected)/onBoarding/page.tsx [app-rsc] (ecmascript, Next.js server component)": ((__turbopack_context__) => {

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.n(__turbopack_context__.i("[project]/app/(protected)/onBoarding/page.tsx [app-rsc] (ecmascript)"));
}}),

};

//# sourceMappingURL=%5Broot-of-the-server%5D__776946e1._.js.map