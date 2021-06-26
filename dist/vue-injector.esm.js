/*!
 * 
 *   @scandltd/vue-injector v4.0.0
 *   (c) 2021 Scandltd
 *   @license GPL-2.0
 *
 */
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	// The require scope
/******/ 	var __webpack_require__ = {};
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "Inject": () => (/* reexport */ Inject),
  "Injectable": () => (/* reexport */ Injectable),
  "VueInjector": () => (/* reexport */ VueInjector),
  "default": () => (/* binding */ src)
});

;// CONCATENATED MODULE: ./src/enums/messages.ts
var ERROR_MESSAGE;
(function (ERROR_MESSAGE) {
    ERROR_MESSAGE["ERROR_TYPE"] = "[@scandltd/vue-injector]:";
    ERROR_MESSAGE["ERROR_INJECTABLE_OPTIONS_CONFLICT"] = "@injectable can take only one parameter either {names}";
    ERROR_MESSAGE["ERROR_BUILD_MESSAGE"] = "function \"message\". Parameters in a string do not match those in array: ";
    ERROR_MESSAGE["ERROR_INIT_PLUGIN"] = "not installed. Make sure to call `Vue.use(VueInjector)` before creating root instance.";
    ERROR_MESSAGE["ERROR_PROVIDERS_TYPE"] = "providers are not objects";
    ERROR_MESSAGE["ERROR_USE_DECORATOR"] = "no decorator Injectable";
    ERROR_MESSAGE["ERROR_USE_FACTORY_RETURN"] = "useFactory invalid return";
    ERROR_MESSAGE["ERROR_USE_VALUE_RETURN"] = "invalid useValue";
    ERROR_MESSAGE["ERROR_USE_FACTORY_TYPE"] = "{name} invalid type useFactory: must be 'function'";
    ERROR_MESSAGE["ERROR_EMTY_INJECT_PARAMS"] = "@inject must get a service as parameter";
})(ERROR_MESSAGE || (ERROR_MESSAGE = {}));
var WARNING_MESSAGE;
(function (WARNING_MESSAGE) {
    WARNING_MESSAGE["WARNING_000"] = "Wrong service registration. Service name: {name}.\n@injectable can take only one parameter either useFactory or useValue, but got {options}";
})(WARNING_MESSAGE || (WARNING_MESSAGE = {}));
function message(str, arg) {
    if (arg === void 0) { arg = {}; }
    var newStr = str;
    var spareParameters = Reflect.ownKeys(arg).filter(function (val) { return str.match(new RegExp("\\{" + String(val) + "\\}")) === null; });
    if (spareParameters.length) {
        // eslint-disable-next-line no-console
        console.warn(ERROR_MESSAGE.ERROR_BUILD_MESSAGE + spareParameters);
    }
    Object.keys(arg).forEach(function (key) {
        var regex = new RegExp("\\{" + key + "\\}");
        newStr = newStr.replace(regex, arg[key]);
    });
    return newStr;
}

;// CONCATENATED MODULE: ./src/util/warn.ts

function assert(condition, message) {
    if (!condition) {
        throw new Error(ERROR_MESSAGE.ERROR_TYPE + " " + message);
    }
}
function warn(condition, message) {
    if (false) {}
}
function isError(err) {
    return Object.prototype.toString.call(err).indexOf('Error') > -1;
}

;// CONCATENATED MODULE: ./src/enums/metadata.ts
var METADATA = {
    TYPE: Symbol('inject:type'),
    VALUE: Symbol('inject:value'),
    NAME: Symbol('inject:name'),
    SERVICE: Symbol('inject:service'),
    TS_TYPE: 'design:type'
};
var FACTORY_TYPES;
(function (FACTORY_TYPES) {
    FACTORY_TYPES["useFactory"] = "useFactory";
    FACTORY_TYPES["useValue"] = "useValue";
})(FACTORY_TYPES || (FACTORY_TYPES = {}));

;// CONCATENATED MODULE: ./src/di/decorators/injectable.ts



