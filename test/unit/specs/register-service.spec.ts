import Vue from 'vue';
import VueInjector, { Injectable, Inject } from '../../../src/index';

Vue.use(VueInjector);

describe('registerComponent service', () => {
  let injector;
  let app;

  beforeEach(function () {
    injector = new VueInjector();

    app = new Vue({
      injector
    });
  });

  it('register one', () => {
    @Injectable
    class Service {}

    const service = injector.provider.registerService(app, 'Service', Service);

    expect(injector.provider.get(Service).name).toEqual('Service');

    expect(service.name).toEqual('Service');

    expect(service).toEqual(injector.provider.get(Service));
  });

  it('register two', () => {
    @Injectable
    class Service {}

    @Injectable
    class ServiceTwo {}

    const service = injector.provider.registerService(app, 'Service', Service);
    const serviceTwo = injector.provider.registerService(app, 'ServiceTwo', ServiceTwo);

    expect(injector.provider.get(Service).name).toEqual('Service');
    expect(injector.provider.get(ServiceTwo).name).toEqual('ServiceTwo');

    expect(service.name).toEqual('Service');
    expect(serviceTwo.name).toEqual('ServiceTwo');

    expect(service).toEqual(injector.provider.get(Service));
    expect(serviceTwo).toEqual(injector.provider.get(ServiceTwo));
  });

  it('register with import', () => {
    @Injectable
    class Service {}

    @Injectable
    class ServiceTwo {
      @Inject(Service) Service;
    }

    const serviceTwo = injector.provider.registerService(app, 'ServiceTwo', ServiceTwo);

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

  it('register with useFactory', () => {
    class Factory {
      get type () {
        return 'useFactory';
      }
    }

    @Injectable({
      useFactory: () => new Factory()
    })
    class Service {}


    const service = injector.provider.registerService(app, 'Service', Service);

    expect(injector.provider.services.size).toBe(1);

    expect(injector.provider.get(Service).type).toEqual('useFactory');
    expect(service.type).toEqual('useFactory');

    expect(service).toEqual(injector.provider.get(Service));
  });

  it('register with useValue', () => {
    @Injectable({
      useValue: 'anyValue'
    })
    class Service {}

    const service = injector.provider.registerService(app, 'Service', Service);

    expect(injector.provider.services.size).toBe(1);
    expect(injector.provider.get(Service)).toEqual('anyValue');
  });

  it('useFactory get vue', () => {
    class Factory {
      constructor () {}
    }

    @Injectable({
      useFactory: () => new Factory()
    })
    class Service {
      @Inject(Vue) vm;
    }


    const service = injector.provider.registerService(app, 'Service', Service);

    expect(injector.provider.services.size).toBe(1);
    expect(service).toEqual(injector.provider.get(Service));

    expect(app).toEqual(injector.provider.get(Service).vm);
  });

  it('useFactory invalid return', () => {
    class Factory {
      constructor (public vm) {}
    }

    @Injectable({
      useFactory: (vm) => {
        const f = new Factory(vm);
      }
    })
    class Service {}

    expect(
      () => injector.provider.registerService(app, 'Service', Service)
    ).toThrowError('[@scandltd/vue-injector] useFactory invalid return');
  });


  it('get service before register', () => {
    @Injectable
    class Service {}

    injector.get(Service);

    expect(injector.provider.services.size).toBe(1);
    expect(injector.provider.get(Service).name).toEqual('Service');
    expect(app.Service).toEqual(injector.provider.get(Service));
  });

  it('get service after register', () => {
    @Injectable
    class Service {}

    const service = injector.provider.registerService(app, 'Service', Service);
    const injectorService = injector.get(Service);

    expect(injector.provider.get(Service).name).toEqual('Service');
    expect(service.name).toEqual('Service');
    expect(service).toEqual(injector.provider.get(Service));

    expect(injector.provider.services.size).toBe(1);
    expect(injectorService).toEqual(injector.provider.get(Service));
  });

  it('register not Injectable', () => {
    class Service {}

    @Injectable
    class ServiceTwo {
      @Inject(Service) Service;
    }

    expect(
        () => injector.provider.registerService(app, 'Service', Service)
    ).toThrowError('[@scandltd/vue-injector] no decorator Injectable');
    expect(
        () => injector.provider.registerService(app, 'ServiceTwo', ServiceTwo)
    ).toThrowError('[@scandltd/vue-injector] no decorator Injectable');
  });
});
