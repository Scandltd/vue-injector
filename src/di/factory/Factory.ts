import { InjectableConstructor } from '../decorators/injectable';
import { FACTORY_TYPES, METADATA } from '../../enums/metadata';
import { UseFactory } from './UseFactory';
import { UseValue } from './UseValue';
import { Instance } from './Instance';

export interface FactoryInterface {
  getFactory<T, R>(Service: InjectableConstructor<T>): () => R;
}

export class ServiceFactory {
  static make<T, R>(Service: InjectableConstructor<T>): () => R {
    const factoryName = Reflect.getMetadata(METADATA.TYPE, Service);
    const factory = ServiceFactory.getFactoryByName(factoryName);

    return factory.getFactory<T, R>(Service);
  }

  private static getFactoryByName(name: FACTORY_TYPES) {
    switch (name) {
      case FACTORY_TYPES.useFactory:
        return new UseFactory();
      case FACTORY_TYPES.useValue:
        return new UseValue();
      default:
        return new Instance();
    }
  }
}
