import Vue from 'vue';
import { Inject, VueInjector } from '../src/index';

declare module 'vue/types/vue' {
  interface Vue {
    readonly $injector: VueInjector;
    providers: {[key: string]: typeof Inject};
    _providers;
  }
}

declare module 'vue/types/options' {
  interface ComponentOptions<V extends Vue> {
    readonly injector?: VueInjector;
    providers?: {[key: string]: typeof Inject};
    _providers?;
  }
}

declare global {
  interface Window {
    Vue: typeof Vue;
  }
}
