(globalThis.TURBOPACK = globalThis.TURBOPACK || []).push([typeof document === "object" ? document.currentScript : undefined, {

"[project]/hooks/useNotification.ts [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "useNotification": (()=>useNotification)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$hot$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react-hot-toast/dist/index.mjs [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
'use client';
;
;
const useNotification = ()=>{
    _s();
    const [notifications, setNotifications] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const fetchNotifications = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useNotification.useCallback[fetchNotifications]": async ()=>{
            try {
                setLoading(true);
                setError(null);
                // TODO: Replace with actual API call when backend is ready
                // const response = await api.get('/notifications');
                // setNotifications(response.data);
                // Mock data for now
                const mockNotifications = [
                    {
                        _id: '1',
                        title: 'Welcome to StudyBuddy!',
                        message: 'Thanks for joining our platform. Start exploring programs and courses.',
                        type: 'system',
                        read: false,
                        createdAt: new Date().toISOString(),
                        updatedAt: new Date().toISOString()
                    },
                    {
                        _id: '2',
                        title: 'Your review was liked',
                        message: 'Someone liked your review on Computer Science program.',
                        type: 'like',
                        read: true,
                        createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
                        updatedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
                    }
                ];
                setNotifications(mockNotifications);
            } catch (err) {
                console.error('Error fetching notifications:', err);
                setError('Failed to load notifications');
                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$hot$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].error('Failed to load notifications');
            } finally{
                setLoading(false);
            }
        }
    }["useNotification.useCallback[fetchNotifications]"], []);
    const markAsRead = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useNotification.useCallback[markAsRead]": async (notificationId)=>{
            try {
                // TODO: Replace with actual API call
                // await api.put(`/notifications/${notificationId}/read`);
                setNotifications({
                    "useNotification.useCallback[markAsRead]": (prev)=>prev.map({
                            "useNotification.useCallback[markAsRead]": (notification)=>notification._id === notificationId ? {
                                    ...notification,
                                    read: true
                                } : notification
                        }["useNotification.useCallback[markAsRead]"])
                }["useNotification.useCallback[markAsRead]"]);
            } catch (err) {
                console.error('Error marking notification as read:', err);
                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$hot$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].error('Failed to mark notification as read');
            }
        }
    }["useNotification.useCallback[markAsRead]"], []);
    const markAllAsRead = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useNotification.useCallback[markAllAsRead]": async ()=>{
            try {
                // TODO: Replace with actual API call
                // await api.put('/notifications/read-all');
                setNotifications({
                    "useNotification.useCallback[markAllAsRead]": (prev)=>prev.map({
                            "useNotification.useCallback[markAllAsRead]": (notification)=>({
                                    ...notification,
                                    read: true
                                })
                        }["useNotification.useCallback[markAllAsRead]"])
                }["useNotification.useCallback[markAllAsRead]"]);
                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$hot$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].success('All notifications marked as read');
            } catch (err) {
                console.error('Error marking all notifications as read:', err);
                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$hot$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].error('Failed to mark all notifications as read');
            }
        }
    }["useNotification.useCallback[markAllAsRead]"], []);
    const refreshNotifications = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useNotification.useCallback[refreshNotifications]": ()=>{
            fetchNotifications();
        }
    }["useNotification.useCallback[refreshNotifications]"], [
        fetchNotifications
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "useNotification.useEffect": ()=>{
            fetchNotifications();
        }
    }["useNotification.useEffect"], [
        fetchNotifications
    ]);
    return {
        notifications,
        loading,
        error,
        markAsRead,
        markAllAsRead,
        refreshNotifications
    };
};
_s(useNotification, "NF7wJHFENQE7NKnbV3SCiUf6ZbQ=");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
}]);

//# sourceMappingURL=hooks_useNotification_ts_e4439abf._.js.map