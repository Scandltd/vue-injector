import 'reflect-metadata';

export interface InjectableConstructor {
  providers: { [key: string]: any };

  __decorators__?: Array<Function>;

  new (): any;
}

export interface InjectableOptions {
  useFactory?: () => any;
}

function injectableFactory (target: InjectableConstructor, options: InjectableOptions = {}) {
  const decorators = target.__decorators__;

  Reflect.defineMetadata('inject:name', target.name, target);
  Reflect.defineMetadata('inject:service', true, target);

  Reflect.defineMetadata('inject:factory', options.useFactory, target);

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
