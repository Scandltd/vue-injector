import Vue from 'vue';
import { assert } from '../util/warn';
import { InjectableConstructor, InjectedObject } from './decorators/injectable';
import { checkObject } from '../util/object';
import { ERROR_MESSAGE } from '../enums/messages';
import { Provider } from './provider';

export class Injector {
  app: Vue;
  services: Map<InjectableConstructor, Provider>;

  rootServices: Array<InjectableConstructor> = [];

  constructor(app: Vue, rootServices) {
    Provider.app = app;

    this.app = app;
    this.rootServices = rootServices;

    this.services = new Map();
  }

  registerComponent(component: Vue) {
    this.provideAllServices(component);

    if (this.rootServices.length) {
      this.rootServices.forEach((provider) => {
        this.provide(provider, component);
      });
    }
  }

  get<T>(service: InjectableConstructor<T>): T {
    return this.provide<T>(service);
  }

  provide<T>(
    service: InjectableConstructor<T>,
    target: InjectedObject = null,
    customName?: string
  ) {
    if (!this.services.has(service)) {
      if (service.prototype.providers) {
        this.registerDependencies<T>(service.prototype);
      }

      this.services.set(service, new Provider<T>(service));
    }

    const provider = this.services.get(service);

    if (target) {
      provider.bindTo(target, customName);
    }

    return provider.instance as T;
  }

  private provideAllServices(target: InjectedObject) {
    if (Object.hasOwnProperty.call(target, 'providers')) {
      const { providers } = target;

      if (providers && checkObject(providers)) {
        Object.keys(providers).forEach((name) => {
          if (providers && Object.hasOwnProperty.call(providers, name)) {
            this.provide(
              providers[name],
              target,
              name
            );
          }
        });
      } else {
        throw assert(false, ERROR_MESSAGE.ERROR_PROVIDERS_TYPE);
      }
    }
  }

  private registerDependencies<T>(service: InjectableConstructor<T>) {
    this.provideAllServices(service);

    delete service.providers;
  }
}
