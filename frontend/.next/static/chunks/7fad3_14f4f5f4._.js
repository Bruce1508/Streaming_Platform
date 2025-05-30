(globalThis.TURBOPACK = globalThis.TURBOPACK || []).push([typeof document === "object" ? document.currentScript : undefined, {

"[project]/node_modules/stream-chat-react/node_modules/react-popper/lib/esm/utils.js [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "fromEntries": (()=>fromEntries),
    "safeInvoke": (()=>safeInvoke),
    "setRef": (()=>setRef),
    "unwrapArray": (()=>unwrapArray),
    "useIsomorphicLayoutEffect": (()=>useIsomorphicLayoutEffect)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
var unwrapArray = function unwrapArray(arg) {
    return Array.isArray(arg) ? arg[0] : arg;
};
var safeInvoke = function safeInvoke(fn) {
    if (typeof fn === 'function') {
        for(var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++){
            args[_key - 1] = arguments[_key];
        }
        return fn.apply(void 0, args);
    }
};
var setRef = function setRef(ref, node) {
    // if its a function call it
    if (typeof ref === 'function') {
        return safeInvoke(ref, node);
    } else if (ref != null) {
        ref.current = node;
    }
};
var fromEntries = function fromEntries(entries) {
    return entries.reduce(function(acc, _ref) {
        var key = _ref[0], value = _ref[1];
        acc[key] = value;
        return acc;
    }, {});
};
var useIsomorphicLayoutEffect = typeof window !== 'undefined' && window.document && window.document.createElement ? __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useLayoutEffect"] : __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"];
}}),
"[project]/node_modules/stream-chat-react/node_modules/react-popper/lib/esm/usePopper.js [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "usePopper": (()=>usePopper)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2d$dom$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react-dom/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$popperjs$2f$core$2f$lib$2f$popper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/@popperjs/core/lib/popper.js [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$fast$2d$compare$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react-fast-compare/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$stream$2d$chat$2d$react$2f$node_modules$2f$react$2d$popper$2f$lib$2f$esm$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/stream-chat-react/node_modules/react-popper/lib/esm/utils.js [app-client] (ecmascript)");
;
;
;
;
;
var EMPTY_MODIFIERS = [];
var usePopper = function usePopper(referenceElement, popperElement, options) {
    if (options === void 0) {
        options = {};
    }
    var prevOptions = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    var optionsWithDefaults = {
        onFirstUpdate: options.onFirstUpdate,
        placement: options.placement || 'bottom',
        strategy: options.strategy || 'absolute',
        modifiers: options.modifiers || EMPTY_MODIFIERS
    };
    var _React$useState = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        styles: {
            popper: {
                position: optionsWithDefaults.strategy,
                left: '0',
                top: '0'
            },
            arrow: {
                position: 'absolute'
            }
        },
        attributes: {}
    }), state = _React$useState[0], setState = _React$useState[1];
    var updateStateModifier = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "usePopper.useMemo[updateStateModifier]": function() {
            return {
                name: 'updateState',
                enabled: true,
                phase: 'write',
                fn: function fn(_ref) {
                    var state = _ref.state;
                    var elements = Object.keys(state.elements);
                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2d$dom$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["flushSync"])({
                        "usePopper.useMemo[updateStateModifier].fn": function() {
                            setState({
                                styles: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$stream$2d$chat$2d$react$2f$node_modules$2f$react$2d$popper$2f$lib$2f$esm$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["fromEntries"])(elements.map({
                                    "usePopper.useMemo[updateStateModifier].fn": function(element) {
                                        return [
                                            element,
                                            state.styles[element] || {}
                                        ];
                                    }
                                }["usePopper.useMemo[updateStateModifier].fn"])),
                                attributes: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$stream$2d$chat$2d$react$2f$node_modules$2f$react$2d$popper$2f$lib$2f$esm$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["fromEntries"])(elements.map({
                                    "usePopper.useMemo[updateStateModifier].fn": function(element) {
                                        return [
                                            element,
                                            state.attributes[element]
                                        ];
                                    }
                                }["usePopper.useMemo[updateStateModifier].fn"]))
                            });
                        }
                    }["usePopper.useMemo[updateStateModifier].fn"]);
                },
                requires: [
                    'computeStyles'
                ]
            };
        }
    }["usePopper.useMemo[updateStateModifier]"], []);
    var popperOptions = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "usePopper.useMemo[popperOptions]": function() {
            var newOptions = {
                onFirstUpdate: optionsWithDefaults.onFirstUpdate,
                placement: optionsWithDefaults.placement,
                strategy: optionsWithDefaults.strategy,
                modifiers: [].concat(optionsWithDefaults.modifiers, [
                    updateStateModifier,
                    {
                        name: 'applyStyles',
                        enabled: false
                    }
                ])
            };
            if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$fast$2d$compare$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])(prevOptions.current, newOptions)) {
                return prevOptions.current || newOptions;
            } else {
                prevOptions.current = newOptions;
                return newOptions;
            }
        }
    }["usePopper.useMemo[popperOptions]"], [
        optionsWithDefaults.onFirstUpdate,
        optionsWithDefaults.placement,
        optionsWithDefaults.strategy,
        optionsWithDefaults.modifiers,
        updateStateModifier
    ]);
    var popperInstanceRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])();
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$stream$2d$chat$2d$react$2f$node_modules$2f$react$2d$popper$2f$lib$2f$esm$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useIsomorphicLayoutEffect"])({
        "usePopper.useIsomorphicLayoutEffect": function() {
            if (popperInstanceRef.current) {
                popperInstanceRef.current.setOptions(popperOptions);
            }
        }
    }["usePopper.useIsomorphicLayoutEffect"], [
        popperOptions
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$stream$2d$chat$2d$react$2f$node_modules$2f$react$2d$popper$2f$lib$2f$esm$2f$utils$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useIsomorphicLayoutEffect"])({
        "usePopper.useIsomorphicLayoutEffect": function() {
            if (referenceElement == null || popperElement == null) {
                return;
            }
            var createPopper = options.createPopper || __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$popperjs$2f$core$2f$lib$2f$popper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createPopper"];
            var popperInstance = createPopper(referenceElement, popperElement, popperOptions);
            popperInstanceRef.current = popperInstance;
            return ({
                "usePopper.useIsomorphicLayoutEffect": function() {
                    popperInstance.destroy();
                    popperInstanceRef.current = null;
                }
            })["usePopper.useIsomorphicLayoutEffect"];
        }
    }["usePopper.useIsomorphicLayoutEffect"], [
        referenceElement,
        popperElement,
        options.createPopper
    ]);
    return {
        state: popperInstanceRef.current ? popperInstanceRef.current.state : null,
        styles: state.styles,
        attributes: state.attributes,
        update: popperInstanceRef.current ? popperInstanceRef.current.update : null,
        forceUpdate: popperInstanceRef.current ? popperInstanceRef.current.forceUpdate : null
    };
};
}}),
"[project]/node_modules/stream-chat-react/node_modules/react-image-gallery/build/image-gallery.js [app-client] (ecmascript)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
!function(e, t) {
    ("TURBOPACK compile-time truthy", 1) ? module.exports = t(__turbopack_context__.r("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)")) : ("TURBOPACK unreachable", undefined);
}(this, function(e) {
    return (()=>{
        var t = {
            703: (e, t, n)=>{
                "use strict";
                var i = n(414);
                function r() {}
                function a() {}
                a.resetWarningCache = r, e.exports = function() {
                    function e(e, t, n, r, a, s) {
                        if (s !== i) {
                            var o = new Error("Calling PropTypes validators directly is not supported by the `prop-types` package. Use PropTypes.checkPropTypes() to call them. Read more at http://fb.me/use-check-prop-types");
                            throw o.name = "Invariant Violation", o;
                        }
                    }
                    function t() {
                        return e;
                    }
                    e.isRequired = e;
                    var n = {
                        array: e,
                        bool: e,
                        func: e,
                        number: e,
                        object: e,
                        string: e,
                        symbol: e,
                        any: e,
                        arrayOf: t,
                        element: e,
                        elementType: e,
                        instanceOf: t,
                        node: e,
                        objectOf: t,
                        oneOf: t,
                        oneOfType: t,
                        shape: t,
                        exact: t,
                        checkPropTypes: a,
                        resetWarningCache: r
                    };
                    return n.PropTypes = n, n;
                };
            },
            697: (e, t, n)=>{
                e.exports = n(703)();
            },
            414: (e)=>{
                "use strict";
                e.exports = "SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED";
            },
            590: (e)=>{
                var t = "undefined" != typeof Element, n = "function" == typeof Map, i = "function" == typeof Set, r = "function" == typeof ArrayBuffer && !!ArrayBuffer.isView;
                function a(e, s) {
                    if (e === s) return !0;
                    if (e && s && "object" == typeof e && "object" == typeof s) {
                        if (e.constructor !== s.constructor) return !1;
                        var o, l, u, c;
                        if (Array.isArray(e)) {
                            if ((o = e.length) != s.length) return !1;
                            for(l = o; 0 != l--;)if (!a(e[l], s[l])) return !1;
                            return !0;
                        }
                        if (n && e instanceof Map && s instanceof Map) {
                            if (e.size !== s.size) return !1;
                            for(c = e.entries(); !(l = c.next()).done;)if (!s.has(l.value[0])) return !1;
                            for(c = e.entries(); !(l = c.next()).done;)if (!a(l.value[1], s.get(l.value[0]))) return !1;
                            return !0;
                        }
                        if (i && e instanceof Set && s instanceof Set) {
                            if (e.size !== s.size) return !1;
                            for(c = e.entries(); !(l = c.next()).done;)if (!s.has(l.value[0])) return !1;
                            return !0;
                        }
                        if (r && ArrayBuffer.isView(e) && ArrayBuffer.isView(s)) {
                            if ((o = e.length) != s.length) return !1;
                            for(l = o; 0 != l--;)if (e[l] !== s[l]) return !1;
                            return !0;
                        }
                        if (e.constructor === RegExp) return e.source === s.source && e.flags === s.flags;
                        if (e.valueOf !== Object.prototype.valueOf) return e.valueOf() === s.valueOf();
                        if (e.toString !== Object.prototype.toString) return e.toString() === s.toString();
                        if ((o = (u = Object.keys(e)).length) !== Object.keys(s).length) return !1;
                        for(l = o; 0 != l--;)if (!Object.prototype.hasOwnProperty.call(s, u[l])) return !1;
                        if (t && e instanceof Element) return !1;
                        for(l = o; 0 != l--;)if (("_owner" !== u[l] && "__v" !== u[l] && "__o" !== u[l] || !e.$$typeof) && !a(e[u[l]], s[u[l]])) return !1;
                        return !0;
                    }
                    return e != e && s != s;
                }
                e.exports = function(e, t) {
                    try {
                        return a(e, t);
                    } catch (e) {
                        if ((e.message || "").match(/stack|recursion/i)) return console.warn("react-fast-compare cannot handle circular refs"), !1;
                        throw e;
                    }
                };
            },
            37: function(e, t, n) {
                !function(e, t) {
                    function n() {
                        return n = Object.assign || function(e) {
                            for(var t = 1; t < arguments.length; t++){
                                var n = arguments[t];
                                for(var i in n)Object.prototype.hasOwnProperty.call(n, i) && (e[i] = n[i]);
                            }
                            return e;
                        }, n.apply(this, arguments);
                    }
                    var i = "Left", r = "Right", a = "Down", s = {
                        delta: 10,
                        preventDefaultTouchmoveEvent: !1,
                        rotationAngle: 0,
                        trackMouse: !1,
                        trackTouch: !0
                    }, o = {
                        first: !0,
                        initial: [
                            0,
                            0
                        ],
                        start: 0,
                        swiping: !1,
                        xy: [
                            0,
                            0
                        ]
                    }, l = "mousemove", u = "mouseup";
                    function c(e, t) {
                        if (0 === t) return e;
                        var n = Math.PI / 180 * t;
                        return [
                            e[0] * Math.cos(n) + e[1] * Math.sin(n),
                            e[1] * Math.cos(n) - e[0] * Math.sin(n)
                        ];
                    }
                    function h(e, t) {
                        var s = function(t) {
                            t && "touches" in t && t.touches.length > 1 || e(function(e, i) {
                                i.trackMouse && (document.addEventListener(l, h), document.addEventListener(u, f));
                                var r = "touches" in t ? t.touches[0] : t, a = c([
                                    r.clientX,
                                    r.clientY
                                ], i.rotationAngle);
                                return n({}, e, o, {
                                    initial: [].concat(a),
                                    xy: a,
                                    start: t.timeStamp || 0
                                });
                            });
                        }, h = function(t) {
                            e(function(e, s) {
                                if ("touches" in t && t.touches.length > 1) return e;
                                var o = "touches" in t ? t.touches[0] : t, l = c([
                                    o.clientX,
                                    o.clientY
                                ], s.rotationAngle), u = l[0], h = l[1], d = u - e.xy[0], f = h - e.xy[1], p = Math.abs(d), m = Math.abs(f), g = (t.timeStamp || 0) - e.start, v = Math.sqrt(p * p + m * m) / (g || 1), b = [
                                    d / (g || 1),
                                    f / (g || 1)
                                ];
                                if (p < s.delta && m < s.delta && !e.swiping) return e;
                                var y = function(e, t, n, s) {
                                    return e > t ? n > 0 ? r : i : s > 0 ? a : "Up";
                                }(p, m, d, f), w = {
                                    absX: p,
                                    absY: m,
                                    deltaX: d,
                                    deltaY: f,
                                    dir: y,
                                    event: t,
                                    first: e.first,
                                    initial: e.initial,
                                    velocity: v,
                                    vxvy: b
                                };
                                s.onSwiping && s.onSwiping(w);
                                var T = !1;
                                return (s.onSwiping || s.onSwiped || "onSwiped" + y in s) && (T = !0), T && s.preventDefaultTouchmoveEvent && s.trackTouch && t.cancelable && t.preventDefault(), n({}, e, {
                                    first: !1,
                                    eventData: w,
                                    swiping: !0
                                });
                            });
                        }, d = function(t) {
                            e(function(e, i) {
                                var r;
                                if (e.swiping && e.eventData) {
                                    r = n({}, e.eventData, {
                                        event: t
                                    }), i.onSwiped && i.onSwiped(r);
                                    var a = "onSwiped" + r.dir;
                                    a in i && i[a](r);
                                } else i.onTap && i.onTap({
                                    event: t
                                });
                                return n({}, e, o, {
                                    eventData: r
                                });
                            });
                        }, f = function(e) {
                            document.removeEventListener(l, h), document.removeEventListener(u, f), d(e);
                        }, p = function(e, t) {
                            var n = function() {};
                            if (e && e.addEventListener) {
                                var i = [
                                    [
                                        "touchstart",
                                        s
                                    ],
                                    [
                                        "touchmove",
                                        h
                                    ],
                                    [
                                        "touchend",
                                        d
                                    ]
                                ];
                                i.forEach(function(n) {
                                    var i = n[0], r = n[1];
                                    return e.addEventListener(i, r, {
                                        passive: t
                                    });
                                }), n = function() {
                                    return i.forEach(function(t) {
                                        var n = t[0], i = t[1];
                                        return e.removeEventListener(n, i);
                                    });
                                };
                            }
                            return n;
                        }, m = {
                            ref: function(t) {
                                null !== t && e(function(e, i) {
                                    if (e.el === t) return e;
                                    var r = {};
                                    return e.el && e.el !== t && e.cleanUpTouch && (e.cleanUpTouch(), r.cleanUpTouch = void 0), i.trackTouch && t && (r.cleanUpTouch = p(t, !i.preventDefaultTouchmoveEvent)), n({}, e, {
                                        el: t
                                    }, r);
                                });
                            }
                        };
                        return t.trackMouse && (m.onMouseDown = s), [
                            m,
                            p
                        ];
                    }
                    e.DOWN = a, e.LEFT = i, e.RIGHT = r, e.UP = "Up", e.useSwipeable = function(e) {
                        var i = e.trackMouse, r = t.useRef(n({}, o)), a = t.useRef(n({}, s));
                        a.current = n({}, s, e);
                        var l = t.useMemo({
                            "useMemo[l]": function() {
                                return h({
                                    "useMemo[l]": function(e) {
                                        return r.current = e(r.current, a.current);
                                    }
                                }["useMemo[l]"], {
                                    trackMouse: i
                                });
                            }
                        }["useMemo[l]"], [
                            i
                        ]), u = l[0], c = l[1];
                        return r.current = function(e, t, i) {
                            var r = {};
                            return !t.trackTouch && e.cleanUpTouch ? (e.cleanUpTouch(), r.cleanUpTouch = void 0) : t.trackTouch && !e.cleanUpTouch && e.el && (r.cleanUpTouch = i(e.el, !t.preventDefaultTouchmoveEvent)), n({}, e, r);
                        }(r.current, a.current, c), u;
                    };
                }(t, n(888));
            },
            888: (t)=>{
                "use strict";
                t.exports = e;
            }
        }, n = {};
        function i(e) {
            var r = n[e];
            if (void 0 !== r) return r.exports;
            var a = n[e] = {
                exports: {}
            };
            return t[e].call(a.exports, a, a.exports, i), a.exports;
        }
        i.n = (e)=>{
            var t = e && e.__esModule ? ()=>e.default : ()=>e;
            return i.d(t, {
                a: t
            }), t;
        }, i.d = (e, t)=>{
            for(var n in t)i.o(t, n) && !i.o(e, n) && Object.defineProperty(e, n, {
                enumerable: !0,
                get: t[n]
            });
        }, i.g = function() {
            if ("object" == typeof globalThis) return globalThis;
            try {
                return this || new Function("return this")();
            } catch (e) {
                if ("object" == typeof window) return window;
            }
        }(), i.o = (e, t)=>Object.prototype.hasOwnProperty.call(e, t), i.r = (e)=>{
            "undefined" != typeof Symbol && Symbol.toStringTag && Object.defineProperty(e, Symbol.toStringTag, {
                value: "Module"
            }), Object.defineProperty(e, "__esModule", {
                value: !0
            });
        };
        var r = {};
        return (()=>{
            "use strict";
            function e(t) {
                var n, i, r = "";
                if ("string" == typeof t || "number" == typeof t) r += t;
                else if ("object" == typeof t) if (Array.isArray(t)) for(n = 0; n < t.length; n++)t[n] && (i = e(t[n])) && (r && (r += " "), r += i);
                else for(n in t)t[n] && (r && (r += " "), r += n);
                return r;
            }
            function t() {
                for(var t, n, i = 0, r = ""; i < arguments.length;)(t = arguments[i++]) && (n = e(t)) && (r && (r += " "), r += n);
                return r;
            }
            i.r(r), i.d(r, {
                default: ()=>Pe
            });
            var n = i(888), a = i.n(n);
            const s = function(e) {
                var t = typeof e;
                return null != e && ("object" == t || "function" == t);
            }, o = "object" == typeof global && global && global.Object === Object && global;
            var l = "object" == typeof self && self && self.Object === Object && self;
            const u = o || l || Function("return this")(), c = function() {
                return u.Date.now();
            };
            var h = /\s/;
            var d = /^\s+/;
            const f = function(e) {
                return e ? e.slice(0, function(e) {
                    for(var t = e.length; t-- && h.test(e.charAt(t)););
                    return t;
                }(e) + 1).replace(d, "") : e;
            }, p = u.Symbol;
            var m = Object.prototype, g = m.hasOwnProperty, v = m.toString, b = p ? p.toStringTag : void 0;
            var y = Object.prototype.toString;
            var w = p ? p.toStringTag : void 0;
            const T = function(e) {
                return null == e ? void 0 === e ? "[object Undefined]" : "[object Null]" : w && w in Object(e) ? function(e) {
                    var t = g.call(e, b), n = e[b];
                    try {
                        e[b] = void 0;
                        var i = !0;
                    } catch (e) {}
                    var r = v.call(e);
                    return i && (t ? e[b] = n : delete e[b]), r;
                }(e) : function(e) {
                    return y.call(e);
                }(e);
            };
            var S = /^[-+]0x[0-9a-f]+$/i, O = /^0b[01]+$/i, E = /^0o[0-7]+$/i, k = parseInt;
            const I = function(e) {
                if ("number" == typeof e) return e;
                if (function(e) {
                    return "symbol" == typeof e || function(e) {
                        return null != e && "object" == typeof e;
                    }(e) && "[object Symbol]" == T(e);
                }(e)) return NaN;
                if (s(e)) {
                    var t = "function" == typeof e.valueOf ? e.valueOf() : e;
                    e = s(t) ? t + "" : t;
                }
                if ("string" != typeof e) return 0 === e ? e : +e;
                e = f(e);
                var n = O.test(e);
                return n || E.test(e) ? k(e.slice(2), n ? 2 : 8) : S.test(e) ? NaN : +e;
            };
            var x = Math.max, _ = Math.min;
            const R = function(e, t, n) {
                var i, r, a, o, l, u, h = 0, d = !1, f = !1, p = !0;
                if ("function" != typeof e) throw new TypeError("Expected a function");
                function m(t) {
                    var n = i, a = r;
                    return i = r = void 0, h = t, o = e.apply(a, n);
                }
                function g(e) {
                    return h = e, l = setTimeout(b, t), d ? m(e) : o;
                }
                function v(e) {
                    var n = e - u;
                    return void 0 === u || n >= t || n < 0 || f && e - h >= a;
                }
                function b() {
                    var e = c();
                    if (v(e)) return y(e);
                    l = setTimeout(b, function(e) {
                        var n = t - (e - u);
                        return f ? _(n, a - (e - h)) : n;
                    }(e));
                }
                function y(e) {
                    return l = void 0, p && i ? m(e) : (i = r = void 0, o);
                }
                function w() {
                    var e = c(), n = v(e);
                    if (i = arguments, r = this, u = e, n) {
                        if (void 0 === l) return g(u);
                        if (f) return clearTimeout(l), l = setTimeout(b, t), m(u);
                    }
                    return void 0 === l && (l = setTimeout(b, t)), o;
                }
                return t = I(t) || 0, s(n) && (d = !!n.leading, a = (f = "maxWait" in n) ? x(I(n.maxWait) || 0, t) : a, p = "trailing" in n ? !!n.trailing : p), w.cancel = function() {
                    void 0 !== l && clearTimeout(l), h = 0, i = u = r = l = void 0;
                }, w.flush = function() {
                    return void 0 === l ? o : y(c());
                }, w;
            }, L = function(e, t, n) {
                var i = !0, r = !0;
                if ("function" != typeof e) throw new TypeError("Expected a function");
                return s(n) && (i = "leading" in n ? !!n.leading : i, r = "trailing" in n ? !!n.trailing : r), R(e, t, {
                    leading: i,
                    maxWait: t,
                    trailing: r
                });
            };
            var P = i(590), M = i.n(P), W = function() {
                if ("undefined" != typeof Map) return Map;
                function e(e, t) {
                    var n = -1;
                    return e.some(function(e, i) {
                        return e[0] === t && (n = i, !0);
                    }), n;
                }
                return function() {
                    function t() {
                        this.__entries__ = [];
                    }
                    return Object.defineProperty(t.prototype, "size", {
                        get: function() {
                            return this.__entries__.length;
                        },
                        enumerable: !0,
                        configurable: !0
                    }), t.prototype.get = function(t) {
                        var n = e(this.__entries__, t), i = this.__entries__[n];
                        return i && i[1];
                    }, t.prototype.set = function(t, n) {
                        var i = e(this.__entries__, t);
                        ~i ? this.__entries__[i][1] = n : this.__entries__.push([
                            t,
                            n
                        ]);
                    }, t.prototype.delete = function(t) {
                        var n = this.__entries__, i = e(n, t);
                        ~i && n.splice(i, 1);
                    }, t.prototype.has = function(t) {
                        return !!~e(this.__entries__, t);
                    }, t.prototype.clear = function() {
                        this.__entries__.splice(0);
                    }, t.prototype.forEach = function(e, t) {
                        void 0 === t && (t = null);
                        for(var n = 0, i = this.__entries__; n < i.length; n++){
                            var r = i[n];
                            e.call(t, r[1], r[0]);
                        }
                    }, t;
                }();
            }(), D = "undefined" != typeof window && "undefined" != typeof document && window.document === document, F = void 0 !== i.g && i.g.Math === Math ? i.g : "undefined" != typeof self && self.Math === Math ? self : "undefined" != typeof window && window.Math === Math ? window : Function("return this")(), C = "function" == typeof requestAnimationFrame ? requestAnimationFrame.bind(F) : function(e) {
                return setTimeout(function() {
                    return e(Date.now());
                }, 1e3 / 60);
            }, N = [
                "top",
                "right",
                "bottom",
                "left",
                "width",
                "height",
                "size",
                "weight"
            ], z = "undefined" != typeof MutationObserver, j = function() {
                function e() {
                    this.connected_ = !1, this.mutationEventsAdded_ = !1, this.mutationsObserver_ = null, this.observers_ = [], this.onTransitionEnd_ = this.onTransitionEnd_.bind(this), this.refresh = function(e, t) {
                        var n = !1, i = !1, r = 0;
                        function a() {
                            n && (n = !1, e()), i && o();
                        }
                        function s() {
                            C(a);
                        }
                        function o() {
                            var e = Date.now();
                            if (n) {
                                if (e - r < 2) return;
                                i = !0;
                            } else n = !0, i = !1, setTimeout(s, 20);
                            r = e;
                        }
                        return o;
                    }(this.refresh.bind(this));
                }
                return e.prototype.addObserver = function(e) {
                    ~this.observers_.indexOf(e) || this.observers_.push(e), this.connected_ || this.connect_();
                }, e.prototype.removeObserver = function(e) {
                    var t = this.observers_, n = t.indexOf(e);
                    ~n && t.splice(n, 1), !t.length && this.connected_ && this.disconnect_();
                }, e.prototype.refresh = function() {
                    this.updateObservers_() && this.refresh();
                }, e.prototype.updateObservers_ = function() {
                    var e = this.observers_.filter(function(e) {
                        return e.gatherActive(), e.hasActive();
                    });
                    return e.forEach(function(e) {
                        return e.broadcastActive();
                    }), e.length > 0;
                }, e.prototype.connect_ = function() {
                    D && !this.connected_ && (document.addEventListener("transitionend", this.onTransitionEnd_), window.addEventListener("resize", this.refresh), z ? (this.mutationsObserver_ = new MutationObserver(this.refresh), this.mutationsObserver_.observe(document, {
                        attributes: !0,
                        childList: !0,
                        characterData: !0,
                        subtree: !0
                    })) : (document.addEventListener("DOMSubtreeModified", this.refresh), this.mutationEventsAdded_ = !0), this.connected_ = !0);
                }, e.prototype.disconnect_ = function() {
                    D && this.connected_ && (document.removeEventListener("transitionend", this.onTransitionEnd_), window.removeEventListener("resize", this.refresh), this.mutationsObserver_ && this.mutationsObserver_.disconnect(), this.mutationEventsAdded_ && document.removeEventListener("DOMSubtreeModified", this.refresh), this.mutationsObserver_ = null, this.mutationEventsAdded_ = !1, this.connected_ = !1);
                }, e.prototype.onTransitionEnd_ = function(e) {
                    var t = e.propertyName, n = void 0 === t ? "" : t;
                    N.some(function(e) {
                        return !!~n.indexOf(e);
                    }) && this.refresh();
                }, e.getInstance = function() {
                    return this.instance_ || (this.instance_ = new e), this.instance_;
                }, e.instance_ = null, e;
            }(), B = function(e, t) {
                for(var n = 0, i = Object.keys(t); n < i.length; n++){
                    var r = i[n];
                    Object.defineProperty(e, r, {
                        value: t[r],
                        enumerable: !1,
                        writable: !1,
                        configurable: !0
                    });
                }
                return e;
            }, A = function(e) {
                return e && e.ownerDocument && e.ownerDocument.defaultView || F;
            }, G = V(0, 0, 0, 0);
            function U(e) {
                return parseFloat(e) || 0;
            }
            function H(e) {
                for(var t = [], n = 1; n < arguments.length; n++)t[n - 1] = arguments[n];
                return t.reduce(function(t, n) {
                    return t + U(e["border-" + n + "-width"]);
                }, 0);
            }
            var q = "undefined" != typeof SVGGraphicsElement ? function(e) {
                return e instanceof A(e).SVGGraphicsElement;
            } : function(e) {
                return e instanceof A(e).SVGElement && "function" == typeof e.getBBox;
            };
            function K(e) {
                return D ? q(e) ? function(e) {
                    var t = e.getBBox();
                    return V(0, 0, t.width, t.height);
                }(e) : function(e) {
                    var t = e.clientWidth, n = e.clientHeight;
                    if (!t && !n) return G;
                    var i = A(e).getComputedStyle(e), r = function(e) {
                        for(var t = {}, n = 0, i = [
                            "top",
                            "right",
                            "bottom",
                            "left"
                        ]; n < i.length; n++){
                            var r = i[n], a = e["padding-" + r];
                            t[r] = U(a);
                        }
                        return t;
                    }(i), a = r.left + r.right, s = r.top + r.bottom, o = U(i.width), l = U(i.height);
                    if ("border-box" === i.boxSizing && (Math.round(o + a) !== t && (o -= H(i, "left", "right") + a), Math.round(l + s) !== n && (l -= H(i, "top", "bottom") + s)), !function(e) {
                        return e === A(e).document.documentElement;
                    }(e)) {
                        var u = Math.round(o + a) - t, c = Math.round(l + s) - n;
                        1 !== Math.abs(u) && (o -= u), 1 !== Math.abs(c) && (l -= c);
                    }
                    return V(r.left, r.top, o, l);
                }(e) : G;
            }
            function V(e, t, n, i) {
                return {
                    x: e,
                    y: t,
                    width: n,
                    height: i
                };
            }
            var X = function() {
                function e(e) {
                    this.broadcastWidth = 0, this.broadcastHeight = 0, this.contentRect_ = V(0, 0, 0, 0), this.target = e;
                }
                return e.prototype.isActive = function() {
                    var e = K(this.target);
                    return this.contentRect_ = e, e.width !== this.broadcastWidth || e.height !== this.broadcastHeight;
                }, e.prototype.broadcastRect = function() {
                    var e = this.contentRect_;
                    return this.broadcastWidth = e.width, this.broadcastHeight = e.height, e;
                }, e;
            }(), Y = function(e, t) {
                var n, i, r, a, s, o, l, u = (i = (n = t).x, r = n.y, a = n.width, s = n.height, o = "undefined" != typeof DOMRectReadOnly ? DOMRectReadOnly : Object, l = Object.create(o.prototype), B(l, {
                    x: i,
                    y: r,
                    width: a,
                    height: s,
                    top: r,
                    right: i + a,
                    bottom: s + r,
                    left: i
                }), l);
                B(this, {
                    target: e,
                    contentRect: u
                });
            }, $ = function() {
                function e(e, t, n) {
                    if (this.activeObservations_ = [], this.observations_ = new W, "function" != typeof e) throw new TypeError("The callback provided as parameter 1 is not a function.");
                    this.callback_ = e, this.controller_ = t, this.callbackCtx_ = n;
                }
                return e.prototype.observe = function(e) {
                    if (!arguments.length) throw new TypeError("1 argument required, but only 0 present.");
                    if ("undefined" != typeof Element && Element instanceof Object) {
                        if (!(e instanceof A(e).Element)) throw new TypeError('parameter 1 is not of type "Element".');
                        var t = this.observations_;
                        t.has(e) || (t.set(e, new X(e)), this.controller_.addObserver(this), this.controller_.refresh());
                    }
                }, e.prototype.unobserve = function(e) {
                    if (!arguments.length) throw new TypeError("1 argument required, but only 0 present.");
                    if ("undefined" != typeof Element && Element instanceof Object) {
                        if (!(e instanceof A(e).Element)) throw new TypeError('parameter 1 is not of type "Element".');
                        var t = this.observations_;
                        t.has(e) && (t.delete(e), t.size || this.controller_.removeObserver(this));
                    }
                }, e.prototype.disconnect = function() {
                    this.clearActive(), this.observations_.clear(), this.controller_.removeObserver(this);
                }, e.prototype.gatherActive = function() {
                    var e = this;
                    this.clearActive(), this.observations_.forEach(function(t) {
                        t.isActive() && e.activeObservations_.push(t);
                    });
                }, e.prototype.broadcastActive = function() {
                    if (this.hasActive()) {
                        var e = this.callbackCtx_, t = this.activeObservations_.map(function(e) {
                            return new Y(e.target, e.broadcastRect());
                        });
                        this.callback_.call(e, t, e), this.clearActive();
                    }
                }, e.prototype.clearActive = function() {
                    this.activeObservations_.splice(0);
                }, e.prototype.hasActive = function() {
                    return this.activeObservations_.length > 0;
                }, e;
            }(), J = "undefined" != typeof WeakMap ? new WeakMap : new W, Q = function e(t) {
                if (!(this instanceof e)) throw new TypeError("Cannot call a class as a function.");
                if (!arguments.length) throw new TypeError("1 argument required, but only 0 present.");
                var n = j.getInstance(), i = new $(t, n, this);
                J.set(this, i);
            };
            [
                "observe",
                "unobserve",
                "disconnect"
            ].forEach(function(e) {
                Q.prototype[e] = function() {
                    var t;
                    return (t = J.get(this))[e].apply(t, arguments);
                };
            });
            const Z = void 0 !== F.ResizeObserver ? F.ResizeObserver : Q;
            var ee = i(37), te = i(697), ne = a().memo(function(e) {
                var t = e.description, n = e.fullscreen, i = e.handleImageLoaded, r = e.isFullscreen, s = e.onImageError, o = e.original, l = e.originalAlt, u = e.originalHeight, c = e.originalWidth, h = e.originalTitle, d = e.sizes, f = e.srcSet, p = e.loading, m = r && n || o;
                return a().createElement(a().Fragment, null, a().createElement("img", {
                    className: "image-gallery-image",
                    src: m,
                    alt: l,
                    srcSet: f,
                    height: u,
                    width: c,
                    sizes: d,
                    title: h,
                    onLoad: function(e) {
                        return i(e, o);
                    },
                    onError: s,
                    loading: p
                }), t && a().createElement("span", {
                    className: "image-gallery-description"
                }, t));
            });
            ne.displayName = "Item", ne.propTypes = {
                description: te.string,
                fullscreen: te.string,
                handleImageLoaded: te.func.isRequired,
                isFullscreen: te.bool,
                onImageError: te.func.isRequired,
                original: te.string.isRequired,
                originalAlt: te.string,
                originalHeight: te.string,
                originalWidth: te.string,
                originalTitle: te.string,
                sizes: te.string,
                srcSet: te.string,
                loading: te.string
            }, ne.defaultProps = {
                description: "",
                fullscreen: "",
                isFullscreen: !1,
                originalAlt: "",
                originalHeight: "",
                originalWidth: "",
                originalTitle: "",
                sizes: "",
                srcSet: "",
                loading: "eager"
            };
            const ie = ne;
            var re = {
                left: a().createElement("polyline", {
                    points: "15 18 9 12 15 6"
                }),
                right: a().createElement("polyline", {
                    points: "9 18 15 12 9 6"
                }),
                maximize: a().createElement("path", {
                    d: "M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"
                }),
                minimize: a().createElement("path", {
                    d: "M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3"
                }),
                play: a().createElement("polygon", {
                    points: "5 3 19 12 5 21 5 3"
                }),
                pause: a().createElement(a().Fragment, null, a().createElement("rect", {
                    x: "6",
                    y: "4",
                    width: "4",
                    height: "16"
                }), a().createElement("rect", {
                    x: "14",
                    y: "4",
                    width: "4",
                    height: "16"
                }))
            }, ae = function(e) {
                var t = e.strokeWidth, n = e.viewBox, i = e.icon;
                return a().createElement("svg", {
                    className: "image-gallery-svg",
                    xmlns: "http://www.w3.org/2000/svg",
                    viewBox: n,
                    fill: "none",
                    stroke: "currentColor",
                    strokeWidth: t,
                    strokeLinecap: "round",
                    strokeLinejoin: "round"
                }, re[i]);
            };
            ae.propTypes = {
                strokeWidth: te.number,
                viewBox: te.string,
                icon: (0, te.oneOf)([
                    "left",
                    "right",
                    "maximize",
                    "minimize",
                    "play",
                    "pause"
                ]).isRequired
            }, ae.defaultProps = {
                strokeWidth: 1,
                viewBox: "0 0 24 24"
            };
            const se = ae;
            var oe = a().memo(function(e) {
                var t = e.isFullscreen, n = e.onClick;
                return a().createElement("button", {
                    type: "button",
                    className: "image-gallery-icon image-gallery-fullscreen-button",
                    onClick: n,
                    "aria-label": "Open Fullscreen"
                }, a().createElement(se, {
                    strokeWidth: 2,
                    icon: t ? "minimize" : "maximize"
                }));
            });
            oe.displayName = "Fullscreen", oe.propTypes = {
                isFullscreen: te.bool.isRequired,
                onClick: te.func.isRequired
            };
            const le = oe;
            var ue = a().memo(function(e) {
                var t = e.disabled, n = e.onClick;
                return a().createElement("button", {
                    type: "button",
                    className: "image-gallery-icon image-gallery-left-nav",
                    disabled: t,
                    onClick: n,
                    "aria-label": "Previous Slide"
                }, a().createElement(se, {
                    icon: "left",
                    viewBox: "6 0 12 24"
                }));
            });
            ue.displayName = "LeftNav", ue.propTypes = {
                disabled: te.bool.isRequired,
                onClick: te.func.isRequired
            };
            const ce = ue;
            var he = a().memo(function(e) {
                var t = e.disabled, n = e.onClick;
                return a().createElement("button", {
                    type: "button",
                    className: "image-gallery-icon image-gallery-right-nav",
                    disabled: t,
                    onClick: n,
                    "aria-label": "Next Slide"
                }, a().createElement(se, {
                    icon: "right",
                    viewBox: "6 0 12 24"
                }));
            });
            he.displayName = "RightNav", he.propTypes = {
                disabled: te.bool.isRequired,
                onClick: te.func.isRequired
            };
            const de = he;
            var fe = a().memo(function(e) {
                var t = e.isPlaying, n = e.onClick;
                return a().createElement("button", {
                    type: "button",
                    className: "image-gallery-icon image-gallery-play-button",
                    onClick: n,
                    "aria-label": "Play or Pause Slideshow"
                }, a().createElement(se, {
                    strokeWidth: 2,
                    icon: t ? "pause" : "play"
                }));
            });
            fe.displayName = "PlayPause", fe.propTypes = {
                isPlaying: te.bool.isRequired,
                onClick: te.func.isRequired
            };
            const pe = fe;
            function me() {
                return me = Object.assign || function(e) {
                    for(var t = 1; t < arguments.length; t++){
                        var n = arguments[t];
                        for(var i in n)Object.prototype.hasOwnProperty.call(n, i) && (e[i] = n[i]);
                    }
                    return e;
                }, me.apply(this, arguments);
            }
            var ge = function(e) {
                var t = e.children, n = e.className, i = e.delta, r = e.onSwiping, s = e.onSwiped, o = (0, ee.useSwipeable)({
                    delta: i,
                    onSwiping: r,
                    onSwiped: s
                });
                return a().createElement("div", me({}, o, {
                    className: n
                }), t);
            };
            ge.propTypes = {
                children: te.node.isRequired,
                className: te.string,
                delta: te.number,
                onSwiped: te.func,
                onSwiping: te.func
            }, ge.defaultProps = {
                className: "",
                delta: 0,
                onSwiping: function() {},
                onSwiped: function() {}
            };
            const ve = ge;
            function be(e) {
                return be = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(e) {
                    return typeof e;
                } : function(e) {
                    return e && "function" == typeof Symbol && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e;
                }, be(e);
            }
            function ye(e, t) {
                var n = Object.keys(e);
                if (Object.getOwnPropertySymbols) {
                    var i = Object.getOwnPropertySymbols(e);
                    t && (i = i.filter(function(t) {
                        return Object.getOwnPropertyDescriptor(e, t).enumerable;
                    })), n.push.apply(n, i);
                }
                return n;
            }
            function we(e) {
                for(var t = 1; t < arguments.length; t++){
                    var n = null != arguments[t] ? arguments[t] : {};
                    t % 2 ? ye(Object(n), !0).forEach(function(t) {
                        Te(e, t, n[t]);
                    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n)) : ye(Object(n)).forEach(function(t) {
                        Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(n, t));
                    });
                }
                return e;
            }
            function Te(e, t, n) {
                return t in e ? Object.defineProperty(e, t, {
                    value: n,
                    enumerable: !0,
                    configurable: !0,
                    writable: !0
                }) : e[t] = n, e;
            }
            function Se(e, t) {
                for(var n = 0; n < t.length; n++){
                    var i = t[n];
                    i.enumerable = i.enumerable || !1, i.configurable = !0, "value" in i && (i.writable = !0), Object.defineProperty(e, i.key, i);
                }
            }
            function Oe(e, t) {
                return Oe = Object.setPrototypeOf || function(e, t) {
                    return e.__proto__ = t, e;
                }, Oe(e, t);
            }
            function Ee(e, t) {
                return !t || "object" !== be(t) && "function" != typeof t ? ke(e) : t;
            }
            function ke(e) {
                if (void 0 === e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
                return e;
            }
            function Ie(e) {
                return Ie = Object.setPrototypeOf ? Object.getPrototypeOf : function(e) {
                    return e.__proto__ || Object.getPrototypeOf(e);
                }, Ie(e);
            }
            var xe = [
                "fullscreenchange",
                "MSFullscreenChange",
                "mozfullscreenchange",
                "webkitfullscreenchange"
            ], _e = (0, te.arrayOf)((0, te.shape)({
                srcSet: te.string,
                media: te.string
            }));
            function Re(e) {
                var t = parseInt(e.keyCode || e.which || 0, 10);
                return 66 === t || 62 === t;
            }
            var Le = function(e) {
                !function(e, t) {
                    if ("function" != typeof t && null !== t) throw new TypeError("Super expression must either be null or a function");
                    e.prototype = Object.create(t && t.prototype, {
                        constructor: {
                            value: e,
                            writable: !0,
                            configurable: !0
                        }
                    }), t && Oe(e, t);
                }(l, e);
                var n, i, r, s, o = (r = l, s = function() {
                    if ("undefined" == typeof Reflect || !Reflect.construct) return !1;
                    if (Reflect.construct.sham) return !1;
                    if ("function" == typeof Proxy) return !0;
                    try {
                        return Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {})), !0;
                    } catch (e) {
                        return !1;
                    }
                }(), function() {
                    var e, t = Ie(r);
                    if (s) {
                        var n = Ie(this).constructor;
                        e = Reflect.construct(t, arguments, n);
                    } else e = t.apply(this, arguments);
                    return Ee(this, e);
                });
                function l(e) {
                    var t;
                    return function(e, t) {
                        if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function");
                    }(this, l), (t = o.call(this, e)).state = {
                        currentIndex: e.startIndex,
                        thumbsTranslate: 0,
                        thumbsSwipedTranslate: 0,
                        currentSlideOffset: 0,
                        galleryWidth: 0,
                        thumbnailsWrapperWidth: 0,
                        thumbnailsWrapperHeight: 0,
                        thumbsStyle: {
                            transition: "all ".concat(e.slideDuration, "ms ease-out")
                        },
                        isFullscreen: !1,
                        isSwipingThumbnail: !1,
                        isPlaying: !1
                    }, t.loadedImages = {}, t.imageGallery = a().createRef(), t.thumbnailsWrapper = a().createRef(), t.thumbnails = a().createRef(), t.imageGallerySlideWrapper = a().createRef(), t.handleImageLoaded = t.handleImageLoaded.bind(ke(t)), t.handleKeyDown = t.handleKeyDown.bind(ke(t)), t.handleMouseDown = t.handleMouseDown.bind(ke(t)), t.handleResize = t.handleResize.bind(ke(t)), t.handleTouchMove = t.handleTouchMove.bind(ke(t)), t.handleOnSwiped = t.handleOnSwiped.bind(ke(t)), t.handleScreenChange = t.handleScreenChange.bind(ke(t)), t.handleSwiping = t.handleSwiping.bind(ke(t)), t.handleThumbnailSwiping = t.handleThumbnailSwiping.bind(ke(t)), t.handleOnThumbnailSwiped = t.handleOnThumbnailSwiped.bind(ke(t)), t.onThumbnailMouseLeave = t.onThumbnailMouseLeave.bind(ke(t)), t.handleImageError = t.handleImageError.bind(ke(t)), t.pauseOrPlay = t.pauseOrPlay.bind(ke(t)), t.renderThumbInner = t.renderThumbInner.bind(ke(t)), t.renderItem = t.renderItem.bind(ke(t)), t.slideLeft = t.slideLeft.bind(ke(t)), t.slideRight = t.slideRight.bind(ke(t)), t.toggleFullScreen = t.toggleFullScreen.bind(ke(t)), t.togglePlay = t.togglePlay.bind(ke(t)), t.unthrottledSlideToIndex = t.slideToIndex, t.slideToIndex = L(t.unthrottledSlideToIndex, e.slideDuration, {
                        trailing: !1
                    }), e.lazyLoad && (t.lazyLoaded = []), t;
                }
                return n = l, i = [
                    {
                        key: "componentDidMount",
                        value: function() {
                            var e = this.props, t = e.autoPlay, n = e.useWindowKeyDown;
                            t && this.play(), n ? window.addEventListener("keydown", this.handleKeyDown) : this.imageGallery.current.addEventListener("keydown", this.handleKeyDown), window.addEventListener("mousedown", this.handleMouseDown), window.addEventListener("touchmove", this.handleTouchMove, {
                                passive: !1
                            }), this.initSlideWrapperResizeObserver(this.imageGallerySlideWrapper), this.initThumbnailWrapperResizeObserver(this.thumbnailsWrapper), this.addScreenChangeEvent();
                        }
                    },
                    {
                        key: "componentDidUpdate",
                        value: function(e, t) {
                            var n = this.props, i = n.items, r = n.lazyLoad, a = n.slideDuration, s = n.slideInterval, o = n.startIndex, l = n.thumbnailPosition, u = n.showThumbnails, c = n.useWindowKeyDown, h = this.state, d = h.currentIndex, f = h.isPlaying, p = e.items.length !== i.length, m = !M()(e.items, i), g = e.startIndex !== o, v = e.thumbnailPosition !== l, b = e.showThumbnails !== u;
                            s === e.slideInterval && a === e.slideDuration || f && (this.pause(), this.play()), v && (this.removeResizeObserver(), this.initSlideWrapperResizeObserver(this.imageGallerySlideWrapper), this.initThumbnailWrapperResizeObserver(this.thumbnailsWrapper)), b && u && this.initThumbnailWrapperResizeObserver(this.thumbnailsWrapper), b && !u && this.removeThumbnailsResizeObserver(), (p || b) && this.handleResize(), t.currentIndex !== d && this.slideThumbnailBar(), e.slideDuration !== a && (this.slideToIndex = L(this.unthrottledSlideToIndex, a, {
                                trailing: !1
                            })), !r || e.lazyLoad && !m || (this.lazyLoaded = []), c !== e.useWindowKeyDown && (c ? (this.imageGallery.current.removeEventListener("keydown", this.handleKeyDown), window.addEventListener("keydown", this.handleKeyDown)) : (window.removeEventListener("keydown", this.handleKeyDown), this.imageGallery.current.addEventListener("keydown", this.handleKeyDown))), (g || m) && this.setState({
                                currentIndex: o,
                                slideStyle: {
                                    transition: "none"
                                }
                            });
                        }
                    },
                    {
                        key: "componentWillUnmount",
                        value: function() {
                            var e = this.props.useWindowKeyDown;
                            window.removeEventListener("mousedown", this.handleMouseDown), window.removeEventListener("touchmove", this.handleTouchMove), this.removeScreenChangeEvent(), this.removeResizeObserver(), this.playPauseIntervalId && (window.clearInterval(this.playPauseIntervalId), this.playPauseIntervalId = null), this.transitionTimer && window.clearTimeout(this.transitionTimer), e ? window.removeEventListener("keydown", this.handleKeyDown) : this.imageGallery.current.removeEventListener("keydown", this.handleKeyDown);
                        }
                    },
                    {
                        key: "onSliding",
                        value: function() {
                            var e = this, t = this.state, n = t.currentIndex, i = t.isTransitioning, r = this.props, a = r.onSlide, s = r.slideDuration;
                            this.transitionTimer = window.setTimeout(function() {
                                i && (e.setState({
                                    isTransitioning: !i,
                                    isSwipingThumbnail: !1
                                }), a && a(n));
                            }, s + 50);
                        }
                    },
                    {
                        key: "onThumbnailClick",
                        value: function(e, t) {
                            var n = this.props.onThumbnailClick;
                            e.target.parentNode.parentNode.blur(), this.slideToIndex(t, e), n && n(e, t);
                        }
                    },
                    {
                        key: "onThumbnailMouseOver",
                        value: function(e, t) {
                            var n = this;
                            this.thumbnailMouseOverTimer && (window.clearTimeout(this.thumbnailMouseOverTimer), this.thumbnailMouseOverTimer = null), this.thumbnailMouseOverTimer = window.setTimeout(function() {
                                n.slideToIndex(t), n.pause();
                            }, 300);
                        }
                    },
                    {
                        key: "onThumbnailMouseLeave",
                        value: function() {
                            if (this.thumbnailMouseOverTimer) {
                                var e = this.props.autoPlay;
                                window.clearTimeout(this.thumbnailMouseOverTimer), this.thumbnailMouseOverTimer = null, e && this.play();
                            }
                        }
                    },
                    {
                        key: "setThumbsTranslate",
                        value: function(e) {
                            this.setState({
                                thumbsTranslate: e
                            });
                        }
                    },
                    {
                        key: "setModalFullscreen",
                        value: function(e) {
                            var t = this.props.onScreenChange;
                            this.setState({
                                modalFullscreen: e
                            }), t && t(e);
                        }
                    },
                    {
                        key: "getThumbsTranslate",
                        value: function(e) {
                            var t, n = this.props, i = n.disableThumbnailScroll, r = n.items, a = this.state, s = a.thumbnailsWrapperWidth, o = a.thumbnailsWrapperHeight, l = this.thumbnails && this.thumbnails.current;
                            if (i) return 0;
                            if (l) {
                                if (this.isThumbnailVertical()) {
                                    if (l.scrollHeight <= o) return 0;
                                    t = l.scrollHeight - o;
                                } else {
                                    if (l.scrollWidth <= s || s <= 0) return 0;
                                    t = l.scrollWidth - s;
                                }
                                return e * (t / (r.length - 1));
                            }
                            return 0;
                        }
                    },
                    {
                        key: "getThumbnailPositionClassName",
                        value: function(e) {
                            switch(e){
                                case "left":
                                    e = " ".concat("image-gallery-thumbnails-left");
                                    break;
                                case "right":
                                    e = " ".concat("image-gallery-thumbnails-right");
                                    break;
                                case "bottom":
                                    e = " ".concat("image-gallery-thumbnails-bottom");
                                    break;
                                case "top":
                                    e = " ".concat("image-gallery-thumbnails-top");
                            }
                            return e;
                        }
                    },
                    {
                        key: "getAlignmentClassName",
                        value: function(e) {
                            var t = this.state.currentIndex, n = this.props, i = n.infinite, r = n.items, a = "", s = "image-gallery-left", o = "image-gallery-right";
                            switch(e){
                                case t - 1:
                                    a = " ".concat(s);
                                    break;
                                case t:
                                    a = " ".concat("image-gallery-center");
                                    break;
                                case t + 1:
                                    a = " ".concat(o);
                            }
                            return r.length >= 3 && i && (0 === e && t === r.length - 1 ? a = " ".concat(o) : e === r.length - 1 && 0 === t && (a = " ".concat(s))), a;
                        }
                    },
                    {
                        key: "getTranslateXForTwoSlide",
                        value: function(e) {
                            var t = this.state, n = t.currentIndex, i = t.currentSlideOffset, r = t.previousIndex, a = n !== r, s = 0 === e && 0 === r, o = 1 === e && 1 === r, l = 0 === e && 1 === n, u = 1 === e && 0 === n, c = 0 === i, h = -100 * n + 100 * e + i;
                            return i > 0 ? this.direction = "left" : i < 0 && (this.direction = "right"), u && i > 0 && (h = -100 + i), l && i < 0 && (h = 100 + i), a ? s && c && "left" === this.direction ? h = 100 : o && c && "right" === this.direction && (h = -100) : (u && c && "left" === this.direction && (h = -100), l && c && "right" === this.direction && (h = 100)), h;
                        }
                    },
                    {
                        key: "getThumbnailBarHeight",
                        value: function() {
                            return this.isThumbnailVertical() ? {
                                height: this.state.gallerySlideWrapperHeight
                            } : {};
                        }
                    },
                    {
                        key: "getSlideStyle",
                        value: function(e) {
                            var t = this.state, n = t.currentIndex, i = t.currentSlideOffset, r = t.slideStyle, a = this.props, s = a.infinite, o = a.items, l = a.useTranslate3D, u = a.isRTL, c = -100 * n, h = o.length - 1, d = (c + 100 * e) * (u ? -1 : 1) + i;
                            s && o.length > 2 && (0 === n && e === h ? d = -100 * (u ? -1 : 1) + i : n === h && 0 === e && (d = 100 * (u ? -1 : 1) + i)), s && 2 === o.length && (d = this.getTranslateXForTwoSlide(e));
                            var f = "translate(".concat(d, "%, 0)");
                            return l && (f = "translate3d(".concat(d, "%, 0, 0)")), we({
                                display: this.isSlideVisible(e) ? "inherit" : "none",
                                WebkitTransform: f,
                                MozTransform: f,
                                msTransform: f,
                                OTransform: f,
                                transform: f
                            }, r);
                        }
                    },
                    {
                        key: "getCurrentIndex",
                        value: function() {
                            return this.state.currentIndex;
                        }
                    },
                    {
                        key: "getThumbnailStyle",
                        value: function() {
                            var e, t = this.props, n = t.useTranslate3D, i = t.isRTL, r = this.state, a = r.thumbsTranslate, s = r.thumbsStyle, o = i ? -1 * a : a;
                            return this.isThumbnailVertical() ? (e = "translate(0, ".concat(a, "px)"), n && (e = "translate3d(0, ".concat(a, "px, 0)"))) : (e = "translate(".concat(o, "px, 0)"), n && (e = "translate3d(".concat(o, "px, 0, 0)"))), we({
                                WebkitTransform: e,
                                MozTransform: e,
                                msTransform: e,
                                OTransform: e,
                                transform: e
                            }, s);
                        }
                    },
                    {
                        key: "getSlideItems",
                        value: function() {
                            var e = this, n = this.state.currentIndex, i = this.props, r = i.items, s = i.slideOnThumbnailOver, o = i.onClick, l = i.lazyLoad, u = i.onTouchMove, c = i.onTouchEnd, h = i.onTouchStart, d = i.onMouseOver, f = i.onMouseLeave, p = i.renderItem, m = i.renderThumbInner, g = i.showThumbnails, v = i.showBullets, b = [], y = [], w = [];
                            return r.forEach(function(i, r) {
                                var T = e.getAlignmentClassName(r), S = i.originalClass ? " ".concat(i.originalClass) : "", O = i.thumbnailClass ? " ".concat(i.thumbnailClass) : "", E = i.renderItem || p || e.renderItem, k = i.renderThumbInner || m || e.renderThumbInner, I = !l || T || e.lazyLoaded[r];
                                I && l && !e.lazyLoaded[r] && (e.lazyLoaded[r] = !0);
                                var x = e.getSlideStyle(r), _ = a().createElement("div", {
                                    "aria-label": "Go to Slide ".concat(r + 1),
                                    key: "slide-".concat(r),
                                    tabIndex: "-1",
                                    className: "image-gallery-slide ".concat(T, " ").concat(S),
                                    style: x,
                                    onClick: o,
                                    onKeyUp: e.handleSlideKeyUp,
                                    onTouchMove: u,
                                    onTouchEnd: c,
                                    onTouchStart: h,
                                    onMouseOver: d,
                                    onFocus: d,
                                    onMouseLeave: f,
                                    role: "button"
                                }, I ? E(i) : a().createElement("div", {
                                    style: {
                                        height: "100%"
                                    }
                                }));
                                if (b.push(_), g && i.thumbnail) {
                                    var R = t("image-gallery-thumbnail", O, {
                                        active: n === r
                                    });
                                    y.push(a().createElement("button", {
                                        key: "thumbnail-".concat(r),
                                        type: "button",
                                        tabIndex: "0",
                                        "aria-pressed": n === r ? "true" : "false",
                                        "aria-label": "Go to Slide ".concat(r + 1),
                                        className: R,
                                        onMouseLeave: s ? e.onThumbnailMouseLeave : null,
                                        onMouseOver: function(t) {
                                            return e.handleThumbnailMouseOver(t, r);
                                        },
                                        onFocus: function(t) {
                                            return e.handleThumbnailMouseOver(t, r);
                                        },
                                        onKeyUp: function(t) {
                                            return e.handleThumbnailKeyUp(t, r);
                                        },
                                        onClick: function(t) {
                                            return e.onThumbnailClick(t, r);
                                        }
                                    }, k(i)));
                                }
                                if (v) {
                                    var L = t("image-gallery-bullet", i.bulletClass, {
                                        active: n === r
                                    });
                                    w.push(a().createElement("button", {
                                        type: "button",
                                        key: "bullet-".concat(r),
                                        className: L,
                                        onClick: function(t) {
                                            return i.bulletOnClick && i.bulletOnClick({
                                                item: i,
                                                itemIndex: r,
                                                currentIndex: n
                                            }), t.target.blur(), e.slideToIndex.call(e, r, t);
                                        },
                                        "aria-pressed": n === r ? "true" : "false",
                                        "aria-label": "Go to Slide ".concat(r + 1)
                                    }));
                                }
                            }), {
                                slides: b,
                                thumbnails: y,
                                bullets: w
                            };
                        }
                    },
                    {
                        key: "ignoreIsTransitioning",
                        value: function() {
                            var e = this.props.items, t = this.state, n = t.previousIndex, i = t.currentIndex, r = e.length - 1;
                            return Math.abs(n - i) > 1 && !(0 === n && i === r) && !(n === r && 0 === i);
                        }
                    },
                    {
                        key: "isFirstOrLastSlide",
                        value: function(e) {
                            return e === this.props.items.length - 1 || 0 === e;
                        }
                    },
                    {
                        key: "slideIsTransitioning",
                        value: function(e) {
                            var t = this.state, n = t.isTransitioning, i = t.previousIndex, r = t.currentIndex;
                            return n && !(e === i || e === r);
                        }
                    },
                    {
                        key: "isSlideVisible",
                        value: function(e) {
                            return !this.slideIsTransitioning(e) || this.ignoreIsTransitioning() && !this.isFirstOrLastSlide(e);
                        }
                    },
                    {
                        key: "slideThumbnailBar",
                        value: function() {
                            var e = this.state, t = e.currentIndex, n = e.isSwipingThumbnail, i = -this.getThumbsTranslate(t);
                            n || (0 === t ? this.setState({
                                thumbsTranslate: 0,
                                thumbsSwipedTranslate: 0
                            }) : this.setState({
                                thumbsTranslate: i,
                                thumbsSwipedTranslate: i
                            }));
                        }
                    },
                    {
                        key: "canSlide",
                        value: function() {
                            return this.props.items.length >= 2;
                        }
                    },
                    {
                        key: "canSlideLeft",
                        value: function() {
                            var e = this.props, t = e.infinite, n = e.isRTL;
                            return t || (n ? this.canSlideNext() : this.canSlidePrevious());
                        }
                    },
                    {
                        key: "canSlideRight",
                        value: function() {
                            var e = this.props, t = e.infinite, n = e.isRTL;
                            return t || (n ? this.canSlidePrevious() : this.canSlideNext());
                        }
                    },
                    {
                        key: "canSlidePrevious",
                        value: function() {
                            return this.state.currentIndex > 0;
                        }
                    },
                    {
                        key: "canSlideNext",
                        value: function() {
                            return this.state.currentIndex < this.props.items.length - 1;
                        }
                    },
                    {
                        key: "handleSwiping",
                        value: function(e) {
                            var t = e.event, n = e.absX, i = e.dir, r = this.props, a = r.disableSwipe, s = r.stopPropagation, o = this.state, l = o.galleryWidth, u = o.isTransitioning, c = o.swipingUpDown, h = o.swipingLeftRight;
                            if (i !== ee.UP && i !== ee.DOWN && !c || h) {
                                if (i !== ee.LEFT && i !== ee.RIGHT || h || this.setState({
                                    swipingLeftRight: !0
                                }), !a) {
                                    var d = this.props.swipingTransitionDuration;
                                    if (s && t.preventDefault(), u) this.setState({
                                        currentSlideOffset: 0
                                    });
                                    else {
                                        var f = i === ee.RIGHT ? 1 : -1, p = n / l * 100;
                                        Math.abs(p) >= 100 && (p = 100);
                                        var m = {
                                            transition: "transform ".concat(d, "ms ease-out")
                                        };
                                        this.setState({
                                            currentSlideOffset: f * p,
                                            slideStyle: m
                                        });
                                    }
                                }
                            } else c || this.setState({
                                swipingUpDown: !0
                            });
                        }
                    },
                    {
                        key: "handleThumbnailSwiping",
                        value: function(e) {
                            var t = e.event, n = e.absX, i = e.absY, r = e.dir, a = this.props, s = a.stopPropagation, o = a.swipingThumbnailTransitionDuration, l = this.state, u = l.thumbsSwipedTranslate, c = l.thumbnailsWrapperHeight, h = l.thumbnailsWrapperWidth, d = l.swipingUpDown, f = l.swipingLeftRight;
                            if (this.isThumbnailVertical()) {
                                if ((r === ee.LEFT || r === ee.RIGHT || f) && !d) return void (f || this.setState({
                                    swipingLeftRight: !0
                                }));
                                r !== ee.UP && r !== ee.DOWN || d || this.setState({
                                    swipingUpDown: !0
                                });
                            } else {
                                if ((r === ee.UP || r === ee.DOWN || d) && !f) return void (d || this.setState({
                                    swipingUpDown: !0
                                }));
                                r !== ee.LEFT && r !== ee.RIGHT || f || this.setState({
                                    swipingLeftRight: !0
                                });
                            }
                            var p, m, g, v, b, y = this.thumbnails && this.thumbnails.current;
                            if (this.isThumbnailVertical() ? (p = u + (r === ee.DOWN ? i : -i), m = y.scrollHeight - c + 20, g = Math.abs(p) > m, v = p > 20, b = y.scrollHeight <= c) : (p = u + (r === ee.RIGHT ? n : -n), m = y.scrollWidth - h + 20, g = Math.abs(p) > m, v = p > 20, b = y.scrollWidth <= h), !b && (r !== ee.LEFT && r !== ee.UP || !g) && (r !== ee.RIGHT && r !== ee.DOWN || !v)) {
                                s && t.stopPropagation();
                                var w = {
                                    transition: "transform ".concat(o, "ms ease-out")
                                };
                                this.setState({
                                    thumbsTranslate: p,
                                    thumbsStyle: w
                                });
                            }
                        }
                    },
                    {
                        key: "handleOnThumbnailSwiped",
                        value: function() {
                            var e = this.state.thumbsTranslate, t = this.props.slideDuration;
                            this.resetSwipingDirection(), this.setState({
                                isSwipingThumbnail: !0,
                                thumbsSwipedTranslate: e,
                                thumbsStyle: {
                                    transition: "all ".concat(t, "ms ease-out")
                                }
                            });
                        }
                    },
                    {
                        key: "sufficientSwipe",
                        value: function() {
                            var e = this.state.currentSlideOffset, t = this.props.swipeThreshold;
                            return Math.abs(e) > t;
                        }
                    },
                    {
                        key: "resetSwipingDirection",
                        value: function() {
                            var e = this.state, t = e.swipingUpDown, n = e.swipingLeftRight;
                            t && this.setState({
                                swipingUpDown: !1
                            }), n && this.setState({
                                swipingLeftRight: !1
                            });
                        }
                    },
                    {
                        key: "handleOnSwiped",
                        value: function(e) {
                            var t = e.event, n = e.dir, i = e.velocity, r = this.props, a = r.disableSwipe, s = r.stopPropagation, o = r.flickThreshold;
                            if (!a) {
                                var l = this.props.isRTL;
                                s && t.stopPropagation(), this.resetSwipingDirection();
                                var u = (n === ee.LEFT ? 1 : -1) * (l ? -1 : 1), c = n === ee.UP || n === ee.DOWN, h = i > o && !c;
                                this.handleOnSwipedTo(u, h);
                            }
                        }
                    },
                    {
                        key: "handleOnSwipedTo",
                        value: function(e, t) {
                            var n = this.state, i = n.currentIndex, r = n.isTransitioning, a = i;
                            !this.sufficientSwipe() && !t || r || (a += e), (-1 === e && !this.canSlideLeft() || 1 === e && !this.canSlideRight()) && (a = i), this.unthrottledSlideToIndex(a);
                        }
                    },
                    {
                        key: "handleTouchMove",
                        value: function(e) {
                            this.state.swipingLeftRight && e.preventDefault();
                        }
                    },
                    {
                        key: "handleMouseDown",
                        value: function() {
                            this.imageGallery.current.classList.add("image-gallery-using-mouse");
                        }
                    },
                    {
                        key: "handleKeyDown",
                        value: function(e) {
                            var t = this.props, n = t.disableKeyDown, i = t.useBrowserFullscreen, r = this.state.isFullscreen;
                            if (this.imageGallery.current.classList.remove("image-gallery-using-mouse"), !n) switch(parseInt(e.keyCode || e.which || 0, 10)){
                                case 37:
                                    this.canSlideLeft() && !this.playPauseIntervalId && this.slideLeft(e);
                                    break;
                                case 39:
                                    this.canSlideRight() && !this.playPauseIntervalId && this.slideRight(e);
                                    break;
                                case 27:
                                    r && !i && this.exitFullScreen();
                            }
                        }
                    },
                    {
                        key: "handleImageError",
                        value: function(e) {
                            var t = this.props.onErrorImageURL;
                            t && -1 === e.target.src.indexOf(t) && (e.target.src = t);
                        }
                    },
                    {
                        key: "removeThumbnailsResizeObserver",
                        value: function() {
                            this.resizeThumbnailWrapperObserver && this.thumbnailsWrapper && this.thumbnailsWrapper.current && (this.resizeThumbnailWrapperObserver.unobserve(this.thumbnailsWrapper.current), this.resizeThumbnailWrapperObserver = null);
                        }
                    },
                    {
                        key: "removeResizeObserver",
                        value: function() {
                            this.resizeSlideWrapperObserver && this.imageGallerySlideWrapper && this.imageGallerySlideWrapper.current && (this.resizeSlideWrapperObserver.unobserve(this.imageGallerySlideWrapper.current), this.resizeSlideWrapperObserver = null), this.removeThumbnailsResizeObserver();
                        }
                    },
                    {
                        key: "handleResize",
                        value: function() {
                            var e = this.state.currentIndex;
                            this.imageGallery && (this.imageGallery && this.imageGallery.current && this.setState({
                                galleryWidth: this.imageGallery.current.offsetWidth
                            }), this.imageGallerySlideWrapper && this.imageGallerySlideWrapper.current && this.setState({
                                gallerySlideWrapperHeight: this.imageGallerySlideWrapper.current.offsetHeight
                            }), this.setThumbsTranslate(-this.getThumbsTranslate(e)));
                        }
                    },
                    {
                        key: "initSlideWrapperResizeObserver",
                        value: function(e) {
                            var t = this;
                            e && !e.current || (this.resizeSlideWrapperObserver = new Z(R(function(e) {
                                e && e.forEach(function(e) {
                                    t.setState({
                                        thumbnailsWrapperWidth: e.contentRect.width
                                    }, t.handleResize);
                                });
                            }, 50)), this.resizeSlideWrapperObserver.observe(e.current));
                        }
                    },
                    {
                        key: "initThumbnailWrapperResizeObserver",
                        value: function(e) {
                            var t = this;
                            e && !e.current || (this.resizeThumbnailWrapperObserver = new Z(R(function(e) {
                                e && e.forEach(function(e) {
                                    t.setState({
                                        thumbnailsWrapperHeight: e.contentRect.height
                                    }, t.handleResize);
                                });
                            }, 50)), this.resizeThumbnailWrapperObserver.observe(e.current));
                        }
                    },
                    {
                        key: "toggleFullScreen",
                        value: function() {
                            this.state.isFullscreen ? this.exitFullScreen() : this.fullScreen();
                        }
                    },
                    {
                        key: "togglePlay",
                        value: function() {
                            this.playPauseIntervalId ? this.pause() : this.play();
                        }
                    },
                    {
                        key: "handleScreenChange",
                        value: function() {
                            var e = this.props, t = e.onScreenChange, n = e.useBrowserFullscreen, i = document.fullscreenElement || document.msFullscreenElement || document.mozFullScreenElement || document.webkitFullscreenElement, r = this.imageGallery.current === i;
                            t && t(r), n && this.setState({
                                isFullscreen: r
                            });
                        }
                    },
                    {
                        key: "slideToIndex",
                        value: function(e, t) {
                            var n = this.state, i = n.currentIndex, r = n.isTransitioning, a = this.props, s = a.items, o = a.slideDuration, l = a.onBeforeSlide;
                            if (!r) {
                                t && this.playPauseIntervalId && (this.pause(!1), this.play(!1));
                                var u = s.length - 1, c = e;
                                e < 0 ? c = u : e > u && (c = 0), l && c !== i && l(c), this.setState({
                                    previousIndex: i,
                                    currentIndex: c,
                                    isTransitioning: c !== i,
                                    currentSlideOffset: 0,
                                    slideStyle: {
                                        transition: "all ".concat(o, "ms ease-out")
                                    }
                                }, this.onSliding);
                            }
                        }
                    },
                    {
                        key: "slideLeft",
                        value: function(e) {
                            var t = this.props.isRTL;
                            this.slideTo(e, t ? "right" : "left");
                        }
                    },
                    {
                        key: "slideRight",
                        value: function(e) {
                            var t = this.props.isRTL;
                            this.slideTo(e, t ? "left" : "right");
                        }
                    },
                    {
                        key: "slideTo",
                        value: function(e, t) {
                            var n = this, i = this.state, r = i.currentIndex, a = i.currentSlideOffset, s = i.isTransitioning, o = this.props.items, l = r + ("left" === t ? -1 : 1);
                            s || (2 === o.length ? this.setState({
                                currentSlideOffset: a + ("left" === t ? .001 : -.001),
                                slideStyle: {
                                    transition: "none"
                                }
                            }, function() {
                                window.setTimeout(function() {
                                    return n.slideToIndex(l, e);
                                }, 25);
                            }) : this.slideToIndex(l, e));
                        }
                    },
                    {
                        key: "handleThumbnailMouseOver",
                        value: function(e, t) {
                            this.props.slideOnThumbnailOver && this.onThumbnailMouseOver(e, t);
                        }
                    },
                    {
                        key: "handleThumbnailKeyUp",
                        value: function(e, t) {
                            Re(e) && this.onThumbnailClick(e, t);
                        }
                    },
                    {
                        key: "handleSlideKeyUp",
                        value: function(e) {
                            Re(e) && (0, this.props.onClick)(e);
                        }
                    },
                    {
                        key: "isThumbnailVertical",
                        value: function() {
                            var e = this.props.thumbnailPosition;
                            return "left" === e || "right" === e;
                        }
                    },
                    {
                        key: "addScreenChangeEvent",
                        value: function() {
                            var e = this;
                            xe.forEach(function(t) {
                                document.addEventListener(t, e.handleScreenChange);
                            });
                        }
                    },
                    {
                        key: "removeScreenChangeEvent",
                        value: function() {
                            var e = this;
                            xe.forEach(function(t) {
                                document.removeEventListener(t, e.handleScreenChange);
                            });
                        }
                    },
                    {
                        key: "fullScreen",
                        value: function() {
                            var e = this.props.useBrowserFullscreen, t = this.imageGallery.current;
                            e ? t.requestFullscreen ? t.requestFullscreen() : t.msRequestFullscreen ? t.msRequestFullscreen() : t.mozRequestFullScreen ? t.mozRequestFullScreen() : t.webkitRequestFullscreen ? t.webkitRequestFullscreen() : this.setModalFullscreen(!0) : this.setModalFullscreen(!0), this.setState({
                                isFullscreen: !0
                            });
                        }
                    },
                    {
                        key: "exitFullScreen",
                        value: function() {
                            var e = this.state.isFullscreen, t = this.props.useBrowserFullscreen;
                            e && (t ? document.exitFullscreen ? document.exitFullscreen() : document.webkitExitFullscreen ? document.webkitExitFullscreen() : document.mozCancelFullScreen ? document.mozCancelFullScreen() : document.msExitFullscreen ? document.msExitFullscreen() : this.setModalFullscreen(!1) : this.setModalFullscreen(!1), this.setState({
                                isFullscreen: !1
                            }));
                        }
                    },
                    {
                        key: "pauseOrPlay",
                        value: function() {
                            var e = this.props.infinite, t = this.state.currentIndex;
                            e || this.canSlideRight() ? this.slideToIndex(t + 1) : this.pause();
                        }
                    },
                    {
                        key: "play",
                        value: function() {
                            var e = !(arguments.length > 0 && void 0 !== arguments[0]) || arguments[0], t = this.props, n = t.onPlay, i = t.slideInterval, r = t.slideDuration, a = this.state.currentIndex;
                            this.playPauseIntervalId || (this.setState({
                                isPlaying: !0
                            }), this.playPauseIntervalId = window.setInterval(this.pauseOrPlay, Math.max(i, r)), n && e && n(a));
                        }
                    },
                    {
                        key: "pause",
                        value: function() {
                            var e = !(arguments.length > 0 && void 0 !== arguments[0]) || arguments[0], t = this.props.onPause, n = this.state.currentIndex;
                            this.playPauseIntervalId && (window.clearInterval(this.playPauseIntervalId), this.playPauseIntervalId = null, this.setState({
                                isPlaying: !1
                            }), t && e && t(n));
                        }
                    },
                    {
                        key: "isImageLoaded",
                        value: function(e) {
                            return !!this.loadedImages[e.original] || (this.loadedImages[e.original] = !0, !1);
                        }
                    },
                    {
                        key: "handleImageLoaded",
                        value: function(e, t) {
                            var n = this.props.onImageLoad;
                            !this.loadedImages[t] && n && (this.loadedImages[t] = !0, n(e));
                        }
                    },
                    {
                        key: "renderItem",
                        value: function(e) {
                            var t = this.state.isFullscreen, n = this.props.onImageError || this.handleImageError;
                            return a().createElement(ie, {
                                description: e.description,
                                fullscreen: e.fullscreen,
                                handleImageLoaded: this.handleImageLoaded,
                                isFullscreen: t,
                                onImageError: n,
                                original: e.original,
                                originalAlt: e.originalAlt,
                                originalHeight: e.originalHeight,
                                originalWidth: e.originalWidth,
                                originalTitle: e.originalTitle,
                                sizes: e.sizes,
                                loading: e.loading,
                                srcSet: e.srcSet
                            });
                        }
                    },
                    {
                        key: "renderThumbInner",
                        value: function(e) {
                            var t = this.props.onThumbnailError || this.handleImageError;
                            return a().createElement("span", {
                                className: "image-gallery-thumbnail-inner"
                            }, a().createElement("img", {
                                className: "image-gallery-thumbnail-image",
                                src: e.thumbnail,
                                height: e.thumbnailHeight,
                                width: e.thumbnailWidth,
                                alt: e.thumbnailAlt,
                                title: e.thumbnailTitle,
                                loading: e.thumbnailLoading,
                                onError: t
                            }), e.thumbnailLabel && a().createElement("div", {
                                className: "image-gallery-thumbnail-label"
                            }, e.thumbnailLabel));
                        }
                    },
                    {
                        key: "render",
                        value: function() {
                            var e = this.state, n = e.currentIndex, i = e.isFullscreen, r = e.modalFullscreen, s = e.isPlaying, o = this.props, l = o.additionalClass, u = o.disableThumbnailSwipe, c = o.indexSeparator, h = o.isRTL, d = o.items, f = o.thumbnailPosition, p = o.renderFullscreenButton, m = o.renderCustomControls, g = o.renderLeftNav, v = o.renderRightNav, b = o.showBullets, y = o.showFullscreenButton, w = o.showIndex, T = o.showThumbnails, S = o.showNav, O = o.showPlayButton, E = o.renderPlayPauseButton, k = this.getThumbnailStyle(), I = this.getSlideItems(), x = I.slides, _ = I.thumbnails, R = I.bullets, L = t("image-gallery-slide-wrapper", this.getThumbnailPositionClassName(f), {
                                "image-gallery-rtl": h
                            }), P = a().createElement("div", {
                                ref: this.imageGallerySlideWrapper,
                                className: L
                            }, m && m(), this.canSlide() ? a().createElement(a().Fragment, null, S && a().createElement(a().Fragment, null, g(this.slideLeft, !this.canSlideLeft()), v(this.slideRight, !this.canSlideRight())), a().createElement(ve, {
                                className: "image-gallery-swipe",
                                delta: 0,
                                onSwiping: this.handleSwiping,
                                onSwiped: this.handleOnSwiped
                            }, a().createElement("div", {
                                className: "image-gallery-slides"
                            }, x))) : a().createElement("div", {
                                className: "image-gallery-slides"
                            }, x), O && E(this.togglePlay, s), b && a().createElement("div", {
                                className: "image-gallery-bullets"
                            }, a().createElement("div", {
                                className: "image-gallery-bullets-container",
                                role: "navigation",
                                "aria-label": "Bullet Navigation"
                            }, R)), y && p(this.toggleFullScreen, i), w && a().createElement("div", {
                                className: "image-gallery-index"
                            }, a().createElement("span", {
                                className: "image-gallery-index-current"
                            }, n + 1), a().createElement("span", {
                                className: "image-gallery-index-separator"
                            }, c), a().createElement("span", {
                                className: "image-gallery-index-total"
                            }, d.length))), M = t("image-gallery", l, {
                                "fullscreen-modal": r
                            }), W = t("image-gallery-content", this.getThumbnailPositionClassName(f), {
                                fullscreen: i
                            }), D = t("image-gallery-thumbnails-wrapper", this.getThumbnailPositionClassName(f), {
                                "thumbnails-wrapper-rtl": !this.isThumbnailVertical() && h
                            }, {
                                "thumbnails-swipe-horizontal": !this.isThumbnailVertical() && !u
                            }, {
                                "thumbnails-swipe-vertical": this.isThumbnailVertical() && !u
                            });
                            return a().createElement("div", {
                                ref: this.imageGallery,
                                className: M,
                                "aria-live": "polite"
                            }, a().createElement("div", {
                                className: W
                            }, ("bottom" === f || "right" === f) && P, T && _.length > 0 ? a().createElement(ve, {
                                className: D,
                                delta: 0,
                                onSwiping: !u && this.handleThumbnailSwiping,
                                onSwiped: !u && this.handleOnThumbnailSwiped
                            }, a().createElement("div", {
                                className: "image-gallery-thumbnails",
                                ref: this.thumbnailsWrapper,
                                style: this.getThumbnailBarHeight()
                            }, a().createElement("nav", {
                                ref: this.thumbnails,
                                className: "image-gallery-thumbnails-container",
                                style: k,
                                "aria-label": "Thumbnail Navigation"
                            }, _))) : null, ("top" === f || "left" === f) && P));
                        }
                    }
                ], i && Se(n.prototype, i), l;
            }(a().Component);
            Le.propTypes = {
                flickThreshold: te.number,
                items: (0, te.arrayOf)((0, te.shape)({
                    bulletClass: te.string,
                    bulletOnClick: te.func,
                    description: te.string,
                    original: te.string,
                    originalHeight: te.number,
                    originalWidth: te.number,
                    loading: te.string,
                    thumbnailHeight: te.number,
                    thumbnailWidth: te.number,
                    thumbnailLoading: te.string,
                    fullscreen: te.string,
                    originalAlt: te.string,
                    originalTitle: te.string,
                    thumbnail: te.string,
                    thumbnailAlt: te.string,
                    thumbnailLabel: te.string,
                    thumbnailTitle: te.string,
                    originalClass: te.string,
                    thumbnailClass: te.string,
                    renderItem: te.func,
                    renderThumbInner: te.func,
                    imageSet: _e,
                    srcSet: te.string,
                    sizes: te.string
                })).isRequired,
                showNav: te.bool,
                autoPlay: te.bool,
                lazyLoad: te.bool,
                infinite: te.bool,
                showIndex: te.bool,
                showBullets: te.bool,
                showThumbnails: te.bool,
                showPlayButton: te.bool,
                showFullscreenButton: te.bool,
                disableThumbnailScroll: te.bool,
                disableKeyDown: te.bool,
                disableSwipe: te.bool,
                disableThumbnailSwipe: te.bool,
                useBrowserFullscreen: te.bool,
                onErrorImageURL: te.string,
                indexSeparator: te.string,
                thumbnailPosition: (0, te.oneOf)([
                    "top",
                    "bottom",
                    "left",
                    "right"
                ]),
                startIndex: te.number,
                slideDuration: te.number,
                slideInterval: te.number,
                slideOnThumbnailOver: te.bool,
                swipeThreshold: te.number,
                swipingTransitionDuration: te.number,
                swipingThumbnailTransitionDuration: te.number,
                onSlide: te.func,
                onBeforeSlide: te.func,
                onScreenChange: te.func,
                onPause: te.func,
                onPlay: te.func,
                onClick: te.func,
                onImageLoad: te.func,
                onImageError: te.func,
                onTouchMove: te.func,
                onTouchEnd: te.func,
                onTouchStart: te.func,
                onMouseOver: te.func,
                onMouseLeave: te.func,
                onThumbnailError: te.func,
                onThumbnailClick: te.func,
                renderCustomControls: te.func,
                renderLeftNav: te.func,
                renderRightNav: te.func,
                renderPlayPauseButton: te.func,
                renderFullscreenButton: te.func,
                renderItem: te.func,
                renderThumbInner: te.func,
                stopPropagation: te.bool,
                additionalClass: te.string,
                useTranslate3D: te.bool,
                isRTL: te.bool,
                useWindowKeyDown: te.bool
            }, Le.defaultProps = {
                onErrorImageURL: "",
                additionalClass: "",
                showNav: !0,
                autoPlay: !1,
                lazyLoad: !1,
                infinite: !0,
                showIndex: !1,
                showBullets: !1,
                showThumbnails: !0,
                showPlayButton: !0,
                showFullscreenButton: !0,
                disableThumbnailScroll: !1,
                disableKeyDown: !1,
                disableSwipe: !1,
                disableThumbnailSwipe: !1,
                useTranslate3D: !0,
                isRTL: !1,
                useBrowserFullscreen: !0,
                flickThreshold: .4,
                stopPropagation: !1,
                indexSeparator: " / ",
                thumbnailPosition: "bottom",
                startIndex: 0,
                slideDuration: 450,
                swipingTransitionDuration: 0,
                swipingThumbnailTransitionDuration: 0,
                onSlide: null,
                onBeforeSlide: null,
                onScreenChange: null,
                onPause: null,
                onPlay: null,
                onClick: null,
                onImageLoad: null,
                onImageError: null,
                onTouchMove: null,
                onTouchEnd: null,
                onTouchStart: null,
                onMouseOver: null,
                onMouseLeave: null,
                onThumbnailError: null,
                onThumbnailClick: null,
                renderCustomControls: null,
                renderThumbInner: null,
                renderItem: null,
                slideInterval: 3e3,
                slideOnThumbnailOver: !1,
                swipeThreshold: 30,
                renderLeftNav: function(e, t) {
                    return a().createElement(ce, {
                        onClick: e,
                        disabled: t
                    });
                },
                renderRightNav: function(e, t) {
                    return a().createElement(de, {
                        onClick: e,
                        disabled: t
                    });
                },
                renderPlayPauseButton: function(e, t) {
                    return a().createElement(pe, {
                        onClick: e,
                        isPlaying: t
                    });
                },
                renderFullscreenButton: function(e, t) {
                    return a().createElement(le, {
                        onClick: e,
                        isFullscreen: t
                    });
                },
                useWindowKeyDown: !0
            };
            const Pe = Le;
        })(), r;
    })();
});
}}),
}]);

//# sourceMappingURL=7fad3_14f4f5f4._.js.map