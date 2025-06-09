module.exports = {

"[project]/app/(protected)/layout.tsx [app-rsc] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
// app/(protected)/layout.tsx
__turbopack_context__.s({
    "default": (()=>ProtectedLayout)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-jsx-dev-runtime.js [app-rsc] (ecmascript)");
;
function ProtectedLayout({ children }) {
    const router = useRouter();
    const pathname = usePathname();
    const { user, isLoading: authLoading } = useAuth();
    const { status: sessionStatus } = useSession();
    const isLoading = authLoading || sessionStatus === 'loading';
    console.log('🏠 Protected Layout:', {
        user: user?._id,
        isLoading,
        authLoading,
        sessionStatus,
        pathname
    });
    useEffect(()=>{
        // QUAN TRỌNG: Phải check isLoading trước
        if (isLoading) {
            console.log("⏳ Auth still loading...");
            return;
        }
        // Nếu không có user VÀ không phải đang loading
        if (!user && !isLoading) {
            console.log('❌ No user, redirecting to sign-in');
            router.push("/sign-in"); // ← Đổi sang sign-in thay vì sign-up
            return;
        }
        // Check onboarding
        if (user && !user.isOnboarded && pathname !== "/onBoarding") {
            console.log('🔄 Redirecting to onboarding');
            router.push("/onBoarding");
            return;
        }
    }, [
        isLoading,
        user,
        router,
        pathname
    ]);
    // Show loader while checking auth
    if (isLoading) {
        console.log('⏳ Showing loader - auth loading');
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(PageLoader, {}, void 0, false, {
            fileName: "[project]/app/(protected)/layout.tsx",
            lineNumber: 43,
            columnNumber: 16
        }, this);
    }
    // If no user after loading complete
    if (!user) {
        console.log('🔄 No user, showing loader while redirecting');
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(PageLoader, {}, void 0, false, {
            fileName: "[project]/app/(protected)/layout.tsx",
            lineNumber: 49,
            columnNumber: 16
        }, this);
    }
    // Render children if authenticated
    console.log('✅ Rendering protected content');
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Fragment"], {
        children: children
    }, void 0, false);
}
}}),

};

//# sourceMappingURL=app_%28protected%29_layout_tsx_4addf1ab._.js.map