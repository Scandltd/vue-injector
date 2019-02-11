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
            this.registerService(component, name, providers[name]);
          }
        });
      } else {
        assert(false, ERROR_MESSAGE.ERROR_004);
      }
    }

    if (this.rootProviders.length) {
      this.rootProviders.forEach(provider => {
        if (Reflect.getMetadata('inject:service', provider)) {
          this.registerService(component, Reflect.getMetadata('inject:name', provider), provider);
        }
      });
    }
  }

  registerService (target: InjectedObject, name: string, Service: InjectableConstructor): any {
    if (Service.name === 'Vue') {
      return target[name] = this.app;
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
      return this.serviceBinding.bind(service, name).to(target) && service;
    }

    assert(false, ERROR_MESSAGE.ERROR_005);
  }

  registerProviders (provider, imports) {
    if (checkObject(imports)) {
      Object.keys(imports)
        .forEach((name: string) => {
          this.registerService(provider, name, imports[name]);
        });
    } else {
      assert(false, ERROR_MESSAGE.ERROR_004);
    }
  }

  set (Service) {
    if (Reflect.getMetadata('inject:service', Service)) {
      this.registerService(this.app, Reflect.getMetadata('inject:name', Service), Service);
    }
  }

  get (Service) {
    if (!this.services.has(Service)) {
      this.set(Service);
    }

    return this.services.get(Service);
  }
}
