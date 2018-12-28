import { assert, warn } from '../util/warn';
import { Inject } from '../index';
var Provider = /** @class */ (function () {
    function Provider(app, rootProviders) {
        this.rootProviders = [];
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
            }
            else {
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
    Provider.prototype.registerService = function (target, name, Service) {
        var _this = this;
        if (!this.services.has(Service) && Service.name === 'Injectable') {
            Service.prototype.vm = this.app;
            this.services.set(Service, new Service(this.app));
        }
        var provider = this.services.get(Service);
        if (provider && provider instanceof Inject) {
            if (provider.import) {
                if (this.checkObject(provider.import)) {
                    var services = Object.keys(provider.import)
                        .map(function (name) {
                        var service = _this.registerService(provider, name, provider.import[name]);
                        return {
                            name: name,
                            service: service
                        };
                    })
                        .filter(function (inject) { return inject.service instanceof Inject; });
                    this.injectService(provider, services);
                }
                else {
                    assert(false, 'providers not object');
                }
            }
            this.injectService(target, [{
                    name: name,
                    service: provider
                }]);
            return provider;
        }
        assert(false, 'no decorator Injectable or extends Inject');
    };
    Provider.prototype.set = function (Service) {
        if (this.checkGetName(Service)) {
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
    Provider.prototype.injectService = function (target, imports) {
        imports.forEach(function (Inject) {
            var injectServiceName = Inject.name;
            if (!Object.hasOwnProperty.call(target, injectServiceName) && Inject.service) {
                Reflect.defineProperty(target, injectServiceName, {
                    enumerable: true,
                    get: function () {
                        return Inject.service;
                    }
                });
            }
        });
    };
    Provider.prototype.checkObject = function (obj) {
        return !Array.isArray(obj) && typeof obj === 'object' && obj !== null;
    };
    Provider.prototype.checkGetName = function (provider) {
        if (Object.hasOwnProperty.call(provider, 'getName') && typeof provider.getName === 'function') {
            return true;
        }
        else {
            warn(false, 'no decorator Injectable or extends Inject');
            return false;
        }
    };
    return Provider;
}());
export { Provider };
//# sourceMappingURL=provider.js.map