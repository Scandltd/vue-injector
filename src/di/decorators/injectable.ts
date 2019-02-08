import { warn } from '../../util/warn';
import 'reflect-metadata';

enum TYPES {
  useFactory,
  useValue
}

const factoryMap = new Map([
  ['useFactory', {
    metaName: 'inject:factory'
  }],
  ['useValue', {
    metaName: 'inject:value'
  }]
]);

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

  if (Object.keys(options).length) {
    warn(Object.keys(options).length === 1, `Wrong service registration. Service name: ${target.name}. @injectable can take only one parameter eather useFactory or useValue`);
    let diff = Object.keys(options).filter(function (i) {
      return Object.keys(TYPES).indexOf(i) < 0;
    });
    warn(!diff.length, `Wrong service registration. ${diff} - such parameters can't be used Service name: ${target.name}. @injectable can take only one parameter eather useFactory or useValue`);

    let type = Object.keys(options)[0];

    factoryMap.get(type) !== undefined && Reflect.defineMetadata(factoryMap.get(type).metaName, options[type], target);
  }

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

export function InjectableMy (options): any {
}
