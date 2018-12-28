import Vue, { Component } from 'vue';

export declare interface InjectConstructor {
  new (root: Vue): InjectInterface;
}

export declare interface InjectInterface {
  readonly isVueService: boolean;
  readonly name: string;

  readonly context: Object;
  readonly vm: Vue;

  import: { [key: string]: any };
}

export declare class Inject implements InjectInterface {
  readonly isVueService: boolean;
  readonly name: string;
  readonly vm: Vue;
  readonly context: Object;

  import: { [key: string]: typeof Inject };

  static getName (): string;
}

export declare class Provider {
  app: Vue;
  services: WeakMap<InjectConstructor, Inject>;
  rootProviders: Array<typeof Inject>;

  constructor (app: Vue, rootProviders: Array<typeof Inject>);

  registerComponent (component: Vue);
  registerService (target: InjectedObject, name: string, Service: InjectConstructor): Inject;

  set (Service: typeof Inject);
  get (Service: typeof Inject): Inject;
}

export declare class VueInjector {
  static install: (app: Vue) => void;
  static version: string;

  app: Vue | null;
  apps: Array<Vue>;
  provider: Provider | null;
  rootProviders: Array<InjectConstructor>;

  init (app: Vue);
  initComponent (component: Vue);
  get (provider: typeof Inject): Inject;
}

export declare function Service (options: typeof Inject): PropertyDecorator;

export declare type InjectedObject = Vue | Component | Inject;
