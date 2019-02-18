export function createDecorator (
  factory: (target: any, key: string) => void
): PropertyDecorator {
  return function (target: any, key: string) {
    const Ctor = typeof target === 'function'
      ? target
      : target.constructor;

    const descriptor = {
      enumerable: true,
      configurable: true,
      initializer: function () {
        return this.__proto__[key];
      }
    };

    Reflect.defineProperty(target, key, descriptor);

    (Ctor.__decorators__ || (Ctor.__decorators__ = [])).push(function (options) {
      return factory(options, key);
    });

    return descriptor;
  };
}
