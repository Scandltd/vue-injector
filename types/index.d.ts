import Vue, { Component } from "vue";

export declare class Inject {
    readonly isVueService: boolean;
    readonly name: string;
    readonly vm: Vue;
}

export declare interface InjectableClass extends Inject {
    new (context: Vue): Inject;
}

export type InjectClass<I> = { new (...args: any[]): I & Inject } & typeof Inject

export declare function Injectable <I extends Inject>(options: any): <IC extends InjectClass<I>>(target: IC) => Inject
export declare function Injectable <IC extends InjectClass<Inject>>(target: IC): Inject

export function Service(service: typeof Inject): PropertyDecorator

export declare class Provider {
    app: Vue;
    services: Map<typeof Inject, Inject>;

    registerComponent (component: Component): void;
    registerService (component: Component, name: string, Provider: InjectableClass): Inject;
}

export default class VueInjector {
    static install: () => void;
    static version: string;

    app: Vue | null;
    apps: Array<Vue>;
    provider: Provider | null;

    init(app: Vue): void;
    initComponent(component: Component): void
    get(servise: typeof Inject): Inject | null
}
