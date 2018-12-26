import { install } from './install';
import { assert } from './util/warn';
import { inBrowser } from './util/dom';

import { Provider } from './di/provider';

import { Injectable } from './di/injectable';
import { Inject } from './di/inject';
import { Service } from './di/service';
import Vue, { Component } from 'vue';
import { InjectableClass } from '../types';

export {
  Injectable,
  Inject,
  Service
};

export default class VueInjector {
  static install: (app: Vue) => void;
  static version: string;

  app: Vue | null;
  apps: Array<Vue>;
  provider: Provider | null;

  rootProviders: Array<typeof InjectableClass> = [];

  constructor (...args) {
    this.app = null;
    this.provider = null;
    this.apps = [];

    this.rootProviders = args;
  }

  init (app: Vue) {
    process.env.NODE_ENV !== 'production' && assert(
        (install as any).installed,
      `not installed. Make sure to call \`Vue.use(VueInjector)\` ` +
      `before creating root instance.`
    );

    this.apps.push(app);

    // main app already initialized.
    if (this.app) {
      return;
    }

    this.app = app;
    this.provider = new Provider(this.app, this.rootProviders);
  }

  initComponent (component: Component) {
    this.provider && this.provider.registerComponent(component);
  }

  get (Provider: typeof InjectableClass) {
    return this.provider && this.provider.get(Provider);
  }
}

VueInjector.install = install;
VueInjector.version = '__VERSION__';

if (inBrowser && window.Vue) {
  window.Vue.use<VueInjector>(VueInjector as any);
}
