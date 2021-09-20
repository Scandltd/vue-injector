import { VueInjector } from '../src/index';
import { InjectableConstructor } from '../src/di/decorators/injectable';
declare module '@vue/runtime-core' {
    interface ComponentCustomProperties {
        $setupInjector?: () => void;
        readonly $injector: VueInjector;
        providers: {
            [key: string]: InjectableConstructor;
        };
    }
}