var InjectableFactory = /** @class */ (function () {
    function InjectableFactory() {
    }
    Object.defineProperty(InjectableFactory, "whitelist", {
        get: function () {
            return Reflect.ownKeys(FACTORY_TYPES);
        },
        enumerable: false,
        configurable: true
    });
    InjectableFactory.getOptionKeys = function (options) {
        return Reflect.ownKeys(options);
    };
    /* checks whether all options given are allowed. Allowed options (useValue, useFactory) */
    InjectableFactory.isOtherProperty = function (options) {
        return !InjectableFactory.getOptionKeys(options).every(function (prop) { return InjectableFactory.whitelist.indexOf(String(prop)) !== -1; });
    };
    InjectableFactory.isCollisionProps = function (options) {
        var props = InjectableFactory.whitelist
            .filter(function (p) { return Reflect.has(options, p); });
        return props.length > 1;
    };
    InjectableFactory.getType = function (options) {
        return InjectableFactory.whitelist.find(function (props) { return Reflect.has(options, props); });
    };
    InjectableFactory.getServiceType = function (target, options) {
        if (InjectableFactory.isOtherProperty(options)) {
            InjectableFactory.warnMassage(target, options);
        }
        if (InjectableFactory.isCollisionProps(options)) {
            throw InjectableFactory.errorMassage();
        }
        if (InjectableFactory.getType(options)) {
            return FACTORY_TYPES[InjectableFactory.getType(options)];
        }
        return null;
    };
    InjectableFactory.errorMassage = function () {
        throw assert(false, message(ERROR_MESSAGE.ERROR_INJECTABLE_OPTIONS_CONFLICT, { names: JSON.stringify(InjectableFactory.whitelist) }));
    };
    InjectableFactory.warnMassage = function (target, options) {
        warn(false, message(WARNING_MESSAGE.WARNING_000, {
            name: target.name, options: JSON.stringify(options)
        }));
    };
    InjectableFactory.make = function (target, options) {
        if (options === void 0) { options = {}; }
        this.defineMetadata(target, options);
        this.createDecorators(target);
        return target;
    };
    InjectableFactory.defineMetadata = function (target, options) {
        var serviceType = InjectableFactory.getServiceType(target, options);
        if (serviceType) {
            Reflect.defineMetadata(METADATA.TYPE, serviceType, target);
            Reflect.defineMetadata(METADATA.VALUE, options[serviceType], target);
        }
        Reflect.defineMetadata(METADATA.NAME, target.name, target);
        Reflect.defineMetadata(METADATA.SERVICE, true, target);
    };
    InjectableFactory.createDecorators = function (target) {
        if (target.__decorators__) {
            target.__decorators__.forEach(function (fn) { return fn(target.prototype); });
            delete target.__decorators__;
        }
    };
    return InjectableFactory;
}());
function Injectable(options) {
    if (typeof options === 'function') {
        return InjectableFactory.make(options);
    }
    return function (target) { return InjectableFactory.make(target, options); };
}

;// CONCATENATED MODULE: ./src/util/decorator.ts
/* eslint-disable no-proto */
function createDecorator(factory) {
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

;// CONCATENATED MODULE: ./src/di/decorators/inject.ts




function decoratorFactory(service) {
    return createDecorator(function (target, keyProp) {
        (target.providers || (target.providers = {}))[keyProp] = service;
    });
}
function Inject(target, key) {
    if (typeof target === 'function' || key === undefined) {
        return decoratorFactory(target);
    }
    var service = Reflect.getMetadata(METADATA.TS_TYPE, target, key);
    if (service === undefined) {
        throw assert(false, ERROR_MESSAGE.ERROR_EMTY_INJECT_PARAMS);
    }
    decoratorFactory(service)(target, key);
}

;// CONCATENATED MODULE: ./src/util/object.ts
function checkObject(obj) {
    return !Array.isArray(obj) && typeof obj === 'object' && obj !== null;
}

;// CONCATENATED MODULE: ./src/di/bindings/binding.ts
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


;// CONCATENATED MODULE: ./src/di/factory/UseFactory.ts



var UseFactory = /** @class */ (function () {
    function UseFactory() {
    }
    UseFactory.prototype.getFactory = function (Service) {
        var name = Reflect.getMetadata(METADATA.NAME, Service);
        var factory = Reflect.getMetadata(METADATA.VALUE, Service);
        if (factory && typeof factory !== 'function') {
            throw assert(false, message(ERROR_MESSAGE.ERROR_USE_FACTORY_TYPE, { name: name }));
        }
        var result = factory();
        if (!result) {
            throw assert(false, ERROR_MESSAGE.ERROR_USE_FACTORY_RETURN);
        }
        return function () { return result; };
    };
    return UseFactory;
}());


;// CONCATENATED MODULE: ./src/di/factory/UseValue.ts



var UseValue = /** @class */ (function () {
    function UseValue() {
    }
    UseValue.prototype.getFactory = function (Service) {
        var value = Reflect.getMetadata(METADATA.VALUE, Service);
        if (value) {
            return function () { return value; };
        }
        throw assert(false, ERROR_MESSAGE.ERROR_USE_VALUE_RETURN);
    };
    return UseValue;
}());


;// CONCATENATED MODULE: ./src/di/factory/Instance.ts
var Instance = /** @class */ (function () {
    function Instance() {
    }
    Instance.prototype.getFactory = function (Service) {
        var service = new Service();
        return function () { return service; };
    };
    return Instance;
}());


;// CONCATENATED MODULE: ./src/di/factory/Factory.ts




var ServiceFactory = /** @class */ (function () {
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
                return new UseFactory();
            case FACTORY_TYPES.useValue:
                return new UseValue();
            default:
                return new Instance();
        }
    };
    return ServiceFactory;
}());


