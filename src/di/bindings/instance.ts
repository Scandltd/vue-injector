import { Provider } from './provider';
import { InjectableConstructor } from '../decorators/injectable';

export class Instance implements Provider {
  getService (service: InjectableConstructor) {
    return service;
  }
}
