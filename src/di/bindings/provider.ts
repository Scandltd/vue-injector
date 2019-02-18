import { InjectableConstructor } from '../decorators/injectable';

export interface Provider {
  getService (service: InjectableConstructor | Function): any;
}
