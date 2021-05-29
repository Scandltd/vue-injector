import { VueInjector } from '../src/index';
import { InjectableConstructor } from '../src/di/decorators/injectable';

declare module '@vue/runtime-core' {
  export interface ComponentCustomProperties {
    readonly $injector: VueInjector;
    providers: { [key: string]: InjectableConstructor };
  }
}
