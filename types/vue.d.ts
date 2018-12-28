/**
 * Augment the typings of Vue.js
 */

import Vue from 'vue';
import VueInjector from '../src/index';
import { Inject } from '../src';

declare module '*.vue' {
  export default Vue;
}

declare module 'vue/types/vue' {
  interface Vue {
    readonly $injector: VueInjector;
    providers: {[key: string]: typeof Inject};
  }
}

declare module 'vue/types/options' {
  interface ComponentOptions<V extends Vue> {
    readonly injector: VueInjector;
    providers?: {[key: string]: typeof Inject};
  }
}

declare global {
  interface Window {
    Vue: typeof Vue;
  }
}

