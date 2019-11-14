import { InjectedObject } from '../intefaces';
import { InjectableConstructor } from './decorators/injectable';
import { ServiceBinding } from './bindings/binding';
import { ServiceFactory } from './factory/Factory';
import { assert } from '../util/warn';

import { METADATA } from '../enums/metadata';
import { ERROR_MESSAGE } from '../enums/messages';
import { Injector } from './injector';

const $VUE = 'Vue';

export class Provider {
  private $factory: () => any = null;

  constructor(
    public service: InjectableConstructor
  ) {
    this.register();
  }

  instance(): any {
    return this.$factory();
  }

  bindTo(target: InjectedObject, name?: string): (() => any) | boolean {
    if (!target) {
      return this.factory;
    }

    return ServiceBinding.bind(target, this.$factory(), name || this.name);
  }

  private set factory(factory: () => any) {
    this.$factory = factory;
  }

  private get factory(): () => any {
    return this.$factory;
  }

  private get name(): string {
    return Reflect.getMetadata(METADATA.NAME, this.service);
  }

  private get isService(): boolean {
    return Reflect.getMetadata(METADATA.SERVICE, this.service);
  }

  private register(): any {
    if (this.service.name === $VUE) {
      this.factory = () => Injector.app;
    }

    if (!this.factory && this.isService) {
      this.factory = ServiceFactory.make(this.service);
    }

    if (this.factory) {
      return this.factory;
    }

    throw assert(false, ERROR_MESSAGE.ERROR_005);
  }
}
