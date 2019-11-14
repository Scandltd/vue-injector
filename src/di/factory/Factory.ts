import { InjectableConstructor } from '../decorators/injectable';
import { FACTORY_TYPES, METADATA } from '../../enums/metadata';
import { UseFactory } from './UseFactory';
import { UseValue } from './UseValue';
import { Instance } from './Instance';


export interface FactoryInterface {
  getFactory (Service: InjectableConstructor): () => any;
}

export class ServiceFactory {
  static make(Service: InjectableConstructor): () => any {
    const factoryName = Reflect.getMetadata(METADATA.TYPE, Service);
    const factory = ServiceFactory.getFactoryByName(factoryName);

    return factory.getFactory(Service);
  }

  private static getFactoryByName(name: keyof typeof FACTORY_TYPES) {
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
