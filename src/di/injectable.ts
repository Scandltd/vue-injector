import Vue from 'vue';
import { Inject } from './inject';
import { InjectableClass } from '../../types';

function injectableFactory (target: typeof Inject, options: any = {}) {
  return class Injectable extends target {
    static service: InjectableClass;

    readonly isVueService: boolean = true;

    constructor (root: Vue) {
      super();

      Reflect.defineProperty(target.prototype, 'name', {
        enumerable: false,
        get () {
          return target.name;
        }
      });

      if (options && options.hasOwnProperty('context')) {
        Reflect.defineProperty(target.prototype, 'context', {
          enumerable: false,
          get () {
            return options.context;
          }
        });
      }

      if (options && options.hasOwnProperty('import')) {
        Reflect.defineProperty(target.prototype, 'import', {
          enumerable: false,
          get () {
            return options.import;
          }
        });
      }

      Reflect.defineProperty(target.prototype, 'vm', {
        enumerable: false,
        get () {
          return root;
        }
      });

      super();
    }

    static getName (): string {
      return target.name;
    }
  };
}

export function Injectable (options: any) {
  if (typeof options === 'function') {
    return injectableFactory(options);
  }
  return function (Service: any) {
    return injectableFactory(Service, options);
  };
}
