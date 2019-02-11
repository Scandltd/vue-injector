export function createDecorator (
  factory: (target: any, key: string) => void
): PropertyDecorator {
  return function (target: any, key: string) {
    const descriptor = arguments[2];

    if (descriptor) {
      delete descriptor.initializer;
      descriptor.writable = true;
      descriptor.configurable = true;
    }

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
