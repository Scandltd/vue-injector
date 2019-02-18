/*!
  * @scandltd/vue-injector v2.1.2
  * (c) 2019 Scandltd
  * @license GPL-2.0
  */
'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var $Vue;
function install(Vue) {
    if (install.installed && $Vue === Vue) { return; }
    install.installed = true;
    $Vue = Vue;
    var isDef = function isDef(v) {
        return v !== undefined;
    };
    Vue.mixin({
        beforeCreate: function beforeCreate() {
            if (isDef(this.$options.providers)) {
                this._providers = this.$options.providers;
            }
            if (isDef(this.$options.injector)) {
                this._injectorRoot = this;
                this._injector = this.$options.injector;
                this._injector.init(this);
            } else {
                this._injectorRoot = this.$parent && this.$parent._injectorRoot || this;
                this._injectorRoot._injector && this._injectorRoot._injector.initComponent(this);
            }
        }
    });
    Object.defineProperty(Vue.prototype, '$injector', {
        get: function get() {
            return this._injectorRoot && this._injectorRoot._injector;
        }
    });
    // use simple mergeStrategies to prevent _injectorRoot instance lose '__proto__'
    var strats = Vue.config.optionMergeStrategies;
    strats._injectorRoot = function (parentVal, childVal) {
        return childVal === undefined ? parentVal : childVal;
    };
}

var ERROR_MESSAGE;
(function (ERROR_MESSAGE) {
    ERROR_MESSAGE["ERROR_000"] = "[@scandltd/vue-injector]:";
    ERROR_MESSAGE["ERROR_001"] = "@injectable can take only one parameter either {names}";
    ERROR_MESSAGE["ERROR_002"] = "function \"message\". Parameters in a string do not match those in array: ";
    ERROR_MESSAGE["ERROR_003"] = "not installed. Make sure to call `Vue.use(VueInjector)` before creating root instance.";
    ERROR_MESSAGE["ERROR_004"] = "providers are not objects";
    ERROR_MESSAGE["ERROR_005"] = "no decorator Injectable";
    ERROR_MESSAGE["ERROR_006"] = "useFactory invalid return";
    ERROR_MESSAGE["ERROR_007"] = "invalid useValue";
    ERROR_MESSAGE["ERROR_008"] = "{name} invalid type useFactory: must be 'function'";
    ERROR_MESSAGE["ERROR_009"] = "{method} is not a function";
})(ERROR_MESSAGE || (ERROR_MESSAGE = {}));
var WARNING_MESSAGE;
(function (WARNING_MESSAGE) {
    WARNING_MESSAGE["WARNING_000"] = "Wrong service registration. Service name: {name}.\n@injectable can take only one parameter either useFactory or useValue, but got {options}";
})(WARNING_MESSAGE || (WARNING_MESSAGE = {}));
function message(str, arg) {
    if (arg === void 0) {
        arg = {};
    }
    var spareParameters = Reflect.ownKeys(arg).filter(function (val) {
        return null === str.match(new RegExp("{" + String(val) + "}"));
    });
    if (spareParameters.length) {
        console.warn(ERROR_MESSAGE.ERROR_002 + spareParameters);
    }
    Object.keys(arg).forEach(function (key) {
        var regex = new RegExp("{" + key + "}");
        str = str.replace(regex, arg[key]);
    });
    return str;
}

function assert(condition, message$$1) {
    if (!condition) {
        throw new Error(ERROR_MESSAGE.ERROR_000 + " " + message$$1);
    }
}
function warn(condition, message$$1) {
    if (process.env.NODE_ENV !== 'production' && !condition) {
        typeof console !== 'undefined' && console.warn(ERROR_MESSAGE.ERROR_000 + " " + message$$1);
    }
}

var inBrowser = typeof window !== 'undefined';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
  return typeof obj;
} : function (obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
};

function checkObject(obj) {
    return !Array.isArray(obj) && (typeof obj === 'undefined' ? 'undefined' : _typeof(obj)) === 'object' && obj !== null;
}

var ServiceBinding = /** @class */function () {
    function ServiceBinding() {
        this.binging = null;
        this.name = null;
        this.strategy = null;
    }
    ServiceBinding.prototype.bind = function (strategy, binging, name) {
        this.strategy = strategy;
        this.binging = binging;
        this.name = name;
        return this;
    };
    ServiceBinding.prototype.to = function (target) {
        if (this.binging) {
            var injectService_1 = this.strategy.getService(this.binging);
            Reflect.defineProperty(target, this.name, {
                enumerable: true,
                configurable: false,
                get: function get() {
                    return injectService_1;
                }
            });
        }
        this.binging = null;
        return true;
    };
    ServiceBinding.prototype.get = function () {
        return this.strategy.getService(this.binging);
    };
    return ServiceBinding;
}();

var METADATA;
(function (METADATA) {
    METADATA["TYPE"] = "inject:type";
    METADATA["VALUE"] = "inject:value";
    METADATA["NAME"] = "inject:name";
    METADATA["SERVICE"] = "inject:service";
})(METADATA || (METADATA = {}));
var FACTORY_TYPES;
(function (FACTORY_TYPES) {
    FACTORY_TYPES["useFactory"] = "useFactory";
    FACTORY_TYPES["useValue"] = "useValue";
})(FACTORY_TYPES || (FACTORY_TYPES = {}));

var ServiceFactory = /** @class */function () {
    function ServiceFactory() {}
    ServiceFactory.prototype.make = function (Service) {
        var method = Reflect.getMetadata(METADATA.TYPE, Service);
        if (method) {
            if (typeof this[method] !== 'function') {
                throw assert(false, message(ERROR_MESSAGE.ERROR_009, { method: method }));
            }
            return this[method](Service);
        } else {
            return this.instance(Service);
        }
    };
    ServiceFactory.prototype.instance = function (Service) {
        return new Service();
    };
    ServiceFactory.prototype.useFactory = function (Service) {
        var name = Reflect.getMetadata(METADATA.NAME, Service);
        var factory = Reflect.getMetadata(METADATA.VALUE, Service);
        if (factory && typeof factory !== 'function') {
            throw assert(false, message(ERROR_MESSAGE.ERROR_008, { name: name }));
        }
        return factory;
    };
    ServiceFactory.prototype.useValue = function (Service) {
        var value = Reflect.getMetadata(METADATA.VALUE, Service);
        if (value) {
            return value;
        } else {
            assert(false, ERROR_MESSAGE.ERROR_007);
        }
    };
    return ServiceFactory;
}();

var Instance = /** @class */function () {
    function Instance() {}
    Instance.prototype.getService = function (service) {
        return service;
    };
    return Instance;
}();

var Factory = /** @class */function () {
    function Factory() {}
    Factory.prototype.getService = function (service) {
        var result = service();
        if (result) {
            return result;
        } else {
            throw assert(false, ERROR_MESSAGE.ERROR_006);
        }
    };
    return Factory;
}();

