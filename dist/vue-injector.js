/*!
  * @scandltd/vue-injector v1.0.5
  * (c) 2018 Scandltd
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
        throw new Error("[@scandltd/vue-injector] " + message);
    }
}
function warn(condition, message) {
    if ("development" !== 'production' && !condition) {
        typeof console !== 'undefined' && console.warn("[@scandltd/vue-injector] " + message);
    }
}

var inBrowser = typeof window !== 'undefined';

var Inject = /** @class */function () {
    function Inject() {}
    return Inject;
}();

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
  return typeof obj;
} : function (obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
};

var Provider = /** @class */function () {
    function Provider(app, rootProviders) {
        this.rootProviders = [];
        this.app = app;
        this.rootProviders = rootProviders;
        this.services = new Map();
    }
    Provider.prototype._injectService = function (target, imports) {
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
    Provider.prototype._checkObject = function (obj) {
        return !Array.isArray(obj) && (typeof obj === 'undefined' ? 'undefined' : _typeof(obj)) === 'object' && obj !== null;
    };
    Provider.prototype._checkGetName = function (provider) {
        if (Object.hasOwnProperty.call(provider, 'getName') && typeof provider.getName === 'function') {
            return true;
        } else {
            warn(false, 'no decorator Injectable or extends Inject');
            return false;
        }
    };
    Provider.prototype.registerComponent = function (component) {
        var _this = this;
        if (component.hasOwnProperty('_providers')) {
            var providers_1 = component._providers;
            if (providers_1 && this._checkObject(providers_1)) {
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
                if (_this._checkGetName(provider)) {
                    _this.registerService(component, provider.getName(), provider);
                }
            });
        }
    };
    Provider.prototype.registerService = function (target, name, Service) {
        var _this = this;
        if (!this.services.has(Service) && Service.name === 'Injectable') {
            this.services.set(Service, new Service(this.app));
        }
        var provider = this.services.get(Service);
        if (provider && provider instanceof Inject) {
            if (provider.import) {
                if (this._checkObject(provider.import)) {
                    var services = Object.keys(provider.import).map(function (name) {
                        var service = _this.registerService(provider, name, provider.import[name]);
                        return {
                            name: name,
                            service: service
                        };
                    }).filter(function (inject) {
                        return inject.service instanceof Inject;
                    });
                    this._injectService(provider, services);
                } else {
                    assert(false, 'providers not object');
                }
            }
            this._injectService(target, [{
                name: name,
                service: provider
            }]);
            return provider;
        }
        assert(false, 'no decorator Injectable or extends Inject');
    };
    Provider.prototype.set = function (Service) {
        if (this._checkGetName(Service)) {
            var provider = this.registerService(this.app, Service.getName(), Service);
            if (provider && provider instanceof Inject) {
                this.services.set(Service, provider);
            }
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
    return (/** @class */function (_super) {
            __extends(Injectable, _super);
            function Injectable(root) {
                var _this = _super.call(this) || this;
                _this.isVueService = true;
                Reflect.defineProperty(target.prototype, 'name', {
                    enumerable: false,
                    get: function get() {
                        return target.name;
                    }
                });
                if (options && options.hasOwnProperty('context')) {
                    Reflect.defineProperty(target.prototype, 'context', {
                        enumerable: false,
                        get: function get() {
                            return options.context;
                        }
                    });
                }
                if (options && options.hasOwnProperty('import')) {
                    Reflect.defineProperty(target.prototype, 'import', {
                        enumerable: false,
                        get: function get() {
                            return options.import;
                        }
                    });
                }
                Reflect.defineProperty(target.prototype, 'vm', {
                    enumerable: false,
                    get: function get() {
                        return root;
                    }
                });
                _this = _super.call(this) || this;
                return _this;
            }
            Injectable.getName = function () {
                return target.name;
            };
            return Injectable;
        }(target)
    );
}
function Injectable(options) {
    if (typeof options === 'function') {
        return injectableFactory(options);
    }
    return function (Service) {
        return injectableFactory(Service, options);
    };
}

function createDecorator(factory) {
    return function (target, key, index) {
        var Ctor = typeof target === 'function' ? target : target.constructor;
        if (!Ctor.__decorators__) {
            Ctor.__decorators__ = [];
        }
        if (typeof index !== 'number') {
            index = undefined;
        }
        Ctor.__decorators__.push(function (options) {
            return factory(options, key, index);
        });
    };
}
function Service(service) {
    return createDecorator(function (componentOptions, k, index) {
        (componentOptions.providers || (componentOptions.providers = {}))[k] = service;
    });
}

var VueInjector = /** @class */function () {
    function VueInjector() {
        var arguments$1 = arguments;

        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments$1[_i];
        }
        this.rootProviders = [];
        this.app = null;
        this.provider = null;
        this.apps = [];
        this.rootProviders = args;
    }
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
VueInjector.version = '1.0.5';
if (inBrowser && window.Vue) {
    window.Vue.use(VueInjector);
}

exports.Injectable = Injectable;
exports.Inject = Inject;
exports.Service = Service;
exports.default = VueInjector;

Object.defineProperty(exports, '__esModule', { value: true });

})));
