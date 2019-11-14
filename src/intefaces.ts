import Vue, { Component } from 'vue';

export interface InjectableOptions {
  useFactory?: () => any;
  useValue?: any;
}

export type VueInjectorOptions = {
  root?: Array<any>,
  store?: any
}

export interface InjectableConstructor {
  providers?: { [key: string]: any };

  new (): any;
}

export interface InjectInterface {
  readonly isVueService: boolean;
  readonly name: string;

  readonly context: Object;
  readonly vm: Vue;
}

export declare type InjectedObject = Vue | Component | InjectableConstructor | Object;
