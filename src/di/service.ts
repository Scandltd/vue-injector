import { Inject } from './inject';

function createDecorator (
  factory: (target: any, key: string) => void
): PropertyDecorator {
  return function (target: any, key: string) {
    const Ctor = typeof target === 'function'
      ? target
      : target.constructor;
    if (!Ctor.__decorators__) {
      Ctor.__decorators__ = [];
    }

    Ctor.__decorators__.push(function (options) {
      return factory(options, key);
    });
  };
}

export function Service (service: typeof Inject): PropertyDecorator {
  return createDecorator(function (componentOptions, k) {
    (componentOptions.providers || (componentOptions.providers = {}))[k] = service;
  });
}
