/*!
  * @scandltd/vue-injector v1.2.3
  * (c) 2019 Scandltd
  * @license GPL-2.0
  */
(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
	typeof define === 'function' && define.amd ? define(['exports'], factory) :
	(factory((global.VueInjector = {})));
}(this, (function (exports) { 'use strict';

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
function warn(condition, message) {
    if ("development" !== 'production' && !condition) {
        typeof console !== 'undefined' && console.warn("[@scandltd/vue-injector] " + message);
    }
}

var inBrowser = typeof window !== 'undefined';

var FACTORY_TYPES;
(function (FACTORY_TYPES) {
    FACTORY_TYPES["DEFAULT"] = "NEW";
    FACTORY_TYPES["CUSTOM"] = "FACTORY";
})(FACTORY_TYPES || (FACTORY_TYPES = {}));
var ServiceFactory = /** @class */function () {
    function ServiceFactory() {}
    ServiceFactory.prototype.getNewService = function (Service) {
        var type = Service.useFactory && typeof Service.useFactory === 'function' ? FACTORY_TYPES.CUSTOM : FACTORY_TYPES.DEFAULT;
        switch (type) {
            case FACTORY_TYPES.CUSTOM:
                return this.custom(Service);
            case FACTORY_TYPES.DEFAULT:
            default:
                return this.default(Service);
        }
    };
    ServiceFactory.prototype.default = function (Service) {
        return new Service();
    };
    ServiceFactory.prototype.custom = function (Service) {
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
}();

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
  return typeof obj;
} : function (obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
};

var Provider = /** @class */function () {
    function Provider(app, rootProviders) {
        this.rootProviders = [];
        this.serviceFactory = new ServiceFactory();
        this.app = app;
        this.rootProviders = rootProviders;
        this.services = new Map();
    }
    Provider.prototype.registerComponent = function (component) {
        var _this = this;
        if (component.hasOwnProperty('_providers')) {
            var providers_1 = component._providers;
            if (providers_1 && this.checkObject(providers_1)) {
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
                if (_this.checkGetName(provider)) {
                    _this.registerService(component, provider.getName(), provider);
                }
            });
        }
    };
    Provider.prototype.registerService = function (target, name, Service$$1) {
        if (!this.services.has(Service$$1) && Service$$1.name === 'Injectable') {
            Service$$1.prototype.vm = target.$root || target.vm;
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
    Provider.prototype.registerImport = function (provider, imports) {
        var _this = this;
        if (this.checkObject(imports)) {
            var services = Object.keys(imports).map(function (name) {
                var service = _this.registerService(provider, name, imports[name]);
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
    Provider.prototype.set = function (Service$$1) {
        if (this.checkGetName(Service$$1)) {
            this.registerService(this.app, Service$$1.getName(), Service$$1);
        }
    };
    Provider.prototype.get = function (Service$$1) {
        if (!this.services.has(Service$$1)) {
            this.set(Service$$1);
        }
        return this.services.get(Service$$1);
    };
    Provider.prototype.injectService = function (target, imports) {
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
    Provider.prototype.checkObject = function (obj) {
        return !Array.isArray(obj) && (typeof obj === 'undefined' ? 'undefined' : _typeof(obj)) === 'object' && obj !== null;
    };
    Provider.prototype.checkGetName = function (provider) {
        if (Object.hasOwnProperty.call(provider, 'getName') && typeof provider.getName === 'function') {
            return true;
        } else {
            warn(false, 'no decorator Injectable or extends Inject');
            return false;
        }
    };
    return Provider;
}();

/*! *****************************************************************************
Copyright (c) Microsoft Corporation. All rights reserved.
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
/* global Reflect, Promise */

var extendStatics = function(d, b) {
    extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return extendStatics(d, b);
};

function __extends(d, b) {
    extendStatics(d, b);
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
}

function injectableFactory(target, options) {
    if (options === void 0) {
        options = {};
    }
    var _a;
    return _a = /** @class */function (_super) {
        __extends(Injectable, _super);
        function Injectable() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.isVueService = true;
            _this.name = target.name;
            _this.context = options.context || null;
            _this.vm = _this.vm;
            return _this;
        }
        Injectable.getName = function () {
            return target.name;
        };
        return Injectable;
    }(target), _a.useFactory = options.useFactory, _a.import = options.import || null, _a;
}
function Injectable(options) {
    if (typeof options === 'function') {
        return injectableFactory(options);
    }
    return function (target) {
        return injectableFactory(target, options);
    };
}

var Inject = /** @class */function () {
    function Inject() {}
    Inject.getName = function () {
        return this.name;
    };
    return Inject;
}();

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
        "development" !== 'production' && assert(install.installed, "not installed. Make sure to call `Vue.use(VueInjector)` " + "before creating root instance.");
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
VueInjector.version = '1.2.3';
if (inBrowser && window.Vue) {
    window.Vue.use(VueInjector);
}

exports.Injectable = Injectable;
exports.Inject = Inject;
exports.Service = Service;
exports.default = VueInjector;

Object.defineProperty(exports, '__esModule', { value: true });

})));
