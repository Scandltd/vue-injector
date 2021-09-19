/* eslint-disable no-proto */

/**
 * TODO: target.constructor._vccOpts makes a component miss template
 *
 * @param target
 * @param key
 * @param factory
 */
function addLifeCycleHook(target: any, key: string, factory: (target: any, key: string) => void) {
  const originSetupInjector = target.$setupInjector;

  target.$setupInjector = (componentOptions) => {
    if (originSetupInjector) {
      originSetupInjector(componentOptions);
    }

    factory(componentOptions, key);
  };
}

export function createDecorator(
  factory: (target: any, key: string) => void
): PropertyDecorator {
  return (target: any, key: string) => {
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

    addLifeCycleHook(target, key, factory);

    (Ctor.__decorators__ || (Ctor.__decorators__ = [])).push((options) => factory(options, key));

    return descriptor;
  };
}
