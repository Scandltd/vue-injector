import { assert } from '../util/warn';
import { InjectableConstructor } from './decorators/injectable';
import { ERROR_MESSAGE, message } from '../enums/messages';
import { METADATA } from '../enums/metadata';


interface Factory {
  make (Service: InjectableConstructor): Object;
}

export class ServiceFactory implements Factory {
  make (Service: InjectableConstructor): () => any {
    const method = Reflect.getMetadata(METADATA.TYPE, Service);

    if (method) {
      if (typeof this[method] !== 'function') {
        throw assert(false, message(ERROR_MESSAGE.ERROR_009, { method }));
      }

      return this[method](Service);
    } else {
      return this.instance(Service);
    }
  }

  private instance (Service: InjectableConstructor): () => any {
    const service = new Service();

    return () => service;
  }

  private useFactory (Service: InjectableConstructor): () => any {
    const name = Reflect.getMetadata(METADATA.NAME, Service);
    const factory = Reflect.getMetadata(METADATA.VALUE, Service);

    if (factory && typeof factory !== 'function') {
      throw assert(false, message(ERROR_MESSAGE.ERROR_008, { name }));
    }

    return () => {
      const result = factory();

      if (!result) {
        throw assert(false, ERROR_MESSAGE.ERROR_006);
      }

      return result;
    };
  }

  private useValue (Service: InjectableConstructor): () => any {
    const value = Reflect.getMetadata(METADATA.VALUE, Service);

    if (value) {
      return () => value;
    } else {
      throw assert(false, ERROR_MESSAGE.ERROR_007);
    }
  }
}
