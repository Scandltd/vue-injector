import { assert } from '../util/warn';
import { InjectableConstructor } from './decorators/injectable';

export enum FACTORY_TYPES {
  NEW = 'NEW',
  FACTORY = 'FACTORY',
  VALUE = 'VALUE'
}

export const FACTORY_MAP = {
  useFactory: {
    type: FACTORY_TYPES.FACTORY,
    check: 'function'
  },
  useValue: {
    type: FACTORY_TYPES.VALUE
  }
};

interface Factory {
  make (Service: InjectableConstructor): Object;
}

export class ServiceFactory implements Factory {
  type: keyof typeof FACTORY_TYPES = FACTORY_TYPES.NEW;

  make (Service: InjectableConstructor): Object {
    const type = this.getType(Service);

    switch (type) {
    case FACTORY_TYPES.FACTORY:
      return this.custom(Service);
    case FACTORY_TYPES.NEW:
    default:
      return this.default(Service);
    }
  }

  private getType (Service) {
    Object.keys(FACTORY_MAP).forEach(name => {
      if (Object.hasOwnProperty.call(Service, name) && Service[name]) {
        this.type = FACTORY_MAP[name].type;

        if (FACTORY_MAP[name].check && typeof Service[name] !== FACTORY_MAP[name].check) {
          return assert(false, `${name} invalid type: should be ${FACTORY_MAP[name].check}`);
        }
      }
    });

    return this.type;
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
