import Vue, { Component } from 'vue';

export declare interface InjectableConstructor {
  providers?: { [key: string]: any };

  new (): any;
}

export declare interface InjectInterface {
  readonly isVueService: boolean;
  readonly name: string;

  readonly context: Object;
  readonly vm: Vue;
}

export declare interface Binding {
  binging: Array<Object>;

  bind (binging: Array<Object> | Object): this;
  to (target: InjectedObject): boolean;
}

export declare class Provider {
  app: Vue;
  services: Map<InjectableConstructor, Object>;
  rootProviders: Array<any>;

  constructor (app: Vue, rootProviders: Array<any>);

  registerComponent (component: Vue);
  registerService (name: string, Service: InjectableConstructor): InjectableConstructor;
  bindService (target: InjectedObject, name: string, Service: InjectableConstructor);

  set (Service: any);
  get (Service: any): Object;
}

export declare interface InjectableOptions {
  useFactory?: () => any;
  useValue?: any;
}

export declare type VueInjectorOptions = {
  root?: Array<InjectableConstructor>,
  store?: any
};

export declare class VueInjector {
  static install: (app: Vue) => void;
  static version: string;

  app: Vue | null;
  apps: Array<Vue>;
  provider: Provider | null;
  rootProviders: Array<InjectableConstructor>;

  constructor (options?: VueInjectorOptions);

  init (app: Vue);
  initComponent (component: Vue);
  get (provider: any): Object;
}

export declare function Injectable (options: InjectableOptions): ClassDecorator;
export declare function Inject (service: any): PropertyDecorator;

export declare type InjectedObject = Vue | Component | Object;
