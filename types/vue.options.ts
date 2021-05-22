import Vue from 'vue';
import { VueInjector } from '../src/index';
import { InjectableConstructor } from '../src/di/decorators/injectable';

declare module 'vue/types/vue' {
  interface Vue {
    readonly $injector: VueInjector;
    $injectorInstalled: boolean;
    providers: { [key: string]: InjectableConstructor };
  }
  interface VueConstructor {
    $injectorInstalled: boolean;
  }
}

declare module 'vue/types/options' {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
  interface ComponentOptions<V extends Vue> {
    readonly injector?: VueInjector;
    providers?: { [key: string]: InjectableConstructor };
  }
}
