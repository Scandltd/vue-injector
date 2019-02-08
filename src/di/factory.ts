import { assert } from '../util/warn';
import { InjectableConstructor } from './decorators/injectable';

export enum FACTORY_TYPES {
  NEW = 'NEW',
  FACTORY = 'FACTORY',
  VALUE = 'VALUE'
}

const factoryMap = new Map([
  ['inject:factory', {
    type: FACTORY_TYPES.FACTORY,
    check: 'function'
  }],
  ['inject:value', {
    type: FACTORY_TYPES.VALUE
  }]
]);

interface Factory {
  make (Service: InjectableConstructor): Object;
}

export class ServiceFactory implements Factory {
  type: keyof typeof FACTORY_TYPES = FACTORY_TYPES.NEW;

  make (Service: InjectableConstructor): Object {
    const type = this.getType(Service);

    switch (type) {
    case FACTORY_TYPES.FACTORY:
      return this.factory(Service);
    case FACTORY_TYPES.VALUE:
      return this.value(Service);
    case FACTORY_TYPES.NEW:
    default:
      return this.instance(Service);
    }
  }

  private getType (Service) {
    factoryMap.forEach((factory, name) => {

      const metaData = Reflect.getMetadata(name, Service);

      if (metaData) {
        const { type, check } = factory;

        if (check && typeof metaData !== check) {
          return assert(false, `${String(name)} invalid type: should be ${check}`);
        }
        this.type = type;
      }

    });

    return this.type;
  }

  private instance (Service: InjectableConstructor): any {
    return new Service();
  }

  private factory (Service: InjectableConstructor): Object {
    const factory = (Reflect.getMetadata('inject:factory', Service))();

    if (factory) {
      return factory;
    } else {
      assert(false, 'useFactory invalid return');
    }
  }

  private value (Service: InjectableConstructor): Object {
    const value = Reflect.getMetadata('inject:value', Service);

    if (value) {
      return value;
    } else {
      assert(false, 'invalid useValue');
    }
  }
}
