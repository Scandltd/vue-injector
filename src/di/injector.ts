import Vue from 'vue';
import { assert } from '../util/warn';
import { InjectedObject } from '../../types';
import { InjectableConstructor } from './decorators/injectable';
import { checkObject } from '../util/object';
import { ERROR_MESSAGE } from '../enums/messages';
import { Provider } from './provider';

export class Injector {
  app: Vue;
  services: Map<InjectableConstructor, () => any>;

  rootServices: Array<any> = [];

  constructor (app: Vue, rootServices) {
    this.app = app;
    this.rootServices = rootServices;

    this.services = new Map();
  }

  registerComponent (component: Vue) {
    if (component.hasOwnProperty('_providers')) {
      const providers = component._providers;

      if (providers && checkObject(providers)) {
        Object.keys(providers).forEach(name => {
          if (providers && providers.hasOwnProperty(name)) {
            this.provide(
              component._providers[name],
              component,
              name
            );
          }
        });
      } else {
        assert(false, ERROR_MESSAGE.ERROR_004);
      }
    }

    if (this.rootServices.length) {
      this.rootServices.forEach(provider => {
        this.provide(provider, component);
      });
    }
  }

  get (service) {
    if (this.services.has(service)) {
      return this.getInstance(service);
    }

    return this.provide(service);
  }

  provide (service: InjectableConstructor, target: InjectedObject = null, customName?: string) {
    if (service.prototype.providers) {
      this.registerDependencies(service.prototype);
    }

    const provider = new Provider(target, service, customName);
    const factory = provider.get();

    if (!this.services.has(service)) {
      this.services.set(service, factory);
    }

    return this.getInstance(service);
  }

  private registerDependencies (service) {
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

  private getInstance (service) {
    return this.services.get(service)();
  }
}
