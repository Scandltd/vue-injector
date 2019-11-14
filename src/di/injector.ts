import Vue from 'vue';
import { assert } from '../util/warn';
import { InjectedObject } from '../intefaces';
import { InjectableConstructor } from './decorators/injectable';
import { checkObject } from '../util/object';
import { ERROR_MESSAGE } from '../enums/messages';
import { Provider } from './provider';

export class Injector {
  static app: Vue;

  app: Vue;
  services: Map<InjectableConstructor, Provider>;

  rootServices: Array<any> = [];

  constructor(app: Vue, rootServices) {
    Injector.app = app;
    this.app = app;
    this.rootServices = rootServices;

    this.services = new Map();
  }

  registerComponent(component: Vue) {
    if (Object.hasOwnProperty.call(component, '_providers')) {
      const providers = component._providers;

      if (providers && checkObject(providers)) {
        Object.keys(providers).forEach((name) => {
          if (providers && Object.hasOwnProperty.call(providers, name)) {
            this.provide(
              component._providers[name],
              component,
              name
            );
          }
        });
      } else {
        throw assert(false, ERROR_MESSAGE.ERROR_004);
      }
    }

    if (this.rootServices.length) {
      this.rootServices.forEach((provider) => {
        this.provide(provider, component);
      });
    }
  }

  get(service) {
    return this.provide(service);
  }

  provide(service: InjectableConstructor, target: InjectedObject = null, customName?: string) {
    if (!this.services.has(service)) {
      if (service.prototype.providers) {
        this.registerDependencies(service.prototype);
      }

      const provider = new Provider(service);

      this.services.set(service, provider);
    }

    const provider = this.services.get(service);

    provider.bindTo(target, customName);

    return provider.instance();
  }

  private registerDependencies(service) {
    if (!checkObject(service.providers)) {
      throw assert(false, ERROR_MESSAGE.ERROR_004);
    }

    Object.keys(service.providers)
      .forEach((name: string) => {
        this.provide(
          service.providers[name],
          service,
          name
        );
      });

    delete service.providers;
  }
}
