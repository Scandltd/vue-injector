import Vue from 'vue';
import VueInjector, { Injectable, Inject } from '../../../src/index';
import { ERROR_MESSAGE } from '../../../src/enums/messages';

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
    class Service {}

    const mockComponent: any = {
      _providers: {
        Service
      }
    };

    injector.injector.registerComponent(mockComponent);

    expect(mockComponent.Service).toEqual(injector.injector.get(Service));
  });

  it('register two', () => {
    @Injectable
    class Service {}

    @Injectable
    class ServiceTwo {}

    const mockComponent: any = {
      _providers: {
        Service,
        ServiceTwo
      }
    };

    injector.injector.registerComponent(mockComponent);

    expect(Reflect.getMetadata('inject:name', Service)).toEqual('Service');
    expect(Reflect.getMetadata('inject:name', ServiceTwo)).toEqual('ServiceTwo');

    expect(injector.injector.services.size).toBe(2);

    expect(mockComponent.Service).toEqual(injector.injector.get(Service));
    expect(mockComponent.ServiceTwo).toEqual(injector.injector.get(ServiceTwo));
  });

  it('register with VALUE', () => {
    @Injectable({
      useValue: 'anyValue'
    })
    class Service {}

    const mockComponent: any = {
      _providers: {
        Service
      }
    };

    injector.injector.registerComponent(mockComponent);

    expect(Reflect.getMetadata('inject:name', Service)).toEqual('Service');

    expect(injector.injector.services.size).toBe(1);
    expect(mockComponent.Service).toEqual(injector.injector.get(Service));
  });

  it('register with import', () => {
    @Injectable
    class Service {}

    @Injectable
    class ServiceTwo {
      @Inject(Service) Service;
    }

    const mockComponent: any = {
      _providers: {
        Service,
        ServiceTwo
      }
    };

    injector.injector.registerComponent(mockComponent);

    expect(injector.injector.services.size).toBe(2);

    expect(injector.injector.get(Service) instanceof Service).toBe(true);
    expect(Reflect.getMetadata('inject:name', Service)).toEqual('Service');
    expect(injector.injector.get(ServiceTwo) instanceof ServiceTwo).toBe(true);
    expect(Reflect.getMetadata('inject:name', ServiceTwo)).toEqual('ServiceTwo');
    expect(injector.injector.get(ServiceTwo).Service).toEqual(jasmine.any(Object));
    expect(injector.injector.get(ServiceTwo).Service).toEqual(injector.injector.get(Service));

    expect(mockComponent.Service instanceof Service).toBe(true);
    expect(mockComponent.Service).toEqual(injector.injector.get(Service));
    expect(mockComponent.ServiceTwo instanceof ServiceTwo).toBe(true);
    expect(mockComponent.ServiceTwo.Service).toEqual(jasmine.any(Object));

    expect(mockComponent.Service).toEqual(injector.injector.get(Service));
    expect(mockComponent.ServiceTwo).toEqual(injector.injector.get(ServiceTwo));
    expect(mockComponent.ServiceTwo.Service).toEqual(injector.injector.get(ServiceTwo).Service);
  });

  it('error register', () => {
    const mockComponent = {
      _providers: null
    };

    expect(
        () => injector.injector.registerComponent(mockComponent)
    ).toThrowError(`${ERROR_MESSAGE.ERROR_000} ${ERROR_MESSAGE.ERROR_004}`);
  });

  it('empty register', () => {
    const mockComponent: any = {};

    injector.injector.registerComponent(mockComponent);

    expect(injector.injector.services.size).toBe(0);
    expect(mockComponent.length).toBe(undefined);
  });
});
