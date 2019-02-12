import { assert } from '../util/warn';
import Vue from 'vue';
import { InjectedObject } from '../../types';
import { InjectableConstructor } from './decorators/injectable';
import { checkObject } from '../util/object';
import { ServiceBinding } from './bindings/binding';
import { ServiceFactory } from './factory';
import { ERROR_MESSAGE } from '../enums/messages';

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
            const service = this.registerService(name, providers[name]);
            this.bindService(component, name, service);
          }
        });
      } else {
        assert(false, ERROR_MESSAGE.ERROR_004);
      }
    }

    if (this.rootProviders.length) {
      this.rootProviders.forEach(provider => {
        if (Reflect.getMetadata('inject:service', provider)) {
          const name = Reflect.getMetadata('inject:name', provider);
          const service = this.registerService(name, provider);
          this.bindService(component, name, service);
        }
      });
    }
  }

  registerService (name: string, Service: InjectableConstructor): any {
    if (Service.name === 'Vue') {
      return this.app;
    }

    if (!this.services.has(Service) && Reflect.getMetadata('inject:service', Service)) {
      if (Service.prototype.providers) {
        this.registerProviders(Service.prototype, Service.prototype.providers);
        delete Service.prototype.providers;
      }

      this.services.set(Service, this.serviceFactory.make(Service));
    }

    const service = this.services.get(Service);

    if (service) {
      return service;
    }

    assert(false, ERROR_MESSAGE.ERROR_005);
  }

  bindService (target: InjectedObject, name: string, service: InjectableConstructor) {
    this.serviceBinding.bind(service, name).to(target);
  }

  registerProviders (provider, imports) {
    if (checkObject(imports)) {
      Object.keys(imports)
        .forEach((name: string) => {
          const service = this.registerService(name, imports[name]);
          this.serviceBinding.bind(service, name).to(provider);
        });
    } else {
      assert(false, ERROR_MESSAGE.ERROR_004);
    }
  }

  set (Service) {
    if (Reflect.getMetadata('inject:service', Service)) {
      this.registerService(Reflect.getMetadata('inject:name', Service), Service);
    }
  }

  get (Service) {
    if (Service.name === 'Vue') {
      return this.app;
    }

    if (!this.services.has(Service)) {
      this.set(Service);
    }

    return this.services.get(Service);
  }
}
