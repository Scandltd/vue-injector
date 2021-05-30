/* eslint-disable no-empty-function */
/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable max-classes-per-file */
import { createApp } from 'vue';
import plugin, { VueInjector, Injectable, Inject } from '../../../src/index';
import { message, ERROR_MESSAGE, WARNING_MESSAGE } from '../../../src/enums/messages';
import { FACTORY_TYPES, METADATA } from '../../../src/enums/metadata';

describe('registerComponent service', () => {
  let injector: VueInjector;
  let app;

  beforeEach(() => {
    app = createApp({});

    app.use(plugin, {});

    injector = app.config.globalProperties.$injector;
  });

  it('register one', () => {
    @Injectable
    class Service {}

    const service = injector.injector.provide(Service);

    expect(injector.injector.services.size).toBe(1);

    expect(service).toEqual(injector.injector.get(Service));
    expect(Reflect.getMetadata(METADATA.NAME, Service)).toEqual('Service');
  });

  it('register two', () => {
    @Injectable
    class Service {}

    @Injectable
    class ServiceTwo {}

    const service = injector.injector.provide(Service);
    const serviceTwo = injector.injector.provide(ServiceTwo);

    expect(injector.injector.services.size).toBe(2);

    expect(Reflect.getMetadata(METADATA.NAME, Service)).toEqual('Service');
    expect(Reflect.getMetadata(METADATA.NAME, ServiceTwo)).toEqual('ServiceTwo');

    expect(service).toEqual(injector.injector.get(Service));
    expect(serviceTwo).toEqual(injector.injector.get(ServiceTwo));
  });

  it('register with import', () => {
    @Injectable
    class Service {
      count = 0;
    }

    @Injectable
    class ServiceTwo {
      @Inject(Service) Service;
    }

    @Injectable
    class ServiceThree {
      @Inject(Service) Service;
    }

    const serviceTwo = injector.injector.provide(ServiceTwo);
    const serviceThree = injector.injector.provide(ServiceThree);

    serviceTwo.Service.count += 1;
    serviceThree.Service.count += 1;

    expect(injector.injector.services.size).toBe(3);
    expect(Reflect.getMetadata(METADATA.NAME, Service)).toEqual('Service');
    expect(Reflect.getMetadata(METADATA.NAME, ServiceTwo)).toEqual('ServiceTwo');
    expect(injector.injector.get(ServiceTwo).Service).toEqual(expect.any(Object));
    expect(injector.injector.get(ServiceTwo).Service).toEqual(injector.injector.get(Service));

    expect(serviceTwo).toEqual(injector.injector.get(ServiceTwo));
    expect(serviceTwo).toEqual(injector.injector.get(ServiceTwo));
    expect(serviceTwo.Service).toEqual(injector.injector.get(Service));

    expect(injector.injector.get(Service).count).toEqual(2);
  });

  it('register with type', () => {
    @Injectable
    class Service {
      count = 0;
    }

    @Injectable
    class ServiceTwo {
      @Inject Service: Service;
    }

    @Injectable
    class ServiceThree {
      @Inject Service: Service;
    }

    const serviceTwo = injector.injector.provide(ServiceTwo);
    const serviceThree = injector.injector.provide(ServiceThree);

    serviceTwo.Service.count += 1;
    serviceThree.Service.count += 1;

    expect(injector.injector.services.size).toBe(3);
    expect(Reflect.getMetadata(METADATA.NAME, Service)).toEqual('Service');
    expect(Reflect.getMetadata(METADATA.NAME, ServiceTwo)).toEqual('ServiceTwo');
    expect(injector.injector.get(ServiceTwo).Service).toEqual(jasmine.any(Object));
    expect(injector.injector.get(ServiceTwo).Service).toEqual(injector.injector.get(Service));

    expect(serviceTwo).toEqual(injector.injector.get(ServiceTwo));
    expect(serviceTwo).toEqual(injector.injector.get(ServiceTwo));
    expect(serviceTwo.Service).toEqual(injector.injector.get(Service));

    expect(injector.injector.get(Service).count).toEqual(2);
  });

  it('register with FACTORY', () => {
    class Factory {
      a = 0;

      constructor() {
        this.a += 1;
      }

      add() {
        this.a += 1;
      }

      get type() {
        return 'FACTORY';
      }
    }

    const factory = () => new Factory();

    @Injectable({
      useFactory: factory
    })
    class Service extends Factory {}

    const service = injector.injector.provide(Service);

    expect(injector.injector.services.size).toBe(1);

    const a = injector.injector.get(Service);

    a.add();
    a.add();

    expect(injector.injector.get(Service).type).toEqual('FACTORY');
    expect(service.type).toEqual('FACTORY');

    expect(factory().a).toEqual(1);
    expect(injector.injector.get(Service).a).toEqual(3);

    injector.injector.get(Service).add();
    injector.injector.get(Service).add();

    expect(injector.injector.get(Service).a).toEqual(5);
  });

  it('register error FACTORY', () => {
    // @ts-ignore: Unreachable code error
    @Injectable({
      useFactory: {}
    })
    class Service {}

    expect(
      () => injector.injector.provide(Service)
    ).toThrowError(message(`${ERROR_MESSAGE.ERROR_TYPE} ${ERROR_MESSAGE.ERROR_USE_FACTORY_TYPE}`, { name: 'Service' }));
  });

  it('register with VALUE', () => {
    @Injectable({
      useValue: 'anyValue'
    })
    class Service {}

    injector.injector.provide(Service);

    expect(injector.injector.services.size).toBe(1);
    expect(Reflect.getMetadata(METADATA.NAME, Service)).toEqual('Service');
    expect(injector.injector.get(Service)).toEqual('anyValue');
  });

  it('register error VALUE', () => {
    @Injectable({
      useValue: null
    })
    class Service {}

    expect(
      () => injector.injector.provide(Service)
    ).toThrowError(`${ERROR_MESSAGE.ERROR_TYPE} ${ERROR_MESSAGE.ERROR_USE_VALUE_RETURN}`);
  });

  it('register with VALUE and FACTORY', () => {
    const options = {
      useValue: 'anyValue',
      useFactory() {}
    };

    const whitelist = Reflect.ownKeys(FACTORY_TYPES);

    const error = message(
      ERROR_MESSAGE.ERROR_INJECTABLE_OPTIONS_CONFLICT,
      { names: JSON.stringify(whitelist) }
    );

    expect(
      () => {
        @Injectable(options)
        class Service {}
      }
    ).toThrowError(`${ERROR_MESSAGE.ERROR_TYPE} ${error}`);
  });

  it('register with random keys', () => {
    jest.spyOn(console, 'warn');

    const options = {
      anyKey: 'anyValue'
    };
    // @ts-ignore: Unreachable code error
    @Injectable(options)
    class Service {}

    const msg = message(WARNING_MESSAGE.WARNING_000, { name: 'Service', options: JSON.stringify(options) });

    expect(console.warn)
      .toHaveBeenCalledWith(`${ERROR_MESSAGE.ERROR_TYPE} ${msg}`);
  });

  it('register with Vue', () => {
    @Injectable
    class Service {
      @Inject(app) vm;
    }

    const service = injector.injector.provide(Service);

    expect(injector.injector.services.size).toBe(2);

    expect(service).toEqual(injector.injector.get(Service));
    expect(Reflect.getMetadata(METADATA.NAME, Service)).toEqual('Service');

    expect(service.vm).toEqual(app);
  });

  it('FACTORY invalid return', () => {
    class Factory {
      constructor(public vm) {}
    }
    // @ts-ignore: Unreachable code error
    @Injectable({
      useFactory: (vm) => {
        new Factory(vm);
      }
    })
    class Service {}

    expect(
      () => injector.injector.provide(Service)
    ).toThrowError(`${ERROR_MESSAGE.ERROR_TYPE} ${ERROR_MESSAGE.ERROR_USE_FACTORY_RETURN}`);
  });

  it('get service before register', () => {
    @Injectable
    class Service {}

    const service = injector.get(Service);

    expect(injector.injector.services.size).toBe(1);
    expect(Reflect.getMetadata(METADATA.NAME, Service)).toEqual('Service');
    expect(service).toEqual(injector.injector.get(Service));
  });

  it('get service after register', () => {
    @Injectable
    class Service {}

    const service = injector.injector.provide(Service);
    const injectorService = injector.get(Service);

    expect(Reflect.getMetadata(METADATA.NAME, Service)).toEqual('Service');
    expect(service).toEqual(injector.injector.get(Service));

    expect(injector.injector.services.size).toBe(1);
    expect(injectorService).toEqual(injector.injector.get(Service));
  });

  it('register not Injectable', () => {
    class Service {}

    @Injectable
    class ServiceTwo {
      @Inject(Service) Service;
    }

    expect(
      () => injector.injector.provide(Service)
    ).toThrowError(`${ERROR_MESSAGE.ERROR_TYPE} ${ERROR_MESSAGE.ERROR_USE_DECORATOR}`);
    expect(
      () => injector.injector.provide(ServiceTwo)
    ).toThrowError(`${ERROR_MESSAGE.ERROR_TYPE} ${ERROR_MESSAGE.ERROR_USE_DECORATOR}`);
  });
});
