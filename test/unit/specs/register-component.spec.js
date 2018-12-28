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
describe('register component', function () {
    var injector;
    var app;
    beforeEach(function () {
        injector = new VueInjector();
        app = new Vue({
            injector: injector
        });
        app.$forceUpdate();
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
        var mockComponent = {
            _providers: {
                Service: Service
            }
        };
        injector.provider.registerComponent(mockComponent);
        expect(injector.provider.services.get(Service).name).toEqual('Service');
        expect(mockComponent.Service.name).toEqual('Service');
        expect(mockComponent.Service).toEqual(injector.provider.services.get(Service));
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
        var mockComponent = {
            _providers: {
                Service: Service,
                ServiceTwo: ServiceTwo
            }
        };
        injector.provider.registerComponent(mockComponent);
        expect(injector.provider.get(Service).name).toEqual('Service');
        expect(injector.provider.get(ServiceTwo).name).toEqual('ServiceTwo');
        expect(mockComponent.Service.name).toEqual('Service');
        expect(mockComponent.ServiceTwo.name).toEqual('ServiceTwo');
        expect(mockComponent.Service).toEqual(injector.provider.get(Service));
        expect(mockComponent.ServiceTwo).toEqual(injector.provider.get(ServiceTwo));
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
        var mockComponent = {
            _providers: {
                Service: Service,
                ServiceTwo: ServiceTwo
            }
        };
        injector.provider.registerComponent(mockComponent);
        expect(injector.provider.services.size).toBe(2);
        expect(injector.provider.get(Service) instanceof Service).toBe(true);
        expect(injector.provider.get(Service).name).toEqual('Service');
        expect(injector.provider.get(ServiceTwo) instanceof ServiceTwo).toBe(true);
        expect(injector.provider.get(ServiceTwo).name).toEqual('ServiceTwo');
        expect(injector.provider.get(ServiceTwo).Service).toEqual(jasmine.any(Object));
        expect(injector.provider.get(ServiceTwo).Service.name).toEqual('Service');
        expect(injector.provider.get(ServiceTwo).Service.name).toEqual('Service');
        expect(mockComponent.Service instanceof Service).toBe(true);
        expect(mockComponent.Service.name).toEqual('Service');
        expect(mockComponent.ServiceTwo instanceof ServiceTwo).toBe(true);
        expect(mockComponent.ServiceTwo.name).toEqual('ServiceTwo');
        expect(mockComponent.ServiceTwo.Service).toEqual(jasmine.any(Object));
        expect(mockComponent.ServiceTwo.Service.name).toEqual('Service');
        expect(mockComponent.ServiceTwo.Service.name).toEqual('Service');
        expect(mockComponent.Service).toEqual(injector.provider.get(Service));
        expect(mockComponent.ServiceTwo).toEqual(injector.provider.get(ServiceTwo));
        expect(mockComponent.ServiceTwo.Service).toEqual(injector.provider.get(ServiceTwo).Service);
    });
    it('error register', function () {
        var mockComponent = {
            _providers: null
        };
        expect(function () { return injector.provider.registerComponent(mockComponent); }).toThrowError('[@scandltd/vue-injector] providers not object');
    });
    it('empty register', function () {
        var mockComponent = {};
        injector.provider.registerComponent(mockComponent);
        expect(injector.provider.services.size).toBe(0);
        expect(mockComponent.length).toBe(undefined);
    });
});
//# sourceMappingURL=register-component.spec.js.map