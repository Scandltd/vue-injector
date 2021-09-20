import { createDecorator } from '../../util/decorator';
import { METADATA } from '../../enums/metadata';
import { ERROR_MESSAGE } from '../../enums/messages';
import { assert } from '../../util/warn';
import { InjectableConstructor, InjectedObject } from './injectable';

function decoratorFactory(service: any): any {
  return createDecorator((target: any, keyProp: string) => {
    (target.providers || (target.providers = {}))[keyProp] = service;
  });
}

export interface Inject {
  service?: InjectableConstructor;
}

export function Inject(target: InjectableConstructor): any
export function Inject(target: InjectedObject, key: string): any
export function Inject(target: InjectableConstructor | InjectedObject, key?: string): any {
  if (typeof target === 'function' || key === undefined) {
    return decoratorFactory(target);
  }

  const service = Reflect.getMetadata(METADATA.TS_TYPE, target, key);

  if (service === undefined) {
    throw assert(false, ERROR_MESSAGE.ERROR_EMTY_INJECT_PARAMS);
  }

  decoratorFactory(service)(target, key);
}
