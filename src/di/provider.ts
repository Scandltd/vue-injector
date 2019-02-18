import { assert } from '../util/warn';
import Vue from 'vue';
import { InjectedObject } from '../../types';
import { InjectableConstructor } from './decorators/injectable';
import { checkObject } from '../util/object';
import { ServiceBinding } from './bindings/binding';
import { ServiceFactory } from './factory';
import { ERROR_MESSAGE } from '../enums/messages';
import { FACTORY_TYPES, METADATA } from '../enums/metadata';
import { Instance } from './bindings/instance';
import { Factory } from './bindings/factory';

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
      return service;
    }

    throw assert(false, ERROR_MESSAGE.ERROR_005);
  }

  registerProviders (provider, imports) {
    if (checkObject(imports)) {
      Object.keys(imports)
        .forEach((name: string) => {
          this.binding(provider, name, imports[name]);
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

    return this.getting(Service);
  }

  private getting (Service: InjectableConstructor): any {
    const name = Reflect.getMetadata(METADATA.NAME, Service);
    const service = this.services.get(Service);
    const strategy = this.getStrategy(Service);

    return this.serviceBinding.bind(strategy, service, name).get();
  }

  private binding (target: InjectedObject, name: string, Service: InjectableConstructor) {
    const service = this.registerService(name, Service);
    const strategy = this.getStrategy(Service);

    this.serviceBinding.bind(strategy, service, name).to(target);
  }

  private getStrategy (Service: InjectableConstructor) {
    const type = Reflect.getMetadata(METADATA.TYPE, Service);

    switch (type) {
    case FACTORY_TYPES.useFactory:
      return new Factory();
    default:
      return new Instance();
    }
  }
}
