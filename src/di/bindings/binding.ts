import { InjectedObject } from '../decorators/injectable';

export class ServiceBinding {
  static bind<T>(
    target: InjectedObject,
    service: T,
    name: string
  ): boolean {
    return Reflect.defineProperty(target, name, {
      enumerable: true,
      configurable: false,
      get: () => service
    });
  }
}
