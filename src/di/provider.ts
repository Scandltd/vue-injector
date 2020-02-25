import Vue from 'vue';
import { InjectableConstructor, InjectedObject } from './decorators/injectable';
import { ServiceBinding } from './bindings/binding';
import { ServiceFactory } from './factory/Factory';
import { assert } from '../util/warn';

import { METADATA } from '../enums/metadata';
import { ERROR_MESSAGE } from '../enums/messages';

export class Provider<T = any> {
  static app: Vue;

  private factory: () => any = null;

  constructor(
    public service: InjectableConstructor<T>
  ) {
    this.register();
  }

  get instance(): T {
    return this.factory();
  }

  bindTo(target: InjectedObject, name?: string): boolean {
    return ServiceBinding.bind(target, this.instance, name || this.name);
  }

  private get name(): string {
    return Reflect.getMetadata(METADATA.NAME, this.service);
  }

  private get isService(): boolean {
    return !!Reflect.getMetadata(METADATA.SERVICE, this.service);
  }

  private register(): any {
    if (this.service === Vue) {
      this.factory = () => Provider.app;
    }

    if (!this.factory && this.isService) {
      this.factory = ServiceFactory.make(this.service);
    }

    if (this.factory) {
      return this.factory;
    }

    throw assert(false, ERROR_MESSAGE.ERROR_USE_DECORATOR);
  }
}
