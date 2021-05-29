import { App, Component } from 'vue';
import { Injector } from './di/injector';
import { InjectableConstructor } from './di/decorators/injectable';
import { VueInjectorOptions } from './index';

export interface VueInjectorInternalOptions extends VueInjectorOptions{
  app: App;
}

export class VueInjector {
  static version: string;

  injector: Injector;

  private app: App;

  private readonly rootServices: Array<InjectableConstructor> = [];

  constructor({ app, root, store }: VueInjectorInternalOptions) {
    this.rootServices = root || [];

    if (store) {
      store.$injector = this;
    }

    this.init(app);
  }

  static get app() {
    return this;
  }

  private init(app: App) {
    if (this.app) {
      return;
    }

    this.app = app;
    this.injector = new Injector(this.app, this.rootServices);
  }

  initComponent(component: Component) {
    return this.injector && this.injector.registerComponent(component);
  }

  get<T>(Provider: InjectableConstructor<T>): T {
    return this.injector && this.injector.get(Provider);
  }
}

VueInjector.version = '__VERSION__';
