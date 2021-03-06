/* */ 
'use strict';
var global = typeof self != 'undefined' ? self : Function('return this')(),
    core = {},
    defineProperty = Object.defineProperty,
    hasOwnProperty = {}.hasOwnProperty,
    ceil = Math.ceil,
    floor = Math.floor,
    max = Math.max,
    min = Math.min;
var DESC = !!function() {
  try {
    return defineProperty({}, 'a', {get: function() {
        return 2;
      }}).a == 2;
  } catch (e) {}
}();
var hide = createDefiner(1);
function toInteger(it) {
  return isNaN(it = +it) ? 0 : (it > 0 ? floor : ceil)(it);
}
function desc(bitmap, value) {
  return {
    enumerable: !(bitmap & 1),
    configurable: !(bitmap & 2),
    writable: !(bitmap & 4),
    value: value
  };
}
function simpleSet(object, key, value) {
  object[key] = value;
  return object;
}
function createDefiner(bitmap) {
  return DESC ? function(object, key, value) {
    return $.setDesc(object, key, desc(bitmap, value));
  } : simpleSet;
}
function isObject(it) {
  return it !== null && (typeof it == 'object' || typeof it == 'function');
}
function isFunction(it) {
  return typeof it == 'function';
}
function assertDefined(it) {
  if (it == undefined)
    throw TypeError("Can't call method on  " + it);
  return it;
}
var $ = module.exports = require("./$.fw")({
  g: global,
  core: core,
  html: global.document && document.documentElement,
  isObject: isObject,
  isFunction: isFunction,
  it: function(it) {
    return it;
  },
  that: function() {
    return this;
  },
  toInteger: toInteger,
  toLength: function(it) {
    return it > 0 ? min(toInteger(it), 0x1fffffffffffff) : 0;
  },
  toIndex: function(index, length) {
    index = toInteger(index);
    return index < 0 ? max(index + length, 0) : min(index, length);
  },
  has: function(it, key) {
    return hasOwnProperty.call(it, key);
  },
  create: Object.create,
  getProto: Object.getPrototypeOf,
  DESC: DESC,
  desc: desc,
  getDesc: Object.getOwnPropertyDescriptor,
  setDesc: defineProperty,
  getKeys: Object.keys,
  getNames: Object.getOwnPropertyNames,
  getSymbols: Object.getOwnPropertySymbols,
  assertDefined: assertDefined,
  ES5Object: Object,
  toObject: function(it) {
    return $.ES5Object(assertDefined(it));
  },
  hide: hide,
  def: createDefiner(0),
  set: global.Symbol ? simpleSet : hide,
  mix: function(target, src) {
    for (var key in src)
      hide(target, key, src[key]);
    return target;
  },
  each: [].forEach
});
if (typeof __e != 'undefined')
  __e = core;
if (typeof __g != 'undefined')
  __g = global;
