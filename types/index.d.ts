import Vue, { Component } from 'vue';
import { Inject } from '../src';
import VueInjector from '../src/index';

declare module 'vue/types/vue' {
  interface Vue {
    readonly $injector: VueInjector;
    readonly providers: {[key: string]: typeof Inject};
  }
}

declare module 'vue/types/options' {
  interface ComponentOptions<V extends Vue> {
    readonly injector: VueInjector;
    readonly providers?: {[key: string]: typeof Inject};
  }
}

declare global {
  interface Window {
    Vue: typeof Vue;
  }
}


declare type InjectedObject = Vue | Component | Inject;
