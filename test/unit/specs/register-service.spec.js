var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import Vue from 'vue';
import VueInjector, { Injectable, Inject } from '../../../src/index';
Vue.use(VueInjector);
describe('registerComponent service', function () {
    var injector;
    var app;
    beforeEach(function () {
        injector = new VueInjector();
        app = new Vue({
            injector: injector
        });
    });
    it('register one', function () {
        var Service = /** @class */ (function (_super) {
            __extends(Service, _super);
            function Service() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            Service = __decorate([
                Injectable
            ], Service);
            return Service;
        }(Inject));
        var service = injector.provider.registerService(app, 'Service', Service);
        expect(injector.provider.get(Service).name).toEqual('Service');
        expect(service.name).toEqual('Service');
        expect(service).toEqual(injector.provider.get(Service));
    });
    it('register two', function () {
        var Service = /** @class */ (function (_super) {
            __extends(Service, _super);
            function Service() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            Service = __decorate([
                Injectable
            ], Service);
            return Service;
        }(Inject));
        var ServiceTwo = /** @class */ (function (_super) {
            __extends(ServiceTwo, _super);
            function ServiceTwo() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            ServiceTwo = __decorate([
                Injectable
            ], ServiceTwo);
            return ServiceTwo;
        }(Inject));
        var service = injector.provider.registerService(app, 'Service', Service);
        var serviceTwo = injector.provider.registerService(app, 'ServiceTwo', ServiceTwo);
        expect(injector.provider.get(Service).name).toEqual('Service');
        expect(injector.provider.get(ServiceTwo).name).toEqual('ServiceTwo');
        expect(service.name).toEqual('Service');
        expect(serviceTwo.name).toEqual('ServiceTwo');
        expect(service).toEqual(injector.provider.get(Service));
        expect(serviceTwo).toEqual(injector.provider.get(ServiceTwo));
    });
    it('register with import', function () {
        var Service = /** @class */ (function (_super) {
            __extends(Service, _super);
            function Service() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            Service = __decorate([
                Injectable
            ], Service);
            return Service;
        }(Inject));
        var ServiceTwo = /** @class */ (function (_super) {
            __extends(ServiceTwo, _super);
            function ServiceTwo() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            ServiceTwo = __decorate([
                Injectable({
                    import: {
                        Service: Service
                    }
                })
            ], ServiceTwo);
            return ServiceTwo;
        }(Inject));
        var serviceTwo = injector.provider.registerService(app, 'ServiceTwo', ServiceTwo);
        expect(injector.provider.services.size).toBe(2);
        expect(injector.provider.get(Service).name).toEqual('Service');
        expect(injector.provider.get(ServiceTwo).name).toEqual('ServiceTwo');
        expect(injector.provider.get(ServiceTwo).Service).toEqual(jasmine.any(Object));
        expect(injector.provider.get(ServiceTwo).Service.name).toEqual('Service');
        expect(serviceTwo.name).toEqual('ServiceTwo');
        expect(serviceTwo.Service.name).toEqual('Service');
        expect(serviceTwo).toEqual(injector.provider.get(ServiceTwo));
        expect(serviceTwo).toEqual(injector.provider.get(ServiceTwo));
        expect(serviceTwo.Service).toEqual(injector.provider.get(Service));
    });
    it('get service before register', function () {
        var Service = /** @class */ (function (_super) {
            __extends(Service, _super);
            function Service() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            Service = __decorate([
                Injectable
            ], Service);
            return Service;
        }(Inject));
        injector.get(Service);
        expect(injector.provider.services.size).toBe(1);
        expect(injector.provider.get(Service).name).toEqual('Service');
        expect(app.Service).toEqual(injector.provider.get(Service));
    });
    it('get service after register', function () {
        var Service = /** @class */ (function (_super) {
            __extends(Service, _super);
            function Service() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            Service = __decorate([
                Injectable
            ], Service);
            return Service;
        }(Inject));
        var service = injector.provider.registerService(app, 'Service', Service);
        var injectorService = injector.get(Service);
        expect(injector.provider.get(Service).name).toEqual('Service');
        expect(service.name).toEqual('Service');
        expect(service).toEqual(injector.provider.get(Service));
        expect(injector.provider.services.size).toBe(1);
        expect(injectorService).toEqual(injector.provider.get(Service));
    });
    it('register not Injectable', function () {
        var Service = /** @class */ (function () {
            function Service() {
            }
            return Service;
        }());
        var ServiceTwo = /** @class */ (function (_super) {
            __extends(ServiceTwo, _super);
            function ServiceTwo() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            ServiceTwo = __decorate([
                Injectable({
                    import: [Service]
                })
            ], ServiceTwo);
            return ServiceTwo;
        }(Inject));
        expect(function () { return injector.provider.registerService(app, 'Service', Service); }).toThrowError('[@scandltd/vue-injector] no decorator Injectable or extends Inject');
        expect(function () { return injector.provider.registerService(app, 'ServiceTwo', ServiceTwo); }).toThrowError('[@scandltd/vue-injector] providers not object');
    });
});
//# sourceMappingURL=register-service.spec.js.map