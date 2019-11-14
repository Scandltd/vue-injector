import { FactoryInterface } from './Factory';
import { InjectableConstructor } from '../decorators/injectable';

export class Instance implements FactoryInterface {
  getFactory(Service: InjectableConstructor): () => any {
    const service = new Service();

    return () => service;
  }
}
