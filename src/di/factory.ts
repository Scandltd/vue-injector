import { assert } from '../util/warn';
import { InjectableConstructor } from './decorators/injectable';
import { ERROR_MESSAGE } from '../enums/messages';

export enum FACTORY_TYPES {
  useFactory = 'inject:factory',
  useValue = 'inject:value'
}

interface Factory {
  make (Service: InjectableConstructor): Object;
}

export class ServiceFactory implements Factory {
  type: FACTORY_TYPES = null;

  make (Service: InjectableConstructor): Object {
    const type = this.getType(Service);

    switch (type) {
    case FACTORY_TYPES.useFactory:
      return this.factory(Service);
    case FACTORY_TYPES.useValue:
      return this.value(Service);
    default:
      return this.instance(Service);
    }
  }

  private getType (Service): FACTORY_TYPES {
    Reflect.ownKeys(FACTORY_TYPES).forEach((property) => {

      const metadataName = FACTORY_TYPES[property];
      const metaData = Reflect.getMetadata(metadataName, Service);

      if (metaData) {
        /*if (check && typeof metaData !== check) {
          return assert(false, `${String(name)} invalid type: should be ${check}`);
        }*/
        this.type = metadataName;
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
      assert(false, ERROR_MESSAGE.ERROR_006);
    }
  }

  private value (Service: InjectableConstructor): Object {
    const value = Reflect.getMetadata('inject:value', Service);

    if (value) {
      return value;
    } else {
      assert(false, ERROR_MESSAGE.ERROR_007);
    }
  }
}
