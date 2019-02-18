import Vue from 'vue';
import VueInjector, { Injectable, Inject } from '../../../src/index';
import { message, ERROR_MESSAGE, WARNING_MESSAGE } from '../../../src/enums/messages';
import { FACTORY_TYPES } from '../../../src/enums/metadata';

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

    const service = injector.provider.registerService('Service', Service);

    expect(injector.provider.services.size).toBe(1);

    expect(service).toEqual(injector.provider.get(Service));
    expect(Reflect.getMetadata('inject:name', Service)).toEqual('Service');
  });

  it('register two', () => {
    @Injectable
    class Service {}

    @Injectable
    class ServiceTwo {}

    const service = injector.provider.registerService('Service', Service);
    const serviceTwo = injector.provider.registerService('ServiceTwo', ServiceTwo);

    expect(injector.provider.services.size).toBe(2);

    expect(Reflect.getMetadata('inject:name', Service)).toEqual('Service');
    expect(Reflect.getMetadata('inject:name', ServiceTwo)).toEqual('ServiceTwo');

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

    const serviceTwo = injector.provider.registerService('ServiceTwo', ServiceTwo);

    expect(injector.provider.services.size).toBe(2);
    expect(Reflect.getMetadata('inject:name', Service)).toEqual('Service');
    expect(Reflect.getMetadata('inject:name', ServiceTwo)).toEqual('ServiceTwo');
    expect(injector.provider.get(ServiceTwo).Service).toEqual(jasmine.any(Object));
    expect(injector.provider.get(ServiceTwo).Service).toEqual(injector.provider.get(Service));


    expect(serviceTwo).toEqual(injector.provider.get(ServiceTwo));
    expect(serviceTwo).toEqual(injector.provider.get(ServiceTwo));
    expect(serviceTwo.Service).toEqual(injector.provider.get(Service));
  });

  it('register with FACTORY', () => {
    class Factory {
      get type () {
        return 'FACTORY';
      }
    }

    @Injectable({
      useFactory: () => new Factory()
    })
    class Service {}


    const factory = injector.provider.registerService('Service', Service);
    const service = factory();

    expect(injector.provider.services.size).toBe(1);

    expect(injector.provider.get(Service)().type).toEqual('FACTORY');
    expect(service.type).toEqual('FACTORY');

    expect(factory).toEqual(injector.provider.get(Service));
  });

  it('register with VALUE', () => {
    @Injectable({
      useValue: 'anyValue'
    })
    class Service {}

    const service = injector.provider.registerService('Service', Service);

    expect(injector.provider.services.size).toBe(1);
    expect(Reflect.getMetadata('inject:name', Service)).toEqual('Service');
    expect(injector.provider.get(Service)).toEqual('anyValue');
  });

  it('register with VALUE and FACTORY', () => {
    const options = {
      useValue: 'anyValue',
      useFactory: function () {}
    };

    const whitelist = Reflect.ownKeys(FACTORY_TYPES);

    const error = message(
      ERROR_MESSAGE.ERROR_001,
      { names: JSON.stringify(whitelist) }
    );

    expect(
      () => {
        @Injectable(options)
        class Service {}
      }
    ).toThrowError(`${ERROR_MESSAGE.ERROR_000} ${error}`);
  });

  it('register with random keys', () => {
    spyOn(console, 'warn');

    const options = {
      anyKey: 'anyValue'
    };

    @Injectable(options)
    class Service {}

    let msg = message(WARNING_MESSAGE.WARNING_000, { name: 'Service', options: JSON.stringify(options) });

    expect(console.warn)
      .toHaveBeenCalledWith(`${ERROR_MESSAGE.ERROR_000} ${msg}`);
  });

  /*it('FACTORY get vue', () => {
    class Factory {
      constructor () {}
    }

    @Injectable({
      FACTORY: () => new Factory()
    })
    class Service {
      @Inject(Vue) vm;
    }


    const service = injector.provider.registerService(app, 'Service', Service);

    expect(injector.provider.services.size).toBe(1);
    expect(service).toEqual(injector.provider.get(Service));

    expect(app).toEqual(injector.provider.get(Service).vm);
  });*/

  it('FACTORY invalid return', () => {
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
      () => injector.provider.registerService('Service', Service)
    ).toThrowError(`${ERROR_MESSAGE.ERROR_000} ${ERROR_MESSAGE.ERROR_006}`);
  });


  it('get service before register', () => {
    @Injectable
    class Service {}

    const service = injector.get(Service);

    expect(injector.provider.services.size).toBe(1);
    expect(Reflect.getMetadata('inject:name', Service)).toEqual('Service');
    expect(service).toEqual(injector.provider.get(Service));
  });

  it('get service after register', () => {
    @Injectable
    class Service {}

    const service = injector.provider.registerService('Service', Service);
    const injectorService = injector.get(Service);

    expect(Reflect.getMetadata('inject:name', Service)).toEqual('Service');
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
        () => injector.provider.registerService('Service', Service)
    ).toThrowError(`${ERROR_MESSAGE.ERROR_000} ${ERROR_MESSAGE.ERROR_005}`);
    expect(
        () => injector.provider.registerService('ServiceTwo', ServiceTwo)
    ).toThrowError(`${ERROR_MESSAGE.ERROR_000} ${ERROR_MESSAGE.ERROR_005}`);
  });
});
