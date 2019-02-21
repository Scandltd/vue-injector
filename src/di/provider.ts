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

  private serviceBinding: ServiceBinding = new ServiceBinding();
  private serviceFactory: ServiceFactory = new ServiceFactory();

  constructor (
    private app: Vue,
    private services: Map<InjectableConstructor, any>,

    public target: InjectedObject,
    public service: InjectableConstructor,
    public customName?: string
  ) {
    this.binding();
  }

  get instance () {
    if (this.factory) {
      return this.strategy.getService(this.factory);
    }

    return null;
  }

  private get factory (): any {
    return this.services.get(this.service);
  }

  private set factory (instance: any) {
    this.services.set(this.service, instance);
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
    if (this.service.name === $VUE) {
      this.factory = this.app;
    }

    if (!this.factory && this.isService) {
      this.factory = this.serviceFactory.make(this.service);
    }

    if (this.factory) {
      return this.factory;
    }

    throw assert(false, ERROR_MESSAGE.ERROR_005);
  }

  private binding (): any {
    const bind = this.register() && this.serviceBinding.bind(this.strategy, this.factory, this.name);

    return this.target ? bind.to(this.target) : bind.get();
  }
}