var Provider = /** @class */function () {
    function Provider(app, rootProviders) {
        this.rootProviders = [];
        this.serviceBinding = new ServiceBinding();
        this.serviceFactory = new ServiceFactory();
        this.app = app;
        this.rootProviders = rootProviders;
        this.services = new Map();
    }
    Provider.prototype.registerComponent = function (component) {
        var _this = this;
        if (component.hasOwnProperty('_providers')) {
            var providers_1 = component._providers;
            if (providers_1 && checkObject(providers_1)) {
                Object.keys(providers_1).forEach(function (name) {
                    if (providers_1 && providers_1.hasOwnProperty(name)) {
                        _this.binding(component, name, providers_1[name]);
                    }
                });
            } else {
                assert(false, ERROR_MESSAGE.ERROR_004);
            }
        }
        if (this.rootProviders.length) {
            this.rootProviders.forEach(function (provider) {
                if (Reflect.getMetadata(METADATA.SERVICE, provider)) {
                    var name = Reflect.getMetadata(METADATA.NAME, provider);
                    _this.binding(component, name, provider);
                }
            });
        }
    };
    Provider.prototype.registerService = function (name, Service) {
        if (Service.name === 'Vue') {
            return this.app;
        }
        if (!this.services.has(Service) && Reflect.getMetadata(METADATA.SERVICE, Service)) {
            if (Service.prototype.providers) {
                this.registerProviders(Service.prototype, Service.prototype.providers);
                delete Service.prototype.providers;
            }
            this.services.set(Service, this.serviceFactory.make(Service));
        }
        var service = this.services.get(Service);
        if (service) {
            return service;
        }
        throw assert(false, ERROR_MESSAGE.ERROR_005);
    };
    Provider.prototype.registerProviders = function (provider, imports) {
        var _this = this;
        if (checkObject(imports)) {
            Object.keys(imports).forEach(function (name) {
                _this.binding(provider, name, imports[name]);
            });
        } else {
            assert(false, ERROR_MESSAGE.ERROR_004);
        }
    };
    Provider.prototype.set = function (Service) {
        if (Reflect.getMetadata(METADATA.SERVICE, Service)) {
            this.registerService(Reflect.getMetadata(METADATA.NAME, Service), Service);
        }
    };
    Provider.prototype.get = function (Service) {
        if (Service.name === 'Vue') {
            return this.app;
        }
        if (!this.services.has(Service)) {
            this.set(Service);
        }
        return this.getting(Service);
    };
    Provider.prototype.getting = function (Service) {
        var name = Reflect.getMetadata(METADATA.NAME, Service);
        var service = this.services.get(Service);
        var strategy = this.getStrategy(Service);
        return this.serviceBinding.bind(strategy, service, name).get();
    };
    Provider.prototype.binding = function (target, name, Service) {
        var service = this.registerService(name, Service);
        var strategy = this.getStrategy(Service);
        this.serviceBinding.bind(strategy, service, name).to(target);
    };
    Provider.prototype.getStrategy = function (Service) {
        var type = Reflect.getMetadata(METADATA.TYPE, Service);
        switch (type) {
            case FACTORY_TYPES.useFactory:
                return new Factory();
            default:
                return new Instance();
        }
    };
    return Provider;
}();

var commonjsGlobal = typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

