/*!
 * 
 *   @scandltd/vue-injector v3.2.6
 *   (c) 2019 Scandltd
 *   @license GPL-2.0
 * 
 */
module.exports =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);

// CONCATENATED MODULE: ./src/install.ts
/* eslint-disable import/no-mutable-exports */
var $Vue;
function install(Vue) {
    if (install.installed && $Vue === Vue)
        return;
    install.installed = true;
    $Vue = Vue;
    var isDef = function (v) { return v !== undefined; };
    Vue.mixin({
        beforeCreate: function () {
            if (isDef(this.$options.providers)) {
                this._providers = this.$options.providers;
            }
            if (isDef(this.$options.injector)) {
                this._injectorRoot = this;
                this._injector = this.$options.injector;
                this._injector.init(this);
            }
            else {
                this._injectorRoot = (this.$parent && this.$parent._injectorRoot) || this;
                if (this._injectorRoot._injector)
                    this._injectorRoot._injector.initComponent(this);
            }
        }
    });
    Object.defineProperty(Vue.prototype, '$injector', {
        get: function () {
            return this._injectorRoot && this._injectorRoot._injector;
        }
    });
    // use simple mergeStrategies to prevent _injectorRoot instance lose '__proto__'
    var strats = Vue.config.optionMergeStrategies;
    // eslint-disable-next-line func-names
    strats._injectorRoot = function (parentVal, childVal) {
        return childVal === undefined
            ? parentVal
            : childVal;
    };
}

// CONCATENATED MODULE: ./src/util/dom.ts
var inBrowser = typeof window !== 'undefined';

// CONCATENATED MODULE: ./src/enums/messages.ts
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
    ERROR_MESSAGE["ERROR_010"] = "@inject must get a service as parameter";
})(ERROR_MESSAGE || (ERROR_MESSAGE = {}));
var WARNING_MESSAGE;
(function (WARNING_MESSAGE) {
    WARNING_MESSAGE["WARNING_000"] = "Wrong service registration. Service name: {name}.\n@injectable can take only one parameter either useFactory or useValue, but got {options}";
})(WARNING_MESSAGE || (WARNING_MESSAGE = {}));
function messages_message(str, arg) {
    if (arg === void 0) { arg = {}; }
    var newStr = str;
    var spareParameters = Reflect.ownKeys(arg).filter(function (val) { return str.match(new RegExp("{" + String(val) + "}")) === null; });
    if (spareParameters.length) {
        // eslint-disable-next-line no-console
        console.warn(ERROR_MESSAGE.ERROR_002 + spareParameters);
    }
    Object.keys(arg).forEach(function (key) {
        var regex = new RegExp("{" + key + "}");
        newStr = str.replace(regex, arg[key]);
    });
    return newStr;
}

// CONCATENATED MODULE: ./src/util/warn.ts

function assert(condition, message) {
    if (!condition) {
        throw new Error(ERROR_MESSAGE.ERROR_000 + " " + message);
    }
}
function warn(condition, message) {
    if (false) {}
}
function isError(err) {
    return Object.prototype.toString.call(err).indexOf('Error') > -1;
}

// CONCATENATED MODULE: ./src/util/object.ts
function checkObject(obj) {
    return !Array.isArray(obj) && typeof obj === 'object' && obj !== null;
}

// CONCATENATED MODULE: ./src/di/bindings/binding.ts
var ServiceBinding = /** @class */ (function () {
    function ServiceBinding() {
    }
    ServiceBinding.bind = function (target, service, name) {
        return Reflect.defineProperty(target, name, {
            enumerable: true,
            configurable: false,
            get: function () { return service; }
        });
    };
    return ServiceBinding;
}());


