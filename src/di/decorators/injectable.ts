import { assert, warn } from '../../util/warn';
import 'reflect-metadata';
import { FACTORY_TYPES } from '../factory';

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
    warn(false, `Wrong service registration. Service name: ${target.name}.
@injectable can take only one parameter eather useFactory or useValue, but got ${JSON.stringify(options)}`);
  }

  if (Reflect.has(options, 'useFactory') && Reflect.has(options, 'useValue')) {
    return assert(false, `@injectable can take only one parameter eather useFactory or useValue`);
  }

  Reflect.defineMetadata('inject:factory', options.useFactory, target);
  Reflect.defineMetadata('inject:value', options.useValue, target);
  Reflect.defineMetadata('inject:name', target.name, target);
  Reflect.defineMetadata('inject:service', true, target);

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
