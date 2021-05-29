import '../types/vue.options';

import { App } from 'vue';

import { Injectable } from './di/decorators/injectable';
import { Inject } from './di/decorators/inject';
import { VueInjector } from './VueInjector';

interface VueInjectorOptions {
  root?: Array<any>;
  store?: any;
}

export {
  VueInjector,
  VueInjectorOptions,
  Injectable,
  Inject
};

const isDef = (v) => v !== undefined;

export default {
  install: (app: App, options: VueInjectorOptions) => {
    app.config.globalProperties.$injector = new VueInjector({
      ...options,
      app
    });

    app.mixin({
      beforeCreate() {
        if (isDef(this.$options.providers)) {
          this.providers = this.$options.providers;
        }

        if (typeof this?.$injector?.initComponent === 'function') {
          this.$injector.initComponent(this);
        }
      }
    });
  }
};