/*! *****************************************************************************
Copyright (C) Microsoft. All rights reserved.
Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at http://www.apache.org/licenses/LICENSE-2.0

THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
MERCHANTABLITY OR NON-INFRINGEMENT.

See the Apache Version 2.0 License for specific language governing permissions
and limitations under the License.
***************************************************************************** */
var Reflect$1;
(function (Reflect) {
    // Metadata Proposal
    // https://rbuckton.github.io/reflect-metadata/
    (function (factory) {
        var root = typeof commonjsGlobal === "object" ? commonjsGlobal :
            typeof self === "object" ? self :
                typeof this === "object" ? this :
                    Function("return this;")();
        var exporter = makeExporter(Reflect);
        if (typeof root.Reflect === "undefined") {
            root.Reflect = Reflect;
        }
        else {
            exporter = makeExporter(root.Reflect, exporter);
        }
        factory(exporter);
        function makeExporter(target, previous) {
            return function (key, value) {
                if (typeof target[key] !== "function") {
                    Object.defineProperty(target, key, { configurable: true, writable: true, value: value });
                }
                if (previous)
                    { previous(key, value); }
            };
        }
    })(function (exporter) {
        var hasOwn = Object.prototype.hasOwnProperty;
        // feature test for Symbol support
        var supportsSymbol = typeof Symbol === "function";
        var toPrimitiveSymbol = supportsSymbol && typeof Symbol.toPrimitive !== "undefined" ? Symbol.toPrimitive : "@@toPrimitive";
        var iteratorSymbol = supportsSymbol && typeof Symbol.iterator !== "undefined" ? Symbol.iterator : "@@iterator";
        var supportsCreate = typeof Object.create === "function"; // feature test for Object.create support
        var supportsProto = { __proto__: [] } instanceof Array; // feature test for __proto__ support
        var downLevel = !supportsCreate && !supportsProto;
        var HashMap = {
            // create an object in dictionary mode (a.k.a. "slow" mode in v8)
            create: supportsCreate
                ? function () { return MakeDictionary(Object.create(null)); }
                : supportsProto
                    ? function () { return MakeDictionary({ __proto__: null }); }
                    : function () { return MakeDictionary({}); },
            has: downLevel
                ? function (map, key) { return hasOwn.call(map, key); }
                : function (map, key) { return key in map; },
            get: downLevel
                ? function (map, key) { return hasOwn.call(map, key) ? map[key] : undefined; }
                : function (map, key) { return map[key]; },
        };
        // Load global or shim versions of Map, Set, and WeakMap
        var functionPrototype = Object.getPrototypeOf(Function);
        var usePolyfill = typeof process === "object" && process.env && process.env["REFLECT_METADATA_USE_MAP_POLYFILL"] === "true";
        var _Map = !usePolyfill && typeof Map === "function" && typeof Map.prototype.entries === "function" ? Map : CreateMapPolyfill();
        var _Set = !usePolyfill && typeof Set === "function" && typeof Set.prototype.entries === "function" ? Set : CreateSetPolyfill();
        var _WeakMap = !usePolyfill && typeof WeakMap === "function" ? WeakMap : CreateWeakMapPolyfill();
        // [[Metadata]] internal slot
        // https://rbuckton.github.io/reflect-metadata/#ordinary-object-internal-methods-and-internal-slots
        var Metadata = new _WeakMap();
        /**
         * Applies a set of decorators to a property of a target object.
         * @param decorators An array of decorators.
         * @param target The target object.
         * @param propertyKey (Optional) The property key to decorate.
         * @param attributes (Optional) The property descriptor for the target key.
         * @remarks Decorators are applied in reverse order.
         * @example
         *
         *     class Example {
         *         // property declarations are not part of ES6, though they are valid in TypeScript:
         *         // static staticProperty;
         *         // property;
         *
         *         constructor(p) { }
         *         static staticMethod(p) { }
         *         method(p) { }
         *     }
         *
         *     // constructor
         *     Example = Reflect.decorate(decoratorsArray, Example);
         *
         *     // property (on constructor)
         *     Reflect.decorate(decoratorsArray, Example, "staticProperty");
         *
         *     // property (on prototype)
         *     Reflect.decorate(decoratorsArray, Example.prototype, "property");
         *
         *     // method (on constructor)
         *     Object.defineProperty(Example, "staticMethod",
         *         Reflect.decorate(decoratorsArray, Example, "staticMethod",
         *             Object.getOwnPropertyDescriptor(Example, "staticMethod")));
         *
         *     // method (on prototype)
         *     Object.defineProperty(Example.prototype, "method",
         *         Reflect.decorate(decoratorsArray, Example.prototype, "method",
         *             Object.getOwnPropertyDescriptor(Example.prototype, "method")));
         *
         */
        function decorate(decorators, target, propertyKey, attributes) {
            if (!IsUndefined(propertyKey)) {
                if (!IsArray(decorators))
                    { throw new TypeError(); }
                if (!IsObject(target))
                    { throw new TypeError(); }
                if (!IsObject(attributes) && !IsUndefined(attributes) && !IsNull(attributes))
                    { throw new TypeError(); }
                if (IsNull(attributes))
                    { attributes = undefined; }
                propertyKey = ToPropertyKey(propertyKey);
                return DecorateProperty(decorators, target, propertyKey, attributes);
            }
            else {
                if (!IsArray(decorators))
                    { throw new TypeError(); }
                if (!IsConstructor(target))
                    { throw new TypeError(); }
                return DecorateConstructor(decorators, target);
            }
        }
        exporter("decorate", decorate);
        // 4.1.2 Reflect.metadata(metadataKey, metadataValue)
        // https://rbuckton.github.io/reflect-metadata/#reflect.metadata
        /**
         * A default metadata decorator factory that can be used on a class, class member, or parameter.
         * @param metadataKey The key for the metadata entry.
         * @param metadataValue The value for the metadata entry.
         * @returns A decorator function.
         * @remarks
         * If `metadataKey` is already defined for the target and target key, the
         * metadataValue for that key will be overwritten.
         * @example
         *
         *     // constructor
         *     @Reflect.metadata(key, value)
         *     class Example {
         *     }
         *
         *     // property (on constructor, TypeScript only)
         *     class Example {
         *         @Reflect.metadata(key, value)
         *         static staticProperty;
         *     }
         *
         *     // property (on prototype, TypeScript only)
         *     class Example {
         *         @Reflect.metadata(key, value)
         *         property;
         *     }
         *
         *     // method (on constructor)
         *     class Example {
         *         @Reflect.metadata(key, value)
         *         static staticMethod() { }
         *     }
         *
         *     // method (on prototype)
         *     class Example {
         *         @Reflect.metadata(key, value)
         *         method() { }
         *     }
         *
         */
        function metadata(metadataKey, metadataValue) {
            function decorator(target, propertyKey) {
                if (!IsObject(target))
                    { throw new TypeError(); }
                if (!IsUndefined(propertyKey) && !IsPropertyKey(propertyKey))
                    { throw new TypeError(); }
                OrdinaryDefineOwnMetadata(metadataKey, metadataValue, target, propertyKey);
            }
            return decorator;
        }
        exporter("metadata", metadata);
        /**
         * Define a unique metadata entry on the target.
         * @param metadataKey A key used to store and retrieve metadata.
         * @param metadataValue A value that contains attached metadata.
         * @param target The target object on which to define metadata.
         * @param propertyKey (Optional) The property key for the target.
         * @example
         *
         *     class Example {
         *         // property declarations are not part of ES6, though they are valid in TypeScript:
         *         // static staticProperty;
         *         // property;
         *
         *         constructor(p) { }
         *         static staticMethod(p) { }
         *         method(p) { }
         *     }
         *
         *     // constructor
         *     Reflect.defineMetadata("custom:annotation", options, Example);
         *
         *     // property (on constructor)
         *     Reflect.defineMetadata("custom:annotation", options, Example, "staticProperty");
         *
         *     // property (on prototype)
         *     Reflect.defineMetadata("custom:annotation", options, Example.prototype, "property");
         *
         *     // method (on constructor)
         *     Reflect.defineMetadata("custom:annotation", options, Example, "staticMethod");
         *
         *     // method (on prototype)
         *     Reflect.defineMetadata("custom:annotation", options, Example.prototype, "method");
         *
         *     // decorator factory as metadata-producing annotation.
         *     function MyAnnotation(options): Decorator {
         *         return (target, key?) => Reflect.defineMetadata("custom:annotation", options, target, key);
         *     }
         *
         */
        function defineMetadata(metadataKey, metadataValue, target, propertyKey) {
            if (!IsObject(target))
                { throw new TypeError(); }
            if (!IsUndefined(propertyKey))
                { propertyKey = ToPropertyKey(propertyKey); }
            return OrdinaryDefineOwnMetadata(metadataKey, metadataValue, target, propertyKey);
        }
        exporter("defineMetadata", defineMetadata);
        /**
         * Gets a value indicating whether the target object or its prototype chain has the provided metadata key defined.
         * @param metadataKey A key used to store and retrieve metadata.
         * @param target The target object on which the metadata is defined.
         * @param propertyKey (Optional) The property key for the target.
         * @returns `true` if the metadata key was defined on the target object or its prototype chain; otherwise, `false`.
         * @example
         *
         *     class Example {
         *         // property declarations are not part of ES6, though they are valid in TypeScript:
         *         // static staticProperty;
         *         // property;
         *
         *         constructor(p) { }
         *         static staticMethod(p) { }
         *         method(p) { }
         *     }
         *
         *     // constructor
         *     result = Reflect.hasMetadata("custom:annotation", Example);
         *
         *     // property (on constructor)
         *     result = Reflect.hasMetadata("custom:annotation", Example, "staticProperty");
         *
         *     // property (on prototype)
         *     result = Reflect.hasMetadata("custom:annotation", Example.prototype, "property");
         *
         *     // method (on constructor)
         *     result = Reflect.hasMetadata("custom:annotation", Example, "staticMethod");
         *
         *     // method (on prototype)
         *     result = Reflect.hasMetadata("custom:annotation", Example.prototype, "method");
         *
         */
        function hasMetadata(metadataKey, target, propertyKey) {
            if (!IsObject(target))
                { throw new TypeError(); }
            if (!IsUndefined(propertyKey))
                { propertyKey = ToPropertyKey(propertyKey); }
            return OrdinaryHasMetadata(metadataKey, target, propertyKey);
        }
        exporter("hasMetadata", hasMetadata);
        /**
         * Gets a value indicating whether the target object has the provided metadata key defined.
         * @param metadataKey A key used to store and retrieve metadata.
         * @param target The target object on which the metadata is defined.
         * @param propertyKey (Optional) The property key for the target.
         * @returns `true` if the metadata key was defined on the target object; otherwise, `false`.
         * @example
         *
         *     class Example {
         *         // property declarations are not part of ES6, though they are valid in TypeScript:
         *         // static staticProperty;
         *         // property;
         *
         *         constructor(p) { }
         *         static staticMethod(p) { }
         *         method(p) { }
         *     }
         *
         *     // constructor
         *     result = Reflect.hasOwnMetadata("custom:annotation", Example);
         *
         *     // property (on constructor)
         *     result = Reflect.hasOwnMetadata("custom:annotation", Example, "staticProperty");
         *
         *     // property (on prototype)
         *     result = Reflect.hasOwnMetadata("custom:annotation", Example.prototype, "property");
         *
         *     // method (on constructor)
         *     result = Reflect.hasOwnMetadata("custom:annotation", Example, "staticMethod");
         *
         *     // method (on prototype)
         *     result = Reflect.hasOwnMetadata("custom:annotation", Example.prototype, "method");
         *
         */
        function hasOwnMetadata(metadataKey, target, propertyKey) {
            if (!IsObject(target))
                { throw new TypeError(); }
            if (!IsUndefined(propertyKey))
                { propertyKey = ToPropertyKey(propertyKey); }
            return OrdinaryHasOwnMetadata(metadataKey, target, propertyKey);
        }
        exporter("hasOwnMetadata", hasOwnMetadata);
        /**
         * Gets the metadata value for the provided metadata key on the target object or its prototype chain.
         * @param metadataKey A key used to store and retrieve metadata.
         * @param target The target object on which the metadata is defined.
         * @param propertyKey (Optional) The property key for the target.
         * @returns The metadata value for the metadata key if found; otherwise, `undefined`.
         * @example
         *
         *     class Example {
         *         // property declarations are not part of ES6, though they are valid in TypeScript:
         *         // static staticProperty;
         *         // property;
         *
         *         constructor(p) { }
         *         static staticMethod(p) { }
         *         method(p) { }
         *     }
         *
         *     // constructor
         *     result = Reflect.getMetadata("custom:annotation", Example);
         *
         *     // property (on constructor)
         *     result = Reflect.getMetadata("custom:annotation", Example, "staticProperty");
         *
         *     // property (on prototype)
         *     result = Reflect.getMetadata("custom:annotation", Example.prototype, "property");
         *
         *     // method (on constructor)
         *     result = Reflect.getMetadata("custom:annotation", Example, "staticMethod");
         *
         *     // method (on prototype)
         *     result = Reflect.getMetadata("custom:annotation", Example.prototype, "method");
         *
         */
        function getMetadata(metadataKey, target, propertyKey) {
            if (!IsObject(target))
                { throw new TypeError(); }
            if (!IsUndefined(propertyKey))
                { propertyKey = ToPropertyKey(propertyKey); }
            return OrdinaryGetMetadata(metadataKey, target, propertyKey);
        }
        exporter("getMetadata", getMetadata);
        /**
         * Gets the metadata value for the provided metadata key on the target object.
         * @param metadataKey A key used to store and retrieve metadata.
         * @param target The target object on which the metadata is defined.
         * @param propertyKey (Optional) The property key for the target.
         * @returns The metadata value for the metadata key if found; otherwise, `undefined`.
         * @example
         *
         *     class Example {
         *         // property declarations are not part of ES6, though they are valid in TypeScript:
         *         // static staticProperty;
         *         // property;
         *
         *         constructor(p) { }
         *         static staticMethod(p) { }
         *         method(p) { }
         *     }
         *
         *     // constructor
         *     result = Reflect.getOwnMetadata("custom:annotation", Example);
         *
         *     // property (on constructor)
         *     result = Reflect.getOwnMetadata("custom:annotation", Example, "staticProperty");
         *
         *     // property (on prototype)
         *     result = Reflect.getOwnMetadata("custom:annotation", Example.prototype, "property");
         *
         *     // method (on constructor)
         *     result = Reflect.getOwnMetadata("custom:annotation", Example, "staticMethod");
         *
         *     // method (on prototype)
         *     result = Reflect.getOwnMetadata("custom:annotation", Example.prototype, "method");
         *
         */
        function getOwnMetadata(metadataKey, target, propertyKey) {
            if (!IsObject(target))
                { throw new TypeError(); }
            if (!IsUndefined(propertyKey))
                { propertyKey = ToPropertyKey(propertyKey); }
            return OrdinaryGetOwnMetadata(metadataKey, target, propertyKey);
        }
        exporter("getOwnMetadata", getOwnMetadata);
        /**
         * Gets the metadata keys defined on the target object or its prototype chain.
         * @param target The target object on which the metadata is defined.
         * @param propertyKey (Optional) The property key for the target.
         * @returns An array of unique metadata keys.
         * @example
         *
         *     class Example {
         *         // property declarations are not part of ES6, though they are valid in TypeScript:
         *         // static staticProperty;
         *         // property;
         *
         *         constructor(p) { }
         *         static staticMethod(p) { }
         *         method(p) { }
         *     }
         *
         *     // constructor
         *     result = Reflect.getMetadataKeys(Example);
         *
         *     // property (on constructor)
         *     result = Reflect.getMetadataKeys(Example, "staticProperty");
         *
         *     // property (on prototype)
         *     result = Reflect.getMetadataKeys(Example.prototype, "property");
         *
         *     // method (on constructor)
         *     result = Reflect.getMetadataKeys(Example, "staticMethod");
         *
         *     // method (on prototype)
         *     result = Reflect.getMetadataKeys(Example.prototype, "method");
         *
         */
        function getMetadataKeys(target, propertyKey) {
            if (!IsObject(target))
                { throw new TypeError(); }
            if (!IsUndefined(propertyKey))
                { propertyKey = ToPropertyKey(propertyKey); }
            return OrdinaryMetadataKeys(target, propertyKey);
        }
        exporter("getMetadataKeys", getMetadataKeys);
        /**
         * Gets the unique metadata keys defined on the target object.
         * @param target The target object on which the metadata is defined.
         * @param propertyKey (Optional) The property key for the target.
         * @returns An array of unique metadata keys.
         * @example
         *
         *     class Example {
         *         // property declarations are not part of ES6, though they are valid in TypeScript:
         *         // static staticProperty;
         *         // property;
         *
         *         constructor(p) { }
         *         static staticMethod(p) { }
         *         method(p) { }
         *     }
         *
         *     // constructor
         *     result = Reflect.getOwnMetadataKeys(Example);
         *
         *     // property (on constructor)
         *     result = Reflect.getOwnMetadataKeys(Example, "staticProperty");
         *
         *     // property (on prototype)
         *     result = Reflect.getOwnMetadataKeys(Example.prototype, "property");
         *
         *     // method (on constructor)
         *     result = Reflect.getOwnMetadataKeys(Example, "staticMethod");
         *
         *     // method (on prototype)
         *     result = Reflect.getOwnMetadataKeys(Example.prototype, "method");
         *
         */
        function getOwnMetadataKeys(target, propertyKey) {
            if (!IsObject(target))
                { throw new TypeError(); }
            if (!IsUndefined(propertyKey))
                { propertyKey = ToPropertyKey(propertyKey); }
            return OrdinaryOwnMetadataKeys(target, propertyKey);
        }
        exporter("getOwnMetadataKeys", getOwnMetadataKeys);
        /**
         * Deletes the metadata entry from the target object with the provided key.
         * @param metadataKey A key used to store and retrieve metadata.
         * @param target The target object on which the metadata is defined.
         * @param propertyKey (Optional) The property key for the target.
         * @returns `true` if the metadata entry was found and deleted; otherwise, false.
         * @example
         *
         *     class Example {
         *         // property declarations are not part of ES6, though they are valid in TypeScript:
         *         // static staticProperty;
         *         // property;
         *
         *         constructor(p) { }
         *         static staticMethod(p) { }
         *         method(p) { }
         *     }
         *
         *     // constructor
         *     result = Reflect.deleteMetadata("custom:annotation", Example);
         *
         *     // property (on constructor)
         *     result = Reflect.deleteMetadata("custom:annotation", Example, "staticProperty");
         *
         *     // property (on prototype)
         *     result = Reflect.deleteMetadata("custom:annotation", Example.prototype, "property");
         *
         *     // method (on constructor)
         *     result = Reflect.deleteMetadata("custom:annotation", Example, "staticMethod");
         *
         *     // method (on prototype)
         *     result = Reflect.deleteMetadata("custom:annotation", Example.prototype, "method");
         *
         */
        function deleteMetadata(metadataKey, target, propertyKey) {
            if (!IsObject(target))
                { throw new TypeError(); }
            if (!IsUndefined(propertyKey))
                { propertyKey = ToPropertyKey(propertyKey); }
            var metadataMap = GetOrCreateMetadataMap(target, propertyKey, /*Create*/ false);
            if (IsUndefined(metadataMap))
                { return false; }
            if (!metadataMap.delete(metadataKey))
                { return false; }
            if (metadataMap.size > 0)
                { return true; }
            var targetMetadata = Metadata.get(target);
            targetMetadata.delete(propertyKey);
            if (targetMetadata.size > 0)
                { return true; }
            Metadata.delete(target);
            return true;
        }
        exporter("deleteMetadata", deleteMetadata);
        function DecorateConstructor(decorators, target) {
            for (var i = decorators.length - 1; i >= 0; --i) {
                var decorator = decorators[i];
                var decorated = decorator(target);
                if (!IsUndefined(decorated) && !IsNull(decorated)) {
                    if (!IsConstructor(decorated))
                        { throw new TypeError(); }
                    target = decorated;
                }
            }
            return target;
        }
        function DecorateProperty(decorators, target, propertyKey, descriptor) {
            for (var i = decorators.length - 1; i >= 0; --i) {
                var decorator = decorators[i];
                var decorated = decorator(target, propertyKey, descriptor);
                if (!IsUndefined(decorated) && !IsNull(decorated)) {
                    if (!IsObject(decorated))
                        { throw new TypeError(); }
                    descriptor = decorated;
                }
            }
            return descriptor;
        }
        function GetOrCreateMetadataMap(O, P, Create) {
            var targetMetadata = Metadata.get(O);
            if (IsUndefined(targetMetadata)) {
                if (!Create)
                    { return undefined; }
                targetMetadata = new _Map();
                Metadata.set(O, targetMetadata);
            }
            var metadataMap = targetMetadata.get(P);
            if (IsUndefined(metadataMap)) {
                if (!Create)
                    { return undefined; }
                metadataMap = new _Map();
                targetMetadata.set(P, metadataMap);
            }
            return metadataMap;
        }
        // 3.1.1.1 OrdinaryHasMetadata(MetadataKey, O, P)
        // https://rbuckton.github.io/reflect-metadata/#ordinaryhasmetadata
        function OrdinaryHasMetadata(MetadataKey, O, P) {
            var hasOwn = OrdinaryHasOwnMetadata(MetadataKey, O, P);
            if (hasOwn)
                { return true; }
            var parent = OrdinaryGetPrototypeOf(O);
            if (!IsNull(parent))
                { return OrdinaryHasMetadata(MetadataKey, parent, P); }
            return false;
        }
        // 3.1.2.1 OrdinaryHasOwnMetadata(MetadataKey, O, P)
        // https://rbuckton.github.io/reflect-metadata/#ordinaryhasownmetadata
        function OrdinaryHasOwnMetadata(MetadataKey, O, P) {
            var metadataMap = GetOrCreateMetadataMap(O, P, /*Create*/ false);
            if (IsUndefined(metadataMap))
                { return false; }
            return ToBoolean(metadataMap.has(MetadataKey));
        }
        // 3.1.3.1 OrdinaryGetMetadata(MetadataKey, O, P)
        // https://rbuckton.github.io/reflect-metadata/#ordinarygetmetadata
        function OrdinaryGetMetadata(MetadataKey, O, P) {
            var hasOwn = OrdinaryHasOwnMetadata(MetadataKey, O, P);
            if (hasOwn)
                { return OrdinaryGetOwnMetadata(MetadataKey, O, P); }
            var parent = OrdinaryGetPrototypeOf(O);
            if (!IsNull(parent))
                { return OrdinaryGetMetadata(MetadataKey, parent, P); }
            return undefined;
        }
        // 3.1.4.1 OrdinaryGetOwnMetadata(MetadataKey, O, P)
        // https://rbuckton.github.io/reflect-metadata/#ordinarygetownmetadata
        function OrdinaryGetOwnMetadata(MetadataKey, O, P) {
            var metadataMap = GetOrCreateMetadataMap(O, P, /*Create*/ false);
            if (IsUndefined(metadataMap))
                { return undefined; }
            return metadataMap.get(MetadataKey);
        }
        // 3.1.5.1 OrdinaryDefineOwnMetadata(MetadataKey, MetadataValue, O, P)
        // https://rbuckton.github.io/reflect-metadata/#ordinarydefineownmetadata
        function OrdinaryDefineOwnMetadata(MetadataKey, MetadataValue, O, P) {
            var metadataMap = GetOrCreateMetadataMap(O, P, /*Create*/ true);
            metadataMap.set(MetadataKey, MetadataValue);
        }
        // 3.1.6.1 OrdinaryMetadataKeys(O, P)
        // https://rbuckton.github.io/reflect-metadata/#ordinarymetadatakeys
        function OrdinaryMetadataKeys(O, P) {
            var ownKeys = OrdinaryOwnMetadataKeys(O, P);
            var parent = OrdinaryGetPrototypeOf(O);
            if (parent === null)
                { return ownKeys; }
            var parentKeys = OrdinaryMetadataKeys(parent, P);
            if (parentKeys.length <= 0)
                { return ownKeys; }
            if (ownKeys.length <= 0)
                { return parentKeys; }
            var set = new _Set();
            var keys = [];
            for (var _i = 0, ownKeys_1 = ownKeys; _i < ownKeys_1.length; _i++) {
                var key = ownKeys_1[_i];
                var hasKey = set.has(key);
                if (!hasKey) {
                    set.add(key);
                    keys.push(key);
                }
            }
            for (var _a = 0, parentKeys_1 = parentKeys; _a < parentKeys_1.length; _a++) {
                var key = parentKeys_1[_a];
                var hasKey = set.has(key);
                if (!hasKey) {
                    set.add(key);
                    keys.push(key);
                }
            }
            return keys;
        }
        // 3.1.7.1 OrdinaryOwnMetadataKeys(O, P)
        // https://rbuckton.github.io/reflect-metadata/#ordinaryownmetadatakeys
        function OrdinaryOwnMetadataKeys(O, P) {
            var keys = [];
            var metadataMap = GetOrCreateMetadataMap(O, P, /*Create*/ false);
            if (IsUndefined(metadataMap))
                { return keys; }
            var keysObj = metadataMap.keys();
            var iterator = GetIterator(keysObj);
            var k = 0;
            while (true) {
                var next = IteratorStep(iterator);
                if (!next) {
                    keys.length = k;
                    return keys;
                }
                var nextValue = IteratorValue(next);
                try {
                    keys[k] = nextValue;
                }
                catch (e) {
                    try {
                        IteratorClose(iterator);
                    }
                    finally {
                        throw e;
                    }
                }
                k++;
            }
        }
        // 6 ECMAScript Data Typ0es and Values
        // https://tc39.github.io/ecma262/#sec-ecmascript-data-types-and-values
        function Type(x) {
            if (x === null)
                { return 1 /* Null */; }
            switch (typeof x) {
                case "undefined": return 0 /* Undefined */;
                case "boolean": return 2 /* Boolean */;
                case "string": return 3 /* String */;
                case "symbol": return 4 /* Symbol */;
                case "number": return 5 /* Number */;
                case "object": return x === null ? 1 /* Null */ : 6 /* Object */;
                default: return 6 /* Object */;
            }
        }
        // 6.1.1 The Undefined Type
        // https://tc39.github.io/ecma262/#sec-ecmascript-language-types-undefined-type
        function IsUndefined(x) {
            return x === undefined;
        }
        // 6.1.2 The Null Type
        // https://tc39.github.io/ecma262/#sec-ecmascript-language-types-null-type
        function IsNull(x) {
            return x === null;
        }
        // 6.1.5 The Symbol Type
        // https://tc39.github.io/ecma262/#sec-ecmascript-language-types-symbol-type
        function IsSymbol(x) {
            return typeof x === "symbol";
        }
        // 6.1.7 The Object Type
        // https://tc39.github.io/ecma262/#sec-object-type
        function IsObject(x) {
            return typeof x === "object" ? x !== null : typeof x === "function";
        }
        // 7.1 Type Conversion
        // https://tc39.github.io/ecma262/#sec-type-conversion
        // 7.1.1 ToPrimitive(input [, PreferredType])
        // https://tc39.github.io/ecma262/#sec-toprimitive
        function ToPrimitive(input, PreferredType) {
            switch (Type(input)) {
                case 0 /* Undefined */: return input;
                case 1 /* Null */: return input;
                case 2 /* Boolean */: return input;
                case 3 /* String */: return input;
                case 4 /* Symbol */: return input;
                case 5 /* Number */: return input;
            }
            var hint = PreferredType === 3 /* String */ ? "string" : PreferredType === 5 /* Number */ ? "number" : "default";
            var exoticToPrim = GetMethod(input, toPrimitiveSymbol);
            if (exoticToPrim !== undefined) {
                var result = exoticToPrim.call(input, hint);
                if (IsObject(result))
                    { throw new TypeError(); }
                return result;
            }
            return OrdinaryToPrimitive(input, hint === "default" ? "number" : hint);
        }
        // 7.1.1.1 OrdinaryToPrimitive(O, hint)
        // https://tc39.github.io/ecma262/#sec-ordinarytoprimitive
        function OrdinaryToPrimitive(O, hint) {
            if (hint === "string") {
                var toString_1 = O.toString;
                if (IsCallable(toString_1)) {
                    var result = toString_1.call(O);
                    if (!IsObject(result))
                        { return result; }
                }
                var valueOf = O.valueOf;
                if (IsCallable(valueOf)) {
                    var result = valueOf.call(O);
                    if (!IsObject(result))
                        { return result; }
                }
            }
            else {
                var valueOf = O.valueOf;
                if (IsCallable(valueOf)) {
                    var result = valueOf.call(O);
                    if (!IsObject(result))
                        { return result; }
                }
                var toString_2 = O.toString;
                if (IsCallable(toString_2)) {
                    var result = toString_2.call(O);
                    if (!IsObject(result))
                        { return result; }
                }
            }
            throw new TypeError();
        }
        // 7.1.2 ToBoolean(argument)
        // https://tc39.github.io/ecma262/2016/#sec-toboolean
        function ToBoolean(argument) {
            return !!argument;
        }
        // 7.1.12 ToString(argument)
        // https://tc39.github.io/ecma262/#sec-tostring
        function ToString(argument) {
            return "" + argument;
        }
        // 7.1.14 ToPropertyKey(argument)
        // https://tc39.github.io/ecma262/#sec-topropertykey
        function ToPropertyKey(argument) {
            var key = ToPrimitive(argument, 3 /* String */);
            if (IsSymbol(key))
                { return key; }
            return ToString(key);
        }
        // 7.2 Testing and Comparison Operations
        // https://tc39.github.io/ecma262/#sec-testing-and-comparison-operations
        // 7.2.2 IsArray(argument)
        // https://tc39.github.io/ecma262/#sec-isarray
        function IsArray(argument) {
            return Array.isArray
                ? Array.isArray(argument)
                : argument instanceof Object
                    ? argument instanceof Array
                    : Object.prototype.toString.call(argument) === "[object Array]";
        }
        // 7.2.3 IsCallable(argument)
        // https://tc39.github.io/ecma262/#sec-iscallable
        function IsCallable(argument) {
            // NOTE: This is an approximation as we cannot check for [[Call]] internal method.
            return typeof argument === "function";
        }
        // 7.2.4 IsConstructor(argument)
        // https://tc39.github.io/ecma262/#sec-isconstructor
        function IsConstructor(argument) {
            // NOTE: This is an approximation as we cannot check for [[Construct]] internal method.
            return typeof argument === "function";
        }
        // 7.2.7 IsPropertyKey(argument)
        // https://tc39.github.io/ecma262/#sec-ispropertykey
        function IsPropertyKey(argument) {
            switch (Type(argument)) {
                case 3 /* String */: return true;
                case 4 /* Symbol */: return true;
                default: return false;
            }
        }
        // 7.3 Operations on Objects
        // https://tc39.github.io/ecma262/#sec-operations-on-objects
        // 7.3.9 GetMethod(V, P)
        // https://tc39.github.io/ecma262/#sec-getmethod
        function GetMethod(V, P) {
            var func = V[P];
            if (func === undefined || func === null)
                { return undefined; }
            if (!IsCallable(func))
                { throw new TypeError(); }
            return func;
        }
        // 7.4 Operations on Iterator Objects
        // https://tc39.github.io/ecma262/#sec-operations-on-iterator-objects
        function GetIterator(obj) {
            var method = GetMethod(obj, iteratorSymbol);
            if (!IsCallable(method))
                { throw new TypeError(); } // from Call
            var iterator = method.call(obj);
            if (!IsObject(iterator))
                { throw new TypeError(); }
            return iterator;
        }
        // 7.4.4 IteratorValue(iterResult)
        // https://tc39.github.io/ecma262/2016/#sec-iteratorvalue
        function IteratorValue(iterResult) {
            return iterResult.value;
        }
        // 7.4.5 IteratorStep(iterator)
        // https://tc39.github.io/ecma262/#sec-iteratorstep
        function IteratorStep(iterator) {
            var result = iterator.next();
            return result.done ? false : result;
        }
        // 7.4.6 IteratorClose(iterator, completion)
        // https://tc39.github.io/ecma262/#sec-iteratorclose
        function IteratorClose(iterator) {
            var f = iterator["return"];
            if (f)
                { f.call(iterator); }
        }
        // 9.1 Ordinary Object Internal Methods and Internal Slots
        // https://tc39.github.io/ecma262/#sec-ordinary-object-internal-methods-and-internal-slots
        // 9.1.1.1 OrdinaryGetPrototypeOf(O)
        // https://tc39.github.io/ecma262/#sec-ordinarygetprototypeof
        function OrdinaryGetPrototypeOf(O) {
            var proto = Object.getPrototypeOf(O);
            if (typeof O !== "function" || O === functionPrototype)
                { return proto; }
            // TypeScript doesn't set __proto__ in ES5, as it's non-standard.
            // Try to determine the superclass constructor. Compatible implementations
            // must either set __proto__ on a subclass constructor to the superclass constructor,
            // or ensure each class has a valid `constructor` property on its prototype that
            // points back to the constructor.
            // If this is not the same as Function.[[Prototype]], then this is definately inherited.
            // This is the case when in ES6 or when using __proto__ in a compatible browser.
            if (proto !== functionPrototype)
                { return proto; }
            // If the super prototype is Object.prototype, null, or undefined, then we cannot determine the heritage.
            var prototype = O.prototype;
            var prototypeProto = prototype && Object.getPrototypeOf(prototype);
            if (prototypeProto == null || prototypeProto === Object.prototype)
                { return proto; }
            // If the constructor was not a function, then we cannot determine the heritage.
            var constructor = prototypeProto.constructor;
            if (typeof constructor !== "function")
                { return proto; }
            // If we have some kind of self-reference, then we cannot determine the heritage.
            if (constructor === O)
                { return proto; }
            // we have a pretty good guess at the heritage.
            return constructor;
        }
        // naive Map shim
        function CreateMapPolyfill() {
            var cacheSentinel = {};
            var arraySentinel = [];
            var MapIterator = /** @class */ (function () {
                function MapIterator(keys, values, selector) {
                    this._index = 0;
                    this._keys = keys;
                    this._values = values;
                    this._selector = selector;
                }
                MapIterator.prototype["@@iterator"] = function () { return this; };
                MapIterator.prototype[iteratorSymbol] = function () { return this; };
                MapIterator.prototype.next = function () {
                    var index = this._index;
                    if (index >= 0 && index < this._keys.length) {
                        var result = this._selector(this._keys[index], this._values[index]);
                        if (index + 1 >= this._keys.length) {
                            this._index = -1;
                            this._keys = arraySentinel;
                            this._values = arraySentinel;
                        }
                        else {
                            this._index++;
                        }
                        return { value: result, done: false };
                    }
                    return { value: undefined, done: true };
                };
                MapIterator.prototype.throw = function (error) {
                    if (this._index >= 0) {
                        this._index = -1;
                        this._keys = arraySentinel;
                        this._values = arraySentinel;
                    }
                    throw error;
                };
                MapIterator.prototype.return = function (value) {
                    if (this._index >= 0) {
                        this._index = -1;
                        this._keys = arraySentinel;
                        this._values = arraySentinel;
                    }
                    return { value: value, done: true };
                };
                return MapIterator;
            }());
            return /** @class */ (function () {
                function Map() {
                    this._keys = [];
                    this._values = [];
                    this._cacheKey = cacheSentinel;
                    this._cacheIndex = -2;
                }
                Object.defineProperty(Map.prototype, "size", {
                    get: function () { return this._keys.length; },
                    enumerable: true,
                    configurable: true
                });
                Map.prototype.has = function (key) { return this._find(key, /*insert*/ false) >= 0; };
                Map.prototype.get = function (key) {
                    var index = this._find(key, /*insert*/ false);
                    return index >= 0 ? this._values[index] : undefined;
                };
                Map.prototype.set = function (key, value) {
                    var index = this._find(key, /*insert*/ true);
                    this._values[index] = value;
                    return this;
                };
                Map.prototype.delete = function (key) {
                    var this$1 = this;

                    var index = this._find(key, /*insert*/ false);
                    if (index >= 0) {
                        var size = this._keys.length;
                        for (var i = index + 1; i < size; i++) {
                            this$1._keys[i - 1] = this$1._keys[i];
                            this$1._values[i - 1] = this$1._values[i];
                        }
                        this._keys.length--;
                        this._values.length--;
                        if (key === this._cacheKey) {
                            this._cacheKey = cacheSentinel;
                            this._cacheIndex = -2;
                        }
                        return true;
                    }
                    return false;
                };
                Map.prototype.clear = function () {
                    this._keys.length = 0;
                    this._values.length = 0;
                    this._cacheKey = cacheSentinel;
                    this._cacheIndex = -2;
                };
                Map.prototype.keys = function () { return new MapIterator(this._keys, this._values, getKey); };
                Map.prototype.values = function () { return new MapIterator(this._keys, this._values, getValue); };
                Map.prototype.entries = function () { return new MapIterator(this._keys, this._values, getEntry); };
                Map.prototype["@@iterator"] = function () { return this.entries(); };
                Map.prototype[iteratorSymbol] = function () { return this.entries(); };
                Map.prototype._find = function (key, insert) {
                    if (this._cacheKey !== key) {
                        this._cacheIndex = this._keys.indexOf(this._cacheKey = key);
                    }
                    if (this._cacheIndex < 0 && insert) {
                        this._cacheIndex = this._keys.length;
                        this._keys.push(key);
                        this._values.push(undefined);
                    }
                    return this._cacheIndex;
                };
                return Map;
            }());
            function getKey(key, _) {
                return key;
            }
            function getValue(_, value) {
                return value;
            }
            function getEntry(key, value) {
                return [key, value];
            }
        }
        // naive Set shim
        function CreateSetPolyfill() {
            return /** @class */ (function () {
                function Set() {
                    this._map = new _Map();
                }
                Object.defineProperty(Set.prototype, "size", {
                    get: function () { return this._map.size; },
                    enumerable: true,
                    configurable: true
                });
                Set.prototype.has = function (value) { return this._map.has(value); };
                Set.prototype.add = function (value) { return this._map.set(value, value), this; };
                Set.prototype.delete = function (value) { return this._map.delete(value); };
                Set.prototype.clear = function () { this._map.clear(); };
                Set.prototype.keys = function () { return this._map.keys(); };
                Set.prototype.values = function () { return this._map.values(); };
                Set.prototype.entries = function () { return this._map.entries(); };
                Set.prototype["@@iterator"] = function () { return this.keys(); };
                Set.prototype[iteratorSymbol] = function () { return this.keys(); };
                return Set;
            }());
        }
        // naive WeakMap shim
        function CreateWeakMapPolyfill() {
            var UUID_SIZE = 16;
            var keys = HashMap.create();
            var rootKey = CreateUniqueKey();
            return /** @class */ (function () {
                function WeakMap() {
                    this._key = CreateUniqueKey();
                }
                WeakMap.prototype.has = function (target) {
                    var table = GetOrCreateWeakMapTable(target, /*create*/ false);
                    return table !== undefined ? HashMap.has(table, this._key) : false;
                };
                WeakMap.prototype.get = function (target) {
                    var table = GetOrCreateWeakMapTable(target, /*create*/ false);
                    return table !== undefined ? HashMap.get(table, this._key) : undefined;
                };
                WeakMap.prototype.set = function (target, value) {
                    var table = GetOrCreateWeakMapTable(target, /*create*/ true);
                    table[this._key] = value;
                    return this;
                };
                WeakMap.prototype.delete = function (target) {
                    var table = GetOrCreateWeakMapTable(target, /*create*/ false);
                    return table !== undefined ? delete table[this._key] : false;
                };
                WeakMap.prototype.clear = function () {
                    // NOTE: not a real clear, just makes the previous data unreachable
                    this._key = CreateUniqueKey();
                };
                return WeakMap;
            }());
            function CreateUniqueKey() {
                var key;
                do
                    { key = "@@WeakMap@@" + CreateUUID(); }
                while (HashMap.has(keys, key));
                keys[key] = true;
                return key;
            }
            function GetOrCreateWeakMapTable(target, create) {
                if (!hasOwn.call(target, rootKey)) {
                    if (!create)
                        { return undefined; }
                    Object.defineProperty(target, rootKey, { value: HashMap.create() });
                }
                return target[rootKey];
            }
            function FillRandomBytes(buffer, size) {
                for (var i = 0; i < size; ++i)
                    { buffer[i] = Math.random() * 0xff | 0; }
                return buffer;
            }
            function GenRandomBytes(size) {
                if (typeof Uint8Array === "function") {
                    if (typeof crypto !== "undefined")
                        { return crypto.getRandomValues(new Uint8Array(size)); }
                    if (typeof msCrypto !== "undefined")
                        { return msCrypto.getRandomValues(new Uint8Array(size)); }
                    return FillRandomBytes(new Uint8Array(size), size);
                }
                return FillRandomBytes(new Array(size), size);
            }
            function CreateUUID() {
                var data = GenRandomBytes(UUID_SIZE);
                // mark as random - RFC 4122 § 4.4
                data[6] = data[6] & 0x4f | 0x40;
                data[8] = data[8] & 0xbf | 0x80;
                var result = "";
                for (var offset = 0; offset < UUID_SIZE; ++offset) {
                    var byte = data[offset];
                    if (offset === 4 || offset === 6 || offset === 8)
                        { result += "-"; }
                    if (byte < 16)
                        { result += "0"; }
                    result += byte.toString(16).toLowerCase();
                }
                return result;
            }
        }
        // uses a heuristic used by v8 and chakra to force an object into dictionary mode.
        function MakeDictionary(obj) {
            obj.__ = undefined;
            delete obj.__;
            return obj;
        }
    });
})(Reflect$1 || (Reflect$1 = {}));

