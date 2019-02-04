/*!
  * @scandltd/vue-injector v2.0.1
  * (c) 2019 Scandltd
  * @license GPL-2.0
  */
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

function assert(condition, message) {
    if (!condition) {
        throw new Error("[@scandltd/vue-injector] " + message);
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
    }
    ServiceBinding.prototype.bind = function (binging, name) {
        if (!Array.isArray(binging)) {
            binging = [{
                name: name || binging.name,
                service: binging
            }];
        }
        this.binging = binging;
        return this;
    };
    ServiceBinding.prototype.to = function (target) {
        this.binging.forEach(function (Inject) {
            var injectServiceName = Inject.name;
            var checkProperty = Object.hasOwnProperty.call(target, injectServiceName) ? !target[injectServiceName] : true;
            if (checkProperty && Inject.service) {
                Reflect.defineProperty(target, injectServiceName, {
                    enumerable: true,
                    get: function get() {
                        return Inject.service;
                    }
                });
            }
        });
        this.binging = [];
        return true;
    };
    return ServiceBinding;
}();

var FACTORY_TYPES;
(function (FACTORY_TYPES) {
    FACTORY_TYPES["NEW"] = "NEW";
    FACTORY_TYPES["FACTORY"] = "FACTORY";
    FACTORY_TYPES["VALUE"] = "VALUE";
})(FACTORY_TYPES || (FACTORY_TYPES = {}));
var FACTORY_MAP = {
    useFactory: {
        type: FACTORY_TYPES.FACTORY,
        check: 'function'
    },
    useValue: {
        type: FACTORY_TYPES.VALUE
    }
};
var ServiceFactory = /** @class */function () {
    function ServiceFactory() {
        this.type = FACTORY_TYPES.NEW;
    }
    ServiceFactory.prototype.make = function (Service) {
        var type = this.getType(Service);
        switch (type) {
            case FACTORY_TYPES.FACTORY:
                return this.custom(Service);
            case FACTORY_TYPES.NEW:
            default:
                return this.default(Service);
        }
    };
    ServiceFactory.prototype.getType = function (Service) {
        var _this = this;
        Object.keys(FACTORY_MAP).forEach(function (name) {
            if (Object.hasOwnProperty.call(Service, name) && Service[name]) {
                _this.type = FACTORY_MAP[name].type;
                if (FACTORY_MAP[name].check && _typeof(Service[name]) !== FACTORY_MAP[name].check) {
                    return assert(false, name + " invalid type: should be " + FACTORY_MAP[name].check);
                }
            }
        });
        return this.type;
    };
    ServiceFactory.prototype.default = function (Service) {
        return new Service();
    };
    ServiceFactory.prototype.custom = function (Service) {
        var factory = Service.useFactory();
        if (factory) {
            return factory;
        } else {
            assert(false, 'useFactory invalid return');
        }
    };
    return ServiceFactory;
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
                        _this.registerService(component, name, providers_1[name]);
                    }
                });
            } else {
                assert(false, 'providers not object');
            }
        }
        if (this.rootProviders.length) {
            this.rootProviders.forEach(function (provider) {
                if (provider.isVueService) {
                    _this.registerService(component, provider.name, provider);
                }
            });
        }
    };
    Provider.prototype.registerService = function (target, name, Service) {
        if (Service.name === 'Vue') {
            return target[name] = this.app;
        }
        if (!this.services.has(Service) && Service.isVueService) {
            if (Service.prototype.providers) {
                this.registerProviders(Service.prototype, Service.prototype.providers);
            }
            this.services.set(Service, this.serviceFactory.make(Service));
        }
        var service = this.services.get(Service);
        if (service && Service.prototype.providers) {
            this.registerProviders(service, Service.prototype.providers);
            delete Service.prototype.providers;
        }
        if (service) {
            return this.serviceBinding.bind(service, name).to(target) && service;
        }
        assert(false, 'no decorator Injectable');
    };
    Provider.prototype.registerProviders = function (provider, imports) {
        var _this = this;
        if (checkObject(imports)) {
            var services = Object.keys(imports).map(function (name) {
                var service = _this.registerService(provider, name, imports[name]);
                return {
                    name: name,
                    service: service
                };
            });
            this.serviceBinding.bind(services).to(provider);
        } else {
            assert(false, 'providers not object');
        }
    };
    Provider.prototype.set = function (Service) {
        if (Service.isVueService) {
            this.registerService(this.app, Service.name, Service);
        }
    };
    Provider.prototype.get = function (Service) {
        if (!this.services.has(Service)) {
            this.set(Service);
        }
        return this.services.get(Service);
    };
    return Provider;
}();

function injectableFactory(target, options) {
    if (options === void 0) {
        options = {};
    }
    var decorators = target.__decorators__;
    target.prototype.name = target.name;
    target.isVueService = true;
    target.useFactory = options.useFactory;
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
        var descriptor = arguments[2];
        if (descriptor) {
            delete descriptor.initializer;
            descriptor.writable = true;
            descriptor.configurable = true;
        }
        var Ctor = typeof target === 'function' ? target : target.constructor;
        if (!Ctor.__decorators__) {
            Ctor.__decorators__ = [];
        }
        Ctor.__decorators__.push(function (options) {
            return factory(options, key);
        });
    };
}

function Inject(service) {
    return createDecorator(function (componentOptions, k) {
        (componentOptions.providers || (componentOptions.providers = {}))[k] = service;
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
    Object.defineProperty(VueInjector.prototype, "install", {
        get: function get() {
            return VueInjector.install;
        },
        enumerable: true,
        configurable: true
    });
    VueInjector.prototype.init = function (app) {
        process.env.NODE_ENV !== 'production' && assert(install.installed, "not installed. Make sure to call `Vue.use(VueInjector)` " + "before creating root instance.");
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
VueInjector.version = '2.0.1';
if (inBrowser && window.Vue) {
    window.Vue.use(VueInjector);
}

export default VueInjector;
export { Injectable, Inject };
