import { FactoryInterface } from './Factory';
import { InjectableConstructor } from '../decorators/injectable';

export class Instance implements FactoryInterface {
  getFactory<T, R>(Service: InjectableConstructor<T>): () => R {
    const service = new Service();

    return () => service as any as R;
  }
}
