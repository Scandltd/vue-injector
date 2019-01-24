import { assert, warn } from '../util/warn';
import Vue from 'vue';
import { InjectedObject } from '../../types';
import { Inject } from '../index';
import { ServiceFactory } from './factory';
import { InjectableConstructor } from './decorators/injectable';
import { checkGetName, checkObject } from '../util/object';

export class Provider {
  app: Vue;
  services: Map<InjectableConstructor, Object>;

  rootProviders: Array<any> = [];

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
        if (checkGetName(provider)) {
          this.registerService(component, provider.getName(), provider);
        }
      });
    }
  }

  registerService (target: InjectedObject, name: string, Service: InjectableConstructor): Object {
    if (!this.services.has(Service) && (Service as any).isVueService) {
      Service.prototype.vm = (target as any).$root || (target as any).vm;

      if (Service.prototype.providers) {
        this.registerImport(Service.prototype, Service.prototype.providers);
      }

      this.services.set(Service, this.serviceFactory.getNewService(Service));
    }

    const provider = this.services.get(Service);

    if (provider && Service.prototype.providers) {
      this.registerImport(provider, Service.prototype.providers);
      delete Service.prototype.providers;
    }

    if (provider) {
      this.injectService(target, [{
        name,
        service: provider
      }]);

      return provider;
    }

    assert(false, 'no decorator Injectable');
  }

  registerImport (provider, imports) {
    if (checkObject(imports)) {
      const services = Object.keys(imports)
        .map((name: string) => {
          const service = this.registerService(provider, name, imports[name]);

          return {
            name,
            service
          };
        })
        .filter(inject => inject.service instanceof Inject);

      this.injectService(provider, services);
    } else {
      assert(false, 'providers not object');
    }
  }

  set (Service) {
    if (checkGetName(Service)) {
      this.registerService(this.app, Service.getName(), Service);
    }
  }

  get (Service) {
    if (!this.services.has(Service)) {
      this.set(Service);
    }

    return this.services.get(Service);
  }

  private injectService (target: InjectedObject, imports: Array<{ name: string, service?: Object}>) {
    imports.forEach((Inject: { name: string, service?: Object}) => {
      const injectServiceName = Inject.name;

      const checkProperty: boolean = Object.hasOwnProperty.call(target, injectServiceName)
        ? !target[injectServiceName]
        : true;

      if (checkProperty && Inject.service) {
        Reflect.defineProperty(target, injectServiceName, {
          enumerable: true,
          writable: false,
          value: Inject.service
        });
      }
    });
  }
}
