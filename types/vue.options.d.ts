import Vue from 'vue';
import { VueInjector } from '../src/index';
import { InjectableConstructor } from '../src/di/decorators/injectable';
declare module 'vue/types/vue' {
    interface Vue {
        readonly $injector: VueInjector;
        $injectorInstalled: boolean;
        providers: {
            [key: string]: InjectableConstructor;
        };
    }
    interface VueConstructor<V extends Vue> {
        $injectorInstalled: boolean;
    }
}
declare module 'vue/types/options' {
    interface ComponentOptions<V extends Vue> {
        readonly injector?: VueInjector;
        providers?: {
            [key: string]: InjectableConstructor;
        };
    }
}
