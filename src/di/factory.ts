import { assert } from '../util/warn';
import { InjectableConstructor } from './decorators/injectable';

export enum FACTORY_TYPES {
  DEFAULT = 'NEW',
  CUSTOM = 'FACTORY'
}

interface Factory {
  getNewService (Service: InjectableConstructor): Object;
}

export class ServiceFactory implements Factory {
  getNewService (Service: InjectableConstructor): Object {
    const type = Service.useFactory && typeof Service.useFactory === 'function'
      ? FACTORY_TYPES.CUSTOM
      : FACTORY_TYPES.DEFAULT;

    switch (type) {
    case FACTORY_TYPES.CUSTOM:
      return this.custom(Service);
    case FACTORY_TYPES.DEFAULT:
    default:
      return this.default(Service);
    }
  }

  private default (Service: InjectableConstructor): any {
    return new Service();
  }

  private custom (Service: InjectableConstructor): Object {
    const factory = Service.useFactory();

    if (factory) {
      return factory;
    } else {
      assert(false, 'useFactory invalid return');
    }
  }
}