// CONCATENATED MODULE: ./src/enums/metadata.ts
var METADATA;
(function (METADATA) {
    METADATA["TYPE"] = "inject:type";
    METADATA["VALUE"] = "inject:value";
    METADATA["NAME"] = "inject:name";
    METADATA["SERVICE"] = "inject:service";
    METADATA["TS_TYPE"] = "design:type";
})(METADATA || (METADATA = {}));
var FACTORY_TYPES;
(function (FACTORY_TYPES) {
    FACTORY_TYPES["useFactory"] = "useFactory";
    FACTORY_TYPES["useValue"] = "useValue";
})(FACTORY_TYPES || (FACTORY_TYPES = {}));

// CONCATENATED MODULE: ./src/di/factory/UseFactory.ts



var UseFactory_UseFactory = /** @class */ (function () {
    function UseFactory() {
    }
    UseFactory.prototype.getFactory = function (Service) {
        var name = Reflect.getMetadata(METADATA.NAME, Service);
        var factory = Reflect.getMetadata(METADATA.VALUE, Service);
        if (factory && typeof factory !== 'function') {
            throw assert(false, messages_message(ERROR_MESSAGE.ERROR_008, { name: name }));
        }
        return function () {
            var result = factory();
            if (!result) {
                throw assert(false, ERROR_MESSAGE.ERROR_006);
            }
            return result;
        };
    };
    return UseFactory;
}());


// CONCATENATED MODULE: ./src/di/factory/UseValue.ts



var UseValue_UseValue = /** @class */ (function () {
    function UseValue() {
    }
    UseValue.prototype.getFactory = function (Service) {
        var value = Reflect.getMetadata(METADATA.VALUE, Service);
        if (value) {
            return function () { return value; };
        }
        throw assert(false, ERROR_MESSAGE.ERROR_007);
    };
    return UseValue;
}());


// CONCATENATED MODULE: ./src/di/factory/Instance.ts
var Instance = /** @class */ (function () {
    function Instance() {
    }
    Instance.prototype.getFactory = function (Service) {
        var service = new Service();
        return function () { return service; };
    };
    return Instance;
}());


// CONCATENATED MODULE: ./src/di/factory/Factory.ts




var Factory_ServiceFactory = /** @class */ (function () {
    function ServiceFactory() {
    }
    ServiceFactory.make = function (Service) {
        var factoryName = Reflect.getMetadata(METADATA.TYPE, Service);
        var factory = ServiceFactory.getFactoryByName(factoryName);
        return factory.getFactory(Service);
    };
    ServiceFactory.getFactoryByName = function (name) {
        switch (name) {
            case FACTORY_TYPES.useFactory:
                return new UseFactory_UseFactory();
            case FACTORY_TYPES.useValue:
                return new UseValue_UseValue();
            default:
                return new Instance();
        }
    };
    return ServiceFactory;
}());


// CONCATENATED MODULE: ./src/di/provider.ts





