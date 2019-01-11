/*!
  * @scandltd/vue-injector v1.2.1
  * (c) 2019 Scandltd
  * @license GPL-2.0
  */
var $Vue = void 0;
function install(Vue) {
    if (install.installed && $Vue === Vue) { return; }
    install.installed = true;
    $Vue = Vue;
    var isDef = function isDef(v) {
        return v !== undefined;
    };
    var registerInstance = function registerInstance(vm, callVal) {
        var i = vm.$options._parentVnode;
        if (isDef(i) && isDef(i = i.data) && isDef(i = i.registerRouteInstance)) {
            i(vm, callVal);
        }
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
                this._injectorRoot._injector.initComponent(this);
            }
            registerInstance(this, this);
        },
        destroyed: function destroyed() {
            registerInstance(this);
        }
    });
    Object.defineProperty(Vue.prototype, '$injector', {
        get: function get() {
            return this._injectorRoot._injector;
        }
    });
}

function assert(condition, message) {
    if (!condition) {
        throw new Error('[@scandltd/vue-injector] ' + message);
    }
}
function warn(condition, message) {
    if (process.env.NODE_ENV !== 'production' && !condition) {
        typeof console !== 'undefined' && console.warn('[@scandltd/vue-injector] ' + message);
    }
}

var inBrowser = typeof window !== 'undefined';

var FACTORY_TYPES;
(function (FACTORY_TYPES) {
    FACTORY_TYPES["DEFAULT"] = "NEW";
    FACTORY_TYPES["CUSTOM"] = "FACTORY";
})(FACTORY_TYPES || (FACTORY_TYPES = {}));
var ServiceFactory = (function () {
    function ServiceFactory () {}

    ServiceFactory.prototype.getNewService = function getNewService (Service) {
        var type = Service.useFactory && typeof Service.useFactory === 'function' ? FACTORY_TYPES.CUSTOM : FACTORY_TYPES.DEFAULT;
        switch (type) {
            case FACTORY_TYPES.CUSTOM:
                return this.custom(Service);
            case FACTORY_TYPES.DEFAULT:
            default:
                return this.default(Service);
        }
    };
    ServiceFactory.prototype.default = function default$1 (Service) {
        return new Service();
    };
    ServiceFactory.prototype.custom = function custom (Service) {
        var vue = Service.prototype.vm;
        var importNames = Service.import ? Object.keys(Service.import) : [];
        var imports = {};
        importNames.forEach(function (name) {
            return imports[name] = Service[name];
        });
        var factory = Service.useFactory(vue, imports);
        if (factory) {
            return factory;
        } else {
            assert(false, 'useFactory invalid return');
        }
    };

    return ServiceFactory;
}());

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
  return typeof obj;
} : function (obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
};

