import Vue from 'vue';
import { Inject, InjectConstructor } from './inject';

function injectableFactory (target: InjectConstructor, options: any = {}) {
  return class Injectable extends target implements Inject {
    readonly isVueService: boolean = true;
    readonly name: string = target.name;
    readonly context: Object = options.context || null;

    import: { [key: string]: typeof Injectable } = options.import || null;

    readonly vm: Vue;

    constructor (root: Vue) {
      super(setRootApp(root));

      function setRootApp (root) {
        Reflect.defineProperty(target.prototype, 'vm', {
          enumerable: false,
          get () {
            return root;
          }
        });

        return root;
      }
    }

    static getName (): string {
      return this.name;
    }
  };
}

export function Injectable <IC extends InjectConstructor> (options: IC): IC;
export function Injectable <I extends Inject> (options: any): <IC extends InjectConstructor>(target: IC) => IC;
export function Injectable (options) {
  if (typeof options === 'function') {
    return injectableFactory(options);
  }
  return function (target) {
    return injectableFactory(target, options);
  };
}


