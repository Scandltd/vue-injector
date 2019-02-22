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

export declare class Provider {
  instance (): any;
  bindTo (target: InjectedObject, name?: string): (() => any) | boolean;
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
  root?: Array<any>,
  store?: any
};

export declare class VueInjector {
  static install: (app: Vue) => void;
  static version: string;

  injector: Injector | null;

  constructor (options?: VueInjectorOptions);

  init (app: Vue);
  initComponent (component: Vue);
  get (provider: any): any;
}

export declare function Injectable (options: InjectableOptions): ClassDecorator;
export declare function Inject (service: any): PropertyDecorator;

export declare type InjectedObject = Vue | Component | InjectableConstructor | Object;
