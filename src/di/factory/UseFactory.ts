import { FactoryInterface } from './Factory';
import { InjectableConstructor } from '../decorators/injectable';
import { assert } from '../../util/warn';
import { METADATA } from '../../enums/metadata';
import { ERROR_MESSAGE, message } from '../../enums/messages';

export class UseFactory implements FactoryInterface {
  getFactory<T, R>(Service: InjectableConstructor<T>): () => R {
    const name = Reflect.getMetadata(METADATA.NAME, Service);
    const factory = Reflect.getMetadata(METADATA.VALUE, Service);

    if (factory && typeof factory !== 'function') {
      throw assert(false, message(ERROR_MESSAGE.ERROR_USE_FACTORY_TYPE, { name }));
    }

    const result = factory();

    if (!result) {
      throw assert(false, ERROR_MESSAGE.ERROR_USE_FACTORY_RETURN);
    }

    return () => result;
  }
}
