import Vue from 'vue';

import { assert, warn } from '../../util/warn';
import { ERROR_MESSAGE, message, WARNING_MESSAGE } from '../../enums/messages';
import { FACTORY_TYPES, METADATA } from '../../enums/metadata';

export type InjectableConstructor<T = any> = {
  __decorators__?: Array<Function>;
  providers?: { [key: string]: InjectableConstructor };
  new (): T;
}

export interface InjectableOptions {
  useFactory?: () => any;
  useValue?: any;
}

export type InjectedObject = Vue | InjectableConstructor | any;

class InjectableFactory {
  private static get whitelist() {
    return Reflect.ownKeys(FACTORY_TYPES);
  }

  private static getOptionKeys(options: InjectableOptions): PropertyKey[] {
    return Reflect.ownKeys(options);
  }

  /* checks whether all options given are allowed. Allowed options (useValue, useFactory) */
  private static isOtherProperty(options: InjectableOptions): boolean {
    return !InjectableFactory.getOptionKeys(options).every(
      (prop: PropertyKey) => InjectableFactory.whitelist.indexOf(String(prop)) !== -1
    );
  }

  private static isCollisionProps(options: InjectableOptions) {
    const props = InjectableFactory.whitelist
      .filter((p) => Reflect.has(options, p));

    return props.length > 1;
  }

  private static getType(options: InjectableOptions) {
    return InjectableFactory.whitelist.find((props) => Reflect.has(options, props));
  }

  private static getServiceType(target: InjectableConstructor, options: InjectableOptions) {
    if (InjectableFactory.isOtherProperty(options)) {
      InjectableFactory.warnMassage(target, options);
    }

    if (InjectableFactory.isCollisionProps(options)) {
      throw InjectableFactory.errorMassage();
    }

    if (InjectableFactory.getType(options)) {
      return FACTORY_TYPES[InjectableFactory.getType(options)];
    }

    return null;
  }

  private static errorMassage() {
    throw assert(false, message(
      ERROR_MESSAGE.ERROR_INJECTABLE_OPTIONS_CONFLICT,
      { names: JSON.stringify(InjectableFactory.whitelist) }
    ));
  }

  private static warnMassage(target: InjectableConstructor, options: InjectableOptions) {
    warn(
      false,
      message(WARNING_MESSAGE.WARNING_000, {
        name: target.name, options: JSON.stringify(options)
      })
    );
  }

  static make(
    target: InjectableConstructor,
    options: InjectableOptions = {}
  ): InjectableConstructor {
    this.defineMetadata(target, options);
    this.createDecorators(target);

    return target;
  }

  private static defineMetadata(target: InjectableConstructor, options: InjectableOptions) {
    const serviceType = InjectableFactory.getServiceType(target, options);

    if (serviceType) {
      Reflect.defineMetadata(METADATA.TYPE, serviceType, target);
      Reflect.defineMetadata(METADATA.VALUE, options[serviceType], target);
    }

    Reflect.defineMetadata(METADATA.NAME, target.name, target);
    Reflect.defineMetadata(METADATA.SERVICE, true, target);
  }

  private static createDecorators(target: InjectableConstructor) {
    if (target.__decorators__) {
      target.__decorators__.forEach((fn) => fn(target.prototype));
      delete target.__decorators__;
    }
  }
}

export interface Injectable extends InjectableOptions {}

export function Injectable(target: InjectableConstructor): any
export function Injectable(options: InjectableOptions): any
export function Injectable(options: InjectableOptions | InjectableConstructor): any {
  if (typeof options === 'function') {
    return InjectableFactory.make(options);
  }

  return (target) => InjectableFactory.make(target, options);
}
