export function createDecorator (
  factory: (target: any, key: string, descriptor?: PropertyDescriptor) => void
): PropertyDecorator {
  return function (target: any, key: string, descriptor?: PropertyDescriptor) {
    const Ctor = typeof target === 'function'
      ? target
      : target.constructor;

    if (!Ctor.__decorators__) {
      Ctor.__decorators__ = [];
    }

    Ctor.__decorators__.push(function (options) {
      return factory(options, key, descriptor);
    });
  };
}
