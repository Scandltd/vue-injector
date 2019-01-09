import Vue from 'vue';
import { InjectInterface, InjectConstructor } from './inject';

function injectableFactory (target: InjectConstructor, options: any = {}) {
  return class Injectable extends target implements InjectInterface {
    static readonly useFactory: Function = options.useFactory;
    static readonly import: { [key: string]: typeof Injectable } = options.import || null;

    readonly isVueService: boolean = true;
    readonly name: string = target.name;

    readonly context: Object = options.context || null;

    readonly vm: Vue = this.vm;

    static getName (): string {
      return target.name;
    }
  };
}

export function Injectable <IC extends InjectConstructor> (options: IC): IC;
export function Injectable <I extends InjectInterface> (options: any): <IC extends InjectConstructor>(target: IC) => IC;
export function Injectable (options) {
  if (typeof options === 'function') {
    return injectableFactory(options);
  }
  return function (target) {
    return injectableFactory(target, options);
  };
}