function injectableFactory(target, options) {
    if (options === void 0) {
        options = {};
    }
    function getServiceType(options) {
        var optionKeys = Reflect.ownKeys(options);
        var whitelist = Reflect.ownKeys(FACTORY_TYPES);
        // checks whether all options given are allowed. Allowed options (useValue, useFactory)
        var checkOtherProperty = !optionKeys.every(function (prop) {
            return !!~whitelist.indexOf(prop);
        });
        if (checkOtherProperty) {
            var msg = message(WARNING_MESSAGE.WARNING_000, { name: target.name, options: JSON.stringify(options) });
            warn(false, msg);
        }
        var findProps = whitelist.filter(function (props) {
            return Reflect.has(options, props);
        });
        if (findProps.length > 1) {
            throw assert(false, message(ERROR_MESSAGE.ERROR_001, { names: JSON.stringify(whitelist) }));
        }
        var type = whitelist.find(function (props) {
            return Reflect.has(options, props);
        });
        if (type) {
            return FACTORY_TYPES[type];
        }
        return null;
    }
    var serviceType = getServiceType(options);
    if (serviceType) {
        Reflect.defineMetadata(METADATA.TYPE, serviceType, target);
        Reflect.defineMetadata(METADATA.VALUE, options[serviceType], target);
    }
    Reflect.defineMetadata(METADATA.NAME, target.name, target);
    Reflect.defineMetadata(METADATA.SERVICE, true, target);
    var decorators = target.__decorators__;
    if (decorators) {
        decorators.forEach(function (fn) {
            return fn(target.prototype);
        });
        delete target.__decorators__;
    }
    return target;
}
function Injectable(options) {
    if (typeof options === 'function') {
        return injectableFactory(options);
    }
    return function (target) {
        return injectableFactory(target, options);
    };
}

