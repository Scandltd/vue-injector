import 'reflect-metadata';
import { assert, warn } from '../../util/warn';

import { ERROR_MESSAGE, message, WARNING_MESSAGE } from '../../enums/messages';
import { FACTORY_TYPES, METADATA } from '../../enums/metadata';

export interface InjectableConstructor {

  providers: { [key: string]: any };

  __decorators__?: Array<Function>;

  new (): any;
}

export interface InjectableOptions {
  useFactory?: () => any;
  useValue?: any;
}

class InjectableFactory {
  private target: InjectableConstructor = null;
  private options: InjectableOptions = {};

  private static get whitelist() {
    return Reflect.ownKeys(FACTORY_TYPES);
  }

  private get decorators() {
    return this.target.__decorators__;
  }

  private get optionKeys() {
    return Reflect.ownKeys(this.options);
  }

  /* checks whether all options given are allowed. Allowed options (useValue, useFactory) */
  private get isOtherProperty(): boolean {
    return !this.optionKeys.every(
      (prop: PropertyKey) => InjectableFactory.whitelist.indexOf(prop) !== -1
    );
  }

  private get isCollisionProps() {
    const props = InjectableFactory.whitelist
      .filter((p) => Reflect.has(this.options, p));

    return props.length > 1;
  }

  private get type() {
    return InjectableFactory.whitelist.find((props) => Reflect.has(this.options, props));
  }

  private get serviceType() {
    if (this.isOtherProperty) {
      this.warnMassage();
    }

    if (this.isCollisionProps) {
      throw InjectableFactory.errorMassage();
    }

    if (this.type) {
      return FACTORY_TYPES[this.type];
    }

    return null;
  }

  private static errorMassage() {
    throw assert(false, message(
      ERROR_MESSAGE.ERROR_001,
      { names: JSON.stringify(InjectableFactory.whitelist) }
    ));
  }

  make(target: InjectableConstructor, options: InjectableOptions = {}) {
    this.target = target;
    this.options = options;

    this.defineMetadata();
    this.createDecorators();

    return this.target;
  }

  private warnMassage() {
    warn(
      false,
      message(WARNING_MESSAGE.WARNING_000, {
        name: this.target.name, options: JSON.stringify(this.options)
      })
    );
  }

  private defineMetadata() {
    if (this.serviceType) {
      Reflect.defineMetadata(METADATA.TYPE, this.serviceType, this.target);
      Reflect.defineMetadata(METADATA.VALUE, this.options[this.serviceType], this.target);
    }

    Reflect.defineMetadata(METADATA.NAME, this.target.name, this.target);
    Reflect.defineMetadata(METADATA.SERVICE, true, this.target);
  }

  private createDecorators() {
    if (this.decorators) {
      this.decorators.forEach((fn) => fn(this.target.prototype));
      delete this.target.__decorators__;
    }
  }
}

export function Injectable(options): any {
  const injectableFactory = new InjectableFactory();

  if (typeof options === 'function') {
    return injectableFactory.make(options);
  }
  return function (target) {
    return injectableFactory.make(target, options);
  };
}
