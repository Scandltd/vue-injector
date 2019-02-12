import { assert, warn } from '../../util/warn';
import 'reflect-metadata';
import { ERROR_MESSAGE, message, WARNING_MESSAGE } from '../../enums/messages';
import { FACTORY_TYPES } from '../factory';
import { METADATA } from '../../enums/metadata';

export interface InjectableConstructor {

  providers: { [key: string]: any };

  __decorators__?: Array<Function>;

  new (): any;
}

export interface InjectableOptions {
  useFactory?: () => any;
  useValue?: any;
}

function injectableFactory (target: InjectableConstructor, options: InjectableOptions = {}) {
  const optionKeys = Reflect.ownKeys(options);
  const whitelist = Reflect.ownKeys(FACTORY_TYPES);

  const checkOtherProperty = !optionKeys.every((prop: PropertyKey) => {
    return !!~whitelist.indexOf(prop);
  });

  if (checkOtherProperty) {
    let msg = message(WARNING_MESSAGE.WARNING_000, { name: target.name, options: JSON.stringify(options) });
    warn(false, msg);
  }

  if (Reflect.has(options, 'useFactory') && Reflect.has(options, 'useValue')) {
    return assert(false, ERROR_MESSAGE.ERROR_001);
  }

  Reflect.defineMetadata(METADATA.FACTORY, options.useFactory, target);
  Reflect.defineMetadata(METADATA.VALUE, options.useValue, target);
  Reflect.defineMetadata(METADATA.NAME, target.name, target);
  Reflect.defineMetadata(METADATA.SERVICE, true, target);

  const decorators = target.__decorators__;


  if (decorators) {
    decorators.forEach(function (fn) { return fn(target.prototype); });
    delete target.__decorators__;
  }

  return target;
}

export function Injectable (options): any {
  if (typeof options === 'function') {
    return injectableFactory(options);
  }
  return function (target) {
    return injectableFactory(target, options);
  };
}
