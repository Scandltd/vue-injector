/* eslint-disable no-proto */
export function createDecorator(
  factory: (target: any, key: string) => void
): PropertyDecorator {
  // eslint-disable-next-line func-names
  return function (target: any, key: string) {
    const Ctor = typeof target === 'function'
      ? target
      : target.constructor;

    const descriptor = {
      enumerable: true,
      configurable: true,
      initializer() {
        return this.__proto__[key];
      }
    };

    Reflect.defineProperty(target, key, descriptor);

    (Ctor.__decorators__ || (Ctor.__decorators__ = [])).push((options) => factory(options, key));

    return descriptor;
  };
}
