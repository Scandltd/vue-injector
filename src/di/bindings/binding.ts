import { InjectableConstructor, InjectedObject } from '../decorators/injectable';

export class ServiceBinding {
  static bind(target: InjectedObject, service: InjectableConstructor, name: string): boolean {
    return Reflect.defineProperty(target, name, {
      enumerable: true,
      configurable: false,
      get: () => service
    });
  }
}
