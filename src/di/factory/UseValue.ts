import { FactoryInterface } from './Factory';
import { InjectableConstructor } from '../decorators/injectable';
import { assert } from '../../util/warn';
import { METADATA } from '../../enums/metadata';
import { ERROR_MESSAGE } from '../../enums/messages';

export class UseValue implements FactoryInterface {
  getFactory(Service: InjectableConstructor): () => any {
    const value = Reflect.getMetadata(METADATA.VALUE, Service);

    if (value) {
      return () => value;
    }
    throw assert(false, ERROR_MESSAGE.ERROR_007);
  }
}
