export interface InjectableConstructor {
  isVueService: boolean;
  useFactory: Function;
  providers: { [key: string]: any };

  __decorators__?: Array<Function>;

  new (): any;

  getName (): string;
}

export interface InjectableOptions {
  useFactory?: () => any;
}

function injectableFactory (target: InjectableConstructor, options: InjectableOptions = {}) {
  const decorators = target.__decorators__;

  target.isVueService = true;
  target.useFactory = options.useFactory;

  target.getName = (): string => {
    return target.name;
  };

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


