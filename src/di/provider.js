/* @flow */
import { assert, warn } from '../util/warn'
import { Inject } from './inject'

export class Provider {
  app: GlobalAPI;
  services: Map<typeof InjectableClass, Inject>;

  rootProviders: Array<typeof InjectableClass> = [];

  constructor (app: GlobalAPI, rootProviders) {
    this.app = app
    this.rootProviders = rootProviders

    this.services = new Map()
  }

  _injectService (target: InjectedObject, imports: Array<{ name: string, service: ?Inject}>) {
    imports.forEach((Inject: { name: string, service: ?Inject}) => {
      const injectServiceName = Inject.name

      if (!Object.hasOwnProperty.call(target, injectServiceName) && Inject.service) {
        Reflect.defineProperty(target, injectServiceName, {
          enumerable: true,
          get () {
            return Inject.service
          }
        })
      }
    })
  }

  _checkObject (obj: any): boolean {
    return !Array.isArray(obj) && typeof obj === 'object' && obj !== null
  }

  _checkGetName (provider: any): boolean {
    if (Object.hasOwnProperty.call(provider, 'getName') && typeof provider.getName === 'function') {
      return true
    } else {
      warn(false, 'no decorator Injectable or extends Inject')
      return false
    }
  }

  registerComponent (component: Component) {
    if (component.hasOwnProperty('_providers')) {
      const providers = component._providers

      if (providers && this._checkObject(providers)) {
        Object.keys(providers).forEach(name => {
          if (providers && providers.hasOwnProperty(name)) {
            this.registerService(component, name, providers[name])
          }
        })
      } else {
        assert(false, 'providers not object')
      }
    }

    if (this.rootProviders.length) {
      this.rootProviders.forEach(provider => {
        if (this._checkGetName(provider)) {
          this.registerService(component, provider.getName(), provider)
        }
      })
    }
  }

  registerService (target: InjectedObject, name: string, Service: typeof InjectableClass): Inject | void {
    if (!this.services.has(Service) && Service.name === 'Injectable') {
      this.services.set(Service, new Service(this.app))
    }

    const provider = this.services.get(Service)

    if (provider && provider instanceof Inject) {
      if (provider.import) {
        if (this._checkObject(provider.import)) {
          const services = Object.keys(provider.import)
            .map((name: string) => {
              const service = this.registerService(provider, name, provider.import[name])

              return {
                name,
                service
              }
            })
            .filter(inject => inject.service instanceof Inject)

          this._injectService(provider, services)
        } else {
          assert(false, 'providers not object')
        }
      }

      this._injectService(target, [{
        name,
        service: provider
      }])

      return provider
    }

    assert(false, 'no decorator Injectable or extends Inject')
  }

  set (Service: typeof InjectableClass) {
    if (this._checkGetName(Service)) {
      const provider = this.registerService(this.app, Service.getName(), Service)

      if (provider && provider instanceof Inject) {
        this.services.set(Service, provider)
      }
    }
  }

  get (Service: typeof InjectableClass) {
    if (!this.services.has(Service)) {
      this.set(Service)
    }

    return this.services.get(Service)
  }
}
