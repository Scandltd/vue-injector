import Vue, { PluginFunction, PluginObject } from 'vue';

import { install } from './install';
import { assert } from './util/warn';
import { inBrowser } from './util/dom';

import { Injector } from './di/injector';

import { Injectable, InjectableConstructor } from './di/decorators/injectable';
import { Inject } from './di/decorators/inject';

import { ERROR_MESSAGE } from './enums/messages';

export {
  Injectable,
  Inject
};

export type VueInjectorOptions = {
  root?: Array<any>,
  store?: any
};

export class VueInjector implements PluginObject<VueInjectorOptions> {
  static install: PluginFunction<VueInjectorOptions>;
  static version: string;

  injector: Injector | null;

  private app: Vue | null;
  private apps: Array<Vue>;

  private rootServices: Array<InjectableConstructor> = [];

  constructor(options: VueInjectorOptions = {}) {
    this.app = null;
    this.injector = null;
    this.apps = [];

    this.rootServices = options.root || [];

    if (options.store) {
      options.store.$injector = this;
    }
  }

  static get app() {
    return this;
  }

  get install(): PluginFunction<VueInjectorOptions> {
    return VueInjector.install;
  }

  init(app: Vue) {
    if (process.env.NODE_ENV !== 'production') {
      assert(
        (install as any).installed,
        ERROR_MESSAGE.ERROR_003
      );
    }

    this.apps.push(app);

    // main app already initialized.
    if (this.app) {
      return;
    }

    this.app = app;
    this.injector = new Injector(this.app, this.rootServices);
  }

  initComponent(component: Vue) {
    return this.injector && this.injector.registerComponent(component);
  }

  get(Provider: InjectableConstructor) {
    return this.injector && this.injector.get(Provider);
  }
}

VueInjector.install = install;
VueInjector.version = '__VERSION__';

if (inBrowser && window.Vue) {
  window.Vue.use(VueInjector);
}