;// CONCATENATED MODULE: ./src/di/provider.ts





var Provider = /** @class */ (function () {
    function Provider(service) {
        this.service = service;
        this.factory = null;
        this.register();
    }
    Object.defineProperty(Provider.prototype, "instance", {
        get: function () {
            return this.factory();
        },
        enumerable: false,
        configurable: true
    });
    Provider.prototype.bindTo = function (target, name) {
        return ServiceBinding.bind(target, this.instance, name || this.name);
    };
    Object.defineProperty(Provider.prototype, "name", {
        get: function () {
            return Reflect.getMetadata(METADATA.NAME, this.service);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Provider.prototype, "isService", {
        get: function () {
            return !!Reflect.getMetadata(METADATA.SERVICE, this.service);
        },
        enumerable: false,
        configurable: true
    });
    Provider.prototype.isApp = function (service) {
        return service === Provider.app;
    };
    Provider.prototype.register = function () {
        if (this.isApp(this.service)) {
            this.factory = function () { return Provider.app; };
        }
        else if (!this.factory && this.isService) {
            this.factory = ServiceFactory.make(this.service);
        }
        if (this.factory) {
            return this.factory;
        }
        throw assert(false, ERROR_MESSAGE.ERROR_USE_DECORATOR);
    };
    return Provider;
}());


;// CONCATENATED MODULE: ./src/di/injector.ts




var Injector = /** @class */ (function () {
    function Injector(app, rootServices) {
        this.rootServices = [];
        Provider.app = app;
        this.app = app;
        this.rootServices = rootServices;
        this.services = new Map();
    }
    Injector.prototype.registerComponent = function (component) {
        var _this = this;
        this.provideAllServices(component);
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
        var _a;
        if (target === void 0) { target = null; }
        if (!this.services.has(service)) {
            if ((_a = service === null || service === void 0 ? void 0 : service.prototype) === null || _a === void 0 ? void 0 : _a.providers) {
                this.registerDependencies(service.prototype);
            }
            this.services.set(service, new Provider(service));
        }
        var provider = this.services.get(service);
        if (target) {
            provider.bindTo(target, customName);
        }
        return provider.instance;
    };
    Injector.prototype.provideAllServices = function (target) {
        var _this = this;
        if (Object.hasOwnProperty.call(target, 'providers')) {
            var providers_1 = target.providers;
            if (providers_1 && checkObject(providers_1)) {
                Object.keys(providers_1).forEach(function (name) {
                    if (providers_1 && Object.hasOwnProperty.call(providers_1, name)) {
                        _this.provide(providers_1[name], target, name);
                    }
                });
            }
            else {
                throw assert(false, ERROR_MESSAGE.ERROR_PROVIDERS_TYPE);
            }
        }
    };
    Injector.prototype.registerDependencies = function (service) {
        this.provideAllServices(service);
        delete service.providers;
    };
    return Injector;
}());


;// CONCATENATED MODULE: ./src/VueInjector.ts

var VueInjector = /** @class */ (function () {
    function VueInjector(_a) {
        var app = _a.app, root = _a.root, store = _a.store;
        this.rootServices = [];
        this.rootServices = root || [];
        if (store) {
            store.$injector = this;
        }
        this.init(app);
    }
    Object.defineProperty(VueInjector, "app", {
        get: function () {
            return this;
        },
        enumerable: false,
        configurable: true
    });
    VueInjector.prototype.init = function (app) {
        if (this.app) {
            return;
        }
        this.app = app;
        this.injector = new Injector(this.app, this.rootServices);
    };
    VueInjector.prototype.initComponent = function (component) {
        return this.injector && this.injector.registerComponent(component);
    };
    VueInjector.prototype.get = function (Provider) {
        return this.injector && this.injector.get(Provider);
    };
    return VueInjector;
}());

VueInjector.version = '__VERSION__';

;// CONCATENATED MODULE: ./src/index.ts
var __assign = (undefined && undefined.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};





var isDef = function (v) { return v !== undefined; };
/* harmony default export */ const src = ({
    install: function (app, options) {
        app.config.globalProperties.$injector = new VueInjector(__assign(__assign({}, options), { app: app }));
        app.mixin({
            beforeCreate: function () {
                var _a;
                if (isDef(this.$options.providers)) {
                    this.providers = this.$options.providers;
                }
                if (typeof ((_a = this === null || this === void 0 ? void 0 : this.$injector) === null || _a === void 0 ? void 0 : _a.initComponent) === 'function') {
                    this.$injector.initComponent(this);
                }
            }
        });
    }
});

module.exports = __webpack_exports__;
/******/ })()
;