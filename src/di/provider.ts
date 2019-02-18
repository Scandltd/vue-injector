import { assert } from '../util/warn';
import Vue from 'vue';
import { InjectedObject } from '../../types';
import { InjectableConstructor } from './decorators/injectable';
import { checkObject } from '../util/object';
import { ServiceBinding } from './bindings/binding';
import { ServiceFactory } from './factory';
import { ERROR_MESSAGE } from '../enums/messages';
import { FACTORY_TYPES, METADATA } from '../enums/metadata';

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
            this.binding(component, name, providers[name]);
          }
        });
      } else {
        assert(false, ERROR_MESSAGE.ERROR_004);
      }
    }

    if (this.rootProviders.length) {
      this.rootProviders.forEach(provider => {
        if (Reflect.getMetadata(METADATA.SERVICE, provider)) {
          const name = Reflect.getMetadata(METADATA.NAME, provider);

          this.binding(component, name, provider);
        }
      });
    }
  }

  registerService (name: string, Service: InjectableConstructor): any {
    if (Service.name === 'Vue') {
      return this.app;
    }

    if (!this.services.has(Service) && Reflect.getMetadata(METADATA.SERVICE, Service)) {
      if (Service.prototype.providers) {
        this.registerProviders(Service.prototype, Service.prototype.providers);
        delete Service.prototype.providers;
      }

      this.services.set(Service, this.serviceFactory.make(Service));
    }

    const service = this.services.get(Service);

    if (service) {
      return this.getService(Service, service);
    }

    assert(false, ERROR_MESSAGE.ERROR_005);
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
    if (Reflect.getMetadata(METADATA.SERVICE, Service)) {
      this.registerService(Reflect.getMetadata(METADATA.NAME, Service), Service);
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

  private getService (Service: InjectableConstructor, service) {
    /* TODO: remove this code */
    const type = Reflect.getMetadata(METADATA.TYPE, Service);

    switch (type) {
    case FACTORY_TYPES.useFactory:
      const result = service();

      if (result) {
        return result;
      } else {
        throw assert(false, ERROR_MESSAGE.ERROR_006);
      }
    default:
      return service;
    }
  }

  private binding (target: InjectedObject, name: string, Service: InjectableConstructor) {
    const service = this.registerService(name, Service);
    this.serviceBinding.bind(service, name).to(target);
  }
}
