import { assert } from '../../util/warn';

enum TYPES {
  useFactory,
  useValue
}

export interface InjectableConstructor {
  isVueService: boolean;
  useFactory: Function;
  useValue: any;
  providers: { [key: string]: any };

  __decorators__?: Array<Function>;

  new (): any;
}

export interface InjectableOptions {
  useFactory?: () => any;
  useValue?: any;
}

function injectableFactory (target: InjectableConstructor, options: InjectableOptions = {}) {

  if (0 !== Object.keys(options).length) {
    if (Object.keys(options).length > 1) {
      throw new Error('only useFactory or useValue are allowed');
    }
    if (!Object.keys(TYPES).find(key => key === Object.keys(options)[0])) {
      throw new Error('only useFactory or useValue are allowed');
    }

    let type = Object.keys(options)[0];
    target[type] = options[type];
  }

  const decorators = target.__decorators__;

  target.prototype.name = target.name;

  target.isVueService = true;

  if (decorators) {
    decorators.forEach(function (fn) { return fn(target.prototype); });
    delete target.__decorators__;
  }

  return target;
}

export function Injectable (options): any {
  if (typeof options === 'function') {
    return injectableFactory(options);
  }
  return function (target) {
    return injectableFactory(target, options);
  };
}
