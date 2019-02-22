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

interface Binding {
  bind (strategy: Provider, binging: InjectableConstructor, name: string): this;
  to (target: InjectedObject): boolean;
}

export declare class Provider {
  get (): () => any;
  instance (): any;
}

export declare class Injector {
  app: Vue;
  services: Map<InjectableConstructor, Provider>;
  rootServices: Array<any>;

  constructor (app: Vue, rootProviders: Array<any>);

  registerComponent (component: Vue);
  provide (service: InjectableConstructor, target: InjectedObject, customName?: string): any;

  get (Service: any): any;
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

  constructor (options?: VueInjectorOptions);

  init (app: Vue);
  initComponent (component: Vue);
  get (provider: any): any;
}

export declare function Injectable (options: InjectableOptions): ClassDecorator;
export declare function Inject (service: any): PropertyDecorator;

export declare type InjectedObject = Vue | Component | InjectableConstructor | Object;
