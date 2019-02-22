import Vue from 'vue';
import { InjectedObject } from '../../types';
import { InjectableConstructor } from './decorators/injectable';
import { Factory } from './bindings/factory';
import { Instance } from './bindings/instance';
import { ServiceBinding } from './bindings/binding';
import { ServiceFactory } from './factory';
import { assert } from '../util/warn';

import { FACTORY_TYPES, METADATA } from '../enums/metadata';
import { ERROR_MESSAGE } from '../enums/messages';

const $VUE = 'Vue';

export class Provider {

  private $factory: () => any = null;
  private $instance: any = null;

  private serviceBinding: ServiceBinding = new ServiceBinding();
  private serviceFactory: ServiceFactory = new ServiceFactory();

  constructor (
    public target: InjectedObject,
    public service: InjectableConstructor,
    public customName?: string
  ) {
    this.binding();
  }

  get () {
    return this.$factory;
  }

  instance () {
    return this.$instance;
  }

  private set factory (factory: () => any) {
    this.$instance = factory();
    this.$factory = factory;
  }

  private get factory (): () => any {
    return this.$factory;
  }

  private get strategy () {
    return this.getStrategy();
  }

  private get name (): string {
    return this.customName || Reflect.getMetadata(METADATA.NAME, this.service);
  }

  private get type (): string {
    return Reflect.getMetadata(METADATA.TYPE, this.service);
  }

  private get isService (): boolean {
    return Reflect.getMetadata(METADATA.SERVICE, this.service);
  }

  private getStrategy () {
    switch (this.type) {
      case FACTORY_TYPES.useFactory:
        return new Factory();
      default:
        return new Instance();
    }
  }

  private register (): any {
    if (this.isService || this.service.name === $VUE) {
      this.factory = this.serviceFactory.make(this.service);
    }

    if (this.factory) {
      return this.factory;
    }

    throw assert(false, ERROR_MESSAGE.ERROR_005);
  }

  private binding (): any {
    this.register();

    if (!this.target) {
      return this.factory;
    }

    return this.serviceBinding.bind(this.strategy, this.$instance, this.name).to(this.target);
  }
}
