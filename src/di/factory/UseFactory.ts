import { FactoryInterface } from './Factory';
import { InjectableConstructor } from '../decorators/injectable';
import { assert } from '../../util/warn';
import { METADATA } from '../../enums/metadata';
import { ERROR_MESSAGE, message } from '../../enums/messages';

export class UseFactory implements FactoryInterface {
  getFactory (Service: InjectableConstructor): () => any {
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
}