function createDecorator(factory) {
    return function (target, key) {
        var Ctor = typeof target === 'function' ? target : target.constructor;
        var descriptor = {
            enumerable: true,
            configurable: true,
            initializer: function initializer() {
                return this.__proto__[key];
            }
        };
        Reflect.defineProperty(target, key, descriptor);
        (Ctor.__decorators__ || (Ctor.__decorators__ = [])).push(function (options) {
            return factory(options, key);
        });
        return descriptor;
    };
}

function Inject(service) {
    return createDecorator(function (target, keyProp) {
        (target.providers || (target.providers = {}))[keyProp] = service;
    });
}

var VueInjector = /** @class */function () {
    function VueInjector(options) {
        if (options === void 0) {
            options = {};
        }
        this.rootProviders = [];
        this.app = null;
        this.provider = null;
        this.apps = [];
        this.rootProviders = options.root || [];
        if (options.store) {
            options.store.$injector = this;
        }
    }
    Object.defineProperty(VueInjector, "app", {
        get: function get() {
            return this;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(VueInjector.prototype, "install", {
        get: function get() {
            return VueInjector.install;
        },
        enumerable: true,
        configurable: true
    });
    VueInjector.prototype.init = function (app) {
        process.env.NODE_ENV !== 'production' && assert(install.installed, ERROR_MESSAGE.ERROR_003);
        this.apps.push(app);
        // main app already initialized.
        if (this.app) {
            return;
        }
        this.app = app;
        this.provider = new Provider(this.app, this.rootProviders);
    };
    VueInjector.prototype.initComponent = function (component) {
        this.provider && this.provider.registerComponent(component);
    };
    VueInjector.prototype.get = function (Provider$$1) {
        return this.provider && this.provider.get(Provider$$1);
    };
    return VueInjector;
}();
VueInjector.install = install;
VueInjector.version = '2.1.2';
if (inBrowser && window.Vue) {
    window.Vue.use(VueInjector);
}

exports.Injectable = Injectable;
exports.Inject = Inject;
exports.default = VueInjector;
