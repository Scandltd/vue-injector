import { assert } from '../util/warn';
import { Inject } from '@scandltd/vue-injector';
import { InjectConstructor } from './inject';

export enum FACTORY_TYPES {
  DEFAULT = 'NEW',
  CUSTOM = 'FACTORY'
}

interface Factory {
  getNewService (Service: InjectConstructor): Inject | Object;
}

export class ServiceFactory implements Factory {
  getNewService (Service: InjectConstructor): Inject | Object {
    const type = Service.useFactory && typeof Service.useFactory === 'function'
      ? FACTORY_TYPES.CUSTOM
      : FACTORY_TYPES.DEFAULT;

    switch (type) {
    case FACTORY_TYPES.CUSTOM:
      return this.custom(Service);
    case FACTORY_TYPES.DEFAULT:
    default:
      return this.default(Service);
    }
  }

  private default (Service: InjectConstructor): Inject {
    return new Service();
  }

  private custom (Service: InjectConstructor): Object {
    const vue = Service.prototype.vm;
    const importNames = Service.import ? Object.keys(Service.import) : [];

    const imports = {};

    importNames.forEach(name => imports[name] = Service[name]);

    const factory = Service.useFactory(vue, imports);

    if (factory) {
      return factory;
    } else {
      assert(false, 'useFactory invalid return');
    }
  }
}
