import { install } from './install';
import { assert } from './util/warn';
import { inBrowser } from './util/dom';
import { Provider } from './di/provider';
import { Injectable } from './di/injectable';
import { Inject } from './di/inject';
import { Service } from './di/service';
export { Injectable, Inject, Service };
var VueInjector = /** @class */ (function () {
    function VueInjector() {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        this.rootProviders = [];
        this.app = null;
        this.provider = null;
        this.apps = [];
        this.rootProviders = args;
    }
    Object.defineProperty(VueInjector.prototype, "install", {
        get: function () {
            return VueInjector.install;
        },
        enumerable: true,
        configurable: true
    });
    VueInjector.prototype.init = function (app) {
        process.env.NODE_ENV !== 'production' && assert(install.installed, "not installed. Make sure to call `Vue.use(VueInjector)` " +
            "before creating root instance.");
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
    VueInjector.prototype.get = function (Provider) {
        return this.provider && this.provider.get(Provider);
    };
    return VueInjector;
}());
export default VueInjector;
VueInjector.install = install;
VueInjector.version = '__VERSION__';
if (inBrowser && window.Vue) {
    window.Vue.use(VueInjector);
}
//# sourceMappingURL=index.js.map