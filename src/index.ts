import Vue, { PluginFunction, PluginObject } from 'vue';

import { install } from './install';
import { assert } from './util/warn';
import { inBrowser } from './util/dom';

import { Provider } from './di/provider';

import { Injectable, InjectableConstructor } from './di/decorators/injectable';
import { Inject } from './di/decorators/inject';

import { ERROR_MESSAGE } from './enums/messages';

export {
  Injectable,
  Inject
};

export type VueInjectorOptions = {
  root?: Array<InjectableConstructor>,
  store?: any
};

export default class VueInjector implements PluginObject<null> {
  static install: PluginFunction<null>;
  static version: string;

  app: Vue | null;
  apps: Array<Vue>;
  provider: Provider | null;

  rootProviders: Array<InjectableConstructor> = [];

  constructor (options: VueInjectorOptions = {}) {
    this.app = null;
    this.provider = null;
    this.apps = [];

    this.rootProviders = options.root || [];

    if (options.store) {
      options.store.$injector = this;
    }
  }

  get install (): PluginFunction<null> {
    return VueInjector.install;
  }

  init (app: Vue) {
    process.env.NODE_ENV !== 'production' && assert(
        (install as any).installed,
      ERROR_MESSAGE.ERROR_003
    );

    this.apps.push(app);

    // main app already initialized.
    if (this.app) {
      return;
    }

    this.app = app;
    this.provider = new Provider(this.app, this.rootProviders);
  }

  initComponent (component: Vue) {
    this.provider && this.provider.registerComponent(component);
  }

  get (Provider: typeof Inject) {
    return this.provider && this.provider.get(Provider);
  }
}

VueInjector.install = install;
VueInjector.version = '__VERSION__';

if (inBrowser && window.Vue) {
  window.Vue.use(VueInjector);
}
