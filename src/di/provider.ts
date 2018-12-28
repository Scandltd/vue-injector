import { assert, warn } from '../util/warn';
import Vue, { Component } from 'vue';
import { InjectedObject } from '../../types';
import { Inject } from '../index';
import { InjectConstructor } from './inject';

export class Provider {
  app: Vue;
  services: Map<InjectConstructor, Inject>;

  rootProviders: Array<typeof Inject> = [];

  constructor (app: Vue, rootProviders) {
    this.app = app;
    this.rootProviders = rootProviders;

    this.services = new Map();
  }

  registerComponent (component: Component) {
    if (component.hasOwnProperty('_providers')) {
      const providers = (component as any)._providers;

      if (providers && this.checkObject(providers)) {
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
        if (this.checkGetName(provider)) {
          this.registerService(component, provider.getName(), provider);
        }
      });
    }
  }

  registerService (target: InjectedObject, name: string, Service: InjectConstructor): Inject {
    if (!this.services.has(Service) && Service.name === 'Injectable') {
      Service.prototype.vm = this.app;

      this.services.set(Service, new Service(this.app));
    }

    const provider = this.services.get(Service);

    if (provider && provider instanceof Inject) {
      if (provider.import) {
        if (this.checkObject(provider.import)) {
          const services = Object.keys(provider.import)
            .map((name: string) => {
              const service = this.registerService(provider, name, provider.import[name]);

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

      this.injectService(target, [{
        name,
        service: provider
      }]);

      return provider;
    }

    assert(false, 'no decorator Injectable or extends Inject');
  }

  set (Service: typeof Inject) {
    if (this.checkGetName(Service)) {
      const provider = this.registerService(this.app, Service.getName(), Service);

      if (provider && provider instanceof Inject) {
        this.services.set(Service, provider);
      }
    }
  }

  get (Service: typeof Inject) {
    if (!this.services.has(Service)) {
      this.set(Service);
    }

    return this.services.get(Service);
  }

  private injectService (target: InjectedObject, imports: Array<{ name: string, service?: Inject}>) {
    imports.forEach((Inject: { name: string, service?: Inject}) => {
      const injectServiceName = Inject.name;

      if (!Object.hasOwnProperty.call(target, injectServiceName) && Inject.service) {
        Reflect.defineProperty(target, injectServiceName, {
          enumerable: true,
          get () {
            return Inject.service;
          }
        });
      }
    });
  }

  private checkObject (obj: any): boolean {
    return !Array.isArray(obj) && typeof obj === 'object' && obj !== null;
  }

  private checkGetName (provider: any): boolean {
    if (Object.hasOwnProperty.call(provider, 'getName') && typeof provider.getName === 'function') {
      return true;
    } else {
      warn(false, 'no decorator Injectable or extends Inject');
      return false;
    }
  }
}
