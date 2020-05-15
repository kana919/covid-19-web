(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[1],Array(136).concat([
/* 136 */
/***/ (function(module, exports, __webpack_require__) {

var global = __webpack_require__(137);
var getOwnPropertyDescriptor = __webpack_require__(152).f;
var createNonEnumerableProperty = __webpack_require__(146);
var redefine = __webpack_require__(145);
var setGlobal = __webpack_require__(180);
var copyConstructorProperties = __webpack_require__(204);
var isForced = __webpack_require__(174);

/*
  options.target      - name of the target object
  options.global      - target is the global object
  options.stat        - export as static methods of target
  options.proto       - export as prototype methods of target
  options.real        - real prototype method for the `pure` version
  options.forced      - export even if the native feature is available
  options.bind        - bind methods to the target, required for the `pure` version
  options.wrap        - wrap constructors to preventing global pollution, required for the `pure` version
  options.unsafe      - use the simple assignment of property instead of delete + defineProperty
  options.sham        - add a flag to not completely full polyfills
  options.enumerable  - export as enumerable property
  options.noTargetGet - prevent calling a getter on target
*/
module.exports = function (options, source) {
  var TARGET = options.target;
  var GLOBAL = options.global;
  var STATIC = options.stat;
  var FORCED, target, key, targetProperty, sourceProperty, descriptor;
  if (GLOBAL) {
    target = global;
  } else if (STATIC) {
    target = global[TARGET] || setGlobal(TARGET, {});
  } else {
    target = (global[TARGET] || {}).prototype;
  }
  if (target) for (key in source) {
    sourceProperty = source[key];
    if (options.noTargetGet) {
      descriptor = getOwnPropertyDescriptor(target, key);
      targetProperty = descriptor && descriptor.value;
    } else targetProperty = target[key];
    FORCED = isForced(GLOBAL ? key : TARGET + (STATIC ? '.' : '#') + key, options.forced);
    // contained in target
    if (!FORCED && targetProperty !== undefined) {
      if (typeof sourceProperty === typeof targetProperty) continue;
      copyConstructorProperties(sourceProperty, targetProperty);
    }
    // add a flag to not completely full polyfills
    if (options.sham || (targetProperty && targetProperty.sham)) {
      createNonEnumerableProperty(sourceProperty, 'sham', true);
    }
    // extend global
    redefine(target, key, sourceProperty, options);
  }
};


/***/ }),
/* 137 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global) {var check = function (it) {
  return it && it.Math == Math && it;
};

// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
module.exports =
  // eslint-disable-next-line no-undef
  check(typeof globalThis == 'object' && globalThis) ||
  check(typeof window == 'object' && window) ||
  check(typeof self == 'object' && self) ||
  check(typeof global == 'object' && global) ||
  // eslint-disable-next-line no-new-func
  Function('return this')();

/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(148)))

/***/ }),
/* 138 */
/***/ (function(module, exports) {

module.exports = function (exec) {
  try {
    return !!exec();
  } catch (error) {
    return true;
  }
};


/***/ }),
/* 139 */
/***/ (function(module, exports, __webpack_require__) {

var global = __webpack_require__(137);
var shared = __webpack_require__(182);
var has = __webpack_require__(143);
var uid = __webpack_require__(171);
var NATIVE_SYMBOL = __webpack_require__(185);
var USE_SYMBOL_AS_UID = __webpack_require__(211);

var WellKnownSymbolsStore = shared('wks');
var Symbol = global.Symbol;
var createWellKnownSymbol = USE_SYMBOL_AS_UID ? Symbol : Symbol && Symbol.withoutSetter || uid;

module.exports = function (name) {
  if (!has(WellKnownSymbolsStore, name)) {
    if (NATIVE_SYMBOL && has(Symbol, name)) WellKnownSymbolsStore[name] = Symbol[name];
    else WellKnownSymbolsStore[name] = createWellKnownSymbol('Symbol.' + name);
  } return WellKnownSymbolsStore[name];
};


/***/ }),
/* 140 */
/***/ (function(module, exports, __webpack_require__) {

var isObject = __webpack_require__(142);

module.exports = function (it) {
  if (!isObject(it)) {
    throw TypeError(String(it) + ' is not an object');
  } return it;
};


/***/ }),
/* 141 */
/***/ (function(module, exports, __webpack_require__) {

var fails = __webpack_require__(138);

// Thank's IE8 for his funny defineProperty
module.exports = !fails(function () {
  return Object.defineProperty({}, 1, { get: function () { return 7; } })[1] != 7;
});


/***/ }),
/* 142 */
/***/ (function(module, exports) {

module.exports = function (it) {
  return typeof it === 'object' ? it !== null : typeof it === 'function';
};


/***/ }),
/* 143 */
/***/ (function(module, exports) {

var hasOwnProperty = {}.hasOwnProperty;

module.exports = function (it, key) {
  return hasOwnProperty.call(it, key);
};


/***/ }),
/* 144 */
/***/ (function(module, exports, __webpack_require__) {

var DESCRIPTORS = __webpack_require__(141);
var IE8_DOM_DEFINE = __webpack_require__(202);
var anObject = __webpack_require__(140);
var toPrimitive = __webpack_require__(162);

var nativeDefineProperty = Object.defineProperty;

// `Object.defineProperty` method
// https://tc39.github.io/ecma262/#sec-object.defineproperty
exports.f = DESCRIPTORS ? nativeDefineProperty : function defineProperty(O, P, Attributes) {
  anObject(O);
  P = toPrimitive(P, true);
  anObject(Attributes);
  if (IE8_DOM_DEFINE) try {
    return nativeDefineProperty(O, P, Attributes);
  } catch (error) { /* empty */ }
  if ('get' in Attributes || 'set' in Attributes) throw TypeError('Accessors not supported');
  if ('value' in Attributes) O[P] = Attributes.value;
  return O;
};


/***/ }),
/* 145 */
/***/ (function(module, exports, __webpack_require__) {

var global = __webpack_require__(137);
var createNonEnumerableProperty = __webpack_require__(146);
var has = __webpack_require__(143);
var setGlobal = __webpack_require__(180);
var inspectSource = __webpack_require__(181);
var InternalStateModule = __webpack_require__(157);

var getInternalState = InternalStateModule.get;
var enforceInternalState = InternalStateModule.enforce;
var TEMPLATE = String(String).split('String');

(module.exports = function (O, key, value, options) {
  var unsafe = options ? !!options.unsafe : false;
  var simple = options ? !!options.enumerable : false;
  var noTargetGet = options ? !!options.noTargetGet : false;
  if (typeof value == 'function') {
    if (typeof key == 'string' && !has(value, 'name')) createNonEnumerableProperty(value, 'name', key);
    enforceInternalState(value).source = TEMPLATE.join(typeof key == 'string' ? key : '');
  }
  if (O === global) {
    if (simple) O[key] = value;
    else setGlobal(key, value);
    return;
  } else if (!unsafe) {
    delete O[key];
  } else if (!noTargetGet && O[key]) {
    simple = true;
  }
  if (simple) O[key] = value;
  else createNonEnumerableProperty(O, key, value);
// add fake Function#toString for correct work wrapped methods / constructors with methods like LoDash isNative
})(Function.prototype, 'toString', function toString() {
  return typeof this == 'function' && getInternalState(this).source || inspectSource(this);
});


/***/ }),
/* 146 */
/***/ (function(module, exports, __webpack_require__) {

var DESCRIPTORS = __webpack_require__(141);
var definePropertyModule = __webpack_require__(144);
var createPropertyDescriptor = __webpack_require__(161);

module.exports = DESCRIPTORS ? function (object, key, value) {
  return definePropertyModule.f(object, key, createPropertyDescriptor(1, value));
} : function (object, key, value) {
  object[key] = value;
  return object;
};


/***/ }),
/* 147 */
/***/ (function(module, exports, __webpack_require__) {

var toInteger = __webpack_require__(173);

var min = Math.min;

// `ToLength` abstract operation
// https://tc39.github.io/ecma262/#sec-tolength
module.exports = function (argument) {
  return argument > 0 ? min(toInteger(argument), 0x1FFFFFFFFFFFFF) : 0; // 2 ** 53 - 1 == 9007199254740991
};


/***/ }),
/* 148 */
/***/ (function(module, exports) {

var g;

// This works in non-strict mode
g = (function() {
	return this;
})();

try {
	// This works if eval is allowed (see CSP)
	g = g || new Function("return this")();
} catch (e) {
	// This works if the window reference is available
	if (typeof window === "object") g = window;
}

// g can still be undefined, but nothing to do about it...
// We return undefined, instead of nothing here, so it's
// easier to handle this case. if(!global) { ...}

module.exports = g;


/***/ }),
/* 149 */
/***/ (function(module, exports, __webpack_require__) {

// toObject with fallback for non-array-like ES3 strings
var IndexedObject = __webpack_require__(169);
var requireObjectCoercible = __webpack_require__(153);

module.exports = function (it) {
  return IndexedObject(requireObjectCoercible(it));
};


/***/ }),
/* 150 */
/***/ (function(module, exports) {

var toString = {}.toString;

module.exports = function (it) {
  return toString.call(it).slice(8, -1);
};


/***/ }),
/* 151 */
/***/ (function(module, exports, __webpack_require__) {

var requireObjectCoercible = __webpack_require__(153);

// `ToObject` abstract operation
// https://tc39.github.io/ecma262/#sec-toobject
module.exports = function (argument) {
  return Object(requireObjectCoercible(argument));
};


/***/ }),
/* 152 */
/***/ (function(module, exports, __webpack_require__) {

var DESCRIPTORS = __webpack_require__(141);
var propertyIsEnumerableModule = __webpack_require__(201);
var createPropertyDescriptor = __webpack_require__(161);
var toIndexedObject = __webpack_require__(149);
var toPrimitive = __webpack_require__(162);
var has = __webpack_require__(143);
var IE8_DOM_DEFINE = __webpack_require__(202);

var nativeGetOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;

// `Object.getOwnPropertyDescriptor` method
// https://tc39.github.io/ecma262/#sec-object.getownpropertydescriptor
exports.f = DESCRIPTORS ? nativeGetOwnPropertyDescriptor : function getOwnPropertyDescriptor(O, P) {
  O = toIndexedObject(O);
  P = toPrimitive(P, true);
  if (IE8_DOM_DEFINE) try {
    return nativeGetOwnPropertyDescriptor(O, P);
  } catch (error) { /* empty */ }
  if (has(O, P)) return createPropertyDescriptor(!propertyIsEnumerableModule.f.call(O, P), O[P]);
};


/***/ }),
/* 153 */
/***/ (function(module, exports) {

// `RequireObjectCoercible` abstract operation
// https://tc39.github.io/ecma262/#sec-requireobjectcoercible
module.exports = function (it) {
  if (it == undefined) throw TypeError("Can't call method on " + it);
  return it;
};


/***/ }),
/* 154 */
/***/ (function(module, exports, __webpack_require__) {

var DESCRIPTORS = __webpack_require__(141);
var fails = __webpack_require__(138);
var has = __webpack_require__(143);

var defineProperty = Object.defineProperty;
var cache = {};

var thrower = function (it) { throw it; };

module.exports = function (METHOD_NAME, options) {
  if (has(cache, METHOD_NAME)) return cache[METHOD_NAME];
  if (!options) options = {};
  var method = [][METHOD_NAME];
  var ACCESSORS = has(options, 'ACCESSORS') ? options.ACCESSORS : false;
  var argument0 = has(options, 0) ? options[0] : thrower;
  var argument1 = has(options, 1) ? options[1] : undefined;

  return cache[METHOD_NAME] = !!method && !fails(function () {
    if (ACCESSORS && !DESCRIPTORS) return true;
    var O = { length: -1 };

    if (ACCESSORS) defineProperty(O, 1, { enumerable: true, get: thrower });
    else O[1] = 1;

    method.call(O, argument0, argument1);
  });
};


/***/ }),
/* 155 */
/***/ (function(module, exports, __webpack_require__) {

var path = __webpack_require__(206);
var global = __webpack_require__(137);

var aFunction = function (variable) {
  return typeof variable == 'function' ? variable : undefined;
};

module.exports = function (namespace, method) {
  return arguments.length < 2 ? aFunction(path[namespace]) || aFunction(global[namespace])
    : path[namespace] && path[namespace][method] || global[namespace] && global[namespace][method];
};


/***/ }),
/* 156 */
/***/ (function(module, exports) {

// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };


/***/ }),
/* 157 */
/***/ (function(module, exports, __webpack_require__) {

var NATIVE_WEAK_MAP = __webpack_require__(246);
var global = __webpack_require__(137);
var isObject = __webpack_require__(142);
var createNonEnumerableProperty = __webpack_require__(146);
var objectHas = __webpack_require__(143);
var sharedKey = __webpack_require__(170);
var hiddenKeys = __webpack_require__(164);

var WeakMap = global.WeakMap;
var set, get, has;

var enforce = function (it) {
  return has(it) ? get(it) : set(it, {});
};

var getterFor = function (TYPE) {
  return function (it) {
    var state;
    if (!isObject(it) || (state = get(it)).type !== TYPE) {
      throw TypeError('Incompatible receiver, ' + TYPE + ' required');
    } return state;
  };
};

if (NATIVE_WEAK_MAP) {
  var store = new WeakMap();
  var wmget = store.get;
  var wmhas = store.has;
  var wmset = store.set;
  set = function (it, metadata) {
    wmset.call(store, it, metadata);
    return metadata;
  };
  get = function (it) {
    return wmget.call(store, it) || {};
  };
  has = function (it) {
    return wmhas.call(store, it);
  };
} else {
  var STATE = sharedKey('state');
  hiddenKeys[STATE] = true;
  set = function (it, metadata) {
    createNonEnumerableProperty(it, STATE, metadata);
    return metadata;
  };
  get = function (it) {
    return objectHas(it, STATE) ? it[STATE] : {};
  };
  has = function (it) {
    return objectHas(it, STATE);
  };
}

module.exports = {
  set: set,
  get: get,
  has: has,
  enforce: enforce,
  getterFor: getterFor
};


/***/ }),
/* 158 */
/***/ (function(module, exports, __webpack_require__) {

var bind = __webpack_require__(165);
var IndexedObject = __webpack_require__(169);
var toObject = __webpack_require__(151);
var toLength = __webpack_require__(147);
var arraySpeciesCreate = __webpack_require__(210);

var push = [].push;

// `Array.prototype.{ forEach, map, filter, some, every, find, findIndex }` methods implementation
var createMethod = function (TYPE) {
  var IS_MAP = TYPE == 1;
  var IS_FILTER = TYPE == 2;
  var IS_SOME = TYPE == 3;
  var IS_EVERY = TYPE == 4;
  var IS_FIND_INDEX = TYPE == 6;
  var NO_HOLES = TYPE == 5 || IS_FIND_INDEX;
  return function ($this, callbackfn, that, specificCreate) {
    var O = toObject($this);
    var self = IndexedObject(O);
    var boundFunction = bind(callbackfn, that, 3);
    var length = toLength(self.length);
    var index = 0;
    var create = specificCreate || arraySpeciesCreate;
    var target = IS_MAP ? create($this, length) : IS_FILTER ? create($this, 0) : undefined;
    var value, result;
    for (;length > index; index++) if (NO_HOLES || index in self) {
      value = self[index];
      result = boundFunction(value, index, O);
      if (TYPE) {
        if (IS_MAP) target[index] = result; // map
        else if (result) switch (TYPE) {
          case 3: return true;              // some
          case 5: return value;             // find
          case 6: return index;             // findIndex
          case 2: push.call(target, value); // filter
        } else if (IS_EVERY) return false;  // every
      }
    }
    return IS_FIND_INDEX ? -1 : IS_SOME || IS_EVERY ? IS_EVERY : target;
  };
};

module.exports = {
  // `Array.prototype.forEach` method
  // https://tc39.github.io/ecma262/#sec-array.prototype.foreach
  forEach: createMethod(0),
  // `Array.prototype.map` method
  // https://tc39.github.io/ecma262/#sec-array.prototype.map
  map: createMethod(1),
  // `Array.prototype.filter` method
  // https://tc39.github.io/ecma262/#sec-array.prototype.filter
  filter: createMethod(2),
  // `Array.prototype.some` method
  // https://tc39.github.io/ecma262/#sec-array.prototype.some
  some: createMethod(3),
  // `Array.prototype.every` method
  // https://tc39.github.io/ecma262/#sec-array.prototype.every
  every: createMethod(4),
  // `Array.prototype.find` method
  // https://tc39.github.io/ecma262/#sec-array.prototype.find
  find: createMethod(5),
  // `Array.prototype.findIndex` method
  // https://tc39.github.io/ecma262/#sec-array.prototype.findIndex
  findIndex: createMethod(6)
};


/***/ }),
/* 159 */
/***/ (function(module, exports) {

module.exports = function (it) {
  if (typeof it != 'function') {
    throw TypeError(String(it) + ' is not a function');
  } return it;
};


/***/ }),
/* 160 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var fails = __webpack_require__(138);

module.exports = function (METHOD_NAME, argument) {
  var method = [][METHOD_NAME];
  return !!method && fails(function () {
    // eslint-disable-next-line no-useless-call,no-throw-literal
    method.call(null, argument || function () { throw 1; }, 1);
  });
};


/***/ }),
/* 161 */
/***/ (function(module, exports) {

module.exports = function (bitmap, value) {
  return {
    enumerable: !(bitmap & 1),
    configurable: !(bitmap & 2),
    writable: !(bitmap & 4),
    value: value
  };
};


/***/ }),
/* 162 */
/***/ (function(module, exports, __webpack_require__) {

var isObject = __webpack_require__(142);

// `ToPrimitive` abstract operation
// https://tc39.github.io/ecma262/#sec-toprimitive
// instead of the ES6 spec version, we didn't implement @@toPrimitive case
// and the second argument - flag - preferred type is a string
module.exports = function (input, PREFERRED_STRING) {
  if (!isObject(input)) return input;
  var fn, val;
  if (PREFERRED_STRING && typeof (fn = input.toString) == 'function' && !isObject(val = fn.call(input))) return val;
  if (typeof (fn = input.valueOf) == 'function' && !isObject(val = fn.call(input))) return val;
  if (!PREFERRED_STRING && typeof (fn = input.toString) == 'function' && !isObject(val = fn.call(input))) return val;
  throw TypeError("Can't convert object to primitive value");
};


/***/ }),
/* 163 */
/***/ (function(module, exports) {

module.exports = false;


/***/ }),
/* 164 */
/***/ (function(module, exports) {

module.exports = {};


/***/ }),
/* 165 */
/***/ (function(module, exports, __webpack_require__) {

var aFunction = __webpack_require__(159);

// optional / simple context binding
module.exports = function (fn, that, length) {
  aFunction(fn);
  if (that === undefined) return fn;
  switch (length) {
    case 0: return function () {
      return fn.call(that);
    };
    case 1: return function (a) {
      return fn.call(that, a);
    };
    case 2: return function (a, b) {
      return fn.call(that, a, b);
    };
    case 3: return function (a, b, c) {
      return fn.call(that, a, b, c);
    };
  }
  return function (/* ...args */) {
    return fn.apply(that, arguments);
  };
};


/***/ }),
/* 166 */
/***/ (function(module, exports, __webpack_require__) {

var anObject = __webpack_require__(140);
var defineProperties = __webpack_require__(216);
var enumBugKeys = __webpack_require__(184);
var hiddenKeys = __webpack_require__(164);
var html = __webpack_require__(217);
var documentCreateElement = __webpack_require__(179);
var sharedKey = __webpack_require__(170);

var GT = '>';
var LT = '<';
var PROTOTYPE = 'prototype';
var SCRIPT = 'script';
var IE_PROTO = sharedKey('IE_PROTO');

var EmptyConstructor = function () { /* empty */ };

var scriptTag = function (content) {
  return LT + SCRIPT + GT + content + LT + '/' + SCRIPT + GT;
};

// Create object with fake `null` prototype: use ActiveX Object with cleared prototype
var NullProtoObjectViaActiveX = function (activeXDocument) {
  activeXDocument.write(scriptTag(''));
  activeXDocument.close();
  var temp = activeXDocument.parentWindow.Object;
  activeXDocument = null; // avoid memory leak
  return temp;
};

// Create object with fake `null` prototype: use iframe Object with cleared prototype
var NullProtoObjectViaIFrame = function () {
  // Thrash, waste and sodomy: IE GC bug
  var iframe = documentCreateElement('iframe');
  var JS = 'java' + SCRIPT + ':';
  var iframeDocument;
  iframe.style.display = 'none';
  html.appendChild(iframe);
  // https://github.com/zloirock/core-js/issues/475
  iframe.src = String(JS);
  iframeDocument = iframe.contentWindow.document;
  iframeDocument.open();
  iframeDocument.write(scriptTag('document.F=Object'));
  iframeDocument.close();
  return iframeDocument.F;
};

// Check for document.domain and active x support
// No need to use active x approach when document.domain is not set
// see https://github.com/es-shims/es5-shim/issues/150
// variation of https://github.com/kitcambridge/es5-shim/commit/4f738ac066346
// avoid IE GC bug
var activeXDocument;
var NullProtoObject = function () {
  try {
    /* global ActiveXObject */
    activeXDocument = document.domain && new ActiveXObject('htmlfile');
  } catch (error) { /* ignore */ }
  NullProtoObject = activeXDocument ? NullProtoObjectViaActiveX(activeXDocument) : NullProtoObjectViaIFrame();
  var length = enumBugKeys.length;
  while (length--) delete NullProtoObject[PROTOTYPE][enumBugKeys[length]];
  return NullProtoObject();
};

hiddenKeys[IE_PROTO] = true;

// `Object.create` method
// https://tc39.github.io/ecma262/#sec-object.create
module.exports = Object.create || function create(O, Properties) {
  var result;
  if (O !== null) {
    EmptyConstructor[PROTOTYPE] = anObject(O);
    result = new EmptyConstructor();
    EmptyConstructor[PROTOTYPE] = null;
    // add "__proto__" for Object.getPrototypeOf polyfill
    result[IE_PROTO] = O;
  } else result = NullProtoObject();
  return Properties === undefined ? result : defineProperties(result, Properties);
};


/***/ }),
/* 167 */
/***/ (function(module, exports, __webpack_require__) {

var defineProperty = __webpack_require__(144).f;
var has = __webpack_require__(143);
var wellKnownSymbol = __webpack_require__(139);

var TO_STRING_TAG = wellKnownSymbol('toStringTag');

module.exports = function (it, TAG, STATIC) {
  if (it && !has(it = STATIC ? it : it.prototype, TO_STRING_TAG)) {
    defineProperty(it, TO_STRING_TAG, { configurable: true, value: TAG });
  }
};


/***/ }),
/* 168 */
/***/ (function(module, exports) {

module.exports = {};


/***/ }),
/* 169 */
/***/ (function(module, exports, __webpack_require__) {

var fails = __webpack_require__(138);
var classof = __webpack_require__(150);

var split = ''.split;

// fallback for non-array-like ES3 and non-enumerable old V8 strings
module.exports = fails(function () {
  // throws an error in rhino, see https://github.com/mozilla/rhino/issues/346
  // eslint-disable-next-line no-prototype-builtins
  return !Object('z').propertyIsEnumerable(0);
}) ? function (it) {
  return classof(it) == 'String' ? split.call(it, '') : Object(it);
} : Object;


/***/ }),
/* 170 */
/***/ (function(module, exports, __webpack_require__) {

var shared = __webpack_require__(182);
var uid = __webpack_require__(171);

var keys = shared('keys');

module.exports = function (key) {
  return keys[key] || (keys[key] = uid(key));
};


/***/ }),
/* 171 */
/***/ (function(module, exports) {

var id = 0;
var postfix = Math.random();

module.exports = function (key) {
  return 'Symbol(' + String(key === undefined ? '' : key) + ')_' + (++id + postfix).toString(36);
};


/***/ }),
/* 172 */
/***/ (function(module, exports, __webpack_require__) {

var internalObjectKeys = __webpack_require__(207);
var enumBugKeys = __webpack_require__(184);

var hiddenKeys = enumBugKeys.concat('length', 'prototype');

// `Object.getOwnPropertyNames` method
// https://tc39.github.io/ecma262/#sec-object.getownpropertynames
exports.f = Object.getOwnPropertyNames || function getOwnPropertyNames(O) {
  return internalObjectKeys(O, hiddenKeys);
};


/***/ }),
/* 173 */
/***/ (function(module, exports) {

var ceil = Math.ceil;
var floor = Math.floor;

// `ToInteger` abstract operation
// https://tc39.github.io/ecma262/#sec-tointeger
module.exports = function (argument) {
  return isNaN(argument = +argument) ? 0 : (argument > 0 ? floor : ceil)(argument);
};


/***/ }),
/* 174 */
/***/ (function(module, exports, __webpack_require__) {

var fails = __webpack_require__(138);

var replacement = /#|\.prototype\./;

var isForced = function (feature, detection) {
  var value = data[normalize(feature)];
  return value == POLYFILL ? true
    : value == NATIVE ? false
    : typeof detection == 'function' ? fails(detection)
    : !!detection;
};

var normalize = isForced.normalize = function (string) {
  return String(string).replace(replacement, '.').toLowerCase();
};

var data = isForced.data = {};
var NATIVE = isForced.NATIVE = 'N';
var POLYFILL = isForced.POLYFILL = 'P';

module.exports = isForced;


/***/ }),
/* 175 */
/***/ (function(module, exports, __webpack_require__) {

var classof = __webpack_require__(150);

// `IsArray` abstract operation
// https://tc39.github.io/ecma262/#sec-isarray
module.exports = Array.isArray || function isArray(arg) {
  return classof(arg) == 'Array';
};


/***/ }),
/* 176 */
/***/ (function(module, exports, __webpack_require__) {

var requireObjectCoercible = __webpack_require__(153);
var whitespaces = __webpack_require__(177);

var whitespace = '[' + whitespaces + ']';
var ltrim = RegExp('^' + whitespace + whitespace + '*');
var rtrim = RegExp(whitespace + whitespace + '*$');

// `String.prototype.{ trim, trimStart, trimEnd, trimLeft, trimRight }` methods implementation
var createMethod = function (TYPE) {
  return function ($this) {
    var string = String(requireObjectCoercible($this));
    if (TYPE & 1) string = string.replace(ltrim, '');
    if (TYPE & 2) string = string.replace(rtrim, '');
    return string;
  };
};

module.exports = {
  // `String.prototype.{ trimLeft, trimStart }` methods
  // https://tc39.github.io/ecma262/#sec-string.prototype.trimstart
  start: createMethod(1),
  // `String.prototype.{ trimRight, trimEnd }` methods
  // https://tc39.github.io/ecma262/#sec-string.prototype.trimend
  end: createMethod(2),
  // `String.prototype.trim` method
  // https://tc39.github.io/ecma262/#sec-string.prototype.trim
  trim: createMethod(3)
};


/***/ }),
/* 177 */
/***/ (function(module, exports) {

// a string of all valid unicode whitespaces
// eslint-disable-next-line max-len
module.exports = '\u0009\u000A\u000B\u000C\u000D\u0020\u00A0\u1680\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200A\u202F\u205F\u3000\u2028\u2029\uFEFF';


/***/ }),
/* 178 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var regexpFlags = __webpack_require__(214);
var stickyHelpers = __webpack_require__(249);

var nativeExec = RegExp.prototype.exec;
// This always refers to the native implementation, because the
// String#replace polyfill uses ./fix-regexp-well-known-symbol-logic.js,
// which loads this file before patching the method.
var nativeReplace = String.prototype.replace;

var patchedExec = nativeExec;

var UPDATES_LAST_INDEX_WRONG = (function () {
  var re1 = /a/;
  var re2 = /b*/g;
  nativeExec.call(re1, 'a');
  nativeExec.call(re2, 'a');
  return re1.lastIndex !== 0 || re2.lastIndex !== 0;
})();

var UNSUPPORTED_Y = stickyHelpers.UNSUPPORTED_Y || stickyHelpers.BROKEN_CARET;

// nonparticipating capturing group, copied from es5-shim's String#split patch.
var NPCG_INCLUDED = /()??/.exec('')[1] !== undefined;

var PATCH = UPDATES_LAST_INDEX_WRONG || NPCG_INCLUDED || UNSUPPORTED_Y;

if (PATCH) {
  patchedExec = function exec(str) {
    var re = this;
    var lastIndex, reCopy, match, i;
    var sticky = UNSUPPORTED_Y && re.sticky;
    var flags = regexpFlags.call(re);
    var source = re.source;
    var charsAdded = 0;
    var strCopy = str;

    if (sticky) {
      flags = flags.replace('y', '');
      if (flags.indexOf('g') === -1) {
        flags += 'g';
      }

      strCopy = String(str).slice(re.lastIndex);
      // Support anchored sticky behavior.
      if (re.lastIndex > 0 && (!re.multiline || re.multiline && str[re.lastIndex - 1] !== '\n')) {
        source = '(?: ' + source + ')';
        strCopy = ' ' + strCopy;
        charsAdded++;
      }
      // ^(? + rx + ) is needed, in combination with some str slicing, to
      // simulate the 'y' flag.
      reCopy = new RegExp('^(?:' + source + ')', flags);
    }

    if (NPCG_INCLUDED) {
      reCopy = new RegExp('^' + source + '$(?!\\s)', flags);
    }
    if (UPDATES_LAST_INDEX_WRONG) lastIndex = re.lastIndex;

    match = nativeExec.call(sticky ? reCopy : re, strCopy);

    if (sticky) {
      if (match) {
        match.input = match.input.slice(charsAdded);
        match[0] = match[0].slice(charsAdded);
        match.index = re.lastIndex;
        re.lastIndex += match[0].length;
      } else re.lastIndex = 0;
    } else if (UPDATES_LAST_INDEX_WRONG && match) {
      re.lastIndex = re.global ? match.index + match[0].length : lastIndex;
    }
    if (NPCG_INCLUDED && match && match.length > 1) {
      // Fix browsers whose `exec` methods don't consistently return `undefined`
      // for NPCG, like IE8. NOTE: This doesn' work for /(.?)?/
      nativeReplace.call(match[0], reCopy, function () {
        for (i = 1; i < arguments.length - 2; i++) {
          if (arguments[i] === undefined) match[i] = undefined;
        }
      });
    }

    return match;
  };
}

module.exports = patchedExec;


/***/ }),
/* 179 */
/***/ (function(module, exports, __webpack_require__) {

var global = __webpack_require__(137);
var isObject = __webpack_require__(142);

var document = global.document;
// typeof document.createElement is 'object' in old IE
var EXISTS = isObject(document) && isObject(document.createElement);

module.exports = function (it) {
  return EXISTS ? document.createElement(it) : {};
};


/***/ }),
/* 180 */
/***/ (function(module, exports, __webpack_require__) {

var global = __webpack_require__(137);
var createNonEnumerableProperty = __webpack_require__(146);

module.exports = function (key, value) {
  try {
    createNonEnumerableProperty(global, key, value);
  } catch (error) {
    global[key] = value;
  } return value;
};


/***/ }),
/* 181 */
/***/ (function(module, exports, __webpack_require__) {

var store = __webpack_require__(203);

var functionToString = Function.toString;

// this helper broken in `3.4.1-3.4.4`, so we can't use `shared` helper
if (typeof store.inspectSource != 'function') {
  store.inspectSource = function (it) {
    return functionToString.call(it);
  };
}

module.exports = store.inspectSource;


/***/ }),
/* 182 */
/***/ (function(module, exports, __webpack_require__) {

var IS_PURE = __webpack_require__(163);
var store = __webpack_require__(203);

(module.exports = function (key, value) {
  return store[key] || (store[key] = value !== undefined ? value : {});
})('versions', []).push({
  version: '3.6.5',
  mode: IS_PURE ? 'pure' : 'global',
  copyright: '© 2020 Denis Pushkarev (zloirock.ru)'
});


/***/ }),
/* 183 */
/***/ (function(module, exports, __webpack_require__) {

var toIndexedObject = __webpack_require__(149);
var toLength = __webpack_require__(147);
var toAbsoluteIndex = __webpack_require__(208);

// `Array.prototype.{ indexOf, includes }` methods implementation
var createMethod = function (IS_INCLUDES) {
  return function ($this, el, fromIndex) {
    var O = toIndexedObject($this);
    var length = toLength(O.length);
    var index = toAbsoluteIndex(fromIndex, length);
    var value;
    // Array#includes uses SameValueZero equality algorithm
    // eslint-disable-next-line no-self-compare
    if (IS_INCLUDES && el != el) while (length > index) {
      value = O[index++];
      // eslint-disable-next-line no-self-compare
      if (value != value) return true;
    // Array#indexOf ignores holes, Array#includes - not
    } else for (;length > index; index++) {
      if ((IS_INCLUDES || index in O) && O[index] === el) return IS_INCLUDES || index || 0;
    } return !IS_INCLUDES && -1;
  };
};

module.exports = {
  // `Array.prototype.includes` method
  // https://tc39.github.io/ecma262/#sec-array.prototype.includes
  includes: createMethod(true),
  // `Array.prototype.indexOf` method
  // https://tc39.github.io/ecma262/#sec-array.prototype.indexof
  indexOf: createMethod(false)
};


/***/ }),
/* 184 */
/***/ (function(module, exports) {

// IE8- don't enum bug keys
module.exports = [
  'constructor',
  'hasOwnProperty',
  'isPrototypeOf',
  'propertyIsEnumerable',
  'toLocaleString',
  'toString',
  'valueOf'
];


/***/ }),
/* 185 */
/***/ (function(module, exports, __webpack_require__) {

var fails = __webpack_require__(138);

module.exports = !!Object.getOwnPropertySymbols && !fails(function () {
  // Chrome 38 Symbol has incorrect toString conversion
  // eslint-disable-next-line no-undef
  return !String(Symbol());
});


/***/ }),
/* 186 */
/***/ (function(module, exports, __webpack_require__) {

var fails = __webpack_require__(138);
var wellKnownSymbol = __webpack_require__(139);
var V8_VERSION = __webpack_require__(187);

var SPECIES = wellKnownSymbol('species');

module.exports = function (METHOD_NAME) {
  // We can't use this feature detection in V8 since it causes
  // deoptimization and serious performance degradation
  // https://github.com/zloirock/core-js/issues/677
  return V8_VERSION >= 51 || !fails(function () {
    var array = [];
    var constructor = array.constructor = {};
    constructor[SPECIES] = function () {
      return { foo: 1 };
    };
    return array[METHOD_NAME](Boolean).foo !== 1;
  });
};


/***/ }),
/* 187 */
/***/ (function(module, exports, __webpack_require__) {

var global = __webpack_require__(137);
var userAgent = __webpack_require__(212);

var process = global.process;
var versions = process && process.versions;
var v8 = versions && versions.v8;
var match, version;

if (v8) {
  match = v8.split('.');
  version = match[0] + match[1];
} else if (userAgent) {
  match = userAgent.match(/Edge\/(\d+)/);
  if (!match || match[1] >= 74) {
    match = userAgent.match(/Chrome\/(\d+)/);
    if (match) version = match[1];
  }
}

module.exports = version && +version;


/***/ }),
/* 188 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// TODO: Remove from `core-js@4` since it's moved to entry points
__webpack_require__(213);
var redefine = __webpack_require__(145);
var fails = __webpack_require__(138);
var wellKnownSymbol = __webpack_require__(139);
var regexpExec = __webpack_require__(178);
var createNonEnumerableProperty = __webpack_require__(146);

var SPECIES = wellKnownSymbol('species');

var REPLACE_SUPPORTS_NAMED_GROUPS = !fails(function () {
  // #replace needs built-in support for named groups.
  // #match works fine because it just return the exec results, even if it has
  // a "grops" property.
  var re = /./;
  re.exec = function () {
    var result = [];
    result.groups = { a: '7' };
    return result;
  };
  return ''.replace(re, '$<a>') !== '7';
});

// IE <= 11 replaces $0 with the whole match, as if it was $&
// https://stackoverflow.com/questions/6024666/getting-ie-to-replace-a-regex-with-the-literal-string-0
var REPLACE_KEEPS_$0 = (function () {
  return 'a'.replace(/./, '$0') === '$0';
})();

var REPLACE = wellKnownSymbol('replace');
// Safari <= 13.0.3(?) substitutes nth capture where n>m with an empty string
var REGEXP_REPLACE_SUBSTITUTES_UNDEFINED_CAPTURE = (function () {
  if (/./[REPLACE]) {
    return /./[REPLACE]('a', '$0') === '';
  }
  return false;
})();

// Chrome 51 has a buggy "split" implementation when RegExp#exec !== nativeExec
// Weex JS has frozen built-in prototypes, so use try / catch wrapper
var SPLIT_WORKS_WITH_OVERWRITTEN_EXEC = !fails(function () {
  var re = /(?:)/;
  var originalExec = re.exec;
  re.exec = function () { return originalExec.apply(this, arguments); };
  var result = 'ab'.split(re);
  return result.length !== 2 || result[0] !== 'a' || result[1] !== 'b';
});

module.exports = function (KEY, length, exec, sham) {
  var SYMBOL = wellKnownSymbol(KEY);

  var DELEGATES_TO_SYMBOL = !fails(function () {
    // String methods call symbol-named RegEp methods
    var O = {};
    O[SYMBOL] = function () { return 7; };
    return ''[KEY](O) != 7;
  });

  var DELEGATES_TO_EXEC = DELEGATES_TO_SYMBOL && !fails(function () {
    // Symbol-named RegExp methods call .exec
    var execCalled = false;
    var re = /a/;

    if (KEY === 'split') {
      // We can't use real regex here since it causes deoptimization
      // and serious performance degradation in V8
      // https://github.com/zloirock/core-js/issues/306
      re = {};
      // RegExp[@@split] doesn't call the regex's exec method, but first creates
      // a new one. We need to return the patched regex when creating the new one.
      re.constructor = {};
      re.constructor[SPECIES] = function () { return re; };
      re.flags = '';
      re[SYMBOL] = /./[SYMBOL];
    }

    re.exec = function () { execCalled = true; return null; };

    re[SYMBOL]('');
    return !execCalled;
  });

  if (
    !DELEGATES_TO_SYMBOL ||
    !DELEGATES_TO_EXEC ||
    (KEY === 'replace' && !(
      REPLACE_SUPPORTS_NAMED_GROUPS &&
      REPLACE_KEEPS_$0 &&
      !REGEXP_REPLACE_SUBSTITUTES_UNDEFINED_CAPTURE
    )) ||
    (KEY === 'split' && !SPLIT_WORKS_WITH_OVERWRITTEN_EXEC)
  ) {
    var nativeRegExpMethod = /./[SYMBOL];
    var methods = exec(SYMBOL, ''[KEY], function (nativeMethod, regexp, str, arg2, forceStringMethod) {
      if (regexp.exec === regexpExec) {
        if (DELEGATES_TO_SYMBOL && !forceStringMethod) {
          // The native String method already delegates to @@method (this
          // polyfilled function), leasing to infinite recursion.
          // We avoid it by directly calling the native @@method method.
          return { done: true, value: nativeRegExpMethod.call(regexp, str, arg2) };
        }
        return { done: true, value: nativeMethod.call(str, regexp, arg2) };
      }
      return { done: false };
    }, {
      REPLACE_KEEPS_$0: REPLACE_KEEPS_$0,
      REGEXP_REPLACE_SUBSTITUTES_UNDEFINED_CAPTURE: REGEXP_REPLACE_SUBSTITUTES_UNDEFINED_CAPTURE
    });
    var stringMethod = methods[0];
    var regexMethod = methods[1];

    redefine(String.prototype, KEY, stringMethod);
    redefine(RegExp.prototype, SYMBOL, length == 2
      // 21.2.5.8 RegExp.prototype[@@replace](string, replaceValue)
      // 21.2.5.11 RegExp.prototype[@@split](string, limit)
      ? function (string, arg) { return regexMethod.call(string, this, arg); }
      // 21.2.5.6 RegExp.prototype[@@match](string)
      // 21.2.5.9 RegExp.prototype[@@search](string)
      : function (string) { return regexMethod.call(string, this); }
    );
  }

  if (sham) createNonEnumerableProperty(RegExp.prototype[SYMBOL], 'sham', true);
};


/***/ }),
/* 189 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var charAt = __webpack_require__(215).charAt;

// `AdvanceStringIndex` abstract operation
// https://tc39.github.io/ecma262/#sec-advancestringindex
module.exports = function (S, index, unicode) {
  return index + (unicode ? charAt(S, index).length : 1);
};


/***/ }),
/* 190 */
/***/ (function(module, exports, __webpack_require__) {

var classof = __webpack_require__(150);
var regexpExec = __webpack_require__(178);

// `RegExpExec` abstract operation
// https://tc39.github.io/ecma262/#sec-regexpexec
module.exports = function (R, S) {
  var exec = R.exec;
  if (typeof exec === 'function') {
    var result = exec.call(R, S);
    if (typeof result !== 'object') {
      throw TypeError('RegExp exec method returned something other than an Object or null');
    }
    return result;
  }

  if (classof(R) !== 'RegExp') {
    throw TypeError('RegExp#exec called on incompatible receiver');
  }

  return regexpExec.call(R, S);
};



/***/ }),
/* 191 */
/***/ (function(module, exports, __webpack_require__) {

var internalObjectKeys = __webpack_require__(207);
var enumBugKeys = __webpack_require__(184);

// `Object.keys` method
// https://tc39.github.io/ecma262/#sec-object.keys
module.exports = Object.keys || function keys(O) {
  return internalObjectKeys(O, enumBugKeys);
};


/***/ }),
/* 192 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var toPrimitive = __webpack_require__(162);
var definePropertyModule = __webpack_require__(144);
var createPropertyDescriptor = __webpack_require__(161);

module.exports = function (object, key, value) {
  var propertyKey = toPrimitive(key);
  if (propertyKey in object) definePropertyModule.f(object, propertyKey, createPropertyDescriptor(0, value));
  else object[propertyKey] = value;
};


/***/ }),
/* 193 */
/***/ (function(module, exports, __webpack_require__) {

var wellKnownSymbol = __webpack_require__(139);

var TO_STRING_TAG = wellKnownSymbol('toStringTag');
var test = {};

test[TO_STRING_TAG] = 'z';

module.exports = String(test) === '[object z]';


/***/ }),
/* 194 */
/***/ (function(module, exports) {

module.exports = function (it, Constructor, name) {
  if (!(it instanceof Constructor)) {
    throw TypeError('Incorrect ' + (name ? name + ' ' : '') + 'invocation');
  } return it;
};


/***/ }),
/* 195 */
/***/ (function(module, exports, __webpack_require__) {

var anObject = __webpack_require__(140);
var isArrayIteratorMethod = __webpack_require__(225);
var toLength = __webpack_require__(147);
var bind = __webpack_require__(165);
var getIteratorMethod = __webpack_require__(226);
var callWithSafeIterationClosing = __webpack_require__(227);

var Result = function (stopped, result) {
  this.stopped = stopped;
  this.result = result;
};

var iterate = module.exports = function (iterable, fn, that, AS_ENTRIES, IS_ITERATOR) {
  var boundFunction = bind(fn, that, AS_ENTRIES ? 2 : 1);
  var iterator, iterFn, index, length, result, next, step;

  if (IS_ITERATOR) {
    iterator = iterable;
  } else {
    iterFn = getIteratorMethod(iterable);
    if (typeof iterFn != 'function') throw TypeError('Target is not iterable');
    // optimisation for array iterators
    if (isArrayIteratorMethod(iterFn)) {
      for (index = 0, length = toLength(iterable.length); length > index; index++) {
        result = AS_ENTRIES
          ? boundFunction(anObject(step = iterable[index])[0], step[1])
          : boundFunction(iterable[index]);
        if (result && result instanceof Result) return result;
      } return new Result(false);
    }
    iterator = iterFn.call(iterable);
  }

  next = iterator.next;
  while (!(step = next.call(iterator)).done) {
    result = callWithSafeIterationClosing(iterator, boundFunction, step.value, AS_ENTRIES);
    if (typeof result == 'object' && result && result instanceof Result) return result;
  } return new Result(false);
};

iterate.stop = function (result) {
  return new Result(true, result);
};


/***/ }),
/* 196 */
/***/ (function(module, exports, __webpack_require__) {

var wellKnownSymbol = __webpack_require__(139);

var ITERATOR = wellKnownSymbol('iterator');
var SAFE_CLOSING = false;

try {
  var called = 0;
  var iteratorWithReturn = {
    next: function () {
      return { done: !!called++ };
    },
    'return': function () {
      SAFE_CLOSING = true;
    }
  };
  iteratorWithReturn[ITERATOR] = function () {
    return this;
  };
  // eslint-disable-next-line no-throw-literal
  Array.from(iteratorWithReturn, function () { throw 2; });
} catch (error) { /* empty */ }

module.exports = function (exec, SKIP_CLOSING) {
  if (!SKIP_CLOSING && !SAFE_CLOSING) return false;
  var ITERATION_SUPPORT = false;
  try {
    var object = {};
    object[ITERATOR] = function () {
      return {
        next: function () {
          return { done: ITERATION_SUPPORT = true };
        }
      };
    };
    exec(object);
  } catch (error) { /* empty */ }
  return ITERATION_SUPPORT;
};


/***/ }),
/* 197 */
/***/ (function(module, exports, __webpack_require__) {

var wellKnownSymbol = __webpack_require__(139);
var create = __webpack_require__(166);
var definePropertyModule = __webpack_require__(144);

var UNSCOPABLES = wellKnownSymbol('unscopables');
var ArrayPrototype = Array.prototype;

// Array.prototype[@@unscopables]
// https://tc39.github.io/ecma262/#sec-array.prototype-@@unscopables
if (ArrayPrototype[UNSCOPABLES] == undefined) {
  definePropertyModule.f(ArrayPrototype, UNSCOPABLES, {
    configurable: true,
    value: create(null)
  });
}

// add a key to Array.prototype[@@unscopables]
module.exports = function (key) {
  ArrayPrototype[UNSCOPABLES][key] = true;
};


/***/ }),
/* 198 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $ = __webpack_require__(136);
var createIteratorConstructor = __webpack_require__(305);
var getPrototypeOf = __webpack_require__(199);
var setPrototypeOf = __webpack_require__(237);
var setToStringTag = __webpack_require__(167);
var createNonEnumerableProperty = __webpack_require__(146);
var redefine = __webpack_require__(145);
var wellKnownSymbol = __webpack_require__(139);
var IS_PURE = __webpack_require__(163);
var Iterators = __webpack_require__(168);
var IteratorsCore = __webpack_require__(235);

var IteratorPrototype = IteratorsCore.IteratorPrototype;
var BUGGY_SAFARI_ITERATORS = IteratorsCore.BUGGY_SAFARI_ITERATORS;
var ITERATOR = wellKnownSymbol('iterator');
var KEYS = 'keys';
var VALUES = 'values';
var ENTRIES = 'entries';

var returnThis = function () { return this; };

module.exports = function (Iterable, NAME, IteratorConstructor, next, DEFAULT, IS_SET, FORCED) {
  createIteratorConstructor(IteratorConstructor, NAME, next);

  var getIterationMethod = function (KIND) {
    if (KIND === DEFAULT && defaultIterator) return defaultIterator;
    if (!BUGGY_SAFARI_ITERATORS && KIND in IterablePrototype) return IterablePrototype[KIND];
    switch (KIND) {
      case KEYS: return function keys() { return new IteratorConstructor(this, KIND); };
      case VALUES: return function values() { return new IteratorConstructor(this, KIND); };
      case ENTRIES: return function entries() { return new IteratorConstructor(this, KIND); };
    } return function () { return new IteratorConstructor(this); };
  };

  var TO_STRING_TAG = NAME + ' Iterator';
  var INCORRECT_VALUES_NAME = false;
  var IterablePrototype = Iterable.prototype;
  var nativeIterator = IterablePrototype[ITERATOR]
    || IterablePrototype['@@iterator']
    || DEFAULT && IterablePrototype[DEFAULT];
  var defaultIterator = !BUGGY_SAFARI_ITERATORS && nativeIterator || getIterationMethod(DEFAULT);
  var anyNativeIterator = NAME == 'Array' ? IterablePrototype.entries || nativeIterator : nativeIterator;
  var CurrentIteratorPrototype, methods, KEY;

  // fix native
  if (anyNativeIterator) {
    CurrentIteratorPrototype = getPrototypeOf(anyNativeIterator.call(new Iterable()));
    if (IteratorPrototype !== Object.prototype && CurrentIteratorPrototype.next) {
      if (!IS_PURE && getPrototypeOf(CurrentIteratorPrototype) !== IteratorPrototype) {
        if (setPrototypeOf) {
          setPrototypeOf(CurrentIteratorPrototype, IteratorPrototype);
        } else if (typeof CurrentIteratorPrototype[ITERATOR] != 'function') {
          createNonEnumerableProperty(CurrentIteratorPrototype, ITERATOR, returnThis);
        }
      }
      // Set @@toStringTag to native iterators
      setToStringTag(CurrentIteratorPrototype, TO_STRING_TAG, true, true);
      if (IS_PURE) Iterators[TO_STRING_TAG] = returnThis;
    }
  }

  // fix Array#{values, @@iterator}.name in V8 / FF
  if (DEFAULT == VALUES && nativeIterator && nativeIterator.name !== VALUES) {
    INCORRECT_VALUES_NAME = true;
    defaultIterator = function values() { return nativeIterator.call(this); };
  }

  // define iterator
  if ((!IS_PURE || FORCED) && IterablePrototype[ITERATOR] !== defaultIterator) {
    createNonEnumerableProperty(IterablePrototype, ITERATOR, defaultIterator);
  }
  Iterators[NAME] = defaultIterator;

  // export additional methods
  if (DEFAULT) {
    methods = {
      values: getIterationMethod(VALUES),
      keys: IS_SET ? defaultIterator : getIterationMethod(KEYS),
      entries: getIterationMethod(ENTRIES)
    };
    if (FORCED) for (KEY in methods) {
      if (BUGGY_SAFARI_ITERATORS || INCORRECT_VALUES_NAME || !(KEY in IterablePrototype)) {
        redefine(IterablePrototype, KEY, methods[KEY]);
      }
    } else $({ target: NAME, proto: true, forced: BUGGY_SAFARI_ITERATORS || INCORRECT_VALUES_NAME }, methods);
  }

  return methods;
};


/***/ }),
/* 199 */
/***/ (function(module, exports, __webpack_require__) {

var has = __webpack_require__(143);
var toObject = __webpack_require__(151);
var sharedKey = __webpack_require__(170);
var CORRECT_PROTOTYPE_GETTER = __webpack_require__(236);

var IE_PROTO = sharedKey('IE_PROTO');
var ObjectPrototype = Object.prototype;

// `Object.getPrototypeOf` method
// https://tc39.github.io/ecma262/#sec-object.getprototypeof
module.exports = CORRECT_PROTOTYPE_GETTER ? Object.getPrototypeOf : function (O) {
  O = toObject(O);
  if (has(O, IE_PROTO)) return O[IE_PROTO];
  if (typeof O.constructor == 'function' && O instanceof O.constructor) {
    return O.constructor.prototype;
  } return O instanceof Object ? ObjectPrototype : null;
};


/***/ }),
/* 200 */,
/* 201 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var nativePropertyIsEnumerable = {}.propertyIsEnumerable;
var getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;

// Nashorn ~ JDK8 bug
var NASHORN_BUG = getOwnPropertyDescriptor && !nativePropertyIsEnumerable.call({ 1: 2 }, 1);

// `Object.prototype.propertyIsEnumerable` method implementation
// https://tc39.github.io/ecma262/#sec-object.prototype.propertyisenumerable
exports.f = NASHORN_BUG ? function propertyIsEnumerable(V) {
  var descriptor = getOwnPropertyDescriptor(this, V);
  return !!descriptor && descriptor.enumerable;
} : nativePropertyIsEnumerable;


/***/ }),
/* 202 */
/***/ (function(module, exports, __webpack_require__) {

var DESCRIPTORS = __webpack_require__(141);
var fails = __webpack_require__(138);
var createElement = __webpack_require__(179);

// Thank's IE8 for his funny defineProperty
module.exports = !DESCRIPTORS && !fails(function () {
  return Object.defineProperty(createElement('div'), 'a', {
    get: function () { return 7; }
  }).a != 7;
});


/***/ }),
/* 203 */
/***/ (function(module, exports, __webpack_require__) {

var global = __webpack_require__(137);
var setGlobal = __webpack_require__(180);

var SHARED = '__core-js_shared__';
var store = global[SHARED] || setGlobal(SHARED, {});

module.exports = store;


/***/ }),
/* 204 */
/***/ (function(module, exports, __webpack_require__) {

var has = __webpack_require__(143);
var ownKeys = __webpack_require__(205);
var getOwnPropertyDescriptorModule = __webpack_require__(152);
var definePropertyModule = __webpack_require__(144);

module.exports = function (target, source) {
  var keys = ownKeys(source);
  var defineProperty = definePropertyModule.f;
  var getOwnPropertyDescriptor = getOwnPropertyDescriptorModule.f;
  for (var i = 0; i < keys.length; i++) {
    var key = keys[i];
    if (!has(target, key)) defineProperty(target, key, getOwnPropertyDescriptor(source, key));
  }
};


/***/ }),
/* 205 */
/***/ (function(module, exports, __webpack_require__) {

var getBuiltIn = __webpack_require__(155);
var getOwnPropertyNamesModule = __webpack_require__(172);
var getOwnPropertySymbolsModule = __webpack_require__(209);
var anObject = __webpack_require__(140);

// all object keys, includes non-enumerable and symbols
module.exports = getBuiltIn('Reflect', 'ownKeys') || function ownKeys(it) {
  var keys = getOwnPropertyNamesModule.f(anObject(it));
  var getOwnPropertySymbols = getOwnPropertySymbolsModule.f;
  return getOwnPropertySymbols ? keys.concat(getOwnPropertySymbols(it)) : keys;
};


/***/ }),
/* 206 */
/***/ (function(module, exports, __webpack_require__) {

var global = __webpack_require__(137);

module.exports = global;


/***/ }),
/* 207 */
/***/ (function(module, exports, __webpack_require__) {

var has = __webpack_require__(143);
var toIndexedObject = __webpack_require__(149);
var indexOf = __webpack_require__(183).indexOf;
var hiddenKeys = __webpack_require__(164);

module.exports = function (object, names) {
  var O = toIndexedObject(object);
  var i = 0;
  var result = [];
  var key;
  for (key in O) !has(hiddenKeys, key) && has(O, key) && result.push(key);
  // Don't enum bug & hidden keys
  while (names.length > i) if (has(O, key = names[i++])) {
    ~indexOf(result, key) || result.push(key);
  }
  return result;
};


/***/ }),
/* 208 */
/***/ (function(module, exports, __webpack_require__) {

var toInteger = __webpack_require__(173);

var max = Math.max;
var min = Math.min;

// Helper for a popular repeating case of the spec:
// Let integer be ? ToInteger(index).
// If integer < 0, let result be max((length + integer), 0); else let result be min(integer, length).
module.exports = function (index, length) {
  var integer = toInteger(index);
  return integer < 0 ? max(integer + length, 0) : min(integer, length);
};


/***/ }),
/* 209 */
/***/ (function(module, exports) {

exports.f = Object.getOwnPropertySymbols;


/***/ }),
/* 210 */
/***/ (function(module, exports, __webpack_require__) {

var isObject = __webpack_require__(142);
var isArray = __webpack_require__(175);
var wellKnownSymbol = __webpack_require__(139);

var SPECIES = wellKnownSymbol('species');

// `ArraySpeciesCreate` abstract operation
// https://tc39.github.io/ecma262/#sec-arrayspeciescreate
module.exports = function (originalArray, length) {
  var C;
  if (isArray(originalArray)) {
    C = originalArray.constructor;
    // cross-realm fallback
    if (typeof C == 'function' && (C === Array || isArray(C.prototype))) C = undefined;
    else if (isObject(C)) {
      C = C[SPECIES];
      if (C === null) C = undefined;
    }
  } return new (C === undefined ? Array : C)(length === 0 ? 0 : length);
};


/***/ }),
/* 211 */
/***/ (function(module, exports, __webpack_require__) {

var NATIVE_SYMBOL = __webpack_require__(185);

module.exports = NATIVE_SYMBOL
  // eslint-disable-next-line no-undef
  && !Symbol.sham
  // eslint-disable-next-line no-undef
  && typeof Symbol.iterator == 'symbol';


/***/ }),
/* 212 */
/***/ (function(module, exports, __webpack_require__) {

var getBuiltIn = __webpack_require__(155);

module.exports = getBuiltIn('navigator', 'userAgent') || '';


/***/ }),
/* 213 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $ = __webpack_require__(136);
var exec = __webpack_require__(178);

$({ target: 'RegExp', proto: true, forced: /./.exec !== exec }, {
  exec: exec
});


/***/ }),
/* 214 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var anObject = __webpack_require__(140);

// `RegExp.prototype.flags` getter implementation
// https://tc39.github.io/ecma262/#sec-get-regexp.prototype.flags
module.exports = function () {
  var that = anObject(this);
  var result = '';
  if (that.global) result += 'g';
  if (that.ignoreCase) result += 'i';
  if (that.multiline) result += 'm';
  if (that.dotAll) result += 's';
  if (that.unicode) result += 'u';
  if (that.sticky) result += 'y';
  return result;
};


/***/ }),
/* 215 */
/***/ (function(module, exports, __webpack_require__) {

var toInteger = __webpack_require__(173);
var requireObjectCoercible = __webpack_require__(153);

// `String.prototype.{ codePointAt, at }` methods implementation
var createMethod = function (CONVERT_TO_STRING) {
  return function ($this, pos) {
    var S = String(requireObjectCoercible($this));
    var position = toInteger(pos);
    var size = S.length;
    var first, second;
    if (position < 0 || position >= size) return CONVERT_TO_STRING ? '' : undefined;
    first = S.charCodeAt(position);
    return first < 0xD800 || first > 0xDBFF || position + 1 === size
      || (second = S.charCodeAt(position + 1)) < 0xDC00 || second > 0xDFFF
        ? CONVERT_TO_STRING ? S.charAt(position) : first
        : CONVERT_TO_STRING ? S.slice(position, position + 2) : (first - 0xD800 << 10) + (second - 0xDC00) + 0x10000;
  };
};

module.exports = {
  // `String.prototype.codePointAt` method
  // https://tc39.github.io/ecma262/#sec-string.prototype.codepointat
  codeAt: createMethod(false),
  // `String.prototype.at` method
  // https://github.com/mathiasbynens/String.prototype.at
  charAt: createMethod(true)
};


/***/ }),
/* 216 */
/***/ (function(module, exports, __webpack_require__) {

var DESCRIPTORS = __webpack_require__(141);
var definePropertyModule = __webpack_require__(144);
var anObject = __webpack_require__(140);
var objectKeys = __webpack_require__(191);

// `Object.defineProperties` method
// https://tc39.github.io/ecma262/#sec-object.defineproperties
module.exports = DESCRIPTORS ? Object.defineProperties : function defineProperties(O, Properties) {
  anObject(O);
  var keys = objectKeys(Properties);
  var length = keys.length;
  var index = 0;
  var key;
  while (length > index) definePropertyModule.f(O, key = keys[index++], Properties[key]);
  return O;
};


/***/ }),
/* 217 */
/***/ (function(module, exports, __webpack_require__) {

var getBuiltIn = __webpack_require__(155);

module.exports = getBuiltIn('document', 'documentElement');


/***/ }),
/* 218 */
/***/ (function(module, exports, __webpack_require__) {

var wellKnownSymbol = __webpack_require__(139);

exports.f = wellKnownSymbol;


/***/ }),
/* 219 */
/***/ (function(module, exports, __webpack_require__) {

var path = __webpack_require__(206);
var has = __webpack_require__(143);
var wrappedWellKnownSymbolModule = __webpack_require__(218);
var defineProperty = __webpack_require__(144).f;

module.exports = function (NAME) {
  var Symbol = path.Symbol || (path.Symbol = {});
  if (!has(Symbol, NAME)) defineProperty(Symbol, NAME, {
    value: wrappedWellKnownSymbolModule.f(NAME)
  });
};


/***/ }),
/* 220 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $forEach = __webpack_require__(158).forEach;
var arrayMethodIsStrict = __webpack_require__(160);
var arrayMethodUsesToLength = __webpack_require__(154);

var STRICT_METHOD = arrayMethodIsStrict('forEach');
var USES_TO_LENGTH = arrayMethodUsesToLength('forEach');

// `Array.prototype.forEach` method implementation
// https://tc39.github.io/ecma262/#sec-array.prototype.foreach
module.exports = (!STRICT_METHOD || !USES_TO_LENGTH) ? function forEach(callbackfn /* , thisArg */) {
  return $forEach(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
} : [].forEach;


/***/ }),
/* 221 */
/***/ (function(module, exports) {

// iterable DOM collections
// flag - `iterable` interface - 'entries', 'keys', 'values', 'forEach' methods
module.exports = {
  CSSRuleList: 0,
  CSSStyleDeclaration: 0,
  CSSValueList: 0,
  ClientRectList: 0,
  DOMRectList: 0,
  DOMStringList: 0,
  DOMTokenList: 1,
  DataTransferItemList: 0,
  FileList: 0,
  HTMLAllCollection: 0,
  HTMLCollection: 0,
  HTMLFormElement: 0,
  HTMLSelectElement: 0,
  MediaList: 0,
  MimeTypeArray: 0,
  NamedNodeMap: 0,
  NodeList: 1,
  PaintRequestList: 0,
  Plugin: 0,
  PluginArray: 0,
  SVGLengthList: 0,
  SVGNumberList: 0,
  SVGPathSegList: 0,
  SVGPointList: 0,
  SVGStringList: 0,
  SVGTransformList: 0,
  SourceBufferList: 0,
  StyleSheetList: 0,
  TextTrackCueList: 0,
  TextTrackList: 0,
  TouchList: 0
};


/***/ }),
/* 222 */
/***/ (function(module, exports, __webpack_require__) {

var TO_STRING_TAG_SUPPORT = __webpack_require__(193);
var classofRaw = __webpack_require__(150);
var wellKnownSymbol = __webpack_require__(139);

var TO_STRING_TAG = wellKnownSymbol('toStringTag');
// ES3 wrong here
var CORRECT_ARGUMENTS = classofRaw(function () { return arguments; }()) == 'Arguments';

// fallback for IE11 Script Access Denied error
var tryGet = function (it, key) {
  try {
    return it[key];
  } catch (error) { /* empty */ }
};

// getting tag from ES6+ `Object.prototype.toString`
module.exports = TO_STRING_TAG_SUPPORT ? classofRaw : function (it) {
  var O, tag, result;
  return it === undefined ? 'Undefined' : it === null ? 'Null'
    // @@toStringTag case
    : typeof (tag = tryGet(O = Object(it), TO_STRING_TAG)) == 'string' ? tag
    // builtinTag case
    : CORRECT_ARGUMENTS ? classofRaw(O)
    // ES3 arguments fallback
    : (result = classofRaw(O)) == 'Object' && typeof O.callee == 'function' ? 'Arguments' : result;
};


/***/ }),
/* 223 */
/***/ (function(module, exports, __webpack_require__) {

var redefine = __webpack_require__(145);

module.exports = function (target, src, options) {
  for (var key in src) redefine(target, key, src[key], options);
  return target;
};


/***/ }),
/* 224 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var getBuiltIn = __webpack_require__(155);
var definePropertyModule = __webpack_require__(144);
var wellKnownSymbol = __webpack_require__(139);
var DESCRIPTORS = __webpack_require__(141);

var SPECIES = wellKnownSymbol('species');

module.exports = function (CONSTRUCTOR_NAME) {
  var Constructor = getBuiltIn(CONSTRUCTOR_NAME);
  var defineProperty = definePropertyModule.f;

  if (DESCRIPTORS && Constructor && !Constructor[SPECIES]) {
    defineProperty(Constructor, SPECIES, {
      configurable: true,
      get: function () { return this; }
    });
  }
};


/***/ }),
/* 225 */
/***/ (function(module, exports, __webpack_require__) {

var wellKnownSymbol = __webpack_require__(139);
var Iterators = __webpack_require__(168);

var ITERATOR = wellKnownSymbol('iterator');
var ArrayPrototype = Array.prototype;

// check on default Array iterator
module.exports = function (it) {
  return it !== undefined && (Iterators.Array === it || ArrayPrototype[ITERATOR] === it);
};


/***/ }),
/* 226 */
/***/ (function(module, exports, __webpack_require__) {

var classof = __webpack_require__(222);
var Iterators = __webpack_require__(168);
var wellKnownSymbol = __webpack_require__(139);

var ITERATOR = wellKnownSymbol('iterator');

module.exports = function (it) {
  if (it != undefined) return it[ITERATOR]
    || it['@@iterator']
    || Iterators[classof(it)];
};


/***/ }),
/* 227 */
/***/ (function(module, exports, __webpack_require__) {

var anObject = __webpack_require__(140);

// call something on iterator step with safe closing on error
module.exports = function (iterator, fn, value, ENTRIES) {
  try {
    return ENTRIES ? fn(anObject(value)[0], value[1]) : fn(value);
  // 7.4.6 IteratorClose(iterator, completion)
  } catch (error) {
    var returnMethod = iterator['return'];
    if (returnMethod !== undefined) anObject(returnMethod.call(iterator));
    throw error;
  }
};


/***/ }),
/* 228 */
/***/ (function(module, exports, __webpack_require__) {

var anObject = __webpack_require__(140);
var aFunction = __webpack_require__(159);
var wellKnownSymbol = __webpack_require__(139);

var SPECIES = wellKnownSymbol('species');

// `SpeciesConstructor` abstract operation
// https://tc39.github.io/ecma262/#sec-speciesconstructor
module.exports = function (O, defaultConstructor) {
  var C = anObject(O).constructor;
  var S;
  return C === undefined || (S = anObject(C)[SPECIES]) == undefined ? defaultConstructor : aFunction(S);
};


/***/ }),
/* 229 */
/***/ (function(module, exports, __webpack_require__) {

var global = __webpack_require__(137);
var fails = __webpack_require__(138);
var classof = __webpack_require__(150);
var bind = __webpack_require__(165);
var html = __webpack_require__(217);
var createElement = __webpack_require__(179);
var IS_IOS = __webpack_require__(230);

var location = global.location;
var set = global.setImmediate;
var clear = global.clearImmediate;
var process = global.process;
var MessageChannel = global.MessageChannel;
var Dispatch = global.Dispatch;
var counter = 0;
var queue = {};
var ONREADYSTATECHANGE = 'onreadystatechange';
var defer, channel, port;

var run = function (id) {
  // eslint-disable-next-line no-prototype-builtins
  if (queue.hasOwnProperty(id)) {
    var fn = queue[id];
    delete queue[id];
    fn();
  }
};

var runner = function (id) {
  return function () {
    run(id);
  };
};

var listener = function (event) {
  run(event.data);
};

var post = function (id) {
  // old engines have not location.origin
  global.postMessage(id + '', location.protocol + '//' + location.host);
};

// Node.js 0.9+ & IE10+ has setImmediate, otherwise:
if (!set || !clear) {
  set = function setImmediate(fn) {
    var args = [];
    var i = 1;
    while (arguments.length > i) args.push(arguments[i++]);
    queue[++counter] = function () {
      // eslint-disable-next-line no-new-func
      (typeof fn == 'function' ? fn : Function(fn)).apply(undefined, args);
    };
    defer(counter);
    return counter;
  };
  clear = function clearImmediate(id) {
    delete queue[id];
  };
  // Node.js 0.8-
  if (classof(process) == 'process') {
    defer = function (id) {
      process.nextTick(runner(id));
    };
  // Sphere (JS game engine) Dispatch API
  } else if (Dispatch && Dispatch.now) {
    defer = function (id) {
      Dispatch.now(runner(id));
    };
  // Browsers with MessageChannel, includes WebWorkers
  // except iOS - https://github.com/zloirock/core-js/issues/624
  } else if (MessageChannel && !IS_IOS) {
    channel = new MessageChannel();
    port = channel.port2;
    channel.port1.onmessage = listener;
    defer = bind(port.postMessage, port, 1);
  // Browsers with postMessage, skip WebWorkers
  // IE8 has postMessage, but it's sync & typeof its postMessage is 'object'
  } else if (
    global.addEventListener &&
    typeof postMessage == 'function' &&
    !global.importScripts &&
    !fails(post) &&
    location.protocol !== 'file:'
  ) {
    defer = post;
    global.addEventListener('message', listener, false);
  // IE8-
  } else if (ONREADYSTATECHANGE in createElement('script')) {
    defer = function (id) {
      html.appendChild(createElement('script'))[ONREADYSTATECHANGE] = function () {
        html.removeChild(this);
        run(id);
      };
    };
  // Rest old browsers
  } else {
    defer = function (id) {
      setTimeout(runner(id), 0);
    };
  }
}

module.exports = {
  set: set,
  clear: clear
};


/***/ }),
/* 230 */
/***/ (function(module, exports, __webpack_require__) {

var userAgent = __webpack_require__(212);

module.exports = /(iphone|ipod|ipad).*applewebkit/i.test(userAgent);


/***/ }),
/* 231 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var aFunction = __webpack_require__(159);

var PromiseCapability = function (C) {
  var resolve, reject;
  this.promise = new C(function ($$resolve, $$reject) {
    if (resolve !== undefined || reject !== undefined) throw TypeError('Bad Promise constructor');
    resolve = $$resolve;
    reject = $$reject;
  });
  this.resolve = aFunction(resolve);
  this.reject = aFunction(reject);
};

// 25.4.1.5 NewPromiseCapability(C)
module.exports.f = function (C) {
  return new PromiseCapability(C);
};


/***/ }),
/* 232 */
/***/ (function(module, exports, __webpack_require__) {

var isObject = __webpack_require__(142);
var classof = __webpack_require__(150);
var wellKnownSymbol = __webpack_require__(139);

var MATCH = wellKnownSymbol('match');

// `IsRegExp` abstract operation
// https://tc39.github.io/ecma262/#sec-isregexp
module.exports = function (it) {
  var isRegExp;
  return isObject(it) && ((isRegExp = it[MATCH]) !== undefined ? !!isRegExp : classof(it) == 'RegExp');
};


/***/ }),
/* 233 */
/***/ (function(module, exports) {

function _assertThisInitialized(self) {
  if (self === void 0) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return self;
}

module.exports = _assertThisInitialized;

/***/ }),
/* 234 */
/***/ (function(module, exports) {

function _getPrototypeOf(o) {
  module.exports = _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
    return o.__proto__ || Object.getPrototypeOf(o);
  };
  return _getPrototypeOf(o);
}

module.exports = _getPrototypeOf;

/***/ }),
/* 235 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var getPrototypeOf = __webpack_require__(199);
var createNonEnumerableProperty = __webpack_require__(146);
var has = __webpack_require__(143);
var wellKnownSymbol = __webpack_require__(139);
var IS_PURE = __webpack_require__(163);

var ITERATOR = wellKnownSymbol('iterator');
var BUGGY_SAFARI_ITERATORS = false;

var returnThis = function () { return this; };

// `%IteratorPrototype%` object
// https://tc39.github.io/ecma262/#sec-%iteratorprototype%-object
var IteratorPrototype, PrototypeOfArrayIteratorPrototype, arrayIterator;

if ([].keys) {
  arrayIterator = [].keys();
  // Safari 8 has buggy iterators w/o `next`
  if (!('next' in arrayIterator)) BUGGY_SAFARI_ITERATORS = true;
  else {
    PrototypeOfArrayIteratorPrototype = getPrototypeOf(getPrototypeOf(arrayIterator));
    if (PrototypeOfArrayIteratorPrototype !== Object.prototype) IteratorPrototype = PrototypeOfArrayIteratorPrototype;
  }
}

if (IteratorPrototype == undefined) IteratorPrototype = {};

// 25.1.2.1.1 %IteratorPrototype%[@@iterator]()
if (!IS_PURE && !has(IteratorPrototype, ITERATOR)) {
  createNonEnumerableProperty(IteratorPrototype, ITERATOR, returnThis);
}

module.exports = {
  IteratorPrototype: IteratorPrototype,
  BUGGY_SAFARI_ITERATORS: BUGGY_SAFARI_ITERATORS
};


/***/ }),
/* 236 */
/***/ (function(module, exports, __webpack_require__) {

var fails = __webpack_require__(138);

module.exports = !fails(function () {
  function F() { /* empty */ }
  F.prototype.constructor = null;
  return Object.getPrototypeOf(new F()) !== F.prototype;
});


/***/ }),
/* 237 */
/***/ (function(module, exports, __webpack_require__) {

var anObject = __webpack_require__(140);
var aPossiblePrototype = __webpack_require__(306);

// `Object.setPrototypeOf` method
// https://tc39.github.io/ecma262/#sec-object.setprototypeof
// Works with __proto__ only. Old v8 can't work with null proto objects.
/* eslint-disable no-proto */
module.exports = Object.setPrototypeOf || ('__proto__' in {} ? function () {
  var CORRECT_SETTER = false;
  var test = {};
  var setter;
  try {
    setter = Object.getOwnPropertyDescriptor(Object.prototype, '__proto__').set;
    setter.call(test, []);
    CORRECT_SETTER = test instanceof Array;
  } catch (error) { /* empty */ }
  return function setPrototypeOf(O, proto) {
    anObject(O);
    aPossiblePrototype(proto);
    if (CORRECT_SETTER) setter.call(O, proto);
    else O.__proto__ = proto;
    return O;
  };
}() : undefined);


/***/ }),
/* 238 */
/***/ (function(module, exports, __webpack_require__) {

var isObject = __webpack_require__(142);
var setPrototypeOf = __webpack_require__(237);

// makes subclassing work correct for wrapped built-ins
module.exports = function ($this, dummy, Wrapper) {
  var NewTarget, NewTargetPrototype;
  if (
    // it can work only with native `setPrototypeOf`
    setPrototypeOf &&
    // we haven't completely correct pre-ES6 way for getting `new.target`, so use this
    typeof (NewTarget = dummy.constructor) == 'function' &&
    NewTarget !== Wrapper &&
    isObject(NewTargetPrototype = NewTarget.prototype) &&
    NewTargetPrototype !== Wrapper.prototype
  ) setPrototypeOf($this, NewTargetPrototype);
  return $this;
};


/***/ }),
/* 239 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var toIndexedObject = __webpack_require__(149);
var addToUnscopables = __webpack_require__(197);
var Iterators = __webpack_require__(168);
var InternalStateModule = __webpack_require__(157);
var defineIterator = __webpack_require__(198);

var ARRAY_ITERATOR = 'Array Iterator';
var setInternalState = InternalStateModule.set;
var getInternalState = InternalStateModule.getterFor(ARRAY_ITERATOR);

// `Array.prototype.entries` method
// https://tc39.github.io/ecma262/#sec-array.prototype.entries
// `Array.prototype.keys` method
// https://tc39.github.io/ecma262/#sec-array.prototype.keys
// `Array.prototype.values` method
// https://tc39.github.io/ecma262/#sec-array.prototype.values
// `Array.prototype[@@iterator]` method
// https://tc39.github.io/ecma262/#sec-array.prototype-@@iterator
// `CreateArrayIterator` internal method
// https://tc39.github.io/ecma262/#sec-createarrayiterator
module.exports = defineIterator(Array, 'Array', function (iterated, kind) {
  setInternalState(this, {
    type: ARRAY_ITERATOR,
    target: toIndexedObject(iterated), // target
    index: 0,                          // next index
    kind: kind                         // kind
  });
// `%ArrayIteratorPrototype%.next` method
// https://tc39.github.io/ecma262/#sec-%arrayiteratorprototype%.next
}, function () {
  var state = getInternalState(this);
  var target = state.target;
  var kind = state.kind;
  var index = state.index++;
  if (!target || index >= target.length) {
    state.target = undefined;
    return { value: undefined, done: true };
  }
  if (kind == 'keys') return { value: index, done: false };
  if (kind == 'values') return { value: target[index], done: false };
  return { value: [index, target[index]], done: false };
}, 'values');

// argumentsList[@@iterator] is %ArrayProto_values%
// https://tc39.github.io/ecma262/#sec-createunmappedargumentsobject
// https://tc39.github.io/ecma262/#sec-createmappedargumentsobject
Iterators.Arguments = Iterators.Array;

// https://tc39.github.io/ecma262/#sec-array.prototype-@@unscopables
addToUnscopables('keys');
addToUnscopables('values');
addToUnscopables('entries');


/***/ }),
/* 240 */
/***/ (function(module, exports, __webpack_require__) {

var hiddenKeys = __webpack_require__(164);
var isObject = __webpack_require__(142);
var has = __webpack_require__(143);
var defineProperty = __webpack_require__(144).f;
var uid = __webpack_require__(171);
var FREEZING = __webpack_require__(325);

var METADATA = uid('meta');
var id = 0;

var isExtensible = Object.isExtensible || function () {
  return true;
};

var setMetadata = function (it) {
  defineProperty(it, METADATA, { value: {
    objectID: 'O' + ++id, // object ID
    weakData: {}          // weak collections IDs
  } });
};

var fastKey = function (it, create) {
  // return a primitive with prefix
  if (!isObject(it)) return typeof it == 'symbol' ? it : (typeof it == 'string' ? 'S' : 'P') + it;
  if (!has(it, METADATA)) {
    // can't set metadata to uncaught frozen object
    if (!isExtensible(it)) return 'F';
    // not necessary to add metadata
    if (!create) return 'E';
    // add missing metadata
    setMetadata(it);
  // return object ID
  } return it[METADATA].objectID;
};

var getWeakData = function (it, create) {
  if (!has(it, METADATA)) {
    // can't set metadata to uncaught frozen object
    if (!isExtensible(it)) return true;
    // not necessary to add metadata
    if (!create) return false;
    // add missing metadata
    setMetadata(it);
  // return the store of weak collections IDs
  } return it[METADATA].weakData;
};

// add metadata on freeze-family methods calling
var onFreeze = function (it) {
  if (FREEZING && meta.REQUIRED && isExtensible(it) && !has(it, METADATA)) setMetadata(it);
  return it;
};

var meta = module.exports = {
  REQUIRED: false,
  fastKey: fastKey,
  getWeakData: getWeakData,
  onFreeze: onFreeze
};

hiddenKeys[METADATA] = true;


/***/ }),
/* 241 */,
/* 242 */,
/* 243 */,
/* 244 */,
/* 245 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $ = __webpack_require__(136);
var $map = __webpack_require__(158).map;
var arrayMethodHasSpeciesSupport = __webpack_require__(186);
var arrayMethodUsesToLength = __webpack_require__(154);

var HAS_SPECIES_SUPPORT = arrayMethodHasSpeciesSupport('map');
// FF49- issue
var USES_TO_LENGTH = arrayMethodUsesToLength('map');

// `Array.prototype.map` method
// https://tc39.github.io/ecma262/#sec-array.prototype.map
// with adding support of @@species
$({ target: 'Array', proto: true, forced: !HAS_SPECIES_SUPPORT || !USES_TO_LENGTH }, {
  map: function map(callbackfn /* , thisArg */) {
    return $map(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
  }
});


/***/ }),
/* 246 */
/***/ (function(module, exports, __webpack_require__) {

var global = __webpack_require__(137);
var inspectSource = __webpack_require__(181);

var WeakMap = global.WeakMap;

module.exports = typeof WeakMap === 'function' && /native code/.test(inspectSource(WeakMap));


/***/ }),
/* 247 */
/***/ (function(module, exports, __webpack_require__) {

var $ = __webpack_require__(136);
var parseFloatImplementation = __webpack_require__(248);

// `parseFloat` method
// https://tc39.github.io/ecma262/#sec-parsefloat-string
$({ global: true, forced: parseFloat != parseFloatImplementation }, {
  parseFloat: parseFloatImplementation
});


/***/ }),
/* 248 */
/***/ (function(module, exports, __webpack_require__) {

var global = __webpack_require__(137);
var trim = __webpack_require__(176).trim;
var whitespaces = __webpack_require__(177);

var $parseFloat = global.parseFloat;
var FORCED = 1 / $parseFloat(whitespaces + '-0') !== -Infinity;

// `parseFloat` method
// https://tc39.github.io/ecma262/#sec-parsefloat-string
module.exports = FORCED ? function parseFloat(string) {
  var trimmedString = trim(String(string));
  var result = $parseFloat(trimmedString);
  return result === 0 && trimmedString.charAt(0) == '-' ? -0 : result;
} : $parseFloat;


/***/ }),
/* 249 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var fails = __webpack_require__(138);

// babel-minify transpiles RegExp('a', 'y') -> /a/y and it causes SyntaxError,
// so we use an intermediate function.
function RE(s, f) {
  return RegExp(s, f);
}

exports.UNSUPPORTED_Y = fails(function () {
  // babel-minify transpiles RegExp('a', 'y') -> /a/y and it causes SyntaxError
  var re = RE('a', 'y');
  re.lastIndex = 2;
  return re.exec('abcd') != null;
});

exports.BROKEN_CARET = fails(function () {
  // https://bugzilla.mozilla.org/show_bug.cgi?id=773687
  var re = RE('^r', 'gy');
  re.lastIndex = 2;
  return re.exec('str') != null;
});


/***/ }),
/* 250 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var fixRegExpWellKnownSymbolLogic = __webpack_require__(188);
var anObject = __webpack_require__(140);
var toLength = __webpack_require__(147);
var requireObjectCoercible = __webpack_require__(153);
var advanceStringIndex = __webpack_require__(189);
var regExpExec = __webpack_require__(190);

// @@match logic
fixRegExpWellKnownSymbolLogic('match', 1, function (MATCH, nativeMatch, maybeCallNative) {
  return [
    // `String.prototype.match` method
    // https://tc39.github.io/ecma262/#sec-string.prototype.match
    function match(regexp) {
      var O = requireObjectCoercible(this);
      var matcher = regexp == undefined ? undefined : regexp[MATCH];
      return matcher !== undefined ? matcher.call(regexp, O) : new RegExp(regexp)[MATCH](String(O));
    },
    // `RegExp.prototype[@@match]` method
    // https://tc39.github.io/ecma262/#sec-regexp.prototype-@@match
    function (regexp) {
      var res = maybeCallNative(nativeMatch, regexp, this);
      if (res.done) return res.value;

      var rx = anObject(regexp);
      var S = String(this);

      if (!rx.global) return regExpExec(rx, S);

      var fullUnicode = rx.unicode;
      rx.lastIndex = 0;
      var A = [];
      var n = 0;
      var result;
      while ((result = regExpExec(rx, S)) !== null) {
        var matchStr = String(result[0]);
        A[n] = matchStr;
        if (matchStr === '') rx.lastIndex = advanceStringIndex(S, toLength(rx.lastIndex), fullUnicode);
        n++;
      }
      return n === 0 ? null : A;
    }
  ];
});


/***/ }),
/* 251 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var fixRegExpWellKnownSymbolLogic = __webpack_require__(188);
var anObject = __webpack_require__(140);
var toObject = __webpack_require__(151);
var toLength = __webpack_require__(147);
var toInteger = __webpack_require__(173);
var requireObjectCoercible = __webpack_require__(153);
var advanceStringIndex = __webpack_require__(189);
var regExpExec = __webpack_require__(190);

var max = Math.max;
var min = Math.min;
var floor = Math.floor;
var SUBSTITUTION_SYMBOLS = /\$([$&'`]|\d\d?|<[^>]*>)/g;
var SUBSTITUTION_SYMBOLS_NO_NAMED = /\$([$&'`]|\d\d?)/g;

var maybeToString = function (it) {
  return it === undefined ? it : String(it);
};

// @@replace logic
fixRegExpWellKnownSymbolLogic('replace', 2, function (REPLACE, nativeReplace, maybeCallNative, reason) {
  var REGEXP_REPLACE_SUBSTITUTES_UNDEFINED_CAPTURE = reason.REGEXP_REPLACE_SUBSTITUTES_UNDEFINED_CAPTURE;
  var REPLACE_KEEPS_$0 = reason.REPLACE_KEEPS_$0;
  var UNSAFE_SUBSTITUTE = REGEXP_REPLACE_SUBSTITUTES_UNDEFINED_CAPTURE ? '$' : '$0';

  return [
    // `String.prototype.replace` method
    // https://tc39.github.io/ecma262/#sec-string.prototype.replace
    function replace(searchValue, replaceValue) {
      var O = requireObjectCoercible(this);
      var replacer = searchValue == undefined ? undefined : searchValue[REPLACE];
      return replacer !== undefined
        ? replacer.call(searchValue, O, replaceValue)
        : nativeReplace.call(String(O), searchValue, replaceValue);
    },
    // `RegExp.prototype[@@replace]` method
    // https://tc39.github.io/ecma262/#sec-regexp.prototype-@@replace
    function (regexp, replaceValue) {
      if (
        (!REGEXP_REPLACE_SUBSTITUTES_UNDEFINED_CAPTURE && REPLACE_KEEPS_$0) ||
        (typeof replaceValue === 'string' && replaceValue.indexOf(UNSAFE_SUBSTITUTE) === -1)
      ) {
        var res = maybeCallNative(nativeReplace, regexp, this, replaceValue);
        if (res.done) return res.value;
      }

      var rx = anObject(regexp);
      var S = String(this);

      var functionalReplace = typeof replaceValue === 'function';
      if (!functionalReplace) replaceValue = String(replaceValue);

      var global = rx.global;
      if (global) {
        var fullUnicode = rx.unicode;
        rx.lastIndex = 0;
      }
      var results = [];
      while (true) {
        var result = regExpExec(rx, S);
        if (result === null) break;

        results.push(result);
        if (!global) break;

        var matchStr = String(result[0]);
        if (matchStr === '') rx.lastIndex = advanceStringIndex(S, toLength(rx.lastIndex), fullUnicode);
      }

      var accumulatedResult = '';
      var nextSourcePosition = 0;
      for (var i = 0; i < results.length; i++) {
        result = results[i];

        var matched = String(result[0]);
        var position = max(min(toInteger(result.index), S.length), 0);
        var captures = [];
        // NOTE: This is equivalent to
        //   captures = result.slice(1).map(maybeToString)
        // but for some reason `nativeSlice.call(result, 1, result.length)` (called in
        // the slice polyfill when slicing native arrays) "doesn't work" in safari 9 and
        // causes a crash (https://pastebin.com/N21QzeQA) when trying to debug it.
        for (var j = 1; j < result.length; j++) captures.push(maybeToString(result[j]));
        var namedCaptures = result.groups;
        if (functionalReplace) {
          var replacerArgs = [matched].concat(captures, position, S);
          if (namedCaptures !== undefined) replacerArgs.push(namedCaptures);
          var replacement = String(replaceValue.apply(undefined, replacerArgs));
        } else {
          replacement = getSubstitution(matched, S, position, captures, namedCaptures, replaceValue);
        }
        if (position >= nextSourcePosition) {
          accumulatedResult += S.slice(nextSourcePosition, position) + replacement;
          nextSourcePosition = position + matched.length;
        }
      }
      return accumulatedResult + S.slice(nextSourcePosition);
    }
  ];

  // https://tc39.github.io/ecma262/#sec-getsubstitution
  function getSubstitution(matched, str, position, captures, namedCaptures, replacement) {
    var tailPos = position + matched.length;
    var m = captures.length;
    var symbols = SUBSTITUTION_SYMBOLS_NO_NAMED;
    if (namedCaptures !== undefined) {
      namedCaptures = toObject(namedCaptures);
      symbols = SUBSTITUTION_SYMBOLS;
    }
    return nativeReplace.call(replacement, symbols, function (match, ch) {
      var capture;
      switch (ch.charAt(0)) {
        case '$': return '$';
        case '&': return matched;
        case '`': return str.slice(0, position);
        case "'": return str.slice(tailPos);
        case '<':
          capture = namedCaptures[ch.slice(1, -1)];
          break;
        default: // \d\d?
          var n = +ch;
          if (n === 0) return match;
          if (n > m) {
            var f = floor(n / 10);
            if (f === 0) return match;
            if (f <= m) return captures[f - 1] === undefined ? ch.charAt(1) : captures[f - 1] + ch.charAt(1);
            return match;
          }
          capture = captures[n - 1];
      }
      return capture === undefined ? '' : capture;
    });
  }
});


/***/ }),
/* 252 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $ = __webpack_require__(136);
var IndexedObject = __webpack_require__(169);
var toIndexedObject = __webpack_require__(149);
var arrayMethodIsStrict = __webpack_require__(160);

var nativeJoin = [].join;

var ES3_STRINGS = IndexedObject != Object;
var STRICT_METHOD = arrayMethodIsStrict('join', ',');

// `Array.prototype.join` method
// https://tc39.github.io/ecma262/#sec-array.prototype.join
$({ target: 'Array', proto: true, forced: ES3_STRINGS || !STRICT_METHOD }, {
  join: function join(separator) {
    return nativeJoin.call(toIndexedObject(this), separator === undefined ? ',' : separator);
  }
});


/***/ }),
/* 253 */
/***/ (function(module, exports, __webpack_require__) {

var arrayWithHoles = __webpack_require__(254);

var iterableToArrayLimit = __webpack_require__(255);

var unsupportedIterableToArray = __webpack_require__(256);

var nonIterableRest = __webpack_require__(258);

function _slicedToArray(arr, i) {
  return arrayWithHoles(arr) || iterableToArrayLimit(arr, i) || unsupportedIterableToArray(arr, i) || nonIterableRest();
}

module.exports = _slicedToArray;

/***/ }),
/* 254 */
/***/ (function(module, exports) {

function _arrayWithHoles(arr) {
  if (Array.isArray(arr)) return arr;
}

module.exports = _arrayWithHoles;

/***/ }),
/* 255 */
/***/ (function(module, exports) {

function _iterableToArrayLimit(arr, i) {
  if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return;
  var _arr = [];
  var _n = true;
  var _d = false;
  var _e = undefined;

  try {
    for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
      _arr.push(_s.value);

      if (i && _arr.length === i) break;
    }
  } catch (err) {
    _d = true;
    _e = err;
  } finally {
    try {
      if (!_n && _i["return"] != null) _i["return"]();
    } finally {
      if (_d) throw _e;
    }
  }

  return _arr;
}

module.exports = _iterableToArrayLimit;

/***/ }),
/* 256 */
/***/ (function(module, exports, __webpack_require__) {

var arrayLikeToArray = __webpack_require__(257);

function _unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return arrayLikeToArray(o, minLen);
}

module.exports = _unsupportedIterableToArray;

/***/ }),
/* 257 */
/***/ (function(module, exports) {

function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;

  for (var i = 0, arr2 = new Array(len); i < len; i++) {
    arr2[i] = arr[i];
  }

  return arr2;
}

module.exports = _arrayLikeToArray;

/***/ }),
/* 258 */
/***/ (function(module, exports) {

function _nonIterableRest() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}

module.exports = _nonIterableRest;

/***/ }),
/* 259 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $ = __webpack_require__(136);
var global = __webpack_require__(137);
var getBuiltIn = __webpack_require__(155);
var IS_PURE = __webpack_require__(163);
var DESCRIPTORS = __webpack_require__(141);
var NATIVE_SYMBOL = __webpack_require__(185);
var USE_SYMBOL_AS_UID = __webpack_require__(211);
var fails = __webpack_require__(138);
var has = __webpack_require__(143);
var isArray = __webpack_require__(175);
var isObject = __webpack_require__(142);
var anObject = __webpack_require__(140);
var toObject = __webpack_require__(151);
var toIndexedObject = __webpack_require__(149);
var toPrimitive = __webpack_require__(162);
var createPropertyDescriptor = __webpack_require__(161);
var nativeObjectCreate = __webpack_require__(166);
var objectKeys = __webpack_require__(191);
var getOwnPropertyNamesModule = __webpack_require__(172);
var getOwnPropertyNamesExternal = __webpack_require__(260);
var getOwnPropertySymbolsModule = __webpack_require__(209);
var getOwnPropertyDescriptorModule = __webpack_require__(152);
var definePropertyModule = __webpack_require__(144);
var propertyIsEnumerableModule = __webpack_require__(201);
var createNonEnumerableProperty = __webpack_require__(146);
var redefine = __webpack_require__(145);
var shared = __webpack_require__(182);
var sharedKey = __webpack_require__(170);
var hiddenKeys = __webpack_require__(164);
var uid = __webpack_require__(171);
var wellKnownSymbol = __webpack_require__(139);
var wrappedWellKnownSymbolModule = __webpack_require__(218);
var defineWellKnownSymbol = __webpack_require__(219);
var setToStringTag = __webpack_require__(167);
var InternalStateModule = __webpack_require__(157);
var $forEach = __webpack_require__(158).forEach;

var HIDDEN = sharedKey('hidden');
var SYMBOL = 'Symbol';
var PROTOTYPE = 'prototype';
var TO_PRIMITIVE = wellKnownSymbol('toPrimitive');
var setInternalState = InternalStateModule.set;
var getInternalState = InternalStateModule.getterFor(SYMBOL);
var ObjectPrototype = Object[PROTOTYPE];
var $Symbol = global.Symbol;
var $stringify = getBuiltIn('JSON', 'stringify');
var nativeGetOwnPropertyDescriptor = getOwnPropertyDescriptorModule.f;
var nativeDefineProperty = definePropertyModule.f;
var nativeGetOwnPropertyNames = getOwnPropertyNamesExternal.f;
var nativePropertyIsEnumerable = propertyIsEnumerableModule.f;
var AllSymbols = shared('symbols');
var ObjectPrototypeSymbols = shared('op-symbols');
var StringToSymbolRegistry = shared('string-to-symbol-registry');
var SymbolToStringRegistry = shared('symbol-to-string-registry');
var WellKnownSymbolsStore = shared('wks');
var QObject = global.QObject;
// Don't use setters in Qt Script, https://github.com/zloirock/core-js/issues/173
var USE_SETTER = !QObject || !QObject[PROTOTYPE] || !QObject[PROTOTYPE].findChild;

// fallback for old Android, https://code.google.com/p/v8/issues/detail?id=687
var setSymbolDescriptor = DESCRIPTORS && fails(function () {
  return nativeObjectCreate(nativeDefineProperty({}, 'a', {
    get: function () { return nativeDefineProperty(this, 'a', { value: 7 }).a; }
  })).a != 7;
}) ? function (O, P, Attributes) {
  var ObjectPrototypeDescriptor = nativeGetOwnPropertyDescriptor(ObjectPrototype, P);
  if (ObjectPrototypeDescriptor) delete ObjectPrototype[P];
  nativeDefineProperty(O, P, Attributes);
  if (ObjectPrototypeDescriptor && O !== ObjectPrototype) {
    nativeDefineProperty(ObjectPrototype, P, ObjectPrototypeDescriptor);
  }
} : nativeDefineProperty;

var wrap = function (tag, description) {
  var symbol = AllSymbols[tag] = nativeObjectCreate($Symbol[PROTOTYPE]);
  setInternalState(symbol, {
    type: SYMBOL,
    tag: tag,
    description: description
  });
  if (!DESCRIPTORS) symbol.description = description;
  return symbol;
};

var isSymbol = USE_SYMBOL_AS_UID ? function (it) {
  return typeof it == 'symbol';
} : function (it) {
  return Object(it) instanceof $Symbol;
};

var $defineProperty = function defineProperty(O, P, Attributes) {
  if (O === ObjectPrototype) $defineProperty(ObjectPrototypeSymbols, P, Attributes);
  anObject(O);
  var key = toPrimitive(P, true);
  anObject(Attributes);
  if (has(AllSymbols, key)) {
    if (!Attributes.enumerable) {
      if (!has(O, HIDDEN)) nativeDefineProperty(O, HIDDEN, createPropertyDescriptor(1, {}));
      O[HIDDEN][key] = true;
    } else {
      if (has(O, HIDDEN) && O[HIDDEN][key]) O[HIDDEN][key] = false;
      Attributes = nativeObjectCreate(Attributes, { enumerable: createPropertyDescriptor(0, false) });
    } return setSymbolDescriptor(O, key, Attributes);
  } return nativeDefineProperty(O, key, Attributes);
};

var $defineProperties = function defineProperties(O, Properties) {
  anObject(O);
  var properties = toIndexedObject(Properties);
  var keys = objectKeys(properties).concat($getOwnPropertySymbols(properties));
  $forEach(keys, function (key) {
    if (!DESCRIPTORS || $propertyIsEnumerable.call(properties, key)) $defineProperty(O, key, properties[key]);
  });
  return O;
};

var $create = function create(O, Properties) {
  return Properties === undefined ? nativeObjectCreate(O) : $defineProperties(nativeObjectCreate(O), Properties);
};

var $propertyIsEnumerable = function propertyIsEnumerable(V) {
  var P = toPrimitive(V, true);
  var enumerable = nativePropertyIsEnumerable.call(this, P);
  if (this === ObjectPrototype && has(AllSymbols, P) && !has(ObjectPrototypeSymbols, P)) return false;
  return enumerable || !has(this, P) || !has(AllSymbols, P) || has(this, HIDDEN) && this[HIDDEN][P] ? enumerable : true;
};

var $getOwnPropertyDescriptor = function getOwnPropertyDescriptor(O, P) {
  var it = toIndexedObject(O);
  var key = toPrimitive(P, true);
  if (it === ObjectPrototype && has(AllSymbols, key) && !has(ObjectPrototypeSymbols, key)) return;
  var descriptor = nativeGetOwnPropertyDescriptor(it, key);
  if (descriptor && has(AllSymbols, key) && !(has(it, HIDDEN) && it[HIDDEN][key])) {
    descriptor.enumerable = true;
  }
  return descriptor;
};

var $getOwnPropertyNames = function getOwnPropertyNames(O) {
  var names = nativeGetOwnPropertyNames(toIndexedObject(O));
  var result = [];
  $forEach(names, function (key) {
    if (!has(AllSymbols, key) && !has(hiddenKeys, key)) result.push(key);
  });
  return result;
};

var $getOwnPropertySymbols = function getOwnPropertySymbols(O) {
  var IS_OBJECT_PROTOTYPE = O === ObjectPrototype;
  var names = nativeGetOwnPropertyNames(IS_OBJECT_PROTOTYPE ? ObjectPrototypeSymbols : toIndexedObject(O));
  var result = [];
  $forEach(names, function (key) {
    if (has(AllSymbols, key) && (!IS_OBJECT_PROTOTYPE || has(ObjectPrototype, key))) {
      result.push(AllSymbols[key]);
    }
  });
  return result;
};

// `Symbol` constructor
// https://tc39.github.io/ecma262/#sec-symbol-constructor
if (!NATIVE_SYMBOL) {
  $Symbol = function Symbol() {
    if (this instanceof $Symbol) throw TypeError('Symbol is not a constructor');
    var description = !arguments.length || arguments[0] === undefined ? undefined : String(arguments[0]);
    var tag = uid(description);
    var setter = function (value) {
      if (this === ObjectPrototype) setter.call(ObjectPrototypeSymbols, value);
      if (has(this, HIDDEN) && has(this[HIDDEN], tag)) this[HIDDEN][tag] = false;
      setSymbolDescriptor(this, tag, createPropertyDescriptor(1, value));
    };
    if (DESCRIPTORS && USE_SETTER) setSymbolDescriptor(ObjectPrototype, tag, { configurable: true, set: setter });
    return wrap(tag, description);
  };

  redefine($Symbol[PROTOTYPE], 'toString', function toString() {
    return getInternalState(this).tag;
  });

  redefine($Symbol, 'withoutSetter', function (description) {
    return wrap(uid(description), description);
  });

  propertyIsEnumerableModule.f = $propertyIsEnumerable;
  definePropertyModule.f = $defineProperty;
  getOwnPropertyDescriptorModule.f = $getOwnPropertyDescriptor;
  getOwnPropertyNamesModule.f = getOwnPropertyNamesExternal.f = $getOwnPropertyNames;
  getOwnPropertySymbolsModule.f = $getOwnPropertySymbols;

  wrappedWellKnownSymbolModule.f = function (name) {
    return wrap(wellKnownSymbol(name), name);
  };

  if (DESCRIPTORS) {
    // https://github.com/tc39/proposal-Symbol-description
    nativeDefineProperty($Symbol[PROTOTYPE], 'description', {
      configurable: true,
      get: function description() {
        return getInternalState(this).description;
      }
    });
    if (!IS_PURE) {
      redefine(ObjectPrototype, 'propertyIsEnumerable', $propertyIsEnumerable, { unsafe: true });
    }
  }
}

$({ global: true, wrap: true, forced: !NATIVE_SYMBOL, sham: !NATIVE_SYMBOL }, {
  Symbol: $Symbol
});

$forEach(objectKeys(WellKnownSymbolsStore), function (name) {
  defineWellKnownSymbol(name);
});

$({ target: SYMBOL, stat: true, forced: !NATIVE_SYMBOL }, {
  // `Symbol.for` method
  // https://tc39.github.io/ecma262/#sec-symbol.for
  'for': function (key) {
    var string = String(key);
    if (has(StringToSymbolRegistry, string)) return StringToSymbolRegistry[string];
    var symbol = $Symbol(string);
    StringToSymbolRegistry[string] = symbol;
    SymbolToStringRegistry[symbol] = string;
    return symbol;
  },
  // `Symbol.keyFor` method
  // https://tc39.github.io/ecma262/#sec-symbol.keyfor
  keyFor: function keyFor(sym) {
    if (!isSymbol(sym)) throw TypeError(sym + ' is not a symbol');
    if (has(SymbolToStringRegistry, sym)) return SymbolToStringRegistry[sym];
  },
  useSetter: function () { USE_SETTER = true; },
  useSimple: function () { USE_SETTER = false; }
});

$({ target: 'Object', stat: true, forced: !NATIVE_SYMBOL, sham: !DESCRIPTORS }, {
  // `Object.create` method
  // https://tc39.github.io/ecma262/#sec-object.create
  create: $create,
  // `Object.defineProperty` method
  // https://tc39.github.io/ecma262/#sec-object.defineproperty
  defineProperty: $defineProperty,
  // `Object.defineProperties` method
  // https://tc39.github.io/ecma262/#sec-object.defineproperties
  defineProperties: $defineProperties,
  // `Object.getOwnPropertyDescriptor` method
  // https://tc39.github.io/ecma262/#sec-object.getownpropertydescriptors
  getOwnPropertyDescriptor: $getOwnPropertyDescriptor
});

$({ target: 'Object', stat: true, forced: !NATIVE_SYMBOL }, {
  // `Object.getOwnPropertyNames` method
  // https://tc39.github.io/ecma262/#sec-object.getownpropertynames
  getOwnPropertyNames: $getOwnPropertyNames,
  // `Object.getOwnPropertySymbols` method
  // https://tc39.github.io/ecma262/#sec-object.getownpropertysymbols
  getOwnPropertySymbols: $getOwnPropertySymbols
});

// Chrome 38 and 39 `Object.getOwnPropertySymbols` fails on primitives
// https://bugs.chromium.org/p/v8/issues/detail?id=3443
$({ target: 'Object', stat: true, forced: fails(function () { getOwnPropertySymbolsModule.f(1); }) }, {
  getOwnPropertySymbols: function getOwnPropertySymbols(it) {
    return getOwnPropertySymbolsModule.f(toObject(it));
  }
});

// `JSON.stringify` method behavior with symbols
// https://tc39.github.io/ecma262/#sec-json.stringify
if ($stringify) {
  var FORCED_JSON_STRINGIFY = !NATIVE_SYMBOL || fails(function () {
    var symbol = $Symbol();
    // MS Edge converts symbol values to JSON as {}
    return $stringify([symbol]) != '[null]'
      // WebKit converts symbol values to JSON as null
      || $stringify({ a: symbol }) != '{}'
      // V8 throws on boxed symbols
      || $stringify(Object(symbol)) != '{}';
  });

  $({ target: 'JSON', stat: true, forced: FORCED_JSON_STRINGIFY }, {
    // eslint-disable-next-line no-unused-vars
    stringify: function stringify(it, replacer, space) {
      var args = [it];
      var index = 1;
      var $replacer;
      while (arguments.length > index) args.push(arguments[index++]);
      $replacer = replacer;
      if (!isObject(replacer) && it === undefined || isSymbol(it)) return; // IE8 returns string on undefined
      if (!isArray(replacer)) replacer = function (key, value) {
        if (typeof $replacer == 'function') value = $replacer.call(this, key, value);
        if (!isSymbol(value)) return value;
      };
      args[1] = replacer;
      return $stringify.apply(null, args);
    }
  });
}

// `Symbol.prototype[@@toPrimitive]` method
// https://tc39.github.io/ecma262/#sec-symbol.prototype-@@toprimitive
if (!$Symbol[PROTOTYPE][TO_PRIMITIVE]) {
  createNonEnumerableProperty($Symbol[PROTOTYPE], TO_PRIMITIVE, $Symbol[PROTOTYPE].valueOf);
}
// `Symbol.prototype[@@toStringTag]` property
// https://tc39.github.io/ecma262/#sec-symbol.prototype-@@tostringtag
setToStringTag($Symbol, SYMBOL);

hiddenKeys[HIDDEN] = true;


/***/ }),
/* 260 */
/***/ (function(module, exports, __webpack_require__) {

var toIndexedObject = __webpack_require__(149);
var nativeGetOwnPropertyNames = __webpack_require__(172).f;

var toString = {}.toString;

var windowNames = typeof window == 'object' && window && Object.getOwnPropertyNames
  ? Object.getOwnPropertyNames(window) : [];

var getWindowNames = function (it) {
  try {
    return nativeGetOwnPropertyNames(it);
  } catch (error) {
    return windowNames.slice();
  }
};

// fallback for IE11 buggy Object.getOwnPropertyNames with iframe and window
module.exports.f = function getOwnPropertyNames(it) {
  return windowNames && toString.call(it) == '[object Window]'
    ? getWindowNames(it)
    : nativeGetOwnPropertyNames(toIndexedObject(it));
};


/***/ }),
/* 261 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $ = __webpack_require__(136);
var $filter = __webpack_require__(158).filter;
var arrayMethodHasSpeciesSupport = __webpack_require__(186);
var arrayMethodUsesToLength = __webpack_require__(154);

var HAS_SPECIES_SUPPORT = arrayMethodHasSpeciesSupport('filter');
// Edge 14- issue
var USES_TO_LENGTH = arrayMethodUsesToLength('filter');

// `Array.prototype.filter` method
// https://tc39.github.io/ecma262/#sec-array.prototype.filter
// with adding support of @@species
$({ target: 'Array', proto: true, forced: !HAS_SPECIES_SUPPORT || !USES_TO_LENGTH }, {
  filter: function filter(callbackfn /* , thisArg */) {
    return $filter(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
  }
});


/***/ }),
/* 262 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $ = __webpack_require__(136);
var forEach = __webpack_require__(220);

// `Array.prototype.forEach` method
// https://tc39.github.io/ecma262/#sec-array.prototype.foreach
$({ target: 'Array', proto: true, forced: [].forEach != forEach }, {
  forEach: forEach
});


/***/ }),
/* 263 */
/***/ (function(module, exports, __webpack_require__) {

var $ = __webpack_require__(136);
var DESCRIPTORS = __webpack_require__(141);
var defineProperties = __webpack_require__(216);

// `Object.defineProperties` method
// https://tc39.github.io/ecma262/#sec-object.defineproperties
$({ target: 'Object', stat: true, forced: !DESCRIPTORS, sham: !DESCRIPTORS }, {
  defineProperties: defineProperties
});


/***/ }),
/* 264 */
/***/ (function(module, exports, __webpack_require__) {

var $ = __webpack_require__(136);
var DESCRIPTORS = __webpack_require__(141);
var objectDefinePropertyModile = __webpack_require__(144);

// `Object.defineProperty` method
// https://tc39.github.io/ecma262/#sec-object.defineproperty
$({ target: 'Object', stat: true, forced: !DESCRIPTORS, sham: !DESCRIPTORS }, {
  defineProperty: objectDefinePropertyModile.f
});


/***/ }),
/* 265 */
/***/ (function(module, exports, __webpack_require__) {

var $ = __webpack_require__(136);
var fails = __webpack_require__(138);
var toIndexedObject = __webpack_require__(149);
var nativeGetOwnPropertyDescriptor = __webpack_require__(152).f;
var DESCRIPTORS = __webpack_require__(141);

var FAILS_ON_PRIMITIVES = fails(function () { nativeGetOwnPropertyDescriptor(1); });
var FORCED = !DESCRIPTORS || FAILS_ON_PRIMITIVES;

// `Object.getOwnPropertyDescriptor` method
// https://tc39.github.io/ecma262/#sec-object.getownpropertydescriptor
$({ target: 'Object', stat: true, forced: FORCED, sham: !DESCRIPTORS }, {
  getOwnPropertyDescriptor: function getOwnPropertyDescriptor(it, key) {
    return nativeGetOwnPropertyDescriptor(toIndexedObject(it), key);
  }
});


/***/ }),
/* 266 */
/***/ (function(module, exports, __webpack_require__) {

var $ = __webpack_require__(136);
var DESCRIPTORS = __webpack_require__(141);
var ownKeys = __webpack_require__(205);
var toIndexedObject = __webpack_require__(149);
var getOwnPropertyDescriptorModule = __webpack_require__(152);
var createProperty = __webpack_require__(192);

// `Object.getOwnPropertyDescriptors` method
// https://tc39.github.io/ecma262/#sec-object.getownpropertydescriptors
$({ target: 'Object', stat: true, sham: !DESCRIPTORS }, {
  getOwnPropertyDescriptors: function getOwnPropertyDescriptors(object) {
    var O = toIndexedObject(object);
    var getOwnPropertyDescriptor = getOwnPropertyDescriptorModule.f;
    var keys = ownKeys(O);
    var result = {};
    var index = 0;
    var key, descriptor;
    while (keys.length > index) {
      descriptor = getOwnPropertyDescriptor(O, key = keys[index++]);
      if (descriptor !== undefined) createProperty(result, key, descriptor);
    }
    return result;
  }
});


/***/ }),
/* 267 */
/***/ (function(module, exports, __webpack_require__) {

var $ = __webpack_require__(136);
var toObject = __webpack_require__(151);
var nativeKeys = __webpack_require__(191);
var fails = __webpack_require__(138);

var FAILS_ON_PRIMITIVES = fails(function () { nativeKeys(1); });

// `Object.keys` method
// https://tc39.github.io/ecma262/#sec-object.keys
$({ target: 'Object', stat: true, forced: FAILS_ON_PRIMITIVES }, {
  keys: function keys(it) {
    return nativeKeys(toObject(it));
  }
});


/***/ }),
/* 268 */
/***/ (function(module, exports, __webpack_require__) {

var global = __webpack_require__(137);
var DOMIterables = __webpack_require__(221);
var forEach = __webpack_require__(220);
var createNonEnumerableProperty = __webpack_require__(146);

for (var COLLECTION_NAME in DOMIterables) {
  var Collection = global[COLLECTION_NAME];
  var CollectionPrototype = Collection && Collection.prototype;
  // some Chrome versions have non-configurable methods on DOMTokenList
  if (CollectionPrototype && CollectionPrototype.forEach !== forEach) try {
    createNonEnumerableProperty(CollectionPrototype, 'forEach', forEach);
  } catch (error) {
    CollectionPrototype.forEach = forEach;
  }
}


/***/ }),
/* 269 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(270);


/***/ }),
/* 270 */
/***/ (function(module, exports, __webpack_require__) {

/**
 * Copyright (c) 2014-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

var runtime = (function (exports) {
  "use strict";

  var Op = Object.prototype;
  var hasOwn = Op.hasOwnProperty;
  var undefined; // More compressible than void 0.
  var $Symbol = typeof Symbol === "function" ? Symbol : {};
  var iteratorSymbol = $Symbol.iterator || "@@iterator";
  var asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator";
  var toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag";

  function wrap(innerFn, outerFn, self, tryLocsList) {
    // If outerFn provided and outerFn.prototype is a Generator, then outerFn.prototype instanceof Generator.
    var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator;
    var generator = Object.create(protoGenerator.prototype);
    var context = new Context(tryLocsList || []);

    // The ._invoke method unifies the implementations of the .next,
    // .throw, and .return methods.
    generator._invoke = makeInvokeMethod(innerFn, self, context);

    return generator;
  }
  exports.wrap = wrap;

  // Try/catch helper to minimize deoptimizations. Returns a completion
  // record like context.tryEntries[i].completion. This interface could
  // have been (and was previously) designed to take a closure to be
  // invoked without arguments, but in all the cases we care about we
  // already have an existing method we want to call, so there's no need
  // to create a new function object. We can even get away with assuming
  // the method takes exactly one argument, since that happens to be true
  // in every case, so we don't have to touch the arguments object. The
  // only additional allocation required is the completion record, which
  // has a stable shape and so hopefully should be cheap to allocate.
  function tryCatch(fn, obj, arg) {
    try {
      return { type: "normal", arg: fn.call(obj, arg) };
    } catch (err) {
      return { type: "throw", arg: err };
    }
  }

  var GenStateSuspendedStart = "suspendedStart";
  var GenStateSuspendedYield = "suspendedYield";
  var GenStateExecuting = "executing";
  var GenStateCompleted = "completed";

  // Returning this object from the innerFn has the same effect as
  // breaking out of the dispatch switch statement.
  var ContinueSentinel = {};

  // Dummy constructor functions that we use as the .constructor and
  // .constructor.prototype properties for functions that return Generator
  // objects. For full spec compliance, you may wish to configure your
  // minifier not to mangle the names of these two functions.
  function Generator() {}
  function GeneratorFunction() {}
  function GeneratorFunctionPrototype() {}

  // This is a polyfill for %IteratorPrototype% for environments that
  // don't natively support it.
  var IteratorPrototype = {};
  IteratorPrototype[iteratorSymbol] = function () {
    return this;
  };

  var getProto = Object.getPrototypeOf;
  var NativeIteratorPrototype = getProto && getProto(getProto(values([])));
  if (NativeIteratorPrototype &&
      NativeIteratorPrototype !== Op &&
      hasOwn.call(NativeIteratorPrototype, iteratorSymbol)) {
    // This environment has a native %IteratorPrototype%; use it instead
    // of the polyfill.
    IteratorPrototype = NativeIteratorPrototype;
  }

  var Gp = GeneratorFunctionPrototype.prototype =
    Generator.prototype = Object.create(IteratorPrototype);
  GeneratorFunction.prototype = Gp.constructor = GeneratorFunctionPrototype;
  GeneratorFunctionPrototype.constructor = GeneratorFunction;
  GeneratorFunctionPrototype[toStringTagSymbol] =
    GeneratorFunction.displayName = "GeneratorFunction";

  // Helper for defining the .next, .throw, and .return methods of the
  // Iterator interface in terms of a single ._invoke method.
  function defineIteratorMethods(prototype) {
    ["next", "throw", "return"].forEach(function(method) {
      prototype[method] = function(arg) {
        return this._invoke(method, arg);
      };
    });
  }

  exports.isGeneratorFunction = function(genFun) {
    var ctor = typeof genFun === "function" && genFun.constructor;
    return ctor
      ? ctor === GeneratorFunction ||
        // For the native GeneratorFunction constructor, the best we can
        // do is to check its .name property.
        (ctor.displayName || ctor.name) === "GeneratorFunction"
      : false;
  };

  exports.mark = function(genFun) {
    if (Object.setPrototypeOf) {
      Object.setPrototypeOf(genFun, GeneratorFunctionPrototype);
    } else {
      genFun.__proto__ = GeneratorFunctionPrototype;
      if (!(toStringTagSymbol in genFun)) {
        genFun[toStringTagSymbol] = "GeneratorFunction";
      }
    }
    genFun.prototype = Object.create(Gp);
    return genFun;
  };

  // Within the body of any async function, `await x` is transformed to
  // `yield regeneratorRuntime.awrap(x)`, so that the runtime can test
  // `hasOwn.call(value, "__await")` to determine if the yielded value is
  // meant to be awaited.
  exports.awrap = function(arg) {
    return { __await: arg };
  };

  function AsyncIterator(generator, PromiseImpl) {
    function invoke(method, arg, resolve, reject) {
      var record = tryCatch(generator[method], generator, arg);
      if (record.type === "throw") {
        reject(record.arg);
      } else {
        var result = record.arg;
        var value = result.value;
        if (value &&
            typeof value === "object" &&
            hasOwn.call(value, "__await")) {
          return PromiseImpl.resolve(value.__await).then(function(value) {
            invoke("next", value, resolve, reject);
          }, function(err) {
            invoke("throw", err, resolve, reject);
          });
        }

        return PromiseImpl.resolve(value).then(function(unwrapped) {
          // When a yielded Promise is resolved, its final value becomes
          // the .value of the Promise<{value,done}> result for the
          // current iteration.
          result.value = unwrapped;
          resolve(result);
        }, function(error) {
          // If a rejected Promise was yielded, throw the rejection back
          // into the async generator function so it can be handled there.
          return invoke("throw", error, resolve, reject);
        });
      }
    }

    var previousPromise;

    function enqueue(method, arg) {
      function callInvokeWithMethodAndArg() {
        return new PromiseImpl(function(resolve, reject) {
          invoke(method, arg, resolve, reject);
        });
      }

      return previousPromise =
        // If enqueue has been called before, then we want to wait until
        // all previous Promises have been resolved before calling invoke,
        // so that results are always delivered in the correct order. If
        // enqueue has not been called before, then it is important to
        // call invoke immediately, without waiting on a callback to fire,
        // so that the async generator function has the opportunity to do
        // any necessary setup in a predictable way. This predictability
        // is why the Promise constructor synchronously invokes its
        // executor callback, and why async functions synchronously
        // execute code before the first await. Since we implement simple
        // async functions in terms of async generators, it is especially
        // important to get this right, even though it requires care.
        previousPromise ? previousPromise.then(
          callInvokeWithMethodAndArg,
          // Avoid propagating failures to Promises returned by later
          // invocations of the iterator.
          callInvokeWithMethodAndArg
        ) : callInvokeWithMethodAndArg();
    }

    // Define the unified helper method that is used to implement .next,
    // .throw, and .return (see defineIteratorMethods).
    this._invoke = enqueue;
  }

  defineIteratorMethods(AsyncIterator.prototype);
  AsyncIterator.prototype[asyncIteratorSymbol] = function () {
    return this;
  };
  exports.AsyncIterator = AsyncIterator;

  // Note that simple async functions are implemented on top of
  // AsyncIterator objects; they just return a Promise for the value of
  // the final result produced by the iterator.
  exports.async = function(innerFn, outerFn, self, tryLocsList, PromiseImpl) {
    if (PromiseImpl === void 0) PromiseImpl = Promise;

    var iter = new AsyncIterator(
      wrap(innerFn, outerFn, self, tryLocsList),
      PromiseImpl
    );

    return exports.isGeneratorFunction(outerFn)
      ? iter // If outerFn is a generator, return the full iterator.
      : iter.next().then(function(result) {
          return result.done ? result.value : iter.next();
        });
  };

  function makeInvokeMethod(innerFn, self, context) {
    var state = GenStateSuspendedStart;

    return function invoke(method, arg) {
      if (state === GenStateExecuting) {
        throw new Error("Generator is already running");
      }

      if (state === GenStateCompleted) {
        if (method === "throw") {
          throw arg;
        }

        // Be forgiving, per 25.3.3.3.3 of the spec:
        // https://people.mozilla.org/~jorendorff/es6-draft.html#sec-generatorresume
        return doneResult();
      }

      context.method = method;
      context.arg = arg;

      while (true) {
        var delegate = context.delegate;
        if (delegate) {
          var delegateResult = maybeInvokeDelegate(delegate, context);
          if (delegateResult) {
            if (delegateResult === ContinueSentinel) continue;
            return delegateResult;
          }
        }

        if (context.method === "next") {
          // Setting context._sent for legacy support of Babel's
          // function.sent implementation.
          context.sent = context._sent = context.arg;

        } else if (context.method === "throw") {
          if (state === GenStateSuspendedStart) {
            state = GenStateCompleted;
            throw context.arg;
          }

          context.dispatchException(context.arg);

        } else if (context.method === "return") {
          context.abrupt("return", context.arg);
        }

        state = GenStateExecuting;

        var record = tryCatch(innerFn, self, context);
        if (record.type === "normal") {
          // If an exception is thrown from innerFn, we leave state ===
          // GenStateExecuting and loop back for another invocation.
          state = context.done
            ? GenStateCompleted
            : GenStateSuspendedYield;

          if (record.arg === ContinueSentinel) {
            continue;
          }

          return {
            value: record.arg,
            done: context.done
          };

        } else if (record.type === "throw") {
          state = GenStateCompleted;
          // Dispatch the exception by looping back around to the
          // context.dispatchException(context.arg) call above.
          context.method = "throw";
          context.arg = record.arg;
        }
      }
    };
  }

  // Call delegate.iterator[context.method](context.arg) and handle the
  // result, either by returning a { value, done } result from the
  // delegate iterator, or by modifying context.method and context.arg,
  // setting context.delegate to null, and returning the ContinueSentinel.
  function maybeInvokeDelegate(delegate, context) {
    var method = delegate.iterator[context.method];
    if (method === undefined) {
      // A .throw or .return when the delegate iterator has no .throw
      // method always terminates the yield* loop.
      context.delegate = null;

      if (context.method === "throw") {
        // Note: ["return"] must be used for ES3 parsing compatibility.
        if (delegate.iterator["return"]) {
          // If the delegate iterator has a return method, give it a
          // chance to clean up.
          context.method = "return";
          context.arg = undefined;
          maybeInvokeDelegate(delegate, context);

          if (context.method === "throw") {
            // If maybeInvokeDelegate(context) changed context.method from
            // "return" to "throw", let that override the TypeError below.
            return ContinueSentinel;
          }
        }

        context.method = "throw";
        context.arg = new TypeError(
          "The iterator does not provide a 'throw' method");
      }

      return ContinueSentinel;
    }

    var record = tryCatch(method, delegate.iterator, context.arg);

    if (record.type === "throw") {
      context.method = "throw";
      context.arg = record.arg;
      context.delegate = null;
      return ContinueSentinel;
    }

    var info = record.arg;

    if (! info) {
      context.method = "throw";
      context.arg = new TypeError("iterator result is not an object");
      context.delegate = null;
      return ContinueSentinel;
    }

    if (info.done) {
      // Assign the result of the finished delegate to the temporary
      // variable specified by delegate.resultName (see delegateYield).
      context[delegate.resultName] = info.value;

      // Resume execution at the desired location (see delegateYield).
      context.next = delegate.nextLoc;

      // If context.method was "throw" but the delegate handled the
      // exception, let the outer generator proceed normally. If
      // context.method was "next", forget context.arg since it has been
      // "consumed" by the delegate iterator. If context.method was
      // "return", allow the original .return call to continue in the
      // outer generator.
      if (context.method !== "return") {
        context.method = "next";
        context.arg = undefined;
      }

    } else {
      // Re-yield the result returned by the delegate method.
      return info;
    }

    // The delegate iterator is finished, so forget it and continue with
    // the outer generator.
    context.delegate = null;
    return ContinueSentinel;
  }

  // Define Generator.prototype.{next,throw,return} in terms of the
  // unified ._invoke helper method.
  defineIteratorMethods(Gp);

  Gp[toStringTagSymbol] = "Generator";

  // A Generator should always return itself as the iterator object when the
  // @@iterator function is called on it. Some browsers' implementations of the
  // iterator prototype chain incorrectly implement this, causing the Generator
  // object to not be returned from this call. This ensures that doesn't happen.
  // See https://github.com/facebook/regenerator/issues/274 for more details.
  Gp[iteratorSymbol] = function() {
    return this;
  };

  Gp.toString = function() {
    return "[object Generator]";
  };

  function pushTryEntry(locs) {
    var entry = { tryLoc: locs[0] };

    if (1 in locs) {
      entry.catchLoc = locs[1];
    }

    if (2 in locs) {
      entry.finallyLoc = locs[2];
      entry.afterLoc = locs[3];
    }

    this.tryEntries.push(entry);
  }

  function resetTryEntry(entry) {
    var record = entry.completion || {};
    record.type = "normal";
    delete record.arg;
    entry.completion = record;
  }

  function Context(tryLocsList) {
    // The root entry object (effectively a try statement without a catch
    // or a finally block) gives us a place to store values thrown from
    // locations where there is no enclosing try statement.
    this.tryEntries = [{ tryLoc: "root" }];
    tryLocsList.forEach(pushTryEntry, this);
    this.reset(true);
  }

  exports.keys = function(object) {
    var keys = [];
    for (var key in object) {
      keys.push(key);
    }
    keys.reverse();

    // Rather than returning an object with a next method, we keep
    // things simple and return the next function itself.
    return function next() {
      while (keys.length) {
        var key = keys.pop();
        if (key in object) {
          next.value = key;
          next.done = false;
          return next;
        }
      }

      // To avoid creating an additional object, we just hang the .value
      // and .done properties off the next function object itself. This
      // also ensures that the minifier will not anonymize the function.
      next.done = true;
      return next;
    };
  };

  function values(iterable) {
    if (iterable) {
      var iteratorMethod = iterable[iteratorSymbol];
      if (iteratorMethod) {
        return iteratorMethod.call(iterable);
      }

      if (typeof iterable.next === "function") {
        return iterable;
      }

      if (!isNaN(iterable.length)) {
        var i = -1, next = function next() {
          while (++i < iterable.length) {
            if (hasOwn.call(iterable, i)) {
              next.value = iterable[i];
              next.done = false;
              return next;
            }
          }

          next.value = undefined;
          next.done = true;

          return next;
        };

        return next.next = next;
      }
    }

    // Return an iterator with no values.
    return { next: doneResult };
  }
  exports.values = values;

  function doneResult() {
    return { value: undefined, done: true };
  }

  Context.prototype = {
    constructor: Context,

    reset: function(skipTempReset) {
      this.prev = 0;
      this.next = 0;
      // Resetting context._sent for legacy support of Babel's
      // function.sent implementation.
      this.sent = this._sent = undefined;
      this.done = false;
      this.delegate = null;

      this.method = "next";
      this.arg = undefined;

      this.tryEntries.forEach(resetTryEntry);

      if (!skipTempReset) {
        for (var name in this) {
          // Not sure about the optimal order of these conditions:
          if (name.charAt(0) === "t" &&
              hasOwn.call(this, name) &&
              !isNaN(+name.slice(1))) {
            this[name] = undefined;
          }
        }
      }
    },

    stop: function() {
      this.done = true;

      var rootEntry = this.tryEntries[0];
      var rootRecord = rootEntry.completion;
      if (rootRecord.type === "throw") {
        throw rootRecord.arg;
      }

      return this.rval;
    },

    dispatchException: function(exception) {
      if (this.done) {
        throw exception;
      }

      var context = this;
      function handle(loc, caught) {
        record.type = "throw";
        record.arg = exception;
        context.next = loc;

        if (caught) {
          // If the dispatched exception was caught by a catch block,
          // then let that catch block handle the exception normally.
          context.method = "next";
          context.arg = undefined;
        }

        return !! caught;
      }

      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        var record = entry.completion;

        if (entry.tryLoc === "root") {
          // Exception thrown outside of any try block that could handle
          // it, so set the completion value of the entire function to
          // throw the exception.
          return handle("end");
        }

        if (entry.tryLoc <= this.prev) {
          var hasCatch = hasOwn.call(entry, "catchLoc");
          var hasFinally = hasOwn.call(entry, "finallyLoc");

          if (hasCatch && hasFinally) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            } else if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }

          } else if (hasCatch) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            }

          } else if (hasFinally) {
            if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }

          } else {
            throw new Error("try statement without catch or finally");
          }
        }
      }
    },

    abrupt: function(type, arg) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc <= this.prev &&
            hasOwn.call(entry, "finallyLoc") &&
            this.prev < entry.finallyLoc) {
          var finallyEntry = entry;
          break;
        }
      }

      if (finallyEntry &&
          (type === "break" ||
           type === "continue") &&
          finallyEntry.tryLoc <= arg &&
          arg <= finallyEntry.finallyLoc) {
        // Ignore the finally entry if control is not jumping to a
        // location outside the try/catch block.
        finallyEntry = null;
      }

      var record = finallyEntry ? finallyEntry.completion : {};
      record.type = type;
      record.arg = arg;

      if (finallyEntry) {
        this.method = "next";
        this.next = finallyEntry.finallyLoc;
        return ContinueSentinel;
      }

      return this.complete(record);
    },

    complete: function(record, afterLoc) {
      if (record.type === "throw") {
        throw record.arg;
      }

      if (record.type === "break" ||
          record.type === "continue") {
        this.next = record.arg;
      } else if (record.type === "return") {
        this.rval = this.arg = record.arg;
        this.method = "return";
        this.next = "end";
      } else if (record.type === "normal" && afterLoc) {
        this.next = afterLoc;
      }

      return ContinueSentinel;
    },

    finish: function(finallyLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.finallyLoc === finallyLoc) {
          this.complete(entry.completion, entry.afterLoc);
          resetTryEntry(entry);
          return ContinueSentinel;
        }
      }
    },

    "catch": function(tryLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc === tryLoc) {
          var record = entry.completion;
          if (record.type === "throw") {
            var thrown = record.arg;
            resetTryEntry(entry);
          }
          return thrown;
        }
      }

      // The context.catch method must only be called with a location
      // argument that corresponds to a known catch block.
      throw new Error("illegal catch attempt");
    },

    delegateYield: function(iterable, resultName, nextLoc) {
      this.delegate = {
        iterator: values(iterable),
        resultName: resultName,
        nextLoc: nextLoc
      };

      if (this.method === "next") {
        // Deliberately forget the last sent value so that we don't
        // accidentally pass it on to the delegate.
        this.arg = undefined;
      }

      return ContinueSentinel;
    }
  };

  // Regardless of whether this script is executing as a CommonJS module
  // or not, return the runtime object so that we can declare the variable
  // regeneratorRuntime in the outer scope, which allows this module to be
  // injected easily by `bin/regenerator --include-runtime script.js`.
  return exports;

}(
  // If this script is executing as a CommonJS module, use module.exports
  // as the regeneratorRuntime namespace. Otherwise create a new empty
  // object. Either way, the resulting object will be used to initialize
  // the regeneratorRuntime variable at the top of this file.
   true ? module.exports : undefined
));

try {
  regeneratorRuntime = runtime;
} catch (accidentalStrictMode) {
  // This module should not be running in strict mode, so the above
  // assignment should always work unless something is misconfigured. Just
  // in case runtime.js accidentally runs in strict mode, we can escape
  // strict mode using a global Function call. This could conceivably fail
  // if a Content Security Policy forbids using Function, but in that case
  // the proper solution is to fix the accidental strict mode problem. If
  // you've misconfigured your bundler to force strict mode and applied a
  // CSP to forbid Function, and you're not willing to fix either of those
  // problems, please detail your unique predicament in a GitHub issue.
  Function("r", "regeneratorRuntime = r")(runtime);
}


/***/ }),
/* 271 */
/***/ (function(module, exports) {

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
  try {
    var info = gen[key](arg);
    var value = info.value;
  } catch (error) {
    reject(error);
    return;
  }

  if (info.done) {
    resolve(value);
  } else {
    Promise.resolve(value).then(_next, _throw);
  }
}

function _asyncToGenerator(fn) {
  return function () {
    var self = this,
        args = arguments;
    return new Promise(function (resolve, reject) {
      var gen = fn.apply(self, args);

      function _next(value) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
      }

      function _throw(err) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
      }

      _next(undefined);
    });
  };
}

module.exports = _asyncToGenerator;

/***/ }),
/* 272 */
/***/ (function(module, exports) {

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

module.exports = _defineProperty;

/***/ }),
/* 273 */
/***/ (function(module, exports) {

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

module.exports = _classCallCheck;

/***/ }),
/* 274 */
/***/ (function(module, exports) {

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
}

module.exports = _createClass;

/***/ }),
/* 275 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $ = __webpack_require__(136);
var fails = __webpack_require__(138);
var isArray = __webpack_require__(175);
var isObject = __webpack_require__(142);
var toObject = __webpack_require__(151);
var toLength = __webpack_require__(147);
var createProperty = __webpack_require__(192);
var arraySpeciesCreate = __webpack_require__(210);
var arrayMethodHasSpeciesSupport = __webpack_require__(186);
var wellKnownSymbol = __webpack_require__(139);
var V8_VERSION = __webpack_require__(187);

var IS_CONCAT_SPREADABLE = wellKnownSymbol('isConcatSpreadable');
var MAX_SAFE_INTEGER = 0x1FFFFFFFFFFFFF;
var MAXIMUM_ALLOWED_INDEX_EXCEEDED = 'Maximum allowed index exceeded';

// We can't use this feature detection in V8 since it causes
// deoptimization and serious performance degradation
// https://github.com/zloirock/core-js/issues/679
var IS_CONCAT_SPREADABLE_SUPPORT = V8_VERSION >= 51 || !fails(function () {
  var array = [];
  array[IS_CONCAT_SPREADABLE] = false;
  return array.concat()[0] !== array;
});

var SPECIES_SUPPORT = arrayMethodHasSpeciesSupport('concat');

var isConcatSpreadable = function (O) {
  if (!isObject(O)) return false;
  var spreadable = O[IS_CONCAT_SPREADABLE];
  return spreadable !== undefined ? !!spreadable : isArray(O);
};

var FORCED = !IS_CONCAT_SPREADABLE_SUPPORT || !SPECIES_SUPPORT;

// `Array.prototype.concat` method
// https://tc39.github.io/ecma262/#sec-array.prototype.concat
// with adding support of @@isConcatSpreadable and @@species
$({ target: 'Array', proto: true, forced: FORCED }, {
  concat: function concat(arg) { // eslint-disable-line no-unused-vars
    var O = toObject(this);
    var A = arraySpeciesCreate(O, 0);
    var n = 0;
    var i, k, length, len, E;
    for (i = -1, length = arguments.length; i < length; i++) {
      E = i === -1 ? O : arguments[i];
      if (isConcatSpreadable(E)) {
        len = toLength(E.length);
        if (n + len > MAX_SAFE_INTEGER) throw TypeError(MAXIMUM_ALLOWED_INDEX_EXCEEDED);
        for (k = 0; k < len; k++, n++) if (k in E) createProperty(A, n, E[k]);
      } else {
        if (n >= MAX_SAFE_INTEGER) throw TypeError(MAXIMUM_ALLOWED_INDEX_EXCEEDED);
        createProperty(A, n++, E);
      }
    }
    A.length = n;
    return A;
  }
});


/***/ }),
/* 276 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $ = __webpack_require__(136);
var $every = __webpack_require__(158).every;
var arrayMethodIsStrict = __webpack_require__(160);
var arrayMethodUsesToLength = __webpack_require__(154);

var STRICT_METHOD = arrayMethodIsStrict('every');
var USES_TO_LENGTH = arrayMethodUsesToLength('every');

// `Array.prototype.every` method
// https://tc39.github.io/ecma262/#sec-array.prototype.every
$({ target: 'Array', proto: true, forced: !STRICT_METHOD || !USES_TO_LENGTH }, {
  every: function every(callbackfn /* , thisArg */) {
    return $every(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
  }
});


/***/ }),
/* 277 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $ = __webpack_require__(136);
var $reduce = __webpack_require__(278).left;
var arrayMethodIsStrict = __webpack_require__(160);
var arrayMethodUsesToLength = __webpack_require__(154);

var STRICT_METHOD = arrayMethodIsStrict('reduce');
var USES_TO_LENGTH = arrayMethodUsesToLength('reduce', { 1: 0 });

// `Array.prototype.reduce` method
// https://tc39.github.io/ecma262/#sec-array.prototype.reduce
$({ target: 'Array', proto: true, forced: !STRICT_METHOD || !USES_TO_LENGTH }, {
  reduce: function reduce(callbackfn /* , initialValue */) {
    return $reduce(this, callbackfn, arguments.length, arguments.length > 1 ? arguments[1] : undefined);
  }
});


/***/ }),
/* 278 */
/***/ (function(module, exports, __webpack_require__) {

var aFunction = __webpack_require__(159);
var toObject = __webpack_require__(151);
var IndexedObject = __webpack_require__(169);
var toLength = __webpack_require__(147);

// `Array.prototype.{ reduce, reduceRight }` methods implementation
var createMethod = function (IS_RIGHT) {
  return function (that, callbackfn, argumentsLength, memo) {
    aFunction(callbackfn);
    var O = toObject(that);
    var self = IndexedObject(O);
    var length = toLength(O.length);
    var index = IS_RIGHT ? length - 1 : 0;
    var i = IS_RIGHT ? -1 : 1;
    if (argumentsLength < 2) while (true) {
      if (index in self) {
        memo = self[index];
        index += i;
        break;
      }
      index += i;
      if (IS_RIGHT ? index < 0 : length <= index) {
        throw TypeError('Reduce of empty array with no initial value');
      }
    }
    for (;IS_RIGHT ? index >= 0 : length > index; index += i) if (index in self) {
      memo = callbackfn(memo, self[index], index, O);
    }
    return memo;
  };
};

module.exports = {
  // `Array.prototype.reduce` method
  // https://tc39.github.io/ecma262/#sec-array.prototype.reduce
  left: createMethod(false),
  // `Array.prototype.reduceRight` method
  // https://tc39.github.io/ecma262/#sec-array.prototype.reduceright
  right: createMethod(true)
};


/***/ }),
/* 279 */
/***/ (function(module, exports, __webpack_require__) {

var redefine = __webpack_require__(145);

var DatePrototype = Date.prototype;
var INVALID_DATE = 'Invalid Date';
var TO_STRING = 'toString';
var nativeDateToString = DatePrototype[TO_STRING];
var getTime = DatePrototype.getTime;

// `Date.prototype.toString` method
// https://tc39.github.io/ecma262/#sec-date.prototype.tostring
if (new Date(NaN) + '' != INVALID_DATE) {
  redefine(DatePrototype, TO_STRING, function toString() {
    var value = getTime.call(this);
    // eslint-disable-next-line no-self-compare
    return value === value ? nativeDateToString.call(this) : INVALID_DATE;
  });
}


/***/ }),
/* 280 */
/***/ (function(module, exports, __webpack_require__) {

var TO_STRING_TAG_SUPPORT = __webpack_require__(193);
var redefine = __webpack_require__(145);
var toString = __webpack_require__(281);

// `Object.prototype.toString` method
// https://tc39.github.io/ecma262/#sec-object.prototype.tostring
if (!TO_STRING_TAG_SUPPORT) {
  redefine(Object.prototype, 'toString', toString, { unsafe: true });
}


/***/ }),
/* 281 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var TO_STRING_TAG_SUPPORT = __webpack_require__(193);
var classof = __webpack_require__(222);

// `Object.prototype.toString` method implementation
// https://tc39.github.io/ecma262/#sec-object.prototype.tostring
module.exports = TO_STRING_TAG_SUPPORT ? {}.toString : function toString() {
  return '[object ' + classof(this) + ']';
};


/***/ }),
/* 282 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $ = __webpack_require__(136);
var IS_PURE = __webpack_require__(163);
var global = __webpack_require__(137);
var getBuiltIn = __webpack_require__(155);
var NativePromise = __webpack_require__(283);
var redefine = __webpack_require__(145);
var redefineAll = __webpack_require__(223);
var setToStringTag = __webpack_require__(167);
var setSpecies = __webpack_require__(224);
var isObject = __webpack_require__(142);
var aFunction = __webpack_require__(159);
var anInstance = __webpack_require__(194);
var classof = __webpack_require__(150);
var inspectSource = __webpack_require__(181);
var iterate = __webpack_require__(195);
var checkCorrectnessOfIteration = __webpack_require__(196);
var speciesConstructor = __webpack_require__(228);
var task = __webpack_require__(229).set;
var microtask = __webpack_require__(284);
var promiseResolve = __webpack_require__(285);
var hostReportErrors = __webpack_require__(286);
var newPromiseCapabilityModule = __webpack_require__(231);
var perform = __webpack_require__(287);
var InternalStateModule = __webpack_require__(157);
var isForced = __webpack_require__(174);
var wellKnownSymbol = __webpack_require__(139);
var V8_VERSION = __webpack_require__(187);

var SPECIES = wellKnownSymbol('species');
var PROMISE = 'Promise';
var getInternalState = InternalStateModule.get;
var setInternalState = InternalStateModule.set;
var getInternalPromiseState = InternalStateModule.getterFor(PROMISE);
var PromiseConstructor = NativePromise;
var TypeError = global.TypeError;
var document = global.document;
var process = global.process;
var $fetch = getBuiltIn('fetch');
var newPromiseCapability = newPromiseCapabilityModule.f;
var newGenericPromiseCapability = newPromiseCapability;
var IS_NODE = classof(process) == 'process';
var DISPATCH_EVENT = !!(document && document.createEvent && global.dispatchEvent);
var UNHANDLED_REJECTION = 'unhandledrejection';
var REJECTION_HANDLED = 'rejectionhandled';
var PENDING = 0;
var FULFILLED = 1;
var REJECTED = 2;
var HANDLED = 1;
var UNHANDLED = 2;
var Internal, OwnPromiseCapability, PromiseWrapper, nativeThen;

var FORCED = isForced(PROMISE, function () {
  var GLOBAL_CORE_JS_PROMISE = inspectSource(PromiseConstructor) !== String(PromiseConstructor);
  if (!GLOBAL_CORE_JS_PROMISE) {
    // V8 6.6 (Node 10 and Chrome 66) have a bug with resolving custom thenables
    // https://bugs.chromium.org/p/chromium/issues/detail?id=830565
    // We can't detect it synchronously, so just check versions
    if (V8_VERSION === 66) return true;
    // Unhandled rejections tracking support, NodeJS Promise without it fails @@species test
    if (!IS_NODE && typeof PromiseRejectionEvent != 'function') return true;
  }
  // We need Promise#finally in the pure version for preventing prototype pollution
  if (IS_PURE && !PromiseConstructor.prototype['finally']) return true;
  // We can't use @@species feature detection in V8 since it causes
  // deoptimization and performance degradation
  // https://github.com/zloirock/core-js/issues/679
  if (V8_VERSION >= 51 && /native code/.test(PromiseConstructor)) return false;
  // Detect correctness of subclassing with @@species support
  var promise = PromiseConstructor.resolve(1);
  var FakePromise = function (exec) {
    exec(function () { /* empty */ }, function () { /* empty */ });
  };
  var constructor = promise.constructor = {};
  constructor[SPECIES] = FakePromise;
  return !(promise.then(function () { /* empty */ }) instanceof FakePromise);
});

var INCORRECT_ITERATION = FORCED || !checkCorrectnessOfIteration(function (iterable) {
  PromiseConstructor.all(iterable)['catch'](function () { /* empty */ });
});

// helpers
var isThenable = function (it) {
  var then;
  return isObject(it) && typeof (then = it.then) == 'function' ? then : false;
};

var notify = function (promise, state, isReject) {
  if (state.notified) return;
  state.notified = true;
  var chain = state.reactions;
  microtask(function () {
    var value = state.value;
    var ok = state.state == FULFILLED;
    var index = 0;
    // variable length - can't use forEach
    while (chain.length > index) {
      var reaction = chain[index++];
      var handler = ok ? reaction.ok : reaction.fail;
      var resolve = reaction.resolve;
      var reject = reaction.reject;
      var domain = reaction.domain;
      var result, then, exited;
      try {
        if (handler) {
          if (!ok) {
            if (state.rejection === UNHANDLED) onHandleUnhandled(promise, state);
            state.rejection = HANDLED;
          }
          if (handler === true) result = value;
          else {
            if (domain) domain.enter();
            result = handler(value); // can throw
            if (domain) {
              domain.exit();
              exited = true;
            }
          }
          if (result === reaction.promise) {
            reject(TypeError('Promise-chain cycle'));
          } else if (then = isThenable(result)) {
            then.call(result, resolve, reject);
          } else resolve(result);
        } else reject(value);
      } catch (error) {
        if (domain && !exited) domain.exit();
        reject(error);
      }
    }
    state.reactions = [];
    state.notified = false;
    if (isReject && !state.rejection) onUnhandled(promise, state);
  });
};

var dispatchEvent = function (name, promise, reason) {
  var event, handler;
  if (DISPATCH_EVENT) {
    event = document.createEvent('Event');
    event.promise = promise;
    event.reason = reason;
    event.initEvent(name, false, true);
    global.dispatchEvent(event);
  } else event = { promise: promise, reason: reason };
  if (handler = global['on' + name]) handler(event);
  else if (name === UNHANDLED_REJECTION) hostReportErrors('Unhandled promise rejection', reason);
};

var onUnhandled = function (promise, state) {
  task.call(global, function () {
    var value = state.value;
    var IS_UNHANDLED = isUnhandled(state);
    var result;
    if (IS_UNHANDLED) {
      result = perform(function () {
        if (IS_NODE) {
          process.emit('unhandledRejection', value, promise);
        } else dispatchEvent(UNHANDLED_REJECTION, promise, value);
      });
      // Browsers should not trigger `rejectionHandled` event if it was handled here, NodeJS - should
      state.rejection = IS_NODE || isUnhandled(state) ? UNHANDLED : HANDLED;
      if (result.error) throw result.value;
    }
  });
};

var isUnhandled = function (state) {
  return state.rejection !== HANDLED && !state.parent;
};

var onHandleUnhandled = function (promise, state) {
  task.call(global, function () {
    if (IS_NODE) {
      process.emit('rejectionHandled', promise);
    } else dispatchEvent(REJECTION_HANDLED, promise, state.value);
  });
};

var bind = function (fn, promise, state, unwrap) {
  return function (value) {
    fn(promise, state, value, unwrap);
  };
};

var internalReject = function (promise, state, value, unwrap) {
  if (state.done) return;
  state.done = true;
  if (unwrap) state = unwrap;
  state.value = value;
  state.state = REJECTED;
  notify(promise, state, true);
};

var internalResolve = function (promise, state, value, unwrap) {
  if (state.done) return;
  state.done = true;
  if (unwrap) state = unwrap;
  try {
    if (promise === value) throw TypeError("Promise can't be resolved itself");
    var then = isThenable(value);
    if (then) {
      microtask(function () {
        var wrapper = { done: false };
        try {
          then.call(value,
            bind(internalResolve, promise, wrapper, state),
            bind(internalReject, promise, wrapper, state)
          );
        } catch (error) {
          internalReject(promise, wrapper, error, state);
        }
      });
    } else {
      state.value = value;
      state.state = FULFILLED;
      notify(promise, state, false);
    }
  } catch (error) {
    internalReject(promise, { done: false }, error, state);
  }
};

// constructor polyfill
if (FORCED) {
  // 25.4.3.1 Promise(executor)
  PromiseConstructor = function Promise(executor) {
    anInstance(this, PromiseConstructor, PROMISE);
    aFunction(executor);
    Internal.call(this);
    var state = getInternalState(this);
    try {
      executor(bind(internalResolve, this, state), bind(internalReject, this, state));
    } catch (error) {
      internalReject(this, state, error);
    }
  };
  // eslint-disable-next-line no-unused-vars
  Internal = function Promise(executor) {
    setInternalState(this, {
      type: PROMISE,
      done: false,
      notified: false,
      parent: false,
      reactions: [],
      rejection: false,
      state: PENDING,
      value: undefined
    });
  };
  Internal.prototype = redefineAll(PromiseConstructor.prototype, {
    // `Promise.prototype.then` method
    // https://tc39.github.io/ecma262/#sec-promise.prototype.then
    then: function then(onFulfilled, onRejected) {
      var state = getInternalPromiseState(this);
      var reaction = newPromiseCapability(speciesConstructor(this, PromiseConstructor));
      reaction.ok = typeof onFulfilled == 'function' ? onFulfilled : true;
      reaction.fail = typeof onRejected == 'function' && onRejected;
      reaction.domain = IS_NODE ? process.domain : undefined;
      state.parent = true;
      state.reactions.push(reaction);
      if (state.state != PENDING) notify(this, state, false);
      return reaction.promise;
    },
    // `Promise.prototype.catch` method
    // https://tc39.github.io/ecma262/#sec-promise.prototype.catch
    'catch': function (onRejected) {
      return this.then(undefined, onRejected);
    }
  });
  OwnPromiseCapability = function () {
    var promise = new Internal();
    var state = getInternalState(promise);
    this.promise = promise;
    this.resolve = bind(internalResolve, promise, state);
    this.reject = bind(internalReject, promise, state);
  };
  newPromiseCapabilityModule.f = newPromiseCapability = function (C) {
    return C === PromiseConstructor || C === PromiseWrapper
      ? new OwnPromiseCapability(C)
      : newGenericPromiseCapability(C);
  };

  if (!IS_PURE && typeof NativePromise == 'function') {
    nativeThen = NativePromise.prototype.then;

    // wrap native Promise#then for native async functions
    redefine(NativePromise.prototype, 'then', function then(onFulfilled, onRejected) {
      var that = this;
      return new PromiseConstructor(function (resolve, reject) {
        nativeThen.call(that, resolve, reject);
      }).then(onFulfilled, onRejected);
    // https://github.com/zloirock/core-js/issues/640
    }, { unsafe: true });

    // wrap fetch result
    if (typeof $fetch == 'function') $({ global: true, enumerable: true, forced: true }, {
      // eslint-disable-next-line no-unused-vars
      fetch: function fetch(input /* , init */) {
        return promiseResolve(PromiseConstructor, $fetch.apply(global, arguments));
      }
    });
  }
}

$({ global: true, wrap: true, forced: FORCED }, {
  Promise: PromiseConstructor
});

setToStringTag(PromiseConstructor, PROMISE, false, true);
setSpecies(PROMISE);

PromiseWrapper = getBuiltIn(PROMISE);

// statics
$({ target: PROMISE, stat: true, forced: FORCED }, {
  // `Promise.reject` method
  // https://tc39.github.io/ecma262/#sec-promise.reject
  reject: function reject(r) {
    var capability = newPromiseCapability(this);
    capability.reject.call(undefined, r);
    return capability.promise;
  }
});

$({ target: PROMISE, stat: true, forced: IS_PURE || FORCED }, {
  // `Promise.resolve` method
  // https://tc39.github.io/ecma262/#sec-promise.resolve
  resolve: function resolve(x) {
    return promiseResolve(IS_PURE && this === PromiseWrapper ? PromiseConstructor : this, x);
  }
});

$({ target: PROMISE, stat: true, forced: INCORRECT_ITERATION }, {
  // `Promise.all` method
  // https://tc39.github.io/ecma262/#sec-promise.all
  all: function all(iterable) {
    var C = this;
    var capability = newPromiseCapability(C);
    var resolve = capability.resolve;
    var reject = capability.reject;
    var result = perform(function () {
      var $promiseResolve = aFunction(C.resolve);
      var values = [];
      var counter = 0;
      var remaining = 1;
      iterate(iterable, function (promise) {
        var index = counter++;
        var alreadyCalled = false;
        values.push(undefined);
        remaining++;
        $promiseResolve.call(C, promise).then(function (value) {
          if (alreadyCalled) return;
          alreadyCalled = true;
          values[index] = value;
          --remaining || resolve(values);
        }, reject);
      });
      --remaining || resolve(values);
    });
    if (result.error) reject(result.value);
    return capability.promise;
  },
  // `Promise.race` method
  // https://tc39.github.io/ecma262/#sec-promise.race
  race: function race(iterable) {
    var C = this;
    var capability = newPromiseCapability(C);
    var reject = capability.reject;
    var result = perform(function () {
      var $promiseResolve = aFunction(C.resolve);
      iterate(iterable, function (promise) {
        $promiseResolve.call(C, promise).then(capability.resolve, reject);
      });
    });
    if (result.error) reject(result.value);
    return capability.promise;
  }
});


/***/ }),
/* 283 */
/***/ (function(module, exports, __webpack_require__) {

var global = __webpack_require__(137);

module.exports = global.Promise;


/***/ }),
/* 284 */
/***/ (function(module, exports, __webpack_require__) {

var global = __webpack_require__(137);
var getOwnPropertyDescriptor = __webpack_require__(152).f;
var classof = __webpack_require__(150);
var macrotask = __webpack_require__(229).set;
var IS_IOS = __webpack_require__(230);

var MutationObserver = global.MutationObserver || global.WebKitMutationObserver;
var process = global.process;
var Promise = global.Promise;
var IS_NODE = classof(process) == 'process';
// Node.js 11 shows ExperimentalWarning on getting `queueMicrotask`
var queueMicrotaskDescriptor = getOwnPropertyDescriptor(global, 'queueMicrotask');
var queueMicrotask = queueMicrotaskDescriptor && queueMicrotaskDescriptor.value;

var flush, head, last, notify, toggle, node, promise, then;

// modern engines have queueMicrotask method
if (!queueMicrotask) {
  flush = function () {
    var parent, fn;
    if (IS_NODE && (parent = process.domain)) parent.exit();
    while (head) {
      fn = head.fn;
      head = head.next;
      try {
        fn();
      } catch (error) {
        if (head) notify();
        else last = undefined;
        throw error;
      }
    } last = undefined;
    if (parent) parent.enter();
  };

  // Node.js
  if (IS_NODE) {
    notify = function () {
      process.nextTick(flush);
    };
  // browsers with MutationObserver, except iOS - https://github.com/zloirock/core-js/issues/339
  } else if (MutationObserver && !IS_IOS) {
    toggle = true;
    node = document.createTextNode('');
    new MutationObserver(flush).observe(node, { characterData: true });
    notify = function () {
      node.data = toggle = !toggle;
    };
  // environments with maybe non-completely correct, but existent Promise
  } else if (Promise && Promise.resolve) {
    // Promise.resolve without an argument throws an error in LG WebOS 2
    promise = Promise.resolve(undefined);
    then = promise.then;
    notify = function () {
      then.call(promise, flush);
    };
  // for other environments - macrotask based on:
  // - setImmediate
  // - MessageChannel
  // - window.postMessag
  // - onreadystatechange
  // - setTimeout
  } else {
    notify = function () {
      // strange IE + webpack dev server bug - use .call(global)
      macrotask.call(global, flush);
    };
  }
}

module.exports = queueMicrotask || function (fn) {
  var task = { fn: fn, next: undefined };
  if (last) last.next = task;
  if (!head) {
    head = task;
    notify();
  } last = task;
};


/***/ }),
/* 285 */
/***/ (function(module, exports, __webpack_require__) {

var anObject = __webpack_require__(140);
var isObject = __webpack_require__(142);
var newPromiseCapability = __webpack_require__(231);

module.exports = function (C, x) {
  anObject(C);
  if (isObject(x) && x.constructor === C) return x;
  var promiseCapability = newPromiseCapability.f(C);
  var resolve = promiseCapability.resolve;
  resolve(x);
  return promiseCapability.promise;
};


/***/ }),
/* 286 */
/***/ (function(module, exports, __webpack_require__) {

var global = __webpack_require__(137);

module.exports = function (a, b) {
  var console = global.console;
  if (console && console.error) {
    arguments.length === 1 ? console.error(a) : console.error(a, b);
  }
};


/***/ }),
/* 287 */
/***/ (function(module, exports) {

module.exports = function (exec) {
  try {
    return { error: false, value: exec() };
  } catch (error) {
    return { error: true, value: error };
  }
};


/***/ }),
/* 288 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var fixRegExpWellKnownSymbolLogic = __webpack_require__(188);
var isRegExp = __webpack_require__(232);
var anObject = __webpack_require__(140);
var requireObjectCoercible = __webpack_require__(153);
var speciesConstructor = __webpack_require__(228);
var advanceStringIndex = __webpack_require__(189);
var toLength = __webpack_require__(147);
var callRegExpExec = __webpack_require__(190);
var regexpExec = __webpack_require__(178);
var fails = __webpack_require__(138);

var arrayPush = [].push;
var min = Math.min;
var MAX_UINT32 = 0xFFFFFFFF;

// babel-minify transpiles RegExp('x', 'y') -> /x/y and it causes SyntaxError
var SUPPORTS_Y = !fails(function () { return !RegExp(MAX_UINT32, 'y'); });

// @@split logic
fixRegExpWellKnownSymbolLogic('split', 2, function (SPLIT, nativeSplit, maybeCallNative) {
  var internalSplit;
  if (
    'abbc'.split(/(b)*/)[1] == 'c' ||
    'test'.split(/(?:)/, -1).length != 4 ||
    'ab'.split(/(?:ab)*/).length != 2 ||
    '.'.split(/(.?)(.?)/).length != 4 ||
    '.'.split(/()()/).length > 1 ||
    ''.split(/.?/).length
  ) {
    // based on es5-shim implementation, need to rework it
    internalSplit = function (separator, limit) {
      var string = String(requireObjectCoercible(this));
      var lim = limit === undefined ? MAX_UINT32 : limit >>> 0;
      if (lim === 0) return [];
      if (separator === undefined) return [string];
      // If `separator` is not a regex, use native split
      if (!isRegExp(separator)) {
        return nativeSplit.call(string, separator, lim);
      }
      var output = [];
      var flags = (separator.ignoreCase ? 'i' : '') +
                  (separator.multiline ? 'm' : '') +
                  (separator.unicode ? 'u' : '') +
                  (separator.sticky ? 'y' : '');
      var lastLastIndex = 0;
      // Make `global` and avoid `lastIndex` issues by working with a copy
      var separatorCopy = new RegExp(separator.source, flags + 'g');
      var match, lastIndex, lastLength;
      while (match = regexpExec.call(separatorCopy, string)) {
        lastIndex = separatorCopy.lastIndex;
        if (lastIndex > lastLastIndex) {
          output.push(string.slice(lastLastIndex, match.index));
          if (match.length > 1 && match.index < string.length) arrayPush.apply(output, match.slice(1));
          lastLength = match[0].length;
          lastLastIndex = lastIndex;
          if (output.length >= lim) break;
        }
        if (separatorCopy.lastIndex === match.index) separatorCopy.lastIndex++; // Avoid an infinite loop
      }
      if (lastLastIndex === string.length) {
        if (lastLength || !separatorCopy.test('')) output.push('');
      } else output.push(string.slice(lastLastIndex));
      return output.length > lim ? output.slice(0, lim) : output;
    };
  // Chakra, V8
  } else if ('0'.split(undefined, 0).length) {
    internalSplit = function (separator, limit) {
      return separator === undefined && limit === 0 ? [] : nativeSplit.call(this, separator, limit);
    };
  } else internalSplit = nativeSplit;

  return [
    // `String.prototype.split` method
    // https://tc39.github.io/ecma262/#sec-string.prototype.split
    function split(separator, limit) {
      var O = requireObjectCoercible(this);
      var splitter = separator == undefined ? undefined : separator[SPLIT];
      return splitter !== undefined
        ? splitter.call(separator, O, limit)
        : internalSplit.call(String(O), separator, limit);
    },
    // `RegExp.prototype[@@split]` method
    // https://tc39.github.io/ecma262/#sec-regexp.prototype-@@split
    //
    // NOTE: This cannot be properly polyfilled in engines that don't support
    // the 'y' flag.
    function (regexp, limit) {
      var res = maybeCallNative(internalSplit, regexp, this, limit, internalSplit !== nativeSplit);
      if (res.done) return res.value;

      var rx = anObject(regexp);
      var S = String(this);
      var C = speciesConstructor(rx, RegExp);

      var unicodeMatching = rx.unicode;
      var flags = (rx.ignoreCase ? 'i' : '') +
                  (rx.multiline ? 'm' : '') +
                  (rx.unicode ? 'u' : '') +
                  (SUPPORTS_Y ? 'y' : 'g');

      // ^(? + rx + ) is needed, in combination with some S slicing, to
      // simulate the 'y' flag.
      var splitter = new C(SUPPORTS_Y ? rx : '^(?:' + rx.source + ')', flags);
      var lim = limit === undefined ? MAX_UINT32 : limit >>> 0;
      if (lim === 0) return [];
      if (S.length === 0) return callRegExpExec(splitter, S) === null ? [S] : [];
      var p = 0;
      var q = 0;
      var A = [];
      while (q < S.length) {
        splitter.lastIndex = SUPPORTS_Y ? q : 0;
        var z = callRegExpExec(splitter, SUPPORTS_Y ? S : S.slice(q));
        var e;
        if (
          z === null ||
          (e = min(toLength(splitter.lastIndex + (SUPPORTS_Y ? 0 : q)), S.length)) === p
        ) {
          q = advanceStringIndex(S, q, unicodeMatching);
        } else {
          A.push(S.slice(p, q));
          if (A.length === lim) return A;
          for (var i = 1; i <= z.length - 1; i++) {
            A.push(z[i]);
            if (A.length === lim) return A;
          }
          q = p = e;
        }
      }
      A.push(S.slice(p));
      return A;
    }
  ];
}, !SUPPORTS_Y);


/***/ }),
/* 289 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global) {var now = __webpack_require__(290)
  , root = typeof window === 'undefined' ? global : window
  , vendors = ['moz', 'webkit']
  , suffix = 'AnimationFrame'
  , raf = root['request' + suffix]
  , caf = root['cancel' + suffix] || root['cancelRequest' + suffix]

for(var i = 0; !raf && i < vendors.length; i++) {
  raf = root[vendors[i] + 'Request' + suffix]
  caf = root[vendors[i] + 'Cancel' + suffix]
      || root[vendors[i] + 'CancelRequest' + suffix]
}

// Some versions of FF have rAF but not cAF
if(!raf || !caf) {
  var last = 0
    , id = 0
    , queue = []
    , frameDuration = 1000 / 60

  raf = function(callback) {
    if(queue.length === 0) {
      var _now = now()
        , next = Math.max(0, frameDuration - (_now - last))
      last = next + _now
      setTimeout(function() {
        var cp = queue.slice(0)
        // Clear queue here to prevent
        // callbacks from appending listeners
        // to the current frame's queue
        queue.length = 0
        for(var i = 0; i < cp.length; i++) {
          if(!cp[i].cancelled) {
            try{
              cp[i].callback(last)
            } catch(e) {
              setTimeout(function() { throw e }, 0)
            }
          }
        }
      }, Math.round(next))
    }
    queue.push({
      handle: ++id,
      callback: callback,
      cancelled: false
    })
    return id
  }

  caf = function(handle) {
    for(var i = 0; i < queue.length; i++) {
      if(queue[i].handle === handle) {
        queue[i].cancelled = true
      }
    }
  }
}

module.exports = function(fn) {
  // Wrap in a new function to prevent
  // `cancel` potentially being assigned
  // to the native rAF function
  return raf.call(root, fn)
}
module.exports.cancel = function() {
  caf.apply(root, arguments)
}
module.exports.polyfill = function(object) {
  if (!object) {
    object = root;
  }
  object.requestAnimationFrame = raf
  object.cancelAnimationFrame = caf
}

/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(148)))

/***/ }),
/* 290 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(process) {// Generated by CoffeeScript 1.12.2
(function() {
  var getNanoSeconds, hrtime, loadTime, moduleLoadTime, nodeLoadTime, upTime;

  if ((typeof performance !== "undefined" && performance !== null) && performance.now) {
    module.exports = function() {
      return performance.now();
    };
  } else if ((typeof process !== "undefined" && process !== null) && process.hrtime) {
    module.exports = function() {
      return (getNanoSeconds() - nodeLoadTime) / 1e6;
    };
    hrtime = process.hrtime;
    getNanoSeconds = function() {
      var hr;
      hr = hrtime();
      return hr[0] * 1e9 + hr[1];
    };
    moduleLoadTime = getNanoSeconds();
    upTime = process.uptime() * 1e9;
    nodeLoadTime = moduleLoadTime - upTime;
  } else if (Date.now) {
    module.exports = function() {
      return Date.now() - loadTime;
    };
    loadTime = Date.now();
  } else {
    module.exports = function() {
      return new Date().getTime() - loadTime;
    };
    loadTime = new Date().getTime();
  }

}).call(this);

//# sourceMappingURL=performance-now.js.map

/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(156)))

/***/ }),
/* 291 */
/***/ (function(module, exports, __webpack_require__) {

var DESCRIPTORS = __webpack_require__(141);
var defineProperty = __webpack_require__(144).f;

var FunctionPrototype = Function.prototype;
var FunctionPrototypeToString = FunctionPrototype.toString;
var nameRE = /^\s*function ([^ (]*)/;
var NAME = 'name';

// Function instances `.name` property
// https://tc39.github.io/ecma262/#sec-function-instances-name
if (DESCRIPTORS && !(NAME in FunctionPrototype)) {
  defineProperty(FunctionPrototype, NAME, {
    configurable: true,
    get: function () {
      try {
        return FunctionPrototypeToString.call(this).match(nameRE)[1];
      } catch (error) {
        return '';
      }
    }
  });
}


/***/ }),
/* 292 */
/***/ (function(module, exports) {

/*
	Based on rgbcolor.js by Stoyan Stefanov <sstoo@gmail.com>
	http://www.phpied.com/rgb-color-parser-in-javascript/
*/

module.exports = function(color_string) {
    this.ok = false;
    this.alpha = 1.0;

    // strip any leading #
    if (color_string.charAt(0) == '#') { // remove # if any
        color_string = color_string.substr(1,6);
    }

    color_string = color_string.replace(/ /g,'');
    color_string = color_string.toLowerCase();

    // before getting into regexps, try simple matches
    // and overwrite the input
    var simple_colors = {
        aliceblue: 'f0f8ff',
        antiquewhite: 'faebd7',
        aqua: '00ffff',
        aquamarine: '7fffd4',
        azure: 'f0ffff',
        beige: 'f5f5dc',
        bisque: 'ffe4c4',
        black: '000000',
        blanchedalmond: 'ffebcd',
        blue: '0000ff',
        blueviolet: '8a2be2',
        brown: 'a52a2a',
        burlywood: 'deb887',
        cadetblue: '5f9ea0',
        chartreuse: '7fff00',
        chocolate: 'd2691e',
        coral: 'ff7f50',
        cornflowerblue: '6495ed',
        cornsilk: 'fff8dc',
        crimson: 'dc143c',
        cyan: '00ffff',
        darkblue: '00008b',
        darkcyan: '008b8b',
        darkgoldenrod: 'b8860b',
        darkgray: 'a9a9a9',
        darkgreen: '006400',
        darkkhaki: 'bdb76b',
        darkmagenta: '8b008b',
        darkolivegreen: '556b2f',
        darkorange: 'ff8c00',
        darkorchid: '9932cc',
        darkred: '8b0000',
        darksalmon: 'e9967a',
        darkseagreen: '8fbc8f',
        darkslateblue: '483d8b',
        darkslategray: '2f4f4f',
        darkturquoise: '00ced1',
        darkviolet: '9400d3',
        deeppink: 'ff1493',
        deepskyblue: '00bfff',
        dimgray: '696969',
        dodgerblue: '1e90ff',
        feldspar: 'd19275',
        firebrick: 'b22222',
        floralwhite: 'fffaf0',
        forestgreen: '228b22',
        fuchsia: 'ff00ff',
        gainsboro: 'dcdcdc',
        ghostwhite: 'f8f8ff',
        gold: 'ffd700',
        goldenrod: 'daa520',
        gray: '808080',
        green: '008000',
        greenyellow: 'adff2f',
        honeydew: 'f0fff0',
        hotpink: 'ff69b4',
        indianred : 'cd5c5c',
        indigo : '4b0082',
        ivory: 'fffff0',
        khaki: 'f0e68c',
        lavender: 'e6e6fa',
        lavenderblush: 'fff0f5',
        lawngreen: '7cfc00',
        lemonchiffon: 'fffacd',
        lightblue: 'add8e6',
        lightcoral: 'f08080',
        lightcyan: 'e0ffff',
        lightgoldenrodyellow: 'fafad2',
        lightgrey: 'd3d3d3',
        lightgreen: '90ee90',
        lightpink: 'ffb6c1',
        lightsalmon: 'ffa07a',
        lightseagreen: '20b2aa',
        lightskyblue: '87cefa',
        lightslateblue: '8470ff',
        lightslategray: '778899',
        lightsteelblue: 'b0c4de',
        lightyellow: 'ffffe0',
        lime: '00ff00',
        limegreen: '32cd32',
        linen: 'faf0e6',
        magenta: 'ff00ff',
        maroon: '800000',
        mediumaquamarine: '66cdaa',
        mediumblue: '0000cd',
        mediumorchid: 'ba55d3',
        mediumpurple: '9370d8',
        mediumseagreen: '3cb371',
        mediumslateblue: '7b68ee',
        mediumspringgreen: '00fa9a',
        mediumturquoise: '48d1cc',
        mediumvioletred: 'c71585',
        midnightblue: '191970',
        mintcream: 'f5fffa',
        mistyrose: 'ffe4e1',
        moccasin: 'ffe4b5',
        navajowhite: 'ffdead',
        navy: '000080',
        oldlace: 'fdf5e6',
        olive: '808000',
        olivedrab: '6b8e23',
        orange: 'ffa500',
        orangered: 'ff4500',
        orchid: 'da70d6',
        palegoldenrod: 'eee8aa',
        palegreen: '98fb98',
        paleturquoise: 'afeeee',
        palevioletred: 'd87093',
        papayawhip: 'ffefd5',
        peachpuff: 'ffdab9',
        peru: 'cd853f',
        pink: 'ffc0cb',
        plum: 'dda0dd',
        powderblue: 'b0e0e6',
        purple: '800080',
        rebeccapurple: '663399',
        red: 'ff0000',
        rosybrown: 'bc8f8f',
        royalblue: '4169e1',
        saddlebrown: '8b4513',
        salmon: 'fa8072',
        sandybrown: 'f4a460',
        seagreen: '2e8b57',
        seashell: 'fff5ee',
        sienna: 'a0522d',
        silver: 'c0c0c0',
        skyblue: '87ceeb',
        slateblue: '6a5acd',
        slategray: '708090',
        snow: 'fffafa',
        springgreen: '00ff7f',
        steelblue: '4682b4',
        tan: 'd2b48c',
        teal: '008080',
        thistle: 'd8bfd8',
        tomato: 'ff6347',
        turquoise: '40e0d0',
        violet: 'ee82ee',
        violetred: 'd02090',
        wheat: 'f5deb3',
        white: 'ffffff',
        whitesmoke: 'f5f5f5',
        yellow: 'ffff00',
        yellowgreen: '9acd32'
    };
    color_string = simple_colors[color_string] || color_string;
    // emd of simple type-in colors

    // array of color definition objects
    var color_defs = [
        {
            re: /^rgba\((\d{1,3}),\s*(\d{1,3}),\s*(\d{1,3}),\s*((?:\d?\.)?\d)\)$/,
            example: ['rgba(123, 234, 45, 0.8)', 'rgba(255,234,245,1.0)'],
            process: function (bits){
                return [
                    parseInt(bits[1]),
                    parseInt(bits[2]),
                    parseInt(bits[3]),
                    parseFloat(bits[4])
                ];
            }
        },
        {
            re: /^rgb\((\d{1,3}),\s*(\d{1,3}),\s*(\d{1,3})\)$/,
            example: ['rgb(123, 234, 45)', 'rgb(255,234,245)'],
            process: function (bits){
                return [
                    parseInt(bits[1]),
                    parseInt(bits[2]),
                    parseInt(bits[3])
                ];
            }
        },
        {
            re: /^([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})$/,
            example: ['#00ff00', '336699'],
            process: function (bits){
                return [
                    parseInt(bits[1], 16),
                    parseInt(bits[2], 16),
                    parseInt(bits[3], 16)
                ];
            }
        },
        {
            re: /^([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})$/,
            example: ['#fb0', 'f0f'],
            process: function (bits){
                return [
                    parseInt(bits[1] + bits[1], 16),
                    parseInt(bits[2] + bits[2], 16),
                    parseInt(bits[3] + bits[3], 16)
                ];
            }
        }
    ];

    // search through the definitions to find a match
    for (var i = 0; i < color_defs.length; i++) {
        var re = color_defs[i].re;
        var processor = color_defs[i].process;
        var bits = re.exec(color_string);
        if (bits) {
            var channels = processor(bits);
            this.r = channels[0];
            this.g = channels[1];
            this.b = channels[2];
            if (channels.length > 3) {
                this.alpha = channels[3];
            }
            this.ok = true;
        }

    }

    // validate/cleanup values
    this.r = (this.r < 0 || isNaN(this.r)) ? 0 : ((this.r > 255) ? 255 : this.r);
    this.g = (this.g < 0 || isNaN(this.g)) ? 0 : ((this.g > 255) ? 255 : this.g);
    this.b = (this.b < 0 || isNaN(this.b)) ? 0 : ((this.b > 255) ? 255 : this.b);
    this.alpha = (this.alpha < 0) ? 0 : ((this.alpha > 1.0 || isNaN(this.alpha)) ? 1.0 : this.alpha);

    // some getters
    this.toRGB = function () {
        return 'rgb(' + this.r + ', ' + this.g + ', ' + this.b + ')';
    }
    this.toRGBA = function () {
        return 'rgba(' + this.r + ', ' + this.g + ', ' + this.b + ', ' + this.alpha + ')';
    }
    this.toHex = function () {
        var r = this.r.toString(16);
        var g = this.g.toString(16);
        var b = this.b.toString(16);
        if (r.length == 1) r = '0' + r;
        if (g.length == 1) g = '0' + g;
        if (b.length == 1) b = '0' + b;
        return '#' + r + g + b;
    }

    // help
    this.getHelpXML = function () {

        var examples = new Array();
        // add regexps
        for (var i = 0; i < color_defs.length; i++) {
            var example = color_defs[i].example;
            for (var j = 0; j < example.length; j++) {
                examples[examples.length] = example[j];
            }
        }
        // add type-in colors
        for (var sc in simple_colors) {
            examples[examples.length] = sc;
        }

        var xml = document.createElement('ul');
        xml.setAttribute('id', 'rgbcolor-examples');
        for (var i = 0; i < examples.length; i++) {
            try {
                var list_item = document.createElement('li');
                var list_color = new RGBColor(examples[i]);
                var example_div = document.createElement('div');
                example_div.style.cssText =
                        'margin: 3px; '
                        + 'border: 1px solid black; '
                        + 'background:' + list_color.toHex() + '; '
                        + 'color:' + list_color.toHex()
                ;
                example_div.appendChild(document.createTextNode('test'));
                var list_item_value = document.createTextNode(
                    ' ' + examples[i] + ' -> ' + list_color.toRGB() + ' -> ' + list_color.toHex()
                );
                list_item.appendChild(example_div);
                list_item.appendChild(list_item_value);
                xml.appendChild(list_item);

            } catch(e){}
        }
        return xml;

    }

}


/***/ }),
/* 293 */
/***/ (function(module, exports, __webpack_require__) {

var _typeof = __webpack_require__(294);

var assertThisInitialized = __webpack_require__(233);

function _possibleConstructorReturn(self, call) {
  if (call && (_typeof(call) === "object" || typeof call === "function")) {
    return call;
  }

  return assertThisInitialized(self);
}

module.exports = _possibleConstructorReturn;

/***/ }),
/* 294 */
/***/ (function(module, exports) {

function _typeof(obj) {
  "@babel/helpers - typeof";

  if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
    module.exports = _typeof = function _typeof(obj) {
      return typeof obj;
    };
  } else {
    module.exports = _typeof = function _typeof(obj) {
      return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    };
  }

  return _typeof(obj);
}

module.exports = _typeof;

/***/ }),
/* 295 */
/***/ (function(module, exports, __webpack_require__) {

var setPrototypeOf = __webpack_require__(296);

function _inherits(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function");
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      writable: true,
      configurable: true
    }
  });
  if (superClass) setPrototypeOf(subClass, superClass);
}

module.exports = _inherits;

/***/ }),
/* 296 */
/***/ (function(module, exports) {

function _setPrototypeOf(o, p) {
  module.exports = _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
    o.__proto__ = p;
    return o;
  };

  return _setPrototypeOf(o, p);
}

module.exports = _setPrototypeOf;

/***/ }),
/* 297 */
/***/ (function(module, exports, __webpack_require__) {

var $ = __webpack_require__(136);
var from = __webpack_require__(298);
var checkCorrectnessOfIteration = __webpack_require__(196);

var INCORRECT_ITERATION = !checkCorrectnessOfIteration(function (iterable) {
  Array.from(iterable);
});

// `Array.from` method
// https://tc39.github.io/ecma262/#sec-array.from
$({ target: 'Array', stat: true, forced: INCORRECT_ITERATION }, {
  from: from
});


/***/ }),
/* 298 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var bind = __webpack_require__(165);
var toObject = __webpack_require__(151);
var callWithSafeIterationClosing = __webpack_require__(227);
var isArrayIteratorMethod = __webpack_require__(225);
var toLength = __webpack_require__(147);
var createProperty = __webpack_require__(192);
var getIteratorMethod = __webpack_require__(226);

// `Array.from` method implementation
// https://tc39.github.io/ecma262/#sec-array.from
module.exports = function from(arrayLike /* , mapfn = undefined, thisArg = undefined */) {
  var O = toObject(arrayLike);
  var C = typeof this == 'function' ? this : Array;
  var argumentsLength = arguments.length;
  var mapfn = argumentsLength > 1 ? arguments[1] : undefined;
  var mapping = mapfn !== undefined;
  var iteratorMethod = getIteratorMethod(O);
  var index = 0;
  var length, result, step, iterator, next, value;
  if (mapping) mapfn = bind(mapfn, argumentsLength > 2 ? arguments[2] : undefined, 2);
  // if the target is not iterable or it's an array with the default iterator - use a simple case
  if (iteratorMethod != undefined && !(C == Array && isArrayIteratorMethod(iteratorMethod))) {
    iterator = iteratorMethod.call(O);
    next = iterator.next;
    result = new C();
    for (;!(step = next.call(iterator)).done; index++) {
      value = mapping ? callWithSafeIterationClosing(iterator, mapfn, [step.value, index], true) : step.value;
      createProperty(result, index, value);
    }
  } else {
    length = toLength(O.length);
    result = new C(length);
    for (;length > index; index++) {
      value = mapping ? mapfn(O[index], index) : O[index];
      createProperty(result, index, value);
    }
  }
  result.length = index;
  return result;
};


/***/ }),
/* 299 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $ = __webpack_require__(136);
var $includes = __webpack_require__(183).includes;
var addToUnscopables = __webpack_require__(197);
var arrayMethodUsesToLength = __webpack_require__(154);

var USES_TO_LENGTH = arrayMethodUsesToLength('indexOf', { ACCESSORS: true, 1: 0 });

// `Array.prototype.includes` method
// https://tc39.github.io/ecma262/#sec-array.prototype.includes
$({ target: 'Array', proto: true, forced: !USES_TO_LENGTH }, {
  includes: function includes(el /* , fromIndex = 0 */) {
    return $includes(this, el, arguments.length > 1 ? arguments[1] : undefined);
  }
});

// https://tc39.github.io/ecma262/#sec-array.prototype-@@unscopables
addToUnscopables('includes');


/***/ }),
/* 300 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $ = __webpack_require__(136);
var $some = __webpack_require__(158).some;
var arrayMethodIsStrict = __webpack_require__(160);
var arrayMethodUsesToLength = __webpack_require__(154);

var STRICT_METHOD = arrayMethodIsStrict('some');
var USES_TO_LENGTH = arrayMethodUsesToLength('some');

// `Array.prototype.some` method
// https://tc39.github.io/ecma262/#sec-array.prototype.some
$({ target: 'Array', proto: true, forced: !STRICT_METHOD || !USES_TO_LENGTH }, {
  some: function some(callbackfn /* , thisArg */) {
    return $some(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
  }
});


/***/ }),
/* 301 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $ = __webpack_require__(136);
var notARegExp = __webpack_require__(302);
var requireObjectCoercible = __webpack_require__(153);
var correctIsRegExpLogic = __webpack_require__(303);

// `String.prototype.includes` method
// https://tc39.github.io/ecma262/#sec-string.prototype.includes
$({ target: 'String', proto: true, forced: !correctIsRegExpLogic('includes') }, {
  includes: function includes(searchString /* , position = 0 */) {
    return !!~String(requireObjectCoercible(this))
      .indexOf(notARegExp(searchString), arguments.length > 1 ? arguments[1] : undefined);
  }
});


/***/ }),
/* 302 */
/***/ (function(module, exports, __webpack_require__) {

var isRegExp = __webpack_require__(232);

module.exports = function (it) {
  if (isRegExp(it)) {
    throw TypeError("The method doesn't accept regular expressions");
  } return it;
};


/***/ }),
/* 303 */
/***/ (function(module, exports, __webpack_require__) {

var wellKnownSymbol = __webpack_require__(139);

var MATCH = wellKnownSymbol('match');

module.exports = function (METHOD_NAME) {
  var regexp = /./;
  try {
    '/./'[METHOD_NAME](regexp);
  } catch (e) {
    try {
      regexp[MATCH] = false;
      return '/./'[METHOD_NAME](regexp);
    } catch (f) { /* empty */ }
  } return false;
};


/***/ }),
/* 304 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var charAt = __webpack_require__(215).charAt;
var InternalStateModule = __webpack_require__(157);
var defineIterator = __webpack_require__(198);

var STRING_ITERATOR = 'String Iterator';
var setInternalState = InternalStateModule.set;
var getInternalState = InternalStateModule.getterFor(STRING_ITERATOR);

// `String.prototype[@@iterator]` method
// https://tc39.github.io/ecma262/#sec-string.prototype-@@iterator
defineIterator(String, 'String', function (iterated) {
  setInternalState(this, {
    type: STRING_ITERATOR,
    string: String(iterated),
    index: 0
  });
// `%StringIteratorPrototype%.next` method
// https://tc39.github.io/ecma262/#sec-%stringiteratorprototype%.next
}, function next() {
  var state = getInternalState(this);
  var string = state.string;
  var index = state.index;
  var point;
  if (index >= string.length) return { value: undefined, done: true };
  point = charAt(string, index);
  state.index += point.length;
  return { value: point, done: false };
});


/***/ }),
/* 305 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var IteratorPrototype = __webpack_require__(235).IteratorPrototype;
var create = __webpack_require__(166);
var createPropertyDescriptor = __webpack_require__(161);
var setToStringTag = __webpack_require__(167);
var Iterators = __webpack_require__(168);

var returnThis = function () { return this; };

module.exports = function (IteratorConstructor, NAME, next) {
  var TO_STRING_TAG = NAME + ' Iterator';
  IteratorConstructor.prototype = create(IteratorPrototype, { next: createPropertyDescriptor(1, next) });
  setToStringTag(IteratorConstructor, TO_STRING_TAG, false, true);
  Iterators[TO_STRING_TAG] = returnThis;
  return IteratorConstructor;
};


/***/ }),
/* 306 */
/***/ (function(module, exports, __webpack_require__) {

var isObject = __webpack_require__(142);

module.exports = function (it) {
  if (!isObject(it) && it !== null) {
    throw TypeError("Can't set " + String(it) + ' as a prototype');
  } return it;
};


/***/ }),
/* 307 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $ = __webpack_require__(136);
var $trim = __webpack_require__(176).trim;
var forcedStringTrimMethod = __webpack_require__(308);

// `String.prototype.trim` method
// https://tc39.github.io/ecma262/#sec-string.prototype.trim
$({ target: 'String', proto: true, forced: forcedStringTrimMethod('trim') }, {
  trim: function trim() {
    return $trim(this);
  }
});


/***/ }),
/* 308 */
/***/ (function(module, exports, __webpack_require__) {

var fails = __webpack_require__(138);
var whitespaces = __webpack_require__(177);

var non = '\u200B\u0085\u180E';

// check that a method works with the correct list
// of whitespaces and has a correct name
module.exports = function (METHOD_NAME) {
  return fails(function () {
    return !!whitespaces[METHOD_NAME]() || non[METHOD_NAME]() != non || whitespaces[METHOD_NAME].name !== METHOD_NAME;
  });
};


/***/ }),
/* 309 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $ = __webpack_require__(136);
var $indexOf = __webpack_require__(183).indexOf;
var arrayMethodIsStrict = __webpack_require__(160);
var arrayMethodUsesToLength = __webpack_require__(154);

var nativeIndexOf = [].indexOf;

var NEGATIVE_ZERO = !!nativeIndexOf && 1 / [1].indexOf(1, -0) < 0;
var STRICT_METHOD = arrayMethodIsStrict('indexOf');
var USES_TO_LENGTH = arrayMethodUsesToLength('indexOf', { ACCESSORS: true, 1: 0 });

// `Array.prototype.indexOf` method
// https://tc39.github.io/ecma262/#sec-array.prototype.indexof
$({ target: 'Array', proto: true, forced: NEGATIVE_ZERO || !STRICT_METHOD || !USES_TO_LENGTH }, {
  indexOf: function indexOf(searchElement /* , fromIndex = 0 */) {
    return NEGATIVE_ZERO
      // convert -0 to +0
      ? nativeIndexOf.apply(this, arguments) || 0
      : $indexOf(this, searchElement, arguments.length > 1 ? arguments[1] : undefined);
  }
});


/***/ }),
/* 310 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $ = __webpack_require__(136);
var isArray = __webpack_require__(175);

var nativeReverse = [].reverse;
var test = [1, 2];

// `Array.prototype.reverse` method
// https://tc39.github.io/ecma262/#sec-array.prototype.reverse
// fix for Safari 12.0 bug
// https://bugs.webkit.org/show_bug.cgi?id=188794
$({ target: 'Array', proto: true, forced: String(test) === String(test.reverse()) }, {
  reverse: function reverse() {
    // eslint-disable-next-line no-self-assign
    if (isArray(this)) this.length = this.length;
    return nativeReverse.call(this);
  }
});


/***/ }),
/* 311 */
/***/ (function(module, exports, __webpack_require__) {

var superPropBase = __webpack_require__(312);

function _get(target, property, receiver) {
  if (typeof Reflect !== "undefined" && Reflect.get) {
    module.exports = _get = Reflect.get;
  } else {
    module.exports = _get = function _get(target, property, receiver) {
      var base = superPropBase(target, property);
      if (!base) return;
      var desc = Object.getOwnPropertyDescriptor(base, property);

      if (desc.get) {
        return desc.get.call(receiver);
      }

      return desc.value;
    };
  }

  return _get(target, property, receiver || target);
}

module.exports = _get;

/***/ }),
/* 312 */
/***/ (function(module, exports, __webpack_require__) {

var getPrototypeOf = __webpack_require__(234);

function _superPropBase(object, property) {
  while (!Object.prototype.hasOwnProperty.call(object, property)) {
    object = getPrototypeOf(object);
    if (object === null) break;
  }

  return object;
}

module.exports = _superPropBase;

/***/ }),
/* 313 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var DESCRIPTORS = __webpack_require__(141);
var global = __webpack_require__(137);
var isForced = __webpack_require__(174);
var redefine = __webpack_require__(145);
var has = __webpack_require__(143);
var classof = __webpack_require__(150);
var inheritIfRequired = __webpack_require__(238);
var toPrimitive = __webpack_require__(162);
var fails = __webpack_require__(138);
var create = __webpack_require__(166);
var getOwnPropertyNames = __webpack_require__(172).f;
var getOwnPropertyDescriptor = __webpack_require__(152).f;
var defineProperty = __webpack_require__(144).f;
var trim = __webpack_require__(176).trim;

var NUMBER = 'Number';
var NativeNumber = global[NUMBER];
var NumberPrototype = NativeNumber.prototype;

// Opera ~12 has broken Object#toString
var BROKEN_CLASSOF = classof(create(NumberPrototype)) == NUMBER;

// `ToNumber` abstract operation
// https://tc39.github.io/ecma262/#sec-tonumber
var toNumber = function (argument) {
  var it = toPrimitive(argument, false);
  var first, third, radix, maxCode, digits, length, index, code;
  if (typeof it == 'string' && it.length > 2) {
    it = trim(it);
    first = it.charCodeAt(0);
    if (first === 43 || first === 45) {
      third = it.charCodeAt(2);
      if (third === 88 || third === 120) return NaN; // Number('+0x1') should be NaN, old V8 fix
    } else if (first === 48) {
      switch (it.charCodeAt(1)) {
        case 66: case 98: radix = 2; maxCode = 49; break; // fast equal of /^0b[01]+$/i
        case 79: case 111: radix = 8; maxCode = 55; break; // fast equal of /^0o[0-7]+$/i
        default: return +it;
      }
      digits = it.slice(2);
      length = digits.length;
      for (index = 0; index < length; index++) {
        code = digits.charCodeAt(index);
        // parseInt parses a string to a first unavailable symbol
        // but ToNumber should return NaN if a string contains unavailable symbols
        if (code < 48 || code > maxCode) return NaN;
      } return parseInt(digits, radix);
    }
  } return +it;
};

// `Number` constructor
// https://tc39.github.io/ecma262/#sec-number-constructor
if (isForced(NUMBER, !NativeNumber(' 0o1') || !NativeNumber('0b1') || NativeNumber('+0x1'))) {
  var NumberWrapper = function Number(value) {
    var it = arguments.length < 1 ? 0 : value;
    var dummy = this;
    return dummy instanceof NumberWrapper
      // check on 1..constructor(foo) case
      && (BROKEN_CLASSOF ? fails(function () { NumberPrototype.valueOf.call(dummy); }) : classof(dummy) != NUMBER)
        ? inheritIfRequired(new NativeNumber(toNumber(it)), dummy, NumberWrapper) : toNumber(it);
  };
  for (var keys = DESCRIPTORS ? getOwnPropertyNames(NativeNumber) : (
    // ES3:
    'MAX_VALUE,MIN_VALUE,NaN,NEGATIVE_INFINITY,POSITIVE_INFINITY,' +
    // ES2015 (in case, if modules with ES2015 Number statics required before):
    'EPSILON,isFinite,isInteger,isNaN,isSafeInteger,MAX_SAFE_INTEGER,' +
    'MIN_SAFE_INTEGER,parseFloat,parseInt,isInteger'
  ).split(','), j = 0, key; keys.length > j; j++) {
    if (has(NativeNumber, key = keys[j]) && !has(NumberWrapper, key)) {
      defineProperty(NumberWrapper, key, getOwnPropertyDescriptor(NativeNumber, key));
    }
  }
  NumberWrapper.prototype = NumberPrototype;
  NumberPrototype.constructor = NumberWrapper;
  redefine(global, NUMBER, NumberWrapper);
}


/***/ }),
/* 314 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var redefine = __webpack_require__(145);
var anObject = __webpack_require__(140);
var fails = __webpack_require__(138);
var flags = __webpack_require__(214);

var TO_STRING = 'toString';
var RegExpPrototype = RegExp.prototype;
var nativeToString = RegExpPrototype[TO_STRING];

var NOT_GENERIC = fails(function () { return nativeToString.call({ source: 'a', flags: 'b' }) != '/a/b'; });
// FF44- RegExp#toString has a wrong name
var INCORRECT_NAME = nativeToString.name != TO_STRING;

// `RegExp.prototype.toString` method
// https://tc39.github.io/ecma262/#sec-regexp.prototype.tostring
if (NOT_GENERIC || INCORRECT_NAME) {
  redefine(RegExp.prototype, TO_STRING, function toString() {
    var R = anObject(this);
    var p = String(R.source);
    var rf = R.flags;
    var f = String(rf === undefined && R instanceof RegExp && !('flags' in RegExpPrototype) ? flags.call(R) : rf);
    return '/' + p + '/' + f;
  }, { unsafe: true });
}


/***/ }),
/* 315 */
/***/ (function(module, exports, __webpack_require__) {

var $ = __webpack_require__(136);
var fill = __webpack_require__(316);
var addToUnscopables = __webpack_require__(197);

// `Array.prototype.fill` method
// https://tc39.github.io/ecma262/#sec-array.prototype.fill
$({ target: 'Array', proto: true }, {
  fill: fill
});

// https://tc39.github.io/ecma262/#sec-array.prototype-@@unscopables
addToUnscopables('fill');


/***/ }),
/* 316 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var toObject = __webpack_require__(151);
var toAbsoluteIndex = __webpack_require__(208);
var toLength = __webpack_require__(147);

// `Array.prototype.fill` method implementation
// https://tc39.github.io/ecma262/#sec-array.prototype.fill
module.exports = function fill(value /* , start = 0, end = @length */) {
  var O = toObject(this);
  var length = toLength(O.length);
  var argumentsLength = arguments.length;
  var index = toAbsoluteIndex(argumentsLength > 1 ? arguments[1] : undefined, length);
  var end = argumentsLength > 2 ? arguments[2] : undefined;
  var endPos = end === undefined ? length : toAbsoluteIndex(end, length);
  while (endPos > index) O[index++] = value;
  return O;
};


/***/ }),
/* 317 */
/***/ (function(module, exports, __webpack_require__) {

var $ = __webpack_require__(136);
var anObject = __webpack_require__(140);
var getOwnPropertyDescriptor = __webpack_require__(152).f;

// `Reflect.deleteProperty` method
// https://tc39.github.io/ecma262/#sec-reflect.deleteproperty
$({ target: 'Reflect', stat: true }, {
  deleteProperty: function deleteProperty(target, propertyKey) {
    var descriptor = getOwnPropertyDescriptor(anObject(target), propertyKey);
    return descriptor && !descriptor.configurable ? false : delete target[propertyKey];
  }
});


/***/ }),
/* 318 */
/***/ (function(module, exports, __webpack_require__) {

var global = __webpack_require__(137);
var DOMIterables = __webpack_require__(221);
var ArrayIteratorMethods = __webpack_require__(239);
var createNonEnumerableProperty = __webpack_require__(146);
var wellKnownSymbol = __webpack_require__(139);

var ITERATOR = wellKnownSymbol('iterator');
var TO_STRING_TAG = wellKnownSymbol('toStringTag');
var ArrayValues = ArrayIteratorMethods.values;

for (var COLLECTION_NAME in DOMIterables) {
  var Collection = global[COLLECTION_NAME];
  var CollectionPrototype = Collection && Collection.prototype;
  if (CollectionPrototype) {
    // some Chrome versions have non-configurable methods on DOMTokenList
    if (CollectionPrototype[ITERATOR] !== ArrayValues) try {
      createNonEnumerableProperty(CollectionPrototype, ITERATOR, ArrayValues);
    } catch (error) {
      CollectionPrototype[ITERATOR] = ArrayValues;
    }
    if (!CollectionPrototype[TO_STRING_TAG]) {
      createNonEnumerableProperty(CollectionPrototype, TO_STRING_TAG, COLLECTION_NAME);
    }
    if (DOMIterables[COLLECTION_NAME]) for (var METHOD_NAME in ArrayIteratorMethods) {
      // some Chrome versions have non-configurable methods on DOMTokenList
      if (CollectionPrototype[METHOD_NAME] !== ArrayIteratorMethods[METHOD_NAME]) try {
        createNonEnumerableProperty(CollectionPrototype, METHOD_NAME, ArrayIteratorMethods[METHOD_NAME]);
      } catch (error) {
        CollectionPrototype[METHOD_NAME] = ArrayIteratorMethods[METHOD_NAME];
      }
    }
  }
}


/***/ }),
/* 319 */
/***/ (function(module, exports, __webpack_require__) {

var $ = __webpack_require__(136);
var parseIntImplementation = __webpack_require__(320);

// `parseInt` method
// https://tc39.github.io/ecma262/#sec-parseint-string-radix
$({ global: true, forced: parseInt != parseIntImplementation }, {
  parseInt: parseIntImplementation
});


/***/ }),
/* 320 */
/***/ (function(module, exports, __webpack_require__) {

var global = __webpack_require__(137);
var trim = __webpack_require__(176).trim;
var whitespaces = __webpack_require__(177);

var $parseInt = global.parseInt;
var hex = /^[+-]?0[Xx]/;
var FORCED = $parseInt(whitespaces + '08') !== 8 || $parseInt(whitespaces + '0x16') !== 22;

// `parseInt` method
// https://tc39.github.io/ecma262/#sec-parseint-string-radix
module.exports = FORCED ? function parseInt(string, radix) {
  var S = trim(String(string));
  return $parseInt(S, (radix >>> 0) || (hex.test(S) ? 16 : 10));
} : $parseInt;


/***/ }),
/* 321 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// `Symbol.prototype.description` getter
// https://tc39.github.io/ecma262/#sec-symbol.prototype.description

var $ = __webpack_require__(136);
var DESCRIPTORS = __webpack_require__(141);
var global = __webpack_require__(137);
var has = __webpack_require__(143);
var isObject = __webpack_require__(142);
var defineProperty = __webpack_require__(144).f;
var copyConstructorProperties = __webpack_require__(204);

var NativeSymbol = global.Symbol;

if (DESCRIPTORS && typeof NativeSymbol == 'function' && (!('description' in NativeSymbol.prototype) ||
  // Safari 12 bug
  NativeSymbol().description !== undefined
)) {
  var EmptyStringDescriptionStore = {};
  // wrap Symbol constructor for correct work with undefined description
  var SymbolWrapper = function Symbol() {
    var description = arguments.length < 1 || arguments[0] === undefined ? undefined : String(arguments[0]);
    var result = this instanceof SymbolWrapper
      ? new NativeSymbol(description)
      // in Edge 13, String(Symbol(undefined)) === 'Symbol(undefined)'
      : description === undefined ? NativeSymbol() : NativeSymbol(description);
    if (description === '') EmptyStringDescriptionStore[result] = true;
    return result;
  };
  copyConstructorProperties(SymbolWrapper, NativeSymbol);
  var symbolPrototype = SymbolWrapper.prototype = NativeSymbol.prototype;
  symbolPrototype.constructor = SymbolWrapper;

  var symbolToString = symbolPrototype.toString;
  var native = String(NativeSymbol('test')) == 'Symbol(test)';
  var regexp = /^Symbol\((.*)\)[^)]+$/;
  defineProperty(symbolPrototype, 'description', {
    configurable: true,
    get: function description() {
      var symbol = isObject(this) ? this.valueOf() : this;
      var string = symbolToString.call(symbol);
      if (has(EmptyStringDescriptionStore, symbol)) return '';
      var desc = native ? string.slice(7, -1) : string.replace(regexp, '$1');
      return desc === '' ? undefined : desc;
    }
  });

  $({ global: true, forced: true }, {
    Symbol: SymbolWrapper
  });
}


/***/ }),
/* 322 */
/***/ (function(module, exports, __webpack_require__) {

var defineWellKnownSymbol = __webpack_require__(219);

// `Symbol.iterator` well-known symbol
// https://tc39.github.io/ecma262/#sec-symbol.iterator
defineWellKnownSymbol('iterator');


/***/ }),
/* 323 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var collection = __webpack_require__(324);
var collectionStrong = __webpack_require__(326);

// `Map` constructor
// https://tc39.github.io/ecma262/#sec-map-objects
module.exports = collection('Map', function (init) {
  return function Map() { return init(this, arguments.length ? arguments[0] : undefined); };
}, collectionStrong);


/***/ }),
/* 324 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $ = __webpack_require__(136);
var global = __webpack_require__(137);
var isForced = __webpack_require__(174);
var redefine = __webpack_require__(145);
var InternalMetadataModule = __webpack_require__(240);
var iterate = __webpack_require__(195);
var anInstance = __webpack_require__(194);
var isObject = __webpack_require__(142);
var fails = __webpack_require__(138);
var checkCorrectnessOfIteration = __webpack_require__(196);
var setToStringTag = __webpack_require__(167);
var inheritIfRequired = __webpack_require__(238);

module.exports = function (CONSTRUCTOR_NAME, wrapper, common) {
  var IS_MAP = CONSTRUCTOR_NAME.indexOf('Map') !== -1;
  var IS_WEAK = CONSTRUCTOR_NAME.indexOf('Weak') !== -1;
  var ADDER = IS_MAP ? 'set' : 'add';
  var NativeConstructor = global[CONSTRUCTOR_NAME];
  var NativePrototype = NativeConstructor && NativeConstructor.prototype;
  var Constructor = NativeConstructor;
  var exported = {};

  var fixMethod = function (KEY) {
    var nativeMethod = NativePrototype[KEY];
    redefine(NativePrototype, KEY,
      KEY == 'add' ? function add(value) {
        nativeMethod.call(this, value === 0 ? 0 : value);
        return this;
      } : KEY == 'delete' ? function (key) {
        return IS_WEAK && !isObject(key) ? false : nativeMethod.call(this, key === 0 ? 0 : key);
      } : KEY == 'get' ? function get(key) {
        return IS_WEAK && !isObject(key) ? undefined : nativeMethod.call(this, key === 0 ? 0 : key);
      } : KEY == 'has' ? function has(key) {
        return IS_WEAK && !isObject(key) ? false : nativeMethod.call(this, key === 0 ? 0 : key);
      } : function set(key, value) {
        nativeMethod.call(this, key === 0 ? 0 : key, value);
        return this;
      }
    );
  };

  // eslint-disable-next-line max-len
  if (isForced(CONSTRUCTOR_NAME, typeof NativeConstructor != 'function' || !(IS_WEAK || NativePrototype.forEach && !fails(function () {
    new NativeConstructor().entries().next();
  })))) {
    // create collection constructor
    Constructor = common.getConstructor(wrapper, CONSTRUCTOR_NAME, IS_MAP, ADDER);
    InternalMetadataModule.REQUIRED = true;
  } else if (isForced(CONSTRUCTOR_NAME, true)) {
    var instance = new Constructor();
    // early implementations not supports chaining
    var HASNT_CHAINING = instance[ADDER](IS_WEAK ? {} : -0, 1) != instance;
    // V8 ~ Chromium 40- weak-collections throws on primitives, but should return false
    var THROWS_ON_PRIMITIVES = fails(function () { instance.has(1); });
    // most early implementations doesn't supports iterables, most modern - not close it correctly
    // eslint-disable-next-line no-new
    var ACCEPT_ITERABLES = checkCorrectnessOfIteration(function (iterable) { new NativeConstructor(iterable); });
    // for early implementations -0 and +0 not the same
    var BUGGY_ZERO = !IS_WEAK && fails(function () {
      // V8 ~ Chromium 42- fails only with 5+ elements
      var $instance = new NativeConstructor();
      var index = 5;
      while (index--) $instance[ADDER](index, index);
      return !$instance.has(-0);
    });

    if (!ACCEPT_ITERABLES) {
      Constructor = wrapper(function (dummy, iterable) {
        anInstance(dummy, Constructor, CONSTRUCTOR_NAME);
        var that = inheritIfRequired(new NativeConstructor(), dummy, Constructor);
        if (iterable != undefined) iterate(iterable, that[ADDER], that, IS_MAP);
        return that;
      });
      Constructor.prototype = NativePrototype;
      NativePrototype.constructor = Constructor;
    }

    if (THROWS_ON_PRIMITIVES || BUGGY_ZERO) {
      fixMethod('delete');
      fixMethod('has');
      IS_MAP && fixMethod('get');
    }

    if (BUGGY_ZERO || HASNT_CHAINING) fixMethod(ADDER);

    // weak collections should not contains .clear method
    if (IS_WEAK && NativePrototype.clear) delete NativePrototype.clear;
  }

  exported[CONSTRUCTOR_NAME] = Constructor;
  $({ global: true, forced: Constructor != NativeConstructor }, exported);

  setToStringTag(Constructor, CONSTRUCTOR_NAME);

  if (!IS_WEAK) common.setStrong(Constructor, CONSTRUCTOR_NAME, IS_MAP);

  return Constructor;
};


/***/ }),
/* 325 */
/***/ (function(module, exports, __webpack_require__) {

var fails = __webpack_require__(138);

module.exports = !fails(function () {
  return Object.isExtensible(Object.preventExtensions({}));
});


/***/ }),
/* 326 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var defineProperty = __webpack_require__(144).f;
var create = __webpack_require__(166);
var redefineAll = __webpack_require__(223);
var bind = __webpack_require__(165);
var anInstance = __webpack_require__(194);
var iterate = __webpack_require__(195);
var defineIterator = __webpack_require__(198);
var setSpecies = __webpack_require__(224);
var DESCRIPTORS = __webpack_require__(141);
var fastKey = __webpack_require__(240).fastKey;
var InternalStateModule = __webpack_require__(157);

var setInternalState = InternalStateModule.set;
var internalStateGetterFor = InternalStateModule.getterFor;

module.exports = {
  getConstructor: function (wrapper, CONSTRUCTOR_NAME, IS_MAP, ADDER) {
    var C = wrapper(function (that, iterable) {
      anInstance(that, C, CONSTRUCTOR_NAME);
      setInternalState(that, {
        type: CONSTRUCTOR_NAME,
        index: create(null),
        first: undefined,
        last: undefined,
        size: 0
      });
      if (!DESCRIPTORS) that.size = 0;
      if (iterable != undefined) iterate(iterable, that[ADDER], that, IS_MAP);
    });

    var getInternalState = internalStateGetterFor(CONSTRUCTOR_NAME);

    var define = function (that, key, value) {
      var state = getInternalState(that);
      var entry = getEntry(that, key);
      var previous, index;
      // change existing entry
      if (entry) {
        entry.value = value;
      // create new entry
      } else {
        state.last = entry = {
          index: index = fastKey(key, true),
          key: key,
          value: value,
          previous: previous = state.last,
          next: undefined,
          removed: false
        };
        if (!state.first) state.first = entry;
        if (previous) previous.next = entry;
        if (DESCRIPTORS) state.size++;
        else that.size++;
        // add to index
        if (index !== 'F') state.index[index] = entry;
      } return that;
    };

    var getEntry = function (that, key) {
      var state = getInternalState(that);
      // fast case
      var index = fastKey(key);
      var entry;
      if (index !== 'F') return state.index[index];
      // frozen object case
      for (entry = state.first; entry; entry = entry.next) {
        if (entry.key == key) return entry;
      }
    };

    redefineAll(C.prototype, {
      // 23.1.3.1 Map.prototype.clear()
      // 23.2.3.2 Set.prototype.clear()
      clear: function clear() {
        var that = this;
        var state = getInternalState(that);
        var data = state.index;
        var entry = state.first;
        while (entry) {
          entry.removed = true;
          if (entry.previous) entry.previous = entry.previous.next = undefined;
          delete data[entry.index];
          entry = entry.next;
        }
        state.first = state.last = undefined;
        if (DESCRIPTORS) state.size = 0;
        else that.size = 0;
      },
      // 23.1.3.3 Map.prototype.delete(key)
      // 23.2.3.4 Set.prototype.delete(value)
      'delete': function (key) {
        var that = this;
        var state = getInternalState(that);
        var entry = getEntry(that, key);
        if (entry) {
          var next = entry.next;
          var prev = entry.previous;
          delete state.index[entry.index];
          entry.removed = true;
          if (prev) prev.next = next;
          if (next) next.previous = prev;
          if (state.first == entry) state.first = next;
          if (state.last == entry) state.last = prev;
          if (DESCRIPTORS) state.size--;
          else that.size--;
        } return !!entry;
      },
      // 23.2.3.6 Set.prototype.forEach(callbackfn, thisArg = undefined)
      // 23.1.3.5 Map.prototype.forEach(callbackfn, thisArg = undefined)
      forEach: function forEach(callbackfn /* , that = undefined */) {
        var state = getInternalState(this);
        var boundFunction = bind(callbackfn, arguments.length > 1 ? arguments[1] : undefined, 3);
        var entry;
        while (entry = entry ? entry.next : state.first) {
          boundFunction(entry.value, entry.key, this);
          // revert to the last existing entry
          while (entry && entry.removed) entry = entry.previous;
        }
      },
      // 23.1.3.7 Map.prototype.has(key)
      // 23.2.3.7 Set.prototype.has(value)
      has: function has(key) {
        return !!getEntry(this, key);
      }
    });

    redefineAll(C.prototype, IS_MAP ? {
      // 23.1.3.6 Map.prototype.get(key)
      get: function get(key) {
        var entry = getEntry(this, key);
        return entry && entry.value;
      },
      // 23.1.3.9 Map.prototype.set(key, value)
      set: function set(key, value) {
        return define(this, key === 0 ? 0 : key, value);
      }
    } : {
      // 23.2.3.1 Set.prototype.add(value)
      add: function add(value) {
        return define(this, value = value === 0 ? 0 : value, value);
      }
    });
    if (DESCRIPTORS) defineProperty(C.prototype, 'size', {
      get: function () {
        return getInternalState(this).size;
      }
    });
    return C;
  },
  setStrong: function (C, CONSTRUCTOR_NAME, IS_MAP) {
    var ITERATOR_NAME = CONSTRUCTOR_NAME + ' Iterator';
    var getInternalCollectionState = internalStateGetterFor(CONSTRUCTOR_NAME);
    var getInternalIteratorState = internalStateGetterFor(ITERATOR_NAME);
    // add .keys, .values, .entries, [@@iterator]
    // 23.1.3.4, 23.1.3.8, 23.1.3.11, 23.1.3.12, 23.2.3.5, 23.2.3.8, 23.2.3.10, 23.2.3.11
    defineIterator(C, CONSTRUCTOR_NAME, function (iterated, kind) {
      setInternalState(this, {
        type: ITERATOR_NAME,
        target: iterated,
        state: getInternalCollectionState(iterated),
        kind: kind,
        last: undefined
      });
    }, function () {
      var state = getInternalIteratorState(this);
      var kind = state.kind;
      var entry = state.last;
      // revert to the last existing entry
      while (entry && entry.removed) entry = entry.previous;
      // get next entry
      if (!state.target || !(state.last = entry = entry ? entry.next : state.state.first)) {
        // or finish the iteration
        state.target = undefined;
        return { value: undefined, done: true };
      }
      // return step by kind
      if (kind == 'keys') return { value: entry.key, done: false };
      if (kind == 'values') return { value: entry.value, done: false };
      return { value: [entry.key, entry.value], done: false };
    }, IS_MAP ? 'entries' : 'values', !IS_MAP, true);

    // add [@@species], 23.1.2.2, 23.2.2.2
    setSpecies(CONSTRUCTOR_NAME);
  }
};


/***/ }),
/* 327 */
/***/ (function(module, exports, __webpack_require__) {

var $ = __webpack_require__(136);
var getBuiltIn = __webpack_require__(155);
var aFunction = __webpack_require__(159);
var anObject = __webpack_require__(140);
var fails = __webpack_require__(138);

var nativeApply = getBuiltIn('Reflect', 'apply');
var functionApply = Function.apply;

// MS Edge argumentsList argument is optional
var OPTIONAL_ARGUMENTS_LIST = !fails(function () {
  nativeApply(function () { /* empty */ });
});

// `Reflect.apply` method
// https://tc39.github.io/ecma262/#sec-reflect.apply
$({ target: 'Reflect', stat: true, forced: OPTIONAL_ARGUMENTS_LIST }, {
  apply: function apply(target, thisArgument, argumentsList) {
    aFunction(target);
    anObject(argumentsList);
    return nativeApply
      ? nativeApply(target, thisArgument, argumentsList)
      : functionApply.call(target, thisArgument, argumentsList);
  }
});


/***/ }),
/* 328 */
/***/ (function(module, exports, __webpack_require__) {

var $ = __webpack_require__(136);
var anObject = __webpack_require__(140);
var objectGetPrototypeOf = __webpack_require__(199);
var CORRECT_PROTOTYPE_GETTER = __webpack_require__(236);

// `Reflect.getPrototypeOf` method
// https://tc39.github.io/ecma262/#sec-reflect.getprototypeof
$({ target: 'Reflect', stat: true, sham: !CORRECT_PROTOTYPE_GETTER }, {
  getPrototypeOf: function getPrototypeOf(target) {
    return objectGetPrototypeOf(anObject(target));
  }
});


/***/ }),
/* 329 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export BlurStack */
/* unused harmony export canvasRGB */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return processCanvasRGBA; });
/* unused harmony export image */
/* unused harmony export imageDataRGB */
/* unused harmony export imageDataRGBA */
function _typeof(obj) {
  "@babel/helpers - typeof";

  if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
    _typeof = function (obj) {
      return typeof obj;
    };
  } else {
    _typeof = function (obj) {
      return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    };
  }

  return _typeof(obj);
}

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

/* eslint-disable no-bitwise, unicorn/prefer-query-selector */

/**
* StackBlur - a fast almost Gaussian Blur For Canvas
*
* In case you find this class useful - especially in commercial projects -
* I am not totally unhappy for a small donation to my PayPal account
* mario@quasimondo.de
*
* Or support me on flattr:
* {@link https://flattr.com/thing/72791/StackBlur-a-fast-almost-Gaussian-Blur-Effect-for-CanvasJavascript}.
*
* @module StackBlur
* @author Mario Klingemann
* Contact: mario@quasimondo.com
* Website: {@link http://www.quasimondo.com/StackBlurForCanvas/StackBlurDemo.html}
* Twitter: @quasimondo
*
* @copyright (c) 2010 Mario Klingemann
*
* Permission is hereby granted, free of charge, to any person
* obtaining a copy of this software and associated documentation
* files (the "Software"), to deal in the Software without
* restriction, including without limitation the rights to use,
* copy, modify, merge, publish, distribute, sublicense, and/or sell
* copies of the Software, and to permit persons to whom the
* Software is furnished to do so, subject to the following
* conditions:
*
* The above copyright notice and this permission notice shall be
* included in all copies or substantial portions of the Software.
*
* THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
* EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
* OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
* NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
* HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
* WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
* FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
* OTHER DEALINGS IN THE SOFTWARE.
*/

/* eslint-disable max-len */
var mulTable = [512, 512, 456, 512, 328, 456, 335, 512, 405, 328, 271, 456, 388, 335, 292, 512, 454, 405, 364, 328, 298, 271, 496, 456, 420, 388, 360, 335, 312, 292, 273, 512, 482, 454, 428, 405, 383, 364, 345, 328, 312, 298, 284, 271, 259, 496, 475, 456, 437, 420, 404, 388, 374, 360, 347, 335, 323, 312, 302, 292, 282, 273, 265, 512, 497, 482, 468, 454, 441, 428, 417, 405, 394, 383, 373, 364, 354, 345, 337, 328, 320, 312, 305, 298, 291, 284, 278, 271, 265, 259, 507, 496, 485, 475, 465, 456, 446, 437, 428, 420, 412, 404, 396, 388, 381, 374, 367, 360, 354, 347, 341, 335, 329, 323, 318, 312, 307, 302, 297, 292, 287, 282, 278, 273, 269, 265, 261, 512, 505, 497, 489, 482, 475, 468, 461, 454, 447, 441, 435, 428, 422, 417, 411, 405, 399, 394, 389, 383, 378, 373, 368, 364, 359, 354, 350, 345, 341, 337, 332, 328, 324, 320, 316, 312, 309, 305, 301, 298, 294, 291, 287, 284, 281, 278, 274, 271, 268, 265, 262, 259, 257, 507, 501, 496, 491, 485, 480, 475, 470, 465, 460, 456, 451, 446, 442, 437, 433, 428, 424, 420, 416, 412, 408, 404, 400, 396, 392, 388, 385, 381, 377, 374, 370, 367, 363, 360, 357, 354, 350, 347, 344, 341, 338, 335, 332, 329, 326, 323, 320, 318, 315, 312, 310, 307, 304, 302, 299, 297, 294, 292, 289, 287, 285, 282, 280, 278, 275, 273, 271, 269, 267, 265, 263, 261, 259];
var shgTable = [9, 11, 12, 13, 13, 14, 14, 15, 15, 15, 15, 16, 16, 16, 16, 17, 17, 17, 17, 17, 17, 17, 18, 18, 18, 18, 18, 18, 18, 18, 18, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24];
/* eslint-enable max-len */

/**
 * @param {string|HTMLImageElement} img
 * @param {string|HTMLCanvasElement} canvas
 * @param {Float} radius
 * @param {boolean} blurAlphaChannel
 * @returns {undefined}
 */

function processImage(img, canvas, radius, blurAlphaChannel) {
  if (typeof img === 'string') {
    img = document.getElementById(img);
  }

  if (!img || !('naturalWidth' in img)) {
    return;
  }

  var w = img.naturalWidth;
  var h = img.naturalHeight;

  if (typeof canvas === 'string') {
    canvas = document.getElementById(canvas);
  }

  if (!canvas || !('getContext' in canvas)) {
    return;
  }

  canvas.style.width = w + 'px';
  canvas.style.height = h + 'px';
  canvas.width = w;
  canvas.height = h;
  var context = canvas.getContext('2d');
  context.clearRect(0, 0, w, h);
  context.drawImage(img, 0, 0);

  if (isNaN(radius) || radius < 1) {
    return;
  }

  if (blurAlphaChannel) {
    processCanvasRGBA(canvas, 0, 0, w, h, radius);
  } else {
    processCanvasRGB(canvas, 0, 0, w, h, radius);
  }
}
/**
 * @param {string|HTMLCanvasElement} canvas
 * @param {Integer} topX
 * @param {Integer} topY
 * @param {Integer} width
 * @param {Integer} height
 * @throws {Error|TypeError}
 * @returns {ImageData} See {@link https://html.spec.whatwg.org/multipage/canvas.html#imagedata}
 */


function getImageDataFromCanvas(canvas, topX, topY, width, height) {
  if (typeof canvas === 'string') {
    canvas = document.getElementById(canvas);
  }

  if (!canvas || _typeof(canvas) !== 'object' || !('getContext' in canvas)) {
    throw new TypeError('Expecting canvas with `getContext` method ' + 'in processCanvasRGB(A) calls!');
  }

  var context = canvas.getContext('2d');

  try {
    return context.getImageData(topX, topY, width, height);
  } catch (e) {
    throw new Error('unable to access image data: ' + e);
  }
}
/**
 * @param {HTMLCanvasElement} canvas
 * @param {Integer} topX
 * @param {Integer} topY
 * @param {Integer} width
 * @param {Integer} height
 * @param {Float} radius
 * @returns {undefined}
 */


function processCanvasRGBA(canvas, topX, topY, width, height, radius) {
  if (isNaN(radius) || radius < 1) {
    return;
  }

  radius |= 0;
  var imageData = getImageDataFromCanvas(canvas, topX, topY, width, height);
  imageData = processImageDataRGBA(imageData, topX, topY, width, height, radius);
  canvas.getContext('2d').putImageData(imageData, topX, topY);
}
/**
 * @param {ImageData} imageData
 * @param {Integer} topX
 * @param {Integer} topY
 * @param {Integer} width
 * @param {Integer} height
 * @param {Float} radius
 * @returns {ImageData}
 */


function processImageDataRGBA(imageData, topX, topY, width, height, radius) {
  var pixels = imageData.data;
  var x, y, i, p, yp, yi, yw, rSum, gSum, bSum, aSum, rOutSum, gOutSum, bOutSum, aOutSum, rInSum, gInSum, bInSum, aInSum, pr, pg, pb, pa, rbs;
  var div = 2 * radius + 1; // const w4 = width << 2;

  var widthMinus1 = width - 1;
  var heightMinus1 = height - 1;
  var radiusPlus1 = radius + 1;
  var sumFactor = radiusPlus1 * (radiusPlus1 + 1) / 2;
  var stackStart = new BlurStack();
  var stack = stackStart;
  var stackEnd;

  for (i = 1; i < div; i++) {
    stack = stack.next = new BlurStack();

    if (i === radiusPlus1) {
      stackEnd = stack;
    }
  }

  stack.next = stackStart;
  var stackIn = null;
  var stackOut = null;
  yw = yi = 0;
  var mulSum = mulTable[radius];
  var shgSum = shgTable[radius];

  for (y = 0; y < height; y++) {
    rInSum = gInSum = bInSum = aInSum = rSum = gSum = bSum = aSum = 0;
    rOutSum = radiusPlus1 * (pr = pixels[yi]);
    gOutSum = radiusPlus1 * (pg = pixels[yi + 1]);
    bOutSum = radiusPlus1 * (pb = pixels[yi + 2]);
    aOutSum = radiusPlus1 * (pa = pixels[yi + 3]);
    rSum += sumFactor * pr;
    gSum += sumFactor * pg;
    bSum += sumFactor * pb;
    aSum += sumFactor * pa;
    stack = stackStart;

    for (i = 0; i < radiusPlus1; i++) {
      stack.r = pr;
      stack.g = pg;
      stack.b = pb;
      stack.a = pa;
      stack = stack.next;
    }

    for (i = 1; i < radiusPlus1; i++) {
      p = yi + ((widthMinus1 < i ? widthMinus1 : i) << 2);
      rSum += (stack.r = pr = pixels[p]) * (rbs = radiusPlus1 - i);
      gSum += (stack.g = pg = pixels[p + 1]) * rbs;
      bSum += (stack.b = pb = pixels[p + 2]) * rbs;
      aSum += (stack.a = pa = pixels[p + 3]) * rbs;
      rInSum += pr;
      gInSum += pg;
      bInSum += pb;
      aInSum += pa;
      stack = stack.next;
    }

    stackIn = stackStart;
    stackOut = stackEnd;

    for (x = 0; x < width; x++) {
      pixels[yi + 3] = pa = aSum * mulSum >> shgSum;

      if (pa !== 0) {
        pa = 255 / pa;
        pixels[yi] = (rSum * mulSum >> shgSum) * pa;
        pixels[yi + 1] = (gSum * mulSum >> shgSum) * pa;
        pixels[yi + 2] = (bSum * mulSum >> shgSum) * pa;
      } else {
        pixels[yi] = pixels[yi + 1] = pixels[yi + 2] = 0;
      }

      rSum -= rOutSum;
      gSum -= gOutSum;
      bSum -= bOutSum;
      aSum -= aOutSum;
      rOutSum -= stackIn.r;
      gOutSum -= stackIn.g;
      bOutSum -= stackIn.b;
      aOutSum -= stackIn.a;
      p = yw + ((p = x + radius + 1) < widthMinus1 ? p : widthMinus1) << 2;
      rInSum += stackIn.r = pixels[p];
      gInSum += stackIn.g = pixels[p + 1];
      bInSum += stackIn.b = pixels[p + 2];
      aInSum += stackIn.a = pixels[p + 3];
      rSum += rInSum;
      gSum += gInSum;
      bSum += bInSum;
      aSum += aInSum;
      stackIn = stackIn.next;
      rOutSum += pr = stackOut.r;
      gOutSum += pg = stackOut.g;
      bOutSum += pb = stackOut.b;
      aOutSum += pa = stackOut.a;
      rInSum -= pr;
      gInSum -= pg;
      bInSum -= pb;
      aInSum -= pa;
      stackOut = stackOut.next;
      yi += 4;
    }

    yw += width;
  }

  for (x = 0; x < width; x++) {
    gInSum = bInSum = aInSum = rInSum = gSum = bSum = aSum = rSum = 0;
    yi = x << 2;
    rOutSum = radiusPlus1 * (pr = pixels[yi]);
    gOutSum = radiusPlus1 * (pg = pixels[yi + 1]);
    bOutSum = radiusPlus1 * (pb = pixels[yi + 2]);
    aOutSum = radiusPlus1 * (pa = pixels[yi + 3]);
    rSum += sumFactor * pr;
    gSum += sumFactor * pg;
    bSum += sumFactor * pb;
    aSum += sumFactor * pa;
    stack = stackStart;

    for (i = 0; i < radiusPlus1; i++) {
      stack.r = pr;
      stack.g = pg;
      stack.b = pb;
      stack.a = pa;
      stack = stack.next;
    }

    yp = width;

    for (i = 1; i <= radius; i++) {
      yi = yp + x << 2;
      rSum += (stack.r = pr = pixels[yi]) * (rbs = radiusPlus1 - i);
      gSum += (stack.g = pg = pixels[yi + 1]) * rbs;
      bSum += (stack.b = pb = pixels[yi + 2]) * rbs;
      aSum += (stack.a = pa = pixels[yi + 3]) * rbs;
      rInSum += pr;
      gInSum += pg;
      bInSum += pb;
      aInSum += pa;
      stack = stack.next;

      if (i < heightMinus1) {
        yp += width;
      }
    }

    yi = x;
    stackIn = stackStart;
    stackOut = stackEnd;

    for (y = 0; y < height; y++) {
      p = yi << 2;
      pixels[p + 3] = pa = aSum * mulSum >> shgSum;

      if (pa > 0) {
        pa = 255 / pa;
        pixels[p] = (rSum * mulSum >> shgSum) * pa;
        pixels[p + 1] = (gSum * mulSum >> shgSum) * pa;
        pixels[p + 2] = (bSum * mulSum >> shgSum) * pa;
      } else {
        pixels[p] = pixels[p + 1] = pixels[p + 2] = 0;
      }

      rSum -= rOutSum;
      gSum -= gOutSum;
      bSum -= bOutSum;
      aSum -= aOutSum;
      rOutSum -= stackIn.r;
      gOutSum -= stackIn.g;
      bOutSum -= stackIn.b;
      aOutSum -= stackIn.a;
      p = x + ((p = y + radiusPlus1) < heightMinus1 ? p : heightMinus1) * width << 2;
      rSum += rInSum += stackIn.r = pixels[p];
      gSum += gInSum += stackIn.g = pixels[p + 1];
      bSum += bInSum += stackIn.b = pixels[p + 2];
      aSum += aInSum += stackIn.a = pixels[p + 3];
      stackIn = stackIn.next;
      rOutSum += pr = stackOut.r;
      gOutSum += pg = stackOut.g;
      bOutSum += pb = stackOut.b;
      aOutSum += pa = stackOut.a;
      rInSum -= pr;
      gInSum -= pg;
      bInSum -= pb;
      aInSum -= pa;
      stackOut = stackOut.next;
      yi += width;
    }
  }

  return imageData;
}
/**
 * @param {HTMLCanvasElement} canvas
 * @param {Integer} topX
 * @param {Integer} topY
 * @param {Integer} width
 * @param {Integer} height
 * @param {Float} radius
 * @returns {undefined}
 */


function processCanvasRGB(canvas, topX, topY, width, height, radius) {
  if (isNaN(radius) || radius < 1) {
    return;
  }

  radius |= 0;
  var imageData = getImageDataFromCanvas(canvas, topX, topY, width, height);
  imageData = processImageDataRGB(imageData, topX, topY, width, height, radius);
  canvas.getContext('2d').putImageData(imageData, topX, topY);
}
/**
 * @param {ImageData} imageData
 * @param {Integer} topX
 * @param {Integer} topY
 * @param {Integer} width
 * @param {Integer} height
 * @param {Float} radius
 * @returns {ImageData}
 */


function processImageDataRGB(imageData, topX, topY, width, height, radius) {
  var pixels = imageData.data;
  var x, y, i, p, yp, yi, yw, rSum, gSum, bSum, rOutSum, gOutSum, bOutSum, rInSum, gInSum, bInSum, pr, pg, pb, rbs;
  var div = 2 * radius + 1; // const w4 = width << 2;

  var widthMinus1 = width - 1;
  var heightMinus1 = height - 1;
  var radiusPlus1 = radius + 1;
  var sumFactor = radiusPlus1 * (radiusPlus1 + 1) / 2;
  var stackStart = new BlurStack();
  var stack = stackStart;
  var stackEnd;

  for (i = 1; i < div; i++) {
    stack = stack.next = new BlurStack();

    if (i === radiusPlus1) {
      stackEnd = stack;
    }
  }

  stack.next = stackStart;
  var stackIn = null;
  var stackOut = null;
  yw = yi = 0;
  var mulSum = mulTable[radius];
  var shgSum = shgTable[radius];

  for (y = 0; y < height; y++) {
    rInSum = gInSum = bInSum = rSum = gSum = bSum = 0;
    rOutSum = radiusPlus1 * (pr = pixels[yi]);
    gOutSum = radiusPlus1 * (pg = pixels[yi + 1]);
    bOutSum = radiusPlus1 * (pb = pixels[yi + 2]);
    rSum += sumFactor * pr;
    gSum += sumFactor * pg;
    bSum += sumFactor * pb;
    stack = stackStart;

    for (i = 0; i < radiusPlus1; i++) {
      stack.r = pr;
      stack.g = pg;
      stack.b = pb;
      stack = stack.next;
    }

    for (i = 1; i < radiusPlus1; i++) {
      p = yi + ((widthMinus1 < i ? widthMinus1 : i) << 2);
      rSum += (stack.r = pr = pixels[p]) * (rbs = radiusPlus1 - i);
      gSum += (stack.g = pg = pixels[p + 1]) * rbs;
      bSum += (stack.b = pb = pixels[p + 2]) * rbs;
      rInSum += pr;
      gInSum += pg;
      bInSum += pb;
      stack = stack.next;
    }

    stackIn = stackStart;
    stackOut = stackEnd;

    for (x = 0; x < width; x++) {
      pixels[yi] = rSum * mulSum >> shgSum;
      pixels[yi + 1] = gSum * mulSum >> shgSum;
      pixels[yi + 2] = bSum * mulSum >> shgSum;
      rSum -= rOutSum;
      gSum -= gOutSum;
      bSum -= bOutSum;
      rOutSum -= stackIn.r;
      gOutSum -= stackIn.g;
      bOutSum -= stackIn.b;
      p = yw + ((p = x + radius + 1) < widthMinus1 ? p : widthMinus1) << 2;
      rInSum += stackIn.r = pixels[p];
      gInSum += stackIn.g = pixels[p + 1];
      bInSum += stackIn.b = pixels[p + 2];
      rSum += rInSum;
      gSum += gInSum;
      bSum += bInSum;
      stackIn = stackIn.next;
      rOutSum += pr = stackOut.r;
      gOutSum += pg = stackOut.g;
      bOutSum += pb = stackOut.b;
      rInSum -= pr;
      gInSum -= pg;
      bInSum -= pb;
      stackOut = stackOut.next;
      yi += 4;
    }

    yw += width;
  }

  for (x = 0; x < width; x++) {
    gInSum = bInSum = rInSum = gSum = bSum = rSum = 0;
    yi = x << 2;
    rOutSum = radiusPlus1 * (pr = pixels[yi]);
    gOutSum = radiusPlus1 * (pg = pixels[yi + 1]);
    bOutSum = radiusPlus1 * (pb = pixels[yi + 2]);
    rSum += sumFactor * pr;
    gSum += sumFactor * pg;
    bSum += sumFactor * pb;
    stack = stackStart;

    for (i = 0; i < radiusPlus1; i++) {
      stack.r = pr;
      stack.g = pg;
      stack.b = pb;
      stack = stack.next;
    }

    yp = width;

    for (i = 1; i <= radius; i++) {
      yi = yp + x << 2;
      rSum += (stack.r = pr = pixels[yi]) * (rbs = radiusPlus1 - i);
      gSum += (stack.g = pg = pixels[yi + 1]) * rbs;
      bSum += (stack.b = pb = pixels[yi + 2]) * rbs;
      rInSum += pr;
      gInSum += pg;
      bInSum += pb;
      stack = stack.next;

      if (i < heightMinus1) {
        yp += width;
      }
    }

    yi = x;
    stackIn = stackStart;
    stackOut = stackEnd;

    for (y = 0; y < height; y++) {
      p = yi << 2;
      pixels[p] = rSum * mulSum >> shgSum;
      pixels[p + 1] = gSum * mulSum >> shgSum;
      pixels[p + 2] = bSum * mulSum >> shgSum;
      rSum -= rOutSum;
      gSum -= gOutSum;
      bSum -= bOutSum;
      rOutSum -= stackIn.r;
      gOutSum -= stackIn.g;
      bOutSum -= stackIn.b;
      p = x + ((p = y + radiusPlus1) < heightMinus1 ? p : heightMinus1) * width << 2;
      rSum += rInSum += stackIn.r = pixels[p];
      gSum += gInSum += stackIn.g = pixels[p + 1];
      bSum += bInSum += stackIn.b = pixels[p + 2];
      stackIn = stackIn.next;
      rOutSum += pr = stackOut.r;
      gOutSum += pg = stackOut.g;
      bOutSum += pb = stackOut.b;
      rInSum -= pr;
      gInSum -= pg;
      bInSum -= pb;
      stackOut = stackOut.next;
      yi += width;
    }
  }

  return imageData;
}
/**
 *
 */


var BlurStack =
/**
 * Set properties.
 */
function BlurStack() {
  _classCallCheck(this, BlurStack);

  this.r = 0;
  this.g = 0;
  this.b = 0;
  this.a = 0;
  this.next = null;
};




/***/ }),
/* 330 */,
/* 331 */,
/* 332 */,
/* 333 */,
/* 334 */,
/* 335 */,
/* 336 */,
/* 337 */,
/* 338 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* WEBPACK VAR INJECTION */(function(process) {/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AElement", function() { return AElement; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AnimateColorElement", function() { return AnimateColorElement; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AnimateElement", function() { return AnimateElement; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AnimateTransformElement", function() { return AnimateTransformElement; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "BoundingBox", function() { return BoundingBox; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CB1", function() { return CB1; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CB2", function() { return CB2; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CB3", function() { return CB3; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CB4", function() { return CB4; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Canvg", function() { return Canvg; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CircleElement", function() { return CircleElement; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ClipPathElement", function() { return ClipPathElement; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "DefsElement", function() { return DefsElement; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "DescElement", function() { return DescElement; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Document", function() { return Document; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Element", function() { return Element; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "EllipseElement", function() { return EllipseElement; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "FeColorMatrixElement", function() { return FeColorMatrixElement; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "FeCompositeElement", function() { return FeCompositeElement; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "FeDropShadowElement", function() { return FeDropShadowElement; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "FeGaussianBlurElement", function() { return FeGaussianBlurElement; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "FeMorphologyElement", function() { return FeMorphologyElement; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "FilterElement", function() { return FilterElement; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Font", function() { return Font; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "FontElement", function() { return FontElement; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "FontFaceElement", function() { return FontFaceElement; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "GElement", function() { return GElement; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "GlyphElement", function() { return GlyphElement; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "GradientElement", function() { return GradientElement; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ImageElement", function() { return ImageElement; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "LineElement", function() { return LineElement; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "LinearGradientElement", function() { return LinearGradientElement; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "MarkerElement", function() { return MarkerElement; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "MaskElement", function() { return MaskElement; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Matrix", function() { return Matrix; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "MissingGlyphElement", function() { return MissingGlyphElement; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Mouse", function() { return Mouse; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "PSEUDO_ZERO", function() { return PSEUDO_ZERO; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Parser", function() { return Parser; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "PathElement", function() { return PathElement; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "PathParser", function() { return PathParser; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "PatternElement", function() { return PatternElement; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Point", function() { return Point; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "PolygonElement", function() { return PolygonElement; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "PolylineElement", function() { return PolylineElement; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Property", function() { return Property; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "QB1", function() { return QB1; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "QB2", function() { return QB2; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "QB3", function() { return QB3; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "RadialGradientElement", function() { return RadialGradientElement; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "RectElement", function() { return RectElement; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "RenderedElement", function() { return RenderedElement; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Rotate", function() { return Rotate; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SVGElement", function() { return SVGElement; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SVGFontLoader", function() { return SVGFontLoader; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Scale", function() { return Scale; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Screen", function() { return Screen; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Skew", function() { return Skew; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SkewX", function() { return SkewX; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SkewY", function() { return SkewY; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "StopElement", function() { return StopElement; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "StyleElement", function() { return StyleElement; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SymbolElement", function() { return SymbolElement; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "TRefElement", function() { return TRefElement; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "TSpanElement", function() { return TSpanElement; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "TextElement", function() { return TextElement; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "TextPathElement", function() { return TextPathElement; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "TitleElement", function() { return TitleElement; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Transform", function() { return Transform; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Translate", function() { return Translate; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "UnknownElement", function() { return UnknownElement; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "UseElement", function() { return UseElement; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ViewPort", function() { return ViewPort; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "compressSpaces", function() { return compressSpaces; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getSelectorSpecificity", function() { return getSelectorSpecificity; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "normalizeAttributeName", function() { return normalizeAttributeName; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "parseExternalUrl", function() { return parseExternalUrl; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "presets", function() { return index; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "toNumbers", function() { return toNumbers; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "trimLeft", function() { return trimLeft; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "trimRight", function() { return trimRight; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "vectorMagnitude", function() { return vectorMagnitude; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "vectorsAngle", function() { return vectorsAngle; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "vectorsRatio", function() { return vectorsRatio; });
/* harmony import */ var core_js_modules_es_array_map__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(245);
/* harmony import */ var core_js_modules_es_array_map__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_array_map__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var core_js_modules_es_parse_float__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(247);
/* harmony import */ var core_js_modules_es_parse_float__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_parse_float__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var core_js_modules_es_regexp_exec__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(213);
/* harmony import */ var core_js_modules_es_regexp_exec__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_regexp_exec__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var core_js_modules_es_string_match__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(250);
/* harmony import */ var core_js_modules_es_string_match__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_string_match__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var core_js_modules_es_string_replace__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(251);
/* harmony import */ var core_js_modules_es_string_replace__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_string_replace__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var core_js_modules_es_array_join__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(252);
/* harmony import */ var core_js_modules_es_array_join__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_array_join__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _babel_runtime_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(253);
/* harmony import */ var _babel_runtime_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_6__);
/* harmony import */ var core_js_modules_es_symbol__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(259);
/* harmony import */ var core_js_modules_es_symbol__WEBPACK_IMPORTED_MODULE_7___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_symbol__WEBPACK_IMPORTED_MODULE_7__);
/* harmony import */ var core_js_modules_es_array_filter__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(261);
/* harmony import */ var core_js_modules_es_array_filter__WEBPACK_IMPORTED_MODULE_8___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_array_filter__WEBPACK_IMPORTED_MODULE_8__);
/* harmony import */ var core_js_modules_es_array_for_each__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(262);
/* harmony import */ var core_js_modules_es_array_for_each__WEBPACK_IMPORTED_MODULE_9___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_array_for_each__WEBPACK_IMPORTED_MODULE_9__);
/* harmony import */ var core_js_modules_es_object_define_properties__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(263);
/* harmony import */ var core_js_modules_es_object_define_properties__WEBPACK_IMPORTED_MODULE_10___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_object_define_properties__WEBPACK_IMPORTED_MODULE_10__);
/* harmony import */ var core_js_modules_es_object_define_property__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(264);
/* harmony import */ var core_js_modules_es_object_define_property__WEBPACK_IMPORTED_MODULE_11___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_object_define_property__WEBPACK_IMPORTED_MODULE_11__);
/* harmony import */ var core_js_modules_es_object_get_own_property_descriptor__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(265);
/* harmony import */ var core_js_modules_es_object_get_own_property_descriptor__WEBPACK_IMPORTED_MODULE_12___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_object_get_own_property_descriptor__WEBPACK_IMPORTED_MODULE_12__);
/* harmony import */ var core_js_modules_es_object_get_own_property_descriptors__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(266);
/* harmony import */ var core_js_modules_es_object_get_own_property_descriptors__WEBPACK_IMPORTED_MODULE_13___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_object_get_own_property_descriptors__WEBPACK_IMPORTED_MODULE_13__);
/* harmony import */ var core_js_modules_es_object_keys__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(267);
/* harmony import */ var core_js_modules_es_object_keys__WEBPACK_IMPORTED_MODULE_14___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_object_keys__WEBPACK_IMPORTED_MODULE_14__);
/* harmony import */ var core_js_modules_web_dom_collections_for_each__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(268);
/* harmony import */ var core_js_modules_web_dom_collections_for_each__WEBPACK_IMPORTED_MODULE_15___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_web_dom_collections_for_each__WEBPACK_IMPORTED_MODULE_15__);
/* harmony import */ var _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(269);
/* harmony import */ var _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_16___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_16__);
/* harmony import */ var _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(271);
/* harmony import */ var _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_17___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_17__);
/* harmony import */ var _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(272);
/* harmony import */ var _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_18___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_18__);
/* harmony import */ var _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_19__ = __webpack_require__(273);
/* harmony import */ var _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_19___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_19__);
/* harmony import */ var _babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_20__ = __webpack_require__(274);
/* harmony import */ var _babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_20___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_20__);
/* harmony import */ var core_js_modules_es_array_concat__WEBPACK_IMPORTED_MODULE_21__ = __webpack_require__(275);
/* harmony import */ var core_js_modules_es_array_concat__WEBPACK_IMPORTED_MODULE_21___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_array_concat__WEBPACK_IMPORTED_MODULE_21__);
/* harmony import */ var core_js_modules_es_array_every__WEBPACK_IMPORTED_MODULE_22__ = __webpack_require__(276);
/* harmony import */ var core_js_modules_es_array_every__WEBPACK_IMPORTED_MODULE_22___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_array_every__WEBPACK_IMPORTED_MODULE_22__);
/* harmony import */ var core_js_modules_es_array_reduce__WEBPACK_IMPORTED_MODULE_23__ = __webpack_require__(277);
/* harmony import */ var core_js_modules_es_array_reduce__WEBPACK_IMPORTED_MODULE_23___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_array_reduce__WEBPACK_IMPORTED_MODULE_23__);
/* harmony import */ var core_js_modules_es_date_to_string__WEBPACK_IMPORTED_MODULE_24__ = __webpack_require__(279);
/* harmony import */ var core_js_modules_es_date_to_string__WEBPACK_IMPORTED_MODULE_24___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_date_to_string__WEBPACK_IMPORTED_MODULE_24__);
/* harmony import */ var core_js_modules_es_object_to_string__WEBPACK_IMPORTED_MODULE_25__ = __webpack_require__(280);
/* harmony import */ var core_js_modules_es_object_to_string__WEBPACK_IMPORTED_MODULE_25___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_object_to_string__WEBPACK_IMPORTED_MODULE_25__);
/* harmony import */ var core_js_modules_es_promise__WEBPACK_IMPORTED_MODULE_26__ = __webpack_require__(282);
/* harmony import */ var core_js_modules_es_promise__WEBPACK_IMPORTED_MODULE_26___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_promise__WEBPACK_IMPORTED_MODULE_26__);
/* harmony import */ var core_js_modules_es_string_split__WEBPACK_IMPORTED_MODULE_27__ = __webpack_require__(288);
/* harmony import */ var core_js_modules_es_string_split__WEBPACK_IMPORTED_MODULE_27___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_string_split__WEBPACK_IMPORTED_MODULE_27__);
/* harmony import */ var raf__WEBPACK_IMPORTED_MODULE_28__ = __webpack_require__(289);
/* harmony import */ var raf__WEBPACK_IMPORTED_MODULE_28___default = /*#__PURE__*/__webpack_require__.n(raf__WEBPACK_IMPORTED_MODULE_28__);
/* harmony import */ var core_js_modules_es_function_name__WEBPACK_IMPORTED_MODULE_29__ = __webpack_require__(291);
/* harmony import */ var core_js_modules_es_function_name__WEBPACK_IMPORTED_MODULE_29___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_function_name__WEBPACK_IMPORTED_MODULE_29__);
/* harmony import */ var rgbcolor__WEBPACK_IMPORTED_MODULE_30__ = __webpack_require__(292);
/* harmony import */ var rgbcolor__WEBPACK_IMPORTED_MODULE_30___default = /*#__PURE__*/__webpack_require__.n(rgbcolor__WEBPACK_IMPORTED_MODULE_30__);
/* harmony import */ var _babel_runtime_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_31__ = __webpack_require__(293);
/* harmony import */ var _babel_runtime_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_31___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_31__);
/* harmony import */ var _babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_32__ = __webpack_require__(234);
/* harmony import */ var _babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_32___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_32__);
/* harmony import */ var _babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_33__ = __webpack_require__(295);
/* harmony import */ var _babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_33___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_33__);
/* harmony import */ var core_js_modules_es_array_from__WEBPACK_IMPORTED_MODULE_34__ = __webpack_require__(297);
/* harmony import */ var core_js_modules_es_array_from__WEBPACK_IMPORTED_MODULE_34___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_array_from__WEBPACK_IMPORTED_MODULE_34__);
/* harmony import */ var core_js_modules_es_array_includes__WEBPACK_IMPORTED_MODULE_35__ = __webpack_require__(299);
/* harmony import */ var core_js_modules_es_array_includes__WEBPACK_IMPORTED_MODULE_35___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_array_includes__WEBPACK_IMPORTED_MODULE_35__);
/* harmony import */ var core_js_modules_es_array_some__WEBPACK_IMPORTED_MODULE_36__ = __webpack_require__(300);
/* harmony import */ var core_js_modules_es_array_some__WEBPACK_IMPORTED_MODULE_36___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_array_some__WEBPACK_IMPORTED_MODULE_36__);
/* harmony import */ var core_js_modules_es_string_includes__WEBPACK_IMPORTED_MODULE_37__ = __webpack_require__(301);
/* harmony import */ var core_js_modules_es_string_includes__WEBPACK_IMPORTED_MODULE_37___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_string_includes__WEBPACK_IMPORTED_MODULE_37__);
/* harmony import */ var core_js_modules_es_string_iterator__WEBPACK_IMPORTED_MODULE_38__ = __webpack_require__(304);
/* harmony import */ var core_js_modules_es_string_iterator__WEBPACK_IMPORTED_MODULE_38___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_string_iterator__WEBPACK_IMPORTED_MODULE_38__);
/* harmony import */ var core_js_modules_es_string_trim__WEBPACK_IMPORTED_MODULE_39__ = __webpack_require__(307);
/* harmony import */ var core_js_modules_es_string_trim__WEBPACK_IMPORTED_MODULE_39___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_string_trim__WEBPACK_IMPORTED_MODULE_39__);
/* harmony import */ var core_js_modules_es_array_index_of__WEBPACK_IMPORTED_MODULE_40__ = __webpack_require__(309);
/* harmony import */ var core_js_modules_es_array_index_of__WEBPACK_IMPORTED_MODULE_40___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_array_index_of__WEBPACK_IMPORTED_MODULE_40__);
/* harmony import */ var core_js_modules_es_array_reverse__WEBPACK_IMPORTED_MODULE_41__ = __webpack_require__(310);
/* harmony import */ var core_js_modules_es_array_reverse__WEBPACK_IMPORTED_MODULE_41___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_array_reverse__WEBPACK_IMPORTED_MODULE_41__);
/* harmony import */ var _babel_runtime_helpers_get__WEBPACK_IMPORTED_MODULE_42__ = __webpack_require__(311);
/* harmony import */ var _babel_runtime_helpers_get__WEBPACK_IMPORTED_MODULE_42___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_get__WEBPACK_IMPORTED_MODULE_42__);
/* harmony import */ var core_js_modules_es_number_constructor__WEBPACK_IMPORTED_MODULE_43__ = __webpack_require__(313);
/* harmony import */ var core_js_modules_es_number_constructor__WEBPACK_IMPORTED_MODULE_43___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_number_constructor__WEBPACK_IMPORTED_MODULE_43__);
/* harmony import */ var core_js_modules_es_regexp_to_string__WEBPACK_IMPORTED_MODULE_44__ = __webpack_require__(314);
/* harmony import */ var core_js_modules_es_regexp_to_string__WEBPACK_IMPORTED_MODULE_44___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_regexp_to_string__WEBPACK_IMPORTED_MODULE_44__);
/* harmony import */ var core_js_modules_es_array_fill__WEBPACK_IMPORTED_MODULE_45__ = __webpack_require__(315);
/* harmony import */ var core_js_modules_es_array_fill__WEBPACK_IMPORTED_MODULE_45___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_array_fill__WEBPACK_IMPORTED_MODULE_45__);
/* harmony import */ var core_js_modules_es_reflect_delete_property__WEBPACK_IMPORTED_MODULE_46__ = __webpack_require__(317);
/* harmony import */ var core_js_modules_es_reflect_delete_property__WEBPACK_IMPORTED_MODULE_46___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_reflect_delete_property__WEBPACK_IMPORTED_MODULE_46__);
/* harmony import */ var _babel_runtime_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_47__ = __webpack_require__(233);
/* harmony import */ var _babel_runtime_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_47___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_47__);
/* harmony import */ var core_js_modules_es_array_iterator__WEBPACK_IMPORTED_MODULE_48__ = __webpack_require__(239);
/* harmony import */ var core_js_modules_es_array_iterator__WEBPACK_IMPORTED_MODULE_48___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_array_iterator__WEBPACK_IMPORTED_MODULE_48__);
/* harmony import */ var core_js_modules_web_dom_collections_iterator__WEBPACK_IMPORTED_MODULE_49__ = __webpack_require__(318);
/* harmony import */ var core_js_modules_web_dom_collections_iterator__WEBPACK_IMPORTED_MODULE_49___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_web_dom_collections_iterator__WEBPACK_IMPORTED_MODULE_49__);
/* harmony import */ var core_js_modules_es_parse_int__WEBPACK_IMPORTED_MODULE_50__ = __webpack_require__(319);
/* harmony import */ var core_js_modules_es_parse_int__WEBPACK_IMPORTED_MODULE_50___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_parse_int__WEBPACK_IMPORTED_MODULE_50__);
/* harmony import */ var core_js_modules_es_symbol_description__WEBPACK_IMPORTED_MODULE_51__ = __webpack_require__(321);
/* harmony import */ var core_js_modules_es_symbol_description__WEBPACK_IMPORTED_MODULE_51___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_symbol_description__WEBPACK_IMPORTED_MODULE_51__);
/* harmony import */ var core_js_modules_es_symbol_iterator__WEBPACK_IMPORTED_MODULE_52__ = __webpack_require__(322);
/* harmony import */ var core_js_modules_es_symbol_iterator__WEBPACK_IMPORTED_MODULE_52___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_symbol_iterator__WEBPACK_IMPORTED_MODULE_52__);
/* harmony import */ var core_js_modules_es_map__WEBPACK_IMPORTED_MODULE_53__ = __webpack_require__(323);
/* harmony import */ var core_js_modules_es_map__WEBPACK_IMPORTED_MODULE_53___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_map__WEBPACK_IMPORTED_MODULE_53__);
/* harmony import */ var core_js_modules_es_reflect_apply__WEBPACK_IMPORTED_MODULE_54__ = __webpack_require__(327);
/* harmony import */ var core_js_modules_es_reflect_apply__WEBPACK_IMPORTED_MODULE_54___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_reflect_apply__WEBPACK_IMPORTED_MODULE_54__);
/* harmony import */ var core_js_modules_es_reflect_get_prototype_of__WEBPACK_IMPORTED_MODULE_55__ = __webpack_require__(328);
/* harmony import */ var core_js_modules_es_reflect_get_prototype_of__WEBPACK_IMPORTED_MODULE_55___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_reflect_get_prototype_of__WEBPACK_IMPORTED_MODULE_55__);
/* harmony import */ var stackblur_canvas__WEBPACK_IMPORTED_MODULE_56__ = __webpack_require__(329);


























































/**
 * HTML-safe compress white-spaces.
 * @param str - String to compress.
 */
function compressSpaces(str) {
  return str.replace(/(?!\u3000)\s+/gm, ' ');
}
/**
 * HTML-safe left trim.
 * @param str - String to trim.
 */

function trimLeft(str) {
  return str.replace(/^[\n \t]+/, '');
}
/**
 * HTML-safe right trim.
 * @param str - String to trim.
 */

function trimRight(str) {
  return str.replace(/[\n \t]+$/, '');
}
/**
 * String to numbers array.
 * @param str - Numbers string.
 */

function toNumbers(str) {
  var matches = (str || '').match(/-?(\d+(?:\.\d*(?:[eE][+-]?\d+)?)?|\.\d+)(?=\D|$)/gm) || [];
  return matches.map(parseFloat);
} // Microsoft Edge fix

var allUppercase = /^[A-Z-]+$/;
/**
 * Normalize attribute name.
 * @param name - Attribute name.
 */

function normalizeAttributeName(name) {
  if (allUppercase.test(name)) {
    return name.toLowerCase();
  }

  return name;
}
/**
 * Parse external URL.
 * @param url - CSS url string.
 */

function parseExternalUrl(url) {
  //                                   single quotes [2]
  //                                   v           double quotes [3]
  //                                   v           v        no quotes [4]
  //                                   v           v        v
  var urlMatch = url.match(/url\(('([^']+)'|"([^"]+)"|([^'"\)]+))\)/) || [];
  return urlMatch[2] || urlMatch[3] || urlMatch[4];
}

// slightly modified version of https://github.com/keeganstreet/specificity/blob/master/specificity.js
var attributeRegex = /(\[[^\]]+\])/g;
var idRegex = /(#[^\s\+>~\.\[:]+)/g;
var classRegex = /(\.[^\s\+>~\.\[:]+)/g;
var pseudoElementRegex = /(::[^\s\+>~\.\[:]+|:first-line|:first-letter|:before|:after)/gi;
var pseudoClassWithBracketsRegex = /(:[\w-]+\([^\)]*\))/gi;
var pseudoClassRegex = /(:[^\s\+>~\.\[:]+)/g;
var elementRegex = /([^\s\+>~\.\[:]+)/g;

function findSelectorMatch(selector, regex) {
  var matches = selector.match(regex);

  if (!matches) {
    return [selector, 0];
  }

  return [selector.replace(regex, ' '), matches.length];
}
/**
 * Measure selector specificity.
 * @param selector - Selector to measure.
 */


function getSelectorSpecificity(selector) {
  var specificity = [0, 0, 0];
  var currentSelector = selector.replace(/:not\(([^\)]*)\)/g, '     $1 ').replace(/{[\s\S]*/gm, ' ');
  var delta = 0;

  var _findSelectorMatch = findSelectorMatch(currentSelector, attributeRegex);

  var _findSelectorMatch2 = _babel_runtime_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_6___default()(_findSelectorMatch, 2);

  currentSelector = _findSelectorMatch2[0];
  delta = _findSelectorMatch2[1];
  specificity[1] += delta;

  var _findSelectorMatch3 = findSelectorMatch(currentSelector, idRegex);

  var _findSelectorMatch4 = _babel_runtime_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_6___default()(_findSelectorMatch3, 2);

  currentSelector = _findSelectorMatch4[0];
  delta = _findSelectorMatch4[1];
  specificity[0] += delta;

  var _findSelectorMatch5 = findSelectorMatch(currentSelector, classRegex);

  var _findSelectorMatch6 = _babel_runtime_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_6___default()(_findSelectorMatch5, 2);

  currentSelector = _findSelectorMatch6[0];
  delta = _findSelectorMatch6[1];
  specificity[1] += delta;

  var _findSelectorMatch7 = findSelectorMatch(currentSelector, pseudoElementRegex);

  var _findSelectorMatch8 = _babel_runtime_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_6___default()(_findSelectorMatch7, 2);

  currentSelector = _findSelectorMatch8[0];
  delta = _findSelectorMatch8[1];
  specificity[2] += delta;

  var _findSelectorMatch9 = findSelectorMatch(currentSelector, pseudoClassWithBracketsRegex);

  var _findSelectorMatch10 = _babel_runtime_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_6___default()(_findSelectorMatch9, 2);

  currentSelector = _findSelectorMatch10[0];
  delta = _findSelectorMatch10[1];
  specificity[1] += delta;

  var _findSelectorMatch11 = findSelectorMatch(currentSelector, pseudoClassRegex);

  var _findSelectorMatch12 = _babel_runtime_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_6___default()(_findSelectorMatch11, 2);

  currentSelector = _findSelectorMatch12[0];
  delta = _findSelectorMatch12[1];
  specificity[1] += delta;
  currentSelector = currentSelector.replace(/[\*\s\+>~]/g, ' ').replace(/[#\.]/g, ' ');

  var _findSelectorMatch13 = findSelectorMatch(currentSelector, elementRegex);

  var _findSelectorMatch14 = _babel_runtime_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_6___default()(_findSelectorMatch13, 2);

  currentSelector = _findSelectorMatch14[0];
  delta = _findSelectorMatch14[1];
  // lgtm [js/useless-assignment-to-local]
  specificity[2] += delta;
  return specificity.join('');
}

var PSEUDO_ZERO = .00000001;
/**
 * Vector magnitude.
 */

function vectorMagnitude(v) {
  return Math.sqrt(Math.pow(v[0], 2) + Math.pow(v[1], 2));
}
/**
 * Ratio between two vectors.
 */

function vectorsRatio(u, v) {
  return (u[0] * v[0] + u[1] * v[1]) / (vectorMagnitude(u) * vectorMagnitude(v));
}
/**
 * Angle between two vectors.
 */

function vectorsAngle(u, v) {
  return (u[0] * v[1] < u[1] * v[0] ? -1 : 1) * Math.acos(vectorsRatio(u, v));
}
function CB1(t) {
  return t * t * t;
}
function CB2(t) {
  return 3 * t * t * (1 - t);
}
function CB3(t) {
  return 3 * t * (1 - t) * (1 - t);
}
function CB4(t) {
  return (1 - t) * (1 - t) * (1 - t);
}
function QB1(t) {
  return t * t;
}
function QB2(t) {
  return 2 * t * (1 - t);
}
function QB3(t) {
  return (1 - t) * (1 - t);
}

function createCommonjsModule(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

var runtime_1 = createCommonjsModule(function (module) {
  /**
   * Copyright (c) 2014-present, Facebook, Inc.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE file in the root directory of this source tree.
   */
  var runtime = function (exports) {

    var Op = Object.prototype;
    var hasOwn = Op.hasOwnProperty;
    var undefined$1; // More compressible than void 0.

    var $Symbol = typeof Symbol === "function" ? Symbol : {};
    var iteratorSymbol = $Symbol.iterator || "@@iterator";
    var asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator";
    var toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag";

    function wrap(innerFn, outerFn, self, tryLocsList) {
      // If outerFn provided and outerFn.prototype is a Generator, then outerFn.prototype instanceof Generator.
      var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator;
      var generator = Object.create(protoGenerator.prototype);
      var context = new Context(tryLocsList || []); // The ._invoke method unifies the implementations of the .next,
      // .throw, and .return methods.

      generator._invoke = makeInvokeMethod(innerFn, self, context);
      return generator;
    }

    exports.wrap = wrap; // Try/catch helper to minimize deoptimizations. Returns a completion
    // record like context.tryEntries[i].completion. This interface could
    // have been (and was previously) designed to take a closure to be
    // invoked without arguments, but in all the cases we care about we
    // already have an existing method we want to call, so there's no need
    // to create a new function object. We can even get away with assuming
    // the method takes exactly one argument, since that happens to be true
    // in every case, so we don't have to touch the arguments object. The
    // only additional allocation required is the completion record, which
    // has a stable shape and so hopefully should be cheap to allocate.

    function tryCatch(fn, obj, arg) {
      try {
        return {
          type: "normal",
          arg: fn.call(obj, arg)
        };
      } catch (err) {
        return {
          type: "throw",
          arg: err
        };
      }
    }

    var GenStateSuspendedStart = "suspendedStart";
    var GenStateSuspendedYield = "suspendedYield";
    var GenStateExecuting = "executing";
    var GenStateCompleted = "completed"; // Returning this object from the innerFn has the same effect as
    // breaking out of the dispatch switch statement.

    var ContinueSentinel = {}; // Dummy constructor functions that we use as the .constructor and
    // .constructor.prototype properties for functions that return Generator
    // objects. For full spec compliance, you may wish to configure your
    // minifier not to mangle the names of these two functions.

    function Generator() {}

    function GeneratorFunction() {}

    function GeneratorFunctionPrototype() {} // This is a polyfill for %IteratorPrototype% for environments that
    // don't natively support it.


    var IteratorPrototype = {};

    IteratorPrototype[iteratorSymbol] = function () {
      return this;
    };

    var getProto = Object.getPrototypeOf;
    var NativeIteratorPrototype = getProto && getProto(getProto(values([])));

    if (NativeIteratorPrototype && NativeIteratorPrototype !== Op && hasOwn.call(NativeIteratorPrototype, iteratorSymbol)) {
      // This environment has a native %IteratorPrototype%; use it instead
      // of the polyfill.
      IteratorPrototype = NativeIteratorPrototype;
    }

    var Gp = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(IteratorPrototype);
    GeneratorFunction.prototype = Gp.constructor = GeneratorFunctionPrototype;
    GeneratorFunctionPrototype.constructor = GeneratorFunction;
    GeneratorFunctionPrototype[toStringTagSymbol] = GeneratorFunction.displayName = "GeneratorFunction"; // Helper for defining the .next, .throw, and .return methods of the
    // Iterator interface in terms of a single ._invoke method.

    function defineIteratorMethods(prototype) {
      ["next", "throw", "return"].forEach(function (method) {
        prototype[method] = function (arg) {
          return this._invoke(method, arg);
        };
      });
    }

    exports.isGeneratorFunction = function (genFun) {
      var ctor = typeof genFun === "function" && genFun.constructor;
      return ctor ? ctor === GeneratorFunction || // For the native GeneratorFunction constructor, the best we can
      // do is to check its .name property.
      (ctor.displayName || ctor.name) === "GeneratorFunction" : false;
    };

    exports.mark = function (genFun) {
      if (Object.setPrototypeOf) {
        Object.setPrototypeOf(genFun, GeneratorFunctionPrototype);
      } else {
        genFun.__proto__ = GeneratorFunctionPrototype;

        if (!(toStringTagSymbol in genFun)) {
          genFun[toStringTagSymbol] = "GeneratorFunction";
        }
      }

      genFun.prototype = Object.create(Gp);
      return genFun;
    }; // Within the body of any async function, `await x` is transformed to
    // `yield regeneratorRuntime.awrap(x)`, so that the runtime can test
    // `hasOwn.call(value, "__await")` to determine if the yielded value is
    // meant to be awaited.


    exports.awrap = function (arg) {
      return {
        __await: arg
      };
    };

    function AsyncIterator(generator) {
      function invoke(method, arg, resolve, reject) {
        var record = tryCatch(generator[method], generator, arg);

        if (record.type === "throw") {
          reject(record.arg);
        } else {
          var result = record.arg;
          var value = result.value;

          if (value && typeof value === "object" && hasOwn.call(value, "__await")) {
            return Promise.resolve(value.__await).then(function (value) {
              invoke("next", value, resolve, reject);
            }, function (err) {
              invoke("throw", err, resolve, reject);
            });
          }

          return Promise.resolve(value).then(function (unwrapped) {
            // When a yielded Promise is resolved, its final value becomes
            // the .value of the Promise<{value,done}> result for the
            // current iteration.
            result.value = unwrapped;
            resolve(result);
          }, function (error) {
            // If a rejected Promise was yielded, throw the rejection back
            // into the async generator function so it can be handled there.
            return invoke("throw", error, resolve, reject);
          });
        }
      }

      var previousPromise;

      function enqueue(method, arg) {
        function callInvokeWithMethodAndArg() {
          return new Promise(function (resolve, reject) {
            invoke(method, arg, resolve, reject);
          });
        }

        return previousPromise = // If enqueue has been called before, then we want to wait until
        // all previous Promises have been resolved before calling invoke,
        // so that results are always delivered in the correct order. If
        // enqueue has not been called before, then it is important to
        // call invoke immediately, without waiting on a callback to fire,
        // so that the async generator function has the opportunity to do
        // any necessary setup in a predictable way. This predictability
        // is why the Promise constructor synchronously invokes its
        // executor callback, and why async functions synchronously
        // execute code before the first await. Since we implement simple
        // async functions in terms of async generators, it is especially
        // important to get this right, even though it requires care.
        previousPromise ? previousPromise.then(callInvokeWithMethodAndArg, // Avoid propagating failures to Promises returned by later
        // invocations of the iterator.
        callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg();
      } // Define the unified helper method that is used to implement .next,
      // .throw, and .return (see defineIteratorMethods).


      this._invoke = enqueue;
    }

    defineIteratorMethods(AsyncIterator.prototype);

    AsyncIterator.prototype[asyncIteratorSymbol] = function () {
      return this;
    };

    exports.AsyncIterator = AsyncIterator; // Note that simple async functions are implemented on top of
    // AsyncIterator objects; they just return a Promise for the value of
    // the final result produced by the iterator.

    exports.async = function (innerFn, outerFn, self, tryLocsList) {
      var iter = new AsyncIterator(wrap(innerFn, outerFn, self, tryLocsList));
      return exports.isGeneratorFunction(outerFn) ? iter // If outerFn is a generator, return the full iterator.
      : iter.next().then(function (result) {
        return result.done ? result.value : iter.next();
      });
    };

    function makeInvokeMethod(innerFn, self, context) {
      var state = GenStateSuspendedStart;
      return function invoke(method, arg) {
        if (state === GenStateExecuting) {
          throw new Error("Generator is already running");
        }

        if (state === GenStateCompleted) {
          if (method === "throw") {
            throw arg;
          } // Be forgiving, per 25.3.3.3.3 of the spec:
          // https://people.mozilla.org/~jorendorff/es6-draft.html#sec-generatorresume


          return doneResult();
        }

        context.method = method;
        context.arg = arg;

        while (true) {
          var delegate = context.delegate;

          if (delegate) {
            var delegateResult = maybeInvokeDelegate(delegate, context);

            if (delegateResult) {
              if (delegateResult === ContinueSentinel) continue;
              return delegateResult;
            }
          }

          if (context.method === "next") {
            // Setting context._sent for legacy support of Babel's
            // function.sent implementation.
            context.sent = context._sent = context.arg;
          } else if (context.method === "throw") {
            if (state === GenStateSuspendedStart) {
              state = GenStateCompleted;
              throw context.arg;
            }

            context.dispatchException(context.arg);
          } else if (context.method === "return") {
            context.abrupt("return", context.arg);
          }

          state = GenStateExecuting;
          var record = tryCatch(innerFn, self, context);

          if (record.type === "normal") {
            // If an exception is thrown from innerFn, we leave state ===
            // GenStateExecuting and loop back for another invocation.
            state = context.done ? GenStateCompleted : GenStateSuspendedYield;

            if (record.arg === ContinueSentinel) {
              continue;
            }

            return {
              value: record.arg,
              done: context.done
            };
          } else if (record.type === "throw") {
            state = GenStateCompleted; // Dispatch the exception by looping back around to the
            // context.dispatchException(context.arg) call above.

            context.method = "throw";
            context.arg = record.arg;
          }
        }
      };
    } // Call delegate.iterator[context.method](context.arg) and handle the
    // result, either by returning a { value, done } result from the
    // delegate iterator, or by modifying context.method and context.arg,
    // setting context.delegate to null, and returning the ContinueSentinel.


    function maybeInvokeDelegate(delegate, context) {
      var method = delegate.iterator[context.method];

      if (method === undefined$1) {
        // A .throw or .return when the delegate iterator has no .throw
        // method always terminates the yield* loop.
        context.delegate = null;

        if (context.method === "throw") {
          // Note: ["return"] must be used for ES3 parsing compatibility.
          if (delegate.iterator["return"]) {
            // If the delegate iterator has a return method, give it a
            // chance to clean up.
            context.method = "return";
            context.arg = undefined$1;
            maybeInvokeDelegate(delegate, context);

            if (context.method === "throw") {
              // If maybeInvokeDelegate(context) changed context.method from
              // "return" to "throw", let that override the TypeError below.
              return ContinueSentinel;
            }
          }

          context.method = "throw";
          context.arg = new TypeError("The iterator does not provide a 'throw' method");
        }

        return ContinueSentinel;
      }

      var record = tryCatch(method, delegate.iterator, context.arg);

      if (record.type === "throw") {
        context.method = "throw";
        context.arg = record.arg;
        context.delegate = null;
        return ContinueSentinel;
      }

      var info = record.arg;

      if (!info) {
        context.method = "throw";
        context.arg = new TypeError("iterator result is not an object");
        context.delegate = null;
        return ContinueSentinel;
      }

      if (info.done) {
        // Assign the result of the finished delegate to the temporary
        // variable specified by delegate.resultName (see delegateYield).
        context[delegate.resultName] = info.value; // Resume execution at the desired location (see delegateYield).

        context.next = delegate.nextLoc; // If context.method was "throw" but the delegate handled the
        // exception, let the outer generator proceed normally. If
        // context.method was "next", forget context.arg since it has been
        // "consumed" by the delegate iterator. If context.method was
        // "return", allow the original .return call to continue in the
        // outer generator.

        if (context.method !== "return") {
          context.method = "next";
          context.arg = undefined$1;
        }
      } else {
        // Re-yield the result returned by the delegate method.
        return info;
      } // The delegate iterator is finished, so forget it and continue with
      // the outer generator.


      context.delegate = null;
      return ContinueSentinel;
    } // Define Generator.prototype.{next,throw,return} in terms of the
    // unified ._invoke helper method.


    defineIteratorMethods(Gp);
    Gp[toStringTagSymbol] = "Generator"; // A Generator should always return itself as the iterator object when the
    // @@iterator function is called on it. Some browsers' implementations of the
    // iterator prototype chain incorrectly implement this, causing the Generator
    // object to not be returned from this call. This ensures that doesn't happen.
    // See https://github.com/facebook/regenerator/issues/274 for more details.

    Gp[iteratorSymbol] = function () {
      return this;
    };

    Gp.toString = function () {
      return "[object Generator]";
    };

    function pushTryEntry(locs) {
      var entry = {
        tryLoc: locs[0]
      };

      if (1 in locs) {
        entry.catchLoc = locs[1];
      }

      if (2 in locs) {
        entry.finallyLoc = locs[2];
        entry.afterLoc = locs[3];
      }

      this.tryEntries.push(entry);
    }

    function resetTryEntry(entry) {
      var record = entry.completion || {};
      record.type = "normal";
      delete record.arg;
      entry.completion = record;
    }

    function Context(tryLocsList) {
      // The root entry object (effectively a try statement without a catch
      // or a finally block) gives us a place to store values thrown from
      // locations where there is no enclosing try statement.
      this.tryEntries = [{
        tryLoc: "root"
      }];
      tryLocsList.forEach(pushTryEntry, this);
      this.reset(true);
    }

    exports.keys = function (object) {
      var keys = [];

      for (var key in object) {
        keys.push(key);
      }

      keys.reverse(); // Rather than returning an object with a next method, we keep
      // things simple and return the next function itself.

      return function next() {
        while (keys.length) {
          var key = keys.pop();

          if (key in object) {
            next.value = key;
            next.done = false;
            return next;
          }
        } // To avoid creating an additional object, we just hang the .value
        // and .done properties off the next function object itself. This
        // also ensures that the minifier will not anonymize the function.


        next.done = true;
        return next;
      };
    };

    function values(iterable) {
      if (iterable) {
        var iteratorMethod = iterable[iteratorSymbol];

        if (iteratorMethod) {
          return iteratorMethod.call(iterable);
        }

        if (typeof iterable.next === "function") {
          return iterable;
        }

        if (!isNaN(iterable.length)) {
          var i = -1,
              next = function next() {
            while (++i < iterable.length) {
              if (hasOwn.call(iterable, i)) {
                next.value = iterable[i];
                next.done = false;
                return next;
              }
            }

            next.value = undefined$1;
            next.done = true;
            return next;
          };

          return next.next = next;
        }
      } // Return an iterator with no values.


      return {
        next: doneResult
      };
    }

    exports.values = values;

    function doneResult() {
      return {
        value: undefined$1,
        done: true
      };
    }

    Context.prototype = {
      constructor: Context,
      reset: function (skipTempReset) {
        this.prev = 0;
        this.next = 0; // Resetting context._sent for legacy support of Babel's
        // function.sent implementation.

        this.sent = this._sent = undefined$1;
        this.done = false;
        this.delegate = null;
        this.method = "next";
        this.arg = undefined$1;
        this.tryEntries.forEach(resetTryEntry);

        if (!skipTempReset) {
          for (var name in this) {
            // Not sure about the optimal order of these conditions:
            if (name.charAt(0) === "t" && hasOwn.call(this, name) && !isNaN(+name.slice(1))) {
              this[name] = undefined$1;
            }
          }
        }
      },
      stop: function () {
        this.done = true;
        var rootEntry = this.tryEntries[0];
        var rootRecord = rootEntry.completion;

        if (rootRecord.type === "throw") {
          throw rootRecord.arg;
        }

        return this.rval;
      },
      dispatchException: function (exception) {
        if (this.done) {
          throw exception;
        }

        var context = this;

        function handle(loc, caught) {
          record.type = "throw";
          record.arg = exception;
          context.next = loc;

          if (caught) {
            // If the dispatched exception was caught by a catch block,
            // then let that catch block handle the exception normally.
            context.method = "next";
            context.arg = undefined$1;
          }

          return !!caught;
        }

        for (var i = this.tryEntries.length - 1; i >= 0; --i) {
          var entry = this.tryEntries[i];
          var record = entry.completion;

          if (entry.tryLoc === "root") {
            // Exception thrown outside of any try block that could handle
            // it, so set the completion value of the entire function to
            // throw the exception.
            return handle("end");
          }

          if (entry.tryLoc <= this.prev) {
            var hasCatch = hasOwn.call(entry, "catchLoc");
            var hasFinally = hasOwn.call(entry, "finallyLoc");

            if (hasCatch && hasFinally) {
              if (this.prev < entry.catchLoc) {
                return handle(entry.catchLoc, true);
              } else if (this.prev < entry.finallyLoc) {
                return handle(entry.finallyLoc);
              }
            } else if (hasCatch) {
              if (this.prev < entry.catchLoc) {
                return handle(entry.catchLoc, true);
              }
            } else if (hasFinally) {
              if (this.prev < entry.finallyLoc) {
                return handle(entry.finallyLoc);
              }
            } else {
              throw new Error("try statement without catch or finally");
            }
          }
        }
      },
      abrupt: function (type, arg) {
        for (var i = this.tryEntries.length - 1; i >= 0; --i) {
          var entry = this.tryEntries[i];

          if (entry.tryLoc <= this.prev && hasOwn.call(entry, "finallyLoc") && this.prev < entry.finallyLoc) {
            var finallyEntry = entry;
            break;
          }
        }

        if (finallyEntry && (type === "break" || type === "continue") && finallyEntry.tryLoc <= arg && arg <= finallyEntry.finallyLoc) {
          // Ignore the finally entry if control is not jumping to a
          // location outside the try/catch block.
          finallyEntry = null;
        }

        var record = finallyEntry ? finallyEntry.completion : {};
        record.type = type;
        record.arg = arg;

        if (finallyEntry) {
          this.method = "next";
          this.next = finallyEntry.finallyLoc;
          return ContinueSentinel;
        }

        return this.complete(record);
      },
      complete: function (record, afterLoc) {
        if (record.type === "throw") {
          throw record.arg;
        }

        if (record.type === "break" || record.type === "continue") {
          this.next = record.arg;
        } else if (record.type === "return") {
          this.rval = this.arg = record.arg;
          this.method = "return";
          this.next = "end";
        } else if (record.type === "normal" && afterLoc) {
          this.next = afterLoc;
        }

        return ContinueSentinel;
      },
      finish: function (finallyLoc) {
        for (var i = this.tryEntries.length - 1; i >= 0; --i) {
          var entry = this.tryEntries[i];

          if (entry.finallyLoc === finallyLoc) {
            this.complete(entry.completion, entry.afterLoc);
            resetTryEntry(entry);
            return ContinueSentinel;
          }
        }
      },
      "catch": function (tryLoc) {
        for (var i = this.tryEntries.length - 1; i >= 0; --i) {
          var entry = this.tryEntries[i];

          if (entry.tryLoc === tryLoc) {
            var record = entry.completion;

            if (record.type === "throw") {
              var thrown = record.arg;
              resetTryEntry(entry);
            }

            return thrown;
          }
        } // The context.catch method must only be called with a location
        // argument that corresponds to a known catch block.


        throw new Error("illegal catch attempt");
      },
      delegateYield: function (iterable, resultName, nextLoc) {
        this.delegate = {
          iterator: values(iterable),
          resultName: resultName,
          nextLoc: nextLoc
        };

        if (this.method === "next") {
          // Deliberately forget the last sent value so that we don't
          // accidentally pass it on to the delegate.
          this.arg = undefined$1;
        }

        return ContinueSentinel;
      }
    }; // Regardless of whether this script is executing as a CommonJS module
    // or not, return the runtime object so that we can declare the variable
    // regeneratorRuntime in the outer scope, which allows this module to be
    // injected easily by `bin/regenerator --include-runtime script.js`.

    return exports;
  }( // If this script is executing as a CommonJS module, use module.exports
  // as the regeneratorRuntime namespace. Otherwise create a new empty
  // object. Either way, the resulting object will be used to initialize
  // the regeneratorRuntime variable at the top of this file.
   module.exports );

  try {
    regeneratorRuntime = runtime;
  } catch (accidentalStrictMode) {
    // This module should not be running in strict mode, so the above
    // assignment should always work unless something is misconfigured. Just
    // in case runtime.js accidentally runs in strict mode, we can escape
    // strict mode using a global Function call. This could conceivably fail
    // if a Content Security Policy forbids using Function, but in that case
    // the proper solution is to fix the accidental strict mode problem. If
    // you've misconfigured your bundler to force strict mode and applied a
    // CSP to forbid Function, and you're not willing to fix either of those
    // problems, please detail your unique predicament in a GitHub issue.
    Function("r", "regeneratorRuntime = r")(runtime);
  }
});

var Property =
/*#__PURE__*/
function () {
  function Property(document, name, value) {
    _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_19___default()(this, Property);

    this.document = document;
    this.name = name;
    this.value = value;
  }

  _babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_20___default()(Property, [{
    key: "hasValue",
    value: function hasValue() {
      var value = this.value;
      return value !== null && value !== '' && value !== 0 && typeof value !== 'undefined';
    }
  }, {
    key: "isString",
    value: function isString(regexp) {
      var value = this.value;
      var result = typeof value === 'string';

      if (!result || !regexp) {
        return result;
      }

      return regexp.test(value);
    }
  }, {
    key: "isUrlDefinition",
    value: function isUrlDefinition() {
      return this.isString(/^url\(/);
    }
  }, {
    key: "isPixels",
    value: function isPixels() {
      if (!this.hasValue()) {
        return false;
      }

      var asString = this.getString();

      switch (true) {
        case /px$/.test(asString):
        case /^[0-9]+$/.test(asString):
          return true;

        default:
          return false;
      }
    }
  }, {
    key: "setValue",
    value: function setValue(value) {
      this.value = value;
      return this;
    }
  }, {
    key: "getValue",
    value: function getValue(def) {
      if (typeof def === 'undefined' || this.hasValue()) {
        return this.value;
      }

      return def;
    }
  }, {
    key: "getNumber",
    value: function getNumber(def) {
      if (!this.hasValue()) {
        if (typeof def === 'undefined') {
          return 0;
        }

        return parseFloat(def);
      }

      var value = this.value;
      var n = parseFloat(value);

      if (this.isString(/%$/)) {
        n = n / 100.0;
      }

      return n;
    }
  }, {
    key: "getString",
    value: function getString(def) {
      if (typeof def === 'undefined' || this.hasValue()) {
        return typeof this.value === 'undefined' ? '' : String(this.value);
      }

      return String(def);
    }
  }, {
    key: "getDpi",
    value: function getDpi() {
      return 96.0; // TODO: compute?
    }
  }, {
    key: "getRem",
    value: function getRem() {
      return this.document.rootEmSize;
    }
  }, {
    key: "getEm",
    value: function getEm() {
      return this.document.emSize;
    }
  }, {
    key: "getUnits",
    value: function getUnits() {
      return this.getString().replace(/[0-9\.\-]/g, '');
    }
  }, {
    key: "getPixels",
    value: function getPixels(axisOrIsFontSize) {
      var processPercent = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

      if (!this.hasValue()) {
        return 0;
      }

      var _ref = typeof axisOrIsFontSize === 'boolean' ? [undefined, axisOrIsFontSize] : [axisOrIsFontSize],
          _ref2 = _babel_runtime_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_6___default()(_ref, 2),
          axis = _ref2[0],
          isFontSize = _ref2[1];

      var viewPort = this.document.screen.viewPort;

      switch (true) {
        case this.isString(/vmin$/):
          return this.getNumber() / 100.0 * Math.min(viewPort.computeSize('x'), viewPort.computeSize('y'));

        case this.isString(/vmax$/):
          return this.getNumber() / 100.0 * Math.max(viewPort.computeSize('x'), viewPort.computeSize('y'));

        case this.isString(/vw$/):
          return this.getNumber() / 100.0 * viewPort.computeSize('x');

        case this.isString(/vh$/):
          return this.getNumber() / 100.0 * viewPort.computeSize('y');

        case this.isString(/rem$/):
          return this.getNumber() * this.getRem();

        case this.isString(/em$/):
          return this.getNumber() * this.getEm();

        case this.isString(/ex$/):
          return this.getNumber() * this.getEm() / 2.0;

        case this.isString(/px$/):
          return this.getNumber();

        case this.isString(/pt$/):
          return this.getNumber() * this.getDpi() * (1.0 / 72.0);

        case this.isString(/pc$/):
          return this.getNumber() * 15;

        case this.isString(/cm$/):
          return this.getNumber() * this.getDpi() / 2.54;

        case this.isString(/mm$/):
          return this.getNumber() * this.getDpi() / 25.4;

        case this.isString(/in$/):
          return this.getNumber() * this.getDpi();

        case this.isString(/%$/) && isFontSize:
          return this.getNumber() * this.getEm();

        case this.isString(/%$/):
          return this.getNumber() * viewPort.computeSize(axis);

        default:
          {
            var n = this.getNumber();

            if (processPercent && n < 1.0) {
              return n * viewPort.computeSize(axis);
            }

            return n;
          }
      }
    }
  }, {
    key: "getMilliseconds",
    value: function getMilliseconds() {
      if (!this.hasValue()) {
        return 0;
      }

      if (this.isString(/ms$/)) {
        return this.getNumber();
      }

      return this.getNumber() * 1000;
    }
  }, {
    key: "getRadians",
    value: function getRadians() {
      if (!this.hasValue()) {
        return 0;
      }

      switch (true) {
        case this.isString(/deg$/):
          return this.getNumber() * (Math.PI / 180.0);

        case this.isString(/grad$/):
          return this.getNumber() * (Math.PI / 200.0);

        case this.isString(/rad$/):
          return this.getNumber();

        default:
          return this.getNumber() * (Math.PI / 180.0);
      }
    }
  }, {
    key: "getDefinition",
    value: function getDefinition() {
      var asString = this.getString();
      var name = asString.match(/#([^\)'"]+)/);

      if (name) {
        name = name[1];
      }

      if (!name) {
        name = asString;
      }

      return this.document.definitions[name];
    }
  }, {
    key: "getFillStyleDefinition",
    value: function getFillStyleDefinition(element, opacity) {
      var def = this.getDefinition();

      if (!def) {
        return null;
      } // gradient


      if (typeof def.createGradient === 'function') {
        return def.createGradient(this.document.ctx, element, opacity);
      } // pattern


      if (typeof def.createPattern === 'function') {
        if (def.getHrefAttribute().hasValue()) {
          var patternTransform = def.getAttribute('patternTransform');
          def = def.getHrefAttribute().getDefinition();

          if (patternTransform.hasValue()) {
            def.getAttribute('patternTransform', true).setValue(patternTransform.value);
          }
        }

        return def.createPattern(this.document.ctx, element, opacity);
      }

      return null;
    }
  }, {
    key: "getTextBaseline",
    value: function getTextBaseline() {
      if (!this.hasValue()) {
        return null;
      }

      return Property.textBaselineMapping[this.getString()];
    }
  }, {
    key: "addOpacity",
    value: function addOpacity(opacity) {
      var value = this.value;
      var len = value.length;
      var commas = 0; // Simulate old RGBColor version, which can't parse rgba.

      for (var i = 0; i < len; i++) {
        if (value[i] === ',') {
          commas++;
        }

        if (commas === 3) {
          break;
        }
      }

      if (opacity.hasValue() && this.isString() && commas !== 3) {
        var color = new rgbcolor__WEBPACK_IMPORTED_MODULE_30___default.a(value);

        if (color.ok) {
          value = "rgba(".concat(color.r, ", ").concat(color.g, ", ").concat(color.b, ", ").concat(opacity.getNumber(), ")");
        }
      }

      return new Property(this.document, this.name, value);
    }
  }], [{
    key: "empty",
    value: function empty(document) {
      return new Property(document, 'EMPTY', '');
    }
  }]);

  return Property;
}();
Property.textBaselineMapping = {
  'baseline': 'alphabetic',
  'before-edge': 'top',
  'text-before-edge': 'top',
  'middle': 'middle',
  'central': 'middle',
  'after-edge': 'bottom',
  'text-after-edge': 'bottom',
  'ideographic': 'ideographic',
  'alphabetic': 'alphabetic',
  'hanging': 'hanging',
  'mathematical': 'alphabetic'
};

var ViewPort =
/*#__PURE__*/
function () {
  function ViewPort() {
    _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_19___default()(this, ViewPort);

    this.viewPorts = [];
  }

  _babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_20___default()(ViewPort, [{
    key: "clear",
    value: function clear() {
      this.viewPorts = [];
    }
  }, {
    key: "setCurrent",
    value: function setCurrent(width, height) {
      this.viewPorts.push({
        width: width,
        height: height
      });
    }
  }, {
    key: "removeCurrent",
    value: function removeCurrent() {
      this.viewPorts.pop();
    }
  }, {
    key: "getCurrent",
    value: function getCurrent() {
      var viewPorts = this.viewPorts;
      return viewPorts[viewPorts.length - 1];
    }
  }, {
    key: "computeSize",
    value: function computeSize(d) {
      if (typeof d === 'number') {
        return d;
      }

      if (d === 'x') {
        return this.width;
      }

      if (d === 'y') {
        return this.height;
      }

      return Math.sqrt(Math.pow(this.width, 2) + Math.pow(this.height, 2)) / Math.sqrt(2);
    }
  }, {
    key: "width",
    get: function get() {
      return this.getCurrent().width;
    }
  }, {
    key: "height",
    get: function get() {
      return this.getCurrent().height;
    }
  }]);

  return ViewPort;
}();

var Point =
/*#__PURE__*/
function () {
  function Point(x, y) {
    _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_19___default()(this, Point);

    this.x = x;
    this.y = y;
  }

  _babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_20___default()(Point, [{
    key: "angleTo",
    value: function angleTo(point) {
      return Math.atan2(point.y - this.y, point.x - this.x);
    }
  }, {
    key: "applyTransform",
    value: function applyTransform(transform) {
      var x = this.x,
          y = this.y;
      var xp = x * transform[0] + y * transform[2] + transform[4];
      var yp = x * transform[1] + y * transform[3] + transform[5];
      this.x = xp;
      this.y = yp;
    }
  }], [{
    key: "parse",
    value: function parse(point) {
      var defaultValue = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

      var _toNumbers = toNumbers(point),
          _toNumbers2 = _babel_runtime_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_6___default()(_toNumbers, 2),
          _toNumbers2$ = _toNumbers2[0],
          x = _toNumbers2$ === void 0 ? defaultValue : _toNumbers2$,
          _toNumbers2$2 = _toNumbers2[1],
          y = _toNumbers2$2 === void 0 ? x : _toNumbers2$2;

      return new Point(x, y);
    }
  }, {
    key: "parsePath",
    value: function parsePath(path) {
      var points = toNumbers(path);
      var len = points.length;
      var pathPoints = [];

      for (var i = 0; i < len; i += 2) {
        pathPoints.push(new Point(points[i], points[i + 1]));
      }

      return pathPoints;
    }
  }]);

  return Point;
}();

var Mouse =
/*#__PURE__*/
function () {
  function Mouse(screen) {
    _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_19___default()(this, Mouse);

    this.screen = screen;
    this.working = false;
    this.events = [];
    this.eventElements = [];
    this.onClick = this.onClick.bind(this);
    this.onMouseMove = this.onMouseMove.bind(this);
  }

  _babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_20___default()(Mouse, [{
    key: "isWorking",
    value: function isWorking() {
      return this.working;
    }
  }, {
    key: "start",
    value: function start() {
      if (this.working) {
        return;
      }

      var screen = this.screen,
          onClick = this.onClick,
          onMouseMove = this.onMouseMove;
      var canvas = screen.ctx.canvas;
      canvas.onclick = onClick;
      canvas.onmousemove = onMouseMove;
      this.working = true;
    }
  }, {
    key: "stop",
    value: function stop() {
      if (!this.working) {
        return;
      }

      var canvas = this.screen.ctx.canvas;
      this.working = false;
      canvas.onclick = null;
      canvas.onmousemove = null;
    }
  }, {
    key: "hasEvents",
    value: function hasEvents() {
      return this.working && this.events.length > 0;
    }
  }, {
    key: "runEvents",
    value: function runEvents() {
      if (!this.working) {
        return;
      }

      var document = this.screen,
          events = this.events,
          eventElements = this.eventElements;
      var style = document.ctx.canvas.style;

      if (style) {
        style.cursor = '';
      }

      events.forEach(function (_ref, i) {
        var run = _ref.run;
        var element = eventElements[i];

        while (element) {
          run(element);
          element = element.parent;
        }
      }); // done running, clear

      this.events = [];
      this.eventElements = [];
    }
  }, {
    key: "checkPath",
    value: function checkPath(element, ctx) {
      if (!this.working || !ctx) {
        return;
      }

      var events = this.events,
          eventElements = this.eventElements;
      events.forEach(function (_ref2, i) {
        var x = _ref2.x,
            y = _ref2.y;

        if (!eventElements[i] && ctx.isPointInPath && ctx.isPointInPath(x, y)) {
          eventElements[i] = element;
        }
      });
    }
  }, {
    key: "checkBoundingBox",
    value: function checkBoundingBox(element, boundingBox) {
      if (!this.working || !boundingBox) {
        return;
      }

      var events = this.events,
          eventElements = this.eventElements;
      events.forEach(function (_ref3, i) {
        var x = _ref3.x,
            y = _ref3.y;

        if (!eventElements[i] && boundingBox.isPointInBox(x, y)) {
          eventElements[i] = element;
        }
      });
    }
  }, {
    key: "mapXY",
    value: function mapXY(x, y) {
      var _this$screen = this.screen,
          window = _this$screen.window,
          ctx = _this$screen.ctx;
      var point = new Point(x, y);
      var element = ctx.canvas;

      while (element) {
        point.x -= element.offsetLeft;
        point.y -= element.offsetTop;
        element = element.offsetParent;
      }

      if (window.scrollX) {
        point.x += window.scrollX;
      }

      if (window.scrollY) {
        point.y += window.scrollY;
      }

      return point;
    }
  }, {
    key: "onClick",
    value: function onClick(evt) {
      var _this$mapXY = this.mapXY((evt || event).clientX, (evt || event).clientY),
          x = _this$mapXY.x,
          y = _this$mapXY.y;

      this.events.push({
        type: 'onclick',
        x: x,
        y: y,
        run: function run(event) {
          if (event.onClick) {
            event.onClick();
          }
        }
      });
    }
  }, {
    key: "onMouseMove",
    value: function onMouseMove(evt) {
      var _this$mapXY2 = this.mapXY((evt || event).clientX, (evt || event).clientY),
          x = _this$mapXY2.x,
          y = _this$mapXY2.y;

      this.events.push({
        type: 'onmousemove',
        x: x,
        y: y,
        run: function run(event) {
          if (event.onMouseMove) {
            event.onMouseMove();
          }
        }
      });
    }
  }]);

  return Mouse;
}();

var defaultWindow = typeof window !== 'undefined' ? window : null;
var defaultFetch = typeof fetch !== 'undefined' ? fetch.bind(window) : null;

var Screen =
/*#__PURE__*/
function () {
  function Screen(ctx) {
    var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
        _ref$fetch = _ref.fetch,
        fetch = _ref$fetch === void 0 ? defaultFetch : _ref$fetch,
        _ref$window = _ref.window,
        window = _ref$window === void 0 ? defaultWindow : _ref$window;

    _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_19___default()(this, Screen);

    this.ctx = ctx;
    this.FRAMERATE = 30;
    this.MAX_VIRTUAL_PIXELS = 30000;
    this.CLIENT_WIDTH = 800;
    this.CLIENT_HEIGHT = 600;
    this.viewPort = new ViewPort();
    this.mouse = new Mouse(this);
    this.animations = [];
    this.waits = [];
    this.frameDuration = 0;
    this.isReadyLock = false;
    this.isFirstRender = true;
    this.intervalId = null;
    this.window = window;
    this.fetch = fetch;
  }

  _babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_20___default()(Screen, [{
    key: "wait",
    value: function wait(checker) {
      this.waits.push(checker);
    }
  }, {
    key: "ready",
    value: function ready() {
      if (!this.readyPromise) {
        return Promise.resolve();
      }

      return this.readyPromise;
    }
  }, {
    key: "isReady",
    value: function isReady() {
      if (this.isReadyLock) {
        return true;
      }

      var isReadyLock = this.waits.every(function (_) {
        return _();
      });

      if (isReadyLock) {
        this.waits = [];

        if (this.resolveReady) {
          this.resolveReady();
        }
      }

      this.isReadyLock = isReadyLock;
      return isReadyLock;
    }
  }, {
    key: "setDefaults",
    value: function setDefaults(ctx) {
      // initial values and defaults
      ctx.strokeStyle = 'rgba(0,0,0,0)';
      ctx.lineCap = 'butt';
      ctx.lineJoin = 'miter';
      ctx.miterLimit = 4;
    }
  }, {
    key: "setViewBox",
    value: function setViewBox(_ref2) {
      var document = _ref2.document,
          ctx = _ref2.ctx,
          aspectRatio = _ref2.aspectRatio,
          width = _ref2.width,
          desiredWidth = _ref2.desiredWidth,
          height = _ref2.height,
          desiredHeight = _ref2.desiredHeight,
          _ref2$minX = _ref2.minX,
          minX = _ref2$minX === void 0 ? 0 : _ref2$minX,
          _ref2$minY = _ref2.minY,
          minY = _ref2$minY === void 0 ? 0 : _ref2$minY,
          refX = _ref2.refX,
          refY = _ref2.refY,
          _ref2$clip = _ref2.clip,
          clip = _ref2$clip === void 0 ? false : _ref2$clip,
          _ref2$clipX = _ref2.clipX,
          clipX = _ref2$clipX === void 0 ? 0 : _ref2$clipX,
          _ref2$clipY = _ref2.clipY,
          clipY = _ref2$clipY === void 0 ? 0 : _ref2$clipY;
      // aspect ratio - http://www.w3.org/TR/SVG/coords.html#PreserveAspectRatioAttribute
      var cleanAspectRatio = compressSpaces(aspectRatio).replace(/^defer\s/, ''); // ignore defer

      var _cleanAspectRatio$spl = cleanAspectRatio.split(' '),
          _cleanAspectRatio$spl2 = _babel_runtime_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_6___default()(_cleanAspectRatio$spl, 2),
          aspectRatioAlign = _cleanAspectRatio$spl2[0],
          aspectRatioMeetOrSlice = _cleanAspectRatio$spl2[1];

      var align = aspectRatioAlign || 'xMidYMid';
      var meetOrSlice = aspectRatioMeetOrSlice || 'meet'; // calculate scale

      var scaleX = width / desiredWidth;
      var scaleY = height / desiredHeight;
      var scaleMin = Math.min(scaleX, scaleY);
      var scaleMax = Math.max(scaleX, scaleY);
      var finalDesiredWidth = desiredWidth;
      var finalDesiredHeight = desiredHeight;

      if (meetOrSlice === 'meet') {
        finalDesiredWidth *= scaleMin;
        finalDesiredHeight *= scaleMin;
      }

      if (meetOrSlice === 'slice') {
        finalDesiredWidth *= scaleMax;
        finalDesiredHeight *= scaleMax;
      }

      var refXProp = new Property(document, 'refX', refX);
      var refYProp = new Property(document, 'refY', refY);
      var hasRefs = refXProp.hasValue() && refYProp.hasValue();

      if (hasRefs) {
        ctx.translate(-scaleMin * refXProp.getPixels('x'), -scaleMin * refYProp.getPixels('y'));
      }

      if (clip) {
        var scaledClipX = scaleMin * clipX;
        var scaledClipY = scaleMin * clipY;
        ctx.beginPath();
        ctx.moveTo(scaledClipX, scaledClipY);
        ctx.lineTo(width, scaledClipY);
        ctx.lineTo(width, height);
        ctx.lineTo(scaledClipX, height);
        ctx.closePath();
        ctx.clip();
      }

      if (!hasRefs) {
        var isMeetMinY = meetOrSlice === 'meet' && scaleMin === scaleY;
        var isSliceMaxY = meetOrSlice === 'slice' && scaleMax === scaleY;
        var isMeetMinX = meetOrSlice === 'meet' && scaleMin === scaleX;
        var isSliceMaxX = meetOrSlice === 'slice' && scaleMax === scaleX;

        if (/^xMid/.test(align) && (isMeetMinY || isSliceMaxY)) {
          ctx.translate(width / 2.0 - finalDesiredWidth / 2.0, 0);
        }

        if (/YMid$/.test(align) && (isMeetMinX || isSliceMaxX)) {
          ctx.translate(0, height / 2.0 - finalDesiredHeight / 2.0);
        }

        if (/^xMax/.test(align) && (isMeetMinY || isSliceMaxY)) {
          ctx.translate(width - finalDesiredWidth, 0);
        }

        if (/YMax$/.test(align) && (isMeetMinX || isSliceMaxX)) {
          ctx.translate(0, height - finalDesiredHeight);
        }
      } // scale


      switch (true) {
        case align === 'none':
          ctx.scale(scaleX, scaleY);
          break;

        case meetOrSlice === 'meet':
          ctx.scale(scaleMin, scaleMin);
          break;

        case meetOrSlice === 'slice':
          ctx.scale(scaleMax, scaleMax);
          break;

        default:
      } // translate


      ctx.translate(-minX, -minY);
    }
  }, {
    key: "start",
    value: function start(element) {
      var _this = this;

      var _ref3 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
          _ref3$enableRedraw = _ref3.enableRedraw,
          enableRedraw = _ref3$enableRedraw === void 0 ? false : _ref3$enableRedraw,
          _ref3$ignoreMouse = _ref3.ignoreMouse,
          ignoreMouse = _ref3$ignoreMouse === void 0 ? false : _ref3$ignoreMouse,
          _ref3$ignoreAnimation = _ref3.ignoreAnimation,
          ignoreAnimation = _ref3$ignoreAnimation === void 0 ? false : _ref3$ignoreAnimation,
          _ref3$ignoreDimension = _ref3.ignoreDimensions,
          ignoreDimensions = _ref3$ignoreDimension === void 0 ? false : _ref3$ignoreDimension,
          _ref3$ignoreClear = _ref3.ignoreClear,
          ignoreClear = _ref3$ignoreClear === void 0 ? false : _ref3$ignoreClear,
          forceRedraw = _ref3.forceRedraw,
          scaleWidth = _ref3.scaleWidth,
          scaleHeight = _ref3.scaleHeight,
          offsetX = _ref3.offsetX,
          offsetY = _ref3.offsetY;

      var FRAMERATE = this.FRAMERATE,
          mouse = this.mouse;
      var frameDuration = 1000 / FRAMERATE;
      this.frameDuration = frameDuration;
      this.readyPromise = new Promise(function (resolve) {
        _this.resolveReady = resolve;
      });

      if (this.isReady()) {
        this.render(element, ignoreDimensions, ignoreClear, scaleWidth, scaleHeight, offsetX, offsetY);
      }

      if (!enableRedraw) {
        return;
      }

      var now = Date.now();
      var then = now;
      var delta = 0;

      var tick = function tick() {
        now = Date.now();
        delta = now - then;

        if (delta >= frameDuration) {
          then = now - delta % frameDuration;

          if (_this.shouldUpdate(ignoreAnimation, forceRedraw)) {
            _this.render(element, ignoreDimensions, ignoreClear, scaleWidth, scaleHeight, offsetX, offsetY);

            mouse.runEvents();
          }
        }

        _this.intervalId = raf__WEBPACK_IMPORTED_MODULE_28___default()(tick);
      };

      if (!ignoreMouse) {
        mouse.start();
      }

      this.intervalId = raf__WEBPACK_IMPORTED_MODULE_28___default()(tick);
    }
  }, {
    key: "stop",
    value: function stop() {
      if (this.intervalId) {
        raf__WEBPACK_IMPORTED_MODULE_28___default.a.cancel(this.intervalId);
        this.intervalId = null;
      }

      this.mouse.stop();
    }
  }, {
    key: "shouldUpdate",
    value: function shouldUpdate(ignoreAnimation, forceRedraw) {
      // need update from animations?
      if (!ignoreAnimation) {
        var frameDuration = this.frameDuration;
        var shouldUpdate = this.animations.reduce(function (shouldUpdate, animation) {
          return animation.update(frameDuration) || shouldUpdate;
        }, false);

        if (shouldUpdate) {
          return true;
        }
      } // need update from redraw?


      if (typeof forceRedraw === 'function' && forceRedraw()) {
        return true;
      }

      if (!this.isReadyLock && this.isReady()) {
        return true;
      } // need update from mouse events?


      if (this.mouse.hasEvents()) {
        return true;
      }

      return false;
    }
  }, {
    key: "render",
    value: function render(element, ignoreDimensions, ignoreClear, scaleWidth, scaleHeight, offsetX, offsetY) {
      var CLIENT_WIDTH = this.CLIENT_WIDTH,
          CLIENT_HEIGHT = this.CLIENT_HEIGHT,
          viewPort = this.viewPort,
          ctx = this.ctx,
          isFirstRender = this.isFirstRender;
      var canvas = ctx.canvas;
      viewPort.clear();

      if (canvas.width && canvas.height) {
        viewPort.setCurrent(canvas.width, canvas.height);
      } else {
        viewPort.setCurrent(CLIENT_WIDTH, CLIENT_HEIGHT);
      }

      var widthStyle = element.getStyle('width');
      var heightStyle = element.getStyle('height');

      if (!ignoreDimensions && (isFirstRender || typeof scaleWidth !== 'number' && typeof scaleHeight !== 'number')) {
        // set canvas size
        if (widthStyle.hasValue()) {
          canvas.width = widthStyle.getPixels('x');

          if (canvas.style) {
            canvas.style.width = "".concat(canvas.width, "px");
          }
        }

        if (heightStyle.hasValue()) {
          canvas.height = heightStyle.getPixels('y');

          if (canvas.style) {
            canvas.style.height = "".concat(canvas.height, "px");
          }
        }
      }

      var cWidth = canvas.clientWidth || canvas.width;
      var cHeight = canvas.clientHeight || canvas.height;

      if (ignoreDimensions && widthStyle.hasValue() && heightStyle.hasValue()) {
        cWidth = widthStyle.getPixels('x');
        cHeight = heightStyle.getPixels('y');
      }

      viewPort.setCurrent(cWidth, cHeight);

      if (typeof offsetX === 'number') {
        element.getAttribute('x', true).setValue(offsetX);
      }

      if (typeof offsetY === 'number') {
        element.getAttribute('y', true).setValue(offsetY);
      }

      if (typeof scaleWidth === 'number' || typeof scaleHeight === 'number') {
        var viewBox = toNumbers(element.getAttribute('viewBox').getString());
        var xRatio = 0;
        var yRatio = 0;

        if (typeof scaleWidth === 'number') {
          var widthAttr = element.getAttribute('width');

          if (widthAttr.hasValue()) {
            xRatio = widthAttr.getPixels('x') / scaleWidth;
          } else if (!isNaN(viewBox[2])) {
            xRatio = viewBox[2] / scaleWidth;
          }
        }

        if (typeof scaleHeight === 'number') {
          var heightAttr = element.getAttribute('height');

          if (heightAttr.hasValue()) {
            yRatio = heightAttr.getPixels('y') / scaleHeight;
          } else if (!isNaN(viewBox[3])) {
            yRatio = viewBox[3] / scaleHeight;
          }
        }

        if (!xRatio) {
          xRatio = yRatio;
        }

        if (!yRatio) {
          yRatio = xRatio;
        }

        element.getAttribute('width', true).setValue(scaleWidth);
        element.getAttribute('height', true).setValue(scaleHeight);
        var transformStyle = element.getStyle('transform', true, true);
        transformStyle.setValue("".concat(transformStyle.getString(), " scale(").concat(1.0 / xRatio, ", ").concat(1.0 / yRatio, ")"));
      } // clear and render


      if (!ignoreClear) {
        ctx.clearRect(0, 0, cWidth, cHeight);
      }

      element.render(ctx);

      if (isFirstRender) {
        this.isFirstRender = false;
      }
    }
  }]);

  return Screen;
}();
Screen.defaultWindow = defaultWindow;
Screen.defaultFetch = defaultFetch;

var defaultFetch$1 = Screen.defaultFetch;
var DefaultDOMParser = typeof DOMParser !== 'undefined' ? DOMParser : null;

var Parser =
/*#__PURE__*/
function () {
  // private readonly options: any;
  function Parser() {
    var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
        _ref$fetch = _ref.fetch,
        fetch = _ref$fetch === void 0 ? defaultFetch$1 : _ref$fetch,
        _ref$DOMParser = _ref.DOMParser,
        DOMParser = _ref$DOMParser === void 0 ? DefaultDOMParser : _ref$DOMParser;

    _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_19___default()(this, Parser);

    this.fetch = fetch;
    this.DOMParser = DOMParser; // this.options = options;
  }

  _babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_20___default()(Parser, [{
    key: "parse",
    value: function () {
      var _parse = _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_17___default()(
      /*#__PURE__*/
      _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_16___default.a.mark(function _callee(resource) {
        return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_16___default.a.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                if (!/^</.test(resource)) {
                  _context.next = 2;
                  break;
                }

                return _context.abrupt("return", this.parseFromString(resource));

              case 2:
                return _context.abrupt("return", this.load(resource));

              case 3:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function parse(_x) {
        return _parse.apply(this, arguments);
      }

      return parse;
    }()
  }, {
    key: "parseFromString",
    value: function parseFromString(xml) {
      try {
        var parser = new this.DOMParser();
        return parser.parseFromString(xml, 'image/svg+xml');
      } catch (err) {
        var _parser = new this.DOMParser();

        return _parser.parseFromString(xml, 'text/xml');
      }
    }
  }, {
    key: "load",
    value: function () {
      var _load = _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_17___default()(
      /*#__PURE__*/
      _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_16___default.a.mark(function _callee2(url) {
        var response, xml;
        return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_16___default.a.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                _context2.next = 2;
                return this.fetch(url);

              case 2:
                response = _context2.sent;
                _context2.next = 5;
                return response.text();

              case 5:
                xml = _context2.sent;
                return _context2.abrupt("return", this.parseFromString(xml));

              case 7:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function load(_x2) {
        return _load.apply(this, arguments);
      }

      return load;
    }()
  }]);

  return Parser;
}();

var Element =
/*#__PURE__*/
function () {
  function Element(document, node) {
    var _this = this;

    var captureTextNodes = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

    _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_19___default()(this, Element);

    this.document = document;
    this.node = node;
    this.captureTextNodes = captureTextNodes;
    this.attributes = {};
    this.styles = {};
    this.stylesSpecificity = {};
    this.animationFrozen = false;
    this.animationFrozenValue = '';
    this.parent = null;
    this.children = [];

    if (!node || node.nodeType !== 1) {
      // ELEMENT_NODE
      return;
    } // add attributes


    Array.from(node.attributes).forEach(function (attribute) {
      var nodeName = normalizeAttributeName(attribute.nodeName);
      _this.attributes[nodeName] = new Property(document, nodeName, attribute.value);
    });
    this.addStylesFromStyleDefinition(); // add inline styles

    if (this.getAttribute('style').hasValue()) {
      var styles = this.getAttribute('style').getString().split(';').map(function (_) {
        return _.trim();
      });
      styles.forEach(function (style) {
        if (!style) {
          return;
        }

        var _style$split = style.split(':'),
            _style$split2 = _babel_runtime_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_6___default()(_style$split, 2),
            name = _style$split2[0],
            value = _style$split2[1];

        _this.styles[name] = new Property(document, name.trim(), value.trim());
      });
    }

    var definitions = document.definitions;
    var id = this.getAttribute('id'); // add id

    if (id.hasValue()) {
      if (!definitions[id.getValue()]) {
        definitions[id.getValue()] = this;
      }
    }

    Array.from(node.childNodes).forEach(function (childNode) {
      if (childNode.nodeType === 1) {
        _this.addChild(childNode); // ELEMENT_NODE

      } else if (captureTextNodes && (childNode.nodeType === 3 || childNode.nodeType === 4)) {
        var textNode = document.createTextNode(childNode);

        if (textNode.getText().length > 0) {
          _this.addChild(textNode); // TEXT_NODE

        }
      }
    });
  }

  _babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_20___default()(Element, [{
    key: "getAttribute",
    value: function getAttribute(name) {
      var createIfNotExists = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
      var attr = this.attributes[name];

      if (!attr && createIfNotExists) {
        var _attr = new Property(this.document, name, '');

        this.attributes[name] = _attr;
        return _attr;
      }

      return attr || Property.empty(this.document);
    }
  }, {
    key: "getHrefAttribute",
    value: function getHrefAttribute() {
      for (var key in this.attributes) {
        if (key === 'href' || /:href$/.test(key)) {
          return this.attributes[key];
        }
      }

      return Property.empty(this.document);
    }
  }, {
    key: "getStyle",
    value: function getStyle(name) {
      var createIfNotExists = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
      var skipAncestors = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
      var style = this.styles[name];

      if (style) {
        return style;
      }

      var attr = this.getAttribute(name);

      if (attr && attr.hasValue()) {
        this.styles[name] = attr; // move up to me to cache

        return attr;
      }

      if (!skipAncestors) {
        var parent = this.parent;

        if (parent) {
          var parentStyle = parent.getStyle(name);

          if (parentStyle && parentStyle.hasValue()) {
            return parentStyle;
          }
        }
      }

      if (createIfNotExists) {
        var _style = new Property(this.document, name, '');

        this.styles[name] = _style;
        return _style;
      }

      return style || Property.empty(this.document);
    }
  }, {
    key: "render",
    value: function render(ctx) {
      // don't render display=none
      // don't render visibility=hidden
      if (this.getStyle('display').getString() === 'none' || this.getStyle('visibility').getString() === 'hidden') {
        return;
      }

      ctx.save();

      if (this.getStyle('mask').hasValue()) {
        // mask
        var mask = this.getStyle('mask').getDefinition();

        if (mask) {
          mask.apply(ctx, this);
        }
      } else if (this.getStyle('filter').getValue('none') !== 'none') {
        // filter
        var filter = this.getStyle('filter').getDefinition();

        if (filter) {
          filter.apply(ctx, this);
        }
      } else {
        this.setContext(ctx);
        this.renderChildren(ctx);
        this.clearContext(ctx);
      }

      ctx.restore();
    }
  }, {
    key: "setContext",
    value: function setContext(_) {}
  }, {
    key: "clearContext",
    value: function clearContext(_) {}
  }, {
    key: "renderChildren",
    value: function renderChildren(ctx) {
      this.children.forEach(function (child) {
        child.render(ctx);
      });
    }
  }, {
    key: "addChild",
    value: function addChild(childNode) {
      var child = childNode instanceof Element ? childNode : this.document.createElement(childNode);
      child.parent = this;

      if (!Element.ignoreChildTypes.includes(child.type)) {
        this.children.push(child);
      }
    }
  }, {
    key: "matchesSelector",
    value: function matchesSelector(selector) {
      var node = this.node;

      if (typeof node.matches === 'function') {
        return node.matches(selector);
      }

      var styleClasses = node.getAttribute('class');

      if (!styleClasses || styleClasses === '') {
        return false;
      }

      return styleClasses.split(' ').some(function (styleClass) {
        if (".".concat(styleClass) === selector) {
          return true;
        }
      });
    }
  }, {
    key: "addStylesFromStyleDefinition",
    value: function addStylesFromStyleDefinition() {
      var _this$document = this.document,
          styles = _this$document.styles,
          stylesSpecificity = _this$document.stylesSpecificity;

      for (var selector in styles) {
        if (selector[0] !== '@' && this.matchesSelector(selector)) {
          var style = styles[selector];
          var specificity = stylesSpecificity[selector];

          if (style) {
            for (var name in style) {
              var existingSpecificity = this.stylesSpecificity[name];

              if (typeof existingSpecificity === 'undefined') {
                existingSpecificity = '000';
              }

              if (specificity >= existingSpecificity) {
                this.styles[name] = style[name];
                this.stylesSpecificity[name] = specificity;
              }
            }
          }
        }
      }
    }
  }]);

  return Element;
}();
Element.ignoreChildTypes = ['title'];

var UnknownElement =
/*#__PURE__*/
function (_Element) {
  _babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_33___default()(UnknownElement, _Element);

  function UnknownElement(document, node, captureTextNodes) {
    var _this;

    _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_19___default()(this, UnknownElement);

    _this = _babel_runtime_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_31___default()(this, _babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_32___default()(UnknownElement).call(this, document, node, captureTextNodes)); // tslint:disable-next-line: no-console

    console.warn("Element ".concat(node.nodeName, " not yet implemented."));
    return _this;
  }

  return UnknownElement;
}(Element);

function wrapFontFamily(fontFamily) {
  var trimmed = fontFamily.trim();
  return /^('|")/.test(trimmed) ? trimmed : "\"".concat(trimmed, "\"");
}

function prepareFontFamily(fontFamily) {
  return typeof process === 'undefined' ? fontFamily : fontFamily.trim().split(',').map(wrapFontFamily).join(',');
}

var Font =
/*#__PURE__*/
function () {
  function Font(fontStyle, fontVariant, fontWeight, fontSize, fontFamily, inherit) {
    _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_19___default()(this, Font);

    var inheritFont = inherit ? typeof inherit === 'string' ? Font.parse(inherit) : inherit : {};
    this.fontFamily = fontFamily || inheritFont.fontFamily;
    this.fontSize = fontSize || inheritFont.fontSize;
    this.fontStyle = fontStyle || inheritFont.fontStyle;
    this.fontWeight = fontWeight || inheritFont.fontWeight;
    this.fontVariant = fontVariant || inheritFont.fontVariant;
  }

  _babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_20___default()(Font, [{
    key: "toString",
    value: function toString() {
      return [this.fontStyle, this.fontVariant, this.fontWeight, this.fontSize, // Wrap fontFamily only on nodejs and only for canvas.ctx
      prepareFontFamily(this.fontFamily)].join(' ');
    }
  }], [{
    key: "parse",
    value: function parse() {
      var font = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
      var inherit = arguments.length > 1 ? arguments[1] : undefined;
      var fontStyle = '';
      var fontVariant = '';
      var fontWeight = '';
      var fontSize = '';
      var fontFamily = '';
      var parts = compressSpaces(font).trim().split(' ');
      var set = {
        fontSize: false,
        fontStyle: false,
        fontWeight: false,
        fontVariant: false
      };
      parts.forEach(function (part) {
        switch (true) {
          case !set.fontStyle && Font.styles.includes(part):
            if (part !== 'inherit') {
              fontStyle = part;
            }

            set.fontStyle = true;
            break;

          case !set.fontVariant && Font.variants.includes(part):
            if (part !== 'inherit') {
              fontVariant = part;
            }

            set.fontStyle = true;
            set.fontVariant = true;
            break;

          case !set.fontWeight && Font.weights.includes(part):
            if (part !== 'inherit') {
              fontWeight = part;
            }

            set.fontStyle = true;
            set.fontVariant = true;
            set.fontWeight = true;
            break;

          case !set.fontSize:
            if (part !== 'inherit') {
              var _part$split = part.split('/');

              var _part$split2 = _babel_runtime_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_6___default()(_part$split, 1);

              fontSize = _part$split2[0];
            }

            set.fontStyle = true;
            set.fontVariant = true;
            set.fontWeight = true;
            set.fontSize = true;
            break;

          default:
            if (part !== 'inherit') {
              fontFamily += part;
            }

        }
      });
      return new Font(fontStyle, fontVariant, fontWeight, fontSize, fontFamily, inherit);
    }
  }]);

  return Font;
}();
Font.styles = 'normal|italic|oblique|inherit';
Font.variants = 'normal|small-caps|inherit';
Font.weights = 'normal|bold|bolder|lighter|100|200|300|400|500|600|700|800|900|inherit';

var BoundingBox =
/*#__PURE__*/
function () {
  function BoundingBox() {
    var x1 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : Number.NaN;
    var y1 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : Number.NaN;
    var x2 = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : Number.NaN;
    var y2 = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : Number.NaN;

    _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_19___default()(this, BoundingBox);

    this.x1 = x1;
    this.y1 = y1;
    this.x2 = x2;
    this.y2 = y2;
    this.addPoint(x1, y1);
    this.addPoint(x2, y2);
  }

  _babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_20___default()(BoundingBox, [{
    key: "addPoint",
    value: function addPoint(x, y) {
      if (typeof x !== 'undefined') {
        if (isNaN(this.x1) || isNaN(this.x2)) {
          this.x1 = x;
          this.x2 = x;
        }

        if (x < this.x1) {
          this.x1 = x;
        }

        if (x > this.x2) {
          this.x2 = x;
        }
      }

      if (typeof y !== 'undefined') {
        if (isNaN(this.y1) || isNaN(this.y2)) {
          this.y1 = y;
          this.y2 = y;
        }

        if (y < this.y1) {
          this.y1 = y;
        }

        if (y > this.y2) {
          this.y2 = y;
        }
      }
    }
  }, {
    key: "addX",
    value: function addX(x) {
      this.addPoint(x, null);
    }
  }, {
    key: "addY",
    value: function addY(y) {
      this.addPoint(null, y);
    }
  }, {
    key: "addBoundingBox",
    value: function addBoundingBox(_ref) {
      var x1 = _ref.x1,
          y1 = _ref.y1,
          x2 = _ref.x2,
          y2 = _ref.y2;
      this.addPoint(x1, y1);
      this.addPoint(x2, y2);
    }
  }, {
    key: "sumCubic",
    value: function sumCubic(t, p0, p1, p2, p3) {
      return Math.pow(1 - t, 3) * p0 + 3 * Math.pow(1 - t, 2) * t * p1 + 3 * (1 - t) * Math.pow(t, 2) * p2 + Math.pow(t, 3) * p3;
    }
  }, {
    key: "bezierCurveAdd",
    value: function bezierCurveAdd(forX, p0, p1, p2, p3) {
      var b = 6 * p0 - 12 * p1 + 6 * p2;
      var a = -3 * p0 + 9 * p1 - 9 * p2 + 3 * p3;
      var c = 3 * p1 - 3 * p0;

      if (a === 0) {
        if (b === 0) {
          return;
        }

        var t = -c / b;

        if (0 < t && t < 1) {
          if (forX) {
            this.addX(this.sumCubic(t, p0, p1, p2, p3));
          } else {
            this.addY(this.sumCubic(t, p0, p1, p2, p3));
          }
        }

        return;
      }

      var b2ac = Math.pow(b, 2) - 4 * c * a;

      if (b2ac < 0) {
        return;
      }

      var t1 = (-b + Math.sqrt(b2ac)) / (2 * a);

      if (0 < t1 && t1 < 1) {
        if (forX) {
          this.addX(this.sumCubic(t1, p0, p1, p2, p3));
        } else {
          this.addY(this.sumCubic(t1, p0, p1, p2, p3));
        }
      }

      var t2 = (-b - Math.sqrt(b2ac)) / (2 * a);

      if (0 < t2 && t2 < 1) {
        if (forX) {
          this.addX(this.sumCubic(t2, p0, p1, p2, p3));
        } else {
          this.addY(this.sumCubic(t2, p0, p1, p2, p3));
        }
      }
    } // from http://blog.hackers-cafe.net/2009/06/how-to-calculate-bezier-curves-bounding.html

  }, {
    key: "addBezierCurve",
    value: function addBezierCurve(p0x, p0y, p1x, p1y, p2x, p2y, p3x, p3y) {
      this.addPoint(p0x, p0y);
      this.addPoint(p3x, p3y);
      this.bezierCurveAdd(true, p0x, p1x, p2x, p3x);
      this.bezierCurveAdd(false, p0y, p1y, p2y, p3y);
    }
  }, {
    key: "addQuadraticCurve",
    value: function addQuadraticCurve(p0x, p0y, p1x, p1y, p2x, p2y) {
      var cp1x = p0x + 2 / 3 * (p1x - p0x); // CP1 = QP0 + 2/3 *(QP1-QP0)

      var cp1y = p0y + 2 / 3 * (p1y - p0y); // CP1 = QP0 + 2/3 *(QP1-QP0)

      var cp2x = cp1x + 1 / 3 * (p2x - p0x); // CP2 = CP1 + 1/3 *(QP2-QP0)

      var cp2y = cp1y + 1 / 3 * (p2y - p0y); // CP2 = CP1 + 1/3 *(QP2-QP0)

      this.addBezierCurve(p0x, p0y, cp1x, cp2x, cp1y, cp2y, p2x, p2y);
    }
  }, {
    key: "isPointInBox",
    value: function isPointInBox(x, y) {
      var x1 = this.x1,
          y1 = this.y1,
          x2 = this.x2,
          y2 = this.y2;
      return x1 <= x && x <= x2 && y1 <= y && y <= y2;
    }
  }, {
    key: "x",
    get: function get() {
      return this.x1;
    }
  }, {
    key: "y",
    get: function get() {
      return this.y1;
    }
  }, {
    key: "width",
    get: function get() {
      return this.x2 - this.x1;
    }
  }, {
    key: "height",
    get: function get() {
      return this.y2 - this.y1;
    }
  }]);

  return BoundingBox;
}();

var Translate =
/*#__PURE__*/
function () {
  function Translate(_, point) {
    _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_19___default()(this, Translate);

    this.type = 'translate';
    this.point = null;
    this.point = Point.parse(point);
  }

  _babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_20___default()(Translate, [{
    key: "apply",
    value: function apply(ctx) {
      var _this$point = this.point,
          x = _this$point.x,
          y = _this$point.y;
      ctx.translate(x || 0.0, y || 0.0);
    }
  }, {
    key: "unapply",
    value: function unapply(ctx) {
      var _this$point2 = this.point,
          x = _this$point2.x,
          y = _this$point2.y;
      ctx.translate(-1.0 * x || 0.0, -1.0 * y || 0.0);
    }
  }, {
    key: "applyToPoint",
    value: function applyToPoint(point) {
      var _this$point3 = this.point,
          x = _this$point3.x,
          y = _this$point3.y;
      point.applyTransform([1, 0, 0, 1, x || 0.0, y || 0.0]);
    }
  }]);

  return Translate;
}();

var Rotate =
/*#__PURE__*/
function () {
  function Rotate(document, rotate) {
    var transformOrigin = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];

    _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_19___default()(this, Rotate);

    this.type = 'rotate';
    this.angle = null;
    this.cx = 0;
    this.cy = 0;
    var numbers = toNumbers(rotate);
    this.angle = new Property(document, 'angle', numbers[0]);
    this.cx = (numbers[1] || 0) + (transformOrigin[0] || 0);
    this.cy = (numbers[2] || 0) + (transformOrigin[1] || 0);
  }

  _babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_20___default()(Rotate, [{
    key: "apply",
    value: function apply(ctx) {
      var cx = this.cx,
          cy = this.cy,
          angle = this.angle;
      ctx.translate(cx, cy);
      ctx.rotate(angle.getRadians());
      ctx.translate(-cx, -cy);
    }
  }, {
    key: "unapply",
    value: function unapply(ctx) {
      var cx = this.cx,
          cy = this.cy,
          angle = this.angle;
      ctx.translate(cx, cy);
      ctx.rotate(-1.0 * angle.getRadians());
      ctx.translate(-cx, -cy);
    }
  }, {
    key: "applyToPoint",
    value: function applyToPoint(point) {
      var cx = this.cx,
          cy = this.cy,
          angle = this.angle;
      var rad = angle.getRadians(); // tslint:disable-next-line: no-console
      // console.warn('Unknown action:', (this as any).p, this);
      // ?

      point.applyTransform([1, 0, 0, 1, cx || 0.0, cy || 0.0 // this.p.y
      ]);
      point.applyTransform([Math.cos(rad), Math.sin(rad), -Math.sin(rad), Math.cos(rad), 0, 0]);
      point.applyTransform([1, 0, 0, 1, -cx || 0.0, -cy || 0.0 // -this.p.y
      ]);
    }
  }]);

  return Rotate;
}();

var Scale =
/*#__PURE__*/
function () {
  function Scale(_, scale) {
    _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_19___default()(this, Scale);

    this.type = 'scale';
    this.scale = null;
    var scaleSize = Point.parse(scale, 1); // Workaround for node-canvas

    if (scaleSize.x === 0 || scaleSize.y === 0) {
      scaleSize.x = PSEUDO_ZERO;
      scaleSize.y = PSEUDO_ZERO;
    }

    this.scale = scaleSize;
  }

  _babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_20___default()(Scale, [{
    key: "apply",
    value: function apply(ctx) {
      var _this$scale = this.scale,
          x = _this$scale.x,
          y = _this$scale.y;
      ctx.scale(x, y || x);
    }
  }, {
    key: "unapply",
    value: function unapply(ctx) {
      var _this$scale2 = this.scale,
          x = _this$scale2.x,
          y = _this$scale2.y;
      ctx.scale(1.0 / x, 1.0 / y || x);
    }
  }, {
    key: "applyToPoint",
    value: function applyToPoint(point) {
      var _this$scale3 = this.scale,
          x = _this$scale3.x,
          y = _this$scale3.y;
      point.applyTransform([x || 0.0, 0, 0, y || 0.0, 0, 0]);
    }
  }]);

  return Scale;
}();

var Matrix =
/*#__PURE__*/
function () {
  function Matrix(_, matrix) {
    _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_19___default()(this, Matrix);

    this.type = 'matrix';
    this.matrix = [];
    this.matrix = toNumbers(matrix);
  }

  _babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_20___default()(Matrix, [{
    key: "apply",
    value: function apply(ctx) {
      var matrix = this.matrix;
      ctx.transform(matrix[0], matrix[1], matrix[2], matrix[3], matrix[4], matrix[5]);
    }
  }, {
    key: "unapply",
    value: function unapply(ctx) {
      var matrix = this.matrix;
      var a = matrix[0];
      var b = matrix[2];
      var c = matrix[4];
      var d = matrix[1];
      var e = matrix[3];
      var f = matrix[5];
      var g = 0.0;
      var h = 0.0;
      var i = 1.0;
      var det = 1 / (a * (e * i - f * h) - b * (d * i - f * g) + c * (d * h - e * g));
      ctx.transform(det * (e * i - f * h), det * (f * g - d * i), det * (c * h - b * i), det * (a * i - c * g), det * (b * f - c * e), det * (c * d - a * f));
    }
  }, {
    key: "applyToPoint",
    value: function applyToPoint(point) {
      point.applyTransform(this.matrix);
    }
  }]);

  return Matrix;
}();

var Skew =
/*#__PURE__*/
function (_Matrix) {
  _babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_33___default()(Skew, _Matrix);

  function Skew(document, skew) {
    var _this;

    _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_19___default()(this, Skew);

    _this = _babel_runtime_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_31___default()(this, _babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_32___default()(Skew).call(this, document, skew));
    _this.type = 'skew';
    _this.angle = null;
    _this.angle = new Property(document, 'angle', skew);
    return _this;
  }

  return Skew;
}(Matrix);

var SkewX =
/*#__PURE__*/
function (_Skew) {
  _babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_33___default()(SkewX, _Skew);

  function SkewX(document, skew) {
    var _this;

    _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_19___default()(this, SkewX);

    _this = _babel_runtime_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_31___default()(this, _babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_32___default()(SkewX).call(this, document, skew));
    _this.type = 'skewX';
    _this.matrix = [1, 0, Math.tan(_this.angle.getRadians()), 1, 0, 0];
    return _this;
  }

  return SkewX;
}(Skew);

var SkewY =
/*#__PURE__*/
function (_Skew) {
  _babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_33___default()(SkewY, _Skew);

  function SkewY(document, skew) {
    var _this;

    _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_19___default()(this, SkewY);

    _this = _babel_runtime_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_31___default()(this, _babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_32___default()(SkewY).call(this, document, skew));
    _this.type = 'skewY';
    _this.matrix = [1, Math.tan(_this.angle.getRadians()), 0, 1, 0, 0];
    return _this;
  }

  return SkewY;
}(Skew);

function parseTransforms(transform) {
  return compressSpaces(transform).trim().replace(/\)([a-zA-Z])/g, ') $1').replace(/\)(\s?,\s?)/g, ') ').split(/\s(?=[a-z])/);
}

function parseTransform(transform) {
  var _transform$split = transform.split('('),
      _transform$split2 = _babel_runtime_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_6___default()(_transform$split, 2),
      type = _transform$split2[0],
      value = _transform$split2[1];

  return [type.trim(), value.trim().replace(')', '')];
}

var Transform =
/*#__PURE__*/
function () {
  function Transform(document, transform, transformOrigin) {
    var _this = this;

    _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_19___default()(this, Transform);

    this.document = document;
    this.transforms = [];
    var data = parseTransforms(transform);
    var originCoords = transformOrigin ? toNumbers(transformOrigin) : [];
    data.forEach(function (transform) {
      if (transform === 'none') {
        return;
      }

      var _parseTransform = parseTransform(transform),
          _parseTransform2 = _babel_runtime_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_6___default()(_parseTransform, 2),
          type = _parseTransform2[0],
          value = _parseTransform2[1];

      var TransformType = Transform.transformTypes[type];

      if (typeof TransformType !== 'undefined') {
        _this.transforms.push(new TransformType(_this.document, value, originCoords));
      }
    });
  }

  _babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_20___default()(Transform, [{
    key: "apply",
    value: function apply(ctx) {
      var transforms = this.transforms;
      var len = transforms.length;

      for (var i = 0; i < len; i++) {
        transforms[i].apply(ctx);
      }
    }
  }, {
    key: "unapply",
    value: function unapply(ctx) {
      var transforms = this.transforms;
      var len = transforms.length;

      for (var i = len - 1; i >= 0; i--) {
        transforms[i].unapply(ctx);
      }
    } // TODO: applyToPoint unused ... remove?

  }, {
    key: "applyToPoint",
    value: function applyToPoint(point) {
      var transforms = this.transforms;
      var len = transforms.length;

      for (var i = 0; i < len; i++) {
        transforms[i].applyToPoint(point);
      }
    }
  }], [{
    key: "fromElement",
    value: function fromElement(document, element) {
      var transformStyle = element.getStyle('transform', false, true);
      var transformOriginStyle = element.getStyle('transform-origin', false, true);

      if (transformStyle.hasValue()) {
        return new Transform(document, transformStyle.getString(), transformOriginStyle.getString());
      }

      return null;
    }
  }]);

  return Transform;
}();
Transform.transformTypes = {
  translate: Translate,
  rotate: Rotate,
  scale: Scale,
  matrix: Matrix,
  skewX: SkewX,
  skewY: SkewY
};

var RenderedElement =
/*#__PURE__*/
function (_Element) {
  _babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_33___default()(RenderedElement, _Element);

  function RenderedElement() {
    var _this;

    _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_19___default()(this, RenderedElement);

    _this = _babel_runtime_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_31___default()(this, _babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_32___default()(RenderedElement).apply(this, arguments));
    _this.modifiedEmSizeStack = false;
    return _this;
  }

  _babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_20___default()(RenderedElement, [{
    key: "calculateOpacity",
    value: function calculateOpacity() {
      var opacity = 1.0; // tslint:disable-next-line: no-this-assignment

      var element = this;

      while (element) {
        var opacityStyle = element.getStyle('opacity', false, true); // no ancestors on style call

        if (opacityStyle.hasValue()) {
          opacity *= opacityStyle.getNumber();
        }

        element = element.parent;
      }

      return opacity;
    }
  }, {
    key: "setContext",
    value: function setContext(ctx) {
      var fromMeasure = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

      if (!fromMeasure) {
        // causes stack overflow when measuring text with gradients
        // fill
        var fillStyleProp = this.getStyle('fill');
        var fillOpacityStyleProp = this.getStyle('fill-opacity');
        var strokeStyleProp = this.getStyle('stroke');
        var strokeOpacityProp = this.getStyle('stroke-opacity');

        if (fillStyleProp.isUrlDefinition()) {
          var fillStyle = fillStyleProp.getFillStyleDefinition(this, fillOpacityStyleProp);

          if (fillStyle) {
            ctx.fillStyle = fillStyle;
          }
        } else if (fillStyleProp.hasValue()) {
          if (fillStyleProp.getString() === 'currentColor') {
            fillStyleProp.setValue(this.getStyle('color').getValue());
          }

          var _fillStyle = fillStyleProp.getString();

          if (_fillStyle !== 'inherit') {
            ctx.fillStyle = _fillStyle === 'none' ? 'rgba(0,0,0,0)' : _fillStyle;
          }
        }

        if (fillOpacityStyleProp.hasValue()) {
          var _fillStyle2 = new Property(this.document, 'fill', ctx.fillStyle).addOpacity(fillOpacityStyleProp).getString();

          ctx.fillStyle = _fillStyle2;
        } // stroke


        if (strokeStyleProp.isUrlDefinition()) {
          var strokeStyle = strokeStyleProp.getFillStyleDefinition(this, strokeOpacityProp);

          if (strokeStyle) {
            ctx.strokeStyle = strokeStyle;
          }
        } else if (strokeStyleProp.hasValue()) {
          if (strokeStyleProp.getString() === 'currentColor') {
            strokeStyleProp.setValue(this.getStyle('color').getValue());
          }

          var _strokeStyle = strokeStyleProp.getString();

          if (_strokeStyle !== 'inherit') {
            ctx.strokeStyle = _strokeStyle === 'none' ? 'rgba(0,0,0,0)' : _strokeStyle;
          }
        }

        if (strokeOpacityProp.hasValue()) {
          var _strokeStyle2 = new Property(this.document, 'stroke', ctx.strokeStyle).addOpacity(strokeOpacityProp).getString();

          ctx.strokeStyle = _strokeStyle2;
        }

        var strokeWidthStyleProp = this.getStyle('stroke-width');

        if (strokeWidthStyleProp.hasValue()) {
          var newLineWidth = strokeWidthStyleProp.getPixels();
          ctx.lineWidth = !newLineWidth ? PSEUDO_ZERO // browsers don't respect 0 (or node-canvas? :-)
          : newLineWidth;
        }

        var strokeLinecapStyleProp = this.getStyle('stroke-linecap');
        var strokeLinejoinStyleProp = this.getStyle('stroke-linejoin');
        var strokeMiterlimitProp = this.getStyle('stroke-miterlimit');
        var pointOrderStyleProp = this.getStyle('paint-order');
        var strokeDasharrayStyleProp = this.getStyle('stroke-dasharray');
        var strokeDashoffsetProp = this.getStyle('stroke-dashoffset');

        if (strokeLinecapStyleProp.hasValue()) {
          ctx.lineCap = strokeLinecapStyleProp.getString();
        }

        if (strokeLinejoinStyleProp.hasValue()) {
          ctx.lineJoin = strokeLinejoinStyleProp.getString();
        }

        if (strokeMiterlimitProp.hasValue()) {
          ctx.miterLimit = strokeMiterlimitProp.getNumber();
        }

        if (pointOrderStyleProp.hasValue()) {
          // ?
          ctx.paintOrder = pointOrderStyleProp.getValue();
        }

        if (strokeDasharrayStyleProp.hasValue() && strokeDasharrayStyleProp.getString() !== 'none') {
          var gaps = toNumbers(strokeDasharrayStyleProp.getString());

          if (typeof ctx.setLineDash !== 'undefined') {
            ctx.setLineDash(gaps);
          } else if (typeof ctx.webkitLineDash !== 'undefined') {
            ctx.webkitLineDash = gaps;
          } else if (typeof ctx.mozDash !== 'undefined' && !(gaps.length === 1 && gaps[0] === 0)) {
            ctx.mozDash = gaps;
          }

          var offset = strokeDashoffsetProp.getPixels();

          if (typeof ctx.lineDashOffset !== 'undefined') {
            ctx.lineDashOffset = offset;
          } else if (typeof ctx.webkitLineDashOffset !== 'undefined') {
            ctx.webkitLineDashOffset = offset;
          } else if (typeof ctx.mozDashOffset !== 'undefined') {
            ctx.mozDashOffset = offset;
          }
        }
      } // font


      this.modifiedEmSizeStack = false;

      if (typeof ctx.font !== 'undefined') {
        var fontStyleProp = this.getStyle('font');
        var fontStyleStyleProp = this.getStyle('font-style');
        var fontVariantStyleProp = this.getStyle('font-variant');
        var fontWeightStyleProp = this.getStyle('font-weight');
        var fontSizeStyleProp = this.getStyle('font-size');
        var fontFamilyStyleProp = this.getStyle('font-family');
        var font = new Font(fontStyleStyleProp.getString(), fontVariantStyleProp.getString(), fontWeightStyleProp.getString(), fontSizeStyleProp.hasValue() ? "".concat(fontSizeStyleProp.getPixels(true), "px") : '', fontFamilyStyleProp.getString(), Font.parse(fontStyleProp.getString(), ctx.font));
        fontStyleStyleProp.setValue(font.fontStyle);
        fontVariantStyleProp.setValue(font.fontVariant);
        fontWeightStyleProp.setValue(font.fontWeight);
        fontSizeStyleProp.setValue(font.fontSize);
        fontFamilyStyleProp.setValue(font.fontFamily);
        ctx.font = font.toString();

        if (fontSizeStyleProp.isPixels()) {
          this.document.emSize = fontSizeStyleProp.getPixels();
          this.modifiedEmSizeStack = true;
        }
      } // transform


      var transform = Transform.fromElement(this.document, this);

      if (transform) {
        transform.apply(ctx);
      } // clip


      var clipPathStyleProp = this.getStyle('clip-path', false, true);

      if (clipPathStyleProp.hasValue()) {
        var clip = clipPathStyleProp.getDefinition();

        if (clip) {
          clip.apply(ctx);
        }
      } // opacity


      ctx.globalAlpha = this.calculateOpacity();
    }
  }, {
    key: "clearContext",
    value: function clearContext(ctx) {
      _babel_runtime_helpers_get__WEBPACK_IMPORTED_MODULE_42___default()(_babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_32___default()(RenderedElement.prototype), "clearContext", this).call(this, ctx);

      if (this.modifiedEmSizeStack) {
        this.document.popEmSize();
      }
    }
  }]);

  return RenderedElement;
}(Element);

var TextElement =
/*#__PURE__*/
function (_RenderedElement) {
  _babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_33___default()(TextElement, _RenderedElement);

  function TextElement(document, node, captureTextNodes) {
    var _this;

    _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_19___default()(this, TextElement);

    _this = _babel_runtime_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_31___default()(this, _babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_32___default()(TextElement).call(this, document, node, (this instanceof TextElement ? this.constructor : void 0) === TextElement ? true : captureTextNodes));
    _this.type = 'text';
    _this.x = 0;
    _this.y = 0;
    _this.measureCache = -1;
    return _this;
  }

  _babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_20___default()(TextElement, [{
    key: "setContext",
    value: function setContext(ctx) {
      var fromMeasure = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

      _babel_runtime_helpers_get__WEBPACK_IMPORTED_MODULE_42___default()(_babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_32___default()(TextElement.prototype), "setContext", this).call(this, ctx, fromMeasure);

      var textBaseline = this.getStyle('dominant-baseline').getTextBaseline() || this.getStyle('alignment-baseline').getTextBaseline();

      if (textBaseline) {
        ctx.textBaseline = textBaseline;
      }
    }
  }, {
    key: "initializeCoordinates",
    value: function initializeCoordinates(ctx) {
      this.x = this.getAttribute('x').getPixels('x');
      this.y = this.getAttribute('y').getPixels('y');
      var dxAttr = this.getAttribute('dx');
      var dyAttr = this.getAttribute('dy');

      if (dxAttr.hasValue()) {
        this.x += dxAttr.getPixels('x');
      }

      if (dyAttr.hasValue()) {
        this.y += dyAttr.getPixels('y');
      }

      this.x += this.getAnchorDelta(ctx, this, 0);
    }
  }, {
    key: "getBoundingBox",
    value: function getBoundingBox(ctx) {
      var _this2 = this;

      if (this.type !== 'text') {
        return this.getTElementBoundingBox(ctx);
      }

      this.initializeCoordinates(ctx);
      var boundingBox = null;
      this.children.forEach(function (_, i) {
        var childBoundingBox = _this2.getChildBoundingBox(ctx, _this2, _this2, i);

        if (!boundingBox) {
          boundingBox = childBoundingBox;
        } else {
          boundingBox.addBoundingBox(childBoundingBox);
        }
      });
      return boundingBox;
    }
  }, {
    key: "getFontSize",
    value: function getFontSize() {
      var document = this.document,
          parent = this.parent;
      var inheritFontSize = Font.parse(document.ctx.font).fontSize;
      var fontSize = parent.getStyle('font-size').getNumber(inheritFontSize);
      return fontSize;
    }
  }, {
    key: "getTElementBoundingBox",
    value: function getTElementBoundingBox(ctx) {
      var fontSize = this.getFontSize();
      return new BoundingBox(this.x, this.y - fontSize, this.x + this.measureText(ctx), this.y);
    }
  }, {
    key: "getGlyph",
    value: function getGlyph(font, text, i) {
      var char = text[i];
      var glyph = null;

      if (font.isArabic) {
        var len = text.length;
        var prevChar = text[i - 1];
        var nextChar = text[i + 1];
        var arabicForm = 'isolated';

        if ((i === 0 || prevChar === ' ') && i < len - 2 && nextChar !== ' ') {
          arabicForm = 'terminal';
        }

        if (i > 0 && prevChar !== ' ' && i < len - 2 && nextChar !== ' ') {
          arabicForm = 'medial';
        }

        if (i > 0 && prevChar !== ' ' && (i === len - 1 || nextChar === ' ')) {
          arabicForm = 'initial';
        }

        if (typeof font.glyphs[char] !== 'undefined') {
          glyph = font.glyphs[char][arabicForm];

          if (!glyph && font.glyphs[char].type === 'glyph') {
            glyph = font.glyphs[char];
          }
        }
      } else {
        glyph = font.glyphs[char];
      }

      if (!glyph) {
        glyph = font.missingGlyph;
      }

      return glyph;
    }
  }, {
    key: "getText",
    value: function getText() {
      return '';
    }
  }, {
    key: "getTextFromNode",
    value: function getTextFromNode(node) {
      var textNode = node || this.node;
      var childNodes = Array.from(textNode.parentNode.childNodes);
      var index = childNodes.indexOf(textNode);
      var lastIndex = childNodes.length - 1;
      var text = compressSpaces(textNode.value || textNode.text || textNode.textContent || '');

      if (index === 0) {
        text = trimLeft(text);
      } else if (index === lastIndex) {
        text = trimRight(text);
      }

      return text;
    }
  }, {
    key: "renderChildren",
    value: function renderChildren(ctx) {
      var _this3 = this;

      if (this.type !== 'text') {
        this.renderTElementChildren(ctx);
        return;
      }

      this.initializeCoordinates(ctx);
      this.children.forEach(function (_, i) {
        _this3.renderChild(ctx, _this3, _this3, i);
      });
      var mouse = this.document.screen.mouse; // Do not calc bounding box if mouse is not working.

      if (mouse.isWorking()) {
        mouse.checkBoundingBox(this, this.getBoundingBox(ctx));
      }
    }
  }, {
    key: "renderTElementChildren",
    value: function renderTElementChildren(ctx) {
      var document = this.document,
          parent = this.parent;
      var renderText = this.getText();
      var customFont = parent.getStyle('font-family').getDefinition();

      if (customFont) {
        var unitsPerEm = customFont.fontFace.unitsPerEm;
        var ctxFont = Font.parse(document.ctx.font);
        var fontSize = parent.getStyle('font-size').getNumber(ctxFont.fontSize);
        var fontStyle = parent.getStyle('font-style').getString(ctxFont.fontStyle);
        var scale = fontSize / unitsPerEm;
        var text = customFont.isRTL ? renderText.split('').reverse().join('') : renderText;
        var dx = toNumbers(parent.getAttribute('dx').getString());
        var len = text.length;

        for (var i = 0; i < len; i++) {
          var glyph = this.getGlyph(customFont, text, i);
          ctx.translate(this.x, this.y);
          ctx.scale(scale, -scale);
          var lw = ctx.lineWidth;
          ctx.lineWidth = ctx.lineWidth * unitsPerEm / fontSize;

          if (fontStyle === 'italic') {
            ctx.transform(1, 0, .4, 1, 0, 0);
          }

          glyph.render(ctx);

          if (fontStyle === 'italic') {
            ctx.transform(1, 0, -.4, 1, 0, 0);
          }

          ctx.lineWidth = lw;
          ctx.scale(1 / scale, -1 / scale);
          ctx.translate(-this.x, -this.y);
          this.x += fontSize * (glyph.horizAdvX || customFont.horizAdvX) / unitsPerEm;

          if (typeof dx[i] !== 'undefined' && !isNaN(dx[i])) {
            this.x += dx[i];
          }
        }

        return;
      }

      var x = this.x,
          y = this.y;

      if (ctx.paintOrder === 'stroke') {
        if (ctx.strokeStyle) {
          ctx.strokeText(renderText, x, y);
        }

        if (ctx.fillStyle) {
          ctx.fillText(renderText, x, y);
        }
      } else {
        if (ctx.fillStyle) {
          ctx.fillText(renderText, x, y);
        }

        if (ctx.strokeStyle) {
          ctx.strokeText(renderText, x, y);
        }
      }
    }
  }, {
    key: "getAnchorDelta",
    value: function getAnchorDelta(ctx, parent, startI) {
      var textAnchor = this.getStyle('text-anchor').getString('start');

      if (textAnchor !== 'start') {
        var children = parent.children;
        var len = children.length;
        var child = null;
        var width = 0;

        for (var i = startI; i < len; i++) {
          child = children[i];

          if (i > startI && child.getAttribute('x').hasValue() || child.getAttribute('text-anchor').hasValue()) {
            break; // new group
          }

          width += child.measureTextRecursive(ctx);
        }

        return -1 * (textAnchor === 'end' ? width : width / 2.0);
      }

      return 0;
    }
  }, {
    key: "adjustChildCoordinates",
    value: function adjustChildCoordinates(ctx, textParent, parent, i) {
      var child = parent.children[i];

      if (typeof child.measureText !== 'function') {
        return child;
      }

      var xAttr = child.getAttribute('x');
      var yAttr = child.getAttribute('y');
      var dxAttr = child.getAttribute('dx');
      var dyAttr = child.getAttribute('dy');
      var textAnchor = child.getAttribute('text-anchor').getString('start');

      if (i === 0 && child.type !== 'textNode') {
        if (!xAttr.hasValue()) {
          xAttr.setValue(textParent.getAttribute('x').getValue('0'));
        }

        if (!yAttr.hasValue()) {
          yAttr.setValue(textParent.getAttribute('y').getValue('0'));
        }

        if (!dxAttr.hasValue()) {
          dxAttr.setValue(textParent.getAttribute('dx').getValue('0'));
        }

        if (!dyAttr.hasValue()) {
          dyAttr.setValue(textParent.getAttribute('dy').getValue('0'));
        }
      }

      if (xAttr.hasValue()) {
        child.x = xAttr.getPixels('x') + textParent.getAnchorDelta(ctx, parent, i);

        if (textAnchor !== 'start') {
          var width = child.measureTextRecursive(ctx);
          child.x += -1 * (textAnchor === 'end' ? width : width / 2.0);
        }

        if (dxAttr.hasValue()) {
          child.x += dxAttr.getPixels('x');
        }
      } else {
        if (textAnchor !== 'start') {
          var _width = child.measureTextRecursive(ctx);

          textParent.x += -1 * (textAnchor === 'end' ? _width : _width / 2.0);
        }

        if (dxAttr.hasValue()) {
          textParent.x += dxAttr.getPixels('x');
        }

        child.x = textParent.x;
      }

      textParent.x = child.x + child.measureText(ctx);

      if (yAttr.hasValue()) {
        child.y = yAttr.getPixels('y');

        if (dyAttr.hasValue()) {
          child.y += dyAttr.getPixels('y');
        }
      } else {
        if (dyAttr.hasValue()) {
          textParent.y += dyAttr.getPixels('y');
        }

        child.y = textParent.y;
      }

      textParent.y = child.y;
      return child;
    }
  }, {
    key: "getChildBoundingBox",
    value: function getChildBoundingBox(ctx, textParent, parent, i) {
      var child = this.adjustChildCoordinates(ctx, textParent, parent, i);
      var boundingBox = child.getBoundingBox(ctx);
      child.children.forEach(function (_, i) {
        var childBoundingBox = textParent.getChildBoundingBox(ctx, textParent, child, i);
        boundingBox.addBoundingBox(childBoundingBox);
      });
      return boundingBox;
    }
  }, {
    key: "renderChild",
    value: function renderChild(ctx, textParent, parent, i) {
      var child = this.adjustChildCoordinates(ctx, textParent, parent, i);
      child.render(ctx);
      child.children.forEach(function (_, i) {
        textParent.renderChild(ctx, textParent, child, i);
      });
    }
  }, {
    key: "measureTextRecursive",
    value: function measureTextRecursive(ctx) {
      var width = this.children.reduce(function (width, child) {
        return width + child.measureTextRecursive(ctx);
      }, this.measureText(ctx));
      return width;
    }
  }, {
    key: "measureText",
    value: function measureText(ctx) {
      var measureCache = this.measureCache;

      if (~measureCache) {
        return measureCache;
      }

      var renderText = this.getText();
      var measure = this.measureTargetText(ctx, renderText);
      this.measureCache = measure;
      return measure;
    }
  }, {
    key: "measureTargetText",
    value: function measureTargetText(ctx, targetText) {
      if (!targetText.length) {
        return 0;
      }

      var parent = this.parent;
      var customFont = parent.getStyle('font-family').getDefinition();

      if (customFont) {
        var fontSize = this.getFontSize();
        var text = customFont.isRTL ? targetText.split('').reverse().join('') : targetText;
        var dx = toNumbers(parent.getAttribute('dx').getString());
        var len = text.length;
        var _measure = 0;

        for (var i = 0; i < len; i++) {
          var glyph = this.getGlyph(customFont, text, i);
          _measure += (glyph.horizAdvX || customFont.horizAdvX) * fontSize / customFont.fontFace.unitsPerEm;

          if (typeof dx[i] !== 'undefined' && !isNaN(dx[i])) {
            _measure += dx[i];
          }
        }

        return _measure;
      }

      if (!ctx.measureText) {
        return targetText.length * 10;
      }

      ctx.save();
      this.setContext(ctx, true);

      var _ctx$measureText = ctx.measureText(targetText),
          measure = _ctx$measureText.width;

      ctx.restore();
      return measure;
    }
  }]);

  return TextElement;
}(RenderedElement);

var TSpanElement =
/*#__PURE__*/
function (_TextElement) {
  _babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_33___default()(TSpanElement, _TextElement);

  function TSpanElement(document, node, captureTextNodes) {
    var _this;

    _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_19___default()(this, TSpanElement);

    _this = _babel_runtime_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_31___default()(this, _babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_32___default()(TSpanElement).call(this, document, node, (this instanceof TSpanElement ? this.constructor : void 0) === TSpanElement ? true : captureTextNodes));
    _this.type = 'tspan'; // if this node has children, then they own the text

    _this.text = _this.children.length > 0 ? '' : _this.getTextFromNode();
    return _this;
  }

  _babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_20___default()(TSpanElement, [{
    key: "getText",
    value: function getText() {
      return this.text;
    }
  }]);

  return TSpanElement;
}(TextElement);

var TextNode =
/*#__PURE__*/
function (_TSpanElement) {
  _babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_33___default()(TextNode, _TSpanElement);

  function TextNode() {
    var _this;

    _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_19___default()(this, TextNode);

    _this = _babel_runtime_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_31___default()(this, _babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_32___default()(TextNode).apply(this, arguments));
    _this.type = 'textNode';
    return _this;
  }

  return TextNode;
}(TSpanElement);

function preparePath(path) {
  var d = path.replace(/,/gm, ' ') // get rid of all commas
  // As the end of a match can also be the start of the next match, we need to run this replace twice.
  .replace(/([MmZzLlHhVvCcSsQqTtAa])([^\s])/gm, '$1 $2') // suffix commands with spaces
  .replace(/([MmZzLlHhVvCcSsQqTtAa])([^\s])/gm, '$1 $2') // suffix commands with spaces
  .replace(/([^\s])([MmZzLlHhVvCcSsQqTtAa])/gm, '$1 $2') // prefix commands with spaces
  .replace(/([0-9])([+\-])/gm, '$1 $2') // separate digits on +- signs
  // Again, we need to run this twice to find all occurances
  .replace(/(\.[0-9]*)(\.)/gm, '$1 $2') // separate digits when they start with a comma
  .replace(/(\.[0-9]*)(\.)/gm, '$1 $2') // separate digits when they start with a comma
  .replace(/([Aa](\s+[0-9]+){3})\s+([01])\s*([01])/gm, '$1 $3 $4 '); // shorthand elliptical arc path syntax

  return compressSpaces(d).trim();
}

var PathParser =
/*#__PURE__*/
function () {
  function PathParser(path) {
    _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_19___default()(this, PathParser);

    this.control = null;
    this.start = null;
    this.current = null;
    this.command = '';
    this.tokens = [];
    this.i = -1;
    this.previousCommand = '';
    this.points = [];
    this.angles = [];
    this.tokens = preparePath(path).split(' ');
  }

  _babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_20___default()(PathParser, [{
    key: "reset",
    value: function reset() {
      this.i = -1;
      this.command = '';
      this.previousCommand = '';
      this.start = new Point(0, 0);
      this.control = new Point(0, 0);
      this.current = new Point(0, 0);
      this.points = [];
      this.angles = [];
    }
  }, {
    key: "isEnd",
    value: function isEnd() {
      var i = this.i,
          tokens = this.tokens;
      return i >= tokens.length - 1;
    }
  }, {
    key: "isCommandOrEnd",
    value: function isCommandOrEnd() {
      if (this.isEnd()) {
        return true;
      }

      var i = this.i,
          tokens = this.tokens;
      return /^[A-Za-z]$/.test(tokens[i + 1]);
    }
  }, {
    key: "isRelativeCommand",
    value: function isRelativeCommand() {
      switch (this.command) {
        case 'm':
        case 'l':
        case 'h':
        case 'v':
        case 'c':
        case 's':
        case 'q':
        case 't':
        case 'a':
        case 'z':
          return true;

        default:
          return false;
      }
    }
  }, {
    key: "getToken",
    value: function getToken() {
      this.i++;
      return this.tokens[this.i];
    }
  }, {
    key: "getScalar",
    value: function getScalar() {
      return parseFloat(this.getToken());
    }
  }, {
    key: "nextCommand",
    value: function nextCommand() {
      this.previousCommand = this.command;
      this.command = this.getToken();
    }
  }, {
    key: "getPoint",
    value: function getPoint() {
      var point = new Point(this.getScalar(), this.getScalar());
      return this.makeAbsolute(point);
    }
  }, {
    key: "getAsControlPoint",
    value: function getAsControlPoint() {
      var point = this.getPoint();
      this.control = point;
      return point;
    }
  }, {
    key: "getAsCurrentPoint",
    value: function getAsCurrentPoint() {
      var point = this.getPoint();
      this.current = point;
      return point;
    }
  }, {
    key: "getReflectedControlPoint",
    value: function getReflectedControlPoint() {
      var previousCommand = this.previousCommand.toLowerCase();

      if (previousCommand !== 'c' && previousCommand !== 's' && previousCommand !== 'q' && previousCommand !== 't') {
        return this.current;
      } // reflect point


      var _this$current = this.current,
          cx = _this$current.x,
          cy = _this$current.y,
          _this$control = this.control,
          ox = _this$control.x,
          oy = _this$control.y;
      var point = new Point(2 * cx - ox, 2 * cy - oy);
      return point;
    }
  }, {
    key: "makeAbsolute",
    value: function makeAbsolute(point) {
      if (this.isRelativeCommand()) {
        var _this$current2 = this.current,
            x = _this$current2.x,
            y = _this$current2.y;
        point.x += x;
        point.y += y;
      }

      return point;
    }
  }, {
    key: "addMarker",
    value: function addMarker(point, from, priorTo) {
      var points = this.points,
          angles = this.angles; // if the last angle isn't filled in because we didn't have this point yet ...

      if (priorTo && angles.length > 0 && !angles[angles.length - 1]) {
        angles[angles.length - 1] = points[points.length - 1].angleTo(priorTo);
      }

      this.addMarkerAngle(point, from ? from.angleTo(point) : null);
    }
  }, {
    key: "addMarkerAngle",
    value: function addMarkerAngle(point, angle) {
      this.points.push(point);
      this.angles.push(angle);
    }
  }, {
    key: "getMarkerPoints",
    value: function getMarkerPoints() {
      return this.points;
    }
  }, {
    key: "getMarkerAngles",
    value: function getMarkerAngles() {
      var angles = this.angles;
      var len = angles.length;

      for (var i = 0; i < len; i++) {
        if (!angles[i]) {
          for (var j = i + 1; j < len; j++) {
            if (angles[j]) {
              angles[i] = angles[j];
              break;
            }
          }
        }
      }

      return angles;
    }
  }]);

  return PathParser;
}();

var PathElement =
/*#__PURE__*/
function (_RenderedElement) {
  _babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_33___default()(PathElement, _RenderedElement);

  function PathElement(document, node, captureTextNodes) {
    var _this;

    _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_19___default()(this, PathElement);

    _this = _babel_runtime_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_31___default()(this, _babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_32___default()(PathElement).call(this, document, node, captureTextNodes));
    _this.type = 'path';
    _this.pathParser = null;
    _this.pathParser = new PathParser(_this.getAttribute('d').getString());
    return _this;
  }

  _babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_20___default()(PathElement, [{
    key: "path",
    value: function path(ctx) {
      var pathParser = this.pathParser;
      var boundingBox = new BoundingBox();
      pathParser.reset();

      if (ctx) {
        ctx.beginPath();
      }

      while (!pathParser.isEnd()) {
        pathParser.nextCommand();

        switch (pathParser.command) {
          case 'M':
          case 'm':
            this.pathM(ctx, boundingBox);
            break;

          case 'L':
          case 'l':
            this.pathL(ctx, boundingBox);
            break;

          case 'H':
          case 'h':
            this.pathH(ctx, boundingBox);
            break;

          case 'V':
          case 'v':
            this.pathV(ctx, boundingBox);
            break;

          case 'C':
          case 'c':
            this.pathC(ctx, boundingBox);
            break;

          case 'S':
          case 's':
            this.pathS(ctx, boundingBox);
            break;

          case 'Q':
          case 'q':
            this.pathQ(ctx, boundingBox);
            break;

          case 'T':
          case 't':
            this.pathT(ctx, boundingBox);
            break;

          case 'A':
          case 'a':
            this.pathA(ctx, boundingBox);
            break;

          case 'Z':
          case 'z':
            this.pathZ(ctx, boundingBox);
            break;

          default:
        }
      }

      return boundingBox;
    }
  }, {
    key: "getBoundingBox",
    value: function getBoundingBox(_) {
      return this.path();
    }
  }, {
    key: "getMarkers",
    value: function getMarkers() {
      var pathParser = this.pathParser;
      var points = pathParser.getMarkerPoints();
      var angles = pathParser.getMarkerAngles();
      var markers = points.map(function (point, i) {
        return [point, angles[i]];
      });
      return markers;
    }
  }, {
    key: "renderChildren",
    value: function renderChildren(ctx) {
      this.path(ctx);
      this.document.screen.mouse.checkPath(this, ctx);
      var fillRuleStyleProp = this.getStyle('fill-rule');

      if (ctx.fillStyle !== '') {
        if (fillRuleStyleProp.getString('inherit') !== 'inherit') {
          ctx.fill(fillRuleStyleProp.getString());
        } else {
          ctx.fill();
        }
      }

      if (ctx.strokeStyle !== '') {
        ctx.stroke();
      }

      var markers = this.getMarkers();

      if (markers) {
        var markersLastIndex = markers.length - 1;
        var markerStartStyleProp = this.getStyle('marker-start');
        var markerMidStyleProp = this.getStyle('marker-mid');
        var markerEndStyleProp = this.getStyle('marker-end');

        if (markerStartStyleProp.isUrlDefinition()) {
          var marker = markerStartStyleProp.getDefinition();

          var _markers$ = _babel_runtime_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_6___default()(markers[0], 2),
              point = _markers$[0],
              angle = _markers$[1];

          marker.render(ctx, point, angle);
        }

        if (markerMidStyleProp.isUrlDefinition()) {
          var _marker = markerMidStyleProp.getDefinition();

          for (var i = 1; i < markersLastIndex; i++) {
            var _markers$i = _babel_runtime_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_6___default()(markers[i], 2),
                _point = _markers$i[0],
                _angle = _markers$i[1];

            _marker.render(ctx, _point, _angle);
          }
        }

        if (markerEndStyleProp.isUrlDefinition()) {
          var _marker2 = markerEndStyleProp.getDefinition();

          var _markers$markersLastI = _babel_runtime_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_6___default()(markers[markersLastIndex], 2),
              _point2 = _markers$markersLastI[0],
              _angle2 = _markers$markersLastI[1];

          _marker2.render(ctx, _point2, _angle2);
        }
      }
    }
  }, {
    key: "pathM",
    value: function pathM(ctx, boundingBox) {
      var pathParser = this.pathParser;
      var point = pathParser.getAsCurrentPoint();
      var x = point.x,
          y = point.y;
      pathParser.addMarker(point);
      boundingBox.addPoint(x, y);

      if (ctx) {
        ctx.moveTo(x, y);
      }

      pathParser.start = pathParser.current;

      while (!pathParser.isCommandOrEnd()) {
        var _point3 = pathParser.getAsCurrentPoint();

        var _x = _point3.x,
            _y = _point3.y;
        pathParser.addMarker(_point3, pathParser.start);
        boundingBox.addPoint(_x, _y);

        if (ctx) {
          ctx.lineTo(_x, _y);
        }
      }
    }
  }, {
    key: "pathL",
    value: function pathL(ctx, boundingBox) {
      var pathParser = this.pathParser;

      while (!pathParser.isCommandOrEnd()) {
        var current = pathParser.current;
        var point = pathParser.getAsCurrentPoint();
        var x = point.x,
            y = point.y;
        pathParser.addMarker(point, current);
        boundingBox.addPoint(x, y);

        if (ctx) {
          ctx.lineTo(x, y);
        }
      }
    }
  }, {
    key: "pathH",
    value: function pathH(ctx, boundingBox) {
      var pathParser = this.pathParser;

      while (!pathParser.isCommandOrEnd()) {
        var current = pathParser.current;
        var point = new Point((pathParser.isRelativeCommand() ? current.x : 0) + pathParser.getScalar(), current.y);
        pathParser.addMarker(point, current);
        pathParser.current = point;
        boundingBox.addPoint(point.x, point.y);

        if (ctx) {
          ctx.lineTo(point.x, point.y);
        }
      }
    }
  }, {
    key: "pathV",
    value: function pathV(ctx, boundingBox) {
      var pathParser = this.pathParser;

      while (!pathParser.isCommandOrEnd()) {
        var current = pathParser.current;
        var point = new Point(current.x, (pathParser.isRelativeCommand() ? current.y : 0) + pathParser.getScalar());
        pathParser.addMarker(point, current);
        pathParser.current = point;
        boundingBox.addPoint(point.x, point.y);

        if (ctx) {
          ctx.lineTo(point.x, point.y);
        }
      }
    }
  }, {
    key: "pathC",
    value: function pathC(ctx, boundingBox) {
      var pathParser = this.pathParser;

      while (!pathParser.isCommandOrEnd()) {
        var current = pathParser.current;
        var point = pathParser.getPoint();
        var controlPoint = pathParser.getAsControlPoint();
        var currentPoint = pathParser.getAsCurrentPoint();
        pathParser.addMarker(currentPoint, controlPoint, point);
        boundingBox.addBezierCurve(current.x, current.y, point.x, point.y, controlPoint.x, controlPoint.y, currentPoint.x, currentPoint.y);

        if (ctx) {
          ctx.bezierCurveTo(point.x, point.y, controlPoint.x, controlPoint.y, currentPoint.x, currentPoint.y);
        }
      }
    }
  }, {
    key: "pathS",
    value: function pathS(ctx, boundingBox) {
      var pathParser = this.pathParser;

      while (!pathParser.isCommandOrEnd()) {
        var current = pathParser.current;
        var point = pathParser.getReflectedControlPoint();
        var controlPoint = pathParser.getAsControlPoint();
        var currentPoint = pathParser.getAsCurrentPoint();
        pathParser.addMarker(currentPoint, controlPoint, point);
        boundingBox.addBezierCurve(current.x, current.y, point.x, point.y, controlPoint.x, controlPoint.y, currentPoint.x, currentPoint.y);

        if (ctx) {
          ctx.bezierCurveTo(point.x, point.y, controlPoint.x, controlPoint.y, currentPoint.x, currentPoint.y);
        }
      }
    }
  }, {
    key: "pathQ",
    value: function pathQ(ctx, boundingBox) {
      var pathParser = this.pathParser;

      while (!pathParser.isCommandOrEnd()) {
        var current = pathParser.current;
        var controlPoint = pathParser.getAsControlPoint();
        var currentPoint = pathParser.getAsCurrentPoint();
        pathParser.addMarker(currentPoint, controlPoint, controlPoint);
        boundingBox.addQuadraticCurve(current.x, current.y, controlPoint.x, controlPoint.y, currentPoint.x, currentPoint.y);

        if (ctx) {
          ctx.quadraticCurveTo(controlPoint.x, controlPoint.y, currentPoint.x, currentPoint.y);
        }
      }
    }
  }, {
    key: "pathT",
    value: function pathT(ctx, boundingBox) {
      var pathParser = this.pathParser;

      while (!pathParser.isCommandOrEnd()) {
        var current = pathParser.current;
        var controlPoint = pathParser.getReflectedControlPoint();
        pathParser.control = controlPoint;
        var currentPoint = pathParser.getAsCurrentPoint();
        pathParser.addMarker(currentPoint, controlPoint, controlPoint);
        boundingBox.addQuadraticCurve(current.x, current.y, controlPoint.x, controlPoint.y, currentPoint.x, currentPoint.y);

        if (ctx) {
          ctx.quadraticCurveTo(controlPoint.x, controlPoint.y, currentPoint.x, currentPoint.y);
        }
      }
    }
  }, {
    key: "pathA",
    value: function pathA(ctx, boundingBox) {
      var pathParser = this.pathParser;

      while (!pathParser.isCommandOrEnd()) {
        var current = pathParser.current;
        var rx = pathParser.getScalar();
        var ry = pathParser.getScalar();
        var xAxisRotation = pathParser.getScalar() * (Math.PI / 180.0);
        var largeArcFlag = pathParser.getScalar();
        var sweepFlag = pathParser.getScalar();
        var currentPoint = pathParser.getAsCurrentPoint(); // Conversion from endpoint to center parameterization
        // http://www.w3.org/TR/SVG11/implnote.html#ArcImplementationNotes
        // x1', y1'

        var currp = new Point(Math.cos(xAxisRotation) * (current.x - currentPoint.x) / 2.0 + Math.sin(xAxisRotation) * (current.y - currentPoint.y) / 2.0, -Math.sin(xAxisRotation) * (current.x - currentPoint.x) / 2.0 + Math.cos(xAxisRotation) * (current.y - currentPoint.y) / 2.0); // adjust radii

        var l = Math.pow(currp.x, 2) / Math.pow(rx, 2) + Math.pow(currp.y, 2) / Math.pow(ry, 2);

        if (l > 1) {
          rx *= Math.sqrt(l);
          ry *= Math.sqrt(l);
        } // cx', cy'


        var s = (largeArcFlag === sweepFlag ? -1 : 1) * Math.sqrt((Math.pow(rx, 2) * Math.pow(ry, 2) - Math.pow(rx, 2) * Math.pow(currp.y, 2) - Math.pow(ry, 2) * Math.pow(currp.x, 2)) / (Math.pow(rx, 2) * Math.pow(currp.y, 2) + Math.pow(ry, 2) * Math.pow(currp.x, 2)));

        if (isNaN(s)) {
          s = 0;
        }

        var cpp = new Point(s * rx * currp.y / ry, s * -ry * currp.x / rx); // cx, cy

        var centp = new Point((current.x + currentPoint.x) / 2.0 + Math.cos(xAxisRotation) * cpp.x - Math.sin(xAxisRotation) * cpp.y, (current.y + currentPoint.y) / 2.0 + Math.sin(xAxisRotation) * cpp.x + Math.cos(xAxisRotation) * cpp.y); // initial angle

        var a1 = vectorsAngle([1, 0], [(currp.x - cpp.x) / rx, (currp.y - cpp.y) / ry]); // angle delta

        var u = [(currp.x - cpp.x) / rx, (currp.y - cpp.y) / ry];
        var v = [(-currp.x - cpp.x) / rx, (-currp.y - cpp.y) / ry];
        var ad = vectorsAngle(u, v);

        if (vectorsRatio(u, v) <= -1) {
          ad = Math.PI;
        }

        if (vectorsRatio(u, v) >= 1) {
          ad = 0;
        } // for markers


        var dir = 1 - sweepFlag ? 1.0 : -1.0;
        var ah = a1 + dir * (ad / 2.0);
        var halfWay = new Point(centp.x + rx * Math.cos(ah), centp.y + ry * Math.sin(ah));
        pathParser.addMarkerAngle(halfWay, ah - dir * Math.PI / 2);
        pathParser.addMarkerAngle(currentPoint, ah - dir * Math.PI);
        boundingBox.addPoint(currentPoint.x, currentPoint.y); // TODO: this is too naive, make it better

        if (ctx && !isNaN(a1) && !isNaN(ad)) {
          var r = rx > ry ? rx : ry;
          var sx = rx > ry ? 1 : rx / ry;
          var sy = rx > ry ? ry / rx : 1;
          ctx.translate(centp.x, centp.y);
          ctx.rotate(xAxisRotation);
          ctx.scale(sx, sy);
          ctx.arc(0, 0, r, a1, a1 + ad, Boolean(1 - sweepFlag));
          ctx.scale(1 / sx, 1 / sy);
          ctx.rotate(-xAxisRotation);
          ctx.translate(-centp.x, -centp.y);
        }
      }
    }
  }, {
    key: "pathZ",
    value: function pathZ(ctx, boundingBox) {
      var pathParser = this.pathParser;

      if (ctx) {
        // only close path if it is not a straight line
        if (boundingBox.x1 !== boundingBox.x2 && boundingBox.y1 !== boundingBox.y2) {
          ctx.closePath();
        }
      }

      pathParser.current = pathParser.start;
    }
  }]);

  return PathElement;
}(RenderedElement);

var SVGElement =
/*#__PURE__*/
function (_RenderedElement) {
  _babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_33___default()(SVGElement, _RenderedElement);

  function SVGElement() {
    var _this;

    _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_19___default()(this, SVGElement);

    _this = _babel_runtime_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_31___default()(this, _babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_32___default()(SVGElement).apply(this, arguments));
    _this.type = 'svg';
    _this.root = false;
    return _this;
  }

  _babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_20___default()(SVGElement, [{
    key: "clearContext",
    value: function clearContext(ctx) {
      _babel_runtime_helpers_get__WEBPACK_IMPORTED_MODULE_42___default()(_babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_32___default()(SVGElement.prototype), "clearContext", this).call(this, ctx);

      this.document.screen.viewPort.removeCurrent();
    }
  }, {
    key: "setContext",
    value: function setContext(ctx) {
      var document = this.document;
      var screen = document.screen,
          window = document.window;
      var canvas = ctx.canvas;
      screen.setDefaults(ctx);

      if (canvas.style && typeof ctx.font !== 'undefined' && window && typeof window.getComputedStyle !== 'undefined') {
        ctx.font = window.getComputedStyle(canvas).getPropertyValue('font');
        var fontSizeProp = new Property(document, 'fontSize', Font.parse(ctx.font).fontSize);

        if (fontSizeProp.hasValue()) {
          document.rootEmSize = fontSizeProp.getPixels('y');
          document.emSize = document.rootEmSize;
        }
      }

      _babel_runtime_helpers_get__WEBPACK_IMPORTED_MODULE_42___default()(_babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_32___default()(SVGElement.prototype), "setContext", this).call(this, ctx); // create new view port


      if (!this.getAttribute('x').hasValue()) {
        this.getAttribute('x', true).setValue(0);
      }

      if (!this.getAttribute('y').hasValue()) {
        this.getAttribute('y', true).setValue(0);
      }

      ctx.translate(this.getAttribute('x').getPixels('x'), this.getAttribute('y').getPixels('y'));
      var _screen$viewPort = screen.viewPort,
          width = _screen$viewPort.width,
          height = _screen$viewPort.height;

      if (!this.getAttribute('width').hasValue()) {
        this.getAttribute('width', true).setValue('100%');
      }

      if (!this.getAttribute('height').hasValue()) {
        this.getAttribute('height', true).setValue('100%');
      }

      var refXAttr = this.getAttribute('refX');
      var refYAttr = this.getAttribute('refY');
      var viewBoxAttr = this.getAttribute('viewBox');
      var viewBox = viewBoxAttr.hasValue() ? toNumbers(viewBoxAttr.getString()) : null;
      var clip = !this.root && this.getAttribute('overflow').getValue('hidden') !== 'visible';
      var minX = 0;
      var minY = 0;
      var clipX = 0;
      var clipY = 0;

      if (viewBox) {
        minX = viewBox[0];
        minY = viewBox[1];
      }

      if (!this.root) {
        width = this.getAttribute('width').getPixels('x');
        height = this.getAttribute('height').getPixels('y');

        if (this.type === 'marker') {
          clipX = minX;
          clipY = minY;
          minX = 0;
          minY = 0;
        }
      }

      screen.viewPort.setCurrent(width, height);

      if (viewBox) {
        width = viewBox[2];
        height = viewBox[3];
      }

      document.setViewBox({
        ctx: ctx,
        aspectRatio: this.getAttribute('preserveAspectRatio').getString(),
        width: screen.viewPort.width,
        desiredWidth: width,
        height: screen.viewPort.height,
        desiredHeight: height,
        minX: minX,
        minY: minY,
        refX: refXAttr.getValue(),
        refY: refYAttr.getValue(),
        clip: clip,
        clipX: clipX,
        clipY: clipY
      });

      if (viewBox) {
        screen.viewPort.removeCurrent();
        screen.viewPort.setCurrent(width, height);
      }
    }
    /**
     * Resize SVG to fit in given size.
     * @param width
     * @param height
     * @param preserveAspectRatio
     */

  }, {
    key: "resize",
    value: function resize(width) {
      var height = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : width;
      var preserveAspectRatio = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
      var widthAttr = this.getAttribute('width', true);
      var heightAttr = this.getAttribute('height', true);
      var viewBoxAttr = this.getAttribute('viewBox');
      var styleAttr = this.getAttribute('style');
      var originWidth = widthAttr.getNumber(0);
      var originHeight = heightAttr.getNumber(0);

      if (preserveAspectRatio) {
        if (typeof preserveAspectRatio === 'string') {
          this.getAttribute('preserveAspectRatio', true).setValue(preserveAspectRatio);
        } else {
          var preserveAspectRatioAttr = this.getAttribute('preserveAspectRatio');

          if (preserveAspectRatioAttr.hasValue()) {
            preserveAspectRatioAttr.setValue(preserveAspectRatioAttr.getString().replace(/^\s*(\S.*\S)\s*$/, '$1'));
          }
        }
      }

      widthAttr.setValue(width);
      heightAttr.setValue(height);

      if (!viewBoxAttr.hasValue()) {
        viewBoxAttr.setValue("0 0 ".concat(originWidth || width, " ").concat(originHeight || height));
      }

      if (styleAttr.hasValue()) {
        var widthStyle = this.getStyle('width');
        var heightStyle = this.getStyle('height');

        if (widthStyle.hasValue()) {
          widthStyle.setValue("".concat(width, "px"));
        }

        if (heightStyle.hasValue()) {
          heightStyle.setValue("".concat(height, "px"));
        }
      }
    }
  }]);

  return SVGElement;
}(RenderedElement);

var RectElement =
/*#__PURE__*/
function (_PathElement) {
  _babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_33___default()(RectElement, _PathElement);

  function RectElement() {
    var _this;

    _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_19___default()(this, RectElement);

    _this = _babel_runtime_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_31___default()(this, _babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_32___default()(RectElement).apply(this, arguments));
    _this.type = 'rect';
    return _this;
  }

  _babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_20___default()(RectElement, [{
    key: "path",
    value: function path(ctx) {
      var x = this.getAttribute('x').getPixels('x');
      var y = this.getAttribute('y').getPixels('y');
      var width = this.getAttribute('width').getPixels('x');
      var height = this.getAttribute('height').getPixels('y');
      var rxAttr = this.getAttribute('rx');
      var ryAttr = this.getAttribute('ry');
      var rx = rxAttr.getPixels('x');
      var ry = ryAttr.getPixels('y');

      if (rxAttr.hasValue() && !ryAttr.hasValue()) {
        ry = rx;
      }

      if (ryAttr.hasValue() && !rxAttr.hasValue()) {
        rx = ry;
      }

      rx = Math.min(rx, width / 2.0);
      ry = Math.min(ry, height / 2.0);

      if (ctx) {
        var KAPPA = 4 * ((Math.sqrt(2) - 1) / 3);
        ctx.beginPath(); // always start the path so we don't fill prior paths

        if (height > 0 && width > 0) {
          ctx.moveTo(x + rx, y);
          ctx.lineTo(x + width - rx, y);
          ctx.bezierCurveTo(x + width - rx + KAPPA * rx, y, x + width, y + ry - KAPPA * ry, x + width, y + ry);
          ctx.lineTo(x + width, y + height - ry);
          ctx.bezierCurveTo(x + width, y + height - ry + KAPPA * ry, x + width - rx + KAPPA * rx, y + height, x + width - rx, y + height);
          ctx.lineTo(x + rx, y + height);
          ctx.bezierCurveTo(x + rx - KAPPA * rx, y + height, x, y + height - ry + KAPPA * ry, x, y + height - ry);
          ctx.lineTo(x, y + ry);
          ctx.bezierCurveTo(x, y + ry - KAPPA * ry, x + rx - KAPPA * rx, y, x + rx, y);
          ctx.closePath();
        }
      }

      return new BoundingBox(x, y, x + width, y + height);
    }
  }, {
    key: "getMarkers",
    value: function getMarkers() {
      return null;
    }
  }]);

  return RectElement;
}(PathElement);

var CircleElement =
/*#__PURE__*/
function (_PathElement) {
  _babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_33___default()(CircleElement, _PathElement);

  function CircleElement() {
    var _this;

    _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_19___default()(this, CircleElement);

    _this = _babel_runtime_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_31___default()(this, _babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_32___default()(CircleElement).apply(this, arguments));
    _this.type = 'circle';
    return _this;
  }

  _babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_20___default()(CircleElement, [{
    key: "path",
    value: function path(ctx) {
      var cx = this.getAttribute('cx').getPixels('x');
      var cy = this.getAttribute('cy').getPixels('y');
      var r = this.getAttribute('r').getPixels();

      if (ctx && r > 0) {
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2, false);
        ctx.closePath();
      }

      return new BoundingBox(cx - r, cy - r, cx + r, cy + r);
    }
  }, {
    key: "getMarkers",
    value: function getMarkers() {
      return null;
    }
  }]);

  return CircleElement;
}(PathElement);

var EllipseElement =
/*#__PURE__*/
function (_PathElement) {
  _babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_33___default()(EllipseElement, _PathElement);

  function EllipseElement() {
    var _this;

    _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_19___default()(this, EllipseElement);

    _this = _babel_runtime_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_31___default()(this, _babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_32___default()(EllipseElement).apply(this, arguments));
    _this.type = 'ellipse';
    return _this;
  }

  _babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_20___default()(EllipseElement, [{
    key: "path",
    value: function path(ctx) {
      var KAPPA = 4 * ((Math.sqrt(2) - 1) / 3);
      var rx = this.getAttribute('rx').getPixels('x');
      var ry = this.getAttribute('ry').getPixels('y');
      var cx = this.getAttribute('cx').getPixels('x');
      var cy = this.getAttribute('cy').getPixels('y');

      if (ctx) {
        ctx.beginPath();
        ctx.moveTo(cx + rx, cy);
        ctx.bezierCurveTo(cx + rx, cy + KAPPA * ry, cx + KAPPA * rx, cy + ry, cx, cy + ry);
        ctx.bezierCurveTo(cx - KAPPA * rx, cy + ry, cx - rx, cy + KAPPA * ry, cx - rx, cy);
        ctx.bezierCurveTo(cx - rx, cy - KAPPA * ry, cx - KAPPA * rx, cy - ry, cx, cy - ry);
        ctx.bezierCurveTo(cx + KAPPA * rx, cy - ry, cx + rx, cy - KAPPA * ry, cx + rx, cy);
        ctx.closePath();
      }

      return new BoundingBox(cx - rx, cy - ry, cx + rx, cy + ry);
    }
  }, {
    key: "getMarkers",
    value: function getMarkers() {
      return null;
    }
  }]);

  return EllipseElement;
}(PathElement);

var LineElement =
/*#__PURE__*/
function (_PathElement) {
  _babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_33___default()(LineElement, _PathElement);

  function LineElement() {
    var _this;

    _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_19___default()(this, LineElement);

    _this = _babel_runtime_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_31___default()(this, _babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_32___default()(LineElement).apply(this, arguments));
    _this.type = 'line';
    return _this;
  }

  _babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_20___default()(LineElement, [{
    key: "getPoints",
    value: function getPoints() {
      return [new Point(this.getAttribute('x1').getPixels('x'), this.getAttribute('y1').getPixels('y')), new Point(this.getAttribute('x2').getPixels('x'), this.getAttribute('y2').getPixels('y'))];
    }
  }, {
    key: "path",
    value: function path(ctx) {
      var _this$getPoints = this.getPoints(),
          _this$getPoints2 = _babel_runtime_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_6___default()(_this$getPoints, 2),
          _this$getPoints2$ = _this$getPoints2[0],
          x0 = _this$getPoints2$.x,
          y0 = _this$getPoints2$.y,
          _this$getPoints2$2 = _this$getPoints2[1],
          x1 = _this$getPoints2$2.x,
          y1 = _this$getPoints2$2.y;

      if (ctx) {
        ctx.beginPath();
        ctx.moveTo(x0, y0);
        ctx.lineTo(x1, y1);
      }

      return new BoundingBox(x0, y0, x1, y1);
    }
  }, {
    key: "getMarkers",
    value: function getMarkers() {
      var _this$getPoints3 = this.getPoints(),
          _this$getPoints4 = _babel_runtime_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_6___default()(_this$getPoints3, 2),
          p0 = _this$getPoints4[0],
          p1 = _this$getPoints4[1];

      var a = p0.angleTo(p1);
      return [[p0, a], [p1, a]];
    }
  }]);

  return LineElement;
}(PathElement);

var PolylineElement =
/*#__PURE__*/
function (_PathElement) {
  _babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_33___default()(PolylineElement, _PathElement);

  function PolylineElement(document, node, captureTextNodes) {
    var _this;

    _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_19___default()(this, PolylineElement);

    _this = _babel_runtime_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_31___default()(this, _babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_32___default()(PolylineElement).call(this, document, node, captureTextNodes));
    _this.type = 'polyline';
    _this.points = [];
    _this.points = Point.parsePath(_this.getAttribute('points').getString());
    return _this;
  }

  _babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_20___default()(PolylineElement, [{
    key: "path",
    value: function path(ctx) {
      var points = this.points;

      var _points = _babel_runtime_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_6___default()(points, 1),
          _points$ = _points[0],
          x0 = _points$.x,
          y0 = _points$.y;

      var boundingBox = new BoundingBox(x0, y0);

      if (ctx) {
        ctx.beginPath();
        ctx.moveTo(x0, y0);
      }

      points.forEach(function (_ref) {
        var x = _ref.x,
            y = _ref.y;
        boundingBox.addPoint(x, y);

        if (ctx) {
          ctx.lineTo(x, y);
        }
      });
      return boundingBox;
    }
  }, {
    key: "getMarkers",
    value: function getMarkers() {
      var points = this.points;
      var lastIndex = points.length - 1;
      var markers = [];
      points.forEach(function (point, i) {
        if (i === lastIndex) {
          return;
        }

        markers.push([point, point.angleTo(points[i + 1])]);
      });

      if (markers.length > 0) {
        markers.push([points[points.length - 1], markers[markers.length - 1][1]]);
      }

      return markers;
    }
  }]);

  return PolylineElement;
}(PathElement);

var PolygonElement =
/*#__PURE__*/
function (_PolylineElement) {
  _babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_33___default()(PolygonElement, _PolylineElement);

  function PolygonElement() {
    var _this;

    _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_19___default()(this, PolygonElement);

    _this = _babel_runtime_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_31___default()(this, _babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_32___default()(PolygonElement).apply(this, arguments));
    _this.type = 'polygon';
    return _this;
  }

  _babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_20___default()(PolygonElement, [{
    key: "path",
    value: function path(ctx) {
      var boundingBox = _babel_runtime_helpers_get__WEBPACK_IMPORTED_MODULE_42___default()(_babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_32___default()(PolygonElement.prototype), "path", this).call(this, ctx);

      var _this$points = _babel_runtime_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_6___default()(this.points, 1),
          _this$points$ = _this$points[0],
          x = _this$points$.x,
          y = _this$points$.y;

      if (ctx) {
        ctx.lineTo(x, y);
        ctx.closePath();
      }

      return boundingBox;
    }
  }]);

  return PolygonElement;
}(PolylineElement);

var PatternElement =
/*#__PURE__*/
function (_Element) {
  _babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_33___default()(PatternElement, _Element);

  function PatternElement() {
    var _this;

    _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_19___default()(this, PatternElement);

    _this = _babel_runtime_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_31___default()(this, _babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_32___default()(PatternElement).apply(this, arguments));
    _this.type = 'pattern';
    return _this;
  }

  _babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_20___default()(PatternElement, [{
    key: "createPattern",
    value: function createPattern(ctx, _, parentOpacityProp) {
      var width = this.getAttribute('width').getPixels('x', true);
      var height = this.getAttribute('height').getPixels('y', true); // render me using a temporary svg element

      var patternSvg = new SVGElement(this.document, null);
      patternSvg.attributes.viewBox = new Property(this.document, 'viewBox', this.getAttribute('viewBox').getValue());
      patternSvg.attributes.width = new Property(this.document, 'width', "".concat(width, "px"));
      patternSvg.attributes.height = new Property(this.document, 'height', "".concat(height, "px"));
      patternSvg.attributes.transform = new Property(this.document, 'transform', this.getAttribute('patternTransform').getValue());
      patternSvg.children = this.children;
      var patternCanvas = this.document.createCanvas(width, height);
      var patternCtx = patternCanvas.getContext('2d');
      var xAttr = this.getAttribute('x');
      var yAttr = this.getAttribute('y');

      if (xAttr.hasValue() && yAttr.hasValue()) {
        patternCtx.translate(xAttr.getPixels('x', true), yAttr.getPixels('y', true));
      }

      if (parentOpacityProp.hasValue()) {
        this.styles['fill-opacity'] = parentOpacityProp;
      } else {
        Reflect.deleteProperty(this.styles, 'fill-opacity');
      } // render 3x3 grid so when we transform there's no white space on edges


      for (var x = -1; x <= 1; x++) {
        for (var y = -1; y <= 1; y++) {
          patternCtx.save();
          patternSvg.attributes.x = new Property(this.document, 'x', x * patternCanvas.width);
          patternSvg.attributes.y = new Property(this.document, 'y', y * patternCanvas.height);
          patternSvg.render(patternCtx);
          patternCtx.restore();
        }
      }

      var pattern = ctx.createPattern(patternCanvas, 'repeat');
      return pattern;
    }
  }]);

  return PatternElement;
}(Element);

var MarkerElement =
/*#__PURE__*/
function (_Element) {
  _babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_33___default()(MarkerElement, _Element);

  function MarkerElement() {
    var _this;

    _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_19___default()(this, MarkerElement);

    _this = _babel_runtime_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_31___default()(this, _babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_32___default()(MarkerElement).apply(this, arguments));
    _this.type = 'marker';
    return _this;
  }

  _babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_20___default()(MarkerElement, [{
    key: "render",
    value: function render(ctx, point, angle) {
      if (!point) {
        return;
      }

      var x = point.x,
          y = point.y;
      var orient = this.getAttribute('orient').getValue('auto');
      var markerUnits = this.getAttribute('markerUnits').getValue('strokeWidth');
      ctx.translate(x, y);

      if (orient === 'auto') {
        ctx.rotate(angle);
      }

      if (markerUnits === 'strokeWidth') {
        ctx.scale(ctx.lineWidth, ctx.lineWidth);
      }

      ctx.save(); // render me using a temporary svg element

      var markerSvg = new SVGElement(this.document, null);
      markerSvg.type = this.type;
      markerSvg.attributes.viewBox = new Property(this.document, 'viewBox', this.getAttribute('viewBox').getValue());
      markerSvg.attributes.refX = new Property(this.document, 'refX', this.getAttribute('refX').getValue());
      markerSvg.attributes.refY = new Property(this.document, 'refY', this.getAttribute('refY').getValue());
      markerSvg.attributes.width = new Property(this.document, 'width', this.getAttribute('markerWidth').getValue());
      markerSvg.attributes.height = new Property(this.document, 'height', this.getAttribute('markerHeight').getValue());
      markerSvg.attributes.overflow = new Property(this.document, 'overflow', this.getAttribute('overflow').getValue());
      markerSvg.attributes.fill = new Property(this.document, 'fill', this.getAttribute('fill').getValue('black'));
      markerSvg.attributes.stroke = new Property(this.document, 'stroke', this.getAttribute('stroke').getValue('none'));
      markerSvg.children = this.children;
      markerSvg.render(ctx);
      ctx.restore();

      if (markerUnits === 'strokeWidth') {
        ctx.scale(1 / ctx.lineWidth, 1 / ctx.lineWidth);
      }

      if (orient === 'auto') {
        ctx.rotate(-angle);
      }

      ctx.translate(-x, -y);
    }
  }]);

  return MarkerElement;
}(Element);

var DefsElement =
/*#__PURE__*/
function (_Element) {
  _babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_33___default()(DefsElement, _Element);

  function DefsElement() {
    var _this;

    _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_19___default()(this, DefsElement);

    _this = _babel_runtime_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_31___default()(this, _babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_32___default()(DefsElement).apply(this, arguments));
    _this.type = 'defs';
    return _this;
  }

  _babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_20___default()(DefsElement, [{
    key: "render",
    value: function render() {// NOOP
    }
  }]);

  return DefsElement;
}(Element);

var GElement =
/*#__PURE__*/
function (_RenderedElement) {
  _babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_33___default()(GElement, _RenderedElement);

  function GElement() {
    var _this;

    _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_19___default()(this, GElement);

    _this = _babel_runtime_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_31___default()(this, _babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_32___default()(GElement).apply(this, arguments));
    _this.type = 'g';
    return _this;
  }

  _babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_20___default()(GElement, [{
    key: "getBoundingBox",
    value: function getBoundingBox(ctx) {
      var boundingBox = new BoundingBox();
      this.children.forEach(function (child) {
        boundingBox.addBoundingBox(child.getBoundingBox(ctx));
      });
      return boundingBox;
    }
  }]);

  return GElement;
}(RenderedElement);

var GradientElement =
/*#__PURE__*/
function (_Element) {
  _babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_33___default()(GradientElement, _Element);

  function GradientElement(document, node, captureTextNodes) {
    var _this;

    _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_19___default()(this, GradientElement);

    _this = _babel_runtime_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_31___default()(this, _babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_32___default()(GradientElement).call(this, document, node, captureTextNodes));
    _this.attributesToInherit = ['gradientUnits'];
    _this.stops = [];

    var _assertThisInitialize = _babel_runtime_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_47___default()(_this),
        stops = _assertThisInitialize.stops,
        children = _assertThisInitialize.children;

    children.forEach(function (child) {
      if (child.type === 'stop') {
        stops.push(child);
      }
    });
    return _this;
  }

  _babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_20___default()(GradientElement, [{
    key: "getGradientUnits",
    value: function getGradientUnits() {
      return this.getAttribute('gradientUnits').getString('objectBoundingBox');
    }
  }, {
    key: "createGradient",
    value: function createGradient(ctx, element, parentOpacityProp) {
      var _this2 = this;

      // tslint:disable-next-line: no-this-assignment
      var stopsContainer = this;

      if (this.getHrefAttribute().hasValue()) {
        stopsContainer = this.getHrefAttribute().getDefinition();
        this.inheritStopContainer(stopsContainer);
      }

      var _stopsContainer = stopsContainer,
          stops = _stopsContainer.stops;
      var gradient = this.getGradient(ctx, element);

      if (!gradient) {
        return this.addParentOpacity(parentOpacityProp, stops[stops.length - 1].color);
      }

      stops.forEach(function (stop) {
        gradient.addColorStop(stop.offset, _this2.addParentOpacity(parentOpacityProp, stop.color));
      });

      if (this.getAttribute('gradientTransform').hasValue()) {
        // render as transformed pattern on temporary canvas
        var document = this.document;
        var _document$screen = document.screen,
            MAX_VIRTUAL_PIXELS = _document$screen.MAX_VIRTUAL_PIXELS,
            viewPort = _document$screen.viewPort;

        var _viewPort$viewPorts = _babel_runtime_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_6___default()(viewPort.viewPorts, 1),
            rootView = _viewPort$viewPorts[0];

        var rect = new RectElement(document, null);
        rect.attributes.x = new Property(document, 'x', -MAX_VIRTUAL_PIXELS / 3.0);
        rect.attributes.y = new Property(document, 'y', -MAX_VIRTUAL_PIXELS / 3.0);
        rect.attributes.width = new Property(document, 'width', MAX_VIRTUAL_PIXELS);
        rect.attributes.height = new Property(document, 'height', MAX_VIRTUAL_PIXELS);
        var group = new GElement(document, null);
        group.attributes.transform = new Property(document, 'transform', this.getAttribute('gradientTransform').getValue());
        group.children = [rect];
        var patternSvg = new SVGElement(document, null);
        patternSvg.attributes.x = new Property(document, 'x', 0);
        patternSvg.attributes.y = new Property(document, 'y', 0);
        patternSvg.attributes.width = new Property(document, 'width', rootView.width);
        patternSvg.attributes.height = new Property(document, 'height', rootView.height);
        patternSvg.children = [group];
        var patternCanvas = document.createCanvas(rootView.width, rootView.height);
        var patternCtx = patternCanvas.getContext('2d');
        patternCtx.fillStyle = gradient;
        patternSvg.render(patternCtx);
        return patternCtx.createPattern(patternCanvas, 'no-repeat');
      }

      return gradient;
    }
  }, {
    key: "inheritStopContainer",
    value: function inheritStopContainer(stopsContainer) {
      var _this3 = this;

      this.attributesToInherit.forEach(function (attributeToInherit) {
        if (!_this3.getAttribute(attributeToInherit).hasValue() && stopsContainer.getAttribute(attributeToInherit).hasValue()) {
          _this3.getAttribute(attributeToInherit, true).setValue(stopsContainer.getAttribute(attributeToInherit).getValue());
        }
      });
    }
  }, {
    key: "addParentOpacity",
    value: function addParentOpacity(parentOpacityProp, color) {
      if (parentOpacityProp.hasValue()) {
        var colorProp = new Property(this.document, 'color', color);
        return colorProp.addOpacity(parentOpacityProp).getString();
      }

      return color;
    }
  }]);

  return GradientElement;
}(Element);

var LinearGradientElement =
/*#__PURE__*/
function (_GradientElement) {
  _babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_33___default()(LinearGradientElement, _GradientElement);

  function LinearGradientElement(document, node, captureTextNodes) {
    var _this;

    _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_19___default()(this, LinearGradientElement);

    _this = _babel_runtime_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_31___default()(this, _babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_32___default()(LinearGradientElement).call(this, document, node, captureTextNodes));
    _this.type = 'linearGradient';

    _this.attributesToInherit.push('x1', 'y1', 'x2', 'y2');

    return _this;
  }

  _babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_20___default()(LinearGradientElement, [{
    key: "getGradient",
    value: function getGradient(ctx, element) {
      var boundingBox = this.getGradientUnits() === 'objectBoundingBox' ? element.getBoundingBox(ctx) : null;

      if (!this.getAttribute('x1').hasValue() && !this.getAttribute('y1').hasValue() && !this.getAttribute('x2').hasValue() && !this.getAttribute('y2').hasValue()) {
        this.getAttribute('x1', true).setValue(0);
        this.getAttribute('y1', true).setValue(0);
        this.getAttribute('x2', true).setValue(1);
        this.getAttribute('y2', true).setValue(0);
      }

      var x1 = this.getGradientUnits() === 'objectBoundingBox' ? boundingBox.x + boundingBox.width * this.getAttribute('x1').getNumber() : this.getAttribute('x1').getPixels('x');
      var y1 = this.getGradientUnits() === 'objectBoundingBox' ? boundingBox.y + boundingBox.height * this.getAttribute('y1').getNumber() : this.getAttribute('y1').getPixels('y');
      var x2 = this.getGradientUnits() === 'objectBoundingBox' ? boundingBox.x + boundingBox.width * this.getAttribute('x2').getNumber() : this.getAttribute('x2').getPixels('x');
      var y2 = this.getGradientUnits() === 'objectBoundingBox' ? boundingBox.y + boundingBox.height * this.getAttribute('y2').getNumber() : this.getAttribute('y2').getPixels('y');

      if (x1 === x2 && y1 === y2) {
        return null;
      }

      return ctx.createLinearGradient(x1, y1, x2, y2);
    }
  }]);

  return LinearGradientElement;
}(GradientElement);

var RadialGradientElement =
/*#__PURE__*/
function (_GradientElement) {
  _babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_33___default()(RadialGradientElement, _GradientElement);

  function RadialGradientElement(document, node, captureTextNodes) {
    var _this;

    _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_19___default()(this, RadialGradientElement);

    _this = _babel_runtime_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_31___default()(this, _babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_32___default()(RadialGradientElement).call(this, document, node, captureTextNodes));
    _this.type = 'radialGradient';

    _this.attributesToInherit.push('cx', 'cy', 'r', 'fx', 'fy', 'fr');

    return _this;
  }

  _babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_20___default()(RadialGradientElement, [{
    key: "getGradient",
    value: function getGradient(ctx, element) {
      var boundingBox = element.getBoundingBox(ctx);

      if (!this.getAttribute('cx').hasValue()) {
        this.getAttribute('cx', true).setValue('50%');
      }

      if (!this.getAttribute('cy').hasValue()) {
        this.getAttribute('cy', true).setValue('50%');
      }

      if (!this.getAttribute('r').hasValue()) {
        this.getAttribute('r', true).setValue('50%');
      }

      var cx = this.getGradientUnits() === 'objectBoundingBox' ? boundingBox.x + boundingBox.width * this.getAttribute('cx').getNumber() : this.getAttribute('cx').getPixels('x');
      var cy = this.getGradientUnits() === 'objectBoundingBox' ? boundingBox.y + boundingBox.height * this.getAttribute('cy').getNumber() : this.getAttribute('cy').getPixels('y');
      var fx = cx;
      var fy = cy;

      if (this.getAttribute('fx').hasValue()) {
        fx = this.getGradientUnits() === 'objectBoundingBox' ? boundingBox.x + boundingBox.width * this.getAttribute('fx').getNumber() : this.getAttribute('fx').getPixels('x');
      }

      if (this.getAttribute('fy').hasValue()) {
        fy = this.getGradientUnits() === 'objectBoundingBox' ? boundingBox.y + boundingBox.height * this.getAttribute('fy').getNumber() : this.getAttribute('fy').getPixels('y');
      }

      var r = this.getGradientUnits() === 'objectBoundingBox' ? (boundingBox.width + boundingBox.height) / 2.0 * this.getAttribute('r').getNumber() : this.getAttribute('r').getPixels();
      var fr = this.getAttribute('fr').getPixels();
      return ctx.createRadialGradient(fx, fy, fr, cx, cy, r);
    }
  }]);

  return RadialGradientElement;
}(GradientElement);

var StopElement =
/*#__PURE__*/
function (_Element) {
  _babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_33___default()(StopElement, _Element);

  function StopElement(document, node, captureTextNodes) {
    var _this;

    _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_19___default()(this, StopElement);

    _this = _babel_runtime_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_31___default()(this, _babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_32___default()(StopElement).call(this, document, node, captureTextNodes));
    _this.type = 'stop';
    var offset = Math.max(0, Math.min(1, _this.getAttribute('offset').getNumber()));

    var stopOpacity = _this.getStyle('stop-opacity');

    var stopColor = _this.getStyle('stop-color', true);

    if (stopColor.getString() === '') {
      stopColor.setValue('#000');
    }

    if (stopOpacity.hasValue()) {
      stopColor = stopColor.addOpacity(stopOpacity);
    }

    _this.offset = offset;
    _this.color = stopColor.getString();
    return _this;
  }

  return StopElement;
}(Element);

var AnimateElement =
/*#__PURE__*/
function (_Element) {
  _babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_33___default()(AnimateElement, _Element);

  function AnimateElement(document, node, captureTextNodes) {
    var _this;

    _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_19___default()(this, AnimateElement);

    _this = _babel_runtime_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_31___default()(this, _babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_32___default()(AnimateElement).call(this, document, node, captureTextNodes));
    _this.type = 'animate';
    _this.duration = 0;
    _this.initialValue = null;
    _this.initialUnits = '';
    _this.removed = false;
    _this.frozen = false;
    document.screen.animations.push(_babel_runtime_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_47___default()(_this));
    _this.begin = _this.getAttribute('begin').getMilliseconds();
    _this.maxDuration = _this.begin + _this.getAttribute('dur').getMilliseconds();
    _this.from = _this.getAttribute('from');
    _this.to = _this.getAttribute('to');
    _this.values = _this.getAttribute('values');

    if (_this.values.hasValue()) {
      _this.values.setValue(_this.values.getString().split(';'));
    }

    return _this;
  }

  _babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_20___default()(AnimateElement, [{
    key: "getProperty",
    value: function getProperty() {
      var attributeType = this.getAttribute('attributeType').getString();
      var attributeName = this.getAttribute('attributeName').getString();

      if (attributeType === 'CSS') {
        return this.parent.getStyle(attributeName, true);
      }

      return this.parent.getAttribute(attributeName, true);
    }
  }, {
    key: "calcValue",
    value: function calcValue() {
      var initialUnits = this.initialUnits;

      var _this$getProgress = this.getProgress(),
          progress = _this$getProgress.progress,
          from = _this$getProgress.from,
          to = _this$getProgress.to; // tween value linearly


      var newValue = from.getNumber() + (to.getNumber() - from.getNumber()) * progress;

      if (initialUnits === '%') {
        newValue *= 100.0; // numValue() returns 0-1 whereas properties are 0-100
      }

      return "".concat(newValue).concat(initialUnits);
    }
  }, {
    key: "update",
    value: function update(delta) {
      var parent = this.parent;
      var prop = this.getProperty(); // set initial value

      if (!this.initialValue) {
        this.initialValue = prop.getString();
        this.initialUnits = prop.getUnits();
      } // if we're past the end time


      if (this.duration > this.maxDuration) {
        var fill = this.getAttribute('fill').getString('remove'); // loop for indefinitely repeating animations

        if (this.getAttribute('repeatCount').getString() === 'indefinite' || this.getAttribute('repeatDur').getString() === 'indefinite') {
          this.duration = 0;
        } else if (fill === 'freeze' && !this.frozen) {
          this.frozen = true;
          parent.animationFrozen = true;
          parent.animationFrozenValue = prop.getString();
        } else if (fill === 'remove' && !this.removed) {
          this.removed = true;
          prop.setValue(parent.animationFrozen ? parent.animationFrozenValue : this.initialValue);
          return true;
        }

        return false;
      }

      this.duration += delta; // if we're past the begin time

      var updated = false;

      if (this.begin < this.duration) {
        var newValue = this.calcValue(); // tween

        var typeAttr = this.getAttribute('type');

        if (typeAttr.hasValue()) {
          // for transform, etc.
          var type = typeAttr.getString();
          newValue = "".concat(type, "(").concat(newValue, ")");
        }

        prop.setValue(newValue);
        updated = true;
      }

      return updated;
    }
  }, {
    key: "getProgress",
    value: function getProgress() {
      var document = this.document,
          values = this.values;
      var result = {
        progress: (this.duration - this.begin) / (this.maxDuration - this.begin)
      };

      if (values.hasValue()) {
        var p = result.progress * (values.getValue().length - 1);
        var lb = Math.floor(p);
        var ub = Math.ceil(p);
        result.from = new Property(document, 'from', parseFloat(values.getValue()[lb]));
        result.to = new Property(document, 'to', parseFloat(values.getValue()[ub]));
        result.progress = (p - lb) / (ub - lb);
      } else {
        result.from = this.from;
        result.to = this.to;
      }

      return result;
    }
  }]);

  return AnimateElement;
}(Element);

var AnimateColorElement =
/*#__PURE__*/
function (_AnimateElement) {
  _babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_33___default()(AnimateColorElement, _AnimateElement);

  function AnimateColorElement() {
    var _this;

    _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_19___default()(this, AnimateColorElement);

    _this = _babel_runtime_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_31___default()(this, _babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_32___default()(AnimateColorElement).apply(this, arguments));
    _this.type = 'animateColor';
    return _this;
  }

  _babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_20___default()(AnimateColorElement, [{
    key: "calcValue",
    value: function calcValue() {
      var _this$getProgress = this.getProgress(),
          progress = _this$getProgress.progress,
          from = _this$getProgress.from,
          to = _this$getProgress.to;

      var colorFrom = new rgbcolor__WEBPACK_IMPORTED_MODULE_30___default.a(from.getString());
      var colorTo = new rgbcolor__WEBPACK_IMPORTED_MODULE_30___default.a(to.getString());

      if (colorFrom.ok && colorTo.ok) {
        // tween color linearly
        var r = colorFrom.r + (colorTo.r - colorFrom.r) * progress;
        var g = colorFrom.g + (colorTo.g - colorFrom.g) * progress;
        var b = colorFrom.b + (colorTo.b - colorFrom.b) * progress; // ? alpha

        return "rgb(".concat(parseInt(r, 10), ", ").concat(parseInt(g, 10), ", ").concat(parseInt(b, 10), ")");
      }

      return this.getAttribute('from').getString();
    }
  }]);

  return AnimateColorElement;
}(AnimateElement);

var AnimateTransformElement =
/*#__PURE__*/
function (_AnimateElement) {
  _babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_33___default()(AnimateTransformElement, _AnimateElement);

  function AnimateTransformElement() {
    var _this;

    _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_19___default()(this, AnimateTransformElement);

    _this = _babel_runtime_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_31___default()(this, _babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_32___default()(AnimateTransformElement).apply(this, arguments));
    _this.type = 'animateTransform';
    return _this;
  }

  _babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_20___default()(AnimateTransformElement, [{
    key: "calcValue",
    value: function calcValue() {
      var _this$getProgress = this.getProgress(),
          progress = _this$getProgress.progress,
          from = _this$getProgress.from,
          to = _this$getProgress.to; // tween value linearly


      var transformFrom = toNumbers(from.getString());
      var transformTo = toNumbers(to.getString());
      var newValue = transformFrom.map(function (from, i) {
        var to = transformTo[i];
        return from + (to - from) * progress;
      }).join(' ');
      return newValue;
    }
  }]);

  return AnimateTransformElement;
}(AnimateElement);

var FontElement =
/*#__PURE__*/
function (_Element) {
  _babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_33___default()(FontElement, _Element);

  function FontElement(document, node, captureTextNodes) {
    var _this;

    _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_19___default()(this, FontElement);

    _this = _babel_runtime_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_31___default()(this, _babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_32___default()(FontElement).call(this, document, node, captureTextNodes));
    _this.type = 'font';
    _this.glyphs = {};
    _this.horizAdvX = _this.getAttribute('horiz-adv-x').getNumber();
    var definitions = document.definitions;

    var _assertThisInitialize = _babel_runtime_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_47___default()(_this),
        children = _assertThisInitialize.children;

    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = children[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var child = _step.value;

        switch (child.type) {
          case 'font-face':
            {
              _this.fontFace = child;
              var fontFamilyStyle = child.getStyle('font-family');

              if (fontFamilyStyle.hasValue()) {
                definitions[fontFamilyStyle.getString()] = _babel_runtime_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_47___default()(_this);
              }

              break;
            }

          case 'missing-glyph':
            _this.missingGlyph = child;
            break;

          case 'glyph':
            {
              var glyph = child;

              if (glyph.arabicForm) {
                _this.isRTL = true;
                _this.isArabic = true;

                if (typeof _this.glyphs[glyph.unicode] === 'undefined') {
                  _this.glyphs[glyph.unicode] = {};
                }

                _this.glyphs[glyph.unicode][glyph.arabicForm] = glyph;
              } else {
                _this.glyphs[glyph.unicode] = glyph;
              }

              break;
            }

          default:
        }
      }
    } catch (err) {
      _didIteratorError = true;
      _iteratorError = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion && _iterator.return != null) {
          _iterator.return();
        }
      } finally {
        if (_didIteratorError) {
          throw _iteratorError;
        }
      }
    }

    return _this;
  }

  _babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_20___default()(FontElement, [{
    key: "render",
    value: function render() {// NO RENDER
    }
  }]);

  return FontElement;
}(Element);

var FontFaceElement =
/*#__PURE__*/
function (_Element) {
  _babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_33___default()(FontFaceElement, _Element);

  function FontFaceElement(document, node, captureTextNodes) {
    var _this;

    _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_19___default()(this, FontFaceElement);

    _this = _babel_runtime_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_31___default()(this, _babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_32___default()(FontFaceElement).call(this, document, node, captureTextNodes));
    _this.type = 'font-face';
    _this.ascent = _this.getAttribute('ascent').getNumber();
    _this.descent = _this.getAttribute('descent').getNumber();
    _this.unitsPerEm = _this.getAttribute('units-per-em').getNumber();
    return _this;
  }

  return FontFaceElement;
}(Element);

var MissingGlyphElement =
/*#__PURE__*/
function (_PathElement) {
  _babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_33___default()(MissingGlyphElement, _PathElement);

  function MissingGlyphElement() {
    var _this;

    _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_19___default()(this, MissingGlyphElement);

    _this = _babel_runtime_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_31___default()(this, _babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_32___default()(MissingGlyphElement).apply(this, arguments));
    _this.type = 'missing-glyph';
    _this.horizAdvX = 0;
    return _this;
  }

  return MissingGlyphElement;
}(PathElement);

var GlyphElement =
/*#__PURE__*/
function (_PathElement) {
  _babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_33___default()(GlyphElement, _PathElement);

  function GlyphElement(document, node, captureTextNodes) {
    var _this;

    _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_19___default()(this, GlyphElement);

    _this = _babel_runtime_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_31___default()(this, _babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_32___default()(GlyphElement).call(this, document, node, captureTextNodes));
    _this.type = 'glyph';
    _this.horizAdvX = _this.getAttribute('horiz-adv-x').getNumber();
    _this.unicode = _this.getAttribute('unicode').getString();
    _this.arabicForm = _this.getAttribute('arabic-form').getString();
    return _this;
  }

  return GlyphElement;
}(PathElement);

var TRefElement =
/*#__PURE__*/
function (_TextElement) {
  _babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_33___default()(TRefElement, _TextElement);

  function TRefElement() {
    var _this;

    _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_19___default()(this, TRefElement);

    _this = _babel_runtime_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_31___default()(this, _babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_32___default()(TRefElement).apply(this, arguments));
    _this.type = 'tref';
    return _this;
  }

  _babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_20___default()(TRefElement, [{
    key: "getText",
    value: function getText() {
      var element = this.getHrefAttribute().getDefinition();

      if (element) {
        var firstChild = element.children[0];

        if (firstChild) {
          return firstChild.getText();
        }
      }

      return '';
    }
  }]);

  return TRefElement;
}(TextElement);

var AElement =
/*#__PURE__*/
function (_TextElement) {
  _babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_33___default()(AElement, _TextElement);

  function AElement(document, node, captureTextNodes) {
    var _this;

    _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_19___default()(this, AElement);

    _this = _babel_runtime_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_31___default()(this, _babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_32___default()(AElement).call(this, document, node, captureTextNodes));
    _this.type = 'a';
    var childNodes = node.childNodes;
    var firstChild = childNodes[0];
    var hasText = childNodes.length > 0 && Array.from(childNodes).every(function (node) {
      return node.nodeType === 3;
    });
    _this.hasText = hasText;
    _this.text = hasText ? _this.getTextFromNode(firstChild) : '';
    return _this;
  }

  _babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_20___default()(AElement, [{
    key: "getText",
    value: function getText() {
      return this.text;
    }
  }, {
    key: "renderChildren",
    value: function renderChildren(ctx) {
      if (this.hasText) {
        // render as text element
        _babel_runtime_helpers_get__WEBPACK_IMPORTED_MODULE_42___default()(_babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_32___default()(AElement.prototype), "renderChildren", this).call(this, ctx);

        var document = this.document,
            x = this.x,
            y = this.y;
        var mouse = document.screen.mouse;
        var fontSize = new Property(document, 'fontSize', Font.parse(document.ctx.font).fontSize); // Do not calc bounding box if mouse is not working.

        if (mouse.isWorking()) {
          mouse.checkBoundingBox(this, new BoundingBox(x, y - fontSize.getPixels('y'), x + this.measureText(ctx), y));
        }
      } else if (this.children.length > 0) {
        // render as temporary group
        var g = new GElement(this.document, null);
        g.children = this.children;
        g.parent = this;
        g.render(ctx);
      }
    }
  }, {
    key: "onClick",
    value: function onClick() {
      var window = this.document.window;

      if (window) {
        window.open(this.getHrefAttribute().getString());
      }
    }
  }, {
    key: "onMouseMove",
    value: function onMouseMove() {
      var ctx = this.document.ctx;
      ctx.canvas.style.cursor = 'pointer';
    }
  }]);

  return AElement;
}(TextElement);

var TextPathElement =
/*#__PURE__*/
function (_TextElement) {
  _babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_33___default()(TextPathElement, _TextElement);

  function TextPathElement(document, node, captureTextNodes) {
    var _this;

    _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_19___default()(this, TextPathElement);

    _this = _babel_runtime_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_31___default()(this, _babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_32___default()(TextPathElement).call(this, document, node, captureTextNodes));
    _this.type = 'textPath';
    _this.textWidth = 0;
    _this.textHeight = 0;
    _this.pathLength = -1;
    _this.glyphInfo = null;
    _this.letterSpacingCache = [];
    _this.measuresCache = new Map([['', 0]]);

    var pathElement = _this.getHrefAttribute().getDefinition();

    _this.text = _this.getTextFromNode();
    _this.dataArray = _this.parsePathData(pathElement);
    return _this;
  }

  _babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_20___default()(TextPathElement, [{
    key: "getText",
    value: function getText() {
      return this.text;
    }
  }, {
    key: "path",
    value: function path(ctx) {
      var dataArray = this.dataArray;

      if (ctx) {
        ctx.beginPath();
      }

      dataArray.forEach(function (_ref) {
        var command = _ref.command,
            points = _ref.points;

        switch (command) {
          case 'L':
            if (ctx) {
              ctx.lineTo(points[0], points[1]);
            }

            break;

          case 'M':
            if (ctx) {
              ctx.moveTo(points[0], points[1]);
            }

            break;

          case 'C':
            if (ctx) {
              ctx.bezierCurveTo(points[0], points[1], points[2], points[3], points[4], points[5]);
            }

            break;

          case 'Q':
            if (ctx) {
              ctx.quadraticCurveTo(points[0], points[1], points[2], points[3]);
            }

            break;

          case 'A':
            {
              var cx = points[0];
              var cy = points[1];
              var rx = points[2];
              var ry = points[3];
              var theta = points[4];
              var dTheta = points[5];
              var psi = points[6];
              var fs = points[7];
              var r = rx > ry ? rx : ry;
              var scaleX = rx > ry ? 1 : rx / ry;
              var scaleY = rx > ry ? ry / rx : 1;

              if (ctx) {
                ctx.translate(cx, cy);
                ctx.rotate(psi);
                ctx.scale(scaleX, scaleY);
                ctx.arc(0, 0, r, theta, theta + dTheta, Boolean(1 - fs));
                ctx.scale(1 / scaleX, 1 / scaleY);
                ctx.rotate(-psi);
                ctx.translate(-cx, -cy);
              }

              break;
            }

          case 'z':
            if (ctx) {
              ctx.closePath();
            }

            break;

          default:
        }
      });
    }
  }, {
    key: "renderChildren",
    value: function renderChildren(ctx) {
      this.setTextData(ctx);
      ctx.save();
      var textDecoration = this.parent.getStyle('text-decoration').getString();
      var fontSize = this.getFontSize();
      var glyphInfo = this.glyphInfo;
      var fill = ctx.fillStyle;

      if (textDecoration === 'underline') {
        ctx.beginPath();
      }

      glyphInfo.forEach(function (glyph, i) {
        var p0 = glyph.p0,
            p1 = glyph.p1,
            partialText = glyph.text;
        ctx.save();
        ctx.translate(p0.x, p0.y);
        ctx.rotate(glyphInfo[i].rotation);

        if (ctx.fillStyle) {
          ctx.fillText(partialText, 0, 0);
        }

        if (ctx.strokeStyle) {
          ctx.strokeText(partialText, 0, 0);
        }

        ctx.restore();

        if (textDecoration === 'underline') {
          if (i === 0) {
            ctx.moveTo(p0.x, p0.y + fontSize / 8);
          }

          ctx.lineTo(p1.x, p1.y + fontSize / 5);
        } //// To assist with debugging visually, uncomment following
        //
        // ctx.beginPath();
        // if (i % 2)
        // 	ctx.strokeStyle = 'red';
        // else
        // 	ctx.strokeStyle = 'green';
        // ctx.moveTo(p0.x, p0.y);
        // ctx.lineTo(p1.x, p1.y);
        // ctx.stroke();
        // ctx.closePath();

      });

      if (textDecoration === 'underline') {
        ctx.lineWidth = fontSize / 20;
        ctx.strokeStyle = fill;
        ctx.stroke();
        ctx.closePath();
      }

      ctx.restore();
    }
  }, {
    key: "getLetterSpacingAt",
    value: function getLetterSpacingAt() {
      var idx = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
      return this.letterSpacingCache[idx] || 0;
    }
  }, {
    key: "findSegmentToFitChar",
    value: function findSegmentToFitChar(ctx, anchor, textFullWidth, fullPathWidth, spacesNumber, inputOffset, c, charI) {
      var offset = inputOffset;
      var glyphWidth = this.measureText(ctx, c);

      if (c === ' ' && anchor === 'justify' && textFullWidth < fullPathWidth) {
        glyphWidth += (fullPathWidth - textFullWidth) / spacesNumber;
      }

      if (charI > -1) {
        offset += this.getLetterSpacingAt(charI);
      }

      var splineStep = this.textHeight / 20;
      var segment = {
        p0: this.getEquidistantPointOnPath(offset, splineStep),
        p1: this.getEquidistantPointOnPath(offset + glyphWidth, splineStep)
      };
      offset += glyphWidth;
      return {
        offset: offset,
        segment: segment
      };
    }
  }, {
    key: "measureText",
    value: function measureText(ctx, text) {
      var measuresCache = this.measuresCache;
      var targetText = text || this.getText();

      if (measuresCache.has(targetText)) {
        return measuresCache.get(targetText);
      }

      var measure = this.measureTargetText(ctx, targetText);
      measuresCache.set(targetText, measure);
      return measure;
    } // This method supposes what all custom fonts already loaded.
    // If some font will be loaded after this method call, <textPath> will not be rendered correctly.
    // You need to call this method manually to update glyphs cache.

  }, {
    key: "setTextData",
    value: function setTextData(ctx) {
      var _this2 = this;

      if (this.glyphInfo) {
        return;
      }

      var renderText = this.getText();
      var chars = renderText.split('');
      var spacesNumber = renderText.split(' ').length - 1;
      var dx = toNumbers(this.parent.getAttribute('dx').getString('0'));
      var anchor = this.parent.getStyle('text-anchor').getString('start');
      var thisSpacing = this.getStyle('letter-spacing');
      var parentSpacing = this.parent.getStyle('letter-spacing');
      var letterSpacing = 0;

      if (!thisSpacing.hasValue() || thisSpacing.getValue() === 'inherit') {
        letterSpacing = parentSpacing.getPixels();
      } else if (thisSpacing.hasValue()) {
        if (thisSpacing.getValue() !== 'initial' && thisSpacing.getValue() !== 'unset') {
          letterSpacing = thisSpacing.getPixels();
        }
      } // fill letter-spacing cache


      var letterSpacingCache = [];
      var textLen = renderText.length;
      this.letterSpacingCache = letterSpacingCache;

      for (var i = 0; i < textLen; i++) {
        letterSpacingCache.push(typeof dx[i] !== 'undefined' ? dx[i] : letterSpacing);
      }

      var dxSum = letterSpacingCache.reduce(function (acc, cur) {
        return acc + cur || 0;
      }, 0);
      this.textWidth = this.measureText(ctx);
      this.textHeight = this.getFontSize();
      var textFullWidth = Math.max(this.textWidth + dxSum, 0);
      this.glyphInfo = [];
      var fullPathWidth = this.getPathLength();
      var startOffset = this.getStyle('startOffset').getNumber(0) * fullPathWidth;
      var offset = 0;

      if (anchor === 'middle' || anchor === 'center') {
        offset = -textFullWidth / 2;
      }

      if (anchor === 'end' || anchor === 'right') {
        offset = -textFullWidth;
      }

      offset += startOffset;
      chars.forEach(function (char, i) {
        // Find such segment what distance between p0 and p1 is approx. width of glyph
        var _this2$findSegmentToF = _this2.findSegmentToFitChar(ctx, anchor, textFullWidth, fullPathWidth, spacesNumber, offset, char, i),
            nextOffset = _this2$findSegmentToF.offset,
            segment = _this2$findSegmentToF.segment;

        offset = nextOffset;

        if (!segment.p0 || !segment.p1) {
          return;
        }

        var width = _this2.getLineLength(segment.p0.x, segment.p0.y, segment.p1.x, segment.p1.y); // Note: Since glyphs are rendered one at a time, any kerning pair data built into the font will not be used.
        // Can foresee having a rough pair table built in that the developer can override as needed.
        // Or use "dx" attribute of the <text> node as a naive replacement


        var kern = 0; // placeholder for future implementation

        var midpoint = _this2.getPointOnLine(kern + width / 2.0, segment.p0.x, segment.p0.y, segment.p1.x, segment.p1.y);

        var rotation = Math.atan2(segment.p1.y - segment.p0.y, segment.p1.x - segment.p0.x);

        _this2.glyphInfo.push({
          transposeX: midpoint.x,
          transposeY: midpoint.y,
          text: chars[i],
          p0: segment.p0,
          p1: segment.p1,
          rotation: rotation
        });
      });
    }
  }, {
    key: "parsePathData",
    value: function parsePathData(path) {
      this.pathLength = -1; // reset path length

      if (!path) {
        return [];
      }

      var pathCommands = [];
      var pathParser = path.pathParser;
      pathParser.reset(); // convert l, H, h, V, and v to L

      while (!pathParser.isEnd()) {
        var current = pathParser.current;
        var startX = current ? current.x : 0;
        var startY = current ? current.y : 0;
        var cmd = '';
        var points = [];
        pathParser.nextCommand();
        var upperCommand = pathParser.command.toUpperCase();

        switch (pathParser.command) {
          case 'M':
          case 'm':
            cmd = this.pathM(pathParser, points);
            break;

          case 'L':
          case 'l':
            cmd = this.pathL(pathParser, points);
            break;

          case 'H':
          case 'h':
            cmd = this.pathH(pathParser, points);
            break;

          case 'V':
          case 'v':
            cmd = this.pathV(pathParser, points);
            break;

          case 'C':
          case 'c':
            this.pathC(pathParser, points);
            break;

          case 'S':
          case 's':
            cmd = this.pathS(pathParser, points);
            break;

          case 'Q':
          case 'q':
            this.pathQ(pathParser, points);
            break;

          case 'T':
          case 't':
            cmd = this.pathT(pathParser, points);
            break;

          case 'A':
          case 'a':
            points = this.pathA(pathParser);
            break;

          case 'Z':
          case 'z':
            pathParser.current = pathParser.start;
            break;

          default:
        }

        if (upperCommand !== 'Z') {
          pathCommands.push({
            command: cmd || upperCommand,
            points: points,
            start: {
              x: startX,
              y: startY
            },
            pathLength: this.calcLength(startX, startY, cmd || upperCommand, points)
          });
        } else {
          pathCommands.push({
            command: 'z',
            points: [],
            pathLength: 0
          });
        }
      }

      return pathCommands;
    }
  }, {
    key: "pathM",
    value: function pathM(pathParser, points) {
      var p = pathParser.getAsCurrentPoint(); // pathParser.addMarker(p);

      points.push(p.x, p.y);
      pathParser.start = pathParser.current;

      while (!pathParser.isCommandOrEnd()) {
        var _p = pathParser.getAsCurrentPoint();

        points.push(_p.x, _p.y);
        return 'L';
      }
    }
  }, {
    key: "pathL",
    value: function pathL(pathParser, points) {
      while (!pathParser.isCommandOrEnd()) {
        var p = pathParser.getAsCurrentPoint();
        points.push(p.x, p.y);
      }

      return 'L';
    }
  }, {
    key: "pathH",
    value: function pathH(pathParser, points) {
      while (!pathParser.isCommandOrEnd()) {
        var current = pathParser.current;
        var point = new Point((pathParser.isRelativeCommand() ? current.x : 0) + pathParser.getScalar(), current.y);
        points.push(point.x, point.y);
        pathParser.current = point;
      }

      return 'L';
    }
  }, {
    key: "pathV",
    value: function pathV(pathParser, points) {
      while (!pathParser.isCommandOrEnd()) {
        var current = pathParser.current;
        var point = new Point(current.x, (pathParser.isRelativeCommand() ? current.y : 0) + pathParser.getScalar());
        points.push(point.x, point.y);
        pathParser.current = point;
      }

      return 'L';
    }
  }, {
    key: "pathC",
    value: function pathC(pathParser, points) {
      while (!pathParser.isCommandOrEnd()) {
        var point = pathParser.getPoint();
        var controlPoint = pathParser.getAsControlPoint();
        var currentPoint = pathParser.getAsCurrentPoint();
        points.push(point.x, point.y, controlPoint.x, controlPoint.y, currentPoint.x, currentPoint.y);
      }
    }
  }, {
    key: "pathS",
    value: function pathS(pathParser, points) {
      while (!pathParser.isCommandOrEnd()) {
        var point = pathParser.getReflectedControlPoint();
        var controlPoint = pathParser.getAsControlPoint();
        var currentPoint = pathParser.getAsCurrentPoint();
        points.push(point.x, point.y, controlPoint.x, controlPoint.y, currentPoint.x, currentPoint.y);
      }

      return 'C';
    }
  }, {
    key: "pathQ",
    value: function pathQ(pathParser, points) {
      while (!pathParser.isCommandOrEnd()) {
        var controlPoint = pathParser.getAsControlPoint();
        var currentPoint = pathParser.getAsCurrentPoint();
        points.push(controlPoint.x, controlPoint.y, currentPoint.x, currentPoint.y);
      }
    }
  }, {
    key: "pathT",
    value: function pathT(pathParser, points) {
      while (!pathParser.isCommandOrEnd()) {
        var controlPoint = pathParser.getReflectedControlPoint();
        pathParser.control = controlPoint;
        var currentPoint = pathParser.getAsCurrentPoint();
        points.push(controlPoint.x, controlPoint.y, currentPoint.x, currentPoint.y);
      }

      return 'Q';
    }
  }, {
    key: "pathA",
    value: function pathA(pathParser) {
      while (!pathParser.isCommandOrEnd()) {
        var current = pathParser.current; // x1, y1

        var rx = pathParser.getScalar();
        var ry = pathParser.getScalar();
        var xAxisRotation = pathParser.getScalar() * (Math.PI / 180.0); // φ

        var largeArcFlag = pathParser.getScalar(); //  fA

        var sweepFlag = pathParser.getScalar(); //  fS

        var currentPoint = pathParser.getAsCurrentPoint(); // x2, y2
        // Conversion from endpoint to center parameterization
        // http://www.w3.org/TR/SVG11/implnote.html#ArcImplementationNotes
        // x1', y1'

        var currp = new Point(Math.cos(xAxisRotation) * (current.x - currentPoint.x) / 2.0 + Math.sin(xAxisRotation) * (current.y - currentPoint.y) / 2.0, -Math.sin(xAxisRotation) * (current.x - currentPoint.x) / 2.0 + Math.cos(xAxisRotation) * (current.y - currentPoint.y) / 2.0); // adjust radii

        var l = Math.pow(currp.x, 2) / Math.pow(rx, 2) + Math.pow(currp.y, 2) / Math.pow(ry, 2);

        if (l > 1) {
          rx *= Math.sqrt(l);
          ry *= Math.sqrt(l);
        } // cx', cy'


        var s = (largeArcFlag === sweepFlag ? -1 : 1) * Math.sqrt((Math.pow(rx, 2) * Math.pow(ry, 2) - Math.pow(rx, 2) * Math.pow(currp.y, 2) - Math.pow(ry, 2) * Math.pow(currp.x, 2)) / (Math.pow(rx, 2) * Math.pow(currp.y, 2) + Math.pow(ry, 2) * Math.pow(currp.x, 2)));

        if (isNaN(s)) {
          s = 0;
        }

        var cpp = new Point(s * rx * currp.y / ry, s * -ry * currp.x / rx); // cx, cy

        var centp = new Point((current.x + currentPoint.x) / 2.0 + Math.cos(xAxisRotation) * cpp.x - Math.sin(xAxisRotation) * cpp.y, (current.y + currentPoint.y) / 2.0 + Math.sin(xAxisRotation) * cpp.x + Math.cos(xAxisRotation) * cpp.y); // initial angle

        var a1 = vectorsAngle([1, 0], [(currp.x - cpp.x) / rx, (currp.y - cpp.y) / ry]); // θ1
        // angle delta

        var u = [(currp.x - cpp.x) / rx, (currp.y - cpp.y) / ry];
        var v = [(-currp.x - cpp.x) / rx, (-currp.y - cpp.y) / ry];
        var ad = vectorsAngle(u, v); // Δθ

        if (vectorsRatio(u, v) <= -1) {
          ad = Math.PI;
        }

        if (vectorsRatio(u, v) >= 1) {
          ad = 0;
        }

        if (sweepFlag === 0 && ad > 0) {
          ad = ad - 2 * Math.PI;
        }

        if (sweepFlag === 1 && ad < 0) {
          ad = ad + 2 * Math.PI;
        }

        return [centp.x, centp.y, rx, ry, a1, ad, xAxisRotation, sweepFlag];
      }
    }
  }, {
    key: "calcLength",
    value: function calcLength(x, y, cmd, points) {
      var len = 0;
      var p1 = null;
      var p2 = null;
      var t = 0;

      switch (cmd) {
        case 'L':
          return this.getLineLength(x, y, points[0], points[1]);

        case 'C':
          // Approximates by breaking curve into 100 line segments
          len = 0.0;
          p1 = this.getPointOnCubicBezier(0, x, y, points[0], points[1], points[2], points[3], points[4], points[5]);

          for (t = 0.01; t <= 1; t += 0.01) {
            p2 = this.getPointOnCubicBezier(t, x, y, points[0], points[1], points[2], points[3], points[4], points[5]);
            len += this.getLineLength(p1.x, p1.y, p2.x, p2.y);
            p1 = p2;
          }

          return len;

        case 'Q':
          // Approximates by breaking curve into 100 line segments
          len = 0.0;
          p1 = this.getPointOnQuadraticBezier(0, x, y, points[0], points[1], points[2], points[3]);

          for (t = 0.01; t <= 1; t += 0.01) {
            p2 = this.getPointOnQuadraticBezier(t, x, y, points[0], points[1], points[2], points[3]);
            len += this.getLineLength(p1.x, p1.y, p2.x, p2.y);
            p1 = p2;
          }

          return len;

        case 'A':
          // Approximates by breaking curve into line segments
          len = 0.0;
          var start = points[4]; // 4 = theta

          var dTheta = points[5]; // 5 = dTheta

          var end = points[4] + dTheta;
          var inc = Math.PI / 180.0; // 1 degree resolution

          if (Math.abs(start - end) < inc) {
            inc = Math.abs(start - end);
          } // Note: for purpose of calculating arc length, not going to worry about rotating X-axis by angle psi


          p1 = this.getPointOnEllipticalArc(points[0], points[1], points[2], points[3], start, 0);

          if (dTheta < 0) {
            // clockwise
            for (t = start - inc; t > end; t -= inc) {
              p2 = this.getPointOnEllipticalArc(points[0], points[1], points[2], points[3], t, 0);
              len += this.getLineLength(p1.x, p1.y, p2.x, p2.y);
              p1 = p2;
            }
          } else {
            // counter-clockwise
            for (t = start + inc; t < end; t += inc) {
              p2 = this.getPointOnEllipticalArc(points[0], points[1], points[2], points[3], t, 0);
              len += this.getLineLength(p1.x, p1.y, p2.x, p2.y);
              p1 = p2;
            }
          }

          p2 = this.getPointOnEllipticalArc(points[0], points[1], points[2], points[3], end, 0);
          len += this.getLineLength(p1.x, p1.y, p2.x, p2.y);
          return len;

        default:
      }

      return 0;
    }
  }, {
    key: "getPointOnLine",
    value: function getPointOnLine(dist, P1x, P1y, P2x, P2y) {
      var fromX = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : P1x;
      var fromY = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : P1y;
      var m = (P2y - P1y) / (P2x - P1x + PSEUDO_ZERO);
      var run = Math.sqrt(dist * dist / (1 + m * m));

      if (P2x < P1x) {
        run *= -1;
      }

      var rise = m * run;
      var pt = null;

      if (P2x === P1x) {
        // vertical line
        pt = {
          x: fromX,
          y: fromY + rise
        };
      } else if ((fromY - P1y) / (fromX - P1x + PSEUDO_ZERO) === m) {
        pt = {
          x: fromX + run,
          y: fromY + rise
        };
      } else {
        var ix = 0;
        var iy = 0;
        var len = this.getLineLength(P1x, P1y, P2x, P2y);

        if (len < PSEUDO_ZERO) {
          return null;
        }

        var u = (fromX - P1x) * (P2x - P1x) + (fromY - P1y) * (P2y - P1y);
        u = u / (len * len);
        ix = P1x + u * (P2x - P1x);
        iy = P1y + u * (P2y - P1y);
        var pRise = this.getLineLength(fromX, fromY, ix, iy);
        var pRun = Math.sqrt(dist * dist - pRise * pRise);
        run = Math.sqrt(pRun * pRun / (1 + m * m));

        if (P2x < P1x) {
          run *= -1;
        }

        rise = m * run;
        pt = {
          x: ix + run,
          y: iy + rise
        };
      }

      return pt;
    }
  }, {
    key: "getPointOnPath",
    value: function getPointOnPath(distance) {
      var fullLen = this.getPathLength();
      var cumulativePathLength = 0;
      var p = null;

      if (distance < -0.00005 || distance - 0.00005 > fullLen) {
        return null;
      }

      var dataArray = this.dataArray;
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = dataArray[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var pathCmd = _step.value;

          if (pathCmd && (pathCmd.pathLength < 0.00005 || cumulativePathLength + pathCmd.pathLength + 0.00005 < distance)) {
            cumulativePathLength += pathCmd.pathLength;
            continue;
          }

          var delta = distance - cumulativePathLength;
          var currentT = 0;

          switch (pathCmd.command) {
            case 'L':
              p = this.getPointOnLine(delta, pathCmd.start.x, pathCmd.start.y, pathCmd.points[0], pathCmd.points[1], pathCmd.start.x, pathCmd.start.y);
              break;

            case 'A':
              var start = pathCmd.points[4]; // 4 = theta

              var dTheta = pathCmd.points[5]; // 5 = dTheta

              var end = pathCmd.points[4] + dTheta;
              currentT = start + delta / pathCmd.pathLength * dTheta;

              if (dTheta < 0 && currentT < end || dTheta >= 0 && currentT > end) {
                break;
              }

              p = this.getPointOnEllipticalArc(pathCmd.points[0], pathCmd.points[1], pathCmd.points[2], pathCmd.points[3], currentT, pathCmd.points[6]);
              break;

            case 'C':
              currentT = delta / pathCmd.pathLength;

              if (currentT > 1) {
                currentT = 1;
              }

              p = this.getPointOnCubicBezier(currentT, pathCmd.start.x, pathCmd.start.y, pathCmd.points[0], pathCmd.points[1], pathCmd.points[2], pathCmd.points[3], pathCmd.points[4], pathCmd.points[5]);
              break;

            case 'Q':
              currentT = delta / pathCmd.pathLength;

              if (currentT > 1) {
                currentT = 1;
              }

              p = this.getPointOnQuadraticBezier(currentT, pathCmd.start.x, pathCmd.start.y, pathCmd.points[0], pathCmd.points[1], pathCmd.points[2], pathCmd.points[3]);
              break;

            default:
          }

          if (p) {
            return p;
          }

          break;
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return != null) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }

      return null;
    }
  }, {
    key: "getLineLength",
    value: function getLineLength(x1, y1, x2, y2) {
      return Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1));
    }
  }, {
    key: "getPathLength",
    value: function getPathLength() {
      if (this.pathLength === -1) {
        this.pathLength = this.dataArray.reduce(function (length, command) {
          return command.pathLength > 0 ? length + command.pathLength : length;
        }, 0);
      }

      return this.pathLength;
    }
  }, {
    key: "getPointOnCubicBezier",
    value: function getPointOnCubicBezier(pct, P1x, P1y, P2x, P2y, P3x, P3y, P4x, P4y) {
      var x = P4x * CB1(pct) + P3x * CB2(pct) + P2x * CB3(pct) + P1x * CB4(pct);
      var y = P4y * CB1(pct) + P3y * CB2(pct) + P2y * CB3(pct) + P1y * CB4(pct);
      return {
        x: x,
        y: y
      };
    }
  }, {
    key: "getPointOnQuadraticBezier",
    value: function getPointOnQuadraticBezier(pct, P1x, P1y, P2x, P2y, P3x, P3y) {
      var x = P3x * QB1(pct) + P2x * QB2(pct) + P1x * QB3(pct);
      var y = P3y * QB1(pct) + P2y * QB2(pct) + P1y * QB3(pct);
      return {
        x: x,
        y: y
      };
    }
  }, {
    key: "getPointOnEllipticalArc",
    value: function getPointOnEllipticalArc(cx, cy, rx, ry, theta, psi) {
      var cosPsi = Math.cos(psi);
      var sinPsi = Math.sin(psi);
      var pt = {
        x: rx * Math.cos(theta),
        y: ry * Math.sin(theta)
      };
      return {
        x: cx + (pt.x * cosPsi - pt.y * sinPsi),
        y: cy + (pt.x * sinPsi + pt.y * cosPsi)
      };
    } // TODO need some optimisations. possibly build cache only for curved segments?

  }, {
    key: "buildEquidistantCache",
    value: function buildEquidistantCache(inputStep, inputPrecision) {
      var fullLen = this.getPathLength();
      var precision = inputPrecision || 0.25; // accuracy vs performance

      var step = inputStep || fullLen / 100;

      if (!this.equidistantCache || this.equidistantCache.step !== step || this.equidistantCache.precision !== precision) {
        // Prepare cache
        this.equidistantCache = {
          step: step,
          precision: precision,
          points: []
        }; // Calculate points

        var s = 0;

        for (var l = 0; l <= fullLen; l += precision) {
          var p0 = this.getPointOnPath(l);
          var p1 = this.getPointOnPath(l + precision);

          if (!p0 || !p1) {
            continue;
          }

          s += this.getLineLength(p0.x, p0.y, p1.x, p1.y);

          if (s >= step) {
            this.equidistantCache.points.push({
              x: p0.x,
              y: p0.y,
              distance: l
            });
            s -= step;
          }
        }
      }
    }
  }, {
    key: "getEquidistantPointOnPath",
    value: function getEquidistantPointOnPath(targetDistance, step, precision) {
      this.buildEquidistantCache(step, precision);

      if (targetDistance < 0 || targetDistance - this.getPathLength() > 0.00005) {
        return null;
      }

      var idx = Math.round(targetDistance / this.getPathLength() * (this.equidistantCache.points.length - 1));
      return this.equidistantCache.points[idx] || null;
    }
  }]);

  return TextPathElement;
}(TextElement);

var ImageElement =
/*#__PURE__*/
function (_RenderedElement) {
  _babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_33___default()(ImageElement, _RenderedElement);

  function ImageElement(document, node, captureTextNodes) {
    var _this;

    _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_19___default()(this, ImageElement);

    _this = _babel_runtime_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_31___default()(this, _babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_32___default()(ImageElement).call(this, document, node, captureTextNodes));
    _this.type = 'image';
    _this.loaded = false;

    var href = _this.getHrefAttribute().getString();

    if (!href) {
      return _babel_runtime_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_31___default()(_this);
    }

    var isSvg = /\.svg$/.test(href);
    document.images.push(_babel_runtime_helpers_assertThisInitialized__WEBPACK_IMPORTED_MODULE_47___default()(_this));

    if (!isSvg) {
      _this.loadImage(href);
    } else {
      _this.loadSvg(href);
    }

    _this.isSvg = isSvg;
    return _this;
  }

  _babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_20___default()(ImageElement, [{
    key: "loadImage",
    value: function () {
      var _loadImage = _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_17___default()(
      /*#__PURE__*/
      _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_16___default.a.mark(function _callee(href) {
        var image;
        return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_16___default.a.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.prev = 0;
                _context.next = 3;
                return this.document.createImage(href);

              case 3:
                image = _context.sent;
                this.image = image;
                _context.next = 10;
                break;

              case 7:
                _context.prev = 7;
                _context.t0 = _context["catch"](0);
                // tslint:disable-next-line: no-console
                console.error("ERROR: image \"".concat(href, "\" not found"), _context.t0);

              case 10:
                this.loaded = true;

              case 11:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this, [[0, 7]]);
      }));

      function loadImage(_x) {
        return _loadImage.apply(this, arguments);
      }

      return loadImage;
    }()
  }, {
    key: "loadSvg",
    value: function () {
      var _loadSvg = _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_17___default()(
      /*#__PURE__*/
      _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_16___default.a.mark(function _callee2(href) {
        var response, svg;
        return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_16___default.a.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                _context2.prev = 0;
                _context2.next = 3;
                return this.document.fetch(href);

              case 3:
                response = _context2.sent;
                _context2.next = 6;
                return response.text();

              case 6:
                svg = _context2.sent;
                this.image = svg;
                _context2.next = 13;
                break;

              case 10:
                _context2.prev = 10;
                _context2.t0 = _context2["catch"](0);
                // tslint:disable-next-line: no-console
                console.error("ERROR: image \"".concat(href, "\" not found"), _context2.t0);

              case 13:
                this.loaded = true;

              case 14:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, this, [[0, 10]]);
      }));

      function loadSvg(_x2) {
        return _loadSvg.apply(this, arguments);
      }

      return loadSvg;
    }()
  }, {
    key: "renderChildren",
    value: function renderChildren(ctx) {
      var document = this.document;
      var x = this.getAttribute('x').getPixels('x');
      var y = this.getAttribute('y').getPixels('y');
      var width = this.getAttribute('width').getPixels('x');
      var height = this.getAttribute('height').getPixels('y');

      if (!width || !height) {
        return;
      }

      ctx.save();

      if (this.isSvg) {
        document.canvg.forkString(ctx, this.image, {
          ignoreMouse: true,
          ignoreAnimation: true,
          ignoreDimensions: true,
          ignoreClear: true,
          offsetX: x,
          offsetY: y,
          scaleWidth: width,
          scaleHeight: height
        }).render();
      } else {
        var image = this.image;
        ctx.translate(x, y);
        document.setViewBox({
          ctx: ctx,
          aspectRatio: this.getAttribute('preserveAspectRatio').getString(),
          width: width,
          desiredWidth: image.width,
          height: height,
          desiredHeight: image.height
        });

        if (this.loaded) {
          if (typeof image.complete === 'undefined' || image.complete) {
            ctx.drawImage(image, 0, 0);
          }
        }
      }

      ctx.restore();
    }
  }, {
    key: "getBoundingBox",
    value: function getBoundingBox() {
      var x = this.getAttribute('x').getPixels('x');
      var y = this.getAttribute('y').getPixels('y');
      var width = this.getAttribute('width').getPixels('x');
      var height = this.getAttribute('height').getPixels('y');
      return new BoundingBox(x, y, x + width, y + height);
    }
  }]);

  return ImageElement;
}(RenderedElement);

var SymbolElement =
/*#__PURE__*/
function (_RenderedElement) {
  _babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_33___default()(SymbolElement, _RenderedElement);

  function SymbolElement() {
    var _this;

    _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_19___default()(this, SymbolElement);

    _this = _babel_runtime_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_31___default()(this, _babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_32___default()(SymbolElement).apply(this, arguments));
    _this.type = 'symbol';
    return _this;
  }

  _babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_20___default()(SymbolElement, [{
    key: "render",
    value: function render(_) {// NO RENDER
    }
  }]);

  return SymbolElement;
}(RenderedElement);

var SVGFontLoader =
/*#__PURE__*/
function () {
  function SVGFontLoader(document) {
    _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_19___default()(this, SVGFontLoader);

    this.document = document;
    this.loaded = false;
    document.fonts.push(this);
  }

  _babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_20___default()(SVGFontLoader, [{
    key: "load",
    value: function () {
      var _load = _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_17___default()(
      /*#__PURE__*/
      _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_16___default.a.mark(function _callee(fontFamily, url) {
        var document, svgDocument, fonts;
        return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_16___default.a.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.prev = 0;
                document = this.document;
                _context.next = 4;
                return document.canvg.parser.load(url);

              case 4:
                svgDocument = _context.sent;
                fonts = svgDocument.getElementsByTagName('font');
                Array.from(fonts).forEach(function (fontNode) {
                  var font = document.createElement(fontNode);
                  document.definitions[fontFamily] = font;
                });
                _context.next = 12;
                break;

              case 9:
                _context.prev = 9;
                _context.t0 = _context["catch"](0);
                // tslint:disable-next-line: no-console
                console.error("ERROR: font \"".concat(url, "\" not found"), _context.t0);

              case 12:
                this.loaded = true;

              case 13:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this, [[0, 9]]);
      }));

      function load(_x, _x2) {
        return _load.apply(this, arguments);
      }

      return load;
    }()
  }]);

  return SVGFontLoader;
}();

var StyleElement =
/*#__PURE__*/
function (_Element) {
  _babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_33___default()(StyleElement, _Element);

  function StyleElement(document, node, captureTextNodes) {
    var _this;

    _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_19___default()(this, StyleElement);

    _this = _babel_runtime_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_31___default()(this, _babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_32___default()(StyleElement).call(this, document, node, captureTextNodes));
    _this.type = 'style';
    var css = compressSpaces(Array.from(node.childNodes).map(function (_) {
      return _.data;
    }).join('').replace(/(\/\*([^*]|[\r\n]|(\*+([^*\/]|[\r\n])))*\*+\/)|(^[\s]*\/\/.*)/gm, '') // remove comments;
    );
    var cssDefs = css.split('}');
    cssDefs.forEach(function (_) {
      var def = _.trim();

      if (!def) {
        return;
      }

      var cssParts = def.split('{');
      var cssClasses = cssParts[0].split(',');
      var cssProps = cssParts[1].split(';');
      cssClasses.forEach(function (_) {
        var cssClass = _.trim();

        if (!cssClass) {
          return;
        }

        var props = document.styles[cssClass] || {};
        cssProps.forEach(function (cssProp) {
          var prop = cssProp.indexOf(':');
          var name = cssProp.substr(0, prop).trim();
          var value = cssProp.substr(prop + 1, cssProp.length - prop).trim();

          if (name && value) {
            props[name] = new Property(document, name, value);
          }
        });
        document.styles[cssClass] = props;
        document.stylesSpecificity[cssClass] = getSelectorSpecificity(cssClass);

        if (cssClass === '@font-face') {
          //  && !nodeEnv
          var fontFamily = props['font-family'].getString().replace(/"|'/g, '');
          var srcs = props.src.getString().split(',');
          srcs.forEach(function (src) {
            if (src.indexOf('format("svg")') > 0) {
              var url = parseExternalUrl(src);

              if (url) {
                new SVGFontLoader(document).load(fontFamily, url);
              }
            }
          });
        }
      });
    });
    return _this;
  }

  return StyleElement;
}(Element);
StyleElement.parseExternalUrl = parseExternalUrl;

var UseElement =
/*#__PURE__*/
function (_RenderedElement) {
  _babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_33___default()(UseElement, _RenderedElement);

  function UseElement() {
    var _this;

    _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_19___default()(this, UseElement);

    _this = _babel_runtime_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_31___default()(this, _babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_32___default()(UseElement).apply(this, arguments));
    _this.type = 'use';
    return _this;
  }

  _babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_20___default()(UseElement, [{
    key: "setContext",
    value: function setContext(ctx) {
      _babel_runtime_helpers_get__WEBPACK_IMPORTED_MODULE_42___default()(_babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_32___default()(UseElement.prototype), "setContext", this).call(this, ctx);

      var xAttr = this.getAttribute('x');
      var yAttr = this.getAttribute('y');

      if (xAttr.hasValue()) {
        ctx.translate(xAttr.getPixels('x'), 0);
      }

      if (yAttr.hasValue()) {
        ctx.translate(0, yAttr.getPixels('y'));
      }
    }
  }, {
    key: "path",
    value: function path(ctx) {
      var element = this.element;

      if (element) {
        element.path(ctx);
      }
    }
  }, {
    key: "renderChildren",
    value: function renderChildren(ctx) {
      var document = this.document,
          element = this.element;

      if (element) {
        var tempSvg = element;

        if (element.type === 'symbol') {
          // render me using a temporary svg element in symbol cases (http://www.w3.org/TR/SVG/struct.html#UseElement)
          tempSvg = new SVGElement(document, null);
          tempSvg.attributes.viewBox = new Property(document, 'viewBox', element.getAttribute('viewBox').getString());
          tempSvg.attributes.preserveAspectRatio = new Property(document, 'preserveAspectRatio', element.getAttribute('preserveAspectRatio').getString());
          tempSvg.attributes.overflow = new Property(document, 'overflow', element.getAttribute('overflow').getString());
          tempSvg.children = element.children;
        }

        if (tempSvg.type === 'svg') {
          var widthAttr = this.getAttribute('width');
          var heightAttr = this.getAttribute('height'); // if symbol or svg, inherit width/height from me

          if (widthAttr.hasValue()) {
            tempSvg.attributes.width = new Property(document, 'width', this.getAttribute('width').getString());
          }

          if (heightAttr.hasValue()) {
            tempSvg.attributes.height = new Property(document, 'height', heightAttr.getString());
          }
        }

        var oldParent = tempSvg.parent;
        tempSvg.parent = null;
        tempSvg.render(ctx);
        tempSvg.parent = oldParent;
      }
    }
  }, {
    key: "getBoundingBox",
    value: function getBoundingBox(ctx) {
      var element = this.element;

      if (element) {
        return element.getBoundingBox(ctx);
      }

      return null;
    }
  }, {
    key: "elementTransform",
    value: function elementTransform() {
      var document = this.document,
          element = this.element;
      return Transform.fromElement(document, element);
    }
  }, {
    key: "element",
    get: function get() {
      if (!this._element) {
        this._element = this.getHrefAttribute().getDefinition();
      }

      return this._element;
    }
  }]);

  return UseElement;
}(RenderedElement);

function imGet(img, x, y, width, _, rgba) {
  return img[y * width * 4 + x * 4 + rgba];
}

function imSet(img, x, y, width, _, rgba, val) {
  img[y * width * 4 + x * 4 + rgba] = val;
}

function m(matrix, i, v) {
  var mi = matrix[i];
  return mi * (mi < 0 ? v - 255 : v);
}

function c(a, m1, m2, m3) {
  return m1 + Math.cos(a) * m2 + Math.sin(a) * m3;
}

var FeColorMatrixElement =
/*#__PURE__*/
function (_Element) {
  _babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_33___default()(FeColorMatrixElement, _Element);

  function FeColorMatrixElement(document, node, captureTextNodes) {
    var _this;

    _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_19___default()(this, FeColorMatrixElement);

    _this = _babel_runtime_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_31___default()(this, _babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_32___default()(FeColorMatrixElement).call(this, document, node, captureTextNodes));
    _this.type = 'feColorMatrix';
    var matrix = toNumbers(_this.getAttribute('values').getString());

    switch (_this.getAttribute('type').getString('matrix')) {
      // http://www.w3.org/TR/SVG/filters.html#feColorMatrixElement
      case 'saturate':
        {
          var s = matrix[0];
          matrix = [0.213 + 0.787 * s, 0.715 - 0.715 * s, 0.072 - 0.072 * s, 0, 0, 0.213 - 0.213 * s, 0.715 + 0.285 * s, 0.072 - 0.072 * s, 0, 0, 0.213 - 0.213 * s, 0.715 - 0.715 * s, 0.072 + 0.928 * s, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1];
          break;
        }

      case 'hueRotate':
        {
          var a = matrix[0] * Math.PI / 180.0;
          matrix = [c(a, 0.213, 0.787, -0.213), c(a, 0.715, -0.715, -0.715), c(a, 0.072, -0.072, 0.928), 0, 0, c(a, 0.213, -0.213, 0.143), c(a, 0.715, 0.285, 0.140), c(a, 0.072, -0.072, -0.283), 0, 0, c(a, 0.213, -0.213, -0.787), c(a, 0.715, -0.715, 0.715), c(a, 0.072, 0.928, 0.072), 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1];
          break;
        }

      case 'luminanceToAlpha':
        matrix = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0.2125, 0.7154, 0.0721, 0, 0, 0, 0, 0, 0, 1];
        break;

      default:
    }

    _this.matrix = matrix;
    _this.includeOpacity = _this.getAttribute('includeOpacity').hasValue();
    return _this;
  }

  _babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_20___default()(FeColorMatrixElement, [{
    key: "apply",
    value: function apply(ctx, _, __, width, height) {
      // assuming x==0 && y==0 for now
      var includeOpacity = this.includeOpacity,
          matrix = this.matrix;
      var srcData = ctx.getImageData(0, 0, width, height);

      for (var y = 0; y < height; y++) {
        for (var x = 0; x < width; x++) {
          var r = imGet(srcData.data, x, y, width, height, 0);
          var g = imGet(srcData.data, x, y, width, height, 1);
          var b = imGet(srcData.data, x, y, width, height, 2);
          var a = imGet(srcData.data, x, y, width, height, 3);
          var nr = m(matrix, 0, r) + m(matrix, 1, g) + m(matrix, 2, b) + m(matrix, 3, a) + m(matrix, 4, 1);
          var ng = m(matrix, 5, r) + m(matrix, 6, g) + m(matrix, 7, b) + m(matrix, 8, a) + m(matrix, 9, 1);
          var nb = m(matrix, 10, r) + m(matrix, 11, g) + m(matrix, 12, b) + m(matrix, 13, a) + m(matrix, 14, 1);
          var na = m(matrix, 15, r) + m(matrix, 16, g) + m(matrix, 17, b) + m(matrix, 18, a) + m(matrix, 19, 1);

          if (includeOpacity) {
            nr = ng = nb = 0;
            na *= a / 255;
          }

          imSet(srcData.data, x, y, width, height, 0, nr);
          imSet(srcData.data, x, y, width, height, 1, ng);
          imSet(srcData.data, x, y, width, height, 2, nb);
          imSet(srcData.data, x, y, width, height, 3, na);
        }
      }

      ctx.clearRect(0, 0, width, height);
      ctx.putImageData(srcData, 0, 0);
    }
  }]);

  return FeColorMatrixElement;
}(Element);

var MaskElement =
/*#__PURE__*/
function (_Element) {
  _babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_33___default()(MaskElement, _Element);

  function MaskElement() {
    var _this;

    _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_19___default()(this, MaskElement);

    _this = _babel_runtime_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_31___default()(this, _babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_32___default()(MaskElement).apply(this, arguments));
    _this.type = 'mask';
    return _this;
  }

  _babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_20___default()(MaskElement, [{
    key: "apply",
    value: function apply(ctx, element) {
      var document = this.document; // render as temp svg

      var x = this.getAttribute('x').getPixels('x');
      var y = this.getAttribute('y').getPixels('y');
      var width = this.getAttribute('width').getPixels('x');
      var height = this.getAttribute('height').getPixels('y');

      if (!width && !height) {
        var boundingBox = new BoundingBox();
        this.children.forEach(function (child) {
          boundingBox.addBoundingBox(child.getBoundingBox(ctx));
        });
        x = Math.floor(boundingBox.x1);
        y = Math.floor(boundingBox.y1);
        width = Math.floor(boundingBox.width);
        height = Math.floor(boundingBox.height);
      } // temporarily remove mask to avoid recursion


      var mask = element.getStyle('mask').getString();
      element.getStyle('mask').setValue('');
      var cMask = document.createCanvas(x + width, y + height);
      var maskCtx = cMask.getContext('2d');
      document.screen.setDefaults(maskCtx);
      this.renderChildren(maskCtx); // convert mask to alpha with a fake node
      // TODO: refactor out apply from feColorMatrix

      var cm = new FeColorMatrixElement(document, {
        nodeType: 1,
        childNodes: [],
        attributes: [{
          nodeName: 'type',
          value: 'luminanceToAlpha'
        }, {
          nodeName: 'includeOpacity',
          value: 'true'
        }]
      });
      cm.apply(maskCtx, 0, 0, x + width, y + height);
      var c = document.createCanvas(x + width, y + height);
      var tempCtx = c.getContext('2d');
      document.screen.setDefaults(tempCtx);
      element.render(tempCtx);
      tempCtx.globalCompositeOperation = 'destination-in';
      tempCtx.fillStyle = maskCtx.createPattern(cMask, 'no-repeat');
      tempCtx.fillRect(0, 0, x + width, y + height);
      ctx.fillStyle = tempCtx.createPattern(c, 'no-repeat');
      ctx.fillRect(0, 0, x + width, y + height); // reassign mask

      element.getStyle('mask').setValue(mask);
    }
  }, {
    key: "render",
    value: function render(_) {// NO RENDER
    }
  }]);

  return MaskElement;
}(Element);

var noop = function noop() {};

var ClipPathElement =
/*#__PURE__*/
function (_Element) {
  _babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_33___default()(ClipPathElement, _Element);

  function ClipPathElement() {
    var _this;

    _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_19___default()(this, ClipPathElement);

    _this = _babel_runtime_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_31___default()(this, _babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_32___default()(ClipPathElement).apply(this, arguments));
    _this.type = 'clipPath';
    return _this;
  }

  _babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_20___default()(ClipPathElement, [{
    key: "apply",
    value: function apply(ctx) {
      var document = this.document;
      var contextProto = Reflect.getPrototypeOf(ctx);
      var beginPath = ctx.beginPath,
          closePath = ctx.closePath;

      if (contextProto) {
        contextProto.beginPath = noop;
        contextProto.closePath = noop;
      }

      Reflect.apply(beginPath, ctx, []);
      this.children.forEach(function (child) {
        if (typeof child.path === 'undefined') {
          return;
        }

        var transform = typeof child.elementTransform !== 'undefined' ? child.elementTransform() : null; // handle <use />

        if (!transform) {
          transform = Transform.fromElement(document, child);
        }

        if (transform) {
          transform.apply(ctx);
        }

        child.path(ctx);

        if (contextProto) {
          contextProto.closePath = closePath;
        }

        if (transform) {
          transform.unapply(ctx);
        }
      });
      Reflect.apply(closePath, ctx, []);
      ctx.clip();

      if (contextProto) {
        contextProto.beginPath = beginPath;
        contextProto.closePath = closePath;
      }
    }
  }, {
    key: "render",
    value: function render(_) {// NO RENDER
    }
  }]);

  return ClipPathElement;
}(Element);

var FilterElement =
/*#__PURE__*/
function (_Element) {
  _babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_33___default()(FilterElement, _Element);

  function FilterElement() {
    var _this;

    _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_19___default()(this, FilterElement);

    _this = _babel_runtime_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_31___default()(this, _babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_32___default()(FilterElement).apply(this, arguments));
    _this.type = 'filter';
    return _this;
  }

  _babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_20___default()(FilterElement, [{
    key: "apply",
    value: function apply(ctx, element) {
      // render as temp svg
      var document = this.document;
      var boundingBox = element.getBoundingBox(ctx);
      var x = Math.floor(boundingBox.x1);
      var y = Math.floor(boundingBox.y1);
      var width = Math.floor(boundingBox.width);
      var height = Math.floor(boundingBox.height); // temporarily remove filter to avoid recursion

      var filter = element.getStyle('filter').getString();
      element.getStyle('filter').setValue('');
      var px = 0;
      var py = 0;
      this.children.forEach(function (child) {
        var efd = child.extraFilterDistance || 0;
        px = Math.max(px, efd);
        py = Math.max(py, efd);
      });
      var tmpCanvas = document.createCanvas(width + 2 * px, height + 2 * py);
      var tmpCtx = tmpCanvas.getContext('2d');
      document.screen.setDefaults(tmpCtx);
      tmpCtx.translate(-x + px, -y + py);
      element.render(tmpCtx); // apply filters

      this.children.forEach(function (child) {
        if (typeof child.apply === 'function') {
          child.apply(tmpCtx, 0, 0, width + 2 * px, height + 2 * py);
        }
      }); // render on me

      ctx.drawImage(tmpCanvas, 0, 0, width + 2 * px, height + 2 * py, x - px, y - py, width + 2 * px, height + 2 * py); // reassign filter

      element.getStyle('filter', true).setValue(filter);
    }
  }, {
    key: "render",
    value: function render(_) {// NO RENDER
    }
  }]);

  return FilterElement;
}(Element);

var FeDropShadowElement =
/*#__PURE__*/
function (_Element) {
  _babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_33___default()(FeDropShadowElement, _Element);

  function FeDropShadowElement(document, node, captureTextNodes) {
    var _this;

    _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_19___default()(this, FeDropShadowElement);

    _this = _babel_runtime_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_31___default()(this, _babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_32___default()(FeDropShadowElement).call(this, document, node, captureTextNodes));
    _this.type = 'feDropShadow';

    _this.addStylesFromStyleDefinition();

    return _this;
  }

  _babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_20___default()(FeDropShadowElement, [{
    key: "apply",
    value: function apply(_, __, ___, ____, _____) {// TODO: implement
    }
  }]);

  return FeDropShadowElement;
}(Element);

var FeMorphologyElement =
/*#__PURE__*/
function (_Element) {
  _babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_33___default()(FeMorphologyElement, _Element);

  function FeMorphologyElement() {
    var _this;

    _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_19___default()(this, FeMorphologyElement);

    _this = _babel_runtime_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_31___default()(this, _babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_32___default()(FeMorphologyElement).apply(this, arguments));
    _this.type = 'feMorphology';
    return _this;
  }

  _babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_20___default()(FeMorphologyElement, [{
    key: "apply",
    value: function apply(_, __, ___, ____, _____) {// TODO: implement
    }
  }]);

  return FeMorphologyElement;
}(Element);

var FeCompositeElement =
/*#__PURE__*/
function (_Element) {
  _babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_33___default()(FeCompositeElement, _Element);

  function FeCompositeElement() {
    var _this;

    _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_19___default()(this, FeCompositeElement);

    _this = _babel_runtime_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_31___default()(this, _babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_32___default()(FeCompositeElement).apply(this, arguments));
    _this.type = 'feComposite';
    return _this;
  }

  _babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_20___default()(FeCompositeElement, [{
    key: "apply",
    value: function apply(_, __, ___, ____, _____) {// TODO: implement
    }
  }]);

  return FeCompositeElement;
}(Element);

var FeGaussianBlurElement =
/*#__PURE__*/
function (_Element) {
  _babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_33___default()(FeGaussianBlurElement, _Element);

  function FeGaussianBlurElement(document, node, captureTextNodes) {
    var _this;

    _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_19___default()(this, FeGaussianBlurElement);

    _this = _babel_runtime_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_31___default()(this, _babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_32___default()(FeGaussianBlurElement).call(this, document, node, captureTextNodes));
    _this.type = 'feGaussianBlur';
    _this.blurRadius = Math.floor(_this.getAttribute('stdDeviation').getNumber());
    _this.extraFilterDistance = _this.blurRadius;
    return _this;
  }

  _babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_20___default()(FeGaussianBlurElement, [{
    key: "apply",
    value: function apply(ctx, x, y, width, height) {
      var document = this.document,
          blurRadius = this.blurRadius;
      var body = document.window ? document.window.document.body : null;
      var canvas = ctx.canvas; // StackBlur requires canvas be on document

      canvas.id = document.getUniqueId();

      if (body) {
        canvas.style.display = 'none';
        body.appendChild(canvas);
      }

      Object(stackblur_canvas__WEBPACK_IMPORTED_MODULE_56__[/* canvasRGBA */ "a"])(canvas, x, y, width, height, blurRadius);

      if (body) {
        body.removeChild(canvas);
      }
    }
  }]);

  return FeGaussianBlurElement;
}(Element);

var TitleElement =
/*#__PURE__*/
function (_Element) {
  _babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_33___default()(TitleElement, _Element);

  function TitleElement() {
    var _this;

    _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_19___default()(this, TitleElement);

    _this = _babel_runtime_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_31___default()(this, _babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_32___default()(TitleElement).apply(this, arguments));
    _this.type = 'title';
    return _this;
  }

  return TitleElement;
}(Element);

var DescElement =
/*#__PURE__*/
function (_Element) {
  _babel_runtime_helpers_inherits__WEBPACK_IMPORTED_MODULE_33___default()(DescElement, _Element);

  function DescElement() {
    var _this;

    _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_19___default()(this, DescElement);

    _this = _babel_runtime_helpers_possibleConstructorReturn__WEBPACK_IMPORTED_MODULE_31___default()(this, _babel_runtime_helpers_getPrototypeOf__WEBPACK_IMPORTED_MODULE_32___default()(DescElement).apply(this, arguments));
    _this.type = 'desc';
    return _this;
  }

  return DescElement;
}(Element);

var elementTypes = {
  'svg': SVGElement,
  'rect': RectElement,
  'circle': CircleElement,
  'ellipse': EllipseElement,
  'line': LineElement,
  'polyline': PolylineElement,
  'polygon': PolygonElement,
  'path': PathElement,
  'pattern': PatternElement,
  'marker': MarkerElement,
  'defs': DefsElement,
  'linearGradient': LinearGradientElement,
  'radialGradient': RadialGradientElement,
  'stop': StopElement,
  'animate': AnimateElement,
  'animateColor': AnimateColorElement,
  'animateTransform': AnimateTransformElement,
  'font': FontElement,
  'font-face': FontFaceElement,
  'missing-glyph': MissingGlyphElement,
  'glyph': GlyphElement,
  'text': TextElement,
  'tspan': TSpanElement,
  'tref': TRefElement,
  'a': AElement,
  'textPath': TextPathElement,
  'image': ImageElement,
  'g': GElement,
  'symbol': SymbolElement,
  'style': StyleElement,
  'use': UseElement,
  'mask': MaskElement,
  'clipPath': ClipPathElement,
  'filter': FilterElement,
  'feDropShadow': FeDropShadowElement,
  'feMorphology': FeMorphologyElement,
  'feComposite': FeCompositeElement,
  'feColorMatrix': FeColorMatrixElement,
  'feGaussianBlur': FeGaussianBlurElement,
  'title': TitleElement,
  'desc': DescElement
};

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_18___default()(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function createCanvas(width, height) {
  var canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  return canvas;
}

function createImage(_x) {
  return _createImage.apply(this, arguments);
}

function _createImage() {
  _createImage = _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_17___default()(
  /*#__PURE__*/
  _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_16___default.a.mark(function _callee(src) {
    var image;
    return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_16___default.a.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            image = document.createElement('img'); // image.crossOrigin = 'Anonymous';

            return _context.abrupt("return", new Promise(function (resolve, reject) {
              image.onload = function () {
                resolve(image);
              };

              image.onerror = function () {
                reject();
              };

              image.src = src;
            }));

          case 2:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));
  return _createImage.apply(this, arguments);
}

var Document =
/*#__PURE__*/
function () {
  function Document(canvg) {
    var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
        _ref$rootEmSize = _ref.rootEmSize,
        rootEmSize = _ref$rootEmSize === void 0 ? 12 : _ref$rootEmSize,
        _ref$emSize = _ref.emSize,
        emSize = _ref$emSize === void 0 ? 12 : _ref$emSize,
        _ref$createCanvas = _ref.createCanvas,
        createCanvas = _ref$createCanvas === void 0 ? Document.createCanvas : _ref$createCanvas,
        _ref$createImage = _ref.createImage,
        createImage = _ref$createImage === void 0 ? Document.createImage : _ref$createImage;

    _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_19___default()(this, Document);

    this.canvg = canvg;
    this.definitions = {};
    this.styles = {};
    this.stylesSpecificity = {};
    this.images = [];
    this.fonts = [];
    this.emSizeStack = [];
    this.uniqueId = 0;
    this.screen = canvg.screen;
    this.rootEmSize = rootEmSize;
    this.emSize = emSize;
    this.createCanvas = createCanvas;
    this.createImage = createImage;
    this.screen.wait(this.isImagesLoaded.bind(this));
    this.screen.wait(this.isFontsLoaded.bind(this));
  }

  _babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_20___default()(Document, [{
    key: "popEmSize",
    value: function popEmSize() {
      var emSizeStack = this.emSizeStack;
      emSizeStack.pop();
    }
  }, {
    key: "getUniqueId",
    value: function getUniqueId() {
      return "canvg".concat(++this.uniqueId);
    }
  }, {
    key: "isImagesLoaded",
    value: function isImagesLoaded() {
      return this.images.every(function (_) {
        return _.loaded;
      });
    }
  }, {
    key: "isFontsLoaded",
    value: function isFontsLoaded() {
      return this.fonts.every(function (_) {
        return _.loaded;
      });
    }
  }, {
    key: "createDocumentElement",
    value: function createDocumentElement(document) {
      var documentElement = this.createElement(document.documentElement);
      documentElement.root = true;
      documentElement.addStylesFromStyleDefinition();
      this.documentElement = documentElement;
      return documentElement;
    }
  }, {
    key: "createElement",
    value: function createElement(node) {
      var elementType = node.nodeName.replace(/^[^:]+:/, '');
      var ElementType = Document.elementTypes[elementType];

      if (typeof ElementType !== 'undefined') {
        return new ElementType(this, node);
      }

      return new UnknownElement(this, node);
    }
  }, {
    key: "createTextNode",
    value: function createTextNode(node) {
      return new TextNode(this, node);
    }
  }, {
    key: "setViewBox",
    value: function setViewBox(config) {
      this.screen.setViewBox(_objectSpread({
        document: this
      }, config));
    }
  }, {
    key: "window",
    get: function get() {
      return this.screen.window;
    }
  }, {
    key: "fetch",
    get: function get() {
      return this.screen.fetch;
    }
  }, {
    key: "ctx",
    get: function get() {
      return this.screen.ctx;
    }
  }, {
    key: "emSize",
    get: function get() {
      var emSizeStack = this.emSizeStack;
      return emSizeStack[emSizeStack.length - 1];
    },
    set: function set(value) {
      var emSizeStack = this.emSizeStack;
      emSizeStack.push(value);
    }
  }]);

  return Document;
}();
Document.createCanvas = createCanvas;
Document.createImage = createImage;
Document.elementTypes = elementTypes;

function ownKeys$1(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread$1(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys$1(source, true).forEach(function (key) { _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_18___default()(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys$1(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }
/**
 * SVG renderer on canvas.
 */

var Canvg =
/*#__PURE__*/
function () {
  /**
   * Main constructor.
   * @param ctx - Rendering context.
   * @param svg - SVG Document.
   * @param options - Rendering options.
   */
  function Canvg(ctx, svg) {
    var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

    _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_19___default()(this, Canvg);

    this.parser = new Parser(options);
    this.screen = new Screen(ctx, options);
    this.options = options;
    var document = new Document(this, options);
    var documentElement = document.createDocumentElement(svg);
    this.document = document;
    this.documentElement = documentElement;
  }
  /**
   * Create Canvg isntance from SVG source string or URL.
   * @param ctx - Rendering context.
   * @param svg - SVG source string or URL.
   * @param options - Rendering options.
   */


  _babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_20___default()(Canvg, [{
    key: "fork",

    /**
     * Create new Canvg instance with inherited options.
     * @param ctx - Rendering context.
     * @param svg - SVG source string or URL.
     * @param options - Rendering options.
     */
    value: function fork(ctx, svg) {
      var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
      return Canvg.from(ctx, svg, _objectSpread$1({}, this.options, {}, options));
    }
    /**
     * Create new Canvg instance with inherited options.
     * @param ctx - Rendering context.
     * @param svg - SVG source string.
     * @param options - Rendering options.
     */

  }, {
    key: "forkString",
    value: function forkString(ctx, svg) {
      var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
      return Canvg.fromString(ctx, svg, _objectSpread$1({}, this.options, {}, options));
    }
    /**
     * Document is ready promise.
     */

  }, {
    key: "ready",
    value: function ready() {
      return this.screen.ready();
    }
    /**
     * Document is ready value.
     */

  }, {
    key: "isReady",
    value: function isReady() {
      return this.screen.isReady();
    }
    /**
     * Render only first frame, ignoring animations and mouse.
     * @param options - Rendering options.
     */

  }, {
    key: "render",
    value: function () {
      var _render = _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_17___default()(
      /*#__PURE__*/
      _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_16___default.a.mark(function _callee() {
        var options,
            _args = arguments;
        return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_16___default.a.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                options = _args.length > 0 && _args[0] !== undefined ? _args[0] : {};
                this.start(_objectSpread$1({
                  enableRedraw: true,
                  ignoreAnimation: true,
                  ignoreMouse: true
                }, options));
                _context.next = 4;
                return this.ready();

              case 4:
                this.stop();

              case 5:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function render() {
        return _render.apply(this, arguments);
      }

      return render;
    }()
    /**
     * Start rendering.
     * @param options - Render options.
     */

  }, {
    key: "start",
    value: function start() {
      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      var documentElement = this.documentElement,
          screen = this.screen,
          baseOptions = this.options;
      screen.start(documentElement, _objectSpread$1({
        enableRedraw: true
      }, baseOptions, {}, options));
    }
    /**
     * Stop rendering.
     */

  }, {
    key: "stop",
    value: function stop() {
      this.screen.stop();
    }
    /**
     * Resize SVG to fit in given size.
     * @param width
     * @param height
     * @param preserveAspectRatio
     */

  }, {
    key: "resize",
    value: function resize(width) {
      var height = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : width;
      var preserveAspectRatio = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
      this.documentElement.resize(width, height, preserveAspectRatio);
    }
  }], [{
    key: "from",
    value: function () {
      var _from = _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_17___default()(
      /*#__PURE__*/
      _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_16___default.a.mark(function _callee2(ctx, svg) {
        var options,
            parser,
            svgDocument,
            _args2 = arguments;
        return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_16___default.a.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                options = _args2.length > 2 && _args2[2] !== undefined ? _args2[2] : {};
                parser = new Parser(options);
                _context2.next = 4;
                return parser.parse(svg);

              case 4:
                svgDocument = _context2.sent;
                return _context2.abrupt("return", new Canvg(ctx, svgDocument, options));

              case 6:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2);
      }));

      function from(_x, _x2) {
        return _from.apply(this, arguments);
      }

      return from;
    }()
    /**
     * Create Canvg isntance from SVG source string.
     * @param ctx - Rendering context.
     * @param svg - SVG source string.
     * @param options - Rendering options.
     */

  }, {
    key: "fromString",
    value: function fromString(ctx, svg) {
      var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
      var parser = new Parser(options);
      var svgDocument = parser.parseFromString(svg);
      return new Canvg(ctx, svgDocument, options);
    }
  }]);

  return Canvg;
}();

/**
 * Options preset for `OffscreenCanvas`.
 */
function offscreen() {
  return {
    window: null,
    ignoreAnimation: true,
    ignoreMouse: true,
    createCanvas: function createCanvas(width, height) {
      return new OffscreenCanvas(width, height);
    },
    createImage: function () {
      var _createImage = _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_17___default()(
      /*#__PURE__*/
      _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_16___default.a.mark(function _callee(url) {
        var response, blob, img;
        return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_16___default.a.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.next = 2;
                return fetch(url);

              case 2:
                response = _context.sent;
                _context.next = 5;
                return response.blob();

              case 5:
                blob = _context.sent;
                _context.next = 8;
                return createImageBitmap(blob);

              case 8:
                img = _context.sent;
                return _context.abrupt("return", img);

              case 10:
              case "end":
                return _context.stop();
            }
          }
        }, _callee);
      }));

      function createImage(_x) {
        return _createImage.apply(this, arguments);
      }

      return createImage;
    }()
  };
}

/**
 * Options preset for `node-canvas`.
 * @param config - Preset requirements.
 * @param config.DOMParser - XML/HTML parser from string into DOM Document.
 * @param config.canvas - `node-canvas` exports.
 * @param config.fetch - WHATWG-compatible `fetch` function.
 */
function node(_ref) {
  var DOMParser = _ref.DOMParser,
      canvas = _ref.canvas,
      fetch = _ref.fetch;
  return {
    window: null,
    ignoreAnimation: true,
    ignoreMouse: true,
    DOMParser: DOMParser,
    fetch: fetch,
    createCanvas: canvas.createCanvas,
    createImage: canvas.loadImage
  };
}



var index = /*#__PURE__*/Object.freeze({
	__proto__: null,
	offscreen: offscreen,
	node: node
});

/* harmony default export */ __webpack_exports__["default"] = (Canvg);

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguZXMuanMiLCJzb3VyY2VzIjpbIi4uL25vZGVfbW9kdWxlcy9yZWdlbmVyYXRvci1ydW50aW1lL3J1bnRpbWUuanMiXSwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTQtcHJlc2VudCwgRmFjZWJvb2ssIEluYy5cbiAqXG4gKiBUaGlzIHNvdXJjZSBjb2RlIGlzIGxpY2Vuc2VkIHVuZGVyIHRoZSBNSVQgbGljZW5zZSBmb3VuZCBpbiB0aGVcbiAqIExJQ0VOU0UgZmlsZSBpbiB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhpcyBzb3VyY2UgdHJlZS5cbiAqL1xuXG52YXIgcnVudGltZSA9IChmdW5jdGlvbiAoZXhwb3J0cykge1xuICBcInVzZSBzdHJpY3RcIjtcblxuICB2YXIgT3AgPSBPYmplY3QucHJvdG90eXBlO1xuICB2YXIgaGFzT3duID0gT3AuaGFzT3duUHJvcGVydHk7XG4gIHZhciB1bmRlZmluZWQ7IC8vIE1vcmUgY29tcHJlc3NpYmxlIHRoYW4gdm9pZCAwLlxuICB2YXIgJFN5bWJvbCA9IHR5cGVvZiBTeW1ib2wgPT09IFwiZnVuY3Rpb25cIiA/IFN5bWJvbCA6IHt9O1xuICB2YXIgaXRlcmF0b3JTeW1ib2wgPSAkU3ltYm9sLml0ZXJhdG9yIHx8IFwiQEBpdGVyYXRvclwiO1xuICB2YXIgYXN5bmNJdGVyYXRvclN5bWJvbCA9ICRTeW1ib2wuYXN5bmNJdGVyYXRvciB8fCBcIkBAYXN5bmNJdGVyYXRvclwiO1xuICB2YXIgdG9TdHJpbmdUYWdTeW1ib2wgPSAkU3ltYm9sLnRvU3RyaW5nVGFnIHx8IFwiQEB0b1N0cmluZ1RhZ1wiO1xuXG4gIGZ1bmN0aW9uIHdyYXAoaW5uZXJGbiwgb3V0ZXJGbiwgc2VsZiwgdHJ5TG9jc0xpc3QpIHtcbiAgICAvLyBJZiBvdXRlckZuIHByb3ZpZGVkIGFuZCBvdXRlckZuLnByb3RvdHlwZSBpcyBhIEdlbmVyYXRvciwgdGhlbiBvdXRlckZuLnByb3RvdHlwZSBpbnN0YW5jZW9mIEdlbmVyYXRvci5cbiAgICB2YXIgcHJvdG9HZW5lcmF0b3IgPSBvdXRlckZuICYmIG91dGVyRm4ucHJvdG90eXBlIGluc3RhbmNlb2YgR2VuZXJhdG9yID8gb3V0ZXJGbiA6IEdlbmVyYXRvcjtcbiAgICB2YXIgZ2VuZXJhdG9yID0gT2JqZWN0LmNyZWF0ZShwcm90b0dlbmVyYXRvci5wcm90b3R5cGUpO1xuICAgIHZhciBjb250ZXh0ID0gbmV3IENvbnRleHQodHJ5TG9jc0xpc3QgfHwgW10pO1xuXG4gICAgLy8gVGhlIC5faW52b2tlIG1ldGhvZCB1bmlmaWVzIHRoZSBpbXBsZW1lbnRhdGlvbnMgb2YgdGhlIC5uZXh0LFxuICAgIC8vIC50aHJvdywgYW5kIC5yZXR1cm4gbWV0aG9kcy5cbiAgICBnZW5lcmF0b3IuX2ludm9rZSA9IG1ha2VJbnZva2VNZXRob2QoaW5uZXJGbiwgc2VsZiwgY29udGV4dCk7XG5cbiAgICByZXR1cm4gZ2VuZXJhdG9yO1xuICB9XG4gIGV4cG9ydHMud3JhcCA9IHdyYXA7XG5cbiAgLy8gVHJ5L2NhdGNoIGhlbHBlciB0byBtaW5pbWl6ZSBkZW9wdGltaXphdGlvbnMuIFJldHVybnMgYSBjb21wbGV0aW9uXG4gIC8vIHJlY29yZCBsaWtlIGNvbnRleHQudHJ5RW50cmllc1tpXS5jb21wbGV0aW9uLiBUaGlzIGludGVyZmFjZSBjb3VsZFxuICAvLyBoYXZlIGJlZW4gKGFuZCB3YXMgcHJldmlvdXNseSkgZGVzaWduZWQgdG8gdGFrZSBhIGNsb3N1cmUgdG8gYmVcbiAgLy8gaW52b2tlZCB3aXRob3V0IGFyZ3VtZW50cywgYnV0IGluIGFsbCB0aGUgY2FzZXMgd2UgY2FyZSBhYm91dCB3ZVxuICAvLyBhbHJlYWR5IGhhdmUgYW4gZXhpc3RpbmcgbWV0aG9kIHdlIHdhbnQgdG8gY2FsbCwgc28gdGhlcmUncyBubyBuZWVkXG4gIC8vIHRvIGNyZWF0ZSBhIG5ldyBmdW5jdGlvbiBvYmplY3QuIFdlIGNhbiBldmVuIGdldCBhd2F5IHdpdGggYXNzdW1pbmdcbiAgLy8gdGhlIG1ldGhvZCB0YWtlcyBleGFjdGx5IG9uZSBhcmd1bWVudCwgc2luY2UgdGhhdCBoYXBwZW5zIHRvIGJlIHRydWVcbiAgLy8gaW4gZXZlcnkgY2FzZSwgc28gd2UgZG9uJ3QgaGF2ZSB0byB0b3VjaCB0aGUgYXJndW1lbnRzIG9iamVjdC4gVGhlXG4gIC8vIG9ubHkgYWRkaXRpb25hbCBhbGxvY2F0aW9uIHJlcXVpcmVkIGlzIHRoZSBjb21wbGV0aW9uIHJlY29yZCwgd2hpY2hcbiAgLy8gaGFzIGEgc3RhYmxlIHNoYXBlIGFuZCBzbyBob3BlZnVsbHkgc2hvdWxkIGJlIGNoZWFwIHRvIGFsbG9jYXRlLlxuICBmdW5jdGlvbiB0cnlDYXRjaChmbiwgb2JqLCBhcmcpIHtcbiAgICB0cnkge1xuICAgICAgcmV0dXJuIHsgdHlwZTogXCJub3JtYWxcIiwgYXJnOiBmbi5jYWxsKG9iaiwgYXJnKSB9O1xuICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgcmV0dXJuIHsgdHlwZTogXCJ0aHJvd1wiLCBhcmc6IGVyciB9O1xuICAgIH1cbiAgfVxuXG4gIHZhciBHZW5TdGF0ZVN1c3BlbmRlZFN0YXJ0ID0gXCJzdXNwZW5kZWRTdGFydFwiO1xuICB2YXIgR2VuU3RhdGVTdXNwZW5kZWRZaWVsZCA9IFwic3VzcGVuZGVkWWllbGRcIjtcbiAgdmFyIEdlblN0YXRlRXhlY3V0aW5nID0gXCJleGVjdXRpbmdcIjtcbiAgdmFyIEdlblN0YXRlQ29tcGxldGVkID0gXCJjb21wbGV0ZWRcIjtcblxuICAvLyBSZXR1cm5pbmcgdGhpcyBvYmplY3QgZnJvbSB0aGUgaW5uZXJGbiBoYXMgdGhlIHNhbWUgZWZmZWN0IGFzXG4gIC8vIGJyZWFraW5nIG91dCBvZiB0aGUgZGlzcGF0Y2ggc3dpdGNoIHN0YXRlbWVudC5cbiAgdmFyIENvbnRpbnVlU2VudGluZWwgPSB7fTtcblxuICAvLyBEdW1teSBjb25zdHJ1Y3RvciBmdW5jdGlvbnMgdGhhdCB3ZSB1c2UgYXMgdGhlIC5jb25zdHJ1Y3RvciBhbmRcbiAgLy8gLmNvbnN0cnVjdG9yLnByb3RvdHlwZSBwcm9wZXJ0aWVzIGZvciBmdW5jdGlvbnMgdGhhdCByZXR1cm4gR2VuZXJhdG9yXG4gIC8vIG9iamVjdHMuIEZvciBmdWxsIHNwZWMgY29tcGxpYW5jZSwgeW91IG1heSB3aXNoIHRvIGNvbmZpZ3VyZSB5b3VyXG4gIC8vIG1pbmlmaWVyIG5vdCB0byBtYW5nbGUgdGhlIG5hbWVzIG9mIHRoZXNlIHR3byBmdW5jdGlvbnMuXG4gIGZ1bmN0aW9uIEdlbmVyYXRvcigpIHt9XG4gIGZ1bmN0aW9uIEdlbmVyYXRvckZ1bmN0aW9uKCkge31cbiAgZnVuY3Rpb24gR2VuZXJhdG9yRnVuY3Rpb25Qcm90b3R5cGUoKSB7fVxuXG4gIC8vIFRoaXMgaXMgYSBwb2x5ZmlsbCBmb3IgJUl0ZXJhdG9yUHJvdG90eXBlJSBmb3IgZW52aXJvbm1lbnRzIHRoYXRcbiAgLy8gZG9uJ3QgbmF0aXZlbHkgc3VwcG9ydCBpdC5cbiAgdmFyIEl0ZXJhdG9yUHJvdG90eXBlID0ge307XG4gIEl0ZXJhdG9yUHJvdG90eXBlW2l0ZXJhdG9yU3ltYm9sXSA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gdGhpcztcbiAgfTtcblxuICB2YXIgZ2V0UHJvdG8gPSBPYmplY3QuZ2V0UHJvdG90eXBlT2Y7XG4gIHZhciBOYXRpdmVJdGVyYXRvclByb3RvdHlwZSA9IGdldFByb3RvICYmIGdldFByb3RvKGdldFByb3RvKHZhbHVlcyhbXSkpKTtcbiAgaWYgKE5hdGl2ZUl0ZXJhdG9yUHJvdG90eXBlICYmXG4gICAgICBOYXRpdmVJdGVyYXRvclByb3RvdHlwZSAhPT0gT3AgJiZcbiAgICAgIGhhc093bi5jYWxsKE5hdGl2ZUl0ZXJhdG9yUHJvdG90eXBlLCBpdGVyYXRvclN5bWJvbCkpIHtcbiAgICAvLyBUaGlzIGVudmlyb25tZW50IGhhcyBhIG5hdGl2ZSAlSXRlcmF0b3JQcm90b3R5cGUlOyB1c2UgaXQgaW5zdGVhZFxuICAgIC8vIG9mIHRoZSBwb2x5ZmlsbC5cbiAgICBJdGVyYXRvclByb3RvdHlwZSA9IE5hdGl2ZUl0ZXJhdG9yUHJvdG90eXBlO1xuICB9XG5cbiAgdmFyIEdwID0gR2VuZXJhdG9yRnVuY3Rpb25Qcm90b3R5cGUucHJvdG90eXBlID1cbiAgICBHZW5lcmF0b3IucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShJdGVyYXRvclByb3RvdHlwZSk7XG4gIEdlbmVyYXRvckZ1bmN0aW9uLnByb3RvdHlwZSA9IEdwLmNvbnN0cnVjdG9yID0gR2VuZXJhdG9yRnVuY3Rpb25Qcm90b3R5cGU7XG4gIEdlbmVyYXRvckZ1bmN0aW9uUHJvdG90eXBlLmNvbnN0cnVjdG9yID0gR2VuZXJhdG9yRnVuY3Rpb247XG4gIEdlbmVyYXRvckZ1bmN0aW9uUHJvdG90eXBlW3RvU3RyaW5nVGFnU3ltYm9sXSA9XG4gICAgR2VuZXJhdG9yRnVuY3Rpb24uZGlzcGxheU5hbWUgPSBcIkdlbmVyYXRvckZ1bmN0aW9uXCI7XG5cbiAgLy8gSGVscGVyIGZvciBkZWZpbmluZyB0aGUgLm5leHQsIC50aHJvdywgYW5kIC5yZXR1cm4gbWV0aG9kcyBvZiB0aGVcbiAgLy8gSXRlcmF0b3IgaW50ZXJmYWNlIGluIHRlcm1zIG9mIGEgc2luZ2xlIC5faW52b2tlIG1ldGhvZC5cbiAgZnVuY3Rpb24gZGVmaW5lSXRlcmF0b3JNZXRob2RzKHByb3RvdHlwZSkge1xuICAgIFtcIm5leHRcIiwgXCJ0aHJvd1wiLCBcInJldHVyblwiXS5mb3JFYWNoKGZ1bmN0aW9uKG1ldGhvZCkge1xuICAgICAgcHJvdG90eXBlW21ldGhvZF0gPSBmdW5jdGlvbihhcmcpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2ludm9rZShtZXRob2QsIGFyZyk7XG4gICAgICB9O1xuICAgIH0pO1xuICB9XG5cbiAgZXhwb3J0cy5pc0dlbmVyYXRvckZ1bmN0aW9uID0gZnVuY3Rpb24oZ2VuRnVuKSB7XG4gICAgdmFyIGN0b3IgPSB0eXBlb2YgZ2VuRnVuID09PSBcImZ1bmN0aW9uXCIgJiYgZ2VuRnVuLmNvbnN0cnVjdG9yO1xuICAgIHJldHVybiBjdG9yXG4gICAgICA/IGN0b3IgPT09IEdlbmVyYXRvckZ1bmN0aW9uIHx8XG4gICAgICAgIC8vIEZvciB0aGUgbmF0aXZlIEdlbmVyYXRvckZ1bmN0aW9uIGNvbnN0cnVjdG9yLCB0aGUgYmVzdCB3ZSBjYW5cbiAgICAgICAgLy8gZG8gaXMgdG8gY2hlY2sgaXRzIC5uYW1lIHByb3BlcnR5LlxuICAgICAgICAoY3Rvci5kaXNwbGF5TmFtZSB8fCBjdG9yLm5hbWUpID09PSBcIkdlbmVyYXRvckZ1bmN0aW9uXCJcbiAgICAgIDogZmFsc2U7XG4gIH07XG5cbiAgZXhwb3J0cy5tYXJrID0gZnVuY3Rpb24oZ2VuRnVuKSB7XG4gICAgaWYgKE9iamVjdC5zZXRQcm90b3R5cGVPZikge1xuICAgICAgT2JqZWN0LnNldFByb3RvdHlwZU9mKGdlbkZ1biwgR2VuZXJhdG9yRnVuY3Rpb25Qcm90b3R5cGUpO1xuICAgIH0gZWxzZSB7XG4gICAgICBnZW5GdW4uX19wcm90b19fID0gR2VuZXJhdG9yRnVuY3Rpb25Qcm90b3R5cGU7XG4gICAgICBpZiAoISh0b1N0cmluZ1RhZ1N5bWJvbCBpbiBnZW5GdW4pKSB7XG4gICAgICAgIGdlbkZ1blt0b1N0cmluZ1RhZ1N5bWJvbF0gPSBcIkdlbmVyYXRvckZ1bmN0aW9uXCI7XG4gICAgICB9XG4gICAgfVxuICAgIGdlbkZ1bi5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKEdwKTtcbiAgICByZXR1cm4gZ2VuRnVuO1xuICB9O1xuXG4gIC8vIFdpdGhpbiB0aGUgYm9keSBvZiBhbnkgYXN5bmMgZnVuY3Rpb24sIGBhd2FpdCB4YCBpcyB0cmFuc2Zvcm1lZCB0b1xuICAvLyBgeWllbGQgcmVnZW5lcmF0b3JSdW50aW1lLmF3cmFwKHgpYCwgc28gdGhhdCB0aGUgcnVudGltZSBjYW4gdGVzdFxuICAvLyBgaGFzT3duLmNhbGwodmFsdWUsIFwiX19hd2FpdFwiKWAgdG8gZGV0ZXJtaW5lIGlmIHRoZSB5aWVsZGVkIHZhbHVlIGlzXG4gIC8vIG1lYW50IHRvIGJlIGF3YWl0ZWQuXG4gIGV4cG9ydHMuYXdyYXAgPSBmdW5jdGlvbihhcmcpIHtcbiAgICByZXR1cm4geyBfX2F3YWl0OiBhcmcgfTtcbiAgfTtcblxuICBmdW5jdGlvbiBBc3luY0l0ZXJhdG9yKGdlbmVyYXRvcikge1xuICAgIGZ1bmN0aW9uIGludm9rZShtZXRob2QsIGFyZywgcmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICB2YXIgcmVjb3JkID0gdHJ5Q2F0Y2goZ2VuZXJhdG9yW21ldGhvZF0sIGdlbmVyYXRvciwgYXJnKTtcbiAgICAgIGlmIChyZWNvcmQudHlwZSA9PT0gXCJ0aHJvd1wiKSB7XG4gICAgICAgIHJlamVjdChyZWNvcmQuYXJnKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHZhciByZXN1bHQgPSByZWNvcmQuYXJnO1xuICAgICAgICB2YXIgdmFsdWUgPSByZXN1bHQudmFsdWU7XG4gICAgICAgIGlmICh2YWx1ZSAmJlxuICAgICAgICAgICAgdHlwZW9mIHZhbHVlID09PSBcIm9iamVjdFwiICYmXG4gICAgICAgICAgICBoYXNPd24uY2FsbCh2YWx1ZSwgXCJfX2F3YWl0XCIpKSB7XG4gICAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSh2YWx1ZS5fX2F3YWl0KS50aGVuKGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICAgICAgICBpbnZva2UoXCJuZXh0XCIsIHZhbHVlLCByZXNvbHZlLCByZWplY3QpO1xuICAgICAgICAgIH0sIGZ1bmN0aW9uKGVycikge1xuICAgICAgICAgICAgaW52b2tlKFwidGhyb3dcIiwgZXJyLCByZXNvbHZlLCByZWplY3QpO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSh2YWx1ZSkudGhlbihmdW5jdGlvbih1bndyYXBwZWQpIHtcbiAgICAgICAgICAvLyBXaGVuIGEgeWllbGRlZCBQcm9taXNlIGlzIHJlc29sdmVkLCBpdHMgZmluYWwgdmFsdWUgYmVjb21lc1xuICAgICAgICAgIC8vIHRoZSAudmFsdWUgb2YgdGhlIFByb21pc2U8e3ZhbHVlLGRvbmV9PiByZXN1bHQgZm9yIHRoZVxuICAgICAgICAgIC8vIGN1cnJlbnQgaXRlcmF0aW9uLlxuICAgICAgICAgIHJlc3VsdC52YWx1ZSA9IHVud3JhcHBlZDtcbiAgICAgICAgICByZXNvbHZlKHJlc3VsdCk7XG4gICAgICAgIH0sIGZ1bmN0aW9uKGVycm9yKSB7XG4gICAgICAgICAgLy8gSWYgYSByZWplY3RlZCBQcm9taXNlIHdhcyB5aWVsZGVkLCB0aHJvdyB0aGUgcmVqZWN0aW9uIGJhY2tcbiAgICAgICAgICAvLyBpbnRvIHRoZSBhc3luYyBnZW5lcmF0b3IgZnVuY3Rpb24gc28gaXQgY2FuIGJlIGhhbmRsZWQgdGhlcmUuXG4gICAgICAgICAgcmV0dXJuIGludm9rZShcInRocm93XCIsIGVycm9yLCByZXNvbHZlLCByZWplY3QpO1xuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICB2YXIgcHJldmlvdXNQcm9taXNlO1xuXG4gICAgZnVuY3Rpb24gZW5xdWV1ZShtZXRob2QsIGFyZykge1xuICAgICAgZnVuY3Rpb24gY2FsbEludm9rZVdpdGhNZXRob2RBbmRBcmcoKSB7XG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbihyZXNvbHZlLCByZWplY3QpIHtcbiAgICAgICAgICBpbnZva2UobWV0aG9kLCBhcmcsIHJlc29sdmUsIHJlamVjdCk7XG4gICAgICAgIH0pO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gcHJldmlvdXNQcm9taXNlID1cbiAgICAgICAgLy8gSWYgZW5xdWV1ZSBoYXMgYmVlbiBjYWxsZWQgYmVmb3JlLCB0aGVuIHdlIHdhbnQgdG8gd2FpdCB1bnRpbFxuICAgICAgICAvLyBhbGwgcHJldmlvdXMgUHJvbWlzZXMgaGF2ZSBiZWVuIHJlc29sdmVkIGJlZm9yZSBjYWxsaW5nIGludm9rZSxcbiAgICAgICAgLy8gc28gdGhhdCByZXN1bHRzIGFyZSBhbHdheXMgZGVsaXZlcmVkIGluIHRoZSBjb3JyZWN0IG9yZGVyLiBJZlxuICAgICAgICAvLyBlbnF1ZXVlIGhhcyBub3QgYmVlbiBjYWxsZWQgYmVmb3JlLCB0aGVuIGl0IGlzIGltcG9ydGFudCB0b1xuICAgICAgICAvLyBjYWxsIGludm9rZSBpbW1lZGlhdGVseSwgd2l0aG91dCB3YWl0aW5nIG9uIGEgY2FsbGJhY2sgdG8gZmlyZSxcbiAgICAgICAgLy8gc28gdGhhdCB0aGUgYXN5bmMgZ2VuZXJhdG9yIGZ1bmN0aW9uIGhhcyB0aGUgb3Bwb3J0dW5pdHkgdG8gZG9cbiAgICAgICAgLy8gYW55IG5lY2Vzc2FyeSBzZXR1cCBpbiBhIHByZWRpY3RhYmxlIHdheS4gVGhpcyBwcmVkaWN0YWJpbGl0eVxuICAgICAgICAvLyBpcyB3aHkgdGhlIFByb21pc2UgY29uc3RydWN0b3Igc3luY2hyb25vdXNseSBpbnZva2VzIGl0c1xuICAgICAgICAvLyBleGVjdXRvciBjYWxsYmFjaywgYW5kIHdoeSBhc3luYyBmdW5jdGlvbnMgc3luY2hyb25vdXNseVxuICAgICAgICAvLyBleGVjdXRlIGNvZGUgYmVmb3JlIHRoZSBmaXJzdCBhd2FpdC4gU2luY2Ugd2UgaW1wbGVtZW50IHNpbXBsZVxuICAgICAgICAvLyBhc3luYyBmdW5jdGlvbnMgaW4gdGVybXMgb2YgYXN5bmMgZ2VuZXJhdG9ycywgaXQgaXMgZXNwZWNpYWxseVxuICAgICAgICAvLyBpbXBvcnRhbnQgdG8gZ2V0IHRoaXMgcmlnaHQsIGV2ZW4gdGhvdWdoIGl0IHJlcXVpcmVzIGNhcmUuXG4gICAgICAgIHByZXZpb3VzUHJvbWlzZSA/IHByZXZpb3VzUHJvbWlzZS50aGVuKFxuICAgICAgICAgIGNhbGxJbnZva2VXaXRoTWV0aG9kQW5kQXJnLFxuICAgICAgICAgIC8vIEF2b2lkIHByb3BhZ2F0aW5nIGZhaWx1cmVzIHRvIFByb21pc2VzIHJldHVybmVkIGJ5IGxhdGVyXG4gICAgICAgICAgLy8gaW52b2NhdGlvbnMgb2YgdGhlIGl0ZXJhdG9yLlxuICAgICAgICAgIGNhbGxJbnZva2VXaXRoTWV0aG9kQW5kQXJnXG4gICAgICAgICkgOiBjYWxsSW52b2tlV2l0aE1ldGhvZEFuZEFyZygpO1xuICAgIH1cblxuICAgIC8vIERlZmluZSB0aGUgdW5pZmllZCBoZWxwZXIgbWV0aG9kIHRoYXQgaXMgdXNlZCB0byBpbXBsZW1lbnQgLm5leHQsXG4gICAgLy8gLnRocm93LCBhbmQgLnJldHVybiAoc2VlIGRlZmluZUl0ZXJhdG9yTWV0aG9kcykuXG4gICAgdGhpcy5faW52b2tlID0gZW5xdWV1ZTtcbiAgfVxuXG4gIGRlZmluZUl0ZXJhdG9yTWV0aG9kcyhBc3luY0l0ZXJhdG9yLnByb3RvdHlwZSk7XG4gIEFzeW5jSXRlcmF0b3IucHJvdG90eXBlW2FzeW5jSXRlcmF0b3JTeW1ib2xdID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB0aGlzO1xuICB9O1xuICBleHBvcnRzLkFzeW5jSXRlcmF0b3IgPSBBc3luY0l0ZXJhdG9yO1xuXG4gIC8vIE5vdGUgdGhhdCBzaW1wbGUgYXN5bmMgZnVuY3Rpb25zIGFyZSBpbXBsZW1lbnRlZCBvbiB0b3Agb2ZcbiAgLy8gQXN5bmNJdGVyYXRvciBvYmplY3RzOyB0aGV5IGp1c3QgcmV0dXJuIGEgUHJvbWlzZSBmb3IgdGhlIHZhbHVlIG9mXG4gIC8vIHRoZSBmaW5hbCByZXN1bHQgcHJvZHVjZWQgYnkgdGhlIGl0ZXJhdG9yLlxuICBleHBvcnRzLmFzeW5jID0gZnVuY3Rpb24oaW5uZXJGbiwgb3V0ZXJGbiwgc2VsZiwgdHJ5TG9jc0xpc3QpIHtcbiAgICB2YXIgaXRlciA9IG5ldyBBc3luY0l0ZXJhdG9yKFxuICAgICAgd3JhcChpbm5lckZuLCBvdXRlckZuLCBzZWxmLCB0cnlMb2NzTGlzdClcbiAgICApO1xuXG4gICAgcmV0dXJuIGV4cG9ydHMuaXNHZW5lcmF0b3JGdW5jdGlvbihvdXRlckZuKVxuICAgICAgPyBpdGVyIC8vIElmIG91dGVyRm4gaXMgYSBnZW5lcmF0b3IsIHJldHVybiB0aGUgZnVsbCBpdGVyYXRvci5cbiAgICAgIDogaXRlci5uZXh0KCkudGhlbihmdW5jdGlvbihyZXN1bHQpIHtcbiAgICAgICAgICByZXR1cm4gcmVzdWx0LmRvbmUgPyByZXN1bHQudmFsdWUgOiBpdGVyLm5leHQoKTtcbiAgICAgICAgfSk7XG4gIH07XG5cbiAgZnVuY3Rpb24gbWFrZUludm9rZU1ldGhvZChpbm5lckZuLCBzZWxmLCBjb250ZXh0KSB7XG4gICAgdmFyIHN0YXRlID0gR2VuU3RhdGVTdXNwZW5kZWRTdGFydDtcblxuICAgIHJldHVybiBmdW5jdGlvbiBpbnZva2UobWV0aG9kLCBhcmcpIHtcbiAgICAgIGlmIChzdGF0ZSA9PT0gR2VuU3RhdGVFeGVjdXRpbmcpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiR2VuZXJhdG9yIGlzIGFscmVhZHkgcnVubmluZ1wiKTtcbiAgICAgIH1cblxuICAgICAgaWYgKHN0YXRlID09PSBHZW5TdGF0ZUNvbXBsZXRlZCkge1xuICAgICAgICBpZiAobWV0aG9kID09PSBcInRocm93XCIpIHtcbiAgICAgICAgICB0aHJvdyBhcmc7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBCZSBmb3JnaXZpbmcsIHBlciAyNS4zLjMuMy4zIG9mIHRoZSBzcGVjOlxuICAgICAgICAvLyBodHRwczovL3Blb3BsZS5tb3ppbGxhLm9yZy9+am9yZW5kb3JmZi9lczYtZHJhZnQuaHRtbCNzZWMtZ2VuZXJhdG9ycmVzdW1lXG4gICAgICAgIHJldHVybiBkb25lUmVzdWx0KCk7XG4gICAgICB9XG5cbiAgICAgIGNvbnRleHQubWV0aG9kID0gbWV0aG9kO1xuICAgICAgY29udGV4dC5hcmcgPSBhcmc7XG5cbiAgICAgIHdoaWxlICh0cnVlKSB7XG4gICAgICAgIHZhciBkZWxlZ2F0ZSA9IGNvbnRleHQuZGVsZWdhdGU7XG4gICAgICAgIGlmIChkZWxlZ2F0ZSkge1xuICAgICAgICAgIHZhciBkZWxlZ2F0ZVJlc3VsdCA9IG1heWJlSW52b2tlRGVsZWdhdGUoZGVsZWdhdGUsIGNvbnRleHQpO1xuICAgICAgICAgIGlmIChkZWxlZ2F0ZVJlc3VsdCkge1xuICAgICAgICAgICAgaWYgKGRlbGVnYXRlUmVzdWx0ID09PSBDb250aW51ZVNlbnRpbmVsKSBjb250aW51ZTtcbiAgICAgICAgICAgIHJldHVybiBkZWxlZ2F0ZVJlc3VsdDtcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoY29udGV4dC5tZXRob2QgPT09IFwibmV4dFwiKSB7XG4gICAgICAgICAgLy8gU2V0dGluZyBjb250ZXh0Ll9zZW50IGZvciBsZWdhY3kgc3VwcG9ydCBvZiBCYWJlbCdzXG4gICAgICAgICAgLy8gZnVuY3Rpb24uc2VudCBpbXBsZW1lbnRhdGlvbi5cbiAgICAgICAgICBjb250ZXh0LnNlbnQgPSBjb250ZXh0Ll9zZW50ID0gY29udGV4dC5hcmc7XG5cbiAgICAgICAgfSBlbHNlIGlmIChjb250ZXh0Lm1ldGhvZCA9PT0gXCJ0aHJvd1wiKSB7XG4gICAgICAgICAgaWYgKHN0YXRlID09PSBHZW5TdGF0ZVN1c3BlbmRlZFN0YXJ0KSB7XG4gICAgICAgICAgICBzdGF0ZSA9IEdlblN0YXRlQ29tcGxldGVkO1xuICAgICAgICAgICAgdGhyb3cgY29udGV4dC5hcmc7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgY29udGV4dC5kaXNwYXRjaEV4Y2VwdGlvbihjb250ZXh0LmFyZyk7XG5cbiAgICAgICAgfSBlbHNlIGlmIChjb250ZXh0Lm1ldGhvZCA9PT0gXCJyZXR1cm5cIikge1xuICAgICAgICAgIGNvbnRleHQuYWJydXB0KFwicmV0dXJuXCIsIGNvbnRleHQuYXJnKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHN0YXRlID0gR2VuU3RhdGVFeGVjdXRpbmc7XG5cbiAgICAgICAgdmFyIHJlY29yZCA9IHRyeUNhdGNoKGlubmVyRm4sIHNlbGYsIGNvbnRleHQpO1xuICAgICAgICBpZiAocmVjb3JkLnR5cGUgPT09IFwibm9ybWFsXCIpIHtcbiAgICAgICAgICAvLyBJZiBhbiBleGNlcHRpb24gaXMgdGhyb3duIGZyb20gaW5uZXJGbiwgd2UgbGVhdmUgc3RhdGUgPT09XG4gICAgICAgICAgLy8gR2VuU3RhdGVFeGVjdXRpbmcgYW5kIGxvb3AgYmFjayBmb3IgYW5vdGhlciBpbnZvY2F0aW9uLlxuICAgICAgICAgIHN0YXRlID0gY29udGV4dC5kb25lXG4gICAgICAgICAgICA/IEdlblN0YXRlQ29tcGxldGVkXG4gICAgICAgICAgICA6IEdlblN0YXRlU3VzcGVuZGVkWWllbGQ7XG5cbiAgICAgICAgICBpZiAocmVjb3JkLmFyZyA9PT0gQ29udGludWVTZW50aW5lbCkge1xuICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHZhbHVlOiByZWNvcmQuYXJnLFxuICAgICAgICAgICAgZG9uZTogY29udGV4dC5kb25lXG4gICAgICAgICAgfTtcblxuICAgICAgICB9IGVsc2UgaWYgKHJlY29yZC50eXBlID09PSBcInRocm93XCIpIHtcbiAgICAgICAgICBzdGF0ZSA9IEdlblN0YXRlQ29tcGxldGVkO1xuICAgICAgICAgIC8vIERpc3BhdGNoIHRoZSBleGNlcHRpb24gYnkgbG9vcGluZyBiYWNrIGFyb3VuZCB0byB0aGVcbiAgICAgICAgICAvLyBjb250ZXh0LmRpc3BhdGNoRXhjZXB0aW9uKGNvbnRleHQuYXJnKSBjYWxsIGFib3ZlLlxuICAgICAgICAgIGNvbnRleHQubWV0aG9kID0gXCJ0aHJvd1wiO1xuICAgICAgICAgIGNvbnRleHQuYXJnID0gcmVjb3JkLmFyZztcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH07XG4gIH1cblxuICAvLyBDYWxsIGRlbGVnYXRlLml0ZXJhdG9yW2NvbnRleHQubWV0aG9kXShjb250ZXh0LmFyZykgYW5kIGhhbmRsZSB0aGVcbiAgLy8gcmVzdWx0LCBlaXRoZXIgYnkgcmV0dXJuaW5nIGEgeyB2YWx1ZSwgZG9uZSB9IHJlc3VsdCBmcm9tIHRoZVxuICAvLyBkZWxlZ2F0ZSBpdGVyYXRvciwgb3IgYnkgbW9kaWZ5aW5nIGNvbnRleHQubWV0aG9kIGFuZCBjb250ZXh0LmFyZyxcbiAgLy8gc2V0dGluZyBjb250ZXh0LmRlbGVnYXRlIHRvIG51bGwsIGFuZCByZXR1cm5pbmcgdGhlIENvbnRpbnVlU2VudGluZWwuXG4gIGZ1bmN0aW9uIG1heWJlSW52b2tlRGVsZWdhdGUoZGVsZWdhdGUsIGNvbnRleHQpIHtcbiAgICB2YXIgbWV0aG9kID0gZGVsZWdhdGUuaXRlcmF0b3JbY29udGV4dC5tZXRob2RdO1xuICAgIGlmIChtZXRob2QgPT09IHVuZGVmaW5lZCkge1xuICAgICAgLy8gQSAudGhyb3cgb3IgLnJldHVybiB3aGVuIHRoZSBkZWxlZ2F0ZSBpdGVyYXRvciBoYXMgbm8gLnRocm93XG4gICAgICAvLyBtZXRob2QgYWx3YXlzIHRlcm1pbmF0ZXMgdGhlIHlpZWxkKiBsb29wLlxuICAgICAgY29udGV4dC5kZWxlZ2F0ZSA9IG51bGw7XG5cbiAgICAgIGlmIChjb250ZXh0Lm1ldGhvZCA9PT0gXCJ0aHJvd1wiKSB7XG4gICAgICAgIC8vIE5vdGU6IFtcInJldHVyblwiXSBtdXN0IGJlIHVzZWQgZm9yIEVTMyBwYXJzaW5nIGNvbXBhdGliaWxpdHkuXG4gICAgICAgIGlmIChkZWxlZ2F0ZS5pdGVyYXRvcltcInJldHVyblwiXSkge1xuICAgICAgICAgIC8vIElmIHRoZSBkZWxlZ2F0ZSBpdGVyYXRvciBoYXMgYSByZXR1cm4gbWV0aG9kLCBnaXZlIGl0IGFcbiAgICAgICAgICAvLyBjaGFuY2UgdG8gY2xlYW4gdXAuXG4gICAgICAgICAgY29udGV4dC5tZXRob2QgPSBcInJldHVyblwiO1xuICAgICAgICAgIGNvbnRleHQuYXJnID0gdW5kZWZpbmVkO1xuICAgICAgICAgIG1heWJlSW52b2tlRGVsZWdhdGUoZGVsZWdhdGUsIGNvbnRleHQpO1xuXG4gICAgICAgICAgaWYgKGNvbnRleHQubWV0aG9kID09PSBcInRocm93XCIpIHtcbiAgICAgICAgICAgIC8vIElmIG1heWJlSW52b2tlRGVsZWdhdGUoY29udGV4dCkgY2hhbmdlZCBjb250ZXh0Lm1ldGhvZCBmcm9tXG4gICAgICAgICAgICAvLyBcInJldHVyblwiIHRvIFwidGhyb3dcIiwgbGV0IHRoYXQgb3ZlcnJpZGUgdGhlIFR5cGVFcnJvciBiZWxvdy5cbiAgICAgICAgICAgIHJldHVybiBDb250aW51ZVNlbnRpbmVsO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnRleHQubWV0aG9kID0gXCJ0aHJvd1wiO1xuICAgICAgICBjb250ZXh0LmFyZyA9IG5ldyBUeXBlRXJyb3IoXG4gICAgICAgICAgXCJUaGUgaXRlcmF0b3IgZG9lcyBub3QgcHJvdmlkZSBhICd0aHJvdycgbWV0aG9kXCIpO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gQ29udGludWVTZW50aW5lbDtcbiAgICB9XG5cbiAgICB2YXIgcmVjb3JkID0gdHJ5Q2F0Y2gobWV0aG9kLCBkZWxlZ2F0ZS5pdGVyYXRvciwgY29udGV4dC5hcmcpO1xuXG4gICAgaWYgKHJlY29yZC50eXBlID09PSBcInRocm93XCIpIHtcbiAgICAgIGNvbnRleHQubWV0aG9kID0gXCJ0aHJvd1wiO1xuICAgICAgY29udGV4dC5hcmcgPSByZWNvcmQuYXJnO1xuICAgICAgY29udGV4dC5kZWxlZ2F0ZSA9IG51bGw7XG4gICAgICByZXR1cm4gQ29udGludWVTZW50aW5lbDtcbiAgICB9XG5cbiAgICB2YXIgaW5mbyA9IHJlY29yZC5hcmc7XG5cbiAgICBpZiAoISBpbmZvKSB7XG4gICAgICBjb250ZXh0Lm1ldGhvZCA9IFwidGhyb3dcIjtcbiAgICAgIGNvbnRleHQuYXJnID0gbmV3IFR5cGVFcnJvcihcIml0ZXJhdG9yIHJlc3VsdCBpcyBub3QgYW4gb2JqZWN0XCIpO1xuICAgICAgY29udGV4dC5kZWxlZ2F0ZSA9IG51bGw7XG4gICAgICByZXR1cm4gQ29udGludWVTZW50aW5lbDtcbiAgICB9XG5cbiAgICBpZiAoaW5mby5kb25lKSB7XG4gICAgICAvLyBBc3NpZ24gdGhlIHJlc3VsdCBvZiB0aGUgZmluaXNoZWQgZGVsZWdhdGUgdG8gdGhlIHRlbXBvcmFyeVxuICAgICAgLy8gdmFyaWFibGUgc3BlY2lmaWVkIGJ5IGRlbGVnYXRlLnJlc3VsdE5hbWUgKHNlZSBkZWxlZ2F0ZVlpZWxkKS5cbiAgICAgIGNvbnRleHRbZGVsZWdhdGUucmVzdWx0TmFtZV0gPSBpbmZvLnZhbHVlO1xuXG4gICAgICAvLyBSZXN1bWUgZXhlY3V0aW9uIGF0IHRoZSBkZXNpcmVkIGxvY2F0aW9uIChzZWUgZGVsZWdhdGVZaWVsZCkuXG4gICAgICBjb250ZXh0Lm5leHQgPSBkZWxlZ2F0ZS5uZXh0TG9jO1xuXG4gICAgICAvLyBJZiBjb250ZXh0Lm1ldGhvZCB3YXMgXCJ0aHJvd1wiIGJ1dCB0aGUgZGVsZWdhdGUgaGFuZGxlZCB0aGVcbiAgICAgIC8vIGV4Y2VwdGlvbiwgbGV0IHRoZSBvdXRlciBnZW5lcmF0b3IgcHJvY2VlZCBub3JtYWxseS4gSWZcbiAgICAgIC8vIGNvbnRleHQubWV0aG9kIHdhcyBcIm5leHRcIiwgZm9yZ2V0IGNvbnRleHQuYXJnIHNpbmNlIGl0IGhhcyBiZWVuXG4gICAgICAvLyBcImNvbnN1bWVkXCIgYnkgdGhlIGRlbGVnYXRlIGl0ZXJhdG9yLiBJZiBjb250ZXh0Lm1ldGhvZCB3YXNcbiAgICAgIC8vIFwicmV0dXJuXCIsIGFsbG93IHRoZSBvcmlnaW5hbCAucmV0dXJuIGNhbGwgdG8gY29udGludWUgaW4gdGhlXG4gICAgICAvLyBvdXRlciBnZW5lcmF0b3IuXG4gICAgICBpZiAoY29udGV4dC5tZXRob2QgIT09IFwicmV0dXJuXCIpIHtcbiAgICAgICAgY29udGV4dC5tZXRob2QgPSBcIm5leHRcIjtcbiAgICAgICAgY29udGV4dC5hcmcgPSB1bmRlZmluZWQ7XG4gICAgICB9XG5cbiAgICB9IGVsc2Uge1xuICAgICAgLy8gUmUteWllbGQgdGhlIHJlc3VsdCByZXR1cm5lZCBieSB0aGUgZGVsZWdhdGUgbWV0aG9kLlxuICAgICAgcmV0dXJuIGluZm87XG4gICAgfVxuXG4gICAgLy8gVGhlIGRlbGVnYXRlIGl0ZXJhdG9yIGlzIGZpbmlzaGVkLCBzbyBmb3JnZXQgaXQgYW5kIGNvbnRpbnVlIHdpdGhcbiAgICAvLyB0aGUgb3V0ZXIgZ2VuZXJhdG9yLlxuICAgIGNvbnRleHQuZGVsZWdhdGUgPSBudWxsO1xuICAgIHJldHVybiBDb250aW51ZVNlbnRpbmVsO1xuICB9XG5cbiAgLy8gRGVmaW5lIEdlbmVyYXRvci5wcm90b3R5cGUue25leHQsdGhyb3cscmV0dXJufSBpbiB0ZXJtcyBvZiB0aGVcbiAgLy8gdW5pZmllZCAuX2ludm9rZSBoZWxwZXIgbWV0aG9kLlxuICBkZWZpbmVJdGVyYXRvck1ldGhvZHMoR3ApO1xuXG4gIEdwW3RvU3RyaW5nVGFnU3ltYm9sXSA9IFwiR2VuZXJhdG9yXCI7XG5cbiAgLy8gQSBHZW5lcmF0b3Igc2hvdWxkIGFsd2F5cyByZXR1cm4gaXRzZWxmIGFzIHRoZSBpdGVyYXRvciBvYmplY3Qgd2hlbiB0aGVcbiAgLy8gQEBpdGVyYXRvciBmdW5jdGlvbiBpcyBjYWxsZWQgb24gaXQuIFNvbWUgYnJvd3NlcnMnIGltcGxlbWVudGF0aW9ucyBvZiB0aGVcbiAgLy8gaXRlcmF0b3IgcHJvdG90eXBlIGNoYWluIGluY29ycmVjdGx5IGltcGxlbWVudCB0aGlzLCBjYXVzaW5nIHRoZSBHZW5lcmF0b3JcbiAgLy8gb2JqZWN0IHRvIG5vdCBiZSByZXR1cm5lZCBmcm9tIHRoaXMgY2FsbC4gVGhpcyBlbnN1cmVzIHRoYXQgZG9lc24ndCBoYXBwZW4uXG4gIC8vIFNlZSBodHRwczovL2dpdGh1Yi5jb20vZmFjZWJvb2svcmVnZW5lcmF0b3IvaXNzdWVzLzI3NCBmb3IgbW9yZSBkZXRhaWxzLlxuICBHcFtpdGVyYXRvclN5bWJvbF0gPSBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gdGhpcztcbiAgfTtcblxuICBHcC50b1N0cmluZyA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBcIltvYmplY3QgR2VuZXJhdG9yXVwiO1xuICB9O1xuXG4gIGZ1bmN0aW9uIHB1c2hUcnlFbnRyeShsb2NzKSB7XG4gICAgdmFyIGVudHJ5ID0geyB0cnlMb2M6IGxvY3NbMF0gfTtcblxuICAgIGlmICgxIGluIGxvY3MpIHtcbiAgICAgIGVudHJ5LmNhdGNoTG9jID0gbG9jc1sxXTtcbiAgICB9XG5cbiAgICBpZiAoMiBpbiBsb2NzKSB7XG4gICAgICBlbnRyeS5maW5hbGx5TG9jID0gbG9jc1syXTtcbiAgICAgIGVudHJ5LmFmdGVyTG9jID0gbG9jc1szXTtcbiAgICB9XG5cbiAgICB0aGlzLnRyeUVudHJpZXMucHVzaChlbnRyeSk7XG4gIH1cblxuICBmdW5jdGlvbiByZXNldFRyeUVudHJ5KGVudHJ5KSB7XG4gICAgdmFyIHJlY29yZCA9IGVudHJ5LmNvbXBsZXRpb24gfHwge307XG4gICAgcmVjb3JkLnR5cGUgPSBcIm5vcm1hbFwiO1xuICAgIGRlbGV0ZSByZWNvcmQuYXJnO1xuICAgIGVudHJ5LmNvbXBsZXRpb24gPSByZWNvcmQ7XG4gIH1cblxuICBmdW5jdGlvbiBDb250ZXh0KHRyeUxvY3NMaXN0KSB7XG4gICAgLy8gVGhlIHJvb3QgZW50cnkgb2JqZWN0IChlZmZlY3RpdmVseSBhIHRyeSBzdGF0ZW1lbnQgd2l0aG91dCBhIGNhdGNoXG4gICAgLy8gb3IgYSBmaW5hbGx5IGJsb2NrKSBnaXZlcyB1cyBhIHBsYWNlIHRvIHN0b3JlIHZhbHVlcyB0aHJvd24gZnJvbVxuICAgIC8vIGxvY2F0aW9ucyB3aGVyZSB0aGVyZSBpcyBubyBlbmNsb3NpbmcgdHJ5IHN0YXRlbWVudC5cbiAgICB0aGlzLnRyeUVudHJpZXMgPSBbeyB0cnlMb2M6IFwicm9vdFwiIH1dO1xuICAgIHRyeUxvY3NMaXN0LmZvckVhY2gocHVzaFRyeUVudHJ5LCB0aGlzKTtcbiAgICB0aGlzLnJlc2V0KHRydWUpO1xuICB9XG5cbiAgZXhwb3J0cy5rZXlzID0gZnVuY3Rpb24ob2JqZWN0KSB7XG4gICAgdmFyIGtleXMgPSBbXTtcbiAgICBmb3IgKHZhciBrZXkgaW4gb2JqZWN0KSB7XG4gICAgICBrZXlzLnB1c2goa2V5KTtcbiAgICB9XG4gICAga2V5cy5yZXZlcnNlKCk7XG5cbiAgICAvLyBSYXRoZXIgdGhhbiByZXR1cm5pbmcgYW4gb2JqZWN0IHdpdGggYSBuZXh0IG1ldGhvZCwgd2Uga2VlcFxuICAgIC8vIHRoaW5ncyBzaW1wbGUgYW5kIHJldHVybiB0aGUgbmV4dCBmdW5jdGlvbiBpdHNlbGYuXG4gICAgcmV0dXJuIGZ1bmN0aW9uIG5leHQoKSB7XG4gICAgICB3aGlsZSAoa2V5cy5sZW5ndGgpIHtcbiAgICAgICAgdmFyIGtleSA9IGtleXMucG9wKCk7XG4gICAgICAgIGlmIChrZXkgaW4gb2JqZWN0KSB7XG4gICAgICAgICAgbmV4dC52YWx1ZSA9IGtleTtcbiAgICAgICAgICBuZXh0LmRvbmUgPSBmYWxzZTtcbiAgICAgICAgICByZXR1cm4gbmV4dDtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICAvLyBUbyBhdm9pZCBjcmVhdGluZyBhbiBhZGRpdGlvbmFsIG9iamVjdCwgd2UganVzdCBoYW5nIHRoZSAudmFsdWVcbiAgICAgIC8vIGFuZCAuZG9uZSBwcm9wZXJ0aWVzIG9mZiB0aGUgbmV4dCBmdW5jdGlvbiBvYmplY3QgaXRzZWxmLiBUaGlzXG4gICAgICAvLyBhbHNvIGVuc3VyZXMgdGhhdCB0aGUgbWluaWZpZXIgd2lsbCBub3QgYW5vbnltaXplIHRoZSBmdW5jdGlvbi5cbiAgICAgIG5leHQuZG9uZSA9IHRydWU7XG4gICAgICByZXR1cm4gbmV4dDtcbiAgICB9O1xuICB9O1xuXG4gIGZ1bmN0aW9uIHZhbHVlcyhpdGVyYWJsZSkge1xuICAgIGlmIChpdGVyYWJsZSkge1xuICAgICAgdmFyIGl0ZXJhdG9yTWV0aG9kID0gaXRlcmFibGVbaXRlcmF0b3JTeW1ib2xdO1xuICAgICAgaWYgKGl0ZXJhdG9yTWV0aG9kKSB7XG4gICAgICAgIHJldHVybiBpdGVyYXRvck1ldGhvZC5jYWxsKGl0ZXJhYmxlKTtcbiAgICAgIH1cblxuICAgICAgaWYgKHR5cGVvZiBpdGVyYWJsZS5uZXh0ID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgcmV0dXJuIGl0ZXJhYmxlO1xuICAgICAgfVxuXG4gICAgICBpZiAoIWlzTmFOKGl0ZXJhYmxlLmxlbmd0aCkpIHtcbiAgICAgICAgdmFyIGkgPSAtMSwgbmV4dCA9IGZ1bmN0aW9uIG5leHQoKSB7XG4gICAgICAgICAgd2hpbGUgKCsraSA8IGl0ZXJhYmxlLmxlbmd0aCkge1xuICAgICAgICAgICAgaWYgKGhhc093bi5jYWxsKGl0ZXJhYmxlLCBpKSkge1xuICAgICAgICAgICAgICBuZXh0LnZhbHVlID0gaXRlcmFibGVbaV07XG4gICAgICAgICAgICAgIG5leHQuZG9uZSA9IGZhbHNlO1xuICAgICAgICAgICAgICByZXR1cm4gbmV4dDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG5cbiAgICAgICAgICBuZXh0LnZhbHVlID0gdW5kZWZpbmVkO1xuICAgICAgICAgIG5leHQuZG9uZSA9IHRydWU7XG5cbiAgICAgICAgICByZXR1cm4gbmV4dDtcbiAgICAgICAgfTtcblxuICAgICAgICByZXR1cm4gbmV4dC5uZXh0ID0gbmV4dDtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBSZXR1cm4gYW4gaXRlcmF0b3Igd2l0aCBubyB2YWx1ZXMuXG4gICAgcmV0dXJuIHsgbmV4dDogZG9uZVJlc3VsdCB9O1xuICB9XG4gIGV4cG9ydHMudmFsdWVzID0gdmFsdWVzO1xuXG4gIGZ1bmN0aW9uIGRvbmVSZXN1bHQoKSB7XG4gICAgcmV0dXJuIHsgdmFsdWU6IHVuZGVmaW5lZCwgZG9uZTogdHJ1ZSB9O1xuICB9XG5cbiAgQ29udGV4dC5wcm90b3R5cGUgPSB7XG4gICAgY29uc3RydWN0b3I6IENvbnRleHQsXG5cbiAgICByZXNldDogZnVuY3Rpb24oc2tpcFRlbXBSZXNldCkge1xuICAgICAgdGhpcy5wcmV2ID0gMDtcbiAgICAgIHRoaXMubmV4dCA9IDA7XG4gICAgICAvLyBSZXNldHRpbmcgY29udGV4dC5fc2VudCBmb3IgbGVnYWN5IHN1cHBvcnQgb2YgQmFiZWwnc1xuICAgICAgLy8gZnVuY3Rpb24uc2VudCBpbXBsZW1lbnRhdGlvbi5cbiAgICAgIHRoaXMuc2VudCA9IHRoaXMuX3NlbnQgPSB1bmRlZmluZWQ7XG4gICAgICB0aGlzLmRvbmUgPSBmYWxzZTtcbiAgICAgIHRoaXMuZGVsZWdhdGUgPSBudWxsO1xuXG4gICAgICB0aGlzLm1ldGhvZCA9IFwibmV4dFwiO1xuICAgICAgdGhpcy5hcmcgPSB1bmRlZmluZWQ7XG5cbiAgICAgIHRoaXMudHJ5RW50cmllcy5mb3JFYWNoKHJlc2V0VHJ5RW50cnkpO1xuXG4gICAgICBpZiAoIXNraXBUZW1wUmVzZXQpIHtcbiAgICAgICAgZm9yICh2YXIgbmFtZSBpbiB0aGlzKSB7XG4gICAgICAgICAgLy8gTm90IHN1cmUgYWJvdXQgdGhlIG9wdGltYWwgb3JkZXIgb2YgdGhlc2UgY29uZGl0aW9uczpcbiAgICAgICAgICBpZiAobmFtZS5jaGFyQXQoMCkgPT09IFwidFwiICYmXG4gICAgICAgICAgICAgIGhhc093bi5jYWxsKHRoaXMsIG5hbWUpICYmXG4gICAgICAgICAgICAgICFpc05hTigrbmFtZS5zbGljZSgxKSkpIHtcbiAgICAgICAgICAgIHRoaXNbbmFtZV0gPSB1bmRlZmluZWQ7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfSxcblxuICAgIHN0b3A6IGZ1bmN0aW9uKCkge1xuICAgICAgdGhpcy5kb25lID0gdHJ1ZTtcblxuICAgICAgdmFyIHJvb3RFbnRyeSA9IHRoaXMudHJ5RW50cmllc1swXTtcbiAgICAgIHZhciByb290UmVjb3JkID0gcm9vdEVudHJ5LmNvbXBsZXRpb247XG4gICAgICBpZiAocm9vdFJlY29yZC50eXBlID09PSBcInRocm93XCIpIHtcbiAgICAgICAgdGhyb3cgcm9vdFJlY29yZC5hcmc7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiB0aGlzLnJ2YWw7XG4gICAgfSxcblxuICAgIGRpc3BhdGNoRXhjZXB0aW9uOiBmdW5jdGlvbihleGNlcHRpb24pIHtcbiAgICAgIGlmICh0aGlzLmRvbmUpIHtcbiAgICAgICAgdGhyb3cgZXhjZXB0aW9uO1xuICAgICAgfVxuXG4gICAgICB2YXIgY29udGV4dCA9IHRoaXM7XG4gICAgICBmdW5jdGlvbiBoYW5kbGUobG9jLCBjYXVnaHQpIHtcbiAgICAgICAgcmVjb3JkLnR5cGUgPSBcInRocm93XCI7XG4gICAgICAgIHJlY29yZC5hcmcgPSBleGNlcHRpb247XG4gICAgICAgIGNvbnRleHQubmV4dCA9IGxvYztcblxuICAgICAgICBpZiAoY2F1Z2h0KSB7XG4gICAgICAgICAgLy8gSWYgdGhlIGRpc3BhdGNoZWQgZXhjZXB0aW9uIHdhcyBjYXVnaHQgYnkgYSBjYXRjaCBibG9jayxcbiAgICAgICAgICAvLyB0aGVuIGxldCB0aGF0IGNhdGNoIGJsb2NrIGhhbmRsZSB0aGUgZXhjZXB0aW9uIG5vcm1hbGx5LlxuICAgICAgICAgIGNvbnRleHQubWV0aG9kID0gXCJuZXh0XCI7XG4gICAgICAgICAgY29udGV4dC5hcmcgPSB1bmRlZmluZWQ7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gISEgY2F1Z2h0O1xuICAgICAgfVxuXG4gICAgICBmb3IgKHZhciBpID0gdGhpcy50cnlFbnRyaWVzLmxlbmd0aCAtIDE7IGkgPj0gMDsgLS1pKSB7XG4gICAgICAgIHZhciBlbnRyeSA9IHRoaXMudHJ5RW50cmllc1tpXTtcbiAgICAgICAgdmFyIHJlY29yZCA9IGVudHJ5LmNvbXBsZXRpb247XG5cbiAgICAgICAgaWYgKGVudHJ5LnRyeUxvYyA9PT0gXCJyb290XCIpIHtcbiAgICAgICAgICAvLyBFeGNlcHRpb24gdGhyb3duIG91dHNpZGUgb2YgYW55IHRyeSBibG9jayB0aGF0IGNvdWxkIGhhbmRsZVxuICAgICAgICAgIC8vIGl0LCBzbyBzZXQgdGhlIGNvbXBsZXRpb24gdmFsdWUgb2YgdGhlIGVudGlyZSBmdW5jdGlvbiB0b1xuICAgICAgICAgIC8vIHRocm93IHRoZSBleGNlcHRpb24uXG4gICAgICAgICAgcmV0dXJuIGhhbmRsZShcImVuZFwiKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChlbnRyeS50cnlMb2MgPD0gdGhpcy5wcmV2KSB7XG4gICAgICAgICAgdmFyIGhhc0NhdGNoID0gaGFzT3duLmNhbGwoZW50cnksIFwiY2F0Y2hMb2NcIik7XG4gICAgICAgICAgdmFyIGhhc0ZpbmFsbHkgPSBoYXNPd24uY2FsbChlbnRyeSwgXCJmaW5hbGx5TG9jXCIpO1xuXG4gICAgICAgICAgaWYgKGhhc0NhdGNoICYmIGhhc0ZpbmFsbHkpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLnByZXYgPCBlbnRyeS5jYXRjaExvYykge1xuICAgICAgICAgICAgICByZXR1cm4gaGFuZGxlKGVudHJ5LmNhdGNoTG9jLCB0cnVlKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAodGhpcy5wcmV2IDwgZW50cnkuZmluYWxseUxvYykge1xuICAgICAgICAgICAgICByZXR1cm4gaGFuZGxlKGVudHJ5LmZpbmFsbHlMb2MpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgfSBlbHNlIGlmIChoYXNDYXRjaCkge1xuICAgICAgICAgICAgaWYgKHRoaXMucHJldiA8IGVudHJ5LmNhdGNoTG9jKSB7XG4gICAgICAgICAgICAgIHJldHVybiBoYW5kbGUoZW50cnkuY2F0Y2hMb2MsIHRydWUpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgfSBlbHNlIGlmIChoYXNGaW5hbGx5KSB7XG4gICAgICAgICAgICBpZiAodGhpcy5wcmV2IDwgZW50cnkuZmluYWxseUxvYykge1xuICAgICAgICAgICAgICByZXR1cm4gaGFuZGxlKGVudHJ5LmZpbmFsbHlMb2MpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcInRyeSBzdGF0ZW1lbnQgd2l0aG91dCBjYXRjaCBvciBmaW5hbGx5XCIpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0sXG5cbiAgICBhYnJ1cHQ6IGZ1bmN0aW9uKHR5cGUsIGFyZykge1xuICAgICAgZm9yICh2YXIgaSA9IHRoaXMudHJ5RW50cmllcy5sZW5ndGggLSAxOyBpID49IDA7IC0taSkge1xuICAgICAgICB2YXIgZW50cnkgPSB0aGlzLnRyeUVudHJpZXNbaV07XG4gICAgICAgIGlmIChlbnRyeS50cnlMb2MgPD0gdGhpcy5wcmV2ICYmXG4gICAgICAgICAgICBoYXNPd24uY2FsbChlbnRyeSwgXCJmaW5hbGx5TG9jXCIpICYmXG4gICAgICAgICAgICB0aGlzLnByZXYgPCBlbnRyeS5maW5hbGx5TG9jKSB7XG4gICAgICAgICAgdmFyIGZpbmFsbHlFbnRyeSA9IGVudHJ5O1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGlmIChmaW5hbGx5RW50cnkgJiZcbiAgICAgICAgICAodHlwZSA9PT0gXCJicmVha1wiIHx8XG4gICAgICAgICAgIHR5cGUgPT09IFwiY29udGludWVcIikgJiZcbiAgICAgICAgICBmaW5hbGx5RW50cnkudHJ5TG9jIDw9IGFyZyAmJlxuICAgICAgICAgIGFyZyA8PSBmaW5hbGx5RW50cnkuZmluYWxseUxvYykge1xuICAgICAgICAvLyBJZ25vcmUgdGhlIGZpbmFsbHkgZW50cnkgaWYgY29udHJvbCBpcyBub3QganVtcGluZyB0byBhXG4gICAgICAgIC8vIGxvY2F0aW9uIG91dHNpZGUgdGhlIHRyeS9jYXRjaCBibG9jay5cbiAgICAgICAgZmluYWxseUVudHJ5ID0gbnVsbDtcbiAgICAgIH1cblxuICAgICAgdmFyIHJlY29yZCA9IGZpbmFsbHlFbnRyeSA/IGZpbmFsbHlFbnRyeS5jb21wbGV0aW9uIDoge307XG4gICAgICByZWNvcmQudHlwZSA9IHR5cGU7XG4gICAgICByZWNvcmQuYXJnID0gYXJnO1xuXG4gICAgICBpZiAoZmluYWxseUVudHJ5KSB7XG4gICAgICAgIHRoaXMubWV0aG9kID0gXCJuZXh0XCI7XG4gICAgICAgIHRoaXMubmV4dCA9IGZpbmFsbHlFbnRyeS5maW5hbGx5TG9jO1xuICAgICAgICByZXR1cm4gQ29udGludWVTZW50aW5lbDtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHRoaXMuY29tcGxldGUocmVjb3JkKTtcbiAgICB9LFxuXG4gICAgY29tcGxldGU6IGZ1bmN0aW9uKHJlY29yZCwgYWZ0ZXJMb2MpIHtcbiAgICAgIGlmIChyZWNvcmQudHlwZSA9PT0gXCJ0aHJvd1wiKSB7XG4gICAgICAgIHRocm93IHJlY29yZC5hcmc7XG4gICAgICB9XG5cbiAgICAgIGlmIChyZWNvcmQudHlwZSA9PT0gXCJicmVha1wiIHx8XG4gICAgICAgICAgcmVjb3JkLnR5cGUgPT09IFwiY29udGludWVcIikge1xuICAgICAgICB0aGlzLm5leHQgPSByZWNvcmQuYXJnO1xuICAgICAgfSBlbHNlIGlmIChyZWNvcmQudHlwZSA9PT0gXCJyZXR1cm5cIikge1xuICAgICAgICB0aGlzLnJ2YWwgPSB0aGlzLmFyZyA9IHJlY29yZC5hcmc7XG4gICAgICAgIHRoaXMubWV0aG9kID0gXCJyZXR1cm5cIjtcbiAgICAgICAgdGhpcy5uZXh0ID0gXCJlbmRcIjtcbiAgICAgIH0gZWxzZSBpZiAocmVjb3JkLnR5cGUgPT09IFwibm9ybWFsXCIgJiYgYWZ0ZXJMb2MpIHtcbiAgICAgICAgdGhpcy5uZXh0ID0gYWZ0ZXJMb2M7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBDb250aW51ZVNlbnRpbmVsO1xuICAgIH0sXG5cbiAgICBmaW5pc2g6IGZ1bmN0aW9uKGZpbmFsbHlMb2MpIHtcbiAgICAgIGZvciAodmFyIGkgPSB0aGlzLnRyeUVudHJpZXMubGVuZ3RoIC0gMTsgaSA+PSAwOyAtLWkpIHtcbiAgICAgICAgdmFyIGVudHJ5ID0gdGhpcy50cnlFbnRyaWVzW2ldO1xuICAgICAgICBpZiAoZW50cnkuZmluYWxseUxvYyA9PT0gZmluYWxseUxvYykge1xuICAgICAgICAgIHRoaXMuY29tcGxldGUoZW50cnkuY29tcGxldGlvbiwgZW50cnkuYWZ0ZXJMb2MpO1xuICAgICAgICAgIHJlc2V0VHJ5RW50cnkoZW50cnkpO1xuICAgICAgICAgIHJldHVybiBDb250aW51ZVNlbnRpbmVsO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSxcblxuICAgIFwiY2F0Y2hcIjogZnVuY3Rpb24odHJ5TG9jKSB7XG4gICAgICBmb3IgKHZhciBpID0gdGhpcy50cnlFbnRyaWVzLmxlbmd0aCAtIDE7IGkgPj0gMDsgLS1pKSB7XG4gICAgICAgIHZhciBlbnRyeSA9IHRoaXMudHJ5RW50cmllc1tpXTtcbiAgICAgICAgaWYgKGVudHJ5LnRyeUxvYyA9PT0gdHJ5TG9jKSB7XG4gICAgICAgICAgdmFyIHJlY29yZCA9IGVudHJ5LmNvbXBsZXRpb247XG4gICAgICAgICAgaWYgKHJlY29yZC50eXBlID09PSBcInRocm93XCIpIHtcbiAgICAgICAgICAgIHZhciB0aHJvd24gPSByZWNvcmQuYXJnO1xuICAgICAgICAgICAgcmVzZXRUcnlFbnRyeShlbnRyeSk7XG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiB0aHJvd247XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgLy8gVGhlIGNvbnRleHQuY2F0Y2ggbWV0aG9kIG11c3Qgb25seSBiZSBjYWxsZWQgd2l0aCBhIGxvY2F0aW9uXG4gICAgICAvLyBhcmd1bWVudCB0aGF0IGNvcnJlc3BvbmRzIHRvIGEga25vd24gY2F0Y2ggYmxvY2suXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXCJpbGxlZ2FsIGNhdGNoIGF0dGVtcHRcIik7XG4gICAgfSxcblxuICAgIGRlbGVnYXRlWWllbGQ6IGZ1bmN0aW9uKGl0ZXJhYmxlLCByZXN1bHROYW1lLCBuZXh0TG9jKSB7XG4gICAgICB0aGlzLmRlbGVnYXRlID0ge1xuICAgICAgICBpdGVyYXRvcjogdmFsdWVzKGl0ZXJhYmxlKSxcbiAgICAgICAgcmVzdWx0TmFtZTogcmVzdWx0TmFtZSxcbiAgICAgICAgbmV4dExvYzogbmV4dExvY1xuICAgICAgfTtcblxuICAgICAgaWYgKHRoaXMubWV0aG9kID09PSBcIm5leHRcIikge1xuICAgICAgICAvLyBEZWxpYmVyYXRlbHkgZm9yZ2V0IHRoZSBsYXN0IHNlbnQgdmFsdWUgc28gdGhhdCB3ZSBkb24ndFxuICAgICAgICAvLyBhY2NpZGVudGFsbHkgcGFzcyBpdCBvbiB0byB0aGUgZGVsZWdhdGUuXG4gICAgICAgIHRoaXMuYXJnID0gdW5kZWZpbmVkO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gQ29udGludWVTZW50aW5lbDtcbiAgICB9XG4gIH07XG5cbiAgLy8gUmVnYXJkbGVzcyBvZiB3aGV0aGVyIHRoaXMgc2NyaXB0IGlzIGV4ZWN1dGluZyBhcyBhIENvbW1vbkpTIG1vZHVsZVxuICAvLyBvciBub3QsIHJldHVybiB0aGUgcnVudGltZSBvYmplY3Qgc28gdGhhdCB3ZSBjYW4gZGVjbGFyZSB0aGUgdmFyaWFibGVcbiAgLy8gcmVnZW5lcmF0b3JSdW50aW1lIGluIHRoZSBvdXRlciBzY29wZSwgd2hpY2ggYWxsb3dzIHRoaXMgbW9kdWxlIHRvIGJlXG4gIC8vIGluamVjdGVkIGVhc2lseSBieSBgYmluL3JlZ2VuZXJhdG9yIC0taW5jbHVkZS1ydW50aW1lIHNjcmlwdC5qc2AuXG4gIHJldHVybiBleHBvcnRzO1xuXG59KFxuICAvLyBJZiB0aGlzIHNjcmlwdCBpcyBleGVjdXRpbmcgYXMgYSBDb21tb25KUyBtb2R1bGUsIHVzZSBtb2R1bGUuZXhwb3J0c1xuICAvLyBhcyB0aGUgcmVnZW5lcmF0b3JSdW50aW1lIG5hbWVzcGFjZS4gT3RoZXJ3aXNlIGNyZWF0ZSBhIG5ldyBlbXB0eVxuICAvLyBvYmplY3QuIEVpdGhlciB3YXksIHRoZSByZXN1bHRpbmcgb2JqZWN0IHdpbGwgYmUgdXNlZCB0byBpbml0aWFsaXplXG4gIC8vIHRoZSByZWdlbmVyYXRvclJ1bnRpbWUgdmFyaWFibGUgYXQgdGhlIHRvcCBvZiB0aGlzIGZpbGUuXG4gIHR5cGVvZiBtb2R1bGUgPT09IFwib2JqZWN0XCIgPyBtb2R1bGUuZXhwb3J0cyA6IHt9XG4pKTtcblxudHJ5IHtcbiAgcmVnZW5lcmF0b3JSdW50aW1lID0gcnVudGltZTtcbn0gY2F0Y2ggKGFjY2lkZW50YWxTdHJpY3RNb2RlKSB7XG4gIC8vIFRoaXMgbW9kdWxlIHNob3VsZCBub3QgYmUgcnVubmluZyBpbiBzdHJpY3QgbW9kZSwgc28gdGhlIGFib3ZlXG4gIC8vIGFzc2lnbm1lbnQgc2hvdWxkIGFsd2F5cyB3b3JrIHVubGVzcyBzb21ldGhpbmcgaXMgbWlzY29uZmlndXJlZC4gSnVzdFxuICAvLyBpbiBjYXNlIHJ1bnRpbWUuanMgYWNjaWRlbnRhbGx5IHJ1bnMgaW4gc3RyaWN0IG1vZGUsIHdlIGNhbiBlc2NhcGVcbiAgLy8gc3RyaWN0IG1vZGUgdXNpbmcgYSBnbG9iYWwgRnVuY3Rpb24gY2FsbC4gVGhpcyBjb3VsZCBjb25jZWl2YWJseSBmYWlsXG4gIC8vIGlmIGEgQ29udGVudCBTZWN1cml0eSBQb2xpY3kgZm9yYmlkcyB1c2luZyBGdW5jdGlvbiwgYnV0IGluIHRoYXQgY2FzZVxuICAvLyB0aGUgcHJvcGVyIHNvbHV0aW9uIGlzIHRvIGZpeCB0aGUgYWNjaWRlbnRhbCBzdHJpY3QgbW9kZSBwcm9ibGVtLiBJZlxuICAvLyB5b3UndmUgbWlzY29uZmlndXJlZCB5b3VyIGJ1bmRsZXIgdG8gZm9yY2Ugc3RyaWN0IG1vZGUgYW5kIGFwcGxpZWQgYVxuICAvLyBDU1AgdG8gZm9yYmlkIEZ1bmN0aW9uLCBhbmQgeW91J3JlIG5vdCB3aWxsaW5nIHRvIGZpeCBlaXRoZXIgb2YgdGhvc2VcbiAgLy8gcHJvYmxlbXMsIHBsZWFzZSBkZXRhaWwgeW91ciB1bmlxdWUgcHJlZGljYW1lbnQgaW4gYSBHaXRIdWIgaXNzdWUuXG4gIEZ1bmN0aW9uKFwiclwiLCBcInJlZ2VuZXJhdG9yUnVudGltZSA9IHJcIikocnVudGltZSk7XG59XG4iXSwibmFtZXMiOlsicnVudGltZSIsImV4cG9ydHMiLCJPcCIsIk9iamVjdCIsInByb3RvdHlwZSIsImhhc093biIsImhhc093blByb3BlcnR5IiwidW5kZWZpbmVkIiwiJFN5bWJvbCIsIlN5bWJvbCIsIml0ZXJhdG9yU3ltYm9sIiwiaXRlcmF0b3IiLCJhc3luY0l0ZXJhdG9yU3ltYm9sIiwiYXN5bmNJdGVyYXRvciIsInRvU3RyaW5nVGFnU3ltYm9sIiwidG9TdHJpbmdUYWciLCJ3cmFwIiwiaW5uZXJGbiIsIm91dGVyRm4iLCJzZWxmIiwidHJ5TG9jc0xpc3QiLCJwcm90b0dlbmVyYXRvciIsIkdlbmVyYXRvciIsImdlbmVyYXRvciIsImNyZWF0ZSIsImNvbnRleHQiLCJDb250ZXh0IiwiX2ludm9rZSIsIm1ha2VJbnZva2VNZXRob2QiLCJ0cnlDYXRjaCIsImZuIiwib2JqIiwiYXJnIiwidHlwZSIsImNhbGwiLCJlcnIiLCJHZW5TdGF0ZVN1c3BlbmRlZFN0YXJ0IiwiR2VuU3RhdGVTdXNwZW5kZWRZaWVsZCIsIkdlblN0YXRlRXhlY3V0aW5nIiwiR2VuU3RhdGVDb21wbGV0ZWQiLCJDb250aW51ZVNlbnRpbmVsIiwiR2VuZXJhdG9yRnVuY3Rpb24iLCJHZW5lcmF0b3JGdW5jdGlvblByb3RvdHlwZSIsIkl0ZXJhdG9yUHJvdG90eXBlIiwiZ2V0UHJvdG8iLCJnZXRQcm90b3R5cGVPZiIsIk5hdGl2ZUl0ZXJhdG9yUHJvdG90eXBlIiwidmFsdWVzIiwiR3AiLCJjb25zdHJ1Y3RvciIsImRpc3BsYXlOYW1lIiwiZGVmaW5lSXRlcmF0b3JNZXRob2RzIiwiZm9yRWFjaCIsIm1ldGhvZCIsImlzR2VuZXJhdG9yRnVuY3Rpb24iLCJnZW5GdW4iLCJjdG9yIiwibmFtZSIsIm1hcmsiLCJzZXRQcm90b3R5cGVPZiIsIl9fcHJvdG9fXyIsImF3cmFwIiwiX19hd2FpdCIsIkFzeW5jSXRlcmF0b3IiLCJpbnZva2UiLCJyZXNvbHZlIiwicmVqZWN0IiwicmVjb3JkIiwicmVzdWx0IiwidmFsdWUiLCJQcm9taXNlIiwidGhlbiIsInVud3JhcHBlZCIsImVycm9yIiwicHJldmlvdXNQcm9taXNlIiwiZW5xdWV1ZSIsImNhbGxJbnZva2VXaXRoTWV0aG9kQW5kQXJnIiwiYXN5bmMiLCJpdGVyIiwibmV4dCIsImRvbmUiLCJzdGF0ZSIsIkVycm9yIiwiZG9uZVJlc3VsdCIsImRlbGVnYXRlIiwiZGVsZWdhdGVSZXN1bHQiLCJtYXliZUludm9rZURlbGVnYXRlIiwic2VudCIsIl9zZW50IiwiZGlzcGF0Y2hFeGNlcHRpb24iLCJhYnJ1cHQiLCJUeXBlRXJyb3IiLCJpbmZvIiwicmVzdWx0TmFtZSIsIm5leHRMb2MiLCJ0b1N0cmluZyIsInB1c2hUcnlFbnRyeSIsImxvY3MiLCJlbnRyeSIsInRyeUxvYyIsImNhdGNoTG9jIiwiZmluYWxseUxvYyIsImFmdGVyTG9jIiwidHJ5RW50cmllcyIsInB1c2giLCJyZXNldFRyeUVudHJ5IiwiY29tcGxldGlvbiIsInJlc2V0Iiwia2V5cyIsIm9iamVjdCIsImtleSIsInJldmVyc2UiLCJsZW5ndGgiLCJwb3AiLCJpdGVyYWJsZSIsIml0ZXJhdG9yTWV0aG9kIiwiaXNOYU4iLCJpIiwic2tpcFRlbXBSZXNldCIsInByZXYiLCJjaGFyQXQiLCJzbGljZSIsInN0b3AiLCJyb290RW50cnkiLCJyb290UmVjb3JkIiwicnZhbCIsImV4Y2VwdGlvbiIsImhhbmRsZSIsImxvYyIsImNhdWdodCIsImhhc0NhdGNoIiwiaGFzRmluYWxseSIsImZpbmFsbHlFbnRyeSIsImNvbXBsZXRlIiwiZmluaXNoIiwidGhyb3duIiwiZGVsZWdhdGVZaWVsZCIsIm1vZHVsZSIsInJlZ2VuZXJhdG9yUnVudGltZSIsImFjY2lkZW50YWxTdHJpY3RNb2RlIiwiRnVuY3Rpb24iXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7TUFPSUEsT0FBTyxHQUFJLFVBQVVDLE9BQVYsRUFBbUI7QUFDaEM7UUFFSUMsRUFBRSxHQUFHQyxNQUFNLENBQUNDLFNBQWhCO1FBQ0lDLE1BQU0sR0FBR0gsRUFBRSxDQUFDSSxjQUFoQjtRQUNJQyxXQUFKLENBTGdDOztRQU01QkMsT0FBTyxHQUFHLE9BQU9DLE1BQVAsS0FBa0IsVUFBbEIsR0FBK0JBLE1BQS9CLEdBQXdDLEVBQXREO1FBQ0lDLGNBQWMsR0FBR0YsT0FBTyxDQUFDRyxRQUFSLElBQW9CLFlBQXpDO1FBQ0lDLG1CQUFtQixHQUFHSixPQUFPLENBQUNLLGFBQVIsSUFBeUIsaUJBQW5EO1FBQ0lDLGlCQUFpQixHQUFHTixPQUFPLENBQUNPLFdBQVIsSUFBdUIsZUFBL0M7O2FBRVNDLElBQVQsQ0FBY0MsT0FBZCxFQUF1QkMsT0FBdkIsRUFBZ0NDLElBQWhDLEVBQXNDQyxXQUF0QyxFQUFtRDs7VUFFN0NDLGNBQWMsR0FBR0gsT0FBTyxJQUFJQSxPQUFPLENBQUNkLFNBQVIsWUFBNkJrQixTQUF4QyxHQUFvREosT0FBcEQsR0FBOERJLFNBQW5GO1VBQ0lDLFNBQVMsR0FBR3BCLE1BQU0sQ0FBQ3FCLE1BQVAsQ0FBY0gsY0FBYyxDQUFDakIsU0FBN0IsQ0FBaEI7VUFDSXFCLE9BQU8sR0FBRyxJQUFJQyxPQUFKLENBQVlOLFdBQVcsSUFBSSxFQUEzQixDQUFkLENBSmlEOzs7TUFRakRHLFNBQVMsQ0FBQ0ksT0FBVixHQUFvQkMsZ0JBQWdCLENBQUNYLE9BQUQsRUFBVUUsSUFBVixFQUFnQk0sT0FBaEIsQ0FBcEM7YUFFT0YsU0FBUDs7O0lBRUZ0QixPQUFPLENBQUNlLElBQVIsR0FBZUEsSUFBZixDQXZCZ0M7Ozs7Ozs7Ozs7O2FBbUN2QmEsUUFBVCxDQUFrQkMsRUFBbEIsRUFBc0JDLEdBQXRCLEVBQTJCQyxHQUEzQixFQUFnQztVQUMxQjtlQUNLO1VBQUVDLElBQUksRUFBRSxRQUFSO1VBQWtCRCxHQUFHLEVBQUVGLEVBQUUsQ0FBQ0ksSUFBSCxDQUFRSCxHQUFSLEVBQWFDLEdBQWI7U0FBOUI7T0FERixDQUVFLE9BQU9HLEdBQVAsRUFBWTtlQUNMO1VBQUVGLElBQUksRUFBRSxPQUFSO1VBQWlCRCxHQUFHLEVBQUVHO1NBQTdCOzs7O1FBSUFDLHNCQUFzQixHQUFHLGdCQUE3QjtRQUNJQyxzQkFBc0IsR0FBRyxnQkFBN0I7UUFDSUMsaUJBQWlCLEdBQUcsV0FBeEI7UUFDSUMsaUJBQWlCLEdBQUcsV0FBeEIsQ0E5Q2dDOzs7UUFrRDVCQyxnQkFBZ0IsR0FBRyxFQUF2QixDQWxEZ0M7Ozs7O2FBd0R2QmxCLFNBQVQsR0FBcUI7O2FBQ1ptQixpQkFBVCxHQUE2Qjs7YUFDcEJDLDBCQUFULEdBQXNDLEVBMUROOzs7O1FBOEQ1QkMsaUJBQWlCLEdBQUcsRUFBeEI7O0lBQ0FBLGlCQUFpQixDQUFDakMsY0FBRCxDQUFqQixHQUFvQyxZQUFZO2FBQ3ZDLElBQVA7S0FERjs7UUFJSWtDLFFBQVEsR0FBR3pDLE1BQU0sQ0FBQzBDLGNBQXRCO1FBQ0lDLHVCQUF1QixHQUFHRixRQUFRLElBQUlBLFFBQVEsQ0FBQ0EsUUFBUSxDQUFDRyxNQUFNLENBQUMsRUFBRCxDQUFQLENBQVQsQ0FBbEQ7O1FBQ0lELHVCQUF1QixJQUN2QkEsdUJBQXVCLEtBQUs1QyxFQUQ1QixJQUVBRyxNQUFNLENBQUM2QixJQUFQLENBQVlZLHVCQUFaLEVBQXFDcEMsY0FBckMsQ0FGSixFQUUwRDs7O01BR3hEaUMsaUJBQWlCLEdBQUdHLHVCQUFwQjs7O1FBR0VFLEVBQUUsR0FBR04sMEJBQTBCLENBQUN0QyxTQUEzQixHQUNQa0IsU0FBUyxDQUFDbEIsU0FBVixHQUFzQkQsTUFBTSxDQUFDcUIsTUFBUCxDQUFjbUIsaUJBQWQsQ0FEeEI7SUFFQUYsaUJBQWlCLENBQUNyQyxTQUFsQixHQUE4QjRDLEVBQUUsQ0FBQ0MsV0FBSCxHQUFpQlAsMEJBQS9DO0lBQ0FBLDBCQUEwQixDQUFDTyxXQUEzQixHQUF5Q1IsaUJBQXpDO0lBQ0FDLDBCQUEwQixDQUFDNUIsaUJBQUQsQ0FBMUIsR0FDRTJCLGlCQUFpQixDQUFDUyxXQUFsQixHQUFnQyxtQkFEbEMsQ0FqRmdDOzs7YUFzRnZCQyxxQkFBVCxDQUErQi9DLFNBQS9CLEVBQTBDO09BQ3ZDLE1BQUQsRUFBUyxPQUFULEVBQWtCLFFBQWxCLEVBQTRCZ0QsT0FBNUIsQ0FBb0MsVUFBU0MsTUFBVCxFQUFpQjtRQUNuRGpELFNBQVMsQ0FBQ2lELE1BQUQsQ0FBVCxHQUFvQixVQUFTckIsR0FBVCxFQUFjO2lCQUN6QixLQUFLTCxPQUFMLENBQWEwQixNQUFiLEVBQXFCckIsR0FBckIsQ0FBUDtTQURGO09BREY7OztJQU9GL0IsT0FBTyxDQUFDcUQsbUJBQVIsR0FBOEIsVUFBU0MsTUFBVCxFQUFpQjtVQUN6Q0MsSUFBSSxHQUFHLE9BQU9ELE1BQVAsS0FBa0IsVUFBbEIsSUFBZ0NBLE1BQU0sQ0FBQ04sV0FBbEQ7YUFDT08sSUFBSSxHQUNQQSxJQUFJLEtBQUtmLGlCQUFUOztPQUdDZSxJQUFJLENBQUNOLFdBQUwsSUFBb0JNLElBQUksQ0FBQ0MsSUFBMUIsTUFBb0MsbUJBSjdCLEdBS1AsS0FMSjtLQUZGOztJQVVBeEQsT0FBTyxDQUFDeUQsSUFBUixHQUFlLFVBQVNILE1BQVQsRUFBaUI7VUFDMUJwRCxNQUFNLENBQUN3RCxjQUFYLEVBQTJCO1FBQ3pCeEQsTUFBTSxDQUFDd0QsY0FBUCxDQUFzQkosTUFBdEIsRUFBOEJiLDBCQUE5QjtPQURGLE1BRU87UUFDTGEsTUFBTSxDQUFDSyxTQUFQLEdBQW1CbEIsMEJBQW5COztZQUNJLEVBQUU1QixpQkFBaUIsSUFBSXlDLE1BQXZCLENBQUosRUFBb0M7VUFDbENBLE1BQU0sQ0FBQ3pDLGlCQUFELENBQU4sR0FBNEIsbUJBQTVCOzs7O01BR0p5QyxNQUFNLENBQUNuRCxTQUFQLEdBQW1CRCxNQUFNLENBQUNxQixNQUFQLENBQWN3QixFQUFkLENBQW5CO2FBQ09PLE1BQVA7S0FWRixDQXhHZ0M7Ozs7OztJQXlIaEN0RCxPQUFPLENBQUM0RCxLQUFSLEdBQWdCLFVBQVM3QixHQUFULEVBQWM7YUFDckI7UUFBRThCLE9BQU8sRUFBRTlCO09BQWxCO0tBREY7O2FBSVMrQixhQUFULENBQXVCeEMsU0FBdkIsRUFBa0M7ZUFDdkJ5QyxNQUFULENBQWdCWCxNQUFoQixFQUF3QnJCLEdBQXhCLEVBQTZCaUMsT0FBN0IsRUFBc0NDLE1BQXRDLEVBQThDO1lBQ3hDQyxNQUFNLEdBQUd0QyxRQUFRLENBQUNOLFNBQVMsQ0FBQzhCLE1BQUQsQ0FBVixFQUFvQjlCLFNBQXBCLEVBQStCUyxHQUEvQixDQUFyQjs7WUFDSW1DLE1BQU0sQ0FBQ2xDLElBQVAsS0FBZ0IsT0FBcEIsRUFBNkI7VUFDM0JpQyxNQUFNLENBQUNDLE1BQU0sQ0FBQ25DLEdBQVIsQ0FBTjtTQURGLE1BRU87Y0FDRG9DLE1BQU0sR0FBR0QsTUFBTSxDQUFDbkMsR0FBcEI7Y0FDSXFDLEtBQUssR0FBR0QsTUFBTSxDQUFDQyxLQUFuQjs7Y0FDSUEsS0FBSyxJQUNMLE9BQU9BLEtBQVAsS0FBaUIsUUFEakIsSUFFQWhFLE1BQU0sQ0FBQzZCLElBQVAsQ0FBWW1DLEtBQVosRUFBbUIsU0FBbkIsQ0FGSixFQUVtQzttQkFDMUJDLE9BQU8sQ0FBQ0wsT0FBUixDQUFnQkksS0FBSyxDQUFDUCxPQUF0QixFQUErQlMsSUFBL0IsQ0FBb0MsVUFBU0YsS0FBVCxFQUFnQjtjQUN6REwsTUFBTSxDQUFDLE1BQUQsRUFBU0ssS0FBVCxFQUFnQkosT0FBaEIsRUFBeUJDLE1BQXpCLENBQU47YUFESyxFQUVKLFVBQVMvQixHQUFULEVBQWM7Y0FDZjZCLE1BQU0sQ0FBQyxPQUFELEVBQVU3QixHQUFWLEVBQWU4QixPQUFmLEVBQXdCQyxNQUF4QixDQUFOO2FBSEssQ0FBUDs7O2lCQU9LSSxPQUFPLENBQUNMLE9BQVIsQ0FBZ0JJLEtBQWhCLEVBQXVCRSxJQUF2QixDQUE0QixVQUFTQyxTQUFULEVBQW9COzs7O1lBSXJESixNQUFNLENBQUNDLEtBQVAsR0FBZUcsU0FBZjtZQUNBUCxPQUFPLENBQUNHLE1BQUQsQ0FBUDtXQUxLLEVBTUosVUFBU0ssS0FBVCxFQUFnQjs7O21CQUdWVCxNQUFNLENBQUMsT0FBRCxFQUFVUyxLQUFWLEVBQWlCUixPQUFqQixFQUEwQkMsTUFBMUIsQ0FBYjtXQVRLLENBQVA7Ozs7VUFjQVEsZUFBSjs7ZUFFU0MsT0FBVCxDQUFpQnRCLE1BQWpCLEVBQXlCckIsR0FBekIsRUFBOEI7aUJBQ25CNEMsMEJBQVQsR0FBc0M7aUJBQzdCLElBQUlOLE9BQUosQ0FBWSxVQUFTTCxPQUFULEVBQWtCQyxNQUFsQixFQUEwQjtZQUMzQ0YsTUFBTSxDQUFDWCxNQUFELEVBQVNyQixHQUFULEVBQWNpQyxPQUFkLEVBQXVCQyxNQUF2QixDQUFOO1dBREssQ0FBUDs7O2VBS0tRLGVBQWU7Ozs7Ozs7Ozs7OztRQWFwQkEsZUFBZSxHQUFHQSxlQUFlLENBQUNILElBQWhCLENBQ2hCSywwQkFEZ0I7O1FBSWhCQSwwQkFKZ0IsQ0FBSCxHQUtYQSwwQkFBMEIsRUFsQmhDO09BekM4Qjs7OztXQWdFM0JqRCxPQUFMLEdBQWVnRCxPQUFmOzs7SUFHRnhCLHFCQUFxQixDQUFDWSxhQUFhLENBQUMzRCxTQUFmLENBQXJCOztJQUNBMkQsYUFBYSxDQUFDM0QsU0FBZCxDQUF3QlEsbUJBQXhCLElBQStDLFlBQVk7YUFDbEQsSUFBUDtLQURGOztJQUdBWCxPQUFPLENBQUM4RCxhQUFSLEdBQXdCQSxhQUF4QixDQXBNZ0M7Ozs7SUF5TWhDOUQsT0FBTyxDQUFDNEUsS0FBUixHQUFnQixVQUFTNUQsT0FBVCxFQUFrQkMsT0FBbEIsRUFBMkJDLElBQTNCLEVBQWlDQyxXQUFqQyxFQUE4QztVQUN4RDBELElBQUksR0FBRyxJQUFJZixhQUFKLENBQ1QvQyxJQUFJLENBQUNDLE9BQUQsRUFBVUMsT0FBVixFQUFtQkMsSUFBbkIsRUFBeUJDLFdBQXpCLENBREssQ0FBWDthQUlPbkIsT0FBTyxDQUFDcUQsbUJBQVIsQ0FBNEJwQyxPQUE1QixJQUNINEQsSUFERztRQUVIQSxJQUFJLENBQUNDLElBQUwsR0FBWVIsSUFBWixDQUFpQixVQUFTSCxNQUFULEVBQWlCO2VBQ3pCQSxNQUFNLENBQUNZLElBQVAsR0FBY1osTUFBTSxDQUFDQyxLQUFyQixHQUE2QlMsSUFBSSxDQUFDQyxJQUFMLEVBQXBDO09BREYsQ0FGSjtLQUxGOzthQVlTbkQsZ0JBQVQsQ0FBMEJYLE9BQTFCLEVBQW1DRSxJQUFuQyxFQUF5Q00sT0FBekMsRUFBa0Q7VUFDNUN3RCxLQUFLLEdBQUc3QyxzQkFBWjthQUVPLFNBQVM0QixNQUFULENBQWdCWCxNQUFoQixFQUF3QnJCLEdBQXhCLEVBQTZCO1lBQzlCaUQsS0FBSyxLQUFLM0MsaUJBQWQsRUFBaUM7Z0JBQ3pCLElBQUk0QyxLQUFKLENBQVUsOEJBQVYsQ0FBTjs7O1lBR0VELEtBQUssS0FBSzFDLGlCQUFkLEVBQWlDO2NBQzNCYyxNQUFNLEtBQUssT0FBZixFQUF3QjtrQkFDaEJyQixHQUFOO1dBRjZCOzs7O2lCQU94Qm1ELFVBQVUsRUFBakI7OztRQUdGMUQsT0FBTyxDQUFDNEIsTUFBUixHQUFpQkEsTUFBakI7UUFDQTVCLE9BQU8sQ0FBQ08sR0FBUixHQUFjQSxHQUFkOztlQUVPLElBQVAsRUFBYTtjQUNQb0QsUUFBUSxHQUFHM0QsT0FBTyxDQUFDMkQsUUFBdkI7O2NBQ0lBLFFBQUosRUFBYztnQkFDUkMsY0FBYyxHQUFHQyxtQkFBbUIsQ0FBQ0YsUUFBRCxFQUFXM0QsT0FBWCxDQUF4Qzs7Z0JBQ0k0RCxjQUFKLEVBQW9CO2tCQUNkQSxjQUFjLEtBQUs3QyxnQkFBdkIsRUFBeUM7cUJBQ2xDNkMsY0FBUDs7OztjQUlBNUQsT0FBTyxDQUFDNEIsTUFBUixLQUFtQixNQUF2QixFQUErQjs7O1lBRzdCNUIsT0FBTyxDQUFDOEQsSUFBUixHQUFlOUQsT0FBTyxDQUFDK0QsS0FBUixHQUFnQi9ELE9BQU8sQ0FBQ08sR0FBdkM7V0FIRixNQUtPLElBQUlQLE9BQU8sQ0FBQzRCLE1BQVIsS0FBbUIsT0FBdkIsRUFBZ0M7Z0JBQ2pDNEIsS0FBSyxLQUFLN0Msc0JBQWQsRUFBc0M7Y0FDcEM2QyxLQUFLLEdBQUcxQyxpQkFBUjtvQkFDTWQsT0FBTyxDQUFDTyxHQUFkOzs7WUFHRlAsT0FBTyxDQUFDZ0UsaUJBQVIsQ0FBMEJoRSxPQUFPLENBQUNPLEdBQWxDO1dBTkssTUFRQSxJQUFJUCxPQUFPLENBQUM0QixNQUFSLEtBQW1CLFFBQXZCLEVBQWlDO1lBQ3RDNUIsT0FBTyxDQUFDaUUsTUFBUixDQUFlLFFBQWYsRUFBeUJqRSxPQUFPLENBQUNPLEdBQWpDOzs7VUFHRmlELEtBQUssR0FBRzNDLGlCQUFSO2NBRUk2QixNQUFNLEdBQUd0QyxRQUFRLENBQUNaLE9BQUQsRUFBVUUsSUFBVixFQUFnQk0sT0FBaEIsQ0FBckI7O2NBQ0kwQyxNQUFNLENBQUNsQyxJQUFQLEtBQWdCLFFBQXBCLEVBQThCOzs7WUFHNUJnRCxLQUFLLEdBQUd4RCxPQUFPLENBQUN1RCxJQUFSLEdBQ0p6QyxpQkFESSxHQUVKRixzQkFGSjs7Z0JBSUk4QixNQUFNLENBQUNuQyxHQUFQLEtBQWVRLGdCQUFuQixFQUFxQzs7OzttQkFJOUI7Y0FDTDZCLEtBQUssRUFBRUYsTUFBTSxDQUFDbkMsR0FEVDtjQUVMZ0QsSUFBSSxFQUFFdkQsT0FBTyxDQUFDdUQ7YUFGaEI7V0FYRixNQWdCTyxJQUFJYixNQUFNLENBQUNsQyxJQUFQLEtBQWdCLE9BQXBCLEVBQTZCO1lBQ2xDZ0QsS0FBSyxHQUFHMUMsaUJBQVIsQ0FEa0M7OztZQUlsQ2QsT0FBTyxDQUFDNEIsTUFBUixHQUFpQixPQUFqQjtZQUNBNUIsT0FBTyxDQUFDTyxHQUFSLEdBQWNtQyxNQUFNLENBQUNuQyxHQUFyQjs7O09BckVOO0tBeE44Qjs7Ozs7O2FBdVN2QnNELG1CQUFULENBQTZCRixRQUE3QixFQUF1QzNELE9BQXZDLEVBQWdEO1VBQzFDNEIsTUFBTSxHQUFHK0IsUUFBUSxDQUFDekUsUUFBVCxDQUFrQmMsT0FBTyxDQUFDNEIsTUFBMUIsQ0FBYjs7VUFDSUEsTUFBTSxLQUFLOUMsV0FBZixFQUEwQjs7O1FBR3hCa0IsT0FBTyxDQUFDMkQsUUFBUixHQUFtQixJQUFuQjs7WUFFSTNELE9BQU8sQ0FBQzRCLE1BQVIsS0FBbUIsT0FBdkIsRUFBZ0M7O2NBRTFCK0IsUUFBUSxDQUFDekUsUUFBVCxDQUFrQixRQUFsQixDQUFKLEVBQWlDOzs7WUFHL0JjLE9BQU8sQ0FBQzRCLE1BQVIsR0FBaUIsUUFBakI7WUFDQTVCLE9BQU8sQ0FBQ08sR0FBUixHQUFjekIsV0FBZDtZQUNBK0UsbUJBQW1CLENBQUNGLFFBQUQsRUFBVzNELE9BQVgsQ0FBbkI7O2dCQUVJQSxPQUFPLENBQUM0QixNQUFSLEtBQW1CLE9BQXZCLEVBQWdDOzs7cUJBR3ZCYixnQkFBUDs7OztVQUlKZixPQUFPLENBQUM0QixNQUFSLEdBQWlCLE9BQWpCO1VBQ0E1QixPQUFPLENBQUNPLEdBQVIsR0FBYyxJQUFJMkQsU0FBSixDQUNaLGdEQURZLENBQWQ7OztlQUlLbkQsZ0JBQVA7OztVQUdFMkIsTUFBTSxHQUFHdEMsUUFBUSxDQUFDd0IsTUFBRCxFQUFTK0IsUUFBUSxDQUFDekUsUUFBbEIsRUFBNEJjLE9BQU8sQ0FBQ08sR0FBcEMsQ0FBckI7O1VBRUltQyxNQUFNLENBQUNsQyxJQUFQLEtBQWdCLE9BQXBCLEVBQTZCO1FBQzNCUixPQUFPLENBQUM0QixNQUFSLEdBQWlCLE9BQWpCO1FBQ0E1QixPQUFPLENBQUNPLEdBQVIsR0FBY21DLE1BQU0sQ0FBQ25DLEdBQXJCO1FBQ0FQLE9BQU8sQ0FBQzJELFFBQVIsR0FBbUIsSUFBbkI7ZUFDTzVDLGdCQUFQOzs7VUFHRW9ELElBQUksR0FBR3pCLE1BQU0sQ0FBQ25DLEdBQWxCOztVQUVJLENBQUU0RCxJQUFOLEVBQVk7UUFDVm5FLE9BQU8sQ0FBQzRCLE1BQVIsR0FBaUIsT0FBakI7UUFDQTVCLE9BQU8sQ0FBQ08sR0FBUixHQUFjLElBQUkyRCxTQUFKLENBQWMsa0NBQWQsQ0FBZDtRQUNBbEUsT0FBTyxDQUFDMkQsUUFBUixHQUFtQixJQUFuQjtlQUNPNUMsZ0JBQVA7OztVQUdFb0QsSUFBSSxDQUFDWixJQUFULEVBQWU7OztRQUdidkQsT0FBTyxDQUFDMkQsUUFBUSxDQUFDUyxVQUFWLENBQVAsR0FBK0JELElBQUksQ0FBQ3ZCLEtBQXBDLENBSGE7O1FBTWI1QyxPQUFPLENBQUNzRCxJQUFSLEdBQWVLLFFBQVEsQ0FBQ1UsT0FBeEIsQ0FOYTs7Ozs7OztZQWNUckUsT0FBTyxDQUFDNEIsTUFBUixLQUFtQixRQUF2QixFQUFpQztVQUMvQjVCLE9BQU8sQ0FBQzRCLE1BQVIsR0FBaUIsTUFBakI7VUFDQTVCLE9BQU8sQ0FBQ08sR0FBUixHQUFjekIsV0FBZDs7T0FoQkosTUFtQk87O2VBRUVxRixJQUFQO09BdEU0Qzs7OztNQTJFOUNuRSxPQUFPLENBQUMyRCxRQUFSLEdBQW1CLElBQW5CO2FBQ081QyxnQkFBUDtLQW5YOEI7Ozs7SUF3WGhDVyxxQkFBcUIsQ0FBQ0gsRUFBRCxDQUFyQjtJQUVBQSxFQUFFLENBQUNsQyxpQkFBRCxDQUFGLEdBQXdCLFdBQXhCLENBMVhnQzs7Ozs7O0lBaVloQ2tDLEVBQUUsQ0FBQ3RDLGNBQUQsQ0FBRixHQUFxQixZQUFXO2FBQ3ZCLElBQVA7S0FERjs7SUFJQXNDLEVBQUUsQ0FBQytDLFFBQUgsR0FBYyxZQUFXO2FBQ2hCLG9CQUFQO0tBREY7O2FBSVNDLFlBQVQsQ0FBc0JDLElBQXRCLEVBQTRCO1VBQ3RCQyxLQUFLLEdBQUc7UUFBRUMsTUFBTSxFQUFFRixJQUFJLENBQUMsQ0FBRDtPQUExQjs7VUFFSSxLQUFLQSxJQUFULEVBQWU7UUFDYkMsS0FBSyxDQUFDRSxRQUFOLEdBQWlCSCxJQUFJLENBQUMsQ0FBRCxDQUFyQjs7O1VBR0UsS0FBS0EsSUFBVCxFQUFlO1FBQ2JDLEtBQUssQ0FBQ0csVUFBTixHQUFtQkosSUFBSSxDQUFDLENBQUQsQ0FBdkI7UUFDQUMsS0FBSyxDQUFDSSxRQUFOLEdBQWlCTCxJQUFJLENBQUMsQ0FBRCxDQUFyQjs7O1dBR0dNLFVBQUwsQ0FBZ0JDLElBQWhCLENBQXFCTixLQUFyQjs7O2FBR09PLGFBQVQsQ0FBdUJQLEtBQXZCLEVBQThCO1VBQ3hCL0IsTUFBTSxHQUFHK0IsS0FBSyxDQUFDUSxVQUFOLElBQW9CLEVBQWpDO01BQ0F2QyxNQUFNLENBQUNsQyxJQUFQLEdBQWMsUUFBZDthQUNPa0MsTUFBTSxDQUFDbkMsR0FBZDtNQUNBa0UsS0FBSyxDQUFDUSxVQUFOLEdBQW1CdkMsTUFBbkI7OzthQUdPekMsT0FBVCxDQUFpQk4sV0FBakIsRUFBOEI7Ozs7V0FJdkJtRixVQUFMLEdBQWtCLENBQUM7UUFBRUosTUFBTSxFQUFFO09BQVgsQ0FBbEI7TUFDQS9FLFdBQVcsQ0FBQ2dDLE9BQVosQ0FBb0I0QyxZQUFwQixFQUFrQyxJQUFsQztXQUNLVyxLQUFMLENBQVcsSUFBWDs7O0lBR0YxRyxPQUFPLENBQUMyRyxJQUFSLEdBQWUsVUFBU0MsTUFBVCxFQUFpQjtVQUMxQkQsSUFBSSxHQUFHLEVBQVg7O1dBQ0ssSUFBSUUsR0FBVCxJQUFnQkQsTUFBaEIsRUFBd0I7UUFDdEJELElBQUksQ0FBQ0osSUFBTCxDQUFVTSxHQUFWOzs7TUFFRkYsSUFBSSxDQUFDRyxPQUFMLEdBTDhCOzs7YUFTdkIsU0FBU2hDLElBQVQsR0FBZ0I7ZUFDZDZCLElBQUksQ0FBQ0ksTUFBWixFQUFvQjtjQUNkRixHQUFHLEdBQUdGLElBQUksQ0FBQ0ssR0FBTCxFQUFWOztjQUNJSCxHQUFHLElBQUlELE1BQVgsRUFBbUI7WUFDakI5QixJQUFJLENBQUNWLEtBQUwsR0FBYXlDLEdBQWI7WUFDQS9CLElBQUksQ0FBQ0MsSUFBTCxHQUFZLEtBQVo7bUJBQ09ELElBQVA7O1NBTmlCOzs7OztRQWFyQkEsSUFBSSxDQUFDQyxJQUFMLEdBQVksSUFBWjtlQUNPRCxJQUFQO09BZEY7S0FURjs7YUEyQlNoQyxNQUFULENBQWdCbUUsUUFBaEIsRUFBMEI7VUFDcEJBLFFBQUosRUFBYztZQUNSQyxjQUFjLEdBQUdELFFBQVEsQ0FBQ3hHLGNBQUQsQ0FBN0I7O1lBQ0l5RyxjQUFKLEVBQW9CO2lCQUNYQSxjQUFjLENBQUNqRixJQUFmLENBQW9CZ0YsUUFBcEIsQ0FBUDs7O1lBR0UsT0FBT0EsUUFBUSxDQUFDbkMsSUFBaEIsS0FBeUIsVUFBN0IsRUFBeUM7aUJBQ2hDbUMsUUFBUDs7O1lBR0UsQ0FBQ0UsS0FBSyxDQUFDRixRQUFRLENBQUNGLE1BQVYsQ0FBVixFQUE2QjtjQUN2QkssQ0FBQyxHQUFHLENBQUMsQ0FBVDtjQUFZdEMsSUFBSSxHQUFHLFNBQVNBLElBQVQsR0FBZ0I7bUJBQzFCLEVBQUVzQyxDQUFGLEdBQU1ILFFBQVEsQ0FBQ0YsTUFBdEIsRUFBOEI7a0JBQ3hCM0csTUFBTSxDQUFDNkIsSUFBUCxDQUFZZ0YsUUFBWixFQUFzQkcsQ0FBdEIsQ0FBSixFQUE4QjtnQkFDNUJ0QyxJQUFJLENBQUNWLEtBQUwsR0FBYTZDLFFBQVEsQ0FBQ0csQ0FBRCxDQUFyQjtnQkFDQXRDLElBQUksQ0FBQ0MsSUFBTCxHQUFZLEtBQVo7dUJBQ09ELElBQVA7Ozs7WUFJSkEsSUFBSSxDQUFDVixLQUFMLEdBQWE5RCxXQUFiO1lBQ0F3RSxJQUFJLENBQUNDLElBQUwsR0FBWSxJQUFaO21CQUVPRCxJQUFQO1dBWkY7O2lCQWVPQSxJQUFJLENBQUNBLElBQUwsR0FBWUEsSUFBbkI7O09BM0JvQjs7O2FBZ0NqQjtRQUFFQSxJQUFJLEVBQUVJO09BQWY7OztJQUVGbEYsT0FBTyxDQUFDOEMsTUFBUixHQUFpQkEsTUFBakI7O2FBRVNvQyxVQUFULEdBQXNCO2FBQ2I7UUFBRWQsS0FBSyxFQUFFOUQsV0FBVDtRQUFvQnlFLElBQUksRUFBRTtPQUFqQzs7O0lBR0Z0RCxPQUFPLENBQUN0QixTQUFSLEdBQW9CO01BQ2xCNkMsV0FBVyxFQUFFdkIsT0FESztNQUdsQmlGLEtBQUssRUFBRSxVQUFTVyxhQUFULEVBQXdCO2FBQ3hCQyxJQUFMLEdBQVksQ0FBWjthQUNLeEMsSUFBTCxHQUFZLENBQVosQ0FGNkI7OzthQUt4QlEsSUFBTCxHQUFZLEtBQUtDLEtBQUwsR0FBYWpGLFdBQXpCO2FBQ0t5RSxJQUFMLEdBQVksS0FBWjthQUNLSSxRQUFMLEdBQWdCLElBQWhCO2FBRUsvQixNQUFMLEdBQWMsTUFBZDthQUNLckIsR0FBTCxHQUFXekIsV0FBWDthQUVLZ0csVUFBTCxDQUFnQm5ELE9BQWhCLENBQXdCcUQsYUFBeEI7O1lBRUksQ0FBQ2EsYUFBTCxFQUFvQjtlQUNiLElBQUk3RCxJQUFULElBQWlCLElBQWpCLEVBQXVCOztnQkFFakJBLElBQUksQ0FBQytELE1BQUwsQ0FBWSxDQUFaLE1BQW1CLEdBQW5CLElBQ0FuSCxNQUFNLENBQUM2QixJQUFQLENBQVksSUFBWixFQUFrQnVCLElBQWxCLENBREEsSUFFQSxDQUFDMkQsS0FBSyxDQUFDLENBQUMzRCxJQUFJLENBQUNnRSxLQUFMLENBQVcsQ0FBWCxDQUFGLENBRlYsRUFFNEI7bUJBQ3JCaEUsSUFBTCxJQUFhbEQsV0FBYjs7OztPQXZCVTtNQTZCbEJtSCxJQUFJLEVBQUUsWUFBVzthQUNWMUMsSUFBTCxHQUFZLElBQVo7WUFFSTJDLFNBQVMsR0FBRyxLQUFLcEIsVUFBTCxDQUFnQixDQUFoQixDQUFoQjtZQUNJcUIsVUFBVSxHQUFHRCxTQUFTLENBQUNqQixVQUEzQjs7WUFDSWtCLFVBQVUsQ0FBQzNGLElBQVgsS0FBb0IsT0FBeEIsRUFBaUM7Z0JBQ3pCMkYsVUFBVSxDQUFDNUYsR0FBakI7OztlQUdLLEtBQUs2RixJQUFaO09BdENnQjtNQXlDbEJwQyxpQkFBaUIsRUFBRSxVQUFTcUMsU0FBVCxFQUFvQjtZQUNqQyxLQUFLOUMsSUFBVCxFQUFlO2dCQUNQOEMsU0FBTjs7O1lBR0VyRyxPQUFPLEdBQUcsSUFBZDs7aUJBQ1NzRyxNQUFULENBQWdCQyxHQUFoQixFQUFxQkMsTUFBckIsRUFBNkI7VUFDM0I5RCxNQUFNLENBQUNsQyxJQUFQLEdBQWMsT0FBZDtVQUNBa0MsTUFBTSxDQUFDbkMsR0FBUCxHQUFhOEYsU0FBYjtVQUNBckcsT0FBTyxDQUFDc0QsSUFBUixHQUFlaUQsR0FBZjs7Y0FFSUMsTUFBSixFQUFZOzs7WUFHVnhHLE9BQU8sQ0FBQzRCLE1BQVIsR0FBaUIsTUFBakI7WUFDQTVCLE9BQU8sQ0FBQ08sR0FBUixHQUFjekIsV0FBZDs7O2lCQUdLLENBQUMsQ0FBRTBILE1BQVY7OzthQUdHLElBQUlaLENBQUMsR0FBRyxLQUFLZCxVQUFMLENBQWdCUyxNQUFoQixHQUF5QixDQUF0QyxFQUF5Q0ssQ0FBQyxJQUFJLENBQTlDLEVBQWlELEVBQUVBLENBQW5ELEVBQXNEO2NBQ2hEbkIsS0FBSyxHQUFHLEtBQUtLLFVBQUwsQ0FBZ0JjLENBQWhCLENBQVo7Y0FDSWxELE1BQU0sR0FBRytCLEtBQUssQ0FBQ1EsVUFBbkI7O2NBRUlSLEtBQUssQ0FBQ0MsTUFBTixLQUFpQixNQUFyQixFQUE2Qjs7OzttQkFJcEI0QixNQUFNLENBQUMsS0FBRCxDQUFiOzs7Y0FHRTdCLEtBQUssQ0FBQ0MsTUFBTixJQUFnQixLQUFLb0IsSUFBekIsRUFBK0I7Z0JBQ3pCVyxRQUFRLEdBQUc3SCxNQUFNLENBQUM2QixJQUFQLENBQVlnRSxLQUFaLEVBQW1CLFVBQW5CLENBQWY7Z0JBQ0lpQyxVQUFVLEdBQUc5SCxNQUFNLENBQUM2QixJQUFQLENBQVlnRSxLQUFaLEVBQW1CLFlBQW5CLENBQWpCOztnQkFFSWdDLFFBQVEsSUFBSUMsVUFBaEIsRUFBNEI7a0JBQ3RCLEtBQUtaLElBQUwsR0FBWXJCLEtBQUssQ0FBQ0UsUUFBdEIsRUFBZ0M7dUJBQ3ZCMkIsTUFBTSxDQUFDN0IsS0FBSyxDQUFDRSxRQUFQLEVBQWlCLElBQWpCLENBQWI7ZUFERixNQUVPLElBQUksS0FBS21CLElBQUwsR0FBWXJCLEtBQUssQ0FBQ0csVUFBdEIsRUFBa0M7dUJBQ2hDMEIsTUFBTSxDQUFDN0IsS0FBSyxDQUFDRyxVQUFQLENBQWI7O2FBSkosTUFPTyxJQUFJNkIsUUFBSixFQUFjO2tCQUNmLEtBQUtYLElBQUwsR0FBWXJCLEtBQUssQ0FBQ0UsUUFBdEIsRUFBZ0M7dUJBQ3ZCMkIsTUFBTSxDQUFDN0IsS0FBSyxDQUFDRSxRQUFQLEVBQWlCLElBQWpCLENBQWI7O2FBRkcsTUFLQSxJQUFJK0IsVUFBSixFQUFnQjtrQkFDakIsS0FBS1osSUFBTCxHQUFZckIsS0FBSyxDQUFDRyxVQUF0QixFQUFrQzt1QkFDekIwQixNQUFNLENBQUM3QixLQUFLLENBQUNHLFVBQVAsQ0FBYjs7YUFGRyxNQUtBO29CQUNDLElBQUluQixLQUFKLENBQVUsd0NBQVYsQ0FBTjs7OztPQS9GVTtNQXFHbEJRLE1BQU0sRUFBRSxVQUFTekQsSUFBVCxFQUFlRCxHQUFmLEVBQW9CO2FBQ3JCLElBQUlxRixDQUFDLEdBQUcsS0FBS2QsVUFBTCxDQUFnQlMsTUFBaEIsR0FBeUIsQ0FBdEMsRUFBeUNLLENBQUMsSUFBSSxDQUE5QyxFQUFpRCxFQUFFQSxDQUFuRCxFQUFzRDtjQUNoRG5CLEtBQUssR0FBRyxLQUFLSyxVQUFMLENBQWdCYyxDQUFoQixDQUFaOztjQUNJbkIsS0FBSyxDQUFDQyxNQUFOLElBQWdCLEtBQUtvQixJQUFyQixJQUNBbEgsTUFBTSxDQUFDNkIsSUFBUCxDQUFZZ0UsS0FBWixFQUFtQixZQUFuQixDQURBLElBRUEsS0FBS3FCLElBQUwsR0FBWXJCLEtBQUssQ0FBQ0csVUFGdEIsRUFFa0M7Z0JBQzVCK0IsWUFBWSxHQUFHbEMsS0FBbkI7Ozs7O1lBS0FrQyxZQUFZLEtBQ1huRyxJQUFJLEtBQUssT0FBVCxJQUNBQSxJQUFJLEtBQUssVUFGRSxDQUFaLElBR0FtRyxZQUFZLENBQUNqQyxNQUFiLElBQXVCbkUsR0FIdkIsSUFJQUEsR0FBRyxJQUFJb0csWUFBWSxDQUFDL0IsVUFKeEIsRUFJb0M7OztVQUdsQytCLFlBQVksR0FBRyxJQUFmOzs7WUFHRWpFLE1BQU0sR0FBR2lFLFlBQVksR0FBR0EsWUFBWSxDQUFDMUIsVUFBaEIsR0FBNkIsRUFBdEQ7UUFDQXZDLE1BQU0sQ0FBQ2xDLElBQVAsR0FBY0EsSUFBZDtRQUNBa0MsTUFBTSxDQUFDbkMsR0FBUCxHQUFhQSxHQUFiOztZQUVJb0csWUFBSixFQUFrQjtlQUNYL0UsTUFBTCxHQUFjLE1BQWQ7ZUFDSzBCLElBQUwsR0FBWXFELFlBQVksQ0FBQy9CLFVBQXpCO2lCQUNPN0QsZ0JBQVA7OztlQUdLLEtBQUs2RixRQUFMLENBQWNsRSxNQUFkLENBQVA7T0FwSWdCO01BdUlsQmtFLFFBQVEsRUFBRSxVQUFTbEUsTUFBVCxFQUFpQm1DLFFBQWpCLEVBQTJCO1lBQy9CbkMsTUFBTSxDQUFDbEMsSUFBUCxLQUFnQixPQUFwQixFQUE2QjtnQkFDckJrQyxNQUFNLENBQUNuQyxHQUFiOzs7WUFHRW1DLE1BQU0sQ0FBQ2xDLElBQVAsS0FBZ0IsT0FBaEIsSUFDQWtDLE1BQU0sQ0FBQ2xDLElBQVAsS0FBZ0IsVUFEcEIsRUFDZ0M7ZUFDekI4QyxJQUFMLEdBQVlaLE1BQU0sQ0FBQ25DLEdBQW5CO1NBRkYsTUFHTyxJQUFJbUMsTUFBTSxDQUFDbEMsSUFBUCxLQUFnQixRQUFwQixFQUE4QjtlQUM5QjRGLElBQUwsR0FBWSxLQUFLN0YsR0FBTCxHQUFXbUMsTUFBTSxDQUFDbkMsR0FBOUI7ZUFDS3FCLE1BQUwsR0FBYyxRQUFkO2VBQ0swQixJQUFMLEdBQVksS0FBWjtTQUhLLE1BSUEsSUFBSVosTUFBTSxDQUFDbEMsSUFBUCxLQUFnQixRQUFoQixJQUE0QnFFLFFBQWhDLEVBQTBDO2VBQzFDdkIsSUFBTCxHQUFZdUIsUUFBWjs7O2VBR0s5RCxnQkFBUDtPQXZKZ0I7TUEwSmxCOEYsTUFBTSxFQUFFLFVBQVNqQyxVQUFULEVBQXFCO2FBQ3RCLElBQUlnQixDQUFDLEdBQUcsS0FBS2QsVUFBTCxDQUFnQlMsTUFBaEIsR0FBeUIsQ0FBdEMsRUFBeUNLLENBQUMsSUFBSSxDQUE5QyxFQUFpRCxFQUFFQSxDQUFuRCxFQUFzRDtjQUNoRG5CLEtBQUssR0FBRyxLQUFLSyxVQUFMLENBQWdCYyxDQUFoQixDQUFaOztjQUNJbkIsS0FBSyxDQUFDRyxVQUFOLEtBQXFCQSxVQUF6QixFQUFxQztpQkFDOUJnQyxRQUFMLENBQWNuQyxLQUFLLENBQUNRLFVBQXBCLEVBQWdDUixLQUFLLENBQUNJLFFBQXRDO1lBQ0FHLGFBQWEsQ0FBQ1AsS0FBRCxDQUFiO21CQUNPMUQsZ0JBQVA7OztPQWhLWTtlQXFLVCxVQUFTMkQsTUFBVCxFQUFpQjthQUNuQixJQUFJa0IsQ0FBQyxHQUFHLEtBQUtkLFVBQUwsQ0FBZ0JTLE1BQWhCLEdBQXlCLENBQXRDLEVBQXlDSyxDQUFDLElBQUksQ0FBOUMsRUFBaUQsRUFBRUEsQ0FBbkQsRUFBc0Q7Y0FDaERuQixLQUFLLEdBQUcsS0FBS0ssVUFBTCxDQUFnQmMsQ0FBaEIsQ0FBWjs7Y0FDSW5CLEtBQUssQ0FBQ0MsTUFBTixLQUFpQkEsTUFBckIsRUFBNkI7Z0JBQ3ZCaEMsTUFBTSxHQUFHK0IsS0FBSyxDQUFDUSxVQUFuQjs7Z0JBQ0l2QyxNQUFNLENBQUNsQyxJQUFQLEtBQWdCLE9BQXBCLEVBQTZCO2tCQUN2QnNHLE1BQU0sR0FBR3BFLE1BQU0sQ0FBQ25DLEdBQXBCO2NBQ0F5RSxhQUFhLENBQUNQLEtBQUQsQ0FBYjs7O21CQUVLcUMsTUFBUDs7U0FUb0I7Ozs7Y0FlbEIsSUFBSXJELEtBQUosQ0FBVSx1QkFBVixDQUFOO09BcExnQjtNQXVMbEJzRCxhQUFhLEVBQUUsVUFBU3RCLFFBQVQsRUFBbUJyQixVQUFuQixFQUErQkMsT0FBL0IsRUFBd0M7YUFDaERWLFFBQUwsR0FBZ0I7VUFDZHpFLFFBQVEsRUFBRW9DLE1BQU0sQ0FBQ21FLFFBQUQsQ0FERjtVQUVkckIsVUFBVSxFQUFFQSxVQUZFO1VBR2RDLE9BQU8sRUFBRUE7U0FIWDs7WUFNSSxLQUFLekMsTUFBTCxLQUFnQixNQUFwQixFQUE0Qjs7O2VBR3JCckIsR0FBTCxHQUFXekIsV0FBWDs7O2VBR0tpQyxnQkFBUDs7S0FwTUosQ0EzZWdDOzs7OztXQXVyQnpCdkMsT0FBUDtHQXZyQmE7Ozs7R0E4ckJnQndJLE1BQU0sQ0FBQ3hJLE9BQXBDLENBOXJCYSxDQUFmOztNQWlzQkk7SUFDRnlJLGtCQUFrQixHQUFHMUksT0FBckI7R0FERixDQUVFLE9BQU8ySSxvQkFBUCxFQUE2Qjs7Ozs7Ozs7OztJQVU3QkMsUUFBUSxDQUFDLEdBQUQsRUFBTSx3QkFBTixDQUFSLENBQXdDNUksT0FBeEM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OyJ9

/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(156)))

/***/ })
])]);