var Provider = (function () {
    function Provider(app, rootProviders) {
        this.rootProviders = [];
        this.serviceFactory = new ServiceFactory();
        this.app = app;
        this.rootProviders = rootProviders;
        this.services = new Map();
    }
    Provider.prototype.registerComponent = function registerComponent (component) {
        var _this = this;

        if (component.hasOwnProperty('_providers')) {
            var providers = component._providers;
            if (providers && this.checkObject(providers)) {
                Object.keys(providers).forEach(function (name) {
                    if (providers && providers.hasOwnProperty(name)) {
                        _this.registerService(component, name, providers[name]);
                    }
                });
            } else {
                assert(false, 'providers not object');
            }
        }
        if (this.rootProviders.length) {
            this.rootProviders.forEach(function (provider) {
                if (_this.checkGetName(provider)) {
                    _this.registerService(component, provider.getName(), provider);
                }
            });
        }
    };
    Provider.prototype.registerService = function registerService (target, name, Service$$1) {
        if (!this.services.has(Service$$1) && Service$$1.name === 'Injectable') {
            Service$$1.prototype.vm = this.app;
            if (Service$$1.import) {
                this.registerImport(Service$$1.prototype, Service$$1.import);
            }
            this.services.set(Service$$1, this.serviceFactory.getNewService(Service$$1));
        }
        var provider = this.services.get(Service$$1);
        if (provider && Service$$1.import) {
            this.registerImport(provider, Service$$1.import);
        }
        if (provider) {
            this.injectService(target, [{
                name: name,
                service: provider
            }]);
            return provider;
        }
        assert(false, 'no decorator Injectable or extends Inject');
    };
    Provider.prototype.registerImport = function registerImport (provider, imports) {
        var _this2 = this;

        if (this.checkObject(imports)) {
            var services = Object.keys(imports).map(function (name) {
                var service = _this2.registerService(provider, name, imports[name]);
                return {
                    name: name,
                    service: service
                };
            }).filter(function (inject) {
                return inject.service instanceof Inject;
            });
            this.injectService(provider, services);
        } else {
            assert(false, 'providers not object');
        }
    };
    Provider.prototype.set = function set$$1 (Service$$1) {
        if (this.checkGetName(Service$$1)) {
            this.registerService(this.app, Service$$1.getName(), Service$$1);
        }
    };
    Provider.prototype.get = function get$$1 (Service$$1) {
        if (!this.services.has(Service$$1)) {
            this.set(Service$$1);
        }
        return this.services.get(Service$$1);
    };
    Provider.prototype.injectService = function injectService (target, imports) {
        imports.forEach(function (Inject$$1) {
            var injectServiceName = Inject$$1.name;
            if (!Object.hasOwnProperty.call(target, injectServiceName) && Inject$$1.service) {
                Reflect.defineProperty(target, injectServiceName, {
                    enumerable: true,
                    get: function get$$1() {
                        return Inject$$1.service;
                    }
                });
            }
        });
    };
    Provider.prototype.checkObject = function checkObject (obj) {
        return !Array.isArray(obj) && (typeof obj === 'undefined' ? 'undefined' : _typeof(obj)) === 'object' && obj !== null;
    };
    Provider.prototype.checkGetName = function checkGetName (provider) {
        if (Object.hasOwnProperty.call(provider, 'getName') && typeof provider.getName === 'function') {
            return true;
        } else {
            warn(false, 'no decorator Injectable or extends Inject');
            return false;
        }
    };

    return Provider;
}());

function injectableFactory(target) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    var _a;
    return _a = (function (target) {
        function Injectable() {
            target.apply(this, arguments);
            this.isVueService = true;
            this.name = target.name;
            this.context = options.context || null;
            this.vm = this.vm;
        }

        if ( target ) Injectable.__proto__ = target;
        Injectable.prototype = Object.create( target && target.prototype );
        Injectable.prototype.constructor = Injectable;
        Injectable.getName = function getName () {
            return target.name;
        };

        return Injectable;
    }(target)), _a.useFactory = options.useFactory, _a.import = options.import || null, _a;
}
function Injectable(options) {
    if (typeof options === 'function') {
        return injectableFactory(options);
    }
    return function (target) {
        return injectableFactory(target, options);
    };
}

var Inject = (function () {
    function Inject () {}

    Inject.getName = function getName () {
        return this.name;
    };

    return Inject;
}());

function createDecorator(factory) {
    return function (target, key) {
        var Ctor = typeof target === 'function' ? target : target.constructor;
        if (!Ctor.__decorators__) {
            Ctor.__decorators__ = [];
        }
        Ctor.__decorators__.push(function (options) {
            return factory(options, key);
        });
    };
}
function Service(service) {
    return createDecorator(function (componentOptions, k) {
        (componentOptions.providers || (componentOptions.providers = {}))[k] = service;
    });
}

var VueInjector = (function () {
    function VueInjector() {
    var arguments$1 = arguments;

        this.rootProviders = [];
        this.app = null;
        this.provider = null;
        this.apps = [];

        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments$1[_key];
        }

        this.rootProviders = args;
    }

    var prototypeAccessors = { install: { configurable: true } };
    prototypeAccessors.install.get = function () {
        return VueInjector.install;
    };
    VueInjector.prototype.init = function init (app) {
        process.env.NODE_ENV !== 'production' && assert(install.installed, 'not installed. Make sure to call `Vue.use(VueInjector)` ' + 'before creating root instance.');
        this.apps.push(app);
        // main app already initialized.
        if (this.app) {
            return;
        }
        this.app = app;
        this.provider = new Provider(this.app, this.rootProviders);
    };
    VueInjector.prototype.initComponent = function initComponent (component) {
        this.provider && this.provider.registerComponent(component);
    };
    VueInjector.prototype.get = function get (Provider$$1) {
        return this.provider && this.provider.get(Provider$$1);
    };

    Object.defineProperties( VueInjector.prototype, prototypeAccessors );

    return VueInjector;
}());

VueInjector.install = install;
VueInjector.version = '1.2.1';
if (inBrowser && window.Vue) {
    window.Vue.use(VueInjector);
}

export default VueInjector;
export { Injectable, Inject, Service };