var $VUE = 'Vue';
var provider_Provider = /** @class */ (function () {
    function Provider(service) {
        this.service = service;
        this.$factory = null;
        this.register();
    }
    Provider.prototype.instance = function () {
        return this.$factory();
    };
    Provider.prototype.bindTo = function (target, name) {
        if (!target) {
            return this.factory;
        }
        return ServiceBinding.bind(target, this.$factory(), name || this.name);
    };
    Object.defineProperty(Provider.prototype, "factory", {
        get: function () {
            return this.$factory;
        },
        set: function (factory) {
            this.$factory = factory;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Provider.prototype, "name", {
        get: function () {
            return Reflect.getMetadata(METADATA.NAME, this.service);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Provider.prototype, "isService", {
        get: function () {
            return Reflect.getMetadata(METADATA.SERVICE, this.service);
        },
        enumerable: true,
        configurable: true
    });
    Provider.prototype.register = function () {
        if (this.service.name === $VUE) {
            this.factory = function () { return Provider.app; };
        }
        if (!this.factory && this.isService) {
            this.factory = Factory_ServiceFactory.make(this.service);
        }
        if (this.factory) {
            return this.factory;
        }
        throw assert(false, ERROR_MESSAGE.ERROR_005);
    };
    return Provider;
}());


// CONCATENATED MODULE: ./src/di/injector.ts




var injector_Injector = /** @class */ (function () {
    function Injector(app, rootServices) {
        this.rootServices = [];
        provider_Provider.app = app;
        this.app = app;
        this.rootServices = rootServices;
        this.services = new Map();
    }
    Injector.prototype.registerComponent = function (component) {
        var _this = this;
        if (Object.hasOwnProperty.call(component, '_providers')) {
            var providers_1 = component._providers;
            if (providers_1 && checkObject(providers_1)) {
                Object.keys(providers_1).forEach(function (name) {
                    if (providers_1 && Object.hasOwnProperty.call(providers_1, name)) {
                        _this.provide(component._providers[name], component, name);
                    }
                });
            }
            else {
                throw assert(false, ERROR_MESSAGE.ERROR_004);
            }
        }
        if (this.rootServices.length) {
            this.rootServices.forEach(function (provider) {
                _this.provide(provider, component);
            });
        }
    };
    Injector.prototype.get = function (service) {
        return this.provide(service);
    };
    Injector.prototype.provide = function (service, target, customName) {
        if (target === void 0) { target = null; }
        if (!this.services.has(service)) {
            if (service.prototype.providers) {
                this.registerDependencies(service.prototype);
            }
            var provider_1 = new provider_Provider(service);
            this.services.set(service, provider_1);
        }
        var provider = this.services.get(service);
        provider.bindTo(target, customName);
        return provider.instance();
    };
    Injector.prototype.registerDependencies = function (service) {
        var _this = this;
        if (!checkObject(service.providers)) {
            throw assert(false, ERROR_MESSAGE.ERROR_004);
        }
        Object.keys(service.providers)
            .forEach(function (name) {
            _this.provide(service.providers[name], service, name);
        });
        delete service.providers;
    };
    return Injector;
}());


// CONCATENATED MODULE: ./src/di/decorators/injectable.ts



var injectable_InjectableFactory = /** @class */ (function () {
    function InjectableFactory() {
        this.target = null;
        this.options = {};
    }
    Object.defineProperty(InjectableFactory, "whitelist", {
        get: function () {
            return Reflect.ownKeys(FACTORY_TYPES);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(InjectableFactory.prototype, "decorators", {
        get: function () {
            return this.target.__decorators__;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(InjectableFactory.prototype, "optionKeys", {
        get: function () {
            return Reflect.ownKeys(this.options);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(InjectableFactory.prototype, "isOtherProperty", {
        /* checks whether all options given are allowed. Allowed options (useValue, useFactory) */
        get: function () {
            return !this.optionKeys.every(function (prop) { return InjectableFactory.whitelist.indexOf(prop) !== -1; });
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(InjectableFactory.prototype, "isCollisionProps", {
        get: function () {
            var _this = this;
            var props = InjectableFactory.whitelist
                .filter(function (p) { return Reflect.has(_this.options, p); });
            return props.length > 1;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(InjectableFactory.prototype, "type", {
        get: function () {
            var _this = this;
            return InjectableFactory.whitelist.find(function (props) { return Reflect.has(_this.options, props); });
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(InjectableFactory.prototype, "serviceType", {
        get: function () {
            if (this.isOtherProperty) {
                this.warnMassage();
            }
            if (this.isCollisionProps) {
                throw InjectableFactory.errorMassage();
            }
            if (this.type) {
                return FACTORY_TYPES[this.type];
            }
            return null;
        },
        enumerable: true,
        configurable: true
    });
    InjectableFactory.errorMassage = function () {
        throw assert(false, messages_message(ERROR_MESSAGE.ERROR_001, { names: JSON.stringify(InjectableFactory.whitelist) }));
    };
    InjectableFactory.prototype.make = function (target, options) {
        if (options === void 0) { options = {}; }
        this.target = target;
        this.options = options;
        this.defineMetadata();
        this.createDecorators();
        return this.target;
    };
    InjectableFactory.prototype.warnMassage = function () {
        warn(false, messages_message(WARNING_MESSAGE.WARNING_000, {
            name: this.target.name, options: JSON.stringify(this.options)
        }));
    };
    InjectableFactory.prototype.defineMetadata = function () {
        if (this.serviceType) {
            Reflect.defineMetadata(METADATA.TYPE, this.serviceType, this.target);
            Reflect.defineMetadata(METADATA.VALUE, this.options[this.serviceType], this.target);
        }
        Reflect.defineMetadata(METADATA.NAME, this.target.name, this.target);
        Reflect.defineMetadata(METADATA.SERVICE, true, this.target);
    };
    InjectableFactory.prototype.createDecorators = function () {
        var _this = this;
        if (this.decorators) {
            this.decorators.forEach(function (fn) { return fn(_this.target.prototype); });
            delete this.target.__decorators__;
        }
    };
    return InjectableFactory;
}());
function Injectable(options) {
    var injectableFactory = new injectable_InjectableFactory();
    if (typeof options === 'function') {
        return injectableFactory.make(options);
    }
    // eslint-disable-next-line func-names
    return function (target) {
        return injectableFactory.make(target, options);
    };
}

// CONCATENATED MODULE: ./src/util/decorator.ts
/* eslint-disable no-proto */
function createDecorator(factory) {
    // eslint-disable-next-line func-names
    return function (target, key) {
        var Ctor = typeof target === 'function'
            ? target
            : target.constructor;
        var descriptor = {
            enumerable: true,
            configurable: true,
            initializer: function () {
                return this.__proto__[key];
            }
        };
        Reflect.defineProperty(target, key, descriptor);
        (Ctor.__decorators__ || (Ctor.__decorators__ = [])).push(function (options) { return factory(options, key); });
        return descriptor;
    };
}

// CONCATENATED MODULE: ./src/di/decorators/inject.ts




function decoratorFactory(service) {
    return createDecorator(function (target, keyProp) {
        (target.providers || (target.providers = {}))[keyProp] = service;
    });
}
function Inject(target, key) {
    if (typeof target === 'function') {
        return decoratorFactory(target);
    }
    var service = Reflect.getMetadata(METADATA.TS_TYPE, target, key);
    if (service === undefined) {
        throw assert(false, ERROR_MESSAGE.ERROR_010);
    }
    decoratorFactory(service)(target, key);
}

// CONCATENATED MODULE: ./src/index.ts
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "VueInjector", function() { return src_VueInjector; });
/* concated harmony reexport Injectable */__webpack_require__.d(__webpack_exports__, "Injectable", function() { return Injectable; });
/* concated harmony reexport Inject */__webpack_require__.d(__webpack_exports__, "Inject", function() { return Inject; });








var src_VueInjector = /** @class */ (function () {
    function VueInjector(options) {
        if (options === void 0) { options = {}; }
        this.rootServices = [];
        this.app = null;
        this.injector = null;
        this.apps = [];
        this.rootServices = options.root || [];
        if (options.store) {
            options.store.$injector = this;
        }
    }
    Object.defineProperty(VueInjector, "app", {
        get: function () {
            return this;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(VueInjector.prototype, "install", {
        get: function () {
            return VueInjector.install;
        },
        enumerable: true,
        configurable: true
    });
    VueInjector.prototype.init = function (app) {
        if (false) {}
        this.apps.push(app);
        // main app already initialized.
        if (this.app) {
            return;
        }
        this.app = app;
        this.injector = new injector_Injector(this.app, this.rootServices);
    };
    VueInjector.prototype.initComponent = function (component) {
        return this.injector && this.injector.registerComponent(component);
    };
    VueInjector.prototype.get = function (Provider) {
        return this.injector && this.injector.get(Provider);
    };
    return VueInjector;
}());

src_VueInjector.install = install;
src_VueInjector.version = '__VERSION__';
if (inBrowser && window.Vue) {
    window.Vue.use(src_VueInjector);
}


/***/ })
/******/ ]);