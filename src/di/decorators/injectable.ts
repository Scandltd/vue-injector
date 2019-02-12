import { assert, warn } from '../../util/warn';
import 'reflect-metadata';
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

function injectableFactory (target: InjectableConstructor, options: InjectableOptions = {}) {

  function getServiceType (options) {

    const optionKeys = Reflect.ownKeys(options);
    const whitelist = Reflect.ownKeys(FACTORY_TYPES);

    // checks whether all options given are allowed. Allowed options (useValue, useFactory)
    const checkOtherProperty = !optionKeys.every((prop: PropertyKey) => {
      return !!~whitelist.indexOf(prop);
    });

    if (checkOtherProperty) {
      let msg = message(WARNING_MESSAGE.WARNING_000, { name: target.name, options: JSON.stringify(options) });
      warn(false, msg);
    }

    const findProps = whitelist.filter(props => Reflect.has(options, props));

    if (findProps.length > 1) {
      throw assert(false, message(
        ERROR_MESSAGE.ERROR_001,
        { names: JSON.stringify(whitelist) }
        )
      );
    }

    const type = whitelist.find(props => Reflect.has(options, props));

    if (type) {
      return FACTORY_TYPES[type];
    }

    return null;
  }

  let serviceType = getServiceType(options);

  if (serviceType) {
    Reflect.defineMetadata(METADATA.TYPE, serviceType, target);
    Reflect.defineMetadata(METADATA.VALUE, options[serviceType], target);
  }

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
