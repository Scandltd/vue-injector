import { InjectableConstructor } from '../decorators/injectable';
import { InjectedObject } from '../../../types';

type service = { name: string, service?: Object};

interface Binding {
  binging: Array<Object>;

  bind (binging: Array<Object> | Object): this;
  to (target: InjectedObject): boolean;
}

export class ServiceBinding implements Binding {
  binging: Array<service> = null;

  bind (binging: Array<service> | InjectableConstructor, name?: string): this {
    if (!Array.isArray(binging)) {
      binging = [{
        name: name || binging.name,
        service: binging
      }];
    }

    this.binging = binging;

    return this;
  }

  to (target: InjectedObject): boolean {
    this.binging.forEach((Inject: service) => {
      const injectServiceName = Inject.name;

      if (Inject.service) {
        Reflect.defineProperty(target, injectServiceName, {
          enumerable: true,
          configurable: false,
          get: () => Inject.service
        });
      }
    });

    this.binging = [];

    return true;
  }
}
