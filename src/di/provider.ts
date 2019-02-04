import { assert } from '../util/warn';
import Vue from 'vue';
import { InjectedObject } from '../../types';
import { InjectableConstructor } from './decorators/injectable';
import { checkObject } from '../util/object';
import { ServiceBinding } from './bindings/binding';
import { ServiceFactory } from './factory';

export class Provider {
  app: Vue;
  services: Map<InjectableConstructor, any>;

  rootProviders: Array<any> = [];

  private serviceBinding: ServiceBinding = new ServiceBinding();
  private serviceFactory: ServiceFactory = new ServiceFactory();

  constructor (app: Vue, rootProviders) {
    this.app = app;
    this.rootProviders = rootProviders;

    this.services = new Map();
  }

  registerComponent (component: Vue) {
    if (component.hasOwnProperty('_providers')) {
      const providers = component._providers;

      if (providers && checkObject(providers)) {
        Object.keys(providers).forEach(name => {
          if (providers && providers.hasOwnProperty(name)) {
            this.registerService(component, name, providers[name]);
          }
        });
      } else {
        assert(false, 'providers not object');
      }
    }

    if (this.rootProviders.length) {
      this.rootProviders.forEach(provider => {
        if (provider.isVueService) {
          this.registerService(component, provider.name, provider);
        }
      });
    }
  }

  registerService (target: InjectedObject, name: string, Service: InjectableConstructor): any {
    if (Service.name === 'Vue') {
      return target[name] = this.app;
    }

    if (!this.services.has(Service) && Service.isVueService) {
      if (Service.prototype.providers) {
        this.registerProviders(Service.prototype, Service.prototype.providers);
      }

      this.services.set(Service, this.serviceFactory.make(Service));
    }

    const service = this.services.get(Service);

    if (service && Service.prototype.providers) {
      this.registerProviders(service, Service.prototype.providers);
      delete Service.prototype.providers;
    }

    if (service) {
      return this.serviceBinding.bind(service, name).to(target) && service;
    }

    assert(false, 'no decorator Injectable');
  }

  registerProviders (provider, imports) {
    if (checkObject(imports)) {
      const services = Object.keys(imports)
        .map((name: string) => {
          const service = this.registerService(provider, name, imports[name]);

          return {
            name,
            service
          };
        });

      this.serviceBinding.bind(services).to(provider);
    } else {
      assert(false, 'providers not object');
    }
  }

  set (Service) {
    if (Service.isVueService) {
      this.registerService(this.app, Service.name, Service);
    }
  }

  get (Service) {
    if (!this.services.has(Service)) {
      this.set(Service);
    }

    return this.services.get(Service);
  }
}
