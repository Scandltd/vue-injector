/* @flow */

function injectableFactory (target, options = {}) {
  return class Injectable extends target implements InjectableClass {
    static service: InjectableClass;

    +name: string = target.name;
    +isVueService: boolean = true;

    static getName (): string {
      return target.name
    }

    constructor (root: GlobalAPI) {
      if (options && options.hasOwnProperty('context')) {
        Reflect.defineProperty(target.prototype, 'context', {
          enumerable: true,
          get () {
            return options.context
          }
        })
      }

      if (options && options.hasOwnProperty('import')) {
        Reflect.defineProperty(target.prototype, 'import', {
          enumerable: false,
          get () {
            return options.import
          }
        })
      }

      Reflect.defineProperty(target.prototype, 'vm', {
        enumerable: true,
        get () {
          return root
        }
      })

      super()
    }
  }
}

export function Injectable (options: any) {
  if (typeof options === 'function') {
    return injectableFactory(options)
  }
  return function (Service: any) {
    return injectableFactory(Service, options)
  }
}
