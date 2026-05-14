function getDefaultExportFromCjs(x) {
  return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, "default") ? x["default"] : x;
}
var jsxRuntime = { exports: {} };
var reactJsxRuntime_production_min = {};
var react = { exports: {} };
var react_production_min = {};
/**
 * @license React
 * react.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var hasRequiredReact_production_min;
function requireReact_production_min() {
  if (hasRequiredReact_production_min) return react_production_min;
  hasRequiredReact_production_min = 1;
  var l = Symbol.for("react.element"), n = Symbol.for("react.portal"), p = Symbol.for("react.fragment"), q2 = Symbol.for("react.strict_mode"), r = Symbol.for("react.profiler"), t = Symbol.for("react.provider"), u = Symbol.for("react.context"), v = Symbol.for("react.forward_ref"), w = Symbol.for("react.suspense"), x = Symbol.for("react.memo"), y = Symbol.for("react.lazy"), z = Symbol.iterator;
  function A2(a) {
    if (null === a || "object" !== typeof a) return null;
    a = z && a[z] || a["@@iterator"];
    return "function" === typeof a ? a : null;
  }
  var B2 = { isMounted: function() {
    return false;
  }, enqueueForceUpdate: function() {
  }, enqueueReplaceState: function() {
  }, enqueueSetState: function() {
  } }, C2 = Object.assign, D2 = {};
  function E(a, b, e) {
    this.props = a;
    this.context = b;
    this.refs = D2;
    this.updater = e || B2;
  }
  E.prototype.isReactComponent = {};
  E.prototype.setState = function(a, b) {
    if ("object" !== typeof a && "function" !== typeof a && null != a) throw Error("setState(...): takes an object of state variables to update or a function which returns an object of state variables.");
    this.updater.enqueueSetState(this, a, b, "setState");
  };
  E.prototype.forceUpdate = function(a) {
    this.updater.enqueueForceUpdate(this, a, "forceUpdate");
  };
  function F2() {
  }
  F2.prototype = E.prototype;
  function G(a, b, e) {
    this.props = a;
    this.context = b;
    this.refs = D2;
    this.updater = e || B2;
  }
  var H2 = G.prototype = new F2();
  H2.constructor = G;
  C2(H2, E.prototype);
  H2.isPureReactComponent = true;
  var I2 = Array.isArray, J2 = Object.prototype.hasOwnProperty, K2 = { current: null }, L = { key: true, ref: true, __self: true, __source: true };
  function M(a, b, e) {
    var d, c = {}, k = null, h = null;
    if (null != b) for (d in void 0 !== b.ref && (h = b.ref), void 0 !== b.key && (k = "" + b.key), b) J2.call(b, d) && !L.hasOwnProperty(d) && (c[d] = b[d]);
    var g = arguments.length - 2;
    if (1 === g) c.children = e;
    else if (1 < g) {
      for (var f = Array(g), m = 0; m < g; m++) f[m] = arguments[m + 2];
      c.children = f;
    }
    if (a && a.defaultProps) for (d in g = a.defaultProps, g) void 0 === c[d] && (c[d] = g[d]);
    return { $$typeof: l, type: a, key: k, ref: h, props: c, _owner: K2.current };
  }
  function N(a, b) {
    return { $$typeof: l, type: a.type, key: b, ref: a.ref, props: a.props, _owner: a._owner };
  }
  function O2(a) {
    return "object" === typeof a && null !== a && a.$$typeof === l;
  }
  function escape(a) {
    var b = { "=": "=0", ":": "=2" };
    return "$" + a.replace(/[=:]/g, function(a2) {
      return b[a2];
    });
  }
  var P = /\/+/g;
  function Q(a, b) {
    return "object" === typeof a && null !== a && null != a.key ? escape("" + a.key) : b.toString(36);
  }
  function R(a, b, e, d, c) {
    var k = typeof a;
    if ("undefined" === k || "boolean" === k) a = null;
    var h = false;
    if (null === a) h = true;
    else switch (k) {
      case "string":
      case "number":
        h = true;
        break;
      case "object":
        switch (a.$$typeof) {
          case l:
          case n:
            h = true;
        }
    }
    if (h) return h = a, c = c(h), a = "" === d ? "." + Q(h, 0) : d, I2(c) ? (e = "", null != a && (e = a.replace(P, "$&/") + "/"), R(c, b, e, "", function(a2) {
      return a2;
    })) : null != c && (O2(c) && (c = N(c, e + (!c.key || h && h.key === c.key ? "" : ("" + c.key).replace(P, "$&/") + "/") + a)), b.push(c)), 1;
    h = 0;
    d = "" === d ? "." : d + ":";
    if (I2(a)) for (var g = 0; g < a.length; g++) {
      k = a[g];
      var f = d + Q(k, g);
      h += R(k, b, e, f, c);
    }
    else if (f = A2(a), "function" === typeof f) for (a = f.call(a), g = 0; !(k = a.next()).done; ) k = k.value, f = d + Q(k, g++), h += R(k, b, e, f, c);
    else if ("object" === k) throw b = String(a), Error("Objects are not valid as a React child (found: " + ("[object Object]" === b ? "object with keys {" + Object.keys(a).join(", ") + "}" : b) + "). If you meant to render a collection of children, use an array instead.");
    return h;
  }
  function S(a, b, e) {
    if (null == a) return a;
    var d = [], c = 0;
    R(a, d, "", "", function(a2) {
      return b.call(e, a2, c++);
    });
    return d;
  }
  function T2(a) {
    if (-1 === a._status) {
      var b = a._result;
      b = b();
      b.then(function(b2) {
        if (0 === a._status || -1 === a._status) a._status = 1, a._result = b2;
      }, function(b2) {
        if (0 === a._status || -1 === a._status) a._status = 2, a._result = b2;
      });
      -1 === a._status && (a._status = 0, a._result = b);
    }
    if (1 === a._status) return a._result.default;
    throw a._result;
  }
  var U2 = { current: null }, V = { transition: null }, W2 = { ReactCurrentDispatcher: U2, ReactCurrentBatchConfig: V, ReactCurrentOwner: K2 };
  function X2() {
    throw Error("act(...) is not supported in production builds of React.");
  }
  react_production_min.Children = { map: S, forEach: function(a, b, e) {
    S(a, function() {
      b.apply(this, arguments);
    }, e);
  }, count: function(a) {
    var b = 0;
    S(a, function() {
      b++;
    });
    return b;
  }, toArray: function(a) {
    return S(a, function(a2) {
      return a2;
    }) || [];
  }, only: function(a) {
    if (!O2(a)) throw Error("React.Children.only expected to receive a single React element child.");
    return a;
  } };
  react_production_min.Component = E;
  react_production_min.Fragment = p;
  react_production_min.Profiler = r;
  react_production_min.PureComponent = G;
  react_production_min.StrictMode = q2;
  react_production_min.Suspense = w;
  react_production_min.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = W2;
  react_production_min.act = X2;
  react_production_min.cloneElement = function(a, b, e) {
    if (null === a || void 0 === a) throw Error("React.cloneElement(...): The argument must be a React element, but you passed " + a + ".");
    var d = C2({}, a.props), c = a.key, k = a.ref, h = a._owner;
    if (null != b) {
      void 0 !== b.ref && (k = b.ref, h = K2.current);
      void 0 !== b.key && (c = "" + b.key);
      if (a.type && a.type.defaultProps) var g = a.type.defaultProps;
      for (f in b) J2.call(b, f) && !L.hasOwnProperty(f) && (d[f] = void 0 === b[f] && void 0 !== g ? g[f] : b[f]);
    }
    var f = arguments.length - 2;
    if (1 === f) d.children = e;
    else if (1 < f) {
      g = Array(f);
      for (var m = 0; m < f; m++) g[m] = arguments[m + 2];
      d.children = g;
    }
    return { $$typeof: l, type: a.type, key: c, ref: k, props: d, _owner: h };
  };
  react_production_min.createContext = function(a) {
    a = { $$typeof: u, _currentValue: a, _currentValue2: a, _threadCount: 0, Provider: null, Consumer: null, _defaultValue: null, _globalName: null };
    a.Provider = { $$typeof: t, _context: a };
    return a.Consumer = a;
  };
  react_production_min.createElement = M;
  react_production_min.createFactory = function(a) {
    var b = M.bind(null, a);
    b.type = a;
    return b;
  };
  react_production_min.createRef = function() {
    return { current: null };
  };
  react_production_min.forwardRef = function(a) {
    return { $$typeof: v, render: a };
  };
  react_production_min.isValidElement = O2;
  react_production_min.lazy = function(a) {
    return { $$typeof: y, _payload: { _status: -1, _result: a }, _init: T2 };
  };
  react_production_min.memo = function(a, b) {
    return { $$typeof: x, type: a, compare: void 0 === b ? null : b };
  };
  react_production_min.startTransition = function(a) {
    var b = V.transition;
    V.transition = {};
    try {
      a();
    } finally {
      V.transition = b;
    }
  };
  react_production_min.unstable_act = X2;
  react_production_min.useCallback = function(a, b) {
    return U2.current.useCallback(a, b);
  };
  react_production_min.useContext = function(a) {
    return U2.current.useContext(a);
  };
  react_production_min.useDebugValue = function() {
  };
  react_production_min.useDeferredValue = function(a) {
    return U2.current.useDeferredValue(a);
  };
  react_production_min.useEffect = function(a, b) {
    return U2.current.useEffect(a, b);
  };
  react_production_min.useId = function() {
    return U2.current.useId();
  };
  react_production_min.useImperativeHandle = function(a, b, e) {
    return U2.current.useImperativeHandle(a, b, e);
  };
  react_production_min.useInsertionEffect = function(a, b) {
    return U2.current.useInsertionEffect(a, b);
  };
  react_production_min.useLayoutEffect = function(a, b) {
    return U2.current.useLayoutEffect(a, b);
  };
  react_production_min.useMemo = function(a, b) {
    return U2.current.useMemo(a, b);
  };
  react_production_min.useReducer = function(a, b, e) {
    return U2.current.useReducer(a, b, e);
  };
  react_production_min.useRef = function(a) {
    return U2.current.useRef(a);
  };
  react_production_min.useState = function(a) {
    return U2.current.useState(a);
  };
  react_production_min.useSyncExternalStore = function(a, b, e) {
    return U2.current.useSyncExternalStore(a, b, e);
  };
  react_production_min.useTransition = function() {
    return U2.current.useTransition();
  };
  react_production_min.version = "18.3.1";
  return react_production_min;
}
var hasRequiredReact;
function requireReact() {
  if (hasRequiredReact) return react.exports;
  hasRequiredReact = 1;
  {
    react.exports = requireReact_production_min();
  }
  return react.exports;
}
/**
 * @license React
 * react-jsx-runtime.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var hasRequiredReactJsxRuntime_production_min;
function requireReactJsxRuntime_production_min() {
  if (hasRequiredReactJsxRuntime_production_min) return reactJsxRuntime_production_min;
  hasRequiredReactJsxRuntime_production_min = 1;
  var f = requireReact(), k = Symbol.for("react.element"), l = Symbol.for("react.fragment"), m = Object.prototype.hasOwnProperty, n = f.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner, p = { key: true, ref: true, __self: true, __source: true };
  function q2(c, a, g) {
    var b, d = {}, e = null, h = null;
    void 0 !== g && (e = "" + g);
    void 0 !== a.key && (e = "" + a.key);
    void 0 !== a.ref && (h = a.ref);
    for (b in a) m.call(a, b) && !p.hasOwnProperty(b) && (d[b] = a[b]);
    if (c && c.defaultProps) for (b in a = c.defaultProps, a) void 0 === d[b] && (d[b] = a[b]);
    return { $$typeof: k, type: c, key: e, ref: h, props: d, _owner: n.current };
  }
  reactJsxRuntime_production_min.Fragment = l;
  reactJsxRuntime_production_min.jsx = q2;
  reactJsxRuntime_production_min.jsxs = q2;
  return reactJsxRuntime_production_min;
}
var hasRequiredJsxRuntime;
function requireJsxRuntime() {
  if (hasRequiredJsxRuntime) return jsxRuntime.exports;
  hasRequiredJsxRuntime = 1;
  {
    jsxRuntime.exports = requireReactJsxRuntime_production_min();
  }
  return jsxRuntime.exports;
}
var jsxRuntimeExports = requireJsxRuntime();
var reactExports = requireReact();
const React = /* @__PURE__ */ getDefaultExportFromCjs(reactExports);
var client = {};
var reactDom = { exports: {} };
var reactDom_production_min = {};
var scheduler = { exports: {} };
var scheduler_production_min = {};
/**
 * @license React
 * scheduler.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var hasRequiredScheduler_production_min;
function requireScheduler_production_min() {
  if (hasRequiredScheduler_production_min) return scheduler_production_min;
  hasRequiredScheduler_production_min = 1;
  (function(exports) {
    function f(a, b) {
      var c = a.length;
      a.push(b);
      a: for (; 0 < c; ) {
        var d = c - 1 >>> 1, e = a[d];
        if (0 < g(e, b)) a[d] = b, a[c] = e, c = d;
        else break a;
      }
    }
    function h(a) {
      return 0 === a.length ? null : a[0];
    }
    function k(a) {
      if (0 === a.length) return null;
      var b = a[0], c = a.pop();
      if (c !== b) {
        a[0] = c;
        a: for (var d = 0, e = a.length, w = e >>> 1; d < w; ) {
          var m = 2 * (d + 1) - 1, C2 = a[m], n = m + 1, x = a[n];
          if (0 > g(C2, c)) n < e && 0 > g(x, C2) ? (a[d] = x, a[n] = c, d = n) : (a[d] = C2, a[m] = c, d = m);
          else if (n < e && 0 > g(x, c)) a[d] = x, a[n] = c, d = n;
          else break a;
        }
      }
      return b;
    }
    function g(a, b) {
      var c = a.sortIndex - b.sortIndex;
      return 0 !== c ? c : a.id - b.id;
    }
    if ("object" === typeof performance && "function" === typeof performance.now) {
      var l = performance;
      exports.unstable_now = function() {
        return l.now();
      };
    } else {
      var p = Date, q2 = p.now();
      exports.unstable_now = function() {
        return p.now() - q2;
      };
    }
    var r = [], t = [], u = 1, v = null, y = 3, z = false, A2 = false, B2 = false, D2 = "function" === typeof setTimeout ? setTimeout : null, E = "function" === typeof clearTimeout ? clearTimeout : null, F2 = "undefined" !== typeof setImmediate ? setImmediate : null;
    "undefined" !== typeof navigator && void 0 !== navigator.scheduling && void 0 !== navigator.scheduling.isInputPending && navigator.scheduling.isInputPending.bind(navigator.scheduling);
    function G(a) {
      for (var b = h(t); null !== b; ) {
        if (null === b.callback) k(t);
        else if (b.startTime <= a) k(t), b.sortIndex = b.expirationTime, f(r, b);
        else break;
        b = h(t);
      }
    }
    function H2(a) {
      B2 = false;
      G(a);
      if (!A2) if (null !== h(r)) A2 = true, I2(J2);
      else {
        var b = h(t);
        null !== b && K2(H2, b.startTime - a);
      }
    }
    function J2(a, b) {
      A2 = false;
      B2 && (B2 = false, E(L), L = -1);
      z = true;
      var c = y;
      try {
        G(b);
        for (v = h(r); null !== v && (!(v.expirationTime > b) || a && !M()); ) {
          var d = v.callback;
          if ("function" === typeof d) {
            v.callback = null;
            y = v.priorityLevel;
            var e = d(v.expirationTime <= b);
            b = exports.unstable_now();
            "function" === typeof e ? v.callback = e : v === h(r) && k(r);
            G(b);
          } else k(r);
          v = h(r);
        }
        if (null !== v) var w = true;
        else {
          var m = h(t);
          null !== m && K2(H2, m.startTime - b);
          w = false;
        }
        return w;
      } finally {
        v = null, y = c, z = false;
      }
    }
    var N = false, O2 = null, L = -1, P = 5, Q = -1;
    function M() {
      return exports.unstable_now() - Q < P ? false : true;
    }
    function R() {
      if (null !== O2) {
        var a = exports.unstable_now();
        Q = a;
        var b = true;
        try {
          b = O2(true, a);
        } finally {
          b ? S() : (N = false, O2 = null);
        }
      } else N = false;
    }
    var S;
    if ("function" === typeof F2) S = function() {
      F2(R);
    };
    else if ("undefined" !== typeof MessageChannel) {
      var T2 = new MessageChannel(), U2 = T2.port2;
      T2.port1.onmessage = R;
      S = function() {
        U2.postMessage(null);
      };
    } else S = function() {
      D2(R, 0);
    };
    function I2(a) {
      O2 = a;
      N || (N = true, S());
    }
    function K2(a, b) {
      L = D2(function() {
        a(exports.unstable_now());
      }, b);
    }
    exports.unstable_IdlePriority = 5;
    exports.unstable_ImmediatePriority = 1;
    exports.unstable_LowPriority = 4;
    exports.unstable_NormalPriority = 3;
    exports.unstable_Profiling = null;
    exports.unstable_UserBlockingPriority = 2;
    exports.unstable_cancelCallback = function(a) {
      a.callback = null;
    };
    exports.unstable_continueExecution = function() {
      A2 || z || (A2 = true, I2(J2));
    };
    exports.unstable_forceFrameRate = function(a) {
      0 > a || 125 < a ? console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported") : P = 0 < a ? Math.floor(1e3 / a) : 5;
    };
    exports.unstable_getCurrentPriorityLevel = function() {
      return y;
    };
    exports.unstable_getFirstCallbackNode = function() {
      return h(r);
    };
    exports.unstable_next = function(a) {
      switch (y) {
        case 1:
        case 2:
        case 3:
          var b = 3;
          break;
        default:
          b = y;
      }
      var c = y;
      y = b;
      try {
        return a();
      } finally {
        y = c;
      }
    };
    exports.unstable_pauseExecution = function() {
    };
    exports.unstable_requestPaint = function() {
    };
    exports.unstable_runWithPriority = function(a, b) {
      switch (a) {
        case 1:
        case 2:
        case 3:
        case 4:
        case 5:
          break;
        default:
          a = 3;
      }
      var c = y;
      y = a;
      try {
        return b();
      } finally {
        y = c;
      }
    };
    exports.unstable_scheduleCallback = function(a, b, c) {
      var d = exports.unstable_now();
      "object" === typeof c && null !== c ? (c = c.delay, c = "number" === typeof c && 0 < c ? d + c : d) : c = d;
      switch (a) {
        case 1:
          var e = -1;
          break;
        case 2:
          e = 250;
          break;
        case 5:
          e = 1073741823;
          break;
        case 4:
          e = 1e4;
          break;
        default:
          e = 5e3;
      }
      e = c + e;
      a = { id: u++, callback: b, priorityLevel: a, startTime: c, expirationTime: e, sortIndex: -1 };
      c > d ? (a.sortIndex = c, f(t, a), null === h(r) && a === h(t) && (B2 ? (E(L), L = -1) : B2 = true, K2(H2, c - d))) : (a.sortIndex = e, f(r, a), A2 || z || (A2 = true, I2(J2)));
      return a;
    };
    exports.unstable_shouldYield = M;
    exports.unstable_wrapCallback = function(a) {
      var b = y;
      return function() {
        var c = y;
        y = b;
        try {
          return a.apply(this, arguments);
        } finally {
          y = c;
        }
      };
    };
  })(scheduler_production_min);
  return scheduler_production_min;
}
var hasRequiredScheduler;
function requireScheduler() {
  if (hasRequiredScheduler) return scheduler.exports;
  hasRequiredScheduler = 1;
  {
    scheduler.exports = requireScheduler_production_min();
  }
  return scheduler.exports;
}
/**
 * @license React
 * react-dom.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var hasRequiredReactDom_production_min;
function requireReactDom_production_min() {
  if (hasRequiredReactDom_production_min) return reactDom_production_min;
  hasRequiredReactDom_production_min = 1;
  var aa = requireReact(), ca = requireScheduler();
  function p(a) {
    for (var b = "https://reactjs.org/docs/error-decoder.html?invariant=" + a, c = 1; c < arguments.length; c++) b += "&args[]=" + encodeURIComponent(arguments[c]);
    return "Minified React error #" + a + "; visit " + b + " for the full message or use the non-minified dev environment for full errors and additional helpful warnings.";
  }
  var da = /* @__PURE__ */ new Set(), ea = {};
  function fa(a, b) {
    ha(a, b);
    ha(a + "Capture", b);
  }
  function ha(a, b) {
    ea[a] = b;
    for (a = 0; a < b.length; a++) da.add(b[a]);
  }
  var ia = !("undefined" === typeof window || "undefined" === typeof window.document || "undefined" === typeof window.document.createElement), ja = Object.prototype.hasOwnProperty, ka = /^[:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD][:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\-.0-9\u00B7\u0300-\u036F\u203F-\u2040]*$/, la = {}, ma = {};
  function oa(a) {
    if (ja.call(ma, a)) return true;
    if (ja.call(la, a)) return false;
    if (ka.test(a)) return ma[a] = true;
    la[a] = true;
    return false;
  }
  function pa(a, b, c, d) {
    if (null !== c && 0 === c.type) return false;
    switch (typeof b) {
      case "function":
      case "symbol":
        return true;
      case "boolean":
        if (d) return false;
        if (null !== c) return !c.acceptsBooleans;
        a = a.toLowerCase().slice(0, 5);
        return "data-" !== a && "aria-" !== a;
      default:
        return false;
    }
  }
  function qa(a, b, c, d) {
    if (null === b || "undefined" === typeof b || pa(a, b, c, d)) return true;
    if (d) return false;
    if (null !== c) switch (c.type) {
      case 3:
        return !b;
      case 4:
        return false === b;
      case 5:
        return isNaN(b);
      case 6:
        return isNaN(b) || 1 > b;
    }
    return false;
  }
  function v(a, b, c, d, e, f, g) {
    this.acceptsBooleans = 2 === b || 3 === b || 4 === b;
    this.attributeName = d;
    this.attributeNamespace = e;
    this.mustUseProperty = c;
    this.propertyName = a;
    this.type = b;
    this.sanitizeURL = f;
    this.removeEmptyString = g;
  }
  var z = {};
  "children dangerouslySetInnerHTML defaultValue defaultChecked innerHTML suppressContentEditableWarning suppressHydrationWarning style".split(" ").forEach(function(a) {
    z[a] = new v(a, 0, false, a, null, false, false);
  });
  [["acceptCharset", "accept-charset"], ["className", "class"], ["htmlFor", "for"], ["httpEquiv", "http-equiv"]].forEach(function(a) {
    var b = a[0];
    z[b] = new v(b, 1, false, a[1], null, false, false);
  });
  ["contentEditable", "draggable", "spellCheck", "value"].forEach(function(a) {
    z[a] = new v(a, 2, false, a.toLowerCase(), null, false, false);
  });
  ["autoReverse", "externalResourcesRequired", "focusable", "preserveAlpha"].forEach(function(a) {
    z[a] = new v(a, 2, false, a, null, false, false);
  });
  "allowFullScreen async autoFocus autoPlay controls default defer disabled disablePictureInPicture disableRemotePlayback formNoValidate hidden loop noModule noValidate open playsInline readOnly required reversed scoped seamless itemScope".split(" ").forEach(function(a) {
    z[a] = new v(a, 3, false, a.toLowerCase(), null, false, false);
  });
  ["checked", "multiple", "muted", "selected"].forEach(function(a) {
    z[a] = new v(a, 3, true, a, null, false, false);
  });
  ["capture", "download"].forEach(function(a) {
    z[a] = new v(a, 4, false, a, null, false, false);
  });
  ["cols", "rows", "size", "span"].forEach(function(a) {
    z[a] = new v(a, 6, false, a, null, false, false);
  });
  ["rowSpan", "start"].forEach(function(a) {
    z[a] = new v(a, 5, false, a.toLowerCase(), null, false, false);
  });
  var ra = /[\-:]([a-z])/g;
  function sa(a) {
    return a[1].toUpperCase();
  }
  "accent-height alignment-baseline arabic-form baseline-shift cap-height clip-path clip-rule color-interpolation color-interpolation-filters color-profile color-rendering dominant-baseline enable-background fill-opacity fill-rule flood-color flood-opacity font-family font-size font-size-adjust font-stretch font-style font-variant font-weight glyph-name glyph-orientation-horizontal glyph-orientation-vertical horiz-adv-x horiz-origin-x image-rendering letter-spacing lighting-color marker-end marker-mid marker-start overline-position overline-thickness paint-order panose-1 pointer-events rendering-intent shape-rendering stop-color stop-opacity strikethrough-position strikethrough-thickness stroke-dasharray stroke-dashoffset stroke-linecap stroke-linejoin stroke-miterlimit stroke-opacity stroke-width text-anchor text-decoration text-rendering underline-position underline-thickness unicode-bidi unicode-range units-per-em v-alphabetic v-hanging v-ideographic v-mathematical vector-effect vert-adv-y vert-origin-x vert-origin-y word-spacing writing-mode xmlns:xlink x-height".split(" ").forEach(function(a) {
    var b = a.replace(
      ra,
      sa
    );
    z[b] = new v(b, 1, false, a, null, false, false);
  });
  "xlink:actuate xlink:arcrole xlink:role xlink:show xlink:title xlink:type".split(" ").forEach(function(a) {
    var b = a.replace(ra, sa);
    z[b] = new v(b, 1, false, a, "http://www.w3.org/1999/xlink", false, false);
  });
  ["xml:base", "xml:lang", "xml:space"].forEach(function(a) {
    var b = a.replace(ra, sa);
    z[b] = new v(b, 1, false, a, "http://www.w3.org/XML/1998/namespace", false, false);
  });
  ["tabIndex", "crossOrigin"].forEach(function(a) {
    z[a] = new v(a, 1, false, a.toLowerCase(), null, false, false);
  });
  z.xlinkHref = new v("xlinkHref", 1, false, "xlink:href", "http://www.w3.org/1999/xlink", true, false);
  ["src", "href", "action", "formAction"].forEach(function(a) {
    z[a] = new v(a, 1, false, a.toLowerCase(), null, true, true);
  });
  function ta(a, b, c, d) {
    var e = z.hasOwnProperty(b) ? z[b] : null;
    if (null !== e ? 0 !== e.type : d || !(2 < b.length) || "o" !== b[0] && "O" !== b[0] || "n" !== b[1] && "N" !== b[1]) qa(b, c, e, d) && (c = null), d || null === e ? oa(b) && (null === c ? a.removeAttribute(b) : a.setAttribute(b, "" + c)) : e.mustUseProperty ? a[e.propertyName] = null === c ? 3 === e.type ? false : "" : c : (b = e.attributeName, d = e.attributeNamespace, null === c ? a.removeAttribute(b) : (e = e.type, c = 3 === e || 4 === e && true === c ? "" : "" + c, d ? a.setAttributeNS(d, b, c) : a.setAttribute(b, c)));
  }
  var ua = aa.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED, va = Symbol.for("react.element"), wa = Symbol.for("react.portal"), ya = Symbol.for("react.fragment"), za = Symbol.for("react.strict_mode"), Aa = Symbol.for("react.profiler"), Ba = Symbol.for("react.provider"), Ca = Symbol.for("react.context"), Da = Symbol.for("react.forward_ref"), Ea = Symbol.for("react.suspense"), Fa = Symbol.for("react.suspense_list"), Ga = Symbol.for("react.memo"), Ha = Symbol.for("react.lazy");
  var Ia = Symbol.for("react.offscreen");
  var Ja = Symbol.iterator;
  function Ka(a) {
    if (null === a || "object" !== typeof a) return null;
    a = Ja && a[Ja] || a["@@iterator"];
    return "function" === typeof a ? a : null;
  }
  var A2 = Object.assign, La;
  function Ma(a) {
    if (void 0 === La) try {
      throw Error();
    } catch (c) {
      var b = c.stack.trim().match(/\n( *(at )?)/);
      La = b && b[1] || "";
    }
    return "\n" + La + a;
  }
  var Na = false;
  function Oa(a, b) {
    if (!a || Na) return "";
    Na = true;
    var c = Error.prepareStackTrace;
    Error.prepareStackTrace = void 0;
    try {
      if (b) if (b = function() {
        throw Error();
      }, Object.defineProperty(b.prototype, "props", { set: function() {
        throw Error();
      } }), "object" === typeof Reflect && Reflect.construct) {
        try {
          Reflect.construct(b, []);
        } catch (l) {
          var d = l;
        }
        Reflect.construct(a, [], b);
      } else {
        try {
          b.call();
        } catch (l) {
          d = l;
        }
        a.call(b.prototype);
      }
      else {
        try {
          throw Error();
        } catch (l) {
          d = l;
        }
        a();
      }
    } catch (l) {
      if (l && d && "string" === typeof l.stack) {
        for (var e = l.stack.split("\n"), f = d.stack.split("\n"), g = e.length - 1, h = f.length - 1; 1 <= g && 0 <= h && e[g] !== f[h]; ) h--;
        for (; 1 <= g && 0 <= h; g--, h--) if (e[g] !== f[h]) {
          if (1 !== g || 1 !== h) {
            do
              if (g--, h--, 0 > h || e[g] !== f[h]) {
                var k = "\n" + e[g].replace(" at new ", " at ");
                a.displayName && k.includes("<anonymous>") && (k = k.replace("<anonymous>", a.displayName));
                return k;
              }
            while (1 <= g && 0 <= h);
          }
          break;
        }
      }
    } finally {
      Na = false, Error.prepareStackTrace = c;
    }
    return (a = a ? a.displayName || a.name : "") ? Ma(a) : "";
  }
  function Pa(a) {
    switch (a.tag) {
      case 5:
        return Ma(a.type);
      case 16:
        return Ma("Lazy");
      case 13:
        return Ma("Suspense");
      case 19:
        return Ma("SuspenseList");
      case 0:
      case 2:
      case 15:
        return a = Oa(a.type, false), a;
      case 11:
        return a = Oa(a.type.render, false), a;
      case 1:
        return a = Oa(a.type, true), a;
      default:
        return "";
    }
  }
  function Qa(a) {
    if (null == a) return null;
    if ("function" === typeof a) return a.displayName || a.name || null;
    if ("string" === typeof a) return a;
    switch (a) {
      case ya:
        return "Fragment";
      case wa:
        return "Portal";
      case Aa:
        return "Profiler";
      case za:
        return "StrictMode";
      case Ea:
        return "Suspense";
      case Fa:
        return "SuspenseList";
    }
    if ("object" === typeof a) switch (a.$$typeof) {
      case Ca:
        return (a.displayName || "Context") + ".Consumer";
      case Ba:
        return (a._context.displayName || "Context") + ".Provider";
      case Da:
        var b = a.render;
        a = a.displayName;
        a || (a = b.displayName || b.name || "", a = "" !== a ? "ForwardRef(" + a + ")" : "ForwardRef");
        return a;
      case Ga:
        return b = a.displayName || null, null !== b ? b : Qa(a.type) || "Memo";
      case Ha:
        b = a._payload;
        a = a._init;
        try {
          return Qa(a(b));
        } catch (c) {
        }
    }
    return null;
  }
  function Ra(a) {
    var b = a.type;
    switch (a.tag) {
      case 24:
        return "Cache";
      case 9:
        return (b.displayName || "Context") + ".Consumer";
      case 10:
        return (b._context.displayName || "Context") + ".Provider";
      case 18:
        return "DehydratedFragment";
      case 11:
        return a = b.render, a = a.displayName || a.name || "", b.displayName || ("" !== a ? "ForwardRef(" + a + ")" : "ForwardRef");
      case 7:
        return "Fragment";
      case 5:
        return b;
      case 4:
        return "Portal";
      case 3:
        return "Root";
      case 6:
        return "Text";
      case 16:
        return Qa(b);
      case 8:
        return b === za ? "StrictMode" : "Mode";
      case 22:
        return "Offscreen";
      case 12:
        return "Profiler";
      case 21:
        return "Scope";
      case 13:
        return "Suspense";
      case 19:
        return "SuspenseList";
      case 25:
        return "TracingMarker";
      case 1:
      case 0:
      case 17:
      case 2:
      case 14:
      case 15:
        if ("function" === typeof b) return b.displayName || b.name || null;
        if ("string" === typeof b) return b;
    }
    return null;
  }
  function Sa(a) {
    switch (typeof a) {
      case "boolean":
      case "number":
      case "string":
      case "undefined":
        return a;
      case "object":
        return a;
      default:
        return "";
    }
  }
  function Ta(a) {
    var b = a.type;
    return (a = a.nodeName) && "input" === a.toLowerCase() && ("checkbox" === b || "radio" === b);
  }
  function Ua(a) {
    var b = Ta(a) ? "checked" : "value", c = Object.getOwnPropertyDescriptor(a.constructor.prototype, b), d = "" + a[b];
    if (!a.hasOwnProperty(b) && "undefined" !== typeof c && "function" === typeof c.get && "function" === typeof c.set) {
      var e = c.get, f = c.set;
      Object.defineProperty(a, b, { configurable: true, get: function() {
        return e.call(this);
      }, set: function(a2) {
        d = "" + a2;
        f.call(this, a2);
      } });
      Object.defineProperty(a, b, { enumerable: c.enumerable });
      return { getValue: function() {
        return d;
      }, setValue: function(a2) {
        d = "" + a2;
      }, stopTracking: function() {
        a._valueTracker = null;
        delete a[b];
      } };
    }
  }
  function Va(a) {
    a._valueTracker || (a._valueTracker = Ua(a));
  }
  function Wa(a) {
    if (!a) return false;
    var b = a._valueTracker;
    if (!b) return true;
    var c = b.getValue();
    var d = "";
    a && (d = Ta(a) ? a.checked ? "true" : "false" : a.value);
    a = d;
    return a !== c ? (b.setValue(a), true) : false;
  }
  function Xa(a) {
    a = a || ("undefined" !== typeof document ? document : void 0);
    if ("undefined" === typeof a) return null;
    try {
      return a.activeElement || a.body;
    } catch (b) {
      return a.body;
    }
  }
  function Ya(a, b) {
    var c = b.checked;
    return A2({}, b, { defaultChecked: void 0, defaultValue: void 0, value: void 0, checked: null != c ? c : a._wrapperState.initialChecked });
  }
  function Za(a, b) {
    var c = null == b.defaultValue ? "" : b.defaultValue, d = null != b.checked ? b.checked : b.defaultChecked;
    c = Sa(null != b.value ? b.value : c);
    a._wrapperState = { initialChecked: d, initialValue: c, controlled: "checkbox" === b.type || "radio" === b.type ? null != b.checked : null != b.value };
  }
  function ab(a, b) {
    b = b.checked;
    null != b && ta(a, "checked", b, false);
  }
  function bb(a, b) {
    ab(a, b);
    var c = Sa(b.value), d = b.type;
    if (null != c) if ("number" === d) {
      if (0 === c && "" === a.value || a.value != c) a.value = "" + c;
    } else a.value !== "" + c && (a.value = "" + c);
    else if ("submit" === d || "reset" === d) {
      a.removeAttribute("value");
      return;
    }
    b.hasOwnProperty("value") ? cb(a, b.type, c) : b.hasOwnProperty("defaultValue") && cb(a, b.type, Sa(b.defaultValue));
    null == b.checked && null != b.defaultChecked && (a.defaultChecked = !!b.defaultChecked);
  }
  function db(a, b, c) {
    if (b.hasOwnProperty("value") || b.hasOwnProperty("defaultValue")) {
      var d = b.type;
      if (!("submit" !== d && "reset" !== d || void 0 !== b.value && null !== b.value)) return;
      b = "" + a._wrapperState.initialValue;
      c || b === a.value || (a.value = b);
      a.defaultValue = b;
    }
    c = a.name;
    "" !== c && (a.name = "");
    a.defaultChecked = !!a._wrapperState.initialChecked;
    "" !== c && (a.name = c);
  }
  function cb(a, b, c) {
    if ("number" !== b || Xa(a.ownerDocument) !== a) null == c ? a.defaultValue = "" + a._wrapperState.initialValue : a.defaultValue !== "" + c && (a.defaultValue = "" + c);
  }
  var eb = Array.isArray;
  function fb(a, b, c, d) {
    a = a.options;
    if (b) {
      b = {};
      for (var e = 0; e < c.length; e++) b["$" + c[e]] = true;
      for (c = 0; c < a.length; c++) e = b.hasOwnProperty("$" + a[c].value), a[c].selected !== e && (a[c].selected = e), e && d && (a[c].defaultSelected = true);
    } else {
      c = "" + Sa(c);
      b = null;
      for (e = 0; e < a.length; e++) {
        if (a[e].value === c) {
          a[e].selected = true;
          d && (a[e].defaultSelected = true);
          return;
        }
        null !== b || a[e].disabled || (b = a[e]);
      }
      null !== b && (b.selected = true);
    }
  }
  function gb(a, b) {
    if (null != b.dangerouslySetInnerHTML) throw Error(p(91));
    return A2({}, b, { value: void 0, defaultValue: void 0, children: "" + a._wrapperState.initialValue });
  }
  function hb(a, b) {
    var c = b.value;
    if (null == c) {
      c = b.children;
      b = b.defaultValue;
      if (null != c) {
        if (null != b) throw Error(p(92));
        if (eb(c)) {
          if (1 < c.length) throw Error(p(93));
          c = c[0];
        }
        b = c;
      }
      null == b && (b = "");
      c = b;
    }
    a._wrapperState = { initialValue: Sa(c) };
  }
  function ib(a, b) {
    var c = Sa(b.value), d = Sa(b.defaultValue);
    null != c && (c = "" + c, c !== a.value && (a.value = c), null == b.defaultValue && a.defaultValue !== c && (a.defaultValue = c));
    null != d && (a.defaultValue = "" + d);
  }
  function jb(a) {
    var b = a.textContent;
    b === a._wrapperState.initialValue && "" !== b && null !== b && (a.value = b);
  }
  function kb(a) {
    switch (a) {
      case "svg":
        return "http://www.w3.org/2000/svg";
      case "math":
        return "http://www.w3.org/1998/Math/MathML";
      default:
        return "http://www.w3.org/1999/xhtml";
    }
  }
  function lb(a, b) {
    return null == a || "http://www.w3.org/1999/xhtml" === a ? kb(b) : "http://www.w3.org/2000/svg" === a && "foreignObject" === b ? "http://www.w3.org/1999/xhtml" : a;
  }
  var mb, nb = (function(a) {
    return "undefined" !== typeof MSApp && MSApp.execUnsafeLocalFunction ? function(b, c, d, e) {
      MSApp.execUnsafeLocalFunction(function() {
        return a(b, c, d, e);
      });
    } : a;
  })(function(a, b) {
    if ("http://www.w3.org/2000/svg" !== a.namespaceURI || "innerHTML" in a) a.innerHTML = b;
    else {
      mb = mb || document.createElement("div");
      mb.innerHTML = "<svg>" + b.valueOf().toString() + "</svg>";
      for (b = mb.firstChild; a.firstChild; ) a.removeChild(a.firstChild);
      for (; b.firstChild; ) a.appendChild(b.firstChild);
    }
  });
  function ob(a, b) {
    if (b) {
      var c = a.firstChild;
      if (c && c === a.lastChild && 3 === c.nodeType) {
        c.nodeValue = b;
        return;
      }
    }
    a.textContent = b;
  }
  var pb = {
    animationIterationCount: true,
    aspectRatio: true,
    borderImageOutset: true,
    borderImageSlice: true,
    borderImageWidth: true,
    boxFlex: true,
    boxFlexGroup: true,
    boxOrdinalGroup: true,
    columnCount: true,
    columns: true,
    flex: true,
    flexGrow: true,
    flexPositive: true,
    flexShrink: true,
    flexNegative: true,
    flexOrder: true,
    gridArea: true,
    gridRow: true,
    gridRowEnd: true,
    gridRowSpan: true,
    gridRowStart: true,
    gridColumn: true,
    gridColumnEnd: true,
    gridColumnSpan: true,
    gridColumnStart: true,
    fontWeight: true,
    lineClamp: true,
    lineHeight: true,
    opacity: true,
    order: true,
    orphans: true,
    tabSize: true,
    widows: true,
    zIndex: true,
    zoom: true,
    fillOpacity: true,
    floodOpacity: true,
    stopOpacity: true,
    strokeDasharray: true,
    strokeDashoffset: true,
    strokeMiterlimit: true,
    strokeOpacity: true,
    strokeWidth: true
  }, qb = ["Webkit", "ms", "Moz", "O"];
  Object.keys(pb).forEach(function(a) {
    qb.forEach(function(b) {
      b = b + a.charAt(0).toUpperCase() + a.substring(1);
      pb[b] = pb[a];
    });
  });
  function rb(a, b, c) {
    return null == b || "boolean" === typeof b || "" === b ? "" : c || "number" !== typeof b || 0 === b || pb.hasOwnProperty(a) && pb[a] ? ("" + b).trim() : b + "px";
  }
  function sb(a, b) {
    a = a.style;
    for (var c in b) if (b.hasOwnProperty(c)) {
      var d = 0 === c.indexOf("--"), e = rb(c, b[c], d);
      "float" === c && (c = "cssFloat");
      d ? a.setProperty(c, e) : a[c] = e;
    }
  }
  var tb = A2({ menuitem: true }, { area: true, base: true, br: true, col: true, embed: true, hr: true, img: true, input: true, keygen: true, link: true, meta: true, param: true, source: true, track: true, wbr: true });
  function ub(a, b) {
    if (b) {
      if (tb[a] && (null != b.children || null != b.dangerouslySetInnerHTML)) throw Error(p(137, a));
      if (null != b.dangerouslySetInnerHTML) {
        if (null != b.children) throw Error(p(60));
        if ("object" !== typeof b.dangerouslySetInnerHTML || !("__html" in b.dangerouslySetInnerHTML)) throw Error(p(61));
      }
      if (null != b.style && "object" !== typeof b.style) throw Error(p(62));
    }
  }
  function vb(a, b) {
    if (-1 === a.indexOf("-")) return "string" === typeof b.is;
    switch (a) {
      case "annotation-xml":
      case "color-profile":
      case "font-face":
      case "font-face-src":
      case "font-face-uri":
      case "font-face-format":
      case "font-face-name":
      case "missing-glyph":
        return false;
      default:
        return true;
    }
  }
  var wb = null;
  function xb(a) {
    a = a.target || a.srcElement || window;
    a.correspondingUseElement && (a = a.correspondingUseElement);
    return 3 === a.nodeType ? a.parentNode : a;
  }
  var yb = null, zb = null, Ab = null;
  function Bb(a) {
    if (a = Cb(a)) {
      if ("function" !== typeof yb) throw Error(p(280));
      var b = a.stateNode;
      b && (b = Db(b), yb(a.stateNode, a.type, b));
    }
  }
  function Eb(a) {
    zb ? Ab ? Ab.push(a) : Ab = [a] : zb = a;
  }
  function Fb() {
    if (zb) {
      var a = zb, b = Ab;
      Ab = zb = null;
      Bb(a);
      if (b) for (a = 0; a < b.length; a++) Bb(b[a]);
    }
  }
  function Gb(a, b) {
    return a(b);
  }
  function Hb() {
  }
  var Ib = false;
  function Jb(a, b, c) {
    if (Ib) return a(b, c);
    Ib = true;
    try {
      return Gb(a, b, c);
    } finally {
      if (Ib = false, null !== zb || null !== Ab) Hb(), Fb();
    }
  }
  function Kb(a, b) {
    var c = a.stateNode;
    if (null === c) return null;
    var d = Db(c);
    if (null === d) return null;
    c = d[b];
    a: switch (b) {
      case "onClick":
      case "onClickCapture":
      case "onDoubleClick":
      case "onDoubleClickCapture":
      case "onMouseDown":
      case "onMouseDownCapture":
      case "onMouseMove":
      case "onMouseMoveCapture":
      case "onMouseUp":
      case "onMouseUpCapture":
      case "onMouseEnter":
        (d = !d.disabled) || (a = a.type, d = !("button" === a || "input" === a || "select" === a || "textarea" === a));
        a = !d;
        break a;
      default:
        a = false;
    }
    if (a) return null;
    if (c && "function" !== typeof c) throw Error(p(231, b, typeof c));
    return c;
  }
  var Lb = false;
  if (ia) try {
    var Mb = {};
    Object.defineProperty(Mb, "passive", { get: function() {
      Lb = true;
    } });
    window.addEventListener("test", Mb, Mb);
    window.removeEventListener("test", Mb, Mb);
  } catch (a) {
    Lb = false;
  }
  function Nb(a, b, c, d, e, f, g, h, k) {
    var l = Array.prototype.slice.call(arguments, 3);
    try {
      b.apply(c, l);
    } catch (m) {
      this.onError(m);
    }
  }
  var Ob = false, Pb = null, Qb = false, Rb = null, Sb = { onError: function(a) {
    Ob = true;
    Pb = a;
  } };
  function Tb(a, b, c, d, e, f, g, h, k) {
    Ob = false;
    Pb = null;
    Nb.apply(Sb, arguments);
  }
  function Ub(a, b, c, d, e, f, g, h, k) {
    Tb.apply(this, arguments);
    if (Ob) {
      if (Ob) {
        var l = Pb;
        Ob = false;
        Pb = null;
      } else throw Error(p(198));
      Qb || (Qb = true, Rb = l);
    }
  }
  function Vb(a) {
    var b = a, c = a;
    if (a.alternate) for (; b.return; ) b = b.return;
    else {
      a = b;
      do
        b = a, 0 !== (b.flags & 4098) && (c = b.return), a = b.return;
      while (a);
    }
    return 3 === b.tag ? c : null;
  }
  function Wb(a) {
    if (13 === a.tag) {
      var b = a.memoizedState;
      null === b && (a = a.alternate, null !== a && (b = a.memoizedState));
      if (null !== b) return b.dehydrated;
    }
    return null;
  }
  function Xb(a) {
    if (Vb(a) !== a) throw Error(p(188));
  }
  function Yb(a) {
    var b = a.alternate;
    if (!b) {
      b = Vb(a);
      if (null === b) throw Error(p(188));
      return b !== a ? null : a;
    }
    for (var c = a, d = b; ; ) {
      var e = c.return;
      if (null === e) break;
      var f = e.alternate;
      if (null === f) {
        d = e.return;
        if (null !== d) {
          c = d;
          continue;
        }
        break;
      }
      if (e.child === f.child) {
        for (f = e.child; f; ) {
          if (f === c) return Xb(e), a;
          if (f === d) return Xb(e), b;
          f = f.sibling;
        }
        throw Error(p(188));
      }
      if (c.return !== d.return) c = e, d = f;
      else {
        for (var g = false, h = e.child; h; ) {
          if (h === c) {
            g = true;
            c = e;
            d = f;
            break;
          }
          if (h === d) {
            g = true;
            d = e;
            c = f;
            break;
          }
          h = h.sibling;
        }
        if (!g) {
          for (h = f.child; h; ) {
            if (h === c) {
              g = true;
              c = f;
              d = e;
              break;
            }
            if (h === d) {
              g = true;
              d = f;
              c = e;
              break;
            }
            h = h.sibling;
          }
          if (!g) throw Error(p(189));
        }
      }
      if (c.alternate !== d) throw Error(p(190));
    }
    if (3 !== c.tag) throw Error(p(188));
    return c.stateNode.current === c ? a : b;
  }
  function Zb(a) {
    a = Yb(a);
    return null !== a ? $b(a) : null;
  }
  function $b(a) {
    if (5 === a.tag || 6 === a.tag) return a;
    for (a = a.child; null !== a; ) {
      var b = $b(a);
      if (null !== b) return b;
      a = a.sibling;
    }
    return null;
  }
  var ac = ca.unstable_scheduleCallback, bc = ca.unstable_cancelCallback, cc = ca.unstable_shouldYield, dc = ca.unstable_requestPaint, B2 = ca.unstable_now, ec = ca.unstable_getCurrentPriorityLevel, fc = ca.unstable_ImmediatePriority, gc = ca.unstable_UserBlockingPriority, hc = ca.unstable_NormalPriority, ic = ca.unstable_LowPriority, jc = ca.unstable_IdlePriority, kc = null, lc = null;
  function mc(a) {
    if (lc && "function" === typeof lc.onCommitFiberRoot) try {
      lc.onCommitFiberRoot(kc, a, void 0, 128 === (a.current.flags & 128));
    } catch (b) {
    }
  }
  var oc = Math.clz32 ? Math.clz32 : nc, pc = Math.log, qc = Math.LN2;
  function nc(a) {
    a >>>= 0;
    return 0 === a ? 32 : 31 - (pc(a) / qc | 0) | 0;
  }
  var rc = 64, sc = 4194304;
  function tc(a) {
    switch (a & -a) {
      case 1:
        return 1;
      case 2:
        return 2;
      case 4:
        return 4;
      case 8:
        return 8;
      case 16:
        return 16;
      case 32:
        return 32;
      case 64:
      case 128:
      case 256:
      case 512:
      case 1024:
      case 2048:
      case 4096:
      case 8192:
      case 16384:
      case 32768:
      case 65536:
      case 131072:
      case 262144:
      case 524288:
      case 1048576:
      case 2097152:
        return a & 4194240;
      case 4194304:
      case 8388608:
      case 16777216:
      case 33554432:
      case 67108864:
        return a & 130023424;
      case 134217728:
        return 134217728;
      case 268435456:
        return 268435456;
      case 536870912:
        return 536870912;
      case 1073741824:
        return 1073741824;
      default:
        return a;
    }
  }
  function uc(a, b) {
    var c = a.pendingLanes;
    if (0 === c) return 0;
    var d = 0, e = a.suspendedLanes, f = a.pingedLanes, g = c & 268435455;
    if (0 !== g) {
      var h = g & ~e;
      0 !== h ? d = tc(h) : (f &= g, 0 !== f && (d = tc(f)));
    } else g = c & ~e, 0 !== g ? d = tc(g) : 0 !== f && (d = tc(f));
    if (0 === d) return 0;
    if (0 !== b && b !== d && 0 === (b & e) && (e = d & -d, f = b & -b, e >= f || 16 === e && 0 !== (f & 4194240))) return b;
    0 !== (d & 4) && (d |= c & 16);
    b = a.entangledLanes;
    if (0 !== b) for (a = a.entanglements, b &= d; 0 < b; ) c = 31 - oc(b), e = 1 << c, d |= a[c], b &= ~e;
    return d;
  }
  function vc(a, b) {
    switch (a) {
      case 1:
      case 2:
      case 4:
        return b + 250;
      case 8:
      case 16:
      case 32:
      case 64:
      case 128:
      case 256:
      case 512:
      case 1024:
      case 2048:
      case 4096:
      case 8192:
      case 16384:
      case 32768:
      case 65536:
      case 131072:
      case 262144:
      case 524288:
      case 1048576:
      case 2097152:
        return b + 5e3;
      case 4194304:
      case 8388608:
      case 16777216:
      case 33554432:
      case 67108864:
        return -1;
      case 134217728:
      case 268435456:
      case 536870912:
      case 1073741824:
        return -1;
      default:
        return -1;
    }
  }
  function wc(a, b) {
    for (var c = a.suspendedLanes, d = a.pingedLanes, e = a.expirationTimes, f = a.pendingLanes; 0 < f; ) {
      var g = 31 - oc(f), h = 1 << g, k = e[g];
      if (-1 === k) {
        if (0 === (h & c) || 0 !== (h & d)) e[g] = vc(h, b);
      } else k <= b && (a.expiredLanes |= h);
      f &= ~h;
    }
  }
  function xc(a) {
    a = a.pendingLanes & -1073741825;
    return 0 !== a ? a : a & 1073741824 ? 1073741824 : 0;
  }
  function yc() {
    var a = rc;
    rc <<= 1;
    0 === (rc & 4194240) && (rc = 64);
    return a;
  }
  function zc(a) {
    for (var b = [], c = 0; 31 > c; c++) b.push(a);
    return b;
  }
  function Ac(a, b, c) {
    a.pendingLanes |= b;
    536870912 !== b && (a.suspendedLanes = 0, a.pingedLanes = 0);
    a = a.eventTimes;
    b = 31 - oc(b);
    a[b] = c;
  }
  function Bc(a, b) {
    var c = a.pendingLanes & ~b;
    a.pendingLanes = b;
    a.suspendedLanes = 0;
    a.pingedLanes = 0;
    a.expiredLanes &= b;
    a.mutableReadLanes &= b;
    a.entangledLanes &= b;
    b = a.entanglements;
    var d = a.eventTimes;
    for (a = a.expirationTimes; 0 < c; ) {
      var e = 31 - oc(c), f = 1 << e;
      b[e] = 0;
      d[e] = -1;
      a[e] = -1;
      c &= ~f;
    }
  }
  function Cc(a, b) {
    var c = a.entangledLanes |= b;
    for (a = a.entanglements; c; ) {
      var d = 31 - oc(c), e = 1 << d;
      e & b | a[d] & b && (a[d] |= b);
      c &= ~e;
    }
  }
  var C2 = 0;
  function Dc(a) {
    a &= -a;
    return 1 < a ? 4 < a ? 0 !== (a & 268435455) ? 16 : 536870912 : 4 : 1;
  }
  var Ec, Fc, Gc, Hc, Ic, Jc = false, Kc = [], Lc = null, Mc = null, Nc = null, Oc = /* @__PURE__ */ new Map(), Pc = /* @__PURE__ */ new Map(), Qc = [], Rc = "mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset submit".split(" ");
  function Sc(a, b) {
    switch (a) {
      case "focusin":
      case "focusout":
        Lc = null;
        break;
      case "dragenter":
      case "dragleave":
        Mc = null;
        break;
      case "mouseover":
      case "mouseout":
        Nc = null;
        break;
      case "pointerover":
      case "pointerout":
        Oc.delete(b.pointerId);
        break;
      case "gotpointercapture":
      case "lostpointercapture":
        Pc.delete(b.pointerId);
    }
  }
  function Tc(a, b, c, d, e, f) {
    if (null === a || a.nativeEvent !== f) return a = { blockedOn: b, domEventName: c, eventSystemFlags: d, nativeEvent: f, targetContainers: [e] }, null !== b && (b = Cb(b), null !== b && Fc(b)), a;
    a.eventSystemFlags |= d;
    b = a.targetContainers;
    null !== e && -1 === b.indexOf(e) && b.push(e);
    return a;
  }
  function Uc(a, b, c, d, e) {
    switch (b) {
      case "focusin":
        return Lc = Tc(Lc, a, b, c, d, e), true;
      case "dragenter":
        return Mc = Tc(Mc, a, b, c, d, e), true;
      case "mouseover":
        return Nc = Tc(Nc, a, b, c, d, e), true;
      case "pointerover":
        var f = e.pointerId;
        Oc.set(f, Tc(Oc.get(f) || null, a, b, c, d, e));
        return true;
      case "gotpointercapture":
        return f = e.pointerId, Pc.set(f, Tc(Pc.get(f) || null, a, b, c, d, e)), true;
    }
    return false;
  }
  function Vc(a) {
    var b = Wc(a.target);
    if (null !== b) {
      var c = Vb(b);
      if (null !== c) {
        if (b = c.tag, 13 === b) {
          if (b = Wb(c), null !== b) {
            a.blockedOn = b;
            Ic(a.priority, function() {
              Gc(c);
            });
            return;
          }
        } else if (3 === b && c.stateNode.current.memoizedState.isDehydrated) {
          a.blockedOn = 3 === c.tag ? c.stateNode.containerInfo : null;
          return;
        }
      }
    }
    a.blockedOn = null;
  }
  function Xc(a) {
    if (null !== a.blockedOn) return false;
    for (var b = a.targetContainers; 0 < b.length; ) {
      var c = Yc(a.domEventName, a.eventSystemFlags, b[0], a.nativeEvent);
      if (null === c) {
        c = a.nativeEvent;
        var d = new c.constructor(c.type, c);
        wb = d;
        c.target.dispatchEvent(d);
        wb = null;
      } else return b = Cb(c), null !== b && Fc(b), a.blockedOn = c, false;
      b.shift();
    }
    return true;
  }
  function Zc(a, b, c) {
    Xc(a) && c.delete(b);
  }
  function $c() {
    Jc = false;
    null !== Lc && Xc(Lc) && (Lc = null);
    null !== Mc && Xc(Mc) && (Mc = null);
    null !== Nc && Xc(Nc) && (Nc = null);
    Oc.forEach(Zc);
    Pc.forEach(Zc);
  }
  function ad(a, b) {
    a.blockedOn === b && (a.blockedOn = null, Jc || (Jc = true, ca.unstable_scheduleCallback(ca.unstable_NormalPriority, $c)));
  }
  function bd(a) {
    function b(b2) {
      return ad(b2, a);
    }
    if (0 < Kc.length) {
      ad(Kc[0], a);
      for (var c = 1; c < Kc.length; c++) {
        var d = Kc[c];
        d.blockedOn === a && (d.blockedOn = null);
      }
    }
    null !== Lc && ad(Lc, a);
    null !== Mc && ad(Mc, a);
    null !== Nc && ad(Nc, a);
    Oc.forEach(b);
    Pc.forEach(b);
    for (c = 0; c < Qc.length; c++) d = Qc[c], d.blockedOn === a && (d.blockedOn = null);
    for (; 0 < Qc.length && (c = Qc[0], null === c.blockedOn); ) Vc(c), null === c.blockedOn && Qc.shift();
  }
  var cd = ua.ReactCurrentBatchConfig, dd = true;
  function ed(a, b, c, d) {
    var e = C2, f = cd.transition;
    cd.transition = null;
    try {
      C2 = 1, fd(a, b, c, d);
    } finally {
      C2 = e, cd.transition = f;
    }
  }
  function gd(a, b, c, d) {
    var e = C2, f = cd.transition;
    cd.transition = null;
    try {
      C2 = 4, fd(a, b, c, d);
    } finally {
      C2 = e, cd.transition = f;
    }
  }
  function fd(a, b, c, d) {
    if (dd) {
      var e = Yc(a, b, c, d);
      if (null === e) hd(a, b, d, id, c), Sc(a, d);
      else if (Uc(e, a, b, c, d)) d.stopPropagation();
      else if (Sc(a, d), b & 4 && -1 < Rc.indexOf(a)) {
        for (; null !== e; ) {
          var f = Cb(e);
          null !== f && Ec(f);
          f = Yc(a, b, c, d);
          null === f && hd(a, b, d, id, c);
          if (f === e) break;
          e = f;
        }
        null !== e && d.stopPropagation();
      } else hd(a, b, d, null, c);
    }
  }
  var id = null;
  function Yc(a, b, c, d) {
    id = null;
    a = xb(d);
    a = Wc(a);
    if (null !== a) if (b = Vb(a), null === b) a = null;
    else if (c = b.tag, 13 === c) {
      a = Wb(b);
      if (null !== a) return a;
      a = null;
    } else if (3 === c) {
      if (b.stateNode.current.memoizedState.isDehydrated) return 3 === b.tag ? b.stateNode.containerInfo : null;
      a = null;
    } else b !== a && (a = null);
    id = a;
    return null;
  }
  function jd(a) {
    switch (a) {
      case "cancel":
      case "click":
      case "close":
      case "contextmenu":
      case "copy":
      case "cut":
      case "auxclick":
      case "dblclick":
      case "dragend":
      case "dragstart":
      case "drop":
      case "focusin":
      case "focusout":
      case "input":
      case "invalid":
      case "keydown":
      case "keypress":
      case "keyup":
      case "mousedown":
      case "mouseup":
      case "paste":
      case "pause":
      case "play":
      case "pointercancel":
      case "pointerdown":
      case "pointerup":
      case "ratechange":
      case "reset":
      case "resize":
      case "seeked":
      case "submit":
      case "touchcancel":
      case "touchend":
      case "touchstart":
      case "volumechange":
      case "change":
      case "selectionchange":
      case "textInput":
      case "compositionstart":
      case "compositionend":
      case "compositionupdate":
      case "beforeblur":
      case "afterblur":
      case "beforeinput":
      case "blur":
      case "fullscreenchange":
      case "focus":
      case "hashchange":
      case "popstate":
      case "select":
      case "selectstart":
        return 1;
      case "drag":
      case "dragenter":
      case "dragexit":
      case "dragleave":
      case "dragover":
      case "mousemove":
      case "mouseout":
      case "mouseover":
      case "pointermove":
      case "pointerout":
      case "pointerover":
      case "scroll":
      case "toggle":
      case "touchmove":
      case "wheel":
      case "mouseenter":
      case "mouseleave":
      case "pointerenter":
      case "pointerleave":
        return 4;
      case "message":
        switch (ec()) {
          case fc:
            return 1;
          case gc:
            return 4;
          case hc:
          case ic:
            return 16;
          case jc:
            return 536870912;
          default:
            return 16;
        }
      default:
        return 16;
    }
  }
  var kd = null, ld = null, md = null;
  function nd() {
    if (md) return md;
    var a, b = ld, c = b.length, d, e = "value" in kd ? kd.value : kd.textContent, f = e.length;
    for (a = 0; a < c && b[a] === e[a]; a++) ;
    var g = c - a;
    for (d = 1; d <= g && b[c - d] === e[f - d]; d++) ;
    return md = e.slice(a, 1 < d ? 1 - d : void 0);
  }
  function od(a) {
    var b = a.keyCode;
    "charCode" in a ? (a = a.charCode, 0 === a && 13 === b && (a = 13)) : a = b;
    10 === a && (a = 13);
    return 32 <= a || 13 === a ? a : 0;
  }
  function pd() {
    return true;
  }
  function qd() {
    return false;
  }
  function rd(a) {
    function b(b2, d, e, f, g) {
      this._reactName = b2;
      this._targetInst = e;
      this.type = d;
      this.nativeEvent = f;
      this.target = g;
      this.currentTarget = null;
      for (var c in a) a.hasOwnProperty(c) && (b2 = a[c], this[c] = b2 ? b2(f) : f[c]);
      this.isDefaultPrevented = (null != f.defaultPrevented ? f.defaultPrevented : false === f.returnValue) ? pd : qd;
      this.isPropagationStopped = qd;
      return this;
    }
    A2(b.prototype, { preventDefault: function() {
      this.defaultPrevented = true;
      var a2 = this.nativeEvent;
      a2 && (a2.preventDefault ? a2.preventDefault() : "unknown" !== typeof a2.returnValue && (a2.returnValue = false), this.isDefaultPrevented = pd);
    }, stopPropagation: function() {
      var a2 = this.nativeEvent;
      a2 && (a2.stopPropagation ? a2.stopPropagation() : "unknown" !== typeof a2.cancelBubble && (a2.cancelBubble = true), this.isPropagationStopped = pd);
    }, persist: function() {
    }, isPersistent: pd });
    return b;
  }
  var sd = { eventPhase: 0, bubbles: 0, cancelable: 0, timeStamp: function(a) {
    return a.timeStamp || Date.now();
  }, defaultPrevented: 0, isTrusted: 0 }, td = rd(sd), ud = A2({}, sd, { view: 0, detail: 0 }), vd = rd(ud), wd, xd, yd, Ad = A2({}, ud, { screenX: 0, screenY: 0, clientX: 0, clientY: 0, pageX: 0, pageY: 0, ctrlKey: 0, shiftKey: 0, altKey: 0, metaKey: 0, getModifierState: zd, button: 0, buttons: 0, relatedTarget: function(a) {
    return void 0 === a.relatedTarget ? a.fromElement === a.srcElement ? a.toElement : a.fromElement : a.relatedTarget;
  }, movementX: function(a) {
    if ("movementX" in a) return a.movementX;
    a !== yd && (yd && "mousemove" === a.type ? (wd = a.screenX - yd.screenX, xd = a.screenY - yd.screenY) : xd = wd = 0, yd = a);
    return wd;
  }, movementY: function(a) {
    return "movementY" in a ? a.movementY : xd;
  } }), Bd = rd(Ad), Cd = A2({}, Ad, { dataTransfer: 0 }), Dd = rd(Cd), Ed = A2({}, ud, { relatedTarget: 0 }), Fd = rd(Ed), Gd = A2({}, sd, { animationName: 0, elapsedTime: 0, pseudoElement: 0 }), Hd = rd(Gd), Id = A2({}, sd, { clipboardData: function(a) {
    return "clipboardData" in a ? a.clipboardData : window.clipboardData;
  } }), Jd = rd(Id), Kd = A2({}, sd, { data: 0 }), Ld = rd(Kd), Md = {
    Esc: "Escape",
    Spacebar: " ",
    Left: "ArrowLeft",
    Up: "ArrowUp",
    Right: "ArrowRight",
    Down: "ArrowDown",
    Del: "Delete",
    Win: "OS",
    Menu: "ContextMenu",
    Apps: "ContextMenu",
    Scroll: "ScrollLock",
    MozPrintableKey: "Unidentified"
  }, Nd = {
    8: "Backspace",
    9: "Tab",
    12: "Clear",
    13: "Enter",
    16: "Shift",
    17: "Control",
    18: "Alt",
    19: "Pause",
    20: "CapsLock",
    27: "Escape",
    32: " ",
    33: "PageUp",
    34: "PageDown",
    35: "End",
    36: "Home",
    37: "ArrowLeft",
    38: "ArrowUp",
    39: "ArrowRight",
    40: "ArrowDown",
    45: "Insert",
    46: "Delete",
    112: "F1",
    113: "F2",
    114: "F3",
    115: "F4",
    116: "F5",
    117: "F6",
    118: "F7",
    119: "F8",
    120: "F9",
    121: "F10",
    122: "F11",
    123: "F12",
    144: "NumLock",
    145: "ScrollLock",
    224: "Meta"
  }, Od = { Alt: "altKey", Control: "ctrlKey", Meta: "metaKey", Shift: "shiftKey" };
  function Pd(a) {
    var b = this.nativeEvent;
    return b.getModifierState ? b.getModifierState(a) : (a = Od[a]) ? !!b[a] : false;
  }
  function zd() {
    return Pd;
  }
  var Qd = A2({}, ud, { key: function(a) {
    if (a.key) {
      var b = Md[a.key] || a.key;
      if ("Unidentified" !== b) return b;
    }
    return "keypress" === a.type ? (a = od(a), 13 === a ? "Enter" : String.fromCharCode(a)) : "keydown" === a.type || "keyup" === a.type ? Nd[a.keyCode] || "Unidentified" : "";
  }, code: 0, location: 0, ctrlKey: 0, shiftKey: 0, altKey: 0, metaKey: 0, repeat: 0, locale: 0, getModifierState: zd, charCode: function(a) {
    return "keypress" === a.type ? od(a) : 0;
  }, keyCode: function(a) {
    return "keydown" === a.type || "keyup" === a.type ? a.keyCode : 0;
  }, which: function(a) {
    return "keypress" === a.type ? od(a) : "keydown" === a.type || "keyup" === a.type ? a.keyCode : 0;
  } }), Rd = rd(Qd), Sd = A2({}, Ad, { pointerId: 0, width: 0, height: 0, pressure: 0, tangentialPressure: 0, tiltX: 0, tiltY: 0, twist: 0, pointerType: 0, isPrimary: 0 }), Td = rd(Sd), Ud = A2({}, ud, { touches: 0, targetTouches: 0, changedTouches: 0, altKey: 0, metaKey: 0, ctrlKey: 0, shiftKey: 0, getModifierState: zd }), Vd = rd(Ud), Wd = A2({}, sd, { propertyName: 0, elapsedTime: 0, pseudoElement: 0 }), Xd = rd(Wd), Yd = A2({}, Ad, {
    deltaX: function(a) {
      return "deltaX" in a ? a.deltaX : "wheelDeltaX" in a ? -a.wheelDeltaX : 0;
    },
    deltaY: function(a) {
      return "deltaY" in a ? a.deltaY : "wheelDeltaY" in a ? -a.wheelDeltaY : "wheelDelta" in a ? -a.wheelDelta : 0;
    },
    deltaZ: 0,
    deltaMode: 0
  }), Zd = rd(Yd), $d = [9, 13, 27, 32], ae = ia && "CompositionEvent" in window, be2 = null;
  ia && "documentMode" in document && (be2 = document.documentMode);
  var ce = ia && "TextEvent" in window && !be2, de2 = ia && (!ae || be2 && 8 < be2 && 11 >= be2), ee2 = String.fromCharCode(32), fe2 = false;
  function ge(a, b) {
    switch (a) {
      case "keyup":
        return -1 !== $d.indexOf(b.keyCode);
      case "keydown":
        return 229 !== b.keyCode;
      case "keypress":
      case "mousedown":
      case "focusout":
        return true;
      default:
        return false;
    }
  }
  function he(a) {
    a = a.detail;
    return "object" === typeof a && "data" in a ? a.data : null;
  }
  var ie2 = false;
  function je2(a, b) {
    switch (a) {
      case "compositionend":
        return he(b);
      case "keypress":
        if (32 !== b.which) return null;
        fe2 = true;
        return ee2;
      case "textInput":
        return a = b.data, a === ee2 && fe2 ? null : a;
      default:
        return null;
    }
  }
  function ke2(a, b) {
    if (ie2) return "compositionend" === a || !ae && ge(a, b) ? (a = nd(), md = ld = kd = null, ie2 = false, a) : null;
    switch (a) {
      case "paste":
        return null;
      case "keypress":
        if (!(b.ctrlKey || b.altKey || b.metaKey) || b.ctrlKey && b.altKey) {
          if (b.char && 1 < b.char.length) return b.char;
          if (b.which) return String.fromCharCode(b.which);
        }
        return null;
      case "compositionend":
        return de2 && "ko" !== b.locale ? null : b.data;
      default:
        return null;
    }
  }
  var le2 = { color: true, date: true, datetime: true, "datetime-local": true, email: true, month: true, number: true, password: true, range: true, search: true, tel: true, text: true, time: true, url: true, week: true };
  function me(a) {
    var b = a && a.nodeName && a.nodeName.toLowerCase();
    return "input" === b ? !!le2[a.type] : "textarea" === b ? true : false;
  }
  function ne2(a, b, c, d) {
    Eb(d);
    b = oe(b, "onChange");
    0 < b.length && (c = new td("onChange", "change", null, c, d), a.push({ event: c, listeners: b }));
  }
  var pe2 = null, qe2 = null;
  function re(a) {
    se2(a, 0);
  }
  function te2(a) {
    var b = ue(a);
    if (Wa(b)) return a;
  }
  function ve2(a, b) {
    if ("change" === a) return b;
  }
  var we2 = false;
  if (ia) {
    var xe2;
    if (ia) {
      var ye2 = "oninput" in document;
      if (!ye2) {
        var ze2 = document.createElement("div");
        ze2.setAttribute("oninput", "return;");
        ye2 = "function" === typeof ze2.oninput;
      }
      xe2 = ye2;
    } else xe2 = false;
    we2 = xe2 && (!document.documentMode || 9 < document.documentMode);
  }
  function Ae2() {
    pe2 && (pe2.detachEvent("onpropertychange", Be2), qe2 = pe2 = null);
  }
  function Be2(a) {
    if ("value" === a.propertyName && te2(qe2)) {
      var b = [];
      ne2(b, qe2, a, xb(a));
      Jb(re, b);
    }
  }
  function Ce2(a, b, c) {
    "focusin" === a ? (Ae2(), pe2 = b, qe2 = c, pe2.attachEvent("onpropertychange", Be2)) : "focusout" === a && Ae2();
  }
  function De2(a) {
    if ("selectionchange" === a || "keyup" === a || "keydown" === a) return te2(qe2);
  }
  function Ee(a, b) {
    if ("click" === a) return te2(b);
  }
  function Fe2(a, b) {
    if ("input" === a || "change" === a) return te2(b);
  }
  function Ge2(a, b) {
    return a === b && (0 !== a || 1 / a === 1 / b) || a !== a && b !== b;
  }
  var He2 = "function" === typeof Object.is ? Object.is : Ge2;
  function Ie2(a, b) {
    if (He2(a, b)) return true;
    if ("object" !== typeof a || null === a || "object" !== typeof b || null === b) return false;
    var c = Object.keys(a), d = Object.keys(b);
    if (c.length !== d.length) return false;
    for (d = 0; d < c.length; d++) {
      var e = c[d];
      if (!ja.call(b, e) || !He2(a[e], b[e])) return false;
    }
    return true;
  }
  function Je2(a) {
    for (; a && a.firstChild; ) a = a.firstChild;
    return a;
  }
  function Ke(a, b) {
    var c = Je2(a);
    a = 0;
    for (var d; c; ) {
      if (3 === c.nodeType) {
        d = a + c.textContent.length;
        if (a <= b && d >= b) return { node: c, offset: b - a };
        a = d;
      }
      a: {
        for (; c; ) {
          if (c.nextSibling) {
            c = c.nextSibling;
            break a;
          }
          c = c.parentNode;
        }
        c = void 0;
      }
      c = Je2(c);
    }
  }
  function Le2(a, b) {
    return a && b ? a === b ? true : a && 3 === a.nodeType ? false : b && 3 === b.nodeType ? Le2(a, b.parentNode) : "contains" in a ? a.contains(b) : a.compareDocumentPosition ? !!(a.compareDocumentPosition(b) & 16) : false : false;
  }
  function Me2() {
    for (var a = window, b = Xa(); b instanceof a.HTMLIFrameElement; ) {
      try {
        var c = "string" === typeof b.contentWindow.location.href;
      } catch (d) {
        c = false;
      }
      if (c) a = b.contentWindow;
      else break;
      b = Xa(a.document);
    }
    return b;
  }
  function Ne2(a) {
    var b = a && a.nodeName && a.nodeName.toLowerCase();
    return b && ("input" === b && ("text" === a.type || "search" === a.type || "tel" === a.type || "url" === a.type || "password" === a.type) || "textarea" === b || "true" === a.contentEditable);
  }
  function Oe2(a) {
    var b = Me2(), c = a.focusedElem, d = a.selectionRange;
    if (b !== c && c && c.ownerDocument && Le2(c.ownerDocument.documentElement, c)) {
      if (null !== d && Ne2(c)) {
        if (b = d.start, a = d.end, void 0 === a && (a = b), "selectionStart" in c) c.selectionStart = b, c.selectionEnd = Math.min(a, c.value.length);
        else if (a = (b = c.ownerDocument || document) && b.defaultView || window, a.getSelection) {
          a = a.getSelection();
          var e = c.textContent.length, f = Math.min(d.start, e);
          d = void 0 === d.end ? f : Math.min(d.end, e);
          !a.extend && f > d && (e = d, d = f, f = e);
          e = Ke(c, f);
          var g = Ke(
            c,
            d
          );
          e && g && (1 !== a.rangeCount || a.anchorNode !== e.node || a.anchorOffset !== e.offset || a.focusNode !== g.node || a.focusOffset !== g.offset) && (b = b.createRange(), b.setStart(e.node, e.offset), a.removeAllRanges(), f > d ? (a.addRange(b), a.extend(g.node, g.offset)) : (b.setEnd(g.node, g.offset), a.addRange(b)));
        }
      }
      b = [];
      for (a = c; a = a.parentNode; ) 1 === a.nodeType && b.push({ element: a, left: a.scrollLeft, top: a.scrollTop });
      "function" === typeof c.focus && c.focus();
      for (c = 0; c < b.length; c++) a = b[c], a.element.scrollLeft = a.left, a.element.scrollTop = a.top;
    }
  }
  var Pe2 = ia && "documentMode" in document && 11 >= document.documentMode, Qe2 = null, Re2 = null, Se = null, Te2 = false;
  function Ue(a, b, c) {
    var d = c.window === c ? c.document : 9 === c.nodeType ? c : c.ownerDocument;
    Te2 || null == Qe2 || Qe2 !== Xa(d) || (d = Qe2, "selectionStart" in d && Ne2(d) ? d = { start: d.selectionStart, end: d.selectionEnd } : (d = (d.ownerDocument && d.ownerDocument.defaultView || window).getSelection(), d = { anchorNode: d.anchorNode, anchorOffset: d.anchorOffset, focusNode: d.focusNode, focusOffset: d.focusOffset }), Se && Ie2(Se, d) || (Se = d, d = oe(Re2, "onSelect"), 0 < d.length && (b = new td("onSelect", "select", null, b, c), a.push({ event: b, listeners: d }), b.target = Qe2)));
  }
  function Ve2(a, b) {
    var c = {};
    c[a.toLowerCase()] = b.toLowerCase();
    c["Webkit" + a] = "webkit" + b;
    c["Moz" + a] = "moz" + b;
    return c;
  }
  var We2 = { animationend: Ve2("Animation", "AnimationEnd"), animationiteration: Ve2("Animation", "AnimationIteration"), animationstart: Ve2("Animation", "AnimationStart"), transitionend: Ve2("Transition", "TransitionEnd") }, Xe = {}, Ye2 = {};
  ia && (Ye2 = document.createElement("div").style, "AnimationEvent" in window || (delete We2.animationend.animation, delete We2.animationiteration.animation, delete We2.animationstart.animation), "TransitionEvent" in window || delete We2.transitionend.transition);
  function Ze3(a) {
    if (Xe[a]) return Xe[a];
    if (!We2[a]) return a;
    var b = We2[a], c;
    for (c in b) if (b.hasOwnProperty(c) && c in Ye2) return Xe[a] = b[c];
    return a;
  }
  var $e2 = Ze3("animationend"), af = Ze3("animationiteration"), bf = Ze3("animationstart"), cf = Ze3("transitionend"), df = /* @__PURE__ */ new Map(), ef = "abort auxClick cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(" ");
  function ff(a, b) {
    df.set(a, b);
    fa(b, [a]);
  }
  for (var gf = 0; gf < ef.length; gf++) {
    var hf = ef[gf], jf = hf.toLowerCase(), kf = hf[0].toUpperCase() + hf.slice(1);
    ff(jf, "on" + kf);
  }
  ff($e2, "onAnimationEnd");
  ff(af, "onAnimationIteration");
  ff(bf, "onAnimationStart");
  ff("dblclick", "onDoubleClick");
  ff("focusin", "onFocus");
  ff("focusout", "onBlur");
  ff(cf, "onTransitionEnd");
  ha("onMouseEnter", ["mouseout", "mouseover"]);
  ha("onMouseLeave", ["mouseout", "mouseover"]);
  ha("onPointerEnter", ["pointerout", "pointerover"]);
  ha("onPointerLeave", ["pointerout", "pointerover"]);
  fa("onChange", "change click focusin focusout input keydown keyup selectionchange".split(" "));
  fa("onSelect", "focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(" "));
  fa("onBeforeInput", ["compositionend", "keypress", "textInput", "paste"]);
  fa("onCompositionEnd", "compositionend focusout keydown keypress keyup mousedown".split(" "));
  fa("onCompositionStart", "compositionstart focusout keydown keypress keyup mousedown".split(" "));
  fa("onCompositionUpdate", "compositionupdate focusout keydown keypress keyup mousedown".split(" "));
  var lf = "abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(" "), mf = new Set("cancel close invalid load scroll toggle".split(" ").concat(lf));
  function nf(a, b, c) {
    var d = a.type || "unknown-event";
    a.currentTarget = c;
    Ub(d, b, void 0, a);
    a.currentTarget = null;
  }
  function se2(a, b) {
    b = 0 !== (b & 4);
    for (var c = 0; c < a.length; c++) {
      var d = a[c], e = d.event;
      d = d.listeners;
      a: {
        var f = void 0;
        if (b) for (var g = d.length - 1; 0 <= g; g--) {
          var h = d[g], k = h.instance, l = h.currentTarget;
          h = h.listener;
          if (k !== f && e.isPropagationStopped()) break a;
          nf(e, h, l);
          f = k;
        }
        else for (g = 0; g < d.length; g++) {
          h = d[g];
          k = h.instance;
          l = h.currentTarget;
          h = h.listener;
          if (k !== f && e.isPropagationStopped()) break a;
          nf(e, h, l);
          f = k;
        }
      }
    }
    if (Qb) throw a = Rb, Qb = false, Rb = null, a;
  }
  function D2(a, b) {
    var c = b[of];
    void 0 === c && (c = b[of] = /* @__PURE__ */ new Set());
    var d = a + "__bubble";
    c.has(d) || (pf(b, a, 2, false), c.add(d));
  }
  function qf(a, b, c) {
    var d = 0;
    b && (d |= 4);
    pf(c, a, d, b);
  }
  var rf = "_reactListening" + Math.random().toString(36).slice(2);
  function sf(a) {
    if (!a[rf]) {
      a[rf] = true;
      da.forEach(function(b2) {
        "selectionchange" !== b2 && (mf.has(b2) || qf(b2, false, a), qf(b2, true, a));
      });
      var b = 9 === a.nodeType ? a : a.ownerDocument;
      null === b || b[rf] || (b[rf] = true, qf("selectionchange", false, b));
    }
  }
  function pf(a, b, c, d) {
    switch (jd(b)) {
      case 1:
        var e = ed;
        break;
      case 4:
        e = gd;
        break;
      default:
        e = fd;
    }
    c = e.bind(null, b, c, a);
    e = void 0;
    !Lb || "touchstart" !== b && "touchmove" !== b && "wheel" !== b || (e = true);
    d ? void 0 !== e ? a.addEventListener(b, c, { capture: true, passive: e }) : a.addEventListener(b, c, true) : void 0 !== e ? a.addEventListener(b, c, { passive: e }) : a.addEventListener(b, c, false);
  }
  function hd(a, b, c, d, e) {
    var f = d;
    if (0 === (b & 1) && 0 === (b & 2) && null !== d) a: for (; ; ) {
      if (null === d) return;
      var g = d.tag;
      if (3 === g || 4 === g) {
        var h = d.stateNode.containerInfo;
        if (h === e || 8 === h.nodeType && h.parentNode === e) break;
        if (4 === g) for (g = d.return; null !== g; ) {
          var k = g.tag;
          if (3 === k || 4 === k) {
            if (k = g.stateNode.containerInfo, k === e || 8 === k.nodeType && k.parentNode === e) return;
          }
          g = g.return;
        }
        for (; null !== h; ) {
          g = Wc(h);
          if (null === g) return;
          k = g.tag;
          if (5 === k || 6 === k) {
            d = f = g;
            continue a;
          }
          h = h.parentNode;
        }
      }
      d = d.return;
    }
    Jb(function() {
      var d2 = f, e2 = xb(c), g2 = [];
      a: {
        var h2 = df.get(a);
        if (void 0 !== h2) {
          var k2 = td, n = a;
          switch (a) {
            case "keypress":
              if (0 === od(c)) break a;
            case "keydown":
            case "keyup":
              k2 = Rd;
              break;
            case "focusin":
              n = "focus";
              k2 = Fd;
              break;
            case "focusout":
              n = "blur";
              k2 = Fd;
              break;
            case "beforeblur":
            case "afterblur":
              k2 = Fd;
              break;
            case "click":
              if (2 === c.button) break a;
            case "auxclick":
            case "dblclick":
            case "mousedown":
            case "mousemove":
            case "mouseup":
            case "mouseout":
            case "mouseover":
            case "contextmenu":
              k2 = Bd;
              break;
            case "drag":
            case "dragend":
            case "dragenter":
            case "dragexit":
            case "dragleave":
            case "dragover":
            case "dragstart":
            case "drop":
              k2 = Dd;
              break;
            case "touchcancel":
            case "touchend":
            case "touchmove":
            case "touchstart":
              k2 = Vd;
              break;
            case $e2:
            case af:
            case bf:
              k2 = Hd;
              break;
            case cf:
              k2 = Xd;
              break;
            case "scroll":
              k2 = vd;
              break;
            case "wheel":
              k2 = Zd;
              break;
            case "copy":
            case "cut":
            case "paste":
              k2 = Jd;
              break;
            case "gotpointercapture":
            case "lostpointercapture":
            case "pointercancel":
            case "pointerdown":
            case "pointermove":
            case "pointerout":
            case "pointerover":
            case "pointerup":
              k2 = Td;
          }
          var t = 0 !== (b & 4), J2 = !t && "scroll" === a, x = t ? null !== h2 ? h2 + "Capture" : null : h2;
          t = [];
          for (var w = d2, u; null !== w; ) {
            u = w;
            var F2 = u.stateNode;
            5 === u.tag && null !== F2 && (u = F2, null !== x && (F2 = Kb(w, x), null != F2 && t.push(tf(w, F2, u))));
            if (J2) break;
            w = w.return;
          }
          0 < t.length && (h2 = new k2(h2, n, null, c, e2), g2.push({ event: h2, listeners: t }));
        }
      }
      if (0 === (b & 7)) {
        a: {
          h2 = "mouseover" === a || "pointerover" === a;
          k2 = "mouseout" === a || "pointerout" === a;
          if (h2 && c !== wb && (n = c.relatedTarget || c.fromElement) && (Wc(n) || n[uf])) break a;
          if (k2 || h2) {
            h2 = e2.window === e2 ? e2 : (h2 = e2.ownerDocument) ? h2.defaultView || h2.parentWindow : window;
            if (k2) {
              if (n = c.relatedTarget || c.toElement, k2 = d2, n = n ? Wc(n) : null, null !== n && (J2 = Vb(n), n !== J2 || 5 !== n.tag && 6 !== n.tag)) n = null;
            } else k2 = null, n = d2;
            if (k2 !== n) {
              t = Bd;
              F2 = "onMouseLeave";
              x = "onMouseEnter";
              w = "mouse";
              if ("pointerout" === a || "pointerover" === a) t = Td, F2 = "onPointerLeave", x = "onPointerEnter", w = "pointer";
              J2 = null == k2 ? h2 : ue(k2);
              u = null == n ? h2 : ue(n);
              h2 = new t(F2, w + "leave", k2, c, e2);
              h2.target = J2;
              h2.relatedTarget = u;
              F2 = null;
              Wc(e2) === d2 && (t = new t(x, w + "enter", n, c, e2), t.target = u, t.relatedTarget = J2, F2 = t);
              J2 = F2;
              if (k2 && n) b: {
                t = k2;
                x = n;
                w = 0;
                for (u = t; u; u = vf(u)) w++;
                u = 0;
                for (F2 = x; F2; F2 = vf(F2)) u++;
                for (; 0 < w - u; ) t = vf(t), w--;
                for (; 0 < u - w; ) x = vf(x), u--;
                for (; w--; ) {
                  if (t === x || null !== x && t === x.alternate) break b;
                  t = vf(t);
                  x = vf(x);
                }
                t = null;
              }
              else t = null;
              null !== k2 && wf(g2, h2, k2, t, false);
              null !== n && null !== J2 && wf(g2, J2, n, t, true);
            }
          }
        }
        a: {
          h2 = d2 ? ue(d2) : window;
          k2 = h2.nodeName && h2.nodeName.toLowerCase();
          if ("select" === k2 || "input" === k2 && "file" === h2.type) var na = ve2;
          else if (me(h2)) if (we2) na = Fe2;
          else {
            na = De2;
            var xa = Ce2;
          }
          else (k2 = h2.nodeName) && "input" === k2.toLowerCase() && ("checkbox" === h2.type || "radio" === h2.type) && (na = Ee);
          if (na && (na = na(a, d2))) {
            ne2(g2, na, c, e2);
            break a;
          }
          xa && xa(a, h2, d2);
          "focusout" === a && (xa = h2._wrapperState) && xa.controlled && "number" === h2.type && cb(h2, "number", h2.value);
        }
        xa = d2 ? ue(d2) : window;
        switch (a) {
          case "focusin":
            if (me(xa) || "true" === xa.contentEditable) Qe2 = xa, Re2 = d2, Se = null;
            break;
          case "focusout":
            Se = Re2 = Qe2 = null;
            break;
          case "mousedown":
            Te2 = true;
            break;
          case "contextmenu":
          case "mouseup":
          case "dragend":
            Te2 = false;
            Ue(g2, c, e2);
            break;
          case "selectionchange":
            if (Pe2) break;
          case "keydown":
          case "keyup":
            Ue(g2, c, e2);
        }
        var $a;
        if (ae) b: {
          switch (a) {
            case "compositionstart":
              var ba = "onCompositionStart";
              break b;
            case "compositionend":
              ba = "onCompositionEnd";
              break b;
            case "compositionupdate":
              ba = "onCompositionUpdate";
              break b;
          }
          ba = void 0;
        }
        else ie2 ? ge(a, c) && (ba = "onCompositionEnd") : "keydown" === a && 229 === c.keyCode && (ba = "onCompositionStart");
        ba && (de2 && "ko" !== c.locale && (ie2 || "onCompositionStart" !== ba ? "onCompositionEnd" === ba && ie2 && ($a = nd()) : (kd = e2, ld = "value" in kd ? kd.value : kd.textContent, ie2 = true)), xa = oe(d2, ba), 0 < xa.length && (ba = new Ld(ba, a, null, c, e2), g2.push({ event: ba, listeners: xa }), $a ? ba.data = $a : ($a = he(c), null !== $a && (ba.data = $a))));
        if ($a = ce ? je2(a, c) : ke2(a, c)) d2 = oe(d2, "onBeforeInput"), 0 < d2.length && (e2 = new Ld("onBeforeInput", "beforeinput", null, c, e2), g2.push({ event: e2, listeners: d2 }), e2.data = $a);
      }
      se2(g2, b);
    });
  }
  function tf(a, b, c) {
    return { instance: a, listener: b, currentTarget: c };
  }
  function oe(a, b) {
    for (var c = b + "Capture", d = []; null !== a; ) {
      var e = a, f = e.stateNode;
      5 === e.tag && null !== f && (e = f, f = Kb(a, c), null != f && d.unshift(tf(a, f, e)), f = Kb(a, b), null != f && d.push(tf(a, f, e)));
      a = a.return;
    }
    return d;
  }
  function vf(a) {
    if (null === a) return null;
    do
      a = a.return;
    while (a && 5 !== a.tag);
    return a ? a : null;
  }
  function wf(a, b, c, d, e) {
    for (var f = b._reactName, g = []; null !== c && c !== d; ) {
      var h = c, k = h.alternate, l = h.stateNode;
      if (null !== k && k === d) break;
      5 === h.tag && null !== l && (h = l, e ? (k = Kb(c, f), null != k && g.unshift(tf(c, k, h))) : e || (k = Kb(c, f), null != k && g.push(tf(c, k, h))));
      c = c.return;
    }
    0 !== g.length && a.push({ event: b, listeners: g });
  }
  var xf = /\r\n?/g, yf = /\u0000|\uFFFD/g;
  function zf(a) {
    return ("string" === typeof a ? a : "" + a).replace(xf, "\n").replace(yf, "");
  }
  function Af(a, b, c) {
    b = zf(b);
    if (zf(a) !== b && c) throw Error(p(425));
  }
  function Bf() {
  }
  var Cf = null, Df = null;
  function Ef(a, b) {
    return "textarea" === a || "noscript" === a || "string" === typeof b.children || "number" === typeof b.children || "object" === typeof b.dangerouslySetInnerHTML && null !== b.dangerouslySetInnerHTML && null != b.dangerouslySetInnerHTML.__html;
  }
  var Ff = "function" === typeof setTimeout ? setTimeout : void 0, Gf = "function" === typeof clearTimeout ? clearTimeout : void 0, Hf = "function" === typeof Promise ? Promise : void 0, Jf = "function" === typeof queueMicrotask ? queueMicrotask : "undefined" !== typeof Hf ? function(a) {
    return Hf.resolve(null).then(a).catch(If);
  } : Ff;
  function If(a) {
    setTimeout(function() {
      throw a;
    });
  }
  function Kf(a, b) {
    var c = b, d = 0;
    do {
      var e = c.nextSibling;
      a.removeChild(c);
      if (e && 8 === e.nodeType) if (c = e.data, "/$" === c) {
        if (0 === d) {
          a.removeChild(e);
          bd(b);
          return;
        }
        d--;
      } else "$" !== c && "$?" !== c && "$!" !== c || d++;
      c = e;
    } while (c);
    bd(b);
  }
  function Lf(a) {
    for (; null != a; a = a.nextSibling) {
      var b = a.nodeType;
      if (1 === b || 3 === b) break;
      if (8 === b) {
        b = a.data;
        if ("$" === b || "$!" === b || "$?" === b) break;
        if ("/$" === b) return null;
      }
    }
    return a;
  }
  function Mf(a) {
    a = a.previousSibling;
    for (var b = 0; a; ) {
      if (8 === a.nodeType) {
        var c = a.data;
        if ("$" === c || "$!" === c || "$?" === c) {
          if (0 === b) return a;
          b--;
        } else "/$" === c && b++;
      }
      a = a.previousSibling;
    }
    return null;
  }
  var Nf = Math.random().toString(36).slice(2), Of = "__reactFiber$" + Nf, Pf = "__reactProps$" + Nf, uf = "__reactContainer$" + Nf, of = "__reactEvents$" + Nf, Qf = "__reactListeners$" + Nf, Rf = "__reactHandles$" + Nf;
  function Wc(a) {
    var b = a[Of];
    if (b) return b;
    for (var c = a.parentNode; c; ) {
      if (b = c[uf] || c[Of]) {
        c = b.alternate;
        if (null !== b.child || null !== c && null !== c.child) for (a = Mf(a); null !== a; ) {
          if (c = a[Of]) return c;
          a = Mf(a);
        }
        return b;
      }
      a = c;
      c = a.parentNode;
    }
    return null;
  }
  function Cb(a) {
    a = a[Of] || a[uf];
    return !a || 5 !== a.tag && 6 !== a.tag && 13 !== a.tag && 3 !== a.tag ? null : a;
  }
  function ue(a) {
    if (5 === a.tag || 6 === a.tag) return a.stateNode;
    throw Error(p(33));
  }
  function Db(a) {
    return a[Pf] || null;
  }
  var Sf = [], Tf = -1;
  function Uf(a) {
    return { current: a };
  }
  function E(a) {
    0 > Tf || (a.current = Sf[Tf], Sf[Tf] = null, Tf--);
  }
  function G(a, b) {
    Tf++;
    Sf[Tf] = a.current;
    a.current = b;
  }
  var Vf = {}, H2 = Uf(Vf), Wf = Uf(false), Xf = Vf;
  function Yf(a, b) {
    var c = a.type.contextTypes;
    if (!c) return Vf;
    var d = a.stateNode;
    if (d && d.__reactInternalMemoizedUnmaskedChildContext === b) return d.__reactInternalMemoizedMaskedChildContext;
    var e = {}, f;
    for (f in c) e[f] = b[f];
    d && (a = a.stateNode, a.__reactInternalMemoizedUnmaskedChildContext = b, a.__reactInternalMemoizedMaskedChildContext = e);
    return e;
  }
  function Zf(a) {
    a = a.childContextTypes;
    return null !== a && void 0 !== a;
  }
  function $f() {
    E(Wf);
    E(H2);
  }
  function ag(a, b, c) {
    if (H2.current !== Vf) throw Error(p(168));
    G(H2, b);
    G(Wf, c);
  }
  function bg(a, b, c) {
    var d = a.stateNode;
    b = b.childContextTypes;
    if ("function" !== typeof d.getChildContext) return c;
    d = d.getChildContext();
    for (var e in d) if (!(e in b)) throw Error(p(108, Ra(a) || "Unknown", e));
    return A2({}, c, d);
  }
  function cg(a) {
    a = (a = a.stateNode) && a.__reactInternalMemoizedMergedChildContext || Vf;
    Xf = H2.current;
    G(H2, a);
    G(Wf, Wf.current);
    return true;
  }
  function dg(a, b, c) {
    var d = a.stateNode;
    if (!d) throw Error(p(169));
    c ? (a = bg(a, b, Xf), d.__reactInternalMemoizedMergedChildContext = a, E(Wf), E(H2), G(H2, a)) : E(Wf);
    G(Wf, c);
  }
  var eg = null, fg = false, gg = false;
  function hg(a) {
    null === eg ? eg = [a] : eg.push(a);
  }
  function ig(a) {
    fg = true;
    hg(a);
  }
  function jg() {
    if (!gg && null !== eg) {
      gg = true;
      var a = 0, b = C2;
      try {
        var c = eg;
        for (C2 = 1; a < c.length; a++) {
          var d = c[a];
          do
            d = d(true);
          while (null !== d);
        }
        eg = null;
        fg = false;
      } catch (e) {
        throw null !== eg && (eg = eg.slice(a + 1)), ac(fc, jg), e;
      } finally {
        C2 = b, gg = false;
      }
    }
    return null;
  }
  var kg = [], lg = 0, mg = null, ng = 0, og = [], pg = 0, qg = null, rg = 1, sg = "";
  function tg(a, b) {
    kg[lg++] = ng;
    kg[lg++] = mg;
    mg = a;
    ng = b;
  }
  function ug(a, b, c) {
    og[pg++] = rg;
    og[pg++] = sg;
    og[pg++] = qg;
    qg = a;
    var d = rg;
    a = sg;
    var e = 32 - oc(d) - 1;
    d &= ~(1 << e);
    c += 1;
    var f = 32 - oc(b) + e;
    if (30 < f) {
      var g = e - e % 5;
      f = (d & (1 << g) - 1).toString(32);
      d >>= g;
      e -= g;
      rg = 1 << 32 - oc(b) + e | c << e | d;
      sg = f + a;
    } else rg = 1 << f | c << e | d, sg = a;
  }
  function vg(a) {
    null !== a.return && (tg(a, 1), ug(a, 1, 0));
  }
  function wg(a) {
    for (; a === mg; ) mg = kg[--lg], kg[lg] = null, ng = kg[--lg], kg[lg] = null;
    for (; a === qg; ) qg = og[--pg], og[pg] = null, sg = og[--pg], og[pg] = null, rg = og[--pg], og[pg] = null;
  }
  var xg = null, yg = null, I2 = false, zg = null;
  function Ag(a, b) {
    var c = Bg(5, null, null, 0);
    c.elementType = "DELETED";
    c.stateNode = b;
    c.return = a;
    b = a.deletions;
    null === b ? (a.deletions = [c], a.flags |= 16) : b.push(c);
  }
  function Cg(a, b) {
    switch (a.tag) {
      case 5:
        var c = a.type;
        b = 1 !== b.nodeType || c.toLowerCase() !== b.nodeName.toLowerCase() ? null : b;
        return null !== b ? (a.stateNode = b, xg = a, yg = Lf(b.firstChild), true) : false;
      case 6:
        return b = "" === a.pendingProps || 3 !== b.nodeType ? null : b, null !== b ? (a.stateNode = b, xg = a, yg = null, true) : false;
      case 13:
        return b = 8 !== b.nodeType ? null : b, null !== b ? (c = null !== qg ? { id: rg, overflow: sg } : null, a.memoizedState = { dehydrated: b, treeContext: c, retryLane: 1073741824 }, c = Bg(18, null, null, 0), c.stateNode = b, c.return = a, a.child = c, xg = a, yg = null, true) : false;
      default:
        return false;
    }
  }
  function Dg(a) {
    return 0 !== (a.mode & 1) && 0 === (a.flags & 128);
  }
  function Eg(a) {
    if (I2) {
      var b = yg;
      if (b) {
        var c = b;
        if (!Cg(a, b)) {
          if (Dg(a)) throw Error(p(418));
          b = Lf(c.nextSibling);
          var d = xg;
          b && Cg(a, b) ? Ag(d, c) : (a.flags = a.flags & -4097 | 2, I2 = false, xg = a);
        }
      } else {
        if (Dg(a)) throw Error(p(418));
        a.flags = a.flags & -4097 | 2;
        I2 = false;
        xg = a;
      }
    }
  }
  function Fg(a) {
    for (a = a.return; null !== a && 5 !== a.tag && 3 !== a.tag && 13 !== a.tag; ) a = a.return;
    xg = a;
  }
  function Gg(a) {
    if (a !== xg) return false;
    if (!I2) return Fg(a), I2 = true, false;
    var b;
    (b = 3 !== a.tag) && !(b = 5 !== a.tag) && (b = a.type, b = "head" !== b && "body" !== b && !Ef(a.type, a.memoizedProps));
    if (b && (b = yg)) {
      if (Dg(a)) throw Hg(), Error(p(418));
      for (; b; ) Ag(a, b), b = Lf(b.nextSibling);
    }
    Fg(a);
    if (13 === a.tag) {
      a = a.memoizedState;
      a = null !== a ? a.dehydrated : null;
      if (!a) throw Error(p(317));
      a: {
        a = a.nextSibling;
        for (b = 0; a; ) {
          if (8 === a.nodeType) {
            var c = a.data;
            if ("/$" === c) {
              if (0 === b) {
                yg = Lf(a.nextSibling);
                break a;
              }
              b--;
            } else "$" !== c && "$!" !== c && "$?" !== c || b++;
          }
          a = a.nextSibling;
        }
        yg = null;
      }
    } else yg = xg ? Lf(a.stateNode.nextSibling) : null;
    return true;
  }
  function Hg() {
    for (var a = yg; a; ) a = Lf(a.nextSibling);
  }
  function Ig() {
    yg = xg = null;
    I2 = false;
  }
  function Jg(a) {
    null === zg ? zg = [a] : zg.push(a);
  }
  var Kg = ua.ReactCurrentBatchConfig;
  function Lg(a, b, c) {
    a = c.ref;
    if (null !== a && "function" !== typeof a && "object" !== typeof a) {
      if (c._owner) {
        c = c._owner;
        if (c) {
          if (1 !== c.tag) throw Error(p(309));
          var d = c.stateNode;
        }
        if (!d) throw Error(p(147, a));
        var e = d, f = "" + a;
        if (null !== b && null !== b.ref && "function" === typeof b.ref && b.ref._stringRef === f) return b.ref;
        b = function(a2) {
          var b2 = e.refs;
          null === a2 ? delete b2[f] : b2[f] = a2;
        };
        b._stringRef = f;
        return b;
      }
      if ("string" !== typeof a) throw Error(p(284));
      if (!c._owner) throw Error(p(290, a));
    }
    return a;
  }
  function Mg(a, b) {
    a = Object.prototype.toString.call(b);
    throw Error(p(31, "[object Object]" === a ? "object with keys {" + Object.keys(b).join(", ") + "}" : a));
  }
  function Ng(a) {
    var b = a._init;
    return b(a._payload);
  }
  function Og(a) {
    function b(b2, c2) {
      if (a) {
        var d2 = b2.deletions;
        null === d2 ? (b2.deletions = [c2], b2.flags |= 16) : d2.push(c2);
      }
    }
    function c(c2, d2) {
      if (!a) return null;
      for (; null !== d2; ) b(c2, d2), d2 = d2.sibling;
      return null;
    }
    function d(a2, b2) {
      for (a2 = /* @__PURE__ */ new Map(); null !== b2; ) null !== b2.key ? a2.set(b2.key, b2) : a2.set(b2.index, b2), b2 = b2.sibling;
      return a2;
    }
    function e(a2, b2) {
      a2 = Pg(a2, b2);
      a2.index = 0;
      a2.sibling = null;
      return a2;
    }
    function f(b2, c2, d2) {
      b2.index = d2;
      if (!a) return b2.flags |= 1048576, c2;
      d2 = b2.alternate;
      if (null !== d2) return d2 = d2.index, d2 < c2 ? (b2.flags |= 2, c2) : d2;
      b2.flags |= 2;
      return c2;
    }
    function g(b2) {
      a && null === b2.alternate && (b2.flags |= 2);
      return b2;
    }
    function h(a2, b2, c2, d2) {
      if (null === b2 || 6 !== b2.tag) return b2 = Qg(c2, a2.mode, d2), b2.return = a2, b2;
      b2 = e(b2, c2);
      b2.return = a2;
      return b2;
    }
    function k(a2, b2, c2, d2) {
      var f2 = c2.type;
      if (f2 === ya) return m(a2, b2, c2.props.children, d2, c2.key);
      if (null !== b2 && (b2.elementType === f2 || "object" === typeof f2 && null !== f2 && f2.$$typeof === Ha && Ng(f2) === b2.type)) return d2 = e(b2, c2.props), d2.ref = Lg(a2, b2, c2), d2.return = a2, d2;
      d2 = Rg(c2.type, c2.key, c2.props, null, a2.mode, d2);
      d2.ref = Lg(a2, b2, c2);
      d2.return = a2;
      return d2;
    }
    function l(a2, b2, c2, d2) {
      if (null === b2 || 4 !== b2.tag || b2.stateNode.containerInfo !== c2.containerInfo || b2.stateNode.implementation !== c2.implementation) return b2 = Sg(c2, a2.mode, d2), b2.return = a2, b2;
      b2 = e(b2, c2.children || []);
      b2.return = a2;
      return b2;
    }
    function m(a2, b2, c2, d2, f2) {
      if (null === b2 || 7 !== b2.tag) return b2 = Tg(c2, a2.mode, d2, f2), b2.return = a2, b2;
      b2 = e(b2, c2);
      b2.return = a2;
      return b2;
    }
    function q2(a2, b2, c2) {
      if ("string" === typeof b2 && "" !== b2 || "number" === typeof b2) return b2 = Qg("" + b2, a2.mode, c2), b2.return = a2, b2;
      if ("object" === typeof b2 && null !== b2) {
        switch (b2.$$typeof) {
          case va:
            return c2 = Rg(b2.type, b2.key, b2.props, null, a2.mode, c2), c2.ref = Lg(a2, null, b2), c2.return = a2, c2;
          case wa:
            return b2 = Sg(b2, a2.mode, c2), b2.return = a2, b2;
          case Ha:
            var d2 = b2._init;
            return q2(a2, d2(b2._payload), c2);
        }
        if (eb(b2) || Ka(b2)) return b2 = Tg(b2, a2.mode, c2, null), b2.return = a2, b2;
        Mg(a2, b2);
      }
      return null;
    }
    function r(a2, b2, c2, d2) {
      var e2 = null !== b2 ? b2.key : null;
      if ("string" === typeof c2 && "" !== c2 || "number" === typeof c2) return null !== e2 ? null : h(a2, b2, "" + c2, d2);
      if ("object" === typeof c2 && null !== c2) {
        switch (c2.$$typeof) {
          case va:
            return c2.key === e2 ? k(a2, b2, c2, d2) : null;
          case wa:
            return c2.key === e2 ? l(a2, b2, c2, d2) : null;
          case Ha:
            return e2 = c2._init, r(
              a2,
              b2,
              e2(c2._payload),
              d2
            );
        }
        if (eb(c2) || Ka(c2)) return null !== e2 ? null : m(a2, b2, c2, d2, null);
        Mg(a2, c2);
      }
      return null;
    }
    function y(a2, b2, c2, d2, e2) {
      if ("string" === typeof d2 && "" !== d2 || "number" === typeof d2) return a2 = a2.get(c2) || null, h(b2, a2, "" + d2, e2);
      if ("object" === typeof d2 && null !== d2) {
        switch (d2.$$typeof) {
          case va:
            return a2 = a2.get(null === d2.key ? c2 : d2.key) || null, k(b2, a2, d2, e2);
          case wa:
            return a2 = a2.get(null === d2.key ? c2 : d2.key) || null, l(b2, a2, d2, e2);
          case Ha:
            var f2 = d2._init;
            return y(a2, b2, c2, f2(d2._payload), e2);
        }
        if (eb(d2) || Ka(d2)) return a2 = a2.get(c2) || null, m(b2, a2, d2, e2, null);
        Mg(b2, d2);
      }
      return null;
    }
    function n(e2, g2, h2, k2) {
      for (var l2 = null, m2 = null, u = g2, w = g2 = 0, x = null; null !== u && w < h2.length; w++) {
        u.index > w ? (x = u, u = null) : x = u.sibling;
        var n2 = r(e2, u, h2[w], k2);
        if (null === n2) {
          null === u && (u = x);
          break;
        }
        a && u && null === n2.alternate && b(e2, u);
        g2 = f(n2, g2, w);
        null === m2 ? l2 = n2 : m2.sibling = n2;
        m2 = n2;
        u = x;
      }
      if (w === h2.length) return c(e2, u), I2 && tg(e2, w), l2;
      if (null === u) {
        for (; w < h2.length; w++) u = q2(e2, h2[w], k2), null !== u && (g2 = f(u, g2, w), null === m2 ? l2 = u : m2.sibling = u, m2 = u);
        I2 && tg(e2, w);
        return l2;
      }
      for (u = d(e2, u); w < h2.length; w++) x = y(u, e2, w, h2[w], k2), null !== x && (a && null !== x.alternate && u.delete(null === x.key ? w : x.key), g2 = f(x, g2, w), null === m2 ? l2 = x : m2.sibling = x, m2 = x);
      a && u.forEach(function(a2) {
        return b(e2, a2);
      });
      I2 && tg(e2, w);
      return l2;
    }
    function t(e2, g2, h2, k2) {
      var l2 = Ka(h2);
      if ("function" !== typeof l2) throw Error(p(150));
      h2 = l2.call(h2);
      if (null == h2) throw Error(p(151));
      for (var u = l2 = null, m2 = g2, w = g2 = 0, x = null, n2 = h2.next(); null !== m2 && !n2.done; w++, n2 = h2.next()) {
        m2.index > w ? (x = m2, m2 = null) : x = m2.sibling;
        var t2 = r(e2, m2, n2.value, k2);
        if (null === t2) {
          null === m2 && (m2 = x);
          break;
        }
        a && m2 && null === t2.alternate && b(e2, m2);
        g2 = f(t2, g2, w);
        null === u ? l2 = t2 : u.sibling = t2;
        u = t2;
        m2 = x;
      }
      if (n2.done) return c(
        e2,
        m2
      ), I2 && tg(e2, w), l2;
      if (null === m2) {
        for (; !n2.done; w++, n2 = h2.next()) n2 = q2(e2, n2.value, k2), null !== n2 && (g2 = f(n2, g2, w), null === u ? l2 = n2 : u.sibling = n2, u = n2);
        I2 && tg(e2, w);
        return l2;
      }
      for (m2 = d(e2, m2); !n2.done; w++, n2 = h2.next()) n2 = y(m2, e2, w, n2.value, k2), null !== n2 && (a && null !== n2.alternate && m2.delete(null === n2.key ? w : n2.key), g2 = f(n2, g2, w), null === u ? l2 = n2 : u.sibling = n2, u = n2);
      a && m2.forEach(function(a2) {
        return b(e2, a2);
      });
      I2 && tg(e2, w);
      return l2;
    }
    function J2(a2, d2, f2, h2) {
      "object" === typeof f2 && null !== f2 && f2.type === ya && null === f2.key && (f2 = f2.props.children);
      if ("object" === typeof f2 && null !== f2) {
        switch (f2.$$typeof) {
          case va:
            a: {
              for (var k2 = f2.key, l2 = d2; null !== l2; ) {
                if (l2.key === k2) {
                  k2 = f2.type;
                  if (k2 === ya) {
                    if (7 === l2.tag) {
                      c(a2, l2.sibling);
                      d2 = e(l2, f2.props.children);
                      d2.return = a2;
                      a2 = d2;
                      break a;
                    }
                  } else if (l2.elementType === k2 || "object" === typeof k2 && null !== k2 && k2.$$typeof === Ha && Ng(k2) === l2.type) {
                    c(a2, l2.sibling);
                    d2 = e(l2, f2.props);
                    d2.ref = Lg(a2, l2, f2);
                    d2.return = a2;
                    a2 = d2;
                    break a;
                  }
                  c(a2, l2);
                  break;
                } else b(a2, l2);
                l2 = l2.sibling;
              }
              f2.type === ya ? (d2 = Tg(f2.props.children, a2.mode, h2, f2.key), d2.return = a2, a2 = d2) : (h2 = Rg(f2.type, f2.key, f2.props, null, a2.mode, h2), h2.ref = Lg(a2, d2, f2), h2.return = a2, a2 = h2);
            }
            return g(a2);
          case wa:
            a: {
              for (l2 = f2.key; null !== d2; ) {
                if (d2.key === l2) if (4 === d2.tag && d2.stateNode.containerInfo === f2.containerInfo && d2.stateNode.implementation === f2.implementation) {
                  c(a2, d2.sibling);
                  d2 = e(d2, f2.children || []);
                  d2.return = a2;
                  a2 = d2;
                  break a;
                } else {
                  c(a2, d2);
                  break;
                }
                else b(a2, d2);
                d2 = d2.sibling;
              }
              d2 = Sg(f2, a2.mode, h2);
              d2.return = a2;
              a2 = d2;
            }
            return g(a2);
          case Ha:
            return l2 = f2._init, J2(a2, d2, l2(f2._payload), h2);
        }
        if (eb(f2)) return n(a2, d2, f2, h2);
        if (Ka(f2)) return t(a2, d2, f2, h2);
        Mg(a2, f2);
      }
      return "string" === typeof f2 && "" !== f2 || "number" === typeof f2 ? (f2 = "" + f2, null !== d2 && 6 === d2.tag ? (c(a2, d2.sibling), d2 = e(d2, f2), d2.return = a2, a2 = d2) : (c(a2, d2), d2 = Qg(f2, a2.mode, h2), d2.return = a2, a2 = d2), g(a2)) : c(a2, d2);
    }
    return J2;
  }
  var Ug = Og(true), Vg = Og(false), Wg = Uf(null), Xg = null, Yg = null, Zg = null;
  function $g() {
    Zg = Yg = Xg = null;
  }
  function ah(a) {
    var b = Wg.current;
    E(Wg);
    a._currentValue = b;
  }
  function bh(a, b, c) {
    for (; null !== a; ) {
      var d = a.alternate;
      (a.childLanes & b) !== b ? (a.childLanes |= b, null !== d && (d.childLanes |= b)) : null !== d && (d.childLanes & b) !== b && (d.childLanes |= b);
      if (a === c) break;
      a = a.return;
    }
  }
  function ch(a, b) {
    Xg = a;
    Zg = Yg = null;
    a = a.dependencies;
    null !== a && null !== a.firstContext && (0 !== (a.lanes & b) && (dh = true), a.firstContext = null);
  }
  function eh(a) {
    var b = a._currentValue;
    if (Zg !== a) if (a = { context: a, memoizedValue: b, next: null }, null === Yg) {
      if (null === Xg) throw Error(p(308));
      Yg = a;
      Xg.dependencies = { lanes: 0, firstContext: a };
    } else Yg = Yg.next = a;
    return b;
  }
  var fh = null;
  function gh(a) {
    null === fh ? fh = [a] : fh.push(a);
  }
  function hh(a, b, c, d) {
    var e = b.interleaved;
    null === e ? (c.next = c, gh(b)) : (c.next = e.next, e.next = c);
    b.interleaved = c;
    return ih(a, d);
  }
  function ih(a, b) {
    a.lanes |= b;
    var c = a.alternate;
    null !== c && (c.lanes |= b);
    c = a;
    for (a = a.return; null !== a; ) a.childLanes |= b, c = a.alternate, null !== c && (c.childLanes |= b), c = a, a = a.return;
    return 3 === c.tag ? c.stateNode : null;
  }
  var jh = false;
  function kh(a) {
    a.updateQueue = { baseState: a.memoizedState, firstBaseUpdate: null, lastBaseUpdate: null, shared: { pending: null, interleaved: null, lanes: 0 }, effects: null };
  }
  function lh(a, b) {
    a = a.updateQueue;
    b.updateQueue === a && (b.updateQueue = { baseState: a.baseState, firstBaseUpdate: a.firstBaseUpdate, lastBaseUpdate: a.lastBaseUpdate, shared: a.shared, effects: a.effects });
  }
  function mh(a, b) {
    return { eventTime: a, lane: b, tag: 0, payload: null, callback: null, next: null };
  }
  function nh(a, b, c) {
    var d = a.updateQueue;
    if (null === d) return null;
    d = d.shared;
    if (0 !== (K2 & 2)) {
      var e = d.pending;
      null === e ? b.next = b : (b.next = e.next, e.next = b);
      d.pending = b;
      return ih(a, c);
    }
    e = d.interleaved;
    null === e ? (b.next = b, gh(d)) : (b.next = e.next, e.next = b);
    d.interleaved = b;
    return ih(a, c);
  }
  function oh(a, b, c) {
    b = b.updateQueue;
    if (null !== b && (b = b.shared, 0 !== (c & 4194240))) {
      var d = b.lanes;
      d &= a.pendingLanes;
      c |= d;
      b.lanes = c;
      Cc(a, c);
    }
  }
  function ph(a, b) {
    var c = a.updateQueue, d = a.alternate;
    if (null !== d && (d = d.updateQueue, c === d)) {
      var e = null, f = null;
      c = c.firstBaseUpdate;
      if (null !== c) {
        do {
          var g = { eventTime: c.eventTime, lane: c.lane, tag: c.tag, payload: c.payload, callback: c.callback, next: null };
          null === f ? e = f = g : f = f.next = g;
          c = c.next;
        } while (null !== c);
        null === f ? e = f = b : f = f.next = b;
      } else e = f = b;
      c = { baseState: d.baseState, firstBaseUpdate: e, lastBaseUpdate: f, shared: d.shared, effects: d.effects };
      a.updateQueue = c;
      return;
    }
    a = c.lastBaseUpdate;
    null === a ? c.firstBaseUpdate = b : a.next = b;
    c.lastBaseUpdate = b;
  }
  function qh(a, b, c, d) {
    var e = a.updateQueue;
    jh = false;
    var f = e.firstBaseUpdate, g = e.lastBaseUpdate, h = e.shared.pending;
    if (null !== h) {
      e.shared.pending = null;
      var k = h, l = k.next;
      k.next = null;
      null === g ? f = l : g.next = l;
      g = k;
      var m = a.alternate;
      null !== m && (m = m.updateQueue, h = m.lastBaseUpdate, h !== g && (null === h ? m.firstBaseUpdate = l : h.next = l, m.lastBaseUpdate = k));
    }
    if (null !== f) {
      var q2 = e.baseState;
      g = 0;
      m = l = k = null;
      h = f;
      do {
        var r = h.lane, y = h.eventTime;
        if ((d & r) === r) {
          null !== m && (m = m.next = {
            eventTime: y,
            lane: 0,
            tag: h.tag,
            payload: h.payload,
            callback: h.callback,
            next: null
          });
          a: {
            var n = a, t = h;
            r = b;
            y = c;
            switch (t.tag) {
              case 1:
                n = t.payload;
                if ("function" === typeof n) {
                  q2 = n.call(y, q2, r);
                  break a;
                }
                q2 = n;
                break a;
              case 3:
                n.flags = n.flags & -65537 | 128;
              case 0:
                n = t.payload;
                r = "function" === typeof n ? n.call(y, q2, r) : n;
                if (null === r || void 0 === r) break a;
                q2 = A2({}, q2, r);
                break a;
              case 2:
                jh = true;
            }
          }
          null !== h.callback && 0 !== h.lane && (a.flags |= 64, r = e.effects, null === r ? e.effects = [h] : r.push(h));
        } else y = { eventTime: y, lane: r, tag: h.tag, payload: h.payload, callback: h.callback, next: null }, null === m ? (l = m = y, k = q2) : m = m.next = y, g |= r;
        h = h.next;
        if (null === h) if (h = e.shared.pending, null === h) break;
        else r = h, h = r.next, r.next = null, e.lastBaseUpdate = r, e.shared.pending = null;
      } while (1);
      null === m && (k = q2);
      e.baseState = k;
      e.firstBaseUpdate = l;
      e.lastBaseUpdate = m;
      b = e.shared.interleaved;
      if (null !== b) {
        e = b;
        do
          g |= e.lane, e = e.next;
        while (e !== b);
      } else null === f && (e.shared.lanes = 0);
      rh |= g;
      a.lanes = g;
      a.memoizedState = q2;
    }
  }
  function sh(a, b, c) {
    a = b.effects;
    b.effects = null;
    if (null !== a) for (b = 0; b < a.length; b++) {
      var d = a[b], e = d.callback;
      if (null !== e) {
        d.callback = null;
        d = c;
        if ("function" !== typeof e) throw Error(p(191, e));
        e.call(d);
      }
    }
  }
  var th = {}, uh = Uf(th), vh = Uf(th), wh = Uf(th);
  function xh(a) {
    if (a === th) throw Error(p(174));
    return a;
  }
  function yh(a, b) {
    G(wh, b);
    G(vh, a);
    G(uh, th);
    a = b.nodeType;
    switch (a) {
      case 9:
      case 11:
        b = (b = b.documentElement) ? b.namespaceURI : lb(null, "");
        break;
      default:
        a = 8 === a ? b.parentNode : b, b = a.namespaceURI || null, a = a.tagName, b = lb(b, a);
    }
    E(uh);
    G(uh, b);
  }
  function zh() {
    E(uh);
    E(vh);
    E(wh);
  }
  function Ah(a) {
    xh(wh.current);
    var b = xh(uh.current);
    var c = lb(b, a.type);
    b !== c && (G(vh, a), G(uh, c));
  }
  function Bh(a) {
    vh.current === a && (E(uh), E(vh));
  }
  var L = Uf(0);
  function Ch(a) {
    for (var b = a; null !== b; ) {
      if (13 === b.tag) {
        var c = b.memoizedState;
        if (null !== c && (c = c.dehydrated, null === c || "$?" === c.data || "$!" === c.data)) return b;
      } else if (19 === b.tag && void 0 !== b.memoizedProps.revealOrder) {
        if (0 !== (b.flags & 128)) return b;
      } else if (null !== b.child) {
        b.child.return = b;
        b = b.child;
        continue;
      }
      if (b === a) break;
      for (; null === b.sibling; ) {
        if (null === b.return || b.return === a) return null;
        b = b.return;
      }
      b.sibling.return = b.return;
      b = b.sibling;
    }
    return null;
  }
  var Dh = [];
  function Eh() {
    for (var a = 0; a < Dh.length; a++) Dh[a]._workInProgressVersionPrimary = null;
    Dh.length = 0;
  }
  var Fh = ua.ReactCurrentDispatcher, Gh = ua.ReactCurrentBatchConfig, Hh = 0, M = null, N = null, O2 = null, Ih = false, Jh = false, Kh = 0, Lh = 0;
  function P() {
    throw Error(p(321));
  }
  function Mh(a, b) {
    if (null === b) return false;
    for (var c = 0; c < b.length && c < a.length; c++) if (!He2(a[c], b[c])) return false;
    return true;
  }
  function Nh(a, b, c, d, e, f) {
    Hh = f;
    M = b;
    b.memoizedState = null;
    b.updateQueue = null;
    b.lanes = 0;
    Fh.current = null === a || null === a.memoizedState ? Oh : Ph;
    a = c(d, e);
    if (Jh) {
      f = 0;
      do {
        Jh = false;
        Kh = 0;
        if (25 <= f) throw Error(p(301));
        f += 1;
        O2 = N = null;
        b.updateQueue = null;
        Fh.current = Qh;
        a = c(d, e);
      } while (Jh);
    }
    Fh.current = Rh;
    b = null !== N && null !== N.next;
    Hh = 0;
    O2 = N = M = null;
    Ih = false;
    if (b) throw Error(p(300));
    return a;
  }
  function Sh() {
    var a = 0 !== Kh;
    Kh = 0;
    return a;
  }
  function Th() {
    var a = { memoizedState: null, baseState: null, baseQueue: null, queue: null, next: null };
    null === O2 ? M.memoizedState = O2 = a : O2 = O2.next = a;
    return O2;
  }
  function Uh() {
    if (null === N) {
      var a = M.alternate;
      a = null !== a ? a.memoizedState : null;
    } else a = N.next;
    var b = null === O2 ? M.memoizedState : O2.next;
    if (null !== b) O2 = b, N = a;
    else {
      if (null === a) throw Error(p(310));
      N = a;
      a = { memoizedState: N.memoizedState, baseState: N.baseState, baseQueue: N.baseQueue, queue: N.queue, next: null };
      null === O2 ? M.memoizedState = O2 = a : O2 = O2.next = a;
    }
    return O2;
  }
  function Vh(a, b) {
    return "function" === typeof b ? b(a) : b;
  }
  function Wh(a) {
    var b = Uh(), c = b.queue;
    if (null === c) throw Error(p(311));
    c.lastRenderedReducer = a;
    var d = N, e = d.baseQueue, f = c.pending;
    if (null !== f) {
      if (null !== e) {
        var g = e.next;
        e.next = f.next;
        f.next = g;
      }
      d.baseQueue = e = f;
      c.pending = null;
    }
    if (null !== e) {
      f = e.next;
      d = d.baseState;
      var h = g = null, k = null, l = f;
      do {
        var m = l.lane;
        if ((Hh & m) === m) null !== k && (k = k.next = { lane: 0, action: l.action, hasEagerState: l.hasEagerState, eagerState: l.eagerState, next: null }), d = l.hasEagerState ? l.eagerState : a(d, l.action);
        else {
          var q2 = {
            lane: m,
            action: l.action,
            hasEagerState: l.hasEagerState,
            eagerState: l.eagerState,
            next: null
          };
          null === k ? (h = k = q2, g = d) : k = k.next = q2;
          M.lanes |= m;
          rh |= m;
        }
        l = l.next;
      } while (null !== l && l !== f);
      null === k ? g = d : k.next = h;
      He2(d, b.memoizedState) || (dh = true);
      b.memoizedState = d;
      b.baseState = g;
      b.baseQueue = k;
      c.lastRenderedState = d;
    }
    a = c.interleaved;
    if (null !== a) {
      e = a;
      do
        f = e.lane, M.lanes |= f, rh |= f, e = e.next;
      while (e !== a);
    } else null === e && (c.lanes = 0);
    return [b.memoizedState, c.dispatch];
  }
  function Xh(a) {
    var b = Uh(), c = b.queue;
    if (null === c) throw Error(p(311));
    c.lastRenderedReducer = a;
    var d = c.dispatch, e = c.pending, f = b.memoizedState;
    if (null !== e) {
      c.pending = null;
      var g = e = e.next;
      do
        f = a(f, g.action), g = g.next;
      while (g !== e);
      He2(f, b.memoizedState) || (dh = true);
      b.memoizedState = f;
      null === b.baseQueue && (b.baseState = f);
      c.lastRenderedState = f;
    }
    return [f, d];
  }
  function Yh() {
  }
  function Zh(a, b) {
    var c = M, d = Uh(), e = b(), f = !He2(d.memoizedState, e);
    f && (d.memoizedState = e, dh = true);
    d = d.queue;
    $h(ai.bind(null, c, d, a), [a]);
    if (d.getSnapshot !== b || f || null !== O2 && O2.memoizedState.tag & 1) {
      c.flags |= 2048;
      bi(9, ci.bind(null, c, d, e, b), void 0, null);
      if (null === Q) throw Error(p(349));
      0 !== (Hh & 30) || di(c, b, e);
    }
    return e;
  }
  function di(a, b, c) {
    a.flags |= 16384;
    a = { getSnapshot: b, value: c };
    b = M.updateQueue;
    null === b ? (b = { lastEffect: null, stores: null }, M.updateQueue = b, b.stores = [a]) : (c = b.stores, null === c ? b.stores = [a] : c.push(a));
  }
  function ci(a, b, c, d) {
    b.value = c;
    b.getSnapshot = d;
    ei(b) && fi(a);
  }
  function ai(a, b, c) {
    return c(function() {
      ei(b) && fi(a);
    });
  }
  function ei(a) {
    var b = a.getSnapshot;
    a = a.value;
    try {
      var c = b();
      return !He2(a, c);
    } catch (d) {
      return true;
    }
  }
  function fi(a) {
    var b = ih(a, 1);
    null !== b && gi(b, a, 1, -1);
  }
  function hi(a) {
    var b = Th();
    "function" === typeof a && (a = a());
    b.memoizedState = b.baseState = a;
    a = { pending: null, interleaved: null, lanes: 0, dispatch: null, lastRenderedReducer: Vh, lastRenderedState: a };
    b.queue = a;
    a = a.dispatch = ii.bind(null, M, a);
    return [b.memoizedState, a];
  }
  function bi(a, b, c, d) {
    a = { tag: a, create: b, destroy: c, deps: d, next: null };
    b = M.updateQueue;
    null === b ? (b = { lastEffect: null, stores: null }, M.updateQueue = b, b.lastEffect = a.next = a) : (c = b.lastEffect, null === c ? b.lastEffect = a.next = a : (d = c.next, c.next = a, a.next = d, b.lastEffect = a));
    return a;
  }
  function ji() {
    return Uh().memoizedState;
  }
  function ki(a, b, c, d) {
    var e = Th();
    M.flags |= a;
    e.memoizedState = bi(1 | b, c, void 0, void 0 === d ? null : d);
  }
  function li(a, b, c, d) {
    var e = Uh();
    d = void 0 === d ? null : d;
    var f = void 0;
    if (null !== N) {
      var g = N.memoizedState;
      f = g.destroy;
      if (null !== d && Mh(d, g.deps)) {
        e.memoizedState = bi(b, c, f, d);
        return;
      }
    }
    M.flags |= a;
    e.memoizedState = bi(1 | b, c, f, d);
  }
  function mi(a, b) {
    return ki(8390656, 8, a, b);
  }
  function $h(a, b) {
    return li(2048, 8, a, b);
  }
  function ni(a, b) {
    return li(4, 2, a, b);
  }
  function oi(a, b) {
    return li(4, 4, a, b);
  }
  function pi(a, b) {
    if ("function" === typeof b) return a = a(), b(a), function() {
      b(null);
    };
    if (null !== b && void 0 !== b) return a = a(), b.current = a, function() {
      b.current = null;
    };
  }
  function qi(a, b, c) {
    c = null !== c && void 0 !== c ? c.concat([a]) : null;
    return li(4, 4, pi.bind(null, b, a), c);
  }
  function ri() {
  }
  function si(a, b) {
    var c = Uh();
    b = void 0 === b ? null : b;
    var d = c.memoizedState;
    if (null !== d && null !== b && Mh(b, d[1])) return d[0];
    c.memoizedState = [a, b];
    return a;
  }
  function ti(a, b) {
    var c = Uh();
    b = void 0 === b ? null : b;
    var d = c.memoizedState;
    if (null !== d && null !== b && Mh(b, d[1])) return d[0];
    a = a();
    c.memoizedState = [a, b];
    return a;
  }
  function ui(a, b, c) {
    if (0 === (Hh & 21)) return a.baseState && (a.baseState = false, dh = true), a.memoizedState = c;
    He2(c, b) || (c = yc(), M.lanes |= c, rh |= c, a.baseState = true);
    return b;
  }
  function vi(a, b) {
    var c = C2;
    C2 = 0 !== c && 4 > c ? c : 4;
    a(true);
    var d = Gh.transition;
    Gh.transition = {};
    try {
      a(false), b();
    } finally {
      C2 = c, Gh.transition = d;
    }
  }
  function wi() {
    return Uh().memoizedState;
  }
  function xi(a, b, c) {
    var d = yi(a);
    c = { lane: d, action: c, hasEagerState: false, eagerState: null, next: null };
    if (zi(a)) Ai(b, c);
    else if (c = hh(a, b, c, d), null !== c) {
      var e = R();
      gi(c, a, d, e);
      Bi(c, b, d);
    }
  }
  function ii(a, b, c) {
    var d = yi(a), e = { lane: d, action: c, hasEagerState: false, eagerState: null, next: null };
    if (zi(a)) Ai(b, e);
    else {
      var f = a.alternate;
      if (0 === a.lanes && (null === f || 0 === f.lanes) && (f = b.lastRenderedReducer, null !== f)) try {
        var g = b.lastRenderedState, h = f(g, c);
        e.hasEagerState = true;
        e.eagerState = h;
        if (He2(h, g)) {
          var k = b.interleaved;
          null === k ? (e.next = e, gh(b)) : (e.next = k.next, k.next = e);
          b.interleaved = e;
          return;
        }
      } catch (l) {
      } finally {
      }
      c = hh(a, b, e, d);
      null !== c && (e = R(), gi(c, a, d, e), Bi(c, b, d));
    }
  }
  function zi(a) {
    var b = a.alternate;
    return a === M || null !== b && b === M;
  }
  function Ai(a, b) {
    Jh = Ih = true;
    var c = a.pending;
    null === c ? b.next = b : (b.next = c.next, c.next = b);
    a.pending = b;
  }
  function Bi(a, b, c) {
    if (0 !== (c & 4194240)) {
      var d = b.lanes;
      d &= a.pendingLanes;
      c |= d;
      b.lanes = c;
      Cc(a, c);
    }
  }
  var Rh = { readContext: eh, useCallback: P, useContext: P, useEffect: P, useImperativeHandle: P, useInsertionEffect: P, useLayoutEffect: P, useMemo: P, useReducer: P, useRef: P, useState: P, useDebugValue: P, useDeferredValue: P, useTransition: P, useMutableSource: P, useSyncExternalStore: P, useId: P, unstable_isNewReconciler: false }, Oh = { readContext: eh, useCallback: function(a, b) {
    Th().memoizedState = [a, void 0 === b ? null : b];
    return a;
  }, useContext: eh, useEffect: mi, useImperativeHandle: function(a, b, c) {
    c = null !== c && void 0 !== c ? c.concat([a]) : null;
    return ki(
      4194308,
      4,
      pi.bind(null, b, a),
      c
    );
  }, useLayoutEffect: function(a, b) {
    return ki(4194308, 4, a, b);
  }, useInsertionEffect: function(a, b) {
    return ki(4, 2, a, b);
  }, useMemo: function(a, b) {
    var c = Th();
    b = void 0 === b ? null : b;
    a = a();
    c.memoizedState = [a, b];
    return a;
  }, useReducer: function(a, b, c) {
    var d = Th();
    b = void 0 !== c ? c(b) : b;
    d.memoizedState = d.baseState = b;
    a = { pending: null, interleaved: null, lanes: 0, dispatch: null, lastRenderedReducer: a, lastRenderedState: b };
    d.queue = a;
    a = a.dispatch = xi.bind(null, M, a);
    return [d.memoizedState, a];
  }, useRef: function(a) {
    var b = Th();
    a = { current: a };
    return b.memoizedState = a;
  }, useState: hi, useDebugValue: ri, useDeferredValue: function(a) {
    return Th().memoizedState = a;
  }, useTransition: function() {
    var a = hi(false), b = a[0];
    a = vi.bind(null, a[1]);
    Th().memoizedState = a;
    return [b, a];
  }, useMutableSource: function() {
  }, useSyncExternalStore: function(a, b, c) {
    var d = M, e = Th();
    if (I2) {
      if (void 0 === c) throw Error(p(407));
      c = c();
    } else {
      c = b();
      if (null === Q) throw Error(p(349));
      0 !== (Hh & 30) || di(d, b, c);
    }
    e.memoizedState = c;
    var f = { value: c, getSnapshot: b };
    e.queue = f;
    mi(ai.bind(
      null,
      d,
      f,
      a
    ), [a]);
    d.flags |= 2048;
    bi(9, ci.bind(null, d, f, c, b), void 0, null);
    return c;
  }, useId: function() {
    var a = Th(), b = Q.identifierPrefix;
    if (I2) {
      var c = sg;
      var d = rg;
      c = (d & ~(1 << 32 - oc(d) - 1)).toString(32) + c;
      b = ":" + b + "R" + c;
      c = Kh++;
      0 < c && (b += "H" + c.toString(32));
      b += ":";
    } else c = Lh++, b = ":" + b + "r" + c.toString(32) + ":";
    return a.memoizedState = b;
  }, unstable_isNewReconciler: false }, Ph = {
    readContext: eh,
    useCallback: si,
    useContext: eh,
    useEffect: $h,
    useImperativeHandle: qi,
    useInsertionEffect: ni,
    useLayoutEffect: oi,
    useMemo: ti,
    useReducer: Wh,
    useRef: ji,
    useState: function() {
      return Wh(Vh);
    },
    useDebugValue: ri,
    useDeferredValue: function(a) {
      var b = Uh();
      return ui(b, N.memoizedState, a);
    },
    useTransition: function() {
      var a = Wh(Vh)[0], b = Uh().memoizedState;
      return [a, b];
    },
    useMutableSource: Yh,
    useSyncExternalStore: Zh,
    useId: wi,
    unstable_isNewReconciler: false
  }, Qh = { readContext: eh, useCallback: si, useContext: eh, useEffect: $h, useImperativeHandle: qi, useInsertionEffect: ni, useLayoutEffect: oi, useMemo: ti, useReducer: Xh, useRef: ji, useState: function() {
    return Xh(Vh);
  }, useDebugValue: ri, useDeferredValue: function(a) {
    var b = Uh();
    return null === N ? b.memoizedState = a : ui(b, N.memoizedState, a);
  }, useTransition: function() {
    var a = Xh(Vh)[0], b = Uh().memoizedState;
    return [a, b];
  }, useMutableSource: Yh, useSyncExternalStore: Zh, useId: wi, unstable_isNewReconciler: false };
  function Ci(a, b) {
    if (a && a.defaultProps) {
      b = A2({}, b);
      a = a.defaultProps;
      for (var c in a) void 0 === b[c] && (b[c] = a[c]);
      return b;
    }
    return b;
  }
  function Di(a, b, c, d) {
    b = a.memoizedState;
    c = c(d, b);
    c = null === c || void 0 === c ? b : A2({}, b, c);
    a.memoizedState = c;
    0 === a.lanes && (a.updateQueue.baseState = c);
  }
  var Ei = { isMounted: function(a) {
    return (a = a._reactInternals) ? Vb(a) === a : false;
  }, enqueueSetState: function(a, b, c) {
    a = a._reactInternals;
    var d = R(), e = yi(a), f = mh(d, e);
    f.payload = b;
    void 0 !== c && null !== c && (f.callback = c);
    b = nh(a, f, e);
    null !== b && (gi(b, a, e, d), oh(b, a, e));
  }, enqueueReplaceState: function(a, b, c) {
    a = a._reactInternals;
    var d = R(), e = yi(a), f = mh(d, e);
    f.tag = 1;
    f.payload = b;
    void 0 !== c && null !== c && (f.callback = c);
    b = nh(a, f, e);
    null !== b && (gi(b, a, e, d), oh(b, a, e));
  }, enqueueForceUpdate: function(a, b) {
    a = a._reactInternals;
    var c = R(), d = yi(a), e = mh(c, d);
    e.tag = 2;
    void 0 !== b && null !== b && (e.callback = b);
    b = nh(a, e, d);
    null !== b && (gi(b, a, d, c), oh(b, a, d));
  } };
  function Fi(a, b, c, d, e, f, g) {
    a = a.stateNode;
    return "function" === typeof a.shouldComponentUpdate ? a.shouldComponentUpdate(d, f, g) : b.prototype && b.prototype.isPureReactComponent ? !Ie2(c, d) || !Ie2(e, f) : true;
  }
  function Gi(a, b, c) {
    var d = false, e = Vf;
    var f = b.contextType;
    "object" === typeof f && null !== f ? f = eh(f) : (e = Zf(b) ? Xf : H2.current, d = b.contextTypes, f = (d = null !== d && void 0 !== d) ? Yf(a, e) : Vf);
    b = new b(c, f);
    a.memoizedState = null !== b.state && void 0 !== b.state ? b.state : null;
    b.updater = Ei;
    a.stateNode = b;
    b._reactInternals = a;
    d && (a = a.stateNode, a.__reactInternalMemoizedUnmaskedChildContext = e, a.__reactInternalMemoizedMaskedChildContext = f);
    return b;
  }
  function Hi(a, b, c, d) {
    a = b.state;
    "function" === typeof b.componentWillReceiveProps && b.componentWillReceiveProps(c, d);
    "function" === typeof b.UNSAFE_componentWillReceiveProps && b.UNSAFE_componentWillReceiveProps(c, d);
    b.state !== a && Ei.enqueueReplaceState(b, b.state, null);
  }
  function Ii(a, b, c, d) {
    var e = a.stateNode;
    e.props = c;
    e.state = a.memoizedState;
    e.refs = {};
    kh(a);
    var f = b.contextType;
    "object" === typeof f && null !== f ? e.context = eh(f) : (f = Zf(b) ? Xf : H2.current, e.context = Yf(a, f));
    e.state = a.memoizedState;
    f = b.getDerivedStateFromProps;
    "function" === typeof f && (Di(a, b, f, c), e.state = a.memoizedState);
    "function" === typeof b.getDerivedStateFromProps || "function" === typeof e.getSnapshotBeforeUpdate || "function" !== typeof e.UNSAFE_componentWillMount && "function" !== typeof e.componentWillMount || (b = e.state, "function" === typeof e.componentWillMount && e.componentWillMount(), "function" === typeof e.UNSAFE_componentWillMount && e.UNSAFE_componentWillMount(), b !== e.state && Ei.enqueueReplaceState(e, e.state, null), qh(a, c, e, d), e.state = a.memoizedState);
    "function" === typeof e.componentDidMount && (a.flags |= 4194308);
  }
  function Ji(a, b) {
    try {
      var c = "", d = b;
      do
        c += Pa(d), d = d.return;
      while (d);
      var e = c;
    } catch (f) {
      e = "\nError generating stack: " + f.message + "\n" + f.stack;
    }
    return { value: a, source: b, stack: e, digest: null };
  }
  function Ki(a, b, c) {
    return { value: a, source: null, stack: null != c ? c : null, digest: null != b ? b : null };
  }
  function Li(a, b) {
    try {
      console.error(b.value);
    } catch (c) {
      setTimeout(function() {
        throw c;
      });
    }
  }
  var Mi = "function" === typeof WeakMap ? WeakMap : Map;
  function Ni(a, b, c) {
    c = mh(-1, c);
    c.tag = 3;
    c.payload = { element: null };
    var d = b.value;
    c.callback = function() {
      Oi || (Oi = true, Pi = d);
      Li(a, b);
    };
    return c;
  }
  function Qi(a, b, c) {
    c = mh(-1, c);
    c.tag = 3;
    var d = a.type.getDerivedStateFromError;
    if ("function" === typeof d) {
      var e = b.value;
      c.payload = function() {
        return d(e);
      };
      c.callback = function() {
        Li(a, b);
      };
    }
    var f = a.stateNode;
    null !== f && "function" === typeof f.componentDidCatch && (c.callback = function() {
      Li(a, b);
      "function" !== typeof d && (null === Ri ? Ri = /* @__PURE__ */ new Set([this]) : Ri.add(this));
      var c2 = b.stack;
      this.componentDidCatch(b.value, { componentStack: null !== c2 ? c2 : "" });
    });
    return c;
  }
  function Si(a, b, c) {
    var d = a.pingCache;
    if (null === d) {
      d = a.pingCache = new Mi();
      var e = /* @__PURE__ */ new Set();
      d.set(b, e);
    } else e = d.get(b), void 0 === e && (e = /* @__PURE__ */ new Set(), d.set(b, e));
    e.has(c) || (e.add(c), a = Ti.bind(null, a, b, c), b.then(a, a));
  }
  function Ui(a) {
    do {
      var b;
      if (b = 13 === a.tag) b = a.memoizedState, b = null !== b ? null !== b.dehydrated ? true : false : true;
      if (b) return a;
      a = a.return;
    } while (null !== a);
    return null;
  }
  function Vi(a, b, c, d, e) {
    if (0 === (a.mode & 1)) return a === b ? a.flags |= 65536 : (a.flags |= 128, c.flags |= 131072, c.flags &= -52805, 1 === c.tag && (null === c.alternate ? c.tag = 17 : (b = mh(-1, 1), b.tag = 2, nh(c, b, 1))), c.lanes |= 1), a;
    a.flags |= 65536;
    a.lanes = e;
    return a;
  }
  var Wi = ua.ReactCurrentOwner, dh = false;
  function Xi(a, b, c, d) {
    b.child = null === a ? Vg(b, null, c, d) : Ug(b, a.child, c, d);
  }
  function Yi(a, b, c, d, e) {
    c = c.render;
    var f = b.ref;
    ch(b, e);
    d = Nh(a, b, c, d, f, e);
    c = Sh();
    if (null !== a && !dh) return b.updateQueue = a.updateQueue, b.flags &= -2053, a.lanes &= ~e, Zi(a, b, e);
    I2 && c && vg(b);
    b.flags |= 1;
    Xi(a, b, d, e);
    return b.child;
  }
  function $i(a, b, c, d, e) {
    if (null === a) {
      var f = c.type;
      if ("function" === typeof f && !aj(f) && void 0 === f.defaultProps && null === c.compare && void 0 === c.defaultProps) return b.tag = 15, b.type = f, bj(a, b, f, d, e);
      a = Rg(c.type, null, d, b, b.mode, e);
      a.ref = b.ref;
      a.return = b;
      return b.child = a;
    }
    f = a.child;
    if (0 === (a.lanes & e)) {
      var g = f.memoizedProps;
      c = c.compare;
      c = null !== c ? c : Ie2;
      if (c(g, d) && a.ref === b.ref) return Zi(a, b, e);
    }
    b.flags |= 1;
    a = Pg(f, d);
    a.ref = b.ref;
    a.return = b;
    return b.child = a;
  }
  function bj(a, b, c, d, e) {
    if (null !== a) {
      var f = a.memoizedProps;
      if (Ie2(f, d) && a.ref === b.ref) if (dh = false, b.pendingProps = d = f, 0 !== (a.lanes & e)) 0 !== (a.flags & 131072) && (dh = true);
      else return b.lanes = a.lanes, Zi(a, b, e);
    }
    return cj(a, b, c, d, e);
  }
  function dj(a, b, c) {
    var d = b.pendingProps, e = d.children, f = null !== a ? a.memoizedState : null;
    if ("hidden" === d.mode) if (0 === (b.mode & 1)) b.memoizedState = { baseLanes: 0, cachePool: null, transitions: null }, G(ej, fj), fj |= c;
    else {
      if (0 === (c & 1073741824)) return a = null !== f ? f.baseLanes | c : c, b.lanes = b.childLanes = 1073741824, b.memoizedState = { baseLanes: a, cachePool: null, transitions: null }, b.updateQueue = null, G(ej, fj), fj |= a, null;
      b.memoizedState = { baseLanes: 0, cachePool: null, transitions: null };
      d = null !== f ? f.baseLanes : c;
      G(ej, fj);
      fj |= d;
    }
    else null !== f ? (d = f.baseLanes | c, b.memoizedState = null) : d = c, G(ej, fj), fj |= d;
    Xi(a, b, e, c);
    return b.child;
  }
  function gj(a, b) {
    var c = b.ref;
    if (null === a && null !== c || null !== a && a.ref !== c) b.flags |= 512, b.flags |= 2097152;
  }
  function cj(a, b, c, d, e) {
    var f = Zf(c) ? Xf : H2.current;
    f = Yf(b, f);
    ch(b, e);
    c = Nh(a, b, c, d, f, e);
    d = Sh();
    if (null !== a && !dh) return b.updateQueue = a.updateQueue, b.flags &= -2053, a.lanes &= ~e, Zi(a, b, e);
    I2 && d && vg(b);
    b.flags |= 1;
    Xi(a, b, c, e);
    return b.child;
  }
  function hj(a, b, c, d, e) {
    if (Zf(c)) {
      var f = true;
      cg(b);
    } else f = false;
    ch(b, e);
    if (null === b.stateNode) ij(a, b), Gi(b, c, d), Ii(b, c, d, e), d = true;
    else if (null === a) {
      var g = b.stateNode, h = b.memoizedProps;
      g.props = h;
      var k = g.context, l = c.contextType;
      "object" === typeof l && null !== l ? l = eh(l) : (l = Zf(c) ? Xf : H2.current, l = Yf(b, l));
      var m = c.getDerivedStateFromProps, q2 = "function" === typeof m || "function" === typeof g.getSnapshotBeforeUpdate;
      q2 || "function" !== typeof g.UNSAFE_componentWillReceiveProps && "function" !== typeof g.componentWillReceiveProps || (h !== d || k !== l) && Hi(b, g, d, l);
      jh = false;
      var r = b.memoizedState;
      g.state = r;
      qh(b, d, g, e);
      k = b.memoizedState;
      h !== d || r !== k || Wf.current || jh ? ("function" === typeof m && (Di(b, c, m, d), k = b.memoizedState), (h = jh || Fi(b, c, h, d, r, k, l)) ? (q2 || "function" !== typeof g.UNSAFE_componentWillMount && "function" !== typeof g.componentWillMount || ("function" === typeof g.componentWillMount && g.componentWillMount(), "function" === typeof g.UNSAFE_componentWillMount && g.UNSAFE_componentWillMount()), "function" === typeof g.componentDidMount && (b.flags |= 4194308)) : ("function" === typeof g.componentDidMount && (b.flags |= 4194308), b.memoizedProps = d, b.memoizedState = k), g.props = d, g.state = k, g.context = l, d = h) : ("function" === typeof g.componentDidMount && (b.flags |= 4194308), d = false);
    } else {
      g = b.stateNode;
      lh(a, b);
      h = b.memoizedProps;
      l = b.type === b.elementType ? h : Ci(b.type, h);
      g.props = l;
      q2 = b.pendingProps;
      r = g.context;
      k = c.contextType;
      "object" === typeof k && null !== k ? k = eh(k) : (k = Zf(c) ? Xf : H2.current, k = Yf(b, k));
      var y = c.getDerivedStateFromProps;
      (m = "function" === typeof y || "function" === typeof g.getSnapshotBeforeUpdate) || "function" !== typeof g.UNSAFE_componentWillReceiveProps && "function" !== typeof g.componentWillReceiveProps || (h !== q2 || r !== k) && Hi(b, g, d, k);
      jh = false;
      r = b.memoizedState;
      g.state = r;
      qh(b, d, g, e);
      var n = b.memoizedState;
      h !== q2 || r !== n || Wf.current || jh ? ("function" === typeof y && (Di(b, c, y, d), n = b.memoizedState), (l = jh || Fi(b, c, l, d, r, n, k) || false) ? (m || "function" !== typeof g.UNSAFE_componentWillUpdate && "function" !== typeof g.componentWillUpdate || ("function" === typeof g.componentWillUpdate && g.componentWillUpdate(d, n, k), "function" === typeof g.UNSAFE_componentWillUpdate && g.UNSAFE_componentWillUpdate(d, n, k)), "function" === typeof g.componentDidUpdate && (b.flags |= 4), "function" === typeof g.getSnapshotBeforeUpdate && (b.flags |= 1024)) : ("function" !== typeof g.componentDidUpdate || h === a.memoizedProps && r === a.memoizedState || (b.flags |= 4), "function" !== typeof g.getSnapshotBeforeUpdate || h === a.memoizedProps && r === a.memoizedState || (b.flags |= 1024), b.memoizedProps = d, b.memoizedState = n), g.props = d, g.state = n, g.context = k, d = l) : ("function" !== typeof g.componentDidUpdate || h === a.memoizedProps && r === a.memoizedState || (b.flags |= 4), "function" !== typeof g.getSnapshotBeforeUpdate || h === a.memoizedProps && r === a.memoizedState || (b.flags |= 1024), d = false);
    }
    return jj(a, b, c, d, f, e);
  }
  function jj(a, b, c, d, e, f) {
    gj(a, b);
    var g = 0 !== (b.flags & 128);
    if (!d && !g) return e && dg(b, c, false), Zi(a, b, f);
    d = b.stateNode;
    Wi.current = b;
    var h = g && "function" !== typeof c.getDerivedStateFromError ? null : d.render();
    b.flags |= 1;
    null !== a && g ? (b.child = Ug(b, a.child, null, f), b.child = Ug(b, null, h, f)) : Xi(a, b, h, f);
    b.memoizedState = d.state;
    e && dg(b, c, true);
    return b.child;
  }
  function kj(a) {
    var b = a.stateNode;
    b.pendingContext ? ag(a, b.pendingContext, b.pendingContext !== b.context) : b.context && ag(a, b.context, false);
    yh(a, b.containerInfo);
  }
  function lj(a, b, c, d, e) {
    Ig();
    Jg(e);
    b.flags |= 256;
    Xi(a, b, c, d);
    return b.child;
  }
  var mj = { dehydrated: null, treeContext: null, retryLane: 0 };
  function nj(a) {
    return { baseLanes: a, cachePool: null, transitions: null };
  }
  function oj(a, b, c) {
    var d = b.pendingProps, e = L.current, f = false, g = 0 !== (b.flags & 128), h;
    (h = g) || (h = null !== a && null === a.memoizedState ? false : 0 !== (e & 2));
    if (h) f = true, b.flags &= -129;
    else if (null === a || null !== a.memoizedState) e |= 1;
    G(L, e & 1);
    if (null === a) {
      Eg(b);
      a = b.memoizedState;
      if (null !== a && (a = a.dehydrated, null !== a)) return 0 === (b.mode & 1) ? b.lanes = 1 : "$!" === a.data ? b.lanes = 8 : b.lanes = 1073741824, null;
      g = d.children;
      a = d.fallback;
      return f ? (d = b.mode, f = b.child, g = { mode: "hidden", children: g }, 0 === (d & 1) && null !== f ? (f.childLanes = 0, f.pendingProps = g) : f = pj(g, d, 0, null), a = Tg(a, d, c, null), f.return = b, a.return = b, f.sibling = a, b.child = f, b.child.memoizedState = nj(c), b.memoizedState = mj, a) : qj(b, g);
    }
    e = a.memoizedState;
    if (null !== e && (h = e.dehydrated, null !== h)) return rj(a, b, g, d, h, e, c);
    if (f) {
      f = d.fallback;
      g = b.mode;
      e = a.child;
      h = e.sibling;
      var k = { mode: "hidden", children: d.children };
      0 === (g & 1) && b.child !== e ? (d = b.child, d.childLanes = 0, d.pendingProps = k, b.deletions = null) : (d = Pg(e, k), d.subtreeFlags = e.subtreeFlags & 14680064);
      null !== h ? f = Pg(h, f) : (f = Tg(f, g, c, null), f.flags |= 2);
      f.return = b;
      d.return = b;
      d.sibling = f;
      b.child = d;
      d = f;
      f = b.child;
      g = a.child.memoizedState;
      g = null === g ? nj(c) : { baseLanes: g.baseLanes | c, cachePool: null, transitions: g.transitions };
      f.memoizedState = g;
      f.childLanes = a.childLanes & ~c;
      b.memoizedState = mj;
      return d;
    }
    f = a.child;
    a = f.sibling;
    d = Pg(f, { mode: "visible", children: d.children });
    0 === (b.mode & 1) && (d.lanes = c);
    d.return = b;
    d.sibling = null;
    null !== a && (c = b.deletions, null === c ? (b.deletions = [a], b.flags |= 16) : c.push(a));
    b.child = d;
    b.memoizedState = null;
    return d;
  }
  function qj(a, b) {
    b = pj({ mode: "visible", children: b }, a.mode, 0, null);
    b.return = a;
    return a.child = b;
  }
  function sj(a, b, c, d) {
    null !== d && Jg(d);
    Ug(b, a.child, null, c);
    a = qj(b, b.pendingProps.children);
    a.flags |= 2;
    b.memoizedState = null;
    return a;
  }
  function rj(a, b, c, d, e, f, g) {
    if (c) {
      if (b.flags & 256) return b.flags &= -257, d = Ki(Error(p(422))), sj(a, b, g, d);
      if (null !== b.memoizedState) return b.child = a.child, b.flags |= 128, null;
      f = d.fallback;
      e = b.mode;
      d = pj({ mode: "visible", children: d.children }, e, 0, null);
      f = Tg(f, e, g, null);
      f.flags |= 2;
      d.return = b;
      f.return = b;
      d.sibling = f;
      b.child = d;
      0 !== (b.mode & 1) && Ug(b, a.child, null, g);
      b.child.memoizedState = nj(g);
      b.memoizedState = mj;
      return f;
    }
    if (0 === (b.mode & 1)) return sj(a, b, g, null);
    if ("$!" === e.data) {
      d = e.nextSibling && e.nextSibling.dataset;
      if (d) var h = d.dgst;
      d = h;
      f = Error(p(419));
      d = Ki(f, d, void 0);
      return sj(a, b, g, d);
    }
    h = 0 !== (g & a.childLanes);
    if (dh || h) {
      d = Q;
      if (null !== d) {
        switch (g & -g) {
          case 4:
            e = 2;
            break;
          case 16:
            e = 8;
            break;
          case 64:
          case 128:
          case 256:
          case 512:
          case 1024:
          case 2048:
          case 4096:
          case 8192:
          case 16384:
          case 32768:
          case 65536:
          case 131072:
          case 262144:
          case 524288:
          case 1048576:
          case 2097152:
          case 4194304:
          case 8388608:
          case 16777216:
          case 33554432:
          case 67108864:
            e = 32;
            break;
          case 536870912:
            e = 268435456;
            break;
          default:
            e = 0;
        }
        e = 0 !== (e & (d.suspendedLanes | g)) ? 0 : e;
        0 !== e && e !== f.retryLane && (f.retryLane = e, ih(a, e), gi(d, a, e, -1));
      }
      tj();
      d = Ki(Error(p(421)));
      return sj(a, b, g, d);
    }
    if ("$?" === e.data) return b.flags |= 128, b.child = a.child, b = uj.bind(null, a), e._reactRetry = b, null;
    a = f.treeContext;
    yg = Lf(e.nextSibling);
    xg = b;
    I2 = true;
    zg = null;
    null !== a && (og[pg++] = rg, og[pg++] = sg, og[pg++] = qg, rg = a.id, sg = a.overflow, qg = b);
    b = qj(b, d.children);
    b.flags |= 4096;
    return b;
  }
  function vj(a, b, c) {
    a.lanes |= b;
    var d = a.alternate;
    null !== d && (d.lanes |= b);
    bh(a.return, b, c);
  }
  function wj(a, b, c, d, e) {
    var f = a.memoizedState;
    null === f ? a.memoizedState = { isBackwards: b, rendering: null, renderingStartTime: 0, last: d, tail: c, tailMode: e } : (f.isBackwards = b, f.rendering = null, f.renderingStartTime = 0, f.last = d, f.tail = c, f.tailMode = e);
  }
  function xj(a, b, c) {
    var d = b.pendingProps, e = d.revealOrder, f = d.tail;
    Xi(a, b, d.children, c);
    d = L.current;
    if (0 !== (d & 2)) d = d & 1 | 2, b.flags |= 128;
    else {
      if (null !== a && 0 !== (a.flags & 128)) a: for (a = b.child; null !== a; ) {
        if (13 === a.tag) null !== a.memoizedState && vj(a, c, b);
        else if (19 === a.tag) vj(a, c, b);
        else if (null !== a.child) {
          a.child.return = a;
          a = a.child;
          continue;
        }
        if (a === b) break a;
        for (; null === a.sibling; ) {
          if (null === a.return || a.return === b) break a;
          a = a.return;
        }
        a.sibling.return = a.return;
        a = a.sibling;
      }
      d &= 1;
    }
    G(L, d);
    if (0 === (b.mode & 1)) b.memoizedState = null;
    else switch (e) {
      case "forwards":
        c = b.child;
        for (e = null; null !== c; ) a = c.alternate, null !== a && null === Ch(a) && (e = c), c = c.sibling;
        c = e;
        null === c ? (e = b.child, b.child = null) : (e = c.sibling, c.sibling = null);
        wj(b, false, e, c, f);
        break;
      case "backwards":
        c = null;
        e = b.child;
        for (b.child = null; null !== e; ) {
          a = e.alternate;
          if (null !== a && null === Ch(a)) {
            b.child = e;
            break;
          }
          a = e.sibling;
          e.sibling = c;
          c = e;
          e = a;
        }
        wj(b, true, c, null, f);
        break;
      case "together":
        wj(b, false, null, null, void 0);
        break;
      default:
        b.memoizedState = null;
    }
    return b.child;
  }
  function ij(a, b) {
    0 === (b.mode & 1) && null !== a && (a.alternate = null, b.alternate = null, b.flags |= 2);
  }
  function Zi(a, b, c) {
    null !== a && (b.dependencies = a.dependencies);
    rh |= b.lanes;
    if (0 === (c & b.childLanes)) return null;
    if (null !== a && b.child !== a.child) throw Error(p(153));
    if (null !== b.child) {
      a = b.child;
      c = Pg(a, a.pendingProps);
      b.child = c;
      for (c.return = b; null !== a.sibling; ) a = a.sibling, c = c.sibling = Pg(a, a.pendingProps), c.return = b;
      c.sibling = null;
    }
    return b.child;
  }
  function yj(a, b, c) {
    switch (b.tag) {
      case 3:
        kj(b);
        Ig();
        break;
      case 5:
        Ah(b);
        break;
      case 1:
        Zf(b.type) && cg(b);
        break;
      case 4:
        yh(b, b.stateNode.containerInfo);
        break;
      case 10:
        var d = b.type._context, e = b.memoizedProps.value;
        G(Wg, d._currentValue);
        d._currentValue = e;
        break;
      case 13:
        d = b.memoizedState;
        if (null !== d) {
          if (null !== d.dehydrated) return G(L, L.current & 1), b.flags |= 128, null;
          if (0 !== (c & b.child.childLanes)) return oj(a, b, c);
          G(L, L.current & 1);
          a = Zi(a, b, c);
          return null !== a ? a.sibling : null;
        }
        G(L, L.current & 1);
        break;
      case 19:
        d = 0 !== (c & b.childLanes);
        if (0 !== (a.flags & 128)) {
          if (d) return xj(a, b, c);
          b.flags |= 128;
        }
        e = b.memoizedState;
        null !== e && (e.rendering = null, e.tail = null, e.lastEffect = null);
        G(L, L.current);
        if (d) break;
        else return null;
      case 22:
      case 23:
        return b.lanes = 0, dj(a, b, c);
    }
    return Zi(a, b, c);
  }
  var zj, Aj, Bj, Cj;
  zj = function(a, b) {
    for (var c = b.child; null !== c; ) {
      if (5 === c.tag || 6 === c.tag) a.appendChild(c.stateNode);
      else if (4 !== c.tag && null !== c.child) {
        c.child.return = c;
        c = c.child;
        continue;
      }
      if (c === b) break;
      for (; null === c.sibling; ) {
        if (null === c.return || c.return === b) return;
        c = c.return;
      }
      c.sibling.return = c.return;
      c = c.sibling;
    }
  };
  Aj = function() {
  };
  Bj = function(a, b, c, d) {
    var e = a.memoizedProps;
    if (e !== d) {
      a = b.stateNode;
      xh(uh.current);
      var f = null;
      switch (c) {
        case "input":
          e = Ya(a, e);
          d = Ya(a, d);
          f = [];
          break;
        case "select":
          e = A2({}, e, { value: void 0 });
          d = A2({}, d, { value: void 0 });
          f = [];
          break;
        case "textarea":
          e = gb(a, e);
          d = gb(a, d);
          f = [];
          break;
        default:
          "function" !== typeof e.onClick && "function" === typeof d.onClick && (a.onclick = Bf);
      }
      ub(c, d);
      var g;
      c = null;
      for (l in e) if (!d.hasOwnProperty(l) && e.hasOwnProperty(l) && null != e[l]) if ("style" === l) {
        var h = e[l];
        for (g in h) h.hasOwnProperty(g) && (c || (c = {}), c[g] = "");
      } else "dangerouslySetInnerHTML" !== l && "children" !== l && "suppressContentEditableWarning" !== l && "suppressHydrationWarning" !== l && "autoFocus" !== l && (ea.hasOwnProperty(l) ? f || (f = []) : (f = f || []).push(l, null));
      for (l in d) {
        var k = d[l];
        h = null != e ? e[l] : void 0;
        if (d.hasOwnProperty(l) && k !== h && (null != k || null != h)) if ("style" === l) if (h) {
          for (g in h) !h.hasOwnProperty(g) || k && k.hasOwnProperty(g) || (c || (c = {}), c[g] = "");
          for (g in k) k.hasOwnProperty(g) && h[g] !== k[g] && (c || (c = {}), c[g] = k[g]);
        } else c || (f || (f = []), f.push(
          l,
          c
        )), c = k;
        else "dangerouslySetInnerHTML" === l ? (k = k ? k.__html : void 0, h = h ? h.__html : void 0, null != k && h !== k && (f = f || []).push(l, k)) : "children" === l ? "string" !== typeof k && "number" !== typeof k || (f = f || []).push(l, "" + k) : "suppressContentEditableWarning" !== l && "suppressHydrationWarning" !== l && (ea.hasOwnProperty(l) ? (null != k && "onScroll" === l && D2("scroll", a), f || h === k || (f = [])) : (f = f || []).push(l, k));
      }
      c && (f = f || []).push("style", c);
      var l = f;
      if (b.updateQueue = l) b.flags |= 4;
    }
  };
  Cj = function(a, b, c, d) {
    c !== d && (b.flags |= 4);
  };
  function Dj(a, b) {
    if (!I2) switch (a.tailMode) {
      case "hidden":
        b = a.tail;
        for (var c = null; null !== b; ) null !== b.alternate && (c = b), b = b.sibling;
        null === c ? a.tail = null : c.sibling = null;
        break;
      case "collapsed":
        c = a.tail;
        for (var d = null; null !== c; ) null !== c.alternate && (d = c), c = c.sibling;
        null === d ? b || null === a.tail ? a.tail = null : a.tail.sibling = null : d.sibling = null;
    }
  }
  function S(a) {
    var b = null !== a.alternate && a.alternate.child === a.child, c = 0, d = 0;
    if (b) for (var e = a.child; null !== e; ) c |= e.lanes | e.childLanes, d |= e.subtreeFlags & 14680064, d |= e.flags & 14680064, e.return = a, e = e.sibling;
    else for (e = a.child; null !== e; ) c |= e.lanes | e.childLanes, d |= e.subtreeFlags, d |= e.flags, e.return = a, e = e.sibling;
    a.subtreeFlags |= d;
    a.childLanes = c;
    return b;
  }
  function Ej(a, b, c) {
    var d = b.pendingProps;
    wg(b);
    switch (b.tag) {
      case 2:
      case 16:
      case 15:
      case 0:
      case 11:
      case 7:
      case 8:
      case 12:
      case 9:
      case 14:
        return S(b), null;
      case 1:
        return Zf(b.type) && $f(), S(b), null;
      case 3:
        d = b.stateNode;
        zh();
        E(Wf);
        E(H2);
        Eh();
        d.pendingContext && (d.context = d.pendingContext, d.pendingContext = null);
        if (null === a || null === a.child) Gg(b) ? b.flags |= 4 : null === a || a.memoizedState.isDehydrated && 0 === (b.flags & 256) || (b.flags |= 1024, null !== zg && (Fj(zg), zg = null));
        Aj(a, b);
        S(b);
        return null;
      case 5:
        Bh(b);
        var e = xh(wh.current);
        c = b.type;
        if (null !== a && null != b.stateNode) Bj(a, b, c, d, e), a.ref !== b.ref && (b.flags |= 512, b.flags |= 2097152);
        else {
          if (!d) {
            if (null === b.stateNode) throw Error(p(166));
            S(b);
            return null;
          }
          a = xh(uh.current);
          if (Gg(b)) {
            d = b.stateNode;
            c = b.type;
            var f = b.memoizedProps;
            d[Of] = b;
            d[Pf] = f;
            a = 0 !== (b.mode & 1);
            switch (c) {
              case "dialog":
                D2("cancel", d);
                D2("close", d);
                break;
              case "iframe":
              case "object":
              case "embed":
                D2("load", d);
                break;
              case "video":
              case "audio":
                for (e = 0; e < lf.length; e++) D2(lf[e], d);
                break;
              case "source":
                D2("error", d);
                break;
              case "img":
              case "image":
              case "link":
                D2(
                  "error",
                  d
                );
                D2("load", d);
                break;
              case "details":
                D2("toggle", d);
                break;
              case "input":
                Za(d, f);
                D2("invalid", d);
                break;
              case "select":
                d._wrapperState = { wasMultiple: !!f.multiple };
                D2("invalid", d);
                break;
              case "textarea":
                hb(d, f), D2("invalid", d);
            }
            ub(c, f);
            e = null;
            for (var g in f) if (f.hasOwnProperty(g)) {
              var h = f[g];
              "children" === g ? "string" === typeof h ? d.textContent !== h && (true !== f.suppressHydrationWarning && Af(d.textContent, h, a), e = ["children", h]) : "number" === typeof h && d.textContent !== "" + h && (true !== f.suppressHydrationWarning && Af(
                d.textContent,
                h,
                a
              ), e = ["children", "" + h]) : ea.hasOwnProperty(g) && null != h && "onScroll" === g && D2("scroll", d);
            }
            switch (c) {
              case "input":
                Va(d);
                db(d, f, true);
                break;
              case "textarea":
                Va(d);
                jb(d);
                break;
              case "select":
              case "option":
                break;
              default:
                "function" === typeof f.onClick && (d.onclick = Bf);
            }
            d = e;
            b.updateQueue = d;
            null !== d && (b.flags |= 4);
          } else {
            g = 9 === e.nodeType ? e : e.ownerDocument;
            "http://www.w3.org/1999/xhtml" === a && (a = kb(c));
            "http://www.w3.org/1999/xhtml" === a ? "script" === c ? (a = g.createElement("div"), a.innerHTML = "<script><\/script>", a = a.removeChild(a.firstChild)) : "string" === typeof d.is ? a = g.createElement(c, { is: d.is }) : (a = g.createElement(c), "select" === c && (g = a, d.multiple ? g.multiple = true : d.size && (g.size = d.size))) : a = g.createElementNS(a, c);
            a[Of] = b;
            a[Pf] = d;
            zj(a, b, false, false);
            b.stateNode = a;
            a: {
              g = vb(c, d);
              switch (c) {
                case "dialog":
                  D2("cancel", a);
                  D2("close", a);
                  e = d;
                  break;
                case "iframe":
                case "object":
                case "embed":
                  D2("load", a);
                  e = d;
                  break;
                case "video":
                case "audio":
                  for (e = 0; e < lf.length; e++) D2(lf[e], a);
                  e = d;
                  break;
                case "source":
                  D2("error", a);
                  e = d;
                  break;
                case "img":
                case "image":
                case "link":
                  D2(
                    "error",
                    a
                  );
                  D2("load", a);
                  e = d;
                  break;
                case "details":
                  D2("toggle", a);
                  e = d;
                  break;
                case "input":
                  Za(a, d);
                  e = Ya(a, d);
                  D2("invalid", a);
                  break;
                case "option":
                  e = d;
                  break;
                case "select":
                  a._wrapperState = { wasMultiple: !!d.multiple };
                  e = A2({}, d, { value: void 0 });
                  D2("invalid", a);
                  break;
                case "textarea":
                  hb(a, d);
                  e = gb(a, d);
                  D2("invalid", a);
                  break;
                default:
                  e = d;
              }
              ub(c, e);
              h = e;
              for (f in h) if (h.hasOwnProperty(f)) {
                var k = h[f];
                "style" === f ? sb(a, k) : "dangerouslySetInnerHTML" === f ? (k = k ? k.__html : void 0, null != k && nb(a, k)) : "children" === f ? "string" === typeof k ? ("textarea" !== c || "" !== k) && ob(a, k) : "number" === typeof k && ob(a, "" + k) : "suppressContentEditableWarning" !== f && "suppressHydrationWarning" !== f && "autoFocus" !== f && (ea.hasOwnProperty(f) ? null != k && "onScroll" === f && D2("scroll", a) : null != k && ta(a, f, k, g));
              }
              switch (c) {
                case "input":
                  Va(a);
                  db(a, d, false);
                  break;
                case "textarea":
                  Va(a);
                  jb(a);
                  break;
                case "option":
                  null != d.value && a.setAttribute("value", "" + Sa(d.value));
                  break;
                case "select":
                  a.multiple = !!d.multiple;
                  f = d.value;
                  null != f ? fb(a, !!d.multiple, f, false) : null != d.defaultValue && fb(
                    a,
                    !!d.multiple,
                    d.defaultValue,
                    true
                  );
                  break;
                default:
                  "function" === typeof e.onClick && (a.onclick = Bf);
              }
              switch (c) {
                case "button":
                case "input":
                case "select":
                case "textarea":
                  d = !!d.autoFocus;
                  break a;
                case "img":
                  d = true;
                  break a;
                default:
                  d = false;
              }
            }
            d && (b.flags |= 4);
          }
          null !== b.ref && (b.flags |= 512, b.flags |= 2097152);
        }
        S(b);
        return null;
      case 6:
        if (a && null != b.stateNode) Cj(a, b, a.memoizedProps, d);
        else {
          if ("string" !== typeof d && null === b.stateNode) throw Error(p(166));
          c = xh(wh.current);
          xh(uh.current);
          if (Gg(b)) {
            d = b.stateNode;
            c = b.memoizedProps;
            d[Of] = b;
            if (f = d.nodeValue !== c) {
              if (a = xg, null !== a) switch (a.tag) {
                case 3:
                  Af(d.nodeValue, c, 0 !== (a.mode & 1));
                  break;
                case 5:
                  true !== a.memoizedProps.suppressHydrationWarning && Af(d.nodeValue, c, 0 !== (a.mode & 1));
              }
            }
            f && (b.flags |= 4);
          } else d = (9 === c.nodeType ? c : c.ownerDocument).createTextNode(d), d[Of] = b, b.stateNode = d;
        }
        S(b);
        return null;
      case 13:
        E(L);
        d = b.memoizedState;
        if (null === a || null !== a.memoizedState && null !== a.memoizedState.dehydrated) {
          if (I2 && null !== yg && 0 !== (b.mode & 1) && 0 === (b.flags & 128)) Hg(), Ig(), b.flags |= 98560, f = false;
          else if (f = Gg(b), null !== d && null !== d.dehydrated) {
            if (null === a) {
              if (!f) throw Error(p(318));
              f = b.memoizedState;
              f = null !== f ? f.dehydrated : null;
              if (!f) throw Error(p(317));
              f[Of] = b;
            } else Ig(), 0 === (b.flags & 128) && (b.memoizedState = null), b.flags |= 4;
            S(b);
            f = false;
          } else null !== zg && (Fj(zg), zg = null), f = true;
          if (!f) return b.flags & 65536 ? b : null;
        }
        if (0 !== (b.flags & 128)) return b.lanes = c, b;
        d = null !== d;
        d !== (null !== a && null !== a.memoizedState) && d && (b.child.flags |= 8192, 0 !== (b.mode & 1) && (null === a || 0 !== (L.current & 1) ? 0 === T2 && (T2 = 3) : tj()));
        null !== b.updateQueue && (b.flags |= 4);
        S(b);
        return null;
      case 4:
        return zh(), Aj(a, b), null === a && sf(b.stateNode.containerInfo), S(b), null;
      case 10:
        return ah(b.type._context), S(b), null;
      case 17:
        return Zf(b.type) && $f(), S(b), null;
      case 19:
        E(L);
        f = b.memoizedState;
        if (null === f) return S(b), null;
        d = 0 !== (b.flags & 128);
        g = f.rendering;
        if (null === g) if (d) Dj(f, false);
        else {
          if (0 !== T2 || null !== a && 0 !== (a.flags & 128)) for (a = b.child; null !== a; ) {
            g = Ch(a);
            if (null !== g) {
              b.flags |= 128;
              Dj(f, false);
              d = g.updateQueue;
              null !== d && (b.updateQueue = d, b.flags |= 4);
              b.subtreeFlags = 0;
              d = c;
              for (c = b.child; null !== c; ) f = c, a = d, f.flags &= 14680066, g = f.alternate, null === g ? (f.childLanes = 0, f.lanes = a, f.child = null, f.subtreeFlags = 0, f.memoizedProps = null, f.memoizedState = null, f.updateQueue = null, f.dependencies = null, f.stateNode = null) : (f.childLanes = g.childLanes, f.lanes = g.lanes, f.child = g.child, f.subtreeFlags = 0, f.deletions = null, f.memoizedProps = g.memoizedProps, f.memoizedState = g.memoizedState, f.updateQueue = g.updateQueue, f.type = g.type, a = g.dependencies, f.dependencies = null === a ? null : { lanes: a.lanes, firstContext: a.firstContext }), c = c.sibling;
              G(L, L.current & 1 | 2);
              return b.child;
            }
            a = a.sibling;
          }
          null !== f.tail && B2() > Gj && (b.flags |= 128, d = true, Dj(f, false), b.lanes = 4194304);
        }
        else {
          if (!d) if (a = Ch(g), null !== a) {
            if (b.flags |= 128, d = true, c = a.updateQueue, null !== c && (b.updateQueue = c, b.flags |= 4), Dj(f, true), null === f.tail && "hidden" === f.tailMode && !g.alternate && !I2) return S(b), null;
          } else 2 * B2() - f.renderingStartTime > Gj && 1073741824 !== c && (b.flags |= 128, d = true, Dj(f, false), b.lanes = 4194304);
          f.isBackwards ? (g.sibling = b.child, b.child = g) : (c = f.last, null !== c ? c.sibling = g : b.child = g, f.last = g);
        }
        if (null !== f.tail) return b = f.tail, f.rendering = b, f.tail = b.sibling, f.renderingStartTime = B2(), b.sibling = null, c = L.current, G(L, d ? c & 1 | 2 : c & 1), b;
        S(b);
        return null;
      case 22:
      case 23:
        return Hj(), d = null !== b.memoizedState, null !== a && null !== a.memoizedState !== d && (b.flags |= 8192), d && 0 !== (b.mode & 1) ? 0 !== (fj & 1073741824) && (S(b), b.subtreeFlags & 6 && (b.flags |= 8192)) : S(b), null;
      case 24:
        return null;
      case 25:
        return null;
    }
    throw Error(p(156, b.tag));
  }
  function Ij(a, b) {
    wg(b);
    switch (b.tag) {
      case 1:
        return Zf(b.type) && $f(), a = b.flags, a & 65536 ? (b.flags = a & -65537 | 128, b) : null;
      case 3:
        return zh(), E(Wf), E(H2), Eh(), a = b.flags, 0 !== (a & 65536) && 0 === (a & 128) ? (b.flags = a & -65537 | 128, b) : null;
      case 5:
        return Bh(b), null;
      case 13:
        E(L);
        a = b.memoizedState;
        if (null !== a && null !== a.dehydrated) {
          if (null === b.alternate) throw Error(p(340));
          Ig();
        }
        a = b.flags;
        return a & 65536 ? (b.flags = a & -65537 | 128, b) : null;
      case 19:
        return E(L), null;
      case 4:
        return zh(), null;
      case 10:
        return ah(b.type._context), null;
      case 22:
      case 23:
        return Hj(), null;
      case 24:
        return null;
      default:
        return null;
    }
  }
  var Jj = false, U2 = false, Kj = "function" === typeof WeakSet ? WeakSet : Set, V = null;
  function Lj(a, b) {
    var c = a.ref;
    if (null !== c) if ("function" === typeof c) try {
      c(null);
    } catch (d) {
      W2(a, b, d);
    }
    else c.current = null;
  }
  function Mj(a, b, c) {
    try {
      c();
    } catch (d) {
      W2(a, b, d);
    }
  }
  var Nj = false;
  function Oj(a, b) {
    Cf = dd;
    a = Me2();
    if (Ne2(a)) {
      if ("selectionStart" in a) var c = { start: a.selectionStart, end: a.selectionEnd };
      else a: {
        c = (c = a.ownerDocument) && c.defaultView || window;
        var d = c.getSelection && c.getSelection();
        if (d && 0 !== d.rangeCount) {
          c = d.anchorNode;
          var e = d.anchorOffset, f = d.focusNode;
          d = d.focusOffset;
          try {
            c.nodeType, f.nodeType;
          } catch (F2) {
            c = null;
            break a;
          }
          var g = 0, h = -1, k = -1, l = 0, m = 0, q2 = a, r = null;
          b: for (; ; ) {
            for (var y; ; ) {
              q2 !== c || 0 !== e && 3 !== q2.nodeType || (h = g + e);
              q2 !== f || 0 !== d && 3 !== q2.nodeType || (k = g + d);
              3 === q2.nodeType && (g += q2.nodeValue.length);
              if (null === (y = q2.firstChild)) break;
              r = q2;
              q2 = y;
            }
            for (; ; ) {
              if (q2 === a) break b;
              r === c && ++l === e && (h = g);
              r === f && ++m === d && (k = g);
              if (null !== (y = q2.nextSibling)) break;
              q2 = r;
              r = q2.parentNode;
            }
            q2 = y;
          }
          c = -1 === h || -1 === k ? null : { start: h, end: k };
        } else c = null;
      }
      c = c || { start: 0, end: 0 };
    } else c = null;
    Df = { focusedElem: a, selectionRange: c };
    dd = false;
    for (V = b; null !== V; ) if (b = V, a = b.child, 0 !== (b.subtreeFlags & 1028) && null !== a) a.return = b, V = a;
    else for (; null !== V; ) {
      b = V;
      try {
        var n = b.alternate;
        if (0 !== (b.flags & 1024)) switch (b.tag) {
          case 0:
          case 11:
          case 15:
            break;
          case 1:
            if (null !== n) {
              var t = n.memoizedProps, J2 = n.memoizedState, x = b.stateNode, w = x.getSnapshotBeforeUpdate(b.elementType === b.type ? t : Ci(b.type, t), J2);
              x.__reactInternalSnapshotBeforeUpdate = w;
            }
            break;
          case 3:
            var u = b.stateNode.containerInfo;
            1 === u.nodeType ? u.textContent = "" : 9 === u.nodeType && u.documentElement && u.removeChild(u.documentElement);
            break;
          case 5:
          case 6:
          case 4:
          case 17:
            break;
          default:
            throw Error(p(163));
        }
      } catch (F2) {
        W2(b, b.return, F2);
      }
      a = b.sibling;
      if (null !== a) {
        a.return = b.return;
        V = a;
        break;
      }
      V = b.return;
    }
    n = Nj;
    Nj = false;
    return n;
  }
  function Pj(a, b, c) {
    var d = b.updateQueue;
    d = null !== d ? d.lastEffect : null;
    if (null !== d) {
      var e = d = d.next;
      do {
        if ((e.tag & a) === a) {
          var f = e.destroy;
          e.destroy = void 0;
          void 0 !== f && Mj(b, c, f);
        }
        e = e.next;
      } while (e !== d);
    }
  }
  function Qj(a, b) {
    b = b.updateQueue;
    b = null !== b ? b.lastEffect : null;
    if (null !== b) {
      var c = b = b.next;
      do {
        if ((c.tag & a) === a) {
          var d = c.create;
          c.destroy = d();
        }
        c = c.next;
      } while (c !== b);
    }
  }
  function Rj(a) {
    var b = a.ref;
    if (null !== b) {
      var c = a.stateNode;
      switch (a.tag) {
        case 5:
          a = c;
          break;
        default:
          a = c;
      }
      "function" === typeof b ? b(a) : b.current = a;
    }
  }
  function Sj(a) {
    var b = a.alternate;
    null !== b && (a.alternate = null, Sj(b));
    a.child = null;
    a.deletions = null;
    a.sibling = null;
    5 === a.tag && (b = a.stateNode, null !== b && (delete b[Of], delete b[Pf], delete b[of], delete b[Qf], delete b[Rf]));
    a.stateNode = null;
    a.return = null;
    a.dependencies = null;
    a.memoizedProps = null;
    a.memoizedState = null;
    a.pendingProps = null;
    a.stateNode = null;
    a.updateQueue = null;
  }
  function Tj(a) {
    return 5 === a.tag || 3 === a.tag || 4 === a.tag;
  }
  function Uj(a) {
    a: for (; ; ) {
      for (; null === a.sibling; ) {
        if (null === a.return || Tj(a.return)) return null;
        a = a.return;
      }
      a.sibling.return = a.return;
      for (a = a.sibling; 5 !== a.tag && 6 !== a.tag && 18 !== a.tag; ) {
        if (a.flags & 2) continue a;
        if (null === a.child || 4 === a.tag) continue a;
        else a.child.return = a, a = a.child;
      }
      if (!(a.flags & 2)) return a.stateNode;
    }
  }
  function Vj(a, b, c) {
    var d = a.tag;
    if (5 === d || 6 === d) a = a.stateNode, b ? 8 === c.nodeType ? c.parentNode.insertBefore(a, b) : c.insertBefore(a, b) : (8 === c.nodeType ? (b = c.parentNode, b.insertBefore(a, c)) : (b = c, b.appendChild(a)), c = c._reactRootContainer, null !== c && void 0 !== c || null !== b.onclick || (b.onclick = Bf));
    else if (4 !== d && (a = a.child, null !== a)) for (Vj(a, b, c), a = a.sibling; null !== a; ) Vj(a, b, c), a = a.sibling;
  }
  function Wj(a, b, c) {
    var d = a.tag;
    if (5 === d || 6 === d) a = a.stateNode, b ? c.insertBefore(a, b) : c.appendChild(a);
    else if (4 !== d && (a = a.child, null !== a)) for (Wj(a, b, c), a = a.sibling; null !== a; ) Wj(a, b, c), a = a.sibling;
  }
  var X2 = null, Xj = false;
  function Yj(a, b, c) {
    for (c = c.child; null !== c; ) Zj(a, b, c), c = c.sibling;
  }
  function Zj(a, b, c) {
    if (lc && "function" === typeof lc.onCommitFiberUnmount) try {
      lc.onCommitFiberUnmount(kc, c);
    } catch (h) {
    }
    switch (c.tag) {
      case 5:
        U2 || Lj(c, b);
      case 6:
        var d = X2, e = Xj;
        X2 = null;
        Yj(a, b, c);
        X2 = d;
        Xj = e;
        null !== X2 && (Xj ? (a = X2, c = c.stateNode, 8 === a.nodeType ? a.parentNode.removeChild(c) : a.removeChild(c)) : X2.removeChild(c.stateNode));
        break;
      case 18:
        null !== X2 && (Xj ? (a = X2, c = c.stateNode, 8 === a.nodeType ? Kf(a.parentNode, c) : 1 === a.nodeType && Kf(a, c), bd(a)) : Kf(X2, c.stateNode));
        break;
      case 4:
        d = X2;
        e = Xj;
        X2 = c.stateNode.containerInfo;
        Xj = true;
        Yj(a, b, c);
        X2 = d;
        Xj = e;
        break;
      case 0:
      case 11:
      case 14:
      case 15:
        if (!U2 && (d = c.updateQueue, null !== d && (d = d.lastEffect, null !== d))) {
          e = d = d.next;
          do {
            var f = e, g = f.destroy;
            f = f.tag;
            void 0 !== g && (0 !== (f & 2) ? Mj(c, b, g) : 0 !== (f & 4) && Mj(c, b, g));
            e = e.next;
          } while (e !== d);
        }
        Yj(a, b, c);
        break;
      case 1:
        if (!U2 && (Lj(c, b), d = c.stateNode, "function" === typeof d.componentWillUnmount)) try {
          d.props = c.memoizedProps, d.state = c.memoizedState, d.componentWillUnmount();
        } catch (h) {
          W2(c, b, h);
        }
        Yj(a, b, c);
        break;
      case 21:
        Yj(a, b, c);
        break;
      case 22:
        c.mode & 1 ? (U2 = (d = U2) || null !== c.memoizedState, Yj(a, b, c), U2 = d) : Yj(a, b, c);
        break;
      default:
        Yj(a, b, c);
    }
  }
  function ak(a) {
    var b = a.updateQueue;
    if (null !== b) {
      a.updateQueue = null;
      var c = a.stateNode;
      null === c && (c = a.stateNode = new Kj());
      b.forEach(function(b2) {
        var d = bk.bind(null, a, b2);
        c.has(b2) || (c.add(b2), b2.then(d, d));
      });
    }
  }
  function ck(a, b) {
    var c = b.deletions;
    if (null !== c) for (var d = 0; d < c.length; d++) {
      var e = c[d];
      try {
        var f = a, g = b, h = g;
        a: for (; null !== h; ) {
          switch (h.tag) {
            case 5:
              X2 = h.stateNode;
              Xj = false;
              break a;
            case 3:
              X2 = h.stateNode.containerInfo;
              Xj = true;
              break a;
            case 4:
              X2 = h.stateNode.containerInfo;
              Xj = true;
              break a;
          }
          h = h.return;
        }
        if (null === X2) throw Error(p(160));
        Zj(f, g, e);
        X2 = null;
        Xj = false;
        var k = e.alternate;
        null !== k && (k.return = null);
        e.return = null;
      } catch (l) {
        W2(e, b, l);
      }
    }
    if (b.subtreeFlags & 12854) for (b = b.child; null !== b; ) dk(b, a), b = b.sibling;
  }
  function dk(a, b) {
    var c = a.alternate, d = a.flags;
    switch (a.tag) {
      case 0:
      case 11:
      case 14:
      case 15:
        ck(b, a);
        ek(a);
        if (d & 4) {
          try {
            Pj(3, a, a.return), Qj(3, a);
          } catch (t) {
            W2(a, a.return, t);
          }
          try {
            Pj(5, a, a.return);
          } catch (t) {
            W2(a, a.return, t);
          }
        }
        break;
      case 1:
        ck(b, a);
        ek(a);
        d & 512 && null !== c && Lj(c, c.return);
        break;
      case 5:
        ck(b, a);
        ek(a);
        d & 512 && null !== c && Lj(c, c.return);
        if (a.flags & 32) {
          var e = a.stateNode;
          try {
            ob(e, "");
          } catch (t) {
            W2(a, a.return, t);
          }
        }
        if (d & 4 && (e = a.stateNode, null != e)) {
          var f = a.memoizedProps, g = null !== c ? c.memoizedProps : f, h = a.type, k = a.updateQueue;
          a.updateQueue = null;
          if (null !== k) try {
            "input" === h && "radio" === f.type && null != f.name && ab(e, f);
            vb(h, g);
            var l = vb(h, f);
            for (g = 0; g < k.length; g += 2) {
              var m = k[g], q2 = k[g + 1];
              "style" === m ? sb(e, q2) : "dangerouslySetInnerHTML" === m ? nb(e, q2) : "children" === m ? ob(e, q2) : ta(e, m, q2, l);
            }
            switch (h) {
              case "input":
                bb(e, f);
                break;
              case "textarea":
                ib(e, f);
                break;
              case "select":
                var r = e._wrapperState.wasMultiple;
                e._wrapperState.wasMultiple = !!f.multiple;
                var y = f.value;
                null != y ? fb(e, !!f.multiple, y, false) : r !== !!f.multiple && (null != f.defaultValue ? fb(
                  e,
                  !!f.multiple,
                  f.defaultValue,
                  true
                ) : fb(e, !!f.multiple, f.multiple ? [] : "", false));
            }
            e[Pf] = f;
          } catch (t) {
            W2(a, a.return, t);
          }
        }
        break;
      case 6:
        ck(b, a);
        ek(a);
        if (d & 4) {
          if (null === a.stateNode) throw Error(p(162));
          e = a.stateNode;
          f = a.memoizedProps;
          try {
            e.nodeValue = f;
          } catch (t) {
            W2(a, a.return, t);
          }
        }
        break;
      case 3:
        ck(b, a);
        ek(a);
        if (d & 4 && null !== c && c.memoizedState.isDehydrated) try {
          bd(b.containerInfo);
        } catch (t) {
          W2(a, a.return, t);
        }
        break;
      case 4:
        ck(b, a);
        ek(a);
        break;
      case 13:
        ck(b, a);
        ek(a);
        e = a.child;
        e.flags & 8192 && (f = null !== e.memoizedState, e.stateNode.isHidden = f, !f || null !== e.alternate && null !== e.alternate.memoizedState || (fk = B2()));
        d & 4 && ak(a);
        break;
      case 22:
        m = null !== c && null !== c.memoizedState;
        a.mode & 1 ? (U2 = (l = U2) || m, ck(b, a), U2 = l) : ck(b, a);
        ek(a);
        if (d & 8192) {
          l = null !== a.memoizedState;
          if ((a.stateNode.isHidden = l) && !m && 0 !== (a.mode & 1)) for (V = a, m = a.child; null !== m; ) {
            for (q2 = V = m; null !== V; ) {
              r = V;
              y = r.child;
              switch (r.tag) {
                case 0:
                case 11:
                case 14:
                case 15:
                  Pj(4, r, r.return);
                  break;
                case 1:
                  Lj(r, r.return);
                  var n = r.stateNode;
                  if ("function" === typeof n.componentWillUnmount) {
                    d = r;
                    c = r.return;
                    try {
                      b = d, n.props = b.memoizedProps, n.state = b.memoizedState, n.componentWillUnmount();
                    } catch (t) {
                      W2(d, c, t);
                    }
                  }
                  break;
                case 5:
                  Lj(r, r.return);
                  break;
                case 22:
                  if (null !== r.memoizedState) {
                    gk(q2);
                    continue;
                  }
              }
              null !== y ? (y.return = r, V = y) : gk(q2);
            }
            m = m.sibling;
          }
          a: for (m = null, q2 = a; ; ) {
            if (5 === q2.tag) {
              if (null === m) {
                m = q2;
                try {
                  e = q2.stateNode, l ? (f = e.style, "function" === typeof f.setProperty ? f.setProperty("display", "none", "important") : f.display = "none") : (h = q2.stateNode, k = q2.memoizedProps.style, g = void 0 !== k && null !== k && k.hasOwnProperty("display") ? k.display : null, h.style.display = rb("display", g));
                } catch (t) {
                  W2(a, a.return, t);
                }
              }
            } else if (6 === q2.tag) {
              if (null === m) try {
                q2.stateNode.nodeValue = l ? "" : q2.memoizedProps;
              } catch (t) {
                W2(a, a.return, t);
              }
            } else if ((22 !== q2.tag && 23 !== q2.tag || null === q2.memoizedState || q2 === a) && null !== q2.child) {
              q2.child.return = q2;
              q2 = q2.child;
              continue;
            }
            if (q2 === a) break a;
            for (; null === q2.sibling; ) {
              if (null === q2.return || q2.return === a) break a;
              m === q2 && (m = null);
              q2 = q2.return;
            }
            m === q2 && (m = null);
            q2.sibling.return = q2.return;
            q2 = q2.sibling;
          }
        }
        break;
      case 19:
        ck(b, a);
        ek(a);
        d & 4 && ak(a);
        break;
      case 21:
        break;
      default:
        ck(
          b,
          a
        ), ek(a);
    }
  }
  function ek(a) {
    var b = a.flags;
    if (b & 2) {
      try {
        a: {
          for (var c = a.return; null !== c; ) {
            if (Tj(c)) {
              var d = c;
              break a;
            }
            c = c.return;
          }
          throw Error(p(160));
        }
        switch (d.tag) {
          case 5:
            var e = d.stateNode;
            d.flags & 32 && (ob(e, ""), d.flags &= -33);
            var f = Uj(a);
            Wj(a, f, e);
            break;
          case 3:
          case 4:
            var g = d.stateNode.containerInfo, h = Uj(a);
            Vj(a, h, g);
            break;
          default:
            throw Error(p(161));
        }
      } catch (k) {
        W2(a, a.return, k);
      }
      a.flags &= -3;
    }
    b & 4096 && (a.flags &= -4097);
  }
  function hk(a, b, c) {
    V = a;
    ik(a);
  }
  function ik(a, b, c) {
    for (var d = 0 !== (a.mode & 1); null !== V; ) {
      var e = V, f = e.child;
      if (22 === e.tag && d) {
        var g = null !== e.memoizedState || Jj;
        if (!g) {
          var h = e.alternate, k = null !== h && null !== h.memoizedState || U2;
          h = Jj;
          var l = U2;
          Jj = g;
          if ((U2 = k) && !l) for (V = e; null !== V; ) g = V, k = g.child, 22 === g.tag && null !== g.memoizedState ? jk(e) : null !== k ? (k.return = g, V = k) : jk(e);
          for (; null !== f; ) V = f, ik(f), f = f.sibling;
          V = e;
          Jj = h;
          U2 = l;
        }
        kk(a);
      } else 0 !== (e.subtreeFlags & 8772) && null !== f ? (f.return = e, V = f) : kk(a);
    }
  }
  function kk(a) {
    for (; null !== V; ) {
      var b = V;
      if (0 !== (b.flags & 8772)) {
        var c = b.alternate;
        try {
          if (0 !== (b.flags & 8772)) switch (b.tag) {
            case 0:
            case 11:
            case 15:
              U2 || Qj(5, b);
              break;
            case 1:
              var d = b.stateNode;
              if (b.flags & 4 && !U2) if (null === c) d.componentDidMount();
              else {
                var e = b.elementType === b.type ? c.memoizedProps : Ci(b.type, c.memoizedProps);
                d.componentDidUpdate(e, c.memoizedState, d.__reactInternalSnapshotBeforeUpdate);
              }
              var f = b.updateQueue;
              null !== f && sh(b, f, d);
              break;
            case 3:
              var g = b.updateQueue;
              if (null !== g) {
                c = null;
                if (null !== b.child) switch (b.child.tag) {
                  case 5:
                    c = b.child.stateNode;
                    break;
                  case 1:
                    c = b.child.stateNode;
                }
                sh(b, g, c);
              }
              break;
            case 5:
              var h = b.stateNode;
              if (null === c && b.flags & 4) {
                c = h;
                var k = b.memoizedProps;
                switch (b.type) {
                  case "button":
                  case "input":
                  case "select":
                  case "textarea":
                    k.autoFocus && c.focus();
                    break;
                  case "img":
                    k.src && (c.src = k.src);
                }
              }
              break;
            case 6:
              break;
            case 4:
              break;
            case 12:
              break;
            case 13:
              if (null === b.memoizedState) {
                var l = b.alternate;
                if (null !== l) {
                  var m = l.memoizedState;
                  if (null !== m) {
                    var q2 = m.dehydrated;
                    null !== q2 && bd(q2);
                  }
                }
              }
              break;
            case 19:
            case 17:
            case 21:
            case 22:
            case 23:
            case 25:
              break;
            default:
              throw Error(p(163));
          }
          U2 || b.flags & 512 && Rj(b);
        } catch (r) {
          W2(b, b.return, r);
        }
      }
      if (b === a) {
        V = null;
        break;
      }
      c = b.sibling;
      if (null !== c) {
        c.return = b.return;
        V = c;
        break;
      }
      V = b.return;
    }
  }
  function gk(a) {
    for (; null !== V; ) {
      var b = V;
      if (b === a) {
        V = null;
        break;
      }
      var c = b.sibling;
      if (null !== c) {
        c.return = b.return;
        V = c;
        break;
      }
      V = b.return;
    }
  }
  function jk(a) {
    for (; null !== V; ) {
      var b = V;
      try {
        switch (b.tag) {
          case 0:
          case 11:
          case 15:
            var c = b.return;
            try {
              Qj(4, b);
            } catch (k) {
              W2(b, c, k);
            }
            break;
          case 1:
            var d = b.stateNode;
            if ("function" === typeof d.componentDidMount) {
              var e = b.return;
              try {
                d.componentDidMount();
              } catch (k) {
                W2(b, e, k);
              }
            }
            var f = b.return;
            try {
              Rj(b);
            } catch (k) {
              W2(b, f, k);
            }
            break;
          case 5:
            var g = b.return;
            try {
              Rj(b);
            } catch (k) {
              W2(b, g, k);
            }
        }
      } catch (k) {
        W2(b, b.return, k);
      }
      if (b === a) {
        V = null;
        break;
      }
      var h = b.sibling;
      if (null !== h) {
        h.return = b.return;
        V = h;
        break;
      }
      V = b.return;
    }
  }
  var lk = Math.ceil, mk = ua.ReactCurrentDispatcher, nk = ua.ReactCurrentOwner, ok = ua.ReactCurrentBatchConfig, K2 = 0, Q = null, Y = null, Z2 = 0, fj = 0, ej = Uf(0), T2 = 0, pk = null, rh = 0, qk = 0, rk = 0, sk = null, tk = null, fk = 0, Gj = Infinity, uk = null, Oi = false, Pi = null, Ri = null, vk = false, wk = null, xk = 0, yk = 0, zk = null, Ak = -1, Bk = 0;
  function R() {
    return 0 !== (K2 & 6) ? B2() : -1 !== Ak ? Ak : Ak = B2();
  }
  function yi(a) {
    if (0 === (a.mode & 1)) return 1;
    if (0 !== (K2 & 2) && 0 !== Z2) return Z2 & -Z2;
    if (null !== Kg.transition) return 0 === Bk && (Bk = yc()), Bk;
    a = C2;
    if (0 !== a) return a;
    a = window.event;
    a = void 0 === a ? 16 : jd(a.type);
    return a;
  }
  function gi(a, b, c, d) {
    if (50 < yk) throw yk = 0, zk = null, Error(p(185));
    Ac(a, c, d);
    if (0 === (K2 & 2) || a !== Q) a === Q && (0 === (K2 & 2) && (qk |= c), 4 === T2 && Ck(a, Z2)), Dk(a, d), 1 === c && 0 === K2 && 0 === (b.mode & 1) && (Gj = B2() + 500, fg && jg());
  }
  function Dk(a, b) {
    var c = a.callbackNode;
    wc(a, b);
    var d = uc(a, a === Q ? Z2 : 0);
    if (0 === d) null !== c && bc(c), a.callbackNode = null, a.callbackPriority = 0;
    else if (b = d & -d, a.callbackPriority !== b) {
      null != c && bc(c);
      if (1 === b) 0 === a.tag ? ig(Ek.bind(null, a)) : hg(Ek.bind(null, a)), Jf(function() {
        0 === (K2 & 6) && jg();
      }), c = null;
      else {
        switch (Dc(d)) {
          case 1:
            c = fc;
            break;
          case 4:
            c = gc;
            break;
          case 16:
            c = hc;
            break;
          case 536870912:
            c = jc;
            break;
          default:
            c = hc;
        }
        c = Fk(c, Gk.bind(null, a));
      }
      a.callbackPriority = b;
      a.callbackNode = c;
    }
  }
  function Gk(a, b) {
    Ak = -1;
    Bk = 0;
    if (0 !== (K2 & 6)) throw Error(p(327));
    var c = a.callbackNode;
    if (Hk() && a.callbackNode !== c) return null;
    var d = uc(a, a === Q ? Z2 : 0);
    if (0 === d) return null;
    if (0 !== (d & 30) || 0 !== (d & a.expiredLanes) || b) b = Ik(a, d);
    else {
      b = d;
      var e = K2;
      K2 |= 2;
      var f = Jk();
      if (Q !== a || Z2 !== b) uk = null, Gj = B2() + 500, Kk(a, b);
      do
        try {
          Lk();
          break;
        } catch (h) {
          Mk(a, h);
        }
      while (1);
      $g();
      mk.current = f;
      K2 = e;
      null !== Y ? b = 0 : (Q = null, Z2 = 0, b = T2);
    }
    if (0 !== b) {
      2 === b && (e = xc(a), 0 !== e && (d = e, b = Nk(a, e)));
      if (1 === b) throw c = pk, Kk(a, 0), Ck(a, d), Dk(a, B2()), c;
      if (6 === b) Ck(a, d);
      else {
        e = a.current.alternate;
        if (0 === (d & 30) && !Ok(e) && (b = Ik(a, d), 2 === b && (f = xc(a), 0 !== f && (d = f, b = Nk(a, f))), 1 === b)) throw c = pk, Kk(a, 0), Ck(a, d), Dk(a, B2()), c;
        a.finishedWork = e;
        a.finishedLanes = d;
        switch (b) {
          case 0:
          case 1:
            throw Error(p(345));
          case 2:
            Pk(a, tk, uk);
            break;
          case 3:
            Ck(a, d);
            if ((d & 130023424) === d && (b = fk + 500 - B2(), 10 < b)) {
              if (0 !== uc(a, 0)) break;
              e = a.suspendedLanes;
              if ((e & d) !== d) {
                R();
                a.pingedLanes |= a.suspendedLanes & e;
                break;
              }
              a.timeoutHandle = Ff(Pk.bind(null, a, tk, uk), b);
              break;
            }
            Pk(a, tk, uk);
            break;
          case 4:
            Ck(a, d);
            if ((d & 4194240) === d) break;
            b = a.eventTimes;
            for (e = -1; 0 < d; ) {
              var g = 31 - oc(d);
              f = 1 << g;
              g = b[g];
              g > e && (e = g);
              d &= ~f;
            }
            d = e;
            d = B2() - d;
            d = (120 > d ? 120 : 480 > d ? 480 : 1080 > d ? 1080 : 1920 > d ? 1920 : 3e3 > d ? 3e3 : 4320 > d ? 4320 : 1960 * lk(d / 1960)) - d;
            if (10 < d) {
              a.timeoutHandle = Ff(Pk.bind(null, a, tk, uk), d);
              break;
            }
            Pk(a, tk, uk);
            break;
          case 5:
            Pk(a, tk, uk);
            break;
          default:
            throw Error(p(329));
        }
      }
    }
    Dk(a, B2());
    return a.callbackNode === c ? Gk.bind(null, a) : null;
  }
  function Nk(a, b) {
    var c = sk;
    a.current.memoizedState.isDehydrated && (Kk(a, b).flags |= 256);
    a = Ik(a, b);
    2 !== a && (b = tk, tk = c, null !== b && Fj(b));
    return a;
  }
  function Fj(a) {
    null === tk ? tk = a : tk.push.apply(tk, a);
  }
  function Ok(a) {
    for (var b = a; ; ) {
      if (b.flags & 16384) {
        var c = b.updateQueue;
        if (null !== c && (c = c.stores, null !== c)) for (var d = 0; d < c.length; d++) {
          var e = c[d], f = e.getSnapshot;
          e = e.value;
          try {
            if (!He2(f(), e)) return false;
          } catch (g) {
            return false;
          }
        }
      }
      c = b.child;
      if (b.subtreeFlags & 16384 && null !== c) c.return = b, b = c;
      else {
        if (b === a) break;
        for (; null === b.sibling; ) {
          if (null === b.return || b.return === a) return true;
          b = b.return;
        }
        b.sibling.return = b.return;
        b = b.sibling;
      }
    }
    return true;
  }
  function Ck(a, b) {
    b &= ~rk;
    b &= ~qk;
    a.suspendedLanes |= b;
    a.pingedLanes &= ~b;
    for (a = a.expirationTimes; 0 < b; ) {
      var c = 31 - oc(b), d = 1 << c;
      a[c] = -1;
      b &= ~d;
    }
  }
  function Ek(a) {
    if (0 !== (K2 & 6)) throw Error(p(327));
    Hk();
    var b = uc(a, 0);
    if (0 === (b & 1)) return Dk(a, B2()), null;
    var c = Ik(a, b);
    if (0 !== a.tag && 2 === c) {
      var d = xc(a);
      0 !== d && (b = d, c = Nk(a, d));
    }
    if (1 === c) throw c = pk, Kk(a, 0), Ck(a, b), Dk(a, B2()), c;
    if (6 === c) throw Error(p(345));
    a.finishedWork = a.current.alternate;
    a.finishedLanes = b;
    Pk(a, tk, uk);
    Dk(a, B2());
    return null;
  }
  function Qk(a, b) {
    var c = K2;
    K2 |= 1;
    try {
      return a(b);
    } finally {
      K2 = c, 0 === K2 && (Gj = B2() + 500, fg && jg());
    }
  }
  function Rk(a) {
    null !== wk && 0 === wk.tag && 0 === (K2 & 6) && Hk();
    var b = K2;
    K2 |= 1;
    var c = ok.transition, d = C2;
    try {
      if (ok.transition = null, C2 = 1, a) return a();
    } finally {
      C2 = d, ok.transition = c, K2 = b, 0 === (K2 & 6) && jg();
    }
  }
  function Hj() {
    fj = ej.current;
    E(ej);
  }
  function Kk(a, b) {
    a.finishedWork = null;
    a.finishedLanes = 0;
    var c = a.timeoutHandle;
    -1 !== c && (a.timeoutHandle = -1, Gf(c));
    if (null !== Y) for (c = Y.return; null !== c; ) {
      var d = c;
      wg(d);
      switch (d.tag) {
        case 1:
          d = d.type.childContextTypes;
          null !== d && void 0 !== d && $f();
          break;
        case 3:
          zh();
          E(Wf);
          E(H2);
          Eh();
          break;
        case 5:
          Bh(d);
          break;
        case 4:
          zh();
          break;
        case 13:
          E(L);
          break;
        case 19:
          E(L);
          break;
        case 10:
          ah(d.type._context);
          break;
        case 22:
        case 23:
          Hj();
      }
      c = c.return;
    }
    Q = a;
    Y = a = Pg(a.current, null);
    Z2 = fj = b;
    T2 = 0;
    pk = null;
    rk = qk = rh = 0;
    tk = sk = null;
    if (null !== fh) {
      for (b = 0; b < fh.length; b++) if (c = fh[b], d = c.interleaved, null !== d) {
        c.interleaved = null;
        var e = d.next, f = c.pending;
        if (null !== f) {
          var g = f.next;
          f.next = e;
          d.next = g;
        }
        c.pending = d;
      }
      fh = null;
    }
    return a;
  }
  function Mk(a, b) {
    do {
      var c = Y;
      try {
        $g();
        Fh.current = Rh;
        if (Ih) {
          for (var d = M.memoizedState; null !== d; ) {
            var e = d.queue;
            null !== e && (e.pending = null);
            d = d.next;
          }
          Ih = false;
        }
        Hh = 0;
        O2 = N = M = null;
        Jh = false;
        Kh = 0;
        nk.current = null;
        if (null === c || null === c.return) {
          T2 = 1;
          pk = b;
          Y = null;
          break;
        }
        a: {
          var f = a, g = c.return, h = c, k = b;
          b = Z2;
          h.flags |= 32768;
          if (null !== k && "object" === typeof k && "function" === typeof k.then) {
            var l = k, m = h, q2 = m.tag;
            if (0 === (m.mode & 1) && (0 === q2 || 11 === q2 || 15 === q2)) {
              var r = m.alternate;
              r ? (m.updateQueue = r.updateQueue, m.memoizedState = r.memoizedState, m.lanes = r.lanes) : (m.updateQueue = null, m.memoizedState = null);
            }
            var y = Ui(g);
            if (null !== y) {
              y.flags &= -257;
              Vi(y, g, h, f, b);
              y.mode & 1 && Si(f, l, b);
              b = y;
              k = l;
              var n = b.updateQueue;
              if (null === n) {
                var t = /* @__PURE__ */ new Set();
                t.add(k);
                b.updateQueue = t;
              } else n.add(k);
              break a;
            } else {
              if (0 === (b & 1)) {
                Si(f, l, b);
                tj();
                break a;
              }
              k = Error(p(426));
            }
          } else if (I2 && h.mode & 1) {
            var J2 = Ui(g);
            if (null !== J2) {
              0 === (J2.flags & 65536) && (J2.flags |= 256);
              Vi(J2, g, h, f, b);
              Jg(Ji(k, h));
              break a;
            }
          }
          f = k = Ji(k, h);
          4 !== T2 && (T2 = 2);
          null === sk ? sk = [f] : sk.push(f);
          f = g;
          do {
            switch (f.tag) {
              case 3:
                f.flags |= 65536;
                b &= -b;
                f.lanes |= b;
                var x = Ni(f, k, b);
                ph(f, x);
                break a;
              case 1:
                h = k;
                var w = f.type, u = f.stateNode;
                if (0 === (f.flags & 128) && ("function" === typeof w.getDerivedStateFromError || null !== u && "function" === typeof u.componentDidCatch && (null === Ri || !Ri.has(u)))) {
                  f.flags |= 65536;
                  b &= -b;
                  f.lanes |= b;
                  var F2 = Qi(f, h, b);
                  ph(f, F2);
                  break a;
                }
            }
            f = f.return;
          } while (null !== f);
        }
        Sk(c);
      } catch (na) {
        b = na;
        Y === c && null !== c && (Y = c = c.return);
        continue;
      }
      break;
    } while (1);
  }
  function Jk() {
    var a = mk.current;
    mk.current = Rh;
    return null === a ? Rh : a;
  }
  function tj() {
    if (0 === T2 || 3 === T2 || 2 === T2) T2 = 4;
    null === Q || 0 === (rh & 268435455) && 0 === (qk & 268435455) || Ck(Q, Z2);
  }
  function Ik(a, b) {
    var c = K2;
    K2 |= 2;
    var d = Jk();
    if (Q !== a || Z2 !== b) uk = null, Kk(a, b);
    do
      try {
        Tk();
        break;
      } catch (e) {
        Mk(a, e);
      }
    while (1);
    $g();
    K2 = c;
    mk.current = d;
    if (null !== Y) throw Error(p(261));
    Q = null;
    Z2 = 0;
    return T2;
  }
  function Tk() {
    for (; null !== Y; ) Uk(Y);
  }
  function Lk() {
    for (; null !== Y && !cc(); ) Uk(Y);
  }
  function Uk(a) {
    var b = Vk(a.alternate, a, fj);
    a.memoizedProps = a.pendingProps;
    null === b ? Sk(a) : Y = b;
    nk.current = null;
  }
  function Sk(a) {
    var b = a;
    do {
      var c = b.alternate;
      a = b.return;
      if (0 === (b.flags & 32768)) {
        if (c = Ej(c, b, fj), null !== c) {
          Y = c;
          return;
        }
      } else {
        c = Ij(c, b);
        if (null !== c) {
          c.flags &= 32767;
          Y = c;
          return;
        }
        if (null !== a) a.flags |= 32768, a.subtreeFlags = 0, a.deletions = null;
        else {
          T2 = 6;
          Y = null;
          return;
        }
      }
      b = b.sibling;
      if (null !== b) {
        Y = b;
        return;
      }
      Y = b = a;
    } while (null !== b);
    0 === T2 && (T2 = 5);
  }
  function Pk(a, b, c) {
    var d = C2, e = ok.transition;
    try {
      ok.transition = null, C2 = 1, Wk(a, b, c, d);
    } finally {
      ok.transition = e, C2 = d;
    }
    return null;
  }
  function Wk(a, b, c, d) {
    do
      Hk();
    while (null !== wk);
    if (0 !== (K2 & 6)) throw Error(p(327));
    c = a.finishedWork;
    var e = a.finishedLanes;
    if (null === c) return null;
    a.finishedWork = null;
    a.finishedLanes = 0;
    if (c === a.current) throw Error(p(177));
    a.callbackNode = null;
    a.callbackPriority = 0;
    var f = c.lanes | c.childLanes;
    Bc(a, f);
    a === Q && (Y = Q = null, Z2 = 0);
    0 === (c.subtreeFlags & 2064) && 0 === (c.flags & 2064) || vk || (vk = true, Fk(hc, function() {
      Hk();
      return null;
    }));
    f = 0 !== (c.flags & 15990);
    if (0 !== (c.subtreeFlags & 15990) || f) {
      f = ok.transition;
      ok.transition = null;
      var g = C2;
      C2 = 1;
      var h = K2;
      K2 |= 4;
      nk.current = null;
      Oj(a, c);
      dk(c, a);
      Oe2(Df);
      dd = !!Cf;
      Df = Cf = null;
      a.current = c;
      hk(c);
      dc();
      K2 = h;
      C2 = g;
      ok.transition = f;
    } else a.current = c;
    vk && (vk = false, wk = a, xk = e);
    f = a.pendingLanes;
    0 === f && (Ri = null);
    mc(c.stateNode);
    Dk(a, B2());
    if (null !== b) for (d = a.onRecoverableError, c = 0; c < b.length; c++) e = b[c], d(e.value, { componentStack: e.stack, digest: e.digest });
    if (Oi) throw Oi = false, a = Pi, Pi = null, a;
    0 !== (xk & 1) && 0 !== a.tag && Hk();
    f = a.pendingLanes;
    0 !== (f & 1) ? a === zk ? yk++ : (yk = 0, zk = a) : yk = 0;
    jg();
    return null;
  }
  function Hk() {
    if (null !== wk) {
      var a = Dc(xk), b = ok.transition, c = C2;
      try {
        ok.transition = null;
        C2 = 16 > a ? 16 : a;
        if (null === wk) var d = false;
        else {
          a = wk;
          wk = null;
          xk = 0;
          if (0 !== (K2 & 6)) throw Error(p(331));
          var e = K2;
          K2 |= 4;
          for (V = a.current; null !== V; ) {
            var f = V, g = f.child;
            if (0 !== (V.flags & 16)) {
              var h = f.deletions;
              if (null !== h) {
                for (var k = 0; k < h.length; k++) {
                  var l = h[k];
                  for (V = l; null !== V; ) {
                    var m = V;
                    switch (m.tag) {
                      case 0:
                      case 11:
                      case 15:
                        Pj(8, m, f);
                    }
                    var q2 = m.child;
                    if (null !== q2) q2.return = m, V = q2;
                    else for (; null !== V; ) {
                      m = V;
                      var r = m.sibling, y = m.return;
                      Sj(m);
                      if (m === l) {
                        V = null;
                        break;
                      }
                      if (null !== r) {
                        r.return = y;
                        V = r;
                        break;
                      }
                      V = y;
                    }
                  }
                }
                var n = f.alternate;
                if (null !== n) {
                  var t = n.child;
                  if (null !== t) {
                    n.child = null;
                    do {
                      var J2 = t.sibling;
                      t.sibling = null;
                      t = J2;
                    } while (null !== t);
                  }
                }
                V = f;
              }
            }
            if (0 !== (f.subtreeFlags & 2064) && null !== g) g.return = f, V = g;
            else b: for (; null !== V; ) {
              f = V;
              if (0 !== (f.flags & 2048)) switch (f.tag) {
                case 0:
                case 11:
                case 15:
                  Pj(9, f, f.return);
              }
              var x = f.sibling;
              if (null !== x) {
                x.return = f.return;
                V = x;
                break b;
              }
              V = f.return;
            }
          }
          var w = a.current;
          for (V = w; null !== V; ) {
            g = V;
            var u = g.child;
            if (0 !== (g.subtreeFlags & 2064) && null !== u) u.return = g, V = u;
            else b: for (g = w; null !== V; ) {
              h = V;
              if (0 !== (h.flags & 2048)) try {
                switch (h.tag) {
                  case 0:
                  case 11:
                  case 15:
                    Qj(9, h);
                }
              } catch (na) {
                W2(h, h.return, na);
              }
              if (h === g) {
                V = null;
                break b;
              }
              var F2 = h.sibling;
              if (null !== F2) {
                F2.return = h.return;
                V = F2;
                break b;
              }
              V = h.return;
            }
          }
          K2 = e;
          jg();
          if (lc && "function" === typeof lc.onPostCommitFiberRoot) try {
            lc.onPostCommitFiberRoot(kc, a);
          } catch (na) {
          }
          d = true;
        }
        return d;
      } finally {
        C2 = c, ok.transition = b;
      }
    }
    return false;
  }
  function Xk(a, b, c) {
    b = Ji(c, b);
    b = Ni(a, b, 1);
    a = nh(a, b, 1);
    b = R();
    null !== a && (Ac(a, 1, b), Dk(a, b));
  }
  function W2(a, b, c) {
    if (3 === a.tag) Xk(a, a, c);
    else for (; null !== b; ) {
      if (3 === b.tag) {
        Xk(b, a, c);
        break;
      } else if (1 === b.tag) {
        var d = b.stateNode;
        if ("function" === typeof b.type.getDerivedStateFromError || "function" === typeof d.componentDidCatch && (null === Ri || !Ri.has(d))) {
          a = Ji(c, a);
          a = Qi(b, a, 1);
          b = nh(b, a, 1);
          a = R();
          null !== b && (Ac(b, 1, a), Dk(b, a));
          break;
        }
      }
      b = b.return;
    }
  }
  function Ti(a, b, c) {
    var d = a.pingCache;
    null !== d && d.delete(b);
    b = R();
    a.pingedLanes |= a.suspendedLanes & c;
    Q === a && (Z2 & c) === c && (4 === T2 || 3 === T2 && (Z2 & 130023424) === Z2 && 500 > B2() - fk ? Kk(a, 0) : rk |= c);
    Dk(a, b);
  }
  function Yk(a, b) {
    0 === b && (0 === (a.mode & 1) ? b = 1 : (b = sc, sc <<= 1, 0 === (sc & 130023424) && (sc = 4194304)));
    var c = R();
    a = ih(a, b);
    null !== a && (Ac(a, b, c), Dk(a, c));
  }
  function uj(a) {
    var b = a.memoizedState, c = 0;
    null !== b && (c = b.retryLane);
    Yk(a, c);
  }
  function bk(a, b) {
    var c = 0;
    switch (a.tag) {
      case 13:
        var d = a.stateNode;
        var e = a.memoizedState;
        null !== e && (c = e.retryLane);
        break;
      case 19:
        d = a.stateNode;
        break;
      default:
        throw Error(p(314));
    }
    null !== d && d.delete(b);
    Yk(a, c);
  }
  var Vk;
  Vk = function(a, b, c) {
    if (null !== a) if (a.memoizedProps !== b.pendingProps || Wf.current) dh = true;
    else {
      if (0 === (a.lanes & c) && 0 === (b.flags & 128)) return dh = false, yj(a, b, c);
      dh = 0 !== (a.flags & 131072) ? true : false;
    }
    else dh = false, I2 && 0 !== (b.flags & 1048576) && ug(b, ng, b.index);
    b.lanes = 0;
    switch (b.tag) {
      case 2:
        var d = b.type;
        ij(a, b);
        a = b.pendingProps;
        var e = Yf(b, H2.current);
        ch(b, c);
        e = Nh(null, b, d, a, e, c);
        var f = Sh();
        b.flags |= 1;
        "object" === typeof e && null !== e && "function" === typeof e.render && void 0 === e.$$typeof ? (b.tag = 1, b.memoizedState = null, b.updateQueue = null, Zf(d) ? (f = true, cg(b)) : f = false, b.memoizedState = null !== e.state && void 0 !== e.state ? e.state : null, kh(b), e.updater = Ei, b.stateNode = e, e._reactInternals = b, Ii(b, d, a, c), b = jj(null, b, d, true, f, c)) : (b.tag = 0, I2 && f && vg(b), Xi(null, b, e, c), b = b.child);
        return b;
      case 16:
        d = b.elementType;
        a: {
          ij(a, b);
          a = b.pendingProps;
          e = d._init;
          d = e(d._payload);
          b.type = d;
          e = b.tag = Zk(d);
          a = Ci(d, a);
          switch (e) {
            case 0:
              b = cj(null, b, d, a, c);
              break a;
            case 1:
              b = hj(null, b, d, a, c);
              break a;
            case 11:
              b = Yi(null, b, d, a, c);
              break a;
            case 14:
              b = $i(null, b, d, Ci(d.type, a), c);
              break a;
          }
          throw Error(p(
            306,
            d,
            ""
          ));
        }
        return b;
      case 0:
        return d = b.type, e = b.pendingProps, e = b.elementType === d ? e : Ci(d, e), cj(a, b, d, e, c);
      case 1:
        return d = b.type, e = b.pendingProps, e = b.elementType === d ? e : Ci(d, e), hj(a, b, d, e, c);
      case 3:
        a: {
          kj(b);
          if (null === a) throw Error(p(387));
          d = b.pendingProps;
          f = b.memoizedState;
          e = f.element;
          lh(a, b);
          qh(b, d, null, c);
          var g = b.memoizedState;
          d = g.element;
          if (f.isDehydrated) if (f = { element: d, isDehydrated: false, cache: g.cache, pendingSuspenseBoundaries: g.pendingSuspenseBoundaries, transitions: g.transitions }, b.updateQueue.baseState = f, b.memoizedState = f, b.flags & 256) {
            e = Ji(Error(p(423)), b);
            b = lj(a, b, d, c, e);
            break a;
          } else if (d !== e) {
            e = Ji(Error(p(424)), b);
            b = lj(a, b, d, c, e);
            break a;
          } else for (yg = Lf(b.stateNode.containerInfo.firstChild), xg = b, I2 = true, zg = null, c = Vg(b, null, d, c), b.child = c; c; ) c.flags = c.flags & -3 | 4096, c = c.sibling;
          else {
            Ig();
            if (d === e) {
              b = Zi(a, b, c);
              break a;
            }
            Xi(a, b, d, c);
          }
          b = b.child;
        }
        return b;
      case 5:
        return Ah(b), null === a && Eg(b), d = b.type, e = b.pendingProps, f = null !== a ? a.memoizedProps : null, g = e.children, Ef(d, e) ? g = null : null !== f && Ef(d, f) && (b.flags |= 32), gj(a, b), Xi(a, b, g, c), b.child;
      case 6:
        return null === a && Eg(b), null;
      case 13:
        return oj(a, b, c);
      case 4:
        return yh(b, b.stateNode.containerInfo), d = b.pendingProps, null === a ? b.child = Ug(b, null, d, c) : Xi(a, b, d, c), b.child;
      case 11:
        return d = b.type, e = b.pendingProps, e = b.elementType === d ? e : Ci(d, e), Yi(a, b, d, e, c);
      case 7:
        return Xi(a, b, b.pendingProps, c), b.child;
      case 8:
        return Xi(a, b, b.pendingProps.children, c), b.child;
      case 12:
        return Xi(a, b, b.pendingProps.children, c), b.child;
      case 10:
        a: {
          d = b.type._context;
          e = b.pendingProps;
          f = b.memoizedProps;
          g = e.value;
          G(Wg, d._currentValue);
          d._currentValue = g;
          if (null !== f) if (He2(f.value, g)) {
            if (f.children === e.children && !Wf.current) {
              b = Zi(a, b, c);
              break a;
            }
          } else for (f = b.child, null !== f && (f.return = b); null !== f; ) {
            var h = f.dependencies;
            if (null !== h) {
              g = f.child;
              for (var k = h.firstContext; null !== k; ) {
                if (k.context === d) {
                  if (1 === f.tag) {
                    k = mh(-1, c & -c);
                    k.tag = 2;
                    var l = f.updateQueue;
                    if (null !== l) {
                      l = l.shared;
                      var m = l.pending;
                      null === m ? k.next = k : (k.next = m.next, m.next = k);
                      l.pending = k;
                    }
                  }
                  f.lanes |= c;
                  k = f.alternate;
                  null !== k && (k.lanes |= c);
                  bh(
                    f.return,
                    c,
                    b
                  );
                  h.lanes |= c;
                  break;
                }
                k = k.next;
              }
            } else if (10 === f.tag) g = f.type === b.type ? null : f.child;
            else if (18 === f.tag) {
              g = f.return;
              if (null === g) throw Error(p(341));
              g.lanes |= c;
              h = g.alternate;
              null !== h && (h.lanes |= c);
              bh(g, c, b);
              g = f.sibling;
            } else g = f.child;
            if (null !== g) g.return = f;
            else for (g = f; null !== g; ) {
              if (g === b) {
                g = null;
                break;
              }
              f = g.sibling;
              if (null !== f) {
                f.return = g.return;
                g = f;
                break;
              }
              g = g.return;
            }
            f = g;
          }
          Xi(a, b, e.children, c);
          b = b.child;
        }
        return b;
      case 9:
        return e = b.type, d = b.pendingProps.children, ch(b, c), e = eh(e), d = d(e), b.flags |= 1, Xi(a, b, d, c), b.child;
      case 14:
        return d = b.type, e = Ci(d, b.pendingProps), e = Ci(d.type, e), $i(a, b, d, e, c);
      case 15:
        return bj(a, b, b.type, b.pendingProps, c);
      case 17:
        return d = b.type, e = b.pendingProps, e = b.elementType === d ? e : Ci(d, e), ij(a, b), b.tag = 1, Zf(d) ? (a = true, cg(b)) : a = false, ch(b, c), Gi(b, d, e), Ii(b, d, e, c), jj(null, b, d, true, a, c);
      case 19:
        return xj(a, b, c);
      case 22:
        return dj(a, b, c);
    }
    throw Error(p(156, b.tag));
  };
  function Fk(a, b) {
    return ac(a, b);
  }
  function $k(a, b, c, d) {
    this.tag = a;
    this.key = c;
    this.sibling = this.child = this.return = this.stateNode = this.type = this.elementType = null;
    this.index = 0;
    this.ref = null;
    this.pendingProps = b;
    this.dependencies = this.memoizedState = this.updateQueue = this.memoizedProps = null;
    this.mode = d;
    this.subtreeFlags = this.flags = 0;
    this.deletions = null;
    this.childLanes = this.lanes = 0;
    this.alternate = null;
  }
  function Bg(a, b, c, d) {
    return new $k(a, b, c, d);
  }
  function aj(a) {
    a = a.prototype;
    return !(!a || !a.isReactComponent);
  }
  function Zk(a) {
    if ("function" === typeof a) return aj(a) ? 1 : 0;
    if (void 0 !== a && null !== a) {
      a = a.$$typeof;
      if (a === Da) return 11;
      if (a === Ga) return 14;
    }
    return 2;
  }
  function Pg(a, b) {
    var c = a.alternate;
    null === c ? (c = Bg(a.tag, b, a.key, a.mode), c.elementType = a.elementType, c.type = a.type, c.stateNode = a.stateNode, c.alternate = a, a.alternate = c) : (c.pendingProps = b, c.type = a.type, c.flags = 0, c.subtreeFlags = 0, c.deletions = null);
    c.flags = a.flags & 14680064;
    c.childLanes = a.childLanes;
    c.lanes = a.lanes;
    c.child = a.child;
    c.memoizedProps = a.memoizedProps;
    c.memoizedState = a.memoizedState;
    c.updateQueue = a.updateQueue;
    b = a.dependencies;
    c.dependencies = null === b ? null : { lanes: b.lanes, firstContext: b.firstContext };
    c.sibling = a.sibling;
    c.index = a.index;
    c.ref = a.ref;
    return c;
  }
  function Rg(a, b, c, d, e, f) {
    var g = 2;
    d = a;
    if ("function" === typeof a) aj(a) && (g = 1);
    else if ("string" === typeof a) g = 5;
    else a: switch (a) {
      case ya:
        return Tg(c.children, e, f, b);
      case za:
        g = 8;
        e |= 8;
        break;
      case Aa:
        return a = Bg(12, c, b, e | 2), a.elementType = Aa, a.lanes = f, a;
      case Ea:
        return a = Bg(13, c, b, e), a.elementType = Ea, a.lanes = f, a;
      case Fa:
        return a = Bg(19, c, b, e), a.elementType = Fa, a.lanes = f, a;
      case Ia:
        return pj(c, e, f, b);
      default:
        if ("object" === typeof a && null !== a) switch (a.$$typeof) {
          case Ba:
            g = 10;
            break a;
          case Ca:
            g = 9;
            break a;
          case Da:
            g = 11;
            break a;
          case Ga:
            g = 14;
            break a;
          case Ha:
            g = 16;
            d = null;
            break a;
        }
        throw Error(p(130, null == a ? a : typeof a, ""));
    }
    b = Bg(g, c, b, e);
    b.elementType = a;
    b.type = d;
    b.lanes = f;
    return b;
  }
  function Tg(a, b, c, d) {
    a = Bg(7, a, d, b);
    a.lanes = c;
    return a;
  }
  function pj(a, b, c, d) {
    a = Bg(22, a, d, b);
    a.elementType = Ia;
    a.lanes = c;
    a.stateNode = { isHidden: false };
    return a;
  }
  function Qg(a, b, c) {
    a = Bg(6, a, null, b);
    a.lanes = c;
    return a;
  }
  function Sg(a, b, c) {
    b = Bg(4, null !== a.children ? a.children : [], a.key, b);
    b.lanes = c;
    b.stateNode = { containerInfo: a.containerInfo, pendingChildren: null, implementation: a.implementation };
    return b;
  }
  function al(a, b, c, d, e) {
    this.tag = b;
    this.containerInfo = a;
    this.finishedWork = this.pingCache = this.current = this.pendingChildren = null;
    this.timeoutHandle = -1;
    this.callbackNode = this.pendingContext = this.context = null;
    this.callbackPriority = 0;
    this.eventTimes = zc(0);
    this.expirationTimes = zc(-1);
    this.entangledLanes = this.finishedLanes = this.mutableReadLanes = this.expiredLanes = this.pingedLanes = this.suspendedLanes = this.pendingLanes = 0;
    this.entanglements = zc(0);
    this.identifierPrefix = d;
    this.onRecoverableError = e;
    this.mutableSourceEagerHydrationData = null;
  }
  function bl(a, b, c, d, e, f, g, h, k) {
    a = new al(a, b, c, h, k);
    1 === b ? (b = 1, true === f && (b |= 8)) : b = 0;
    f = Bg(3, null, null, b);
    a.current = f;
    f.stateNode = a;
    f.memoizedState = { element: d, isDehydrated: c, cache: null, transitions: null, pendingSuspenseBoundaries: null };
    kh(f);
    return a;
  }
  function cl(a, b, c) {
    var d = 3 < arguments.length && void 0 !== arguments[3] ? arguments[3] : null;
    return { $$typeof: wa, key: null == d ? null : "" + d, children: a, containerInfo: b, implementation: c };
  }
  function dl(a) {
    if (!a) return Vf;
    a = a._reactInternals;
    a: {
      if (Vb(a) !== a || 1 !== a.tag) throw Error(p(170));
      var b = a;
      do {
        switch (b.tag) {
          case 3:
            b = b.stateNode.context;
            break a;
          case 1:
            if (Zf(b.type)) {
              b = b.stateNode.__reactInternalMemoizedMergedChildContext;
              break a;
            }
        }
        b = b.return;
      } while (null !== b);
      throw Error(p(171));
    }
    if (1 === a.tag) {
      var c = a.type;
      if (Zf(c)) return bg(a, c, b);
    }
    return b;
  }
  function el(a, b, c, d, e, f, g, h, k) {
    a = bl(c, d, true, a, e, f, g, h, k);
    a.context = dl(null);
    c = a.current;
    d = R();
    e = yi(c);
    f = mh(d, e);
    f.callback = void 0 !== b && null !== b ? b : null;
    nh(c, f, e);
    a.current.lanes = e;
    Ac(a, e, d);
    Dk(a, d);
    return a;
  }
  function fl(a, b, c, d) {
    var e = b.current, f = R(), g = yi(e);
    c = dl(c);
    null === b.context ? b.context = c : b.pendingContext = c;
    b = mh(f, g);
    b.payload = { element: a };
    d = void 0 === d ? null : d;
    null !== d && (b.callback = d);
    a = nh(e, b, g);
    null !== a && (gi(a, e, g, f), oh(a, e, g));
    return g;
  }
  function gl(a) {
    a = a.current;
    if (!a.child) return null;
    switch (a.child.tag) {
      case 5:
        return a.child.stateNode;
      default:
        return a.child.stateNode;
    }
  }
  function hl(a, b) {
    a = a.memoizedState;
    if (null !== a && null !== a.dehydrated) {
      var c = a.retryLane;
      a.retryLane = 0 !== c && c < b ? c : b;
    }
  }
  function il(a, b) {
    hl(a, b);
    (a = a.alternate) && hl(a, b);
  }
  function jl() {
    return null;
  }
  var kl = "function" === typeof reportError ? reportError : function(a) {
    console.error(a);
  };
  function ll(a) {
    this._internalRoot = a;
  }
  ml.prototype.render = ll.prototype.render = function(a) {
    var b = this._internalRoot;
    if (null === b) throw Error(p(409));
    fl(a, b, null, null);
  };
  ml.prototype.unmount = ll.prototype.unmount = function() {
    var a = this._internalRoot;
    if (null !== a) {
      this._internalRoot = null;
      var b = a.containerInfo;
      Rk(function() {
        fl(null, a, null, null);
      });
      b[uf] = null;
    }
  };
  function ml(a) {
    this._internalRoot = a;
  }
  ml.prototype.unstable_scheduleHydration = function(a) {
    if (a) {
      var b = Hc();
      a = { blockedOn: null, target: a, priority: b };
      for (var c = 0; c < Qc.length && 0 !== b && b < Qc[c].priority; c++) ;
      Qc.splice(c, 0, a);
      0 === c && Vc(a);
    }
  };
  function nl(a) {
    return !(!a || 1 !== a.nodeType && 9 !== a.nodeType && 11 !== a.nodeType);
  }
  function ol(a) {
    return !(!a || 1 !== a.nodeType && 9 !== a.nodeType && 11 !== a.nodeType && (8 !== a.nodeType || " react-mount-point-unstable " !== a.nodeValue));
  }
  function pl() {
  }
  function ql(a, b, c, d, e) {
    if (e) {
      if ("function" === typeof d) {
        var f = d;
        d = function() {
          var a2 = gl(g);
          f.call(a2);
        };
      }
      var g = el(b, d, a, 0, null, false, false, "", pl);
      a._reactRootContainer = g;
      a[uf] = g.current;
      sf(8 === a.nodeType ? a.parentNode : a);
      Rk();
      return g;
    }
    for (; e = a.lastChild; ) a.removeChild(e);
    if ("function" === typeof d) {
      var h = d;
      d = function() {
        var a2 = gl(k);
        h.call(a2);
      };
    }
    var k = bl(a, 0, false, null, null, false, false, "", pl);
    a._reactRootContainer = k;
    a[uf] = k.current;
    sf(8 === a.nodeType ? a.parentNode : a);
    Rk(function() {
      fl(b, k, c, d);
    });
    return k;
  }
  function rl(a, b, c, d, e) {
    var f = c._reactRootContainer;
    if (f) {
      var g = f;
      if ("function" === typeof e) {
        var h = e;
        e = function() {
          var a2 = gl(g);
          h.call(a2);
        };
      }
      fl(b, g, a, e);
    } else g = ql(c, b, a, e, d);
    return gl(g);
  }
  Ec = function(a) {
    switch (a.tag) {
      case 3:
        var b = a.stateNode;
        if (b.current.memoizedState.isDehydrated) {
          var c = tc(b.pendingLanes);
          0 !== c && (Cc(b, c | 1), Dk(b, B2()), 0 === (K2 & 6) && (Gj = B2() + 500, jg()));
        }
        break;
      case 13:
        Rk(function() {
          var b2 = ih(a, 1);
          if (null !== b2) {
            var c2 = R();
            gi(b2, a, 1, c2);
          }
        }), il(a, 1);
    }
  };
  Fc = function(a) {
    if (13 === a.tag) {
      var b = ih(a, 134217728);
      if (null !== b) {
        var c = R();
        gi(b, a, 134217728, c);
      }
      il(a, 134217728);
    }
  };
  Gc = function(a) {
    if (13 === a.tag) {
      var b = yi(a), c = ih(a, b);
      if (null !== c) {
        var d = R();
        gi(c, a, b, d);
      }
      il(a, b);
    }
  };
  Hc = function() {
    return C2;
  };
  Ic = function(a, b) {
    var c = C2;
    try {
      return C2 = a, b();
    } finally {
      C2 = c;
    }
  };
  yb = function(a, b, c) {
    switch (b) {
      case "input":
        bb(a, c);
        b = c.name;
        if ("radio" === c.type && null != b) {
          for (c = a; c.parentNode; ) c = c.parentNode;
          c = c.querySelectorAll("input[name=" + JSON.stringify("" + b) + '][type="radio"]');
          for (b = 0; b < c.length; b++) {
            var d = c[b];
            if (d !== a && d.form === a.form) {
              var e = Db(d);
              if (!e) throw Error(p(90));
              Wa(d);
              bb(d, e);
            }
          }
        }
        break;
      case "textarea":
        ib(a, c);
        break;
      case "select":
        b = c.value, null != b && fb(a, !!c.multiple, b, false);
    }
  };
  Gb = Qk;
  Hb = Rk;
  var sl = { usingClientEntryPoint: false, Events: [Cb, ue, Db, Eb, Fb, Qk] }, tl = { findFiberByHostInstance: Wc, bundleType: 0, version: "18.3.1", rendererPackageName: "react-dom" };
  var ul = { bundleType: tl.bundleType, version: tl.version, rendererPackageName: tl.rendererPackageName, rendererConfig: tl.rendererConfig, overrideHookState: null, overrideHookStateDeletePath: null, overrideHookStateRenamePath: null, overrideProps: null, overridePropsDeletePath: null, overridePropsRenamePath: null, setErrorHandler: null, setSuspenseHandler: null, scheduleUpdate: null, currentDispatcherRef: ua.ReactCurrentDispatcher, findHostInstanceByFiber: function(a) {
    a = Zb(a);
    return null === a ? null : a.stateNode;
  }, findFiberByHostInstance: tl.findFiberByHostInstance || jl, findHostInstancesForRefresh: null, scheduleRefresh: null, scheduleRoot: null, setRefreshHandler: null, getCurrentFiber: null, reconcilerVersion: "18.3.1-next-f1338f8080-20240426" };
  if ("undefined" !== typeof __REACT_DEVTOOLS_GLOBAL_HOOK__) {
    var vl = __REACT_DEVTOOLS_GLOBAL_HOOK__;
    if (!vl.isDisabled && vl.supportsFiber) try {
      kc = vl.inject(ul), lc = vl;
    } catch (a) {
    }
  }
  reactDom_production_min.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = sl;
  reactDom_production_min.createPortal = function(a, b) {
    var c = 2 < arguments.length && void 0 !== arguments[2] ? arguments[2] : null;
    if (!nl(b)) throw Error(p(200));
    return cl(a, b, null, c);
  };
  reactDom_production_min.createRoot = function(a, b) {
    if (!nl(a)) throw Error(p(299));
    var c = false, d = "", e = kl;
    null !== b && void 0 !== b && (true === b.unstable_strictMode && (c = true), void 0 !== b.identifierPrefix && (d = b.identifierPrefix), void 0 !== b.onRecoverableError && (e = b.onRecoverableError));
    b = bl(a, 1, false, null, null, c, false, d, e);
    a[uf] = b.current;
    sf(8 === a.nodeType ? a.parentNode : a);
    return new ll(b);
  };
  reactDom_production_min.findDOMNode = function(a) {
    if (null == a) return null;
    if (1 === a.nodeType) return a;
    var b = a._reactInternals;
    if (void 0 === b) {
      if ("function" === typeof a.render) throw Error(p(188));
      a = Object.keys(a).join(",");
      throw Error(p(268, a));
    }
    a = Zb(b);
    a = null === a ? null : a.stateNode;
    return a;
  };
  reactDom_production_min.flushSync = function(a) {
    return Rk(a);
  };
  reactDom_production_min.hydrate = function(a, b, c) {
    if (!ol(b)) throw Error(p(200));
    return rl(null, a, b, true, c);
  };
  reactDom_production_min.hydrateRoot = function(a, b, c) {
    if (!nl(a)) throw Error(p(405));
    var d = null != c && c.hydratedSources || null, e = false, f = "", g = kl;
    null !== c && void 0 !== c && (true === c.unstable_strictMode && (e = true), void 0 !== c.identifierPrefix && (f = c.identifierPrefix), void 0 !== c.onRecoverableError && (g = c.onRecoverableError));
    b = el(b, null, a, 1, null != c ? c : null, e, false, f, g);
    a[uf] = b.current;
    sf(a);
    if (d) for (a = 0; a < d.length; a++) c = d[a], e = c._getVersion, e = e(c._source), null == b.mutableSourceEagerHydrationData ? b.mutableSourceEagerHydrationData = [c, e] : b.mutableSourceEagerHydrationData.push(
      c,
      e
    );
    return new ml(b);
  };
  reactDom_production_min.render = function(a, b, c) {
    if (!ol(b)) throw Error(p(200));
    return rl(null, a, b, false, c);
  };
  reactDom_production_min.unmountComponentAtNode = function(a) {
    if (!ol(a)) throw Error(p(40));
    return a._reactRootContainer ? (Rk(function() {
      rl(null, null, a, false, function() {
        a._reactRootContainer = null;
        a[uf] = null;
      });
    }), true) : false;
  };
  reactDom_production_min.unstable_batchedUpdates = Qk;
  reactDom_production_min.unstable_renderSubtreeIntoContainer = function(a, b, c, d) {
    if (!ol(c)) throw Error(p(200));
    if (null == a || void 0 === a._reactInternals) throw Error(p(38));
    return rl(a, b, c, false, d);
  };
  reactDom_production_min.version = "18.3.1-next-f1338f8080-20240426";
  return reactDom_production_min;
}
var hasRequiredReactDom;
function requireReactDom() {
  if (hasRequiredReactDom) return reactDom.exports;
  hasRequiredReactDom = 1;
  function checkDCE() {
    if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ === "undefined" || typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE !== "function") {
      return;
    }
    try {
      __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(checkDCE);
    } catch (err) {
      console.error(err);
    }
  }
  {
    checkDCE();
    reactDom.exports = requireReactDom_production_min();
  }
  return reactDom.exports;
}
var hasRequiredClient;
function requireClient() {
  if (hasRequiredClient) return client;
  hasRequiredClient = 1;
  var m = requireReactDom();
  {
    client.createRoot = m.createRoot;
    client.hydrateRoot = m.hydrateRoot;
  }
  return client;
}
var clientExports = requireClient();
const ReactDOM = /* @__PURE__ */ getDefaultExportFromCjs(clientExports);
class HttpError extends Error {
  /** Constructs a new instance of {@link @microsoft/signalr.HttpError}.
   *
   * @param {string} errorMessage A descriptive error message.
   * @param {number} statusCode The HTTP status code represented by this error.
   */
  constructor(errorMessage, statusCode) {
    const trueProto = new.target.prototype;
    super(`${errorMessage}: Status code '${statusCode}'`);
    this.statusCode = statusCode;
    this.__proto__ = trueProto;
  }
}
class TimeoutError extends Error {
  /** Constructs a new instance of {@link @microsoft/signalr.TimeoutError}.
   *
   * @param {string} errorMessage A descriptive error message.
   */
  constructor(errorMessage = "A timeout occurred.") {
    const trueProto = new.target.prototype;
    super(errorMessage);
    this.__proto__ = trueProto;
  }
}
class AbortError extends Error {
  /** Constructs a new instance of {@link AbortError}.
   *
   * @param {string} errorMessage A descriptive error message.
   */
  constructor(errorMessage = "An abort occurred.") {
    const trueProto = new.target.prototype;
    super(errorMessage);
    this.__proto__ = trueProto;
  }
}
class UnsupportedTransportError extends Error {
  /** Constructs a new instance of {@link @microsoft/signalr.UnsupportedTransportError}.
   *
   * @param {string} message A descriptive error message.
   * @param {HttpTransportType} transport The {@link @microsoft/signalr.HttpTransportType} this error occurred on.
   */
  constructor(message, transport) {
    const trueProto = new.target.prototype;
    super(message);
    this.transport = transport;
    this.errorType = "UnsupportedTransportError";
    this.__proto__ = trueProto;
  }
}
class DisabledTransportError extends Error {
  /** Constructs a new instance of {@link @microsoft/signalr.DisabledTransportError}.
   *
   * @param {string} message A descriptive error message.
   * @param {HttpTransportType} transport The {@link @microsoft/signalr.HttpTransportType} this error occurred on.
   */
  constructor(message, transport) {
    const trueProto = new.target.prototype;
    super(message);
    this.transport = transport;
    this.errorType = "DisabledTransportError";
    this.__proto__ = trueProto;
  }
}
class FailedToStartTransportError extends Error {
  /** Constructs a new instance of {@link @microsoft/signalr.FailedToStartTransportError}.
   *
   * @param {string} message A descriptive error message.
   * @param {HttpTransportType} transport The {@link @microsoft/signalr.HttpTransportType} this error occurred on.
   */
  constructor(message, transport) {
    const trueProto = new.target.prototype;
    super(message);
    this.transport = transport;
    this.errorType = "FailedToStartTransportError";
    this.__proto__ = trueProto;
  }
}
class FailedToNegotiateWithServerError extends Error {
  /** Constructs a new instance of {@link @microsoft/signalr.FailedToNegotiateWithServerError}.
   *
   * @param {string} message A descriptive error message.
   */
  constructor(message) {
    const trueProto = new.target.prototype;
    super(message);
    this.errorType = "FailedToNegotiateWithServerError";
    this.__proto__ = trueProto;
  }
}
class AggregateErrors extends Error {
  /** Constructs a new instance of {@link @microsoft/signalr.AggregateErrors}.
   *
   * @param {string} message A descriptive error message.
   * @param {Error[]} innerErrors The collection of errors this error is aggregating.
   */
  constructor(message, innerErrors) {
    const trueProto = new.target.prototype;
    super(message);
    this.innerErrors = innerErrors;
    this.__proto__ = trueProto;
  }
}
class HttpResponse {
  constructor(statusCode, statusText, content) {
    this.statusCode = statusCode;
    this.statusText = statusText;
    this.content = content;
  }
}
class HttpClient {
  get(url, options) {
    return this.send({
      ...options,
      method: "GET",
      url
    });
  }
  post(url, options) {
    return this.send({
      ...options,
      method: "POST",
      url
    });
  }
  delete(url, options) {
    return this.send({
      ...options,
      method: "DELETE",
      url
    });
  }
  /** Gets all cookies that apply to the specified URL.
   *
   * @param url The URL that the cookies are valid for.
   * @returns {string} A string containing all the key-value cookie pairs for the specified URL.
   */
  // @ts-ignore
  getCookieString(url) {
    return "";
  }
}
var LogLevel;
(function(LogLevel2) {
  LogLevel2[LogLevel2["Trace"] = 0] = "Trace";
  LogLevel2[LogLevel2["Debug"] = 1] = "Debug";
  LogLevel2[LogLevel2["Information"] = 2] = "Information";
  LogLevel2[LogLevel2["Warning"] = 3] = "Warning";
  LogLevel2[LogLevel2["Error"] = 4] = "Error";
  LogLevel2[LogLevel2["Critical"] = 5] = "Critical";
  LogLevel2[LogLevel2["None"] = 6] = "None";
})(LogLevel || (LogLevel = {}));
class NullLogger {
  constructor() {
  }
  /** @inheritDoc */
  // eslint-disable-next-line
  log(_logLevel, _message) {
  }
}
NullLogger.instance = new NullLogger();
const VERSION = "8.0.17";
class Arg {
  static isRequired(val, name) {
    if (val === null || val === void 0) {
      throw new Error(`The '${name}' argument is required.`);
    }
  }
  static isNotEmpty(val, name) {
    if (!val || val.match(/^\s*$/)) {
      throw new Error(`The '${name}' argument should not be empty.`);
    }
  }
  static isIn(val, values, name) {
    if (!(val in values)) {
      throw new Error(`Unknown ${name} value: ${val}.`);
    }
  }
}
class Platform {
  // react-native has a window but no document so we should check both
  static get isBrowser() {
    return !Platform.isNode && typeof window === "object" && typeof window.document === "object";
  }
  // WebWorkers don't have a window object so the isBrowser check would fail
  static get isWebWorker() {
    return !Platform.isNode && typeof self === "object" && "importScripts" in self;
  }
  // react-native has a window but no document
  static get isReactNative() {
    return !Platform.isNode && typeof window === "object" && typeof window.document === "undefined";
  }
  // Node apps shouldn't have a window object, but WebWorkers don't either
  // so we need to check for both WebWorker and window
  static get isNode() {
    return typeof process !== "undefined" && process.release && process.release.name === "node";
  }
}
function getDataDetail(data, includeContent) {
  let detail = "";
  if (isArrayBuffer(data)) {
    detail = `Binary data of length ${data.byteLength}`;
    if (includeContent) {
      detail += `. Content: '${formatArrayBuffer(data)}'`;
    }
  } else if (typeof data === "string") {
    detail = `String data of length ${data.length}`;
    if (includeContent) {
      detail += `. Content: '${data}'`;
    }
  }
  return detail;
}
function formatArrayBuffer(data) {
  const view = new Uint8Array(data);
  let str = "";
  view.forEach((num) => {
    const pad = num < 16 ? "0" : "";
    str += `0x${pad}${num.toString(16)} `;
  });
  return str.substr(0, str.length - 1);
}
function isArrayBuffer(val) {
  return val && typeof ArrayBuffer !== "undefined" && (val instanceof ArrayBuffer || // Sometimes we get an ArrayBuffer that doesn't satisfy instanceof
  val.constructor && val.constructor.name === "ArrayBuffer");
}
async function sendMessage(logger, transportName, httpClient, url, content, options) {
  const headers = {};
  const [name, value] = getUserAgentHeader();
  headers[name] = value;
  logger.log(LogLevel.Trace, `(${transportName} transport) sending data. ${getDataDetail(content, options.logMessageContent)}.`);
  const responseType = isArrayBuffer(content) ? "arraybuffer" : "text";
  const response = await httpClient.post(url, {
    content,
    headers: { ...headers, ...options.headers },
    responseType,
    timeout: options.timeout,
    withCredentials: options.withCredentials
  });
  logger.log(LogLevel.Trace, `(${transportName} transport) request complete. Response status: ${response.statusCode}.`);
}
function createLogger(logger) {
  if (logger === void 0) {
    return new ConsoleLogger(LogLevel.Information);
  }
  if (logger === null) {
    return NullLogger.instance;
  }
  if (logger.log !== void 0) {
    return logger;
  }
  return new ConsoleLogger(logger);
}
class SubjectSubscription {
  constructor(subject, observer) {
    this._subject = subject;
    this._observer = observer;
  }
  dispose() {
    const index = this._subject.observers.indexOf(this._observer);
    if (index > -1) {
      this._subject.observers.splice(index, 1);
    }
    if (this._subject.observers.length === 0 && this._subject.cancelCallback) {
      this._subject.cancelCallback().catch((_) => {
      });
    }
  }
}
class ConsoleLogger {
  constructor(minimumLogLevel) {
    this._minLevel = minimumLogLevel;
    this.out = console;
  }
  log(logLevel, message) {
    if (logLevel >= this._minLevel) {
      const msg = `[${(/* @__PURE__ */ new Date()).toISOString()}] ${LogLevel[logLevel]}: ${message}`;
      switch (logLevel) {
        case LogLevel.Critical:
        case LogLevel.Error:
          this.out.error(msg);
          break;
        case LogLevel.Warning:
          this.out.warn(msg);
          break;
        case LogLevel.Information:
          this.out.info(msg);
          break;
        default:
          this.out.log(msg);
          break;
      }
    }
  }
}
function getUserAgentHeader() {
  let userAgentHeaderName = "X-SignalR-User-Agent";
  if (Platform.isNode) {
    userAgentHeaderName = "User-Agent";
  }
  return [userAgentHeaderName, constructUserAgent(VERSION, getOsName(), getRuntime(), getRuntimeVersion())];
}
function constructUserAgent(version, os, runtime, runtimeVersion) {
  let userAgent = "Microsoft SignalR/";
  const majorAndMinor = version.split(".");
  userAgent += `${majorAndMinor[0]}.${majorAndMinor[1]}`;
  userAgent += ` (${version}; `;
  if (os && os !== "") {
    userAgent += `${os}; `;
  } else {
    userAgent += "Unknown OS; ";
  }
  userAgent += `${runtime}`;
  if (runtimeVersion) {
    userAgent += `; ${runtimeVersion}`;
  } else {
    userAgent += "; Unknown Runtime Version";
  }
  userAgent += ")";
  return userAgent;
}
function getOsName() {
  if (Platform.isNode) {
    switch (process.platform) {
      case "win32":
        return "Windows NT";
      case "darwin":
        return "macOS";
      case "linux":
        return "Linux";
      default:
        return process.platform;
    }
  } else {
    return "";
  }
}
function getRuntimeVersion() {
  if (Platform.isNode) {
    return process.versions.node;
  }
  return void 0;
}
function getRuntime() {
  if (Platform.isNode) {
    return "NodeJS";
  } else {
    return "Browser";
  }
}
function getErrorString(e) {
  if (e.stack) {
    return e.stack;
  } else if (e.message) {
    return e.message;
  }
  return `${e}`;
}
function getGlobalThis() {
  if (typeof globalThis !== "undefined") {
    return globalThis;
  }
  if (typeof self !== "undefined") {
    return self;
  }
  if (typeof window !== "undefined") {
    return window;
  }
  if (typeof global !== "undefined") {
    return global;
  }
  throw new Error("could not find global");
}
class FetchHttpClient extends HttpClient {
  constructor(logger) {
    super();
    this._logger = logger;
    if (typeof fetch === "undefined" || Platform.isNode) {
      const requireFunc = typeof __webpack_require__ === "function" ? __non_webpack_require__ : require;
      this._jar = new (requireFunc("tough-cookie")).CookieJar();
      if (typeof fetch === "undefined") {
        this._fetchType = requireFunc("node-fetch");
      } else {
        this._fetchType = fetch;
      }
      this._fetchType = requireFunc("fetch-cookie")(this._fetchType, this._jar);
    } else {
      this._fetchType = fetch.bind(getGlobalThis());
    }
    if (typeof AbortController === "undefined") {
      const requireFunc = typeof __webpack_require__ === "function" ? __non_webpack_require__ : require;
      this._abortControllerType = requireFunc("abort-controller");
    } else {
      this._abortControllerType = AbortController;
    }
  }
  /** @inheritDoc */
  async send(request) {
    if (request.abortSignal && request.abortSignal.aborted) {
      throw new AbortError();
    }
    if (!request.method) {
      throw new Error("No method defined.");
    }
    if (!request.url) {
      throw new Error("No url defined.");
    }
    const abortController = new this._abortControllerType();
    let error;
    if (request.abortSignal) {
      request.abortSignal.onabort = () => {
        abortController.abort();
        error = new AbortError();
      };
    }
    let timeoutId = null;
    if (request.timeout) {
      const msTimeout = request.timeout;
      timeoutId = setTimeout(() => {
        abortController.abort();
        this._logger.log(LogLevel.Warning, `Timeout from HTTP request.`);
        error = new TimeoutError();
      }, msTimeout);
    }
    if (request.content === "") {
      request.content = void 0;
    }
    if (request.content) {
      request.headers = request.headers || {};
      if (isArrayBuffer(request.content)) {
        request.headers["Content-Type"] = "application/octet-stream";
      } else {
        request.headers["Content-Type"] = "text/plain;charset=UTF-8";
      }
    }
    let response;
    try {
      response = await this._fetchType(request.url, {
        body: request.content,
        cache: "no-cache",
        credentials: request.withCredentials === true ? "include" : "same-origin",
        headers: {
          "X-Requested-With": "XMLHttpRequest",
          ...request.headers
        },
        method: request.method,
        mode: "cors",
        redirect: "follow",
        signal: abortController.signal
      });
    } catch (e) {
      if (error) {
        throw error;
      }
      this._logger.log(LogLevel.Warning, `Error from HTTP request. ${e}.`);
      throw e;
    } finally {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      if (request.abortSignal) {
        request.abortSignal.onabort = null;
      }
    }
    if (!response.ok) {
      const errorMessage = await deserializeContent(response, "text");
      throw new HttpError(errorMessage || response.statusText, response.status);
    }
    const content = deserializeContent(response, request.responseType);
    const payload = await content;
    return new HttpResponse(response.status, response.statusText, payload);
  }
  getCookieString(url) {
    let cookies = "";
    if (Platform.isNode && this._jar) {
      this._jar.getCookies(url, (e, c) => cookies = c.join("; "));
    }
    return cookies;
  }
}
function deserializeContent(response, responseType) {
  let content;
  switch (responseType) {
    case "arraybuffer":
      content = response.arrayBuffer();
      break;
    case "text":
      content = response.text();
      break;
    case "blob":
    case "document":
    case "json":
      throw new Error(`${responseType} is not supported.`);
    default:
      content = response.text();
      break;
  }
  return content;
}
class XhrHttpClient extends HttpClient {
  constructor(logger) {
    super();
    this._logger = logger;
  }
  /** @inheritDoc */
  send(request) {
    if (request.abortSignal && request.abortSignal.aborted) {
      return Promise.reject(new AbortError());
    }
    if (!request.method) {
      return Promise.reject(new Error("No method defined."));
    }
    if (!request.url) {
      return Promise.reject(new Error("No url defined."));
    }
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open(request.method, request.url, true);
      xhr.withCredentials = request.withCredentials === void 0 ? true : request.withCredentials;
      xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
      if (request.content === "") {
        request.content = void 0;
      }
      if (request.content) {
        if (isArrayBuffer(request.content)) {
          xhr.setRequestHeader("Content-Type", "application/octet-stream");
        } else {
          xhr.setRequestHeader("Content-Type", "text/plain;charset=UTF-8");
        }
      }
      const headers = request.headers;
      if (headers) {
        Object.keys(headers).forEach((header) => {
          xhr.setRequestHeader(header, headers[header]);
        });
      }
      if (request.responseType) {
        xhr.responseType = request.responseType;
      }
      if (request.abortSignal) {
        request.abortSignal.onabort = () => {
          xhr.abort();
          reject(new AbortError());
        };
      }
      if (request.timeout) {
        xhr.timeout = request.timeout;
      }
      xhr.onload = () => {
        if (request.abortSignal) {
          request.abortSignal.onabort = null;
        }
        if (xhr.status >= 200 && xhr.status < 300) {
          resolve(new HttpResponse(xhr.status, xhr.statusText, xhr.response || xhr.responseText));
        } else {
          reject(new HttpError(xhr.response || xhr.responseText || xhr.statusText, xhr.status));
        }
      };
      xhr.onerror = () => {
        this._logger.log(LogLevel.Warning, `Error from HTTP request. ${xhr.status}: ${xhr.statusText}.`);
        reject(new HttpError(xhr.statusText, xhr.status));
      };
      xhr.ontimeout = () => {
        this._logger.log(LogLevel.Warning, `Timeout from HTTP request.`);
        reject(new TimeoutError());
      };
      xhr.send(request.content);
    });
  }
}
class DefaultHttpClient extends HttpClient {
  /** Creates a new instance of the {@link @microsoft/signalr.DefaultHttpClient}, using the provided {@link @microsoft/signalr.ILogger} to log messages. */
  constructor(logger) {
    super();
    if (typeof fetch !== "undefined" || Platform.isNode) {
      this._httpClient = new FetchHttpClient(logger);
    } else if (typeof XMLHttpRequest !== "undefined") {
      this._httpClient = new XhrHttpClient(logger);
    } else {
      throw new Error("No usable HttpClient found.");
    }
  }
  /** @inheritDoc */
  send(request) {
    if (request.abortSignal && request.abortSignal.aborted) {
      return Promise.reject(new AbortError());
    }
    if (!request.method) {
      return Promise.reject(new Error("No method defined."));
    }
    if (!request.url) {
      return Promise.reject(new Error("No url defined."));
    }
    return this._httpClient.send(request);
  }
  getCookieString(url) {
    return this._httpClient.getCookieString(url);
  }
}
class TextMessageFormat {
  static write(output) {
    return `${output}${TextMessageFormat.RecordSeparator}`;
  }
  static parse(input) {
    if (input[input.length - 1] !== TextMessageFormat.RecordSeparator) {
      throw new Error("Message is incomplete.");
    }
    const messages = input.split(TextMessageFormat.RecordSeparator);
    messages.pop();
    return messages;
  }
}
TextMessageFormat.RecordSeparatorCode = 30;
TextMessageFormat.RecordSeparator = String.fromCharCode(TextMessageFormat.RecordSeparatorCode);
class HandshakeProtocol {
  // Handshake request is always JSON
  writeHandshakeRequest(handshakeRequest) {
    return TextMessageFormat.write(JSON.stringify(handshakeRequest));
  }
  parseHandshakeResponse(data) {
    let messageData;
    let remainingData;
    if (isArrayBuffer(data)) {
      const binaryData = new Uint8Array(data);
      const separatorIndex = binaryData.indexOf(TextMessageFormat.RecordSeparatorCode);
      if (separatorIndex === -1) {
        throw new Error("Message is incomplete.");
      }
      const responseLength = separatorIndex + 1;
      messageData = String.fromCharCode.apply(null, Array.prototype.slice.call(binaryData.slice(0, responseLength)));
      remainingData = binaryData.byteLength > responseLength ? binaryData.slice(responseLength).buffer : null;
    } else {
      const textData = data;
      const separatorIndex = textData.indexOf(TextMessageFormat.RecordSeparator);
      if (separatorIndex === -1) {
        throw new Error("Message is incomplete.");
      }
      const responseLength = separatorIndex + 1;
      messageData = textData.substring(0, responseLength);
      remainingData = textData.length > responseLength ? textData.substring(responseLength) : null;
    }
    const messages = TextMessageFormat.parse(messageData);
    const response = JSON.parse(messages[0]);
    if (response.type) {
      throw new Error("Expected a handshake response from the server.");
    }
    const responseMessage = response;
    return [remainingData, responseMessage];
  }
}
var MessageType;
(function(MessageType2) {
  MessageType2[MessageType2["Invocation"] = 1] = "Invocation";
  MessageType2[MessageType2["StreamItem"] = 2] = "StreamItem";
  MessageType2[MessageType2["Completion"] = 3] = "Completion";
  MessageType2[MessageType2["StreamInvocation"] = 4] = "StreamInvocation";
  MessageType2[MessageType2["CancelInvocation"] = 5] = "CancelInvocation";
  MessageType2[MessageType2["Ping"] = 6] = "Ping";
  MessageType2[MessageType2["Close"] = 7] = "Close";
  MessageType2[MessageType2["Ack"] = 8] = "Ack";
  MessageType2[MessageType2["Sequence"] = 9] = "Sequence";
})(MessageType || (MessageType = {}));
class Subject {
  constructor() {
    this.observers = [];
  }
  next(item) {
    for (const observer of this.observers) {
      observer.next(item);
    }
  }
  error(err) {
    for (const observer of this.observers) {
      if (observer.error) {
        observer.error(err);
      }
    }
  }
  complete() {
    for (const observer of this.observers) {
      if (observer.complete) {
        observer.complete();
      }
    }
  }
  subscribe(observer) {
    this.observers.push(observer);
    return new SubjectSubscription(this, observer);
  }
}
class MessageBuffer {
  constructor(protocol, connection2, bufferSize) {
    this._bufferSize = 1e5;
    this._messages = [];
    this._totalMessageCount = 0;
    this._waitForSequenceMessage = false;
    this._nextReceivingSequenceId = 1;
    this._latestReceivedSequenceId = 0;
    this._bufferedByteCount = 0;
    this._reconnectInProgress = false;
    this._protocol = protocol;
    this._connection = connection2;
    this._bufferSize = bufferSize;
  }
  async _send(message) {
    const serializedMessage = this._protocol.writeMessage(message);
    let backpressurePromise = Promise.resolve();
    if (this._isInvocationMessage(message)) {
      this._totalMessageCount++;
      let backpressurePromiseResolver = () => {
      };
      let backpressurePromiseRejector = () => {
      };
      if (isArrayBuffer(serializedMessage)) {
        this._bufferedByteCount += serializedMessage.byteLength;
      } else {
        this._bufferedByteCount += serializedMessage.length;
      }
      if (this._bufferedByteCount >= this._bufferSize) {
        backpressurePromise = new Promise((resolve, reject) => {
          backpressurePromiseResolver = resolve;
          backpressurePromiseRejector = reject;
        });
      }
      this._messages.push(new BufferedItem(serializedMessage, this._totalMessageCount, backpressurePromiseResolver, backpressurePromiseRejector));
    }
    try {
      if (!this._reconnectInProgress) {
        await this._connection.send(serializedMessage);
      }
    } catch {
      this._disconnected();
    }
    await backpressurePromise;
  }
  _ack(ackMessage) {
    let newestAckedMessage = -1;
    for (let index = 0; index < this._messages.length; index++) {
      const element = this._messages[index];
      if (element._id <= ackMessage.sequenceId) {
        newestAckedMessage = index;
        if (isArrayBuffer(element._message)) {
          this._bufferedByteCount -= element._message.byteLength;
        } else {
          this._bufferedByteCount -= element._message.length;
        }
        element._resolver();
      } else if (this._bufferedByteCount < this._bufferSize) {
        element._resolver();
      } else {
        break;
      }
    }
    if (newestAckedMessage !== -1) {
      this._messages = this._messages.slice(newestAckedMessage + 1);
    }
  }
  _shouldProcessMessage(message) {
    if (this._waitForSequenceMessage) {
      if (message.type !== MessageType.Sequence) {
        return false;
      } else {
        this._waitForSequenceMessage = false;
        return true;
      }
    }
    if (!this._isInvocationMessage(message)) {
      return true;
    }
    const currentId = this._nextReceivingSequenceId;
    this._nextReceivingSequenceId++;
    if (currentId <= this._latestReceivedSequenceId) {
      if (currentId === this._latestReceivedSequenceId) {
        this._ackTimer();
      }
      return false;
    }
    this._latestReceivedSequenceId = currentId;
    this._ackTimer();
    return true;
  }
  _resetSequence(message) {
    if (message.sequenceId > this._nextReceivingSequenceId) {
      this._connection.stop(new Error("Sequence ID greater than amount of messages we've received."));
      return;
    }
    this._nextReceivingSequenceId = message.sequenceId;
  }
  _disconnected() {
    this._reconnectInProgress = true;
    this._waitForSequenceMessage = true;
  }
  async _resend() {
    const sequenceId = this._messages.length !== 0 ? this._messages[0]._id : this._totalMessageCount + 1;
    await this._connection.send(this._protocol.writeMessage({ type: MessageType.Sequence, sequenceId }));
    const messages = this._messages;
    for (const element of messages) {
      await this._connection.send(element._message);
    }
    this._reconnectInProgress = false;
  }
  _dispose(error) {
    error !== null && error !== void 0 ? error : error = new Error("Unable to reconnect to server.");
    for (const element of this._messages) {
      element._rejector(error);
    }
  }
  _isInvocationMessage(message) {
    switch (message.type) {
      case MessageType.Invocation:
      case MessageType.StreamItem:
      case MessageType.Completion:
      case MessageType.StreamInvocation:
      case MessageType.CancelInvocation:
        return true;
      case MessageType.Close:
      case MessageType.Sequence:
      case MessageType.Ping:
      case MessageType.Ack:
        return false;
    }
  }
  _ackTimer() {
    if (this._ackTimerHandle === void 0) {
      this._ackTimerHandle = setTimeout(async () => {
        try {
          if (!this._reconnectInProgress) {
            await this._connection.send(this._protocol.writeMessage({ type: MessageType.Ack, sequenceId: this._latestReceivedSequenceId }));
          }
        } catch {
        }
        clearTimeout(this._ackTimerHandle);
        this._ackTimerHandle = void 0;
      }, 1e3);
    }
  }
}
class BufferedItem {
  constructor(message, id, resolver, rejector) {
    this._message = message;
    this._id = id;
    this._resolver = resolver;
    this._rejector = rejector;
  }
}
const DEFAULT_TIMEOUT_IN_MS = 30 * 1e3;
const DEFAULT_PING_INTERVAL_IN_MS = 15 * 1e3;
const DEFAULT_STATEFUL_RECONNECT_BUFFER_SIZE = 1e5;
var HubConnectionState;
(function(HubConnectionState2) {
  HubConnectionState2["Disconnected"] = "Disconnected";
  HubConnectionState2["Connecting"] = "Connecting";
  HubConnectionState2["Connected"] = "Connected";
  HubConnectionState2["Disconnecting"] = "Disconnecting";
  HubConnectionState2["Reconnecting"] = "Reconnecting";
})(HubConnectionState || (HubConnectionState = {}));
class HubConnection {
  /** @internal */
  // Using a public static factory method means we can have a private constructor and an _internal_
  // create method that can be used by HubConnectionBuilder. An "internal" constructor would just
  // be stripped away and the '.d.ts' file would have no constructor, which is interpreted as a
  // public parameter-less constructor.
  static create(connection2, logger, protocol, reconnectPolicy, serverTimeoutInMilliseconds, keepAliveIntervalInMilliseconds, statefulReconnectBufferSize) {
    return new HubConnection(connection2, logger, protocol, reconnectPolicy, serverTimeoutInMilliseconds, keepAliveIntervalInMilliseconds, statefulReconnectBufferSize);
  }
  constructor(connection2, logger, protocol, reconnectPolicy, serverTimeoutInMilliseconds, keepAliveIntervalInMilliseconds, statefulReconnectBufferSize) {
    this._nextKeepAlive = 0;
    this._freezeEventListener = () => {
      this._logger.log(LogLevel.Warning, "The page is being frozen, this will likely lead to the connection being closed and messages being lost. For more information see the docs at https://learn.microsoft.com/aspnet/core/signalr/javascript-client#bsleep");
    };
    Arg.isRequired(connection2, "connection");
    Arg.isRequired(logger, "logger");
    Arg.isRequired(protocol, "protocol");
    this.serverTimeoutInMilliseconds = serverTimeoutInMilliseconds !== null && serverTimeoutInMilliseconds !== void 0 ? serverTimeoutInMilliseconds : DEFAULT_TIMEOUT_IN_MS;
    this.keepAliveIntervalInMilliseconds = keepAliveIntervalInMilliseconds !== null && keepAliveIntervalInMilliseconds !== void 0 ? keepAliveIntervalInMilliseconds : DEFAULT_PING_INTERVAL_IN_MS;
    this._statefulReconnectBufferSize = statefulReconnectBufferSize !== null && statefulReconnectBufferSize !== void 0 ? statefulReconnectBufferSize : DEFAULT_STATEFUL_RECONNECT_BUFFER_SIZE;
    this._logger = logger;
    this._protocol = protocol;
    this.connection = connection2;
    this._reconnectPolicy = reconnectPolicy;
    this._handshakeProtocol = new HandshakeProtocol();
    this.connection.onreceive = (data) => this._processIncomingData(data);
    this.connection.onclose = (error) => this._connectionClosed(error);
    this._callbacks = {};
    this._methods = {};
    this._closedCallbacks = [];
    this._reconnectingCallbacks = [];
    this._reconnectedCallbacks = [];
    this._invocationId = 0;
    this._receivedHandshakeResponse = false;
    this._connectionState = HubConnectionState.Disconnected;
    this._connectionStarted = false;
    this._cachedPingMessage = this._protocol.writeMessage({ type: MessageType.Ping });
  }
  /** Indicates the state of the {@link HubConnection} to the server. */
  get state() {
    return this._connectionState;
  }
  /** Represents the connection id of the {@link HubConnection} on the server. The connection id will be null when the connection is either
   *  in the disconnected state or if the negotiation step was skipped.
   */
  get connectionId() {
    return this.connection ? this.connection.connectionId || null : null;
  }
  /** Indicates the url of the {@link HubConnection} to the server. */
  get baseUrl() {
    return this.connection.baseUrl || "";
  }
  /**
   * Sets a new url for the HubConnection. Note that the url can only be changed when the connection is in either the Disconnected or
   * Reconnecting states.
   * @param {string} url The url to connect to.
   */
  set baseUrl(url) {
    if (this._connectionState !== HubConnectionState.Disconnected && this._connectionState !== HubConnectionState.Reconnecting) {
      throw new Error("The HubConnection must be in the Disconnected or Reconnecting state to change the url.");
    }
    if (!url) {
      throw new Error("The HubConnection url must be a valid url.");
    }
    this.connection.baseUrl = url;
  }
  /** Starts the connection.
   *
   * @returns {Promise<void>} A Promise that resolves when the connection has been successfully established, or rejects with an error.
   */
  start() {
    this._startPromise = this._startWithStateTransitions();
    return this._startPromise;
  }
  async _startWithStateTransitions() {
    if (this._connectionState !== HubConnectionState.Disconnected) {
      return Promise.reject(new Error("Cannot start a HubConnection that is not in the 'Disconnected' state."));
    }
    this._connectionState = HubConnectionState.Connecting;
    this._logger.log(LogLevel.Debug, "Starting HubConnection.");
    try {
      await this._startInternal();
      if (Platform.isBrowser) {
        window.document.addEventListener("freeze", this._freezeEventListener);
      }
      this._connectionState = HubConnectionState.Connected;
      this._connectionStarted = true;
      this._logger.log(LogLevel.Debug, "HubConnection connected successfully.");
    } catch (e) {
      this._connectionState = HubConnectionState.Disconnected;
      this._logger.log(LogLevel.Debug, `HubConnection failed to start successfully because of error '${e}'.`);
      return Promise.reject(e);
    }
  }
  async _startInternal() {
    this._stopDuringStartError = void 0;
    this._receivedHandshakeResponse = false;
    const handshakePromise = new Promise((resolve, reject) => {
      this._handshakeResolver = resolve;
      this._handshakeRejecter = reject;
    });
    await this.connection.start(this._protocol.transferFormat);
    try {
      let version = this._protocol.version;
      if (!this.connection.features.reconnect) {
        version = 1;
      }
      const handshakeRequest = {
        protocol: this._protocol.name,
        version
      };
      this._logger.log(LogLevel.Debug, "Sending handshake request.");
      await this._sendMessage(this._handshakeProtocol.writeHandshakeRequest(handshakeRequest));
      this._logger.log(LogLevel.Information, `Using HubProtocol '${this._protocol.name}'.`);
      this._cleanupTimeout();
      this._resetTimeoutPeriod();
      this._resetKeepAliveInterval();
      await handshakePromise;
      if (this._stopDuringStartError) {
        throw this._stopDuringStartError;
      }
      const useStatefulReconnect = this.connection.features.reconnect || false;
      if (useStatefulReconnect) {
        this._messageBuffer = new MessageBuffer(this._protocol, this.connection, this._statefulReconnectBufferSize);
        this.connection.features.disconnected = this._messageBuffer._disconnected.bind(this._messageBuffer);
        this.connection.features.resend = () => {
          if (this._messageBuffer) {
            return this._messageBuffer._resend();
          }
        };
      }
      if (!this.connection.features.inherentKeepAlive) {
        await this._sendMessage(this._cachedPingMessage);
      }
    } catch (e) {
      this._logger.log(LogLevel.Debug, `Hub handshake failed with error '${e}' during start(). Stopping HubConnection.`);
      this._cleanupTimeout();
      this._cleanupPingTimer();
      await this.connection.stop(e);
      throw e;
    }
  }
  /** Stops the connection.
   *
   * @returns {Promise<void>} A Promise that resolves when the connection has been successfully terminated, or rejects with an error.
   */
  async stop() {
    const startPromise = this._startPromise;
    this.connection.features.reconnect = false;
    this._stopPromise = this._stopInternal();
    await this._stopPromise;
    try {
      await startPromise;
    } catch (e) {
    }
  }
  _stopInternal(error) {
    if (this._connectionState === HubConnectionState.Disconnected) {
      this._logger.log(LogLevel.Debug, `Call to HubConnection.stop(${error}) ignored because it is already in the disconnected state.`);
      return Promise.resolve();
    }
    if (this._connectionState === HubConnectionState.Disconnecting) {
      this._logger.log(LogLevel.Debug, `Call to HttpConnection.stop(${error}) ignored because the connection is already in the disconnecting state.`);
      return this._stopPromise;
    }
    const state = this._connectionState;
    this._connectionState = HubConnectionState.Disconnecting;
    this._logger.log(LogLevel.Debug, "Stopping HubConnection.");
    if (this._reconnectDelayHandle) {
      this._logger.log(LogLevel.Debug, "Connection stopped during reconnect delay. Done reconnecting.");
      clearTimeout(this._reconnectDelayHandle);
      this._reconnectDelayHandle = void 0;
      this._completeClose();
      return Promise.resolve();
    }
    if (state === HubConnectionState.Connected) {
      this._sendCloseMessage();
    }
    this._cleanupTimeout();
    this._cleanupPingTimer();
    this._stopDuringStartError = error || new AbortError("The connection was stopped before the hub handshake could complete.");
    return this.connection.stop(error);
  }
  async _sendCloseMessage() {
    try {
      await this._sendWithProtocol(this._createCloseMessage());
    } catch {
    }
  }
  /** Invokes a streaming hub method on the server using the specified name and arguments.
   *
   * @typeparam T The type of the items returned by the server.
   * @param {string} methodName The name of the server method to invoke.
   * @param {any[]} args The arguments used to invoke the server method.
   * @returns {IStreamResult<T>} An object that yields results from the server as they are received.
   */
  stream(methodName, ...args) {
    const [streams, streamIds] = this._replaceStreamingParams(args);
    const invocationDescriptor = this._createStreamInvocation(methodName, args, streamIds);
    let promiseQueue;
    const subject = new Subject();
    subject.cancelCallback = () => {
      const cancelInvocation = this._createCancelInvocation(invocationDescriptor.invocationId);
      delete this._callbacks[invocationDescriptor.invocationId];
      return promiseQueue.then(() => {
        return this._sendWithProtocol(cancelInvocation);
      });
    };
    this._callbacks[invocationDescriptor.invocationId] = (invocationEvent, error) => {
      if (error) {
        subject.error(error);
        return;
      } else if (invocationEvent) {
        if (invocationEvent.type === MessageType.Completion) {
          if (invocationEvent.error) {
            subject.error(new Error(invocationEvent.error));
          } else {
            subject.complete();
          }
        } else {
          subject.next(invocationEvent.item);
        }
      }
    };
    promiseQueue = this._sendWithProtocol(invocationDescriptor).catch((e) => {
      subject.error(e);
      delete this._callbacks[invocationDescriptor.invocationId];
    });
    this._launchStreams(streams, promiseQueue);
    return subject;
  }
  _sendMessage(message) {
    this._resetKeepAliveInterval();
    return this.connection.send(message);
  }
  /**
   * Sends a js object to the server.
   * @param message The js object to serialize and send.
   */
  _sendWithProtocol(message) {
    if (this._messageBuffer) {
      return this._messageBuffer._send(message);
    } else {
      return this._sendMessage(this._protocol.writeMessage(message));
    }
  }
  /** Invokes a hub method on the server using the specified name and arguments. Does not wait for a response from the receiver.
   *
   * The Promise returned by this method resolves when the client has sent the invocation to the server. The server may still
   * be processing the invocation.
   *
   * @param {string} methodName The name of the server method to invoke.
   * @param {any[]} args The arguments used to invoke the server method.
   * @returns {Promise<void>} A Promise that resolves when the invocation has been successfully sent, or rejects with an error.
   */
  send(methodName, ...args) {
    const [streams, streamIds] = this._replaceStreamingParams(args);
    const sendPromise = this._sendWithProtocol(this._createInvocation(methodName, args, true, streamIds));
    this._launchStreams(streams, sendPromise);
    return sendPromise;
  }
  /** Invokes a hub method on the server using the specified name and arguments.
   *
   * The Promise returned by this method resolves when the server indicates it has finished invoking the method. When the promise
   * resolves, the server has finished invoking the method. If the server method returns a result, it is produced as the result of
   * resolving the Promise.
   *
   * @typeparam T The expected return type.
   * @param {string} methodName The name of the server method to invoke.
   * @param {any[]} args The arguments used to invoke the server method.
   * @returns {Promise<T>} A Promise that resolves with the result of the server method (if any), or rejects with an error.
   */
  invoke(methodName, ...args) {
    const [streams, streamIds] = this._replaceStreamingParams(args);
    const invocationDescriptor = this._createInvocation(methodName, args, false, streamIds);
    const p = new Promise((resolve, reject) => {
      this._callbacks[invocationDescriptor.invocationId] = (invocationEvent, error) => {
        if (error) {
          reject(error);
          return;
        } else if (invocationEvent) {
          if (invocationEvent.type === MessageType.Completion) {
            if (invocationEvent.error) {
              reject(new Error(invocationEvent.error));
            } else {
              resolve(invocationEvent.result);
            }
          } else {
            reject(new Error(`Unexpected message type: ${invocationEvent.type}`));
          }
        }
      };
      const promiseQueue = this._sendWithProtocol(invocationDescriptor).catch((e) => {
        reject(e);
        delete this._callbacks[invocationDescriptor.invocationId];
      });
      this._launchStreams(streams, promiseQueue);
    });
    return p;
  }
  on(methodName, newMethod) {
    if (!methodName || !newMethod) {
      return;
    }
    methodName = methodName.toLowerCase();
    if (!this._methods[methodName]) {
      this._methods[methodName] = [];
    }
    if (this._methods[methodName].indexOf(newMethod) !== -1) {
      return;
    }
    this._methods[methodName].push(newMethod);
  }
  off(methodName, method) {
    if (!methodName) {
      return;
    }
    methodName = methodName.toLowerCase();
    const handlers = this._methods[methodName];
    if (!handlers) {
      return;
    }
    if (method) {
      const removeIdx = handlers.indexOf(method);
      if (removeIdx !== -1) {
        handlers.splice(removeIdx, 1);
        if (handlers.length === 0) {
          delete this._methods[methodName];
        }
      }
    } else {
      delete this._methods[methodName];
    }
  }
  /** Registers a handler that will be invoked when the connection is closed.
   *
   * @param {Function} callback The handler that will be invoked when the connection is closed. Optionally receives a single argument containing the error that caused the connection to close (if any).
   */
  onclose(callback) {
    if (callback) {
      this._closedCallbacks.push(callback);
    }
  }
  /** Registers a handler that will be invoked when the connection starts reconnecting.
   *
   * @param {Function} callback The handler that will be invoked when the connection starts reconnecting. Optionally receives a single argument containing the error that caused the connection to start reconnecting (if any).
   */
  onreconnecting(callback) {
    if (callback) {
      this._reconnectingCallbacks.push(callback);
    }
  }
  /** Registers a handler that will be invoked when the connection successfully reconnects.
   *
   * @param {Function} callback The handler that will be invoked when the connection successfully reconnects.
   */
  onreconnected(callback) {
    if (callback) {
      this._reconnectedCallbacks.push(callback);
    }
  }
  _processIncomingData(data) {
    this._cleanupTimeout();
    if (!this._receivedHandshakeResponse) {
      data = this._processHandshakeResponse(data);
      this._receivedHandshakeResponse = true;
    }
    if (data) {
      const messages = this._protocol.parseMessages(data, this._logger);
      for (const message of messages) {
        if (this._messageBuffer && !this._messageBuffer._shouldProcessMessage(message)) {
          continue;
        }
        switch (message.type) {
          case MessageType.Invocation:
            this._invokeClientMethod(message).catch((e) => {
              this._logger.log(LogLevel.Error, `Invoke client method threw error: ${getErrorString(e)}`);
            });
            break;
          case MessageType.StreamItem:
          case MessageType.Completion: {
            const callback = this._callbacks[message.invocationId];
            if (callback) {
              if (message.type === MessageType.Completion) {
                delete this._callbacks[message.invocationId];
              }
              try {
                callback(message);
              } catch (e) {
                this._logger.log(LogLevel.Error, `Stream callback threw error: ${getErrorString(e)}`);
              }
            }
            break;
          }
          case MessageType.Ping:
            break;
          case MessageType.Close: {
            this._logger.log(LogLevel.Information, "Close message received from server.");
            const error = message.error ? new Error("Server returned an error on close: " + message.error) : void 0;
            if (message.allowReconnect === true) {
              this.connection.stop(error);
            } else {
              this._stopPromise = this._stopInternal(error);
            }
            break;
          }
          case MessageType.Ack:
            if (this._messageBuffer) {
              this._messageBuffer._ack(message);
            }
            break;
          case MessageType.Sequence:
            if (this._messageBuffer) {
              this._messageBuffer._resetSequence(message);
            }
            break;
          default:
            this._logger.log(LogLevel.Warning, `Invalid message type: ${message.type}.`);
            break;
        }
      }
    }
    this._resetTimeoutPeriod();
  }
  _processHandshakeResponse(data) {
    let responseMessage;
    let remainingData;
    try {
      [remainingData, responseMessage] = this._handshakeProtocol.parseHandshakeResponse(data);
    } catch (e) {
      const message = "Error parsing handshake response: " + e;
      this._logger.log(LogLevel.Error, message);
      const error = new Error(message);
      this._handshakeRejecter(error);
      throw error;
    }
    if (responseMessage.error) {
      const message = "Server returned handshake error: " + responseMessage.error;
      this._logger.log(LogLevel.Error, message);
      const error = new Error(message);
      this._handshakeRejecter(error);
      throw error;
    } else {
      this._logger.log(LogLevel.Debug, "Server handshake complete.");
    }
    this._handshakeResolver();
    return remainingData;
  }
  _resetKeepAliveInterval() {
    if (this.connection.features.inherentKeepAlive) {
      return;
    }
    this._nextKeepAlive = (/* @__PURE__ */ new Date()).getTime() + this.keepAliveIntervalInMilliseconds;
    this._cleanupPingTimer();
  }
  _resetTimeoutPeriod() {
    if (!this.connection.features || !this.connection.features.inherentKeepAlive) {
      this._timeoutHandle = setTimeout(() => this.serverTimeout(), this.serverTimeoutInMilliseconds);
      if (this._pingServerHandle === void 0) {
        let nextPing = this._nextKeepAlive - (/* @__PURE__ */ new Date()).getTime();
        if (nextPing < 0) {
          nextPing = 0;
        }
        this._pingServerHandle = setTimeout(async () => {
          if (this._connectionState === HubConnectionState.Connected) {
            try {
              await this._sendMessage(this._cachedPingMessage);
            } catch {
              this._cleanupPingTimer();
            }
          }
        }, nextPing);
      }
    }
  }
  // eslint-disable-next-line @typescript-eslint/naming-convention
  serverTimeout() {
    this.connection.stop(new Error("Server timeout elapsed without receiving a message from the server."));
  }
  async _invokeClientMethod(invocationMessage) {
    const methodName = invocationMessage.target.toLowerCase();
    const methods = this._methods[methodName];
    if (!methods) {
      this._logger.log(LogLevel.Warning, `No client method with the name '${methodName}' found.`);
      if (invocationMessage.invocationId) {
        this._logger.log(LogLevel.Warning, `No result given for '${methodName}' method and invocation ID '${invocationMessage.invocationId}'.`);
        await this._sendWithProtocol(this._createCompletionMessage(invocationMessage.invocationId, "Client didn't provide a result.", null));
      }
      return;
    }
    const methodsCopy = methods.slice();
    const expectsResponse = invocationMessage.invocationId ? true : false;
    let res;
    let exception;
    let completionMessage;
    for (const m of methodsCopy) {
      try {
        const prevRes = res;
        res = await m.apply(this, invocationMessage.arguments);
        if (expectsResponse && res && prevRes) {
          this._logger.log(LogLevel.Error, `Multiple results provided for '${methodName}'. Sending error to server.`);
          completionMessage = this._createCompletionMessage(invocationMessage.invocationId, `Client provided multiple results.`, null);
        }
        exception = void 0;
      } catch (e) {
        exception = e;
        this._logger.log(LogLevel.Error, `A callback for the method '${methodName}' threw error '${e}'.`);
      }
    }
    if (completionMessage) {
      await this._sendWithProtocol(completionMessage);
    } else if (expectsResponse) {
      if (exception) {
        completionMessage = this._createCompletionMessage(invocationMessage.invocationId, `${exception}`, null);
      } else if (res !== void 0) {
        completionMessage = this._createCompletionMessage(invocationMessage.invocationId, null, res);
      } else {
        this._logger.log(LogLevel.Warning, `No result given for '${methodName}' method and invocation ID '${invocationMessage.invocationId}'.`);
        completionMessage = this._createCompletionMessage(invocationMessage.invocationId, "Client didn't provide a result.", null);
      }
      await this._sendWithProtocol(completionMessage);
    } else {
      if (res) {
        this._logger.log(LogLevel.Error, `Result given for '${methodName}' method but server is not expecting a result.`);
      }
    }
  }
  _connectionClosed(error) {
    this._logger.log(LogLevel.Debug, `HubConnection.connectionClosed(${error}) called while in state ${this._connectionState}.`);
    this._stopDuringStartError = this._stopDuringStartError || error || new AbortError("The underlying connection was closed before the hub handshake could complete.");
    if (this._handshakeResolver) {
      this._handshakeResolver();
    }
    this._cancelCallbacksWithError(error || new Error("Invocation canceled due to the underlying connection being closed."));
    this._cleanupTimeout();
    this._cleanupPingTimer();
    if (this._connectionState === HubConnectionState.Disconnecting) {
      this._completeClose(error);
    } else if (this._connectionState === HubConnectionState.Connected && this._reconnectPolicy) {
      this._reconnect(error);
    } else if (this._connectionState === HubConnectionState.Connected) {
      this._completeClose(error);
    }
  }
  _completeClose(error) {
    if (this._connectionStarted) {
      this._connectionState = HubConnectionState.Disconnected;
      this._connectionStarted = false;
      if (this._messageBuffer) {
        this._messageBuffer._dispose(error !== null && error !== void 0 ? error : new Error("Connection closed."));
        this._messageBuffer = void 0;
      }
      if (Platform.isBrowser) {
        window.document.removeEventListener("freeze", this._freezeEventListener);
      }
      try {
        this._closedCallbacks.forEach((c) => c.apply(this, [error]));
      } catch (e) {
        this._logger.log(LogLevel.Error, `An onclose callback called with error '${error}' threw error '${e}'.`);
      }
    }
  }
  async _reconnect(error) {
    const reconnectStartTime = Date.now();
    let previousReconnectAttempts = 0;
    let retryError = error !== void 0 ? error : new Error("Attempting to reconnect due to a unknown error.");
    let nextRetryDelay = this._getNextRetryDelay(previousReconnectAttempts++, 0, retryError);
    if (nextRetryDelay === null) {
      this._logger.log(LogLevel.Debug, "Connection not reconnecting because the IRetryPolicy returned null on the first reconnect attempt.");
      this._completeClose(error);
      return;
    }
    this._connectionState = HubConnectionState.Reconnecting;
    if (error) {
      this._logger.log(LogLevel.Information, `Connection reconnecting because of error '${error}'.`);
    } else {
      this._logger.log(LogLevel.Information, "Connection reconnecting.");
    }
    if (this._reconnectingCallbacks.length !== 0) {
      try {
        this._reconnectingCallbacks.forEach((c) => c.apply(this, [error]));
      } catch (e) {
        this._logger.log(LogLevel.Error, `An onreconnecting callback called with error '${error}' threw error '${e}'.`);
      }
      if (this._connectionState !== HubConnectionState.Reconnecting) {
        this._logger.log(LogLevel.Debug, "Connection left the reconnecting state in onreconnecting callback. Done reconnecting.");
        return;
      }
    }
    while (nextRetryDelay !== null) {
      this._logger.log(LogLevel.Information, `Reconnect attempt number ${previousReconnectAttempts} will start in ${nextRetryDelay} ms.`);
      await new Promise((resolve) => {
        this._reconnectDelayHandle = setTimeout(resolve, nextRetryDelay);
      });
      this._reconnectDelayHandle = void 0;
      if (this._connectionState !== HubConnectionState.Reconnecting) {
        this._logger.log(LogLevel.Debug, "Connection left the reconnecting state during reconnect delay. Done reconnecting.");
        return;
      }
      try {
        await this._startInternal();
        this._connectionState = HubConnectionState.Connected;
        this._logger.log(LogLevel.Information, "HubConnection reconnected successfully.");
        if (this._reconnectedCallbacks.length !== 0) {
          try {
            this._reconnectedCallbacks.forEach((c) => c.apply(this, [this.connection.connectionId]));
          } catch (e) {
            this._logger.log(LogLevel.Error, `An onreconnected callback called with connectionId '${this.connection.connectionId}; threw error '${e}'.`);
          }
        }
        return;
      } catch (e) {
        this._logger.log(LogLevel.Information, `Reconnect attempt failed because of error '${e}'.`);
        if (this._connectionState !== HubConnectionState.Reconnecting) {
          this._logger.log(LogLevel.Debug, `Connection moved to the '${this._connectionState}' from the reconnecting state during reconnect attempt. Done reconnecting.`);
          if (this._connectionState === HubConnectionState.Disconnecting) {
            this._completeClose();
          }
          return;
        }
        retryError = e instanceof Error ? e : new Error(e.toString());
        nextRetryDelay = this._getNextRetryDelay(previousReconnectAttempts++, Date.now() - reconnectStartTime, retryError);
      }
    }
    this._logger.log(LogLevel.Information, `Reconnect retries have been exhausted after ${Date.now() - reconnectStartTime} ms and ${previousReconnectAttempts} failed attempts. Connection disconnecting.`);
    this._completeClose();
  }
  _getNextRetryDelay(previousRetryCount, elapsedMilliseconds, retryReason) {
    try {
      return this._reconnectPolicy.nextRetryDelayInMilliseconds({
        elapsedMilliseconds,
        previousRetryCount,
        retryReason
      });
    } catch (e) {
      this._logger.log(LogLevel.Error, `IRetryPolicy.nextRetryDelayInMilliseconds(${previousRetryCount}, ${elapsedMilliseconds}) threw error '${e}'.`);
      return null;
    }
  }
  _cancelCallbacksWithError(error) {
    const callbacks = this._callbacks;
    this._callbacks = {};
    Object.keys(callbacks).forEach((key) => {
      const callback = callbacks[key];
      try {
        callback(null, error);
      } catch (e) {
        this._logger.log(LogLevel.Error, `Stream 'error' callback called with '${error}' threw error: ${getErrorString(e)}`);
      }
    });
  }
  _cleanupPingTimer() {
    if (this._pingServerHandle) {
      clearTimeout(this._pingServerHandle);
      this._pingServerHandle = void 0;
    }
  }
  _cleanupTimeout() {
    if (this._timeoutHandle) {
      clearTimeout(this._timeoutHandle);
    }
  }
  _createInvocation(methodName, args, nonblocking, streamIds) {
    if (nonblocking) {
      if (streamIds.length !== 0) {
        return {
          arguments: args,
          streamIds,
          target: methodName,
          type: MessageType.Invocation
        };
      } else {
        return {
          arguments: args,
          target: methodName,
          type: MessageType.Invocation
        };
      }
    } else {
      const invocationId = this._invocationId;
      this._invocationId++;
      if (streamIds.length !== 0) {
        return {
          arguments: args,
          invocationId: invocationId.toString(),
          streamIds,
          target: methodName,
          type: MessageType.Invocation
        };
      } else {
        return {
          arguments: args,
          invocationId: invocationId.toString(),
          target: methodName,
          type: MessageType.Invocation
        };
      }
    }
  }
  _launchStreams(streams, promiseQueue) {
    if (streams.length === 0) {
      return;
    }
    if (!promiseQueue) {
      promiseQueue = Promise.resolve();
    }
    for (const streamId in streams) {
      streams[streamId].subscribe({
        complete: () => {
          promiseQueue = promiseQueue.then(() => this._sendWithProtocol(this._createCompletionMessage(streamId)));
        },
        error: (err) => {
          let message;
          if (err instanceof Error) {
            message = err.message;
          } else if (err && err.toString) {
            message = err.toString();
          } else {
            message = "Unknown error";
          }
          promiseQueue = promiseQueue.then(() => this._sendWithProtocol(this._createCompletionMessage(streamId, message)));
        },
        next: (item) => {
          promiseQueue = promiseQueue.then(() => this._sendWithProtocol(this._createStreamItemMessage(streamId, item)));
        }
      });
    }
  }
  _replaceStreamingParams(args) {
    const streams = [];
    const streamIds = [];
    for (let i = 0; i < args.length; i++) {
      const argument = args[i];
      if (this._isObservable(argument)) {
        const streamId = this._invocationId;
        this._invocationId++;
        streams[streamId] = argument;
        streamIds.push(streamId.toString());
        args.splice(i, 1);
      }
    }
    return [streams, streamIds];
  }
  _isObservable(arg) {
    return arg && arg.subscribe && typeof arg.subscribe === "function";
  }
  _createStreamInvocation(methodName, args, streamIds) {
    const invocationId = this._invocationId;
    this._invocationId++;
    if (streamIds.length !== 0) {
      return {
        arguments: args,
        invocationId: invocationId.toString(),
        streamIds,
        target: methodName,
        type: MessageType.StreamInvocation
      };
    } else {
      return {
        arguments: args,
        invocationId: invocationId.toString(),
        target: methodName,
        type: MessageType.StreamInvocation
      };
    }
  }
  _createCancelInvocation(id) {
    return {
      invocationId: id,
      type: MessageType.CancelInvocation
    };
  }
  _createStreamItemMessage(id, item) {
    return {
      invocationId: id,
      item,
      type: MessageType.StreamItem
    };
  }
  _createCompletionMessage(id, error, result) {
    if (error) {
      return {
        error,
        invocationId: id,
        type: MessageType.Completion
      };
    }
    return {
      invocationId: id,
      result,
      type: MessageType.Completion
    };
  }
  _createCloseMessage() {
    return { type: MessageType.Close };
  }
}
const DEFAULT_RETRY_DELAYS_IN_MILLISECONDS = [0, 2e3, 1e4, 3e4, null];
class DefaultReconnectPolicy {
  constructor(retryDelays) {
    this._retryDelays = retryDelays !== void 0 ? [...retryDelays, null] : DEFAULT_RETRY_DELAYS_IN_MILLISECONDS;
  }
  nextRetryDelayInMilliseconds(retryContext) {
    return this._retryDelays[retryContext.previousRetryCount];
  }
}
class HeaderNames {
}
HeaderNames.Authorization = "Authorization";
HeaderNames.Cookie = "Cookie";
class AccessTokenHttpClient extends HttpClient {
  constructor(innerClient, accessTokenFactory) {
    super();
    this._innerClient = innerClient;
    this._accessTokenFactory = accessTokenFactory;
  }
  async send(request) {
    let allowRetry = true;
    if (this._accessTokenFactory && (!this._accessToken || request.url && request.url.indexOf("/negotiate?") > 0)) {
      allowRetry = false;
      this._accessToken = await this._accessTokenFactory();
    }
    this._setAuthorizationHeader(request);
    const response = await this._innerClient.send(request);
    if (allowRetry && response.statusCode === 401 && this._accessTokenFactory) {
      this._accessToken = await this._accessTokenFactory();
      this._setAuthorizationHeader(request);
      return await this._innerClient.send(request);
    }
    return response;
  }
  _setAuthorizationHeader(request) {
    if (!request.headers) {
      request.headers = {};
    }
    if (this._accessToken) {
      request.headers[HeaderNames.Authorization] = `Bearer ${this._accessToken}`;
    } else if (this._accessTokenFactory) {
      if (request.headers[HeaderNames.Authorization]) {
        delete request.headers[HeaderNames.Authorization];
      }
    }
  }
  getCookieString(url) {
    return this._innerClient.getCookieString(url);
  }
}
var HttpTransportType;
(function(HttpTransportType2) {
  HttpTransportType2[HttpTransportType2["None"] = 0] = "None";
  HttpTransportType2[HttpTransportType2["WebSockets"] = 1] = "WebSockets";
  HttpTransportType2[HttpTransportType2["ServerSentEvents"] = 2] = "ServerSentEvents";
  HttpTransportType2[HttpTransportType2["LongPolling"] = 4] = "LongPolling";
})(HttpTransportType || (HttpTransportType = {}));
var TransferFormat;
(function(TransferFormat2) {
  TransferFormat2[TransferFormat2["Text"] = 1] = "Text";
  TransferFormat2[TransferFormat2["Binary"] = 2] = "Binary";
})(TransferFormat || (TransferFormat = {}));
let AbortController$1 = class AbortController2 {
  constructor() {
    this._isAborted = false;
    this.onabort = null;
  }
  abort() {
    if (!this._isAborted) {
      this._isAborted = true;
      if (this.onabort) {
        this.onabort();
      }
    }
  }
  get signal() {
    return this;
  }
  get aborted() {
    return this._isAborted;
  }
};
class LongPollingTransport {
  // This is an internal type, not exported from 'index' so this is really just internal.
  get pollAborted() {
    return this._pollAbort.aborted;
  }
  constructor(httpClient, logger, options) {
    this._httpClient = httpClient;
    this._logger = logger;
    this._pollAbort = new AbortController$1();
    this._options = options;
    this._running = false;
    this.onreceive = null;
    this.onclose = null;
  }
  async connect(url, transferFormat) {
    Arg.isRequired(url, "url");
    Arg.isRequired(transferFormat, "transferFormat");
    Arg.isIn(transferFormat, TransferFormat, "transferFormat");
    this._url = url;
    this._logger.log(LogLevel.Trace, "(LongPolling transport) Connecting.");
    if (transferFormat === TransferFormat.Binary && (typeof XMLHttpRequest !== "undefined" && typeof new XMLHttpRequest().responseType !== "string")) {
      throw new Error("Binary protocols over XmlHttpRequest not implementing advanced features are not supported.");
    }
    const [name, value] = getUserAgentHeader();
    const headers = { [name]: value, ...this._options.headers };
    const pollOptions = {
      abortSignal: this._pollAbort.signal,
      headers,
      timeout: 1e5,
      withCredentials: this._options.withCredentials
    };
    if (transferFormat === TransferFormat.Binary) {
      pollOptions.responseType = "arraybuffer";
    }
    const pollUrl = `${url}&_=${Date.now()}`;
    this._logger.log(LogLevel.Trace, `(LongPolling transport) polling: ${pollUrl}.`);
    const response = await this._httpClient.get(pollUrl, pollOptions);
    if (response.statusCode !== 200) {
      this._logger.log(LogLevel.Error, `(LongPolling transport) Unexpected response code: ${response.statusCode}.`);
      this._closeError = new HttpError(response.statusText || "", response.statusCode);
      this._running = false;
    } else {
      this._running = true;
    }
    this._receiving = this._poll(this._url, pollOptions);
  }
  async _poll(url, pollOptions) {
    try {
      while (this._running) {
        try {
          const pollUrl = `${url}&_=${Date.now()}`;
          this._logger.log(LogLevel.Trace, `(LongPolling transport) polling: ${pollUrl}.`);
          const response = await this._httpClient.get(pollUrl, pollOptions);
          if (response.statusCode === 204) {
            this._logger.log(LogLevel.Information, "(LongPolling transport) Poll terminated by server.");
            this._running = false;
          } else if (response.statusCode !== 200) {
            this._logger.log(LogLevel.Error, `(LongPolling transport) Unexpected response code: ${response.statusCode}.`);
            this._closeError = new HttpError(response.statusText || "", response.statusCode);
            this._running = false;
          } else {
            if (response.content) {
              this._logger.log(LogLevel.Trace, `(LongPolling transport) data received. ${getDataDetail(response.content, this._options.logMessageContent)}.`);
              if (this.onreceive) {
                this.onreceive(response.content);
              }
            } else {
              this._logger.log(LogLevel.Trace, "(LongPolling transport) Poll timed out, reissuing.");
            }
          }
        } catch (e) {
          if (!this._running) {
            this._logger.log(LogLevel.Trace, `(LongPolling transport) Poll errored after shutdown: ${e.message}`);
          } else {
            if (e instanceof TimeoutError) {
              this._logger.log(LogLevel.Trace, "(LongPolling transport) Poll timed out, reissuing.");
            } else {
              this._closeError = e;
              this._running = false;
            }
          }
        }
      }
    } finally {
      this._logger.log(LogLevel.Trace, "(LongPolling transport) Polling complete.");
      if (!this.pollAborted) {
        this._raiseOnClose();
      }
    }
  }
  async send(data) {
    if (!this._running) {
      return Promise.reject(new Error("Cannot send until the transport is connected"));
    }
    return sendMessage(this._logger, "LongPolling", this._httpClient, this._url, data, this._options);
  }
  async stop() {
    this._logger.log(LogLevel.Trace, "(LongPolling transport) Stopping polling.");
    this._running = false;
    this._pollAbort.abort();
    try {
      await this._receiving;
      this._logger.log(LogLevel.Trace, `(LongPolling transport) sending DELETE request to ${this._url}.`);
      const headers = {};
      const [name, value] = getUserAgentHeader();
      headers[name] = value;
      const deleteOptions = {
        headers: { ...headers, ...this._options.headers },
        timeout: this._options.timeout,
        withCredentials: this._options.withCredentials
      };
      let error;
      try {
        await this._httpClient.delete(this._url, deleteOptions);
      } catch (err) {
        error = err;
      }
      if (error) {
        if (error instanceof HttpError) {
          if (error.statusCode === 404) {
            this._logger.log(LogLevel.Trace, "(LongPolling transport) A 404 response was returned from sending a DELETE request.");
          } else {
            this._logger.log(LogLevel.Trace, `(LongPolling transport) Error sending a DELETE request: ${error}`);
          }
        }
      } else {
        this._logger.log(LogLevel.Trace, "(LongPolling transport) DELETE request accepted.");
      }
    } finally {
      this._logger.log(LogLevel.Trace, "(LongPolling transport) Stop finished.");
      this._raiseOnClose();
    }
  }
  _raiseOnClose() {
    if (this.onclose) {
      let logMessage = "(LongPolling transport) Firing onclose event.";
      if (this._closeError) {
        logMessage += " Error: " + this._closeError;
      }
      this._logger.log(LogLevel.Trace, logMessage);
      this.onclose(this._closeError);
    }
  }
}
class ServerSentEventsTransport {
  constructor(httpClient, accessToken, logger, options) {
    this._httpClient = httpClient;
    this._accessToken = accessToken;
    this._logger = logger;
    this._options = options;
    this.onreceive = null;
    this.onclose = null;
  }
  async connect(url, transferFormat) {
    Arg.isRequired(url, "url");
    Arg.isRequired(transferFormat, "transferFormat");
    Arg.isIn(transferFormat, TransferFormat, "transferFormat");
    this._logger.log(LogLevel.Trace, "(SSE transport) Connecting.");
    this._url = url;
    if (this._accessToken) {
      url += (url.indexOf("?") < 0 ? "?" : "&") + `access_token=${encodeURIComponent(this._accessToken)}`;
    }
    return new Promise((resolve, reject) => {
      let opened = false;
      if (transferFormat !== TransferFormat.Text) {
        reject(new Error("The Server-Sent Events transport only supports the 'Text' transfer format"));
        return;
      }
      let eventSource;
      if (Platform.isBrowser || Platform.isWebWorker) {
        eventSource = new this._options.EventSource(url, { withCredentials: this._options.withCredentials });
      } else {
        const cookies = this._httpClient.getCookieString(url);
        const headers = {};
        headers.Cookie = cookies;
        const [name, value] = getUserAgentHeader();
        headers[name] = value;
        eventSource = new this._options.EventSource(url, { withCredentials: this._options.withCredentials, headers: { ...headers, ...this._options.headers } });
      }
      try {
        eventSource.onmessage = (e) => {
          if (this.onreceive) {
            try {
              this._logger.log(LogLevel.Trace, `(SSE transport) data received. ${getDataDetail(e.data, this._options.logMessageContent)}.`);
              this.onreceive(e.data);
            } catch (error) {
              this._close(error);
              return;
            }
          }
        };
        eventSource.onerror = (e) => {
          if (opened) {
            this._close();
          } else {
            reject(new Error("EventSource failed to connect. The connection could not be found on the server, either the connection ID is not present on the server, or a proxy is refusing/buffering the connection. If you have multiple servers check that sticky sessions are enabled."));
          }
        };
        eventSource.onopen = () => {
          this._logger.log(LogLevel.Information, `SSE connected to ${this._url}`);
          this._eventSource = eventSource;
          opened = true;
          resolve();
        };
      } catch (e) {
        reject(e);
        return;
      }
    });
  }
  async send(data) {
    if (!this._eventSource) {
      return Promise.reject(new Error("Cannot send until the transport is connected"));
    }
    return sendMessage(this._logger, "SSE", this._httpClient, this._url, data, this._options);
  }
  stop() {
    this._close();
    return Promise.resolve();
  }
  _close(e) {
    if (this._eventSource) {
      this._eventSource.close();
      this._eventSource = void 0;
      if (this.onclose) {
        this.onclose(e);
      }
    }
  }
}
class WebSocketTransport {
  constructor(httpClient, accessTokenFactory, logger, logMessageContent, webSocketConstructor, headers) {
    this._logger = logger;
    this._accessTokenFactory = accessTokenFactory;
    this._logMessageContent = logMessageContent;
    this._webSocketConstructor = webSocketConstructor;
    this._httpClient = httpClient;
    this.onreceive = null;
    this.onclose = null;
    this._headers = headers;
  }
  async connect(url, transferFormat) {
    Arg.isRequired(url, "url");
    Arg.isRequired(transferFormat, "transferFormat");
    Arg.isIn(transferFormat, TransferFormat, "transferFormat");
    this._logger.log(LogLevel.Trace, "(WebSockets transport) Connecting.");
    let token;
    if (this._accessTokenFactory) {
      token = await this._accessTokenFactory();
    }
    return new Promise((resolve, reject) => {
      url = url.replace(/^http/, "ws");
      let webSocket;
      const cookies = this._httpClient.getCookieString(url);
      let opened = false;
      if (Platform.isNode || Platform.isReactNative) {
        const headers = {};
        const [name, value] = getUserAgentHeader();
        headers[name] = value;
        if (token) {
          headers[HeaderNames.Authorization] = `Bearer ${token}`;
        }
        if (cookies) {
          headers[HeaderNames.Cookie] = cookies;
        }
        webSocket = new this._webSocketConstructor(url, void 0, {
          headers: { ...headers, ...this._headers }
        });
      } else {
        if (token) {
          url += (url.indexOf("?") < 0 ? "?" : "&") + `access_token=${encodeURIComponent(token)}`;
        }
      }
      if (!webSocket) {
        webSocket = new this._webSocketConstructor(url);
      }
      if (transferFormat === TransferFormat.Binary) {
        webSocket.binaryType = "arraybuffer";
      }
      webSocket.onopen = (_event) => {
        this._logger.log(LogLevel.Information, `WebSocket connected to ${url}.`);
        this._webSocket = webSocket;
        opened = true;
        resolve();
      };
      webSocket.onerror = (event) => {
        let error = null;
        if (typeof ErrorEvent !== "undefined" && event instanceof ErrorEvent) {
          error = event.error;
        } else {
          error = "There was an error with the transport";
        }
        this._logger.log(LogLevel.Information, `(WebSockets transport) ${error}.`);
      };
      webSocket.onmessage = (message) => {
        this._logger.log(LogLevel.Trace, `(WebSockets transport) data received. ${getDataDetail(message.data, this._logMessageContent)}.`);
        if (this.onreceive) {
          try {
            this.onreceive(message.data);
          } catch (error) {
            this._close(error);
            return;
          }
        }
      };
      webSocket.onclose = (event) => {
        if (opened) {
          this._close(event);
        } else {
          let error = null;
          if (typeof ErrorEvent !== "undefined" && event instanceof ErrorEvent) {
            error = event.error;
          } else {
            error = "WebSocket failed to connect. The connection could not be found on the server, either the endpoint may not be a SignalR endpoint, the connection ID is not present on the server, or there is a proxy blocking WebSockets. If you have multiple servers check that sticky sessions are enabled.";
          }
          reject(new Error(error));
        }
      };
    });
  }
  send(data) {
    if (this._webSocket && this._webSocket.readyState === this._webSocketConstructor.OPEN) {
      this._logger.log(LogLevel.Trace, `(WebSockets transport) sending data. ${getDataDetail(data, this._logMessageContent)}.`);
      this._webSocket.send(data);
      return Promise.resolve();
    }
    return Promise.reject("WebSocket is not in the OPEN state");
  }
  stop() {
    if (this._webSocket) {
      this._close(void 0);
    }
    return Promise.resolve();
  }
  _close(event) {
    if (this._webSocket) {
      this._webSocket.onclose = () => {
      };
      this._webSocket.onmessage = () => {
      };
      this._webSocket.onerror = () => {
      };
      this._webSocket.close();
      this._webSocket = void 0;
    }
    this._logger.log(LogLevel.Trace, "(WebSockets transport) socket closed.");
    if (this.onclose) {
      if (this._isCloseEvent(event) && (event.wasClean === false || event.code !== 1e3)) {
        this.onclose(new Error(`WebSocket closed with status code: ${event.code} (${event.reason || "no reason given"}).`));
      } else if (event instanceof Error) {
        this.onclose(event);
      } else {
        this.onclose();
      }
    }
  }
  _isCloseEvent(event) {
    return event && typeof event.wasClean === "boolean" && typeof event.code === "number";
  }
}
const MAX_REDIRECTS = 100;
class HttpConnection {
  constructor(url, options = {}) {
    this._stopPromiseResolver = () => {
    };
    this.features = {};
    this._negotiateVersion = 1;
    Arg.isRequired(url, "url");
    this._logger = createLogger(options.logger);
    this.baseUrl = this._resolveUrl(url);
    options = options || {};
    options.logMessageContent = options.logMessageContent === void 0 ? false : options.logMessageContent;
    if (typeof options.withCredentials === "boolean" || options.withCredentials === void 0) {
      options.withCredentials = options.withCredentials === void 0 ? true : options.withCredentials;
    } else {
      throw new Error("withCredentials option was not a 'boolean' or 'undefined' value");
    }
    options.timeout = options.timeout === void 0 ? 100 * 1e3 : options.timeout;
    let webSocketModule = null;
    let eventSourceModule = null;
    if (Platform.isNode && typeof require !== "undefined") {
      const requireFunc = typeof __webpack_require__ === "function" ? __non_webpack_require__ : require;
      webSocketModule = requireFunc("ws");
      eventSourceModule = requireFunc("eventsource");
    }
    if (!Platform.isNode && typeof WebSocket !== "undefined" && !options.WebSocket) {
      options.WebSocket = WebSocket;
    } else if (Platform.isNode && !options.WebSocket) {
      if (webSocketModule) {
        options.WebSocket = webSocketModule;
      }
    }
    if (!Platform.isNode && typeof EventSource !== "undefined" && !options.EventSource) {
      options.EventSource = EventSource;
    } else if (Platform.isNode && !options.EventSource) {
      if (typeof eventSourceModule !== "undefined") {
        options.EventSource = eventSourceModule;
      }
    }
    this._httpClient = new AccessTokenHttpClient(options.httpClient || new DefaultHttpClient(this._logger), options.accessTokenFactory);
    this._connectionState = "Disconnected";
    this._connectionStarted = false;
    this._options = options;
    this.onreceive = null;
    this.onclose = null;
  }
  async start(transferFormat) {
    transferFormat = transferFormat || TransferFormat.Binary;
    Arg.isIn(transferFormat, TransferFormat, "transferFormat");
    this._logger.log(LogLevel.Debug, `Starting connection with transfer format '${TransferFormat[transferFormat]}'.`);
    if (this._connectionState !== "Disconnected") {
      return Promise.reject(new Error("Cannot start an HttpConnection that is not in the 'Disconnected' state."));
    }
    this._connectionState = "Connecting";
    this._startInternalPromise = this._startInternal(transferFormat);
    await this._startInternalPromise;
    if (this._connectionState === "Disconnecting") {
      const message = "Failed to start the HttpConnection before stop() was called.";
      this._logger.log(LogLevel.Error, message);
      await this._stopPromise;
      return Promise.reject(new AbortError(message));
    } else if (this._connectionState !== "Connected") {
      const message = "HttpConnection.startInternal completed gracefully but didn't enter the connection into the connected state!";
      this._logger.log(LogLevel.Error, message);
      return Promise.reject(new AbortError(message));
    }
    this._connectionStarted = true;
  }
  send(data) {
    if (this._connectionState !== "Connected") {
      return Promise.reject(new Error("Cannot send data if the connection is not in the 'Connected' State."));
    }
    if (!this._sendQueue) {
      this._sendQueue = new TransportSendQueue(this.transport);
    }
    return this._sendQueue.send(data);
  }
  async stop(error) {
    if (this._connectionState === "Disconnected") {
      this._logger.log(LogLevel.Debug, `Call to HttpConnection.stop(${error}) ignored because the connection is already in the disconnected state.`);
      return Promise.resolve();
    }
    if (this._connectionState === "Disconnecting") {
      this._logger.log(LogLevel.Debug, `Call to HttpConnection.stop(${error}) ignored because the connection is already in the disconnecting state.`);
      return this._stopPromise;
    }
    this._connectionState = "Disconnecting";
    this._stopPromise = new Promise((resolve) => {
      this._stopPromiseResolver = resolve;
    });
    await this._stopInternal(error);
    await this._stopPromise;
  }
  async _stopInternal(error) {
    this._stopError = error;
    try {
      await this._startInternalPromise;
    } catch (e) {
    }
    if (this.transport) {
      try {
        await this.transport.stop();
      } catch (e) {
        this._logger.log(LogLevel.Error, `HttpConnection.transport.stop() threw error '${e}'.`);
        this._stopConnection();
      }
      this.transport = void 0;
    } else {
      this._logger.log(LogLevel.Debug, "HttpConnection.transport is undefined in HttpConnection.stop() because start() failed.");
    }
  }
  async _startInternal(transferFormat) {
    let url = this.baseUrl;
    this._accessTokenFactory = this._options.accessTokenFactory;
    this._httpClient._accessTokenFactory = this._accessTokenFactory;
    try {
      if (this._options.skipNegotiation) {
        if (this._options.transport === HttpTransportType.WebSockets) {
          this.transport = this._constructTransport(HttpTransportType.WebSockets);
          await this._startTransport(url, transferFormat);
        } else {
          throw new Error("Negotiation can only be skipped when using the WebSocket transport directly.");
        }
      } else {
        let negotiateResponse = null;
        let redirects = 0;
        do {
          negotiateResponse = await this._getNegotiationResponse(url);
          if (this._connectionState === "Disconnecting" || this._connectionState === "Disconnected") {
            throw new AbortError("The connection was stopped during negotiation.");
          }
          if (negotiateResponse.error) {
            throw new Error(negotiateResponse.error);
          }
          if (negotiateResponse.ProtocolVersion) {
            throw new Error("Detected a connection attempt to an ASP.NET SignalR Server. This client only supports connecting to an ASP.NET Core SignalR Server. See https://aka.ms/signalr-core-differences for details.");
          }
          if (negotiateResponse.url) {
            url = negotiateResponse.url;
          }
          if (negotiateResponse.accessToken) {
            const accessToken = negotiateResponse.accessToken;
            this._accessTokenFactory = () => accessToken;
            this._httpClient._accessToken = accessToken;
            this._httpClient._accessTokenFactory = void 0;
          }
          redirects++;
        } while (negotiateResponse.url && redirects < MAX_REDIRECTS);
        if (redirects === MAX_REDIRECTS && negotiateResponse.url) {
          throw new Error("Negotiate redirection limit exceeded.");
        }
        await this._createTransport(url, this._options.transport, negotiateResponse, transferFormat);
      }
      if (this.transport instanceof LongPollingTransport) {
        this.features.inherentKeepAlive = true;
      }
      if (this._connectionState === "Connecting") {
        this._logger.log(LogLevel.Debug, "The HttpConnection connected successfully.");
        this._connectionState = "Connected";
      }
    } catch (e) {
      this._logger.log(LogLevel.Error, "Failed to start the connection: " + e);
      this._connectionState = "Disconnected";
      this.transport = void 0;
      this._stopPromiseResolver();
      return Promise.reject(e);
    }
  }
  async _getNegotiationResponse(url) {
    const headers = {};
    const [name, value] = getUserAgentHeader();
    headers[name] = value;
    const negotiateUrl = this._resolveNegotiateUrl(url);
    this._logger.log(LogLevel.Debug, `Sending negotiation request: ${negotiateUrl}.`);
    try {
      const response = await this._httpClient.post(negotiateUrl, {
        content: "",
        headers: { ...headers, ...this._options.headers },
        timeout: this._options.timeout,
        withCredentials: this._options.withCredentials
      });
      if (response.statusCode !== 200) {
        return Promise.reject(new Error(`Unexpected status code returned from negotiate '${response.statusCode}'`));
      }
      const negotiateResponse = JSON.parse(response.content);
      if (!negotiateResponse.negotiateVersion || negotiateResponse.negotiateVersion < 1) {
        negotiateResponse.connectionToken = negotiateResponse.connectionId;
      }
      if (negotiateResponse.useStatefulReconnect && this._options._useStatefulReconnect !== true) {
        return Promise.reject(new FailedToNegotiateWithServerError("Client didn't negotiate Stateful Reconnect but the server did."));
      }
      return negotiateResponse;
    } catch (e) {
      let errorMessage = "Failed to complete negotiation with the server: " + e;
      if (e instanceof HttpError) {
        if (e.statusCode === 404) {
          errorMessage = errorMessage + " Either this is not a SignalR endpoint or there is a proxy blocking the connection.";
        }
      }
      this._logger.log(LogLevel.Error, errorMessage);
      return Promise.reject(new FailedToNegotiateWithServerError(errorMessage));
    }
  }
  _createConnectUrl(url, connectionToken) {
    if (!connectionToken) {
      return url;
    }
    return url + (url.indexOf("?") === -1 ? "?" : "&") + `id=${connectionToken}`;
  }
  async _createTransport(url, requestedTransport, negotiateResponse, requestedTransferFormat) {
    let connectUrl = this._createConnectUrl(url, negotiateResponse.connectionToken);
    if (this._isITransport(requestedTransport)) {
      this._logger.log(LogLevel.Debug, "Connection was provided an instance of ITransport, using that directly.");
      this.transport = requestedTransport;
      await this._startTransport(connectUrl, requestedTransferFormat);
      this.connectionId = negotiateResponse.connectionId;
      return;
    }
    const transportExceptions = [];
    const transports = negotiateResponse.availableTransports || [];
    let negotiate = negotiateResponse;
    for (const endpoint of transports) {
      const transportOrError = this._resolveTransportOrError(endpoint, requestedTransport, requestedTransferFormat, (negotiate === null || negotiate === void 0 ? void 0 : negotiate.useStatefulReconnect) === true);
      if (transportOrError instanceof Error) {
        transportExceptions.push(`${endpoint.transport} failed:`);
        transportExceptions.push(transportOrError);
      } else if (this._isITransport(transportOrError)) {
        this.transport = transportOrError;
        if (!negotiate) {
          try {
            negotiate = await this._getNegotiationResponse(url);
          } catch (ex) {
            return Promise.reject(ex);
          }
          connectUrl = this._createConnectUrl(url, negotiate.connectionToken);
        }
        try {
          await this._startTransport(connectUrl, requestedTransferFormat);
          this.connectionId = negotiate.connectionId;
          return;
        } catch (ex) {
          this._logger.log(LogLevel.Error, `Failed to start the transport '${endpoint.transport}': ${ex}`);
          negotiate = void 0;
          transportExceptions.push(new FailedToStartTransportError(`${endpoint.transport} failed: ${ex}`, HttpTransportType[endpoint.transport]));
          if (this._connectionState !== "Connecting") {
            const message = "Failed to select transport before stop() was called.";
            this._logger.log(LogLevel.Debug, message);
            return Promise.reject(new AbortError(message));
          }
        }
      }
    }
    if (transportExceptions.length > 0) {
      return Promise.reject(new AggregateErrors(`Unable to connect to the server with any of the available transports. ${transportExceptions.join(" ")}`, transportExceptions));
    }
    return Promise.reject(new Error("None of the transports supported by the client are supported by the server."));
  }
  _constructTransport(transport) {
    switch (transport) {
      case HttpTransportType.WebSockets:
        if (!this._options.WebSocket) {
          throw new Error("'WebSocket' is not supported in your environment.");
        }
        return new WebSocketTransport(this._httpClient, this._accessTokenFactory, this._logger, this._options.logMessageContent, this._options.WebSocket, this._options.headers || {});
      case HttpTransportType.ServerSentEvents:
        if (!this._options.EventSource) {
          throw new Error("'EventSource' is not supported in your environment.");
        }
        return new ServerSentEventsTransport(this._httpClient, this._httpClient._accessToken, this._logger, this._options);
      case HttpTransportType.LongPolling:
        return new LongPollingTransport(this._httpClient, this._logger, this._options);
      default:
        throw new Error(`Unknown transport: ${transport}.`);
    }
  }
  _startTransport(url, transferFormat) {
    this.transport.onreceive = this.onreceive;
    if (this.features.reconnect) {
      this.transport.onclose = async (e) => {
        let callStop = false;
        if (this.features.reconnect) {
          try {
            this.features.disconnected();
            await this.transport.connect(url, transferFormat);
            await this.features.resend();
          } catch {
            callStop = true;
          }
        } else {
          this._stopConnection(e);
          return;
        }
        if (callStop) {
          this._stopConnection(e);
        }
      };
    } else {
      this.transport.onclose = (e) => this._stopConnection(e);
    }
    return this.transport.connect(url, transferFormat);
  }
  _resolveTransportOrError(endpoint, requestedTransport, requestedTransferFormat, useStatefulReconnect) {
    const transport = HttpTransportType[endpoint.transport];
    if (transport === null || transport === void 0) {
      this._logger.log(LogLevel.Debug, `Skipping transport '${endpoint.transport}' because it is not supported by this client.`);
      return new Error(`Skipping transport '${endpoint.transport}' because it is not supported by this client.`);
    } else {
      if (transportMatches(requestedTransport, transport)) {
        const transferFormats = endpoint.transferFormats.map((s) => TransferFormat[s]);
        if (transferFormats.indexOf(requestedTransferFormat) >= 0) {
          if (transport === HttpTransportType.WebSockets && !this._options.WebSocket || transport === HttpTransportType.ServerSentEvents && !this._options.EventSource) {
            this._logger.log(LogLevel.Debug, `Skipping transport '${HttpTransportType[transport]}' because it is not supported in your environment.'`);
            return new UnsupportedTransportError(`'${HttpTransportType[transport]}' is not supported in your environment.`, transport);
          } else {
            this._logger.log(LogLevel.Debug, `Selecting transport '${HttpTransportType[transport]}'.`);
            try {
              this.features.reconnect = transport === HttpTransportType.WebSockets ? useStatefulReconnect : void 0;
              return this._constructTransport(transport);
            } catch (ex) {
              return ex;
            }
          }
        } else {
          this._logger.log(LogLevel.Debug, `Skipping transport '${HttpTransportType[transport]}' because it does not support the requested transfer format '${TransferFormat[requestedTransferFormat]}'.`);
          return new Error(`'${HttpTransportType[transport]}' does not support ${TransferFormat[requestedTransferFormat]}.`);
        }
      } else {
        this._logger.log(LogLevel.Debug, `Skipping transport '${HttpTransportType[transport]}' because it was disabled by the client.`);
        return new DisabledTransportError(`'${HttpTransportType[transport]}' is disabled by the client.`, transport);
      }
    }
  }
  _isITransport(transport) {
    return transport && typeof transport === "object" && "connect" in transport;
  }
  _stopConnection(error) {
    this._logger.log(LogLevel.Debug, `HttpConnection.stopConnection(${error}) called while in state ${this._connectionState}.`);
    this.transport = void 0;
    error = this._stopError || error;
    this._stopError = void 0;
    if (this._connectionState === "Disconnected") {
      this._logger.log(LogLevel.Debug, `Call to HttpConnection.stopConnection(${error}) was ignored because the connection is already in the disconnected state.`);
      return;
    }
    if (this._connectionState === "Connecting") {
      this._logger.log(LogLevel.Warning, `Call to HttpConnection.stopConnection(${error}) was ignored because the connection is still in the connecting state.`);
      throw new Error(`HttpConnection.stopConnection(${error}) was called while the connection is still in the connecting state.`);
    }
    if (this._connectionState === "Disconnecting") {
      this._stopPromiseResolver();
    }
    if (error) {
      this._logger.log(LogLevel.Error, `Connection disconnected with error '${error}'.`);
    } else {
      this._logger.log(LogLevel.Information, "Connection disconnected.");
    }
    if (this._sendQueue) {
      this._sendQueue.stop().catch((e) => {
        this._logger.log(LogLevel.Error, `TransportSendQueue.stop() threw error '${e}'.`);
      });
      this._sendQueue = void 0;
    }
    this.connectionId = void 0;
    this._connectionState = "Disconnected";
    if (this._connectionStarted) {
      this._connectionStarted = false;
      try {
        if (this.onclose) {
          this.onclose(error);
        }
      } catch (e) {
        this._logger.log(LogLevel.Error, `HttpConnection.onclose(${error}) threw error '${e}'.`);
      }
    }
  }
  _resolveUrl(url) {
    if (url.lastIndexOf("https://", 0) === 0 || url.lastIndexOf("http://", 0) === 0) {
      return url;
    }
    if (!Platform.isBrowser) {
      throw new Error(`Cannot resolve '${url}'.`);
    }
    const aTag = window.document.createElement("a");
    aTag.href = url;
    this._logger.log(LogLevel.Information, `Normalizing '${url}' to '${aTag.href}'.`);
    return aTag.href;
  }
  _resolveNegotiateUrl(url) {
    const negotiateUrl = new URL(url);
    if (negotiateUrl.pathname.endsWith("/")) {
      negotiateUrl.pathname += "negotiate";
    } else {
      negotiateUrl.pathname += "/negotiate";
    }
    const searchParams = new URLSearchParams(negotiateUrl.searchParams);
    if (!searchParams.has("negotiateVersion")) {
      searchParams.append("negotiateVersion", this._negotiateVersion.toString());
    }
    if (searchParams.has("useStatefulReconnect")) {
      if (searchParams.get("useStatefulReconnect") === "true") {
        this._options._useStatefulReconnect = true;
      }
    } else if (this._options._useStatefulReconnect === true) {
      searchParams.append("useStatefulReconnect", "true");
    }
    negotiateUrl.search = searchParams.toString();
    return negotiateUrl.toString();
  }
}
function transportMatches(requestedTransport, actualTransport) {
  return !requestedTransport || (actualTransport & requestedTransport) !== 0;
}
class TransportSendQueue {
  constructor(_transport) {
    this._transport = _transport;
    this._buffer = [];
    this._executing = true;
    this._sendBufferedData = new PromiseSource();
    this._transportResult = new PromiseSource();
    this._sendLoopPromise = this._sendLoop();
  }
  send(data) {
    this._bufferData(data);
    if (!this._transportResult) {
      this._transportResult = new PromiseSource();
    }
    return this._transportResult.promise;
  }
  stop() {
    this._executing = false;
    this._sendBufferedData.resolve();
    return this._sendLoopPromise;
  }
  _bufferData(data) {
    if (this._buffer.length && typeof this._buffer[0] !== typeof data) {
      throw new Error(`Expected data to be of type ${typeof this._buffer} but was of type ${typeof data}`);
    }
    this._buffer.push(data);
    this._sendBufferedData.resolve();
  }
  async _sendLoop() {
    while (true) {
      await this._sendBufferedData.promise;
      if (!this._executing) {
        if (this._transportResult) {
          this._transportResult.reject("Connection stopped.");
        }
        break;
      }
      this._sendBufferedData = new PromiseSource();
      const transportResult = this._transportResult;
      this._transportResult = void 0;
      const data = typeof this._buffer[0] === "string" ? this._buffer.join("") : TransportSendQueue._concatBuffers(this._buffer);
      this._buffer.length = 0;
      try {
        await this._transport.send(data);
        transportResult.resolve();
      } catch (error) {
        transportResult.reject(error);
      }
    }
  }
  static _concatBuffers(arrayBuffers) {
    const totalLength = arrayBuffers.map((b) => b.byteLength).reduce((a, b) => a + b);
    const result = new Uint8Array(totalLength);
    let offset = 0;
    for (const item of arrayBuffers) {
      result.set(new Uint8Array(item), offset);
      offset += item.byteLength;
    }
    return result.buffer;
  }
}
class PromiseSource {
  constructor() {
    this.promise = new Promise((resolve, reject) => [this._resolver, this._rejecter] = [resolve, reject]);
  }
  resolve() {
    this._resolver();
  }
  reject(reason) {
    this._rejecter(reason);
  }
}
const JSON_HUB_PROTOCOL_NAME = "json";
class JsonHubProtocol {
  constructor() {
    this.name = JSON_HUB_PROTOCOL_NAME;
    this.version = 2;
    this.transferFormat = TransferFormat.Text;
  }
  /** Creates an array of {@link @microsoft/signalr.HubMessage} objects from the specified serialized representation.
   *
   * @param {string} input A string containing the serialized representation.
   * @param {ILogger} logger A logger that will be used to log messages that occur during parsing.
   */
  parseMessages(input, logger) {
    if (typeof input !== "string") {
      throw new Error("Invalid input for JSON hub protocol. Expected a string.");
    }
    if (!input) {
      return [];
    }
    if (logger === null) {
      logger = NullLogger.instance;
    }
    const messages = TextMessageFormat.parse(input);
    const hubMessages = [];
    for (const message of messages) {
      const parsedMessage = JSON.parse(message);
      if (typeof parsedMessage.type !== "number") {
        throw new Error("Invalid payload.");
      }
      switch (parsedMessage.type) {
        case MessageType.Invocation:
          this._isInvocationMessage(parsedMessage);
          break;
        case MessageType.StreamItem:
          this._isStreamItemMessage(parsedMessage);
          break;
        case MessageType.Completion:
          this._isCompletionMessage(parsedMessage);
          break;
        case MessageType.Ping:
          break;
        case MessageType.Close:
          break;
        case MessageType.Ack:
          this._isAckMessage(parsedMessage);
          break;
        case MessageType.Sequence:
          this._isSequenceMessage(parsedMessage);
          break;
        default:
          logger.log(LogLevel.Information, "Unknown message type '" + parsedMessage.type + "' ignored.");
          continue;
      }
      hubMessages.push(parsedMessage);
    }
    return hubMessages;
  }
  /** Writes the specified {@link @microsoft/signalr.HubMessage} to a string and returns it.
   *
   * @param {HubMessage} message The message to write.
   * @returns {string} A string containing the serialized representation of the message.
   */
  writeMessage(message) {
    return TextMessageFormat.write(JSON.stringify(message));
  }
  _isInvocationMessage(message) {
    this._assertNotEmptyString(message.target, "Invalid payload for Invocation message.");
    if (message.invocationId !== void 0) {
      this._assertNotEmptyString(message.invocationId, "Invalid payload for Invocation message.");
    }
  }
  _isStreamItemMessage(message) {
    this._assertNotEmptyString(message.invocationId, "Invalid payload for StreamItem message.");
    if (message.item === void 0) {
      throw new Error("Invalid payload for StreamItem message.");
    }
  }
  _isCompletionMessage(message) {
    if (message.result && message.error) {
      throw new Error("Invalid payload for Completion message.");
    }
    if (!message.result && message.error) {
      this._assertNotEmptyString(message.error, "Invalid payload for Completion message.");
    }
    this._assertNotEmptyString(message.invocationId, "Invalid payload for Completion message.");
  }
  _isAckMessage(message) {
    if (typeof message.sequenceId !== "number") {
      throw new Error("Invalid SequenceId for Ack message.");
    }
  }
  _isSequenceMessage(message) {
    if (typeof message.sequenceId !== "number") {
      throw new Error("Invalid SequenceId for Sequence message.");
    }
  }
  _assertNotEmptyString(value, errorMessage) {
    if (typeof value !== "string" || value === "") {
      throw new Error(errorMessage);
    }
  }
}
const LogLevelNameMapping = {
  trace: LogLevel.Trace,
  debug: LogLevel.Debug,
  info: LogLevel.Information,
  information: LogLevel.Information,
  warn: LogLevel.Warning,
  warning: LogLevel.Warning,
  error: LogLevel.Error,
  critical: LogLevel.Critical,
  none: LogLevel.None
};
function parseLogLevel(name) {
  const mapping = LogLevelNameMapping[name.toLowerCase()];
  if (typeof mapping !== "undefined") {
    return mapping;
  } else {
    throw new Error(`Unknown log level: ${name}`);
  }
}
class HubConnectionBuilder {
  configureLogging(logging) {
    Arg.isRequired(logging, "logging");
    if (isLogger(logging)) {
      this.logger = logging;
    } else if (typeof logging === "string") {
      const logLevel = parseLogLevel(logging);
      this.logger = new ConsoleLogger(logLevel);
    } else {
      this.logger = new ConsoleLogger(logging);
    }
    return this;
  }
  withUrl(url, transportTypeOrOptions) {
    Arg.isRequired(url, "url");
    Arg.isNotEmpty(url, "url");
    this.url = url;
    if (typeof transportTypeOrOptions === "object") {
      this.httpConnectionOptions = { ...this.httpConnectionOptions, ...transportTypeOrOptions };
    } else {
      this.httpConnectionOptions = {
        ...this.httpConnectionOptions,
        transport: transportTypeOrOptions
      };
    }
    return this;
  }
  /** Configures the {@link @microsoft/signalr.HubConnection} to use the specified Hub Protocol.
   *
   * @param {IHubProtocol} protocol The {@link @microsoft/signalr.IHubProtocol} implementation to use.
   */
  withHubProtocol(protocol) {
    Arg.isRequired(protocol, "protocol");
    this.protocol = protocol;
    return this;
  }
  withAutomaticReconnect(retryDelaysOrReconnectPolicy) {
    if (this.reconnectPolicy) {
      throw new Error("A reconnectPolicy has already been set.");
    }
    if (!retryDelaysOrReconnectPolicy) {
      this.reconnectPolicy = new DefaultReconnectPolicy();
    } else if (Array.isArray(retryDelaysOrReconnectPolicy)) {
      this.reconnectPolicy = new DefaultReconnectPolicy(retryDelaysOrReconnectPolicy);
    } else {
      this.reconnectPolicy = retryDelaysOrReconnectPolicy;
    }
    return this;
  }
  /** Configures {@link @microsoft/signalr.HubConnection.serverTimeoutInMilliseconds} for the {@link @microsoft/signalr.HubConnection}.
   *
   * @returns The {@link @microsoft/signalr.HubConnectionBuilder} instance, for chaining.
   */
  withServerTimeout(milliseconds) {
    Arg.isRequired(milliseconds, "milliseconds");
    this._serverTimeoutInMilliseconds = milliseconds;
    return this;
  }
  /** Configures {@link @microsoft/signalr.HubConnection.keepAliveIntervalInMilliseconds} for the {@link @microsoft/signalr.HubConnection}.
   *
   * @returns The {@link @microsoft/signalr.HubConnectionBuilder} instance, for chaining.
   */
  withKeepAliveInterval(milliseconds) {
    Arg.isRequired(milliseconds, "milliseconds");
    this._keepAliveIntervalInMilliseconds = milliseconds;
    return this;
  }
  /** Enables and configures options for the Stateful Reconnect feature.
   *
   * @returns The {@link @microsoft/signalr.HubConnectionBuilder} instance, for chaining.
   */
  withStatefulReconnect(options) {
    if (this.httpConnectionOptions === void 0) {
      this.httpConnectionOptions = {};
    }
    this.httpConnectionOptions._useStatefulReconnect = true;
    this._statefulReconnectBufferSize = options === null || options === void 0 ? void 0 : options.bufferSize;
    return this;
  }
  /** Creates a {@link @microsoft/signalr.HubConnection} from the configuration options specified in this builder.
   *
   * @returns {HubConnection} The configured {@link @microsoft/signalr.HubConnection}.
   */
  build() {
    const httpConnectionOptions = this.httpConnectionOptions || {};
    if (httpConnectionOptions.logger === void 0) {
      httpConnectionOptions.logger = this.logger;
    }
    if (!this.url) {
      throw new Error("The 'HubConnectionBuilder.withUrl' method must be called before building the connection.");
    }
    const connection2 = new HttpConnection(this.url, httpConnectionOptions);
    return HubConnection.create(connection2, this.logger || NullLogger.instance, this.protocol || new JsonHubProtocol(), this.reconnectPolicy, this._serverTimeoutInMilliseconds, this._keepAliveIntervalInMilliseconds, this._statefulReconnectBufferSize);
  }
}
function isLogger(logger) {
  return logger.log !== void 0;
}
let connection = null;
let _hubBaseUrl = "";
function setHubBaseUrl(url) {
  if (_hubBaseUrl !== url) {
    _hubBaseUrl = url;
    connection = null;
  }
}
function getLogHub() {
  if (!connection) {
    const hubUrl = _hubBaseUrl ? `${_hubBaseUrl}/logHub` : "/logHub";
    connection = new HubConnectionBuilder().withUrl(hubUrl, {
      accessTokenFactory: () => localStorage.getItem("logwatcher_token") ?? ""
    }).withAutomaticReconnect([0, 2e3, 5e3, 1e4, 3e4]).configureLogging(LogLevel.Warning).build();
  }
  return connection;
}
async function startLogHub() {
  const hub = getLogHub();
  if (hub.state === HubConnectionState.Disconnected) {
    await hub.start();
  }
}
async function stopLogHub() {
  if (connection) {
    await connection.stop();
    connection = null;
  }
}
const createStoreImpl$1 = (createState) => {
  let state;
  const listeners = /* @__PURE__ */ new Set();
  const setState = (partial, replace) => {
    const nextState = typeof partial === "function" ? partial(state) : partial;
    if (!Object.is(nextState, state)) {
      const previousState = state;
      state = (replace != null ? replace : typeof nextState !== "object" || nextState === null) ? nextState : Object.assign({}, state, nextState);
      listeners.forEach((listener) => listener(state, previousState));
    }
  };
  const getState = () => state;
  const getInitialState = () => initialState;
  const subscribe = (listener) => {
    listeners.add(listener);
    return () => listeners.delete(listener);
  };
  const api2 = { setState, getState, getInitialState, subscribe };
  const initialState = state = createState(setState, getState, api2);
  return api2;
};
const createStore$1 = ((createState) => createState ? createStoreImpl$1(createState) : createStoreImpl$1);
const identity$1 = (arg) => arg;
function useStore$1(api2, selector = identity$1) {
  const slice = React.useSyncExternalStore(
    api2.subscribe,
    React.useCallback(() => selector(api2.getState()), [api2, selector]),
    React.useCallback(() => selector(api2.getInitialState()), [api2, selector])
  );
  React.useDebugValue(slice);
  return slice;
}
const createImpl$1 = (createState) => {
  const api2 = createStore$1(createState);
  const useBoundStore = (selector) => useStore$1(api2, selector);
  Object.assign(useBoundStore, api2);
  return useBoundStore;
};
const create$1 = ((createState) => createState ? createImpl$1(createState) : createImpl$1);
const BUFFER_MAX = 5e3;
const EVICT_TO = 3e3;
const useLogStore = create$1((set, get) => ({
  buffers: {},
  selectedLines: {},
  addLinesAt: (sessionId, startLine, lines) => {
    set((state) => {
      const buf = { ...state.buffers[sessionId] ?? {} };
      for (let i = 0; i < lines.length; i++) {
        buf[startLine + i] = lines[i].text;
      }
      const keys = Object.keys(buf).map(Number).sort((a, b) => a - b);
      if (keys.length > BUFFER_MAX) {
        const toEvict = keys.slice(0, keys.length - EVICT_TO);
        for (const k of toEvict) delete buf[k];
      }
      return { buffers: { ...state.buffers, [sessionId]: buf } };
    });
  },
  addLines: (sessionId, lines) => {
    set((state) => {
      const buf = { ...state.buffers[sessionId] ?? {} };
      for (const line of lines) {
        buf[line.lineNumber] = line.text;
      }
      const keys = Object.keys(buf).map(Number).sort((a, b) => a - b);
      if (keys.length > BUFFER_MAX) {
        const toEvict = keys.slice(0, keys.length - EVICT_TO);
        for (const k of toEvict) delete buf[k];
      }
      return { buffers: { ...state.buffers, [sessionId]: buf } };
    });
  },
  clearBuffer: (sessionId) => {
    set((state) => {
      const { [sessionId]: _, ...rest } = state.buffers;
      return { buffers: rest };
    });
  },
  getLine: (sessionId, lineNumber) => {
    return get().buffers[sessionId]?.[lineNumber];
  },
  setSelectedLine: (sessionId, line) => {
    set((state) => ({ selectedLines: { ...state.selectedLines, [sessionId]: line } }));
  },
  getSelectedLine: (sessionId) => {
    return get().selectedLines[sessionId] ?? null;
  }
}));
const useTabStore = create$1((set) => ({
  tabs: [],
  activeSessionId: null,
  addTab: (tab) => set((state) => ({
    tabs: [...state.tabs, tab],
    activeSessionId: tab.sessionId
  })),
  removeTab: (sessionId) => set((state) => {
    const newTabs = state.tabs.filter((t) => t.sessionId !== sessionId);
    const newActive = state.activeSessionId === sessionId ? newTabs[newTabs.length - 1]?.sessionId ?? null : state.activeSessionId;
    return { tabs: newTabs, activeSessionId: newActive };
  }),
  setActive: (sessionId) => set({ activeSessionId: sessionId }),
  updateTab: (sessionId, patch) => set((state) => ({
    tabs: state.tabs.map((t) => t.sessionId === sessionId ? { ...t, ...patch } : t)
  }))
}));
function useLogHub() {
  const started = reactExports.useRef(false);
  const { addLines, addLinesAt, clearBuffer } = useLogStore();
  const { updateTab } = useTabStore();
  reactExports.useEffect(() => {
    if (started.current) return;
    started.current = true;
    const hub = getLogHub();
    hub.on("OnNewLines", (sessionId, lines, totalLines) => {
      addLines(sessionId, lines);
      updateTab(sessionId, { totalLines, errorMessage: void 0 });
    });
    hub.on("OnLines", (sessionId, startLine, lines, viewVersion) => {
      const tab = useTabStore.getState().tabs.find((t) => t.sessionId === sessionId);
      if (typeof viewVersion === "number" && typeof tab?.viewVersion === "number" && viewVersion !== tab.viewVersion)
        return;
      if (typeof tab?.contextStartLine === "number" && typeof tab?.contextTotalLines === "number") {
        const localStart = startLine - tab.contextStartLine;
        const localEnd = localStart + lines.length - 1;
        if (localEnd >= 0 && localStart < tab.contextTotalLines) {
          const first = Math.max(0, -localStart);
          const lastExclusive = Math.min(lines.length, tab.contextTotalLines - localStart);
          const clipped = lines.slice(first, lastExclusive);
          addLinesAt(sessionId, Math.max(0, localStart), clipped);
        }
      } else {
        addLinesAt(sessionId, startLine, lines);
      }
      if (typeof viewVersion === "number") {
        updateTab(sessionId, { errorMessage: void 0, viewVersion });
      } else {
        updateTab(sessionId, { errorMessage: void 0 });
      }
    });
    hub.on("OnFileStats", (sessionId, stats) => {
      const tab = useTabStore.getState().tabs.find((t) => t.sessionId === sessionId);
      if (typeof tab?.viewVersion === "number" && tab.viewVersion !== stats.viewVersion)
        clearBuffer(sessionId);
      const visibleTotal = typeof tab?.contextTotalLines === "number" ? tab.contextTotalLines : stats.totalLines;
      updateTab(sessionId, {
        totalLines: visibleTotal,
        sizeBytes: stats.sizeBytes,
        isIndexed: stats.isIndexed,
        viewVersion: stats.viewVersion
      });
    });
    hub.on("OnReload", (sessionId) => {
      clearBuffer(sessionId);
      updateTab(sessionId, { totalLines: 0, isIndexed: false, newLinesCount: 0 });
    });
    hub.on("OnIndexProgress", (sessionId, bytesIndexed, totalBytes) => {
      updateTab(sessionId, { indexedBytes: bytesIndexed, indexTotalBytes: totalBytes });
    });
    hub.on("OnFilterProgress", (_sessionId, _processed, _total) => {
    });
    hub.on("OnError", (sessionId, message) => {
      console.error(`[LogHub] session=${sessionId}:`, message);
      updateTab(sessionId, { errorMessage: message });
    });
    startLogHub().catch(console.error);
    return () => {
    };
  }, [addLines, addLinesAt, clearBuffer, updateTab]);
  return getLogHub();
}
const usePerimeterStore = create$1((set, get) => ({
  perimeters: [],
  selectedPerimeterId: null,
  isFetching: false,
  fetchError: null,
  fetchPerimeters: async () => {
    if (get().isFetching) return;
    set({ isFetching: true, fetchError: null });
    try {
      const token = localStorage.getItem("logwatcher_token") ?? "";
      const res = await fetch("/api/perimeters", {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        set({ perimeters: data });
      } else if (res.status === 401) {
        localStorage.removeItem("logwatcher_token");
        window.location.reload();
      } else {
        set({ fetchError: `Failed to load perimeters (HTTP ${res.status})` });
      }
    } catch (e) {
      set({ fetchError: "Network error — could not reach server" });
    } finally {
      set({ isFetching: false });
    }
  },
  selectPerimeter: (id) => set({ selectedPerimeterId: id })
}));
function LoginScreen({ onLogin }) {
  const [username, setUsername] = reactExports.useState("");
  const [password, setPassword] = reactExports.useState("");
  const [error, setError] = reactExports.useState("");
  const [loading, setLoading] = reactExports.useState(false);
  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
      });
      if (!res.ok) {
        setError("Invalid username or password.");
        return;
      }
      const data = await res.json();
      localStorage.setItem("logwatcher_token", data.token);
      onLogin(data.token);
    } catch {
      setError("Could not reach the server.");
    } finally {
      setLoading(false);
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-center h-screen bg-gray-900", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "form",
    {
      onSubmit: submit,
      className: "bg-gray-800 border border-gray-600 rounded-lg p-6 w-80 shadow-xl",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-sm font-bold text-blue-400 mb-4", children: "LogWatcher — Sign in" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-xs text-gray-400 mb-1", children: "Username" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            className: "w-full bg-gray-900 text-gray-100 text-xs px-2 py-1.5 rounded border border-gray-600 mb-3 outline-none focus:border-blue-500",
            value: username,
            onChange: (e) => setUsername(e.target.value),
            autoFocus: true,
            autoComplete: "username"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-xs text-gray-400 mb-1", children: "Password" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            type: "password",
            className: "w-full bg-gray-900 text-gray-100 text-xs px-2 py-1.5 rounded border border-gray-600 mb-4 outline-none focus:border-blue-500",
            value: password,
            onChange: (e) => setPassword(e.target.value),
            autoComplete: "current-password"
          }
        ),
        error && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-red-400 text-xs mb-3", children: error }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "submit",
            disabled: loading || !username || !password,
            className: "w-full px-3 py-1.5 text-xs rounded bg-blue-700 text-white hover:bg-blue-600 disabled:opacity-40",
            children: loading ? "Signing in…" : "Sign in"
          }
        )
      ]
    }
  ) });
}
function getToken() {
  return localStorage.getItem("logwatcher_token") ?? "";
}
async function authFetch(url, init) {
  const response = await fetch(url, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
      ...init?.headers ?? {}
    }
  });
  if (response.status === 401) {
    localStorage.removeItem("logwatcher_token");
    window.location.reload();
    throw new Error("Authentication expired.");
  }
  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || `HTTP ${response.status}`);
  }
  if (response.status === 204) {
    return void 0;
  }
  return response.json();
}
function getLogBrowserSettings() {
  return authFetch("/api/settings/log-browser");
}
function createPerimeter(payload) {
  return authFetch("/api/settings/log-browser/perimeters", {
    method: "POST",
    body: JSON.stringify(payload)
  });
}
function updatePerimeter(id, payload) {
  return authFetch(`/api/settings/log-browser/perimeters/${encodeURIComponent(id)}`, {
    method: "PUT",
    body: JSON.stringify(payload)
  });
}
function deletePerimeter(id) {
  return authFetch(`/api/settings/log-browser/perimeters/${encodeURIComponent(id)}`, {
    method: "DELETE"
  });
}
function createRoot(perimeterId, payload) {
  return authFetch(`/api/settings/log-browser/perimeters/${encodeURIComponent(perimeterId)}/roots`, {
    method: "POST",
    body: JSON.stringify(payload)
  });
}
function updateRoot(perimeterId, originalName, payload) {
  return authFetch(`/api/settings/log-browser/perimeters/${encodeURIComponent(perimeterId)}/roots/${encodeURIComponent(originalName)}`, {
    method: "PUT",
    body: JSON.stringify(payload)
  });
}
function deleteRoot(perimeterId, rootName) {
  return authFetch(`/api/settings/log-browser/perimeters/${encodeURIComponent(perimeterId)}/roots/${encodeURIComponent(rootName)}`, {
    method: "DELETE"
  });
}
function createPath(perimeterId, rootName, payload) {
  return authFetch(`/api/settings/log-browser/perimeters/${encodeURIComponent(perimeterId)}/roots/${encodeURIComponent(rootName)}/paths`, {
    method: "POST",
    body: JSON.stringify(payload)
  });
}
function updatePath(perimeterId, rootName, serverId, payload) {
  return authFetch(`/api/settings/log-browser/perimeters/${encodeURIComponent(perimeterId)}/roots/${encodeURIComponent(rootName)}/paths/${encodeURIComponent(serverId)}`, {
    method: "PUT",
    body: JSON.stringify(payload)
  });
}
function deletePath(perimeterId, rootName, serverId) {
  return authFetch(`/api/settings/log-browser/perimeters/${encodeURIComponent(perimeterId)}/roots/${encodeURIComponent(rootName)}/paths/${encodeURIComponent(serverId)}`, {
    method: "DELETE"
  });
}
function getPreferences() {
  return authFetch("/api/settings/preferences");
}
function savePreferences(payload) {
  return authFetch("/api/settings/preferences", {
    method: "PUT",
    body: JSON.stringify(payload)
  });
}
const usePreferencesStore = create$1((set, get) => ({
  defaultHighlights: [],
  profiles: [],
  isFetching: false,
  fetchError: null,
  fetchPreferences: async () => {
    if (get().isFetching) return;
    set({ isFetching: true, fetchError: null });
    try {
      const payload = await getPreferences();
      set({
        defaultHighlights: payload.defaultHighlights ?? [],
        profiles: payload.profiles ?? []
      });
    } catch (error) {
      set({
        fetchError: error instanceof Error ? error.message : "Could not load preferences."
      });
    } finally {
      set({ isFetching: false });
    }
  },
  setPreferences: (payload) => set({
    defaultHighlights: payload.defaultHighlights ?? [],
    profiles: payload.profiles ?? []
  })
}));
const THEME_KEY = "logwatcher_theme";
const FONT_FAMILY_KEY = "logwatcher_font_family";
const FONT_SIZE_KEY = "logwatcher_font_size";
function readInitialTheme() {
  const saved = localStorage.getItem(THEME_KEY);
  return saved === "light" ? "light" : "dark";
}
function readInitialFontFamily() {
  const saved = localStorage.getItem(FONT_FAMILY_KEY);
  return saved === "Consolas" || saved === "Segoe UI" || saved === "Bahnschrift" ? saved : "Cascadia Code";
}
function readInitialFontSize() {
  const parsed = Number(localStorage.getItem(FONT_SIZE_KEY));
  return Number.isFinite(parsed) && parsed >= 10 && parsed <= 22 ? parsed : 11;
}
const useUiStore = create$1((set, get) => ({
  theme: readInitialTheme(),
  fontFamily: readInitialFontFamily(),
  fontSize: readInitialFontSize(),
  setTheme: (theme) => {
    localStorage.setItem(THEME_KEY, theme);
    set({ theme });
  },
  toggleTheme: () => {
    const next = get().theme === "dark" ? "light" : "dark";
    localStorage.setItem(THEME_KEY, next);
    set({ theme: next });
  },
  setFontFamily: (fontFamily) => {
    localStorage.setItem(FONT_FAMILY_KEY, fontFamily);
    set({ fontFamily });
  },
  setFontSize: (fontSize) => {
    localStorage.setItem(FONT_SIZE_KEY, String(fontSize));
    set({ fontSize });
  }
}));
const FONT_OPTIONS = ["Cascadia Code", "Consolas", "Segoe UI", "Bahnschrift"];
function emptyHighlight(order) {
  return {
    order,
    text: "",
    foreColorArgb: -1,
    backColorArgb: 0,
    darkForeColorArgb: -1,
    darkBackColorArgb: 0,
    lightForeColorArgb: -16777216,
    lightBackColorArgb: 0,
    bold: false,
    hightPriority: false,
    caseSensitive: false,
    isRegex: false
  };
}
function emptyHiddenLine() {
  return {
    isActif: true,
    text: "",
    caseSensitive: false,
    isRegex: false
  };
}
function emptyStoredFilter(order) {
  return {
    name: `Filter ${order + 1}`,
    filter: "",
    isRegex: true,
    caseSensitive: false
  };
}
function emptyProfile(name = "New Profile") {
  return {
    name,
    loadingParam: "",
    encoding: "UTF-8",
    shared: false,
    dicoHighLighting: [],
    dicoHiddenLog: [],
    dicoStoredFilter: []
  };
}
function argbToHex(argb, fallback) {
  if (argb === void 0 || argb === 0 || argb === -1) return fallback;
  const rgb = argb & 16777215;
  return `#${rgb.toString(16).padStart(6, "0")}`;
}
function hexToArgb(hex) {
  const rgb = Number.parseInt(hex.replace("#", ""), 16) & 16777215;
  return (4278190080 | rgb) >> 0;
}
function argbToCss$1(argb, fallback) {
  if (argb === void 0 || argb === -1 || argb === 0) return fallback;
  const r = argb >> 16 & 255;
  const g = argb >> 8 & 255;
  const b = argb & 255;
  return `rgb(${r},${g},${b})`;
}
function HighlightListEditor({
  title,
  rules,
  onChange
}) {
  const [selectedIndex, setSelectedIndex] = reactExports.useState(rules.length > 0 ? 0 : null);
  reactExports.useEffect(() => {
    if (rules.length === 0) {
      setSelectedIndex(null);
      return;
    }
    if (selectedIndex === null || selectedIndex >= rules.length)
      setSelectedIndex(0);
  }, [rules, selectedIndex]);
  const updateRule = (index, patch) => {
    onChange(rules.map((rule, current) => current === index ? { ...rule, ...patch } : rule));
  };
  const removeRule = (index) => {
    const nextRules = rules.filter((_, current) => current !== index).map((rule, order) => ({ ...rule, order }));
    onChange(nextRules);
    if (nextRules.length === 0) {
      setSelectedIndex(null);
    } else if (selectedIndex !== null && selectedIndex >= nextRules.length) {
      setSelectedIndex(nextRules.length - 1);
    }
  };
  const addRule = () => {
    onChange([...rules, emptyHighlight(rules.length)]);
    setSelectedIndex(rules.length);
  };
  const selectedRule = selectedIndex === null ? null : rules[selectedIndex] ?? null;
  const darkBgAuto = selectedRule ? !selectedRule.darkBackColorArgb : true;
  const lightBgAuto = selectedRule ? !selectedRule.lightBackColorArgb : true;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "settings-card", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "settings-card__header", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { children: title }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "settings-actions-row", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "control-button control-button--ghost", onClick: addRule, children: "Add highlight" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            className: "control-button control-button--ghost",
            onClick: () => selectedIndex !== null && removeRule(selectedIndex),
            disabled: selectedIndex === null,
            children: "Delete selected"
          }
        )
      ] })
    ] }),
    selectedRule ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "highlight-editor-pane", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "highlight-editor-controls", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "input",
        {
          className: "control-input",
          value: selectedRule.text,
          placeholder: "Pattern",
          onChange: (event) => updateRule(selectedIndex, { text: event.target.value })
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "settings-inline-check", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "checkbox", checked: selectedRule.isRegex, onChange: (event) => updateRule(selectedIndex, { isRegex: event.target.checked }) }),
        "Regex"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "settings-inline-check", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "checkbox", checked: selectedRule.caseSensitive, onChange: (event) => updateRule(selectedIndex, { caseSensitive: event.target.checked }) }),
        "Case"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "settings-inline-check", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "checkbox", checked: selectedRule.bold, onChange: (event) => updateRule(selectedIndex, { bold: event.target.checked }) }),
        "Bold"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "settings-inline-check", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "checkbox", checked: selectedRule.hightPriority, onChange: (event) => updateRule(selectedIndex, { hightPriority: event.target.checked }) }),
        "Priority"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "highlight-color-pair", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Dark" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            type: "color",
            value: argbToHex(selectedRule.darkForeColorArgb ?? selectedRule.foreColorArgb, "#ffffff"),
            onChange: (event) => updateRule(selectedIndex, { darkForeColorArgb: hexToArgb(event.target.value) })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            type: "color",
            value: argbToHex(selectedRule.darkBackColorArgb, "#1b2533"),
            disabled: darkBgAuto,
            onChange: (event) => updateRule(selectedIndex, { darkBackColorArgb: hexToArgb(event.target.value) })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "settings-inline-check", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "checkbox", checked: darkBgAuto, onChange: (event) => updateRule(selectedIndex, { darkBackColorArgb: event.target.checked ? 0 : hexToArgb("#1b2533") }) }),
          "Auto BG"
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "highlight-color-pair", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Light" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            type: "color",
            value: argbToHex(selectedRule.lightForeColorArgb ?? selectedRule.foreColorArgb, "#000000"),
            onChange: (event) => updateRule(selectedIndex, { lightForeColorArgb: hexToArgb(event.target.value) })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            type: "color",
            value: argbToHex(selectedRule.lightBackColorArgb, "#ffffff"),
            disabled: lightBgAuto,
            onChange: (event) => updateRule(selectedIndex, { lightBackColorArgb: hexToArgb(event.target.value) })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "settings-inline-check", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "checkbox", checked: lightBgAuto, onChange: (event) => updateRule(selectedIndex, { lightBackColorArgb: event.target.checked ? 0 : hexToArgb("#ffffff") }) }),
          "Auto BG"
        ] })
      ] })
    ] }) }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "empty-state compact-empty-state", children: "Select or add a highlight rule." }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "highlight-editor-list", children: [
      rules.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "empty-state compact-empty-state", children: "No highlights configured." }),
      rules.map((rule, index) => {
        return /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "button",
            className: `highlight-editor-row highlight-editor-row--compact ${selectedIndex === index ? "highlight-editor-row--active" : ""}`,
            onClick: () => setSelectedIndex(index),
            children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "highlight-preview", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "highlight-preview-swatch highlight-preview-swatch--dark", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "highlight-preview-label", children: "◑ Dark" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "highlight-preview-text", style: {
                  color: argbToCss$1(rule.darkForeColorArgb ?? rule.foreColorArgb, "#ffffff"),
                  backgroundColor: argbToCss$1(rule.darkBackColorArgb, "#1b2533"),
                  fontWeight: rule.bold ? "bold" : void 0
                }, children: rule.text || "Sample text" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "highlight-preview-swatch highlight-preview-swatch--light", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "highlight-preview-label", children: "◐ Light" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "highlight-preview-text", style: {
                  color: argbToCss$1(rule.lightForeColorArgb ?? rule.foreColorArgb, "#000000"),
                  backgroundColor: argbToCss$1(rule.lightBackColorArgb, "#ffffff"),
                  fontWeight: rule.bold ? "bold" : void 0
                }, children: rule.text || "Sample text" })
              ] })
            ] })
          },
          `${title}-${index}`
        );
      })
    ] })
  ] });
}
function PreferencesScreen({ onClose }) {
  const { defaultHighlights, profiles, setPreferences } = usePreferencesStore();
  const { theme, setTheme, fontFamily, setFontFamily, fontSize, setFontSize } = useUiStore();
  const [isSaving, setIsSaving] = reactExports.useState(false);
  const [error, setError] = reactExports.useState(null);
  const [defaultsDraft, setDefaultsDraft] = reactExports.useState([]);
  const [profilesDraft, setProfilesDraft] = reactExports.useState([]);
  const [themeDraft, setThemeDraft] = reactExports.useState(theme);
  const [fontFamilyDraft, setFontFamilyDraft] = reactExports.useState(fontFamily);
  const [fontSizeDraft, setFontSizeDraft] = reactExports.useState(fontSize);
  const [selectedProfileIndex, setSelectedProfileIndex] = reactExports.useState(null);
  const [selectedStoredFilterIndex, setSelectedStoredFilterIndex] = reactExports.useState(null);
  const [activeProfileTab, setActiveProfileTab] = reactExports.useState("highlight");
  reactExports.useEffect(() => {
    getPreferences().then((payload) => {
      setPreferences(payload);
      setDefaultsDraft(payload.defaultHighlights ?? []);
      setProfilesDraft(payload.profiles ?? []);
      setThemeDraft(theme);
      setFontFamilyDraft(fontFamily);
      setFontSizeDraft(fontSize);
      setSelectedProfileIndex(payload.profiles.length > 0 ? 0 : null);
      setSelectedStoredFilterIndex(payload.profiles[0]?.dicoStoredFilter?.length ? 0 : null);
    }).catch((fetchError) => setError(fetchError instanceof Error ? fetchError.message : "Failed to load preferences."));
  }, [setPreferences, theme, fontFamily, fontSize]);
  reactExports.useEffect(() => {
    setDefaultsDraft(defaultHighlights);
  }, [defaultHighlights]);
  reactExports.useEffect(() => {
    setProfilesDraft(profiles);
    if (profiles.length > 0 && selectedProfileIndex === null) {
      setSelectedProfileIndex(0);
    }
  }, [profiles, selectedProfileIndex]);
  reactExports.useEffect(() => {
    if (selectedProfileIndex === null) {
      setSelectedStoredFilterIndex(null);
      return;
    }
    const storedFilters = profilesDraft[selectedProfileIndex]?.dicoStoredFilter ?? [];
    setSelectedStoredFilterIndex(storedFilters.length > 0 ? 0 : null);
  }, [selectedProfileIndex, profilesDraft]);
  const selectedProfile = reactExports.useMemo(
    () => selectedProfileIndex === null ? null : profilesDraft[selectedProfileIndex] ?? null,
    [profilesDraft, selectedProfileIndex]
  );
  const selectedStoredFilter = reactExports.useMemo(() => {
    if (!selectedProfile || selectedStoredFilterIndex === null) return null;
    return selectedProfile.dicoStoredFilter?.[selectedStoredFilterIndex] ?? null;
  }, [selectedProfile, selectedStoredFilterIndex]);
  const updateSelectedProfile = (patch) => {
    if (selectedProfileIndex === null || !selectedProfile) return;
    setProfilesDraft(profilesDraft.map(
      (profile, index) => index === selectedProfileIndex ? { ...profile, ...patch } : profile
    ));
  };
  const updateSelectedStoredFilter = (patch) => {
    if (!selectedProfile || selectedStoredFilterIndex === null) return;
    const current = selectedProfile.dicoStoredFilter ?? [];
    updateSelectedProfile({
      dicoStoredFilter: current.map(
        (item, index) => index === selectedStoredFilterIndex ? { ...item, ...patch } : item
      )
    });
  };
  const createProfile = () => {
    const baseName = `Profile ${profilesDraft.length + 1}`;
    const profile = emptyProfile(baseName);
    setProfilesDraft([...profilesDraft, profile]);
    setSelectedProfileIndex(profilesDraft.length);
    setSelectedStoredFilterIndex(null);
  };
  const removeSelectedProfile = () => {
    if (selectedProfileIndex === null) return;
    const nextProfiles = profilesDraft.filter((_, index) => index !== selectedProfileIndex);
    setProfilesDraft(nextProfiles);
    setSelectedProfileIndex(nextProfiles.length > 0 ? 0 : null);
    setSelectedStoredFilterIndex(nextProfiles[0]?.dicoStoredFilter?.length ? 0 : null);
  };
  const addHiddenLine = () => {
    if (!selectedProfile) return;
    updateSelectedProfile({ dicoHiddenLog: [...selectedProfile.dicoHiddenLog ?? [], emptyHiddenLine()] });
  };
  const updateHiddenLine = (index, patch) => {
    if (!selectedProfile) return;
    updateSelectedProfile({
      dicoHiddenLog: (selectedProfile.dicoHiddenLog ?? []).map(
        (line, current) => current === index ? { ...line, ...patch } : line
      )
    });
  };
  const removeHiddenLine = (index) => {
    if (!selectedProfile) return;
    updateSelectedProfile({
      dicoHiddenLog: (selectedProfile.dicoHiddenLog ?? []).filter((_, current) => current !== index)
    });
  };
  const addStoredFilter = () => {
    if (!selectedProfile) return;
    const current = selectedProfile.dicoStoredFilter ?? [];
    const next = [...current, emptyStoredFilter(current.length)];
    updateSelectedProfile({ dicoStoredFilter: next });
    setSelectedStoredFilterIndex(next.length - 1);
  };
  const removeStoredFilter = () => {
    if (!selectedProfile || selectedStoredFilterIndex === null) return;
    const next = (selectedProfile.dicoStoredFilter ?? []).filter((_, index) => index !== selectedStoredFilterIndex);
    updateSelectedProfile({ dicoStoredFilter: next });
    setSelectedStoredFilterIndex(next.length > 0 ? 0 : null);
  };
  const saveAll = async () => {
    setIsSaving(true);
    setError(null);
    try {
      const payload = {
        defaultHighlights: defaultsDraft,
        profiles: profilesDraft
      };
      const saved = await savePreferences(payload);
      setTheme(themeDraft);
      setFontFamily(fontFamilyDraft);
      setFontSize(fontSizeDraft);
      setPreferences(saved);
      setDefaultsDraft(saved.defaultHighlights ?? []);
      setProfilesDraft(saved.profiles ?? []);
      setSelectedProfileIndex(saved.profiles.length > 0 ? 0 : null);
      setSelectedStoredFilterIndex(saved.profiles[0]?.dicoStoredFilter?.length ? 0 : null);
      onClose();
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "Could not save preferences.");
    } finally {
      setIsSaving(false);
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "settings-overlay", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "settings-screen", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "settings-screen__header", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { children: "Preferences" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "Manage user display preferences and shared highlights/profiles." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "settings-actions-row", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "control-button control-button--primary", onClick: saveAll, disabled: isSaving, children: "Save" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "control-button control-button--ghost", onClick: onClose, children: "Cancel" })
      ] })
    ] }),
    error && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "settings-error", children: error }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "settings-grid", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "settings-card", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "settings-card__header", children: /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { children: "User preferences" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "settings-form-grid", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { children: [
            "Theme",
            /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { className: "control-input", value: themeDraft, onChange: (event) => setThemeDraft(event.target.value), children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "dark", children: "Dark" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "light", children: "Light" })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { children: [
            "Font",
            /* @__PURE__ */ jsxRuntimeExports.jsx("select", { className: "control-input", value: fontFamilyDraft, onChange: (event) => setFontFamilyDraft(event.target.value), children: FONT_OPTIONS.map((option) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: option, children: option }, option)) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { children: [
            "Text size",
            /* @__PURE__ */ jsxRuntimeExports.jsx("input", { className: "control-input", type: "number", min: 10, max: 22, value: fontSizeDraft, onChange: (event) => setFontSizeDraft(Number(event.target.value)) })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(HighlightListEditor, { title: "Default highlights", rules: defaultsDraft, onChange: setDefaultsDraft }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "settings-card settings-card--split", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "settings-card__header", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { children: "Profiles" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "settings-actions-row", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "control-button control-button--ghost", onClick: createProfile, children: "New" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "control-button control-button--ghost", onClick: removeSelectedProfile, disabled: !selectedProfile, children: "Delete" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "settings-split-layout", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "settings-list-panel", children: profilesDraft.map((profile, index) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              className: `settings-list-item ${selectedProfileIndex === index ? "settings-list-item--active" : ""}`,
              onClick: () => {
                setSelectedProfileIndex(index);
                setSelectedStoredFilterIndex(profile.dicoStoredFilter?.length ? 0 : null);
              },
              children: profile.name
            },
            `${profile.name}-${index}`
          )) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "settings-detail-panel", children: selectedProfile ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "settings-form-grid", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { children: [
                "Profile name",
                /* @__PURE__ */ jsxRuntimeExports.jsx("input", { className: "control-input", value: selectedProfile.name, onChange: (event) => updateSelectedProfile({ name: event.target.value }) })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { children: [
                "Encoding",
                /* @__PURE__ */ jsxRuntimeExports.jsx("input", { className: "control-input", value: selectedProfile.encoding ?? "UTF-8", onChange: (event) => updateSelectedProfile({ encoding: event.target.value }) })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { children: [
                "Loading param",
                /* @__PURE__ */ jsxRuntimeExports.jsx("input", { className: "control-input", value: selectedProfile.loadingParam ?? "", onChange: (event) => updateSelectedProfile({ loadingParam: event.target.value }) })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "settings-actions-row profile-tabs", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: `control-chip ${activeProfileTab === "highlight" ? "control-chip--active" : ""}`, onClick: () => setActiveProfileTab("highlight"), children: "Highlight" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: `control-chip ${activeProfileTab === "hidden" ? "control-chip--active" : ""}`, onClick: () => setActiveProfileTab("hidden"), children: "Hidden lines" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: `control-chip ${activeProfileTab === "stored" ? "control-chip--active" : ""}`, onClick: () => setActiveProfileTab("stored"), children: "Stored filter" })
            ] }),
            activeProfileTab === "highlight" && /* @__PURE__ */ jsxRuntimeExports.jsx(
              HighlightListEditor,
              {
                title: "Profile highlights",
                rules: selectedProfile.dicoHighLighting ?? [],
                onChange: (rules) => updateSelectedProfile({ dicoHighLighting: rules })
              }
            ),
            activeProfileTab === "hidden" && /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "settings-card", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "settings-card__header", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { children: "Hidden lines" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "control-button control-button--ghost", onClick: addHiddenLine, children: "Add hidden line" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "settings-list-panel", children: [
                (selectedProfile.dicoHiddenLog ?? []).length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "empty-state compact-empty-state", children: "No hidden lines configured." }),
                (selectedProfile.dicoHiddenLog ?? []).map((line, index) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "settings-row-line", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("input", { className: "control-input", value: line.text, placeholder: "Pattern", onChange: (event) => updateHiddenLine(index, { text: event.target.value }) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "settings-inline-check", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "checkbox", checked: line.isRegex, onChange: (event) => updateHiddenLine(index, { isRegex: event.target.checked }) }),
                    "Regex"
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "settings-inline-check", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "checkbox", checked: line.caseSensitive, onChange: (event) => updateHiddenLine(index, { caseSensitive: event.target.checked }) }),
                    "Case"
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "settings-inline-check", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "checkbox", checked: line.isActif, onChange: (event) => updateHiddenLine(index, { isActif: event.target.checked }) }),
                    "Active"
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "control-button control-button--ghost", onClick: () => removeHiddenLine(index), children: "Delete" })
                ] }, `${selectedProfile.name}-hidden-${index}`))
              ] })
            ] }),
            activeProfileTab === "stored" && /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "settings-card", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "settings-card__header", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { children: "Stored filters" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "settings-actions-row", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "control-button control-button--ghost", onClick: addStoredFilter, children: "Add" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "control-button control-button--ghost", onClick: removeStoredFilter, disabled: !selectedStoredFilter, children: "Delete" })
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "settings-form-grid", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { children: [
                "Stored filter",
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "select",
                  {
                    className: "control-input",
                    value: selectedStoredFilterIndex ?? "",
                    onChange: (event) => setSelectedStoredFilterIndex(event.target.value === "" ? null : Number(event.target.value)),
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "", children: "Select a filter" }),
                      (selectedProfile.dicoStoredFilter ?? []).map((filter, index) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: index, children: filter.name }, `${filter.name}-${index}`))
                    ]
                  }
                )
              ] }) }),
              selectedStoredFilter ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "settings-row-line settings-row-line--stacked", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { children: [
                  "Name",
                  /* @__PURE__ */ jsxRuntimeExports.jsx("input", { className: "control-input", value: selectedStoredFilter.name, onChange: (event) => updateSelectedStoredFilter({ name: event.target.value }) })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { children: [
                  "Filter",
                  /* @__PURE__ */ jsxRuntimeExports.jsx("input", { className: "control-input", value: selectedStoredFilter.filter, onChange: (event) => updateSelectedStoredFilter({ filter: event.target.value }) })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "settings-inline-check", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "checkbox", checked: selectedStoredFilter.isRegex, onChange: (event) => updateSelectedStoredFilter({ isRegex: event.target.checked }) }),
                  "Regex"
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "settings-inline-check", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "checkbox", checked: selectedStoredFilter.caseSensitive, onChange: (event) => updateSelectedStoredFilter({ caseSensitive: event.target.checked }) }),
                  "Case sensitive"
                ] })
              ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "empty-state compact-empty-state", children: "Select or create a stored filter." })
            ] })
          ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "empty-state compact-empty-state", children: "Select or create a profile." }) })
        ] })
      ] })
    ] })
  ] }) });
}
function emptyServer() {
  return {
    id: "",
    name: "",
    type: "local",
    host: "",
    agentId: "",
    username: ""
  };
}
function LogBrowserSettingsScreen({ onClose }) {
  const { fetchPerimeters } = usePerimeterStore();
  const [perimeters, setPerimeters] = reactExports.useState([]);
  const [selectedPerimeterId, setSelectedPerimeterId] = reactExports.useState(null);
  const [selectedRootName, setSelectedRootName] = reactExports.useState(null);
  const [perimeterName, setPerimeterName] = reactExports.useState("");
  const [rootName, setRootName] = reactExports.useState("");
  const [serverDraft, setServerDraft] = reactExports.useState(emptyServer());
  const [error, setError] = reactExports.useState(null);
  const [isSaving, setIsSaving] = reactExports.useState(false);
  const selectedPerimeter = reactExports.useMemo(
    () => perimeters.find((perimeter) => perimeter.id === selectedPerimeterId) ?? null,
    [perimeters, selectedPerimeterId]
  );
  const selectedRoot = reactExports.useMemo(
    () => selectedPerimeter?.rootFolders.find((root) => root.name === selectedRootName) ?? null,
    [selectedPerimeter, selectedRootName]
  );
  const load = async () => {
    const nextPerimeters = await getLogBrowserSettings();
    setPerimeters(nextPerimeters);
    setSelectedPerimeterId((current) => current ?? nextPerimeters[0]?.id ?? null);
  };
  reactExports.useEffect(() => {
    load().catch((loadError) => setError(loadError instanceof Error ? loadError.message : "Failed to load browser settings."));
  }, []);
  reactExports.useEffect(() => {
    setPerimeterName(selectedPerimeter?.name ?? "");
    setSelectedRootName((current) => current ?? selectedPerimeter?.rootFolders[0]?.name ?? null);
  }, [selectedPerimeter]);
  reactExports.useEffect(() => {
    setRootName(selectedRoot?.name ?? "");
    setServerDraft(emptyServer());
  }, [selectedRoot]);
  const savePerimeter = async () => {
    const trimmedName = perimeterName.trim();
    if (!trimmedName) {
      setError("Perimeter name is required.");
      return;
    }
    const perimeterNameExists = perimeters.some(
      (perimeter) => perimeter.id !== selectedPerimeterId && perimeter.name.localeCompare(trimmedName, void 0, { sensitivity: "accent" }) === 0
    );
    if (perimeterNameExists) {
      setError(`Perimeter '${trimmedName}' already exists.`);
      return;
    }
    setIsSaving(true);
    setError(null);
    try {
      if (selectedPerimeter) {
        await updatePerimeter(selectedPerimeter.id, { ...selectedPerimeter, name: trimmedName });
      } else {
        await createPerimeter({ name: trimmedName });
      }
      await load();
      await fetchPerimeters();
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "Could not save perimeter.");
    } finally {
      setIsSaving(false);
    }
  };
  const saveRoot = async () => {
    if (!selectedPerimeterId) return;
    const trimmedName = rootName.trim();
    if (!trimmedName) {
      setError("Environment name is required.");
      return;
    }
    const rootNameExists = (selectedPerimeter?.rootFolders ?? []).some(
      (root) => root.name !== selectedRootName && root.name.localeCompare(trimmedName, void 0, { sensitivity: "accent" }) === 0
    );
    if (rootNameExists) {
      setError(`Environment '${trimmedName}' already exists.`);
      return;
    }
    setIsSaving(true);
    setError(null);
    try {
      if (selectedRoot) {
        await updateRoot(selectedPerimeterId, selectedRoot.name, { name: trimmedName });
      } else {
        await createRoot(selectedPerimeterId, { name: trimmedName, servers: [] });
      }
      await load();
      await fetchPerimeters();
      setSelectedRootName(trimmedName);
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "Could not save root.");
    } finally {
      setIsSaving(false);
    }
  };
  const savePath = async () => {
    if (!selectedPerimeterId || !selectedRootName) return;
    const trimmedName = serverDraft.name.trim();
    if (!trimmedName) {
      setError("Path name is required.");
      return;
    }
    const pathNameExists = (selectedRoot?.servers ?? []).some(
      (server) => server.id !== serverDraft.id && server.name.localeCompare(trimmedName, void 0, { sensitivity: "accent" }) === 0
    );
    if (pathNameExists) {
      setError(`Path '${trimmedName}' already exists.`);
      return;
    }
    setIsSaving(true);
    setError(null);
    try {
      const payload = { ...serverDraft, name: trimmedName };
      if (serverDraft.id) {
        await updatePath(selectedPerimeterId, selectedRootName, serverDraft.id, payload);
      } else {
        await createPath(selectedPerimeterId, selectedRootName, payload);
      }
      await load();
      await fetchPerimeters();
      setServerDraft(emptyServer());
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "Could not save path.");
    } finally {
      setIsSaving(false);
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "settings-overlay", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "settings-screen", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "settings-screen__header", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { children: "LogBrowser settings" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "Select or create a perimeter, then a root, then add or edit paths." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "control-button control-button--ghost", onClick: onClose, children: "Close" })
    ] }),
    error && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "settings-error", children: error }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "settings-three-columns", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "settings-card", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "settings-card__header", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { children: "Perimeters" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "control-button control-button--ghost", onClick: () => {
            setSelectedPerimeterId(null);
            setPerimeterName("");
          }, children: "New" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "settings-list-panel", children: perimeters.map((perimeter) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            className: `settings-list-item ${selectedPerimeterId === perimeter.id ? "settings-list-item--active" : ""}`,
            onClick: () => setSelectedPerimeterId(perimeter.id),
            children: perimeter.name
          },
          perimeter.id
        )) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "settings-form-grid", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { children: [
          "Name",
          /* @__PURE__ */ jsxRuntimeExports.jsx("input", { className: "control-input", value: perimeterName, onChange: (event) => setPerimeterName(event.target.value) })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "settings-actions-row", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "control-button control-button--primary", onClick: savePerimeter, disabled: isSaving || !perimeterName.trim(), children: "Save" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "control-button control-button--ghost", disabled: !selectedPerimeterId || isSaving, onClick: async () => {
            if (!selectedPerimeterId) return;
            await deletePerimeter(selectedPerimeterId);
            await load();
            await fetchPerimeters();
          }, children: "Delete" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "settings-card", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "settings-card__header", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { children: "Environments" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "control-button control-button--ghost", onClick: () => {
            setSelectedRootName(null);
            setRootName("");
          }, children: "New" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "settings-list-panel", children: selectedPerimeter?.rootFolders.map((root) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            className: `settings-list-item ${selectedRootName === root.name ? "settings-list-item--active" : ""}`,
            onClick: () => setSelectedRootName(root.name),
            children: root.name
          },
          root.name
        )) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "settings-form-grid", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { children: [
          "Environment name",
          /* @__PURE__ */ jsxRuntimeExports.jsx("input", { className: "control-input", value: rootName, onChange: (event) => setRootName(event.target.value) })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "settings-actions-row", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "control-button control-button--primary", onClick: saveRoot, disabled: isSaving || !selectedPerimeterId || !rootName.trim(), children: "Save" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "control-button control-button--ghost", disabled: !selectedPerimeterId || !selectedRootName || isSaving, onClick: async () => {
            if (!selectedPerimeterId || !selectedRootName) return;
            await deleteRoot(selectedPerimeterId, selectedRootName);
            await load();
            await fetchPerimeters();
          }, children: "Delete" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "settings-card", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "settings-card__header", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { children: "Paths" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "control-button control-button--ghost", onClick: () => setServerDraft(emptyServer()), children: "New" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "settings-list-panel", children: selectedRoot?.servers.map((server) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            className: `settings-list-item ${serverDraft.id === server.id ? "settings-list-item--active" : ""}`,
            onClick: () => setServerDraft(server),
            children: server.name || server.host || server.agentId || server.id
          },
          server.id
        )) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "settings-form-grid", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { children: [
            "Name",
            /* @__PURE__ */ jsxRuntimeExports.jsx("input", { className: "control-input", value: serverDraft.name, onChange: (event) => setServerDraft({ ...serverDraft, name: event.target.value }) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { children: [
            "Type",
            /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { className: "control-input", value: serverDraft.type, onChange: (event) => setServerDraft({ ...serverDraft, type: event.target.value }), children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "local", children: "local" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "smb", children: "smb" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "agent", children: "agent" })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { children: [
            "Path / Host",
            /* @__PURE__ */ jsxRuntimeExports.jsx("input", { className: "control-input", value: serverDraft.host ?? "", onChange: (event) => setServerDraft({ ...serverDraft, host: event.target.value }) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { children: [
            "Agent Id",
            /* @__PURE__ */ jsxRuntimeExports.jsx("input", { className: "control-input", value: serverDraft.agentId ?? "", onChange: (event) => setServerDraft({ ...serverDraft, agentId: event.target.value }) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { children: [
            "Username",
            /* @__PURE__ */ jsxRuntimeExports.jsx("input", { className: "control-input", value: serverDraft.username ?? "", onChange: (event) => setServerDraft({ ...serverDraft, username: event.target.value }) })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "settings-actions-row", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "control-button control-button--primary", onClick: savePath, disabled: isSaving || !selectedPerimeterId || !selectedRootName || !serverDraft.name.trim(), children: "Save" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "control-button control-button--ghost", disabled: !selectedPerimeterId || !selectedRootName || !serverDraft.id || isSaving, onClick: async () => {
            if (!selectedPerimeterId || !selectedRootName || !serverDraft.id) return;
            await deletePath(selectedPerimeterId, selectedRootName, serverDraft.id);
            await load();
            await fetchPerimeters();
            setServerDraft(emptyServer());
          }, children: "Delete" })
        ] })
      ] })
    ] })
  ] }) });
}
function ServerConfigScreen({ onSave }) {
  const [url, setUrl] = reactExports.useState("");
  const [sidecarMode, setSidecarMode] = reactExports.useState(false);
  const [sidecarStarting, setSidecarStarting] = reactExports.useState(false);
  const [error, setError] = reactExports.useState(null);
  async function handleConnect(e) {
    e.preventDefault();
    setError(null);
    let finalUrl = url.trim().replace(/\/$/, "");
    if (!finalUrl) {
      setError("Please enter the server URL.");
      return;
    }
    if (!/^https?:\/\//i.test(finalUrl)) {
      finalUrl = "https://" + finalUrl;
    }
    try {
      const res = await fetch(`${finalUrl}/health`);
      if (!res.ok && res.status >= 500) {
        setError(`Server responded with ${res.status}. Check the URL and try again.`);
        return;
      }
    } catch {
      setError(
        "Could not reach the server. Make sure the URL is correct and the server is running."
      );
      return;
    }
    onSave(finalUrl);
  }
  async function handleStartSidecar() {
    setSidecarStarting(true);
    setError(null);
    try {
      const port = await window.electronAPI.startSidecar();
      const sidecarUrl = `http://localhost:${port}`;
      setUrl(sidecarUrl);
      onSave(sidecarUrl);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to start sidecar.");
    } finally {
      setSidecarStarting(false);
    }
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      style: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        background: "var(--app-bg)"
      },
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          style: {
            background: "var(--surface-2)",
            border: "1px solid var(--border-subtle)",
            borderRadius: 12,
            padding: "40px 48px",
            minWidth: 480,
            boxShadow: "var(--shadow)"
          },
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { style: { margin: "0 0 8px", color: "var(--text-1)", fontSize: 22 }, children: "LogWatcher Desktop" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { style: { margin: "0 0 32px", color: "var(--text-3)", fontSize: 13 }, children: "Connect to a LogWatcher.Web backend to get started." }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleConnect, style: { display: sidecarMode ? "none" : "block" }, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("label", { style: { display: "block", color: "var(--text-2)", fontSize: 12, marginBottom: 6 }, children: "Remote server URL" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "input",
                {
                  type: "text",
                  value: url,
                  onChange: (e) => setUrl(e.target.value),
                  placeholder: "https://logs.mycompany.com",
                  autoFocus: true,
                  style: {
                    width: "100%",
                    padding: "8px 12px",
                    borderRadius: 6,
                    border: "1px solid var(--border-strong)",
                    background: "var(--surface-3)",
                    color: "var(--text-1)",
                    fontSize: 14,
                    outline: "none",
                    boxSizing: "border-box"
                  }
                }
              ),
              error && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { style: { color: "var(--danger)", fontSize: 12, margin: "8px 0 0" }, children: error }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "submit",
                  style: {
                    marginTop: 20,
                    width: "100%",
                    padding: "9px",
                    borderRadius: 6,
                    border: "none",
                    background: "var(--accent)",
                    color: "#07111f",
                    fontWeight: 600,
                    fontSize: 14,
                    cursor: "pointer"
                  },
                  children: "Connect"
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { marginTop: 24, borderTop: "1px solid var(--border-subtle)", paddingTop: 20 }, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { style: { color: "var(--text-3)", fontSize: 12, margin: "0 0 12px" }, children: "Or start a local backend (sidecar mode) — requires LogWatcher.Web to be installed alongside this app." }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  disabled: sidecarStarting,
                  onClick: handleStartSidecar,
                  style: {
                    width: "100%",
                    padding: "8px",
                    borderRadius: 6,
                    border: "1px solid var(--border-strong)",
                    background: "transparent",
                    color: "var(--text-2)",
                    fontSize: 13,
                    cursor: sidecarStarting ? "wait" : "pointer"
                  },
                  children: sidecarStarting ? "Starting sidecar…" : "Start local backend (sidecar)"
                }
              ),
              error && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { style: { color: "var(--danger)", fontSize: 12, margin: "8px 0 0" }, children: error })
            ] })
          ]
        }
      )
    }
  );
}
function gt$1(e, t) {
  const n = getComputedStyle(e), o = parseFloat(n.fontSize);
  return t * o;
}
function yt$1(e, t) {
  const n = getComputedStyle(e.ownerDocument.body), o = parseFloat(n.fontSize);
  return t * o;
}
function St$1(e) {
  return e / 100 * window.innerHeight;
}
function vt$1(e) {
  return e / 100 * window.innerWidth;
}
function bt$1(e) {
  switch (typeof e) {
    case "number":
      return [e, "px"];
    case "string": {
      const t = parseFloat(e);
      return e.endsWith("%") ? [t, "%"] : e.endsWith("px") ? [t, "px"] : e.endsWith("rem") ? [t, "rem"] : e.endsWith("em") ? [t, "em"] : e.endsWith("vh") ? [t, "vh"] : e.endsWith("vw") ? [t, "vw"] : [t, "%"];
    }
  }
}
function ie$1({
  groupSize: e,
  panelElement: t,
  styleProp: n
}) {
  let o;
  const [i, r] = bt$1(n);
  switch (r) {
    case "%": {
      o = i / 100 * e;
      break;
    }
    case "px": {
      o = i;
      break;
    }
    case "rem": {
      o = yt$1(t, i);
      break;
    }
    case "em": {
      o = gt$1(t, i);
      break;
    }
    case "vh": {
      o = St$1(i);
      break;
    }
    case "vw": {
      o = vt$1(i);
      break;
    }
  }
  return o;
}
function O(e) {
  return parseFloat(e.toFixed(3));
}
function ne$1({
  group: e
}) {
  const { orientation: t, panels: n } = e;
  return n.reduce((o, i) => (o += t === "horizontal" ? i.element.offsetWidth : i.element.offsetHeight, o), 0);
}
function ve$1(e) {
  const { panels: t } = e, n = ne$1({ group: e });
  return n === 0 ? t.map((o) => ({
    groupResizeBehavior: o.panelConstraints.groupResizeBehavior,
    collapsedSize: 0,
    collapsible: o.panelConstraints.collapsible === true,
    defaultSize: void 0,
    disabled: o.panelConstraints.disabled,
    minSize: 0,
    maxSize: 100,
    panelId: o.id
  })) : t.map((o) => {
    const { element: i, panelConstraints: r } = o;
    let f = 0;
    if (r.collapsedSize !== void 0) {
      const u = ie$1({
        groupSize: n,
        panelElement: i,
        styleProp: r.collapsedSize
      });
      f = O(u / n * 100);
    }
    let a;
    if (r.defaultSize !== void 0) {
      const u = ie$1({
        groupSize: n,
        panelElement: i,
        styleProp: r.defaultSize
      });
      a = O(u / n * 100);
    }
    let s = 0;
    if (r.minSize !== void 0) {
      const u = ie$1({
        groupSize: n,
        panelElement: i,
        styleProp: r.minSize
      });
      s = O(u / n * 100);
    }
    let l = 100;
    if (r.maxSize !== void 0) {
      const u = ie$1({
        groupSize: n,
        panelElement: i,
        styleProp: r.maxSize
      });
      l = O(u / n * 100);
    }
    return {
      groupResizeBehavior: r.groupResizeBehavior,
      collapsedSize: f,
      collapsible: r.collapsible === true,
      defaultSize: a,
      disabled: r.disabled,
      minSize: s,
      maxSize: l,
      panelId: o.id
    };
  });
}
function C$1(e, t = "Assertion error") {
  if (!e)
    throw Error(t);
}
function be$1(e, t) {
  return Array.from(t).sort(
    e === "horizontal" ? zt$1 : xt$1
  );
}
function zt$1(e, t) {
  const n = e.element.offsetLeft - t.element.offsetLeft;
  return n !== 0 ? n : e.element.offsetWidth - t.element.offsetWidth;
}
function xt$1(e, t) {
  const n = e.element.offsetTop - t.element.offsetTop;
  return n !== 0 ? n : e.element.offsetHeight - t.element.offsetHeight;
}
function qe$1(e) {
  return e !== null && typeof e == "object" && "nodeType" in e && e.nodeType === Node.ELEMENT_NODE;
}
function Ye$1(e, t) {
  return {
    x: e.x >= t.left && e.x <= t.right ? 0 : Math.min(
      Math.abs(e.x - t.left),
      Math.abs(e.x - t.right)
    ),
    y: e.y >= t.top && e.y <= t.bottom ? 0 : Math.min(
      Math.abs(e.y - t.top),
      Math.abs(e.y - t.bottom)
    )
  };
}
function Pt$1({
  orientation: e,
  rects: t,
  targetRect: n
}) {
  const o = {
    x: n.x + n.width / 2,
    y: n.y + n.height / 2
  };
  let i, r = Number.MAX_VALUE;
  for (const f of t) {
    const { x: a, y: s } = Ye$1(o, f), l = e === "horizontal" ? a : s;
    l < r && (r = l, i = f);
  }
  return C$1(i, "No rect found"), i;
}
let fe$1;
function wt$1() {
  return fe$1 === void 0 && (typeof matchMedia == "function" ? fe$1 = !!matchMedia("(pointer:coarse)").matches : fe$1 = false), fe$1;
}
function Je$1(e) {
  const { element: t, orientation: n, panels: o, separators: i } = e, r = be$1(
    n,
    Array.from(t.children).filter(qe$1).map((z) => ({ element: z }))
  ).map(({ element: z }) => z), f = [];
  let a = false, s = false, l = -1, u = -1, h = 0, d, S = [];
  {
    let z = -1;
    for (const c of r)
      c.hasAttribute("data-panel") && (z++, c.hasAttribute("data-disabled") || (h++, l === -1 && (l = z), u = z));
  }
  if (h > 1) {
    let z = -1;
    for (const c of r)
      if (c.hasAttribute("data-panel")) {
        z++;
        const p = o.find(
          (m) => m.element === c
        );
        if (p) {
          if (d) {
            const m = d.element.getBoundingClientRect(), v = c.getBoundingClientRect();
            let b;
            if (s) {
              const y = n === "horizontal" ? new DOMRect(
                m.right,
                m.top,
                0,
                m.height
              ) : new DOMRect(
                m.left,
                m.bottom,
                m.width,
                0
              ), g = n === "horizontal" ? new DOMRect(v.left, v.top, 0, v.height) : new DOMRect(v.left, v.top, v.width, 0);
              switch (S.length) {
                case 0: {
                  b = [
                    y,
                    g
                  ];
                  break;
                }
                case 1: {
                  const P = S[0], M = Pt$1({
                    orientation: n,
                    rects: [m, v],
                    targetRect: P.element.getBoundingClientRect()
                  });
                  b = [
                    P,
                    M === m ? g : y
                  ];
                  break;
                }
                default: {
                  b = S;
                  break;
                }
              }
            } else
              S.length ? b = S : b = [
                n === "horizontal" ? new DOMRect(
                  m.right,
                  v.top,
                  v.left - m.right,
                  v.height
                ) : new DOMRect(
                  v.left,
                  m.bottom,
                  v.width,
                  v.top - m.bottom
                )
              ];
            for (const y of b) {
              let g = "width" in y ? y : y.element.getBoundingClientRect();
              const P = wt$1() ? e.resizeTargetMinimumSize.coarse : e.resizeTargetMinimumSize.fine;
              if (g.width < P) {
                const w = P - g.width;
                g = new DOMRect(
                  g.x - w / 2,
                  g.y,
                  g.width + w,
                  g.height
                );
              }
              if (g.height < P) {
                const w = P - g.height;
                g = new DOMRect(
                  g.x,
                  g.y - w / 2,
                  g.width,
                  g.height + w
                );
              }
              const M = z <= l || z > u;
              !a && !M && f.push({
                group: e,
                groupSize: ne$1({ group: e }),
                panels: [d, p],
                separator: "width" in y ? void 0 : y,
                rect: g
              }), a = false;
            }
          }
          s = false, d = p, S = [];
        }
      } else if (c.hasAttribute("data-separator")) {
        c.ariaDisabled !== null && (a = true);
        const p = i.find(
          (m) => m.element === c
        );
        p ? S.push(p) : (d = void 0, S = []);
      } else
        s = true;
  }
  return f;
}
let Ze$1 = class Ze {
  #e = {};
  addListener(t, n) {
    const o = this.#e[t];
    return o === void 0 ? this.#e[t] = [n] : o.includes(n) || o.push(n), () => {
      this.removeListener(t, n);
    };
  }
  emit(t, n) {
    const o = this.#e[t];
    if (o !== void 0)
      if (o.length === 1)
        o[0].call(null, n);
      else {
        let i = false, r = null;
        const f = Array.from(o);
        for (let a = 0; a < f.length; a++) {
          const s = f[a];
          try {
            s.call(null, n);
          } catch (l) {
            r === null && (i = true, r = l);
          }
        }
        if (i)
          throw r;
      }
  }
  removeAllListeners() {
    this.#e = {};
  }
  removeListener(t, n) {
    const o = this.#e[t];
    if (o !== void 0) {
      const i = o.indexOf(n);
      i >= 0 && o.splice(i, 1);
    }
  }
};
let F$1 = /* @__PURE__ */ new Map();
const Qe$1 = new Ze$1();
function Lt$1(e) {
  F$1 = new Map(F$1), F$1.delete(e);
}
function ke$1(e, t) {
  for (const [n] of F$1)
    if (n.id === e)
      return n;
}
function H$1(e, t) {
  for (const [n, o] of F$1)
    if (n.id === e)
      return o;
  if (t)
    throw Error(`Could not find data for Group with id ${e}`);
}
function X$1() {
  return F$1;
}
function ze$1(e, t) {
  return Qe$1.addListener("groupChange", (n) => {
    n.group.id === e && t(n);
  });
}
function $$1(e, t) {
  const n = F$1.get(e);
  F$1 = new Map(F$1), F$1.set(e, t), Qe$1.emit("groupChange", {
    group: e,
    prev: n,
    next: t
  });
}
function Ct$1(e, t, n) {
  let o, i = {
    x: 1 / 0,
    y: 1 / 0
  };
  for (const r of t) {
    const f = Ye$1(n, r.rect);
    switch (e) {
      case "horizontal": {
        f.x <= i.x && (o = r, i = f);
        break;
      }
      case "vertical": {
        f.y <= i.y && (o = r, i = f);
        break;
      }
    }
  }
  return o ? {
    distance: i,
    hitRegion: o
  } : void 0;
}
function Rt$1(e) {
  return e !== null && typeof e == "object" && "nodeType" in e && e.nodeType === Node.DOCUMENT_FRAGMENT_NODE;
}
function Mt$1(e, t) {
  if (e === t) throw new Error("Cannot compare node with itself");
  const n = {
    a: Oe$1(e),
    b: Oe$1(t)
  };
  let o;
  for (; n.a.at(-1) === n.b.at(-1); )
    o = n.a.pop(), n.b.pop();
  C$1(
    o,
    "Stacking order can only be calculated for elements with a common ancestor"
  );
  const i = {
    a: De$1(Ie$1(n.a)),
    b: De$1(Ie$1(n.b))
  };
  if (i.a === i.b) {
    const r = o.childNodes, f = {
      a: n.a.at(-1),
      b: n.b.at(-1)
    };
    let a = r.length;
    for (; a--; ) {
      const s = r[a];
      if (s === f.a) return 1;
      if (s === f.b) return -1;
    }
  }
  return Math.sign(i.a - i.b);
}
const Et$1 = /\b(?:position|zIndex|opacity|transform|webkitTransform|mixBlendMode|filter|webkitFilter|isolation)\b/;
function kt$1(e) {
  const t = getComputedStyle(et$1(e) ?? e).display;
  return t === "flex" || t === "inline-flex";
}
function It$1(e) {
  const t = getComputedStyle(e);
  return !!(t.position === "fixed" || t.zIndex !== "auto" && (t.position !== "static" || kt$1(e)) || +t.opacity < 1 || "transform" in t && t.transform !== "none" || "webkitTransform" in t && t.webkitTransform !== "none" || "mixBlendMode" in t && t.mixBlendMode !== "normal" || "filter" in t && t.filter !== "none" || "webkitFilter" in t && t.webkitFilter !== "none" || "isolation" in t && t.isolation === "isolate" || Et$1.test(t.willChange) || t.webkitOverflowScrolling === "touch");
}
function Ie$1(e) {
  let t = e.length;
  for (; t--; ) {
    const n = e[t];
    if (C$1(n, "Missing node"), It$1(n)) return n;
  }
  return null;
}
function De$1(e) {
  return e && Number(getComputedStyle(e).zIndex) || 0;
}
function Oe$1(e) {
  const t = [];
  for (; e; )
    t.push(e), e = et$1(e);
  return t;
}
function et$1(e) {
  const { parentNode: t } = e;
  return Rt$1(t) ? t.host : t;
}
function Dt$1(e, t) {
  return e.x < t.x + t.width && e.x + e.width > t.x && e.y < t.y + t.height && e.y + e.height > t.y;
}
function Ot$1({
  groupElement: e,
  hitRegion: t,
  pointerEventTarget: n
}) {
  if (!qe$1(n) || n.contains(e) || e.contains(n))
    return true;
  if (Mt$1(n, e) > 0) {
    let o = n;
    for (; o; ) {
      if (o.contains(e))
        return true;
      if (Dt$1(o.getBoundingClientRect(), t))
        return false;
      o = o.parentElement;
    }
  }
  return true;
}
function xe$1(e, t) {
  const n = [];
  return t.forEach((o, i) => {
    if (i.disabled)
      return;
    const r = Je$1(i), f = Ct$1(i.orientation, r, {
      x: e.clientX,
      y: e.clientY
    });
    f && f.distance.x <= 0 && f.distance.y <= 0 && Ot$1({
      groupElement: i.element,
      hitRegion: f.hitRegion.rect,
      pointerEventTarget: e.target
    }) && n.push(f.hitRegion);
  }), n;
}
function Tt$1(e, t) {
  if (e.length !== t.length)
    return false;
  for (let n = 0; n < e.length; n++)
    if (e[n] != t[n])
      return false;
  return true;
}
function I(e, t, n = 0) {
  return Math.abs(O(e) - O(t)) <= n;
}
function A$1(e, t) {
  return I(e, t) ? 0 : e > t ? 1 : -1;
}
function Z$1({
  overrideDisabledPanels: e,
  panelConstraints: t,
  prevSize: n,
  size: o
}) {
  const {
    collapsedSize: i = 0,
    collapsible: r,
    disabled: f,
    maxSize: a = 100,
    minSize: s = 0
  } = t;
  if (f && !e)
    return n;
  if (A$1(o, s) < 0)
    if (r) {
      const l = (i + s) / 2;
      A$1(o, l) < 0 ? o = i : o = s;
    } else
      o = s;
  return o = Math.min(a, o), o = O(o), o;
}
function le$1({
  delta: e,
  initialLayout: t,
  panelConstraints: n,
  pivotIndices: o,
  prevLayout: i,
  trigger: r
}) {
  if (I(e, 0))
    return t;
  const f = r === "imperative-api", a = Object.values(t), s = Object.values(i), l = [...a], [u, h] = o;
  C$1(u != null, "Invalid first pivot index"), C$1(h != null, "Invalid second pivot index");
  let d = 0;
  switch (r) {
    case "keyboard": {
      {
        const c = e < 0 ? h : u, p = n[c];
        C$1(
          p,
          `Panel constraints not found for index ${c}`
        );
        const {
          collapsedSize: m = 0,
          collapsible: v,
          minSize: b = 0
        } = p;
        if (v) {
          const y = a[c];
          if (C$1(
            y != null,
            `Previous layout not found for panel index ${c}`
          ), I(y, m)) {
            const g = b - y;
            A$1(g, Math.abs(e)) > 0 && (e = e < 0 ? 0 - g : g);
          }
        }
      }
      {
        const c = e < 0 ? u : h, p = n[c];
        C$1(
          p,
          `No panel constraints found for index ${c}`
        );
        const {
          collapsedSize: m = 0,
          collapsible: v,
          minSize: b = 0
        } = p;
        if (v) {
          const y = a[c];
          if (C$1(
            y != null,
            `Previous layout not found for panel index ${c}`
          ), I(y, b)) {
            const g = y - m;
            A$1(g, Math.abs(e)) > 0 && (e = e < 0 ? 0 - g : g);
          }
        }
      }
      break;
    }
    default: {
      const c = e < 0 ? h : u, p = n[c];
      C$1(
        p,
        `Panel constraints not found for index ${c}`
      );
      const m = a[c], { collapsible: v, collapsedSize: b, minSize: y } = p;
      if (v && A$1(m, y) < 0)
        if (e > 0) {
          const g = y - b, P = g / 2, M = m + e;
          A$1(M, y) < 0 && (e = A$1(e, P) <= 0 ? 0 : g);
        } else {
          const g = y - b, P = 100 - g / 2, M = m - e;
          A$1(M, y) < 0 && (e = A$1(100 + e, P) > 0 ? 0 : -g);
        }
      break;
    }
  }
  {
    const c = e < 0 ? 1 : -1;
    let p = e < 0 ? h : u, m = 0;
    for (; ; ) {
      const b = a[p];
      C$1(
        b != null,
        `Previous layout not found for panel index ${p}`
      );
      const g = Z$1({
        overrideDisabledPanels: f,
        panelConstraints: n[p],
        prevSize: b,
        size: 100
      }) - b;
      if (m += g, p += c, p < 0 || p >= n.length)
        break;
    }
    const v = Math.min(Math.abs(e), Math.abs(m));
    e = e < 0 ? 0 - v : v;
  }
  {
    let p = e < 0 ? u : h;
    for (; p >= 0 && p < n.length; ) {
      const m = Math.abs(e) - Math.abs(d), v = a[p];
      C$1(
        v != null,
        `Previous layout not found for panel index ${p}`
      );
      const b = v - m, y = Z$1({
        overrideDisabledPanels: f,
        panelConstraints: n[p],
        prevSize: v,
        size: b
      });
      if (!I(v, y) && (d += v - y, l[p] = y, d.toFixed(3).localeCompare(Math.abs(e).toFixed(3), void 0, {
        numeric: true
      }) >= 0))
        break;
      e < 0 ? p-- : p++;
    }
  }
  if (Tt$1(s, l))
    return i;
  {
    const c = e < 0 ? h : u, p = a[c];
    C$1(
      p != null,
      `Previous layout not found for panel index ${c}`
    );
    const m = p + d, v = Z$1({
      overrideDisabledPanels: f,
      panelConstraints: n[c],
      prevSize: p,
      size: m
    });
    if (l[c] = v, !I(v, m)) {
      let b = m - v, g = e < 0 ? h : u;
      for (; g >= 0 && g < n.length; ) {
        const P = l[g];
        C$1(
          P != null,
          `Previous layout not found for panel index ${g}`
        );
        const M = P + b, w = Z$1({
          overrideDisabledPanels: f,
          panelConstraints: n[g],
          prevSize: P,
          size: M
        });
        if (I(P, w) || (b -= w - P, l[g] = w), I(b, 0))
          break;
        e > 0 ? g-- : g++;
      }
    }
  }
  const S = Object.values(l).reduce(
    (c, p) => p + c,
    0
  );
  if (!I(S, 100, 0.1))
    return i;
  const z = Object.keys(i);
  return l.reduce((c, p, m) => (c[z[m]] = p, c), {});
}
function W$1(e, t) {
  if (Object.keys(e).length !== Object.keys(t).length)
    return false;
  for (const n in e)
    if (t[n] === void 0 || A$1(e[n], t[n]) !== 0)
      return false;
  return true;
}
function U$1({
  layout: e,
  panelConstraints: t
}) {
  const n = Object.values(e), o = [...n], i = o.reduce(
    (a, s) => a + s,
    0
  );
  if (o.length !== t.length)
    throw Error(
      `Invalid ${t.length} panel layout: ${o.map((a) => `${a}%`).join(", ")}`
    );
  if (!I(i, 100) && o.length > 0)
    for (let a = 0; a < t.length; a++) {
      const s = o[a];
      C$1(s != null, `No layout data found for index ${a}`);
      const l = 100 / i * s;
      o[a] = l;
    }
  let r = 0;
  for (let a = 0; a < t.length; a++) {
    const s = n[a];
    C$1(s != null, `No layout data found for index ${a}`);
    const l = o[a];
    C$1(l != null, `No layout data found for index ${a}`);
    const u = Z$1({
      overrideDisabledPanels: true,
      panelConstraints: t[a],
      prevSize: s,
      size: l
    });
    l != u && (r += l - u, o[a] = u);
  }
  if (!I(r, 0))
    for (let a = 0; a < t.length; a++) {
      const s = o[a];
      C$1(s != null, `No layout data found for index ${a}`);
      const l = s + r, u = Z$1({
        overrideDisabledPanels: true,
        panelConstraints: t[a],
        prevSize: s,
        size: l
      });
      if (s !== u && (r -= u - s, o[a] = u, I(r, 0)))
        break;
    }
  const f = Object.keys(e);
  return o.reduce((a, s, l) => (a[f[l]] = s, a), {});
}
function tt$1({
  groupId: e,
  panelId: t
}) {
  const n = () => {
    const s = X$1();
    for (const [
      l,
      {
        defaultLayoutDeferred: u,
        derivedPanelConstraints: h,
        layout: d,
        groupSize: S,
        separatorToPanels: z
      }
    ] of s)
      if (l.id === e)
        return {
          defaultLayoutDeferred: u,
          derivedPanelConstraints: h,
          group: l,
          groupSize: S,
          layout: d,
          separatorToPanels: z
        };
    throw Error(`Group ${e} not found`);
  }, o = () => {
    const s = n().derivedPanelConstraints.find(
      (l) => l.panelId === t
    );
    if (s !== void 0)
      return s;
    throw Error(`Panel constraints not found for Panel ${t}`);
  }, i = () => {
    const s = n().group.panels.find((l) => l.id === t);
    if (s !== void 0)
      return s;
    throw Error(`Layout not found for Panel ${t}`);
  }, r = () => {
    const s = n().layout[t];
    if (s !== void 0)
      return s;
    throw Error(`Layout not found for Panel ${t}`);
  }, f = ({
    nextSize: s,
    panels: l,
    prevLayout: u,
    derivedPanelConstraints: h
  }) => {
    const d = r(), S = l.findIndex((m) => m.id === t), z = S === 0, c = S === l.length - 1;
    if (c && s < d && (z || l.slice(0, S).every((m, v) => {
      const b = h[v];
      return b?.collapsible && I(b.collapsedSize, u[b.panelId]);
    }))) {
      const m = l.slice(0, S).reduce((v, b) => v + u[b.id], 0);
      return {
        ...u,
        [t]: O(100 - m)
      };
    }
    return le$1({
      delta: c ? d - s : s - d,
      initialLayout: u,
      panelConstraints: h,
      pivotIndices: c ? [S - 1, S] : [S, S + 1],
      prevLayout: u,
      trigger: "imperative-api"
    });
  }, a = (s) => {
    const l = r();
    if (s === l)
      return;
    const {
      defaultLayoutDeferred: u,
      derivedPanelConstraints: h,
      group: d,
      groupSize: S,
      layout: z,
      separatorToPanels: c
    } = n(), p = f({
      nextSize: s,
      panels: d.panels,
      prevLayout: z,
      derivedPanelConstraints: h
    }), m = U$1({
      layout: p,
      panelConstraints: h
    });
    W$1(z, m) || $$1(d, {
      defaultLayoutDeferred: u,
      derivedPanelConstraints: h,
      groupSize: S,
      layout: m,
      separatorToPanels: c
    });
  };
  return {
    collapse: () => {
      const { collapsible: s, collapsedSize: l } = o(), { mutableValues: u } = i(), h = r();
      s && h !== l && (u.expandToSize = h, a(l));
    },
    expand: () => {
      const { collapsible: s, collapsedSize: l, minSize: u } = o(), { mutableValues: h } = i(), d = r();
      if (s && d === l) {
        let S = h.expandToSize ?? u;
        S === 0 && (S = 1), a(S);
      }
    },
    getSize: () => {
      const { group: s } = n(), l = r(), { element: u } = i(), h = s.orientation === "horizontal" ? u.offsetWidth : u.offsetHeight;
      return {
        asPercentage: l,
        inPixels: h
      };
    },
    isCollapsed: () => {
      const { collapsible: s, collapsedSize: l } = o(), u = r();
      return s && I(l, u);
    },
    resize: (s) => {
      const { group: l } = n(), { element: u } = i(), h = ne$1({ group: l }), d = ie$1({
        groupSize: h,
        panelElement: u,
        styleProp: s
      }), S = O(d / h * 100);
      a(S);
    }
  };
}
function Te$1(e) {
  if (e.defaultPrevented)
    return;
  const t = X$1();
  xe$1(e, t).forEach((o) => {
    if (o.separator && !o.separator.disableDoubleClick) {
      const i = o.panels.find(
        (r) => r.panelConstraints.defaultSize !== void 0
      );
      if (i) {
        const r = i.panelConstraints.defaultSize, f = tt$1({
          groupId: o.group.id,
          panelId: i.id
        });
        f && r !== void 0 && (f.resize(r), e.preventDefault());
      }
    }
  });
}
function pe$1(e) {
  const t = X$1();
  for (const [n] of t)
    if (n.separators.some(
      (o) => o.element === e
    ))
      return n;
  throw Error("Could not find parent Group for separator element");
}
function nt$1({
  groupId: e
}) {
  const t = () => {
    const n = X$1();
    for (const [o, i] of n)
      if (o.id === e)
        return { group: o, ...i };
    throw Error(`Could not find Group with id "${e}"`);
  };
  return {
    getLayout() {
      const { defaultLayoutDeferred: n, layout: o } = t();
      return n ? {} : o;
    },
    setLayout(n) {
      const {
        defaultLayoutDeferred: o,
        derivedPanelConstraints: i,
        group: r,
        groupSize: f,
        layout: a,
        separatorToPanels: s
      } = t(), l = U$1({
        layout: n,
        panelConstraints: i
      });
      return o ? a : (W$1(a, l) || $$1(r, {
        defaultLayoutDeferred: o,
        derivedPanelConstraints: i,
        groupSize: f,
        layout: l,
        separatorToPanels: s
      }), l);
    }
  };
}
function B$1(e, t) {
  const n = pe$1(e), o = H$1(n.id, true), i = n.separators.find(
    (h) => h.element === e
  );
  C$1(i, "Matching separator not found");
  const r = o.separatorToPanels.get(i);
  C$1(r, "Matching panels not found");
  const f = r.map((h) => n.panels.indexOf(h)), s = nt$1({ groupId: n.id }).getLayout(), l = le$1({
    delta: t,
    initialLayout: s,
    panelConstraints: o.derivedPanelConstraints,
    pivotIndices: f,
    prevLayout: s,
    trigger: "keyboard"
  }), u = U$1({
    layout: l,
    panelConstraints: o.derivedPanelConstraints
  });
  W$1(s, u) || $$1(n, {
    defaultLayoutDeferred: o.defaultLayoutDeferred,
    derivedPanelConstraints: o.derivedPanelConstraints,
    groupSize: o.groupSize,
    layout: u,
    separatorToPanels: o.separatorToPanels
  });
}
function Ge$1(e) {
  if (e.defaultPrevented)
    return;
  const t = e.currentTarget, n = pe$1(t);
  if (!n.disabled)
    switch (e.key) {
      case "ArrowDown": {
        e.preventDefault(), n.orientation === "vertical" && B$1(t, 5);
        break;
      }
      case "ArrowLeft": {
        e.preventDefault(), n.orientation === "horizontal" && B$1(t, -5);
        break;
      }
      case "ArrowRight": {
        e.preventDefault(), n.orientation === "horizontal" && B$1(t, 5);
        break;
      }
      case "ArrowUp": {
        e.preventDefault(), n.orientation === "vertical" && B$1(t, -5);
        break;
      }
      case "End": {
        e.preventDefault(), B$1(t, 100);
        break;
      }
      case "Enter": {
        e.preventDefault();
        const o = pe$1(t), i = H$1(o.id, true), { derivedPanelConstraints: r, layout: f, separatorToPanels: a } = i, s = o.separators.find(
          (d) => d.element === t
        );
        C$1(s, "Matching separator not found");
        const l = a.get(s);
        C$1(l, "Matching panels not found");
        const u = l[0], h = r.find(
          (d) => d.panelId === u.id
        );
        if (C$1(h, "Panel metadata not found"), h.collapsible) {
          const d = f[u.id], S = h.collapsedSize === d ? o.mutableState.expandedPanelSizes[u.id] ?? h.minSize : h.collapsedSize;
          B$1(t, S - d);
        }
        break;
      }
      case "F6": {
        e.preventDefault();
        const i = pe$1(t).separators.map(
          (s) => s.element
        ), r = Array.from(i).findIndex(
          (s) => s === e.currentTarget
        );
        C$1(r !== null, "Index not found");
        const f = e.shiftKey ? r > 0 ? r - 1 : i.length - 1 : r + 1 < i.length ? r + 1 : 0;
        i[f].focus({
          preventScroll: true
        });
        break;
      }
      case "Home": {
        e.preventDefault(), B$1(t, -100);
        break;
      }
    }
}
let ee$1 = {
  cursorFlags: 0,
  state: "inactive"
};
const Pe$1 = new Ze$1();
function K$1() {
  return ee$1;
}
function Gt$1(e) {
  return Pe$1.addListener("change", e);
}
function At$1(e) {
  const t = ee$1, n = { ...ee$1 };
  n.cursorFlags = e, ee$1 = n, Pe$1.emit("change", {
    prev: t,
    next: n
  });
}
function te$1(e) {
  const t = ee$1;
  ee$1 = e, Pe$1.emit("change", {
    prev: t,
    next: e
  });
}
function Ae$1(e) {
  if (e.defaultPrevented)
    return;
  if (e.pointerType === "mouse" && e.button > 0)
    return;
  const t = X$1(), n = xe$1(e, t), o = /* @__PURE__ */ new Map();
  let i = false;
  n.forEach((r) => {
    r.separator && (i || (i = true, r.separator.element.focus({
      // @ts-expect-error https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/focus#browser_compatibility
      focusVisible: false,
      preventScroll: true
    })));
    const f = t.get(r.group);
    f && o.set(r.group, f.layout);
  }), te$1({
    cursorFlags: 0,
    hitRegions: n,
    initialLayoutMap: o,
    pointerDownAtPoint: { x: e.clientX, y: e.clientY },
    state: "active"
  }), n.length && e.preventDefault();
}
const Ft$1 = (e) => e, ye$1 = () => {
}, ot$1 = 1, it$1 = 2, rt$1 = 4, st$1 = 8, Fe$1 = 3, Ne$1 = 12;
let de$1;
function _e$1() {
  return de$1 === void 0 && (de$1 = false, typeof window < "u" && (window.navigator.userAgent.includes("Chrome") || window.navigator.userAgent.includes("Firefox")) && (de$1 = true)), de$1;
}
function Nt$1({
  cursorFlags: e,
  groups: t,
  state: n
}) {
  let o = 0, i = 0;
  switch (n) {
    case "active":
    case "hover":
      t.forEach((r) => {
        if (!r.mutableState.disableCursor)
          switch (r.orientation) {
            case "horizontal": {
              o++;
              break;
            }
            case "vertical": {
              i++;
              break;
            }
          }
      });
  }
  if (!(o === 0 && i === 0)) {
    switch (n) {
      case "active": {
        if (e && _e$1()) {
          const r = (e & ot$1) !== 0, f = (e & it$1) !== 0, a = (e & rt$1) !== 0, s = (e & st$1) !== 0;
          if (r)
            return a ? "se-resize" : s ? "ne-resize" : "e-resize";
          if (f)
            return a ? "sw-resize" : s ? "nw-resize" : "w-resize";
          if (a)
            return "s-resize";
          if (s)
            return "n-resize";
        }
        break;
      }
    }
    return _e$1() ? o > 0 && i > 0 ? "move" : o > 0 ? "ew-resize" : "ns-resize" : o > 0 && i > 0 ? "grab" : o > 0 ? "col-resize" : "row-resize";
  }
}
const $e$1 = /* @__PURE__ */ new WeakMap();
function we$1(e) {
  if (e.defaultView === null || e.defaultView === void 0)
    return;
  let { prevStyle: t, styleSheet: n } = $e$1.get(e) ?? {};
  n === void 0 && (n = new e.defaultView.CSSStyleSheet(), e.adoptedStyleSheets && (Object.isExtensible(e.adoptedStyleSheets) ? e.adoptedStyleSheets.push(n) : e.adoptedStyleSheets = [
    ...e.adoptedStyleSheets,
    n
  ]));
  const o = K$1();
  switch (o.state) {
    case "active":
    case "hover": {
      const i = Nt$1({
        cursorFlags: o.cursorFlags,
        groups: o.hitRegions.map((f) => f.group),
        state: o.state
      }), r = `*, *:hover {cursor: ${i} !important; }`;
      if (t === r)
        return;
      t = r, i ? n.cssRules.length === 0 ? n.insertRule(r) : n.replaceSync(r) : n.cssRules.length === 1 && n.deleteRule(0);
      break;
    }
    case "inactive": {
      t = void 0, n.cssRules.length === 1 && n.deleteRule(0);
      break;
    }
  }
  $e$1.set(e, {
    prevStyle: t,
    styleSheet: n
  });
}
function at$1({
  document: e,
  event: t,
  hitRegions: n,
  initialLayoutMap: o,
  mountedGroups: i,
  pointerDownAtPoint: r,
  prevCursorFlags: f
}) {
  let a = 0;
  n.forEach((l) => {
    const { group: u, groupSize: h } = l, { orientation: d, panels: S } = u, { disableCursor: z } = u.mutableState;
    let c = 0;
    r ? d === "horizontal" ? c = (t.clientX - r.x) / h * 100 : c = (t.clientY - r.y) / h * 100 : d === "horizontal" ? c = t.clientX < 0 ? -100 : 100 : c = t.clientY < 0 ? -100 : 100;
    const p = o.get(u), m = i.get(u);
    if (!p || !m)
      return;
    const {
      defaultLayoutDeferred: v,
      derivedPanelConstraints: b,
      groupSize: y,
      layout: g,
      separatorToPanels: P
    } = m;
    if (b && g && P) {
      const M = le$1({
        delta: c,
        initialLayout: p,
        panelConstraints: b,
        pivotIndices: l.panels.map((w) => S.indexOf(w)),
        prevLayout: g,
        trigger: "mouse-or-touch"
      });
      if (W$1(M, g)) {
        if (c !== 0 && !z)
          switch (d) {
            case "horizontal": {
              a |= c < 0 ? ot$1 : it$1;
              break;
            }
            case "vertical": {
              a |= c < 0 ? rt$1 : st$1;
              break;
            }
          }
      } else
        $$1(l.group, {
          defaultLayoutDeferred: v,
          derivedPanelConstraints: b,
          groupSize: y,
          layout: M,
          separatorToPanels: P
        });
    }
  });
  let s = 0;
  t.movementX === 0 ? s |= f & Fe$1 : s |= a & Fe$1, t.movementY === 0 ? s |= f & Ne$1 : s |= a & Ne$1, At$1(s), we$1(e);
}
function je$1(e) {
  const t = X$1(), n = K$1();
  switch (n.state) {
    case "active":
      at$1({
        document: e.currentTarget,
        event: e,
        hitRegions: n.hitRegions,
        initialLayoutMap: n.initialLayoutMap,
        mountedGroups: t,
        prevCursorFlags: n.cursorFlags
      });
  }
}
function He$1(e) {
  if (e.defaultPrevented)
    return;
  const t = K$1(), n = X$1();
  switch (t.state) {
    case "active": {
      if (
        // Skip this check for "pointerleave" events, else Firefox triggers a false positive (see #514)
        e.buttons === 0
      ) {
        te$1({
          cursorFlags: 0,
          state: "inactive"
        }), t.hitRegions.forEach((o) => {
          const i = H$1(o.group.id, true);
          $$1(o.group, i);
        });
        return;
      }
      for (const o of t.hitRegions)
        if (o.separator) {
          const { element: i } = o.separator;
          i.hasPointerCapture?.(e.pointerId) || i.setPointerCapture?.(e.pointerId);
        }
      at$1({
        document: e.currentTarget,
        event: e,
        hitRegions: t.hitRegions,
        initialLayoutMap: t.initialLayoutMap,
        mountedGroups: n,
        pointerDownAtPoint: t.pointerDownAtPoint,
        prevCursorFlags: t.cursorFlags
      });
      break;
    }
    default: {
      const o = xe$1(e, n);
      o.length === 0 ? t.state !== "inactive" && te$1({
        cursorFlags: 0,
        state: "inactive"
      }) : te$1({
        cursorFlags: 0,
        hitRegions: o,
        state: "hover"
      }), we$1(e.currentTarget);
      break;
    }
  }
}
function Ve$1(e) {
  if (e.relatedTarget instanceof HTMLIFrameElement)
    switch (K$1().state) {
      case "hover":
        te$1({
          cursorFlags: 0,
          state: "inactive"
        });
    }
}
function Be$1(e) {
  if (e.defaultPrevented)
    return;
  if (e.pointerType === "mouse" && e.button > 0)
    return;
  const t = K$1();
  switch (t.state) {
    case "active":
      te$1({
        cursorFlags: 0,
        state: "inactive"
      }), t.hitRegions.length > 0 && (we$1(e.currentTarget), t.hitRegions.forEach((n) => {
        const o = H$1(n.group.id, true);
        $$1(n.group, o);
      }), e.preventDefault());
  }
}
function We$1(e) {
  let t = 0, n = 0;
  const o = {};
  for (const r of e)
    if (r.defaultSize !== void 0) {
      t++;
      const f = O(r.defaultSize);
      n += f, o[r.panelId] = f;
    } else
      o[r.panelId] = void 0;
  const i = e.length - t;
  if (i !== 0) {
    const r = O((100 - n) / i);
    for (const f of e)
      f.defaultSize === void 0 && (o[f.panelId] = r);
  }
  return o;
}
function _t$1(e, t, n) {
  if (!n[0])
    return;
  const i = e.panels.find((l) => l.element === t);
  if (!i || !i.onResize)
    return;
  const r = ne$1({ group: e }), f = e.orientation === "horizontal" ? i.element.offsetWidth : i.element.offsetHeight, a = i.mutableValues.prevSize, s = {
    asPercentage: O(f / r * 100),
    inPixels: f
  };
  i.mutableValues.prevSize = s, i.onResize(s, i.id, a);
}
function $t$1(e, t) {
  if (Object.keys(e).length !== Object.keys(t).length)
    return false;
  for (const o in e)
    if (e[o] !== t[o])
      return false;
  return true;
}
function jt$1({
  group: e,
  nextGroupSize: t,
  prevGroupSize: n,
  prevLayout: o
}) {
  if (n <= 0 || t <= 0 || n === t)
    return o;
  let i = 0, r = 0, f = false;
  const a = /* @__PURE__ */ new Map(), s = [];
  for (const h of e.panels) {
    const d = o[h.id] ?? 0;
    switch (h.panelConstraints.groupResizeBehavior) {
      case "preserve-pixel-size": {
        f = true;
        const S = d / 100 * n, z = O(
          S / t * 100
        );
        a.set(h.id, z), i += z;
        break;
      }
      case "preserve-relative-size":
      default: {
        s.push(h.id), r += d;
        break;
      }
    }
  }
  if (!f || s.length === 0)
    return o;
  const l = 100 - i, u = { ...o };
  if (a.forEach((h, d) => {
    u[d] = h;
  }), r > 0)
    for (const h of s) {
      const d = o[h] ?? 0;
      u[h] = O(
        d / r * l
      );
    }
  else {
    const h = O(
      l / s.length
    );
    for (const d of s)
      u[d] = h;
  }
  return u;
}
function Ht$1(e, t) {
  const n = e.map((i) => i.id), o = Object.keys(t);
  if (n.length !== o.length)
    return false;
  for (const i of n)
    if (!o.includes(i))
      return false;
  return true;
}
const J$1 = /* @__PURE__ */ new Map();
function Vt$1(e) {
  let t = true;
  C$1(
    e.element.ownerDocument.defaultView,
    "Cannot register an unmounted Group"
  );
  const n = e.element.ownerDocument.defaultView.ResizeObserver, o = /* @__PURE__ */ new Set(), i = /* @__PURE__ */ new Set(), r = new n((c) => {
    for (const p of c) {
      const { borderBoxSize: m, target: v } = p;
      if (v === e.element) {
        if (t) {
          const b = ne$1({ group: e });
          if (b === 0)
            return;
          const y = H$1(e.id);
          if (!y)
            return;
          const g = ve$1(e), P = y.defaultLayoutDeferred ? We$1(g) : y.layout, M = jt$1({
            group: e,
            nextGroupSize: b,
            prevGroupSize: y.groupSize,
            prevLayout: P
          }), w = U$1({
            layout: M,
            panelConstraints: g
          });
          if (!y.defaultLayoutDeferred && W$1(y.layout, w) && $t$1(
            y.derivedPanelConstraints,
            g
          ) && y.groupSize === b)
            return;
          $$1(e, {
            defaultLayoutDeferred: false,
            derivedPanelConstraints: g,
            groupSize: b,
            layout: w,
            separatorToPanels: y.separatorToPanels
          });
        }
      } else
        _t$1(e, v, m);
    }
  });
  r.observe(e.element), e.panels.forEach((c) => {
    C$1(
      !o.has(c.id),
      `Panel ids must be unique; id "${c.id}" was used more than once`
    ), o.add(c.id), c.onResize && r.observe(c.element);
  });
  const f = ne$1({ group: e }), a = ve$1(e), s = e.panels.map(({ id: c }) => c).join(",");
  let l = e.mutableState.defaultLayout;
  l && (Ht$1(e.panels, l) || (l = void 0));
  const u = e.mutableState.layouts[s] ?? l ?? We$1(a), h = U$1({
    layout: u,
    panelConstraints: a
  }), d = e.element.ownerDocument;
  J$1.set(
    d,
    (J$1.get(d) ?? 0) + 1
  );
  const S = /* @__PURE__ */ new Map();
  return Je$1(e).forEach((c) => {
    c.separator && S.set(c.separator, c.panels);
  }), $$1(e, {
    defaultLayoutDeferred: f === 0,
    derivedPanelConstraints: a,
    groupSize: f,
    layout: h,
    separatorToPanels: S
  }), e.separators.forEach((c) => {
    C$1(
      !i.has(c.id),
      `Separator ids must be unique; id "${c.id}" was used more than once`
    ), i.add(c.id), c.element.addEventListener("keydown", Ge$1);
  }), J$1.get(d) === 1 && (d.addEventListener("dblclick", Te$1, true), d.addEventListener("pointerdown", Ae$1, true), d.addEventListener("pointerleave", je$1), d.addEventListener("pointermove", He$1), d.addEventListener("pointerout", Ve$1), d.addEventListener("pointerup", Be$1, true)), function() {
    t = false, J$1.set(
      d,
      Math.max(0, (J$1.get(d) ?? 0) - 1)
    ), Lt$1(e), e.separators.forEach((p) => {
      p.element.removeEventListener("keydown", Ge$1);
    }), J$1.get(d) || (d.removeEventListener(
      "dblclick",
      Te$1,
      true
    ), d.removeEventListener(
      "pointerdown",
      Ae$1,
      true
    ), d.removeEventListener("pointerleave", je$1), d.removeEventListener("pointermove", He$1), d.removeEventListener("pointerout", Ve$1), d.removeEventListener("pointerup", Be$1, true)), r.disconnect();
  };
}
function Bt$1() {
  const [e, t] = reactExports.useState({}), n = reactExports.useCallback(() => t({}), []);
  return [e, n];
}
function Le$1(e) {
  const t = reactExports.useId();
  return `${e ?? t}`;
}
const q$1 = typeof window < "u" ? reactExports.useLayoutEffect : reactExports.useEffect;
function se$1(e) {
  const t = reactExports.useRef(e);
  return q$1(() => {
    t.current = e;
  }, [e]), reactExports.useCallback(
    (...n) => t.current?.(...n),
    [t]
  );
}
function Ce$1(...e) {
  return se$1((t) => {
    e.forEach((n) => {
      if (n)
        switch (typeof n) {
          case "function": {
            n(t);
            break;
          }
          case "object": {
            n.current = t;
            break;
          }
        }
    });
  });
}
function Re$1(e) {
  const t = reactExports.useRef({ ...e });
  return q$1(() => {
    for (const n in e)
      t.current[n] = e[n];
  }, [e]), t.current;
}
const lt$1 = reactExports.createContext(null);
function Wt$1(e, t) {
  const n = reactExports.useRef({
    getLayout: () => ({}),
    setLayout: Ft$1
  });
  reactExports.useImperativeHandle(t, () => n.current, []), q$1(() => {
    Object.assign(
      n.current,
      nt$1({ groupId: e })
    );
  });
}
function Ut$1({
  children: e,
  className: t,
  defaultLayout: n,
  disableCursor: o,
  disabled: i,
  elementRef: r,
  groupRef: f,
  id: a,
  onLayoutChange: s,
  onLayoutChanged: l,
  orientation: u = "horizontal",
  resizeTargetMinimumSize: h = {
    coarse: 20,
    fine: 10
  },
  style: d,
  ...S
}) {
  const z = reactExports.useRef({
    onLayoutChange: {},
    onLayoutChanged: {}
  }), c = se$1((x) => {
    W$1(z.current.onLayoutChange, x) || (z.current.onLayoutChange = x, s?.(x));
  }), p = se$1((x) => {
    W$1(z.current.onLayoutChanged, x) || (z.current.onLayoutChanged = x, l?.(x));
  }), m = Le$1(a), v = reactExports.useRef(null), [b, y] = Bt$1(), g = reactExports.useRef({
    lastExpandedPanelSizes: {},
    layouts: {},
    panels: [],
    resizeTargetMinimumSize: h,
    separators: []
  }), P = Ce$1(v, r);
  Wt$1(m, f);
  const M = se$1(
    (x, L) => {
      const k = K$1(), R = ke$1(x), E = H$1(x);
      if (E) {
        let D2 = false;
        switch (k.state) {
          case "active": {
            D2 = k.hitRegions.some(
              (V) => V.group === R
            );
            break;
          }
        }
        return {
          flexGrow: E.layout[L] ?? 1,
          pointerEvents: D2 ? "none" : void 0
        };
      }
      if (n?.[L])
        return {
          flexGrow: n?.[L]
        };
    }
  ), w = Re$1({
    defaultLayout: n,
    disableCursor: o
  }), G = reactExports.useMemo(
    () => ({
      get disableCursor() {
        return !!w.disableCursor;
      },
      getPanelStyles: M,
      id: m,
      orientation: u,
      registerPanel: (x) => {
        const L = g.current;
        return L.panels = be$1(u, [
          ...L.panels,
          x
        ]), y(), () => {
          L.panels = L.panels.filter(
            (k) => k !== x
          ), y();
        };
      },
      registerSeparator: (x) => {
        const L = g.current;
        return L.separators = be$1(u, [
          ...L.separators,
          x
        ]), y(), () => {
          L.separators = L.separators.filter(
            (k) => k !== x
          ), y();
        };
      },
      updatePanelProps: (x, { disabled: L }) => {
        const R = g.current.panels.find(
          (V) => V.id === x
        );
        R && (R.panelConstraints.disabled = L);
        const E = ke$1(m), D2 = H$1(m);
        E && D2 && $$1(E, {
          ...D2,
          derivedPanelConstraints: ve$1(E)
        });
      },
      updateSeparatorProps: (x, {
        disabled: L,
        disableDoubleClick: k
      }) => {
        const E = g.current.separators.find(
          (D2) => D2.id === x
        );
        E && (E.disabled = L, E.disableDoubleClick = k);
      }
    }),
    [M, m, y, u, w]
  ), N = reactExports.useRef(null);
  return q$1(() => {
    const x = v.current;
    if (x === null)
      return;
    const L = g.current;
    let k;
    if (w.defaultLayout !== void 0 && Object.keys(w.defaultLayout).length === L.panels.length) {
      k = {};
      for (const j of L.panels) {
        const Y = w.defaultLayout[j.id];
        Y !== void 0 && (k[j.id] = Y);
      }
    }
    const R = {
      disabled: !!i,
      element: x,
      id: m,
      mutableState: {
        defaultLayout: k,
        disableCursor: !!w.disableCursor,
        expandedPanelSizes: g.current.lastExpandedPanelSizes,
        layouts: g.current.layouts
      },
      orientation: u,
      panels: L.panels,
      resizeTargetMinimumSize: L.resizeTargetMinimumSize,
      separators: L.separators
    };
    N.current = R;
    const E = Vt$1(R), { defaultLayoutDeferred: D2, derivedPanelConstraints: V, layout: ue } = H$1(R.id, true);
    !D2 && V.length > 0 && (c(ue), p(ue));
    const oe = ze$1(m, (j) => {
      const { defaultLayoutDeferred: Y, derivedPanelConstraints: Ee, layout: ce } = j.next;
      if (Y || Ee.length === 0)
        return;
      const ut = R.panels.map(({ id: _ }) => _).join(",");
      R.mutableState.layouts[ut] = ce, Ee.forEach((_) => {
        if (_.collapsible) {
          const { layout: ge } = j.prev ?? {};
          if (ge) {
            const ft = I(
              _.collapsedSize,
              ce[_.panelId]
            ), dt = I(
              _.collapsedSize,
              ge[_.panelId]
            );
            ft && !dt && (R.mutableState.expandedPanelSizes[_.panelId] = ge[_.panelId]);
          }
        }
      });
      const ct = K$1().state !== "active";
      c(ce), ct && p(ce);
    });
    return () => {
      N.current = null, E(), oe();
    };
  }, [
    i,
    m,
    p,
    c,
    u,
    b,
    w
  ]), reactExports.useEffect(() => {
    const x = N.current;
    x && (x.mutableState.defaultLayout = n, x.mutableState.disableCursor = !!o);
  }), /* @__PURE__ */ jsxRuntimeExports.jsx(lt$1.Provider, { value: G, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      ...S,
      className: t,
      "data-group": true,
      "data-testid": m,
      id: m,
      ref: P,
      style: {
        height: "100%",
        width: "100%",
        overflow: "hidden",
        ...d,
        display: "flex",
        flexDirection: u === "horizontal" ? "row" : "column",
        flexWrap: "nowrap",
        // Inform the browser that the library is handling touch events for this element
        // but still allow users to scroll content within panels in the non-resizing direction
        // NOTE This is not an inherited style
        // See github.com/bvaughn/react-resizable-panels/issues/662
        touchAction: u === "horizontal" ? "pan-y" : "pan-x"
      },
      children: e
    }
  ) });
}
Ut$1.displayName = "Group";
function Me$1() {
  const e = reactExports.useContext(lt$1);
  return C$1(
    e,
    "Group Context not found; did you render a Panel or Separator outside of a Group?"
  ), e;
}
function qt$1(e, t) {
  const { id: n } = Me$1(), o = reactExports.useRef({
    collapse: ye$1,
    expand: ye$1,
    getSize: () => ({
      asPercentage: 0,
      inPixels: 0
    }),
    isCollapsed: () => false,
    resize: ye$1
  });
  reactExports.useImperativeHandle(t, () => o.current, []), q$1(() => {
    Object.assign(
      o.current,
      tt$1({ groupId: n, panelId: e })
    );
  });
}
function Yt$1({
  children: e,
  className: t,
  collapsedSize: n = "0%",
  collapsible: o = false,
  defaultSize: i,
  disabled: r,
  elementRef: f,
  groupResizeBehavior: a = "preserve-relative-size",
  id: s,
  maxSize: l = "100%",
  minSize: u = "0%",
  onResize: h,
  panelRef: d,
  style: S,
  ...z
}) {
  const c = !!s, p = Le$1(s), m = Re$1({
    disabled: r
  }), v = reactExports.useRef(null), b = Ce$1(v, f), {
    getPanelStyles: y,
    id: g,
    orientation: P,
    registerPanel: M,
    updatePanelProps: w
  } = Me$1(), G = h !== null, N = se$1(
    (R, E, D2) => {
      h?.(R, s, D2);
    }
  );
  q$1(() => {
    const R = v.current;
    if (R !== null) {
      const E = {
        element: R,
        id: p,
        idIsStable: c,
        mutableValues: {
          expandToSize: void 0,
          prevSize: void 0
        },
        onResize: G ? N : void 0,
        panelConstraints: {
          groupResizeBehavior: a,
          collapsedSize: n,
          collapsible: o,
          defaultSize: i,
          disabled: m.disabled,
          maxSize: l,
          minSize: u
        }
      };
      return M(E);
    }
  }, [
    a,
    n,
    o,
    i,
    G,
    p,
    c,
    l,
    u,
    N,
    M,
    m
  ]), reactExports.useEffect(() => {
    w(p, { disabled: r });
  }, [r, p, w]), qt$1(p, d);
  const x = () => {
    const R = y(g, p);
    if (R)
      return JSON.stringify(R);
  }, L = reactExports.useSyncExternalStore(
    (R) => ze$1(g, R),
    x,
    x
  );
  let k;
  return L ? k = JSON.parse(L) : i !== void 0 ? k = {
    flexGrow: void 0,
    flexShrink: void 0,
    flexBasis: i
  } : k = { flexGrow: 1 }, /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      ...z,
      "data-disabled": r || void 0,
      "data-panel": true,
      "data-testid": p,
      id: p,
      ref: b,
      style: {
        ...Jt$1,
        display: "flex",
        flexBasis: 0,
        flexShrink: 1,
        overflow: "visible",
        ...k
      },
      children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          className: t,
          style: {
            maxHeight: "100%",
            maxWidth: "100%",
            flexGrow: 1,
            overflow: "auto",
            ...S,
            // Inform the browser that the library is handling touch events for this element
            // but still allow users to scroll content within panels in the non-resizing direction
            // NOTE This is not an inherited style
            // See github.com/bvaughn/react-resizable-panels/issues/662
            touchAction: P === "horizontal" ? "pan-y" : "pan-x"
          },
          children: e
        }
      )
    }
  );
}
Yt$1.displayName = "Panel";
const Jt$1 = {
  minHeight: 0,
  maxHeight: "100%",
  height: "auto",
  minWidth: 0,
  maxWidth: "100%",
  width: "auto",
  border: "none",
  borderWidth: 0,
  padding: 0,
  margin: 0
};
function Zt$1({
  layout: e,
  panelConstraints: t,
  panelId: n,
  panelIndex: o
}) {
  let i, r;
  const f = e[n], a = t.find(
    (s) => s.panelId === n
  );
  if (a) {
    const s = a.maxSize, l = a.collapsible ? a.collapsedSize : a.minSize, u = [o, o + 1];
    r = U$1({
      layout: le$1({
        delta: l - f,
        initialLayout: e,
        panelConstraints: t,
        pivotIndices: u,
        prevLayout: e
      }),
      panelConstraints: t
    })[n], i = U$1({
      layout: le$1({
        delta: s - f,
        initialLayout: e,
        panelConstraints: t,
        pivotIndices: u,
        prevLayout: e
      }),
      panelConstraints: t
    })[n];
  }
  return {
    valueControls: n,
    valueMax: i,
    valueMin: r,
    valueNow: f
  };
}
function Qt$1({
  children: e,
  className: t,
  disabled: n,
  disableDoubleClick: o,
  elementRef: i,
  id: r,
  style: f,
  ...a
}) {
  const s = Le$1(r), l = Re$1({
    disabled: n,
    disableDoubleClick: o
  }), [u, h] = reactExports.useState({}), [d, S] = reactExports.useState("inactive"), [z, c] = reactExports.useState(false), p = reactExports.useRef(null), m = Ce$1(p, i), {
    disableCursor: v,
    id: b,
    orientation: y,
    registerSeparator: g,
    updateSeparatorProps: P
  } = Me$1(), M = y === "horizontal" ? "vertical" : "horizontal";
  q$1(() => {
    const N = p.current;
    if (N !== null) {
      const x = {
        disabled: l.disabled,
        disableDoubleClick: l.disableDoubleClick,
        element: N,
        id: s
      }, L = g(x), k = Gt$1(
        (E) => {
          S(
            E.next.state !== "inactive" && E.next.hitRegions.some(
              (D2) => D2.separator === x
            ) ? E.next.state : "inactive"
          );
        }
      ), R = ze$1(
        b,
        (E) => {
          const { derivedPanelConstraints: D2, layout: V, separatorToPanels: ue } = E.next, oe = ue.get(x);
          if (oe) {
            const j = oe[0], Y = oe.indexOf(j);
            h(
              Zt$1({
                layout: V,
                panelConstraints: D2,
                panelId: j.id,
                panelIndex: Y
              })
            );
          }
        }
      );
      return () => {
        k(), R(), L();
      };
    }
  }, [b, s, g, l]), reactExports.useEffect(() => {
    P(s, { disabled: n, disableDoubleClick: o });
  }, [n, o, s, P]);
  let w;
  n && !v && (w = "not-allowed");
  let G;
  if (n)
    G = "disabled";
  else
    switch (d) {
      case "active": {
        G = "active";
        break;
      }
      default:
        z ? G = "focus" : G = d;
    }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      ...a,
      "aria-controls": u.valueControls,
      "aria-disabled": n || void 0,
      "aria-orientation": M,
      "aria-valuemax": u.valueMax,
      "aria-valuemin": u.valueMin,
      "aria-valuenow": u.valueNow,
      children: e,
      className: t,
      "data-separator": G,
      "data-testid": s,
      id: s,
      onBlur: () => c(false),
      onFocus: () => c(true),
      ref: m,
      role: "separator",
      style: {
        flexBasis: "auto",
        cursor: w,
        ...f,
        flexGrow: 0,
        flexShrink: 0,
        // Inform the browser that the library is handling touch events for this element
        // See github.com/bvaughn/react-resizable-panels/issues/662
        touchAction: "none"
      },
      tabIndex: n ? void 0 : 0
    }
  );
}
Qt$1.displayName = "Separator";
var reactDomExports = requireReactDom();
const STORAGE_KEY = "logwatcher_filter_history";
const MAX_ENTRIES = 50;
function useFilterHistory() {
  const getHistory = reactExports.useCallback(() => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]");
    } catch {
      return [];
    }
  }, []);
  const addEntry = reactExports.useCallback((pattern) => {
    if (!pattern.trim()) return;
    const current = getHistory().filter((p) => p !== pattern);
    const next = [pattern, ...current].slice(0, MAX_ENTRIES);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  }, [getHistory]);
  const clear = reactExports.useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
  }, []);
  return { getHistory, addEntry, clear };
}
function argbToCss(argb) {
  if (argb === void 0 || argb === 0 || argb === -1) return void 0;
  const rgb = argb & 16777215;
  return `#${rgb.toString(16).padStart(6, "0")}`;
}
function getRuleColor(rule, theme) {
  const defaultBack = "var(--surface-strong)";
  if (theme === "dark") {
    const back2 = argbToCss(rule.darkBackColorArgb ?? rule.backColorArgb);
    return {
      foreColor: argbToCss(rule.darkForeColorArgb ?? rule.foreColorArgb),
      backColor: back2 ?? defaultBack
    };
  }
  const back = argbToCss(rule.lightBackColorArgb ?? rule.backColorArgb);
  return {
    foreColor: argbToCss(rule.lightForeColorArgb ?? rule.foreColorArgb),
    backColor: back ?? defaultBack
  };
}
function useHighlighting(primaryRules, fallbackRules = []) {
  const theme = useUiStore((state) => state.theme);
  const sortedPrimaryRules = reactExports.useMemo(
    () => [...primaryRules].sort((a, b) => {
      if (a.hightPriority !== b.hightPriority) return a.hightPriority ? -1 : 1;
      return a.order - b.order;
    }),
    [primaryRules]
  );
  const sortedFallbackRules = reactExports.useMemo(
    () => [...fallbackRules].sort((a, b) => {
      if (a.hightPriority !== b.hightPriority) return a.hightPriority ? -1 : 1;
      return a.order - b.order;
    }),
    [fallbackRules]
  );
  const highlightLine = reactExports.useMemo(() => (text) => {
    if (!text) return [{ text }];
    const tryMatch = (rules) => {
      for (const rule of rules) {
        if (!rule.text) continue;
        let match = false;
        try {
          if (rule.isRegex) {
            const flags = rule.caseSensitive ? "" : "i";
            match = new RegExp(rule.text, flags).test(text);
          } else {
            match = rule.caseSensitive ? text.includes(rule.text) : text.toLowerCase().includes(rule.text.toLowerCase());
          }
        } catch {
          continue;
        }
        if (match) {
          const colors = getRuleColor(rule, theme);
          return [{
            text,
            foreColor: colors.foreColor,
            backColor: colors.backColor,
            bold: rule.bold
          }];
        }
      }
      return null;
    };
    const primaryMatch = tryMatch(sortedPrimaryRules);
    if (primaryMatch) return primaryMatch;
    const fallbackMatch = tryMatch(sortedFallbackRules);
    if (fallbackMatch) return fallbackMatch;
    return [{ text }];
  }, [sortedPrimaryRules, sortedFallbackRules, theme]);
  return { highlightLine };
}
function MainToolbar({
  hub,
  onOpenPreferences,
  onFilterApplied,
  pendingPattern,
  pendingApplyRequest,
  onPendingPatternConsumed,
  onPendingApplyRequestConsumed
}) {
  const { tabs, activeSessionId, updateTab, setActive } = useTabStore();
  const { setSelectedLine, getSelectedLine, getLine, clearBuffer } = useLogStore();
  const profiles = usePreferencesStore((state) => state.profiles);
  const defaultHighlights = usePreferencesStore((state) => state.defaultHighlights);
  const { addEntry } = useFilterHistory();
  const processedApplyRequestRef = reactExports.useRef(null);
  const activeTab = tabs.find((t) => t.sessionId === activeSessionId);
  const activeProfile = reactExports.useMemo(
    () => profiles.find((profile) => profile.name === activeTab?.activeProfileName),
    [profiles, activeTab?.activeProfileName]
  );
  const activeStoredFilter = reactExports.useMemo(
    () => activeProfile?.dicoStoredFilter.find((filter) => filter.name === activeTab?.activeStoredFilterName),
    [activeProfile, activeTab?.activeStoredFilterName]
  );
  const tailMode = activeTab?.tailMode ?? true;
  const selectedLine = activeSessionId ? getSelectedLine(activeSessionId) : null;
  const activeHighlightRules = activeProfile?.dicoHighLighting ?? [];
  const { highlightLine } = useHighlighting(activeHighlightRules, defaultHighlights);
  const [pattern, setPattern] = reactExports.useState("");
  const [isFiltering, setIsFiltering] = reactExports.useState(false);
  const [contextModal, setContextModal] = reactExports.useState(null);
  const buildId = __APP_BUILD__;
  reactExports.useEffect(() => {
    setPattern("");
    setIsFiltering(false);
  }, [activeSessionId]);
  reactExports.useEffect(() => {
    if (activeStoredFilter) {
      setPattern(activeStoredFilter.filter ?? "");
    }
  }, [activeStoredFilter]);
  reactExports.useEffect(() => {
    if (pendingPattern) {
      setPattern(pendingPattern);
      onPendingPatternConsumed?.();
    }
  }, [pendingPattern, onPendingPatternConsumed]);
  reactExports.useEffect(() => {
    if (!pendingApplyRequest || !activeSessionId) return;
    if (processedApplyRequestRef.current === pendingApplyRequest.id) return;
    processedApplyRequestRef.current = pendingApplyRequest.id;
    const applyFromHistory = async () => {
      const nextPattern = pendingApplyRequest.pattern.trim();
      setPattern(pendingApplyRequest.pattern);
      if (!nextPattern) return;
      const filter = {
        pattern: nextPattern,
        isRegex: true,
        caseSensitive: false,
        hiddenLines: (activeProfile?.dicoHiddenLog ?? []).map((h) => ({
          text: h.text,
          isRegex: h.isRegex,
          caseSensitive: h.caseSensitive,
          isActive: h.isActif
        }))
      };
      setIsFiltering(true);
      clearBuffer(activeSessionId);
      updateTab(activeSessionId, { totalLines: 0 });
      try {
        addEntry(nextPattern);
        await hub.invoke("SetFilter", activeSessionId, filter);
        clearBuffer(activeSessionId);
        updateTab(activeSessionId, {
          isFiltered: true,
          filterPattern: nextPattern,
          filterIsRegex: true,
          filterCaseSensitive: false
        });
        onFilterApplied?.();
      } finally {
        setIsFiltering(false);
      }
    };
    void applyFromHistory();
    onPendingApplyRequestConsumed?.();
  }, [pendingApplyRequest, activeSessionId, activeProfile, clearBuffer, updateTab, addEntry, hub, onFilterApplied, onPendingApplyRequestConsumed]);
  reactExports.useEffect(() => {
    if (!contextModal) return;
    const onKeyDown = (event) => {
      if (event.key === "Escape") setContextModal(null);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [contextModal]);
  const applyStoredFilterNow = reactExports.useCallback(async (storedFilterName) => {
    if (!activeSessionId || !activeProfile) return;
    const selectedFilter = activeProfile.dicoStoredFilter.find((filter2) => filter2.name === storedFilterName);
    setPattern(selectedFilter?.filter ?? "");
    clearBuffer(activeSessionId);
    updateTab(activeSessionId, { totalLines: 0 });
    if (!selectedFilter?.filter?.trim()) {
      await hub.invoke("ClearFilter", activeSessionId);
      clearBuffer(activeSessionId);
      updateTab(activeSessionId, {
        isFiltered: false,
        activeStoredFilterName: void 0,
        filterPattern: void 0,
        filterIsRegex: void 0,
        filterCaseSensitive: void 0
      });
      return;
    }
    const filter = {
      pattern: selectedFilter.filter,
      isRegex: selectedFilter.isRegex,
      caseSensitive: selectedFilter.caseSensitive,
      hiddenLines: (activeProfile.dicoHiddenLog ?? []).map((h) => ({
        text: h.text,
        isRegex: h.isRegex,
        caseSensitive: h.caseSensitive,
        isActive: h.isActif
      }))
    };
    setIsFiltering(true);
    try {
      addEntry(selectedFilter.filter.trim());
      await hub.invoke("SetFilter", activeSessionId, filter);
      clearBuffer(activeSessionId);
      updateTab(activeSessionId, {
        isFiltered: true,
        filterPattern: selectedFilter.filter,
        filterIsRegex: selectedFilter.isRegex,
        filterCaseSensitive: selectedFilter.caseSensitive
      });
      onFilterApplied?.();
    } finally {
      setIsFiltering(false);
    }
  }, [hub, activeSessionId, activeProfile, clearBuffer, updateTab, addEntry, onFilterApplied]);
  const applyFilter = reactExports.useCallback(async () => {
    if (!activeSessionId) return;
    if (!pattern.trim()) {
      clearBuffer(activeSessionId);
      updateTab(activeSessionId, { totalLines: 0 });
      await hub.invoke("ClearFilter", activeSessionId);
      clearBuffer(activeSessionId);
      updateTab(activeSessionId, {
        isFiltered: false,
        activeStoredFilterName: void 0,
        filterPattern: void 0,
        filterIsRegex: void 0,
        filterCaseSensitive: void 0
      });
      return;
    }
    const filterPayload = activeStoredFilter ? {
      pattern: activeStoredFilter.filter,
      isRegex: activeStoredFilter.isRegex,
      caseSensitive: activeStoredFilter.caseSensitive
    } : {
      pattern: pattern.trim(),
      isRegex: true,
      caseSensitive: false
    };
    setIsFiltering(true);
    addEntry(filterPayload.pattern.trim());
    const filter = {
      ...filterPayload,
      hiddenLines: (activeProfile?.dicoHiddenLog ?? []).map((h) => ({
        text: h.text,
        isRegex: h.isRegex,
        caseSensitive: h.caseSensitive,
        isActive: h.isActif
      }))
    };
    clearBuffer(activeSessionId);
    updateTab(activeSessionId, { totalLines: 0 });
    await hub.invoke("SetFilter", activeSessionId, filter);
    clearBuffer(activeSessionId);
    updateTab(activeSessionId, {
      isFiltered: true,
      filterPattern: filterPayload.pattern,
      filterIsRegex: filterPayload.isRegex,
      filterCaseSensitive: filterPayload.caseSensitive
    });
    setIsFiltering(false);
    onFilterApplied?.();
  }, [hub, activeSessionId, pattern, updateTab, addEntry, onFilterApplied, activeStoredFilter, activeProfile, clearBuffer]);
  const clearFilter = reactExports.useCallback(async () => {
    if (!activeSessionId) return;
    setPattern("");
    clearBuffer(activeSessionId);
    updateTab(activeSessionId, { totalLines: 0 });
    await hub.invoke("ClearFilter", activeSessionId);
    clearBuffer(activeSessionId);
    updateTab(activeSessionId, {
      isFiltered: false,
      activeStoredFilterName: void 0,
      filterPattern: void 0,
      filterIsRegex: void 0,
      filterCaseSensitive: void 0
    });
  }, [hub, activeSessionId, updateTab, clearBuffer]);
  const toggleTail = reactExports.useCallback(async () => {
    if (!activeSessionId) return;
    const next = !tailMode;
    await hub.invoke("SetTail", activeSessionId, next);
    updateTab(activeSessionId, { tailMode: next });
  }, [hub, activeSessionId, tailMode, updateTab]);
  const showContext = reactExports.useCallback(async () => {
    if (!activeSessionId || !activeTab) return;
    const selected = useLogStore.getState().getSelectedLine(activeSessionId);
    if (!selected) return;
    const context = await hub.invoke("GetContextLines", activeSessionId, selected.lineNumber, 70);
    setContextModal({
      lines: context.lines ?? [],
      targetLineNumber: context.targetLineNumber
    });
  }, [hub, activeSessionId, activeTab]);
  const openLineInNewTab = reactExports.useCallback(async () => {
    if (!activeSessionId || !activeTab) return;
    const selected = useLogStore.getState().getSelectedLine(activeSessionId);
    if (!selected) return;
    const profile = profiles.find((p) => p.name === activeTab.activeProfileName);
    const nextSessionId = `${activeTab.serverId}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    const contextStart = Math.max(0, selected.lineNumber - 50);
    const contextEnd = Math.min(activeTab.totalLines - 1, selected.lineNumber + 50);
    const contextCount = Math.max(1, contextEnd - contextStart + 1);
    updateTab(activeSessionId, { tailMode: false });
    await hub.invoke("SetTail", activeSessionId, false);
    useTabStore.getState().addTab({
      sessionId: nextSessionId,
      serverId: activeTab.serverId,
      filePath: activeTab.filePath,
      displayName: `${activeTab.displayName} [${contextStart + 1}..${contextEnd + 1}]`,
      serverName: activeTab.serverName,
      totalLines: contextCount,
      sizeBytes: 0,
      isIndexed: false,
      newLinesCount: 0,
      tailMode: false,
      isFiltered: activeTab.isFiltered,
      filterPattern: activeTab.filterPattern,
      filterIsRegex: activeTab.filterIsRegex,
      filterCaseSensitive: activeTab.filterCaseSensitive,
      contextStartLine: contextStart,
      contextTotalLines: contextCount,
      activeProfileName: activeTab.activeProfileName,
      activeStoredFilterName: void 0
    });
    try {
      await startLogHub();
      await hub.invoke("OpenLog", nextSessionId, activeTab.serverId, activeTab.filePath, {
        loadFromEnd: true,
        initialLines: 500,
        profileName: profile?.name,
        encoding: profile?.encoding
      });
      if (profile?.name) {
        await hub.invoke("SetProfile", nextSessionId, profile.name);
      }
      if (activeTab.isFiltered && activeTab.filterPattern) {
        await hub.invoke("SetFilter", nextSessionId, {
          pattern: activeTab.filterPattern,
          isRegex: activeTab.filterIsRegex ?? true,
          caseSensitive: activeTab.filterCaseSensitive ?? false,
          hiddenLines: (profile?.dicoHiddenLog ?? []).map((h) => ({
            text: h.text,
            isRegex: h.isRegex,
            caseSensitive: h.caseSensitive,
            isActive: h.isActif
          }))
        });
      }
      await hub.invoke("SetTail", nextSessionId, false);
      await hub.invoke("RequestLines", nextSessionId, contextStart, contextCount);
      useTabStore.getState().updateTab(nextSessionId, { totalLines: contextCount });
      setSelectedLine(nextSessionId, { lineNumber: selected.lineNumber, text: selected.text });
      setActive(nextSessionId);
    } catch {
      useTabStore.getState().removeTab(nextSessionId);
    }
  }, [hub, activeSessionId, activeTab, profiles, updateTab, setSelectedLine, setActive]);
  const searchNext = reactExports.useCallback(async () => {
    if (!activeTab || !activeSessionId) return;
    const query = pattern.trim();
    if (!query) return;
    const caseSensitive = activeStoredFilter?.caseSensitive ?? false;
    const isRegex = activeStoredFilter?.isRegex ?? true;
    let regex = null;
    if (isRegex) {
      try {
        regex = new RegExp(query, caseSensitive ? "" : "i");
      } catch {
        return;
      }
    }
    const currentLine = useLogStore.getState().getSelectedLine(activeSessionId)?.lineNumber ?? -1;
    const totalLines = activeTab.totalLines;
    if (totalLines <= 0) return;
    const isMatch = (line) => {
      if (isRegex && regex) return regex.test(line);
      return caseSensitive ? line.includes(query) : line.toLowerCase().includes(query.toLowerCase());
    };
    const scanOrder = [];
    for (let i = currentLine + 1; i < totalLines; i++) scanOrder.push(i);
    for (let i = 0; i <= currentLine; i++) scanOrder.push(i);
    const requestedChunks = /* @__PURE__ */ new Set();
    for (const lineNumber of scanOrder) {
      const chunkStart = Math.floor(lineNumber / 300) * 300;
      if (!requestedChunks.has(chunkStart)) {
        requestedChunks.add(chunkStart);
        const chunkCount = Math.min(300, totalLines - chunkStart);
        try {
          await hub.invoke("RequestLines", activeSessionId, chunkStart, chunkCount);
        } catch {
          break;
        }
      }
      const line = getLine(activeSessionId, lineNumber);
      if (line !== void 0 && isMatch(line)) {
        setSelectedLine(activeSessionId, { lineNumber, text: line });
        setActive(activeSessionId);
        return;
      }
    }
  }, [activeTab, activeSessionId, pattern, activeStoredFilter, hub, getLine, setSelectedLine, setActive]);
  reactExports.useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === "F3") {
        event.preventDefault();
        void searchNext();
        return;
      }
      if (event.key === "F8" && activeTab?.isFiltered) {
        event.preventDefault();
        void clearFilter();
        return;
      }
      if (event.ctrlKey && (event.key === "r" || event.key === "R")) {
        event.preventDefault();
        void showContext();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [searchNext, clearFilter, showContext, activeTab?.isFiltered]);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { className: "chrome-bar", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "chrome-brand", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "brand-title", children: "LogWatcher Web" }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "chrome-controls", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "toolbar-filter-cluster", children: [
        activeTab && /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "select",
          {
            className: "control-input toolbar-profile-select",
            value: activeTab.activeProfileName ?? "",
            onChange: async (event) => {
              if (!activeSessionId) return;
              const nextProfileName = event.target.value || void 0;
              updateTab(activeSessionId, {
                activeProfileName: nextProfileName,
                activeStoredFilterName: void 0
              });
              setPattern("");
              clearBuffer(activeSessionId);
              updateTab(activeSessionId, { totalLines: 0 });
              await hub.invoke("ClearFilter", activeSessionId);
              clearBuffer(activeSessionId);
              updateTab(activeSessionId, {
                isFiltered: false,
                filterPattern: void 0,
                filterIsRegex: void 0,
                filterCaseSensitive: void 0
              });
              try {
                await hub.invoke("SetProfile", activeSessionId, nextProfileName ?? "");
              } catch {
              }
            },
            title: "Profile",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "", children: "Default profile" }),
              profiles.map((profile) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: profile.name, children: profile.name }, profile.name))
            ]
          }
        ),
        activeProfile && /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "select",
          {
            className: "control-input toolbar-stored-select",
            value: activeTab?.activeStoredFilterName ?? "",
            onChange: async (event) => {
              if (!activeSessionId) return;
              const nextFilterName = event.target.value || void 0;
              updateTab(activeSessionId, { activeStoredFilterName: nextFilterName });
              await applyStoredFilterNow(nextFilterName);
            },
            title: "Stored filters",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "", children: "Stored filter" }),
              activeProfile.dicoStoredFilter.map((filter) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: filter.name, children: filter.name }, filter.name))
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            className: "control-input toolbar-filter-input",
            placeholder: activeTab ? "Regex filter…" : "Open a log to enable filtering",
            value: pattern,
            disabled: !activeTab,
            onChange: (e) => setPattern(e.target.value),
            onKeyDown: (e) => e.key === "Enter" && applyFilter()
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            onClick: applyFilter,
            disabled: isFiltering || !activeTab,
            className: "control-button control-button--ghost toolbar-action-button",
            title: "Apply filter (Enter)",
            children: isFiltering ? "…" : "✓"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            onClick: searchNext,
            disabled: !activeTab || !pattern.trim(),
            className: "control-button control-button--ghost toolbar-action-button",
            title: "Find next (F3)",
            children: "⌕"
          }
        ),
        activeTab?.isFiltered && /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: clearFilter, className: "control-button control-button--ghost toolbar-action-button", title: "Clear filter (F8)", children: "⌫" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "toolbar-status-cluster", children: [
        activeTab && /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: showContext, className: "control-button control-button--ghost toolbar-action-button", title: "Show context (Ctrl+R)", children: "☰" }),
        activeTab && /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: openLineInNewTab, disabled: !selectedLine, className: "control-button control-button--ghost toolbar-action-button", title: "Open selected line in new tab", children: "⧉" }),
        activeTab && /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: toggleTail, className: `control-button control-button--ghost toolbar-action-button ${tailMode ? "toolbar-action-button--active" : ""}`, title: tailMode ? "Tail on" : "Tail off", children: tailMode ? "⬇" : "⏸" }),
        activeTab?.errorMessage && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "status-pill status-pill--danger", title: activeTab.errorMessage, children: activeTab.errorMessage }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: onOpenPreferences, className: "control-button control-button--ghost toolbar-action-button", title: "Preferences", children: "⚙" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "build-badge", title: `Frontend build ${buildId}`, children: buildId })
      ] })
    ] }),
    contextModal && reactDomExports.createPortal(
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "context-modal-overlay", onClick: () => setContextModal(null), children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "context-modal", onClick: (event) => event.stopPropagation(), children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "context-modal__header", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "context-modal__title", children: "Context View" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "control-button control-button--ghost context-modal__close", onClick: () => setContextModal(null), children: "×" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "context-modal__body", children: contextModal.lines.map((line) => {
          const isTarget = line.lineNumber === contextModal.targetLineNumber;
          const segments = highlightLine(line.text);
          return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `context-modal__line ${isTarget ? "context-modal__line--target" : ""}`, children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "context-modal__line-text", children: segments.map((seg, index) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            "span",
            {
              style: {
                color: seg.foreColor,
                backgroundColor: seg.backColor,
                fontWeight: seg.bold ? "bold" : void 0
              },
              children: seg.text
            },
            index
          )) }) }, line.lineNumber);
        }) })
      ] }) }),
      document.body
    )
  ] });
}
function gt(e, t) {
  const n = getComputedStyle(e), o = parseFloat(n.fontSize);
  return t * o;
}
function yt(e, t) {
  const n = getComputedStyle(e.ownerDocument.body), o = parseFloat(n.fontSize);
  return t * o;
}
function St(e) {
  return e / 100 * window.innerHeight;
}
function vt(e) {
  return e / 100 * window.innerWidth;
}
function bt(e) {
  switch (typeof e) {
    case "number":
      return [e, "px"];
    case "string": {
      const t = parseFloat(e);
      return e.endsWith("%") ? [t, "%"] : e.endsWith("px") ? [t, "px"] : e.endsWith("rem") ? [t, "rem"] : e.endsWith("em") ? [t, "em"] : e.endsWith("vh") ? [t, "vh"] : e.endsWith("vw") ? [t, "vw"] : [t, "%"];
    }
  }
}
function ie({
  groupSize: e,
  panelElement: t,
  styleProp: n
}) {
  let o;
  const [i, s] = bt(n);
  switch (s) {
    case "%": {
      o = i / 100 * e;
      break;
    }
    case "px": {
      o = i;
      break;
    }
    case "rem": {
      o = yt(t, i);
      break;
    }
    case "em": {
      o = gt(t, i);
      break;
    }
    case "vh": {
      o = St(i);
      break;
    }
    case "vw": {
      o = vt(i);
      break;
    }
  }
  return o;
}
function T(e) {
  return parseFloat(e.toFixed(3));
}
function ne({
  group: e
}) {
  const { orientation: t, panels: n } = e;
  return n.reduce((o, i) => (o += t === "horizontal" ? i.element.offsetWidth : i.element.offsetHeight, o), 0);
}
function ve(e) {
  const { panels: t } = e, n = ne({ group: e });
  return n === 0 ? t.map((o) => ({
    groupResizeBehavior: o.panelConstraints.groupResizeBehavior,
    collapsedSize: 0,
    collapsible: o.panelConstraints.collapsible === true,
    defaultSize: void 0,
    disabled: o.panelConstraints.disabled,
    minSize: 0,
    maxSize: 100,
    panelId: o.id
  })) : t.map((o) => {
    const { element: i, panelConstraints: s } = o;
    let l = 0;
    if (s.collapsedSize !== void 0) {
      const f = ie({
        groupSize: n,
        panelElement: i,
        styleProp: s.collapsedSize
      });
      l = T(f / n * 100);
    }
    let r;
    if (s.defaultSize !== void 0) {
      const f = ie({
        groupSize: n,
        panelElement: i,
        styleProp: s.defaultSize
      });
      r = T(f / n * 100);
    }
    let a = 0;
    if (s.minSize !== void 0) {
      const f = ie({
        groupSize: n,
        panelElement: i,
        styleProp: s.minSize
      });
      a = T(f / n * 100);
    }
    let c = 100;
    if (s.maxSize !== void 0) {
      const f = ie({
        groupSize: n,
        panelElement: i,
        styleProp: s.maxSize
      });
      c = T(f / n * 100);
    }
    return {
      groupResizeBehavior: s.groupResizeBehavior,
      collapsedSize: l,
      collapsible: s.collapsible === true,
      defaultSize: r,
      disabled: s.disabled,
      minSize: a,
      maxSize: c,
      panelId: o.id
    };
  });
}
function C(e, t = "Assertion error") {
  if (!e)
    throw Error(t);
}
function be(e, t) {
  return Array.from(t).sort(
    e === "horizontal" ? zt : xt
  );
}
function zt(e, t) {
  const n = e.element.offsetLeft - t.element.offsetLeft;
  return n !== 0 ? n : e.element.offsetWidth - t.element.offsetWidth;
}
function xt(e, t) {
  const n = e.element.offsetTop - t.element.offsetTop;
  return n !== 0 ? n : e.element.offsetHeight - t.element.offsetHeight;
}
function qe(e) {
  return e !== null && typeof e == "object" && "nodeType" in e && e.nodeType === Node.ELEMENT_NODE;
}
function Ye(e, t) {
  return {
    x: e.x >= t.left && e.x <= t.right ? 0 : Math.min(
      Math.abs(e.x - t.left),
      Math.abs(e.x - t.right)
    ),
    y: e.y >= t.top && e.y <= t.bottom ? 0 : Math.min(
      Math.abs(e.y - t.top),
      Math.abs(e.y - t.bottom)
    )
  };
}
function wt({
  orientation: e,
  rects: t,
  targetRect: n
}) {
  const o = {
    x: n.x + n.width / 2,
    y: n.y + n.height / 2
  };
  let i, s = Number.MAX_VALUE;
  for (const l of t) {
    const { x: r, y: a } = Ye(o, l), c = e === "horizontal" ? r : a;
    c < s && (s = c, i = l);
  }
  return C(i, "No rect found"), i;
}
let fe;
function Pt() {
  return fe === void 0 && (typeof matchMedia == "function" ? fe = !!matchMedia("(pointer:coarse)").matches : fe = false), fe;
}
function Je(e) {
  const { element: t, orientation: n, panels: o, separators: i } = e, s = be(
    n,
    Array.from(t.children).filter(qe).map((x) => ({ element: x }))
  ).map(({ element: x }) => x), l = [];
  let r = false, a = false, c = -1, f = -1, g = 0, d, b = [];
  {
    let x = -1;
    for (const u of s)
      u.hasAttribute("data-panel") && (x++, u.hasAttribute("data-disabled") || (g++, c === -1 && (c = x), f = x));
  }
  if (g > 1) {
    let x = -1;
    for (const u of s)
      if (u.hasAttribute("data-panel")) {
        x++;
        const p = o.find(
          (m) => m.element === u
        );
        if (p) {
          if (d) {
            const m = d.element.getBoundingClientRect(), S = u.getBoundingClientRect();
            let v;
            if (a) {
              const y = n === "horizontal" ? new DOMRect(
                m.right,
                m.top,
                0,
                m.height
              ) : new DOMRect(
                m.left,
                m.bottom,
                m.width,
                0
              ), h = n === "horizontal" ? new DOMRect(S.left, S.top, 0, S.height) : new DOMRect(S.left, S.top, S.width, 0);
              switch (b.length) {
                case 0: {
                  v = [
                    y,
                    h
                  ];
                  break;
                }
                case 1: {
                  const w = b[0], M = wt({
                    orientation: n,
                    rects: [m, S],
                    targetRect: w.element.getBoundingClientRect()
                  });
                  v = [
                    w,
                    M === m ? h : y
                  ];
                  break;
                }
                default: {
                  v = b;
                  break;
                }
              }
            } else
              b.length ? v = b : v = [
                n === "horizontal" ? new DOMRect(
                  m.right,
                  S.top,
                  S.left - m.right,
                  S.height
                ) : new DOMRect(
                  S.left,
                  m.bottom,
                  S.width,
                  S.top - m.bottom
                )
              ];
            for (const y of v) {
              let h = "width" in y ? y : y.element.getBoundingClientRect();
              const w = Pt() ? e.resizeTargetMinimumSize.coarse : e.resizeTargetMinimumSize.fine;
              if (h.width < w) {
                const P = w - h.width;
                h = new DOMRect(
                  h.x - P / 2,
                  h.y,
                  h.width + P,
                  h.height
                );
              }
              if (h.height < w) {
                const P = w - h.height;
                h = new DOMRect(
                  h.x,
                  h.y - P / 2,
                  h.width,
                  h.height + P
                );
              }
              const M = x <= c || x > f;
              !r && !M && l.push({
                group: e,
                groupSize: ne({ group: e }),
                panels: [d, p],
                separator: "width" in y ? void 0 : y,
                rect: h
              }), r = false;
            }
          }
          a = false, d = p, b = [];
        }
      } else if (u.hasAttribute("data-separator")) {
        u.ariaDisabled !== null && (r = true);
        const p = i.find(
          (m) => m.element === u
        );
        p ? b.push(p) : (d = void 0, b = []);
      } else
        a = true;
  }
  return l;
}
class Ze2 {
  #e = {};
  addListener(t, n) {
    const o = this.#e[t];
    return o === void 0 ? this.#e[t] = [n] : o.includes(n) || o.push(n), () => {
      this.removeListener(t, n);
    };
  }
  emit(t, n) {
    const o = this.#e[t];
    if (o !== void 0)
      if (o.length === 1)
        o[0].call(null, n);
      else {
        let i = false, s = null;
        const l = Array.from(o);
        for (let r = 0; r < l.length; r++) {
          const a = l[r];
          try {
            a.call(null, n);
          } catch (c) {
            s === null && (i = true, s = c);
          }
        }
        if (i)
          throw s;
      }
  }
  removeAllListeners() {
    this.#e = {};
  }
  removeListener(t, n) {
    const o = this.#e[t];
    if (o !== void 0) {
      const i = o.indexOf(n);
      i >= 0 && o.splice(i, 1);
    }
  }
}
let F = /* @__PURE__ */ new Map();
const Qe = new Ze2();
function Lt(e) {
  F = new Map(F), F.delete(e);
}
function ke(e, t) {
  for (const [n] of F)
    if (n.id === e)
      return n;
}
function H(e, t) {
  for (const [n, o] of F)
    if (n.id === e)
      return o;
  if (t)
    throw Error(`Could not find data for Group with id ${e}`);
}
function X() {
  return F;
}
function ze(e, t) {
  return Qe.addListener("groupChange", (n) => {
    n.group.id === e && t(n);
  });
}
function $(e, t) {
  const n = F.get(e);
  F = new Map(F), F.set(e, t), Qe.emit("groupChange", {
    group: e,
    prev: n,
    next: t
  });
}
function Ct(e, t, n) {
  let o, i = {
    x: 1 / 0,
    y: 1 / 0
  };
  for (const s of t) {
    const l = Ye(n, s.rect);
    switch (e) {
      case "horizontal": {
        l.x <= i.x && (o = s, i = l);
        break;
      }
      case "vertical": {
        l.y <= i.y && (o = s, i = l);
        break;
      }
    }
  }
  return o ? {
    distance: i,
    hitRegion: o
  } : void 0;
}
function Rt(e) {
  return e !== null && typeof e == "object" && "nodeType" in e && e.nodeType === Node.DOCUMENT_FRAGMENT_NODE;
}
function Mt(e, t) {
  if (e === t) throw new Error("Cannot compare node with itself");
  const n = {
    a: Te(e),
    b: Te(t)
  };
  let o;
  for (; n.a.at(-1) === n.b.at(-1); )
    o = n.a.pop(), n.b.pop();
  C(
    o,
    "Stacking order can only be calculated for elements with a common ancestor"
  );
  const i = {
    a: De(Ie(n.a)),
    b: De(Ie(n.b))
  };
  if (i.a === i.b) {
    const s = o.childNodes, l = {
      a: n.a.at(-1),
      b: n.b.at(-1)
    };
    let r = s.length;
    for (; r--; ) {
      const a = s[r];
      if (a === l.a) return 1;
      if (a === l.b) return -1;
    }
  }
  return Math.sign(i.a - i.b);
}
const Et = /\b(?:position|zIndex|opacity|transform|webkitTransform|mixBlendMode|filter|webkitFilter|isolation)\b/;
function kt(e) {
  const t = getComputedStyle(et(e) ?? e).display;
  return t === "flex" || t === "inline-flex";
}
function It(e) {
  const t = getComputedStyle(e);
  return !!(t.position === "fixed" || t.zIndex !== "auto" && (t.position !== "static" || kt(e)) || +t.opacity < 1 || "transform" in t && t.transform !== "none" || "webkitTransform" in t && t.webkitTransform !== "none" || "mixBlendMode" in t && t.mixBlendMode !== "normal" || "filter" in t && t.filter !== "none" || "webkitFilter" in t && t.webkitFilter !== "none" || "isolation" in t && t.isolation === "isolate" || Et.test(t.willChange) || t.webkitOverflowScrolling === "touch");
}
function Ie(e) {
  let t = e.length;
  for (; t--; ) {
    const n = e[t];
    if (C(n, "Missing node"), It(n)) return n;
  }
  return null;
}
function De(e) {
  return e && Number(getComputedStyle(e).zIndex) || 0;
}
function Te(e) {
  const t = [];
  for (; e; )
    t.push(e), e = et(e);
  return t;
}
function et(e) {
  const { parentNode: t } = e;
  return Rt(t) ? t.host : t;
}
function Dt(e, t) {
  return e.x < t.x + t.width && e.x + e.width > t.x && e.y < t.y + t.height && e.y + e.height > t.y;
}
function Tt({
  groupElement: e,
  hitRegion: t,
  pointerEventTarget: n
}) {
  if (!qe(n) || n.contains(e) || e.contains(n))
    return true;
  if (Mt(n, e) > 0) {
    let o = n;
    for (; o; ) {
      if (o.contains(e))
        return true;
      if (Dt(o.getBoundingClientRect(), t))
        return false;
      o = o.parentElement;
    }
  }
  return true;
}
function xe(e, t) {
  const n = [];
  return t.forEach((o, i) => {
    if (i.disabled)
      return;
    const s = Je(i), l = Ct(i.orientation, s, {
      x: e.clientX,
      y: e.clientY
    });
    l && l.distance.x <= 0 && l.distance.y <= 0 && Tt({
      groupElement: i.element,
      hitRegion: l.hitRegion.rect,
      pointerEventTarget: e.target
    }) && n.push(l.hitRegion);
  }), n;
}
function Ot(e, t) {
  if (e.length !== t.length)
    return false;
  for (let n = 0; n < e.length; n++)
    if (e[n] != t[n])
      return false;
  return true;
}
function D(e, t, n = 0) {
  return Math.abs(T(e) - T(t)) <= n;
}
function A(e, t) {
  return D(e, t) ? 0 : e > t ? 1 : -1;
}
function Z({
  overrideDisabledPanels: e,
  panelConstraints: t,
  prevSize: n,
  size: o
}) {
  const {
    collapsedSize: i = 0,
    collapsible: s,
    disabled: l,
    maxSize: r = 100,
    minSize: a = 0
  } = t;
  if (l && !e)
    return n;
  if (A(o, a) < 0)
    if (s) {
      const c = (i + a) / 2;
      A(o, c) < 0 ? o = i : o = a;
    } else
      o = a;
  return o = Math.min(r, o), o = T(o), o;
}
function le({
  delta: e,
  initialLayout: t,
  panelConstraints: n,
  pivotIndices: o,
  prevLayout: i,
  trigger: s
}) {
  if (D(e, 0))
    return t;
  const l = s === "imperative-api", r = Object.values(t), a = Object.values(i), c = [...r], [f, g] = o;
  C(f != null, "Invalid first pivot index"), C(g != null, "Invalid second pivot index");
  let d = 0;
  switch (s) {
    case "keyboard": {
      {
        const u = e < 0 ? g : f, p = n[u];
        C(
          p,
          `Panel constraints not found for index ${u}`
        );
        const {
          collapsedSize: m = 0,
          collapsible: S,
          minSize: v = 0
        } = p;
        if (S) {
          const y = r[u];
          if (C(
            y != null,
            `Previous layout not found for panel index ${u}`
          ), D(y, m)) {
            const h = v - y;
            A(h, Math.abs(e)) > 0 && (e = e < 0 ? 0 - h : h);
          }
        }
      }
      {
        const u = e < 0 ? f : g, p = n[u];
        C(
          p,
          `No panel constraints found for index ${u}`
        );
        const {
          collapsedSize: m = 0,
          collapsible: S,
          minSize: v = 0
        } = p;
        if (S) {
          const y = r[u];
          if (C(
            y != null,
            `Previous layout not found for panel index ${u}`
          ), D(y, v)) {
            const h = y - m;
            A(h, Math.abs(e)) > 0 && (e = e < 0 ? 0 - h : h);
          }
        }
      }
      break;
    }
    default: {
      const u = e < 0 ? g : f, p = n[u];
      C(
        p,
        `Panel constraints not found for index ${u}`
      );
      const m = r[u], { collapsible: S, collapsedSize: v, minSize: y } = p;
      if (S && A(m, y) < 0)
        if (e > 0) {
          const h = y - v, w = h / 2, M = m + e;
          A(M, y) < 0 && (e = A(e, w) <= 0 ? 0 : h);
        } else {
          const h = y - v, w = 100 - h / 2, M = m - e;
          A(M, y) < 0 && (e = A(100 + e, w) > 0 ? 0 : -h);
        }
      break;
    }
  }
  {
    const u = e < 0 ? 1 : -1;
    let p = e < 0 ? g : f, m = 0;
    for (; ; ) {
      const v = r[p];
      C(
        v != null,
        `Previous layout not found for panel index ${p}`
      );
      const h = Z({
        overrideDisabledPanels: l,
        panelConstraints: n[p],
        prevSize: v,
        size: 100
      }) - v;
      if (m += h, p += u, p < 0 || p >= n.length)
        break;
    }
    const S = Math.min(Math.abs(e), Math.abs(m));
    e = e < 0 ? 0 - S : S;
  }
  {
    let p = e < 0 ? f : g;
    for (; p >= 0 && p < n.length; ) {
      const m = Math.abs(e) - Math.abs(d), S = r[p];
      C(
        S != null,
        `Previous layout not found for panel index ${p}`
      );
      const v = S - m, y = Z({
        overrideDisabledPanels: l,
        panelConstraints: n[p],
        prevSize: S,
        size: v
      });
      if (!D(S, y) && (d += S - y, c[p] = y, d.toFixed(3).localeCompare(Math.abs(e).toFixed(3), void 0, {
        numeric: true
      }) >= 0))
        break;
      e < 0 ? p-- : p++;
    }
  }
  if (Ot(a, c))
    return i;
  {
    const u = e < 0 ? g : f, p = r[u];
    C(
      p != null,
      `Previous layout not found for panel index ${u}`
    );
    const m = p + d, S = Z({
      overrideDisabledPanels: l,
      panelConstraints: n[u],
      prevSize: p,
      size: m
    });
    if (c[u] = S, !D(S, m)) {
      let v = m - S, h = e < 0 ? g : f;
      for (; h >= 0 && h < n.length; ) {
        const w = c[h];
        C(
          w != null,
          `Previous layout not found for panel index ${h}`
        );
        const M = w + v, P = Z({
          overrideDisabledPanels: l,
          panelConstraints: n[h],
          prevSize: w,
          size: M
        });
        if (D(w, P) || (v -= P - w, c[h] = P), D(v, 0))
          break;
        e > 0 ? h-- : h++;
      }
    }
  }
  const b = Object.values(c).reduce(
    (u, p) => p + u,
    0
  );
  if (!D(b, 100, 0.1))
    return i;
  const x = Object.keys(i);
  return c.reduce((u, p, m) => (u[x[m]] = p, u), {});
}
function W(e, t) {
  if (Object.keys(e).length !== Object.keys(t).length)
    return false;
  for (const n in e)
    if (t[n] === void 0 || A(e[n], t[n]) !== 0)
      return false;
  return true;
}
function U({
  layout: e,
  panelConstraints: t
}) {
  const n = Object.values(e), o = [...n], i = o.reduce(
    (r, a) => r + a,
    0
  );
  if (o.length !== t.length)
    throw Error(
      `Invalid ${t.length} panel layout: ${o.map((r) => `${r}%`).join(", ")}`
    );
  if (!D(i, 100) && o.length > 0)
    for (let r = 0; r < t.length; r++) {
      const a = o[r];
      C(a != null, `No layout data found for index ${r}`);
      const c = 100 / i * a;
      o[r] = c;
    }
  let s = 0;
  for (let r = 0; r < t.length; r++) {
    const a = n[r];
    C(a != null, `No layout data found for index ${r}`);
    const c = o[r];
    C(c != null, `No layout data found for index ${r}`);
    const f = Z({
      overrideDisabledPanels: true,
      panelConstraints: t[r],
      prevSize: a,
      size: c
    });
    c != f && (s += c - f, o[r] = f);
  }
  if (!D(s, 0))
    for (let r = 0; r < t.length; r++) {
      const a = o[r];
      C(a != null, `No layout data found for index ${r}`);
      const c = a + s, f = Z({
        overrideDisabledPanels: true,
        panelConstraints: t[r],
        prevSize: a,
        size: c
      });
      if (a !== f && (s -= f - a, o[r] = f, D(s, 0)))
        break;
    }
  const l = Object.keys(e);
  return o.reduce((r, a, c) => (r[l[c]] = a, r), {});
}
function tt({
  groupId: e,
  panelId: t
}) {
  const n = () => {
    const r = X();
    for (const [
      a,
      {
        defaultLayoutDeferred: c,
        derivedPanelConstraints: f,
        layout: g,
        groupSize: d,
        separatorToPanels: b
      }
    ] of r)
      if (a.id === e)
        return {
          defaultLayoutDeferred: c,
          derivedPanelConstraints: f,
          group: a,
          groupSize: d,
          layout: g,
          separatorToPanels: b
        };
    throw Error(`Group ${e} not found`);
  }, o = () => {
    const r = n().derivedPanelConstraints.find(
      (a) => a.panelId === t
    );
    if (r !== void 0)
      return r;
    throw Error(`Panel constraints not found for Panel ${t}`);
  }, i = () => {
    const r = n().group.panels.find((a) => a.id === t);
    if (r !== void 0)
      return r;
    throw Error(`Layout not found for Panel ${t}`);
  }, s = () => {
    const r = n().layout[t];
    if (r !== void 0)
      return r;
    throw Error(`Layout not found for Panel ${t}`);
  }, l = (r) => {
    const a = s();
    if (r === a)
      return;
    const {
      defaultLayoutDeferred: c,
      derivedPanelConstraints: f,
      group: g,
      groupSize: d,
      layout: b,
      separatorToPanels: x
    } = n(), u = g.panels.findIndex((v) => v.id === t), p = u === g.panels.length - 1, m = le({
      delta: p ? a - r : r - a,
      initialLayout: b,
      panelConstraints: f,
      pivotIndices: p ? [u - 1, u] : [u, u + 1],
      prevLayout: b,
      trigger: "imperative-api"
    }), S = U({
      layout: m,
      panelConstraints: f
    });
    W(b, S) || $(g, {
      defaultLayoutDeferred: c,
      derivedPanelConstraints: f,
      groupSize: d,
      layout: S,
      separatorToPanels: x
    });
  };
  return {
    collapse: () => {
      const { collapsible: r, collapsedSize: a } = o(), { mutableValues: c } = i(), f = s();
      r && f !== a && (c.expandToSize = f, l(a));
    },
    expand: () => {
      const { collapsible: r, collapsedSize: a, minSize: c } = o(), { mutableValues: f } = i(), g = s();
      if (r && g === a) {
        let d = f.expandToSize ?? c;
        d === 0 && (d = 1), l(d);
      }
    },
    getSize: () => {
      const { group: r } = n(), a = s(), { element: c } = i(), f = r.orientation === "horizontal" ? c.offsetWidth : c.offsetHeight;
      return {
        asPercentage: a,
        inPixels: f
      };
    },
    isCollapsed: () => {
      const { collapsible: r, collapsedSize: a } = o(), c = s();
      return r && D(a, c);
    },
    resize: (r) => {
      const { group: a } = n(), { element: c } = i(), f = ne({ group: a }), g = ie({
        groupSize: f,
        panelElement: c,
        styleProp: r
      }), d = T(g / f * 100);
      l(d);
    }
  };
}
function Oe(e) {
  if (e.defaultPrevented)
    return;
  const t = X();
  xe(e, t).forEach((o) => {
    if (o.separator && !o.separator.disableDoubleClick) {
      const i = o.panels.find(
        (s) => s.panelConstraints.defaultSize !== void 0
      );
      if (i) {
        const s = i.panelConstraints.defaultSize, l = tt({
          groupId: o.group.id,
          panelId: i.id
        });
        l && s !== void 0 && (l.resize(s), e.preventDefault());
      }
    }
  });
}
function pe(e) {
  const t = X();
  for (const [n] of t)
    if (n.separators.some(
      (o) => o.element === e
    ))
      return n;
  throw Error("Could not find parent Group for separator element");
}
function nt({
  groupId: e
}) {
  const t = () => {
    const n = X();
    for (const [o, i] of n)
      if (o.id === e)
        return { group: o, ...i };
    throw Error(`Could not find Group with id "${e}"`);
  };
  return {
    getLayout() {
      const { defaultLayoutDeferred: n, layout: o } = t();
      return n ? {} : o;
    },
    setLayout(n) {
      const {
        defaultLayoutDeferred: o,
        derivedPanelConstraints: i,
        group: s,
        groupSize: l,
        layout: r,
        separatorToPanels: a
      } = t(), c = U({
        layout: n,
        panelConstraints: i
      });
      return o ? r : (W(r, c) || $(s, {
        defaultLayoutDeferred: o,
        derivedPanelConstraints: i,
        groupSize: l,
        layout: c,
        separatorToPanels: a
      }), c);
    }
  };
}
function B(e, t) {
  const n = pe(e), o = H(n.id, true), i = n.separators.find(
    (g) => g.element === e
  );
  C(i, "Matching separator not found");
  const s = o.separatorToPanels.get(i);
  C(s, "Matching panels not found");
  const l = s.map((g) => n.panels.indexOf(g)), a = nt({ groupId: n.id }).getLayout(), c = le({
    delta: t,
    initialLayout: a,
    panelConstraints: o.derivedPanelConstraints,
    pivotIndices: l,
    prevLayout: a,
    trigger: "keyboard"
  }), f = U({
    layout: c,
    panelConstraints: o.derivedPanelConstraints
  });
  W(a, f) || $(n, {
    defaultLayoutDeferred: o.defaultLayoutDeferred,
    derivedPanelConstraints: o.derivedPanelConstraints,
    groupSize: o.groupSize,
    layout: f,
    separatorToPanels: o.separatorToPanels
  });
}
function Ge(e) {
  if (e.defaultPrevented)
    return;
  const t = e.currentTarget, n = pe(t);
  if (!n.disabled)
    switch (e.key) {
      case "ArrowDown": {
        e.preventDefault(), n.orientation === "vertical" && B(t, 5);
        break;
      }
      case "ArrowLeft": {
        e.preventDefault(), n.orientation === "horizontal" && B(t, -5);
        break;
      }
      case "ArrowRight": {
        e.preventDefault(), n.orientation === "horizontal" && B(t, 5);
        break;
      }
      case "ArrowUp": {
        e.preventDefault(), n.orientation === "vertical" && B(t, -5);
        break;
      }
      case "End": {
        e.preventDefault(), B(t, 100);
        break;
      }
      case "Enter": {
        e.preventDefault();
        const o = pe(t), i = H(o.id, true), { derivedPanelConstraints: s, layout: l, separatorToPanels: r } = i, a = o.separators.find(
          (d) => d.element === t
        );
        C(a, "Matching separator not found");
        const c = r.get(a);
        C(c, "Matching panels not found");
        const f = c[0], g = s.find(
          (d) => d.panelId === f.id
        );
        if (C(g, "Panel metadata not found"), g.collapsible) {
          const d = l[f.id], b = g.collapsedSize === d ? o.mutableState.expandedPanelSizes[f.id] ?? g.minSize : g.collapsedSize;
          B(t, b - d);
        }
        break;
      }
      case "F6": {
        e.preventDefault();
        const i = pe(t).separators.map(
          (a) => a.element
        ), s = Array.from(i).findIndex(
          (a) => a === e.currentTarget
        );
        C(s !== null, "Index not found");
        const l = e.shiftKey ? s > 0 ? s - 1 : i.length - 1 : s + 1 < i.length ? s + 1 : 0;
        i[l].focus({
          preventScroll: true
        });
        break;
      }
      case "Home": {
        e.preventDefault(), B(t, -100);
        break;
      }
    }
}
let ee = {
  cursorFlags: 0,
  state: "inactive"
};
const we = new Ze2();
function K() {
  return ee;
}
function Gt(e) {
  return we.addListener("change", e);
}
function At(e) {
  const t = ee, n = { ...ee };
  n.cursorFlags = e, ee = n, we.emit("change", {
    prev: t,
    next: n
  });
}
function te(e) {
  const t = ee;
  ee = e, we.emit("change", {
    prev: t,
    next: e
  });
}
function Ae(e) {
  if (e.defaultPrevented)
    return;
  if (e.pointerType === "mouse" && e.button > 0)
    return;
  const t = X(), n = xe(e, t), o = /* @__PURE__ */ new Map();
  let i = false;
  n.forEach((s) => {
    s.separator && (i || (i = true, s.separator.element.focus({
      preventScroll: true
    })));
    const l = t.get(s.group);
    l && o.set(s.group, l.layout);
  }), te({
    cursorFlags: 0,
    hitRegions: n,
    initialLayoutMap: o,
    pointerDownAtPoint: { x: e.clientX, y: e.clientY },
    state: "active"
  }), n.length && e.preventDefault();
}
const Ft = (e) => e, ye = () => {
}, ot = 1, it = 2, rt = 4, st = 8, Fe = 3, Ne = 12;
let de;
function _e() {
  return de === void 0 && (de = false, typeof window < "u" && (window.navigator.userAgent.includes("Chrome") || window.navigator.userAgent.includes("Firefox")) && (de = true)), de;
}
function Nt({
  cursorFlags: e,
  groups: t,
  state: n
}) {
  let o = 0, i = 0;
  switch (n) {
    case "active":
    case "hover":
      t.forEach((s) => {
        if (!s.mutableState.disableCursor)
          switch (s.orientation) {
            case "horizontal": {
              o++;
              break;
            }
            case "vertical": {
              i++;
              break;
            }
          }
      });
  }
  if (!(o === 0 && i === 0)) {
    switch (n) {
      case "active": {
        if (e && _e()) {
          const s = (e & ot) !== 0, l = (e & it) !== 0, r = (e & rt) !== 0, a = (e & st) !== 0;
          if (s)
            return r ? "se-resize" : a ? "ne-resize" : "e-resize";
          if (l)
            return r ? "sw-resize" : a ? "nw-resize" : "w-resize";
          if (r)
            return "s-resize";
          if (a)
            return "n-resize";
        }
        break;
      }
    }
    return _e() ? o > 0 && i > 0 ? "move" : o > 0 ? "ew-resize" : "ns-resize" : o > 0 && i > 0 ? "grab" : o > 0 ? "col-resize" : "row-resize";
  }
}
const $e = /* @__PURE__ */ new WeakMap();
function Pe(e) {
  if (e.defaultView === null || e.defaultView === void 0)
    return;
  let { prevStyle: t, styleSheet: n } = $e.get(e) ?? {};
  n === void 0 && (n = new e.defaultView.CSSStyleSheet(), e.adoptedStyleSheets && e.adoptedStyleSheets.push(n));
  const o = K();
  switch (o.state) {
    case "active":
    case "hover": {
      const i = Nt({
        cursorFlags: o.cursorFlags,
        groups: o.hitRegions.map((l) => l.group),
        state: o.state
      }), s = `*, *:hover {cursor: ${i} !important; }`;
      if (t === s)
        return;
      t = s, i ? n.cssRules.length === 0 ? n.insertRule(s) : n.replaceSync(s) : n.cssRules.length === 1 && n.deleteRule(0);
      break;
    }
    case "inactive": {
      t = void 0, n.cssRules.length === 1 && n.deleteRule(0);
      break;
    }
  }
  $e.set(e, {
    prevStyle: t,
    styleSheet: n
  });
}
function at({
  document: e,
  event: t,
  hitRegions: n,
  initialLayoutMap: o,
  mountedGroups: i,
  pointerDownAtPoint: s,
  prevCursorFlags: l
}) {
  let r = 0;
  n.forEach((c) => {
    const { group: f, groupSize: g } = c, { orientation: d, panels: b } = f, { disableCursor: x } = f.mutableState;
    let u = 0;
    s ? d === "horizontal" ? u = (t.clientX - s.x) / g * 100 : u = (t.clientY - s.y) / g * 100 : d === "horizontal" ? u = t.clientX < 0 ? -100 : 100 : u = t.clientY < 0 ? -100 : 100;
    const p = o.get(f), m = i.get(f);
    if (!p || !m)
      return;
    const {
      defaultLayoutDeferred: S,
      derivedPanelConstraints: v,
      groupSize: y,
      layout: h,
      separatorToPanels: w
    } = m;
    if (v && h && w) {
      const M = le({
        delta: u,
        initialLayout: p,
        panelConstraints: v,
        pivotIndices: c.panels.map((P) => b.indexOf(P)),
        prevLayout: h,
        trigger: "mouse-or-touch"
      });
      if (W(M, h)) {
        if (u !== 0 && !x)
          switch (d) {
            case "horizontal": {
              r |= u < 0 ? ot : it;
              break;
            }
            case "vertical": {
              r |= u < 0 ? rt : st;
              break;
            }
          }
      } else
        $(c.group, {
          defaultLayoutDeferred: S,
          derivedPanelConstraints: v,
          groupSize: y,
          layout: M,
          separatorToPanels: w
        });
    }
  });
  let a = 0;
  t.movementX === 0 ? a |= l & Fe : a |= r & Fe, t.movementY === 0 ? a |= l & Ne : a |= r & Ne, At(a), Pe(e);
}
function je(e) {
  const t = X(), n = K();
  switch (n.state) {
    case "active":
      at({
        document: e.currentTarget,
        event: e,
        hitRegions: n.hitRegions,
        initialLayoutMap: n.initialLayoutMap,
        mountedGroups: t,
        prevCursorFlags: n.cursorFlags
      });
  }
}
function He(e) {
  if (e.defaultPrevented)
    return;
  const t = K(), n = X();
  switch (t.state) {
    case "active": {
      if (
        // Skip this check for "pointerleave" events, else Firefox triggers a false positive (see #514)
        e.buttons === 0
      ) {
        te({
          cursorFlags: 0,
          state: "inactive"
        }), t.hitRegions.forEach((o) => {
          const i = H(o.group.id, true);
          $(o.group, i);
        });
        return;
      }
      for (const o of t.hitRegions)
        if (o.separator) {
          const { element: i } = o.separator;
          i.hasPointerCapture?.(e.pointerId) || i.setPointerCapture?.(e.pointerId);
        }
      at({
        document: e.currentTarget,
        event: e,
        hitRegions: t.hitRegions,
        initialLayoutMap: t.initialLayoutMap,
        mountedGroups: n,
        pointerDownAtPoint: t.pointerDownAtPoint,
        prevCursorFlags: t.cursorFlags
      });
      break;
    }
    default: {
      const o = xe(e, n);
      o.length === 0 ? t.state !== "inactive" && te({
        cursorFlags: 0,
        state: "inactive"
      }) : te({
        cursorFlags: 0,
        hitRegions: o,
        state: "hover"
      }), Pe(e.currentTarget);
      break;
    }
  }
}
function Ve(e) {
  if (e.relatedTarget instanceof HTMLIFrameElement)
    switch (K().state) {
      case "hover":
        te({
          cursorFlags: 0,
          state: "inactive"
        });
    }
}
function Be(e) {
  if (e.defaultPrevented)
    return;
  if (e.pointerType === "mouse" && e.button > 0)
    return;
  const t = K();
  switch (t.state) {
    case "active":
      te({
        cursorFlags: 0,
        state: "inactive"
      }), t.hitRegions.length > 0 && (Pe(e.currentTarget), t.hitRegions.forEach((n) => {
        const o = H(n.group.id, true);
        $(n.group, o);
      }), e.preventDefault());
  }
}
function We(e) {
  let t = 0, n = 0;
  const o = {};
  for (const s of e)
    if (s.defaultSize !== void 0) {
      t++;
      const l = T(s.defaultSize);
      n += l, o[s.panelId] = l;
    } else
      o[s.panelId] = void 0;
  const i = e.length - t;
  if (i !== 0) {
    const s = T((100 - n) / i);
    for (const l of e)
      l.defaultSize === void 0 && (o[l.panelId] = s);
  }
  return o;
}
function _t(e, t, n) {
  if (!n[0])
    return;
  const i = e.panels.find((c) => c.element === t);
  if (!i || !i.onResize)
    return;
  const s = ne({ group: e }), l = e.orientation === "horizontal" ? i.element.offsetWidth : i.element.offsetHeight, r = i.mutableValues.prevSize, a = {
    asPercentage: T(l / s * 100),
    inPixels: l
  };
  i.mutableValues.prevSize = a, i.onResize(a, i.id, r);
}
function $t(e, t) {
  if (Object.keys(e).length !== Object.keys(t).length)
    return false;
  for (const o in e)
    if (e[o] !== t[o])
      return false;
  return true;
}
function jt({
  group: e,
  nextGroupSize: t,
  prevGroupSize: n,
  prevLayout: o
}) {
  if (n <= 0 || t <= 0 || n === t)
    return o;
  let i = 0, s = 0, l = false;
  const r = /* @__PURE__ */ new Map(), a = [];
  for (const g of e.panels) {
    const d = o[g.id] ?? 0;
    switch (g.panelConstraints.groupResizeBehavior) {
      case "preserve-pixel-size": {
        l = true;
        const b = d / 100 * n, x = T(
          b / t * 100
        );
        r.set(g.id, x), i += x;
        break;
      }
      case "preserve-relative-size":
      default: {
        a.push(g.id), s += d;
        break;
      }
    }
  }
  if (!l || a.length === 0)
    return o;
  const c = 100 - i, f = { ...o };
  if (r.forEach((g, d) => {
    f[d] = g;
  }), s > 0)
    for (const g of a) {
      const d = o[g] ?? 0;
      f[g] = T(
        d / s * c
      );
    }
  else {
    const g = T(
      c / a.length
    );
    for (const d of a)
      f[d] = g;
  }
  return f;
}
function Ht(e, t) {
  const n = e.map((i) => i.id), o = Object.keys(t);
  if (n.length !== o.length)
    return false;
  for (const i of n)
    if (!o.includes(i))
      return false;
  return true;
}
const J = /* @__PURE__ */ new Map();
function Vt(e) {
  let t = true;
  C(
    e.element.ownerDocument.defaultView,
    "Cannot register an unmounted Group"
  );
  const n = e.element.ownerDocument.defaultView.ResizeObserver, o = /* @__PURE__ */ new Set(), i = /* @__PURE__ */ new Set(), s = new n((u) => {
    for (const p of u) {
      const { borderBoxSize: m, target: S } = p;
      if (S === e.element) {
        if (t) {
          const v = ne({ group: e });
          if (v === 0)
            return;
          const y = H(e.id);
          if (!y)
            return;
          const h = ve(e), w = y.defaultLayoutDeferred ? We(h) : y.layout, M = jt({
            group: e,
            nextGroupSize: v,
            prevGroupSize: y.groupSize,
            prevLayout: w
          }), P = U({
            layout: M,
            panelConstraints: h
          });
          if (!y.defaultLayoutDeferred && W(y.layout, P) && $t(
            y.derivedPanelConstraints,
            h
          ) && y.groupSize === v)
            return;
          $(e, {
            defaultLayoutDeferred: false,
            derivedPanelConstraints: h,
            groupSize: v,
            layout: P,
            separatorToPanels: y.separatorToPanels
          });
        }
      } else
        _t(e, S, m);
    }
  });
  s.observe(e.element), e.panels.forEach((u) => {
    C(
      !o.has(u.id),
      `Panel ids must be unique; id "${u.id}" was used more than once`
    ), o.add(u.id), u.onResize && s.observe(u.element);
  });
  const l = ne({ group: e }), r = ve(e), a = e.panels.map(({ id: u }) => u).join(",");
  let c = e.mutableState.defaultLayout;
  c && (Ht(e.panels, c) || (c = void 0));
  const f = e.mutableState.layouts[a] ?? c ?? We(r), g = U({
    layout: f,
    panelConstraints: r
  }), d = e.element.ownerDocument;
  J.set(
    d,
    (J.get(d) ?? 0) + 1
  );
  const b = /* @__PURE__ */ new Map();
  return Je(e).forEach((u) => {
    u.separator && b.set(u.separator, u.panels);
  }), $(e, {
    defaultLayoutDeferred: l === 0,
    derivedPanelConstraints: r,
    groupSize: l,
    layout: g,
    separatorToPanels: b
  }), e.separators.forEach((u) => {
    C(
      !i.has(u.id),
      `Separator ids must be unique; id "${u.id}" was used more than once`
    ), i.add(u.id), u.element.addEventListener("keydown", Ge);
  }), J.get(d) === 1 && (d.addEventListener("dblclick", Oe, true), d.addEventListener("pointerdown", Ae, true), d.addEventListener("pointerleave", je), d.addEventListener("pointermove", He), d.addEventListener("pointerout", Ve), d.addEventListener("pointerup", Be, true)), function() {
    t = false, J.set(
      d,
      Math.max(0, (J.get(d) ?? 0) - 1)
    ), Lt(e), e.separators.forEach((p) => {
      p.element.removeEventListener("keydown", Ge);
    }), J.get(d) || (d.removeEventListener(
      "dblclick",
      Oe,
      true
    ), d.removeEventListener(
      "pointerdown",
      Ae,
      true
    ), d.removeEventListener("pointerleave", je), d.removeEventListener("pointermove", He), d.removeEventListener("pointerout", Ve), d.removeEventListener("pointerup", Be, true)), s.disconnect();
  };
}
function Bt() {
  const [e, t] = reactExports.useState({}), n = reactExports.useCallback(() => t({}), []);
  return [e, n];
}
function Le(e) {
  const t = reactExports.useId();
  return `${e ?? t}`;
}
const q = typeof window < "u" ? reactExports.useLayoutEffect : reactExports.useEffect;
function se(e) {
  const t = reactExports.useRef(e);
  return q(() => {
    t.current = e;
  }, [e]), reactExports.useCallback(
    (...n) => t.current?.(...n),
    [t]
  );
}
function Ce(...e) {
  return se((t) => {
    e.forEach((n) => {
      if (n)
        switch (typeof n) {
          case "function": {
            n(t);
            break;
          }
          case "object": {
            n.current = t;
            break;
          }
        }
    });
  });
}
function Re(e) {
  const t = reactExports.useRef({ ...e });
  return q(() => {
    for (const n in e)
      t.current[n] = e[n];
  }, [e]), t.current;
}
const lt = reactExports.createContext(null);
function Wt(e, t) {
  const n = reactExports.useRef({
    getLayout: () => ({}),
    setLayout: Ft
  });
  reactExports.useImperativeHandle(t, () => n.current, []), q(() => {
    Object.assign(
      n.current,
      nt({ groupId: e })
    );
  });
}
function Ut({
  children: e,
  className: t,
  defaultLayout: n,
  disableCursor: o,
  disabled: i,
  elementRef: s,
  groupRef: l,
  id: r,
  onLayoutChange: a,
  onLayoutChanged: c,
  orientation: f = "horizontal",
  resizeTargetMinimumSize: g = {
    coarse: 20,
    fine: 10
  },
  style: d,
  ...b
}) {
  const x = reactExports.useRef({
    onLayoutChange: {},
    onLayoutChanged: {}
  }), u = se((z) => {
    W(x.current.onLayoutChange, z) || (x.current.onLayoutChange = z, a?.(z));
  }), p = se((z) => {
    W(x.current.onLayoutChanged, z) || (x.current.onLayoutChanged = z, c?.(z));
  }), m = Le(r), S = reactExports.useRef(null), [v, y] = Bt(), h = reactExports.useRef({
    lastExpandedPanelSizes: {},
    layouts: {},
    panels: [],
    resizeTargetMinimumSize: g,
    separators: []
  }), w = Ce(S, s);
  Wt(m, l);
  const M = se(
    (z, L) => {
      const k = K(), R = ke(z), E = H(z);
      if (E) {
        let I2 = false;
        switch (k.state) {
          case "active": {
            I2 = k.hitRegions.some(
              (V) => V.group === R
            );
            break;
          }
        }
        return {
          flexGrow: E.layout[L] ?? 1,
          pointerEvents: I2 ? "none" : void 0
        };
      }
      if (n?.[L])
        return {
          flexGrow: n?.[L]
        };
    }
  ), P = Re({
    defaultLayout: n,
    disableCursor: o
  }), G = reactExports.useMemo(
    () => ({
      get disableCursor() {
        return !!P.disableCursor;
      },
      getPanelStyles: M,
      id: m,
      orientation: f,
      registerPanel: (z) => {
        const L = h.current;
        return L.panels = be(f, [
          ...L.panels,
          z
        ]), y(), () => {
          L.panels = L.panels.filter(
            (k) => k !== z
          ), y();
        };
      },
      registerSeparator: (z) => {
        const L = h.current;
        return L.separators = be(f, [
          ...L.separators,
          z
        ]), y(), () => {
          L.separators = L.separators.filter(
            (k) => k !== z
          ), y();
        };
      },
      updatePanelProps: (z, { disabled: L }) => {
        const R = h.current.panels.find(
          (V) => V.id === z
        );
        R && (R.panelConstraints.disabled = L);
        const E = ke(m), I2 = H(m);
        E && I2 && $(E, {
          ...I2,
          derivedPanelConstraints: ve(E)
        });
      },
      updateSeparatorProps: (z, {
        disabled: L,
        disableDoubleClick: k
      }) => {
        const E = h.current.separators.find(
          (I2) => I2.id === z
        );
        E && (E.disabled = L, E.disableDoubleClick = k);
      }
    }),
    [M, m, y, f, P]
  ), N = reactExports.useRef(null);
  return q(() => {
    const z = S.current;
    if (z === null)
      return;
    const L = h.current;
    let k;
    if (P.defaultLayout !== void 0 && Object.keys(P.defaultLayout).length === L.panels.length) {
      k = {};
      for (const j of L.panels) {
        const Y = P.defaultLayout[j.id];
        Y !== void 0 && (k[j.id] = Y);
      }
    }
    const R = {
      disabled: !!i,
      element: z,
      id: m,
      mutableState: {
        defaultLayout: k,
        disableCursor: !!P.disableCursor,
        expandedPanelSizes: h.current.lastExpandedPanelSizes,
        layouts: h.current.layouts
      },
      orientation: f,
      panels: L.panels,
      resizeTargetMinimumSize: L.resizeTargetMinimumSize,
      separators: L.separators
    };
    N.current = R;
    const E = Vt(R), { defaultLayoutDeferred: I2, derivedPanelConstraints: V, layout: ue } = H(R.id, true);
    !I2 && V.length > 0 && (u(ue), p(ue));
    const oe = ze(m, (j) => {
      const { defaultLayoutDeferred: Y, derivedPanelConstraints: Ee, layout: ce } = j.next;
      if (Y || Ee.length === 0)
        return;
      const ut = R.panels.map(({ id: _ }) => _).join(",");
      R.mutableState.layouts[ut] = ce, Ee.forEach((_) => {
        if (_.collapsible) {
          const { layout: ge } = j.prev ?? {};
          if (ge) {
            const ft = D(
              _.collapsedSize,
              ce[_.panelId]
            ), dt = D(
              _.collapsedSize,
              ge[_.panelId]
            );
            ft && !dt && (R.mutableState.expandedPanelSizes[_.panelId] = ge[_.panelId]);
          }
        }
      });
      const ct = K().state !== "active";
      u(ce), ct && p(ce);
    });
    return () => {
      N.current = null, E(), oe();
    };
  }, [
    i,
    m,
    p,
    u,
    f,
    v,
    P
  ]), reactExports.useEffect(() => {
    const z = N.current;
    z && (z.mutableState.defaultLayout = n, z.mutableState.disableCursor = !!o);
  }), /* @__PURE__ */ jsxRuntimeExports.jsx(lt.Provider, { value: G, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      ...b,
      className: t,
      "data-group": true,
      "data-testid": m,
      id: m,
      ref: w,
      style: {
        height: "100%",
        width: "100%",
        overflow: "hidden",
        ...d,
        display: "flex",
        flexDirection: f === "horizontal" ? "row" : "column",
        flexWrap: "nowrap",
        // Inform the browser that the library is handling touch events for this element
        // but still allow users to scroll content within panels in the non-resizing direction
        // NOTE This is not an inherited style
        // See github.com/bvaughn/react-resizable-panels/issues/662
        touchAction: f === "horizontal" ? "pan-y" : "pan-x"
      },
      children: e
    }
  ) });
}
Ut.displayName = "Group";
function Me() {
  const e = reactExports.useContext(lt);
  return C(
    e,
    "Group Context not found; did you render a Panel or Separator outside of a Group?"
  ), e;
}
function qt(e, t) {
  const { id: n } = Me(), o = reactExports.useRef({
    collapse: ye,
    expand: ye,
    getSize: () => ({
      asPercentage: 0,
      inPixels: 0
    }),
    isCollapsed: () => false,
    resize: ye
  });
  reactExports.useImperativeHandle(t, () => o.current, []), q(() => {
    Object.assign(
      o.current,
      tt({ groupId: n, panelId: e })
    );
  });
}
function Yt({
  children: e,
  className: t,
  collapsedSize: n = "0%",
  collapsible: o = false,
  defaultSize: i,
  disabled: s,
  elementRef: l,
  groupResizeBehavior: r = "preserve-relative-size",
  id: a,
  maxSize: c = "100%",
  minSize: f = "0%",
  onResize: g,
  panelRef: d,
  style: b,
  ...x
}) {
  const u = !!a, p = Le(a), m = Re({
    disabled: s
  }), S = reactExports.useRef(null), v = Ce(S, l), {
    getPanelStyles: y,
    id: h,
    orientation: w,
    registerPanel: M,
    updatePanelProps: P
  } = Me(), G = g !== null, N = se(
    (R, E, I2) => {
      g?.(R, a, I2);
    }
  );
  q(() => {
    const R = S.current;
    if (R !== null) {
      const E = {
        element: R,
        id: p,
        idIsStable: u,
        mutableValues: {
          expandToSize: void 0,
          prevSize: void 0
        },
        onResize: G ? N : void 0,
        panelConstraints: {
          groupResizeBehavior: r,
          collapsedSize: n,
          collapsible: o,
          defaultSize: i,
          disabled: m.disabled,
          maxSize: c,
          minSize: f
        }
      };
      return M(E);
    }
  }, [
    r,
    n,
    o,
    i,
    G,
    p,
    u,
    c,
    f,
    N,
    M,
    m
  ]), reactExports.useEffect(() => {
    P(p, { disabled: s });
  }, [s, p, P]), qt(p, d);
  const z = () => {
    const R = y(h, p);
    if (R)
      return JSON.stringify(R);
  }, L = reactExports.useSyncExternalStore(
    (R) => ze(h, R),
    z,
    z
  );
  let k;
  return L ? k = JSON.parse(L) : i ? k = {
    flexGrow: void 0,
    flexShrink: void 0,
    flexBasis: i
  } : k = { flexGrow: 1 }, /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      ...x,
      "data-disabled": s || void 0,
      "data-panel": true,
      "data-testid": p,
      id: p,
      ref: v,
      style: {
        ...Jt,
        display: "flex",
        flexBasis: 0,
        flexShrink: 1,
        overflow: "visible",
        ...k
      },
      children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          className: t,
          style: {
            maxHeight: "100%",
            maxWidth: "100%",
            flexGrow: 1,
            overflow: "auto",
            ...b,
            // Inform the browser that the library is handling touch events for this element
            // but still allow users to scroll content within panels in the non-resizing direction
            // NOTE This is not an inherited style
            // See github.com/bvaughn/react-resizable-panels/issues/662
            touchAction: w === "horizontal" ? "pan-y" : "pan-x"
          },
          children: e
        }
      )
    }
  );
}
Yt.displayName = "Panel";
const Jt = {
  minHeight: 0,
  maxHeight: "100%",
  height: "auto",
  minWidth: 0,
  maxWidth: "100%",
  width: "auto",
  border: "none",
  borderWidth: 0,
  padding: 0,
  margin: 0
};
function Zt({
  layout: e,
  panelConstraints: t,
  panelId: n,
  panelIndex: o
}) {
  let i, s;
  const l = e[n], r = t.find(
    (a) => a.panelId === n
  );
  if (r) {
    const a = r.maxSize, c = r.collapsible ? r.collapsedSize : r.minSize, f = [o, o + 1];
    s = U({
      layout: le({
        delta: c - l,
        initialLayout: e,
        panelConstraints: t,
        pivotIndices: f,
        prevLayout: e
      }),
      panelConstraints: t
    })[n], i = U({
      layout: le({
        delta: a - l,
        initialLayout: e,
        panelConstraints: t,
        pivotIndices: f,
        prevLayout: e
      }),
      panelConstraints: t
    })[n];
  }
  return {
    valueControls: n,
    valueMax: i,
    valueMin: s,
    valueNow: l
  };
}
function Qt({
  children: e,
  className: t,
  disabled: n,
  disableDoubleClick: o,
  elementRef: i,
  id: s,
  style: l,
  ...r
}) {
  const a = Le(s), c = Re({
    disabled: n,
    disableDoubleClick: o
  }), [f, g] = reactExports.useState({}), [d, b] = reactExports.useState("inactive"), [x, u] = reactExports.useState(false), p = reactExports.useRef(null), m = Ce(p, i), {
    disableCursor: S,
    id: v,
    orientation: y,
    registerSeparator: h,
    updateSeparatorProps: w
  } = Me(), M = y === "horizontal" ? "vertical" : "horizontal";
  q(() => {
    const N = p.current;
    if (N !== null) {
      const z = {
        disabled: c.disabled,
        disableDoubleClick: c.disableDoubleClick,
        element: N,
        id: a
      }, L = h(z), k = Gt(
        (E) => {
          b(
            E.next.state !== "inactive" && E.next.hitRegions.some(
              (I2) => I2.separator === z
            ) ? E.next.state : "inactive"
          );
        }
      ), R = ze(
        v,
        (E) => {
          const { derivedPanelConstraints: I2, layout: V, separatorToPanels: ue } = E.next, oe = ue.get(z);
          if (oe) {
            const j = oe[0], Y = oe.indexOf(j);
            g(
              Zt({
                layout: V,
                panelConstraints: I2,
                panelId: j.id,
                panelIndex: Y
              })
            );
          }
        }
      );
      return () => {
        k(), R(), L();
      };
    }
  }, [v, a, h, c]), reactExports.useEffect(() => {
    w(a, { disabled: n, disableDoubleClick: o });
  }, [n, o, a, w]);
  let P;
  n && !S && (P = "not-allowed");
  let G;
  if (n)
    G = "disabled";
  else
    switch (d) {
      case "active": {
        G = "active";
        break;
      }
      default:
        x ? G = "focus" : G = d;
    }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      ...r,
      "aria-controls": f.valueControls,
      "aria-disabled": n || void 0,
      "aria-orientation": M,
      "aria-valuemax": f.valueMax,
      "aria-valuemin": f.valueMin,
      "aria-valuenow": f.valueNow,
      children: e,
      className: t,
      "data-separator": G,
      "data-testid": a,
      id: a,
      onBlur: () => u(false),
      onFocus: () => u(true),
      ref: m,
      role: "separator",
      style: {
        flexBasis: "auto",
        cursor: P,
        ...l,
        flexGrow: 0,
        flexShrink: 0,
        // Inform the browser that the library is handling touch events for this element
        // See github.com/bvaughn/react-resizable-panels/issues/662
        touchAction: "none"
      },
      tabIndex: n ? void 0 : 0
    }
  );
}
Qt.displayName = "Separator";
const useBrowserStore = create$1((set) => ({
  selectedRootFolder: null,
  subfolders: [],
  rootFiles: [],
  rootFilesFolderPath: null,
  subfoldersFilter: "",
  selectedSubfolder: null,
  files: [],
  filesFilter: "",
  isLoadingSubfolders: false,
  isLoadingFiles: false,
  loadRoot: async (perimeterId, rootFolderName) => {
    set({ selectedRootFolder: rootFolderName, isLoadingSubfolders: true, subfolders: [], rootFiles: [], rootFilesFolderPath: null, selectedSubfolder: null, files: [] });
    try {
      await startLogHub();
      const hub = getLogHub();
      const items = await hub.invoke("BrowseRoot", perimeterId, rootFolderName, "");
      const directories = items.filter((i) => i.isDirectory);
      const directFiles = items.filter((i) => !i.isDirectory);
      const parentDir = directFiles.length > 0 ? directFiles[0].path.replace(/[\\/][^\\/]+$/, "") : null;
      set({
        subfolders: directories,
        rootFiles: directFiles,
        rootFilesFolderPath: parentDir,
        // If root contains files directly, expose them immediately.
        selectedSubfolder: parentDir,
        files: directFiles
      });
    } catch {
    } finally {
      set({ isLoadingSubfolders: false });
    }
  },
  loadSubfolder: async (perimeterId, rootFolderName, subfolderPath) => {
    if (subfolderPath === rootFolderName) {
      set((state) => ({ selectedSubfolder: state.rootFilesFolderPath ?? subfolderPath, files: state.rootFiles, isLoadingFiles: false }));
      return;
    }
    if (subfolderPath && subfolderPath === (useBrowserStore.getState().rootFilesFolderPath ?? "")) {
      set((state) => ({ selectedSubfolder: subfolderPath, files: state.rootFiles, isLoadingFiles: false }));
      return;
    }
    set({ selectedSubfolder: subfolderPath, isLoadingFiles: true, files: [] });
    try {
      await startLogHub();
      const hub = getLogHub();
      const items = await hub.invoke("BrowseRoot", perimeterId, rootFolderName, subfolderPath);
      set({ files: items.filter((i) => !i.isDirectory) });
    } catch {
    } finally {
      set({ isLoadingFiles: false });
    }
  },
  setSubfoldersFilter: (f) => set({ subfoldersFilter: f }),
  setFilesFilter: (f) => set({ filesFilter: f }),
  reset: () => set({
    selectedRootFolder: null,
    subfolders: [],
    subfoldersFilter: "",
    rootFiles: [],
    rootFilesFolderPath: null,
    selectedSubfolder: null,
    files: [],
    filesFilter: ""
  })
}));
function basename(path) {
  return path.split(/[/\\]/).filter(Boolean).pop() ?? path;
}
function matchProfile(profiles, filePath) {
  const fileName = basename(filePath);
  for (const profile of profiles) {
    const params = (profile.loadingParam ?? "").split(";").map((param) => param.trim()).filter(Boolean);
    for (const param of params) {
      try {
        if (filePath.includes(param)) return profile;
        if (new RegExp(param, "i").test(filePath)) return profile;
        if (new RegExp(param, "i").test(fileName)) return profile;
      } catch {
        continue;
      }
    }
  }
  return null;
}
function LogBrowser({ onOpenSettings }) {
  const { perimeters, selectedPerimeterId, selectPerimeter } = usePerimeterStore();
  const {
    selectedRootFolder,
    subfolders,
    rootFiles,
    rootFilesFolderPath,
    subfoldersFilter,
    selectedSubfolder,
    files,
    filesFilter,
    isLoadingSubfolders,
    isLoadingFiles,
    loadRoot,
    loadSubfolder,
    setSubfoldersFilter,
    setFilesFilter
  } = useBrowserStore();
  const { tabs, addTab, removeTab, setActive } = useTabStore();
  const profiles = usePreferencesStore((state) => state.profiles);
  const selectedPerimeter = perimeters.find((p) => p.id === selectedPerimeterId);
  const handlePerimeterChange = reactExports.useCallback((newPerimeterId) => {
    selectPerimeter(newPerimeterId);
    localStorage.setItem("logwatcher_last_perimeter", newPerimeterId);
  }, [selectPerimeter]);
  const handleSelectRoot = reactExports.useCallback((rootName) => {
    if (!selectedPerimeterId) return;
    loadRoot(selectedPerimeterId, rootName);
  }, [selectedPerimeterId, loadRoot]);
  const handleSelectSubfolder = reactExports.useCallback((item) => {
    if (!selectedPerimeterId || !selectedRootFolder) return;
    const subpath = item.path;
    loadSubfolder(selectedPerimeterId, selectedRootFolder, subpath);
  }, [selectedPerimeterId, selectedRootFolder, loadSubfolder]);
  const handleOpenFile = reactExports.useCallback(async (file) => {
    if (!selectedPerimeterId || !selectedRootFolder) return;
    const perimeter = perimeters.find((p) => p.id === selectedPerimeterId);
    const rootFolder = perimeter?.rootFolders.find((r) => r.name === selectedRootFolder);
    const server = rootFolder?.servers.find((s) => s.id === file.serverId) ?? rootFolder?.servers[0];
    if (!server) return;
    const existingTab = tabs.find((tab) => tab.serverId === server.id && tab.filePath === file.path);
    if (existingTab) {
      const shouldOpenAnother = window.confirm(`'${basename(file.path)}' is already open. Open another tab?`);
      if (!shouldOpenAnother) {
        setActive(existingTab.sessionId);
        return;
      }
    }
    const hub = getLogHub();
    const sessionId = `${server.id}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    const matchedProfile = matchProfile(profiles, file.path);
    addTab({
      sessionId,
      serverId: server.id,
      filePath: file.path,
      displayName: basename(file.path),
      serverName: server.name,
      totalLines: 0,
      sizeBytes: 0,
      isIndexed: false,
      newLinesCount: 0,
      tailMode: true,
      isFiltered: false,
      activeProfileName: matchedProfile?.name
    });
    try {
      await startLogHub();
      await hub.invoke("OpenLog", sessionId, server.id, file.path, {
        loadFromEnd: true,
        initialLines: 500,
        profileName: matchedProfile?.name,
        encoding: matchedProfile?.encoding
      });
      if (matchedProfile?.name) {
        await hub.invoke("SetProfile", sessionId, matchedProfile.name);
      }
    } catch (e) {
      removeTab(sessionId);
      console.error("Failed to open log session", e);
    }
  }, [selectedPerimeterId, selectedRootFolder, perimeters, profiles, tabs, addTab, removeTab, setActive]);
  const virtualRootFolder = rootFilesFolderPath && rootFiles.length > 0 ? {
    path: rootFilesFolderPath,
    isDirectory: true,
    sizeBytes: 0,
    lastModified: rootFiles[0]?.lastModified ?? (/* @__PURE__ */ new Date()).toISOString(),
    serverId: rootFiles[0]?.serverId ?? "",
    hasChildren: true
  } : null;
  const displayedSubfolders = virtualRootFolder ? [virtualRootFolder, ...subfolders] : subfolders;
  const filteredSubfolders = displayedSubfolders.filter(
    (f) => basename(f.path).toLowerCase().includes(subfoldersFilter.toLowerCase())
  );
  const subfoldersBasenameCounts = displayedSubfolders.reduce((acc, f) => {
    const name = basename(f.path);
    acc[name] = (acc[name] ?? 0) + 1;
    return acc;
  }, {});
  const filteredFiles = files.filter(
    (f) => basename(f.path).toLowerCase().includes(filesFilter.toLowerCase())
  );
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "browser-shell", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "browser-toolbar", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "section-label", children: "LogBrowser" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "control-button control-button--ghost browser-toolbar__button", onClick: onOpenSettings, title: "LogBrowser settings", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { "aria-hidden": true, children: "⚙" }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "browser-content-split", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Ut, { orientation: "vertical", style: { height: "100%" }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Yt, { defaultSize: 40, minSize: 24, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "browser-columns", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "browser-column browser-column--roots", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "browser-stack-list", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "browser-stack-block", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "section-label", children: "Perimeter" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "browser-list browser-list--uniform", children: [
              perimeters.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "empty-state compact-empty-state browser-empty-state", children: "No perimeter available." }),
              perimeters.map((perimeter) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  onClick: () => handlePerimeterChange(perimeter.id),
                  className: `browser-item browser-item--block ${selectedPerimeterId === perimeter.id ? "browser-item--active" : ""}`,
                  title: perimeter.name,
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "browser-item-title", children: perimeter.name })
                },
                perimeter.id
              ))
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "browser-stack-block browser-stack-block--fill", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "section-label", children: "Environment" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "browser-list browser-list--uniform", children: selectedPerimeter?.rootFolders.map((root) => /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                onClick: () => handleSelectRoot(root.name),
                className: `browser-item browser-item--block ${selectedRootFolder === root.name ? "browser-item--active" : ""}`,
                title: root.name,
                children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "browser-item-title", children: root.name })
              },
              root.name
            )) })
          ] })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "browser-column browser-column--folders", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "section-label", children: "Folders" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "browser-filter-row", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              className: "control-input browser-inline-filter",
              placeholder: "Filter folders…",
              value: subfoldersFilter,
              onChange: (e) => setSubfoldersFilter(e.target.value)
            }
          ) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "browser-list browser-list--uniform", children: [
            isLoadingSubfolders && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "empty-state compact-empty-state browser-empty-state", children: "Loading folders…" }),
            filteredSubfolders.map((f) => {
              const name = basename(f.path);
              const isDuplicate = (subfoldersBasenameCounts[name] ?? 0) > 1;
              const parentName = basename(f.path.replace(/[/\\][^/\\]+$/, ""));
              const hint = isDuplicate ? f.sourceName || parentName || null : null;
              return /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "button",
                {
                  onClick: () => handleSelectSubfolder(f),
                  className: `browser-item browser-item--block ${selectedSubfolder === f.path ? "browser-item--active" : ""}`,
                  title: f.path,
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "browser-item-title", children: name }),
                    hint && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { style: { color: "var(--color-text-muted, #888)", marginLeft: "0.4em", fontSize: "0.85em" }, children: [
                      "(",
                      hint,
                      ")"
                    ] })
                  ]
                },
                `${f.serverId}:${f.path}`
              );
            })
          ] })
        ] })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Qt, { className: "browser-split-separator" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Yt, { defaultSize: 60, minSize: 28, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "browser-files surface-panel", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "browser-files-header", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "section-label", children: "Files" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "section-subtitle", children: "Double-click to open in the viewer" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              className: "control-input browser-files-filter",
              placeholder: "Filter files…",
              value: filesFilter,
              onChange: (e) => setFilesFilter(e.target.value)
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "browser-file-list browser-file-list--uniform", children: [
          isLoadingFiles && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "empty-state compact-empty-state browser-empty-state", children: "Loading files…" }),
          filteredFiles.map((f) => {
            const name = basename(f.path);
            return /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                onDoubleClick: () => handleOpenFile(f),
                className: "browser-file-row browser-file-row--uniform",
                title: `Double-click to open:
${f.path}`,
                children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "browser-item-title", children: name })
              },
              f.path
            );
          })
        ] })
      ] }) })
    ] }) })
  ] });
}
function FilterHistoryPanel({ onSelectPattern, onApplyPattern, refreshTick }) {
  const { getHistory, clear } = useFilterHistory();
  const [history, setHistory] = reactExports.useState([]);
  reactExports.useEffect(() => {
    setHistory(getHistory());
  }, [getHistory, refreshTick]);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rail-panel-content", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "section-header-row", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "eyebrow", children: "Filter history" }) }),
      history.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          onClick: () => {
            clear();
            setHistory([]);
          },
          className: "control-button control-button--ghost",
          children: "Clear"
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rail-scroll", children: [
      history.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "empty-state compact-empty-state", children: "No filter history yet." }),
      history.map((pattern, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          onClick: () => onSelectPattern(pattern),
          onDoubleClick: () => onApplyPattern(pattern),
          className: "history-chip",
          title: pattern,
          children: pattern
        },
        i
      ))
    ] })
  ] });
}
function extractBalancedJsonCandidate(text, start) {
  const opening = text[start];
  const closing = opening === "{" ? "}" : opening === "[" ? "]" : "";
  if (!closing) return null;
  let depth = 0;
  let inString = false;
  let escaped = false;
  for (let i = start; i < text.length; i++) {
    const ch = text[i];
    if (inString) {
      if (escaped) {
        escaped = false;
      } else if (ch === "\\") {
        escaped = true;
      } else if (ch === '"') {
        inString = false;
      }
      continue;
    }
    if (ch === '"') {
      inString = true;
      continue;
    }
    if (ch === opening) depth++;
    if (ch === closing) {
      depth--;
      if (depth === 0) {
        return { end: i, raw: text.slice(start, i + 1) };
      }
    }
  }
  return null;
}
function prettyJsonBlocks(text) {
  let output = "";
  let i = 0;
  while (i < text.length) {
    const ch = text[i];
    if (ch !== "{" && ch !== "[") {
      output += ch;
      i++;
      continue;
    }
    const candidate = extractBalancedJsonCandidate(text, i);
    if (!candidate) {
      output += ch;
      i++;
      continue;
    }
    try {
      const parsed = JSON.parse(candidate.raw);
      const pretty = JSON.stringify(parsed, null, 2);
      output += `
${pretty}
`;
      i = candidate.end + 1;
    } catch {
      output += ch;
      i++;
    }
  }
  return output;
}
function prettyXml(xml) {
  const normalized = xml.replace(/>\s*</g, "><").trim();
  const tokens = normalized.replace(/></g, ">\n<").split("\n");
  let depth = 0;
  const lines = [];
  for (const token of tokens) {
    const trimmed = token.trim();
    if (!trimmed) continue;
    const isClosing = /^<\//.test(trimmed);
    const isSelfClosing = /\/>$/.test(trimmed);
    const isDeclaration = /^<\?/.test(trimmed) || /^<!/.test(trimmed);
    if (isClosing) depth = Math.max(0, depth - 1);
    lines.push(`${"  ".repeat(depth)}${trimmed}`);
    if (!isClosing && !isSelfClosing && !isDeclaration && /^<[^/!?][^>]*>$/.test(trimmed)) depth++;
  }
  return lines.join("\n");
}
function prettyXmlBlocks(text) {
  return text.replace(/<([A-Za-z_][\w:.-]*)(?:\s[^<>]*)?>[\s\S]*?<\/\1>/g, (match) => {
    try {
      return `
${prettyXml(match)}
`;
    } catch {
      return match;
    }
  });
}
function splitHumanSeparators(text) {
  let out = "";
  let inDoubleQuote = false;
  let inSingleQuote = false;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    const prev = i > 0 ? text[i - 1] : "";
    if (ch === '"' && prev !== "\\" && !inSingleQuote) inDoubleQuote = !inDoubleQuote;
    if (ch === "'" && prev !== "\\" && !inDoubleQuote) inSingleQuote = !inSingleQuote;
    out += ch;
    if (!inDoubleQuote && !inSingleQuote && (ch === "," || ch === ";" || ch === "|")) {
      const next = i + 1 < text.length ? text[i + 1] : "";
      if (next && next !== "\n" && next !== "\r") out += "\n";
    }
  }
  out = out.replace(/([\-_=~#*])\1{3,}/g, "\n$&\n");
  return out;
}
function formatForInspect(text) {
  const withJson = prettyJsonBlocks(text);
  const withXml = prettyXmlBlocks(withJson);
  return splitHumanSeparators(withXml);
}
function escapeRegExp(text) {
  return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
function SelectedLinePanel() {
  const { activeSessionId } = useTabStore();
  const { getSelectedLine } = useLogStore();
  const [search, setSearch] = reactExports.useState("");
  const [activeMatch, setActiveMatch] = reactExports.useState(0);
  const activeMatchRef = reactExports.useRef(null);
  const line = activeSessionId ? getSelectedLine(activeSessionId) : null;
  const formatted = line ? formatForInspect(line.text) : null;
  const searchRegex = reactExports.useMemo(() => {
    if (!search.trim()) return null;
    return new RegExp(`(${escapeRegExp(search.trim())})`, "gi");
  }, [search]);
  const matchCount = reactExports.useMemo(() => {
    if (!formatted || !searchRegex) return 0;
    const matches = formatted.match(searchRegex);
    return matches?.length ?? 0;
  }, [formatted, searchRegex]);
  reactExports.useEffect(() => {
    setActiveMatch(0);
    setSearch("");
  }, [line?.lineNumber]);
  reactExports.useEffect(() => {
    activeMatchRef.current?.scrollIntoView({ block: "nearest", inline: "nearest" });
  }, [activeMatch, formatted]);
  const renderedContent = reactExports.useMemo(() => {
    if (!formatted) return null;
    if (!searchRegex) return formatted;
    const parts = formatted.split(searchRegex);
    let currentMatch = -1;
    return parts.map((part, index) => {
      if (!part) return null;
      if (index % 2 === 1) {
        currentMatch++;
        const isActive = currentMatch === activeMatch;
        return /* @__PURE__ */ jsxRuntimeExports.jsx(
          "mark",
          {
            className: `inspect-match ${isActive ? "inspect-match--active" : ""}`,
            ref: (element) => {
              if (isActive) activeMatchRef.current = element;
            },
            children: part
          },
          `m-${index}`
        );
      }
      return /* @__PURE__ */ jsxRuntimeExports.jsx(React.Fragment, { children: part }, `t-${index}`);
    });
  }, [formatted, searchRegex, activeMatch]);
  const goNextMatch = () => {
    if (matchCount <= 0) return;
    setActiveMatch((previous) => (previous + 1) % matchCount);
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rail-panel-content", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "section-header-row", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "eyebrow", children: "Inspect" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "inspect-search-row", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            className: "control-input inspect-search-input",
            placeholder: "Search in details...",
            value: search,
            onChange: (event) => setSearch(event.target.value),
            onKeyDown: (event) => {
              if (event.key === "Enter" || event.key === "F3") {
                event.preventDefault();
                goNextMatch();
              }
            }
          }
        ),
        matchCount > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { className: "control-button control-button--ghost inspect-search-next", onClick: goNextMatch, title: "Next match", children: [
          activeMatch + 1,
          "/",
          matchCount
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rail-scroll", children: [
      !line && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "empty-state compact-empty-state", children: "Click a log line to inspect it here." }),
      line && /* @__PURE__ */ jsxRuntimeExports.jsx("pre", { className: "selected-line-content", children: renderedContent })
    ] })
  ] });
}
function SessionInspector({ onSelectPattern, onApplyPattern, filterRefreshTick }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "inspector-rail", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "surface-panel rail-section inspector-fill inspector-fill--primary", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectedLinePanel, {}) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "surface-panel rail-section inspector-fill inspector-fill--secondary", children: /* @__PURE__ */ jsxRuntimeExports.jsx(FilterHistoryPanel, { onSelectPattern, onApplyPattern, refreshTick: filterRefreshTick }) })
  ] });
}
function memo$1(getDeps, fn, opts) {
  let deps = opts.initialDeps ?? [];
  let result;
  let isInitial = true;
  function memoizedFunction() {
    var _a, _b, _c;
    let depTime;
    if (opts.key && ((_a = opts.debug) == null ? void 0 : _a.call(opts))) depTime = Date.now();
    const newDeps = getDeps();
    const depsChanged = newDeps.length !== deps.length || newDeps.some((dep, index) => deps[index] !== dep);
    if (!depsChanged) {
      return result;
    }
    deps = newDeps;
    let resultTime;
    if (opts.key && ((_b = opts.debug) == null ? void 0 : _b.call(opts))) resultTime = Date.now();
    result = fn(...newDeps);
    if (opts.key && ((_c = opts.debug) == null ? void 0 : _c.call(opts))) {
      const depEndTime = Math.round((Date.now() - depTime) * 100) / 100;
      const resultEndTime = Math.round((Date.now() - resultTime) * 100) / 100;
      const resultFpsPercentage = resultEndTime / 16;
      const pad = (str, num) => {
        str = String(str);
        while (str.length < num) {
          str = " " + str;
        }
        return str;
      };
      console.info(
        `%c⏱ ${pad(resultEndTime, 5)} /${pad(depEndTime, 5)} ms`,
        `
            font-size: .6rem;
            font-weight: bold;
            color: hsl(${Math.max(
          0,
          Math.min(120 - 120 * resultFpsPercentage, 120)
        )}deg 100% 31%);`,
        opts == null ? void 0 : opts.key
      );
    }
    if ((opts == null ? void 0 : opts.onChange) && !(isInitial && opts.skipInitialOnChange)) {
      opts.onChange(result);
    }
    isInitial = false;
    return result;
  }
  memoizedFunction.updateDeps = (newDeps) => {
    deps = newDeps;
  };
  return memoizedFunction;
}
function notUndefined$1(value, msg) {
  if (value === void 0) {
    throw new Error(`Unexpected undefined${""}`);
  } else {
    return value;
  }
}
const approxEqual$1 = (a, b) => Math.abs(a - b) < 1.01;
const debounce$1 = (targetWindow, fn, ms) => {
  let timeoutId;
  return function(...args) {
    targetWindow.clearTimeout(timeoutId);
    timeoutId = targetWindow.setTimeout(() => fn.apply(this, args), ms);
  };
};
const getRect$1 = (element) => {
  const { offsetWidth, offsetHeight } = element;
  return { width: offsetWidth, height: offsetHeight };
};
const defaultKeyExtractor$1 = (index) => index;
const defaultRangeExtractor$1 = (range) => {
  const start = Math.max(range.startIndex - range.overscan, 0);
  const end = Math.min(range.endIndex + range.overscan, range.count - 1);
  const arr = [];
  for (let i = start; i <= end; i++) {
    arr.push(i);
  }
  return arr;
};
const observeElementRect$1 = (instance, cb) => {
  const element = instance.scrollElement;
  if (!element) {
    return;
  }
  const targetWindow = instance.targetWindow;
  if (!targetWindow) {
    return;
  }
  const handler = (rect) => {
    const { width, height } = rect;
    cb({ width: Math.round(width), height: Math.round(height) });
  };
  handler(getRect$1(element));
  if (!targetWindow.ResizeObserver) {
    return () => {
    };
  }
  const observer = new targetWindow.ResizeObserver((entries) => {
    const run = () => {
      const entry = entries[0];
      if (entry == null ? void 0 : entry.borderBoxSize) {
        const box = entry.borderBoxSize[0];
        if (box) {
          handler({ width: box.inlineSize, height: box.blockSize });
          return;
        }
      }
      handler(getRect$1(element));
    };
    instance.options.useAnimationFrameWithResizeObserver ? requestAnimationFrame(run) : run();
  });
  observer.observe(element, { box: "border-box" });
  return () => {
    observer.unobserve(element);
  };
};
const addEventListenerOptions$1 = {
  passive: true
};
const supportsScrollend$1 = typeof window == "undefined" ? true : "onscrollend" in window;
const observeElementOffset$1 = (instance, cb) => {
  const element = instance.scrollElement;
  if (!element) {
    return;
  }
  const targetWindow = instance.targetWindow;
  if (!targetWindow) {
    return;
  }
  let offset = 0;
  const fallback = instance.options.useScrollendEvent && supportsScrollend$1 ? () => void 0 : debounce$1(
    targetWindow,
    () => {
      cb(offset, false);
    },
    instance.options.isScrollingResetDelay
  );
  const createHandler = (isScrolling) => () => {
    const { horizontal, isRtl } = instance.options;
    offset = horizontal ? element["scrollLeft"] * (isRtl && -1 || 1) : element["scrollTop"];
    fallback();
    cb(offset, isScrolling);
  };
  const handler = createHandler(true);
  const endHandler = createHandler(false);
  element.addEventListener("scroll", handler, addEventListenerOptions$1);
  const registerScrollendEvent = instance.options.useScrollendEvent && supportsScrollend$1;
  if (registerScrollendEvent) {
    element.addEventListener("scrollend", endHandler, addEventListenerOptions$1);
  }
  return () => {
    element.removeEventListener("scroll", handler);
    if (registerScrollendEvent) {
      element.removeEventListener("scrollend", endHandler);
    }
  };
};
const measureElement$1 = (element, entry, instance) => {
  if (entry == null ? void 0 : entry.borderBoxSize) {
    const box = entry.borderBoxSize[0];
    if (box) {
      const size = Math.round(
        box[instance.options.horizontal ? "inlineSize" : "blockSize"]
      );
      return size;
    }
  }
  return element[instance.options.horizontal ? "offsetWidth" : "offsetHeight"];
};
const elementScroll$1 = (offset, {
  adjustments = 0,
  behavior
}, instance) => {
  var _a, _b;
  const toOffset = offset + adjustments;
  (_b = (_a = instance.scrollElement) == null ? void 0 : _a.scrollTo) == null ? void 0 : _b.call(_a, {
    [instance.options.horizontal ? "left" : "top"]: toOffset,
    behavior
  });
};
let Virtualizer$1 = class Virtualizer {
  constructor(opts) {
    this.unsubs = [];
    this.scrollElement = null;
    this.targetWindow = null;
    this.isScrolling = false;
    this.scrollState = null;
    this.measurementsCache = [];
    this.itemSizeCache = /* @__PURE__ */ new Map();
    this.laneAssignments = /* @__PURE__ */ new Map();
    this.pendingMeasuredCacheIndexes = [];
    this.prevLanes = void 0;
    this.lanesChangedFlag = false;
    this.lanesSettling = false;
    this.scrollRect = null;
    this.scrollOffset = null;
    this.scrollDirection = null;
    this.scrollAdjustments = 0;
    this.elementsCache = /* @__PURE__ */ new Map();
    this.now = () => {
      var _a, _b, _c;
      return ((_c = (_b = (_a = this.targetWindow) == null ? void 0 : _a.performance) == null ? void 0 : _b.now) == null ? void 0 : _c.call(_b)) ?? Date.now();
    };
    this.observer = /* @__PURE__ */ (() => {
      let _ro = null;
      const get = () => {
        if (_ro) {
          return _ro;
        }
        if (!this.targetWindow || !this.targetWindow.ResizeObserver) {
          return null;
        }
        return _ro = new this.targetWindow.ResizeObserver((entries) => {
          entries.forEach((entry) => {
            const run = () => {
              const node = entry.target;
              const index = this.indexFromElement(node);
              if (!node.isConnected) {
                this.observer.unobserve(node);
                return;
              }
              if (this.shouldMeasureDuringScroll(index)) {
                this.resizeItem(
                  index,
                  this.options.measureElement(node, entry, this)
                );
              }
            };
            this.options.useAnimationFrameWithResizeObserver ? requestAnimationFrame(run) : run();
          });
        });
      };
      return {
        disconnect: () => {
          var _a;
          (_a = get()) == null ? void 0 : _a.disconnect();
          _ro = null;
        },
        observe: (target) => {
          var _a;
          return (_a = get()) == null ? void 0 : _a.observe(target, { box: "border-box" });
        },
        unobserve: (target) => {
          var _a;
          return (_a = get()) == null ? void 0 : _a.unobserve(target);
        }
      };
    })();
    this.range = null;
    this.setOptions = (opts2) => {
      Object.entries(opts2).forEach(([key, value]) => {
        if (typeof value === "undefined") delete opts2[key];
      });
      this.options = {
        debug: false,
        initialOffset: 0,
        overscan: 1,
        paddingStart: 0,
        paddingEnd: 0,
        scrollPaddingStart: 0,
        scrollPaddingEnd: 0,
        horizontal: false,
        getItemKey: defaultKeyExtractor$1,
        rangeExtractor: defaultRangeExtractor$1,
        onChange: () => {
        },
        measureElement: measureElement$1,
        initialRect: { width: 0, height: 0 },
        scrollMargin: 0,
        gap: 0,
        indexAttribute: "data-index",
        initialMeasurementsCache: [],
        lanes: 1,
        isScrollingResetDelay: 150,
        enabled: true,
        isRtl: false,
        useScrollendEvent: false,
        useAnimationFrameWithResizeObserver: false,
        laneAssignmentMode: "estimate",
        ...opts2
      };
    };
    this.notify = (sync) => {
      var _a, _b;
      (_b = (_a = this.options).onChange) == null ? void 0 : _b.call(_a, this, sync);
    };
    this.maybeNotify = memo$1(
      () => {
        this.calculateRange();
        return [
          this.isScrolling,
          this.range ? this.range.startIndex : null,
          this.range ? this.range.endIndex : null
        ];
      },
      (isScrolling) => {
        this.notify(isScrolling);
      },
      {
        key: false,
        debug: () => this.options.debug,
        initialDeps: [
          this.isScrolling,
          this.range ? this.range.startIndex : null,
          this.range ? this.range.endIndex : null
        ]
      }
    );
    this.cleanup = () => {
      this.unsubs.filter(Boolean).forEach((d) => d());
      this.unsubs = [];
      this.observer.disconnect();
      if (this.rafId != null && this.targetWindow) {
        this.targetWindow.cancelAnimationFrame(this.rafId);
        this.rafId = null;
      }
      this.scrollState = null;
      this.scrollElement = null;
      this.targetWindow = null;
    };
    this._didMount = () => {
      return () => {
        this.cleanup();
      };
    };
    this._willUpdate = () => {
      var _a;
      const scrollElement = this.options.enabled ? this.options.getScrollElement() : null;
      if (this.scrollElement !== scrollElement) {
        this.cleanup();
        if (!scrollElement) {
          this.maybeNotify();
          return;
        }
        this.scrollElement = scrollElement;
        if (this.scrollElement && "ownerDocument" in this.scrollElement) {
          this.targetWindow = this.scrollElement.ownerDocument.defaultView;
        } else {
          this.targetWindow = ((_a = this.scrollElement) == null ? void 0 : _a.window) ?? null;
        }
        this.elementsCache.forEach((cached) => {
          this.observer.observe(cached);
        });
        this.unsubs.push(
          this.options.observeElementRect(this, (rect) => {
            this.scrollRect = rect;
            this.maybeNotify();
          })
        );
        this.unsubs.push(
          this.options.observeElementOffset(this, (offset, isScrolling) => {
            this.scrollAdjustments = 0;
            this.scrollDirection = isScrolling ? this.getScrollOffset() < offset ? "forward" : "backward" : null;
            this.scrollOffset = offset;
            this.isScrolling = isScrolling;
            if (this.scrollState) {
              this.scheduleScrollReconcile();
            }
            this.maybeNotify();
          })
        );
        this._scrollToOffset(this.getScrollOffset(), {
          adjustments: void 0,
          behavior: void 0
        });
      }
    };
    this.rafId = null;
    this.getSize = () => {
      if (!this.options.enabled) {
        this.scrollRect = null;
        return 0;
      }
      this.scrollRect = this.scrollRect ?? this.options.initialRect;
      return this.scrollRect[this.options.horizontal ? "width" : "height"];
    };
    this.getScrollOffset = () => {
      if (!this.options.enabled) {
        this.scrollOffset = null;
        return 0;
      }
      this.scrollOffset = this.scrollOffset ?? (typeof this.options.initialOffset === "function" ? this.options.initialOffset() : this.options.initialOffset);
      return this.scrollOffset;
    };
    this.getFurthestMeasurement = (measurements, index) => {
      const furthestMeasurementsFound = /* @__PURE__ */ new Map();
      const furthestMeasurements = /* @__PURE__ */ new Map();
      for (let m = index - 1; m >= 0; m--) {
        const measurement = measurements[m];
        if (furthestMeasurementsFound.has(measurement.lane)) {
          continue;
        }
        const previousFurthestMeasurement = furthestMeasurements.get(
          measurement.lane
        );
        if (previousFurthestMeasurement == null || measurement.end > previousFurthestMeasurement.end) {
          furthestMeasurements.set(measurement.lane, measurement);
        } else if (measurement.end < previousFurthestMeasurement.end) {
          furthestMeasurementsFound.set(measurement.lane, true);
        }
        if (furthestMeasurementsFound.size === this.options.lanes) {
          break;
        }
      }
      return furthestMeasurements.size === this.options.lanes ? Array.from(furthestMeasurements.values()).sort((a, b) => {
        if (a.end === b.end) {
          return a.index - b.index;
        }
        return a.end - b.end;
      })[0] : void 0;
    };
    this.getMeasurementOptions = memo$1(
      () => [
        this.options.count,
        this.options.paddingStart,
        this.options.scrollMargin,
        this.options.getItemKey,
        this.options.enabled,
        this.options.lanes,
        this.options.laneAssignmentMode
      ],
      (count, paddingStart, scrollMargin, getItemKey, enabled, lanes, laneAssignmentMode) => {
        const lanesChanged = this.prevLanes !== void 0 && this.prevLanes !== lanes;
        if (lanesChanged) {
          this.lanesChangedFlag = true;
        }
        this.prevLanes = lanes;
        this.pendingMeasuredCacheIndexes = [];
        return {
          count,
          paddingStart,
          scrollMargin,
          getItemKey,
          enabled,
          lanes,
          laneAssignmentMode
        };
      },
      {
        key: false
      }
    );
    this.getMeasurements = memo$1(
      () => [this.getMeasurementOptions(), this.itemSizeCache],
      ({
        count,
        paddingStart,
        scrollMargin,
        getItemKey,
        enabled,
        lanes,
        laneAssignmentMode
      }, itemSizeCache) => {
        if (!enabled) {
          this.measurementsCache = [];
          this.itemSizeCache.clear();
          this.laneAssignments.clear();
          return [];
        }
        if (this.laneAssignments.size > count) {
          for (const index of this.laneAssignments.keys()) {
            if (index >= count) {
              this.laneAssignments.delete(index);
            }
          }
        }
        if (this.lanesChangedFlag) {
          this.lanesChangedFlag = false;
          this.lanesSettling = true;
          this.measurementsCache = [];
          this.itemSizeCache.clear();
          this.laneAssignments.clear();
          this.pendingMeasuredCacheIndexes = [];
        }
        if (this.measurementsCache.length === 0 && !this.lanesSettling) {
          this.measurementsCache = this.options.initialMeasurementsCache;
          this.measurementsCache.forEach((item) => {
            this.itemSizeCache.set(item.key, item.size);
          });
        }
        const min = this.lanesSettling ? 0 : this.pendingMeasuredCacheIndexes.length > 0 ? Math.min(...this.pendingMeasuredCacheIndexes) : 0;
        this.pendingMeasuredCacheIndexes = [];
        if (this.lanesSettling && this.measurementsCache.length === count) {
          this.lanesSettling = false;
        }
        const measurements = this.measurementsCache.slice(0, min);
        const laneLastIndex = new Array(lanes).fill(
          void 0
        );
        for (let m = 0; m < min; m++) {
          const item = measurements[m];
          if (item) {
            laneLastIndex[item.lane] = m;
          }
        }
        for (let i = min; i < count; i++) {
          const key = getItemKey(i);
          const cachedLane = this.laneAssignments.get(i);
          let lane;
          let start;
          const shouldCacheLane = laneAssignmentMode === "estimate" || itemSizeCache.has(key);
          if (cachedLane !== void 0 && this.options.lanes > 1) {
            lane = cachedLane;
            const prevIndex = laneLastIndex[lane];
            const prevInLane = prevIndex !== void 0 ? measurements[prevIndex] : void 0;
            start = prevInLane ? prevInLane.end + this.options.gap : paddingStart + scrollMargin;
          } else {
            const furthestMeasurement = this.options.lanes === 1 ? measurements[i - 1] : this.getFurthestMeasurement(measurements, i);
            start = furthestMeasurement ? furthestMeasurement.end + this.options.gap : paddingStart + scrollMargin;
            lane = furthestMeasurement ? furthestMeasurement.lane : i % this.options.lanes;
            if (this.options.lanes > 1 && shouldCacheLane) {
              this.laneAssignments.set(i, lane);
            }
          }
          const measuredSize = itemSizeCache.get(key);
          const size = typeof measuredSize === "number" ? measuredSize : this.options.estimateSize(i);
          const end = start + size;
          measurements[i] = {
            index: i,
            start,
            size,
            end,
            key,
            lane
          };
          laneLastIndex[lane] = i;
        }
        this.measurementsCache = measurements;
        return measurements;
      },
      {
        key: false,
        debug: () => this.options.debug
      }
    );
    this.calculateRange = memo$1(
      () => [
        this.getMeasurements(),
        this.getSize(),
        this.getScrollOffset(),
        this.options.lanes
      ],
      (measurements, outerSize, scrollOffset, lanes) => {
        return this.range = measurements.length > 0 && outerSize > 0 ? calculateRange$1({
          measurements,
          outerSize,
          scrollOffset,
          lanes
        }) : null;
      },
      {
        key: false,
        debug: () => this.options.debug
      }
    );
    this.getVirtualIndexes = memo$1(
      () => {
        let startIndex = null;
        let endIndex = null;
        const range = this.calculateRange();
        if (range) {
          startIndex = range.startIndex;
          endIndex = range.endIndex;
        }
        this.maybeNotify.updateDeps([this.isScrolling, startIndex, endIndex]);
        return [
          this.options.rangeExtractor,
          this.options.overscan,
          this.options.count,
          startIndex,
          endIndex
        ];
      },
      (rangeExtractor, overscan, count, startIndex, endIndex) => {
        return startIndex === null || endIndex === null ? [] : rangeExtractor({
          startIndex,
          endIndex,
          overscan,
          count
        });
      },
      {
        key: false,
        debug: () => this.options.debug
      }
    );
    this.indexFromElement = (node) => {
      const attributeName = this.options.indexAttribute;
      const indexStr = node.getAttribute(attributeName);
      if (!indexStr) {
        console.warn(
          `Missing attribute name '${attributeName}={index}' on measured element.`
        );
        return -1;
      }
      return parseInt(indexStr, 10);
    };
    this.shouldMeasureDuringScroll = (index) => {
      var _a;
      if (!this.scrollState || this.scrollState.behavior !== "smooth") {
        return true;
      }
      const scrollIndex = this.scrollState.index ?? ((_a = this.getVirtualItemForOffset(this.scrollState.lastTargetOffset)) == null ? void 0 : _a.index);
      if (scrollIndex !== void 0 && this.range) {
        const bufferSize = Math.max(
          this.options.overscan,
          Math.ceil((this.range.endIndex - this.range.startIndex) / 2)
        );
        const minIndex = Math.max(0, scrollIndex - bufferSize);
        const maxIndex = Math.min(
          this.options.count - 1,
          scrollIndex + bufferSize
        );
        return index >= minIndex && index <= maxIndex;
      }
      return true;
    };
    this.measureElement = (node) => {
      if (!node) {
        this.elementsCache.forEach((cached, key2) => {
          if (!cached.isConnected) {
            this.observer.unobserve(cached);
            this.elementsCache.delete(key2);
          }
        });
        return;
      }
      const index = this.indexFromElement(node);
      const key = this.options.getItemKey(index);
      const prevNode = this.elementsCache.get(key);
      if (prevNode !== node) {
        if (prevNode) {
          this.observer.unobserve(prevNode);
        }
        this.observer.observe(node);
        this.elementsCache.set(key, node);
      }
      if ((!this.isScrolling || this.scrollState) && this.shouldMeasureDuringScroll(index)) {
        this.resizeItem(index, this.options.measureElement(node, void 0, this));
      }
    };
    this.resizeItem = (index, size) => {
      var _a;
      const item = this.measurementsCache[index];
      if (!item) return;
      const itemSize = this.itemSizeCache.get(item.key) ?? item.size;
      const delta = size - itemSize;
      if (delta !== 0) {
        if (((_a = this.scrollState) == null ? void 0 : _a.behavior) !== "smooth" && (this.shouldAdjustScrollPositionOnItemSizeChange !== void 0 ? this.shouldAdjustScrollPositionOnItemSizeChange(item, delta, this) : item.start < this.getScrollOffset() + this.scrollAdjustments)) {
          this._scrollToOffset(this.getScrollOffset(), {
            adjustments: this.scrollAdjustments += delta,
            behavior: void 0
          });
        }
        this.pendingMeasuredCacheIndexes.push(item.index);
        this.itemSizeCache = new Map(this.itemSizeCache.set(item.key, size));
        this.notify(false);
      }
    };
    this.getVirtualItems = memo$1(
      () => [this.getVirtualIndexes(), this.getMeasurements()],
      (indexes, measurements) => {
        const virtualItems = [];
        for (let k = 0, len = indexes.length; k < len; k++) {
          const i = indexes[k];
          const measurement = measurements[i];
          virtualItems.push(measurement);
        }
        return virtualItems;
      },
      {
        key: false,
        debug: () => this.options.debug
      }
    );
    this.getVirtualItemForOffset = (offset) => {
      const measurements = this.getMeasurements();
      if (measurements.length === 0) {
        return void 0;
      }
      return notUndefined$1(
        measurements[findNearestBinarySearch$1(
          0,
          measurements.length - 1,
          (index) => notUndefined$1(measurements[index]).start,
          offset
        )]
      );
    };
    this.getMaxScrollOffset = () => {
      if (!this.scrollElement) return 0;
      if ("scrollHeight" in this.scrollElement) {
        return this.options.horizontal ? this.scrollElement.scrollWidth - this.scrollElement.clientWidth : this.scrollElement.scrollHeight - this.scrollElement.clientHeight;
      } else {
        const doc = this.scrollElement.document.documentElement;
        return this.options.horizontal ? doc.scrollWidth - this.scrollElement.innerWidth : doc.scrollHeight - this.scrollElement.innerHeight;
      }
    };
    this.getOffsetForAlignment = (toOffset, align, itemSize = 0) => {
      if (!this.scrollElement) return 0;
      const size = this.getSize();
      const scrollOffset = this.getScrollOffset();
      if (align === "auto") {
        align = toOffset >= scrollOffset + size ? "end" : "start";
      }
      if (align === "center") {
        toOffset += (itemSize - size) / 2;
      } else if (align === "end") {
        toOffset -= size;
      }
      const maxOffset = this.getMaxScrollOffset();
      return Math.max(Math.min(maxOffset, toOffset), 0);
    };
    this.getOffsetForIndex = (index, align = "auto") => {
      index = Math.max(0, Math.min(index, this.options.count - 1));
      const size = this.getSize();
      const scrollOffset = this.getScrollOffset();
      const item = this.measurementsCache[index];
      if (!item) return;
      if (align === "auto") {
        if (item.end >= scrollOffset + size - this.options.scrollPaddingEnd) {
          align = "end";
        } else if (item.start <= scrollOffset + this.options.scrollPaddingStart) {
          align = "start";
        } else {
          return [scrollOffset, align];
        }
      }
      if (align === "end" && index === this.options.count - 1) {
        return [this.getMaxScrollOffset(), align];
      }
      const toOffset = align === "end" ? item.end + this.options.scrollPaddingEnd : item.start - this.options.scrollPaddingStart;
      return [
        this.getOffsetForAlignment(toOffset, align, item.size),
        align
      ];
    };
    this.scrollToOffset = (toOffset, { align = "start", behavior = "auto" } = {}) => {
      const offset = this.getOffsetForAlignment(toOffset, align);
      const now = this.now();
      this.scrollState = {
        index: null,
        align,
        behavior,
        startedAt: now,
        lastTargetOffset: offset,
        stableFrames: 0
      };
      this._scrollToOffset(offset, { adjustments: void 0, behavior });
      this.scheduleScrollReconcile();
    };
    this.scrollToIndex = (index, {
      align: initialAlign = "auto",
      behavior = "auto"
    } = {}) => {
      index = Math.max(0, Math.min(index, this.options.count - 1));
      const offsetInfo = this.getOffsetForIndex(index, initialAlign);
      if (!offsetInfo) {
        return;
      }
      const [offset, align] = offsetInfo;
      const now = this.now();
      this.scrollState = {
        index,
        align,
        behavior,
        startedAt: now,
        lastTargetOffset: offset,
        stableFrames: 0
      };
      this._scrollToOffset(offset, { adjustments: void 0, behavior });
      this.scheduleScrollReconcile();
    };
    this.scrollBy = (delta, { behavior = "auto" } = {}) => {
      const offset = this.getScrollOffset() + delta;
      const now = this.now();
      this.scrollState = {
        index: null,
        align: "start",
        behavior,
        startedAt: now,
        lastTargetOffset: offset,
        stableFrames: 0
      };
      this._scrollToOffset(offset, { adjustments: void 0, behavior });
      this.scheduleScrollReconcile();
    };
    this.getTotalSize = () => {
      var _a;
      const measurements = this.getMeasurements();
      let end;
      if (measurements.length === 0) {
        end = this.options.paddingStart;
      } else if (this.options.lanes === 1) {
        end = ((_a = measurements[measurements.length - 1]) == null ? void 0 : _a.end) ?? 0;
      } else {
        const endByLane = Array(this.options.lanes).fill(null);
        let endIndex = measurements.length - 1;
        while (endIndex >= 0 && endByLane.some((val) => val === null)) {
          const item = measurements[endIndex];
          if (endByLane[item.lane] === null) {
            endByLane[item.lane] = item.end;
          }
          endIndex--;
        }
        end = Math.max(...endByLane.filter((val) => val !== null));
      }
      return Math.max(
        end - this.options.scrollMargin + this.options.paddingEnd,
        0
      );
    };
    this._scrollToOffset = (offset, {
      adjustments,
      behavior
    }) => {
      this.options.scrollToFn(offset, { behavior, adjustments }, this);
    };
    this.measure = () => {
      this.itemSizeCache = /* @__PURE__ */ new Map();
      this.laneAssignments = /* @__PURE__ */ new Map();
      this.notify(false);
    };
    this.setOptions(opts);
  }
  scheduleScrollReconcile() {
    if (!this.targetWindow) {
      this.scrollState = null;
      return;
    }
    if (this.rafId != null) return;
    this.rafId = this.targetWindow.requestAnimationFrame(() => {
      this.rafId = null;
      this.reconcileScroll();
    });
  }
  reconcileScroll() {
    if (!this.scrollState) return;
    const el = this.scrollElement;
    if (!el) return;
    const MAX_RECONCILE_MS = 5e3;
    if (this.now() - this.scrollState.startedAt > MAX_RECONCILE_MS) {
      this.scrollState = null;
      return;
    }
    const offsetInfo = this.scrollState.index != null ? this.getOffsetForIndex(this.scrollState.index, this.scrollState.align) : void 0;
    const targetOffset = offsetInfo ? offsetInfo[0] : this.scrollState.lastTargetOffset;
    const STABLE_FRAMES = 1;
    const targetChanged = targetOffset !== this.scrollState.lastTargetOffset;
    if (!targetChanged && approxEqual$1(targetOffset, this.getScrollOffset())) {
      this.scrollState.stableFrames++;
      if (this.scrollState.stableFrames >= STABLE_FRAMES) {
        this.scrollState = null;
        return;
      }
    } else {
      this.scrollState.stableFrames = 0;
      if (targetChanged) {
        this.scrollState.lastTargetOffset = targetOffset;
        this.scrollState.behavior = "auto";
        this._scrollToOffset(targetOffset, {
          adjustments: void 0,
          behavior: "auto"
        });
      }
    }
    this.scheduleScrollReconcile();
  }
};
const findNearestBinarySearch$1 = (low, high, getCurrentValue, value) => {
  while (low <= high) {
    const middle = (low + high) / 2 | 0;
    const currentValue = getCurrentValue(middle);
    if (currentValue < value) {
      low = middle + 1;
    } else if (currentValue > value) {
      high = middle - 1;
    } else {
      return middle;
    }
  }
  if (low > 0) {
    return low - 1;
  } else {
    return 0;
  }
};
function calculateRange$1({
  measurements,
  outerSize,
  scrollOffset,
  lanes
}) {
  const lastIndex = measurements.length - 1;
  const getOffset = (index) => measurements[index].start;
  if (measurements.length <= lanes) {
    return {
      startIndex: 0,
      endIndex: lastIndex
    };
  }
  let startIndex = findNearestBinarySearch$1(
    0,
    lastIndex,
    getOffset,
    scrollOffset
  );
  let endIndex = startIndex;
  if (lanes === 1) {
    while (endIndex < lastIndex && measurements[endIndex].end < scrollOffset + outerSize) {
      endIndex++;
    }
  } else if (lanes > 1) {
    const endPerLane = Array(lanes).fill(0);
    while (endIndex < lastIndex && endPerLane.some((pos) => pos < scrollOffset + outerSize)) {
      const item = measurements[endIndex];
      endPerLane[item.lane] = item.end;
      endIndex++;
    }
    const startPerLane = Array(lanes).fill(scrollOffset + outerSize);
    while (startIndex >= 0 && startPerLane.some((pos) => pos >= scrollOffset)) {
      const item = measurements[startIndex];
      startPerLane[item.lane] = item.start;
      startIndex--;
    }
    startIndex = Math.max(0, startIndex - startIndex % lanes);
    endIndex = Math.min(lastIndex, endIndex + (lanes - 1 - endIndex % lanes));
  }
  return { startIndex, endIndex };
}
const useIsomorphicLayoutEffect$1 = typeof document !== "undefined" ? reactExports.useLayoutEffect : reactExports.useEffect;
function useVirtualizerBase$1({
  useFlushSync = true,
  ...options
}) {
  const rerender = reactExports.useReducer(() => ({}), {})[1];
  const resolvedOptions = {
    ...options,
    onChange: (instance2, sync) => {
      var _a;
      if (useFlushSync && sync) {
        reactDomExports.flushSync(rerender);
      } else {
        rerender();
      }
      (_a = options.onChange) == null ? void 0 : _a.call(options, instance2, sync);
    }
  };
  const [instance] = reactExports.useState(
    () => new Virtualizer$1(resolvedOptions)
  );
  instance.setOptions(resolvedOptions);
  useIsomorphicLayoutEffect$1(() => {
    return instance._didMount();
  }, []);
  useIsomorphicLayoutEffect$1(() => {
    return instance._willUpdate();
  });
  return instance;
}
function useVirtualizer$1(options) {
  return useVirtualizerBase$1({
    observeElementRect: observeElementRect$1,
    observeElementOffset: observeElementOffset$1,
    scrollToFn: elementScroll$1,
    ...options
  });
}
const PREFETCH_AHEAD$1 = 300;
const PREFETCH_BEHIND$1 = 100;
const CHUNK_SIZE$1 = 500;
function useVirtualLines(sessionId, hub) {
  const { getLine, buffers } = useLogStore();
  const { tabs, updateTab } = useTabStore();
  const tab = tabs.find((t) => t.sessionId === sessionId);
  const totalLines = tab?.contextTotalLines ?? tab?.totalLines ?? 0;
  const sourceOffset = tab?.contextStartLine ?? 0;
  const inFlight = reactExports.useRef(/* @__PURE__ */ new Set());
  const ensureRange = reactExports.useCallback((startLine, count) => {
    if (!sessionId || totalLines === 0) return;
    const rangeStart = Math.max(0, startLine - PREFETCH_BEHIND$1);
    const rangeEnd = Math.min(totalLines - 1, startLine + count + PREFETCH_AHEAD$1);
    const buf = buffers[sessionId] ?? {};
    for (let lineNum = rangeStart; lineNum <= rangeEnd; lineNum++) {
      if (buf[lineNum] === void 0) {
        const chunkStart = Math.floor(lineNum / CHUNK_SIZE$1) * CHUNK_SIZE$1;
        if (!inFlight.current.has(chunkStart)) {
          inFlight.current.add(chunkStart);
          const chunkEnd = Math.min(totalLines - 1, chunkStart + CHUNK_SIZE$1 - 1);
          const chunkCount = chunkEnd - chunkStart + 1;
          const sourceChunkStart = chunkStart + sourceOffset;
          hub.invoke("RequestLines", sessionId, sourceChunkStart, chunkCount).then(() => updateTab(sessionId, { errorMessage: void 0 })).catch((e) => {
            const msg = e instanceof Error ? e.message : "Failed to request lines from server";
            updateTab(sessionId, { errorMessage: msg });
          }).finally(() => inFlight.current.delete(chunkStart));
        }
        lineNum = chunkStart + CHUNK_SIZE$1 - 1;
      }
    }
  }, [sessionId, totalLines, buffers, hub, updateTab, sourceOffset]);
  const getLineText = reactExports.useCallback((lineNumber) => {
    return getLine(sessionId, lineNumber);
  }, [getLine, sessionId]);
  return { totalLines, ensureRange, getLineText };
}
const LogLine = reactExports.memo(function LogLine2({
  lineNumber: _lineNumber,
  text,
  segments,
  isSelected,
  onClick
}) {
  if (text === void 0) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "log-row log-row--placeholder",
        style: { minHeight: 20 },
        children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "log-row__placeholder" })
      }
    );
  }
  const lineStyle = segments && segments.length > 0 ? { backgroundColor: segments[0].backColor } : void 0;
  const selectedStyle = isSelected ? {
    boxShadow: "inset 0 0 0 2px var(--accent-2), inset 4px 0 0 0 var(--accent-strong)"
  } : void 0;
  const content = segments && segments.length > 0 ? segments.map((seg, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
    "span",
    {
      style: {
        color: seg.foreColor,
        fontWeight: seg.bold ? "bold" : void 0
      },
      children: seg.text
    },
    i
  )) : text;
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      className: `log-row ${isSelected ? "log-row--selected" : ""}`,
      style: { minHeight: 20, ...lineStyle, ...selectedStyle },
      onClick,
      children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "log-row__content", children: content })
    }
  );
});
const LINE_HEIGHT$1 = 20;
function LogVirtualList({ sessionId, hub, highlightingRules, fallbackHighlightingRules = [], tailMode }) {
  const parentRef = reactExports.useRef(null);
  const { totalLines, ensureRange, getLineText } = useVirtualLines(sessionId, hub);
  const { highlightLine } = useHighlighting(highlightingRules, fallbackHighlightingRules);
  const { setSelectedLine, getSelectedLine } = useLogStore();
  const { updateTab } = useTabStore();
  const selectedLine = getSelectedLine(sessionId);
  const lastScrollTopRef = reactExports.useRef(0);
  const wasNearBottomRef = reactExports.useRef(true);
  const previousSelectedLineRef = reactExports.useRef(null);
  const togglingTailRef = reactExports.useRef(false);
  const virtualizer = useVirtualizer$1({
    count: totalLines,
    getScrollElement: () => parentRef.current,
    estimateSize: () => LINE_HEIGHT$1,
    overscan: 20
  });
  const virtualItems = virtualizer.getVirtualItems();
  const fetchVisible = reactExports.useCallback(() => {
    if (virtualItems.length === 0) return;
    const first = virtualItems[0].index;
    const last = virtualItems[virtualItems.length - 1].index;
    ensureRange(first, last - first + 1);
  }, [virtualItems, ensureRange]);
  reactExports.useEffect(() => {
    fetchVisible();
  }, [fetchVisible]);
  reactExports.useEffect(() => {
    if (tailMode && totalLines > 0) {
      virtualizer.scrollToIndex(totalLines - 1, { align: "end" });
      wasNearBottomRef.current = true;
    }
  }, [tailMode, totalLines, virtualizer]);
  const handleScroll = reactExports.useCallback(async () => {
    const el = parentRef.current;
    if (!el) return;
    const currentTop = el.scrollTop;
    const scrollingUp = currentTop < lastScrollTopRef.current;
    const nearBottom = el.scrollHeight - el.clientHeight - currentTop <= 8;
    if (tailMode && scrollingUp && wasNearBottomRef.current && !nearBottom && !togglingTailRef.current) {
      togglingTailRef.current = true;
      updateTab(sessionId, { tailMode: false });
      try {
        await hub.invoke("SetTail", sessionId, false);
      } catch {
      } finally {
        togglingTailRef.current = false;
      }
    }
    if (!tailMode && nearBottom && !wasNearBottomRef.current && !togglingTailRef.current) {
      togglingTailRef.current = true;
      updateTab(sessionId, { tailMode: true });
      try {
        await hub.invoke("SetTail", sessionId, true);
      } catch {
      } finally {
        togglingTailRef.current = false;
      }
    }
    lastScrollTopRef.current = currentTop;
    wasNearBottomRef.current = nearBottom;
  }, [tailMode, hub, sessionId, updateTab]);
  reactExports.useEffect(() => {
    const selected = selectedLine?.lineNumber;
    if (selected === void 0 || selected < 0 || selected >= totalLines) return;
    const hasChanged = previousSelectedLineRef.current !== selected;
    previousSelectedLineRef.current = selected;
    if (!hasChanged) return;
    const firstVisible = virtualItems[0]?.index ?? 0;
    const lastVisible = virtualItems[virtualItems.length - 1]?.index ?? -1;
    if (selected < firstVisible || selected > lastVisible) {
      virtualizer.scrollToIndex(selected, { align: "center" });
    }
  }, [selectedLine?.lineNumber, totalLines, virtualItems, virtualizer]);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      ref: parentRef,
      className: "log-virtual-list",
      onScroll: () => {
        void handleScroll();
      },
      children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          style: { height: virtualizer.getTotalSize(), position: "relative" },
          children: virtualItems.map((vItem) => {
            const lineNumber = vItem.index;
            const text = getLineText(lineNumber);
            const segments = text !== void 0 ? highlightLine(text) : void 0;
            const isSelected = selectedLine?.lineNumber === lineNumber;
            return /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                style: {
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  transform: `translateY(${vItem.start}px)`
                },
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                  LogLine,
                  {
                    lineNumber,
                    text,
                    segments,
                    isSelected,
                    onClick: text !== void 0 ? () => setSelectedLine(sessionId, { lineNumber, text }) : void 0
                  }
                )
              },
              vItem.key
            );
          })
        }
      )
    }
  );
}
function LogStatusBar({ sessionId }) {
  const { tabs } = useTabStore();
  const tab = tabs.find((t) => t.sessionId === sessionId);
  if (!tab) return null;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "log-status-bar", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "status-pill", children: [
      tab.totalLines.toLocaleString(),
      " lines"
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "status-pill", children: formatBytes(tab.sizeBytes) }),
    !tab.isIndexed && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "status-pill status-pill--warn", children: "Indexing…" }),
    tab.isFiltered && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "status-pill", children: "Filtered" }),
    tab.newLinesCount > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "status-pill status-pill--ok", children: [
      "+",
      tab.newLinesCount,
      " new lines"
    ] }),
    tab.errorMessage && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "status-pill status-pill--danger", title: tab.errorMessage, children: tab.errorMessage }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "flex-1" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "log-status-path", children: [
      tab.serverName,
      " · ",
      tab.filePath
    ] })
  ] });
}
function formatBytes(bytes) {
  if (bytes > 1e9) return `${(bytes / 1e9).toFixed(1)} GB`;
  if (bytes > 1e6) return `${(bytes / 1e6).toFixed(1)} MB`;
  if (bytes > 1e3) return `${(bytes / 1e3).toFixed(1)} KB`;
  return `${bytes} B`;
}
function LogViewer({ sessionId, hub, profileHighlightingRules = [] }) {
  const { tabs, updateTab } = useTabStore();
  const { clearBuffer } = useLogStore();
  const defaultHighlights = usePreferencesStore((state) => state.defaultHighlights);
  const tab = tabs.find((t) => t.sessionId === sessionId);
  const isIndexing = !tab?.isIndexed && (tab?.indexTotalBytes ?? 0) > 0;
  const indexProgress = isIndexing && tab?.indexTotalBytes ? Math.min(100, Math.round((tab.indexedBytes ?? 0) / tab.indexTotalBytes * 100)) : null;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "log-viewer-root", children: [
    indexProgress !== null && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "index-progress-bar", style: { width: `${indexProgress}%` } }),
    !tab?.isIndexed && indexProgress === null && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "index-progress-bar index-progress-bar--indeterminate" }),
    tab?.isFiltered && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "log-filter-banner", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "log-filter-banner__label", children: [
        "Filter: ",
        tab.filterPattern ?? "(stored filter)"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          className: "log-filter-banner__clear",
          onClick: async () => {
            clearBuffer(sessionId);
            updateTab(sessionId, {
              totalLines: tab.contextTotalLines ?? 0,
              isFiltered: false,
              filterPattern: void 0,
              filterIsRegex: void 0,
              filterCaseSensitive: void 0,
              activeStoredFilterName: void 0
            });
            await hub.invoke("ClearFilter", sessionId);
          },
          title: "Cancel filter",
          children: "Cancel filter"
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "log-viewer-body", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      LogVirtualList,
      {
        sessionId,
        hub,
        highlightingRules: profileHighlightingRules,
        fallbackHighlightingRules: defaultHighlights,
        tailMode: tab?.tailMode ?? true
      }
    ) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(LogStatusBar, { sessionId })
  ] });
}
const createStoreImpl = (createState) => {
  let state;
  const listeners = /* @__PURE__ */ new Set();
  const setState = (partial, replace) => {
    const nextState = typeof partial === "function" ? partial(state) : partial;
    if (!Object.is(nextState, state)) {
      const previousState = state;
      state = (replace != null ? replace : typeof nextState !== "object" || nextState === null) ? nextState : Object.assign({}, state, nextState);
      listeners.forEach((listener) => listener(state, previousState));
    }
  };
  const getState = () => state;
  const getInitialState = () => initialState;
  const subscribe = (listener) => {
    listeners.add(listener);
    return () => listeners.delete(listener);
  };
  const api2 = { setState, getState, getInitialState, subscribe };
  const initialState = state = createState(setState, getState, api2);
  return api2;
};
const createStore = ((createState) => createState ? createStoreImpl(createState) : createStoreImpl);
const identity = (arg) => arg;
function useStore(api2, selector = identity) {
  const slice = React.useSyncExternalStore(
    api2.subscribe,
    React.useCallback(() => selector(api2.getState()), [api2, selector]),
    React.useCallback(() => selector(api2.getInitialState()), [api2, selector])
  );
  React.useDebugValue(slice);
  return slice;
}
const createImpl = (createState) => {
  const api2 = createStore(createState);
  const useBoundStore = (selector) => useStore(api2, selector);
  Object.assign(useBoundStore, api2);
  return useBoundStore;
};
const create = ((createState) => createState ? createImpl(createState) : createImpl);
const useDesktopStore = create((set, get) => ({
  serverUrl: window.electronAPI?.initialServerUrl ?? "",
  setServerUrl: (url) => set({ serverUrl: url }),
  clearServerUrl: () => {
    window.electronAPI?.setConfig({ serverUrl: "" }).catch(() => {
    });
    set({ serverUrl: "" });
  },
  localTabs: [],
  activeLocalTabId: null,
  openLocalTab: (info) => {
    const existing = get().localTabs.find((t) => t.filePath === info.path);
    if (existing) {
      set({ activeLocalTabId: existing.id });
      return;
    }
    const tab = {
      id: info.path,
      filePath: info.path,
      displayName: info.path.replace(/.*[\\/]/, ""),
      info,
      buffer: /* @__PURE__ */ new Map(),
      totalLines: info.totalLines,
      scrollRatio: 1,
      tailMode: true,
      filterPattern: "",
      filterIsRegex: false,
      filterCaseSensitive: false
    };
    set((state) => ({
      localTabs: [...state.localTabs, tab],
      activeLocalTabId: tab.id
    }));
  },
  closeLocalTab: (id) => {
    set((state) => {
      const next = state.localTabs.filter((t) => t.id !== id);
      const nextActive = state.activeLocalTabId === id ? next[next.length - 1]?.id ?? null : state.activeLocalTabId;
      return { localTabs: next, activeLocalTabId: nextActive };
    });
  },
  setActiveLocalTab: (id) => set({ activeLocalTabId: id }),
  updateLocalTab: (id, patch) => {
    set((state) => ({
      localTabs: state.localTabs.map((t) => t.id === id ? { ...t, ...patch } : t)
    }));
  },
  addLocalLines: (filePath, startLine, lines) => {
    set((state) => {
      const tab = state.localTabs.find((t) => t.filePath === filePath);
      if (!tab) return state;
      const buf = new Map(tab.buffer);
      lines.forEach((text, i) => buf.set(startLine + i, text));
      if (buf.size > 5e3) {
        const sorted = Array.from(buf.keys()).sort((a, b) => a - b);
        sorted.slice(0, buf.size - 3e3).forEach((k) => buf.delete(k));
      }
      const newTotal = Math.max(tab.totalLines, startLine + lines.length);
      return {
        localTabs: state.localTabs.map(
          (t) => t.id === tab.id ? { ...t, buffer: buf, totalLines: newTotal } : t
        )
      };
    });
  }
}));
function memo(getDeps, fn, opts) {
  let deps = opts.initialDeps ?? [];
  let result;
  let isInitial = true;
  function memoizedFunction() {
    var _a, _b, _c;
    let depTime;
    if (opts.key && ((_a = opts.debug) == null ? void 0 : _a.call(opts))) depTime = Date.now();
    const newDeps = getDeps();
    const depsChanged = newDeps.length !== deps.length || newDeps.some((dep, index) => deps[index] !== dep);
    if (!depsChanged) {
      return result;
    }
    deps = newDeps;
    let resultTime;
    if (opts.key && ((_b = opts.debug) == null ? void 0 : _b.call(opts))) resultTime = Date.now();
    result = fn(...newDeps);
    if (opts.key && ((_c = opts.debug) == null ? void 0 : _c.call(opts))) {
      const depEndTime = Math.round((Date.now() - depTime) * 100) / 100;
      const resultEndTime = Math.round((Date.now() - resultTime) * 100) / 100;
      const resultFpsPercentage = resultEndTime / 16;
      const pad = (str, num) => {
        str = String(str);
        while (str.length < num) {
          str = " " + str;
        }
        return str;
      };
      console.info(
        `%c⏱ ${pad(resultEndTime, 5)} /${pad(depEndTime, 5)} ms`,
        `
            font-size: .6rem;
            font-weight: bold;
            color: hsl(${Math.max(
          0,
          Math.min(120 - 120 * resultFpsPercentage, 120)
        )}deg 100% 31%);`,
        opts == null ? void 0 : opts.key
      );
    }
    if ((opts == null ? void 0 : opts.onChange) && !(isInitial && opts.skipInitialOnChange)) {
      opts.onChange(result);
    }
    isInitial = false;
    return result;
  }
  memoizedFunction.updateDeps = (newDeps) => {
    deps = newDeps;
  };
  return memoizedFunction;
}
function notUndefined(value, msg) {
  if (value === void 0) {
    throw new Error(`Unexpected undefined${""}`);
  } else {
    return value;
  }
}
const approxEqual = (a, b) => Math.abs(a - b) < 1.01;
const debounce = (targetWindow, fn, ms) => {
  let timeoutId;
  return function(...args) {
    targetWindow.clearTimeout(timeoutId);
    timeoutId = targetWindow.setTimeout(() => fn.apply(this, args), ms);
  };
};
const getRect = (element) => {
  const { offsetWidth, offsetHeight } = element;
  return { width: offsetWidth, height: offsetHeight };
};
const defaultKeyExtractor = (index) => index;
const defaultRangeExtractor = (range) => {
  const start = Math.max(range.startIndex - range.overscan, 0);
  const end = Math.min(range.endIndex + range.overscan, range.count - 1);
  const arr = [];
  for (let i = start; i <= end; i++) {
    arr.push(i);
  }
  return arr;
};
const observeElementRect = (instance, cb) => {
  const element = instance.scrollElement;
  if (!element) {
    return;
  }
  const targetWindow = instance.targetWindow;
  if (!targetWindow) {
    return;
  }
  const handler = (rect) => {
    const { width, height } = rect;
    cb({ width: Math.round(width), height: Math.round(height) });
  };
  handler(getRect(element));
  if (!targetWindow.ResizeObserver) {
    return () => {
    };
  }
  const observer = new targetWindow.ResizeObserver((entries) => {
    const run = () => {
      const entry = entries[0];
      if (entry == null ? void 0 : entry.borderBoxSize) {
        const box = entry.borderBoxSize[0];
        if (box) {
          handler({ width: box.inlineSize, height: box.blockSize });
          return;
        }
      }
      handler(getRect(element));
    };
    instance.options.useAnimationFrameWithResizeObserver ? requestAnimationFrame(run) : run();
  });
  observer.observe(element, { box: "border-box" });
  return () => {
    observer.unobserve(element);
  };
};
const addEventListenerOptions = {
  passive: true
};
const supportsScrollend = typeof window == "undefined" ? true : "onscrollend" in window;
const observeElementOffset = (instance, cb) => {
  const element = instance.scrollElement;
  if (!element) {
    return;
  }
  const targetWindow = instance.targetWindow;
  if (!targetWindow) {
    return;
  }
  let offset = 0;
  const fallback = instance.options.useScrollendEvent && supportsScrollend ? () => void 0 : debounce(
    targetWindow,
    () => {
      cb(offset, false);
    },
    instance.options.isScrollingResetDelay
  );
  const createHandler = (isScrolling) => () => {
    const { horizontal, isRtl } = instance.options;
    offset = horizontal ? element["scrollLeft"] * (isRtl && -1 || 1) : element["scrollTop"];
    fallback();
    cb(offset, isScrolling);
  };
  const handler = createHandler(true);
  const endHandler = createHandler(false);
  element.addEventListener("scroll", handler, addEventListenerOptions);
  const registerScrollendEvent = instance.options.useScrollendEvent && supportsScrollend;
  if (registerScrollendEvent) {
    element.addEventListener("scrollend", endHandler, addEventListenerOptions);
  }
  return () => {
    element.removeEventListener("scroll", handler);
    if (registerScrollendEvent) {
      element.removeEventListener("scrollend", endHandler);
    }
  };
};
const measureElement = (element, entry, instance) => {
  if (entry == null ? void 0 : entry.borderBoxSize) {
    const box = entry.borderBoxSize[0];
    if (box) {
      const size = Math.round(
        box[instance.options.horizontal ? "inlineSize" : "blockSize"]
      );
      return size;
    }
  }
  return element[instance.options.horizontal ? "offsetWidth" : "offsetHeight"];
};
const elementScroll = (offset, {
  adjustments = 0,
  behavior
}, instance) => {
  var _a, _b;
  const toOffset = offset + adjustments;
  (_b = (_a = instance.scrollElement) == null ? void 0 : _a.scrollTo) == null ? void 0 : _b.call(_a, {
    [instance.options.horizontal ? "left" : "top"]: toOffset,
    behavior
  });
};
class Virtualizer2 {
  constructor(opts) {
    this.unsubs = [];
    this.scrollElement = null;
    this.targetWindow = null;
    this.isScrolling = false;
    this.scrollState = null;
    this.measurementsCache = [];
    this.itemSizeCache = /* @__PURE__ */ new Map();
    this.laneAssignments = /* @__PURE__ */ new Map();
    this.pendingMeasuredCacheIndexes = [];
    this.prevLanes = void 0;
    this.lanesChangedFlag = false;
    this.lanesSettling = false;
    this.scrollRect = null;
    this.scrollOffset = null;
    this.scrollDirection = null;
    this.scrollAdjustments = 0;
    this.elementsCache = /* @__PURE__ */ new Map();
    this.now = () => {
      var _a, _b, _c;
      return ((_c = (_b = (_a = this.targetWindow) == null ? void 0 : _a.performance) == null ? void 0 : _b.now) == null ? void 0 : _c.call(_b)) ?? Date.now();
    };
    this.observer = /* @__PURE__ */ (() => {
      let _ro = null;
      const get = () => {
        if (_ro) {
          return _ro;
        }
        if (!this.targetWindow || !this.targetWindow.ResizeObserver) {
          return null;
        }
        return _ro = new this.targetWindow.ResizeObserver((entries) => {
          entries.forEach((entry) => {
            const run = () => {
              const node = entry.target;
              const index = this.indexFromElement(node);
              if (!node.isConnected) {
                this.observer.unobserve(node);
                return;
              }
              if (this.shouldMeasureDuringScroll(index)) {
                this.resizeItem(
                  index,
                  this.options.measureElement(node, entry, this)
                );
              }
            };
            this.options.useAnimationFrameWithResizeObserver ? requestAnimationFrame(run) : run();
          });
        });
      };
      return {
        disconnect: () => {
          var _a;
          (_a = get()) == null ? void 0 : _a.disconnect();
          _ro = null;
        },
        observe: (target) => {
          var _a;
          return (_a = get()) == null ? void 0 : _a.observe(target, { box: "border-box" });
        },
        unobserve: (target) => {
          var _a;
          return (_a = get()) == null ? void 0 : _a.unobserve(target);
        }
      };
    })();
    this.range = null;
    this.setOptions = (opts2) => {
      Object.entries(opts2).forEach(([key, value]) => {
        if (typeof value === "undefined") delete opts2[key];
      });
      this.options = {
        debug: false,
        initialOffset: 0,
        overscan: 1,
        paddingStart: 0,
        paddingEnd: 0,
        scrollPaddingStart: 0,
        scrollPaddingEnd: 0,
        horizontal: false,
        getItemKey: defaultKeyExtractor,
        rangeExtractor: defaultRangeExtractor,
        onChange: () => {
        },
        measureElement,
        initialRect: { width: 0, height: 0 },
        scrollMargin: 0,
        gap: 0,
        indexAttribute: "data-index",
        initialMeasurementsCache: [],
        lanes: 1,
        isScrollingResetDelay: 150,
        enabled: true,
        isRtl: false,
        useScrollendEvent: false,
        useAnimationFrameWithResizeObserver: false,
        laneAssignmentMode: "estimate",
        ...opts2
      };
    };
    this.notify = (sync) => {
      var _a, _b;
      (_b = (_a = this.options).onChange) == null ? void 0 : _b.call(_a, this, sync);
    };
    this.maybeNotify = memo(
      () => {
        this.calculateRange();
        return [
          this.isScrolling,
          this.range ? this.range.startIndex : null,
          this.range ? this.range.endIndex : null
        ];
      },
      (isScrolling) => {
        this.notify(isScrolling);
      },
      {
        key: false,
        debug: () => this.options.debug,
        initialDeps: [
          this.isScrolling,
          this.range ? this.range.startIndex : null,
          this.range ? this.range.endIndex : null
        ]
      }
    );
    this.cleanup = () => {
      this.unsubs.filter(Boolean).forEach((d) => d());
      this.unsubs = [];
      this.observer.disconnect();
      if (this.rafId != null && this.targetWindow) {
        this.targetWindow.cancelAnimationFrame(this.rafId);
        this.rafId = null;
      }
      this.scrollState = null;
      this.scrollElement = null;
      this.targetWindow = null;
    };
    this._didMount = () => {
      return () => {
        this.cleanup();
      };
    };
    this._willUpdate = () => {
      var _a;
      const scrollElement = this.options.enabled ? this.options.getScrollElement() : null;
      if (this.scrollElement !== scrollElement) {
        this.cleanup();
        if (!scrollElement) {
          this.maybeNotify();
          return;
        }
        this.scrollElement = scrollElement;
        if (this.scrollElement && "ownerDocument" in this.scrollElement) {
          this.targetWindow = this.scrollElement.ownerDocument.defaultView;
        } else {
          this.targetWindow = ((_a = this.scrollElement) == null ? void 0 : _a.window) ?? null;
        }
        this.elementsCache.forEach((cached) => {
          this.observer.observe(cached);
        });
        this.unsubs.push(
          this.options.observeElementRect(this, (rect) => {
            this.scrollRect = rect;
            this.maybeNotify();
          })
        );
        this.unsubs.push(
          this.options.observeElementOffset(this, (offset, isScrolling) => {
            this.scrollAdjustments = 0;
            this.scrollDirection = isScrolling ? this.getScrollOffset() < offset ? "forward" : "backward" : null;
            this.scrollOffset = offset;
            this.isScrolling = isScrolling;
            if (this.scrollState) {
              this.scheduleScrollReconcile();
            }
            this.maybeNotify();
          })
        );
        this._scrollToOffset(this.getScrollOffset(), {
          adjustments: void 0,
          behavior: void 0
        });
      }
    };
    this.rafId = null;
    this.getSize = () => {
      if (!this.options.enabled) {
        this.scrollRect = null;
        return 0;
      }
      this.scrollRect = this.scrollRect ?? this.options.initialRect;
      return this.scrollRect[this.options.horizontal ? "width" : "height"];
    };
    this.getScrollOffset = () => {
      if (!this.options.enabled) {
        this.scrollOffset = null;
        return 0;
      }
      this.scrollOffset = this.scrollOffset ?? (typeof this.options.initialOffset === "function" ? this.options.initialOffset() : this.options.initialOffset);
      return this.scrollOffset;
    };
    this.getFurthestMeasurement = (measurements, index) => {
      const furthestMeasurementsFound = /* @__PURE__ */ new Map();
      const furthestMeasurements = /* @__PURE__ */ new Map();
      for (let m = index - 1; m >= 0; m--) {
        const measurement = measurements[m];
        if (furthestMeasurementsFound.has(measurement.lane)) {
          continue;
        }
        const previousFurthestMeasurement = furthestMeasurements.get(
          measurement.lane
        );
        if (previousFurthestMeasurement == null || measurement.end > previousFurthestMeasurement.end) {
          furthestMeasurements.set(measurement.lane, measurement);
        } else if (measurement.end < previousFurthestMeasurement.end) {
          furthestMeasurementsFound.set(measurement.lane, true);
        }
        if (furthestMeasurementsFound.size === this.options.lanes) {
          break;
        }
      }
      return furthestMeasurements.size === this.options.lanes ? Array.from(furthestMeasurements.values()).sort((a, b) => {
        if (a.end === b.end) {
          return a.index - b.index;
        }
        return a.end - b.end;
      })[0] : void 0;
    };
    this.getMeasurementOptions = memo(
      () => [
        this.options.count,
        this.options.paddingStart,
        this.options.scrollMargin,
        this.options.getItemKey,
        this.options.enabled,
        this.options.lanes,
        this.options.laneAssignmentMode
      ],
      (count, paddingStart, scrollMargin, getItemKey, enabled, lanes, laneAssignmentMode) => {
        const lanesChanged = this.prevLanes !== void 0 && this.prevLanes !== lanes;
        if (lanesChanged) {
          this.lanesChangedFlag = true;
        }
        this.prevLanes = lanes;
        this.pendingMeasuredCacheIndexes = [];
        return {
          count,
          paddingStart,
          scrollMargin,
          getItemKey,
          enabled,
          lanes,
          laneAssignmentMode
        };
      },
      {
        key: false
      }
    );
    this.getMeasurements = memo(
      () => [this.getMeasurementOptions(), this.itemSizeCache],
      ({
        count,
        paddingStart,
        scrollMargin,
        getItemKey,
        enabled,
        lanes,
        laneAssignmentMode
      }, itemSizeCache) => {
        if (!enabled) {
          this.measurementsCache = [];
          this.itemSizeCache.clear();
          this.laneAssignments.clear();
          return [];
        }
        if (this.laneAssignments.size > count) {
          for (const index of this.laneAssignments.keys()) {
            if (index >= count) {
              this.laneAssignments.delete(index);
            }
          }
        }
        if (this.lanesChangedFlag) {
          this.lanesChangedFlag = false;
          this.lanesSettling = true;
          this.measurementsCache = [];
          this.itemSizeCache.clear();
          this.laneAssignments.clear();
          this.pendingMeasuredCacheIndexes = [];
        }
        if (this.measurementsCache.length === 0 && !this.lanesSettling) {
          this.measurementsCache = this.options.initialMeasurementsCache;
          this.measurementsCache.forEach((item) => {
            this.itemSizeCache.set(item.key, item.size);
          });
        }
        const min = this.lanesSettling ? 0 : this.pendingMeasuredCacheIndexes.length > 0 ? Math.min(...this.pendingMeasuredCacheIndexes) : 0;
        this.pendingMeasuredCacheIndexes = [];
        if (this.lanesSettling && this.measurementsCache.length === count) {
          this.lanesSettling = false;
        }
        const measurements = this.measurementsCache.slice(0, min);
        const laneLastIndex = new Array(lanes).fill(
          void 0
        );
        for (let m = 0; m < min; m++) {
          const item = measurements[m];
          if (item) {
            laneLastIndex[item.lane] = m;
          }
        }
        for (let i = min; i < count; i++) {
          const key = getItemKey(i);
          const cachedLane = this.laneAssignments.get(i);
          let lane;
          let start;
          const shouldCacheLane = laneAssignmentMode === "estimate" || itemSizeCache.has(key);
          if (cachedLane !== void 0 && this.options.lanes > 1) {
            lane = cachedLane;
            const prevIndex = laneLastIndex[lane];
            const prevInLane = prevIndex !== void 0 ? measurements[prevIndex] : void 0;
            start = prevInLane ? prevInLane.end + this.options.gap : paddingStart + scrollMargin;
          } else {
            const furthestMeasurement = this.options.lanes === 1 ? measurements[i - 1] : this.getFurthestMeasurement(measurements, i);
            start = furthestMeasurement ? furthestMeasurement.end + this.options.gap : paddingStart + scrollMargin;
            lane = furthestMeasurement ? furthestMeasurement.lane : i % this.options.lanes;
            if (this.options.lanes > 1 && shouldCacheLane) {
              this.laneAssignments.set(i, lane);
            }
          }
          const measuredSize = itemSizeCache.get(key);
          const size = typeof measuredSize === "number" ? measuredSize : this.options.estimateSize(i);
          const end = start + size;
          measurements[i] = {
            index: i,
            start,
            size,
            end,
            key,
            lane
          };
          laneLastIndex[lane] = i;
        }
        this.measurementsCache = measurements;
        return measurements;
      },
      {
        key: false,
        debug: () => this.options.debug
      }
    );
    this.calculateRange = memo(
      () => [
        this.getMeasurements(),
        this.getSize(),
        this.getScrollOffset(),
        this.options.lanes
      ],
      (measurements, outerSize, scrollOffset, lanes) => {
        return this.range = measurements.length > 0 && outerSize > 0 ? calculateRange({
          measurements,
          outerSize,
          scrollOffset,
          lanes
        }) : null;
      },
      {
        key: false,
        debug: () => this.options.debug
      }
    );
    this.getVirtualIndexes = memo(
      () => {
        let startIndex = null;
        let endIndex = null;
        const range = this.calculateRange();
        if (range) {
          startIndex = range.startIndex;
          endIndex = range.endIndex;
        }
        this.maybeNotify.updateDeps([this.isScrolling, startIndex, endIndex]);
        return [
          this.options.rangeExtractor,
          this.options.overscan,
          this.options.count,
          startIndex,
          endIndex
        ];
      },
      (rangeExtractor, overscan, count, startIndex, endIndex) => {
        return startIndex === null || endIndex === null ? [] : rangeExtractor({
          startIndex,
          endIndex,
          overscan,
          count
        });
      },
      {
        key: false,
        debug: () => this.options.debug
      }
    );
    this.indexFromElement = (node) => {
      const attributeName = this.options.indexAttribute;
      const indexStr = node.getAttribute(attributeName);
      if (!indexStr) {
        console.warn(
          `Missing attribute name '${attributeName}={index}' on measured element.`
        );
        return -1;
      }
      return parseInt(indexStr, 10);
    };
    this.shouldMeasureDuringScroll = (index) => {
      var _a;
      if (!this.scrollState || this.scrollState.behavior !== "smooth") {
        return true;
      }
      const scrollIndex = this.scrollState.index ?? ((_a = this.getVirtualItemForOffset(this.scrollState.lastTargetOffset)) == null ? void 0 : _a.index);
      if (scrollIndex !== void 0 && this.range) {
        const bufferSize = Math.max(
          this.options.overscan,
          Math.ceil((this.range.endIndex - this.range.startIndex) / 2)
        );
        const minIndex = Math.max(0, scrollIndex - bufferSize);
        const maxIndex = Math.min(
          this.options.count - 1,
          scrollIndex + bufferSize
        );
        return index >= minIndex && index <= maxIndex;
      }
      return true;
    };
    this.measureElement = (node) => {
      if (!node) {
        this.elementsCache.forEach((cached, key2) => {
          if (!cached.isConnected) {
            this.observer.unobserve(cached);
            this.elementsCache.delete(key2);
          }
        });
        return;
      }
      const index = this.indexFromElement(node);
      const key = this.options.getItemKey(index);
      const prevNode = this.elementsCache.get(key);
      if (prevNode !== node) {
        if (prevNode) {
          this.observer.unobserve(prevNode);
        }
        this.observer.observe(node);
        this.elementsCache.set(key, node);
      }
      if ((!this.isScrolling || this.scrollState) && this.shouldMeasureDuringScroll(index)) {
        this.resizeItem(index, this.options.measureElement(node, void 0, this));
      }
    };
    this.resizeItem = (index, size) => {
      var _a;
      const item = this.measurementsCache[index];
      if (!item) return;
      const itemSize = this.itemSizeCache.get(item.key) ?? item.size;
      const delta = size - itemSize;
      if (delta !== 0) {
        if (((_a = this.scrollState) == null ? void 0 : _a.behavior) !== "smooth" && (this.shouldAdjustScrollPositionOnItemSizeChange !== void 0 ? this.shouldAdjustScrollPositionOnItemSizeChange(item, delta, this) : item.start < this.getScrollOffset() + this.scrollAdjustments)) {
          this._scrollToOffset(this.getScrollOffset(), {
            adjustments: this.scrollAdjustments += delta,
            behavior: void 0
          });
        }
        this.pendingMeasuredCacheIndexes.push(item.index);
        this.itemSizeCache = new Map(this.itemSizeCache.set(item.key, size));
        this.notify(false);
      }
    };
    this.getVirtualItems = memo(
      () => [this.getVirtualIndexes(), this.getMeasurements()],
      (indexes, measurements) => {
        const virtualItems = [];
        for (let k = 0, len = indexes.length; k < len; k++) {
          const i = indexes[k];
          const measurement = measurements[i];
          virtualItems.push(measurement);
        }
        return virtualItems;
      },
      {
        key: false,
        debug: () => this.options.debug
      }
    );
    this.getVirtualItemForOffset = (offset) => {
      const measurements = this.getMeasurements();
      if (measurements.length === 0) {
        return void 0;
      }
      return notUndefined(
        measurements[findNearestBinarySearch(
          0,
          measurements.length - 1,
          (index) => notUndefined(measurements[index]).start,
          offset
        )]
      );
    };
    this.getMaxScrollOffset = () => {
      if (!this.scrollElement) return 0;
      if ("scrollHeight" in this.scrollElement) {
        return this.options.horizontal ? this.scrollElement.scrollWidth - this.scrollElement.clientWidth : this.scrollElement.scrollHeight - this.scrollElement.clientHeight;
      } else {
        const doc = this.scrollElement.document.documentElement;
        return this.options.horizontal ? doc.scrollWidth - this.scrollElement.innerWidth : doc.scrollHeight - this.scrollElement.innerHeight;
      }
    };
    this.getOffsetForAlignment = (toOffset, align, itemSize = 0) => {
      if (!this.scrollElement) return 0;
      const size = this.getSize();
      const scrollOffset = this.getScrollOffset();
      if (align === "auto") {
        align = toOffset >= scrollOffset + size ? "end" : "start";
      }
      if (align === "center") {
        toOffset += (itemSize - size) / 2;
      } else if (align === "end") {
        toOffset -= size;
      }
      const maxOffset = this.getMaxScrollOffset();
      return Math.max(Math.min(maxOffset, toOffset), 0);
    };
    this.getOffsetForIndex = (index, align = "auto") => {
      index = Math.max(0, Math.min(index, this.options.count - 1));
      const size = this.getSize();
      const scrollOffset = this.getScrollOffset();
      const item = this.measurementsCache[index];
      if (!item) return;
      if (align === "auto") {
        if (item.end >= scrollOffset + size - this.options.scrollPaddingEnd) {
          align = "end";
        } else if (item.start <= scrollOffset + this.options.scrollPaddingStart) {
          align = "start";
        } else {
          return [scrollOffset, align];
        }
      }
      if (align === "end" && index === this.options.count - 1) {
        return [this.getMaxScrollOffset(), align];
      }
      const toOffset = align === "end" ? item.end + this.options.scrollPaddingEnd : item.start - this.options.scrollPaddingStart;
      return [
        this.getOffsetForAlignment(toOffset, align, item.size),
        align
      ];
    };
    this.scrollToOffset = (toOffset, { align = "start", behavior = "auto" } = {}) => {
      const offset = this.getOffsetForAlignment(toOffset, align);
      const now = this.now();
      this.scrollState = {
        index: null,
        align,
        behavior,
        startedAt: now,
        lastTargetOffset: offset,
        stableFrames: 0
      };
      this._scrollToOffset(offset, { adjustments: void 0, behavior });
      this.scheduleScrollReconcile();
    };
    this.scrollToIndex = (index, {
      align: initialAlign = "auto",
      behavior = "auto"
    } = {}) => {
      index = Math.max(0, Math.min(index, this.options.count - 1));
      const offsetInfo = this.getOffsetForIndex(index, initialAlign);
      if (!offsetInfo) {
        return;
      }
      const [offset, align] = offsetInfo;
      const now = this.now();
      this.scrollState = {
        index,
        align,
        behavior,
        startedAt: now,
        lastTargetOffset: offset,
        stableFrames: 0
      };
      this._scrollToOffset(offset, { adjustments: void 0, behavior });
      this.scheduleScrollReconcile();
    };
    this.scrollBy = (delta, { behavior = "auto" } = {}) => {
      const offset = this.getScrollOffset() + delta;
      const now = this.now();
      this.scrollState = {
        index: null,
        align: "start",
        behavior,
        startedAt: now,
        lastTargetOffset: offset,
        stableFrames: 0
      };
      this._scrollToOffset(offset, { adjustments: void 0, behavior });
      this.scheduleScrollReconcile();
    };
    this.getTotalSize = () => {
      var _a;
      const measurements = this.getMeasurements();
      let end;
      if (measurements.length === 0) {
        end = this.options.paddingStart;
      } else if (this.options.lanes === 1) {
        end = ((_a = measurements[measurements.length - 1]) == null ? void 0 : _a.end) ?? 0;
      } else {
        const endByLane = Array(this.options.lanes).fill(null);
        let endIndex = measurements.length - 1;
        while (endIndex >= 0 && endByLane.some((val) => val === null)) {
          const item = measurements[endIndex];
          if (endByLane[item.lane] === null) {
            endByLane[item.lane] = item.end;
          }
          endIndex--;
        }
        end = Math.max(...endByLane.filter((val) => val !== null));
      }
      return Math.max(
        end - this.options.scrollMargin + this.options.paddingEnd,
        0
      );
    };
    this._scrollToOffset = (offset, {
      adjustments,
      behavior
    }) => {
      this.options.scrollToFn(offset, { behavior, adjustments }, this);
    };
    this.measure = () => {
      this.itemSizeCache = /* @__PURE__ */ new Map();
      this.laneAssignments = /* @__PURE__ */ new Map();
      this.notify(false);
    };
    this.setOptions(opts);
  }
  scheduleScrollReconcile() {
    if (!this.targetWindow) {
      this.scrollState = null;
      return;
    }
    if (this.rafId != null) return;
    this.rafId = this.targetWindow.requestAnimationFrame(() => {
      this.rafId = null;
      this.reconcileScroll();
    });
  }
  reconcileScroll() {
    if (!this.scrollState) return;
    const el = this.scrollElement;
    if (!el) return;
    const MAX_RECONCILE_MS = 5e3;
    if (this.now() - this.scrollState.startedAt > MAX_RECONCILE_MS) {
      this.scrollState = null;
      return;
    }
    const offsetInfo = this.scrollState.index != null ? this.getOffsetForIndex(this.scrollState.index, this.scrollState.align) : void 0;
    const targetOffset = offsetInfo ? offsetInfo[0] : this.scrollState.lastTargetOffset;
    const STABLE_FRAMES = 1;
    const targetChanged = targetOffset !== this.scrollState.lastTargetOffset;
    if (!targetChanged && approxEqual(targetOffset, this.getScrollOffset())) {
      this.scrollState.stableFrames++;
      if (this.scrollState.stableFrames >= STABLE_FRAMES) {
        this.scrollState = null;
        return;
      }
    } else {
      this.scrollState.stableFrames = 0;
      if (targetChanged) {
        this.scrollState.lastTargetOffset = targetOffset;
        this.scrollState.behavior = "auto";
        this._scrollToOffset(targetOffset, {
          adjustments: void 0,
          behavior: "auto"
        });
      }
    }
    this.scheduleScrollReconcile();
  }
}
const findNearestBinarySearch = (low, high, getCurrentValue, value) => {
  while (low <= high) {
    const middle = (low + high) / 2 | 0;
    const currentValue = getCurrentValue(middle);
    if (currentValue < value) {
      low = middle + 1;
    } else if (currentValue > value) {
      high = middle - 1;
    } else {
      return middle;
    }
  }
  if (low > 0) {
    return low - 1;
  } else {
    return 0;
  }
};
function calculateRange({
  measurements,
  outerSize,
  scrollOffset,
  lanes
}) {
  const lastIndex = measurements.length - 1;
  const getOffset = (index) => measurements[index].start;
  if (measurements.length <= lanes) {
    return {
      startIndex: 0,
      endIndex: lastIndex
    };
  }
  let startIndex = findNearestBinarySearch(
    0,
    lastIndex,
    getOffset,
    scrollOffset
  );
  let endIndex = startIndex;
  if (lanes === 1) {
    while (endIndex < lastIndex && measurements[endIndex].end < scrollOffset + outerSize) {
      endIndex++;
    }
  } else if (lanes > 1) {
    const endPerLane = Array(lanes).fill(0);
    while (endIndex < lastIndex && endPerLane.some((pos) => pos < scrollOffset + outerSize)) {
      const item = measurements[endIndex];
      endPerLane[item.lane] = item.end;
      endIndex++;
    }
    const startPerLane = Array(lanes).fill(scrollOffset + outerSize);
    while (startIndex >= 0 && startPerLane.some((pos) => pos >= scrollOffset)) {
      const item = measurements[startIndex];
      startPerLane[item.lane] = item.start;
      startIndex--;
    }
    startIndex = Math.max(0, startIndex - startIndex % lanes);
    endIndex = Math.min(lastIndex, endIndex + (lanes - 1 - endIndex % lanes));
  }
  return { startIndex, endIndex };
}
const useIsomorphicLayoutEffect = typeof document !== "undefined" ? reactExports.useLayoutEffect : reactExports.useEffect;
function useVirtualizerBase({
  useFlushSync = true,
  ...options
}) {
  const rerender = reactExports.useReducer(() => ({}), {})[1];
  const resolvedOptions = {
    ...options,
    onChange: (instance2, sync) => {
      var _a;
      if (useFlushSync && sync) {
        reactDomExports.flushSync(rerender);
      } else {
        rerender();
      }
      (_a = options.onChange) == null ? void 0 : _a.call(options, instance2, sync);
    }
  };
  const [instance] = reactExports.useState(
    () => new Virtualizer2(resolvedOptions)
  );
  instance.setOptions(resolvedOptions);
  useIsomorphicLayoutEffect(() => {
    return instance._didMount();
  }, []);
  useIsomorphicLayoutEffect(() => {
    return instance._willUpdate();
  });
  return instance;
}
function useVirtualizer(options) {
  return useVirtualizerBase({
    observeElementRect,
    observeElementOffset,
    scrollToFn: elementScroll,
    ...options
  });
}
const PREFETCH_AHEAD = 200;
const PREFETCH_BEHIND = 100;
const CHUNK_SIZE = 300;
function useLocalVirtualLines(tabId) {
  const { localTabs, addLocalLines } = useDesktopStore();
  const tab = localTabs.find((t) => t.id === tabId);
  const totalLines = tab?.totalLines ?? 0;
  const inFlight = reactExports.useRef(/* @__PURE__ */ new Set());
  reactExports.useEffect(() => {
    if (!tab) return;
    const unsub = window.electronAPI.onLocalFileNewLines((path, lines) => {
      if (path !== tab.filePath) return;
      addLocalLines(path, totalLines, lines);
    });
    return unsub;
  }, [tab?.filePath, totalLines]);
  const ensureRange = reactExports.useCallback(
    (startLine, count) => {
      if (!tab || totalLines === 0) return;
      const rangeStart = Math.max(0, startLine - PREFETCH_BEHIND);
      const rangeEnd = Math.min(totalLines - 1, startLine + count + PREFETCH_AHEAD);
      const buf = tab.buffer;
      for (let lineNum = rangeStart; lineNum <= rangeEnd; lineNum++) {
        if (!buf.has(lineNum)) {
          const chunkStart = Math.floor(lineNum / CHUNK_SIZE) * CHUNK_SIZE;
          if (!inFlight.current.has(chunkStart)) {
            inFlight.current.add(chunkStart);
            const chunkCount = Math.min(CHUNK_SIZE, totalLines - chunkStart);
            window.electronAPI.readLocalFile(tab.filePath, chunkStart, chunkCount).then((lines) => {
              addLocalLines(
                tab.filePath,
                chunkStart,
                lines.map((l) => l.text)
              );
            }).catch((e) => console.error("localFile:read error", e)).finally(() => inFlight.current.delete(chunkStart));
          }
          lineNum = chunkStart + CHUNK_SIZE - 1;
        }
      }
    },
    [tab, totalLines, addLocalLines]
  );
  const getLineText = reactExports.useCallback(
    (lineNumber) => tab?.buffer.get(lineNumber),
    [tab]
  );
  return { ensureRange, getLineText, totalLines };
}
const LINE_HEIGHT = 20;
function LocalLogViewer({ tabId }) {
  const { localTabs, updateLocalTab } = useDesktopStore();
  const tab = localTabs.find((t) => t.id === tabId);
  const { defaultHighlights, profiles } = usePreferencesStore();
  const { fontFamily, fontSize } = useUiStore();
  const { ensureRange, getLineText, totalLines } = useLocalVirtualLines(tabId);
  const scrollRef = reactExports.useRef(null);
  const profileHighlights = reactExports.useMemo(() => {
    const profileName = tab?.filterPattern ? void 0 : void 0;
    return profiles.find((p) => p.name === profileName)?.dicoHighLighting ?? [];
  }, [profiles, tab]);
  const highlight = useHighlighting(profileHighlights, defaultHighlights);
  const rowCount = totalLines > 0 ? totalLines : 0;
  const virtualizer = useVirtualizer({
    count: rowCount,
    getScrollElement: () => scrollRef.current,
    estimateSize: () => LINE_HEIGHT,
    overscan: 40
  });
  const items = virtualizer.getVirtualItems();
  reactExports.useEffect(() => {
    if (items.length === 0) return;
    const start = items[0].index;
    const count = items[items.length - 1].index - start + 1;
    ensureRange(start, count);
  }, [items, ensureRange]);
  reactExports.useEffect(() => {
    if (tab?.tailMode && scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [tab?.tailMode, totalLines]);
  const handleScroll = reactExports.useCallback(() => {
    if (!scrollRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
    const atBottom = scrollHeight - scrollTop - clientHeight < LINE_HEIGHT * 2;
    if (tab && atBottom !== tab.tailMode) {
      updateLocalTab(tabId, { tailMode: atBottom });
    }
  }, [tab, tabId, updateLocalTab]);
  if (!tab) return null;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "log-viewer",
      style: {
        fontFamily,
        fontSize,
        display: "flex",
        flexDirection: "column",
        height: "100%",
        overflow: "hidden"
      },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "log-status-bar",
            style: { flexShrink: 0 },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: "var(--text-3)", fontSize: 11 }, children: tab.displayName }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { style: { marginLeft: "auto", color: "var(--text-3)", fontSize: 11 }, children: [
                totalLines.toLocaleString(),
                " lines",
                tab.info.sizeBytes > 0 && ` · ${(tab.info.sizeBytes / 1024).toFixed(1)} KB`,
                tab.tailMode && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: "var(--accent)", marginLeft: 8 }, children: "TAIL" })
              ] })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            ref: scrollRef,
            className: "log-scroll-area",
            style: { flex: 1, overflow: "auto" },
            onScroll: handleScroll,
            children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { height: virtualizer.getTotalSize(), position: "relative" }, children: items.map((item) => {
              const text = getLineText(item.index);
              const segments = text !== void 0 ? highlight(text) : void 0;
              return /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  style: {
                    position: "absolute",
                    top: item.start,
                    left: 0,
                    right: 0,
                    height: LINE_HEIGHT
                  },
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                    LogLine,
                    {
                      lineNumber: item.index,
                      text,
                      segments
                    }
                  )
                },
                item.key
              );
            }) })
          }
        )
      ]
    }
  );
}
function DesktopDockArea({ hub }) {
  const { tabs: remoteTabs, activeSessionId, setActive: setActiveRemote, removeTab } = useTabStore();
  const {
    localTabs,
    activeLocalTabId,
    setActiveLocalTab,
    closeLocalTab
  } = useDesktopStore();
  const [activeKind, setActiveKind] = reactExports.useState("remote");
  const hubRef = reactExports.useRef(hub);
  hubRef.current = hub;
  const [menu, setMenu] = reactExports.useState(null);
  const activeRemote = remoteTabs.find((t) => t.sessionId === activeSessionId);
  const activeLocal = localTabs.find((t) => t.id === activeLocalTabId);
  const hasAnyTab = remoteTabs.length > 0 || localTabs.length > 0;
  reactExports.useEffect(() => {
    if (activeLocalTabId) setActiveKind("local");
  }, [activeLocalTabId]);
  const handleCloseRemote = reactExports.useCallback(
    (e, sessionId) => {
      e.stopPropagation();
      hubRef.current.invoke("CloseLog", sessionId).catch(() => {
      });
      removeTab(sessionId);
    },
    [removeTab]
  );
  const handleCloseLocal = reactExports.useCallback(
    (e, id) => {
      e.stopPropagation();
      window.electronAPI.unwatchLocalFile(id).catch(() => {
      });
      closeLocalTab(id);
    },
    [closeLocalTab]
  );
  reactExports.useEffect(() => {
    if (!menu) return;
    const onClose = () => setMenu(null);
    window.addEventListener("mousedown", onClose);
    return () => window.removeEventListener("mousedown", onClose);
  }, [menu]);
  if (!hasAnyTab) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "dock-area", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "tab-strip", style: { scrollbarWidth: "none" } }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "empty-state viewer-empty-state", children: [
        "Double-click a remote file in the browser, or",
        " ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "drop a local log file" }),
        " here to open it."
      ] })
    ] });
  }
  const isLocalActive = activeKind === "local" && !!activeLocal;
  isLocalActive ? activeLocal : activeRemote ?? remoteTabs[0];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "dock-area", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "tab-strip", style: { scrollbarWidth: "none" }, children: [
      remoteTabs.map((tab) => {
        const isActive = activeKind === "remote" && activeSessionId === tab.sessionId;
        return /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            onClick: () => {
              setActiveRemote(tab.sessionId);
              setActiveKind("remote");
            },
            onContextMenu: (e) => {
              e.preventDefault();
              setMenu({ x: e.clientX, y: e.clientY, kind: "remote", id: tab.sessionId });
            },
            className: `tab-pill ${isActive ? "tab-pill--active" : ""}`,
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "tab-pill__title", title: tab.displayName, children: [
                tab.newLinesCount > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "tab-pill__badge", children: tab.newLinesCount }),
                tab.displayName
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  className: "tab-pill__close",
                  onClick: (e) => handleCloseRemote(e, tab.sessionId),
                  "aria-label": `Close ${tab.displayName}`,
                  children: "×"
                }
              )
            ]
          },
          tab.sessionId
        );
      }),
      remoteTabs.length > 0 && localTabs.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          style: {
            width: 1,
            background: "var(--border-strong)",
            margin: "6px 4px",
            alignSelf: "stretch"
          }
        }
      ),
      localTabs.map((tab) => {
        const isActive = activeKind === "local" && activeLocalTabId === tab.id;
        return /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            onClick: () => {
              setActiveLocalTab(tab.id);
              setActiveKind("local");
            },
            className: `tab-pill tab-pill--local ${isActive ? "tab-pill--active" : ""}`,
            title: tab.filePath,
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "tab-pill__icon", "aria-hidden": true, children: "📄" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "tab-pill__title", children: tab.displayName }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  className: "tab-pill__close",
                  onClick: (e) => handleCloseLocal(e, tab.id),
                  "aria-label": `Close ${tab.displayName}`,
                  children: "×"
                }
              )
            ]
          },
          tab.id
        );
      })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { flex: 1, minHeight: 0 }, children: [
      remoteTabs.map((tab) => /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          style: {
            display: activeKind === "remote" && activeSessionId === tab.sessionId ? "flex" : "none",
            flexDirection: "column",
            height: "100%"
          },
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(LogViewer, { sessionId: tab.sessionId, hub })
        },
        tab.sessionId
      )),
      localTabs.map((tab) => /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          style: {
            display: activeKind === "local" && activeLocalTabId === tab.id ? "flex" : "none",
            flexDirection: "column",
            height: "100%"
          },
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(LocalLogViewer, { tabId: tab.id })
        },
        tab.id
      ))
    ] }),
    menu && reactDomExports.createPortal(
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "tab-context-menu",
          style: { top: menu.y, left: menu.x },
          onMouseDown: (e) => e.stopPropagation(),
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                className: "tab-context-menu__item",
                onClick: () => {
                  if (menu.kind === "remote") {
                    hubRef.current.invoke("CloseLog", menu.id).catch(() => {
                    });
                    removeTab(menu.id);
                  } else {
                    window.electronAPI.unwatchLocalFile(menu.id).catch(() => {
                    });
                    closeLocalTab(menu.id);
                  }
                  setMenu(null);
                },
                children: "Close tab"
              }
            ),
            menu.kind === "remote" && /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                className: "tab-context-menu__item",
                onClick: () => {
                  const others = remoteTabs.filter((t) => t.sessionId !== menu.id);
                  others.forEach((t) => {
                    hubRef.current.invoke("CloseLog", t.sessionId).catch(() => {
                    });
                    removeTab(t.sessionId);
                  });
                  setMenu(null);
                },
                children: "Close other remote tabs"
              }
            )
          ]
        }
      ),
      document.body
    )
  ] });
}
function LocalFileDrop({ children }) {
  const { openLocalTab } = useDesktopStore();
  const [isDragging, setIsDragging] = reactExports.useState(false);
  const dragCounter = reactExports.useRef(0);
  const openFile = reactExports.useCallback(
    async (filePath) => {
      try {
        const info = await window.electronAPI.getLocalFileInfo(filePath);
        openLocalTab(info);
        window.electronAPI.watchLocalFile(filePath).catch(() => {
        });
      } catch (err) {
        console.error("Cannot open local file:", err);
      }
    },
    [openLocalTab]
  );
  const handleDragEnter = reactExports.useCallback((e) => {
    e.preventDefault();
    dragCounter.current++;
    if (e.dataTransfer.types.includes("Files")) {
      setIsDragging(true);
    }
  }, []);
  const handleDragLeave = reactExports.useCallback(() => {
    dragCounter.current--;
    if (dragCounter.current <= 0) {
      dragCounter.current = 0;
      setIsDragging(false);
    }
  }, []);
  const handleDragOver = reactExports.useCallback((e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "open";
  }, []);
  const handleDrop = reactExports.useCallback(
    async (e) => {
      e.preventDefault();
      dragCounter.current = 0;
      setIsDragging(false);
      const files = Array.from(e.dataTransfer.files);
      for (const file of files) {
        const path = file.path;
        if (path) await openFile(path);
      }
    },
    [openFile]
  );
  const handleBrowse = reactExports.useCallback(async () => {
    const filePath = await window.electronAPI.openFileDialog();
    if (filePath) await openFile(filePath);
  }, [openFile]);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      style: { position: "relative", display: "contents" },
      onDragEnter: handleDragEnter,
      onDragLeave: handleDragLeave,
      onDragOver: handleDragOver,
      onDrop: handleDrop,
      children: [
        children,
        isDragging && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "local-drop-overlay", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "local-drop-hint", children: "Drop log file to open" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            id: "desktop-browse-btn",
            type: "button",
            className: "desktop-browse-btn",
            onClick: handleBrowse,
            title: "Open local log file",
            "aria-label": "Open local log file",
            children: "Open local file…"
          }
        )
      ]
    }
  );
}
function DesktopLayout({
  hub,
  onOpenPreferences,
  onOpenLogBrowserSettings,
  onLogout,
  onChangeServer
}) {
  const [filterRefreshTick, setFilterRefreshTick] = reactExports.useState(0);
  const [pendingPattern, setPendingPattern] = reactExports.useState(null);
  const [pendingApplyRequest, setPendingApplyRequest] = reactExports.useState(null);
  const [isBrowserVisible, setIsBrowserVisible] = reactExports.useState(true);
  const [isInspectorVisible, setIsInspectorVisible] = reactExports.useState(true);
  const { theme, fontFamily, fontSize } = useUiStore();
  reactExports.useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.documentElement.style.setProperty("--user-font-family", fontFamily);
    document.documentElement.style.setProperty("--user-font-size", `${fontSize}px`);
  }, [theme, fontFamily, fontSize]);
  const handleFilterApplied = reactExports.useCallback(() => setFilterRefreshTick((t) => t + 1), []);
  const handleSelectHistoryPattern = reactExports.useCallback((pattern) => {
    setPendingPattern(pattern);
  }, []);
  const handleApplyHistoryPattern = reactExports.useCallback((pattern) => {
    setPendingPattern(pattern);
    setPendingApplyRequest({ id: Date.now(), pattern });
  }, []);
  const toggleBrowserPanel = reactExports.useCallback(() => setIsBrowserVisible((v) => !v), []);
  const toggleInspectorPanel = reactExports.useCallback(() => setIsInspectorVisible((v) => !v), []);
  const { openLocalTab } = useDesktopStore();
  const handleOpenLocalFile = reactExports.useCallback(async () => {
    const filePath = await window.electronAPI.openFileDialog();
    if (!filePath) return;
    const info = await window.electronAPI.getLocalFileInfo(filePath);
    openLocalTab(info);
    window.electronAPI.watchLocalFile(filePath).catch(() => {
    });
  }, [openLocalTab]);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "app-shell", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      MainToolbar,
      {
        hub,
        onOpenPreferences,
        onFilterApplied: handleFilterApplied,
        pendingPattern,
        pendingApplyRequest,
        onPendingPatternConsumed: () => setPendingPattern(null),
        onPendingApplyRequestConsumed: () => setPendingApplyRequest(null)
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "workspace-body", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Ut$1, { orientation: "horizontal", style: { height: "100%", width: "100%" }, children: [
      isBrowserVisible && /* @__PURE__ */ jsxRuntimeExports.jsx(Yt$1, { defaultSize: 24, minSize: 0, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "workspace-panel workspace-panel--browser", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            style: {
              padding: "6px 8px",
              borderBottom: "1px solid var(--border-subtle)",
              display: "flex",
              gap: 6
            },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  className: "toolbar-btn",
                  onClick: handleOpenLocalFile,
                  title: "Open a local log file",
                  children: "📄 Open local file…"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  className: "toolbar-btn toolbar-btn--ghost",
                  onClick: onLogout,
                  title: "Sign out (stay on this server)",
                  style: { marginLeft: "auto" },
                  children: "Sign out"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  className: "toolbar-btn toolbar-btn--ghost",
                  onClick: onChangeServer,
                  title: "Disconnect and change server",
                  children: "Change server…"
                }
              )
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(LogBrowser, { onOpenSettings: onOpenLogBrowserSettings })
      ] }) }),
      isBrowserVisible && /* @__PURE__ */ jsxRuntimeExports.jsx(Qt$1, { className: "workspace-separator workspace-separator--vertical", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          onClick: toggleBrowserPanel,
          className: "separator-toggle separator-toggle--left",
          title: "Hide browser",
          "aria-label": "Hide browser",
          children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { "aria-hidden": true, children: "◂" })
        }
      ) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Yt$1, { defaultSize: isBrowserVisible || isInspectorVisible ? 52 : 100, minSize: 20, children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "workspace-panel workspace-panel--viewer", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "viewer-canvas", children: [
        !isInspectorVisible && /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            onClick: toggleInspectorPanel,
            className: "edge-toggle edge-toggle--right",
            title: "Show inspector",
            "aria-label": "Show inspector",
            children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { "aria-hidden": true, children: "◂" })
          }
        ),
        !isBrowserVisible && /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            onClick: toggleBrowserPanel,
            className: "edge-toggle edge-toggle--left",
            title: "Show browser",
            "aria-label": "Show browser",
            children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { "aria-hidden": true, children: "▸" })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(LocalFileDrop, { children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { style: { height: "100%", minHeight: 0 }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(DesktopDockArea, { hub }) }) })
      ] }) }) }),
      isInspectorVisible && /* @__PURE__ */ jsxRuntimeExports.jsx(Qt$1, { className: "workspace-separator workspace-separator--vertical", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          onClick: toggleInspectorPanel,
          className: "separator-toggle separator-toggle--right",
          title: "Hide inspector",
          "aria-label": "Hide inspector",
          children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { "aria-hidden": true, children: "▸" })
        }
      ) }),
      isInspectorVisible && /* @__PURE__ */ jsxRuntimeExports.jsx(Yt$1, { defaultSize: 24, minSize: 0, children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "workspace-panel workspace-panel--inspector", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        SessionInspector,
        {
          onSelectPattern: handleSelectHistoryPattern,
          onApplyPattern: handleApplyHistoryPattern,
          filterRefreshTick
        }
      ) }) })
    ] }) })
  ] });
}
function App() {
  const { serverUrl, setServerUrl, clearServerUrl } = useDesktopStore();
  const [token, setToken] = reactExports.useState(() => localStorage.getItem("logwatcher_token"));
  reactExports.useEffect(() => {
    setHubBaseUrl(serverUrl);
  }, [serverUrl]);
  if (!serverUrl) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      ServerConfigScreen,
      {
        onSave: (url) => {
          window.electronAPI.setConfig({ serverUrl: url });
          setServerUrl(url);
          setHubBaseUrl(url);
          const origFetch = globalThis.fetch.bind(globalThis);
          globalThis.fetch = (input, init) => {
            if (typeof input === "string" && input.startsWith("/")) {
              return origFetch(url + input, init);
            }
            return origFetch(input, init);
          };
        }
      }
    );
  }
  if (!token) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      LoginScreen,
      {
        onLogin: (t) => {
          localStorage.setItem("logwatcher_token", t);
          setToken(t);
        }
      }
    );
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    LoggedInApp,
    {
      onLogout: () => {
        localStorage.removeItem("logwatcher_token");
        stopLogHub().catch(() => {
        });
        setToken(null);
      },
      onChangeServer: () => {
        localStorage.removeItem("logwatcher_token");
        stopLogHub().catch(() => {
        });
        setToken(null);
        clearServerUrl();
      }
    }
  );
}
function LoggedInApp({ onLogout, onChangeServer }) {
  const hub = useLogHub();
  const { fetchPerimeters, perimeters, selectPerimeter } = usePerimeterStore();
  const { fetchPreferences } = usePreferencesStore();
  const [showPreferences, setShowPreferences] = reactExports.useState(false);
  const [showLogBrowserSettings, setShowLogBrowserSettings] = reactExports.useState(false);
  const [isInitialized, setIsInitialized] = reactExports.useState(false);
  reactExports.useEffect(() => {
    fetchPerimeters().catch(() => {
    });
  }, [fetchPerimeters]);
  reactExports.useEffect(() => {
    fetchPreferences().catch(() => {
    });
  }, [fetchPreferences]);
  reactExports.useEffect(() => {
    if (isInitialized || !perimeters.length) return;
    const last = localStorage.getItem("logwatcher_last_perimeter");
    const target = perimeters.find((p) => p.id === last) ?? perimeters[0];
    if (target) selectPerimeter(target.id);
    setIsInitialized(true);
  }, [perimeters, isInitialized, selectPerimeter]);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      DesktopLayout,
      {
        hub,
        onOpenPreferences: () => setShowPreferences(true),
        onOpenLogBrowserSettings: () => setShowLogBrowserSettings(true),
        onLogout,
        onChangeServer
      }
    ),
    showPreferences && /* @__PURE__ */ jsxRuntimeExports.jsx(PreferencesScreen, { onClose: () => setShowPreferences(false) }),
    showLogBrowserSettings && /* @__PURE__ */ jsxRuntimeExports.jsx(LogBrowserSettingsScreen, { onClose: () => setShowLogBrowserSettings(false) })
  ] });
}
{
  const saved = localStorage.getItem("logwatcher_theme") ?? "dark";
  document.documentElement.dataset.theme = saved;
}
const api = window.electronAPI;
const _serverUrl = api?.initialServerUrl ?? "";
if (_serverUrl) {
  const _origFetch = globalThis.fetch.bind(globalThis);
  globalThis.fetch = (input, init) => {
    if (typeof input === "string" && input.startsWith("/")) {
      return _origFetch(_serverUrl + input, init);
    }
    if (input instanceof Request && input.url.startsWith("/")) {
      return _origFetch(new Request(_serverUrl + input.url, input), init);
    }
    return _origFetch(input, init);
  };
  setHubBaseUrl(_serverUrl);
}
ReactDOM.createRoot(document.getElementById("root")).render(
  /* @__PURE__ */ jsxRuntimeExports.jsx(React.StrictMode, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(App, {}) })
);
