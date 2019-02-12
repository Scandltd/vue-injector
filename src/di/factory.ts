import { assert } from '../util/warn';
import { InjectableConstructor } from './decorators/injectable';
import { ERROR_MESSAGE, message } from '../enums/messages';
import { FACTORY_TYPES, METADATA } from '../enums/metadata';


interface Factory {
  make (Service: InjectableConstructor): Object;
}

export class ServiceFactory implements Factory {
  type;
  make (Service: InjectableConstructor): Object {
    const type = Reflect.getMetadata(METADATA.TYPE, Service);

    switch (type) {
    case FACTORY_TYPES.useFactory:
      return this.factory(Service);
    case FACTORY_TYPES.useValue:
      return this.value(Service);
    default:
      return this.instance(Service);
    }
  }

  private instance (Service: InjectableConstructor): any {
    return new Service();
  }

  private factory (Service: InjectableConstructor): Object {
    const name = Reflect.getMetadata(METADATA.NAME, Service);
    const factory = Reflect.getMetadata(METADATA.VALUE, Service);

    if (factory && typeof factory !== 'function') {
      throw assert(false, message(ERROR_MESSAGE.ERROR_008, { name }));
    }

    const result = factory();

    if (result) {
      return result;
    } else {
      assert(false, ERROR_MESSAGE.ERROR_006);
    }
  }

  private value (Service: InjectableConstructor): Object {
    const value = Reflect.getMetadata(METADATA.VALUE, Service);

    if (value) {
      return value;
    } else {
      assert(false, ERROR_MESSAGE.ERROR_007);
    }
  }
}
