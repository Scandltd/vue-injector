/* @flow */
import { assert } from '../util/warn'
import { Inject } from './inject'

export class Provider {
  app: GlobalAPI;
  services: Map<typeof InjectableClass, Inject>;

  constructor (app: GlobalAPI) {
    this.app = app
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

  get (Servise: typeof InjectableClass) {
    if (!this.services.has(Servise)) {
      const provider = this.registerService(this.app, Servise.getName(), Servise)

      if (provider && provider instanceof Inject) {
        this.services.set(Servise, provider)
      }
    }

    return this.services.get(Servise)
  }
}
