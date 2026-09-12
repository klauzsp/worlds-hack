var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __esm = (fn, res, err) => function __init() {
  if (err) throw err[0];
  try {
    return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
  } catch (e) {
    throw err = [e], e;
  }
};
var __commonJS = (cb, mod) => function __require() {
  try {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  } catch (e) {
    throw mod = 0, e;
  }
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// node_modules/awaitqueue/node_modules/ms/index.js
var require_ms = __commonJS({
  "node_modules/awaitqueue/node_modules/ms/index.js"(exports, module) {
    var s = 1e3;
    var m = s * 60;
    var h = m * 60;
    var d = h * 24;
    var w = d * 7;
    var y = d * 365.25;
    module.exports = function(val, options) {
      options = options || {};
      var type = typeof val;
      if (type === "string" && val.length > 0) {
        return parse(val);
      } else if (type === "number" && isFinite(val)) {
        return options.long ? fmtLong(val) : fmtShort(val);
      }
      throw new Error(
        "val is not a non-empty string or a valid number. val=" + JSON.stringify(val)
      );
    };
    function parse(str) {
      str = String(str);
      if (str.length > 100) {
        return;
      }
      var match = /^(-?(?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w|years?|yrs?|y)?$/i.exec(
        str
      );
      if (!match) {
        return;
      }
      var n = parseFloat(match[1]);
      var type = (match[2] || "ms").toLowerCase();
      switch (type) {
        case "years":
        case "year":
        case "yrs":
        case "yr":
        case "y":
          return n * y;
        case "weeks":
        case "week":
        case "w":
          return n * w;
        case "days":
        case "day":
        case "d":
          return n * d;
        case "hours":
        case "hour":
        case "hrs":
        case "hr":
        case "h":
          return n * h;
        case "minutes":
        case "minute":
        case "mins":
        case "min":
        case "m":
          return n * m;
        case "seconds":
        case "second":
        case "secs":
        case "sec":
        case "s":
          return n * s;
        case "milliseconds":
        case "millisecond":
        case "msecs":
        case "msec":
        case "ms":
          return n;
        default:
          return void 0;
      }
    }
    function fmtShort(ms) {
      var msAbs = Math.abs(ms);
      if (msAbs >= d) {
        return Math.round(ms / d) + "d";
      }
      if (msAbs >= h) {
        return Math.round(ms / h) + "h";
      }
      if (msAbs >= m) {
        return Math.round(ms / m) + "m";
      }
      if (msAbs >= s) {
        return Math.round(ms / s) + "s";
      }
      return ms + "ms";
    }
    function fmtLong(ms) {
      var msAbs = Math.abs(ms);
      if (msAbs >= d) {
        return plural(ms, msAbs, d, "day");
      }
      if (msAbs >= h) {
        return plural(ms, msAbs, h, "hour");
      }
      if (msAbs >= m) {
        return plural(ms, msAbs, m, "minute");
      }
      if (msAbs >= s) {
        return plural(ms, msAbs, s, "second");
      }
      return ms + " ms";
    }
    function plural(ms, msAbs, n, name) {
      var isPlural = msAbs >= n * 1.5;
      return Math.round(ms / n) + " " + name + (isPlural ? "s" : "");
    }
  }
});

// node_modules/awaitqueue/node_modules/debug/src/common.js
var require_common = __commonJS({
  "node_modules/awaitqueue/node_modules/debug/src/common.js"(exports, module) {
    function setup(env) {
      createDebug.debug = createDebug;
      createDebug.default = createDebug;
      createDebug.coerce = coerce;
      createDebug.disable = disable;
      createDebug.enable = enable;
      createDebug.enabled = enabled;
      createDebug.humanize = require_ms();
      createDebug.destroy = destroy;
      Object.keys(env).forEach((key) => {
        createDebug[key] = env[key];
      });
      createDebug.names = [];
      createDebug.skips = [];
      createDebug.formatters = {};
      function selectColor(namespace) {
        let hash = 0;
        for (let i = 0; i < namespace.length; i++) {
          hash = (hash << 5) - hash + namespace.charCodeAt(i);
          hash |= 0;
        }
        return createDebug.colors[Math.abs(hash) % createDebug.colors.length];
      }
      createDebug.selectColor = selectColor;
      function createDebug(namespace) {
        let prevTime;
        let enableOverride = null;
        let namespacesCache;
        let enabledCache;
        function debug(...args) {
          if (!debug.enabled) {
            return;
          }
          const self = debug;
          const curr = Number(/* @__PURE__ */ new Date());
          const ms = curr - (prevTime || curr);
          self.diff = ms;
          self.prev = prevTime;
          self.curr = curr;
          prevTime = curr;
          args[0] = createDebug.coerce(args[0]);
          if (typeof args[0] !== "string") {
            args.unshift("%O");
          }
          let index = 0;
          args[0] = args[0].replace(/%([a-zA-Z%])/g, (match, format) => {
            if (match === "%%") {
              return "%";
            }
            index++;
            const formatter = createDebug.formatters[format];
            if (typeof formatter === "function") {
              const val = args[index];
              match = formatter.call(self, val);
              args.splice(index, 1);
              index--;
            }
            return match;
          });
          createDebug.formatArgs.call(self, args);
          const logFn = self.log || createDebug.log;
          logFn.apply(self, args);
        }
        debug.namespace = namespace;
        debug.useColors = createDebug.useColors();
        debug.color = createDebug.selectColor(namespace);
        debug.extend = extend;
        debug.destroy = createDebug.destroy;
        Object.defineProperty(debug, "enabled", {
          enumerable: true,
          configurable: false,
          get: () => {
            if (enableOverride !== null) {
              return enableOverride;
            }
            if (namespacesCache !== createDebug.namespaces) {
              namespacesCache = createDebug.namespaces;
              enabledCache = createDebug.enabled(namespace);
            }
            return enabledCache;
          },
          set: (v) => {
            enableOverride = v;
          }
        });
        if (typeof createDebug.init === "function") {
          createDebug.init(debug);
        }
        return debug;
      }
      function extend(namespace, delimiter) {
        const newDebug = createDebug(this.namespace + (typeof delimiter === "undefined" ? ":" : delimiter) + namespace);
        newDebug.log = this.log;
        return newDebug;
      }
      function enable(namespaces) {
        createDebug.save(namespaces);
        createDebug.namespaces = namespaces;
        createDebug.names = [];
        createDebug.skips = [];
        const split = (typeof namespaces === "string" ? namespaces : "").trim().replace(/\s+/g, ",").split(",").filter(Boolean);
        for (const ns of split) {
          if (ns[0] === "-") {
            createDebug.skips.push(ns.slice(1));
          } else {
            createDebug.names.push(ns);
          }
        }
      }
      function matchesTemplate(search, template) {
        let searchIndex = 0;
        let templateIndex = 0;
        let starIndex = -1;
        let matchIndex = 0;
        while (searchIndex < search.length) {
          if (templateIndex < template.length && (template[templateIndex] === search[searchIndex] || template[templateIndex] === "*")) {
            if (template[templateIndex] === "*") {
              starIndex = templateIndex;
              matchIndex = searchIndex;
              templateIndex++;
            } else {
              searchIndex++;
              templateIndex++;
            }
          } else if (starIndex !== -1) {
            templateIndex = starIndex + 1;
            matchIndex++;
            searchIndex = matchIndex;
          } else {
            return false;
          }
        }
        while (templateIndex < template.length && template[templateIndex] === "*") {
          templateIndex++;
        }
        return templateIndex === template.length;
      }
      function disable() {
        const namespaces = [
          ...createDebug.names,
          ...createDebug.skips.map((namespace) => "-" + namespace)
        ].join(",");
        createDebug.enable("");
        return namespaces;
      }
      function enabled(name) {
        for (const skip of createDebug.skips) {
          if (matchesTemplate(name, skip)) {
            return false;
          }
        }
        for (const ns of createDebug.names) {
          if (matchesTemplate(name, ns)) {
            return true;
          }
        }
        return false;
      }
      function coerce(val) {
        if (val instanceof Error) {
          return val.stack || val.message;
        }
        return val;
      }
      function destroy() {
        console.warn("Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`.");
      }
      createDebug.enable(createDebug.load());
      return createDebug;
    }
    module.exports = setup;
  }
});

// node_modules/awaitqueue/node_modules/debug/src/browser.js
var require_browser = __commonJS({
  "node_modules/awaitqueue/node_modules/debug/src/browser.js"(exports, module) {
    exports.formatArgs = formatArgs;
    exports.save = save;
    exports.load = load;
    exports.useColors = useColors;
    exports.storage = localstorage();
    exports.destroy = /* @__PURE__ */ (() => {
      let warned = false;
      return () => {
        if (!warned) {
          warned = true;
          console.warn("Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`.");
        }
      };
    })();
    exports.colors = [
      "#0000CC",
      "#0000FF",
      "#0033CC",
      "#0033FF",
      "#0066CC",
      "#0066FF",
      "#0099CC",
      "#0099FF",
      "#00CC00",
      "#00CC33",
      "#00CC66",
      "#00CC99",
      "#00CCCC",
      "#00CCFF",
      "#3300CC",
      "#3300FF",
      "#3333CC",
      "#3333FF",
      "#3366CC",
      "#3366FF",
      "#3399CC",
      "#3399FF",
      "#33CC00",
      "#33CC33",
      "#33CC66",
      "#33CC99",
      "#33CCCC",
      "#33CCFF",
      "#6600CC",
      "#6600FF",
      "#6633CC",
      "#6633FF",
      "#66CC00",
      "#66CC33",
      "#9900CC",
      "#9900FF",
      "#9933CC",
      "#9933FF",
      "#99CC00",
      "#99CC33",
      "#CC0000",
      "#CC0033",
      "#CC0066",
      "#CC0099",
      "#CC00CC",
      "#CC00FF",
      "#CC3300",
      "#CC3333",
      "#CC3366",
      "#CC3399",
      "#CC33CC",
      "#CC33FF",
      "#CC6600",
      "#CC6633",
      "#CC9900",
      "#CC9933",
      "#CCCC00",
      "#CCCC33",
      "#FF0000",
      "#FF0033",
      "#FF0066",
      "#FF0099",
      "#FF00CC",
      "#FF00FF",
      "#FF3300",
      "#FF3333",
      "#FF3366",
      "#FF3399",
      "#FF33CC",
      "#FF33FF",
      "#FF6600",
      "#FF6633",
      "#FF9900",
      "#FF9933",
      "#FFCC00",
      "#FFCC33"
    ];
    function useColors() {
      if (typeof window !== "undefined" && window.process && (window.process.type === "renderer" || window.process.__nwjs)) {
        return true;
      }
      if (typeof navigator !== "undefined" && navigator.userAgent && navigator.userAgent.toLowerCase().match(/(edge|trident)\/(\d+)/)) {
        return false;
      }
      let m;
      return typeof document !== "undefined" && document.documentElement && document.documentElement.style && document.documentElement.style.WebkitAppearance || // Is firebug? http://stackoverflow.com/a/398120/376773
      typeof window !== "undefined" && window.console && (window.console.firebug || window.console.exception && window.console.table) || // Is firefox >= v31?
      // https://developer.mozilla.org/en-US/docs/Tools/Web_Console#Styling_messages
      typeof navigator !== "undefined" && navigator.userAgent && (m = navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/)) && parseInt(m[1], 10) >= 31 || // Double check webkit in userAgent just in case we are in a worker
      typeof navigator !== "undefined" && navigator.userAgent && navigator.userAgent.toLowerCase().match(/applewebkit\/(\d+)/);
    }
    function formatArgs(args) {
      args[0] = (this.useColors ? "%c" : "") + this.namespace + (this.useColors ? " %c" : " ") + args[0] + (this.useColors ? "%c " : " ") + "+" + module.exports.humanize(this.diff);
      if (!this.useColors) {
        return;
      }
      const c = "color: " + this.color;
      args.splice(1, 0, c, "color: inherit");
      let index = 0;
      let lastC = 0;
      args[0].replace(/%[a-zA-Z%]/g, (match) => {
        if (match === "%%") {
          return;
        }
        index++;
        if (match === "%c") {
          lastC = index;
        }
      });
      args.splice(lastC, 0, c);
    }
    exports.log = console.debug || console.log || (() => {
    });
    function save(namespaces) {
      try {
        if (namespaces) {
          exports.storage.setItem("debug", namespaces);
        } else {
          exports.storage.removeItem("debug");
        }
      } catch (error) {
      }
    }
    function load() {
      let r;
      try {
        r = exports.storage.getItem("debug") || exports.storage.getItem("DEBUG");
      } catch (error) {
      }
      if (!r && typeof process !== "undefined" && "env" in process) {
        r = process.env.DEBUG;
      }
      return r;
    }
    function localstorage() {
      try {
        return localStorage;
      } catch (error) {
      }
    }
    module.exports = require_common()(exports);
    var { formatters } = module.exports;
    formatters.j = function(v) {
      try {
        return JSON.stringify(v);
      } catch (error) {
        return "[UnexpectedJSONParseError]: " + error.message;
      }
    };
  }
});

// node_modules/awaitqueue/lib/Logger.js
var require_Logger = __commonJS({
  "node_modules/awaitqueue/lib/Logger.js"(exports) {
    "use strict";
    var __importDefault = exports && exports.__importDefault || function(mod) {
      return mod && mod.__esModule ? mod : { "default": mod };
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Logger = void 0;
    var debug_1 = __importDefault(require_browser());
    var LIB_NAME = "awaitqueue";
    var Logger = class {
      _debug;
      _warn;
      _error;
      constructor(prefix) {
        if (prefix) {
          this._debug = (0, debug_1.default)(`${LIB_NAME}:${prefix}`);
          this._warn = (0, debug_1.default)(`${LIB_NAME}:WARN:${prefix}`);
          this._error = (0, debug_1.default)(`${LIB_NAME}:ERROR:${prefix}`);
        } else {
          this._debug = (0, debug_1.default)(LIB_NAME);
          this._warn = (0, debug_1.default)(`${LIB_NAME}:WARN`);
          this._error = (0, debug_1.default)(`${LIB_NAME}:ERROR`);
        }
        this._debug.log = console.info.bind(console);
        this._warn.log = console.warn.bind(console);
        this._error.log = console.error.bind(console);
      }
      get debug() {
        return this._debug;
      }
      get warn() {
        return this._warn;
      }
      get error() {
        return this._error;
      }
    };
    exports.Logger = Logger;
  }
});

// node_modules/awaitqueue/lib/errors.js
var require_errors = __commonJS({
  "node_modules/awaitqueue/lib/errors.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.AwaitQueueRemovedTaskError = exports.AwaitQueueStoppedError = void 0;
    var AwaitQueueStoppedError = class _AwaitQueueStoppedError extends Error {
      constructor(message) {
        super(message ?? "queue stopped");
        this.name = "AwaitQueueStoppedError";
        if (typeof Error.captureStackTrace === "function") {
          Error.captureStackTrace(this, _AwaitQueueStoppedError);
        }
      }
    };
    exports.AwaitQueueStoppedError = AwaitQueueStoppedError;
    var AwaitQueueRemovedTaskError = class _AwaitQueueRemovedTaskError extends Error {
      constructor(message) {
        super(message ?? "queue task removed");
        this.name = "AwaitQueueRemovedTaskError";
        if (typeof Error.captureStackTrace === "function") {
          Error.captureStackTrace(this, _AwaitQueueRemovedTaskError);
        }
      }
    };
    exports.AwaitQueueRemovedTaskError = AwaitQueueRemovedTaskError;
  }
});

// node_modules/awaitqueue/lib/AwaitQueue.js
var require_AwaitQueue = __commonJS({
  "node_modules/awaitqueue/lib/AwaitQueue.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.AwaitQueue = void 0;
    var Logger_1 = require_Logger();
    var errors_1 = require_errors();
    var logger = new Logger_1.Logger("AwaitQueue");
    var AwaitQueue2 = class {
      // Queue of pending tasks (map of PendingTasks indexed by id).
      pendingTasks = /* @__PURE__ */ new Map();
      // Incrementing PendingTask id.
      nextTaskId = 0;
      constructor() {
        logger.debug("constructor()");
      }
      get size() {
        return this.pendingTasks.size;
      }
      async push(task, name, options) {
        name = name ?? task.name;
        logger.debug(`push() [name:${name}, options:%o]`, options);
        if (typeof task !== "function") {
          throw new TypeError("given task is not a function");
        }
        if (name) {
          try {
            Object.defineProperty(task, "name", { value: name });
          } catch (error) {
          }
        }
        return new Promise((resolve, reject) => {
          if (name && options?.removeOngoingTasksWithSameName) {
            for (const pendingTask2 of this.pendingTasks.values()) {
              if (pendingTask2.name === name) {
                pendingTask2.reject(new errors_1.AwaitQueueRemovedTaskError(), {
                  canExecuteNextTask: false
                });
              }
            }
          }
          const pendingTask = {
            id: this.nextTaskId++,
            task,
            name,
            enqueuedAt: Date.now(),
            executedAt: void 0,
            completed: false,
            resolve: (result) => {
              if (pendingTask.completed) {
                return;
              }
              pendingTask.completed = true;
              this.pendingTasks.delete(pendingTask.id);
              logger.debug(`resolving task [name:${pendingTask.name}]`);
              resolve(result);
              const [nextPendingTask] = this.pendingTasks.values();
              if (nextPendingTask && !nextPendingTask.executedAt) {
                void this.execute(nextPendingTask);
              }
            },
            reject: (error, { canExecuteNextTask }) => {
              if (pendingTask.completed) {
                return;
              }
              pendingTask.completed = true;
              this.pendingTasks.delete(pendingTask.id);
              logger.debug(`rejecting task [name:${pendingTask.name}]: %s`, String(error));
              reject(error);
              if (canExecuteNextTask) {
                const [nextPendingTask] = this.pendingTasks.values();
                if (nextPendingTask && !nextPendingTask.executedAt) {
                  void this.execute(nextPendingTask);
                }
              }
            }
          };
          this.pendingTasks.set(pendingTask.id, pendingTask);
          if (this.pendingTasks.size === 1) {
            void this.execute(pendingTask);
          }
        });
      }
      stop() {
        logger.debug("stop()");
        for (const pendingTask of this.pendingTasks.values()) {
          logger.debug(`stop() | stopping task [name:${pendingTask.name}]`);
          pendingTask.reject(new errors_1.AwaitQueueStoppedError(), {
            canExecuteNextTask: false
          });
        }
      }
      remove(taskIdx) {
        logger.debug(`remove() [taskIdx:${taskIdx}]`);
        const pendingTask = Array.from(this.pendingTasks.values())[taskIdx];
        if (!pendingTask) {
          logger.debug(`stop() | no task with given idx [taskIdx:${taskIdx}]`);
          return;
        }
        pendingTask.reject(new errors_1.AwaitQueueRemovedTaskError(), {
          canExecuteNextTask: true
        });
      }
      dump() {
        const now = Date.now();
        let idx = 0;
        return Array.from(this.pendingTasks.values()).map((pendingTask) => ({
          idx: idx++,
          task: pendingTask.task,
          name: pendingTask.name,
          enqueuedTime: pendingTask.executedAt ? pendingTask.executedAt - pendingTask.enqueuedAt : now - pendingTask.enqueuedAt,
          executionTime: pendingTask.executedAt ? now - pendingTask.executedAt : 0
        }));
      }
      async execute(pendingTask) {
        logger.debug(`execute() [name:${pendingTask.name}]`);
        if (pendingTask.executedAt) {
          throw new Error("task already being executed");
        }
        pendingTask.executedAt = Date.now();
        try {
          const result = await pendingTask.task();
          pendingTask.resolve(result);
        } catch (error) {
          pendingTask.reject(error, { canExecuteNextTask: true });
        }
      }
    };
    exports.AwaitQueue = AwaitQueue2;
  }
});

// node_modules/awaitqueue/lib/index.js
var require_lib = __commonJS({
  "node_modules/awaitqueue/lib/index.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.AwaitQueueRemovedTaskError = exports.AwaitQueueStoppedError = exports.AwaitQueue = void 0;
    var AwaitQueue_1 = require_AwaitQueue();
    Object.defineProperty(exports, "AwaitQueue", { enumerable: true, get: function() {
      return AwaitQueue_1.AwaitQueue;
    } });
    var errors_1 = require_errors();
    Object.defineProperty(exports, "AwaitQueueStoppedError", { enumerable: true, get: function() {
      return errors_1.AwaitQueueStoppedError;
    } });
    Object.defineProperty(exports, "AwaitQueueRemovedTaskError", { enumerable: true, get: function() {
      return errors_1.AwaitQueueRemovedTaskError;
    } });
  }
});

// node_modules/react/cjs/react.development.js
var require_react_development = __commonJS({
  "node_modules/react/cjs/react.development.js"(exports, module) {
    "use strict";
    (function() {
      function defineDeprecationWarning(methodName, info) {
        Object.defineProperty(Component.prototype, methodName, {
          get: function() {
            console.warn(
              "%s(...) is deprecated in plain JavaScript React classes. %s",
              info[0],
              info[1]
            );
          }
        });
      }
      function getIteratorFn(maybeIterable) {
        if (null === maybeIterable || "object" !== typeof maybeIterable)
          return null;
        maybeIterable = MAYBE_ITERATOR_SYMBOL && maybeIterable[MAYBE_ITERATOR_SYMBOL] || maybeIterable["@@iterator"];
        return "function" === typeof maybeIterable ? maybeIterable : null;
      }
      function warnNoop(publicInstance, callerName) {
        publicInstance = (publicInstance = publicInstance.constructor) && (publicInstance.displayName || publicInstance.name) || "ReactClass";
        var warningKey = publicInstance + "." + callerName;
        didWarnStateUpdateForUnmountedComponent[warningKey] || (console.error(
          "Can't call %s on a component that is not yet mounted. This is a no-op, but it might indicate a bug in your application. Instead, assign to `this.state` directly or define a `state = {};` class property with the desired state in the %s component.",
          callerName,
          publicInstance
        ), didWarnStateUpdateForUnmountedComponent[warningKey] = true);
      }
      function Component(props, context, updater) {
        this.props = props;
        this.context = context;
        this.refs = emptyObject;
        this.updater = updater || ReactNoopUpdateQueue;
      }
      function ComponentDummy() {
      }
      function PureComponent(props, context, updater) {
        this.props = props;
        this.context = context;
        this.refs = emptyObject;
        this.updater = updater || ReactNoopUpdateQueue;
      }
      function noop() {
      }
      function testStringCoercion(value) {
        return "" + value;
      }
      function checkKeyStringCoercion(value) {
        try {
          testStringCoercion(value);
          var JSCompiler_inline_result = false;
        } catch (e) {
          JSCompiler_inline_result = true;
        }
        if (JSCompiler_inline_result) {
          JSCompiler_inline_result = console;
          var JSCompiler_temp_const = JSCompiler_inline_result.error;
          var JSCompiler_inline_result$jscomp$0 = "function" === typeof Symbol && Symbol.toStringTag && value[Symbol.toStringTag] || value.constructor.name || "Object";
          JSCompiler_temp_const.call(
            JSCompiler_inline_result,
            "The provided key is an unsupported type %s. This value must be coerced to a string before using it here.",
            JSCompiler_inline_result$jscomp$0
          );
          return testStringCoercion(value);
        }
      }
      function getComponentNameFromType(type) {
        if (null == type) return null;
        if ("function" === typeof type)
          return type.$$typeof === REACT_CLIENT_REFERENCE ? null : type.displayName || type.name || null;
        if ("string" === typeof type) return type;
        switch (type) {
          case REACT_FRAGMENT_TYPE:
            return "Fragment";
          case REACT_PROFILER_TYPE:
            return "Profiler";
          case REACT_STRICT_MODE_TYPE:
            return "StrictMode";
          case REACT_SUSPENSE_TYPE:
            return "Suspense";
          case REACT_SUSPENSE_LIST_TYPE:
            return "SuspenseList";
          case REACT_ACTIVITY_TYPE:
            return "Activity";
          case REACT_VIEW_TRANSITION_TYPE:
            return "ViewTransition";
        }
        if ("object" === typeof type)
          switch ("number" === typeof type.tag && console.error(
            "Received an unexpected object in getComponentNameFromType(). This is likely a bug in React. Please file an issue."
          ), type.$$typeof) {
            case REACT_PORTAL_TYPE:
              return "Portal";
            case REACT_CONTEXT_TYPE:
              return type.displayName || "Context";
            case REACT_CONSUMER_TYPE:
              return (type._context.displayName || "Context") + ".Consumer";
            case REACT_FORWARD_REF_TYPE:
              var innerType = type.render;
              type = type.displayName;
              type || (type = innerType.displayName || innerType.name || "", type = "" !== type ? "ForwardRef(" + type + ")" : "ForwardRef");
              return type;
            case REACT_MEMO_TYPE:
              return innerType = type.displayName || null, null !== innerType ? innerType : getComponentNameFromType(type.type) || "Memo";
            case REACT_LAZY_TYPE:
              innerType = type._payload;
              type = type._init;
              try {
                return getComponentNameFromType(type(innerType));
              } catch (x) {
              }
          }
        return null;
      }
      function getTaskName(type) {
        if (type === REACT_FRAGMENT_TYPE) return "<>";
        if ("object" === typeof type && null !== type && type.$$typeof === REACT_LAZY_TYPE)
          return "<...>";
        try {
          var name = getComponentNameFromType(type);
          return name ? "<" + name + ">" : "<...>";
        } catch (x) {
          return "<...>";
        }
      }
      function getOwner() {
        var dispatcher = ReactSharedInternals.A;
        return null === dispatcher ? null : dispatcher.getOwner();
      }
      function UnknownOwner() {
        return Error("react-stack-top-frame");
      }
      function hasValidKey(config) {
        if (hasOwnProperty.call(config, "key")) {
          var getter = Object.getOwnPropertyDescriptor(config, "key").get;
          if (getter && getter.isReactWarning) return false;
        }
        return void 0 !== config.key;
      }
      function defineKeyPropWarningGetter(props, displayName) {
        function warnAboutAccessingKey() {
          specialPropKeyWarningShown || (specialPropKeyWarningShown = true, console.error(
            "%s: `key` is not a prop. Trying to access it will result in `undefined` being returned. If you need to access the same value within the child component, you should pass it as a different prop. (https://react.dev/link/special-props)",
            displayName
          ));
        }
        warnAboutAccessingKey.isReactWarning = true;
        Object.defineProperty(props, "key", {
          get: warnAboutAccessingKey,
          configurable: true
        });
      }
      function elementRefGetterWithDeprecationWarning() {
        var componentName = getComponentNameFromType(this.type);
        didWarnAboutElementRef[componentName] || (didWarnAboutElementRef[componentName] = true, console.error(
          "Accessing element.ref was removed in React 19. ref is now a regular prop. It will be removed from the JSX Element type in a future release."
        ));
        componentName = this.props.ref;
        return void 0 !== componentName ? componentName : null;
      }
      function ReactElement(type, key, props, owner, debugStack, debugTask) {
        var refProp = props.ref;
        type = {
          $$typeof: REACT_ELEMENT_TYPE,
          type,
          key,
          props,
          _owner: owner
        };
        null !== (void 0 !== refProp ? refProp : null) ? Object.defineProperty(type, "ref", {
          enumerable: false,
          get: elementRefGetterWithDeprecationWarning
        }) : Object.defineProperty(type, "ref", { enumerable: false, value: null });
        type._store = {};
        Object.defineProperty(type._store, "validated", {
          configurable: false,
          enumerable: false,
          writable: true,
          value: 0
        });
        Object.defineProperty(type, "_debugInfo", {
          configurable: false,
          enumerable: false,
          writable: true,
          value: null
        });
        Object.defineProperty(type, "_debugStack", {
          configurable: false,
          enumerable: false,
          writable: true,
          value: debugStack
        });
        Object.defineProperty(type, "_debugTask", {
          configurable: false,
          enumerable: false,
          writable: true,
          value: debugTask
        });
        Object.freeze && (Object.freeze(type.props), Object.freeze(type));
        return type;
      }
      function cloneAndReplaceKey(oldElement, newKey) {
        newKey = ReactElement(
          oldElement.type,
          newKey,
          oldElement.props,
          oldElement._owner,
          oldElement._debugStack,
          oldElement._debugTask
        );
        oldElement._store && (newKey._store.validated = oldElement._store.validated);
        return newKey;
      }
      function validateChildKeys(node) {
        isValidElement(node) ? node._store && (node._store.validated = 1) : "object" === typeof node && null !== node && node.$$typeof === REACT_LAZY_TYPE && ("fulfilled" === node._payload.status ? isValidElement(node._payload.value) && node._payload.value._store && (node._payload.value._store.validated = 1) : node._store && (node._store.validated = 1));
      }
      function isValidElement(object) {
        return "object" === typeof object && null !== object && object.$$typeof === REACT_ELEMENT_TYPE;
      }
      function escape(key) {
        var escaperLookup = { "=": "=0", ":": "=2" };
        return "$" + key.replace(/[=:]/g, function(match) {
          return escaperLookup[match];
        });
      }
      function getElementKey(element, index) {
        return "object" === typeof element && null !== element && null != element.key ? (checkKeyStringCoercion(element.key), escape("" + element.key)) : index.toString(36);
      }
      function resolveThenable(thenable) {
        switch (thenable.status) {
          case "fulfilled":
            return thenable.value;
          case "rejected":
            throw thenable.reason;
          default:
            switch ("string" === typeof thenable.status ? thenable.then(noop, noop) : (thenable.status = "pending", thenable.then(
              function(fulfilledValue) {
                "pending" === thenable.status && (thenable.status = "fulfilled", thenable.value = fulfilledValue);
              },
              function(error) {
                "pending" === thenable.status && (thenable.status = "rejected", thenable.reason = error);
              }
            )), thenable.status) {
              case "fulfilled":
                return thenable.value;
              case "rejected":
                throw thenable.reason;
            }
        }
        throw thenable;
      }
      function mapIntoArray(children, array, escapedPrefix, nameSoFar, callback) {
        var type = typeof children;
        if ("undefined" === type || "boolean" === type) children = null;
        var invokeCallback = false;
        if (null === children) invokeCallback = true;
        else
          switch (type) {
            case "bigint":
            case "string":
            case "number":
              invokeCallback = true;
              break;
            case "object":
              switch (children.$$typeof) {
                case REACT_ELEMENT_TYPE:
                case REACT_PORTAL_TYPE:
                  invokeCallback = true;
                  break;
                case REACT_LAZY_TYPE:
                  return invokeCallback = children._init, mapIntoArray(
                    invokeCallback(children._payload),
                    array,
                    escapedPrefix,
                    nameSoFar,
                    callback
                  );
              }
          }
        if (invokeCallback) {
          invokeCallback = children;
          callback = callback(invokeCallback);
          var childKey = "" === nameSoFar ? "." + getElementKey(invokeCallback, 0) : nameSoFar;
          isArrayImpl(callback) ? (escapedPrefix = "", null != childKey && (escapedPrefix = childKey.replace(userProvidedKeyEscapeRegex, "$&/") + "/"), mapIntoArray(callback, array, escapedPrefix, "", function(c) {
            return c;
          })) : null != callback && (isValidElement(callback) && (null != callback.key && (invokeCallback && invokeCallback.key === callback.key || checkKeyStringCoercion(callback.key)), escapedPrefix = cloneAndReplaceKey(
            callback,
            escapedPrefix + (null == callback.key || invokeCallback && invokeCallback.key === callback.key ? "" : ("" + callback.key).replace(
              userProvidedKeyEscapeRegex,
              "$&/"
            ) + "/") + childKey
          ), "" !== nameSoFar && null != invokeCallback && isValidElement(invokeCallback) && null == invokeCallback.key && invokeCallback._store && !invokeCallback._store.validated && (escapedPrefix._store.validated = 2), callback = escapedPrefix), array.push(callback));
          return 1;
        }
        invokeCallback = 0;
        childKey = "" === nameSoFar ? "." : nameSoFar + ":";
        if (isArrayImpl(children))
          for (var i = 0; i < children.length; i++)
            nameSoFar = children[i], type = childKey + getElementKey(nameSoFar, i), invokeCallback += mapIntoArray(
              nameSoFar,
              array,
              escapedPrefix,
              type,
              callback
            );
        else if (i = getIteratorFn(children), "function" === typeof i)
          for (i === children.entries && (didWarnAboutMaps || console.warn(
            "Using Maps as children is not supported. Use an array of keyed ReactElements instead."
          ), didWarnAboutMaps = true), children = i.call(children), i = 0; !(nameSoFar = children.next()).done; )
            nameSoFar = nameSoFar.value, type = childKey + getElementKey(nameSoFar, i++), invokeCallback += mapIntoArray(
              nameSoFar,
              array,
              escapedPrefix,
              type,
              callback
            );
        else if ("object" === type) {
          if ("function" === typeof children.then)
            return mapIntoArray(
              resolveThenable(children),
              array,
              escapedPrefix,
              nameSoFar,
              callback
            );
          array = String(children);
          throw Error(
            "Objects are not valid as a React child (found: " + ("[object Object]" === array ? "object with keys {" + Object.keys(children).join(", ") + "}" : array) + "). If you meant to render a collection of children, use an array instead."
          );
        }
        return invokeCallback;
      }
      function mapChildren(children, func, context) {
        if (null == children) return children;
        var result = [], count = 0;
        mapIntoArray(children, result, "", "", function(child) {
          return func.call(context, child, count++);
        });
        return result;
      }
      function lazyInitializer(payload) {
        if (-1 === payload._status) {
          var resolveDebugValue = null, rejectDebugValue = null, ioInfo = payload._ioInfo;
          null != ioInfo && (ioInfo.start = ioInfo.end = performance.now(), ioInfo.value = new Promise(function(resolve, reject) {
            resolveDebugValue = resolve;
            rejectDebugValue = reject;
          }));
          ioInfo = payload._result;
          var thenable = ioInfo();
          thenable.then(
            function(moduleObject) {
              if (0 === payload._status || -1 === payload._status) {
                payload._status = 1;
                payload._result = moduleObject;
                var _ioInfo = payload._ioInfo;
                if (null != _ioInfo) {
                  _ioInfo.end = performance.now();
                  var debugValue = null == moduleObject ? void 0 : moduleObject.default;
                  resolveDebugValue(debugValue);
                  _ioInfo.value.status = "fulfilled";
                  _ioInfo.value.value = debugValue;
                }
                void 0 === thenable.status && (thenable.status = "fulfilled", thenable.value = moduleObject);
              }
            },
            function(error) {
              if (0 === payload._status || -1 === payload._status) {
                payload._status = 2;
                payload._result = error;
                var _ioInfo2 = payload._ioInfo;
                null != _ioInfo2 && (_ioInfo2.end = performance.now(), _ioInfo2.value.then(noop, noop), rejectDebugValue(error), _ioInfo2.value.status = "rejected", _ioInfo2.value.reason = error);
                void 0 === thenable.status && (thenable.status = "rejected", thenable.reason = error);
              }
            }
          );
          ioInfo = payload._ioInfo;
          if (null != ioInfo) {
            var displayName = thenable.displayName;
            "string" === typeof displayName && (ioInfo.name = displayName);
          }
          -1 === payload._status && (payload._status = 0, payload._result = thenable);
        }
        if (1 === payload._status)
          return ioInfo = payload._result, void 0 === ioInfo && console.error(
            "lazy: Expected the result of a dynamic import() call. Instead received: %s\n\nYour code should look like: \n  const MyComponent = lazy(() => import('./MyComponent'))\n\nDid you accidentally put curly braces around the import?",
            ioInfo
          ), "default" in ioInfo || console.error(
            "lazy: Expected the result of a dynamic import() call. Instead received: %s\n\nYour code should look like: \n  const MyComponent = lazy(() => import('./MyComponent'))",
            ioInfo
          ), ioInfo.default;
        throw payload._result;
      }
      function resolveDispatcher() {
        var dispatcher = ReactSharedInternals.H;
        null === dispatcher && console.error(
          "Invalid hook call. Hooks can only be called inside of the body of a function component. This could happen for one of the following reasons:\n1. You might have mismatching versions of React and the renderer (such as React DOM)\n2. You might be breaking the Rules of Hooks\n3. You might have more than one copy of React in the same app\nSee https://react.dev/link/invalid-hook-call for tips about how to debug and fix this problem."
        );
        return dispatcher;
      }
      function releaseAsyncTransition() {
        ReactSharedInternals.asyncTransitions--;
      }
      function startTransition(scope) {
        var prevTransition = ReactSharedInternals.T, currentTransition = {};
        currentTransition.types = null !== prevTransition ? prevTransition.types : null;
        currentTransition._updatedFibers = /* @__PURE__ */ new Set();
        ReactSharedInternals.T = currentTransition;
        try {
          var returnValue = scope(), onStartTransitionFinish = ReactSharedInternals.S;
          null !== onStartTransitionFinish && onStartTransitionFinish(currentTransition, returnValue);
          "object" === typeof returnValue && null !== returnValue && "function" === typeof returnValue.then && (ReactSharedInternals.asyncTransitions++, returnValue.then(releaseAsyncTransition, releaseAsyncTransition), returnValue.then(noop, reportGlobalError));
        } catch (error) {
          reportGlobalError(error);
        } finally {
          null === prevTransition && currentTransition._updatedFibers && (scope = currentTransition._updatedFibers.size, currentTransition._updatedFibers.clear(), 10 < scope && console.warn(
            "Detected a large number of updates inside startTransition. If this is due to a subscription please re-write it to use React provided hooks. Otherwise concurrent mode guarantees are off the table."
          )), null !== prevTransition && null !== currentTransition.types && (null !== prevTransition.types && prevTransition.types !== currentTransition.types && console.error(
            "We expected inner Transitions to have transferred the outer types set and that you cannot add to the outer Transition while inside the inner.This is a bug in React."
          ), prevTransition.types = currentTransition.types), ReactSharedInternals.T = prevTransition;
        }
      }
      function addTransitionType(type) {
        var transition = ReactSharedInternals.T;
        if (null !== transition) {
          var transitionTypes = transition.types;
          null === transitionTypes ? transition.types = [type] : -1 === transitionTypes.indexOf(type) && transitionTypes.push(type);
        } else
          0 === ReactSharedInternals.asyncTransitions && console.error(
            "addTransitionType can only be called inside a `startTransition()` callback. It must be associated with a specific Transition."
          ), startTransition(addTransitionType.bind(null, type));
      }
      function enqueueTask(task) {
        if (null === enqueueTaskImpl)
          try {
            var requireString = ("require" + Math.random()).slice(0, 7);
            enqueueTaskImpl = (module && module[requireString]).call(
              module,
              "timers"
            ).setImmediate;
          } catch (_err) {
            enqueueTaskImpl = function(callback) {
              false === didWarnAboutMessageChannel && (didWarnAboutMessageChannel = true, "undefined" === typeof MessageChannel && console.error(
                "This browser does not have a MessageChannel implementation, so enqueuing tasks via await act(async () => ...) will fail. Please file an issue at https://github.com/facebook/react/issues if you encounter this warning."
              ));
              var channel = new MessageChannel();
              channel.port1.onmessage = callback;
              channel.port2.postMessage(void 0);
            };
          }
        return enqueueTaskImpl(task);
      }
      function aggregateErrors(errors) {
        return 1 < errors.length && "function" === typeof AggregateError ? new AggregateError(errors) : errors[0];
      }
      function popActScope(prevActQueue, prevActScopeDepth) {
        prevActScopeDepth !== actScopeDepth - 1 && console.error(
          "You seem to have overlapping act() calls, this is not supported. Be sure to await previous act() calls before making a new one. "
        );
        actScopeDepth = prevActScopeDepth;
      }
      function recursivelyFlushAsyncActWork(returnValue, resolve, reject) {
        var queue = ReactSharedInternals.actQueue;
        if (null !== queue)
          if (0 !== queue.length)
            try {
              flushActQueue(queue);
              enqueueTask(function() {
                return recursivelyFlushAsyncActWork(returnValue, resolve, reject);
              });
              return;
            } catch (error) {
              ReactSharedInternals.thrownErrors.push(error);
            }
          else ReactSharedInternals.actQueue = null;
        0 < ReactSharedInternals.thrownErrors.length ? (queue = aggregateErrors(ReactSharedInternals.thrownErrors), ReactSharedInternals.thrownErrors.length = 0, reject(queue)) : resolve(returnValue);
      }
      function flushActQueue(queue) {
        if (!isFlushing) {
          isFlushing = true;
          var i = 0;
          try {
            for (; i < queue.length; i++) {
              var callback = queue[i];
              do {
                ReactSharedInternals.didUsePromise = false;
                var continuation = callback(false);
                if (null !== continuation) {
                  if (ReactSharedInternals.didUsePromise) {
                    queue[i] = callback;
                    queue.splice(0, i);
                    return;
                  }
                  callback = continuation;
                } else break;
              } while (1);
            }
            queue.length = 0;
          } catch (error) {
            queue.splice(0, i + 1), ReactSharedInternals.thrownErrors.push(error);
          } finally {
            isFlushing = false;
          }
        }
      }
      "undefined" !== typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ && "function" === typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStart && __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStart(Error());
      var REACT_ELEMENT_TYPE = /* @__PURE__ */ Symbol.for("react.transitional.element"), REACT_PORTAL_TYPE = /* @__PURE__ */ Symbol.for("react.portal"), REACT_FRAGMENT_TYPE = /* @__PURE__ */ Symbol.for("react.fragment"), REACT_STRICT_MODE_TYPE = /* @__PURE__ */ Symbol.for("react.strict_mode"), REACT_PROFILER_TYPE = /* @__PURE__ */ Symbol.for("react.profiler"), REACT_CONSUMER_TYPE = /* @__PURE__ */ Symbol.for("react.consumer"), REACT_CONTEXT_TYPE = /* @__PURE__ */ Symbol.for("react.context"), REACT_FORWARD_REF_TYPE = /* @__PURE__ */ Symbol.for("react.forward_ref"), REACT_SUSPENSE_TYPE = /* @__PURE__ */ Symbol.for("react.suspense"), REACT_SUSPENSE_LIST_TYPE = /* @__PURE__ */ Symbol.for("react.suspense_list"), REACT_MEMO_TYPE = /* @__PURE__ */ Symbol.for("react.memo"), REACT_LAZY_TYPE = /* @__PURE__ */ Symbol.for("react.lazy"), REACT_ACTIVITY_TYPE = /* @__PURE__ */ Symbol.for("react.activity"), REACT_VIEW_TRANSITION_TYPE = /* @__PURE__ */ Symbol.for("react.view_transition"), MAYBE_ITERATOR_SYMBOL = Symbol.iterator, didWarnStateUpdateForUnmountedComponent = {}, ReactNoopUpdateQueue = {
        isMounted: function() {
          return false;
        },
        enqueueForceUpdate: function(publicInstance) {
          warnNoop(publicInstance, "forceUpdate");
        },
        enqueueReplaceState: function(publicInstance) {
          warnNoop(publicInstance, "replaceState");
        },
        enqueueSetState: function(publicInstance) {
          warnNoop(publicInstance, "setState");
        }
      }, assign = Object.assign, emptyObject = {};
      Object.freeze(emptyObject);
      Component.prototype.isReactComponent = {};
      Component.prototype.setState = function(partialState, callback) {
        if ("object" !== typeof partialState && "function" !== typeof partialState && null != partialState)
          throw Error(
            "takes an object of state variables to update or a function which returns an object of state variables."
          );
        this.updater.enqueueSetState(this, partialState, callback, "setState");
      };
      Component.prototype.forceUpdate = function(callback) {
        this.updater.enqueueForceUpdate(this, callback, "forceUpdate");
      };
      var deprecatedAPIs = {
        isMounted: [
          "isMounted",
          "Instead, make sure to clean up subscriptions and pending requests in componentWillUnmount to prevent memory leaks."
        ],
        replaceState: [
          "replaceState",
          "Refactor your code to use setState instead (see https://github.com/facebook/react/issues/3236)."
        ]
      };
      for (fnName in deprecatedAPIs)
        deprecatedAPIs.hasOwnProperty(fnName) && defineDeprecationWarning(fnName, deprecatedAPIs[fnName]);
      ComponentDummy.prototype = Component.prototype;
      deprecatedAPIs = PureComponent.prototype = new ComponentDummy();
      deprecatedAPIs.constructor = PureComponent;
      assign(deprecatedAPIs, Component.prototype);
      deprecatedAPIs.isPureReactComponent = true;
      var isArrayImpl = Array.isArray, REACT_CLIENT_REFERENCE = /* @__PURE__ */ Symbol.for("react.client.reference"), ReactSharedInternals = {
        H: null,
        A: null,
        T: null,
        S: null,
        actQueue: null,
        asyncTransitions: 0,
        isBatchingLegacy: false,
        didScheduleLegacyUpdate: false,
        didUsePromise: false,
        thrownErrors: [],
        getCurrentStack: null,
        recentlyCreatedOwnerStacks: 0
      }, hasOwnProperty = Object.prototype.hasOwnProperty, createTask = console.createTask ? console.createTask : function() {
        return null;
      };
      deprecatedAPIs = {
        react_stack_bottom_frame: function(callStackForError) {
          return callStackForError();
        }
      };
      var specialPropKeyWarningShown, didWarnAboutOldJSXRuntime;
      var didWarnAboutElementRef = {};
      var unknownOwnerDebugStack = deprecatedAPIs.react_stack_bottom_frame.bind(
        deprecatedAPIs,
        UnknownOwner
      )();
      var unknownOwnerDebugTask = createTask(getTaskName(UnknownOwner));
      var didWarnAboutMaps = false, userProvidedKeyEscapeRegex = /\/+/g, reportGlobalError = "function" === typeof reportError ? reportError : function(error) {
        if ("object" === typeof window && "function" === typeof window.ErrorEvent) {
          var event = new window.ErrorEvent("error", {
            bubbles: true,
            cancelable: true,
            message: "object" === typeof error && null !== error && "string" === typeof error.message ? String(error.message) : String(error),
            error
          });
          if (!window.dispatchEvent(event)) return;
        } else if ("object" === typeof process && "function" === typeof process.emit) {
          process.emit("uncaughtException", error);
          return;
        }
        console.error(error);
      }, didWarnAboutMessageChannel = false, enqueueTaskImpl = null, actScopeDepth = 0, didWarnNoAwaitAct = false, isFlushing = false, queueSeveralMicrotasks = "function" === typeof queueMicrotask ? function(callback) {
        queueMicrotask(function() {
          return queueMicrotask(callback);
        });
      } : enqueueTask;
      deprecatedAPIs = Object.freeze({
        __proto__: null,
        c: function(size) {
          return resolveDispatcher().useMemoCache(size);
        }
      });
      var fnName = {
        map: mapChildren,
        forEach: function(children, forEachFunc, forEachContext) {
          mapChildren(
            children,
            function() {
              forEachFunc.apply(this, arguments);
            },
            forEachContext
          );
        },
        count: function(children) {
          var n = 0;
          mapChildren(children, function() {
            n++;
          });
          return n;
        },
        toArray: function(children) {
          return mapChildren(children, function(child) {
            return child;
          }) || [];
        },
        only: function(children) {
          if (!isValidElement(children))
            throw Error(
              "React.Children.only expected to receive a single React element child."
            );
          return children;
        }
      };
      exports.Activity = REACT_ACTIVITY_TYPE;
      exports.Children = fnName;
      exports.Component = Component;
      exports.Fragment = REACT_FRAGMENT_TYPE;
      exports.Profiler = REACT_PROFILER_TYPE;
      exports.PureComponent = PureComponent;
      exports.StrictMode = REACT_STRICT_MODE_TYPE;
      exports.Suspense = REACT_SUSPENSE_TYPE;
      exports.ViewTransition = REACT_VIEW_TRANSITION_TYPE;
      exports.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE = ReactSharedInternals;
      exports.__COMPILER_RUNTIME = deprecatedAPIs;
      exports.act = function(callback) {
        var prevActQueue = ReactSharedInternals.actQueue, prevActScopeDepth = actScopeDepth;
        actScopeDepth++;
        var queue = ReactSharedInternals.actQueue = null !== prevActQueue ? prevActQueue : [], didAwaitActCall = false;
        try {
          var result = callback();
        } catch (error) {
          ReactSharedInternals.thrownErrors.push(error);
        }
        if (0 < ReactSharedInternals.thrownErrors.length)
          throw popActScope(prevActQueue, prevActScopeDepth), callback = aggregateErrors(ReactSharedInternals.thrownErrors), ReactSharedInternals.thrownErrors.length = 0, callback;
        if (null !== result && "object" === typeof result && "function" === typeof result.then) {
          var thenable = result;
          queueSeveralMicrotasks(function() {
            didAwaitActCall || didWarnNoAwaitAct || (didWarnNoAwaitAct = true, console.error(
              "You called act(async () => ...) without await. This could lead to unexpected testing behaviour, interleaving multiple act calls and mixing their scopes. You should - await act(async () => ...);"
            ));
          });
          return {
            then: function(resolve, reject) {
              didAwaitActCall = true;
              thenable.then(
                function(returnValue) {
                  popActScope(prevActQueue, prevActScopeDepth);
                  if (0 === prevActScopeDepth) {
                    try {
                      flushActQueue(queue), enqueueTask(function() {
                        return recursivelyFlushAsyncActWork(
                          returnValue,
                          resolve,
                          reject
                        );
                      });
                    } catch (error$0) {
                      ReactSharedInternals.thrownErrors.push(error$0);
                    }
                    if (0 < ReactSharedInternals.thrownErrors.length) {
                      var _thrownError = aggregateErrors(
                        ReactSharedInternals.thrownErrors
                      );
                      ReactSharedInternals.thrownErrors.length = 0;
                      reject(_thrownError);
                    }
                  } else resolve(returnValue);
                },
                function(error) {
                  popActScope(prevActQueue, prevActScopeDepth);
                  0 < ReactSharedInternals.thrownErrors.length ? (error = aggregateErrors(
                    ReactSharedInternals.thrownErrors
                  ), ReactSharedInternals.thrownErrors.length = 0, reject(error)) : reject(error);
                }
              );
            }
          };
        }
        var returnValue$jscomp$0 = result;
        popActScope(prevActQueue, prevActScopeDepth);
        0 === prevActScopeDepth && (flushActQueue(queue), 0 !== queue.length && queueSeveralMicrotasks(function() {
          didAwaitActCall || didWarnNoAwaitAct || (didWarnNoAwaitAct = true, console.error(
            "A component suspended inside an `act` scope, but the `act` call was not awaited. When testing React components that depend on asynchronous data, you must await the result:\n\nawait act(() => ...)"
          ));
        }), ReactSharedInternals.actQueue = null);
        if (0 < ReactSharedInternals.thrownErrors.length)
          throw callback = aggregateErrors(ReactSharedInternals.thrownErrors), ReactSharedInternals.thrownErrors.length = 0, callback;
        return {
          then: function(resolve, reject) {
            didAwaitActCall = true;
            0 === prevActScopeDepth ? (ReactSharedInternals.actQueue = queue, enqueueTask(function() {
              return recursivelyFlushAsyncActWork(
                returnValue$jscomp$0,
                resolve,
                reject
              );
            })) : resolve(returnValue$jscomp$0);
          }
        };
      };
      exports.addTransitionType = addTransitionType;
      exports.cache = function(fn) {
        return function() {
          return fn.apply(null, arguments);
        };
      };
      exports.cacheSignal = function() {
        return null;
      };
      exports.captureOwnerStack = function() {
        var getCurrentStack = ReactSharedInternals.getCurrentStack;
        return null === getCurrentStack ? null : getCurrentStack();
      };
      exports.cloneElement = function(element, config, children) {
        if (null === element || void 0 === element)
          throw Error(
            "The argument must be a React element, but you passed " + element + "."
          );
        var props = assign({}, element.props), key = element.key, owner = element._owner;
        if (null != config) {
          var JSCompiler_inline_result;
          a: {
            if (hasOwnProperty.call(config, "ref") && (JSCompiler_inline_result = Object.getOwnPropertyDescriptor(
              config,
              "ref"
            ).get) && JSCompiler_inline_result.isReactWarning) {
              JSCompiler_inline_result = false;
              break a;
            }
            JSCompiler_inline_result = void 0 !== config.ref;
          }
          JSCompiler_inline_result && (owner = getOwner());
          hasValidKey(config) && (checkKeyStringCoercion(config.key), key = "" + config.key);
          for (propName in config)
            !hasOwnProperty.call(config, propName) || "key" === propName || "__self" === propName || "__source" === propName || "ref" === propName && void 0 === config.ref || (props[propName] = config[propName]);
        }
        var propName = arguments.length - 2;
        if (1 === propName) props.children = children;
        else if (1 < propName) {
          JSCompiler_inline_result = Array(propName);
          for (var i = 0; i < propName; i++)
            JSCompiler_inline_result[i] = arguments[i + 2];
          props.children = JSCompiler_inline_result;
        }
        props = ReactElement(
          element.type,
          key,
          props,
          owner,
          element._debugStack,
          element._debugTask
        );
        for (key = 2; key < arguments.length; key++)
          validateChildKeys(arguments[key]);
        return props;
      };
      exports.createContext = function(defaultValue) {
        defaultValue = {
          $$typeof: REACT_CONTEXT_TYPE,
          _currentValue: defaultValue,
          _currentValue2: defaultValue,
          _threadCount: 0,
          Provider: null,
          Consumer: null
        };
        defaultValue.Provider = defaultValue;
        defaultValue.Consumer = {
          $$typeof: REACT_CONSUMER_TYPE,
          _context: defaultValue
        };
        defaultValue._currentRenderer = null;
        defaultValue._currentRenderer2 = null;
        return defaultValue;
      };
      exports.createElement = function(type, config, children) {
        for (var i = 2; i < arguments.length; i++)
          validateChildKeys(arguments[i]);
        var propName;
        i = {};
        var key = null;
        if (null != config)
          for (propName in didWarnAboutOldJSXRuntime || !("__self" in config) || "key" in config || (didWarnAboutOldJSXRuntime = true, console.warn(
            "Your app (or one of its dependencies) is using an outdated JSX transform. Update to the modern JSX transform for faster performance: https://react.dev/link/new-jsx-transform"
          )), hasValidKey(config) && (checkKeyStringCoercion(config.key), key = "" + config.key), config)
            hasOwnProperty.call(config, propName) && "key" !== propName && "__self" !== propName && "__source" !== propName && (i[propName] = config[propName]);
        var childrenLength = arguments.length - 2;
        if (1 === childrenLength) i.children = children;
        else if (1 < childrenLength) {
          for (var childArray = Array(childrenLength), _i = 0; _i < childrenLength; _i++)
            childArray[_i] = arguments[_i + 2];
          Object.freeze && Object.freeze(childArray);
          i.children = childArray;
        }
        if (type && type.defaultProps)
          for (propName in childrenLength = type.defaultProps, childrenLength)
            void 0 === i[propName] && (i[propName] = childrenLength[propName]);
        key && defineKeyPropWarningGetter(
          i,
          "function" === typeof type ? type.displayName || type.name || "Unknown" : type
        );
        (propName = 1e4 > ReactSharedInternals.recentlyCreatedOwnerStacks++) ? (childArray = Error.stackTraceLimit, Error.stackTraceLimit = 10, childrenLength = Error("react-stack-top-frame"), Error.stackTraceLimit = childArray) : childrenLength = unknownOwnerDebugStack;
        return ReactElement(
          type,
          key,
          i,
          getOwner(),
          childrenLength,
          propName ? createTask(getTaskName(type)) : unknownOwnerDebugTask
        );
      };
      exports.createRef = function() {
        var refObject = { current: null };
        Object.seal(refObject);
        return refObject;
      };
      exports.forwardRef = function(render) {
        null != render && render.$$typeof === REACT_MEMO_TYPE ? console.error(
          "forwardRef requires a render function but received a `memo` component. Instead of forwardRef(memo(...)), use memo(forwardRef(...))."
        ) : "function" !== typeof render ? console.error(
          "forwardRef requires a render function but was given %s.",
          null === render ? "null" : typeof render
        ) : 0 !== render.length && 2 !== render.length && console.error(
          "forwardRef render functions accept exactly two parameters: props and ref. %s",
          1 === render.length ? "Did you forget to use the ref parameter?" : "Any additional parameter will be undefined."
        );
        null != render && null != render.defaultProps && console.error(
          "forwardRef render functions do not support defaultProps. Did you accidentally pass a React component?"
        );
        var elementType = { $$typeof: REACT_FORWARD_REF_TYPE, render }, ownName;
        Object.defineProperty(elementType, "displayName", {
          enumerable: false,
          configurable: true,
          get: function() {
            return ownName;
          },
          set: function(name) {
            ownName = name;
            render.name || render.displayName || (Object.defineProperty(render, "name", { value: name }), render.displayName = name);
          }
        });
        return elementType;
      };
      exports.isValidElement = isValidElement;
      exports.lazy = function(ctor) {
        ctor = { _status: -1, _result: ctor };
        var lazyType = {
          $$typeof: REACT_LAZY_TYPE,
          _payload: ctor,
          _init: lazyInitializer
        }, ioInfo = {
          name: "lazy",
          start: -1,
          end: -1,
          value: null,
          owner: null,
          debugStack: Error("react-stack-top-frame"),
          debugTask: console.createTask ? console.createTask("lazy()") : null
        };
        ctor._ioInfo = ioInfo;
        lazyType._debugInfo = [{ awaited: ioInfo }];
        return lazyType;
      };
      exports.memo = function(type, compare) {
        null == type && console.error(
          "memo: The first argument must be a component. Instead received: %s",
          null === type ? "null" : typeof type
        );
        compare = {
          $$typeof: REACT_MEMO_TYPE,
          type,
          compare: void 0 === compare ? null : compare
        };
        var ownName;
        Object.defineProperty(compare, "displayName", {
          enumerable: false,
          configurable: true,
          get: function() {
            return ownName;
          },
          set: function(name) {
            ownName = name;
            type.name || type.displayName || (Object.defineProperty(type, "name", { value: name }), type.displayName = name);
          }
        });
        return compare;
      };
      exports.startTransition = startTransition;
      exports.unstable_useCacheRefresh = function() {
        return resolveDispatcher().useCacheRefresh();
      };
      exports.use = function(usable) {
        return resolveDispatcher().use(usable);
      };
      exports.useActionState = function(action, initialState, permalink) {
        return resolveDispatcher().useActionState(
          action,
          initialState,
          permalink
        );
      };
      exports.useCallback = function(callback, deps) {
        return resolveDispatcher().useCallback(callback, deps);
      };
      exports.useContext = function(Context) {
        var dispatcher = resolveDispatcher();
        Context.$$typeof === REACT_CONSUMER_TYPE && console.error(
          "Calling useContext(Context.Consumer) is not supported and will cause bugs. Did you mean to call useContext(Context) instead?"
        );
        return dispatcher.useContext(Context);
      };
      exports.useDebugValue = function(value, formatterFn) {
        return resolveDispatcher().useDebugValue(value, formatterFn);
      };
      exports.useDeferredValue = function(value, initialValue) {
        return resolveDispatcher().useDeferredValue(value, initialValue);
      };
      exports.useEffect = function(create, deps) {
        null == create && console.warn(
          "React Hook useEffect requires an effect callback. Did you forget to pass a callback to the hook?"
        );
        return resolveDispatcher().useEffect(create, deps);
      };
      exports.useEffectEvent = function(callback) {
        return resolveDispatcher().useEffectEvent(callback);
      };
      exports.useId = function() {
        return resolveDispatcher().useId();
      };
      exports.useImperativeHandle = function(ref, create, deps) {
        return resolveDispatcher().useImperativeHandle(ref, create, deps);
      };
      exports.useInsertionEffect = function(create, deps) {
        null == create && console.warn(
          "React Hook useInsertionEffect requires an effect callback. Did you forget to pass a callback to the hook?"
        );
        return resolveDispatcher().useInsertionEffect(create, deps);
      };
      exports.useLayoutEffect = function(create, deps) {
        null == create && console.warn(
          "React Hook useLayoutEffect requires an effect callback. Did you forget to pass a callback to the hook?"
        );
        return resolveDispatcher().useLayoutEffect(create, deps);
      };
      exports.useMemo = function(create, deps) {
        return resolveDispatcher().useMemo(create, deps);
      };
      exports.useOptimistic = function(passthrough, reducer) {
        return resolveDispatcher().useOptimistic(passthrough, reducer);
      };
      exports.useReducer = function(reducer, initialArg, init) {
        return resolveDispatcher().useReducer(reducer, initialArg, init);
      };
      exports.useRef = function(initialValue) {
        return resolveDispatcher().useRef(initialValue);
      };
      exports.useState = function(initialState) {
        return resolveDispatcher().useState(initialState);
      };
      exports.useSyncExternalStore = function(subscribe, getSnapshot, getServerSnapshot) {
        return resolveDispatcher().useSyncExternalStore(
          subscribe,
          getSnapshot,
          getServerSnapshot
        );
      };
      exports.useTransition = function() {
        return resolveDispatcher().useTransition();
      };
      exports.version = "19.3.0";
      "undefined" !== typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ && "function" === typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStop && __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStop(Error());
    })();
  }
});

// node_modules/react/index.js
var require_react = __commonJS({
  "node_modules/react/index.js"(exports, module) {
    "use strict";
    if (false) {
      module.exports = null;
    } else {
      module.exports = require_react_development();
    }
  }
});

// node_modules/react/cjs/react-jsx-runtime.development.js
var require_react_jsx_runtime_development = __commonJS({
  "node_modules/react/cjs/react-jsx-runtime.development.js"(exports) {
    "use strict";
    (function() {
      function getComponentNameFromType(type) {
        if (null == type) return null;
        if ("function" === typeof type)
          return type.$$typeof === REACT_CLIENT_REFERENCE ? null : type.displayName || type.name || null;
        if ("string" === typeof type) return type;
        switch (type) {
          case REACT_FRAGMENT_TYPE:
            return "Fragment";
          case REACT_PROFILER_TYPE:
            return "Profiler";
          case REACT_STRICT_MODE_TYPE:
            return "StrictMode";
          case REACT_SUSPENSE_TYPE:
            return "Suspense";
          case REACT_SUSPENSE_LIST_TYPE:
            return "SuspenseList";
          case REACT_ACTIVITY_TYPE:
            return "Activity";
          case REACT_VIEW_TRANSITION_TYPE:
            return "ViewTransition";
        }
        if ("object" === typeof type)
          switch ("number" === typeof type.tag && console.error(
            "Received an unexpected object in getComponentNameFromType(). This is likely a bug in React. Please file an issue."
          ), type.$$typeof) {
            case REACT_PORTAL_TYPE:
              return "Portal";
            case REACT_CONTEXT_TYPE:
              return type.displayName || "Context";
            case REACT_CONSUMER_TYPE:
              return (type._context.displayName || "Context") + ".Consumer";
            case REACT_FORWARD_REF_TYPE:
              var innerType = type.render;
              type = type.displayName;
              type || (type = innerType.displayName || innerType.name || "", type = "" !== type ? "ForwardRef(" + type + ")" : "ForwardRef");
              return type;
            case REACT_MEMO_TYPE:
              return innerType = type.displayName || null, null !== innerType ? innerType : getComponentNameFromType(type.type) || "Memo";
            case REACT_LAZY_TYPE:
              innerType = type._payload;
              type = type._init;
              try {
                return getComponentNameFromType(type(innerType));
              } catch (x) {
              }
          }
        return null;
      }
      function testStringCoercion(value) {
        return "" + value;
      }
      function checkKeyStringCoercion(value) {
        try {
          testStringCoercion(value);
          var JSCompiler_inline_result = false;
        } catch (e) {
          JSCompiler_inline_result = true;
        }
        if (JSCompiler_inline_result) {
          JSCompiler_inline_result = console;
          var JSCompiler_temp_const = JSCompiler_inline_result.error;
          var JSCompiler_inline_result$jscomp$0 = "function" === typeof Symbol && Symbol.toStringTag && value[Symbol.toStringTag] || value.constructor.name || "Object";
          JSCompiler_temp_const.call(
            JSCompiler_inline_result,
            "The provided key is an unsupported type %s. This value must be coerced to a string before using it here.",
            JSCompiler_inline_result$jscomp$0
          );
          return testStringCoercion(value);
        }
      }
      function getTaskName(type) {
        if (type === REACT_FRAGMENT_TYPE) return "<>";
        if ("object" === typeof type && null !== type && type.$$typeof === REACT_LAZY_TYPE)
          return "<...>";
        try {
          var name = getComponentNameFromType(type);
          return name ? "<" + name + ">" : "<...>";
        } catch (x) {
          return "<...>";
        }
      }
      function getOwner() {
        var dispatcher = ReactSharedInternals.A;
        return null === dispatcher ? null : dispatcher.getOwner();
      }
      function UnknownOwner() {
        return Error("react-stack-top-frame");
      }
      function hasValidKey(config) {
        if (hasOwnProperty.call(config, "key")) {
          var getter = Object.getOwnPropertyDescriptor(config, "key").get;
          if (getter && getter.isReactWarning) return false;
        }
        return void 0 !== config.key;
      }
      function defineKeyPropWarningGetter(props, displayName) {
        function warnAboutAccessingKey() {
          specialPropKeyWarningShown || (specialPropKeyWarningShown = true, console.error(
            "%s: `key` is not a prop. Trying to access it will result in `undefined` being returned. If you need to access the same value within the child component, you should pass it as a different prop. (https://react.dev/link/special-props)",
            displayName
          ));
        }
        warnAboutAccessingKey.isReactWarning = true;
        Object.defineProperty(props, "key", {
          get: warnAboutAccessingKey,
          configurable: true
        });
      }
      function elementRefGetterWithDeprecationWarning() {
        var componentName = getComponentNameFromType(this.type);
        didWarnAboutElementRef[componentName] || (didWarnAboutElementRef[componentName] = true, console.error(
          "Accessing element.ref was removed in React 19. ref is now a regular prop. It will be removed from the JSX Element type in a future release."
        ));
        componentName = this.props.ref;
        return void 0 !== componentName ? componentName : null;
      }
      function ReactElement(type, key, props, owner, debugStack, debugTask) {
        var refProp = props.ref;
        type = {
          $$typeof: REACT_ELEMENT_TYPE,
          type,
          key,
          props,
          _owner: owner
        };
        null !== (void 0 !== refProp ? refProp : null) ? Object.defineProperty(type, "ref", {
          enumerable: false,
          get: elementRefGetterWithDeprecationWarning
        }) : Object.defineProperty(type, "ref", { enumerable: false, value: null });
        type._store = {};
        Object.defineProperty(type._store, "validated", {
          configurable: false,
          enumerable: false,
          writable: true,
          value: 0
        });
        Object.defineProperty(type, "_debugInfo", {
          configurable: false,
          enumerable: false,
          writable: true,
          value: null
        });
        Object.defineProperty(type, "_debugStack", {
          configurable: false,
          enumerable: false,
          writable: true,
          value: debugStack
        });
        Object.defineProperty(type, "_debugTask", {
          configurable: false,
          enumerable: false,
          writable: true,
          value: debugTask
        });
        Object.freeze && (Object.freeze(type.props), Object.freeze(type));
        return type;
      }
      function jsxDEVImpl(type, config, maybeKey, isStaticChildren, debugStack, debugTask) {
        var children = config.children;
        if (void 0 !== children)
          if (isStaticChildren)
            if (isArrayImpl(children)) {
              for (isStaticChildren = 0; isStaticChildren < children.length; isStaticChildren++)
                validateChildKeys(children[isStaticChildren]);
              Object.freeze && Object.freeze(children);
            } else
              console.error(
                "React.jsx: Static children should always be an array. You are likely explicitly calling React.jsxs or React.jsxDEV. Use the Babel transform instead."
              );
          else validateChildKeys(children);
        if (hasOwnProperty.call(config, "key")) {
          children = getComponentNameFromType(type);
          var keys = Object.keys(config).filter(function(k) {
            return "key" !== k;
          });
          isStaticChildren = 0 < keys.length ? "{key: someKey, " + keys.join(": ..., ") + ": ...}" : "{key: someKey}";
          didWarnAboutKeySpread[children + isStaticChildren] || (keys = 0 < keys.length ? "{" + keys.join(": ..., ") + ": ...}" : "{}", console.error(
            'A props object containing a "key" prop is being spread into JSX:\n  let props = %s;\n  <%s {...props} />\nReact keys must be passed directly to JSX without using spread:\n  let props = %s;\n  <%s key={someKey} {...props} />',
            isStaticChildren,
            children,
            keys,
            children
          ), didWarnAboutKeySpread[children + isStaticChildren] = true);
        }
        children = null;
        void 0 !== maybeKey && (checkKeyStringCoercion(maybeKey), children = "" + maybeKey);
        hasValidKey(config) && (checkKeyStringCoercion(config.key), children = "" + config.key);
        if ("key" in config) {
          maybeKey = {};
          for (var propName in config)
            "key" !== propName && (maybeKey[propName] = config[propName]);
        } else maybeKey = config;
        children && defineKeyPropWarningGetter(
          maybeKey,
          "function" === typeof type ? type.displayName || type.name || "Unknown" : type
        );
        return ReactElement(
          type,
          children,
          maybeKey,
          getOwner(),
          debugStack,
          debugTask
        );
      }
      function validateChildKeys(node) {
        isValidElement(node) ? node._store && (node._store.validated = 1) : "object" === typeof node && null !== node && node.$$typeof === REACT_LAZY_TYPE && ("fulfilled" === node._payload.status ? isValidElement(node._payload.value) && node._payload.value._store && (node._payload.value._store.validated = 1) : node._store && (node._store.validated = 1));
      }
      function isValidElement(object) {
        return "object" === typeof object && null !== object && object.$$typeof === REACT_ELEMENT_TYPE;
      }
      var React = require_react(), REACT_ELEMENT_TYPE = /* @__PURE__ */ Symbol.for("react.transitional.element"), REACT_PORTAL_TYPE = /* @__PURE__ */ Symbol.for("react.portal"), REACT_FRAGMENT_TYPE = /* @__PURE__ */ Symbol.for("react.fragment"), REACT_STRICT_MODE_TYPE = /* @__PURE__ */ Symbol.for("react.strict_mode"), REACT_PROFILER_TYPE = /* @__PURE__ */ Symbol.for("react.profiler"), REACT_CONSUMER_TYPE = /* @__PURE__ */ Symbol.for("react.consumer"), REACT_CONTEXT_TYPE = /* @__PURE__ */ Symbol.for("react.context"), REACT_FORWARD_REF_TYPE = /* @__PURE__ */ Symbol.for("react.forward_ref"), REACT_SUSPENSE_TYPE = /* @__PURE__ */ Symbol.for("react.suspense"), REACT_SUSPENSE_LIST_TYPE = /* @__PURE__ */ Symbol.for("react.suspense_list"), REACT_MEMO_TYPE = /* @__PURE__ */ Symbol.for("react.memo"), REACT_LAZY_TYPE = /* @__PURE__ */ Symbol.for("react.lazy"), REACT_ACTIVITY_TYPE = /* @__PURE__ */ Symbol.for("react.activity"), REACT_VIEW_TRANSITION_TYPE = /* @__PURE__ */ Symbol.for("react.view_transition"), REACT_CLIENT_REFERENCE = /* @__PURE__ */ Symbol.for("react.client.reference"), ReactSharedInternals = React.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE, hasOwnProperty = Object.prototype.hasOwnProperty, isArrayImpl = Array.isArray, createTask = console.createTask ? console.createTask : function() {
        return null;
      };
      React = {
        react_stack_bottom_frame: function(callStackForError) {
          return callStackForError();
        }
      };
      var specialPropKeyWarningShown;
      var didWarnAboutElementRef = {};
      var unknownOwnerDebugStack = React.react_stack_bottom_frame.bind(
        React,
        UnknownOwner
      )();
      var unknownOwnerDebugTask = createTask(getTaskName(UnknownOwner));
      var didWarnAboutKeySpread = {};
      exports.Fragment = REACT_FRAGMENT_TYPE;
      exports.jsx = function(type, config, maybeKey) {
        var trackActualOwner = 1e4 > ReactSharedInternals.recentlyCreatedOwnerStacks++;
        if (trackActualOwner) {
          var previousStackTraceLimit = Error.stackTraceLimit;
          Error.stackTraceLimit = 10;
          var debugStackDEV = Error("react-stack-top-frame");
          Error.stackTraceLimit = previousStackTraceLimit;
        } else debugStackDEV = unknownOwnerDebugStack;
        return jsxDEVImpl(
          type,
          config,
          maybeKey,
          false,
          debugStackDEV,
          trackActualOwner ? createTask(getTaskName(type)) : unknownOwnerDebugTask
        );
      };
      exports.jsxs = function(type, config, maybeKey) {
        var trackActualOwner = 1e4 > ReactSharedInternals.recentlyCreatedOwnerStacks++;
        if (trackActualOwner) {
          var previousStackTraceLimit = Error.stackTraceLimit;
          Error.stackTraceLimit = 10;
          var debugStackDEV = Error("react-stack-top-frame");
          Error.stackTraceLimit = previousStackTraceLimit;
        } else debugStackDEV = unknownOwnerDebugStack;
        return jsxDEVImpl(
          type,
          config,
          maybeKey,
          true,
          debugStackDEV,
          trackActualOwner ? createTask(getTaskName(type)) : unknownOwnerDebugTask
        );
      };
    })();
  }
});

// node_modules/react/jsx-runtime.js
var require_jsx_runtime = __commonJS({
  "node_modules/react/jsx-runtime.js"(exports, module) {
    "use strict";
    if (false) {
      module.exports = null;
    } else {
      module.exports = require_react_jsx_runtime_development();
    }
  }
});

// node_modules/mp4box/dist/rolldown-runtime-w6R9maHv.mjs
var __defProp2, __exportAll;
var init_rolldown_runtime_w6R9maHv = __esm({
  "node_modules/mp4box/dist/rolldown-runtime-w6R9maHv.mjs"() {
    __defProp2 = Object.defineProperty;
    __exportAll = (all, no_symbols) => {
      let target = {};
      for (var name in all) {
        __defProp2(target, name, {
          get: all[name],
          enumerable: true
        });
      }
      if (!no_symbols) {
        __defProp2(target, Symbol.toStringTag, { value: "Module" });
      }
      return target;
    };
  }
});

// node_modules/mp4box/dist/styp-9TIZZDLN.mjs
function fromCharCodeUint8(uint8arr) {
  const arr = [];
  for (let i = 0; i < uint8arr.length; i++) arr[i] = uint8arr[i];
  return String.fromCharCode.apply(void 0, arr);
}
function concatBuffers(buffer1, buffer2) {
  Log.debug("ArrayBuffer", "Trying to create a new buffer of size: " + (buffer1.byteLength + buffer2.byteLength));
  const tmp = new Uint8Array(buffer1.byteLength + buffer2.byteLength);
  tmp.set(new Uint8Array(buffer1), 0);
  tmp.set(new Uint8Array(buffer2), buffer1.byteLength);
  return tmp.buffer;
}
function boxEqualFields(box_a, box_b) {
  if (box_a && !box_b) return false;
  let prop;
  for (prop in box_a) if (DIFF_BOXES_PROP_NAMES.find((name) => name === prop)) continue;
  else if (box_a[prop] instanceof Box || box_b[prop] instanceof Box) continue;
  else if (typeof box_a[prop] === "undefined" || typeof box_b[prop] === "undefined") continue;
  else if (typeof box_a[prop] === "function" || typeof box_b[prop] === "function") continue;
  else if ("subBoxNames" in box_a && box_a.subBoxNames.indexOf(prop.slice(0, 4)) > -1 || "subBoxNames" in box_b && box_b.subBoxNames.indexOf(prop.slice(0, 4)) > -1) continue;
  else if (prop === "data" || prop === "start" || prop === "size" || prop === "creation_time" || prop === "modification_time") continue;
  else if (DIFF_PRIMITIVE_ARRAY_PROP_NAMES.find((name) => name === prop)) continue;
  else if (box_a[prop] !== box_b[prop]) return false;
  return true;
}
function boxEqual(box_a, box_b) {
  if (!boxEqualFields(box_a, box_b)) return false;
  for (let j = 0; j < DIFF_BOXES_PROP_NAMES.length; j++) {
    const name = DIFF_BOXES_PROP_NAMES[j];
    if (box_a[name] && box_b[name]) {
      if (!boxEqual(box_a[name], box_b[name])) return false;
    }
  }
  return true;
}
function getRegistryId(boxClass) {
  let current = boxClass;
  while (current) {
    if ("registryId" in current) return current["registryId"];
    current = Object.getPrototypeOf(current);
  }
}
function registerBoxes(registry) {
  const localRegistry = {
    uuid: {},
    sampleEntry: {},
    sampleGroupEntry: {},
    box: {}
  };
  for (const [key, value] of Object.entries(registry)) {
    if (isSampleGroupEntry(value)) {
      const groupingType = "grouping_type" in value ? value.grouping_type : void 0;
      if (!groupingType) throw new Error(`SampleGroupEntry class ${key} does not have a valid static grouping_type. Please ensure it is defined correctly.`);
      if (groupingType in localRegistry.sampleGroupEntry) throw new Error(`SampleGroupEntry class ${key} has a grouping_type that is already registered. Please ensure it is unique.`);
      localRegistry.sampleGroupEntry[groupingType] = value;
      continue;
    }
    if (isSampleEntry(value)) {
      const fourcc = "fourcc" in value ? value.fourcc : void 0;
      if (!fourcc) throw new Error(`SampleEntry class ${key} does not have a valid static fourcc. Please ensure it is defined correctly.`);
      if (fourcc in localRegistry.sampleEntry) throw new Error(`SampleEntry class ${key} has a fourcc that is already registered. Please ensure it is unique.`);
      localRegistry.sampleEntry[fourcc] = value;
      continue;
    }
    if (isBox(value)) {
      const fourcc = "fourcc" in value ? value.fourcc : void 0;
      const uuid = "uuid" in value ? value.uuid : void 0;
      if (fourcc === "uuid") {
        if (!uuid) throw new Error(`Box class ${key} has a fourcc of 'uuid' but does not have a valid uuid. Please ensure it is defined correctly.`);
        if (uuid in localRegistry.uuid) throw new Error(`Box class ${key} has a uuid that is already registered. Please ensure it is unique.`);
        localRegistry.uuid[uuid] = value;
        continue;
      }
      localRegistry.box[fourcc] = value;
      continue;
    }
    throw new Error(`Box class ${key} does not have a valid static fourcc, uuid, or grouping_type. Please ensure it is defined correctly.`);
  }
  BoxRegistry.uuid = { ...localRegistry.uuid };
  BoxRegistry.sampleEntry = { ...localRegistry.sampleEntry };
  BoxRegistry.sampleGroupEntry = { ...localRegistry.sampleGroupEntry };
  BoxRegistry.box = { ...localRegistry.box };
  return BoxRegistry;
}
function registerDescriptors(registry) {
  Object.entries(registry).forEach(([key, value]) => DescriptorRegistry[key] = value);
  return DescriptorRegistry;
}
function parseUUID(stream) {
  return parseHex16(stream);
}
function parseHex16(stream) {
  let hex16 = "";
  for (let i = 0; i < 16; i++) {
    const hex = stream.readUint8().toString(16);
    hex16 += hex.length === 1 ? "0" + hex : hex;
  }
  return hex16;
}
function parseOneBox(stream, headerOnly, parentSize) {
  let box;
  let originalSize;
  const start2 = stream.getPosition();
  let hdr_size = 0;
  let uuid;
  if (stream.getEndPosition() - start2 < 8) {
    Log.debug("BoxParser", "Not enough data in stream to parse the type and size of the box");
    return { code: 0 };
  }
  if (parentSize && parentSize < 8) {
    Log.debug("BoxParser", "Not enough bytes left in the parent box to parse a new box");
    return { code: 0 };
  }
  let size = stream.readUint32();
  const type = stream.readString(4);
  if (type.length !== 4 || !/^[\x20-\x7E]{4}$/.test(type)) {
    Log.error("BoxParser", `Invalid box type: '${type}'`);
    return {
      code: -1,
      start: start2,
      type
    };
  }
  let box_type = type;
  Log.debug("BoxParser", "Found box of type '" + type + "' and size " + size + " at position " + start2);
  hdr_size = 8;
  if (type === "uuid") {
    if (stream.getEndPosition() - stream.getPosition() < 16 || parentSize - hdr_size < 16) {
      stream.seek(start2);
      Log.debug("BoxParser", "Not enough bytes left in the parent box to parse a UUID box");
      return { code: 0 };
    }
    uuid = parseUUID(stream);
    hdr_size += 16;
    box_type = uuid;
  }
  if (size === 1) {
    if (stream.getEndPosition() - stream.getPosition() < 8 || parentSize && parentSize - hdr_size < 8) {
      stream.seek(start2);
      Log.warn("BoxParser", 'Not enough data in stream to parse the extended size of the "' + type + '" box');
      return { code: 0 };
    }
    originalSize = size;
    size = stream.readUint64();
    hdr_size += 8;
  } else if (size === 0) if (parentSize) size = parentSize;
  else if (type !== "mdat") {
    Log.error("BoxParser", "Unlimited box size not supported for type: '" + type + "'");
    box = new Box(size);
    box.type = type;
    return {
      code: 1,
      box,
      size: box.size
    };
  } else size = stream.getEndPosition() - start2;
  if (size !== 0 && size < hdr_size) {
    Log.error("BoxParser", "Box of type " + type + " has an invalid size " + size + " (too small to be a box)");
    return {
      code: 0,
      type,
      size,
      hdr_size,
      start: start2
    };
  }
  if (size !== 0 && parentSize && size > parentSize) {
    Log.error("BoxParser", "Box of type '" + type + "' has a size " + size + " greater than its container size " + parentSize);
    return {
      code: 0,
      type,
      size,
      hdr_size,
      start: start2
    };
  }
  if (size !== 0 && start2 + size > stream.getEndPosition()) {
    stream.seek(start2);
    Log.info("BoxParser", "Not enough data in stream to parse the entire '" + type + "' box");
    return {
      code: 0,
      type,
      size,
      hdr_size,
      start: start2,
      original_size: originalSize
    };
  }
  if (headerOnly) return {
    code: 1,
    type,
    size,
    hdr_size,
    start: start2
  };
  else if (type in BoxRegistry.box) box = new BoxRegistry.box[type](size);
  else if (type !== "uuid") {
    Log.warn("BoxParser", `Unknown box type: '${type}'`);
    box = new Box(size);
    box.type = type;
    box.has_unparsed_data = true;
  } else if (uuid in BoxRegistry.uuid) box = new BoxRegistry.uuid[uuid](size);
  else {
    Log.warn("BoxParser", `Unknown UUID box type: '${uuid}'`);
    box = new Box(size);
    box.type = type;
    box.uuid = uuid;
    box.has_unparsed_data = true;
  }
  box.original_size = originalSize;
  box.hdr_size = hdr_size;
  box.start = start2;
  if (box.write === Box.prototype.write && box.type !== "mdat") {
    Log.info("BoxParser", "'" + box_type + "' box writing not yet implemented, keeping unparsed data in memory for later write");
    box.parseDataAndRewind(stream);
  }
  box.parse(stream);
  const diff = stream.getPosition() - (box.start + box.size);
  if (diff < 0) {
    Log.warn("BoxParser", "Parsing of box '" + box_type + "' did not read the entire indicated box data size (missing " + -diff + " bytes), seeking forward");
    stream.seek(box.start + box.size);
  } else if (diff > 0 && box.size !== 0) {
    Log.error("BoxParser", "Parsing of box '" + box_type + "' read " + diff + " more bytes than the indicated box data size, seeking backwards");
    stream.seek(box.start + box.size);
  }
  return {
    code: 1,
    box,
    size: box.size
  };
}
function decimalToHex(d, padding) {
  let hex = Number(d).toString(16);
  padding = typeof padding === "undefined" ? 2 : padding;
  while (hex.length < padding) hex = "0" + hex;
  return hex;
}
function createFile(keepMdatData = false, stream) {
  return new ISOFile(stream, !keepMdatData);
}
var MAX_SIZE, MAX_UINT32, TFHD_FLAG_DEFAULT_BASE_IS_MOOF, TRUN_FLAGS_FLAGS, TRUN_FLAGS_CTS_OFFSET, MP4BoxBuffer, Endianness, DataStream, start, LOG_LEVEL_ERROR, LOG_LEVEL_WARNING, LOG_LEVEL_INFO, LOG_LEVEL_DEBUG, log_level, Log, MultiBufferStream, Box, FullBox, SampleGroupEntry, TrackGroupTypeBox, SingleItemTypeReferenceBox, SingleItemTypeReferenceBoxLarge, TrackReferenceTypeBox, DIFF_BOXES_PROP_NAMES, DIFF_PRIMITIVE_ARRAY_PROP_NAMES, isSampleGroupEntry, isSampleEntry, isBox, BoxRegistry, DescriptorRegistry, ContainerBox, SampleEntry, HintSampleEntry, MetadataSampleEntry, SubtitleSampleEntry, TextSampleEntry, VisualSampleEntry, AudioSampleEntry, SystemSampleEntry, ParameterSetArray, avcCBox, mdatBox, idatBox, freeBox, skipBox, hmhdBox, nmhdBox, iodsBox, xmlBox, bxmlBox, iproBox, moovBox, trakBox, edtsBox, mdiaBox, minfBox, dinfBox, stblBox, mvexBox, moofBox, trafBox, vttcBox, mfraBox, mecoBox, hntiBox, hinfBox, strkBox, strdBox, sinfBox, rinfBox, schiBox, trgrBox, udtaBox, iprpBox, ipcoBox, grplBox, j2kHBox, etypBox, povdBox, drefBox, elngBox, ftypBox, hdlrBox, hvcCBox, mdhdBox, mehdBox, infeBox, iinfBox, ilocBox, REFERENCE_TYPE_NAMES, irefBox, pitmBox, metaBox, mfhdBox, mvhdBox, mettSampleEntry, metxSampleEntry, av1CBox, esdsBox, waveBox, lvcCBox, vpcCBox, vvcCBox, colrBox, avcCSampleEntryBase, avc1SampleEntry, avc2SampleEntry, avc3SampleEntry, avc4SampleEntry, av01SampleEntry, dav1SampleEntry, hvcCSampleEntryBase, hvc1SampleEntry, hvc2SampleEntry, hev1SampleEntry, hev2SampleEntry, hvt1SampleEntry, lhe1SampleEntry, lhv1SampleEntry, lvc1SampleEntry, dvh1SampleEntry, dvheSampleEntry, vvcCSampleEntryBase, vvc1SampleEntry, vvi1SampleEntry, vvs1SampleEntry, vvcNSampleEntry, vpcCSampleEntryBase, vp08SampleEntry, vp09SampleEntry, avs3SampleEntry, j2kiSampleEntry, mjp2SampleEntry, mjpgSampleEntry, uncvSampleEntry, mp4vSampleEntry, mp4aSampleEntry, m4aeSampleEntry, ac_3SampleEntry, ac_4SampleEntry, ec_3SampleEntry, OpusSampleEntry, mha1SampleEntry, mha2SampleEntry, mhm1SampleEntry, mhm2SampleEntry, fLaCSampleEntry, encvSampleEntry, encaSampleEntry, encuSampleEntry, encsSampleEntry, mp4sSampleEntry, enctSampleEntry, encmSampleEntry, resvSampleEntry, sbttSampleEntry, stppSampleEntry, stxtSampleEntry, tx3gSampleEntry, wvttSampleEntry, sbgpBox, sdtpBox, sgpdBox, sidxBox, smhdBox, stcoBox, sthdBox, stscBox, stsdBox, stszBox, sttsBox, tfdtBox, tfhdBox, tkhdBox, trexBox, trunBox, urlBox, vmhdBox, SampleGroupInfo, ISOFile, emsgBox, ssixBox, stypBox;
var init_styp_9TIZZDLN = __esm({
  "node_modules/mp4box/dist/styp-9TIZZDLN.mjs"() {
    MAX_SIZE = Math.pow(2, 32);
    MAX_UINT32 = Math.pow(2, 32) - 1;
    TFHD_FLAG_DEFAULT_BASE_IS_MOOF = 131072;
    TRUN_FLAGS_FLAGS = 1024;
    TRUN_FLAGS_CTS_OFFSET = 2048;
    MP4BoxBuffer = class MP4BoxBuffer2 extends ArrayBuffer {
      constructor(byteLength) {
        super(byteLength);
        this.fileStart = 0;
        this.usedBytes = 0;
      }
      static fromArrayBuffer(buffer, fileStart) {
        const mp4BoxBuffer = new MP4BoxBuffer2(buffer.byteLength);
        new Uint8Array(mp4BoxBuffer).set(new Uint8Array(buffer));
        mp4BoxBuffer.fileStart = fileStart;
        return mp4BoxBuffer;
      }
    };
    Endianness = /* @__PURE__ */ (function(Endianness2) {
      Endianness2[Endianness2["BIG_ENDIAN"] = 1] = "BIG_ENDIAN";
      Endianness2[Endianness2["LITTLE_ENDIAN"] = 2] = "LITTLE_ENDIAN";
      return Endianness2;
    })({});
    DataStream = class DataStream2 {
      static {
        this.ENDIANNESS = new Int8Array(new Int16Array([1]).buffer)[0] > 0 ? 2 : 1;
      }
      /**
      * DataStream reads scalars, arrays and structs of data from an ArrayBuffer.
      * It's like a file-like DataView on steroids.
      *
      * @param arrayBuffer ArrayBuffer to read from.
      * @param byteOffset Offset from arrayBuffer beginning for the DataStream.
      * @param endianness Endianness of the DataStream (default: BIG_ENDIAN).
      */
      constructor(arrayBuffer, byteOffset, endianness) {
        this._byteLength = 0;
        this.failurePosition = 0;
        this._dynamicSize = 1;
        this._byteOffset = byteOffset || 0;
        if (arrayBuffer instanceof ArrayBuffer) this.buffer = MP4BoxBuffer.fromArrayBuffer(arrayBuffer, 0);
        else if (arrayBuffer instanceof DataView) {
          this.dataView = arrayBuffer;
          if (byteOffset) this._byteOffset += byteOffset;
        } else this.buffer = new MP4BoxBuffer(arrayBuffer || 0);
        this.position = 0;
        this.endianness = endianness ? endianness : 1;
      }
      getPosition() {
        return this.position;
      }
      /**
      * Internal function to resize the DataStream buffer when required.
      * @param extra Number of bytes to add to the buffer allocation.
      */
      _realloc(extra) {
        if (!this._dynamicSize) return;
        const req = this._byteOffset + this.position + extra;
        let blen = this._buffer.byteLength;
        if (req <= blen) {
          if (req > this._byteLength) this._byteLength = req;
          return;
        }
        if (blen < 1) blen = 1;
        while (req > blen) blen *= 2;
        const buf = new MP4BoxBuffer(blen);
        const src = new Uint8Array(this._buffer);
        new Uint8Array(buf, 0, src.length).set(src);
        this.buffer = buf;
        this._byteLength = req;
      }
      /**
      * Internal function to trim the DataStream buffer when required.
      * Used for stripping out the extra bytes from the backing buffer when
      * the virtual byteLength is smaller than the buffer byteLength (happens after
      * growing the buffer with writes and not filling the extra space completely).
      */
      _trimAlloc() {
        if (this._byteLength === this._buffer.byteLength) return;
        const buf = new MP4BoxBuffer(this._byteLength);
        const dst = new Uint8Array(buf);
        const src = new Uint8Array(this._buffer, 0, dst.length);
        dst.set(src);
        this.buffer = buf;
      }
      /**
      * Returns the byte length of the DataStream object.
      * @type {number}
      */
      get byteLength() {
        return this._byteLength - this._byteOffset;
      }
      /**
      * Set/get the backing ArrayBuffer of the DataStream object.
      * The setter updates the DataView to point to the new buffer.
      * @type {Object}
      */
      get buffer() {
        this._trimAlloc();
        return this._buffer;
      }
      set buffer(value) {
        this._buffer = value;
        this._dataView = new DataView(value, this._byteOffset);
        this._byteLength = value.byteLength;
      }
      /**
      * Set/get the byteOffset of the DataStream object.
      * The setter updates the DataView to point to the new byteOffset.
      * @type {number}
      */
      get byteOffset() {
        return this._byteOffset;
      }
      set byteOffset(value) {
        this._byteOffset = value;
        this._dataView = new DataView(this._buffer, this._byteOffset);
        this._byteLength = this._buffer.byteLength;
      }
      /**
      * Set/get the byteOffset of the DataStream object.
      * The setter updates the DataView to point to the new byteOffset.
      * @type {number}
      */
      get dataView() {
        return this._dataView;
      }
      set dataView(value) {
        this._byteOffset = value.byteOffset;
        this._buffer = MP4BoxBuffer.fromArrayBuffer(value.buffer, 0);
        this._dataView = new DataView(this._buffer, this._byteOffset);
        this._byteLength = this._byteOffset + value.byteLength;
      }
      /**
      *   Sets the DataStream read/write position to given position.
      *   Clamps between 0 and DataStream length.
      *
      *   @param pos Position to seek to.
      *   @return
      */
      seek(pos) {
        const npos = Math.max(0, Math.min(this.byteLength, pos));
        this.position = isNaN(npos) || !isFinite(npos) ? 0 : npos;
      }
      /**
      * Returns true if the DataStream seek pointer is at the end of buffer and
      * there's no more data to read.
      *
      * @return True if the seek pointer is at the end of the buffer.
      */
      isEof() {
        return this.position >= this._byteLength;
      }
      #isTupleType(type) {
        return Array.isArray(type) && type.length === 3 && type[0] === "[]";
      }
      /**
      * Maps a Uint8Array into the DataStream buffer.
      *
      * Nice for quickly reading in data.
      *
      * @param length Number of elements to map.
      * @param e Endianness of the data to read.
      * @return Uint8Array to the DataStream backing buffer.
      */
      mapUint8Array(length) {
        this._realloc(length * 1);
        const arr = new Uint8Array(this._buffer, this.byteOffset + this.position, length);
        this.position += length * 1;
        return arr;
      }
      /**
      * Reads an Int32Array of desired length and endianness from the DataStream.
      *
      * @param length Number of elements to map.
      * @param endianness Endianness of the data to read.
      * @return The read Int32Array.
      */
      readInt32Array(length, endianness) {
        length = length === void 0 ? this.byteLength - this.position / 4 : length;
        const arr = new Int32Array(length);
        DataStream2.memcpy(arr.buffer, 0, this.buffer, this.byteOffset + this.position, length * arr.BYTES_PER_ELEMENT);
        DataStream2.arrayToNative(arr, endianness ?? this.endianness);
        this.position += arr.byteLength;
        return arr;
      }
      /**
      * Reads an Int16Array of desired length and endianness from the DataStream.
      *
      * @param length Number of elements to map.
      * @param endianness Endianness of the data to read.
      * @return The read Int16Array.
      */
      readInt16Array(length, endianness) {
        length = length === void 0 ? this.byteLength - this.position / 2 : length;
        const arr = new Int16Array(length);
        DataStream2.memcpy(arr.buffer, 0, this.buffer, this.byteOffset + this.position, length * arr.BYTES_PER_ELEMENT);
        DataStream2.arrayToNative(arr, endianness ?? this.endianness);
        this.position += arr.byteLength;
        return arr;
      }
      /**
      * Reads an Int8Array of desired length from the DataStream.
      *
      * @param length Number of elements to map.
      * @param e Endianness of the data to read.
      * @return The read Int8Array.
      */
      readInt8Array(length) {
        length = length === void 0 ? this.byteLength - this.position : length;
        const arr = new Int8Array(length);
        DataStream2.memcpy(arr.buffer, 0, this.buffer, this.byteOffset + this.position, length * arr.BYTES_PER_ELEMENT);
        this.position += arr.byteLength;
        return arr;
      }
      /**
      * Reads a Uint32Array of desired length and endianness from the DataStream.
      *
      *  @param length Number of elements to map.
      *  @param endianness Endianness of the data to read.
      *  @return The read Uint32Array.
      */
      readUint32Array(length, endianness) {
        length = length === void 0 ? this.byteLength - this.position / 4 : length;
        const arr = new Uint32Array(length);
        DataStream2.memcpy(arr.buffer, 0, this.buffer, this.byteOffset + this.position, length * arr.BYTES_PER_ELEMENT);
        DataStream2.arrayToNative(arr, endianness ?? this.endianness);
        this.position += arr.byteLength;
        return arr;
      }
      /**
      * Reads a Uint16Array of desired length and endianness from the DataStream.
      *
      * @param length Number of elements to map.
      * @param endianness Endianness of the data to read.
      * @return The read Uint16Array.
      */
      readUint16Array(length, endianness) {
        length = length === void 0 ? this.byteLength - this.position / 2 : length;
        const arr = new Uint16Array(length);
        DataStream2.memcpy(arr.buffer, 0, this.buffer, this.byteOffset + this.position, length * arr.BYTES_PER_ELEMENT);
        DataStream2.arrayToNative(arr, endianness ?? this.endianness);
        this.position += arr.byteLength;
        return arr;
      }
      /**
      * Reads a Uint8Array of desired length from the DataStream.
      *
      * @param length Number of elements to map.
      * @param e Endianness of the data to read.
      * @return The read Uint8Array.
      */
      readUint8Array(length) {
        length = length === void 0 ? this.byteLength - this.position : length;
        const arr = new Uint8Array(length);
        DataStream2.memcpy(arr.buffer, 0, this.buffer, this.byteOffset + this.position, length * arr.BYTES_PER_ELEMENT);
        this.position += arr.byteLength;
        return arr;
      }
      /**
      * Reads a Float64Array of desired length and endianness from the DataStream.
      *
      * @param length Number of elements to map.
      * @param endianness Endianness of the data to read.
      * @return The read Float64Array.
      */
      readFloat64Array(length, endianness) {
        length = length === void 0 ? this.byteLength - this.position / 8 : length;
        const arr = new Float64Array(length);
        DataStream2.memcpy(arr.buffer, 0, this.buffer, this.byteOffset + this.position, length * arr.BYTES_PER_ELEMENT);
        DataStream2.arrayToNative(arr, endianness ?? this.endianness);
        this.position += arr.byteLength;
        return arr;
      }
      /**
      * Reads a Float32Array of desired length and endianness from the DataStream.
      *
      * @param length Number of elements to map.
      * @param endianness Endianness of the data to read.
      * @return The read Float32Array.
      */
      readFloat32Array(length, endianness) {
        length = length === void 0 ? this.byteLength - this.position / 4 : length;
        const arr = new Float32Array(length);
        DataStream2.memcpy(arr.buffer, 0, this.buffer, this.byteOffset + this.position, length * arr.BYTES_PER_ELEMENT);
        DataStream2.arrayToNative(arr, endianness ?? this.endianness);
        this.position += arr.byteLength;
        return arr;
      }
      /**
      * Reads a 32-bit int from the DataStream with the desired endianness.
      *
      * @param endianness Endianness of the number.
      * @return The read number.
      */
      readInt32(endianness) {
        const v = this._dataView.getInt32(this.position, (endianness ?? this.endianness) === 2);
        this.position += 4;
        return v;
      }
      /**
      * Reads a 16-bit int from the DataStream with the desired endianness.
      *
      * @param endianness Endianness of the number.
      * @return The read number.
      */
      readInt16(endianness) {
        const v = this._dataView.getInt16(this.position, (endianness ?? this.endianness) === 2);
        this.position += 2;
        return v;
      }
      /**
      * Reads an 8-bit int from the DataStream.
      *
      * @return The read number.
      */
      readInt8() {
        const v = this._dataView.getInt8(this.position);
        this.position += 1;
        return v;
      }
      /**
      * Reads a 32-bit unsigned int from the DataStream with the desired endianness.
      *
      * @param endianness Endianness of the number.
      * @return The read number.
      */
      readUint32(endianness) {
        const v = this._dataView.getUint32(this.position, (endianness ?? this.endianness) === 2);
        this.position += 4;
        return v;
      }
      /**
      * Reads a 16-bit unsigned int from the DataStream with the desired endianness.
      *
      * @param endianness Endianness of the number.
      * @return The read number.
      */
      readUint16(endianness) {
        const v = this._dataView.getUint16(this.position, (endianness ?? this.endianness) === 2);
        this.position += 2;
        return v;
      }
      /**
      * Reads an 8-bit unsigned int from the DataStream.
      *
      * @return The read number.
      */
      readUint8() {
        const v = this._dataView.getUint8(this.position);
        this.position += 1;
        return v;
      }
      /**
      * Reads a 32-bit float from the DataStream with the desired endianness.
      *
      * @param endianness Endianness of the number.
      * @return The read number.
      */
      readFloat32(endianness) {
        const value = this._dataView.getFloat32(this.position, (endianness ?? this.endianness) === 2);
        this.position += 4;
        return value;
      }
      /**
      * Reads a 64-bit float from the DataStream with the desired endianness.
      *
      * @param endianness Endianness of the number.
      * @return The read number.
      */
      readFloat64(endianness) {
        const value = this._dataView.getFloat64(this.position, (endianness ?? this.endianness) === 2);
        this.position += 8;
        return value;
      }
      /**
      * Copies byteLength bytes from the src buffer at srcOffset to the
      * dst buffer at dstOffset.
      *
      * @param dst Destination ArrayBuffer to write to.
      * @param dstOffset Offset to the destination ArrayBuffer.
      * @param src Source ArrayBuffer to read from.
      * @param srcOffset Offset to the source ArrayBuffer.
      * @param byteLength Number of bytes to copy.
      */
      static memcpy(dst, dstOffset, src, srcOffset, byteLength) {
        const dstU8 = new Uint8Array(dst, dstOffset, byteLength);
        const srcU8 = new Uint8Array(src, srcOffset, byteLength);
        dstU8.set(srcU8);
      }
      /**
      * Converts array to native endianness in-place.
      *
      * @param typedArray Typed array to convert.
      * @param endianness True if the data in the array is
      *                                      little-endian. Set false for big-endian.
      * @return The converted typed array.
      */
      static arrayToNative(typedArray, endianness) {
        if (endianness === DataStream2.ENDIANNESS) return typedArray;
        else return this.flipArrayEndianness(typedArray);
      }
      /**
      * Converts native endianness array to desired endianness in-place.
      *
      * @param typedArray Typed array to convert.
      * @param littleEndian True if the converted array should be
      *                               little-endian. Set false for big-endian.
      * @return The converted typed array.
      */
      static nativeToEndian(typedArray, littleEndian) {
        if (littleEndian && DataStream2.ENDIANNESS === 2) return typedArray;
        else return this.flipArrayEndianness(typedArray);
      }
      /**
      * Flips typed array endianness in-place.
      *
      * @param typedArray Typed array to flip.
      * @return The converted typed array.
      */
      static flipArrayEndianness(typedArray) {
        const u8 = new Uint8Array(typedArray.buffer, typedArray.byteOffset, typedArray.byteLength);
        for (let i = 0; i < typedArray.byteLength; i += typedArray.BYTES_PER_ELEMENT) for (let j = i + typedArray.BYTES_PER_ELEMENT - 1, k = i; j > k; j--, k++) {
          const tmp = u8[k];
          u8[k] = u8[j];
          u8[j] = tmp;
        }
        return typedArray;
      }
      /**
      * Read a string of desired length and encoding from the DataStream.
      *
      * @param length The length of the string to read in bytes.
      * @param encoding The encoding of the string data in the DataStream.
      *                           Defaults to ASCII.
      * @return The read string.
      */
      readString(length, encoding) {
        if (encoding === void 0 || encoding === "ASCII") return fromCharCodeUint8(this.mapUint8Array(length === void 0 ? this.byteLength - this.position : length));
        else return new TextDecoder(encoding).decode(this.mapUint8Array(length));
      }
      /**
      * Read null-terminated string of desired length from the DataStream. Truncates
      * the returned string so that the null byte is not a part of it.
      *
      * @param length The length of the string to read.
      * @return The read string.
      */
      readCString(length) {
        let i = 0;
        const blen = this.byteLength - this.position;
        const u8 = new Uint8Array(this._buffer, this._byteOffset + this.position);
        const len = length !== void 0 ? Math.min(length, blen) : blen;
        for (; i < len && u8[i] !== 0; i++) ;
        const s = fromCharCodeUint8(this.mapUint8Array(i));
        if (length !== void 0) this.position += len - i;
        else if (i !== blen) this.position += 1;
        return s;
      }
      readInt64() {
        return this.readInt32() * MAX_SIZE + this.readUint32();
      }
      readUint64() {
        return this.readUint32() * MAX_SIZE + this.readUint32();
      }
      readUint24() {
        return (this.readUint8() << 16) + (this.readUint8() << 8) + this.readUint8();
      }
      /**
      * Saves the DataStream contents to the given filename.
      * Uses Chrome's anchor download property to initiate download.
      *
      * @param filename Filename to save as.
      * @return
      * @bundle DataStream-write.js
      */
      save(filename) {
        const blob = new Blob([this.buffer]);
        if (typeof window !== "undefined" && typeof document !== "undefined") if (window.URL && URL.createObjectURL) {
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement("a");
          document.body.appendChild(a);
          a.setAttribute("href", url);
          a.setAttribute("download", filename);
          a.setAttribute("target", "_self");
          a.click();
          window.URL.revokeObjectURL(url);
          document.body.removeChild(a);
        } else throw new Error("DataStream.save: Can't create object URL.");
        return blob;
      }
      /** @bundle DataStream-write.js */
      get dynamicSize() {
        return this._dynamicSize;
      }
      /** @bundle DataStream-write.js */
      set dynamicSize(v) {
        if (!v) this._trimAlloc();
        this._dynamicSize = v;
      }
      /**
      * Internal function to trim the DataStream buffer when required.
      * Used for stripping out the first bytes when not needed anymore.
      *
      * @return
      * @bundle DataStream-write.js
      */
      shift(offset) {
        const buf = new MP4BoxBuffer(this._byteLength - offset);
        const dst = new Uint8Array(buf);
        const src = new Uint8Array(this._buffer, offset, dst.length);
        dst.set(src);
        this.buffer = buf;
        this.position -= offset;
      }
      /**
      * Writes an Int32Array of specified endianness to the DataStream.
      *
      * @param array The array to write.
      * @param endianness Endianness of the data to write.
      * @bundle DataStream-write.js
      */
      writeInt32Array(array, endianness) {
        this._realloc(array.length * 4);
        if (array instanceof Int32Array && this.byteOffset + this.position % array.BYTES_PER_ELEMENT === 0) {
          DataStream2.memcpy(this._buffer, this.byteOffset + this.position, array.buffer, 0, array.byteLength);
          this.mapInt32Array(array.length, endianness);
        } else for (let i = 0; i < array.length; i++) this.writeInt32(array[i], endianness);
      }
      /**
      * Writes an Int16Array of specified endianness to the DataStream.
      *
      * @param array The array to write.
      * @param endianness Endianness of the data to write.
      * @bundle DataStream-write.js
      */
      writeInt16Array(array, endianness) {
        this._realloc(array.length * 2);
        if (array instanceof Int16Array && this.byteOffset + this.position % array.BYTES_PER_ELEMENT === 0) {
          DataStream2.memcpy(this._buffer, this.byteOffset + this.position, array.buffer, 0, array.byteLength);
          this.mapInt16Array(array.length, endianness);
        } else for (let i = 0; i < array.length; i++) this.writeInt16(array[i], endianness);
      }
      /**
      * Writes an Int8Array to the DataStream.
      *
      * @param array The array to write.
      * @bundle DataStream-write.js
      */
      writeInt8Array(array) {
        this._realloc(array.length * 1);
        if (array instanceof Int8Array && this.byteOffset + this.position % array.BYTES_PER_ELEMENT === 0) {
          DataStream2.memcpy(this._buffer, this.byteOffset + this.position, array.buffer, 0, array.byteLength);
          this.mapInt8Array(array.length);
        } else for (let i = 0; i < array.length; i++) this.writeInt8(array[i]);
      }
      /**
      * Writes a Uint32Array of specified endianness to the DataStream.
      *
      * @param array The array to write.
      * @param endianness Endianness of the data to write.
      * @bundle DataStream-write.js
      */
      writeUint32Array(array, endianness) {
        this._realloc(array.length * 4);
        if (array instanceof Uint32Array && this.byteOffset + this.position % array.BYTES_PER_ELEMENT === 0) {
          DataStream2.memcpy(this._buffer, this.byteOffset + this.position, array.buffer, 0, array.byteLength);
          this.mapUint32Array(array.length, endianness);
        } else for (let i = 0; i < array.length; i++) this.writeUint32(array[i], endianness);
      }
      /**
      * Writes a Uint16Array of specified endianness to the DataStream.
      *
      * @param array The array to write.
      * @param endianness Endianness of the data to write.
      * @bundle DataStream-write.js
      */
      writeUint16Array(array, endianness) {
        this._realloc(array.length * 2);
        if (array instanceof Uint16Array && this.byteOffset + this.position % array.BYTES_PER_ELEMENT === 0) {
          DataStream2.memcpy(this._buffer, this.byteOffset + this.position, array.buffer, 0, array.byteLength);
          this.mapUint16Array(array.length, endianness);
        } else for (let i = 0; i < array.length; i++) this.writeUint16(array[i], endianness);
      }
      /**
      * Writes a Uint8Array to the DataStream.
      *
      * @param array The array to write.
      * @bundle DataStream-write.js
      */
      writeUint8Array(array) {
        this._realloc(array.length * 1);
        if (array instanceof Uint8Array && this.byteOffset + this.position % array.BYTES_PER_ELEMENT === 0) {
          DataStream2.memcpy(this._buffer, this.byteOffset + this.position, array.buffer, 0, array.byteLength);
          this.mapUint8Array(array.length);
        } else for (let i = 0; i < array.length; i++) this.writeUint8(array[i]);
      }
      /**
      * Writes a Float64Array of specified endianness to the DataStream.
      *
      * @param array The array to write.
      * @param endianness Endianness of the data to write.
      * @bundle DataStream-write.js
      */
      writeFloat64Array(array, endianness) {
        this._realloc(array.length * 8);
        if (array instanceof Float64Array && this.byteOffset + this.position % array.BYTES_PER_ELEMENT === 0) {
          DataStream2.memcpy(this._buffer, this.byteOffset + this.position, array.buffer, 0, array.byteLength);
          this.mapFloat64Array(array.length, endianness);
        } else for (let i = 0; i < array.length; i++) this.writeFloat64(array[i], endianness);
      }
      /**
      * Writes a Float32Array of specified endianness to the DataStream.
      *
      * @param array The array to write.
      * @param endianness Endianness of the data to write.
      * @bundle DataStream-write.js
      */
      writeFloat32Array(array, endianness) {
        this._realloc(array.length * 4);
        if (array instanceof Float32Array && this.byteOffset + this.position % array.BYTES_PER_ELEMENT === 0) {
          DataStream2.memcpy(this._buffer, this.byteOffset + this.position, array.buffer, 0, array.byteLength);
          this.mapFloat32Array(array.length, endianness);
        } else for (let i = 0; i < array.length; i++) this.writeFloat32(array[i], endianness);
      }
      /**
      * Writes a 64-bit int to the DataStream with the desired endianness.
      *
      * @param value Number to write.
      * @param endianness Endianness of the number.
      * @bundle DataStream-write.js
      */
      writeInt64(value, endianness) {
        this._realloc(8);
        this._dataView.setBigInt64(this.position, BigInt(value), (endianness ?? this.endianness) === 2);
        this.position += 8;
      }
      /**
      * Writes a 32-bit int to the DataStream with the desired endianness.
      *
      * @param value Number to write.
      * @param endianness Endianness of the number.
      * @bundle DataStream-write.js
      */
      writeInt32(value, endianness) {
        this._realloc(4);
        this._dataView.setInt32(this.position, value, (endianness ?? this.endianness) === 2);
        this.position += 4;
      }
      /**
      * Writes a 16-bit int to the DataStream with the desired endianness.
      *
      * @param value Number to write.
      * @param endianness Endianness of the number.
      * @bundle DataStream-write.js
      */
      writeInt16(value, endianness) {
        this._realloc(2);
        this._dataView.setInt16(this.position, value, (endianness ?? this.endianness) === 2);
        this.position += 2;
      }
      /**
      * Writes an 8-bit int to the DataStream.
      *
      * @param value Number to write.
      * @bundle DataStream-write.js
      */
      writeInt8(value) {
        this._realloc(1);
        this._dataView.setInt8(this.position, value);
        this.position += 1;
      }
      /**
      * Writes a 32-bit unsigned int to the DataStream with the desired endianness.
      *
      * @param value Number to write.
      * @param endianness Endianness of the number.
      * @bundle DataStream-write.js
      */
      writeUint32(value, endianness) {
        this._realloc(4);
        this._dataView.setUint32(this.position, value, (endianness ?? this.endianness) === 2);
        this.position += 4;
      }
      /**
      * Writes a 16-bit unsigned int to the DataStream with the desired endianness.
      *
      * @param value Number to write.
      * @param endianness Endianness of the number.
      * @bundle DataStream-write.js
      */
      writeUint16(value, endianness) {
        this._realloc(2);
        this._dataView.setUint16(this.position, value, (endianness ?? this.endianness) === 2);
        this.position += 2;
      }
      /**
      * Writes an 8-bit unsigned  int to the DataStream.
      *
      * @param value Number to write.
      * @bundle DataStream-write.js
      */
      writeUint8(value) {
        this._realloc(1);
        this._dataView.setUint8(this.position, value);
        this.position += 1;
      }
      /**
      * Writes a 32-bit float to the DataStream with the desired endianness.
      *
      * @param value Number to write.
      * @param endianness Endianness of the number.
      * @bundle DataStream-write.js
      */
      writeFloat32(value, endianness) {
        this._realloc(4);
        this._dataView.setFloat32(this.position, value, (endianness ?? this.endianness) === 2);
        this.position += 4;
      }
      /**
      * Writes a 64-bit float to the DataStream with the desired endianness.
      *
      * @param value Number to write.
      * @param endianness Endianness of the number.
      * @bundle DataStream-write.js
      */
      writeFloat64(value, endianness) {
        this._realloc(8);
        this._dataView.setFloat64(this.position, value, (endianness ?? this.endianness) === 2);
        this.position += 8;
      }
      /**
      * Write a UCS-2 string of desired endianness to the DataStream. The
      * lengthOverride argument lets you define the number of characters to write.
      * If the string is shorter than lengthOverride, the extra space is padded with
      * zeroes.
      *
      * @param value The string to write.
      * @param endianness The endianness to use for the written string data.
      * @param lengthOverride The number of characters to write.
      * @bundle DataStream-write.js
      */
      writeUCS2String(value, endianness, lengthOverride) {
        if (lengthOverride === void 0) lengthOverride = value.length;
        let i;
        for (i = 0; i < value.length && i < lengthOverride; i++) this.writeUint16(value.charCodeAt(i), endianness);
        for (; i < lengthOverride; i++) this.writeUint16(0);
      }
      /**
      * Writes a string of desired length and encoding to the DataStream.
      *
      * @param value The string to write.
      * @param encoding The encoding for the written string data.
      *                           Defaults to ASCII.
      * @param length The number of characters to write.
      * @bundle DataStream-write.js
      */
      writeString(value, encoding, length) {
        let i = 0;
        if (encoding === void 0 || encoding === "ASCII") if (length !== void 0) {
          const len = Math.min(value.length, length);
          for (i = 0; i < len; i++) this.writeUint8(value.charCodeAt(i));
          for (; i < length; i++) this.writeUint8(0);
        } else for (i = 0; i < value.length; i++) this.writeUint8(value.charCodeAt(i));
        else this.writeUint8Array(new TextEncoder(encoding).encode(value.substring(0, length)));
      }
      /**
      * Writes a null-terminated string to DataStream and zero-pads it to length
      * bytes. If length is not given, writes the string followed by a zero.
      * If string is longer than length, the written part of the string does not have
      * a trailing zero.
      *
      * @param value The string to write.
      * @param length The number of characters to write.
      * @bundle DataStream-write.js
      */
      writeCString(value, length) {
        let i = 0;
        if (length !== void 0) {
          const len = Math.min(value.length, length);
          for (i = 0; i < len; i++) this.writeUint8(value.charCodeAt(i));
          for (; i < length; i++) this.writeUint8(0);
        } else {
          for (i = 0; i < value.length; i++) this.writeUint8(value.charCodeAt(i));
          this.writeUint8(0);
        }
      }
      /**
      * Writes a struct to the DataStream. Takes a structDefinition that gives the
      * types and a struct object that gives the values. Refer to readStruct for the
      * structure of structDefinition.
      *
      * @param structDefinition Type definition of the struct.
      * @param struct The struct data object.
      * @bundle DataStream-write.js
      */
      writeStruct(structDefinition, struct) {
        for (let i = 0; i < structDefinition.length; i++) {
          const [structName, structType] = structDefinition[i];
          const structValue = struct[structName];
          this.writeType(structType, structValue, struct);
        }
      }
      /**
      * Writes object v of type t to the DataStream.
      *
      * @param type Type of data to write.
      * @param value Value of data to write.
      * @param struct Struct to pass to write callback functions.
      * @bundle DataStream-write.js
      */
      writeType(type, value, struct) {
        if (typeof type === "function") return type(this, value);
        else if (typeof type === "object" && !(type instanceof Array)) return type.set(this, value, struct);
        let lengthOverride;
        let charset = "ASCII";
        const pos = this.position;
        let parsedType = type;
        if (typeof type === "string" && /:/.test(type)) {
          const tp = type.split(":");
          parsedType = tp[0];
          lengthOverride = parseInt(tp[1]);
        }
        if (typeof parsedType === "string" && /,/.test(parsedType)) {
          const tp = parsedType.split(",");
          parsedType = tp[0];
          charset = tp[1];
        }
        switch (parsedType) {
          case "uint8":
            this.writeUint8(value);
            break;
          case "int8":
            this.writeInt8(value);
            break;
          case "uint16":
            this.writeUint16(value, this.endianness);
            break;
          case "int16":
            this.writeInt16(value, this.endianness);
            break;
          case "uint32":
            this.writeUint32(value, this.endianness);
            break;
          case "int32":
            this.writeInt32(value, this.endianness);
            break;
          case "float32":
            this.writeFloat32(value, this.endianness);
            break;
          case "float64":
            this.writeFloat64(value, this.endianness);
            break;
          case "uint16be":
            this.writeUint16(value, 1);
            break;
          case "int16be":
            this.writeInt16(value, 1);
            break;
          case "uint32be":
            this.writeUint32(value, 1);
            break;
          case "int32be":
            this.writeInt32(value, 1);
            break;
          case "float32be":
            this.writeFloat32(value, 1);
            break;
          case "float64be":
            this.writeFloat64(value, 1);
            break;
          case "uint16le":
            this.writeUint16(value, 2);
            break;
          case "int16le":
            this.writeInt16(value, 2);
            break;
          case "uint32le":
            this.writeUint32(value, 2);
            break;
          case "int32le":
            this.writeInt32(value, 2);
            break;
          case "float32le":
            this.writeFloat32(value, 2);
            break;
          case "float64le":
            this.writeFloat64(value, 2);
            break;
          case "cstring":
            this.writeCString(value, lengthOverride);
            break;
          case "string":
            this.writeString(value, charset, lengthOverride);
            break;
          case "u16string":
            this.writeUCS2String(value, this.endianness, lengthOverride);
            break;
          case "u16stringle":
            this.writeUCS2String(value, 2, lengthOverride);
            break;
          case "u16stringbe":
            this.writeUCS2String(value, 1, lengthOverride);
            break;
          default:
            if (this.#isTupleType(parsedType)) {
              const [, ta] = parsedType;
              for (let i = 0; i < value.length; i++) this.writeType(ta, value[i]);
              break;
            } else {
              this.writeStruct(parsedType, value);
              break;
            }
        }
        if (lengthOverride) {
          this.position = pos;
          this._realloc(lengthOverride);
          this.position = pos + lengthOverride;
        }
      }
      /** @bundle DataStream-write.js */
      writeUint64(value) {
        const h = Math.floor(value / MAX_SIZE);
        this.writeUint32(h);
        this.writeUint32(value & 4294967295);
      }
      /** @bundle DataStream-write.js */
      writeUint24(value) {
        this.writeUint8((value & 16711680) >> 16);
        this.writeUint8((value & 65280) >> 8);
        this.writeUint8(value & 255);
      }
      /** @bundle DataStream-write.js */
      adjustUint32(position, value) {
        const pos = this.position;
        this.seek(position);
        this.writeUint32(value);
        this.seek(pos);
      }
      /**
      * Reads a struct of data from the DataStream. The struct is defined as
      * an array of [name, type]-pairs. See the example below:
      *
      * ```ts
      * ds.readStruct([
      *   ['headerTag', 'uint32'], // Uint32 in DataStream endianness.
      *   ['headerTag2', 'uint32be'], // Big-endian Uint32.
      *   ['headerTag3', 'uint32le'], // Little-endian Uint32.
      *   ['array', ['[]', 'uint32', 16]], // Uint32Array of length 16.
      *   ['array2', ['[]', 'uint32', 'array2Length']] // Uint32Array of length array2Length
      * ]);
      * ```
      *
      * The possible values for the type are as follows:
      *
      * ## Number types
      *
      * Unsuffixed number types use DataStream endianness.
      * To explicitly specify endianness, suffix the type with
      * 'le' for little-endian or 'be' for big-endian,
      * e.g. 'int32be' for big-endian int32.
      *
      * - `uint8` -- 8-bit unsigned int
      * - `uint16` -- 16-bit unsigned int
      * - `uint32` -- 32-bit unsigned int
      * - `int8` -- 8-bit int
      * - `int16` -- 16-bit int
      * - `int32` -- 32-bit int
      * - `float32` -- 32-bit float
      * - `float64` -- 64-bit float
      *
      * ## String types
      *
      * - `cstring` -- ASCII string terminated by a zero byte.
      * - `string:N` -- ASCII string of length N.
      * - `string,CHARSET:N` -- String of byteLength N encoded with given CHARSET.
      * - `u16string:N` -- UCS-2 string of length N in DataStream endianness.
      * - `u16stringle:N` -- UCS-2 string of length N in little-endian.
      * - `u16stringbe:N` -- UCS-2 string of length N in big-endian.
      *
      * ## Complex types
      *
      * ### Struct
      * ```ts
      * [[name, type], [name_2, type_2], ..., [name_N, type_N]]
      * ```
      *
      * ### Callback function to read and return data
      * ```ts
      * function(dataStream, struct) {}
      * ```
      *
      * ###  Getter/setter functions
      * to read and return data, handy for using the same struct definition
      * for reading and writing structs.
      * ```ts
      * {
      *    get: function(dataStream, struct) {},
      *    set: function(dataStream, struct) {}
      * }
      * ```
      *
      * ### Array
      * Array of given type and length. The length can be either
      * - a number
      * - a string that references a previously-read field
      * - `*`
      * - a callback: `function(struct, dataStream, type){}`
      *
      * If length is `*`, reads in as many elements as it can.
      * ```ts
      * ['[]', type, length]
      * ```
      *
      * @param structDefinition Struct definition object.
      * @return The read struct. Null if failed to read struct.
      * @bundle DataStream-read-struct.js
      */
      readStruct(structDefinition) {
        const struct = {};
        const p = this.position;
        for (let i = 0; i < structDefinition.length; i += 1) {
          const t = structDefinition[i][1];
          const v = this.readType(t, struct);
          if (!v) {
            if (this.failurePosition === 0) this.failurePosition = this.position;
            this.position = p;
            return;
          }
          struct[structDefinition[i][0]] = v;
        }
        return struct;
      }
      /**
      * Read UCS-2 string of desired length and endianness from the DataStream.
      *
      * @param length The length of the string to read.
      * @param endianness The endianness of the string data in the DataStream.
      * @return The read string.
      * @bundle DataStream-read-struct.js
      */
      readUCS2String(length, endianness) {
        return String.fromCharCode.apply(void 0, this.readUint16Array(length, endianness));
      }
      /**
      * Reads an object of type t from the DataStream, passing struct as the thus-far
      * read struct to possible callbacks that refer to it. Used by readStruct for
      * reading in the values, so the type is one of the readStruct types.
      *
      * @param type Type of the object to read.
      * @param struct Struct to refer to when resolving length references
      *                         and for calling callbacks.
      * @return  Returns the object on successful read, null on unsuccessful.
      * @bundle DataStream-read-struct.js
      */
      readType(type, struct) {
        if (typeof type === "function") return type(this, struct);
        if (typeof type === "object" && !(type instanceof Array)) return type.get(this, struct);
        if (type instanceof Array && type.length !== 3) return this.readStruct(type);
        let value;
        let lengthOverride;
        let charset = "ASCII";
        const pos = this.position;
        let parsedType = type;
        if (typeof parsedType === "string" && /:/.test(parsedType)) {
          const tp = parsedType.split(":");
          parsedType = tp[0];
          lengthOverride = parseInt(tp[1]);
        }
        if (typeof parsedType === "string" && /,/.test(parsedType)) {
          const tp = parsedType.split(",");
          parsedType = tp[0];
          charset = tp[1];
        }
        switch (parsedType) {
          case "uint8":
            value = this.readUint8();
            break;
          case "int8":
            value = this.readInt8();
            break;
          case "uint16":
            value = this.readUint16(this.endianness);
            break;
          case "int16":
            value = this.readInt16(this.endianness);
            break;
          case "uint32":
            value = this.readUint32(this.endianness);
            break;
          case "int32":
            value = this.readInt32(this.endianness);
            break;
          case "float32":
            value = this.readFloat32(this.endianness);
            break;
          case "float64":
            value = this.readFloat64(this.endianness);
            break;
          case "uint16be":
            value = this.readUint16(1);
            break;
          case "int16be":
            value = this.readInt16(1);
            break;
          case "uint32be":
            value = this.readUint32(1);
            break;
          case "int32be":
            value = this.readInt32(1);
            break;
          case "float32be":
            value = this.readFloat32(1);
            break;
          case "float64be":
            value = this.readFloat64(1);
            break;
          case "uint16le":
            value = this.readUint16(2);
            break;
          case "int16le":
            value = this.readInt16(2);
            break;
          case "uint32le":
            value = this.readUint32(2);
            break;
          case "int32le":
            value = this.readInt32(2);
            break;
          case "float32le":
            value = this.readFloat32(2);
            break;
          case "float64le":
            value = this.readFloat64(2);
            break;
          case "cstring":
            value = this.readCString(lengthOverride);
            break;
          case "string":
            value = this.readString(lengthOverride, charset);
            break;
          case "u16string":
            value = this.readUCS2String(lengthOverride, this.endianness);
            break;
          case "u16stringle":
            value = this.readUCS2String(lengthOverride, 2);
            break;
          case "u16stringbe":
            value = this.readUCS2String(lengthOverride, 1);
            break;
          default:
            if (this.#isTupleType(parsedType)) {
              const [, ta, len] = parsedType;
              const length = typeof len === "function" ? len(struct, this, parsedType) : typeof len === "string" && struct[len] !== void 0 ? parseInt(struct[len]) : typeof len === "number" ? len : len === "*" ? void 0 : parseInt(len);
              if (typeof ta === "string") {
                const tap = ta.replace(/(le|be)$/, "");
                let endianness;
                if (/le$/.test(ta)) endianness = 2;
                else if (/be$/.test(ta)) endianness = 1;
                switch (tap) {
                  case "uint8":
                    value = this.readUint8Array(length);
                    break;
                  case "uint16":
                    value = this.readUint16Array(length, endianness);
                    break;
                  case "uint32":
                    value = this.readUint32Array(length, endianness);
                    break;
                  case "int8":
                    value = this.readInt8Array(length);
                    break;
                  case "int16":
                    value = this.readInt16Array(length, endianness);
                    break;
                  case "int32":
                    value = this.readInt32Array(length, endianness);
                    break;
                  case "float32":
                    value = this.readFloat32Array(length, endianness);
                    break;
                  case "float64":
                    value = this.readFloat64Array(length, endianness);
                    break;
                  case "cstring":
                  case "utf16string":
                  case "string":
                    if (!length) {
                      value = [];
                      while (!this.isEof()) {
                        const u = this.readType(ta, struct);
                        if (!u) break;
                        value.push(u);
                      }
                    } else {
                      value = new Array(length);
                      for (let i = 0; i < length; i++) value[i] = this.readType(ta, struct);
                    }
                    break;
                }
              } else if (!length) {
                value = [];
                while (true) {
                  const pos2 = this.position;
                  try {
                    const type2 = this.readType(ta, struct);
                    if (!type2) {
                      this.position = pos2;
                      break;
                    }
                    value.push(type2);
                  } catch {
                    this.position = pos2;
                    break;
                  }
                }
              } else {
                value = new Array(length);
                for (let i = 0; i < length; i++) {
                  const type2 = this.readType(ta, struct);
                  if (!type2) return;
                  value[i] = type2;
                }
              }
              break;
            }
        }
        if (lengthOverride) this.position = pos + lengthOverride;
        return value;
      }
      /**
      * Maps an Int32Array into the DataStream buffer, swizzling it to native
      * endianness in-place. The current offset from the start of the buffer needs to
      * be a multiple of element size, just like with typed array views.
      *
      * Nice for quickly reading in data. Warning: potentially modifies the buffer
      * contents.
      *
      * @param length Number of elements to map.
      * @param endianness Endianness of the data to read.
      * @return Int32Array to the DataStream backing buffer.
      * @bundle DataStream-map.js
      */
      mapInt32Array(length, endianness) {
        this._realloc(length * 4);
        const arr = new Int32Array(this._buffer, this.byteOffset + this.position, length);
        DataStream2.arrayToNative(arr, endianness ?? this.endianness);
        this.position += length * 4;
        return arr;
      }
      /**
      * Maps an Int16Array into the DataStream buffer, swizzling it to native
      * endianness in-place. The current offset from the start of the buffer needs to
      * be a multiple of element size, just like with typed array views.
      *
      * Nice for quickly reading in data. Warning: potentially modifies the buffer
      * contents.
      *
      * @param length Number of elements to map.
      * @param endianness Endianness of the data to read.
      * @return Int16Array to the DataStream backing buffer.
      * @bundle DataStream-map.js
      */
      mapInt16Array(length, endianness) {
        this._realloc(length * 2);
        const arr = new Int16Array(this._buffer, this.byteOffset + this.position, length);
        DataStream2.arrayToNative(arr, endianness ?? this.endianness);
        this.position += length * 2;
        return arr;
      }
      /**
      * Maps an Int8Array into the DataStream buffer.
      *
      * Nice for quickly reading in data.
      *
      * @param length Number of elements to map.
      * @param endianness Endianness of the data to read.
      * @return Int8Array to the DataStream backing buffer.
      * @bundle DataStream-map.js
      */
      mapInt8Array(length, _endianness) {
        this._realloc(length * 1);
        const arr = new Int8Array(this._buffer, this.byteOffset + this.position, length);
        this.position += length * 1;
        return arr;
      }
      /**
      * Maps a Uint32Array into the DataStream buffer, swizzling it to native
      * endianness in-place. The current offset from the start of the buffer needs to
      * be a multiple of element size, just like with typed array views.
      *
      * Nice for quickly reading in data. Warning: potentially modifies the buffer
      * contents.
      *
      * @param length Number of elements to map.
      * @param endianness Endianness of the data to read.
      * @return Uint32Array to the DataStream backing buffer.
      * @bundle DataStream-map.js
      */
      mapUint32Array(length, endianness) {
        this._realloc(length * 4);
        const arr = new Uint32Array(this._buffer, this.byteOffset + this.position, length);
        DataStream2.arrayToNative(arr, endianness ?? this.endianness);
        this.position += length * 4;
        return arr;
      }
      /**
      * Maps a Uint16Array into the DataStream buffer, swizzling it to native
      * endianness in-place. The current offset from the start of the buffer needs to
      * be a multiple of element size, just like with typed array views.
      *
      * Nice for quickly reading in data. Warning: potentially modifies the buffer
      * contents.
      *
      * @param length Number of elements to map.
      * @param endianness Endianness of the data to read.
      * @return Uint16Array to the DataStream backing buffer.
      * @bundle DataStream-map.js
      */
      mapUint16Array(length, endianness) {
        this._realloc(length * 2);
        const arr = new Uint16Array(this._buffer, this.byteOffset + this.position, length);
        DataStream2.arrayToNative(arr, endianness ?? this.endianness);
        this.position += length * 2;
        return arr;
      }
      /**
      * Maps a Float64Array into the DataStream buffer, swizzling it to native
      * endianness in-place. The current offset from the start of the buffer needs to
      * be a multiple of element size, just like with typed array views.
      *
      * Nice for quickly reading in data. Warning: potentially modifies the buffer
      * contents.
      *
      * @param length Number of elements to map.
      * @param endianness Endianness of the data to read.
      * @return Float64Array to the DataStream backing buffer.
      * @bundle DataStream-map.js
      */
      mapFloat64Array(length, endianness) {
        this._realloc(length * 8);
        const arr = new Float64Array(this._buffer, this.byteOffset + this.position, length);
        DataStream2.arrayToNative(arr, endianness ?? this.endianness);
        this.position += length * 8;
        return arr;
      }
      /**
      * Maps a Float32Array into the DataStream buffer, swizzling it to native
      * endianness in-place. The current offset from the start of the buffer needs to
      * be a multiple of element size, just like with typed array views.
      *
      * Nice for quickly reading in data. Warning: potentially modifies the buffer
      * contents.
      *
      * @param length Number of elements to map.
      * @param endianness Endianness of the data to read.
      * @return Float32Array to the DataStream backing buffer.
      * @bundle DataStream-map.js
      */
      mapFloat32Array(length, endianness) {
        this._realloc(length * 4);
        const arr = new Float32Array(this._buffer, this.byteOffset + this.position, length);
        DataStream2.arrayToNative(arr, endianness ?? this.endianness);
        this.position += length * 4;
        return arr;
      }
    };
    start = /* @__PURE__ */ new Date();
    LOG_LEVEL_ERROR = 4;
    LOG_LEVEL_WARNING = 3;
    LOG_LEVEL_INFO = 2;
    LOG_LEVEL_DEBUG = 1;
    log_level = LOG_LEVEL_ERROR;
    Log = {
      setLogLevel(level) {
        if (level === this.debug) log_level = LOG_LEVEL_DEBUG;
        else if (level === this.info) log_level = LOG_LEVEL_INFO;
        else if (level === this.warn) log_level = LOG_LEVEL_WARNING;
        else if (level === this.error) log_level = LOG_LEVEL_ERROR;
        else log_level = LOG_LEVEL_ERROR;
      },
      debug(module, msg) {
        if (console.debug === void 0) console.debug = console.log;
        if (LOG_LEVEL_DEBUG >= log_level) console.debug("[" + Log.getDurationString((/* @__PURE__ */ new Date()).getTime() - start.getTime(), 1e3) + "]", "[" + module + "]", msg);
      },
      log(module, _msg) {
        this.debug(module.msg);
      },
      info(module, msg) {
        if (LOG_LEVEL_INFO >= log_level) console.info("[" + Log.getDurationString((/* @__PURE__ */ new Date()).getTime() - start.getTime(), 1e3) + "]", "[" + module + "]", msg);
      },
      warn(module, msg) {
        if (LOG_LEVEL_WARNING >= log_level) console.warn("[" + Log.getDurationString((/* @__PURE__ */ new Date()).getTime() - start.getTime(), 1e3) + "]", "[" + module + "]", msg);
      },
      error(module, msg, isofile) {
        if (isofile?.onError) isofile.onError(module, msg);
        else if (LOG_LEVEL_ERROR >= log_level) console.error("[" + Log.getDurationString((/* @__PURE__ */ new Date()).getTime() - start.getTime(), 1e3) + "]", "[" + module + "]", msg);
      },
      getDurationString(duration, _timescale) {
        let neg;
        function pad(number, length) {
          const a = ("" + number).split(".");
          while (a[0].length < length) a[0] = "0" + a[0];
          return a.join(".");
        }
        if (duration < 0) {
          neg = true;
          duration = -duration;
        } else neg = false;
        let duration_sec = duration / (_timescale || 1);
        const hours = Math.floor(duration_sec / 3600);
        duration_sec -= hours * 3600;
        const minutes = Math.floor(duration_sec / 60);
        duration_sec -= minutes * 60;
        let msec = duration_sec * 1e3;
        duration_sec = Math.floor(duration_sec);
        msec -= duration_sec * 1e3;
        msec = Math.floor(msec);
        return (neg ? "-" : "") + hours + ":" + pad(minutes, 2) + ":" + pad(duration_sec, 2) + "." + pad(msec, 3);
      },
      printRanges(ranges) {
        const length = ranges.length;
        if (length > 0) {
          let str = "";
          for (let i = 0; i < length; i++) {
            if (i > 0) str += ",";
            str += "[" + Log.getDurationString(ranges.start(i)) + "," + Log.getDurationString(ranges.end(i)) + "]";
          }
          return str;
        } else return "(empty)";
      }
    };
    MultiBufferStream = class extends DataStream {
      constructor(buffer) {
        super(/* @__PURE__ */ new ArrayBuffer(), 0);
        this.buffers = [];
        this.bufferIndex = -1;
        if (buffer) {
          this.insertBuffer(buffer);
          this.bufferIndex = 0;
        }
      }
      /***********************************************************************************
      *                     Methods for the managnement of the buffers                  *
      *                     (insertion, removal, concatenation, ...)                    *
      ***********************************************************************************/
      initialized() {
        if (this.bufferIndex > -1) return true;
        else if (this.buffers.length > 0) {
          const firstBuffer = this.buffers[0];
          if (firstBuffer.fileStart === 0) {
            this.buffer = firstBuffer;
            this.bufferIndex = 0;
            Log.debug("MultiBufferStream", "Stream ready for parsing");
            return true;
          } else {
            Log.warn("MultiBufferStream", "The first buffer should have a fileStart of 0");
            this.logBufferLevel();
            return false;
          }
        } else {
          Log.warn("MultiBufferStream", "No buffer to start parsing from");
          this.logBufferLevel();
          return false;
        }
      }
      /**
      * Reduces the size of a given buffer, but taking the part between offset and offset+newlength
      * @param  {ArrayBuffer} buffer
      * @param  {Number}      offset    the start of new buffer
      * @param  {Number}      newLength the length of the new buffer
      * @return {ArrayBuffer}           the new buffer
      */
      reduceBuffer(buffer, offset, newLength) {
        const smallB = new Uint8Array(newLength);
        smallB.set(new Uint8Array(buffer, offset, newLength));
        smallB.buffer.fileStart = buffer.fileStart + offset;
        smallB.buffer.usedBytes = 0;
        return smallB.buffer;
      }
      /**
      * Inserts the new buffer in the sorted list of buffers,
      *  making sure, it is not overlapping with existing ones (possibly reducing its size).
      *  if the new buffer overrides/replaces the 0-th buffer (for instance because it is bigger),
      *  updates the DataStream buffer for parsing
      */
      insertBuffer(ab) {
        let to_add = true;
        let i = 0;
        for (; i < this.buffers.length; i++) {
          const b = this.buffers[i];
          if (ab.fileStart <= b.fileStart) {
            if (ab.fileStart === b.fileStart) if (ab.byteLength > b.byteLength) {
              this.buffers.splice(i, 1);
              i--;
              continue;
            } else Log.warn("MultiBufferStream", "Buffer (fileStart: " + ab.fileStart + " - Length: " + ab.byteLength + ") already appended, ignoring");
            else {
              if (ab.fileStart + ab.byteLength <= b.fileStart) {
              } else ab = this.reduceBuffer(ab, 0, b.fileStart - ab.fileStart);
              Log.debug("MultiBufferStream", "Appending new buffer (fileStart: " + ab.fileStart + " - Length: " + ab.byteLength + ")");
              this.buffers.splice(i, 0, ab);
              if (i === 0) this.buffer = ab;
            }
            to_add = false;
            break;
          } else if (ab.fileStart < b.fileStart + b.byteLength) {
            const offset = b.fileStart + b.byteLength - ab.fileStart;
            const newLength = ab.byteLength - offset;
            if (newLength > 0) ab = this.reduceBuffer(ab, offset, newLength);
            else {
              to_add = false;
              break;
            }
          }
        }
        if (to_add) {
          Log.debug("MultiBufferStream", "Appending new buffer (fileStart: " + ab.fileStart + " - Length: " + ab.byteLength + ")");
          this.buffers.push(ab);
          if (i === 0) this.buffer = ab;
        }
      }
      /**
      * Displays the status of the buffers (number and used bytes)
      * @param  {Object} info callback method for display
      */
      logBufferLevel(info) {
        const ranges = [];
        let bufferedString = "";
        let range;
        let used = 0;
        let total = 0;
        for (let i = 0; i < this.buffers.length; i++) {
          const buffer = this.buffers[i];
          if (i === 0) {
            range = {
              start: buffer.fileStart,
              end: buffer.fileStart + buffer.byteLength
            };
            ranges.push(range);
            bufferedString += "[" + range.start + "-";
          } else if (range.end === buffer.fileStart) range.end = buffer.fileStart + buffer.byteLength;
          else {
            range = {
              start: buffer.fileStart,
              end: buffer.fileStart + buffer.byteLength
            };
            bufferedString += ranges[ranges.length - 1].end - 1 + "], [" + range.start + "-";
            ranges.push(range);
          }
          used += buffer.usedBytes;
          total += buffer.byteLength;
        }
        if (ranges.length > 0) bufferedString += range.end - 1 + "]";
        const log = info ? Log.info : Log.debug;
        if (this.buffers.length === 0) log("MultiBufferStream", "No more buffer in memory");
        else log("MultiBufferStream", "" + this.buffers.length + " stored buffer(s) (" + used + "/" + total + " bytes), continuous ranges: " + bufferedString);
      }
      cleanBuffers() {
        for (let i = 0; i < this.buffers.length; i++) {
          const buffer = this.buffers[i];
          if (buffer.usedBytes === buffer.byteLength) {
            Log.debug("MultiBufferStream", "Removing buffer #" + i);
            this.buffers.splice(i, 1);
            i--;
          }
        }
      }
      mergeNextBuffer() {
        if (this.bufferIndex + 1 < this.buffers.length) {
          const next_buffer = this.buffers[this.bufferIndex + 1];
          if (next_buffer.fileStart === this.buffer.fileStart + this.buffer.byteLength) {
            const oldLength = this.buffer.byteLength;
            const oldUsedBytes = this.buffer.usedBytes;
            const oldFileStart = this.buffer.fileStart;
            this.buffers[this.bufferIndex] = concatBuffers(this.buffer, next_buffer);
            this.buffer = this.buffers[this.bufferIndex];
            this.buffers.splice(this.bufferIndex + 1, 1);
            this.buffer.usedBytes = oldUsedBytes;
            this.buffer.fileStart = oldFileStart;
            Log.debug("ISOFile", "Concatenating buffer for box parsing (length: " + oldLength + "->" + this.buffer.byteLength + ")");
            return true;
          } else return false;
        } else return false;
      }
      /*************************************************************************
      *                        Seek-related functions                         *
      *************************************************************************/
      /**
      * Finds the buffer that holds the given file position
      * @param  {Boolean} fromStart    indicates if the search should start from the current buffer (false)
      *                                or from the first buffer (true)
      * @param  {Number}  filePosition position in the file to seek to
      * @param  {Boolean} markAsUsed   indicates if the bytes in between the current position and the seek position
      *                                should be marked as used for garbage collection
      * @return {Number}               the index of the buffer holding the seeked file position, -1 if not found.
      */
      findPosition(fromStart, filePosition, markAsUsed) {
        let index = -1;
        let i = fromStart === true ? 0 : this.bufferIndex;
        while (i < this.buffers.length) {
          const abuffer2 = this.buffers[i];
          if (abuffer2 && abuffer2.fileStart <= filePosition) {
            index = i;
            if (markAsUsed) {
              if (abuffer2.fileStart + abuffer2.byteLength <= filePosition) abuffer2.usedBytes = abuffer2.byteLength;
              else abuffer2.usedBytes = filePosition - abuffer2.fileStart;
              this.logBufferLevel();
            }
          } else break;
          i++;
        }
        if (index === -1) return -1;
        const abuffer = this.buffers[index];
        if (abuffer.fileStart + abuffer.byteLength >= filePosition) {
          Log.debug("MultiBufferStream", "Found position in existing buffer #" + index);
          return index;
        } else return -1;
      }
      /**
      * Finds the largest file position contained in a buffer or in the next buffers if they are contiguous (no gap)
      * starting from the given buffer index or from the current buffer if the index is not given
      *
      * @param  {Number} inputindex Index of the buffer to start from
      * @return {Number}            The largest file position found in the buffers
      */
      findEndContiguousBuf(inputindex) {
        const index = inputindex !== void 0 ? inputindex : this.bufferIndex;
        let currentBuf = this.buffers[index];
        if (this.buffers.length > index + 1) for (let i = index + 1; i < this.buffers.length; i++) {
          const nextBuf = this.buffers[i];
          if (nextBuf.fileStart === currentBuf.fileStart + currentBuf.byteLength) currentBuf = nextBuf;
          else break;
        }
        return currentBuf.fileStart + currentBuf.byteLength;
      }
      /**
      * Returns the largest file position contained in the buffers, larger than the given position
      * @param  {Number} pos the file position to start from
      * @return {Number}     the largest position in the current buffer or in the buffer and the next contiguous
      *                      buffer that holds the given position
      */
      getEndFilePositionAfter(pos) {
        const index = this.findPosition(true, pos, false);
        if (index !== -1) return this.findEndContiguousBuf(index);
        else return pos;
      }
      /*************************************************************************
      *                  Garbage collection related functions                 *
      *************************************************************************/
      /**
      * Marks a given number of bytes as used in the current buffer for garbage collection
      * @param {Number} nbBytes
      */
      addUsedBytes(nbBytes) {
        this.buffer.usedBytes += nbBytes;
        this.logBufferLevel();
      }
      /**
      * Marks the entire current buffer as used, ready for garbage collection
      */
      setAllUsedBytes() {
        this.buffer.usedBytes = this.buffer.byteLength;
        this.logBufferLevel();
      }
      /*************************************************************************
      *          Common API between MultiBufferStream and SimpleStream        *
      *************************************************************************/
      /**
      * Tries to seek to a given file position
      * if possible, repositions the parsing from there and returns true
      * if not possible, does not change anything and returns false
      * @param  {Number}  filePosition position in the file to seek to
      * @param  {Boolean} fromStart    indicates if the search should start from the current buffer (false)
      *                                or from the first buffer (true)
      * @param  {Boolean} markAsUsed   indicates if the bytes in between the current position and the seek position
      *                                should be marked as used for garbage collection
      * @return {Boolean}              true if the seek succeeded, false otherwise
      */
      seek(filePosition, fromStart, markAsUsed) {
        const index = this.findPosition(fromStart, filePosition, markAsUsed);
        if (index !== -1) {
          this.buffer = this.buffers[index];
          this.bufferIndex = index;
          this.position = filePosition - this.buffer.fileStart;
          Log.debug("MultiBufferStream", "Repositioning parser at buffer position: " + this.position);
          return true;
        } else {
          Log.debug("MultiBufferStream", "Position " + filePosition + " not found in buffered data");
          return false;
        }
      }
      /**
      * Returns the current position in the file
      * @return {Number} the position in the file
      */
      getPosition() {
        if (this.bufferIndex === -1 || this.buffers[this.bufferIndex] === void 0) return 0;
        return this.buffers[this.bufferIndex].fileStart + this.position;
      }
      /**
      * Returns the length of the current buffer
      * @return {Number} the length of the current buffer
      */
      getLength() {
        return this.byteLength;
      }
      getEndPosition() {
        if (this.bufferIndex === -1 || this.buffers[this.bufferIndex] === void 0) return 0;
        return this.buffers[this.bufferIndex].fileStart + this.byteLength;
      }
      getAbsoluteEndPosition() {
        if (this.buffers.length === 0) return 0;
        const lastBuffer = this.buffers[this.buffers.length - 1];
        return lastBuffer.fileStart + lastBuffer.byteLength;
      }
    };
    Box = class {
      static {
        this.registryId = /* @__PURE__ */ Symbol.for("BoxIdentifier");
      }
      #type;
      get type() {
        return this.constructor.fourcc ?? this.#type;
      }
      set type(value) {
        this.#type = value;
      }
      constructor(size = 0) {
        this.size = size;
      }
      addBox(box) {
        if (!this.boxes) this.boxes = [];
        this.boxes.push(box);
        if (this[box.type + "s"]) this[box.type + "s"].push(box);
        else this[box.type] = box;
        return box;
      }
      set(prop, value) {
        this[prop] = value;
        return this;
      }
      addEntry(value, _prop) {
        const prop = _prop || "entries";
        if (!this[prop]) this[prop] = [];
        this[prop].push(value);
        return this;
      }
      /** @bundle box-write.js */
      writeHeader(stream, msg) {
        this.size += 8;
        if (this.size > MAX_UINT32 || this.original_size === 1) this.size += 8;
        if (this.type === "uuid") this.size += 16;
        Log.debug("BoxWriter", "Writing box " + this.type + " of size: " + this.size + " at position " + stream.getPosition() + (msg || ""));
        if (this.original_size === 0) stream.writeUint32(0);
        else if (this.size > MAX_UINT32 || this.original_size === 1) stream.writeUint32(1);
        else {
          this.sizePosition = stream.getPosition();
          stream.writeUint32(this.size);
        }
        stream.writeString(this.type, void 0, 4);
        if (this.type === "uuid") {
          const uuidBytes = /* @__PURE__ */ new Uint8Array(16);
          for (let i = 0; i < 16; i++) uuidBytes[i] = parseInt(this.uuid.substring(i * 2, i * 2 + 2), 16);
          stream.writeUint8Array(uuidBytes);
        }
        if (this.size > MAX_UINT32 || this.original_size === 1) {
          this.sizePosition = stream.getPosition();
          stream.writeUint64(this.size);
        }
      }
      /** @bundle box-write.js */
      write(stream) {
        if (this.type === "mdat") {
          const box = this;
          if (box.stream) {
            this.size = box.stream.getAbsoluteEndPosition();
            this.writeHeader(stream);
            for (const buffer of box.stream.buffers) {
              const u8 = new Uint8Array(buffer);
              stream.writeUint8Array(u8);
            }
          } else if (box.data) {
            this.size = box.data.length;
            this.writeHeader(stream);
            stream.writeUint8Array(box.data);
          }
        } else {
          this.size = this.data ? this.data.length : 0;
          this.writeHeader(stream);
          if (this.data) stream.writeUint8Array(this.data);
        }
      }
      /** @bundle box-print.js */
      printHeader(output) {
        this.size += 8;
        if (this.size > MAX_UINT32) this.size += 8;
        if (this.type === "uuid") this.size += 16;
        output.log(output.indent + "size:" + this.size);
        output.log(output.indent + "type:" + this.type);
      }
      /** @bundle box-print.js */
      print(output) {
        this.printHeader(output);
      }
      /** @bundle box-parse.js */
      parse(stream) {
        if (this.type !== "mdat") this.data = stream.readUint8Array(this.size - this.hdr_size);
        else if (this.size === 0) stream.seek(stream.getEndPosition());
        else stream.seek(this.start + this.size);
      }
      /** @bundle box-parse.js */
      parseDataAndRewind(stream) {
        this.data = stream.readUint8Array(this.size - this.hdr_size);
        stream.seek(this.start + this.hdr_size);
      }
      /** @bundle box-parse.js */
      parseLanguage(stream) {
        this.language = stream.readUint16();
        const chars = [];
        chars[0] = this.language >> 10 & 31;
        chars[1] = this.language >> 5 & 31;
        chars[2] = this.language & 31;
        this.languageString = String.fromCharCode(chars[0] + 96, chars[1] + 96, chars[2] + 96);
      }
      /** @bundle isofile-advanced-creation.js */
      computeSize(stream_) {
        const stream = stream_ || new MultiBufferStream();
        this.write(stream);
      }
      isEndOfBox(stream) {
        return stream.getPosition() === this.start + this.size;
      }
    };
    FullBox = class extends Box {
      constructor(..._args) {
        super(..._args);
        this.flags = 0;
        this.version = 0;
      }
      /** @bundle box-write.js */
      writeHeader(stream) {
        this.size += 4;
        super.writeHeader(stream, " v=" + this.version + " f=" + this.flags);
        stream.writeUint8(this.version);
        stream.writeUint24(this.flags);
      }
      /** @bundle box-print.js */
      printHeader(output) {
        this.size += 4;
        super.printHeader(output);
        output.log(output.indent + "version:" + this.version);
        output.log(output.indent + "flags:" + this.flags);
      }
      /** @bundle box-parse.js */
      parseDataAndRewind(stream) {
        this.parseFullHeader(stream);
        this.data = stream.readUint8Array(this.size - this.hdr_size);
        this.hdr_size -= 4;
        stream.seek(this.start + this.hdr_size);
      }
      /** @bundle box-parse.js */
      parseFullHeader(stream) {
        this.version = stream.readUint8();
        this.flags = stream.readUint24();
        this.hdr_size += 4;
      }
      /** @bundle box-parse.js */
      parse(stream) {
        this.parseFullHeader(stream);
        this.data = stream.readUint8Array(this.size - this.hdr_size);
      }
    };
    SampleGroupEntry = class {
      static {
        this.registryId = /* @__PURE__ */ Symbol.for("SampleGroupEntryIdentifier");
      }
      constructor(grouping_type) {
        this.grouping_type = grouping_type;
      }
      /** @bundle writing/samplegroups/samplegroup.js */
      write(stream) {
        stream.writeUint8Array(this.data);
      }
      /** @bundle parsing/samplegroups/samplegroup.js */
      parse(stream) {
        Log.warn("BoxParser", `Unknown sample group type: '${this.grouping_type}'`);
        this.data = stream.readUint8Array(this.description_length);
      }
    };
    TrackGroupTypeBox = class extends FullBox {
      /** @bundle parsing/TrackGroup.js */
      parse(stream) {
        this.parseFullHeader(stream);
        this.track_group_id = stream.readUint32();
      }
    };
    SingleItemTypeReferenceBox = class extends Box {
      constructor(fourcc, size, box_name, hdr_size, start2) {
        super(size);
        this.box_name = box_name;
        this.hdr_size = hdr_size;
        this.start = start2;
        this.type = fourcc;
      }
      parse(stream) {
        this.from_item_ID = stream.readUint16();
        const count = stream.readUint16();
        this.references = [];
        for (let i = 0; i < count; i++) this.references[i] = { to_item_ID: stream.readUint16() };
      }
    };
    SingleItemTypeReferenceBoxLarge = class extends Box {
      constructor(fourcc, size, box_name, hdr_size, start2) {
        super(size);
        this.box_name = box_name;
        this.hdr_size = hdr_size;
        this.start = start2;
        this.type = fourcc;
      }
      parse(stream) {
        this.from_item_ID = stream.readUint32();
        const count = stream.readUint16();
        this.references = [];
        for (let i = 0; i < count; i++) this.references[i] = { to_item_ID: stream.readUint32() };
      }
    };
    TrackReferenceTypeBox = class extends Box {
      constructor(fourcc, size, hdr_size, start2) {
        super(size);
        this.hdr_size = hdr_size;
        this.start = start2;
        this.type = fourcc;
      }
      parse(stream) {
        this.track_ids = stream.readUint32Array((this.size - this.hdr_size) / 4);
      }
      /** @bundle box-write.js */
      write(stream) {
        this.size = this.track_ids.length * 4;
        this.writeHeader(stream);
        stream.writeUint32Array(this.track_ids);
      }
    };
    DIFF_BOXES_PROP_NAMES = [
      "boxes",
      "entries",
      "references",
      "subsamples",
      "items",
      "item_infos",
      "extents",
      "associations",
      "subsegments",
      "ranges",
      "seekLists",
      "seekPoints",
      "esd",
      "levels"
    ];
    DIFF_PRIMITIVE_ARRAY_PROP_NAMES = [
      "compatible_brands",
      "matrix",
      "opcolor",
      "sample_counts",
      "sample_deltas",
      "first_chunk",
      "samples_per_chunk",
      "sample_sizes",
      "chunk_offsets",
      "sample_offsets",
      "sample_description_index",
      "sample_duration"
    ];
    isSampleGroupEntry = (value) => {
      const symbol = /* @__PURE__ */ Symbol.for("SampleGroupEntryIdentifier");
      return getRegistryId(value) === symbol;
    };
    isSampleEntry = (value) => {
      const symbol = /* @__PURE__ */ Symbol.for("SampleEntryIdentifier");
      return getRegistryId(value) === symbol;
    };
    isBox = (value) => {
      const symbol = /* @__PURE__ */ Symbol.for("BoxIdentifier");
      return getRegistryId(value) === symbol;
    };
    BoxRegistry = {
      uuid: {},
      sampleEntry: {},
      sampleGroupEntry: {},
      box: {}
    };
    DescriptorRegistry = {};
    ContainerBox = class extends Box {
      /** @bundle box-write.js */
      write(stream) {
        this.size = 0;
        this.writeHeader(stream);
        if (this.boxes) {
          for (let i = 0; i < this.boxes.length; i++) if (this.boxes[i]) {
            this.boxes[i].write(stream);
            this.size += this.boxes[i].size;
          }
        }
        Log.debug("BoxWriter", "Adjusting box " + this.type + " with new size " + this.size);
        stream.adjustUint32(this.sizePosition, this.size);
      }
      /** @bundle box-print.js */
      print(output) {
        this.printHeader(output);
        for (let i = 0; i < this.boxes.length; i++) if (this.boxes[i]) {
          const prev_indent = output.indent;
          output.indent += " ";
          this.boxes[i].print(output);
          output.indent = prev_indent;
        }
      }
      /** @bundle box-parse.js */
      parse(stream) {
        let ret;
        while (stream.getPosition() < this.start + this.size) {
          ret = parseOneBox(stream, false, this.size - (stream.getPosition() - this.start));
          if (ret.code === 1) {
            const box = ret.box;
            if (!this.boxes) this.boxes = [];
            this.boxes.push(box);
            if (this.subBoxNames && this.subBoxNames.indexOf(box.type) !== -1) {
              const fourcc = this.subBoxNames[this.subBoxNames.indexOf(box.type)] + "s";
              if (!this[fourcc]) this[fourcc] = [];
              this[fourcc].push(box);
            } else {
              const box_type = box.type !== "uuid" ? box.type : box.uuid;
              if (this[box_type]) Log.warn("ContainerBox", `Box of type ${box_type} already exists in container box ${this.type}.`);
              else this[box_type] = box;
            }
          } else return;
        }
      }
    };
    SampleEntry = class extends ContainerBox {
      static {
        this.registryId = /* @__PURE__ */ Symbol.for("SampleEntryIdentifier");
      }
      constructor(size, hdr_size, start2) {
        super(size);
        this.hdr_size = hdr_size;
        this.start = start2;
      }
      /** @bundle box-codecs.js */
      isVideo() {
        return false;
      }
      /** @bundle box-codecs.js */
      isAudio() {
        return false;
      }
      /** @bundle box-codecs.js */
      isSubtitle() {
        return false;
      }
      /** @bundle box-codecs.js */
      isMetadata() {
        return false;
      }
      /** @bundle box-codecs.js */
      isHint() {
        return false;
      }
      /** @bundle box-codecs.js */
      getCodec() {
        return this.type.replace(".", "");
      }
      /** @bundle box-codecs.js */
      getWidth() {
        return "";
      }
      /** @bundle box-codecs.js */
      getHeight() {
        return "";
      }
      /** @bundle box-codecs.js */
      getChannelCount() {
        return "";
      }
      /** @bundle box-codecs.js */
      getSampleRate() {
        return "";
      }
      /** @bundle box-codecs.js */
      getSampleSize() {
        return "";
      }
      /** @bundle parsing/sampleentries/sampleentry.js */
      parseHeader(stream) {
        stream.readUint8Array(6);
        this.data_reference_index = stream.readUint16();
        this.hdr_size += 8;
      }
      /** @bundle parsing/sampleentries/sampleentry.js */
      parse(stream) {
        this.parseHeader(stream);
        this.data = stream.readUint8Array(this.size - this.hdr_size);
      }
      /** @bundle parsing/sampleentries/sampleentry.js */
      parseDataAndRewind(stream) {
        this.parseHeader(stream);
        this.data = stream.readUint8Array(this.size - this.hdr_size);
        this.hdr_size -= 8;
        stream.seek(this.start + this.hdr_size);
      }
      /** @bundle parsing/sampleentries/sampleentry.js */
      parseFooter(stream) {
        super.parse(stream);
      }
      /** @bundle writing/sampleentry.js */
      writeHeader(stream) {
        this.size = 8;
        super.writeHeader(stream);
        stream.writeUint8(0);
        stream.writeUint8(0);
        stream.writeUint8(0);
        stream.writeUint8(0);
        stream.writeUint8(0);
        stream.writeUint8(0);
        stream.writeUint16(this.data_reference_index);
      }
      /** @bundle writing/sampleentry.js */
      writeFooter(stream) {
        if (this.boxes) for (let i = 0; i < this.boxes.length; i++) {
          this.boxes[i].write(stream);
          this.size += this.boxes[i].size;
        }
        Log.debug("BoxWriter", "Adjusting box " + this.type + " with new size " + this.size);
        stream.adjustUint32(this.sizePosition, this.size);
      }
      /** @bundle writing/sampleentry.js */
      write(stream) {
        this.writeHeader(stream);
        stream.writeUint8Array(this.data);
        this.size += this.data.length;
        Log.debug("BoxWriter", "Adjusting box " + this.type + " with new size " + this.size);
        stream.adjustUint32(this.sizePosition, this.size);
      }
    };
    HintSampleEntry = class extends SampleEntry {
    };
    MetadataSampleEntry = class extends SampleEntry {
      /** @bundle box-codecs.js */
      isMetadata() {
        return true;
      }
    };
    SubtitleSampleEntry = class extends SampleEntry {
      /** @bundle box-codecs.js */
      isSubtitle() {
        return true;
      }
    };
    TextSampleEntry = class extends SampleEntry {
    };
    VisualSampleEntry = class extends SampleEntry {
      parse(stream) {
        this.parseHeader(stream);
        stream.readUint16();
        stream.readUint16();
        stream.readUint32Array(3);
        this.width = stream.readUint16();
        this.height = stream.readUint16();
        this.horizresolution = stream.readUint32();
        this.vertresolution = stream.readUint32();
        stream.readUint32();
        this.frame_count = stream.readUint16();
        const compressorname_length = Math.min(31, stream.readUint8());
        this.compressorname = stream.readString(compressorname_length);
        if (compressorname_length < 31) stream.readString(31 - compressorname_length);
        this.depth = stream.readUint16();
        stream.readUint16();
        this.parseFooter(stream);
      }
      /** @bundle box-codecs.js */
      isVideo() {
        return true;
      }
      /** @bundle box-codecs.js */
      getWidth() {
        return this.width;
      }
      /** @bundle box-codecs.js */
      getHeight() {
        return this.height;
      }
      /** @bundle writing/sampleentries/sampleentry.js */
      write(stream) {
        this.writeHeader(stream);
        this.size += 70;
        stream.writeUint16(0);
        stream.writeUint16(0);
        stream.writeUint32(0);
        stream.writeUint32(0);
        stream.writeUint32(0);
        stream.writeUint16(this.width);
        stream.writeUint16(this.height);
        stream.writeUint32(this.horizresolution);
        stream.writeUint32(this.vertresolution);
        stream.writeUint32(0);
        stream.writeUint16(this.frame_count);
        stream.writeUint8(Math.min(31, this.compressorname.length));
        stream.writeString(this.compressorname, void 0, 31);
        stream.writeUint16(this.depth);
        stream.writeInt16(-1);
        this.writeFooter(stream);
      }
    };
    AudioSampleEntry = class extends SampleEntry {
      parse(stream) {
        this.parseHeader(stream);
        this.version = stream.readUint16();
        stream.readUint16();
        stream.readUint32();
        this.channel_count = stream.readUint16();
        this.samplesize = stream.readUint16();
        stream.readUint16();
        stream.readUint16();
        this.samplerate = stream.readUint32() / 65536;
        if (stream.isofile?.ftyp?.major_brand.includes("qt")) {
          if (this.version === 1) this.extensions = stream.readUint8Array(16);
          else if (this.version === 2) this.extensions = stream.readUint8Array(36);
        }
        this.parseFooter(stream);
      }
      /** @bundle box-codecs.js */
      isAudio() {
        return true;
      }
      /** @bundle box-codecs.js */
      getChannelCount() {
        return this.channel_count;
      }
      /** @bundle box-codecs.js */
      getSampleRate() {
        return this.samplerate;
      }
      /** @bundle box-codecs.js */
      getSampleSize() {
        return this.samplesize;
      }
      /** @bundle writing/sampleentry.js */
      write(stream) {
        this.writeHeader(stream);
        this.size += 20;
        stream.writeUint32(0);
        stream.writeUint32(0);
        stream.writeUint16(this.channel_count);
        stream.writeUint16(this.samplesize);
        stream.writeUint16(0);
        stream.writeUint16(0);
        stream.writeUint32(this.samplerate << 16);
        this.writeFooter(stream);
      }
    };
    SystemSampleEntry = class extends SampleEntry {
      parse(stream) {
        this.parseHeader(stream);
        this.parseFooter(stream);
      }
      /** @bundle writing/sampleentry.js */
      write(stream) {
        this.writeHeader(stream);
        this.writeFooter(stream);
      }
    };
    ParameterSetArray = class extends Array {
      toString() {
        let str = "<table class='inner-table'>";
        str += "<thead><tr><th>length</th><th>nalu_data</th></tr></thead>";
        str += "<tbody>";
        for (let i = 0; i < this.length; i++) {
          const nalu = this[i];
          str += "<tr>";
          str += "<td>" + nalu.length + "</td>";
          str += "<td>";
          str += nalu.data.reduce(function(str2, byte) {
            return str2 + byte.toString(16).padStart(2, "0");
          }, "0x");
          str += "</td></tr>";
        }
        str += "</tbody></table>";
        return str;
      }
    };
    avcCBox = class extends Box {
      constructor(..._args) {
        super(..._args);
        this.box_name = "AVCConfigurationBox";
      }
      static {
        this.fourcc = "avcC";
      }
      parse(stream) {
        this.configurationVersion = stream.readUint8();
        this.AVCProfileIndication = stream.readUint8();
        this.profile_compatibility = stream.readUint8();
        this.AVCLevelIndication = stream.readUint8();
        this.lengthSizeMinusOne = stream.readUint8() & 3;
        this.nb_SPS_nalus = stream.readUint8() & 31;
        let toparse = this.size - this.hdr_size - 6;
        this.SPS = new ParameterSetArray();
        for (let i = 0; i < this.nb_SPS_nalus; i++) {
          const length = stream.readUint16();
          this.SPS.push({
            length,
            data: stream.readUint8Array(length)
          });
          toparse -= 2 + length;
        }
        this.nb_PPS_nalus = stream.readUint8();
        toparse--;
        this.PPS = new ParameterSetArray();
        for (let i = 0; i < this.nb_PPS_nalus; i++) {
          const length = stream.readUint16();
          this.PPS.push({
            length,
            data: stream.readUint8Array(length)
          });
          toparse -= 2 + length;
        }
        if (toparse > 0) this.ext = stream.readUint8Array(toparse);
      }
      /** @bundle writing/avcC.js */
      write(stream) {
        this.size = 7;
        for (let i = 0; i < this.SPS.length; i++) this.size += 2 + this.SPS[i].length;
        for (let i = 0; i < this.PPS.length; i++) this.size += 2 + this.PPS[i].length;
        if (this.ext) this.size += this.ext.length;
        this.writeHeader(stream);
        stream.writeUint8(this.configurationVersion);
        stream.writeUint8(this.AVCProfileIndication);
        stream.writeUint8(this.profile_compatibility);
        stream.writeUint8(this.AVCLevelIndication);
        stream.writeUint8(this.lengthSizeMinusOne + 252);
        stream.writeUint8(this.SPS.length + 224);
        for (let i = 0; i < this.SPS.length; i++) {
          stream.writeUint16(this.SPS[i].length);
          stream.writeUint8Array(this.SPS[i].data);
        }
        stream.writeUint8(this.PPS.length);
        for (let i = 0; i < this.PPS.length; i++) {
          stream.writeUint16(this.PPS[i].length);
          stream.writeUint8Array(this.PPS[i].data);
        }
        if (this.ext) stream.writeUint8Array(this.ext);
      }
    };
    mdatBox = class extends Box {
      constructor(..._args) {
        super(..._args);
        this.box_name = "MediaDataBox";
      }
      static {
        this.fourcc = "mdat";
      }
    };
    idatBox = class extends Box {
      constructor(..._args2) {
        super(..._args2);
        this.box_name = "ItemDataBox";
      }
      static {
        this.fourcc = "idat";
      }
    };
    freeBox = class extends Box {
      constructor(..._args3) {
        super(..._args3);
        this.box_name = "FreeSpaceBox";
      }
      static {
        this.fourcc = "free";
      }
    };
    skipBox = class extends Box {
      constructor(..._args4) {
        super(..._args4);
        this.box_name = "FreeSpaceBox";
      }
      static {
        this.fourcc = "skip";
      }
    };
    hmhdBox = class extends FullBox {
      constructor(..._args5) {
        super(..._args5);
        this.box_name = "HintMediaHeaderBox";
      }
      static {
        this.fourcc = "hmhd";
      }
    };
    nmhdBox = class extends FullBox {
      constructor(..._args6) {
        super(..._args6);
        this.box_name = "NullMediaHeaderBox";
      }
      static {
        this.fourcc = "nmhd";
      }
    };
    iodsBox = class extends FullBox {
      constructor(..._args7) {
        super(..._args7);
        this.box_name = "ObjectDescriptorBox";
      }
      static {
        this.fourcc = "iods";
      }
    };
    xmlBox = class extends FullBox {
      constructor(..._args8) {
        super(..._args8);
        this.box_name = "XMLBox";
      }
      static {
        this.fourcc = "xml ";
      }
    };
    bxmlBox = class extends FullBox {
      constructor(..._args9) {
        super(..._args9);
        this.box_name = "BinaryXMLBox";
      }
      static {
        this.fourcc = "bxml";
      }
    };
    iproBox = class extends FullBox {
      constructor(..._args10) {
        super(..._args10);
        this.box_name = "ItemProtectionBox";
        this.sinfs = [];
      }
      static {
        this.fourcc = "ipro";
      }
      get protections() {
        return this.sinfs;
      }
    };
    moovBox = class extends ContainerBox {
      constructor(..._args11) {
        super(..._args11);
        this.box_name = "MovieBox";
        this.traks = [];
        this.psshs = [];
        this.subBoxNames = ["trak", "pssh"];
      }
      static {
        this.fourcc = "moov";
      }
    };
    trakBox = class extends ContainerBox {
      constructor(..._args12) {
        super(..._args12);
        this.box_name = "TrackBox";
        this.samples = [];
      }
      static {
        this.fourcc = "trak";
      }
    };
    edtsBox = class extends ContainerBox {
      constructor(..._args13) {
        super(..._args13);
        this.box_name = "EditBox";
      }
      static {
        this.fourcc = "edts";
      }
    };
    mdiaBox = class extends ContainerBox {
      constructor(..._args14) {
        super(..._args14);
        this.box_name = "MediaBox";
      }
      static {
        this.fourcc = "mdia";
      }
    };
    minfBox = class extends ContainerBox {
      constructor(..._args15) {
        super(..._args15);
        this.box_name = "MediaInformationBox";
      }
      static {
        this.fourcc = "minf";
      }
    };
    dinfBox = class extends ContainerBox {
      constructor(..._args16) {
        super(..._args16);
        this.box_name = "DataInformationBox";
      }
      static {
        this.fourcc = "dinf";
      }
    };
    stblBox = class extends ContainerBox {
      constructor(..._args17) {
        super(..._args17);
        this.box_name = "SampleTableBox";
        this.sgpds = [];
        this.sbgps = [];
        this.subBoxNames = ["sgpd", "sbgp"];
      }
      static {
        this.fourcc = "stbl";
      }
    };
    mvexBox = class extends ContainerBox {
      constructor(..._args18) {
        super(..._args18);
        this.box_name = "MovieExtendsBox";
        this.trexs = [];
        this.subBoxNames = ["trex"];
      }
      static {
        this.fourcc = "mvex";
      }
    };
    moofBox = class extends ContainerBox {
      constructor(..._args19) {
        super(..._args19);
        this.box_name = "MovieFragmentBox";
        this.trafs = [];
        this.subBoxNames = ["traf"];
      }
      static {
        this.fourcc = "moof";
      }
    };
    trafBox = class extends ContainerBox {
      constructor(..._args20) {
        super(..._args20);
        this.box_name = "TrackFragmentBox";
        this.truns = [];
        this.sgpds = [];
        this.sbgps = [];
        this.subBoxNames = [
          "trun",
          "sgpd",
          "sbgp"
        ];
      }
      static {
        this.fourcc = "traf";
      }
    };
    vttcBox = class extends ContainerBox {
      constructor(..._args21) {
        super(..._args21);
        this.box_name = "VTTCueBox";
      }
      static {
        this.fourcc = "vttc";
      }
    };
    mfraBox = class extends ContainerBox {
      constructor(..._args22) {
        super(..._args22);
        this.box_name = "MovieFragmentRandomAccessBox";
        this.tfras = [];
        this.subBoxNames = ["tfra"];
      }
      static {
        this.fourcc = "mfra";
      }
    };
    mecoBox = class extends ContainerBox {
      constructor(..._args23) {
        super(..._args23);
        this.box_name = "AdditionalMetadataContainerBox";
      }
      static {
        this.fourcc = "meco";
      }
    };
    hntiBox = class extends ContainerBox {
      constructor(..._args24) {
        super(..._args24);
        this.box_name = "trackhintinformation";
        this.subBoxNames = ["sdp ", "rtp "];
      }
      static {
        this.fourcc = "hnti";
      }
    };
    hinfBox = class extends ContainerBox {
      constructor(..._args25) {
        super(..._args25);
        this.box_name = "hintstatisticsbox";
        this.maxrs = [];
        this.subBoxNames = ["maxr"];
      }
      static {
        this.fourcc = "hinf";
      }
    };
    strkBox = class extends ContainerBox {
      constructor(..._args26) {
        super(..._args26);
        this.box_name = "SubTrackBox";
      }
      static {
        this.fourcc = "strk";
      }
    };
    strdBox = class extends ContainerBox {
      constructor(..._args27) {
        super(..._args27);
        this.box_name = "SubTrackDefinitionBox";
      }
      static {
        this.fourcc = "strd";
      }
    };
    sinfBox = class extends ContainerBox {
      constructor(..._args28) {
        super(..._args28);
        this.box_name = "ProtectionSchemeInfoBox";
      }
      static {
        this.fourcc = "sinf";
      }
    };
    rinfBox = class extends ContainerBox {
      constructor(..._args29) {
        super(..._args29);
        this.box_name = "RestrictedSchemeInfoBox";
      }
      static {
        this.fourcc = "rinf";
      }
    };
    schiBox = class extends ContainerBox {
      constructor(..._args30) {
        super(..._args30);
        this.box_name = "SchemeInformationBox";
      }
      static {
        this.fourcc = "schi";
      }
    };
    trgrBox = class extends ContainerBox {
      constructor(..._args31) {
        super(..._args31);
        this.box_name = "TrackGroupBox";
      }
      static {
        this.fourcc = "trgr";
      }
    };
    udtaBox = class extends ContainerBox {
      constructor(..._args32) {
        super(..._args32);
        this.box_name = "UserDataBox";
        this.kinds = [];
        this.strks = [];
        this.subBoxNames = ["kind", "strk"];
      }
      static {
        this.fourcc = "udta";
      }
    };
    iprpBox = class extends ContainerBox {
      constructor(..._args33) {
        super(..._args33);
        this.box_name = "ItemPropertiesBox";
        this.ipmas = [];
        this.subBoxNames = ["ipma"];
      }
      static {
        this.fourcc = "iprp";
      }
    };
    ipcoBox = class extends ContainerBox {
      constructor(..._args34) {
        super(..._args34);
        this.box_name = "ItemPropertyContainerBox";
        this.hvcCs = [];
        this.ispes = [];
        this.claps = [];
        this.irots = [];
        this.subBoxNames = [
          "hvcC",
          "ispe",
          "clap",
          "irot"
        ];
      }
      static {
        this.fourcc = "ipco";
      }
    };
    grplBox = class extends ContainerBox {
      constructor(..._args35) {
        super(..._args35);
        this.box_name = "GroupsListBox";
      }
      static {
        this.fourcc = "grpl";
      }
    };
    j2kHBox = class extends ContainerBox {
      constructor(..._args36) {
        super(..._args36);
        this.box_name = "J2KHeaderInfoBox";
      }
      static {
        this.fourcc = "j2kH";
      }
    };
    etypBox = class extends ContainerBox {
      constructor(..._args37) {
        super(..._args37);
        this.box_name = "ExtendedTypeBox";
        this.tycos = [];
        this.subBoxNames = ["tyco"];
      }
      static {
        this.fourcc = "etyp";
      }
    };
    povdBox = class extends ContainerBox {
      constructor(..._args38) {
        super(..._args38);
        this.box_name = "ProjectedOmniVideoBox";
        this.subBoxNames = ["prfr"];
      }
      static {
        this.fourcc = "povd";
      }
    };
    drefBox = class extends FullBox {
      constructor(..._args) {
        super(..._args);
        this.box_name = "DataReferenceBox";
      }
      static {
        this.fourcc = "dref";
      }
      parse(stream) {
        this.parseFullHeader(stream);
        this.entries = [];
        const entry_count = stream.readUint32();
        for (let i = 0; i < entry_count; i++) {
          const ret = parseOneBox(stream, false, this.size - (stream.getPosition() - this.start));
          if (ret.code === 1) {
            const box = ret.box;
            this.entries.push(box);
          } else return;
        }
      }
      /** @bundle writing/dref.js */
      write(stream) {
        this.version = 0;
        this.flags = 0;
        this.size = 4;
        this.writeHeader(stream);
        stream.writeUint32(this.entries.length);
        for (let i = 0; i < this.entries.length; i++) {
          this.entries[i].write(stream);
          this.size += this.entries[i].size;
        }
        Log.debug("BoxWriter", "Adjusting box " + this.type + " with new size " + this.size);
        stream.adjustUint32(this.sizePosition, this.size);
      }
    };
    elngBox = class extends FullBox {
      constructor(..._args) {
        super(..._args);
        this.box_name = "ExtendedLanguageBox";
      }
      static {
        this.fourcc = "elng";
      }
      parse(stream) {
        this.parseFullHeader(stream);
        this.extended_language = stream.readString(this.size - this.hdr_size);
      }
      /** @bundle writing/elng.js */
      write(stream) {
        this.version = 0;
        this.flags = 0;
        this.size = this.extended_language.length;
        this.writeHeader(stream);
        stream.writeString(this.extended_language);
      }
    };
    ftypBox = class extends Box {
      constructor(..._args) {
        super(..._args);
        this.box_name = "FileTypeBox";
      }
      static {
        this.fourcc = "ftyp";
      }
      parse(stream) {
        let toparse = this.size - this.hdr_size;
        this.major_brand = stream.readString(4);
        this.minor_version = stream.readUint32();
        const minor_version_str = String.fromCharCode(this.minor_version >> 24, this.minor_version >> 16 & 255, this.minor_version >> 8 & 255, this.minor_version & 255);
        if (minor_version_str.match("[a-zA-Z0-9]{4}")) this.minor_version = minor_version_str;
        toparse -= 8;
        this.compatible_brands = [];
        let i = 0;
        while (toparse >= 4) {
          this.compatible_brands[i] = stream.readString(4);
          toparse -= 4;
          i++;
        }
      }
      /** @bundle writing/ftyp.js */
      write(stream) {
        this.size = 8 + 4 * this.compatible_brands.length;
        this.writeHeader(stream);
        stream.writeString(this.major_brand, void 0, 4);
        if (typeof this.minor_version === "number") stream.writeUint32(this.minor_version);
        else stream.writeString(this.minor_version, void 0, 4);
        for (let i = 0; i < this.compatible_brands.length; i++) stream.writeString(this.compatible_brands[i], void 0, 4);
      }
    };
    hdlrBox = class extends FullBox {
      constructor(..._args) {
        super(..._args);
        this.box_name = "HandlerBox";
      }
      static {
        this.fourcc = "hdlr";
      }
      parse(stream) {
        this.parseFullHeader(stream);
        if (this.version === 0) {
          stream.readUint32();
          this.handler = stream.readString(4);
          stream.readUint32Array(3);
          if (!this.isEndOfBox(stream)) {
            const name_size = this.start + this.size - stream.getPosition();
            this.name = stream.readCString();
            const end = this.start + this.size - 1;
            stream.seek(end);
            if (stream.readUint8() !== 0 && name_size > 1) {
              Log.info("BoxParser", "Warning: hdlr name is not null-terminated, possibly length-prefixed string. Trimming first byte.");
              this.name = this.name.slice(1);
            }
          }
        }
      }
      /** @bundle writing/hldr.js */
      write(stream) {
        this.size = 20 + this.name.length + 1;
        this.version = 0;
        this.flags = 0;
        this.writeHeader(stream);
        stream.writeUint32(0);
        stream.writeString(this.handler, void 0, 4);
        stream.writeUint32Array([
          0,
          0,
          0
        ]);
        stream.writeCString(this.name);
      }
    };
    hvcCBox = class extends Box {
      constructor(..._args) {
        super(..._args);
        this.box_name = "HEVCConfigurationBox";
      }
      static {
        this.fourcc = "hvcC";
      }
      parse(stream) {
        this.configurationVersion = stream.readUint8();
        let tmp_byte = stream.readUint8();
        this.general_profile_space = tmp_byte >> 6;
        this.general_tier_flag = (tmp_byte & 32) >> 5;
        this.general_profile_idc = tmp_byte & 31;
        this.general_profile_compatibility = stream.readUint32();
        this.general_constraint_indicator = stream.readUint8Array(6);
        this.general_level_idc = stream.readUint8();
        this.min_spatial_segmentation_idc = stream.readUint16() & 4095;
        this.parallelismType = stream.readUint8() & 3;
        this.chroma_format_idc = stream.readUint8() & 3;
        this.bit_depth_luma_minus8 = stream.readUint8() & 7;
        this.bit_depth_chroma_minus8 = stream.readUint8() & 7;
        this.avgFrameRate = stream.readUint16();
        tmp_byte = stream.readUint8();
        this.constantFrameRate = tmp_byte >> 6;
        this.numTemporalLayers = (tmp_byte & 13) >> 3;
        this.temporalIdNested = (tmp_byte & 4) >> 2;
        this.lengthSizeMinusOne = tmp_byte & 3;
        this.nalu_arrays = [];
        const numOfArrays = stream.readUint8();
        for (let i = 0; i < numOfArrays; i++) {
          const nalu_array = [];
          this.nalu_arrays.push(nalu_array);
          tmp_byte = stream.readUint8();
          nalu_array.completeness = (tmp_byte & 128) >> 7;
          nalu_array.nalu_type = tmp_byte & 63;
          const numNalus = stream.readUint16();
          for (let j = 0; j < numNalus; j++) {
            const length = stream.readUint16();
            nalu_array.push({ data: stream.readUint8Array(length) });
          }
        }
      }
      /** @bundle writing/write.js */
      write(stream) {
        this.size = 23;
        for (let i = 0; i < this.nalu_arrays.length; i++) {
          this.size += 3;
          for (let j = 0; j < this.nalu_arrays[i].length; j++) this.size += 2 + this.nalu_arrays[i][j].data.length;
        }
        this.writeHeader(stream);
        stream.writeUint8(this.configurationVersion);
        stream.writeUint8((this.general_profile_space << 6) + (this.general_tier_flag << 5) + this.general_profile_idc);
        stream.writeUint32(this.general_profile_compatibility);
        stream.writeUint8Array(this.general_constraint_indicator);
        stream.writeUint8(this.general_level_idc);
        stream.writeUint16(this.min_spatial_segmentation_idc + (15 << 24));
        stream.writeUint8(this.parallelismType + 252);
        stream.writeUint8(this.chroma_format_idc + 252);
        stream.writeUint8(this.bit_depth_luma_minus8 + 248);
        stream.writeUint8(this.bit_depth_chroma_minus8 + 248);
        stream.writeUint16(this.avgFrameRate);
        stream.writeUint8((this.constantFrameRate << 6) + (this.numTemporalLayers << 3) + (this.temporalIdNested << 2) + this.lengthSizeMinusOne);
        stream.writeUint8(this.nalu_arrays.length);
        for (let i = 0; i < this.nalu_arrays.length; i++) {
          stream.writeUint8((this.nalu_arrays[i].completeness << 7) + this.nalu_arrays[i].nalu_type);
          stream.writeUint16(this.nalu_arrays[i].length);
          for (let j = 0; j < this.nalu_arrays[i].length; j++) {
            stream.writeUint16(this.nalu_arrays[i][j].data.length);
            stream.writeUint8Array(this.nalu_arrays[i][j].data);
          }
        }
      }
    };
    mdhdBox = class extends FullBox {
      constructor(..._args) {
        super(..._args);
        this.box_name = "MediaHeaderBox";
      }
      static {
        this.fourcc = "mdhd";
      }
      parse(stream) {
        this.parseFullHeader(stream);
        if (this.version === 1) {
          this.creation_time = stream.readUint64();
          this.modification_time = stream.readUint64();
          this.timescale = stream.readUint32();
          this.duration = stream.readUint64();
        } else {
          this.creation_time = stream.readUint32();
          this.modification_time = stream.readUint32();
          this.timescale = stream.readUint32();
          this.duration = stream.readUint32();
        }
        this.parseLanguage(stream);
        stream.readUint16();
      }
      /** @bundle writing/mdhd.js */
      write(stream) {
        const useVersion1 = this.modification_time > MAX_UINT32 || this.creation_time > MAX_UINT32 || this.duration > MAX_UINT32 || this.version === 1;
        this.version = useVersion1 ? 1 : 0;
        this.size = 20;
        this.size += useVersion1 ? 12 : 0;
        this.flags = 0;
        this.writeHeader(stream);
        if (useVersion1) {
          stream.writeUint64(this.creation_time);
          stream.writeUint64(this.modification_time);
          stream.writeUint32(this.timescale);
          stream.writeUint64(this.duration);
        } else {
          stream.writeUint32(this.creation_time);
          stream.writeUint32(this.modification_time);
          stream.writeUint32(this.timescale);
          stream.writeUint32(this.duration);
        }
        stream.writeUint16(this.language);
        stream.writeUint16(0);
      }
    };
    mehdBox = class extends FullBox {
      constructor(..._args) {
        super(..._args);
        this.box_name = "MovieExtendsHeaderBox";
      }
      static {
        this.fourcc = "mehd";
      }
      parse(stream) {
        this.parseFullHeader(stream);
        if (this.flags & 1) {
          Log.warn("BoxParser", "mehd box incorrectly uses flags set to 1, converting version to 1");
          this.version = 1;
        }
        if (this.version === 1) this.fragment_duration = stream.readUint64();
        else this.fragment_duration = stream.readUint32();
      }
      /** @bundle writing/mehd.js */
      write(stream) {
        const useVersion1 = this.fragment_duration > MAX_UINT32 || this.version === 1;
        this.version = useVersion1 ? 1 : 0;
        this.size = 4;
        this.size += useVersion1 ? 4 : 0;
        this.flags = 0;
        this.writeHeader(stream);
        if (useVersion1) stream.writeUint64(this.fragment_duration);
        else stream.writeUint32(this.fragment_duration);
      }
    };
    infeBox = class extends FullBox {
      constructor(..._args) {
        super(..._args);
        this.box_name = "ItemInfoEntry";
      }
      static {
        this.fourcc = "infe";
      }
      parse(stream) {
        this.parseFullHeader(stream);
        if (this.version === 0 || this.version === 1) {
          this.item_ID = stream.readUint16();
          this.item_protection_index = stream.readUint16();
          this.item_name = stream.readCString();
          this.content_type = stream.readCString();
          if (!this.isEndOfBox(stream)) this.content_encoding = stream.readCString();
        }
        if (this.version === 1) {
          this.extension_type = stream.readString(4);
          Log.warn("BoxParser", "Cannot parse extension type");
          stream.seek(this.start + this.size);
          return;
        }
        if (this.version >= 2) {
          if (this.version === 2) this.item_ID = stream.readUint16();
          else if (this.version === 3) this.item_ID = stream.readUint32();
          this.item_protection_index = stream.readUint16();
          this.item_type = stream.readString(4);
          this.item_name = stream.readCString();
          if (this.item_type === "mime") {
            this.content_type = stream.readCString();
            this.content_encoding = stream.readCString();
          } else if (this.item_type === "uri ") this.item_uri_type = stream.readCString();
        }
      }
    };
    iinfBox = class extends FullBox {
      constructor(..._args) {
        super(..._args);
        this.box_name = "ItemInfoBox";
      }
      static {
        this.fourcc = "iinf";
      }
      parse(stream) {
        this.parseFullHeader(stream);
        if (this.version === 0) this.entry_count = stream.readUint16();
        else this.entry_count = stream.readUint32();
        this.item_infos = [];
        for (let i = 0; i < this.entry_count; i++) {
          const ret = parseOneBox(stream, false, this.size - (stream.getPosition() - this.start));
          if (ret.code === 1) {
            const box = ret.box;
            if (box.type === "infe") this.item_infos[i] = box;
            else Log.error("BoxParser", "Expected 'infe' box, got " + ret.box.type, stream.isofile);
          } else return;
        }
      }
    };
    ilocBox = class extends FullBox {
      constructor(..._args) {
        super(..._args);
        this.box_name = "ItemLocationBox";
      }
      static {
        this.fourcc = "iloc";
      }
      parse(stream) {
        this.parseFullHeader(stream);
        let byte;
        byte = stream.readUint8();
        this.offset_size = byte >> 4 & 15;
        this.length_size = byte & 15;
        byte = stream.readUint8();
        this.base_offset_size = byte >> 4 & 15;
        if (this.version === 1 || this.version === 2) this.index_size = byte & 15;
        else this.index_size = 0;
        this.items = [];
        let item_count = 0;
        if (this.version < 2) item_count = stream.readUint16();
        else if (this.version === 2) item_count = stream.readUint32();
        else throw new Error("version of iloc box not supported");
        for (let i = 0; i < item_count; i++) {
          let item_ID = 0;
          let construction_method = 0;
          let base_offset = 0;
          if (this.version < 2) item_ID = stream.readUint16();
          else if (this.version === 2) item_ID = stream.readUint32();
          else throw new Error("version of iloc box not supported");
          if (this.version === 1 || this.version === 2) construction_method = stream.readUint16() & 15;
          else construction_method = 0;
          const data_reference_index = stream.readUint16();
          switch (this.base_offset_size) {
            case 0:
              base_offset = 0;
              break;
            case 4:
              base_offset = stream.readUint32();
              break;
            case 8:
              base_offset = stream.readUint64();
              break;
            default:
              throw new Error("Error reading base offset size");
          }
          const extents = [];
          const extent_count = stream.readUint16();
          for (let j = 0; j < extent_count; j++) {
            let extent_index = 0;
            let extent_offset = 0;
            let extent_length = 0;
            if (this.version === 1 || this.version === 2) switch (this.index_size) {
              case 0:
                extent_index = 0;
                break;
              case 4:
                extent_index = stream.readUint32();
                break;
              case 8:
                extent_index = stream.readUint64();
                break;
              default:
                throw new Error("Error reading extent index");
            }
            switch (this.offset_size) {
              case 0:
                extent_offset = 0;
                break;
              case 4:
                extent_offset = stream.readUint32();
                break;
              case 8:
                extent_offset = stream.readUint64();
                break;
              default:
                throw new Error("Error reading extent index");
            }
            switch (this.length_size) {
              case 0:
                extent_length = 0;
                break;
              case 4:
                extent_length = stream.readUint32();
                break;
              case 8:
                extent_length = stream.readUint64();
                break;
              default:
                throw new Error("Error reading extent index");
            }
            extents.push({
              extent_index,
              extent_length,
              extent_offset
            });
          }
          this.items.push({
            base_offset,
            construction_method,
            item_ID,
            data_reference_index,
            extents
          });
        }
      }
    };
    REFERENCE_TYPE_NAMES = {
      auxl: "Auxiliary image item",
      base: "Pre-derived image item base",
      cdsc: "Item describes referenced item",
      dimg: "Derived image item",
      dpnd: "Item coding dependency",
      eroi: "Region",
      evir: "EVC slice",
      exbl: "Scalable image item",
      "fdl ": "File delivery",
      font: "Font item",
      iloc: "Item data location",
      mask: "Region mask",
      mint: "Data integrity",
      pred: "Predictively coded item",
      prem: "Pre-multiplied item",
      tbas: "HEVC tile track base item",
      text: "Text item",
      thmb: "Thumbnail image item"
    };
    irefBox = class irefBox2 extends FullBox {
      constructor(..._args) {
        super(..._args);
        this.box_name = "ItemReferenceBox";
        this.references = [];
      }
      static {
        this.fourcc = "iref";
      }
      static {
        this.allowed_types = [
          "auxl",
          "base",
          "cdsc",
          "dimg",
          "dpnd",
          "eroi",
          "evir",
          "exbl",
          "fdl ",
          "font",
          "iloc",
          "mask",
          "mint",
          "pred",
          "prem",
          "tbas",
          "text",
          "thmb"
        ];
      }
      parse(stream) {
        this.parseFullHeader(stream);
        this.references = [];
        while (stream.getPosition() < this.start + this.size) {
          const ret = parseOneBox(stream, true, this.size - (stream.getPosition() - this.start));
          if (ret.code === 1) {
            let name = "Unknown item reference";
            if (!irefBox2.allowed_types.includes(ret.type)) Log.warn("BoxParser", `Unknown item reference type: '${ret.type}'`);
            else name = REFERENCE_TYPE_NAMES[ret.type];
            const box = this.version === 0 ? new SingleItemTypeReferenceBox(ret.type, ret.size, name, ret.hdr_size, ret.start) : new SingleItemTypeReferenceBoxLarge(ret.type, ret.size, name, ret.hdr_size, ret.start);
            if (box.write === Box.prototype.write && box.type !== "mdat") {
              Log.warn("BoxParser", box.type + " box writing not yet implemented, keeping unparsed data in memory for later write");
              box.parseDataAndRewind(stream);
            }
            box.parse(stream);
            this.references.push(box);
          } else return;
        }
      }
    };
    pitmBox = class extends FullBox {
      constructor(..._args) {
        super(..._args);
        this.box_name = "PrimaryItemBox";
      }
      static {
        this.fourcc = "pitm";
      }
      parse(stream) {
        this.parseFullHeader(stream);
        if (this.version === 0) this.item_id = stream.readUint16();
        else this.item_id = stream.readUint32();
      }
    };
    metaBox = class extends FullBox {
      constructor(..._args) {
        super(..._args);
        this.box_name = "MetaBox";
        this.isQT = false;
      }
      static {
        this.fourcc = "meta";
      }
      parse(stream) {
        const pos = stream.getPosition();
        if (this.size > 8) {
          stream.readUint32();
          switch (stream.readString(4)) {
            case "hdlr":
            case "mhdr":
            case "keys":
            case "ilst":
            case "ctry":
            case "lang":
              this.isQT = true;
              break;
            default:
              break;
          }
          stream.seek(pos);
        }
        if (!this.isQT) this.parseFullHeader(stream);
        ContainerBox.prototype.parse.call(this, stream);
      }
    };
    mfhdBox = class extends FullBox {
      constructor(..._args) {
        super(..._args);
        this.box_name = "MovieFragmentHeaderBox";
      }
      static {
        this.fourcc = "mfhd";
      }
      parse(stream) {
        this.parseFullHeader(stream);
        this.sequence_number = stream.readUint32();
      }
      /** @bundle writing/mfhd.js */
      write(stream) {
        this.version = 0;
        this.flags = 0;
        this.size = 4;
        this.writeHeader(stream);
        stream.writeUint32(this.sequence_number);
      }
    };
    mvhdBox = class extends FullBox {
      constructor(..._args) {
        super(..._args);
        this.box_name = "MovieHeaderBox";
      }
      static {
        this.fourcc = "mvhd";
      }
      parse(stream) {
        this.parseFullHeader(stream);
        if (this.version === 1) {
          this.creation_time = stream.readUint64();
          this.modification_time = stream.readUint64();
          this.timescale = stream.readUint32();
          this.duration = stream.readUint64();
        } else {
          this.creation_time = stream.readUint32();
          this.modification_time = stream.readUint32();
          this.timescale = stream.readUint32();
          this.duration = stream.readUint32();
        }
        this.rate = stream.readUint32();
        this.volume = stream.readUint16() >> 8;
        stream.readUint16();
        stream.readUint32Array(2);
        this.matrix = stream.readInt32Array(9);
        stream.readUint32Array(6);
        this.next_track_id = stream.readUint32();
      }
      /** @bundle writing/mvhd.js */
      write(stream) {
        const useVersion1 = this.modification_time > MAX_UINT32 || this.creation_time > MAX_UINT32 || this.duration > MAX_UINT32 || this.version === 1;
        this.version = useVersion1 ? 1 : 0;
        this.size = 96;
        this.size += useVersion1 ? 12 : 0;
        this.flags = 0;
        this.writeHeader(stream);
        if (useVersion1) {
          stream.writeUint64(this.creation_time);
          stream.writeUint64(this.modification_time);
          stream.writeUint32(this.timescale);
          stream.writeUint64(this.duration);
        } else {
          stream.writeUint32(this.creation_time);
          stream.writeUint32(this.modification_time);
          stream.writeUint32(this.timescale);
          stream.writeUint32(this.duration);
        }
        stream.writeUint32(this.rate);
        stream.writeUint16(this.volume << 8);
        stream.writeUint16(0);
        stream.writeUint32(0);
        stream.writeUint32(0);
        stream.writeInt32Array(this.matrix);
        stream.writeUint32(0);
        stream.writeUint32(0);
        stream.writeUint32(0);
        stream.writeUint32(0);
        stream.writeUint32(0);
        stream.writeUint32(0);
        stream.writeUint32(this.next_track_id);
      }
      /** @bundle box-print.js */
      print(output) {
        super.printHeader(output);
        output.log(output.indent + "creation_time: " + this.creation_time);
        output.log(output.indent + "modification_time: " + this.modification_time);
        output.log(output.indent + "timescale: " + this.timescale);
        output.log(output.indent + "duration: " + this.duration);
        output.log(output.indent + "rate: " + this.rate);
        output.log(output.indent + "volume: " + (this.volume >> 8));
        output.log(output.indent + "matrix: " + this.matrix.join(", "));
        output.log(output.indent + "next_track_id: " + this.next_track_id);
      }
    };
    mettSampleEntry = class extends MetadataSampleEntry {
      static {
        this.fourcc = "mett";
      }
      parse(stream) {
        this.parseHeader(stream);
        this.content_encoding = stream.readCString();
        this.mime_format = stream.readCString();
        this.parseFooter(stream);
      }
    };
    metxSampleEntry = class extends MetadataSampleEntry {
      static {
        this.fourcc = "metx";
      }
      parse(stream) {
        this.parseHeader(stream);
        this.content_encoding = stream.readCString();
        this.namespace = stream.readCString();
        this.schema_location = stream.readCString();
        this.parseFooter(stream);
      }
    };
    av1CBox = class extends Box {
      constructor(..._args) {
        super(..._args);
        this.box_name = "AV1CodecConfigurationBox";
      }
      static {
        this.fourcc = "av1C";
      }
      parse(stream) {
        let tmp = stream.readUint8();
        if ((tmp >> 7 & 1) !== 1) {
          Log.error("BoxParser", "av1C marker problem", stream.isofile);
          return;
        }
        this.version = tmp & 127;
        if (this.version !== 1) {
          Log.error("BoxParser", "av1C version " + this.version + " not supported", stream.isofile);
          return;
        }
        tmp = stream.readUint8();
        this.seq_profile = tmp >> 5 & 7;
        this.seq_level_idx_0 = tmp & 31;
        tmp = stream.readUint8();
        this.seq_tier_0 = tmp >> 7 & 1;
        this.high_bitdepth = tmp >> 6 & 1;
        this.twelve_bit = tmp >> 5 & 1;
        this.monochrome = tmp >> 4 & 1;
        this.chroma_subsampling_x = tmp >> 3 & 1;
        this.chroma_subsampling_y = tmp >> 2 & 1;
        this.chroma_sample_position = tmp & 3;
        tmp = stream.readUint8();
        this.reserved_1 = tmp >> 5 & 7;
        if (this.reserved_1 !== 0) {
          Log.error("BoxParser", "av1C reserved_1 parsing problem", stream.isofile);
          return;
        }
        this.initial_presentation_delay_present = tmp >> 4 & 1;
        if (this.initial_presentation_delay_present === 1) this.initial_presentation_delay_minus_one = tmp & 15;
        else {
          this.reserved_2 = tmp & 15;
          if (this.reserved_2 !== 0) {
            Log.error("BoxParser", "av1C reserved_2 parsing problem", stream.isofile);
            return;
          }
        }
        const configOBUs_length = this.size - this.hdr_size - 4;
        this.configOBUs = stream.readUint8Array(configOBUs_length);
      }
    };
    esdsBox = class extends FullBox {
      constructor(..._args) {
        super(..._args);
        this.box_name = "ElementaryStreamDescriptorBox";
      }
      static {
        this.fourcc = "esds";
      }
      parse(stream) {
        this.parseFullHeader(stream);
        const esd_data = stream.readUint8Array(this.size - this.hdr_size);
        if ("MPEG4DescriptorParser" in DescriptorRegistry) {
          const esd_parser = new DescriptorRegistry.MPEG4DescriptorParser();
          this.esd = esd_parser.parseOneDescriptor(new DataStream(esd_data.buffer, 0));
        }
      }
    };
    waveBox = class extends ContainerBox {
      constructor(..._args) {
        super(..._args);
        this.box_name = "siDecompressionParamBox";
      }
      static {
        this.fourcc = "wave";
      }
    };
    lvcCBox = class extends Box {
      constructor(..._args) {
        super(..._args);
        this.box_name = "LCEVCConfigurationBox";
      }
      static {
        this.fourcc = "lvcC";
      }
      parse(stream) {
        this.configurationVersion = stream.readUint8();
        if (this.configurationVersion !== 1) {
          Log.error("BoxParser", "lvcC version " + this.configurationVersion + " not supported", stream.isofile);
          return;
        }
        this.LCEVCProfileIndication = stream.readUint8();
        this.LCEVCLevelIndication = stream.readUint8();
        let tmp_byte = stream.readUint8();
        this.chroma_format_idc = tmp_byte >> 6 & 3;
        this.bit_depth_luma_minus8 = tmp_byte >> 3 & 7;
        this.bit_depth_chroma_minus8 = tmp_byte & 7;
        tmp_byte = stream.readUint8();
        this.lengthSizeMinusOne = tmp_byte >> 6 & 3;
        let reserved = tmp_byte & 63;
        if (reserved !== 63) {
          Log.error("BoxParser", "lvcC reserved parsing problem", stream.isofile);
          return;
        }
        this.pic_width_in_luma_samples = stream.readUint32();
        this.pic_height_in_luma_samples = stream.readUint32();
        tmp_byte = stream.readUint8();
        this.sc_in_stream = tmp_byte >> 7 & 1;
        this.gc_in_stream = tmp_byte >> 6 & 1;
        this.ai_in_stream = tmp_byte >> 5 & 1;
        reserved = tmp_byte & 31;
        if (reserved !== 31) {
          Log.error("BoxParser", "lvcC reserved parsing problem", stream.isofile);
          return;
        }
        this.nalu_arrays = [];
        const numOfArrays = stream.readUint8();
        for (let i = 0; i < numOfArrays; i++) {
          const nalu_array = [];
          this.nalu_arrays.push(nalu_array);
          tmp_byte = stream.readUint8();
          reserved = tmp_byte >> 6 & 3;
          if (reserved !== 0) {
            Log.error("BoxParser", "lvcC reserved parsing problem", stream.isofile);
            return;
          }
          nalu_array.nalu_type = tmp_byte & 63;
          const numOfNalus = stream.readUint16();
          for (let j = 0; j < numOfNalus; j++) {
            const length = stream.readUint16();
            nalu_array.push({ data: stream.readUint8Array(length) });
          }
        }
      }
    };
    vpcCBox = class extends FullBox {
      constructor(..._args) {
        super(..._args);
        this.box_name = "VPCodecConfigurationRecord";
      }
      static {
        this.fourcc = "vpcC";
      }
      parse(stream) {
        this.parseFullHeader(stream);
        if (this.version === 1) {
          this.profile = stream.readUint8();
          this.level = stream.readUint8();
          const tmp = stream.readUint8();
          this.bitDepth = tmp >> 4;
          this.chromaSubsampling = tmp >> 1 & 7;
          this.videoFullRangeFlag = tmp & 1;
          this.colourPrimaries = stream.readUint8();
          this.transferCharacteristics = stream.readUint8();
          this.matrixCoefficients = stream.readUint8();
          this.codecIntializationDataSize = stream.readUint16();
          this.codecIntializationData = stream.readUint8Array(this.codecIntializationDataSize);
        } else {
          this.profile = stream.readUint8();
          this.level = stream.readUint8();
          let tmp = stream.readUint8();
          this.bitDepth = tmp >> 4 & 15;
          this.colorSpace = tmp & 15;
          tmp = stream.readUint8();
          this.chromaSubsampling = tmp >> 4 & 15;
          this.transferFunction = tmp >> 1 & 7;
          this.videoFullRangeFlag = tmp & 1;
          this.codecIntializationDataSize = stream.readUint16();
          this.codecIntializationData = stream.readUint8Array(this.codecIntializationDataSize);
        }
      }
    };
    vvcCBox = class extends FullBox {
      constructor(..._args) {
        super(..._args);
        this.box_name = "VvcConfigurationBox";
      }
      static {
        this.fourcc = "vvcC";
      }
      parse(stream) {
        this.parseFullHeader(stream);
        const bitReader = {
          held_bits: void 0,
          num_held_bits: 0,
          stream_read_1_bytes: function(strm) {
            this.held_bits = strm.readUint8();
            this.num_held_bits = 8;
          },
          stream_read_2_bytes: function(strm) {
            this.held_bits = strm.readUint16();
            this.num_held_bits = 16;
          },
          extract_bits: function(num_bits) {
            const ret = this.held_bits >> this.num_held_bits - num_bits & (1 << num_bits) - 1;
            this.num_held_bits -= num_bits;
            return ret;
          }
        };
        bitReader.stream_read_1_bytes(stream);
        bitReader.extract_bits(5);
        this.lengthSizeMinusOne = bitReader.extract_bits(2);
        this.ptl_present_flag = bitReader.extract_bits(1);
        if (this.ptl_present_flag) {
          bitReader.stream_read_2_bytes(stream);
          this.ols_idx = bitReader.extract_bits(9);
          this.num_sublayers = bitReader.extract_bits(3);
          this.constant_frame_rate = bitReader.extract_bits(2);
          this.chroma_format_idc = bitReader.extract_bits(2);
          bitReader.stream_read_1_bytes(stream);
          this.bit_depth_minus8 = bitReader.extract_bits(3);
          bitReader.extract_bits(5);
          bitReader.stream_read_2_bytes(stream);
          bitReader.extract_bits(2);
          this.num_bytes_constraint_info = bitReader.extract_bits(6);
          this.general_profile_idc = bitReader.extract_bits(7);
          this.general_tier_flag = bitReader.extract_bits(1);
          this.general_level_idc = stream.readUint8();
          bitReader.stream_read_1_bytes(stream);
          this.ptl_frame_only_constraint_flag = bitReader.extract_bits(1);
          this.ptl_multilayer_enabled_flag = bitReader.extract_bits(1);
          this.general_constraint_info = new Uint8Array(this.num_bytes_constraint_info);
          if (this.num_bytes_constraint_info) {
            for (let i = 0; i < this.num_bytes_constraint_info - 1; i++) {
              const cnstr1 = bitReader.extract_bits(6);
              bitReader.stream_read_1_bytes(stream);
              const cnstr2 = bitReader.extract_bits(2);
              this.general_constraint_info[i] = cnstr1 << 2 | cnstr2;
            }
            this.general_constraint_info[this.num_bytes_constraint_info - 1] = bitReader.extract_bits(6);
          } else bitReader.extract_bits(6);
          if (this.num_sublayers > 1) {
            bitReader.stream_read_1_bytes(stream);
            this.ptl_sublayer_present_mask = 0;
            for (let j = this.num_sublayers - 2; j >= 0; --j) {
              const val = bitReader.extract_bits(1);
              this.ptl_sublayer_present_mask |= val << j;
            }
            for (let j = this.num_sublayers; j <= 8 && this.num_sublayers > 1; ++j) bitReader.extract_bits(1);
            this.sublayer_level_idc = [];
            for (let j = this.num_sublayers - 2; j >= 0; --j) if (this.ptl_sublayer_present_mask & 1 << j) this.sublayer_level_idc[j] = stream.readUint8();
          }
          this.ptl_num_sub_profiles = stream.readUint8();
          this.general_sub_profile_idc = [];
          if (this.ptl_num_sub_profiles) for (let i = 0; i < this.ptl_num_sub_profiles; i++) this.general_sub_profile_idc.push(stream.readUint32());
          this.max_picture_width = stream.readUint16();
          this.max_picture_height = stream.readUint16();
          this.avg_frame_rate = stream.readUint16();
        }
        const VVC_NALU_OPI = 12;
        const VVC_NALU_DEC_PARAM = 13;
        this.nalu_arrays = [];
        const num_of_arrays = stream.readUint8();
        for (let i = 0; i < num_of_arrays; i++) {
          const nalu_array = [];
          this.nalu_arrays.push(nalu_array);
          bitReader.stream_read_1_bytes(stream);
          nalu_array.completeness = bitReader.extract_bits(1);
          bitReader.extract_bits(2);
          nalu_array.nalu_type = bitReader.extract_bits(5);
          let numNalus = 1;
          if (nalu_array.nalu_type !== VVC_NALU_DEC_PARAM && nalu_array.nalu_type !== VVC_NALU_OPI) numNalus = stream.readUint16();
          for (let j = 0; j < numNalus; j++) {
            const len = stream.readUint16();
            nalu_array.push({
              data: stream.readUint8Array(len),
              length: len
            });
          }
        }
      }
    };
    colrBox = class extends Box {
      constructor(..._args) {
        super(..._args);
        this.box_name = "ColourInformationBox";
      }
      static {
        this.fourcc = "colr";
      }
      parse(stream) {
        this.colour_type = stream.readString(4);
        if (this.colour_type === "nclx") {
          this.colour_primaries = stream.readUint16();
          this.transfer_characteristics = stream.readUint16();
          this.matrix_coefficients = stream.readUint16();
          const tmp = stream.readUint8();
          this.full_range_flag = tmp >> 7;
        } else if (this.colour_type === "rICC") this.ICC_profile = stream.readUint8Array(this.size - 4);
        else if (this.colour_type === "prof") this.ICC_profile = stream.readUint8Array(this.size - 4);
      }
    };
    avcCSampleEntryBase = class extends VisualSampleEntry {
      /** @bundle box-codecs.js */
      getCodec() {
        const baseCodec = super.getCodec();
        if (this.avcC) return `${baseCodec}.${decimalToHex(this.avcC.AVCProfileIndication)}${decimalToHex(this.avcC.profile_compatibility)}${decimalToHex(this.avcC.AVCLevelIndication)}`;
        else return baseCodec;
      }
    };
    avc1SampleEntry = class extends avcCSampleEntryBase {
      constructor(..._args) {
        super(..._args);
        this.box_name = "AVCSampleEntry";
      }
      static {
        this.fourcc = "avc1";
      }
    };
    avc2SampleEntry = class extends avcCSampleEntryBase {
      constructor(..._args2) {
        super(..._args2);
        this.box_name = "AVC2SampleEntry";
      }
      static {
        this.fourcc = "avc2";
      }
    };
    avc3SampleEntry = class extends avcCSampleEntryBase {
      constructor(..._args3) {
        super(..._args3);
        this.box_name = "AVCSampleEntry";
      }
      static {
        this.fourcc = "avc3";
      }
    };
    avc4SampleEntry = class extends avcCSampleEntryBase {
      constructor(..._args4) {
        super(..._args4);
        this.box_name = "AVC2SampleEntry";
      }
      static {
        this.fourcc = "avc4";
      }
    };
    av01SampleEntry = class extends VisualSampleEntry {
      constructor(..._args5) {
        super(..._args5);
        this.box_name = "AV1SampleEntry";
      }
      static {
        this.fourcc = "av01";
      }
      /** @bundle box-codecs.js */
      getCodec() {
        const baseCodec = super.getCodec();
        const level_idx_0 = this.av1C.seq_level_idx_0;
        const level = level_idx_0 < 10 ? "0" + level_idx_0 : level_idx_0;
        let bitdepth;
        if (this.av1C.seq_profile === 2 && this.av1C.high_bitdepth === 1) bitdepth = this.av1C.twelve_bit === 1 ? "12" : "10";
        else if (this.av1C.seq_profile <= 2) bitdepth = this.av1C.high_bitdepth === 1 ? "10" : "08";
        return baseCodec + "." + this.av1C.seq_profile + "." + level + (this.av1C.seq_tier_0 ? "H" : "M") + "." + bitdepth;
      }
    };
    dav1SampleEntry = class extends VisualSampleEntry {
      static {
        this.fourcc = "dav1";
      }
    };
    hvcCSampleEntryBase = class extends VisualSampleEntry {
      /** @bundle box-codecs.js */
      getCodec() {
        let baseCodec = super.getCodec();
        if (this.hvcC) {
          baseCodec += ".";
          switch (this.hvcC.general_profile_space) {
            case 0:
              baseCodec += "";
              break;
            case 1:
              baseCodec += "A";
              break;
            case 2:
              baseCodec += "B";
              break;
            case 3:
              baseCodec += "C";
              break;
          }
          baseCodec += this.hvcC.general_profile_idc;
          baseCodec += ".";
          let val = this.hvcC.general_profile_compatibility;
          let reversed = 0;
          for (let i = 0; i < 32; i++) {
            reversed |= val & 1;
            if (i === 31) break;
            reversed <<= 1;
            val >>= 1;
          }
          baseCodec += decimalToHex(reversed, 0);
          baseCodec += ".";
          if (this.hvcC.general_tier_flag === 0) baseCodec += "L";
          else baseCodec += "H";
          baseCodec += this.hvcC.general_level_idc;
          let hasByte = false;
          let constraint_string = "";
          for (let i = 5; i >= 0; i--) if (this.hvcC.general_constraint_indicator[i] || hasByte) {
            constraint_string = "." + decimalToHex(this.hvcC.general_constraint_indicator[i], 0) + constraint_string;
            hasByte = true;
          }
          baseCodec += constraint_string;
        }
        return baseCodec;
      }
    };
    hvc1SampleEntry = class extends hvcCSampleEntryBase {
      constructor(..._args6) {
        super(..._args6);
        this.box_name = "HEVCSampleEntry";
      }
      static {
        this.fourcc = "hvc1";
      }
    };
    hvc2SampleEntry = class extends hvcCSampleEntryBase {
      static {
        this.fourcc = "hvc2";
      }
    };
    hev1SampleEntry = class extends hvcCSampleEntryBase {
      constructor(..._args7) {
        super(..._args7);
        this.box_name = "HEVCSampleEntry";
        this.colrs = [];
        this.subBoxNames = ["colr"];
      }
      static {
        this.fourcc = "hev1";
      }
    };
    hev2SampleEntry = class extends hvcCSampleEntryBase {
      static {
        this.fourcc = "hev2";
      }
    };
    hvt1SampleEntry = class extends VisualSampleEntry {
      constructor(..._args8) {
        super(..._args8);
        this.box_name = "HEVCTileSampleSampleEntry";
      }
      static {
        this.fourcc = "hvt1";
      }
    };
    lhe1SampleEntry = class extends VisualSampleEntry {
      constructor(..._args9) {
        super(..._args9);
        this.box_name = "LHEVCSampleEntry";
      }
      static {
        this.fourcc = "lhe1";
      }
    };
    lhv1SampleEntry = class extends VisualSampleEntry {
      constructor(..._args10) {
        super(..._args10);
        this.box_name = "LHEVCSampleEntry";
      }
      static {
        this.fourcc = "lhv1";
      }
    };
    lvc1SampleEntry = class extends VisualSampleEntry {
      constructor(..._args11) {
        super(..._args11);
        this.box_name = "LCEVCSampleEntry";
      }
      static {
        this.fourcc = "lvc1";
      }
      /** @bundle box-codecs.js */
      getCodec() {
        let baseCodec = super.getCodec();
        if (this.lvcC) {
          baseCodec += ".";
          baseCodec += "vprf";
          baseCodec += this.lvcC.LCEVCProfileIndication;
          baseCodec += ".";
          baseCodec += "vlev";
          baseCodec += this.lvcC.LCEVCLevelIndication;
        }
        return baseCodec;
      }
    };
    dvh1SampleEntry = class extends VisualSampleEntry {
      static {
        this.fourcc = "dvh1";
      }
    };
    dvheSampleEntry = class extends VisualSampleEntry {
      static {
        this.fourcc = "dvhe";
      }
    };
    vvcCSampleEntryBase = class extends VisualSampleEntry {
      getCodec() {
        let baseCodec = super.getCodec();
        if (this.vvcC) {
          baseCodec += "." + this.vvcC.general_profile_idc;
          if (this.vvcC.general_tier_flag) baseCodec += ".H";
          else baseCodec += ".L";
          baseCodec += this.vvcC.general_level_idc;
          let constraint_string = "";
          if (this.vvcC.general_constraint_info) {
            const bytes = [];
            let byte = 0;
            byte |= this.vvcC.ptl_frame_only_constraint_flag << 7;
            byte |= this.vvcC.ptl_multilayer_enabled_flag << 6;
            let last_nonzero;
            for (let i = 0; i < this.vvcC.general_constraint_info.length; ++i) {
              byte |= this.vvcC.general_constraint_info[i] >> 2 & 63;
              bytes.push(byte);
              if (byte) last_nonzero = i;
              byte = this.vvcC.general_constraint_info[i] >> 2 & 3;
            }
            if (last_nonzero === void 0) constraint_string = ".CA";
            else {
              constraint_string = ".C";
              const base32_chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
              let held_bits = 0;
              let num_held_bits = 0;
              for (let i = 0; i <= last_nonzero; ++i) {
                held_bits = held_bits << 8 | bytes[i];
                num_held_bits += 8;
                while (num_held_bits >= 5) {
                  const val = held_bits >> num_held_bits - 5 & 31;
                  constraint_string += base32_chars[val];
                  num_held_bits -= 5;
                  held_bits &= (1 << num_held_bits) - 1;
                }
              }
              if (num_held_bits) {
                held_bits <<= 5 - num_held_bits;
                constraint_string += base32_chars[held_bits & 31];
              }
            }
          }
          baseCodec += constraint_string;
        }
        return baseCodec;
      }
    };
    vvc1SampleEntry = class extends vvcCSampleEntryBase {
      constructor(..._args12) {
        super(..._args12);
        this.box_name = "VvcSampleEntry";
      }
      static {
        this.fourcc = "vvc1";
      }
    };
    vvi1SampleEntry = class extends vvcCSampleEntryBase {
      constructor(..._args13) {
        super(..._args13);
        this.box_name = "VvcSampleEntry";
      }
      static {
        this.fourcc = "vvi1";
      }
    };
    vvs1SampleEntry = class extends VisualSampleEntry {
      constructor(..._args14) {
        super(..._args14);
        this.box_name = "VvcSampleEntry";
      }
      static {
        this.fourcc = "vvs1";
      }
    };
    vvcNSampleEntry = class extends VisualSampleEntry {
      constructor(..._args15) {
        super(..._args15);
        this.box_name = "VvcNonVCLSampleEntry";
      }
      static {
        this.fourcc = "vvcN";
      }
    };
    vpcCSampleEntryBase = class extends VisualSampleEntry {
      getCodec() {
        const baseCodec = super.getCodec();
        let level = this.vpcC.level;
        if (level === 0) level = "00";
        let bitDepth = this.vpcC.bitDepth;
        if (bitDepth === 8) bitDepth = "08";
        return `${baseCodec}.0${this.vpcC.profile}.${level}.${bitDepth}`;
      }
    };
    vp08SampleEntry = class extends vpcCSampleEntryBase {
      static {
        this.fourcc = "vp08";
      }
    };
    vp09SampleEntry = class extends vpcCSampleEntryBase {
      static {
        this.fourcc = "vp09";
      }
    };
    avs3SampleEntry = class extends VisualSampleEntry {
      static {
        this.fourcc = "avs3";
      }
    };
    j2kiSampleEntry = class extends VisualSampleEntry {
      constructor(..._args16) {
        super(..._args16);
        this.box_name = "J2KSampleEntry";
      }
      static {
        this.fourcc = "j2ki";
      }
    };
    mjp2SampleEntry = class extends VisualSampleEntry {
      static {
        this.fourcc = "mjp2";
      }
    };
    mjpgSampleEntry = class extends VisualSampleEntry {
      static {
        this.fourcc = "mjpg";
      }
    };
    uncvSampleEntry = class extends VisualSampleEntry {
      constructor(..._args17) {
        super(..._args17);
        this.box_name = "UncompressedVideoSampleEntry";
      }
      static {
        this.fourcc = "uncv";
      }
    };
    mp4vSampleEntry = class extends VisualSampleEntry {
      constructor(..._args18) {
        super(..._args18);
        this.box_name = "MP4VisualSampleEntry";
      }
      static {
        this.fourcc = "mp4v";
      }
    };
    mp4aSampleEntry = class extends AudioSampleEntry {
      constructor(..._args19) {
        super(..._args19);
        this.box_name = "MP4AudioSampleEntry";
      }
      static {
        this.fourcc = "mp4a";
      }
      getCodec() {
        const baseCodec = super.getCodec();
        const esds = this.esds ?? this.wave?.esds;
        if (esds && esds.esd) {
          const oti = esds.esd.getOTI();
          const dsi = esds.esd.getAudioConfig();
          return baseCodec + "." + decimalToHex(oti) + (dsi ? "." + dsi : "");
        } else return baseCodec;
      }
    };
    m4aeSampleEntry = class extends AudioSampleEntry {
      static {
        this.fourcc = "m4ae";
      }
    };
    ac_3SampleEntry = class extends AudioSampleEntry {
      static {
        this.fourcc = "ac-3";
      }
    };
    ac_4SampleEntry = class extends AudioSampleEntry {
      static {
        this.fourcc = "ac-4";
      }
    };
    ec_3SampleEntry = class extends AudioSampleEntry {
      static {
        this.fourcc = "ec-3";
      }
    };
    OpusSampleEntry = class extends AudioSampleEntry {
      static {
        this.fourcc = "Opus";
      }
    };
    mha1SampleEntry = class extends AudioSampleEntry {
      static {
        this.fourcc = "mha1";
      }
    };
    mha2SampleEntry = class extends AudioSampleEntry {
      static {
        this.fourcc = "mha2";
      }
    };
    mhm1SampleEntry = class extends AudioSampleEntry {
      static {
        this.fourcc = "mhm1";
      }
    };
    mhm2SampleEntry = class extends AudioSampleEntry {
      static {
        this.fourcc = "mhm2";
      }
    };
    fLaCSampleEntry = class extends AudioSampleEntry {
      static {
        this.fourcc = "fLaC";
      }
    };
    encvSampleEntry = class extends VisualSampleEntry {
      static {
        this.fourcc = "encv";
      }
    };
    encaSampleEntry = class extends AudioSampleEntry {
      static {
        this.fourcc = "enca";
      }
    };
    encuSampleEntry = class extends SubtitleSampleEntry {
      constructor(..._args20) {
        super(..._args20);
        this.subBoxNames = ["sinf"];
        this.sinfs = [];
      }
      static {
        this.fourcc = "encu";
      }
    };
    encsSampleEntry = class extends SystemSampleEntry {
      constructor(..._args21) {
        super(..._args21);
        this.subBoxNames = ["sinf"];
        this.sinfs = [];
      }
      static {
        this.fourcc = "encs";
      }
    };
    mp4sSampleEntry = class extends SystemSampleEntry {
      static {
        this.fourcc = "mp4s";
      }
    };
    enctSampleEntry = class extends TextSampleEntry {
      constructor(..._args22) {
        super(..._args22);
        this.subBoxNames = ["sinf"];
        this.sinfs = [];
      }
      static {
        this.fourcc = "enct";
      }
    };
    encmSampleEntry = class extends MetadataSampleEntry {
      constructor(..._args23) {
        super(..._args23);
        this.subBoxNames = ["sinf"];
        this.sinfs = [];
      }
      static {
        this.fourcc = "encm";
      }
    };
    resvSampleEntry = class extends VisualSampleEntry {
      constructor(..._args24) {
        super(..._args24);
        this.box_name = "RestrictedVideoSampleEntry";
      }
      static {
        this.fourcc = "resv";
      }
    };
    sbttSampleEntry = class extends SubtitleSampleEntry {
      static {
        this.fourcc = "sbtt";
      }
      parse(stream) {
        this.parseHeader(stream);
        this.content_encoding = stream.readCString();
        this.mime_format = stream.readCString();
        this.parseFooter(stream);
      }
    };
    stppSampleEntry = class extends SubtitleSampleEntry {
      static {
        this.fourcc = "stpp";
      }
      parse(stream) {
        this.parseHeader(stream);
        this.namespace = stream.readCString();
        this.schema_location = stream.readCString();
        this.auxiliary_mime_types = stream.readCString();
        this.parseFooter(stream);
      }
      /** @bundle writing/sampleentry.js */
      write(stream) {
        this.writeHeader(stream);
        this.size += this.namespace.length + 1 + this.schema_location.length + 1 + this.auxiliary_mime_types.length + 1;
        stream.writeCString(this.namespace);
        stream.writeCString(this.schema_location);
        stream.writeCString(this.auxiliary_mime_types);
        this.writeFooter(stream);
      }
    };
    stxtSampleEntry = class extends SubtitleSampleEntry {
      static {
        this.fourcc = "stxt";
      }
      parse(stream) {
        this.parseHeader(stream);
        this.content_encoding = stream.readCString();
        this.mime_format = stream.readCString();
        this.parseFooter(stream);
      }
      getCodec() {
        const baseCodec = super.getCodec();
        if (this.mime_format) return baseCodec + "." + this.mime_format;
        else return baseCodec;
      }
    };
    tx3gSampleEntry = class extends SubtitleSampleEntry {
      static {
        this.fourcc = "tx3g";
      }
      parse(stream) {
        this.parseHeader(stream);
        this.displayFlags = stream.readUint32();
        this.horizontal_justification = stream.readInt8();
        this.vertical_justification = stream.readInt8();
        this.bg_color_rgba = stream.readUint8Array(4);
        this.box_record = stream.readInt16Array(4);
        this.style_record = stream.readUint8Array(12);
        this.parseFooter(stream);
      }
    };
    wvttSampleEntry = class extends MetadataSampleEntry {
      static {
        this.fourcc = "wvtt";
      }
      parse(stream) {
        this.parseHeader(stream);
        this.parseFooter(stream);
      }
    };
    sbgpBox = class extends FullBox {
      constructor(..._args) {
        super(..._args);
        this.box_name = "SampleToGroupBox";
      }
      static {
        this.fourcc = "sbgp";
      }
      parse(stream) {
        this.parseFullHeader(stream);
        this.grouping_type = stream.readString(4);
        if (this.version === 1) this.grouping_type_parameter = stream.readUint32();
        else this.grouping_type_parameter = 0;
        this.entries = [];
        const entry_count = stream.readUint32();
        for (let i = 0; i < entry_count; i++) this.entries.push({
          sample_count: stream.readInt32(),
          group_description_index: stream.readInt32()
        });
      }
      /** @bundle writing/sbgp.js */
      write(stream) {
        if (this.grouping_type_parameter) this.version = 1;
        else this.version = 0;
        this.flags = 0;
        this.size = 8 + 8 * this.entries.length + (this.version === 1 ? 4 : 0);
        this.writeHeader(stream);
        stream.writeString(this.grouping_type, void 0, 4);
        if (this.version === 1) stream.writeUint32(this.grouping_type_parameter);
        stream.writeUint32(this.entries.length);
        for (let i = 0; i < this.entries.length; i++) {
          const entry = this.entries[i];
          stream.writeInt32(entry.sample_count);
          stream.writeInt32(entry.group_description_index);
        }
      }
    };
    sdtpBox = class extends FullBox {
      constructor(..._args) {
        super(..._args);
        this.box_name = "SampleDependencyTypeBox";
      }
      static {
        this.fourcc = "sdtp";
      }
      parse(stream) {
        this.parseFullHeader(stream);
        const count = this.size - this.hdr_size;
        this.is_leading = [];
        this.sample_depends_on = [];
        this.sample_is_depended_on = [];
        this.sample_has_redundancy = [];
        for (let i = 0; i < count; i++) {
          const tmp_byte = stream.readUint8();
          this.is_leading[i] = tmp_byte >> 6;
          this.sample_depends_on[i] = tmp_byte >> 4 & 3;
          this.sample_is_depended_on[i] = tmp_byte >> 2 & 3;
          this.sample_has_redundancy[i] = tmp_byte & 3;
        }
      }
    };
    sgpdBox = class extends FullBox {
      constructor(..._args) {
        super(..._args);
        this.box_name = "SampleGroupDescriptionBox";
      }
      static {
        this.fourcc = "sgpd";
      }
      parse(stream) {
        this.parseFullHeader(stream);
        this.grouping_type = stream.readString(4);
        Log.debug("BoxParser", "Found Sample Groups of type " + this.grouping_type);
        if (this.version === 1) this.default_length = stream.readUint32();
        else this.default_length = 0;
        if (this.version >= 2) this.default_group_description_index = stream.readUint32();
        this.entries = [];
        const entry_count = stream.readUint32();
        for (let i = 0; i < entry_count; i++) {
          let entry;
          if (this.grouping_type in BoxRegistry.sampleGroupEntry) entry = new BoxRegistry.sampleGroupEntry[this.grouping_type](this.grouping_type);
          else entry = new SampleGroupEntry(this.grouping_type);
          this.entries.push(entry);
          if (this.version === 1) if (this.default_length === 0) entry.description_length = stream.readUint32();
          else entry.description_length = this.default_length;
          else entry.description_length = this.default_length;
          if (entry.write === SampleGroupEntry.prototype.write) {
            Log.info("BoxParser", "SampleGroup for type " + this.grouping_type + " writing not yet implemented, keeping unparsed data in memory for later write");
            entry.data = stream.readUint8Array(entry.description_length);
            stream.seek(stream.getPosition() - entry.description_length);
          }
          entry.parse(stream);
        }
      }
      /** @bundle writing/sgpd.js */
      write(stream) {
        this.flags = 0;
        this.size = 12;
        for (let i = 0; i < this.entries.length; i++) {
          const entry = this.entries[i];
          if (this.version === 1) {
            if (this.default_length === 0) this.size += 4;
            this.size += entry.data.length;
          }
        }
        this.writeHeader(stream);
        stream.writeString(this.grouping_type, void 0, 4);
        if (this.version === 1) stream.writeUint32(this.default_length);
        if (this.version >= 2) stream.writeUint32(this.default_sample_description_index);
        stream.writeUint32(this.entries.length);
        for (let i = 0; i < this.entries.length; i++) {
          const entry = this.entries[i];
          if (this.version === 1) {
            if (this.default_length === 0) stream.writeUint32(entry.description_length);
          }
          entry.write(stream);
        }
      }
    };
    sidxBox = class extends FullBox {
      constructor(..._args) {
        super(..._args);
        this.box_name = "CompressedSegmentIndexBox";
      }
      static {
        this.fourcc = "sidx";
      }
      parse(stream) {
        this.parseFullHeader(stream);
        this.reference_ID = stream.readUint32();
        this.timescale = stream.readUint32();
        if (this.version === 0) {
          this.earliest_presentation_time = stream.readUint32();
          this.first_offset = stream.readUint32();
        } else {
          this.earliest_presentation_time = stream.readUint64();
          this.first_offset = stream.readUint64();
        }
        stream.readUint16();
        this.references = [];
        const count = stream.readUint16();
        for (let i = 0; i < count; i++) {
          const type = stream.readUint32();
          const subsegment_duration = stream.readUint32();
          const sap = stream.readUint32();
          this.references.push({
            reference_type: type >> 31 & 1,
            referenced_size: type & 2147483647,
            subsegment_duration,
            starts_with_SAP: sap >> 31 & 1,
            SAP_type: sap >> 28 & 7,
            SAP_delta_time: sap & 268435455
          });
        }
      }
      /** @bundle writing/sidx.js */
      write(stream) {
        const useVersion1 = this.earliest_presentation_time > MAX_UINT32 || this.first_offset > MAX_UINT32 || this.version === 1;
        this.version = useVersion1 ? 1 : 0;
        this.size = 12 + 12 * this.references.length;
        this.size += useVersion1 ? 16 : 8;
        this.flags = 0;
        this.writeHeader(stream);
        stream.writeUint32(this.reference_ID);
        stream.writeUint32(this.timescale);
        if (useVersion1) {
          stream.writeUint64(this.earliest_presentation_time);
          stream.writeUint64(this.first_offset);
        } else {
          stream.writeUint32(this.earliest_presentation_time);
          stream.writeUint32(this.first_offset);
        }
        stream.writeUint16(0);
        stream.writeUint16(this.references.length);
        for (let i = 0; i < this.references.length; i++) {
          const ref = this.references[i];
          stream.writeUint32(ref.reference_type << 31 | ref.referenced_size);
          stream.writeUint32(ref.subsegment_duration);
          stream.writeUint32(ref.starts_with_SAP << 31 | ref.SAP_type << 28 | ref.SAP_delta_time);
        }
      }
    };
    smhdBox = class extends FullBox {
      constructor(..._args) {
        super(..._args);
        this.box_name = "SoundMediaHeaderBox";
      }
      static {
        this.fourcc = "smhd";
      }
      parse(stream) {
        this.parseFullHeader(stream);
        this.balance = stream.readUint16();
        stream.readUint16();
      }
      /** @bundle writing/smhd.js */
      write(stream) {
        this.version = 0;
        this.size = 4;
        this.writeHeader(stream);
        stream.writeUint16(this.balance);
        stream.writeUint16(0);
      }
    };
    stcoBox = class extends FullBox {
      constructor(..._args) {
        super(..._args);
        this.box_name = "ChunkOffsetBox";
      }
      static {
        this.fourcc = "stco";
      }
      parse(stream) {
        this.parseFullHeader(stream);
        const entry_count = stream.readUint32();
        this.chunk_offsets = [];
        if (this.version === 0) for (let i = 0; i < entry_count; i++) this.chunk_offsets.push(stream.readUint32());
      }
      /** @bundle writings/stco.js */
      write(stream) {
        this.version = 0;
        this.flags = 0;
        this.size = 4 + 4 * this.chunk_offsets.length;
        this.writeHeader(stream);
        stream.writeUint32(this.chunk_offsets.length);
        stream.writeUint32Array(this.chunk_offsets);
      }
      /** @bundle box-unpack.js */
      unpack(samples) {
        for (let i = 0; i < this.chunk_offsets.length; i++) samples[i].offset = this.chunk_offsets[i];
      }
    };
    sthdBox = class extends FullBox {
      constructor(..._args) {
        super(..._args);
        this.box_name = "SubtitleMediaHeaderBox";
      }
      static {
        this.fourcc = "sthd";
      }
    };
    stscBox = class extends FullBox {
      constructor(..._args) {
        super(..._args);
        this.box_name = "SampleToChunkBox";
      }
      static {
        this.fourcc = "stsc";
      }
      parse(stream) {
        this.parseFullHeader(stream);
        const entry_count = stream.readUint32();
        this.first_chunk = [];
        this.samples_per_chunk = [];
        this.sample_description_index = [];
        if (this.version === 0) for (let i = 0; i < entry_count; i++) {
          this.first_chunk.push(stream.readUint32());
          this.samples_per_chunk.push(stream.readUint32());
          this.sample_description_index.push(stream.readUint32());
        }
      }
      write(stream) {
        this.version = 0;
        this.flags = 0;
        this.size = 4 + 12 * this.first_chunk.length;
        this.writeHeader(stream);
        stream.writeUint32(this.first_chunk.length);
        for (let i = 0; i < this.first_chunk.length; i++) {
          stream.writeUint32(this.first_chunk[i]);
          stream.writeUint32(this.samples_per_chunk[i]);
          stream.writeUint32(this.sample_description_index[i]);
        }
      }
      unpack(samples) {
        let l = 0;
        let m = 0;
        for (let i = 0; i < this.first_chunk.length; i++) for (let j = 0; j < (i + 1 < this.first_chunk.length ? this.first_chunk[i + 1] : Infinity); j++) {
          m++;
          for (let k = 0; k < this.samples_per_chunk[i]; k++) {
            if (samples[l]) {
              samples[l].description_index = this.sample_description_index[i];
              samples[l].chunk_index = m;
            } else return;
            l++;
          }
        }
      }
    };
    stsdBox = class extends FullBox {
      constructor(..._args) {
        super(..._args);
        this.box_name = "SampleDescriptionBox";
      }
      static {
        this.fourcc = "stsd";
      }
      parse(stream) {
        this.parseFullHeader(stream);
        this.entries = [];
        const entryCount = stream.readUint32();
        for (let i = 1; i <= entryCount; i++) {
          const ret = parseOneBox(stream, true, this.size - (stream.getPosition() - this.start));
          if (ret.code === 1) {
            let box;
            if (ret.type in BoxRegistry.sampleEntry) {
              box = new BoxRegistry.sampleEntry[ret.type](ret.size);
              box.hdr_size = ret.hdr_size;
              box.start = ret.start;
            } else {
              Log.warn("BoxParser", `Unknown sample entry type: '${ret.type}'`);
              box = new SampleEntry(ret.size, ret.hdr_size, ret.start);
              box.type = ret.type;
            }
            if (box.write === SampleEntry.prototype.write) {
              Log.info("BoxParser", "SampleEntry " + box.type + " box writing not yet implemented, keeping unparsed data in memory for later write");
              box.parseDataAndRewind(stream);
            }
            box.parse(stream);
            this.entries.push(box);
          } else return;
        }
      }
      /** @bundle writing/stsd.js */
      write(stream) {
        this.version = 0;
        this.flags = 0;
        this.size = 0;
        this.writeHeader(stream);
        stream.writeUint32(this.entries.length);
        this.size += 4;
        for (let i = 0; i < this.entries.length; i++) {
          this.entries[i].write(stream);
          this.size += this.entries[i].size;
        }
        Log.debug("BoxWriter", "Adjusting box " + this.type + " with new size " + this.size);
        stream.adjustUint32(this.sizePosition, this.size);
      }
    };
    stszBox = class extends FullBox {
      constructor(..._args) {
        super(..._args);
        this.box_name = "SampleSizeBox";
      }
      static {
        this.fourcc = "stsz";
      }
      parse(stream) {
        this.parseFullHeader(stream);
        this.sample_sizes = [];
        if (this.version === 0) {
          this.sample_size = stream.readUint32();
          this.sample_count = stream.readUint32();
          for (let i = 0; i < this.sample_count; i++) if (this.sample_size === 0) this.sample_sizes.push(stream.readUint32());
          else this.sample_sizes[i] = this.sample_size;
        }
      }
      /** @bundle writing/stsz.js */
      write(stream) {
        let constant = true;
        this.version = 0;
        this.flags = 0;
        if (this.sample_sizes.length > 0 && this.sample_size === 0) constant = false;
        this.size = 8;
        if (!constant) this.size += 4 * this.sample_sizes.length;
        this.writeHeader(stream);
        stream.writeUint32(this.sample_size);
        stream.writeUint32(this.sample_sizes.length);
        if (!constant) stream.writeUint32Array(this.sample_sizes);
      }
      /** @bundle box-unpack.js */
      unpack(samples) {
        for (let i = 0; i < this.sample_sizes.length; i++) samples[i].size = this.sample_sizes[i];
      }
    };
    sttsBox = class extends FullBox {
      constructor(..._args) {
        super(..._args);
        this.box_name = "TimeToSampleBox";
        this.sample_counts = [];
        this.sample_deltas = [];
      }
      static {
        this.fourcc = "stts";
      }
      parse(stream) {
        this.parseFullHeader(stream);
        const entry_count = stream.readUint32();
        this.sample_counts.length = 0;
        this.sample_deltas.length = 0;
        if (this.version === 0) for (let i = 0; i < entry_count; i++) {
          this.sample_counts.push(stream.readUint32());
          let delta = stream.readInt32();
          if (delta < 0) {
            Log.warn("BoxParser", "File uses negative stts sample delta, using value 1 instead, sync may be lost!");
            delta = 1;
          }
          this.sample_deltas.push(delta);
        }
      }
      /** @bundle writing/stts.js */
      write(stream) {
        this.version = 0;
        this.flags = 0;
        this.size = 4 + 8 * this.sample_counts.length;
        this.writeHeader(stream);
        stream.writeUint32(this.sample_counts.length);
        for (let i = 0; i < this.sample_counts.length; i++) {
          stream.writeUint32(this.sample_counts[i]);
          stream.writeUint32(this.sample_deltas[i]);
        }
      }
      /** @bundle box-unpack.js */
      unpack(samples) {
        let k = 0;
        for (let i = 0; i < this.sample_counts.length; i++) for (let j = 0; j < this.sample_counts[i]; j++) {
          if (k === 0) samples[k].dts = 0;
          else samples[k].dts = samples[k - 1].dts + this.sample_deltas[i];
          k++;
        }
      }
    };
    tfdtBox = class extends FullBox {
      constructor(..._args) {
        super(..._args);
        this.box_name = "TrackFragmentBaseMediaDecodeTimeBox";
      }
      static {
        this.fourcc = "tfdt";
      }
      parse(stream) {
        this.parseFullHeader(stream);
        if (this.version === 1) this.baseMediaDecodeTime = stream.readUint64();
        else this.baseMediaDecodeTime = stream.readUint32();
      }
      /** @bundle writing/tdft.js */
      write(stream) {
        const useVersion1 = this.baseMediaDecodeTime > MAX_UINT32 || this.version === 1;
        this.version = useVersion1 ? 1 : 0;
        this.size = 4;
        this.size += useVersion1 ? 4 : 0;
        this.flags = 0;
        this.writeHeader(stream);
        if (useVersion1) stream.writeUint64(this.baseMediaDecodeTime);
        else stream.writeUint32(this.baseMediaDecodeTime);
      }
    };
    tfhdBox = class extends FullBox {
      constructor(..._args) {
        super(..._args);
        this.box_name = "TrackFragmentHeaderBox";
      }
      static {
        this.fourcc = "tfhd";
      }
      parse(stream) {
        this.parseFullHeader(stream);
        let readBytes = 0;
        this.track_id = stream.readUint32();
        if (this.size - this.hdr_size > readBytes && this.flags & 1) {
          this.base_data_offset = stream.readUint64();
          readBytes += 8;
        } else this.base_data_offset = 0;
        if (this.size - this.hdr_size > readBytes && this.flags & 2) {
          this.default_sample_description_index = stream.readUint32();
          readBytes += 4;
        } else this.default_sample_description_index = 0;
        if (this.size - this.hdr_size > readBytes && this.flags & 8) {
          this.default_sample_duration = stream.readUint32();
          readBytes += 4;
        } else this.default_sample_duration = 0;
        if (this.size - this.hdr_size > readBytes && this.flags & 16) {
          this.default_sample_size = stream.readUint32();
          readBytes += 4;
        } else this.default_sample_size = 0;
        if (this.size - this.hdr_size > readBytes && this.flags & 32) {
          this.default_sample_flags = stream.readUint32();
          readBytes += 4;
        } else this.default_sample_flags = 0;
      }
      /** @bundle writing/tfhd.js */
      write(stream) {
        this.version = 0;
        this.size = 4;
        if (this.flags & 1) this.size += 8;
        if (this.flags & 2) this.size += 4;
        if (this.flags & 8) this.size += 4;
        if (this.flags & 16) this.size += 4;
        if (this.flags & 32) this.size += 4;
        this.writeHeader(stream);
        stream.writeUint32(this.track_id);
        if (this.flags & 1) stream.writeUint64(this.base_data_offset);
        if (this.flags & 2) stream.writeUint32(this.default_sample_description_index);
        if (this.flags & 8) stream.writeUint32(this.default_sample_duration);
        if (this.flags & 16) stream.writeUint32(this.default_sample_size);
        if (this.flags & 32) stream.writeUint32(this.default_sample_flags);
      }
    };
    tkhdBox = class extends FullBox {
      constructor(..._args) {
        super(..._args);
        this.box_name = "TrackHeaderBox";
        this.layer = 0;
        this.alternate_group = 0;
      }
      static {
        this.fourcc = "tkhd";
      }
      parse(stream) {
        this.parseFullHeader(stream);
        if (this.version === 1) {
          this.creation_time = stream.readUint64();
          this.modification_time = stream.readUint64();
          this.track_id = stream.readUint32();
          stream.readUint32();
          this.duration = stream.readUint64();
        } else {
          this.creation_time = stream.readUint32();
          this.modification_time = stream.readUint32();
          this.track_id = stream.readUint32();
          stream.readUint32();
          this.duration = stream.readUint32();
        }
        stream.readUint32Array(2);
        this.layer = stream.readInt16();
        this.alternate_group = stream.readInt16();
        this.volume = stream.readInt16() >> 8;
        stream.readUint16();
        this.matrix = stream.readInt32Array(9);
        this.width = stream.readUint32();
        this.height = stream.readUint32();
      }
      write(stream) {
        const useVersion1 = this.modification_time > MAX_UINT32 || this.creation_time > MAX_UINT32 || this.duration > MAX_UINT32 || this.version === 1;
        this.version = useVersion1 ? 1 : 0;
        this.size = 80;
        this.size += useVersion1 ? 12 : 0;
        this.flags = this.flags ?? 3;
        this.writeHeader(stream);
        if (useVersion1) {
          stream.writeUint64(this.creation_time);
          stream.writeUint64(this.modification_time);
          stream.writeUint32(this.track_id);
          stream.writeUint32(0);
          stream.writeUint64(this.duration);
        } else {
          stream.writeUint32(this.creation_time);
          stream.writeUint32(this.modification_time);
          stream.writeUint32(this.track_id);
          stream.writeUint32(0);
          stream.writeUint32(this.duration);
        }
        stream.writeUint32Array([0, 0]);
        stream.writeInt16(this.layer);
        stream.writeInt16(this.alternate_group);
        stream.writeInt16(this.volume << 8);
        stream.writeInt16(0);
        stream.writeInt32Array(this.matrix);
        stream.writeUint32(this.width);
        stream.writeUint32(this.height);
      }
      /** @bundle box-print.js */
      print(output) {
        super.printHeader(output);
        output.log(output.indent + "creation_time: " + this.creation_time);
        output.log(output.indent + "modification_time: " + this.modification_time);
        output.log(output.indent + "track_id: " + this.track_id);
        output.log(output.indent + "duration: " + this.duration);
        output.log(output.indent + "volume: " + (this.volume >> 8));
        output.log(output.indent + "matrix: " + this.matrix.join(", "));
        output.log(output.indent + "layer: " + this.layer);
        output.log(output.indent + "alternate_group: " + this.alternate_group);
        output.log(output.indent + "width: " + this.width);
        output.log(output.indent + "height: " + this.height);
      }
    };
    trexBox = class extends FullBox {
      constructor(..._args) {
        super(..._args);
        this.box_name = "TrackExtendsBox";
      }
      static {
        this.fourcc = "trex";
      }
      parse(stream) {
        this.parseFullHeader(stream);
        this.track_id = stream.readUint32();
        this.default_sample_description_index = stream.readUint32();
        this.default_sample_duration = stream.readUint32();
        this.default_sample_size = stream.readUint32();
        this.default_sample_flags = stream.readUint32();
      }
      write(stream) {
        this.version = 0;
        this.flags = 0;
        this.size = 20;
        this.writeHeader(stream);
        stream.writeUint32(this.track_id);
        stream.writeUint32(this.default_sample_description_index);
        stream.writeUint32(this.default_sample_duration);
        stream.writeUint32(this.default_sample_size);
        stream.writeUint32(this.default_sample_flags);
      }
    };
    trunBox = class extends FullBox {
      constructor(..._args) {
        super(..._args);
        this.box_name = "TrackRunBox";
        this.sample_duration = [];
        this.sample_size = [];
        this.sample_flags = [];
        this.sample_composition_time_offset = [];
      }
      static {
        this.fourcc = "trun";
      }
      parse(stream) {
        this.parseFullHeader(stream);
        let readBytes = 0;
        this.sample_count = stream.readUint32();
        readBytes += 4;
        if (this.size - this.hdr_size > readBytes && this.flags & 1) {
          this.data_offset = stream.readInt32();
          readBytes += 4;
        } else this.data_offset = 0;
        if (this.size - this.hdr_size > readBytes && this.flags & 4) {
          this.first_sample_flags = stream.readUint32();
          readBytes += 4;
        } else this.first_sample_flags = 0;
        this.sample_duration = [];
        this.sample_size = [];
        this.sample_flags = [];
        this.sample_composition_time_offset = [];
        if (this.size - this.hdr_size > readBytes) for (let i = 0; i < this.sample_count; i++) {
          if (this.flags & 256) this.sample_duration[i] = stream.readUint32();
          if (this.flags & 512) this.sample_size[i] = stream.readUint32();
          if (this.flags & 1024) this.sample_flags[i] = stream.readUint32();
          if (this.flags & 2048) if (this.version === 0) this.sample_composition_time_offset[i] = stream.readUint32();
          else this.sample_composition_time_offset[i] = stream.readInt32();
        }
      }
      /** @bundle writing/trun.js */
      write(stream) {
        this.size = 4;
        if (this.flags & 1) this.size += 4;
        if (this.flags & 4) this.size += 4;
        if (this.flags & 256) this.size += 4 * this.sample_duration.length;
        if (this.flags & 512) this.size += 4 * this.sample_size.length;
        if (this.flags & 1024) this.size += 4 * this.sample_flags.length;
        if (this.flags & 2048) this.size += 4 * this.sample_composition_time_offset.length;
        this.writeHeader(stream);
        stream.writeUint32(this.sample_count);
        if (this.flags & 1) {
          this.data_offset_position = stream.getPosition();
          stream.writeInt32(this.data_offset);
        }
        if (this.flags & 4) stream.writeUint32(this.first_sample_flags);
        for (let i = 0; i < this.sample_count; i++) {
          if (this.flags & 256) stream.writeUint32(this.sample_duration[i]);
          if (this.flags & 512) stream.writeUint32(this.sample_size[i]);
          if (this.flags & 1024) stream.writeUint32(this.sample_flags[i]);
          if (this.flags & 2048) if (this.version === 0) stream.writeUint32(this.sample_composition_time_offset[i]);
          else stream.writeInt32(this.sample_composition_time_offset[i]);
        }
      }
    };
    urlBox = class extends FullBox {
      constructor(..._args) {
        super(..._args);
        this.box_name = "DataEntryUrlBox";
      }
      static {
        this.fourcc = "url ";
      }
      parse(stream) {
        this.parseFullHeader(stream);
        if (this.flags !== 1) this.location = stream.readCString();
      }
      /** @bundle writing/url.js */
      write(stream) {
        this.version = 0;
        if (this.location) {
          this.flags = 0;
          this.size = this.location.length + 1;
        } else {
          this.flags = 1;
          this.size = 0;
        }
        this.writeHeader(stream);
        if (this.location) stream.writeCString(this.location);
      }
    };
    vmhdBox = class extends FullBox {
      constructor(..._args) {
        super(..._args);
        this.box_name = "VideoMediaHeaderBox";
      }
      static {
        this.fourcc = "vmhd";
      }
      parse(stream) {
        this.parseFullHeader(stream);
        this.graphicsmode = stream.readUint16();
        this.opcolor = stream.readUint16Array(3);
      }
      /** @bundle writing/vmhd.js */
      write(stream) {
        this.version = 0;
        this.size = 8;
        this.writeHeader(stream);
        stream.writeUint16(this.graphicsmode);
        stream.writeUint16Array(this.opcolor);
      }
    };
    SampleGroupInfo = class {
      constructor(grouping_type, grouping_type_parameter, sbgp) {
        this.grouping_type = grouping_type;
        this.grouping_type_parameter = grouping_type_parameter;
        this.sbgp = sbgp;
        this.last_sample_in_run = -1;
        this.entry_index = -1;
      }
    };
    ISOFile = class ISOFile2 {
      constructor(stream, discardMdatData = true) {
        this.boxes = [];
        this.mdats = [];
        this.moofs = [];
        this.isProgressive = false;
        this.moovStartFound = false;
        this.moovStartSent = false;
        this.readySent = false;
        this.sampleListBuilt = false;
        this.fragmentedTracks = [];
        this.extractedTracks = [];
        this.isFragmentationInitialized = false;
        this.sampleProcessingStarted = false;
        this.nextMoofNumber = 0;
        this.itemListBuilt = false;
        this.sidxSent = false;
        this.items = [];
        this.entity_groups = [];
        this.itemsDataSize = 0;
        this.lastMoofIndex = 0;
        this.samplesDataSize = 0;
        this.lastBoxStartPosition = 0;
        this.nextParsePosition = 0;
        this.discardMdatData = true;
        this.discardMdatData = discardMdatData;
        if (stream) {
          this.stream = stream;
          this.parse();
        } else this.stream = new MultiBufferStream();
        this.stream.isofile = this;
      }
      setSegmentOptions(id, user, opts) {
        const { sizePerSegment = Number.MAX_SAFE_INTEGER, rapAlignement = true, normalizeAudioSampleEntriesForMSE = true } = opts;
        let nbSamples = opts.nbSamples ?? opts.nbSamplesPerFragment ?? 1e3;
        const nbSamplesPerFragment = opts.nbSamplesPerFragment ?? nbSamples;
        if (nbSamples <= 0 || nbSamplesPerFragment <= 0 || sizePerSegment <= 0) {
          Log.error("ISOFile", `Invalid segment options: nbSamples=${nbSamples}, nbSamplesPerFragment=${nbSamplesPerFragment}, sizePerSegment=${sizePerSegment}`);
          return;
        }
        if (nbSamples < nbSamplesPerFragment) {
          Log.warn("ISOFile", `nbSamples (${nbSamples}) is less than nbSamplesPerFragment (${nbSamplesPerFragment}), setting nbSamples to nbSamplesPerFragment`);
          nbSamples = nbSamplesPerFragment;
        }
        if (this.fragmentedTracks.some((track) => track.nb_samples !== nbSamples)) {
          Log.error("ISOFile", `Cannot set segment options for track ${id}: nbSamples (${nbSamples}) does not match existing tracks`);
          return;
        }
        const trak = this.getTrackById(id);
        if (trak) {
          const fragTrack = {
            id,
            user,
            trak,
            segmentStream: void 0,
            nb_samples: nbSamples,
            nb_samples_per_fragment: nbSamplesPerFragment,
            size_per_segment: sizePerSegment,
            rapAlignement,
            normalizeAudioSampleEntriesForMSE,
            state: {
              lastFragmentSampleNumber: 0,
              lastSegmentSampleNumber: 0,
              accumulatedSize: 0
            }
          };
          this.fragmentedTracks.push(fragTrack);
          trak.nextSample = 0;
        }
        if (this.discardMdatData) Log.warn("ISOFile", "Segmentation options set but discardMdatData is true, samples will not be segmented");
      }
      unsetSegmentOptions(id) {
        let index = -1;
        for (let i = 0; i < this.fragmentedTracks.length; i++) if (this.fragmentedTracks[i].id === id) index = i;
        if (index > -1) this.fragmentedTracks.splice(index, 1);
      }
      setExtractionOptions(id, user, { nbSamples: nb_samples = 1e3 } = {}) {
        const trak = this.getTrackById(id);
        if (trak) {
          this.extractedTracks.push({
            id,
            user,
            trak,
            nb_samples,
            samples: []
          });
          trak.nextSample = 0;
        }
        if (this.discardMdatData) Log.warn("ISOFile", "Extraction options set but discardMdatData is true, samples will not be extracted");
      }
      unsetExtractionOptions(id) {
        let index = -1;
        for (let i = 0; i < this.extractedTracks.length; i++) if (this.extractedTracks[i].id === id) index = i;
        if (index > -1) this.extractedTracks.splice(index, 1);
      }
      parse() {
        const parseBoxHeadersOnly = false;
        if (this.restoreParsePosition) {
          if (!this.restoreParsePosition()) return;
        }
        while (true) if (this.hasIncompleteMdat && this.hasIncompleteMdat()) if (this.processIncompleteMdat()) continue;
        else return;
        else {
          if (this.saveParsePosition) this.saveParsePosition();
          const ret = parseOneBox(this.stream, parseBoxHeadersOnly);
          if (ret.code === 0) if (this.processIncompleteBox) if (this.processIncompleteBox(ret)) continue;
          else return;
          else return;
          else if (ret.code === 1) {
            const box = ret.box;
            this.boxes.push(box);
            if (box.type === "uuid") {
              if (this[box.uuid] !== void 0) Log.warn("ISOFile", "Duplicate Box of uuid: " + box.uuid + ", overriding previous occurrence");
              this[box.uuid] = box;
            } else switch (box.type) {
              case "mdat":
                this.mdats.push(box);
                this.transferMdatData(box);
                break;
              case "moof":
                this.moofs.push(box);
                break;
              case "free":
              case "skip":
                break;
              case "moov":
                this.moovStartFound = true;
                if (this.mdats.length === 0) this.isProgressive = true;
              default:
                if (this[box.type] !== void 0) if (Array.isArray(this[box.type + "s"])) {
                  Log.info("ISOFile", `Found multiple boxes of type ${box.type} in ISOFile, adding to array`);
                  this[box.type + "s"].push(box);
                } else {
                  Log.warn("ISOFile", `Found multiple boxes of type ${box.type} but no array exists. Creating array dynamically.`);
                  this[box.type + "s"] = [this[box.type], box];
                }
                else {
                  this[box.type] = box;
                  if (Array.isArray(this[box.type + "s"])) this[box.type + "s"].push(box);
                }
                break;
            }
            if (this.updateUsedBytes) this.updateUsedBytes(box, ret);
          } else if (ret.code === -1) {
            Log.error("ISOFile", `Invalid data found while parsing box of type '${ret.type}' at position ${ret.start}. Aborting parsing.`, this);
            break;
          }
        }
      }
      checkBuffer(ab) {
        if (!ab) throw new Error("Buffer must be defined and non empty");
        if (ab.byteLength === 0) {
          Log.warn("ISOFile", "Ignoring empty buffer (fileStart: " + ab.fileStart + ")");
          this.stream.logBufferLevel();
          return false;
        }
        Log.info("ISOFile", "Processing buffer (fileStart: " + ab.fileStart + ")");
        ab.usedBytes = 0;
        this.stream.insertBuffer(ab);
        this.stream.logBufferLevel();
        if (!this.stream.initialized()) {
          Log.warn("ISOFile", "Not ready to start parsing");
          return false;
        }
        return true;
      }
      /**
      * Processes a new ArrayBuffer (with a fileStart property)
      * Returns the next expected file position, or undefined if not ready to parse
      */
      appendBuffer(ab, last) {
        let nextFileStart;
        if (!this.checkBuffer(ab)) return;
        this.parse();
        if (this.moovStartFound && !this.moovStartSent) {
          this.moovStartSent = true;
          if (this.onMoovStart) this.onMoovStart();
        }
        if (this.moov) {
          if (!this.sampleListBuilt) {
            this.buildSampleLists();
            this.sampleListBuilt = true;
          }
          this.updateSampleLists();
          if (this.onReady && !this.readySent) {
            this.readySent = true;
            this.onReady(this.getInfo());
          }
          this.processSamples(last);
          if (this.nextSeekPosition) {
            nextFileStart = this.nextSeekPosition;
            this.nextSeekPosition = void 0;
          } else nextFileStart = this.nextParsePosition;
          if (this.stream.getEndFilePositionAfter) nextFileStart = this.stream.getEndFilePositionAfter(nextFileStart);
        } else if (this.nextParsePosition) nextFileStart = this.nextParsePosition;
        else nextFileStart = 0;
        if (this.sidx) {
          if (this.onSidx && !this.sidxSent) {
            this.onSidx(this.sidx);
            this.sidxSent = true;
          }
        }
        if (this.meta) {
          if (this.flattenItemInfo && !this.itemListBuilt) {
            this.flattenItemInfo();
            this.itemListBuilt = true;
          }
          if (this.processItems) this.processItems(this.onItem);
        }
        if (this.stream.cleanBuffers) {
          Log.info("ISOFile", "Done processing buffer (fileStart: " + ab.fileStart + ") - next buffer to fetch should have a fileStart position of " + nextFileStart);
          this.stream.logBufferLevel();
          this.stream.cleanBuffers();
          this.stream.logBufferLevel(true);
          Log.info("ISOFile", "Sample data size in memory: " + this.getAllocatedSampleDataSize());
        }
        return nextFileStart;
      }
      getFragmentDuration() {
        const mvex = this.getBox("mvex");
        if (!mvex) return;
        if (mvex.mehd) return {
          num: mvex.mehd.fragment_duration,
          den: this.moov.mvhd.timescale
        };
        const traks = this.getBoxes("trak", false);
        let maximum = {
          num: 0,
          den: 1
        };
        for (const trak of traks) {
          const duration = trak.samples_duration;
          const timescale = trak.mdia.mdhd.timescale;
          if (duration && timescale) {
            if (duration / timescale > maximum.num / maximum.den) maximum = {
              num: duration,
              den: timescale
            };
          }
        }
        return maximum;
      }
      getInfo() {
        if (!this.moov) return {
          hasMoov: false,
          mime: ""
        };
        const _1904 = (/* @__PURE__ */ new Date("1904-01-01T00:00:00Z")).getTime();
        const isFragmented = this.getBox("mvex") !== void 0;
        const movie = {
          hasMoov: true,
          duration: this.moov.mvhd.duration,
          timescale: this.moov.mvhd.timescale,
          isFragmented,
          fragment_duration: this.getFragmentDuration(),
          isProgressive: this.isProgressive,
          hasIOD: this.moov.iods !== void 0,
          brands: [this.ftyp.major_brand].concat(this.ftyp.compatible_brands),
          created: new Date(_1904 + this.moov.mvhd.creation_time * 1e3),
          modified: new Date(_1904 + this.moov.mvhd.modification_time * 1e3),
          tracks: [],
          audioTracks: [],
          videoTracks: [],
          subtitleTracks: [],
          metadataTracks: [],
          hintTracks: [],
          otherTracks: [],
          mime: ""
        };
        for (let i = 0; i < this.moov.traks.length; i++) {
          const trak = this.moov.traks[i];
          const sample_desc = trak.mdia.minf.stbl.stsd.entries[0];
          const size = trak.samples_size;
          const track_timescale = trak.mdia.mdhd.timescale;
          const samples_duration = trak.samples_duration;
          const track = {
            samples_duration,
            bitrate: size * 8 * track_timescale / samples_duration,
            size,
            timescale: track_timescale,
            alternate_group: trak.tkhd.alternate_group,
            codec: sample_desc.getCodec(),
            created: new Date(_1904 + trak.tkhd.creation_time * 1e3),
            cts_shift: trak.mdia.minf.stbl.cslg,
            duration: trak.mdia.mdhd.duration,
            id: trak.tkhd.track_id,
            kind: trak.udta && trak.udta.kinds.length ? trak.udta.kinds[0] : {
              schemeURI: "",
              value: ""
            },
            language: trak.mdia.elng ? trak.mdia.elng.extended_language : trak.mdia.mdhd.languageString,
            layer: trak.tkhd.layer,
            matrix: trak.tkhd.matrix,
            modified: new Date(_1904 + trak.tkhd.modification_time * 1e3),
            movie_duration: trak.tkhd.duration,
            movie_timescale: movie.timescale,
            name: trak.mdia.hdlr.name,
            nb_samples: trak.samples.length,
            references: [],
            track_height: trak.tkhd.height / 65536,
            track_width: trak.tkhd.width / 65536,
            volume: trak.tkhd.volume
          };
          movie.tracks.push(track);
          if (trak.tref) for (let j = 0; j < trak.tref.references.length; j++) track.references.push({
            type: trak.tref.references[j].type,
            track_ids: trak.tref.references[j].track_ids
          });
          if (trak.edts !== void 0 && trak.edts.elst !== void 0) track.edits = trak.edts.elst.entries;
          if (sample_desc instanceof AudioSampleEntry) {
            track.type = "audio";
            movie.audioTracks.push(track);
            track.audio = {
              sample_rate: sample_desc.getSampleRate(),
              channel_count: sample_desc.getChannelCount(),
              sample_size: sample_desc.getSampleSize()
            };
          } else if (sample_desc instanceof VisualSampleEntry) {
            track.type = "video";
            movie.videoTracks.push(track);
            track.video = {
              width: sample_desc.getWidth(),
              height: sample_desc.getHeight()
            };
          } else if (sample_desc instanceof SubtitleSampleEntry) {
            track.type = "subtitles";
            movie.subtitleTracks.push(track);
          } else if (sample_desc instanceof HintSampleEntry) {
            track.type = "metadata";
            movie.hintTracks.push(track);
          } else if (sample_desc instanceof MetadataSampleEntry) {
            track.type = "metadata";
            movie.metadataTracks.push(track);
          } else {
            track.type = "metadata";
            movie.otherTracks.push(track);
          }
        }
        if (movie.videoTracks && movie.videoTracks.length > 0) movie.mime += 'video/mp4; codecs="';
        else if (movie.audioTracks && movie.audioTracks.length > 0) movie.mime += 'audio/mp4; codecs="';
        else movie.mime += 'application/mp4; codecs="';
        for (let i = 0; i < movie.tracks.length; i++) {
          if (i !== 0) movie.mime += ",";
          movie.mime += movie.tracks[i].codec;
        }
        movie.mime += '"; profiles="';
        movie.mime += this.ftyp.compatible_brands.join();
        movie.mime += '"';
        return movie;
      }
      setNextSeekPositionFromSample(sample) {
        if (!sample) return;
        if (this.nextSeekPosition) this.nextSeekPosition = Math.min(sample.offset + sample.alreadyRead, this.nextSeekPosition);
        else this.nextSeekPosition = sample.offset + sample.alreadyRead;
      }
      processSamples(last) {
        if (!this.sampleProcessingStarted) return;
        if (this.isFragmentationInitialized && this.onSegment !== void 0) {
          const consumedTracks = /* @__PURE__ */ new Set();
          while (consumedTracks.size < this.fragmentedTracks.length && this.fragmentedTracks.some((track) => track.trak.nextSample < track.trak.samples.length) && this.sampleProcessingStarted) for (const fragTrak of this.fragmentedTracks) {
            const trak = fragTrak.trak;
            if (!consumedTracks.has(fragTrak.id)) {
              const sample = trak.nextSample < trak.samples.length ? this.getSample(trak, trak.nextSample) : void 0;
              if (!sample) {
                this.setNextSeekPositionFromSample(trak.samples[trak.nextSample]);
                consumedTracks.add(fragTrak.id);
                continue;
              }
              fragTrak.state.accumulatedSize += sample.size;
              const sampleNum = trak.nextSample + 1;
              const isFragmentOverdue = sampleNum - fragTrak.state.lastFragmentSampleNumber > fragTrak.nb_samples_per_fragment;
              const isSegmentOverdue = sampleNum - fragTrak.state.lastSegmentSampleNumber > fragTrak.nb_samples;
              let isFragmentBoundary = isFragmentOverdue || sampleNum % fragTrak.nb_samples_per_fragment === 0;
              let isSegmentBoundary = isSegmentOverdue || sampleNum % fragTrak.nb_samples === 0;
              let isSizeBoundary = fragTrak.state.accumulatedSize >= fragTrak.size_per_segment;
              const isRAP = !fragTrak.rapAlignement || sample.is_sync;
              const isFlush = last || trak.nextSample + 1 >= trak.samples.length;
              if (isFlush && !isRAP) Log.warn("ISOFile", "Flushing track #" + fragTrak.id + " at sample #" + trak.nextSample + " which is not a RAP, this may lead to playback issues");
              isFragmentBoundary = isFragmentBoundary && isRAP;
              isSegmentBoundary = isSegmentBoundary && isRAP;
              isSizeBoundary = isSizeBoundary && isRAP;
              if (isFragmentBoundary || isSizeBoundary || isFlush) {
                if (isFragmentOverdue) Log.warn("ISOFile", "Fragment on track #" + fragTrak.id + " is overdue, creating it with samples [" + fragTrak.state.lastFragmentSampleNumber + ", " + trak.nextSample + "]");
                else Log.debug("ISOFile", "Creating media fragment on track #" + fragTrak.id + " for samples [" + fragTrak.state.lastFragmentSampleNumber + ", " + trak.nextSample + "]");
                const result = this.createFragment(fragTrak.id, fragTrak.state.lastFragmentSampleNumber, trak.nextSample, fragTrak.segmentStream);
                if (result) {
                  fragTrak.segmentStream = result;
                  fragTrak.state.lastFragmentSampleNumber = trak.nextSample + 1;
                } else {
                  consumedTracks.add(fragTrak.id);
                  continue;
                }
              }
              if (isSegmentBoundary || isSizeBoundary || isFlush) {
                if (isSegmentOverdue) Log.warn("ISOFile", "Segment on track #" + fragTrak.id + " is overdue, sending it with samples [" + Math.max(0, trak.nextSample - fragTrak.nb_samples) + ", " + (trak.nextSample - 1) + "]");
                else Log.info("ISOFile", "Sending fragmented data on track #" + fragTrak.id + " for samples [" + Math.max(0, trak.nextSample - fragTrak.nb_samples) + ", " + (trak.nextSample - 1) + "]");
                Log.info("ISOFile", "Sample data size in memory: " + this.getAllocatedSampleDataSize());
                if (this.onSegment) this.onSegment(fragTrak.id, fragTrak.user, fragTrak.segmentStream.buffer, trak.nextSample + 1, last || trak.nextSample + 1 >= trak.samples.length);
                fragTrak.segmentStream = void 0;
                fragTrak.state.accumulatedSize = 0;
                fragTrak.state.lastSegmentSampleNumber = trak.nextSample + 1;
              }
              trak.nextSample++;
            }
          }
        }
        if (this.onSamples !== void 0) for (let i = 0; i < this.extractedTracks.length; i++) {
          const extractTrak = this.extractedTracks[i];
          const trak = extractTrak.trak;
          while (trak.nextSample < trak.samples.length && this.sampleProcessingStarted) {
            Log.debug("ISOFile", "Exporting on track #" + extractTrak.id + " sample #" + trak.nextSample);
            const sample = this.getSample(trak, trak.nextSample);
            if (sample) {
              trak.nextSample++;
              extractTrak.samples.push(sample);
            } else {
              this.setNextSeekPositionFromSample(trak.samples[trak.nextSample]);
              break;
            }
            if (trak.nextSample % extractTrak.nb_samples === 0 || trak.nextSample >= trak.samples.length) {
              Log.debug("ISOFile", "Sending samples on track #" + extractTrak.id + " for sample " + trak.nextSample);
              if (this.onSamples) this.onSamples(extractTrak.id, extractTrak.user, extractTrak.samples);
              extractTrak.samples = [];
              if (extractTrak !== this.extractedTracks[i]) break;
            }
          }
        }
      }
      getBox(type) {
        const result = this.getBoxes(type, true);
        return result.length ? result[0] : void 0;
      }
      getBoxes(type, returnEarly) {
        const result = [];
        const sweep = (root) => {
          if (root instanceof Box && root.type && root.type === type) result.push(root);
          const inner = [];
          if (root["boxes"]) inner.push(...root.boxes);
          if (root["entries"]) inner.push(...root["entries"]);
          if (root["item_infos"]) inner.push(...root["item_infos"]);
          if (root["references"]) inner.push(...root["references"]);
          for (const box of inner) {
            if (result.length && returnEarly) return;
            sweep(box);
          }
        };
        sweep(this);
        return result;
      }
      getTrackSamplesInfo(track_id) {
        const track = this.getTrackById(track_id);
        if (track) return track.samples;
      }
      getTrackSample(track_id, number) {
        const track = this.getTrackById(track_id);
        return this.getSample(track, number);
      }
      releaseUsedSamples(id, sampleNum) {
        let size = 0;
        const trak = this.getTrackById(id);
        if (!trak.lastValidSample) trak.lastValidSample = 0;
        for (let i = trak.lastValidSample; i < sampleNum; i++) size += this.releaseSample(trak, i);
        Log.info("ISOFile", "Track #" + id + " released samples up to " + sampleNum + " (released size: " + size + ", remaining: " + this.samplesDataSize + ")");
        trak.lastValidSample = sampleNum;
      }
      start() {
        this.sampleProcessingStarted = true;
        this.processSamples(false);
      }
      stop() {
        this.sampleProcessingStarted = false;
      }
      flush() {
        Log.info("ISOFile", "Flushing remaining samples");
        this.updateSampleLists();
        this.processSamples(true);
        this.stream.cleanBuffers();
        this.stream.logBufferLevel(true);
      }
      seekTrack(time, useRap, trak) {
        let rap_seek_sample_num = 0;
        let seek_sample_num = 0;
        let timescale;
        if (trak.samples.length === 0) {
          Log.info("ISOFile", "No sample in track, cannot seek! Using time " + Log.getDurationString(0, 1) + " and offset: 0");
          return {
            offset: 0,
            time: 0
          };
        }
        for (let j = 0; j < trak.samples.length; j++) {
          const sample = trak.samples[j];
          if (j === 0) {
            seek_sample_num = 0;
            timescale = sample.timescale;
          } else if (sample.cts > time * sample.timescale) {
            seek_sample_num = j - 1;
            break;
          }
          if (useRap && sample.is_sync) rap_seek_sample_num = j;
        }
        if (useRap) seek_sample_num = rap_seek_sample_num;
        time = trak.samples[seek_sample_num].cts;
        trak.nextSample = seek_sample_num;
        this.resetFragmentedTrackStateAfterSeek(trak, seek_sample_num);
        this.resetExtractedTrackStateAfterSeek(trak);
        while (trak.samples[seek_sample_num].alreadyRead === trak.samples[seek_sample_num].size) {
          if (!trak.samples[seek_sample_num + 1]) break;
          seek_sample_num++;
        }
        const seek_offset = trak.samples[seek_sample_num].offset + trak.samples[seek_sample_num].alreadyRead;
        Log.info("ISOFile", "Seeking to " + (useRap ? "RAP" : "") + " sample #" + trak.nextSample + " on track " + trak.tkhd.track_id + ", time " + Log.getDurationString(time, timescale) + " and offset: " + seek_offset);
        return {
          offset: seek_offset,
          time: time / timescale
        };
      }
      resetFragmentedTrackStateAfterSeek(trak, seekSampleNumber) {
        const fragTrack = this.fragmentedTracks.find((t) => t.trak === trak);
        if (!fragTrack) return;
        fragTrack.state.lastFragmentSampleNumber = seekSampleNumber;
        fragTrack.state.lastSegmentSampleNumber = seekSampleNumber;
        fragTrack.state.accumulatedSize = 0;
        fragTrack.segmentStream = void 0;
      }
      resetExtractedTrackStateAfterSeek(trak) {
        const extractTrack = this.extractedTracks.find((t) => t.trak === trak);
        if (!extractTrack) return;
        extractTrack.samples = [];
      }
      getTrackDuration(trak) {
        if (!trak.samples) return Infinity;
        const sample = trak.samples[trak.samples.length - 1];
        return (sample.cts + sample.duration) / sample.timescale;
      }
      seek(time, useRap) {
        const moov = this.moov;
        let seek_info = {
          offset: Infinity,
          time: Infinity
        };
        if (!this.moov) throw new Error("Cannot seek: moov not received!");
        else {
          for (let i = 0; i < moov.traks.length; i++) {
            const trak = moov.traks[i];
            if (time > this.getTrackDuration(trak)) continue;
            const trak_seek_info = this.seekTrack(time, useRap, trak);
            if (trak_seek_info.offset < seek_info.offset) seek_info.offset = trak_seek_info.offset;
            if (trak_seek_info.time < seek_info.time) seek_info.time = trak_seek_info.time;
          }
          Log.info("ISOFile", "Seeking at time " + Log.getDurationString(seek_info.time, 1) + " needs a buffer with a fileStart position of " + seek_info.offset);
          if (seek_info.offset === Infinity) seek_info = {
            offset: this.nextParsePosition,
            time: 0
          };
          else seek_info.offset = this.stream.getEndFilePositionAfter(seek_info.offset);
          Log.info("ISOFile", "Adjusted seek position (after checking data already in buffer): " + seek_info.offset);
          return seek_info;
        }
      }
      equal(b) {
        let box_index = 0;
        while (box_index < this.boxes.length && box_index < b.boxes.length) {
          const a_box = this.boxes[box_index];
          const b_box = b.boxes[box_index];
          if (!boxEqual(a_box, b_box)) return false;
          box_index++;
        }
        return true;
      }
      /**
      * Rewrite the entire file
      * @bundle isofile-write.js
      */
      write(outstream) {
        for (let i = 0; i < this.boxes.length; i++) this.boxes[i].write(outstream);
      }
      /** @bundle isofile-write.js */
      createFragment(track_id, sampleStart, sampleEnd, existingStream) {
        if (sampleEnd < sampleStart) {
          Log.warn("ISOFile", `Skipping fragment creation on track #${track_id}: invalid sample range [${sampleStart}, ${sampleEnd}]`);
          return existingStream || new DataStream();
        }
        const samples = [];
        for (let i = sampleStart; i <= sampleEnd; i++) {
          const trak = this.getTrackById(track_id);
          const sample = this.getSample(trak, i);
          if (!sample) {
            this.setNextSeekPositionFromSample(trak.samples[i]);
            return;
          }
          samples.push(sample);
        }
        const stream = existingStream || new DataStream();
        const moof = this.createMoof(samples);
        moof.write(stream);
        moof.trafs[0].truns[0].data_offset = moof.size + 8;
        Log.debug("MP4Box", "Adjusting data_offset with new value " + moof.trafs[0].truns[0].data_offset);
        stream.adjustUint32(moof.trafs[0].truns[0].data_offset_position, moof.trafs[0].truns[0].data_offset);
        const mdat = new mdatBox();
        mdat.stream = new MultiBufferStream();
        let offset = 0;
        for (const sample of samples) if (sample.data) {
          const mp4Buffer = MP4BoxBuffer.fromArrayBuffer(sample.data.buffer, offset);
          mdat.stream.insertBuffer(mp4Buffer);
          offset += sample.data.byteLength;
        }
        mdat.write(stream);
        return stream;
      }
      /**
      * Modify the file and create the initialization segment
      * @bundle isofile-write.js
      */
      static writeInitializationSegment(ftyp, moov, total_duration, normalizeAudioSampleEntryTrackIds) {
        Log.debug("ISOFile", "Generating initialization segment");
        const stream = new DataStream();
        ftyp.write(stream);
        const restoreCallbacks = ISOFile2.normalizeAudioSampleEntriesForMSEFragmentedInit(moov.traks, normalizeAudioSampleEntryTrackIds);
        try {
          const mvex = moov.addBox(new mvexBox());
          if (total_duration) {
            const mehd = mvex.addBox(new mehdBox());
            mehd.fragment_duration = total_duration;
          }
          for (let i = 0; i < moov.traks.length; i++) {
            const trex = mvex.addBox(new trexBox());
            trex.track_id = moov.traks[i].tkhd.track_id;
            trex.default_sample_description_index = 1;
            trex.default_sample_duration = moov.traks[i].samples[0]?.duration ?? 0;
            trex.default_sample_size = 0;
            trex.default_sample_flags = 65536;
          }
          moov.write(stream);
        } finally {
          for (let i = restoreCallbacks.length - 1; i >= 0; i--) restoreCallbacks[i]();
        }
        return stream.buffer;
      }
      /** @bundle isofile-write.js */
      save(name) {
        const stream = new DataStream();
        stream.isofile = this;
        this.write(stream);
        return stream.save(name);
      }
      /** @bundle isofile-write.js */
      getBuffer() {
        const stream = new DataStream();
        stream.isofile = this;
        this.write(stream);
        return stream;
      }
      /** @bundle isofile-write.js */
      static normalizeAudioSampleEntriesForMSEFragmentedInit(traks, normalizeAudioSampleEntryTrackIds) {
        const restoreCallbacks = [];
        for (const trak of traks) {
          if (!normalizeAudioSampleEntryTrackIds?.has(trak.tkhd.track_id)) continue;
          for (const sampleEntry of trak.mdia.minf.stbl.stsd?.entries ?? []) {
            if (!(sampleEntry instanceof mp4aSampleEntry)) continue;
            const esds = sampleEntry.wave?.esds;
            if (sampleEntry.esds || !esds) continue;
            const previousEsds = sampleEntry.esds;
            const previousWave = sampleEntry.wave;
            const previousBoxes = sampleEntry.boxes;
            restoreCallbacks.push(() => {
              sampleEntry.esds = previousEsds;
              sampleEntry.wave = previousWave;
              sampleEntry.boxes = previousBoxes;
            });
            const boxesWithoutWave = Array.isArray(sampleEntry.boxes) ? sampleEntry.boxes.filter((box) => box?.type !== "wave" && box?.type !== "esds") : [];
            sampleEntry.esds = esds;
            sampleEntry.boxes = [...boxesWithoutWave, esds];
            sampleEntry.wave = void 0;
          }
        }
        return restoreCallbacks;
      }
      initializeSegmentation(mode) {
        if (!this.onSegment) Log.warn("MP4Box", "No segmentation callback set!");
        if (mode !== void 0 && mode !== "combined" && mode !== "per-track") throw new Error(`Invalid segmentation mode: ${mode}`);
        if (!this.isFragmentationInitialized) {
          this.isFragmentationInitialized = true;
          this.resetTables();
        }
        const tracksToInitialize = [];
        for (const fragmentedTrack of this.fragmentedTracks) {
          const trak = this.getTrackById(fragmentedTrack.id);
          if (!trak) {
            Log.warn("ISOFile", `Track with id ${fragmentedTrack.id} not found, skipping fragmentation initialization`);
            continue;
          }
          tracksToInitialize.push({
            id: fragmentedTrack.id,
            user: fragmentedTrack.user,
            trak
          });
        }
        const fragmentDuration = this.moov?.mvex?.mehd?.fragment_duration;
        const normalizeAudioSampleEntryTrackIds = new Set(this.fragmentedTracks.filter((track) => track.normalizeAudioSampleEntriesForMSE !== false).map((track) => track.id));
        if (mode === "per-track") return tracksToInitialize.map(({ id, user, trak }) => {
          const moov2 = new moovBox();
          moov2.addBox(this.moov.mvhd);
          moov2.addBox(trak);
          return {
            id,
            user,
            buffer: ISOFile2.writeInitializationSegment(this.ftyp, moov2, fragmentDuration, normalizeAudioSampleEntryTrackIds)
          };
        });
        const moov = new moovBox();
        moov.addBox(this.moov.mvhd);
        for (const track of tracksToInitialize) moov.addBox(track.trak);
        return {
          tracks: tracksToInitialize.map(({ id, user }) => ({
            id,
            user
          })),
          buffer: ISOFile2.writeInitializationSegment(this.ftyp, moov, fragmentDuration, normalizeAudioSampleEntryTrackIds)
        };
      }
      /**
      * Resets all sample tables
      * @bundle isofile-sample-processing.js
      */
      resetTables() {
        this.initial_duration = this.moov.mvhd.duration;
        this.moov.mvhd.duration = 0;
        for (let i = 0; i < this.moov.traks.length; i++) {
          const trak = this.moov.traks[i];
          trak.tkhd.duration = 0;
          trak.mdia.mdhd.duration = 0;
          const stco = trak.mdia.minf.stbl.stco || trak.mdia.minf.stbl.co64;
          stco.chunk_offsets = [];
          const stsc = trak.mdia.minf.stbl.stsc;
          stsc.first_chunk = [];
          stsc.samples_per_chunk = [];
          stsc.sample_description_index = [];
          const stsz = trak.mdia.minf.stbl.stsz || trak.mdia.minf.stbl.stz2;
          stsz.sample_sizes = [];
          const stts = trak.mdia.minf.stbl.stts;
          stts.sample_counts = [];
          stts.sample_deltas = [];
          const ctts = trak.mdia.minf.stbl.ctts;
          if (ctts) {
            ctts.sample_counts = [];
            ctts.sample_offsets = [];
          }
          const stss = trak.mdia.minf.stbl.stss;
          const k = trak.mdia.minf.stbl.boxes.indexOf(stss);
          if (k !== -1) trak.mdia.minf.stbl.boxes[k] = void 0;
        }
      }
      /** @bundle isofile-sample-processing.js */
      static initSampleGroups(trak, traf, sbgps, trak_sgpds, traf_sgpds) {
        if (traf) traf.sample_groups_info = [];
        if (!trak.sample_groups_info) trak.sample_groups_info = [];
        for (let k = 0; k < sbgps.length; k++) {
          const sample_group_key = sbgps[k].grouping_type + "/" + sbgps[k].grouping_type_parameter;
          const sample_group_info = new SampleGroupInfo(sbgps[k].grouping_type, sbgps[k].grouping_type_parameter, sbgps[k]);
          if (traf) traf.sample_groups_info[sample_group_key] = sample_group_info;
          if (!trak.sample_groups_info[sample_group_key]) trak.sample_groups_info[sample_group_key] = sample_group_info;
          for (let l = 0; l < trak_sgpds.length; l++) if (trak_sgpds[l].grouping_type === sbgps[k].grouping_type) {
            sample_group_info.description = trak_sgpds[l];
            sample_group_info.description.used = true;
          }
          if (traf_sgpds) {
            for (let l = 0; l < traf_sgpds.length; l++) if (traf_sgpds[l].grouping_type === sbgps[k].grouping_type) {
              sample_group_info.fragment_description = traf_sgpds[l];
              sample_group_info.fragment_description.used = true;
              sample_group_info.is_fragment = true;
            }
          }
        }
        if (!traf) {
          for (let k = 0; k < trak_sgpds.length; k++) if (!trak_sgpds[k].used && trak_sgpds[k].version >= 2) {
            const sample_group_key = trak_sgpds[k].grouping_type + "/0";
            const sample_group_info = new SampleGroupInfo(trak_sgpds[k].grouping_type, 0);
            if (!trak.sample_groups_info[sample_group_key]) trak.sample_groups_info[sample_group_key] = sample_group_info;
          }
        } else if (traf_sgpds) {
          for (let k = 0; k < traf_sgpds.length; k++) if (!traf_sgpds[k].used && traf_sgpds[k].version >= 2) {
            const sample_group_key = traf_sgpds[k].grouping_type + "/0";
            const sample_group_info = new SampleGroupInfo(traf_sgpds[k].grouping_type, 0);
            sample_group_info.is_fragment = true;
            if (!traf.sample_groups_info[sample_group_key]) traf.sample_groups_info[sample_group_key] = sample_group_info;
          }
        }
      }
      /** @bundle isofile-sample-processing.js */
      static setSampleGroupProperties(trak, sample, sample_number, sample_groups_info) {
        sample.sample_groups = [];
        for (const k in sample_groups_info) {
          sample.sample_groups[k] = {
            grouping_type: sample_groups_info[k].grouping_type,
            grouping_type_parameter: sample_groups_info[k].grouping_type_parameter
          };
          if (sample_number >= sample_groups_info[k].last_sample_in_run) {
            if (sample_groups_info[k].last_sample_in_run < 0) sample_groups_info[k].last_sample_in_run = 0;
            sample_groups_info[k].entry_index++;
            if (sample_groups_info[k].entry_index <= sample_groups_info[k].sbgp.entries.length - 1) sample_groups_info[k].last_sample_in_run += sample_groups_info[k].sbgp.entries[sample_groups_info[k].entry_index].sample_count;
          }
          if (sample_groups_info[k].entry_index <= sample_groups_info[k].sbgp.entries.length - 1) sample.sample_groups[k].group_description_index = sample_groups_info[k].sbgp.entries[sample_groups_info[k].entry_index].group_description_index;
          else sample.sample_groups[k].group_description_index = -1;
          if (sample.sample_groups[k].group_description_index !== 0) {
            let description;
            if (sample_groups_info[k].fragment_description) description = sample_groups_info[k].fragment_description;
            else description = sample_groups_info[k].description;
            if (sample.sample_groups[k].group_description_index > 0) {
              let index;
              if (sample.sample_groups[k].group_description_index > 65535) index = (sample.sample_groups[k].group_description_index >> 16) - 1;
              else index = sample.sample_groups[k].group_description_index - 1;
              if (description && index >= 0) sample.sample_groups[k].description = description.entries[index];
            } else if (description && description.version >= 2) {
              if (description.default_group_description_index > 0) sample.sample_groups[k].description = description.entries[description.default_group_description_index - 1];
            }
          }
        }
      }
      /** @bundle isofile-sample-processing.js */
      static process_sdtp(sdtp, sample, number) {
        if (!sample) return;
        if (sdtp) {
          sample.is_leading = sdtp.is_leading[number];
          sample.depends_on = sdtp.sample_depends_on[number];
          sample.is_depended_on = sdtp.sample_is_depended_on[number];
          sample.has_redundancy = sdtp.sample_has_redundancy[number];
        } else {
          sample.is_leading = 0;
          sample.depends_on = 0;
          sample.is_depended_on = 0;
          sample.has_redundancy = 0;
        }
      }
      buildSampleLists() {
        for (let i = 0; i < this.moov.traks.length; i++) this.buildTrakSampleLists(this.moov.traks[i]);
      }
      buildTrakSampleLists(trak) {
        let j;
        let chunk_run_index;
        let chunk_index;
        let last_chunk_in_run;
        let offset_in_chunk;
        let last_sample_in_chunk;
        trak.samples = [];
        trak.samples_duration = 0;
        trak.samples_size = 0;
        const stco = trak.mdia.minf.stbl.stco || trak.mdia.minf.stbl.co64;
        const stsc = trak.mdia.minf.stbl.stsc;
        const stsz = trak.mdia.minf.stbl.stsz || trak.mdia.minf.stbl.stz2;
        const stts = trak.mdia.minf.stbl.stts;
        const ctts = trak.mdia.minf.stbl.ctts;
        const stss = trak.mdia.minf.stbl.stss;
        const stsd = trak.mdia.minf.stbl.stsd;
        const subs = trak.mdia.minf.stbl.subs;
        const stdp = trak.mdia.minf.stbl.stdp;
        const sbgps = trak.mdia.minf.stbl.sbgps;
        const sgpds = trak.mdia.minf.stbl.sgpds;
        let last_sample_in_stts_run = -1;
        let stts_run_index = -1;
        let last_sample_in_ctts_run = -1;
        let ctts_run_index = -1;
        let last_stss_index = 0;
        let subs_entry_index = 0;
        let last_subs_sample_index = 0;
        ISOFile2.initSampleGroups(trak, void 0, sbgps, sgpds);
        if (typeof stsz === "undefined") return;
        for (j = 0; j < stsz.sample_sizes.length; j++) {
          const sample = {
            number: j,
            track_id: trak.tkhd.track_id,
            timescale: trak.mdia.mdhd.timescale,
            alreadyRead: 0,
            size: stsz.sample_sizes[j]
          };
          trak.samples[j] = sample;
          trak.samples_size += sample.size;
          if (j === 0) {
            chunk_index = 1;
            chunk_run_index = 0;
            sample.chunk_index = chunk_index;
            sample.chunk_run_index = chunk_run_index;
            last_sample_in_chunk = stsc.samples_per_chunk[chunk_run_index];
            offset_in_chunk = 0;
            if (chunk_run_index + 1 < stsc.first_chunk.length) last_chunk_in_run = stsc.first_chunk[chunk_run_index + 1] - 1;
            else last_chunk_in_run = Infinity;
          } else if (j < last_sample_in_chunk) {
            sample.chunk_index = chunk_index;
            sample.chunk_run_index = chunk_run_index;
          } else {
            chunk_index++;
            sample.chunk_index = chunk_index;
            offset_in_chunk = 0;
            if (chunk_index <= last_chunk_in_run) {
            } else {
              chunk_run_index++;
              if (chunk_run_index + 1 < stsc.first_chunk.length) last_chunk_in_run = stsc.first_chunk[chunk_run_index + 1] - 1;
              else last_chunk_in_run = Infinity;
            }
            sample.chunk_run_index = chunk_run_index;
            last_sample_in_chunk += stsc.samples_per_chunk[chunk_run_index];
          }
          sample.description_index = stsc.sample_description_index[sample.chunk_run_index] - 1;
          sample.description = stsd.entries[sample.description_index];
          sample.offset = stco.chunk_offsets[sample.chunk_index - 1] + offset_in_chunk;
          offset_in_chunk += sample.size;
          if (j > last_sample_in_stts_run) {
            stts_run_index++;
            if (last_sample_in_stts_run < 0) last_sample_in_stts_run = 0;
            last_sample_in_stts_run += stts.sample_counts[stts_run_index];
          }
          if (j > 0) {
            trak.samples[j - 1].duration = stts.sample_deltas[stts_run_index];
            trak.samples_duration += trak.samples[j - 1].duration;
            sample.dts = trak.samples[j - 1].dts + trak.samples[j - 1].duration;
          } else sample.dts = 0;
          if (ctts) {
            if (j >= last_sample_in_ctts_run) {
              ctts_run_index++;
              if (last_sample_in_ctts_run < 0) last_sample_in_ctts_run = 0;
              last_sample_in_ctts_run += ctts.sample_counts[ctts_run_index];
            }
            sample.cts = trak.samples[j].dts + ctts.sample_offsets[ctts_run_index];
          } else sample.cts = sample.dts;
          if (stss) {
            if (j === stss.sample_numbers[last_stss_index] - 1) {
              sample.is_sync = true;
              last_stss_index++;
            } else {
              sample.is_sync = false;
              sample.degradation_priority = 0;
            }
            if (subs) {
              if (subs.entries[subs_entry_index].sample_delta + last_subs_sample_index === j + 1) {
                sample.subsamples = subs.entries[subs_entry_index].subsamples;
                last_subs_sample_index += subs.entries[subs_entry_index].sample_delta;
                subs_entry_index++;
              }
            }
          } else sample.is_sync = true;
          ISOFile2.process_sdtp(trak.mdia.minf.stbl.sdtp, sample, sample.number);
          if (stdp) sample.degradation_priority = stdp.priority[j];
          else sample.degradation_priority = 0;
          if (subs) {
            if (subs.entries[subs_entry_index].sample_delta + last_subs_sample_index === j) {
              sample.subsamples = subs.entries[subs_entry_index].subsamples;
              last_subs_sample_index += subs.entries[subs_entry_index].sample_delta;
            }
          }
          if (sbgps.length > 0 || sgpds.length > 0) ISOFile2.setSampleGroupProperties(trak, sample, j, trak.sample_groups_info);
        }
        if (j > 0) {
          trak.samples[j - 1].duration = Math.max(trak.mdia.mdhd.duration - trak.samples[j - 1].dts, 0);
          trak.samples_duration += trak.samples[j - 1].duration;
        }
      }
      /**
      * Update sample list when new 'moof' boxes are received
      * @bundle isofile-sample-processing.js
      */
      updateSampleLists() {
        let default_sample_description_index;
        let default_sample_duration;
        let default_sample_size;
        let default_sample_flags;
        let last_run_position;
        if (this.moov === void 0) return;
        while (this.lastMoofIndex < this.moofs.length) {
          const box = this.moofs[this.lastMoofIndex];
          this.lastMoofIndex++;
          if (box.type === "moof") {
            const moof = box;
            for (let i = 0; i < moof.trafs.length; i++) {
              const traf = moof.trafs[i];
              const trak = this.getTrackById(traf.tfhd.track_id);
              const trex = this.getTrexById(traf.tfhd.track_id);
              if (traf.tfhd.flags & 2) default_sample_description_index = traf.tfhd.default_sample_description_index;
              else default_sample_description_index = trex ? trex.default_sample_description_index : 1;
              if (traf.tfhd.flags & 8) default_sample_duration = traf.tfhd.default_sample_duration;
              else default_sample_duration = trex ? trex.default_sample_duration : 0;
              if (traf.tfhd.flags & 16) default_sample_size = traf.tfhd.default_sample_size;
              else default_sample_size = trex ? trex.default_sample_size : 0;
              if (traf.tfhd.flags & 32) default_sample_flags = traf.tfhd.default_sample_flags;
              else default_sample_flags = trex ? trex.default_sample_flags : 0;
              traf.sample_number = 0;
              if (traf.sbgps.length > 0) ISOFile2.initSampleGroups(trak, traf, traf.sbgps, trak.mdia.minf.stbl.sgpds, traf.sgpds);
              for (let j = 0; j < traf.truns.length; j++) {
                const trun = traf.truns[j];
                for (let k = 0; k < trun.sample_count; k++) {
                  const description_index = default_sample_description_index - 1;
                  let sample_flags = default_sample_flags;
                  if (trun.flags & 1024) sample_flags = trun.sample_flags[k];
                  else if (k === 0 && trun.flags & 4) sample_flags = trun.first_sample_flags;
                  let size = default_sample_size;
                  if (trun.flags & 512) size = trun.sample_size[k];
                  trak.samples_size += size;
                  let duration = default_sample_duration;
                  if (trun.flags & 256) duration = trun.sample_duration[k];
                  trak.samples_duration += duration;
                  let dts;
                  if (trak.first_traf_merged || k > 0) dts = trak.samples[trak.samples.length - 1].dts + trak.samples[trak.samples.length - 1].duration;
                  else {
                    if (traf.tfdt) dts = traf.tfdt.baseMediaDecodeTime;
                    else dts = 0;
                    trak.first_traf_merged = true;
                  }
                  let cts = dts;
                  if (trun.flags & 2048) cts = dts + trun.sample_composition_time_offset[k];
                  const bdop = traf.tfhd.flags & 1 ? true : false;
                  const dbim = traf.tfhd.flags & 131072 ? true : false;
                  const dop = trun.flags & 1 ? true : false;
                  let bdo = 0;
                  if (!bdop) if (!dbim) if (j === 0) bdo = moof.start;
                  else bdo = last_run_position;
                  else bdo = moof.start;
                  else bdo = traf.tfhd.base_data_offset;
                  let offset;
                  if (j === 0 && k === 0) if (dop) offset = bdo + trun.data_offset;
                  else offset = bdo;
                  else offset = last_run_position;
                  last_run_position = offset + size;
                  const number_in_traf = traf.sample_number;
                  traf.sample_number++;
                  const sample = {
                    cts,
                    description_index,
                    description: trak.mdia.minf.stbl.stsd.entries[description_index],
                    dts,
                    duration,
                    moof_number: this.lastMoofIndex,
                    number_in_traf,
                    number: trak.samples.length,
                    offset,
                    size,
                    timescale: trak.mdia.mdhd.timescale,
                    track_id: trak.tkhd.track_id,
                    is_sync: sample_flags >> 16 & 1 ? false : true,
                    is_leading: sample_flags >> 26 & 3,
                    depends_on: sample_flags >> 24 & 3,
                    is_depended_on: sample_flags >> 22 & 3,
                    has_redundancy: sample_flags >> 20 & 3,
                    degradation_priority: sample_flags & 65535
                  };
                  traf.first_sample_index = trak.samples.length;
                  trak.samples.push(sample);
                  if (traf.sbgps.length > 0 || traf.sgpds.length > 0 || trak.mdia.minf.stbl.sbgps.length > 0 || trak.mdia.minf.stbl.sgpds.length > 0) ISOFile2.setSampleGroupProperties(trak, sample, sample.number_in_traf, traf.sample_groups_info);
                }
              }
              if (traf.subs) {
                trak.has_fragment_subsamples = true;
                let sample_index = traf.first_sample_index;
                for (let j = 0; j < traf.subs.entries.length; j++) {
                  sample_index += traf.subs.entries[j].sample_delta;
                  const sample = trak.samples[sample_index - 1];
                  sample.subsamples = traf.subs.entries[j].subsamples;
                }
              }
            }
          }
        }
      }
      /**
      * Try to get sample data for a given sample:
      * returns null if not found
      * returns the same sample if already requested
      *
      * @bundle isofile-sample-processing.js
      */
      getSample(trak, sampleNum) {
        const sample = trak.samples[sampleNum];
        if (!this.moov) return;
        if (!sample.data) {
          sample.data = new Uint8Array(sample.size);
          sample.alreadyRead = 0;
          this.samplesDataSize += sample.size;
          Log.debug("ISOFile", "Allocating sample #" + sampleNum + " on track #" + trak.tkhd.track_id + " of size " + sample.size + " (total: " + this.samplesDataSize + ")");
        } else if (sample.alreadyRead === sample.size) return sample;
        while (true) {
          let stream = this.stream;
          let index = stream.findPosition(true, sample.offset + sample.alreadyRead, false);
          let buffer;
          let fileStart;
          if (index > -1) {
            buffer = stream.buffers[index];
            fileStart = buffer.fileStart;
          } else for (const mdat of this.mdats) {
            if (!mdat.stream) {
              Log.debug("ISOFile", "mdat stream not yet fully read for #" + this.mdats.indexOf(mdat) + " mdat");
              continue;
            }
            index = mdat.stream.findPosition(true, sample.offset + sample.alreadyRead - mdat.start - mdat.hdr_size, false);
            if (index > -1) {
              stream = mdat.stream;
              buffer = mdat.stream.buffers[index];
              fileStart = mdat.start + mdat.hdr_size + buffer.fileStart;
              break;
            }
          }
          if (buffer) {
            const lengthAfterStart = buffer.byteLength - (sample.offset + sample.alreadyRead - fileStart);
            if (sample.size - sample.alreadyRead <= lengthAfterStart) {
              Log.debug("ISOFile", "Getting sample #" + sampleNum + " data (alreadyRead: " + sample.alreadyRead + " offset: " + (sample.offset + sample.alreadyRead - fileStart) + " read size: " + (sample.size - sample.alreadyRead) + " full size: " + sample.size + ")");
              DataStream.memcpy(sample.data.buffer, sample.alreadyRead, buffer, sample.offset + sample.alreadyRead - fileStart, sample.size - sample.alreadyRead);
              buffer.usedBytes += sample.size - sample.alreadyRead;
              stream.logBufferLevel();
              sample.alreadyRead = sample.size;
              return sample;
            } else {
              if (lengthAfterStart === 0) return;
              Log.debug("ISOFile", "Getting sample #" + sampleNum + " partial data (alreadyRead: " + sample.alreadyRead + " offset: " + (sample.offset + sample.alreadyRead - fileStart) + " read size: " + lengthAfterStart + " full size: " + sample.size + ")");
              DataStream.memcpy(sample.data.buffer, sample.alreadyRead, buffer, sample.offset + sample.alreadyRead - fileStart, lengthAfterStart);
              sample.alreadyRead += lengthAfterStart;
              buffer.usedBytes += lengthAfterStart;
              stream.logBufferLevel();
            }
          } else return;
        }
      }
      /**
      * Release the memory used to store the data of the sample
      *
      * @bundle isofile-sample-processing.js
      */
      releaseSample(trak, sampleNum) {
        const sample = trak.samples[sampleNum];
        if (sample.data) {
          this.samplesDataSize -= sample.size;
          sample.data = void 0;
          sample.alreadyRead = 0;
          return sample.size;
        } else return 0;
      }
      /** @bundle isofile-sample-processing.js */
      getAllocatedSampleDataSize() {
        return this.samplesDataSize;
      }
      /**
      * Builds the MIME Type 'codecs' sub-parameters for the whole file
      *
      * @bundle isofile-sample-processing.js
      */
      getCodecs() {
        let codecs = "";
        for (let i = 0; i < this.moov.traks.length; i++) {
          const trak = this.moov.traks[i];
          if (i > 0) codecs += ",";
          codecs += trak.mdia.minf.stbl.stsd.entries[0].getCodec();
        }
        return codecs;
      }
      /**
      * Helper function
      *
      * @bundle isofile-sample-processing.js
      */
      getTrexById(id) {
        if (!this.moov || !this.moov.mvex) return;
        for (let i = 0; i < this.moov.mvex.trexs.length; i++) {
          const trex = this.moov.mvex.trexs[i];
          if (trex.track_id === id) return trex;
        }
      }
      /**
      * Helper function
      *
      * @bundle isofile-sample-processing.js
      */
      getTrackById(id) {
        if (!this.moov) return;
        for (let j = 0; j < this.moov.traks.length; j++) {
          const trak = this.moov.traks[j];
          if (trak.tkhd.track_id === id) return trak;
        }
      }
      /** @bundle isofile-item-processing.js */
      flattenItemInfo() {
        const items = this.items;
        const entity_groups = this.entity_groups;
        const meta = this.meta;
        if (!meta || !meta.hdlr || !meta.iinf) return;
        for (let i = 0; i < meta.iinf.item_infos.length; i++) {
          const id = meta.iinf.item_infos[i].item_ID;
          items[id] = {
            id,
            name: meta.iinf.item_infos[i].item_name,
            ref_to: [],
            content_type: meta.iinf.item_infos[i].content_type,
            content_encoding: meta.iinf.item_infos[i].content_encoding,
            item_uri_type: meta.iinf.item_infos[i].item_uri_type,
            type: meta.iinf.item_infos[i].item_type ? meta.iinf.item_infos[i].item_type : "mime",
            protection: meta.iinf.item_infos[i].item_protection_index > 0 ? meta.ipro.protections[meta.iinf.item_infos[i].item_protection_index - 1] : void 0
          };
        }
        if (meta.grpl) for (let i = 0; i < meta.grpl.boxes.length; i++) {
          const entityGroup = meta.grpl.boxes[i];
          entity_groups[entityGroup.group_id] = {
            id: entityGroup.group_id,
            entity_ids: entityGroup.entity_ids,
            type: entityGroup.type
          };
        }
        if (meta.iloc) for (let i = 0; i < meta.iloc.items.length; i++) {
          const itemloc = meta.iloc.items[i];
          const item = items[itemloc.item_ID];
          if (itemloc.data_reference_index !== 0) {
            Log.warn("Item storage with reference to other files: not supported");
            item.source = meta.dinf.boxes[itemloc.data_reference_index - 1];
          }
          item.extents = [];
          item.size = 0;
          for (let j = 0; j < itemloc.extents.length; j++) {
            item.extents[j] = {
              offset: itemloc.extents[j].extent_offset + itemloc.base_offset,
              length: itemloc.extents[j].extent_length,
              alreadyRead: 0
            };
            if (itemloc.construction_method === 1) item.extents[j].offset += meta.idat.start + meta.idat.hdr_size;
            item.size += item.extents[j].length;
          }
        }
        if (meta.pitm) {
          const id = meta.pitm.item_id;
          if (!items[id]) Log.warn("ISOFile", "Primary item_id #" + id + " does not exist in items");
          else items[id].primary = true;
        }
        if (meta.iref) for (let i = 0; i < meta.iref.references.length; i++) {
          const ref = meta.iref.references[i];
          for (let j = 0; j < ref.references.length; j++) items[ref.from_item_ID].ref_to.push({
            type: ref.type,
            id: ref.references[j]
          });
        }
        if (meta.iprp) for (let k = 0; k < meta.iprp.ipmas.length; k++) {
          const ipma = meta.iprp.ipmas[k];
          for (let i = 0; i < ipma.associations.length; i++) {
            const association = ipma.associations[i];
            const item = items[association.id] ?? entity_groups[association.id];
            if (item) {
              if (item.properties === void 0) item.properties = { boxes: [] };
              for (let j = 0; j < association.props.length; j++) {
                const propEntry = association.props[j];
                if (propEntry.property_index > 0 && propEntry.property_index - 1 < meta.iprp.ipco.boxes.length) {
                  const propbox = meta.iprp.ipco.boxes[propEntry.property_index - 1];
                  item.properties[propbox.type] = propbox;
                  item.properties.boxes.push(propbox);
                }
              }
            }
          }
        }
      }
      /** @bundle isofile-item-processing.js */
      getItem(item_id) {
        if (!this.meta) return;
        const item = this.items[item_id];
        if (!item.data && item.size) {
          item.data = new Uint8Array(item.size);
          item.alreadyRead = 0;
          this.itemsDataSize += item.size;
          Log.debug("ISOFile", "Allocating item #" + item_id + " of size " + item.size + " (total: " + this.itemsDataSize + ")");
        } else if (item.alreadyRead === item.size) return item;
        for (let i = 0; i < item.extents.length; i++) {
          const extent = item.extents[i];
          if (extent.alreadyRead === extent.length) continue;
          else {
            const index = this.stream.findPosition(true, extent.offset + extent.alreadyRead, false);
            if (index > -1) {
              const buffer = this.stream.buffers[index];
              const lengthAfterStart = buffer.byteLength - (extent.offset + extent.alreadyRead - buffer.fileStart);
              if (extent.length - extent.alreadyRead <= lengthAfterStart) {
                Log.debug("ISOFile", "Getting item #" + item_id + " extent #" + i + " data (alreadyRead: " + extent.alreadyRead + " offset: " + (extent.offset + extent.alreadyRead - buffer.fileStart) + " read size: " + (extent.length - extent.alreadyRead) + " full extent size: " + extent.length + " full item size: " + item.size + ")");
                DataStream.memcpy(item.data.buffer, item.alreadyRead, buffer, extent.offset + extent.alreadyRead - buffer.fileStart, extent.length - extent.alreadyRead);
                if (!this.parsingMdat || this.discardMdatData) buffer.usedBytes += extent.length - extent.alreadyRead;
                this.stream.logBufferLevel();
                item.alreadyRead += extent.length - extent.alreadyRead;
                extent.alreadyRead = extent.length;
              } else {
                Log.debug("ISOFile", "Getting item #" + item_id + " extent #" + i + " partial data (alreadyRead: " + extent.alreadyRead + " offset: " + (extent.offset + extent.alreadyRead - buffer.fileStart) + " read size: " + lengthAfterStart + " full extent size: " + extent.length + " full item size: " + item.size + ")");
                DataStream.memcpy(item.data.buffer, item.alreadyRead, buffer, extent.offset + extent.alreadyRead - buffer.fileStart, lengthAfterStart);
                extent.alreadyRead += lengthAfterStart;
                item.alreadyRead += lengthAfterStart;
                if (!this.parsingMdat || this.discardMdatData) buffer.usedBytes += lengthAfterStart;
                this.stream.logBufferLevel();
                return;
              }
            } else return;
          }
        }
        if (item.alreadyRead === item.size) return item;
      }
      /**
      * Release the memory used to store the data of the item
      *
      * @bundle isofile-item-processing.js
      */
      releaseItem(item_id) {
        const item = this.items[item_id];
        if (item.data) {
          this.itemsDataSize -= item.size;
          item.data = void 0;
          item.alreadyRead = 0;
          for (let i = 0; i < item.extents.length; i++) {
            const extent = item.extents[i];
            extent.alreadyRead = 0;
          }
          return item.size;
        } else return 0;
      }
      /** @bundle isofile-item-processing.js */
      processItems(callback) {
        for (const i in this.items) {
          const item = this.items[i];
          this.getItem(item.id);
          if (callback && !item.sent) {
            callback(item);
            item.sent = true;
            item.data = void 0;
          }
        }
      }
      /** @bundle isofile-item-processing.js */
      hasItem(name) {
        for (const i in this.items) {
          const item = this.items[i];
          if (item.name === name) return item.id;
        }
        return -1;
      }
      /** @bundle isofile-item-processing.js */
      getMetaHandler() {
        if (this.meta) return this.meta.hdlr.handler;
      }
      /** @bundle isofile-item-processing.js */
      getPrimaryItem() {
        if (this.meta && this.meta.pitm) return this.getItem(this.meta.pitm.item_id);
      }
      /** @bundle isofile-item-processing.js */
      itemToFragmentedTrackFile({ itemId } = {}) {
        let item;
        if (itemId) item = this.getItem(itemId);
        else item = this.getPrimaryItem();
        if (!item) return;
        const file = new ISOFile2();
        file.discardMdatData = false;
        const trackOptions = {
          type: item.type,
          description_boxes: item.properties.boxes
        };
        if (item.properties.ispe) {
          trackOptions.width = item.properties.ispe.image_width;
          trackOptions.height = item.properties.ispe.image_height;
        }
        const trackId = file.addTrack(trackOptions);
        if (trackId) {
          file.addSample(trackId, item.data);
          return file;
        }
      }
      /** @bundle isofile-advanced-parsing.js */
      processIncompleteBox(ret) {
        if (ret.type === "mdat") {
          const box = new mdatBox(ret.size);
          this.parsingMdat = box;
          this.boxes.push(box);
          this.mdats.push(box);
          box.start = ret.start;
          box.hdr_size = ret.hdr_size;
          box.original_size = ret.original_size;
          this.stream.addUsedBytes(box.hdr_size);
          this.lastBoxStartPosition = box.start + box.size;
          if (this.stream.seek(box.start + box.size, false, this.discardMdatData)) {
            this.transferMdatData();
            this.parsingMdat = void 0;
            return true;
          } else {
            if (!this.moovStartFound) this.nextParsePosition = box.start + box.size;
            else this.nextParsePosition = this.stream.findEndContiguousBuf();
            return false;
          }
        } else {
          if (ret.type === "moov") {
            this.moovStartFound = true;
            if (this.mdats.length === 0) this.isProgressive = true;
          }
          if (this.stream.mergeNextBuffer ? this.stream.mergeNextBuffer() : false) {
            this.nextParsePosition = this.stream.getEndPosition();
            return true;
          } else {
            if (!ret.type) this.nextParsePosition = this.stream.getEndPosition();
            else if (this.moovStartFound) this.nextParsePosition = this.stream.getEndPosition();
            else this.nextParsePosition = this.stream.getPosition() + ret.size;
            return false;
          }
        }
      }
      /** @bundle isofile-advanced-parsing.js */
      hasIncompleteMdat() {
        return this.parsingMdat !== void 0;
      }
      /**
      * Transfer the data of the mdat box to its stream
      * @param mdat the mdat box to use
      */
      transferMdatData(inMdat) {
        const mdat = inMdat ?? this.parsingMdat;
        if (this.discardMdatData) {
          Log.debug("ISOFile", "Discarding 'mdat' data, not transferring it to the mdat box stream");
          return;
        }
        if (!mdat) {
          Log.warn("ISOFile", "Cannot transfer 'mdat' data, no mdat box is being parsed");
          return;
        }
        const startBufferIndex = this.stream.findPosition(true, mdat.start + mdat.hdr_size, false);
        const endBufferIndex = this.stream.findPosition(true, mdat.start + mdat.size, false);
        if (startBufferIndex === -1 || endBufferIndex === -1) {
          Log.warn("ISOFile", "Cannot transfer 'mdat' data, start or end buffer not found");
          return;
        }
        mdat.stream = new MultiBufferStream();
        for (let i = startBufferIndex; i <= endBufferIndex; i++) {
          const buffer = this.stream.buffers[i];
          const startOffset = i === startBufferIndex ? mdat.start + mdat.hdr_size - buffer.fileStart : 0;
          const endOffset = i === endBufferIndex ? mdat.start + mdat.size - buffer.fileStart : buffer.byteLength;
          if (endOffset > startOffset) {
            Log.debug("ISOFile", "Transferring 'mdat' data from buffer #" + i + " (" + startOffset + " to " + endOffset + ")");
            const transferSize = endOffset - startOffset;
            const newBuffer = new MP4BoxBuffer(transferSize);
            const lastPosition = mdat.stream.getAbsoluteEndPosition();
            DataStream.memcpy(newBuffer, 0, buffer, startOffset, transferSize);
            newBuffer.fileStart = lastPosition;
            mdat.stream.insertBuffer(newBuffer);
            buffer.usedBytes += transferSize;
          }
        }
      }
      /** @bundle isofile-advanced-parsing.js */
      processIncompleteMdat() {
        const box = this.parsingMdat;
        if (this.stream.seek(box.start + box.size, false, this.discardMdatData)) {
          Log.debug("ISOFile", "Found 'mdat' end in buffered data");
          this.transferMdatData();
          this.parsingMdat = void 0;
          return true;
        } else {
          this.nextParsePosition = this.stream.findEndContiguousBuf();
          return false;
        }
      }
      /** @bundle isofile-advanced-parsing.js */
      restoreParsePosition() {
        return this.stream.seek(this.lastBoxStartPosition, true, this.discardMdatData);
      }
      /** @bundle isofile-advanced-parsing.js */
      saveParsePosition() {
        this.lastBoxStartPosition = this.stream.getPosition();
      }
      /** @bundle isofile-advanced-parsing.js */
      updateUsedBytes(box, _ret) {
        if (this.stream.addUsedBytes) if (box.type === "mdat") {
          this.stream.addUsedBytes(box.hdr_size);
          if (this.discardMdatData) this.stream.addUsedBytes(box.size - box.hdr_size);
        } else this.stream.addUsedBytes(box.size);
      }
      /** @bundle isofile-advanced-creation.js */
      addBox(box) {
        return Box.prototype.addBox.call(this, box);
      }
      /** @bundle isofile-advanced-creation.js */
      init(options = {}) {
        const ftyp = this.addBox(new ftypBox());
        ftyp.major_brand = options.brands && options.brands[0] || "iso4";
        ftyp.minor_version = 0;
        ftyp.compatible_brands = options.brands || ["iso4"];
        const moov = this.addBox(new moovBox());
        moov.addBox(new mvexBox());
        const mvhd = moov.addBox(new mvhdBox());
        mvhd.timescale = options.timescale || 600;
        mvhd.rate = options.rate || 65536;
        mvhd.creation_time = 0;
        mvhd.modification_time = 0;
        mvhd.duration = options.duration || 0;
        mvhd.volume = options.width ? 0 : 256;
        mvhd.matrix = [
          65536,
          0,
          0,
          0,
          65536,
          0,
          0,
          0,
          1073741824
        ];
        mvhd.next_track_id = 1;
        return this;
      }
      /** @bundle isofile-advanced-creation.js */
      addTrack(_options = {}) {
        if (!this.moov) this.init(_options);
        const options = _options || {};
        options.width = options.width || 320;
        options.height = options.height || 320;
        options.id = options.id || this.moov.mvhd.next_track_id;
        options.type = options.type || "avc1";
        const trak = this.moov.addBox(new trakBox());
        this.moov.mvhd.next_track_id = options.id + 1;
        const tkhd = trak.addBox(new tkhdBox());
        tkhd.flags = 1 | 2 | 4;
        tkhd.creation_time = 0;
        tkhd.modification_time = 0;
        tkhd.track_id = options.id;
        tkhd.duration = options.duration || 0;
        tkhd.layer = options.layer || 0;
        tkhd.alternate_group = 0;
        tkhd.volume = 1;
        tkhd.matrix = [
          65536,
          0,
          0,
          0,
          65536,
          0,
          0,
          0,
          1073741824
        ];
        tkhd.width = options.width << 16;
        tkhd.height = options.height << 16;
        const mdia = trak.addBox(new mdiaBox());
        const mdhd = mdia.addBox(new mdhdBox());
        mdhd.creation_time = 0;
        mdhd.modification_time = 0;
        mdhd.timescale = options.timescale || 1;
        mdhd.duration = options.media_duration || 0;
        mdhd.language = options.language || "und";
        const hdlr = mdia.addBox(new hdlrBox());
        hdlr.handler = options.hdlr || "vide";
        hdlr.name = options.name || "Track created with MP4Box.js";
        const elng = mdia.addBox(new elngBox());
        elng.extended_language = options.language || "fr-FR";
        const minf = mdia.addBox(new minfBox());
        const sampleEntry = BoxRegistry.sampleEntry[options.type];
        if (!sampleEntry) return;
        const sample_description_entry = new sampleEntry();
        sample_description_entry.data_reference_index = 1;
        if (sample_description_entry instanceof VisualSampleEntry) {
          const sde = sample_description_entry;
          const vmhd = minf.addBox(new vmhdBox());
          vmhd.graphicsmode = 0;
          vmhd.opcolor = [
            0,
            0,
            0
          ];
          sde.width = options.width;
          sde.height = options.height;
          sde.horizresolution = 72 << 16;
          sde.vertresolution = 72 << 16;
          sde.frame_count = 1;
          sde.compressorname = options.type + " Compressor";
          sde.depth = 24;
          if (options.avcDecoderConfigRecord) sde.addBox(new avcCBox(options.avcDecoderConfigRecord.byteLength)).parse(new DataStream(options.avcDecoderConfigRecord));
          else if (options.hevcDecoderConfigRecord) sde.addBox(new hvcCBox(options.hevcDecoderConfigRecord.byteLength)).parse(new DataStream(options.hevcDecoderConfigRecord));
        } else if (sample_description_entry instanceof AudioSampleEntry) {
          const sde = sample_description_entry;
          const smhd = minf.addBox(new smhdBox());
          smhd.balance = options.balance || 0;
          sde.channel_count = options.channel_count || 2;
          sde.samplesize = options.samplesize || 16;
          sde.samplerate = options.samplerate || 65536;
        } else if (sample_description_entry instanceof HintSampleEntry) minf.addBox(new hmhdBox());
        else if (sample_description_entry instanceof SubtitleSampleEntry) {
          minf.addBox(new sthdBox());
          if (sample_description_entry instanceof stppSampleEntry) {
            sample_description_entry.namespace = options.namespace || "nonamespace";
            sample_description_entry.schema_location = options.schema_location || "";
            sample_description_entry.auxiliary_mime_types = options.auxiliary_mime_types || "";
          }
        } else if (sample_description_entry instanceof MetadataSampleEntry) minf.addBox(new nmhdBox());
        else if (sample_description_entry instanceof SystemSampleEntry) minf.addBox(new nmhdBox());
        else minf.addBox(new nmhdBox());
        if (options.description) sample_description_entry.addBox.call(sample_description_entry, options.description);
        if (options.description_boxes) options.description_boxes.forEach(function(b) {
          sample_description_entry.addBox.call(sample_description_entry, b);
        });
        const dref = minf.addBox(new dinfBox()).addBox(new drefBox());
        const url = new urlBox();
        url.flags = 1;
        dref.addEntry(url);
        const stbl = minf.addBox(new stblBox());
        stbl.addBox(new stsdBox()).addEntry(sample_description_entry);
        const stts = stbl.addBox(new sttsBox());
        stts.sample_counts = [];
        stts.sample_deltas = [];
        const stsc = stbl.addBox(new stscBox());
        stsc.first_chunk = [];
        stsc.samples_per_chunk = [];
        stsc.sample_description_index = [];
        const stco = stbl.addBox(new stcoBox());
        stco.chunk_offsets = [];
        const stsz = stbl.addBox(new stszBox());
        stsz.sample_sizes = [];
        const trex = this.moov.mvex.addBox(new trexBox());
        trex.track_id = options.id;
        trex.default_sample_description_index = options.default_sample_description_index || 1;
        trex.default_sample_duration = options.default_sample_duration || 0;
        trex.default_sample_size = options.default_sample_size || 0;
        trex.default_sample_flags = options.default_sample_flags || 0;
        this.buildTrakSampleLists(trak);
        return options.id;
      }
      /** @bundle isofile-advanced-creation.js */
      addSample(track_id, data, { sample_description_index, duration = 1, cts = 0, dts = 0, is_sync = false, is_leading = 0, depends_on = 0, is_depended_on = 0, has_redundancy = 0, degradation_priority = 0, subsamples, offset = 0 } = {}) {
        const trak = this.getTrackById(track_id);
        if (trak === void 0) return;
        const descriptionIndex = sample_description_index ? sample_description_index - 1 : 0;
        const sample = {
          number: trak.samples.length,
          track_id: trak.tkhd.track_id,
          timescale: trak.mdia.mdhd.timescale,
          description_index: descriptionIndex,
          description: trak.mdia.minf.stbl.stsd.entries[descriptionIndex],
          data,
          size: data.byteLength,
          alreadyRead: data.byteLength,
          duration,
          cts,
          dts,
          is_sync,
          is_leading,
          depends_on,
          is_depended_on,
          has_redundancy,
          degradation_priority,
          offset,
          subsamples
        };
        trak.samples.push(sample);
        trak.samples_size += sample.size;
        trak.samples_duration += sample.duration;
        if (trak.first_dts === void 0) trak.first_dts = dts;
        this.processSamples();
        const moof = this.addBox(this.createMoof([sample]));
        moof.computeSize();
        moof.trafs[0].truns[0].data_offset = moof.size + 8;
        const mdat = this.addBox(new mdatBox());
        mdat.data = new Uint8Array(data);
        return sample;
      }
      /** @bundle isofile-advanced-creation.js */
      createMoof(samples) {
        if (samples.length === 0) return;
        if (samples.some((s) => s.track_id !== samples[0].track_id)) throw new Error("Cannot create moof for samples from different tracks: " + samples.map((s) => s.track_id).join(", "));
        const trackId = samples[0].track_id;
        const trak = this.getTrackById(trackId);
        if (!trak) throw new Error("Cannot create moof for non-existing track: " + trackId);
        const moof = new moofBox();
        const mfhd = moof.addBox(new mfhdBox());
        mfhd.sequence_number = ++this.nextMoofNumber;
        const traf = moof.addBox(new trafBox());
        const tfhd = traf.addBox(new tfhdBox());
        tfhd.track_id = trackId;
        tfhd.flags = TFHD_FLAG_DEFAULT_BASE_IS_MOOF;
        const tfdt = traf.addBox(new tfdtBox());
        tfdt.baseMediaDecodeTime = samples[0].dts - (trak.first_dts || 0);
        const trun = traf.addBox(new trunBox());
        trun.flags = 1 | 256 | 512 | TRUN_FLAGS_FLAGS | TRUN_FLAGS_CTS_OFFSET;
        trun.data_offset = 0;
        trun.first_sample_flags = 0;
        trun.sample_count = samples.length;
        for (const sample of samples) {
          let sample_flags = 0;
          if (sample.is_sync) sample_flags = 1 << 25;
          else sample_flags = 65536;
          trun.sample_duration.push(sample.duration);
          trun.sample_size.push(sample.size);
          trun.sample_flags.push(sample_flags);
          trun.sample_composition_time_offset.push(sample.cts - sample.dts);
        }
        return moof;
      }
      /** @bundle box-print.js */
      print(output) {
        output.indent = "";
        for (let i = 0; i < this.boxes.length; i++) if (this.boxes[i]) this.boxes[i].print(output);
      }
    };
    emsgBox = class extends FullBox {
      constructor(..._args) {
        super(..._args);
        this.box_name = "EventMessageBox";
      }
      static {
        this.fourcc = "emsg";
      }
      parse(stream) {
        this.parseFullHeader(stream);
        if (this.version === 1) {
          this.timescale = stream.readUint32();
          this.presentation_time = stream.readUint64();
          this.event_duration = stream.readUint32();
          this.id = stream.readUint32();
          this.scheme_id_uri = stream.readCString();
          this.value = stream.readCString();
        } else {
          this.scheme_id_uri = stream.readCString();
          this.value = stream.readCString();
          this.timescale = stream.readUint32();
          this.presentation_time_delta = stream.readUint32();
          this.event_duration = stream.readUint32();
          this.id = stream.readUint32();
        }
        let message_size = this.size - this.hdr_size - (16 + (this.scheme_id_uri.length + 1) + (this.value.length + 1));
        if (this.version === 1) message_size -= 4;
        this.message_data = stream.readUint8Array(message_size);
      }
      /** @bundle writing/emsg.js */
      write(stream) {
        this.version = 0;
        this.flags = 0;
        this.size = 16 + this.message_data.length + (this.scheme_id_uri.length + 1) + (this.value.length + 1);
        this.writeHeader(stream);
        stream.writeCString(this.scheme_id_uri);
        stream.writeCString(this.value);
        stream.writeUint32(this.timescale);
        stream.writeUint32(this.presentation_time_delta);
        stream.writeUint32(this.event_duration);
        stream.writeUint32(this.id);
        stream.writeUint8Array(this.message_data);
      }
    };
    ssixBox = class extends FullBox {
      constructor(..._args) {
        super(..._args);
        this.box_name = "CompressedSubsegmentIndexBox";
      }
      static {
        this.fourcc = "ssix";
      }
      parse(stream) {
        this.parseFullHeader(stream);
        this.subsegments = [];
        const subsegment_count = stream.readUint32();
        for (let i = 0; i < subsegment_count; i++) {
          const subsegment = {};
          this.subsegments.push(subsegment);
          subsegment.ranges = [];
          const range_count = stream.readUint32();
          for (let j = 0; j < range_count; j++) {
            const range = {};
            subsegment.ranges.push(range);
            range.level = stream.readUint8();
            range.range_size = stream.readUint24();
          }
        }
      }
    };
    stypBox = class extends Box {
      constructor(..._args) {
        super(..._args);
        this.box_name = "SegmentTypeBox";
      }
      static {
        this.fourcc = "styp";
      }
      parse(stream) {
        let toparse = this.size - this.hdr_size;
        this.major_brand = stream.readString(4);
        this.minor_version = stream.readUint32();
        toparse -= 8;
        this.compatible_brands = [];
        let i = 0;
        while (toparse >= 4) {
          this.compatible_brands[i] = stream.readString(4);
          toparse -= 4;
          i++;
        }
      }
      write(stream) {
        this.size = 8 + 4 * this.compatible_brands.length;
        this.writeHeader(stream);
        stream.writeString(this.major_brand, void 0, 4);
        stream.writeUint32(this.minor_version);
        for (let i = 0; i < this.compatible_brands.length; i++) stream.writeString(this.compatible_brands[i], void 0, 4);
      }
    };
  }
});

// node_modules/mp4box/dist/mp4box.all.mjs
var mp4box_all_exports = {};
__export(mp4box_all_exports, {
  AudioSampleEntry: () => AudioSampleEntry,
  Box: () => Box,
  BoxParser: () => BoxParser,
  DIFF_BOXES_PROP_NAMES: () => DIFF_BOXES_PROP_NAMES,
  DIFF_PRIMITIVE_ARRAY_PROP_NAMES: () => DIFF_PRIMITIVE_ARRAY_PROP_NAMES,
  DataStream: () => DataStream,
  Descriptor: () => Descriptor,
  ES_Descriptor: () => ES_Descriptor,
  Endianness: () => Endianness,
  FullBox: () => FullBox,
  HintSampleEntry: () => HintSampleEntry,
  ISOFile: () => ISOFile,
  Log: () => Log,
  MP4BoxBuffer: () => MP4BoxBuffer,
  MPEG4DescriptorParser: () => MPEG4DescriptorParser,
  MetadataSampleEntry: () => MetadataSampleEntry,
  MultiBufferStream: () => MultiBufferStream,
  SampleEntry: () => SampleEntry,
  SampleGroupEntry: () => SampleGroupEntry,
  SampleGroupInfo: () => SampleGroupInfo,
  SingleItemTypeReferenceBox: () => SingleItemTypeReferenceBox,
  SingleItemTypeReferenceBoxLarge: () => SingleItemTypeReferenceBoxLarge,
  SubtitleSampleEntry: () => SubtitleSampleEntry,
  SystemSampleEntry: () => SystemSampleEntry,
  TX3GParser: () => TX3GParser,
  TextSampleEntry: () => TextSampleEntry,
  Textin4Parser: () => Textin4Parser,
  TrackGroupTypeBox: () => TrackGroupTypeBox,
  TrackReferenceTypeBox: () => TrackReferenceTypeBox,
  VTTin4Parser: () => VTTin4Parser,
  VisualSampleEntry: () => VisualSampleEntry,
  XMLSubtitlein4Parser: () => XMLSubtitlein4Parser,
  boxEqual: () => boxEqual,
  boxEqualFields: () => boxEqualFields,
  createFile: () => createFile
});
function parseItifData(type, data) {
  if (type === dataBox.Types.UTF8) return new TextDecoder("utf-8").decode(data);
  const view = new DataView(data.buffer);
  if (type === dataBox.Types.BE_UNSIGNED_INT) if (data.length === 1) return view.getUint8(0);
  else if (data.length === 2) return view.getUint16(0, false);
  else if (data.length === 4) return view.getUint32(0, false);
  else if (data.length === 8) return view.getBigUint64(0, false);
  else throw new Error("Unsupported ITIF_TYPE_BE_UNSIGNED_INT length " + data.length);
  else if (type === dataBox.Types.BE_SIGNED_INT) if (data.length === 1) return view.getInt8(0);
  else if (data.length === 2) return view.getInt16(0, false);
  else if (data.length === 4) return view.getInt32(0, false);
  else if (data.length === 8) return view.getBigInt64(0, false);
  else throw new Error("Unsupported ITIF_TYPE_BE_SIGNED_INT length " + data.length);
  else if (type === dataBox.Types.BE_FLOAT32) return view.getFloat32(0, false);
  Log.warn("DataBox", "Unsupported or unimplemented itif data type: " + type);
}
var descriptor_exports, ES_DescrTag, DecoderConfigDescrTag, DecSpecificInfoTag, SLConfigDescrTag, Descriptor, ES_Descriptor, DecoderConfigDescriptor, DecoderSpecificInfo, SLConfigDescriptor, DESCRIPTOR_CLASSES, descTagToName, MPEG4DescriptorParser, VTTin4Parser, XMLSubtitlein4Parser, Textin4Parser, TX3GParser, a1lxBox, a1opBox, auxCBox, btrtBox, ccstBox, cdefBox, clapBox, clliBox, cmexBox, cminBox, cmpCBox, cmpdBox, co64Box, CoLLBox, SphereRegion, CoverageSphereRegion, coviBox, cprtBox, cschBox, INT32_MAX, cslgBox, cttsBox, dac3Box, dec3Box, dfLaBox, dimmBox, dmax, dmedBox, dOpsBox, drepBox, elstBox, EntityToGroup, aebrBox, afbrBox, albcBox, altrBox, brstBox, dobrBox, eqivBox, favcBox, fobrBox, iaugBox, panoBox, slidBox, sterBox, tsynBox, wbbrBox, prgrBox, pymdBox, fielBox, frmaBox, imirBox, ipmaBox, irotBox, ispeBox, itaiBox, kindBox, levaBox, lhvCBox, lselBox, maxrBox, ColorPoint, mdcvBox, mfroBox, mskCBox, npckBox, numpBox, PaddingBit, padbBox, paspBox, paylBox, paytBox, pdinBox, pixiBox, pmaxBox, prdiBox, prfrBox, prftBox, psshBox, clefBox, dataBox, enofBox, ilstBox, keysBox, profBox, taptBox, rtp_Box, saioBox, saizBox, Pixel, sbpmBox, schmBox, sdp_Box, sencBox, SmDmBox, sratBox, stdpBox, striBox, stsgBox, stshBox, stssBox, stviBox, stz2Box, subsBox, taicBox, tencBox, TfraEntry, tfraBox, tmaxBox, tminBox, totlBox, tpayBox, tpylBox, msrcTrackGroupTypeBox, trefBox, trepBox, trpyBox, tselBox, txtcBox, tycoBox, udesBox, uncCBox, urnBox, vttCBox, vvnCBox, alstSampleGroupEntry, avllSampleGroupEntry, avssSampleGroupEntry, dtrtSampleGroupEntry, mvifSampleGroupEntry, prolSampleGroupEntry, rapSampleGroupEntry, rashSampleGroupEntry, rollSampleGroupEntry, scifSampleGroupEntry, scnmSampleGroupEntry, seigSampleGroupEntry, stsaSampleGroupEntry, syncSampleGroupEntry, teleSampleGroupEntry, tsasSampleGroupEntry, tsclSampleGroupEntry, viprSampleGroupEntry, UUIDBox, UUIDFullBox, piffLsmBox, piffPsshBox, piffSencBox, piffTencBox, piffTfrfBox, piffTfxdBox, ItemContentIDPropertyBox, ItemComponentContentIDPropertyBox, all_boxes_exports, BoxParser;
var init_mp4box_all = __esm({
  "node_modules/mp4box/dist/mp4box.all.mjs"() {
    init_rolldown_runtime_w6R9maHv();
    init_styp_9TIZZDLN();
    descriptor_exports = /* @__PURE__ */ __exportAll({
      Descriptor: () => Descriptor,
      ES_Descriptor: () => ES_Descriptor,
      MPEG4DescriptorParser: () => MPEG4DescriptorParser
    });
    ES_DescrTag = 3;
    DecoderConfigDescrTag = 4;
    DecSpecificInfoTag = 5;
    SLConfigDescrTag = 6;
    Descriptor = class Descriptor2 {
      constructor(tag, size) {
        this.tag = tag;
        this.size = size;
        this.descs = [];
      }
      parse(stream) {
        this.data = stream.readUint8Array(this.size);
      }
      findDescriptor(tag) {
        for (let i = 0; i < this.descs.length; i++) if (this.descs[i].tag === tag) return this.descs[i];
      }
      parseOneDescriptor(stream) {
        let size = 0;
        const tag = stream.readUint8();
        let byteRead = stream.readUint8();
        while (byteRead & 128) {
          size = (size << 7) + (byteRead & 127);
          byteRead = stream.readUint8();
        }
        size = (size << 7) + (byteRead & 127);
        Log.debug("Descriptor", "Found " + (descTagToName[tag] || "Descriptor " + tag) + ", size " + size + " at position " + stream.getPosition());
        const desc = descTagToName[tag] ? new DESCRIPTOR_CLASSES[descTagToName[tag]](size) : new Descriptor2(size);
        desc.parse(stream);
        return desc;
      }
      parseRemainingDescriptors(stream) {
        const start2 = stream.getPosition();
        while (stream.getPosition() < start2 + this.size) {
          const desc = this.parseOneDescriptor?.(stream);
          this.descs.push(desc);
        }
      }
    };
    ES_Descriptor = class extends Descriptor {
      constructor(size) {
        super(ES_DescrTag, size);
      }
      parse(stream) {
        this.ES_ID = stream.readUint16();
        this.flags = stream.readUint8();
        this.size -= 3;
        if (this.flags & 128) {
          this.dependsOn_ES_ID = stream.readUint16();
          this.size -= 2;
        } else this.dependsOn_ES_ID = 0;
        if (this.flags & 64) {
          const l = stream.readUint8();
          this.URL = stream.readString(l);
          this.size -= l + 1;
        } else this.URL = "";
        if (this.flags & 32) {
          this.OCR_ES_ID = stream.readUint16();
          this.size -= 2;
        } else this.OCR_ES_ID = 0;
        this.parseRemainingDescriptors(stream);
      }
      getOTI() {
        const dcd = this.findDescriptor(DecoderConfigDescrTag);
        if (dcd) return dcd.oti;
        else return 0;
      }
      getAudioConfig() {
        const dcd = this.findDescriptor(DecoderConfigDescrTag);
        if (!dcd) return;
        const dsi = dcd.findDescriptor(DecSpecificInfoTag);
        if (dsi && dsi.data) {
          let audioObjectType = (dsi.data[0] & 248) >> 3;
          if (audioObjectType === 31 && dsi.data.length >= 2) audioObjectType = 32 + ((dsi.data[0] & 7) << 3) + ((dsi.data[1] & 224) >> 5);
          return audioObjectType;
        }
      }
    };
    DecoderConfigDescriptor = class extends Descriptor {
      constructor(size) {
        super(DecoderConfigDescrTag, size);
      }
      parse(stream) {
        this.oti = stream.readUint8();
        this.streamType = stream.readUint8();
        this.upStream = (this.streamType >> 1 & 1) !== 0;
        this.streamType = this.streamType >>> 2;
        this.bufferSize = stream.readUint24();
        this.maxBitrate = stream.readUint32();
        this.avgBitrate = stream.readUint32();
        this.size -= 13;
        this.parseRemainingDescriptors(stream);
      }
    };
    DecoderSpecificInfo = class extends Descriptor {
      constructor(size) {
        super(DecSpecificInfoTag, size);
      }
    };
    SLConfigDescriptor = class extends Descriptor {
      constructor(size) {
        super(SLConfigDescrTag, size);
      }
    };
    DESCRIPTOR_CLASSES = {
      Descriptor,
      ES_Descriptor,
      DecoderConfigDescriptor,
      DecoderSpecificInfo,
      SLConfigDescriptor
    };
    descTagToName = {
      [ES_DescrTag]: "ES_Descriptor",
      [DecoderConfigDescrTag]: "DecoderConfigDescriptor",
      [DecSpecificInfoTag]: "DecoderSpecificInfo",
      [SLConfigDescrTag]: "SLConfigDescriptor"
    };
    MPEG4DescriptorParser = class {
      constructor() {
        this.parseOneDescriptor = Descriptor.prototype.parseOneDescriptor;
      }
      getDescriptorName(tag) {
        return descTagToName[tag];
      }
    };
    VTTin4Parser = class {
      parseSample(data) {
        const cues = [];
        const stream = new MultiBufferStream(MP4BoxBuffer.fromArrayBuffer(data.buffer, 0));
        while (!stream.isEof()) {
          const cue = parseOneBox(stream, false);
          if (cue.code === 1 && cue.box?.type === "vttc") cues.push(cue.box);
        }
        return cues;
      }
      getText(startTime, endTime, data) {
        function pad(value, width) {
          const string2 = value.toString();
          if (string2.length >= width) return string2;
          return new Array(width - string2.length + 1).join("0") + string2;
        }
        function secToTimestamp(insec) {
          const h = Math.floor(insec / 3600);
          const m = Math.floor((insec - h * 3600) / 60);
          const s = Math.floor(insec - h * 3600 - m * 60);
          const ms = Math.floor((insec - h * 3600 - m * 60 - s) * 1e3);
          return "" + pad(h, 2) + ":" + pad(m, 2) + ":" + pad(s, 2) + "." + pad(ms, 3);
        }
        const cues = this.parseSample(data);
        let string = "";
        for (let i = 0; i < cues.length; i++) {
          const cueIn4 = cues[i];
          string += secToTimestamp(startTime) + " --> " + secToTimestamp(endTime) + "\r\n";
          string += cueIn4.payl.text;
        }
        return string;
      }
    };
    XMLSubtitlein4Parser = class {
      parseSample(sample) {
        const res = {
          resources: [],
          documentString: "",
          document: void 0
        };
        const stream = new DataStream(sample.data.buffer);
        if (!sample.subsamples || sample.subsamples.length === 0) res.documentString = stream.readString(sample.data.length);
        else {
          res.documentString = stream.readString(sample.subsamples[0].size);
          if (sample.subsamples.length > 1) for (let i = 1; i < sample.subsamples.length; i++) res.resources[i] = stream.readUint8Array(sample.subsamples[i].size);
        }
        if (typeof DOMParser !== "undefined") res.document = new DOMParser().parseFromString(res.documentString, "application/xml");
        return res;
      }
    };
    Textin4Parser = class {
      parseSample(sample) {
        return new DataStream(sample.data.buffer).readString(sample.data.length);
      }
      parseConfig(data) {
        const stream = new DataStream(data.buffer);
        stream.readUint32();
        return stream.readCString();
      }
    };
    TX3GParser = class {
      parseSample(sample) {
        const stream = new DataStream(sample.data.buffer);
        const size = stream.readUint16();
        if (size === 0) return;
        return stream.readString(size);
      }
    };
    a1lxBox = class extends Box {
      constructor(..._args) {
        super(..._args);
        this.box_name = "AV1LayeredImageIndexingProperty";
      }
      static {
        this.fourcc = "a1lx";
      }
      parse(stream) {
        const FieldLength = ((stream.readUint8() & 1) + 1) * 16;
        this.layer_size = [];
        for (let i = 0; i < 3; i++) if (FieldLength === 16) this.layer_size[i] = stream.readUint16();
        else this.layer_size[i] = stream.readUint32();
      }
    };
    a1opBox = class extends Box {
      constructor(..._args) {
        super(..._args);
        this.box_name = "OperatingPointSelectorProperty";
      }
      static {
        this.fourcc = "a1op";
      }
      parse(stream) {
        this.op_index = stream.readUint8();
      }
    };
    auxCBox = class extends FullBox {
      constructor(..._args) {
        super(..._args);
        this.box_name = "AuxiliaryTypeProperty";
      }
      static {
        this.fourcc = "auxC";
      }
      parse(stream) {
        this.parseFullHeader(stream);
        this.aux_type = stream.readCString();
        const aux_subtype_length = this.size - this.hdr_size - (this.aux_type.length + 1);
        this.aux_subtype = stream.readUint8Array(aux_subtype_length);
      }
    };
    btrtBox = class extends Box {
      constructor(..._args) {
        super(..._args);
        this.box_name = "BitRateBox";
      }
      static {
        this.fourcc = "btrt";
      }
      parse(stream) {
        this.bufferSizeDB = stream.readUint32();
        this.maxBitrate = stream.readUint32();
        this.avgBitrate = stream.readUint32();
      }
    };
    ccstBox = class extends FullBox {
      constructor(..._args) {
        super(..._args);
        this.box_name = "CodingConstraintsBox";
      }
      static {
        this.fourcc = "ccst";
      }
      parse(stream) {
        this.parseFullHeader(stream);
        const flags = stream.readUint8();
        this.all_ref_pics_intra = (flags & 128) === 128;
        this.intra_pred_used = (flags & 64) === 64;
        this.max_ref_per_pic = (flags & 63) >> 2;
        stream.readUint24();
      }
    };
    cdefBox = class extends Box {
      constructor(..._args) {
        super(..._args);
        this.box_name = "ComponentDefinitionBox";
      }
      static {
        this.fourcc = "cdef";
      }
      parse(stream) {
        this.channel_count = stream.readUint16();
        this.channel_indexes = [];
        this.channel_types = [];
        this.channel_associations = [];
        for (let i = 0; i < this.channel_count; i++) {
          this.channel_indexes.push(stream.readUint16());
          this.channel_types.push(stream.readUint16());
          this.channel_associations.push(stream.readUint16());
        }
      }
    };
    clapBox = class extends Box {
      constructor(..._args) {
        super(..._args);
        this.box_name = "CleanApertureBox";
      }
      static {
        this.fourcc = "clap";
      }
      parse(stream) {
        this.cleanApertureWidthN = stream.readUint32();
        this.cleanApertureWidthD = stream.readUint32();
        this.cleanApertureHeightN = stream.readUint32();
        this.cleanApertureHeightD = stream.readUint32();
        this.horizOffN = stream.readUint32();
        this.horizOffD = stream.readUint32();
        this.vertOffN = stream.readUint32();
        this.vertOffD = stream.readUint32();
      }
    };
    clliBox = class extends Box {
      constructor(..._args) {
        super(..._args);
        this.box_name = "ContentLightLevelBox";
      }
      static {
        this.fourcc = "clli";
      }
      parse(stream) {
        this.max_content_light_level = stream.readUint16();
        this.max_pic_average_light_level = stream.readUint16();
      }
    };
    cmexBox = class extends Box {
      constructor(..._args) {
        super(..._args);
        this.box_name = "CameraExtrinsicMatrixProperty";
      }
      static {
        this.fourcc = "cmex";
      }
      parse(stream) {
        if (this.flags & 1) this.pos_x = stream.readInt32();
        if (this.flags & 2) this.pos_y = stream.readInt32();
        if (this.flags & 4) this.pos_z = stream.readInt32();
        if (this.flags & 8) {
          if (this.version === 0) if (this.flags & 16) {
            this.quat_x = stream.readInt32();
            this.quat_y = stream.readInt32();
            this.quat_z = stream.readInt32();
          } else {
            this.quat_x = stream.readInt16();
            this.quat_y = stream.readInt16();
            this.quat_z = stream.readInt16();
          }
          else if (this.version === 1) {
          }
        }
        if (this.flags & 32) this.id = stream.readUint32();
      }
    };
    cminBox = class extends Box {
      constructor(..._args) {
        super(..._args);
        this.box_name = "CameraIntrinsicMatrixProperty";
      }
      static {
        this.fourcc = "cmin";
      }
      parse(stream) {
        this.focal_length_x = stream.readInt32();
        this.principal_point_x = stream.readInt32();
        this.principal_point_y = stream.readInt32();
        if (this.flags & 1) {
          this.focal_length_y = stream.readInt32();
          this.skew_factor = stream.readInt32();
        }
      }
    };
    cmpCBox = class extends FullBox {
      constructor(..._args) {
        super(..._args);
        this.box_name = "CompressionConfigurationBox";
      }
      static {
        this.fourcc = "cmpC";
      }
      parse(stream) {
        this.parseFullHeader(stream);
        this.compression_type = stream.readString(4);
        this.compressed_unit_type = stream.readUint8();
      }
    };
    cmpdBox = class extends Box {
      constructor(..._args) {
        super(..._args);
        this.box_name = "ComponentDefinitionBox";
      }
      static {
        this.fourcc = "cmpd";
      }
      parse(stream) {
        this.component_count = stream.readUint32();
        this.component_types = [];
        this.component_type_urls = [];
        for (let i = 0; i < this.component_count; i++) {
          const component_type = stream.readUint16();
          this.component_types.push(component_type);
          if (component_type >= 32768) this.component_type_urls.push(stream.readCString());
        }
      }
    };
    co64Box = class extends FullBox {
      constructor(..._args) {
        super(..._args);
        this.box_name = "ChunkLargeOffsetBox";
      }
      static {
        this.fourcc = "co64";
      }
      parse(stream) {
        this.parseFullHeader(stream);
        const entry_count = stream.readUint32();
        this.chunk_offsets = [];
        if (this.version === 0) for (let i = 0; i < entry_count; i++) this.chunk_offsets.push(stream.readUint64());
      }
      /** @bundle writing/co64.js */
      write(stream) {
        this.version = 0;
        this.flags = 0;
        this.size = 4 + 8 * this.chunk_offsets.length;
        this.writeHeader(stream);
        stream.writeUint32(this.chunk_offsets.length);
        for (let i = 0; i < this.chunk_offsets.length; i++) stream.writeUint64(this.chunk_offsets[i]);
      }
    };
    CoLLBox = class extends FullBox {
      constructor(..._args) {
        super(..._args);
        this.box_name = "ContentLightLevelBox";
      }
      static {
        this.fourcc = "CoLL";
      }
      parse(stream) {
        this.parseFullHeader(stream);
        this.maxCLL = stream.readUint16();
        this.maxFALL = stream.readUint16();
      }
    };
    SphereRegion = class {
      toString() {
        let s = "centre_azimuth: ";
        s += this.centre_azimuth;
        s += " (";
        s += this.centre_azimuth * 2 ** -16;
        s += "\xB0), centre_elevation: ";
        s += this.centre_elevation;
        s += " (";
        s += this.centre_elevation * 2 ** -16;
        s += "\xB0), centre_tilt: ";
        s += this.centre_tilt;
        s += " (";
        s += this.centre_tilt * 2 ** -16;
        s += "\xB0)";
        if (this.range_included_flag) {
          s += ", azimuth_range: ";
          s += this.azimuth_range;
          s += " (";
          s += this.azimuth_range * 2 ** -16;
          s += "\xB0), elevation_range: ";
          s += this.elevation_range;
          s += " (";
          s += this.elevation_range * 2 ** -16;
          s += "\xB0)";
        }
        if (this.interpolate_included_flag) {
          s += ", interpolate: ";
          s += this.interpolate;
        }
        return s;
      }
    };
    CoverageSphereRegion = class {
      toString() {
        let s = "";
        if (this.view_idc) {
          s += "view_idc: ";
          s += this.view_idc;
          s += ", ";
        }
        s += "sphere_region: {";
        s += this.sphere_region;
        s += "}";
        return s;
      }
    };
    coviBox = class extends FullBox {
      constructor(..._args) {
        super(..._args);
        this.box_name = "CoverageInformationBox";
      }
      static {
        this.fourcc = "covi";
      }
      parse(stream) {
        this.parseFullHeader(stream);
        this.coverage_shape_type = stream.readUint8();
        const num_regions = stream.readUint8();
        const f = stream.readInt8();
        const view_idc_presence_flag = f & 128;
        if (view_idc_presence_flag) this.default_view_idc = (f & 96) >> 5;
        this.coverage_regions = new Array();
        for (let i = 0; i < num_regions; i++) {
          const region = new CoverageSphereRegion();
          if (view_idc_presence_flag) region.view_idc = stream.readUint8() >> 6;
          region.sphere_region = this.parseSphereRegion(stream, true, true);
          this.coverage_regions.push(region);
        }
      }
      parseSphereRegion(stream, range_included_flag, interpolate_included_flag) {
        const sphere_region = new SphereRegion();
        sphere_region.centre_azimuth = stream.readInt32();
        sphere_region.centre_elevation = stream.readInt32();
        sphere_region.centre_tilt = stream.readInt32();
        sphere_region.range_included_flag = range_included_flag;
        if (range_included_flag) {
          sphere_region.azimuth_range = stream.readUint32();
          sphere_region.elevation_range = stream.readUint32();
        }
        sphere_region.interpolate_included_flag = interpolate_included_flag;
        if (interpolate_included_flag) sphere_region.interpolate = (stream.readUint8() & 128) === 128;
        return sphere_region;
      }
    };
    cprtBox = class extends FullBox {
      constructor(..._args) {
        super(..._args);
        this.box_name = "CopyrightBox";
      }
      static {
        this.fourcc = "cprt";
      }
      parse(stream) {
        this.parseFullHeader(stream);
        this.parseLanguage(stream);
        this.notice = stream.readCString();
      }
    };
    cschBox = class extends FullBox {
      constructor(..._args) {
        super(..._args);
        this.box_name = "CompatibleSchemeTypeBox";
      }
      static {
        this.fourcc = "csch";
      }
      parse(stream) {
        this.parseFullHeader(stream);
        this.scheme_type = stream.readString(4);
        this.scheme_version = stream.readUint32();
        if (this.flags & 1) this.scheme_uri = stream.readCString();
      }
    };
    INT32_MAX = 2147483647;
    cslgBox = class extends FullBox {
      constructor(..._args) {
        super(..._args);
        this.box_name = "CompositionToDecodeBox";
      }
      static {
        this.fourcc = "cslg";
      }
      parse(stream) {
        this.parseFullHeader(stream);
        if (this.version === 0) {
          this.compositionToDTSShift = stream.readInt32();
          this.leastDecodeToDisplayDelta = stream.readInt32();
          this.greatestDecodeToDisplayDelta = stream.readInt32();
          this.compositionStartTime = stream.readInt32();
          this.compositionEndTime = stream.readInt32();
        } else if (this.version === 1) {
          this.compositionToDTSShift = stream.readInt64();
          this.leastDecodeToDisplayDelta = stream.readInt64();
          this.greatestDecodeToDisplayDelta = stream.readInt64();
          this.compositionStartTime = stream.readInt64();
          this.compositionEndTime = stream.readInt64();
        }
      }
      /** @bundle writing/cslg.js */
      write(stream) {
        this.version = 0;
        if (this.compositionToDTSShift > INT32_MAX || this.leastDecodeToDisplayDelta > INT32_MAX || this.greatestDecodeToDisplayDelta > INT32_MAX || this.compositionStartTime > INT32_MAX || this.compositionEndTime > INT32_MAX) this.version = 1;
        this.flags = 0;
        if (this.version === 0) {
          this.size = 20;
          this.writeHeader(stream);
          stream.writeInt32(this.compositionToDTSShift);
          stream.writeInt32(this.leastDecodeToDisplayDelta);
          stream.writeInt32(this.greatestDecodeToDisplayDelta);
          stream.writeInt32(this.compositionStartTime);
          stream.writeInt32(this.compositionEndTime);
        } else if (this.version === 1) {
          this.size = 40;
          this.writeHeader(stream);
          stream.writeInt64(this.compositionToDTSShift);
          stream.writeInt64(this.leastDecodeToDisplayDelta);
          stream.writeInt64(this.greatestDecodeToDisplayDelta);
          stream.writeInt64(this.compositionStartTime);
          stream.writeInt64(this.compositionEndTime);
        }
      }
    };
    cttsBox = class extends FullBox {
      constructor(..._args) {
        super(..._args);
        this.box_name = "CompositionOffsetBox";
      }
      static {
        this.fourcc = "ctts";
      }
      parse(stream) {
        this.parseFullHeader(stream);
        const entry_count = stream.readUint32();
        this.sample_counts = [];
        this.sample_offsets = [];
        if (this.version === 0) for (let i = 0; i < entry_count; i++) {
          this.sample_counts.push(stream.readUint32());
          const value = stream.readInt32();
          if (value < 0) Log.warn("BoxParser", "ctts box uses negative values without using version 1");
          this.sample_offsets.push(value);
        }
        else if (this.version === 1) for (let i = 0; i < entry_count; i++) {
          this.sample_counts.push(stream.readUint32());
          this.sample_offsets.push(stream.readInt32());
        }
      }
      /** @bundle writing/ctts.js */
      write(stream) {
        this.version = this.sample_offsets.some((offset) => offset < 0) ? 1 : 0;
        this.flags = 0;
        this.size = 4 + 8 * this.sample_counts.length;
        this.writeHeader(stream);
        stream.writeUint32(this.sample_counts.length);
        for (let i = 0; i < this.sample_counts.length; i++) {
          stream.writeUint32(this.sample_counts[i]);
          if (this.version === 1) stream.writeInt32(this.sample_offsets[i]);
          else stream.writeUint32(this.sample_offsets[i]);
        }
      }
      /** @bundle box-unpack.js */
      unpack(samples) {
        let k = 0;
        for (let i = 0; i < this.sample_counts.length; i++) for (let j = 0; j < this.sample_counts[i]; j++) {
          samples[k].pts = samples[k].dts + this.sample_offsets[i];
          k++;
        }
      }
    };
    dac3Box = class extends Box {
      constructor(..._args) {
        super(..._args);
        this.box_name = "AC3SpecificBox";
      }
      static {
        this.fourcc = "dac3";
      }
      parse(stream) {
        const tmp_byte1 = stream.readUint8();
        const tmp_byte2 = stream.readUint8();
        const tmp_byte3 = stream.readUint8();
        this.fscod = tmp_byte1 >> 6;
        this.bsid = tmp_byte1 >> 1 & 31;
        this.bsmod = (tmp_byte1 & 1) << 2 | tmp_byte2 >> 6 & 3;
        this.acmod = tmp_byte2 >> 3 & 7;
        this.lfeon = tmp_byte2 >> 2 & 1;
        this.bit_rate_code = tmp_byte2 & 3 | tmp_byte3 >> 5 & 7;
      }
    };
    dec3Box = class extends Box {
      constructor(..._args) {
        super(..._args);
        this.box_name = "EC3SpecificBox";
      }
      static {
        this.fourcc = "dec3";
      }
      parse(stream) {
        const tmp_16 = stream.readUint16();
        this.data_rate = tmp_16 >> 3;
        this.num_ind_sub = tmp_16 & 7;
        this.ind_subs = [];
        for (let i = 0; i < this.num_ind_sub + 1; i++) {
          const tmp_byte1 = stream.readUint8();
          const tmp_byte2 = stream.readUint8();
          const tmp_byte3 = stream.readUint8();
          const ind_sub = {
            fscod: tmp_byte1 >> 6,
            bsid: tmp_byte1 >> 1 & 31,
            bsmod: (tmp_byte1 & 1) << 4 | tmp_byte2 >> 4 & 15,
            acmod: tmp_byte2 >> 1 & 7,
            lfeon: tmp_byte2 & 1,
            num_dep_sub: tmp_byte3 >> 1 & 15
          };
          this.ind_subs.push(ind_sub);
          if (ind_sub.num_dep_sub > 0) ind_sub.chan_loc = (tmp_byte3 & 1) << 8 | stream.readUint8();
        }
      }
    };
    dfLaBox = class extends FullBox {
      constructor(..._args) {
        super(..._args);
        this.box_name = "FLACSpecificBox";
      }
      static {
        this.fourcc = "dfLa";
      }
      parse(stream) {
        this.parseFullHeader(stream);
        const BLOCKTYPE_MASK = 127;
        const LASTMETADATABLOCKFLAG_MASK = 128;
        const boxesFound = [];
        const knownBlockTypes = [
          "STREAMINFO",
          "PADDING",
          "APPLICATION",
          "SEEKTABLE",
          "VORBIS_COMMENT",
          "CUESHEET",
          "PICTURE",
          "RESERVED"
        ];
        let flagAndType;
        do {
          flagAndType = stream.readUint8();
          const type = Math.min(flagAndType & BLOCKTYPE_MASK, knownBlockTypes.length - 1);
          if (!type) {
            stream.readUint8Array(13);
            this.samplerate = stream.readUint32() >> 12;
            stream.readUint8Array(20);
          } else stream.readUint8Array(stream.readUint24());
          boxesFound.push(knownBlockTypes[type]);
        } while (flagAndType & LASTMETADATABLOCKFLAG_MASK);
        this.numMetadataBlocks = boxesFound.length + " (" + boxesFound.join(", ") + ")";
      }
    };
    dimmBox = class extends Box {
      constructor(..._args) {
        super(..._args);
        this.box_name = "hintimmediateBytesSent";
      }
      static {
        this.fourcc = "dimm";
      }
      parse(stream) {
        this.bytessent = stream.readUint64();
      }
    };
    dmax = class extends Box {
      constructor(..._args) {
        super(..._args);
        this.box_name = "hintlongestpacket";
      }
      static {
        this.fourcc = "dmax";
      }
      parse(stream) {
        this.time = stream.readUint32();
      }
    };
    dmedBox = class extends Box {
      constructor(..._args) {
        super(..._args);
        this.box_name = "hintmediaBytesSent";
      }
      static {
        this.fourcc = "dmed";
      }
      parse(stream) {
        this.bytessent = stream.readUint64();
      }
    };
    dOpsBox = class extends Box {
      constructor(..._args) {
        super(..._args);
        this.box_name = "OpusSpecificBox";
      }
      static {
        this.fourcc = "dOps";
      }
      parse(stream) {
        this.Version = stream.readUint8();
        this.OutputChannelCount = stream.readUint8();
        this.PreSkip = stream.readUint16();
        this.InputSampleRate = stream.readUint32();
        this.OutputGain = stream.readInt16();
        this.ChannelMappingFamily = stream.readUint8();
        if (this.ChannelMappingFamily !== 0) {
          this.StreamCount = stream.readUint8();
          this.CoupledCount = stream.readUint8();
          this.ChannelMapping = [];
          for (let i = 0; i < this.OutputChannelCount; i++) this.ChannelMapping[i] = stream.readUint8();
        }
      }
      write(stream) {
        this.size = 11;
        if (this.ChannelMappingFamily !== 0) this.size += 2 + this.OutputChannelCount;
        this.writeHeader(stream);
        stream.writeUint8(this.Version);
        stream.writeUint8(this.OutputChannelCount);
        stream.writeUint16(this.PreSkip);
        stream.writeUint32(this.InputSampleRate);
        stream.writeInt16(this.OutputGain);
        stream.writeUint8(this.ChannelMappingFamily);
        if (this.ChannelMappingFamily !== 0) {
          stream.writeUint8(this.StreamCount);
          stream.writeUint8(this.CoupledCount);
          for (let i = 0; i < this.OutputChannelCount; i++) stream.writeUint8(this.ChannelMapping[i]);
        }
      }
    };
    drepBox = class extends Box {
      constructor(..._args) {
        super(..._args);
        this.box_name = "hintrepeatedBytesSent";
      }
      static {
        this.fourcc = "drep";
      }
      parse(stream) {
        this.bytessent = stream.readUint64();
      }
    };
    elstBox = class extends FullBox {
      constructor(..._args) {
        super(..._args);
        this.box_name = "EditListBox";
      }
      static {
        this.fourcc = "elst";
      }
      parse(stream) {
        this.parseFullHeader(stream);
        this.entries = [];
        const entry_count = stream.readUint32();
        for (let i = 0; i < entry_count; i++) {
          const entry = {
            segment_duration: this.version === 1 ? stream.readUint64() : stream.readUint32(),
            media_time: this.version === 1 ? stream.readInt64() : stream.readInt32(),
            media_rate_integer: stream.readInt16(),
            media_rate_fraction: stream.readInt16()
          };
          this.entries.push(entry);
        }
      }
      /** @bundle writing/elst.js */
      write(stream) {
        const useVersion1 = this.entries.some((entry) => entry.segment_duration > MAX_UINT32 || entry.media_time > MAX_UINT32) || this.version === 1;
        this.version = useVersion1 ? 1 : 0;
        this.size = 4 + 12 * this.entries.length;
        this.size += useVersion1 ? 8 * this.entries.length : 0;
        this.writeHeader(stream);
        stream.writeUint32(this.entries.length);
        for (let i = 0; i < this.entries.length; i++) {
          const entry = this.entries[i];
          if (useVersion1) {
            stream.writeUint64(entry.segment_duration);
            stream.writeInt64(entry.media_time);
          } else {
            stream.writeUint32(entry.segment_duration);
            stream.writeInt32(entry.media_time);
          }
          stream.writeInt16(entry.media_rate_integer);
          stream.writeInt16(entry.media_rate_fraction);
        }
      }
    };
    EntityToGroup = class extends FullBox {
      parse(stream) {
        this.parseFullHeader(stream);
        this.group_id = stream.readUint32();
        this.num_entities_in_group = stream.readUint32();
        this.entity_ids = [];
        for (let i = 0; i < this.num_entities_in_group; i++) {
          const entity_id = stream.readUint32();
          this.entity_ids.push(entity_id);
        }
      }
    };
    aebrBox = class extends EntityToGroup {
      constructor(..._args) {
        super(..._args);
        this.box_name = "Auto exposure bracketing";
      }
      static {
        this.fourcc = "aebr";
      }
    };
    afbrBox = class extends EntityToGroup {
      constructor(..._args2) {
        super(..._args2);
        this.box_name = "Flash exposure information";
      }
      static {
        this.fourcc = "afbr";
      }
    };
    albcBox = class extends EntityToGroup {
      constructor(..._args3) {
        super(..._args3);
        this.box_name = "Album collection";
      }
      static {
        this.fourcc = "albc";
      }
    };
    altrBox = class extends EntityToGroup {
      constructor(..._args4) {
        super(..._args4);
        this.box_name = "Alternative entity";
      }
      static {
        this.fourcc = "altr";
      }
    };
    brstBox = class extends EntityToGroup {
      constructor(..._args5) {
        super(..._args5);
        this.box_name = "Burst image";
      }
      static {
        this.fourcc = "brst";
      }
    };
    dobrBox = class extends EntityToGroup {
      constructor(..._args6) {
        super(..._args6);
        this.box_name = "Depth of field bracketing";
      }
      static {
        this.fourcc = "dobr";
      }
    };
    eqivBox = class extends EntityToGroup {
      constructor(..._args7) {
        super(..._args7);
        this.box_name = "Equivalent entity";
      }
      static {
        this.fourcc = "eqiv";
      }
    };
    favcBox = class extends EntityToGroup {
      constructor(..._args8) {
        super(..._args8);
        this.box_name = "Favorites collection";
      }
      static {
        this.fourcc = "favc";
      }
    };
    fobrBox = class extends EntityToGroup {
      constructor(..._args9) {
        super(..._args9);
        this.box_name = "Focus bracketing";
      }
      static {
        this.fourcc = "fobr";
      }
    };
    iaugBox = class extends EntityToGroup {
      constructor(..._args10) {
        super(..._args10);
        this.box_name = "Image item with an audio track";
      }
      static {
        this.fourcc = "iaug";
      }
    };
    panoBox = class extends EntityToGroup {
      constructor(..._args11) {
        super(..._args11);
        this.box_name = "Panorama";
      }
      static {
        this.fourcc = "pano";
      }
    };
    slidBox = class extends EntityToGroup {
      constructor(..._args12) {
        super(..._args12);
        this.box_name = "Slideshow";
      }
      static {
        this.fourcc = "slid";
      }
    };
    sterBox = class extends EntityToGroup {
      constructor(..._args13) {
        super(..._args13);
        this.box_name = "Stereo";
      }
      static {
        this.fourcc = "ster";
      }
    };
    tsynBox = class extends EntityToGroup {
      constructor(..._args14) {
        super(..._args14);
        this.box_name = "Time-synchronized capture";
      }
      static {
        this.fourcc = "tsyn";
      }
    };
    wbbrBox = class extends EntityToGroup {
      constructor(..._args15) {
        super(..._args15);
        this.box_name = "White balance bracketing";
      }
      static {
        this.fourcc = "wbbr";
      }
    };
    prgrBox = class extends EntityToGroup {
      constructor(..._args16) {
        super(..._args16);
        this.box_name = "Progressive rendering";
      }
      static {
        this.fourcc = "prgr";
      }
    };
    pymdBox = class extends EntityToGroup {
      constructor(..._args17) {
        super(..._args17);
        this.box_name = "Image pyramid";
      }
      static {
        this.fourcc = "pymd";
      }
      parse(stream) {
        this.parseFullHeader(stream);
        this.group_id = stream.readUint32();
        this.num_entities_in_group = stream.readUint32();
        this.entity_ids = [];
        for (let i = 0; i < this.num_entities_in_group; i++) {
          const entity_id = stream.readUint32();
          this.entity_ids.push(entity_id);
        }
        this.tile_size_x = stream.readUint16();
        this.tile_size_y = stream.readUint16();
        this.layer_binning = [];
        this.tiles_in_layer_column_minus1 = [];
        this.tiles_in_layer_row_minus1 = [];
        for (let i = 0; i < this.num_entities_in_group; i++) {
          this.layer_binning[i] = stream.readUint16();
          this.tiles_in_layer_row_minus1[i] = stream.readUint16();
          this.tiles_in_layer_column_minus1[i] = stream.readUint16();
        }
      }
    };
    fielBox = class extends Box {
      constructor(..._args) {
        super(..._args);
        this.box_name = "FieldHandlingBox";
      }
      static {
        this.fourcc = "fiel";
      }
      parse(stream) {
        this.fieldCount = stream.readUint8();
        this.fieldOrdering = stream.readUint8();
      }
    };
    frmaBox = class extends Box {
      constructor(..._args) {
        super(..._args);
        this.box_name = "OriginalFormatBox";
      }
      static {
        this.fourcc = "frma";
      }
      parse(stream) {
        this.data_format = stream.readString(4);
      }
    };
    imirBox = class extends Box {
      constructor(..._args) {
        super(..._args);
        this.box_name = "ImageMirror";
      }
      static {
        this.fourcc = "imir";
      }
      parse(stream) {
        const tmp = stream.readUint8();
        this.reserved = tmp >> 7;
        this.axis = tmp & 1;
      }
    };
    ipmaBox = class extends FullBox {
      constructor(..._args) {
        super(..._args);
        this.box_name = "ItemPropertyAssociationBox";
      }
      static {
        this.fourcc = "ipma";
      }
      parse(stream) {
        this.parseFullHeader(stream);
        const entry_count = stream.readUint32();
        this.associations = [];
        for (let i = 0; i < entry_count; i++) {
          const id = this.version < 1 ? stream.readUint16() : stream.readUint32();
          const props = [];
          const association_count = stream.readUint8();
          for (let j = 0; j < association_count; j++) {
            const tmp = stream.readUint8();
            props.push({
              essential: (tmp & 128) >> 7 === 1,
              property_index: this.flags & 1 ? (tmp & 127) << 8 | stream.readUint8() : tmp & 127
            });
          }
          this.associations.push({
            id,
            props
          });
        }
      }
    };
    irotBox = class extends Box {
      constructor(..._args) {
        super(..._args);
        this.box_name = "ImageRotation";
      }
      static {
        this.fourcc = "irot";
      }
      parse(stream) {
        this.angle = stream.readUint8() & 3;
      }
    };
    ispeBox = class extends FullBox {
      constructor(..._args) {
        super(..._args);
        this.box_name = "ImageSpatialExtentsProperty";
      }
      static {
        this.fourcc = "ispe";
      }
      parse(stream) {
        this.parseFullHeader(stream);
        this.image_width = stream.readUint32();
        this.image_height = stream.readUint32();
      }
    };
    itaiBox = class extends FullBox {
      constructor(..._args) {
        super(..._args);
        this.box_name = "TAITimestampBox";
      }
      static {
        this.fourcc = "itai";
      }
      parse(stream) {
        this.TAI_timestamp = stream.readUint64();
        const status_bits = stream.readUint8();
        this.sychronization_state = status_bits >> 7 & 1;
        this.timestamp_generation_failure = status_bits >> 6 & 1;
        this.timestamp_is_modified = status_bits >> 5 & 1;
      }
    };
    kindBox = class extends FullBox {
      constructor(..._args) {
        super(..._args);
        this.box_name = "KindBox";
      }
      static {
        this.fourcc = "kind";
      }
      parse(stream) {
        this.parseFullHeader(stream);
        this.schemeURI = stream.readCString();
        if (!this.isEndOfBox(stream)) this.value = stream.readCString();
      }
      /** @bundle writing/kind.js */
      write(stream) {
        this.version = 0;
        this.flags = 0;
        this.size = this.schemeURI.length + 1 + (this.value ? this.value.length + 1 : 0);
        this.writeHeader(stream);
        stream.writeCString(this.schemeURI);
        if (this.value) stream.writeCString(this.value);
      }
    };
    levaBox = class extends FullBox {
      constructor(..._args) {
        super(..._args);
        this.box_name = "LevelAssignmentBox";
      }
      static {
        this.fourcc = "leva";
      }
      parse(stream) {
        this.parseFullHeader(stream);
        const count = stream.readUint8();
        this.levels = [];
        for (let i = 0; i < count; i++) {
          const level = {};
          this.levels[i] = level;
          level.track_ID = stream.readUint32();
          const tmp_byte = stream.readUint8();
          level.padding_flag = tmp_byte >> 7;
          level.assignment_type = tmp_byte & 127;
          switch (level.assignment_type) {
            case 0:
              level.grouping_type = stream.readString(4);
              break;
            case 1:
              level.grouping_type = stream.readString(4);
              level.grouping_type_parameter = stream.readUint32();
              break;
            case 2:
              break;
            case 3:
              break;
            case 4:
              level.sub_track_id = stream.readUint32();
              break;
            default:
              Log.warn("BoxParser", `Unknown level assignment type: ${level.assignment_type}`);
          }
        }
      }
    };
    lhvCBox = class extends Box {
      constructor(..._args) {
        super(..._args);
        this.box_name = "LHEVCConfigurationBox";
      }
      static {
        this.fourcc = "lhvC";
      }
      parse(stream) {
        this.configurationVersion = stream.readUint8();
        this.min_spatial_segmentation_idc = stream.readUint16() & 4095;
        this.parallelismType = stream.readUint8() & 3;
        let tmp_byte = stream.readUint8();
        this.numTemporalLayers = (tmp_byte & 13) >> 3;
        this.temporalIdNested = (tmp_byte & 4) >> 2;
        this.lengthSizeMinusOne = tmp_byte & 3;
        this.nalu_arrays = [];
        const numOfArrays = stream.readUint8();
        for (let i = 0; i < numOfArrays; i++) {
          const nalu_array = [];
          this.nalu_arrays.push(nalu_array);
          tmp_byte = stream.readUint8();
          nalu_array.completeness = (tmp_byte & 128) >> 7;
          nalu_array.nalu_type = tmp_byte & 63;
          const numNalus = stream.readUint16();
          for (let j = 0; j < numNalus; j++) {
            const length = stream.readUint16();
            nalu_array.push({ data: stream.readUint8Array(length) });
          }
        }
      }
    };
    lselBox = class extends Box {
      constructor(..._args) {
        super(..._args);
        this.box_name = "LayerSelectorProperty";
      }
      static {
        this.fourcc = "lsel";
      }
      parse(stream) {
        this.layer_id = stream.readUint16();
      }
    };
    maxrBox = class extends Box {
      constructor(..._args) {
        super(..._args);
        this.box_name = "hintmaxrate";
      }
      static {
        this.fourcc = "maxr";
      }
      parse(stream) {
        this.period = stream.readUint32();
        this.bytes = stream.readUint32();
      }
    };
    ColorPoint = class {
      constructor(x, y) {
        this.x = x;
        this.y = y;
      }
      toString() {
        return "(" + this.x + "," + this.y + ")";
      }
    };
    mdcvBox = class extends Box {
      constructor(..._args) {
        super(..._args);
        this.box_name = "MasteringDisplayColourVolumeBox";
      }
      static {
        this.fourcc = "mdcv";
      }
      parse(stream) {
        this.display_primaries = [];
        this.display_primaries[0] = new ColorPoint(stream.readUint16(), stream.readUint16());
        this.display_primaries[1] = new ColorPoint(stream.readUint16(), stream.readUint16());
        this.display_primaries[2] = new ColorPoint(stream.readUint16(), stream.readUint16());
        this.white_point = new ColorPoint(stream.readUint16(), stream.readUint16());
        this.max_display_mastering_luminance = stream.readUint32();
        this.min_display_mastering_luminance = stream.readUint32();
      }
    };
    mfroBox = class extends FullBox {
      constructor(..._args) {
        super(..._args);
        this.box_name = "MovieFragmentRandomAccessOffsetBox";
      }
      static {
        this.fourcc = "mfro";
      }
      parse(stream) {
        this.parseFullHeader(stream);
        this._size = stream.readUint32();
      }
    };
    mskCBox = class extends FullBox {
      constructor(..._args) {
        super(..._args);
        this.box_name = "MaskConfigurationProperty";
      }
      static {
        this.fourcc = "mskC";
      }
      parse(stream) {
        this.parseFullHeader(stream);
        this.bits_per_pixel = stream.readUint8();
      }
    };
    npckBox = class extends Box {
      constructor(..._args) {
        super(..._args);
        this.box_name = "hintPacketsSent";
      }
      static {
        this.fourcc = "npck";
      }
      parse(stream) {
        this.packetssent = stream.readUint32();
      }
    };
    numpBox = class extends Box {
      constructor(..._args) {
        super(..._args);
        this.box_name = "hintPacketsSent";
      }
      static {
        this.fourcc = "nump";
      }
      parse(stream) {
        this.packetssent = stream.readUint64();
      }
    };
    PaddingBit = class {
      constructor(pad1, pad2) {
        this.pad1 = pad1;
        this.pad2 = pad2;
      }
    };
    padbBox = class extends FullBox {
      constructor(..._args) {
        super(..._args);
        this.box_name = "PaddingBitsBox";
      }
      static {
        this.fourcc = "padb";
      }
      parse(stream) {
        this.parseFullHeader(stream);
        const sample_count = stream.readUint32();
        this.padbits = [];
        for (let i = 0; i < Math.floor((sample_count + 1) / 2); i++) {
          const bits = stream.readUint8();
          const pad1 = (bits & 112) >> 4;
          const pad2 = bits & 7;
          this.padbits.push(new PaddingBit(pad1, pad2));
        }
      }
    };
    paspBox = class extends Box {
      constructor(..._args) {
        super(..._args);
        this.box_name = "PixelAspectRatioBox";
      }
      static {
        this.fourcc = "pasp";
      }
      parse(stream) {
        this.hSpacing = stream.readUint32();
        this.vSpacing = stream.readUint32();
      }
    };
    paylBox = class extends Box {
      constructor(..._args) {
        super(..._args);
        this.box_name = "CuePayloadBox";
      }
      static {
        this.fourcc = "payl";
      }
      parse(stream) {
        this.text = stream.readString(this.size - this.hdr_size);
      }
    };
    paytBox = class extends Box {
      constructor(..._args) {
        super(..._args);
        this.box_name = "hintpayloadID";
      }
      static {
        this.fourcc = "payt";
      }
      parse(stream) {
        this.payloadID = stream.readUint32();
        const count = stream.readUint8();
        this.rtpmap_string = stream.readString(count);
      }
    };
    pdinBox = class extends FullBox {
      constructor(..._args) {
        super(..._args);
        this.box_name = "ProgressiveDownloadInfoBox";
        this.rate = [];
        this.initial_delay = [];
      }
      static {
        this.fourcc = "pdin";
      }
      parse(stream) {
        this.parseFullHeader(stream);
        const count = (this.size - this.hdr_size) / 8;
        for (let i = 0; i < count; i++) {
          this.rate[i] = stream.readUint32();
          this.initial_delay[i] = stream.readUint32();
        }
      }
    };
    pixiBox = class extends FullBox {
      constructor(..._args) {
        super(..._args);
        this.box_name = "PixelInformationProperty";
      }
      static {
        this.fourcc = "pixi";
      }
      parse(stream) {
        this.parseFullHeader(stream);
        this.num_channels = stream.readUint8();
        this.bits_per_channels = [];
        for (let i = 0; i < this.num_channels; i++) this.bits_per_channels[i] = stream.readUint8();
      }
    };
    pmaxBox = class extends Box {
      constructor(..._args) {
        super(..._args);
        this.box_name = "hintlargestpacket";
      }
      static {
        this.fourcc = "pmax";
      }
      parse(stream) {
        this.bytes = stream.readUint32();
      }
    };
    prdiBox = class extends FullBox {
      constructor(..._args) {
        super(..._args);
        this.box_name = "ProgressiveDerivedImageItemInformationProperty";
      }
      static {
        this.fourcc = "prdi";
      }
      parse(stream) {
        this.parseFullHeader(stream);
        this.step_count = stream.readUint16();
        this.item_count = [];
        if (this.flags & 2) for (let i = 0; i < this.step_count; i++) this.item_count[i] = stream.readUint16();
      }
    };
    prfrBox = class extends FullBox {
      constructor(..._args) {
        super(..._args);
        this.box_name = "ProjectionFormatBox";
      }
      static {
        this.fourcc = "prfr";
      }
      parse(stream) {
        this.parseFullHeader(stream);
        this.projection_type = stream.readUint8() & 31;
      }
    };
    prftBox = class extends FullBox {
      constructor(..._args) {
        super(..._args);
        this.box_name = "ProducerReferenceTimeBox";
      }
      static {
        this.fourcc = "prft";
      }
      parse(stream) {
        this.parseFullHeader(stream);
        this.ref_track_id = stream.readUint32();
        this.ntp_timestamp = stream.readUint64();
        if (this.version === 0) this.media_time = stream.readUint32();
        else this.media_time = stream.readUint64();
      }
    };
    psshBox = class extends FullBox {
      constructor(..._args) {
        super(..._args);
        this.box_name = "ProtectionSystemSpecificHeaderBox";
      }
      static {
        this.fourcc = "pssh";
      }
      parse(stream) {
        this.parseFullHeader(stream);
        this.system_id = parseHex16(stream);
        this.kid = [];
        if (this.version > 0) {
          const count = stream.readUint32();
          for (let i = 0; i < count; i++) this.kid[i] = parseHex16(stream);
        }
        const datasize = stream.readUint32();
        if (datasize > 0) this.protection_data = stream.readUint8Array(datasize);
      }
    };
    clefBox = class extends FullBox {
      constructor(..._args) {
        super(..._args);
        this.box_name = "TrackCleanApertureDimensionsBox";
      }
      static {
        this.fourcc = "clef";
      }
      parse(stream) {
        this.parseFullHeader(stream);
        this.width = stream.readUint32();
        this.height = stream.readUint32();
      }
    };
    dataBox = class extends Box {
      constructor(..._args) {
        super(..._args);
        this.box_name = "DataBox";
      }
      static {
        this.fourcc = "data";
      }
      static {
        this.Types = {
          RESERVED: 0,
          UTF8: 1,
          UTF16: 2,
          SJIS: 3,
          UTF8_SORT: 4,
          UTF16_SORT: 5,
          JPEG: 13,
          PNG: 14,
          BE_SIGNED_INT: 21,
          BE_UNSIGNED_INT: 22,
          BE_FLOAT32: 23,
          BE_FLOAT64: 24,
          BMP: 27,
          QT_ATOM: 28,
          BE_SIGNED_INT8: 65,
          BE_SIGNED_INT16: 66,
          BE_SIGNED_INT32: 67,
          BE_FLOAT32_POINT: 70,
          BE_FLOAT32_DIMENSIONS: 71,
          BE_FLOAT32_RECT: 72,
          BE_SIGNED_INT64: 74,
          BE_UNSIGNED_INT8: 75,
          BE_UNSIGNED_INT16: 76,
          BE_UNSIGNED_INT32: 77,
          BE_UNSIGNED_INT64: 78,
          BE_FLOAT64_AFFINE_TRANSFORM: 79
        };
      }
      parse(stream) {
        this.valueType = stream.readUint32();
        this.country = stream.readUint16();
        if (this.country > 255) {
          stream.seek(stream.getPosition() - 2);
          this.countryString = stream.readString(2);
        }
        this.language = stream.readUint16();
        if (this.language > 255) {
          stream.seek(stream.getPosition() - 2);
          this.parseLanguage(stream);
        }
        this.raw = stream.readUint8Array(this.size - this.hdr_size - 8);
        this.value = parseItifData(this.valueType, this.raw);
      }
    };
    enofBox = class extends FullBox {
      constructor(..._args) {
        super(..._args);
        this.box_name = "TrackEncodedPixelsDimensionsBox";
      }
      static {
        this.fourcc = "enof";
      }
      parse(stream) {
        this.parseFullHeader(stream);
        this.width = stream.readUint32();
        this.height = stream.readUint32();
      }
    };
    ilstBox = class extends Box {
      constructor(..._args) {
        super(..._args);
        this.box_name = "IlstBox";
      }
      static {
        this.fourcc = "ilst";
      }
      parse(stream) {
        this.list = {};
        let total = this.size - this.hdr_size;
        while (total > 0) {
          const size = stream.readUint32();
          const index = stream.readUint32();
          const res = parseOneBox(stream, false, size - 8);
          if (res.code === 1) this.list[index] = res.box;
          total -= size;
        }
      }
    };
    keysBox = class extends FullBox {
      constructor(..._args) {
        super(..._args);
        this.box_name = "KeysBox";
      }
      static {
        this.fourcc = "keys";
      }
      parse(stream) {
        this.parseFullHeader(stream);
        this.count = stream.readUint32();
        this.keys = {};
        for (let i = 0; i < this.count; i++) {
          const len = stream.readUint32();
          this.keys[i + 1] = stream.readString(len - 4);
        }
      }
    };
    profBox = class extends FullBox {
      constructor(..._args) {
        super(..._args);
        this.box_name = "TrackProductionApertureDimensionsBox";
      }
      static {
        this.fourcc = "prof";
      }
      parse(stream) {
        this.parseFullHeader(stream);
        this.width = stream.readUint32();
        this.height = stream.readUint32();
      }
    };
    taptBox = class extends ContainerBox {
      constructor(..._args) {
        super(..._args);
        this.box_name = "TrackApertureModeDimensionsBox";
        this.clefs = [];
        this.profs = [];
        this.enofs = [];
        this.subBoxNames = [
          "clef",
          "prof",
          "enof"
        ];
      }
      static {
        this.fourcc = "tapt";
      }
    };
    rtp_Box = class extends Box {
      constructor(..._args) {
        super(..._args);
        this.box_name = "rtpmoviehintinformation";
      }
      static {
        this.fourcc = "rtp ";
      }
      parse(stream) {
        this.descriptionformat = stream.readString(4);
        this.sdptext = stream.readString(this.size - this.hdr_size - 4);
      }
    };
    saioBox = class extends FullBox {
      constructor(..._args) {
        super(..._args);
        this.box_name = "SampleAuxiliaryInformationOffsetsBox";
      }
      static {
        this.fourcc = "saio";
      }
      parse(stream) {
        this.parseFullHeader(stream);
        if (this.flags & 1) {
          this.aux_info_type = stream.readString(4);
          this.aux_info_type_parameter = stream.readUint32();
        }
        this.entry_count = stream.readUint32();
        this.offset = [];
        for (let i = 0; i < this.entry_count; i++) if (this.version === 0) this.offset[i] = stream.readUint32();
        else this.offset[i] = stream.readUint64();
      }
    };
    saizBox = class extends FullBox {
      constructor(..._args) {
        super(..._args);
        this.box_name = "SampleAuxiliaryInformationSizesBox";
      }
      static {
        this.fourcc = "saiz";
      }
      parse(stream) {
        this.parseFullHeader(stream);
        if (this.flags & 1) {
          this.aux_info_type = stream.readString(4);
          this.aux_info_type_parameter = stream.readUint32();
        }
        this.default_sample_info_size = stream.readUint8();
        this.sample_count = stream.readUint32();
        this.sample_info_size = [];
        if (this.default_sample_info_size === 0) for (let i = 0; i < this.sample_count; i++) this.sample_info_size[i] = stream.readUint8();
      }
    };
    Pixel = class {
      constructor(bad_pixel_row, bad_pixel_column) {
        this.bad_pixel_row = bad_pixel_row;
        this.bad_pixel_column = bad_pixel_column;
      }
      toString() {
        return "[row: " + this.bad_pixel_row + ", column: " + this.bad_pixel_column + "]";
      }
    };
    sbpmBox = class extends FullBox {
      constructor(..._args) {
        super(..._args);
        this.box_name = "SensorBadPixelsMapBox";
      }
      static {
        this.fourcc = "sbpm";
      }
      parse(stream) {
        this.parseFullHeader(stream);
        this.component_count = stream.readUint16();
        this.component_index = [];
        for (let i = 0; i < this.component_count; i++) this.component_index.push(stream.readUint16());
        const flags = stream.readUint8();
        this.correction_applied = 128 === (flags & 128);
        this.num_bad_rows = stream.readUint32();
        this.num_bad_cols = stream.readUint32();
        this.num_bad_pixels = stream.readUint32();
        this.bad_rows = [];
        this.bad_columns = [];
        this.bad_pixels = [];
        for (let i = 0; i < this.num_bad_rows; i++) this.bad_rows.push(stream.readUint32());
        for (let i = 0; i < this.num_bad_cols; i++) this.bad_columns.push(stream.readUint32());
        for (let i = 0; i < this.num_bad_pixels; i++) {
          const row = stream.readUint32();
          const col = stream.readUint32();
          this.bad_pixels.push(new Pixel(row, col));
        }
      }
    };
    schmBox = class extends FullBox {
      constructor(..._args) {
        super(..._args);
        this.box_name = "SchemeTypeBox";
      }
      static {
        this.fourcc = "schm";
      }
      parse(stream) {
        this.parseFullHeader(stream);
        this.scheme_type = stream.readString(4);
        this.scheme_version = stream.readUint32();
        if (this.flags & 1) this.scheme_uri = stream.readString(this.size - this.hdr_size - 8);
      }
    };
    sdp_Box = class extends Box {
      constructor(..._args) {
        super(..._args);
        this.box_name = "rtptracksdphintinformation";
      }
      static {
        this.fourcc = "sdp ";
      }
      parse(stream) {
        this.sdptext = stream.readString(this.size - this.hdr_size);
      }
    };
    sencBox = class extends FullBox {
      constructor(..._args) {
        super(..._args);
        this.box_name = "SampleEncryptionBox";
      }
      static {
        this.fourcc = "senc";
      }
    };
    SmDmBox = class extends FullBox {
      constructor(..._args) {
        super(..._args);
        this.box_name = "SMPTE2086MasteringDisplayMetadataBox";
      }
      static {
        this.fourcc = "SmDm";
      }
      parse(stream) {
        this.parseFullHeader(stream);
        this.primaryRChromaticity_x = stream.readUint16();
        this.primaryRChromaticity_y = stream.readUint16();
        this.primaryGChromaticity_x = stream.readUint16();
        this.primaryGChromaticity_y = stream.readUint16();
        this.primaryBChromaticity_x = stream.readUint16();
        this.primaryBChromaticity_y = stream.readUint16();
        this.whitePointChromaticity_x = stream.readUint16();
        this.whitePointChromaticity_y = stream.readUint16();
        this.luminanceMax = stream.readUint32();
        this.luminanceMin = stream.readUint32();
      }
    };
    sratBox = class extends FullBox {
      constructor(..._args) {
        super(..._args);
        this.box_name = "SamplingRateBox";
      }
      static {
        this.fourcc = "srat";
      }
      parse(stream) {
        this.parseFullHeader(stream);
        this.sampling_rate = stream.readUint32();
      }
    };
    stdpBox = class extends FullBox {
      constructor(..._args) {
        super(..._args);
        this.box_name = "DegradationPriorityBox";
      }
      static {
        this.fourcc = "stdp";
      }
      parse(stream) {
        this.parseFullHeader(stream);
        const count = (this.size - this.hdr_size) / 2;
        this.priority = [];
        for (let i = 0; i < count; i++) this.priority[i] = stream.readUint16();
      }
    };
    striBox = class extends FullBox {
      constructor(..._args) {
        super(..._args);
        this.box_name = "SubTrackInformationBox";
      }
      static {
        this.fourcc = "stri";
      }
      parse(stream) {
        this.parseFullHeader(stream);
        this.switch_group = stream.readUint16();
        this.alternate_group = stream.readUint16();
        this.sub_track_id = stream.readUint32();
        const count = (this.size - this.hdr_size - 8) / 4;
        this.attribute_list = [];
        for (let i = 0; i < count; i++) this.attribute_list[i] = stream.readUint32();
      }
    };
    stsgBox = class extends FullBox {
      constructor(..._args) {
        super(..._args);
        this.box_name = "SubTrackSampleGroupBox";
      }
      static {
        this.fourcc = "stsg";
      }
      parse(stream) {
        this.parseFullHeader(stream);
        this.grouping_type = stream.readUint32();
        const count = stream.readUint16();
        this.group_description_index = [];
        for (let i = 0; i < count; i++) this.group_description_index[i] = stream.readUint32();
      }
    };
    stshBox = class extends FullBox {
      constructor(..._args) {
        super(..._args);
        this.box_name = "ShadowSyncSampleBox";
      }
      static {
        this.fourcc = "stsh";
      }
      parse(stream) {
        this.parseFullHeader(stream);
        const entry_count = stream.readUint32();
        this.shadowed_sample_numbers = [];
        this.sync_sample_numbers = [];
        if (this.version === 0) for (let i = 0; i < entry_count; i++) {
          this.shadowed_sample_numbers.push(stream.readUint32());
          this.sync_sample_numbers.push(stream.readUint32());
        }
      }
      write(stream) {
        this.version = 0;
        this.flags = 0;
        this.size = 4 + 8 * this.shadowed_sample_numbers.length;
        this.writeHeader(stream);
        stream.writeUint32(this.shadowed_sample_numbers.length);
        for (let i = 0; i < this.shadowed_sample_numbers.length; i++) {
          stream.writeUint32(this.shadowed_sample_numbers[i]);
          stream.writeUint32(this.sync_sample_numbers[i]);
        }
      }
    };
    stssBox = class extends FullBox {
      constructor(..._args) {
        super(..._args);
        this.box_name = "SyncSampleBox";
      }
      static {
        this.fourcc = "stss";
      }
      parse(stream) {
        this.parseFullHeader(stream);
        const entry_count = stream.readUint32();
        if (this.version === 0) {
          this.sample_numbers = [];
          for (let i = 0; i < entry_count; i++) this.sample_numbers.push(stream.readUint32());
        }
      }
      /** @bundle writing/stss.js */
      write(stream) {
        this.version = 0;
        this.flags = 0;
        this.size = 4 + 4 * this.sample_numbers.length;
        this.writeHeader(stream);
        stream.writeUint32(this.sample_numbers.length);
        stream.writeUint32Array(this.sample_numbers);
      }
    };
    stviBox = class extends FullBox {
      constructor(..._args) {
        super(..._args);
        this.box_name = "StereoVideoBox";
      }
      static {
        this.fourcc = "stvi";
      }
      parse(stream) {
        this.parseFullHeader(stream);
        const tmp32 = stream.readUint32();
        this.single_view_allowed = tmp32 & 3;
        this.stereo_scheme = stream.readUint32();
        const length = stream.readUint32();
        this.stereo_indication_type = stream.readString(length);
        this.boxes = [];
        while (stream.getPosition() < this.start + this.size) {
          const ret = parseOneBox(stream, false, this.size - (stream.getPosition() - this.start));
          if (ret.code === 1) {
            const box = ret.box;
            this.boxes.push(box);
            this[box.type] = box;
          } else return;
        }
      }
    };
    stz2Box = class extends FullBox {
      constructor(..._args) {
        super(..._args);
        this.box_name = "CompactSampleSizeBox";
      }
      static {
        this.fourcc = "stz2";
      }
      parse(stream) {
        this.parseFullHeader(stream);
        this.sample_sizes = [];
        if (this.version === 0) {
          this.reserved = stream.readUint24();
          this.field_size = stream.readUint8();
          const sample_count = stream.readUint32();
          if (this.field_size === 4) for (let i = 0; i < sample_count; i += 2) {
            const tmp = stream.readUint8();
            this.sample_sizes[i] = tmp >> 4 & 15;
            this.sample_sizes[i + 1] = tmp & 15;
          }
          else if (this.field_size === 8) for (let i = 0; i < sample_count; i++) this.sample_sizes[i] = stream.readUint8();
          else if (this.field_size === 16) for (let i = 0; i < sample_count; i++) this.sample_sizes[i] = stream.readUint16();
          else Log.error("BoxParser", "Error in length field in stz2 box", stream.isofile);
        }
      }
    };
    subsBox = class extends FullBox {
      constructor(..._args) {
        super(..._args);
        this.box_name = "SubSampleInformationBox";
      }
      static {
        this.fourcc = "subs";
      }
      parse(stream) {
        this.parseFullHeader(stream);
        const entry_count = stream.readUint32();
        this.entries = [];
        let subsample_count;
        for (let i = 0; i < entry_count; i++) {
          const sampleInfo = {};
          this.entries[i] = sampleInfo;
          sampleInfo.sample_delta = stream.readUint32();
          sampleInfo.subsamples = [];
          subsample_count = stream.readUint16();
          if (subsample_count > 0) for (let j = 0; j < subsample_count; j++) {
            const subsample = {};
            sampleInfo.subsamples.push(subsample);
            if (this.version === 1) subsample.size = stream.readUint32();
            else subsample.size = stream.readUint16();
            subsample.priority = stream.readUint8();
            subsample.discardable = stream.readUint8();
            subsample.codec_specific_parameters = stream.readUint32();
          }
        }
      }
    };
    taicBox = class extends FullBox {
      constructor(..._args) {
        super(..._args);
        this.box_name = "TAIClockInfoBox";
      }
      static {
        this.fourcc = "taic";
      }
      parse(stream) {
        this.time_uncertainty = stream.readUint64();
        this.clock_resolution = stream.readUint32();
        this.clock_drift_rate = stream.readInt32();
        const reserved_byte = stream.readUint8();
        this.clock_type = (reserved_byte & 192) >> 6;
      }
    };
    tencBox = class extends FullBox {
      constructor(..._args) {
        super(..._args);
        this.box_name = "TrackEncryptionBox";
      }
      static {
        this.fourcc = "tenc";
      }
      parse(stream) {
        this.parseFullHeader(stream);
        stream.readUint8();
        if (this.version === 0) stream.readUint8();
        else {
          const tmp = stream.readUint8();
          this.default_crypt_byte_block = tmp >> 4 & 15;
          this.default_skip_byte_block = tmp & 15;
        }
        this.default_isProtected = stream.readUint8();
        this.default_Per_Sample_IV_Size = stream.readUint8();
        this.default_KID = parseHex16(stream);
        if (this.default_isProtected === 1 && this.default_Per_Sample_IV_Size === 0) {
          this.default_constant_IV_size = stream.readUint8();
          this.default_constant_IV = stream.readUint8Array(this.default_constant_IV_size);
        }
      }
    };
    TfraEntry = class {
    };
    tfraBox = class extends FullBox {
      constructor(..._args) {
        super(..._args);
        this.box_name = "TrackFragmentRandomAccessBox";
      }
      static {
        this.fourcc = "tfra";
      }
      parse(stream) {
        this.parseFullHeader(stream);
        this.track_ID = stream.readUint32();
        stream.readUint24();
        const tmp_byte = stream.readUint8();
        this.length_size_of_traf_num = tmp_byte >> 4 & 3;
        this.length_size_of_trun_num = tmp_byte >> 2 & 3;
        this.length_size_of_sample_num = tmp_byte & 3;
        this.entries = [];
        const number_of_entries = stream.readUint32();
        for (let i = 0; i < number_of_entries; i++) {
          const entry = new TfraEntry();
          if (this.version === 1) {
            entry.time = stream.readUint64();
            entry.moof_offset = stream.readUint64();
          } else {
            entry.time = stream.readUint32();
            entry.moof_offset = stream.readUint32();
          }
          entry.traf_number = stream["readUint" + 8 * (this.length_size_of_traf_num + 1)]();
          entry.trun_number = stream["readUint" + 8 * (this.length_size_of_trun_num + 1)]();
          entry.sample_delta = stream["readUint" + 8 * (this.length_size_of_sample_num + 1)]();
          this.entries.push(entry);
        }
      }
    };
    tmaxBox = class extends Box {
      constructor(..._args) {
        super(..._args);
        this.box_name = "hintmaxrelativetime";
      }
      static {
        this.fourcc = "tmax";
      }
      parse(stream) {
        this.time = stream.readUint32();
      }
    };
    tminBox = class extends Box {
      constructor(..._args) {
        super(..._args);
        this.box_name = "hintminrelativetime";
      }
      static {
        this.fourcc = "tmin";
      }
      parse(stream) {
        this.time = stream.readUint32();
      }
    };
    totlBox = class extends Box {
      constructor(..._args) {
        super(..._args);
        this.box_name = "hintBytesSent";
      }
      static {
        this.fourcc = "totl";
      }
      parse(stream) {
        this.bytessent = stream.readUint32();
      }
    };
    tpayBox = class extends Box {
      constructor(..._args) {
        super(..._args);
        this.box_name = "hintBytesSent";
      }
      static {
        this.fourcc = "tpay";
      }
      parse(stream) {
        this.bytessent = stream.readUint32();
      }
    };
    tpylBox = class extends Box {
      constructor(..._args) {
        super(..._args);
        this.box_name = "hintBytesSent";
      }
      static {
        this.fourcc = "tpyl";
      }
      parse(stream) {
        this.bytessent = stream.readUint64();
      }
    };
    msrcTrackGroupTypeBox = class extends TrackGroupTypeBox {
      static {
        this.fourcc = "msrc";
      }
    };
    trefBox = class trefBox2 extends Box {
      constructor(..._args) {
        super(..._args);
        this.box_name = "TrackReferenceBox";
        this.references = [];
      }
      static {
        this.fourcc = "tref";
      }
      static {
        this.allowed_types = [
          "hint",
          "cdsc",
          "font",
          "hind",
          "vdep",
          "vplx",
          "subt",
          "thmb",
          "auxl",
          "cdtg",
          "shsc",
          "aest"
        ];
      }
      parse(stream) {
        while (stream.getPosition() < this.start + this.size) {
          const ret = parseOneBox(stream, true, this.size - (stream.getPosition() - this.start));
          if (ret.code === 1) {
            if (!trefBox2.allowed_types.includes(ret.type)) Log.warn("BoxParser", `Unknown track reference type: '${ret.type}'`);
            const box = new TrackReferenceTypeBox(ret.type, ret.size, ret.hdr_size, ret.start);
            if (box.write === Box.prototype.write && box.type !== "mdat") {
              Log.info("BoxParser", "TrackReference " + box.type + " box writing not yet implemented, keeping unparsed data in memory for later write");
              box.parseDataAndRewind(stream);
            }
            box.parse(stream);
            this.references.push(box);
          } else return;
        }
      }
    };
    trepBox = class extends FullBox {
      constructor(..._args) {
        super(..._args);
        this.box_name = "TrackExtensionPropertiesBox";
      }
      static {
        this.fourcc = "trep";
      }
      parse(stream) {
        this.parseFullHeader(stream);
        this.track_ID = stream.readUint32();
        this.boxes = [];
        while (stream.getPosition() < this.start + this.size) {
          const ret = parseOneBox(stream, false, this.size - (stream.getPosition() - this.start));
          if (ret.code === 1) {
            const box = ret.box;
            this.boxes.push(box);
          } else return;
        }
      }
    };
    trpyBox = class extends Box {
      constructor(..._args) {
        super(..._args);
        this.box_name = "hintBytesSent";
      }
      static {
        this.fourcc = "trpy";
      }
      parse(stream) {
        this.bytessent = stream.readUint64();
      }
    };
    tselBox = class extends FullBox {
      constructor(..._args) {
        super(..._args);
        this.box_name = "TrackSelectionBox";
      }
      static {
        this.fourcc = "tsel";
      }
      parse(stream) {
        this.parseFullHeader(stream);
        this.switch_group = stream.readUint32();
        const count = (this.size - this.hdr_size - 4) / 4;
        this.attribute_list = [];
        for (let i = 0; i < count; i++) this.attribute_list[i] = stream.readUint32();
      }
    };
    txtcBox = class extends FullBox {
      constructor(..._args) {
        super(..._args);
        this.box_name = "TextConfigBox";
      }
      static {
        this.fourcc = "txtc";
      }
      parse(stream) {
        this.parseFullHeader(stream);
        this.config = stream.readCString();
      }
    };
    tycoBox = class extends Box {
      constructor(..._args) {
        super(..._args);
        this.box_name = "TypeCombinationBox";
      }
      static {
        this.fourcc = "tyco";
      }
      parse(stream) {
        const count = (this.size - this.hdr_size) / 4;
        this.compatible_brands = [];
        for (let i = 0; i < count; i++) this.compatible_brands[i] = stream.readString(4);
      }
    };
    udesBox = class extends FullBox {
      constructor(..._args) {
        super(..._args);
        this.box_name = "UserDescriptionProperty";
      }
      static {
        this.fourcc = "udes";
      }
      parse(stream) {
        this.parseFullHeader(stream);
        this.lang = stream.readCString();
        this.name = stream.readCString();
        this.description = stream.readCString();
        this.tags = stream.readCString();
      }
    };
    uncCBox = class extends FullBox {
      constructor(..._args) {
        super(..._args);
        this.box_name = "UncompressedFrameConfigBox";
      }
      static {
        this.fourcc = "uncC";
      }
      parse(stream) {
        this.parseFullHeader(stream);
        this.profile = stream.readString(4);
        if (this.version === 1) {
        } else if (this.version === 0) {
          this.component_count = stream.readUint32();
          this.component_index = [];
          this.component_bit_depth_minus_one = [];
          this.component_format = [];
          this.component_align_size = [];
          for (let i = 0; i < this.component_count; i++) {
            this.component_index.push(stream.readUint16());
            this.component_bit_depth_minus_one.push(stream.readUint8());
            this.component_format.push(stream.readUint8());
            this.component_align_size.push(stream.readUint8());
          }
          this.sampling_type = stream.readUint8();
          this.interleave_type = stream.readUint8();
          this.block_size = stream.readUint8();
          const flags = stream.readUint8();
          this.component_little_endian = flags >> 7 & 1;
          this.block_pad_lsb = flags >> 6 & 1;
          this.block_little_endian = flags >> 5 & 1;
          this.block_reversed = flags >> 4 & 1;
          this.pad_unknown = flags >> 3 & 1;
          this.pixel_size = stream.readUint32();
          this.row_align_size = stream.readUint32();
          this.tile_align_size = stream.readUint32();
          this.num_tile_cols_minus_one = stream.readUint32();
          this.num_tile_rows_minus_one = stream.readUint32();
        }
      }
    };
    urnBox = class extends FullBox {
      constructor(..._args) {
        super(..._args);
        this.box_name = "DataEntryUrnBox";
      }
      static {
        this.fourcc = "urn ";
      }
      parse(stream) {
        this.parseFullHeader(stream);
        this.name = stream.readCString();
        if (this.size - this.hdr_size - this.name.length - 1 > 0) this.location = stream.readCString();
      }
      /** @bundle writing/urn.js */
      write(stream) {
        this.version = 0;
        this.flags = 0;
        this.size = this.name.length + 1 + (this.location ? this.location.length + 1 : 0);
        this.writeHeader(stream);
        stream.writeCString(this.name);
        if (this.location) stream.writeCString(this.location);
      }
    };
    vttCBox = class extends Box {
      constructor(..._args) {
        super(..._args);
        this.box_name = "WebVTTConfigurationBox";
      }
      static {
        this.fourcc = "vttC";
      }
      parse(stream) {
        this.text = stream.readString(this.size - this.hdr_size);
      }
    };
    vvnCBox = class extends FullBox {
      constructor(..._args) {
        super(..._args);
        this.box_name = "VvcNALUConfigBox";
      }
      static {
        this.fourcc = "vvnC";
      }
      parse(stream) {
        this.parseFullHeader(stream);
        const tmp = stream.readUint8();
        this.lengthSizeMinusOne = tmp & 3;
      }
    };
    alstSampleGroupEntry = class extends SampleGroupEntry {
      static {
        this.grouping_type = "alst";
      }
      parse(stream) {
        const roll_count = stream.readUint16();
        this.first_output_sample = stream.readUint16();
        this.sample_offset = [];
        for (let i = 0; i < roll_count; i++) this.sample_offset[i] = stream.readUint32();
        const remaining = this.description_length - 4 - 4 * roll_count;
        this.num_output_samples = [];
        this.num_total_samples = [];
        for (let i = 0; i < remaining / 4; i++) {
          this.num_output_samples[i] = stream.readUint16();
          this.num_total_samples[i] = stream.readUint16();
        }
      }
    };
    avllSampleGroupEntry = class extends SampleGroupEntry {
      static {
        this.grouping_type = "avll";
      }
      parse(stream) {
        this.layerNumber = stream.readUint8();
        this.accurateStatisticsFlag = stream.readUint8();
        this.avgBitRate = stream.readUint16();
        this.avgFrameRate = stream.readUint16();
      }
    };
    avssSampleGroupEntry = class extends SampleGroupEntry {
      static {
        this.grouping_type = "avss";
      }
      parse(stream) {
        this.subSequenceIdentifier = stream.readUint16();
        this.layerNumber = stream.readUint8();
        const tmp_byte = stream.readUint8();
        this.durationFlag = tmp_byte >> 7;
        this.avgRateFlag = tmp_byte >> 6 & 1;
        if (this.durationFlag) this.duration = stream.readUint32();
        if (this.avgRateFlag) {
          this.accurateStatisticsFlag = stream.readUint8();
          this.avgBitRate = stream.readUint16();
          this.avgFrameRate = stream.readUint16();
        }
        this.dependency = [];
        const numReferences = stream.readUint8();
        for (let i = 0; i < numReferences; i++) this.dependency.push({
          subSeqDirectionFlag: stream.readUint8(),
          layerNumber: stream.readUint8(),
          subSequenceIdentifier: stream.readUint16()
        });
      }
    };
    dtrtSampleGroupEntry = class extends SampleGroupEntry {
      static {
        this.grouping_type = "dtrt";
      }
      parse(_stream) {
        Log.warn("BoxParser", "Sample Group type: " + this.grouping_type + " not fully parsed");
      }
    };
    mvifSampleGroupEntry = class extends SampleGroupEntry {
      static {
        this.grouping_type = "mvif";
      }
      parse(_stream) {
        Log.warn("BoxParser", "Sample Group type: " + this.grouping_type + " not fully parsed");
      }
    };
    prolSampleGroupEntry = class extends SampleGroupEntry {
      static {
        this.grouping_type = "prol";
      }
      parse(stream) {
        this.roll_distance = stream.readInt16();
      }
    };
    rapSampleGroupEntry = class extends SampleGroupEntry {
      static {
        this.grouping_type = "rap ";
      }
      parse(stream) {
        const tmp_byte = stream.readUint8();
        this.num_leading_samples_known = tmp_byte >> 7;
        this.num_leading_samples = tmp_byte & 127;
      }
    };
    rashSampleGroupEntry = class extends SampleGroupEntry {
      static {
        this.grouping_type = "rash";
      }
      parse(stream) {
        this.operation_point_count = stream.readUint16();
        if (this.description_length !== 2 + (this.operation_point_count === 1 ? 2 : this.operation_point_count * 6) + 9) {
          Log.warn("BoxParser", "Mismatch in " + this.grouping_type + " sample group length");
          this.data = stream.readUint8Array(this.description_length - 2);
        } else {
          if (this.operation_point_count === 1) this.target_rate_share = stream.readUint16();
          else {
            this.target_rate_share = [];
            this.available_bitrate = [];
            for (let i = 0; i < this.operation_point_count; i++) {
              this.available_bitrate[i] = stream.readUint32();
              this.target_rate_share[i] = stream.readUint16();
            }
          }
          this.maximum_bitrate = stream.readUint32();
          this.minimum_bitrate = stream.readUint32();
          this.discard_priority = stream.readUint8();
        }
      }
    };
    rollSampleGroupEntry = class extends SampleGroupEntry {
      static {
        this.grouping_type = "roll";
      }
      parse(stream) {
        this.roll_distance = stream.readInt16();
      }
    };
    scifSampleGroupEntry = class extends SampleGroupEntry {
      static {
        this.grouping_type = "scif";
      }
      parse(_stream) {
        Log.warn("BoxParser", "Sample Group type: " + this.grouping_type + " not fully parsed");
      }
    };
    scnmSampleGroupEntry = class extends SampleGroupEntry {
      static {
        this.grouping_type = "scnm";
      }
      parse(_stream) {
        Log.warn("BoxParser", "Sample Group type: " + this.grouping_type + " not fully parsed");
      }
    };
    seigSampleGroupEntry = class extends SampleGroupEntry {
      static {
        this.grouping_type = "seig";
      }
      parse(stream) {
        this.reserved = stream.readUint8();
        const tmp = stream.readUint8();
        this.crypt_byte_block = tmp >> 4;
        this.skip_byte_block = tmp & 15;
        this.isProtected = stream.readUint8();
        this.Per_Sample_IV_Size = stream.readUint8();
        this.KID = parseHex16(stream);
        this.constant_IV_size = 0;
        this.constant_IV = 0;
        if (this.isProtected === 1 && this.Per_Sample_IV_Size === 0) {
          this.constant_IV_size = stream.readUint8();
          this.constant_IV = stream.readUint8Array(this.constant_IV_size);
        }
      }
    };
    stsaSampleGroupEntry = class extends SampleGroupEntry {
      static {
        this.grouping_type = "stsa";
      }
      parse(_stream) {
        Log.warn("BoxParser", "Sample Group type: " + this.grouping_type + " not fully parsed");
      }
    };
    syncSampleGroupEntry = class extends SampleGroupEntry {
      static {
        this.grouping_type = "sync";
      }
      parse(stream) {
        const tmp_byte = stream.readUint8();
        this.NAL_unit_type = tmp_byte & 63;
      }
    };
    teleSampleGroupEntry = class extends SampleGroupEntry {
      static {
        this.grouping_type = "tele";
      }
      parse(stream) {
        const tmp_byte = stream.readUint8();
        this.level_independently_decodable = tmp_byte >> 7;
      }
    };
    tsasSampleGroupEntry = class extends SampleGroupEntry {
      static {
        this.grouping_type = "tsas";
      }
      parse(_stream) {
        Log.warn("BoxParser", "Sample Group type: " + this.grouping_type + " not fully parsed");
      }
    };
    tsclSampleGroupEntry = class extends SampleGroupEntry {
      static {
        this.grouping_type = "tscl";
      }
      parse(_stream) {
        Log.warn("BoxParser", "Sample Group type: " + this.grouping_type + " not fully parsed");
      }
    };
    viprSampleGroupEntry = class extends SampleGroupEntry {
      static {
        this.grouping_type = "vipr";
      }
      parse(_stream) {
        Log.warn("BoxParser", "Sample Group type: " + this.grouping_type + " not fully parsed");
      }
    };
    UUIDBox = class extends Box {
      static {
        this.fourcc = "uuid";
      }
    };
    UUIDFullBox = class extends FullBox {
      static {
        this.fourcc = "uuid";
      }
    };
    piffLsmBox = class extends UUIDFullBox {
      constructor(..._args) {
        super(..._args);
        this.box_name = "LiveServerManifestBox";
      }
      static {
        this.uuid = "a5d40b30e81411ddba2f0800200c9a66";
      }
      parse(stream) {
        this.parseFullHeader(stream);
        this.LiveServerManifest = stream.readString(this.size - this.hdr_size).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
      }
    };
    piffPsshBox = class extends UUIDFullBox {
      constructor(..._args2) {
        super(..._args2);
        this.box_name = "PiffProtectionSystemSpecificHeaderBox";
      }
      static {
        this.uuid = "d08a4f1810f34a82b6c832d8aba183d3";
      }
      parse(stream) {
        this.parseFullHeader(stream);
        this.system_id = parseHex16(stream);
        const datasize = stream.readUint32();
        if (datasize > 0) this.data = stream.readUint8Array(datasize);
      }
    };
    piffSencBox = class extends UUIDFullBox {
      constructor(..._args3) {
        super(..._args3);
        this.box_name = "PiffSampleEncryptionBox";
      }
      static {
        this.uuid = "a2394f525a9b4f14a2446c427c648df4";
      }
    };
    piffTencBox = class extends UUIDFullBox {
      constructor(..._args4) {
        super(..._args4);
        this.box_name = "PiffTrackEncryptionBox";
      }
      static {
        this.uuid = "8974dbce7be74c5184f97148f9882554";
      }
      parse(stream) {
        this.parseFullHeader(stream);
        this.default_AlgorithmID = stream.readUint24();
        this.default_IV_size = stream.readUint8();
        this.default_KID = parseHex16(stream);
      }
    };
    piffTfrfBox = class extends UUIDFullBox {
      constructor(..._args5) {
        super(..._args5);
        this.box_name = "TfrfBox";
      }
      static {
        this.uuid = "d4807ef2ca3946958e5426cb9e46a79f";
      }
      parse(stream) {
        this.parseFullHeader(stream);
        this.fragment_count = stream.readUint8();
        this.entries = [];
        for (let i = 0; i < this.fragment_count; i++) {
          let absolute_time = 0;
          let absolute_duration = 0;
          if (this.version === 1) {
            absolute_time = stream.readUint64();
            absolute_duration = stream.readUint64();
          } else {
            absolute_time = stream.readUint32();
            absolute_duration = stream.readUint32();
          }
          this.entries.push({
            absolute_time,
            absolute_duration
          });
        }
      }
    };
    piffTfxdBox = class extends UUIDFullBox {
      constructor(..._args6) {
        super(..._args6);
        this.box_name = "TfxdBox";
      }
      static {
        this.uuid = "6d1d9b0542d544e680e2141daff757b2";
      }
      parse(stream) {
        this.parseFullHeader(stream);
        if (this.version === 1) {
          this.absolute_time = stream.readUint64();
          this.duration = stream.readUint64();
        } else {
          this.absolute_time = stream.readUint32();
          this.duration = stream.readUint32();
        }
      }
    };
    ItemContentIDPropertyBox = class extends UUIDBox {
      constructor(..._args7) {
        super(..._args7);
        this.box_name = "ItemContentIDProperty";
      }
      static {
        this.uuid = "261ef3741d975bbaacbd9d2c8ea73522";
      }
      parse(stream) {
        this.content_id = stream.readCString();
      }
    };
    ItemComponentContentIDPropertyBox = class extends UUIDBox {
      constructor(..._args8) {
        super(..._args8);
        this.box_name = "ItemComponentContentIDProperty";
      }
      static {
        this.uuid = "9db9dd6e373c5a4e811021fc83a911fd";
      }
      parse(stream) {
        this.number_of_components = stream.readUint32();
        this.content_ids = [];
        for (let i = 0; i < this.number_of_components; i++) {
          const content_id = stream.readCString();
          this.content_ids.push(content_id);
        }
      }
    };
    all_boxes_exports = /* @__PURE__ */ __exportAll({
      CoLLBox: () => CoLLBox,
      ItemComponentContentIDPropertyBox: () => ItemComponentContentIDPropertyBox,
      ItemContentIDPropertyBox: () => ItemContentIDPropertyBox,
      OpusSampleEntry: () => OpusSampleEntry,
      SmDmBox: () => SmDmBox,
      a1lxBox: () => a1lxBox,
      a1opBox: () => a1opBox,
      ac_3SampleEntry: () => ac_3SampleEntry,
      ac_4SampleEntry: () => ac_4SampleEntry,
      aebrBox: () => aebrBox,
      afbrBox: () => afbrBox,
      albcBox: () => albcBox,
      alstSampleGroupEntry: () => alstSampleGroupEntry,
      altrBox: () => altrBox,
      auxCBox: () => auxCBox,
      av01SampleEntry: () => av01SampleEntry,
      av1CBox: () => av1CBox,
      avc1SampleEntry: () => avc1SampleEntry,
      avc2SampleEntry: () => avc2SampleEntry,
      avc3SampleEntry: () => avc3SampleEntry,
      avc4SampleEntry: () => avc4SampleEntry,
      avcCBox: () => avcCBox,
      avllSampleGroupEntry: () => avllSampleGroupEntry,
      avs3SampleEntry: () => avs3SampleEntry,
      avssSampleGroupEntry: () => avssSampleGroupEntry,
      brstBox: () => brstBox,
      btrtBox: () => btrtBox,
      bxmlBox: () => bxmlBox,
      ccstBox: () => ccstBox,
      cdefBox: () => cdefBox,
      clapBox: () => clapBox,
      clefBox: () => clefBox,
      clliBox: () => clliBox,
      cmexBox: () => cmexBox,
      cminBox: () => cminBox,
      cmpCBox: () => cmpCBox,
      cmpdBox: () => cmpdBox,
      co64Box: () => co64Box,
      colrBox: () => colrBox,
      coviBox: () => coviBox,
      cprtBox: () => cprtBox,
      cschBox: () => cschBox,
      cslgBox: () => cslgBox,
      cttsBox: () => cttsBox,
      dOpsBox: () => dOpsBox,
      dac3Box: () => dac3Box,
      dataBox: () => dataBox,
      dav1SampleEntry: () => dav1SampleEntry,
      dec3Box: () => dec3Box,
      dfLaBox: () => dfLaBox,
      dimmBox: () => dimmBox,
      dinfBox: () => dinfBox,
      dmax: () => dmax,
      dmedBox: () => dmedBox,
      dobrBox: () => dobrBox,
      drefBox: () => drefBox,
      drepBox: () => drepBox,
      dtrtSampleGroupEntry: () => dtrtSampleGroupEntry,
      dvh1SampleEntry: () => dvh1SampleEntry,
      dvheSampleEntry: () => dvheSampleEntry,
      ec_3SampleEntry: () => ec_3SampleEntry,
      edtsBox: () => edtsBox,
      elngBox: () => elngBox,
      elstBox: () => elstBox,
      emsgBox: () => emsgBox,
      encaSampleEntry: () => encaSampleEntry,
      encmSampleEntry: () => encmSampleEntry,
      encsSampleEntry: () => encsSampleEntry,
      enctSampleEntry: () => enctSampleEntry,
      encuSampleEntry: () => encuSampleEntry,
      encvSampleEntry: () => encvSampleEntry,
      enofBox: () => enofBox,
      eqivBox: () => eqivBox,
      esdsBox: () => esdsBox,
      etypBox: () => etypBox,
      fLaCSampleEntry: () => fLaCSampleEntry,
      favcBox: () => favcBox,
      fielBox: () => fielBox,
      fobrBox: () => fobrBox,
      freeBox: () => freeBox,
      frmaBox: () => frmaBox,
      ftypBox: () => ftypBox,
      grplBox: () => grplBox,
      hdlrBox: () => hdlrBox,
      hev1SampleEntry: () => hev1SampleEntry,
      hev2SampleEntry: () => hev2SampleEntry,
      hinfBox: () => hinfBox,
      hmhdBox: () => hmhdBox,
      hntiBox: () => hntiBox,
      hvc1SampleEntry: () => hvc1SampleEntry,
      hvc2SampleEntry: () => hvc2SampleEntry,
      hvcCBox: () => hvcCBox,
      hvt1SampleEntry: () => hvt1SampleEntry,
      iaugBox: () => iaugBox,
      idatBox: () => idatBox,
      iinfBox: () => iinfBox,
      ilocBox: () => ilocBox,
      ilstBox: () => ilstBox,
      imirBox: () => imirBox,
      infeBox: () => infeBox,
      iodsBox: () => iodsBox,
      ipcoBox: () => ipcoBox,
      ipmaBox: () => ipmaBox,
      iproBox: () => iproBox,
      iprpBox: () => iprpBox,
      irefBox: () => irefBox,
      irotBox: () => irotBox,
      ispeBox: () => ispeBox,
      itaiBox: () => itaiBox,
      j2kHBox: () => j2kHBox,
      j2kiSampleEntry: () => j2kiSampleEntry,
      keysBox: () => keysBox,
      kindBox: () => kindBox,
      levaBox: () => levaBox,
      lhe1SampleEntry: () => lhe1SampleEntry,
      lhv1SampleEntry: () => lhv1SampleEntry,
      lhvCBox: () => lhvCBox,
      lselBox: () => lselBox,
      lvc1SampleEntry: () => lvc1SampleEntry,
      lvcCBox: () => lvcCBox,
      m4aeSampleEntry: () => m4aeSampleEntry,
      maxrBox: () => maxrBox,
      mdatBox: () => mdatBox,
      mdcvBox: () => mdcvBox,
      mdhdBox: () => mdhdBox,
      mdiaBox: () => mdiaBox,
      mecoBox: () => mecoBox,
      mehdBox: () => mehdBox,
      metaBox: () => metaBox,
      mettSampleEntry: () => mettSampleEntry,
      metxSampleEntry: () => metxSampleEntry,
      mfhdBox: () => mfhdBox,
      mfraBox: () => mfraBox,
      mfroBox: () => mfroBox,
      mha1SampleEntry: () => mha1SampleEntry,
      mha2SampleEntry: () => mha2SampleEntry,
      mhm1SampleEntry: () => mhm1SampleEntry,
      mhm2SampleEntry: () => mhm2SampleEntry,
      minfBox: () => minfBox,
      mjp2SampleEntry: () => mjp2SampleEntry,
      mjpgSampleEntry: () => mjpgSampleEntry,
      moofBox: () => moofBox,
      moovBox: () => moovBox,
      mp4aSampleEntry: () => mp4aSampleEntry,
      mp4sSampleEntry: () => mp4sSampleEntry,
      mp4vSampleEntry: () => mp4vSampleEntry,
      mskCBox: () => mskCBox,
      msrcTrackGroupTypeBox: () => msrcTrackGroupTypeBox,
      mvexBox: () => mvexBox,
      mvhdBox: () => mvhdBox,
      mvifSampleGroupEntry: () => mvifSampleGroupEntry,
      nmhdBox: () => nmhdBox,
      npckBox: () => npckBox,
      numpBox: () => numpBox,
      padbBox: () => padbBox,
      panoBox: () => panoBox,
      paspBox: () => paspBox,
      paylBox: () => paylBox,
      paytBox: () => paytBox,
      pdinBox: () => pdinBox,
      piffLsmBox: () => piffLsmBox,
      piffPsshBox: () => piffPsshBox,
      piffSencBox: () => piffSencBox,
      piffTencBox: () => piffTencBox,
      piffTfrfBox: () => piffTfrfBox,
      piffTfxdBox: () => piffTfxdBox,
      pitmBox: () => pitmBox,
      pixiBox: () => pixiBox,
      pmaxBox: () => pmaxBox,
      povdBox: () => povdBox,
      prdiBox: () => prdiBox,
      prfrBox: () => prfrBox,
      prftBox: () => prftBox,
      prgrBox: () => prgrBox,
      profBox: () => profBox,
      prolSampleGroupEntry: () => prolSampleGroupEntry,
      psshBox: () => psshBox,
      pymdBox: () => pymdBox,
      rapSampleGroupEntry: () => rapSampleGroupEntry,
      rashSampleGroupEntry: () => rashSampleGroupEntry,
      resvSampleEntry: () => resvSampleEntry,
      rinfBox: () => rinfBox,
      rollSampleGroupEntry: () => rollSampleGroupEntry,
      rtp_Box: () => rtp_Box,
      saioBox: () => saioBox,
      saizBox: () => saizBox,
      sbgpBox: () => sbgpBox,
      sbpmBox: () => sbpmBox,
      sbttSampleEntry: () => sbttSampleEntry,
      schiBox: () => schiBox,
      schmBox: () => schmBox,
      scifSampleGroupEntry: () => scifSampleGroupEntry,
      scnmSampleGroupEntry: () => scnmSampleGroupEntry,
      sdp_Box: () => sdp_Box,
      sdtpBox: () => sdtpBox,
      seigSampleGroupEntry: () => seigSampleGroupEntry,
      sencBox: () => sencBox,
      sgpdBox: () => sgpdBox,
      sidxBox: () => sidxBox,
      sinfBox: () => sinfBox,
      skipBox: () => skipBox,
      slidBox: () => slidBox,
      smhdBox: () => smhdBox,
      sratBox: () => sratBox,
      ssixBox: () => ssixBox,
      stblBox: () => stblBox,
      stcoBox: () => stcoBox,
      stdpBox: () => stdpBox,
      sterBox: () => sterBox,
      sthdBox: () => sthdBox,
      stppSampleEntry: () => stppSampleEntry,
      strdBox: () => strdBox,
      striBox: () => striBox,
      strkBox: () => strkBox,
      stsaSampleGroupEntry: () => stsaSampleGroupEntry,
      stscBox: () => stscBox,
      stsdBox: () => stsdBox,
      stsgBox: () => stsgBox,
      stshBox: () => stshBox,
      stssBox: () => stssBox,
      stszBox: () => stszBox,
      sttsBox: () => sttsBox,
      stviBox: () => stviBox,
      stxtSampleEntry: () => stxtSampleEntry,
      stypBox: () => stypBox,
      stz2Box: () => stz2Box,
      subsBox: () => subsBox,
      syncSampleGroupEntry: () => syncSampleGroupEntry,
      taicBox: () => taicBox,
      taptBox: () => taptBox,
      teleSampleGroupEntry: () => teleSampleGroupEntry,
      tencBox: () => tencBox,
      tfdtBox: () => tfdtBox,
      tfhdBox: () => tfhdBox,
      tfraBox: () => tfraBox,
      tkhdBox: () => tkhdBox,
      tmaxBox: () => tmaxBox,
      tminBox: () => tminBox,
      totlBox: () => totlBox,
      tpayBox: () => tpayBox,
      tpylBox: () => tpylBox,
      trafBox: () => trafBox,
      trakBox: () => trakBox,
      trefBox: () => trefBox,
      trepBox: () => trepBox,
      trexBox: () => trexBox,
      trgrBox: () => trgrBox,
      trpyBox: () => trpyBox,
      trunBox: () => trunBox,
      tsasSampleGroupEntry: () => tsasSampleGroupEntry,
      tsclSampleGroupEntry: () => tsclSampleGroupEntry,
      tselBox: () => tselBox,
      tsynBox: () => tsynBox,
      tx3gSampleEntry: () => tx3gSampleEntry,
      txtcBox: () => txtcBox,
      tycoBox: () => tycoBox,
      udesBox: () => udesBox,
      udtaBox: () => udtaBox,
      uncCBox: () => uncCBox,
      uncvSampleEntry: () => uncvSampleEntry,
      urlBox: () => urlBox,
      urnBox: () => urnBox,
      viprSampleGroupEntry: () => viprSampleGroupEntry,
      vmhdBox: () => vmhdBox,
      vp08SampleEntry: () => vp08SampleEntry,
      vp09SampleEntry: () => vp09SampleEntry,
      vpcCBox: () => vpcCBox,
      vttCBox: () => vttCBox,
      vttcBox: () => vttcBox,
      vvc1SampleEntry: () => vvc1SampleEntry,
      vvcCBox: () => vvcCBox,
      vvcNSampleEntry: () => vvcNSampleEntry,
      vvi1SampleEntry: () => vvi1SampleEntry,
      vvnCBox: () => vvnCBox,
      vvs1SampleEntry: () => vvs1SampleEntry,
      waveBox: () => waveBox,
      wbbrBox: () => wbbrBox,
      wvttSampleEntry: () => wvttSampleEntry,
      xmlBox: () => xmlBox
    });
    BoxParser = registerBoxes(all_boxes_exports);
    registerDescriptors(descriptor_exports);
  }
});

// node_modules/@reactor-team/js-sdk/dist/index.js
var import_awaitqueue = __toESM(require_lib(), 1);
var import_react = __toESM(require_react(), 1);
var import_jsx_runtime = __toESM(require_jsx_runtime(), 1);
var import_react2 = __toESM(require_react(), 1);
var import_react3 = __toESM(require_react(), 1);
var import_jsx_runtime2 = __toESM(require_jsx_runtime(), 1);
var import_react4 = __toESM(require_react(), 1);
var import_jsx_runtime3 = __toESM(require_jsx_runtime(), 1);
var import_react5 = __toESM(require_react(), 1);
var import_jsx_runtime4 = __toESM(require_jsx_runtime(), 1);
var import_react6 = __toESM(require_react(), 1);
var import_react7 = __toESM(require_react(), 1);
var import_jsx_runtime5 = __toESM(require_jsx_runtime(), 1);
function toPublicCapabilities(wire) {
  const capabilities = {
    protocolVersion: wire.protocol_version,
    tracks: wire.tracks
  };
  if (wire.commands !== void 0) {
    capabilities.commands = wire.commands;
  }
  if (wire.emission_fps !== void 0) {
    capabilities.emissionFps = wire.emission_fps;
  }
  return capabilities;
}
var isDev = typeof process !== "undefined" && true || import.meta.env?.DEV === true;
function debugLog(...args) {
  if (isDev) {
    console.debug(...args);
  }
}
var ReactorError = class extends Error {
  /** The code this class stands for. `ReactorError` itself is the fallback,
   *  so it claims none and takes whatever the payload reported. */
  static code = "INTERNAL_ERROR";
  /** `reactor-core`'s own canonical code for this failure — the same value
   *  used to pick this instance's class (see the typed subclasses below for
   *  the vocabulary). Open-ended: an unrecognized code still constructs the
   *  base class, with `code` set to whatever was reported. */
  code;
  /** Whether the same call could succeed later. */
  recoverable;
  /** The HTTP status, when the failure came from one. */
  status;
  /** Which call failed, e.g. "connect", "sendCommand". */
  operation;
  /** Backoff hint the platform sent. */
  retry_after_ms;
  /** When `reactor-core` reported this failure. For a purely local one (no
   *  payload at all — see {@link ReactorErrorOptions}), this is synthesized
   *  as the construction time instead, since there's nothing to report —
   *  not a value read off the wire. */
  timestamp_ms;
  /** Same value as `retry_after_ms`, under its previous name. Kept for
   *  compatibility — prefer `retry_after_ms`. */
  retryAfter;
  /** Same value as `timestamp_ms`, under its previous name. Kept for
   *  compatibility — prefer `timestamp_ms`. */
  timestamp;
  constructor(message, options = {}) {
    super(message);
    this.name = "ReactorError";
    this.code = options.code ?? new.target.code;
    this.recoverable = options.recoverable ?? false;
    this.status = options.status;
    this.operation = options.operation;
    this.retry_after_ms = options.retry_after_ms;
    this.retryAfter = options.retry_after_ms;
    this.timestamp_ms = options.timestamp_ms ?? Date.now();
    this.timestamp = this.timestamp_ms;
  }
};
var NetworkError = class extends ReactorError {
  static code = "NETWORK_ERROR";
};
var UnauthorizedError = class extends ReactorError {
  static code = "UNAUTHORIZED";
};
var NotFoundError = class extends ReactorError {
  static code = "NOT_FOUND";
};
var ConflictError = class extends ReactorError {
  static code = "CONFLICT";
};
var RateLimitedError = class extends ReactorError {
  static code = "RATE_LIMITED";
};
var BadRequestError = class extends ReactorError {
  static code = "BAD_REQUEST";
};
var ServerError = class extends ReactorError {
  static code = "SERVER_ERROR";
};
var VersionMismatchError = class extends ReactorError {
  static code = "VERSION_MISMATCH";
};
var DecodeError = class extends ReactorError {
  static code = "DECODE_FAILED";
};
var InvalidStateError = class extends ReactorError {
  static code = "INVALID_STATE";
};
var SessionTerminalError = class extends ReactorError {
  static code = "SESSION_TERMINAL";
};
var MessageTooLargeError = class extends ReactorError {
  static code = "MESSAGE_TOO_LARGE";
};
var TransportError = class extends ReactorError {
  static code = "TRANSPORT_ERROR";
};
var DisconnectedError = class extends ReactorError {
  static code = "DISCONNECTED";
};
var RequestTimeoutError = class extends ReactorError {
  static code = "REQUEST_TIMEOUT";
};
var AbortedError = class extends ReactorError {
  static code = "ABORTED";
};
var RecorderDisabledError = class extends ReactorError {
  static code = "RECORDER_DISABLED";
};
var ERROR_CLASSES = [
  NetworkError,
  UnauthorizedError,
  NotFoundError,
  ConflictError,
  RateLimitedError,
  BadRequestError,
  ServerError,
  VersionMismatchError,
  DecodeError,
  InvalidStateError,
  SessionTerminalError,
  MessageTooLargeError,
  TransportError,
  DisconnectedError,
  RequestTimeoutError,
  AbortedError,
  RecorderDisabledError
];
var BY_CODE = new Map(
  ERROR_CLASSES.map((errorClass) => [errorClass.code, errorClass])
);
function errorForCode(code) {
  return code && BY_CODE.get(code) || ReactorError;
}
function toReactorError(cause) {
  if (cause instanceof ReactorError) {
    return cause;
  }
  const payload = cause ?? {};
  const message = typeof payload.message === "string" ? payload.message : String(cause);
  const ErrorClass = errorForCode(payload.code);
  return new ErrorClass(message, {
    code: payload.code,
    recoverable: payload.recoverable,
    status: payload.status,
    operation: payload.operation,
    retry_after_ms: payload.retry_after_ms,
    timestamp_ms: payload.timestamp_ms
  });
}
var Emitter = class {
  listeners = /* @__PURE__ */ new Map();
  on(event, handler) {
    let handlers = this.listeners.get(event);
    if (!handlers) {
      handlers = /* @__PURE__ */ new Set();
      this.listeners.set(event, handlers);
    }
    handlers.add(handler);
  }
  off(event, handler) {
    this.listeners.get(event)?.delete(handler);
  }
  once(event, handler) {
    const wrapped = ((...args) => {
      this.off(event, wrapped);
      handler(...args);
    });
    this.on(event, wrapped);
  }
  emit(event, ...args) {
    const handlers = this.listeners.get(event);
    if (!handlers) {
      return;
    }
    for (const handler of [...handlers]) {
      try {
        handler(...args);
      } catch (error) {
        console.error(`[Emitter] handler for "${String(event)}" threw:`, error);
      }
    }
  }
  /** Drops every registered handler for every event. */
  clear() {
    this.listeners.clear();
  }
};
var FileRef = class {
  constructor(uploadId, name, mimeType, size) {
    this.uploadId = uploadId;
    this.name = name;
    this.mimeType = mimeType;
    this.size = size;
  }
  uploadId;
  name;
  mimeType;
  size;
};
function isFileRef(value) {
  if (value instanceof FileRef) {
    return true;
  }
  if (typeof value !== "object" || value === null) {
    return false;
  }
  const candidate = value;
  return typeof candidate.uploadId === "string" && typeof candidate.name === "string" && typeof candidate.mimeType === "string" && typeof candidate.size === "number";
}
function toWireFileRef(fileRef) {
  return {
    upload_id: fileRef.uploadId,
    name: fileRef.name,
    mime_type: fileRef.mimeType,
    size: fileRef.size
  };
}
function toPublicFileRef(fileRef) {
  return new FileRef(fileRef.upload_id, fileRef.name, fileRef.mime_type, fileRef.size);
}
function extractFileRefs(data) {
  if (!data) {
    return { data, uploads: void 0 };
  }
  let uploads;
  let scalars;
  for (const [key, value] of Object.entries(data)) {
    if (isFileRef(value)) {
      uploads ??= {};
      scalars ??= { ...data };
      uploads[key] = toWireFileRef(value);
      delete scalars[key];
      continue;
    }
    const rewritten = rewriteNestedFileRefs(value);
    if (rewritten !== value) {
      scalars ??= { ...data };
      scalars[key] = rewritten;
    }
  }
  return { data: scalars ?? data, uploads };
}
function rewriteNestedFileRefs(value) {
  if (isFileRef(value)) {
    return toWireFileRef(value);
  }
  if (Array.isArray(value)) {
    const elements = value;
    let copy;
    elements.forEach((element, index) => {
      const rewritten = rewriteNestedFileRefs(element);
      if (rewritten !== element) {
        copy ??= [...elements];
        copy[index] = rewritten;
      }
    });
    return copy ?? elements;
  }
  if (isSerializedAsObject(value)) {
    let copy;
    for (const [key, element] of Object.entries(value)) {
      const rewritten = rewriteNestedFileRefs(element);
      if (rewritten !== element) {
        copy ??= { ...value };
        copy[key] = rewritten;
      }
    }
    return copy ?? value;
  }
  return value;
}
function isSerializedAsObject(value) {
  return typeof value === "object" && value !== null && !ArrayBuffer.isView(value);
}
function toPublicClip(clip) {
  return {
    sessionId: clip.session_id,
    kind: clip.kind,
    startMarker: clip.start_marker,
    endMarker: clip.end_marker,
    nowMarker: clip.now_marker,
    predictedReadyAtMs: clip.predicted_ready_at_ms,
    playlistUrl: clip.playlist_url
  };
}
var STATS_INTERVAL_MS = 2e3;
function createRTCStatsExtractor() {
  let lastBytesReceived;
  let lastBytesSent;
  let lastCandPairTimestamp;
  let lastCandPairId;
  return (report) => {
    let candPairId;
    let rtt;
    let availableOutgoingBitrate;
    let availableIncomingBitrate;
    let incomingBitrate;
    let outgoingBitrate;
    let videoInboundRtpId;
    let framesPerSecond;
    let jitter;
    let packetLossRatio;
    let candidateType;
    const reportWithLookup = report;
    report.forEach((stat) => {
      if (candPairId === void 0 && stat.type === "candidate-pair" && stat.state === "succeeded" && stat.nominated) {
        candPairId = stat.id;
        if (stat.currentRoundTripTime !== void 0) {
          rtt = stat.currentRoundTripTime * 1e3;
        }
        if (stat.availableOutgoingBitrate !== void 0) {
          availableOutgoingBitrate = stat.availableOutgoingBitrate;
        }
        if (stat.availableIncomingBitrate !== void 0) {
          availableIncomingBitrate = stat.availableIncomingBitrate;
        }
        const localCandidate = stat.localCandidateId !== void 0 ? reportWithLookup.get(stat.localCandidateId) : void 0;
        if (localCandidate?.candidateType) {
          candidateType = localCandidate.candidateType;
        }
        const samePair = lastCandPairId === candPairId;
        const timeDiff = samePair && lastCandPairTimestamp !== void 0 ? stat.timestamp - lastCandPairTimestamp : 0;
        if (stat.bytesReceived !== void 0) {
          if (samePair && lastBytesReceived !== void 0 && timeDiff > 0) {
            incomingBitrate = (stat.bytesReceived - lastBytesReceived) * 8 / timeDiff * 1e3;
          }
          lastBytesReceived = stat.bytesReceived;
        }
        if (stat.bytesSent !== void 0) {
          if (samePair && lastBytesSent !== void 0 && timeDiff > 0) {
            outgoingBitrate = (stat.bytesSent - lastBytesSent) * 8 / timeDiff * 1e3;
          }
          lastBytesSent = stat.bytesSent;
        }
        lastCandPairTimestamp = stat.timestamp;
        lastCandPairId = candPairId;
      }
      if (videoInboundRtpId === void 0 && stat.type === "inbound-rtp" && stat.kind === "video") {
        videoInboundRtpId = stat.id;
        if (stat.framesPerSecond !== void 0) {
          framesPerSecond = stat.framesPerSecond;
        }
        if (stat.jitter !== void 0) {
          jitter = stat.jitter;
        }
        if (stat.packetsReceived !== void 0 && stat.packetsLost !== void 0 && stat.packetsReceived + stat.packetsLost > 0) {
          packetLossRatio = stat.packetsLost / (stat.packetsReceived + stat.packetsLost);
        }
      }
    });
    return {
      rtt,
      candidateType,
      availableIncomingBitrate,
      availableOutgoingBitrate,
      incomingBitrate,
      outgoingBitrate,
      framesPerSecond,
      packetLossRatio,
      jitter,
      timestamp: Date.now()
    };
  };
}
var modulePromise = null;
function loadReactorWasm() {
  if (!modulePromise) {
    modulePromise = importWasmModule().catch((cause) => {
      modulePromise = null;
      throw new Error(
        "reactor-wasm failed to load. Run `mise run build:wasm` (or, from a published install, reinstall the package) and try again.",
        { cause }
      );
    });
  }
  return modulePromise;
}
async function importWasmModule() {
  const module = await import(
    /* @vite-ignore */
    "./wasm/reactor_wasm.js"
  );
  await module.default();
  return module;
}
var package_default = {
  name: "@reactor-team/js-sdk",
  version: "3.0.2",
  description: "Connect your JavaScript/TypeScript app to a live Reactor model in the browser.",
  license: "Apache-2.0",
  repository: {
    type: "git",
    url: "git+https://github.com/reactor-team/reactor-client-sdks.git",
    directory: "sdks/js"
  },
  type: "module",
  sideEffects: false,
  main: "./dist/index.cjs",
  module: "./dist/index.js",
  types: "./dist/index.d.ts",
  exports: {
    ".": {
      types: "./dist/index.d.ts",
      import: "./dist/index.js",
      require: "./dist/index.cjs"
    }
  },
  files: [
    "dist"
  ],
  engines: {
    node: ">=18"
  },
  scripts: {
    build: "tsup && node scripts/copy-wasm.mjs",
    prepack: "npm run build",
    dev: "tsup --watch",
    "type-check": "tsc --noEmit",
    lint: "eslint .",
    test: "vitest run",
    clean: "rm -rf dist"
  },
  dependencies: {
    awaitqueue: "^3.3.1",
    "hls.js": "^1.6.0",
    mp4box: "^2.4.1"
  },
  peerDependencies: {
    react: "^18.0.0 || ^19.0.0"
  },
  devDependencies: {
    "@eslint/js": "^9.39.5",
    "@stylistic/eslint-plugin": "^5.10.0",
    "@testing-library/react": "^16.0.0",
    "@types/react": "^19.0.0",
    eslint: "^9.39.5",
    "eslint-plugin-react-hooks": "^5.0.0",
    jsdom: "^25.0.0",
    react: "^19.0.0",
    "react-dom": "^19.0.0",
    tsup: "^8.3.0",
    typescript: "^5.6.0",
    "typescript-eslint": "^8.67.0",
    vitest: "^4.1.11"
  }
};
var RecordingError = class extends Error {
  constructor(code, reason) {
    super(`${code}: ${reason}`);
    this.code = code;
    this.reason = reason;
    this.name = "RecordingError";
  }
  code;
  reason;
};
async function fetchPlaylist(playlistUrl, options = {}) {
  const minDelay = Math.max(0, options.minRetryDelayMs ?? 200);
  const maxDelay = Math.max(minDelay, options.maxRetryDelayMs ?? 2e3);
  const hasDeadline = typeof options.slackMs === "number" && Number.isFinite(options.slackMs);
  const startedPollingAt = Date.now();
  const deadlineMs = hasDeadline ? Math.max(options.predictedReadyAtMs ?? startedPollingAt, startedPollingAt) + options.slackMs : void 0;
  const maxRetries = typeof options.maxRetries === "number" ? options.maxRetries : void 0;
  const init = {};
  if (options.signal) {
    init.signal = options.signal;
  }
  if (options.jwt) {
    init.headers = { Authorization: `Bearer ${options.jwt}` };
  }
  let attempt = 0;
  while (true) {
    let response;
    try {
      response = await fetch(playlistUrl, init);
    } catch (error) {
      if (isAbortError(error)) {
        throw error;
      }
      throw new RecordingError(
        "PLAYLIST_FETCH_FAILED",
        `Network error fetching playlist: ${error.message}`
      );
    }
    if (response.status === 202) {
      if (deadlineMs !== void 0 && Date.now() >= deadlineMs) {
        throw new RecordingError(
          "CLIP_NOT_READY",
          `Boundary chunk still pending after ${options.slackMs}ms grace (predicted ready ${new Date(
            options.predictedReadyAtMs ?? startedPollingAt
          ).toISOString()}). Runtime may have crashed mid-clip.`
        );
      }
      if (maxRetries !== void 0 && attempt >= maxRetries) {
        throw new RecordingError(
          "CLIP_NOT_READY",
          `Manifest still pending after ${attempt + 1} attempts (last status 202)`
        );
      }
      const headerDelay = parseRetryAfter(response.headers.get("Retry-After"), minDelay);
      const delay = Math.min(maxDelay, Math.max(minDelay, headerDelay));
      const clampedDelay = deadlineMs !== void 0 ? Math.min(delay, Math.max(0, deadlineMs - Date.now())) : delay;
      await sleep(clampedDelay, options.signal);
      attempt++;
      continue;
    }
    if (response.status === 200) {
      return await response.text();
    }
    if (response.status === 410 || response.status === 404) {
      throw new RecordingError("CLIP_GONE", "Clip is no longer available or session unknown");
    }
    throw new RecordingError("PLAYLIST_FETCH_FAILED", `Manifest endpoint returned HTTP ${response.status}`);
  }
}
function parsePlaylist(manifestBody, playlistUrl) {
  let initUrl;
  const segments = [];
  for (const rawLine of manifestBody.split(/\r?\n/)) {
    const trimmed = rawLine.trim();
    if (!trimmed) {
      continue;
    }
    if (trimmed.startsWith("#EXT-X-MAP")) {
      const match = trimmed.match(/URI="([^"]+)"/);
      if (match?.[1]) {
        initUrl = resolveAgainst(match[1], playlistUrl);
      }
      continue;
    }
    if (trimmed.startsWith("#")) {
      continue;
    }
    segments.push(resolveAgainst(trimmed, playlistUrl));
  }
  if (!initUrl) {
    throw new RecordingError("INVALID_PLAYLIST", "Playlist is missing an #EXT-X-MAP init segment URI");
  }
  if (segments.length === 0) {
    throw new RecordingError("INVALID_PLAYLIST", "Playlist contains no media segments");
  }
  return { initUrl, segmentUrls: segments };
}
async function downloadClipAsFile(clip, filename = "reactor-clip.mp4", options = {}) {
  const playlistOptions = { predictedReadyAtMs: clip.predictedReadyAtMs };
  if (options.signal) {
    playlistOptions.signal = options.signal;
  }
  if (options.jwt) {
    playlistOptions.jwt = options.jwt;
  }
  const manifestBody = await fetchPlaylist(clip.playlistUrl, playlistOptions);
  const blob = await assembleClipBlob(manifestBody, clip.playlistUrl, options);
  if (filename === null) {
    return blob;
  }
  if (typeof document === "undefined" || typeof URL.createObjectURL !== "function") {
    throw new RecordingError(
      "DOWNLOAD_UNSUPPORTED",
      "downloadClipAsFile requires a DOM environment; pass filename=null to skip the download trigger"
    );
  }
  triggerBrowserDownload(blob, filename);
  return blob;
}
async function assembleClipBlob(manifestBody, playlistUrl, options = {}) {
  const { initUrl, segmentUrls } = parsePlaylist(manifestBody, playlistUrl);
  const orderedUrls = [initUrl, ...segmentUrls];
  const chunkInit = {};
  if (options.signal) {
    chunkInit.signal = options.signal;
  }
  const parts = [];
  let bytes = 0;
  for (const [i, url] of orderedUrls.entries()) {
    let response;
    try {
      response = await fetch(url, chunkInit);
    } catch (error) {
      if (isAbortError(error)) {
        throw error;
      }
      throw new RecordingError("CHUNK_FETCH_FAILED", `Network error fetching chunk ${i}: ${error.message}`);
    }
    if (!response.ok) {
      throw new RecordingError("CHUNK_FETCH_FAILED", `Chunk ${i} returned HTTP ${response.status}`);
    }
    const data = new Uint8Array(await response.arrayBuffer());
    parts.push(data);
    bytes += data.byteLength;
    options.onProgress?.({ fetched: i + 1, total: orderedUrls.length, bytes });
  }
  const finalBytes = await maybeRemux(parts);
  return new Blob([finalBytes], { type: "video/mp4" });
}
async function maybeRemux(parts) {
  const input = concatUint8Arrays(parts);
  try {
    const MP4Box = await loadMp4Box();
    return await remuxFragmentedToFlat(input, MP4Box);
  } catch (error) {
    console.warn("[Reactor] Clip remux failed, returning fragmented MP4 instead.", error);
    return input;
  }
}
var __remuxInternals = {
  loadMp4Box: () => Promise.resolve().then(() => (init_mp4box_all(), mp4box_all_exports))
};
function loadMp4Box() {
  return __remuxInternals.loadMp4Box();
}
async function remuxFragmentedToFlat(input, MP4Box) {
  return new Promise((resolve, reject) => {
    const inFile = MP4Box.createFile();
    const outFile = MP4Box.createFile();
    outFile.init({ brands: ["isom", "mp42", "avc1", "iso2"] });
    const pendingTracks = /* @__PURE__ */ new Map();
    let settled = false;
    const fail = (err) => {
      if (settled) {
        return;
      }
      settled = true;
      reject(err);
    };
    inFile.onError = (_module, message) => {
      fail(new Error(message));
    };
    inFile.onReady = (info) => {
      if (!info.tracks.length) {
        fail(new Error("no tracks in input"));
        return;
      }
      for (const track of info.tracks) {
        inFile.setExtractionOptions(track.id, null, { nbSamples: 1e3 });
      }
      inFile.start();
    };
    inFile.onSamples = (id, _user, samples) => {
      if (settled || samples.length === 0) {
        return;
      }
      let pending = pendingTracks.get(id);
      if (!pending) {
        const firstSample = samples[0];
        if (!firstSample) {
          return;
        }
        const sampleEntry = firstSample.description;
        const inputTrack = trackInfoById(inFile, id);
        const trackOptions = {
          type: sampleEntry.type,
          timescale: firstSample.timescale,
          // `boxes` is typed as `Box[]` but `description_boxes` wants the
          // narrower `BoxKind[]` union — at runtime they're the same
          // concrete instances, just typed loosely.
          description_boxes: sampleEntry.boxes
        };
        if (inputTrack?.track_width !== void 0) {
          trackOptions.width = inputTrack.track_width;
        }
        if (inputTrack?.track_height !== void 0) {
          trackOptions.height = inputTrack.track_height;
        }
        if (inputTrack?.language !== void 0) {
          trackOptions.language = inputTrack.language;
        }
        if (inputTrack?.video) {
          trackOptions.hdlr = "vide";
        } else if (inputTrack?.audio) {
          trackOptions.hdlr = "soun";
        }
        pending = { trackOptions, timescale: firstSample.timescale, firstDts: firstSample.dts, samples: [] };
        pendingTracks.set(id, pending);
      }
      pending.samples.push(...samples);
    };
    let buf;
    try {
      buf = MP4Box.MP4BoxBuffer.fromArrayBuffer(
        input.buffer.slice(input.byteOffset, input.byteOffset + input.byteLength),
        0
      );
    } catch (error) {
      fail(error);
      return;
    }
    try {
      inFile.appendBuffer(buf);
      inFile.flush();
    } catch (error) {
      fail(error);
      return;
    }
    if (settled) {
      return;
    }
    if (pendingTracks.size === 0) {
      fail(new Error("no samples extracted from input"));
      return;
    }
    let originSeconds = Infinity;
    for (const pending of pendingTracks.values()) {
      originSeconds = Math.min(originSeconds, pending.firstDts / pending.timescale);
    }
    try {
      for (const pending of pendingTracks.values()) {
        const outId = outFile.addTrack(pending.trackOptions);
        const dtsShift = Math.round(originSeconds * pending.timescale);
        for (const sample of pending.samples) {
          if (!sample.data) {
            continue;
          }
          outFile.addSample(outId, sample.data, {
            duration: sample.duration,
            dts: sample.dts - dtsShift,
            cts: sample.cts - dtsShift,
            is_sync: sample.is_sync
          });
        }
      }
    } catch (error) {
      fail(error);
      return;
    }
    let output;
    try {
      const stream = outFile.getBuffer();
      output = new Uint8Array(stream.buffer.slice(0, stream.byteLength));
    } catch (error) {
      fail(error);
      return;
    }
    settled = true;
    resolve(output);
  });
}
function trackInfoById(file, id) {
  const info = file.getInfo();
  return info.tracks.find((t) => t.id === id);
}
function concatUint8Arrays(parts) {
  const only = parts.length === 1 ? parts[0] : void 0;
  if (only) {
    return only;
  }
  let total = 0;
  for (const p of parts) {
    total += p.byteLength;
  }
  const out = new Uint8Array(total);
  let offset = 0;
  for (const p of parts) {
    out.set(p, offset);
    offset += p.byteLength;
  }
  return out;
}
function isAbortError(error) {
  return error instanceof DOMException && error.name === "AbortError";
}
function resolveAgainst(target, base) {
  try {
    return new URL(target, base).toString();
  } catch {
    return target;
  }
}
function parseRetryAfter(header, fallbackMs) {
  if (!header) {
    return fallbackMs;
  }
  const seconds = Number(header);
  if (Number.isFinite(seconds) && seconds >= 0) {
    return seconds * 1e3;
  }
  const dateMs = Date.parse(header);
  if (!Number.isNaN(dateMs)) {
    return Math.max(0, dateMs - Date.now());
  }
  return fallbackMs;
}
function sleep(ms, signal) {
  return new Promise((resolve, reject) => {
    if (signal?.aborted) {
      reject(new DOMException("Aborted", "AbortError"));
      return;
    }
    const timer = setTimeout(() => {
      signal?.removeEventListener("abort", onAbort);
      resolve();
    }, ms);
    const onAbort = () => {
      clearTimeout(timer);
      reject(new DOMException("Aborted", "AbortError"));
    };
    signal?.addEventListener("abort", onAbort, { once: true });
  });
}
function triggerBrowserDownload(blob, filename) {
  const objectUrl = URL.createObjectURL(blob);
  try {
    const a = document.createElement("a");
    a.href = objectUrl;
    a.download = filename;
    a.style.display = "none";
    document.body.appendChild(a);
    a.click();
    a.remove();
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
}
var Reactor = class {
  clientOptions;
  jwt;
  client;
  clientPromise;
  disposed = false;
  _lastError;
  schema;
  /** Bumped on every `refreshSchema()` call — lets a call detect it's been
   *  superseded by a newer one even when `client` itself hasn't changed
   *  (e.g. two "ready" transitions on the same reused client). */
  schemaRefreshId = 0;
  capabilities;
  stats;
  connectionTimings;
  statsPollHandle;
  /** Bumped on every `startStatsPolling()`/`stopStatsPolling()` call — lets an
   *  in-flight `getStats()` recognize it's stale once it resolves, even if
   *  `this.client` hasn't changed in the meantime. */
  statsPollGeneration = 0;
  /** Set on the "connecting" status transition, cleared once `connectionTimings`
   *  is finalized on "ready" — see `handleStatusChanged()`. */
  connectStartTime;
  waitingStartTime;
  emitter = new Emitter();
  /** Serializes connect()/reconnect()/disconnect() (and the free() inside
   *  disconnect()/[Symbol.dispose]) against each other. Calling into the
   *  client concurrently with one of these (e.g. a user clicking Disconnect
   *  mid-connect) races its internal state and can throw ("attempted to
   *  take ownership of Rust value while it was borrowed") or corrupt it
   *  outright. */
  queue = new import_awaitqueue.AwaitQueue();
  /** In-flight calls to `withReaderAccess()` — a "reply" `.catch(() => {})`
   *  copy of each, never the caller's own promise, so one rejecting can't
   *  make `Promise.all()` in `withWriterAccess()` reject and skip waiting
   *  for the rest. See `withReaderAccess()`/`withWriterAccess()`. */
  activeReads = /* @__PURE__ */ new Set();
  /** True for the span of a `withWriterAccess()` call — after it has waited
   *  out every read active when it started, before it releases the ones
   *  that arrived while it ran. */
  writerActive = false;
  /** Readers parked in `withReaderAccess()`'s wait loop, woken once
   *  `withWriterAccess()` finishes; each re-checks `writerActive` rather
   *  than assuming its turn, since another writer already queued behind the
   *  first one may have claimed it first. */
  writerIdleWaiters = [];
  /**
   * Runs a read — sendCommand()/requestSchema()/requestClip()/
   * requestRecording() — excluded from a lifecycle op (`withWriterAccess()`)
   * but not from other reads: unlike `queue`, concurrent reads run
   * concurrently. Queuing them the same way `queue` serializes writes would
   * head-of-line block an unrelated command, or even disconnect() itself,
   * behind one slow reply (the binding correlates replies independently, so
   * nothing requires this to be serial).
   *
   * Race-free the same way the wasm binding's own `readyState` check is: the
   * `writerActive` check and this call's registration in `activeReads` both
   * happen before the first `await` inside *fn*, so nothing can run between
   * them on a single-threaded JS event loop.
   */
  async withReaderAccess(fn) {
    while (this.writerActive) {
      await new Promise((resolve) => this.writerIdleWaiters.push(resolve));
    }
    const result = fn();
    const tracked = result.catch(() => void 0);
    this.activeReads.add(tracked);
    try {
      return await result;
    } finally {
      this.activeReads.delete(tracked);
    }
  }
  /**
   * Runs a lifecycle op's client-touching body exclusively: waits out every
   * read already in flight, then blocks new ones (`writerActive`) until it
   * finishes. Only ever called from inside a `queue`-serialized task, so at
   * most one writer runs this at a time — it doesn't serialize against
   * itself, only against `activeReads`.
   */
  async withWriterAccess(fn) {
    this.writerActive = true;
    if (this.activeReads.size > 0) {
      await Promise.all(this.activeReads);
    }
    try {
      return await fn();
    } finally {
      this.writerActive = false;
      const waiters = this.writerIdleWaiters;
      this.writerIdleWaiters = [];
      for (const wake of waiters) {
        wake();
      }
    }
  }
  constructor(options) {
    const { jwt, ...clientOptions } = options;
    this.clientOptions = { sdkVersion: package_default.version, ...clientOptions };
    this.jwt = jwt ?? null;
  }
  // ── Lifecycle ───────────────────────────────────────────────────────────
  /**
   * `jwt`, when given, replaces whatever `new Reactor({ jwt })` was given —
   * including on a client that's still around from a recoverable
   * `disconnect(true)`.
   *
   * Throws if already connected or connecting; call `disconnect()` first.
   */
  async connect(jwt, options) {
    this.assertNotDisposed();
    try {
      if (this.getStatus() !== "disconnected") {
        throw new Error("Already connected or connecting.");
      }
      if (jwt !== void 0) {
        this.jwt = jwt;
        this.client?.setJwt(jwt);
      }
      await this.queue.push(
        () => this.withWriterAccess(async () => {
          const client = await this.getOrCreateClient();
          await client.connect(options);
        }),
        "connect"
      );
    } catch (cause) {
      throw this.captureError(cause);
    }
  }
  /**
   * Ends the connection. By default (`recoverable = false`) this also frees
   * the wasm resource graph — the pump/dispatcher/heartbeat tasks and the
   * peer connection — in one step. Pass `recoverable: true` to keep the
   * wasm client alive so a later `connect()`/`reconnect()` doesn't have to
   * reload wasm and reconstruct it from scratch.
   *
   * Note this only governs the *local* resource graph — the binding's own
   * `disconnect()` always ends the session server-side regardless of this
   * flag, so `recoverable` isn't a way to keep the session itself alive.
   *
   * Queued behind any in-flight `connect()`/`reconnect()` — see `queue`'s
   * docs for why calling into the client concurrently with one of those is
   * unsafe.
   */
  async disconnect(recoverable = false) {
    this.assertNotDisposed();
    try {
      await this.queue.push(
        () => this.withWriterAccess(async () => {
          if (this.client) {
            await this.client.disconnect();
          }
          this.resetConnectionState();
          if (!recoverable) {
            this.freeClient();
          }
        }),
        "disconnect"
      );
    } catch (cause) {
      throw this.captureError(cause);
    }
  }
  /**
   * Only `options.maxAttempts` has an effect here — the rest of
   * `ConnectOptions` (session adoption, connection id, auto-resume) only
   * makes sense when establishing a session in the first place, same as v2's
   * `reconnect()` always ignored them.
   */
  async reconnect(options) {
    this.assertNotDisposed();
    try {
      await this.queue.push(
        () => this.withWriterAccess(async () => {
          const client = await this.getOrCreateClient();
          await client.reconnect(options);
        }),
        "reconnect"
      );
    } catch (cause) {
      throw this.captureError(cause);
    }
  }
  // ── Messaging ───────────────────────────────────────────────────────────
  /**
   * Sends a command to the model and resolves with its correlated reply.
   *
   * `undefined` means the handler acknowledged the command but sent no
   * reply body. The binding's own typed signature promises `undefined` for
   * that case, but its serializer (serde_wasm_bindgen's `json_compatible`
   * mode) actually hands back `null` — normalized here so callers can rely
   * on the documented type instead of the binding's serialization quirk.
   *
   * A `FileRef` (from `uploadFile`) may be passed in `data` wherever the
   * model's schema declares a file. As a top-level value it is extracted and
   * sent as a separate upload reference rather than embedded in the JSON
   * payload; inside an array or object (a parameter that takes several files,
   * say) it is serialized as an upload reference in place.
   *
   * Unlike every other method here, this never rejects — a failure (the
   * session isn't `"ready"`, the send itself fails, …) is reported through
   * `getLastError()`/the `error` event instead, resolving with `undefined`.
   * This is a JS-only compatibility shim, kept because callers routinely
   * fire-and-forget `sendCommand(...)` without `await`/`catch`, and a
   * rejection nobody handles is an unhandled-rejection warning at best. It
   * is deliberately not applied to `publishTrack`/`uploadFile`/etc., which
   * throw normally.
   *
   * `scope` is forwarded to `sendRuntimeScopedCommand()` — see there for
   * what `"runtime"` actually does.
   *
   * `data` accepts any object, except a function.
   */
  async sendCommand(command, data, scope) {
    if (scope === "runtime") {
      return this.sendRuntimeScopedCommand(command, data);
    }
    try {
      this.assertNotDisposed();
      const extracted = extractFileRefs(data);
      const reply = await this.withReaderAccess(async () => {
        const client = await this.getOrCreateClient();
        return client.sendCommand(command, extracted.data, extracted.uploads);
      });
      return reply ?? void 0;
    } catch (cause) {
      this.emitError(cause);
      return void 0;
    }
  }
  /**
   * Handles `sendCommand(command, data, "runtime")` — this SDK has no
   * generic runtime-scope channel. `reactor-core`'s `send_command` is a
   * single channel; `requestSchema`/clip requests/heartbeat are each their
   * own dedicated RPC instead of a scoped envelope, so there's nothing
   * generic to route a scope through at the wire level.
   *
   * `requestSchema` and `requestCapabilities` route to their direct
   * equivalents below, neither of which returns a `ReactorMessage` the way a
   * normal `sendCommand()` reply would, so both resolve `undefined`; the
   * actual data surfaces through `getSchema()`/`schemaReceived` and
   * `getCapabilities()`/`capabilitiesReceived` as it already does. Anything
   * else has no runtime-scope destination to route to — rather than silently
   * doing nothing, it falls through as a normal application-scope send, with
   * a console warning.
   */
  async sendRuntimeScopedCommand(command, data) {
    switch (command) {
      case "requestSchema":
        try {
          await this.withReaderAccess(async () => {
            const client = await this.getOrCreateClient();
            await this.refreshSchema(client);
          });
        } catch (cause) {
          this.emitError(cause);
        }
        return void 0;
      case "requestCapabilities":
        return void 0;
      default:
        console.warn(
          `[Reactor] sendCommand(${JSON.stringify(command)}, \u2026, "runtime") has no runtime-scope destination in this SDK \u2014 sending as a normal application-scope command instead.`
        );
        return this.sendCommand(command, data);
    }
  }
  /** Requests the model's command schema directly. Most callers don't need
   *  this — it's already fetched once and cached as soon as the session
   *  reaches `"ready"`; use `getSchema()` for that. Resolves `undefined`
   *  when the model doesn't expose a schema — the binding replies with a
   *  wire `null` in that case rather than omitting the field. */
  async requestSchema() {
    this.assertNotDisposed();
    try {
      return await this.withReaderAccess(async () => {
        const client = await this.getOrCreateClient();
        return this.normalizeSchema(await client.requestSchema());
      });
    } catch (cause) {
      throw this.captureError(cause);
    }
  }
  /** The model's command schema (an OpenAPI document), cached from the
   *  `requestSchema()` call fired automatically on `"ready"`. `undefined`
   *  until that reply has landed. */
  getSchema() {
    return this.schema;
  }
  /** The runtime's declared capabilities (negotiated tracks, and the
   *  command set when the model exposes one) — pushed once available, no
   *  explicit request needed. `undefined` until `capabilitiesReceived`
   *  fires. */
  getCapabilities() {
    return this.capabilities;
  }
  /** The session resource, as the coordinator reports it — id, state,
   *  model, cluster, server info, and (once negotiated) `capabilities`.
   *  A live read straight off the wasm client, not cached — reflects
   *  whatever's current. `undefined` before a client exists. */
  getSessionInfo() {
    return this.client?.sessionInfo();
  }
  // ── Tracks ──────────────────────────────────────────────────────────────
  /**
   * Publishes a local `MediaStreamTrack` under `name` — the counterpart to a
   * `sendonly` track the model declares. Awaitable. Queued behind
   * connect()/disconnect()/reconnect() (unlike `sendCommand()`): a track
   * operation awaits its own control round-trip, and a concurrent
   * disconnect() freeing the wasm client mid-await would otherwise resume
   * into a freed client — the same class of use-after-free `queue` exists to
   * prevent for connect/disconnect/reconnect themselves.
   */
  async publishTrack(name, track) {
    this.assertNotDisposed();
    try {
      await this.queue.push(async () => {
        const client = await this.getOrCreateClient();
        await client.publishTrack(name, track);
      }, "publishTrack");
    } catch (cause) {
      throw this.captureError(cause);
    }
  }
  /**
   * Unlike every other track method, this doesn't reject — a failure is
   * reported through the `error` event instead, since this is commonly the
   * last call in a `finally` block, and raising there would replace
   * whatever exception was already propagating.
   */
  async unpublishTrack(name) {
    this.assertNotDisposed();
    try {
      await this.queue.push(async () => {
        const client = await this.getOrCreateClient();
        await client.unpublishTrack(name);
      }, "unpublishTrack");
    } catch (cause) {
      this.emitError(cause);
    }
  }
  /**
   * Stops a received track: the receiver goes inactive and the runtime stops
   * producing it. Awaitable, and queued behind connect()/disconnect()/
   * reconnect() for the same reason as `publishTrack()`.
   */
  async pauseTrack(name) {
    this.assertNotDisposed();
    try {
      await this.queue.push(async () => {
        const client = await this.getOrCreateClient();
        await client.pauseTrack(name);
      }, "pauseTrack");
    } catch (cause) {
      throw this.captureError(cause);
    }
  }
  /**
   * Bounds what one sender may spend, in bits per second.
   *
   * This is the ceiling that actually caps a video encoder, and it is easy to
   * hit without knowing it exists: with nothing set, a Chromium-based browser
   * derives a sender's maximum from the frame size alone, and that maximum is
   * 2500 kbps for anything above 960x540. A 720p or 1080p publish caps at
   * 2.5 Mbps until this raises it, however good the connection is.
   *
   * ```ts
   * await reactor.publishTrack('camera', cameraTrack);
   * await reactor.setTrackBitrate('camera', { maxBps: 8_000_000 });
   * ```
   *
   * A ceiling is permission, not a target: the encoder still spends only what
   * the congestion controller allocated and what the picture needs. What
   * raising it buys is headroom for the moments that would otherwise clip.
   *
   * Needs a connected client, and a published track — there is no sender to
   * bound before `publishTrack()`.
   *
   * Omit a bound to leave it at the browser default. `minBps` is non-standard —
   * Chromium honours it, other engines ignore it.
   *
   * There is no connection-wide counterpart: browsers expose no equivalent of
   * the native SDKs' `setBitrate`, and a method that quietly did nothing would
   * be worse than its absence.
   */
  async setTrackBitrate(name, bounds = {}) {
    this.assertNotDisposed();
    try {
      await this.queue.push(async () => {
        const client = await this.getOrCreateClient();
        await client.setTrackBitrate(name, bounds.minBps, bounds.maxBps);
      }, "setTrackBitrate");
    } catch (cause) {
      throw this.captureError(cause);
    }
  }
  /** Resumes a track previously stopped with `pauseTrack()`. */
  async resumeTrack(name) {
    this.assertNotDisposed();
    try {
      await this.queue.push(async () => {
        const client = await this.getOrCreateClient();
        await client.resumeTrack(name);
      }, "resumeTrack");
    } catch (cause) {
      throw this.captureError(cause);
    }
  }
  // ── Recording ───────────────────────────────────────────────────────────
  /**
   * Requests a clip covering the last `durationSeconds` of the session.
   * `reactor-core` correlates the reply itself (and enforces `"ready"`), so
   * this is a thin delegation, same as `requestSchema()`. See
   * `downloadClipAsFile()` to turn the result into a file.
   */
  async requestClip(durationSeconds) {
    this.assertNotDisposed();
    try {
      return await this.withReaderAccess(async () => {
        const client = await this.getOrCreateClient();
        return toPublicClip(await client.requestClip(durationSeconds));
      });
    } catch (cause) {
      throw this.captureError(cause);
    }
  }
  /** Requests a clip covering the entire session up to now. See `requestClip()`. */
  async requestRecording() {
    this.assertNotDisposed();
    try {
      return await this.withReaderAccess(async () => {
        const client = await this.getOrCreateClient();
        return toPublicClip(await client.requestRecording());
      });
    } catch (cause) {
      throw this.captureError(cause);
    }
  }
  /** Thin delegation to the standalone `downloadClipAsFile()` — see its own doc comment. */
  async downloadClipAsFile(clip, filename = "reactor-clip.mp4", options) {
    return downloadClipAsFile(clip, filename, options);
  }
  // ── Uploads ─────────────────────────────────────────────────────────────
  /**
   * Uploads a file to the session's object store, resolving with a
   * `FileRef` to pass in a `sendCommand()`'s `data`, at the top level or
   * inside an array or object (see `extractFileRefs`). The binding itself
   * takes `(file, name?)`
   * positionally and already applies the right defaulting — a bare
   * `Blob`'s name falls back to `"upload"`, and an empty/missing mime type
   * to `"application/octet-stream"` — so there's nothing to wrap here.
   *
   * Queued behind connect()/disconnect()/reconnect(), same as the track
   * ops: this awaits its own round-trip, and a concurrent disconnect()
   * freeing the wasm client mid-upload would otherwise resume into a freed
   * client — the same use-after-free class of race the queue exists to
   * prevent.
   */
  async uploadFile(file, options) {
    this.assertNotDisposed();
    try {
      const wireFileRef = await this.queue.push(async () => {
        const client = await this.getOrCreateClient();
        return client.uploadFile(file, options?.name);
      }, "uploadFile");
      return toPublicFileRef(wireFileRef);
    } catch (cause) {
      throw this.captureError(cause);
    }
  }
  /** All tracks the model declared, whether or not media has arrived for —
   *  or been published to — them yet. Empty before a client exists. */
  tracks() {
    return this.client?.tracks() ?? [];
  }
  /** Same as `tracks()`, plus each entry's negotiated `mid` — the id
   *  `trackReceived`'s `mid` argument and the `getXByMid` escape hatches key
   *  on. Only populated once SDP negotiation has assigned mids. */
  trackMapping() {
    return this.client?.trackMapping() ?? [];
  }
  pausedTracks() {
    return this.client?.pausedTracks() ?? [];
  }
  // ── Escape hatches ──────────────────────────────────────────────────────
  /** Drops to the raw `RTCPeerConnection` for anything this class doesn't
   *  wrap directly. `undefined` before a client exists. */
  getPeerConnection() {
    return this.client?.getPeerConnection();
  }
  getTrackByMid(mid) {
    return this.client?.getTrackByMid(mid);
  }
  getStreamByMid(mid) {
    return this.client?.getStreamByMid(mid);
  }
  getTrackByName(name) {
    return this.client?.getTrackByName(name);
  }
  getStreamByName(name) {
    return this.client?.getStreamByName(name);
  }
  /**
   * Supports `using reactor = new Reactor(...)`: releases the wasm resource
   * graph and drops every registered event handler for good. Unlike a plain
   * `disconnect()`, this instance is unusable afterward — construct a new
   * `Reactor` instead of trying to `connect()` again.
   */
  [Symbol.dispose]() {
    if (this.disposed) {
      return;
    }
    this.disposed = true;
    const client = this.client;
    this.client = void 0;
    this.clientPromise = void 0;
    this.schema = void 0;
    this.capabilities = void 0;
    this.resetConnectionState();
    this.emitter.clear();
    if (client) {
      void this.queue.push(() => this.withWriterAccess(() => Promise.resolve(client.free())), "dispose").catch(() => {
      });
    }
  }
  // ── Introspection ───────────────────────────────────────────────────────
  /** The wasm binding's own terser `status()` name can be added alongside
   *  this later if it turns out to be worth it. */
  getStatus() {
    return this.client?.status() ?? "disconnected";
  }
  /** See `getStatus()`. */
  getSessionId() {
    return this.client?.sessionId();
  }
  /** The `jwt` this instance was constructed (or last `connect()`ed) with —
   *  lets a component composed inside a `ReactorProvider` (e.g. `ClipPlayer`)
   *  authenticate its own requests without the caller repeating the resolver. */
  getJwtResolver() {
    return this.jwt ?? void 0;
  }
  /** The most recent `ReactorError`, from either an `error` event or a
   *  rejected call — whichever landed last. `undefined` until the first
   *  failure. */
  getLastError() {
    return this._lastError;
  }
  /** The most recent WebRTC connection stats, polled every `STATS_INTERVAL_MS`
   *  while "ready" — see `statsUpdate`. `undefined` before the first sample. */
  getStats() {
    return this.stats;
  }
  /** Timing breakdown from the most recent `connect()`/`reconnect()`
   *  handshake — see `ConnectionTimings`. */
  getConnectionTimings() {
    return this.connectionTimings;
  }
  // ── Events ──────────────────────────────────────────────────────────────
  on(event, handler) {
    this.emitter.on(event, handler);
  }
  off(event, handler) {
    this.emitter.off(event, handler);
  }
  once(event, handler) {
    this.emitter.once(event, handler);
  }
  // ── Internal ────────────────────────────────────────────────────────────
  getOrCreateClient() {
    if (!this.clientPromise) {
      this.clientPromise = this.createClient().catch((cause) => {
        this.clientPromise = void 0;
        throw cause;
      });
    }
    return this.clientPromise;
  }
  async createClient() {
    const { ReactorClient: WasmReactorClient } = await loadReactorWasm();
    if (this.disposed) {
      throw new Error("Reactor was disposed while connecting.");
    }
    const client = new WasmReactorClient(this.clientOptions, this.jwt);
    client.onStatusChanged((status) => {
      this.emitter.emit("statusChanged", status);
      this.handleStatusChanged(client, status);
    });
    client.onSessionIdChanged((sessionId) => this.emitter.emit("sessionIdChanged", sessionId));
    client.onError((error) => this.emitError(error));
    client.onMessage((message) => {
      debugLog("[Reactor] message:", message);
      this.emitter.emit("message", message);
    });
    client.onRuntimeMessage((message) => {
      debugLog("[Reactor] runtimeMessage:", message);
      this.emitter.emit("runtimeMessage", message);
    });
    client.onCapabilitiesReceived((capabilities) => {
      this.capabilities = toPublicCapabilities(capabilities);
      this.emitter.emit("capabilitiesReceived", this.capabilities);
    });
    client.onTrackReceived((name, mid) => {
      const track = client.getTrackByName(name);
      const stream = client.getStreamByName(name);
      if (!track || !stream) {
        return;
      }
      this.emitter.emit("trackReceived", name, track, stream, mid);
    });
    this.client = client;
    return client;
  }
  /** Fired once per `"ready"` transition — see `getSchema()`. `getSchema()`
   *  isn't guaranteed populated by the time a `statusChanged` "ready" handler
   *  runs (this fetch is async and dispatched separately), so callers that
   *  need the schema as soon as it lands should listen for `schemaReceived`
   *  instead of reading `getSchema()` synchronously off `statusChanged`.
   *
   *  Guards against a stale reply: if `disconnect()`/a later `connect()`
   *  replaces `client` before this resolves, or a newer `refreshSchema()`
   *  call for the same client wins the race, the result is discarded rather
   *  than clobbering `this.schema` (or emitting `schema`) with old data.
   *
   *  A rejection here (e.g. the session drops mid-request) surfaces like any
   *  other binding failure, through the same `error` event as `onError`. */
  async refreshSchema(client) {
    const refreshId = ++this.schemaRefreshId;
    try {
      const schema = this.normalizeSchema(await client.requestSchema());
      if (this.client !== client || refreshId !== this.schemaRefreshId) {
        return;
      }
      if (schema === void 0) {
        return;
      }
      this.schema = schema;
      this.emitter.emit("schemaReceived", this.schema);
      this.emitter.emit("runtimeMessage", { type: "modelSchema", data: this.schema });
    } catch (cause) {
      if (this.client !== client || refreshId !== this.schemaRefreshId) {
        return;
      }
      this.emitError(cause);
    }
  }
  /** The binding replies with a wire `null` (not an omitted field) when the
   *  model doesn't expose a schema — normalized to `undefined` so callers
   *  get the same "no schema" sentinel `getSchema()` already uses instead
   *  of a document they could otherwise dereference. */
  normalizeSchema(schema) {
    return schema ?? void 0;
  }
  /** Frees the wasm resource graph, if one exists, and clears the cached
   *  schema. Reusable — unlike `[Symbol.dispose]`, this doesn't set the
   *  permanent `disposed` flag, so a later `connect()`/`reconnect()` lazily
   *  builds a fresh client.
   *
   *  Only called from within `disconnect()`'s queued task, so `client.free()`
   *  is safe to call directly here — the queue already guarantees no other
   *  operation is running concurrently against it. */
  freeClient() {
    this.client?.free();
    this.client = void 0;
    this.clientPromise = void 0;
    this.schema = void 0;
    this.capabilities = void 0;
  }
  /** Tracks `connectionTimings` off the binding's own "connecting" → "waiting"
   *  → "ready" status sequence (see `ReactorStatus`), and starts/stops stats
   *  polling around the "ready" window. */
  handleStatusChanged(client, status) {
    switch (status) {
      case "connecting":
        this.connectStartTime = performance.now();
        this.waitingStartTime = void 0;
        break;
      case "waiting":
        this.waitingStartTime = performance.now();
        break;
      case "ready": {
        const readyTime = performance.now();
        if (this.connectStartTime != null) {
          const waitingStartTime = this.waitingStartTime ?? readyTime;
          this.connectionTimings = {
            sessionCreationMs: waitingStartTime - this.connectStartTime,
            transportConnectingMs: readyTime - waitingStartTime,
            totalMs: readyTime - this.connectStartTime
          };
        }
        this.startStatsPolling(client);
        void this.refreshSchema(client);
        break;
      }
      default:
        this.stopStatsPolling();
    }
  }
  startStatsPolling(client) {
    this.stopStatsPolling();
    const generation = ++this.statsPollGeneration;
    const extractStats = createRTCStatsExtractor();
    this.statsPollHandle = setInterval(() => {
      const peerConnection = client.getPeerConnection();
      if (!peerConnection) {
        return;
      }
      peerConnection.getStats().then((report) => {
        if (generation !== this.statsPollGeneration) {
          return;
        }
        this.stats = { ...extractStats(report), connectionTimings: this.connectionTimings };
        this.emitter.emit("statsUpdate", this.stats);
      }).catch(() => {
      });
    }, STATS_INTERVAL_MS);
  }
  stopStatsPolling() {
    this.statsPollGeneration += 1;
    if (this.statsPollHandle !== void 0) {
      clearInterval(this.statsPollHandle);
      this.statsPollHandle = void 0;
    }
    this.stats = void 0;
  }
  /** Called on every `disconnect()` and on `[Symbol.dispose]`. Leaves
   *  `client`/`schema` alone — that's `freeClient()`'s job, run separately
   *  when `disconnect()` isn't recoverable. `capabilities` is cleared here
   *  regardless, though: unlike the schema, it isn't re-fetched on demand,
   *  so a recoverable disconnect that skips `freeClient()` would otherwise
   *  leave `getCapabilities()` returning the previous session's stale
   *  tracks/commands until a new `capabilitiesReceived` lands. */
  resetConnectionState() {
    this.stopStatsPolling();
    this.connectionTimings = void 0;
    this.connectStartTime = void 0;
    this.waitingStartTime = void 0;
    this.capabilities = void 0;
  }
  /** Wraps `cause` and records it as the most recent failure, for a call
   *  that's about to throw rather than emit — see `getLastError()`'s doc
   *  comment. */
  captureError(cause) {
    const error = toReactorError(cause);
    this._lastError = error;
    return error;
  }
  /** Wraps `cause`, records it as the most recent failure, and fires the
   *  `error` event — the one place recording and emitting happen together,
   *  so `getLastError()` never drifts from what listeners were told. */
  emitError(cause) {
    this.emitter.emit("error", this.captureError(cause));
  }
  assertNotDisposed() {
    if (this.disposed) {
      throw new Error("This Reactor was disposed and can't be used again \u2014 construct a new one.");
    }
  }
};
var ReactorContext = (0, import_react.createContext)(void 0);

// public/scene.js
function promptForScene(brief2, action, history = []) {
  const d = brief2.direction;
  return `First-person playable horror scene, a continuous six-second shot with synchronized sound.
PRIMARY FEAR FROM THE FINAL CONSULTATION ANSWER: ${JSON.stringify(brief2.fear)}.
REQUIRED VISIBLE SUBJECT: ${d.subject}. Show the actual animal/object/situation, not a metaphor, text label or substitute monster.
SETTING AND CONTINUITY: ${d.setting}.
${history.length ? "Continue the preceding clip from the same first-person position. Preserve the same subjects, habitat, lighting and layout." : d.opening}
IMMEDIATE PLAYER ACTION: ${action}
RECENT ACTIONS: ${history.slice(-4).join("; ")}.
Show the physical consequence, in this habitat (underwater movement must swim, not walk). Keep the feared subject clearly visible throughout the shot, with natural movement. Objective: ${d.objective}.
SECONDARY CONSULTATION IMAGERY: ${JSON.stringify(brief2.imagery)}. Use only details compatible with the primary fear and habitat; do not move to a house or office just because the question mentioned darkness or a house.
Intensity: ${brief2.intensity}. Use realistic environmental sound appropriate to this habitat. No on-screen UI, captions or explicit gore. Excluded themes take precedence over all other instructions: ${JSON.stringify(brief2.exclusions || "none")}.`;
}

// public/world.js
var $ = (id) => document.getElementById(id);
var active = null;
async function stopWorld() {
  const run2 = active;
  active = null;
  if (!run2) return;
  clearTimeout(run2.timer);
  run2.abort.abort();
  run2.cancel?.(new Error("Session ended."));
  $("world-video").srcObject = null;
  await run2.client?.disconnect().catch(() => {
  });
}
async function startWorld(brief2, onShow) {
  await stopWorld();
  const run2 = { client: null, abort: new AbortController(), timer: null, cancel: null };
  active = run2;
  const current = () => active === run2;
  let busy = true, failed = false, previousClip = "", pending = null, turn = 0, history = [];
  let resolveFirst, rejectFirst;
  const first = new Promise((resolve, reject) => {
    resolveFirst = resolve;
    rejectFirst = reject;
  });
  first.catch(() => {
  });
  run2.cancel = rejectFirst;
  onShow();
  $("game-story").textContent = `Your greatest fear: \u201C${brief2.fear}\u201D. ${brief2.direction.objective}`;
  $("world-actions").replaceChildren();
  const actions = [["W", "Move cautiously forward through the established environment (swim if underwater), watching the feared subject."], ["A", "Turn the first-person camera to the left and examine that part of the same environment."], ["S", "Back slowly away from the feared subject."], ["D", "Turn the first-person camera to the right and look for a safe path."], ["E", "Investigate the nearest object without touching the feared subject."]];
  const buttons = actions.map(([key, action]) => {
    const b = document.createElement("button");
    b.className = "btn";
    b.textContent = key + " \xB7 " + { W: "Forward", A: "Left", S: "Back", D: "Right", E: "Investigate" }[key];
    b.onclick = () => {
      if (!busy && !failed) void enqueue(action);
    };
    $("world-actions").append(b);
    return b;
  });
  function controls(disabled) {
    busy = disabled;
    buttons.forEach((b) => b.disabled = disabled);
    $("action-input").disabled = disabled;
    $("action-send").disabled = disabled;
  }
  function fail(message) {
    if (!current() || failed) return;
    failed = true;
    clearTimeout(run2.timer);
    controls(true);
    $("world-status").textContent = message;
    rejectFirst(new Error(message));
    void run2.client?.disconnect().catch(() => {
    });
  }
  async function enqueue(action) {
    if (!current() || failed) return;
    controls(true);
    pending = { id: String(turn++), action };
    const prompt = promptForScene(brief2, action, history);
    $("generation-prompt").textContent = prompt;
    $("world-status").textContent = "H3 is generating your next scene\u2026";
    clearTimeout(run2.timer);
    run2.timer = setTimeout(() => fail("H3 generation timed out. End the session and retry."), 12e4);
    try {
      await run2.client.sendCommand("enqueue", { prompt, seconds: 6, continue_from_clip_id: previousClip, metadata: pending.id });
    } catch {
      fail("H3 rejected the generation request. End the session and retry.");
    }
  }
  $("action-form").onsubmit = (e) => {
    e.preventDefault();
    const action = $("action-input").value.trim();
    if (action && !busy && !failed) {
      $("action-input").value = "";
      void enqueue(action);
    }
  };
  window.addEventListener("keydown", (e) => {
    if (e.repeat || e.ctrlKey || e.metaKey || e.altKey || e.target instanceof HTMLInputElement || busy || failed) return;
    const match = actions.find(([key]) => "Key" + key === e.code);
    if (match) {
      e.preventDefault();
      void enqueue(match[1]);
    }
  }, { signal: run2.abort.signal });
  controls(true);
  $("world-status").textContent = "Connecting to Reactor FastH3\u2026";
  try {
    const response = await fetch("/api/reactor/token", { method: "POST", headers: { "Content-Type": "application/json" }, body: "{}", signal: AbortSignal.timeout(25e3) });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Reactor authentication failed.");
    if (!current()) return;
    const client = new Reactor({ modelName: data.model });
    run2.client = client;
    const stream = new MediaStream(), video = $("world-video");
    video.srcObject = stream;
    client.on("trackReceived", (name, track) => {
      if (!current() || !["main_video", "main_audio"].includes(name)) return;
      stream.addTrack(track);
      video.play().catch(() => {
        $("world-status").textContent = "Press play to enable the video and sound.";
      });
    });
    client.on("message", (message) => {
      if (!current() || failed) return;
      const payload = message.data;
      if (message.type === "clip_started") $("world-status").textContent = "Reactor FastH3 \xB7 scene playing";
      if (message.type === "clip_failed" || message.type === "command_error") fail("H3 could not produce this scene. End the session and retry.");
      if (message.type === "clip_finished" && pending && payload?.clip?.metadata === pending.id) {
        clearTimeout(run2.timer);
        previousClip = payload.clip.clip_id;
        history.push(pending.action);
        pending = null;
        controls(false);
        $("world-status").textContent = "Your move. The next scene follows your action.";
        resolveFirst();
        run2.cancel = null;
      }
    });
    client.on("error", (error) => {
      if (error.status === 402 || String(error.message).includes("credits_depleted")) {
        fail("Reactor credits are depleted. Add credits in your Reactor dashboard, then click Enter the nightmare to retry with the same consultation.");
        return;
      }
      const detail = String(error.message || "").replace(/rk_[a-zA-Z0-9]+|eyJ[a-zA-Z0-9_.-]+/g, "[redacted]").slice(0, 500);
      fail(`Reactor ${error.operation || "connection"} failed (${error.code || "unknown"}${error.status ? ", HTTP " + error.status : ""}): ${detail}`);
    });
    client.on("statusChanged", (status) => {
      if (!current() || failed) return;
      if (status === "waiting") $("world-status").textContent = "Waiting for Reactor capacity\u2026";
      if (status === "disconnected") fail("Reactor disconnected. End the session and retry.");
    });
    run2.timer = setTimeout(() => fail("Reactor connection timed out."), 12e4);
    await Promise.race([client.connect(data.jwt), first]);
    if (!current()) return;
    await client.sendCommand("set_autoplay", { enabled: true });
    await client.sendCommand("set_flush_on_clip_end", { enabled: false });
    await enqueue("Reveal the actual feared subject clearly in front of the player. Establish a possible route to safety.");
    await first;
  } catch (error) {
    if (current()) await stopWorld();
    throw error;
  }
}

// public/app.js
var $2 = (id) => document.getElementById(id);
var screens = ["intro", "loading", "session", "outro", "world"];
var state;
var brief;
var stopped = false;
var answers = [];
function show(name) {
  screens.forEach((id) => $2(id).classList.toggle("hidden", id !== name));
}
async function api(url, body) {
  const res = await fetch(url, { method: body ? "POST" : "GET", headers: { "Content-Type": "application/json" }, body: body ? JSON.stringify(body) : void 0 });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || "The session could not connect. Please try again.");
  }
  return res.json();
}
function speak(turn) {
  const video = $2("doctor"), portrait = $2("portrait");
  video.pause();
  video.classList.toggle("hidden", !turn.videoUrl);
  portrait.classList.toggle("hidden", !!turn.videoUrl);
  $2("line").textContent = turn.line;
  if (state.portraitUrl) {
    portrait.style.backgroundImage = `url(${JSON.stringify(state.portraitUrl)})`;
    portrait.querySelector("svg").style.visibility = "hidden";
  }
  return new Promise((resolve) => {
    if (turn.videoUrl) {
      video.onended = () => {
        video.onended = null;
        video.onerror = null;
        resolve();
      };
      video.onerror = () => {
        video.onended = null;
        video.onerror = null;
        speak({ ...turn, videoUrl: null }).then(resolve);
      };
      video.src = turn.videoUrl;
      video.controls = true;
      video.play().catch(() => {
      });
    } else if ("speechSynthesis" in window) {
      speechSynthesis.cancel();
      const speech = new SpeechSynthesisUtterance(turn.line);
      speech.rate = 0.82;
      speech.pitch = 0.65;
      speech.onend = resolve;
      speech.onerror = resolve;
      speechSynthesis.speak(speech);
    } else {
      resolve();
    }
  });
}
async function run() {
  $2("begin-btn").disabled = true;
  show("loading");
  try {
    state = await api("/api/session", {});
    const deadline = Date.now() + 18e4;
    while (state.status !== "ready" && Date.now() < deadline) {
      await new Promise((r) => setTimeout(r, 1500));
      if (stopped) return;
      state = await api("/api/session");
    }
    for (let i = 0; i < state.turns.length; i++) {
      if (stopped) return;
      show("session");
      $2("progress").textContent = `CONSULTATION / 0${i + 1} OF 0${state.turns.length}`;
      $2("answer-form").classList.add("hidden");
      $2("answer-form").onsubmit = null;
      await speak(state.turns[i]);
      if (stopped) return;
      $2("answer-label").textContent = state.turns[i].label;
      $2("answer-input").value = "";
      $2("answer-form").classList.remove("hidden");
      $2("answer-input").focus();
      answers[i] = await new Promise((resolve) => {
        $2("answer-form").onsubmit = (e) => {
          e.preventDefault();
          const value = $2("answer-input").value.trim();
          if (!value) return;
          $2("answer-form").classList.add("hidden");
          $2("answer-form").onsubmit = null;
          $2("doctor").pause();
          window.speechSynthesis?.cancel();
          resolve(value);
        };
      });
    }
    show("loading");
    $2("loading-text").textContent = "Turning your consultation into a nightmare\u2026";
    brief = await api("/api/brief", { answers, intensity: $2("intensity").value, exclusions: $2("exclusions").value });
    $2("fear-echo").textContent = `\u201C${brief.fear}\u201D`;
    $2("world-prompt").textContent = brief.prompt;
    show("outro");
    await enterWorld();
  } catch (err) {
    show("intro");
    $2("error").textContent = err.message;
  } finally {
    $2("begin-btn").disabled = false;
  }
}
$2("begin-btn").onclick = run;
$2("exit-btn").onclick = async () => {
  stopped = true;
  window.speechSynthesis?.cancel();
  await stopWorld();
  location.reload();
};
$2("download-btn").onclick = () => {
  const url = URL.createObjectURL(new Blob([JSON.stringify(brief, null, 2)], { type: "application/json" }));
  const a = document.createElement("a");
  a.href = url;
  a.download = "reactor-horror-brief.json";
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1e3);
};
$2("copy-btn").onclick = async () => {
  try {
    await navigator.clipboard.writeText(brief.prompt);
    $2("copy-btn").textContent = "Copied";
  } catch {
    $2("copy-btn").textContent = "Select the prompt below to copy";
  }
};
async function enterWorld() {
  $2("enter-world").disabled = true;
  $2("reactor-error").textContent = "";
  try {
    await startWorld(brief, () => show("world"));
  } catch (err) {
    show("outro");
    $2("reactor-error").textContent = err.message;
  } finally {
    $2("enter-world").disabled = false;
  }
}
$2("enter-world").onclick = enterWorld;
$2("stop-world").onclick = async () => {
  await stopWorld();
  show("outro");
};
window.addEventListener("pagehide", () => {
  void stopWorld();
});
/*! Bundled license information:

react/cjs/react.development.js:
  (**
   * @license React
   * react.development.js
   *
   * Copyright (c) Meta Platforms, Inc. and affiliates.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE file in the root directory of this source tree.
   *)

react/cjs/react-jsx-runtime.development.js:
  (**
   * @license React
   * react-jsx-runtime.development.js
   *
   * Copyright (c) Meta Platforms, Inc. and affiliates.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE file in the root directory of this source tree.
   *)
*/
