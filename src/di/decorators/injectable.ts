export interface InjectableConstructor {
  isVueService: boolean;
  useFactory: Function;
  providers: { [key: string]: any };

  __decorators__?: Array<Function>;

  new (): any;
}

export interface InjectableOptions {
  useFactory?: () => any;
}

function injectableFactory (target: InjectableConstructor, options: InjectableOptions = {}) {
  const decorators = target.__decorators__;

  target.prototype.name = target.name;

  target.isVueService = true;
  target.useFactory = options.useFactory;

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


