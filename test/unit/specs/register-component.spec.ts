import Vue from 'vue';
import VueInjector, { Injectable, Inject } from '../../../src/index';

Vue.use(VueInjector);

describe('register component', () => {
  let injector;
  let app;

  beforeEach(function () {
    injector = new VueInjector();

    app = new Vue({
      injector
    });

    app.$forceUpdate();
  });

  it('register one', () => {
    @Injectable
    class Service extends Inject {}

    const mockComponent: any = {
      _providers: {
        Service
      }
    };

    injector.provider.registerComponent(mockComponent);

    expect(injector.provider.services.get(Service).name).toEqual('Service');

    expect(mockComponent.Service.name).toEqual('Service');

    expect(mockComponent.Service).toEqual(injector.provider.services.get(Service));
  });

  it('register two', () => {
    @Injectable
    class Service extends Inject {}

    @Injectable
    class ServiceTwo extends Inject {}

    const mockComponent: any = {
      _providers: {
        Service,
        ServiceTwo
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

  it('register with import', () => {
    @Injectable
    class Service extends Inject {}

    @Injectable({
      import: {
        Service
      }
    })
    class ServiceTwo extends Inject {}

    const mockComponent: any = {
      _providers: {
        Service,
        ServiceTwo
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

  it('error register', () => {
    const mockComponent = {
      _providers: null
    };

    expect(
        () => injector.provider.registerComponent(mockComponent)
    ).toThrowError('[@scandltd/vue-injector] providers not object');
  });

  it('empty register', () => {
    const mockComponent: any = {};

    injector.provider.registerComponent(mockComponent);

    expect(injector.provider.services.size).toBe(0);
    expect(mockComponent.length).toBe(undefined);
  });
});
